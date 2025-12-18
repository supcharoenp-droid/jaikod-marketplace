#!/usr/bin/env ts-node

/**
 * KEYWORDS COVERAGE ANALYZER
 * 
 * Analyzes keyword coverage for all categories
 * Shows which categories need more keywords
 */

import * as fs from 'fs'
import * as path from 'path'

const KEYWORDS_DIR = path.join(__dirname, '..', 'src', 'lib')
const CATEGORIES_FILE = path.join(__dirname, '..', 'src', 'constants', 'categories.ts')

interface CategoryInfo {
    id: number
    name: string
    hasKeywordFile: boolean
    keywordCount: number
    subcategoryCount: number
    coverage: 'excellent' | 'good' | 'fair' | 'poor' | 'none'
}

function getCategoryInfoFromFile(filePath: string): { count: number; subcategories: number } {
    const content = fs.readFileSync(filePath, 'utf-8')

    // Count unique keywords (excluding comments, whitespace)
    const keywords = content
        .split('\n')
        .filter(line => /['"]/.test(line)) // Has quotes
        .filter(line => !line.trim().startsWith('//')) // Not comment
        .join(' ')
        .match(/['"]([^'"]+)['"]/g) || []

    const uniqueKeywords = new Set(
        keywords.map(k => k.replace(/['"]/g, '').toLowerCase())
    )

    // Count subcategories (lines with pattern: 123: [)
    const subcategories = content
        .split('\n')
        .filter(line => /^\s*\d+:\s*\[/.test(line))
        .length

    return {
        count: uniqueKeywords.size,
        subcategories
    }
}

function analyzeCoverage(): CategoryInfo[] {
    // Read categories
    const categoriesContent = fs.readFileSync(CATEGORIES_FILE, 'utf-8')

    // Extract category names (simplified)
    const categoryMatches = categoriesContent.matchAll(/id:\s*(\d+),\s*name_en:\s*['"]([^'"]+)['"]/g)
    const categories = Array.from(categoryMatches).map(m => ({
        id: Number(m[1]),
        name: m[2]
    }))

    // Check keyword files
    const keywordFiles = fs.readdirSync(KEYWORDS_DIR)
        .filter(f => /comprehensive-.*-keywords\.ts$/.test(f))

    const results: CategoryInfo[] = categories.map(cat => {
        const slug = cat.name.toLowerCase()
            .replace(/\s+&\s+/g, '-')
            .replace(/\s+/g, '-')

        const possibleFiles = [
            `comprehensive-${slug}-keywords.ts`,
            `comprehensive-${slug.split('-')[0]}-keywords.ts`,
        ]

        const keywordFile = keywordFiles.find(f =>
            possibleFiles.some(pf => f.includes(slug.split('-')[0]))
        )

        let keywordCount = 0
        let subcategoryCount = 0

        if (keywordFile) {
            const filePath = path.join(KEYWORDS_DIR, keywordFile)
            const info = getCategoryInfoFromFile(filePath)
            keywordCount = info.count
            subcategoryCount = info.subcategories
        }

        // Determine coverage
        let coverage: CategoryInfo['coverage'] = 'none'
        if (keywordCount >= 500) coverage = 'excellent'
        else if (keywordCount >= 300) coverage = 'good'
        else if (keywordCount >= 100) coverage = 'fair'
        else if (keywordCount > 0) coverage = 'poor'

        return {
            id: cat.id,
            name: cat.name,
            hasKeywordFile: !!keywordFile,
            keywordCount,
            subcategoryCount,
            coverage
        }
    })

    return results.sort((a, b) => b.keywordCount - a.keywordCount)
}

function displayAnalysis(results: CategoryInfo[]) {
    console.log('\n' + '='.repeat(80))
    console.log('📊 KEYWORDS COVERAGE ANALYSIS')
    console.log('='.repeat(80) + '\n')

    // Summary
    const total = results.length
    const withKeywords = results.filter(r => r.hasKeywordFile).length
    const excellent = results.filter(r => r.coverage === 'excellent').length
    const good = results.filter(r => r.coverage === 'good').length
    const fair = results.filter(r => r.coverage === 'fair').length
    const poor = results.filter(r => r.coverage === 'poor').length
    const none = results.filter(r => r.coverage === 'none').length

    console.log('📈 SUMMARY:')
    console.log(`   Total Categories: ${total}`)
    console.log(`   With Keyword Files: ${withKeywords} (${((withKeywords / total) * 100).toFixed(1)}%)`)
    console.log(`   ✅ Excellent (500+): ${excellent}`)
    console.log(`   🟢 Good (300-499): ${good}`)
    console.log(`   🟡 Fair (100-299): ${fair}`)
    console.log(`   🟠 Poor (1-99): ${poor}`)
    console.log(`   ❌ None (0): ${none}\n`)

    console.log('-'.repeat(80))
    console.log(`${'ID'.padEnd(5)} ${'Category'.padEnd(30)} ${'Keywords'.padEnd(12)} ${'Subs'.padEnd(6)} ${'Status'}`)
    console.log('-'.repeat(80))

    results.forEach(r => {
        let icon = ''
        switch (r.coverage) {
            case 'excellent': icon = '✅'; break
            case 'good': icon = '🟢'; break
            case 'fair': icon = '🟡'; break
            case 'poor': icon = '🟠'; break
            case 'none': icon = '❌'; break
        }

        console.log(
            `${String(r.id).padEnd(5)} ` +
            `${r.name.padEnd(30).substring(0, 30)} ` +
            `${String(r.keywordCount).padEnd(12)} ` +
            `${String(r.subcategoryCount).padEnd(6)} ` +
            `${icon} ${r.coverage}`
        )
    })

    console.log('\n' + '='.repeat(80))

    // Recommendations
    const needAttention = results.filter(r => r.coverage === 'poor' || r.coverage === 'none')

    if (needAttention.length > 0) {
        console.log('\n💡 RECOMMENDATIONS:')
        console.log('\nCategories needing more keywords:\n')

        needAttention.slice(0, 5).forEach(r => {
            console.log(`   ${r.id}. ${r.name}`)
            console.log(`      Current: ${r.keywordCount} keywords`)
            console.log(`      Target: 300+ keywords for good coverage`)
            console.log(`      Action: Add ${300 - r.keywordCount} more keywords\n`)
        })
    }

    console.log()
}

// Main execution
const results = analyzeCoverage()
displayAnalysis(results)
