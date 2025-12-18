/**
 * Subcategory Validator AI
 * 
 * Validates subcategory selection and suggests relevant options
 * when required but missing
 */

// Categories that REQUIRE subcategory selection
const REQUIRES_SUBCATEGORY = [
    '3', // มือถือและแท็บเล็ต
    '4', // คอมพิวเตอร์และไอที
    '5', // อิเล็กทรอนิกส์
    '1', // ยานยนต์
    '2', // อสังหาริมทรัพย์
]

// Subcategory options per main category
const SUBCATEGORY_OPTIONS: Record<string, { id: string; name: string; keywords: string[] }[]> = {
    '3': [ // มือถือและแท็บเล็ต
        { id: 'mobile-phone', name: 'มือถือ / โทรศัพท์', keywords: ['iphone', 'samsung', 'oppo', 'vivo', 'xiaomi', 'smartphone', 'มือถือ', 'โทรศัพท์'] },
        { id: 'tablet', name: 'แท็บเล็ต / iPad', keywords: ['ipad', 'tablet', 'แท็บเล็ต'] },
        { id: 'accessories', name: 'อุปกรณ์เสริม', keywords: ['เคส', 'ฟิล์ม', 'หูฟัง', 'ที่ชาร์จ', 'powerbank', 'สายชาร์จ'] },
    ],
    '4': [ // คอมพิวเตอร์และไอที
        { id: 'notebook', name: 'โน้ตบุ๊ค / Notebook', keywords: ['macbook', 'notebook', 'laptop', 'โน้ตบุ๊ค'] },
        { id: 'desktop', name: 'คอมพิวเตอร์ตั้งโต๊ะ', keywords: ['desktop', 'pc', 'คอมพิวเตอร์'] },
        { id: 'printer', name: 'เครื่องพิมพ์', keywords: ['printer', 'เครื่องพิมพ์', 'epson', 'canon', 'hp'] },
        { id: 'accessories', name: 'อุปกรณ์คอมพิวเตอร์', keywords: ['keyboard', 'mouse', 'monitor', 'จอ', 'แป้นพิมพ์', 'เมาส์'] },
    ],
    '5': [ // อิเล็กทรอนิกส์
        { id: 'tv', name: 'ทีวี', keywords: ['tv', 'television', 'ทีวี', 'samsung', 'lg', 'sony'] },
        { id: 'camera', name: 'กล้อง', keywords: ['camera', 'กล้อง', 'canon', 'nikon', 'sony', 'gopro'] },
        { id: 'audio', name: 'เครื่องเสียง', keywords: ['speaker', 'หูฟัง', 'ลำโพง', 'amplifier'] },
        { id: 'home-appliance', name: 'เครื่องใช้ไฟฟ้า', keywords: ['แอร์', 'ตู้เย็น', 'เครื่องซักผ้า', 'พัดลม'] },
    ],
    '1': [ // ยานยนต์
        { id: 'car', name: 'รถยนต์', keywords: ['รถยนต์', 'รถเก๋ง', 'รถกระบะ', 'suv', 'toyota', 'honda', 'mazda'] },
        { id: 'motorcycle', name: 'มอเตอร์ไซค์', keywords: ['มอเตอร์ไซค์', 'มอไซค์', 'รถจักรยานยนต์', 'bigbike', 'honda', 'yamaha'] },
        { id: 'auto-parts', name: 'อะไหล่รถยนต์', keywords: ['อะไหล่', 'ยาง', 'แบตเตอรี่', 'น้ำมันเครื่อง'] },
    ],
    '2': [ // อสังหาริมทรัพย์
        { id: 'condo', name: 'คอนโด', keywords: ['คอนโด', 'condo', 'condominium'] },
        { id: 'house', name: 'บ้าน', keywords: ['บ้าน', 'บ้านเดี่ยว', 'ทาวน์เฮ้าส์', 'house'] },
        { id: 'land', name: 'ที่ดิน', keywords: ['ที่ดิน', 'land', 'ไร่', 'งาน'] },
    ],
}

export interface SubcategoryValidationResult {
    is_valid: boolean
    suggested_subcategories: Array<{
        id: string
        name: string
        confidence: number
        reasoning: string
    }>
    helper_text: string
    requires_subcategory: boolean
}

/**
 * Calculate subcategory match confidence
 */
function calculateSubcategoryConfidence(
    subcategory: { id: string; name: string; keywords: string[] },
    title: string,
    description: string
): number {
    const allText = `${title} ${description}`.toLowerCase()
    let matches = 0

    subcategory.keywords.forEach(keyword => {
        if (allText.includes(keyword.toLowerCase())) {
            matches++
        }
    })

    // Normalize to 0-1 scale
    const maxMatches = Math.min(subcategory.keywords.length, 5)
    return Math.min(matches / maxMatches, 1)
}

/**
 * Validate subcategory selection
 */
export function validateSubcategory(params: {
    categoryId: string
    subcategoryId?: string
    title: string
    description: string
    detectedObjects?: string[]
}): SubcategoryValidationResult {
    const { categoryId, subcategoryId, title, description, detectedObjects = [] } = params

    // Check if this category requires subcategory
    const requiresSubcategory = REQUIRES_SUBCATEGORY.includes(categoryId)

    if (!requiresSubcategory) {
        return {
            is_valid: true,
            suggested_subcategories: [],
            helper_text: 'หมวดหมู่นี้ไม่จำเป็นต้องเลือกหมวดย่อย',
            requires_subcategory: false
        }
    }

    // If already has subcategory, validate it's valid
    if (subcategoryId) {
        const subcategories = SUBCATEGORY_OPTIONS[categoryId] || []
        const isValidSubcat = subcategories.some(sub => sub.id === subcategoryId)

        return {
            is_valid: isValidSubcat,
            suggested_subcategories: [],
            helper_text: isValidSubcat
                ? 'หมวดย่อยถูกต้อง'
                : 'หมวดย่อยไม่ถูกต้อง กรุณาเลือกใหม่',
            requires_subcategory: true
        }
    }

    // No subcategory selected - suggest top 2-3
    const subcategories = SUBCATEGORY_OPTIONS[categoryId] || []

    if (subcategories.length === 0) {
        return {
            is_valid: false,
            suggested_subcategories: [],
            helper_text: 'กรุณาเลือกหมวดย่อย',
            requires_subcategory: true
        }
    }

    // Calculate confidence for each subcategory
    const scoredSubcategories = subcategories.map(subcat => {
        const confidence = calculateSubcategoryConfidence(subcat, title, description)

        return {
            id: subcat.id,
            name: subcat.name,
            confidence,
            reasoning: confidence > 0.5
                ? 'ตรงกับคำที่ใช้ในรายละเอียดสินค้า'
                : 'เกี่ยวข้องกับหมวดหมู่นี้'
        }
    })

    // Sort by confidence and take top 3
    scoredSubcategories.sort((a, b) => b.confidence - a.confidence)
    const topSuggestions = scoredSubcategories.slice(0, 3)

    return {
        is_valid: false,
        suggested_subcategories: topSuggestions,
        helper_text: topSuggestions.length > 0
            ? `กรุณาเลือกหมวดย่อยที่ตรงที่สุด (${topSuggestions.length} ตัวเลือก)`
            : 'กรุณาเลือกหมวดย่อย',
        requires_subcategory: true
    }
}

/**
 * Get all subcategories for a category
 */
export function getSubcategoriesForCategory(categoryId: string) {
    return SUBCATEGORY_OPTIONS[categoryId] || []
}

/**
 * Check if category requires subcategory
 */
export function categoryRequiresSubcategory(categoryId: string): boolean {
    return REQUIRES_SUBCATEGORY.includes(categoryId)
}
