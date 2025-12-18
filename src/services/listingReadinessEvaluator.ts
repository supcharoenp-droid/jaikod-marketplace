/**
 * Listing Readiness Evaluation AI
 * 
 * Final quality check before publishing
 * Evaluates completeness, clarity, and buyer trust
 * NEVER blocks publish - only guides improvement
 */

export type SellGrade = 'A' | 'B' | 'C' | 'D' | 'F'

export interface ImprovementTip {
    priority: 'critical' | 'high' | 'medium' | 'low'
    category: 'images' | 'details' | 'category' | 'trust' | 'shipping' | 'title' | 'price'
    tip: {
        th: string
        en: string
    }
    impact: {
        th: string
        en: string
    }
    points_gain: number
}

export interface ReadinessEvaluation {
    sell_score: number // 0-100
    sell_grade: SellGrade
    publish_ready: boolean // Always true, for guidance only
    overall_feedback: {
        th: string
        en: string
    }

    // Detailed scores by category
    category_scores: {
        images: number // 30 points max
        details: number // 25 points max
        category: number // 15 points max
        trust: number // 15 points max
        shipping: number // 10 points max
        title: number // 5 points max
    }

    improvement_tips: ImprovementTip[]

    // Trust signals detected
    trust_signals: {
        has_warranty: boolean
        has_detailed_photos: boolean
        has_gps_location: boolean
        has_shipping_options: boolean
        has_complete_details: boolean
        verified_seller: boolean
    }

    // Predicted performance
    estimated_views: {
        low: number
        average: number
        high: number
    }
    estimated_days_to_sell: {
        min: number
        max: number
    }
}

export interface ListingData {
    // Images
    images: File[] | string[]
    image_quality_scores?: number[]

    // Basic info
    title: string
    description: string
    price: number
    category_id: number
    subcategory_id?: number
    condition: string

    // Location
    province?: string
    amphoe?: string
    district?: string

    // Shipping
    shipping_options?: string[]

    // Category-specific details
    details?: Record<string, any>

    // Trust signals
    has_warranty?: boolean
    has_receipt?: boolean
    imei?: string
}

/**
 * Evaluate listing readiness
 */
export function evaluateListingReadiness(listing: ListingData): ReadinessEvaluation {
    console.log('[ReadinessAI] Evaluating listing...')

    // Calculate scores for each category
    const imageScore = evaluateImages(listing)
    const detailsScore = evaluateDetails(listing)
    const categoryScore = evaluateCategory(listing)
    const trustScore = evaluateTrust(listing)
    const shippingScore = evaluateShipping(listing)
    const titleScore = evaluateTitle(listing)

    // Calculate total sell score
    const totalScore = Math.round(
        imageScore +
        detailsScore +
        categoryScore +
        trustScore +
        shippingScore +
        titleScore
    )

    // Determine sell grade
    const grade = calculateGrade(totalScore)

    // Detect trust signals
    const trustSignals = detectTrustSignals(listing)

    // Generate improvement tips
    const improvementTips = generateImprovementTips(
        listing,
        {
            images: imageScore,
            details: detailsScore,
            category: categoryScore,
            trust: trustScore,
            shipping: shippingScore,
            title: titleScore
        }
    )

    // Generate overall feedback
    const overallFeedback = generateOverallFeedback(totalScore, grade)

    // Predict performance
    const estimatedViews = predictViews(totalScore, listing.category_id)
    const estimatedDaysToSell = predictSellTime(totalScore, listing.price)

    console.log(`[ReadinessAI] Score: ${totalScore}/100 (Grade ${grade})`)

    return {
        sell_score: totalScore,
        sell_grade: grade,
        publish_ready: true, // ALWAYS true - never block
        overall_feedback: overallFeedback,
        category_scores: {
            images: Math.round(imageScore),
            details: Math.round(detailsScore),
            category: Math.round(categoryScore),
            trust: Math.round(trustScore),
            shipping: Math.round(shippingScore),
            title: Math.round(titleScore)
        },
        improvement_tips: improvementTips,
        trust_signals: trustSignals,
        estimated_views: estimatedViews,
        estimated_days_to_sell: estimatedDaysToSell
    }
}

/**
 * Evaluate images (30 points max)
 */
function evaluateImages(listing: ListingData): number {
    let score = 0
    const imageCount = listing.images.length

    // Image count scoring (0-15 points)
    if (imageCount >= 7) {
        score += 15 // Optimal
    } else if (imageCount >= 5) {
        score += 12 // Good
    } else if (imageCount >= 3) {
        score += 9 // Acceptable
    } else if (imageCount >= 1) {
        score += 5 // Minimal
    }

    // Image quality scoring (0-15 points)
    if (listing.image_quality_scores && listing.image_quality_scores.length > 0) {
        const avgQuality = listing.image_quality_scores.reduce((a, b) => a + b, 0) / listing.image_quality_scores.length
        score += (avgQuality / 100) * 15
    } else {
        score += 10 // Default if no quality data
    }

    return Math.min(score, 30)
}

/**
 * Evaluate details (25 points max)
 */
function evaluateDetails(listing: ListingData): number {
    let score = 0

    // Description length (0-10 points)
    const descLength = listing.description.length
    if (descLength >= 200) {
        score += 10 // Detailed
    } else if (descLength >= 100) {
        score += 7 // Good
    } else if (descLength >= 50) {
        score += 4 // Basic
    } else {
        score += 1 // Minimal
    }

    // Description quality (0-5 points)
    if (listing.description.includes('\n')) score += 1 // Has paragraphs
    if (/[0-9]/.test(listing.description)) score += 1 // Has numbers (specs)
    if (listing.description.length > 150) score += 1 // Substantial
    if (!/(.)\1{4,}/.test(listing.description)) score += 1 // No spam patterns
    if (listing.description.split(' ').length >= 20) score += 1 // Word count

    // Condition specified (0-5 points)
    if (listing.condition && listing.condition !== '') {
        score += 5
    }

    // Category-specific details (0-5 points)
    if (listing.details && Object.keys(listing.details).length > 0) {
        const detailCount = Object.keys(listing.details).length
        score += Math.min(detailCount, 5)
    }

    return Math.min(score, 25)
}

/**
 * Evaluate category (15 points max)
 */
function evaluateCategory(listing: ListingData): number {
    let score = 0

    // Category selected (0-10 points)
    if (listing.category_id && listing.category_id !== 99) { // 99 = "Others"
        score += 10
    } else if (listing.category_id === 99) {
        score += 3 // Others category
    }

    // Subcategory selected (0-5 points)
    if (listing.subcategory_id) {
        score += 5
    }

    return Math.min(score, 15)
}

/**
 * Evaluate trust signals (15 points max)
 */
function evaluateTrust(listing: ListingData): number {
    let score = 0

    // Location specified (0-5 points)
    if (listing.province && listing.amphoe && listing.district) {
        score += 5
    } else if (listing.province && listing.amphoe) {
        score += 3
    } else if (listing.province) {
        score += 1
    }

    // Warranty info (0-3 points)
    if (listing.has_warranty) {
        score += 3
    }

    // Receipt/proof (0-3 points)
    if (listing.has_receipt) {
        score += 3
    }

    // IMEI/Serial (0-4 points) - for electronics
    if (listing.imei && listing.imei.length > 0) {
        score += 4
    }

    return Math.min(score, 15)
}

/**
 * Evaluate shipping (10 points max)
 */
function evaluateShipping(listing: ListingData): number {
    let score = 0

    if (listing.shipping_options && listing.shipping_options.length > 0) {
        // Has at least one shipping option (0-5 points)
        score += 5

        // Multiple options (0-3 points)
        if (listing.shipping_options.length >= 2) {
            score += 3
        }

        // Has recommended options (0-2 points)
        const hasKerry = listing.shipping_options.includes('kerry')
        const hasFlash = listing.shipping_options.includes('flash')
        if (hasKerry || hasFlash) {
            score += 2
        }
    }

    return Math.min(score, 10)
}

/**
 * Evaluate title (5 points max)
 */
function evaluateTitle(listing: ListingData): number {
    let score = 0
    const titleLength = listing.title.length

    // Title length (0-2 points)
    if (titleLength >= 20 && titleLength <= 60) {
        score += 2
    } else if (titleLength >= 15 && titleLength <= 80) {
        score += 1
    }

    // Title has numbers (specs) (0-1 point)
    if (/\d+/.test(listing.title)) {
        score += 1
    }

    // Title clarity (0-2 points)
    const hasUppercase = /[A-Z]/.test(listing.title)
    const noExcessiveSymbols = (listing.title.match(/[!@#$%^&*()]/g) || []).length < 3
    if (noExcessiveSymbols) score += 1
    if (hasUppercase || /[ก-๙]/.test(listing.title)) score += 1

    return Math.min(score, 5)
}

/**
 * Calculate sell grade
 */
function calculateGrade(score: number): SellGrade {
    if (score >= 90) return 'A'
    if (score >= 75) return 'B'
    if (score >= 60) return 'C'
    if (score >= 40) return 'D'
    return 'F'
}

/**
 * Detect trust signals
 */
function detectTrustSignals(listing: ListingData): ReadinessEvaluation['trust_signals'] {
    return {
        has_warranty: listing.has_warranty || false,
        has_detailed_photos: listing.images.length >= 5,
        has_gps_location: !!(listing.province && listing.amphoe && listing.district),
        has_shipping_options: (listing.shipping_options?.length || 0) >= 1,
        has_complete_details: listing.description.length >= 100,
        verified_seller: false // Would come from user profile
    }
}

/**
 * Generate improvement tips
 */
function generateImprovementTips(
    listing: ListingData,
    scores: Record<string, number>
): ImprovementTip[] {
    const tips: ImprovementTip[] = []

    // Image improvements
    if (scores.images < 20) {
        if (listing.images.length < 5) {
            tips.push({
                priority: 'critical',
                category: 'images',
                tip: {
                    th: `เพิ่มรูปให้มีอย่างน้อย 5 รูป (ตอนนี้มี ${listing.images.length} รูป)`,
                    en: `Add at least 5 photos (currently ${listing.images.length})`
                },
                impact: {
                    th: 'สินค้าที่มี 5-7 รูป ขายได้เร็วกว่า 2 เท่า',
                    en: 'Products with 5-7 photos sell 2x faster'
                },
                points_gain: 10
            })
        }
    }

    // Detail improvements
    if (scores.details < 15) {
        if (listing.description.length < 100) {
            tips.push({
                priority: 'high',
                category: 'details',
                tip: {
                    th: 'เขียนคำอธิบายให้ละเอียดกว่านี้ (อย่างน้อย 100 ตัวอักษร)',
                    en: 'Write more detailed description (at least 100 characters)'
                },
                impact: {
                    th: 'คำอธิบายละเอียดเพิ่มความน่าเชื่อถือ +25%',
                    en: 'Detailed description increases trust +25%'
                },
                points_gain: 8
            })
        }
    }

    // Category improvements
    if (scores.category < 10) {
        if (listing.category_id === 99) {
            tips.push({
                priority: 'high',
                category: 'category',
                tip: {
                    th: 'เลือกหมวดหมู่ที่เหมาะสมแทน "อื่นๆ"',
                    en: 'Select appropriate category instead of "Others"'
                },
                impact: {
                    th: 'หมวดหมู่ที่ถูกต้องช่วยให้ผู้ซื้อค้นหาเจอง่าย',
                    en: 'Correct category helps buyers find your item'
                },
                points_gain: 7
            })
        }

        if (!listing.subcategory_id) {
            tips.push({
                priority: 'medium',
                category: 'category',
                tip: {
                    th: 'เลือกหมวดหมู่ย่อยเพื่อความแม่นยำ',
                    en: 'Select subcategory for better accuracy'
                },
                impact: {
                    th: 'เพิ่มโอกาสปรากฏในผลการค้นหาที่เฉพาะเจาะจง',
                    en: 'Increases visibility in specific searches'
                },
                points_gain: 5
            })
        }
    }

    // Trust improvements
    if (scores.trust < 10) {
        if (!listing.province || !listing.amphoe) {
            tips.push({
                priority: 'medium',
                category: 'trust',
                tip: {
                    th: 'ระบุที่อยู่ให้ครบถ้วน (จังหวัด, อำเภอ, ตำบล)',
                    en: 'Specify complete location (province, district, sub-district)'
                },
                impact: {
                    th: 'ที่อยู่ชัดเจนเพิ่มความน่าเชื่อถือ +15%',
                    en: 'Clear location increases trust +15%'
                },
                points_gain: 5
            })
        }

        if (!listing.has_warranty && [3, 4, 5].includes(listing.category_id)) {
            tips.push({
                priority: 'medium',
                category: 'trust',
                tip: {
                    th: 'ระบุข้อมูลการรับประกัน (ถ้ามี)',
                    en: 'Specify warranty information (if any)'
                },
                impact: {
                    th: 'การมีประกันเพิ่มความมั่นใจให้ผู้ซื้อ',
                    en: 'Warranty increases buyer confidence'
                },
                points_gain: 3
            })
        }
    }

    // Shipping improvements
    if (scores.shipping < 5) {
        tips.push({
            priority: 'medium',
            category: 'shipping',
            tip: {
                th: 'เพิ่มทางเลือกการจัดส่ง',
                en: 'Add shipping options'
            },
            impact: {
                th: 'มีทางเลือกให้ผู้ซื้อทำให้ขายได้เร็วขึ้น',
                en: 'Multiple shipping options lead to faster sales'
            },
            points_gain: 5
        })
    }

    // Title improvements
    if (scores.title < 3) {
        tips.push({
            priority: 'low',
            category: 'title',
            tip: {
                th: 'ใส่รายละเอียดสำคัญในชื่อสินค้า (ยี่ห้อ, รุ่น, สเปก)',
                en: 'Include key details in title (brand, model, specs)'
            },
            impact: {
                th: 'ชื่อที่ดีช่วยให้ปรากฏในผลการค้นหา',
                en: 'Good title improves search visibility'
            },
            points_gain: 3
        })
    }

    // Price check
    if (listing.price <= 0) {
        tips.push({
            priority: 'critical',
            category: 'price',
            tip: {
                th: 'กรุณาระบุราคาสินค้า',
                en: 'Please specify product price'
            },
            impact: {
                th: 'ราคาเป็นข้อมูลสำคัญที่สุดสำหรับผู้ซื้อ',
                en: 'Price is the most critical information for buyers'
            },
            points_gain: 0 // Not counted in sell score but critical
        })
    }

    // Sort by priority and points
    tips.sort((a, b) => {
        const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 }
        const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority]
        if (priorityDiff !== 0) return priorityDiff
        return b.points_gain - a.points_gain
    })

    return tips.slice(0, 5) // Top 5 tips
}

/**
 * Generate overall feedback
 */
function generateOverallFeedback(score: number, grade: SellGrade): {
    th: string
    en: string
} {
    if (score >= 90) {
        return {
            th: '🎉 ยอดเยี่ยม! ประกาศนี้พร้อมขายแล้ว มีโอกาสขายได้เร็วมาก',
            en: '🎉 Excellent! This listing is ready to sell and will likely sell quickly'
        }
    } else if (score >= 75) {
        return {
            th: '👍 ดีมาก! ประกาศนี้มีคุณภาพดี อาจปรับปรุงเล็กน้อยเพื่อขายเร็วขึ้น',
            en: '👍 Very good! High quality listing, minor improvements could help sell faster'
        }
    } else if (score >= 60) {
        return {
            th: '😊 ดี! ประกาศใช้ได้ แต่ควรปรับปรุงบางจุดเพื่อเพิ่มโอกาสขาย',
            en: '😊 Good! Listing is okay, but improvements recommended for better chances'
        }
    } else if (score >= 40) {
        return {
            th: '⚠️ พอใช้ ควรปรับปรุงหลายจุดเพื่อให้ขายได้เร็วขึ้น',
            en: '⚠️ Fair - several improvements needed for better sales speed'
        }
    } else {
        return {
            th: '💪 ควรปรับปรุงเพิ่มเติม ตามคำแนะนำด้านล่างจะช่วยให้ขายได้ดีขึ้น',
            en: '💪 Needs improvement - follow tips below for better results'
        }
    }
}

/**
 * Predict views based on score
 */
function predictViews(score: number, categoryId: number): {
    low: number
    average: number
    high: number
} {
    // Base views by category popularity
    const categoryMultiplier: Record<number, number> = {
        3: 1.5, // Mobiles (popular)
        1: 1.3, // Automotive
        2: 1.2, // Real Estate
        6: 1.1, // Fashion
        4: 1.0  // Computers
    }

    const multiplier = categoryMultiplier[categoryId] || 1.0

    // Score-based prediction
    const baseViews = (score / 100) * 100 * multiplier

    return {
        low: Math.round(baseViews * 0.7),
        average: Math.round(baseViews),
        high: Math.round(baseViews * 1.5)
    }
}

/**
 * Predict days to sell
 */
function predictSellTime(score: number, price: number): {
    min: number
    max: number
} {
    // High score = faster sale
    let baseDays = 14 - (score / 100) * 10 // 14 days for 0%, 4 days for 100%

    // Price affects sell time
    if (price > 50000) {
        baseDays *= 1.5 // Expensive items take longer
    } else if (price < 1000) {
        baseDays *= 0.8 // Cheap items sell faster
    }

    return {
        min: Math.max(1, Math.round(baseDays * 0.5)),
        max: Math.round(baseDays * 2)
    }
}

/**
 * Get grade color
 */
export function getGradeColor(grade: SellGrade): string {
    const colors: Record<SellGrade, string> = {
        'A': 'text-green-600',
        'B': 'text-blue-600',
        'C': 'text-yellow-600',
        'D': 'text-orange-600',
        'F': 'text-red-600'
    }
    return colors[grade]
}

/**
 * Get grade label
 */
export function getGradeLabel(grade: SellGrade): { th: string; en: string } {
    const labels: Record<SellGrade, { th: string; en: string }> = {
        'A': { th: 'ยอดเยี่ยม', en: 'Excellent' },
        'B': { th: 'ดีมาก', en: 'Very Good' },
        'C': { th: 'ดี', en: 'Good' },
        'D': { th: 'พอใช้', en: 'Fair' },
        'F': { th: 'ควรปรับปรุง', en: 'Needs Work' }
    }
    return labels[grade]
}
