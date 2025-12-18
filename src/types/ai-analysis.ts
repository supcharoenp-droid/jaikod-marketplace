export interface AnalyzedImage {
    id: string
    url: string
    objects_detected: Array<{
        label: string
        confidence: number
        box?: { x: number, y: number, w: number, h: number }
    }>
    ocr_text: string[]
    image_quality_score: number
    suggested_edit: string[]
}

analysis_id: string
images: AnalyzedImage[]
aggregate: AnalysisAggregate
seo: SEOSuggestions
questions_for_seller: QuestionForSeller[]
moderation: ModerationResult
timestamp: string
}

export interface AnalysisAggregate {
    main_category: string
    main_category_confidence: number
    sub_category: string | null
    sub_category_confidence: number
    is_mixed_assets: boolean
    detected_item_label: string
    detected_brand?: string
    detected_model?: string
    color: string[]
    material: string[]
    condition_estimate: {
        label: string
        score: number
    }
    visible_defects: Array<{
        type: string
        location: string
        confidence: number
    }>
    confidence_overall: number

    // New fields for deep intelligence
    price_suggestion?: {
        min: number
        max: number
        recommended: number
        currency: string
    } | null
    illegal_check?: {
        is_illegal: boolean
        reason: string | null
    }
    specific_attributes?: {
        [key: string]: string | number | undefined
    }
    detected_storage?: string
    detected_battery_health?: number
}

export interface SEOSuggestions {
    alt_texts: string[]
    tags: string[]
    seo_title: string
    short_description: string
}

export interface QuestionForSeller {
    q: string
    type: 'yes_no' | 'text' | 'choice'
    priority: number
    options?: string[]
}

export interface ModerationResult {
    flag: boolean
    reasons: string[]
}

export interface ProductAnalysisResult {
    analysis_id: string
    images: AnalyzedImage[]
    aggregate: AnalysisAggregate
    seo: SEOSuggestions
    questions_for_seller: QuestionForSeller[]
    moderation: ModerationResult
    timestamp: string
}
