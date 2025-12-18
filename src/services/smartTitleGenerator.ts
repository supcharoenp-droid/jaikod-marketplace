/**
 * Smart Product Title AI
 * 
 * Generates optimized, search-friendly product titles
 * Detects missing attributes and provides buyer-focused suggestions
 */

import { CATEGORIES, type Category, type Subcategory } from '@/constants/categories'

export interface TitleSuggestion {
    suggested_title: string
    missing_attributes: MissingAttribute[]
    buyer_focus_hint: {
        th: string
        en: string
    }
    title_score: number // 0-100
    improvements: string[]
}

export interface MissingAttribute {
    attribute: string
    importance: 'critical' | 'important' | 'nice_to_have'
    example: {
        th: string
        en: string
    }
    impact: {
        th: string
        en: string
    }
}

export interface TitleAnalysis {
    current_title?: string
    current_score: number
    issues: TitleIssue[]
    suggestions: TitleSuggestion[]
}

interface TitleIssue {
    type: 'too_short' | 'too_long' | 'missing_brand' | 'missing_specs' | 'unclear' | 'spam'
    severity: 'error' | 'warning' | 'info'
    message: {
        th: string
        en: string
    }
}

/**
 * Category-specific title templates and attributes
 */
interface CategoryTitleTemplate {
    category_id: number
    critical_attributes: string[]
    important_attributes: string[]
    optional_attributes: string[]
    title_format: string
    examples: { th: string; en: string }[]
}

const TITLE_TEMPLATES: CategoryTitleTemplate[] = [
    // Mobiles & Tablets
    {
        category_id: 3,
        critical_attributes: ['brand', 'model', 'storage'],
        important_attributes: ['color', 'condition'],
        optional_attributes: ['warranty', 'accessories'],
        title_format: '[Brand] [Model] [Storage] [Color] [Condition]',
        examples: [
            { th: 'iPhone 13 Pro 256GB สีน้ำเงิน มือสอง สภาพดี', en: 'iPhone 13 Pro 256GB Blue Like New' },
            { th: 'Samsung Galaxy S23 Ultra 512GB สีดำ ศูนย์ไทย', en: 'Samsung Galaxy S23 Ultra 512GB Black Thai Version' }
        ]
    },
    // Computers & IT
    {
        category_id: 4,
        critical_attributes: ['brand', 'model', 'specs'],
        important_attributes: ['condition', 'warranty'],
        optional_attributes: ['color', 'accessories'],
        title_format: '[Brand] [Model] [CPU/RAM/Storage] [Condition]',
        examples: [
            { th: 'MacBook Pro M1 16GB 512GB มือสองสภาพดี', en: 'MacBook Pro M1 16GB 512GB Good Condition' },
            { th: 'Dell XPS 13 i7 16GB 1TB SSD ศูนย์ไทย', en: 'Dell XPS 13 i7 16GB 1TB SSD Thai Warranty' }
        ]
    },
    // Automotive
    {
        category_id: 1,
        critical_attributes: ['brand', 'model', 'year'],
        important_attributes: ['mileage', 'transmission', 'color'],
        optional_attributes: ['owner_count', 'service_history'],
        title_format: '[Brand] [Model] [Year] [Mileage]km [Details]',
        examples: [
            { th: 'Honda Civic 2020 40,000km เกียร์ออโต้ สีขาว', en: 'Honda Civic 2020 40,000km Auto White' },
            { th: 'Toyota Fortuner 2019 80,000km 4WD ดีเซล', en: 'Toyota Fortuner 2019 80,000km 4WD Diesel' }
        ]
    },
    // Real Estate
    {
        category_id: 2,
        critical_attributes: ['type', 'bedrooms', 'area', 'location'],
        important_attributes: ['price_type', 'floor'],
        optional_attributes: ['view', 'facilities'],
        title_format: '[Type] [Bedrooms]ห้องนอน [Area]ตรม. [Location]',
        examples: [
            { th: 'คอนโด 2ห้องนอน 60ตรม. ใกล้ BTS อโศก', en: 'Condo 2BR 60sqm Near BTS Asoke' },
            { th: 'บ้านเดี่ยว 3ห้องนอน 200ตรม. ลาดพร้าว', en: 'House 3BR 200sqm Ladprao' }
        ]
    },
    // Fashion
    {
        category_id: 6,
        critical_attributes: ['brand', 'item_type', 'condition'],
        important_attributes: ['size', 'color', 'material'],
        optional_attributes: ['year', 'limited_edition'],
        title_format: '[Brand] [Item] [Size] [Condition]',
        examples: [
            { th: 'Louis Vuitton กระเป๋า Neverfull MM ของแท้ 100%', en: 'Louis Vuitton Neverfull MM Authentic' },
            { th: 'Nike Air Jordan 1 size 42 มือสองสภาพดี', en: 'Nike Air Jordan 1 Size 42 Good Condition' }
        ]
    },
    // Home Appliances
    {
        category_id: 5,
        critical_attributes: ['brand', 'model', 'capacity'],
        important_attributes: ['condition', 'age'],
        optional_attributes: ['warranty', 'energy_rating'],
        title_format: '[Brand] [Type] [Capacity] [Condition]',
        examples: [
            { th: 'แอร์ Daikin 18,000 BTU อินเวอร์เตอร์ ประกัน 3 ปี', en: 'Daikin Air 18,000 BTU Inverter 3Y Warranty' },
            { th: 'ตู้เย็น Samsung 2 ประตู 16 คิว มือสอง', en: 'Samsung Fridge 2-Door 16cu Used' }
        ]
    }
]

/**
 * Generate smart title suggestions
 */
export async function generateTitleSuggestions(input: {
    category_id?: number
    subcategory_id?: number
    current_title?: string
    detected_attributes?: Record<string, string>
    user_inputs?: Record<string, any>
}): Promise<TitleAnalysis> {
    console.log('[TitleAI] Generating suggestions...')

    const currentTitle = input.current_title || ''
    const categoryId = input.category_id

    // Analyze current title
    const currentScore = analyzeTitle(currentTitle, categoryId)
    const issues = detectTitleIssues(currentTitle, categoryId)

    // Generate suggestions
    const suggestions = await generateSuggestions(input)

    return {
        current_title: currentTitle || undefined,
        current_score: currentScore,
        issues,
        suggestions
    }
}

/**
 * Generate title suggestions
 */
async function generateSuggestions(input: {
    category_id?: number
    subcategory_id?: number
    current_title?: string
    detected_attributes?: Record<string, string>
    user_inputs?: Record<string, any>
}): Promise<TitleSuggestion[]> {
    const suggestions: TitleSuggestion[] = []

    // Get category template
    const template = TITLE_TEMPLATES.find(t => t.category_id === input.category_id)

    if (!template) {
        // Generic suggestion
        return [{
            suggested_title: improveGenericTitle(input.current_title || ''),
            missing_attributes: [],
            buyer_focus_hint: {
                th: 'ใส่รายละเอียดที่สำคัญให้ชัดเจน',
                en: 'Include clear, important details'
            },
            title_score: 50,
            improvements: []
        }]
    }

    // Detect existing and missing attributes
    const detected = detectAttributes(input.current_title || '', template, input.detected_attributes, input.user_inputs)
    const missing = findMissingAttributes(detected, template)

    // Generate 3 variations
    const variations = [
        generateOptimalTitle(detected, template, 'complete'),
        generateOptimalTitle(detected, template, 'concise'),
        generateOptimalTitle(detected, template, 'detailed')
    ]

    for (const title of variations) {
        const score = analyzeTitle(title, input.category_id)
        const improvements = calculateImprovements(input.current_title || '', title)

        suggestions.push({
            suggested_title: title,
            missing_attributes: missing,
            buyer_focus_hint: generateBuyerHint(template, detected),
            title_score: score,
            improvements
        })
    }

    // Sort by score
    suggestions.sort((a, b) => b.title_score - a.title_score)

    return suggestions.slice(0, 3)
}

/**
 * Detect attributes from title
 */
function detectAttributes(
    title: string,
    template: CategoryTitleTemplate,
    detectedAttrs?: Record<string, string>,
    userInputs?: Record<string, any>
): Record<string, string> {
    const attributes: Record<string, string> = {}

    // Merge from different sources
    if (detectedAttrs) {
        Object.assign(attributes, detectedAttrs)
    }

    if (userInputs) {
        Object.assign(attributes, userInputs)
    }

    // Parse from existing title
    const titleLower = title.toLowerCase()

    // Common patterns
    const patterns: Record<string, RegExp> = {
        storage: /(\d+)(gb|tb)/i,
        ram: /(\d+)gb\s*ram/i,
        year: /(19|20)\d{2}/,
        mileage: /(\d+[,.]?\d*)\s*k?m/i,
        bedrooms: /(\d+)\s*(ห้องนอน|br|bedroom)/i,
        area: /(\d+)\s*(ตรม|sqm)/i,
        size: /size\s*(\d+)/i,
        condition: /(มือสอง|มือ1|ใหม่|new|used|like\s*new)/i
    }

    for (const [attr, pattern] of Object.entries(patterns)) {
        const match = titleLower.match(pattern)
        if (match && !attributes[attr]) {
            attributes[attr] = match[0]
        }
    }

    // Brand detection (common brands)
    const brands = ['iphone', 'samsung', 'huawei', 'oppo', 'vivo', 'xiaomi', 'honda', 'toyota', 'mazda', 'bmw', 'benz', 'nike', 'adidas', 'lv', 'gucci', 'chanel']
    for (const brand of brands) {
        if (titleLower.includes(brand) && !attributes.brand) {
            attributes.brand = brand
            break
        }
    }

    return attributes
}

/**
 * Find missing critical attributes
 */
function findMissingAttributes(
    detected: Record<string, string>,
    template: CategoryTitleTemplate
): MissingAttribute[] {
    const missing: MissingAttribute[] = []

    // Check critical attributes
    for (const attr of template.critical_attributes) {
        if (!detected[attr]) {
            missing.push({
                attribute: attr,
                importance: 'critical',
                ...getAttributeInfo(attr, template.category_id)
            })
        }
    }

    // Check important attributes
    for (const attr of template.important_attributes) {
        if (!detected[attr]) {
            missing.push({
                attribute: attr,
                importance: 'important',
                ...getAttributeInfo(attr, template.category_id)
            })
        }
    }

    return missing
}

/**
 * Get attribute information
 */
function getAttributeInfo(attr: string, categoryId: number): {
    example: { th: string; en: string }
    impact: { th: string; en: string }
} {
    const attributeDescriptions: Record<string, any> = {
        brand: {
            example: { th: 'เช่น iPhone, Samsung, Toyota', en: 'e.g. iPhone, Samsung, Toyota' },
            impact: { th: 'ช่วยให้ผู้ซื้อค้นหาเจอง่าย', en: 'Helps buyers find your listing' }
        },
        model: {
            example: { th: 'เช่น 13 Pro, Galaxy S23, Civic', en: 'e.g. 13 Pro, Galaxy S23, Civic' },
            impact: { th: 'บอกรุ่นที่แน่นอน', en: 'Specifies exact model' }
        },
        storage: {
            example: { th: 'เช่น 128GB, 256GB, 512GB', en: 'e.g. 128GB, 256GB, 512GB' },
            impact: { th: 'ข้อมูลสำคัญที่ผู้ซื้อต้องการรู้', en: 'Critical spec buyers need' }
        },
        color: {
            example: { th: 'เช่น สีดำ, สีขาว, สีเงิน', en: 'e.g. Black, White, Silver' },
            impact: { th: 'ช่วยให้ผู้ซื้อตัดสินใจเร็วขึ้น', en: 'Helps buyers decide faster' }
        },
        condition: {
            example: { th: 'เช่น มือ1, มือสอง, สภาพดี', en: 'e.g. New, Used, Like New' },
            impact: { th: 'สร้างความเชื่อมั่น', en: 'Builds trust' }
        },
        year: {
            example: { th: 'เช่น 2020, 2021, 2023', en: 'e.g. 2020, 2021, 2023' },
            impact: { th: 'บอกอายุของสินค้า', en: 'Shows item age' }
        },
        mileage: {
            example: { th: 'เช่น 50,000km, 80,000km', en: 'e.g. 50,000km, 80,000km' },
            impact: { th: 'ข้อมูลสำคัญสำหรับรถยนต์', en: 'Critical for vehicles' }
        },
        size: {
            example: { th: 'เช่น S, M, L, Size 42', en: 'e.g. S, M, L, Size 42' },
            impact: { th: 'ช่วยให้รู้ว่าใส่ได้หรือไม่', en: 'Helps determine fit' }
        }
    }

    return attributeDescriptions[attr] || {
        example: { th: 'ระบุ ' + attr, en: 'Specify ' + attr },
        impact: { th: 'ช่วยให้ขายได้เร็วขึ้น', en: 'Helps sell faster' }
    }
}

/**
 * Generate optimal title
 */
function generateOptimalTitle(
    detected: Record<string, string>,
    template: CategoryTitleTemplate,
    style: 'complete' | 'concise' | 'detailed'
): string {
    const parts: string[] = []

    // Always include critical attributes
    for (const attr of template.critical_attributes) {
        if (detected[attr]) {
            parts.push(detected[attr])
        }
    }

    // Include important attributes
    if (style === 'complete' || style === 'detailed') {
        for (const attr of template.important_attributes) {
            if (detected[attr]) {
                parts.push(detected[attr])
            }
        }
    }

    // Include optional for detailed
    if (style === 'detailed') {
        for (const attr of template.optional_attributes) {
            if (detected[attr]) {
                parts.push(detected[attr])
            }
        }
    }

    let title = parts.filter(Boolean).join(' ')

    // Ensure reasonable length
    if (title.length > 80 && style === 'concise') {
        title = title.substring(0, 77) + '...'
    }

    return title || 'สินค้าคุณภาพดี'
}

/**
 * Generate buyer focus hint
 */
function generateBuyerHint(
    template: CategoryTitleTemplate,
    detected: Record<string, string>
): { th: string; en: string } {
    const categoryId = template.category_id

    // Category-specific hints
    const hints: Record<number, { th: string; en: string }> = {
        3: {
            th: 'ผู้ซื้อมักค้นหา: ยี่ห้อ + รุ่น + ความจุ + สี',
            en: 'Buyers search: Brand + Model + Storage + Color'
        },
        4: {
            th: 'ผู้ซื้อมักค้นหา: ยี่ห้อ + รุ่น + CPU/RAM + สภาพ',
            en: 'Buyers search: Brand + Model + Specs + Condition'
        },
        1: {
            th: 'ผู้ซื้อมักค้นหา: ยี่ห้อ + รุ่น + ปี + เลขไมล์',
            en: 'Buyers search: Brand + Model + Year + Mileage'
        },
        6: {
            th: 'ผู้ซื้อมักค้นหา: แบรนด์ + ชนิดสินค้า + ไซส์ + สภาพ',
            en: 'Buyers search: Brand + Item + Size + Condition'
        }
    }

    return hints[categoryId] || {
        th: 'ใส่คำค้นที่ผู้ซื้อมักใช้',
        en: 'Include keywords buyers use'
    }
}

/**
 * Analyze title score
 */
function analyzeTitle(title: string, categoryId?: number): number {
    let score = 50

    if (!title) return 0

    const length = title.length

    // Length score
    if (length >= 20 && length <= 60) {
        score += 20
    } else if (length >= 15 && length <= 80) {
        score += 10
    }

    // Has numbers (specs)
    if (/\d+/.test(title)) {
        score += 10
    }

    // Has brand name
    const brands = ['iphone', 'samsung', 'toyota', 'honda', 'nike', 'adidas', 'lv', 'gucci']
    if (brands.some(b => title.toLowerCase().includes(b))) {
        score += 15
    }

    // Clear language (no excessive symbols)
    const symbolCount = (title.match(/[!@#$%^&*()]/g) || []).length
    if (symbolCount === 0) {
        score += 5
    } else if (symbolCount > 3) {
        score -= 10
    }

    return Math.min(Math.max(score, 0), 100)
}

/**
 * Detect title issues
 */
function detectTitleIssues(title: string, categoryId?: number): TitleIssue[] {
    const issues: TitleIssue[] = []

    if (!title || title.length < 10) {
        issues.push({
            type: 'too_short',
            severity: 'error',
            message: {
                th: 'ชื่อสินค้าสั้นเกินไป ควรยาว 15-60 ตัวอักษร',
                en: 'Title too short - should be 15-60 characters'
            }
        })
    }

    if (title.length > 100) {
        issues.push({
            type: 'too_long',
            severity: 'warning',
            message: {
                th: 'ชื่อสินค้ายาวเกินไป อาจถูกตัดในผลการค้นหา',
                en: 'Title too long - may be truncated in search'
            }
        })
    }

    // Check for spam patterns
    const spamPatterns = /(.)\1{4,}|!{3,}|ด่วน|โปรโมชั่น|ลดราคา{2,}/i
    if (spamPatterns.test(title)) {
        issues.push({
            type: 'spam',
            severity: 'warning',
            message: {
                th: 'หลีกเลี่ยงคำซ้ำๆ หรืออักขระพิเศษมากเกินไป',
                en: 'Avoid repetitive text or excessive special characters'
            }
        })
    }

    return issues
}

/**
 * Calculate improvements
 */
function calculateImprovements(currentTitle: string, suggestedTitle: string): string[] {
    const improvements: string[] = []

    if (suggestedTitle.length > currentTitle.length) {
        improvements.push('Added more details')
    }

    if (!currentTitle && suggestedTitle) {
        improvements.push('Created complete title')
    }

    // Check if specs added
    const currentHasSpecs = /\d+\s*(gb|tb|km|ตรม)/i.test(currentTitle)
    const suggestedHasSpecs = /\d+\s*(gb|tb|km|ตรม)/i.test(suggestedTitle)

    if (!currentHasSpecs && suggestedHasSpecs) {
        improvements.push('Added specifications')
    }

    return improvements
}

/**
 * Improve generic title
 */
function improveGenericTitle(title: string): string {
    if (!title || title.length < 5) {
        return 'สินค้าคุณภาพดี - กรุณาใส่รายละเอียด'
    }

    // Basic improvements
    let improved = title.trim()

    // Remove excessive punctuation
    improved = improved.replace(/[!@#$%^&*()]{2,}/g, '')

    // Capitalize first letter
    improved = improved.charAt(0).toUpperCase() + improved.slice(1)

    return improved
}

/**
 * Quick title validation
 */
export function validateTitle(title: string): {
    is_valid: boolean
    score: number
    quick_feedback: { th: string; en: string }
} {
    const score = analyzeTitle(title)

    if (score >= 80) {
        return {
            is_valid: true,
            score,
            quick_feedback: {
                th: '✅ ชื่อสินค้าดีมาก!',
                en: '✅ Excellent title!'
            }
        }
    } else if (score >= 60) {
        return {
            is_valid: true,
            score,
            quick_feedback: {
                th: '👍 ชื่อสินค้าดี อาจเพิ่มรายละเอียดเล็กน้อย',
                en: '👍 Good title - consider adding more details'
            }
        }
    } else if (score >= 40) {
        return {
            is_valid: true,
            score,
            quick_feedback: {
                th: '⚠️ ควรเพิ่มรายละเอียดเพื่อขายดีขึ้น',
                en: '⚠️ Should add more details for better sales'
            }
        }
    } else {
        return {
            is_valid: false,
            score,
            quick_feedback: {
                th: '❌ ชื่อสินค้าต้องใส่รายละเอียดเพิ่ม',
                en: '❌ Title needs more details'
            }
        }
    }
}
