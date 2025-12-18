'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { Sparkles, MapPin, TrendingUp, Search, Tag, Zap, RefreshCw, ShieldCheck, Star } from 'lucide-react'
import ProductCard from '@/components/product/ProductCard'
import Button from '@/components/ui/Button'
import { getForYouFeed } from '@/services/behaviorTracking'
import { Product } from '@/types'
import SellerTrustBadge from '@/components/seller/SellerTrustBadge'
import InfiniteFeed from '@/components/feed/InfiniteFeed'

export default function ForYouPage() {
    const [feed, setFeed] = useState<any>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isRefreshing, setIsRefreshing] = useState(false)

    const fetchFeed = async () => {
        try {
            const data = await getForYouFeed()
            setFeed(data)
        } catch (error) {
            console.error('Error fetching For You feed:', error)
        } finally {
            setIsLoading(false)
            setIsRefreshing(false)
        }
    }

    useEffect(() => {
        fetchFeed()
    }, [])

    const handleRefresh = () => {
        setIsRefreshing(true)
        // Add artificial delay for UX feel of "AI Processing"
        setTimeout(() => {
            fetchFeed()
        }, 800)
    }

    if (isLoading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center space-y-4">
                <div className="w-12 h-12 border-4 border-neon-purple border-t-transparent rounded-full animate-spin"></div>
                <p className="text-gray-500 animate-pulse">AI กำลังคัดสรรสินค้าเพื่อคุณ...</p>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-bg-dark pb-20">
            {/* Header / Hero */}
            <div className="bg-gradient-to-b from-white to-gray-50 dark:from-surface-dark dark:to-bg-dark pt-8 pb-6 px-4 sticky top-0 z-20 shadow-sm/50 backdrop-blur-md bg-opacity-90">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2 bg-gradient-to-r from-neon-purple to-pink-500 bg-clip-text text-transparent">
                            <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-neon-purple fill-neon-purple" />
                            For You
                        </h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            คัดพิเศษเพื่อคุณโดยเฉพาะ
                        </p>
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleRefresh}
                        className={`transition-all ${isRefreshing ? 'animate-spin' : ''}`}
                    >
                        <RefreshCw className="w-4 h-4" />
                    </Button>
                </div>
            </div>

            <main className="max-w-7xl mx-auto px-4 space-y-12 mt-6">

                {/* 7. Intent Booster (Feature Highlight) */}
                {feed.intentBooster && (
                    <section className="animate-fadeIn">
                        <div className="bg-gradient-to-r from-violet-600 to-indigo-600 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
                            <div className="relative z-10">
                                <div className="flex items-center gap-2 mb-4">
                                    <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                                        <Zap className="w-3 h-3 text-yellow-300" /> AI Pick
                                    </span>
                                    <h2 className="text-xl font-bold">อยากให้ดูสิ่งนี้เป็นพิเศษ</h2>
                                </div>
                                <p className="mb-6 opacity-90">
                                    ดูเหมือนคุณกำลังสนใจ <strong>"{feed.intentBooster.category}"</strong> เป็นพิเศษ
                                    เราคัดมาให้คุณเลือกแล้ว
                                </p>
                                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                    {feed.intentBooster.products.map((product: Product) => (
                                        <div key={product.id} className="bg-white/10 p-2 rounded-xl backdrop-blur-sm border border-white/20">
                                            <ProductCard product={product} isAiRecommended={true} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                            {/* Decorative BG */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
                        </div>
                    </section>
                )}

                {/* Trusted Sellers (New) */}
                {feed.trustedSellers && feed.trustedSellers.length > 0 && (
                    <section>
                        <SectionHeader
                            icon={ShieldCheck}
                            title="ร้านค้าแนะนำใกล้คุณ"
                            subtitle="ผู้ขายคุณภาพที่ผ่านการคัดเลือกจาก AI"
                            color="text-blue-600"
                        />
                        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
                            {feed.trustedSellers.map((seller: any) => (
                                <Link key={seller.id} href={`/profile/${seller.user_id}`} className="min-w-[280px] bg-white dark:bg-surface-dark rounded-xl p-4 border border-gray-100 dark:border-gray-800 hover:shadow-lg transition-all group">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="w-12 h-12 rounded-full bg-gray-100 relative overflow-hidden">
                                            <div className="w-full h-full bg-gradient-to-tr from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold text-lg">
                                                {seller.shop_name[0]}
                                            </div>
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-900 dark:text-gray-100 truncate max-w-[150px] group-hover:text-neon-purple transition-colors">{seller.shop_name}</h3>
                                            <div className="flex items-center gap-1 text-xs text-gray-500">
                                                <Star className="w-3 h-3 fill-amber-400 text-amber-400" /> {seller.rating_score} ({seller.rating_count})
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex flex-wrap gap-2 mb-3">
                                        {seller.badges?.map((badge: string) => (
                                            <SellerTrustBadge key={badge} badge={badge} size="sm" />
                                        ))}
                                    </div>
                                    <div className="flex justify-between items-center text-xs text-gray-400 border-t border-gray-50 pt-3">
                                        <span>ตอบกลับ {seller.response_rate}%</span>
                                        <span className="text-green-600 font-medium">คะแนนความเชื่อถือ {seller.trust_score}/100</span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </section>
                )}

                {/* 1. AI Recommended (Main Feed) */}
                <section>
                    <SectionHeader
                        icon={Sparkles}
                        title="แนะนำสำหรับคุณ"
                        subtitle="อิงตามความสนใจล่าสุดของคุณ"
                        color="text-neon-purple"
                    />
                    <ProductGrid products={feed.aiRecommended} isAiRecommended={true} />
                </section>

                {/* 5. Personalized Discounts */}
                {feed.discounts.length > 0 && (
                    <section>
                        <SectionHeader
                            icon={Tag}
                            title="ลดราคาเพื่อคุณ"
                            subtitle="สินค้าที่คุณอาจชอบ ในราคาพิเศษ"
                            color="text-red-500"
                        />
                        <ProductGrid products={feed.discounts} />
                    </section>
                )}

                {/* 2. Frequent Searches */}
                {feed.searchHistory && feed.searchHistory.products.length > 0 && (
                    <section>
                        <SectionHeader
                            icon={Search}
                            title="คุณค้นหาบ่อย"
                            subtitle={`รวมสินค้าเกี่ยวกับ "${feed.searchHistory.query}"`}
                            color="text-blue-500"
                        />
                        <ProductGrid products={feed.searchHistory.products} />
                    </section>
                )}

                {/* 3. Near You */}
                {feed.nearMe.length > 0 && (
                    <section>
                        <SectionHeader
                            icon={MapPin}
                            title="ใกล้บ้านคุณ"
                            subtitle="สินค้าในระแวกนี้ที่คุณอาจสนใจ"
                            color="text-green-500"
                        />
                        <ProductGrid products={feed.nearMe} />
                    </section>
                )}

                {/* 6. New in Area */}
                {feed.newLocal.length > 0 && (
                    <section>
                        <SectionHeader
                            icon={RefreshCw}
                            title="เพิ่งลงขายในพื้นที่"
                            subtitle="อัปเดตล่าสุดใกล้ตัวคุณ"
                            color="text-emerald-500"
                        />
                        <ProductGrid products={feed.newLocal} />
                    </section>
                )}

                {/* 4. Trending */}
                <section>
                    <SectionHeader
                        icon={TrendingUp}
                        title="กำลังเป็นกระแส"
                        subtitle="สินค้ายอดฮิตที่คนกำลังดูเยอะที่สุด"
                        color="text-orange-500"
                    />
                    <ProductGrid products={feed.trending} />
                </section>

                {/* 8. Infinite Feed */}
                <section className="pt-8 border-t border-gray-100 dark:border-gray-800">
                    <InfiniteFeed />
                </section>
            </main>
        </div>
    )
}

function SectionHeader({ icon: Icon, title, subtitle, color }: any) {
    return (
        <div className="mb-6">
            <h2 className="text-xl font-bold flex items-center gap-2 text-gray-900 dark:text-white">
                <Icon className={`w-6 h-6 ${color}`} />
                {title}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 ml-8">{subtitle}</p>
        </div>
    )
}

function ProductGrid({ products, isAiRecommended }: { products: Product[], isAiRecommended?: boolean }) {
    if (!products || products.length === 0) {
        return <div className="p-8 text-center text-gray-400 bg-white dark:bg-surface-dark rounded-xl border border-dashed border-gray-200 dark:border-gray-800">ไม่มีสินค้าในส่วนนี้</div>
    }

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {products.map((product) => (
                <div key={product.id} className="transform hover:-translate-y-1 transition-transform duration-200">
                    <ProductCard product={product} isAiRecommended={isAiRecommended} />
                </div>
            ))}
        </div>
    )
}
