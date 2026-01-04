'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { MapPin, Heart, Eye, MoreVertical, Star, BadgeCheck, Flame, Sparkles, TrendingDown, Shield, Hammer, Clock, ShoppingBag } from 'lucide-react'
import { Product } from '@/types'
import { ProductWithId } from '@/types/product'
import { calculateDistanceToProduct, formatDistance } from '@/lib/geolocation'
import { trackInteraction, trackFavorite } from '@/services/behaviorTracking'
import { useLanguage } from '@/contexts/LanguageContext'
import { useWishlist } from '@/hooks/useWishlist'
import ActivityBadge from '@/components/common/ActivityBadge'

interface ProductCardProps {
    product: Product | ProductWithId
    showDistance?: boolean
    isAiRecommended?: boolean
}

export default function ProductCard({ product, showDistance = true, isAiRecommended }: ProductCardProps) {
    const { t } = useLanguage()
    const { isInWishlist, toggleWishlist } = useWishlist()
    const [distance, setDistance] = useState<number | null>(null)
    const isLiked = isInWishlist(product.id)
    const [imageLoaded, setImageLoaded] = useState(false)

    useEffect(() => {
        if (showDistance && product.location_province) {
            calculateDistanceToProduct(product.location_province).then(setDistance)
        }
    }, [product.location_province, showDistance])

    // --- Image Error Handling ---
    // Initialize with valid thumbnail or valid fallback immediately
    const firstImage = product.images?.[0]
    const initialThumbnail = (typeof firstImage === 'string' ? firstImage : firstImage?.url)
        || product.thumbnail_url
        || '/placeholder.svg'

    const [imgSrc, setImgSrc] = useState(initialThumbnail)
    useEffect(() => {
        setImgSrc(initialThumbnail)
    }, [initialThumbnail])

    // Safety check for array existence
    const imageCount = product.images?.length || 0

    // Price Logic
    const price = typeof product.price === 'string' ? parseFloat(product.price) : product.price
    const originalPrice = product.original_price ? (typeof product.original_price === 'string' ? parseFloat(product.original_price) : product.original_price) : null
    const isSale = originalPrice && originalPrice > price
    const discountPercent = isSale && originalPrice ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0

    // Date Logic
    const createdAt = product.created_at ? new Date(product.created_at as string | Date) : new Date()
    const isNew = (Date.now() - createdAt.getTime()) < (3 * 24 * 60 * 60 * 1000) // 3 days

    // AI & Stats Logic
    const catId = typeof product.category_id === 'string' ? Number(product.category_id) : product.category_id
    const views = product.views_count || 0
    const likes = product.favorites_count || 0
    const isHot = (views > 500) || product.is_trending
    const isNear = distance !== null && distance < 10 // < 10km considered near for general indicator, <3km for specific badge
    const isGoodPrice = isSale && discountPercent > 15 // Mock logic for "Good Deal"

    // Seller Logic
    const seller = (product as any).seller
    const sellerName = product.seller_name || seller?.shop_name || t('product_card.unknown_seller')
    const sellerRating = seller?.rating_score || (product as any).rating_score || 4.8
    const sellerFollowers = seller?.follower_count || 120
    const isVerifiedSeller = seller?.verification_status === 'verified' || (product as any).is_verified_seller

    // Location Text
    const locationText = product.location_amphoe
        ? `${product.location_amphoe}, ${product.location_province}`
        : product.location_province || t('product_card.no_location')

    // Handlers
    const handleProductClick = () => {
        trackInteraction(product.id, 'click', {
            categoryId: catId,
            price: price,
            location: product.location_province
        })
    }

    const handleLikeClick = async (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()

        // Optimistic UI update or just wait for toggle
        // Since we use context, it should update fast enough locally

        const newState = !isLiked
        // setIsLiked(newState) // No longer needed

        await toggleWishlist(product as Product)
        trackFavorite(product.id, newState)
    }

    const handleOptionClick = (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        // Open menu logic here
        console.log('Options clicked')
    }

    return (
        <Link
            href={`/product/${product.slug || product.id}`}
            onClick={handleProductClick}
            className="block h-full"
        >
            <div className="group relative flex flex-col h-full bg-white dark:bg-card-dark rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-gray-100 dark:border-gray-800">

                {/* 1. PRODUCT IMAGE ZONE */}
                <div className="relative aspect-[4/5] bg-gray-100 dark:bg-gray-800 overflow-hidden">

                    {/* Skeleton / Placeholder */}
                    {!imageLoaded && <div className="absolute inset-0 bg-gray-200 animate-pulse z-0" />}

                    <Image
                        src={imgSrc}
                        alt={product.title}
                        fill
                        className={`object-cover transition-transform duration-700 group-hover:scale-110 z-10 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                        onLoad={() => setImageLoaded(true)}
                        onError={() => {
                            setImgSrc('/placeholder.svg')
                            setImageLoaded(true) // Stop skeleton even if it's the placeholder
                        }}
                        sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                    />

                    {/* Gradient Overlay (Bottom) for better text contrast/dots */}
                    <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/50 to-transparent z-20 pointer-events-none" />

                    {/* Top Left Badges */}
                    <div className="absolute top-2 left-2 flex flex-col gap-1.5 z-30 items-start">
                        {/* AI DEAL SCORE MINI BADGE */}
                        {(product as any).ai_image_score > 70 && (
                            <div
                                className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg ring-2 ring-white/30"
                                title={`AI Score: ${(product as any).ai_image_score}/100`}
                            >
                                <span className="text-white text-[10px] font-bold leading-none">
                                    {Math.round((product as any).ai_image_score)}
                                </span>
                            </div>
                        )}

                        {/* AUCTION BADGE */}
                        {product.price_type === 'auction' && (
                            <span className="px-2 py-0.5 bg-purple-600 text-white text-[10px] font-bold rounded shadow-sm flex items-center gap-1 animate-pulse">
                                <Hammer className="w-3 h-3" /> {t('product_card.auction')}
                            </span>
                        )}

                        {/* AI Verified Good Price */}
                        {isGoodPrice && product.price_type !== 'auction' && (
                            <span className="px-2 py-0.5 bg-emerald-500 text-white text-[10px] font-bold rounded shadow-sm flex items-center gap-1">
                                <TrendingDown className="w-3 h-3" /> {t('product_card.good_price')}
                            </span>
                        )}
                        {/* Near Me Badge (< 3km) */}
                        {distance !== null && distance < 3 && (
                            <span className="px-2 py-0.5 bg-green-500/90 backdrop-blur-md text-white text-[10px] font-bold rounded shadow-sm flex items-center gap-1">
                                <MapPin className="w-3 h-3" /> {t('product_card.near_me')}
                            </span>
                        )}
                    </div>

                    {/* Top Right Badges */}
                    <div className="absolute top-2 right-2 flex flex-col gap-1.5 z-30 items-end">
                        {/* AUCTION TIME LEFT */}
                        {product.price_type === 'auction' && (
                            <span className="px-2 py-0.5 bg-black/70 backdrop-blur text-white text-[10px] font-bold rounded shadow-sm flex items-center gap-1 border border-white/20">
                                <Clock className="w-3 h-3" /> 23h 15m
                            </span>
                        )}

                        {isNew && !isHot && product.price_type !== 'auction' && (
                            <span className="px-2 py-0.5 bg-blue-500 text-white text-[10px] font-bold rounded shadow-sm">
                                {t('product_card.new')}
                            </span>
                        )}
                        {isHot && (
                            <span className="px-2 py-0.5 bg-gradient-to-r from-orange-500 to-red-500 text-white text-[10px] font-bold rounded shadow-sm flex items-center gap-1 animate-pulse">
                                <Flame className="w-3 h-3 fill-white" /> {t('product_card.hot')}
                            </span>
                        )}
                    </div>

                    {/* HOVER ACTION OVERLAY */}
                    <div className="absolute inset-0 bg-black/20 backdrop-blur-[1px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 flex items-center justify-center gap-3">
                        <button
                            onClick={(e) => { e.preventDefault(); /* Preview Logic */ }}
                            className="bg-white text-gray-700 p-2.5 rounded-full shadow-lg hover:bg-purple-600 hover:text-white hover:scale-110 transition-all transform translate-y-4 group-hover:translate-y-0 duration-300 delay-75"
                            title={t('common.view_all')}
                            aria-label={t('common.view_all')}
                        >
                            <Eye className="w-5 h-5" />
                        </button>
                        <button
                            onClick={handleLikeClick}
                            className={`bg-white p-2.5 rounded-full shadow-lg hover:scale-110 transition-all transform translate-y-4 group-hover:translate-y-0 duration-300 delay-100 ${isLiked ? 'text-red-500' : 'text-gray-700 hover:text-red-500'}`}
                            title={t('common.save')}
                            aria-label={t('common.save')}
                        >
                            <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                        </button>
                        <button
                            onClick={(e) => { e.preventDefault(); /* Add to Cart */ }}
                            className="bg-white text-gray-700 p-2.5 rounded-full shadow-lg hover:bg-green-600 hover:text-white hover:scale-110 transition-all transform translate-y-4 group-hover:translate-y-0 duration-300 delay-150"
                            title={t('header.cart')}
                            aria-label={t('header.cart')}
                        >
                            <ShoppingBag className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Corner Bottom Right Indicator (Gallery) */}
                    {imageCount > 1 && (
                        <div className="absolute bottom-3 right-3 flex gap-1 z-30 items-center">
                            {/* Dots */}
                            {[...Array(Math.min(3, imageCount))].map((_, i) => (
                                <div key={i} className={`w-1.5 h-1.5 rounded-full shadow-sm ${i === 0 ? 'bg-white scale-125' : 'bg-white/60'}`} />
                            ))}
                            {imageCount > 3 && <div className="w-1.5 h-1.5 rounded-full bg-white/40" />}
                        </div>
                    )}

                    {/* Enhanced Distance Badge - Bottom Left */}
                    {distance !== null && distance >= 3 && (
                        <div className="absolute bottom-3 left-3 z-30">
                            <span className={`px-2 py-1 rounded-lg text-[10px] font-bold shadow-lg backdrop-blur-sm flex items-center gap-1 ${distance < 10
                                ? 'bg-green-500/90 text-white'
                                : distance < 30
                                    ? 'bg-yellow-500/90 text-white'
                                    : 'bg-gray-800/90 text-white'
                                }`}>
                                <MapPin className="w-3 h-3" />
                                {formatDistance(distance)}
                            </span>
                        </div>
                    )}
                </div>

                {/* 2. INFO ZONE */}
                <div className="p-3 flex flex-col flex-1 gap-2">

                    {/* A) Product Name */}
                    <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 leading-tight line-clamp-2 min-h-[2.5em] group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                        {product.title}
                    </h3>

                    {/* B) Price Area */}
                    <div className="mt-auto">
                        {product.price_type === 'auction' ? (
                            // AUCTION PRICE STYLE
                            <div className="flex flex-col">
                                <span className="text-[10px] uppercase font-bold text-gray-500">{t('product_card.current_bid')}</span>
                                <div className="flex items-center gap-2">
                                    <i className="text-lg font-black font-display text-purple-600 dark:text-purple-400 not-italic">
                                        ฿{price.toLocaleString()}
                                    </i>
                                    <span className="bg-purple-100 text-purple-700 text-[9px] px-1.5 py-0.5 rounded font-bold">
                                        12 {t('product_card.bids')}
                                    </span>
                                </div>
                            </div>
                        ) : (
                            // NORMAL PRICE STYLE
                            <div className="flex items-end flex-wrap gap-1.5">
                                <i className="text-lg font-bold font-display text-indigo-600 dark:text-indigo-400 not-italic">
                                    ฿{price.toLocaleString()}
                                </i>
                                {isSale && (
                                    <span className="text-xs text-gray-400 line-through mb-1">
                                        ฿{originalPrice?.toLocaleString()}
                                    </span>
                                )}
                            </div>
                        )}

                        {/* AI Price Note */}
                        {isGoodPrice && product.price_type !== 'auction' && (
                            <div className="text-[10px] text-emerald-600 flex items-center gap-1 mt-0.5">
                                <Sparkles className="w-3 h-3" /> {t('product_card.market_price_lower')}
                            </div>
                        )}
                    </div>

                    {/* Divider */}
                    <div className="h-px bg-gray-100 dark:bg-gray-800 my-1" />

                    {/* C) Location Line (Amphoe, Province only - Distance shown on image) */}
                    <div className="flex items-center gap-1 text-[10px] text-gray-500 dark:text-gray-400 overflow-hidden">
                        <MapPin className="w-3 h-3 flex-shrink-0 text-gray-400" />
                        <span className="truncate">
                            {locationText}
                        </span>
                    </div>

                    {/* AI Scoring Indicator (Quality Score) */}
                    {(product as any).ai_image_score > 80 && (
                        <div className="mt-1 flex items-center gap-2" title={`AI Quality Score: ${(product as any).ai_image_score}/100`}>
                            <div className="h-1 flex-1 bg-gray-100 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-blue-400 to-purple-500"
                                    style={{ width: `${(product as any).ai_image_score}%` }}
                                />
                            </div>
                            <span className="text-[9px] text-purple-600 font-bold">{t('product_card.ai_recommended')}</span>
                        </div>
                    )}

                    {/* Activity Intelligence - Time + Activity */}
                    <div className="mt-2 pt-2 border-t border-gray-100 dark:border-gray-700">
                        <ActivityBadge
                            createdAt={product.created_at ? new Date(product.created_at) : new Date()}
                            updatedAt={(product as any).updated_at ? new Date((product as any).updated_at) : undefined}
                            viewsToday={(product as any).views_today}
                            wishlistCount={(product as any).wishlist_count}
                            categoryId={(product as any).category_id || 0}
                            variant="inline"
                        />
                    </div>
                </div>
            </div>
        </Link>
    )
}
