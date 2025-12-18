import { UserProfileData } from './profileAnalyzer'

export type UserTier = 'buyer' | 'basic_seller' | 'verified_seller' | 'official_mall'

export interface TierConfig {
    id: UserTier
    label: string
    color: string
    badgeIcon: string
    requirements: {
        minTrustScore: number
        minSales: number
        minRating: number
        requiredVerification: ('id' | 'phone' | 'email' | 'business')[]
    }
    perks: string[]
}

export const TIER_LEVELS: Record<UserTier, TierConfig> = {
    buyer: {
        id: 'buyer',
        label: 'Member',
        color: 'gray',
        badgeIcon: 'user',
        requirements: { minTrustScore: 0, minSales: 0, minRating: 0, requiredVerification: [] },
        perks: ['Buy Products', 'Write Reviews', 'Save Wishlist']
    },
    basic_seller: {
        id: 'basic_seller',
        label: 'Basic Seller',
        color: 'blue',
        badgeIcon: 'store',
        requirements: { minTrustScore: 30, minSales: 0, minRating: 0, requiredVerification: ['email', 'phone'] },
        perks: ['Post up to 5 items', 'Basic Analytics', 'Chat with Buyers']
    },
    verified_seller: {
        id: 'verified_seller',
        label: 'Verified Seller',
        color: 'green',
        badgeIcon: 'shield-check',
        requirements: { minTrustScore: 70, minSales: 5, minRating: 4.0, requiredVerification: ['id', 'email', 'phone'] },
        perks: ['Unlimited Posts', 'Verified Badge', 'Priority Support', 'Advanced Analytics']
    },
    official_mall: {
        id: 'official_mall',
        label: 'Official Mall',
        color: 'purple',
        badgeIcon: 'crown',
        requirements: { minTrustScore: 90, minSales: 50, minRating: 4.8, requiredVerification: ['id', 'email', 'phone', 'business'] },
        perks: ['Official Mall Tag', 'Brand Banner', '0% Commission (Promo)', 'Exclusive Campaigns']
    }
}

export interface TierEvaluationResult {
    currentTier: TierConfig
    nextTier: TierConfig | null
    progress: number // 0-100
    missingRequirements: { label: string; current: number | boolean; target: number | boolean; isMet: boolean }[]
    isNearLevelUp: boolean // true if progress > 80%
}

export const evaluateUserTier = (data: UserProfileData, trustScore: number): TierEvaluationResult => {
    // 1. Determine Current Tier explicitly dependent on strict gates
    // Logic: Check highest tier metrics first, fallback if not met
    let currentTierKey: UserTier = 'buyer'

    // Check Mall
    if (trustScore >= 90 && data.successfulSales >= 50 && data.avgRating >= 4.8 && data.isIdVerified) {
        // strictly for mock simplicity assume business verified if metrics met
        currentTierKey = 'official_mall'
    } else if (trustScore >= 70 && data.successfulSales >= 5 && data.avgRating >= 4.0 && data.isIdVerified) {
        currentTierKey = 'verified_seller'
    } else if (data.productsPosted > 0 && data.isEmailVerified && data.isPhoneVerified) {
        currentTierKey = 'basic_seller'
    }

    const currentTier = TIER_LEVELS[currentTierKey]

    // 2. Determine Next Tier
    let nextTierKey: UserTier | null = null
    if (currentTierKey === 'buyer') nextTierKey = 'basic_seller'
    else if (currentTierKey === 'basic_seller') nextTierKey = 'verified_seller'
    else if (currentTierKey === 'verified_seller') nextTierKey = 'official_mall'

    if (!nextTierKey) {
        // Max level
        return {
            currentTier,
            nextTier: null,
            progress: 100,
            missingRequirements: [],
            isNearLevelUp: false
        }
    }

    const nextTier = TIER_LEVELS[nextTierKey]
    const reqs = nextTier.requirements
    const missing = []

    // 3. Calculate Gap
    let metCriteria = 0
    let totalCriteria = 0

    // Trust Score Gap
    totalCriteria++
    if (trustScore >= reqs.minTrustScore) metCriteria++
    else missing.push({ label: `Trust Score ${reqs.minTrustScore}+`, current: trustScore, target: reqs.minTrustScore, isMet: false })

    // Sales Gap
    if (reqs.minSales > 0) {
        totalCriteria++
        if (data.successfulSales >= reqs.minSales) metCriteria++
        else missing.push({ label: `${reqs.minSales} Successful Sales`, current: data.successfulSales, target: reqs.minSales, isMet: false })
    }

    // Rating Gap
    if (reqs.minRating > 0) {
        totalCriteria++
        if (data.avgRating >= reqs.minRating) metCriteria++
        else missing.push({ label: `Rating ${reqs.minRating}+`, current: data.avgRating, target: reqs.minRating, isMet: false })
    }

    // Verification Gap
    reqs.requiredVerification.forEach(v => {
        totalCriteria++
        let isMet = false
        if (v === 'email') isMet = data.isEmailVerified
        if (v === 'phone') isMet = data.isPhoneVerified
        if (v === 'id') isMet = data.isIdVerified
        if (v === 'business') isMet = data.isIdVerified // Mock mapping

        if (isMet) metCriteria++
        else missing.push({ label: `Verify ${v.toUpperCase()}`, current: false, target: true, isMet: false })
    })

    const progress = Math.round((metCriteria / totalCriteria) * 100)

    return {
        currentTier,
        nextTier,
        progress,
        missingRequirements: missing,
        isNearLevelUp: progress >= 75
    }
}
