'use client'

/**
 * SmartProductCard V2 - AI-Powered Premium Product Card
 * 
 * Features:
 * - Intelligent image fallback with beautiful placeholders
 * - Trust Badge integration
 * - AI Price Insights
 * - Social proof indicators
 * - Smart hover effects
 * - Real-time seller activity status
 * - Internationalization ready
 */

import { useState, useEffect, useMemo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Heart, MapPin, Eye, Clock, BadgeCheck, Sparkles, TrendingDown,
    MessageCircle, Share2, ShoppingBag, Flame, Shield, Star, Zap,
    MoreHorizontal, Camera, CheckCircle, AlertCircle
} from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import { useWishlist } from '@/hooks/useWishlist'
import { formatDistanceToNow } from '@/lib/utils'
import { toThaiProvince, toThaiAmphoe } from '@/lib/location-localization'

// ==========================================
// TYPES
// ==========================================

export interface SmartProductData {
    id: string
    slug?: string
    title: string
    price: number
    originalPrice?: number
    thumbnailUrl: string
    images?: string[]
    condition?: 'new' | 'like_new' | 'good' | 'fair'
    location?: {
        province?: string
        amphoe?: string
        distance?: number
    }
    seller?: {
        id: string
        name: string
        avatar?: string
        isVerified?: boolean
        trustScore?: number
        responseTime?: string // "< 1h", "< 5m", etc
        isOnline?: boolean
        lastActive?: Date
    }
    stats?: {
        views: number
        favorites: number
        inquiries: number
    }
    ai?: {
        score?: number
        priceInsight?: 'below_market' | 'fair' | 'above_market'
        pricePercentage?: number // e.g., -15 means 15% below market
        recommendation?: string
        qualityScore?: number
    }
    source: 'listing' | 'product'
    listingCode?: string
    createdAt: Date
    isHot?: boolean
    isFeatured?: boolean
}

interface SmartProductCardProps {
    product: SmartProductData
    variant?: 'default' | 'compact' | 'featured'
    showAIInsights?: boolean
    showSellerInfo?: boolean
    showQuickActions?: boolean
    onShare?: () => void
    onChat?: () => void
}

// ==========================================
// PLACEHOLDER IMAGES BY CATEGORY
// ==========================================

const PLACEHOLDER_IMAGES = [
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1560393464-5c69a73c5770?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=400&fit=crop'
]

// ==========================================
// MAIN COMPONENT
// ==========================================

export default function SmartProductCardV2({
    product,
    variant = 'default',
    showAIInsights = true,
    showSellerInfo = true,
    showQuickActions = true,
    onShare,
    onChat
}: SmartProductCardProps) {
    const { language, t } = useLanguage()
    const { isInWishlist, toggleWishlist } = useWishlist()

    const [imageLoaded, setImageLoaded] = useState(false)
    const [imageError, setImageError] = useState(false)
    const [isHovered, setIsHovered] = useState(false)
    const [currentImageIndex, setCurrentImageIndex] = useState(0)

    // Derived states
    const isLiked = isInWishlist(product.id)
    const productUrl = product.source === 'listing'
        ? `/listing/${product.slug || product.id}`
        : `/product/${product.slug || product.id}`

    // Image handling with smart fallback
    const imageSrc = useMemo(() => {
        if (imageError || !product.thumbnailUrl || product.thumbnailUrl === '/placeholder.svg') {
            // Use consistent placeholder based on product ID
            const placeholderIndex = product.id.charCodeAt(0) % PLACEHOLDER_IMAGES.length
            return PLACEHOLDER_IMAGES[placeholderIndex]
        }
        return product.thumbnailUrl
    }, [product.thumbnailUrl, product.id, imageError])

    // Price calculations
    const hasDiscount = product.originalPrice && product.originalPrice > product.price
    const discountPercent = hasDiscount
        ? Math.round((1 - product.price / product.originalPrice!) * 100)
        : 0

    // Time calculations
    const isNew = (Date.now() - product.createdAt.getTime()) < (3 * 24 * 60 * 60 * 1000)
    const timeAgo = formatDistanceToNow(product.createdAt, language as 'th' | 'en')

    // AI Price insight
    const priceInsightText = useMemo(() => {
        if (!product.ai?.priceInsight) return null

        const texts = {
            below_market: {
                th: `ถูกกว่าตลาด ${Math.abs(product.ai.pricePercentage || 15)}%`,
                en: `${Math.abs(product.ai.pricePercentage || 15)}% below market`
            },
            fair: {
                th: 'ราคาเหมาะสม',
                en: 'Fair price'
            },
            above_market: {
                th: 'สูงกว่าตลาด',
                en: 'Above market'
            }
        }

        return texts[product.ai.priceInsight]?.[language as 'th' | 'en'] || null
    }, [product.ai, language])

    // Seller online status
    const sellerStatus = useMemo(() => {
        if (product.seller?.isOnline) {
            return { text: language === 'th' ? 'ออนไลน์' : 'Online', color: 'bg-green-500' }
        }
        if (product.seller?.lastActive) {
            const minutesAgo = Math.floor((Date.now() - product.seller.lastActive.getTime()) / 60000)
            if (minutesAgo < 60) {
                return {
                    text: language === 'th' ? `${minutesAgo} นาทีที่แล้ว` : `${minutesAgo}m ago`,
                    color: 'bg-yellow-500'
                }
            }
        }
        return null
    }, [product.seller, language])

    // Handle wishlist toggle
    const handleLikeClick = async (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        await toggleWishlist(product as any)
    }

    // Handle share
    const handleShare = (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        onShare?.()
    }

    // Handle chat
    const handleChat = (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        onChat?.()
    }

    // Image gallery on hover
    useEffect(() => {
        if (isHovered && product.images && product.images.length > 1) {
            const interval = setInterval(() => {
                setCurrentImageIndex(prev => (prev + 1) % product.images!.length)
            }, 1500)
            return () => clearInterval(interval)
        } else {
            setCurrentImageIndex(0)
        }
    }, [isHovered, product.images])

    return (
        <Link href={productUrl} className="block h-full">
            <motion.div
                onHoverStart={() => setIsHovered(true)}
                onHoverEnd={() => setIsHovered(false)}
                whileHover={{ y: -4 }}
                className={`
                    relative flex flex-col h-full bg-white dark:bg-slate-800 
                    rounded-2xl overflow-hidden border border-gray-100 dark:border-slate-700
                    shadow-sm hover:shadow-xl hover:shadow-purple-500/10 
                    transition-shadow duration-300
                    ${variant === 'featured' ? 'ring-2 ring-purple-500' : ''}
                `}
            >
                {/* IMAGE ZONE */}
                <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 dark:from-slate-700 dark:to-slate-800">

                    {/* Skeleton Loading */}
                    <AnimatePresence>
                        {!imageLoaded && (
                            <motion.div
                                initial={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="absolute inset-0 z-0"
                            >
                                <div className="w-full h-full bg-gradient-to-br from-purple-100 via-gray-100 to-pink-100 dark:from-purple-900/20 dark:via-slate-800 dark:to-pink-900/20 animate-pulse" />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <Camera className="w-12 h-12 text-gray-300 dark:text-gray-600" />
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Main Image */}
                    <Image
                        src={
                            isHovered && product.images && product.images[currentImageIndex]
                                ? product.images[currentImageIndex]
                                : imageSrc
                        }
                        alt={product.title}
                        fill
                        className={`
                            object-cover transition-all duration-500
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

                    {/* Gradient Overlays */}
                    <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-black/30 to-transparent z-10" />
                    <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/50 to-transparent z-10" />

                    {/* TOP LEFT BADGES */}
                    <div className="absolute top-2 left-2 flex flex-col gap-1.5 z-20">
                        {/* Featured Badge */}
                        {product.isFeatured && (
                            <motion.span
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="px-2 py-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[10px] font-bold rounded-lg shadow-lg flex items-center gap-1"
                            >
                                <Star className="w-3 h-3 fill-current" />
                                {language === 'th' ? 'แนะนำ' : 'Featured'}
                            </motion.span>
                        )}

                        {/* Hot Badge */}
                        {product.isHot && !product.isFeatured && (
                            <span className="px-2 py-1 bg-gradient-to-r from-red-500 to-orange-500 text-white text-[10px] font-bold rounded-lg shadow-lg flex items-center gap-1 animate-pulse">
                                <Flame className="w-3 h-3 fill-current" />
                                HOT
                            </span>
                        )}

                        {/* New Badge */}
                        {isNew && !product.isHot && !product.isFeatured && (
                            <span className="px-2 py-1 bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-[10px] font-bold rounded-lg shadow-lg">
                                NEW
                            </span>
                        )}

                        {/* Discount Badge */}
                        {hasDiscount && discountPercent >= 10 && (
                            <span className="px-2 py-1 bg-red-500 text-white text-[10px] font-bold rounded-lg shadow-lg">
                                -{discountPercent}%
                            </span>
                        )}

                        {/* AI Price Insight Badge */}
                        {showAIInsights && product.ai?.priceInsight === 'below_market' && (
                            <span className="px-2 py-1 bg-emerald-500 text-white text-[10px] font-bold rounded-lg shadow-lg flex items-center gap-1">
                                <TrendingDown className="w-3 h-3" />
                                {language === 'th' ? 'ราคาดี' : 'Good Deal'}
                            </span>
                        )}
                    </div>

                    {/* TOP RIGHT - QUICK ACTIONS */}
                    <div className="absolute top-2 right-2 flex flex-col gap-1.5 z-20">
                        {/* Wishlist Button */}
                        <motion.button
                            onClick={handleLikeClick}
                            whileTap={{ scale: 0.9 }}
                            className={`
                                p-2 rounded-full backdrop-blur-md shadow-lg transition-all
                                ${isLiked
                                    ? 'bg-red-500 text-white'
                                    : 'bg-white/80 dark:bg-slate-800/80 text-gray-600 dark:text-gray-300 hover:bg-red-50 hover:text-red-500'
                                }
                            `}
                        >
                            <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
                        </motion.button>
                    </div>

                    {/* BOTTOM LEFT - Trust Badge */}
                    {product.seller?.trustScore && product.seller.trustScore >= 70 && (
                        <div className="absolute bottom-2 left-2 z-20">
                            <span className="px-2 py-1 bg-blue-500/90 backdrop-blur-sm text-white text-[10px] font-bold rounded-lg flex items-center gap-1">
                                <Shield className="w-3 h-3" />
                                {product.seller.trustScore}
                            </span>
                        </div>
                    )}

                    {/* BOTTOM LEFT - Location Distance */}
                    {product.location?.distance !== undefined && product.location.distance < 10 && (
                        <div className="absolute bottom-2 left-2 z-20">
                            <span className="px-2 py-1 bg-green-500/90 backdrop-blur-sm text-white text-[10px] font-bold rounded-lg flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                {product.location.distance.toFixed(1)} km
                            </span>
                        </div>
                    )}

                    {/* BOTTOM RIGHT - Views */}
                    {product.stats && product.stats.views > 0 && (
                        <div className="absolute bottom-2 right-2 z-20">
                            <span className="px-2 py-1 bg-black/50 backdrop-blur-sm text-white text-[10px] font-medium rounded-lg flex items-center gap-1">
                                <Eye className="w-3 h-3" />
                                {product.stats.views > 999 ? `${(product.stats.views / 1000).toFixed(1)}k` : product.stats.views}
                            </span>
                        </div>
                    )}

                    {/* HOVER QUICK ACTIONS */}
                    <AnimatePresence>
                        {isHovered && showQuickActions && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 20 }}
                                className="absolute inset-0 z-30 flex items-center justify-center gap-3 bg-black/20 backdrop-blur-[2px]"
                            >
                                <motion.button
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 0.05 }}
                                    onClick={handleChat}
                                    className="p-3 bg-white rounded-full shadow-xl hover:bg-purple-500 hover:text-white transition-colors"
                                >
                                    <MessageCircle className="w-5 h-5" />
                                </motion.button>

                                <motion.button
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 0.1 }}
                                    onClick={handleShare}
                                    className="p-3 bg-white rounded-full shadow-xl hover:bg-blue-500 hover:text-white transition-colors"
                                >
                                    <Share2 className="w-5 h-5" />
                                </motion.button>

                                <motion.button
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 0.15 }}
                                    className="p-3 bg-white rounded-full shadow-xl hover:bg-green-500 hover:text-white transition-colors"
                                >
                                    <ShoppingBag className="w-5 h-5" />
                                </motion.button>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Image Gallery Dots */}
                    {product.images && product.images.length > 1 && (
                        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-20 flex gap-1">
                            {product.images.slice(0, 5).map((_, idx) => (
                                <div
                                    key={idx}
                                    className={`w-1.5 h-1.5 rounded-full transition-all ${idx === currentImageIndex ? 'bg-white scale-125' : 'bg-white/50'
                                        }`}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* INFO ZONE */}
                <div className="p-3 flex flex-col flex-1 gap-2">
                    {/* Title */}
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white line-clamp-2 min-h-[40px] group-hover:text-purple-600 transition-colors">
                        {product.title}
                    </h3>

                    {/* Price */}
                    <div className="flex items-end flex-wrap gap-1.5">
                        <span className="text-lg font-bold text-purple-600 dark:text-purple-400">
                            ฿{product.price.toLocaleString()}
                        </span>
                        {hasDiscount && (
                            <span className="text-xs text-gray-400 line-through mb-0.5">
                                ฿{product.originalPrice?.toLocaleString()}
                            </span>
                        )}
                    </div>

                    {/* AI Price Insight */}
                    {showAIInsights && priceInsightText && product.ai?.priceInsight === 'below_market' && (
                        <div className="flex items-center gap-1 text-[10px] text-emerald-600 dark:text-emerald-400">
                            <Sparkles className="w-3 h-3" />
                            <span>{priceInsightText}</span>
                        </div>
                    )}

                    {/* Divider */}
                    <div className="h-px bg-gray-100 dark:bg-slate-700 my-1" />

                    {/* Location */}
                    {product.location && (
                        <div className="flex items-center gap-1 text-[10px] text-gray-500 dark:text-gray-400">
                            <MapPin className="w-3 h-3 flex-shrink-0" />
                            <span className="truncate">
                                {product.location.amphoe
                                    ? `${product.location.amphoe}, ${product.location.province}`
                                    : product.location.province
                                }
                            </span>
                        </div>
                    )}

                    {/* Seller Info */}
                    {showSellerInfo && product.seller && (
                        <div className="flex items-center gap-2 mt-auto pt-2">
                            {/* Avatar */}
                            <div className="relative">
                                <div className="w-6 h-6 rounded-full overflow-hidden bg-gradient-to-br from-purple-400 to-pink-400">
                                    {product.seller.avatar ? (
                                        <Image
                                            src={product.seller.avatar}
                                            alt={product.seller.name}
                                            width={24}
                                            height={24}
                                            className="object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-white text-[10px] font-bold">
                                            {product.seller.name.charAt(0).toUpperCase()}
                                        </div>
                                    )}
                                </div>

                                {/* Online Indicator */}
                                {sellerStatus && (
                                    <div className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 ${sellerStatus.color} rounded-full border-2 border-white dark:border-slate-800`} />
                                )}
                            </div>

                            {/* Name & Badge */}
                            <div className="flex items-center gap-1 flex-1 min-w-0">
                                <span className="text-[10px] font-medium text-gray-700 dark:text-gray-300 truncate">
                                    {product.seller.name}
                                </span>
                                {product.seller.isVerified && (
                                    <BadgeCheck className="w-3 h-3 text-blue-500 flex-shrink-0" />
                                )}
                            </div>

                            {/* Response Time */}
                            {product.seller.responseTime && (
                                <span className="text-[9px] text-gray-400 flex items-center gap-0.5">
                                    <Zap className="w-2.5 h-2.5 text-amber-500" />
                                    {product.seller.responseTime}
                                </span>
                            )}
                        </div>
                    )}

                    {/* Bottom Stats */}
                    <div className="flex items-center justify-between pt-2 border-t border-gray-50 dark:border-slate-700/50 text-[10px] text-gray-400">
                        <div className="flex items-center gap-3">
                            {product.stats && (
                                <>
                                    <span className="flex items-center gap-1">
                                        <Eye className="w-3 h-3" />
                                        {product.stats.views}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Heart className="w-3 h-3" />
                                        {product.stats.favorites}
                                    </span>
                                </>
                            )}
                        </div>

                        <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {timeAgo}
                        </span>
                    </div>

                    {/* AI Quality Score Bar (for high-quality listings) */}
                    {showAIInsights && product.ai?.qualityScore && product.ai.qualityScore >= 80 && (
                        <div className="flex items-center gap-2 pt-1">
                            <div className="flex-1 h-1 bg-gray-100 dark:bg-slate-700 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${product.ai.qualityScore}%` }}
                                    transition={{ duration: 0.5, delay: 0.2 }}
                                    className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                                />
                            </div>
                            <span className="text-[9px] font-bold text-purple-600 dark:text-purple-400">
                                AI {product.ai.qualityScore}
                            </span>
                        </div>
                    )}
                </div>

                {/* Listing Source Indicator */}
                {product.source === 'listing' && (
                    <div className="absolute top-0 right-0 w-0 h-0 border-l-[20px] border-l-transparent border-t-[20px] border-t-purple-500 z-10">
                        <Sparkles className="absolute -top-[17px] -left-[3px] w-2.5 h-2.5 text-white" />
                    </div>
                )}
            </motion.div>
        </Link>
    )
}

// ==========================================
// CONVERTER FUNCTION
// ==========================================

/**
 * Convert legacy Product/UnifiedProduct to SmartProductData
 */
export function toSmartProductData(product: any): SmartProductData {
    // Handle image URL
    let thumbnailUrl = '/placeholder.svg'
    if (product.thumbnailUrl) {
        thumbnailUrl = product.thumbnailUrl
    } else if (product.thumbnail_url) {
        thumbnailUrl = product.thumbnail_url
    } else if (product.images && product.images.length > 0) {
        const firstImage = product.images[0]
        thumbnailUrl = typeof firstImage === 'string' ? firstImage : firstImage?.url || '/placeholder.svg'
    }

    // Parse dates
    let createdAt = new Date()
    if (product.createdAt) {
        createdAt = product.createdAt instanceof Date ? product.createdAt : new Date(product.createdAt)
    } else if (product.created_at) {
        createdAt = new Date(product.created_at)
    }

    return {
        id: product.id,
        slug: product.slug,
        title: product.title,
        price: typeof product.price === 'string' ? parseFloat(product.price) : product.price,
        originalPrice: product.originalPrice || product.original_price,
        thumbnailUrl,
        images: product.images?.map((img: any) => typeof img === 'string' ? img : img?.url),
        condition: product.condition,
        location: {
            province: toThaiProvince(product.province || product.location_province),
            amphoe: toThaiAmphoe(product.amphoe || product.location_amphoe),
            // _calculatedDistance comes from getNearMeProducts
            distance: product.distance || product._calculatedDistance
        },
        seller: {
            id: product.sellerId || product.seller_id || '',
            name: product.sellerName || product.seller_name || product.seller?.shop_name || 'ผู้ขาย',
            avatar: product.sellerAvatar || product.seller?.avatar,
            isVerified: product.sellerVerified || product.seller?.verification_status === 'verified',
            trustScore: product.seller?.trust_score || 50,
            responseTime: product.seller?.response_time,
            isOnline: product.seller?.is_online,
            lastActive: product.seller?.last_active ? new Date(product.seller.last_active) : undefined
        },
        stats: {
            views: product.views || product.views_count || 0,
            favorites: product.favorites || product.favorites_count || 0,
            inquiries: product.inquiries || 0
        },
        ai: {
            score: product.aiScore || product.ai_image_score,
            priceInsight: product.ai_price_insight,
            pricePercentage: product.ai_price_percentage,
            qualityScore: product.ai_quality_score || product.aiScore
        },
        source: product.source || 'product',
        listingCode: product.listingCode || product.listing_code,
        createdAt,
        isHot: product.isHot || product.is_trending || (product.views_count || 0) > 500,
        isFeatured: product.isFeatured || product.is_featured
    }
}
