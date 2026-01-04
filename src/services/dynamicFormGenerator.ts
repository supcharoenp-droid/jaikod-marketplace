/**
 * Dynamic Product Detail AI
 * 
 * Generates structured detail fields based on product category
 * Adapts forms in real-time to optimize for each product type
 */

import { CATEGORIES } from '@/constants/categories'

export type FieldType = 'text' | 'number' | 'select' | 'multiselect' | 'textarea' | 'boolean' | 'date' | 'range'

export interface FormField {
    field_id: string
    field_name: {
        th: string
        en: string
    }
    field_type: FieldType
    placeholder?: {
        th: string
        en: string
    }
    options?: Array<{
        value: string
        label: {
            th: string
            en: string
        }
    }>
    validation?: {
        required: boolean
        min?: number
        max?: number
        pattern?: string
    }
    help_text?: {
        th: string
        en: string
    }
    trust_impact?: {
        th: string
        en: string
    }
}

export interface DynamicFormTemplate {
    category_id: number
    category_name: {
        th: string
        en: string
    }
    required_fields: FormField[]
    optional_fields: FormField[]
    ai_suggestion_fields: FormField[]
    category_notice_text: {
        th: string
        en: string
    }
    trust_boosters: {
        th: string[]
        en: string[]
    }
}

/**
 * Category-specific form templates
 */
const FORM_TEMPLATES: Record<number, DynamicFormTemplate> = {
    // Mobiles & Tablets
    3: {
        category_id: 3,
        category_name: { th: 'มือถือและแท็บเล็ต', en: 'Mobiles & Tablets' },
        required_fields: [
            {
                field_id: 'brand',
                field_name: { th: 'ยี่ห้อ', en: 'Brand' },
                field_type: 'select',
                options: [
                    { value: 'apple', label: { th: 'Apple (iPhone)', en: 'Apple (iPhone)' } },
                    { value: 'samsung', label: { th: 'Samsung', en: 'Samsung' } },
                    { value: 'huawei', label: { th: 'Huawei', en: 'Huawei' } },
                    { value: 'oppo', label: { th: 'OPPO', en: 'OPPO' } },
                    { value: 'vivo', label: { th: 'Vivo', en: 'Vivo' } },
                    { value: 'xiaomi', label: { th: 'Xiaomi', en: 'Xiaomi' } },
                    { value: 'other', label: { th: 'อื่นๆ', en: 'Other' } }
                ],
                validation: { required: true }
            },
            {
                field_id: 'model',
                field_name: { th: 'รุ่น', en: 'Model' },
                field_type: 'text',
                placeholder: { th: 'เช่น iPhone 13 Pro, Galaxy S23', en: 'e.g. iPhone 13 Pro, Galaxy S23' },
                validation: { required: true }
            },
            {
                field_id: 'storage',
                field_name: { th: 'ความจุ', en: 'Storage' },
                field_type: 'select',
                options: [
                    { value: '64gb', label: { th: '64GB', en: '64GB' } },
                    { value: '128gb', label: { th: '128GB', en: '128GB' } },
                    { value: '256gb', label: { th: '256GB', en: '256GB' } },
                    { value: '512gb', label: { th: '512GB', en: '512GB' } },
                    { value: '1tb', label: { th: '1TB', en: '1TB' } }
                ],
                validation: { required: true }
            },
            {
                field_id: 'color',
                field_name: { th: 'สี', en: 'Color' },
                field_type: 'text',
                placeholder: { th: 'เช่น สีดำ, สีขาว, น้ำเงิน', en: 'e.g. Black, White, Blue' },
                validation: { required: true }
            }
        ],
        optional_fields: [
            {
                field_id: 'warranty',
                field_name: { th: 'ประกัน', en: 'Warranty' },
                field_type: 'select',
                options: [
                    { value: 'thai', label: { th: 'ศูนย์ไทย', en: 'Thai Warranty' } },
                    { value: 'international', label: { th: 'ศูนย์สากล', en: 'International' } },
                    { value: 'expired', label: { th: 'หมดประกัน', en: 'Expired' } },
                    { value: 'none', label: { th: 'ไม่มีประกัน', en: 'No Warranty' } }
                ],
                trust_impact: { th: 'เพิ่มความน่าเชื่อถือ +15%', en: 'Increases trust +15%' }
            },
            {
                field_id: 'battery_health',
                field_name: { th: 'สุขภาพแบตเตอรี่', en: 'Battery Health' },
                field_type: 'number',
                placeholder: { th: 'เช่น 95%', en: 'e.g. 95%' },
                validation: { required: false, min: 0, max: 100 },
                help_text: { th: 'ดูได้ใน การตั้งค่า > แบตเตอรี่', en: 'Check in Settings > Battery' }
            },
            {
                field_id: 'accessories',
                field_name: { th: 'อุปกรณ์ที่มาด้วย', en: 'Included Accessories' },
                field_type: 'multiselect',
                options: [
                    { value: 'box', label: { th: 'กล่อง', en: 'Box' } },
                    { value: 'charger', label: { th: 'ที่ชาร์จ', en: 'Charger' } },
                    { value: 'cable', label: { th: 'สายชาร์จ', en: 'Cable' } },
                    { value: 'earphones', label: { th: 'หูฟัง', en: 'Earphones' } },
                    { value: 'manual', label: { th: 'คู่มือ', en: 'Manual' } }
                ]
            }
        ],
        ai_suggestion_fields: [
            {
                field_id: 'imei',
                field_name: { th: 'IMEI (เพิ่มความน่าเชื่อถือ)', en: 'IMEI (Builds Trust)' },
                field_type: 'text',
                placeholder: { th: 'โทร *#06# เพื่อดู', en: 'Dial *#06# to check' },
                trust_impact: { th: 'เพิ่มความน่าเชื่อถือ +25%', en: 'Increases trust +25%' },
                help_text: { th: 'ยืนยันว่าเครื่องไม่เคยติดแบล็คลิสต์', en: 'Confirms device is not blacklisted' }
            },
            {
                field_id: 'purchase_date',
                field_name: { th: 'วันที่ซื้อ (แนะนำ)', en: 'Purchase Date (Recommended)' },
                field_type: 'date',
                trust_impact: { th: 'ช่วยผู้ซื้อประเมินอายุเครื่อง', en: 'Helps buyers assess device age' }
            },
            {
                field_id: 'reason_selling',
                field_name: { th: 'เหตุผลที่ขาย', en: 'Reason for Selling' },
                field_type: 'textarea',
                placeholder: { th: 'เช่น อัพเกรดเครื่องใหม่, ใช้ซ้ำกับเครื่องเก่า', en: 'e.g. Upgrading, Have another device' },
                trust_impact: { th: 'สร้างความโปร่งใส', en: 'Builds transparency' }
            }
        ],
        category_notice_text: {
            th: '✨ ฟอร์มนี้ปรับให้เหมาะกับมือถือและแท็บเล็ตโดยเฉพาะ - ช่วยให้ขายได้เร็วขึ้น 45%',
            en: '✨ This form is optimized for mobiles & tablets - helps sell 45% faster'
        },
        trust_boosters: {
            th: [
                'ใส่ IMEI เพิ่มความน่าเชื่อถือ',
                'แสดงสุขภาพแบตเตอรี่',
                'ระบุประกันศูนย์ไทย',
                'แนบใบเสร็จ (ถ้ามี)'
            ],
            en: [
                'Add IMEI for trust',
                'Show battery health',
                'Specify Thai warranty',
                'Attach receipt if available'
            ]
        }
    },

    // Automotive
    1: {
        category_id: 1,
        category_name: { th: 'ยานยนต์', en: 'Automotive' },
        required_fields: [
            {
                field_id: 'brand',
                field_name: { th: 'ยี่ห้อรถ', en: 'Car Brand' },
                field_type: 'select',
                options: [
                    { value: 'toyota', label: { th: 'Toyota', en: 'Toyota' } },
                    { value: 'honda', label: { th: 'Honda', en: 'Honda' } },
                    { value: 'mazda', label: { th: 'Mazda', en: 'Mazda' } },
                    { value: 'nissan', label: { th: 'Nissan', en: 'Nissan' } },
                    { value: 'mitsubishi', label: { th: 'Mitsubishi', en: 'Mitsubishi' } },
                    { value: 'isuzu', label: { th: 'Isuzu', en: 'Isuzu' } },
                    { value: 'other', label: { th: 'อื่นๆ', en: 'Other' } }
                ],
                validation: { required: true }
            },
            {
                field_id: 'model',
                field_name: { th: 'รุ่น', en: 'Model' },
                field_type: 'text',
                placeholder: { th: 'เช่น Civic, Fortuner, CX-5', en: 'e.g. Civic, Fortuner, CX-5' },
                validation: { required: true }
            },
            {
                field_id: 'year',
                field_name: { th: 'ปีรถ', en: 'Year' },
                field_type: 'number',
                placeholder: { th: 'เช่น 2020, 2021', en: 'e.g. 2020, 2021' },
                validation: { required: true, min: 1990, max: new Date().getFullYear() + 1 }
            },
            {
                field_id: 'mileage',
                field_name: { th: 'เลขไมล์', en: 'Mileage' },
                field_type: 'number',
                placeholder: { th: 'เช่น 50000', en: 'e.g. 50000' },
                validation: { required: true, min: 0 },
                help_text: { th: 'กิโลเมตร (km)', en: 'Kilometers (km)' }
            }
        ],
        optional_fields: [
            {
                field_id: 'transmission',
                field_name: { th: 'เกียร์', en: 'Transmission' },
                field_type: 'select',
                options: [
                    { value: 'auto', label: { th: 'ออโต้', en: 'Automatic' } },
                    { value: 'manual', label: { th: 'ธรรมดา', en: 'Manual' } }
                ]
            },
            {
                field_id: 'fuel_type',
                field_name: { th: 'เชื้อเพลิง', en: 'Fuel Type' },
                field_type: 'select',
                options: [
                    { value: 'gasoline', label: { th: 'เบนซิน', en: 'Gasoline' } },
                    { value: 'diesel', label: { th: 'ดีเซล', en: 'Diesel' } },
                    { value: 'hybrid', label: { th: 'ไฮบริด', en: 'Hybrid' } },
                    { value: 'electric', label: { th: 'ไฟฟ้า', en: 'Electric' } }
                ]
            },
            {
                field_id: 'owner_count',
                field_name: { th: 'จำนวนมือ', en: 'Number of Owners' },
                field_type: 'select',
                options: [
                    { value: '1', label: { th: 'มือเดียว', en: 'First Owner' } },
                    { value: '2', label: { th: 'มือสอง', en: 'Second Owner' } },
                    { value: '3+', label: { th: 'มือสาม+', en: 'Third Owner+' } }
                ],
                trust_impact: { th: 'มือเดียวเพิ่มมูลค่า +10-15%', en: 'First owner adds +10-15% value' }
            }
        ],
        ai_suggestion_fields: [
            {
                field_id: 'service_history',
                field_name: { th: 'ประวัติการเซอร์วิส (แนะนำมาก)', en: 'Service History (Highly Recommended)' },
                field_type: 'textarea',
                placeholder: { th: 'เช่น เซอร์วิสตามศูนย์ทุกระยะ, เปลี่ยนยางทุกปี', en: 'e.g. Regular dealer service, tires replaced yearly' },
                trust_impact: { th: 'เพิ่มความน่าเชื่อถือ +30%', en: 'Increases trust +30%' }
            },
            {
                field_id: 'accident_history',
                field_name: { th: 'ประวัติอุบัติเหตุ', en: 'Accident History' },
                field_type: 'select',
                options: [
                    { value: 'none', label: { th: 'ไม่เคยชน', en: 'No Accidents' } },
                    { value: 'minor', label: { th: 'ชนเล็กน้อย', en: 'Minor' } },
                    { value: 'major', label: { th: 'ชนหนัก', en: 'Major' } }
                ],
                help_text: { th: 'ความโปร่งใสสร้างความไว้วางใจ', en: 'Transparency builds trust' }
            }
        ],
        category_notice_text: {
            th: '🚗 ฟอร์มนี้ปรับให้เหมาะกับรถยนต์โดยเฉพาะ - ข้อมูลครบช่วยขายเร็วขึ้น 60%',
            en: '🚗 This form is optimized for vehicles - complete info helps sell 60% faster'
        },
        trust_boosters: {
            th: [
                'ระบุประวัติเซอร์วิส',
                'แจ้งประวัติอุบัติเหตุตรงไป ตรงมา',
                'แสดงเล่มทะเบียน',
                'รับประกันเครื่องยนต์'
            ],
            en: [
                'Specify service history',
                'Honest about accidents',
                'Show registration book',
                'Engine warranty'
            ]
        }
    },

    // Real Estate (simplified for demonstration)
    2: {
        category_id: 2,
        category_name: { th: 'อสังหาริมทรัพย์', en: 'Real Estate' },
        required_fields: [
            {
                field_id: 'property_type',
                field_name: { th: 'ประเภท', en: 'Property Type' },
                field_type: 'select',
                options: [
                    { value: 'condo', label: { th: 'คอนโด', en: 'Condo' } },
                    { value: 'house', label: { th: 'บ้านเดี่ยว', en: 'House' } },
                    { value: 'townhouse', label: { th: 'ทาวน์เฮ้าส์', en: 'Townhouse' } },
                    { value: 'land', label: { th: 'ที่ดิน', en: 'Land' } }
                ],
                validation: { required: true }
            },
            {
                field_id: 'bedrooms',
                field_name: { th: 'จำนวนห้องนอน', en: 'Bedrooms' },
                field_type: 'number',
                validation: { required: true, min: 0, max: 20 }
            },
            {
                field_id: 'area',
                field_name: { th: 'พื้นที่ (ตร.ม.)', en: 'Area (sqm)' },
                field_type: 'number',
                validation: { required: true, min: 1 }
            }
        ],
        optional_fields: [
            {
                field_id: 'floor',
                field_name: { th: 'ชั้น', en: 'Floor' },
                field_type: 'number'
            }
        ],
        ai_suggestion_fields: [
            {
                field_id: 'near_bts_mrt',
                field_name: { th: 'ใกล้ BTS/MRT (แนะนำมาก)', en: 'Near BTS/MRT (Highly Recommended)' },
                field_type: 'text',
                placeholder: { th: 'เช่น BTS อโศก 500ม.', en: 'e.g. 500m from BTS Asoke' },
                trust_impact: { th: 'เพิ่มมูลค่า +20-30%', en: 'Adds +20-30% value' }
            }
        ],
        category_notice_text: {
            th: '🏠 ฟอร์มนี้ปรับให้เหมาะกับอสังหาริมทรัพย์ - ข้อมูลครบช่วยขายเร็วขึ้น 50%',
            en: '🏠 This form is optimized for real estate - complete info helps sell 50% faster'
        },
        trust_boosters: {
            th: ['ระบุระยะทางจาก BTS/MRT', 'แสดงโฉนดที่ดิน', 'ข้อมูลค่าส่วนกลาง'],
            en: ['Distance to BTS/MRT', 'Show land title', 'Common fees info']
        }
    }
}

/**
 * Get dynamic form template for category
 */
export function getDynamicFormTemplate(categoryId: number): DynamicFormTemplate {
    // Get specific template
    const template = FORM_TEMPLATES[categoryId]

    if (template) {
        return template
    }

    // Return generic template
    return createGenericTemplate(categoryId)
}

/**
 * Create generic template for categories without specific forms
 */
function createGenericTemplate(categoryId: number): DynamicFormTemplate {
    const category = CATEGORIES.find(c => c.id === categoryId)

    return {
        category_id: categoryId,
        category_name: category ? {
            th: category.name_th,
            en: category.name_en
        } : {
            th: 'ทั่วไป',
            en: 'General'
        },
        required_fields: [
            {
                field_id: 'brand',
                field_name: { th: 'ยี่ห้อ/แบรนด์', en: 'Brand' },
                field_type: 'text',
                placeholder: { th: 'ระบุยี่ห้อ', en: 'Specify brand' },
                validation: { required: false }
            }
        ],
        optional_fields: [
            {
                field_id: 'warranty',
                field_name: { th: 'ประกัน', en: 'Warranty' },
                field_type: 'text',
                placeholder: { th: 'เช่น ประกัน 1 ปี', en: 'e.g. 1 year warranty' }
            }
        ],
        ai_suggestion_fields: [
            {
                field_id: 'purchase_receipt',
                field_name: { th: 'ใบเสร็จการซื้อ (เพิ่มความน่าเชื่อถือ)', en: 'Purchase Receipt (Builds Trust)' },
                field_type: 'boolean',
                trust_impact: { th: 'เพิ่มความน่าเชื่อถือ +20%', en: 'Increases trust +20%' }
            }
        ],
        category_notice_text: {
            th: '📝 ฟอร์มทั่วไป - กรอกรายละเอียดให้ครบถ้วนเพื่อขายได้เร็ว',
            en: '📝 General form - Complete all details for faster sale'
        },
        trust_boosters: {
            th: ['ใส่รายละเอียดครบถ้วน', 'แสดงใบเสร็จ', 'ระบุสภาพตรงไปตรงมา'],
            en: ['Complete all details', 'Show receipt', 'Honest condition description']
        }
    }
}

/**
 * Get field completion status
 */
export function calculateFieldCompletion(
    template: DynamicFormTemplate,
    filledFields: Record<string, any>
): {
    completion_percentage: number
    required_completion: number
    optional_completion: number
    ai_suggestion_completion: number
    missing_critical: string[]
} {
    const requiredFilled = template.required_fields.filter(f =>
        filledFields[f.field_id] !== undefined && filledFields[f.field_id] !== ''
    ).length

    const optionalFilled = template.optional_fields.filter(f =>
        filledFields[f.field_id] !== undefined && filledFields[f.field_id] !== ''
    ).length

    const aiSuggestionFilled = template.ai_suggestion_fields.filter(f =>
        filledFields[f.field_id] !== undefined && filledFields[f.field_id] !== ''
    ).length

    const totalFields = template.required_fields.length +
        template.optional_fields.length +
        template.ai_suggestion_fields.length

    const totalFilled = requiredFilled + optionalFilled + aiSuggestionFilled

    const missingCritical = template.required_fields
        .filter(f => !filledFields[f.field_id])
        .map(f => f.field_id)

    return {
        completion_percentage: Math.round((totalFilled / totalFields) * 100),
        required_completion: Math.round((requiredFilled / template.required_fields.length) * 100),
        optional_completion: template.optional_fields.length > 0
            ? Math.round((optionalFilled / template.optional_fields.length) * 100)
            : 0,
        ai_suggestion_completion: template.ai_suggestion_fields.length > 0
            ? Math.round((aiSuggestionFilled / template.ai_suggestion_fields.length) * 100)
            : 0,
        missing_critical: missingCritical
    }
}

/**
 * Get smart field suggestions based on filled data
 */
export function getSmartFieldSuggestions(
    template: DynamicFormTemplate,
    filledFields: Record<string, any>
): {
    field_id: string
    suggestion_text: { th: string; en: string }
    impact: { th: string; en: string }
}[] {
    const suggestions: any[] = []

    // Check AI suggestion fields
    for (const field of template.ai_suggestion_fields) {
        if (!filledFields[field.field_id] && field.trust_impact) {
            suggestions.push({
                field_id: field.field_id,
                suggestion_text: {
                    th: `💡 เพิ่ม "${field.field_name.th}" เพื่อ${field.trust_impact.th}`,
                    en: `💡 Add "${field.field_name.en}" to ${field.trust_impact.en}`
                },
                impact: field.trust_impact
            })
        }
    }

    return suggestions.slice(0, 3) // Top 3 suggestions
}

/**
 * Validate form data against template
 */
export function validateFormData(
    template: DynamicFormTemplate,
    formData: Record<string, any>
): {
    is_valid: boolean
    errors: Array<{
        field_id: string
        message: { th: string; en: string }
    }>
    warnings: Array<{
        field_id: string
        message: { th: string; en: string }
    }>
} {
    const errors: any[] = []
    const warnings: any[] = []

    // Check required fields
    for (const field of template.required_fields) {
        const value = formData[field.field_id]

        if (!value || value === '') {
            errors.push({
                field_id: field.field_id,
                message: {
                    th: `กรุณากรอก ${field.field_name.th}`,
                    en: `Please fill ${field.field_name.en}`
                }
            })
        }

        // Type-specific validation
        if (field.validation) {
            if (field.field_type === 'number' && typeof value === 'number') {
                if (field.validation.min !== undefined && value < field.validation.min) {
                    errors.push({
                        field_id: field.field_id,
                        message: {
                            th: `${field.field_name.th} ต้องมากกว่า ${field.validation.min}`,
                            en: `${field.field_name.en} must be greater than ${field.validation.min}`
                        }
                    })
                }
                if (field.validation.max !== undefined && value > field.validation.max) {
                    errors.push({
                        field_id: field.field_id,
                        message: {
                            th: `${field.field_name.th} ต้องน้อยกว่า ${field.validation.max}`,
                            en: `${field.field_name.en} must be less than ${field.validation.max}`
                        }
                    })
                }
            }
        }
    }

    // Check AI suggestion fields (warnings only)
    for (const field of template.ai_suggestion_fields) {
        if (!formData[field.field_id]) {
            warnings.push({
                field_id: field.field_id,
                message: {
                    th: `แนะนำให้กรอก ${field.field_name.th}`,
                    en: `Recommended to fill ${field.field_name.en}`
                }
            })
        }
    }

    return {
        is_valid: errors.length === 0,
        errors,
        warnings
    }
}
