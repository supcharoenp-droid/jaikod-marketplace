/**
 * CATEGORY-SPECIFIC CONDITION OPTIONS
 * 
 * ตัวเลือกสภาพที่แตกต่างกันตามประเภทสินค้า
 * ออกแบบจากการวิเคราะห์: Kaidee, Shopee, Lazada, CarMax, Chrono24, Vestiaire Collective
 * 
 * @version 1.0.0
 */

export interface ConditionOption {
    value: string
    label_th: string
    label_en: string
    severity?: 'excellent' | 'good' | 'fair' | 'poor'  // For styling/sorting
    emoji?: string
}

export interface CategoryConditions {
    categoryId: number
    categoryName: string
    conditions: ConditionOption[]
    // Additional fields specific to this category's condition
    additionalFields?: {
        key: string
        label_th: string
        label_en: string
        type: 'text' | 'select' | 'boolean'
        options?: ConditionOption[]
    }[]
}

// ============================================
// 1. AUTOMOTIVE (ID: 1)
// ⚠️ additionalFields (accident, flood) moved to world-class-description-engine.ts
// ============================================
const AUTOMOTIVE_CONDITIONS: CategoryConditions = {
    categoryId: 1,
    categoryName: 'Automotive',
    conditions: [
        { value: 'new', label_th: '🆕 ใหม่ป้ายแดง', label_en: '🆕 Brand New', severity: 'excellent', emoji: '🆕' },
        { value: 'like_new', label_th: '✨ เหมือนใหม่ ไมล์น้อย', label_en: '✨ Like New, Low Mileage', severity: 'excellent', emoji: '✨' },
        { value: 'good', label_th: '👍 สภาพดี ใช้งานปกติ', label_en: '👍 Good, Normal Use', severity: 'good', emoji: '👍' },
        { value: 'fair', label_th: '⚠️ ใช้งานได้ ต้องซ่อมบำรุง', label_en: '⚠️ Fair, Needs Maintenance', severity: 'fair', emoji: '⚠️' },
        { value: 'poor', label_th: '🔧 ซากรถ/อะไหล่', label_en: '🔧 Salvage/Parts', severity: 'poor', emoji: '🔧' },
    ],
    // ⚠️ NO additionalFields here - they are in world-class-description-engine.ts
    // to avoid duplicate fields and mismatched keys
}

// ============================================
// 3. MOBILE PHONES (ID: 3)
// ============================================
const MOBILE_CONDITIONS: CategoryConditions = {
    categoryId: 3,
    categoryName: 'Mobile & Tablets',
    conditions: [
        { value: 'new_sealed', label_th: '📦 ใหม่ ยังไม่แกะซีล', label_en: '📦 New, Sealed', severity: 'excellent', emoji: '📦' },
        { value: 'new_opened', label_th: '🆕 ใหม่ แกะแล้วไม่ได้ใช้', label_en: '🆕 New, Opened Unused', severity: 'excellent', emoji: '🆕' },
        { value: 'like_new', label_th: '✨ เหมือนใหม่ 99%', label_en: '✨ Like New 99%', severity: 'excellent', emoji: '✨' },
        { value: 'good', label_th: '👍 สภาพดี มีรอยใช้งานเล็กน้อย', label_en: '👍 Good, Minor Wear', severity: 'good', emoji: '👍' },
        { value: 'fair', label_th: '⚠️ ใช้งานได้ปกติ มีรอยเยอะ', label_en: '⚠️ Fair, Visible Wear', severity: 'fair', emoji: '⚠️' },
        { value: 'cracked_screen', label_th: '💔 หน้าจอแตก/ร้าว', label_en: '💔 Cracked Screen', severity: 'poor', emoji: '💔' },
        { value: 'parts_only', label_th: '🔧 ขายเป็นอะไหล่', label_en: '🔧 For Parts Only', severity: 'poor', emoji: '🔧' },
    ],
    additionalFields: [
        {
            key: 'battery_health',
            label_th: 'สุขภาพแบตเตอรี่ (%)',
            label_en: 'Battery Health (%)',
            type: 'text'
        },
        {
            key: 'screen_condition',
            label_th: 'สภาพหน้าจอ',
            label_en: 'Screen Condition',
            type: 'select',
            options: [
                { value: 'perfect', label_th: '✨ สมบูรณ์ ไม่มีรอย', label_en: '✨ Perfect, No Scratches' },
                { value: 'minor_scratches', label_th: '👌 มีรอยเล็กน้อย', label_en: '👌 Minor Scratches' },
                { value: 'visible_scratches', label_th: '⚠️ มีรอยเห็นชัด', label_en: '⚠️ Visible Scratches' },
                { value: 'cracked', label_th: '💔 แตก/ร้าว', label_en: '💔 Cracked' },
            ]
        },
        {
            key: 'icloud_status',
            label_th: 'iCloud/FRP',
            label_en: 'iCloud/FRP Status',
            type: 'select',
            options: [
                { value: 'unlocked', label_th: '🔓 ปลดล็อคแล้ว', label_en: '🔓 Unlocked' },
                { value: 'locked', label_th: '🔒 ยังล็อคอยู่', label_en: '🔒 Locked' },
            ]
        },
    ]
}

// ============================================
// 4. COMPUTERS (ID: 4)
// ============================================
const COMPUTER_CONDITIONS: CategoryConditions = {
    categoryId: 4,
    categoryName: 'Computers & IT',
    conditions: [
        { value: 'new_sealed', label_th: '📦 ใหม่แกะกล่อง ยังไม่แกะซีล', label_en: '📦 New, Sealed', severity: 'excellent', emoji: '📦' },
        { value: 'like_new', label_th: '✨ เหมือนใหม่ 99%', label_en: '✨ Like New 99%', severity: 'excellent', emoji: '✨' },
        { value: 'good', label_th: '👍 สภาพดี ใช้งานปกติ', label_en: '👍 Good, Working Well', severity: 'good', emoji: '👍' },
        { value: 'fair', label_th: '⚠️ มีรอยใช้งานบ้าง', label_en: '⚠️ Fair, Visible Wear', severity: 'fair', emoji: '⚠️' },
        { value: 'refurbished', label_th: '🔄 Refurbished ซ่อมแล้ว', label_en: '🔄 Refurbished', severity: 'good', emoji: '🔄' },
        { value: 'needs_repair', label_th: '🔧 ต้องซ่อม/มีปัญหา', label_en: '🔧 Needs Repair', severity: 'poor', emoji: '🔧' },
    ],
    additionalFields: [
        {
            key: 'battery_cycles',
            label_th: 'รอบชาร์จแบตเตอรี่',
            label_en: 'Battery Cycle Count',
            type: 'text'
        },
        {
            key: 'keyboard_condition',
            label_th: 'สภาพคีย์บอร์ด',
            label_en: 'Keyboard Condition',
            type: 'select',
            options: [
                { value: 'perfect', label_th: '✨ สมบูรณ์ ตัวอักษรชัด', label_en: '✨ Perfect' },
                { value: 'worn', label_th: '⚠️ ตัวอักษรลบ', label_en: '⚠️ Letters Faded' },
                { value: 'sticky', label_th: '🔧 กดแล้วติด', label_en: '🔧 Sticky Keys' },
            ]
        },
    ]
}

// ============================================
// 5. HOME APPLIANCES (ID: 5)
// ============================================
const APPLIANCE_CONDITIONS: CategoryConditions = {
    categoryId: 5,
    categoryName: 'Home Appliances',
    conditions: [
        { value: 'new_box', label_th: '📦 ใหม่แกะกล่อง', label_en: '📦 Brand New in Box', severity: 'excellent', emoji: '📦' },
        { value: 'like_new', label_th: '✨ เหมือนใหม่ ใช้น้อย', label_en: '✨ Like New, Rarely Used', severity: 'excellent', emoji: '✨' },
        { value: 'good', label_th: '👍 ใช้งานได้ดี', label_en: '👍 Good, Works Well', severity: 'good', emoji: '👍' },
        { value: 'working', label_th: '✅ ใช้งานได้ปกติ', label_en: '✅ Working Condition', severity: 'good', emoji: '✅' },
        { value: 'needs_maintenance', label_th: '🔧 ต้องบำรุงรักษา', label_en: '🔧 Needs Maintenance', severity: 'fair', emoji: '🔧' },
        { value: 'not_working', label_th: '⛔ เสีย/ไม่ทำงาน', label_en: '⛔ Not Working', severity: 'poor', emoji: '⛔' },
    ],
    additionalFields: [
        {
            key: 'warranty_status',
            label_th: 'ประกัน',
            label_en: 'Warranty',
            type: 'select',
            options: [
                { value: 'in_warranty', label_th: '✅ ยังมีประกัน', label_en: '✅ Under Warranty' },
                { value: 'expired', label_th: '⏳ หมดประกันแล้ว', label_en: '⏳ Warranty Expired' },
                { value: 'no_warranty', label_th: '❌ ไม่มีประกัน', label_en: '❌ No Warranty' },
            ]
        },
    ]
}

// ============================================
// 6. FASHION (ID: 6)
// ============================================
const FASHION_CONDITIONS: CategoryConditions = {
    categoryId: 6,
    categoryName: 'Fashion',
    conditions: [
        { value: 'new_tag', label_th: '🏷️ ใหม่ ยังไม่แกะป้าย', label_en: '🏷️ New with Tags', severity: 'excellent', emoji: '🏷️' },
        { value: 'new_no_tag', label_th: '✨ ใหม่ แกะป้ายแล้ว', label_en: '✨ New without Tags', severity: 'excellent', emoji: '✨' },
        { value: 'like_new', label_th: '👍 เหมือนใหม่ ใส่ 1-2 ครั้ง', label_en: '👍 Like New, Worn 1-2 Times', severity: 'excellent', emoji: '👍' },
        { value: 'good', label_th: '✅ สภาพดี ไม่มีตำหนิ', label_en: '✅ Good, No Flaws', severity: 'good', emoji: '✅' },
        { value: 'minor_flaws', label_th: '⚠️ มีตำหนิเล็กน้อย', label_en: '⚠️ Minor Flaws', severity: 'fair', emoji: '⚠️' },
        { value: 'visible_wear', label_th: '🟡 มีร่องรอยใช้งานชัด', label_en: '🟡 Visible Wear', severity: 'fair', emoji: '🟡' },
        { value: 'damaged', label_th: '⛔ มีความเสียหาย', label_en: '⛔ Damaged', severity: 'poor', emoji: '⛔' },
    ],
    additionalFields: [
        {
            key: 'flaws',
            label_th: 'ตำหนิ (ถ้ามี)',
            label_en: 'Flaws (if any)',
            type: 'select',
            options: [
                { value: 'none', label_th: '✅ ไม่มีตำหนิ', label_en: '✅ No Flaws' },
                { value: 'scratches', label_th: '📍 มีรอยขีดข่วน', label_en: '📍 Scratches' },
                { value: 'stain', label_th: '💧 มีคราบ', label_en: '💧 Stains' },
                { value: 'faded', label_th: '🌅 สีซีด', label_en: '🌅 Color Faded' },
                { value: 'peeling', label_th: '📜 หนังลอก/ถลอก', label_en: '📜 Peeling' },
                { value: 'torn', label_th: '✂️ ขาด/เย็บซ่อมแล้ว', label_en: '✂️ Torn/Repaired' },
            ]
        },
    ]
}

// ============================================
// 6a. LUXURY BAGS & WATCHES (Subcategory of 6)
// ============================================
const LUXURY_CONDITIONS: CategoryConditions = {
    categoryId: 603, // subcategory ID for bags
    categoryName: 'Luxury Items',
    conditions: [
        { value: 'new_receipt', label_th: '📦 ใหม่ มีใบเสร็จ/ใบรับประกัน', label_en: '📦 New with Receipt', severity: 'excellent', emoji: '📦' },
        { value: 'new_no_receipt', label_th: '✨ ใหม่ ไม่มีใบเสร็จ', label_en: '✨ New, No Receipt', severity: 'excellent', emoji: '✨' },
        { value: 'like_new', label_th: '💎 เหมือนใหม่ ใช้น้อยมาก', label_en: '💎 Like New, Lightly Used', severity: 'excellent', emoji: '💎' },
        { value: 'excellent', label_th: '👑 สภาพดีมาก ไม่มีรอย', label_en: '👑 Excellent, No Marks', severity: 'excellent', emoji: '👑' },
        { value: 'very_good', label_th: '👍 สภาพดี มีร่องรอยเล็กน้อย', label_en: '👍 Very Good, Minor Wear', severity: 'good', emoji: '👍' },
        { value: 'good', label_th: '✅ สภาพใช้งานดี', label_en: '✅ Good Condition', severity: 'good', emoji: '✅' },
        { value: 'fair', label_th: '⚠️ มีร่องรอยชัด', label_en: '⚠️ Fair, Visible Wear', severity: 'fair', emoji: '⚠️' },
        { value: 'poor', label_th: '🔧 ต้องซ่อม/ดูแลรักษา', label_en: '🔧 Needs Repair', severity: 'poor', emoji: '🔧' },
    ],
    additionalFields: [
        {
            key: 'authenticity',
            label_th: 'ความแท้',
            label_en: 'Authenticity',
            type: 'select',
            options: [
                { value: 'authentic_verified', label_th: '✅ แท้ 100% ตรวจสอบแล้ว', label_en: '✅ Authentic, Verified' },
                { value: 'authentic_receipt', label_th: '📄 แท้ มีใบเสร็จ', label_en: '📄 Authentic with Receipt' },
                { value: 'authentic_card', label_th: '💳 แท้ มีการ์ด', label_en: '💳 Authentic with Card' },
                { value: 'not_verified', label_th: '❓ ยังไม่ได้ตรวจสอบ', label_en: '❓ Not Verified' },
            ]
        },
        {
            key: 'box_papers',
            label_th: 'กล่อง/อุปกรณ์',
            label_en: 'Box & Papers',
            type: 'select',
            options: [
                { value: 'full_set', label_th: '📦 ครบชุด กล่อง+การ์ด+ใบเสร็จ', label_en: '📦 Full Set' },
                { value: 'box_card', label_th: '📦 มีกล่อง+การ์ด', label_en: '📦 Box & Card' },
                { value: 'box_only', label_th: '📦 มีกล่องอย่างเดียว', label_en: '📦 Box Only' },
                { value: 'no_box', label_th: '❌ ไม่มีกล่อง', label_en: '❌ No Box' },
            ]
        },
    ]
}

// ============================================
// 7. GAMING (ID: 7)
// ============================================
const GAMING_CONDITIONS: CategoryConditions = {
    categoryId: 7,
    categoryName: 'Gaming',
    conditions: [
        { value: 'new_sealed', label_th: '📦 ใหม่ ยังไม่แกะซีล', label_en: '📦 New, Sealed', severity: 'excellent', emoji: '📦' },
        { value: 'like_new', label_th: '✨ เหมือนใหม่ แทบไม่ได้เล่น', label_en: '✨ Like New, Barely Used', severity: 'excellent', emoji: '✨' },
        { value: 'good', label_th: '👍 สภาพดี ใช้งานได้ปกติ', label_en: '👍 Good, Works Perfectly', severity: 'good', emoji: '👍' },
        { value: 'fair', label_th: '⚠️ มีรอยใช้งาน', label_en: '⚠️ Fair, Visible Wear', severity: 'fair', emoji: '⚠️' },
        { value: 'modded', label_th: '🔧 แปลงเครื่อง/Mod', label_en: '🔧 Modded', severity: 'fair', emoji: '🔧' },
    ],
    additionalFields: [
        {
            key: 'controller_condition',
            label_th: 'สภาพจอย',
            label_en: 'Controller Condition',
            type: 'select',
            options: [
                { value: 'perfect', label_th: '✅ สมบูรณ์ ปุ่มดี', label_en: '✅ Perfect, Buttons Work' },
                { value: 'drift', label_th: '⚠️ Analog Drift', label_en: '⚠️ Analog Drift' },
                { value: 'worn', label_th: '🟡 ปุ่มสึก', label_en: '🟡 Worn Buttons' },
            ]
        },
    ]
}

// ============================================
// 8. CAMERAS (ID: 8)
// ============================================
const CAMERA_CONDITIONS: CategoryConditions = {
    categoryId: 8,
    categoryName: 'Cameras',
    conditions: [
        { value: 'new_box', label_th: '📦 ใหม่แกะกล่อง', label_en: '📦 New in Box', severity: 'excellent', emoji: '📦' },
        { value: 'like_new', label_th: '✨ เหมือนใหม่ ชัตเตอร์ต่ำ', label_en: '✨ Like New, Low Shutter', severity: 'excellent', emoji: '✨' },
        { value: 'excellent', label_th: '👑 ดีมาก ไม่มีฝุ่น/ขึ้นฝ้า', label_en: '👑 Excellent, No Dust/Haze', severity: 'excellent', emoji: '👑' },
        { value: 'good', label_th: '👍 สภาพดี ใช้งานปกติ', label_en: '👍 Good, Working Well', severity: 'good', emoji: '👍' },
        { value: 'dust', label_th: '💨 มีฝุ่นในเซนเซอร์/เลนส์', label_en: '💨 Dust in Sensor/Lens', severity: 'fair', emoji: '💨' },
        { value: 'haze', label_th: '🌫️ เลนส์ขึ้นฝ้า/รา', label_en: '🌫️ Lens Haze/Fungus', severity: 'poor', emoji: '🌫️' },
        { value: 'needs_repair', label_th: '🔧 ต้องซ่อม', label_en: '🔧 Needs Repair', severity: 'poor', emoji: '🔧' },
    ],
    additionalFields: [
        {
            key: 'shutter_count',
            label_th: 'จำนวนชัตเตอร์',
            label_en: 'Shutter Count',
            type: 'text'
        },
        {
            key: 'sensor_condition',
            label_th: 'สภาพเซนเซอร์',
            label_en: 'Sensor Condition',
            type: 'select',
            options: [
                { value: 'clean', label_th: '✨ สะอาด ไม่มีฝุ่น', label_en: '✨ Clean, No Dust' },
                { value: 'minor_dust', label_th: '⚠️ มีฝุ่นเล็กน้อย', label_en: '⚠️ Minor Dust' },
                { value: 'needs_cleaning', label_th: '🧹 ต้องทำความสะอาด', label_en: '🧹 Needs Cleaning' },
            ]
        },
    ]
}

// ============================================
// 9. AMULETS & COLLECTIBLES (ID: 9)
// ============================================
const AMULET_CONDITIONS: CategoryConditions = {
    categoryId: 9,
    categoryName: 'Amulets & Collectibles',
    conditions: [
        { value: 'original_surface', label_th: '🏆 สวยเดิม ผิวเดิมๆ', label_en: '🏆 Original Surface', severity: 'excellent', emoji: '🏆' },
        { value: 'natural_patina', label_th: '✨ สวย ผิวเปิดตี้', label_en: '✨ Beautiful Natural Patina', severity: 'excellent', emoji: '✨' },
        { value: 'gold_cased', label_th: '💛 เลี่ยมทอง', label_en: '💛 Gold Cased', severity: 'excellent', emoji: '💛' },
        { value: 'silver_cased', label_th: '🩶 เลี่ยมเงิน', label_en: '🩶 Silver Cased', severity: 'excellent', emoji: '🩶' },
        { value: 'good', label_th: '👍 สภาพดี สวยน่าเก็บ', label_en: '👍 Good, Collection Worthy', severity: 'good', emoji: '👍' },
        { value: 'minor_wear', label_th: '⚠️ มีรอยครูด/สึกบ้าง', label_en: '⚠️ Minor Scratches/Wear', severity: 'fair', emoji: '⚠️' },
        { value: 'restored', label_th: '🔄 ผ่านการซ่อม/ล้าง', label_en: '🔄 Restored/Cleaned', severity: 'fair', emoji: '🔄' },
        { value: 'damaged', label_th: '⛔ ชำรุด/บิ่น/แตก', label_en: '⛔ Damaged/Chipped', severity: 'poor', emoji: '⛔' },
    ],
    additionalFields: [
        {
            key: 'certificate',
            label_th: 'ใบรับรอง',
            label_en: 'Certificate',
            type: 'select',
            options: [
                { value: 'has_cert', label_th: '📜 มีใบรับรอง/ใบบัตร', label_en: '📜 Has Certificate' },
                { value: 'no_cert', label_th: '❌ ไม่มีใบรับรอง', label_en: '❌ No Certificate' },
            ]
        },
    ]
}

// ============================================
// 10. PETS (ID: 10)
// ============================================
const PET_CONDITIONS: CategoryConditions = {
    categoryId: 10,
    categoryName: 'Pets',
    conditions: [
        { value: 'healthy', label_th: '💪 สุขภาพดี แข็งแรง', label_en: '💪 Healthy & Active', severity: 'excellent', emoji: '💪' },
        { value: 'vaccinated', label_th: '💉 ฉีดวัคซีนครบ', label_en: '💉 Fully Vaccinated', severity: 'excellent', emoji: '💉' },
        { value: 'neutered', label_th: '✂️ ทำหมันแล้ว', label_en: '✂️ Neutered/Spayed', severity: 'good', emoji: '✂️' },
        { value: 'needs_care', label_th: '🏥 ต้องดูแลเป็นพิเศษ', label_en: '🏥 Special Care Needed', severity: 'fair', emoji: '🏥' },
    ],
    additionalFields: [
        {
            key: 'vaccination',
            label_th: 'วัคซีน',
            label_en: 'Vaccination',
            type: 'select',
            options: [
                { value: 'complete', label_th: '✅ ฉีดครบ พร้อมสมุด', label_en: '✅ Complete with Records' },
                { value: 'partial', label_th: '🟡 ฉีดบางตัว', label_en: '🟡 Partial' },
                { value: 'none', label_th: '❌ ยังไม่ได้ฉีด', label_en: '❌ Not Vaccinated' },
            ]
        },
        {
            key: 'pedigree',
            label_th: 'ใบเพ็ดดีกรี',
            label_en: 'Pedigree',
            type: 'select',
            options: [
                { value: 'has_pedigree', label_th: '📜 มีใบเพ็ดดีกรี', label_en: '📜 Has Pedigree' },
                { value: 'no_pedigree', label_th: '❌ ไม่มี', label_en: '❌ No Pedigree' },
            ]
        },
    ]
}

// ============================================
// 14. BEAUTY & COSMETICS (ID: 14)
// ============================================
const BEAUTY_CONDITIONS: CategoryConditions = {
    categoryId: 14,
    categoryName: 'Beauty & Cosmetics',
    conditions: [
        { value: 'new_sealed', label_th: '📦 ใหม่ ยังไม่แกะซีล', label_en: '📦 New, Sealed', severity: 'excellent', emoji: '📦' },
        { value: 'new_opened', label_th: '✨ ใหม่ แกะแล้ว ไม่ได้ใช้', label_en: '✨ New, Opened Unused', severity: 'excellent', emoji: '✨' },
        { value: 'used_10', label_th: '👍 ใช้ไป ~10%', label_en: '👍 Used ~10%', severity: 'good', emoji: '👍' },
        { value: 'used_30', label_th: '✅ ใช้ไป ~30%', label_en: '✅ Used ~30%', severity: 'good', emoji: '✅' },
        { value: 'used_50', label_th: '⚠️ ใช้ไปครึ่งหนึ่ง', label_en: '⚠️ Half Used', severity: 'fair', emoji: '⚠️' },
        { value: 'used_70', label_th: '🟡 ใช้ไป ~70%', label_en: '🟡 Used ~70%', severity: 'fair', emoji: '🟡' },
        { value: 'almost_empty', label_th: '⚠️ เหลือนิดเดียว', label_en: '⚠️ Almost Empty', severity: 'poor', emoji: '⚠️' },
    ],
    additionalFields: [
        {
            key: 'expiry_status',
            label_th: 'วันหมดอายุ',
            label_en: 'Expiry Status',
            type: 'select',
            options: [
                { value: 'fresh', label_th: '✅ ยังไม่หมดอายุ (เหลือ > 1 ปี)', label_en: '✅ Fresh (> 1 year left)' },
                { value: 'ok', label_th: '👍 เหลือ 6 เดือน - 1 ปี', label_en: '👍 6 months - 1 year left' },
                { value: 'expiring', label_th: '⚠️ ใกล้หมดอายุ (< 6 เดือน)', label_en: '⚠️ Expiring Soon (< 6 months)' },
                { value: 'expired', label_th: '⛔ หมดอายุแล้ว', label_en: '⛔ Expired' },
            ]
        },
    ]
}

// ============================================
// 15. BABY & KIDS (ID: 15)
// ============================================
const KIDS_CONDITIONS: CategoryConditions = {
    categoryId: 15,
    categoryName: 'Baby & Kids',
    conditions: [
        { value: 'new_tag', label_th: '🏷️ ใหม่ ยังไม่แกะป้าย', label_en: '🏷️ New with Tags', severity: 'excellent', emoji: '🏷️' },
        { value: 'like_new', label_th: '✨ เหมือนใหม่ ใช้ 1-2 ครั้ง', label_en: '✨ Like New, Used 1-2 Times', severity: 'excellent', emoji: '✨' },
        { value: 'good', label_th: '👍 สภาพดี สะอาด', label_en: '👍 Good, Clean', severity: 'good', emoji: '👍' },
        { value: 'fair', label_th: '⚠️ มีร่องรอยใช้งาน', label_en: '⚠️ Fair, Visible Wear', severity: 'fair', emoji: '⚠️' },
        { value: 'stained', label_th: '💧 มีคราบบ้าง', label_en: '💧 Some Stains', severity: 'fair', emoji: '💧' },
    ],
    additionalFields: [
        {
            key: 'safety',
            label_th: 'มาตรฐานความปลอดภัย',
            label_en: 'Safety Standards',
            type: 'select',
            options: [
                { value: 'certified', label_th: '✅ ผ่านมาตรฐาน มอก./CE', label_en: '✅ Certified (TIS/CE)' },
                { value: 'not_certified', label_th: '❓ ไม่ทราบ', label_en: '❓ Unknown' },
            ]
        },
    ]
}

// ============================================
// 16. BOOKS & EDUCATION (ID: 16)
// ============================================
const BOOK_CONDITIONS: CategoryConditions = {
    categoryId: 16,
    categoryName: 'Books & Education',
    conditions: [
        { value: 'new', label_th: '📚 ใหม่ ไม่เคยเปิดอ่าน', label_en: '📚 New, Unread', severity: 'excellent', emoji: '📚' },
        { value: 'like_new', label_th: '✨ เหมือนใหม่ ไม่มีรอยขีด', label_en: '✨ Like New, No Marks', severity: 'excellent', emoji: '✨' },
        { value: 'good', label_th: '👍 สภาพดี ไม่มีรอยขีดเขียน', label_en: '👍 Good, No Writing', severity: 'good', emoji: '👍' },
        { value: 'highlighted', label_th: '🖍️ มีไฮไลท์/ขีดเส้น', label_en: '🖍️ Highlighted', severity: 'fair', emoji: '🖍️' },
        { value: 'notes', label_th: '✍️ มีจดโน้ต', label_en: '✍️ Has Notes', severity: 'fair', emoji: '✍️' },
        { value: 'worn', label_th: '📖 สันหักงอ/มีรอยเปื้อน', label_en: '📖 Worn/Stained', severity: 'poor', emoji: '📖' },
    ],
    additionalFields: []
}

// ============================================
// 12. SPORTS & TRAVEL (ID: 12)
// ============================================
const SPORTS_CONDITIONS: CategoryConditions = {
    categoryId: 12,
    categoryName: 'Sports & Travel',
    conditions: [
        { value: 'new', label_th: '📦 ใหม่ ยังไม่ได้ใช้', label_en: '📦 New, Unused', severity: 'excellent', emoji: '📦' },
        { value: 'like_new', label_th: '✨ เหมือนใหม่ ใช้ 1-2 ครั้ง', label_en: '✨ Like New, Used 1-2 Times', severity: 'excellent', emoji: '✨' },
        { value: 'good', label_th: '👍 สภาพดี ใช้งานได้ปกติ', label_en: '👍 Good, Works Well', severity: 'good', emoji: '👍' },
        { value: 'worn', label_th: '⚠️ มีร่องรอยใช้งาน', label_en: '⚠️ Visible Wear', severity: 'fair', emoji: '⚠️' },
        { value: 'needs_repair', label_th: '🔧 ต้องซ่อม/เปลี่ยนอะไหล่', label_en: '🔧 Needs Repair', severity: 'poor', emoji: '🔧' },
    ],
    additionalFields: []
}

// ============================================
// 13. HOME & GARDEN (ID: 13)
// ============================================
const HOME_CONDITIONS: CategoryConditions = {
    categoryId: 13,
    categoryName: 'Home & Garden',
    conditions: [
        { value: 'new', label_th: '📦 ใหม่ ยังไม่แกะ', label_en: '📦 New, Unboxed', severity: 'excellent', emoji: '📦' },
        { value: 'like_new', label_th: '✨ เหมือนใหม่ ไม่เคยใช้', label_en: '✨ Like New, Never Used', severity: 'excellent', emoji: '✨' },
        { value: 'good', label_th: '👍 สภาพดี', label_en: '👍 Good Condition', severity: 'good', emoji: '👍' },
        { value: 'fair', label_th: '⚠️ มีร่องรอยใช้งาน', label_en: '⚠️ Fair, Visible Wear', severity: 'fair', emoji: '⚠️' },
        { value: 'needs_assembly', label_th: '🔧 ยังไม่ประกอบ/ต้องประกอบ', label_en: '🔧 Needs Assembly', severity: 'good', emoji: '🔧' },
        { value: 'damaged', label_th: '⛔ มีความเสียหาย', label_en: '⛔ Damaged', severity: 'poor', emoji: '⛔' },
    ],
    additionalFields: []
}

// ============================================
// 2. REAL ESTATE (ID: 2) - Thai Property Market
// ============================================
const REAL_ESTATE_CONDITIONS: CategoryConditions = {
    categoryId: 2,
    categoryName: 'Real Estate',
    conditions: [
        { value: 'new', label_th: '🏗️ สร้างใหม่ ยังไม่เคยเข้าอยู่', label_en: '🏗️ New Build, Never Occupied', severity: 'excellent', emoji: '🏗️' },
        { value: 'renovated', label_th: '🔄 รีโนเวทใหม่', label_en: '🔄 Newly Renovated', severity: 'excellent', emoji: '🔄' },
        { value: 'move_in', label_th: '✅ พร้อมเข้าอยู่', label_en: '✅ Move-in Ready', severity: 'good', emoji: '✅' },
        { value: 'good', label_th: '👍 สภาพดี', label_en: '👍 Good Condition', severity: 'good', emoji: '👍' },
        { value: 'needs_renovation', label_th: '🔧 ต้องปรับปรุง', label_en: '🔧 Needs Renovation', severity: 'fair', emoji: '🔧' },
        { value: 'under_construction', label_th: '🚧 กำลังก่อสร้าง', label_en: '🚧 Under Construction', severity: 'fair', emoji: '🚧' },
        { value: 'vacant_land', label_th: '🌿 ที่ดินเปล่า', label_en: '🌿 Vacant Land', severity: 'good', emoji: '🌿' },
    ],
    additionalFields: []
    // Real Estate fields are now defined in REAL_ESTATE_TEMPLATE (world-class-description-engine.ts)
}

// ============================================
// MASTER REGISTRY
// ============================================
export const CATEGORY_CONDITIONS: Record<number, CategoryConditions> = {
    1: AUTOMOTIVE_CONDITIONS,
    2: REAL_ESTATE_CONDITIONS,
    3: MOBILE_CONDITIONS,
    4: COMPUTER_CONDITIONS,
    5: APPLIANCE_CONDITIONS,
    6: FASHION_CONDITIONS,
    7: GAMING_CONDITIONS,
    8: CAMERA_CONDITIONS,
    9: AMULET_CONDITIONS,
    10: PET_CONDITIONS,
    12: SPORTS_CONDITIONS,
    13: HOME_CONDITIONS,
    14: BEAUTY_CONDITIONS,
    15: KIDS_CONDITIONS,
    16: BOOK_CONDITIONS,
    // Subcategory overrides
    603: LUXURY_CONDITIONS, // Bags
    605: LUXURY_CONDITIONS, // Watches
}

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Get condition options for a category
 */
export function getCategoryConditions(categoryId: number, subcategoryId?: number): CategoryConditions {
    // Check subcategory first
    if (subcategoryId && CATEGORY_CONDITIONS[subcategoryId]) {
        return CATEGORY_CONDITIONS[subcategoryId]
    }
    // Fall back to category
    return CATEGORY_CONDITIONS[categoryId] || DEFAULT_CONDITIONS
}

/**
 * Get condition label by value
 */
export function getConditionLabel(
    categoryId: number,
    conditionValue: string,
    lang: 'th' | 'en'
): string {
    const conditions = getCategoryConditions(categoryId)
    const condition = conditions.conditions.find(c => c.value === conditionValue)
    if (condition) {
        return lang === 'th' ? condition.label_th : condition.label_en
    }
    return conditionValue
}

/**
 * Get additional fields for condition section
 */
export function getConditionAdditionalFields(categoryId: number, subcategoryId?: number) {
    const conditions = getCategoryConditions(categoryId, subcategoryId)
    return conditions.additionalFields || []
}

// Default conditions for uncategorized items
const DEFAULT_CONDITIONS: CategoryConditions = {
    categoryId: 0,
    categoryName: 'General',
    conditions: [
        { value: 'new', label_th: '📦 ใหม่', label_en: '📦 New', severity: 'excellent', emoji: '📦' },
        { value: 'like_new', label_th: '✨ เหมือนใหม่', label_en: '✨ Like New', severity: 'excellent', emoji: '✨' },
        { value: 'good', label_th: '👍 สภาพดี', label_en: '👍 Good', severity: 'good', emoji: '👍' },
        { value: 'fair', label_th: '⚠️ พอใช้', label_en: '⚠️ Fair', severity: 'fair', emoji: '⚠️' },
        { value: 'used', label_th: '🔄 มือสอง', label_en: '🔄 Used', severity: 'fair', emoji: '🔄' },
    ],
    additionalFields: []
}

export { DEFAULT_CONDITIONS }
