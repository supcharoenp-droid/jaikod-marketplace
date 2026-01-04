/**
 * AI Commerce Engine - Main Service
 * 
 * Orchestrates all AI commerce modules
 * "เงียบ ๆ แต่โหด" - Silent but deadly effective
 */

import {
    AIProductSummary,
    AIFairPrice,
    SellerTrustScore,
    BuyerIntent,
    SmartCTA,
    NegotiationSuggestion,
    ProductComparison,
    AICommerceConfig,
    DEFAULT_AI_COMMERCE_CONFIG,
    BuyerIntentLevel
} from './types'

// ==========================================
// AI INSTANT SUMMARY SERVICE
// ==========================================

export async function generateProductSummary(
    productData: {
        id: string
        title: string
        description?: string
        price: number
        category_id: number
        condition?: string
        images?: string[]
        specs?: Record<string, any>
        seller_id: string
    },
    config: AICommerceConfig = DEFAULT_AI_COMMERCE_CONFIG
): Promise<AIProductSummary> {
    // Rule: ห้ามแต่งข้อมูล - ใช้เฉพาะข้อมูลที่มี
    const highlights: AIProductSummary['highlights'] = []
    const concerns: AIProductSummary['concerns'] = []
    const suitableFor: string[] = []

    // Analyze condition
    let conditionScore = 50 // Default
    if (productData.condition) {
        const conditionMap: Record<string, number> = {
            'new': 100, 'like_new': 90, 'excellent': 85,
            'very_good': 75, 'good': 65, 'fair': 50, 'poor': 30
        }
        conditionScore = conditionMap[productData.condition] || 50
    }

    // Add highlights based on actual data
    if (conditionScore >= 85) {
        highlights.push({
            icon: '✨',
            text_th: 'สภาพดีเยี่ยม',
            text_en: 'Excellent condition',
            importance: 'high'
        })
    }

    if (productData.images && productData.images.length >= 5) {
        highlights.push({
            icon: '📸',
            text_th: `มีรูปภาพ ${productData.images.length} ภาพ`,
            text_en: `${productData.images.length} photos available`,
            importance: 'medium'
        })
    }

    // Add concerns if applicable
    if (!productData.images || productData.images.length < 3) {
        concerns.push({
            icon: '📷',
            text_th: 'รูปภาพน้อย แนะนำให้ขอรูปเพิ่ม',
            text_en: 'Few photos, consider requesting more',
            severity: 'info'
        })
    }

    if (!productData.description || productData.description.length < 50) {
        concerns.push({
            icon: '📝',
            text_th: 'รายละเอียดน้อย แนะนำให้สอบถามเพิ่ม',
            text_en: 'Limited details, consider asking for more info',
            severity: 'info'
        })
    }

    // Determine suitability (based on category and specs)
    if (productData.category_id === 1 || productData.category_id === 101) { // Cars
        suitableFor.push('daily_commute', 'family')
    }

    return {
        overallCondition: conditionScore >= 85 ? 'excellent' :
            conditionScore >= 65 ? 'good' :
                conditionScore >= 50 ? 'fair' : 'poor',
        conditionScore,
        priceAnalysis: {
            comparison: 'unknown', // Will be filled by fair price module
            percentageDiff: 0,
            confidence: 0
        },
        highlights,
        concerns,
        suitableFor,
        generatedAt: new Date()
    }
}

// ==========================================
// AI FAIR PRICE METER SERVICE
// ==========================================

export async function analyzeFairPrice(
    price: number,
    categoryId: number,
    specs: Record<string, any> = {},
    similarProducts: { price: number; sold: boolean }[] = []
): Promise<AIFairPrice> {
    // Rule: ห้ามเดา - ถ้าข้อมูลไม่พอให้บอกตรงๆ
    if (similarProducts.length < 3) {
        return {
            currentPrice: price,
            estimatedFairPrice: { low: 0, high: 0, average: 0 },
            rating: 'insufficient_data',
            confidence: 0,
            comparisonCount: similarProducts.length,
            factors: [],
            lastUpdated: new Date()
        }
    }

    // Calculate market statistics
    const prices = similarProducts.map(p => p.price).sort((a, b) => a - b)
    const low = prices[Math.floor(prices.length * 0.25)]
    const high = prices[Math.floor(prices.length * 0.75)]
    const average = prices.reduce((a, b) => a + b, 0) / prices.length

    // Determine rating
    let rating: AIFairPrice['rating']
    let percentDiff = ((price - average) / average) * 100

    if (percentDiff <= -15) {
        rating = 'excellent_deal'
    } else if (percentDiff <= -5) {
        rating = 'good_deal'
    } else if (percentDiff <= 5) {
        rating = 'fair_price'
    } else if (percentDiff <= 15) {
        rating = 'above_average'
    } else {
        rating = 'overpriced'
    }

    // Calculate confidence based on sample size
    const confidence = Math.min(100, similarProducts.length * 10)

    const factors: AIFairPrice['factors'] = []

    if (percentDiff < 0) {
        factors.push({
            name_th: 'ราคาต่ำกว่าตลาด',
            name_en: 'Below market price',
            impact: 'positive',
            description_th: `ต่ำกว่าราคาเฉลี่ย ${Math.abs(percentDiff).toFixed(0)}%`,
            description_en: `${Math.abs(percentDiff).toFixed(0)}% below average`
        })
    }

    return {
        currentPrice: price,
        estimatedFairPrice: { low, high, average },
        rating,
        confidence,
        comparisonCount: similarProducts.length,
        factors,
        lastUpdated: new Date()
    }
}

// ==========================================
// SELLER TRUST INTELLIGENCE SERVICE
// ==========================================

export async function analyzeSellerTrust(
    sellerData: {
        id: string
        createdAt: Date
        totalSales?: number
        reviewScore?: number
        reviewCount?: number
        responseRate?: number
        responseTime?: number
        onTimeDelivery?: number
        disputeCount?: number
        verifications?: {
            phone?: boolean
            email?: boolean
            idCard?: boolean
            business?: boolean
        }
    }
): Promise<SellerTrustScore> {
    const accountAgeDays = Math.floor(
        (Date.now() - new Date(sellerData.createdAt).getTime()) / (1000 * 60 * 60 * 24)
    )

    // Calculate overall score
    let score = 50 // Base score

    // Account age factor
    if (accountAgeDays > 365) score += 15
    else if (accountAgeDays > 180) score += 10
    else if (accountAgeDays > 30) score += 5

    // Sales factor
    const sales = sellerData.totalSales || 0
    if (sales > 100) score += 15
    else if (sales > 50) score += 10
    else if (sales > 10) score += 5

    // Review factor
    const reviewScore = sellerData.reviewScore || 0
    if (reviewScore >= 4.5) score += 15
    else if (reviewScore >= 4) score += 10
    else if (reviewScore >= 3.5) score += 5

    // Response rate factor
    const responseRate = sellerData.responseRate || 0
    if (responseRate >= 90) score += 10
    else if (responseRate >= 70) score += 5

    // Verification bonus
    const v = sellerData.verifications || {}
    if (v.phone) score += 5
    if (v.idCard) score += 10
    if (v.business) score += 10

    // Cap at 100
    score = Math.min(100, score)

    // Determine level
    let level: SellerTrustScore['level']
    if (score >= 90) level = 'platinum'
    else if (score >= 75) level = 'gold'
    else if (score >= 60) level = 'silver'
    else if (score >= 40) level = 'bronze'
    else if (accountAgeDays < 30) level = 'new'
    else level = 'unverified'

    // Generate risk flags
    const riskFlags: SellerTrustScore['riskFlags'] = []

    if (accountAgeDays < 30) {
        riskFlags.push({
            type: 'new_account',
            severity: 'info',
            message_th: 'บัญชีใหม่ (< 30 วัน)',
            message_en: 'New account (< 30 days)'
        })
    }

    if ((sellerData.reviewCount || 0) === 0) {
        riskFlags.push({
            type: 'no_reviews',
            severity: 'warning',
            message_th: 'ยังไม่มีรีวิว',
            message_en: 'No reviews yet'
        })
    }

    if ((sellerData.responseRate || 0) < 50) {
        riskFlags.push({
            type: 'low_response',
            severity: 'warning',
            message_th: 'อัตราตอบกลับต่ำ',
            message_en: 'Low response rate'
        })
    }

    return {
        overallScore: score,
        level,
        breakdown: {
            deliveryOnTime: sellerData.onTimeDelivery || 0,
            responseRate: sellerData.responseRate || 0,
            reviewScore: sellerData.reviewScore || 0,
            accountAge: accountAgeDays,
            totalSales: sellerData.totalSales || 0,
            disputeRate: sellerData.disputeCount
                ? (sellerData.disputeCount / Math.max(1, sellerData.totalSales || 1)) * 100
                : 0
        },
        verifications: [
            { type: 'phone', verified: sellerData.verifications?.phone || false },
            { type: 'email', verified: sellerData.verifications?.email || false },
            { type: 'id_card', verified: sellerData.verifications?.idCard || false },
            { type: 'business', verified: sellerData.verifications?.business || false }
        ],
        badges: generateBadges(score, level),
        riskFlags
    }
}

function generateBadges(score: number, level: SellerTrustScore['level']): SellerTrustScore['badges'] {
    const badges: SellerTrustScore['badges'] = []

    if (level === 'platinum') {
        badges.push({
            id: 'platinum_seller',
            name_th: 'ร้านค้าระดับแพลตตินั่ม',
            name_en: 'Platinum Seller',
            icon: '💎',
            color: '#E5E7EB'
        })
    } else if (level === 'gold') {
        badges.push({
            id: 'gold_seller',
            name_th: 'ร้านค้าระดับทอง',
            name_en: 'Gold Seller',
            icon: '🥇',
            color: '#FCD34D'
        })
    }

    if (score >= 80) {
        badges.push({
            id: 'trusted',
            name_th: 'น่าเชื่อถือ',
            name_en: 'Trusted',
            icon: '✓',
            color: '#10B981'
        })
    }

    return badges
}

// ==========================================
// SMART CTA ENGINE
// ==========================================

export function generateSmartCTA(
    intent: BuyerIntentLevel,
    context: {
        priceRating?: AIFairPrice['rating']
        sellerOnline?: boolean
        viewCount?: number
        hasRecentInquiries?: boolean
    }
): SmartCTA {
    const { priceRating, sellerOnline, viewCount = 0, hasRecentInquiries } = context

    // Default CTA
    let primary: SmartCTA['primary'] = {
        text_th: '💬 แชทกับผู้ขาย',
        text_en: '💬 Chat with Seller',
        icon: 'message-circle',
        action: 'chat',
        style: 'default'
    }

    let urgencyMessage: SmartCTA['urgencyMessage'] = undefined

    // Adjust based on intent level
    if (intent === 'very_high' || intent === 'high') {
        // High intent - strong CTA
        if (priceRating === 'excellent_deal' || priceRating === 'good_deal') {
            primary = {
                text_th: '🔥 ราคานี้คุ้มมาก!',
                text_en: '🔥 Great Deal!',
                icon: 'flame',
                action: 'chat',
                style: 'urgent'
            }
        } else {
            primary = {
                text_th: '💬 สนใจ? คุยกันเลย',
                text_en: '💬 Interested? Let\'s talk',
                icon: 'message-circle',
                action: 'chat',
                style: 'highlight'
            }
        }

        // Add urgency if there's recent interest
        if (hasRecentInquiries || viewCount > 50) {
            urgencyMessage = {
                text_th: `⏳ มีคนสนใจ ${viewCount > 100 ? 'หลายคน' : 'อยู่'}`,
                text_en: `⏳ ${viewCount > 100 ? 'Many' : 'Someone'} interested`,
                show: true
            }
        }
    } else if (intent === 'medium') {
        // Medium intent - gentle nudge
        if (sellerOnline) {
            primary = {
                text_th: '🟢 ผู้ขายออนไลน์ คุยได้เลย',
                text_en: '🟢 Seller Online - Chat Now',
                icon: 'message-circle',
                action: 'chat',
                style: 'gentle'
            }
        }
    }

    return {
        primary,
        secondary: {
            text_th: '❤️ บันทึก',
            text_en: '❤️ Save',
            icon: 'heart',
            action: 'save'
        },
        urgencyMessage
    }
}

// ==========================================
// AI NEGOTIATION ASSISTANT
// ==========================================

export function generateNegotiationSuggestion(
    askingPrice: number,
    fairPriceData?: AIFairPrice
): NegotiationSuggestion {
    // Rule: ไม่ส่ง offer เองโดยไม่ได้รับอนุญาต

    let suggestedPrice: number
    let acceptanceProbability: number

    if (fairPriceData && fairPriceData.rating !== 'insufficient_data') {
        const { average } = fairPriceData.estimatedFairPrice

        // Suggest 5-10% below asking, but not below fair market
        suggestedPrice = Math.max(
            average * 0.95,
            askingPrice * 0.92
        )

        // Calculate probability based on how close to fair price
        const percentBelow = ((askingPrice - suggestedPrice) / askingPrice) * 100
        acceptanceProbability = Math.max(30, 85 - (percentBelow * 5))
    } else {
        // Without market data, suggest conservative 5% off
        suggestedPrice = Math.round(askingPrice * 0.95)
        acceptanceProbability = 50 // Unknown confidence
    }

    // Round to nice number
    suggestedPrice = Math.round(suggestedPrice / 1000) * 1000

    return {
        suggestedPrice,
        acceptanceProbability: Math.round(acceptanceProbability),
        strategyTips: [
            {
                icon: '💡',
                text_th: 'เริ่มจากการชมสินค้าก่อนเสนอราคา',
                text_en: 'Start by complimenting the item before offering'
            },
            {
                icon: '🤝',
                text_th: 'บอกเหตุผลที่เสนอราคานี้ เช่น งบจำกัด',
                text_en: 'Explain your reason, e.g., budget constraints'
            },
            {
                icon: '✨',
                text_th: 'แสดงความจริงจังว่าพร้อมซื้อ',
                text_en: 'Show serious intent to purchase'
            }
        ],
        messageTemplate: {
            th: `สวัสดีครับ/ค่ะ สนใจสินค้าชิ้นนี้มากเลยครับ อยากสอบถามว่ารับ ${suggestedPrice.toLocaleString()} บาทได้ไหมครับ? พร้อมโอนเลยครับ ขอบคุณครับ`,
            en: `Hi! I'm very interested in this item. Would you accept ฿${suggestedPrice.toLocaleString()}? Ready to pay immediately. Thank you!`
        },
        priceRange: {
            tooLow: askingPrice * 0.80,
            sweet_spot: suggestedPrice,
            acceptable: [
                Math.round(askingPrice * 0.90 / 1000) * 1000,
                Math.round(askingPrice * 0.93 / 1000) * 1000,
                Math.round(askingPrice * 0.95 / 1000) * 1000
            ]
        }
    }
}

// ==========================================
// EXPORT INDEX
// ==========================================

export * from './types'
