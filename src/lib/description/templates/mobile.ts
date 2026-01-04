/**
 * MOBILE PHONE TEMPLATE
 * 
 * ข้อมูล template สำหรับหมวด Mobiles & Tablets (ID: 3)
 * 
 * @version 1.0.0
 */

import type { CategoryTemplate } from '../types'

export const MOBILE_TEMPLATE: CategoryTemplate = {
    categoryId: 3,
    categoryName: 'Mobiles & Tablets',
    emoji: '📱',
    sections: [
        {
            id: 'device_info',
            emoji: '📱',
            title_th: 'ข้อมูลเครื่อง',
            title_en: 'Device Information',
            fields: [
                {
                    key: 'brand', label_th: 'ยี่ห้อ', label_en: 'Brand', importance: 'required', type: 'select', extractFromTitle: true, aiDetectable: true,
                    options: [
                        { value: 'Apple', label_th: '🍎 Apple', label_en: '🍎 Apple' },
                        { value: 'Samsung', label_th: '🌟 Samsung', label_en: '🌟 Samsung' },
                        { value: 'Xiaomi', label_th: '📱 Xiaomi', label_en: '📱 Xiaomi' },
                        { value: 'OPPO', label_th: '💚 OPPO', label_en: '💚 OPPO' },
                        { value: 'Vivo', label_th: '💙 Vivo', label_en: '💙 Vivo' },
                        { value: 'Realme', label_th: '🔶 Realme', label_en: '🔶 Realme' },
                        { value: 'OnePlus', label_th: '🔴 OnePlus', label_en: '🔴 OnePlus' },
                        { value: 'Google', label_th: '🔍 Google', label_en: '🔍 Google' },
                        { value: 'Huawei', label_th: '🌸 Huawei', label_en: '🌸 Huawei' },
                        { value: 'Other', label_th: '📝 อื่นๆ', label_en: '📝 Other' },
                    ]
                },
                { key: 'model', label_th: 'รุ่น', label_en: 'Model', importance: 'required', type: 'text', extractFromTitle: true, aiDetectable: true },
                {
                    key: 'storage', label_th: 'ความจุ', label_en: 'Storage', importance: 'required', type: 'select',
                    options: [
                        { value: '64GB', label_th: '64GB', label_en: '64GB' },
                        { value: '128GB', label_th: '128GB', label_en: '128GB' },
                        { value: '256GB', label_th: '256GB', label_en: '256GB' },
                        { value: '512GB', label_th: '512GB', label_en: '512GB' },
                        { value: '1TB', label_th: '1TB', label_en: '1TB' },
                    ]
                },
                {
                    key: 'color', label_th: 'สี', label_en: 'Color', importance: 'required', type: 'select',
                    options: [
                        { value: 'black', label_th: '⬛ ดำ', label_en: '⬛ Black' },
                        { value: 'white', label_th: '⬜ ขาว', label_en: '⬜ White' },
                        { value: 'gold', label_th: '🟡 ทอง', label_en: '🟡 Gold' },
                        { value: 'blue', label_th: '🔵 น้ำเงิน', label_en: '🔵 Blue' },
                        { value: 'purple', label_th: '🟣 ม่วง', label_en: '🟣 Purple' },
                        { value: 'green', label_th: '🟢 เขียว', label_en: '🟢 Green' },
                        { value: 'other', label_th: '🎨 อื่นๆ', label_en: '🎨 Other' },
                    ]
                },
            ]
        },
        {
            id: 'origin',
            emoji: '🏷️',
            title_th: 'ที่มา',
            title_en: 'Origin',
            fields: [
                {
                    key: 'origin', label_th: 'ที่มา', label_en: 'Origin', importance: 'required', type: 'select',
                    options: [
                        { value: 'thai_official', label_th: '🇹🇭 ศูนย์ไทย', label_en: '🇹🇭 Thai Official' },
                        { value: 'import', label_th: '🌍 นำเข้า', label_en: '🌍 Import' },
                        { value: 'refurbished', label_th: '♻️ Refurbished', label_en: '♻️ Refurbished' },
                    ]
                },
                {
                    key: 'activation_status', label_th: 'สถานะ', label_en: 'Status', importance: 'required', type: 'select',
                    options: [
                        { value: 'ready', label_th: '✅ พร้อมใช้', label_en: '✅ Ready' },
                        { value: 'pending', label_th: '⏳ รอปลด iCloud', label_en: '⏳ Pending iCloud' },
                        { value: 'locked', label_th: '🔒 ติด Lock', label_en: '🔒 Locked' },
                    ]
                },
            ]
        },
        {
            id: 'condition',
            emoji: '✅',
            title_th: 'สภาพ',
            title_en: 'Condition',
            fields: [
                {
                    key: 'overall_grade', label_th: 'เกรด', label_en: 'Grade', importance: 'required', type: 'select',
                    options: [
                        { value: 'S', label_th: '✨ S (99%)', label_en: '✨ Grade S' },
                        { value: 'A', label_th: '⭐ A (95%)', label_en: '⭐ Grade A' },
                        { value: 'B+', label_th: '👍 B+ (90%)', label_en: '👍 Grade B+' },
                        { value: 'B', label_th: '👌 B (85%)', label_en: '👌 Grade B' },
                        { value: 'C', label_th: '📝 C (75%)', label_en: '📝 Grade C' },
                    ]
                },
                {
                    key: 'battery', label_th: 'แบตเตอรี่', label_en: 'Battery', importance: 'required', type: 'select',
                    options: [
                        { value: '100', label_th: '🔋 100%', label_en: '🔋 100%' },
                        { value: '90-99', label_th: '🔋 90-99%', label_en: '🔋 90-99%' },
                        { value: '80-89', label_th: '🔋 80-89%', label_en: '🔋 80-89%' },
                        { value: '70-79', label_th: '🪫 70-79%', label_en: '🪫 70-79%' },
                        { value: 'below-70', label_th: '⚠️ ต่ำกว่า 70%', label_en: '⚠️ Below 70%' },
                    ]
                },
                {
                    key: 'screen', label_th: 'หน้าจอ', label_en: 'Screen', importance: 'required', type: 'select',
                    options: [
                        { value: 'perfect', label_th: '✨ สมบูรณ์', label_en: '✨ Perfect' },
                        { value: 'minor', label_th: '📝 รอยเล็กน้อย', label_en: '📝 Minor scratches' },
                        { value: 'scratches', label_th: '📝 รอยเห็นชัด', label_en: '📝 Visible scratches' },
                        { value: 'cracked', label_th: '💔 แตก', label_en: '💔 Cracked' },
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
                    key: 'warranty', label_th: 'ประกันเหลือ', label_en: 'Warranty', importance: 'recommended', type: 'select',
                    options: [
                        { value: 'more_1y', label_th: '🏆 มากกว่า 1 ปี', label_en: '🏆 More than 1 year' },
                        { value: '6_12m', label_th: '✅ 6-12 เดือน', label_en: '✅ 6-12 months' },
                        { value: '3_6m', label_th: '📆 3-6 เดือน', label_en: '📆 3-6 months' },
                        { value: 'expired', label_th: '❌ หมดแล้ว', label_en: '❌ Expired' },
                    ]
                },
                {
                    key: 'original_box', label_th: 'กล่อง', label_en: 'Box', importance: 'recommended', type: 'select',
                    options: [
                        { value: 'complete', label_th: '📦 มีครบ', label_en: '📦 Complete' },
                        { value: 'box_only', label_th: '📦 มีกล่อง', label_en: '📦 Box only' },
                        { value: 'device_only', label_th: '📱 เครื่องอย่างเดียว', label_en: '📱 Device only' },
                    ]
                },
            ]
        },
        {
            id: 'included',
            emoji: '📦',
            title_th: 'อุปกรณ์',
            title_en: 'Included',
            fields: [
                {
                    key: 'included_items', label_th: 'รายการ', label_en: 'Items', importance: 'recommended', type: 'multiselect',
                    options: [
                        { value: 'device', label_th: '📱 เครื่อง', label_en: '📱 Device' },
                        { value: 'charger', label_th: '🔌 สายชาร์จ', label_en: '🔌 Cable' },
                        { value: 'adapter', label_th: '🔋 หัวชาร์จ', label_en: '🔋 Adapter' },
                        { value: 'box', label_th: '📦 กล่อง', label_en: '📦 Box' },
                        { value: 'case', label_th: '🛡️ เคส', label_en: '🛡️ Case' },
                    ]
                },
            ]
        },
    ],
    targetAudience: {
        th: ['คนชอบถ่ายรูป', 'เล่นโซเชียล', 'เล่นเกม', 'ทำงาน', 'นักศึกษา'],
        en: ['Photography', 'Social media', 'Gaming', 'Work', 'Students']
    }
}
