/**
 * UNIFIED PRICE AI SERVICE
 * 
 * ศูนย์กลางการประเมินราคา AI สำหรับ JaiKod Marketplace
 * รวมความสามารถทั้งหมดจาก:
 * - ai-price-advisor.ts (GPT-4o-mini API)
 * - ai-price-estimator.ts (Rule-based + Market Data)
 * - ai-price-predictor.ts (Hybrid approach)
 * 
 * Architecture:
 * 1. Instant: Rule-based prediction (< 100ms)
 * 2. Enhanced: AI refinement (1-3s)
 * 3. Vision: Image-based analysis (2-5s)
 * 
 * @version 1.0.0
 * @date 2024-12-29
 */

// ==========================================
// TYPES
// ==========================================

export interface PriceResult {
    // Core prices
    suggested: number      // แนะนำให้ตั้งราคานี้
    quickSell: number      // ขายเร็วใช้ราคานี้
    max: number            // ราคาสูงสุดที่ควรตั้ง

    // Range
    range: {
        min: number
        max: number
    }

    // Confidence (0-100)
    confidence: number

    // Source & reasoning
    source: 'instant' | 'ai-enhanced' | 'ai-vision'
    reasoning: string[]

    // Market insights
    marketFactors?: PriceFactor[]

    // Loading state
    isLoading?: boolean
}

export interface PriceFactor {
    factor: string
    impact: 'positive' | 'negative' | 'neutral'
    detail: string
}

export interface PriceInput {
    // Required
    title: string
    categoryId: number
    condition: string

    // Optional enhancements
    subcategoryId?: number
    brand?: string
    model?: string
    year?: number
    specs?: Record<string, any>
    imageBase64?: string
    formData?: Record<string, any>
}

// ==========================================
// CATEGORY PRICE DATABASE
// ==========================================

/**
 * Base price ranges by main category (Thai Market 2024)
 */
const CATEGORY_PRICES: Record<number, { min: number; max: number; avg: number }> = {
    1: { min: 50000, max: 3000000, avg: 450000 },    // ยานยนต์
    2: { min: 500000, max: 50000000, avg: 5000000 }, // อสังหาริมทรัพย์
    3: { min: 500, max: 70000, avg: 15000 },         // มือถือ
    4: { min: 1000, max: 150000, avg: 20000 },       // คอมพิวเตอร์
    5: { min: 500, max: 50000, avg: 5000 },          // เครื่องใช้ไฟฟ้า
    6: { min: 1000, max: 100000, avg: 15000 },       // กล้องและอุปกรณ์
    7: { min: 100, max: 30000, avg: 1500 },          // แฟชั่น
    8: { min: 100, max: 20000, avg: 2000 },          // กีฬา
    9: { min: 50, max: 1000000, avg: 5000 },         // พระเครื่อง
    10: { min: 500, max: 50000, avg: 5000 },         // เกม
    11: { min: 500, max: 100000, avg: 10000 },       // สัตว์เลี้ยง
    12: { min: 100, max: 50000, avg: 2000 },         // บริการ
    13: { min: 100, max: 100000, avg: 3000 },        // บ้านและสวน
    14: { min: 100, max: 10000, avg: 1500 },         // เครื่องสำอาง
    15: { min: 50, max: 15000, avg: 1500 },          // เด็กและทารก
    16: { min: 50, max: 5000, avg: 300 },            // หนังสือ
    99: { min: 50, max: 10000, avg: 1000 }           // อื่นๆ
}

/**
 * Condition multipliers
 */
const CONDITION_MULTIPLIERS: Record<string, number> = {
    // Standard
    'new': 1.00,
    'like_new': 0.90,
    'excellent': 0.85,
    'very_good': 0.80,
    'good': 0.70,
    'used': 0.60,
    'fair': 0.50,
    'poor': 0.35,
    'for_parts': 0.15,
    'parts_only': 0.10,
    'needs_repair': 0.25,

    // Fashion specific
    'new_tag': 1.00,
    'new_no_tag': 0.95,
    'worn_once': 0.85,
    'minor_flaws': 0.55,

    // Vehicles
    'mint': 0.95,
    'original': 0.85,
    'modified': 0.65,
    'restored': 0.50,

    // Pets
    'healthy': 1.00,
    'vaccinated': 1.00,
    'neutered': 0.90,
    'needs_care': 0.60,

    // Real Estate
    'brand_new': 1.00,
    'renovated': 0.95,
    'move_in_ready': 0.90,
    'needs_renovation': 0.50
}

// ==========================================
// MAIN UNIFIED SERVICE
// ==========================================

class UnifiedPriceService {
    private static instance: UnifiedPriceService

    private constructor() { }

    static getInstance(): UnifiedPriceService {
        if (!UnifiedPriceService.instance) {
            UnifiedPriceService.instance = new UnifiedPriceService()
        }
        return UnifiedPriceService.instance
    }

    // ========================================
    // LEVEL 1: INSTANT (Rule-based, <100ms)
    // ========================================

    /**
     * Get instant price prediction using rules
     * Use for: Initial display, loading states
     */
    getInstantPrice(input: PriceInput): PriceResult {
        const { categoryId, condition, subcategoryId } = input

        // Get base range
        const baseRange = CATEGORY_PRICES[categoryId] || CATEGORY_PRICES[99]

        // Apply condition multiplier
        const multiplier = CONDITION_MULTIPLIERS[condition] || 0.60

        // Calculate prices
        const suggested = Math.round(baseRange.avg * multiplier)
        const quickSell = Math.round(suggested * 0.85)
        const max = Math.round(suggested * 1.15)
        const min = Math.round(suggested * 0.75)

        // Smart rounding
        const roundedSuggested = this.smartRound(suggested)
        const roundedQuickSell = this.smartRound(quickSell)
        const roundedMax = this.smartRound(max)
        const roundedMin = this.smartRound(min)

        return {
            suggested: roundedSuggested,
            quickSell: roundedQuickSell,
            max: roundedMax,
            range: { min: roundedMin, max: roundedMax },
            confidence: 40, // Low confidence for rule-based
            source: 'instant',
            reasoning: [
                `ประเมินจากหมวดหมู่และสภาพสินค้า`,
                `สภาพ "${condition}" ปรับราคา ${Math.round(multiplier * 100)}%`
            ]
        }
    }

    // ========================================
    // LEVEL 2: AI ENHANCED (GPT-4o-mini, 1-3s)
    // ========================================

    /**
     * Get AI-enhanced price prediction
     * Use for: After user input, refinement
     */
    async getAIEnhancedPrice(input: PriceInput): Promise<PriceResult> {
        const { title, categoryId, condition, subcategoryId, specs, formData } = input

        try {
            // Build prompt
            const prompt = this.buildPrompt(input)

            // Call OpenAI API
            const response = await fetch('/api/ai/price', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt, title, categoryId, condition, specs })
            })

            if (!response.ok) {
                throw new Error('AI API failed')
            }

            const data = await response.json()

            return {
                suggested: data.marketPrice || data.suggested,
                quickSell: data.quickSellPrice || Math.round(data.suggested * 0.85),
                max: data.maxPrice || Math.round(data.suggested * 1.15),
                range: data.priceRange || {
                    min: Math.round(data.suggested * 0.75),
                    max: Math.round(data.suggested * 1.15)
                },
                confidence: data.confidence || 75,
                source: 'ai-enhanced',
                reasoning: Array.isArray(data.reasoning) ? data.reasoning : [data.reasoning],
                marketFactors: data.pricingFactors
            }
        } catch (error) {
            console.warn('[UnifiedPrice] AI failed, using instant:', error)
            return this.getInstantPrice(input)
        }
    }

    // ========================================
    // LEVEL 3: AI VISION (Image-based, 2-5s)
    // ========================================

    /**
     * Get AI vision-based price prediction
     * Use for: Initial image upload, highest accuracy
     */
    async getVisionPrice(input: PriceInput): Promise<PriceResult> {
        const { imageBase64, title, categoryId, condition } = input

        if (!imageBase64) {
            return this.getInstantPrice(input)
        }

        try {
            const response = await fetch('/api/ai/analyze-image', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    image: imageBase64,
                    requestPrice: true
                })
            })

            if (!response.ok) {
                throw new Error('Vision API failed')
            }

            const data = await response.json()

            if (data.estimatedPrice) {
                return {
                    suggested: data.estimatedPrice.suggested,
                    quickSell: data.estimatedPrice.min,
                    max: data.estimatedPrice.max,
                    range: {
                        min: data.estimatedPrice.min,
                        max: data.estimatedPrice.max
                    },
                    confidence: data.confidence || 85,
                    source: 'ai-vision',
                    reasoning: [
                        `ประเมินจากภาพถ่ายด้วย AI`,
                        `ตรวจพบ: ${data.detectedProduct || title}`
                    ]
                }
            }

            throw new Error('No price in response')
        } catch (error) {
            console.warn('[UnifiedPrice] Vision failed, using AI enhanced:', error)
            return this.getAIEnhancedPrice(input)
        }
    }

    // ========================================
    // HYBRID: Progressive Enhancement
    // ========================================

    /**
     * Get price with progressive enhancement
     * 1. Return instant immediately
     * 2. Update with AI when ready
     */
    async getProgressivePrice(
        input: PriceInput,
        onUpdate: (result: PriceResult) => void
    ): Promise<PriceResult> {
        // Step 1: Instant (immediate)
        const instant = this.getInstantPrice(input)
        onUpdate({ ...instant, isLoading: true })

        // Step 2: AI Enhanced (async)
        try {
            const enhanced = await this.getAIEnhancedPrice(input)
            onUpdate({ ...enhanced, isLoading: false })
            return enhanced
        } catch {
            onUpdate({ ...instant, isLoading: false })
            return instant
        }
    }

    // ========================================
    // HELPERS
    // ========================================

    /**
     * Smart price rounding (ปัดเศษให้ดูดี)
     */
    private smartRound(price: number): number {
        if (price < 100) return Math.round(price / 10) * 10
        if (price < 1000) return Math.round(price / 50) * 50
        if (price < 10000) return Math.round(price / 100) * 100
        if (price < 100000) return Math.round(price / 500) * 500
        if (price < 1000000) return Math.round(price / 1000) * 1000
        return Math.round(price / 10000) * 10000
    }

    /**
     * Build AI prompt
     */
    private buildPrompt(input: PriceInput): string {
        const { title, categoryId, condition, brand, model, year, specs } = input

        let prompt = `ประเมินราคาตลาดมือสองในไทย:\n`
        prompt += `- สินค้า: ${title}\n`
        prompt += `- สภาพ: ${condition}\n`

        if (brand) prompt += `- ยี่ห้อ: ${brand}\n`
        if (model) prompt += `- รุ่น: ${model}\n`
        if (year) prompt += `- ปี: ${year}\n`

        if (specs && Object.keys(specs).length > 0) {
            prompt += `- ข้อมูลเพิ่มเติม: ${JSON.stringify(specs)}\n`
        }

        return prompt
    }

    /**
     * Get price tips
     */
    getPriceTips(result: PriceResult, userPrice?: number): string[] {
        const tips: string[] = []

        if (!userPrice) {
            tips.push(`💰 แนะนำตั้งราคา ฿${result.suggested.toLocaleString()}`)
            tips.push(`⚡ ขายเร็วใช้ราคา ฿${result.quickSell.toLocaleString()}`)
            return tips
        }

        const diff = ((userPrice - result.suggested) / result.suggested) * 100

        if (diff > 20) {
            tips.push(`⚠️ ราคาสูงกว่าตลาด ${Math.round(diff)}% อาจขายยาก`)
            tips.push(`💡 แนะนำลดเหลือ ฿${result.suggested.toLocaleString()}`)
        } else if (diff < -15) {
            tips.push(`🔥 ราคาต่ำกว่าตลาด! น่าจะขายเร็ว`)
            tips.push(`💵 สามารถเพิ่มได้ถึง ฿${result.suggested.toLocaleString()}`)
        } else {
            tips.push(`✅ ราคาเหมาะสมกับตลาด`)
        }

        return tips
    }
}

// ==========================================
// SINGLETON EXPORT
// ==========================================

export const unifiedPriceService = UnifiedPriceService.getInstance()

// Convenience exports
export const getInstantPrice = (input: PriceInput) =>
    unifiedPriceService.getInstantPrice(input)

export const getAIEnhancedPrice = (input: PriceInput) =>
    unifiedPriceService.getAIEnhancedPrice(input)

export const getVisionPrice = (input: PriceInput) =>
    unifiedPriceService.getVisionPrice(input)

export const getProgressivePrice = (
    input: PriceInput,
    onUpdate: (result: PriceResult) => void
) => unifiedPriceService.getProgressivePrice(input, onUpdate)

export const getPriceTips = (result: PriceResult, userPrice?: number) =>
    unifiedPriceService.getPriceTips(result, userPrice)
