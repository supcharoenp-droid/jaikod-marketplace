import { CATEGORIES } from '@/constants/categories'

export interface SafetyRiskAssessment {
    riskScore: number // 0-100 (High = Risky)
    verdict: 'safe' | 'warning' | 'high_risk' | 'rejected'
    flags: string[]
    detectedIssues: {
        type: 'counterfeit' | 'prohibited' | 'duplicate' | 'inappropriate'
        confidence: number
        details: string
    }[]
    actionRecommendations: string[]
    requiresAdminReview: boolean
}

// Mock Database of "Known Bad Images" (Hash simulation)
const FLAGGED_IMAGE_HASHES = ['hash_fake_rolex_1', 'hash_gun_img_2']

// Keywords for detection
const PROHIBITED_KEYWORDS = ['pills', 'drug', 'weapon', 'gun', 'ivory', 'tiger', 'bomb', 'ยาบ้า', 'ปืน', 'ระเบิด']
const LUXURY_BRANDS = ['rolex', 'gucci', 'louis vuitton', 'chanel', 'hermes', 'patek', 'iphone', 'samsung']

export async function analyzeListingSafety(
    title: string,
    description: string,
    price: number,
    categoryName: string
): Promise<SafetyRiskAssessment> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500))

    let score = 0
    const flags: string[] = []
    const issues: SafetyRiskAssessment['detectedIssues'] = []
    const recommendations: string[] = []

    const combinedText = (title + ' ' + description).toLowerCase()

    // 1. Check Prohibited Items (Illegal)
    const illegalMatch = PROHIBITED_KEYWORDS.find(k => combinedText.includes(k))
    if (illegalMatch) {
        score += 90
        flags.push('ILLEGAL_ITEM')
        issues.push({
            type: 'prohibited',
            confidence: 0.95,
            details: `Detected prohibited keyword: ${illegalMatch}`
        })
    }

    // 2. Check Counterfeit Risk (Price Logic)
    const brandMatch = LUXURY_BRANDS.find(k => combinedText.includes(k))
    if (brandMatch) {
        // If price is suspiciously low for a luxury item
        if (price < 2000) {
            score += 70
            flags.push('SUSPICIOUS_PRICE')
            issues.push({
                type: 'counterfeit',
                confidence: 0.85,
                details: `Price too low for brand: ${brandMatch} (Risk of counterfeit)`
            })
            recommendations.push('Please upload receipt or certificate of authenticity')
        }

        // If electronics (Phone) and price is weird
        if ((brandMatch === 'iphone' || brandMatch === 'samsung') && price < 3000) {
            score += 60
            flags.push('FAKE_ELECTRONICS')
            issues.push({
                type: 'counterfeit',
                confidence: 0.80,
                details: `Potential fake electronic device detected`
            })
        }
    }

    // Determine Verdict
    let verdict: SafetyRiskAssessment['verdict'] = 'safe'
    if (score >= 80) verdict = 'rejected'
    else if (score >= 50) verdict = 'high_risk'
    else if (score >= 20) verdict = 'warning'

    return {
        riskScore: Math.min(100, score),
        verdict,
        flags,
        detectedIssues: issues,
        actionRecommendations: recommendations,
        requiresAdminReview: score >= 50
    }
}

export async function checkImageDuplication(imageUrl: string): Promise<{ isDuplicate: boolean, source?: string }> {
    // Mock Duplicate Check
    // In real app: Compare image perceptual hash (pHash) with database
    await new Promise(resolve => setTimeout(resolve, 800))

    // Simulate 10% chance of duplicate
    const isDup = Math.random() < 0.1

    if (isDup) {
        return { isDuplicate: true, source: 'Found visible match on other_marketplace.com' }
    }

    return { isDuplicate: false }
}
