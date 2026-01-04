/**
 * COMPUTER TEMPLATE
 * 
 * ข้อมูล template สำหรับหมวด Computers & IT (ID: 4)
 * 
 * @version 1.0.0
 */

import type { CategoryTemplate } from '../types'

export const COMPUTER_TEMPLATE: CategoryTemplate = {
    categoryId: 4,
    categoryName: 'Computers & IT',
    emoji: '💻',
    sections: [
        {
            id: 'specs',
            emoji: '🔧',
            title_th: 'สเปค',
            title_en: 'Specifications',
            fields: [
                { key: 'brand', label_th: 'แบรนด์', label_en: 'Brand', importance: 'required', type: 'text', extractFromTitle: true, aiDetectable: true },
                { key: 'model', label_th: 'รุ่น', label_en: 'Model', importance: 'required', type: 'text', extractFromTitle: true, aiDetectable: true },
                { key: 'cpu', label_th: 'CPU', label_en: 'CPU/Processor', importance: 'required', type: 'text', aiDetectable: true },
                {
                    key: 'ram', label_th: 'RAM', label_en: 'RAM', importance: 'required', type: 'select',
                    options: [
                        { value: '4GB', label_th: '4GB', label_en: '4GB' },
                        { value: '8GB', label_th: '8GB', label_en: '8GB' },
                        { value: '16GB', label_th: '16GB', label_en: '16GB' },
                        { value: '32GB', label_th: '32GB', label_en: '32GB' },
                        { value: '64GB', label_th: '64GB', label_en: '64GB' },
                    ]
                },
                { key: 'storage', label_th: 'ความจุ', label_en: 'Storage', importance: 'required', type: 'text', aiDetectable: true },
                { key: 'gpu', label_th: 'การ์ดจอ', label_en: 'GPU', importance: 'recommended', type: 'text', aiDetectable: true },
                { key: 'screen', label_th: 'หน้าจอ', label_en: 'Display', importance: 'recommended', type: 'text', aiDetectable: true },
                {
                    key: 'os', label_th: 'ระบบปฏิบัติการ', label_en: 'Operating System', importance: 'optional', type: 'select',
                    options: [
                        { value: 'Windows 11', label_th: 'Windows 11', label_en: 'Windows 11' },
                        { value: 'Windows 10', label_th: 'Windows 10', label_en: 'Windows 10' },
                        { value: 'macOS', label_th: 'macOS', label_en: 'macOS' },
                        { value: 'Linux', label_th: 'Linux', label_en: 'Linux' },
                        { value: 'No OS', label_th: 'ไม่มี OS', label_en: 'No OS' },
                    ]
                },
            ]
        },
        {
            id: 'condition',
            emoji: '✅',
            title_th: 'รายละเอียดเพิ่มเติม',
            title_en: 'Additional Details',
            fields: [
                {
                    key: 'battery', label_th: 'สุขภาพแบตเตอรี่', label_en: 'Battery Health', importance: 'recommended', type: 'select',
                    options: [
                        { value: '90-100', label_th: '🔋 90-100% (ดีมาก)', label_en: '🔋 90-100% (Excellent)' },
                        { value: '80-89', label_th: '🔋 80-89% (ดี)', label_en: '🔋 80-89% (Good)' },
                        { value: '70-79', label_th: '🪫 70-79% (พอใช้)', label_en: '🪫 70-79% (Fair)' },
                        { value: '60-69', label_th: '🪫 60-69% (ควรเปลี่ยน)', label_en: '🪫 60-69% (Replace soon)' },
                        { value: 'below-60', label_th: '⚠️ ต่ำกว่า 60%', label_en: '⚠️ Below 60%' },
                        { value: 'unknown', label_th: '❓ ไม่ทราบ', label_en: '❓ Unknown' },
                    ]
                },
                {
                    key: 'defects', label_th: 'ตำหนิ', label_en: 'Defects', importance: 'recommended', type: 'multiselect',
                    options: [
                        { value: 'none', label_th: '✨ ไม่มีตำหนิ', label_en: '✨ No defects' },
                        { value: 'minor_scratches', label_th: '📝 รอยขีดข่วนเล็กน้อย', label_en: '📝 Minor scratches' },
                        { value: 'noticeable_scratches', label_th: '📝 รอยขีดข่วนเห็นชัด', label_en: '📝 Noticeable scratches' },
                        { value: 'dead_pixel', label_th: '🖥️ Dead Pixel', label_en: '🖥️ Dead pixels' },
                        { value: 'key_wear', label_th: '⌨️ ปุ่มคีย์บอร์ดสึก', label_en: '⌨️ Key wear' },
                        { value: 'fan_noise', label_th: '🌀 พัดลมมีเสียงดัง', label_en: '🌀 Fan noise' },
                        { value: 'battery_weak', label_th: '🪫 แบตเตอรี่เสื่อม', label_en: '🪫 Battery degraded' },
                        { value: 'other', label_th: '📝 อื่นๆ', label_en: '📝 Other' },
                    ]
                },
                {
                    key: 'warranty', label_th: 'ประกัน', label_en: 'Warranty', importance: 'optional', type: 'select',
                    options: [
                        { value: 'expired', label_th: '❌ หมดประกันแล้ว', label_en: '❌ Expired' },
                        { value: 'less_3m', label_th: '⏰ น้อยกว่า 3 เดือน', label_en: '⏰ Less than 3 months' },
                        { value: '3_6m', label_th: '📆 3-6 เดือน', label_en: '📆 3-6 months' },
                        { value: '6_12m', label_th: '✅ 6-12 เดือน', label_en: '✅ 6-12 months' },
                        { value: 'more_1y', label_th: '🏆 มากกว่า 1 ปี', label_en: '🏆 More than 1 year' },
                    ]
                },
                {
                    key: 'usage_age', label_th: 'อายุการใช้งาน', label_en: 'Usage Period', importance: 'recommended', type: 'select',
                    options: [
                        { value: 'new', label_th: '🆕 ยังไม่เคยใช้', label_en: '🆕 Never used' },
                        { value: 'less_3m', label_th: '✨ น้อยกว่า 3 เดือน', label_en: '✨ Less than 3 months' },
                        { value: '3_6m', label_th: '📆 3-6 เดือน', label_en: '📆 3-6 months' },
                        { value: '6_12m', label_th: '📆 6-12 เดือน', label_en: '📆 6-12 months' },
                        { value: '1_2y', label_th: '📅 1-2 ปี', label_en: '📅 1-2 years' },
                        { value: '2_3y', label_th: '📅 2-3 ปี', label_en: '📅 2-3 years' },
                        { value: '3_5y', label_th: '📚 3-5 ปี', label_en: '📚 3-5 years' },
                        { value: 'more_5y', label_th: '🏛️ มากกว่า 5 ปี', label_en: '🏛️ Over 5 years' },
                    ]
                },
            ]
        },
        {
            id: 'trust_signals',
            emoji: '🛡️',
            title_th: 'ความน่าเชื่อถือ',
            title_en: 'Trust Signals',
            fields: [
                {
                    key: 'original_box', label_th: 'กล่องและอุปกรณ์', label_en: 'Box & Accessories', importance: 'recommended', type: 'select',
                    options: [
                        { value: 'complete', label_th: '📦 มีครบ', label_en: '📦 Complete' },
                        { value: 'box_only', label_th: '📦 มีกล่อง', label_en: '📦 Box only' },
                        { value: 'no_box', label_th: '❌ ไม่มีกล่อง', label_en: '❌ No box' },
                    ]
                },
                {
                    key: 'selling_reason', label_th: 'เหตุผลที่ขาย', label_en: 'Reason', importance: 'optional', type: 'select',
                    options: [
                        { value: 'upgrade', label_th: '⬆️ อัพเกรด', label_en: '⬆️ Upgrading' },
                        { value: 'rarely_used', label_th: '🕐 ไม่ค่อยได้ใช้', label_en: '🕐 Rarely used' },
                        { value: 'moving', label_th: '🏠 ย้ายบ้าน', label_en: '🏠 Moving' },
                        { value: 'other', label_th: '📝 อื่นๆ', label_en: '📝 Other' },
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
                    key: 'included_items', label_th: 'รายการ', label_en: 'Items', importance: 'recommended', type: 'multiselect',
                    options: [
                        { value: 'device', label_th: 'ตัวเครื่อง', label_en: 'Device' },
                        { value: 'charger', label_th: 'สายชาร์จ', label_en: 'Charger' },
                        { value: 'box', label_th: 'กล่อง', label_en: 'Box' },
                        { value: 'manual', label_th: 'คู่มือ', label_en: 'Manual' },
                        { value: 'bag', label_th: 'กระเป๋า', label_en: 'Bag' },
                        { value: 'mouse', label_th: 'เมาส์', label_en: 'Mouse' },
                    ]
                },
            ]
        },
    ],
    targetAudience: {
        th: ['นักศึกษา', 'คนทำงานออฟฟิศ', 'นักออกแบบ', 'โปรแกรมเมอร์', 'เกมเมอร์'],
        en: ['Students', 'Office Workers', 'Designers', 'Programmers', 'Gamers']
    }
}
