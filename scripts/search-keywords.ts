#!/usr/bin/env ts-node

/**
 * KEYWORD SEARCH TOOL
 * 
 * Search for keywords across all comprehensive keyword files
 * Usage: npm run search:keywords "ปั๊มลม"
 */

import * as fs from 'fs'
import * as path from 'path'

const KEYWORDS_DIR = path.join(__dirname, '..', 'src', 'lib')
const KEYWORD_FILES_PATTERN = /comprehensive-.*-keywords\.ts$/

interface SearchResult {
    file: string
    lineNumber: number
    line: string
    category: string
    subcategory?: string
}

function searchKeywords(searchTerm: string): SearchResult[] {
    const results: SearchResult[] = []

    // Get all keyword files
    const files = fs.readdirSync(KEYWORDS_DIR)
        .filter(f => KEYWORD_FILES_PATTERN.test(f))
        .map(f => path.join(KEYWORDS_DIR, f))

    files.forEach(filePath => {
        const content = fs.readFileSync(filePath, 'utf-8')
        const lines = content.split('\n')
        const fileName = path.basename(filePath)

        // Extract category name
        const categoryMatch = fileName.match(/comprehensive-(.*)-keywords\.ts/)
        const category = categoryMatch ? categoryMatch[1] : 'unknown'

        lines.forEach((line, index) => {
            if (line.toLowerCase().includes(searchTerm.toLowerCase())) {
                // Try to detect subcategory
                let subcategory: string | undefined

                // Look backwards for subcategory comment or ID
                for (let i = index - 1; i >= Math.max(0, index - 10); i--) {
                    const prevLine = lines[i]

                    // Match: // Car Maintenance (109)
                    const subMatch = prevLine.match(/\/\/\s*(.+?)\s*\((\d+)\)/)
                    if (subMatch) {
                        subcategory = `${subMatch[1]} (${subMatch[2]})`
                        break
                    }

                    // Match: 109: [
                    const idMatch = prevLine.match(/^\s*(\d+):\s*\[/)
                    if (idMatch) {
                        subcategory = `ID: ${idMatch[1]}`
                        break
                    }
                }

                results.push({
                    file: fileName,
                    lineNumber: index + 1,
                    line: line.trim(),
                    category,
                    subcategory
                })
            }
        })
    })

    return results
}

function displayResults(results: SearchResult[], searchTerm: string) {
    console.log('\n' + '='.repeat(70))
    console.log(`🔍 KEYWORD SEARCH RESULTS FOR: "${searchTerm}"`)
    console.log('='.repeat(70) + '\n')

    if (results.length === 0) {
        console.log('❌ No results found.\n')
        console.log('💡 Suggestions:')
        console.log('   - Check spelling (Thai/English)')
        console.log('   - Try related terms')
        console.log('   - Search in comprehensive-*-keywords.ts files manually\n')
        return
    }

    console.log(`✅ Found ${results.length} occurrence(s)\n`)

    // Group by file
    const grouped = results.reduce((acc, r) => {
        if (!acc[r.file]) acc[r.file] = []
        acc[r.file].push(r)
        return acc
    }, {} as Record<string, SearchResult[]>)

    Object.entries(grouped).forEach(([file, items]) => {
        console.log(`📁 ${file}`)
        console.log('-'.repeat(70))

        items.forEach(item => {
            console.log(`   Line ${item.lineNumber}:`)
            console.log(`   Category: ${item.category}`)
            if (item.subcategory) {
                console.log(`   Subcategory: ${item.subcategory}`)
            }
            console.log(`   Code: ${item.line}`)
            console.log()
        })
    })

    console.log('='.repeat(70) + '\n')
}

// Main execution
const searchTerm = process.argv[2]

if (!searchTerm) {
    console.error('❌ Error: Please provide a search term')
    console.log('\n📖 Usage:')
    console.log('   npm run search:keywords "ปั๊มลม"')
    console.log('   npm run search:keywords "air pump"')
    console.log('   npm run search:keywords "canon"')
    console.log()
    process.exit(1)
}

const results = searchKeywords(searchTerm)
displayResults(results, searchTerm)

// Exit with appropriate code
process.exit(results.length > 0 ? 0 : 1)
