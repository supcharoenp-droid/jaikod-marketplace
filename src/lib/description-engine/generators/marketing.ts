/**
 * Marketing Description Generator
 * 
 * Generates sales-focused product descriptions
 */

import type { AIDescriptionContext } from '../types'

/**
 * Generate a marketing-focused description
 */
export function generateMarketingDescription(
    context: AIDescriptionContext
): string {
    const lang = context.language || 'th'

    if (lang === 'th') {
        return generateThaiMarketing(context)
    } else {
        return generateEnglishMarketing(context)
    }
}

/**
 * Thai marketing description
 */
function generateThaiMarketing(context: AIDescriptionContext): string {
    const lines: string[] = []

    // Opening hook
    lines.push(`✨ ${context.productTitle} ✨`)
    lines.push('')

    // Key selling points
    if (context.detectedBrands.length > 0) {
        lines.push(`🏷️ แบรนด์: ${context.detectedBrands.join(', ')}`)
    }

    // Price appeal
    if (context.priceEstimate) {
        const savings = context.priceEstimate.max - context.priceEstimate.suggested
        if (savings > 0) {
            lines.push(`💰 ราคาพิเศษ! ประหยัดกว่า ${savings.toLocaleString()} บาท`)
        }
    }

    // Add specs if available
    if (context.aiSpecs) {
        lines.push('')
        lines.push('📋 รายละเอียด:')
        for (const [key, value] of Object.entries(context.aiSpecs)) {
            if (value) {
                lines.push(`• ${value}`)
            }
        }
    }

    // Condition
    if (context.userConditionNotes) {
        lines.push('')
        lines.push(`✅ สภาพ: ${context.userConditionNotes}`)
    }

    // Included items
    if (context.includedItems && context.includedItems.length > 0) {
        lines.push('')
        lines.push(`📦 ในกล่องมี: ${context.includedItems.join(', ')}`)
    }

    // Call to action
    lines.push('')
    lines.push('💬 สนใจ inbox มาได้เลยครับ/ค่ะ!')
    lines.push('🚚 ส่งได้ทั่วประเทศ')

    return lines.join('\n')
}

/**
 * English marketing description
 */
function generateEnglishMarketing(context: AIDescriptionContext): string {
    const lines: string[] = []

    // Opening hook
    lines.push(`✨ ${context.productTitle} ✨`)
    lines.push('')

    // Key selling points
    if (context.detectedBrands.length > 0) {
        lines.push(`🏷️ Brand: ${context.detectedBrands.join(', ')}`)
    }

    // Price appeal
    if (context.priceEstimate) {
        lines.push(`💰 Great value at ${context.priceEstimate.suggested.toLocaleString()} THB!`)
    }

    // Add specs if available
    if (context.aiSpecs) {
        lines.push('')
        lines.push('📋 Details:')
        for (const [key, value] of Object.entries(context.aiSpecs)) {
            if (value) {
                lines.push(`• ${value}`)
            }
        }
    }

    // Condition
    if (context.userConditionNotes) {
        lines.push('')
        lines.push(`✅ Condition: ${context.userConditionNotes}`)
    }

    // Included items
    if (context.includedItems && context.includedItems.length > 0) {
        lines.push('')
        lines.push(`📦 Includes: ${context.includedItems.join(', ')}`)
    }

    // Call to action
    lines.push('')
    lines.push('💬 Interested? Send me a message!')
    lines.push('🚚 Nationwide shipping available')

    return lines.join('\n')
}
