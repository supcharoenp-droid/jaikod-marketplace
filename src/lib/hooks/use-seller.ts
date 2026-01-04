/**
 * Seller Hooks with React Query Caching
 * 
 * Cached hooks for seller-related data fetching
 * 
 * @version 1.0.0
 * @created 2025-12-30
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { queryKeys, invalidateSellerQueries } from '../query-client'
import {
    getSellerProfile,
    getSellerListings,
    getNearbySellers,
    syncSellerInfoToListings,
    updateSellerStats,
    type SellerListing,
    type RecommendedSeller
} from '../seller'
import { SellerProfile } from '@/types'

// ==========================================
// SELLER PROFILE HOOK
// ==========================================

/**
 * Hook to fetch seller profile with caching
 * 
 * @example
 * const { data: seller, isLoading, error } = useSellerProfile('sellerId')
 */
export function useSellerProfile(sellerId: string | undefined) {
    return useQuery({
        queryKey: queryKeys.seller.profile(sellerId || ''),
        queryFn: async () => {
            if (!sellerId) return null
            return getSellerProfile(sellerId)
        },
        enabled: !!sellerId,
        staleTime: 5 * 60 * 1000, // 5 minutes
    })
}

// ==========================================
// SELLER LISTINGS HOOK
// ==========================================

/**
 * Hook to fetch seller's listings with caching
 * 
 * @example
 * const { data: listings, isLoading } = useSellerListings('sellerId')
 */
export function useSellerListings(sellerId: string | undefined) {
    return useQuery({
        queryKey: queryKeys.seller.listings(sellerId || ''),
        queryFn: async (): Promise<SellerListing[]> => {
            if (!sellerId) return []
            return getSellerListings(sellerId)
        },
        enabled: !!sellerId,
        staleTime: 2 * 60 * 1000, // 2 minutes (listings change more often)
    })
}

// ==========================================
// NEARBY SELLERS HOOK
// ==========================================

/**
 * Hook to fetch nearby/recommended sellers
 * 
 * @example
 * const { data: sellers } = useNearbySellers(6)
 */
export function useNearbySellers(maxCount: number = 6) {
    return useQuery({
        queryKey: queryKeys.seller.nearby(),
        queryFn: async (): Promise<RecommendedSeller[]> => {
            return getNearbySellers(maxCount)
        },
        staleTime: 10 * 60 * 1000, // 10 minutes
    })
}

// ==========================================
// MUTATIONS
// ==========================================

/**
 * Mutation hook to sync seller info to all listings
 * 
 * @example
 * const { mutate: sync, isLoading } = useSyncSellerInfo()
 * sync('sellerId')
 */
export function useSyncSellerInfo() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (sellerId: string) => {
            return syncSellerInfoToListings(sellerId)
        },
        onSuccess: (_, sellerId) => {
            // Invalidate related queries
            invalidateSellerQueries(sellerId)
            queryClient.invalidateQueries({ queryKey: queryKeys.listing.all })
        }
    })
}

/**
 * Mutation hook to update seller stats
 * 
 * @example
 * const { mutate: refresh } = useRefreshSellerStats()
 * refresh('sellerId')
 */
export function useRefreshSellerStats() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (sellerId: string) => {
            await updateSellerStats(sellerId)
        },
        onSuccess: (_, sellerId) => {
            queryClient.invalidateQueries({ queryKey: queryKeys.seller.stats(sellerId) })
            queryClient.invalidateQueries({ queryKey: queryKeys.seller.profile(sellerId) })
        }
    })
}

// ==========================================
// COMBINED HOOK
// ==========================================

/**
 * Combined hook for seller page data
 * Fetches profile and listings in parallel
 * 
 * @example
 * const { profile, listings, isLoading } = useSellerPageData('sellerId')
 */
export function useSellerPageData(sellerId: string | undefined) {
    const profileQuery = useSellerProfile(sellerId)
    const listingsQuery = useSellerListings(sellerId)

    return {
        profile: profileQuery.data,
        listings: listingsQuery.data || [],
        isLoading: profileQuery.isLoading || listingsQuery.isLoading,
        isError: profileQuery.isError || listingsQuery.isError,
        error: profileQuery.error || listingsQuery.error,
        refetch: () => {
            profileQuery.refetch()
            listingsQuery.refetch()
        }
    }
}
