/**
 * JAIKOD WORLD-CLASS AI DESCRIPTION ENGINE
 * 
 * ระบบสร้างรายละเอียดสินค้าอัจฉริยะระดับโลก
 * 
 * Features:
 * - Category-specific structured templates
 * - Subcategory-specific target audiences
 * - AI-powered spec extraction
 * - Markdown/Rich text support
 * - Bilingual (Thai/English)
 * - Smart field suggestions
 * - SEO optimized descriptions
 * 
 * @version 2.1.0
 * @author JaiKod AI Team
 */

import { getSmartTemplateBySubcategory, getTargetAudience as getSubcategoryTargetAudience } from './smart-description-templates'
import { getCategoryConditions } from './category-condition-options'

// ============================================
// TYPES & INTERFACES
// ============================================

export interface AIDescriptionContext {
    // Product Info
    productTitle: string
    detectedBrands: string[]
    detectedObjects: string[]

    // Category Info
    categoryId: number
    subcategoryId?: number
    categoryName?: string
    subcategoryName?: string

    // AI Analysis
    aiSpecs?: Record<string, string>
    suggestedCondition?: 'new' | 'like_new' | 'good' | 'fair' | 'used'
    estimatedPrice?: { min: number; max: number; suggested: number }

    // User Inputs (optional, for enhancement)
    userSpecs?: Record<string, string>
    userConditionNotes?: string
    includedItems?: string[]

    // Settings
    language?: 'th' | 'en'
    style?: 'detailed' | 'minimal' | 'marketing'
}

export interface StructuredDescription {
    // Full formatted text
    fullText: string

    // Sections for display
    sections: DescriptionSection[]

    // Metadata
    wordCount: number
    characterCount: number
    seoScore: number

    // Missing fields that user should fill
    missingFields: {
        field: string
        label: string
        importance: 'required' | 'recommended' | 'optional'
        placeholder?: string
    }[]
}

export interface DescriptionSection {
    id: string
    emoji: string
    title: string
    content: string[]
    isEditable: boolean
}

// ============================================
// CATEGORY-SPECIFIC TEMPLATES
// ============================================

export interface CategoryTemplate {
    categoryId: number
    categoryName: string
    emoji: string
    sections: {
        id: string
        emoji: string
        title_th: string
        title_en: string
        fields: {
            key: string
            label_th: string
            label_en: string
            importance: 'required' | 'recommended' | 'optional'
            type: 'text' | 'select' | 'multiselect' | 'number' | 'textarea'
            options?: { value: string; label_th: string; label_en: string }[]
            extractFromTitle?: boolean
            aiDetectable?: boolean
            placeholder_th?: string  // Thai placeholder text
            placeholder_en?: string  // English placeholder text
        }[]
    }[]
    targetAudience: { th: string[]; en: string[] }
}

// ============================================
// COMPUTER & LAPTOP TEMPLATE (ID: 4)
// ============================================
const COMPUTER_TEMPLATE: CategoryTemplate = {
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
                // 🔋 Battery Health - NOW DROPDOWN!
                {
                    key: 'battery', label_th: 'สุขภาพแบตเตอรี่', label_en: 'Battery Health', importance: 'recommended', type: 'select',
                    options: [
                        { value: '90-100', label_th: '🔋 90-100% (ดีมาก - ใช้ได้ทั้งวัน)', label_en: '🔋 90-100% (Excellent)' },
                        { value: '80-89', label_th: '🔋 80-89% (ดี - ใช้ได้ 4-6 ชม.)', label_en: '🔋 80-89% (Good)' },
                        { value: '70-79', label_th: '🪫 70-79% (พอใช้ - ใช้ได้ 2-4 ชม.)', label_en: '🪫 70-79% (Fair)' },
                        { value: '60-69', label_th: '🪫 60-69% (ควรเปลี่ยนเร็วๆ)', label_en: '🪫 60-69% (Replace soon)' },
                        { value: 'below-60', label_th: '⚠️ ต่ำกว่า 60% (ควรเปลี่ยนแบต)', label_en: '⚠️ Below 60%' },
                        { value: 'unknown', label_th: '❓ ไม่ทราบ/ไม่ได้ตรวจ', label_en: '❓ Unknown' },
                    ]
                },
                // ⚠️ Defects - NOW MULTISELECT!
                {
                    key: 'defects', label_th: 'ตำหนิ/ข้อบกพร่อง', label_en: 'Defects', importance: 'recommended', type: 'multiselect',
                    options: [
                        { value: 'none', label_th: '✨ ไม่มีตำหนิ', label_en: '✨ No defects' },
                        { value: 'minor_scratches', label_th: '📝 รอยขีดข่วนเล็กน้อย', label_en: '📝 Minor scratches' },
                        { value: 'noticeable_scratches', label_th: '📝 รอยขีดข่วนเห็นชัด', label_en: '📝 Noticeable scratches' },
                        { value: 'minor_dent', label_th: '💢 รอยบุบเล็กน้อย', label_en: '💢 Minor dent' },
                        { value: 'dead_pixel', label_th: '🖥️ หน้าจอมี Dead Pixel', label_en: '🖥️ Dead pixels' },
                        { value: 'screen_spot', label_th: '🖥️ หน้าจอมีจุดด่าง', label_en: '🖥️ Screen spots' },
                        { value: 'key_wear', label_th: '⌨️ ปุ่มคีย์บอร์ดสึก', label_en: '⌨️ Key wear' },
                        { value: 'key_malfunction', label_th: '⌨️ ปุ่มบางปุ่มไม่ทำงาน', label_en: '⌨️ Keys not working' },
                        { value: 'fan_noise', label_th: '🌀 พัดลมมีเสียงดัง', label_en: '🌀 Fan noise' },
                        { value: 'speaker_issue', label_th: '🔊 ลำโพงมีปัญหา', label_en: '🔊 Speaker issues' },
                        { value: 'port_issue', label_th: '🔌 พอร์ตบางตัวมีปัญหา', label_en: '🔌 Port issues' },
                        { value: 'battery_weak', label_th: '🪫 แบตเตอรี่เสื่อม', label_en: '🪫 Battery degraded' },
                        { value: 'other', label_th: '📝 อื่นๆ', label_en: '📝 Other' },
                    ]
                },
                // 📅 Warranty - NOW DROPDOWN!
                {
                    key: 'warranty', label_th: 'ประกันเหลือ', label_en: 'Warranty Remaining', importance: 'optional', type: 'select',
                    options: [
                        { value: 'expired', label_th: '❌ หมดประกันแล้ว', label_en: '❌ Expired' },
                        { value: 'less_3m', label_th: '⏰ เหลือไม่ถึง 3 เดือน', label_en: '⏰ Less than 3 months' },
                        { value: '3_6m', label_th: '📆 เหลือ 3-6 เดือน', label_en: '📆 3-6 months' },
                        { value: '6_12m', label_th: '✅ เหลือ 6-12 เดือน', label_en: '✅ 6-12 months' },
                        { value: 'more_1y', label_th: '🏆 เหลือมากกว่า 1 ปี', label_en: '🏆 More than 1 year' },
                        { value: 'unknown', label_th: '❓ ไม่ทราบ', label_en: '❓ Unknown' },
                    ]
                },
                // 📅 Usage Age - Updated for older laptops!
                {
                    key: 'usage_age', label_th: 'อายุการใช้งาน', label_en: 'Usage Period', importance: 'recommended', type: 'select',
                    options: [
                        { value: 'new', label_th: '🆕 ยังไม่เคยใช้ (แกะกล่อง)', label_en: '🆕 Never used' },
                        { value: 'less_3m', label_th: '✨ น้อยกว่า 3 เดือน', label_en: '✨ Less than 3 months' },
                        { value: '3_6m', label_th: '📆 3-6 เดือน', label_en: '📆 3-6 months' },
                        { value: '6_12m', label_th: '📆 6 เดือน - 1 ปี', label_en: '📆 6 months - 1 year' },
                        { value: '1_2y', label_th: '📅 1-2 ปี', label_en: '📅 1-2 years' },
                        { value: '2_3y', label_th: '📅 2-3 ปี', label_en: '📅 2-3 years' },
                        { value: '3_5y', label_th: '📚 3-5 ปี (รุ่นเก่า)', label_en: '📚 3-5 years (Old model)' },
                        { value: 'more_5y', label_th: '🏛️ มากกว่า 5 ปี (รุ่นเก่ามาก)', label_en: '🏛️ Over 5 years (Vintage)' },
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
                // 📦 Original Box - NEW!
                {
                    key: 'original_box', label_th: 'กล่องและอุปกรณ์', label_en: 'Box & Accessories', importance: 'recommended', type: 'select',
                    options: [
                        { value: 'complete', label_th: '📦 มีกล่องครบ + อุปกรณ์ครบ', label_en: '📦 Complete box + accessories' },
                        { value: 'box_only', label_th: '📦 มีกล่อง (อุปกรณ์ไม่ครบ)', label_en: '📦 Box only' },
                        { value: 'no_box', label_th: '❌ ไม่มีกล่อง', label_en: '❌ No box' },
                    ]
                },
                // 🧾 Receipt - NEW!
                {
                    key: 'receipt', label_th: 'ใบเสร็จ/ใบรับประกัน', label_en: 'Receipt/Warranty Card', importance: 'optional', type: 'select',
                    options: [
                        { value: 'both', label_th: '✅ มีทั้งใบเสร็จและใบรับประกัน', label_en: '✅ Both receipt & warranty' },
                        { value: 'have_receipt', label_th: '🧾 มีใบเสร็จ', label_en: '🧾 Have receipt' },
                        { value: 'have_warranty_card', label_th: '📜 มีใบรับประกัน', label_en: '📜 Have warranty card' },
                        { value: 'none', label_th: '❌ ไม่มี', label_en: '❌ None' },
                    ]
                },
                // 💬 Selling Reason - NEW!
                {
                    key: 'selling_reason', label_th: 'เหตุผลที่ขาย', label_en: 'Reason for Selling', importance: 'optional', type: 'select',
                    options: [
                        { value: 'upgrade', label_th: '⬆️ ซื้อเครื่องใหม่/อัพเกรด', label_en: '⬆️ Upgrading' },
                        { value: 'rarely_used', label_th: '🕐 ใช้น้อย/ไม่ค่อยได้ใช้', label_en: '🕐 Rarely used' },
                        { value: 'gift', label_th: '🎁 ได้รับเป็นของขวัญ', label_en: '🎁 Received as gift' },
                        { value: 'moving', label_th: '🏠 ย้ายบ้าน/ต่างประเทศ', label_en: '🏠 Moving' },
                        { value: 'other', label_th: '📝 อื่นๆ', label_en: '📝 Other' },
                    ]
                },
            ]
        },
        {
            id: 'included',
            emoji: '📦',
            title_th: 'อุปกรณ์ที่ให้',
            title_en: 'What\'s Included',
            fields: [
                {
                    key: 'included_items', label_th: 'รายการที่ให้', label_en: 'Included Items', importance: 'recommended', type: 'multiselect',
                    options: [
                        { value: 'device', label_th: 'ตัวเครื่อง', label_en: 'Device' },
                        { value: 'charger', label_th: 'สายชาร์จ/อะแดปเตอร์', label_en: 'Charger/Adapter' },
                        { value: 'box', label_th: 'กล่องต้นฉบับ', label_en: 'Original Box' },
                        { value: 'manual', label_th: 'คู่มือ', label_en: 'Manual' },
                        { value: 'bag', label_th: 'กระเป๋า', label_en: 'Carrying Bag' },
                        { value: 'mouse', label_th: 'เมาส์', label_en: 'Mouse' },
                        { value: 'warranty', label_th: 'ใบรับประกัน', label_en: 'Warranty Card' },
                    ]
                },
            ]
        },
    ],
    targetAudience: {
        th: ['นักศึกษา', 'คนทำงานออฟฟิศ', 'นักออกแบบ', 'โปรแกรมเมอร์', 'เกมเมอร์', 'ใช้งานทั่วไป'],
        en: ['Students', 'Office Workers', 'Designers', 'Programmers', 'Gamers', 'General Use']
    }
}

// ============================================
// MOBILE PHONE TEMPLATE (ID: 3)
// ============================================
const MOBILE_TEMPLATE: CategoryTemplate = {
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
                        { value: 'Apple', label_th: '🍎 Apple (iPhone/iPad)', label_en: '🍎 Apple (iPhone/iPad)' },
                        { value: 'Samsung', label_th: '🌟 Samsung', label_en: '🌟 Samsung' },
                        { value: 'Xiaomi', label_th: '📱 Xiaomi', label_en: '📱 Xiaomi' },
                        { value: 'OPPO', label_th: '💚 OPPO', label_en: '💚 OPPO' },
                        { value: 'Vivo', label_th: '💙 Vivo', label_en: '💙 Vivo' },
                        { value: 'Realme', label_th: '🔶 Realme', label_en: '🔶 Realme' },
                        { value: 'OnePlus', label_th: '🔴 OnePlus', label_en: '🔴 OnePlus' },
                        { value: 'Google', label_th: '🔍 Google Pixel', label_en: '🔍 Google Pixel' },
                        { value: 'Huawei', label_th: '🌸 Huawei', label_en: '🌸 Huawei' },
                        { value: 'ASUS', label_th: '🎮 ASUS ROG Phone', label_en: '🎮 ASUS ROG Phone' },
                        { value: 'Other', label_th: '📝 อื่นๆ', label_en: '📝 Other' },
                    ]
                },
                { key: 'model', label_th: 'รุ่น', label_en: 'Model', importance: 'required', type: 'text', extractFromTitle: true, aiDetectable: true, placeholder_th: 'เช่น iPhone 15 Pro Max, Galaxy S24 Ultra' },
                {
                    key: 'storage', label_th: 'ความจุ', label_en: 'Storage', importance: 'required', type: 'select', aiDetectable: true,
                    options: [
                        { value: '32GB', label_th: '32GB', label_en: '32GB' },
                        { value: '64GB', label_th: '64GB', label_en: '64GB' },
                        { value: '128GB', label_th: '128GB', label_en: '128GB' },
                        { value: '256GB', label_th: '256GB', label_en: '256GB' },
                        { value: '512GB', label_th: '512GB', label_en: '512GB' },
                        { value: '1TB', label_th: '1TB', label_en: '1TB' },
                    ]
                },
                {
                    key: 'ram', label_th: 'RAM', label_en: 'RAM', importance: 'recommended', type: 'select', aiDetectable: true,
                    options: [
                        { value: '4GB', label_th: '4GB', label_en: '4GB' },
                        { value: '6GB', label_th: '6GB', label_en: '6GB' },
                        { value: '8GB', label_th: '8GB', label_en: '8GB' },
                        { value: '12GB', label_th: '12GB', label_en: '12GB' },
                        { value: '16GB', label_th: '16GB', label_en: '16GB' },
                        { value: '18GB', label_th: '18GB', label_en: '18GB' },
                        { value: 'N/A', label_th: 'ไม่ระบุ (iPhone)', label_en: 'N/A (iPhone)' },
                    ]
                },
                {
                    key: 'color', label_th: 'สี', label_en: 'Color', importance: 'required', type: 'select', aiDetectable: true,
                    options: [
                        { value: 'black', label_th: '⬛ ดำ', label_en: '⬛ Black' },
                        { value: 'white', label_th: '⬜ ขาว', label_en: '⬜ White' },
                        { value: 'silver', label_th: '🩶 เงิน', label_en: '🩶 Silver' },
                        { value: 'gold', label_th: '🟡 ทอง', label_en: '🟡 Gold' },
                        { value: 'rose_gold', label_th: '🌸 Rose Gold', label_en: '🌸 Rose Gold' },
                        { value: 'blue', label_th: '🔵 น้ำเงิน', label_en: '🔵 Blue' },
                        { value: 'purple', label_th: '🟣 ม่วง', label_en: '🟣 Purple' },
                        { value: 'green', label_th: '🟢 เขียว', label_en: '🟢 Green' },
                        { value: 'red', label_th: '🔴 แดง', label_en: '🔴 Red' },
                        { value: 'titanium', label_th: '🔘 ไทเทเนียม', label_en: '🔘 Titanium' },
                        { value: 'other', label_th: '🎨 อื่นๆ', label_en: '🎨 Other' },
                    ]
                },
                {
                    key: 'screen_size', label_th: 'ขนาดหน้าจอ', label_en: 'Screen Size', importance: 'optional', type: 'select',
                    options: [
                        { value: 'compact', label_th: '📱 น้อยกว่า 5.5"', label_en: '📱 Under 5.5"' },
                        { value: 'medium', label_th: '📱 5.5" - 6.0"', label_en: '📱 5.5" - 6.0"' },
                        { value: 'large', label_th: '📱 6.1" - 6.5"', label_en: '📱 6.1" - 6.5"' },
                        { value: 'xlarge', label_th: '📲 6.6" - 6.9"', label_en: '📲 6.6" - 6.9"' },
                        { value: 'tablet', label_th: '📲 7" ขึ้นไป (Tablet)', label_en: '📲 7"+ (Tablet)' },
                    ]
                },
            ]
        },
        {
            id: 'origin_status',
            emoji: '🏷️',
            title_th: 'ที่มาและสถานะ',
            title_en: 'Origin & Status',
            fields: [
                {
                    key: 'origin', label_th: 'ที่มาเครื่อง', label_en: 'Device Origin', importance: 'required', type: 'select',
                    options: [
                        { value: 'thai_official', label_th: '🇹🇭 ศูนย์ไทย (iStudio, Samsung, AIS/True/Dtac Shop)', label_en: '🇹🇭 Thai Official' },
                        { value: 'thai_telco', label_th: '📞 เครื่องโปร AIS/True/Dtac (ผ่อนครบแล้ว)', label_en: '📞 Telco (Paid off)' },
                        { value: 'thai_telco_paying', label_th: '📞 เครื่องโปร (ยังผ่อนอยู่)', label_en: '📞 Telco (Still paying)' },
                        { value: 'import_unlocked', label_th: '🌍 นำเข้า (Unlocked)', label_en: '🌍 Import (Unlocked)' },
                        { value: 'import_locked', label_th: '🔒 นำเข้า (Carrier Locked)', label_en: '🔒 Import (Carrier Locked)' },
                        { value: 'refurbished', label_th: '♻️ เครื่อง Refurbished', label_en: '♻️ Refurbished' },
                    ]
                },
                {
                    key: 'activation_status', label_th: 'สถานะเครื่อง', label_en: 'Device Status', importance: 'required', type: 'select',
                    options: [
                        { value: 'ready', label_th: '✅ พร้อมใช้งาน (ปลด iCloud/Account แล้ว)', label_en: '✅ Ready to use' },
                        { value: 'icloud_pending', label_th: '⏳ รอปลด iCloud (มี Apple ID เจ้าของ)', label_en: '⏳ Pending iCloud removal' },
                        { value: 'samsung_pending', label_th: '⏳ รอปลด Samsung Account', label_en: '⏳ Pending Samsung Account' },
                        { value: 'frp_locked', label_th: '🔒 FRP Lock (ติด Google Account)', label_en: '🔒 FRP Locked' },
                        { value: 'demo_unit', label_th: '🏪 เครื่อง Demo จากร้าน', label_en: '🏪 Demo Unit' },
                    ]
                },
                {
                    key: 'sim_type', label_th: 'ประเภท SIM', label_en: 'SIM Type', importance: 'optional', type: 'select',
                    options: [
                        { value: 'single_sim', label_th: '1️⃣ SIM เดียว', label_en: '1️⃣ Single SIM' },
                        { value: 'dual_sim', label_th: '2️⃣ 2 SIM (Physical)', label_en: '2️⃣ Dual SIM' },
                        { value: 'esim_physical', label_th: '📲 eSIM + Physical SIM', label_en: '📲 eSIM + Physical' },
                        { value: 'esim_dual', label_th: '📲 Dual eSIM', label_en: '📲 Dual eSIM' },
                    ]
                },
                {
                    key: 'network', label_th: 'รองรับเครือข่าย', label_en: 'Network', importance: 'optional', type: 'select',
                    options: [
                        { value: '5G', label_th: '⚡ 5G', label_en: '⚡ 5G' },
                        { value: '4G', label_th: '📶 4G LTE', label_en: '📶 4G LTE' },
                        { value: '3G', label_th: '📱 3G', label_en: '📱 3G' },
                    ]
                },
            ]
        },
        {
            id: 'condition',
            emoji: '✅',
            title_th: 'สภาพเครื่อง',
            title_en: 'Device Condition',
            fields: [
                {
                    key: 'overall_grade', label_th: 'เกรดสภาพโดยรวม', label_en: 'Overall Condition Grade', importance: 'required', type: 'select',
                    options: [
                        { value: 'S', label_th: '✨ เกรด S (99% เหมือนใหม่)', label_en: '✨ Grade S (99% Like New)' },
                        { value: 'A', label_th: '⭐ เกรด A (95% ดีมาก)', label_en: '⭐ Grade A (95% Excellent)' },
                        { value: 'B+', label_th: '👍 เกรด B+ (90% ดี)', label_en: '👍 Grade B+ (90% Good)' },
                        { value: 'B', label_th: '👌 เกรด B (85% พอใช้)', label_en: '👌 Grade B (85% Fair)' },
                        { value: 'C', label_th: '📝 เกรด C (75% มีตำหนิ)', label_en: '📝 Grade C (75% With Defects)' },
                        { value: 'broken', label_th: '🔧 เครื่องเสีย (ขายซากอะไหล่)', label_en: '🔧 Broken (For parts)' },
                    ]
                },
                {
                    key: 'battery', label_th: 'สุขภาพแบตเตอรี่', label_en: 'Battery Health', importance: 'required', type: 'select',
                    options: [
                        { value: '100', label_th: '🔋 100% (ใหม่เอี่ยม)', label_en: '🔋 100% (Brand New)' },
                        { value: '90-99', label_th: '🔋 90-99% (ดีมาก ใช้ได้ทั้งวัน)', label_en: '🔋 90-99% (Excellent)' },
                        { value: '80-89', label_th: '🔋 80-89% (ดี ใช้ได้ 4-6 ชม.)', label_en: '🔋 80-89% (Good)' },
                        { value: '70-79', label_th: '🪫 70-79% (พอใช้ ใช้ได้ 2-4 ชม.)', label_en: '🪫 70-79% (Fair)' },
                        { value: '60-69', label_th: '🪫 60-69% (ควรเปลี่ยนเร็วๆ)', label_en: '🪫 60-69% (Replace soon)' },
                        { value: 'below-60', label_th: '⚠️ ต่ำกว่า 60% (ควรเปลี่ยนแบต)', label_en: '⚠️ Below 60%' },
                        { value: 'replaced', label_th: '🔄 เปลี่ยนแบตใหม่แล้ว', label_en: '🔄 Battery Replaced' },
                        { value: 'unknown', label_th: '❓ ไม่ทราบ/ไม่ได้ตรวจ', label_en: '❓ Unknown' },
                    ]
                },
                {
                    key: 'screen', label_th: 'สภาพหน้าจอ', label_en: 'Screen Condition', importance: 'required', type: 'select',
                    options: [
                        { value: 'perfect', label_th: '✨ สมบูรณ์ 100% (ไม่มีรอย)', label_en: '✨ 100% Perfect' },
                        { value: 'minor_scratches', label_th: '📝 รอยเล็กน้อย (ติดฟิล์มหาย)', label_en: '📝 Minor scratches' },
                        { value: 'scratches', label_th: '📝 รอยขีดข่วนเห็นชัด', label_en: '📝 Visible scratches' },
                        { value: 'dead_pixel', label_th: '🖥️ มี Dead Pixel', label_en: '🖥️ Has dead pixels' },
                        { value: 'burn_in', label_th: '🔥 มีรอยเบิร์น (Burn-in)', label_en: '🔥 Has burn-in' },
                        { value: 'line', label_th: '📺 มีเส้นขึ้นหน้าจอ', label_en: '📺 Has screen lines' },
                        { value: 'cracked', label_th: '💔 หน้าจอร้าว/แตก', label_en: '💔 Screen cracked' },
                        { value: 'replaced', label_th: '🔄 เปลี่ยนจอใหม่แล้ว', label_en: '🔄 Screen Replaced' },
                    ]
                },
                {
                    key: 'body', label_th: 'สภาพตัวเครื่อง', label_en: 'Body Condition', importance: 'required', type: 'select',
                    options: [
                        { value: 'perfect', label_th: '✨ สมบูรณ์ 100% (ไม่มีรอย)', label_en: '✨ 100% Perfect' },
                        { value: 'minor', label_th: '📝 มีรอยเล็กน้อย', label_en: '📝 Minor marks' },
                        { value: 'visible', label_th: '📝 มีรอยเห็นชัด', label_en: '📝 Visible marks' },
                        { value: 'dent', label_th: '🔨 มีรอยบุบ', label_en: '🔨 Has dents' },
                        { value: 'bent', label_th: '📐 เครื่องงอ', label_en: '📐 Bent' },
                        { value: 'cracked', label_th: '💔 หลังแตก', label_en: '💔 Back cracked' },
                    ]
                },
            ]
        },
        {
            id: 'defects',
            emoji: '⚠️',
            title_th: 'ตำหนิและปัญหา',
            title_en: 'Defects & Issues',
            fields: [
                {
                    key: 'defects', label_th: 'ปัญหาอื่นๆ', label_en: 'Other Issues', importance: 'recommended', type: 'multiselect',
                    options: [
                        { value: 'none', label_th: '✨ ไม่มีปัญหาอื่น', label_en: '✨ No other issues' },
                        { value: 'face_id', label_th: '👤 Face ID ไม่ทำงาน', label_en: '👤 Face ID broken' },
                        { value: 'touch_id', label_th: '👆 ลายนิ้วมือไม่ทำงาน', label_en: '👆 Fingerprint broken' },
                        { value: 'speaker', label_th: '🔊 ลำโพงมีปัญหา', label_en: '🔊 Speaker issues' },
                        { value: 'mic', label_th: '🎤 ไมค์มีปัญหา', label_en: '🎤 Microphone issues' },
                        { value: 'camera', label_th: '📷 กล้องมีปัญหา', label_en: '📷 Camera issues' },
                        { value: 'charging', label_th: '🔌 ช่องชาร์จมีปัญหา', label_en: '🔌 Charging port issues' },
                        { value: 'button', label_th: '🔘 ปุ่มกดมีปัญหา', label_en: '🔘 Button issues' },
                        { value: 'wifi', label_th: '📶 WiFi/Bluetooth มีปัญหา', label_en: '📶 WiFi/Bluetooth issues' },
                        { value: 'sensor', label_th: '🔄 เซ็นเซอร์มีปัญหา', label_en: '🔄 Sensor issues' },
                        { value: 'ghost_touch', label_th: '👻 หน้าจอกดเอง (Ghost Touch)', label_en: '👻 Ghost touch' },
                        { value: 'vibrate', label_th: '📳 สั่นไม่ทำงาน', label_en: '📳 Vibration broken' },
                        { value: 'sim_tray', label_th: '📴 ถาด SIM มีปัญหา', label_en: '📴 SIM tray issues' },
                    ]
                },
            ]
        },
        {
            id: 'warranty_trust',
            emoji: '🛡️',
            title_th: 'ประกันและความน่าเชื่อถือ',
            title_en: 'Warranty & Trust',
            fields: [
                {
                    key: 'warranty', label_th: 'ประกันศูนย์เหลือ', label_en: 'Official Warranty', importance: 'recommended', type: 'select',
                    options: [
                        { value: 'apple_care', label_th: '🍎 AppleCare+ ยังเหลือ', label_en: '🍎 AppleCare+ active' },
                        { value: 'samsung_care', label_th: '🌟 Samsung Care+ ยังเหลือ', label_en: '🌟 Samsung Care+ active' },
                        { value: 'more_1y', label_th: '🏆 เหลือมากกว่า 1 ปี', label_en: '🏆 More than 1 year' },
                        { value: '6_12m', label_th: '✅ เหลือ 6-12 เดือน', label_en: '✅ 6-12 months' },
                        { value: '3_6m', label_th: '📆 เหลือ 3-6 เดือน', label_en: '📆 3-6 months' },
                        { value: 'less_3m', label_th: '⏰ เหลือไม่ถึง 3 เดือน', label_en: '⏰ Less than 3 months' },
                        { value: 'expired', label_th: '❌ หมดประกันแล้ว', label_en: '❌ Expired' },
                        { value: 'unknown', label_th: '❓ ไม่ทราบ', label_en: '❓ Unknown' },
                    ]
                },
                {
                    key: 'usage_age', label_th: 'อายุการใช้งาน', label_en: 'Usage Period', importance: 'recommended', type: 'select',
                    options: [
                        { value: 'sealed', label_th: '📦 ยังซีล ไม่เคยแกะ', label_en: '📦 Sealed, never opened' },
                        { value: 'new', label_th: '🆕 แกะกล่อง ยังไม่เคยใช้', label_en: '🆕 Unboxed, never used' },
                        { value: 'less_3m', label_th: '✨ น้อยกว่า 3 เดือน', label_en: '✨ Less than 3 months' },
                        { value: '3_6m', label_th: '📆 3-6 เดือน', label_en: '📆 3-6 months' },
                        { value: '6_12m', label_th: '📆 6 เดือน - 1 ปี', label_en: '📆 6 months - 1 year' },
                        { value: '1_2y', label_th: '📅 1-2 ปี', label_en: '📅 1-2 years' },
                        { value: '2_3y', label_th: '📅 2-3 ปี', label_en: '📅 2-3 years' },
                        { value: '3_5y', label_th: '📚 3-5 ปี', label_en: '📚 3-5 years' },
                        { value: 'more_5y', label_th: '🏛️ มากกว่า 5 ปี', label_en: '🏛️ Over 5 years' },
                    ]
                },
                {
                    key: 'original_box', label_th: 'กล่องและอุปกรณ์', label_en: 'Box & Accessories', importance: 'recommended', type: 'select',
                    options: [
                        { value: 'complete', label_th: '📦 มีกล่องครบ + อุปกรณ์ครบ', label_en: '📦 Complete box + accessories' },
                        { value: 'box_partial', label_th: '📦 มีกล่อง (อุปกรณ์ไม่ครบ)', label_en: '📦 Box (partial accessories)' },
                        { value: 'no_box', label_th: '❌ ไม่มีกล่อง (มีอุปกรณ์)', label_en: '❌ No box (has accessories)' },
                        { value: 'device_only', label_th: '📱 ตัวเครื่องเท่านั้น', label_en: '📱 Device only' },
                    ]
                },
                {
                    key: 'receipt', label_th: 'ใบเสร็จ/หลักฐานการซื้อ', label_en: 'Receipt/Proof of Purchase', importance: 'optional', type: 'select',
                    options: [
                        { value: 'both', label_th: '✅ มีใบเสร็จ + ใบรับประกัน', label_en: '✅ Receipt + Warranty card' },
                        { value: 'receipt', label_th: '🧾 มีใบเสร็จ', label_en: '🧾 Have receipt' },
                        { value: 'warranty_card', label_th: '📜 มีใบรับประกัน', label_en: '📜 Have warranty card' },
                        { value: 'none', label_th: '❌ ไม่มี', label_en: '❌ None' },
                    ]
                },
            ]
        },
        {
            id: 'included_items',
            emoji: '📦',
            title_th: 'อุปกรณ์ที่ให้',
            title_en: "What's Included",
            fields: [
                {
                    key: 'included_items', label_th: 'รายการที่ให้', label_en: 'Included Items', importance: 'recommended', type: 'multiselect',
                    options: [
                        { value: 'device', label_th: '📱 ตัวเครื่อง', label_en: '📱 Device' },
                        { value: 'charger', label_th: '🔌 สายชาร์จ', label_en: '🔌 Charging cable' },
                        { value: 'adapter', label_th: '🔋 หัวชาร์จ', label_en: '🔋 Power adapter' },
                        { value: 'box', label_th: '📦 กล่องเดิม', label_en: '📦 Original box' },
                        { value: 'case', label_th: '🛡️ เคส', label_en: '🛡️ Case' },
                        { value: 'screen_protector', label_th: '📄 ฟิล์มติดแล้ว', label_en: '📄 Screen protector installed' },
                        { value: 'earphones', label_th: '🎧 หูฟัง', label_en: '🎧 Earphones' },
                        { value: 'sim_ejector', label_th: '📍 เข็มจิ้ม SIM', label_en: '📍 SIM ejector' },
                    ]
                },
            ]
        },
        {
            id: 'payment_options',
            emoji: '💰',
            title_th: 'ราคาและการชำระเงิน',
            title_en: 'Price & Payment',
            fields: [
                { key: 'price', label_th: 'ราคา (บาท)', label_en: 'Price (THB)', importance: 'required', type: 'number', placeholder_th: '25000' },
                {
                    key: 'negotiable', label_th: 'ต่อรองราคา', label_en: 'Negotiable', importance: 'recommended', type: 'select',
                    options: [
                        { value: 'yes', label_th: '✅ ต่อรองได้', label_en: '✅ Negotiable' },
                        { value: 'little', label_th: '🤏 ลดได้นิดหน่อย', label_en: '🤏 Slightly negotiable' },
                        { value: 'no', label_th: '❌ ไม่ลดแล้ว', label_en: '❌ Fixed price' },
                    ]
                },
                {
                    key: 'installment', label_th: 'รับผ่อน', label_en: 'Installment', importance: 'optional', type: 'select',
                    options: [
                        { value: 'no', label_th: '❌ ไม่รับผ่อน (เงินสดเท่านั้น)', label_en: '❌ Cash only' },
                        { value: 'shopee', label_th: '🛒 รับ Shopee/Lazada 0%', label_en: '🛒 Shopee/Lazada 0%' },
                        { value: 'credit_card', label_th: '💳 รับบัตรเครดิต', label_en: '💳 Credit card accepted' },
                    ]
                },
                {
                    key: 'seller_warranty', label_th: 'รับประกันจากผู้ขาย', label_en: 'Seller Warranty', importance: 'optional', type: 'select',
                    options: [
                        { value: 'none', label_th: '❌ ไม่รับประกัน', label_en: '❌ No warranty' },
                        { value: '7d', label_th: '✅ รับประกัน 7 วัน', label_en: '✅ 7-day warranty' },
                        { value: '1m', label_th: '✅ รับประกัน 1 เดือน', label_en: '✅ 1-month warranty' },
                        { value: '3m', label_th: '✅ รับประกัน 3 เดือน', label_en: '✅ 3-month warranty' },
                    ]
                },
            ]
        },
        {
            id: 'extras_selling',
            emoji: '💬',
            title_th: 'ข้อมูลเพิ่มเติม',
            title_en: 'Additional Info',
            fields: [
                {
                    key: 'selling_reason', label_th: 'เหตุผลที่ขาย', label_en: 'Reason for Selling', importance: 'optional', type: 'select',
                    options: [
                        { value: 'upgrade', label_th: '⬆️ ซื้อเครื่องใหม่/อัพเกรด', label_en: '⬆️ Upgrading to new device' },
                        { value: 'rarely_used', label_th: '🕐 ใช้น้อย/ไม่ค่อยได้ใช้', label_en: '🕐 Rarely used' },
                        { value: 'gift', label_th: '🎁 ได้รับเป็นของขวัญ (ซ้ำ)', label_en: '🎁 Received as duplicate gift' },
                        { value: 'moving', label_th: '🏠 ย้ายไปต่างประเทศ', label_en: '🏠 Moving abroad' },
                        { value: 'need_money', label_th: '💵 ต้องการเงินก้อน', label_en: '💵 Need funds' },
                        { value: 'other', label_th: '📝 อื่นๆ', label_en: '📝 Other' },
                    ]
                },
                {
                    key: 'additional_description', label_th: 'รายละเอียดเพิ่มเติม', label_en: 'Additional Details', importance: 'optional', type: 'textarea',
                    placeholder_th: 'ระบุรายละเอียดเพิ่มเติมที่ต้องการบอกผู้ซื้อ เช่น ประวัติการใช้งาน การดูแลรักษา ฯลฯ',
                    placeholder_en: 'Additional details for buyers: usage history, care tips, etc.'
                },
            ]
        },
    ],
    targetAudience: {
        th: ['คนชอบถ่ายรูป', 'เล่นโซเชียล', 'เล่นเกม', 'ทำงาน', 'นักศึกษา', 'YouTuber/Influencer'],
        en: ['Photography lovers', 'Social media', 'Gaming', 'Work', 'Students', 'Content Creators']
    }
}

// ============================================
// WEARABLE TEMPLATE (Subcategory 303)
// Smartwatches, Fitness Bands, Earbuds
// ============================================
const WEARABLE_TEMPLATE: CategoryTemplate = {
    categoryId: 3,
    categoryName: 'Wearables',
    emoji: '⌚',
    sections: [
        {
            id: 'specs',
            emoji: '📋',
            title_th: 'รายละเอียด',
            title_en: 'Specifications',
            fields: [
                { key: 'brand', label_th: 'แบรนด์', label_en: 'Brand', importance: 'required', type: 'text', extractFromTitle: true, aiDetectable: true },
                { key: 'model', label_th: 'รุ่น', label_en: 'Model', importance: 'required', type: 'text', extractFromTitle: true },
                {
                    key: 'wearable_type', label_th: 'ประเภท', label_en: 'Type', importance: 'required', type: 'select',
                    options: [
                        { value: 'smartwatch', label_th: '⌚ สมาร์ทวอทช์', label_en: '⌚ Smartwatch' },
                        { value: 'fitness_band', label_th: '🏃 สายรัดข้อมือ/Fitness Band', label_en: '🏃 Fitness Band' },
                        { value: 'earbuds', label_th: '🎧 หูฟังไร้สาย/Earbuds', label_en: '🎧 Wireless Earbuds' },
                        { value: 'headphones', label_th: '🎧 หูฟังครอบหู', label_en: '🎧 Headphones' },
                        { value: 'vr', label_th: '🥽 VR/AR Headset', label_en: '🥽 VR/AR Headset' },
                    ]
                },
                {
                    key: 'connectivity', label_th: 'การเชื่อมต่อ', label_en: 'Connectivity', importance: 'recommended', type: 'select',
                    options: [
                        { value: 'bluetooth', label_th: '📶 Bluetooth Only', label_en: '📶 Bluetooth Only' },
                        { value: 'wifi', label_th: '📡 WiFi + Bluetooth', label_en: '📡 WiFi + Bluetooth' },
                        { value: 'lte', label_th: '📱 LTE/Cellular', label_en: '📱 LTE/Cellular' },
                    ]
                },
                { key: 'color', label_th: 'สี', label_en: 'Color', importance: 'required', type: 'text', aiDetectable: true },
            ]
        },
        {
            id: 'condition',
            emoji: '✅',
            title_th: 'สภาพสินค้า',
            title_en: 'Condition',
            fields: [
                {
                    key: 'battery', label_th: 'สุขภาพแบตเตอรี่', label_en: 'Battery Health', importance: 'required', type: 'select',
                    options: [
                        { value: '90-100', label_th: '🔋 90-100% (ใช้ได้ทั้งวัน)', label_en: '🔋 90-100% (All day)' },
                        { value: '80-89', label_th: '🔋 80-89% (ดี)', label_en: '🔋 80-89% (Good)' },
                        { value: '70-79', label_th: '🪫 70-79% (พอใช้)', label_en: '🪫 70-79% (Fair)' },
                        { value: 'below-70', label_th: '⚠️ ต่ำกว่า 70%', label_en: '⚠️ Below 70%' },
                        { value: 'unknown', label_th: '❓ ไม่ทราบ', label_en: '❓ Unknown' },
                    ]
                },
                {
                    key: 'screen', label_th: 'สภาพหน้าจอ/ตัวเครื่อง', label_en: 'Screen/Body Condition', importance: 'required', type: 'select',
                    options: [
                        { value: 'perfect', label_th: '✨ สมบูรณ์แบบ', label_en: '✨ Perfect' },
                        { value: 'minor_scratches', label_th: '📝 รอยขีดข่วนเบาๆ', label_en: '📝 Minor scratches' },
                        { value: 'scratches', label_th: '📝 รอยขีดข่วนเห็นชัด', label_en: '📝 Visible scratches' },
                        { value: 'cracked', label_th: '💔 แตก/ร้าว', label_en: '💔 Cracked' },
                    ]
                },
                {
                    key: 'defects', label_th: 'ตำหนิ', label_en: 'Defects', importance: 'recommended', type: 'multiselect',
                    options: [
                        { value: 'none', label_th: '✨ ไม่มี', label_en: '✨ None' },
                        { value: 'strap_wear', label_th: '⌚ สายมีรอยสึกหรอ', label_en: '⌚ Strap wear' },
                        { value: 'button_issue', label_th: '🔘 ปุ่มกดมีปัญหา', label_en: '🔘 Button issues' },
                        { value: 'sensor_issue', label_th: '📊 เซนเซอร์ทำงานไม่ปกติ', label_en: '📊 Sensor issues' },
                        { value: 'speaker_issue', label_th: '🔊 ลำโพง/ไมค์มีปัญหา', label_en: '🔊 Speaker/Mic issues' },
                        { value: 'charging_issue', label_th: '🔌 ชาร์จมีปัญหา', label_en: '🔌 Charging issues' },
                    ]
                },
                {
                    key: 'warranty', label_th: 'ประกัน', label_en: 'Warranty', importance: 'optional', type: 'select',
                    options: [
                        { value: 'more_1y', label_th: '🏆 เหลือมากกว่า 1 ปี', label_en: '🏆 More than 1 year' },
                        { value: '6_12m', label_th: '✅ เหลือ 6-12 เดือน', label_en: '✅ 6-12 months' },
                        { value: '3_6m', label_th: '📆 เหลือ 3-6 เดือน', label_en: '📆 3-6 months' },
                        { value: 'expired', label_th: '❌ หมดแล้ว', label_en: '❌ Expired' },
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
                    key: 'original_box', label_th: 'กล่องและอุปกรณ์', label_en: 'Box & Accessories', importance: 'recommended', type: 'select',
                    options: [
                        { value: 'complete', label_th: '📦 มีครบ', label_en: '📦 Complete' },
                        { value: 'box_only', label_th: '📦 มีกล่อง', label_en: '📦 Box only' },
                        { value: 'no_box', label_th: '❌ ไม่มีกล่อง', label_en: '❌ No box' },
                    ]
                },
            ]
        },
    ],
    targetAudience: {
        th: ['คนรักสุขภาพ', 'นักวิ่ง', 'คนชอบเทคโนโลยี', 'ทำงาน'],
        en: ['Health enthusiasts', 'Runners', 'Tech lovers', 'Professionals']
    }
}

// ============================================
// FASHION TEMPLATE (ID: 6)
// ============================================
const FASHION_TEMPLATE: CategoryTemplate = {
    categoryId: 6,
    categoryName: 'Fashion',
    emoji: '👗',
    sections: [
        {
            id: 'details',
            emoji: '📋',
            title_th: 'รายละเอียด',
            title_en: 'Details',
            fields: [
                { key: 'brand', label_th: 'แบรนด์', label_en: 'Brand', importance: 'required', type: 'text', extractFromTitle: true, aiDetectable: true },
                { key: 'type', label_th: 'ประเภท', label_en: 'Type', importance: 'required', type: 'text' },
                { key: 'color', label_th: 'สี', label_en: 'Color', importance: 'required', type: 'text', aiDetectable: true },
                { key: 'size', label_th: 'ไซส์', label_en: 'Size', importance: 'required', type: 'text' },
                { key: 'material', label_th: 'วัสดุ', label_en: 'Material', importance: 'recommended', type: 'text' },
            ]
        },
        {
            id: 'measurements',
            emoji: '📏',
            title_th: 'ขนาด (ซม.)',
            title_en: 'Measurements (cm)',
            fields: [
                { key: 'chest', label_th: 'รอบอก', label_en: 'Chest', importance: 'recommended', type: 'number' },
                { key: 'length', label_th: 'ยาว', label_en: 'Length', importance: 'recommended', type: 'number' },
                { key: 'waist', label_th: 'รอบเอว', label_en: 'Waist', importance: 'optional', type: 'number' },
                { key: 'hip', label_th: 'รอบสะโพก', label_en: 'Hip', importance: 'optional', type: 'number' },
            ]
        },
        {
            id: 'condition',
            emoji: '✅',
            title_th: 'รายละเอียดเพิ่มเติม',  // ⚠️ Changed to avoid confusion
            title_en: 'Additional Details',
            fields: [
                // ⚠️ REMOVED 'overall' - duplicate of main condition dropdown!
                {
                    key: 'defects', label_th: 'ตำหนิ/ข้อบกพร่อง', label_en: 'Defects', importance: 'recommended', type: 'multiselect',
                    options: [
                        { value: 'none', label_th: '✨ ไม่มีตำหนิ', label_en: '✨ No defects' },
                        { value: 'stain', label_th: '💧 มีรอยเปื้อน', label_en: '💧 Stains' },
                        { value: 'faded', label_th: '🎨 สีซีด', label_en: '🎨 Faded' },
                        { value: 'pilling', label_th: '🧶 ขุยผ้า/เป็นขน', label_en: '🧶 Pilling' },
                        { value: 'tear', label_th: '🧵 มีรอยขาด/ปะ', label_en: '🧵 Tear/Patch' },
                        { value: 'loose_thread', label_th: '🪡 ด้ายหลุด', label_en: '🪡 Loose threads' },
                        { value: 'button_issue', label_th: '🔘 กระดุมหาย/หลุด', label_en: '🔘 Button missing' },
                        { value: 'zipper_issue', label_th: '🤐 ซิปมีปัญหา', label_en: '🤐 Zipper issue' },
                        { value: 'other', label_th: '📝 อื่นๆ', label_en: '📝 Other' },
                    ]
                },
                {
                    key: 'washed', label_th: 'ซักแล้วกี่ครั้ง', label_en: 'Times washed', importance: 'optional', type: 'select',
                    options: [
                        { value: 'never', label_th: '🆕 ยังไม่เคยซัก (ป้ายติด)', label_en: '🆕 Never washed (Tags on)' },
                        { value: '1-3', label_th: '✨ 1-3 ครั้ง', label_en: '✨ 1-3 times' },
                        { value: '4-10', label_th: '📝 4-10 ครั้ง', label_en: '📝 4-10 times' },
                        { value: 'many', label_th: '👕 มากกว่า 10 ครั้ง', label_en: '👕 More than 10 times' },
                    ]
                },
            ]
        },
    ],
    targetAudience: {
        th: ['สาวๆ', 'วัยรุ่น', 'วัยทำงาน', 'คนรักแฟชั่น'],
        en: ['Women', 'Teenagers', 'Young professionals', 'Fashion lovers']
    }
}

// ============================================
// AUTOMOTIVE TEMPLATE (ID: 1)
// ============================================
const AUTOMOTIVE_TEMPLATE: CategoryTemplate = {
    categoryId: 1,
    categoryName: 'Automotive',
    emoji: '🚗',
    sections: [
        {
            id: 'vehicle',
            emoji: '🚗',
            title_th: 'ข้อมูลรถ',
            title_en: 'Vehicle Info',
            fields: [
                { key: 'brand', label_th: 'ยี่ห้อ', label_en: 'Brand', importance: 'required', type: 'text', extractFromTitle: true, aiDetectable: true },
                { key: 'model', label_th: 'รุ่น', label_en: 'Model', importance: 'required', type: 'text', extractFromTitle: true, aiDetectable: true },
                { key: 'year', label_th: 'ปีรถ', label_en: 'Year', importance: 'required', type: 'text' },
                { key: 'mileage', label_th: 'ระยะทาง (กม.)', label_en: 'Mileage (km)', importance: 'required', type: 'number' },
                { key: 'color', label_th: 'สี', label_en: 'Color', importance: 'required', type: 'text', aiDetectable: true },
                {
                    key: 'transmission', label_th: 'เกียร์', label_en: 'Transmission', importance: 'required', type: 'select',
                    options: [
                        { value: 'auto', label_th: 'ออโต้', label_en: 'Automatic' },
                        { value: 'manual', label_th: 'ธรรมดา', label_en: 'Manual' },
                    ]
                },
                {
                    key: 'fuel', label_th: 'เชื้อเพลิง', label_en: 'Fuel Type', importance: 'required', type: 'select',
                    options: [
                        { value: 'benzene', label_th: 'เบนซิน', label_en: 'Gasoline' },
                        { value: 'diesel', label_th: 'ดีเซล', label_en: 'Diesel' },
                        { value: 'hybrid', label_th: 'ไฮบริด', label_en: 'Hybrid' },
                        { value: 'ev', label_th: 'ไฟฟ้า', label_en: 'Electric' },
                        { value: 'lpg', label_th: 'LPG/NGV', label_en: 'LPG/NGV' },
                    ]
                },
            ]
        },
        {
            id: 'condition',
            emoji: '🔧',
            title_th: 'ประวัติรถ',  // Changed from 'สภาพและประวัติ' to avoid confusion
            title_en: 'Vehicle History',
            fields: [
                // ⚠️ REMOVED 'overall' - it was duplicate of main condition dropdown!
                {
                    key: 'accident', label_th: 'ประวัติอุบัติเหตุ', label_en: 'Accident History', importance: 'required', type: 'select',
                    options: [
                        { value: 'none', label_th: 'ไม่เคยมีอุบัติเหตุ', label_en: 'No accidents' },
                        { value: 'minor', label_th: 'เคยมีเล็กน้อย (รอยขีดข่วน/บุบ)', label_en: 'Minor (scratches/dents)' },
                        { value: 'moderate', label_th: 'เคยมีปานกลาง (ซ่อมสี/ชิ้นส่วน)', label_en: 'Moderate (paint/parts repair)' },
                        { value: 'major', label_th: 'เคยมีรุนแรง (ซ่อมใหญ่)', label_en: 'Major (significant repair)' },
                    ]
                },
                {
                    key: 'flood', label_th: 'ประวัติน้ำท่วม', label_en: 'Flood History', importance: 'required', type: 'select',
                    options: [
                        { value: 'none', label_th: 'ไม่เคยถูกน้ำท่วม', label_en: 'Never flooded' },
                        { value: 'partial', label_th: 'เคยถูกน้ำท่วมบางส่วน', label_en: 'Partially flooded' },
                        { value: 'full', label_th: 'เคยถูกน้ำท่วมทั้งคัน', label_en: 'Fully flooded' },
                    ]
                },
                { key: 'service', label_th: 'ประวัติการเข้าศูนย์', label_en: 'Service History', importance: 'recommended', type: 'text' },
                { key: 'warranty', label_th: 'ประกันเหลือถึง', label_en: 'Warranty Until', importance: 'optional', type: 'text' },
            ]
        },
        {
            id: 'documents',
            emoji: '📄',
            title_th: 'เอกสาร',
            title_en: 'Documents',
            fields: [
                { key: 'registration', label_th: 'ทะเบียน', label_en: 'Registration', importance: 'required', type: 'text' },
                {
                    key: 'book', label_th: 'เล่มทะเบียน', label_en: 'Registration Book', importance: 'required', type: 'select',
                    options: [
                        { value: 'has', label_th: 'มี', label_en: 'Available' },
                        { value: 'none', label_th: 'ไม่มี', label_en: 'Not available' },
                    ]
                },
            ]
        },
    ],
    targetAudience: {
        th: ['ครอบครัว', 'คนทำงาน', 'วัยรุ่น', 'คนรักรถ'],
        en: ['Families', 'Professionals', 'Young adults', 'Car enthusiasts']
    }
}

// ============================================
// REAL ESTATE TEMPLATE (ID: 2)
// Thai Property Market Specific Fields
// ============================================
const REAL_ESTATE_TEMPLATE: CategoryTemplate = {
    categoryId: 2,
    categoryName: 'Real Estate',
    emoji: '🏠',
    sections: [
        {
            id: 'property_info',
            emoji: '📍',
            title_th: 'ข้อมูลทรัพย์สิน',
            title_en: 'Property Information',
            fields: [
                {
                    key: 'listing_type', label_th: 'ประเภทประกาศ', label_en: 'Listing Type', importance: 'required', type: 'select',
                    options: [
                        { value: 'sale', label_th: '🏷️ ขาย', label_en: '🏷️ For Sale' },
                        { value: 'rent', label_th: '🔑 ให้เช่า', label_en: '🔑 For Rent' },
                        { value: 'sale_rent', label_th: '📝 ขายหรือให้เช่า', label_en: '📝 Sale or Rent' },
                    ]
                },
                {
                    key: 'title_deed', label_th: 'ประเภทเอกสารสิทธิ์', label_en: 'Title Deed', importance: 'required', type: 'select',
                    options: [
                        { value: 'ns4j', label_th: '📜 โฉนดที่ดิน (นส.4 จ.)', label_en: '📜 Chanote (NS.4 J)' },
                        { value: 'ns4', label_th: '📜 โฉนดที่ดิน (นส.4)', label_en: '📜 Chanote (NS.4)' },
                        { value: 'ns3k', label_th: '📋 นส.3 ก.', label_en: '📋 NS.3 Kor' },
                        { value: 'ns3', label_th: '📋 นส.3', label_en: '📋 NS.3' },
                        { value: 'spo4', label_th: '📝 สปก.4-01', label_en: '📝 SPO.4-01' },
                        { value: 'condo', label_th: '🏢 หนังสือกรรมสิทธิ์ห้องชุด', label_en: '🏢 Condo Title' },
                    ]
                },
            ]
        },
        {
            id: 'size',
            emoji: '📐',
            title_th: 'ขนาดพื้นที่',
            title_en: 'Property Size',
            fields: [
                { key: 'land_rai', label_th: 'ขนาดที่ดิน (ไร่)', label_en: 'Land Size (Rai)', importance: 'required', type: 'text' },
                { key: 'land_ngan', label_th: 'งาน', label_en: 'Ngan', importance: 'optional', type: 'text' },
                { key: 'land_sqwa', label_th: 'ตารางวา', label_en: 'Square Wa', importance: 'optional', type: 'text' },
                { key: 'usable_area', label_th: 'พื้นที่ใช้สอย (ตร.ม.)', label_en: 'Usable Area (sq.m.)', importance: 'recommended', type: 'text' },
            ]
        },
        {
            id: 'house_details',
            emoji: '🏡',
            title_th: 'รายละเอียดบ้าน/อาคาร',
            title_en: 'Building Details',
            fields: [
                { key: 'bedrooms', label_th: 'จำนวนห้องนอน', label_en: 'Bedrooms', importance: 'recommended', type: 'text' },
                { key: 'bathrooms', label_th: 'จำนวนห้องน้ำ', label_en: 'Bathrooms', importance: 'recommended', type: 'text' },
                { key: 'floors', label_th: 'จำนวนชั้น', label_en: 'Floors', importance: 'optional', type: 'text' },
                {
                    key: 'parking', label_th: 'ที่จอดรถ', label_en: 'Parking', importance: 'optional', type: 'select',
                    options: [
                        { value: 'garage', label_th: '🚗 โรงรถ/ที่จอดในร่ม', label_en: '🚗 Garage/Covered' },
                        { value: 'outdoor', label_th: '🅿️ ที่จอดกลางแจ้ง', label_en: '🅿️ Outdoor' },
                        { value: 'none', label_th: '❌ ไม่มี', label_en: '❌ None' },
                    ]
                },
            ]
        },
        {
            id: 'location_features',
            emoji: '🗺️',
            title_th: 'ทำเลและผังเมือง',
            title_en: 'Location & Zoning',
            fields: [
                {
                    key: 'road_access', label_th: 'ทางเข้าถึง', label_en: 'Road Access', importance: 'recommended', type: 'select',
                    options: [
                        { value: 'main_road', label_th: '🛣️ ติดถนนใหญ่', label_en: '🛣️ Main Road' },
                        { value: 'side_road', label_th: '🚗 ติดถนนซอย', label_en: '🚗 Side Road' },
                        { value: 'alley', label_th: '🚶 ซอยตัน', label_en: '🚶 Alley' },
                    ]
                },
                {
                    key: 'zoning', label_th: 'ผังเมือง', label_en: 'Zoning', importance: 'optional', type: 'select',
                    options: [
                        { value: 'yellow', label_th: '🟡 สีเหลือง (ที่อยู่อาศัย)', label_en: '🟡 Yellow (Residential)' },
                        { value: 'red', label_th: '🔴 สีแดง (พาณิชยกรรม)', label_en: '🔴 Red (Commercial)' },
                        { value: 'green', label_th: '🟢 สีเขียว (เกษตรกรรม)', label_en: '🟢 Green (Agricultural)' },
                        { value: 'purple', label_th: '🟣 สีม่วง (อุตสาหกรรม)', label_en: '🟣 Purple (Industrial)' },
                    ]
                },
            ]
        },
        {
            id: 'utilities',
            emoji: '⚡',
            title_th: 'สาธารณูปโภค',
            title_en: 'Utilities',
            fields: [
                {
                    key: 'electricity', label_th: 'ไฟฟ้า', label_en: 'Electricity', importance: 'recommended', type: 'select',
                    options: [
                        { value: 'available', label_th: '⚡ มีไฟฟ้าถึง', label_en: '⚡ Available' },
                        { value: 'nearby', label_th: '🔌 ใกล้แนวไฟฟ้า', label_en: '🔌 Nearby' },
                        { value: 'none', label_th: '❌ ไม่มี', label_en: '❌ None' },
                    ]
                },
                {
                    key: 'water', label_th: 'น้ำประปา', label_en: 'Water Supply', importance: 'recommended', type: 'select',
                    options: [
                        { value: 'tap_water', label_th: '💧 ประปา', label_en: '💧 Tap Water' },
                        { value: 'well', label_th: '🕳️ บ่อบาดาล', label_en: '🕳️ Well' },
                        { value: 'none', label_th: '❌ ไม่มี', label_en: '❌ None' },
                    ]
                },
            ]
        },
        {
            id: 'expenses',
            emoji: '💰',
            title_th: 'ค่าใช้จ่าย',
            title_en: 'Expenses',
            fields: [
                { key: 'common_fee', label_th: 'ค่าส่วนกลาง (บาท/เดือน)', label_en: 'Common Fee (THB/month)', importance: 'optional', type: 'text' },
            ]
        },
        {
            id: 'facilities',
            emoji: '🏊',
            title_th: 'สิ่งอำนวยความสะดวก',
            title_en: 'Facilities',
            fields: [
                { key: 'facilities', label_th: 'สิ่งอำนวยความสะดวก', label_en: 'Facilities', importance: 'optional', type: 'text' },
            ]
        },
    ],
    targetAudience: {
        th: ['ครอบครัว', 'นักลงทุน', 'คนซื้อบ้านหลังแรก', 'ผู้เกษียณ'],
        en: ['Families', 'Investors', 'First-time buyers', 'Retirees']
    }
}

// ============================================
// AMULET & COLLECTIBLES TEMPLATE (ID: 9)
// Thai Buddhist Amulet Market Specific Fields
// ============================================
const AMULET_TEMPLATE: CategoryTemplate = {
    categoryId: 9,
    categoryName: 'Amulets & Collectibles',
    emoji: '🙏',
    sections: [
        {
            id: 'origin',
            emoji: '🏛️',
            title_th: 'แหล่งที่มา',
            title_en: 'Origin',
            fields: [
                { key: 'temple', label_th: 'วัดที่สร้าง', label_en: 'Temple', importance: 'required', type: 'text' },
                { key: 'province', label_th: 'จังหวัด', label_en: 'Province', importance: 'required', type: 'text' },
                { key: 'abbot', label_th: 'พระเกจิอาจารย์', label_en: 'Presiding Monk', importance: 'recommended', type: 'text' },
                {
                    key: 'era', label_th: 'พ.ศ. ที่สร้าง', label_en: 'Year Created (BE)', importance: 'required', type: 'select',
                    options: [
                        { value: 'before2500', label_th: '📜 ก่อน พ.ศ. 2500', label_en: '📜 Before BE 2500' },
                        { value: '2500-2520', label_th: '⭐ พ.ศ. 2500-2520', label_en: '⭐ BE 2500-2520' },
                        { value: '2521-2540', label_th: '✨ พ.ศ. 2521-2540', label_en: '✨ BE 2521-2540' },
                        { value: '2541-2560', label_th: '🌟 พ.ศ. 2541-2560', label_en: '🌟 BE 2541-2560' },
                        { value: 'after2560', label_th: '🔮 หลัง พ.ศ. 2560', label_en: '🔮 After BE 2560' },
                    ]
                },
                {
                    key: 'batch', label_th: 'รุ่น/พิธี', label_en: 'Edition/Ceremony', importance: 'recommended', type: 'text',
                    placeholder_th: 'เช่น รุ่นแรก, พิธีใหญ่'
                },
            ]
        },
        {
            id: 'amulet_details',
            emoji: '📿',
            title_th: 'รายละเอียดพระ',
            title_en: 'Amulet Details',
            fields: [
                {
                    key: 'amulet_type', label_th: 'ประเภทพระ', label_en: 'Amulet Type', importance: 'required', type: 'select',
                    options: [
                        { value: 'phra_somdej', label_th: '🙏 พระสมเด็จ', label_en: '🙏 Phra Somdej' },
                        { value: 'phra_phong', label_th: '📿 พระผง', label_en: '📿 Phra Phong' },
                        { value: 'phra_krueang', label_th: '⚱️ พระกริ่ง', label_en: '⚱️ Phra Kring' },
                        { value: 'rian', label_th: '🏅 เหรียญ', label_en: '🏅 Rian (Coin)' },
                        { value: 'phra_rod', label_th: '🔰 พระรอด', label_en: '🔰 Phra Rod' },
                        { value: 'phra_nang_phaya', label_th: '👑 พระนางพญา', label_en: '👑 Phra Nang Phaya' },
                        { value: 'takrut', label_th: '📜 ตะกรุด', label_en: '📜 Takrut' },
                        { value: 'look_om', label_th: '🔮 ลูกอม', label_en: '🔮 Look Om' },
                        { value: 'other', label_th: '📦 อื่นๆ', label_en: '📦 Other' },
                    ]
                },
                {
                    key: 'material', label_th: 'เนื้อพระ', label_en: 'Material', importance: 'required', type: 'select',
                    options: [
                        { value: 'nur_phong', label_th: '⚪ เนื้อผง', label_en: '⚪ Powder' },
                        { value: 'nur_din', label_th: '🟤 เนื้อดิน', label_en: '🟤 Clay' },
                        { value: 'nur_wan', label_th: '🟢 เนื้อว่าน', label_en: '🟢 Herbal' },
                        { value: 'nur_thong', label_th: '🟡 เนื้อทอง', label_en: '🟡 Gold' },
                        { value: 'nur_ngoen', label_th: '⚪ เนื้อเงิน', label_en: '⚪ Silver' },
                        { value: 'nur_nawa', label_th: '🔶 เนื้อนวโลหะ', label_en: '🔶 Nawa Metal' },
                        { value: 'nur_thongdaeng', label_th: '🟠 เนื้อทองแดง', label_en: '🟠 Copper' },
                        { value: 'nur_chin', label_th: '⚫ เนื้อชิน', label_en: '⚫ Tin' },
                        { value: 'nur_alpaca', label_th: '⬜ เนื้ออัลปาก้า', label_en: '⬜ Alpaca' },
                    ]
                },
                { key: 'size_mm', label_th: 'ขนาด (มม.)', label_en: 'Size (mm)', importance: 'recommended', type: 'text' },
                { key: 'serial_number', label_th: 'หมายเลข/เลขกำกับ', label_en: 'Serial Number', importance: 'optional', type: 'text' },
            ]
        },
        {
            id: 'authentication',
            emoji: '✅',
            title_th: 'การรับรอง/ตรวจสอบ',
            title_en: 'Authentication',
            fields: [
                {
                    key: 'certificate', label_th: 'ใบรับรอง', label_en: 'Certificate', importance: 'required', type: 'select',
                    options: [
                        { value: 'samakom', label_th: '🏆 ผ่านสมาคมพระเครื่อง', label_en: '🏆 Amulet Society Certified' },
                        { value: 'dd_phra', label_th: '✅ ผ่าน DD-Phra', label_en: '✅ DD-Phra Certified' },
                        { value: 'g_phra', label_th: '✅ ผ่าน G-Phra', label_en: '✅ G-Phra Certified' },
                        { value: 'temple', label_th: '🏛️ ใบรับรองจากวัด', label_en: '🏛️ Temple Certificate' },
                        { value: 'none', label_th: '❌ ไม่มีใบรับรอง', label_en: '❌ No Certificate' },
                    ]
                },
                { key: 'competition', label_th: 'รางวัลประกวด', label_en: 'Competition Awards', importance: 'optional', type: 'text' },
            ]
        },
        {
            id: 'condition',
            emoji: '🔍',
            title_th: 'สภาพพระ',
            title_en: 'Condition',
            fields: [
                {
                    key: 'amulet_condition', label_th: 'สภาพโดยรวม', label_en: 'Overall Condition', importance: 'required', type: 'select',
                    options: [
                        { value: 'perfect', label_th: '⭐ สวยแชมป์/สมบูรณ์', label_en: '⭐ Perfect/Champion' },
                        { value: 'excellent', label_th: '✨ สวยมาก', label_en: '✨ Excellent' },
                        { value: 'good', label_th: '👍 สวยพอใช้', label_en: '👍 Good' },
                        { value: 'fair', label_th: '🔧 มีตำหนิบ้าง', label_en: '🔧 Fair (Minor Defects)' },
                    ]
                },
                { key: 'defects', label_th: 'ตำหนิ (ถ้ามี)', label_en: 'Defects', importance: 'optional', type: 'text', placeholder_th: 'เช่น บิ่นมุม, รอยขีด' },
                {
                    key: 'casing', label_th: 'กรอบ/ตลับ', label_en: 'Casing', importance: 'optional', type: 'select',
                    options: [
                        { value: 'gold', label_th: '🥇 ตลับทอง', label_en: '🥇 Gold Casing' },
                        { value: 'silver', label_th: '🥈 ตลับเงิน', label_en: '🥈 Silver Casing' },
                        { value: 'stainless', label_th: '⬜ ตลับสแตนเลส', label_en: '⬜ Stainless Casing' },
                        { value: 'none', label_th: '📿 ไม่มีตลับ', label_en: '📿 No Casing' },
                    ]
                },
            ]
        },
        {
            id: 'special',
            emoji: '✨',
            title_th: 'คาถา/พุทธคุณ',
            title_en: 'Special Powers',
            fields: [
                {
                    key: 'powers', label_th: 'พุทธคุณเด่น', label_en: 'Main Powers', importance: 'optional', type: 'text',
                    placeholder_th: 'เช่น เมตตามหานิยม, คงกระพันชาตรี, โชคลาภ'
                },
            ]
        },
    ],
    targetAudience: {
        th: ['นักสะสมพระ', 'ผู้ศรัทธา', 'นักลงทุนพระเครื่อง'],
        en: ['Amulet Collectors', 'Devotees', 'Amulet Investors']
    }
}

// ============================================
// DEFAULT/GENERAL TEMPLATE
// ============================================
const DEFAULT_TEMPLATE: CategoryTemplate = {
    categoryId: 0,
    categoryName: 'General',
    emoji: '📦',
    sections: [
        {
            id: 'details',
            emoji: '📋',
            title_th: 'รายละเอียดสินค้า',
            title_en: 'Product Details',
            fields: [
                { key: 'brand', label_th: 'แบรนด์/ยี่ห้อ', label_en: 'Brand', importance: 'recommended', type: 'text', extractFromTitle: true, aiDetectable: true },
                { key: 'model', label_th: 'รุ่น', label_en: 'Model', importance: 'recommended', type: 'text', extractFromTitle: true },
                { key: 'color', label_th: 'สี', label_en: 'Color', importance: 'optional', type: 'text', aiDetectable: true },
                { key: 'size', label_th: 'ขนาด', label_en: 'Size', importance: 'optional', type: 'text' },
            ]
        },
        {
            id: 'condition',
            emoji: '✅',
            title_th: 'รายละเอียดเพิ่มเติม',
            title_en: 'Additional Details',
            fields: [
                // REMOVED 'overall' - duplicate of main condition dropdown
                { key: 'defects', label_th: 'ตำหนิ (ถ้ามี)', label_en: 'Defects (if any)', importance: 'recommended', type: 'text' },
                { key: 'warranty', label_th: 'ประกันเหลือถึง', label_en: 'Warranty Until', importance: 'optional', type: 'text' },
            ]
        },
        {
            id: 'included',
            emoji: '📦',
            title_th: 'สิ่งที่รวมอยู่',
            title_en: 'What\'s Included',
            fields: [
                { key: 'included_items', label_th: 'รายการ', label_en: 'Items', importance: 'optional', type: 'text' },
            ]
        },
    ],
    targetAudience: {
        th: ['ทุกคน'],
        en: ['Everyone']
    }
}

// ============================================
// APPLIANCES TEMPLATE (ID: 5)
// ============================================
const APPLIANCES_TEMPLATE: CategoryTemplate = {
    categoryId: 5,
    categoryName: 'Home Appliances',
    emoji: '🔌',
    sections: [
        {
            id: 'specs',
            emoji: '📋',
            title_th: 'รายละเอียด',
            title_en: 'Details',
            fields: [
                { key: 'brand', label_th: 'แบรนด์', label_en: 'Brand', importance: 'required', type: 'text', aiDetectable: true },
                { key: 'model', label_th: 'รุ่น', label_en: 'Model', importance: 'required', type: 'text', aiDetectable: true },
                { key: 'size', label_th: 'ขนาด', label_en: 'Size', importance: 'required', type: 'text' },
                { key: 'power', label_th: 'กำลังไฟ (วัตต์)', label_en: 'Power (Watts)', importance: 'recommended', type: 'text' },
                {
                    key: 'energy', label_th: 'ฉลากประหยัดไฟ', label_en: 'Energy Rating', importance: 'optional', type: 'select',
                    options: [
                        { value: 'เบอร์ 5', label_th: 'เบอร์ 5 ⭐⭐⭐⭐⭐', label_en: '5-Star' },
                        { value: 'เบอร์ 4', label_th: 'เบอร์ 4 ⭐⭐⭐⭐', label_en: '4-Star' },
                        { value: 'เบอร์ 3', label_th: 'เบอร์ 3 ⭐⭐⭐', label_en: '3-Star' },
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
                // REMOVED 'overall' - duplicate of main condition dropdown
                {
                    key: 'warranty', label_th: 'ประกันเหลือ', label_en: 'Warranty Remaining', importance: 'recommended', type: 'select',
                    options: [
                        { value: 'expired', label_th: '❌ หมดประกันแล้ว', label_en: '❌ Expired' },
                        { value: 'less_3m', label_th: '⏰ เหลือไม่ถึง 3 เดือน', label_en: '⏰ Less than 3 months' },
                        { value: '3_6m', label_th: '📆 เหลือ 3-6 เดือน', label_en: '📆 3-6 months' },
                        { value: '6_12m', label_th: '✅ เหลือ 6-12 เดือน', label_en: '✅ 6-12 months' },
                        { value: 'more_1y', label_th: '🏆 เหลือมากกว่า 1 ปี', label_en: '🏆 More than 1 year' },
                        { value: 'unknown', label_th: '❓ ไม่ทราบ', label_en: '❓ Unknown' },
                    ]
                },
                {
                    key: 'defects', label_th: 'ตำหนิ/ข้อบกพร่อง', label_en: 'Defects', importance: 'recommended', type: 'multiselect',
                    options: [
                        { value: 'none', label_th: '✨ ไม่มีตำหนิ', label_en: '✨ No defects' },
                        { value: 'minor_scratches', label_th: '📝 รอยขีดข่วนเล็กน้อย', label_en: '📝 Minor scratches' },
                        { value: 'dent', label_th: '💢 บุบ/ยุบ', label_en: '💢 Dent' },
                        { value: 'rust', label_th: '🟤 มีสนิม/คราบ', label_en: '🟤 Rust/Stains' },
                        { value: 'noise', label_th: '🔊 มีเสียงดัง', label_en: '🔊 Noisy' },
                        { value: 'cooling_issue', label_th: '❄️ ทำความเย็นช้า/ไม่เย็น', label_en: '❄️ Cooling issue' },
                        { value: 'heating_issue', label_th: '🔥 ทำความร้อนไม่ดี', label_en: '🔥 Heating issue' },
                        { value: 'button_issue', label_th: '🔘 ปุ่มบางปุ่มไม่ทำงาน', label_en: '🔘 Button issues' },
                        { value: 'leak', label_th: '💧 มีน้ำรั่ว/ซึม', label_en: '💧 Leak' },
                        { value: 'other', label_th: '📝 อื่นๆ', label_en: '📝 Other' },
                    ]
                },
            ]
        },
    ],
    targetAudience: {
        th: ['ครอบครัว', 'คอนโด', 'หอพัก', 'ออฟฟิศ'],
        en: ['Families', 'Condos', 'Dorms', 'Offices']
    }
}

// ============================================
// CAMERA TEMPLATE (ID: 8)
// ============================================
const CAMERA_TEMPLATE: CategoryTemplate = {
    categoryId: 8,
    categoryName: 'Cameras',
    emoji: '📷',
    sections: [
        {
            id: 'specs',
            emoji: '📷',
            title_th: 'สเปคกล้อง',
            title_en: 'Camera Specs',
            fields: [
                { key: 'brand', label_th: 'แบรนด์', label_en: 'Brand', importance: 'required', type: 'text', aiDetectable: true },
                { key: 'model', label_th: 'รุ่น', label_en: 'Model', importance: 'required', type: 'text', aiDetectable: true },
                {
                    key: 'type', label_th: 'ประเภท', label_en: 'Type', importance: 'required', type: 'select',
                    options: [
                        { value: 'mirrorless', label_th: 'Mirrorless', label_en: 'Mirrorless' },
                        { value: 'dslr', label_th: 'DSLR', label_en: 'DSLR' },
                        { value: 'compact', label_th: 'Compact', label_en: 'Compact' },
                        { value: 'action', label_th: 'Action Camera', label_en: 'Action Camera' },
                        { value: 'film', label_th: 'กล้องฟิล์ม', label_en: 'Film Camera' },
                    ]
                },
                {
                    key: 'sensor', label_th: 'เซนเซอร์', label_en: 'Sensor', importance: 'recommended', type: 'select',
                    options: [
                        { value: 'fullframe', label_th: 'Full Frame', label_en: 'Full Frame' },
                        { value: 'apsc', label_th: 'APS-C', label_en: 'APS-C' },
                        { value: 'mft', label_th: 'Micro 4/3', label_en: 'Micro Four Thirds' },
                    ]
                },
                { key: 'shutter', label_th: 'ชัตเตอร์ (รูป)', label_en: 'Shutter Count', importance: 'recommended', type: 'number' },
            ]
        },
        {
            id: 'condition',
            emoji: '✅',
            title_th: 'รายละเอียดเพิ่มเติม',
            title_en: 'Additional Details',
            fields: [
                // REMOVED 'overall' - duplicate of main condition dropdown
                {
                    key: 'sensor_dust', label_th: 'ฝุ่นเซนเซอร์', label_en: 'Sensor Dust', importance: 'recommended', type: 'select',
                    options: [
                        { value: 'clean', label_th: '✨ สะอาด ไม่มีฝุ่น', label_en: '✨ Clean, no dust' },
                        { value: 'minor', label_th: '📝 มีฝุ่นเล็กน้อย (ไม่เห็นในรูป)', label_en: '📝 Minor dust (not visible in photos)' },
                        { value: 'visible', label_th: '⚠️ มีฝุ่นเห็นในรูป', label_en: '⚠️ Visible dust in photos' },
                        { value: 'needs_cleaning', label_th: '🧹 ต้องล้างเซนเซอร์', label_en: '🧹 Needs sensor cleaning' },
                        { value: 'unknown', label_th: '❓ ไม่ได้ตรวจ', label_en: '❓ Not checked' },
                    ]
                },
                {
                    key: 'shutter_count', label_th: 'ชัตเตอร์เคาท์', label_en: 'Shutter Count', importance: 'recommended', type: 'select',
                    options: [
                        { value: 'under_5k', label_th: '🆕 ต่ำกว่า 5,000 (ใหม่มาก)', label_en: '🆕 Under 5,000 (Like new)' },
                        { value: '5k_20k', label_th: '✅ 5,000-20,000 (ดีมาก)', label_en: '✅ 5,000-20,000 (Excellent)' },
                        { value: '20k_50k', label_th: '📷 20,000-50,000 (ดี)', label_en: '📷 20,000-50,000 (Good)' },
                        { value: '50k_100k', label_th: '📊 50,000-100,000 (ใช้งานมาก)', label_en: '📊 50,000-100,000 (Well used)' },
                        { value: 'over_100k', label_th: '⚠️ มากกว่า 100,000', label_en: '⚠️ Over 100,000' },
                        { value: 'unknown', label_th: '❓ ไม่ทราบ', label_en: '❓ Unknown' },
                    ]
                },
                {
                    key: 'warranty', label_th: 'ประกันเหลือ', label_en: 'Warranty Remaining', importance: 'optional', type: 'select',
                    options: [
                        { value: 'expired', label_th: '❌ หมดประกันแล้ว', label_en: '❌ Expired' },
                        { value: 'less_3m', label_th: '⏰ เหลือไม่ถึง 3 เดือน', label_en: '⏰ Less than 3 months' },
                        { value: '3_6m', label_th: '📆 เหลือ 3-6 เดือน', label_en: '📆 3-6 months' },
                        { value: '6_12m', label_th: '✅ เหลือ 6-12 เดือน', label_en: '✅ 6-12 months' },
                        { value: 'more_1y', label_th: '🏆 เหลือมากกว่า 1 ปี', label_en: '🏆 More than 1 year' },
                        { value: 'unknown', label_th: '❓ ไม่ทราบ', label_en: '❓ Unknown' },
                    ]
                },
            ]
        },
        {
            id: 'included',
            emoji: '📦',
            title_th: 'อุปกรณ์ที่ให้',
            title_en: 'What\'s Included',
            fields: [
                {
                    key: 'included_items', label_th: 'รายการ', label_en: 'Items', importance: 'recommended', type: 'multiselect',
                    options: [
                        { value: 'body', label_th: 'ตัวกล้อง', label_en: 'Camera Body' },
                        { value: 'lens', label_th: 'เลนส์', label_en: 'Lens' },
                        { value: 'battery', label_th: 'แบตเตอรี่', label_en: 'Battery' },
                        { value: 'charger', label_th: 'ที่ชาร์จ', label_en: 'Charger' },
                        { value: 'strap', label_th: 'สายคล้อง', label_en: 'Strap' },
                        { value: 'box', label_th: 'กล่อง', label_en: 'Box' },
                    ]
                },
            ]
        },
    ],
    targetAudience: {
        th: ['ช่างภาพ', 'มือใหม่', 'Vlogger', 'YouTuber', 'นักเดินทาง'],
        en: ['Photographers', 'Beginners', 'Vloggers', 'YouTubers', 'Travelers']
    }
}

// ============================================
// GAMING TEMPLATE (ID: 7)
// ============================================
const GAMING_TEMPLATE: CategoryTemplate = {
    categoryId: 7,
    categoryName: 'Gaming & Gadgets',
    emoji: '🎮',
    sections: [
        {
            id: 'specs',
            emoji: '🎮',
            title_th: 'รายละเอียด',
            title_en: 'Details',
            fields: [
                { key: 'brand', label_th: 'แบรนด์', label_en: 'Brand', importance: 'required', type: 'text', aiDetectable: true },
                { key: 'model', label_th: 'รุ่น', label_en: 'Model', importance: 'required', type: 'text', aiDetectable: true },
                {
                    key: 'storage', label_th: 'ความจุ', label_en: 'Storage', importance: 'recommended', type: 'select',
                    options: [
                        { value: '500GB', label_th: '500GB', label_en: '500GB' },
                        { value: '1TB', label_th: '1TB', label_en: '1TB' },
                        { value: '2TB', label_th: '2TB', label_en: '2TB' },
                    ]
                },
                { key: 'color', label_th: 'สี', label_en: 'Color', importance: 'optional', type: 'text', aiDetectable: true },
            ]
        },
        {
            id: 'condition',
            emoji: '✅',
            title_th: 'รายละเอียดเพิ่มเติม',
            title_en: 'Additional Details',
            fields: [
                // REMOVED 'overall' - duplicate of main condition dropdown
                {
                    key: 'defects', label_th: 'ตำหนิ/ข้อบกพร่อง', label_en: 'Defects', importance: 'recommended', type: 'multiselect',
                    options: [
                        { value: 'none', label_th: '✨ ไม่มีตำหนิ', label_en: '✨ No defects' },
                        { value: 'minor_scratches', label_th: '📝 รอยขีดข่วนเล็กน้อย', label_en: '📝 Minor scratches' },
                        { value: 'controller_drift', label_th: '🕹️ จอย Drift', label_en: '🕹️ Controller Drift' },
                        { value: 'overheating', label_th: '🔥 ร้อนเกินปกติ', label_en: '🔥 Overheating' },
                        { value: 'disc_issue', label_th: '💿 แผ่นอ่านยาก', label_en: '💿 Disc reading issue' },
                        { value: 'fan_noise', label_th: '🌀 พัดลมเสียงดัง', label_en: '🌀 Fan noise' },
                        { value: 'hdmi_issue', label_th: '📺 พอร์ต HDMI มีปัญหา', label_en: '📺 HDMI port issue' },
                        { value: 'other', label_th: '📝 อื่นๆ', label_en: '📝 Other' },
                    ]
                },
                {
                    key: 'warranty', label_th: 'ประกันเหลือ', label_en: 'Warranty Remaining', importance: 'optional', type: 'select',
                    options: [
                        { value: 'expired', label_th: '❌ หมดประกันแล้ว', label_en: '❌ Expired' },
                        { value: 'less_3m', label_th: '⏰ เหลือไม่ถึง 3 เดือน', label_en: '⏰ Less than 3 months' },
                        { value: '3_6m', label_th: '📆 เหลือ 3-6 เดือน', label_en: '📆 3-6 months' },
                        { value: '6_12m', label_th: '✅ เหลือ 6-12 เดือน', label_en: '✅ 6-12 months' },
                        { value: 'more_1y', label_th: '🏆 เหลือมากกว่า 1 ปี', label_en: '🏆 More than 1 year' },
                        { value: 'unknown', label_th: '❓ ไม่ทราบ', label_en: '❓ Unknown' },
                    ]
                },
            ]
        },
        {
            id: 'included',
            emoji: '📦',
            title_th: 'อุปกรณ์ที่ให้',
            title_en: 'What\'s Included',
            fields: [
                {
                    key: 'included_items', label_th: 'รายการ', label_en: 'Items', importance: 'recommended', type: 'multiselect',
                    options: [
                        { value: 'console', label_th: 'เครื่องเกม', label_en: 'Console' },
                        { value: 'controller', label_th: 'จอย', label_en: 'Controller' },
                        { value: 'cables', label_th: 'สาย HDMI/สายไฟ', label_en: 'Cables' },
                        { value: 'games', label_th: 'เกม', label_en: 'Games' },
                        { value: 'box', label_th: 'กล่อง', label_en: 'Box' },
                    ]
                },
            ]
        },
    ],
    targetAudience: {
        th: ['เกมเมอร์', 'สตรีมเมอร์', 'นักสะสม'],
        en: ['Gamers', 'Streamers', 'Collectors']
    }
}

// ============================================
// HOME & GARDEN TEMPLATE (ID: 13)
// ============================================
const HOME_TEMPLATE: CategoryTemplate = {
    categoryId: 13,
    categoryName: 'Home & Garden',
    emoji: '🏠',
    sections: [
        {
            id: 'details',
            emoji: '📋',
            title_th: 'รายละเอียด',
            title_en: 'Details',
            fields: [
                { key: 'brand', label_th: 'แบรนด์', label_en: 'Brand', importance: 'recommended', type: 'text', aiDetectable: true },
                { key: 'type', label_th: 'ประเภท', label_en: 'Type', importance: 'required', type: 'text' },
                { key: 'material', label_th: 'วัสดุ', label_en: 'Material', importance: 'recommended', type: 'text' },
                { key: 'color', label_th: 'สี', label_en: 'Color', importance: 'required', type: 'text', aiDetectable: true },
            ]
        },
        {
            id: 'dimensions',
            emoji: '📏',
            title_th: 'ขนาด',
            title_en: 'Dimensions',
            fields: [
                { key: 'width', label_th: 'กว้าง (ซม.)', label_en: 'Width (cm)', importance: 'recommended', type: 'number' },
                { key: 'depth', label_th: 'ลึก (ซม.)', label_en: 'Depth (cm)', importance: 'recommended', type: 'number' },
                { key: 'height', label_th: 'สูง (ซม.)', label_en: 'Height (cm)', importance: 'recommended', type: 'number' },
            ]
        },
        {
            id: 'condition',
            emoji: '✅',
            title_th: 'รายละเอียดเพิ่มเติม',
            title_en: 'Additional Details',
            fields: [
                // REMOVED 'overall' - duplicate of main condition dropdown
                {
                    key: 'defects', label_th: 'ตำหนิ/ข้อบกพร่อง', label_en: 'Defects', importance: 'recommended', type: 'multiselect',
                    options: [
                        { value: 'none', label_th: '✨ ไม่มีตำหนิ', label_en: '✨ No defects' },
                        { value: 'minor_scratches', label_th: '📝 รอยขีดข่วนเล็กน้อย', label_en: '📝 Minor scratches' },
                        { value: 'dent', label_th: '💢 บุบ/ยุบ', label_en: '💢 Dent' },
                        { value: 'stain', label_th: '💧 รอยเปื้อน', label_en: '💧 Stains' },
                        { value: 'wobbly', label_th: '📐 โยกเยก', label_en: '📐 Wobbly' },
                        { value: 'faded', label_th: '🎨 สีซีด', label_en: '🎨 Faded' },
                        { value: 'rust', label_th: '🟤 มีสนิม', label_en: '🟤 Rust' },
                        { value: 'missing_part', label_th: '🧩 อุปกรณ์ไม่ครบ', label_en: '🧩 Missing parts' },
                        { value: 'other', label_th: '📝 อื่นๆ', label_en: '📝 Other' },
                    ]
                },
                {
                    key: 'assembly', label_th: 'การประกอบ', label_en: 'Assembly', importance: 'optional', type: 'select',
                    options: [
                        { value: 'assembled', label_th: 'ประกอบแล้ว', label_en: 'Pre-assembled' },
                        { value: 'flat', label_th: 'ต้องประกอบเอง', label_en: 'Flat-pack' },
                    ]
                },
            ]
        },
    ],
    targetAudience: {
        th: ['แต่งบ้าน', 'คอนโด', 'ทำสวน'],
        en: ['Home decorators', 'Condo owners', 'Gardeners']
    }
}

// ============================================
// BEAUTY TEMPLATE (ID: 14)
// ============================================
const BEAUTY_TEMPLATE: CategoryTemplate = {
    categoryId: 14,
    categoryName: 'Beauty & Cosmetics',
    emoji: '💄',
    sections: [
        {
            id: 'details',
            emoji: '💄',
            title_th: 'รายละเอียด',
            title_en: 'Details',
            fields: [
                { key: 'brand', label_th: 'แบรนด์', label_en: 'Brand', importance: 'required', type: 'text', aiDetectable: true },
                { key: 'product', label_th: 'ชื่อสินค้า', label_en: 'Product Name', importance: 'required', type: 'text' },
                { key: 'shade', label_th: 'เฉดสี', label_en: 'Shade', importance: 'recommended', type: 'text' },
                { key: 'size', label_th: 'ขนาด', label_en: 'Size', importance: 'recommended', type: 'text' },
            ]
        },
        {
            id: 'condition',
            emoji: '✅',
            title_th: 'รายละเอียดเพิ่มเติม',
            title_en: 'Additional Details',
            fields: [
                // REMOVED 'overall' - duplicate of main condition dropdown
                {
                    key: 'expiry', label_th: 'สถานะหมดอายุ', label_en: 'Expiry Status', importance: 'required', type: 'select',
                    options: [
                        { value: 'more_1y', label_th: '🏆 หมดอายุมากกว่า 1 ปี', label_en: '🏆 Expires in more than 1 year' },
                        { value: '6_12m', label_th: '✅ หมดอายุใน 6-12 เดือน', label_en: '✅ Expires in 6-12 months' },
                        { value: '3_6m', label_th: '📆 หมดอายุใน 3-6 เดือน', label_en: '📆 Expires in 3-6 months' },
                        { value: 'less_3m', label_th: '⏰ หมดอายุใน 3 เดือน', label_en: '⏰ Expires in 3 months' },
                        { value: 'expired', label_th: '❌ หมดอายุแล้ว', label_en: '❌ Expired' },
                    ]
                },
                {
                    key: 'usage', label_th: 'ใช้ไปแล้ว', label_en: 'Amount Used', importance: 'recommended', type: 'select',
                    options: [
                        { value: 'new', label_th: '🆕 ยังไม่เคยใช้ (ซีลไม่แกะ)', label_en: '🆕 Never used (Sealed)' },
                        { value: 'under_10', label_th: '✨ ใช้ไม่ถึง 10%', label_en: '✨ Under 10% used' },
                        { value: '10_30', label_th: '📊 ใช้ไป 10-30%', label_en: '📊 10-30% used' },
                        { value: '30_50', label_th: '📊 ใช้ไป 30-50%', label_en: '📊 30-50% used' },
                        { value: 'over_50', label_th: '📉 ใช้ไปมากกว่า 50%', label_en: '📉 Over 50% used' },
                    ]
                },
            ]
        },
    ],
    targetAudience: {
        th: ['สาวๆ', 'คนรักสวย', 'MUA'],
        en: ['Women', 'Beauty lovers', 'MUAs']
    }
}

// ============================================
// KIDS & BABY TEMPLATE (ID: 15)
// ============================================
const KIDS_TEMPLATE: CategoryTemplate = {
    categoryId: 15,
    categoryName: 'Kids & Baby',
    emoji: '👶',
    sections: [
        {
            id: 'details',
            emoji: '📋',
            title_th: 'รายละเอียด',
            title_en: 'Details',
            fields: [
                { key: 'brand', label_th: 'แบรนด์', label_en: 'Brand', importance: 'required', type: 'text', aiDetectable: true },
                { key: 'product', label_th: 'สินค้า', label_en: 'Product', importance: 'required', type: 'text' },
                { key: 'age', label_th: 'อายุที่เหมาะสม', label_en: 'Suitable Age', importance: 'required', type: 'text' },
                {
                    key: 'gender', label_th: 'เพศ', label_en: 'Gender', importance: 'optional', type: 'select',
                    options: [
                        { value: 'boy', label_th: 'เด็กชาย', label_en: 'Boy' },
                        { value: 'girl', label_th: 'เด็กหญิง', label_en: 'Girl' },
                        { value: 'unisex', label_th: 'ใช้ได้ทั้งสองเพศ', label_en: 'Unisex' },
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
                // REMOVED 'overall' - duplicate of main condition dropdown
                {
                    key: 'defects', label_th: 'ตำหนิ/ข้อบกพร่อง', label_en: 'Defects', importance: 'recommended', type: 'multiselect',
                    options: [
                        { value: 'none', label_th: '✨ ไม่มีตำหนิ', label_en: '✨ No defects' },
                        { value: 'minor_scratches', label_th: '📝 รอยขีดข่วนเล็กน้อย', label_en: '📝 Minor scratches' },
                        { value: 'stain', label_th: '💧 รอยเปื้อน', label_en: '💧 Stains' },
                        { value: 'faded', label_th: '🎨 สีซีด', label_en: '🎨 Faded' },
                        { value: 'missing_part', label_th: '🧩 อุปกรณ์ไม่ครบ', label_en: '🧩 Missing parts' },
                        { value: 'other', label_th: '📝 อื่นๆ', label_en: '📝 Other' },
                    ]
                },
                {
                    key: 'safety', label_th: 'ความปลอดภัย', label_en: 'Safety Info', importance: 'optional', type: 'select',
                    options: [
                        { value: 'certified', label_th: '✅ ผ่าน มอก./CE/ASTM', label_en: '✅ Certified (TIS/CE/ASTM)' },
                        { value: 'bpa_free', label_th: '🍼 BPA Free', label_en: '🍼 BPA Free' },
                        { value: 'non_toxic', label_th: '🌿 Non-toxic', label_en: '🌿 Non-toxic' },
                        { value: 'unknown', label_th: '❓ ไม่ทราบ', label_en: '❓ Unknown' },
                    ]
                },
            ]
        },
    ],
    targetAudience: {
        th: ['คุณแม่', 'คุณพ่อ', 'ครอบครัว'],
        en: ['Moms', 'Dads', 'Families']
    }
}

// ============================================
// PETS TEMPLATE (ID: 10)
// ============================================
const PETS_TEMPLATE: CategoryTemplate = {
    categoryId: 10,
    categoryName: 'Pets',
    emoji: '🐾',
    sections: [
        {
            id: 'pet',
            emoji: '🐕',
            title_th: 'ข้อมูลสัตว์เลี้ยง',
            title_en: 'Pet Info',
            fields: [
                {
                    key: 'type', label_th: 'ประเภท', label_en: 'Type', importance: 'required', type: 'select',
                    options: [
                        { value: 'dog', label_th: 'สุนัข', label_en: 'Dog' },
                        { value: 'cat', label_th: 'แมว', label_en: 'Cat' },
                        { value: 'bird', label_th: 'นก', label_en: 'Bird' },
                        { value: 'fish', label_th: 'ปลา', label_en: 'Fish' },
                        { value: 'other', label_th: 'อื่นๆ', label_en: 'Other' },
                    ]
                },
                { key: 'breed', label_th: 'สายพันธุ์', label_en: 'Breed', importance: 'required', type: 'text' },
                { key: 'age', label_th: 'อายุ', label_en: 'Age', importance: 'required', type: 'text' },
                {
                    key: 'gender', label_th: 'เพศ', label_en: 'Gender', importance: 'required', type: 'select',
                    options: [
                        { value: 'male', label_th: 'ผู้', label_en: 'Male' },
                        { value: 'female', label_th: 'เมีย', label_en: 'Female' },
                    ]
                },
                { key: 'color', label_th: 'สี', label_en: 'Color', importance: 'recommended', type: 'text', aiDetectable: true },
            ]
        },
        {
            id: 'health',
            emoji: '💉',
            title_th: 'สุขภาพ',
            title_en: 'Health',
            fields: [
                { key: 'vaccine', label_th: 'วัคซีน', label_en: 'Vaccination', importance: 'required', type: 'text' },
                {
                    key: 'neutered', label_th: 'ทำหมัน', label_en: 'Neutered/Spayed', importance: 'recommended', type: 'select',
                    options: [
                        { value: 'yes', label_th: 'ทำหมันแล้ว', label_en: 'Yes' },
                        { value: 'no', label_th: 'ยังไม่ทำหมัน', label_en: 'No' },
                    ]
                },
                { key: 'health_notes', label_th: 'หมายเหตุสุขภาพ', label_en: 'Health Notes', importance: 'optional', type: 'text' },
            ]
        },
    ],
    targetAudience: {
        th: ['คนรักสัตว์', 'ครอบครัว', 'คนอยู่คนเดียว'],
        en: ['Pet lovers', 'Families', 'Singles']
    }
}

// ============================================
// AUTOMOTIVE PARTS TEMPLATE (Subcategory of 1)
// ============================================
const AUTOMOTIVE_PARTS_TEMPLATE: CategoryTemplate = {
    categoryId: 1,
    categoryName: 'Automotive Parts',
    emoji: '🔧',
    sections: [
        {
            id: 'specs',
            emoji: '🔧',
            title_th: 'รายละเอียดอะไหล่',
            title_en: 'Parts Details',
            fields: [
                { key: 'brand', label_th: 'ยี่ห้อ', label_en: 'Brand', importance: 'required', type: 'text', extractFromTitle: true, aiDetectable: true },
                { key: 'model', label_th: 'รุ่น/ชื่อชิ้นส่วน', label_en: 'Model/Part Name', importance: 'required', type: 'text', extractFromTitle: true },
                { key: 'part_number', label_th: 'เลขพาร์ท', label_en: 'Part Number', importance: 'recommended', type: 'text' },
                { key: 'compatible', label_th: 'รถที่รองรับ', label_en: 'Compatible with', importance: 'recommended', type: 'text' },
                { key: 'quantity', label_th: 'จำนวน', label_en: 'Quantity', importance: 'optional', type: 'text' },
            ]
        },
        {
            id: 'condition',
            emoji: '✅',
            title_th: 'รายละเอียดเพิ่มเติม',
            title_en: 'Additional Details',
            fields: [
                // REMOVED 'overall' - duplicate of main condition dropdown
                {
                    key: 'oem_info', label_th: 'ของแท้หรือเทียบ', label_en: 'Original or Aftermarket', importance: 'recommended', type: 'select',
                    options: [
                        { value: 'oem', label_th: 'ของแท้ศูนย์ (OEM)', label_en: 'Original (OEM)' },
                        { value: 'aftermarket', label_th: 'ของเทียบ/ทดแทน', label_en: 'Aftermarket' },
                        { value: 'unknown', label_th: 'ไม่ทราบ', label_en: 'Unknown' },
                    ]
                },
                { key: 'warranty', label_th: 'ประกัน', label_en: 'Warranty', importance: 'optional', type: 'text', placeholder_th: 'เช่น 6 เดือน, 1 ปี, ไม่มี', placeholder_en: 'e.g. 6 months, 1 year, none' },
            ]
        },
    ],
    targetAudience: {
        th: ['ช่างซ่อมรถ', 'อู่รถ', 'คนรักรถ', 'DIY'],
        en: ['Mechanics', 'Garages', 'Car Enthusiasts', 'DIY']
    }
}

// ============================================
// SERVICES TEMPLATE (ID: 11)
// Thai Service Provider Market
// ============================================
const SERVICES_TEMPLATE: CategoryTemplate = {
    categoryId: 11,
    categoryName: 'Services',
    emoji: '🛠️',
    sections: [
        {
            id: 'service_info',
            emoji: '📋',
            title_th: 'ข้อมูลบริการ',
            title_en: 'Service Information',
            fields: [
                {
                    key: 'service_type', label_th: 'ประเภทบริการ', label_en: 'Service Type', importance: 'required', type: 'select',
                    options: [
                        { value: 'repair', label_th: '🔧 ซ่อมแซม', label_en: '🔧 Repair' },
                        { value: 'installation', label_th: '🔨 ติดตั้ง', label_en: '🔨 Installation' },
                        { value: 'cleaning', label_th: '🧹 ทำความสะอาด', label_en: '🧹 Cleaning' },
                        { value: 'moving', label_th: '🚚 ขนย้าย', label_en: '🚚 Moving' },
                        { value: 'tutoring', label_th: '📚 สอน/ติว', label_en: '📚 Tutoring' },
                        { value: 'other', label_th: '📦 อื่นๆ', label_en: '📦 Other' },
                    ]
                },
                { key: 'service_description', label_th: 'รายละเอียดบริการ', label_en: 'Service Description', importance: 'required', type: 'text' },
            ]
        },
        {
            id: 'pricing',
            emoji: '💰',
            title_th: 'ราคาและการคิดค่าบริการ',
            title_en: 'Pricing',
            fields: [
                {
                    key: 'pricing_type', label_th: 'รูปแบบการคิดราคา', label_en: 'Pricing Type', importance: 'required', type: 'select',
                    options: [
                        { value: 'hourly', label_th: '⏰ รายชั่วโมง', label_en: '⏰ Per Hour' },
                        { value: 'daily', label_th: '📅 รายวัน', label_en: '📅 Per Day' },
                        { value: 'per_job', label_th: '📝 ต่องาน', label_en: '📝 Per Job' },
                        { value: 'negotiable', label_th: '💬 ตามตกลง', label_en: '💬 Negotiable' },
                    ]
                },
                { key: 'min_price', label_th: 'ราคาเริ่มต้น (บาท)', label_en: 'Starting Price (THB)', importance: 'recommended', type: 'text' },
            ]
        },
        {
            id: 'coverage',
            emoji: '📍',
            title_th: 'พื้นที่ให้บริการ',
            title_en: 'Service Coverage',
            fields: [
                { key: 'coverage_area', label_th: 'พื้นที่ให้บริการ', label_en: 'Coverage Area', importance: 'required', type: 'text', placeholder_th: 'เช่น กรุงเทพฯ และปริมณฑล' },
                {
                    key: 'travel_fee', label_th: 'ค่าเดินทาง', label_en: 'Travel Fee', importance: 'optional', type: 'select',
                    options: [
                        { value: 'free', label_th: '🆓 ฟรี', label_en: '🆓 Free' },
                        { value: 'included', label_th: '✅ รวมในราคา', label_en: '✅ Included' },
                        { value: 'extra', label_th: '💵 คิดเพิ่ม', label_en: '💵 Extra Charge' },
                    ]
                },
            ]
        },
        {
            id: 'experience',
            emoji: '⭐',
            title_th: 'ประสบการณ์และคุณสมบัติ',
            title_en: 'Experience & Qualifications',
            fields: [
                { key: 'experience_years', label_th: 'ประสบการณ์ (ปี)', label_en: 'Years of Experience', importance: 'recommended', type: 'text' },
                { key: 'certifications', label_th: 'ใบรับรอง/วุฒิบัตร', label_en: 'Certifications', importance: 'optional', type: 'text' },
                { key: 'portfolio', label_th: 'ผลงานที่ผ่านมา', label_en: 'Portfolio/Past Work', importance: 'optional', type: 'text' },
            ]
        },
        {
            id: 'availability',
            emoji: '📅',
            title_th: 'ความพร้อมให้บริการ',
            title_en: 'Availability',
            fields: [
                { key: 'available_days', label_th: 'วันให้บริการ', label_en: 'Available Days', importance: 'optional', type: 'text', placeholder_th: 'เช่น จันทร์-ศุกร์' },
                { key: 'available_hours', label_th: 'เวลาให้บริการ', label_en: 'Available Hours', importance: 'optional', type: 'text', placeholder_th: 'เช่น 09:00-18:00' },
            ]
        },
    ],
    targetAudience: {
        th: ['เจ้าของบ้าน', 'สำนักงาน', 'ร้านค้า', 'คอนโด'],
        en: ['Homeowners', 'Offices', 'Shops', 'Condos']
    }
}

// ============================================
// SPORTS TEMPLATE (ID: 12)
// Sports & Outdoor Equipment
// ============================================
const SPORTS_TEMPLATE: CategoryTemplate = {
    categoryId: 12,
    categoryName: 'Sports & Travel',
    emoji: '⚽',
    sections: [
        {
            id: 'equipment_info',
            emoji: '🏃',
            title_th: 'ข้อมูลอุปกรณ์',
            title_en: 'Equipment Info',
            fields: [
                { key: 'brand', label_th: 'ยี่ห้อ', label_en: 'Brand', importance: 'required', type: 'text', extractFromTitle: true, aiDetectable: true },
                { key: 'model', label_th: 'รุ่น', label_en: 'Model', importance: 'recommended', type: 'text', extractFromTitle: true },
                {
                    key: 'sport_type', label_th: 'ประเภทกีฬา', label_en: 'Sport Type', importance: 'required', type: 'select',
                    options: [
                        { value: 'cycling', label_th: '🚴 จักรยาน', label_en: '🚴 Cycling' },
                        { value: 'fitness', label_th: '💪 ฟิตเนส', label_en: '💪 Fitness' },
                        { value: 'running', label_th: '🏃 วิ่ง', label_en: '🏃 Running' },
                        { value: 'golf', label_th: '⛳ กอล์ฟ', label_en: '⛳ Golf' },
                        { value: 'swimming', label_th: '🏊 ว่ายน้ำ', label_en: '🏊 Swimming' },
                        { value: 'camping', label_th: '🏕️ แคมป์ปิ้ง', label_en: '🏕️ Camping' },
                        { value: 'football', label_th: '⚽ ฟุตบอล', label_en: '⚽ Football' },
                        { value: 'badminton', label_th: '🏸 แบดมินตัน', label_en: '🏸 Badminton' },
                        { value: 'other', label_th: '🎯 อื่นๆ', label_en: '🎯 Other' },
                    ]
                },
            ]
        },
        {
            id: 'specifications',
            emoji: '📏',
            title_th: 'ขนาดและน้ำหนัก',
            title_en: 'Size & Weight',
            fields: [
                { key: 'size', label_th: 'ขนาด/Size', label_en: 'Size', importance: 'recommended', type: 'text', placeholder_th: 'เช่น S/M/L หรือ 54cm' },
                { key: 'weight', label_th: 'น้ำหนัก (กก.)', label_en: 'Weight (kg)', importance: 'optional', type: 'text' },
                { key: 'dimensions', label_th: 'ขนาด กxยxส (ซม.)', label_en: 'Dimensions (cm)', importance: 'optional', type: 'text' },
            ]
        },
        {
            id: 'skill_level',
            emoji: '🎯',
            title_th: 'ระดับผู้ใช้',
            title_en: 'Skill Level',
            fields: [
                {
                    key: 'skill_level', label_th: 'เหมาะสำหรับ', label_en: 'Suitable For', importance: 'recommended', type: 'select',
                    options: [
                        { value: 'beginner', label_th: '🌱 มือใหม่/ผู้เริ่มต้น', label_en: '🌱 Beginner' },
                        { value: 'intermediate', label_th: '⭐ ระดับกลาง', label_en: '⭐ Intermediate' },
                        { value: 'advanced', label_th: '🏆 ระดับสูง/นักกีฬา', label_en: '🏆 Advanced/Athlete' },
                        { value: 'all', label_th: '✅ ทุกระดับ', label_en: '✅ All Levels' },
                    ]
                },
                {
                    key: 'gender', label_th: 'สำหรับ', label_en: 'For', importance: 'optional', type: 'select',
                    options: [
                        { value: 'unisex', label_th: '👥 Unisex', label_en: '👥 Unisex' },
                        { value: 'men', label_th: '👨 ผู้ชาย', label_en: '👨 Men' },
                        { value: 'women', label_th: '👩 ผู้หญิง', label_en: '👩 Women' },
                        { value: 'kids', label_th: '👶 เด็ก', label_en: '👶 Kids' },
                    ]
                },
            ]
        },
        {
            id: 'condition',
            emoji: '✅',
            title_th: 'สภาพสินค้า',
            title_en: 'Condition',
            fields: [
                { key: 'usage', label_th: 'จำนวนครั้งที่ใช้ (โดยประมาณ)', label_en: 'Times Used (approx.)', importance: 'optional', type: 'text' },
                { key: 'defects', label_th: 'ตำหนิ (ถ้ามี)', label_en: 'Defects (if any)', importance: 'optional', type: 'text' },
            ]
        },
    ],
    targetAudience: {
        th: ['นักกีฬา', 'คนรักสุขภาพ', 'นักท่องเที่ยว', 'ครอบครัว'],
        en: ['Athletes', 'Fitness Lovers', 'Travelers', 'Families']
    }
}

// ============================================
// BOOKS TEMPLATE (ID: 16)
// Books & Education
// ============================================
const BOOKS_TEMPLATE: CategoryTemplate = {
    categoryId: 16,
    categoryName: 'Books & Education',
    emoji: '📚',
    sections: [
        {
            id: 'book_info',
            emoji: '📖',
            title_th: 'ข้อมูลหนังสือ',
            title_en: 'Book Information',
            fields: [
                { key: 'title', label_th: 'ชื่อหนังสือ', label_en: 'Book Title', importance: 'required', type: 'text', extractFromTitle: true },
                { key: 'author', label_th: 'ผู้แต่ง/นักเขียน', label_en: 'Author', importance: 'required', type: 'text' },
                { key: 'publisher', label_th: 'สำนักพิมพ์', label_en: 'Publisher', importance: 'recommended', type: 'text' },
                { key: 'isbn', label_th: 'ISBN', label_en: 'ISBN', importance: 'optional', type: 'text' },
            ]
        },
        {
            id: 'edition',
            emoji: '🔢',
            title_th: 'ข้อมูลการพิมพ์',
            title_en: 'Edition Info',
            fields: [
                { key: 'edition', label_th: 'ครั้งที่พิมพ์', label_en: 'Edition', importance: 'optional', type: 'text' },
                { key: 'year', label_th: 'ปีที่พิมพ์', label_en: 'Year Published', importance: 'optional', type: 'text' },
                { key: 'pages', label_th: 'จำนวนหน้า', label_en: 'Number of Pages', importance: 'optional', type: 'text' },
                {
                    key: 'language', label_th: 'ภาษา', label_en: 'Language', importance: 'recommended', type: 'select',
                    options: [
                        { value: 'thai', label_th: '🇹🇭 ภาษาไทย', label_en: '🇹🇭 Thai' },
                        { value: 'english', label_th: '🇬🇧 ภาษาอังกฤษ', label_en: '🇬🇧 English' },
                        { value: 'japanese', label_th: '🇯🇵 ภาษาญี่ปุ่น', label_en: '🇯🇵 Japanese' },
                        { value: 'chinese', label_th: '🇨🇳 ภาษาจีน', label_en: '🇨🇳 Chinese' },
                        { value: 'other', label_th: '🌐 อื่นๆ', label_en: '🌐 Other' },
                    ]
                },
            ]
        },
        {
            id: 'category',
            emoji: '📂',
            title_th: 'หมวดหมู่หนังสือ',
            title_en: 'Book Category',
            fields: [
                {
                    key: 'book_category', label_th: 'ประเภทหนังสือ', label_en: 'Book Type', importance: 'recommended', type: 'select',
                    options: [
                        { value: 'novel', label_th: '📕 นิยาย', label_en: '📕 Novel' },
                        { value: 'manga', label_th: '📖 การ์ตูน/มังงะ', label_en: '📖 Manga/Comics' },
                        { value: 'textbook', label_th: '📘 หนังสือเรียน', label_en: '📘 Textbook' },
                        { value: 'self_help', label_th: '💡 พัฒนาตนเอง', label_en: '💡 Self-Help' },
                        { value: 'business', label_th: '💼 ธุรกิจ/การลงทุน', label_en: '💼 Business' },
                        { value: 'children', label_th: '👶 หนังสือเด็ก', label_en: '👶 Children\'s Book' },
                        { value: 'cooking', label_th: '🍳 อาหาร/ทำอาหาร', label_en: '🍳 Cooking' },
                        { value: 'travel', label_th: '✈️ ท่องเที่ยว', label_en: '✈️ Travel' },
                        { value: 'magazine', label_th: '📰 นิตยสาร', label_en: '📰 Magazine' },
                        { value: 'other', label_th: '📦 อื่นๆ', label_en: '📦 Other' },
                    ]
                },
            ]
        },
        {
            id: 'condition',
            emoji: '✅',
            title_th: 'สภาพหนังสือ',
            title_en: 'Book Condition',
            fields: [
                {
                    key: 'book_condition', label_th: 'สภาพโดยรวม', label_en: 'Overall Condition', importance: 'required', type: 'select',
                    options: [
                        { value: 'new_sealed', label_th: '📦 ใหม่ซีลไม่เคยแกะ', label_en: '📦 New Sealed' },
                        { value: 'new', label_th: '✨ ใหม่ไม่มีตำหนิ', label_en: '✨ Like New' },
                        { value: 'good', label_th: '👍 สภาพดี', label_en: '👍 Good' },
                        { value: 'fair', label_th: '📖 มีรอยการใช้งาน', label_en: '📖 Fair - Some Wear' },
                        { value: 'worn', label_th: '⚠️ เก่า/มีรอยขีดเขียน', label_en: '⚠️ Worn/Marked' },
                    ]
                },
                { key: 'defects', label_th: 'ตำหนิ (ถ้ามี)', label_en: 'Defects (if any)', importance: 'optional', type: 'text', placeholder_th: 'เช่น ปกมีรอย, หน้าเหลือง' },
            ]
        },
    ],
    targetAudience: {
        th: ['นักอ่าน', 'นักเรียน/นักศึกษา', 'นักสะสม', 'ผู้ปกครอง'],
        en: ['Readers', 'Students', 'Collectors', 'Parents']
    }
}

// ============================================
// CAR TEMPLATE (Subcategory 101)
// Used Cars - Thai Vehicle Market
// ENHANCED VERSION with comprehensive fields
// ============================================
const CAR_TEMPLATE: CategoryTemplate = {
    categoryId: 1,
    categoryName: 'Used Cars',
    emoji: '🚗',
    sections: [
        {
            id: 'car_info',
            emoji: '🚙',
            title_th: 'ข้อมูลรถ',
            title_en: 'Vehicle Information',
            fields: [
                { key: 'brand', label_th: 'ยี่ห้อ', label_en: 'Brand', importance: 'required', type: 'text', extractFromTitle: true, aiDetectable: true },
                { key: 'model', label_th: 'รุ่น', label_en: 'Model', importance: 'required', type: 'text', extractFromTitle: true, aiDetectable: true },
                { key: 'sub_model', label_th: 'รุ่นย่อย/แพ็คเกจ', label_en: 'Sub-model/Package', importance: 'recommended', type: 'text', placeholder_th: 'เช่น 1.8 EL, Turbo RS, Limited' },
                {
                    key: 'body_type', label_th: 'ประเภทตัวถัง', label_en: 'Body Type', importance: 'required', type: 'select', aiDetectable: true,
                    options: [
                        { value: 'sedan', label_th: '🚗 เก๋ง (Sedan)', label_en: '🚗 Sedan' },
                        { value: 'suv', label_th: '🚙 SUV / PPV', label_en: '🚙 SUV / PPV' },
                        { value: 'pickup', label_th: '🛻 กระบะ (Pickup)', label_en: '🛻 Pickup Truck' },
                        { value: 'hatchback', label_th: '🚘 5 ประตู (Hatchback)', label_en: '🚘 Hatchback' },
                        { value: 'van', label_th: '🚐 รถตู้ (Van)', label_en: '🚐 Van' },
                        { value: 'coupe', label_th: '🏎️ คูเป้ (Coupe)', label_en: '🏎️ Coupe' },
                        { value: 'convertible', label_th: '🚗 เปิดประทุน', label_en: '🚗 Convertible' },
                        { value: 'wagon', label_th: '🚙 แวกอน (Wagon)', label_en: '🚙 Wagon' },
                    ]
                },
                {
                    key: 'year', label_th: 'ปีรถ', label_en: 'Year', importance: 'required', type: 'select', extractFromTitle: true,
                    options: [
                        // Generate years from 2568 (2025) down to 2540 (1997)
                        { value: '2568', label_th: '2568 (2025)', label_en: '2025' },
                        { value: '2567', label_th: '2567 (2024)', label_en: '2024' },
                        { value: '2566', label_th: '2566 (2023)', label_en: '2023' },
                        { value: '2565', label_th: '2565 (2022)', label_en: '2022' },
                        { value: '2564', label_th: '2564 (2021)', label_en: '2021' },
                        { value: '2563', label_th: '2563 (2020)', label_en: '2020' },
                        { value: '2562', label_th: '2562 (2019)', label_en: '2019' },
                        { value: '2561', label_th: '2561 (2018)', label_en: '2018' },
                        { value: '2560', label_th: '2560 (2017)', label_en: '2017' },
                        { value: '2559', label_th: '2559 (2016)', label_en: '2016' },
                        { value: '2558', label_th: '2558 (2015)', label_en: '2015' },
                        { value: '2557', label_th: '2557 (2014)', label_en: '2014' },
                        { value: '2556', label_th: '2556 (2013)', label_en: '2013' },
                        { value: '2555', label_th: '2555 (2012)', label_en: '2012' },
                        { value: '2554', label_th: '2554 (2011)', label_en: '2011' },
                        { value: '2553', label_th: '2553 (2010)', label_en: '2010' },
                        { value: '2552', label_th: '2552 (2009)', label_en: '2009' },
                        { value: '2551', label_th: '2551 (2008)', label_en: '2008' },
                        { value: '2550', label_th: '2550 (2007)', label_en: '2007' },
                        { value: '2549', label_th: '2549 (2006)', label_en: '2006' },
                        { value: '2548', label_th: '2548 (2005)', label_en: '2005' },
                        { value: '2547', label_th: '2547 (2004)', label_en: '2004' },
                        { value: '2546', label_th: '2546 (2003)', label_en: '2003' },
                        { value: '2545', label_th: '2545 (2002)', label_en: '2002' },
                        { value: '2544', label_th: '2544 (2001)', label_en: '2001' },
                        { value: '2543', label_th: '2543 (2000)', label_en: '2000' },
                        { value: 'older', label_th: 'ก่อน 2543 (ก่อน 2000)', label_en: 'Before 2000' },
                    ]
                },
                {
                    key: 'color', label_th: 'สี', label_en: 'Color', importance: 'required', type: 'select', aiDetectable: true,
                    options: [
                        { value: 'white', label_th: '⚪ ขาว', label_en: '⚪ White' },
                        { value: 'white_pearl', label_th: '🤍 ขาวมุก', label_en: '🤍 Pearl White' },
                        { value: 'black', label_th: '⬛ ดำ', label_en: '⬛ Black' },
                        { value: 'silver', label_th: '🩶 เงิน', label_en: '🩶 Silver' },
                        { value: 'gray', label_th: '⬜ เทา', label_en: '⬜ Gray' },
                        { value: 'red', label_th: '🔴 แดง', label_en: '🔴 Red' },
                        { value: 'blue', label_th: '🔵 น้ำเงิน', label_en: '🔵 Blue' },
                        { value: 'brown', label_th: '🟤 น้ำตาล', label_en: '🟤 Brown' },
                        { value: 'gold', label_th: '🟡 ทอง/แชมเปญ', label_en: '🟡 Gold/Champagne' },
                        { value: 'green', label_th: '🟢 เขียว', label_en: '🟢 Green' },
                        { value: 'orange', label_th: '🟠 ส้ม', label_en: '🟠 Orange' },
                        { value: 'other', label_th: '🎨 อื่นๆ', label_en: '🎨 Other' },
                    ]
                },
            ]
        },
        {
            id: 'mileage_usage',
            emoji: '📊',
            title_th: 'ระยะทางและการใช้งาน',
            title_en: 'Mileage & Usage',
            fields: [
                { key: 'mileage', label_th: 'ระยะทาง (กม.)', label_en: 'Mileage (km)', importance: 'required', type: 'text', placeholder_th: 'เช่น 50000' },
                {
                    key: 'owners', label_th: 'เจ้าของกี่มือ', label_en: 'Number of Owners', importance: 'required', type: 'select',
                    options: [
                        { value: '1', label_th: '👤 มือเดียว (เจ้าของแรก)', label_en: '👤 First Owner' },
                        { value: '2', label_th: '👥 มือสอง', label_en: '👥 Second Owner' },
                        { value: '3+', label_th: '👥 มือสามขึ้นไป', label_en: '👥 Third+ Owner' },
                    ]
                },
                {
                    key: 'usage_type', label_th: 'ลักษณะการใช้งาน', label_en: 'Usage Type', importance: 'recommended', type: 'select',
                    options: [
                        { value: 'personal', label_th: '🏠 ใช้งานส่วนตัว', label_en: '🏠 Personal Use' },
                        { value: 'company', label_th: '🏢 รถบริษัท', label_en: '🏢 Company Car' },
                        { value: 'taxi', label_th: '🚕 รถแท็กซี่', label_en: '🚕 Taxi' },
                        { value: 'rental', label_th: '🚗 รถเช่า', label_en: '🚗 Rental Car' },
                    ]
                },
            ]
        },
        {
            id: 'specs',
            emoji: '⚙️',
            title_th: 'สเปครถ',
            title_en: 'Specifications',
            fields: [
                {
                    key: 'fuel_type', label_th: 'เชื้อเพลิง', label_en: 'Fuel Type', importance: 'required', type: 'select',
                    options: [
                        { value: 'petrol', label_th: '⛽ เบนซิน', label_en: '⛽ Petrol' },
                        { value: 'diesel', label_th: '🛢️ ดีเซล', label_en: '🛢️ Diesel' },
                        { value: 'hybrid', label_th: '🔋 ไฮบริด', label_en: '🔋 Hybrid' },
                        { value: 'phev', label_th: '🔌 Plug-in Hybrid', label_en: '🔌 Plug-in Hybrid' },
                        { value: 'ev', label_th: '⚡ ไฟฟ้า (EV)', label_en: '⚡ Electric (EV)' },
                        { value: 'lpg', label_th: '🔵 แก๊ส LPG', label_en: '🔵 LPG' },
                        { value: 'cng', label_th: '🟢 แก๊ส NGV/CNG', label_en: '🟢 NGV/CNG' },
                    ]
                },
                {
                    key: 'transmission', label_th: 'เกียร์', label_en: 'Transmission', importance: 'required', type: 'select',
                    options: [
                        { value: 'auto', label_th: '🅰️ ออโต้', label_en: '🅰️ Automatic' },
                        { value: 'manual', label_th: '🅼️ ธรรมดา', label_en: '🅼️ Manual' },
                        { value: 'cvt', label_th: '🔄 CVT', label_en: '🔄 CVT' },
                        { value: 'dct', label_th: '⚡ DCT/เกียร์คู่', label_en: '⚡ DCT/Dual Clutch' },
                    ]
                },
                {
                    key: 'engine_cc', label_th: 'ขนาดเครื่อง', label_en: 'Engine Size', importance: 'recommended', type: 'select',
                    options: [
                        { value: '660', label_th: '660cc (Kei Car)', label_en: '660cc (Kei Car)' },
                        { value: '1000', label_th: '1.0 ลิตร (1000cc)', label_en: '1.0L (1000cc)' },
                        { value: '1200', label_th: '1.2 ลิตร (1200cc)', label_en: '1.2L (1200cc)' },
                        { value: '1500', label_th: '1.5 ลิตร (1500cc)', label_en: '1.5L (1500cc)' },
                        { value: '1600', label_th: '1.6 ลิตร (1600cc)', label_en: '1.6L (1600cc)' },
                        { value: '1800', label_th: '1.8 ลิตร (1800cc)', label_en: '1.8L (1800cc)' },
                        { value: '2000', label_th: '2.0 ลิตร (2000cc)', label_en: '2.0L (2000cc)' },
                        { value: '2400', label_th: '2.4 ลิตร (2400cc)', label_en: '2.4L (2400cc)' },
                        { value: '2500', label_th: '2.5 ลิตร (2500cc)', label_en: '2.5L (2500cc)' },
                        { value: '2800', label_th: '2.8 ลิตร (2800cc)', label_en: '2.8L (2800cc)' },
                        { value: '3000', label_th: '3.0 ลิตร (3000cc)', label_en: '3.0L (3000cc)' },
                        { value: '3500', label_th: '3.5 ลิตร (3500cc)', label_en: '3.5L (3500cc)' },
                        { value: '4000+', label_th: '4.0 ลิตรขึ้นไป', label_en: '4.0L+' },
                        { value: 'ev', label_th: '⚡ ไฟฟ้า (ไม่มีเครื่องยนต์)', label_en: '⚡ Electric (No Engine)' },
                    ]
                },
                {
                    key: 'drive_type', label_th: 'ระบบขับเคลื่อน', label_en: 'Drive Type', importance: 'recommended', type: 'select',
                    options: [
                        { value: 'fwd', label_th: '🔘 ขับหน้า (FWD)', label_en: '🔘 Front-Wheel Drive' },
                        { value: 'rwd', label_th: '🔘 ขับหลัง (RWD)', label_en: '🔘 Rear-Wheel Drive' },
                        { value: '4wd', label_th: '🔰 ขับ 4 ล้อ (4WD)', label_en: '🔰 4-Wheel Drive' },
                        { value: 'awd', label_th: '🔰 ขับ 4 ล้อตลอดเวลา (AWD)', label_en: '🔰 All-Wheel Drive' },
                    ]
                },
            ]
        },
        {
            id: 'condition_history',
            emoji: '🔧',
            title_th: 'สภาพและประวัติ',
            title_en: 'Condition & History',
            fields: [
                {
                    key: 'accident_history', label_th: 'ประวัติอุบัติเหตุ', label_en: 'Accident History', importance: 'required', type: 'select',
                    options: [
                        { value: 'none', label_th: '✅ ไม่เคยชน', label_en: '✅ No Accidents' },
                        { value: 'minor', label_th: '⚠️ ชนเล็กน้อย (ซ่อมแล้ว)', label_en: '⚠️ Minor (Repaired)' },
                        { value: 'major', label_th: '🔴 ชนหนัก/เคยซ่อมใหญ่', label_en: '🔴 Major Damage' },
                    ]
                },
                {
                    key: 'flood_history', label_th: 'ประวัติน้ำท่วม', label_en: 'Flood History', importance: 'required', type: 'select',
                    options: [
                        { value: 'none', label_th: '✅ ไม่เคยจมน้ำ', label_en: '✅ Never Flooded' },
                        { value: 'partial', label_th: '💧 น้ำท่วมบางส่วน', label_en: '💧 Partially Flooded' },
                        { value: 'full', label_th: '🌊 น้ำท่วมทั้งคัน', label_en: '🌊 Fully Flooded' },
                    ]
                },
                {
                    key: 'tire_condition', label_th: 'สภาพยาง', label_en: 'Tire Condition', importance: 'recommended', type: 'select',
                    options: [
                        { value: 'new', label_th: '🆕 ยางใหม่', label_en: '🆕 New Tires' },
                        { value: 'good', label_th: '✅ ดอกยางดี (>50%)', label_en: '✅ Good (>50%)' },
                        { value: 'fair', label_th: '⚠️ พอใช้ (30-50%)', label_en: '⚠️ Fair (30-50%)' },
                        { value: 'need_change', label_th: '🔴 ต้องเปลี่ยน (<30%)', label_en: '🔴 Need Replacement (<30%)' },
                    ]
                },
                {
                    key: 'interior_condition', label_th: 'สภาพภายใน', label_en: 'Interior Condition', importance: 'recommended', type: 'select',
                    options: [
                        { value: 'like_new', label_th: '✨ เหมือนใหม่', label_en: '✨ Like New' },
                        { value: 'good', label_th: '✅ ดี ไม่มีรอยฉีกขาด', label_en: '✅ Good, No Tears' },
                        { value: 'fair', label_th: '⚠️ มีรอยเปื้อน/สึกหรอบ้าง', label_en: '⚠️ Some Stains/Wear' },
                        { value: 'worn', label_th: '🔴 สึกหรอมาก', label_en: '🔴 Heavily Worn' },
                    ]
                },
                { key: 'service_history', label_th: 'ประวัติศูนย์บริการ', label_en: 'Service History', importance: 'optional', type: 'text', placeholder_th: 'เช่น เข้าศูนย์ตลอด, มีสมุดบันทึก' },
            ]
        },
        {
            id: 'registration',
            emoji: '📋',
            title_th: 'ทะเบียนและเอกสาร',
            title_en: 'Registration & Documents',
            fields: [
                {
                    key: 'registration', label_th: 'จังหวัดจดทะเบียน', label_en: 'Registration Province', importance: 'recommended', type: 'select',
                    options: [
                        // กรุงเทพฯ และปริมณฑล
                        { value: 'กรุงเทพมหานคร', label_th: 'กรุงเทพมหานคร', label_en: 'Bangkok' },
                        { value: 'นนทบุรี', label_th: 'นนทบุรี', label_en: 'Nonthaburi' },
                        { value: 'ปทุมธานี', label_th: 'ปทุมธานี', label_en: 'Pathum Thani' },
                        { value: 'สมุทรปราการ', label_th: 'สมุทรปราการ', label_en: 'Samut Prakan' },
                        { value: 'นครปฐม', label_th: 'นครปฐม', label_en: 'Nakhon Pathom' },
                        { value: 'สมุทรสาคร', label_th: 'สมุทรสาคร', label_en: 'Samut Sakhon' },
                        // ภาคอื่นๆ (simplified - top cities)
                        { value: 'เชียงใหม่', label_th: 'เชียงใหม่', label_en: 'Chiang Mai' },
                        { value: 'ชลบุรี', label_th: 'ชลบุรี', label_en: 'Chonburi' },
                        { value: 'ขอนแก่น', label_th: 'ขอนแก่น', label_en: 'Khon Kaen' },
                        { value: 'นครราชสีมา', label_th: 'นครราชสีมา', label_en: 'Nakhon Ratchasima' },
                        { value: 'ภูเก็ต', label_th: 'ภูเก็ต', label_en: 'Phuket' },
                        { value: 'สงขลา', label_th: 'สงขลา', label_en: 'Songkhla' },
                        { value: 'ระยอง', label_th: 'ระยอง', label_en: 'Rayong' },
                        { value: 'other', label_th: '🗺️ จังหวัดอื่นๆ', label_en: '🗺️ Other Provinces' },
                    ]
                },
                {
                    key: 'tax_status', label_th: 'ภาษี/พ.ร.บ.', label_en: 'Tax/Insurance Status', importance: 'required', type: 'select',
                    options: [
                        { value: 'valid', label_th: '✅ ยังไม่ขาด', label_en: '✅ Valid' },
                        { value: 'expiring_soon', label_th: '⏰ จะขาดใน 1-3 เดือน', label_en: '⏰ Expiring Soon' },
                        { value: 'expired', label_th: '⚠️ ขาดแล้ว', label_en: '⚠️ Expired' },
                    ]
                },
                {
                    key: 'book_status', label_th: 'สมุดทะเบียน', label_en: 'Registration Book', importance: 'required', type: 'select',
                    options: [
                        { value: 'original', label_th: '📘 เล่มเดิม (เขียว)', label_en: '📘 Original (Green)' },
                        { value: 'copy', label_th: '📕 เล่มแดง/สำเนา', label_en: '📕 Red Book/Copy' },
                        { value: 'lost', label_th: '❓ หาย/กำลังทำใหม่', label_en: '❓ Lost/Reissuing' },
                    ]
                },
                {
                    key: 'spare_keys', label_th: 'กุญแจสำรอง', label_en: 'Spare Keys', importance: 'recommended', type: 'select',
                    options: [
                        { value: '2_remote', label_th: '🔑 2 ดอก + รีโมท (ครบ)', label_en: '🔑 2 Keys + Remote (Complete)' },
                        { value: '2', label_th: '🔑 2 ดอก', label_en: '🔑 2 Keys' },
                        { value: '1', label_th: '🔑 ดอกเดียว', label_en: '🔑 1 Key Only' },
                    ]
                },
                {
                    key: 'insurance_type', label_th: 'ประกันภัยรถ', label_en: 'Car Insurance', importance: 'optional', type: 'select',
                    options: [
                        { value: 'class1', label_th: '🛡️ ประกันชั้น 1 (ยังเหลือ)', label_en: '🛡️ Class 1 (Active)' },
                        { value: 'class2', label_th: '🛡️ ประกันชั้น 2+', label_en: '🛡️ Class 2+' },
                        { value: 'class3', label_th: '🛡️ ประกันชั้น 3', label_en: '🛡️ Class 3' },
                        { value: 'expired', label_th: '❌ หมดประกัน', label_en: '❌ No Insurance' },
                    ]
                },
            ]
        },
        {
            id: 'extras_selling',
            emoji: '📦',
            title_th: 'อุปกรณ์เสริมและเหตุผลการขาย',
            title_en: 'Extras & Selling Info',
            fields: [
                {
                    key: 'included_items', label_th: 'อุปกรณ์/ของแถม', label_en: 'Included Items', importance: 'optional', type: 'multiselect',
                    options: [
                        { value: 'dashcam', label_th: '📹 กล้องหน้ารถ', label_en: '📹 Dashcam' },
                        { value: 'film', label_th: '🪟 ฟิล์มกรองแสง', label_en: '🪟 Window Film' },
                        { value: 'carplay', label_th: '📱 Apple CarPlay / Android Auto', label_en: '📱 CarPlay/Android Auto' },
                        { value: 'gps', label_th: '🗺️ GPS Navigator', label_en: '🗺️ GPS Navigator' },
                        { value: 'leather', label_th: '💺 หุ้มเบาะหนัง', label_en: '💺 Leather Seats' },
                        { value: 'sound_upgrade', label_th: '🔊 อัพเกรดเครื่องเสียง', label_en: '🔊 Sound System Upgrade' },
                        { value: 'roof_rack', label_th: '🧳 ราวหลังคา', label_en: '🧳 Roof Rack' },
                        { value: 'tow_bar', label_th: '🔗 ขอเกี่ยว', label_en: '🔗 Tow Bar' },
                    ]
                },
                {
                    key: 'selling_reason', label_th: 'เหตุผลที่ขาย', label_en: 'Reason for Selling', importance: 'optional', type: 'select',
                    options: [
                        { value: 'upgrade', label_th: '⬆️ เปลี่ยนรุ่นใหม่', label_en: '⬆️ Upgrading' },
                        { value: 'rarely_used', label_th: '🕐 ใช้น้อย/ไม่ค่อยได้ใช้', label_en: '🕐 Rarely Used' },
                        { value: 'need_money', label_th: '💰 ต้องการเงินก้อน', label_en: '💰 Need Money (Lump Sum)' },
                        { value: 'moving', label_th: '🏠 ย้ายบ้าน/ต่างประเทศ', label_en: '🏠 Moving/Relocating' },
                        { value: 'family_change', label_th: '👨‍👩‍👧 ครอบครัวเปลี่ยน (เปลี่ยนไซส์รถ)', label_en: '👨‍👩‍👧 Family Changes' },
                        { value: 'other', label_th: '📝 อื่นๆ', label_en: '📝 Other' },
                    ]
                },
                {
                    key: 'additional_description',
                    label_th: 'รายละเอียดเพิ่มเติม',
                    label_en: 'Additional Details',
                    importance: 'optional',
                    type: 'textarea',
                    placeholder_th: 'ใส่ข้อมูลเพิ่มเติมที่ต้องการบอกผู้ซื้อ เช่น ประวัติการดูแล, จุดเด่นของรถ, อะไหล่ที่เพิ่งเปลี่ยน, หมายเหตุอื่นๆ...'
                },
            ]
        },
        {
            id: 'meeting_location',
            emoji: '📍',
            title_th: 'สถานที่นัดดูรถ',
            title_en: 'Meeting Location',
            fields: [
                {
                    key: 'meeting_province', label_th: 'จังหวัด', label_en: 'Province', importance: 'required', type: 'select',
                    // Note: Options will be populated dynamically from AddressSelector thaiAddress service
                    options: [
                        { value: 'กรุงเทพมหานคร', label_th: 'กรุงเทพมหานคร', label_en: 'Bangkok' },
                        { value: 'นนทบุรี', label_th: 'นนทบุรี', label_en: 'Nonthaburi' },
                        { value: 'ปทุมธานี', label_th: 'ปทุมธานี', label_en: 'Pathum Thani' },
                        { value: 'สมุทรปราการ', label_th: 'สมุทรปราการ', label_en: 'Samut Prakan' },
                        { value: 'ชลบุรี', label_th: 'ชลบุรี', label_en: 'Chonburi' },
                        { value: 'ระยอง', label_th: 'ระยอง', label_en: 'Rayong' },
                        { value: 'เชียงใหม่', label_th: 'เชียงใหม่', label_en: 'Chiang Mai' },
                        { value: 'เชียงราย', label_th: 'เชียงราย', label_en: 'Chiang Rai' },
                        { value: 'ขอนแก่น', label_th: 'ขอนแก่น', label_en: 'Khon Kaen' },
                        { value: 'นครราชสีมา', label_th: 'นครราชสีมา', label_en: 'Nakhon Ratchasima' },
                        { value: 'อุดรธานี', label_th: 'อุดรธานี', label_en: 'Udon Thani' },
                        { value: 'ภูเก็ต', label_th: 'ภูเก็ต', label_en: 'Phuket' },
                        { value: 'สงขลา', label_th: 'สงขลา', label_en: 'Songkhla' },
                        { value: 'นครศรีธรรมราช', label_th: 'นครศรีธรรมราช', label_en: 'Nakhon Si Thammarat' },
                        { value: 'สุราษฎร์ธานี', label_th: 'สุราษฎร์ธานี', label_en: 'Surat Thani' },
                        { value: 'other', label_th: '📍 จังหวัดอื่นๆ (ระบุในรายละเอียด)', label_en: '📍 Other (specify in details)' },
                    ]
                },
                {
                    key: 'meeting_amphoe',
                    label_th: 'อำเภอ/เขต',
                    label_en: 'District',
                    importance: 'recommended',
                    type: 'text',
                    placeholder_th: 'เช่น บางขุนเทียน, บางรัก, เมือง',
                    placeholder_en: 'e.g. Bang Khunthian, Mueang'
                },
                {
                    key: 'meeting_landmark',
                    label_th: 'จุดนัดพบ/แลนด์มาร์ค',
                    label_en: 'Meeting Point/Landmark',
                    importance: 'recommended',
                    type: 'text',
                    placeholder_th: 'เช่น ห้างเซ็นทรัล, ปั๊มน้ำมัน PTT, สถานี BTS...',
                    placeholder_en: 'e.g. Central mall, PTT station, BTS station...'
                },
                {
                    key: 'meeting_preference', label_th: 'ช่วงเวลาที่สะดวก', label_en: 'Preferred Time', importance: 'optional', type: 'multiselect',
                    options: [
                        { value: 'weekday_morning', label_th: '🌅 จันทร์-ศุกร์ เช้า (9-12)', label_en: '🌅 Weekdays Morning' },
                        { value: 'weekday_afternoon', label_th: '☀️ จันทร์-ศุกร์ บ่าย (12-17)', label_en: '☀️ Weekdays Afternoon' },
                        { value: 'weekday_evening', label_th: '🌆 จันทร์-ศุกร์ เย็น (17-20)', label_en: '🌆 Weekdays Evening' },
                        { value: 'weekend_morning', label_th: '🌅 เสาร์-อาทิตย์ เช้า', label_en: '🌅 Weekend Morning' },
                        { value: 'weekend_afternoon', label_th: '☀️ เสาร์-อาทิตย์ บ่าย', label_en: '☀️ Weekend Afternoon' },
                        { value: 'anytime', label_th: '⏰ นัดได้ทุกวัน', label_en: '⏰ Anytime' },
                    ]
                },
                {
                    key: 'delivery_option', label_th: 'บริการส่งรถ', label_en: 'Delivery Service', importance: 'optional', type: 'select',
                    options: [
                        { value: 'pickup_only', label_th: '🏠 รับรถที่นัดเท่านั้น', label_en: '🏠 Pickup Only' },
                        { value: 'delivery_bkk', label_th: '🚗 ส่งในกทม./ปริมณฑล (มีค่าใช้จ่าย)', label_en: '🚗 Delivery in BKK (Extra charge)' },
                        { value: 'delivery_nationwide', label_th: '🚚 ส่งทั่วประเทศได้ (คุยราคา)', label_en: '🚚 Nationwide Delivery (Negotiable)' },
                    ]
                },
            ]
        },
        {
            id: 'payment_options',
            emoji: '💰',
            title_th: 'ตัวเลือกการชำระเงิน',
            title_en: 'Payment Options',
            fields: [
                {
                    key: 'negotiable', label_th: 'ต่อรองราคาได้?', label_en: 'Price Negotiable?', importance: 'recommended', type: 'select',
                    options: [
                        { value: 'yes', label_th: '✅ ต่อรองได้', label_en: '✅ Yes, Negotiable' },
                        { value: 'little', label_th: '↔️ ต่อได้นิดหน่อย', label_en: '↔️ Slightly Negotiable' },
                        { value: 'no', label_th: '❌ ราคาตายตัว', label_en: '❌ Fixed Price' },
                    ]
                },
                {
                    key: 'finance_available', label_th: 'ไฟแนนซ์', label_en: 'Financing', importance: 'recommended', type: 'select',
                    options: [
                        { value: 'cash_only', label_th: '💵 เงินสดเท่านั้น', label_en: '💵 Cash Only' },
                        { value: 'finance_ok', label_th: '🏦 จัดไฟแนนซ์ได้', label_en: '🏦 Financing Available' },
                        { value: 'takeover', label_th: '📑 รับช่วงผ่อนต่อได้', label_en: '📑 Takeover Financing OK' },
                    ]
                },
            ]
        },
    ],
    targetAudience: {
        th: ['คนหารถมือสอง', 'ครอบครัว', 'คนทำงาน', 'มือใหม่หัดขับ'],
        en: ['Used Car Buyers', 'Families', 'Commuters', 'New Drivers']
    }
}

// ============================================
// MOTORCYCLE TEMPLATE (Subcategory 102)
// Motorcycles - Thai Vehicle Market
// ============================================
const MOTORCYCLE_TEMPLATE: CategoryTemplate = {
    categoryId: 1,
    categoryName: 'Motorcycles',
    emoji: '🏍️',
    sections: [
        {
            id: 'bike_info',
            emoji: '🏍️',
            title_th: 'ข้อมูลรถ',
            title_en: 'Motorcycle Information',
            fields: [
                { key: 'brand', label_th: 'ยี่ห้อ', label_en: 'Brand', importance: 'required', type: 'text', extractFromTitle: true, aiDetectable: true },
                { key: 'model', label_th: 'รุ่น', label_en: 'Model', importance: 'required', type: 'text', extractFromTitle: true, aiDetectable: true },
                { key: 'year', label_th: 'ปี (พ.ศ./ค.ศ.)', label_en: 'Year', importance: 'required', type: 'text', extractFromTitle: true },
                { key: 'color', label_th: 'สี', label_en: 'Color', importance: 'required', type: 'text', aiDetectable: true },
            ]
        },
        {
            id: 'mileage_usage',
            emoji: '📊',
            title_th: 'ระยะทางและการใช้งาน',
            title_en: 'Mileage & Usage',
            fields: [
                { key: 'mileage', label_th: 'ระยะทาง (กม.)', label_en: 'Mileage (km)', importance: 'required', type: 'text' },
                {
                    key: 'owners', label_th: 'เจ้าของกี่มือ', label_en: 'Number of Owners', importance: 'required', type: 'select',
                    options: [
                        { value: '1', label_th: '👤 มือเดียว (เจ้าของแรก)', label_en: '👤 First Owner' },
                        { value: '2', label_th: '👥 มือสอง', label_en: '👥 Second Owner' },
                        { value: '3+', label_th: '👥 มือสามขึ้นไป', label_en: '👥 Third+ Owner' },
                    ]
                },
            ]
        },
        {
            id: 'registration',
            emoji: '📋',
            title_th: 'ทะเบียนและเอกสาร',
            title_en: 'Registration & Documents',
            fields: [
                {
                    key: 'registration_province', label_th: 'จังหวัดจดทะเบียน', label_en: 'Registration Province', importance: 'recommended', type: 'text',
                    placeholder_th: 'เช่น กรุงเทพฯ, เชียงใหม่'
                },
                {
                    key: 'tax_status', label_th: 'สถานะภาษี พ.ร.บ.', label_en: 'Tax/Insurance Status', importance: 'required', type: 'select',
                    options: [
                        { value: 'valid', label_th: '✅ ภาษี/พ.ร.บ. ยังไม่ขาด', label_en: '✅ Tax/Insurance Valid' },
                        { value: 'expiring_soon', label_th: '⏰ จะขาดใน 1-3 เดือน', label_en: '⏰ Expiring in 1-3 months' },
                        { value: 'expired', label_th: '⚠️ ขาดภาษี/พ.ร.บ.', label_en: '⚠️ Expired' },
                    ]
                },
                {
                    key: 'book_status', label_th: 'สมุดเล่มเดิม', label_en: 'Original Book', importance: 'required', type: 'select',
                    options: [
                        { value: 'original', label_th: '📘 เล่มเดิม', label_en: '📘 Original' },
                        { value: 'copy', label_th: '📝 เล่มแดง/สำเนา', label_en: '📝 Red Book/Copy' },
                        { value: 'lost', label_th: '❌ หาย/กำลังทำใหม่', label_en: '❌ Lost/Reissuing' },
                    ]
                },
                {
                    key: 'spare_keys', label_th: 'กุญแจสำรอง', label_en: 'Spare Keys', importance: 'recommended', type: 'select',
                    options: [
                        { value: '2', label_th: '🔑 มี 2 ดอก (ครบ)', label_en: '🔑 2 Keys (Complete)' },
                        { value: '1', label_th: '🔑 มีดอกเดียว', label_en: '🔑 1 Key Only' },
                        { value: 'remote', label_th: '📱 มีรีโมท', label_en: '📱 With Remote' },
                    ]
                },
                {
                    key: 'insurance_type', label_th: 'ประกันภัย', label_en: 'Insurance', importance: 'optional', type: 'select',
                    options: [
                        { value: 'class1', label_th: '🛡️ ประกันชั้น 1', label_en: '🛡️ Class 1 Insurance' },
                        { value: 'class2', label_th: '🛡️ ประกันชั้น 2', label_en: '🛡️ Class 2 Insurance' },
                        { value: 'class3', label_th: '🛡️ ประกันชั้น 3', label_en: '🛡️ Class 3 Insurance' },
                        { value: 'none', label_th: '❌ ไม่มีประกันภัย', label_en: '❌ No Insurance' },
                    ]
                },
            ]
        },
        {
            id: 'condition_history',
            emoji: '🔧',
            title_th: 'สภาพและประวัติ',
            title_en: 'Condition & History',
            fields: [
                {
                    key: 'accident_history', label_th: 'ประวัติอุบัติเหตุ', label_en: 'Accident History', importance: 'required', type: 'select',
                    options: [
                        { value: 'none', label_th: '✅ ไม่เคยมีอุบัติเหตุ', label_en: '✅ No Accidents' },
                        { value: 'minor', label_th: '⚠️ เคยล้มเบาๆ (ซ่อมแล้ว)', label_en: '⚠️ Minor Fall (Repaired)' },
                        { value: 'major', label_th: '🔴 เคยมีอุบัติเหตุหนัก', label_en: '🔴 Major Accident' },
                    ]
                },
                {
                    key: 'modifications', label_th: 'ของแต่ง', label_en: 'Modifications', importance: 'recommended', type: 'select',
                    options: [
                        { value: 'stock', label_th: '🏭 สต็อก (ไม่แต่ง)', label_en: '🏭 Stock (Original)' },
                        { value: 'minor_mods', label_th: '⚙️ แต่งเบาๆ (ท่อ/กระจก)', label_en: '⚙️ Minor Mods' },
                        { value: 'major_mods', label_th: '🔧 แต่งหนัก', label_en: '🔧 Major Mods' },
                        { value: 'racing', label_th: '🏁 แต่งซิ่ง', label_en: '🏁 Racing Mods' },
                    ]
                },
                { key: 'service_history', label_th: 'ประวัติศูนย์บริการ', label_en: 'Service History', importance: 'optional', type: 'text', placeholder_th: 'เช่น เข้าศูนย์ตลอด, เปลี่ยนถ่ายน้ำมันเครื่องทุก 1,000 กม.' },
            ]
        },
        {
            id: 'extras',
            emoji: '📦',
            title_th: 'อุปกรณ์และเหตุผล',
            title_en: 'Extras & Reason',
            fields: [
                {
                    key: 'included_items', label_th: 'อุปกรณ์ที่ให้', label_en: 'Included Items', importance: 'optional', type: 'multiselect',
                    options: [
                        { value: 'helmet', label_th: '🪖 หมวกกันน็อค', label_en: '🪖 Helmet' },
                        { value: 'gloves', label_th: '🧤 ถุงมือ', label_en: '🧤 Gloves' },
                        { value: 'cover', label_th: '🎪 ผ้าคลุมรถ', label_en: '🎪 Cover' },
                        { value: 'phone_holder', label_th: '📱 ที่จับโทรศัพท์', label_en: '📱 Phone Holder' },
                        { value: 'usb_charger', label_th: '🔌 ที่ชาร์จ USB', label_en: '🔌 USB Charger' },
                        { value: 'box', label_th: '📦 กล่องท้าย', label_en: '📦 Rear Box' },
                    ]
                },
                {
                    key: 'selling_reason', label_th: 'เหตุผลที่ขาย', label_en: 'Reason for Selling', importance: 'optional', type: 'select',
                    options: [
                        { value: 'upgrade', label_th: '⬆️ เปลี่ยนรุ่นใหม่', label_en: '⬆️ Upgrading' },
                        { value: 'rarely_used', label_th: '🕐 ใช้น้อย/ไม่ค่อยได้ใช้', label_en: '🕐 Rarely Used' },
                        { value: 'need_money', label_th: '💰 ต้องการเงิน', label_en: '💰 Need Money' },
                        { value: 'moving', label_th: '🏠 ย้ายบ้าน/ต่างประเทศ', label_en: '🏠 Moving' },
                        { value: 'health', label_th: '🏥 สุขภาพ/ไม่ขี่แล้ว', label_en: '🏥 Health Reasons' },
                    ]
                },
            ]
        },
    ],
    targetAudience: {
        th: ['คนหามอเตอร์ไซค์', 'วัยรุ่น', 'คนทำงาน', 'ไรเดอร์'],
        en: ['Motorcycle Buyers', 'Youth', 'Workers', 'Riders']
    }
}

// ============================================
// HOUSE TEMPLATE (Subcategory 201)
// Houses - Thai Property Market
// ============================================
const HOUSE_TEMPLATE: CategoryTemplate = {
    categoryId: 2,
    categoryName: 'Houses',
    emoji: '🏠',
    sections: [
        {
            id: 'property_info',
            emoji: '🏠',
            title_th: 'ข้อมูลบ้าน',
            title_en: 'Property Information',
            fields: [
                { key: 'project_name', label_th: 'ชื่อโครงการ/หมู่บ้าน', label_en: 'Project/Village Name', importance: 'recommended', type: 'text', extractFromTitle: true },
                {
                    key: 'house_type', label_th: 'ประเภทบ้าน', label_en: 'House Type', importance: 'required', type: 'select',
                    options: [
                        { value: 'detached', label_th: '🏠 บ้านเดี่ยว', label_en: '🏠 Detached House' },
                        { value: 'twin', label_th: '🏘️ บ้านแฝด', label_en: '🏘️ Twin House' },
                        { value: 'village', label_th: '🏡 บ้านในหมู่บ้านจัดสรร', label_en: '🏡 Village House' },
                    ]
                },
            ]
        },
        {
            id: 'size',
            emoji: '📐',
            title_th: 'ขนาดพื้นที่',
            title_en: 'Area Size',
            fields: [
                { key: 'land_size', label_th: 'เนื้อที่ดิน (ตร.ว.)', label_en: 'Land Size (sq.wah)', importance: 'required', type: 'text' },
                { key: 'usable_area', label_th: 'พื้นที่ใช้สอย (ตร.ม.)', label_en: 'Usable Area (sq.m.)', importance: 'required', type: 'text' },
                {
                    key: 'floors', label_th: 'จำนวนชั้น', label_en: 'Floors', importance: 'required', type: 'select',
                    options: [
                        { value: '1', label_th: '1 ชั้น', label_en: '1 Floor' },
                        { value: '2', label_th: '2 ชั้น', label_en: '2 Floors' },
                        { value: '3', label_th: '3 ชั้น', label_en: '3 Floors' },
                        { value: '4+', label_th: '4 ชั้นขึ้นไป', label_en: '4+ Floors' },
                    ]
                },
            ]
        },
        {
            id: 'rooms',
            emoji: '🛏️',
            title_th: 'ห้อง',
            title_en: 'Rooms',
            fields: [
                {
                    key: 'bedrooms', label_th: 'ห้องนอน', label_en: 'Bedrooms', importance: 'required', type: 'select',
                    options: [
                        { value: '1', label_th: '1 ห้อง', label_en: '1 Bedroom' },
                        { value: '2', label_th: '2 ห้อง', label_en: '2 Bedrooms' },
                        { value: '3', label_th: '3 ห้อง', label_en: '3 Bedrooms' },
                        { value: '4', label_th: '4 ห้อง', label_en: '4 Bedrooms' },
                        { value: '5+', label_th: '5 ห้องขึ้นไป', label_en: '5+ Bedrooms' },
                    ]
                },
                {
                    key: 'bathrooms', label_th: 'ห้องน้ำ', label_en: 'Bathrooms', importance: 'required', type: 'select',
                    options: [
                        { value: '1', label_th: '1 ห้อง', label_en: '1 Bathroom' },
                        { value: '2', label_th: '2 ห้อง', label_en: '2 Bathrooms' },
                        { value: '3', label_th: '3 ห้อง', label_en: '3 Bathrooms' },
                        { value: '4+', label_th: '4 ห้องขึ้นไป', label_en: '4+ Bathrooms' },
                    ]
                },
                {
                    key: 'parking', label_th: 'ที่จอดรถ', label_en: 'Parking', importance: 'recommended', type: 'select',
                    options: [
                        { value: '0', label_th: '❌ ไม่มี', label_en: '❌ None' },
                        { value: '1', label_th: '🚗 1 คัน', label_en: '🚗 1 Car' },
                        { value: '2', label_th: '🚗 2 คัน', label_en: '🚗 2 Cars' },
                        { value: '3+', label_th: '🚗 3 คันขึ้นไป', label_en: '🚗 3+ Cars' },
                    ]
                },
            ]
        },
        {
            id: 'documents',
            emoji: '📋',
            title_th: 'เอกสารสิทธิ์',
            title_en: 'Documents',
            fields: [
                {
                    key: 'land_title', label_th: 'ประเภทโฉนด', label_en: 'Land Title', importance: 'required', type: 'select',
                    options: [
                        { value: 'ns4j', label_th: '📘 โฉนด นส.4 จ. (ครุฑแดง)', label_en: '📘 Chanote NS.4 J.' },
                        { value: 'ns4', label_th: '📗 โฉนด นส.4 (ครุฑเขียว)', label_en: '📗 NS.4' },
                        { value: 'ns3g', label_th: '📒 นส.3 ก.', label_en: '📒 NS.3 Kor' },
                        { value: 'ns3', label_th: '📙 นส.3', label_en: '📙 NS.3' },
                        { value: 'sor_kor', label_th: '📄 ส.ค.1', label_en: '📄 Sor Kor 1' },
                    ]
                },
            ]
        },
        {
            id: 'condition',
            emoji: '🔧',
            title_th: 'สภาพบ้าน',
            title_en: 'Condition',
            fields: [
                {
                    key: 'renovation', label_th: 'การปรับปรุง', label_en: 'Renovation', importance: 'recommended', type: 'select',
                    options: [
                        { value: 'new', label_th: '✨ ใหม่/ไม่เคยอยู่', label_en: '✨ Brand New' },
                        { value: 'renovated', label_th: '🔧 รีโนเวทใหม่', label_en: '🔧 Newly Renovated' },
                        { value: 'good', label_th: '✅ สภาพดี', label_en: '✅ Good Condition' },
                        { value: 'needs_repair', label_th: '🔨 ต้องซ่อมแซม', label_en: '🔨 Needs Repair' },
                    ]
                },
                { key: 'age', label_th: 'อายุบ้าน (ปี)', label_en: 'House Age (years)', importance: 'recommended', type: 'text' },
            ]
        },
    ],
    targetAudience: {
        th: ['ครอบครัว', 'คนมีลูก', 'นักลงทุน', 'คนต้องการความเป็นส่วนตัว'],
        en: ['Families', 'Parents', 'Investors', 'Privacy Seekers']
    }
}

// ============================================
// LAND TEMPLATE (Subcategory 203)
// Land - Thai Property Market
// ============================================
const LAND_TEMPLATE: CategoryTemplate = {
    categoryId: 2,
    categoryName: 'Land',
    emoji: '🏞️',
    sections: [
        {
            id: 'land_info',
            emoji: '🏞️',
            title_th: 'ข้อมูลที่ดิน',
            title_en: 'Land Information',
            fields: [
                { key: 'location', label_th: 'ตำแหน่งที่ตั้ง', label_en: 'Location', importance: 'required', type: 'text', placeholder_th: 'เช่น ถนนพหลโยธิน, ใกล้ BTS' },
                {
                    key: 'land_title', label_th: 'ประเภทเอกสารสิทธิ์', label_en: 'Land Title', importance: 'required', type: 'select',
                    options: [
                        { value: 'ns4j', label_th: '📘 โฉนด นส.4 จ. (ครุฑแดง)', label_en: '📘 Chanote NS.4 J.' },
                        { value: 'ns4', label_th: '📗 โฉนด นส.4', label_en: '📗 NS.4' },
                        { value: 'ns3g', label_th: '📒 นส.3 ก.', label_en: '📒 NS.3 Kor' },
                        { value: 'ns3', label_th: '📙 นส.3', label_en: '📙 NS.3' },
                        { value: 'sor_kor', label_th: '📄 ส.ค.1', label_en: '📄 Sor Kor 1' },
                    ]
                },
            ]
        },
        {
            id: 'size',
            emoji: '📐',
            title_th: 'ขนาดพื้นที่',
            title_en: 'Land Size',
            fields: [
                { key: 'rai', label_th: 'ไร่', label_en: 'Rai', importance: 'required', type: 'text' },
                { key: 'ngan', label_th: 'งาน', label_en: 'Ngan', importance: 'required', type: 'text' },
                { key: 'wah', label_th: 'ตารางวา', label_en: 'Square Wah', importance: 'required', type: 'text' },
            ]
        },
        {
            id: 'zoning',
            emoji: '🗺️',
            title_th: 'ผังเมือง',
            title_en: 'Zoning',
            fields: [
                {
                    key: 'zone', label_th: 'สีผังเมือง', label_en: 'Zone', importance: 'required', type: 'select',
                    options: [
                        { value: 'residential', label_th: '🟡 ที่อยู่อาศัยหนาแน่นน้อย', label_en: '🟡 Low Density Residential' },
                        { value: 'residential_medium', label_th: '🟠 ที่อยู่อาศัยหนาแน่นปานกลาง', label_en: '🟠 Medium Density Residential' },
                        { value: 'commercial', label_th: '🔴 พาณิชยกรรม', label_en: '🔴 Commercial' },
                        { value: 'industrial', label_th: '🟣 อุตสาหกรรม', label_en: '🟣 Industrial' },
                        { value: 'agricultural', label_th: '🟢 เกษตรกรรม', label_en: '🟢 Agricultural' },
                        { value: 'mixed', label_th: '🔵 ผสม', label_en: '🔵 Mixed Use' },
                    ]
                },
            ]
        },
        {
            id: 'utilities',
            emoji: '⚡',
            title_th: 'สาธารณูปโภค',
            title_en: 'Utilities',
            fields: [
                {
                    key: 'road_access', label_th: 'ทางเข้า', label_en: 'Road Access', importance: 'required', type: 'select',
                    options: [
                        { value: 'main_road', label_th: '🛣️ ติดถนนใหญ่', label_en: '🛣️ Main Road' },
                        { value: 'soi', label_th: '🚗 ติดซอย', label_en: '🚗 Soi Access' },
                        { value: 'alley', label_th: '🚶 ซอยเล็ก/ตรอก', label_en: '🚶 Alley' },
                        { value: 'none', label_th: '❌ ไม่มีทางเข้า', label_en: '❌ No Access' },
                    ]
                },
                {
                    key: 'utilities', label_th: 'น้ำ ไฟ', label_en: 'Utilities', importance: 'required', type: 'select',
                    options: [
                        { value: 'both', label_th: '✅ มีน้ำประปา + ไฟฟ้า', label_en: '✅ Water & Electricity' },
                        { value: 'electric_only', label_th: '⚡ มีไฟฟ้าอย่างเดียว', label_en: '⚡ Electricity Only' },
                        { value: 'none', label_th: '❌ ยังไม่มี', label_en: '❌ None' },
                    ]
                },
            ]
        },
    ],
    targetAudience: {
        th: ['นักลงทุน', 'ผู้รับเหมา', 'ทำสวน/เกษตร', 'สร้างบ้าน'],
        en: ['Investors', 'Developers', 'Farmers', 'Home Builders']
    }
}

// ============================================
// CONDO TEMPLATE (Subcategory 202)
// Condominiums - Thai Property Market
// ============================================
const CONDO_TEMPLATE: CategoryTemplate = {
    categoryId: 2,
    categoryName: 'Condominiums',
    emoji: '🏢',
    sections: [
        {
            id: 'project_info',
            emoji: '🏗️',
            title_th: 'ข้อมูลโครงการ',
            title_en: 'Project Information',
            fields: [
                { key: 'project_name', label_th: 'ชื่อโครงการ', label_en: 'Project Name', importance: 'required', type: 'text', extractFromTitle: true },
                { key: 'developer', label_th: 'บริษัทพัฒนา', label_en: 'Developer', importance: 'recommended', type: 'text' },
                { key: 'building', label_th: 'ตึก/อาคาร', label_en: 'Building', importance: 'optional', type: 'text' },
            ]
        },
        {
            id: 'unit_info',
            emoji: '🏠',
            title_th: 'ข้อมูลห้อง',
            title_en: 'Unit Information',
            fields: [
                { key: 'floor', label_th: 'ชั้น', label_en: 'Floor', importance: 'required', type: 'text' },
                { key: 'unit_size', label_th: 'ขนาดห้อง (ตร.ม.)', label_en: 'Unit Size (sq.m.)', importance: 'required', type: 'text' },
                {
                    key: 'room_type', label_th: 'ประเภทห้อง', label_en: 'Room Type', importance: 'required', type: 'select',
                    options: [
                        { value: 'studio', label_th: '🛏️ สตูดิโอ', label_en: '🛏️ Studio' },
                        { value: '1bed', label_th: '🛏️ 1 ห้องนอน', label_en: '🛏️ 1 Bedroom' },
                        { value: '2bed', label_th: '🛏️ 2 ห้องนอน', label_en: '🛏️ 2 Bedrooms' },
                        { value: '3bed', label_th: '🛏️ 3 ห้องนอน', label_en: '🛏️ 3 Bedrooms' },
                        { value: 'duplex', label_th: '🏠 Duplex', label_en: '🏠 Duplex' },
                        { value: 'penthouse', label_th: '👑 Penthouse', label_en: '👑 Penthouse' },
                    ]
                },
                { key: 'bathrooms', label_th: 'จำนวนห้องน้ำ', label_en: 'Bathrooms', importance: 'recommended', type: 'text' },
                {
                    key: 'view', label_th: 'วิว', label_en: 'View', importance: 'recommended', type: 'select',
                    options: [
                        { value: 'city', label_th: '🌆 วิวเมือง', label_en: '🌆 City View' },
                        { value: 'river', label_th: '🌊 วิวแม่น้ำ', label_en: '🌊 River View' },
                        { value: 'pool', label_th: '🏊 วิวสระว่ายน้ำ', label_en: '🏊 Pool View' },
                        { value: 'garden', label_th: '🌳 วิวสวน', label_en: '🌳 Garden View' },
                        { value: 'park', label_th: '🏞️ วิวสวนสาธารณะ', label_en: '🏞️ Park View' },
                        { value: 'other', label_th: '🏢 อื่นๆ', label_en: '🏢 Other' },
                    ]
                },
            ]
        },
        {
            id: 'fees',
            emoji: '💰',
            title_th: 'ค่าใช้จ่าย',
            title_en: 'Fees',
            fields: [
                { key: 'common_fee', label_th: 'ค่าส่วนกลาง (บาท/เดือน)', label_en: 'Common Fee (THB/month)', importance: 'required', type: 'text' },
                { key: 'sinking_fund', label_th: 'เงินกองทุน (บาท)', label_en: 'Sinking Fund (THB)', importance: 'optional', type: 'text' },
                {
                    key: 'transfer_fee', label_th: 'ค่าโอน/ค่าธรรมเนียม', label_en: 'Transfer Fee', importance: 'recommended', type: 'select',
                    options: [
                        { value: 'seller', label_th: '👤 ผู้ขายออก', label_en: '👤 Seller Pays' },
                        { value: 'buyer', label_th: '👥 ผู้ซื้อออก', label_en: '👥 Buyer Pays' },
                        { value: 'split', label_th: '➗ คนละครึ่ง', label_en: '➗ Split 50/50' },
                    ]
                },
            ]
        },
        {
            id: 'furnishing',
            emoji: '🛋️',
            title_th: 'เฟอร์นิเจอร์',
            title_en: 'Furnishing',
            fields: [
                {
                    key: 'furnishing', label_th: 'เฟอร์นิเจอร์', label_en: 'Furnishing', importance: 'required', type: 'select',
                    options: [
                        { value: 'fully', label_th: '🛋️ Fully Furnished', label_en: '🛋️ Fully Furnished' },
                        { value: 'partial', label_th: '🪑 Partially Furnished', label_en: '🪑 Partially Furnished' },
                        { value: 'unfurnished', label_th: '📦 Unfurnished', label_en: '📦 Unfurnished' },
                    ]
                },
                { key: 'appliances', label_th: 'เครื่องใช้ไฟฟ้าที่มี', label_en: 'Appliances Included', importance: 'optional', type: 'text', placeholder_th: 'เช่น แอร์ 2 ตัว, ตู้เย็น, ทีวี' },
            ]
        },
        {
            id: 'facilities',
            emoji: '🏊',
            title_th: 'สิ่งอำนวยความสะดวก',
            title_en: 'Facilities',
            fields: [
                { key: 'facilities', label_th: 'Facilities ส่วนกลาง', label_en: 'Common Facilities', importance: 'optional', type: 'text', placeholder_th: 'เช่น สระว่ายน้ำ, ฟิตเนส, Co-working' },
                {
                    key: 'parking', label_th: 'ที่จอดรถ', label_en: 'Parking', importance: 'recommended', type: 'select',
                    options: [
                        { value: '0', label_th: '❌ ไม่มี', label_en: '❌ None' },
                        { value: '1', label_th: '🚗 1 คัน', label_en: '🚗 1 Car' },
                        { value: '2+', label_th: '🚗 2 คันขึ้นไป', label_en: '🚗 2+ Cars' },
                    ]
                },
                { key: 'nearby', label_th: 'ใกล้อะไร', label_en: 'Nearby', importance: 'optional', type: 'text', placeholder_th: 'เช่น BTS อโศก, Terminal 21' },
            ]
        },
    ],
    targetAudience: {
        th: ['คนหาคอนโด', 'นักลงทุน', 'ต่างชาติ', 'คู่แต่งงานใหม่'],
        en: ['Condo Seekers', 'Investors', 'Expats', 'Newlyweds']
    }
}

// ============================================
// BICYCLE TEMPLATE (Subcategory 1201)
// Bicycles - Thai Cycling Market
// ============================================
const BICYCLE_TEMPLATE: CategoryTemplate = {
    categoryId: 12,
    categoryName: 'Bicycles',
    emoji: '🚴',
    sections: [
        {
            id: 'bike_info',
            emoji: '🚲',
            title_th: 'ข้อมูลจักรยาน',
            title_en: 'Bicycle Information',
            fields: [
                { key: 'brand', label_th: 'ยี่ห้อ', label_en: 'Brand', importance: 'required', type: 'text', extractFromTitle: true, aiDetectable: true },
                { key: 'model', label_th: 'รุ่น', label_en: 'Model', importance: 'required', type: 'text', extractFromTitle: true },
                { key: 'year', label_th: 'ปีรุ่น', label_en: 'Model Year', importance: 'recommended', type: 'text' },
                {
                    key: 'bike_type', label_th: 'ประเภทจักรยาน', label_en: 'Bicycle Type', importance: 'required', type: 'select',
                    options: [
                        { value: 'road', label_th: '🏁 เสือหมอบ (Road Bike)', label_en: '🏁 Road Bike' },
                        { value: 'mtb', label_th: '🏔️ เสือภูเขา (MTB)', label_en: '🏔️ Mountain Bike' },
                        { value: 'hybrid', label_th: '🚲 ไฮบริด', label_en: '🚲 Hybrid' },
                        { value: 'folding', label_th: '📦 พับได้', label_en: '📦 Folding' },
                        { value: 'gravel', label_th: '🌾 Gravel', label_en: '🌾 Gravel' },
                        { value: 'city', label_th: '🏙️ City/Commuter', label_en: '🏙️ City/Commuter' },
                        { value: 'fixie', label_th: '⚙️ Fixed Gear', label_en: '⚙️ Fixed Gear' },
                        { value: 'ebike', label_th: '⚡ E-Bike', label_en: '⚡ E-Bike' },
                    ]
                },
            ]
        },
        {
            id: 'frame',
            emoji: '📐',
            title_th: 'เฟรมและขนาด',
            title_en: 'Frame & Size',
            fields: [
                { key: 'frame_size', label_th: 'ขนาดเฟรม', label_en: 'Frame Size', importance: 'required', type: 'text', placeholder_th: 'เช่น 52cm, S, M, L, 17"' },
                {
                    key: 'frame_material', label_th: 'วัสดุเฟรม', label_en: 'Frame Material', importance: 'required', type: 'select',
                    options: [
                        { value: 'carbon', label_th: '⬛ คาร์บอน (Carbon)', label_en: '⬛ Carbon' },
                        { value: 'aluminum', label_th: '⚪ อลูมิเนียม (Alloy)', label_en: '⚪ Aluminum' },
                        { value: 'steel', label_th: '🔩 เหล็ก (Steel)', label_en: '🔩 Steel' },
                        { value: 'titanium', label_th: '💎 ไทเทเนียม', label_en: '💎 Titanium' },
                    ]
                },
                { key: 'color', label_th: 'สี', label_en: 'Color', importance: 'recommended', type: 'text', aiDetectable: true },
            ]
        },
        {
            id: 'components',
            emoji: '⚙️',
            title_th: 'ชุดขับเคลื่อน',
            title_en: 'Components',
            fields: [
                {
                    key: 'groupset', label_th: 'ชุดเกียร์ (Groupset)', label_en: 'Groupset', importance: 'required', type: 'select',
                    options: [
                        { value: 'shimano_105', label_th: 'Shimano 105', label_en: 'Shimano 105' },
                        { value: 'shimano_ultegra', label_th: 'Shimano Ultegra', label_en: 'Shimano Ultegra' },
                        { value: 'shimano_dura_ace', label_th: 'Shimano Dura-Ace', label_en: 'Shimano Dura-Ace' },
                        { value: 'shimano_tiagra', label_th: 'Shimano Tiagra', label_en: 'Shimano Tiagra' },
                        { value: 'shimano_claris', label_th: 'Shimano Claris', label_en: 'Shimano Claris' },
                        { value: 'shimano_deore', label_th: 'Shimano Deore', label_en: 'Shimano Deore' },
                        { value: 'shimano_xt', label_th: 'Shimano XT', label_en: 'Shimano XT' },
                        { value: 'shimano_xtr', label_th: 'Shimano XTR', label_en: 'Shimano XTR' },
                        { value: 'sram_rival', label_th: 'SRAM Rival', label_en: 'SRAM Rival' },
                        { value: 'sram_force', label_th: 'SRAM Force', label_en: 'SRAM Force' },
                        { value: 'sram_red', label_th: 'SRAM Red', label_en: 'SRAM Red' },
                        { value: 'campagnolo', label_th: 'Campagnolo', label_en: 'Campagnolo' },
                        { value: 'other', label_th: 'อื่นๆ', label_en: 'Other' },
                    ]
                },
                { key: 'speeds', label_th: 'จำนวนเกียร์ (speeds)', label_en: 'Speeds', importance: 'recommended', type: 'text', placeholder_th: 'เช่น 11-speed, 2x11' },
            ]
        },
        {
            id: 'wheels',
            emoji: '🛞',
            title_th: 'ล้อและยาง',
            title_en: 'Wheels & Tires',
            fields: [
                {
                    key: 'wheel_size', label_th: 'ขนาดล้อ', label_en: 'Wheel Size', importance: 'recommended', type: 'select',
                    options: [
                        { value: '700c', label_th: '700c (Road)', label_en: '700c (Road)' },
                        { value: '650b', label_th: '650b / 27.5"', label_en: '650b / 27.5"' },
                        { value: '29', label_th: '29" (MTB)', label_en: '29" (MTB)' },
                        { value: '26', label_th: '26"', label_en: '26"' },
                        { value: '20', label_th: '20" (Folding)', label_en: '20" (Folding)' },
                        { value: '16', label_th: '16"', label_en: '16"' },
                    ]
                },
                { key: 'wheelset', label_th: 'ยี่ห้อล้อ', label_en: 'Wheelset Brand', importance: 'optional', type: 'text', placeholder_th: 'เช่น Fulcrum Racing 3, Mavic Cosmic' },
            ]
        },
        {
            id: 'condition',
            emoji: '✅',
            title_th: 'สภาพ',
            title_en: 'Condition',
            fields: [
                { key: 'distance', label_th: 'ระยะทางที่ใช้ (กม.)', label_en: 'Distance Ridden (km)', importance: 'optional', type: 'text' },
                { key: 'upgrades', label_th: 'อัพเกรด/เปลี่ยนชิ้นส่วน', label_en: 'Upgrades', importance: 'optional', type: 'text', placeholder_th: 'เช่น เปลี่ยนอาน, ล้อใหม่' },
                { key: 'defects', label_th: 'ตำหนิ (ถ้ามี)', label_en: 'Defects (if any)', importance: 'optional', type: 'text' },
            ]
        },
    ],
    targetAudience: {
        th: ['นักปั่น', 'คนรักสุขภาพ', 'นักแข่ง', 'มือใหม่'],
        en: ['Cyclists', 'Fitness Enthusiasts', 'Racers', 'Beginners']
    }
}

// ============================================
// SUBCATEGORY TEMPLATES
// ============================================
const SUBCATEGORY_TEMPLATES: Record<number, CategoryTemplate> = {
    // Automotive
    101: CAR_TEMPLATE,               // รถยนต์มือสอง - Added!
    103: AUTOMOTIVE_PARTS_TEMPLATE,  // อะไหล่รถยนต์
    104: AUTOMOTIVE_PARTS_TEMPLATE,  // อะไหล่มอเตอร์ไซค์
    106: AUTOMOTIVE_PARTS_TEMPLATE,  // ล้อและยาง
    109: AUTOMOTIVE_PARTS_TEMPLATE,  // อุปกรณ์บำรุงรักษารถ
    102: MOTORCYCLE_TEMPLATE,         // มอเตอร์ไซค์ - Added!
    // Real Estate
    201: HOUSE_TEMPLATE,              // บ้านเดี่ยว - Added!
    202: CONDO_TEMPLATE,              // คอนโดมิเนียม - Added!
    203: LAND_TEMPLATE,               // ที่ดิน - Added!
    // Mobile & Tablets
    303: WEARABLE_TEMPLATE,           // Wearables - Added!
    // Sports
    1201: BICYCLE_TEMPLATE,          // จักรยาน - Added!
}

// ============================================
// TEMPLATE REGISTRY
// ============================================
const CATEGORY_TEMPLATES: Record<number, CategoryTemplate> = {
    1: AUTOMOTIVE_TEMPLATE,
    2: REAL_ESTATE_TEMPLATE,
    3: MOBILE_TEMPLATE,
    4: COMPUTER_TEMPLATE,
    5: APPLIANCES_TEMPLATE,
    6: FASHION_TEMPLATE,
    7: GAMING_TEMPLATE,
    8: CAMERA_TEMPLATE,
    9: AMULET_TEMPLATE,      // พระเครื่อง
    10: PETS_TEMPLATE,
    11: SERVICES_TEMPLATE,   // บริการ - Added!
    12: SPORTS_TEMPLATE,     // กีฬา - Added!
    13: HOME_TEMPLATE,
    14: BEAUTY_TEMPLATE,
    15: KIDS_TEMPLATE,
    16: BOOKS_TEMPLATE,      // หนังสือ - Added!
    // All 16 categories covered! 🎉
}

// ============================================
// MAIN GENERATOR FUNCTION
// ============================================

export function getTemplateForCategory(categoryId: number, subcategoryId?: number): CategoryTemplate {
    // First try subcategory-specific template
    if (subcategoryId && SUBCATEGORY_TEMPLATES[subcategoryId]) {
        return SUBCATEGORY_TEMPLATES[subcategoryId]
    }
    // Then fall back to category template
    return CATEGORY_TEMPLATES[categoryId] || DEFAULT_TEMPLATE
}

export function generateStructuredDescription(
    context: AIDescriptionContext
): StructuredDescription {
    const lang = context.language || 'th'
    const template = getTemplateForCategory(context.categoryId, context.subcategoryId)

    // Get subcategory-specific target audience if available
    const subcategoryTemplate = context.subcategoryId ? getSmartTemplateBySubcategory(context.subcategoryId) : null

    const sections: DescriptionSection[] = []
    const missingFields: StructuredDescription['missingFields'] = []
    const lines: string[] = []

    // Header with product name (only show if title exists)
    if (context.productTitle) {
        lines.push(`${template.emoji} **${context.productTitle}**`)
        lines.push('')
    }

    // Process each section
    for (const section of template.sections) {
        const sectionTitle = lang === 'th' ? section.title_th : section.title_en
        const sectionContent: string[] = []
        const sectionLines: string[] = []

        for (const field of section.fields) {
            const label = lang === 'th' ? field.label_th : field.label_en

            // Try to get value from AI specs or user specs
            let value = context.aiSpecs?.[field.key] || context.userSpecs?.[field.key]

            if (value) {
                // ✅ For 'overall' field, use category-specific conditions
                if (field.key === 'overall') {
                    const categoryConditions = getCategoryConditions(context.categoryId, context.subcategoryId)
                    const condOption = categoryConditions.conditions.find(c => c.value === value)
                    if (condOption) {
                        value = lang === 'th' ? condOption.label_th : condOption.label_en
                    }
                } else if (field.type === 'select' && field.options) {
                    // For other select fields, translate value to localized label
                    const option = field.options.find(opt => opt.value === value)
                    if (option) {
                        value = lang === 'th' ? option.label_th : option.label_en
                    }
                }

                // Only show fields that have values
                const line = `• ${label}: ${value}`
                sectionContent.push(line)
                sectionLines.push(line)
            } else if (field.importance === 'required' || field.importance === 'recommended') {
                // Add to missing fields (but don't show placeholder text)
                missingFields.push({
                    field: field.key,
                    label: label,
                    importance: field.importance,
                    placeholder: field.options?.[0]?.value
                })
                // DON'T show "_กรุณาระบุ_" - just track as missing
            }
        }

        // Only add section if it has content
        if (sectionContent.length > 0) {
            lines.push(`${section.emoji} **${sectionTitle}:**`)
            lines.push(...sectionLines)
            lines.push('')
        }

        sections.push({
            id: section.id,
            emoji: section.emoji,
            title: sectionTitle,
            content: sectionContent,
            isEditable: true
        })
    }

    // Add target audience - prefer subcategory-specific if available
    const targets = subcategoryTemplate
        ? getSubcategoryTargetAudience(context.subcategoryId!, lang)
        : (lang === 'th' ? template.targetAudience.th : template.targetAudience.en)

    if (targets.length > 0) {
        const targetTitle = lang === 'th' ? '👤 เหมาะสำหรับ' : '👤 Ideal For'
        lines.push(`${targetTitle}: ${targets.join(', ')}`)

        sections.push({
            id: 'target',
            emoji: '👤',
            title: lang === 'th' ? 'เหมาะสำหรับ' : 'Ideal For',
            content: targets,
            isEditable: false
        })
    }

    const fullText = lines.join('\n')

    return {
        fullText,
        sections,
        wordCount: fullText.split(/\s+/).length,
        characterCount: fullText.length,
        seoScore: calculateSEOScore(fullText, missingFields),
        missingFields
    }
}

// ============================================
// SEO SCORE CALCULATOR
// ============================================
function calculateSEOScore(
    text: string,
    missingFields: StructuredDescription['missingFields']
): number {
    let score = 100

    // Deduct for missing required fields (-10 each)
    const requiredMissing = missingFields.filter(f => f.importance === 'required').length
    score -= requiredMissing * 10

    // Deduct for missing recommended fields (-5 each)
    const recommendedMissing = missingFields.filter(f => f.importance === 'recommended').length
    score -= recommendedMissing * 5

    // Bonus for length (up to +10)
    if (text.length > 200) score += 5
    if (text.length > 400) score += 5

    // Bonus for having emojis (+5)
    if (/[\u{1F300}-\u{1F9FF}]/u.test(text)) score += 5

    return Math.max(0, Math.min(100, score))
}

// ============================================
// ENHANCED PROMPT FOR OPENAI
// ============================================
export function generateEnhancedPrompt(categoryId: number, language: 'th' | 'en'): string {
    const template = getTemplateForCategory(categoryId)

    const fieldsList = template.sections
        .flatMap(s => s.fields)
        .filter(f => f.aiDetectable)
        .map(f => language === 'th' ? f.label_th : f.label_en)
        .join(', ')

    if (language === 'th') {
        return `วิเคราะห์รูปสินค้าและพยายามระบุข้อมูลต่อไปนี้ให้ได้มากที่สุด:
${fieldsList}

ถ้าไม่แน่ใจให้เขียนว่า "กรุณาระบุ"
ตอบในรูปแบบ JSON object`
    } else {
        return `Analyze the product image and try to identify:
${fieldsList}

If uncertain, write "Please specify"
Reply in JSON object format`
    }
}

// ============================================
// OPTIMIZED TITLE GENERATION ENGINE
// ============================================

/**
 * Input parameters for generating optimized product titles
 */
export interface TitleGenerationInput {
    // Product Info
    category: string
    subcategory?: string
    brand?: string
    model?: string
    keySpecs?: string[]         // e.g., ["128GB", "5G", "OLED"]

    // Condition & Status
    condition?: 'new' | 'used' | 'like_new' | 'refurbished'
    sellingPoints?: string[]    // e.g., ["Low mileage", "Owner direct"]
    ownership?: 'owner_direct' | 'dealer' | 'agent'
    warranty?: string           // e.g., "yes", "6 months remaining"

    // Additional Context
    location?: string           // e.g., "Near BTS Asoke"
    year?: number | string      // For vehicles
    mileage?: string            // e.g., "50,000 km"

    // Settings
    language?: 'th' | 'en' | 'auto'
}

/**
 * Output from title generation
 */
export interface TitleGenerationResult {
    title: string
    characterCount: number
    language: 'th' | 'en'
    structure: {
        productType: string
        brandModel?: string
        keyDifferentiator?: string
        sellingPoint?: string
    }
}

// Category detection for title logic
type TitleCategory =
    | 'electronics'
    | 'vehicles'
    | 'property'
    | 'appliances'
    | 'fashion'
    | 'general'

// Detect category for title generation logic
function detectTitleCategory(category: string, subcategory?: string): TitleCategory {
    const catLower = (category + ' ' + (subcategory || '')).toLowerCase()

    // Electronics: Phones, Laptops, Computers, Cameras, Wearables
    if (/phone|mobile|tablet|laptop|computer|pc|camera|smartwatch|earbuds|หูฟัง|โทรศัพท์|มือถือ|แท็บเล็ต|คอม|โน๊ตบุ๊ค|กล้อง|นาฬิกา/.test(catLower)) {
        return 'electronics'
    }

    // Vehicles: Cars, Motorcycles
    if (/car|vehicle|auto|motorcycle|รถ|มอเตอร์ไซค์|รถยนต์/.test(catLower)) {
        return 'vehicles'
    }

    // Property: Real Estate, Condo, House, Land
    if (/property|real estate|condo|house|land|apartment|อสังหา|คอนโด|บ้าน|ที่ดิน|ห้อง/.test(catLower)) {
        return 'property'
    }

    // Appliances: Home appliances, Electronics appliances
    if (/appliance|washer|dryer|fridge|refrigerator|air|purifier|fan|เครื่องใช้|ตู้เย็น|เครื่องซัก|แอร์|พัดลม/.test(catLower)) {
        return 'appliances'
    }

    // Fashion: Clothes, Bags, Shoes
    if (/fashion|clothes|bag|shoes|watch|เสื้อผ้า|กระเป๋า|รองเท้า|นาฬิกา/.test(catLower)) {
        return 'fashion'
    }

    return 'general'
}

// Detect language from input content
function detectLanguage(input: TitleGenerationInput): 'th' | 'en' {
    if (input.language === 'th' || input.language === 'en') {
        return input.language
    }

    // Auto-detect based on category/brand/specs content
    const allText = [
        input.category,
        input.subcategory,
        input.brand,
        input.model,
        ...(input.keySpecs || []),
        ...(input.sellingPoints || []),
        input.location
    ].filter(Boolean).join(' ')

    // Check for Thai characters
    const thaiCharPattern = /[\u0E00-\u0E7F]/
    if (thaiCharPattern.test(allText)) {
        return 'th'
    }

    return 'en'
}

// Map condition to display text
function getConditionText(condition: string | undefined, lang: 'th' | 'en'): string {
    const conditionMap: Record<string, { th: string; en: string }> = {
        'new': { th: 'ใหม่', en: 'New' },
        'like_new': { th: 'สภาพดีมาก', en: 'Like New' },
        'used': { th: 'มือสอง', en: 'Used' },
        'refurbished': { th: 'รีเฟอร์บิช', en: 'Refurbished' }
    }

    if (!condition) return ''
    return conditionMap[condition]?.[lang] || ''
}

// Map ownership to display text
function getOwnershipText(ownership: string | undefined, lang: 'th' | 'en'): string {
    const ownershipMap: Record<string, { th: string; en: string }> = {
        'owner_direct': { th: 'ขายเอง', en: 'Owner Direct' },
        'dealer': { th: 'เต็นท์', en: 'Dealer' },
        'agent': { th: 'นายหน้า', en: 'Agent' }
    }

    if (!ownership) return ''
    return ownershipMap[ownership]?.[lang] || ''
}

// Select best selling points (max 1-2)
function selectBestSellingPoints(
    sellingPoints: string[] | undefined,
    maxCount: number = 2
): string[] {
    if (!sellingPoints || sellingPoints.length === 0) return []

    // Prioritize by common high-value indicators
    const priorityKeywords = [
        'warranty', 'ประกัน',
        'low', 'mileage', 'ไมล์น้อย',
        'original', 'ของแท้',
        'owner', 'ขายเอง',
        'new', 'ใหม่',
        'complete', 'ครบ',
        'box', 'กล่อง',
        'excellent', 'ดีมาก'
    ]

    // Score and sort
    const scored = sellingPoints.map(sp => {
        const lower = sp.toLowerCase()
        const score = priorityKeywords.reduce((acc, kw) =>
            lower.includes(kw) ? acc + 1 : acc, 0
        )
        return { point: sp, score }
    })

    scored.sort((a, b) => b.score - a.score)

    return scored.slice(0, maxCount).map(s => s.point)
}

/**
 * Generate optimized product title for marketplace listings
 * 
 * Rules:
 * - 40-80 characters (max 100)
 * - Factual, neutral, professional
 * - No emojis or special symbols
 * - No price or contact info
 * - Category-aware structure
 * - Highlights 1-2 selling points max
 * 
 * @param input - Title generation input parameters
 * @returns Optimized title with metadata
 */
export function generateOptimizedTitle(input: TitleGenerationInput): TitleGenerationResult {
    const lang = detectLanguage(input)
    const titleCategory = detectTitleCategory(input.category, input.subcategory)

    const parts: string[] = []
    const structure: TitleGenerationResult['structure'] = {
        productType: ''
    }

    // ============================================
    // STEP 1: Product Type / Category
    // ============================================
    const productType = input.subcategory || input.category
    parts.push(productType)
    structure.productType = productType

    // ============================================
    // STEP 2: Brand + Model (if available)
    // ============================================
    if (input.brand || input.model) {
        const brandModel = [input.brand, input.model].filter(Boolean).join(' ')
        parts.push(brandModel)
        structure.brandModel = brandModel
    }

    // ============================================
    // STEP 3: Category-Specific Key Differentiator
    // ============================================
    let keyDifferentiator = ''

    switch (titleCategory) {
        case 'electronics':
            // Prioritize: model, capacity, condition, warranty
            const electSpecs: string[] = []
            if (input.keySpecs && input.keySpecs[0]) {
                electSpecs.push(input.keySpecs[0]) // e.g., "128GB"
            }
            if (input.condition && input.condition !== 'new') {
                electSpecs.push(getConditionText(input.condition, lang))
            }
            if (input.warranty && input.warranty !== 'no') {
                electSpecs.push(lang === 'th' ? 'มีประกัน' : 'Warranty')
            }
            keyDifferentiator = electSpecs.slice(0, 2).join(', ')
            break

        case 'vehicles':
            // Prioritize: year, mileage, ownership, condition
            const vehSpecs: string[] = []
            if (input.year) {
                vehSpecs.push(String(input.year))
            }
            if (input.mileage) {
                const mileText = lang === 'th' ? `ไมล์ ${input.mileage}` : input.mileage
                vehSpecs.push(mileText)
            }
            if (input.ownership) {
                vehSpecs.push(getOwnershipText(input.ownership, lang))
            }
            keyDifferentiator = vehSpecs.slice(0, 2).join(', ')
            break

        case 'property':
            // Prioritize: location, readiness, key feature
            const propSpecs: string[] = []
            if (input.location) {
                propSpecs.push(input.location)
            }
            if (input.keySpecs && input.keySpecs[0]) {
                propSpecs.push(input.keySpecs[0]) // e.g., "Fully Furnished"
            }
            keyDifferentiator = propSpecs.slice(0, 2).join(', ')
            break

        case 'appliances':
            // Prioritize: condition, usage, warranty
            const appSpecs: string[] = []
            if (input.condition) {
                appSpecs.push(getConditionText(input.condition, lang))
            }
            if (input.warranty && input.warranty !== 'no') {
                appSpecs.push(lang === 'th' ? 'มีประกัน' : 'Warranty')
            }
            if (input.keySpecs && input.keySpecs[0]) {
                appSpecs.push(input.keySpecs[0])
            }
            keyDifferentiator = appSpecs.slice(0, 2).join(', ')
            break

        case 'fashion':
            // Prioritize: size, color, condition
            const fashSpecs: string[] = []
            if (input.keySpecs && input.keySpecs.length > 0) {
                fashSpecs.push(...input.keySpecs.slice(0, 2))
            }
            if (input.condition && input.condition !== 'new') {
                fashSpecs.push(getConditionText(input.condition, lang))
            }
            keyDifferentiator = fashSpecs.slice(0, 2).join(', ')
            break

        default:
            // General: prioritize usability and condition
            const genSpecs: string[] = []
            if (input.keySpecs && input.keySpecs[0]) {
                genSpecs.push(input.keySpecs[0])
            }
            if (input.condition) {
                genSpecs.push(getConditionText(input.condition, lang))
            }
            keyDifferentiator = genSpecs.slice(0, 2).join(', ')
    }

    if (keyDifferentiator) {
        structure.keyDifferentiator = keyDifferentiator
    }

    // ============================================
    // STEP 4: Optional Strong Selling Point (max 1)
    // ============================================
    const bestPoints = selectBestSellingPoints(input.sellingPoints, 1)
    if (bestPoints.length > 0) {
        structure.sellingPoint = bestPoints[0]
    }

    // ============================================
    // BUILD FINAL TITLE
    // ============================================
    // Format: [Product Type] [Brand Model] – [Key Differentiator][, Selling Point]

    let title = ''

    // Product type + brand/model
    if (structure.brandModel) {
        title = `${structure.productType} ${structure.brandModel}`
    } else {
        title = structure.productType
    }

    // Add differentiator and selling point with dash separator
    const extras: string[] = []
    if (keyDifferentiator) extras.push(keyDifferentiator)
    if (structure.sellingPoint) extras.push(structure.sellingPoint)

    if (extras.length > 0) {
        title += ` – ${extras.join(', ')}`
    }

    // ============================================
    // ENFORCE LENGTH LIMITS (40-100 chars)
    // ============================================
    // If too long, trim selling point first, then differentiator
    if (title.length > 100) {
        // Remove selling point
        if (structure.sellingPoint) {
            const extrasWithoutSelling = keyDifferentiator ? [keyDifferentiator] : []
            if (extrasWithoutSelling.length > 0) {
                title = `${structure.productType}${structure.brandModel ? ' ' + structure.brandModel : ''} – ${extrasWithoutSelling.join(', ')}`
            } else {
                title = `${structure.productType}${structure.brandModel ? ' ' + structure.brandModel : ''}`
            }
        }
    }

    // If still too long, truncate gracefully
    if (title.length > 100) {
        title = title.substring(0, 97) + '...'
    }

    // Clean up any double spaces or trailing dashes
    title = title
        .replace(/\s+/g, ' ')
        .replace(/\s*–\s*$/, '')
        .replace(/\s*,\s*$/, '')
        .trim()

    return {
        title,
        characterCount: title.length,
        language: lang,
        structure
    }
}

/**
 * Generate title from AI analysis context (for integration with vision pipeline)
 */
export function generateTitleFromContext(context: AIDescriptionContext): TitleGenerationResult {
    // Map AIDescriptionContext to TitleGenerationInput
    const input: TitleGenerationInput = {
        category: context.categoryName || '',
        subcategory: context.subcategoryName,
        brand: context.detectedBrands?.[0],
        model: context.aiSpecs?.model,
        keySpecs: Object.values(context.aiSpecs || {}).filter(v =>
            typeof v === 'string' && v.length < 30
        ).slice(0, 3),
        condition: context.suggestedCondition as TitleGenerationInput['condition'],
        language: context.language || 'th'
    }

    // Extract additional specs
    if (context.aiSpecs?.storage) {
        input.keySpecs = [context.aiSpecs.storage, ...(input.keySpecs || [])]
    }
    if (context.aiSpecs?.ram) {
        input.keySpecs = [...(input.keySpecs || []), context.aiSpecs.ram]
    }

    return generateOptimizedTitle(input)
}

// ============================================
// EXPORT TEMPLATES FOR UI
// ============================================
export {
    COMPUTER_TEMPLATE,
    MOBILE_TEMPLATE,
    FASHION_TEMPLATE,
    AUTOMOTIVE_TEMPLATE,
    REAL_ESTATE_TEMPLATE,
    AMULET_TEMPLATE,
    SERVICES_TEMPLATE,   // บริการ - Added!
    SPORTS_TEMPLATE,     // กีฬา - Added!
    BOOKS_TEMPLATE,      // หนังสือ - Added!
    APPLIANCES_TEMPLATE,
    CAMERA_TEMPLATE,
    GAMING_TEMPLATE,
    HOME_TEMPLATE,
    BEAUTY_TEMPLATE,
    KIDS_TEMPLATE,
    PETS_TEMPLATE,
    DEFAULT_TEMPLATE,
    CATEGORY_TEMPLATES
}

// CategoryTemplate is already exported inline, others via interface
