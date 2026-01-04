/**
 * Listing Hooks with React Query Caching
 * 
 * Cached hooks for listing-related data fetching
 * 
 * @version 1.0.0
 * @created 2025-12-30
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '../query-client'
import {
    getListingBySlug,
    getListingById,
    getRecentListings
} from '../listings'
import type { UniversalListing } from '@/types'

// ==========================================
// LISTING BY SLUG HOOK
// ==========================================

/**
 * Hook to fetch listing by slug with caching
 * 
 * @example
 * const { data: listing, isLoading } = useListingBySlug('product-slug')
 */
export function useListingBySlug(slug: string | undefined) {
    return useQuery({
        queryKey: queryKeys.listing.bySlug(slug || ''),
        queryFn: async () => {
            if (!slug) return null
            return getListingBySlug(slug)
        },
        enabled: !!slug,
        staleTime: 5 * 60 * 1000, // 5 minutes
    })
}

// ==========================================
// LISTING BY ID HOOK
// ==========================================

/**
 * Hook to fetch listing by ID with caching
 * 
 * @example
 * const { data: listing } = useListingById('listingId')
 */
export function useListingById(listingId: string | undefined) {
    return useQuery({
        queryKey: queryKeys.listing.byId(listingId || ''),
        queryFn: async () => {
            if (!listingId) return null
            return getListingById(listingId)
        },
        enabled: !!listingId,
        staleTime: 5 * 60 * 1000,
    })
}

// ==========================================
// RECENT LISTINGS HOOK
// ==========================================

/**
 * Hook to fetch recent listings
 * 
 * @example
 * const { data: listings } = useRecentListings(12)
 */
export function useRecentListings(limit: number = 12) {
    return useQuery({
        queryKey: [...queryKeys.listing.recent(), limit] as const,
        queryFn: async (): Promise<UniversalListing[]> => {
            return getRecentListings(limit)
        },
        staleTime: 2 * 60 * 1000, // 2 minutes (new listings appear often)
    })
}

// ==========================================
// FEATURED LISTINGS HOOK
// ==========================================

/**
 * Hook to fetch featured listings
 * 
 * @example
 * const { data: featured } = useFeaturedListings()
 */
export function useFeaturedListings() {
    return useQuery({
        queryKey: queryKeys.listing.featured(),
        queryFn: async (): Promise<UniversalListing[]> => {
            // TODO: Implement getFeaturedListings when promoted listings are ready
            return getRecentListings(8)
        },
        staleTime: 5 * 60 * 1000,
    })
}

// ==========================================
// LISTING MUTATIONS
// ==========================================

/**
 * Prefetch a listing for faster navigation
 * 
 * @example
 * usePrefetchListing('product-slug')
 */
export function usePrefetchListing() {
    const queryClient = useQueryClient()

    return (slug: string) => {
        queryClient.prefetchQuery({
            queryKey: queryKeys.listing.bySlug(slug),
            queryFn: () => getListingBySlug(slug),
            staleTime: 5 * 60 * 1000,
        })
    }
}

/**
 * Mutation for updating listing views
 * Optimistic update for better UX
 */
export function useIncrementViews() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (listingId: string) => {
            // Call API to increment views
            const response = await fetch(`/api/listings/${listingId}/view`, {
                method: 'POST'
            })
            return response.json()
        },
        onMutate: async (listingId) => {
            // Optimistically update the view count
            const queryKey = queryKeys.listing.byId(listingId)
            await queryClient.cancelQueries({ queryKey })

            const previousListing = queryClient.getQueryData<UniversalListing>(queryKey)
            if (previousListing) {
                queryClient.setQueryData(queryKey, {
                    ...previousListing,
                    stats: {
                        ...previousListing.stats,
                        views: (previousListing.stats?.views || 0) + 1
                    }
                })
            }

            return { previousListing }
        },
        onError: (_, listingId, context) => {
            // Rollback on error
            if (context?.previousListing) {
                queryClient.setQueryData(
                    queryKeys.listing.byId(listingId),
                    context.previousListing
                )
            }
        }
    })
}

// ==========================================
// LISTING SEARCH HOOK
// ==========================================

interface SearchFilters {
    categoryId?: number
    minPrice?: number
    maxPrice?: number
    province?: string
    condition?: string
    sort?: 'newest' | 'price_low' | 'price_high' | 'popular'
}

/**
 * Hook for searching listings with caching
 * 
 * @example
 * const { data: results } = useSearchListings('iphone', { minPrice: 5000 })
 */
export function useSearchListings(
    query: string,
    filters?: SearchFilters,
    enabled: boolean = true
) {
    return useQuery({
        queryKey: queryKeys.listing.search(query, filters),
        queryFn: async (): Promise<UniversalListing[]> => {
            // Build search URL
            const params = new URLSearchParams()
            params.set('q', query)
            if (filters?.categoryId) params.set('category', String(filters.categoryId))
            if (filters?.minPrice) params.set('minPrice', String(filters.minPrice))
            if (filters?.maxPrice) params.set('maxPrice', String(filters.maxPrice))
            if (filters?.province) params.set('province', filters.province)
            if (filters?.condition) params.set('condition', filters.condition)
            if (filters?.sort) params.set('sort', filters.sort)

            const response = await fetch(`/api/search?${params.toString()}`)
            if (!response.ok) throw new Error('Search failed')
            return response.json()
        },
        enabled: enabled && query.length >= 2,
        staleTime: 1 * 60 * 1000, // 1 minute (search results change often)
    })
}
