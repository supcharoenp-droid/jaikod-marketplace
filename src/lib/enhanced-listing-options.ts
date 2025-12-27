/**
 * JAIKOD ENHANCED LISTING OPTIONS
 * 
 * ระบบตัวเลือกสำหรับรายละเอียดเพิ่มเติมและกลุ่มเป้าหมาย
 * - Dropdown/Multiselect options แทน free text
 * - Smart Target Audience พร้อม context
 * - Category-specific options
 * 
 * @version 1.0.0
 * @author JaiKod AI Team
 */

// ============================================
// TYPES
// ============================================

export interface SelectOption {
    value: string
    label_th: string
    label_en: string
    emoji?: string
    description_th?: string  // Context สำหรับผู้ซื้อ
    description_en?: string
}

export interface MultiSelectOption extends SelectOption {
    category?: string  // Group within multiselect
}

export interface TargetAudienceOption {
    id: string
    label_th: string
    label_en: string
    category_th: string  // เช่น "ใช้งานทั่วไป", "งานเฉพาะทาง"
    category_en: string
    description_th: string  // Context ว่าทำไมถึงเหมาะ
    description_en: string
    recommended_for?: {
        minRam?: number       // GB
        minStorage?: number   // GB
        needsGpu?: boolean
        cpuLevel?: 'low' | 'mid' | 'high'
    }
}

export interface WarningOverride {
    id: string
    warning_th: string
    warning_en: string
}

// ============================================
// BATTERY HEALTH OPTIONS (สำหรับ Laptop/Phone)
// ============================================
export const BATTERY_HEALTH_OPTIONS: SelectOption[] = [
    {
        value: '90-100',
        label_th: '90-100% (ดีมาก)',
        label_en: '90-100% (Excellent)',
        emoji: '🔋',
        description_th: 'ใช้งานได้ทั้งวัน 6-8 ชม.',
        description_en: 'All-day use 6-8 hrs'
    },
    {
        value: '80-89',
        label_th: '80-89% (ดี)',
        label_en: '80-89% (Good)',
        emoji: '🔋',
        description_th: 'ใช้งานได้ 4-6 ชม.',
        description_en: '4-6 hours usage'
    },
    {
        value: '70-79',
        label_th: '70-79% (พอใช้)',
        label_en: '70-79% (Fair)',
        emoji: '🪫',
        description_th: 'ใช้งานได้ 2-4 ชม.',
        description_en: '2-4 hours usage'
    },
    {
        value: '60-69',
        label_th: '60-69% (ควรเปลี่ยนเร็วๆ นี้)',
        label_en: '60-69% (Replace soon)',
        emoji: '🪫',
        description_th: 'ต้องชาร์จบ่อย',
        description_en: 'Needs frequent charging'
    },
    {
        value: 'below-60',
        label_th: 'ต่ำกว่า 60% (ควรเปลี่ยนแบต)',
        label_en: 'Below 60% (Needs replacement)',
        emoji: '⚠️',
        description_th: 'แนะนำให้เปลี่ยนแบตใหม่',
        description_en: 'Battery replacement recommended'
    },
    {
        value: 'unknown',
        label_th: 'ไม่ทราบ/ไม่ได้ตรวจ',
        label_en: 'Unknown/Not checked',
        emoji: '❓',
        description_th: '',
        description_en: ''
    },
]

// ============================================
// DEFECTS OPTIONS (ตำหนิ/ข้อบกพร่อง)
// ============================================

// สำหรับ Laptop/Computer
export const LAPTOP_DEFECT_OPTIONS: MultiSelectOption[] = [
    // ไม่มีตำหนิ
    {
        value: 'none',
        label_th: 'ไม่มีตำหนิ ✨',
        label_en: 'No defects ✨',
        emoji: '✨',
        category: 'perfect'
    },
    // รอยขีดข่วน
    {
        value: 'minor_scratches',
        label_th: 'รอยขีดข่วนเล็กน้อย',
        label_en: 'Minor scratches',
        emoji: '📝',
        category: 'cosmetic'
    },
    {
        value: 'noticeable_scratches',
        label_th: 'รอยขีดข่วนเห็นได้ชัด',
        label_en: 'Noticeable scratches',
        emoji: '📝',
        category: 'cosmetic'
    },
    // รอยบุบ
    {
        value: 'minor_dent',
        label_th: 'รอยบุบ/กระแทกเล็กน้อย',
        label_en: 'Minor dent',
        emoji: '💢',
        category: 'cosmetic'
    },
    // หน้าจอ
    {
        value: 'dead_pixel',
        label_th: 'หน้าจอมี Dead Pixel',
        label_en: 'Dead pixels on screen',
        emoji: '🖥️',
        category: 'screen'
    },
    {
        value: 'screen_spot',
        label_th: 'หน้าจอมีจุดด่าง/สี',
        label_en: 'Screen has spots/color issues',
        emoji: '🖥️',
        category: 'screen'
    },
    // คีย์บอร์ด
    {
        value: 'key_wear',
        label_th: 'ปุ่มคีย์บอร์ดมีรอยสึก',
        label_en: 'Keyboard key wear',
        emoji: '⌨️',
        category: 'keyboard'
    },
    {
        value: 'key_malfunction',
        label_th: 'ปุ่มบางปุ่มไม่ทำงาน',
        label_en: 'Some keys not working',
        emoji: '⌨️',
        category: 'keyboard'
    },
    // พัดลม/เสียง
    {
        value: 'fan_noise',
        label_th: 'พัดลมมีเสียงดัง',
        label_en: 'Fan is noisy',
        emoji: '🌀',
        category: 'hardware'
    },
    // ลำโพง
    {
        value: 'speaker_issue',
        label_th: 'ลำโพงมีปัญหา',
        label_en: 'Speaker issues',
        emoji: '🔊',
        category: 'hardware'
    },
    // พอร์ต
    {
        value: 'port_issue',
        label_th: 'USB/พอร์ตบางตัวมีปัญหา',
        label_en: 'Some ports not working',
        emoji: '🔌',
        category: 'hardware'
    },
    // แบต
    {
        value: 'battery_weak',
        label_th: 'แบตเตอรี่เสื่อม',
        label_en: 'Battery degraded',
        emoji: '🪫',
        category: 'battery'
    },
    // อื่นๆ
    {
        value: 'other',
        label_th: 'อื่นๆ (ระบุด้านล่าง)',
        label_en: 'Other (specify below)',
        emoji: '📝',
        category: 'other'
    },
]

// สำหรับ Mobile Phone
export const PHONE_DEFECT_OPTIONS: MultiSelectOption[] = [
    {
        value: 'none',
        label_th: 'ไม่มีตำหนิ ✨',
        label_en: 'No defects ✨',
        emoji: '✨',
        category: 'perfect'
    },
    {
        value: 'minor_scratches',
        label_th: 'รอยขีดข่วนเล็กน้อย (ติดฟิล์มหาย)',
        label_en: 'Minor scratches (with film)',
        emoji: '📝',
        category: 'cosmetic'
    },
    {
        value: 'back_scratches',
        label_th: 'หลังเครื่องมีรอย',
        label_en: 'Back has scratches',
        emoji: '📝',
        category: 'cosmetic'
    },
    {
        value: 'frame_scratches',
        label_th: 'ขอบเครื่องมีรอย',
        label_en: 'Frame scratches',
        emoji: '📝',
        category: 'cosmetic'
    },
    {
        value: 'screen_crack',
        label_th: 'หน้าจอร้าว/แตก',
        label_en: 'Screen cracked',
        emoji: '💔',
        category: 'screen'
    },
    {
        value: 'dead_pixel',
        label_th: 'หน้าจอมี Dead Pixel',
        label_en: 'Dead pixels',
        emoji: '🖥️',
        category: 'screen'
    },
    {
        value: 'burn_in',
        label_th: 'หน้าจอมีรอยเบิร์น (Burn-in)',
        label_en: 'Screen burn-in',
        emoji: '🔥',
        category: 'screen'
    },
    {
        value: 'button_issue',
        label_th: 'ปุ่มกด/ปุ่มข้างมีปัญหา',
        label_en: 'Button issues',
        emoji: '🔘',
        category: 'hardware'
    },
    {
        value: 'speaker_issue',
        label_th: 'ลำโพงมีปัญหา',
        label_en: 'Speaker issues',
        emoji: '🔊',
        category: 'hardware'
    },
    {
        value: 'camera_issue',
        label_th: 'กล้องมีปัญหา',
        label_en: 'Camera issues',
        emoji: '📷',
        category: 'hardware'
    },
    {
        value: 'charging_issue',
        label_th: 'ช่องชาร์จมีปัญหา',
        label_en: 'Charging port issues',
        emoji: '🔌',
        category: 'hardware'
    },
    {
        value: 'faceid_issue',
        label_th: 'Face ID/ลายนิ้วมือไม่ทำงาน',
        label_en: 'Face ID/Fingerprint not working',
        emoji: '👆',
        category: 'hardware'
    },
    {
        value: 'battery_weak',
        label_th: 'แบตเตอรี่เสื่อม',
        label_en: 'Battery degraded',
        emoji: '🪫',
        category: 'battery'
    },
    {
        value: 'other',
        label_th: 'อื่นๆ (ระบุด้านล่าง)',
        label_en: 'Other (specify below)',
        emoji: '📝',
        category: 'other'
    },
]

// ============================================
// WARRANTY OPTIONS (ประกัน)
// ============================================
export const WARRANTY_OPTIONS: SelectOption[] = [
    {
        value: 'expired',
        label_th: 'หมดประกันแล้ว',
        label_en: 'Warranty expired',
        emoji: '❌'
    },
    {
        value: 'less_3m',
        label_th: 'เหลือไม่ถึง 3 เดือน',
        label_en: 'Less than 3 months left',
        emoji: '⏰'
    },
    {
        value: '3_6m',
        label_th: 'เหลือ 3-6 เดือน',
        label_en: '3-6 months left',
        emoji: '📆'
    },
    {
        value: '6_12m',
        label_th: 'เหลือ 6-12 เดือน',
        label_en: '6-12 months left',
        emoji: '✅'
    },
    {
        value: 'more_1y',
        label_th: 'เหลือมากกว่า 1 ปี',
        label_en: 'More than 1 year left',
        emoji: '🏆'
    },
    {
        value: 'unknown',
        label_th: 'ไม่ทราบ',
        label_en: 'Unknown',
        emoji: '❓'
    },
]

// ============================================
// USAGE AGE OPTIONS (อายุการใช้งาน)
// ============================================
export const USAGE_AGE_OPTIONS: SelectOption[] = [
    {
        value: 'new',
        label_th: 'ยังไม่เคยใช้ (แกะกล่อง)',
        label_en: 'Never used (unboxed)',
        emoji: '🆕'
    },
    {
        value: 'less_3m',
        label_th: 'น้อยกว่า 3 เดือน',
        label_en: 'Less than 3 months',
        emoji: '✨'
    },
    {
        value: '3_6m',
        label_th: '3-6 เดือน',
        label_en: '3-6 months',
        emoji: '📆'
    },
    {
        value: '6_12m',
        label_th: '6 เดือน - 1 ปี',
        label_en: '6 months - 1 year',
        emoji: '📆'
    },
    {
        value: '1_2y',
        label_th: '1-2 ปี',
        label_en: '1-2 years',
        emoji: '📅'
    },
    {
        value: '2_3y',
        label_th: '2-3 ปี',
        label_en: '2-3 years',
        emoji: '📅'
    },
    {
        value: 'more_3y',
        label_th: 'มากกว่า 3 ปี',
        label_en: 'More than 3 years',
        emoji: '📚'
    },
]

// ============================================
// ORIGINAL BOX/RECEIPT OPTIONS (กล่อง/ใบเสร็จ)
// ============================================
export const ORIGINAL_BOX_OPTIONS: SelectOption[] = [
    {
        value: 'complete',
        label_th: 'มีกล่องครบ + อุปกรณ์ครบ',
        label_en: 'Complete box + all accessories',
        emoji: '📦'
    },
    {
        value: 'box_only',
        label_th: 'มีกล่อง (อุปกรณ์ไม่ครบ)',
        label_en: 'Box only (missing accessories)',
        emoji: '📦'
    },
    {
        value: 'no_box',
        label_th: 'ไม่มีกล่อง',
        label_en: 'No box',
        emoji: '❌'
    },
]

export const RECEIPT_OPTIONS: SelectOption[] = [
    {
        value: 'have_receipt',
        label_th: 'มีใบเสร็จ/ใบกำกับภาษี',
        label_en: 'Have receipt/invoice',
        emoji: '🧾'
    },
    {
        value: 'have_warranty_card',
        label_th: 'มีใบรับประกัน',
        label_en: 'Have warranty card',
        emoji: '📜'
    },
    {
        value: 'both',
        label_th: 'มีทั้งใบเสร็จและใบรับประกัน',
        label_en: 'Have both receipt and warranty',
        emoji: '✅'
    },
    {
        value: 'none',
        label_th: 'ไม่มี',
        label_en: 'None',
        emoji: '❌'
    },
]

// ============================================
// SELLING REASON OPTIONS (เหตุผลที่ขาย)
// ============================================
export const SELLING_REASON_OPTIONS: SelectOption[] = [
    {
        value: 'upgrade',
        label_th: 'ซื้อเครื่องใหม่/อัพเกรด',
        label_en: 'Bought new/Upgrading',
        emoji: '⬆️'
    },
    {
        value: 'rarely_used',
        label_th: 'ใช้น้อย/ไม่ค่อยได้ใช้',
        label_en: 'Rarely used',
        emoji: '🕐'
    },
    {
        value: 'gift',
        label_th: 'ได้รับเป็นของขวัญ',
        label_en: 'Received as gift',
        emoji: '🎁'
    },
    {
        value: 'moving',
        label_th: 'ย้ายบ้าน/ต่างประเทศ',
        label_en: 'Moving/Relocating',
        emoji: '🏠'
    },
    {
        value: 'need_money',
        label_th: 'ต้องการเงินด่วน',
        label_en: 'Need quick cash',
        emoji: '💸'
    },
    {
        value: 'other',
        label_th: 'อื่นๆ',
        label_en: 'Other',
        emoji: '📝'
    },
]

// ============================================
// SMART TARGET AUDIENCE (เหมาะสำหรับ)
// ============================================

// สำหรับ Laptop/Computer
export const LAPTOP_TARGET_AUDIENCE: TargetAudienceOption[] = [
    // ใช้งานทั่วไป
    {
        id: 'student',
        label_th: 'นักศึกษา',
        label_en: 'Students',
        category_th: '📚 ใช้งานทั่วไป',
        category_en: '📚 General Use',
        description_th: 'ทำงานเอกสาร, รายงาน, เรียนออนไลน์',
        description_en: 'Documents, reports, online classes',
        recommended_for: { minRam: 4, cpuLevel: 'low' }
    },
    {
        id: 'office_worker',
        label_th: 'พนักงานออฟฟิศ',
        label_en: 'Office Workers',
        category_th: '📚 ใช้งานทั่วไป',
        category_en: '📚 General Use',
        description_th: 'Excel, Email, ประชุม Zoom/Meet',
        description_en: 'Excel, Email, Zoom/Meet meetings',
        recommended_for: { minRam: 8, cpuLevel: 'low' }
    },
    {
        id: 'home_use',
        label_th: 'ใช้งานที่บ้าน',
        label_en: 'Home Use',
        category_th: '📚 ใช้งานทั่วไป',
        category_en: '📚 General Use',
        description_th: 'ดูหนัง, ท่องเน็ต, โซเชียล',
        description_en: 'Movies, browsing, social media',
        recommended_for: { minRam: 4, cpuLevel: 'low' }
    },
    {
        id: 'senior',
        label_th: 'ผู้สูงอายุ',
        label_en: 'Seniors',
        category_th: '📚 ใช้งานทั่วไป',
        category_en: '📚 General Use',
        description_th: 'ใช้งานง่าย, เบา, พอดีมือ',
        description_en: 'Easy to use, light, comfortable',
        recommended_for: { minRam: 4, cpuLevel: 'low' }
    },
    // งานเฉพาะทาง
    {
        id: 'programmer',
        label_th: 'โปรแกรมเมอร์',
        label_en: 'Programmers',
        category_th: '💻 งานเฉพาะทาง',
        category_en: '💻 Professional',
        description_th: 'เขียนโค้ด, รัน IDE, Docker',
        description_en: 'Coding, IDE, Docker',
        recommended_for: { minRam: 16, minStorage: 256, cpuLevel: 'mid' }
    },
    {
        id: 'data_analyst',
        label_th: 'นักวิเคราะห์ข้อมูล',
        label_en: 'Data Analysts',
        category_th: '💻 งานเฉพาะทาง',
        category_en: '💻 Professional',
        description_th: 'Excel, Python, Power BI',
        description_en: 'Excel, Python, Power BI',
        recommended_for: { minRam: 16, cpuLevel: 'mid' }
    },
    {
        id: 'accountant',
        label_th: 'นักบัญชี',
        label_en: 'Accountants',
        category_th: '💻 งานเฉพาะทาง',
        category_en: '💻 Professional',
        description_th: 'Excel ขั้นสูง, โปรแกรมบัญชี',
        description_en: 'Advanced Excel, accounting software',
        recommended_for: { minRam: 8, cpuLevel: 'low' }
    },
    {
        id: 'teacher',
        label_th: 'ครู/อาจารย์',
        label_en: 'Teachers',
        category_th: '💻 งานเฉพาะทาง',
        category_en: '💻 Professional',
        description_th: 'สอนออนไลน์, ทำสื่อการสอน',
        description_en: 'Online teaching, creating materials',
        recommended_for: { minRam: 8, cpuLevel: 'low' }
    },
    // สายครีเอทีฟ
    {
        id: 'designer_basic',
        label_th: 'นักออกแบบ (งานเบา)',
        label_en: 'Designers (Light work)',
        category_th: '🎨 สายครีเอทีฟ',
        category_en: '🎨 Creative',
        description_th: 'Canva, Figma, Photoshop เบา',
        description_en: 'Canva, Figma, Light Photoshop',
        recommended_for: { minRam: 8, cpuLevel: 'mid' }
    },
    {
        id: 'designer_pro',
        label_th: 'นักออกแบบมืออาชีพ',
        label_en: 'Professional Designers',
        category_th: '🎨 สายครีเอทีฟ',
        category_en: '🎨 Creative',
        description_th: 'Adobe Suite, Illustrator, InDesign',
        description_en: 'Adobe Suite, heavy design work',
        recommended_for: { minRam: 16, minStorage: 512, cpuLevel: 'high', needsGpu: true }
    },
    {
        id: 'video_editor_basic',
        label_th: 'ตัดต่อวิดีโอ (เบื้องต้น)',
        label_en: 'Video Editing (Basic)',
        category_th: '🎨 สายครีเอทีฟ',
        category_en: '🎨 Creative',
        description_th: 'ตัดต่อ 1080p, YouTube, TikTok',
        description_en: '1080p editing, YouTube, TikTok',
        recommended_for: { minRam: 16, minStorage: 512, cpuLevel: 'mid', needsGpu: true }
    },
    {
        id: 'video_editor_pro',
        label_th: 'ตัดต่อวิดีโอมืออาชีพ',
        label_en: 'Professional Video Editor',
        category_th: '🎨 สายครีเอทีฟ',
        category_en: '🎨 Creative',
        description_th: 'ตัดต่อ 4K, Premiere Pro, DaVinci',
        description_en: '4K editing, Premiere, DaVinci',
        recommended_for: { minRam: 32, minStorage: 1024, cpuLevel: 'high', needsGpu: true }
    },
    {
        id: 'streamer',
        label_th: 'สตรีมเมอร์',
        label_en: 'Streamers',
        category_th: '🎨 สายครีเอทีฟ',
        category_en: '🎨 Creative',
        description_th: 'OBS, สตรีม, ทำคอนเทนต์',
        description_en: 'OBS, streaming, content creation',
        recommended_for: { minRam: 16, cpuLevel: 'mid', needsGpu: true }
    },
    // เกม
    {
        id: 'gamer_light',
        label_th: 'เกมเบา (LoL, Valorant)',
        label_en: 'Light Gaming (LoL, Valorant)',
        category_th: '🎮 เกม',
        category_en: '🎮 Gaming',
        description_th: 'เกม Esports ทั่วไป',
        description_en: 'General Esports games',
        recommended_for: { minRam: 8, cpuLevel: 'mid' }
    },
    {
        id: 'gamer_mid',
        label_th: 'เกมกลาง (GTA, Fortnite)',
        label_en: 'Mid Gaming (GTA, Fortnite)',
        category_th: '🎮 เกม',
        category_en: '🎮 Gaming',
        description_th: 'เกม AAA ปานกลาง',
        description_en: 'Mid-tier AAA games',
        recommended_for: { minRam: 16, cpuLevel: 'mid', needsGpu: true }
    },
    {
        id: 'gamer_heavy',
        label_th: 'เกมหนัก (Cyberpunk, AAA)',
        label_en: 'Heavy Gaming (Cyberpunk, AAA)',
        category_th: '🎮 เกม',
        category_en: '🎮 Gaming',
        description_th: 'เกม AAA ล่าสุด, Ray Tracing',
        description_en: 'Latest AAA, Ray Tracing',
        recommended_for: { minRam: 32, minStorage: 1024, cpuLevel: 'high', needsGpu: true }
    },
]

// ============================================
// NOT RECOMMENDED FOR (ไม่แนะนำสำหรับ)
// ============================================
export const LAPTOP_NOT_RECOMMENDED: WarningOverride[] = [
    {
        id: 'heavy_gaming',
        warning_th: '⚠️ เกมหนัก 3D (สเปคไม่รองรับ)',
        warning_en: '⚠️ Heavy 3D gaming (specs insufficient)'
    },
    {
        id: '4k_video',
        warning_th: '⚠️ ตัดต่อวิดีโอ 4K (ต้องการ GPU แยก)',
        warning_en: '⚠️ 4K video editing (needs dedicated GPU)'
    },
    {
        id: '3d_render',
        warning_th: '⚠️ Render งาน 3D (ต้องการสเปคสูง)',
        warning_en: '⚠️ 3D rendering (needs high specs)'
    },
    {
        id: 'ai_ml',
        warning_th: '⚠️ งาน AI/Machine Learning (ต้องการ GPU แรง)',
        warning_en: '⚠️ AI/ML work (needs powerful GPU)'
    },
]

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * แนะนำกลุ่มเป้าหมายอัตโนมัติตามสเปคสินค้า
 */
export function suggestTargetAudience(
    specs: {
        ram?: number,       // GB
        storage?: number,   // GB  
        hasGpu?: boolean,
        cpuGeneration?: number,  // เช่น 10 สำหรับ 10th Gen
    },
    lang: 'th' | 'en' = 'th'
): {
    recommended: TargetAudienceOption[],
    notRecommended: WarningOverride[]
} {
    const recommended: TargetAudienceOption[] = []
    const notRecommended: WarningOverride[] = []

    // Determine CPU level based on generation
    let cpuLevel: 'low' | 'mid' | 'high' = 'low'
    if (specs.cpuGeneration) {
        if (specs.cpuGeneration >= 12) cpuLevel = 'high'
        else if (specs.cpuGeneration >= 10) cpuLevel = 'mid'
        else cpuLevel = 'low'
    }

    // Find suitable audiences
    for (const audience of LAPTOP_TARGET_AUDIENCE) {
        const req = audience.recommended_for
        if (!req) {
            recommended.push(audience)
            continue
        }

        let matches = true

        // Check RAM requirement
        if (req.minRam && specs.ram && specs.ram < req.minRam) {
            matches = false
        }

        // Check Storage requirement
        if (req.minStorage && specs.storage && specs.storage < req.minStorage) {
            matches = false
        }

        // Check GPU requirement
        if (req.needsGpu && !specs.hasGpu) {
            matches = false
        }

        // Check CPU level
        if (req.cpuLevel) {
            const levels = ['low', 'mid', 'high']
            if (levels.indexOf(cpuLevel) < levels.indexOf(req.cpuLevel)) {
                matches = false
            }
        }

        if (matches) {
            recommended.push(audience)
        }
    }

    // Determine not recommended
    const ramGB = specs.ram || 0
    const hasGpu = specs.hasGpu || false

    if (ramGB < 16 || !hasGpu) {
        notRecommended.push(LAPTOP_NOT_RECOMMENDED.find(n => n.id === 'heavy_gaming')!)
    }
    if (ramGB < 16 || !hasGpu) {
        notRecommended.push(LAPTOP_NOT_RECOMMENDED.find(n => n.id === '4k_video')!)
    }
    if (ramGB < 32 || !hasGpu) {
        notRecommended.push(LAPTOP_NOT_RECOMMENDED.find(n => n.id === '3d_render')!)
    }
    if (!hasGpu) {
        notRecommended.push(LAPTOP_NOT_RECOMMENDED.find(n => n.id === 'ai_ml')!)
    }

    return {
        recommended: recommended.filter(r => r !== undefined),
        notRecommended: notRecommended.filter(r => r !== undefined)
    }
}

/**
 * Group target audiences by category
 */
export function groupTargetAudienceByCategory(
    audiences: TargetAudienceOption[],
    lang: 'th' | 'en' = 'th'
): Record<string, TargetAudienceOption[]> {
    const grouped: Record<string, TargetAudienceOption[]> = {}

    for (const audience of audiences) {
        const category = lang === 'th' ? audience.category_th : audience.category_en
        if (!grouped[category]) {
            grouped[category] = []
        }
        grouped[category].push(audience)
    }

    return grouped
}

/**
 * Format defects for display
 */
export function formatDefects(
    selectedValues: string[],
    options: MultiSelectOption[],
    lang: 'th' | 'en' = 'th'
): string {
    if (selectedValues.includes('none')) {
        return lang === 'th' ? 'ไม่มีตำหนิ ✨' : 'No defects ✨'
    }

    const labels = selectedValues
        .map(v => options.find(o => o.value === v))
        .filter(o => o !== undefined)
        .map(o => lang === 'th' ? o!.label_th : o!.label_en)

    return labels.join(', ')
}

/**
 * Format battery health for display with context
 */
export function formatBatteryHealth(
    value: string,
    lang: 'th' | 'en' = 'th'
): { label: string; description: string } {
    const option = BATTERY_HEALTH_OPTIONS.find(o => o.value === value)
    if (!option) {
        return { label: value, description: '' }
    }
    return {
        label: `${option.emoji} ${lang === 'th' ? option.label_th : option.label_en}`,
        description: lang === 'th' ? option.description_th || '' : option.description_en || ''
    }
}

// ============================================
// 🚗 AUTOMOTIVE OPTIONS (ID: 1)
// ============================================

export const AUTOMOTIVE_MILEAGE_OPTIONS: SelectOption[] = [
    { value: '0-10k', label_th: '0 - 10,000 km', label_en: '0 - 10,000 km', emoji: '🆕', description_th: 'ไมล์น้อยมาก เหมือนรถใหม่', description_en: 'Very low mileage, like new' },
    { value: '10k-30k', label_th: '10,000 - 30,000 km', label_en: '10,000 - 30,000 km', emoji: '✨', description_th: 'ไมล์น้อย สภาพดี', description_en: 'Low mileage, great condition' },
    { value: '30k-50k', label_th: '30,000 - 50,000 km', label_en: '30,000 - 50,000 km', emoji: '👍', description_th: 'ไมล์ปกติ', description_en: 'Normal mileage' },
    { value: '50k-80k', label_th: '50,000 - 80,000 km', label_en: '50,000 - 80,000 km', emoji: '📆', description_th: 'ใช้งานมาระยะหนึ่ง', description_en: 'Used for a while' },
    { value: '80k-100k', label_th: '80,000 - 100,000 km', label_en: '80,000 - 100,000 km', emoji: '🔧', description_th: 'อาจต้องเช็คสภาพ', description_en: 'May need inspection' },
    { value: '100k+', label_th: 'มากกว่า 100,000 km', label_en: 'Over 100,000 km', emoji: '⚠️', description_th: 'ควรตรวจสภาพก่อนซื้อ', description_en: 'Inspect before buying' },
]

export const AUTOMOTIVE_ACCIDENT_OPTIONS: SelectOption[] = [
    { value: 'none', label_th: 'ไม่เคยชน ✨', label_en: 'Never had accident ✨', emoji: '✨' },
    { value: 'minor', label_th: 'เคยชนเล็กน้อย (ขีดข่วน/บุบ)', label_en: 'Minor accident (scratches/dents)', emoji: '📝' },
    { value: 'moderate', label_th: 'เคยซ่อมกระจก/บังโคลน', label_en: 'Glass/Fender repaired', emoji: '🔧' },
    { value: 'major', label_th: 'เคยชนหนัก (ซ่อมตัวถัง)', label_en: 'Major accident (body work)', emoji: '⚠️' },
    { value: 'flood', label_th: 'เคยถูกน้ำท่วม', label_en: 'Flood damaged', emoji: '🌊' },
]

export const AUTOMOTIVE_SERVICE_OPTIONS: SelectOption[] = [
    { value: 'dealer_full', label_th: 'เข้าศูนย์ตลอด (มีบุ๊คเซอร์วิส)', label_en: 'Full dealer service (with book)', emoji: '🏆' },
    { value: 'dealer_partial', label_th: 'เข้าศูนย์บ้าง', label_en: 'Partial dealer service', emoji: '✅' },
    { value: 'garage', label_th: 'เข้าอู่ทั่วไป', label_en: 'General garage service', emoji: '🔧' },
    { value: 'self', label_th: 'ดูแลเอง', label_en: 'Self maintained', emoji: '🛠️' },
]

export const AUTOMOTIVE_INSURANCE_OPTIONS: SelectOption[] = [
    { value: 'class1', label_th: 'ประกันชั้น 1', label_en: 'Class 1 Insurance', emoji: '🛡️', description_th: 'คุ้มครองทุกกรณี' },
    { value: 'class2', label_th: 'ประกันชั้น 2+', label_en: 'Class 2+ Insurance', emoji: '✅' },
    { value: 'class3', label_th: 'ประกันชั้น 3', label_en: 'Class 3 Insurance', emoji: '📋' },
    { value: 'pml', label_th: 'พ.ร.บ. อย่างเดียว', label_en: 'Compulsory only', emoji: '📝' },
    { value: 'none', label_th: 'ไม่มีประกัน', label_en: 'No insurance', emoji: '❌' },
]

export const AUTOMOTIVE_FINANCE_OPTIONS: SelectOption[] = [
    { value: 'cash', label_th: 'ปลอดภาระ (เงินสด)', label_en: 'Fully paid (Cash)', emoji: '💵' },
    { value: 'transfer_ok', label_th: 'ผ่อนอยู่ ผ่อนต่อได้', label_en: 'Financing - Takeover OK', emoji: '🔄' },
    { value: 'settle_first', label_th: 'ผ่อนอยู่ ต้องปิดก่อนโอน', label_en: 'Settle before transfer', emoji: '💳' },
]

// ทะเบียนรถ 77 จังหวัด (เรียงตามภาค แล้วตามตัวอักษร)
export const AUTOMOTIVE_PLATE_PROVINCE_OPTIONS: SelectOption[] = [
    // กรุงเทพฯ และปริมณฑล
    { value: 'กรุงเทพมหานคร', label_th: 'กรุงเทพมหานคร', label_en: 'Bangkok', emoji: '🏙️' },
    { value: 'นนทบุรี', label_th: 'นนทบุรี', label_en: 'Nonthaburi', emoji: '🚗' },
    { value: 'ปทุมธานี', label_th: 'ปทุมธานี', label_en: 'Pathum Thani', emoji: '🚗' },
    { value: 'สมุทรปราการ', label_th: 'สมุทรปราการ', label_en: 'Samut Prakan', emoji: '🚗' },
    { value: 'นครปฐม', label_th: 'นครปฐม', label_en: 'Nakhon Pathom', emoji: '🚗' },
    { value: 'สมุทรสาคร', label_th: 'สมุทรสาคร', label_en: 'Samut Sakhon', emoji: '🚗' },

    // ภาคกลาง
    { value: 'กาญจนบุรี', label_th: 'กาญจนบุรี', label_en: 'Kanchanaburi', emoji: '🚗' },
    { value: 'ชัยนาท', label_th: 'ชัยนาท', label_en: 'Chai Nat', emoji: '🚗' },
    { value: 'พระนครศรีอยุธยา', label_th: 'พระนครศรีอยุธยา', label_en: 'Phra Nakhon Si Ayutthaya', emoji: '🚗' },
    { value: 'ราชบุรี', label_th: 'ราชบุรี', label_en: 'Ratchaburi', emoji: '🚗' },
    { value: 'ลพบุรี', label_th: 'ลพบุรี', label_en: 'Lopburi', emoji: '🚗' },
    { value: 'สมุทรสงคราม', label_th: 'สมุทรสงคราม', label_en: 'Samut Songkhram', emoji: '🚗' },
    { value: 'สระบุรี', label_th: 'สระบุรี', label_en: 'Saraburi', emoji: '🚗' },
    { value: 'สิงห์บุรี', label_th: 'สิงห์บุรี', label_en: 'Sing Buri', emoji: '🚗' },
    { value: 'สุพรรณบุรี', label_th: 'สุพรรณบุรี', label_en: 'Suphan Buri', emoji: '🚗' },
    { value: 'อ่างทอง', label_th: 'อ่างทอง', label_en: 'Ang Thong', emoji: '🚗' },
    { value: 'เพชรบุรี', label_th: 'เพชรบุรี', label_en: 'Phetchaburi', emoji: '🚗' },
    { value: 'ประจวบคีรีขันธ์', label_th: 'ประจวบคีรีขันธ์', label_en: 'Prachuap Khiri Khan', emoji: '🚗' },

    // ภาคตะวันออก
    { value: 'จันทบุรี', label_th: 'จันทบุรี', label_en: 'Chanthaburi', emoji: '🚗' },
    { value: 'ฉะเชิงเทรา', label_th: 'ฉะเชิงเทรา', label_en: 'Chachoengsao', emoji: '🚗' },
    { value: 'ชลบุรี', label_th: 'ชลบุรี', label_en: 'Chonburi', emoji: '🚗' },
    { value: 'ตราด', label_th: 'ตราด', label_en: 'Trat', emoji: '🚗' },
    { value: 'ปราจีนบุรี', label_th: 'ปราจีนบุรี', label_en: 'Prachinburi', emoji: '🚗' },
    { value: 'ระยอง', label_th: 'ระยอง', label_en: 'Rayong', emoji: '🚗' },
    { value: 'สระแก้ว', label_th: 'สระแก้ว', label_en: 'Sa Kaeo', emoji: '🚗' },

    // ภาคเหนือ
    { value: 'กำแพงเพชร', label_th: 'กำแพงเพชร', label_en: 'Kamphaeng Phet', emoji: '🚗' },
    { value: 'เชียงราย', label_th: 'เชียงราย', label_en: 'Chiang Rai', emoji: '🚗' },
    { value: 'เชียงใหม่', label_th: 'เชียงใหม่', label_en: 'Chiang Mai', emoji: '🚗' },
    { value: 'ตาก', label_th: 'ตาก', label_en: 'Tak', emoji: '🚗' },
    { value: 'นครสวรรค์', label_th: 'นครสวรรค์', label_en: 'Nakhon Sawan', emoji: '🚗' },
    { value: 'น่าน', label_th: 'น่าน', label_en: 'Nan', emoji: '🚗' },
    { value: 'พะเยา', label_th: 'พะเยา', label_en: 'Phayao', emoji: '🚗' },
    { value: 'พิจิตร', label_th: 'พิจิตร', label_en: 'Phichit', emoji: '🚗' },
    { value: 'พิษณุโลก', label_th: 'พิษณุโลก', label_en: 'Phitsanulok', emoji: '🚗' },
    { value: 'เพชรบูรณ์', label_th: 'เพชรบูรณ์', label_en: 'Phetchabun', emoji: '🚗' },
    { value: 'แพร่', label_th: 'แพร่', label_en: 'Phrae', emoji: '🚗' },
    { value: 'แม่ฮ่องสอน', label_th: 'แม่ฮ่องสอน', label_en: 'Mae Hong Son', emoji: '🚗' },
    { value: 'ลำปาง', label_th: 'ลำปาง', label_en: 'Lampang', emoji: '🚗' },
    { value: 'ลำพูน', label_th: 'ลำพูน', label_en: 'Lamphun', emoji: '🚗' },
    { value: 'สุโขทัย', label_th: 'สุโขทัย', label_en: 'Sukhothai', emoji: '🚗' },
    { value: 'อุตรดิตถ์', label_th: 'อุตรดิตถ์', label_en: 'Uttaradit', emoji: '🚗' },
    { value: 'อุทัยธานี', label_th: 'อุทัยธานี', label_en: 'Uthai Thani', emoji: '🚗' },

    // ภาคตะวันออกเฉียงเหนือ (อีสาน)
    { value: 'กาฬสินธุ์', label_th: 'กาฬสินธุ์', label_en: 'Kalasin', emoji: '🚗' },
    { value: 'ขอนแก่น', label_th: 'ขอนแก่น', label_en: 'Khon Kaen', emoji: '🚗' },
    { value: 'ชัยภูมิ', label_th: 'ชัยภูมิ', label_en: 'Chaiyaphum', emoji: '🚗' },
    { value: 'นครพนม', label_th: 'นครพนม', label_en: 'Nakhon Phanom', emoji: '🚗' },
    { value: 'นครราชสีมา', label_th: 'นครราชสีมา', label_en: 'Nakhon Ratchasima', emoji: '🚗' },
    { value: 'บึงกาฬ', label_th: 'บึงกาฬ', label_en: 'Bueng Kan', emoji: '🚗' },
    { value: 'บุรีรัมย์', label_th: 'บุรีรัมย์', label_en: 'Buriram', emoji: '🚗' },
    { value: 'มหาสารคาม', label_th: 'มหาสารคาม', label_en: 'Maha Sarakham', emoji: '🚗' },
    { value: 'มุกดาหาร', label_th: 'มุกดาหาร', label_en: 'Mukdahan', emoji: '🚗' },
    { value: 'ยโสธร', label_th: 'ยโสธร', label_en: 'Yasothon', emoji: '🚗' },
    { value: 'ร้อยเอ็ด', label_th: 'ร้อยเอ็ด', label_en: 'Roi Et', emoji: '🚗' },
    { value: 'เลย', label_th: 'เลย', label_en: 'Loei', emoji: '🚗' },
    { value: 'ศรีสะเกษ', label_th: 'ศรีสะเกษ', label_en: 'Sisaket', emoji: '🚗' },
    { value: 'สกลนคร', label_th: 'สกลนคร', label_en: 'Sakon Nakhon', emoji: '🚗' },
    { value: 'สุรินทร์', label_th: 'สุรินทร์', label_en: 'Surin', emoji: '🚗' },
    { value: 'หนองคาย', label_th: 'หนองคาย', label_en: 'Nong Khai', emoji: '🚗' },
    { value: 'หนองบัวลำภู', label_th: 'หนองบัวลำภู', label_en: 'Nong Bua Lam Phu', emoji: '🚗' },
    { value: 'อำนาจเจริญ', label_th: 'อำนาจเจริญ', label_en: 'Amnat Charoen', emoji: '🚗' },
    { value: 'อุดรธานี', label_th: 'อุดรธานี', label_en: 'Udon Thani', emoji: '🚗' },
    { value: 'อุบลราชธานี', label_th: 'อุบลราชธานี', label_en: 'Ubon Ratchathani', emoji: '🚗' },

    // ภาคใต้
    { value: 'กระบี่', label_th: 'กระบี่', label_en: 'Krabi', emoji: '🚗' },
    { value: 'ชุมพร', label_th: 'ชุมพร', label_en: 'Chumphon', emoji: '🚗' },
    { value: 'ตรัง', label_th: 'ตรัง', label_en: 'Trang', emoji: '🚗' },
    { value: 'นครศรีธรรมราช', label_th: 'นครศรีธรรมราช', label_en: 'Nakhon Si Thammarat', emoji: '🚗' },
    { value: 'นราธิวาส', label_th: 'นราธิวาส', label_en: 'Narathiwat', emoji: '🚗' },
    { value: 'ปัตตานี', label_th: 'ปัตตานี', label_en: 'Pattani', emoji: '🚗' },
    { value: 'พังงา', label_th: 'พังงา', label_en: 'Phang Nga', emoji: '🚗' },
    { value: 'พัทลุง', label_th: 'พัทลุง', label_en: 'Phatthalung', emoji: '🚗' },
    { value: 'ภูเก็ต', label_th: 'ภูเก็ต', label_en: 'Phuket', emoji: '🚗' },
    { value: 'ยะลา', label_th: 'ยะลา', label_en: 'Yala', emoji: '🚗' },
    { value: 'ระนอง', label_th: 'ระนอง', label_en: 'Ranong', emoji: '🚗' },
    { value: 'สงขลา', label_th: 'สงขลา', label_en: 'Songkhla', emoji: '🚗' },
    { value: 'สตูล', label_th: 'สตูล', label_en: 'Satun', emoji: '🚗' },
    { value: 'สุราษฎร์ธานี', label_th: 'สุราษฎร์ธานี', label_en: 'Surat Thani', emoji: '🚗' },
]

export const AUTOMOTIVE_DEFECT_OPTIONS: MultiSelectOption[] = [
    { value: 'none', label_th: 'ไม่มีตำหนิ ✨', label_en: 'No defects ✨', emoji: '✨', category: 'perfect' },
    { value: 'paint_fade', label_th: 'สีซีด/คล้ำ', label_en: 'Paint faded', emoji: '🎨', category: 'exterior' },
    { value: 'scratches', label_th: 'รอยขีดข่วนภายนอก', label_en: 'Exterior scratches', emoji: '📝', category: 'exterior' },
    { value: 'dent', label_th: 'รอยบุบ', label_en: 'Dents', emoji: '💢', category: 'exterior' },
    { value: 'rust', label_th: 'มีจุดสนิม', label_en: 'Rust spots', emoji: '🟤', category: 'exterior' },
    { value: 'ac_issue', label_th: 'แอร์มีปัญหา', label_en: 'A/C issues', emoji: '❄️', category: 'interior' },
    { value: 'seat_wear', label_th: 'เบาะมีรอย/ฉีก', label_en: 'Seat wear/tear', emoji: '🪑', category: 'interior' },
    { value: 'engine_noise', label_th: 'เครื่องมีเสียง', label_en: 'Engine noise', emoji: '🔊', category: 'mechanical' },
    { value: 'gear_issue', label_th: 'เกียร์มีปัญหา', label_en: 'Transmission issues', emoji: '⚙️', category: 'mechanical' },
    { value: 'suspension', label_th: 'ช่วงล่างมีเสียง', label_en: 'Suspension noise', emoji: '🛞', category: 'mechanical' },
    { value: 'other', label_th: 'อื่นๆ (ระบุด้านล่าง)', label_en: 'Other (specify below)', emoji: '📝', category: 'other' },
]

// ============================================
// 📷 CAMERA OPTIONS (ID: 8)
// ============================================

export const CAMERA_SHUTTER_OPTIONS: SelectOption[] = [
    { value: '0-5k', label_th: '0 - 5,000 ครั้ง', label_en: '0 - 5,000 shots', emoji: '🆕', description_th: 'เหมือนใหม่ ใช้น้อยมาก', description_en: 'Like new' },
    { value: '5k-20k', label_th: '5,000 - 20,000 ครั้ง', label_en: '5,000 - 20,000 shots', emoji: '✨', description_th: 'ใช้งานเบา', description_en: 'Light use' },
    { value: '20k-50k', label_th: '20,000 - 50,000 ครั้ง', label_en: '20,000 - 50,000 shots', emoji: '👍', description_th: 'ใช้งานปกติ', description_en: 'Normal use' },
    { value: '50k-100k', label_th: '50,000 - 100,000 ครั้ง', label_en: '50,000 - 100,000 shots', emoji: '📆', description_th: 'ใช้งานมาพอสมควร', description_en: 'Moderate use' },
    { value: '100k+', label_th: 'มากกว่า 100,000 ครั้ง', label_en: 'Over 100,000 shots', emoji: '⚠️', description_th: 'ควรตรวจสอบ Shutter เปลี่ยนหรือไม่', description_en: 'Check if shutter replaced' },
    { value: 'unknown', label_th: 'ไม่ทราบ', label_en: 'Unknown', emoji: '❓' },
]

export const CAMERA_SENSOR_OPTIONS: SelectOption[] = [
    { value: 'clean', label_th: 'เซนเซอร์สะอาด ไม่มีฝุ่น', label_en: 'Clean sensor, no dust', emoji: '✨' },
    { value: 'minor_dust', label_th: 'มีฝุ่นเล็กน้อย (ไม่เห็นในภาพ)', label_en: 'Minor dust (not visible in photos)', emoji: '👍' },
    { value: 'dust', label_th: 'มีฝุ่น (อาจเห็นในภาพบางจุด)', label_en: 'Dust (may show in photos)', emoji: '💨' },
    { value: 'needs_clean', label_th: 'ต้องทำความสะอาด', label_en: 'Needs cleaning', emoji: '🧹' },
]

export const CAMERA_LENS_OPTIONS: SelectOption[] = [
    { value: 'perfect', label_th: 'สะอาด ไม่มีฝ้า/รา/ฝุ่น', label_en: 'Perfect - No haze/fungus/dust', emoji: '✨' },
    { value: 'minor_dust', label_th: 'มีฝุ่นเล็กน้อย', label_en: 'Minor dust', emoji: '💨' },
    { value: 'haze', label_th: 'มีฝ้า (Haze)', label_en: 'Has haze', emoji: '🌫️' },
    { value: 'fungus', label_th: 'มีรา (Fungus)', label_en: 'Has fungus', emoji: '🍄' },
    { value: 'scratches', label_th: 'มีรอยขีดข่วนบนเลนส์', label_en: 'Lens scratches', emoji: '📝' },
]

export const CAMERA_DEFECT_OPTIONS: MultiSelectOption[] = [
    { value: 'none', label_th: 'ไม่มีตำหนิ ✨', label_en: 'No defects ✨', emoji: '✨', category: 'perfect' },
    { value: 'sensor_dust', label_th: 'เซนเซอร์มีฝุ่น', label_en: 'Sensor dust', emoji: '💨', category: 'sensor' },
    { value: 'hot_pixel', label_th: 'มี Hot Pixel', label_en: 'Hot pixels', emoji: '🔥', category: 'sensor' },
    { value: 'body_wear', label_th: 'ตัวเครื่องมีรอยใช้งาน', label_en: 'Body wear', emoji: '📝', category: 'body' },
    { value: 'grip_wear', label_th: 'ยางกริปสึก', label_en: 'Grip rubber wear', emoji: '🤏', category: 'body' },
    { value: 'lcd_scratch', label_th: 'จอ LCD มีรอย', label_en: 'LCD scratches', emoji: '📱', category: 'screen' },
    { value: 'viewfinder', label_th: 'ช่องมองมีปัญหา', label_en: 'Viewfinder issues', emoji: '👁️', category: 'optical' },
    { value: 'focus_issue', label_th: 'ระบบโฟกัสมีปัญหา', label_en: 'Focus issues', emoji: '🎯', category: 'system' },
    { value: 'button_issue', label_th: 'ปุ่มบางปุ่มมีปัญหา', label_en: 'Button issues', emoji: '🔘', category: 'controls' },
    { value: 'other', label_th: 'อื่นๆ (ระบุด้านล่าง)', label_en: 'Other (specify below)', emoji: '📝', category: 'other' },
]

// ============================================
// 👗 FASHION & LUXURY OPTIONS (ID: 6, 603, 605)
// ============================================

export const LUXURY_AUTHENTICITY_OPTIONS: SelectOption[] = [
    { value: 'authentic_verified', label_th: 'ของแท้ 100% (ตรวจสอบแล้ว)', label_en: '100% Authentic (Verified)', emoji: '✅', description_th: 'ผ่านการตรวจสอบจากผู้เชี่ยวชาญ' },
    { value: 'authentic_receipt', label_th: 'ของแท้ มีใบเสร็จจากช็อป', label_en: 'Authentic with shop receipt', emoji: '🧾' },
    { value: 'authentic_card', label_th: 'ของแท้ มีการ์ดรับประกัน', label_en: 'Authentic with authenticity card', emoji: '💳' },
    { value: 'parallel', label_th: 'ของแท้ นำเข้าเอง (Parallel)', label_en: 'Authentic - Parallel import', emoji: '🌍' },
    { value: 'unverified', label_th: 'ยังไม่ได้ตรวจสอบ', label_en: 'Not verified', emoji: '❓' },
]

export const LUXURY_BOX_OPTIONS: SelectOption[] = [
    { value: 'full_set', label_th: 'ครบชุด (กล่อง+การ์ด+ถุงผ้า+ใบเสร็จ)', label_en: 'Full set (Box+Card+Dust bag+Receipt)', emoji: '📦' },
    { value: 'box_card', label_th: 'มีกล่อง+การ์ด', label_en: 'Box + Card', emoji: '📦' },
    { value: 'box_only', label_th: 'มีกล่องอย่างเดียว', label_en: 'Box only', emoji: '📦' },
    { value: 'dust_bag', label_th: 'มีถุงผ้าอย่างเดียว', label_en: 'Dust bag only', emoji: '👝' },
    { value: 'none', label_th: 'ไม่มีอุปกรณ์', label_en: 'No accessories', emoji: '❌' },
]

export const FASHION_DEFECT_OPTIONS: MultiSelectOption[] = [
    { value: 'none', label_th: 'ไม่มีตำหนิ ✨', label_en: 'No defects ✨', emoji: '✨', category: 'perfect' },
    { value: 'scratches', label_th: 'มีรอยขีดข่วน', label_en: 'Scratches', emoji: '📝', category: 'surface' },
    { value: 'color_fade', label_th: 'สีซีด', label_en: 'Color faded', emoji: '🎨', category: 'surface' },
    { value: 'stain', label_th: 'มีคราบ/รอยเปื้อน', label_en: 'Stains', emoji: '💧', category: 'surface' },
    { value: 'leather_crack', label_th: 'หนังแตกลาย', label_en: 'Leather cracking', emoji: '📜', category: 'material' },
    { value: 'leather_peel', label_th: 'หนังลอก', label_en: 'Leather peeling', emoji: '🔄', category: 'material' },
    { value: 'hardware_tarnish', label_th: 'อะไหล่โลหะหมอง', label_en: 'Hardware tarnished', emoji: '🔩', category: 'hardware' },
    { value: 'hardware_scratch', label_th: 'อะไหล่มีรอย', label_en: 'Hardware scratched', emoji: '🔩', category: 'hardware' },
    { value: 'zipper_issue', label_th: 'ซิปมีปัญหา', label_en: 'Zipper issues', emoji: '🔒', category: 'function' },
    { value: 'strap_wear', label_th: 'สายสะพายสึก', label_en: 'Strap wear', emoji: '👜', category: 'strap' },
    { value: 'corner_wear', label_th: 'มุมสึก/ถลอก', label_en: 'Corner wear', emoji: '📐', category: 'edges' },
    { value: 'lining_damage', label_th: 'ซับในมีปัญหา', label_en: 'Lining damage', emoji: '🧵', category: 'interior' },
    { value: 'other', label_th: 'อื่นๆ (ระบุด้านล่าง)', label_en: 'Other (specify below)', emoji: '📝', category: 'other' },
]

// ============================================
// 🎮 GAMING OPTIONS (ID: 7)
// ============================================

export const GAMING_MOD_STATUS_OPTIONS: SelectOption[] = [
    { value: 'original', label_th: 'เครื่องแท้ ไม่เคยแปลง', label_en: 'Original - Never modified', emoji: '✅' },
    { value: 'modded_cfw', label_th: 'แปลงแล้ว (CFW)', label_en: 'Modded (CFW)', emoji: '🔧' },
    { value: 'modded_chip', label_th: 'ติดชิป', label_en: 'Chip modded', emoji: '💾' },
    { value: 'jailbreak', label_th: 'Jailbreak/Homebrew', label_en: 'Jailbroken/Homebrew', emoji: '🔓' },
    { value: 'reverted', label_th: 'เคยแปลง แปลงกลับแล้ว', label_en: 'Was modded, reverted', emoji: '🔄' },
]

export const GAMING_CONTROLLER_OPTIONS: SelectOption[] = [
    { value: 'perfect', label_th: 'สมบูรณ์ ปุ่มกดดี', label_en: 'Perfect - All buttons work', emoji: '✅' },
    { value: 'drift', label_th: 'Analog มี Drift', label_en: 'Analog stick drift', emoji: '🕹️' },
    { value: 'worn', label_th: 'ยางหุ้มสึก', label_en: 'Grip rubber worn', emoji: '📝' },
    { value: 'button_issue', label_th: 'ปุ่มบางปุ่มมีปัญหา', label_en: 'Some button issues', emoji: '🔘' },
    { value: 'needs_replace', label_th: 'ต้องเปลี่ยนใหม่', label_en: 'Needs replacement', emoji: '🔧' },
]

export const GAMING_ACCOUNT_OPTIONS: SelectOption[] = [
    { value: 'included', label_th: 'แถมบัญชี (PSN/Xbox/Nintendo)', label_en: 'Account included', emoji: '🎮' },
    { value: 'games_included', label_th: 'มีเกมในเครื่อง/บัญชี', label_en: 'Games included', emoji: '📀' },
    { value: 'clean', label_th: 'รีเซ็ตโรงงาน พร้อมใช้', label_en: 'Factory reset, ready to use', emoji: '🆕' },
]

export const GAMING_DEFECT_OPTIONS: MultiSelectOption[] = [
    { value: 'none', label_th: 'ไม่มีตำหนิ ✨', label_en: 'No defects ✨', emoji: '✨', category: 'perfect' },
    { value: 'scratch', label_th: 'รอยขีดข่วนภายนอก', label_en: 'Exterior scratches', emoji: '📝', category: 'cosmetic' },
    { value: 'disc_issue', label_th: 'อ่านแผ่นบางแผ่นไม่ได้', label_en: 'Disc read issues', emoji: '📀', category: 'drive' },
    { value: 'no_disc', label_th: 'ช่องใส่แผ่นเสีย', label_en: 'Disc drive broken', emoji: '📀', category: 'drive' },
    { value: 'fan_noise', label_th: 'พัดลมมีเสียงดัง', label_en: 'Fan noise', emoji: '🌀', category: 'hardware' },
    { value: 'overheat', label_th: 'เครื่องร้อนเกินไป', label_en: 'Overheating', emoji: '🔥', category: 'hardware' },
    { value: 'hdmi_issue', label_th: 'พอร์ต HDMI มีปัญหา', label_en: 'HDMI port issues', emoji: '📺', category: 'ports' },
    { value: 'usb_issue', label_th: 'พอร์ต USB มีปัญหา', label_en: 'USB port issues', emoji: '🔌', category: 'ports' },
    { value: 'other', label_th: 'อื่นๆ (ระบุด้านล่าง)', label_en: 'Other (specify below)', emoji: '📝', category: 'other' },
]

// ============================================
// 🏠 HOME APPLIANCES OPTIONS (ID: 5)
// ============================================

export const APPLIANCE_ENERGY_OPTIONS: SelectOption[] = [
    { value: 'rating5', label_th: 'เบอร์ 5 (ประหยัดไฟมาก)', label_en: 'Rating 5 (Most efficient)', emoji: '🌟' },
    { value: 'rating4', label_th: 'เบอร์ 4', label_en: 'Rating 4', emoji: '⭐' },
    { value: 'rating3', label_th: 'เบอร์ 3', label_en: 'Rating 3', emoji: '⭐' },
    { value: 'inverter', label_th: 'Inverter', label_en: 'Inverter', emoji: '⚡', description_th: 'ประหยัดไฟ ทำงานเงียบ' },
    { value: 'unknown', label_th: 'ไม่ทราบ', label_en: 'Unknown', emoji: '❓' },
]

export const APPLIANCE_NOISE_OPTIONS: SelectOption[] = [
    { value: 'quiet', label_th: 'เงียบมาก', label_en: 'Very quiet', emoji: '🤫' },
    { value: 'normal', label_th: 'ปกติ', label_en: 'Normal', emoji: '🔊' },
    { value: 'noisy', label_th: 'มีเสียงดังบ้าง', label_en: 'Somewhat noisy', emoji: '📢' },
    { value: 'loud', label_th: 'เสียงดังมาก', label_en: 'Very loud', emoji: '🔔' },
]

export const APPLIANCE_SERVICE_OPTIONS: SelectOption[] = [
    { value: 'recently', label_th: 'เพิ่งล้างทำความสะอาด', label_en: 'Recently cleaned/serviced', emoji: '✨' },
    { value: '6m', label_th: 'ล้างมาไม่เกิน 6 เดือน', label_en: 'Cleaned within 6 months', emoji: '👍' },
    { value: '1y', label_th: 'ล้างมาไม่เกิน 1 ปี', label_en: 'Cleaned within 1 year', emoji: '📆' },
    { value: 'never', label_th: 'ยังไม่เคยล้าง', label_en: 'Never cleaned', emoji: '🧹' },
]

export const APPLIANCE_DEFECT_OPTIONS: MultiSelectOption[] = [
    { value: 'none', label_th: 'ไม่มีตำหนิ ✨', label_en: 'No defects ✨', emoji: '✨', category: 'perfect' },
    { value: 'dent', label_th: 'มีรอยบุบ/ขีดข่วนภายนอก', label_en: 'Exterior dents/scratches', emoji: '💢', category: 'cosmetic' },
    { value: 'rust', label_th: 'มีจุดสนิม', label_en: 'Rust spots', emoji: '🟤', category: 'cosmetic' },
    { value: 'noise', label_th: 'มีเสียงดัง', label_en: 'Makes noise', emoji: '🔊', category: 'functional' },
    { value: 'leak', label_th: 'มีน้ำรั่ว/หยด', label_en: 'Water leak', emoji: '💧', category: 'functional' },
    { value: 'temp_issue', label_th: 'ความเย็น/ความร้อนไม่คงที่', label_en: 'Temperature issues', emoji: '🌡️', category: 'functional' },
    { value: 'remote_issue', label_th: 'รีโมทมีปัญหา', label_en: 'Remote issues', emoji: '📱', category: 'accessories' },
    { value: 'other', label_th: 'อื่นๆ (ระบุด้านล่าง)', label_en: 'Other (specify below)', emoji: '📝', category: 'other' },
]

// ============================================
// 📦 UNIVERSAL OPTIONS (ทุกหมวดหมู่)
// ============================================

// อุปกรณ์ที่แถมมา
export const INCLUDED_ACCESSORIES_OPTIONS: MultiSelectOption[] = [
    // Electronics
    { value: 'charger', label_th: 'สายชาร์จ', label_en: 'Charger cable', emoji: '🔌', category: 'electronics' },
    { value: 'adapter', label_th: 'หัวชาร์จ/Adapter', label_en: 'Power adapter', emoji: '🔋', category: 'electronics' },
    { value: 'earphones', label_th: 'หูฟัง', label_en: 'Earphones', emoji: '🎧', category: 'electronics' },
    { value: 'case', label_th: 'เคส', label_en: 'Case', emoji: '📱', category: 'protection' },
    { value: 'screen_protector', label_th: 'ฟิล์มกันรอย', label_en: 'Screen protector', emoji: '🛡️', category: 'protection' },
    { value: 'bag', label_th: 'กระเป๋า/ซอง', label_en: 'Bag/Sleeve', emoji: '👜', category: 'protection' },
    { value: 'mouse', label_th: 'เมาส์', label_en: 'Mouse', emoji: '🖱️', category: 'pc_accessories' },
    { value: 'keyboard', label_th: 'คีย์บอร์ด', label_en: 'Keyboard', emoji: '⌨️', category: 'pc_accessories' },
    { value: 'stand', label_th: 'ขาตั้ง', label_en: 'Stand', emoji: '🖥️', category: 'pc_accessories' },
    { value: 'controller', label_th: 'จอย/Controller', label_en: 'Controller', emoji: '🎮', category: 'gaming' },
    { value: 'games', label_th: 'แผ่นเกม', label_en: 'Game discs', emoji: '📀', category: 'gaming' },
    { value: 'strap', label_th: 'สายคล้อง', label_en: 'Strap', emoji: '🔗', category: 'camera' },
    { value: 'lens_cap', label_th: 'ฝาปิดเลนส์', label_en: 'Lens cap', emoji: '🔘', category: 'camera' },
    { value: 'sd_card', label_th: 'Memory Card', label_en: 'Memory card', emoji: '💾', category: 'storage' },
    { value: 'manual', label_th: 'คู่มือ', label_en: 'Manual', emoji: '📖', category: 'documents' },
    { value: 'other', label_th: 'อื่นๆ', label_en: 'Other', emoji: '📝', category: 'other' },
]

// เปิดต่อราคาไหม
export const NEGOTIABLE_OPTIONS: SelectOption[] = [
    { value: 'no', label_th: 'ไม่ลดราคา (ราคาตายตัว)', label_en: 'Fixed price (No negotiation)', emoji: '🔒' },
    { value: 'slight', label_th: 'ลดได้เล็กน้อย', label_en: 'Slightly negotiable', emoji: '💬', description_th: 'ต่อได้นิดหน่อย ถ้าซื้อจริง' },
    { value: 'yes', label_th: 'ต่อรองได้', label_en: 'Negotiable', emoji: '🤝' },
    { value: 'offer', label_th: 'ยินดีรับฟัง offer', label_en: 'Open to offers', emoji: '📩' },
]

// จุดนัดรับสินค้า
export const MEETING_POINT_OPTIONS: MultiSelectOption[] = [
    { value: 'bts', label_th: 'นัดที่ BTS/MRT', label_en: 'BTS/MRT Station', emoji: '🚇', category: 'transport' },
    { value: 'mall', label_th: 'นัดที่ห้าง', label_en: 'Shopping mall', emoji: '🏬', category: 'location' },
    { value: 'cafe', label_th: 'นัดที่ร้านกาแฟ', label_en: 'Cafe', emoji: '☕', category: 'location' },
    { value: 'home', label_th: 'รับที่บ้าน (แจ้งพิกัด)', label_en: 'Home pickup', emoji: '🏠', category: 'location' },
    { value: 'office', label_th: 'นัดที่ออฟฟิศ', label_en: 'Office', emoji: '🏢', category: 'location' },
    { value: 'ship_only', label_th: 'ส่งอย่างเดียว ไม่รับนัด', label_en: 'Shipping only', emoji: '📦', category: 'shipping' },
    { value: 'ship_or_meet', label_th: 'ส่งได้ หรือนัดรับก็ได้', label_en: 'Ship or meet', emoji: '🤝', category: 'flexible' },
]

// วิธีจัดส่ง  
export const SHIPPING_METHOD_OPTIONS: MultiSelectOption[] = [
    { value: 'kerry', label_th: 'Kerry Express', label_en: 'Kerry Express', emoji: '📦', category: 'express' },
    { value: 'flash', label_th: 'Flash Express', label_en: 'Flash Express', emoji: '⚡', category: 'express' },
    { value: 'jt', label_th: 'J&T Express', label_en: 'J&T Express', emoji: '📦', category: 'express' },
    { value: 'shopee', label_th: 'Shopee Express', label_en: 'Shopee Express', emoji: '🛒', category: 'platform' },
    { value: 'lazada', label_th: 'Lazada Express', label_en: 'Lazada Express', emoji: '🛒', category: 'platform' },
    { value: 'thaipost', label_th: 'ไปรษณีย์ไทย', label_en: 'Thailand Post', emoji: '📮', category: 'standard' },
    { value: 'ems', label_th: 'EMS', label_en: 'EMS', emoji: '✈️', category: 'standard' },
    { value: 'grab', label_th: 'Grab/Lalamove', label_en: 'Grab/Lalamove', emoji: '🛵', category: 'same_day' },
    { value: 'lineman', label_th: 'LINE MAN', label_en: 'LINE MAN', emoji: '🛵', category: 'same_day' },
    { value: 'pickup', label_th: 'รับเอง', label_en: 'Self pickup', emoji: '🤝', category: 'in_person' },
]

// วิธีชำระเงิน
export const PAYMENT_METHOD_OPTIONS: MultiSelectOption[] = [
    { value: 'transfer', label_th: 'โอนเงิน', label_en: 'Bank transfer', emoji: '💳', category: 'online' },
    { value: 'promptpay', label_th: 'พร้อมเพย์/QR', label_en: 'PromptPay/QR', emoji: '📱', category: 'online' },
    { value: 'cod', label_th: 'เก็บเงินปลายทาง (COD)', label_en: 'Cash on Delivery', emoji: '💵', category: 'cod' },
    { value: 'cash', label_th: 'เงินสด (นัดพบ)', label_en: 'Cash (in person)', emoji: '💰', category: 'in_person' },
    { value: 'installment', label_th: 'ผ่อนชำระ', label_en: 'Installment', emoji: '📅', category: 'credit' },
    { value: 'credit', label_th: 'บัตรเครดิต', label_en: 'Credit card', emoji: '💳', category: 'credit' },
]

// ส่งได้เมื่อไหร่
export const SHIPPING_TIME_OPTIONS: SelectOption[] = [
    { value: 'same_day', label_th: 'ส่งได้ทันที/วันนี้', label_en: 'Same day shipping', emoji: '⚡' },
    { value: '1_day', label_th: 'ภายใน 1 วัน', label_en: 'Within 1 day', emoji: '📆' },
    { value: '2_3_days', label_th: 'ภายใน 2-3 วัน', label_en: 'Within 2-3 days', emoji: '📆' },
    { value: '1_week', label_th: 'ภายใน 1 สัปดาห์', label_en: 'Within 1 week', emoji: '📅' },
    { value: 'contact', label_th: 'นัดหมายล่วงหน้า', label_en: 'Schedule in advance', emoji: '📞' },
]

// ============================================
// 🎯 QUICK FILL TEMPLATES
// ============================================

export interface QuickFillTemplate {
    id: string
    label_th: string
    label_en: string
    emoji: string
    description_th: string
    values: {
        defects?: string
        battery?: string
        warranty?: string
        usageAge?: string
        originalBox?: string
        receipt?: string
        sellingReason?: string
        negotiable?: string
    }
}

export const QUICK_FILL_TEMPLATES: QuickFillTemplate[] = [
    {
        id: 'like_new',
        label_th: 'เหมือนใหม่ ครบชุด',
        label_en: 'Like new, complete set',
        emoji: '✨',
        description_th: 'สินค้าสภาพดีมาก อุปกรณ์ครบ',
        values: {
            defects: 'none',
            battery: '90-100',
            warranty: '6_12m',
            usageAge: 'less_3m',
            originalBox: 'complete',
            receipt: 'both',
            sellingReason: 'upgrade',
            negotiable: 'slight'
        }
    },
    {
        id: 'good_condition',
        label_th: 'สภาพดี ใช้งานปกติ',
        label_en: 'Good condition, normal use',
        emoji: '👍',
        description_th: 'ใช้งานมาบ้าง สภาพดี',
        values: {
            defects: 'minor_scratches',
            battery: '80-89',
            warranty: 'expired',
            usageAge: '1_2y',
            originalBox: 'box_only',
            receipt: 'none',
            sellingReason: 'upgrade',
            negotiable: 'yes'
        }
    },
    {
        id: 'never_used',
        label_th: 'ของใหม่ ยังไม่แกะ',
        label_en: 'Brand new, sealed',
        emoji: '🆕',
        description_th: 'ได้มาเป็นของขวัญ ไม่ได้ใช้',
        values: {
            defects: 'none',
            battery: '90-100',
            warranty: 'more_1y',
            usageAge: 'new',
            originalBox: 'complete',
            receipt: 'both',
            sellingReason: 'gift',
            negotiable: 'slight'
        }
    },
    {
        id: 'budget_choice',
        label_th: 'ราคาประหยัด มีตำหนิบ้าง',
        label_en: 'Budget option, some issues',
        emoji: '💰',
        description_th: 'ราคาถูก มีตำหนิเล็กน้อย แต่ใช้งานได้ปกติ',
        values: {
            defects: 'noticeable_scratches',
            battery: '70-79',
            warranty: 'expired',
            usageAge: '2_3y',
            originalBox: 'no_box',
            receipt: 'none',
            sellingReason: 'upgrade',
            negotiable: 'yes'
        }
    },
]

// ============================================
// EXPORT ALL
// ============================================
export const ENHANCED_OPTIONS = {
    // Original
    battery: BATTERY_HEALTH_OPTIONS,
    laptop_defects: LAPTOP_DEFECT_OPTIONS,
    phone_defects: PHONE_DEFECT_OPTIONS,
    warranty: WARRANTY_OPTIONS,
    usage_age: USAGE_AGE_OPTIONS,
    original_box: ORIGINAL_BOX_OPTIONS,
    receipt: RECEIPT_OPTIONS,
    selling_reason: SELLING_REASON_OPTIONS,
    laptop_audience: LAPTOP_TARGET_AUDIENCE,
    laptop_not_recommended: LAPTOP_NOT_RECOMMENDED,

    // NEW: Automotive
    auto_mileage: AUTOMOTIVE_MILEAGE_OPTIONS,
    auto_accident: AUTOMOTIVE_ACCIDENT_OPTIONS,
    auto_service: AUTOMOTIVE_SERVICE_OPTIONS,
    auto_insurance: AUTOMOTIVE_INSURANCE_OPTIONS,
    auto_finance: AUTOMOTIVE_FINANCE_OPTIONS,
    auto_plate_province: AUTOMOTIVE_PLATE_PROVINCE_OPTIONS,
    auto_defects: AUTOMOTIVE_DEFECT_OPTIONS,

    // NEW: Camera
    camera_shutter: CAMERA_SHUTTER_OPTIONS,
    camera_sensor: CAMERA_SENSOR_OPTIONS,
    camera_lens: CAMERA_LENS_OPTIONS,
    camera_defects: CAMERA_DEFECT_OPTIONS,

    // NEW: Fashion/Luxury
    luxury_authenticity: LUXURY_AUTHENTICITY_OPTIONS,
    luxury_box: LUXURY_BOX_OPTIONS,
    fashion_defects: FASHION_DEFECT_OPTIONS,

    // NEW: Gaming
    gaming_mod: GAMING_MOD_STATUS_OPTIONS,
    gaming_controller: GAMING_CONTROLLER_OPTIONS,
    gaming_account: GAMING_ACCOUNT_OPTIONS,
    gaming_defects: GAMING_DEFECT_OPTIONS,

    // NEW: Appliances
    appliance_energy: APPLIANCE_ENERGY_OPTIONS,
    appliance_noise: APPLIANCE_NOISE_OPTIONS,
    appliance_service: APPLIANCE_SERVICE_OPTIONS,
    appliance_defects: APPLIANCE_DEFECT_OPTIONS,

    // NEW: Universal
    included_accessories: INCLUDED_ACCESSORIES_OPTIONS,
    negotiable: NEGOTIABLE_OPTIONS,
    meeting_point: MEETING_POINT_OPTIONS,
    shipping_method: SHIPPING_METHOD_OPTIONS,
    payment_method: PAYMENT_METHOD_OPTIONS,
    shipping_time: SHIPPING_TIME_OPTIONS,

    // NEW: Quick Fill
    quick_fill_templates: QUICK_FILL_TEMPLATES,
}

// ============================================
// HELPER: Get options by category
// ============================================
export function getEnhancedOptionsForCategory(categoryId: number): {
    defects: MultiSelectOption[]
    additionalFields: SelectOption[][]
    targetAudience?: TargetAudienceOption[]
} {
    switch (categoryId) {
        case 1: // Automotive
            return {
                defects: AUTOMOTIVE_DEFECT_OPTIONS,
                additionalFields: [
                    AUTOMOTIVE_MILEAGE_OPTIONS,
                    AUTOMOTIVE_ACCIDENT_OPTIONS,
                    AUTOMOTIVE_SERVICE_OPTIONS,
                    AUTOMOTIVE_INSURANCE_OPTIONS,
                    AUTOMOTIVE_FINANCE_OPTIONS,
                ],
            }
        case 3: // Mobile
            return {
                defects: PHONE_DEFECT_OPTIONS,
                additionalFields: [BATTERY_HEALTH_OPTIONS],
            }
        case 4: // Computer
            return {
                defects: LAPTOP_DEFECT_OPTIONS,
                additionalFields: [BATTERY_HEALTH_OPTIONS],
                targetAudience: LAPTOP_TARGET_AUDIENCE,
            }
        case 5: // Appliances
            return {
                defects: APPLIANCE_DEFECT_OPTIONS,
                additionalFields: [
                    APPLIANCE_ENERGY_OPTIONS,
                    APPLIANCE_NOISE_OPTIONS,
                    APPLIANCE_SERVICE_OPTIONS,
                ],
            }
        case 6: // Fashion
        case 603: // Luxury Bags
        case 605: // Luxury Watches
            return {
                defects: FASHION_DEFECT_OPTIONS,
                additionalFields: [
                    LUXURY_AUTHENTICITY_OPTIONS,
                    LUXURY_BOX_OPTIONS,
                ],
            }
        case 7: // Gaming
            return {
                defects: GAMING_DEFECT_OPTIONS,
                additionalFields: [
                    GAMING_MOD_STATUS_OPTIONS,
                    GAMING_CONTROLLER_OPTIONS,
                    GAMING_ACCOUNT_OPTIONS,
                ],
            }
        case 8: // Camera
            return {
                defects: CAMERA_DEFECT_OPTIONS,
                additionalFields: [
                    CAMERA_SHUTTER_OPTIONS,
                    CAMERA_SENSOR_OPTIONS,
                    CAMERA_LENS_OPTIONS,
                ],
            }
        default:
            return {
                defects: LAPTOP_DEFECT_OPTIONS, // Default
                additionalFields: [],
            }
    }
}

