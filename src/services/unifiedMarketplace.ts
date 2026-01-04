// Unified Marketplace Service

/**
 * Unified Marketplace Service
 * 
 * Combines data from both legacy 'products' collection and new 'listings' collection
 * into a unified format for display across the platform.
 * 
 * Phase 1: Integration - supports both systems during transition
 * Phase 2: Migration - will move all products to listings
 */

import { db } from '@/lib/firebase'
import {
    collection,
    query,
    where,
    orderBy,
    limit,
    getDocs,
    Timestamp,
    startAfter,
    DocumentSnapshot
} from 'firebase/firestore'
import type { UniversalListing } from '@/types'
import { toThaiProvince, toThaiAmphoe } from '@/lib/location-localization'

// Unified product interface for display
export interface UnifiedProduct {
    id: string
    source: 'product' | 'listing'

    // Core info
    title: string
    price: number
    originalPrice?: number
    currency: string

    // Images
    thumbnailUrl: string
    images: Array<{ url: string; order: number }>

    // Category
    categoryId: number
    subcategoryId?: number
    categoryType?: string

    // Seller
    sellerId: string
    sellerName: string
    sellerAvatar?: string
    sellerVerified: boolean

    // Location
    province?: string
    amphoe?: string
    distance?: number  // Distance from user in km (calculated client-side)

    // Status
    condition: string
    status: string
    listingCode?: string  // JK-AXXXXX for new listings
    slug: string

    // Stats
    views: number
    favorites: number

    // Timestamps
    createdAt: Date
    updatedAt: Date

    // AI Features (for new listings)
    aiScore?: number
    aiSummary?: string[]
    priceAnalysis?: string
}

// Convert legacy product to unified format
function convertProduct(doc: any): UnifiedProduct {
    const data = doc.data()
    const createdAt = data.created_at instanceof Timestamp
        ? data.created_at.toDate()
        : new Date(data.created_at || Date.now())

    return {
        id: doc.id,
        source: 'product',
        title: data.title || '',
        price: data.price || 0,
        originalPrice: data.original_price,
        currency: 'THB',
        thumbnailUrl: data.thumbnail_url || data.images?.[0]?.url || '/placeholder.svg',
        images: data.images || [],
        categoryId: data.category_id || 0,
        subcategoryId: data.subcategory_id,
        sellerId: data.seller_id || '',
        sellerName: data.seller_name || 'Seller',
        sellerVerified: data.is_verified_seller || false,
        province: toThaiProvince(data.location_province),
        amphoe: toThaiAmphoe(data.location_amphoe),
        condition: data.condition || 'used',
        status: data.status || 'active',
        slug: data.slug || doc.id,
        views: data.views_count || 0,
        favorites: data.favorites_count || 0,
        createdAt,
        updatedAt: createdAt, // Legacy products may not have updated_at
    }
}

// Convert new listing to unified format
export function convertListing(doc: any): UnifiedProduct {
    const data = doc.data()
    const createdAt = data.created_at instanceof Timestamp
        ? data.created_at.toDate()
        : new Date(data.created_at?.seconds ? data.created_at.seconds * 1000 : Date.now())
    const updatedAt = data.updated_at instanceof Timestamp
        ? data.updated_at.toDate()
        : new Date(data.updated_at?.seconds ? data.updated_at.seconds * 1000 : Date.now())

    return {
        id: doc.id,
        source: 'listing',
        title: data.title || data.title_th || '',
        price: data.price || 0,
        originalPrice: data.original_price,
        currency: data.currency || 'THB',
        thumbnailUrl: data.thumbnail_url || data.images?.[0]?.url || '/placeholder.svg',
        images: data.images || [],
        categoryId: data.category_id || 0,
        subcategoryId: data.subcategory_id,
        categoryType: data.category_type,
        sellerId: data.seller_id || '',
        sellerName: data.seller_info?.name || 'Seller',
        sellerAvatar: data.seller_info?.avatar,
        sellerVerified: data.seller_info?.verified || false,
        province: toThaiProvince(data.location?.province),
        amphoe: toThaiAmphoe(data.location?.amphoe),
        condition: data.template_data?.condition || 'used',
        status: data.status || 'active',
        listingCode: data.listing_code,
        slug: data.slug || doc.id,
        views: data.stats?.views || 0,
        favorites: data.stats?.favorites || 0,
        createdAt,
        updatedAt,
        aiScore: data.ai_content?.confidence_score,
        aiSummary: data.ai_content?.marketing_copy?.selling_points,
        priceAnalysis: data.ai_content?.price_analysis,
    }
}

// Convert UniversalListing to UnifiedProduct (for use with already-fetched listing data)
export function listingToUnifiedProduct(listing: UniversalListing): UnifiedProduct {
    return {
        id: listing.id,
        source: 'listing',
        title: listing.title || listing.title_th || '',
        price: listing.price || 0,
        currency: listing.currency || 'THB',
        thumbnailUrl: listing.thumbnail_url || listing.images?.[0]?.url || '/placeholder.svg',
        images: listing.images || [],
        categoryId: listing.category_id || 0,
        subcategoryId: listing.subcategory_id || undefined,
        categoryType: listing.category_type,
        sellerId: listing.seller_id || '',
        sellerName: listing.seller_info?.name || 'Seller',
        sellerAvatar: listing.seller_info?.avatar,
        sellerVerified: listing.seller_info?.verified || false,
        province: toThaiProvince(listing.location?.province),
        amphoe: toThaiAmphoe(listing.location?.amphoe),
        condition: listing.template_data?.condition || 'used',
        status: listing.status || 'active',
        listingCode: listing.listing_code,
        slug: listing.slug || listing.id,
        views: listing.stats?.views || 0,
        favorites: listing.stats?.favorites || 0,
        createdAt: listing.created_at instanceof Date ? listing.created_at : new Date(),
        updatedAt: listing.updated_at instanceof Date ? listing.updated_at : new Date(),
        aiScore: listing.ai_content?.confidence_score,
        aiSummary: listing.ai_content?.marketing_copy?.selling_points,
        priceAnalysis: listing.ai_content?.price_analysis
            ? (typeof listing.ai_content.price_analysis === 'string'
                ? listing.ai_content.price_analysis
                : JSON.stringify(listing.ai_content.price_analysis))
            : undefined,
    }
}

/**
 * Get new arrivals from both collections (listings first, then products)
 */
export async function getUnifiedNewArrivals(count: number = 12): Promise<UnifiedProduct[]> {
    const results: UnifiedProduct[] = []

    try {
        // 1. First, get from new listings collection (priority)
        const listingsQuery = query(
            collection(db, 'listings'),
            where('status', '==', 'active'),
            orderBy('created_at', 'desc'),
            limit(count)
        )
        const listingsSnap = await getDocs(listingsQuery)
        listingsSnap.docs.forEach(doc => {
            results.push(convertListing(doc))
        })

        // 2. Fill with legacy products if needed
        const remaining = count - results.length
        if (remaining > 0) {
            const productsQuery = query(
                collection(db, 'products'),
                limit(remaining + 10)
            )
            const productsSnap = await getDocs(productsQuery)
            productsSnap.docs.forEach(doc => {
                const data = doc.data()
                if (data.status === 'active') {
                    results.push(convertProduct(doc))
                }
            })
        }

        // Sort by createdAt (newest first)
        results.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())

        const listingCount = results.filter(r => r.source === 'listing').length
        console.log(`📦 Unified New Arrivals: ${results.length} items (${listingCount} listings, ${results.length - listingCount} products)`)

    } catch (error) {
        console.error('Error fetching unified new arrivals:', error)
    }

    return results.slice(0, count)
}

/**
 * Search across both collections
 */
export async function unifiedSearch(
    searchQuery: string,
    options?: {
        categoryId?: number
        minPrice?: number
        maxPrice?: number
        condition?: string
        province?: string
        limit?: number
    }
): Promise<UnifiedProduct[]> {
    const results: UnifiedProduct[] = []
    const searchLimit = options?.limit || 24

    try {
        // Normalize search query
        const normalizedQuery = searchQuery.toLowerCase().trim()

        // Check if searching by listing code
        if (normalizedQuery.match(/^jk-[a-z][a-z0-9]{1,10}$/i) || normalizedQuery.match(/^[a-z][a-z0-9]{4,5}$/i)) {
            const code = normalizedQuery.startsWith('jk-')
                ? normalizedQuery.toUpperCase()
                : `JK-${normalizedQuery.toUpperCase()}`

            const codeQuery = query(
                collection(db, 'listings'),
                where('listing_code', '==', code),
                limit(1)
            )
            const codeSnap = await getDocs(codeQuery)
            if (!codeSnap.empty) {
                results.push(convertListing(codeSnap.docs[0]))
                return results
            }
        }

        // Search in listings (new system)
        const listingsQuery = query(
            collection(db, 'listings'),
            where('status', '==', 'active'),
            orderBy('created_at', 'desc'),
            limit(searchLimit)
        )
        const listingsSnap = await getDocs(listingsQuery)
        listingsSnap.docs.forEach(doc => {
            const data = doc.data()
            const title = (data.title || '').toLowerCase()
            if (title.includes(normalizedQuery)) {
                results.push(convertListing(doc))
            }
        })

        // Search in products (legacy)
        const productsQuery = query(
            collection(db, 'products'),
            where('status', '==', 'active'),
            orderBy('created_at', 'desc'),
            limit(searchLimit)
        )
        const productsSnap = await getDocs(productsQuery)
        productsSnap.docs.forEach(doc => {
            const data = doc.data()
            const title = (data.title || '').toLowerCase()
            if (title.includes(normalizedQuery)) {
                results.push(convertProduct(doc))
            }
        })

        console.log(`🔍 Unified Search "${searchQuery}": ${results.length} results`)

    } catch (error) {
        console.error('Error in unified search:', error)
    }

    // Apply filters
    let filtered = results
    if (options?.categoryId) {
        filtered = filtered.filter(p => p.categoryId === options.categoryId)
    }
    if (options?.minPrice) {
        filtered = filtered.filter(p => p.price >= options.minPrice!)
    }
    if (options?.maxPrice) {
        filtered = filtered.filter(p => p.price <= options.maxPrice!)
    }
    if (options?.condition) {
        filtered = filtered.filter(p => p.condition === options.condition)
    }
    if (options?.province) {
        filtered = filtered.filter(p => p.province === options.province)
    }

    return filtered.slice(0, searchLimit)
}

/**
 * Get product/listing by slug (checks both collections)
 */
export async function getUnifiedBySlug(slug: string): Promise<UnifiedProduct | null> {
    try {
        const decodedSlug = decodeURIComponent(slug)

        // Try listings first (new system)
        const listingsQuery = query(
            collection(db, 'listings'),
            where('slug', '==', decodedSlug),
            limit(1)
        )
        const listingsSnap = await getDocs(listingsQuery)
        if (!listingsSnap.empty) {
            return convertListing(listingsSnap.docs[0])
        }

        // Try products (legacy)
        const productsQuery = query(
            collection(db, 'products'),
            where('slug', '==', slug),
            limit(1)
        )
        const productsSnap = await getDocs(productsQuery)
        if (!productsSnap.empty) {
            return convertProduct(productsSnap.docs[0])
        }

        return null
    } catch (error) {
        console.error('Error getting by slug:', error)
        return null
    }
}

/**
 * Get URL for product/listing (handles both systems)
 */
export function getProductUrl(product: UnifiedProduct): string {
    if (product.source === 'listing') {
        return `/listing/${product.slug}`
    }
    return `/product/${product.slug}`
}
