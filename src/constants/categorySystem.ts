/**
 * Complete Category System - Master Export
 * Combines all category hierarchies into one unified system
 */

import { CATEGORY_HIERARCHY, CategoryAttribute, SubCategory, MainCategory, COMMON_ATTRIBUTES, getAllCategories, getCategoryBySlug, getCategoryAttributes } from './categoryHierarchy'
import { EXTENDED_CATEGORIES } from './categoryHierarchyExtended'
import { FINAL_CATEGORIES } from './categoryHierarchyFinal'

// Combine all categories
export const ALL_CATEGORIES: MainCategory[] = [
    ...CATEGORY_HIERARCHY,
    ...EXTENDED_CATEGORIES,
    ...FINAL_CATEGORIES
]

// Export types
export type { CategoryAttribute, SubCategory, MainCategory }

// Export common attributes
export { COMMON_ATTRIBUTES }

// Helper Functions

/**
 * Get all categories as a flat list with hierarchy information
 */
export function getAllCategoriesFlat(): {
    id: string
    name_th: string
    name_en: string
    slug: string
    level: number
    parentId?: string
    parentSlug?: string
    icon?: string
}[] {
    const result: {
        id: string
        name_th: string
        name_en: string
        slug: string
        level: number
        parentId?: string
        parentSlug?: string
        icon?: string
    }[] = []

    ALL_CATEGORIES.forEach(main => {
        // Level 1 - Main Category
        result.push({
            id: main.slug,
            name_th: main.name_th,
            name_en: main.name_en,
            slug: main.slug,
            level: 1,
            icon: main.icon
        })

        // Level 2 - Sub Categories
        main.subCategories.forEach(sub => {
            result.push({
                id: sub.slug,
                name_th: sub.name_th,
                name_en: sub.name_en,
                slug: sub.slug,
                level: 2,
                parentId: main.slug,
                parentSlug: main.slug
            })

            // Level 3 - Sub-Sub Categories
            sub.subCategories?.forEach(subsub => {
                result.push({
                    id: subsub.slug,
                    name_th: subsub.name_th,
                    name_en: subsub.name_en,
                    slug: subsub.slug,
                    level: 3,
                    parentId: sub.slug,
                    parentSlug: sub.slug
                })
            })
        })
    })

    return result
}

/**
 * Get category by slug (searches all levels)
 */
export function findCategoryBySlug(slug: string): MainCategory | SubCategory | null {
    for (const main of ALL_CATEGORIES) {
        if (main.slug === slug) return main

        for (const sub of main.subCategories) {
            if (sub.slug === slug) return sub

            if (sub.subCategories) {
                for (const subsub of sub.subCategories) {
                    if (subsub.slug === slug) return subsub
                }
            }
        }
    }
    return null
}

/**
 * Get all attributes for a specific category (including inherited from parent)
 */
export function getAttributesForCategory(slug: string): CategoryAttribute[] {
    for (const main of ALL_CATEGORIES) {
        if (main.slug === slug) return main.commonAttributes || []

        for (const sub of main.subCategories) {
            if (sub.slug === slug) {
                return [...(main.commonAttributes || []), ...(sub.attributes || [])]
            }

            if (sub.subCategories) {
                for (const subsub of sub.subCategories) {
                    if (subsub.slug === slug) {
                        return [
                            ...(main.commonAttributes || []),
                            ...(sub.attributes || []),
                            ...(subsub.attributes || [])
                        ]
                    }
                }
            }
        }
    }
    return []
}

/**
 * Get breadcrumb path for a category
 */
export function getCategoryBreadcrumb(slug: string): { name_th: string; name_en: string; slug: string }[] {
    const breadcrumb: { name_th: string; name_en: string; slug: string }[] = []

    for (const main of ALL_CATEGORIES) {
        if (main.slug === slug) {
            breadcrumb.push({ name_th: main.name_th, name_en: main.name_en, slug: main.slug })
            return breadcrumb
        }

        for (const sub of main.subCategories) {
            if (sub.slug === slug) {
                breadcrumb.push({ name_th: main.name_th, name_en: main.name_en, slug: main.slug })
                breadcrumb.push({ name_th: sub.name_th, name_en: sub.name_en, slug: sub.slug })
                return breadcrumb
            }

            if (sub.subCategories) {
                for (const subsub of sub.subCategories) {
                    if (subsub.slug === slug) {
                        breadcrumb.push({ name_th: main.name_th, name_en: main.name_en, slug: main.slug })
                        breadcrumb.push({ name_th: sub.name_th, name_en: sub.name_en, slug: sub.slug })
                        breadcrumb.push({ name_th: subsub.name_th, name_en: subsub.name_en, slug: subsub.slug })
                        return breadcrumb
                    }
                }
            }
        }
    }

    return breadcrumb
}

/**
 * Get all main categories (level 1 only)
 */
export function getMainCategories(): MainCategory[] {
    return ALL_CATEGORIES
}

/**
 * Get subcategories for a specific category
 */
export function getSubCategories(parentSlug: string): SubCategory[] {
    const category = findCategoryBySlug(parentSlug)
    if (!category) return []

    if ('subCategories' in category) {
        return category.subCategories || []
    }

    return []
}

/**
 * Search categories by name (Thai or English)
 */
export function searchCategories(query: string): {
    category: MainCategory | SubCategory
    level: number
    path: string[]
}[] {
    const results: { category: MainCategory | SubCategory; level: number; path: string[] }[] = []
    const lowerQuery = query.toLowerCase()

    ALL_CATEGORIES.forEach(main => {
        if (main.name_th.toLowerCase().includes(lowerQuery) ||
            main.name_en.toLowerCase().includes(lowerQuery)) {
            results.push({ category: main, level: 1, path: [main.name_th] })
        }

        main.subCategories.forEach(sub => {
            if (sub.name_th.toLowerCase().includes(lowerQuery) ||
                sub.name_en.toLowerCase().includes(lowerQuery)) {
                results.push({ category: sub, level: 2, path: [main.name_th, sub.name_th] })
            }

            sub.subCategories?.forEach(subsub => {
                if (subsub.name_th.toLowerCase().includes(lowerQuery) ||
                    subsub.name_en.toLowerCase().includes(lowerQuery)) {
                    results.push({ category: subsub, level: 3, path: [main.name_th, sub.name_th, subsub.name_th] })
                }
            })
        })
    })

    return results
}

/**
 * Get AI-suggested attributes for a category
 * Returns only attributes that can be auto-filled by AI
 */
export function getAISuggestedAttributes(slug: string): CategoryAttribute[] {
    const allAttributes = getAttributesForCategory(slug)
    return allAttributes.filter(attr => attr.aiSuggested === true)
}

/**
 * Get required attributes for a category
 */
export function getRequiredAttributes(slug: string): CategoryAttribute[] {
    const allAttributes = getAttributesForCategory(slug)
    return allAttributes.filter(attr => attr.required === true)
}

/**
 * Validate product attributes against category requirements
 */
export function validateProductAttributes(
    categorySlug: string,
    attributes: Record<string, any>
): { valid: boolean; errors: string[] } {
    const requiredAttrs = getRequiredAttributes(categorySlug)
    const errors: string[] = []

    requiredAttrs.forEach(attr => {
        if (!attributes[attr.name] || attributes[attr.name] === '') {
            errors.push(`${attr.name} is required`)
        }
    })

    return {
        valid: errors.length === 0,
        errors
    }
}

// Statistics
export function getCategoryStats() {
    let totalCategories = 0
    let level1Count = 0
    let level2Count = 0
    let level3Count = 0

    ALL_CATEGORIES.forEach(main => {
        level1Count++
        totalCategories++

        main.subCategories.forEach(sub => {
            level2Count++
            totalCategories++

            if (sub.subCategories) {
                level3Count += sub.subCategories.length
                totalCategories += sub.subCategories.length
            }
        })
    })

    return {
        total: totalCategories,
        level1: level1Count,
        level2: level2Count,
        level3: level3Count
    }
}

// Export for backward compatibility with old system
export const CATEGORIES = ALL_CATEGORIES.map(cat => ({
    id: cat.id,
    name_th: cat.name_th,
    name_en: cat.name_en,
    slug: cat.slug,
    icon: cat.icon,
    order_index: cat.order_index
}))
