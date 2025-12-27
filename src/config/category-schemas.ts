/**
 * Category Schema Configuration
 * 
 * Defines dynamic form fields for each product category
 * with AI-assisted suggestions
 */

import { CategorySchema } from '@/types/dynamic-form'

// ============================================================================
// MOBILE & TABLETS (📱)
// ============================================================================

export const MOBILE_SCHEMA: CategorySchema = {
    categoryId: '3',
    categoryName: 'มือถือและแท็บเล็ต',
    icon: '📱',
    description: 'ฟอร์มนี้ออกแบบเฉพาะสำหรับสินค้าประเภทมือถือและแท็บเล็ต',

    fields: [
        // === CRITICAL FIELDS ===
        {
            id: 'brand',
            label: 'ยี่ห้อ',
            type: 'select',
            importance: 'critical',
            options: ['iPhone', 'Samsung', 'Oppo', 'Vivo', 'Xiaomi', 'Realme', 'Huawei', 'อื่นๆ'],
            aiPrompt: 'Extract phone brand from title and description',
            validation: { required: true }
        },
        {
            id: 'model',
            label: 'รุ่น',
            type: 'text',
            importance: 'critical',
            placeholder: 'เช่น iPhone 15 Pro Max, Galaxy S24 Ultra',
            aiPrompt: 'Extract exact model name',
            validation: { required: true }
        },
        {
            id: 'storage',
            label: 'ความจุ',
            type: 'select',
            importance: 'critical',
            options: ['64GB', '128GB', '256GB', '512GB', '1TB', '2TB'],
            aiPrompt: 'Identify storage capacity',
            validation: { required: true }
        },
        {
            id: 'condition',
            label: 'สภาพเครื่อง',
            type: 'select',
            importance: 'critical',
            options: [
                'ใหม่ ยังไม่แกะกล่อง',
                'ใหม่ แกะกล่องแล้ว',
                'มือสอง สภาพดีมาก (95%+)',
                'มือสอง สภาพดี (85-95%)',
                'มือสอง สภาพใช้งานได้ (70-85%)'
            ],
            aiPrompt: 'Determine device condition',
            validation: { required: true }
        },

        // === RECOMMENDED FIELDS ===
        {
            id: 'color',
            label: 'สี',
            type: 'text',
            importance: 'recommended',
            placeholder: 'เช่น Titanium Blue, Phantom Black',
            aiPrompt: 'Extract device color'
        },
        {
            id: 'warranty',
            label: 'ประกัน',
            type: 'select',
            importance: 'recommended',
            options: [
                'ยังอยู่ในประกัน (Apple/Samsung/แบรนด์)',
                'ยังอยู่ในประกัน (ร้านค้า)',
                'หมดประกันแล้ว',
                'ไม่มีประกัน'
            ],
            aiPrompt: 'Check warranty status'
        },
        {
            id: 'accessories',
            label: 'อุปกรณ์ที่มากับเครื่อง',
            type: 'multiselect',
            importance: 'recommended',
            options: [
                'กล่องเดิม',
                'สายชาร์จเดิม',
                'หัวชาร์จเดิม',
                'คู่มือ',
                'ซิมนีเดิล',
                'สติ๊กเกอร์เดิม',
                'เคส',
                'ฟิล์มกันรอย'
            ],
            aiPrompt: 'List included accessories'
        },

        // === OPTIONAL FIELDS ===
        {
            id: 'imei',
            label: 'IMEI',
            type: 'text',
            importance: 'optional',
            placeholder: '15 หลัก',
            helper: 'ช่วยเพิ่มความน่าเชื่อถือ (ไม่บังคับ)',
            maxLength: 15
        },
        {
            id: 'batteryHealth',
            label: 'Battery Health',
            type: 'number',
            importance: 'optional',
            min: 0,
            max: 100,
            suffix: '%',
            placeholder: '95',
            helper: 'สำหรับเครื่องมือสอง (iPhone/Android)',
            condition: { condition: 'มือสอง' }
        },
        {
            id: 'unlocked',
            label: 'ปลดล็อกซิม',
            type: 'boolean',
            importance: 'optional',
            label_true: 'ปลดล็อกแล้ว (ใช้ได้ทุกเครือข่าย)',
            label_false: 'ล็อกเครือข่าย'
        }
    ],

    aiInstructions: `
You are analyzing a mobile phone/tablet listing.
Extract and suggest the following information:
1. Brand (iPhone, Samsung, etc.)
2. Exact model name with variant
3. Storage capacity (64GB-2TB)
4. Device condition (new/used with percentage)
5. Color/variant
6. Warranty status and duration
7. Included accessories
8. IMEI if mentioned (15 digits)
9. Battery health if mentioned (for used devices)
10. SIM unlock status

Be precise with model names. Distinguish between Pro/Pro Max,  Plus, Ultra, etc.
Only fill fields you're >80% confident about.
  `
}

// ============================================================================
// VEHICLES (🚗)
// ============================================================================

export const VEHICLE_SCHEMA: CategorySchema = {
    categoryId: '1',
    categoryName: 'ยานยนต์',
    icon: '🚗',
    description: 'ฟอร์มนี้ออกแบบเฉพาะสำหรับสินค้าประเภทยานยนต์',

    fields: [
        // === CRITICAL FIELDS ===
        {
            id: 'vehicleType',
            label: 'ประเภทรถ',
            type: 'select',
            importance: 'critical',
            options: ['รถยนต์', 'มอเตอร์ไซค์', 'รถกระบะ'],
            validation: { required: true }
        },
        {
            id: 'brand',
            label: 'ยี่ห้อ',
            type: 'text',
            importance: 'critical',
            placeholder: 'เช่น Toyota, Honda, Mazda, Yamaha',
            validation: { required: true }
        },
        {
            id: 'model',
            label: 'รุ่น',
            type: 'text',
            importance: 'critical',
            placeholder: 'เช่น Camry, City, CX-5, Wave',
            validation: { required: true }
        },
        {
            id: 'year',
            label: 'ปีรถ (พ.ศ.)',
            type: 'number',
            importance: 'critical',
            min: 2500,
            max: new Date().getFullYear() + 544,
            placeholder: '2567',
            validation: { required: true }
        },
        {
            id: 'mileage',
            label: 'เลขไมล์',
            type: 'number',
            importance: 'critical',
            suffix: 'กม.',
            placeholder: '50000',
            validation: { required: true }
        },
        {
            id: 'transmission',
            label: 'เกียร์',
            type: 'select',
            importance: 'critical',
            options: ['ออโต้', 'ธรรมดา (Manual)', 'CVT'],
            validation: { required: true }
        },

        // === RECOMMENDED FIELDS ===
        {
            id: 'color',
            label: 'สี',
            type: 'text',
            importance: 'recommended',
            placeholder: 'เช่น ขาวมุก, ดำ, เงิน'
        },
        {
            id: 'engineSize',
            label: 'ขนาดเครื่องยนต์',
            type: 'text',
            importance: 'recommended',
            suffix: 'ซีซี',
            placeholder: '1500'
        },
        {
            id: 'fuelType',
            label: 'ประเภทเชื้อเพลิง',
            type: 'select',
            importance: 'recommended',
            options: ['เบนซิน', 'ดีเซล', 'ไฮบริด', 'ไฟฟ้า', 'LPG/NGV']
        },
        {
            id: 'ownership',
            label: 'มือ',
            type: 'select',
            importance: 'recommended',
            options: ['มือแรก', 'มือสอง', 'มือสาม', 'มือสี่+']
        },
        {
            id: 'serviceHistory',
            label: 'ประวัติการเซอร์วิส',
            type: 'boolean',
            importance: 'recommended',
            label_true: 'มีประวัติครบถ้วน',
            label_false: 'ไม่มีประวัติ / บางส่วน'
        },
        {
            id: 'accidentHistory',
            label: 'ประวัติอุบัติเหตุ',
            type: 'select',
            importance: 'recommended',
            options: [
                'ไม่เคยชน',
                'เคยชนเล็กน้อย (ซ่อมแล้ว)',
                'เคยช นหนัก (ซ่อมแล้ว)'
            ]
        },

        // === OPTIONAL FIELDS ===
        {
            id: 'licensePlate',
            label: 'ป้ายทะเบียน',
            type: 'text',
            importance: 'optional',
            placeholder: 'เช่น กก 1234 กทม',
            helper: 'ไม่จำเป็นต้องระบุ (สามารถปิดบังได้)'
        },
        {
            id: 'modifications',
            label: 'การดัดแปลง/อัพเกรด',
            type: 'tags',
            importance: 'optional',
            placeholder: 'เช่น ล้อแม็ก, ชุดแต่ง, เครื่องเสียง',
            maxTags: 10
        },
        {
            id: 'taxPaid',
            label: 'ภาษีรถยนต์',
            type: 'boolean',
            importance: 'optional',
            label_true: 'เสียภาษีแล้ว',
            label_false: 'ค้างชำระ'
        }
    ],

    aiInstructions: `
You are analyzing a vehicle listing (car/motorcycle).
Extract:
1. Vehicle type (car/motorcycle/pickup)
2. Brand and model
3. Year (BE format: 2567, 2566, etc.)
4. Mileage in kilometers
5. Transmission (auto/manual/CVT)
6. Color
7. Engine size in CC
8. Fuel type
9. Ownership (1st, 2nd, 3rd hand)
10. Service history status
11. Accident history
12. Any modifications or upgrades
13. Tax payment status

Be conservative with accident history - only mark if explicitly stated.
  `
}

// ============================================================================
// REAL ESTATE (🏢)
// ============================================================================

export const REAL_ESTATE_SCHEMA: CategorySchema = {
    categoryId: '2',
    categoryName: 'อสังหาริมทรัพย์',
    icon: '🏢',
    description: 'ฟอร์มนี้ออกแบบเฉพาะสำหรับสินค้าประเภทอสังหาริมทรัพย์',

    fields: [
        // === CRITICAL FIELDS ===
        {
            id: 'propertyType',
            label: 'ประเภททรัพย์',
            type: 'select',
            importance: 'critical',
            options: [
                'บ้านเดี่ยว',
                'คอนโด',
                'ทาวน์เฮาส์',
                'ที่ดิน',
                'อาคารพาณิชย์',
                'ห้องเช่า'
            ],
            validation: { required: true }
        },
        {
            id: 'size',
            label: 'ขนาดพื้นที่ใช้สอย',
            type: 'number',
            importance: 'critical',
            suffix: 'ตร.ม.',
            placeholder: '50',
            validation: { required: true }
        },
        {
            id: 'landSize',
            label: 'ขนาดที่ดิน',
            type: 'number',
            importance: 'critical',
            suffix: 'ตร.ว.',
            placeholder: '50',
            condition: { propertyType: ['บ้านเดี่ยว', 'ทาวน์เฮาส์', 'ที่ดิน'] }
        },
        {
            id: 'bedrooms',
            label: 'ห้องนอน',
            type: 'number',
            importance: 'critical',
            suffix: 'ห้อง',
            min: 0,
            max: 20,
            placeholder: '3',
            condition: { propertyType: ['บ้านเดี่ยว', 'คอนโด', 'ทาวน์เฮาส์'] }
        },
        {
            id: 'bathrooms',
            label: 'ห้องน้ำ',
            type: 'number',
            importance: 'critical',
            suffix: 'ห้อง',
            min: 0,
            max: 10,
            placeholder: '2',
            condition: { propertyType: ['บ้านเดี่ยว', 'คอนโด', 'ทาวน์เฮาส์'] }
        },
        {
            id: 'province',
            label: 'จังหวัด',
            type: 'text',
            importance: 'critical',
            placeholder: 'เช่น กรุงเทพมหานคร, เชียงใหม่',
            validation: { required: true }
        },
        {
            id: 'ownership',
            label: 'กรรมสิทธิ์',
            type: 'select',
            importance: 'critical',
            options: [
                'มีเอกสารสิทธิ์ (โฉนด)',
                'มีเอกสารสิทธิ์ (น.ส.3)',
                'มีเอกสารสิทธิ์ (ส.ค.1)',
                'อื่นๆ'
            ],
            validation: { required: true }
        },

        // === RECOMMENDED FIELDS ===
        {
            id: 'floor',
            label: 'ชั้น',
            type: 'number',
            importance: 'recommended',
            placeholder: '15',
            helper: 'สำหรับคอนโด/อาคารพาณิชย์',
            condition: { propertyType: ['คอนโด', 'อาคารพาณิชย์'] }
        },
        {
            id: 'totalFloors',
            label: 'จำนวนชั้นทั้งหมด',
            type: 'number',
            importance: 'recommended',
            placeholder: '3',
            condition: { propertyType: ['บ้านเดี่ยว', 'ทาวน์เฮาส์', 'อาคารพาณิชย์'] }
        },
        {
            id: 'parking',
            label: 'ที่จอดรถ',
            type: 'number',
            importance: 'recommended',
            suffix: 'คัน',
            placeholder: '2'
        },
        {
            id: 'furnished',
            label: 'เฟอร์นิเจอร์',
            type: 'select',
            importance: 'recommended',
            options: [
                'เฟอร์นิเจอร์ครบ (Fully Furnished)',
                'บางส่วน (Semi Furnished)',
                'ไม่มีเฟอร์นิเจอร์ (Unfurnished)'
            ]
        },
        {
            id: 'age',
            label: 'อายุอาคาร',
            type: 'number',
            importance: 'recommended',
            suffix: 'ปี',
            placeholder: '5'
        },

        // === OPTIONAL FIELDS ===
        {
            id: 'facilities',
            label: 'สิ่งอำนวยความสะดวก',
            type: 'multiselect',
            importance: 'optional',
            options: [
                ' สระว่ายน้ำ',
                'ฟิตเนส',
                'รปภ. 24 ชม.',
                'สวนส่วนกลาง',
                'ลิฟท์',
                'CCTV',
                'ที่จอดรถใต้ร่ม',
                'ห้องรับส่งพัสดุ'
            ]
        },
        {
            id: 'nearbyPlaces',
            label: 'สถานที่ใกล้เคียง',
            type: 'tags',
            importance: 'optional',
            placeholder: 'เช่น BTS, MRT, โรงพยาบาล, ห้าง',
            suggestions: ['BTS', 'MRT', 'โรงพยาบาล', 'โรงเรียน', 'ห้างสรรพสินค้า', 'ตลาด']
        },
        {
            id: 'monthlyFee',
            label: 'ค่าส่วนกลาง',
            type: 'number',
            importance: 'optional',
            suffix: '฿/เดือน',
            placeholder: '2500',
            condition: { propertyType: 'คอนโด' }
        }
    ],

    aiInstructions: `
You are analyzing a real estate listing.
Extract:
1. Property type (house, condo, townhouse, land, commercial)
2. Usable area in square meters
3. Land size in square wah (for houses/land)
4. Number of bedrooms and bathrooms
5. Province/location
6. Ownership documentation type (โฉนด, น.ส.3, etc.)
7. Floor number (for condos)
8. Total floors (for houses)
9. Parking spaces
10. Furniture status (fully/semi/unfurnished)
11. Building age
12. Available facilities
13. Nearby important places
14. Monthly common fee (for condos)

Focus on factual, verifiable information only.
  `
}

// ============================================================================
// Schema Registry
// ============================================================================

export const CATEGORY_SCHEMAS: Record<string, CategorySchema> = {
    '1': VEHICLE_SCHEMA,       // ยานยนต์
    '2': REAL_ESTATE_SCHEMA,   // อสังหาริมทรัพย์
    '3': MOBILE_SCHEMA,        // มือถือและแท็บเล็ต
    // Add more as we implement them
}

// ============================================================================
// Helper Functions
// ============================================================================

export function getCategorySchema(categoryId: string): CategorySchema | null {
    return CATEGORY_SCHEMAS[categoryId] || null
}

export function hasDynamicForm(categoryId: string): boolean {
    return categoryId in CATEGORY_SCHEMAS
}

export function getAllImplementedCategories(): string[] {
    return Object.keys(CATEGORY_SCHEMAS)
}

// Helper: Map category ID to slug
const CATEGORY_ID_TO_SLUG: Record<string, string> = {
    '1': 'automotive',
    '2': 'real-estate',
    '3': 'mobile-tablet',
    '4': 'computers',
    '5': 'appliances',
    '6': 'fashion',
    '7': 'gaming',
    '8': 'cameras',
    '9': 'amulets',
    '10': 'pets',
    '11': 'services',
    '12': 'sports',
    '13': 'home-garden',
    '14': 'beauty',
    '15': 'kids',
    '16': 'books',
}

export function mapCategoryIdToSlug(categoryId: string | number): string {
    const id = String(categoryId)
    return CATEGORY_ID_TO_SLUG[id] || 'other'
}


// ============================================================================
// Validation Functions
// ============================================================================

export function validateCategoryData(
    categoryId: string,
    data: Record<string, any>
): { isValid: boolean; errors: Record<string, string>; warnings: Record<string, string> } {
    const schema = getCategorySchema(categoryId)
    if (!schema) {
        return { isValid: true, errors: {}, warnings: {} }
    }

    const errors: Record<string, string> = {}
    const warnings: Record<string, string> = {}

    schema.fields.forEach(field => {
        const value = data[field.id]

        // Check required fields
        if (field.validation?.required && !value) {
            errors[field.id] = 'กรุณากรอกข้อมูลนี้'
            return
        }

        // Check field-specific validation
        if (value && field.validation?.custom) {
            const result = field.validation.custom(value)
            if (result !== true && typeof result === 'string') {
                errors[field.id] = result
            }
        }

        // Type-specific validation
        if (value) {
            if (field.type === 'number') {
                const numField = field as any
                if (numField.min !== undefined && value < numField.min) {
                    errors[field.id] = `ค่าต่ำสุดคือ ${numField.min}`
                }
                if (numField.max !== undefined && value > numField.max) {
                    errors[field.id] = `ค่าสูงสุดคือ ${numField.max}`
                }
            }
        }
    })

    return {
        isValid: Object.keys(errors).length === 0,
        errors,
        warnings
    }
}
