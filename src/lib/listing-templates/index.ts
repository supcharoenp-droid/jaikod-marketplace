/**
 * 📦 Listing Templates Index
 * 
 * Central export for all category-specific listing templates
 */

import { ListingTemplate } from './types'
import { CAR_TEMPLATE, MOTORCYCLE_TEMPLATE } from './automotive'
import { MOBILE_PHONE_TEMPLATE, TABLET_TEMPLATE } from './mobile'

// Export types
export * from './types'

// Export all templates
export { CAR_TEMPLATE, MOTORCYCLE_TEMPLATE } from './automotive'
export { MOBILE_PHONE_TEMPLATE, TABLET_TEMPLATE } from './mobile'

// ============================================
// TEMPLATE REGISTRY
// ============================================

/**
 * Get template by category and subcategory slug
 */
export function getListingTemplate(categorySlug: string, subcategorySlug: string): ListingTemplate | null {
    const key = `${categorySlug}/${subcategorySlug}`
    return TEMPLATE_REGISTRY[key] || null
}

/**
 * Get template by category and subcategory IDs
 */
export function getListingTemplateById(categoryId: number, subcategoryId: number): ListingTemplate | null {
    const template = Object.values(TEMPLATE_REGISTRY).find(
        t => t.categoryId === categoryId && t.subcategoryId === subcategoryId
    )
    return template || null
}

/**
 * Check if template exists for category/subcategory
 */
export function hasListingTemplate(categorySlug: string, subcategorySlug: string): boolean {
    return !!getListingTemplate(categorySlug, subcategorySlug)
}

/**
 * Get all available templates
 */
export function getAllTemplates(): ListingTemplate[] {
    return Object.values(TEMPLATE_REGISTRY)
}

/**
 * Get templates by category
 */
export function getTemplatesByCategory(categorySlug: string): ListingTemplate[] {
    return Object.values(TEMPLATE_REGISTRY).filter(t => t.categorySlug === categorySlug)
}

// ============================================
// TEMPLATE REGISTRY MAP
// ============================================

const TEMPLATE_REGISTRY: Record<string, ListingTemplate> = {
    // Automotive
    'automotive/cars': CAR_TEMPLATE,
    'automotive/motorcycles': MOTORCYCLE_TEMPLATE,

    // Mobile & Tablets 📱
    'mobiles/mobile-phones': MOBILE_PHONE_TEMPLATE,
    'mobiles/tablets': TABLET_TEMPLATE,

    // TODO: Add more templates
    // 'real-estate/house': HOUSE_TEMPLATE,
    // 'real-estate/condo': CONDO_TEMPLATE,
    // 'computers/laptops': LAPTOP_TEMPLATE,
}

// ============================================
// DEFAULT TEMPLATE (Fallback)
// ============================================

export const DEFAULT_TEMPLATE: ListingTemplate = {
    categoryId: 99,
    categorySlug: 'others',
    name_th: 'ลงประกาศขาย',
    name_en: 'Create Listing',
    icon: '📦',

    fields: [
        {
            id: 'title',
            name_th: 'หัวข้อประกาศ',
            name_en: 'Title',
            type: 'text',
            required: true,
            placeholder_th: 'ใส่ชื่อสินค้าของคุณ',
            placeholder_en: 'Enter your item name',
            group: 'basic',
        },
        {
            id: 'description',
            name_th: 'รายละเอียด',
            name_en: 'Description',
            type: 'textarea',
            required: false,
            placeholder_th: 'อธิบายสินค้าของคุณ',
            placeholder_en: 'Describe your item',
            group: 'basic',
        },
        {
            id: 'price',
            name_th: 'ราคา',
            name_en: 'Price',
            type: 'price',
            required: true,
            unit: '฿',
            group: 'pricing',
        },
        {
            id: 'condition',
            name_th: 'สภาพ',
            name_en: 'Condition',
            type: 'select',
            required: true,
            options: [
                { value: 'new', label_th: 'ใหม่', label_en: 'New' },
                { value: 'used', label_th: 'มือสอง', label_en: 'Used' },
            ],
            group: 'basic',
        },
        {
            id: 'location',
            name_th: 'ที่อยู่',
            name_en: 'Location',
            type: 'location',
            required: true,
            group: 'details',
        },
    ],

    fieldGroups: [
        { id: 'basic', name_th: '📝 ข้อมูลพื้นฐาน', name_en: '📝 Basic Info', fields: ['title', 'description', 'condition'] },
        { id: 'pricing', name_th: '💰 ราคา', name_en: '💰 Pricing', fields: ['price'] },
        { id: 'details', name_th: '📋 รายละเอียด', name_en: '📋 Details', fields: ['location'] },
    ],

    requiredImages: 1,
    maxImages: 10,
}
