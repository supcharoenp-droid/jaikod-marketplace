/**
 * Enhanced Member System - Utility Functions
 * JaiKod Marketplace
 * 
 * Helper functions for working with enhanced member types
 */

import {
    TrustLevel,
    TrustScore,
    BehaviorScore,
    GamificationProfile,
    EnhancedUser
} from '@/types/user.enhanced'

import {
    SellerTier,
    SellerTierInfo,
    DetailedRatings,
    SellerPerformance,
    SELLER_TIER_CONFIG
} from '@/types/seller.enhanced'

import {
    LoyaltyTier,
    LoyaltyProgram,
    LOYALTY_TIER_CONFIG
} from '@/types/loyalty'

// ==========================================
// TRUST SCORE UTILITIES
// ==========================================

/**
 * Calculate overall trust score from components
 */
export function calculateTrustScore(
    identityScore: number,
    transactionScore: number,
    behaviorScore: number,
    communityScore: number
): number {
    // Weighted average
    const weights = {
        identity: 0.3,
        transaction: 0.35,
        behavior: 0.25,
        community: 0.1
    }

    return Math.round(
        identityScore * weights.identity +
        transactionScore * weights.transaction +
        behaviorScore * weights.behavior +
        communityScore * weights.community
    )
}

/**
 * Get trust level from score
 */
export function getTrustLevel(score: number): TrustLevel {
    if (score >= 90) return 'diamond'
    if (score >= 75) return 'gold'
    if (score >= 50) return 'silver'
    return 'bronze'
}

/**
 * Get trust level color
 */
export function getTrustLevelColor(level: TrustLevel): string {
    const colors: Record<TrustLevel, string> = {
        bronze: '#CD7F32',
        silver: '#C0C0C0',
        gold: '#FFD700',
        diamond: '#B9F2FF'
    }
    return colors[level]
}

/**
 * Get trust level icon
 */
export function getTrustLevelIcon(level: TrustLevel): string {
    const icons: Record<TrustLevel, string> = {
        bronze: '🥉',
        silver: '🥈',
        gold: '🥇',
        diamond: '💎'
    }
    return icons[level]
}

/**
 * Check if user can upgrade trust level
 */
export function canUpgradeTrustLevel(currentScore: number, currentLevel: TrustLevel): boolean {
    const nextLevel = getNextTrustLevel(currentLevel)
    if (!nextLevel) return false

    const requiredScore = getTrustLevelMinScore(nextLevel)
    return currentScore >= requiredScore
}

function getNextTrustLevel(current: TrustLevel): TrustLevel | null {
    const levels: TrustLevel[] = ['bronze', 'silver', 'gold', 'diamond']
    const currentIndex = levels.indexOf(current)
    return currentIndex < levels.length - 1 ? levels[currentIndex + 1] : null
}

function getTrustLevelMinScore(level: TrustLevel): number {
    const minScores: Record<TrustLevel, number> = {
        bronze: 0,
        silver: 50,
        gold: 75,
        diamond: 90
    }
    return minScores[level]
}

// ==========================================
// BEHAVIOR SCORE UTILITIES
// ==========================================

/**
 * Calculate risk level from behavior metrics
 */
export function calculateRiskLevel(behavior: BehaviorScore): 'low' | 'medium' | 'high' | 'critical' {
    let riskScore = 0

    // Response rate (lower is worse)
    if (behavior.response_rate < 50) riskScore += 30
    else if (behavior.response_rate < 70) riskScore += 15

    // Cancellation rate (higher is worse)
    if (behavior.cancellation_rate > 20) riskScore += 30
    else if (behavior.cancellation_rate > 10) riskScore += 15

    // Dispute rate (higher is worse)
    if (behavior.dispute_rate > 10) riskScore += 25
    else if (behavior.dispute_rate > 5) riskScore += 10

    // Reports
    if (behavior.report_count > 5) riskScore += 20
    else if (behavior.report_count > 2) riskScore += 10

    if (riskScore >= 70) return 'critical'
    if (riskScore >= 50) return 'high'
    if (riskScore >= 30) return 'medium'
    return 'low'
}

/**
 * Format response time for display
 */
export function formatResponseTime(minutes: number): string {
    if (minutes < 60) return `${Math.round(minutes)} นาที`
    if (minutes < 1440) return `${Math.round(minutes / 60)} ชั่วโมง`
    return `${Math.round(minutes / 1440)} วัน`
}

// ==========================================
// SELLER TIER UTILITIES
// ==========================================

/**
 * Get seller tier from metrics
 */
export function calculateSellerTier(
    totalSales: number,
    totalRevenue: number,
    averageRating: number,
    totalReviews: number
): SellerTier {
    const tiers: SellerTier[] = ['top_seller', 'power_seller', 'established', 'rising', 'starter']

    for (const tier of tiers) {
        const config = SELLER_TIER_CONFIG[tier]
        if (
            totalSales >= config.requirements.min_sales &&
            totalRevenue >= config.requirements.min_revenue &&
            averageRating >= config.requirements.min_rating &&
            totalReviews >= config.requirements.min_reviews
        ) {
            return tier
        }
    }

    return 'starter'
}

/**
 * Calculate progress to next tier
 */
export function calculateTierProgress(
    currentTier: SellerTier,
    performance: SellerPerformance,
    ratings: DetailedRatings
): { sales: number, revenue: number, rating: number, overall: number } {
    const nextTier = getNextSellerTier(currentTier)
    if (!nextTier) return { sales: 100, revenue: 100, rating: 100, overall: 100 }

    const requirements = SELLER_TIER_CONFIG[nextTier].requirements

    const salesProgress = Math.min(100, (performance.total_sales / requirements.min_sales) * 100)
    const revenueProgress = Math.min(100, (performance.total_revenue / requirements.min_revenue) * 100)
    const ratingProgress = Math.min(100, (ratings.overall / requirements.min_rating) * 100)

    const overall = (salesProgress + revenueProgress + ratingProgress) / 3

    return {
        sales: Math.round(salesProgress),
        revenue: Math.round(revenueProgress),
        rating: Math.round(ratingProgress),
        overall: Math.round(overall)
    }
}

function getNextSellerTier(current: SellerTier): SellerTier | null {
    const tiers: SellerTier[] = ['starter', 'rising', 'established', 'power_seller', 'top_seller']
    const currentIndex = tiers.indexOf(current)
    return currentIndex < tiers.length - 1 ? tiers[currentIndex + 1] : null
}

/**
 * Get tier badge component props
 */
export function getSellerTierBadgeProps(tier: SellerTier) {
    const config = SELLER_TIER_CONFIG[tier]
    return {
        name: config.name_th,
        icon: config.icon,
        color: config.color,
        benefits: config.benefits
    }
}

// ==========================================
// RATING UTILITIES
// ==========================================

/**
 * Calculate overall rating from detailed ratings
 */
export function calculateOverallRating(ratings: Partial<DetailedRatings>): number {
    const {
        product_quality = 0,
        communication = 0,
        shipping_speed = 0,
        packaging = 0,
        accuracy = 0,
        value_for_money = 0
    } = ratings

    const sum = product_quality + communication + shipping_speed +
        packaging + accuracy + value_for_money
    const count = 6

    return Math.round((sum / count) * 10) / 10 // Round to 1 decimal
}

/**
 * Get rating trend
 */
export function getRatingTrend(
    currentAvg: number,
    last30DaysAvg: number,
    last90DaysAvg: number
): 'improving' | 'stable' | 'declining' {
    const threshold = 0.1

    if (currentAvg > last30DaysAvg + threshold) return 'improving'
    if (currentAvg < last30DaysAvg - threshold) return 'declining'
    return 'stable'
}

/**
 * Format rating for display
 */
export function formatRating(rating: number): string {
    return rating.toFixed(1)
}

/**
 * Get star icons for rating
 */
export function getStarIcons(rating: number): string {
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 >= 0.5
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0)

    return '⭐'.repeat(fullStars) +
        (hasHalfStar ? '✨' : '') +
        '☆'.repeat(emptyStars)
}

// ==========================================
// LOYALTY UTILITIES
// ==========================================

/**
 * Calculate points earned from purchase
 */
export function calculatePointsFromPurchase(
    amount: number,
    tier: LoyaltyTier
): number {
    const basePoints = Math.floor(amount / 100) // 1 point per 100 THB
    const multiplier = LOYALTY_TIER_CONFIG[tier].points_earn_multiplier
    return Math.floor(basePoints * multiplier)
}

/**
 * Get loyalty tier from points
 */
export function getLoyaltyTier(points: number): LoyaltyTier {
    const tiers: LoyaltyTier[] = ['diamond', 'platinum', 'gold', 'silver', 'bronze']

    for (const tier of tiers) {
        if (points >= LOYALTY_TIER_CONFIG[tier].points_required) {
            return tier
        }
    }

    return 'bronze'
}

/**
 * Calculate points to next tier
 */
export function getPointsToNextTier(currentPoints: number, currentTier: LoyaltyTier): number {
    const nextTier = getNextLoyaltyTier(currentTier)
    if (!nextTier) return 0

    const requiredPoints = LOYALTY_TIER_CONFIG[nextTier].points_required
    return Math.max(0, requiredPoints - currentPoints)
}

function getNextLoyaltyTier(current: LoyaltyTier): LoyaltyTier | null {
    const tiers: LoyaltyTier[] = ['bronze', 'silver', 'gold', 'platinum', 'diamond']
    const currentIndex = tiers.indexOf(current)
    return currentIndex < tiers.length - 1 ? tiers[currentIndex + 1] : null
}

/**
 * Format points for display
 */
export function formatPoints(points: number): string {
    if (points >= 1000000) return `${(points / 1000000).toFixed(1)}M`
    if (points >= 1000) return `${(points / 1000).toFixed(1)}K`
    return points.toString()
}

// ==========================================
// GAMIFICATION UTILITIES
// ==========================================

/**
 * Calculate level from experience points
 */
export function calculateLevel(xp: number): number {
    // Level formula: level = floor(sqrt(xp / 100))
    return Math.floor(Math.sqrt(xp / 100)) + 1
}

/**
 * Calculate XP needed for next level
 */
export function getXPForNextLevel(currentLevel: number): number {
    // Inverse of level formula
    return (currentLevel ** 2) * 100
}

/**
 * Calculate XP progress percentage
 */
export function getXPProgress(currentXP: number, currentLevel: number): number {
    const currentLevelXP = getXPForNextLevel(currentLevel - 1)
    const nextLevelXP = getXPForNextLevel(currentLevel)
    const xpInCurrentLevel = currentXP - currentLevelXP
    const xpNeededForLevel = nextLevelXP - currentLevelXP

    return Math.round((xpInCurrentLevel / xpNeededForLevel) * 100)
}

// ==========================================
// DATE & TIME UTILITIES
// ==========================================

/**
 * Format date for display (Thai format)
 */
export function formatDateThai(date: Date | string): string {
    const d = typeof date === 'string' ? new Date(date) : date
    return d.toLocaleDateString('th-TH', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    })
}

/**
 * Format relative time (e.g., "2 hours ago")
 */
export function formatRelativeTime(date: Date | string): string {
    const d = typeof date === 'string' ? new Date(date) : date
    const now = new Date()
    const diffMs = now.getTime() - d.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMins / 60)
    const diffDays = Math.floor(diffHours / 24)

    if (diffMins < 1) return 'เมื่อสักครู่'
    if (diffMins < 60) return `${diffMins} นาทีที่แล้ว`
    if (diffHours < 24) return `${diffHours} ชั่วโมงที่แล้ว`
    if (diffDays < 7) return `${diffDays} วันที่แล้ว`
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} สัปดาห์ที่แล้ว`
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} เดือนที่แล้ว`
    return `${Math.floor(diffDays / 365)} ปีที่แล้ว`
}

// ==========================================
// NUMBER FORMATTING UTILITIES
// ==========================================

/**
 * Format currency (Thai Baht)
 */
export function formatCurrency(amount: number): string {
    return new Intl.NumberFormat('th-TH', {
        style: 'currency',
        currency: 'THB',
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
    }).format(amount)
}

/**
 * Format percentage
 */
export function formatPercentage(value: number, decimals: number = 1): string {
    return `${value.toFixed(decimals)}%`
}

/**
 * Format large numbers (e.g., 1.5K, 2.3M)
 */
export function formatNumber(num: number): string {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return num.toString()
}

// ==========================================
// VALIDATION UTILITIES
// ==========================================

/**
 * Validate Thai national ID
 */
export function validateThaiNationalID(id: string): boolean {
    if (!/^\d{13}$/.test(id)) return false

    let sum = 0
    for (let i = 0; i < 12; i++) {
        sum += parseInt(id[i]) * (13 - i)
    }

    const checkDigit = (11 - (sum % 11)) % 10
    return checkDigit === parseInt(id[12])
}

/**
 * Validate Thai phone number
 */
export function validateThaiPhoneNumber(phone: string): boolean {
    // Remove spaces and dashes
    const cleaned = phone.replace(/[\s-]/g, '')

    // Check format: 0XXXXXXXXX (10 digits starting with 0)
    return /^0\d{9}$/.test(cleaned)
}

/**
 * Validate email
 */
export function validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
}

// ==========================================
// COLOR UTILITIES
// ==========================================

/**
 * Get color for score (0-100)
 */
export function getScoreColor(score: number): string {
    if (score >= 80) return '#10B981' // green
    if (score >= 60) return '#3B82F6' // blue
    if (score >= 40) return '#F59E0B' // amber
    if (score >= 20) return '#EF4444' // red
    return '#DC2626' // dark red
}

/**
 * Get color for risk level
 */
export function getRiskColor(risk: 'low' | 'medium' | 'high' | 'critical'): string {
    const colors = {
        low: '#10B981',
        medium: '#F59E0B',
        high: '#EF4444',
        critical: '#DC2626'
    }
    return colors[risk]
}

// ==========================================
// EXPORT ALL
// ==========================================

export const MemberSystemUtils = {
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
}
