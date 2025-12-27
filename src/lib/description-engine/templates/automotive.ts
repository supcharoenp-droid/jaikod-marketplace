/**
 * Automotive Template (Cars & Motorcycles)
 * Category IDs: 1 (Cars), 2 (Motorcycles)
 */

import type { CategoryTemplate } from '../types'

export const AUTOMOTIVE_TEMPLATE: CategoryTemplate = {
    categoryId: 1,
    categoryName: 'Automotive',
    emoji: '🚗',
    sections: [
        {
            id: 'vehicle_info',
            emoji: '🚘',
            title_th: 'ข้อมูลรถ',
            title_en: 'Vehicle Info',
            fields: [
                { key: 'brand', label_th: 'ยี่ห้อ', label_en: 'Brand', importance: 'required', type: 'text', extractFromTitle: true, aiDetectable: true },
                { key: 'model', label_th: 'รุ่น', label_en: 'Model', importance: 'required', type: 'text', extractFromTitle: true, aiDetectable: true },
                { key: 'year', label_th: 'ปี', label_en: 'Year', importance: 'required', type: 'number', extractFromTitle: true, aiDetectable: true },
                { key: 'sub_model', label_th: 'รุ่นย่อย', label_en: 'Sub Model/Trim', importance: 'recommended', type: 'text', aiDetectable: true },
                { key: 'color', label_th: 'สี', label_en: 'Color', importance: 'recommended', type: 'text', aiDetectable: true },
            ]
        },
        {
            id: 'specs',
            emoji: '🔧',
            title_th: 'สเปค',
            title_en: 'Specifications',
            fields: [
                { key: 'mileage', label_th: 'เลขไมล์', label_en: 'Mileage', importance: 'required', type: 'number', placeholder_th: 'กม.', placeholder_en: 'km' },
                {
                    key: 'fuel_type',
                    label_th: 'เชื้อเพลิง',
                    label_en: 'Fuel Type',
                    importance: 'required',
                    type: 'select',
                    options: [
                        { value: 'gasoline', label_th: '⛽ เบนซิน', label_en: '⛽ Gasoline' },
                        { value: 'diesel', label_th: '🛢️ ดีเซล', label_en: '🛢️ Diesel' },
                        { value: 'hybrid', label_th: '🔋 ไฮบริด', label_en: '🔋 Hybrid' },
                        { value: 'electric', label_th: '⚡ ไฟฟ้า', label_en: '⚡ Electric' },
                        { value: 'lpg', label_th: '🔥 แก๊ส LPG', label_en: '🔥 LPG' },
                    ]
                },
                {
                    key: 'transmission',
                    label_th: 'เกียร์',
                    label_en: 'Transmission',
                    importance: 'required',
                    type: 'select',
                    options: [
                        { value: 'auto', label_th: '🅰️ ออโต้', label_en: '🅰️ Automatic' },
                        { value: 'manual', label_th: '🔧 ธรรมดา', label_en: '🔧 Manual' },
                        { value: 'cvt', label_th: '📊 CVT', label_en: '📊 CVT' },
                    ]
                },
                { key: 'engine', label_th: 'เครื่องยนต์', label_en: 'Engine', importance: 'recommended', type: 'text', placeholder_th: 'เช่น 1.5 Turbo', placeholder_en: 'e.g. 1.5 Turbo' },
            ]
        },
        {
            id: 'condition',
            emoji: '✅',
            title_th: 'สภาพรถ',
            title_en: 'Condition',
            fields: [
                {
                    key: 'exterior',
                    label_th: 'สภาพภายนอก',
                    label_en: 'Exterior',
                    importance: 'required',
                    type: 'select',
                    options: [
                        { value: 'mint', label_th: '✨ สมบูรณ์แบบ', label_en: '✨ Mint' },
                        { value: 'excellent', label_th: '🌟 ดีเยี่ยม', label_en: '🌟 Excellent' },
                        { value: 'good', label_th: '👍 ดี', label_en: '👍 Good' },
                        { value: 'fair', label_th: '🔧 พอใช้', label_en: '🔧 Fair' },
                        { value: 'poor', label_th: '⚠️ ต้องซ่อม', label_en: '⚠️ Needs Work' },
                    ]
                },
                {
                    key: 'interior',
                    label_th: 'สภาพภายใน',
                    label_en: 'Interior',
                    importance: 'required',
                    type: 'select',
                    options: [
                        { value: 'mint', label_th: '✨ สมบูรณ์แบบ', label_en: '✨ Mint' },
                        { value: 'excellent', label_th: '🌟 ดีเยี่ยม', label_en: '🌟 Excellent' },
                        { value: 'good', label_th: '👍 ดี', label_en: '👍 Good' },
                        { value: 'fair', label_th: '🔧 พอใช้', label_en: '🔧 Fair' },
                    ]
                },
                { key: 'accident_history', label_th: 'ประวัติอุบัติเหตุ', label_en: 'Accident History', importance: 'required', type: 'textarea' },
                { key: 'service_history', label_th: 'ประวัติเข้าศูนย์', label_en: 'Service History', importance: 'recommended', type: 'textarea' },
            ]
        },
        {
            id: 'documents',
            emoji: '📋',
            title_th: 'เอกสาร',
            title_en: 'Documents',
            fields: [
                {
                    key: 'ownership',
                    label_th: 'ความเป็นเจ้าของ',
                    label_en: 'Ownership',
                    importance: 'required',
                    type: 'select',
                    options: [
                        { value: 'first_hand', label_th: '1️⃣ มือเดียว', label_en: '1️⃣ First Owner' },
                        { value: 'second_hand', label_th: '2️⃣ มือสอง', label_en: '2️⃣ Second Owner' },
                        { value: 'third_plus', label_th: '3️⃣+ มือสามขึ้นไป', label_en: '3️⃣+ Third+ Owner' },
                    ]
                },
                { key: 'registration', label_th: 'ทะเบียน', label_en: 'Registration', importance: 'recommended', type: 'text' },
                { key: 'insurance', label_th: 'ประกัน', label_en: 'Insurance', importance: 'optional', type: 'text' },
            ]
        }
    ],
    targetAudience: {
        th: ['คนหารถมือสอง', 'นักสะสม', 'พ่อค้ารถ'],
        en: ['Used car buyers', 'Collectors', 'Car dealers']
    }
}
