/**
 * CATEGORY PRICING FACTORS
 * 
 * ระบบกำหนด factors ที่ใช้ประเมินราคาสำหรับแต่ละหมวดหมู่
 * แต่ละ field มี weight ที่บ่งบอกว่ามีผลต่อราคามากน้อยแค่ไหน
 * 
 * Weight Scale:
 * - 5: Critical (ส่งผลมากที่สุด เช่น สภาพ, รุ่น)
 * - 4: Very Important (เช่น ปี, แบตเตอรี่)
 * - 3: Important (เช่น ความจุ, สี)
 * - 2: Moderate (เช่น อุปกรณ์ครบ, ประกัน)
 * - 1: Minor (เช่น สีนิยม, ป้ายติด)
 * 
 * @version 1.0.0
 */

// ============================================
// TYPES
// ============================================

export interface PricingField {
    field: string           // Field key from form
    label_th: string        // Thai label for display
    label_en: string        // English label
    weight: 1 | 2 | 3 | 4 | 5  // Impact on price
    type: 'positive' | 'negative' | 'neutral' | 'variable'
    priceImpact: {
        // Value -> percentage impact on price
        // Positive = increase, Negative = decrease
        [value: string]: number
    }
}

export interface CategoryPricingConfig {
    categoryId: number
    subcategoryId?: number
    categoryName: string
    emoji: string
    // Required fields that MUST affect pricing
    criticalFields: PricingField[]
    // Important fields that should affect pricing
    importantFields: PricingField[]
    // Optional fields that may affect pricing
    optionalFields: PricingField[]
    // Special rules for this category
    specialRules?: string[]
}

// ============================================
// UNIVERSAL CONDITION IMPACT
// ============================================

const CONDITION_PRICE_IMPACT: { [value: string]: number } = {
    // ใหม่ยังไม่แกะซีล - +10-15%
    'new_sealed': 10,
    // ใหม่ แกะแล้วไม่ได้ใช้ - +5%
    'new_opened': 5,
    // เหมือนใหม่ 99% - 0%
    'like_new': 0,
    // สภาพดี มีรอยใช้งานเล็กน้อย - -10%
    'good': -10,
    // ใช้งานได้ปกติ มีรอยเยอะ - -25%
    'fair': -25,
    // หน้าจอแตก/ร้าว - -50%
    'screen_cracked': -50,
    // ขายเป็นอะไหล่ - -70 to -90%
    'parts_only': -80,
}

// ============================================
// SMARTPHONE (Category 2, Subcategory 201)
// ============================================

export const SMARTPHONE_PRICING: CategoryPricingConfig = {
    categoryId: 2,
    subcategoryId: 201,
    categoryName: 'Smartphone',
    emoji: '📱',
    criticalFields: [
        {
            field: 'condition',
            label_th: 'สภาพสินค้า',
            label_en: 'Condition',
            weight: 5,
            type: 'variable',
            priceImpact: CONDITION_PRICE_IMPACT
        },
        {
            field: 'brand',
            label_th: 'ยี่ห้อ',
            label_en: 'Brand',
            weight: 5,
            type: 'variable',
            priceImpact: {
                'Apple': 0,        // Reference brand
                'Samsung': -5,     // Slightly lower resale
                'Google': -10,
                'OnePlus': -15,
                'Xiaomi': -25,
                'OPPO': -25,
                'Vivo': -25,
                'Realme': -30,
                'Huawei': -35,     // No Google services
                'Other': -40,
            }
        },
        {
            field: 'model',
            label_th: 'รุ่น',
            label_en: 'Model',
            weight: 5,
            type: 'variable',
            priceImpact: {
                // iPhone models (price decay by age)
                'iPhone 16': 0,
                'iPhone 15': -15,
                'iPhone 14': -30,
                'iPhone 13': -45,
                'iPhone 12': -55,
                'iPhone 11': -65,
                'iPhone XS': -75,
                'iPhone XR': -75,
                'iPhone X': -80,
                'iPhone 8': -85,
                'iPhone 7': -90,
                'iPhone 6s': -92,
                'iPhone 6': -95,
            }
        },
    ],
    importantFields: [
        {
            field: 'battery',
            label_th: 'สุขภาพแบตเตอรี่',
            label_en: 'Battery Health',
            weight: 4,
            type: 'variable',
            priceImpact: {
                '90-100': 0,       // Excellent
                '80-89': -5,       // Good
                '70-79': -15,      // Fair, may need replacement
                '60-69': -25,      // Poor, needs replacement soon
                'below-60': -35,   // Very poor
                'unknown': -10,    // Uncertain = slight penalty
            }
        },
        {
            field: 'storage',
            label_th: 'ความจุ',
            label_en: 'Storage',
            weight: 3,
            type: 'positive',
            priceImpact: {
                '64GB': 0,         // Base
                '128GB': 5,
                '256GB': 12,
                '512GB': 20,
                '1TB': 30,
            }
        },
        {
            field: 'screen',
            label_th: 'สภาพหน้าจอ',
            label_en: 'Screen Condition',
            weight: 4,
            type: 'negative',
            priceImpact: {
                'perfect': 0,
                'minor_scratches': -5,
                'noticeable_scratches': -15,
                'screen_burn': -25,
                'cracked': -50,
            }
        },
        {
            field: 'usage_age',
            label_th: 'อายุการใช้งาน',
            label_en: 'Usage Period',
            weight: 3,
            type: 'negative',
            priceImpact: {
                'new': 0,
                'less_3m': -2,
                '3_6m': -5,
                '6_12m': -10,
                '1_2y': -15,
                '2_3y': -25,
                '3_5y': -40,
                'more_5y': -60,
            }
        },
    ],
    optionalFields: [
        {
            field: 'original_box',
            label_th: 'กล่องและอุปกรณ์',
            label_en: 'Box & Accessories',
            weight: 2,
            type: 'positive',
            priceImpact: {
                'complete': 5,
                'box_only': 2,
                'no_box': 0,
            }
        },
        {
            field: 'warranty',
            label_th: 'ประกันเหลือ',
            label_en: 'Warranty',
            weight: 2,
            type: 'positive',
            priceImpact: {
                'more_1y': 8,
                '6_12m': 5,
                '3_6m': 2,
                'less_3m': 1,
                'expired': 0,
                'unknown': 0,
            }
        },
        {
            field: 'icloud_status',
            label_th: 'สถานะ iCloud',
            label_en: 'iCloud Status',
            weight: 5,
            type: 'negative',
            priceImpact: {
                'signed_out': 0,
                'locked': -80,     // iCloud locked = parts only
            }
        },
    ],
    specialRules: [
        'iPhone รุ่นเก่ากว่า iPhone X (ปี 2017) ราคาต้องต่ำกว่า 5,000 บาท',
        'เครื่องติด iCloud ต้องขายเป็นอะไหล่เท่านั้น ราคา 500-2,000 บาท',
        'แบตเตอรี่ต่ำกว่า 80% ควรแนะนำให้เปลี่ยนก่อนขาย',
        'iPhone Pro/Pro Max ราคาสูงกว่ารุ่นปกติ 10-15%',
    ]
}

// ============================================
// LAPTOP (Category 4, Subcategory 403)
// ============================================

export const LAPTOP_PRICING: CategoryPricingConfig = {
    categoryId: 4,
    subcategoryId: 403,
    categoryName: 'Laptop',
    emoji: '💻',
    criticalFields: [
        {
            field: 'condition',
            label_th: 'สภาพสินค้า',
            label_en: 'Condition',
            weight: 5,
            type: 'variable',
            priceImpact: CONDITION_PRICE_IMPACT
        },
        {
            field: 'brand',
            label_th: 'ยี่ห้อ',
            label_en: 'Brand',
            weight: 5,
            type: 'variable',
            priceImpact: {
                'Apple': 0,        // MacBook holds value best
                'Dell': -10,
                'Lenovo': -12,
                'HP': -15,
                'ASUS': -18,
                'Acer': -25,
                'MSI': -10,        // Gaming laptops
                'Other': -30,
            }
        },
        {
            field: 'cpu',
            label_th: 'CPU',
            label_en: 'Processor',
            weight: 5,
            type: 'variable',
            priceImpact: {
                // Apple Silicon
                'M3 Max': 30,
                'M3 Pro': 20,
                'M3': 10,
                'M2 Max': 15,
                'M2 Pro': 8,
                'M2': 0,
                'M1 Pro': -5,
                'M1': -15,
                // Intel (newer = better)
                'i9 13th': 20,
                'i7 13th': 10,
                'i5 13th': 0,
                'i9 12th': 5,
                'i7 12th': -5,
                'i5 12th': -15,
                'i7 11th': -25,
                'i5 11th': -35,
                'i7 10th': -40,
                'i5 10th': -50,
                // Older Intel
                'i7 9th': -55,
                'i5 9th': -60,
                'Older': -70,
            }
        },
    ],
    importantFields: [
        {
            field: 'battery',
            label_th: 'สุขภาพแบตเตอรี่',
            label_en: 'Battery Health',
            weight: 4,
            type: 'variable',
            priceImpact: {
                '90-100': 0,
                '80-89': -5,
                '70-79': -12,
                '60-69': -20,
                'below-60': -30,
                'unknown': -8,
            }
        },
        {
            field: 'storage',
            label_th: 'ความจุ SSD',
            label_en: 'Storage',
            weight: 3,
            type: 'positive',
            priceImpact: {
                '128GB': -10,
                '256GB': 0,
                '512GB': 8,
                '1TB': 15,
                '2TB': 25,
            }
        },
        {
            field: 'ram',
            label_th: 'RAM',
            label_en: 'Memory',
            weight: 3,
            type: 'positive',
            priceImpact: {
                '8GB': 0,
                '16GB': 10,
                '32GB': 20,
                '64GB': 30,
            }
        },
        {
            field: 'screen',
            label_th: 'หน้าจอ',
            label_en: 'Display',
            weight: 2,
            type: 'positive',
            priceImpact: {
                '13"': 0,
                '14"': 3,
                '15"': 5,
                '16"': 8,
                '17"': 5,
            }
        },
        {
            field: 'defects',
            label_th: 'ตำหนิ',
            label_en: 'Defects',
            weight: 4,
            type: 'negative',
            priceImpact: {
                'none': 0,
                'minor_scratches': -5,
                'noticeable_scratches': -12,
                'minor_dent': -15,
                'dead_pixel': -20,
                'screen_spot': -18,
                'key_wear': -8,
                'key_malfunction': -25,
                'fan_noise': -15,
                'speaker_issue': -12,
                'port_issue': -20,
                'battery_weak': -20,
            }
        },
    ],
    optionalFields: [
        {
            field: 'warranty',
            label_th: 'ประกันเหลือ',
            label_en: 'Warranty',
            weight: 2,
            type: 'positive',
            priceImpact: {
                'more_1y': 8,
                '6_12m': 5,
                '3_6m': 2,
                'less_3m': 1,
                'expired': 0,
            }
        },
        {
            field: 'original_box',
            label_th: 'กล่องและอุปกรณ์',
            label_en: 'Box & Accessories',
            weight: 1,
            type: 'positive',
            priceImpact: {
                'complete': 3,
                'box_only': 1,
                'no_box': 0,
            }
        },
    ],
    specialRules: [
        'MacBook M-series ราคาตกน้อยกว่า Intel มาก',
        'โน้ตบุ๊ค Intel รุ่นเก่ากว่า 5 ปี ราคาลดมากกว่า 50%',
        'Gaming laptop (MSI, ASUS ROG, Alienware) มีกลุ่มผู้ซื้อเฉพาะ',
        'RAM และ SSD ที่อัพเกรดได้ มีค่ามากกว่าที่อัพเกรดไม่ได้',
    ]
}

// ============================================
// AUTOMOTIVE - CARS (Category 1, Subcategory 101)
// ============================================

export const CAR_PRICING: CategoryPricingConfig = {
    categoryId: 1,
    subcategoryId: 101,
    categoryName: 'Used Cars',
    emoji: '🚗',
    criticalFields: [
        {
            field: 'condition',
            label_th: 'สภาพสินค้า',
            label_en: 'Condition',
            weight: 5,
            type: 'variable',
            priceImpact: {
                'excellent': 0,
                'good': -5,
                'fair': -15,
                'needs_repair': -30,
                'accident_repaired': -25,
            }
        },
        {
            field: 'brand',
            label_th: 'ยี่ห้อ',
            label_en: 'Brand',
            weight: 5,
            type: 'variable',
            priceImpact: {
                // Japanese (hold value well)
                'Toyota': 0,       // Reference brand
                'Honda': -2,
                'Mazda': -5,
                'Nissan': -8,
                'Suzuki': -10,
                'Mitsubishi': -10,
                'Isuzu': -5,       // Pickup popular
                // European
                'Mercedes-Benz': 5,
                'BMW': 0,
                'Audi': -5,
                'Volkswagen': -10,
                // Korean
                'Hyundai': -15,
                'Kia': -15,
                // Chinese
                'MG': -20,
                'BYD': -15,
                'Great Wall': -25,
                'Other': -20,
            }
        },
        {
            field: 'year',
            label_th: 'ปี',
            label_en: 'Year',
            weight: 5,
            type: 'negative',
            priceImpact: {
                // Price depreciation by year (from current 2024)
                '2024': 0,
                '2023': -8,
                '2022': -15,
                '2021': -22,
                '2020': -28,
                '2019': -35,
                '2018': -42,
                '2017': -48,
                '2016': -55,
                '2015': -60,
                '2014': -65,
                '2013': -70,
                '2012': -75,
                'older': -80,
            }
        },
        {
            field: 'mileage',
            label_th: 'ระยะทาง',
            label_en: 'Mileage',
            weight: 5,
            type: 'negative',
            priceImpact: {
                // Thai market mileage ranges
                'under_30k': 5,
                '30k_60k': 0,
                '60k_100k': -8,
                '100k_150k': -15,
                '150k_200k': -25,
                'over_200k': -35,
            }
        },
    ],
    importantFields: [
        {
            field: 'tax_status',
            label_th: 'สถานะภาษี/พ.ร.บ.',
            label_en: 'Tax/Insurance Status',
            weight: 3,
            type: 'negative',
            priceImpact: {
                'valid': 0,
                'expiring_soon': -2,
                'expired': -5,
                'pending': -3,
            }
        },
        {
            field: 'accident_history',
            label_th: 'ประวัติอุบัติเหตุ',
            label_en: 'Accident History',
            weight: 4,
            type: 'negative',
            priceImpact: {
                'never': 0,
                'minor': -10,
                'major_repaired': -25,
                'frame_damage': -40,
            }
        },
        {
            field: 'flood_history',
            label_th: 'ประวัติน้ำท่วม',
            label_en: 'Flood History',
            weight: 5,
            type: 'negative',
            priceImpact: {
                'none': 0,      // ไม่เคยจมน้ำ → 0%
                'never': 0,     // backward compatibility
                'partial': -25, // จมน้ำนิดหน่อย → -25%
                'flooded': -35, // backward compatibility → -35%
                'full': -50,    // จมน้ำทั้งคัน → -50%
            }
        },
        {
            field: 'book_status',
            label_th: 'สมุดเล่มเดิม',
            label_en: 'Original Book',
            weight: 3,
            type: 'negative',
            priceImpact: {
                'original': 0,
                'copy': -5,
                'lost': -10,
            }
        },
    ],
    optionalFields: [
        {
            field: 'registration',
            label_th: 'ทะเบียนจังหวัด',
            label_en: 'Registration Province',
            weight: 1,
            type: 'variable',
            priceImpact: {
                'กรุงเทพมหานคร': 0,
                // Other provinces generally same
            }
        },
        {
            field: 'color',
            label_th: 'สี',
            label_en: 'Color',
            weight: 1,
            type: 'variable',
            priceImpact: {
                'white': 2,        // Popular colors
                'black': 2,
                'silver': 0,
                'gray': 0,
                'red': -2,
                'blue': -2,
                'other': -5,
            }
        },
    ],
    specialRules: [
        'Toyota และ Honda ราคาตกน้อยที่สุดในตลาดไทย',
        'รถเคยชนหนักหรือน้ำท่วม ราคาลดมาก 30-50%',
        'กระบะ Isuzu D-Max, Toyota Hilux ขายดีมาก',
        'รถไฟฟ้า BYD, MG ราคายังไม่ stable ในตลาดมือสอง',
        'ระยะทางมากกว่า 150,000 กม. ต้องพิจารณาเครื่องยนต์',
    ]
}

// ============================================
// MOTORCYCLE (Category 1, Subcategory 102)
// ============================================

export const MOTORCYCLE_PRICING: CategoryPricingConfig = {
    categoryId: 1,
    subcategoryId: 102,
    categoryName: 'Motorcycle',
    emoji: '🏍️',
    criticalFields: [
        {
            field: 'condition',
            label_th: 'สภาพสินค้า',
            label_en: 'Condition',
            weight: 5,
            type: 'variable',
            priceImpact: CONDITION_PRICE_IMPACT
        },
        {
            field: 'brand',
            label_th: 'ยี่ห้อ',
            label_en: 'Brand',
            weight: 5,
            type: 'variable',
            priceImpact: {
                'Honda': 0,        // Reference - most popular
                'Yamaha': -2,
                'Kawasaki': -5,
                'Suzuki': -8,
                'Vespa': 5,        // Premium scooter
                'BMW': 10,
                'Ducati': 10,
                'Harley-Davidson': 5,
                'GPX': -15,
                'Other': -20,
            }
        },
        {
            field: 'model',
            label_th: 'รุ่น',
            label_en: 'Model',
            weight: 5,
            type: 'variable',
            priceImpact: {
                // Popular models retain value
                'Wave': 0,
                'Click': 0,
                'Scoopy': 0,
                'PCX': 5,
                'ADV': 5,
                'Forza': 8,
                'CBR': 10,
                'Ninja': 10,
                'R15': 5,
                'MT-15': 5,
            }
        },
        {
            field: 'year',
            label_th: 'ปี',
            label_en: 'Year',
            weight: 4,
            type: 'negative',
            priceImpact: {
                '2024': 0,
                '2023': -8,
                '2022': -15,
                '2021': -22,
                '2020': -28,
                '2019': -35,
                '2018': -42,
                '2017': -50,
                'older': -60,
            }
        },
    ],
    importantFields: [
        {
            field: 'mileage',
            label_th: 'ระยะทาง',
            label_en: 'Mileage',
            weight: 4,
            type: 'negative',
            priceImpact: {
                'under_10k': 5,
                '10k_30k': 0,
                '30k_50k': -8,
                '50k_80k': -15,
                'over_80k': -25,
            }
        },
        {
            field: 'tax_status',
            label_th: 'สถานะภาษี/พ.ร.บ.',
            label_en: 'Tax/Insurance Status',
            weight: 3,
            type: 'negative',
            priceImpact: {
                'valid': 0,
                'expiring_soon': -2,
                'expired': -5,
                'pending': -3,
            }
        },
    ],
    optionalFields: [
        {
            field: 'modifications',
            label_th: 'ของแต่ง',
            label_en: 'Modifications',
            weight: 2,
            type: 'variable',
            priceImpact: {
                'stock': 0,
                'minor_mods': 3,
                'major_mods': -5,  // May reduce value for some buyers
            }
        },
    ],
    specialRules: [
        'Honda Wave, Click, Scoopy ขายง่ายที่สุด',
        'มอเตอร์ไซค์รุ่นเล็ก 110-125cc ราคา 20,000-45,000 บาท',
        'มอเตอร์ไซค์รุ่นกลาง PCX, ADV ราคา 50,000-100,000 บาท',
        'Big Bike ราคาขึ้นกับยี่ห้อและความนิยมมาก',
        'ของแต่งอาจเพิ่มหรือลดราคาขึ้นกับผู้ซื้อ',
    ]
}

// ============================================
// APPLIANCES (Category 5)
// ============================================

export const APPLIANCES_PRICING: CategoryPricingConfig = {
    categoryId: 5,
    categoryName: 'Home Appliances',
    emoji: '🔌',
    criticalFields: [
        {
            field: 'condition',
            label_th: 'สภาพสินค้า',
            label_en: 'Condition',
            weight: 5,
            type: 'variable',
            priceImpact: CONDITION_PRICE_IMPACT
        },
        {
            field: 'brand',
            label_th: 'ยี่ห้อ',
            label_en: 'Brand',
            weight: 4,
            type: 'variable',
            priceImpact: {
                // Premium brands
                'Dyson': 10,
                'Miele': 10,
                'Electrolux': 5,
                'Panasonic': 0,
                'LG': 0,
                'Samsung': 0,
                'Mitsubishi': 0,
                'Sharp': -5,
                'Haier': -10,
                'Midea': -15,
                'TCL': -15,
                'Other': -20,
            }
        },
        {
            field: 'type',
            label_th: 'ประเภท',
            label_en: 'Type',
            weight: 4,
            type: 'variable',
            priceImpact: {
                // Different appliance types have different depreciation
                'air_conditioner': 0,
                'refrigerator': 0,
                'washing_machine': -5,
                'tv': -15,          // TVs depreciate fast
                'microwave': -20,
                'vacuum': -15,
                'fan': -25,
            }
        },
    ],
    importantFields: [
        {
            field: 'warranty',
            label_th: 'ประกันเหลือ',
            label_en: 'Warranty',
            weight: 3,
            type: 'positive',
            priceImpact: {
                'more_1y': 10,
                '6_12m': 5,
                '3_6m': 2,
                'less_3m': 1,
                'expired': 0,
            }
        },
        {
            field: 'energy',
            label_th: 'ฉลากประหยัดไฟ',
            label_en: 'Energy Rating',
            weight: 2,
            type: 'positive',
            priceImpact: {
                'เบอร์ 5': 8,
                'เบอร์ 4': 4,
                'เบอร์ 3': 0,
                'ไม่มีฉลาก': -5,
            }
        },
        {
            field: 'defects',
            label_th: 'ตำหนิ',
            label_en: 'Defects',
            weight: 4,
            type: 'negative',
            priceImpact: {
                'none': 0,
                'minor_scratches': -5,
                'dent': -10,
                'rust': -15,
                'noise': -20,
                'cooling_issue': -40,
                'heating_issue': -40,
                'button_issue': -15,
                'leak': -35,
            }
        },
    ],
    optionalFields: [
        {
            field: 'power',
            label_th: 'กำลังไฟ (วัตต์)',
            label_en: 'Power (Watts)',
            weight: 1,
            type: 'neutral',
            priceImpact: {}  // Contextual
        },
    ],
    specialRules: [
        'แอร์ราคาลด 30-50% ใน 3-5 ปี',
        'ตู้เย็น Inverter ราคาตกน้อยกว่าปกติ',
        'ทีวีราคาตกเร็วมาก LED/OLED รุ่นใหม่ลดราคารุ่นเก่า',
        'เครื่องดูดฝุ่น Dyson ราคายังคงดี',
    ]
}

// ============================================
// CAMERA (Category 8)
// ============================================

export const CAMERA_PRICING: CategoryPricingConfig = {
    categoryId: 8,
    categoryName: 'Camera',
    emoji: '📷',
    criticalFields: [
        {
            field: 'condition',
            label_th: 'สภาพสินค้า',
            label_en: 'Condition',
            weight: 5,
            type: 'variable',
            priceImpact: CONDITION_PRICE_IMPACT
        },
        {
            field: 'brand',
            label_th: 'ยี่ห้อ',
            label_en: 'Brand',
            weight: 5,
            type: 'variable',
            priceImpact: {
                'Sony': 0,
                'Canon': 0,
                'Nikon': -5,
                'Fujifilm': 5,     // Trendy, holds value
                'Panasonic': -10,
                'Olympus': -15,
                'Leica': 20,       // Premium collector
                'GoPro': 0,
                'DJI': 0,
                'Other': -20,
            }
        },
        {
            field: 'type',
            label_th: 'ประเภท',
            label_en: 'Type',
            weight: 4,
            type: 'variable',
            priceImpact: {
                'mirrorless': 0,
                'dslr': -10,       // DSLR declining
                'compact': -25,
                'action': -15,
                'film': 15,        // Film cameras rising
            }
        },
        {
            field: 'sensor',
            label_th: 'เซนเซอร์',
            label_en: 'Sensor',
            weight: 4,
            type: 'positive',
            priceImpact: {
                'fullframe': 20,
                'apsc': 0,
                'mft': -10,
            }
        },
    ],
    importantFields: [
        {
            field: 'shutter_count',
            label_th: 'ชัตเตอร์เคาท์',
            label_en: 'Shutter Count',
            weight: 4,
            type: 'negative',
            priceImpact: {
                'under_5k': 5,
                '5k_20k': 0,
                '20k_50k': -8,
                '50k_100k': -18,
                'over_100k': -30,
                'unknown': -10,
            }
        },
        {
            field: 'sensor_dust',
            label_th: 'ฝุ่นเซนเซอร์',
            label_en: 'Sensor Dust',
            weight: 3,
            type: 'negative',
            priceImpact: {
                'clean': 0,
                'minor': -3,
                'visible': -10,
                'needs_cleaning': -15,
                'unknown': -5,
            }
        },
        {
            field: 'warranty',
            label_th: 'ประกันเหลือ',
            label_en: 'Warranty',
            weight: 2,
            type: 'positive',
            priceImpact: {
                'more_1y': 8,
                '6_12m': 5,
                '3_6m': 2,
                'less_3m': 1,
                'expired': 0,
            }
        },
    ],
    optionalFields: [
        {
            field: 'included_items',
            label_th: 'อุปกรณ์ที่ให้',
            label_en: 'Included Items',
            weight: 2,
            type: 'positive',
            priceImpact: {
                // Value of included items
                'lens': 10,
                'extra_battery': 3,
                'bag': 2,
                'sd_card': 1,
            }
        },
    ],
    specialRules: [
        'Fujifilm X-series และ Leica ราคามือสองสูง',
        'DSLR ราคาลดเร็วเนื่องจาก Mirrorless เป็นที่นิยม',
        'ชัตเตอร์เคาท์มากกว่า 100,000 อาจต้องเปลี่ยนชัตเตอร์',
        'กล้องฟิล์มกลับมาเป็นที่นิยม ราคาบางรุ่นสูงขึ้น',
    ]
}

// ============================================
// FASHION (Category 3)
// ============================================

export const FASHION_PRICING: CategoryPricingConfig = {
    categoryId: 3,
    categoryName: 'Fashion',
    emoji: '👗',
    criticalFields: [
        {
            field: 'condition',
            label_th: 'สภาพสินค้า',
            label_en: 'Condition',
            weight: 5,
            type: 'variable',
            priceImpact: {
                'new_with_tags': 0,
                'like_new': -10,
                'good': -30,
                'fair': -50,
                'poor': -70,
            }
        },
        {
            field: 'brand',
            label_th: 'แบรนด์',
            label_en: 'Brand',
            weight: 5,
            type: 'variable',
            priceImpact: {
                // Luxury brands
                'Hermès': 30,
                'Chanel': 25,
                'Louis Vuitton': 20,
                'Gucci': 15,
                'Prada': 10,
                'Dior': 15,
                // Premium
                'Burberry': 5,
                'Coach': 0,
                'Michael Kors': -5,
                'Kate Spade': -5,
                // Fast fashion (low resale)
                'Zara': -40,
                'H&M': -50,
                'Uniqlo': -45,
                'Other': -60,
            }
        },
        {
            field: 'type',
            label_th: 'ประเภท',
            label_en: 'Type',
            weight: 3,
            type: 'variable',
            priceImpact: {
                'bag': 0,          // Bags hold value best
                'shoes': -10,
                'dress': -20,
                'jacket': -15,
                'top': -30,
                'pants': -25,
                'accessories': -15,
            }
        },
    ],
    importantFields: [
        {
            field: 'authenticity',
            label_th: 'ความแท้',
            label_en: 'Authenticity',
            weight: 5,
            type: 'negative',
            priceImpact: {
                'authentic_with_receipt': 10,
                'authentic': 0,
                'unverified': -30,
                'replica': -90,    // Illegal to sell as real
            }
        },
        {
            field: 'defects',
            label_th: 'ตำหนิ',
            label_en: 'Defects',
            weight: 4,
            type: 'negative',
            priceImpact: {
                'none': 0,
                'stain': -20,
                'faded': -25,
                'pilling': -15,
                'tear': -35,
                'loose_thread': -10,
                'button_issue': -15,
                'zipper_issue': -20,
            }
        },
        {
            field: 'washed',
            label_th: 'ซักแล้วกี่ครั้ง',
            label_en: 'Times Washed',
            weight: 2,
            type: 'negative',
            priceImpact: {
                'never': 0,
                '1-3': -5,
                '4-10': -15,
                'many': -25,
            }
        },
    ],
    optionalFields: [
        {
            field: 'color',
            label_th: 'สี',
            label_en: 'Color',
            weight: 1,
            type: 'variable',
            priceImpact: {
                'black': 0,
                'neutral': 0,
                'classic': 0,
                'trendy': -10,     // Trendy colors may date quickly
            }
        },
    ],
    specialRules: [
        'แบรนด์หรู Hermès, Chanel ราคามือสองแทบไม่ลด',
        'กระเป๋าราคาดีกว่าเสื้อผ้า',
        'เสื้อผ้า Fast Fashion ราคาลด 50-80% ทันที',
        'ป้ายติดสำคัญมากสำหรับแบรนด์เนม',
        'ใบเสร็จและ authenticity card เพิ่มมูลค่า',
    ]
}

// ============================================
// GAMING (Category 11)
// ============================================

export const GAMING_PRICING: CategoryPricingConfig = {
    categoryId: 11,
    categoryName: 'Gaming',
    emoji: '🎮',
    criticalFields: [
        {
            field: 'condition',
            label_th: 'สภาพสินค้า',
            label_en: 'Condition',
            weight: 5,
            type: 'variable',
            priceImpact: CONDITION_PRICE_IMPACT
        },
        {
            field: 'brand',
            label_th: 'ยี่ห้อ',
            label_en: 'Brand/Platform',
            weight: 5,
            type: 'variable',
            priceImpact: {
                'PlayStation': 0,
                'Nintendo': 5,     // Nintendo holds value well
                'Xbox': -5,
                'Steam Deck': 0,
                'Other': -20,
            }
        },
        {
            field: 'model',
            label_th: 'รุ่น',
            label_en: 'Model',
            weight: 5,
            type: 'variable',
            priceImpact: {
                'PS5': 0,
                'PS5 Digital': -10,
                'PS4 Pro': -40,
                'PS4': -50,
                'PS3': -80,
                'Nintendo Switch OLED': 0,
                'Nintendo Switch': -15,
                'Nintendo Switch Lite': -25,
                'Xbox Series X': 0,
                'Xbox Series S': -15,
                'Xbox One X': -45,
                'Xbox One': -55,
            }
        },
    ],
    importantFields: [
        {
            field: 'storage',
            label_th: 'ความจุ',
            label_en: 'Storage',
            weight: 2,
            type: 'positive',
            priceImpact: {
                '500GB': 0,
                '1TB': 5,
                '2TB': 10,
            }
        },
        {
            field: 'defects',
            label_th: 'ตำหนิ',
            label_en: 'Defects',
            weight: 4,
            type: 'negative',
            priceImpact: {
                'none': 0,
                'minor_scratches': -5,
                'controller_drift': -15,
                'overheating': -25,
                'disc_issue': -30,
                'fan_noise': -15,
                'hdmi_issue': -35,
            }
        },
        {
            field: 'warranty',
            label_th: 'ประกันเหลือ',
            label_en: 'Warranty',
            weight: 2,
            type: 'positive',
            priceImpact: {
                'more_1y': 5,
                '6_12m': 3,
                '3_6m': 1,
                'less_3m': 0,
                'expired': 0,
            }
        },
    ],
    optionalFields: [
        {
            field: 'included_items',
            label_th: 'อุปกรณ์ที่ให้',
            label_en: 'Included Items',
            weight: 2,
            type: 'positive',
            priceImpact: {
                'console': 0,
                'controller': 5,
                'cables': 0,
                'games': 10,
                'box': 2,
            }
        },
    ],
    specialRules: [
        'Nintendo Switch ราคาตกช้ากว่า PlayStation',
        'PS5 ยังหาซื้อยาก ราคามือสองยังดี',
        'เกมรวมเพิ่มมูลค่า 500-2,000 บาท/เกม',
        'Joy-Con Drift เป็นปัญหาทั่วไปของ Switch',
        'Digital Edition ราคาต่ำกว่าเพราะใช้แผ่นไม่ได้',
    ]
}

// ============================================
// EXPORT ALL CONFIGS
// ============================================

export const ALL_PRICING_CONFIGS: CategoryPricingConfig[] = [
    SMARTPHONE_PRICING,
    LAPTOP_PRICING,
    CAR_PRICING,
    MOTORCYCLE_PRICING,
    APPLIANCES_PRICING,
    CAMERA_PRICING,
    FASHION_PRICING,
    GAMING_PRICING,
]

// Get config by category/subcategory
export function getPricingConfig(categoryId: number, subcategoryId?: number): CategoryPricingConfig | null {
    // Try to find exact subcategory match first
    if (subcategoryId) {
        const exactMatch = ALL_PRICING_CONFIGS.find(
            c => c.categoryId === categoryId && c.subcategoryId === subcategoryId
        )
        if (exactMatch) return exactMatch
    }

    // Fall back to category match
    return ALL_PRICING_CONFIGS.find(c => c.categoryId === categoryId) || null
}

// Calculate price impact from all fields
export function calculatePriceImpact(
    config: CategoryPricingConfig,
    fieldValues: Record<string, string | string[]>
): {
    totalImpact: number
    breakdown: { field: string; label: string; value: string; impact: number }[]
    adjustedPriceMultiplier: number
} {
    const breakdown: { field: string; label: string; value: string; impact: number }[] = []
    let totalImpact = 0

    const allFields = [
        ...config.criticalFields,
        ...config.importantFields,
        ...config.optionalFields,
    ]

    for (const fieldConfig of allFields) {
        const value = fieldValues[fieldConfig.field]
        if (!value) continue

        // Handle single value
        if (typeof value === 'string') {
            const impact = fieldConfig.priceImpact[value] ?? 0
            if (impact !== 0) {
                breakdown.push({
                    field: fieldConfig.field,
                    label: fieldConfig.label_th,
                    value: value,
                    impact: impact,
                })
                // Weight the impact
                totalImpact += impact * (fieldConfig.weight / 5)
            }
        }
        // Handle multi-select (e.g., defects)
        else if (Array.isArray(value)) {
            for (const v of value) {
                const impact = fieldConfig.priceImpact[v] ?? 0
                if (impact !== 0) {
                    breakdown.push({
                        field: fieldConfig.field,
                        label: fieldConfig.label_th,
                        value: v,
                        impact: impact,
                    })
                    totalImpact += impact * (fieldConfig.weight / 5)
                }
            }
        }
    }

    // Convert total impact to multiplier (e.g., -20% = 0.8)
    const adjustedPriceMultiplier = Math.max(0.1, 1 + (totalImpact / 100))

    return {
        totalImpact: Math.round(totalImpact),
        breakdown,
        adjustedPriceMultiplier: Math.round(adjustedPriceMultiplier * 100) / 100,
    }
}
