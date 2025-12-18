/**
 * ADVANCED CATEGORY INTELLIGENCE v2.0
 * 
 * Professional-grade category classification with:
 * - Model number detection
 * - Technical term analysis
 * - Exclusion/inclusion rules
 * - Smart confidence scoring
 * - Multi-signal ranking
 * 
 * Target Accuracy: 90%+
 */

import { CATEGORIES, type Category } from '@/constants/categories'

// ================================================================
// MODEL NUMBERS & TECHNICAL TERMS DATABASE
// ================================================================

/**
 * Brand-Category Mapping (Strong Indicators)
 */
export const BRAND_CATEGORY_MAP: Record<string, number[]> = {
    // Computer Brands → Category 4
    'acer': [4], 'asus': [4], 'dell': [4], 'hp': [4], 'lenovo': [4],
    'msi': [4], 'apple': [3, 4], 'microsoft': [4], 'razer': [4, 7],

    // Mobile Brands → Category 3
    'iphone': [3], 'samsung': [3], 'xiaomi': [3], 'oppo': [3], 'vivo': [3],
    'huawei': [3], 'realme': [3], 'oneplus': [3], 'pixel': [3],

    // Camera Brands → Category 8
    'canon': [4, 8], 'nikon': [8], 'sony': [3, 8], 'fujifilm': [8],
    'leica': [8], 'gopro': [8], 'dji': [7, 8],

    // Gaming Brands → Category 7
    'playstation': [7], 'xbox': [7], 'nintendo': [7],

    // Fashion Brands → Category 6
    'nike': [6], 'adidas': [6], 'gucci': [6], 'lv': [6], 'prada': [6],
    'chanel': [6, 14], 'hermes': [6], 'rolex': [6],

    // Beauty Brands → Category 14
    'maybelline': [14], 'loreal': [14], 'mac': [14], 'dior': [6, 14],
    'estee lauder': [14], 'clinique': [14], 'lancome': [14],
    'sephora': [14], 'shiseido': [14],

    // Baby & Toys Brands → Category 15
    'pampers': [15], 'huggies': [15], 'mamy poko': [15], 'merries': [15],
    'lego': [15], 'fisher price': [15], 'chicco': [15],
    'barbie': [15], 'hot wheels': [15], 'hasbro': [15], 'mattel': [15],

    // Appliance Brands → Category 5 (NEW!)
    'sharp': [5], 'panasonic': [5], 'mitsubishi': [5], 'hitachi': [5],
    'toshiba': [5], 'daikin': [5], 'lg': [5], 'haier': [5],
    'electrolux': [5], 'dyson': [5], 'philips': [5], 'tefal': [5],
    'hatari': [5], 'ฮาตาริ': [5], 'masterkool': [5], 'carrier': [5],
    'coway': [5], 'xiaomi air': [5], 'mi air': [5], 'blueair': [5]
}

/**
 * Model Numbers Database
 * Pattern: brand → model → category
 */
export const MODEL_NUMBER_PATTERNS: Array<{
    pattern: RegExp
    category: number
    subcategory?: number
    brand?: string
    type: string
}> = [
        // Laptop Models
        { pattern: /aspire\s*\d+/i, category: 4, subcategory: 401, brand: 'Acer', type: 'Laptop' },
        { pattern: /vivobook\s*\d+/i, category: 4, subcategory: 401, brand: 'Asus', type: 'Laptop' },
        { pattern: /thinkpad\s*[a-z]\d+/i, category: 4, subcategory: 401, brand: 'Lenovo', type: 'Laptop' },
        { pattern: /inspiron\s*\d+/i, category: 4, subcategory: 401, brand: 'Dell', type: 'Laptop' },
        { pattern: /pavilion\s*\d+/i, category: 4, subcategory: 401, brand: 'HP', type: 'Laptop' },
        { pattern: /macbook\s*(air|pro)/i, category: 4, subcategory: 401, brand: 'Apple', type: 'Laptop' },
        { pattern: /[a-z]+\d{3,4}-\d{2}-[a-z]\d{3,4}/i, category: 4, subcategory: 401, type: 'Laptop' }, // A515-45-R3A4

        // Monitor Models
        { pattern: /[vwep]\d{4}[a-z]?/i, category: 4, subcategory: 403, type: 'Monitor' }, // W1973, E243
        { pattern: /vg\d{3}/i, category: 4, subcategory: 403, brand: 'Asus', type: 'Monitor' }, // VG279

        // Printer Models
        { pattern: /l\d{4}/i, category: 4, subcategory: 405, brand: 'Epson', type: 'Printer' }, // L3110
        { pattern: /g\d{4}/i, category: 4, subcategory: 405, brand: 'Canon/Epson', type: 'Printer' }, // G2010
        { pattern: /p\d{4}/i, category: 4, subcategory: 405, brand: 'HP', type: 'Printer' }, // P1102
        { pattern: /mg\d{4}/i, category: 4, subcategory: 405, brand: 'Canon', type: 'Printer' }, // MG2570

        // Mobile Models
        { pattern: /iphone\s*\d{1,2}\s*(pro|plus|max)?/i, category: 3, subcategory: 301, brand: 'Apple', type: 'Mobile' },
        { pattern: /galaxy\s*[a-z]\d{1,2}/i, category: 3, subcategory: 301, brand: 'Samsung', type: 'Mobile' },
        { pattern: /redmi\s*(note\s*)?\d{1,2}/i, category: 3, subcategory: 301, brand: 'Xiaomi', type: 'Mobile' },
    ]

/**
 * Technical Terms that strongly indicate category
 */
export const TECHNICAL_TERMS: Record<number, string[]> = {
    // Category 4: Computers
    4: [
        // CPU
        'ryzen', 'ryzen 5', 'ryzen 7', 'intel', 'i3', 'i5', 'i7', 'i9',
        'core i3', 'core i5', 'core i7', 'm1', 'm2', 'm3',
        // GPU
        'rtx', 'gtx', 'rtx 3060', 'rtx 4060', 'nvidia', 'amd', 'radeon',
        'vega', 'iris', 'geforce',
        // RAM
        'ram', '8gb ram', '16gb ram', '32gb ram', 'ddr4', 'ddr5',
        // Storage
        'ssd', 'nvme', 'hdd', '256gb', '512gb', '1tb',
        '256gb ssd', '512gb ssd', '1tb ssd',
        // Display
        'full hd', 'fhd', '4k', 'qhd', 'wqhd', '144hz', '165hz', '240hz',
        'ips', 'va', 'tn', 'oled', 'amoled',
        // Connectivity
        'wifi 6', 'bluetooth 5', 'thunderbolt', 'usb-c', 'hdmi', 'displayport'
    ],

    // Category 3: Mobiles
    3: [
        '5g', '4g lte', 'dual sim', 'esim', 'snapdragon', 'a15 bionic',
        'amoled', 'oled', '120hz', '90hz', 'gorilla glass',
        'fast charging', 'wireless charging', 'face id', 'fingerprint',
        'ip68', 'waterproof', 'battery', 'mah', '5000mah'
    ],

    // Category 5: Appliances (EXPANDED!)
    5: [
        // Air Conditioner Terms
        'inverter', 'non-inverter', 'btu', '9000 btu', '12000 btu', '18000 btu',
        'no frost', 'frost free', 'compressor', 'energy saving',

        // Air Purifier Terms (NEW!)
        'เครื่องฟอกอากาศ', 'air purifier', 'เครื่องกรองอากาศ',
        'hepa filter', 'hepa', 'pm 2.5', 'pm2.5', 'ฟอกอากาศ',
        'plasmacluster', 'กรองฝุ่น',

        // Fan Terms (NEW!)
        'พัดลม', 'fan', 'พัดลมตั้งโต๊ะ', 'พัดลมตั้งพื้น', 'floor fan',
        'พัดลมเพดาน', 'ceiling fan', 'พัดลมไอเย็น', 'air cooler',
        'พัดลมไร้ใบ', 'bladeless fan', 'พัดลมดูดอากาศ', 'exhaust fan',
        'hatari', 'ฮาตาริ', 'ht-16m', '16 นิ้ว', '18 นิ้ว',

        // Kitchen Appliance Terms (NEW!)
        'หม้อหุงข้าว', 'rice cooker', 'หม้อทอดไร้น้ำมัน', 'air fryer',
        'ไมโครเวฟ', 'microwave', 'เตาอบ', 'oven',

        // Washing Machine Terms (NEW!)
        'เครื่องซักผ้า', 'washing machine', 'เครื่องอบผ้า', 'dryer',
        'ฝาบน', 'ฝาหน้า', 'front load', 'top load',

        // Refrigerator Terms (NEW!)
        'ตู้เย็น', 'refrigerator', 'fridge', 'ตู้แช่',
        'double door', 'side by side',

        // Water Heater Terms (NEW!)
        'เครื่องทำน้ำอุ่น', 'water heater', 'สตีเบล',

        // Vacuum Cleaner Terms (NEW!)
        'เครื่องดูดฝุ่น', 'vacuum cleaner', 'หุ่นยนต์ดูดฝุ่น', 'robot vacuum',

        // TV & Audio
        'smart tv', 'android tv', 'google tv', '4k uhd', 'ทีวี', 'โทรทัศน์',
        'soundbar', 'ลำโพง'
    ],

    // Category 6: Fashion
    6: [
        'cotton', 'polyester', 'leather', 'genuine leather',
        'size s', 'size m', 'size l', 'size xl',
        'eu 40', 'eu 41', 'us 9', 'uk 8',
        'authentic', 'original', 'limited edition'
    ],

    // Category 8: Cameras
    8: [
        'megapixel', 'mp', '24mp', '48mp', 'cmos', 'sensor',
        'full frame', 'aps-c', 'micro four thirds',
        'autofocus', 'af', 'image stabilization', 'is',
        'aperture', 'f1.8', 'f2.8', 'zoom', '24-70mm'
    ]
}

/**
 * Exclusion Rules - Prevent wrong classifications
 */
export const EXCLUSION_RULES: Record<number, {
    exclude_if_has: string[]
    exclude_if_missing: string[]
}> = {
    // Category 4: Computers
    4: {
        exclude_if_has: [
            'cotton', 'polyester', 'leather', 'size m', 'size l', 'size xl',
            'รองเท้า', 'เสื้อ', 'กางเกง', 'authentic original'
        ],
        exclude_if_missing: [] // No strict requirements
    },

    // Category 6: Fashion
    6: {
        exclude_if_has: [
            'ram', 'cpu', 'ssd', 'hdd', 'ryzen', 'intel', 'gtx', 'rtx',
            'core i5', 'core i7', '8gb', '16gb', 'gb ram',
            'เครื่องพิมพ์', 'printer', 'จอคอม', 'monitor'
        ],
        exclude_if_missing: []
    },

    // Category 3: Mobiles
    3: {
        exclude_if_has: [
            'laptop', 'notebook', 'โน้ตบุ๊ค', 'desktop', 'monitor',
            'เครื่องพิมพ์', 'printer'
        ],
        exclude_if_missing: []
    }
}

/**
 * Inclusion Boosters - Strong positive signals
 */
export const INCLUSION_BOOSTERS: Record<number, {
    strong_indicators: string[]
    boost_score: number
}> = {
    4: {
        strong_indicators: [
            'โน้ตบุ๊ค', 'laptop', 'notebook', 'คอมพิวเตอร์',
            'ram', 'ssd', 'cpu', 'gpu', 'ryzen', 'intel',
            'acer', 'asus', 'dell', 'hp', 'lenovo'
        ],
        boost_score: 20
    },
    6: {
        strong_indicators: [
            'เสื้อ', 'กางเกง', 'รองเท้า', 'กระเป๋า',
            'nike', 'adidas', 'size m', 'size l',
            'cotton', 'polyester'
        ],
        boost_score: 20
    },
    3: {
        strong_indicators: [
            'iphone', 'samsung', 'smartphone', 'มือถือ',
            '5g', 'dual sim', 'snapdragon'
        ],
        boost_score: 20
    },
    // Category 14: Beauty & Cosmetics (NEW!)
    14: {
        strong_indicators: [
            'เครื่องสำอาง', 'cosmetics', 'makeup', 'แต่งหน้า',
            'lipstick', 'ลิปสติก', 'foundation', 'รองพื้น',
            'skincare', 'บำรุงผิว', 'serum', 'เซรั่ม',
            'maybelline', 'loreal', 'mac', 'dior'
        ],
        boost_score: 20
    },

    // Category 1: Automotive (NEW!)
    1: {
        strong_indicators: [
            'รถยนต์', 'รถมือสอง', 'รถใหม่', 'car', 'automobile',
            'รถกระบะ', 'pickup', 'รถเก๋ง', 'sedan', 'รถ suv',
            'มอเตอร์ไซค์', 'มอไซค์', 'motorcycle', 'bike',
            'toyota', 'honda', 'isuzu', 'mazda', 'nissan',
            'cc', 'ซีซี', 'เครื่องยนต์', 'engine'
        ],
        boost_score: 25
    },

    // Category 2: Real Estate (NEW!)
    2: {
        strong_indicators: [
            'บ้าน', 'คอนโด', 'ที่ดิน', 'ทาวน์เฮ้าส์', 'house', 'condo',
            'ขาย', 'ให้เช่า', 'for sale', 'for rent',
            'ห้องนอน', 'bedroom', 'ตารางเมตร', 'sqm',
            'ชั้น', 'floor', 'ตำบล', 'อำเภอ', 'จังหวัด'
        ],
        boost_score: 30  // Very high priority
    },

    // Category 7: Gaming & Gadgets (NEW!)
    7: {
        strong_indicators: [
            'ps5', 'ps4', 'xbox', 'nintendo', 'switch',
            'เกม', 'game', 'console', 'เครื่องเกม',
            'จอย', 'controller', 'gamepad', 'headset',
            'playstation', 'วีดิโอเกม', 'gaming'
        ],
        boost_score: 25
    },

    // Category 8: Cameras (NEW!)
    8: {
        strong_indicators: [
            'กล้อง', 'camera', 'กล้องถ่ายรูป', 'กล้องวิดีโอ',
            'canon', 'nikon', 'sony camera', 'fujifilm',
            'เลนส์', 'lens', 'กล้อง dslr', 'mirrorless',
            'gopro', 'action camera'
        ],
        boost_score: 25
    },

    // Category 9: Amulets & Collectibles (NEW!)
    9: {
        strong_indicators: [
            'พระเครื่อง', 'amulet', 'พระพุทธรูป', 'เหรียญ',
            'ของสะสม', 'collectible', 'พระบูชา',
            'เหรียญกษาปณ์', 'coin', 'แสตมป์', 'stamp'
        ],
        boost_score: 30  // Highly specific
    },

    // Category 10: Pets (NEW!)
    10: {
        strong_indicators: [
            'สุนัข', 'แมว', 'dog', 'cat', 'pet',
            'สัตว์เลี้ยง', 'ลูกสุนัข', 'puppy', 'kitten',
            'อาหารสุนัข', 'อาหารแมว', 'dog food', 'cat food',
            'กรงสุนัข', 'pet cage', 'ปลาสวยงาม', 'fish'
        ],
        boost_score: 25
    },

    // Category 12: Sports & Travel (NEW!)
    12: {
        strong_indicators: [
            'จักรยาน', 'bicycle', 'bike', 'กีฬา', 'sport',
            'ฟิตเนส', 'fitness', 'ออกกำลังกาย', 'gym',
            'ลู่วิ่ง', 'treadmill', 'dumbell', 'ดัมเบล',
            'เต็นท์', 'tent', 'กระเป๋าเดินทาง', 'luggage'
        ],
        boost_score: 20
    },

    // Category 13: Home & Garden (NEW! - CRITICAL FOR CARPET!)
    13: {
        strong_indicators: [
            // Furniture
            'เฟอร์นิเจอร์', 'furniture', 'โซฟา', 'sofa', 'เตียง', 'bed',
            'โต๊ะ', 'table', 'เก้าอี้', 'chair', 'ตู้', 'cabinet',

            // Home Decor (CARPETS!)
            'พรม', 'carpet', 'rug', 'พรมเช็ดเท้า', 'พรมปูพื้น',
            'ผ้าม่าน', 'curtain', 'โคมไฟ', 'lamp',
            'หมอนอิง', 'cushion', 'ผ้าปูที่นอน',

            // Garden
            'ต้นไม้', 'plant', 'กระถาง', 'pot', 'ดิน', 'soil',
            'ต้นไม้ประดับ', 'บอนไซ', 'bonsai',

            // Tools
            'สว่าน', 'drill', 'เครื่องมือช่าง', 'tools',
            'เครื่องตัดหญ้า', 'lawn mower',

            // Brands
            'ikea', 'อิเกีย', 'index', 'sb furniture'
        ],
        boost_score: 30  // VERY HIGH - to beat Computer category!
    },

    // Category 5: Appliances
    5: {
        strong_indicators: [
            // Air Purifier (Top Priority!)
            'เครื่องฟอกอากาศ', 'air purifier', 'ฟอกอากาศ', 'กรองอากาศ',
            'plasmacluster', 'hepa', 'pm 2.5', 'pm2.5',
            // Fan
            'พัดลม', 'fan', 'hatari', 'ฮาตาริ',
            'พัดลมตั้งโต๊ะ', 'พัดลมตั้งพื้น',
            // Air Conditioner
            'แอร์', 'air conditioner', 'เครื่องปรับอากาศ', 'btu',
            // Refrigerator
            'ตู้เย็น', 'refrigerator', 'fridge',
            // Washing Machine
            'เครื่องซักผ้า', 'washing machine',
            // Kitchen
            'หม้อหุงข้าว', 'rice cooker', 'หม้อทอดไร้น้ำมัน', 'air fryer',
            // Brands
            'sharp', 'panasonic', 'mitsubishi', 'hitachi', 'toshiba',
            'daikin', 'lg', 'electrolux', 'dyson', 'philips'
        ],
        boost_score: 25  // Higher boost for appliances!
    },
    // Category 15: Baby & Kids (EXPANDED!)
    15: {
        strong_indicators: [
            'เด็ก', 'ทารก', 'baby', 'kids',
            'รถเข็นเด็ก', 'stroller', 'ผ้าอ้อม', 'diaper',
            'ของเล่น', 'toy', 'toys', 'เสื้อผ้าเด็ก',
            // Dolls & Stuffed Animals (NEW!)
            'ตุ๊กตา', 'doll', 'dolls', 'plush', 'stuffed',
            'ตุ๊กตาไดโนเสาร์', 'dinosaur', 'ไดโนเสาร์',
            'ตุ๊กตาสัตว์', 'animal doll', 'น่ารัก', 'cute',
            // Brands
            'pampers', 'huggies', 'lego', 'barbie', 'hot wheels'
        ],
        boost_score: 25  // Higher boost!
    },
    // Category 16: Books & Education (NEW!)
    16: {
        strong_indicators: [
            'หนังสือ', 'book', 'นิยาย', 'novel',
            'มังงะ', 'manga', 'comic', 'การ์ตูน',
            'เครื่องเขียน', 'stationery', 'ปากกา', 'สมุด',
            'หนังสือเรียน', 'textbook'
        ],
        boost_score: 20
    }
}

// ================================================================
// INTELLIGENT SCORING SYSTEM
// ================================================================

/**
 * Calculate category score with advanced intelligence
 */
export function calculateAdvancedScore(
    category: Category,
    signals: {
        title: string
        description: string
        detectedObjects: string[]
        imageAnalysis?: string
        brand?: string
    }
): {
    score: number
    confidence: number
    reasoning: string[]
    signals_matched: Record<string, number>
} {
    const normalize = (text: string) => text.toLowerCase().trim().replace(/\s+/g, ' ')

    const titleNorm = normalize(signals.title)
    const descNorm = normalize(signals.description)
    const imageNorm = normalize(signals.imageAnalysis || '')
    const allText = `${titleNorm} ${descNorm} ${imageNorm}`

    let score = 0
    const reasoning: string[] = []
    const signals_matched: Record<string, number> = {
        brand: 0,
        model: 0,
        technical: 0,
        keyword: 0,
        image: 0,
        exclusion: 0,
        inclusion: 0
    }

    // 1. CHECK EXCLUSION RULES (Highest Priority - Can Disqualify)
    const exclusions = EXCLUSION_RULES[category.id]
    if (exclusions) {
        for (const term of exclusions.exclude_if_has) {
            if (allText.includes(normalize(term))) {
                score -= 50 // Heavy penalty!
                reasoning.push(`❌ Excluded: found "${term}"`)
                signals_matched.exclusion -= 50
                break
            }
        }
    }

    // 2. BRAND DETECTION (+25 points)
    const brandCategories = signals.brand
        ? BRAND_CATEGORY_MAP[normalize(signals.brand)]
        : []

    if (brandCategories?.includes(category.id)) {
        score += 25
        reasoning.push(`✅ Brand "${signals.brand}" matches category`)
        signals_matched.brand = 25
    }

    // Check brand in title
    for (const [brand, categories] of Object.entries(BRAND_CATEGORY_MAP)) {
        if (titleNorm.includes(brand) && categories.includes(category.id)) {
            score += 20
            reasoning.push(`✅ Brand "${brand}" found in title`)
            signals_matched.brand += 20
            break
        }
    }

    // 3. MODEL NUMBER DETECTION (+30 points)
    for (const model of MODEL_NUMBER_PATTERNS) {
        if (model.pattern.test(titleNorm) && model.category === category.id) {
            score += 30
            reasoning.push(`✅ Model pattern matched: ${model.type}`)
            signals_matched.model = 30
            break
        }
    }

    // 4. TECHNICAL TERMS (+25 points)
    const techTerms = TECHNICAL_TERMS[category.id] || []
    let techScore = 0
    for (const term of techTerms) {
        if (allText.includes(normalize(term))) {
            techScore += 5
            if (techScore <= 10) { // Log only first 2
                reasoning.push(`✅ Technical term: "${term}"`)
            }
        }
    }
    score += Math.min(techScore, 25)
    signals_matched.technical = Math.min(techScore, 25)

    // 5. INCLUSION BOOSTERS (+20 points)
    const boosters = INCLUSION_BOOSTERS[category.id]
    if (boosters) {
        let boostScore = 0
        for (const indicator of boosters.strong_indicators) {
            if (titleNorm.includes(normalize(indicator))) {
                boostScore += boosters.boost_score
                reasoning.push(`✅ Strong indicator: "${indicator}"`)
                break
            }
        }
        score += Math.min(boostScore, 20)
        signals_matched.inclusion = Math.min(boostScore, 20)
    }

    // 6. IMAGE ANALYSIS (+20 points)
    if (signals.imageAnalysis) {
        const categoryNameMatch =
            imageNorm.includes(normalize(category.name_en)) ||
            imageNorm.includes(normalize(category.name_th))

        if (categoryNameMatch) {
            score += 20
            reasoning.push(`✅ Image analysis matches category name`)
            signals_matched.image = 20
        } else {
            // Check for related terms
            const relatedTerms = techTerms.slice(0, 5) // Top 5 terms
            let imageTermScore = 0
            for (const term of relatedTerms) {
                if (imageNorm.includes(normalize(term))) {
                    imageTermScore += 4
                }
            }
            score += Math.min(imageTermScore, 15)
            signals_matched.image = Math.min(imageTermScore, 15)
        }
    }

    // Calculate confidence (0-1)
    // Max possible: Brand(25+20) + Model(30) + Technical(25) + Inclusion(20) + Image(20) = 140
    const maxScore = 140
    const confidence = Math.min(Math.max(score / maxScore, 0), 1)

    return {
        score: Math.max(score, 0), // Never negative
        confidence,
        reasoning,
        signals_matched
    }
}

/**
 * Smart Confidence Threshold
 * Don't auto-select if confidence is too low
 */
export function shouldAutoSelect(confidence: number, topScores: number[]): boolean {
    // Need at least 70% confidence
    if (confidence < 0.70) {
        return false
    }

    // Check separation from 2nd place
    if (topScores.length >= 2) {
        const first = topScores[0]
        const second = topScores[1]
        const separation = (first - second) / first

        // Need at least 20% separation
        if (separation < 0.20) {
            return false
        }
    }

    return true
}

/**
 * Rank categories by score with intelligent sorting
 */
export function rankCategories(scores: Array<{
    category: Category
    score: number
    confidence: number
    reasoning: string[]
}>): Array<{
    category: Category
    score: number
    confidence: number
    reasoning: string[]
    rank: number
}> {
    // Sort by:
    // 1. Score (descending)
    // 2. Confidence (descending)
    // 3. Number of signals matched (descending)
    const sorted = scores
        .filter(s => s.score > 0) // Remove negatives
        .sort((a, b) => {
            // Primary: Score
            if (b.score !== a.score) {
                return b.score - a.score
            }
            // Secondary: Confidence
            if (b.confidence !== a.confidence) {
                return b.confidence - a.confidence
            }
            // Tertiary: Reasoning count (more signals = better)
            return b.reasoning.length - a.reasoning.length
        })

    // Assign ranks
    return sorted.map((item, index) => ({
        ...item,
        rank: index + 1
    }))
}

/**
 * Extract brand from title
 */
export function extractBrand(title: string): string | null {
    const titleLower = title.toLowerCase()

    // Check known brands
    for (const brand of Object.keys(BRAND_CATEGORY_MAP)) {
        if (titleLower.includes(brand)) {
            return brand.charAt(0).toUpperCase() + brand.slice(1)
        }
    }

    return null
}

/**
 * Extract model number from title
 */
export function extractModelNumber(title: string): string | null {
    for (const pattern of MODEL_NUMBER_PATTERNS) {
        const match = title.match(pattern.pattern)
        if (match) {
            return match[0]
        }
    }

    return null
}

/**
 * Get detailed analysis for debugging
 */
export function getDetailedAnalysis(
    title: string,
    description: string,
    imageAnalysis?: string
): {
    detected_brand?: string
    detected_model?: string
    technical_terms: string[]
    exclusions_triggered: Record<number, string[]>
    strong_indicators: Record<number, string[]>
} {
    const allText = `${title} ${description} ${imageAnalysis || ''}`.toLowerCase()

    const detected_brand = extractBrand(title)
    const detected_model = extractModelNumber(title)

    // Find technical terms
    const technical_terms: string[] = []
    for (const terms of Object.values(TECHNICAL_TERMS)) {
        for (const term of terms) {
            if (allText.includes(term.toLowerCase())) {
                technical_terms.push(term)
            }
        }
    }

    // Check exclusions
    const exclusions_triggered: Record<number, string[]> = {}
    for (const [catId, rules] of Object.entries(EXCLUSION_RULES)) {
        const triggered: string[] = []
        for (const term of rules.exclude_if_has) {
            if (allText.includes(term.toLowerCase())) {
                triggered.push(term)
            }
        }
        if (triggered.length > 0) {
            exclusions_triggered[parseInt(catId)] = triggered
        }
    }

    // Check strong indicators
    const strong_indicators: Record<number, string[]> = {}
    for (const [catId, boosters] of Object.entries(INCLUSION_BOOSTERS)) {
        const found: string[] = []
        for (const indicator of boosters.strong_indicators) {
            if (allText.includes(indicator.toLowerCase())) {
                found.push(indicator)
            }
        }
        if (found.length > 0) {
            strong_indicators[parseInt(catId)] = found
        }
    }

    return {
        detected_brand: detected_brand || undefined,
        detected_model: detected_model || undefined,
        technical_terms: technical_terms.slice(0, 10), // Top 10
        exclusions_triggered,
        strong_indicators
    }
}
