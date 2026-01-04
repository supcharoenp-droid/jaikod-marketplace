/**
 * SPONSORED PRODUCT CARD
 * Product card with promotion tracking
 */

'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Heart, Eye, MapPin } from 'lucide-react'
import PromotionBadge, { PromotionType } from './PromotionBadge'

// ==========================================
// TYPES
// ==========================================

export interface PromotionCampaign {
    id: string
    type: PromotionType
    priority: number
    boost_multiplier?: number
    budget?: number
    spent?: number
}

export interface SponsoredProductCardProps {
    product: {
        id: string
        title: string
        price: number
        images: string[]
        location?: {
            province: string
            amphoe?: string
        }
        seller_id: string
        views?: number
        favorites?: number
        rating?: number
    }
    campaign: PromotionCampaign
    onImpression?: (productId: string, campaignId: string) => void
    onClick?: (productId: string, campaignId: string) => void
    onFavorite?: (productId: string) => void
    className?: string
}

// ==========================================
// COMPONENT
// ==========================================

export default function SponsoredProductCard({
    product,
    campaign,
    onImpression,
    onClick,
    onFavorite,
    className = ''
}: SponsoredProductCardProps) {
    const cardRef = useRef<HTMLDivElement>(null)
    const [isVisible, setIsVisible] = useState(false)
    const [impressionTracked, setImpressionTracked] = useState(false)
    const [isFavorited, setIsFavorited] = useState(false)

    // Intersection Observer for impression tracking
    useEffect(() => {
        if (!cardRef.current || impressionTracked) return

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting && !impressionTracked) {
                        setIsVisible(true)

                        // Track impression after 1 second of visibility
                        setTimeout(() => {
                            if (entry.isIntersecting) {
                                onImpression?.(product.id, campaign.id)
                                setImpressionTracked(true)

                                // Send to analytics
                                trackPromotionImpression({
                                    product_id: product.id,
                                    campaign_id: campaign.id,
                                    campaign_type: campaign.type,
                                    timestamp: Date.now()
                                })
                            }
                        }, 1000)
                    }
                })
            },
            { threshold: 0.5 } // 50% visible
        )

        observer.observe(cardRef.current)

        return () => observer.disconnect()
    }, [product.id, campaign.id, campaign.type, impressionTracked, onImpression])

    // Handle click
    const handleClick = () => {
        onClick?.(product.id, campaign.id)

        // Track click
        trackPromotionClick({
            product_id: product.id,
            campaign_id: campaign.id,
            campaign_type: campaign.type,
            timestamp: Date.now()
        })
    }

    // Handle favorite
    const handleFavorite = (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setIsFavorited(!isFavorited)
        onFavorite?.(product.id)
    }

    // Format price
    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('th-TH').format(price)
    }

    return (
        <div
            ref={cardRef}
            className={`
        group relative
        bg-white dark:bg-gray-800
        rounded-2xl
        border border-gray-200 dark:border-gray-700
        hover:border-purple-300 dark:hover:border-purple-600
        hover:shadow-lg
        transition-all duration-300
        overflow-hidden
        ${className}
      `}
        >
            {/* Promotion Badge */}
            <div className="absolute top-2 left-2 z-10">
                <PromotionBadge
                    type={campaign.type}
                    size="sm"
                    showInfo={true}
                />
            </div>

            {/* Favorite Button */}
            <button
                onClick={handleFavorite}
                className="absolute top-2 right-2 z-10 w-8 h-8 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-lg"
            >
                <Heart
                    className={`w-4 h-4 ${isFavorited ? 'fill-red-500 text-red-500' : 'text-gray-600'}`}
                />
            </button>

            {/* Product Link */}
            <Link
                href={`/listing/${product.id}`}
                onClick={handleClick}
                className="block"
            >
                {/* Image */}
                <div className="relative aspect-square overflow-hidden bg-gray-100 dark:bg-gray-700">
                    <Image
                        src={product.images[0] || '/placeholder.png'}
                        alt={product.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    />

                    {/* Overlay on hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>

                {/* Content */}
                <div className="p-4">
                    {/* Title */}
                    <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-2 mb-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                        {product.title}
                    </h3>

                    {/* Price */}
                    <div className="flex items-baseline gap-2 mb-3">
                        <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                            ฿{formatPrice(product.price)}
                        </span>
                    </div>

                    {/* Location */}
                    {product.location && (
                        <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 mb-2">
                            <MapPin className="w-3 h-3" />
                            <span className="truncate">
                                {product.location.province}
                                {product.location.amphoe && `, ${product.location.amphoe}`}
                            </span>
                        </div>
                    )}

                    {/* Stats */}
                    <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                        {product.views !== undefined && (
                            <div className="flex items-center gap-1">
                                <Eye className="w-3 h-3" />
                                <span>{formatNumber(product.views)}</span>
                            </div>
                        )}
                        {product.favorites !== undefined && (
                            <div className="flex items-center gap-1">
                                <Heart className="w-3 h-3" />
                                <span>{formatNumber(product.favorites)}</span>
                            </div>
                        )}
                        {product.rating !== undefined && (
                            <div className="flex items-center gap-1">
                                <span>⭐</span>
                                <span>{product.rating.toFixed(1)}</span>
                            </div>
                        )}
                    </div>

                    {/* Sponsored Disclosure (Bottom) */}
                    <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                        <p className="text-[10px] text-gray-400 dark:text-gray-500">
                            {campaign.type === 'sponsored' && '📢 เนื้อหาที่ได้รับการสนับสนุน'}
                            {campaign.type === 'premium' && '💎 พรีเมียมจาก JaiKod'}
                            {campaign.type === 'promoted' && '⭐ แนะนำจากผู้ขาย'}
                        </p>
                    </div>
                </div>
            </Link>

            {/* Campaign Priority Indicator (Dev only) */}
            {process.env.NODE_ENV === 'development' && (
                <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/70 text-white text-[10px] rounded">
                    P:{campaign.priority}
                </div>
            )}
        </div>
    )
}

// ==========================================
// HELPER FUNCTIONS
// ==========================================

function formatNumber(num: number): string {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return num.toString()
}

// ==========================================
// ANALYTICS TRACKING
// ==========================================

interface PromotionEvent {
    product_id: string
    campaign_id: string
    campaign_type: string
    timestamp: number
}

async function trackPromotionImpression(event: PromotionEvent) {
    try {
        // Send to backend
        await fetch('/api/analytics/promotion/impression', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(event)
        })

        // Also log to console in dev
        if (process.env.NODE_ENV === 'development') {
            console.log('📊 Promotion Impression:', event)
        }
    } catch (error) {
        console.error('Failed to track impression:', error)
    }
}

async function trackPromotionClick(event: PromotionEvent) {
    try {
        await fetch('/api/analytics/promotion/click', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(event)
        })

        if (process.env.NODE_ENV === 'development') {
            console.log('👆 Promotion Click:', event)
        }
    } catch (error) {
        console.error('Failed to track click:', error)
    }
}
