/**
 * Enhanced Review System - Complete Type Definitions
 * JaiKod Marketplace - AI-Native Platform
 * 
 * This file contains comprehensive review types including:
 * - Detailed Rating System
 * - AI Verification & Sentiment Analysis
 * - Media Support
 * - Seller Response
 * - Moderation System
 */

// ==========================================
// DETAILED REVIEW RATINGS
// ==========================================

export interface DetailedReviewRatings {
    overall: number // 1-5 (average)

    // Individual Aspects (each 1-5)
    product_quality: number // คุณภาพสินค้า
    value_for_money: number // คุ้มค่า
    seller_service: number // บริการผู้ขาย
    shipping_speed: number // ความเร็วจัดส่ง
    packaging_quality: number // คุณภาพบรรจุภัณฑ์
    accuracy: number // ตรงตามรายละเอียด
}

// ==========================================
// AI VERIFICATION & ANALYSIS
// ==========================================

export interface AIReviewAnalysis {
    // Verification
    is_verified_purchase: boolean // ซื้อจริง
    purchase_verified_at?: Date

    // Sentiment Analysis
    sentiment: 'very_positive' | 'positive' | 'neutral' | 'negative' | 'very_negative'
    sentiment_score: number // -1 to 1
    sentiment_confidence: number // 0-100

    // Spam Detection
    spam_score: number // 0-100 (higher = more likely spam)
    spam_indicators: string[] // ["Generic text", "Repeated content"]
    is_likely_spam: boolean

    // Authenticity
    authenticity_score: number // 0-100
    authenticity_flags: {
        is_duplicate: boolean // รีวิวซ้ำ
        is_bot_generated: boolean // AI เขียน
        is_incentivized: boolean // ได้รับสิ่งตอบแทน
        unusual_pattern: boolean // รูปแบบผิดปกติ
    }

    // Content Analysis
    content_analysis: {
        word_count: number
        has_details: boolean // มีรายละเอียดเพียงพอ
        language: string // "th", "en"
        topics: string[] // ["shipping", "quality", "price"]
        keywords: string[]
    }

    // Helpfulness Prediction
    predicted_helpfulness: number // 0-100

    analyzed_at: Date
}

// ==========================================
// REVIEW MEDIA
// ==========================================

export interface ReviewMedia {
    type: 'image' | 'video'
    url: string
    thumbnail_url?: string

    // Metadata
    width?: number
    height?: number
    size_bytes?: number
    duration_seconds?: number // for videos

    // AI Analysis
    ai_tags?: string[]
    contains_product: boolean
    quality_score?: number // 0-100

    uploaded_at: Date
}

// ==========================================
// SELLER RESPONSE
// ==========================================

export interface SellerResponse {
    message: string
    responded_at: Date
    responded_by: string // Seller user ID

    // Engagement
    helpful_count: number // คนกดว่ามีประโยชน์

    // AI Analysis
    ai_tone?: 'professional' | 'friendly' | 'defensive' | 'apologetic'
    ai_quality_score?: number // 0-100

    // Moderation
    is_approved: boolean
    flagged_for_review: boolean
    flag_reason?: string
}

// ==========================================
// REVIEW ENGAGEMENT
// ==========================================

export interface ReviewEngagement {
    // Helpfulness
    helpful_count: number // คนกดว่ามีประโยชน์
    not_helpful_count: number
    helpful_ratio: number // 0-1

    // User Interactions
    helpful_by_users: string[] // User IDs

    // Reports
    reported_count: number
    report_reasons: {
        reason: 'spam' | 'fake' | 'inappropriate' | 'misleading' | 'other'
        count: number
    }[]

    // Views
    view_count: number

    // Shares
    share_count: number
}

// ==========================================
// MODERATION
// ==========================================

export type ModerationStatus = 'pending' | 'approved' | 'rejected' | 'flagged'
export type ModerationAction = 'approve' | 'reject' | 'flag' | 'remove'

export interface ReviewModeration {
    status: ModerationStatus

    // Auto-moderation
    auto_moderation_passed: boolean
    auto_moderation_flags: string[]

    // Manual Review
    requires_manual_review: boolean
    manual_review_reason?: string

    // Moderator Action
    moderated_by?: string // Admin ID
    moderated_at?: Date
    moderation_action?: ModerationAction
    moderation_reason?: string
    moderation_notes?: string

    // Appeals
    appeal_submitted: boolean
    appeal_message?: string
    appeal_submitted_at?: Date
    appeal_resolved: boolean
    appeal_resolution?: string
}

// ==========================================
// REVIEW CONTEXT
// ==========================================

export interface ReviewContext {
    // Purchase Info
    order_id: string
    purchase_date: Date
    days_since_purchase: number

    // Product Info
    product_variant?: string
    product_price_paid: number

    // Buyer Info
    buyer_tier?: string
    buyer_total_reviews: number
    buyer_avg_rating?: number
    is_first_review: boolean

    // Timing
    review_submitted_days_after_delivery: number
}

// ==========================================
// ENHANCED REVIEW
// ==========================================

export interface EnhancedReview {
    // Basic Info
    id: string
    order_id: string
    product_id: string
    seller_id: string
    reviewer_id: string

    // Ratings
    ratings: DetailedReviewRatings

    // Content
    title?: string // หัวข้อรีวิว
    comment: string
    pros?: string[] // จุดเด่น
    cons?: string[] // จุดด้อย

    // Media
    media: ReviewMedia[]

    // AI Analysis
    ai_analysis: AIReviewAnalysis

    // Seller Response
    seller_response?: SellerResponse

    // Engagement
    engagement: ReviewEngagement

    // Moderation
    moderation: ReviewModeration

    // Context
    context: ReviewContext

    // Badges
    badges: ReviewBadge[]

    // Metadata
    created_at: Date
    updated_at: Date
    edited: boolean
    edited_at?: Date

    // Visibility
    is_visible: boolean
    is_featured: boolean // รีวิวเด่น
    is_pinned: boolean // ปักหมุด
}

// ==========================================
// REVIEW BADGES
// ==========================================

export type ReviewBadgeType =
    | 'verified_purchase'
    | 'top_reviewer'
    | 'helpful_reviewer'
    | 'early_reviewer'
    | 'detailed_review'
    | 'photo_review'
    | 'video_review'

export interface ReviewBadge {
    type: ReviewBadgeType
    name: string
    name_th: string
    icon: string
    color: string
    description: string
}

export const REVIEW_BADGES: Record<ReviewBadgeType, Omit<ReviewBadge, 'type'>> = {
    verified_purchase: {
        name: 'Verified Purchase',
        name_th: 'ซื้อแล้ว',
        icon: '✓',
        color: 'green',
        description: 'ซื้อสินค้านี้จริง'
    },
    top_reviewer: {
        name: 'Top Reviewer',
        name_th: 'นักรีวิวชั้นนำ',
        icon: '👑',
        color: 'gold',
        description: 'เขียนรีวิวมากกว่า 50 ชิ้น'
    },
    helpful_reviewer: {
        name: 'Helpful Reviewer',
        name_th: 'รีวิวมีประโยชน์',
        icon: '⭐',
        color: 'blue',
        description: 'รีวิวได้รับคะแนนมีประโยชน์สูง'
    },
    early_reviewer: {
        name: 'Early Reviewer',
        name_th: 'รีวิวก่อนใคร',
        icon: '🎯',
        color: 'purple',
        description: 'เป็นคนแรกๆ ที่รีวิวสินค้านี้'
    },
    detailed_review: {
        name: 'Detailed Review',
        name_th: 'รีวิวละเอียด',
        icon: '📝',
        color: 'orange',
        description: 'รีวิวละเอียดมากกว่า 100 คำ'
    },
    photo_review: {
        name: 'Photo Review',
        name_th: 'มีรูปภาพ',
        icon: '📷',
        color: 'pink',
        description: 'แนบรูปภาพสินค้า'
    },
    video_review: {
        name: 'Video Review',
        name_th: 'มีวิดีโอ',
        icon: '🎥',
        color: 'red',
        description: 'แนบวิดีโอรีวิว'
    }
}

// ==========================================
// REVIEW STATISTICS
// ==========================================

export interface ReviewStatistics {
    product_id?: string
    seller_id?: string

    // Overall
    total_reviews: number
    average_rating: number

    // Detailed Averages
    avg_product_quality: number
    avg_value_for_money: number
    avg_seller_service: number
    avg_shipping_speed: number
    avg_packaging_quality: number
    avg_accuracy: number

    // Distribution
    rating_distribution: {
        five_star: number
        four_star: number
        three_star: number
        two_star: number
        one_star: number
    }

    // Percentages
    rating_percentages: {
        five_star: number
        four_star: number
        three_star: number
        two_star: number
        one_star: number
    }

    // Trends
    trend: 'improving' | 'stable' | 'declining'
    last_30_days_avg: number
    last_90_days_avg: number

    // Engagement
    total_helpful_votes: number
    avg_helpful_ratio: number

    // Media
    reviews_with_photos: number
    reviews_with_videos: number

    // Verification
    verified_purchase_percentage: number

    last_calculated: Date
}

// ==========================================
// REVIEW FILTERS & SORTING
// ==========================================

export interface ReviewFilters {
    // Rating
    min_rating?: number
    max_rating?: number
    rating?: number // exact rating

    // Verification
    verified_only?: boolean

    // Media
    with_photos?: boolean
    with_videos?: boolean

    // Sentiment
    sentiment?: 'positive' | 'neutral' | 'negative'

    // Date
    date_from?: Date
    date_to?: Date

    // Aspects
    min_product_quality?: number
    min_value_for_money?: number
    min_seller_service?: number

    // Other
    has_seller_response?: boolean
    is_featured?: boolean
}

export type ReviewSortBy =
    | 'most_recent'
    | 'most_helpful'
    | 'highest_rating'
    | 'lowest_rating'
    | 'most_detailed'

export interface ReviewSortOptions {
    sort_by: ReviewSortBy
    order: 'asc' | 'desc'
}

// ==========================================
// REVIEW SUMMARY
// ==========================================

export interface ReviewSummary {
    product_id: string

    // Quick Stats
    total_reviews: number
    average_rating: number
    recommendation_rate: number // % ที่แนะนำ

    // Highlights
    top_positive_aspects: {
        aspect: string
        mention_count: number
        percentage: number
    }[]

    top_negative_aspects: {
        aspect: string
        mention_count: number
        percentage: number
    }[]

    // Common Keywords
    positive_keywords: { keyword: string, count: number }[]
    negative_keywords: { keyword: string, count: number }[]

    // AI Summary
    ai_summary?: {
        overall_sentiment: string
        key_points: string[]
        buyer_personas: string[] // "Great for beginners", "Professional use"
        generated_at: Date
    }

    // Featured Reviews
    featured_reviews: {
        most_helpful: string // Review ID
        most_detailed: string
        most_recent: string
    }
}

// ==========================================
// REVIEW TEMPLATES (for buyers)
// ==========================================

export interface ReviewTemplate {
    id: string
    category: string // "Electronics", "Fashion", etc.

    suggested_questions: {
        aspect: keyof DetailedReviewRatings
        question: string
        question_th: string
    }[]

    quick_tags: {
        positive: string[] // ["Great quality", "Fast shipping"]
        negative: string[] // ["Too small", "Damaged"]
    }
}

// ==========================================
// REVIEW ANALYTICS
// ==========================================

export interface ReviewAnalytics {
    seller_id: string
    period: 'daily' | 'weekly' | 'monthly'

    // Volume
    review_volume: {
        date: string
        count: number
        avg_rating: number
    }[]

    // Sentiment Trend
    sentiment_trend: {
        date: string
        positive: number
        neutral: number
        negative: number
    }[]

    // Response Rate
    response_rate: number
    avg_response_time_hours: number

    // Impact
    conversion_impact: {
        products_with_reviews: number
        avg_conversion_rate: number
        conversion_lift: number // % increase
    }

    generated_at: Date
}
