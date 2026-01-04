'use client'

/**
 * SmartProductCard V3 - Compact Edition
 * 
 * Features:
 * - Fixed heights for consistent grid layout
 * - Image gallery hover (slides through images on hover)
 * - Color-coded distance badge
 * - Unified location display
 * - NO seller section (shown on detail page)
 */

import { useState, useEffect, useMemo, useRef, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Heart, MapPin, Sparkles, TrendingDown, Flame, Camera, Rocket
} from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import { useWishlist } from '@/hooks/useWishlist'
import { useViewerLocation } from '@/hooks/useViewerLocation'
import { SmartProductData } from './SmartProductCardV2'
import {
    calculateDistance,
    formatDistanceDisplay,
    getDistanceColorClass,
    formatLocationText,
    getDistrictCenterCoordinates
} from '@/lib/location-engine'
import ActivityBadge from '@/components/common/ActivityBadge'

// ==========================================
// PLACEHOLDER IMAGES
// ==========================================

const PLACEHOLDER_IMAGES = [
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1560393464-5c69a73c5770?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=400&fit=crop'
]

// Location formatting now uses centralized helper from @/lib/location-localization

// ==========================================
// COMPONENT PROPS
// ==========================================

interface SmartProductCardV3Props {
    product: SmartProductData
    variant?: 'default' | 'compact' | 'featured'
    showAIInsights?: boolean
    showSellerInfo?: boolean
}

// ==========================================
// MAIN COMPONENT
// ==========================================

export default function SmartProductCardV3({
    product,
    variant = 'default',
    showAIInsights = true,
    showSellerInfo = true
}: SmartProductCardV3Props) {
    const { language } = useLanguage()
    const { isInWishlist, toggleWishlist } = useWishlist()

    const [imageLoaded, setImageLoaded] = useState(false)
    const [imageError, setImageError] = useState(false)
    const [isHovered, setIsHovered] = useState(false)
    const [currentImageIndex, setCurrentImageIndex] = useState(0)
    const [calculatedDistance, setCalculatedDistance] = useState<number | null>(null)
    const hoverIntervalRef = useRef<NodeJS.Timeout | null>(null)

    // Derived states
    const isLiked = isInWishlist(product.id)
    const productUrl = product.source === 'listing'
        ? `/listing/${product.slug || product.id}`
        : `/product/${product.slug || product.id}`

    // Get all available images
    const allImages = useMemo(() => {
        const images: string[] = []

        // Add thumbnail first
        if (product.thumbnailUrl && product.thumbnailUrl !== '/placeholder.svg') {
            images.push(product.thumbnailUrl)
        }

        // Add other images from array
        if (product.images && product.images.length > 0) {
            product.images.forEach(img => {
                const url = typeof img === 'string' ? img : (img as any)?.url
                if (url && !images.includes(url) && url !== '/placeholder.svg') {
                    images.push(url)
                }
            })
        }

        // Fallback to placeholder if no images
        if (images.length === 0) {
            const placeholderIndex = product.id.charCodeAt(0) % PLACEHOLDER_IMAGES.length
            images.push(PLACEHOLDER_IMAGES[placeholderIndex])
        }

        return images
    }, [product.thumbnailUrl, product.images, product.id])

    // Current image source
    const currentImageSrc = useMemo(() => {
        if (imageError) {
            const placeholderIndex = product.id.charCodeAt(0) % PLACEHOLDER_IMAGES.length
            return PLACEHOLDER_IMAGES[placeholderIndex]
        }
        return allImages[currentImageIndex] || allImages[0]
    }, [allImages, currentImageIndex, imageError, product.id])

    // Image hover slideshow effect
    useEffect(() => {
        if (isHovered && allImages.length > 1) {
            hoverIntervalRef.current = setInterval(() => {
                setCurrentImageIndex(prev => (prev + 1) % allImages.length)
            }, 1500) // Change image every 1.5 seconds
        } else {
            if (hoverIntervalRef.current) {
                clearInterval(hoverIntervalRef.current)
                hoverIntervalRef.current = null
            }
            // Reset to first image when not hovering
            if (!isHovered) {
                setCurrentImageIndex(0)
            }
        }

        return () => {
            if (hoverIntervalRef.current) {
                clearInterval(hoverIntervalRef.current)
            }
        }
    }, [isHovered, allImages.length])

    // Extract values once for stable dependencies
    const providedDistance = product.location?.distance
    const province = product.location?.province
    const amphoe = product.location?.amphoe
    const listingLat = (product as any).location?.coordinates?.lat
    const listingLng = (product as any).location?.coordinates?.lng

    // Get viewer location using Global Location Engine
    const { location: viewerLocation, isLoading: viewerLocationLoading, hasLocation } = useViewerLocation()

    // State for approximate indicator
    const [isApproximate, setIsApproximate] = useState(false)

    // Calculate distance using Global Location Engine
    useEffect(() => {
        // Wait for viewer location (NO fallback - if no location, hide distance)
        if (viewerLocationLoading) return
        if (!viewerLocation || !hasLocation) {
            setCalculatedDistance(null)
            return
        }

        // If distance already provided by listing data, use it
        if (providedDistance !== undefined && providedDistance > 0) {
            setCalculatedDistance(providedDistance)
            setIsApproximate(false)
            return
        }

        // Priority 1: Listing has exact coordinates
        if (listingLat && listingLng) {
            const dist = calculateDistance(
                { latitude: viewerLocation.latitude, longitude: viewerLocation.longitude },
                { latitude: listingLat, longitude: listingLng }
            )
            setCalculatedDistance(dist)
            setIsApproximate(false)
            return
        }

        // Priority 2: Calculate using province/district centroids
        if (province) {
            const listingLocation = getDistrictCenterCoordinates(province, amphoe)
            if (listingLocation) {
                const dist = calculateDistance(
                    { latitude: viewerLocation.latitude, longitude: viewerLocation.longitude },
                    { latitude: listingLocation.latitude, longitude: listingLocation.longitude }
                )
                setCalculatedDistance(dist)
                setIsApproximate(true) // Centroid-based is always approximate
                return
            }
        }

        // No valid listing location - hide distance
        setCalculatedDistance(null)
    }, [providedDistance, province, amphoe, listingLat, listingLng, viewerLocation, viewerLocationLoading, hasLocation])

    // Price calculations
    const hasDiscount = product.originalPrice && product.originalPrice > product.price
    const discountPercent = hasDiscount
        ? Math.round((1 - product.price / product.originalPrice!) * 100)
        : 0

    // Time calculations - only for NEW badge
    const isNew = (Date.now() - product.createdAt.getTime()) < (3 * 24 * 60 * 60 * 1000)

    // Format location using location engine
    const formatLocation = useCallback((provinceName?: string, districtName?: string): string => {
        return formatLocationText(provinceName, districtName, language as 'th' | 'en')
    }, [language])

    // Get distance display text using location engine
    const getDistanceText = useCallback((distance: number) => {
        return formatDistanceDisplay(distance, language as 'th' | 'en')
    }, [language])

    // Handle wishlist toggle
    const handleLikeClick = async (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        await toggleWishlist(product as any)
    }

    return (
        <Link href={productUrl} className="block">
            <motion.div
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
                className={`
                    relative bg-white dark:bg-slate-800 
                    rounded-2xl overflow-hidden 
                    border border-gray-100 dark:border-slate-700
                    shadow-sm hover:shadow-xl hover:shadow-purple-500/10 
                    transition-shadow duration-300
                    ${variant === 'featured' ? 'ring-2 ring-purple-500' : ''}
                `}
            >
                {/* IMAGE SECTION - Fixed Aspect Ratio */}
                <div
                    className="relative aspect-square overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 dark:from-slate-700 dark:to-slate-800"
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                >

                    {/* Skeleton Loading */}
                    {!imageLoaded && (
                        <div className="absolute inset-0 z-0">
                            <div className="w-full h-full bg-gradient-to-br from-purple-100 via-gray-100 to-pink-100 dark:from-purple-900/20 dark:via-slate-800 dark:to-pink-900/20 animate-pulse" />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <Camera className="w-12 h-12 text-gray-300 dark:text-gray-600" />
                            </div>
                        </div>
                    )}

                    {/* Main Image with Animation */}
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentImageIndex}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="absolute inset-0"
                        >
                            <Image
                                src={currentImageSrc}
                                alt={product.title}
                                fill
                                className={`
                                    object-cover transition-transform duration-500
                                    ${imageLoaded ? 'opacity-100' : 'opacity-0'}
                                    ${isHovered ? 'scale-110' : 'scale-100'}
                                `}
                                onLoad={() => setImageLoaded(true)}
                                onError={() => {
                                    setImageError(true)
                                    setImageLoaded(true)
                                }}
                                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                            />
                        </motion.div>
                    </AnimatePresence>

                    {/* Top Gradient */}
                    <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-black/30 to-transparent z-10 pointer-events-none" />

                    {/* Bottom Gradient */}
                    <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/50 to-transparent z-10 pointer-events-none" />

                    {/* SELLER VIEW: Promotion Status Overlay */}
                    {product.source === 'listing' && (product as any).promotion?.isActive && (
                        <div className="absolute inset-0 bg-purple-900/40 backdrop-blur-[2px] z-20 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="bg-white text-purple-600 px-3 py-1 rounded-full text-[10px] font-black shadow-lg flex items-center gap-1 animate-bounce">
                                <Rocket className="w-3 h-3" />
                                PROMOTING NOW
                            </div>
                            <div className="text-white text-[10px] font-bold mt-1 bg-black/50 px-2 py-0.5 rounded-full">
                                Ends: {(() => {
                                    const endTime = (product as any).promotion.endTime;
                                    if (!endTime) return 'Soon';
                                    const date = endTime.toDate ? endTime.toDate() : new Date(endTime);
                                    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                                })()}
                            </div>
                        </div>
                    )}

                    {/* TOP LEFT BADGES */}
                    <div className="absolute top-2 left-2 flex flex-col gap-1 z-20">
                        {/* Hot Badge */}
                        {product.isHot && (
                            <span className="px-2 py-0.5 bg-gradient-to-r from-red-500 to-orange-500 text-white text-[10px] font-bold rounded-md shadow-lg flex items-center gap-0.5">
                                <Flame className="w-3 h-3" />
                                HOT
                            </span>
                        )}

                        {/* New Badge */}
                        {isNew && !product.isHot && (
                            <span className="px-2 py-0.5 bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-[10px] font-bold rounded-md shadow-lg">
                                NEW
                            </span>
                        )}

                        {/* Discount Badge */}
                        {hasDiscount && discountPercent >= 10 && (
                            <span className="px-2 py-0.5 bg-red-500 text-white text-[10px] font-bold rounded-md shadow-lg">
                                -{discountPercent}%
                            </span>
                        )}

                        {/* AI Good Price Badge */}
                        {showAIInsights && product.ai?.priceInsight === 'below_market' && (
                            <span className="px-2 py-0.5 bg-emerald-500 text-white text-[10px] font-bold rounded-md shadow-lg flex items-center gap-0.5">
                                <TrendingDown className="w-3 h-3" />
                                {language === 'th' ? 'ราคาดี' : 'Good Deal'}
                            </span>
                        )}
                    </div>

                    {/* TOP RIGHT - Wishlist Only */}
                    <div className="absolute top-2 right-2 z-20">
                        <motion.button
                            onClick={handleLikeClick}
                            whileTap={{ scale: 0.9 }}
                            className={`
                                flex items-center justify-center w-8 h-8 rounded-full backdrop-blur-sm shadow-md transition-all
                                ${isLiked
                                    ? 'bg-red-500 text-white'
                                    : 'bg-white/90 dark:bg-slate-800/90 text-gray-600 dark:text-gray-300 hover:bg-red-50 hover:text-red-500'
                                }
                            `}
                        >
                            <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
                        </motion.button>
                    </div>

                    {/* BOTTOM LEFT - Location + Distance Badge */}
                    <div className="absolute bottom-2 left-2 z-20">
                        <span className={`
                            px-2 py-1 backdrop-blur-sm text-white text-[11px] font-medium rounded-lg 
                            flex items-center gap-1 shadow-sm
                            ${calculatedDistance !== null ? getDistanceColorClass(calculatedDistance) : 'bg-gray-600/80'}
                        `}>
                            <MapPin className="w-3 h-3 opacity-80" />
                            <span className="truncate max-w-[100px]">
                                {product.location?.province || 'ไม่ระบุ'}
                                {calculatedDistance !== null && (
                                    <> · {isApproximate ? '~' : ''}{getDistanceText(calculatedDistance)}</>
                                )}
                            </span>
                        </span>
                    </div>

                    {/* BOTTOM RIGHT - Image Gallery Dots */}
                    {allImages.length > 1 && (
                        <div className="absolute bottom-2 right-2 z-20 flex items-center gap-1.5 bg-black/40 backdrop-blur-sm px-2 py-1 rounded-full">
                            {allImages.slice(0, 4).map((_, idx) => (
                                <div
                                    key={idx}
                                    className={`
                                        w-1.5 h-1.5 rounded-full transition-all
                                        ${idx === currentImageIndex
                                            ? 'bg-white w-3'
                                            : 'bg-white/50'
                                        }
                                    `}
                                />
                            ))}
                            {allImages.length > 4 && (
                                <span className="text-[9px] text-white/80 ml-0.5">
                                    +{allImages.length - 4}
                                </span>
                            )}
                        </div>
                    )}
                </div>

                {/* CONTENT SECTION */}
                <div className="p-3">
                    {/* Title - Fixed 2 Lines */}
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white line-clamp-2 h-10 leading-5">
                        {product.title}
                    </h3>

                    {/* Price Section */}
                    <div className="mt-2 flex items-baseline gap-2">
                        <span className="text-lg font-bold text-purple-600 dark:text-purple-400">
                            ฿{product.price.toLocaleString()}
                        </span>
                        {hasDiscount && (
                            <span className="text-xs text-gray-400 line-through">
                                ฿{product.originalPrice?.toLocaleString()}
                            </span>
                        )}
                    </div>

                    {/* Activity Intelligence - Time Only (Location is on image badge) */}
                    <div className="mt-2 pt-2 border-t border-gray-100 dark:border-gray-700">
                        <ActivityBadge
                            createdAt={product.createdAt || new Date()}
                            updatedAt={(product as any).updatedAt}
                            viewsToday={(product as any).viewsToday || product.stats?.views}
                            wishlistCount={(product as any).wishlistCount || product.stats?.favorites}
                            lastChatAt={(product as any).lastChatAt}
                            categoryId={(product as any).categoryId || 0}
                            variant="inline"
                        />
                    </div>
                </div>

                {/* AI Listing Corner Badge */}
                {product.source === 'listing' && (
                    <div className="absolute top-0 right-0 w-0 h-0 border-l-[20px] border-l-transparent border-t-[20px] border-t-purple-500 z-30">
                        <Sparkles className="absolute -top-[17px] -left-[3px] w-2.5 h-2.5 text-white" />
                    </div>
                )}
            </motion.div>
        </Link>
    )
}
