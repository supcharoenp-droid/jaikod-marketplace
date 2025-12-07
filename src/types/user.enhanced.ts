/**
 * Enhanced User System - Complete Type Definitions
 * JaiKod Marketplace - AI-Native Platform
 * 
 * This file contains comprehensive user types including:
 * - Trust & Safety Score
 * - Behavioral Analytics
 * - Personalization
 * - Gamification
 * - Security Features
 */

import { Address } from './index'

// ==========================================
// TRUST & VERIFICATION
// ==========================================

export type TrustLevel = 'bronze' | 'silver' | 'gold' | 'diamond'
export type KYCStatus = 'not_verified' | 'phone_verified' | 'id_verified' | 'bank_verified'

export interface KYCDocuments {
    national_id?: string // Encrypted reference
    national_id_verified: boolean
    national_id_verified_at?: Date

    face_verification: boolean
    face_verification_at?: Date
    face_match_score?: number // 0-100

    bank_account_verified: boolean
    bank_account_verified_at?: Date

    verification_method?: 'manual' | 'ai' | 'third_party'
    verified_by?: string // Admin ID
}

export interface TrustScore {
    overall_score: number // 0-100 (AI-calculated)
    level: TrustLevel

    // Score Components
    identity_score: number // 0-100
    transaction_score: number // 0-100
    behavior_score: number // 0-100
    community_score: number // 0-100

    // Factors
    factors: {
        positive: string[] // ["Verified ID", "100+ successful transactions"]
        negative: string[] // ["2 reports", "Low response rate"]
    }

    last_calculated: Date
    next_review: Date
}

// ==========================================
// BEHAVIORAL ANALYTICS
// ==========================================

export interface BehaviorScore {
    // Communication
    response_rate: number // 0-100 (% ตอบแชทภายใน 24 ชม.)
    response_time_avg: number // นาที
    response_time_median: number

    // Transaction Reliability
    completion_rate: number // 0-100 (% ทำธุรกรรมสำเร็จ)
    cancellation_rate: number // 0-100 (% ยกเลิกคำสั่งซื้อ)
    dispute_rate: number // 0-100 (% ข้อพิพาท)

    // Activity
    last_active: Date
    active_days_last_30: number
    avg_session_duration: number // นาที

    // Community
    report_count: number // ถูกรายงาน
    warning_count: number // ถูกเตือน
    helpful_reviews_count: number // รีวิวที่มีประโยชน์

    // AI Risk Assessment
    risk_level: 'low' | 'medium' | 'high' | 'critical'
    risk_factors: string[]

    last_updated: Date
}

// ==========================================
// USER PREFERENCES
// ==========================================

export interface UserPreferences {
    // Shopping Preferences
    favorite_categories: string[] // Category IDs (AI-curated)
    price_range: {
        min: number
        max: number
    }
    preferred_conditions: ('new' | 'like_new' | 'good' | 'fair')[]
    preferred_shipping: string[] // Shipping method IDs

    // Notifications
    notification_settings: {
        email: boolean
        sms: boolean
        push: boolean
        marketing: boolean
        price_drop_alerts: boolean
        back_in_stock_alerts: boolean
        new_message_alerts: boolean
        order_updates: boolean
    }

    // Display
    language: 'th' | 'en'
    theme: 'light' | 'dark' | 'auto'
    currency: 'THB'

    // Privacy
    privacy_settings: {
        show_online_status: boolean
        show_last_seen: boolean
        allow_messages_from: 'everyone' | 'verified_only' | 'none'
        show_purchase_history: boolean
        show_reviews: boolean
    }

    // AI Personalization
    ai_recommendations_enabled: boolean
    personalized_search_enabled: boolean

    updated_at: Date
}

// ==========================================
// SOCIAL FEATURES
// ==========================================

export interface SocialProfile {
    follower_count: number // คนที่ติดตามฉัน
    following_count: number // ฉันติดตามคนอื่น

    followers: string[] // User IDs
    following: string[] // User IDs

    wishlist_count: number
    public_collections_count: number

    // Social Proof
    total_reviews_given: number
    helpful_reviews_count: number
    total_likes_received: number

    // Sharing
    share_count: number // แชร์สินค้า
    referral_count: number // แนะนำเพื่อน
}

// ==========================================
// GAMIFICATION
// ==========================================

export type BadgeType =
    | 'early_adopter'
    | 'power_buyer'
    | 'trusted_seller'
    | 'top_reviewer'
    | 'eco_warrior'
    | 'fast_responder'
    | 'deal_hunter'
    | 'community_helper'
    | 'verified_pro'
    | 'loyalty_champion'

export interface UserBadge {
    id: string
    type: BadgeType
    name: string
    name_th: string
    description: string
    icon: string
    rarity: 'common' | 'rare' | 'epic' | 'legendary'
    earned_at: Date
    progress?: number // 0-100 (for badges in progress)
}

export interface GamificationProfile {
    level: number // 1-100
    experience_points: number
    points_to_next_level: number

    badges: UserBadge[]
    achievements: Achievement[]

    // Streaks
    login_streak: number // วันติดต่อกัน
    purchase_streak: number
    review_streak: number

    // Milestones
    milestones_completed: string[]
    next_milestone?: {
        name: string
        description: string
        progress: number // 0-100
        reward: string
    }
}

export interface Achievement {
    id: string
    name: string
    name_th: string
    description: string
    icon: string
    category: 'buyer' | 'seller' | 'social' | 'special'
    unlocked: boolean
    unlocked_at?: Date
    progress: number // 0-100
    reward?: {
        type: 'points' | 'badge' | 'discount' | 'feature_unlock'
        value: string | number
    }
}

// ==========================================
// DEVICE & SECURITY
// ==========================================

export interface UserDevice {
    device_id: string
    device_name: string // "iPhone 14 Pro", "Chrome on Windows"
    device_type: 'ios' | 'android' | 'web' | 'desktop'

    // Security
    is_trusted: boolean
    trusted_at?: Date

    // Activity
    first_used: Date
    last_used: Date
    last_ip_address?: string
    last_location?: {
        country: string
        city?: string
        coordinates?: { lat: number, lng: number }
    }

    // Fingerprint
    user_agent?: string
    browser?: string
    os?: string
}

export interface SecuritySettings {
    // Two-Factor Authentication
    two_factor_enabled: boolean
    two_factor_method?: 'sms' | 'email' | 'authenticator'
    backup_codes?: string[] // Encrypted

    // Login Security
    require_verification_new_device: boolean
    auto_logout_minutes?: number

    // Blocked Users
    blocked_users: string[] // User IDs
    blocked_at: Record<string, Date>

    // Account Status
    is_banned: boolean
    ban_reason?: string
    ban_until?: Date
    ban_issued_by?: string // Admin ID

    // Suspicious Activity
    suspicious_login_attempts: number
    last_suspicious_activity?: Date
    account_locked: boolean
    locked_until?: Date
}

// ==========================================
// ENHANCED USER INTERFACE
// ==========================================

export interface EnhancedUser {
    // Basic Info (from existing User type)
    id: string
    role: 'buyer' | 'seller' | 'admin'
    email: string
    displayName?: string
    full_name?: string
    phoneNumber?: string
    photoURL?: string

    // Address
    address?: Address
    saved_addresses?: Address[]

    // Trust & Verification
    is_verified: boolean
    kyc_status: KYCStatus
    kyc_documents?: KYCDocuments
    trust_score: TrustScore

    // Behavior & Analytics
    behavior_score: BehaviorScore

    // Preferences
    preferences: UserPreferences

    // Social
    social_profile: SocialProfile

    // Gamification
    gamification: GamificationProfile

    // Security
    devices: UserDevice[]
    security_settings: SecuritySettings

    // Metadata
    created_at: Date
    updated_at: Date
    last_login?: Date
    email_verified: boolean
    phone_verified: boolean
}

// ==========================================
// USER STATISTICS (for Admin Dashboard)
// ==========================================

export interface UserStatistics {
    user_id: string

    // Purchase History
    total_purchases: number
    total_spent: number
    avg_order_value: number
    first_purchase_date?: Date
    last_purchase_date?: Date

    // Selling History (if seller)
    total_sales?: number
    total_revenue?: number

    // Engagement
    total_reviews_written: number
    total_messages_sent: number
    total_products_viewed: number
    total_searches: number

    // Time-based
    member_since_days: number
    active_days_total: number
    avg_session_duration_minutes: number

    // Lifetime Value (LTV)
    lifetime_value: number
    predicted_ltv: number // AI prediction
    churn_risk: number // 0-100

    last_calculated: Date
}

// ==========================================
// USER ACTIVITY LOG
// ==========================================

export type UserActivityType =
    | 'login'
    | 'logout'
    | 'profile_update'
    | 'purchase'
    | 'sale'
    | 'review'
    | 'message'
    | 'report'
    | 'verification'
    | 'security_event'

export interface UserActivityLog {
    id: string
    user_id: string
    activity_type: UserActivityType
    description: string

    // Context
    metadata?: Record<string, any>
    ip_address?: string
    device_id?: string
    location?: string

    // Security
    is_suspicious: boolean
    risk_score?: number

    timestamp: Date
}

// ==========================================
// HELPER TYPES
// ==========================================

export interface UserSearchFilters {
    role?: 'buyer' | 'seller' | 'admin'
    trust_level?: TrustLevel
    kyc_status?: KYCStatus
    is_verified?: boolean
    is_banned?: boolean
    created_after?: Date
    created_before?: Date
    min_trust_score?: number
    has_purchases?: boolean
    has_sales?: boolean
}

export interface UserSortOptions {
    field: 'created_at' | 'trust_score' | 'total_purchases' | 'total_sales' | 'last_active'
    order: 'asc' | 'desc'
}
