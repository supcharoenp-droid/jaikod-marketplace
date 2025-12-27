/**
 * Fashion Template (Clothing, Accessories)
 * Category IDs: 7 (Fashion), 8 (Beauty)
 */

import type { CategoryTemplate } from '../types'

export const FASHION_TEMPLATE: CategoryTemplate = {
    categoryId: 7,
    categoryName: 'Fashion',
    emoji: '👗',
    sections: [
        {
            id: 'product_info',
            emoji: '📝',
            title_th: 'ข้อมูลสินค้า',
            title_en: 'Product Info',
            fields: [
                { key: 'brand', label_th: 'แบรนด์', label_en: 'Brand', importance: 'required', type: 'text', extractFromTitle: true, aiDetectable: true },
                { key: 'type', label_th: 'ประเภท', label_en: 'Type', importance: 'required', type: 'text', aiDetectable: true },
                { key: 'color', label_th: 'สี', label_en: 'Color', importance: 'required', type: 'text', aiDetectable: true },
                { key: 'material', label_th: 'วัสดุ', label_en: 'Material', importance: 'recommended', type: 'text', aiDetectable: true },
            ]
        },
        {
            id: 'sizing',
            emoji: '📐',
            title_th: 'ขนาด',
            title_en: 'Sizing',
            fields: [
                {
                    key: 'size',
                    label_th: 'ไซส์',
                    label_en: 'Size',
                    importance: 'required',
                    type: 'select',
                    options: [
                        { value: 'XS', label_th: 'XS', label_en: 'XS' },
                        { value: 'S', label_th: 'S', label_en: 'S' },
                        { value: 'M', label_th: 'M', label_en: 'M' },
                        { value: 'L', label_th: 'L', label_en: 'L' },
                        { value: 'XL', label_th: 'XL', label_en: 'XL' },
                        { value: 'XXL', label_th: 'XXL', label_en: 'XXL' },
                        { value: 'freesize', label_th: 'Freesize', label_en: 'Freesize' },
                    ]
                },
                { key: 'bust', label_th: 'รอบอก', label_en: 'Bust', importance: 'optional', type: 'text', placeholder_th: 'นิ้ว', placeholder_en: 'inches' },
                { key: 'waist', label_th: 'รอบเอว', label_en: 'Waist', importance: 'optional', type: 'text', placeholder_th: 'นิ้ว', placeholder_en: 'inches' },
                { key: 'length', label_th: 'ความยาว', label_en: 'Length', importance: 'optional', type: 'text', placeholder_th: 'นิ้ว', placeholder_en: 'inches' },
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
                    label_th: 'สภาพ',
                    label_en: 'Condition',
                    importance: 'required',
                    type: 'select',
                    options: [
                        { value: 'new_with_tag', label_th: '🏷️ ใหม่ป้ายห้อย', label_en: '🏷️ New with Tags' },
                        { value: 'new', label_th: '🆕 ใหม่', label_en: '🆕 New' },
                        { value: 'like_new', label_th: '✨ เหมือนใหม่', label_en: '✨ Like New' },
                        { value: 'good', label_th: '👍 ดี', label_en: '👍 Good' },
                        { value: 'fair', label_th: '🔧 พอใช้', label_en: '🔧 Fair' },
                    ]
                },
                {
                    key: 'usage',
                    label_th: 'การใช้งาน',
                    label_en: 'Usage',
                    importance: 'recommended',
                    type: 'select',
                    options: [
                        { value: 'never', label_th: '🆕 ไม่เคยใส่', label_en: '🆕 Never worn' },
                        { value: '1-2', label_th: '1️⃣ ใส่ 1-2 ครั้ง', label_en: '1️⃣ Worn 1-2 times' },
                        { value: 'few', label_th: '🔢 ใส่ไม่กี่ครั้ง', label_en: '🔢 Worn a few times' },
                        { value: 'regularly', label_th: '♻️ ใส่ประจำ', label_en: '♻️ Worn regularly' },
                    ]
                },
                { key: 'defects', label_th: 'ตำหนิ', label_en: 'Defects', importance: 'recommended', type: 'textarea' },
            ]
        },
        {
            id: 'authenticity',
            emoji: '✨',
            title_th: 'ความแท้',
            title_en: 'Authenticity',
            fields: [
                {
                    key: 'authenticity',
                    label_th: 'ความแท้',
                    label_en: 'Authenticity',
                    importance: 'recommended',
                    type: 'select',
                    options: [
                        { value: 'authentic', label_th: '✅ ของแท้ 100%', label_en: '✅ 100% Authentic' },
                        { value: 'with_receipt', label_th: '🧾 มีใบเสร็จ', label_en: '🧾 With Receipt' },
                        { value: 'unverified', label_th: '❓ ไม่ยืนยัน', label_en: '❓ Unverified' },
                    ]
                },
                { key: 'purchase_location', label_th: 'ซื้อจาก', label_en: 'Purchased From', importance: 'optional', type: 'text' },
            ]
        }
    ],
    targetAudience: {
        th: ['คนรักแฟชั่น', 'นักช้อป', 'คนหาของแบรนด์เนม'],
        en: ['Fashion lovers', 'Shoppers', 'Brand seekers']
    }
}
