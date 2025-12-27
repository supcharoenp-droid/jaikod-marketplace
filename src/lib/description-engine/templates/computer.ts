/**
 * Computer & IT Template
 * Category ID: 4
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
                { key: 'cpu', label_th: 'ซีพียู', label_en: 'CPU', importance: 'required', type: 'text', aiDetectable: true },
                { key: 'ram', label_th: 'แรม', label_en: 'RAM', importance: 'required', type: 'text', aiDetectable: true },
                { key: 'storage', label_th: 'พื้นที่เก็บข้อมูล', label_en: 'Storage', importance: 'required', type: 'text', aiDetectable: true },
                { key: 'gpu', label_th: 'การ์ดจอ', label_en: 'GPU', importance: 'recommended', type: 'text', aiDetectable: true },
                { key: 'screen', label_th: 'หน้าจอ', label_en: 'Display', importance: 'recommended', type: 'text', aiDetectable: true },
                {
                    key: 'os',
                    label_th: 'ระบบปฏิบัติการ',
                    label_en: 'Operating System',
                    importance: 'recommended',
                    type: 'select',
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
            title_th: 'สภาพ',
            title_en: 'Condition',
            fields: [
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
                {
                    key: 'defects',
                    label_th: 'ตำหนิ',
                    label_en: 'Defects',
                    importance: 'recommended',
                    type: 'multiselect',
                    options: [
                        { value: 'none', label_th: '✨ ไม่มีตำหนิ', label_en: '✨ No defects' },
                        { value: 'scratch', label_th: '🔍 รอยขีดข่วน', label_en: '🔍 Scratches' },
                        { value: 'dent', label_th: '📐 รอยบุบ', label_en: '📐 Dents' },
                        { value: 'screen_issue', label_th: '📺 หน้าจอมีปัญหา', label_en: '📺 Screen issues' },
                        { value: 'keyboard_issue', label_th: '⌨️ คีย์บอร์ดมีปัญหา', label_en: '⌨️ Keyboard issues' },
                        { value: 'fan_noise', label_th: '🌀 พัดลมเสียงดัง', label_en: '🌀 Fan noise' },
                        { value: 'speaker_issue', label_th: '🔊 ลำโพงมีปัญหา', label_en: '🔊 Speaker issues' },
                        { value: 'trackpad_issue', label_th: '👆 แทร็คแพดมีปัญหา', label_en: '👆 Trackpad issues' },
                        { value: 'battery_weak', label_th: '🪫 แบตเตอรี่เสื่อม', label_en: '🪫 Battery degraded' },
                        { value: 'other', label_th: '📝 อื่นๆ', label_en: '📝 Other' },
                    ]
                },
                { key: 'warranty', label_th: 'ประกัน', label_en: 'Warranty', importance: 'optional', type: 'text' },
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
                        { value: 'box', label_th: '📦 กล่อง', label_en: '📦 Original Box' },
                        { value: 'mouse', label_th: '🖱️ เมาส์', label_en: '🖱️ Mouse' },
                        { value: 'bag', label_th: '👜 กระเป๋า', label_en: '👜 Bag/Sleeve' },
                        { value: 'stand', label_th: '🖥️ ขาตั้ง', label_en: '🖥️ Stand' },
                        { value: 'keyboard', label_th: '⌨️ คีย์บอร์ด', label_en: '⌨️ External Keyboard' },
                    ]
                },
            ]
        }
    ],
    targetAudience: {
        th: ['นักเรียน/นักศึกษา', 'คนทำงาน', 'เกมเมอร์', 'โปรแกรมเมอร์'],
        en: ['Students', 'Professionals', 'Gamers', 'Developers']
    }
}
