/**
 * UNIFIED SEARCH SERVICE
 * 
 * Enterprise-grade search that combines:
 * - Legacy products collection
 * - New listings collection
 * - AI-powered ranking
 * - Faceted filtering
 */

import { db } from '@/lib/firebase'
import {
    collection,
    query,
    where,
    orderBy,
    limit as firestoreLimit,
    startAfter,
    getDocs,
    QueryConstraint,
    DocumentSnapshot
} from 'firebase/firestore'
import { Product } from '@/types'
import { UniversalListing } from '@/types'
import { CATEGORIES } from '@/constants/categories'

// ==========================================
// TYPES
// ==========================================

export interface UnifiedSearchRequest {
    // Core
    query: string
    page?: number
    limit?: number

    // Filters
    category_id?: number
    subcategory_id?: number
    min_price?: number
    max_price?: number
    condition?: 'new' | 'used' | 'refurbished' | 'all'

    // Location
    province?: string
    max_distance_km?: number
    latitude?: number
    longitude?: number

    // Seller
    seller_verified?: boolean

    // Sort
    sort_by?: 'relevance' | 'newest' | 'price_asc' | 'price_desc' | 'distance' | 'ai_hybrid'

    // Source control
    include_products?: boolean
    include_listings?: boolean
}

export interface UnifiedSearchItem {
    id: string
    source: 'product' | 'listing'

    // Display
    title: string
    title_th?: string
    description?: string
    price: number
    currency: string

    // Media
    thumbnail: string
    images: string[]

    // Category
    category_id: number
    category_name?: string
    subcategory_id?: number

    // Location
    province?: string
    amphoe?: string

    // Seller
    seller_id: string
    seller_name?: string
    seller_verified?: boolean

    // Meta
    condition?: string
    views_count?: number
    created_at: Date | string

    // AI
    ai_score?: number
    distance_km?: number

    // Original data (for type-specific rendering)
    _raw?: Product | UniversalListing
}

export interface SearchFacet {
    id: string | number
    name: string
    name_th?: string
    count: number
}

export interface UnifiedSearchResponse {
    results: UnifiedSearchItem[]
    total_count: number
    page: number
    total_pages: number

    // Facets for filtering UI
    facets: {
        categories: SearchFacet[]
        conditions: SearchFacet[]
        price_ranges: { min: number, max: number, label: string, count: number }[]
        provinces: SearchFacet[]
    }

    // AI Suggestions
    suggestions: {
        related_keywords: string[]
        did_you_mean?: string
        similar_searches: string[]
    }

    // Analytics
    search_id: string
    execution_time_ms: number
}

// ==========================================
// SEARCH SERVICE
// ==========================================

export class UnifiedSearchService {
    private static instance: UnifiedSearchService

    public static getInstance(): UnifiedSearchService {
        if (!UnifiedSearchService.instance) {
            UnifiedSearchService.instance = new UnifiedSearchService()
        }
        return UnifiedSearchService.instance
    }

    /**
     * Main unified search function
     */
    async search(request: UnifiedSearchRequest): Promise<UnifiedSearchResponse> {
        const startTime = Date.now()
        const searchId = `search_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

        // Defaults
        const {
            query = '',
            page = 1,
            limit = 20,
            category_id,
            subcategory_id,
            min_price,
            max_price,
            condition = 'all',
            province,
            sort_by = 'relevance',
            include_products = true,
            include_listings = true
        } = request

        try {
            // Fetch from both sources in parallel
            const [products, listings] = await Promise.all([
                include_products ? this.searchProducts(request) : [],
                include_listings ? this.searchListings(request) : []
            ])

            console.log(`[UnifiedSearch] Fetched: ${products.length} products, ${listings.length} listings`)

            // Convert to unified format
            const unifiedProducts = products.map(p => this.productToUnified(p))
            const unifiedListings = listings.map(l => this.listingToUnified(l))

            // Merge and deduplicate
            let allResults = [...unifiedListings, ...unifiedProducts]

            console.log(`[UnifiedSearch] Before query filter: ${allResults.length} items`)

            // Apply text search filter
            if (query.trim()) {
                allResults = this.filterByQuery(allResults, query)
                console.log(`[UnifiedSearch] After query filter "${query}": ${allResults.length} items`)
            }

            // Apply filters
            allResults = this.applyFilters(allResults, {
                category_id,
                subcategory_id,
                min_price,
                max_price,
                condition,
                province
            })

            console.log(`[UnifiedSearch] After applyFilters: ${allResults.length} items`, {
                category_id, subcategory_id, min_price, max_price, condition, province
            })

            // Calculate AI scores and sort
            allResults = this.rankResults(allResults, sort_by, request)

            // Calculate facets before pagination
            const facets = this.calculateFacets(allResults)

            // Paginate
            const totalCount = allResults.length
            const totalPages = Math.ceil(totalCount / limit)
            const startIndex = (page - 1) * limit
            const paginatedResults = allResults.slice(startIndex, startIndex + limit)

            // Generate suggestions
            const suggestions = this.generateSuggestions(query, allResults)

            const executionTime = Date.now() - startTime

            return {
                results: paginatedResults,
                total_count: totalCount,
                page,
                total_pages: totalPages,
                facets,
                suggestions,
                search_id: searchId,
                execution_time_ms: executionTime
            }

        } catch (error) {
            console.error('[UnifiedSearch] Error:', error)
            return {
                results: [],
                total_count: 0,
                page: 1,
                total_pages: 0,
                facets: {
                    categories: [],
                    conditions: [],
                    price_ranges: [],
                    provinces: []
                },
                suggestions: {
                    related_keywords: [],
                    similar_searches: []
                },
                search_id: searchId,
                execution_time_ms: Date.now() - startTime
            }
        }
    }

    /**
     * Search legacy products collection
     */
    private async searchProducts(request: UnifiedSearchRequest): Promise<Product[]> {
        try {
            const productsRef = collection(db, 'products')

            // Try fetching without strict status filter first
            // Some products might not have status field or have different values
            const constraints: QueryConstraint[] = [
                firestoreLimit(200)
            ]

            const q = query(productsRef, ...constraints)
            const snapshot = await getDocs(q)

            console.log(`[UnifiedSearch] Raw products fetched: ${snapshot.size}`)

            // Filter in memory - accept active, or products without status
            const products = snapshot.docs
                .map(doc => ({
                    id: doc.id,
                    ...doc.data()
                } as Product))
                .filter(p => {
                    // Accept if status is active, or if status doesn't exist
                    const status = (p as any).status
                    return !status || status === 'active' || status === 'Active'
                })

            console.log(`[UnifiedSearch] Products after status filter: ${products.length}`)

            // Log first few products for debugging
            if (products.length > 0) {
                console.log('[UnifiedSearch] Sample product:', {
                    id: products[0].id,
                    title: products[0].title,
                    category_id: products[0].category_id,
                    status: (products[0] as any).status
                })
            }

            return products
        } catch (error) {
            console.error('[UnifiedSearch] Products fetch error:', error)
            return []
        }
    }

    /**
     * Search new listings collection
     */
    private async searchListings(request: UnifiedSearchRequest): Promise<UniversalListing[]> {
        try {
            const listingsRef = collection(db, 'listings')
            const constraints: QueryConstraint[] = [
                where('status', '==', 'active'),
                firestoreLimit(100)
            ]

            const q = query(listingsRef, ...constraints)
            const snapshot = await getDocs(q)

            return snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            } as UniversalListing))
        } catch (error) {
            console.error('[UnifiedSearch] Listings fetch error:', error)
            return []
        }
    }

    /**
     * Convert Product to UnifiedSearchItem
     */
    private productToUnified(product: Product): UnifiedSearchItem {
        // Handle images - they can be string[] or { url, order }[]
        const imageUrls: string[] = []
        if (product.images && Array.isArray(product.images)) {
            for (const img of product.images) {
                if (typeof img === 'string') {
                    imageUrls.push(img)
                } else if (img && typeof img === 'object' && 'url' in img) {
                    imageUrls.push((img as { url: string }).url)
                }
            }
        }

        // Use thumbnail_url first, then first image
        const thumbnail = product.thumbnail_url || imageUrls[0] || ''

        return {
            id: product.id,
            source: 'product',
            title: product.title,
            description: product.description,
            price: product.price,
            currency: 'THB',
            thumbnail: thumbnail,
            images: imageUrls,
            category_id: Number(product.category_id) || 0,
            category_name: CATEGORIES.find(c => c.id === Number(product.category_id))?.name_th,
            subcategory_id: product.sub_category_id ? Number(product.sub_category_id) : undefined,
            province: product.location_province,
            amphoe: product.location_amphoe,
            seller_id: product.seller_id,
            seller_name: product.seller?.name || product.seller_name,
            seller_verified: product.seller?.is_verified_seller,
            condition: product.condition,
            views_count: product.views_count,
            created_at: product.created_at,
            _raw: product
        }
    }

    /**
     * Convert Listing to UnifiedSearchItem
     */
    private listingToUnified(listing: UniversalListing): UnifiedSearchItem {
        return {
            id: listing.id,
            source: 'listing',
            title: listing.title,
            title_th: listing.title_th,
            description: listing.ai_content?.marketing_copy?.body_copy,
            price: listing.price,
            currency: listing.currency || 'THB',
            thumbnail: listing.thumbnail_url || listing.images?.[0]?.url || '/placeholder.jpg',
            images: listing.images?.map(img => img.url) || [],
            category_id: listing.category_id,
            category_name: CATEGORIES.find(c => c.id === listing.category_id)?.name_th,
            subcategory_id: listing.subcategory_id || undefined,
            province: listing.location?.province,
            amphoe: listing.location?.amphoe,
            seller_id: listing.seller_id,
            seller_name: listing.seller_info?.name,
            seller_verified: listing.seller_info?.verified,
            condition: listing.template_data?.condition,
            views_count: listing.stats?.views,
            created_at: listing.created_at,
            ai_score: listing.ai_content?.confidence_score,
            _raw: listing
        }
    }

    /**
     * Filter results by search query
     */
    private filterByQuery(results: UnifiedSearchItem[], query: string): UnifiedSearchItem[] {
        const lowerQuery = query.toLowerCase().trim()
        const queryTerms = lowerQuery.split(/\s+/)

        return results.filter(item => {
            const searchableText = [
                item.title,
                item.title_th,
                item.description,
                item.category_name,
                item.province,
                item.seller_name
            ].filter(Boolean).join(' ').toLowerCase()

            // Match if any term matches
            return queryTerms.some(term => searchableText.includes(term))
        })
    }

    /**
     * Apply filters to results
     */
    private applyFilters(results: UnifiedSearchItem[], filters: {
        category_id?: number
        subcategory_id?: number
        min_price?: number
        max_price?: number
        condition?: string
        province?: string
    }): UnifiedSearchItem[] {
        let filtered = [...results]

        if (filters.category_id) {
            filtered = filtered.filter(r => r.category_id === filters.category_id)
        }

        if (filters.subcategory_id) {
            filtered = filtered.filter(r => r.subcategory_id === filters.subcategory_id)
        }

        if (filters.min_price !== undefined) {
            filtered = filtered.filter(r => r.price >= filters.min_price!)
        }

        if (filters.max_price !== undefined) {
            filtered = filtered.filter(r => r.price <= filters.max_price!)
        }

        if (filters.condition && filters.condition !== 'all') {
            filtered = filtered.filter(r => r.condition === filters.condition)
        }

        if (filters.province) {
            filtered = filtered.filter(r =>
                r.province?.toLowerCase().includes(filters.province!.toLowerCase())
            )
        }

        return filtered
    }

    /**
     * Rank and sort results
     */
    private rankResults(
        results: UnifiedSearchItem[],
        sortBy: string,
        request: UnifiedSearchRequest
    ): UnifiedSearchItem[] {
        // Calculate AI scores for hybrid ranking
        const scored = results.map(item => {
            let score = 0

            // Base score from AI confidence
            score += (item.ai_score || 50) * 0.3

            // Boost for verified sellers
            if (item.seller_verified) score += 15

            // Boost for popularity
            score += Math.min((item.views_count || 0) / 100, 20)

            // Boost for new listings (source: listing)
            if (item.source === 'listing') score += 10

            // Boost for items with more images
            score += Math.min(item.images.length * 2, 10)

            // Recency boost (last 7 days)
            const createdAt = new Date(item.created_at)
            const daysSinceCreated = (Date.now() - createdAt.getTime()) / (1000 * 60 * 60 * 24)
            if (daysSinceCreated < 7) score += 15
            else if (daysSinceCreated < 30) score += 5

            return { ...item, ai_score: score }
        })

        // Sort based on sort_by
        switch (sortBy) {
            case 'price_asc':
                return scored.sort((a, b) => a.price - b.price)

            case 'price_desc':
                return scored.sort((a, b) => b.price - a.price)

            case 'newest':
                return scored.sort((a, b) =>
                    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
                )

            case 'distance':
                // Would require location calculation
                return scored.sort((a, b) => (a.distance_km || 999) - (b.distance_km || 999))

            case 'ai_hybrid':
            case 'relevance':
            default:
                return scored.sort((a, b) => (b.ai_score || 0) - (a.ai_score || 0))
        }
    }

    /**
     * Calculate facets for filter UI
     */
    private calculateFacets(results: UnifiedSearchItem[]): UnifiedSearchResponse['facets'] {
        // Category facets
        const categoryMap = new Map<number, { name: string, count: number }>()
        results.forEach(r => {
            if (r.category_id) {
                const existing = categoryMap.get(r.category_id)
                if (existing) {
                    existing.count++
                } else {
                    categoryMap.set(r.category_id, {
                        name: r.category_name || `Category ${r.category_id}`,
                        count: 1
                    })
                }
            }
        })

        const categories: SearchFacet[] = Array.from(categoryMap.entries())
            .map(([id, data]) => ({ id, name: data.name, count: data.count }))
            .sort((a, b) => b.count - a.count)

        // Condition facets
        const conditionMap = new Map<string, number>()
        results.forEach(r => {
            if (r.condition) {
                conditionMap.set(r.condition, (conditionMap.get(r.condition) || 0) + 1)
            }
        })

        const conditions: SearchFacet[] = Array.from(conditionMap.entries())
            .map(([name, count]) => ({ id: name, name, count }))

        // Price range facets
        const priceRanges = [
            { min: 0, max: 1000, label: 'ต่ำกว่า ฿1,000' },
            { min: 1000, max: 5000, label: '฿1,000 - ฿5,000' },
            { min: 5000, max: 10000, label: '฿5,000 - ฿10,000' },
            { min: 10000, max: 50000, label: '฿10,000 - ฿50,000' },
            { min: 50000, max: Infinity, label: 'มากกว่า ฿50,000' }
        ].map(range => ({
            ...range,
            count: results.filter(r => r.price >= range.min && r.price < range.max).length
        })).filter(r => r.count > 0)

        // Province facets
        const provinceMap = new Map<string, number>()
        results.forEach(r => {
            if (r.province) {
                provinceMap.set(r.province, (provinceMap.get(r.province) || 0) + 1)
            }
        })

        const provinces: SearchFacet[] = Array.from(provinceMap.entries())
            .map(([name, count]) => ({ id: name, name, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 10)

        return { categories, conditions, price_ranges: priceRanges, provinces }
    }

    /**
     * Generate search suggestions
     */
    private generateSuggestions(query: string, results: UnifiedSearchItem[]): UnifiedSearchResponse['suggestions'] {
        if (!query.trim()) {
            return {
                related_keywords: [],
                similar_searches: []
            }
        }

        // Extract keywords from results
        const keywords = new Set<string>()
        results.slice(0, 20).forEach(r => {
            // Extract brand-like words
            const words = r.title.split(/\s+/).filter(w =>
                w.length > 2 && /^[A-Za-z]/.test(w)
            )
            words.forEach(w => keywords.add(w))
        })

        return {
            related_keywords: Array.from(keywords).slice(0, 5),
            similar_searches: [
                `${query} มือสอง`,
                `${query} ราคาถูก`,
                `${query} ใหม่`,
                `${query} แท้`
            ].slice(0, 4)
        }
    }
}

// Singleton export
export const unifiedSearch = UnifiedSearchService.getInstance()

// Convenience function
export async function performUnifiedSearch(request: UnifiedSearchRequest): Promise<UnifiedSearchResponse> {
    return unifiedSearch.search(request)
}
