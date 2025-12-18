import { Promotion } from '@/types'
import { getUserBehavior } from './behaviorTracking'

// Extended Promotion Type for AI targeting (Mock)
export interface SmartPromotion extends Promotion {
    target_segments: ('new_customer' | 'high_spender' | 'local' | 'abandoned_cart')[]
    target_categories: string[] // IDs
    conditions?: string // Display text like "Buy 2 Get 5% Off"
    match_score?: number
    match_reason?: string
}

const MOCK_PROMOTIONS: SmartPromotion[] = [
    {
        id: 'p1',
        seller_id: 's1',
        type: 'shop_coupon',
        name: 'ส่วนลดรับเปิดเทอม',
        code: 'BACK2SCHOOL',
        discount_type: 'percent',
        discount_value: 15,
        min_spend: 500,
        start_date: new Date().toISOString(),
        end_date: new Date().toISOString(),
        is_active: true,
        usage_count: 50,
        target_segments: ['new_customer'],
        target_categories: ['mobile-tablet', 'it-gadgets'],
        conditions: 'ลูกค้าใหม่ลด 15%'
    },
    {
        id: 'p2',
        seller_id: 's2',
        type: 'discount_code',
        name: 'Flash Sale กล้องฟิล์ม',
        code: 'FILMCAM500',
        discount_type: 'fixed',
        discount_value: 500,
        min_spend: 3000,
        start_date: new Date().toISOString(),
        end_date: new Date().toISOString(),
        is_active: true,
        usage_count: 120,
        target_segments: ['high_spender', 'abandoned_cart'],
        target_categories: ['cameras'],
        conditions: 'ลดทันที 500.-'
    },
    {
        id: 'p3',
        seller_id: 's3',
        type: 'shop_coupon',
        name: 'Bundle Deal เสื้อผ้า',
        code: 'FASHION2X',
        discount_type: 'percent',
        discount_value: 20,
        min_spend: 1000,
        start_date: new Date().toISOString(),
        end_date: new Date().toISOString(),
        is_active: true,
        usage_count: 5,
        target_segments: ['local'],
        target_categories: ['fashion'],
        conditions: 'ซื้อ 2 ชิ้น ลด 20%'
    },
    {
        id: 'p4',
        seller_id: 's_local_1',
        type: 'shop_coupon',
        name: 'ส่วนลดเพื่อนบ้าน',
        code: 'NBH100',
        discount_type: 'fixed',
        discount_value: 100,
        min_spend: 0,
        start_date: new Date().toISOString(),
        end_date: new Date().toISOString(),
        is_active: true,
        usage_count: 10,
        target_segments: ['local'],
        target_categories: ['mobile-tablet'],
        conditions: 'เฉพาะลูกค้าในพื้นที่'
    }
]

export async function getPersonalizedCoupons(userId: string): Promise<SmartPromotion[]> {
    const behavior = getUserBehavior()

    // AI Scoring Logic
    const scoredCoupons = MOCK_PROMOTIONS.map(promo => {
        let score = 0
        let reason = ''

        // 1. Category Affinity
        // Check if user likes the target category of the coupon
        const categoryMatch = promo.target_categories.some(cat =>
            behavior.profile.categoryScores[Number(cat)] && behavior.profile.categoryScores[Number(cat)] > 1
        )
        if (categoryMatch) {
            score += 40
            reason = 'สำหรับหมวดที่คุณสนใจ'
        }

        // 2. Budget Match
        // Check if promo min_spend aligns with user's avg spend
        const avgSpend = behavior.profile.priceAffinity.avgPrice
        if (avgSpend >= (promo.min_spend || 0)) {
            score += 20
        }

        // 3. Status Segments (Mock)
        if (promo.target_segments.includes('new_customer')) {
            // Assume mock status is effective
            score += 10
            if (!reason) reason = 'โปรโมชั่นต้อนรับ'
        }

        // 4. Local Targeting (Simulated)
        if (promo.target_segments.includes('local')) {
            // Assume user is consistent with our "local" mock
            score += 15
            if (!reason) reason = 'ร้านค้าใกล้คุณ'
        }

        return {
            ...promo,
            match_score: score,
            match_reason: reason || 'แนะนำ'
        }
    })

    // Filter out low scores and Sort
    return scoredCoupons
        .filter(p => p.match_score > 0)
        .sort((a, b) => (b.match_score || 0) - (a.match_score || 0))
}
