'use client'

import { useEffect, useState } from 'react'
import { History, Sparkles, Heart, TrendingUp, Search, MapPin, Zap, Flame, Tag } from 'lucide-react'
import Link from 'next/link'
import ProductSection from './ProductSection'
import { Product } from '@/types'
import {
    getRecentlyViewed,
    getBasedOnSearchHistory,
    getPersonalizedRecommendations,
    getBasedOnFavorites,
    getTrendingInInterests,
    getNearMeProducts,
    getHotDeals,
    getTopSearches,
    trackVisit
} from '@/services/behaviorTracking'
import { getTrendingProducts, getBestSellingProducts } from '@/lib/products'
import { useLanguage } from '@/contexts/LanguageContext'

export default function PersonalizedSections() {
    const { t } = useLanguage()
    // Dynamic Data
    const [recentlyViewed, setRecentlyViewed] = useState<Product[]>([])
    const [searchBasedData, setSearchBasedData] = useState<{ query: string; products: Product[] } | null>(null)
    const [recommendations, setRecommendations] = useState<Product[]>([])
    // const [favoriteBased, setFavoriteBased] = useState<Product[]>([])
    // const [trendingInterests, setTrendingInterests] = useState<Product[]>([])
    const [nearMeProducts, setNearMeProducts] = useState<Product[]>([])
    const [hotItems, setHotItems] = useState<Product[]>([])
    const [trendingNow, setTrendingNow] = useState<Product[]>([])
    const [topSearches, setTopSearches] = useState<string[]>([])

    const [isLoaded, setIsLoaded] = useState(false)

    useEffect(() => {
        const loadData = async () => {
            trackVisit()

            try {
                // Parallel fetching for performance
                // Refined for specific zones requested
                const [
                    recent,
                    searchBased,
                    recom,
                    nearMe,
                    hot,
                    trend,
                    searches
                ] = await Promise.all([
                    getRecentlyViewed(10),
                    getBasedOnSearchHistory(8),
                    getPersonalizedRecommendations(20),
                    getNearMeProducts(10),
                    getBestSellingProducts(12), // Use best selling or most engaged for 'Hot Items'
                    getTrendingProducts(10),   // Use trending logic for 'Trending Now'
                    getTopSearches(5)
                ])

                setRecentlyViewed(recent)
                setSearchBasedData(searchBased)
                setRecommendations(recom)
                setNearMeProducts(nearMe)
                setHotItems(hot)
                setTrendingNow(trend)
                setTopSearches(searches)
            } catch (error) {
                console.error('Error loading personalized data:', error)
            } finally {
                setIsLoaded(true)
            }
        }

        loadData()
    }, [])

    if (!isLoaded) return <div className="h-96 flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div></div>

    // Layout Structure based on User Request
    // 1. Trending Now (Carousal)
    // 2. HOT Items (Grid)
    // 3. Near You (Grid or Slider with Button)

    return (
        <div className="space-y-12 pb-12">

            {/* Zone 1: 🔥 Trending Now (กำลังเป็นกระแสวันนี้) */}
            {trendingNow.length > 0 && (
                <ProductSection
                    title={t('home.trending_today')}
                    subtitle={t('home.trending_today_desc')}
                    products={trendingNow}
                    layout="slider"
                />
            )}

            {/* Zone 2: HOT Items (สินค้ายอดนิยม) - Grid 4 cols */}
            {hotItems.length > 0 && (
                <div className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/10 dark:to-red-900/10 py-8 rounded-3xl mx-[-1rem] px-4 md:mx-0">
                    <ProductSection
                        title={t('home.hot_items')}
                        subtitle={t('home.hot_items_desc')}
                        icon={<Flame className="w-6 h-6 text-red-500 animate-pulse" />}
                        products={hotItems}
                        layout="grid"
                    />
                </div>
            )}

            {/* Zone 3: Near You (ของใกล้บ้านคุณ) */}
            {nearMeProducts.length > 0 ? (
                <ProductSection
                    title={t('home.near_you')}
                    subtitle={t('home.near_you_desc')}
                    icon={<MapPin className="w-6 h-6 text-green-500" />}
                    products={nearMeProducts}
                    layout="slider"
                    actionButton={
                        <Link href="/search?sort=nearest" className="hidden md:inline-flex items-center px-4 py-2 bg-green-500 hover:bg-green-600 text-white text-sm font-medium rounded-full transition-colors shadow-md hover:shadow-lg gap-2">
                            <MapPin className="w-4 h-4" />
                            {t('home.near_you_btn')}
                        </Link>
                    }
                />
            ) : (
                // Fallback for Near You if location not sharing or no items
                <div className="text-center py-8 bg-gray-50 dark:bg-surface-dark rounded-2xl border border-dashed border-gray-200 dark:border-gray-700">
                    <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">{t('home.near_you_fallback_title')}</h3>
                    <p className="text-gray-500 mb-4 max-w-md mx-auto">{t('home.near_you_fallback_desc')}</p>
                    <Link href="/search?sort=nearest" className="inline-flex items-center px-6 py-2 bg-purple-600 text-white rounded-full font-medium hover:bg-purple-700 transition shadow-lg">
                        {t('home.near_you_fallback_btn')}
                    </Link>
                </div>
            )}

            {/* 4. Personalized (AI For You) - High priority fallback */}
            {recommendations.length > 0 && (
                <div className="border-t border-gray-100 dark:border-gray-800 pt-8">
                    <ProductSection
                        title={t('home.ai_for_you_title')}
                        subtitle={t('home.ai_for_you_desc')}
                        products={recommendations}
                        layout="grid"
                        viewAllLink="/search"
                    />
                </div>
            )}

            {/* 5. Contextual History (Recently Viewed) */}
            {recentlyViewed.length > 0 && (
                <ProductSection
                    title={t('home.recently_viewed')}
                    icon={<History className="w-5 h-5 text-gray-400" />}
                    products={recentlyViewed}
                    layout="slider"
                />
            )}
        </div>
    )
}
