/**
 * CACHED DATA SERVICES
 * 
 * Wrapper สำหรับ data fetching พร้อม caching
 * ใช้งานแทน direct Firestore calls ใน components
 * 
 * @version 1.0.0
 * @date 2024-12-29
 */

import { db } from '@/lib/firebase'
import {
    collection,
    query,
    where,
    orderBy,
    limit,
    getDocs,
    doc,
    getDoc
} from 'firebase/firestore'
import {
    withCache,
    cacheKey,
    invalidateCache,
    CACHE_KEYS,
    CACHE_TTL
} from './api-cache'
import { CATEGORIES } from '@/constants/categories'

// ==========================================
// CATEGORIES
// ==========================================

/**
 * Get all categories (cached 1 hour)
 */
export async function getCategoriesCached() {
    return withCache(
        CACHE_KEYS.CATEGORIES,
        async () => {
            // Categories are from constants, not Firestore
            return CATEGORIES
        },
        CACHE_TTL.CATEGORIES
    )
}

/**
 * Get category by ID (cached 1 hour)
 */
export async function getCategoryByIdCached(categoryId: number) {
    return withCache(
        CACHE_KEYS.CATEGORY(categoryId),
        async () => {
            const category = CATEGORIES.find(c => c.id === categoryId)
            return category || null
        },
        CACHE_TTL.CATEGORIES
    )
}

// ==========================================
// LISTINGS
// ==========================================

/**
 * Get new arrivals (cached 1 minute)
 */
export async function getNewArrivalsCached(limitCount: number = 12) {
    return withCache(
        cacheKey(CACHE_KEYS.NEW_ARRIVALS, limitCount),
        async () => {
            const listingsRef = collection(db, 'listings')
            const q = query(
                listingsRef,
                where('status', '==', 'active'),
                orderBy('created_at', 'desc'),
                limit(limitCount)
            )

            const snapshot = await getDocs(q)
            return snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }))
        },
        CACHE_TTL.NEW_ARRIVALS
    )
}

/**
 * Get featured listings (cached 5 minutes)
 */
export async function getFeaturedListingsCached(limitCount: number = 8) {
    return withCache(
        cacheKey(CACHE_KEYS.FEATURED, limitCount),
        async () => {
            const listingsRef = collection(db, 'listings')
            const q = query(
                listingsRef,
                where('status', '==', 'active'),
                where('featured', '==', true),
                orderBy('created_at', 'desc'),
                limit(limitCount)
            )

            const snapshot = await getDocs(q)
            return snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }))
        },
        CACHE_TTL.MEDIUM
    )
}

/**
 * Get single listing (cached 2 minutes)
 */
export async function getListingByIdCached(listingId: string) {
    return withCache(
        CACHE_KEYS.LISTING(listingId),
        async () => {
            const docRef = doc(db, 'listings', listingId)
            const docSnap = await getDoc(docRef)

            if (!docSnap.exists()) return null

            return {
                id: docSnap.id,
                ...docSnap.data()
            }
        },
        CACHE_TTL.LISTING
    )
}

/**
 * Invalidate listing cache when updated
 */
export function invalidateListingCache(listingId: string) {
    invalidateCache(`listing:${listingId}`)
    invalidateCache('listings:')  // Also invalidate list caches
}

// ==========================================
// USERS
// ==========================================

/**
 * Get user profile (cached 5 minutes)
 */
export async function getUserProfileCached(userId: string) {
    return withCache(
        CACHE_KEYS.USER(userId),
        async () => {
            const docRef = doc(db, 'users', userId)
            const docSnap = await getDoc(docRef)

            if (!docSnap.exists()) return null

            return {
                id: docSnap.id,
                ...docSnap.data()
            }
        },
        CACHE_TTL.USER
    )
}

/**
 * Invalidate user cache when updated
 */
export function invalidateUserCache(userId: string) {
    invalidateCache(`user:${userId}`)
}

// ==========================================
// SEARCH
// ==========================================

/**
 * Get popular searches (cached 5 minutes)
 */
export async function getPopularSearchesCached(limitCount: number = 10) {
    return withCache(
        cacheKey(CACHE_KEYS.POPULAR_SEARCHES, limitCount),
        async () => {
            try {
                const searchRef = collection(db, 'search_analytics')
                const q = query(
                    searchRef,
                    orderBy('count', 'desc'),
                    limit(limitCount)
                )

                const snapshot = await getDocs(q)
                return snapshot.docs.map(doc => ({
                    query: doc.data().query,
                    count: doc.data().count
                }))
            } catch (error) {
                console.warn('[CachedService] Failed to get popular searches:', error)
                return []
            }
        },
        CACHE_TTL.SEARCH
    )
}

// ==========================================
// LOCATION DATA
// ==========================================

/**
 * Get all provinces (cached 1 hour)
 */
export async function getProvincesCached() {
    return withCache(
        CACHE_KEYS.PROVINCES,
        async () => {
            // Import from centroids
            const { PROVINCE_CENTROIDS } = await import('@/lib/geo/thailand-centroids')

            return Object.entries(PROVINCE_CENTROIDS).map(([id, data]) => ({
                id,
                name_th: data.name_th,
                name_en: data.name_en,
                lat: data.lat,
                lng: data.lng
            }))
        },
        CACHE_TTL.VERY_LONG
    )
}

// ==========================================
// SELLER DATA
// ==========================================

/**
 * Get seller profile (cached 5 minutes)
 */
export async function getSellerProfileCached(sellerId: string) {
    return withCache(
        `seller:profile:${sellerId}`,
        async () => {
            const { getSellerProfile } = await import('@/lib/seller')
            return getSellerProfile(sellerId)
        },
        CACHE_TTL.MEDIUM
    )
}

/**
 * Get seller's other listings (cached 2 minutes)
 */
export async function getSellerListingsCached(
    sellerId: string,
    excludeId?: string,
    limitCount: number = 6
) {
    return withCache(
        `seller:listings:${sellerId}:${excludeId || 'all'}:${limitCount}`,
        async () => {
            const { getSellerListings } = await import('@/lib/seller')
            return getSellerListings(sellerId, excludeId, limitCount)
        },
        CACHE_TTL.LISTING
    )
}

/**
 * Get similar listings (cached 2 minutes)
 */
export async function getSimilarListingsCached(
    categoryType: string,
    excludeId: string,
    limitCount: number = 4
) {
    return withCache(
        `similar:${categoryType}:${excludeId}:${limitCount}`,
        async () => {
            const { getSimilarListings } = await import('@/lib/seller')
            return getSimilarListings(categoryType, excludeId, limitCount)
        },
        CACHE_TTL.LISTING
    )
}

/**
 * Invalidate seller cache when data changes
 */
export function invalidateSellerCache(sellerId: string) {
    invalidateCache(`seller:profile:${sellerId}`)
    invalidateCache(`seller:listings:${sellerId}`)
}

// All functions are exported above with their declarations
