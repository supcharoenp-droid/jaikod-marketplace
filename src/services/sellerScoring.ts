import { SellerProfile } from '@/types'

// Factors Weights
const WEIGHTS = {
    PROFILE: 0.20,
    BEHAVIOR: 0.30,
    TRANSPARENCY: 0.20,
    FEEDBACK: 0.30
}

export function calculateSellerTrustScore(seller: Partial<SellerProfile>): { score: number, breakdown: any, badges: string[] } {
    let score = 0
    const breakdown = {
        profile: 0,
        behavior: 0,
        transparency: 0,
        feedback: 0
    }

    // 1. Profile Quality (Max 20)
    // - Verified Seller / Official Store: 10
    // - Avatar & Cover: 5
    // - Detailed Desc: 5
    if (seller.is_verified_seller || seller.verification_status === 'verified') breakdown.profile += 10
    if (seller.avatar_url && seller.cover_url) breakdown.profile += 5
    if (seller.shop_description && seller.shop_description.length > 50) breakdown.profile += 5

    // 2. Behavior (Max 30)
    // - Response Rate (Max 10): 100% = 10, 50% = 5
    // - Response Time (Max 10): < 15min = 10, < 60min = 7, < 24h = 3
    // - Sales Count (Max 10): > 100 = 10, > 10 = 5
    const respRate = seller.response_rate || 0
    breakdown.behavior += (respRate / 100) * 10

    const respTime = seller.response_time_minutes || 60
    if (respTime <= 15) breakdown.behavior += 10
    else if (respTime <= 60) breakdown.behavior += 7
    else if (respTime <= 180) breakdown.behavior += 5
    else breakdown.behavior += 2

    const successRatio = (seller.successful_sales_count || 0) > 100 ? 10 : ((seller.successful_sales_count || 0) > 10 ? 5 : 2)
    breakdown.behavior += successRatio

    // 3. Transparency (Max 20)
    // Listing Quality Score (0-100) -> 20
    const quality = seller.listing_quality_score || 50 // Default 50
    breakdown.transparency += (quality / 100) * 20

    // 4. Feedback (Max 30)
    // Rating (0-5) -> Max 25
    // Count -> Max 5
    const rating = seller.rating_score || 0
    breakdown.feedback += (rating / 5) * 25

    const count = seller.rating_count || 0
    if (count > 50) breakdown.feedback += 5
    else if (count > 10) breakdown.feedback += 3
    else if (count > 0) breakdown.feedback += 1

    // Final Score
    score = Math.round(breakdown.profile + breakdown.behavior + breakdown.transparency + breakdown.feedback)

    // Badges Logic
    const badges: string[] = []
    if (seller.verification_status === 'verified' || seller.shop_type === 'official_store') badges.push('official_store')
    if (score >= 80 && (seller.successful_sales_count || 0) > 50) badges.push('top_seller')
    else if (score >= 70) badges.push('verified_seller')

    if ((seller.response_rate || 0) >= 95 && (seller.response_time_minutes || 60) < 30) badges.push('fast_reply')
    if ((seller.rating_score || 0) >= 4.8 && (seller.rating_count || 0) > 20) badges.push('highly_rated')

    return { score: Math.min(100, Math.max(0, score)), breakdown, badges: [...new Set(badges)] }
}

export function getSellerBadgeLabel(badge: string) {
    switch (badge) {
        case 'official_store': return { label: 'ร้านค้าทางการ', color: 'bg-blue-500', icon: 'BadgeCheck' }
        case 'top_seller': return { label: 'ร้านแนะนำ', color: 'bg-orange-500', icon: 'Trophy' }
        case 'verified_seller': return { label: 'ร้านที่ยืนยันตัวตน', color: 'bg-green-500', icon: 'ShieldCheck' }
        case 'fast_reply': return { label: 'ตอบไวมาก', color: 'bg-teal-500', icon: 'Zap' }
        case 'highly_rated': return { label: 'คะแนนสูง', color: 'bg-yellow-500', icon: 'Star' }
    }
}

export async function getTrustedSellersNearMe(lat?: number, lng?: number): Promise<SellerProfile[]> {
    // Mock return suitable sellers
    // In real app, query users where role=seller AND trust_score > 80 AND distance < 20km
    return [
        {
            id: 's1',
            user_id: 'u1',
            shop_name: 'JaiKod Official Store',
            shop_slug: 'jaikod-official',
            shop_description: 'ร้านค้าอย่างเป็นทางการของ JaiKod การันตีคุณภาพสินค้าทุกชิ้น',
            is_verified_seller: true,
            verification_status: 'verified',
            shop_type: 'official_store',
            rating_score: 4.9,
            rating_count: 1250,
            trust_score: 98,
            follower_count: 5000,
            response_rate: 99,
            response_time_minutes: 5,
            badges: ['official_store', 'top_seller'],
            main_categories: ['mobiles'],
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        },
        {
            id: 's2',
            user_id: 'u2',
            shop_name: 'Camera Pro Shop',
            shop_slug: 'camera-pro',
            shop_description: 'จำหน่ายกล้องมือสองสภาพเทพ รับประกันทุกตัว',
            is_verified_seller: true,
            verification_status: 'verified',
            shop_type: 'general_store',
            rating_score: 4.7,
            rating_count: 320,
            trust_score: 85,
            follower_count: 850,
            response_rate: 95,
            response_time_minutes: 20,
            badges: ['verified_seller', 'highly_rated'],
            main_categories: ['cameras'],
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        }
    ] as SellerProfile[]
}
