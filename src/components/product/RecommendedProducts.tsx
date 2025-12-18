'use client'

import { useState, useEffect } from 'react'
import { Sparkles } from 'lucide-react'
import ProductCard from '@/components/product/ProductCard'
import { getAllProducts } from '@/services/productService'
import type { ProductWithId } from '@/types/product'

interface RecommendedProductsProps {
    currentProductId: string
    categoryId: number | string
    limit?: number
}

export default function RecommendedProducts({
    currentProductId,
    categoryId,
    limit = 6
}: RecommendedProductsProps) {
    const [products, setProducts] = useState<ProductWithId[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchRecommendations() {
            try {
                console.log('[RecommendedProducts] Fetching recommendations for category:', categoryId)
                setLoading(true)

                // Fetch all products
                const allProducts = await getAllProducts(50)

                // AI-based recommendation logic:
                // 1. Same category products (higher priority)
                // 2. Similar price range (±30%)
                // 3. Exclude current product
                // 4. Randomize for variety

                const currentProduct = allProducts.find(p => p.id === currentProductId)
                const currentPrice = currentProduct?.price || 0
                const priceMin = currentPrice * 0.7
                const priceMax = currentPrice * 1.3

                let recommended = allProducts
                    .filter(p => p.id !== currentProductId)
                    .map(p => ({
                        ...p,
                        score: calculateRecommendationScore(p, categoryId, currentPrice)
                    }))
                    .sort((a, b) => b.score - a.score)
                    .slice(0, limit)

                console.log('[RecommendedProducts] Found recommendations:', recommended.length)
                setProducts(recommended)
            } catch (error) {
                console.error('[RecommendedProducts] Error fetching recommendations:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchRecommendations()
    }, [currentProductId, categoryId, limit])

    // AI recommendation scoring algorithm
    function calculateRecommendationScore(
        product: ProductWithId,
        targetCategory: number | string,
        targetPrice: number
    ): number {
        let score = 0

        // Same category: +50 points
        if (String(product.category_id) === String(targetCategory)) {
            score += 50
        }

        // Price similarity: up to +30 points
        if (targetPrice > 0) {
            const priceDiff = Math.abs(product.price - targetPrice) / targetPrice
            score += Math.max(0, 30 - (priceDiff * 30))
        }

        // Popularity: up to +20 points
        score += Math.min(20, (product.views_count || 0) / 10)
        score += Math.min(10, (product.favorites_count || 0) / 2)

        // Trending/Best seller: +10 points
        if (product.is_trending) score += 5
        if (product.is_best_seller) score += 5

        // Random factor for variety: ±5 points
        score += Math.random() * 10 - 5

        return score
    }

    if (loading) {
        return (
            <div className="py-8">
                <div className="flex items-center gap-2 mb-6">
                    <Sparkles className="w-5 h-5 text-coral-orange" />
                    <h2 className="text-xl font-bold">สินค้าที่คุณอาจสนใจ</h2>
                    <span className="text-xs bg-gradient-to-r from-neon-purple to-coral-orange text-white px-2 py-0.5 rounded-full font-bold">
                        AI
                    </span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="animate-pulse">
                            <div className="aspect-square bg-gray-200 dark:bg-gray-700 rounded-xl mb-2"></div>
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
                        </div>
                    ))}
                </div>
            </div>
        )
    }

    if (products.length === 0) {
        return null
    }

    return (
        <div className="py-8">
            <div className="flex items-center gap-2 mb-6">
                <Sparkles className="w-5 h-5 text-coral-orange" />
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    สินค้าที่คุณอาจสนใจ
                </h2>
                <span className="text-xs bg-gradient-to-r from-neon-purple to-coral-orange text-white px-2 py-0.5 rounded-full font-bold">
                    AI
                </span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {products.map((product) => (
                    <ProductCard
                        key={product.id}
                        product={product}
                        showDistance={false}
                    />
                ))}
            </div>
        </div>
    )
}
