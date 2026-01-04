/**
 * TEMPLATE REGISTRY
 * 
 * Central registry สำหรับ category templates
 * ใช้ lazy loading เพื่อ performance
 * 
 * @version 1.0.0
 */

import type { CategoryTemplate } from '../types'
import { COMPUTER_TEMPLATE } from './computer'
import { MOBILE_TEMPLATE } from './mobile'

// ==========================================
// TEMPLATE REGISTRY
// ==========================================

const CATEGORY_TEMPLATES: Map<number, CategoryTemplate> = new Map([
    [4, COMPUTER_TEMPLATE],
    [3, MOBILE_TEMPLATE],
])

// ==========================================
// DEFAULT TEMPLATE (fallback)
// ==========================================

const DEFAULT_TEMPLATE: CategoryTemplate = {
    categoryId: 0,
    categoryName: 'General',
    emoji: '📦',
    sections: [
        {
            id: 'details',
            emoji: '📋',
            title_th: 'รายละเอียด',
            title_en: 'Details',
            fields: [
                { key: 'brand', label_th: 'แบรนด์', label_en: 'Brand', importance: 'recommended', type: 'text', aiDetectable: true },
                { key: 'model', label_th: 'รุ่น', label_en: 'Model', importance: 'recommended', type: 'text' },
            ]
        },
        {
            id: 'condition',
            emoji: '✅',
            title_th: 'สภาพ',
            title_en: 'Condition',
            fields: [
                {
                    key: 'overall', label_th: 'สภาพโดยรวม', label_en: 'Overall', importance: 'required', type: 'select',
                    options: [
                        { value: 'new', label_th: '🆕 ใหม่', label_en: '🆕 New' },
                        { value: 'like_new', label_th: '✨ เหมือนใหม่', label_en: '✨ Like New' },
                        { value: 'good', label_th: '👍 ดี', label_en: '👍 Good' },
                        { value: 'fair', label_th: '👌 พอใช้', label_en: '👌 Fair' },
                        { value: 'used', label_th: '📝 มือสอง', label_en: '📝 Used' },
                    ]
                },
            ]
        },
        {
            id: 'included',
            emoji: '📦',
            title_th: 'อุปกรณ์ที่ให้',
            title_en: 'Included',
            fields: [
                {
                    key: 'has_box', label_th: 'มีกล่อง', label_en: 'Has Box', importance: 'optional', type: 'select',
                    options: [
                        { value: 'yes', label_th: '✅ มี', label_en: '✅ Yes' },
                        { value: 'no', label_th: '❌ ไม่มี', label_en: '❌ No' },
                    ]
                },
            ]
        },
    ],
    targetAudience: {
        th: ['ผู้ใช้ทั่วไป'],
        en: ['General users']
    }
}

// ==========================================
// REGISTRY FUNCTIONS
// ==========================================

/**
 * Get template by category ID
 */
export function getTemplateByCategory(categoryId: number): CategoryTemplate {
    return CATEGORY_TEMPLATES.get(categoryId) || DEFAULT_TEMPLATE
}

/**
 * Get template by subcategory ID
 */
export function getTemplateBySubcategory(
    categoryId: number,
    subcategoryId: number
): CategoryTemplate {
    // For now, return category template
    // TODO: Add subcategory-specific templates
    return getTemplateByCategory(categoryId)
}

/**
 * Check if template exists for category
 */
export function hasTemplateFor(categoryId: number): boolean {
    return CATEGORY_TEMPLATES.has(categoryId)
}

/**
 * Get all registered category IDs
 */
export function getRegisteredCategories(): number[] {
    return Array.from(CATEGORY_TEMPLATES.keys())
}

/**
 * Register a new template
 */
export function registerTemplate(template: CategoryTemplate): void {
    CATEGORY_TEMPLATES.set(template.categoryId, template)
}

// ==========================================
// EXPORTS
// ==========================================

export {
    CATEGORY_TEMPLATES,
    DEFAULT_TEMPLATE,
    COMPUTER_TEMPLATE,
    MOBILE_TEMPLATE
}
