/**
 * Dynamic Product Detail Form - Type Definitions
 * 
 * Comprehensive type system for category-specific product detail forms
 * with AI-assisted field suggestions
 */

// ============================================================================
// Field Type System
// ============================================================================

export type FieldType =
    | 'text'           // Single-line text input
    | 'textarea'       // Multi-line text input
    | 'number'         // Numeric input
    | 'select'         // Single selection dropdown
    | 'multiselect'    // Multiple selection
    | 'boolean'        // Yes/No toggle
    | 'range'          // Min-max range
    | 'date'           //Date picker
    | 'tags'           // Tag input (multiple strings)

export type FieldImportance =
    | 'critical'       // 🔴 Must fill (affects trust score)
    | 'recommended'    // 🟡 Should fill (increases conversion)
    | 'optional'       // ⚪ Nice to have

export type DataSource =
    | 'title'          // Extracted from title
    | 'description'    // Extracted from description
    | 'image'          // Extracted from image (OCR/Vision)
    | 'inferred'       // Inferred from context
    | 'user'           // User input

// ============================================================================
// Field Schema
// ============================================================================

export interface BaseFieldSchema {
    id: string
    label: string
    type: FieldType
    importance: FieldImportance
    placeholder?: string
    helper?: string
    aiPrompt?: string
    validation?: FieldValidation
    condition?: FieldCondition
}

export interface TextFieldSchema extends BaseFieldSchema {
    type: 'text'
    maxLength?: number
    pattern?: RegExp
    suffix?: string
    prefix?: string
}

export interface TextareaFieldSchema extends BaseFieldSchema {
    type: 'textarea'
    rows?: number
    maxLength?: number
}

export interface NumberFieldSchema extends BaseFieldSchema {
    type: 'number'
    min?: number
    max?: number
    step?: number
    suffix?: string  // e.g., 'กม.', 'ตร.ม.'
    prefix?: string
}

export interface SelectFieldSchema extends BaseFieldSchema {
    type: 'select'
    options: string[] | SelectOption[]
    allowCustom?: boolean
}

export interface MultiselectFieldSchema extends BaseFieldSchema {
    type: 'multiselect'
    options: string[] | SelectOption[]
    min?: number
    max?: number
}

export interface BooleanFieldSchema extends BaseFieldSchema {
    type: 'boolean'
    label_true?: string
    label_false?: string
}

export interface RangeFieldSchema extends BaseFieldSchema {
    type: 'range'
    min: number
    max: number
    unit?: string
}

export interface DateFieldSchema extends BaseFieldSchema {
    type: 'date'
    minDate?: Date
    maxDate?: Date
    format?: string
}

export interface TagsFieldSchema extends BaseFieldSchema {
    type: 'tags'
    maxTags?: number
    suggestions?: string[]
}

export type FieldSchema =
    | TextFieldSchema
    | TextareaFieldSchema
    | NumberFieldSchema
    | SelectFieldSchema
    | MultiselectFieldSchema
    | BooleanFieldSchema
    | RangeFieldSchema
    | DateFieldSchema
    | TagsFieldSchema

// ============================================================================
// Supporting Types
// ============================================================================

export interface SelectOption {
    value: string
    label: string
    description?: string
    disabled?: boolean
}

export interface FieldValidation {
    required?: boolean
    custom?: (value: any) => boolean | string
    asyncValidation?: (value: any) => Promise<boolean | string>
}

export interface FieldCondition {
    // Show field only if condition is met
    [fieldId: string]: any  // e.g., { propertyType: 'คอนโด' }
}

// ============================================================================
// Category Schema
// ============================================================================

export interface CategorySchema {
    categoryId: string
    categoryName: string
    icon: string
    description: string
    fields: FieldSchema[]
    aiInstructions: string
    validationRules?: CategoryValidation[]
}

export interface CategoryValidation {
    rule: string
    fields: string[]
    validator: (values: Record<string, any>) => boolean | string
    message: string
}

// ============================================================================
// AI Suggestions
// ============================================================================

export interface FieldSuggestion {
    value: any
    confidence: number  // 0-1
    source: DataSource
    reasoning?: string
}

export interface AISuggestions {
    suggestedFields: Record<string, FieldSuggestion>
    missingCritical: string[]
    recommendations: string[]
    overallConfidence: number
}

export interface AIAnalysisRequest {
    category: string
    title: string
    description: string
    images?: string[]
}

export interface AIAnalysisResponse {
    suggestions: AISuggestions
    timestamp: number
    modelVersion: string
}

// ============================================================================
// Form State
// ============================================================================

export interface DetailFormData {
    [fieldId: string]: any
}

export interface DetailFormState {
    categoryId: string
    data: DetailFormData
    aiSuggestions?: AISuggestions
    validation: ValidationState
    isDirty: boolean
    isSubmitting: boolean
}

export interface ValidationState {
    isValid: boolean
    errors: Record<string, string>
    warnings: Record<string, string>
}

//============================================================================
// Component Props
// ============================================================================

export interface DynamicDetailFormProps {
    categoryId: string
    initialData?: DetailFormData
    aiSuggestions?: AISuggestions
    onChange: (data: DetailFormData) => void
    onValidationChange?: (state: ValidationState) => void
    showAIAssistant?: boolean
    readonly?: boolean
}

export interface FieldRendererProps {
    field: FieldSchema
    value: any
    onChange: (value: any) => void
    error?: string
    warning?: string
    aiSuggestion?: FieldSuggestion
    readonly?: boolean
}

export interface AIAssistantPanelProps {
    suggestions: AISuggestions
    appliedFields: Set<string>
    onAccept: (fieldId: string) => void
    onReject: (fieldId: string) => void
    onAcceptAll: () => void
}

// ============================================================================
// Utility Types
// ============================================================================

export interface FieldGroup {
    label: string
    icon?: string
    fields: string[]  // Field IDs
    collapsible?: boolean
    defaultExpanded?: boolean
}

export interface CategorySchemaWithGroups extends CategorySchema {
    fieldGroups?: FieldGroup[]
}

// ============================================================================
// Constants
// ============================================================================

export const FIELD_IMPORTANCE_CONFIG = {
    critical: {
        color: 'red',
        icon: '🔴',
        badge: 'จำเป็น',
        description: 'ข้อมูลสำคัญที่ต้องกรอก'
    },
    recommended: {
        color: 'yellow',
        icon: '🟡',
        badge: 'แนะนำ',
        description: 'ช่วยเพิ่มความน่าเชื่อถือ'
    },
    optional: {
        color: 'gray',
        icon: '⚪',
        badge: 'ทางเลือก',
        description: 'กรอกหรือไม่ก็ได้'
    }
} as const

export const AI_CONFIDENCE_THRESHOLD = {
    high: 0.85,      // Auto-fill with high confidence
    medium: 0.70,    // Suggest to user
    low: 0.50        // Show but mark as uncertain
} as const

// ============================================================================
// Helper Functions Types
// ============================================================================

export type FieldValueGetter = (data: DetailFormData, fieldId: string) => any
export type FieldValueSetter = (data: DetailFormData, fieldId: string, value: any) => DetailFormData

export type FieldValidator = (
    field: FieldSchema,
    value: any,
    allData: DetailFormData
) => string | null

export type SchemaLoader = (categoryId: string) => Promise<CategorySchema | null>

// ============================================================================
// Events
// ============================================================================

export interface FieldChangeEvent {
    fieldId: string
    oldValue: any
    newValue: any
    source: 'user' | 'ai' | 'validation'
}

export interface FormSubmitEvent {
    categoryId: string
    data: DetailFormData
    validation: ValidationState
    timestamp: number
}

// Note: All types are already exported inline above
