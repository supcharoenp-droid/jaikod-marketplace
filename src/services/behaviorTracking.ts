/**
 * JaiKod AI Behavior Tracking & Recommendation Service
 * 
 * Tracks user behavior and provides personalized recommendations
 * Similar to Shopee, Lazada, AliExpress recommendation engines
 */

import { Product } from '@/types'
import { getProductsByIds, getAllProducts, searchProducts, getTrendingProducts } from '@/lib/products'
import { CATEGORIES } from '@/constants/categories'

// Types
export interface ViewedProduct {
    productId: string | number
    categoryId: number
    timestamp: number
    duration?: number // How long user viewed (in seconds)
}

export interface SearchQuery {
    query: string
    timestamp: number
    resultsCount: number
}

export interface UserBehavior {
    viewedProducts: ViewedProduct[]
    searchHistory: SearchQuery[]
    favoriteProductIds: (string | number)[]
    clickedCategories: { [categoryId: number]: number } // Category clicks count
    lastVisit: number
    totalVisits: number
}

const STORAGE_KEY = 'jaikod_user_behavior'
const MAX_VIEWED_PRODUCTS = 50
const MAX_SEARCH_HISTORY = 20

// Get behavior from localStorage
export function getUserBehavior(): UserBehavior {
    if (typeof window === 'undefined') {
        return getDefaultBehavior()
    }

    try {
        const stored = localStorage.getItem(STORAGE_KEY)
        if (stored) {
            return JSON.parse(stored)
        }
    } catch (e) {
        console.error('Error reading user behavior:', e)
    }

    return getDefaultBehavior()
}

function getDefaultBehavior(): UserBehavior {
    return {
        viewedProducts: [],
        searchHistory: [],
        favoriteProductIds: [],
        clickedCategories: {},
        lastVisit: Date.now(),
        totalVisits: 1
    }
}

// Save behavior to localStorage
function saveBehavior(behavior: UserBehavior): void {
    if (typeof window === 'undefined') return

    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(behavior))
    } catch (e) {
        console.error('Error saving user behavior:', e)
    }
}

// Track product view
export function trackProductView(productId: string | number, categoryId: number): void {
    const behavior = getUserBehavior()

    // Remove if already exists (to update position)
    behavior.viewedProducts = behavior.viewedProducts.filter(v => v.productId !== productId)

    // Add to beginning
    behavior.viewedProducts.unshift({
        productId,
        categoryId,
        timestamp: Date.now()
    })

    // Limit array size
    behavior.viewedProducts = behavior.viewedProducts.slice(0, MAX_VIEWED_PRODUCTS)

    // Track category interest
    behavior.clickedCategories[categoryId] = (behavior.clickedCategories[categoryId] || 0) + 1

    saveBehavior(behavior)
}

// Track search query
export function trackSearch(query: string, resultsCount: number): void {
    const behavior = getUserBehavior()

    behavior.searchHistory.unshift({
        query,
        timestamp: Date.now(),
        resultsCount
    })

    // Limit array size
    behavior.searchHistory = behavior.searchHistory.slice(0, MAX_SEARCH_HISTORY)

    saveBehavior(behavior)
}

// Track favorite
export function trackFavorite(productId: string | number, isFavorite: boolean): void {
    const behavior = getUserBehavior()

    if (isFavorite) {
        if (!behavior.favoriteProductIds.includes(productId)) {
            behavior.favoriteProductIds.push(productId)
        }
    } else {
        behavior.favoriteProductIds = behavior.favoriteProductIds.filter(id => id !== productId)
    }

    saveBehavior(behavior)
}

// Track visit
export function trackVisit(): void {
    const behavior = getUserBehavior()
    behavior.lastVisit = Date.now()
    behavior.totalVisits += 1
    saveBehavior(behavior)
}

// ==========================================
// AI RECOMMENDATION ENGINE
// ==========================================

// Get recently viewed products
export async function getRecentlyViewed(limit: number = 10): Promise<Product[]> {
    const behavior = getUserBehavior()
    const recentIds = behavior.viewedProducts.slice(0, limit).map(v => String(v.productId))

    if (recentIds.length === 0) return []

    const products = await getProductsByIds(recentIds)
    return products.sort((a, b) => {
        return recentIds.indexOf(String(a.id)) - recentIds.indexOf(String(b.id))
    })
}

// Get products based on search history
export async function getBasedOnSearchHistory(limit: number = 10): Promise<{ query: string; products: Product[] } | null> {
    const behavior = getUserBehavior()

    if (behavior.searchHistory.length === 0) return null

    // Get most recent search with results
    const recentSearch = behavior.searchHistory.find(s => s.resultsCount > 0)
    if (!recentSearch) return null

    const query = recentSearch.query
    const products = await searchProducts(query)

    return {
        query: query,
        products: products.slice(0, limit)
    }
}

// Get personalized recommendations based on interests
export async function getPersonalizedRecommendations(limit: number = 20): Promise<Product[]> {
    const behavior = getUserBehavior()

    // Calculate category weights
    const categoryWeights: { [id: number]: number } = { ...behavior.clickedCategories }

    behavior.viewedProducts.forEach(v => {
        categoryWeights[v.categoryId] = (categoryWeights[v.categoryId] || 0) + 0.5
    })

    const sortedCategories = Object.entries(categoryWeights)
        .sort(([, a], [, b]) => b - a)
        .map(([id]) => parseInt(id))

    // If no behavior, return trending
    if (sortedCategories.length === 0) {
        return getTrendingProducts(limit)
    }

    // Get all active products to filter (Optimization: in production, query by category)
    const allProducts = await getAllProducts(100)
    const viewedIds = behavior.viewedProducts.map(v => String(v.productId))

    const recommendations = allProducts
        .filter(p => !viewedIds.includes(String(p.id)))
        .map(p => {
            let score = 0
            // Category score
            if (sortedCategories.includes(Number(p.category_id))) {
                const rank = sortedCategories.indexOf(Number(p.category_id))
                score += (10 - rank) * 2
            }
            // Tags/Meta score
            if (p.is_trending) score += 3
            if (p.is_best_seller) score += 3

            return { product: p, score }
        })
        .filter(item => item.score > 0)
        .sort((a, b) => b.score - a.score)
        .map(item => item.product)

    return recommendations.slice(0, limit)
}

// Get similar products to a specific product
export async function getSimilarProducts(productId: string | number, limit: number = 8): Promise<Product[]> {
    // Start with picking from all products (since we don't have the product details here directly to know category without fetching)
    // To be efficient, we assume caller might pass category, but signature is fixed for now.
    // Fetch all for filtering.
    const allProducts = await getAllProducts(100)
    const targetId = String(productId)

    // Find target product to get category
    const targetProduct = allProducts.find(p => String(p.id) === targetId)
    if (!targetProduct) return []

    const similar = allProducts.filter(p =>
        p.category_id === targetProduct.category_id &&
        String(p.id) !== targetId
    )

    return similar.slice(0, limit)
}

// Get "You may also like" based on favorites
export async function getBasedOnFavorites(limit: number = 10): Promise<Product[]> {
    const behavior = getUserBehavior()

    if (behavior.favoriteProductIds.length === 0) return []

    const favIds = behavior.favoriteProductIds.map(id => String(id))
    const favProducts = await getProductsByIds(favIds)

    if (!favProducts.length) return []

    const favCategories = [...new Set(favProducts.map(p => p.category_id))]

    const allProducts = await getAllProducts(100)

    const recommendations = allProducts.filter(p =>
        favCategories.includes(p.category_id) &&
        !favIds.includes(String(p.id))
    )

    return recommendations.slice(0, limit)
}

// Get trending in user's interested categories
export async function getTrendingInInterests(limit: number = 10): Promise<Product[]> {
    const behavior = getUserBehavior()

    const interestCategories = Object.entries(behavior.clickedCategories)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 3)
        .map(([id]) => parseInt(id))

    if (interestCategories.length === 0) {
        return getTrendingProducts(limit)
    }

    const allProducts = await getAllProducts(100)

    const trending = allProducts.filter(p =>
        interestCategories.includes(Number(p.category_id)) &&
        (p.is_trending || p.views_count > 1000)
    )

    return trending.slice(0, limit)
}

// Clear all behavior data
export function clearBehavior(): void {
    if (typeof window === 'undefined') return
    localStorage.removeItem(STORAGE_KEY)
}
