/**
 * SUBCATEGORY FORM MAPPING
 * 
 * ระบบกำหนดว่า subcategory ไหนต้องใช้ฟอร์มแบบไหน
 * 
 * แนวคิด:
 * - FULL_FORM: ต้องการข้อมูลเฉพาะทาง (รถ, มือถือ, อสังหา)
 * - LIGHT_FORM: ต้องการข้อมูลบางส่วน (อะไหล่, อุปกรณ์เสริม)
 * - DEFAULT_FORM: ฟอร์มมาตรฐาน (สินค้าทั่วไป)
 */

export type FormType = 'VEHICLE_FULL' | 'VEHICLE_PARTS' | 'REAL_ESTATE' |
    'MOBILE_DEVICE' | 'MOBILE_ACCESSORY' |
    'COMPUTER_FULL' | 'COMPUTER_PARTS' |
    'AMULET' | 'COIN_COLLECTIBLE' |
    'FASHION_ITEM' | 'FASHION_ACCESSORY' |
    'PET_ANIMAL' | 'PET_SUPPLY' |
    'GAMING_CONSOLE' | 'GAMING_DISC' |
    'CAMERA_BODY' | 'CAMERA_LENS' |
    'BICYCLE' | 'FITNESS' |
    'DEFAULT'

export interface SubcategoryFormConfig {
    formType: FormType
    requiresDetailedForm: boolean
    formLabel_th: string
    formLabel_en: string
    description_th?: string
    description_en?: string
}

// ========================================
// SUBCATEGORY → FORM TYPE MAPPING
// ========================================
export const SUBCATEGORY_FORM_MAP: Record<number, SubcategoryFormConfig> = {
    // ===== AUTOMOTIVE (Category 1) =====
    101: { // รถยนต์มือสอง
        formType: 'VEHICLE_FULL',
        requiresDetailedForm: true,
        formLabel_th: '🚗 ข้อมูลรถยนต์',
        formLabel_en: '🚗 Vehicle Details',
        description_th: 'กรอกข้อมูลรถช่วยให้ขายได้เร็วขึ้น',
        description_en: 'Adding vehicle details helps sell faster'
    },
    102: { // มอเตอร์ไซค์
        formType: 'VEHICLE_FULL',
        requiresDetailedForm: true,
        formLabel_th: '🏍️ ข้อมูลมอเตอร์ไซค์',
        formLabel_en: '🏍️ Motorcycle Details',
        description_th: 'กรอกข้อมูลมอเตอร์ไซค์ช่วยให้ขายได้เร็วขึ้น',
        description_en: 'Adding motorcycle details helps sell faster'
    },
    103: { // อะไหล่รถยนต์
        formType: 'VEHICLE_PARTS',
        requiresDetailedForm: false,
        formLabel_th: '🔧 อะไหล่รถยนต์',
        formLabel_en: '🔧 Car Parts',
    },
    104: { // อะไหล่มอเตอร์ไซค์
        formType: 'VEHICLE_PARTS',
        requiresDetailedForm: false,
        formLabel_th: '🔧 อะไหล่มอเตอร์ไซค์',
        formLabel_en: '🔧 Motorcycle Parts',
    },
    105: { // รถบรรทุก
        formType: 'VEHICLE_FULL',
        requiresDetailedForm: true,
        formLabel_th: '🚛 ข้อมูลรถบรรทุก',
        formLabel_en: '🚛 Truck Details',
    },
    106: { // ล้อและยาง
        formType: 'VEHICLE_PARTS',
        requiresDetailedForm: false,
        formLabel_th: '🛞 ข้อมูลล้อและยาง',
        formLabel_en: '🛞 Wheels & Tires',
    },
    107: { // รถกระบะ
        formType: 'VEHICLE_FULL',
        requiresDetailedForm: true,
        formLabel_th: '🛻 ข้อมูลรถกระบะ',
        formLabel_en: '🛻 Pickup Details',
    },
    108: { // รถตู้
        formType: 'VEHICLE_FULL',
        requiresDetailedForm: true,
        formLabel_th: '🚐 ข้อมูลรถตู้',
        formLabel_en: '🚐 Van Details',
    },
    109: { // อุปกรณ์บำรุงรักษา - ❌ ไม่ต้องกรอกข้อมูลรถ!
        formType: 'DEFAULT',
        requiresDetailedForm: false,
        formLabel_th: '📦 ข้อมูลสินค้า',
        formLabel_en: '📦 Product Details',
    },

    // ===== REAL ESTATE (Category 2) =====
    201: { formType: 'REAL_ESTATE', requiresDetailedForm: true, formLabel_th: '🏠 ข้อมูลบ้าน', formLabel_en: '🏠 House Details' },
    202: { formType: 'REAL_ESTATE', requiresDetailedForm: true, formLabel_th: '🏢 ข้อมูลคอนโด', formLabel_en: '🏢 Condo Details' },
    203: { formType: 'REAL_ESTATE', requiresDetailedForm: true, formLabel_th: '🗺️ ข้อมูลที่ดิน', formLabel_en: '🗺️ Land Details' },
    204: { formType: 'REAL_ESTATE', requiresDetailedForm: true, formLabel_th: '🏘️ ข้อมูลทาวน์เฮ้าส์', formLabel_en: '🏘️ Townhouse Details' },
    205: { formType: 'REAL_ESTATE', requiresDetailedForm: true, formLabel_th: '🏬 ข้อมูลอาคารพาณิชย์', formLabel_en: '🏬 Commercial Details' },
    206: { formType: 'REAL_ESTATE', requiresDetailedForm: true, formLabel_th: '🛏️ ข้อมูลห้องเช่า', formLabel_en: '🛏️ Apartment Details' },
    207: { formType: 'REAL_ESTATE', requiresDetailedForm: true, formLabel_th: '🏭 ข้อมูลโกดัง', formLabel_en: '🏭 Warehouse Details' },
    208: { formType: 'REAL_ESTATE', requiresDetailedForm: true, formLabel_th: '🏢 ข้อมูลสำนักงาน', formLabel_en: '🏢 Office Details' },

    // ===== MOBILE (Category 3) =====
    301: { // โทรศัพท์มือถือ
        formType: 'MOBILE_DEVICE',
        requiresDetailedForm: true,
        formLabel_th: '📱 ข้อมูลมือถือ',
        formLabel_en: '📱 Phone Details',
        description_th: 'ระบุความจุและสุขภาพแบตเพื่อขายได้ราคาดี',
        description_en: 'Specify storage and battery for better price'
    },
    302: { formType: 'MOBILE_DEVICE', requiresDetailedForm: true, formLabel_th: '📱 ข้อมูลแท็บเล็ต', formLabel_en: '📱 Tablet Details' },
    303: { formType: 'MOBILE_ACCESSORY', requiresDetailedForm: false, formLabel_th: '⌚ ข้อมูล Wearable', formLabel_en: '⌚ Wearable Details' },
    304: { formType: 'MOBILE_ACCESSORY', requiresDetailedForm: false, formLabel_th: '📦 ข้อมูลอุปกรณ์เสริม', formLabel_en: '📦 Accessory Details' },
    305: { formType: 'DEFAULT', requiresDetailedForm: false, formLabel_th: '📦 ข้อมูลสินค้า', formLabel_en: '📦 Product Details' },
    306: { formType: 'DEFAULT', requiresDetailedForm: false, formLabel_th: '📦 ข้อมูลสินค้า', formLabel_en: '📦 Product Details' },
    307: { formType: 'DEFAULT', requiresDetailedForm: false, formLabel_th: '📦 ข้อมูลสินค้า', formLabel_en: '📦 Product Details' },

    // ===== COMPUTER (Category 4) =====
    401: { // โน้ตบุ๊ค
        formType: 'COMPUTER_FULL',
        requiresDetailedForm: true,
        formLabel_th: '💻 ข้อมูลโน้ตบุ๊ค',
        formLabel_en: '💻 Laptop Details',
        description_th: 'ระบุ CPU/RAM/SSD เพื่อผู้ซื้อตัดสินใจง่าย',
        description_en: 'Specify CPU/RAM/SSD for buyers'
    },
    402: { formType: 'COMPUTER_FULL', requiresDetailedForm: true, formLabel_th: '🖥️ ข้อมูลเดสก์ท็อป', formLabel_en: '🖥️ Desktop Details' },
    403: { formType: 'COMPUTER_PARTS', requiresDetailedForm: false, formLabel_th: '🖥️ ข้อมูลจอมอนิเตอร์', formLabel_en: '🖥️ Monitor Details' },
    404: { formType: 'DEFAULT', requiresDetailedForm: false, formLabel_th: '📦 ข้อมูลสินค้า', formLabel_en: '📦 Product Details' },
    405: { formType: 'DEFAULT', requiresDetailedForm: false, formLabel_th: '🖨️ ข้อมูลปริ้นเตอร์', formLabel_en: '🖨️ Printer Details' },
    406: { formType: 'COMPUTER_PARTS', requiresDetailedForm: false, formLabel_th: '🔧 ข้อมูล Components', formLabel_en: '🔧 Component Details' },
    407: { formType: 'COMPUTER_FULL', requiresDetailedForm: true, formLabel_th: '🎮 ข้อมูล Gaming PC', formLabel_en: '🎮 Gaming PC Details' },
    408: { formType: 'DEFAULT', requiresDetailedForm: false, formLabel_th: '⌨️ ข้อมูลคีย์บอร์ด', formLabel_en: '⌨️ Keyboard Details' },
    409: { formType: 'DEFAULT', requiresDetailedForm: false, formLabel_th: '🖱️ ข้อมูลเมาส์', formLabel_en: '🖱️ Mouse Details' },
    410: { formType: 'COMPUTER_PARTS', requiresDetailedForm: false, formLabel_th: '🔧 ข้อมูลชิ้นส่วน PC', formLabel_en: '🔧 PC Parts Details' },

    // ===== HOME APPLIANCES (Category 5) =====
    501: { formType: 'DEFAULT', requiresDetailedForm: false, formLabel_th: '❄️ ข้อมูลแอร์', formLabel_en: '❄️ AC Details' },
    502: { formType: 'DEFAULT', requiresDetailedForm: false, formLabel_th: '🧊 ข้อมูลตู้เย็น', formLabel_en: '🧊 Refrigerator Details' },
    503: { formType: 'DEFAULT', requiresDetailedForm: false, formLabel_th: '🧺 ข้อมูลเครื่องซักผ้า', formLabel_en: '🧺 Washing Machine Details' },
    504: { formType: 'DEFAULT', requiresDetailedForm: false, formLabel_th: '📺 ข้อมูลทีวี', formLabel_en: '📺 TV Details' },
    505: { formType: 'DEFAULT', requiresDetailedForm: false, formLabel_th: '🍳 ข้อมูลเครื่องใช้ในครัว', formLabel_en: '🍳 Kitchen Appliance Details' },
    506: { formType: 'DEFAULT', requiresDetailedForm: false, formLabel_th: '🚿 ข้อมูลเครื่องทำน้ำอุ่น', formLabel_en: '🚿 Water Heater Details' },
    507: { formType: 'DEFAULT', requiresDetailedForm: false, formLabel_th: '🧹 ข้อมูลเครื่องดูดฝุ่น', formLabel_en: '🧹 Vacuum Details' },
    508: { formType: 'DEFAULT', requiresDetailedForm: false, formLabel_th: '🌀 ข้อมูลพัดลม', formLabel_en: '🌀 Fan Details' },
    509: { formType: 'DEFAULT', requiresDetailedForm: false, formLabel_th: '💨 ข้อมูลเครื่องฟอกอากาศ', formLabel_en: '💨 Air Purifier Details' },
    510: { formType: 'DEFAULT', requiresDetailedForm: false, formLabel_th: '👔 ข้อมูลเครื่องรีดผ้า', formLabel_en: '👔 Iron Details' },
    511: { formType: 'DEFAULT', requiresDetailedForm: false, formLabel_th: '💧 ข้อมูลเครื่องทำน้ำดื่ม', formLabel_en: '💧 Water Dispenser Details' },

    // ===== FASHION (Category 6) =====
    601: { formType: 'FASHION_ITEM', requiresDetailedForm: false, formLabel_th: '👕 เสื้อผ้าผู้ชาย', formLabel_en: '👕 Men\'s Clothing' },
    602: { formType: 'FASHION_ITEM', requiresDetailedForm: false, formLabel_th: '👗 เสื้อผ้าผู้หญิง', formLabel_en: '👗 Women\'s Clothing' },
    603: {
        formType: 'FASHION_ITEM',
        requiresDetailedForm: true,
        formLabel_th: '👜 กระเป๋าแบรนด์เนม',
        formLabel_en: '👜 Brandname Bag',
        description_th: 'ระบุความแท้และใบรับรองเพื่อขายได้ราคาดี',
        description_en: 'Specify authenticity for better price'
    },
    604: { formType: 'FASHION_ITEM', requiresDetailedForm: false, formLabel_th: '👟 รองเท้า', formLabel_en: '👟 Shoes' },
    605: {
        formType: 'FASHION_ITEM',
        requiresDetailedForm: true,
        formLabel_th: '⌚ นาฬิกา',
        formLabel_en: '⌚ Watch',
        description_th: 'ระบุรุ่นและใบรับรองเพื่อขายได้ราคาดี',
        description_en: 'Specify model and certificate'
    },
    606: { formType: 'FASHION_ACCESSORY', requiresDetailedForm: false, formLabel_th: '💍 เครื่องประดับ', formLabel_en: '💍 Jewelry' },
    607: { formType: 'DEFAULT', requiresDetailedForm: false, formLabel_th: '📦 ข้อมูลสินค้า', formLabel_en: '📦 Product Details' },
    608: { formType: 'FASHION_ITEM', requiresDetailedForm: false, formLabel_th: '👶 เสื้อผ้าเด็ก', formLabel_en: '👶 Kids Fashion' },

    // ===== GAMING (Category 7) =====
    701: { // เครื่องเกมคอนโซล
        formType: 'GAMING_CONSOLE',
        requiresDetailedForm: true,
        formLabel_th: '🎮 ข้อมูลเครื่องเกม',
        formLabel_en: '🎮 Console Details',
        description_th: 'ระบุรุ่นและ Storage เพื่อขายได้ราคาดี',
        description_en: 'Specify model and storage'
    },
    702: { formType: 'GAMING_DISC', requiresDetailedForm: false, formLabel_th: '💿 ข้อมูลแผ่นเกม', formLabel_en: '💿 Game Disc Details' },
    703: { formType: 'DEFAULT', requiresDetailedForm: false, formLabel_th: '🎮 ข้อมูลเกมมิ่งเกียร์', formLabel_en: '🎮 Gaming Gear Details' },
    704: { formType: 'DEFAULT', requiresDetailedForm: false, formLabel_th: '🎧 ข้อมูลหูฟัง', formLabel_en: '🎧 Headset Details' },
    705: { formType: 'DEFAULT', requiresDetailedForm: false, formLabel_th: '⌨️ ข้อมูลคีย์บอร์ด', formLabel_en: '⌨️ Keyboard Details' },
    706: { formType: 'DEFAULT', requiresDetailedForm: false, formLabel_th: '🚁 ข้อมูลโดรน', formLabel_en: '🚁 Drone Details' },
    707: { formType: 'DEFAULT', requiresDetailedForm: false, formLabel_th: '🥽 ข้อมูล VR', formLabel_en: '🥽 VR Details' },

    // ===== CAMERAS (Category 8) =====
    801: { // กล้องดิจิตอล
        formType: 'CAMERA_BODY',
        requiresDetailedForm: true,
        formLabel_th: '📷 ข้อมูลกล้อง',
        formLabel_en: '📷 Camera Details',
        description_th: 'ระบุ Shutter Count เพื่อขายได้ราคาดี',
        description_en: 'Specify shutter count for better price'
    },
    802: { formType: 'CAMERA_BODY', requiresDetailedForm: false, formLabel_th: '📷 ข้อมูลกล้องฟิล์ม', formLabel_en: '📷 Film Camera Details' },
    803: {
        formType: 'CAMERA_LENS',
        requiresDetailedForm: true,
        formLabel_th: '📷 ข้อมูลเลนส์',
        formLabel_en: '📷 Lens Details',
        description_th: 'ระบุ Mount และ Focal Length',
        description_en: 'Specify mount and focal length'
    },
    804: { formType: 'DEFAULT', requiresDetailedForm: false, formLabel_th: '📦 ข้อมูลอุปกรณ์', formLabel_en: '📦 Equipment Details' },

    // ===== AMULETS (Category 9) =====
    901: { // พระเครื่อง
        formType: 'AMULET',
        requiresDetailedForm: true,
        formLabel_th: '🙏 ข้อมูลพระเครื่อง',
        formLabel_en: '🙏 Amulet Details',
        description_th: 'ระบุวัดและปีเพื่อให้ผู้ซื้อมั่นใจ',
        description_en: 'Specify temple and year for buyer confidence'
    },
    902: { formType: 'COIN_COLLECTIBLE', requiresDetailedForm: true, formLabel_th: '🪙 ข้อมูลเหรียญ', formLabel_en: '🪙 Coin Details' },
    903: { formType: 'COIN_COLLECTIBLE', requiresDetailedForm: false, formLabel_th: '💵 ข้อมูลธนบัตร', formLabel_en: '💵 Banknote Details' },
    904: { formType: 'DEFAULT', requiresDetailedForm: false, formLabel_th: '🏺 ข้อมูลของเก่า', formLabel_en: '🏺 Antique Details' },
    905: { formType: 'DEFAULT', requiresDetailedForm: false, formLabel_th: '🎁 ข้อมูล Art Toy', formLabel_en: '🎁 Art Toy Details' },

    // ===== PETS (Category 10) =====
    1001: {
        formType: 'PET_ANIMAL',
        requiresDetailedForm: true,
        formLabel_th: '🐕 ข้อมูลสุนัข',
        formLabel_en: '🐕 Dog Details',
        description_th: 'ระบุสายพันธุ์และอายุ',
        description_en: 'Specify breed and age'
    },
    1002: { formType: 'PET_ANIMAL', requiresDetailedForm: true, formLabel_th: '🐈 ข้อมูลแมว', formLabel_en: '🐈 Cat Details' },
    1003: { formType: 'PET_ANIMAL', requiresDetailedForm: false, formLabel_th: '🐾 ข้อมูลสัตว์เลี้ยง', formLabel_en: '🐾 Pet Details' },
    1004: { formType: 'DEFAULT', requiresDetailedForm: false, formLabel_th: '📦 ข้อมูลอุปกรณ์', formLabel_en: '📦 Supply Details' },
    1005: { formType: 'DEFAULT', requiresDetailedForm: false, formLabel_th: '📦 ข้อมูลอาหารสัตว์', formLabel_en: '📦 Pet Food Details' },

    // ===== SPORTS (Category 12) =====
    1201: { // จักรยาน
        formType: 'BICYCLE',
        requiresDetailedForm: true,
        formLabel_th: '🚴 ข้อมูลจักรยาน',
        formLabel_en: '🚴 Bicycle Details',
        description_th: 'ระบุยี่ห้อและขนาดล้อ',
        description_en: 'Specify brand and wheel size'
    },
    1202: { formType: 'FITNESS', requiresDetailedForm: false, formLabel_th: '🏋️ ข้อมูลเครื่องออกกำลังกาย', formLabel_en: '🏋️ Fitness Equipment Details' },
    1203: { formType: 'DEFAULT', requiresDetailedForm: false, formLabel_th: '🏕️ ข้อมูลอุปกรณ์แคมป์ปิ้ง', formLabel_en: '🏕️ Camping Gear Details' },
    1204: { formType: 'DEFAULT', requiresDetailedForm: false, formLabel_th: '⚽ ข้อมูลอุปกรณ์กีฬา', formLabel_en: '⚽ Sports Gear Details' },
    1205: { formType: 'DEFAULT', requiresDetailedForm: false, formLabel_th: '🎫 ข้อมูลบัตรท่องเที่ยว', formLabel_en: '🎫 Voucher Details' },
    1206: { formType: 'DEFAULT', requiresDetailedForm: false, formLabel_th: '🛼 ข้อมูลสเก็ต', formLabel_en: '🛼 Skate Details' },
}

// ========================================
// HELPER FUNCTIONS
// ========================================

/**
 * Get form configuration for a subcategory
 */
export function getSubcategoryFormConfig(subcategoryId: number): SubcategoryFormConfig {
    return SUBCATEGORY_FORM_MAP[subcategoryId] || {
        formType: 'DEFAULT',
        requiresDetailedForm: false,
        formLabel_th: '📦 ข้อมูลสินค้า',
        formLabel_en: '📦 Product Details'
    }
}

/**
 * Check if subcategory requires detailed form
 */
export function requiresDetailedForm(subcategoryId: number): boolean {
    const config = getSubcategoryFormConfig(subcategoryId)
    return config.requiresDetailedForm
}

/**
 * Get form type for subcategory
 */
export function getFormType(subcategoryId: number): FormType {
    const config = getSubcategoryFormConfig(subcategoryId)
    return config.formType
}

/**
 * Get all subcategories that require detailed forms
 */
export function getDetailedFormSubcategories(): number[] {
    return Object.entries(SUBCATEGORY_FORM_MAP)
        .filter(([_, config]) => config.requiresDetailedForm)
        .map(([id, _]) => parseInt(id))
}

/**
 * Check if a form field should be visible based on subcategory
 */
export function shouldShowFieldForSubcategory(
    subcategoryId: number,
    fieldId: string,
    formType: FormType
): boolean {
    const config = getSubcategoryFormConfig(subcategoryId)

    // If subcategory has DEFAULT form, hide advanced fields
    if (config.formType === 'DEFAULT') {
        const advancedFields = ['mileage', 'vehicle_year', 'gear_type', 'fuel_type',
            'cpu', 'ram', 'gpu', 'bedrooms', 'bathrooms',
            'temple', 'monk', 'shutter_count']
        return !advancedFields.includes(fieldId)
    }

    return true
}
