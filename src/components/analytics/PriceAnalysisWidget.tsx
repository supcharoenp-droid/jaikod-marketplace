'use client'

import React, { useEffect, useState } from 'react'
import { TrendingUp, AlertCircle, CheckCircle, Flame, MapPin, BarChart3, ArrowRight } from 'lucide-react'
import { analyzePrice, PriceAnalysisResult } from '@/services/priceAnalytics'

interface PriceAnalysisWidgetProps {
    price: number
    category: string
    province?: string
    mode?: 'seller' | 'buyer' // Seller sees detailed advice, Buyer sees comparison
}

export default function PriceAnalysisWidget({ price, category, province, mode = 'seller' }: PriceAnalysisWidgetProps) {
    const [analysis, setAnalysis] = useState<PriceAnalysisResult | null>(null)

    useEffect(() => {
        if (price > 0 && category) {
            const res = analyzePrice(category, price, province)
            setAnalysis(res)
        }
    }, [price, category, province])

    if (!analysis) return null

    // Helper for position on bar
    const positionLeft = Math.min(100, Math.max(0, analysis.percentile)) + '%'

    return (
        <div className="bg-white dark:bg-card-dark rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 flex justify-between items-center">
                <h3 className="font-bold flex items-center gap-2 text-gray-800 dark:text-gray-200">
                    <BarChart3 className="w-5 h-5 text-blue-500" />
                    AI Price Analysis
                </h3>
                {analysis.badges.map(badge => (
                    <span key={badge} className={`px-2 py-0.5 rounded textxs font-bold ${badge === 'Hot Price' ? 'bg-red-100 text-red-600' :
                            badge === 'Good Deal' ? 'bg-green-100 text-green-600' :
                                badge === 'Overpriced' ? 'bg-orange-100 text-orange-600' :
                                    'bg-gray-100 text-gray-600'
                        }`}>
                        {badge}
                    </span>
                ))}
            </div>

            <div className="p-5">
                {/* 1. Main Status Indicator */}
                <div className="flex items-center gap-4 mb-6">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${analysis.status === 'optimal' ? 'bg-green-100 text-green-600' :
                            analysis.status === 'good_deal' ? 'bg-red-100 text-red-600' :
                                analysis.status === 'overpriced' ? 'bg-orange-100 text-orange-600' :
                                    'bg-gray-200 text-gray-500'
                        }`}>
                        {analysis.status === 'optimal' ? <CheckCircle className="w-6 h-6" /> :
                            analysis.status === 'good_deal' ? <Flame className="w-6 h-6" /> :
                                <AlertCircle className="w-6 h-6" />}
                    </div>
                    <div>
                        <div className="text-sm text-gray-500">
                            {mode === 'seller' ? 'คำแนะนำราคา:' : 'ความคุ้มค่า:'}
                        </div>
                        <div className="text-xl font-bold">
                            {analysis.status === 'optimal' ? 'ราคาเหมาะสม (Market Price)' :
                                analysis.status === 'good_deal' ? 'ราคาดีมาก! ออกไวแน่นอน' :
                                    analysis.status === 'overpriced' ? 'ราคาสูงกว่าตลาด (Overpriced)' :
                                        'ราคาต่ำผิดปกติ (ตรวจสอบสินค้า)'}
                        </div>
                        {mode === 'seller' && analysis.status === 'overpriced' && (
                            <div className="text-xs text-orange-500 mt-1">แนะนำให้ลดลงเหลือ {analysis.suggested_range.max.toLocaleString()} บาท เพื่อให้ขายง่ายขึ้น</div>
                        )}
                    </div>
                </div>

                {/* 2. Visual Chart (Price Bar) */}
                <div className="mb-6">
                    <div className="flex justify-between text-xs text-gray-400 mb-2">
                        <span>ถูก ฿{analysis.suggested_range.min.toLocaleString()}</span>
                        <span>เหมาะสม</span>
                        <span>แพง ฿{analysis.suggested_range.max.toLocaleString()}</span>
                    </div>
                    <div className="h-4 bg-gray-100 rounded-full relative overflow-hidden">
                        {/* Green Zone (Optimal) */}
                        <div className="absolute left-[30%] right-[30%] top-0 bottom-0 bg-green-200/50" />

                        {/* Current Price Marker */}
                        <div
                            className="absolute top-0 bottom-0 w-1 bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.8)] z-10 transition-all duration-500"
                            style={{ left: positionLeft }}
                        />
                    </div>
                    <div className="mt-2 text-center text-xs font-medium text-blue-600">
                        ราคาของคุณอยู่ช่วง {analysis.percentile.toFixed(0)}% ของตลาด
                    </div>
                </div>

                {/* 3. Geo Insights */}
                <div className="bg-blue-50 dark:bg-blue-900/10 rounded-lg p-4">
                    <h4 className="font-bold text-sm mb-3 flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        เทียบราคาตามพื้นที่
                    </h4>
                    <div className="space-y-2">
                        {analysis.geo_pricing.map(geo => (
                            <div key={geo.region} className="flex justify-between items-center text-sm">
                                <span className="text-gray-600 dark:text-gray-400">{geo.region}</span>
                                <div className="flex items-center gap-3">
                                    <span className="font-medium">฿{geo.avg_price.toLocaleString()}</span>
                                    <span className={`text-xs px-1.5 rounded ${geo.diff_percent > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                        }`}>
                                        {geo.diff_percent > 0 ? '+' : ''}{geo.diff_percent}%
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
