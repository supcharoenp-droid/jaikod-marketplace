/**
 * React Query Configuration
 * 
 * Central configuration for data fetching and caching
 * 
 * @version 1.0.0
 * @created 2025-12-30
 */

import { QueryClient } from '@tanstack/react-query'

// ==========================================
// QUERY CLIENT CONFIGURATION
// ==========================================

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            // Default cache time: 5 minutes
            staleTime: 5 * 60 * 1000,

            // Keep data in cache for 30 minutes
            gcTime: 30 * 60 * 1000,

            // Retry failed requests 2 times
            retry: 2,

            // Retry delay: exponential backoff
            retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),

            // Don't refetch on window focus by default
            refetchOnWindowFocus: false,

            // Refetch on reconnect
            refetchOnReconnect: true,
        },
        mutations: {
            // Retry failed mutations once
            retry: 1,
        }
    }
})

// ==========================================
// QUERY KEYS
// ==========================================

/**
 * Centralized query keys for type-safety and consistency
 */
export const queryKeys = {
    // Seller queries
    seller: {
        all: ['sellers'] as const,
        profile: (sellerId: string) => ['sellers', 'profile', sellerId] as const,
        listings: (sellerId: string) => ['sellers', 'listings', sellerId] as const,
        stats: (sellerId: string) => ['sellers', 'stats', sellerId] as const,
        nearby: (lat?: number, lng?: number) => ['sellers', 'nearby', lat, lng] as const,
    },

    // Listing queries
    listing: {
        all: ['listings'] as const,
        byId: (id: string) => ['listings', 'byId', id] as const,
        bySlug: (slug: string) => ['listings', 'bySlug', slug] as const,
        byCategory: (categoryId: number) => ['listings', 'category', categoryId] as const,
        search: (query: string, filters?: object) => ['listings', 'search', query, filters] as const,
        featured: () => ['listings', 'featured'] as const,
        recent: () => ['listings', 'recent'] as const,
    },

    // User queries
    user: {
        all: ['users'] as const,
        profile: (userId: string) => ['users', 'profile', userId] as const,
        favorites: (userId: string) => ['users', 'favorites', userId] as const,
        notifications: (userId: string) => ['users', 'notifications', userId] as const,
        orders: (userId: string) => ['users', 'orders', userId] as const,
    },

    // Category queries
    categories: {
        all: ['categories'] as const,
        byId: (id: number) => ['categories', id] as const,
        subcategories: (parentId: number) => ['categories', 'subcategories', parentId] as const,
    },

    // Review queries
    reviews: {
        bySeller: (sellerId: string) => ['reviews', 'seller', sellerId] as const,
        byListing: (listingId: string) => ['reviews', 'listing', listingId] as const,
    }
}

// ==========================================
// CACHE INVALIDATION HELPERS
// ==========================================

/**
 * Invalidate all seller-related queries
 */
export function invalidateSellerQueries(sellerId: string) {
    queryClient.invalidateQueries({ queryKey: queryKeys.seller.profile(sellerId) })
    queryClient.invalidateQueries({ queryKey: queryKeys.seller.listings(sellerId) })
    queryClient.invalidateQueries({ queryKey: queryKeys.seller.stats(sellerId) })
}

/**
 * Invalidate all listing-related queries
 */
export function invalidateListingQueries(listingId?: string) {
    if (listingId) {
        queryClient.invalidateQueries({ queryKey: queryKeys.listing.byId(listingId) })
    } else {
        queryClient.invalidateQueries({ queryKey: queryKeys.listing.all })
    }
}

/**
 * Invalidate user profile and related queries
 */
export function invalidateUserQueries(userId: string) {
    queryClient.invalidateQueries({ queryKey: queryKeys.user.profile(userId) })
    queryClient.invalidateQueries({ queryKey: queryKeys.user.favorites(userId) })
}

/**
 * Clear all cache
 */
export function clearAllCache() {
    queryClient.clear()
}
