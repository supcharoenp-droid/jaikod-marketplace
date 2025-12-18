export interface AutoBoostSettings {
    isEnabled: boolean
    dailyBudget: number
    maxBidPerBoost: number
    targetRoas: number // Return on Ad Spend goal
}

export interface BoostAction {
    productId: string
    boostType: 'category_rank' | 'for_you_feed' | 'trending_page' | 'search_top'
    reason: string
    cost: number
    timestamp: number
    status: 'active' | 'completed' | 'failed'
    metrics: {
        impressions: number
        clicks: number
        ctrCode: 'high_ctr' | 'high_intent' // Internal trigger code
    }
}

// Mock AI Engine for Auto-Boost
export async function checkAndTriggerAutoBoost(
    productId: string,
    stats: {
        views_last_hour: number
        clicks_last_hour: number
        chats_last_hour: number
        category_trend_score: number
    },
    settings: AutoBoostSettings
): Promise<BoostAction | null> {

    // 0. Safety Check
    if (!settings.isEnabled || settings.dailyBudget <= 0) return null

    // 1. Calculate Momentum Score (AI Logic)
    const ctr = stats.views_last_hour > 0 ? (stats.clicks_last_hour / stats.views_last_hour) : 0

    let momentumScore = 0
    let triggerReason = ''
    let boostType: BoostAction['boostType'] = 'category_rank'

    // Condition A: High CTR (Viral Potential)
    if (ctr > 0.05 && stats.views_last_hour > 50) {
        momentumScore += 40
        triggerReason = 'CTR สูงผิดปกติ (Viral Potential)'
        boostType = 'trending_page'
    }

    // Condition B: High Intent (Many Chats)
    if (stats.chats_last_hour >= 3) {
        momentumScore += 30
        triggerReason = 'มีคนทักแชทเยอะในระยะสั้น'
        boostType = 'search_top'
    }

    // Condition C: Trend Alignment
    if (stats.category_trend_score > 80) {
        momentumScore += 15
        if (!triggerReason) {
            triggerReason = 'อยู่ในหมวดสินค้ามาแรง'
            boostType = 'for_you_feed'
        }
    }

    // Condition D: Velocity
    if (stats.views_last_hour > 100) {
        momentumScore += 20
        if (!triggerReason) {
            triggerReason = 'ยอดเข้าชมพุ่งสูงเร็วมาก'
            boostType = 'trending_page'
        }
    }

    // 2. Decision Threshold
    if (momentumScore >= 50) {
        // AI Decides to BOOST
        const cost = Math.min(settings.maxBidPerBoost, 5) // Mock cost calculation based on demand

        return {
            productId,
            boostType,
            reason: `${triggerReason} (Score: ${momentumScore})`,
            cost,
            timestamp: Date.now(),
            status: 'active',
            metrics: {
                impressions: 0,
                clicks: 0,
                ctrCode: ctr > 0.08 ? 'high_ctr' : 'high_intent'
            }
        }
    }

    return null
}

export async function getBoostHistory(productId: string): Promise<BoostAction[]> {
    // Mock history
    return [
        {
            productId,
            boostType: 'for_you_feed',
            reason: 'CTR สูงผิดปกติ (Viral Potential) (Score: 85)',
            cost: 4.5,
            timestamp: Date.now() - 3600000,
            status: 'completed',
            metrics: { impressions: 1500, clicks: 120, ctrCode: 'high_ctr' }
        },
        {
            productId,
            boostType: 'search_top',
            reason: 'มีคนทักแชทเยอะในระยะสั้น (Score: 60)',
            cost: 3.0,
            timestamp: Date.now() - 86400000,
            status: 'completed',
            metrics: { impressions: 800, clicks: 45, ctrCode: 'high_intent' }
        }
    ]
}
