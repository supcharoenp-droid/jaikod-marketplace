import { useState, useCallback, useRef } from 'react'
import { ApiService } from '@/lib/api-client'
import { Listing, ListParams } from '@/types/api'

// Hook for Infinite Scroll Listings
export function useListingFeed(initialParams: ListParams = { limit: 12 }) {
    const [items, setItems] = useState<Listing[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [hasMore, setHasMore] = useState(true)
    const [nextCursor, setNextCursor] = useState<string | undefined>(undefined)

    // Prevent double fetch
    const fetchingRef = useRef(false)

    const loadMore = useCallback(async (reset = false) => {
        if (fetchingRef.current) return
        if (!reset && !hasMore) return

        fetchingRef.current = true
        setLoading(true)
        if (reset) setError(null)

        try {
            const currentParams = {
                ...initialParams,
                cursor: reset ? undefined : nextCursor
            }

            const res = await ApiService.listings.list(currentParams)

            setItems(prev => reset ? res.data : [...prev, ...res.data])
            setHasMore(!!res.meta?.has_more)
            setNextCursor(res.meta?.next_cursor)

        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
            fetchingRef.current = false
        }
    }, [nextCursor, hasMore, initialParams])

    // Optimistic Update Helper (e.g. for Like)
    const toggleLike = (id: string) => {
        setItems(prev => prev.map(item => {
            if (item.id === id) {
                // If mocked, we assume 'liked' state is toggled locally
                // In real app, we might need an 'is_liked' field in Listing type
                return { ...item, likes: item.likes + 1 }
            }
            return item
        }))
        // Optionally call API in background
        // ApiService.listings.like(id).catch(revert)
    }

    return { items, loading, error, hasMore, loadMore, toggleLike }
}
