// AI-powered product validation and suggestions

export interface ProductValidation {
    isValid: boolean
    warnings: ProductWarning[]
    suggestions: ProductSuggestion[]
    riskLevel: 'safe' | 'caution' | 'high'
}

export interface ProductWarning {
    field: string
    type: 'forbidden_word' | 'misleading' | 'incomplete' | 'pricing'
    severity: 'error' | 'warning' | 'info'
    message: {
        th: string
        en: string
    }
}

export interface ProductSuggestion {
    field: string
    type: 'title' | 'description' | 'price' | 'category'
    value: string | number
    reason: {
        th: string
        en: string
    }
}

// Forbidden words that should trigger warnings
const FORBIDDEN_WORDS = {
    th: [
        'ปลอม', 'เทียม', 'แท้100%', 'รับประกันแท้',
        'ของแท้แน่นอน', 'ถูกที่สุด', 'ฟรี', 'แจกฟรี',
        'รวยแน่', 'ร่ำรวย', 'ลดน้ำหนัก', 'หายขาด'
    ],
    en: [
        'fake', 'replica', '100% authentic', 'guaranteed authentic',
        'cheapest', 'free', 'get rich', 'weight loss', 'cure'
    ]
}

// Misleading patterns
const MISLEADING_PATTERNS = {
    th: [
        /แท้\s*100%/i,
        /ของแท้\s*แน่นอน/i,
        /ถูกที่สุด/i,
        /ฟรี\s*ทุก/i,
        /รับประกัน\s*แท้/i
    ],
    en: [
        /100%\s*authentic/i,
        /guaranteed\s*real/i,
        /cheapest\s*price/i,
        /free\s*everything/i
    ]
}

// AI Title Suggestions
export function generateTitleSuggestions(input: {
    category?: string
    brand?: string
    condition?: string
    keywords?: string[]
}): string[] {
    const suggestions: string[] = []

    // Pattern 1: Brand + Product Type + Condition
    if (input.brand && input.category) {
        suggestions.push(`${input.brand} ${input.category} ${input.condition || 'มือสอง'}`)
    }

    // Pattern 2: Descriptive + Category
    if (input.keywords && input.keywords.length > 0) {
        suggestions.push(`${input.keywords.join(' ')} ${input.category || 'สภาพดี'}`)
    }

    // Pattern 3: Simple
    if (input.category) {
        suggestions.push(`${input.category} ${input.condition || 'สภาพสวย'}`)
    }

    return suggestions.slice(0, 3)
}

// AI Description Generator
export function generateDescriptionSuggestions(input: {
    title: string
    category?: string
    condition?: string
    brand?: string
    features?: string[]
}): { short: string; standard: string; detailed: string } {
    const condition = input.condition || 'มือสอง'
    const brand = input.brand || ''

    // Short (1-2 sentences)
    const short = `${input.title} ${condition} ${brand ? `ยี่ห้อ ${brand}` : ''} สภาพดี พร้อมใช้งาน`

    // Standard (3-4 sentences)
    const standard = `✨ ${input.title}\n\n` +
        `📌 รายละเอียด:\n` +
        `- สภาพ: ${condition}\n` +
        `${brand ? `- ยี่ห้อ: ${brand}\n` : ''}` +
        `- ใช้งานได้ปกติ ไม่มีปัญหา\n\n` +
        `🎯 พร้อมส่ง ตรวจสอบก่อนส่งทุกครั้ง`

    // Detailed (full description)
    const detailed = `✨ ${input.title} ✨\n\n` +
        `📌 รายละเอียดสินค้า:\n` +
        `- สภาพ: ${condition}\n` +
        `${brand ? `- ยี่ห้อ: ${brand}\n` : ''}` +
        `${input.features ? input.features.map(f => `- ${f}\n`).join('') : ''}` +
        `- ใช้งานได้ปกติ 100%\n` +
        `- ตรวจสอบทุกฟังก์ชันก่อนส่ง\n\n` +
        `🎯 สภาพการใช้งาน:\n` +
        `- ไม่มีตำหนิร้ายแรง\n` +
        `- ทำความสะอาดเรียบร้อย\n` +
        `- พร้อมส่งทันที\n\n` +
        `📦 การจัดส่ง:\n` +
        `- แพ็คดีทุกชิ้น\n` +
        `- ส่งไวภายใน 1-2 วัน\n` +
        `- ติดต่อสอบถามได้ตลอด`

    return { short, standard, detailed }
}

// AI Price Suggestions
export function generatePriceSuggestions(input: {
    category?: string
    condition?: string
    brand?: string
    originalPrice?: number
}): { quickSell: number; market: number; maxProfit: number; reasoning: { th: string; en: string } } {
    // Mock pricing logic (in production, this would use ML model)
    const basePrice = input.originalPrice || 1000
    const conditionMultiplier = {
        'ใหม่': 0.85,
        'มือสอง': 0.60,
        'สภาพดี': 0.70,
        'มีตำหนิ': 0.40
    }[input.condition || 'มือสอง'] || 0.60

    const marketPrice = Math.round(basePrice * conditionMultiplier)

    return {
        quickSell: Math.round(marketPrice * 0.85),
        market: marketPrice,
        maxProfit: Math.round(marketPrice * 1.15),
        reasoning: {
            th: `ราคาตลาดสำหรับ ${input.condition || 'มือสอง'} อยู่ที่ประมาณ ${marketPrice.toLocaleString()} บาท`,
            en: `Market price for ${input.condition || 'used'} is around ฿${marketPrice.toLocaleString()}`
        }
    }
}

// Validate product data
export function validateProduct(data: {
    title: string
    description: string
    price: number
    category?: string
}, language: 'th' | 'en' = 'th'): ProductValidation {
    const warnings: ProductWarning[] = []
    const suggestions: ProductSuggestion[] = []

    // Check forbidden words in title
    const titleLower = data.title.toLowerCase()
    const forbiddenFound = FORBIDDEN_WORDS[language].filter(word =>
        titleLower.includes(word.toLowerCase())
    )

    if (forbiddenFound.length > 0) {
        warnings.push({
            field: 'title',
            type: 'forbidden_word',
            severity: 'warning',
            message: {
                th: `พบคำต้องห้าม: "${forbiddenFound.join(', ')}" อาจถูกระงับโฆษณา`,
                en: `Forbidden words found: "${forbiddenFound.join(', ')}" - may be suspended`
            }
        })
    }

    // Check misleading patterns
    const misleadingFound = MISLEADING_PATTERNS[language].some(pattern =>
        pattern.test(data.title) || pattern.test(data.description)
    )

    if (misleadingFound) {
        warnings.push({
            field: 'description',
            type: 'misleading',
            severity: 'error',
            message: {
                th: 'พบข้อความที่อาจทำให้เข้าใจผิด กรุณาแก้ไข',
                en: 'Misleading content detected. Please revise.'
            }
        })
    }

    // Check title length
    if (data.title.length < 10) {
        warnings.push({
            field: 'title',
            type: 'incomplete',
            severity: 'warning',
            message: {
                th: 'ชื่อสินค้าสั้นเกินไป ควรยาวอย่างน้อย 10 ตัวอักษร',
                en: 'Title too short. Should be at least 10 characters.'
            }
        })
    }

    // Check description length
    if (data.description.length < 50) {
        warnings.push({
            field: 'description',
            type: 'incomplete',
            severity: 'info',
            message: {
                th: 'คำอธิบายสั้น ลองเพิ่มรายละเอียดเพื่อดึงดูดผู้ซื้อ',
                en: 'Short description. Add more details to attract buyers.'
            }
        })
    }

    // Check price reasonableness
    if (data.price < 10) {
        warnings.push({
            field: 'price',
            type: 'pricing',
            severity: 'warning',
            message: {
                th: 'ราคาต่ำมาก อาจดูไม่น่าเชื่อถือ',
                en: 'Price too low. May look suspicious.'
            }
        })
    }

    if (data.price > 1000000) {
        warnings.push({
            field: 'price',
            type: 'pricing',
            severity: 'warning',
            message: {
                th: 'ราคาสูงมาก ตรวจสอบให้แน่ใจว่าถูกต้อง',
                en: 'Price very high. Please double-check.'
            }
        })
    }

    // Generate suggestions
    if (data.title && !data.category) {
        suggestions.push({
            field: 'category',
            type: 'category',
            value: 'อิเล็กทรอนิกส์', // Mock
            reason: {
                th: 'AI แนะนำหมวดหมู่ตามชื่อสินค้า',
                en: 'AI suggests category based on title'
            }
        })
    }

    // Determine risk level
    const hasErrors = warnings.some(w => w.severity === 'error')
    const hasWarnings = warnings.some(w => w.severity === 'warning')
    const riskLevel: 'safe' | 'caution' | 'high' =
        hasErrors ? 'high' : hasWarnings ? 'caution' : 'safe'

    return {
        isValid: !hasErrors,
        warnings,
        suggestions,
        riskLevel
    }
}

// Get risk level color
export function getRiskColor(level: 'safe' | 'caution' | 'high'): {
    bg: string
    text: string
    border: string
} {
    const colors = {
        safe: {
            bg: 'bg-green-50 dark:bg-green-900/20',
            text: 'text-green-700 dark:text-green-300',
            border: 'border-green-200 dark:border-green-800'
        },
        caution: {
            bg: 'bg-amber-50 dark:bg-amber-900/20',
            text: 'text-amber-700 dark:text-amber-300',
            border: 'border-amber-200 dark:border-amber-800'
        },
        high: {
            bg: 'bg-red-50 dark:bg-red-900/20',
            text: 'text-red-700 dark:text-red-300',
            border: 'border-red-200 dark:border-red-800'
        }
    }

    return colors[level]
}
