/**
 * Legacy Support
 * 
 * Maintains backward compatibility with old function signatures
 * from world-class-description-engine.ts
 */

import type { AIDescriptionContext, StructuredDescription } from './types'
import { generateStructuredDescription } from './generators/structured'
import { generateMarketingDescription } from './generators/marketing'
import { getTemplateForCategory } from './templates'

/**
 * Legacy function: generateDescriptionForCategory
 * 
 * @deprecated Use generateStructuredDescription instead
 */
export function generateDescriptionForCategory(
    categoryId: number,
    specs: Record<string, string>,
    options?: {
        language?: 'th' | 'en'
        style?: 'detailed' | 'minimal' | 'marketing'
    }
): string {
    const context: AIDescriptionContext = {
        productTitle: specs.title || specs.brand || 'Product',
        detectedBrands: specs.brand ? [specs.brand] : [],
        detectedObjects: [],
        categoryId,
        aiSpecs: specs,
        userSpecs: specs,
        language: options?.language || 'th',
        style: options?.style || 'detailed'
    }

    if (options?.style === 'marketing') {
        return generateMarketingDescription(context)
    }

    const result = generateStructuredDescription(context)
    return result.fullText
}

/**
 * Legacy function: getCategoryTemplate
 * 
 * @deprecated Use getTemplateForCategory from templates module
 */
export function getCategoryTemplate(categoryId: number) {
    return getTemplateForCategory(categoryId)
}

/**
 * Legacy function: buildDescription
 * 
 * @deprecated Use generateStructuredDescription instead
 */
export function buildDescription(
    template: any,
    specs: Record<string, string>,
    lang: 'th' | 'en' = 'th'
): StructuredDescription {
    const context: AIDescriptionContext = {
        productTitle: specs.title || specs.brand || 'Product',
        detectedBrands: specs.brand ? [specs.brand] : [],
        detectedObjects: [],
        categoryId: template.categoryId,
        aiSpecs: specs,
        userSpecs: specs,
        language: lang
    }

    return generateStructuredDescription(context)
}
