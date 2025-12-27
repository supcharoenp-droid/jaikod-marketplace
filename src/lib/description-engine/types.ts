/**
 * Description Engine Types
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
    priceEstimate?: {
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

export interface StructuredDescription {
    fullText: string
    sections: DescriptionSection[]
    wordCount: number
    characterCount: number
    seoScore: number
    missingFields: {
        field: string
        label: string
        importance: 'required' | 'recommended' | 'optional'
        placeholder?: string
    }[]
}

export interface DescriptionSection {
    id: string
    emoji: string
    title: string
    content: string[]
    isEditable: boolean
}

export interface CategoryTemplate {
    categoryId: number
    categoryName: string
    emoji: string
    sections: TemplateSection[]
    targetAudience: { th: string[]; en: string[] }
}

export interface TemplateSection {
    id: string
    emoji: string
    title_th: string
    title_en: string
    fields: TemplateField[]
}

export interface TemplateField {
    key: string
    label_th: string
    label_en: string
    importance: 'required' | 'recommended' | 'optional'
    type: 'text' | 'number' | 'select' | 'multiselect' | 'textarea'
    extractFromTitle?: boolean
    aiDetectable?: boolean
    placeholder_th?: string
    placeholder_en?: string
    options?: {
        value: string
        label_th: string
        label_en: string
    }[]
}

// Helper type for bilingual content
export type BilingualText = {
    th: string
    en: string
}
