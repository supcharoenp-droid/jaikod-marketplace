/**
 * JaiKod Member System V2 - Complete Type Definitions
 * 
 * This file contains the comprehensive type system for the new
 * 3-tier seller structure:
 * 1. Individual Seller (ผู้ขายทั่วไป)
 * 2. General Store (ร้านค้าทั่วไป)
 * 3. Official Store (ร้านค้าทางการ)
 * 
 * Also includes CoinJai Wallet, Boost System, and Report System
 */

import { Address } from './index'
import { DetailedRatings, ShippingSettings, OperatingHours } from './seller.enhanced'

// ==========================================
// CORE ENUMS & TYPES
// ==========================================

/**
 * Seller Account Types - The 3-tier system
 */
export type SellerAccountType =
    | 'individual'      // ผู้ขายทั่วไป (like Kaidee, Facebook Marketplace)
    | 'general_store'   // ร้านค้าทั่วไป (like Shopee regular store)
    | 'official_store'  // ร้านค้าทางการ (like Shopee Mall, Lazada Mall)

/**
 * Seller verification levels
 */
export type SellerVerificationStatus =
    | 'unverified'           // ยังไม่ยืนยัน
    | 'phone_verified'       // ยืนยันเบอร์โทรแล้ว
    | 'id_verified'          // ยืนยันบัตรประชาชนแล้ว
    | 'business_verified'    // ยืนยันธุรกิจแล้ว (Official Store only)

/**
 * Product/Listing condition for used items
 */
export type ItemCondition =
    | 'new'           // ใหม่
    | 'like_new'      // เหมือนใหม่
    | 'good'          // ดี
    | 'fair'          // พอใช้
    | 'for_parts'     // ใช้เป็นอะไหล่

/**
 * Listing status
 */
export type ListingStatus =
    | 'draft'         // ฉบับร่าง
    | 'pending'       // รอตรวจสอบ
    | 'active'        // กำลังขาย
    | 'reserved'      // จองแล้ว
    | 'sold'          // ขายแล้ว
    | 'expired'       // หมดอายุ
    | 'removed'       // ถูกลบ
    | 'suspended'     // ถูกระงับ

// ==========================================
// SELLER ACCOUNT CONFIGURATION
// ==========================================

export interface SellerPermissions {
    can_have_storefront: boolean
    can_customize_theme: boolean
    can_create_coupons: boolean
    can_run_flash_sale: boolean
    can_use_api: boolean
    can_add_custom_fields: boolean
    max_products: number | 'unlimited'
    max_images_per_product: number
    max_video_per_product: number
}

export interface SellerRequirements {
    min_kyc_level: SellerVerificationStatus
    needs_business_documents: boolean
    needs_bank_verification: boolean
}

export interface SellerAccountConfig {
    type: SellerAccountType
    name: string
    name_th: string
    description: string
    icon: string

    // Permissions
    permissions: SellerPermissions

    // Fees
    commission_rate: number     // % ค่าคอมมิชชั่น
    listing_fee: number         // ค่าลงขาย
    boost_discount: number      // % ส่วนลด Boost

    // Requirements
    requirements: SellerRequirements

    // Benefits
    benefits: string[]

    // UI
    badge_color: string
}

/**
 * Configuration for each seller type
 */
export const SELLER_TYPE_CONFIG: Record<SellerAccountType, SellerAccountConfig> = {
    individual: {
        type: 'individual',
        name: 'Individual Seller',
        name_th: 'ผู้ขายทั่วไป',
        description: 'สำหรับขายสินค้ามือสอง หรือ ขายสินค้าเป็นครั้งคราว',
        icon: '👤',
        permissions: {
            can_have_storefront: false,
            can_customize_theme: false,
            can_create_coupons: false,
            can_run_flash_sale: false,
            can_use_api: false,
            can_add_custom_fields: false,
            max_products: 'unlimited',
            max_images_per_product: 10,
            max_video_per_product: 1
        },
        commission_rate: 5.0,
        listing_fee: 0,
        boost_discount: 0,
        requirements: {
            min_kyc_level: 'phone_verified',
            needs_business_documents: false,
            needs_bank_verification: false
        },
        benefits: [
            'ลงขายได้ฟรี ไม่จำกัดจำนวน',
            'ใช้ AI วิเคราะห์ราคาฟรี',
            'Chat กับผู้ซื้อได้',
            'ถอนเงินผ่าน PromptPay ได้'
        ],
        badge_color: 'gray'
    },

    general_store: {
        type: 'general_store',
        name: 'General Store',
        name_th: 'ร้านค้าทั่วไป',
        description: 'สำหรับผู้ขายที่ต้องการเปิดร้านค้าออนไลน์',
        icon: '🏪',
        permissions: {
            can_have_storefront: true,
            can_customize_theme: false,
            can_create_coupons: true,
            can_run_flash_sale: false,
            can_use_api: false,
            can_add_custom_fields: true,
            max_products: 'unlimited',
            max_images_per_product: 15,
            max_video_per_product: 2
        },
        commission_rate: 4.0,
        listing_fee: 0,
        boost_discount: 10,
        requirements: {
            min_kyc_level: 'id_verified',
            needs_business_documents: false,
            needs_bank_verification: true
        },
        benefits: [
            'มีหน้าร้านเป็นของตัวเอง',
            'โลโก้และปกร้านค้า',
            'สร้างหมวดหมู่สินค้าในร้าน',
            'จัดการคลังสินค้า (Stock)',
            'สร้างคูปองส่วนลด',
            'ลดค่าคอม 1%',
            'ส่วนลด Boost 10%',
            'AI Insights ฟรี'
        ],
        badge_color: 'blue'
    },

    official_store: {
        type: 'official_store',
        name: 'Official Store',
        name_th: 'ร้านค้าทางการ',
        description: 'สำหรับแบรนด์และธุรกิจที่จดทะเบียน',
        icon: '🏢',
        permissions: {
            can_have_storefront: true,
            can_customize_theme: true,
            can_create_coupons: true,
            can_run_flash_sale: true,
            can_use_api: true,
            can_add_custom_fields: true,
            max_products: 'unlimited',
            max_images_per_product: 20,
            max_video_per_product: 5
        },
        commission_rate: 3.0,
        listing_fee: 0,
        boost_discount: 25,
        requirements: {
            min_kyc_level: 'business_verified',
            needs_business_documents: true,
            needs_bank_verification: true
        },
        benefits: [
            'ป้าย "ร้านค้าทางการ" (Verified Badge)',
            'ปรับแต่งธีมร้านค้าได้',
            'สร้าง Flash Sale ได้',
            'เชื่อมต่อ API จัดการสต๊อก',
            'รายงานขั้นสูง + AI Premium',
            'ลดค่าคอม 2%',
            'ส่วนลด Boost 25%',
            'Priority Support 24/7',
            'Account Manager เฉพาะ'
        ],
        badge_color: 'purple'
    }
}

// ==========================================
// INDIVIDUAL SELLER (แบบที่ 1)
// ==========================================

export interface NotificationPreferences {
    new_message: boolean
    new_offer: boolean
    price_drop_alert: boolean
    listing_expiry: boolean
    boost_reminder: boolean
    marketing: boolean
}

export interface IndividualSellerVerification {
    status: SellerVerificationStatus
    phone_verified_at?: Date
    id_verified_at?: Date
    verified_by?: 'ai' | 'manual'
    id_document_url?: string  // Encrypted
}

export interface IndividualSellerRatings {
    overall: number           // 0-5
    total_reviews: number
    response_rate: number     // 0-100 %
    response_time_avg: number // minutes
    positive_rate: number     // 0-100 %
    rating_distribution: {
        five: number
        four: number
        three: number
        two: number
        one: number
    }
}

export interface IndividualSellerStats {
    total_listings: number
    active_listings: number
    sold_items: number
    total_views: number
    total_chats: number
    total_revenue: number
    joined_at: Date
    last_active: Date
}

export interface IndividualSellerSettings {
    auto_reply_enabled: boolean
    auto_reply_message?: string
    accept_offers: boolean
    min_offer_percentage: number // e.g., 80 = accepts offers 80%+ of asking price
    show_phone_to_verified: boolean
    notification_preferences: NotificationPreferences
}

/**
 * Individual Seller Profile
 * For users who sell items occasionally (C2C)
 */
export interface IndividualSeller {
    id: string
    user_id: string
    account_type: 'individual'

    // Basic Profile
    display_name: string
    avatar_url?: string
    bio?: string
    phone_verified: boolean

    // Location
    location: {
        province: string
        amphoe?: string
        district?: string
        zipcode?: string
        coordinates?: { lat: number, lng: number }
        show_approximate_location: boolean
    }

    // Verification
    verification: IndividualSellerVerification

    // Ratings & Trust
    ratings: IndividualSellerRatings

    // Activity Stats
    stats: IndividualSellerStats

    // CoinJai Reference
    coinjai_wallet_id: string

    // Settings
    settings: IndividualSellerSettings

    // Metadata
    created_at: Date
    updated_at: Date
}

// ==========================================
// INDIVIDUAL LISTING
// ==========================================

export interface ListingImage {
    id: string
    url: string
    thumbnail_url: string
    order: number
    is_primary: boolean
    width?: number
    height?: number
    blurhash?: string
}

export interface ListingLocation {
    province: string
    amphoe?: string
    district?: string
    zipcode?: string
    coordinates?: { lat: number, lng: number }
    show_map: boolean
}

export interface ListingVisibility {
    views: number
    unique_visitors: number
    saved_count: number
    chat_count: number
    share_count: number
    last_viewed_at?: Date
}

export interface ListingBoostInfo {
    is_boosted: boolean
    boost_id?: string
    boost_type?: BoostType
    boost_started_at?: Date
    boost_expires_at?: Date
    boost_position?: number  // Position in boosted listings
}

export interface ListingAIAnalysis {
    suggested_price: {
        min: number
        max: number
        suggested: number
        confidence: number
    }
    category_confidence: number
    detected_brand?: string
    detected_model?: string
    keywords: string[]
    quality_score: number
    improvement_tips: string[]
    analyzed_at: Date
}

/**
 * Individual Listing - For C2C marketplace listings
 */
export interface IndividualListing {
    id: string
    seller_id: string
    seller_type: 'individual'

    // Basic Info
    title: string
    description: string
    category_id: number
    subcategory_id?: number

    // Condition
    condition: ItemCondition
    condition_notes?: string

    // Price
    price: number
    original_price?: number
    currency: 'THB'
    negotiable: boolean
    min_acceptable_price?: number  // For offer filtering

    // Media
    images: ListingImage[]
    video_url?: string

    // Location
    location: ListingLocation

    // Status
    status: ListingStatus
    status_changed_at?: Date
    sold_at?: Date
    buyer_id?: string

    // Visibility & Boost
    visibility: ListingVisibility
    boost: ListingBoostInfo

    // AI Analysis
    ai_analysis?: ListingAIAnalysis

    // Tags & SEO
    tags?: string[]
    seo_keywords?: string[]

    // Shipping Options
    shipping_options: {
        seller_ships: boolean
        buyer_pickup: boolean
        meetup_allowed: boolean
        shipping_cost?: number
        free_shipping: boolean
    }

    // Metadata
    source: 'app' | 'web' | 'api'
    created_at: Date
    updated_at: Date
    expires_at: Date
    bumped_at?: Date  // Last time it was bumped to top
}

// ==========================================
// STORE SELLER (แบบที่ 2)
// ==========================================

export interface StoreTheme {
    id: string
    name: string
    primary_color: string
    secondary_color: string
    accent_color?: string
    layout: 'default' | 'minimal' | 'premium' | 'gallery'
    font_family?: string
    custom_css?: string
}

export interface StoreCategory {
    id: string
    name: string
    name_en?: string
    slug: string
    parent_id?: string
    order: number
    product_count: number
    image_url?: string
    is_active: boolean
}

export interface StoreInventorySettings {
    enabled: boolean
    low_stock_threshold: number
    auto_deactivate_when_out: boolean
    sku_prefix?: string
    track_variants: boolean
}

export interface CustomFormField {
    id: string
    name: string
    name_en?: string
    type: 'text' | 'number' | 'select' | 'multiselect' | 'boolean' | 'date'
    options?: { value: string, label: string, label_en?: string }[]
    required: boolean
    placeholder?: string
    validation?: {
        min?: number
        max?: number
        pattern?: string
    }
    category_ids?: number[]  // Apply to specific categories only
    order: number
}

export interface StoreBusinessVerification {
    status: 'not_started' | 'pending' | 'under_review' | 'verified' | 'rejected'
    company_name: string
    registration_number: string  // เลขทะเบียนนิติบุคคล
    tax_id: string               // เลขประจำตัวผู้เสียภาษี 13 หลัก
    business_type: 'sole_proprietor' | 'partnership' | 'company_limited' | 'public_company'
    business_category?: string
    verified_at?: Date
    verified_by?: string
    rejection_reason?: string
    documents: {
        type: 'registration_cert' | 'tax_cert' | 'id_card' | 'authorization_letter' | 'company_seal'
        url: string
        uploaded_at: Date
        verified: boolean
        verification_notes?: string
    }[]
}

export interface StoreReceipt {
    enabled: boolean
    company_name?: string
    address?: string
    tax_id?: string
    phone?: string
    logo_url?: string
    footer_message?: string
}

export interface StoreSettings {
    operating_hours?: OperatingHours
    shipping: ShippingSettings
    return_policy?: string
    warranty_policy?: string
    privacy_policy?: string
    terms_of_service?: string
    receipt: StoreReceipt
    auto_reply: {
        enabled: boolean
        message?: string
        outside_hours_message?: string
        delay_seconds?: number
    }
    vacation_mode: {
        enabled: boolean
        start_date?: Date
        end_date?: Date
        message?: string
        auto_decline_orders: boolean
    }
    order_settings: {
        auto_confirm_after_hours?: number
        auto_cancel_unpaid_after_hours?: number
        require_payment_before_confirm: boolean
    }
}

export interface StoreBadge {
    type: 'official' | 'verified' | 'top_seller' | 'fast_shipper' | 'eco_friendly' | 'recommended' | 'new_store'
    name: string
    name_th: string
    icon: string
    earned_at: Date
    expires_at?: Date
    is_visible: boolean
}

export interface StorePerformance {
    total_products: number
    active_products: number
    total_orders: number
    total_revenue: number
    avg_order_value: number
    return_rate: number
    fulfillment_rate: number
    on_time_delivery_rate: number
    response_time_avg: number
    response_rate: number
    review_response_rate: number
}

/**
 * Store Seller Profile
 * For General Store and Official Store
 */
export interface StoreSeller {
    id: string
    user_id: string
    account_type: 'general_store' | 'official_store'

    // Store Profile
    store: {
        name: string
        slug: string                // URL-friendly name
        description: string
        short_description?: string
        logo_url: string
        cover_url?: string
        banner_urls?: string[]      // Multiple banners for Official

        // Theme (Official only)
        theme?: StoreTheme

        // Contact
        email?: string
        phone?: string
        line_id?: string
        facebook_url?: string
        instagram_url?: string
        website_url?: string
    }

    // Verification (for Official Store)
    business_verification?: StoreBusinessVerification

    // Store Categories
    categories: StoreCategory[]

    // Inventory Management
    inventory: StoreInventorySettings

    // Custom Form Fields (for products)
    custom_fields: CustomFormField[]

    // Promotions Summary
    promotions: {
        active_coupons: number
        active_flash_sales: number
        active_bundles: number
        total_coupons_used: number
        total_discount_given: number
    }

    // Ratings & Performance
    ratings: DetailedRatings
    performance: StorePerformance

    // Follower System
    followers: {
        count: number
        new_this_week: number
        new_this_month: number
    }

    // CoinJai Reference
    coinjai_wallet_id: string

    // Settings
    settings: StoreSettings

    // Badges & Certifications
    badges: StoreBadge[]

    // Metadata
    created_at: Date
    updated_at: Date
    last_active: Date
    last_product_added?: Date
    last_order_received?: Date
}

// ==========================================
// STORE PRODUCT
// ==========================================

export interface ProductVariant {
    id: string
    name: string           // e.g., "Size", "Color"
    options: {
        id: string
        value: string        // e.g., "L", "Red"
        value_en?: string
        price_adjustment: number
        stock_quantity: number
        reserved_quantity?: number
        sku?: string
        image_url?: string
        is_available: boolean
    }[]
    is_required: boolean
}

export interface ProductInventory {
    sku?: string
    barcode?: string
    stock_quantity: number
    reserved_quantity: number
    sold_quantity: number
    low_stock_threshold?: number
    low_stock_alert: boolean
    allow_backorder: boolean
    max_purchase_quantity?: number
}

export interface ProductPricing {
    price: number
    original_price?: number       // ราคาก่อนลด
    cost_price?: number           // ต้นทุน (for profit calculation)
    sale_price?: number           // ราคาโปรโมชั่น
    sale_start_date?: Date
    sale_end_date?: Date
    bulk_pricing?: {
        min_quantity: number
        price_per_unit: number
    }[]
    wholesale_enabled: boolean
    wholesale_min_quantity?: number
    wholesale_price?: number
}

export interface ProductShipping {
    weight: number          // grams
    dimensions?: {
        length: number
        width: number
        height: number
    }
    free_shipping: boolean
    free_shipping_min_amount?: number
    shipping_methods: string[]
    additional_shipping_cost?: number
    fragile: boolean
}

export interface ProductSEO {
    meta_title?: string
    meta_description?: string
    keywords?: string[]
    canonical_url?: string
}

/**
 * Store Product - For Store Sellers
 */
export interface StoreProduct {
    id: string
    store_id: string
    seller_id: string
    seller_type: 'general_store' | 'official_store'

    // Basic Info
    title: string
    description: string
    category_id: number
    subcategory_id?: number
    store_category_id?: string  // Store's internal category

    // Brand & Model
    brand?: string
    model?: string

    // Condition (for used items, optional for stores)
    condition?: ItemCondition

    // Media
    images: ListingImage[]
    video_urls?: string[]

    // Pricing
    pricing: ProductPricing
    currency: 'THB'

    // Inventory
    inventory: ProductInventory

    // Variants
    has_variants: boolean
    variants?: ProductVariant[]

    // Custom Fields
    custom_field_values?: Record<string, any>

    // Shipping
    shipping: ProductShipping

    // Status
    status: ListingStatus

    // Visibility
    visibility: ListingVisibility
    boost: ListingBoostInfo

    // AI Analysis
    ai_analysis?: ListingAIAnalysis

    // SEO
    seo?: ProductSEO

    // Tags
    tags?: string[]

    // Related Products
    related_product_ids?: string[]

    // Warranty & Returns
    warranty?: {
        has_warranty: boolean
        duration_months?: number
        description?: string
    }

    // Metadata
    source: 'app' | 'web' | 'api' | 'import'
    created_at: Date
    updated_at: Date
    published_at?: Date
}

// ==========================================
// COINJAI WALLET SYSTEM
// ==========================================

export interface CoinJaiWalletSettings {
    auto_withdraw: boolean
    auto_withdraw_threshold?: number
    auto_withdraw_day?: number  // 1-28
    withdrawal_bank_account?: {
        bank_code: string
        bank_name: string
        account_number: string  // Last 4 digits shown, rest encrypted
        account_number_encrypted: string
        account_name: string
        verified: boolean
        verified_at?: Date
    }
}

/**
 * CoinJai Wallet - Virtual currency/wallet for JaiKod
 */
export interface CoinJaiWallet {
    id: string
    user_id: string

    // Balance
    balance: number              // Current available
    pending_balance: number      // From sales, not yet released
    frozen_balance: number       // Under dispute

    // Lifetime Stats
    total_earned: number         // From sales
    total_deposited: number      // Top-ups
    total_spent: number          // Boosts, ads, purchases
    total_withdrawn: number      // To bank
    total_bonus: number          // Promotions, referrals

    // Last Activities
    last_transaction_at?: Date
    last_topup_at?: Date
    last_withdraw_at?: Date

    // Limits
    daily_withdraw_limit: number
    monthly_withdraw_limit: number
    daily_withdrawn_today: number
    monthly_withdrawn_this_month: number

    // Settings
    settings: CoinJaiWalletSettings

    // Security
    pin_hash?: string  // For withdrawals
    pin_attempts: number
    locked_until?: Date

    created_at: Date
    updated_at: Date
}

export type CoinJaiTransactionType =
    | 'topup'             // เติมเงิน
    | 'withdraw'          // ถอนเงิน
    | 'boost_payment'     // จ่ายค่า Boost
    | 'ad_payment'        // จ่ายค่าโฆษณา  
    | 'sale_income'       // รายได้จากขาย
    | 'sale_commission'   // หักค่าคอมมิชชั่น
    | 'refund_out'        // คืนเงินให้ผู้ซื้อ
    | 'refund_in'         // รับเงินคืน
    | 'bonus'             // โบนัส/โปรโมชั่น
    | 'referral_bonus'    // โบนัสแนะนำเพื่อน
    | 'fee'               // ค่าธรรมเนียม
    | 'transfer_in'       // รับโอน
    | 'transfer_out'      // โอนออก
    | 'adjustment'        // ปรับยอด (admin)

export type CoinJaiTransactionStatus =
    | 'pending'
    | 'processing'
    | 'completed'
    | 'failed'
    | 'cancelled'
    | 'reversed'

export interface CoinJaiTransaction {
    id: string
    wallet_id: string

    type: CoinJaiTransactionType
    amount: number
    fee?: number
    net_amount: number
    balance_before: number
    balance_after: number

    // Reference
    reference_type?: 'listing' | 'product' | 'order' | 'boost' | 'ad' | 'withdrawal' | 'topup' | 'refund'
    reference_id?: string

    // Description
    title: string
    title_en?: string
    description?: string

    // Status
    status: CoinJaiTransactionStatus

    // For topups
    payment_method?: 'credit_card' | 'debit_card' | 'promptpay' | 'bank_transfer' | 'truemoney' | 'rabbit_line_pay'
    payment_ref?: string
    payment_gateway_ref?: string

    // For withdrawals
    withdrawal_method?: 'bank_transfer' | 'promptpay'
    withdrawal_account?: string  // Last 4 digits

    // Error handling
    error_code?: string
    error_message?: string
    retry_count?: number

    // Metadata
    ip_address?: string
    user_agent?: string
    created_at: Date
    processed_at?: Date
    completed_at?: Date
    metadata?: Record<string, any>
}

// Top-up packages
export interface CoinJaiTopupPackage {
    id: string
    amount: number
    bonus_amount: number
    bonus_percentage: number
    price: number
    popular: boolean
    best_value: boolean
    icon: string
    limited_time?: {
        ends_at: Date
        original_bonus: number
    }
}

export const COINJAI_TOPUP_PACKAGES: CoinJaiTopupPackage[] = [
    { id: 'pack_50', amount: 50, bonus_amount: 0, bonus_percentage: 0, price: 50, popular: false, best_value: false, icon: '🪙' },
    { id: 'pack_100', amount: 100, bonus_amount: 5, bonus_percentage: 5, price: 100, popular: false, best_value: false, icon: '🪙' },
    { id: 'pack_300', amount: 300, bonus_amount: 30, bonus_percentage: 10, price: 300, popular: true, best_value: false, icon: '💰' },
    { id: 'pack_500', amount: 500, bonus_amount: 75, bonus_percentage: 15, price: 500, popular: false, best_value: true, icon: '💰' },
    { id: 'pack_1000', amount: 1000, bonus_amount: 200, bonus_percentage: 20, price: 1000, popular: false, best_value: false, icon: '💎' },
    { id: 'pack_2000', amount: 2000, bonus_amount: 500, bonus_percentage: 25, price: 2000, popular: false, best_value: false, icon: '💎' }
]

// ==========================================
// BOOST SYSTEM
// ==========================================

export type BoostType = 'basic' | 'premium' | 'urgent' | 'homepage' | 'category_top'

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
    price_coinjai: number
    original_price?: number  // For discounts

    // Benefits
    visibility_multiplier: number    // e.g., 2x views
    position_boost: boolean          // Show higher in search
    highlight_badge: boolean         // Special badge on listing
    homepage_feature: boolean        // Feature on homepage
    category_feature: boolean        // Feature in category page

    // Visual
    badge_color: string
    badge_icon: string

    // Stats (historical averages)
    avg_view_increase: number        // %
    avg_inquiry_increase: number     // %

    // Availability
    is_active: boolean
    available_for: SellerAccountType[]
}

export const BOOST_PACKAGES: BoostPackage[] = [
    {
        id: 'basic_24h',
        type: 'basic',
        name: 'Basic Boost',
        name_th: 'Boost พื้นฐาน',
        description: '2x visibility for 24 hours',
        description_th: 'เพิ่มการมองเห็น 2 เท่า นาน 24 ชั่วโมง',
        duration_hours: 24,
        price_coinjai: 29,
        visibility_multiplier: 2,
        position_boost: true,
        highlight_badge: false,
        homepage_feature: false,
        category_feature: false,
        badge_color: '#3B82F6',
        badge_icon: '🚀',
        avg_view_increase: 150,
        avg_inquiry_increase: 80,
        is_active: true,
        available_for: ['individual', 'general_store', 'official_store']
    },
    {
        id: 'premium_48h',
        type: 'premium',
        name: 'Premium Boost',
        name_th: 'Boost พรีเมียม',
        description: '5x visibility + highlighted badge for 48 hours',
        description_th: 'เพิ่มการมองเห็น 5 เท่า + ป้ายพิเศษ นาน 48 ชั่วโมง',
        duration_hours: 48,
        price_coinjai: 79,
        visibility_multiplier: 5,
        position_boost: true,
        highlight_badge: true,
        homepage_feature: false,
        category_feature: true,
        badge_color: '#8B5CF6',
        badge_icon: '⭐',
        avg_view_increase: 400,
        avg_inquiry_increase: 200,
        is_active: true,
        available_for: ['individual', 'general_store', 'official_store']
    },
    {
        id: 'urgent_24h',
        type: 'urgent',
        name: 'Urgent Sale',
        name_th: 'ขายด่วน!',
        description: '"URGENT" badge + homepage feature for 24 hours',
        description_th: 'ป้าย "ขายด่วน" + แสดงบนหน้าแรก 24 ชั่วโมง',
        duration_hours: 24,
        price_coinjai: 149,
        visibility_multiplier: 10,
        position_boost: true,
        highlight_badge: true,
        homepage_feature: true,
        category_feature: true,
        badge_color: '#EF4444',
        badge_icon: '🔥',
        avg_view_increase: 800,
        avg_inquiry_increase: 400,
        is_active: true,
        available_for: ['individual', 'general_store', 'official_store']
    },
    {
        id: 'homepage_7d',
        type: 'homepage',
        name: 'Homepage Feature',
        name_th: 'แสดงหน้าแรก 7 วัน',
        description: 'Featured on homepage "Recommended" section for 7 days',
        description_th: 'แสดงบนหน้าแรก Section "สินค้าแนะนำ" 7 วัน',
        duration_hours: 168,
        price_coinjai: 299,
        visibility_multiplier: 15,
        position_boost: true,
        highlight_badge: true,
        homepage_feature: true,
        category_feature: true,
        badge_color: '#F59E0B',
        badge_icon: '👑',
        avg_view_increase: 2000,
        avg_inquiry_increase: 800,
        is_active: true,
        available_for: ['general_store', 'official_store']
    },
    {
        id: 'category_top_3d',
        type: 'category_top',
        name: 'Category Top',
        name_th: 'อันดับ 1 ในหมวด',
        description: 'Top position in category for 3 days',
        description_th: 'แสดงอันดับต้นๆ ในหมวดหมู่ 3 วัน',
        duration_hours: 72,
        price_coinjai: 199,
        visibility_multiplier: 8,
        position_boost: true,
        highlight_badge: true,
        homepage_feature: false,
        category_feature: true,
        badge_color: '#10B981',
        badge_icon: '📌',
        avg_view_increase: 600,
        avg_inquiry_increase: 300,
        is_active: true,
        available_for: ['general_store', 'official_store']
    }
]

export interface ListingBoost {
    id: string
    listing_id: string
    product_id?: string  // For store products
    seller_id: string
    seller_type: SellerAccountType

    package_id: string
    package: BoostPackage

    // Status
    status: 'pending' | 'active' | 'paused' | 'expired' | 'cancelled' | 'refunded'
    started_at?: Date
    expires_at?: Date
    paused_at?: Date
    cancelled_at?: Date

    // Payment
    amount_paid: number
    discount_applied?: number
    transaction_id: string

    // Performance
    stats: {
        views_before: number
        views_during: number
        unique_visitors_during: number
        inquiries_before: number
        inquiries_during: number
        saves_during: number
        shares_during: number
        conversion_rate?: number
    }

    // Position tracking
    avg_search_position?: number
    homepage_impressions?: number
    category_impressions?: number

    created_at: Date
    updated_at: Date
}

// ==========================================
// REPORT & MODERATION SYSTEM
// ==========================================

export type ListingReportReason =
    | 'fake_product'          // สินค้าปลอม/เลียนแบบ
    | 'misleading_info'       // ข้อมูลเป็นเท็จ/หลอกลวง
    | 'prohibited_item'       // สินค้าต้องห้าม
    | 'scam'                  // หลอกลวง/ฉ้อโกง
    | 'duplicate'             // โพสต์ซ้ำ
    | 'wrong_category'        // ผิดหมวดหมู่
    | 'spam'                  // สแปม/โฆษณา
    | 'inappropriate_content' // เนื้อหาไม่เหมาะสม
    | 'copyright'             // ละเมิดลิขสิทธิ์
    | 'price_manipulation'    // ราคาไม่ตรงความจริง
    | 'stolen_images'         // ใช้รูปคนอื่น
    | 'other'                 // อื่นๆ

export type SellerReportReason =
    | 'non_delivery'          // ไม่ส่งสินค้า
    | 'fraud'                 // หลอกลวง/ฉ้อโกง
    | 'harassment'            // คุกคาม/ก้าวร้าว
    | 'poor_communication'    // ไม่ตอบ/สื่อสารไม่ดี
    | 'fake_reviews'          // รีวิวปลอม
    | 'misrepresentation'     // สินค้าไม่ตรงปก
    | 'other'                 // อื่นๆ

export type ReportResolutionAction =
    | 'no_action'             // ไม่ดำเนินการ
    | 'warning_issued'        // ออกคำเตือน
    | 'listing_removed'       // ลบประกาศ
    | 'listing_edited'        // แก้ไขประกาศ
    | 'seller_warned'         // เตือนผู้ขาย
    | 'seller_suspended'      // ระงับผู้ขายชั่วคราว
    | 'seller_banned'         // แบนผู้ขายถาวร
    | 'escalated'             // ส่งต่อทีมอื่น

export interface ReportAIAnalysis {
    risk_score: number           // 0-100
    confidence: number           // 0-100
    category_match: boolean
    price_anomaly: boolean
    duplicates_found: string[]
    spam_probability: number
    image_analysis?: {
        watermark_detected: boolean
        stock_photo_detected: boolean
        similar_images: string[]
    }
    suggested_action: ReportResolutionAction
    analysis_notes: string[]
    analyzed_at: Date
}

export interface ReportResolution {
    action: ReportResolutionAction
    admin_id: string
    admin_name: string
    notes: string
    internal_notes?: string
    notify_reporter: boolean
    notify_reported: boolean
    ban_duration_days?: number
    ban_until?: Date
    resolved_at: Date
}

/**
 * Listing Report
 */
export interface ListingReport {
    id: string
    listing_id: string
    listing_title: string
    listing_seller_id: string

    reporter_id: string
    reporter_name?: string

    reason: ListingReportReason
    reason_other?: string
    description: string
    evidence_urls?: string[]

    // Status
    status: 'pending' | 'reviewing' | 'resolved' | 'dismissed' | 'escalated'
    priority: 'low' | 'medium' | 'high' | 'urgent'

    // Assignment
    assigned_to?: string
    assigned_at?: Date

    // AI Analysis
    ai_analysis?: ReportAIAnalysis

    // Resolution
    resolution?: ReportResolution

    // Timestamps
    created_at: Date
    first_viewed_at?: Date
    updated_at: Date
}

/**
 * Seller Report
 */
export interface SellerReport {
    id: string
    seller_id: string
    seller_name: string
    seller_type: SellerAccountType

    reporter_id: string
    reporter_name?: string

    reason: SellerReportReason
    reason_other?: string
    description: string

    // Related order (if applicable)
    order_id?: string
    order_amount?: number

    // Evidence
    evidence_urls?: string[]
    chat_log_url?: string

    // Status
    status: 'pending' | 'investigating' | 'resolved' | 'dismissed' | 'escalated'
    priority: 'low' | 'medium' | 'high' | 'urgent'

    // Assignment
    assigned_to?: string
    assigned_at?: Date

    // Resolution
    resolution?: ReportResolution

    // History
    previous_reports_count: number
    previous_warnings_count: number

    // Timestamps
    created_at: Date
    first_viewed_at?: Date
    updated_at: Date
}

// ==========================================
// SELLER REVIEW SYSTEM
// ==========================================

export interface SellerReviewRatings {
    overall: number           // 1-5
    product_accuracy: number  // สินค้าตรงตามที่ลง
    communication: number     // การสื่อสาร
    shipping_speed: number    // ความเร็วในการจัดส่ง
    packaging: number         // การบรรจุหีบห่อ
}

export interface SellerReview {
    id: string
    seller_id: string
    buyer_id: string
    order_id: string

    // Ratings
    ratings: SellerReviewRatings

    // Content
    comment: string
    pros?: string[]
    cons?: string[]

    // Media
    image_urls?: string[]
    video_url?: string

    // Product Reference
    product_id: string
    product_title: string
    product_image_url?: string

    // Verification
    is_verified_purchase: boolean
    purchase_date: Date

    // AI Analysis
    ai_analysis?: {
        sentiment: 'positive' | 'neutral' | 'negative'
        sentiment_score: number
        helpful_score: number
        spam_score: number
        keywords: string[]
    }

    // Engagement
    helpful_count: number
    not_helpful_count: number

    // Seller Response
    seller_response?: {
        content: string
        responded_at: Date
        is_edited: boolean
    }

    // Moderation
    status: 'pending' | 'approved' | 'rejected' | 'hidden'
    moderation_notes?: string

    // Display Options
    is_featured: boolean
    is_anonymous: boolean

    // Timestamps
    created_at: Date
    updated_at: Date
    approved_at?: Date
}

// ==========================================
// EXPORT UTILITIES
// ==========================================

/**
 * Get seller type config
 */
export function getSellerTypeConfig(type: SellerAccountType): SellerAccountConfig {
    return SELLER_TYPE_CONFIG[type]
}

/**
 * Check if seller can use feature
 */
export function canSellerUseFeature(
    type: SellerAccountType,
    feature: keyof SellerPermissions
): boolean {
    const config = SELLER_TYPE_CONFIG[type]
    const value = config.permissions[feature]
    return value === true || value === 'unlimited' || (typeof value === 'number' && value > 0)
}

/**
 * Get boost package by ID
 */
export function getBoostPackage(id: string): BoostPackage | undefined {
    return BOOST_PACKAGES.find(p => p.id === id)
}

/**
 * Get available boost packages for seller type
 */
export function getAvailableBoostPackages(sellerType: SellerAccountType): BoostPackage[] {
    return BOOST_PACKAGES.filter(p => p.is_active && p.available_for.includes(sellerType))
}

/**
 * Get topup package by ID
 */
export function getTopupPackage(id: string): CoinJaiTopupPackage | undefined {
    return COINJAI_TOPUP_PACKAGES.find(p => p.id === id)
}

/**
 * Calculate boost price with seller discount
 */
export function calculateBoostPrice(
    packageId: string,
    sellerType: SellerAccountType
): { original: number, discount: number, final: number } {
    const pkg = getBoostPackage(packageId)
    if (!pkg) return { original: 0, discount: 0, final: 0 }

    const config = SELLER_TYPE_CONFIG[sellerType]
    const discountRate = config.boost_discount / 100
    const discount = Math.floor(pkg.price_coinjai * discountRate)

    return {
        original: pkg.price_coinjai,
        discount,
        final: pkg.price_coinjai - discount
    }
}
