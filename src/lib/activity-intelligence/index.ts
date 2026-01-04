/**
 * Time + Activity Intelligence Engine
 * 
 * แสดงความสด + ความเคลื่อนไหวของโพสต์
 * ซื่อสัตย์ 100% - ใช้ข้อมูลจริงเท่านั้น
 */

// ==========================================
// TYPES
// ==========================================

export interface ActivityData {
    // Core time data
    createdAt: Date
    updatedAt?: Date

    // Activity metrics (all optional - only use what's available)
    viewsToday?: number
    viewsTotal?: number
    lastChatAt?: Date
    lastPriceUpdateAt?: Date
    wishlistCount?: number
    revisitCount?: number
    inquiryCount?: number
}

export interface ActivityDisplay {
    timeText: string
    activityText?: string
    icon: string
    activityIcon?: string
    freshness: 'very_fresh' | 'fresh' | 'moderate' | 'aging' | 'old'
    isActive: boolean // Has recent activity
}

export interface FreshnessInsight {
    score: number // 0-100
    level: 'hot' | 'warm' | 'neutral' | 'cold'
    recommendation: 'show_urgency' | 'normal' | 'encourage_refresh'
    shouldHighlight: boolean
}

// Category context for smart activity selection
export type CategoryContext = 'automotive' | 'real_estate' | 'general'

// ==========================================
// CORE TIME LOGIC
// ==========================================

/**
 * Format relative time - ซื่อสัตย์ ไม่กำกวม
 */
export function formatRelativeTime(
    date: Date,
    language: 'th' | 'en' = 'th'
): string {
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMinutes = Math.floor(diffMs / (1000 * 60))
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    // Rule: ห้ามใช้ "0 นาทีที่แล้ว" ค้าง
    if (diffMinutes < 1) {
        return language === 'th' ? 'เมื่อสักครู่' : 'Just now'
    }

    // < 1 hour → minutes
    if (diffMinutes < 60) {
        return language === 'th'
            ? `${diffMinutes} นาทีที่แล้ว`
            : `${diffMinutes} min ago`
    }

    // < 24 hours → hours
    if (diffHours < 24) {
        return language === 'th'
            ? `${diffHours} ชั่วโมงที่แล้ว`
            : `${diffHours} hr ago`
    }

    // < 7 days → days
    if (diffDays < 7) {
        if (diffDays === 1) {
            return language === 'th' ? 'เมื่อวาน' : 'Yesterday'
        }
        return language === 'th'
            ? `${diffDays} วันที่แล้ว`
            : `${diffDays} days ago`
    }

    // ≥ 7 days → weeks/general days (hide exact date)
    if (diffDays < 30) {
        const weeks = Math.floor(diffDays / 7)
        return language === 'th'
            ? `${weeks} สัปดาห์ที่แล้ว`
            : `${weeks} week${weeks > 1 ? 's' : ''} ago`
    }

    // > 30 days
    const months = Math.floor(diffDays / 30)
    return language === 'th'
        ? `${months} เดือนที่แล้ว`
        : `${months} month${months > 1 ? 's' : ''} ago`
}

/**
 * Format short relative time for activity (e.g., last chat)
 */
export function formatShortRelativeTime(
    date: Date,
    language: 'th' | 'en' = 'th'
): string {
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMinutes = Math.floor(diffMs / (1000 * 60))
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffMinutes < 1) {
        return language === 'th' ? 'เมื่อกี้' : 'just now'
    }

    if (diffMinutes < 60) {
        return language === 'th'
            ? `${diffMinutes} นาที`
            : `${diffMinutes}m`
    }

    if (diffHours < 24) {
        return language === 'th'
            ? `${diffHours} ชม.`
            : `${diffHours}h`
    }

    if (diffDays === 1) {
        return language === 'th' ? 'เมื่อวาน' : 'yesterday'
    }

    return language === 'th'
        ? `${diffDays} วัน`
        : `${diffDays}d`
}

// ==========================================
// ACTIVITY INTELLIGENCE
// ==========================================

interface ActivityOption {
    type: 'views_today' | 'last_chat' | 'price_update' | 'wishlist' | 'revisit'
    score: number // How "impressive" this activity is
    text_th: string
    text_en: string
    icon: string
}

/**
 * AI selects best 1-2 activities to show
 * Rule: เลือกเฉพาะ activity ที่ "ดูดีที่สุด"
 */
export function selectBestActivities(
    data: ActivityData,
    context: CategoryContext = 'general',
    language: 'th' | 'en' = 'th'
): ActivityOption[] {
    const options: ActivityOption[] = []
    const now = new Date()

    // 1. Views today (show if any views - threshold lowered for better engagement)
    if (data.viewsToday && data.viewsToday >= 1) {
        // Score based on views - higher views = more "impressive"
        const score = data.viewsToday >= 20 ? 85 :
            data.viewsToday >= 10 ? 70 :
                data.viewsToday >= 5 ? 50 : 30
        options.push({
            type: 'views_today',
            score,
            text_th: `มีคนดูวันนี้ ${data.viewsToday} คน`,
            text_en: `${data.viewsToday} views today`,
            icon: '👀'
        })
    }

    // 2. Last chat (very important for cars/real estate)
    if (data.lastChatAt) {
        const chatDiffHours = (now.getTime() - data.lastChatAt.getTime()) / (1000 * 60 * 60)
        if (chatDiffHours < 24) {
            // Recent chat is very valuable
            const timeText = formatShortRelativeTime(data.lastChatAt, language)
            let score = chatDiffHours < 1 ? 95 : chatDiffHours < 6 ? 80 : 60

            // Boost for automotive/real estate
            if (context === 'automotive' || context === 'real_estate') {
                score += 10
            }

            options.push({
                type: 'last_chat',
                score,
                text_th: `แชทล่าสุดเมื่อ ${timeText}ที่แล้ว`,
                text_en: `Last chat ${timeText} ago`,
                icon: '💬'
            })
        }
    }

    // 3. Price update (shows seller is active)
    if (data.lastPriceUpdateAt) {
        const updateDiffDays = (now.getTime() - data.lastPriceUpdateAt.getTime()) / (1000 * 60 * 60 * 24)
        if (updateDiffDays < 7) {
            const score = updateDiffDays < 1 ? 70 : 50
            const timeText = formatShortRelativeTime(data.lastPriceUpdateAt, language)
            options.push({
                type: 'price_update',
                score,
                text_th: `อัปเดตราคาเมื่อ ${timeText}ที่แล้ว`,
                text_en: `Price updated ${timeText} ago`,
                icon: '🔄'
            })
        }
    }

    // 4. Wishlist count
    if (data.wishlistCount && data.wishlistCount >= 3) {
        const score = Math.min(80, data.wishlistCount * 8)
        options.push({
            type: 'wishlist',
            score,
            text_th: `บันทึกไว้ ${data.wishlistCount} คน`,
            text_en: `Saved by ${data.wishlistCount}`,
            icon: '❤️'
        })
    }

    // 5. Revisit count (shows sustained interest)
    if (data.revisitCount && data.revisitCount >= 5) {
        const score = Math.min(60, data.revisitCount * 5)
        options.push({
            type: 'revisit',
            score,
            text_th: `มีคนดูซ้ำ ${data.revisitCount} ครั้ง`,
            text_en: `${data.revisitCount} revisits`,
            icon: '🔁'
        })
    }

    // Sort by score and return top 1-2
    const sorted = options.sort((a, b) => b.score - a.score)
    return sorted.slice(0, 2)
}

// ==========================================
// MAIN DISPLAY GENERATOR
// ==========================================

/**
 * Generate complete activity display for a listing
 */
export function generateActivityDisplay(
    data: ActivityData,
    context: CategoryContext = 'general',
    language: 'th' | 'en' = 'th'
): ActivityDisplay {
    const timeText = formatRelativeTime(data.createdAt, language)
    const now = new Date()
    const diffDays = (now.getTime() - data.createdAt.getTime()) / (1000 * 60 * 60 * 24)

    // Determine freshness
    let freshness: ActivityDisplay['freshness']
    if (diffDays < 1) freshness = 'very_fresh'
    else if (diffDays < 3) freshness = 'fresh'
    else if (diffDays < 7) freshness = 'moderate'
    else if (diffDays < 30) freshness = 'aging'
    else freshness = 'old'

    // Get best activities
    const activities = selectBestActivities(data, context, language)
    const isActive = activities.length > 0

    // Build activity text (max 1 activity to keep clean)
    let activityText: string | undefined
    let activityIcon: string | undefined

    if (activities.length > 0) {
        const best = activities[0]
        activityText = language === 'th' ? best.text_th : best.text_en
        activityIcon = best.icon
    }

    return {
        timeText,
        activityText,
        icon: '🕒',
        activityIcon,
        freshness,
        isActive
    }
}

// ==========================================
// AI FRESHNESS INSIGHT
// ==========================================

/**
 * AI evaluates freshness + activity for smart decisions
 */
export function calculateFreshnessInsight(
    data: ActivityData,
    context: CategoryContext = 'general'
): FreshnessInsight {
    const now = new Date()
    const diffDays = (now.getTime() - data.createdAt.getTime()) / (1000 * 60 * 60 * 24)

    let score = 100

    // Age penalty
    if (diffDays < 1) score -= 0
    else if (diffDays < 3) score -= 10
    else if (diffDays < 7) score -= 25
    else if (diffDays < 30) score -= 50
    else score -= 70

    // Activity boosts
    if (data.viewsToday && data.viewsToday > 10) score += 15
    if (data.lastChatAt) {
        const chatHours = (now.getTime() - data.lastChatAt.getTime()) / (1000 * 60 * 60)
        if (chatHours < 6) score += 20
        else if (chatHours < 24) score += 10
    }
    if (data.wishlistCount && data.wishlistCount > 5) score += 10
    if (data.updatedAt) {
        const updateDays = (now.getTime() - data.updatedAt.getTime()) / (1000 * 60 * 60 * 24)
        if (updateDays < 1) score += 15
        else if (updateDays < 3) score += 10
    }

    // Cap score
    score = Math.max(0, Math.min(100, score))

    // Determine level
    let level: FreshnessInsight['level']
    if (score >= 70) level = 'hot'
    else if (score >= 50) level = 'warm'
    else if (score >= 30) level = 'neutral'
    else level = 'cold'

    // Recommendation
    let recommendation: FreshnessInsight['recommendation']
    if (score >= 70) recommendation = 'show_urgency'
    else if (score >= 40) recommendation = 'normal'
    else recommendation = 'encourage_refresh'

    return {
        score,
        level,
        recommendation,
        shouldHighlight: score >= 60
    }
}

// ==========================================
// UTILITY FOR CATEGORY DETECTION
// ==========================================

export function detectCategoryContext(categoryId: number): CategoryContext {
    // Automotive categories
    if (categoryId === 1 || (categoryId >= 101 && categoryId <= 199)) {
        return 'automotive'
    }
    // Real estate
    if (categoryId === 3 || (categoryId >= 301 && categoryId <= 399)) {
        return 'real_estate'
    }
    return 'general'
}
