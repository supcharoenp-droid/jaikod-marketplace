import { SellerProfile, Review } from '@/types'

export interface TrustScoreDetails {
    totalScore: number
    level: 'basic' | 'trusted' | 'super_trusted'
    breakdown: {
        identity: number // Max 20
        behavior: number // Max 25
        listing: number // Max 20
        review: number // Max 25
        safety: number // Max 10
    }
    badges: string[]
    improvement_tips: string[]
}

export function calculateUserTrustScore(
    user: Partial<SellerProfile>,
    stats: {
        totalSales: number,
        accountAgeDays: number,
        responseRatePercent: number,
        reportCount: number,
        positiveReviewCount: number,
        totalReviewCount: number,
        verifiedPhone: boolean,
        verifiedEmail: boolean,
        verifiedIdentity: boolean,
    }
): TrustScoreDetails {
    let identityInfo = 0
    let behaviorInfo = 0
    let listingInfo = 0
    let reviewInfo = 0
    let safetyInfo = 0
    const tips: string[] = []

    // 1. Identity Score (20%)
    if (stats.verifiedPhone) identityInfo += 5
    else tips.push('ยืนยันเบอร์โทรศัพท์เพิ่มความน่าเชื่อถือ (+5%)')

    if (stats.verifiedEmail) identityInfo += 5
    else tips.push('ยืนยันอีเมล (+5%)')

    if (stats.verifiedIdentity) identityInfo += 10
    else tips.push('ยืนยันตัวตนด้วยบัตรประชาชน (eKYC) (+10%)')

    // 2. Behavior Score (25%)
    if (stats.accountAgeDays > 30) behaviorInfo += 5
    if (stats.accountAgeDays > 180) behaviorInfo += 5
    if (stats.responseRatePercent > 80) behaviorInfo += 10
    if (stats.totalSales > 0) behaviorInfo += 5

    // 3. Listing Quality (20%) - Simulated based on profile 
    // In real app, we check avg images per listing, desc length
    listingInfo = 15 // Assume average good quality for now

    // 4. Review Score (25%)
    if (stats.totalReviewCount > 0) {
        const ratingRatio = stats.positiveReviewCount / stats.totalReviewCount
        if (stats.totalReviewCount >= 5) reviewInfo += 5
        if (stats.totalReviewCount >= 20) reviewInfo += 10
        if (ratingRatio >= 0.9) reviewInfo += 10
    } else {
        tips.push('สะสมรีวิวจากการขายสินค้า (+25%)')
    }

    // 5. Safety Score (10%)
    safetyInfo = 10
    if (stats.reportCount > 0) {
        safetyInfo = Math.max(0, 10 - (stats.reportCount * 5))
        tips.push('รักษาประวัติให้ขาวสะอาดเพื่อคะแนนเต็ม')
    }

    const totalScore = identityInfo + behaviorInfo + listingInfo + reviewInfo + safetyInfo

    let level: TrustScoreDetails['level'] = 'basic'
    const badges: string[] = []

    if (totalScore >= 80 && stats.verifiedIdentity) {
        level = 'super_trusted'
        badges.push('Super Seller 💎')
    } else if (totalScore >= 50 && (stats.verifiedPhone || stats.verifiedIdentity)) {
        level = 'trusted'
        badges.push('Trusted ✅')
    }

    return {
        totalScore,
        level,
        breakdown: {
            identity: identityInfo,
            behavior: behaviorInfo,
            listing: listingInfo,
            review: reviewInfo,
            safety: safetyInfo
        },
        badges,
        improvement_tips: tips
    }
}
