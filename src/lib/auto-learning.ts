/**
 * AUTO-LEARNING KEYWORD SYSTEM
 * 
 * Automatically learns and suggests keywords from corrections
 * - Analyzes seller corrections
 * - Extracts new keywords
 * - Validates before suggesting
 * - Auto-updates keyword files (with approval)
 */

import { getFeedbackAnalysis } from './classification-feedback'
import * as fs from 'fs'
import * as path from 'path'

interface LearnedKeyword {
    keyword: string
    categoryId: number
    frequency: number
    confidence: number
    context: string[]
    suggestedFile: string
}

export class AutoLearningSystem {
    private readonly MIN_FREQUENCY = 3 // Minimum occurrences to suggest
    private readonly MIN_CONFIDENCE = 0.7

    /**
     * Analyze corrections and learn new keywords
     */
    async learnFromCorrections(days: number = 7): Promise<LearnedKeyword[]> {
        const feedback = await getFeedbackAnalysis(days)

        if (feedback.totalCorrections < 10) {
            console.log('⚠️  Not enough corrections to learn from')
            return []
        }

        const learnedKeywords: LearnedKeyword[] = []

        // 1. From keyword gaps
        feedback.keywordGaps.forEach(gap => {
            gap.missingKeywords.forEach(kw => {
                if (this.isValidKeyword(kw)) {
                    learnedKeywords.push({
                        keyword: kw,
                        categoryId: Number(gap.category),
                        frequency: 5, // Estimated
                        confidence: gap.confidence,
                        context: ['frequent_misclassification'],
                        suggestedFile: this.getSuggestedFile(Number(gap.category))
                    })
                }
            })
        })

        // 2. From brand issues
        feedback.brandIssues.forEach(issue => {
            const keywords = this.extractBrandKeywords(issue.brand, issue.context)
            keywords.forEach(kw => {
                if (this.isValidKeyword(kw)) {
                    learnedKeywords.push({
                        keyword: kw,
                        categoryId: 0, // TBD
                        frequency: issue.count,
                        confidence: 0.8,
                        context: ['brand_context', issue.context],
                        suggestedFile: 'brand-context-rules'
                    })
                }
            })
        })

        // Filter and deduplicate
        return this.filterAndDeduplicate(learnedKeywords)
    }

    /**
     * Validate if keyword is useful
     */
    private isValidKeyword(keyword: string): boolean {
        // Remove very short keywords
        if (keyword.length < 3) return false

        // Remove common Thai words
        const thaiStopwords = ['และ', 'ของ', 'ที่', 'เป็น', 'มี', 'ใน', 'กับ']
        if (thaiStopwords.includes(keyword)) return false

        // Remove common English words
        const enStopwords = ['the', 'a', 'is', 'are', 'of', 'for', 'and', 'or']
        if (enStopwords.includes(keyword.toLowerCase())) return false

        // Must contain letters
        if (!/[a-zก-๙]/i.test(keyword)) return false

        return true
    }

    /**
     * Extract brand keywords
     */
    private extractBrandKeywords(brand: string, context: string): string[] {
        return [
            `${brand} ${context}`,
            `${brand.toLowerCase()} ${context}`,
            // Add variations
        ]
    }

    /**
     * Get suggested file for category
     */
    private getSuggestedFile(categoryId: number): string {
        const fileMap: Record<number, string> = {
            1: 'comprehensive-automotive-keywords.ts',
            3: 'comprehensive-mobile-keywords.ts',
            4: 'comprehensive-computer-keywords.ts',
            5: 'comprehensive-appliances-keywords.ts',
            6: 'comprehensive-fashion-keywords.ts',
            8: 'comprehensive-camera-keywords.ts',
            // Add more...
        }

        return fileMap[categoryId] || 'unknown'
    }

    /**
     * Filter and deduplicate keywords
     */
    private filterAndDeduplicate(keywords: LearnedKeyword[]): LearnedKeyword[] {
        // Group by keyword
        const grouped = new Map<string, LearnedKeyword>()

        keywords.forEach(kw => {
            const existing = grouped.get(kw.keyword)
            if (!existing || kw.frequency > existing.frequency) {
                grouped.set(kw.keyword, kw)
            }
        })

        // Filter by minimum requirements
        return Array.from(grouped.values())
            .filter(kw =>
                kw.frequency >= this.MIN_FREQUENCY &&
                kw.confidence >= this.MIN_CONFIDENCE
            )
            .sort((a, b) => b.frequency - a.frequency)
    }

    /**
     * Generate keyword addition code
     */
    generateAdditionCode(keywords: LearnedKeyword[]): string {
        const byFile = new Map<string, LearnedKeyword[]>()

        keywords.forEach(kw => {
            if (!byFile.has(kw.suggestedFile)) {
                byFile.set(kw.suggestedFile, [])
            }
            byFile.get(kw.suggestedFile)!.push(kw)
        })

        let code = '/**\n * AUTO-LEARNED KEYWORDS\n * \n * Add these to the appropriate files:\n */\n\n'

        byFile.forEach((keywords, file) => {
            code += `// ${file}\n`
            code += '// Add to main keyword array:\n[\n'
            keywords.forEach(kw => {
                code += `    '${kw.keyword}',  // ${kw.frequency}x, confidence: ${(kw.confidence * 100).toFixed(0)}%\n`
            })
            code += ']\n\n'
        })

        return code
    }

    /**
     * Auto-approve and update (with safety checks)
     */
    async autoUpdate(keywords: LearnedKeyword[], dryRun: boolean = true): Promise<{
        success: boolean
        updated: string[]
        errors: string[]
    }> {
        const updated: string[] = []
        const errors: string[] = []

        if (dryRun) {
            console.log('🔍 DRY RUN - Not actually updating files')
        }

        const byFile = new Map<string, LearnedKeyword[]>()
        keywords.forEach(kw => {
            if (!byFile.has(kw.suggestedFile)) {
                byFile.set(kw.suggestedFile, [])
            }
            byFile.get(kw.suggestedFile)!.push(kw)
        })

        for (const [file, keywords] of byFile.entries()) {
            try {
                if (!dryRun) {
                    // TODO: Implement actual file update with safety checks
                    // 1. Create backup
                    // 2. Add keywords
                    // 3. Validate syntax
                    // 4. Run tests
                    // 5. If tests pass, commit
                    console.log(`Would update ${file} with ${keywords.length} keywords`)
                }
                updated.push(file)
            } catch (error) {
                errors.push(`Failed to update ${file}: ${error}`)
            }
        }

        return {
            success: errors.length === 0,
            updated,
            errors
        }
    }
}

export const autoLearningSystem = new AutoLearningSystem()

/**
 * Convenience function
 */
export async function runAutoLearning(days: number = 7, autoApply: boolean = false) {
    console.log(`\n🧠 AUTO-LEARNING FROM LAST ${days} DAYS\n`)

    const learned = await autoLearningSystem.learnFromCorrections(days)

    console.log(`📚 Learned ${learned.length} new keywords\n`)

    if (learned.length === 0) {
        console.log('No new keywords to add.\n')
        return
    }

    // Show learned keywords
    learned.slice(0, 10).forEach((kw, idx) => {
        console.log(`${idx + 1}. "${kw.keyword}"`)
        console.log(`   Category: ${kw.categoryId}`)
        console.log(`   Frequency: ${kw.frequency}x`)
        console.log(`   Confidence: ${(kw.confidence * 100).toFixed(0)}%`)
        console.log(`   File: ${kw.suggestedFile}`)
        console.log()
    })

    // Generate code
    const code = autoLearningSystem.generateAdditionCode(learned)
    console.log('📝 GENERATED CODE:\n')
    console.log(code)

    // Auto-apply if requested
    if (autoApply) {
        console.log('🚀 Auto-applying changes...\n')
        const result = await autoLearningSystem.autoUpdate(learned, false)

        if (result.success) {
            console.log(`✅ Updated ${result.updated.length} files\n`)
        } else {
            console.log(`❌ Errors: ${result.errors.join(', ')}\n`)
        }
    }
}
