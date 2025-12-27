/**
 * Smart Subcategory Validator
 * Validates title-subcategory consistency and provides auto-fix suggestions
 */

import { detectSubcategory, type SubcategoryRecommendation } from './subcategory-intelligence'

// ============================================
// SUBCATEGORY FAMILY RELATIONS
// ============================================
// Define which subcategories are "related" and share common keywords
// This prevents false positive warnings when keywords overlap legitimately

const SUBCATEGORY_FAMILIES: Record<string, string[]> = {
    // ============================================
    // Computer Family (Cat 4): All share CPU/RAM/Storage keywords
    // ============================================
    'computer_core': ['401', '402', '407', '410'],  // Notebook, Desktop, Gaming PC, PC Parts
    'computer_peripherals': ['403', '404', '408', '409'],  // Monitor, Peripherals, Keyboard, Mouse

    // ============================================
    // Mobile Family (Cat 3): Phone and accessories share brand keywords
    // ============================================
    'mobile_devices': ['301', '302'],  // Phone, Tablet
    'mobile_accessories': ['303', '304', '305', '306', '307'],  // Smartwatch, Accessories, Parts, Cases, Chargers

    // ============================================
    // Camera Family (Cat 8): Body, lens, and accessories share brand keywords
    // ============================================
    'camera_body': ['801', '802'],  // DSLR, Mirrorless
    'camera_accessories': ['803', '804', '805', '806'],  // Lens, Tripod, Flash, Accessories

    // ============================================
    // Fashion Family (Cat 6): Clothes and accessories share brand/style keywords
    // ============================================
    'fashion_clothing': ['601', '602', '603'],  // Men's, Women's, Kids
    'fashion_accessories': ['604', '605', '606', '607'],  // Bags, Shoes, Watches, Accessories

    // ============================================
    // Gaming Family (Cat 7): Console, games, and gear share gaming keywords
    // ============================================
    'gaming_consoles': ['701', '702'],  // Console, Handheld
    'gaming_accessories': ['703', '704', '705'],  // Controller, Games, Gaming Gear

    // ============================================
    // Automotive Family (Cat 1): Vehicles and parts share brand keywords
    // ============================================
    'automotive_vehicles': ['101', '102', '106', '107', '108'],  // Car, Motorcycle, Pickup, Van, Classic
    'automotive_parts': ['103', '104', '105', '109'],  // Parts, Accessories, Wheels, Maintenance

    // ============================================
    // Real Estate Family (Cat 2): Different property types share location/spec keywords
    // ============================================
    'realestate_residential': ['201', '202', '203', '204'],  // House, Condo, Townhouse, Land
    'realestate_commercial': ['205', '206', '207', '208'],  // Commercial, Rental, Warehouse, Office

    // ============================================
    // Pets Family (Cat 10): Animals and supplies share pet-related keywords
    // ============================================
    'pets_animals': ['1001', '1002'],  // Dogs, Cats
    'pets_supplies': ['1003', '1004', '1005', '1006'],  // Food, Toys, Equipment, Cage

    // ============================================
    // Kids Family (Cat 15): Kids items share age-related keywords
    // ============================================
    'kids_essentials': ['1501', '1502', '1503'],  // Baby gear, Clothes, Stroller
    'kids_toys': ['1504', '1505'],  // Toys, Educational

    // ============================================
    // Home Appliances Family (Cat 5): Share brand/power keywords
    // ============================================
    'appliances_cooling': ['501', '502'],  // AC, Fan
    'appliances_kitchen': ['503', '504', '505'],  // Fridge, Washing, Kitchen
    'appliances_av': ['506', '507'],  // TV, Audio
}

/**
 * Check if two subcategories belong to the same "family"
 * Used to suppress false positive warnings for legitimate keyword overlap
 */
function checkSubcategoryFamilyRelation(
    selectedSubcatId: string | undefined,
    detectedSubcatId: string
): boolean {
    if (!selectedSubcatId) return false

    // Check if both subcategories are in the same family
    for (const familyMembers of Object.values(SUBCATEGORY_FAMILIES)) {
        const selectedInFamily = familyMembers.includes(selectedSubcatId)
        const detectedInFamily = familyMembers.includes(detectedSubcatId)

        if (selectedInFamily && detectedInFamily) {
            return true // Both are in the same family
        }
    }

    return false
}

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
    // ⚠️ Normalize both to numbers for proper comparison
    const selectedId = typeof selectedSubcategoryId === 'string'
        ? parseInt(selectedSubcategoryId, 10)
        : selectedSubcategoryId
    const detectedId = typeof detected.subcategoryId === 'string'
        ? parseInt(detected.subcategoryId, 10)
        : detected.subcategoryId

    const matchesSelected = selectedId === detectedId

    console.log('📋 [Validator] Comparing subcategories:', {
        selected: selectedId,
        detected: detectedId,
        matchesSelected
    })

    // ✅ If already matches, no warning needed!
    if (matchesSelected) {
        return {
            isValid: true,
            confidence: detected.confidence,
            warnings: [],
            suggestion: detected
        }
    }

    // 🆕 SMART FAMILY CHECK: Check if subcategories are in the same "family"
    // This prevents false warnings like "core i5 belongs to PC Parts" when user selects Notebook
    const areRelatedSubcategories = checkSubcategoryFamilyRelation(
        selectedSubcategoryId,
        detected.subcategoryId
    )

    if (!matchesSelected && detected.confidence >= 0.5) {
        // 🆕 If selected and detected are in same family, reduce severity or skip warning
        if (areRelatedSubcategories) {
            // Don't show warning for related subcategories
            // (e.g., Notebook and PC Parts both have CPUs in their titles)
            console.log(`📋 [Validator] Skipping warning: ${selectedSubcategoryId} and ${detected.subcategoryId} are related subcategories`)
            return {
                isValid: true,
                confidence: detected.confidence,
                warnings: [], // No warning for related subcategories
                // ✅ FIX: Don't return detected (410) as suggestion when user already selected (401)
                // This was causing incorrect override from Notebook → PC Parts
                suggestion: undefined  // Let the already-selected subcategory stay
            }
        }

        // Strong mismatch detected - show warning
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
