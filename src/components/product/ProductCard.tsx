'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Heart, MapPin, Eye, TrendingUp, Award, ShoppingBag } from 'lucide-react'
import { Product } from '@/types'
import type { ProductWithId } from '@/types/product'
import { formatPrice, formatRelativeTime, formatCompactNumber } from '@/lib/utils'
import Badge from '@/components/ui/Badge'
import { useState, useEffect } from 'react'

interface ProductCardProps {
    product: ProductWithId | Product
}

export default function ProductCard({ product }: ProductCardProps) {
    const [isFavorited, setIsFavorited] = useState(false)
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    const handleFavorite = (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setIsFavorited(!isFavorited)
        // TODO: Call API to add/remove favorite
    }

    return (
        <Link href={`/product/${product.slug}`}>
            <div className="product-card group relative flex flex-col h-full bg-white dark:bg-card-dark rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-xl transition-all duration-300">

                {/* Image Section */}
                <div className="relative aspect-square overflow-hidden rounded-t-xl bg-gray-100 dark:bg-gray-800">
                    <Image
                        src={product.thumbnail_url || '/placeholder-product.jpg'}
                        alt={product.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    {/* Favorites & Discount Badge */}
                    <div className="absolute top-2 right-2 flex flex-col items-end gap-2 z-20">
                        {/* Discount Badge */}
                        {product.original_price && product.original_price > product.price && (
                            <div className="bg-yellow-400 text-red-600 px-2 py-1 rounded-md font-bold text-xs shadow-sm shadow-orange-500/20 animate-pulse">
                                -{Math.round(((product.original_price - product.price) / product.original_price) * 100)}%
                            </div>
                        )}

                        <button
                            onClick={handleFavorite}
                            className={`p-2 rounded-full bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-800 hover:scale-110 transition-all shadow-md opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 duration-300`}
                        >
                            <Heart
                                className={`w-4 h-4 ${isFavorited
                                    ? 'fill-rose-500 text-rose-500'
                                    : 'text-gray-600 dark:text-gray-300'
                                    }`}
                            />
                        </button>
                    </div>

                    {/* Badges - Top Left */}
                    <div className="absolute top-2 left-2 flex flex-col gap-1.5 z-10">
                        {product.is_best_seller && (
                            <div className="flex items-center gap-1 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-lg shadow-orange-500/20 animate-fade-in">
                                <Award className="w-3 h-3" />
                                <span>ขายดี</span>
                            </div>
                        )}
                        {product.is_trending && (
                            <div className="flex items-center gap-1 bg-gradient-to-r from-rose-500 to-pink-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-lg shadow-pink-500/20 animate-fade-in delay-75">
                                <TrendingUp className="w-3 h-3" />
                                <span>มาแรง</span>
                            </div>
                        )}
                        {product.condition === 'new' && !product.is_best_seller && (
                            <div className="bg-emerald-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm">
                                ใหม่
                            </div>
                        )}
                    </div>

                    {/* Stats Overlay (Bottom) */}
                    <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-white text-[10px] font-medium z-10">
                        <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-black/40 backdrop-blur-md">
                            <Eye className="w-3 h-3 text-white/90" />
                            <span>{formatCompactNumber(product.views_count)}</span>
                        </div>
                        {product.sold_count && product.sold_count > 0 && (
                            <div className="px-2 py-1 rounded-full bg-black/40 backdrop-blur-md text-white/90">
                                ขายแล้ว {formatCompactNumber(product.sold_count)}
                            </div>
                        )}
                    </div>
                </div>

                {/* Content Section */}
                <div className="p-3 flex-1 flex flex-col space-y-2">
                    {/* Title */}
                    <h3 className="font-medium text-sm text-gray-900 dark:text-gray-100 line-clamp-2 min-h-[2.5em] group-hover:text-neon-purple transition-colors duration-200">
                        {product.title}
                    </h3>

                    {/* Price Area */}
                    <div className="mt-auto">
                        <div className="flex items-baseline gap-2 mb-1">
                            <span className="text-lg font-bold text-neon-purple">
                                {formatPrice(product.price)}
                            </span>
                            {product.original_price && product.original_price > product.price && (
                                <span className="text-xs text-gray-400 line-through">
                                    {formatPrice(product.original_price)}
                                </span>
                            )}
                        </div>

                        {/* Location & Seller */}
                        <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-800">
                            <div className="flex items-center gap-1 text-[10px] text-gray-500 dark:text-gray-400">
                                <MapPin className="w-3 h-3" />
                                <span className="truncate max-w-[80px]">{product.location_province || 'ไม่ระบุ'}</span>
                            </div>
                            <span className="text-[10px] text-gray-400" suppressHydrationWarning>{formatRelativeTime(product.created_at)}</span>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    )
}
