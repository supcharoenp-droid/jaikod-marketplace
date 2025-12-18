'use client'

import React, { useEffect, useState, useRef, useCallback } from 'react'
import { Sparkles, Loader2, ArrowUp, Zap } from 'lucide-react'
import ProductCard from '@/components/product/ProductCard'
import { getPersonalizedRecommendations } from '@/services/behaviorTracking'
import { Product } from '@/types'

const BATCH_SIZE = 8

export default function InfiniteFeed() {
    const [products, setProducts] = useState<Product[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [page, setPage] = useState(1)

    // Virtual Page Tracking for AI Context
    // In real app, we would send 'page' or 'lastSeenId' to API to get next batch based on ranking

    const observer = useRef<IntersectionObserver | null>(null)
    const lastElementRef = useCallback((node: HTMLDivElement) => {
        if (isLoading) return
        if (observer.current) observer.current.disconnect()

        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting) {
                setPage(prev => prev + 1)
            }
        }, { threshold: 0.5 }) // Trigger when 50% visible

        if (node) observer.current.observe(node)
    }, [isLoading])

    // Load Initial & More
    useEffect(() => {
        const loadMore = async () => {
            setIsLoading(true)
            try {
                // Simulate "Next Page" by just fetching recommendation again
                // In production, your API would accept { page, excludeIds: [...] }
                // The ranking engine would re-rank remaining items.

                // We add a small artificial delay to show the "smooth loading" UI
                if (page > 1) await new Promise(r => setTimeout(r, 600))

                const newItems = await getPersonalizedRecommendations(BATCH_SIZE)

                // Filter duplicates (since we're mocking the feed source)
                setProducts(prev => {
                    const existingIds = new Set(prev.map(p => p.id))
                    const filtered = newItems.filter(p => !existingIds.has(p.id))
                    // If mock runs out of unique items, we might append repeats for "infinite" demo
                    return [...prev, ...filtered]
                })
            } catch (err) {
                console.error(err)
            } finally {
                setIsLoading(false)
            }
        }
        loadMore()
    }, [page])

    return (
        <div className="space-y-6">

            {/* Header for Infinite Section */}
            <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-gradient-to-tr from-pink-500 to-rose-500 rounded-lg shadow-lg shadow-pink-500/30 text-white animate-pulse">
                    <Zap className="w-5 h-5" />
                </div>
                <div>
                    <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-600 to-rose-600">
                        Discover Endless
                    </h2>
                    <p className="text-xs text-gray-500">ไหลลื่นไม่มีสะดุด คัดมาให้คุณโดยเฉพาะ</p>
                </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {products.map((product, index) => {
                    const isLast = index === products.length - 1
                    return (
                        <div
                            key={`${product.id}-${index}`}
                            ref={isLast ? lastElementRef : null}
                            className="animate-fade-in-up"
                            style={{ animationDelay: `${(index % BATCH_SIZE) * 50}ms` }}
                        >
                            <ProductCard product={product} isAiRecommended={true} />
                        </div>
                    )
                })}
            </div>

            {/* Loading Indicator */}
            {isLoading && (
                <div className="flex flex-col items-center justify-center py-8 space-y-2">
                    <Loader2 className="w-8 h-8 text-pink-500 animate-spin" />
                    <p className="text-xs text-gray-400 font-medium">AI กำลังคัดเลือกสินค้า...</p>
                </div>
            )}

            {/* End of Feed (Unlikely in Infinite, but good fallback) */}
            {!isLoading && products.length > 50 && (
                <div className="text-center py-8">
                    <p className="text-gray-400 text-sm">คุณดูสินค้าไปเยอะมาก! พักสายตาบ้างนะ 👀</p>
                </div>
            )}

        </div>
    )
}
