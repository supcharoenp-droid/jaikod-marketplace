/**
 * DESCRIPTION ENGINE TYPES
 * 
 * Shared types สำหรับ Description Engine
 * 
 * @version 1.0.0
 * @date 2024-12-29
 */

// ============================================
// CORE TYPES
// ============================================

/**
 * Context for AI description generation
 */
export interface AIDescriptionContext {
    productTitle: string
    detectedBrands: string[]
    detectedObjects: string[]
    categoryId: number
    subcategoryId?: number
    categoryName?: string
    subcategoryName?: string
    aiSpecs?: Record<string, string>
    estimatedPrice?: {
        min: number
        max: number
        suggested: number
    }
    userSpecs?: Record<string, string>
    userConditionNotes?: string
    includedItems?: string[]
    language?: 'th' | 'en'
    style?: 'detailed' | 'minimal' | 'marketing'
}

/**
 * Structured description output
 */
export interface StructuredDescription {
    fullText: string
    sections: DescriptionSection[]
    wordCount: number
    characterCount: number
    seoScore: number
    missingFields: MissingField[]
}

export interface MissingField {
    field: string
    label: string
    importance: 'required' | 'recommended' | 'optional'
    placeholder?: string
}

/**
 * Description section
 */
export interface DescriptionSection {
    id: string
    emoji: string
    title: string
    content: string[]
    isEditable: boolean
}

// ============================================
// TEMPLATE TYPES
// ============================================

export type FieldImportance = 'required' | 'recommended' | 'optional'
export type FieldType = 'text' | 'number' | 'select' | 'multiselect' | 'textarea' | 'boolean'

export interface FieldOption {
    value: string
    label_th: string
    label_en: string
}

export interface TemplateField {
    key: string
    label_th: string
    label_en: string
    importance: FieldImportance
    type: FieldType
    extractFromTitle?: boolean
    aiDetectable?: boolean
    placeholder_th?: string
    placeholder_en?: string
    options?: FieldOption[]
    unit?: string
    min?: number
    max?: number
}

export interface TemplateSection {
    id: string
    emoji: string
    title_th: string
    title_en: string
    fields: TemplateField[]
}

/**
 * Category-specific template
 */
export interface CategoryTemplate {
    categoryId: number
    categoryName: string
    emoji: string
    sections: TemplateSection[]
    targetAudience: {
        th: string[]
        en: string[]
    }
    marketingKeywords?: {
        th: string[]
        en: string[]
    }
}

// ============================================
// GENERATION OPTIONS
// ============================================

export interface DescriptionGenerationOptions {
    language: 'th' | 'en'
    style: 'detailed' | 'minimal' | 'marketing'
    includeEmoji: boolean
    includePriceRange: boolean
    includeCallToAction: boolean
    maxLength?: number
}

export const DEFAULT_GENERATION_OPTIONS: DescriptionGenerationOptions = {
    language: 'th',
    style: 'detailed',
    includeEmoji: true,
    includePriceRange: true,
    includeCallToAction: true,
    maxLength: 2000
}

// ============================================
// BUILDER RESULT
// ============================================

export interface DescriptionBuilderResult {
    success: boolean
    description: StructuredDescription | null
    error?: string
    processingTime?: number
}

// ============================================
// SECTION BUILDERS
// ============================================

export type SectionBuilder = (
    context: AIDescriptionContext,
    template: CategoryTemplate,
    options: DescriptionGenerationOptions
) => DescriptionSection | null
