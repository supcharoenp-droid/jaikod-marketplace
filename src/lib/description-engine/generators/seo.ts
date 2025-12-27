/**
 * SEO Optimization Module
 * 
 * Optimizes product descriptions for search engines
 */

import type { AIDescriptionContext } from '../types'

export interface SEOOptimizationResult {
    optimizedText: string
    keywords: string[]
    metaTitle: string
    metaDescription: string
    score: number
    suggestions: string[]
}

/**
 * Optimize description for SEO
 */
export function optimizeForSEO(
    description: string,
    context: AIDescriptionContext
): SEOOptimizationResult {
    const lang = context.language || 'th'

    // Extract keywords
    const keywords = extractKeywords(description, context)

    // Generate meta tags
    const metaTitle = generateMetaTitle(context, lang)
    const metaDescription = generateMetaDescription(description, context, lang)

    // Calculate SEO score
    const { score, suggestions } = calculateDetailedSEOScore(description, context)

    // Optimize text (add keywords naturally)
    const optimizedText = enhanceWithKeywords(description, keywords)

    return {
        optimizedText,
        keywords,
        metaTitle,
        metaDescription,
        score,
        suggestions
    }
}

/**
 * Extract relevant keywords
 */
function extractKeywords(text: string, context: AIDescriptionContext): string[] {
    const keywords: string[] = []

    // Add product title words
    keywords.push(...context.productTitle.split(/\s+/))

    // Add detected brands
    keywords.push(...context.detectedBrands)

    // Add category name
    if (context.categoryName) {
        keywords.push(context.categoryName)
    }

    // Add subcategory name
    if (context.subcategoryName) {
        keywords.push(context.subcategoryName)
    }

    // Filter and dedupe
    return [...new Set(keywords.filter(k => k.length > 2))]
}

/**
 * Generate SEO-friendly meta title
 */
function generateMetaTitle(context: AIDescriptionContext, lang: 'th' | 'en'): string {
    const parts: string[] = []

    // Product title
    parts.push(context.productTitle)

    // Brand if available
    if (context.detectedBrands.length > 0) {
        parts.push(context.detectedBrands[0])
    }

    // Price if available
    if (context.priceEstimate) {
        parts.push(`${context.priceEstimate.suggested.toLocaleString()} ${lang === 'th' ? 'บาท' : 'THB'}`)
    }

    // Suffix
    parts.push('| JaiKod')

    return parts.join(' - ').substring(0, 70)
}

/**
 * Generate SEO-friendly meta description
 */
function generateMetaDescription(
    description: string,
    context: AIDescriptionContext,
    lang: 'th' | 'en'
): string {
    let meta = description.replace(/[\n\r]+/g, ' ').substring(0, 150)

    // Ensure it ends properly
    if (meta.length === 150) {
        meta = meta.substring(0, meta.lastIndexOf(' ')) + '...'
    }

    return meta
}

/**
 * Calculate detailed SEO score with suggestions
 */
function calculateDetailedSEOScore(
    text: string,
    context: AIDescriptionContext
): { score: number; suggestions: string[] } {
    let score = 50
    const suggestions: string[] = []
    const lang = context.language || 'th'

    // Length check
    if (text.length < 100) {
        suggestions.push(lang === 'th'
            ? 'เพิ่มรายละเอียดอีกสักหน่อย (อย่างน้อย 100 ตัวอักษร)'
            : 'Add more details (at least 100 characters)')
    } else if (text.length >= 100) {
        score += 15
    }

    if (text.length >= 200) {
        score += 10
    }

    // Brand mention
    const hasBrand = context.detectedBrands.some(brand =>
        text.toLowerCase().includes(brand.toLowerCase())
    )
    if (!hasBrand && context.detectedBrands.length > 0) {
        suggestions.push(lang === 'th'
            ? `ควรระบุยี่ห้อ "${context.detectedBrands[0]}" ในคำอธิบาย`
            : `Mention the brand "${context.detectedBrands[0]}" in description`)
    } else if (hasBrand) {
        score += 10
    }

    // Price mention
    if (context.priceEstimate) {
        score += 5
    }

    // Condition mention
    if (context.userConditionNotes) {
        score += 10
    } else {
        suggestions.push(lang === 'th'
            ? 'ระบุสภาพสินค้าให้ชัดเจน'
            : 'Specify the item condition clearly')
    }

    // Has bullet points or structure
    if (text.includes('•') || text.includes('-') || text.includes('✓')) {
        score += 5
    }

    return { score: Math.min(100, score), suggestions }
}

/**
 * Enhance text with keywords (naturally)
 */
function enhanceWithKeywords(text: string, keywords: string[]): string {
    // For now, return as-is. Future: intelligently inject keywords
    return text
}
