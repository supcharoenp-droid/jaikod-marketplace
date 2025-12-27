'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Sparkles, TrendingUp, Tag, ArrowRight, RefreshCw } from 'lucide-react'
import { getAllProducts } from '@/lib/products'
import { Product } from '@/types'

interface ZeroResultsFallbackProps {
    query: string
    detectedBrand?: string
    detectedCategory?: string
    suggestions?: string[]
    onSuggestionClick?: (suggestion: string) => void
    language?: 'th' | 'en'
}

interface FallbackProduct {
    id: string
    title: string
    price: number
    thumbnail: string
    category_name?: string
}

export function ZeroResultsFallback({
    query,
    detectedBrand,
    detectedCategory,
    suggestions = [],
    onSuggestionClick,
    language = 'th'
}: ZeroResultsFallbackProps) {
    const [popularProducts, setPopularProducts] = useState<FallbackProduct[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchPopular() {
            try {
                const products = await getAllProducts(8)
                setPopularProducts(products.map(p => ({
                    id: p.id,
                    title: p.title,
                    price: p.price,
                    thumbnail: p.thumbnail_url ||
                        (p.images?.[0] && typeof p.images[0] === 'object' ? (p.images[0] as any).url : '') ||
                        '',
                    category_name: p.category?.name_th
                })))
            } catch (error) {
                console.error('Failed to fetch popular products:', error)
            } finally {
                setLoading(false)
            }
        }
        fetchPopular()
    }, [])

    return (
        <div className="w-full py-8 animate-fadeIn">
            {/* No Results Message */}
            <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-full mb-4">
                    <span className="text-4xl">🔍</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    {language === 'th' ? 'ไม่พบผลลัพธ์' : 'No results found'}
                </h2>
                <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                    {language === 'th'
                        ? `ไม่พบสินค้าสำหรับ "${query}"`
                        : `No products found for "${query}"`}
                </p>
            </div>

            {/* AI Detection Info */}
            {(detectedBrand || detectedCategory) && (
                <div className="mb-6 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl border border-purple-200 dark:border-purple-800">
                    <div className="flex items-center gap-2 mb-2">
                        <Sparkles className="w-5 h-5 text-purple-500" />
                        <span className="font-semibold text-purple-700 dark:text-purple-300">
                            {language === 'th' ? 'AI ตรวจพบ' : 'AI Detected'}
                        </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {detectedBrand && (
                            <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 rounded-full text-sm">
                                <Tag className="w-3 h-3 inline mr-1" />
                                {detectedBrand.toUpperCase()}
                            </span>
                        )}
                        {detectedCategory && (
                            <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 rounded-full text-sm">
                                📁 {detectedCategory}
                            </span>
                        )}
                    </div>
                </div>
            )}

            {/* Suggestions */}
            {suggestions.length > 0 && (
                <div className="mb-8">
                    <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                        <RefreshCw className="w-4 h-4" />
                        {language === 'th' ? 'ลองค้นหา' : 'Try searching'}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        {suggestions.map((suggestion, idx) => (
                            <button
                                key={idx}
                                onClick={() => onSuggestionClick?.(suggestion)}
                                className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full text-sm text-gray-700 dark:text-gray-300 hover:border-purple-400 hover:text-purple-600 dark:hover:border-purple-500 dark:hover:text-purple-400 transition-colors flex items-center gap-1"
                            >
                                {suggestion}
                                <ArrowRight className="w-3 h-3 opacity-50" />
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Popular Products */}
            <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-orange-500" />
                    {language === 'th' ? 'สินค้ายอดนิยม' : 'Popular Products'}
                </h3>

                {loading ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="bg-gray-100 dark:bg-gray-800 rounded-xl aspect-square animate-pulse" />
                        ))}
                    </div>
                ) : popularProducts.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {popularProducts.map(product => (
                            <Link
                                key={product.id}
                                href={`/product/${product.id}`}
                                className="group bg-white dark:bg-gray-800 rounded-xl overflow-hidden border border-gray-100 dark:border-gray-700 hover:shadow-lg hover:border-purple-200 dark:hover:border-purple-700 transition-all"
                            >
                                <div className="aspect-square bg-gray-100 dark:bg-gray-900 relative overflow-hidden">
                                    {product.thumbnail ? (
                                        <Image
                                            src={product.thumbnail}
                                            alt={product.title}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform"
                                            sizes="(max-width: 640px) 50vw, 25vw"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <span className="text-3xl">📦</span>
                                        </div>
                                    )}
                                </div>
                                <div className="p-3">
                                    <h4 className="text-sm font-medium text-gray-900 dark:text-white line-clamp-2">
                                        {product.title}
                                    </h4>
                                    <p className="text-purple-600 font-bold mt-1">
                                        ฿{product.price.toLocaleString()}
                                    </p>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <p className="text-center text-gray-500 py-8">
                        {language === 'th' ? 'ยังไม่มีสินค้าในระบบ' : 'No products available yet'}
                    </p>
                )}
            </div>

            {/* Browse All Link */}
            <div className="text-center">
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-full hover:shadow-lg hover:scale-105 transition-all"
                >
                    {language === 'th' ? 'กลับหน้าหลัก' : 'Back to Home'}
                    <ArrowRight className="w-4 h-4" />
                </Link>
            </div>
        </div>
    )
}
