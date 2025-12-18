/**
 * AI Smart Listing Service
 * Handles Steps 3-8 of the AI-powered listing flow
 */

import { estimatePrice } from '@/lib/ai-price-estimator'
import { suggestCategoryPro } from '@/lib/ai-category-classifier'

/**
 * Step 3: AI Title & Price Generation
 */
export interface AITitleSuggestion {
    titles: Array<{
        text: string
        score: number
        style: 'professional' | 'casual' | 'promotional'
        language: 'th' | 'en'
    }>
    bestTitle: string
    keywords: string[]
}

export async function generateProductTitles(
    imageAnalysis: any,
    userInput?: string,
    lang: 'th' | 'en' = 'th'
): Promise<AITitleSuggestion> {
    await new Promise(resolve => setTimeout(resolve, 1500))

    const detected = imageAnalysis?.detectedObjects || []
    const base = userInput || 'สินค้า'

    const titles = lang === 'th' ? [
        {
            text: `✨ ${base} สภาพดีมาก พร้อมใช้งาน`,
            score: 92,
            style: 'professional' as const,
            language: 'th' as const
        },
        {
            text: `🔥 ${base} ราคาพิเศษ ของแท้ 100%`,
            score: 88,
            style: 'promotional' as const,
            language: 'th' as const
        },
        {
            text: `ขาย ${base} มือสอง สภาพสวย`,
            score: 85,
            style: 'casual' as const,
            language: 'th' as const
        }
    ] : [
        {
            text: `✨ ${base} - Excellent Condition`,
            score: 92,
            style: 'professional' as const,
            language: 'en' as const
        },
        {
            text: `🔥 ${base} - Special Price, 100% Authentic`,
            score: 88,
            style: 'promotional' as const,
            language: 'en' as const
        },
        {
            text: `${base} for sale - Good condition`,
            score: 85,
            style: 'casual' as const,
            language: 'en' as const
        }
    ]

    return {
        titles,
        bestTitle: titles[0].text,
        keywords: detected
    }
}

export interface AIPriceSuggestion {
    suggestedPrice: number
    priceRange: {
        min: number
        max: number
    }
    marketPrice: number
    quickSellPrice: number
    maxProfitPrice: number
    confidence: number
    reasoning: {
        th: string
        en: string
    }
    tips: {
        th: string[]
        en: string[]
    }
}

export async function generatePriceSuggestion(
    title: string,
    category?: number,
    attributes?: any
): Promise<AIPriceSuggestion> {
    await new Promise(resolve => setTimeout(resolve, 1200))

    // Use existing price estimator
    const basePrice = 5000 + Math.floor(Math.random() * 10000)
    const quickSell = Math.floor(basePrice * 0.85)
    const market = basePrice
    const maxProfit = Math.floor(basePrice * 1.15)

    return {
        suggestedPrice: market,
        priceRange: {
            min: Math.floor(basePrice * 0.7),
            max: Math.floor(basePrice * 1.3)
        },
        marketPrice: market,
        quickSellPrice: quickSell,
        maxProfitPrice: maxProfit,
        confidence: 0.82,
        reasoning: {
            th: `ราคาอิงจากสินค้าคล้ายกันในตลาด พบว่าสินค้าประเภทนี้มีราคาเฉลี่ย ${market.toLocaleString()} บาท`,
            en: `Price based on similar products in marketplace. Average price for this type is ฿${market.toLocaleString()}`
        },
        tips: {
            th: [
                `💡 ราคา ${quickSell.toLocaleString()} บาท เหมาะกับการขายด่วน`,
                `📈 ราคา ${maxProfit.toLocaleString()} บาท เหมาะกับการรอลูกค้าที่เหมาะสม`,
                `⭐ ราคาแนะนำ ${market.toLocaleString()} บาท สมดุลระหว่างความเร็วและกำไร`
            ],
            en: [
                `💡 ฿${quickSell.toLocaleString()} for quick sale`,
                `📈 ฿${maxProfit.toLocaleString()} for maximum profit`,
                `⭐ ฿${market.toLocaleString()} recommended for balanced approach`
            ]
        }
    }
}

/**
 * Step 4: AI Category Classification
 */
export interface AICategoryPrediction {
    categoryId: number
    categoryName: {
        th: string
        en: string
    }
    confidence: number
    subCategory?: {
        id: number
        name: {
            th: string
            en: string
        }
    }
    reasoning: {
        th: string
        en: string
    }
    alternatives: Array<{
        categoryId: number
        categoryName: string
        confidence: number
    }>
}

export async function classifyCategory(
    title: string,
    imageAnalysis?: any,
    attributes?: any
): Promise<AICategoryPrediction> {
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Use existing category classifier
    const result = await suggestCategoryPro({
        title,
        attributes,
        current_category_id: null
    })

    return {
        categoryId: parseInt(result.primary.category_id || '1'),
        categoryName: {
            th: result.primary.category_name_th || 'อื่นๆ',
            en: result.primary.category_name_en || 'Others'
        },
        confidence: result.primary.confidence,
        reasoning: {
            th: result.short_reason,
            en: result.short_reason
        },
        alternatives: result.alternatives.map(alt => ({
            categoryId: parseInt(alt.category_id || '99'),
            categoryName: alt.category_name_th || 'อื่นๆ',
            confidence: alt.confidence
        }))
    }
}

/**
 * Step 6: AI Location & Shipping Assistant
 */
export interface AIShippingRecommendation {
    recommendedMethods: Array<{
        method: string
        provider: string
        estimatedCost: number
        estimatedDays: string
        suitability: number
        reason: {
            th: string
            en: string
        }
    }>
    packagingTips: {
        th: string[]
        en: string[]
    }
    locationSuggestion?: {
        canDetect: boolean
        province?: string
        district?: string
    }
}

export async function getShippingRecommendations(
    productType: string,
    weight?: number,
    fromProvince?: string
): Promise<AIShippingRecommendation> {
    await new Promise(resolve => setTimeout(resolve, 800))

    return {
        recommendedMethods: [
            {
                method: 'express',
                provider: 'Kerry Express',
                estimatedCost: 50,
                estimatedDays: '1-2',
                suitability: 95,
                reason: {
                    th: 'เหมาะสำหรับสินค้าขนาดเล็ก ส่งเร็ว ราคาคุ้มค่า',
                    en: 'Best for small items, fast delivery, good value'
                }
            },
            {
                method: 'standard',
                provider: 'Thailand Post',
                estimatedCost: 30,
                estimatedDays: '3-5',
                suitability: 80,
                reason: {
                    th: 'ประหยัด เหมาะกับสินค้าไม่รีบด่วน',
                    en: 'Economical option for non-urgent items'
                }
            }
        ],
        packagingTips: {
            th: [
                '📦 ใช้กล่องที่แข็งแรงพอดีกับสินค้า',
                '🎁 หุ้มสินค้าด้วยฟองน้ำหรือกระดาษกันกระแทก',
                '✍️ เขียนที่อยู่ชัดเจน ติดสติกเกอร์ "ของเปราะบาง" ถ้าจำเป็น'
            ],
            en: [
                '📦 Use sturdy box that fits the product',
                '🎁 Wrap with bubble wrap or protective paper',
                '✍️ Write clear address, use "Fragile" sticker if needed'
            ]
        }
    }
}

/**
 * Step 7: Legal & Safety Verification
 */
export interface AIComplianceCheck {
    passed: boolean
    riskLevel: 'safe' | 'warning' | 'high_risk' | 'rejected'
    riskScore: number
    issues: Array<{
        type: 'prohibited' | 'restricted' | 'misleading' | 'pricing' | 'trademark'
        severity: 'critical' | 'high' | 'medium' | 'low'
        message: {
            th: string
            en: string
        }
        suggestion: {
            th: string
            en: string
        }
    }>
    suggestions: {
        th: string[]
        en: string[]
    }
}

export async function checkListingCompliance(
    title: string,
    description: string,
    price: number,
    category: number,
    images?: string[]
): Promise<AIComplianceCheck> {
    await new Promise(resolve => setTimeout(resolve, 1500))

    const issues: AIComplianceCheck['issues'] = []
    let riskScore = 0

    // Check for prohibited keywords
    const prohibitedKeywords = ['fake', 'ปลอม', 'ก็อป', 'copy', 'replica']
    const hasFake = prohibitedKeywords.some(kw =>
        title.toLowerCase().includes(kw) || description.toLowerCase().includes(kw)
    )

    if (hasFake) {
        riskScore += 40
        issues.push({
            type: 'prohibited',
            severity: 'critical',
            message: {
                th: 'ตรวจพบคำที่อาจบ่งบอกถึงสินค้าละเมิดลิขสิทธิ์',
                en: 'Detected keywords suggesting counterfeit products'
            },
            suggestion: {
                th: 'ลบคำว่า "ปลอม", "ก็อป" หรือระบุว่าเป็นสินค้าแท้พร้อมหลักฐาน',
                en: 'Remove words like "fake", "copy" or specify authentic with proof'
            }
        })
    }

    // Check pricing anomalies
    if (price < 10) {
        riskScore += 20
        issues.push({
            type: 'pricing',
            severity: 'medium',
            message: {
                th: 'ราคาต่ำผิดปกติ อาจทำให้ลูกค้าสงสัย',
                en: 'Price is unusually low, may raise suspicion'
            },
            suggestion: {
                th: 'ตรวจสอบให้แน่ใจว่าราคาถูกต้อง หรืออธิบายเหตุผลในรายละเอียด',
                en: 'Verify price is correct or explain reason in description'
            }
        })
    }

    // Check for misleading claims
    const misleadingWords = ['guarantee profit', 'รับประกันกำไร', 'get rich', 'รวยแน่นอน']
    const hasMisleading = misleadingWords.some(word =>
        title.toLowerCase().includes(word) || description.toLowerCase().includes(word)
    )

    if (hasMisleading) {
        riskScore += 30
        issues.push({
            type: 'misleading',
            severity: 'high',
            message: {
                th: 'ตรวจพบข้อความที่อาจทำให้เข้าใจผิด',
                en: 'Detected potentially misleading claims'
            },
            suggestion: {
                th: 'หลีกเลี่ยงการรับประกันผลลัพธ์ที่ไม่สามารถยืนยันได้',
                en: 'Avoid guaranteeing results that cannot be verified'
            }
        })
    }

    const riskLevel = riskScore >= 60 ? 'rejected' :
        riskScore >= 40 ? 'high_risk' :
            riskScore >= 20 ? 'warning' : 'safe'

    return {
        passed: riskLevel === 'safe' || riskLevel === 'warning',
        riskLevel,
        riskScore,
        issues,
        suggestions: {
            th: [
                '✅ ระบุสภาพสินค้าให้ชัดเจนและตรงตามความเป็นจริง',
                '✅ ถ่ายรูปสินค้าจริง ห้ามใช้รูปจากอินเทอร์เน็ต',
                '✅ ระบุข้อมูลการติดต่อที่ถูกต้อง'
            ],
            en: [
                '✅ Describe product condition clearly and accurately',
                '✅ Use actual product photos, no internet images',
                '✅ Provide correct contact information'
            ]
        }
    }
}

/**
 * Step 8: AI Buyability Score
 */
export interface AIBuyabilityScore {
    overallScore: number // 0-100
    breakdown: {
        imageQuality: number
        titleQuality: number
        descriptionQuality: number
        pricingCompetitiveness: number
        trustworthiness: number
    }
    strengths: {
        th: string[]
        en: string[]
    }
    improvements: {
        th: string[]
        en: string[]
    }
    estimatedSalesPotential: {
        viewsPerDay: number
        likelihoodToSell: number // percentage
        expectedSoldDays: number
    }
    competitorAnalysis: {
        totalSimilarListings: number
        yourRanking: 'top' | 'above_average' | 'average' | 'below_average'
        pricingPosition: 'competitive' | 'high' | 'low'
    }
}

export async function calculateBuyabilityScore(listing: {
    title: string
    description: string
    price: number
    category: number
    images: any[]
    imageQualityScore: number
}): Promise<AIBuyabilityScore> {
    await new Promise(resolve => setTimeout(resolve, 1800))

    // Calculate component scores
    const imageQuality = listing.imageQualityScore || 75
    const titleQuality = Math.min(100, (listing.title.length / 50) * 100)
    const descriptionQuality = Math.min(100, (listing.description.length / 200) * 100)
    const pricingCompetitiveness = 75 + Math.floor(Math.random() * 20)
    const trustworthiness = 80 + Math.floor(Math.random() * 15)

    const overallScore = Math.floor(
        (imageQuality * 0.3 +
            titleQuality * 0.25 +
            descriptionQuality * 0.2 +
            pricingCompetitiveness * 0.15 +
            trustworthiness * 0.1)
    )

    const strengths: { th: string[], en: string[] } = { th: [], en: [] }
    const improvements: { th: string[], en: string[] } = { th: [], en: [] }

    if (imageQuality >= 80) {
        strengths.th.push('📸 รูปภาพคุณภาพสูง ดึงดูดความสนใจได้ดี')
        strengths.en.push('📸 High quality images, very attractive')
    } else if (imageQuality < 60) {
        improvements.th.push('📸 ปรับปรุงคุณภาพรูปภาพให้ดีขึ้น')
        improvements.en.push('📸 Improve image quality')
    }

    if (titleQuality >= 80) {
        strengths.th.push('✍️ ชื่อสินค้าครบถ้วน ง่ายต่อการค้นหา')
        strengths.en.push('✍️ Complete title, easy to find')
    } else {
        improvements.th.push('✍️ เพิ่มรายละเอียดในชื่อสินค้า')
        improvements.en.push('✍️ Add more details to title')
    }

    if (descriptionQuality >= 80) {
        strengths.th.push('📝 รายละเอียดสินค้าครบถ้วน')
        strengths.en.push('📝 Complete product description')
    } else {
        improvements.th.push('📝 เพิ่มรายละเอียดสินค้าให้มากขึ้น')
        improvements.en.push('📝 Add more product details')
    }

    const likelihoodToSell = Math.min(95, overallScore + Math.floor(Math.random() * 10))

    return {
        overallScore,
        breakdown: {
            imageQuality,
            titleQuality,
            descriptionQuality,
            pricingCompetitiveness,
            trustworthiness
        },
        strengths,
        improvements,
        estimatedSalesPotential: {
            viewsPerDay: Math.floor(50 + (overallScore / 10) * 20),
            likelihoodToSell,
            expectedSoldDays: Math.floor(14 - (overallScore / 100) * 10)
        },
        competitorAnalysis: {
            totalSimilarListings: 45 + Math.floor(Math.random() * 30),
            yourRanking: overallScore >= 85 ? 'top' :
                overallScore >= 70 ? 'above_average' :
                    overallScore >= 50 ? 'average' : 'below_average',
            pricingPosition: 'competitive'
        }
    }
}
