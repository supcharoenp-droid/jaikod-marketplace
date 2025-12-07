'use client'

import { useEffect, useState } from 'react'
import { History, Sparkles, Heart, TrendingUp, Search } from 'lucide-react'
import ProductSection from './ProductSection'
import { Product } from '@/types'
import {
    getRecentlyViewed,
    getBasedOnSearchHistory,
    getPersonalizedRecommendations,
    getBasedOnFavorites,
    getTrendingInInterests,
    trackVisit
} from '@/services/behaviorTracking'

export default function PersonalizedSections() {
    const [recentlyViewed, setRecentlyViewed] = useState<Product[]>([])
    const [searchBasedData, setSearchBasedData] = useState<{ query: string; products: Product[] } | null>(null)
    const [recommendations, setRecommendations] = useState<Product[]>([])
    const [favoriteBased, setFavoriteBased] = useState<Product[]>([])
    const [trendingInterests, setTrendingInterests] = useState<Product[]>([])
    const [isLoaded, setIsLoaded] = useState(false)

    useEffect(() => {
        const loadData = async () => {
            // Track page visit
            trackVisit()

            try {
                // Load personalized data
                const [
                    recent,
                    searchBased,
                    recom,
                    favBased,
                    trendInterest
                ] = await Promise.all([
                    getRecentlyViewed(10),
                    getBasedOnSearchHistory(8),
                    getPersonalizedRecommendations(20),
                    getBasedOnFavorites(8),
                    getTrendingInInterests(10)
                ])

                setRecentlyViewed(recent)
                setSearchBasedData(searchBased)
                setRecommendations(recom)
                setFavoriteBased(favBased)
                setTrendingInterests(trendInterest)
            } catch (error) {
                console.error('Error loading personalized data:', error)
            } finally {
                setIsLoaded(true)
            }
        }

        loadData()
    }, [])

    if (!isLoaded) return null

    return (
        <div className="space-y-4">
            {/* Recently Viewed */}
            {recentlyViewed.length > 0 && (
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10 py-4 rounded-2xl mx-4">
                    <ProductSection
                        title="สินค้าที่เพิ่งดู"
                        subtitle="กลับมาดูอีกครั้ง ก่อนหมดโอกาส"
                        icon={<History className="w-6 h-6 text-blue-500" />}
                        products={recentlyViewed}
                        layout="slider"
                    />
                </div>
            )}

            {/* Based on Search History */}
            {searchBasedData && searchBasedData.products.length > 0 && (
                <ProductSection
                    title={`เพราะคุณค้นหา "${searchBasedData.query}"`}
                    subtitle="สินค้าที่ตรงกับสิ่งที่คุณกำลังหา"
                    icon={<Search className="w-6 h-6 text-emerald-500" />}
                    products={searchBasedData.products}
                    layout="slider"
                />
            )}

            {/* Based on Favorites */}
            {favoriteBased.length > 0 && (
                <ProductSection
                    title="คล้ายกับที่คุณถูกใจ"
                    subtitle="เลือกดูเพิ่มเติมจากสิ่งที่คุณชอบ"
                    icon={<Heart className="w-6 h-6 text-rose-500" />}
                    products={favoriteBased}
                    layout="slider"
                />
            )}

            {/* Trending in Your Interests */}
            {trendingInterests.length > 0 && (
                <ProductSection
                    title="มาแรงในหมวดที่คุณสนใจ"
                    subtitle="สินค้ายอดนิยมที่คุณอาจพลาด"
                    icon={<TrendingUp className="w-6 h-6 text-orange-500" />}
                    products={trendingInterests}
                    layout="slider"
                />
            )}

            {/* AI Personalized Recommendations */}
            {recommendations.length > 0 && (
                <div className="mt-8">
                    <ProductSection
                        title="AI แนะนำสำหรับคุณโดยเฉพาะ"
                        subtitle="เลือกสรรจากพฤติกรรมการใช้งานของคุณ"
                        icon={<Sparkles className="w-6 h-6 text-neon-purple" />}
                        products={recommendations}
                        layout="grid"
                        viewAllLink="/search"
                    />
                </div>
            )}
        </div>
    )
}
