/**
 * BILINGUAL PRODUCT LISTING AI
 * 
 * Features:
 * - Thai / English language support
 * - AI-powered content generation
 * - Consistency validation
 * - Independent editing
 * - Smart language switching
 * 
 * Rules:
 * 1. Thai and English are equal (not source/translation)
 * 2. Structured data stays identical
 * 3. User has final control
 * 4. Never auto-override user content
 */

export interface BilingualContent {
    title: {
        th: string
        en: string
    }
    description: {
        th: string
        en: string
    }
}

export interface ProductFormData {
    category: string
    subcategory?: string
    brand?: string
    model?: string
    condition: string
    price: number
    specs?: Record<string, string>
}

export interface BilingualValidationResult {
    active_language: 'TH' | 'EN'
    missing_language: 'TH' | 'EN' | 'none'
    suggested_content: BilingualContent
    bilingual_consistency_score: number
    detected_language_mismatches: LanguageMismatch[]
    soft_fix_suggestion: {
        th: string
        en: string
    }
}

export interface LanguageMismatch {
    field: string
    issue: string
    th_value: string
    en_value: string
    severity: 'low' | 'medium' | 'high'
}

/**
 * STEP 1: Detect Language State
 */
export function detectLanguageState(
    currentLanguage: 'TH' | 'EN',
    content: BilingualContent
): {
    active_language: 'TH' | 'EN'
    missing_language: 'TH' | 'EN' | 'none'
    has_th_content: boolean
    has_en_content: boolean
} {
    const has_th_content = !!(content.title.th || content.description.th)
    const has_en_content = !!(content.title.en || content.description.en)

    let missing_language: 'TH' | 'EN' | 'none' = 'none'

    if (!has_th_content && has_en_content) {
        missing_language = 'TH'
    } else if (has_th_content && !has_en_content) {
        missing_language = 'EN'
    }

    return {
        active_language: currentLanguage,
        missing_language,
        has_th_content,
        has_en_content
    }
}

/**
 * STEP 2: Generate Content Suggestion
 */
export function generateBilingualContent(
    formData: ProductFormData,
    existingContent: BilingualContent,
    missingLanguage: 'TH' | 'EN' | 'none'
): BilingualContent {
    const suggested: BilingualContent = {
        title: { th: '', en: '' },
        description: { th: '', en: '' }
    }

    // Generate Thai if missing
    if (missingLanguage === 'TH') {
        suggested.title.th = generateThaiTitle(formData, existingContent.title.en)
        suggested.description.th = generateThaiDescription(formData, existingContent.description.en)
    }

    // Generate English if missing
    if (missingLanguage === 'EN') {
        suggested.title.en = generateEnglishTitle(formData, existingContent.title.th)
        suggested.description.en = generateEnglishDescription(formData, existingContent.description.th)
    }

    // If both exist, keep current
    if (missingLanguage === 'none') {
        return existingContent
    }

    return suggested
}

/**
 * Generate Thai Title from English or FormData
 */
function generateThaiTitle(formData: ProductFormData, englishTitle?: string): string {
    // If English title exists, adapt it (NOT word-for-word translation!)
    if (englishTitle) {
        // Extract key info from English
        const parts = []

        if (formData.brand) parts.push(formData.brand)
        if (formData.model) parts.push(formData.model)

        // Add condition in Thai
        const conditionMap: Record<string, string> = {
            'new': 'ใหม่',
            'like_new': 'เหมือนใหม่',
            'good': 'สภาพดี',
            'fair': 'ปกติ',
            'used': 'มือสอง'
        }
        if (formData.condition) {
            parts.push(conditionMap[formData.condition] || 'มือสอง')
        }

        return parts.join(' ')
    }

    // Generate from form data
    return generateTitleFromForm(formData, 'TH')
}

/**
 * Generate English Title from Thai or FormData
 */
function generateEnglishTitle(formData: ProductFormData, thaiTitle?: string): string {
    // Generate from form data (natural English, not translation)
    const parts = []

    // Category-specific title patterns
    if (formData.category === '4') {
        // Computers - English speakers expect specs first
        parts.push(formData.brand || '')
        parts.push(formData.model || '')

        // Add condition
        const conditionMap: Record<string, string> = {
            'new': 'Brand New',
            'like_new': 'Like New',
            'good': 'Good Condition',
            'fair': 'Fair',
            'used': 'Used'
        }
        if (formData.condition) {
            parts.push(`(${conditionMap[formData.condition] || 'Used'})`)
        }
    }

    return parts.filter(Boolean).join(' ')
}

/**
 * Generate Thai Description
 */
function generateThaiDescription(formData: ProductFormData, englishDescription?: string): string {
    const parts = []

    // Product info
    if (formData.brand && formData.model) {
        parts.push(`${formData.brand} ${formData.model}`)
    }

    // Condition
    const conditionText: Record<string, string> = {
        'new': 'สภาพใหม่ ยังไม่แกะกล่อง',
        'like_new': 'สภาพเหมือนใหม่ ใช้งานน้อย',
        'good': 'สภาพดี ใช้งานปกติ',
        'fair': 'สภาพปกติ มีร่องรอยการใช้งาน',
        'used': 'สภาพมือสอง'
    }
    parts.push(conditionText[formData.condition] || '')

    // Specs
    if (formData.specs) {
        Object.entries(formData.specs).forEach(([key, value]) => {
            parts.push(`${key}: ${value}`)
        })
    }

    // Price
    parts.push(`\nราคา: ${formData.price.toLocaleString()} บาท`)

    return parts.filter(Boolean).join('\n')
}

/**
 * Generate English Description
 */
function generateEnglishDescription(formData: ProductFormData, thaiDescription?: string): string {
    const parts = []

    // Product info
    if (formData.brand && formData.model) {
        parts.push(`${formData.brand} ${formData.model}`)
    }

    // Condition (detailed English)
    const conditionText: Record<string, string> = {
        'new': 'Brand new, never opened',
        'like_new': 'Like new condition, minimal use',
        'good': 'Good working condition',
        'fair': 'Fair condition with signs of use',
        'used': 'Used condition'
    }
    parts.push(`Condition: ${conditionText[formData.condition] || 'Used'}`)

    // Specs
    if (formData.specs) {
        parts.push('\nSpecifications:')
        Object.entries(formData.specs).forEach(([key, value]) => {
            parts.push(`• ${key}: ${value}`)
        })
    }

    // Price
    parts.push(`\nPrice: ฿${formData.price.toLocaleString()}`)

    return parts.filter(Boolean).join('\n')
}

/**
 * Generate title from form (helper)
 */
function generateTitleFromForm(formData: ProductFormData, language: 'TH' | 'EN'): string {
    const parts = []

    if (formData.brand) parts.push(formData.brand)
    if (formData.model) parts.push(formData.model)

    if (language === 'TH') {
        const conditionMap: Record<string, string> = {
            'new': 'ใหม่',
            'like_new': 'เหมือนใหม่',
            'good': 'สภาพดี',
            'used': 'มือสอง'
        }
        if (formData.condition) {
            parts.push(conditionMap[formData.condition] || '')
        }
    } else {
        if (formData.condition === 'new') {
            parts.push('New')
        }
    }

    return parts.filter(Boolean).join(' ')
}

/**
 * STEP 3: Validate Consistency
 */
export function validateBilingualConsistency(
    content: BilingualContent,
    formData: ProductFormData
): {
    consistency_score: number
    mismatches: LanguageMismatch[]
} {
    const mismatches: LanguageMismatch[] = []
    let score = 100

    // Check if both languages mention the brand
    const thHasBrand = formData.brand ? content.title.th.includes(formData.brand) : true
    const enHasBrand = formData.brand ? content.title.en.includes(formData.brand) : true

    if (thHasBrand !== enHasBrand) {
        mismatches.push({
            field: 'brand',
            issue: 'Brand mentioned in one language but not the other',
            th_value: content.title.th,
            en_value: content.title.en,
            severity: 'medium'
        })
        score -= 20
    }

    // Check if model is mentioned
    const thHasModel = formData.model ? content.title.th.includes(formData.model) : true
    const enHasModel = formData.model ? content.title.en.includes(formData.model) : true

    if (thHasModel !== enHasModel) {
        mismatches.push({
            field: 'model',
            issue: 'Model number missing in one language',
            th_value: content.title.th,
            en_value: content.title.en,
            severity: 'high'
        })
        score -= 30
    }

    return {
        consistency_score: Math.max(score, 0),
        mismatches
    }
}

/**
 * STEP 4 & 5: Main Bilingual Analysis Function
 */
export function analyzeBilingualListing(
    currentLanguage: 'TH' | 'EN',
    content: BilingualContent,
    formData: ProductFormData
): BilingualValidationResult {
    // Step 1: Detect state
    const state = detectLanguageState(currentLanguage, content)

    // Step 2: Generate suggestions if needed
    const suggested = generateBilingualContent(formData, content, state.missing_language)

    // Step 3: Validate consistency
    const validation = validateBilingualConsistency(content, formData)

    // Step 4: Generate soft fix suggestions
    const soft_fix_suggestion = {
        th: validation.mismatches.length > 0
            ? `แนะนำเพิ่ม: ${validation.mismatches.map(m => m.field).join(', ')}`
            : '',
        en: validation.mismatches.length > 0
            ? `Suggested: Add ${validation.mismatches.map(m => m.field).join(', ')}`
            : ''
    }

    return {
        active_language: state.active_language,
        missing_language: state.missing_language,
        suggested_content: suggested,
        bilingual_consistency_score: validation.consistency_score,
        detected_language_mismatches: validation.mismatches,
        soft_fix_suggestion
    }
}
