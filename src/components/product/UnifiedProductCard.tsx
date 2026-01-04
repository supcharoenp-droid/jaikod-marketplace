'use client'

/**
 * UnifiedProductCard V3 - Location Engine Edition
 * 
 * A clean, compact product card with Global Location & Distance Standard:
 * - Calculates distance from viewer location
 * - Uses Location Engine for consistent display
 * - Color-coded distance badges
 * 
 * Seller info is shown on detail page only.
 */

import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect, useCallback } from 'react'
import { Heart, MapPin, Eye, Sparkles, Camera } from 'lucide-react'
import type { UnifiedProduct } from '@/services/unifiedMarketplace'
import { getProductUrl } from '@/services/unifiedMarketplace'
import ActivityBadge from '@/components/common/ActivityBadge'
import { useViewerLocation } from '@/hooks/useViewerLocation'
import {
    calculateDistance,
    formatDistanceDisplay,
    getDistanceColorClass,
    getDistrictCenterCoordinates
} from '@/lib/location-engine'
import { useLanguage } from '@/contexts/LanguageContext'

interface UnifiedProductCardProps {
    product: UnifiedProduct
    showAIScore?: boolean
    showLocation?: boolean
    variant?: 'default' | 'compact' | 'horizontal'
}

export default function UnifiedProductCard({
    product,
    showAIScore = true,
    showLocation = true,
    variant = 'default'
}: UnifiedProductCardProps) {
    const { language } = useLanguage()
    const [isFavorited, setIsFavorited] = useState(false)
    const [imageError, setImageError] = useState(false)
    const [calculatedDistance, setCalculatedDistance] = useState<number | null>(null)
    const [isApproximate, setIsApproximate] = useState(false)

    // Get viewer location from Location Engine
    const { location: viewerLocation, hasLocation, isLoading: viewerLoading } = useViewerLocation()

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

    // Image count
    const imageCount = product.images?.length || 1

    // Calculate distance using Location Engine
    useEffect(() => {
        if (viewerLoading) return
        if (!viewerLocation || !hasLocation) {
            setCalculatedDistance(null)
            return
        }

        // If distance already provided, use it
        if (product.distance !== undefined && product.distance !== null && product.distance > 0) {
            setCalculatedDistance(product.distance)
            setIsApproximate(false)
            return
        }

        // Get product coordinates (if available)
        const productLat = (product as any).location?.coordinates?.lat
        const productLng = (product as any).location?.coordinates?.lng

        // Priority 1: Exact coordinates from product
        if (productLat && productLng) {
            const dist = calculateDistance(
                { latitude: viewerLocation.latitude, longitude: viewerLocation.longitude },
                { latitude: productLat, longitude: productLng }
            )
            setCalculatedDistance(dist)
            setIsApproximate(false)
            return
        }

        // Priority 2: Calculate from province/district centroids
        if (product.province) {
            const productLocation = getDistrictCenterCoordinates(product.province, product.amphoe)
            if (productLocation) {
                const dist = calculateDistance(
                    { latitude: viewerLocation.latitude, longitude: viewerLocation.longitude },
                    { latitude: productLocation.latitude, longitude: productLocation.longitude }
                )
                setCalculatedDistance(dist)
                setIsApproximate(true)
                return
            }
        }

        // No valid product location
        setCalculatedDistance(null)
    }, [viewerLocation, hasLocation, viewerLoading, product.distance, product.province, product.amphoe])

    // Get distance display text
    const getDistanceText = useCallback((distance: number) => {
        return formatDistanceDisplay(distance, language as 'th' | 'en')
    }, [language])

    return (
        <Link href={productUrl} className="group block">
            <div className="relative bg-white dark:bg-slate-800 rounded-2xl overflow-hidden 
                          border border-gray-100 dark:border-slate-700 
                          shadow-sm hover:shadow-xl hover:shadow-purple-500/10 
                          transition-all duration-300 group-hover:-translate-y-1">

                {/* Image Container */}
                <div className="relative aspect-[4/3] overflow-hidden bg-gray-100 dark:bg-slate-700">
                    <Image
                        src={imageError ? '/placeholder.svg' : product.thumbnailUrl}
                        alt={product.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={() => setImageError(true)}
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    />

                    {/* Top Left Badges */}
                    <div className="absolute top-2 left-2 flex flex-col gap-1">
                        {/* NEW Badge */}
                        {isNew && (
                            <span className="px-2.5 py-1 bg-gradient-to-r from-pink-500 to-rose-500 
                                           text-white text-[11px] font-bold rounded-lg shadow-lg
                                           animate-pulse">
                                NEW
                            </span>
                        )}

                        {/* Discount Badge */}
                        {discount > 0 && (
                            <span className="px-2 py-0.5 bg-red-500 text-white text-[10px] font-bold rounded-lg shadow-lg">
                                -{discount}%
                            </span>
                        )}

                        {/* AI Score Badge */}
                        {showAIScore && hasAIScore && (
                            <span className="px-2 py-0.5 bg-gradient-to-r from-purple-500 to-indigo-500 
                                           text-white text-[10px] font-bold rounded-lg shadow-lg 
                                           flex items-center gap-1">
                                <Sparkles className="w-2.5 h-2.5" />
                                {product.aiScore}%
                            </span>
                        )}
                    </div>

                    {/* Top Right - Actions */}
                    <div className="absolute top-2 right-2 flex flex-col gap-1.5">
                        {/* Views */}
                        <div className="px-2 py-1 bg-black/50 backdrop-blur-sm rounded-lg 
                                      flex items-center gap-1 text-white text-[10px]">
                            <Eye className="w-3 h-3" />
                            {product.views}
                        </div>

                        {/* Favorite Button */}
                        <button
                            onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                setIsFavorited(!isFavorited)
                            }}
                            className={`p-1.5 rounded-lg backdrop-blur-sm transition-all shadow-lg
                                      ${isFavorited
                                    ? 'bg-red-500 text-white'
                                    : 'bg-black/50 text-white hover:bg-red-500'
                                }`}
                        >
                            <Heart className={`w-4 h-4 ${isFavorited ? 'fill-current' : ''}`} />
                        </button>
                    </div>

                    {/* Bottom Left - Distance Badge (Location Engine) */}
                    {showLocation && calculatedDistance !== null && (
                        <div className="absolute bottom-2 left-2">
                            <span className={`px-2 py-1 ${getDistanceColorClass(calculatedDistance)} 
                                            text-white text-[11px] font-semibold rounded-lg 
                                            shadow-lg flex items-center gap-1 backdrop-blur-sm`}>
                                <MapPin className="w-3 h-3" />
                                {isApproximate ? '~' : ''}{getDistanceText(calculatedDistance)}
                            </span>
                        </div>
                    )}

                    {/* Bottom Right - Image Count */}
                    {imageCount > 1 && (
                        <div className="absolute bottom-2 right-2">
                            <span className="px-2 py-1 bg-black/50 backdrop-blur-sm text-white 
                                           text-[10px] rounded-lg flex items-center gap-1">
                                <Camera className="w-3 h-3" />
                                +{imageCount - 1}
                            </span>
                        </div>
                    )}

                    {/* Gradient Overlay at Bottom */}
                    <div className="absolute bottom-0 left-0 right-0 h-16 
                                  bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />
                </div>

                {/* Content - Compact */}
                <div className="p-3">
                    {/* Title - 2 lines max */}
                    <h3 className="font-semibold text-gray-900 dark:text-white text-sm 
                                 line-clamp-2 mb-2 min-h-[40px] leading-tight
                                 group-hover:text-purple-600 dark:group-hover:text-purple-400 
                                 transition-colors">
                        {product.title}
                    </h3>

                    {/* Price Row */}
                    <div className="flex items-baseline justify-between">
                        <div className="flex items-baseline gap-2">
                            <span className="text-lg font-bold text-transparent bg-clip-text 
                                           bg-gradient-to-r from-purple-600 to-indigo-600
                                           dark:from-purple-400 dark:to-indigo-400">
                                ฿{product.price.toLocaleString()}
                            </span>
                            {product.originalPrice && product.originalPrice > product.price && (
                                <span className="text-xs text-gray-400 line-through">
                                    ฿{product.originalPrice.toLocaleString()}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Location - Simple */}
                    {showLocation && product.province && (
                        <div className="mt-2 flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                            <MapPin className="w-3 h-3" />
                            <span className="truncate">
                                {product.amphoe ? `${product.amphoe}, ` : ''}{product.province}
                            </span>
                        </div>
                    )}

                    {/* Activity Badge - Time + Activity */}
                    <div className="mt-2 pt-2 border-t border-gray-100 dark:border-gray-700">
                        <ActivityBadge
                            createdAt={product.createdAt}
                            updatedAt={product.updatedAt}
                            viewsToday={(product as any).viewsToday}
                            wishlistCount={(product as any).wishlistCount}
                            categoryId={(product as any).categoryId || 0}
                            variant="inline"
                        />
                    </div>
                </div>
            </div>
        </Link>
    )
}
