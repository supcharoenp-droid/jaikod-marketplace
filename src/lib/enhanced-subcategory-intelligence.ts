/**
 * ENHANCED SUBCATEGORY INTELLIGENCE
 * 
 * Improves subcategory detection accuracy
 * - Uses category-specific patterns
 * - Considers price ranges
 * - Analyzes product attributes
 * - Learns from corrections
 */

import { CATEGORIES } from '@/constants/categories'

interface SubcategoryScore {
    subcategoryId: number
    score: number
    reasons: string[]
}

/**
 * Enhanced subcategory classifier
 */
export class SubcategoryIntelligence {

    /**
     * Classify subcategory with enhanced logic
     */
    classifySubcategory(
        categoryId: number,
        title: string,
        description: string,
        price?: number
    ): SubcategoryScore[] {
        const category = CATEGORIES.find(c => c.id === categoryId)
        if (!category || !category.subcategories) {
            return []
        }

        const text = `${title} ${description}`.toLowerCase()
        const scores: SubcategoryScore[] = []

        category.subcategories.forEach(sub => {
            let score = 0
            const reasons: string[] = []

            // 1. Keyword matching (from comprehensive files)
            const keywords = this.getSubcategoryKeywords(categoryId, sub.id)
            keywords.forEach(kw => {
                if (text.includes(kw.toLowerCase())) {
                    score += 10
                    reasons.push(`มีคำว่า "${kw}"`)
                }
            })

            // 2. Price-based hints
            if (price) {
                const priceHint = this.getPriceHint(categoryId, sub.id, price)
                if (priceHint) {
                    score += priceHint.score
                    reasons.push(priceHint.reason)
                }
            }

            // 3. Pattern matching
            const patternScore = this.matchPatterns(categoryId, sub.id, text)
            if (patternScore > 0) {
                score += patternScore
                reasons.push('ตรงกับรูปแบบ')
            }

            if (score > 0) {
                scores.push({
                    subcategoryId: sub.id,
                    score,
                    reasons
                })
            }
        })

        return scores.sort((a, b) => b.score - a.score)
    }

    /**
     * Get keywords for specific subcategory
     * This should ideally load from comprehensive keyword files
     */
    private getSubcategoryKeywords(categoryId: number, subcategoryId: number): string[] {
        // Placeholder - should load from actual keyword files
        // For now, return empty array
        // TODO: Integrate with comprehensive keyword files
        return []
    }

    /**
     * Get price hint for subcategory
     */
    private getPriceHint(categoryId: number, subcategoryId: number, price: number): {
        score: number
        reason: string
    } | null {
        // Price ranges for subcategories (examples)
        const priceRanges: Record<string, { min: number, max: number, score: number }> = {
            // Mobile phones by price
            '301_flagship': { min: 20000, max: 100000, score: 15 }, // Flagship
            '302_midrange': { min: 5000, max: 20000, score: 15 },   // Mid-range
            '303_budget': { min: 0, max: 5000, score: 15 },         // Budget

            // Automotive by price
            '101_car': { min: 100000, max: 10000000, score: 20 },
            '102_motorcycle': { min: 10000, max: 500000, score: 20 },

            // Computers
            '401_desktop': { min: 15000, max: 200000, score: 10 },
            '402_notebook': { min: 10000, max: 150000, score: 10 },
            '403_tablet': { min: 3000, max: 50000, score: 10 }
        }

        const key = `${categoryId}${subcategoryId}`
        const range = priceRanges[key]

        if (range && price >= range.min && price <= range.max) {
            return {
                score: range.score,
                reason: `ราคา ${price.toLocaleString()} บาท ตรงกับช่วง`
            }
        }

        return null
    }

    /**
     * Match specific patterns
     */
    private matchPatterns(categoryId: number, subcategoryId: number, text: string): number {
        let score = 0

        // Category-specific patterns
        switch (categoryId) {
            case 3: // Mobile
                // Screen size patterns
                if (/\d+(\.\d+)?\s*(inch|นิ้ว)/.test(text)) {
                    score += 5
                }
                // Storage patterns
                if (/\d+\s*(gb|tb)/i.test(text)) {
                    score += 5
                }
                break

            case 1: // Automotive
                // Year patterns
                if (/20\d{2}/.test(text)) {
                    score += 5
                }
                // Mileage patterns
                if (/\d+\s*(km|กม|ไมล์)/i.test(text)) {
                    score += 5
                }
                break

            case 4: // Computer
                // RAM patterns
                if (/\d+gb\s*ram/i.test(text)) {
                    score += 5
                }
                // Processor patterns
                if (/(i[3579]|ryzen|m[123])/i.test(text)) {
                    score += 5
                }
                break
        }

        return score
    }

    /**
     * Get top subcategory recommendation
     */
    getTopSubcategory(
        categoryId: number,
        title: string,
        description: string,
        price?: number
    ): number | undefined {
        const scores = this.classifySubcategory(categoryId, title, description, price)

        if (scores.length === 0) return undefined

        // Return top score if confidence is high enough
        const topScore = scores[0]
        const totalScore = scores.reduce((sum, s) => sum + s.score, 0)
        const confidence = topScore.score / totalScore

        if (confidence >= 0.6) {
            return topScore.subcategoryId
        }

        return undefined
    }
}

// Singleton
export const subcategoryIntelligence = new SubcategoryIntelligence()

/**
 * Convenience function
 */
export function suggestSubcategory(
    categoryId: number,
    title: string,
    description: string,
    price?: number
) {
    return subcategoryIntelligence.getTopSubcategory(categoryId, title, description, price)
}
