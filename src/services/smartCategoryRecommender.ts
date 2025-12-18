/**
 * Smart Category Recommendation AI
 * 
 * Simplified, user-friendly wrapper for category detection
 * Provides clear recommendations with friendly explanations
 */

import { detectProductCategory, type CategoryDetectionResult } from './productCategoryDetector'
import { CATEGORIES } from '@/constants/categories'

export interface SmartCategoryRecommendation {
    recommended_main_category: {
        id: number
        name: { th: string; en: string }
        slug: string
        icon: string
    }
    recommended_sub_category?: {
        id: number
        name: { th: string; en: string }
        slug: string
    }
    confidence_percentage: number // 0-100
    explanation_text: {
        th: string
        en: string
    }
    alternatives: Array<{
        category: { id: number; name: { th: string; en: string }; icon: string }
        confidence: number
        reason: { th: string; en: string }
    }>
}

/**
 * Get smart category recommendation with friendly explanation
 */
export async function recommendCategory(
    images: File[],
    userInput?: {
        title?: string
        description?: string
    }
): Promise<SmartCategoryRecommendation> {
    console.log('[SmartCategory] Analyzing for recommendation...')

    try {
        // Run detection
        const detection = await detectProductCategory(images, userInput)

        // Convert to friendly format
        const recommendation = convertToFriendlyRecommendation(detection, userInput)

        console.log(`[SmartCategory] Recommended: ${recommendation.recommended_main_category.name.en} (${recommendation.confidence_percentage}%)`)

        return recommendation
    } catch (error) {
        console.error('[SmartCategory] Error:', error)

        // Return fallback
        return createFallbackRecommendation()
    }
}

/**
 * Convert detection result to friendly recommendation
 */
function convertToFriendlyRecommendation(
    detection: CategoryDetectionResult,
    userInput?: { title?: string; description?: string }
): SmartCategoryRecommendation {
    const primary = detection.primary_category

    // Get full category info
    const category = CATEGORIES.find(c => c.id === primary.category_id)
    if (!category) {
        return createFallbackRecommendation()
    }

    const subcategory = primary.subcategory_id
        ? category.subcategories?.find(s => s.id === primary.subcategory_id)
        : undefined

    // Generate friendly explanation
    const explanation = generateFriendlyExplanation(
        primary,
        detection.detected_objects,
        userInput
    )

    // Build alternatives
    const alternatives = detection.alternative_categories.slice(0, 3).map(alt => {
        const altCategory = CATEGORIES.find(c => c.id === alt.category_id)
        return {
            category: {
                id: alt.category_id,
                name: alt.category_name,
                icon: altCategory?.icon || '📦'
            },
            confidence: alt.confidence_score,
            reason: alt.reasoning
        }
    })

    return {
        recommended_main_category: {
            id: category.id,
            name: {
                th: category.name_th,
                en: category.name_en
            },
            slug: category.slug,
            icon: category.icon
        },
        recommended_sub_category: subcategory ? {
            id: subcategory.id,
            name: {
                th: subcategory.name_th,
                en: subcategory.name_en
            },
            slug: subcategory.slug
        } : undefined,
        confidence_percentage: primary.confidence_score,
        explanation_text: explanation,
        alternatives
    }
}

/**
 * Generate friendly, simple explanation
 */
function generateFriendlyExplanation(
    category: any,
    detectedObjects: any[],
    userInput?: { title?: string; description?: string }
): { th: string; en: string } {
    const categoryName = category.category_name
    const subcategoryName = category.subcategory_name
    const confidence = category.confidence_score

    // Determine what signals we detected
    const hasTitle = userInput?.title && userInput.title.length > 3
    const hasDescription = userInput?.description && userInput.description.length > 10
    const hasObjects = detectedObjects.length > 0

    // Build explanation based on signals
    let th = ''
    let en = ''

    if (confidence >= 90) {
        // Very confident
        if (hasTitle) {
            th = `จากชื่อสินค้า เราเห็นว่าน่าจะเป็น "${subcategoryName?.th || categoryName.th}" แน่นอน`
            en = `Based on the title, this is clearly "${subcategoryName?.en || categoryName.en}"`
        } else {
            th = `จากรูปภาพ เราเห็นว่าน่าจะเป็น "${subcategoryName?.th || categoryName.th}" แน่นอน`
            en = `From the images, this is clearly "${subcategoryName?.en || categoryName.en}"`
        }
    } else if (confidence >= 75) {
        // Confident
        if (hasTitle && hasDescription) {
            th = `จากชื่อและคำอธิบาย เราคิดว่าน่าจะเป็น "${subcategoryName?.th || categoryName.th}"`
            en = `Based on the title and description, this looks like "${subcategoryName?.en || categoryName.en}"`
        } else if (hasTitle) {
            th = `จากชื่อสินค้า ดูเหมือนจะเป็น "${subcategoryName?.th || categoryName.th}"`
            en = `From the title, this appears to be "${subcategoryName?.en || categoryName.en}"`
        } else {
            th = `จากรูปภาพ ดูเหมือนจะเป็น "${subcategoryName?.th || categoryName.th}"`
            en = `From the images, this appears to be "${subcategoryName?.en || categoryName.en}"`
        }
    } else if (confidence >= 60) {
        // Moderately confident
        th = `เราคิดว่าน่าจะเป็น "${subcategoryName?.th || categoryName.th}" แต่คุณสามารถเปลี่ยนได้`
        en = `We think this might be "${subcategoryName?.en || categoryName.en}", but you can change it`
    } else {
        // Low confidence
        th = `เราเดาว่าอาจจะเป็น "${categoryName.th}" กรุณาเลือกหมวดหมู่ที่เหมาะสมเอง`
        en = `Our best guess is "${categoryName.en}" - please select the right category yourself`
    }

    return { th, en }
}

/**
 * Create fallback recommendation
 */
function createFallbackRecommendation(): SmartCategoryRecommendation {
    const othersCategory = CATEGORIES.find(c => c.id === 99) || CATEGORIES[0]

    return {
        recommended_main_category: {
            id: othersCategory.id,
            name: {
                th: othersCategory.name_th,
                en: othersCategory.name_en
            },
            slug: othersCategory.slug,
            icon: othersCategory.icon
        },
        confidence_percentage: 30,
        explanation_text: {
            th: 'เราไม่แน่ใจว่าสินค้าของคุณอยู่หมวดไหน กรุณาเลือกเอง 😊',
            en: 'We\'re not sure about the category - please select it yourself 😊'
        },
        alternatives: []
    }
}

/**
 * Quick recommendation from title only (ultra-fast)
 */
export async function quickRecommendFromTitle(title: string): Promise<SmartCategoryRecommendation | null> {
    if (!title || title.length < 3) return null

    try {
        const result = await recommendCategory([], { title })
        return result
    } catch {
        return null
    }
}

/**
 * Get confidence level label
 */
export function getConfidenceLabel(percentage: number): {
    level: 'very_high' | 'high' | 'medium' | 'low'
    label: { th: string; en: string }
    color: string
    emoji: string
} {
    if (percentage >= 90) {
        return {
            level: 'very_high',
            label: { th: 'แน่นอนมาก', en: 'Very Confident' },
            color: 'green',
            emoji: '✅'
        }
    } else if (percentage >= 75) {
        return {
            level: 'high',
            label: { th: 'มั่นใจ', en: 'Confident' },
            color: 'blue',
            emoji: '👍'
        }
    } else if (percentage >= 60) {
        return {
            level: 'medium',
            label: { th: 'ค่อนข้างมั่นใจ', en: 'Moderately Confident' },
            color: 'yellow',
            emoji: '🤔'
        }
    } else {
        return {
            level: 'low',
            label: { th: 'ไม่แน่ใจ', en: 'Not Confident' },
            color: 'orange',
            emoji: '❓'
        }
    }
}

/**
 * Format category path for display
 */
export function formatCategoryPath(
    recommendation: SmartCategoryRecommendation,
    language: 'th' | 'en'
): string {
    const main = recommendation.recommended_main_category.name[language]
    const sub = recommendation.recommended_sub_category?.name[language]

    if (sub) {
        return `${main} › ${sub}`
    }
    return main
}

/**
 * Get all possible categories for manual selection
 */
export function getAllCategoriesForSelection(): Array<{
    id: number
    name: { th: string; en: string }
    icon: string
    subcategories?: Array<{
        id: number
        name: { th: string; en: string }
    }>
}> {
    return CATEGORIES.map(cat => ({
        id: cat.id,
        name: {
            th: cat.name_th,
            en: cat.name_en
        },
        icon: cat.icon,
        subcategories: cat.subcategories?.map(sub => ({
            id: sub.id,
            name: {
                th: sub.name_th,
                en: sub.name_en
            }
        }))
    }))
}

/**
 * Validate if category selection makes sense
 */
export function validateCategorySelection(
    categoryId: number,
    subcategoryId?: number,
    userInput?: { title?: string; description?: string }
): {
    is_valid: boolean
    warning?: { th: string; en: string }
} {
    const category = CATEGORIES.find(c => c.id === categoryId)
    if (!category) {
        return {
            is_valid: false,
            warning: {
                th: 'หมวดหมู่ไม่ถูกต้อง',
                en: 'Invalid category'
            }
        }
    }

    // Check if subcategory belongs to category
    if (subcategoryId) {
        const subcategory = category.subcategories?.find(s => s.id === subcategoryId)
        if (!subcategory) {
            return {
                is_valid: false,
                warning: {
                    th: 'หมวดหมู่ย่อยไม่ตรงกับหมวดหมู่หลัก',
                    en: 'Subcategory doesn\'t match main category'
                }
            }
        }
    }

    // Check if title/description suggests different category
    if (userInput?.title) {
        const title = userInput.title.toLowerCase()

        // Simple validation examples
        if (categoryId === 3 && !title.includes('phone') && !title.includes('มือถือ') &&
            !title.includes('iphone') && !title.includes('samsung') && !title.includes('tablet')) {
            return {
                is_valid: true,
                warning: {
                    th: 'ชื่อสินค้าไม่ค่อยตรงกับหมวดหมู่ที่เลือก',
                    en: 'Title doesn\'t quite match selected category'
                }
            }
        }
    }

    return { is_valid: true }
}

/**
 * Get popular categories for quick selection
 */
export function getPopularCategories(): Array<{
    id: number
    name: { th: string; en: string }
    icon: string
}> {
    // Return hot and frequently used categories
    return CATEGORIES
        .filter(c => c.is_hot || c.is_new)
        .slice(0, 6)
        .map(cat => ({
            id: cat.id,
            name: {
                th: cat.name_th,
                en: cat.name_en
            },
            icon: cat.icon
        }))
}

/**
 * Search categories by keyword
 */
export function searchCategories(
    keyword: string,
    language: 'th' | 'en'
): Array<{
    id: number
    name: { th: string; en: string }
    icon: string
    match_score: number
}> {
    const query = keyword.toLowerCase()
    const results: Array<any> = []

    for (const category of CATEGORIES) {
        const name = language === 'th' ? category.name_th : category.name_en
        const nameLower = name.toLowerCase()

        if (nameLower.includes(query)) {
            results.push({
                id: category.id,
                name: {
                    th: category.name_th,
                    en: category.name_en
                },
                icon: category.icon,
                match_score: nameLower.startsWith(query) ? 100 : 80
            })
        }

        // Also search subcategories
        category.subcategories?.forEach(sub => {
            const subName = language === 'th' ? sub.name_th : sub.name_en
            const subNameLower = subName.toLowerCase()

            if (subNameLower.includes(query)) {
                results.push({
                    id: category.id,
                    name: {
                        th: `${category.name_th} › ${sub.name_th}`,
                        en: `${category.name_en} › ${sub.name_en}`
                    },
                    icon: category.icon,
                    match_score: subNameLower.startsWith(query) ? 95 : 70
                })
            }
        })
    }

    // Sort by match score
    results.sort((a, b) => b.match_score - a.match_score)

    return results.slice(0, 5)
}
