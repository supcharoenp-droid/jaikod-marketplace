'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { Flame, Rocket, Activity, Tag, ArrowUpRight } from 'lucide-react'
import {
    getHotTrends,
    getFastGrowing,
    getHighInterest,
    getDiscountHeavy,
    CategoryTrendMetric
} from '@/services/trendAnalytics'

export default function TrendingCategories() {
    const [hotTrends, setHotTrends] = useState<CategoryTrendMetric[]>([])
    const [fastGrowing, setFastGrowing] = useState<CategoryTrendMetric[]>([])
    const [highInterest, setHighInterest] = useState<CategoryTrendMetric[]>([])
    const [discountHeavy, setDiscountHeavy] = useState<CategoryTrendMetric[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [hot, fast, interest, deals] = await Promise.all([
                    getHotTrends(),
                    getFastGrowing(),
                    getHighInterest(),
                    getDiscountHeavy()
                ])
                setHotTrends(hot)
                setFastGrowing(fast)
                setHighInterest(interest)
                setDiscountHeavy(deals)
            } catch (err) {
                console.error(err)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [])

    if (loading) return null // Or skeleton

    return (
        <div className="container mx-auto px-4 py-8">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Activity className="w-6 h-6 text-neon-purple" />
                Marketplace Trends
                <span className="text-xs px-2 py-0.5 bg-green-100 text-green-600 rounded-full animate-pulse">Live</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

                {/* 1. Hot Trends */}
                <TrendCard
                    title="เทรนด์มาแรง (Hot)"
                    icon={<Flame className="w-5 h-5 text-orange-500 fill-orange-500" />}
                    items={hotTrends}
                    color="orange"
                />

                {/* 2. Fast Growing */}
                <TrendCard
                    title="กำลังโตเร็ว (Rising)"
                    icon={<Rocket className="w-5 h-5 text-blue-500 fill-blue-500" />}
                    items={fastGrowing}
                    color="blue"
                />

                {/* 3. High Interest */}
                <TrendCard
                    title="คนสนใจเยอะ (Engagement)"
                    icon={<Activity className="w-5 h-5 text-pink-500" />}
                    items={highInterest}
                    color="pink"
                />

                {/* 4. Heavy Discounts */}
                <TrendCard
                    title="ลดหนักน่าซื้อ (Deals)"
                    icon={<Tag className="w-5 h-5 text-green-500 fill-green-500" />}
                    items={discountHeavy}
                    color="green"
                />

            </div>
        </div>
    )
}

function TrendCard({ title, icon, items, color }: any) {
    const bgColors: any = {
        orange: 'bg-orange-50 dark:bg-orange-900/10 border-orange-100 dark:border-orange-900/20',
        blue: 'bg-blue-50 dark:bg-blue-900/10 border-blue-100 dark:border-blue-900/20',
        pink: 'bg-pink-50 dark:bg-pink-900/10 border-pink-100 dark:border-pink-900/20',
        green: 'bg-green-50 dark:bg-green-900/10 border-green-100 dark:border-green-900/20'
    }

    const textColors: any = {
        orange: 'text-orange-600',
        blue: 'text-blue-600',
        pink: 'text-pink-600',
        green: 'text-green-600'
    }

    return (
        <div className={`rounded-xl p-5 border ${bgColors[color]} h-full transition-transform hover:-translate-y-1`}>
            <div className="flex items-center gap-2 mb-4">
                {icon}
                <h3 className={`font-bold ${textColors[color]}`}>{title}</h3>
            </div>
            <div className="space-y-3">
                {items.map((item: any, idx: number) => (
                    <Link
                        key={item.id}
                        href={`/search?category=${item.id}&sort=trending`}
                        className="flex items-center justify-between group cursor-pointer"
                    >
                        <div className="flex items-center gap-3">
                            <span className={`text-lg font-bold opacity-40 group-hover:opacity-100 w-4 text-center ${idx === 0 ? textColors[color] : ''}`}>
                                {idx + 1}
                            </span>
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
                                {item.name}
                            </span>
                        </div>
                        {item.growthRate > 0 && (
                            <div className="flex items-center text-xs text-green-500 font-medium">
                                +{item.growthRate}% <ArrowUpRight className="w-3 h-3" />
                            </div>
                        )}
                    </Link>
                ))}
            </div>
        </div>
    )
}
