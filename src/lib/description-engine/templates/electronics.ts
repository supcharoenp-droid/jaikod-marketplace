/**
 * Electronics Template (Phones, Cameras, Appliances)
 * Category IDs: 3 (Phones), 5 (Cameras), 6 (Appliances)
 */

import type { CategoryTemplate } from '../types'

export const ELECTRONICS_TEMPLATE: CategoryTemplate = {
    categoryId: 3,
    categoryName: 'Electronics',
    emoji: '📱',
    sections: [
        {
            id: 'product_info',
            emoji: '📝',
            title_th: 'ข้อมูลสินค้า',
            title_en: 'Product Info',
            fields: [
                { key: 'brand', label_th: 'แบรนด์', label_en: 'Brand', importance: 'required', type: 'text', extractFromTitle: true, aiDetectable: true },
                { key: 'model', label_th: 'รุ่น', label_en: 'Model', importance: 'required', type: 'text', extractFromTitle: true, aiDetectable: true },
                { key: 'color', label_th: 'สี', label_en: 'Color', importance: 'recommended', type: 'text', aiDetectable: true },
                { key: 'storage', label_th: 'ความจุ', label_en: 'Storage', importance: 'recommended', type: 'text', aiDetectable: true },
            ]
        },
        {
            id: 'condition',
            emoji: '✅',
            title_th: 'สภาพ',
            title_en: 'Condition',
            fields: [
                {
                    key: 'condition_status',
                    label_th: 'สภาพโดยรวม',
                    label_en: 'Overall Condition',
                    importance: 'required',
                    type: 'select',
                    options: [
                        { value: 'new', label_th: '🆕 ใหม่ (ไม่แกะกล่อง)', label_en: '🆕 New (Sealed)' },
                        { value: 'like_new', label_th: '✨ เหมือนใหม่', label_en: '✨ Like New' },
                        { value: 'excellent', label_th: '🌟 ดีเยี่ยม', label_en: '🌟 Excellent' },
                        { value: 'good', label_th: '👍 ดี', label_en: '👍 Good' },
                        { value: 'fair', label_th: '🔧 พอใช้', label_en: '🔧 Fair' },
                    ]
                },
                {
                    key: 'battery_health',
                    label_th: 'สุขภาพแบตเตอรี่',
                    label_en: 'Battery Health',
                    importance: 'recommended',
                    type: 'select',
                    options: [
                        { value: '90+', label_th: '🔋 90%+ (ดีมาก)', label_en: '🔋 90%+ (Excellent)' },
                        { value: '80-89', label_th: '🔋 80-89% (ดี)', label_en: '🔋 80-89% (Good)' },
                        { value: '70-79', label_th: '🪫 70-79% (พอใช้)', label_en: '🪫 70-79% (Fair)' },
                        { value: 'below70', label_th: '⚠️ ต่ำกว่า 70%', label_en: '⚠️ Below 70%' },
                        { value: 'unknown', label_th: '❓ ไม่ทราบ', label_en: '❓ Unknown' },
                    ]
                },
                { key: 'defects', label_th: 'ตำหนิ', label_en: 'Defects', importance: 'recommended', type: 'textarea' },
            ]
        },
        {
            id: 'included',
            emoji: '📦',
            title_th: 'อุปกรณ์ที่ให้',
            title_en: 'Included Items',
            fields: [
                {
                    key: 'accessories',
                    label_th: 'อุปกรณ์เสริม',
                    label_en: 'Accessories',
                    importance: 'recommended',
                    type: 'multiselect',
                    options: [
                        { value: 'charger', label_th: '🔌 ที่ชาร์จ', label_en: '🔌 Charger' },
                        { value: 'cable', label_th: '🔗 สายชาร์จ', label_en: '🔗 Cable' },
                        { value: 'box', label_th: '📦 กล่อง', label_en: '📦 Original Box' },
                        { value: 'case', label_th: '🛡️ เคส', label_en: '🛡️ Case' },
                        { value: 'screen_protector', label_th: '📱 ฟิล์มกันรอย', label_en: '📱 Screen Protector' },
                        { value: 'earbuds', label_th: '🎧 หูฟัง', label_en: '🎧 Earbuds' },
                    ]
                },
            ]
        },
        {
            id: 'warranty',
            emoji: '🛡️',
            title_th: 'ประกัน',
            title_en: 'Warranty',
            fields: [
                {
                    key: 'warranty_status',
                    label_th: 'สถานะประกัน',
                    label_en: 'Warranty Status',
                    importance: 'optional',
                    type: 'select',
                    options: [
                        { value: 'active', label_th: '✅ ยังประกันอยู่', label_en: '✅ Active' },
                        { value: 'expired', label_th: '⏰ หมดประกัน', label_en: '⏰ Expired' },
                        { value: 'none', label_th: '❌ ไม่มีประกัน', label_en: '❌ No Warranty' },
                    ]
                },
                { key: 'warranty_until', label_th: 'หมดประกันวันที่', label_en: 'Warranty Until', importance: 'optional', type: 'text' },
            ]
        }
    ],
    targetAudience: {
        th: ['คนหาโทรศัพท์มือสอง', 'นักถ่ายภาพ', 'คนทั่วไป'],
        en: ['Used phone buyers', 'Photographers', 'General consumers']
    }
}
