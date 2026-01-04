import { Product, SellerProfile } from '@/types/index'
import type { UserBehavior } from './behaviorTracking'
import { calculateDistanceToProduct } from '@/lib/geolocation' // We'll need to double check this import

// ==========================================
// 1. TYPES
// ==========================================

export interface RankingFactors {
    userBehavior: number // 40%
    geoDistance: number // 25%
    categoryPop: number // 15%
    productQuality: number // 10%
    sellerQuality: number // 10%
}

export interface RankedProduct {
    product: Product
    totalScore: number
    factors: RankingFactors
    debugFactors?: any
}

export interface RankingContext {
    behavior: UserBehavior
    userLocation?: { lat: number, lng: number, province: string }
    trendingCategories?: { [id: string]: number } // id -> score (0-100)
}

// ==========================================
// 2. SCORING FUNCTIONS
// ==========================================

// 1. User Behavior Weight (40%)
function scoreUserBehavior(product: Product, behavior: UserBehavior): number {
    const { profile, viewedProducts, favoriteProductIds } = behavior
    let score = 0

    // A. Category Affinity (Max 50 pts)
    const catId = Number(product.category_id)
    const maxCatScore = Math.max(...Object.values(profile.categoryScores), 1)
    if (profile.categoryScores[catId]) {
        score += (profile.categoryScores[catId] / maxCatScore) * 50
    }

    // B. Price Affinity (Max 30 pts)
    if (profile.priceAffinity.avgPrice > 0 && product.price) {
        const diffRatio = Math.abs(product.price - profile.priceAffinity.avgPrice) / profile.priceAffinity.avgPrice
        // 0% diff -> 30 pts, 100% diff -> 0 pts
        score += Math.max(0, 30 * (1 - diffRatio))
    }

    // C. Interaction History (Max 20 pts)
    if (favoriteProductIds.includes(product.id)) {
        score += 20
    } else if (viewedProducts.includes(product.id)) {
        score += 5 // Slight boost if seen, depends on logic (seen but not bought vs re-viewing)
        // Actually, re-viewing logic is complex. Let's say if it's in history, slight interest.
    }

    return Math.min(score, 100)
}

// 2. Geo Distance Weight (25%)
async function scoreGeoDistance(product: Product, userProvince?: string): Promise<number> {
    if (!userProvince || !product.location_province) return 50 // Neutral score

    if (product.location_province === userProvince) return 100 // Perfect match

    // If we had lat/long, we'd do precise calc. For now, binary province match.
    // Ideally we call the geolocation service here.
    try {
        // Mock simple distance degradation
        return 40
    } catch {
        return 0
    }
}

// 3. Category Popularity (15%)
function scoreCategoryPopularity(product: Product, trendingMap?: { [id: string]: number }): number {
    if (!trendingMap) return 50
    const catId = String(product.category_id)
    return trendingMap[catId] || 20 // Default low
}

// 4. Product Quality Score (10%)
function scoreProductQuality(product: Product): number {
    let score = 50 // Base

    // Image Count & Quality
    if (product.images.length >= 3) score += 20
    if (product.images.length >= 5) score += 10

    // Description Length
    if (product.description.length > 200) score += 10
    if (product.description.length > 500) score += 10

    // Missing info penalty
    if (!product.condition) score -= 20

    return Math.min(Math.max(score, 0), 100)
}

// 5. Seller Quality Score (10%)
function scoreSellerQuality(product: Product): number {
    // If we have embedded seller data
    const seller = product.seller
    if (!seller) return 50 // Neutral if unknown

    let score = 60 // Base
    const ratingScore = seller.rating_score ?? seller.rating_avg ?? 0

    // Rating
    if (ratingScore >= 4.5) score += 20
    else if (ratingScore >= 4.0) score += 10
    else if (ratingScore < 3.0) score -= 20

    // Response
    if (seller.response_rate >= 90) score += 10

    // Verified
    if (seller.is_verified_seller) score += 10
    if (seller.badges?.includes('official_store')) score += 20

    return Math.min(Math.max(score, 0), 100)
}

// ==========================================
// 3. MAIN RANKING FUNCTION
// ==========================================

export async function rankProducts(
    products: Product[],
    context: RankingContext
): Promise<RankedProduct[]> {
    const scored = await Promise.all(products.map(async (p) => {
        // 1. Calculate Individual Scores
        const sBehavior = scoreUserBehavior(p, context.behavior)
        const sGeo = await scoreGeoDistance(p, context.userLocation?.province)
        const sCatPop = scoreCategoryPopularity(p, context.trendingCategories)
        const sProdQual = scoreProductQuality(p)
        const sSellerQual = scoreSellerQuality(p)

        // 2. Apply Weights
        // Behavior 40%, Geo 25%, CatPop 15%, ProdQual 10%, SellerQual 10%
        const totalScore = (
            (sBehavior * 0.40) +
            (sGeo * 0.25) +
            (sCatPop * 0.15) +
            (sProdQual * 0.10) +
            (sSellerQual * 0.10)
        )

        return {
            product: p,
            totalScore: Number(totalScore.toFixed(2)),
            factors: {
                userBehavior: sBehavior,
                geoDistance: sGeo,
                categoryPop: sCatPop,
                productQuality: sProdQual,
                sellerQuality: sSellerQual
            }
        }
    }))

    // 3. Sort by Total Score DESC
    return scored.sort((a, b) => b.totalScore - a.totalScore)
}

// ==========================================
// 4. HELPER: MOCK TRENDING DATA
// ==========================================
export function getMockTrendingCategories(): { [id: string]: number } {
    return {
        '1': 95, // Mobiles
        '2': 70, // Cars
        '3': 85, // Fashion
        '6': 60, // Amulets
        '10': 90 // IT
    }
}
