/**
 * AI Price Predictor
 * 
 * แนะนำราคาที่เหมาะสมตามหมวดหมู่และภาพ
 */

import { CATEGORIES } from '@/constants/categories'

export interface PricePrediction {
    suggestedPrice: number
    minPrice: number
    maxPrice: number
    avgPrice: number
    confidence: number // 0-100
    reasoning: string[]
    similarProducts?: number
}

/**
 * Base price ranges by category
 */
const CATEGORY_PRICE_RANGES: Record<number, { min: number; max: number; avg: number }> = {
    1: { min: 50, max: 5000, avg: 500 },      // Electronics
    2: { min: 100, max: 100000, avg: 15000 }, // Vehicles
    3: { min: 50, max: 10000, avg: 800 },     // Fashion
    4: { min: 100, max: 50000, avg: 5000 },   // Home
    5: { min: 20, max: 2000, avg: 300 },      // Books
    6: { min: 50, max: 5000, avg: 600 },      // Sports
    7: { min: 10, max: 1000, avg: 150 },      // Toys
    8: { min: 30, max: 3000, avg: 400 },      // Beauty
    9: { min: 200, max: 500000, avg: 50000 }, // Collectibles
    10: { min: 50, max: 10000, avg: 1000 },   // Pets
    11: { min: 100, max: 200000, avg: 10000 } // Automotive
}

/**
 * Condition multipliers
 */
const CONDITION_MULTIPLIERS: Record<string, number> = {
    'new': 1.0,
    'like_new': 0.85,
    'good': 0.70,
    'fair': 0.55,
    'used': 0.50
}

/**
 * Predict price
 */
export function predictPrice(
    categoryId: number,
    condition: string = 'used',
    imageQualityScore: number = 70,
    hasMultipleImages: boolean = false
): PricePrediction {
    const reasoning: string[] = []

    // 1. Get base price range from category
    const baseRange = CATEGORY_PRICE_RANGES[categoryId] || { min: 100, max: 10000, avg: 1000 }
    const { min, max, avg } = baseRange

    reasoning.push(`หมวดหมู่: ${CATEGORIES.find(c => c.id === categoryId)?.name_th || 'ทั่วไป'}`)
    reasoning.push(`ช่วงราคาพื้นฐาน: ฿${min.toLocaleString()} - ฿${max.toLocaleString()}`)

    // 2. Apply condition multiplier
    const conditionMultiplier = CONDITION_MULTIPLIERS[condition] || 0.7
    let suggestedPrice = avg * conditionMultiplier

    reasoning.push(`สภาพสินค้า: ${condition} (x${conditionMultiplier})`)

    // 3. Adjust for image quality
    let imageMultiplier = 1.0
    if (imageQualityScore >= 90) {
        imageMultiplier = 1.15
        reasoning.push('รูปภาพคุณภาพสูง (+15%)')
    } else if (imageQualityScore >= 80) {
        imageMultiplier = 1.10
        reasoning.push('รูปภาพคุณภาพดี (+10%)')
    } else if (imageQualityScore >= 70) {
        imageMultiplier = 1.05
        reasoning.push('รูปภาพคุณภาพปานกลาง (+5%)')
    } else if (imageQualityScore < 60) {
        imageMultiplier = 0.95
        reasoning.push('รูปภาพคุณภาพต่ำ (-5%)')
    }

    suggestedPrice *= imageMultiplier

    // 4. Adjust for multiple images
    if (hasMultipleImages) {
        suggestedPrice *= 1.08
        reasoning.push('มีรูปหลายมุม (+8%)')
    }

    // 5. Round to nice numbers
    suggestedPrice = Math.round(suggestedPrice / 50) * 50

    // 6. Calculate confidence
    let confidence = 70
    if (imageQualityScore >= 80) confidence += 15
    if (hasMultipleImages) confidence += 10
    confidence = Math.min(95, confidence)

    // 7. Calculate min/max range (±20%)
    const minPrice = Math.round(suggestedPrice * 0.8 / 50) * 50
    const maxPrice = Math.round(suggestedPrice * 1.2 / 50) * 50

    return {
        suggestedPrice,
        minPrice,
        maxPrice,
        avgPrice: avg,
        confidence,
        reasoning,
        similarProducts: Math.floor(Math.random() * 50) + 10 // Mock
    }
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
    } else if (currentPrice < prediction.minPrice) {
        tips.push(`⚠️ ราคาต่ำเกินไป อาจขายเร็วแต่ขาดทุน`)
        tips.push(`แนะนำ: เพิ่มเป็น ฿${prediction.suggestedPrice.toLocaleString()}`)
    } else if (currentPrice > prediction.maxPrice) {
        tips.push(`⚠️ ราคาสูงเกินไป อาจขายช้า`)
        tips.push(`แนะนำ: ลดเป็น ฿${prediction.suggestedPrice.toLocaleString()}`)
    } else {
        tips.push(`✅ ราคาเหมาะสม อยู่ในช่วงปกติ`)
    }

    if (prediction.confidence >= 80) {
        tips.push(`🎯 ความมั่นใจ ${prediction.confidence}% (สูง)`)
    }

    if (prediction.similarProducts) {
        tips.push(`📈 สินค้าคล้ายกัน: ${prediction.similarProducts} รายการ`)
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
    return Math.round(price / 1000) * 1000
}
