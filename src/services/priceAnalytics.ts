export interface PriceAnalysisResult {
    status: 'optimal' | 'good_deal' | 'overpriced' | 'suspiciously_low'
    suggested_range: { min: number, max: number }
    average_price: number
    percentile: number // 0-100 where this price falls
    badges: ('Good Deal' | 'Hot Price' | 'Overpriced' | 'Suspicious')[]
    geo_pricing: {
        region: string
        avg_price: number
        diff_percent: number
    }[]
    confidence: number
}

// Mock database of market prices by category
const MARKET_DATA: Record<string, number[]> = {
    'mobile-tablet': [5000, 6000, 7500, 7800, 8000, 8200, 8500, 9000, 10000, 12000, 15000], // Avg ~8800
    'cameras': [12000, 14000, 15500, 16000, 18000, 22000, 25000, 30000],
    'fashion': [500, 800, 1200, 1500, 2000, 2500, 5000],
    // Default fallback
    'default': [1000, 2000, 3000, 4000, 5000]
}

const REGIONAL_FACTORS: Record<string, number> = {
    'กรุงเทพมหานคร': 1.1, // expensive
    'เชียงใหม่': 0.95, // cheaper
    'ภูเก็ต': 1.15, // tourist
    'ขอนแก่น': 0.9,
    'default': 1.0
}

export function analyzePrice(
    categorySlug: string,
    price: number,
    province: string = 'กรุงเทพมหานคร'
): PriceAnalysisResult {
    const prices = MARKET_DATA[categorySlug] || MARKET_DATA['default']

    // Sort and Math
    const sorted = [...prices].sort((a, b) => a - b)
    const sum = sorted.reduce((a, b) => a + b, 0)
    const avg = sum / sorted.length

    // Calculate Percentile
    let rank = 0
    for (let p of sorted) {
        if (price > p) rank++
    }
    const percentile = (rank / sorted.length) * 100

    // Determine Status
    let status: PriceAnalysisResult['status'] = 'optimal'
    const badges: PriceAnalysisResult['badges'] = []

    // Logic
    if (percentile < 10) {
        status = 'suspiciously_low'
        badges.push('Suspicious')
    } else if (percentile < 30) {
        status = 'good_deal'
        badges.push('Hot Price')
        badges.push('Good Deal')
    } else if (percentile > 85) {
        status = 'overpriced'
        badges.push('Overpriced')
    } else {
        status = 'optimal'
    }

    // Suggested Range (Interquartile Range -ish)
    const q1 = sorted[Math.floor(sorted.length * 0.25)]
    const q3 = sorted[Math.floor(sorted.length * 0.75)]

    // Geo Analysis
    const geo_pricing = [
        { region: 'กรุงเทพมหานคร', factor: 1.1 },
        { region: 'เชียงใหม่', factor: 0.95 },
        { region: 'อีสาน (เฉลี่ย)', factor: 0.9 }
    ].map(r => ({
        region: r.region,
        avg_price: Math.round(avg * r.factor),
        diff_percent: Math.round((price - (avg * r.factor)) / (avg * r.factor) * 100)
    }))

    return {
        status,
        suggested_range: { min: q1, max: q3 },
        average_price: Math.round(avg),
        percentile,
        badges,
        geo_pricing,
        confidence: 0.85
    }
}
