'use client'

import React, { useEffect, useState } from 'react'
import { Flame, Rocket, Search, Clock, TrendingUp, ChevronRight } from 'lucide-react'
import { getHourlyTrendHighlights, CategoryTrendMetric } from '@/services/trendAnalytics'

interface TrendHighlights {
    hot: CategoryTrendMetric
    growing: CategoryTrendMetric
    searched: CategoryTrendMetric
    updateTime: string
}

export default function HourlyTrends() {
    const [trends, setTrends] = useState<TrendHighlights | null>(null)

    useEffect(() => {
        // Load initial
        const load = async () => {
            const data = await getHourlyTrendHighlights()
            setTrends(data)
        }
        load()

        // "Real-time" effect - refresh every 10s for demo (in production would be hourly)
        const interval = setInterval(load, 10000)
        return () => clearInterval(interval)
    }, [])

    if (!trends) return null

    return (
        <div className="bg-white dark:bg-card-dark rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-800">
            <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                    <div className="bg-red-500 text-white rounded p-1">
                        <TrendingUp className="w-5 h-5" />
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-900 dark:text-white leading-tight">หมวดมาแรงรายชั่วโมง</h3>
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                            <Clock className="w-3 h-3" />
                            อัปเดตล่าสุด {trends.updateTime} น.
                        </div>
                    </div>
                </div>
                <button className="text-xs text-blue-600 font-medium flex items-center hover:underline">
                    ดูทั้งหมด <ChevronRight className="w-3 h-3" />
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {/* 1. Hot - Fire */}
                <div className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-red-900/10 dark:to-orange-900/10 border border-orange-100 dark:border-red-900/30 rounded-xl p-3 flex items-center justify-between group cursor-pointer hover:shadow-md transition-all">
                    <div className="flex flex-col">
                        <span className="text-xs font-bold text-orange-600 flex items-center gap-1">
                            <Flame className="w-3 h-3" /> มาแรงอันดับ #1
                        </span>
                        <h4 className="font-bold text-lg dark:text-gray-200">{trends.hot.name}</h4>
                        <span className="text-xs text-gray-500">{trends.hot.trendScore.toFixed(0)} คะแนนเทรนด์</span>
                    </div>
                    <div className="text-3xl group-hover:scale-125 transition-transform duration-300 drop-shadow-sm">
                        {trends.hot.icon}
                    </div>
                </div>

                {/* 2. Growing - Rocket */}
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/10 dark:to-cyan-900/10 border border-blue-100 dark:border-blue-900/30 rounded-xl p-3 flex items-center justify-between group cursor-pointer hover:shadow-md transition-all">
                    <div className="flex flex-col">
                        <span className="text-xs font-bold text-blue-600 flex items-center gap-1">
                            <Rocket className="w-3 h-3" /> โตเร็วอันดับ #1
                        </span>
                        <h4 className="font-bold text-lg dark:text-gray-200">{trends.growing.name}</h4>
                        <span className="text-xs text-green-600 font-bold">+{trends.growing.growthRate}% ใน 1 ชม.</span>
                    </div>
                    <div className="text-3xl group-hover:scale-125 transition-transform duration-300 drop-shadow-sm">
                        {trends.growing.icon}
                    </div>
                </div>

                {/* 3. Searched - Magnify */}
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/10 dark:to-pink-900/10 border border-purple-100 dark:border-purple-900/30 rounded-xl p-3 flex items-center justify-between group cursor-pointer hover:shadow-md transition-all">
                    <div className="flex flex-col">
                        <span className="text-xs font-bold text-purple-600 flex items-center gap-1">
                            <Search className="w-3 h-3" /> ค้นหาเยอะสุด
                        </span>
                        <h4 className="font-bold text-lg dark:text-gray-200">{trends.searched.name}</h4>
                        <span className="text-xs text-gray-500">{trends.searched.searchVolume.toLocaleString()} ครั้ง/ชม.</span>
                    </div>
                    <div className="text-3xl group-hover:scale-125 transition-transform duration-300 drop-shadow-sm">
                        {trends.searched.icon}
                    </div>
                </div>
            </div>
        </div>
    )
}
