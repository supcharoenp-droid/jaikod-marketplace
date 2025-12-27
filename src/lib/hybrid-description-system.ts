/**
 * HYBRID PRODUCT DESCRIPTION SYSTEM - World-Class
 * 
 * ระบบช่วยจัดโครงสร้างรายละเอียดสินค้า ไม่เดาข้อมูล
 * 
 * Core Principles:
 * - DO NOT fabricate facts
 * - DO NOT assume condition, price, or hidden defects
 * - Provide STANDARD MIDDLE-GROUND STRUCTURE per category
 * - All fields are EDITABLE, OPTIONAL, and REMOVABLE
 * - Tone: Friendly, human, supportive
 */

// ========================================
// TYPES
// ========================================

export interface DescriptionField {
    key: string
    label_th: string
    label_en: string
    placeholder_th: string
    placeholder_en: string
    value: string
    editable: boolean
    removable: boolean
    type: 'text' | 'textarea' | 'select' | 'number'
    options?: { value: string; label_th: string; label_en: string }[]
}

export interface DescriptionSection {
    id: string
    title_th: string
    title_en: string
    icon: string
    fields: DescriptionField[]
    collapsible: boolean
    defaultOpen: boolean
}

export interface ProductDescriptionTemplate {
    sections: DescriptionSection[]
    ai_helper: {
        short_description_th: string
        short_description_en: string
        posting_tip_th: string
        posting_tip_en: string
    }
}

export interface DescriptionContext {
    categoryId: number
    subcategoryId?: number
    categoryName_th?: string
    categoryName_en?: string
    productTitle?: string
    language: 'th' | 'en'
}

// ========================================
// COMMON FIELD TEMPLATES
// ========================================

const COMMON_BASIC_INFO: (ctx: DescriptionContext) => DescriptionField[] = (ctx) => [
    {
        key: 'brand',
        label_th: 'ยี่ห้อ',
        label_en: 'Brand',
        placeholder_th: 'เช่น Samsung, Apple, Toyota',
        placeholder_en: 'e.g. Samsung, Apple, Toyota',
        value: '',
        editable: true,
        removable: false,
        type: 'text'
    },
    {
        key: 'model',
        label_th: 'รุ่น',
        label_en: 'Model',
        placeholder_th: 'ระบุรุ่นสินค้า',
        placeholder_en: 'Enter model name',
        value: '',
        editable: true,
        removable: false,
        type: 'text'
    },
    {
        key: 'condition',
        label_th: 'สภาพ',
        label_en: 'Condition',
        placeholder_th: 'เลือกสภาพสินค้า',
        placeholder_en: 'Select condition',
        value: '',
        editable: true,
        removable: false,
        type: 'select',
        options: [
            { value: 'new', label_th: 'ใหม่ ยังไม่เปิดกล่อง', label_en: 'Brand new, sealed' },
            { value: 'like_new', label_th: 'เหมือนใหม่ ใช้น้อยมาก', label_en: 'Like new' },
            { value: 'excellent', label_th: 'ดีเยี่ยม ไม่มีตำหนิ', label_en: 'Excellent' },
            { value: 'good', label_th: 'ดี มีรอยบ้างเล็กน้อย', label_en: 'Good' },
            { value: 'fair', label_th: 'พอใช้ มีรอยใช้งาน', label_en: 'Fair' }
        ]
    },
    {
        key: 'year',
        label_th: 'ปี',
        label_en: 'Year',
        placeholder_th: 'ปีที่ซื้อ/ผลิต',
        placeholder_en: 'Year purchased/made',
        value: '',
        editable: true,
        removable: true,
        type: 'text'
    }
]

const COMMON_CONDITION_NOTES: () => DescriptionField[] = () => [
    {
        key: 'overall_condition',
        label_th: 'สภาพโดยรวม',
        label_en: 'Overall Condition',
        placeholder_th: 'อธิบายสภาพสินค้าตามจริง...',
        placeholder_en: 'Describe the actual condition...',
        value: '',
        editable: true,
        removable: false,
        type: 'textarea'
    },
    {
        key: 'known_issues',
        label_th: 'ข้อบกพร่องที่ทราบ (ถ้ามี)',
        label_en: 'Known Issues (if any)',
        placeholder_th: 'หากมีตำหนิหรือปัญหา กรุณาระบุเพื่อความโปร่งใส',
        placeholder_en: 'Please mention any defects for transparency',
        value: '',
        editable: true,
        removable: true,
        type: 'textarea'
    }
]

const COMMON_DELIVERY: () => DescriptionField[] = () => [
    {
        key: 'included_items',
        label_th: 'อุปกรณ์ที่มี',
        label_en: 'Included Items',
        placeholder_th: 'เช่น กล่อง, สาย, คู่มือ, ใบรับประกัน',
        placeholder_en: 'e.g. Box, cable, manual, warranty card',
        value: '',
        editable: true,
        removable: true,
        type: 'text'
    },
    {
        key: 'delivery_method',
        label_th: 'วิธีรับสินค้า',
        label_en: 'Delivery Method',
        placeholder_th: 'เช่น ส่งได้ทั่วประเทศ, นัดรับ, COD',
        placeholder_en: 'e.g. Nationwide shipping, pickup, COD',
        value: '',
        editable: true,
        removable: true,
        type: 'text'
    }
]

// ========================================
// CATEGORY-SPECIFIC TEMPLATES
// ========================================

// 💻 Computer / Laptop
function getComputerTemplate(ctx: DescriptionContext): ProductDescriptionTemplate {
    const isTh = ctx.language === 'th'

    return {
        sections: [
            {
                id: 'basic_info',
                title_th: '📦 ข้อมูลพื้นฐาน',
                title_en: '📦 Basic Info',
                icon: '📦',
                fields: COMMON_BASIC_INFO(ctx),
                collapsible: false,
                defaultOpen: true
            },
            {
                id: 'key_specs',
                title_th: '💻 สเปกหลัก',
                title_en: '💻 Key Specifications',
                icon: '💻',
                fields: [
                    {
                        key: 'cpu',
                        label_th: 'CPU',
                        label_en: 'CPU',
                        placeholder_th: 'เช่น Intel Core i5-12400, AMD Ryzen 5 5600',
                        placeholder_en: 'e.g. Intel Core i5-12400, AMD Ryzen 5 5600',
                        value: '',
                        editable: true,
                        removable: false,
                        type: 'text'
                    },
                    {
                        key: 'ram',
                        label_th: 'RAM',
                        label_en: 'RAM',
                        placeholder_th: 'เช่น 8GB, 16GB DDR4',
                        placeholder_en: 'e.g. 8GB, 16GB DDR4',
                        value: '',
                        editable: true,
                        removable: false,
                        type: 'text'
                    },
                    {
                        key: 'storage',
                        label_th: 'พื้นที่เก็บข้อมูล',
                        label_en: 'Storage',
                        placeholder_th: 'เช่น SSD 512GB, HDD 1TB',
                        placeholder_en: 'e.g. SSD 512GB, HDD 1TB',
                        value: '',
                        editable: true,
                        removable: false,
                        type: 'text'
                    },
                    {
                        key: 'gpu',
                        label_th: 'การ์ดจอ',
                        label_en: 'GPU',
                        placeholder_th: 'เช่น NVIDIA RTX 3060, Intel UHD',
                        placeholder_en: 'e.g. NVIDIA RTX 3060, Intel UHD',
                        value: '',
                        editable: true,
                        removable: true,
                        type: 'text'
                    },
                    {
                        key: 'screen',
                        label_th: 'จอภาพ',
                        label_en: 'Display',
                        placeholder_th: 'เช่น 15.6" Full HD IPS',
                        placeholder_en: 'e.g. 15.6" Full HD IPS',
                        value: '',
                        editable: true,
                        removable: true,
                        type: 'text'
                    },
                    {
                        key: 'os',
                        label_th: 'ระบบปฏิบัติการ',
                        label_en: 'Operating System',
                        placeholder_th: 'เช่น Windows 11, macOS',
                        placeholder_en: 'e.g. Windows 11, macOS',
                        value: '',
                        editable: true,
                        removable: true,
                        type: 'text'
                    }
                ],
                collapsible: true,
                defaultOpen: true
            },
            {
                id: 'usage_highlights',
                title_th: '✨ การใช้งานและจุดเด่น',
                title_en: '✨ Usage & Highlights',
                icon: '✨',
                fields: [
                    {
                        key: 'suitable_for',
                        label_th: 'เหมาะสำหรับ',
                        label_en: 'Suitable For',
                        placeholder_th: 'เช่น ทำงานออฟฟิศ, เรียนออนไลน์, ตัดต่อวิดีโอ, เล่นเกมเบาๆ',
                        placeholder_en: 'e.g. Office work, online study, video editing, light gaming',
                        value: '',
                        editable: true,
                        removable: false,
                        type: 'text'
                    },
                    {
                        key: 'main_features',
                        label_th: 'จุดเด่น',
                        label_en: 'Main Features',
                        placeholder_th: 'เช่น เบา พกพาง่าย, แบตอึด, จอสวย',
                        placeholder_en: 'e.g. Lightweight, long battery life, great display',
                        value: '',
                        editable: true,
                        removable: true,
                        type: 'text'
                    },
                    {
                        key: 'usage_history',
                        label_th: 'ประวัติการใช้งาน',
                        label_en: 'Usage History',
                        placeholder_th: 'เช่น ใช้งานมา 1 ปี, ใช้ทำงาน WFH',
                        placeholder_en: 'e.g. Used for 1 year, used for WFH',
                        value: '',
                        editable: true,
                        removable: true,
                        type: 'text'
                    }
                ],
                collapsible: true,
                defaultOpen: true
            },
            {
                id: 'condition_notes',
                title_th: '📋 สภาพสินค้า',
                title_en: '📋 Condition Notes',
                icon: '📋',
                fields: COMMON_CONDITION_NOTES(),
                collapsible: true,
                defaultOpen: true
            },
            {
                id: 'delivery',
                title_th: '📦 อุปกรณ์และการส่ง',
                title_en: '📦 Extras & Delivery',
                icon: '📦',
                fields: COMMON_DELIVERY(),
                collapsible: true,
                defaultOpen: false
            }
        ],
        ai_helper: {
            short_description_th: 'โน๊ตบุ๊ค [ยี่ห้อ] [รุ่น] สภาพ [สภาพ] พร้อมใช้งาน',
            short_description_en: '[Brand] [Model] laptop in [Condition] condition, ready to use',
            posting_tip_th: '💡 ถ่ายรูปหน้าจอแสดงสเปกจะช่วยให้ผู้ซื้อมั่นใจมากขึ้น',
            posting_tip_en: '💡 Taking a screenshot of specs helps buyers feel more confident'
        }
    }
}

// 🚗 Car / Vehicle
function getVehicleTemplate(ctx: DescriptionContext): ProductDescriptionTemplate {
    return {
        sections: [
            {
                id: 'basic_info',
                title_th: '🚗 ข้อมูลรถ',
                title_en: '🚗 Vehicle Info',
                icon: '🚗',
                fields: [
                    {
                        key: 'brand',
                        label_th: 'ยี่ห้อ',
                        label_en: 'Brand',
                        placeholder_th: 'เช่น Toyota, Honda, Mazda',
                        placeholder_en: 'e.g. Toyota, Honda, Mazda',
                        value: '',
                        editable: true,
                        removable: false,
                        type: 'text'
                    },
                    {
                        key: 'model',
                        label_th: 'รุ่น',
                        label_en: 'Model',
                        placeholder_th: 'เช่น Camry 2.5G, Civic RS',
                        placeholder_en: 'e.g. Camry 2.5G, Civic RS',
                        value: '',
                        editable: true,
                        removable: false,
                        type: 'text'
                    },
                    {
                        key: 'year',
                        label_th: 'ปีจดทะเบียน',
                        label_en: 'Registration Year',
                        placeholder_th: 'เช่น 2563, 2020',
                        placeholder_en: 'e.g. 2020, 2021',
                        value: '',
                        editable: true,
                        removable: false,
                        type: 'text'
                    },
                    {
                        key: 'color',
                        label_th: 'สี',
                        label_en: 'Color',
                        placeholder_th: 'เช่น ขาว, ดำ, เทา',
                        placeholder_en: 'e.g. White, Black, Gray',
                        value: '',
                        editable: true,
                        removable: true,
                        type: 'text'
                    }
                ],
                collapsible: false,
                defaultOpen: true
            },
            {
                id: 'key_specs',
                title_th: '⚙️ สเปกหลัก',
                title_en: '⚙️ Key Specifications',
                icon: '⚙️',
                fields: [
                    {
                        key: 'mileage',
                        label_th: 'เลขไมล์',
                        label_en: 'Mileage',
                        placeholder_th: 'เช่น 50,000 กม.',
                        placeholder_en: 'e.g. 50,000 km',
                        value: '',
                        editable: true,
                        removable: false,
                        type: 'text'
                    },
                    {
                        key: 'fuel_type',
                        label_th: 'เชื้อเพลิง',
                        label_en: 'Fuel Type',
                        placeholder_th: '',
                        placeholder_en: '',
                        value: '',
                        editable: true,
                        removable: false,
                        type: 'select',
                        options: [
                            { value: 'gasoline', label_th: 'เบนซิน', label_en: 'Gasoline' },
                            { value: 'diesel', label_th: 'ดีเซล', label_en: 'Diesel' },
                            { value: 'hybrid', label_th: 'ไฮบริด', label_en: 'Hybrid' },
                            { value: 'electric', label_th: 'ไฟฟ้า', label_en: 'Electric' },
                            { value: 'lpg', label_th: 'LPG', label_en: 'LPG' }
                        ]
                    },
                    {
                        key: 'transmission',
                        label_th: 'เกียร์',
                        label_en: 'Transmission',
                        placeholder_th: '',
                        placeholder_en: '',
                        value: '',
                        editable: true,
                        removable: false,
                        type: 'select',
                        options: [
                            { value: 'auto', label_th: 'ออโต้', label_en: 'Automatic' },
                            { value: 'manual', label_th: 'ธรรมดา', label_en: 'Manual' },
                            { value: 'cvt', label_th: 'CVT', label_en: 'CVT' }
                        ]
                    },
                    {
                        key: 'engine',
                        label_th: 'เครื่องยนต์',
                        label_en: 'Engine',
                        placeholder_th: 'เช่น 2.5L, 1.8 Turbo',
                        placeholder_en: 'e.g. 2.5L, 1.8 Turbo',
                        value: '',
                        editable: true,
                        removable: true,
                        type: 'text'
                    }
                ],
                collapsible: true,
                defaultOpen: true
            },
            {
                id: 'condition_notes',
                title_th: '🔧 สภาพและการบำรุงรักษา',
                title_en: '🔧 Condition & Maintenance',
                icon: '🔧',
                fields: [
                    {
                        key: 'overall_condition',
                        label_th: 'สภาพโดยรวม',
                        label_en: 'Overall Condition',
                        placeholder_th: 'เช่น สภาพดี เจ้าของเดียว ไม่เคยชน',
                        placeholder_en: 'e.g. Good condition, single owner, no accidents',
                        value: '',
                        editable: true,
                        removable: false,
                        type: 'textarea'
                    },
                    {
                        key: 'maintenance',
                        label_th: 'ประวัติซ่อมบำรุง',
                        label_en: 'Maintenance History',
                        placeholder_th: 'เช่น เช็คระยะตามศูนย์ เปลี่ยนน้ำมันเครื่องทุก 10,000 กม.',
                        placeholder_en: 'e.g. Service at dealer, oil change every 10,000 km',
                        value: '',
                        editable: true,
                        removable: true,
                        type: 'textarea'
                    },
                    {
                        key: 'known_issues',
                        label_th: 'ข้อบกพร่องที่ทราบ (ถ้ามี)',
                        label_en: 'Known Issues (if any)',
                        placeholder_th: 'หากมีปัญหาหรือตำหนิ กรุณาระบุเพื่อความโปร่งใส',
                        placeholder_en: 'Please mention any issues for transparency',
                        value: '',
                        editable: true,
                        removable: true,
                        type: 'textarea'
                    }
                ],
                collapsible: true,
                defaultOpen: true
            },
            {
                id: 'usage_highlights',
                title_th: '👤 เหมาะสำหรับ',
                title_en: '👤 Suitable For',
                icon: '👤',
                fields: [
                    {
                        key: 'suitable_for',
                        label_th: 'เหมาะกับ',
                        label_en: 'Ideal For',
                        placeholder_th: 'เช่น ใช้งานในเมือง, ครอบครัว, ขับทางไกล',
                        placeholder_en: 'e.g. City driving, family use, long trips',
                        value: '',
                        editable: true,
                        removable: false,
                        type: 'text'
                    }
                ],
                collapsible: true,
                defaultOpen: true
            },
            {
                id: 'extras',
                title_th: '📝 หมายเหตุ',
                title_en: '📝 Notes',
                icon: '📝',
                fields: [
                    {
                        key: 'notes',
                        label_th: 'ข้อมูลเพิ่มเติม',
                        label_en: 'Additional Info',
                        placeholder_th: 'เช่น นัดดูรถได้, มีเล่มพร้อมโอน, รับเทิร์น',
                        placeholder_en: 'e.g. Viewing available, ready for transfer, trade-in welcome',
                        value: '',
                        editable: true,
                        removable: true,
                        type: 'textarea'
                    }
                ],
                collapsible: true,
                defaultOpen: false
            }
        ],
        ai_helper: {
            short_description_th: '[ยี่ห้อ] [รุ่น] ปี [ปี] สภาพ[สภาพ]',
            short_description_en: '[Year] [Brand] [Model] in [Condition] condition',
            posting_tip_th: '💡 ถ่ายรูปไมล์และเล่มทะเบียนจะช่วยสร้างความน่าเชื่อถือ',
            posting_tip_en: '💡 Photos of mileage and registration book build trust'
        }
    }
}

// 📱 Mobile Phone
function getMobileTemplate(ctx: DescriptionContext): ProductDescriptionTemplate {
    return {
        sections: [
            {
                id: 'basic_info',
                title_th: '📱 ข้อมูลเครื่อง',
                title_en: '📱 Device Info',
                icon: '📱',
                fields: [
                    ...COMMON_BASIC_INFO(ctx),
                    {
                        key: 'storage',
                        label_th: 'ความจุ',
                        label_en: 'Storage',
                        placeholder_th: 'เช่น 128GB, 256GB, 512GB',
                        placeholder_en: 'e.g. 128GB, 256GB, 512GB',
                        value: '',
                        editable: true,
                        removable: false,
                        type: 'text'
                    },
                    {
                        key: 'color',
                        label_th: 'สี',
                        label_en: 'Color',
                        placeholder_th: 'เช่น ดำ, ขาว, ทอง',
                        placeholder_en: 'e.g. Black, White, Gold',
                        value: '',
                        editable: true,
                        removable: true,
                        type: 'text'
                    }
                ],
                collapsible: false,
                defaultOpen: true
            },
            {
                id: 'key_specs',
                title_th: '🔋 สภาพแบตและเครื่อง',
                title_en: '🔋 Battery & Device Condition',
                icon: '🔋',
                fields: [
                    {
                        key: 'battery_health',
                        label_th: 'สุขภาพแบตเตอรี่',
                        label_en: 'Battery Health',
                        placeholder_th: 'เช่น 95%, 88%',
                        placeholder_en: 'e.g. 95%, 88%',
                        value: '',
                        editable: true,
                        removable: false,
                        type: 'text'
                    },
                    {
                        key: 'screen_condition',
                        label_th: 'สภาพหน้าจอ',
                        label_en: 'Screen Condition',
                        placeholder_th: 'เช่น ไม่มีรอยร้าว, มีรอยขีดเล็กน้อย',
                        placeholder_en: 'e.g. No cracks, minor scratches',
                        value: '',
                        editable: true,
                        removable: false,
                        type: 'text'
                    },
                    {
                        key: 'warranty',
                        label_th: 'ประกัน',
                        label_en: 'Warranty',
                        placeholder_th: 'เช่น ประกันเหลือ 3 เดือน, หมดประกัน',
                        placeholder_en: 'e.g. 3 months warranty left, expired',
                        value: '',
                        editable: true,
                        removable: true,
                        type: 'text'
                    }
                ],
                collapsible: true,
                defaultOpen: true
            },
            {
                id: 'condition_notes',
                title_th: '📋 สภาพสินค้า',
                title_en: '📋 Condition Notes',
                icon: '📋',
                fields: COMMON_CONDITION_NOTES(),
                collapsible: true,
                defaultOpen: true
            },
            {
                id: 'delivery',
                title_th: '📦 อุปกรณ์ที่มี',
                title_en: '📦 Included Items',
                icon: '📦',
                fields: [
                    {
                        key: 'included_items',
                        label_th: 'อุปกรณ์ในกล่อง',
                        label_en: 'Box Contents',
                        placeholder_th: 'เช่น กล่องครบ, สายชาร์จ, หัวชาร์จ, เคส',
                        placeholder_en: 'e.g. Full box, cable, adapter, case',
                        value: '',
                        editable: true,
                        removable: false,
                        type: 'text'
                    },
                    ...COMMON_DELIVERY().slice(1)
                ],
                collapsible: true,
                defaultOpen: false
            }
        ],
        ai_helper: {
            short_description_th: '[ยี่ห้อ] [รุ่น] [ความจุ] สี[สี] สภาพ[สภาพ]',
            short_description_en: '[Brand] [Model] [Storage] [Color] in [Condition] condition',
            posting_tip_th: '💡 ถ่ายภาพหน้าจอแสดง Battery Health จะช่วยให้ขายได้เร็วขึ้น',
            posting_tip_en: '💡 Screenshot of Battery Health helps sell faster'
        }
    }
}

// 🏠 Real Estate (House/Condo)
function getRealEstateTemplate(ctx: DescriptionContext): ProductDescriptionTemplate {
    return {
        sections: [
            {
                id: 'basic_info',
                title_th: '🏠 ข้อมูลที่พัก',
                title_en: '🏠 Property Info',
                icon: '🏠',
                fields: [
                    {
                        key: 'property_type',
                        label_th: 'ประเภท',
                        label_en: 'Type',
                        placeholder_th: '',
                        placeholder_en: '',
                        value: '',
                        editable: true,
                        removable: false,
                        type: 'select',
                        options: [
                            { value: 'house', label_th: 'บ้านเดี่ยว', label_en: 'House' },
                            { value: 'townhouse', label_th: 'ทาวน์เฮ้าส์', label_en: 'Townhouse' },
                            { value: 'condo', label_th: 'คอนโด', label_en: 'Condo' },
                            { value: 'land', label_th: 'ที่ดิน', label_en: 'Land' }
                        ]
                    },
                    {
                        key: 'listing_type',
                        label_th: 'ประเภทประกาศ',
                        label_en: 'Listing Type',
                        placeholder_th: '',
                        placeholder_en: '',
                        value: '',
                        editable: true,
                        removable: false,
                        type: 'select',
                        options: [
                            { value: 'sale', label_th: 'ขาย', label_en: 'For Sale' },
                            { value: 'rent', label_th: 'ให้เช่า', label_en: 'For Rent' }
                        ]
                    },
                    {
                        key: 'project_name',
                        label_th: 'ชื่อโครงการ/หมู่บ้าน',
                        label_en: 'Project/Village Name',
                        placeholder_th: 'เช่น เดอะ เบส, บ้านฟ้า',
                        placeholder_en: 'e.g. The Base, Baan Fah',
                        value: '',
                        editable: true,
                        removable: true,
                        type: 'text'
                    }
                ],
                collapsible: false,
                defaultOpen: true
            },
            {
                id: 'key_specs',
                title_th: '📐 ขนาดและห้อง',
                title_en: '📐 Size & Rooms',
                icon: '📐',
                fields: [
                    {
                        key: 'area',
                        label_th: 'พื้นที่ใช้สอย',
                        label_en: 'Usable Area',
                        placeholder_th: 'เช่น 35 ตร.ม., 150 ตร.วา',
                        placeholder_en: 'e.g. 35 sqm, 150 sq.wa',
                        value: '',
                        editable: true,
                        removable: false,
                        type: 'text'
                    },
                    {
                        key: 'bedrooms',
                        label_th: 'ห้องนอน',
                        label_en: 'Bedrooms',
                        placeholder_th: 'จำนวนห้อง',
                        placeholder_en: 'Number of bedrooms',
                        value: '',
                        editable: true,
                        removable: false,
                        type: 'text'
                    },
                    {
                        key: 'bathrooms',
                        label_th: 'ห้องน้ำ',
                        label_en: 'Bathrooms',
                        placeholder_th: 'จำนวนห้อง',
                        placeholder_en: 'Number of bathrooms',
                        value: '',
                        editable: true,
                        removable: false,
                        type: 'text'
                    },
                    {
                        key: 'floor',
                        label_th: 'ชั้น',
                        label_en: 'Floor',
                        placeholder_th: 'เช่น ชั้น 12, 2 ชั้น',
                        placeholder_en: 'e.g. Floor 12, 2 floors',
                        value: '',
                        editable: true,
                        removable: true,
                        type: 'text'
                    },
                    {
                        key: 'direction',
                        label_th: 'ทิศ',
                        label_en: 'Direction',
                        placeholder_th: 'เช่น ทิศเหนือ, วิวสระ',
                        placeholder_en: 'e.g. North, pool view',
                        value: '',
                        editable: true,
                        removable: true,
                        type: 'text'
                    }
                ],
                collapsible: true,
                defaultOpen: true
            },
            {
                id: 'condition_notes',
                title_th: '🏗️ สภาพห้อง',
                title_en: '🏗️ Room Condition',
                icon: '🏗️',
                fields: [
                    {
                        key: 'overall_condition',
                        label_th: 'สภาพโดยรวม',
                        label_en: 'Overall Condition',
                        placeholder_th: 'เช่น รีโนเวทใหม่, เฟอร์นิเจอร์ครบ',
                        placeholder_en: 'e.g. Newly renovated, fully furnished',
                        value: '',
                        editable: true,
                        removable: false,
                        type: 'textarea'
                    },
                    {
                        key: 'facilities',
                        label_th: 'สิ่งอำนวยความสะดวก',
                        label_en: 'Facilities',
                        placeholder_th: 'เช่น สระว่ายน้ำ, ฟิตเนส, รปภ. 24 ชม.',
                        placeholder_en: 'e.g. Pool, gym, 24hr security',
                        value: '',
                        editable: true,
                        removable: true,
                        type: 'text'
                    }
                ],
                collapsible: true,
                defaultOpen: true
            },
            {
                id: 'location',
                title_th: '📍 ทำเลและการเดินทาง',
                title_en: '📍 Location & Transport',
                icon: '📍',
                fields: [
                    {
                        key: 'location',
                        label_th: 'ทำเล',
                        label_en: 'Location',
                        placeholder_th: 'เช่น ใกล้ BTS อโศก, ห่างเซ็นทรัล 500 ม.',
                        placeholder_en: 'e.g. Near BTS Asoke, 500m from Central',
                        value: '',
                        editable: true,
                        removable: false,
                        type: 'text'
                    },
                    {
                        key: 'viewing',
                        label_th: 'นัดดู',
                        label_en: 'Viewing',
                        placeholder_th: 'เช่น นัดดูได้ทุกวัน, โทรนัดล่วงหน้า',
                        placeholder_en: 'e.g. Available daily, call to schedule',
                        value: '',
                        editable: true,
                        removable: true,
                        type: 'text'
                    }
                ],
                collapsible: true,
                defaultOpen: false
            }
        ],
        ai_helper: {
            short_description_th: '[ประเภท] [ขนาด] [จำนวนห้อง] [ทำเล]',
            short_description_en: '[Type] [Size] [Rooms] [Location]',
            posting_tip_th: '💡 ถ่ายรูปมุมกว้างแต่ละห้องและวิวจากหน้าต่างจะดึงดูดผู้ซื้อมากขึ้น',
            posting_tip_en: '💡 Wide-angle photos of each room and window views attract more buyers'
        }
    }
}

// 🔌 Appliances
function getApplianceTemplate(ctx: DescriptionContext): ProductDescriptionTemplate {
    return {
        sections: [
            {
                id: 'basic_info',
                title_th: '🔌 ข้อมูลสินค้า',
                title_en: '🔌 Product Info',
                icon: '🔌',
                fields: COMMON_BASIC_INFO(ctx),
                collapsible: false,
                defaultOpen: true
            },
            {
                id: 'key_specs',
                title_th: '⚡ สเปกหลัก',
                title_en: '⚡ Key Specifications',
                icon: '⚡',
                fields: [
                    {
                        key: 'capacity',
                        label_th: 'ขนาด/ความจุ',
                        label_en: 'Size/Capacity',
                        placeholder_th: 'เช่น 7 กก., 55 นิ้ว, 12,000 BTU',
                        placeholder_en: 'e.g. 7 kg, 55 inch, 12,000 BTU',
                        value: '',
                        editable: true,
                        removable: false,
                        type: 'text'
                    },
                    {
                        key: 'power',
                        label_th: 'ระบบไฟ',
                        label_en: 'Power System',
                        placeholder_th: 'เช่น 220V, Inverter',
                        placeholder_en: 'e.g. 220V, Inverter',
                        value: '',
                        editable: true,
                        removable: true,
                        type: 'text'
                    },
                    {
                        key: 'energy_rating',
                        label_th: 'ฉลากประหยัดไฟ',
                        label_en: 'Energy Rating',
                        placeholder_th: 'เช่น เบอร์ 5',
                        placeholder_en: 'e.g. 5 Star',
                        value: '',
                        editable: true,
                        removable: true,
                        type: 'text'
                    },
                    {
                        key: 'age_of_use',
                        label_th: 'ระยะเวลาใช้งาน',
                        label_en: 'Age of Use',
                        placeholder_th: 'เช่น ใช้มา 2 ปี',
                        placeholder_en: 'e.g. Used for 2 years',
                        value: '',
                        editable: true,
                        removable: true,
                        type: 'text'
                    }
                ],
                collapsible: true,
                defaultOpen: true
            },
            {
                id: 'condition_notes',
                title_th: '📋 สภาพสินค้า',
                title_en: '📋 Condition Notes',
                icon: '📋',
                fields: COMMON_CONDITION_NOTES(),
                collapsible: true,
                defaultOpen: true
            },
            {
                id: 'delivery',
                title_th: '📦 อุปกรณ์และการส่ง',
                title_en: '📦 Extras & Delivery',
                icon: '📦',
                fields: COMMON_DELIVERY(),
                collapsible: true,
                defaultOpen: false
            }
        ],
        ai_helper: {
            short_description_th: '[ยี่ห้อ] [รุ่น] [ขนาด] สภาพ[สภาพ]',
            short_description_en: '[Brand] [Model] [Size] in [Condition] condition',
            posting_tip_th: '💡 บอกว่าเครื่องใช้งานได้ปกติหรือไม่ จะช่วยให้ขายได้เร็วขึ้น',
            posting_tip_en: '💡 Stating if the appliance works normally helps sell faster'
        }
    }
}

// Default Template for other categories
function getDefaultTemplate(ctx: DescriptionContext): ProductDescriptionTemplate {
    return {
        sections: [
            {
                id: 'basic_info',
                title_th: '📦 ข้อมูลพื้นฐาน',
                title_en: '📦 Basic Info',
                icon: '📦',
                fields: COMMON_BASIC_INFO(ctx),
                collapsible: false,
                defaultOpen: true
            },
            {
                id: 'description',
                title_th: '📝 รายละเอียด',
                title_en: '📝 Description',
                icon: '📝',
                fields: [
                    {
                        key: 'description',
                        label_th: 'อธิบายสินค้า',
                        label_en: 'Product Description',
                        placeholder_th: 'อธิบายสินค้าของคุณ...',
                        placeholder_en: 'Describe your product...',
                        value: '',
                        editable: true,
                        removable: false,
                        type: 'textarea'
                    }
                ],
                collapsible: true,
                defaultOpen: true
            },
            {
                id: 'condition_notes',
                title_th: '📋 สภาพสินค้า',
                title_en: '📋 Condition Notes',
                icon: '📋',
                fields: COMMON_CONDITION_NOTES(),
                collapsible: true,
                defaultOpen: true
            },
            {
                id: 'delivery',
                title_th: '📦 การจัดส่ง',
                title_en: '📦 Delivery',
                icon: '📦',
                fields: COMMON_DELIVERY(),
                collapsible: true,
                defaultOpen: false
            }
        ],
        ai_helper: {
            short_description_th: '[ยี่ห้อ] [รุ่น] สภาพ[สภาพ]',
            short_description_en: '[Brand] [Model] in [Condition] condition',
            posting_tip_th: '💡 ยิ่งให้รายละเอียดมาก ยิ่งมีโอกาสขายได้เร็ว',
            posting_tip_en: '💡 More details = faster sale'
        }
    }
}

// ========================================
// TEMPLATE REGISTRY BY CATEGORY
// ========================================

export function getDescriptionTemplate(ctx: DescriptionContext): ProductDescriptionTemplate {
    const categoryId = ctx.categoryId

    switch (categoryId) {
        case 1: // Automotive
            return getVehicleTemplate(ctx)
        case 2: // Real Estate
            return getRealEstateTemplate(ctx)
        case 3: // Mobile
            return getMobileTemplate(ctx)
        case 4: // Computer
            return getComputerTemplate(ctx)
        case 5: // Appliances
            return getApplianceTemplate(ctx)
        default:
            return getDefaultTemplate(ctx)
    }
}

// ========================================
// BUILD DESCRIPTION TEXT FROM TEMPLATE
// ========================================

export function buildDescriptionText(
    template: ProductDescriptionTemplate,
    values: Record<string, string>,
    language: 'th' | 'en'
): string {
    const lines: string[] = []
    const isTh = language === 'th'

    for (const section of template.sections) {
        const sectionLines: string[] = []
        const title = isTh ? section.title_th : section.title_en

        for (const field of section.fields) {
            const value = values[field.key]
            if (value && value.trim()) {
                const label = isTh ? field.label_th : field.label_en

                // Handle select fields
                if (field.type === 'select' && field.options) {
                    const option = field.options.find(o => o.value === value)
                    const displayValue = option ? (isTh ? option.label_th : option.label_en) : value
                    sectionLines.push(`• ${label}: ${displayValue}`)
                } else if (field.type === 'textarea') {
                    // Textarea content goes as-is
                    sectionLines.push(`• ${value}`)
                } else {
                    sectionLines.push(`• ${label}: ${value}`)
                }
            }
        }

        if (sectionLines.length > 0) {
            lines.push(title)
            lines.push(...sectionLines)
            lines.push('')
        }
    }

    return lines.join('\n').trim()
}
