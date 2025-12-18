/**
 * Intelligent Listing Assistant
 * Helps users create professional product listings with AI assistance
 */

export interface ListingAssistantResult {
    listing_ready: boolean
    completion_score: number // 0-100
    category_recommendation: CategoryRecommendation
    title_suggestions: TitleSuggestion[]
    description_template: DescriptionTemplate
    price_guidance?: PriceGuidance
    location_suggestion?: LocationSuggestion
}

export interface CategoryRecommendation {
    main_category: {
        id: number
        name: { th: string; en: string }
        confidence: number // 0-1
    }
    sub_category?: {
        id: number
        name: { th: string; en: string }
        confidence: number
    }
    alternatives: Array<{
        id: number
        name: { th: string; en: string }
        confidence: number
    }>
}

export interface TitleSuggestion {
    suggested_title: {
        th: string
        en: string
    }
    confidence: number
    reasoning: {
        th: string
        en: string
    }
}

export interface DescriptionTemplate {
    required_fields: string[]
    suggested_fields: string[]
    template: {
        th: string
        en: string
    }
    example: {
        th: string
        en: string
    }
}

export interface PriceGuidance {
    market_range: {
        min: number
        max: number
        average: number
    }
    user_price?: number
    is_abnormal: boolean
    suggestion: {
        th: string
        en: string
    }
}

export interface LocationSuggestion {
    gps_available: boolean
    suggested_province?: string
    suggested_district?: string
    shop_address?: {
        province: string
        district: string
        subdistrict: string
        zipcode: string
    }
}

/**
 * Analyze product and provide AI assistance for listing creation
 */
export async function analyzeProductForListing(data: {
    detected_product?: string
    detected_category?: string
    images_count: number
    user_input?: {
        title?: string
        description?: string
        price?: number
        category_id?: number
    }
}): Promise<ListingAssistantResult> {
    console.log('[Listing Assistant] Analyzing product...')

    // 1. Category Recommendation
    const category_recommendation = await recommendCategory(
        data.detected_product,
        data.detected_category,
        data.user_input?.category_id
    )

    // 2. Title Suggestions
    const title_suggestions = await generateTitleSuggestions(
        data.detected_product,
        data.user_input?.title,
        category_recommendation.main_category.name
    )

    // 3. Description Template
    const description_template = await generateDescriptionTemplate(
        category_recommendation.main_category.id,
        data.detected_product
    )

    // 4. Price Guidance (if user provided price)
    let price_guidance: PriceGuidance | undefined
    if (data.user_input?.price) {
        price_guidance = await analyzePriceGuidance(
            data.user_input.price,
            category_recommendation.main_category.id,
            data.detected_product
        )
    }

    // 5. Calculate completion score
    const completion_score = calculateCompletionScore({
        images_count: data.images_count,
        has_title: !!data.user_input?.title,
        has_description: !!data.user_input?.description,
        has_price: !!data.user_input?.price,
        has_category: !!data.user_input?.category_id
    })

    return {
        listing_ready: completion_score >= 80,
        completion_score,
        category_recommendation,
        title_suggestions,
        description_template,
        price_guidance
    }
}

/**
 * Recommend category based on detected product
 */
async function recommendCategory(
    detected_product?: string,
    detected_category?: string,
    user_category_id?: number
): Promise<CategoryRecommendation> {
    await new Promise(resolve => setTimeout(resolve, 200))

    // Mock category mapping
    const categoryMap: Record<string, { id: number; name: { th: string; en: string }; confidence: number }> = {
        'smartphone': { id: 1, name: { th: 'โทรศัพท์มือถือ', en: 'Mobile Phones' }, confidence: 0.95 },
        'laptop': { id: 2, name: { th: 'คอมพิวเตอร์ & โน้ตบุ๊ค', en: 'Computers & Laptops' }, confidence: 0.93 },
        'wristwatch': { id: 7, name: { th: 'แฟชั่น & เครื่องประดับ', en: 'Fashion & Accessories' }, confidence: 0.90 },
        'camera': { id: 3, name: { th: 'กล้อง & อุปกรณ์ถ่ายภาพ', en: 'Cameras & Photography' }, confidence: 0.92 },
        'handbag': { id: 7, name: { th: 'แฟชั่น & เครื่องประดับ', en: 'Fashion & Accessories' }, confidence: 0.88 },
        'sneakers': { id: 8, name: { th: 'รองเท้า', en: 'Footwear' }, confidence: 0.91 }
    }

    const main = detected_product && categoryMap[detected_product]
        ? categoryMap[detected_product]
        : { id: 10, name: { th: 'อื่นๆ', en: 'Other' }, confidence: 0.60 }

    return {
        main_category: main,
        alternatives: [
            { id: 9, name: { th: 'เครื่องใช้ไฟฟ้า', en: 'Electronics' }, confidence: 0.75 },
            { id: 11, name: { th: 'ของสะสม', en: 'Collectibles' }, confidence: 0.65 }
        ]
    }
}

/**
 * Generate professional title suggestions
 */
async function generateTitleSuggestions(
    detected_product?: string,
    user_title?: string,
    category_name?: { th: string; en: string }
): Promise<TitleSuggestion[]> {
    await new Promise(resolve => setTimeout(resolve, 150))

    const suggestions: TitleSuggestion[] = []

    // If user has input, enhance it
    if (user_title && user_title.length > 0) {
        // Example enhancement
        const enhanced_th = enhanceTitle(user_title, 'th', detected_product)
        const enhanced_en = enhanceTitle(user_title, 'en', detected_product)

        suggestions.push({
            suggested_title: {
                th: enhanced_th,
                en: enhanced_en
            },
            confidence: 0.85,
            reasoning: {
                th: 'เพิ่มรายละเอียดเพื่อดึงดูดผู้ซื้อมากขึ้น',
                en: 'Added details to attract more buyers'
            }
        })
    } else {
        // Generate from detected product
        suggestions.push({
            suggested_title: {
                th: `${detected_product || 'สินค้า'} สภาพดี พร้อมใช้งาน`,
                en: `${detected_product || 'Product'} in Excellent Condition`
            },
            confidence: 0.75,
            reasoning: {
                th: 'ชื่อสินค้าที่ชัดเจนและน่าสนใจ',
                en: 'Clear and attractive product title'
            }
        })
    }

    return suggestions
}

/**
 * Enhance user's title with AI
 */
function enhanceTitle(title: string, lang: 'th' | 'en', product?: string): string {
    // Simple enhancement logic
    const lower = title.toLowerCase()

    // Check if already detailed
    if (lower.length > 30) return title

    // Add common enhancements
    const enhancements = {
        th: ['สภาพดี', 'พร้อมใช้งาน', 'ของแท้'],
        en: ['Excellent Condition', 'Ready to Use', 'Authentic']
    }

    // Don't add if already contains similar words
    const hasCondition = lang === 'th'
        ? /สภาพ|พร้อม|ใหม่/.test(title)
        : /condition|ready|new/i.test(title)

    if (hasCondition) return title

    return `${title} ${enhancements[lang][0]}`
}

/**
 * Generate description template based on category
 */
async function generateDescriptionTemplate(
    category_id: number,
    detected_product?: string
): Promise<DescriptionTemplate> {
    await new Promise(resolve => setTimeout(resolve, 100))

    // Category-specific templates
    const templates: Record<number, DescriptionTemplate> = {
        1: { // Mobile Phones
            required_fields: ['brand', 'model', 'storage', 'condition'],
            suggested_fields: ['color', 'warranty', 'accessories', 'reason_for_sale'],
            template: {
                th: 'รายละเอียดสินค้า:\n- ยี่ห้อ: [brand]\n- รุ่น: [model]\n- ความจุ: [storage]\n- สภาพ: [condition]\n- สี: [color]\n- อุปกรณ์ในกล่อง: [accessories]\n- การรับประกัน: [warranty]',
                en: 'Product Details:\n- Brand: [brand]\n- Model: [model]\n- Storage: [storage]\n- Condition: [condition]\n- Color: [color]\n- Included: [accessories]\n- Warranty: [warranty]'
            },
            example: {
                th: 'iPhone 15 Pro 256GB สี Natural Titanium\nสภาพ: 95% ใช้งานมาไม่ถึง 3 เดือน\nเครื่องศูนย์ไทย มีประกันเหลือ 9 เดือน\nครบกล่อง สายชาร์จยังไม่แกะ\nไม่มีรอยขีดข่วน ไม่เคยซ่อม',
                en: 'iPhone 15 Pro 256GB Natural Titanium\nCondition: 95%, used less than 3 months\nOfficial Thailand, 9 months warranty remaining\nComplete box, charging cable unused\nNo scratches, never repaired'
            }
        },
        7: { // Fashion
            required_fields: ['brand', 'size', 'condition', 'material'],
            suggested_fields: ['color', 'occasion', 'care_instructions'],
            template: {
                th: 'รายละเอียดสินค้า:\n- ยี่ห้อ: [brand]\n- ไซส์: [size]\n- วัสดุ: [material]\n- สภาพ: [condition]\n- สี: [color]\n- เหมาะกับโอกาส: [occasion]',
                en: 'Product Details:\n- Brand: [brand]\n- Size: [size]\n- Material: [material]\n- Condition: [condition]\n- Color: [color]\n- Occasion: [occasion]'
            },
            example: {
                th: 'กระเป๋า Louis Vuitton Neverfull MM\nสภาพ: 90% ใช้งานเบาๆ\nไซส์: MM (กลาง)\nวัสดุ: Monogram Canvas แท้\nครบเซ็ต มีถุงผ้า + ใบเสร็จ\nไม่มีกลิ่น ไม่มีรอยเปื้อน',
                en: 'Louis Vuitton Neverfull MM Bag\nCondition: 90%, lightly used\nSize: MM (Medium)\nMaterial: Authentic Monogram Canvas\nComplete set with dust bag + receipt\nNo odor, no stains'
            }
        }
    }

    // Return default if category not found
    return templates[category_id] || {
        required_fields: ['condition', 'brand'],
        suggested_fields: ['features', 'reason_for_sale'],
        template: {
            th: 'รายละเอียดสินค้า:\n- สภาพ: [condition]\n- ยี่ห้อ: [brand]\n- คุณสมบัติพิเศษ: [features]',
            en: 'Product Details:\n- Condition: [condition]\n- Brand: [brand]\n- Features: [features]'
        },
        example: {
            th: 'สินค้ามือสอง สภาพดี 90%\nใช้งานเบาๆ อยู่บ้าน\nไม่มีตำหนิ ทำงานปกติ',
            en: 'Pre-owned item, 90% condition\nLightly used at home\nNo defects, works perfectly'
        }
    }
}

/**
 * Analyze price and provide guidance
 */
async function analyzePriceGuidance(
    user_price: number,
    category_id: number,
    detected_product?: string
): Promise<PriceGuidance> {
    await new Promise(resolve => setTimeout(resolve, 100))

    // Mock market data
    const market_range = {
        min: user_price * 0.7,
        max: user_price * 1.5,
        average: user_price * 1.1
    }

    const is_abnormal = user_price < market_range.min * 0.5 || user_price > market_range.max * 2

    let suggestion = {
        th: 'ราคาอยู่ในช่วงที่เหมาะสม',
        en: 'Price is within reasonable range'
    }

    if (user_price < market_range.min) {
        suggestion = {
            th: `ราคาของคุณต่ำกว่าตลาด ลองเพิ่มเป็น ${Math.round(market_range.min).toLocaleString()}฿ เพื่อเพิ่มความน่าเชื่อถือ`,
            en: `Your price is below market. Consider ${Math.round(market_range.min).toLocaleString()}฿ for better credibility`
        }
    } else if (user_price > market_range.max) {
        suggestion = {
            th: `ราคาสูงกว่าตลาด ลองลดเหลือ ${Math.round(market_range.max).toLocaleString()}฿ เพื่อขายเร็วขึ้น`,
            en: `Price is above market. Consider ${Math.round(market_range.max).toLocaleString()}฿ for faster sale`
        }
    }

    return {
        market_range,
        user_price,
        is_abnormal,
        suggestion
    }
}

/**
 * Calculate listing completion score
 */
function calculateCompletionScore(data: {
    images_count: number
    has_title: boolean
    has_description: boolean
    has_price: boolean
    has_category: boolean
}): number {
    let score = 0

    // Images (30 points)
    score += Math.min(data.images_count * 6, 30)

    // Title (20 points)
    if (data.has_title) score += 20

    // Description (20 points)
    if (data.has_description) score += 20

    // Price (15 points)
    if (data.has_price) score += 15

    // Category (15 points)
    if (data.has_category) score += 15

    return Math.min(score, 100)
}

/**
 * Get completion message
 */
export function getCompletionMessage(score: number, lang: 'th' | 'en'): string {
    const messages = {
        th: {
            excellent: 'ยอดเยี่ยม! ข้อมูลครบถ้วน พร้อมโพสเลย 🎉',
            good: 'ดีมาก! เติมอีกนิดก็สมบูรณ์แบบ',
            fair: 'ใกล้เสร็จแล้ว! เพิ่มรายละเอียดอีกหน่อย',
            needs_work: 'ยังต้องเพิ่มข้อมูลอีกสักหน่อยค่ะ'
        },
        en: {
            excellent: 'Excellent! Complete information, ready to post 🎉',
            good: 'Great! Just a bit more for perfection',
            fair: 'Almost there! Add a few more details',
            needs_work: 'Let\'s add more information'
        }
    }

    if (score >= 90) return messages[lang].excellent
    if (score >= 70) return messages[lang].good
    if (score >= 50) return messages[lang].fair
    return messages[lang].needs_work
}
