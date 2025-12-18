#!/usr/bin/env ts-node

/**
 * KEYWORD AUTO-SUGGESTER
 * 
 * Analyzes feedback corrections and suggests keywords to add
 * Based on frequently misclassified products
 */

import { getFeedbackAnalysis } from '../src/lib/classification-feedback'

interface KeywordSuggestion {
    keyword: string
    category: number
    categoryName: string
    frequency: number
    confidence: number
    reason: string
}

async function generateKeywordSuggestions(days: number = 30): Promise<KeywordSuggestion[]> {
    console.log(`\n🔍 Analyzing feedback from last ${days} days...\n`)

    const feedback = await getFeedbackAnalysis(days)

    if (feedback.totalCorrections === 0) {
        console.log('ℹ️  No feedback data available yet.\n')
        return []
    }

    const suggestions: KeywordSuggestion[] = []

    // 1. From keyword gaps
    feedback.keywordGaps.forEach(gap => {
        gap.missingKeywords.forEach(keyword => {
            suggestions.push({
                keyword,
                category: Number(gap.category),
                categoryName: gap.category,
                frequency: 5, // Estimated from gap analysis
                confidence: gap.confidence,
                reason: 'Frequently appears in misclassified products'
            })
        })
    })

    // 2. From brand issues
    feedback.brandIssues.forEach(issue => {
        const keyword = `${issue.brand} ${issue.context}`
        suggestions.push({
            keyword,
            category: 0, // To be determined
            categoryName: 'TBD',
            frequency: issue.count,
            confidence: 0.8,
            reason: `Brand context: ${issue.suggestedFix}`
        })
    })

    return suggestions.sort((a, b) => b.frequency - a.frequency)
}

function displaySuggestions(suggestions: KeywordSuggestion[]) {
    console.log('='.repeat(80))
    console.log('💡 KEYWORD SUGGESTIONS FROM FEEDBACK')
    console.log('='.repeat(80) + '\n')

    if (suggestions.length === 0) {
        console.log('✅ No keyword suggestions at this time.')
        console.log('   The system seems to be working well!\n')
        return
    }

    console.log(`Found ${suggestions.length} suggested keywords:\n`)

    suggestions.slice(0, 20).forEach((sug, idx) => {
        console.log(`${idx + 1}. "${sug.keyword}"`)
        console.log(`   Category: ${sug.categoryName} (${sug.category})`)
        console.log(`   Frequency: ${sug.frequency} occurrences`)
        console.log(`   Confidence: ${(sug.confidence * 100).toFixed(0)}%`)
        console.log(`   Reason: ${sug.reason}`)
        console.log()
    })

    console.log('='.repeat(80))
    console.log('\n📝 NEXT STEPS:')
    console.log('   1. Review suggestions above')
    console.log('   2. Add to appropriate comprehensive-*-keywords.ts files')
    console.log('   3. Run: npm run test:classification')
    console.log('   4. Deploy if tests pass\n')
}

async function exportSuggestions(suggestions: KeywordSuggestion[], outputPath: string) {
    const fs = await import('fs')

    const content = `/**
 * AUTO-GENERATED KEYWORD SUGGESTIONS
 * Generated: ${new Date().toISOString()}
 * 
 * Based on ${suggestions.length} feedback corrections
 * Review and add to appropriate keyword files
 */

export const SUGGESTED_KEYWORDS = {
${suggestions.map(s => `    // ${s.reason}
    '${s.keyword}': {
        category: ${s.category},
        frequency: ${s.frequency},
        confidence: ${s.confidence}
    }`).join(',\n\n')}
}
`

    fs.writeFileSync(outputPath, content)
    console.log(`✅ Exported to: ${outputPath}\n`)
}

// Main execution
async function main() {
    const days = Number(process.argv[2]) || 30

    try {
        const suggestions = await generateKeywordSuggestions(days)
        displaySuggestions(suggestions)

        if (suggestions.length > 0) {
            const outputPath = './keyword-suggestions.ts'
            await exportSuggestions(suggestions, outputPath)
        }
    } catch (error) {
        console.error('❌ Error:', error)
        console.log('\nℹ️  Note: This requires feedback data in Firestore')
        console.log('   Run some classifications and corrections first.\n')
    }
}

main()
