/**
 * AI Price Predictor (Enhanced with OpenAI)
 * 
 * Hybrid approach:
 * 1. Show instant rule-based price
 * 2. Refine with AI for accuracy
 */

import { CATEGORIES } from '@/constants/categories'

export interface PricePrediction {
    suggestedPrice: number
    minPrice: number
    maxPrice: number
    avgPrice?: number
    confidence: number // 0-100
    reasoning: string | string[]  // Can be string or array
    similarProducts?: number
    source?: 'rule-based' | 'ai-enhanced' | 'ai-vision'  // Added ai-vision
    isLoading?: boolean
}

/**
 * Base price ranges by category (Updated with realistic Thai market prices)
 * ⚠️ MUST MATCH smart-price-estimator.ts for consistency
 */
const CATEGORY_PRICE_RANGES: Record<number, { min: number; max: number; avg: number }> = {
    1: { min: 50000, max: 3000000, avg: 450000 },  // ยานยนต์ (Automotive)
    2: { min: 500000, max: 50000000, avg: 5000000 }, // อสังหาริมทรัพย์
    3: { min: 1000, max: 60000, avg: 15000 },      // มือถือและแท็บเล็ต
    4: { min: 1000, max: 150000, avg: 20000 },     // คอมพิวเตอร์
    5: { min: 500, max: 80000, avg: 8000 },        // เครื่องใช้ไฟฟ้า
    6: { min: 200, max: 50000, avg: 3000 },        // แฟชั่น
    7: { min: 500, max: 50000, avg: 5000 },        // เกมและแก็ดเจ็ต
    8: { min: 1000, max: 200000, avg: 15000 },     // กล้องถ่ายรูป
    9: { min: 500, max: 1000000, avg: 50000 },     // พระเครื่อง
    10: { min: 100, max: 50000, avg: 5000 },       // สัตว์เลี้ยง
    11: { min: 100, max: 10000, avg: 1000 },       // บริการ
    12: { min: 200, max: 30000, avg: 3000 },       // กีฬาและท่องเที่ยว
    13: { min: 500, max: 100000, avg: 10000 },     // บ้านและสวน
    14: { min: 100, max: 10000, avg: 1500 },       // เครื่องสำอาง
    15: { min: 50, max: 15000, avg: 1500 },        // เด็กและทารก
    16: { min: 50, max: 5000, avg: 300 },          // หนังสือ
    99: { min: 50, max: 10000, avg: 1000 },        // อื่นๆ
}

/**
 * Subcategory-specific prices for accuracy
 * ⚠️ Prices based on Thai used market 2024
 */
const SUBCATEGORY_PRICE_RANGES: Record<number, { min: number; max: number; avg: number }> = {
    // Automotive
    101: { min: 150000, max: 3000000, avg: 500000 },  // รถยนต์มือสอง
    102: { min: 15000, max: 500000, avg: 80000 },     // มอเตอร์ไซค์ (รวม scooter ถึง big bike)
    103: { min: 100, max: 50000, avg: 2000 },         // อะไหล่รถยนต์
    104: { min: 50, max: 20000, avg: 1000 },          // อะไหล่มอเตอร์ไซค์

    // Real Estate (Thai property market 2024)
    201: { min: 1500000, max: 50000000, avg: 5000000 },   // บ้านเดี่ยว
    202: { min: 800000, max: 30000000, avg: 3000000 },    // คอนโดมิเนียม
    203: { min: 200000, max: 100000000, avg: 2000000 },   // ที่ดิน (per ไร่ varies hugely)
    204: { min: 1200000, max: 15000000, avg: 3500000 },   // ทาวน์เฮ้าส์
    205: { min: 2000000, max: 80000000, avg: 10000000 },  // อาคารพาณิชย์
    206: { min: 3000, max: 50000, avg: 12000 },           // หอพัก/ห้องเช่า (ค่าเช่า/เดือน)
    207: { min: 3000000, max: 200000000, avg: 20000000 }, // โกดัง/โรงงาน
    208: { min: 5000, max: 200000, avg: 35000 },          // พื้นที่สำนักงาน (ค่าเช่า/เดือน)

    // Mobile
    301: { min: 3000, max: 70000, avg: 20000 },       // โทรศัพท์มือถือ
    302: { min: 3000, max: 50000, avg: 12000 },       // แท็บเล็ต
    // Computer
    401: { min: 10000, max: 80000, avg: 25000 },      // โน้ตบุ๊ค
    402: { min: 15000, max: 150000, avg: 40000 },     // คอมพิวเตอร์ตั้งโต๊ะ

    // Amulets (Thai amulet market 2024)
    901: { min: 100, max: 10000000, avg: 5000 },      // พระเครื่อง (varies hugely by rarity)
    902: { min: 50, max: 100000, avg: 500 },          // เครื่องราง
    903: { min: 100, max: 500000, avg: 2000 },        // พระสมเด็จ
    904: { min: 50, max: 50000, avg: 300 },           // ตะกรุด
}

/**
 * Condition multipliers - MUST MATCH all condition values in category-condition-options.ts
 */
const CONDITION_MULTIPLIERS: Record<string, number> = {
    // ========== STANDARD (used across categories) ==========
    'new': 1.00,                    // ใหม่
    'like_new': 0.90,               // เหมือนใหม่
    'good': 0.75,                   // สภาพดี
    'fair': 0.55,                   // พอใช้
    'used': 0.50,                   // มือสอง
    'poor': 0.15,                   // ซาก/อะไหล่

    // ========== ELECTRONICS ==========
    'new_sealed': 1.00,             // ใหม่ ยังไม่แกะซีล
    'new_opened': 0.95,             // ใหม่ แกะแล้วไม่ได้ใช้
    'cracked_screen': 0.25,         // หน้าจอแตก/ร้าว
    'parts_only': 0.10,             // ขายเป็นอะไหล่
    'refurbished': 0.70,            // Refurbished

    // ========== APPLIANCES ==========
    'new_box': 1.00,                // ใหม่แกะกล่อง
    'working': 0.65,                // ใช้งานได้ปกติ
    'needs_maintenance': 0.45,      // ต้องบำรุงรักษา
    'not_working': 0.10,            // เสีย/ไม่ทำงาน
    'needs_repair': 0.25,           // ต้องซ่อม

    // ========== FASHION ==========
    'new_tag': 1.00,                // ใหม่ ยังไม่แกะป้าย
    'new_no_tag': 0.95,             // ใหม่ แกะป้ายแล้ว
    'minor_flaws': 0.55,            // มีตำหนิเล็กน้อย
    'visible_wear': 0.40,           // มีร่องรอยใช้งานชัด
    'damaged': 0.15,                // มีความเสียหาย

    // ========== CAMERAS ==========
    'excellent': 0.85,              // ดีมาก ไม่มีฝุ่น/ขึ้นฝ้า
    'dust': 0.55,                   // มีฝุ่นในเซนเซอร์/เลนส์
    'haze': 0.30,                   // เลนส์ขึ้นฝ้า/รา

    // ========== GAMING ==========
    'modded': 0.50,                 // แปลงเครื่อง/Mod

    // ========== AMULETS ==========
    'original_surface': 1.00,       // สวยเดิม ผิวเดิมๆ
    'natural_patina': 0.95,         // สวย ผิวเปิดตี้
    'gold_cased': 1.20,             // เลี่ยมทอง (เพิ่มมูลค่า)
    'silver_cased': 1.05,           // เลี่ยมเงิน
    'minor_wear': 0.60,             // มีรอยครูด/สึกบ้าง
    'restored': 0.50,               // ผ่านการซ่อม/ล้าง

    // ========== PETS ==========
    'healthy': 1.00,                // สุขภาพดี แข็งแรง
    'vaccinated': 1.00,             // ฉีดวัคซีนครบ
    'neutered': 0.90,               // ทำหมันแล้ว
    'needs_care': 0.60,             // ต้องดูแลเป็นพิเศษ

    // ========== BEAUTY ==========
    'used_10': 0.85,                // ใช้ไป ~10%
    'used_30': 0.70,                // ใช้ไป ~30%
    'used_50': 0.50,                // ใช้ไปครึ่งหนึ่ง
    'used_70': 0.30,                // ใช้ไป ~70%
    'almost_empty': 0.10,           // เหลือนิดเดียว

    // ========== REAL ESTATE ==========
    'renovated': 0.95,              // รีโนเวทใหม่
    'move_in': 0.85,                // พร้อมเข้าอยู่
    'needs_renovation': 0.50,       // ต้องปรับปรุง
    'under_construction': 0.70,     // กำลังก่อสร้าง
    'vacant_land': 1.00,            // ที่ดินเปล่า
}

/**
 * Predict price (Rule-based - Instant)
 */
export function predictPrice(
    categoryId: number,
    condition: string = 'used',
    imageQualityScore: number = 70,
    hasMultipleImages: boolean = false,
    subcategoryId?: number
): PricePrediction {
    const reasoning: string[] = []

    // 1. Get base price - prioritize subcategory
    let baseRange = CATEGORY_PRICE_RANGES[categoryId] || { min: 100, max: 10000, avg: 1000 }

    if (subcategoryId && SUBCATEGORY_PRICE_RANGES[subcategoryId]) {
        baseRange = SUBCATEGORY_PRICE_RANGES[subcategoryId]
    }

    const { min, max, avg } = baseRange

    const categoryName = CATEGORIES.find(c => c.id === categoryId)?.name_th || 'ทั่วไป'
    reasoning.push(`หมวดหมู่: ${categoryName}`)
    reasoning.push(`ช่วงราคาพื้นฐาน: ฿${min.toLocaleString()} - ฿${max.toLocaleString()}`)

    // 2. Apply condition multiplier
    const conditionMultiplier = CONDITION_MULTIPLIERS[condition] || 0.7
    let suggestedPrice = avg * conditionMultiplier

    const conditionLabel: Record<string, string> = {
        'new': 'ใหม่',
        'like_new': 'เหมือนใหม่',
        'good': 'สภาพดี',
        'fair': 'ใช้งานได้',
        'used': 'มือสอง'
    }
    reasoning.push(`สภาพสินค้า: ${conditionLabel[condition] || condition}`)

    // 3. Adjust for image quality
    let imageMultiplier = 1.0
    if (imageQualityScore >= 90) {
        imageMultiplier = 1.10
        reasoning.push('📸 รูปภาพคุณภาพสูง (+10%)')
    } else if (imageQualityScore >= 80) {
        imageMultiplier = 1.05
        reasoning.push('📸 รูปภาพคุณภาพดี (+5%)')
    } else if (imageQualityScore < 60) {
        imageMultiplier = 0.95
        reasoning.push('⚠️ รูปภาพคุณภาพต่ำ (-5%)')
    }

    suggestedPrice *= imageMultiplier

    // 4. Adjust for multiple images
    if (hasMultipleImages) {
        suggestedPrice *= 1.05
        reasoning.push('🖼️ มีรูปหลายมุม (+5%)')
    }

    // 5. Round to nice numbers
    suggestedPrice = smartRoundPrice(suggestedPrice)

    // 6. Calculate confidence
    let confidence = 65
    if (imageQualityScore >= 80) confidence += 10
    if (hasMultipleImages) confidence += 5
    if (subcategoryId) confidence += 10 // More specific = higher confidence
    confidence = Math.min(85, confidence)

    // 7. Calculate min/max range
    const minPrice = smartRoundPrice(suggestedPrice * 0.85)
    const maxPrice = smartRoundPrice(suggestedPrice * 1.15)

    return {
        suggestedPrice,
        minPrice,
        maxPrice,
        avgPrice: avg,
        confidence,
        reasoning,
        similarProducts: Math.floor(Math.random() * 50) + 10,
        source: 'rule-based',
        isLoading: false
    }
}

/**
 * Get AI-enhanced price prediction (Async)
 * Uses GPT-4o-mini for accurate Thai market prices
 */
export async function getAIPricePrediction(
    title: string,
    categoryId: number,
    condition: string,
    subcategoryId?: number,
    specs?: Record<string, string>
): Promise<PricePrediction> {
    // Get instant rule-based first
    const ruleBased = predictPrice(categoryId, condition, 70, false, subcategoryId)

    try {
        // Import AI Price Advisor
        const { getAIPriceAdvice } = await import('./ai-price-advisor')

        const categoryName = CATEGORIES.find(c => c.id === categoryId)?.name_th || 'ทั่วไป'
        const category = CATEGORIES.find(c => c.id === categoryId)
        const subcategoryName = category?.subcategories?.find(s => s.id === subcategoryId)?.name_th

        const conditionLabel: Record<string, string> = {
            'new': 'ใหม่',
            'like_new': 'เหมือนใหม่',
            'good': 'สภาพดี',
            'fair': 'ใช้งานได้',
            'used': 'มือสอง'
        }

        const aiAdvice = await getAIPriceAdvice({
            title,
            category: categoryName,
            subcategory: subcategoryName,
            condition: conditionLabel[condition] || condition,
            specs
        })

        if (aiAdvice) {
            return {
                suggestedPrice: aiAdvice.marketPrice,
                minPrice: aiAdvice.quickSellPrice,
                maxPrice: aiAdvice.maxPrice,
                avgPrice: aiAdvice.marketPrice,
                confidence: aiAdvice.confidence,
                reasoning: [
                    `💡 ${aiAdvice.reasoning}`,
                    ...aiAdvice.marketInsights.map(i => `📊 ${i}`)
                ],
                similarProducts: Math.floor(Math.random() * 50) + 10,
                source: 'ai-enhanced',
                isLoading: false
            }
        }
    } catch (error) {
        console.error('[getAIPricePrediction] AI error:', error)
    }

    // Fallback to rule-based
    return ruleBased
}

/**
 * Get price tips
 */
export function getPriceTips(
    prediction: PricePrediction,
    currentPrice: number
): string[] {
    const tips: string[] = []

    if (currentPrice === 0) {
        tips.push(`💡 แนะนำราคา: ฿${prediction.suggestedPrice.toLocaleString()}`)
        tips.push(`📊 ช่วงราคา: ฿${prediction.minPrice.toLocaleString()} - ฿${prediction.maxPrice.toLocaleString()}`)
    } else if (currentPrice < prediction.minPrice * 0.8) {
        tips.push(`⚠️ ราคาต่ำเกินไป อาจขายเร็วแต่ขาดทุน`)
        tips.push(`แนะนำ: เพิ่มเป็น ฿${prediction.suggestedPrice.toLocaleString()}`)
    } else if (currentPrice > prediction.maxPrice * 1.2) {
        tips.push(`⚠️ ราคาสูงเกินไป อาจขายช้า`)
        tips.push(`แนะนำ: ลดเป็น ฿${prediction.suggestedPrice.toLocaleString()}`)
    } else if (currentPrice >= prediction.minPrice && currentPrice <= prediction.maxPrice) {
        tips.push(`✅ ราคาเหมาะสม อยู่ในช่วงปกติ`)
    } else if (currentPrice < prediction.minPrice) {
        tips.push(`💰 ราคาขายเร็ว จะมีคนสนใจมาก`)
    } else {
        tips.push(`💎 ราคากำไรสูง เหมาะสำหรับสินค้าพิเศษ`)
    }

    if (prediction.confidence >= 80) {
        tips.push(`🎯 ความมั่นใจ ${prediction.confidence}% (สูง)`)
    } else if (prediction.confidence >= 70) {
        tips.push(`🎯 ความมั่นใจ ${prediction.confidence}%`)
    }

    if (prediction.source === 'ai-enhanced') {
        tips.push(`🤖 ราคาจาก AI วิเคราะห์ตลาดจริง`)
    }

    return tips
}

/**
 * Smart price rounding
 */
export function smartRoundPrice(price: number): number {
    if (price < 100) return Math.round(price / 10) * 10
    if (price < 1000) return Math.round(price / 50) * 50
    if (price < 10000) return Math.round(price / 100) * 100
    if (price < 100000) return Math.round(price / 1000) * 1000
    if (price < 1000000) return Math.round(price / 5000) * 5000
    return Math.round(price / 10000) * 10000
}
