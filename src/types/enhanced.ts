/**
 * Enhanced Member System - Type Exports
 * JaiKod Marketplace
 * 
 * Central export file for all enhanced member system types
 */

// ==========================================
// USER TYPES
// ==========================================

export type {
    // Trust & Verification
    TrustLevel,
    KYCStatus,
    KYCDocuments,
    TrustScore,

    // Behavior
    BehaviorScore,

    // Preferences
    UserPreferences,

    // Social
    SocialProfile,

    // Gamification
    BadgeType,
    UserBadge,
    GamificationProfile,
    Achievement,

    // Security
    UserDevice,
    SecuritySettings,

    // Main Interface
    EnhancedUser,

    // Statistics
    UserStatistics,
    UserActivityLog,
    UserActivityType,

    // Helpers
    UserSearchFilters,
    UserSortOptions
} from './user.enhanced'

// ==========================================
// SELLER TYPES
// ==========================================

export type {
    // Ratings
    DetailedRatings,

    // Performance
    SellerPerformance,

    // Tier System
    SellerTier,
    SellerTierInfo,

    // Business
    BusinessType,
    BusinessInfo,

    // Operations
    DaySchedule,
    OperatingHours,
    ShippingSettings,

    // Marketing
    ActivePromotion,

    // AI Insights
    AIInsights,

    // Certifications
    CertificationType,
    SellerCertification,

    // Customer Service
    CustomerServiceSettings,

    // Main Interface
    EnhancedSellerProfile,

    // Analytics
    SellerAnalytics
} from './seller.enhanced'

export { SELLER_TIER_CONFIG } from './seller.enhanced'

// ==========================================
// REVIEW TYPES
// ==========================================

export type {
    // Ratings
    DetailedReviewRatings,

    // AI Analysis
    AIReviewAnalysis,

    // Media
    ReviewMedia,

    // Seller Response
    SellerResponse,

    // Engagement
    ReviewEngagement,

    // Moderation
    ModerationStatus,
    ModerationAction,
    ReviewModeration,

    // Context
    ReviewContext,

    // Main Interface
    EnhancedReview,

    // Badges
    ReviewBadgeType,
    ReviewBadge,

    // Statistics
    ReviewStatistics,

    // Filters & Sorting
    ReviewFilters,
    ReviewSortBy,
    ReviewSortOptions,

    // Summary
    ReviewSummary,

    // Templates
    ReviewTemplate,

    // Analytics
    ReviewAnalytics
} from './review.enhanced'

export { REVIEW_BADGES } from './review.enhanced'

// ==========================================
// LOYALTY TYPES
// ==========================================

export type {
    // Loyalty Program
    LoyaltyTier,
    LoyaltyProgram,
    PointsTransaction,
    PointsSource,
    TierChange,
    LoyaltyBenefit,

    // Rewards
    Reward,
    RedeemedReward,

    // Referral
    ReferralProgram,
    ReferredUser,

    // Wishlist
    Wishlist,
    WishlistItem,
    Collection,

    // Offers
    PersonalizedOffer,

    // Challenges
    Challenge,
    UserChallenge,

    // Notifications
    UserNotification,

    // Analytics
    LoyaltyAnalytics
} from './loyalty'

export { LOYALTY_TIER_CONFIG } from './loyalty'

// ==========================================
// ADMIN TYPES
// ==========================================

export type {
    // Performance
    AdminPerformanceMetrics,

    // Schedule
    AdminWorkSchedule,

    // Specialization
    AdminSpecialization,

    // Training
    AdminTraining,

    // Security
    AdminSecurity,
    AdminSession,

    // Main Interface
    EnhancedAdminUser,

    // Moderation
    ModerationQueue,
    BulkModerationAction,
    AutoModerationRule,

    // AI Assistant
    AIAdminAssistant,
    SmartAlert,

    // Dashboard
    AdminDashboardWidget,

    // Reports
    AdminReport,

    // Notifications
    AdminNotification,

    // Activity
    DetailedAdminActivity
} from './admin.enhanced'

// Re-export base admin types
export type {
    AdminRole,
    Permission,
    RoleConfig,
    AdminUser,
    SystemModule,
    ModuleConfig,
    AdminStats,
    AdminActivityLog
} from './admin'

export { ADMIN_ROLES } from './admin'

// ==========================================
// UTILITY EXPORTS
// ==========================================

export { MemberSystemUtils } from '../lib/memberSystemUtils'

// Individual utility functions
export {
    // Trust Score
    calculateTrustScore,
    getTrustLevel,
    getTrustLevelColor,
    getTrustLevelIcon,
    canUpgradeTrustLevel,

    // Behavior
    calculateRiskLevel,
    formatResponseTime,

    // Seller Tier
    calculateSellerTier,
    calculateTierProgress,
    getSellerTierBadgeProps,

    // Ratings
    calculateOverallRating,
    getRatingTrend,
    formatRating,
    getStarIcons,

    // Loyalty
    calculatePointsFromPurchase,
    getLoyaltyTier,
    getPointsToNextTier,
    formatPoints,

    // Gamification
    calculateLevel,
    getXPForNextLevel,
    getXPProgress,

    // Formatting
    formatDateThai,
    formatRelativeTime,
    formatCurrency,
    formatPercentage,
    formatNumber,

    // Validation
    validateThaiNationalID,
    validateThaiPhoneNumber,
    validateEmail,

    // Colors
    getScoreColor,
    getRiskColor
} from '../lib/memberSystemUtils'
