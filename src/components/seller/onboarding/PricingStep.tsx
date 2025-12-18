'use client'

import React, { useState, useEffect } from 'react'
import { TrendingUp, Info, Check, ArrowRight, ArrowLeft, Loader2, DollarSign, BarChart3 } from 'lucide-react'
import Button from '@/components/ui/Button'
import { analyzeMarketPricing, MarketPricingResult } from '@/lib/ai-pricing'

interface PricingStepProps {
    productName: string
    category: string
    onComplete: (price: number) => void
    onBack: () => void
    initialPrice?: number
}

export default function PricingStep({ productName, category, onComplete, onBack, initialPrice }: PricingStepProps) {
    const [isLoading, setIsLoading] = useState(true)
    const [analysis, setAnalysis] = useState<MarketPricingResult | null>(null)
    const [selectedPrice, setSelectedPrice] = useState<number>(initialPrice || 0)
    const [showExplanation, setShowExplanation] = useState(false)
    const [customPrice, setCustomPrice] = useState<string>('')

    useEffect(() => {
        const fetchAnalysis = async () => {
            try {
                const result = await analyzeMarketPricing(category, productName)
                setAnalysis(result)
                if (!initialPrice && result) {
                    setSelectedPrice(result.competitive) // Default to competitive
                }
            } catch (error) {
                console.error("AI Pricing Error:", error)
            } finally {
                setIsLoading(false)
            }
        }
        fetchAnalysis()
    }, [category, productName, initialPrice])

    const handleSelectPrice = (price: number) => {
        setSelectedPrice(price)
        setCustomPrice('')
    }

    const handleCustomPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCustomPrice(e.target.value)
        setSelectedPrice(Number(e.target.value))
    }

    // Graph calculation
    const maxPrice = analysis ? Math.max(...analysis.competitor_prices, analysis.market_avg * 1.2) : 100

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-12 animate-fade-in-up">
                <div className="w-16 h-16 bg-neon-purple/10 rounded-full flex items-center justify-center mb-4 relative">
                    <Loader2 className="w-8 h-8 text-neon-purple animate-spin" />
                    <div className="absolute inset-0 rounded-full border-4 border-t-neon-purple border-transparent animate-spin"></div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">AI กำลังวิเคราะห์ตลาด...</h3>
                <p className="text-gray-500 mt-2">กำลังเปรียบเทียบราคากับคู่แข่งกว่า 1,000 รายการ</p>
            </div>
        )
    }

    return (
        <div className="space-y-6 animate-fade-in-up">
            {/* Header */}
            <div className="flex justify-between items-start">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        ตั้งราคาสินค้า
                        <span className="text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded-full flex items-center gap-1">
                            <TrendingUp className="w-3 h-3" /> AI Powered
                        </span>
                    </h2>
                    <p className="text-gray-500 text-sm mt-1">
                        AI ช่วยวิเคราะห์ราคาที่เหมาะสมที่สุดเพื่อให้คุณขายออกไว
                    </p>
                </div>
            </div>

            {/* Analysis Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Option 1: Lowest */}
                <div
                    onClick={() => handleSelectPrice(analysis?.low_price || 0)}
                    className={`cursor-pointer p-4 rounded-xl border-2 transition-all relative ${selectedPrice === analysis?.low_price
                            ? 'border-green-500 bg-green-50/50 dark:bg-green-900/10'
                            : 'border-gray-100 dark:border-gray-800 hover:border-green-200'
                        }`}
                >
                    <div className="flex justify-between items-start mb-2">
                        <span className="text-xs font-bold text-green-600 bg-green-100 px-2 py-1 rounded-full">ขายไวที่สุด</span>
                        {selectedPrice === analysis?.low_price && <Check className="w-5 h-5 text-green-500" />}
                    </div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">฿{analysis?.low_price.toLocaleString()}</div>
                    <p className="text-xs text-gray-500 mt-1">ต่ำกว่าตลาดเล็กน้อย ดึงดูดลูกค้าได้ทันที</p>
                </div>

                {/* Option 2: Competitive (Recommended) */}
                <div
                    onClick={() => handleSelectPrice(analysis?.competitive || 0)}
                    className={`cursor-pointer p-4 rounded-xl border-2 transition-all relative ${selectedPrice === analysis?.competitive
                            ? 'border-neon-purple bg-purple-50/50 dark:bg-purple-900/10'
                            : 'border-gray-100 dark:border-gray-800 hover:border-purple-200'
                        }`}
                >
                    <div className="flex justify-between items-start mb-2">
                        <span className="text-xs font-bold text-neon-purple bg-purple-100 px-2 py-1 rounded-full flex items-center gap-1">
                            <TrendingUp className="w-3 h-3" /> แนะนำ
                        </span>
                        {selectedPrice === analysis?.competitive && <Check className="w-5 h-5 text-neon-purple" />}
                    </div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">฿{analysis?.competitive.toLocaleString()}</div>
                    <p className="text-xs text-gray-500 mt-1">ราคาที่สมดุลระหว่างกำไรและความเร็วในการขาย</p>
                </div>

                {/* Option 3: Market Avg */}
                <div
                    onClick={() => handleSelectPrice(analysis?.market_avg || 0)}
                    className={`cursor-pointer p-4 rounded-xl border-2 transition-all relative ${selectedPrice === analysis?.market_avg
                            ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-900/10'
                            : 'border-gray-100 dark:border-gray-800 hover:border-blue-200'
                        }`}
                >
                    <div className="flex justify-between items-start mb-2">
                        <span className="text-xs font-bold text-blue-600 bg-blue-100 px-2 py-1 rounded-full">ราคาตลาด</span>
                        {selectedPrice === analysis?.market_avg && <Check className="w-5 h-5 text-blue-500" />}
                    </div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">฿{analysis?.market_avg.toLocaleString()}</div>
                    <p className="text-xs text-gray-500 mt-1">ราคามาตรฐาน ขายได้เรื่อยๆ ไม่กดราคา</p>
                </div>
            </div>

            {/* Custom Price */}
            <div className="relative">
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">กำหนดราคาเอง</label>
                <div className="relative">
                    <input
                        type="number"
                        value={customPrice}
                        onChange={handleCustomPriceChange}
                        placeholder={selectedPrice.toString()}
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-white dark:bg-gray-800 focus:outline-none focus:border-neon-purple transition-all"
                    />
                    <DollarSign className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">THB</div>
                </div>
            </div>

            {/* Market Graph */}
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                        <BarChart3 className="w-4 h-4" /> ภาพรวมตลาด
                    </h4>
                    <button
                        onClick={() => setShowExplanation(!showExplanation)}
                        className="text-xs text-neon-purple hover:underline flex items-center gap-1"
                    >
                        <Info className="w-3 h-3" /> ทำไมต้องราคานี้?
                    </button>
                </div>

                {showExplanation && (
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg mb-4 text-sm text-gray-600 border border-gray-100 dark:border-gray-700 animate-fade-in-down">
                        <p>{analysis?.explanation}</p>
                    </div>
                )}

                <div className="h-32 flex items-end gap-2 justify-between">
                    {analysis?.competitor_prices.map((price, i) => {
                        const height = (price / maxPrice) * 100
                        const isSelected = Math.abs(price - selectedPrice) < (maxPrice * 0.05) // Highlight if close
                        return (
                            <div key={i} className="flex-1 flex flex-col items-center gap-1 group relative">
                                <div
                                    className={`w-full rounded-t-sm transition-all duration-500 ${isSelected ? 'bg-neon-purple' : 'bg-gray-300 dark:bg-gray-600 group-hover:bg-gray-400'}`}
                                    style={{ height: `${height}%` }}
                                ></div>
                                {/* <span className="text-[10px] text-gray-400 opacity-0 group-hover:opacity-100 absolute -top-4">{price}</span> */}
                            </div>
                        )
                    })}
                </div>
                <div className="flex justify-between text-xs text-gray-400 mt-2">
                    <span>฿{Math.min(...(analysis?.competitor_prices || []))}</span>
                    <span>Market Distribution</span>
                    <span>฿{Math.max(...(analysis?.competitor_prices || []))}</span>
                </div>
            </div>

            {/* Actions */}
            <div className="mt-8 flex gap-3">
                <Button variant="outline" className="flex-1" onClick={onBack}>
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    ย้อนกลับ
                </Button>
                <Button
                    variant="primary"
                    className="flex-1 shadow-lg shadow-neon-purple/20"
                    onClick={() => onComplete(selectedPrice)}
                    disabled={!selectedPrice || selectedPrice <= 0}
                >
                    ยืนยันราคา
                    <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
            </div>
        </div>
    )
}
