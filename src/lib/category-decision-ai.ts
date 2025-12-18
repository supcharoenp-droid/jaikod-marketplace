/**
 * Category Decision AI Service
 * 
 * Human-in-the-loop category selection:
 * - Calculates confidence scores for each category based on Keywords & Exact Matches
 * - Auto-selects if confidence >= 80%
 * - Presents top options if < 80%
 * - Applies sanity rules to prevent illogical selections (e.g. Doll -> Electronics)
 */

import { CATEGORIES, type Category } from '@/constants/categories'
import { EXPERT_CATEGORY_KEYWORDS } from './expert-category-keywords'

// Define interfaces locally if not exported elsewhere
export interface CategoryRecommendation {
    categoryId: string
    categoryName: string
    subcategory?: string
    confidence: number
    reasoning: string
}

export interface CategoryDecisionResult {
    recommended_categories: CategoryRecommendation[]
    confidence_scores: Record<string, number>
    require_user_confirmation: boolean
    auto_selected?: CategoryRecommendation
}

// Use expert keywords
const CATEGORY_KEYWORDS = EXPERT_CATEGORY_KEYWORDS

// Sanity rules to prevent illogical category assignments
const SANITY_RULES = {
    forbidden_combinations: [
        {
            keywords: [
                // Air Pumps - General (🔥 ENHANCED with more variations!)
                // Multiple spelling variations for "ปั๊ม" (unicode differences)
                'ปั๊มลม', 'ปั้มลม', 'ปัมลม', 'ปั๊ม', 'ปั้ม', 'ปัม',
                'air pump', 'airpump', 'เติมลม', 'สูบลม',
                'ที่เติมลม', 'ที่สูบลม', 'เครื่องสูบลม',
                'ปั๊มลมไฟฟ้า', 'ปั้มลมไฟฟ้า', 'electric pump', 'portable air pump',
                // 🔥 CRITICAL: Portable variations
                'ปั๊มลมพกพา', 'ปั้มลมพกพา', 'ปั๊มพกพา', 'ปั้มพกพา',
                'portable pump', 'mini pump', 'เครื่องเติมลม', 'ปั๊มเติมลม',
                // 🔥 NEW: Match "พกพา" alone when combined with air/pump context
                'พกพา air', 'air พกพา',
                // Automotive Pumps
                'ปั๊มลมยาง', 'ปั้มลมยาง', 'ปั๊มลมยางรถยนต์', 'tire inflator', 'tire pump',
                'เครื่องเติมลมยาง', 'ที่เติมลมยาง', 'car air pump',
                // Sports Pumps
                'ปั๊มลูกฟุตบอล', 'ปั๊มลูกกีฬา', 'ball pump', 'ball inflator',
                // Industrial Pumps
                'air compressor', 'compressor', 'คอมเพรสเซอร์',
                'ปั๊มลมโรงงาน', 'ปั๊มลมอุตสาหกรรม',
                // 🔥 NEW: Brand patterns
                'xiaomi air', 'baseus air', 'mijia pump', '70mai pump'
            ], forbidden_categories: [3, 4, 7, 8]
        }, // Not Mobile/Computer/Gaming/Camera
        { keywords: ['iphone', 'samsung', 'มือถือ', 'smartphone'], forbidden_categories: [1, 2, 4] },
        { keywords: ['รถยนต์', 'รถกระบะ', 'มอไซค์'], forbidden_categories: [3, 4, 5] },
        { keywords: ['คอนโด', 'บ้าน', 'ที่ดิน', 'ทาวน์เฮ้าส์'], forbidden_categories: [1, 3, 4, 5, 15] },

        // NEW RULES FOR KIDS/TOYS vs TECH
        { keywords: ['ตุ๊กตา', 'doll', 'plush', 'toy', 'ของเล่น', 'barbie', 'lego'], forbidden_categories: [1, 2, 3, 4, 5, 8, 11] }, // Tech/Car/House blocked

        // NEW RULES FOR AMULETS vs TECH
        { keywords: ['พระเครื่อง', 'พระพุทธรูป', 'amulet', 'เหรียญ'], forbidden_categories: [3, 4, 5, 6, 7, 8] },

        // NEW RULES FOR APPLIANCES vs COMPUTER
        { keywords: ['เครื่องฟอกอากาศ', 'air purifier', 'แอร์', 'microwave', 'ตู้เย็น', 'พัดลม'], forbidden_categories: [3, 4, 6, 7, 8] },

        // 🔥 CRITICAL: PRINTERS vs CAMERA (เพิ่มใหม่!)
        // ป้องกันการจับเครื่องพิมพ์ Canon, Epson ไปหมวดกล้องโดยไม่ตั้งใจ
        { keywords: ['ปริ้นเตอร์', 'ปริ้นท์', 'printer', 'เครื่องพิมพ์', 'เครื่องปริ้น', 'เครื่องพิมพ์บัตร', 'card printer', 'หมึกพิมพ์', 'toner', 'inkjet', 'laser printer'], forbidden_categories: [8] }, // ห้ามไปหมวด Camera (8)
    ],

    minimum_confidence: {
        default: 0.5,
        high_risk: 0.7,
    }
}

/**
 * Calculate category confidence based on multiple signals
 * Uses EXACT MATCH boosting to overcome generic keyword pollution.
 */
function calculateCategoryConfidence(
    category: Category,
    signals: {
        title: string
        description: string
        detectedObjects: string[]
        imageAnalysis?: string
    }
): number {
    let score = 0
    const maxScore = 100

    const normalizeText = (text: string) => text.toLowerCase().trim().replace(/\s+/g, ' ')

    const titleNorm = normalizeText(signals.title)
    const descNorm = normalizeText(signals.description)
    const imageNorm = normalizeText(signals.imageAnalysis || '')

    const keywords = CATEGORY_KEYWORDS[category.id] || []

    const categoryNames = [
        normalizeText(category.name_th),
        normalizeText(category.name_en),
        normalizeText(category.slug)
    ]

    let imageScore = 0
    let titleScore = 0
    let descScore = 0
    let objectScore = 0

    // 🔥 CRITICAL: Detect Printer Keywords First (ENHANCED!)
    const printerKeywords = [
        // Thai
        'ปริ้นเตอร์', 'ปริ้นท์', 'เครื่องพิมพ์', 'เครื่องปริ้น', 'พิมพ์',
        'เครื่องพิมพ์บัตร', 'หมึกพิมพ์', 'ปริ้น', 'มัลติฟังก์ชัน',
        'สแกน', 'ถ่ายเอกสาร', 'เอกสาร', 'สำนักงาน',
        // English
        'printer', 'print', 'printing', 'multifunction', 'all-in-one',
        'card printer', 'toner', 'inkjet', 'laser printer',
        'epson printer', 'canon printer', 'hp printer', 'brother printer',
        'เครื่องพิมพ์การ์ด', 'office', 'copy', 'scan', 'pixma', 'maxify'
    ]

    const hasPrinterKeyword = printerKeywords.some(kw =>
        titleNorm.includes(kw.toLowerCase()) || descNorm.includes(kw.toLowerCase()))

    // Apply category-specific logic
    if (hasPrinterKeyword) {
        if (category.id === 4) {
            // BOOST Computer category massively for printers (🔥 INCREASED!)
            score += 150
        } else if (category.id === 8) {
            // PENALIZE Camera category heavily (🔥 INCREASED from -80 to -300!)
            score -= 300
        }
    }

    // 🔥 CRITICAL: Detect Air Pump Keywords (ENHANCED!)
    const airPumpKeywords = [
        // Thai - General (ENHANCED!)
        'ปั๊มลม', 'ปั้มลม', 'ปั๊ม', 'air pump', 'pump',
        'ที่เติมลม', 'เติมลม', 'ที่สูบลม', 'เครื่องสูบลม', 'สูบลม',
        'ปั๊มลมไฟฟ้า', 'electric pump', 'electric air pump',
        'ปั๊มลมพกพา', 'portable air pump', 'portable compressor',
        'ปั๊มพกพา', 'portable pump', // 🔥 ADDED

        // Variations with model names
        'air pump รุ่นใหม่', 'air pump รุ่น', 'ปั๊มลม รุ่น', // 🔥 ADDED

        // Thai - Automotive (ENHANCED!)
        'ปั๊มลมยาง', 'ปั๊มลมยางรถยนต์', 'ปั๊มลมรถยนต์',
        'เครื่องเติมลมยาง', 'ที่เติมลมยาง', 'ที่สูบลมยาง',
        'tire inflator', 'tire pump', 'car air pump',
        'ปั๊มเติมลม', 'เครื่องเติมลม', // 🔥 ADDED

        // Thai - Sports
        'ปั๊มลูกฟุตบอล', 'ปั๊มลูกกีฬา', 'ปั๊มลูกบาส',
        'ball pump', 'ball inflator', 'sports pump',
        'เข็มสูบลม', 'ball needle',

        // Thai - Industrial/Tools
        'ปั๊มลมโรงงาน', 'ปั๊มลมอุตสาหกรรม', 'คอมเพรสเซอร์',
        'air compressor', 'compressor', 'ปั๊มลมระบบลม',

        // Brands (ENHANCED!)
        'xiaomi air pump', 'xiaomi pump', 'baseus air pump',
        'mijia air pump', 'baseus', 'xiaomi', 'mijia', // 🔥 ADDED brands standalone
        'windek', 'berkut', 'ring', // 🔥 ADDED more brands
    ]

    const hasAirPumpKeyword = airPumpKeywords.some(kw =>
        titleNorm.includes(kw.toLowerCase()) || descNorm.includes(kw.toLowerCase()))

    // Apply air pump logic (SUPER AGGRESSIVE to fix misclassification)
    if (hasAirPumpKeyword) {
        // Check context to determine which category to boost
        const hasCarContext = /รถ|car|ยาง|tire|automotive|กระบะ|vehicle/.test(titleNorm + descNorm)
        const hasSportsContext = /ฟุตบอล|football|กีฬา|sport|ball|บาส|basket/.test(titleNorm + descNorm)
        const hasToolContext = /โรงงาน|อุตสาหกรรม|industrial|compressor|คอมเพรสเซอร์|ช่าง|tool/.test(titleNorm + descNorm)

        if (hasCarContext || (!hasSportsContext && !hasToolContext)) {
            // Default to Automotive if car-related OR no specific context
            if (category.id === 1) {
                // MASSIVE BOOST for Automotive category (ID: 1)
                score += 150
            }
        }

        if (hasSportsContext) {
            if (category.id === 12) {
                // LARGE BOOST for Sports category (ID: 12)
                score += 140
            }
        }

        if (hasToolContext) {
            if (category.id === 13) {
                // LARGE BOOST for Home & Garden Tools category (ID: 13)
                score += 130
            }
        }

        // 🔥 CRITICAL FIX: Default to Automotive if no specific context
        // "ปั๊มลมพกพา" without car/sport/tool context should go to Automotive
        if (!hasCarContext && !hasSportsContext && !hasToolContext) {
            if (category.id === 1) {
                // MASSIVE BOOST for Automotive as default for portable air pumps
                score += 200
            }
        }

        // MASSIVE PENALTY for wrong categories (INCREASED!)
        if (category.id === 4 || category.id === 7 || category.id === 8 || category.id === 3) {
            // Computer (4), Gaming (7), Camera (8), Mobile (3)
            // 🔥 INCREASED from -200 to -500 to ensure prevention
            score -= 500
        }
    }

    // 1. IMAGE ANALYSIS (40 points max)
    if (signals.imageAnalysis) {
        // Keyword match
        keywords.forEach(kw => {
            const kwNorm = normalizeText(kw)
            if (imageNorm.includes(kwNorm)) {
                // Exact word match gets huge bonus
                const isExactWord = new RegExp(`\\b${kwNorm}\\b`).test(imageNorm)
                imageScore += isExactWord ? 25 : 10
            }
        })

        // Category name match
        categoryNames.forEach(catName => {
            if (imageNorm.includes(catName)) {
                imageScore += 25
            }
        })

        imageScore = Math.min(40, imageScore)
        score += imageScore
    }

    // 2. TITLE SIGNALS (35 points max)
    if (signals.title) {
        keywords.forEach(kw => {
            const kwNorm = normalizeText(kw)
            if (titleNorm.includes(kwNorm)) {
                const isExactWord = new RegExp(`\\b${kwNorm}\\b`).test(titleNorm)
                titleScore += isExactWord ? 20 : 8
            }
        })

        categoryNames.forEach(catName => {
            if (titleNorm.includes(catName)) {
                titleScore += 20
            }
        })

        titleScore = Math.min(35, titleScore)
        score += titleScore
    }

    // 3. DETECTED OBJECTS (15 points max)
    if (signals.detectedObjects && signals.detectedObjects.length > 0) {
        signals.detectedObjects.forEach(obj => {
            const objNorm = normalizeText(obj)
            keywords.forEach(kw => {
                const kwNorm = normalizeText(kw)
                if (objNorm.includes(kwNorm) || kwNorm.includes(objNorm)) {
                    objectScore += 8
                }
            })
        })
        objectScore = Math.min(15, objectScore)
        score += objectScore
    }

    // 4. DESCRIPTION (10 points max)
    if (signals.description) {
        keywords.forEach(kw => {
            const kwNorm = normalizeText(kw)
            if (descNorm.includes(kwNorm)) {
                descScore += 5
            }
        })
        descScore = Math.min(10, descScore)
        score += descScore
    }

    return Math.min(score / maxScore, 1.0)
}

/**
 * Check if category assignment violates sanity rules
 */
function violatesSanityRules(
    categoryId: number,
    title: string,
    description: string
): boolean {
    const allText = `${title} ${description}`.toLowerCase()

    for (const rule of SANITY_RULES.forbidden_combinations) {
        const hasKeyword = rule.keywords.some(kw => allText.includes(kw.toLowerCase()))
        const isForbiddenCategory = rule.forbidden_categories.includes(categoryId)

        if (hasKeyword && isForbiddenCategory) {
            // console.warn(`Sanity rule violated: Category ${categoryId} blocked by keyword in "${rule.keywords}"`)
            return true
        }
    }
    return false
}

/**
 * Main category decision function
 */
export function decideCategoryWithAI(params: {
    title: string
    description: string
    detectedObjects: string[]
    imageAnalysis?: string
}): CategoryDecisionResult {
    const { title, description, detectedObjects, imageAnalysis } = params

    const categoryScores = CATEGORIES.map(category => {
        const confidence = calculateCategoryConfidence(category, {
            title,
            description,
            detectedObjects,
            imageAnalysis
        })

        // Apply sanity rules - set confidence to 0 if violated
        const violates = violatesSanityRules(category.id, title, description)

        return {
            categoryId: String(category.id),
            categoryName: category.name_th,
            confidence: violates ? 0 : confidence,
            reasoning: violates
                ? 'ไม่สอดคล้องกับข้อมูลสินค้า'
                : confidence > 0.7 ? 'ตรงกับคำค้นหลายคำ' : 'มีคำค้นที่เกี่ยวข้องบางส่วน'
        }
    })

    // Sort by confidence
    categoryScores.sort((a, b) => b.confidence - a.confidence)

    // Get top 3 recommendations
    const topRecommendations: CategoryRecommendation[] = categoryScores
        .slice(0, 3)
        .filter(cat => cat.confidence > SANITY_RULES.minimum_confidence.default)
        .map(cat => ({
            categoryId: cat.categoryId,
            categoryName: cat.categoryName,
            confidence: cat.confidence,
            reasoning: cat.reasoning
        }))

    // Confidence scores map
    const confidenceScores: Record<string, number> = {}
    categoryScores.forEach(cat => {
        confidenceScores[cat.categoryId] = cat.confidence
    })

    // Decision logic
    const topConfidence = topRecommendations[0]?.confidence || 0
    const requireConfirmation = topConfidence < 0.8

    return {
        recommended_categories: topRecommendations,
        confidence_scores: confidenceScores,
        require_user_confirmation: requireConfirmation,
        auto_selected: requireConfirmation ? undefined : topRecommendations[0]
    }
}

/**
 * Get category explanation for user
 */
export function getCategoryExplanation(confidence: number): string {
    if (confidence >= 0.9) return 'AI มั่นใจสูงมาก'
    if (confidence >= 0.8) return 'AI มั่นใจสูง'
    if (confidence >= 0.7) return 'AI มั่นใจปานกลาง'
    if (confidence >= 0.5) return 'AI พบความเกี่ยวข้อง'
    return 'ความเกี่ยวข้องต่ำ'
}
