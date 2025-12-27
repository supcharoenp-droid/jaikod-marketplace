/**
 * Boost System Types
 * 
 * Type definitions for listing/product boost functionality
 */

// ==========================================
// BOOST TYPES
// ==========================================

export type BoostType = 'basic' | 'premium' | 'urgent' | 'homepage' | 'category_top'

export type BoostStatus = 'pending' | 'active' | 'paused' | 'expired' | 'cancelled' | 'refunded'

export type SellerAccountType = 'individual' | 'general_store' | 'official_store'

// ==========================================
// BOOST PACKAGE
// ==========================================

export interface BoostPackage {
    id: string
    type: BoostType
    name: string
    name_th: string
    description: string
    description_th: string

    // Duration
    duration_hours: number

    // Pricing
    price_jaistar: number
    original_price?: number

    // Benefits
    visibility_multiplier: number
    position_boost: boolean
    highlight_badge: boolean
    homepage_feature: boolean
    category_feature: boolean

    // Visual
    badge_color: string
    badge_icon: string

    // Stats
    avg_view_increase: number
    avg_inquiry_increase: number

    // Availability
    is_active: boolean
    available_for: SellerAccountType[]
}

// ==========================================
// LISTING BOOST
// ==========================================

export interface BoostStats {
    views_before: number
    views_during: number
    unique_visitors_during: number
    inquiries_before: number
    inquiries_during: number
    saves_during: number
    shares_during: number
    conversion_rate?: number
}

export interface ListingBoost {
    id: string
    listing_id: string
    product_id?: string
    seller_id: string
    seller_type: SellerAccountType

    package_id: string
    package_type: BoostType
    package_name: string

    // Status
    status: BoostStatus
    started_at?: Date
    expires_at?: Date
    paused_at?: Date
    cancelled_at?: Date

    // Payment
    amount_paid: number
    discount_applied: number
    transaction_id: string

    // Performance
    stats: BoostStats

    // Position tracking
    avg_search_position?: number
    homepage_impressions?: number
    category_impressions?: number

    created_at: Date
    updated_at: Date
}

// ==========================================
// REQUEST/RESPONSE TYPES
// ==========================================

export interface BoostRequest {
    user_id: string
    seller_id: string
    seller_type: SellerAccountType
    listing_id: string
    product_id?: string
    package_id: string
}

export interface BoostResult {
    success: boolean
    boost_id?: string
    transaction_id?: string
    amount_paid?: number
    discount_applied?: number
    started_at?: Date
    expires_at?: Date
    new_balance?: number
    error?: {
        code: string
        message: string
    }
}

export interface BoostCancelResult {
    success: boolean
    refund_amount?: number
    transaction_id?: string
    error?: {
        code: string
        message: string
    }
}

export interface BoostExtendResult {
    success: boolean
    new_expires_at?: Date
    amount_paid?: number
    transaction_id?: string
    error?: {
        code: string
        message: string
    }
}

// ==========================================
// BOOST ANALYTICS
// ==========================================

export interface BoostPerformance {
    boost_id: string
    listing_id: string

    // Metrics
    total_views: number
    unique_visitors: number
    inquiries: number
    saves: number
    shares: number

    // Calculated
    view_increase_percent: number
    inquiry_increase_percent: number
    roi_score: number

    // Timeline
    hourly_views: { hour: string; views: number }[]

    // Comparisons
    vs_average: {
        views: number
        inquiries: number
    }
}

export interface BoostSummary {
    seller_id: string
    period: 'week' | 'month' | 'all_time'

    total_boosts: number
    total_spent: number
    total_views_gained: number
    total_inquiries_gained: number

    avg_roi_score: number
    best_performing_package: string

    by_package: {
        package_id: string
        count: number
        total_spent: number
        avg_view_increase: number
    }[]
}
