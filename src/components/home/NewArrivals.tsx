'use client'

import { useState, useEffect } from 'react'
import { Sparkles, Clock, ArrowRight } from 'lucide-react'
import ProductCard from '@/components/product/ProductCard'
import { getAllProducts } from '@/services/productService'
import type { ProductWithId } from '@/types/product'
import Link from 'next/link'

interface NewArrivalsProps {
    title?: string
    subtitle?: string
    showViewAll?: boolean
}

export default function NewArrivals({
    title = "สินค้าใหม่ล่าสุด",
    subtitle = "มาใหม่! เพิ่งลงขายบน JaiKod",
    showViewAll = true
}: NewArrivalsProps) {
    const [products, setProducts] = useState<ProductWithId[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        async function fetchNewProducts() {
            try {
                setLoading(true)
                const allProducts = await getAllProducts(12)
                setProducts(allProducts)
                setError(null)
            } catch (err) {
                console.error('Error fetching new products:', err)
                setError('ไม่สามารถโหลดสินค้าใหม่ได้')
            } finally {
                setLoading(false)
            }
        }

        fetchNewProducts()
    }, [])

    // Don't render if no products and not loading
    if (!loading && products.length === 0 && !error) {
        return null
    }

    return (
        <section className="py-8">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center text-white shadow-lg">
                                <Sparkles className="w-6 h-6" />
                            </div>
                            <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
                        </div>
                        <div>
                            <h2 className="text-xl md:text-2xl font-display font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                {title}
                                <span className="text-xs bg-gradient-to-r from-pink-500 to-rose-500 text-white px-2 py-0.5 rounded-full font-medium">
                                    NEW
                                </span>
                            </h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {subtitle}
                            </p>
                        </div>
                    </div>

                    {showViewAll && products.length > 0 && (
                        <Link
                            href="/search?sort=newest"
                            className="hidden md:flex items-center text-sm font-medium text-neon-purple hover:text-purple-700 transition-colors group"
                        >
                            ดูทั้งหมด
                            <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    )}
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="animate-pulse">
                                <div className="aspect-square bg-gray-200 dark:bg-gray-700 rounded-xl mb-2"></div>
                                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-1"></div>
                                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Error State */}
                {error && (
                    <div className="text-center py-12 bg-red-50 dark:bg-red-900/20 rounded-xl">
                        <p className="text-red-500">{error}</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="mt-4 text-sm text-neon-purple hover:underline"
                        >
                            ลองใหม่อีกครั้ง
                        </button>
                    </div>
                )}

                {/* Products Grid */}
                {!loading && !error && products.length > 0 && (
                    <>
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                            {products.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>

                        {/* Mobile View All */}
                        {showViewAll && (
                            <div className="mt-6 text-center md:hidden">
                                <Link
                                    href="/search?sort=newest"
                                    className="inline-flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-neon-purple bg-purple-50 dark:bg-purple-900/20 rounded-xl hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors"
                                >
                                    ดูสินค้าใหม่ทั้งหมด
                                    <ArrowRight className="w-4 h-4 ml-1" />
                                </Link>
                            </div>
                        )}
                    </>
                )}

                {/* Empty State */}
                {!loading && !error && products.length === 0 && (
                    <div className="text-center py-16 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-2xl">
                        <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-pink-100 to-rose-100 dark:from-pink-900/30 dark:to-rose-900/30 rounded-2xl flex items-center justify-center">
                            <Sparkles className="w-10 h-10 text-pink-500" />
                        </div>
                        <h3 className="text-lg font-bold mb-2">ยังไม่มีสินค้าใหม่</h3>
                        <p className="text-gray-500 mb-4">เป็นคนแรกที่ลงขายสินค้าบน JaiKod!</p>
                        <Link
                            href="/sell"
                            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-neon-purple to-coral-orange text-white rounded-xl font-bold hover:shadow-lg transition-all"
                        >
                            ลงขายสินค้าเลย →
                        </Link>
                    </div>
                )}
            </div>
        </section>
    )
}
