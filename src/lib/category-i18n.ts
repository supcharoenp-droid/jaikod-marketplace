/**
 * Category i18n Helpers
 * 
 * Helper functions to get category/subcategory names in current language
 */

import { CATEGORIES, type Category, type Subcategory } from '@/constants/categories'

export function getCategoryName(categoryId: string | number, language: 'th' | 'en'): string {
    const id = typeof categoryId === 'string' ? parseInt(categoryId) : categoryId
    const category = CATEGORIES.find(c => c.id === id)
    if (!category) return ''

    return language === 'th' ? category.name_th : category.name_en
}

export function getSubcategoryName(
    categoryId: string | number,
    subcategoryId: string | number,
    language: 'th' | 'en'
): string {
    const catId = typeof categoryId === 'string' ? parseInt(categoryId) : categoryId
    const subId = typeof subcategoryId === 'string' ? parseInt(subcategoryId) : subcategoryId

    const category = CATEGORIES.find(c => c.id === catId)
    if (!category || !category.subcategories) return ''

    const subcategory = category.subcategories.find(s => s.id === subId)
    if (!subcategory) return ''

    return language === 'th' ? subcategory.name_th : subcategory.name_en
}

export function getAllCategoriesForLanguage(language: 'th' | 'en'): Array<{
    id: number
    name: string
    slug: string
    icon: string
}> {
    return CATEGORIES.map(cat => ({
        id: cat.id,
        name: language === 'th' ? cat.name_th : cat.name_en,
        slug: cat.slug,
        icon: cat.icon
    }))
}

export function getSubcategoriesForLanguage(
    categoryId: string | number,
    language: 'th' | 'en'
): Array<{
    id: number
    name: string
    slug: string
}> {
    const id = typeof categoryId === 'string' ? parseInt(categoryId) : categoryId
    const category = CATEGORIES.find(c => c.id === id)
    if (!category || !category.subcategories) return []

    return category.subcategories.map(sub => ({
        id: sub.id,
        name: language === 'th' ? sub.name_th : sub.name_en,
        slug: sub.slug
    }))
}
