
export interface UserProfileData {
    userId: string
    role: 'buyer' | 'seller' | 'store'
    hasAvatar: boolean
    hasBio: boolean
    bioLength: number
    isIdVerified: boolean
    isPhoneVerified: boolean
    isEmailVerified: boolean
    avgResponseTimeMinutes: number // minutes
    lastLoginDaysAgo: number
    productsPosted: number
    successfulSales: number
    totalReviews: number
    avgRating: number // 1-5
    followers: number
    following: number
}

export interface AIProfileAnalysisResult {
    scores: {
        profile_score: number
        trust_score: number
        activity_score: number
        store_health_score?: number // Only for seller/store
    }
    analysis: {
        strengths: string[]
        weaknesses: string[]
        tags: string[] // e.g., "High Potential", "Rising Star"
    }
    timestamp: string
}

// Core Scoring Logic
export const analyzeUserProfile = (data: UserProfileData): AIProfileAnalysisResult => {
    let profileScore = 0
    let trustScore = 0
    let activityScore = 0
    let storeHealth = 0
    const strengths: string[] = []
    const weaknesses: string[] = []

    // 1. Calculate Profile Score (Completeness)
    if (data.hasAvatar) profileScore += 30
    else weaknesses.push('Missing profile picture')

    if (data.hasBio && data.bioLength > 20) profileScore += 20
    else if (!data.hasBio) weaknesses.push('No bio provided')
    else weaknesses.push('Bio is too short')

    if (data.isEmailVerified) profileScore += 10
    if (data.isPhoneVerified) profileScore += 20
    if (data.role !== 'buyer' && data.productsPosted > 0) profileScore += 20
    if (data.role === 'buyer' && data.following > 0) profileScore += 20

    // Cap at 100
    profileScore = Math.min(100, profileScore)

    // 2. Calculate Trust Score (Reliability)
    if (data.isIdVerified) {
        trustScore += 40
        strengths.push('Identity Verified')
    } else {
        weaknesses.push('Identity not verified (High Impact)')
    }

    if (data.isPhoneVerified) trustScore += 10
    if (data.avgRating >= 4.5) {
        trustScore += 20
        strengths.push('Excellent Rating')
    } else if (data.avgRating >= 4.0) trustScore += 10
    else if (data.totalReviews > 0 && data.avgRating < 3.0) weaknesses.push('Low rating average')

    // Response time impact
    if (data.avgResponseTimeMinutes < 30) {
        trustScore += 15
        strengths.push('Fast Responder')
    } else if (data.avgResponseTimeMinutes > 24 * 60) {
        trustScore -= 10
        weaknesses.push('Slow response time')
    }

    // History
    if (data.successfulSales > 10) trustScore += 15
    if (data.totalReviews > 5) trustScore += 10 // Social proof

    // Cap at 100
    trustScore = Math.min(100, trustScore)


    // 3. Calculate Activity Score (Engagement)
    if (data.lastLoginDaysAgo <= 1) activityScore += 30
    else if (data.lastLoginDaysAgo <= 7) activityScore += 15
    else weaknesses.push('Inactive recently')

    if (data.productsPosted > 0 && data.role !== 'buyer') {
        activityScore += Math.min(40, data.productsPosted * 2)
    }
    if (data.totalReviews > 0) activityScore += 10
    if (data.followers > 100) activityScore += 20

    activityScore = Math.min(100, activityScore)

    // 4. Store Health (For Sellers)
    if (data.role !== 'buyer') {
        let health = 0
        if (data.avgRating >= 4.5) health += 30
        if (data.successfulSales > 5) health += 20
        if (data.avgResponseTimeMinutes < 60) health += 20
        if (data.productsPosted >= 5) health += 15
        if (data.followers > 50) health += 15
        storeHealth = Math.min(100, health)
    }

    // Determine Tags based on analysis
    const tags = []
    if (trustScore > 80) tags.push('Trusted Seller')
    if (activityScore > 80) tags.push('Very Active')
    if (data.role === 'buyer' && profileScore > 80) tags.push('Verified Buyer')
    if (data.role !== 'buyer' && data.successfulSales > 50 && data.avgRating >= 4.8) tags.push('Elite Seller')

    return {
        scores: {
            profile_score: profileScore,
            trust_score: trustScore,
            activity_score: activityScore,
            store_health_score: data.role !== 'buyer' ? storeHealth : undefined
        },
        analysis: {
            strengths,
            weaknesses,
            tags
        },
        timestamp: new Date().toISOString()
    }
}
