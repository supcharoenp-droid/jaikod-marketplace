'use client'

/**
 * UnifiedProductCard
 * 
 * A premium product card that works with both legacy products and new listings.
 * Features:
 * - AI Score badge (for listings)
 * - Listing Code display
 * - Source-aware URL routing
 * - Modern glassmorphism design
 */

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { Heart, MapPin, Eye, Sparkles, Clock, BadgeCheck, Tag } from 'lucide-react'
import type { UnifiedProduct } from '@/services/unifiedMarketplace'
import { getProductUrl } from '@/services/unifiedMarketplace'

interface UnifiedProductCardProps {
    product: UnifiedProduct
    showAIScore?: boolean
    showLocation?: boolean
    showListingCode?: boolean
    compact?: boolean
}

export default function UnifiedProductCard({
    product,
    showAIScore = true,
    showLocation = true,
    showListingCode = false,
    compact = false
}: UnifiedProductCardProps) {
    const [isFavorited, setIsFavorited] = useState(false)
    const [imageError, setImageError] = useState(false)

    const productUrl = getProductUrl(product)
    const isNewListing = product.source === 'listing'
    const hasAIScore = isNewListing && product.aiScore && product.aiScore > 0

    // Calculate days ago
    const daysAgo = Math.floor((Date.now() - product.createdAt.getTime()) / (1000 * 60 * 60 * 24))
    const isNew = daysAgo <= 3

    // Calculate discount
    const discount = product.originalPrice
        ? Math.round((1 - product.price / product.originalPrice) * 100)
        : 0

    return (
        <Link href={productUrl} className="group block">
            <div className={`relative bg-white dark:bg-slate-800 rounded-2xl overflow-hidden border border-gray-100 dark:border-slate-700 
                           shadow-sm hover:shadow-xl hover:shadow-purple-500/10 transition-all duration-300 
                           group-hover:-translate-y-1 ${compact ? '' : ''}`}>

                {/* Image Container */}
                <div className="relative aspect-square overflow-hidden bg-gray-100 dark:bg-slate-700">
                    <Image
                        src={imageError ? '/placeholder.svg' : product.thumbnailUrl}
                        alt={product.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={() => setImageError(true)}
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                    />

                    {/* Top Badges Row */}
                    <div className="absolute top-2 left-2 right-2 flex justify-between items-start">
                        {/* Left Badges */}
                        <div className="flex flex-col gap-1">
                            {/* NEW Badge */}
                            {isNew && (
                                <span className="px-2 py-0.5 bg-gradient-to-r from-pink-500 to-rose-500 text-white text-[10px] font-bold rounded-full shadow-lg">
                                    NEW
                                </span>
                            )}

                            {/* Discount Badge */}
                            {discount > 0 && (
                                <span className="px-2 py-0.5 bg-red-500 text-white text-[10px] font-bold rounded-full shadow-lg">
                                    -{discount}%
                                </span>
                            )}

                            {/* AI Score Badge */}
                            {showAIScore && hasAIScore && (
                                <span className="px-2 py-0.5 bg-gradient-to-r from-purple-500 to-indigo-500 text-white text-[10px] font-bold rounded-full shadow-lg flex items-center gap-1">
                                    <Sparkles className="w-2.5 h-2.5" />
                                    AI {product.aiScore}
                                </span>
                            )}
                        </div>

                        {/* Favorite Button */}
                        <button
                            onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                setIsFavorited(!isFavorited)
                            }}
                            className={`p-2 rounded-full backdrop-blur-md transition-all shadow-lg
                                      ${isFavorited
                                    ? 'bg-red-500 text-white'
                                    : 'bg-white/80 dark:bg-slate-800/80 text-gray-600 dark:text-gray-300 hover:bg-red-50 hover:text-red-500'
                                }`}
                        >
                            <Heart className={`w-4 h-4 ${isFavorited ? 'fill-current' : ''}`} />
                        </button>
                    </div>

                    {/* Bottom Overlay - Location & Views */}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2 pt-8">
                        <div className="flex items-center justify-between text-white text-[10px]">
                            {showLocation && product.province && (
                                <span className="flex items-center gap-1 truncate">
                                    <MapPin className="w-3 h-3" />
                                    {product.amphoe || product.province}
                                </span>
                            )}
                            <span className="flex items-center gap-1">
                                <Eye className="w-3 h-3" />
                                {product.views}
                            </span>
                        </div>
                    </div>

                    {/* New Listing Indicator */}
                    {isNewListing && (
                        <div className="absolute bottom-2 left-2 w-2 h-2 bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-400/50"
                            title="ประกาศระบบใหม่" />
                    )}
                </div>

                {/* Content */}
                <div className="p-3">
                    {/* Title */}
                    <h3 className="font-medium text-gray-900 dark:text-white text-sm line-clamp-2 mb-2 min-h-[40px] group-hover:text-purple-600 transition-colors">
                        {product.title}
                    </h3>

                    {/* Price */}
                    <div className="flex items-end gap-2 mb-2">
                        <span className="text-lg font-bold text-purple-600 dark:text-purple-400">
                            ฿{product.price.toLocaleString()}
                        </span>
                        {product.originalPrice && product.originalPrice > product.price && (
                            <span className="text-xs text-gray-400 line-through mb-0.5">
                                ฿{product.originalPrice.toLocaleString()}
                            </span>
                        )}
                    </div>

                    {/* Bottom Row - Seller & Meta */}
                    <div className="flex items-center justify-between text-[10px] text-gray-500 dark:text-gray-400">
                        {/* Seller */}
                        <div className="flex items-center gap-1 truncate">
                            {product.sellerVerified && (
                                <BadgeCheck className="w-3 h-3 text-blue-500 flex-shrink-0" />
                            )}
                            <span className="truncate">{product.sellerName}</span>
                        </div>

                        {/* Time */}
                        <div className="flex items-center gap-1 flex-shrink-0">
                            <Clock className="w-3 h-3" />
                            {daysAgo === 0 ? 'วันนี้' : `${daysAgo}d`}
                        </div>
                    </div>

                    {/* Listing Code (optional) */}
                    {showListingCode && product.listingCode && (
                        <div className="mt-2 pt-2 border-t border-gray-100 dark:border-slate-700">
                            <span className="flex items-center gap-1 text-[10px] text-gray-400 font-mono">
                                <Tag className="w-3 h-3" />
                                {product.listingCode}
                            </span>
                        </div>
                    )}
                </div>
            </div>
        </Link>
    )
}
