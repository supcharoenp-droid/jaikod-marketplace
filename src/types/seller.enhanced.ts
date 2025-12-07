/**
 * Enhanced Seller System - Complete Type Definitions
 * JaiKod Marketplace - AI-Native Platform
 * 
 * This file contains comprehensive seller types including:
 * - Enhanced Rating System
 * - Performance Metrics
 * - Tier System
 * - Business Information
 * - AI-Powered Insights
 */

import { Address } from './index'

// ==========================================
// ENHANCED RATING SYSTEM
// ==========================================

export interface DetailedRatings {
    // Overall
    overall: number // 0-5 (average of all)
    total_reviews: number

    // Breakdown (each 0-5)
    product_quality: number // คุณภาพสินค้า
    communication: number // การสื่อสาร
    shipping_speed: number // ความเร็วจัดส่ง
    packaging: number // การบรรจุภัณฑ์
    accuracy: number // ตรงตามรายละเอียด
    value_for_money: number // คุ้มค่า

    // Distribution
    rating_distribution: {
        five_star: number
        four_star: number
        three_star: number
        two_star: number
        one_star: number
    }

    // Trends
    rating_trend: 'improving' | 'stable' | 'declining'
    last_30_days_avg: number
    last_90_days_avg: number

    last_updated: Date
}

// ==========================================
// SELLER PERFORMANCE METRICS
// ==========================================

export interface SellerPerformance {
    // Sales Metrics
    total_sales: number // จำนวนออเดอร์ทั้งหมด
    total_revenue: number // รายได้รวม (THB)
    avg_order_value: number // มูลค่าเฉลี่ย/ออเดอร์

    // Time-based Performance
    last_30_days_sales: number
    last_30_days_revenue: number
    month_over_month_growth: number // % เติบโต

    // Customer Metrics
    total_customers: number
    repeat_customer_rate: number // % ลูกค้าซื้อซ้ำ
    customer_retention_rate: number // % ลูกค้ากลับมาซื้อ

    // Operational Metrics
    order_fulfillment_rate: number // % ส่งของตามเวลา
    avg_processing_time: number // ชั่วโมง (เวลาเฉลี่ยในการจัดส่ง)
    on_time_delivery_rate: number // % ส่งถึงตามเวลา

    // Quality Metrics
    return_rate: number // % สินค้าถูกคืน
    dispute_rate: number // % ข้อพิพาท
    defect_rate: number // % สินค้าบกพร่อง

    // Communication
    response_time_avg: number // นาที (เวลาตอบกลับเฉลี่ย)
    response_rate: number // % ตอบแชทภายใน 24 ชม.

    // Inventory
    active_listings: number
    sold_out_listings: number
    avg_stock_level: number

    // Financial Health
    pending_balance: number // ยอดค้างรับ
    available_balance: number // ยอดพร้อมถอน
    total_withdrawn: number // ถอนไปแล้ว

    last_calculated: Date
}

// ==========================================
// SELLER TIER SYSTEM
// ==========================================

export type SellerTier = 'starter' | 'rising' | 'established' | 'power_seller' | 'top_seller'

export interface SellerTierInfo {
    current_tier: SellerTier
    tier_level: number // 1-5

    // Current Tier Benefits
    benefits: string[]
    commission_rate: number // % ค่าคอมมิชชั่น
    boost_multiplier: number // ตัวคูณการโปรโมท
    priority_support: boolean

    // Next Tier Requirements
    next_tier?: SellerTier
    next_tier_requirements?: {
        min_sales: number // ยอดขายขั้นต่ำ
        min_revenue: number // รายได้ขั้นต่ำ
        min_rating: number // คะแนนขั้นต่ำ
        min_reviews: number // รีวิวขั้นต่ำ
        max_return_rate: number // % คืนสินค้าสูงสุด
        max_dispute_rate: number // % ข้อพิพาทสูงสุด
    }

    // Progress to Next Tier
    progress: {
        sales_progress: number // 0-100
        revenue_progress: number // 0-100
        rating_progress: number // 0-100
        overall_progress: number // 0-100
    }

    // Tier History
    tier_achieved_at: Date
    previous_tier?: SellerTier
    tier_change_history: {
        tier: SellerTier
        changed_at: Date
        reason?: string
    }[]
}

// Tier Configuration
export const SELLER_TIER_CONFIG: Record<SellerTier, {
    name: string
    name_th: string
    requirements: {
        min_sales: number
        min_revenue: number
        min_rating: number
        min_reviews: number
    }
    benefits: string[]
    commission_rate: number
    color: string
    icon: string
}> = {
    starter: {
        name: 'Starter',
        name_th: 'ผู้ขายมือใหม่',
        requirements: {
            min_sales: 0,
            min_revenue: 0,
            min_rating: 0,
            min_reviews: 0
        },
        benefits: [
            'ลงขายสินค้าได้ไม่จำกัด',
            'เข้าถึงเครื่องมือพื้นฐาน',
            'รับการสนับสนุนทั่วไป'
        ],
        commission_rate: 5.0,
        color: 'gray',
        icon: '🌱'
    },
    rising: {
        name: 'Rising Star',
        name_th: 'ดาวรุ่ง',
        requirements: {
            min_sales: 10,
            min_revenue: 10000,
            min_rating: 4.0,
            min_reviews: 5
        },
        benefits: [
            'ค่าคอมมิชชั่นลด 0.5%',
            'โปรโมทสินค้าฟรี 2 ครั้ง/เดือน',
            'ป้าย "Rising Star"',
            'รายงานยอดขายขั้นสูง'
        ],
        commission_rate: 4.5,
        color: 'blue',
        icon: '⭐'
    },
    established: {
        name: 'Established',
        name_th: 'ผู้ขายมั่นคง',
        requirements: {
            min_sales: 50,
            min_revenue: 50000,
            min_rating: 4.3,
            min_reviews: 20
        },
        benefits: [
            'ค่าคอมมิชชั่นลด 1%',
            'โปรโมทสินค้าฟรี 5 ครั้ง/เดือน',
            'ป้าย "Established Seller"',
            'ถอนเงินเร็วขึ้น (1-2 วัน)',
            'AI Price Suggestion Premium'
        ],
        commission_rate: 4.0,
        color: 'green',
        icon: '🏆'
    },
    power_seller: {
        name: 'Power Seller',
        name_th: 'ผู้ขายระดับพรีเมียม',
        requirements: {
            min_sales: 200,
            min_revenue: 200000,
            min_rating: 4.5,
            min_reviews: 50
        },
        benefits: [
            'ค่าคอมมิชชั่นลด 1.5%',
            'โปรโมทสินค้าฟรี 10 ครั้ง/เดือน',
            'ป้าย "Power Seller"',
            'ถอนเงินทันที',
            'Account Manager เฉพาะ',
            'เข้าร่วมแคมเปญพิเศษ',
            'AI Insights Premium'
        ],
        commission_rate: 3.5,
        color: 'purple',
        icon: '💎'
    },
    top_seller: {
        name: 'Top Seller',
        name_th: 'ผู้ขายระดับท็อป',
        requirements: {
            min_sales: 500,
            min_revenue: 500000,
            min_rating: 4.7,
            min_reviews: 100
        },
        benefits: [
            'ค่าคอมมิชชั่นลด 2%',
            'โปรโมทสินค้าฟรีไม่จำกัด',
            'ป้าย "Top Seller" พร้อมไอคอนพิเศษ',
            'ถอนเงินทันที + ไม่มีขั้นต่ำ',
            'Priority Support 24/7',
            'Featured Seller (หน้าแรก)',
            'ส่วนลดค่าโฆษณา 50%',
            'AI Suite ครบทุกฟีเจอร์',
            'Early Access ฟีเจอร์ใหม่'
        ],
        commission_rate: 3.0,
        color: 'gold',
        icon: '👑'
    }
}

// ==========================================
// BUSINESS INFORMATION
// ==========================================

export type BusinessType = 'individual' | 'company' | 'partnership'

export interface BusinessInfo {
    business_type: BusinessType

    // Tax Information
    tax_id?: string // เลขประจำตัวผู้เสียภาษี (13 หลัก)
    tax_id_verified: boolean

    // Company Details (if applicable)
    company_name?: string
    company_registration?: string // เลขทะเบียนนิติบุคคล
    company_registration_verified: boolean

    // Bank Account
    bank_account: {
        bank_name: string
        bank_code: string
        account_number: string // Encrypted
        account_name: string
        account_type: 'savings' | 'current'
        verified: boolean
        verified_at?: Date
        verification_method?: 'manual' | 'auto'
    }

    // Business Address (may differ from shipping address)
    business_address?: Address

    // Legal Documents
    documents: {
        type: 'id_card' | 'company_cert' | 'tax_cert' | 'bank_statement'
        url: string // Encrypted storage
        uploaded_at: Date
        verified: boolean
        verified_by?: string // Admin ID
    }[]

    updated_at: Date
}

// ==========================================
// OPERATING HOURS & AVAILABILITY
// ==========================================

export interface DaySchedule {
    is_open: boolean
    open_time?: string // "09:00"
    close_time?: string // "18:00"
    break_time?: {
        start: string
        end: string
    }
}

export interface OperatingHours {
    timezone: string // "Asia/Bangkok"

    schedule: {
        monday: DaySchedule
        tuesday: DaySchedule
        wednesday: DaySchedule
        thursday: DaySchedule
        friday: DaySchedule
        saturday: DaySchedule
        sunday: DaySchedule
    }

    // Auto-reply
    auto_reply_enabled: boolean
    auto_reply_message?: string
    auto_reply_outside_hours: boolean

    // Vacation Mode
    vacation_mode: {
        enabled: boolean
        start_date?: Date
        end_date?: Date
        message?: string
        auto_decline_orders: boolean
    }

    // Quick Responses
    quick_responses: {
        id: string
        trigger: string // คำถามที่ตรงกัน
        response: string
        enabled: boolean
    }[]
}

// ==========================================
// SHIPPING & LOGISTICS
// ==========================================

export interface ShippingSettings {
    // Default Methods
    default_shipping_methods: {
        method: string // "kerry", "flash", "thaipost"
        enabled: boolean
        base_price: number
        estimated_days: string // "1-2 วัน"
    }[]

    // Free Shipping
    free_shipping_enabled: boolean
    free_shipping_threshold?: number // ฿500 ขึ้นไป

    // Processing Time
    processing_time_hours: number // เวลาในการเตรียมสินค้า

    // Coverage
    ships_to_provinces: string[] // [] = ทั่วประเทศ
    ships_nationwide: boolean

    // Packaging
    packaging_options: {
        type: 'standard' | 'bubble_wrap' | 'box' | 'custom'
        additional_cost: number
        description?: string
    }[]

    // Pickup Options
    allow_local_pickup: boolean
    pickup_locations?: {
        name: string
        address: Address
        instructions?: string
    }[]

    // International Shipping
    international_shipping_enabled: boolean
    ships_to_countries?: string[]
}

// ==========================================
// MARKETING & PROMOTIONS
// ==========================================

export interface ActivePromotion {
    id: string
    type: 'discount' | 'free_shipping' | 'bundle' | 'flash_sale' | 'coupon'

    // Details
    name: string
    description: string

    // Discount
    discount_type?: 'percentage' | 'fixed'
    discount_value?: number

    // Conditions
    min_purchase?: number
    max_discount?: number
    applicable_products?: string[] // Product IDs
    applicable_categories?: string[]

    // Validity
    start_date: Date
    end_date: Date
    is_active: boolean

    // Usage
    usage_limit?: number
    usage_count: number
    per_user_limit?: number

    // Performance
    total_revenue: number
    total_orders: number
    conversion_rate: number

    created_at: Date
}

// ==========================================
// AI-POWERED INSIGHTS
// ==========================================

export interface AIInsights {
    // Pricing Intelligence
    pricing: {
        suggested_price_range: { min: number, max: number }
        competitor_avg_price: number
        market_position: 'below_market' | 'market_average' | 'premium'
        price_elasticity: number // ความยืดหยุ่นของราคา
        optimal_price_point: number
    }

    // Product Performance
    trending_products: {
        product_id: string
        product_title: string
        trend_score: number // 0-100
        reason: string
    }[]

    best_selling_categories: {
        category_id: string
        category_name: string
        sales_count: number
        revenue: number
        growth_rate: number
    }[]

    // Timing Optimization
    optimal_posting_times: {
        day: string // "Monday"
        time: string // "14:00-16:00"
        engagement_score: number
    }[]

    // Inventory Recommendations
    inventory_alerts: {
        product_id: string
        alert_type: 'low_stock' | 'overstock' | 'restock_recommended'
        current_stock: number
        recommended_stock: number
        reason: string
    }[]

    // Customer Insights
    customer_segments: {
        segment: string // "Budget Shoppers", "Premium Buyers"
        percentage: number
        avg_order_value: number
        characteristics: string[]
    }[]

    // Competitor Analysis
    competitor_analysis?: {
        avg_price_comparison: number // % เทียบกับคู่แข่ง
        avg_rating_comparison: number
        market_share_estimate: number
        competitive_advantages: string[]
        improvement_areas: string[]
    }

    // Recommendations
    recommendations: {
        type: 'pricing' | 'inventory' | 'marketing' | 'customer_service'
        priority: 'high' | 'medium' | 'low'
        title: string
        description: string
        expected_impact: string
        action_items: string[]
    }[]

    last_updated: Date
    next_update: Date
}

// ==========================================
// CERTIFICATIONS & ACHIEVEMENTS
// ==========================================

export type CertificationType =
    | 'official_store'
    | 'verified_brand'
    | 'eco_friendly'
    | 'fast_shipper'
    | 'quality_guaranteed'
    | 'local_artisan'

export interface SellerCertification {
    type: CertificationType
    name: string
    name_th: string
    description: string
    icon: string
    badge_color: string

    verified: boolean
    verified_at?: Date
    verified_by?: string // Admin ID

    expires_at?: Date
    renewal_required: boolean

    requirements_met: boolean
    requirements: string[]
}

// ==========================================
// CUSTOMER SERVICE
// ==========================================

export interface CustomerServiceSettings {
    // Response Metrics
    avg_response_time: number // นาที
    target_response_time: number // เป้าหมาย

    // Availability
    chat_availability: boolean
    support_channels: ('chat' | 'phone' | 'email' | 'line')[]

    // Contact Info
    phone_number?: string
    email?: string
    line_id?: string

    // FAQ
    faq_enabled: boolean
    faq_items: {
        question: string
        answer: string
        category: string
        order: number
    }[]

    // Policies
    return_policy?: string
    warranty_policy?: string
    shipping_policy?: string

    // Templates
    message_templates: {
        id: string
        name: string
        content: string
        category: 'greeting' | 'shipping' | 'return' | 'general'
    }[]
}

// ==========================================
// ENHANCED SELLER PROFILE
// ==========================================

export interface EnhancedSellerProfile {
    // Basic Info (from existing SellerProfile)
    id: string
    user_id: string
    shop_name: string
    shop_slug: string
    shop_description: string
    avatar_url?: string
    cover_url?: string
    banner_url?: string

    // Categories
    main_categories: string[]

    // Enhanced Ratings
    ratings: DetailedRatings

    // Performance
    performance: SellerPerformance

    // Tier System
    tier_info: SellerTierInfo

    // Business
    business_info: BusinessInfo

    // Operations
    operating_hours: OperatingHours
    shipping_settings: ShippingSettings

    // Marketing
    active_promotions: ActivePromotion[]

    // AI Insights
    ai_insights: AIInsights

    // Certifications
    certifications: SellerCertification[]

    // Customer Service
    customer_service: CustomerServiceSettings

    // Legacy Fields (for compatibility)
    trust_score: number
    follower_count: number
    response_rate: number
    is_verified_seller: boolean

    // Metadata
    created_at: Date
    updated_at: Date
    last_active: Date
}

// ==========================================
// SELLER ANALYTICS
// ==========================================

export interface SellerAnalytics {
    seller_id: string
    period: 'daily' | 'weekly' | 'monthly' | 'yearly'

    // Sales Data
    sales_data: {
        date: string
        orders: number
        revenue: number
        avg_order_value: number
    }[]

    // Traffic
    traffic_data: {
        date: string
        views: number
        unique_visitors: number
        conversion_rate: number
    }[]

    // Top Products
    top_products: {
        product_id: string
        product_title: string
        sales: number
        revenue: number
        views: number
    }[]

    // Customer Demographics
    customer_demographics: {
        age_groups: Record<string, number>
        provinces: Record<string, number>
        buyer_types: Record<string, number>
    }

    generated_at: Date
}
