'use client'

import { useState, useEffect } from 'react'
import { Store } from 'lucide-react'
import ProductCard from '@/components/product/ProductCard'
import { getProductsBySeller } from '@/services/productService'
import type { ProductWithId } from '@/types/product'
import Link from 'next/link'

interface RelatedProductsProps {
    sellerId: string
    sellerName: string
    currentProductId: string
    limit?: number
}

export default function RelatedProducts({
    sellerId,
    sellerName,
    currentProductId,
    limit = 6
}: RelatedProductsProps) {
    const [products, setProducts] = useState<ProductWithId[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchSellerProducts() {
            try {
                console.log('[RelatedProducts] Fetching products for seller:', sellerId)
                setLoading(true)
                const allProducts = await getProductsBySeller(sellerId)

                // Filter out current product and limit results
                const filtered = allProducts
                    .filter(p => p.id !== currentProductId)
                    .slice(0, limit)

                console.log('[RelatedProducts] Found products:', filtered.length)
                setProducts(filtered)
            } catch (error) {
                console.error('[RelatedProducts] Error fetching products:', error)
            } finally {
                setLoading(false)
            }
        }

        if (sellerId) {
            fetchSellerProducts()
        }
    }, [sellerId, currentProductId, limit])

    if (loading) {
        return (
            <div className="py-8">
                <div className="flex items-center gap-2 mb-6">
                    <Store className="w-5 h-5 text-neon-purple" />
                    <h2 className="text-xl font-bold">สินค้าจากร้านเดียวกัน</h2>
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
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                    <Store className="w-5 h-5 text-neon-purple" />
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                        สินค้าจากร้านเดียวกัน
                    </h2>
                </div>
                <Link
                    href={`/profile/${sellerId}`}
                    className="text-sm text-neon-purple hover:underline font-medium"
                >
                    ดูทั้งหมด →
                </Link>
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
