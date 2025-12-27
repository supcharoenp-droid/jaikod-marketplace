'use client'

/**
 * SmartProductCard V3 - Premium Product Card with Enhanced Features
 * 
 * Features:
 * - Fixed heights for consistent grid layout
 * - Image gallery hover (slides through images on hover)
 * - Distance badge with self-calculation
 * - Unified location display (Thai/English based on language)
 * - No layout shift on hover
 * - Clear separation between product and seller info
 */

import { useState, useEffect, useMemo, useRef, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Heart, MapPin, Eye, Clock, BadgeCheck, Sparkles, TrendingDown,
    MessageCircle, Share2, ShoppingBag, Flame, Shield, Star, Zap,
    Camera, User, ChevronLeft, ChevronRight
} from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import { useWishlist } from '@/hooks/useWishlist'
import { formatDistanceToNow } from '@/lib/utils'
import { SmartProductData } from './SmartProductCardV2'
import { formatLocation as formatLocationHelper, formatDistanceDisplay as formatDistanceHelper } from '@/lib/location-localization'

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

    // Calculate distance for all products - either use provided or calculate from province
    useEffect(() => {
        const calculateDist = async () => {
            // If distance already provided, use it
            if (providedDistance !== undefined && providedDistance > 0) {
                setCalculatedDistance(providedDistance)
                return
            }

            // Otherwise calculate from province
            if (province) {
                try {
                    const { calculateDistanceToProduct } = await import('@/lib/geolocation')
                    const dist = await calculateDistanceToProduct(province)
                    if (dist !== null) {
                        setCalculatedDistance(dist)
                    }
                } catch (e) {
                    // Silently fail - distance is optional
                }
            }
        }
        calculateDist()
    }, [providedDistance, province])

    // Price calculations
    const hasDiscount = product.originalPrice && product.originalPrice > product.price
    const discountPercent = hasDiscount
        ? Math.round((1 - product.price / product.originalPrice!) * 100)
        : 0

    // Time calculations
    const isNew = (Date.now() - product.createdAt.getTime()) < (3 * 24 * 60 * 60 * 1000)
    const timeAgo = formatDistanceToNow(product.createdAt, language as 'th' | 'en')

    // Seller online status
    const isSellerOnline = product.seller?.isOnline

    // Format location using centralized helper (always Thai format for consistency)
    const formatLocation = useCallback((province?: string, amphoe?: string): string => {
        return formatLocationHelper(province, amphoe)
    }, [])

    // Format distance for display using centralized helper
    const getDistanceDisplay = useCallback((distance: number) => {
        return formatDistanceHelper(distance, language as 'th' | 'en')
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

                    {/* TOP RIGHT - Quick Actions (Always Visible) */}
                    <div className="absolute top-2 right-2 flex flex-col gap-1.5 z-20">
                        {/* View Button with Count */}
                        <button
                            className="flex items-center gap-1 px-2 py-1 rounded-full bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm shadow-md text-gray-600 dark:text-gray-300"
                        >
                            <Eye className="w-3.5 h-3.5" />
                            {product.stats?.views ? (
                                <span className="text-[10px] font-medium">
                                    {product.stats.views > 999 ? `${(product.stats.views / 1000).toFixed(1)}k` : product.stats.views}
                                </span>
                            ) : null}
                        </button>

                        {/* Wishlist Button */}
                        <motion.button
                            onClick={handleLikeClick}
                            whileTap={{ scale: 0.9 }}
                            className={`
                                flex items-center gap-1 px-2 py-1 rounded-full backdrop-blur-sm shadow-md transition-all
                                ${isLiked
                                    ? 'bg-red-500 text-white'
                                    : 'bg-white/90 dark:bg-slate-800/90 text-gray-600 dark:text-gray-300 hover:bg-red-50 hover:text-red-500'
                                }
                            `}
                        >
                            <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-current' : ''}`} />
                            {product.stats?.favorites ? (
                                <span className="text-[10px] font-medium">
                                    {product.stats.favorites}
                                </span>
                            ) : null}
                        </motion.button>

                        {/* Cart Button */}
                        <button
                            className="flex items-center justify-center w-8 h-8 rounded-full bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm shadow-md text-gray-600 dark:text-gray-300 hover:bg-purple-50 hover:text-purple-500 transition-colors"
                        >
                            <ShoppingBag className="w-3.5 h-3.5" />
                        </button>
                    </div>

                    {/* BOTTOM LEFT - Distance Badge (Elegant Minimal Design) */}
                    {calculatedDistance !== null && calculatedDistance > 0 && (
                        <div className="absolute bottom-2 left-2 z-20">
                            <span className="
                                px-2 py-1 bg-black/60 backdrop-blur-sm text-white text-[11px] font-medium rounded-lg 
                                flex items-center gap-1 shadow-sm
                            ">
                                <MapPin className="w-3 h-3 opacity-80" />
                                <span>{getDistanceDisplay(calculatedDistance)?.text}</span>
                            </span>
                        </div>
                    )}

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

                    {/* Location - Fixed Height (Amphoe, Province only - Distance is shown on image) */}
                    <div className="mt-2 h-4 flex items-center gap-1 text-[11px] text-gray-500 dark:text-gray-400">
                        <MapPin className="w-3 h-3 flex-shrink-0" />
                        <span className="truncate">
                            {formatLocation(product.location?.province, product.location?.amphoe)}
                        </span>
                    </div>

                    {/* DIVIDER */}
                    <div className="my-3 h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-slate-600 to-transparent" />

                    {/* SELLER SECTION - Fixed Height */}
                    {showSellerInfo && (
                        <div className="h-10 flex items-center gap-2.5">
                            {/* Avatar with Online Indicator */}
                            <div className="relative flex-shrink-0">
                                <div className="w-8 h-8 rounded-full overflow-hidden bg-gradient-to-br from-purple-400 to-pink-400 shadow-sm">
                                    {product.seller?.avatar ? (
                                        <Image
                                            src={product.seller.avatar}
                                            alt={product.seller?.name || 'Seller'}
                                            width={32}
                                            height={32}
                                            className="object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-white text-xs font-bold">
                                            {product.seller?.name?.charAt(0).toUpperCase() || <User className="w-4 h-4" />}
                                        </div>
                                    )}
                                </div>

                                {/* Online Status Dot */}
                                {isSellerOnline && (
                                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-slate-800" />
                                )}
                            </div>

                            {/* Seller Info */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-1">
                                    <span className="text-xs font-medium text-gray-800 dark:text-gray-200 truncate">
                                        {product.seller?.name || (language === 'th' ? 'ผู้ขาย' : 'Seller')}
                                    </span>
                                    {product.seller?.isVerified && (
                                        <BadgeCheck className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
                                    )}
                                </div>

                                {/* Seller Badge/Status */}
                                <div className="flex items-center gap-1.5 mt-0.5">
                                    {product.seller?.trustScore && product.seller.trustScore >= 70 ? (
                                        <span className="inline-flex items-center gap-0.5 text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                                            <Shield className="w-3 h-3" />
                                            {language === 'th' ? 'ร้านแนะนำ' : 'Trusted'}
                                        </span>
                                    ) : isNew ? (
                                        <span className="text-[10px] text-blue-500 font-medium">
                                            {language === 'th' ? 'ผู้ขายใหม่' : 'New Seller'}
                                        </span>
                                    ) : null}

                                    {product.seller?.responseTime && (
                                        <span className="text-[10px] text-gray-400 flex items-center gap-0.5">
                                            <Zap className="w-2.5 h-2.5 text-amber-500" />
                                            {product.seller.responseTime}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* FOOTER - Time Ago */}
                    <div className="mt-2 pt-2 border-t border-gray-100 dark:border-slate-700 flex items-center justify-between text-[10px] text-gray-400">
                        <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {timeAgo}
                        </span>

                        {/* Listing Code */}
                        {product.listingCode && (
                            <span className="font-mono text-gray-300">
                                #{product.listingCode.slice(-6)}
                            </span>
                        )}
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
