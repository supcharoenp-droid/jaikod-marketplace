'use client'

/**
 * PersonalizedSections V2 - Using SmartProductCardV3 for Consistency
 * 
 * Sections:
 * 1. 🔥 Trending Now (Slider)
 * 2. 🏆 Hot Items / Best Sellers (Grid)
 * 3. 📍 Near You (Slider)
 * 4. ✨ AI Recommendations (Grid)
 * 5. 👁️ Recently Viewed (Slider)
 */

import { useEffect, useState } from 'react'
import { History, Sparkles, MapPin, Flame, TrendingUp, Package } from 'lucide-react'
import Link from 'next/link'
import ProductSectionV2 from './ProductSectionV2'
import { SmartProductData, toSmartProductData } from '@/components/product/SmartProductCardV2'
import { Product } from '@/types'
import {
    getRecentlyViewed,
    getPersonalizedRecommendations,
    getNearMeProducts,
    trackVisit
} from '@/services/behaviorTracking'
import { getTrendingProducts, getBestSellingProducts } from '@/lib/products'
import { useLanguage } from '@/contexts/LanguageContext'

export default function PersonalizedSections() {
    const { t, language } = useLanguage()

    // Data states
    const [recentlyViewed, setRecentlyViewed] = useState<Product[]>([])
    const [recommendations, setRecommendations] = useState<Product[]>([])
    const [nearMeProducts, setNearMeProducts] = useState<Product[]>([])
    const [hotItems, setHotItems] = useState<Product[]>([])
    const [trendingNow, setTrendingNow] = useState<Product[]>([])
    const [isLoaded, setIsLoaded] = useState(false)

    useEffect(() => {
        const loadData = async () => {
            trackVisit()

            try {
                const [
                    recent,
                    recom,
                    nearMe,
                    hot,
                    trend
                ] = await Promise.all([
                    getRecentlyViewed(10),
                    getPersonalizedRecommendations(12),
                    getNearMeProducts(10),
                    getBestSellingProducts(10),
                    getTrendingProducts(10)
                ])

                setRecentlyViewed(recent)
                setRecommendations(recom)
                setNearMeProducts(nearMe)
                setHotItems(hot)
                setTrendingNow(trend)
            } catch (error) {
                console.error('Error loading personalized data:', error)
            } finally {
                setIsLoaded(true)
            }
        }

        loadData()
    }, [])

    // Loading state
    if (!isLoaded) {
        return (
            <div className="py-16 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-600 mx-auto mb-4" />
                    <p className="text-gray-500">{language === 'th' ? 'กำลังโหลด...' : 'Loading...'}</p>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-8">

            {/* Zone 1: 🔥 Trending Now */}
            {trendingNow.length > 0 && (
                <ProductSectionV2
                    title={language === 'th' ? '🔥 กำลังเทรนด์วันนี้' : '🔥 Trending Today'}
                    subtitle={language === 'th' ? 'สิ่งที่คนสนใจมากที่สุดตอนนี้' : 'Most popular right now'}
                    icon={<TrendingUp className="w-5 h-5" />}
                    products={trendingNow}
                    viewAllLink="/search?sort=trending"
                    layout="slider"
                    showAIInsights={true}
                />
            )}

            {/* Zone 2: 🏆 Hot Items / Best Sellers */}
            {hotItems.length > 0 && (
                <div className="bg-gradient-to-br from-orange-50 via-amber-50 to-red-50 dark:from-orange-900/10 dark:via-amber-900/10 dark:to-red-900/10 py-8 rounded-3xl mx-[-1rem] md:mx-0 px-4">
                    <ProductSectionV2
                        title={language === 'th' ? '🏆 สินค้ายอดนิยม' : '🏆 Best Sellers'}
                        subtitle={language === 'th' ? 'สินค้าขายดีประจำสัปดาห์' : "This week's top sellers"}
                        icon={<Flame className="w-5 h-5" />}
                        products={hotItems}
                        viewAllLink="/search?sort=best_seller"
                        layout="grid"
                        maxItems={10}
                        showAIInsights={true}
                    />
                </div>
            )}

            {/* Zone 3: 📍 Near You */}
            {nearMeProducts.length > 0 ? (
                <ProductSectionV2
                    title={language === 'th' ? '📍 ของใกล้บ้านคุณ' : '📍 Near You'}
                    subtitle={language === 'th' ? 'สินค้าใกล้ตำแหน่งที่อยู่ปัจจุบัน' : 'Products near your current location'}
                    icon={<MapPin className="w-5 h-5" />}
                    products={nearMeProducts}
                    viewAllLink="/search?sort=nearest"
                    layout="slider"
                    showAIInsights={true}
                    actionButton={
                        <Link
                            href="/search?sort=nearest"
                            className="hidden md:inline-flex items-center px-4 py-2 bg-green-500 hover:bg-green-600 text-white text-sm font-medium rounded-full transition-colors shadow-md hover:shadow-lg gap-2"
                        >
                            <MapPin className="w-4 h-4" />
                            {language === 'th' ? 'ค้นหาใกล้ฉัน' : 'Search Near Me'}
                        </Link>
                    }
                />
            ) : (
                // Fallback for Near You
                <div className="text-center py-12 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/10 dark:to-emerald-900/10 rounded-2xl border border-dashed border-green-200 dark:border-green-800">
                    <MapPin className="w-12 h-12 text-green-300 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">
                        {language === 'th' ? 'ค้นพบสินค้าใกล้คุณ' : 'Discover Items Near You'}
                    </h3>
                    <p className="text-gray-500 mb-4 max-w-md mx-auto">
                        {language === 'th'
                            ? 'เปิดการใช้งานตำแหน่งเพื่อพบสินค้าใกล้บ้าน'
                            : 'Enable location to find items nearby'
                        }
                    </p>
                    <Link
                        href="/search?sort=nearest"
                        className="inline-flex items-center px-6 py-2 bg-green-500 text-white rounded-full font-medium hover:bg-green-600 transition shadow-lg"
                    >
                        <MapPin className="w-4 h-4 mr-2" />
                        {language === 'th' ? 'ค้นหาใกล้ฉัน' : 'Search Near Me'}
                    </Link>
                </div>
            )}

            {/* Zone 4: ✨ AI Recommendations */}
            {recommendations.length > 0 && (
                <div className="border-t border-gray-100 dark:border-gray-800 pt-8">
                    <ProductSectionV2
                        title={language === 'th' ? '✨ AI แนะนำเฉพาะคุณ' : '✨ AI Picks for You'}
                        subtitle={language === 'th' ? 'คัดสรรตามความสนใจของคุณ' : 'Curated based on your interests'}
                        icon={<Sparkles className="w-5 h-5" />}
                        products={recommendations}
                        viewAllLink="/ai-discover"
                        layout="grid"
                        maxItems={10}
                        showAIInsights={true}
                    />
                </div>
            )}

            {/* Zone 5: 👁️ Recently Viewed */}
            {recentlyViewed.length > 0 && (
                <div className="bg-gray-50 dark:bg-slate-900/50 py-6 rounded-2xl mx-[-1rem] md:mx-0 px-4">
                    <ProductSectionV2
                        title={language === 'th' ? '👁️ ดูล่าสุด' : '👁️ Recently Viewed'}
                        subtitle={language === 'th' ? 'สินค้าที่คุณเพิ่งดู' : 'Products you recently viewed'}
                        icon={<History className="w-5 h-5" />}
                        products={recentlyViewed}
                        layout="slider"
                        showAIInsights={false}
                    />
                </div>
            )}
        </div>
    )
}
