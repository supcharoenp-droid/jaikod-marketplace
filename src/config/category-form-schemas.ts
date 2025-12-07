/**
 * Category-Specific Form Schemas
 * กำหนดฟิลด์และการตรวจสอบสำหรับแต่ละประเภทสินค้า
 */

export interface FormField {
    name: string;
    label: string;
    type: 'text' | 'number' | 'select' | 'checkbox' | 'date' | 'textarea' | 'file';
    required: boolean;
    placeholder?: string;
    options?: { value: string; label: string }[];
    min?: number;
    max?: number;
    unit?: string;
    helpText?: string;
    validation?: (value: any) => string | null;
}

export interface CategoryFormSchema {
    categoryId: string;
    sections: {
        title: string;
        icon: string;
        fields: FormField[];
    }[];
    specialFeatures?: string[];  // ฟีเจอร์พิเศษที่ต้องแสดง
}

// ========================================
// 1. รถยนต์ (Cars)
// ========================================

export const CAR_FORM_SCHEMA: CategoryFormSchema = {
    categoryId: 'cars',
    sections: [
        {
            title: 'ข้อมูลพื้นฐาน',
            icon: '🚗',
            fields: [
                {
                    name: 'brand',
                    label: 'ยี่ห้อ',
                    type: 'select',
                    required: true,
                    options: [
                        { value: 'toyota', label: 'Toyota' },
                        { value: 'honda', label: 'Honda' },
                        { value: 'nissan', label: 'Nissan' },
                        { value: 'mazda', label: 'Mazda' },
                        { value: 'mitsubishi', label: 'Mitsubishi' },
                    ]
                },
                {
                    name: 'model',
                    label: 'รุ่น',
                    type: 'text',
                    required: true,
                    placeholder: 'เช่น Civic, Almera, Yaris'
                },
                {
                    name: 'year',
                    label: 'ปี',
                    type: 'number',
                    required: true,
                    min: 1990,
                    max: new Date().getFullYear() + 1,
                    validation: (value) => {
                        const year = parseInt(value);
                        if (year < 1990) return 'ปีต้องไม่น้อยกว่า 1990';
                        if (year > new Date().getFullYear() + 1) return 'ปีไม่ถูกต้อง';
                        return null;
                    }
                },
                {
                    name: 'color',
                    label: 'สี',
                    type: 'text',
                    required: true,
                    placeholder: 'เช่น ขาว, ดำ, เทา'
                }
            ]
        },
        {
            title: 'รายละเอียดเครื่องยนต์',
            icon: '⚙️',
            fields: [
                {
                    name: 'mileage',
                    label: 'เลขไมล์',
                    type: 'number',
                    required: true,
                    unit: 'km',
                    min: 0,
                    helpText: 'ระบุเลขไมล์ปัจจุบันของรถ'
                },
                {
                    name: 'transmission',
                    label: 'เกียร์',
                    type: 'select',
                    required: true,
                    options: [
                        { value: 'manual', label: 'เกียร์ธรรมดา (Manual)' },
                        { value: 'automatic', label: 'เกียร์อัตโนมัติ (Automatic)' },
                        { value: 'cvt', label: 'CVT' }
                    ]
                },
                {
                    name: 'fuelType',
                    label: 'เชื้อเพลิง',
                    type: 'select',
                    required: true,
                    options: [
                        { value: 'gasoline', label: 'เบนซิน' },
                        { value: 'diesel', label: 'ดีเซล' },
                        { value: 'hybrid', label: 'ไฮบริด' },
                        { value: 'electric', label: 'ไฟฟ้า' }
                    ]
                },
                {
                    name: 'engineSize',
                    label: 'ขนาดเครื่องยนต์',
                    type: 'number',
                    required: false,
                    unit: 'cc',
                    placeholder: 'เช่น 1500, 2000'
                }
            ]
        },
        {
            title: 'เอกสารและประวัติ',
            icon: '📋',
            fields: [
                {
                    name: 'registrationProvince',
                    label: 'ทะเบียนจังหวัด',
                    type: 'text',
                    required: true,
                    placeholder: 'เช่น กรุงเทพฯ, เชียงใหม่'
                },
                {
                    name: 'taxPaid',
                    label: 'ภาษีจ่ายแล้ว',
                    type: 'checkbox',
                    required: false
                },
                {
                    name: 'hasServiceHistory',
                    label: 'มีประวัติการเข้าศูนย์',
                    type: 'checkbox',
                    required: false,
                    helpText: 'มีเอกสารแสดงการเข้าศูนย์บริการ'
                },
                {
                    name: 'accidents',
                    label: 'จำนวนครั้งที่เคยชน',
                    type: 'number',
                    required: false,
                    min: 0,
                    helpText: 'ระบุ 0 ถ้าไม่เคยชน'
                }
            ]
        },
        {
            title: 'สภาพรถ',
            icon: '✨',
            fields: [
                {
                    name: 'condition',
                    label: 'สภาพโดยรวม',
                    type: 'select',
                    required: true,
                    options: [
                        { value: 'excellent', label: 'สภาพดีเยี่ยม' },
                        { value: 'very-good', label: 'สภาพดีมาก' },
                        { value: 'good', label: 'สภาพดี' },
                        { value: 'fair', label: 'สภาพใช้งานได้' },
                        { value: 'needs-repair', label: 'ต้องซ่อม' }
                    ]
                },
                {
                    name: 'interiorCondition',
                    label: 'สภาพภายใน',
                    type: 'select',
                    required: true,
                    options: [
                        { value: 'excellent', label: 'ดีเยี่ยม' },
                        { value: 'good', label: 'ดี' },
                        { value: 'fair', label: 'พอใช้' },
                        { value: 'poor', label: 'ไม่ดี' }
                    ]
                },
                {
                    name: 'exteriorCondition',
                    label: 'สภาพภายนอก',
                    type: 'select',
                    required: true,
                    options: [
                        { value: 'excellent', label: 'ดีเยี่ยม' },
                        { value: 'good', label: 'ดี' },
                        { value: 'fair', label: 'พอใช้' },
                        { value: 'poor', label: 'ไม่ดี' }
                    ]
                }
            ]
        }
    ],
    specialFeatures: ['vin-checker', '360-view', 'finance-calculator']
};

// ========================================
// 2. โทรศัพท์มือถือ (Mobiles)
// ========================================

export const MOBILE_FORM_SCHEMA: CategoryFormSchema = {
    categoryId: 'mobiles',
    sections: [
        {
            title: 'ข้อมูลพื้นฐาน',
            icon: '📱',
            fields: [
                {
                    name: 'brand',
                    label: 'ยี่ห้อ',
                    type: 'select',
                    required: true,
                    options: [
                        { value: 'apple', label: 'Apple' },
                        { value: 'samsung', label: 'Samsung' },
                        { value: 'xiaomi', label: 'Xiaomi' },
                        { value: 'oppo', label: 'OPPO' },
                        { value: 'vivo', label: 'Vivo' },
                    ]
                },
                {
                    name: 'model',
                    label: 'รุ่น',
                    type: 'text',
                    required: true,
                    placeholder: 'เช่น iPhone 13 Pro Max, Galaxy S21'
                },
                {
                    name: 'storage',
                    label: 'ความจุ',
                    type: 'select',
                    required: true,
                    options: [
                        { value: '64GB', label: '64GB' },
                        { value: '128GB', label: '128GB' },
                        { value: '256GB', label: '256GB' },
                        { value: '512GB', label: '512GB' },
                        { value: '1TB', label: '1TB' }
                    ]
                },
                {
                    name: 'color',
                    label: 'สี',
                    type: 'text',
                    required: true,
                    placeholder: 'เช่น Sierra Blue, Phantom Black'
                }
            ]
        },
        {
            title: 'สภาพเครื่อง',
            icon: '💚',
            fields: [
                {
                    name: 'batteryHealth',
                    label: 'สุขภาพแบตเตอรี่',
                    type: 'number',
                    required: true,
                    min: 0,
                    max: 100,
                    unit: '%',
                    helpText: 'ดูได้จาก Settings > Battery > Battery Health'
                },
                {
                    name: 'screenCondition',
                    label: 'สภาพหน้าจอ',
                    type: 'select',
                    required: true,
                    options: [
                        { value: 'perfect', label: 'ไม่มีรอยขีดข่วน' },
                        { value: 'minor-scratches', label: 'รอยเล็กน้อย' },
                        { value: 'scratches', label: 'มีรอยขีดข่วน' },
                        { value: 'cracked', label: 'แตก' }
                    ]
                },
                {
                    name: 'bodyCondition',
                    label: 'สภาพตัวเครื่อง',
                    type: 'select',
                    required: true,
                    options: [
                        { value: 'perfect', label: 'สวยมาก' },
                        { value: 'good', label: 'ดี' },
                        { value: 'fair', label: 'พอใช้' },
                        { value: 'poor', label: 'มีรอยชำรุด' }
                    ]
                },
                {
                    name: 'faceIdWorking',
                    label: 'Face ID ใช้งานได้',
                    type: 'checkbox',
                    required: false
                },
                {
                    name: 'touchIdWorking',
                    label: 'Touch ID ใช้งานได้',
                    type: 'checkbox',
                    required: false
                }
            ]
        },
        {
            title: 'อุปกรณ์ในกล่อง',
            icon: '📦',
            fields: [
                {
                    name: 'hasBox',
                    label: 'มีกล่อง',
                    type: 'checkbox',
                    required: false
                },
                {
                    name: 'hasCharger',
                    label: 'มีหัวชาร์จ',
                    type: 'checkbox',
                    required: false
                },
                {
                    name: 'hasCable',
                    label: 'มีสายชาร์จ',
                    type: 'checkbox',
                    required: false
                },
                {
                    name: 'hasEarphones',
                    label: 'มีหูฟัง',
                    type: 'checkbox',
                    required: false
                }
            ]
        },
        {
            title: 'การรับประกัน',
            icon: '🛡️',
            fields: [
                {
                    name: 'warranty',
                    label: 'การรับประกัน',
                    type: 'select',
                    required: true,
                    options: [
                        { value: 'expired', label: 'หมดประกันแล้ว' },
                        { value: '3-months', label: 'เหลือ 3 เดือน' },
                        { value: '6-months', label: 'เหลือ 6 เดือน' },
                        { value: '12-months', label: 'เหลือ 12 เดือน' }
                    ]
                },
                {
                    name: 'purchaseDate',
                    label: 'วันที่ซื้อ',
                    type: 'date',
                    required: false,
                    helpText: 'ช่วยในการประเมินราคาที่แม่นยำขึ้น'
                }
            ]
        }
    ],
    specialFeatures: ['imei-checker', 'battery-verification', 'price-history']
};

// ========================================
// 3. อสังหาริมทรัพย์ (Real Estate)
// ========================================

export const REAL_ESTATE_FORM_SCHEMA: CategoryFormSchema = {
    categoryId: 'real-estate',
    sections: [
        {
            title: 'ประเภทและขนาด',
            icon: '🏠',
            fields: [
                {
                    name: 'type',
                    label: 'ประเภท',
                    type: 'select',
                    required: true,
                    options: [
                        { value: 'condo', label: 'คอนโด' },
                        { value: 'house', label: 'บ้านเดี่ยว' },
                        { value: 'townhouse', label: 'ทาวน์เฮ้าส์' },
                        { value: 'land', label: 'ที่ดิน' }
                    ]
                },
                {
                    name: 'area',
                    label: 'พื้นที่',
                    type: 'number',
                    required: true,
                    unit: 'ตร.ม.',
                    min: 1
                },
                {
                    name: 'usableArea',
                    label: 'พื้นที่ใช้สอย',
                    type: 'number',
                    required: false,
                    unit: 'ตร.ม.',
                    helpText: 'สำหรับคอนโด'
                },
                {
                    name: 'bedrooms',
                    label: 'ห้องนอน',
                    type: 'number',
                    required: true,
                    min: 0
                },
                {
                    name: 'bathrooms',
                    label: 'ห้องน้ำ',
                    type: 'number',
                    required: true,
                    min: 0
                }
            ]
        },
        {
            title: 'ที่ตั้ง',
            icon: '📍',
            fields: [
                {
                    name: 'province',
                    label: 'จังหวัด',
                    type: 'text',
                    required: true
                },
                {
                    name: 'district',
                    label: 'เขต/อำเภอ',
                    type: 'text',
                    required: true
                },
                {
                    name: 'nearBTS',
                    label: 'ใกล้ BTS',
                    type: 'checkbox',
                    required: false
                },
                {
                    name: 'nearMRT',
                    label: 'ใกล้ MRT',
                    type: 'checkbox',
                    required: false
                },
                {
                    name: 'distanceToStation',
                    label: 'ระยะทางถึงสถานี',
                    type: 'number',
                    required: false,
                    unit: 'เมตร',
                    helpText: 'ถ้าใกล้ BTS/MRT'
                }
            ]
        },
        {
            title: 'รายละเอียดอาคาร',
            icon: '🏢',
            fields: [
                {
                    name: 'buildingName',
                    label: 'ชื่ออาคาร',
                    type: 'text',
                    required: false,
                    placeholder: 'สำหรับคอนโด'
                },
                {
                    name: 'floor',
                    label: 'ชั้น',
                    type: 'number',
                    required: false,
                    min: 1
                },
                {
                    name: 'facing',
                    label: 'ทิศที่หันออก',
                    type: 'select',
                    required: false,
                    options: [
                        { value: 'north', label: 'เหนือ' },
                        { value: 'south', label: 'ใต้' },
                        { value: 'east', label: 'ตะวันออก' },
                        { value: 'west', label: 'ตะวันตก' }
                    ]
                }
            ]
        },
        {
            title: 'ราคาและค่าใช้จ่าย',
            icon: '💰',
            fields: [
                {
                    name: 'price',
                    label: 'ราคา',
                    type: 'number',
                    required: true,
                    unit: 'บาท',
                    min: 0
                },
                {
                    name: 'commonFee',
                    label: 'ค่าส่วนกลาง',
                    type: 'number',
                    required: false,
                    unit: 'บาท/เดือน',
                    helpText: 'สำหรับคอนโด'
                },
                {
                    name: 'transferFee',
                    label: 'ค่าโอน',
                    type: 'select',
                    required: true,
                    options: [
                        { value: 'seller', label: 'ผู้ขายจ่าย' },
                        { value: 'buyer', label: 'ผู้ซื้อจ่าย' },
                        { value: 'split', label: 'จ่ายคนละครึ่ง' }
                    ]
                }
            ]
        }
    ],
    specialFeatures: ['virtual-tour', 'floor-plan', 'mortgage-calculator', 'location-map']
};

// ========================================
// Helper Functions
// ========================================

/**
 * ดึง Form Schema ตามประเภทสินค้า
 */
export function getCategoryFormSchema(categoryId: string): CategoryFormSchema | null {
    const schemas: Record<string, CategoryFormSchema> = {
        'cars': CAR_FORM_SCHEMA,
        'mobiles': MOBILE_FORM_SCHEMA,
        'real-estate': REAL_ESTATE_FORM_SCHEMA,
        // เพิ่มประเภทอื่นๆ ตามต้องการ
    };

    return schemas[categoryId] || null;
}

/**
 * Validate form data ตาม schema
 */
export function validateFormData(
    categoryId: string,
    formData: Record<string, any>
): { isValid: boolean; errors: Record<string, string> } {
    const schema = getCategoryFormSchema(categoryId);
    if (!schema) {
        return { isValid: true, errors: {} };
    }

    const errors: Record<string, string> = {};

    schema.sections.forEach(section => {
        section.fields.forEach(field => {
            const value = formData[field.name];

            // Check required
            if (field.required && (value === undefined || value === null || value === '')) {
                errors[field.name] = `${field.label} จำเป็นต้องกรอก`;
                return;
            }

            // Check custom validation
            if (field.validation && value) {
                const error = field.validation(value);
                if (error) {
                    errors[field.name] = error;
                }
            }

            // Check min/max for numbers
            if (field.type === 'number' && value !== undefined && value !== null) {
                const numValue = Number(value);
                if (field.min !== undefined && numValue < field.min) {
                    errors[field.name] = `${field.label} ต้องไม่น้อยกว่า ${field.min}`;
                }
                if (field.max !== undefined && numValue > field.max) {
                    errors[field.name] = `${field.label} ต้องไม่มากกว่า ${field.max}`;
                }
            }
        });
    });

    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
}
