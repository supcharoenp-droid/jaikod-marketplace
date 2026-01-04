'use client'

/**
 * NewArrivals V2 - Using SmartProductCardV3 for Consistent Design
 * 
 * Features:
 * - Uses SmartProductCardV3 for premium display
 * - Combines listings + products via unifiedMarketplace
 * - Modern slider layout
 * - Real-time distance calculation
 */

import { useState, useEffect } from 'react'
import { Sparkles, Clock, ArrowRight, Package } from 'lucide-react'
import Link from 'next/link'
import ProductSectionV2 from '@/components/home/ProductSectionV2'
import SmartProductCardV3 from '@/components/product/SmartProductCardV3'
import { toSmartProductData, SmartProductData } from '@/components/product/SmartProductCardV2'
import { getUnifiedNewArrivals, UnifiedProduct } from '@/services/unifiedMarketplace'
import { useLanguage } from '@/contexts/LanguageContext'
import { toThaiProvince, toThaiAmphoe } from '@/lib/location-localization'
import { getUserLocation, calculateDistance, PROVINCE_COORDINATES } from '@/lib/utils/distanceCalculator'

interface NewArrivalsProps {
    title?: string
    subtitle?: string
    showViewAll?: boolean
    maxItems?: number
}

export default function NewArrivals({
    title,
    subtitle,
    showViewAll = true,
    maxItems = 12
}: NewArrivalsProps) {
    const { t, language } = useLanguage()
    const [products, setProducts] = useState<SmartProductData[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        async function fetchNewProducts() {
            try {
                setLoading(true)

                // Get user location first (for distance calculation)
                const userLocation = await getUserLocation()

                const allProducts = await getUnifiedNewArrivals(maxItems)

                // Convert to SmartProductData with distance calculation
                const smartProducts = allProducts.map((p: UnifiedProduct) => {
                    // Calculate distance
                    let distance: number | undefined = undefined
                    if (userLocation && p.province) {
                        const productCoords = PROVINCE_COORDINATES[p.province]
                        if (productCoords) {
                            distance = calculateDistance(
                                userLocation.lat,
                                userLocation.lng,
                                productCoords.lat,
                                productCoords.lng
                            )
                        }
                    }

                    // Handle the unified product structure
                    return {
                        id: p.id,
                        slug: p.slug,
                        title: p.title,
                        price: p.price,
                        originalPrice: p.originalPrice,
                        thumbnailUrl: p.thumbnailUrl || '/placeholder.svg',
                        images: Array.isArray(p.images)
                            ? p.images.map((img: any) => typeof img === 'string' ? img : img?.url || '')
                            : [],
                        condition: p.condition as SmartProductData['condition'],
                        location: {
                            province: toThaiProvince(p.province),
                            amphoe: toThaiAmphoe(p.amphoe),
                            distance: distance
                        },
                        seller: {
                            id: p.sellerId || '',
                            name: p.sellerName || 'ผู้ขาย',
                            avatar: p.sellerAvatar,
                            isVerified: p.sellerVerified,
                            trustScore: 50,
                            responseTime: undefined,
                            isOnline: false,
                            lastActive: undefined
                        },
                        stats: {
                            views: p.views || 0,
                            favorites: 0,
                            inquiries: 0
                        },
                        ai: {
                            score: p.aiScore,
                            priceInsight: undefined,
                            pricePercentage: undefined,
                            qualityScore: p.aiScore
                        },
                        source: p.source as 'listing' | 'product',
                        listingCode: p.listingCode,
                        createdAt: p.createdAt instanceof Date ? p.createdAt : new Date(p.createdAt),
                        isHot: false,
                        isFeatured: false
                    } as SmartProductData
                })

                console.log('📦 Unified New Arrivals:', smartProducts.length, 'items with distance')
                setProducts(smartProducts)
                setError(null)
            } catch (err) {
                console.error('Error fetching new arrivals:', err)
                setError(language === 'th' ? 'ไม่สามารถโหลดสินค้าใหม่ได้' : 'Could not load new arrivals')
            } finally {
                setLoading(false)
            }
        }

        fetchNewProducts()
    }, [maxItems, language])


    // Loading state
    if (loading) {
        return (
            <section className="py-8">
                <div className="container mx-auto px-4">
                    {/* Header Skeleton */}
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 rounded-xl bg-gray-200 dark:bg-gray-700 animate-pulse" />
                        <div>
                            <div className="h-6 w-40 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2" />
                            <div className="h-4 w-60 bg-gray-100 dark:bg-gray-800 rounded animate-pulse" />
                        </div>
                    </div>

                    {/* Cards Skeleton */}
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="animate-pulse">
                                <div className="aspect-square bg-gray-200 dark:bg-gray-700 rounded-2xl mb-3" />
                                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2" />
                                <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        )
    }

    // Error state
    if (error) {
        return (
            <section className="py-8">
                <div className="container mx-auto px-4">
                    <div className="text-center py-12 bg-red-50 dark:bg-red-900/20 rounded-2xl">
                        <p className="text-red-500 mb-4">{error}</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="text-sm text-purple-600 hover:underline"
                        >
                            {language === 'th' ? 'ลองใหม่' : 'Try Again'}
                        </button>
                    </div>
                </div>
            </section>
        )
    }

    // Empty state
    if (products.length === 0) {
        return (
            <section className="py-8">
                <div className="container mx-auto px-4">
                    <div className="text-center py-16 bg-gradient-to-br from-pink-50 to-rose-50 dark:from-pink-900/10 dark:to-rose-900/10 rounded-2xl">
                        <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-pink-100 to-rose-100 dark:from-pink-900/30 dark:to-rose-900/30 rounded-2xl flex items-center justify-center">
                            <Package className="w-10 h-10 text-pink-500" />
                        </div>
                        <h3 className="text-lg font-bold mb-2 text-gray-900 dark:text-gray-100">
                            {language === 'th' ? 'ยังไม่มีสินค้าใหม่' : 'No new products yet'}
                        </h3>
                        <p className="text-gray-500 mb-6">
                            {language === 'th' ? 'เป็นคนแรกที่ลงขายสินค้า!' : 'Be the first to list!'}
                        </p>
                        <Link
                            href="/sell"
                            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-xl font-bold hover:shadow-lg transition-all"
                        >
                            <Sparkles className="w-4 h-4 mr-2" />
                            {language === 'th' ? 'ลงขายสินค้า' : 'List Your Item'}
                        </Link>
                    </div>
                </div>
            </section>
        )
    }

    // Main content
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
                            <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white animate-pulse" />
                        </div>
                        <div>
                            <h2 className="text-xl md:text-2xl font-display font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                {title || (language === 'th' ? '✨ สินค้าใหม่' : '✨ New Arrivals')}
                                <span className="text-xs bg-gradient-to-r from-pink-500 to-rose-500 text-white px-2 py-0.5 rounded-full font-medium">
                                    NEW
                                </span>
                            </h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {subtitle || (language === 'th' ? 'ลงใหม่ภายใน 24 ชั่วโมง' : 'Listed in the past 24 hours')}
                            </p>
                        </div>
                    </div>

                    {showViewAll && (
                        <Link
                            href="/search?sort=newest"
                            className="hidden md:flex items-center text-sm font-medium text-purple-600 hover:text-purple-700 transition-colors group"
                        >
                            {language === 'th' ? 'ดูทั้งหมด' : 'View All'}
                            <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    )}
                </div>

                {/* Products Grid using SmartProductCardV3 */}
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4">
                    {products.map((product) => (
                        <SmartProductCardV3
                            key={product.id}
                            product={product}
                            showAIInsights={true}
                            showSellerInfo={true}
                        />
                    ))}
                </div>

                {/* Mobile View All */}
                {showViewAll && (
                    <div className="mt-6 text-center md:hidden">
                        <Link
                            href="/search?sort=newest"
                            className="inline-flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-purple-600 bg-purple-50 dark:bg-purple-900/20 rounded-xl hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors"
                        >
                            {language === 'th' ? 'ดูสินค้าใหม่ทั้งหมด' : 'View All New Arrivals'}
                            <ArrowRight className="w-4 h-4 ml-1" />
                        </Link>
                    </div>
                )}
            </div>
        </section>
    )
}
