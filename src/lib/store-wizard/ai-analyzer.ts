/**
 * AI Store Analyzer Service
 * 
 * วิเคราะห์ร้านค้าและให้คำแนะนำอัจฉริยะ
 */

import {
    AIStoreAnalysis, AIRecommendation, StoreHealthScore,
    STORE_HEALTH_METRICS, calculateStoreGrade
} from './types'

// ==========================================
// STORE HEALTH CALCULATOR
// ==========================================

interface StoreMetrics {
    profile_completeness: number      // 0-100
    response_rate: number             // 0-100
    avg_response_time_minutes: number
    shipping_on_time_rate: number     // 0-100
    avg_rating: number                // 0-5
    positive_review_rate: number      // 0-100
    listing_quality_score: number     // 0-100 (based on photos, descriptions)
    compliance_score: number          // 0-100
    total_orders: number
    return_rate: number               // 0-100
}

export function calculateStoreHealth(metrics: StoreMetrics): StoreHealthScore {
    const scores: { metric_id: string; score: number; trend: 'up' | 'down' | 'stable' }[] = []

    // Profile completeness
    scores.push({
        metric_id: 'profile_completeness',
        score: metrics.profile_completeness,
        trend: 'stable'
    })

    // Response rate (target: respond within 1 hour)
    const responseScore = Math.min(100, metrics.response_rate)
    scores.push({
        metric_id: 'response_rate',
        score: responseScore,
        trend: responseScore >= 80 ? 'stable' : 'down'
    })

    // Shipping speed
    scores.push({
        metric_id: 'shipping_speed',
        score: metrics.shipping_on_time_rate,
        trend: 'stable'
    })

    // Product quality (based on reviews)
    const productScore = (metrics.avg_rating / 5) * 100 * 0.6 + metrics.positive_review_rate * 0.4
    scores.push({
        metric_id: 'product_quality',
        score: Math.round(productScore),
        trend: productScore >= 80 ? 'up' : 'stable'
    })

    // Listing quality
    scores.push({
        metric_id: 'listing_quality',
        score: metrics.listing_quality_score,
        trend: 'stable'
    })

    // Policy compliance
    scores.push({
        metric_id: 'policy_compliance',
        score: metrics.compliance_score,
        trend: 'stable'
    })

    // Calculate weighted overall score
    let overall = 0
    for (const metric of STORE_HEALTH_METRICS) {
        const score = scores.find(s => s.metric_id === metric.id)?.score || 0
        overall += score * metric.weight
    }

    const { grade, color } = calculateStoreGrade(overall)

    // Determine badges
    const badges: string[] = []
    if (metrics.response_rate >= 95) badges.push('⚡ Super Fast Response')
    if (metrics.shipping_on_time_rate >= 95) badges.push('🚀 Express Shipper')
    if (metrics.avg_rating >= 4.8) badges.push('⭐ Top Rated')
    if (metrics.total_orders >= 100) badges.push('💯 Trusted Seller')
    if (metrics.return_rate <= 1) badges.push('✅ Quality Guaranteed')

    return {
        overall_score: Math.round(overall),
        grade: grade as any,
        grade_color: color,
        metrics: scores,
        badges,
        last_updated: new Date()
    }
}

// ==========================================
// AI STORE ANALYSIS
// ==========================================

interface AnalysisInput {
    store_id: string
    store_name: string
    store_type: 'individual' | 'general_store' | 'official_store'
    category_focus: string[]

    // Current state
    profile_data: {
        has_logo: boolean
        has_banner: boolean
        has_description: boolean
        description_length: number
        contact_complete: boolean
    }

    // Products
    products: {
        id: string
        title: string
        price: number
        photos_count: number
        description_length: number
        has_video: boolean
        category: string
        views: number
        inquiries: number
        sold_count: number
    }[]

    // Performance
    performance: {
        total_views: number
        total_sales: number
        conversion_rate: number
        avg_order_value: number
        repeat_customer_rate: number
    }
}

export async function analyzeStore(input: AnalysisInput): Promise<AIStoreAnalysis> {
    const strengths: AIStoreAnalysis['strengths'] = []
    const weaknesses: AIStoreAnalysis['weaknesses'] = []
    const opportunities: AIStoreAnalysis['opportunities'] = []
    const recommendations: AIRecommendation[] = []

    // ==========================================
    // PROFILE ANALYSIS
    // ==========================================

    if (input.profile_data.has_logo && input.profile_data.has_banner) {
        strengths.push({
            title: 'Complete Branding',
            title_th: 'แบรนด์ครบถ้วน',
            description_th: 'ร้านมีโลโก้และแบนเนอร์แล้ว ช่วยสร้างความน่าเชื่อถือ'
        })
    } else {
        if (!input.profile_data.has_logo) {
            recommendations.push({
                id: 'add_logo',
                category: 'store_setup',
                priority: 'high',
                title: 'Add Store Logo',
                title_th: 'เพิ่มโลโก้ร้านค้า',
                description: 'Stores with logos get 23% more trust from buyers',
                description_th: 'ร้านที่มีโลโก้ได้รับความเชื่อมั่นจากผู้ซื้อมากขึ้น 23%',
                action: 'Upload a professional logo',
                action_th: 'อัปโหลดโลโก้ที่ดูเป็นมืออาชีพ',
                estimated_impact: '+23% trust',
                estimated_impact_th: '+23% ความเชื่อมั่น',
                difficulty: 'easy',
                completed: false
            })
        }

        if (!input.profile_data.has_banner) {
            recommendations.push({
                id: 'add_banner',
                category: 'store_setup',
                priority: 'medium',
                title: 'Add Store Banner',
                title_th: 'เพิ่มแบนเนอร์ร้านค้า',
                description: 'A banner makes your store page more attractive',
                description_th: 'แบนเนอร์ช่วยให้หน้าร้านดูน่าสนใจยิ่งขึ้น',
                action: 'Upload a 1200x300 banner image',
                action_th: 'อัปโหลดรูปแบนเนอร์ขนาด 1200x300',
                estimated_impact: '+15% page views',
                estimated_impact_th: '+15% การเข้าชม',
                difficulty: 'easy',
                completed: false
            })
        }
    }

    // Description analysis
    if (input.profile_data.description_length < 100) {
        weaknesses.push({
            title: 'Short Store Description',
            title_th: 'คำอธิบายร้านสั้น',
            description_th: 'คำอธิบายร้านค้าสั้นเกินไป ควรมีอย่างน้อย 100 ตัวอักษร'
        })

        recommendations.push({
            id: 'expand_description',
            category: 'store_setup',
            priority: 'medium',
            title: 'Expand Store Description',
            title_th: 'เขียนคำอธิบายร้านให้ละเอียดขึ้น',
            description: 'Detailed descriptions help buyers understand your store',
            description_th: 'คำอธิบายที่ละเอียดช่วยให้ผู้ซื้อเข้าใจร้านค้าของคุณ',
            action: 'Write 150+ characters describing your products and service',
            action_th: 'เขียนคำอธิบาย 150+ ตัวอักษร เกี่ยวกับสินค้าและบริการ',
            estimated_impact: '+10% engagement',
            estimated_impact_th: '+10% การมีส่วนร่วม',
            difficulty: 'easy',
            completed: false
        })
    }

    // ==========================================
    // PRODUCT ANALYSIS
    // ==========================================

    const products = input.products
    const avgPhotos = products.length > 0
        ? products.reduce((sum, p) => sum + p.photos_count, 0) / products.length
        : 0

    if (avgPhotos < 3) {
        weaknesses.push({
            title: 'Few Product Photos',
            title_th: 'รูปสินค้าน้อย',
            description_th: 'สินค้าส่วนใหญ่มีรูปน้อยกว่า 3 รูป'
        })

        recommendations.push({
            id: 'more_photos',
            category: 'product_photos',
            priority: 'high',
            title: 'Add More Product Photos',
            title_th: 'เพิ่มรูปสินค้า',
            description: 'Products with 5+ photos sell 40% faster',
            description_th: 'สินค้าที่มี 5+ รูป ขายเร็วกว่า 40%',
            action: 'Add at least 5 photos per product',
            action_th: 'เพิ่มรูปอย่างน้อย 5 รูปต่อสินค้า',
            estimated_impact: '+40% sales',
            estimated_impact_th: '+40% ยอดขาย',
            difficulty: 'medium',
            completed: false
        })
    } else if (avgPhotos >= 5) {
        strengths.push({
            title: 'Great Product Photos',
            title_th: 'รูปสินค้าดีเยี่ยม',
            description_th: 'สินค้ามีรูปภาพจำนวนมากและครบถ้วน'
        })
    }

    // Check for products without videos
    const productsWithVideo = products.filter(p => p.has_video).length
    if (productsWithVideo === 0 && products.length > 0) {
        opportunities.push({
            title: 'Add Product Videos',
            title_th: 'เพิ่มวิดีโอสินค้า',
            description_th: 'วิดีโอช่วยเพิ่มความมั่นใจให้ผู้ซื้อ และเพิ่มโอกาสขายได้'
        })
    }

    // ==========================================
    // PRICING ANALYSIS
    // ==========================================

    // Check for very low priced items (might be suspicious)
    const veryLowPriced = products.filter(p => p.price < 50).length
    if (veryLowPriced > products.length * 0.5) {
        recommendations.push({
            id: 'review_pricing',
            category: 'pricing_strategy',
            priority: 'medium',
            title: 'Review Your Pricing',
            title_th: 'ทบทวนราคาสินค้า',
            description: 'Many products are priced very low. Ensure prices are competitive but sustainable.',
            description_th: 'สินค้าหลายรายการราคาต่ำมาก ตรวจสอบให้แน่ใจว่าราคาแข่งขันได้และยั่งยืน',
            action: 'Compare with market prices',
            action_th: 'เปรียบเทียบกับราคาตลาด',
            estimated_impact: 'Better margins',
            estimated_impact_th: 'กำไรที่ดีขึ้น',
            difficulty: 'medium',
            completed: false
        })
    }

    // ==========================================
    // DESCRIPTION ANALYSIS
    // ==========================================

    const shortDescriptions = products.filter(p => p.description_length < 100).length
    if (shortDescriptions > products.length * 0.3) {
        recommendations.push({
            id: 'improve_descriptions',
            category: 'product_descriptions',
            priority: 'high',
            title: 'Improve Product Descriptions',
            title_th: 'ปรับปรุงคำอธิบายสินค้า',
            description: 'Over 30% of your products have short descriptions',
            description_th: 'สินค้ากว่า 30% มีคำอธิบายสั้น',
            action: 'Add detailed specs, features, and benefits',
            action_th: 'เพิ่มสเปค คุณสมบัติ และประโยชน์ที่ละเอียด',
            estimated_impact: '+25% conversion',
            estimated_impact_th: '+25% อัตราการซื้อ',
            difficulty: 'medium',
            completed: false
        })
    }

    // ==========================================
    // PERFORMANCE ANALYSIS
    // ==========================================

    if (input.performance.conversion_rate >= 3) {
        strengths.push({
            title: 'Great Conversion Rate',
            title_th: 'อัตราการซื้อดีเยี่ยม',
            description_th: `อัตราการซื้อ ${input.performance.conversion_rate.toFixed(1)}% สูงกว่าค่าเฉลี่ย`
        })
    } else if (input.performance.conversion_rate < 1) {
        weaknesses.push({
            title: 'Low Conversion Rate',
            title_th: 'อัตราการซื้อต่ำ',
            description_th: 'มีคนดูสินค้าแต่ไม่ค่อยซื้อ ควรปรับปรุงรูปภาพและราคา'
        })
    }

    if (input.performance.repeat_customer_rate >= 20) {
        strengths.push({
            title: 'Loyal Customers',
            title_th: 'ลูกค้าซื้อซ้ำ',
            description_th: `${input.performance.repeat_customer_rate}% ของลูกค้ากลับมาซื้อซ้ำ`
        })
    }

    // ==========================================
    // OPPORTUNITIES
    // ==========================================

    if (input.store_type === 'individual') {
        opportunities.push({
            title: 'Upgrade to General Store',
            title_th: 'อัปเกรดเป็นร้านค้าทั่วไป',
            description_th: 'ลงขายไม่จำกัด มีหน้าร้าน สร้างคูปองได้'
        })
    }

    if (input.store_type === 'general_store') {
        opportunities.push({
            title: 'Become Official Store',
            title_th: 'สมัครเป็นร้านค้าทางการ',
            description_th: 'รับเครื่องหมายยืนยัน ✅ และฟีเจอร์เพิ่มเติม'
        })
    }

    // ==========================================
    // CALCULATE OVERALL SCORE
    // ==========================================

    let score = 50 // Base score

    // Add points for strengths
    score += strengths.length * 10

    // Subtract for weaknesses
    score -= weaknesses.length * 8

    // Penalize for high-priority recommendations not done
    const highPriorityCount = recommendations.filter(r => r.priority === 'high' && !r.completed).length
    score -= highPriorityCount * 5

    // Bonus for profile completeness
    if (input.profile_data.has_logo) score += 5
    if (input.profile_data.has_banner) score += 5
    if (input.profile_data.description_length >= 150) score += 5

    // Clamp score
    score = Math.max(20, Math.min(100, score))

    return {
        store_id: input.store_id,
        analyzed_at: new Date(),
        overall_score: Math.round(score),
        strengths,
        weaknesses,
        opportunities,
        recommendations,
        market_insights: {
            trending_categories: ['โทรศัพท์มือถือ', 'เสื้อผ้าแฟชั่น', 'ของใช้ในบ้าน'],
            peak_selling_hours: ['19:00-21:00', '12:00-13:00'],
            suggested_products: ['อุปกรณ์เสริมมือถือ', 'เคสโทรศัพท์', 'เสื้อผ้าผู้หญิง']
        },
        competitor_summary: {
            total_competitors: 156,
            your_ranking: 45,
            price_position: 'average'
        }
    }
}

// ==========================================
// QUICK TIPS GENERATOR
// ==========================================

export function getQuickTips(analysis: AIStoreAnalysis): string[] {
    const tips: string[] = []

    // Based on recommendations
    const highPriority = analysis.recommendations.filter(r => r.priority === 'high')
    if (highPriority.length > 0) {
        tips.push(`⚡ ลองทำก่อน: ${highPriority[0].title_th}`)
    }

    // Based on score
    if (analysis.overall_score < 60) {
        tips.push('📈 โฟกัสที่รูปภาพสินค้าและคำอธิบายก่อน')
    } else if (analysis.overall_score >= 80) {
        tips.push('🎯 ลองใช้ JaiStar โปรโมทเพื่อเพิ่มยอดขาย')
    }

    // Peak hours tip
    tips.push(`⏰ ช่วงขายดี: ${analysis.market_insights.peak_selling_hours.join(', ')}`)

    return tips.slice(0, 3) // Max 3 tips
}

// ==========================================
// EXPORT
// ==========================================

export const AIStoreAnalyzer = {
    calculateHealth: calculateStoreHealth,
    analyze: analyzeStore,
    getQuickTips
}
