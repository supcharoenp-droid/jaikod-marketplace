/**
 * JaiKod AI Behavior Tracking & Recommendation Service
 * 
 * Tracks comprehensive user behavior to build a "User Persona"
 * Used for:
 * 1. Personalized Ranking (Search/Feed)
 * 2. Interest Profiling (Category, Price, Geo)
 * 3. Purchase Intent Prediction
 */

import { Product } from '@/types'
import { getProductsByIds, getAllProducts, searchProducts, getTrendingProducts } from '@/lib/products'
import { CATEGORIES } from '@/constants/categories'

// ==========================================
// 1. TYPES & INTERFACES
// ==========================================

export type InteractionType = 'view' | 'click' | 'like' | 'share' | 'add_to_cart' | 'contact_seller'

export interface ProductInteraction {
    productId: string | number
    categoryId: number
    type: InteractionType
    timestamp: number
    duration?: number // seconds (for views)
    price?: number
    location?: string // province
}

export interface SearchQuery {
    query: string
    timestamp: number
    filters?: {
        minPrice?: number
        maxPrice?: number
        categoryId?: number
        location?: string
    }
}

export interface UserInterestProfile {
    categoryScores: { [categoryId: number]: number } // Weighted score based on interactions
    brandAffinity: { [brand: string]: number }
    priceAffinity: {
        avgPrice: number
        minPreferred: number
        maxPreferred: number
    }
    geoPreferences: { [province: string]: number } // Province -> Visit count
    lastActive: number
}

export interface UserBehavior {
    interactions: ProductInteraction[]
    searchHistory: SearchQuery[]
    profile: UserInterestProfile
    totalVisits: number
    // Derived Intent Lists
    viewedProducts: string[] // IDs only for quick lookup
    favoriteProductIds: string[]
    contactedProductIds: string[]
}

const STORAGE_KEY = 'jaikod_user_behavior_v2'
const MAX_INTERACTIONS = 100
const MAX_SEARCH_HISTORY = 20

// Weight constants for scoring
const SCORES = {
    view: 1,
    click: 2,
    like: 5,
    share: 8,
    contact_seller: 15,
    add_to_cart: 10
}

// ==========================================
// 2. CORE STORAGE & STATE MANAGEMENT
// ==========================================

export function getUserBehavior(): UserBehavior {
    if (typeof window === 'undefined') return getDefaultBehavior()

    try {
        const stored = localStorage.getItem(STORAGE_KEY)
        if (stored) {
            const data = JSON.parse(stored)
            // Migration check or validation could go here
            return data
        }
    } catch (e) {
        console.error('Error reading behavior:', e)
    }
    return getDefaultBehavior()
}

function getDefaultBehavior(): UserBehavior {
    return {
        interactions: [],
        searchHistory: [],
        viewedProducts: [],
        favoriteProductIds: [],
        contactedProductIds: [],
        totalVisits: 1,
        profile: {
            categoryScores: {},
            brandAffinity: {},
            priceAffinity: { avgPrice: 0, minPreferred: 0, maxPreferred: Infinity },
            geoPreferences: {},
            lastActive: Date.now()
        }
    }
}

function saveBehavior(behavior: UserBehavior): void {
    if (typeof window === 'undefined') return
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(behavior))
    } catch (e) {
        console.error('Error saving behavior:', e)
    }
}

// ==========================================
// 3. TRACKING FUNCTIONS (INPUT)
// ==========================================

/**
 * Main entry point for tracking any product interaction
 */
export function trackInteraction(
    productId: string | number,
    inputType: InteractionType,
    metadata: {
        categoryId?: number,
        price?: number,
        location?: string,
        duration?: number
    } = {}
) {
    const behavior = getUserBehavior()
    const pidStr = String(productId)

    // 1. Record specific lists for quick access
    if (inputType === 'view' && !behavior.viewedProducts.includes(pidStr)) {
        behavior.viewedProducts.unshift(pidStr)
    }
    if (inputType === 'like') {
        if (!behavior.favoriteProductIds.includes(pidStr)) behavior.favoriteProductIds.push(pidStr)
    } else if (inputType === 'contact_seller') {
        if (!behavior.contactedProductIds.includes(pidStr)) behavior.contactedProductIds.push(pidStr)
    }

    // 2. Add to interaction log
    const interaction: ProductInteraction = {
        productId,
        categoryId: metadata.categoryId || 0,
        type: inputType,
        timestamp: Date.now(),
        duration: metadata.duration,
        price: metadata.price,
        location: metadata.location
    }
    behavior.interactions.unshift(interaction)
    behavior.interactions = behavior.interactions.slice(0, MAX_INTERACTIONS)

    // 3. Update AI Profile (Persona) immediately
    updateUserProfile(behavior, interaction)

    saveBehavior(behavior)
}

/**
 * Track search with detailed filters to understand intent
 */
export function trackSearch(query: string, resultsCount: number, filters?: SearchQuery['filters']): void {
    const behavior = getUserBehavior()

    behavior.searchHistory.unshift({
        query,
        timestamp: Date.now(),
        filters
    })
    behavior.searchHistory = behavior.searchHistory.slice(0, MAX_SEARCH_HISTORY)

    // Update Geo Preference if search contained location
    if (filters?.location) {
        behavior.profile.geoPreferences[filters.location] = (behavior.profile.geoPreferences[filters.location] || 0) + 5
    }

    saveBehavior(behavior)
}

export function trackVisit(): void {
    const behavior = getUserBehavior()
    behavior.totalVisits += 1
    behavior.profile.lastActive = Date.now()
    saveBehavior(behavior)
}

// Wrapper for simple view tracking (backward compatibility)
export function trackProductView(productId: string | number, categoryId: number, price?: number, location?: string): void {
    trackInteraction(productId, 'view', { categoryId, price, location })
}

export function trackFavorite(productId: string | number, isFavorite: boolean): void {
    const behavior = getUserBehavior()
    const pidStr = String(productId)

    if (isFavorite) {
        if (!behavior.favoriteProductIds.includes(pidStr)) {
            behavior.favoriteProductIds.push(pidStr)
            trackInteraction(productId, 'like') // Also logs interaction
            return // trackInteraction saves
        }
    } else {
        behavior.favoriteProductIds = behavior.favoriteProductIds.filter(id => id !== pidStr)
    }
    saveBehavior(behavior)
}

// ==========================================
// 4. AI ANALYSIS LOGIC (BEHIND THE SCENES)
// ==========================================

function updateUserProfile(behavior: UserBehavior, newAction: ProductInteraction) {
    const score = SCORES[newAction.type] || 1
    const profile = behavior.profile

    // A. Update Category Scores
    if (newAction.categoryId) {
        profile.categoryScores[newAction.categoryId] = (profile.categoryScores[newAction.categoryId] || 0) + score
    }

    // B. Update Price Affinity (Moving Average)
    if (newAction.price && newAction.price > 0) {
        const currentAvg = profile.priceAffinity.avgPrice
        // Use a simple weight to shift average towards new interest
        // Use count of interactions to stabilize, or fixed factor
        const weight = 0.1 // New price affects 10%
        profile.priceAffinity.avgPrice = (currentAvg === 0)
            ? newAction.price
            : Math.round(currentAvg * (1 - weight) + newAction.price * weight)

        // Adjust constraints gently
        if (newAction.price < profile.priceAffinity.minPreferred || profile.priceAffinity.minPreferred === 0) {
            profile.priceAffinity.minPreferred = newAction.price
        }
        if (newAction.price > profile.priceAffinity.maxPreferred || profile.priceAffinity.maxPreferred === Infinity) {
            profile.priceAffinity.maxPreferred = newAction.price
        }
    }

    // C. Update Geo Preferences
    if (newAction.location) {
        profile.geoPreferences[newAction.location] = (profile.geoPreferences[newAction.location] || 0) + score
    }
}

// ------------------------------------------
// 5. PUBLIC AI OUTPUT FUNCTIONS (PERSONALIZED FEED)
// ------------------------------------------
import { rankProducts, getMockTrendingCategories } from './aiRankingEngine'

/**
 * Get highly personalized product recommendations
 * Logic: Powered by AI Ranking Engine (5 Factors)
 */
export async function getPersonalizedRecommendations(limit: number = 20): Promise<Product[]> {
    const behavior = getUserBehavior()

    // 1. Fetch Candidates (Pool of 100 recent/trending products)
    const candidates = await getAllProducts(100)

    // 2. Prepare Ranking Context
    // In a real app, we'd get real user location from a context or geo API
    const context = {
        behavior: behavior,
        userLocation: { lat: 13.7563, lng: 100.5018, province: 'กรุงเทพมหานคร' }, // Mock Bangkok
        trendingCategories: getMockTrendingCategories()
    }

    // 3. Rank Products using AI Engine
    const rankedItems = await rankProducts(candidates, context)

    // 4. Return top products
    return rankedItems
        .map(item => item.product) // Extract product
        .slice(0, limit)
}

/**
 * Personalized Discounts: Products in interested categories that have price drops
 */
export async function getPersonalizedDiscounts(limit: number = 10): Promise<Product[]> {
    const behavior = getUserBehavior()
    const interestedCategoryIds = Object.keys(behavior.profile.categoryScores).map(Number)

    if (interestedCategoryIds.length === 0) return []

    const allProducts = await getAllProducts(100)

    return allProducts
        .filter(p =>
            interestedCategoryIds.includes(Number(p.category_id)) &&
            p.original_price &&
            p.price < p.original_price
        )
        .sort((a, b) => {
            // Sort by discount %
            const discountA = a.original_price ? (a.original_price - a.price) / a.original_price : 0
            const discountB = b.original_price ? (b.original_price - b.price) / b.original_price : 0
            return discountB - discountA
        })
        .slice(0, limit)
}

/**
 * Just Listed Near Me: Real-time local feed
 */
export async function getJustListedNearMe(limit: number = 10, maxDistanceKm: number = 50): Promise<Product[]> {
    const nearMeProducts = await getNearMeProducts(50, maxDistanceKm)

    // Sort by created_at (newest first) - assuming ID correlates with time or real dates exist
    // In real app, perform actual date sort. Here we mock sort.
    return nearMeProducts
        .sort((a, b) => {
            const dateA = new Date(a.created_at).getTime()
            const dateB = new Date(b.created_at).getTime()
            return dateB - dateA
        })
        .slice(0, limit)
}

/**
 * Intent Booster: AI detects strongest immediate intent
 */
export async function getIntentBooster(limit: number = 5): Promise<{ category: string, products: Product[] } | null> {
    const behavior = getUserBehavior()
    const { categoryScores } = behavior.profile

    // Find max score category
    let maxScore = 0
    let topCatId = 0

    Object.entries(categoryScores).forEach(([id, score]) => {
        if (score > maxScore) {
            maxScore = score
            topCatId = Number(id)
        }
    })

    if (maxScore < 5) return null // Not enough signal

    // Get Category Name
    const catName = CATEGORIES.find(c => c.id === topCatId)?.name_th || 'ที่คุณสนใจ'

    // Get top products in this category that haven't been bought yet
    const allProducts = await getAllProducts(50)
    const boostedProducts = allProducts
        .filter(p => Number(p.category_id) === topCatId && !behavior.contactedProductIds.includes(String(p.id)))
        .slice(0, limit)

    if (boostedProducts.length === 0) return null

    return { category: catName, products: boostedProducts }
}

/**
 * Main Feed Aggregator for "For You" Page
 */
import { getTrustedSellersNearMe } from './sellerScoring'

export async function getForYouFeed() {
    // Parallelize for performance
    const [
        aiRecommended,
        searchHistory,
        nearMe,
        trending,
        discounts,
        newLocal,
        intentBooster,
        trustedSellers
    ] = await Promise.all([
        getPersonalizedRecommendations(12),
        getBasedOnSearchHistory(6),
        getNearMeProducts(8, 20),
        getTrendingProducts(8),
        getPersonalizedDiscounts(6),
        getJustListedNearMe(6, 20),
        getIntentBooster(5),
        getTrustedSellersNearMe(13.7563, 100.5018) // Mock Bangkok Lat/Long
    ])

    return {
        aiRecommended,
        searchHistory,
        nearMe,
        trending,
        discounts,
        newLocal,
        intentBooster,
        trustedSellers
    }
}

/**
 * Predicts purchase intent based on frequent re-visits or deep interactions
 */
export async function getHighIntentProducts(limit: number = 5): Promise<Product[]> {
    const behavior = getUserBehavior()

    // Logic: Look for products with > 2 interactions (views/likes) or 'contact_seller'
    const intentScores: { [id: string]: number } = {}

    behavior.interactions.forEach(action => {
        const sid = String(action.productId)
        const weight = SCORES[action.type] || 1
        intentScores[sid] = (intentScores[sid] || 0) + weight
    })

    const highIntentIds = Object.entries(intentScores)
        .filter(([, score]) => score >= 3) // Threshold
        .sort(([, a], [, b]) => b - a)
        .slice(0, limit)
        .map(([id]) => id)

    if (highIntentIds.length === 0) return []

    return getProductsByIds(highIntentIds)
}

/**
 * Get Smart Budget Range for UI Filters
 */
export function getSmartBudgetRange(): { min: number, max: number, label: string } | null {
    const behavior = getUserBehavior()
    const { avgPrice } = behavior.profile.priceAffinity

    if (avgPrice === 0) return null

    // Range is roughly +/- 40% of average
    const min = Math.max(0, Math.floor(avgPrice * 0.6))
    const max = Math.ceil(avgPrice * 1.4)

    return {
        min,
        max,
        label: `฿${min.toLocaleString()} - ฿${max.toLocaleString()}`
    }
}

// ------------------------------------------
// LEGACY / HELPER EXPORTS (Maintained for UI compatibility)
// ------------------------------------------

export async function getRecentlyViewed(limit: number = 10): Promise<Product[]> {
    const behavior = getUserBehavior()
    const ids = behavior.viewedProducts.slice(0, limit)
    if (ids.length === 0) return []
    return getProductsByIds(ids)
}

export async function getBasedOnSearchHistory(limit: number = 10): Promise<{ query: string; products: Product[] } | null> {
    const behavior = getUserBehavior()
    const lastSearch = behavior.searchHistory[0]
    if (!lastSearch) return null

    const products = await searchProducts(lastSearch.query)
    return { query: lastSearch.query, products: products.slice(0, limit) }
}

export async function getBasedOnFavorites(limit: number = 10): Promise<Product[]> {
    const behavior = getUserBehavior()
    if (behavior.favoriteProductIds.length === 0) return []

    // Get similar active products in same categories as favorites
    // Simplified: Just return some products (Real implementation needs vector search)
    const products = await getProductsByIds(behavior.favoriteProductIds.slice(0, limit))
    return products
}

export async function getTrendingInInterests(limit: number = 10): Promise<Product[]> {
    return getPersonalizedRecommendations(limit) // Re-use smart logic
}

export async function getNearMeProducts(limit: number = 10, maxDistanceKm: number = 50): Promise<Product[]> {
    try {
        const { calculateDistanceToProduct } = await import('@/lib/geolocation')
        const allProducts = await getAllProducts(50)
        const productsWithDistance = await Promise.all(
            allProducts.map(async (p) => {
                if (!p.location_province) return { product: p, distance: Infinity }
                const distance = await calculateDistanceToProduct(p.location_province)
                return { product: p, distance: distance !== null ? distance : Infinity }
            })
        )
        return productsWithDistance
            .filter(item => item.distance <= maxDistanceKm)
            .sort((a, b) => a.distance - b.distance)
            .map(item => item.product)
            .slice(0, limit)
    } catch (error) {
        console.error('Error getting near me products:', error)
        return []
    }
}

export async function getFrequentCategories(limit: number = 5): Promise<{ id: number, count: number, name: string }[]> {
    const behavior = getUserBehavior()
    const sorted = Object.entries(behavior.profile.categoryScores)
        .sort(([, a], [, b]) => b - a)
        .slice(0, limit)
        .map(([id, score]) => {
            const numId = Number(id)
            let catName = 'Unknown'
            const mainCat = CATEGORIES.find(c => c.id === numId)
            if (mainCat) {
                catName = mainCat.name_th;
            } else {
                for (const c of CATEGORIES) {
                    const sub = c.subcategories?.find(s => s.id === numId);
                    if (sub) {
                        catName = sub.name_th;
                        break;
                    }
                }
            }
            return { id: numId, count: score, name: catName }
        })
    return sorted
}

export async function getHotDeals(limit: number = 10): Promise<Product[]> {
    const { getHotDealsProducts } = await import('@/lib/products');
    return getHotDealsProducts(limit);
}

export async function getTopSearches(limit: number = 5): Promise<string[]> {
    return ['iPhone 15', 'iPad Gen 10', 'Honda City', 'Sony A7IV', 'เสื้อผ้าแฟชั่น'].slice(0, limit);
}

export function clearBehavior(): void {
    if (typeof window === 'undefined') return
    localStorage.removeItem(STORAGE_KEY)
}
