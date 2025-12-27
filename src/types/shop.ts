/**
 * JaiKod Shop System - Complete Type Definitions
 * 
 * ระบบร้านค้าครบวงจรที่เชื่อมต่อกับ:
 * - Member System V2 (3-tier seller structure)
 * - JaiStar Points System
 * - Enhanced Seller Profile
 * - Firestore Collections
 */

import { SellerAccountType, SellerVerificationStatus, StoreSeller, IndividualSeller } from './member-system-v2'
import { EnhancedSellerProfile, SellerTier, DetailedRatings, SellerPerformance, AIInsights } from './seller.enhanced'

// ==========================================
// SHOP TYPES - Based on Member System V2
// ==========================================

/**
 * Shop Type - Mapped from SellerAccountType
 */
export type ShopType =
    | 'individual'      // ผู้ขายทั่วไป (ไม่มีหน้าร้าน, เห็นแค่ profile)
    | 'general_store'   // ร้านค้าทั่วไป (มีหน้าร้าน)
    | 'official_store'  // ร้านค้าทางการ (มีหน้าร้าน + verified badge)

/**
 * Shop Status
 */
export type ShopStatus =
    | 'pending_setup'   // กำลังตั้งค่า
    | 'pending_review'  // รอตรวจสอบ (Official)
    | 'active'          // เปิดใช้งาน
    | 'vacation'        // โหมดพักร้อน
    | 'suspended'       // ถูกระงับ
    | 'closed'          // ปิดร้าน

/**
 * Shop Visibility
 */
export type ShopVisibility =
    | 'public'          // เห็นทุกคน
    | 'followers_only'  // เห็นเฉพาะ followers
    | 'private'         // ไม่แสดงในการค้นหา

// ==========================================
// SHOP PROFILE (Firestore: shops/{shopId})
// ==========================================

export interface ShopLocation {
    province: string
    amphoe?: string
    district?: string
    zipcode?: string
    coordinates?: {
        lat: number
        lng: number
    }
    show_on_map: boolean
    formatted_address?: string
}

export interface ShopContact {
    phone?: string
    email?: string
    line_id?: string
    facebook_url?: string
    instagram_url?: string
    website_url?: string
    tiktok_url?: string
}

export interface ShopBranding {
    logo_url: string
    cover_url?: string
    banner_urls?: string[]              // Multiple banners for carousel
    theme_color?: string                // Primary color
    theme_secondary_color?: string      // Secondary color
    theme_layout?: 'default' | 'minimal' | 'premium' | 'gallery'
    custom_css?: string                 // Official stores only
}

export interface ShopBadge {
    type: 'official' | 'verified' | 'top_seller' | 'fast_shipper' | 'eco_friendly' | 'recommended' | 'new_store' | 'rising_star'
    name: string
    name_th: string
    icon: string
    color: string
    earned_at: Date
    expires_at?: Date
    is_visible: boolean
}

export interface ShopStats {
    // Product Stats
    total_products: number
    active_products: number
    sold_products: number

    // Sales Stats
    total_orders: number
    total_revenue: number
    avg_order_value: number

    // Traffic Stats
    total_views: number
    monthly_views: number
    unique_visitors: number

    // Social Stats
    followers_count: number
    following_count: number

    // Performance
    response_rate: number           // 0-100 %
    response_time_avg: number       // minutes
    on_time_delivery_rate: number   // 0-100 %
    return_rate: number             // 0-100 %

    // Last updated
    last_calculated: Date
}

export interface ShopRatings {
    overall: number                 // 0-5
    total_reviews: number
    rating_distribution: {
        five: number
        four: number
        three: number
        two: number
        one: number
    }
    product_quality: number
    communication: number
    shipping_speed: number
    packaging: number
    accuracy: number
    value_for_money: number
    rating_trend: 'improving' | 'stable' | 'declining'
}

export interface ShopTrustScore {
    overall_score: number           // 0-100
    breakdown: {
        verification: number        // จากการยืนยันตัวตน
        sales_history: number       // จากประวัติการขาย
        ratings: number             // จากรีวิว
        response: number            // จากการตอบกลับ
        delivery: number            // จากการส่งมอบ
    }
    badges: ShopBadge[]
    trust_level: 'new' | 'basic' | 'trusted' | 'verified' | 'top_trusted'
    last_calculated: Date
}

export interface ShopSettings {
    // Operating Hours
    operating_hours?: {
        timezone: string
        schedule: {
            [key in 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday']: {
                is_open: boolean
                open_time?: string
                close_time?: string
            }
        }
    }

    // Auto Reply
    auto_reply: {
        enabled: boolean
        message?: string
        outside_hours_message?: string
        delay_seconds?: number
    }

    // Vacation Mode
    vacation_mode: {
        enabled: boolean
        start_date?: Date
        end_date?: Date
        message?: string
        auto_decline_orders: boolean
    }

    // Notification Preferences
    notifications: {
        new_order: boolean
        new_message: boolean
        new_follower: boolean
        low_stock: boolean
        review: boolean
        promotion: boolean
    }

    // Return Policy
    return_policy?: string
    warranty_policy?: string

    // Order Settings
    order_settings: {
        auto_confirm_hours?: number
        require_payment_first: boolean
        allow_offers: boolean
        min_offer_percentage?: number
    }
}

export interface ShopPromotion {
    id: string
    title: string
    title_en?: string
    code: string
    discount_type: 'percentage' | 'fixed' | 'free_shipping'
    discount_value: number
    min_purchase?: number
    max_discount?: number
    applicable_products?: string[]
    applicable_categories?: string[]
    start_date: Date
    end_date: Date
    usage_limit?: number
    usage_count: number
    is_active: boolean
    created_at: Date
}

/**
 * Main Shop Profile Document
 * Firestore Collection: shops/{shopId}
 */
export interface Shop {
    // Core Identity
    id: string
    owner_id: string                // Firebase Auth UID
    type: ShopType
    status: ShopStatus
    visibility: ShopVisibility

    // Basic Info
    name: string
    slug: string                    // URL-friendly: /shop/[slug]
    tagline?: string
    description: string
    short_description?: string

    // Branding
    branding: ShopBranding

    // Location
    location: ShopLocation

    // Contact
    contact: ShopContact

    // Rating & Trust
    ratings: ShopRatings
    trust_score: ShopTrustScore

    // Statistics
    stats: ShopStats

    // Seller Tier (from member system)
    seller_tier: SellerTier
    seller_tier_points: number

    // JaiStar Integration
    jaistar_account_id?: string
    jaistar_balance?: number        // Cached balance

    // Verification
    verification: {
        status: SellerVerificationStatus
        phone_verified: boolean
        id_verified: boolean
        business_verified: boolean
        verified_at?: Date
        verified_by?: string
    }

    // Settings
    settings: ShopSettings

    // Active Promotions
    promotions: ShopPromotion[]

    // Categories (for filtering)
    main_categories: number[]       // Category IDs

    // Badges
    badges: ShopBadge[]

    // SEO
    seo?: {
        meta_title?: string
        meta_description?: string
        keywords?: string[]
    }

    // Metadata
    created_at: Date
    updated_at: Date
    last_active: Date
    last_product_added?: Date
    last_order_received?: Date
}

// ==========================================
// SHOP FOLLOWER (Firestore: shop_followers/{id})
// ==========================================

export interface ShopFollower {
    id: string
    shop_id: string
    user_id: string
    followed_at: Date
    notifications_enabled: boolean
    source: 'shop_page' | 'product_page' | 'search' | 'recommendation'
}

// ==========================================
// SHOP CATEGORY (Firestore: shops/{shopId}/categories/{categoryId})
// ==========================================

export interface ShopCategory {
    id: string
    shop_id: string
    name: string
    name_en?: string
    slug: string
    description?: string
    image_url?: string
    parent_id?: string
    order: number
    product_count: number
    is_active: boolean
    created_at: Date
    updated_at: Date
}

// ==========================================
// SHOP REVIEW (Firestore: shop_reviews/{reviewId})
// ==========================================

export interface ShopReviewMedia {
    type: 'image' | 'video'
    url: string
    thumbnail_url?: string
}

export interface ShopReview {
    id: string
    shop_id: string
    order_id: string
    product_id: string
    reviewer_id: string
    reviewer_name: string
    reviewer_avatar?: string

    // Ratings
    overall_rating: number          // 1-5
    ratings: {
        product_quality: number
        communication: number
        shipping_speed: number
        packaging: number
        accuracy: number
        value_for_money: number
    }

    // Content
    title?: string
    content: string
    media?: ShopReviewMedia[]

    // Seller Response
    seller_response?: {
        content: string
        responded_at: Date
    }

    // Flags
    is_verified_purchase: boolean
    is_featured: boolean
    is_helpful_count: number

    // Status
    status: 'pending' | 'published' | 'hidden' | 'removed'

    created_at: Date
    updated_at: Date
}

// ==========================================
// SHOP ANALYTICS (Firestore: shops/{shopId}/analytics/{period})
// ==========================================

export interface ShopDailyAnalytics {
    id: string
    shop_id: string
    date: string                    // YYYY-MM-DD

    // Traffic
    views: number
    unique_visitors: number
    product_views: number

    // Engagement
    messages_received: number
    offers_received: number
    favorites_added: number
    shares: number

    // Sales
    orders: number
    revenue: number
    avg_order_value: number
    items_sold: number

    // Conversion
    conversion_rate: number
    cart_abandonment_rate: number

    // Sources
    traffic_sources: {
        direct: number
        search: number
        homepage: number
        category: number
        recommendation: number
        social: number
        external: number
    }

    // Top Products
    top_products: {
        product_id: string
        views: number
        sales: number
    }[]

    created_at: Date
}

// ==========================================
// SHOP NOTIFICATION (Firestore: shop_notifications/{id})
// ==========================================

export type ShopNotificationType =
    | 'new_order'
    | 'order_paid'
    | 'order_shipped'
    | 'order_delivered'
    | 'order_cancelled'
    | 'new_message'
    | 'new_follower'
    | 'new_review'
    | 'promotion_expiring'
    | 'low_stock'
    | 'tier_upgrade'
    | 'badge_earned'
    | 'payment_received'
    | 'system_announcement'

export interface ShopNotification {
    id: string
    shop_id: string
    type: ShopNotificationType
    title: string
    message: string
    icon?: string
    action_url?: string
    reference_id?: string
    is_read: boolean
    created_at: Date
}

// ==========================================
// SHOP REPORT (Firestore: shop_reports/{id})
// ==========================================

export type ShopReportReason =
    | 'fake_products'
    | 'misleading_info'
    | 'inappropriate_content'
    | 'scam'
    | 'counterfeit'
    | 'harassment'
    | 'late_delivery'
    | 'poor_quality'
    | 'other'

export interface ShopReport {
    id: string
    shop_id: string
    reporter_id: string
    reason: ShopReportReason
    description: string
    evidence?: string[]             // Image URLs
    related_order_id?: string
    related_product_id?: string
    status: 'pending' | 'investigating' | 'resolved' | 'dismissed'
    admin_notes?: string
    resolved_at?: Date
    resolved_by?: string
    created_at: Date
}

// ==========================================
// SHOP CREATION WIZARD
// ==========================================

export interface ShopCreationInput {
    name: string
    slug: string
    type: ShopType
    tagline?: string
    description: string
    logo_url?: string
    location: {
        province: string
        amphoe?: string
    }
    contact: {
        phone?: string
        line_id?: string
    }
    main_categories: number[]
}

export interface ShopUpdateInput {
    name?: string
    tagline?: string
    description?: string
    short_description?: string
    branding?: Partial<ShopBranding>
    location?: Partial<ShopLocation>
    contact?: Partial<ShopContact>
    settings?: Partial<ShopSettings>
    main_categories?: number[]
    seo?: Shop['seo']
}

// ==========================================
// SHOP SERVICE RESPONSE TYPES
// ==========================================

export interface ShopListResponse {
    shops: Shop[]
    total: number
    page: number
    pageSize: number
    hasMore: boolean
}

export interface ShopDetailResponse {
    shop: Shop
    products: any[]                 // Product[]
    promotions: ShopPromotion[]
    reviews: ShopReview[]
    isFollowing: boolean
    similarShops: Shop[]
}

export interface ShopDashboardResponse {
    shop: Shop
    stats: ShopStats
    recentOrders: any[]             // Order[]
    recentReviews: ShopReview[]
    notifications: ShopNotification[]
    analytics: ShopDailyAnalytics[]
    aiInsights?: AIInsights
}

// ==========================================
// SHOP TIER BENEFITS (Display)
// ==========================================

export const SHOP_TYPE_DISPLAY = {
    individual: {
        name: 'Individual Seller',
        name_th: 'ผู้ขายทั่วไป',
        icon: '👤',
        color: 'gray',
        has_storefront: false,
        badge: null
    },
    general_store: {
        name: 'General Store',
        name_th: 'ร้านค้าทั่วไป',
        icon: '🏪',
        color: 'blue',
        has_storefront: true,
        badge: 'verified'
    },
    official_store: {
        name: 'Official Store',
        name_th: 'ร้านค้าทางการ',
        icon: '🏢',
        color: 'purple',
        has_storefront: true,
        badge: 'official'
    }
} as const

// ==========================================
// EXPORTS
// ==========================================

export type {
    ShopType,
    ShopStatus,
    ShopVisibility,
    Shop,
    ShopLocation,
    ShopContact,
    ShopBranding,
    ShopBadge,
    ShopStats,
    ShopRatings,
    ShopTrustScore,
    ShopSettings,
    ShopPromotion,
    ShopFollower,
    ShopCategory,
    ShopReview,
    ShopDailyAnalytics,
    ShopNotification,
    ShopReport,
    ShopCreationInput,
    ShopUpdateInput
}
