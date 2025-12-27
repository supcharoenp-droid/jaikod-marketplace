/**
 * 🎯 Listing Template Types
 * 
 * Defines the structure for category-specific listing forms
 */

export type FieldType =
    | 'text'
    | 'textarea'
    | 'number'
    | 'select'
    | 'multi-select'
    | 'radio'
    | 'checkbox'
    | 'date'
    | 'year'
    | 'color-picker'
    | 'location'
    | 'price'
    | 'mileage'
    | 'area'  // For real estate (sq.m.)

export interface FieldOption {
    value: string
    label_th: string
    label_en: string
    icon?: string
}

export interface FormField {
    id: string
    name_th: string
    name_en: string
    type: FieldType
    required: boolean
    placeholder_th?: string
    placeholder_en?: string
    options?: FieldOption[]
    unit?: string           // e.g., "km", "sq.m.", "cc"
    min?: number
    max?: number
    defaultValue?: string | number
    helperText_th?: string
    helperText_en?: string
    group?: string          // For grouping related fields
    dependsOn?: {           // Show field only if condition met
        field: string
        value: string | string[]
    }
}

export interface FieldGroup {
    id: string
    name_th: string
    name_en: string
    icon?: string
    fields: string[]        // Field IDs in this group
    collapsible?: boolean
}

export interface ListingTemplate {
    categoryId: number
    categorySlug: string
    subcategoryId?: number
    subcategorySlug?: string
    name_th: string
    name_en: string
    icon: string

    // Form structure
    fields: FormField[]
    fieldGroups: FieldGroup[]

    // AI features
    aiDescriptionPrompt?: string
    aiPriceEstimation?: boolean

    // Validation
    requiredImages?: number
    maxImages?: number

    // SEO
    titleTemplate_th?: string  // e.g., "{brand} {model} ปี {year}"
    titleTemplate_en?: string
}

// Common field definitions that can be reused
export const COMMON_FIELDS = {
    title: {
        id: 'title',
        name_th: 'หัวข้อประกาศ',
        name_en: 'Listing Title',
        type: 'text' as FieldType,
        required: true,
        placeholder_th: 'เช่น Toyota Camry 2020 สภาพดี',
        placeholder_en: 'e.g., Toyota Camry 2020 Excellent Condition',
    },
    description: {
        id: 'description',
        name_th: 'รายละเอียด',
        name_en: 'Description',
        type: 'textarea' as FieldType,
        required: false,
        placeholder_th: 'อธิบายสินค้าของคุณโดยละเอียด...',
        placeholder_en: 'Describe your item in detail...',
    },
    price: {
        id: 'price',
        name_th: 'ราคา',
        name_en: 'Price',
        type: 'price' as FieldType,
        required: true,
        unit: '฿',
    },
    condition: {
        id: 'condition',
        name_th: 'สภาพสินค้า',
        name_en: 'Condition',
        type: 'select' as FieldType,
        required: true,
        options: [
            { value: 'new', label_th: 'ใหม่แกะกล่อง', label_en: 'Brand New' },
            { value: 'like_new', label_th: 'มือสองเหมือนใหม่', label_en: 'Like New' },
            { value: 'good', label_th: 'มือสองสภาพดี', label_en: 'Good Condition' },
            { value: 'fair', label_th: 'มือสองใช้งาน', label_en: 'Fair Condition' },
            { value: 'for_parts', label_th: 'ซาก/อะไหล่', label_en: 'For Parts' },
        ],
    },
    location: {
        id: 'location',
        name_th: 'ที่อยู่',
        name_en: 'Location',
        type: 'location' as FieldType,
        required: true,
    },
    negotiable: {
        id: 'negotiable',
        name_th: 'ต่อรองราคาได้',
        name_en: 'Negotiable',
        type: 'checkbox' as FieldType,
        required: false,
    },
}
