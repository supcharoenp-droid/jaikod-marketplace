/**
 * Smart Subcategory Validator
 * Validates title-subcategory consistency and provides auto-fix suggestions
 */

import { detectSubcategory, type SubcategoryRecommendation } from './subcategory-intelligence'

export interface ValidationResult {
    isValid: boolean
    confidence: number
    warnings: ValidationWarning[]
    suggestion?: SubcategoryRecommendation
}

export interface ValidationWarning {
    type: 'mismatch' | 'low_confidence' | 'conflict'
    severity: 'error' | 'warning' | 'info'
    message: string
    suggestedFix?: {
        subcategoryId: string
        subcategoryName: string
        action: string
    }
}

/**
 * Validates if product title matches the selected subcategory
 */
export function validateTitleSubcategoryMatch(
    title: string,
    description: string,
    categoryId: number,
    selectedSubcategoryId: string | undefined
): ValidationResult {
    const warnings: ValidationWarning[] = []

    // If no subcategory selected, suggest one
    if (!selectedSubcategoryId) {
        const detected = detectSubcategory({
            categoryId,
            title,
            description,
        })

        if (detected && detected.confidence >= 0.6) {
            warnings.push({
                type: 'low_confidence',
                severity: 'warning',
                message: `แนะนำหมวดย่อย: "${detected.subcategoryName}" (${(detected.confidence * 100).toFixed(0)}% มั่นใจ)`,
                suggestedFix: {
                    subcategoryId: detected.subcategoryId,
                    subcategoryName: detected.subcategoryName,
                    action: 'คลิกเพื่อเลือกหมวดที่แนะนำ'
                }
            })
        }

        return {
            isValid: true,  // Not invalid, just missing subcategory
            confidence: detected?.confidence || 0,
            warnings,
            suggestion: detected || undefined
        }
    }

    // Detect what subcategory the title suggests
    const detected = detectSubcategory({
        categoryId,
        title,
        description,
    })

    if (!detected) {
        // No strong match detected - could be okay
        return {
            isValid: true,
            confidence: 0,
            warnings: []
        }
    }

    // Check if detected subcategory matches selected one
    const matchesSelected = detected.subcategoryId === selectedSubcategoryId

    if (!matchesSelected && detected.confidence >= 0.5) {
        // Strong mismatch detected
        const matchedKeywordsStr = detected.matchedKeywords.slice(0, 3).join(', ')

        warnings.push({
            type: 'mismatch',
            severity: detected.confidence >= 0.7 ? 'error' : 'warning',
            message: `⚠️ ชื่อสินค้ามีคำว่า "${matchedKeywordsStr}" ซึ่งเหมาะกับ "${detected.subcategoryName}" มากกว่าหมวดที่เลือก`,
            suggestedFix: {
                subcategoryId: detected.subcategoryId,
                subcategoryName: detected.subcategoryName,
                action: 'แก้ไขหมวดให้ถูกต้อง'
            }
        })

        return {
            isValid: detected.confidence < 0.7,  // Only invalid if very confident
            confidence: detected.confidence,
            warnings,
            suggestion: detected
        }
    }

    // Low confidence match
    if (matchesSelected && detected.confidence < 0.5) {
        warnings.push({
            type: 'low_confidence',
            severity: 'info',
            message: `ℹ️ มั่นใจ ${(detected.confidence * 100).toFixed(0)}% ว่าหมวดนี้ถูกต้อง - พิจารณาเพิ่มข้อมูลเพื่อความชัดเจน`,
        })
    }

    return {
        isValid: true,
        confidence: detected.confidence,
        warnings,
        suggestion: detected
    }
}

/**
 * Get user-friendly validation message
 */
export function getValidationMessage(result: ValidationResult): string {
    if (result.warnings.length === 0) {
        return ''
    }

    const primaryWarning = result.warnings[0]
    return primaryWarning.message
}

/**
 * Check if validation should block form submission
 */
export function shouldBlockSubmission(result: ValidationResult): boolean {
    return result.warnings.some(w => w.severity === 'error')
}
