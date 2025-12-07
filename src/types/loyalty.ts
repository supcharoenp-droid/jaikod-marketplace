/**
 * Loyalty & Rewards System - Complete Type Definitions
 * JaiKod Marketplace - AI-Native Platform
 * 
 * This file contains:
 * - Loyalty Points System
 * - Referral Program
 * - Wishlist & Collections
 * - Rewards & Benefits
 */

// ==========================================
// LOYALTY PROGRAM
// ==========================================

export type LoyaltyTier = 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond'

export interface LoyaltyProgram {
    user_id: string

    // Points
    points_balance: number
    points_lifetime: number // รวมแต้มที่ได้มาทั้งหมด
    points_pending: number // แต้มรอการยืนยัน
    points_expired: number

    // Tier
    tier: LoyaltyTier
    tier_points_required: number // แต้มที่ต้องการเพื่อรักษาระดับ
    tier_achieved_at: Date
    tier_expires_at?: Date

    // Next Tier
    next_tier?: LoyaltyTier
    points_to_next_tier: number

    // Benefits
    current_benefits: LoyaltyBenefit[]

    // History
    points_history: PointsTransaction[]
    tier_history: TierChange[]

    // Metadata
    member_since: Date
    last_updated: Date
}

export interface PointsTransaction {
    id: string
    type: 'earn' | 'redeem' | 'expire' | 'adjust'
    amount: number // positive for earn, negative for redeem
    balance_after: number

    // Source
    source: PointsSource
    source_id?: string // Order ID, Review ID, etc.
    description: string

    // Status
    status: 'pending' | 'confirmed' | 'cancelled'

    // Expiry
    expires_at?: Date

    created_at: Date
}

export type PointsSource =
    | 'purchase' // ซื้อสินค้า
    | 'review' // เขียนรีวิว
    | 'referral' // แนะนำเพื่อน
    | 'signup' // สมัครสมาชิก
    | 'daily_login' // เข้าสู่ระบบ
    | 'social_share' // แชร์โซเชียล
    | 'complete_profile' // กรอกโปรไฟล์
    | 'first_purchase' // ซื้อครั้งแรก
    | 'birthday' // วันเกิด
    | 'event' // กิจกรรมพิเศษ
    | 'bonus' // โบนัส
    | 'adjustment' // ปรับปรุง

export interface TierChange {
    from_tier: LoyaltyTier
    to_tier: LoyaltyTier
    changed_at: Date
    reason: string
}

export interface LoyaltyBenefit {
    id: string
    type: 'discount' | 'free_shipping' | 'early_access' | 'exclusive_deals' | 'priority_support'
    name: string
    name_th: string
    description: string
    value?: number | string
    icon: string
    active: boolean
}

// Tier Configuration
export const LOYALTY_TIER_CONFIG: Record<LoyaltyTier, {
    name: string
    name_th: string
    points_required: number
    points_earn_multiplier: number // ตัวคูณแต้ม
    benefits: string[]
    color: string
    icon: string
}> = {
    bronze: {
        name: 'Bronze',
        name_th: 'สมาชิกทองแดง',
        points_required: 0,
        points_earn_multiplier: 1.0,
        benefits: [
            'รับ 1 แต้มต่อ 100 บาท',
            'คูปองวันเกิด',
            'แจ้งเตือนโปรโมชั่น'
        ],
        color: '#CD7F32',
        icon: '🥉'
    },
    silver: {
        name: 'Silver',
        name_th: 'สมาชิกเงิน',
        points_required: 1000,
        points_earn_multiplier: 1.2,
        benefits: [
            'รับ 1.2 แต้มต่อ 100 บาท',
            'ส่วนลด 5% วันเกิด',
            'ส่งฟรีเดือนละ 1 ครั้ง',
            'Early Access Sale'
        ],
        color: '#C0C0C0',
        icon: '🥈'
    },
    gold: {
        name: 'Gold',
        name_th: 'สมาชิกทอง',
        points_required: 5000,
        points_earn_multiplier: 1.5,
        benefits: [
            'รับ 1.5 แต้มต่อ 100 บาท',
            'ส่วนลด 10% วันเกิด',
            'ส่งฟรีไม่จำกัด',
            'คืนสินค้าฟรี',
            'Priority Support'
        ],
        color: '#FFD700',
        icon: '🥇'
    },
    platinum: {
        name: 'Platinum',
        name_th: 'สมาชิกแพลทินัม',
        points_required: 15000,
        points_earn_multiplier: 2.0,
        benefits: [
            'รับ 2 แต้มต่อ 100 บาท',
            'ส่วนลด 15% วันเกิด',
            'ส่งฟรีแบบด่วน',
            'คืนสินค้าฟรี 30 วัน',
            'Exclusive Deals',
            'Personal Shopper'
        ],
        color: '#E5E4E2',
        icon: '💎'
    },
    diamond: {
        name: 'Diamond',
        name_th: 'สมาชิกไดมอนด์',
        points_required: 50000,
        points_earn_multiplier: 3.0,
        benefits: [
            'รับ 3 แต้มต่อ 100 บาท',
            'ส่วนลด 20% วันเกิด',
            'ส่งฟรีทุกออเดอร์',
            'คืนสินค้าฟรี 60 วัน',
            'VIP Events',
            'Concierge Service',
            'Lifetime Warranty'
        ],
        color: '#B9F2FF',
        icon: '👑'
    }
}

// ==========================================
// REWARDS CATALOG
// ==========================================

export interface Reward {
    id: string
    type: 'voucher' | 'discount' | 'free_shipping' | 'product' | 'experience'

    // Details
    name: string
    name_th: string
    description: string
    image_url?: string

    // Cost
    points_required: number

    // Value
    value: number | string
    discount_type?: 'percentage' | 'fixed'

    // Availability
    stock?: number
    stock_unlimited: boolean

    // Restrictions
    min_purchase?: number
    applicable_categories?: string[]
    excluded_products?: string[]

    // Validity
    valid_days: number // วันที่ใช้ได้หลังแลก

    // Limits
    per_user_limit?: number
    total_redemptions: number

    // Status
    is_active: boolean
    is_featured: boolean

    // Metadata
    created_at: Date
    expires_at?: Date
}

export interface RedeemedReward {
    id: string
    user_id: string
    reward_id: string
    reward: Reward

    // Redemption
    points_spent: number
    redeemed_at: Date

    // Voucher Code
    voucher_code?: string

    // Usage
    is_used: boolean
    used_at?: Date
    used_on_order?: string // Order ID

    // Validity
    valid_until: Date
    is_expired: boolean
}

// ==========================================
// REFERRAL PROGRAM
// ==========================================

export interface ReferralProgram {
    user_id: string

    // Referral Code
    referral_code: string // Unique code
    custom_code?: string // User can customize

    // Stats
    total_referrals: number
    successful_referrals: number // เพื่อนที่ทำธุรกรรมแล้ว
    pending_referrals: number

    // Rewards
    referral_rewards: {
        referrer_bonus: number // โบนัสผู้แนะนำ (points)
        referee_bonus: number // โบนัสผู้ถูกแนะนำ (points)
        total_earned_points: number
        total_earned_cash?: number // ถ้ามีเงินสด
    }

    // Referred Users
    referred_users: ReferredUser[]

    // Campaign
    active_campaign?: {
        name: string
        bonus_multiplier: number
        ends_at: Date
    }

    // Sharing
    share_count: number
    share_channels: Record<string, number> // { "facebook": 5, "line": 10 }

    created_at: Date
    last_updated: Date
}

export interface ReferredUser {
    user_id: string
    email?: string
    name?: string

    // Status
    status: 'pending' | 'signed_up' | 'completed_first_purchase' | 'active'

    // Dates
    referred_at: Date
    signed_up_at?: Date
    first_purchase_at?: Date

    // Rewards
    referrer_reward_claimed: boolean
    referrer_reward_amount: number
    referee_reward_claimed: boolean
    referee_reward_amount: number

    // Activity
    total_purchases?: number
    total_spent?: number
}

// ==========================================
// WISHLIST & COLLECTIONS
// ==========================================

export interface Wishlist {
    user_id: string

    // Items
    items: WishlistItem[]
    total_items: number

    // Alerts
    price_drop_alerts_enabled: boolean
    back_in_stock_alerts_enabled: boolean

    // Sharing
    is_public: boolean
    share_code?: string

    last_updated: Date
}

export interface WishlistItem {
    id: string
    product_id: string

    // Snapshot (when added)
    added_at: Date
    price_at_add: number

    // Current Info
    current_price: number
    is_available: boolean
    stock_status: 'in_stock' | 'low_stock' | 'out_of_stock'

    // Alerts
    price_drop_alert: boolean
    target_price?: number // แจ้งเตือนเมื่อราคาต่ำกว่านี้
    back_in_stock_alert: boolean

    // Notifications Sent
    price_drop_notified: boolean
    back_in_stock_notified: boolean

    // Priority
    priority: 'high' | 'medium' | 'low'
    notes?: string
}

export interface Collection {
    id: string
    user_id: string

    // Details
    name: string
    description?: string
    cover_image?: string

    // Items
    product_ids: string[]
    item_count: number

    // Visibility
    is_public: boolean
    is_featured: boolean

    // Engagement
    follower_count: number
    view_count: number
    share_count: number

    // Metadata
    created_at: Date
    updated_at: Date

    // Tags
    tags: string[]
    category?: string
}

// ==========================================
// SPECIAL OFFERS & FLASH DEALS
// ==========================================

export interface PersonalizedOffer {
    id: string
    user_id: string

    // Offer Details
    type: 'discount' | 'free_shipping' | 'bundle' | 'cashback'
    title: string
    description: string
    image_url?: string

    // Value
    discount_value?: number
    discount_type?: 'percentage' | 'fixed'

    // Conditions
    min_purchase?: number
    applicable_products?: string[]
    applicable_categories?: string[]

    // Validity
    valid_from: Date
    valid_until: Date
    is_active: boolean

    // Usage
    is_used: boolean
    used_at?: Date
    used_on_order?: string

    // Personalization
    ai_generated: boolean
    reason?: string // "Based on your browsing history"

    created_at: Date
}

// ==========================================
// GAMIFICATION CHALLENGES
// ==========================================

export interface Challenge {
    id: string

    // Details
    name: string
    name_th: string
    description: string
    icon: string

    // Type
    type: 'daily' | 'weekly' | 'monthly' | 'special'
    category: 'shopping' | 'social' | 'engagement'

    // Goal
    goal_type: 'purchase_count' | 'purchase_amount' | 'review_count' | 'login_streak' | 'referral_count'
    goal_target: number

    // Reward
    reward_points: number
    reward_badge?: string
    bonus_reward?: string

    // Timing
    starts_at: Date
    ends_at: Date
    is_active: boolean

    // Participation
    total_participants: number
    completion_rate: number
}

export interface UserChallenge {
    user_id: string
    challenge_id: string
    challenge: Challenge

    // Progress
    current_progress: number
    goal_target: number
    progress_percentage: number

    // Status
    status: 'not_started' | 'in_progress' | 'completed' | 'expired'

    // Completion
    completed_at?: Date
    reward_claimed: boolean
    reward_claimed_at?: Date

    // Tracking
    started_at: Date
    last_updated: Date
}

// ==========================================
// NOTIFICATIONS & ALERTS
// ==========================================

export interface UserNotification {
    id: string
    user_id: string

    // Type
    type: 'price_drop' | 'back_in_stock' | 'points_earned' | 'reward_available' | 'tier_upgrade' | 'offer'

    // Content
    title: string
    message: string
    image_url?: string

    // Action
    action_url?: string
    action_label?: string

    // Related
    related_product_id?: string
    related_order_id?: string
    related_reward_id?: string

    // Status
    is_read: boolean
    read_at?: Date

    // Priority
    priority: 'high' | 'medium' | 'low'

    // Channels
    sent_via: ('push' | 'email' | 'sms' | 'in_app')[]

    created_at: Date
    expires_at?: Date
}

// ==========================================
// ANALYTICS
// ==========================================

export interface LoyaltyAnalytics {
    user_id: string

    // Points Summary
    points_earned_total: number
    points_redeemed_total: number
    points_expired_total: number

    // Breakdown by Source
    points_by_source: Record<PointsSource, number>

    // Redemption Patterns
    favorite_reward_types: string[]
    avg_redemption_value: number

    // Engagement
    challenges_completed: number
    badges_earned: number
    tier_upgrades: number

    // Referrals
    successful_referrals: number
    referral_conversion_rate: number

    // Predictions
    predicted_tier_next_month?: LoyaltyTier
    churn_risk: number // 0-100
    lifetime_value_estimate: number

    last_calculated: Date
}
