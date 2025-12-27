/**
 * General/Default Template
 * Used for categories without specialized templates
 */

import type { CategoryTemplate } from '../types'

export const GENERAL_TEMPLATE: CategoryTemplate = {
    categoryId: 0,
    categoryName: 'General',
    emoji: '📦',
    sections: [
        {
            id: 'product_info',
            emoji: '📝',
            title_th: 'รายละเอียดสินค้า',
            title_en: 'Product Details',
            fields: [
                {
                    key: 'brand',
                    label_th: 'แบรนด์',
                    label_en: 'Brand',
                    importance: 'recommended',
                    type: 'text',
                    aiDetectable: true
                },
                {
                    key: 'model',
                    label_th: 'รุ่น',
                    label_en: 'Model',
                    importance: 'recommended',
                    type: 'text',
                    aiDetectable: true
                },
                {
                    key: 'color',
                    label_th: 'สี',
                    label_en: 'Color',
                    importance: 'optional',
                    type: 'text'
                },
            ]
        },
        {
            id: 'condition',
            emoji: '✅',
            title_th: 'สภาพสินค้า',
            title_en: 'Condition',
            fields: [
                {
                    key: 'condition_status',
                    label_th: 'สภาพ',
                    label_en: 'Condition',
                    importance: 'required',
                    type: 'select',
                    options: [
                        { value: 'new', label_th: '🆕 ใหม่', label_en: '🆕 New' },
                        { value: 'like_new', label_th: '✨ เหมือนใหม่', label_en: '✨ Like New' },
                        { value: 'good', label_th: '👍 ดี', label_en: '👍 Good' },
                        { value: 'fair', label_th: '🔧 พอใช้', label_en: '🔧 Fair' },
                    ]
                },
                {
                    key: 'defects',
                    label_th: 'ตำหนิ',
                    label_en: 'Defects',
                    importance: 'recommended',
                    type: 'textarea'
                },
            ]
        },
        {
            id: 'included',
            emoji: '📦',
            title_th: 'สิ่งที่ได้รับ',
            title_en: 'Included Items',
            fields: [
                {
                    key: 'package_contents',
                    label_th: 'ในกล่องมี',
                    label_en: 'Package Contents',
                    importance: 'optional',
                    type: 'textarea'
                },
            ]
        }
    ],
    targetAudience: {
        th: ['ผู้ซื้อทั่วไป'],
        en: ['General buyers']
    }
}
