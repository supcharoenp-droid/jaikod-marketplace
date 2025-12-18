/**
 * Subcategory Coverage Analyzer
 * Checks which subcategories have keywords and which don't
 */

import { CATEGORIES } from '@/constants/categories'

// Import ALL subcategory keywords
import { AUTOMOTIVE_SUBCATEGORY_KEYWORDS } from './comprehensive-automotive-keywords'
import { REAL_ESTATE_SUBCATEGORY_KEYWORDS } from './comprehensive-real-estate-keywords'
import { MOBILE_SUBCATEGORY_KEYWORDS } from './comprehensive-mobile-keywords'
import { COMPUTER_SUBCATEGORY_KEYWORDS } from './comprehensive-computer-keywords'
import { APPLIANCE_SUBCATEGORY_KEYWORDS } from './comprehensive-appliances-keywords'
import { FASHION_SUBCATEGORY_KEYWORDS } from './comprehensive-fashion-keywords'
import { GAMING_SUBCATEGORY_KEYWORDS } from './comprehensive-gaming-keywords'
import { CAMERA_SUBCATEGORY_KEYWORDS } from './comprehensive-camera-keywords'
import { AMULET_SUBCATEGORY_KEYWORDS } from './comprehensive-amulet-keywords'
import { PETS_SUBCATEGORY_KEYWORDS } from './comprehensive-pets-keywords'
import { SERVICES_SUBCATEGORY_KEYWORDS } from './comprehensive-services-keywords'
import { SPORTS_SUBCATEGORY_KEYWORDS } from './comprehensive-sports-keywords'
import { HOME_GARDEN_SUBCATEGORY_KEYWORDS } from './comprehensive-home-keywords'
import { BEAUTY_SUBCATEGORY_KEYWORDS } from './comprehensive-beauty-keywords'
import { KIDS_SUBCATEGORY_KEYWORDS } from './comprehensive-kids-keywords'
import { BOOKS_SUBCATEGORY_KEYWORDS } from './comprehensive-books-keywords'

// Map category IDs to their subcategory keywords
const SUBCATEGORY_KEYWORDS_MAP: Record<number, Record<number, string[]>> = {
    1: AUTOMOTIVE_SUBCATEGORY_KEYWORDS,
    2: REAL_ESTATE_SUBCATEGORY_KEYWORDS,
    3: MOBILE_SUBCATEGORY_KEYWORDS,
    4: COMPUTER_SUBCATEGORY_KEYWORDS,
    5: APPLIANCE_SUBCATEGORY_KEYWORDS,
    6: FASHION_SUBCATEGORY_KEYWORDS,
    7: GAMING_SUBCATEGORY_KEYWORDS,
    8: CAMERA_SUBCATEGORY_KEYWORDS,
    9: AMULET_SUBCATEGORY_KEYWORDS,
    10: PETS_SUBCATEGORY_KEYWORDS,
    11: SERVICES_SUBCATEGORY_KEYWORDS,
    12: SPORTS_SUBCATEGORY_KEYWORDS,
    13: HOME_GARDEN_SUBCATEGORY_KEYWORDS,
    14: BEAUTY_SUBCATEGORY_KEYWORDS,
    15: KIDS_SUBCATEGORY_KEYWORDS,
    16: BOOKS_SUBCATEGORY_KEYWORDS,
}

export interface CoverageReport {
    totalCategories: number
    totalSubcategories: number
    coveredSubcategories: number
    uncoveredSubcategories: number
    coveragePercentage: number
    details: CategoryCoverage[]
}

export interface CategoryCoverage {
    categoryId: number
    categoryName: string
    totalSubs: number
    coveredSubs: number
    uncoveredSubs: SubcategoryInfo[]
    coveredSubsList: SubcategoryInfo[]
    coverage: number
}

export interface SubcategoryInfo {
    id: number
    name_th: string
    name_en: string
    hasKeywords: boolean
    keywordCount: number
}

/**
 * Analyze keyword coverage for all categories and subcategories
 */
export function analyzeSubcategoryCoverage(): CoverageReport {
    const details: CategoryCoverage[] = []
    let totalSubcategories = 0
    let coveredSubcategories = 0

    CATEGORIES.forEach(category => {
        const subcategories = category.subcategories || []
        const uncoveredSubs: SubcategoryInfo[] = []
        const coveredSubsList: SubcategoryInfo[] = []
        let coveredCount = 0

        // Get subcategory keywords for this category
        const categoryKeywords = SUBCATEGORY_KEYWORDS_MAP[category.id] || {}

        subcategories.forEach(sub => {
            totalSubcategories++

            // Check if this subcategory has keywords
            const hasKeywords = !!categoryKeywords[sub.id]
            const keywordCount = hasKeywords ? categoryKeywords[sub.id].length : 0

            const subInfo: SubcategoryInfo = {
                id: sub.id,
                name_th: sub.name_th,
                name_en: sub.name_en,
                hasKeywords,
                keywordCount
            }

            if (hasKeywords) {
                coveredCount++
                coveredSubcategories++
                coveredSubsList.push(subInfo)
            } else {
                uncoveredSubs.push(subInfo)
            }
        })

        details.push({
            categoryId: category.id,
            categoryName: category.name_th,
            totalSubs: subcategories.length,
            coveredSubs: coveredCount,
            uncoveredSubs,
            coveredSubsList,
            coverage: subcategories.length > 0 ? (coveredCount / subcategories.length) * 100 : 0
        })
    })

    return {
        totalCategories: CATEGORIES.length,
        totalSubcategories,
        coveredSubcategories,
        uncoveredSubcategories: totalSubcategories - coveredSubcategories,
        coveragePercentage: totalSubcategories > 0
            ? (coveredSubcategories / totalSubcategories) * 100
            : 0,
        details
    }
}

/**
 * Get list of all subcategories missing keywords
 */
export function getMissingKeywordSubcategories(): SubcategoryInfo[] {
    const report = analyzeSubcategoryCoverage()
    const missing: SubcategoryInfo[] = []

    report.details.forEach(category => {
        missing.push(...category.uncoveredSubs)
    })

    return missing
}

/**
 * Print coverage report to console
 */
export function printCoverageReport() {
    const report = analyzeSubcategoryCoverage()

    console.log('📊 ========================================')
    console.log('   SUBCATEGORY KEYWORD COVERAGE REPORT')
    console.log('========================================\n')

    console.log(`Total Categories: ${report.totalCategories}`)
    console.log(`Total Subcategories: ${report.totalSubcategories}`)
    console.log(`Covered: ${report.coveredSubcategories} (${report.coveragePercentage.toFixed(1)}%)`)
    console.log(`Missing Keywords: ${report.uncoveredSubcategories}\n`)

    console.log('📋 Details by Category:\n')

    report.details.forEach(cat => {
        const icon = cat.coverage === 100 ? '✅' : cat.coverage > 0 ? '⚠️' : '❌'
        console.log(`${icon} ${cat.categoryName} (ID: ${cat.categoryId})`)
        console.log(`   Coverage: ${cat.coveredSubs}/${cat.totalSubs} (${cat.coverage.toFixed(1)}%)`)

        if (cat.uncoveredSubs.length > 0) {
            console.log('   Missing keywords for:')
            cat.uncoveredSubs.forEach(sub => {
                console.log(`   - [${sub.id}] ${sub.name_th} (${sub.name_en})`)
            })
        }
        console.log()
    })

    return report
}

/**
 * Check if a specific subcategory has keywords
 */
export function hasKeywordsForSubcategory(categoryId: number, subcategoryId: number): boolean {
    const categoryKeywords = SUBCATEGORY_KEYWORDS_MAP[categoryId]
    if (!categoryKeywords) return false
    return !!categoryKeywords[subcategoryId]
}

/**
 * Get keywords for a specific subcategory
 */
export function getKeywordsForSubcategory(categoryId: number, subcategoryId: number): string[] {
    const categoryKeywords = SUBCATEGORY_KEYWORDS_MAP[categoryId]
    if (!categoryKeywords) return []
    return categoryKeywords[subcategoryId] || []
}

/**
 * Get expected coverage after implementing all categories
 */
export function getImplementationProgress(): {
    current: number
    target: number
    remaining: number
    percentage: number
} {
    const report = analyzeSubcategoryCoverage()

    return {
        current: report.coveredSubcategories,
        target: report.totalSubcategories,
        remaining: report.uncoveredSubcategories,
        percentage: report.coveragePercentage
    }
}

// Export the map for use in other modules
export { SUBCATEGORY_KEYWORDS_MAP }
