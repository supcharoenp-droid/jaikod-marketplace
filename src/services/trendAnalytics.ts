import { CATEGORIES } from '@/constants/categories'

// ==========================================
// 1. TYPES
// ==========================================

export interface CategoryTrendMetric {
    id: string
    name: string      // Default name (Thai for backward compat)
    name_th: string   // Thai name
    name_en: string   // English name
    slug: string
    icon: string
    searchVolume: number // 30%
    listingVolume: number // 25%
    clickVolume: number // 20%
    chatVolume: number // 15%
    purchaseIntent: number // 10%

    // Calculated
    trendScore: number
    growthRate: number // % change from last hour
}

export type TrendType = 'hot' | 'growing' | 'interest' | 'discount'

// ==========================================
// 2. MOCK ANALYTICS GENERATOR
// ==========================================

// Helper to get random int
const randomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min

export async function calculateCategoryTrends(): Promise<CategoryTrendMetric[]> {
    // In a real app, this would query an analytics DB (e.g. BigQuery, Mixpanel, or dedicated SQL stats table)
    // Here we simulate live data based on defined weights

    const trends: CategoryTrendMetric[] = CATEGORIES.map(cat => {
        // Simulate varying metrics
        const searchVol = randomInt(500, 5000)
        let listingVol = randomInt(10, 200)
        const clickVol = randomInt(1000, 10000)
        const chatVol = randomInt(50, 500)
        const intentScore = randomInt(1, 100) // normalized score

        // Bias for known popular categories
        if (cat.slug === 'mobile-tablet' || cat.slug === 'vehicles') {
            listingVol += 100
        }

        // Calculate Weighted Score (Total 100)
        // Normalize each metric roughly to 0-100 scale relative to max (simulated)
        const sNorm = (searchVol / 5000) * 100
        const lNorm = (listingVol / 300) * 100
        const cNorm = (clickVol / 10000) * 100
        const chNorm = (chatVol / 500) * 100
        const iNorm = intentScore

        const score = (
            (sNorm * 0.30) +
            (lNorm * 0.25) +
            (cNorm * 0.20) +
            (chNorm * 0.15) +
            (iNorm * 0.10)
        )

        return {
            id: String(cat.id),
            name: cat.name_th,
            name_th: cat.name_th,
            name_en: cat.name_en,
            slug: cat.slug,
            icon: cat.icon || '📦',
            searchVolume: searchVol,
            listingVolume: listingVol,
            clickVolume: clickVol,
            chatVolume: chatVol,
            purchaseIntent: intentScore,
            trendScore: Number(score.toFixed(1)),
            growthRate: randomInt(-10, 45) // Mock growth rate
        }
    })

    return trends.sort((a, b) => b.trendScore - a.trendScore)
}

// ==========================================
// 3. PUBLIC GETTERS
// ==========================================

export async function getHotTrends(limit: number = 4) {
    const all = await calculateCategoryTrends()
    return all.slice(0, limit)
}

export async function getFastGrowing(limit: number = 4) {
    const all = await calculateCategoryTrends()
    return all.sort((a, b) => b.growthRate - a.growthRate).slice(0, limit)
}

export async function getHighInterest(limit: number = 4) {
    const all = await calculateCategoryTrends()
    // Sort by click volume (interest)
    return all.sort((a, b) => b.clickVolume - a.clickVolume).slice(0, limit)
}

export async function getDiscountHeavy(limit: number = 4) {
    // Mock categories with high "purchase intent" often correlates with deals/value
    const all = await calculateCategoryTrends()
    return all.sort((a, b) => b.purchaseIntent - a.purchaseIntent).slice(0, limit)
}

// NEW: Hourly Aggregation for "Live Trends" Dashboard
export async function getHourlyTrendHighlights() {
    const all = await calculateCategoryTrends()

    // 1. Top Overall (Hot)
    const hot = all[0]

    // 2. Highest Growth (Fast Growing)
    const growing = [...all].sort((a, b) => b.growthRate - a.growthRate)[0]

    // 3. Highest Search (Most Searched)
    const searched = [...all].sort((a, b) => b.searchVolume - a.searchVolume)[0]

    return {
        hot,
        growing,
        searched,
        updateTime: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })
    }
}
