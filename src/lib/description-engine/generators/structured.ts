/**
 * Structured Description Generator
 * 
 * Generates product descriptions using category-specific templates
 */

import type {
    AIDescriptionContext,
    StructuredDescription,
    DescriptionSection,
    CategoryTemplate
} from '../types'
import { getTemplateForCategory } from '../templates'

/**
 * Generate a structured product description
 */
export function generateStructuredDescription(
    context: AIDescriptionContext
): StructuredDescription {
    const template = getTemplateForCategory(context.categoryId)
    const lang = context.language || 'th'

    const sections = buildSections(template, context, lang)
    const fullText = sectionsToText(sections, lang)

    // Calculate SEO score
    const seoScore = calculateSEOScore(fullText, context)

    // Find missing required fields
    const missingFields = findMissingFields(template, context, lang)

    return {
        fullText,
        sections,
        wordCount: countWords(fullText),
        characterCount: fullText.length,
        seoScore,
        missingFields
    }
}

/**
 * Build sections from template
 */
function buildSections(
    template: CategoryTemplate,
    context: AIDescriptionContext,
    lang: 'th' | 'en'
): DescriptionSection[] {
    return template.sections.map(section => {
        const content: string[] = []

        for (const field of section.fields) {
            // Try to get value from user specs first, then AI specs
            const value = context.userSpecs?.[field.key]
                || context.aiSpecs?.[field.key]

            if (value) {
                const label = lang === 'th' ? field.label_th : field.label_en
                content.push(`${label}: ${value}`)
            }
        }

        return {
            id: section.id,
            emoji: section.emoji,
            title: lang === 'th' ? section.title_th : section.title_en,
            content,
            isEditable: true
        }
    }).filter(section => section.content.length > 0)
}

/**
 * Convert sections to plain text
 */
function sectionsToText(sections: DescriptionSection[], lang: 'th' | 'en'): string {
    let text = ''

    for (const section of sections) {
        text += `${section.emoji} ${section.title}\n`
        for (const line of section.content) {
            text += `• ${line}\n`
        }
        text += '\n'
    }

    return text.trim()
}

/**
 * Calculate SEO score based on content quality
 */
function calculateSEOScore(text: string, context: AIDescriptionContext): number {
    let score = 50 // Base score

    // Length bonus (100-500 chars is optimal)
    if (text.length >= 100) score += 10
    if (text.length >= 200) score += 10
    if (text.length >= 300) score += 5

    // Contains brand name
    if (context.detectedBrands.some(brand => text.toLowerCase().includes(brand.toLowerCase()))) {
        score += 10
    }

    // Contains product title words
    const titleWords = context.productTitle.split(/\s+/)
    const matchingWords = titleWords.filter(word => text.includes(word))
    score += Math.min(15, matchingWords.length * 3)

    // Contains price info
    if (context.priceEstimate) {
        score += 5
    }

    return Math.min(100, score)
}

/**
 * Find missing required/recommended fields
 */
function findMissingFields(
    template: CategoryTemplate,
    context: AIDescriptionContext,
    lang: 'th' | 'en'
): StructuredDescription['missingFields'] {
    const missing: StructuredDescription['missingFields'] = []

    for (const section of template.sections) {
        for (const field of section.fields) {
            const hasValue = context.userSpecs?.[field.key] || context.aiSpecs?.[field.key]

            if (!hasValue && (field.importance === 'required' || field.importance === 'recommended')) {
                missing.push({
                    field: field.key,
                    label: lang === 'th' ? field.label_th : field.label_en,
                    importance: field.importance,
                    placeholder: lang === 'th' ? field.placeholder_th : field.placeholder_en
                })
            }
        }
    }

    return missing
}

/**
 * Count words in text (supports Thai)
 */
function countWords(text: string): number {
    // Simple word count - split by whitespace
    return text.split(/\s+/).filter(word => word.length > 0).length
}

// Alias for backward compatibility
export const generateWorldClassDescription = generateStructuredDescription
