/**
 * UNIFIED SELLER TYPES
 * 
 * Single Source of Truth สำหรับ Seller types ทั้งหมด
 * 
 * @version 2.0.0
 * @created 2025-12-30
 */

// ===== SELLER VERIFICATION STATUS =====
export type SellerVerificationStatus = 'unverified' | 'pending' | 'verified'
export type SellerLevel = 'new' | 'standard' | 'pro' | 'official'

// ===== SELLER PROFILE (Real-time) =====
/**
 * Full seller profile fetched in real-time
 * Use this for accurate, up-to-date seller information
 */
export interface SellerProfile {
    id: string

    // Basic Info
    name: string
    avatar?: string
    cover_url?: string

    // Verification
    verified: boolean
    phone_verified: boolean
    email_verified: boolean
    id_verified: boolean
    verification_status?: SellerVerificationStatus

    // Trust & Level
    trust_score: number             // 0-100
    seller_level?: SellerLevel
    badges: string[]

    // Response Metrics
    response_time_minutes: number
    response_rate: number           // 0-100

    // Listing Stats (Real-time calculated)
    total_listings: number
    active_listings: number

    // Sales Stats
    successful_sales: number
    rating_avg?: number             // 0-5
    rating_count?: number

    // Social
    followers_count: number
    following_count: number

    // Location
    location?: string               // Province or formatted address
    province?: string
    district?: string

    // Timestamps
    member_since: Date | string
    last_active?: Date | string
    created_at?: Date | string
    updated_at?: Date | string
}

// ===== SELLER LISTING (Summary) =====
/**
 * Listing summary for display in seller's other listings
 */
export interface SellerListing {
    id: string
    slug: string
    title: string
    price: number
    thumbnail_url: string
    created_at: Date | string
    views?: number
    status: string
    category_id?: number
    category_type?: string
}

// ===== SELLER STATS =====
/**
 * Aggregated seller statistics
 */
export interface SellerStats {
    total_listings: number
    active_listings: number
    sold_listings: number
    total_views: number
    total_favorites: number
    total_inquiries: number
    response_rate: number
    avg_response_time_minutes: number
    trust_score: number
    rating_avg: number
    rating_count: number
}

// ===== SELLER STORE (Shop Profile) =====
/**
 * Extended store information for sellers with shops
 */
export interface SellerStore {
    id: string
    owner_id: string
    user_id?: string                // Legacy alias

    // Shop Identity
    slug: string
    name: string
    name_en?: string
    shop_name?: string              // Legacy alias
    shop_slug?: string              // Legacy alias
    type: 'general' | 'official'

    // Branding
    logo_url?: string
    shop_logo?: string              // Legacy alias
    cover_url?: string
    tagline?: string
    description?: string
    description_th?: string
    description_en?: string

    // Theme
    theme_settings?: {
        primary_color: string
        template_id: 'standard' | 'minimal' | 'brand-focus'
        banner_images: string[]
    }

    // Verification
    verified_status: SellerVerificationStatus
    is_verified_seller?: boolean    // Legacy
    trust_score: number
    seller_level: SellerLevel
    badges: string[]

    // Progress
    onboarding_progress: number     // 0-7

    // Contact
    contact_email?: string
    contact_phone?: string
    location?: {
        province: string
        district: string
        formatted_address: string
        coordinates?: { lat: number; lng: number }
    }

    // Shipping
    shipping_fee_default?: number
    free_shipping_min?: number
    shipping_info?: {
        methods: string[]
        avg_prep_time_hours: number
        return_policy: string
    }

    // Stats
    followers_count: number
    sales_count: number
    rating_avg: number
    rating_count?: number
    response_rate: number
    response_time_minutes?: number

    // Timestamps
    created_at: Date | string
    updated_at: Date | string
}

// ===== SELLER FOLLOW =====
export interface SellerFollow {
    follower_id: string
    following_id: string
    created_at: Date | string
}

// ===== SELLER NOTIFICATION PREFERENCES =====
export interface SellerNotificationPreferences {
    new_inquiry: boolean
    new_offer: boolean
    new_follower: boolean
    new_review: boolean
    listing_expiring: boolean
    price_drop_suggestion: boolean
    weekly_stats: boolean
}

// ===== CREATE SELLER PROFILE INPUT =====
export interface CreateSellerProfileInput {
    shop_name: string
    shop_description?: string
    shop_description_th?: string
    shop_description_en?: string
    shop_logo?: string
    is_verified?: boolean
    address?: {
        detail?: string
        subdistrict?: string
        district?: string
        province?: string
        zipcode?: string
    }
}

// ===== UPDATE SELLER PROFILE INPUT =====
export interface UpdateSellerProfileInput extends Partial<CreateSellerProfileInput> {
    tagline?: string
    cover_url?: string
    contact_email?: string
    contact_phone?: string
    theme_settings?: SellerStore['theme_settings']
    shipping_info?: SellerStore['shipping_info']
}

// ===== SELLER DASHBOARD STATS =====
export interface SellerDashboardStats {
    // Today
    today_views: number
    today_inquiries: number
    today_offers: number

    // This Week
    week_views: number
    week_inquiries: number
    week_sales: number
    week_revenue: number

    // This Month
    month_views: number
    month_inquiries: number
    month_sales: number
    month_revenue: number

    // Trending
    trending_products: string[]     // Product IDs sorted by views
    low_performing: string[]        // Products needing attention
}

// ===== SELLER PAYOUT =====
export interface SellerPayout {
    id: string
    seller_id: string
    amount: number
    fee: number
    net_amount: number
    status: 'pending' | 'processing' | 'completed' | 'failed'
    bank_account: {
        bank_name: string
        account_number: string
        account_name: string
    }
    created_at: Date | string
    processed_at?: Date | string
}

// ===== Backward Compatibility =====
// These aliases ensure existing code continues to work
export type Seller = SellerProfile
export type SellerData = SellerProfile
export type Store = SellerStore
