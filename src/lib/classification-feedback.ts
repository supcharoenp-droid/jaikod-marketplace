/**
 * CLASSIFICATION FEEDBACK SYSTEM
 * 
 * Learning system that collects and analyzes corrections from sellers
 * - Track misclassifications
 * - Analyze patterns
 * - Generate improvement suggestions
 * - Auto-update keywords (future)
 */

import { db } from '@/lib/firebase'
import { collection, addDoc, query, where, getDocs, orderBy, limit, Timestamp } from 'firebase/firestore'

// ========================================
// INTERFACES
// ========================================
export interface ClassificationCorrection {
    id?: string
    productId: string
    productTitle: string
    productDescription: string
    productPrice?: number

    // Original AI prediction
    originalCategoryId: number
    originalSubcategoryId?: number
    originalConfidence: number
    originalEngine: 'advanced' | 'legacy'

    // User correction
    correctedCategoryId: number
    correctedSubcategoryId?: number

    // Metadata
    userId: string
    correctedAt: Date
    reason?: string // Optional reason from seller

    // Analysis
    errorType?: 'category' | 'subcategory' | 'both'
    errorPattern?: string // e.g., "4→8" (Computer → Camera)
}

export interface FeedbackAnalysis {
    totalCorrections: number
    period: string
    commonErrors: {
        pattern: string // "4→8"
        count: number
        percentage: number
        examples: string[]
    }[]
    brandIssues: {
        brand: string
        context: string
        count: number
        suggestedFix: string
    }[]
    keywordGaps: {
        category: string
        missingKeywords: string[]
        confidence: number
    }[]
    recommendations: {
        priority: 'high' | 'medium' | 'low'
        type: 'brand-context' | 'exclusion' | 'keyword' | 'validator'
        action: string
        impact: number // estimated improvement in accuracy
    }[]
}

// ========================================
// FEEDBACK COLLECTOR
// ========================================
export class ClassificationFeedbackCollector {
    private collectionName = 'classification_corrections'

    /**
     * Record a classification correction
     */
    async recordCorrection(correction: Omit<ClassificationCorrection, 'id' | 'correctedAt' | 'errorType' | 'errorPattern'>) {
        const errorType = this.determineErrorType(
            correction.originalCategoryId,
            correction.originalSubcategoryId,
            correction.correctedCategoryId,
            correction.correctedSubcategoryId
        )

        const errorPattern = `${correction.originalCategoryId}→${correction.correctedCategoryId}`

        const doc: ClassificationCorrection = {
            ...correction,
            correctedAt: new Date(),
            errorType,
            errorPattern
        }

        try {
            const docRef = await addDoc(collection(db, this.collectionName), {
                ...doc,
                correctedAt: Timestamp.fromDate(doc.correctedAt)
            })

            console.log('✅ Correction recorded:', docRef.id)
            return docRef.id
        } catch (error) {
            console.error('❌ Error recording correction:', error)
            throw error
        }
    }

    /**
     * Get recent corrections
     */
    async getRecentCorrections(days: number = 30): Promise<ClassificationCorrection[]> {
        const since = new Date()
        since.setDate(since.getDate() - days)

        const q = query(
            collection(db, this.collectionName),
            where('correctedAt', '>=', Timestamp.fromDate(since)),
            orderBy('correctedAt', 'desc'),
            limit(100)
        )

        const snapshot = await getDocs(q)

        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            correctedAt: doc.data().correctedAt.toDate()
        } as ClassificationCorrection))
    }

    /**
     * Get corrections for specific product
     */
    async getProductCorrections(productId: string): Promise<ClassificationCorrection[]> {
        const q = query(
            collection(db, this.collectionName),
            where('productId', '==', productId),
            orderBy('correctedAt', 'desc')
        )

        const snapshot = await getDocs(q)

        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            correctedAt: doc.data().correctedAt.toDate()
        } as ClassificationCorrection))
    }

    /**
     * Determine error type
     */
    private determineErrorType(
        origCat: number,
        origSub: number | undefined,
        corrCat: number,
        corrSub: number | undefined
    ): 'category' | 'subcategory' | 'both' {
        if (origCat !== corrCat) {
            return origSub !== corrSub ? 'both' : 'category'
        }
        return 'subcategory'
    }
}

// ========================================
// FEEDBACK ANALYZER
// ========================================
export class ClassificationFeedbackAnalyzer {
    private collector = new ClassificationFeedbackCollector()

    /**
     * Analyze corrections and generate insights
     */
    async analyzeFeedback(days: number = 30): Promise<FeedbackAnalysis> {
        const corrections = await this.collector.getRecentCorrections(days)

        if (corrections.length === 0) {
            return this.getEmptyAnalysis()
        }

        return {
            totalCorrections: corrections.length,
            period: `Last ${days} days`,
            commonErrors: this.findCommonErrors(corrections),
            brandIssues: this.detectBrandIssues(corrections),
            keywordGaps: this.identifyKeywordGaps(corrections),
            recommendations: this.generateRecommendations(corrections)
        }
    }

    /**
     * Find common error patterns
     */
    private findCommonErrors(corrections: ClassificationCorrection[]) {
        const patterns = new Map<string, ClassificationCorrection[]>()

        corrections.forEach(corr => {
            const pattern = corr.errorPattern || `${corr.originalCategoryId}→${corr.correctedCategoryId}`

            if (!patterns.has(pattern)) {
                patterns.set(pattern, [])
            }
            patterns.get(pattern)!.push(corr)
        })

        return Array.from(patterns.entries())
            .map(([pattern, items]) => ({
                pattern,
                count: items.length,
                percentage: (items.length / corrections.length) * 100,
                examples: items.slice(0, 3).map(i => i.productTitle)
            }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 10)
    }

    /**
     * Detect brand-related issues
     */
    private detectBrandIssues(corrections: ClassificationCorrection[]) {
        const brandPatterns: any[] = []

        // Common brands that cause confusion
        const problematicBrands = ['canon', 'epson', 'xiaomi', 'samsung', 'lg', 'sony']

        problematicBrands.forEach(brand => {
            const brandCorrections = corrections.filter(c =>
                c.productTitle.toLowerCase().includes(brand)
            )

            if (brandCorrections.length >= 3) {
                const contexts = this.detectBrandContexts(brandCorrections)

                contexts.forEach(ctx => {
                    brandPatterns.push({
                        brand,
                        context: ctx.context,
                        count: ctx.count,
                        suggestedFix: `Add ${brand} + ${ctx.context} to brand context rules`
                    })
                })
            }
        })

        return brandPatterns.sort((a, b) => b.count - a.count).slice(0, 5)
    }

    /**
     * Detect brand contexts
     */
    private detectBrandContexts(corrections: ClassificationCorrection[]) {
        const contexts = new Map<string, number>()

        corrections.forEach(corr => {
            const text = corr.productTitle.toLowerCase()

            // Detect context from keywords
            if (text.includes('printer') || text.includes('ปริ้นเตอร์')) {
                contexts.set('printer', (contexts.get('printer') || 0) + 1)
            }
            if (text.includes('camera') || text.includes('กล้อง')) {
                contexts.set('camera', (contexts.get('camera') || 0) + 1)
            }
            if (text.includes('phone') || text.includes('มือถือ')) {
                contexts.set('phone', (contexts.get('phone') || 0) + 1)
            }
            if (text.includes('vacuum') || text.includes('ดูดฝุ่น')) {
                contexts.set('vacuum', (contexts.get('vacuum') || 0) + 1)
            }
        })

        return Array.from(contexts.entries()).map(([context, count]) => ({ context, count }))
    }

    /**
     * Identify keyword gaps
     */
    private identifyKeywordGaps(corrections: ClassificationCorrection[]) {
        const gaps: any[] = []

        // Analyze titles for keywords
        corrections.forEach(corr => {
            const words = this.extractKeywords(corr.productTitle)

            // If confidence was low, these might be missing keywords
            if (corr.originalConfidence < 0.7) {
                gaps.push({
                    category: corr.correctedCategoryId,
                    keywords: words,
                    confidence: corr.originalConfidence
                })
            }
        })

        // Group by category and find common keywords
        const categoryGaps = new Map<number, string[]>()

        gaps.forEach(gap => {
            if (!categoryGaps.has(gap.category)) {
                categoryGaps.set(gap.category, [])
            }
            categoryGaps.get(gap.category)!.push(...gap.keywords)
        })

        // Get top keywords per category
        return Array.from(categoryGaps.entries())
            .map(([catId, keywords]) => {
                const freq = new Map<string, number>()
                keywords.forEach(kw => freq.set(kw, (freq.get(kw) || 0) + 1))

                const topKeywords = Array.from(freq.entries())
                    .filter(([_, count]) => count >= 2)
                    .sort((a, b) => b[1] - a[1])
                    .slice(0, 5)
                    .map(([kw, _]) => kw)

                return {
                    category: String(catId),
                    missingKeywords: topKeywords,
                    confidence: 0.8
                }
            })
            .filter(g => g.missingKeywords.length > 0)
    }

    /**
     * Extract keywords from text
     */
    private extractKeywords(text: string): string[] {
        // Remove common words
        const stopwords = ['และ', 'ของ', 'ที่', 'เป็น', 'มี', 'ใน', 'กับ', 'the', 'a', 'is', 'are', 'of', 'for']

        const words = text.toLowerCase()
            .replace(/[^\u0E00-\u0E7Fa-z0-9\s]/g, ' ')
            .split(/\s+/)
            .filter(w => w.length > 2 && !stopwords.includes(w))

        return [...new Set(words)]
    }

    /**
     * Generate improvement recommendations
     */
    private generateRecommendations(corrections: ClassificationCorrection[]) {
        const recommendations: any[] = []

        // High-frequency errors
        const errorPatterns = this.findCommonErrors(corrections)

        errorPatterns.forEach(pattern => {
            if (pattern.percentage > 10) {
                recommendations.push({
                    priority: 'high' as const,
                    type: 'exclusion' as const,
                    action: `Add exclusion rule for pattern ${pattern.pattern}`,
                    impact: pattern.percentage
                })
            } else if (pattern.percentage > 5) {
                recommendations.push({
                    priority: 'medium' as const,
                    type: 'keyword' as const,
                    action: `Review keywords for categories in pattern ${pattern.pattern}`,
                    impact: pattern.percentage
                })
            }
        })

        // Brand issues
        const brandIssues = this.detectBrandIssues(corrections)

        brandIssues.forEach(issue => {
            if (issue.count >= 5) {
                recommendations.push({
                    priority: 'high' as const,
                    type: 'brand-context' as const,
                    action: issue.suggestedFix,
                    impact: (issue.count / corrections.length) * 100
                })
            }
        })

        // Low confidence patterns
        const lowConfidence = corrections.filter(c => c.originalConfidence < 0.6)

        if (lowConfidence.length > corrections.length * 0.2) {
            recommendations.push({
                priority: 'high' as const,
                type: 'validator' as const,
                action: 'Add domain validators for low-confidence categories',
                impact: (lowConfidence.length / corrections.length) * 100
            })
        }

        return recommendations.sort((a, b) => b.impact - a.impact)
    }

    /**
     * Get empty analysis
     */
    private getEmptyAnalysis(): FeedbackAnalysis {
        return {
            totalCorrections: 0,
            period: '',
            commonErrors: [],
            brandIssues: [],
            keywordGaps: [],
            recommendations: []
        }
    }
}

// ========================================
// CONVENIENCE FUNCTIONS
// ========================================

/**
 * Record a seller's category correction
 */
export async function recordCategoryCorrection(params: {
    productId: string
    productTitle: string
    productDescription: string
    productPrice?: number
    originalCategoryId: number
    originalSubcategoryId?: number
    originalConfidence: number
    originalEngine: 'advanced' | 'legacy'
    correctedCategoryId: number
    correctedSubcategoryId?: number
    userId: string
    reason?: string
}) {
    const collector = new ClassificationFeedbackCollector()
    return collector.recordCorrection(params)
}

/**
 * Get feedback analysis for dashboard
 */
export async function getFeedbackAnalysis(days: number = 30) {
    const analyzer = new ClassificationFeedbackAnalyzer()
    return analyzer.analyzeFeedback(days)
}

/**
 * Get correction history for a product
 */
export async function getProductCorrectionHistory(productId: string) {
    const collector = new ClassificationFeedbackCollector()
    return collector.getProductCorrections(productId)
}
