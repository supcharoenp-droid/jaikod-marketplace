/**
 * SEARCH ANALYTICS SERVICE
 * 
 * Track and analyze search behavior:
 * - Search queries and results
 * - Click tracking
 * - Zero-result monitoring
 * - Trending search calculation
 */

import { db } from '@/lib/firebase'
import {
    collection,
    addDoc,
    query,
    where,
    orderBy,
    limit,
    getDocs,
    serverTimestamp
} from 'firebase/firestore'

// ==========================================
// TYPES
// ==========================================

export interface SearchEvent {
    event_type: 'search' | 'click' | 'filter' | 'exit'

    // Query info
    query: string
    query_normalized: string

    // User context
    user_id?: string | null
    session_id: string
    device_type?: 'mobile' | 'desktop' | 'tablet'

    // Filters
    filters?: {
        category_id?: number
        min_price?: number
        max_price?: number
        province?: string
        condition?: string
        sort_by?: string
    }

    // Results
    results_count?: number
    execution_time_ms?: number

    // Click data
    clicked_item_id?: string
    clicked_item_type?: 'product' | 'listing'
    clicked_position?: number

    // AI analysis
    detected_intent?: string
    detected_brand?: string
    detected_category?: string

    // Timestamp
    created_at?: Date
}

export interface TrendingSearch {
    query: string
    search_count: number
    click_count: number
    ctr: number
    trend_score: number
    last_searched: Date
}

// ==========================================
// ANALYTICS SERVICE
// ==========================================

class SearchAnalyticsService {
    private static instance: SearchAnalyticsService
    private sessionId: string

    private constructor() {
        this.sessionId = this.generateSessionId()
    }

    public static getInstance(): SearchAnalyticsService {
        if (!SearchAnalyticsService.instance) {
            SearchAnalyticsService.instance = new SearchAnalyticsService()
        }
        return SearchAnalyticsService.instance
    }

    private generateSessionId(): string {
        if (typeof window !== 'undefined') {
            let sessionId = sessionStorage.getItem('jaikod_search_session')
            if (!sessionId) {
                sessionId = `sess_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
                sessionStorage.setItem('jaikod_search_session', sessionId)
            }
            return sessionId
        }
        return `server_${Date.now()}`
    }

    /**
     * Track a search event
     */
    async trackSearch(event: Partial<SearchEvent>): Promise<void> {
        try {
            const normalized = (event.query || '').toLowerCase().trim()

            // Build event object, excluding undefined values
            const fullEvent: Record<string, any> = {
                event_type: event.event_type || 'search',
                query: event.query || '',
                query_normalized: normalized,
                session_id: this.sessionId,
                device_type: this.detectDeviceType()
            }

            // Add optional fields only if they have values
            if (event.user_id !== undefined) fullEvent.user_id = event.user_id
            if (event.results_count !== undefined) fullEvent.results_count = event.results_count
            if (event.execution_time_ms !== undefined) fullEvent.execution_time_ms = event.execution_time_ms
            if (event.clicked_item_id) fullEvent.clicked_item_id = event.clicked_item_id
            if (event.clicked_item_type) fullEvent.clicked_item_type = event.clicked_item_type
            if (event.clicked_position !== undefined) fullEvent.clicked_position = event.clicked_position
            if (event.detected_intent) fullEvent.detected_intent = event.detected_intent
            if (event.detected_brand) fullEvent.detected_brand = event.detected_brand
            if (event.detected_category) fullEvent.detected_category = event.detected_category

            // Clean filters object - remove undefined values
            if (event.filters) {
                const cleanFilters: Record<string, any> = {}
                Object.entries(event.filters).forEach(([key, value]) => {
                    if (value !== undefined && value !== null) {
                        cleanFilters[key] = value
                    }
                })
                if (Object.keys(cleanFilters).length > 0) {
                    fullEvent.filters = cleanFilters
                }
            }

            await addDoc(collection(db, 'search_analytics'), {
                ...fullEvent,
                created_at: serverTimestamp()
            })

            // Update suggestion stats if search query
            if (event.event_type === 'search' && normalized.length >= 2) {
                await this.updateSuggestionStats(normalized, event.results_count || 0)
            }

        } catch (error) {
            console.error('[SearchAnalytics] Track error:', error)
        }
    }

    /**
     * Track a search result click
     */
    async trackClick(
        query: string,
        itemId: string,
        itemType: 'product' | 'listing',
        position: number,
        userId?: string
    ): Promise<void> {
        await this.trackSearch({
            event_type: 'click',
            query,
            user_id: userId,
            clicked_item_id: itemId,
            clicked_item_type: itemType,
            clicked_position: position
        })
    }

    /**
     * Get trending searches
     */
    async getTrendingSearches(limit_count: number = 10): Promise<TrendingSearch[]> {
        try {
            // Get popular search suggestions
            const suggestionsRef = collection(db, 'search_suggestions')
            const q = query(
                suggestionsRef,
                where('type', '==', 'trending'),
                orderBy('trend_score', 'desc'),
                limit(limit_count)
            )

            const snapshot = await getDocs(q)

            return snapshot.docs.map(doc => {
                const data = doc.data()
                return {
                    query: data.text || '',
                    search_count: data.search_count || 0,
                    click_count: data.click_count || 0,
                    ctr: data.click_count / Math.max(data.search_count, 1) * 100,
                    trend_score: data.trend_score || 0,
                    last_searched: data.updated_at?.toDate() || new Date()
                }
            })
        } catch (error) {
            console.error('[SearchAnalytics] Trending error:', error)

            // Return fallback trending
            return this.getFallbackTrending()
        }
    }

    /**
     * Get zero-result queries (for admin monitoring)
     */
    async getZeroResultQueries(days: number = 7): Promise<{ query: string, count: number }[]> {
        try {
            const cutoff = new Date()
            cutoff.setDate(cutoff.getDate() - days)

            const analyticsRef = collection(db, 'search_analytics')
            const q = query(
                analyticsRef,
                where('event_type', '==', 'search'),
                where('results_count', '==', 0),
                where('created_at', '>=', cutoff),
                orderBy('created_at', 'desc'),
                limit(100)
            )

            const snapshot = await getDocs(q)

            // Aggregate by query
            const queryMap = new Map<string, number>()
            snapshot.docs.forEach(doc => {
                const data = doc.data()
                const normalized = data.query_normalized || ''
                queryMap.set(normalized, (queryMap.get(normalized) || 0) + 1)
            })

            return Array.from(queryMap.entries())
                .map(([query, count]) => ({ query, count }))
                .sort((a, b) => b.count - a.count)
                .slice(0, 20)

        } catch (error) {
            console.error('[SearchAnalytics] Zero result error:', error)
            return []
        }
    }

    /**
     * Update search suggestion statistics
     */
    private async updateSuggestionStats(query: string, resultsCount: number): Promise<void> {
        // This would typically use a cloud function or batch update
        // For now, we'll skip to avoid too many writes
        // TODO: Implement with Firebase Functions or scheduled job
    }

    /**
     * Detect device type
     */
    private detectDeviceType(): 'mobile' | 'desktop' | 'tablet' {
        if (typeof window === 'undefined') return 'desktop'

        const ua = navigator.userAgent
        if (/tablet|ipad/i.test(ua)) return 'tablet'
        if (/mobile|android|iphone/i.test(ua)) return 'mobile'
        return 'desktop'
    }

    /**
     * Fallback trending searches
     */
    private getFallbackTrending(): TrendingSearch[] {
        const trending = [
            'iPhone 15 Pro Max',
            'PS5 มือสอง',
            'MacBook Air M2',
            'รถยนต์ Honda Civic',
            'คอนโดใกล้ BTS',
            'รองเท้า Nike Dunk',
            'กล้อง Fujifilm',
            'iPad Pro 2024',
            'Honda Wave 110i',
            'Apple Watch'
        ]

        return trending.map((query, i) => ({
            query,
            search_count: 1000 - i * 50,
            click_count: 400 - i * 20,
            ctr: 40 - i,
            trend_score: 100 - i * 5,
            last_searched: new Date()
        }))
    }
}

// Singleton export
export const searchAnalytics = SearchAnalyticsService.getInstance()

// Convenience functions
export function trackSearch(event: Partial<SearchEvent>): Promise<void> {
    return searchAnalytics.trackSearch(event)
}

export function trackSearchClick(
    query: string,
    itemId: string,
    itemType: 'product' | 'listing',
    position: number,
    userId?: string
): Promise<void> {
    return searchAnalytics.trackClick(query, itemId, itemType, position, userId)
}

export function getTrendingSearches(limit?: number): Promise<TrendingSearch[]> {
    return searchAnalytics.getTrendingSearches(limit)
}
