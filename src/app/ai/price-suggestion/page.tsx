'use client'

import { useState } from 'react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { useLanguage } from '@/contexts/LanguageContext'
import {
    DollarSign, TrendingUp, TrendingDown, BarChart3, Info,
    ArrowRight, RefreshCw, Sparkles, Target, Clock, MapPin
} from 'lucide-react'
import Button from '@/components/ui/Button'

const translations = {
    th: {
        title: 'AI แนะนำราคา',
        subtitle: 'วิเคราะห์ตลาดแบบ Real-time เพื่อแนะนำราคาที่เหมาะสมที่สุด',
        enterProduct: 'ชื่อสินค้า',
        enterCategory: 'หมวดหมู่',
        enterCondition: 'สภาพ',
        analyze: 'วิเคราะห์ราคา',
        analyzing: 'กำลังวิเคราะห์...',
        suggestedPrice: 'ราคาแนะนำ',
        priceRange: 'ช่วงราคาตลาด',
        sellFast: 'ขายไว',
        recommended: 'แนะนำ',
        premium: 'พรีเมียม',
        marketInsight: 'Market Insight',
        avgPrice: 'ราคาเฉลี่ย',
        lowestPrice: 'ราคาต่ำสุด',
        highestPrice: 'ราคาสูงสุด',
        demandLevel: 'ความต้องการ',
        high: 'สูง',
        medium: 'ปานกลาง',
        low: 'ต่ำ',
        howItWorks: 'AI วิเคราะห์ราคาอย่างไร',
        factor1Title: 'ข้อมูลตลาด',
        factor1Desc: 'วิเคราะห์ราคาสินค้าที่คล้ายกันในตลาด',
        factor2Title: 'ความต้องการ',
        factor2Desc: 'ดูแนวโน้มความนิยมและ Demand',
        factor3Title: 'สภาพสินค้า',
        factor3Desc: 'ปรับราคาตามสภาพและอายุการใช้งาน',
        factor4Title: 'ตำแหน่งที่ตั้ง',
        factor4Desc: 'ราคาต่างกันตามพื้นที่',
        conditionNew: 'ใหม่',
        conditionLikeNew: 'เหมือนใหม่',
        conditionGood: 'ดี',
        conditionFair: 'พอใช้',
        categories: ['มือถือ', 'คอมพิวเตอร์', 'กล้อง', 'รถยนต์', 'เครื่องใช้ไฟฟ้า', 'แฟชั่น'],
    },
    en: {
        title: 'AI Price Suggestion',
        subtitle: 'Real-time market analysis to suggest the best price',
        enterProduct: 'Product Name',
        enterCategory: 'Category',
        enterCondition: 'Condition',
        analyze: 'Analyze Price',
        analyzing: 'Analyzing...',
        suggestedPrice: 'Suggested Price',
        priceRange: 'Market Price Range',
        sellFast: 'Sell Fast',
        recommended: 'Recommended',
        premium: 'Premium',
        marketInsight: 'Market Insight',
        avgPrice: 'Average Price',
        lowestPrice: 'Lowest Price',
        highestPrice: 'Highest Price',
        demandLevel: 'Demand Level',
        high: 'High',
        medium: 'Medium',
        low: 'Low',
        howItWorks: 'How AI Analyzes Price',
        factor1Title: 'Market Data',
        factor1Desc: 'Analyze similar products in market',
        factor2Title: 'Demand',
        factor2Desc: 'Check trends and popularity',
        factor3Title: 'Condition',
        factor3Desc: 'Adjust based on condition and age',
        factor4Title: 'Location',
        factor4Desc: 'Prices vary by area',
        conditionNew: 'New',
        conditionLikeNew: 'Like New',
        conditionGood: 'Good',
        conditionFair: 'Fair',
        categories: ['Mobile', 'Computer', 'Camera', 'Automotive', 'Appliances', 'Fashion'],
    }
}

export default function PriceSuggestionPage() {
    const { language } = useLanguage()
    const t = translations[language as 'th' | 'en'] || translations.th

    const [productName, setProductName] = useState('')
    const [category, setCategory] = useState('')
    const [condition, setCondition] = useState('')
    const [isAnalyzing, setIsAnalyzing] = useState(false)
    const [result, setResult] = useState<any>(null)

    const handleAnalyze = () => {
        if (!productName.trim()) return
        setIsAnalyzing(true)
        setTimeout(() => {
            const basePrice = Math.floor(Math.random() * 20000) + 5000
            setResult({
                suggestedPrice: basePrice,
                sellFast: Math.floor(basePrice * 0.85),
                premium: Math.floor(basePrice * 1.15),
                avgPrice: basePrice,
                lowestPrice: Math.floor(basePrice * 0.7),
                highestPrice: Math.floor(basePrice * 1.3),
                demand: ['high', 'medium', 'low'][Math.floor(Math.random() * 3)],
                similarListings: Math.floor(Math.random() * 50) + 10,
                avgSellTime: Math.floor(Math.random() * 7) + 1,
            })
            setIsAnalyzing(false)
        }, 2000)
    }

    const conditions = [
        { value: 'new', label: t.conditionNew },
        { value: 'like-new', label: t.conditionLikeNew },
        { value: 'good', label: t.conditionGood },
        { value: 'fair', label: t.conditionFair },
    ]

    const factors = [
        { icon: BarChart3, title: t.factor1Title, desc: t.factor1Desc, color: 'from-blue-500 to-cyan-500' },
        { icon: TrendingUp, title: t.factor2Title, desc: t.factor2Desc, color: 'from-green-500 to-emerald-500' },
        { icon: Target, title: t.factor3Title, desc: t.factor3Desc, color: 'from-orange-500 to-red-500' },
        { icon: MapPin, title: t.factor4Title, desc: t.factor4Desc, color: 'from-purple-500 to-pink-500' },
    ]

    return (
        <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-bg-dark">
            <Header />
            <main className="flex-1">
                {/* Hero */}
                <section className="relative py-16 bg-gradient-to-br from-orange-500 via-red-500 to-pink-600 overflow-hidden">
                    <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
                    <div className="container mx-auto px-4 relative z-10">
                        <div className="text-center mb-8">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-white mb-4">
                                <Sparkles className="w-4 h-4" />
                                <span className="text-sm font-medium">AI-Powered</span>
                            </div>
                            <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
                                💰 {t.title}
                            </h1>
                            <p className="text-lg text-white/80 max-w-2xl mx-auto">
                                {t.subtitle}
                            </p>
                        </div>

                        {/* Input Form */}
                        <div className="max-w-2xl mx-auto">
                            <div className="bg-white dark:bg-surface-dark rounded-2xl shadow-2xl p-6">
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-2">{t.enterProduct}</label>
                                        <input
                                            type="text"
                                            value={productName}
                                            onChange={(e) => setProductName(e.target.value)}
                                            placeholder="iPhone 14 Pro Max 256GB"
                                            className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-orange-500"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium mb-2">{t.enterCategory}</label>
                                            <select
                                                value={category}
                                                onChange={(e) => setCategory(e.target.value)}
                                                className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-orange-500"
                                            >
                                                <option value="">--</option>
                                                {t.categories.map((cat, idx) => (
                                                    <option key={idx} value={cat}>{cat}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-2">{t.enterCondition}</label>
                                            <select
                                                value={condition}
                                                onChange={(e) => setCondition(e.target.value)}
                                                className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-orange-500"
                                            >
                                                <option value="">--</option>
                                                {conditions.map((c) => (
                                                    <option key={c.value} value={c.value}>{c.label}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                    <Button
                                        onClick={handleAnalyze}
                                        disabled={isAnalyzing || !productName}
                                        className="w-full py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl flex items-center justify-center gap-2"
                                    >
                                        {isAnalyzing ? (
                                            <>
                                                <RefreshCw className="w-5 h-5 animate-spin" />
                                                {t.analyzing}
                                            </>
                                        ) : (
                                            <>
                                                <DollarSign className="w-5 h-5" />
                                                {t.analyze}
                                            </>
                                        )}
                                    </Button>
                                </div>

                                {result && (
                                    <div className="mt-6 space-y-4">
                                        {/* Main Price */}
                                        <div className="text-center p-6 rounded-xl bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20">
                                            <p className="text-sm text-gray-500 mb-1">{t.suggestedPrice}</p>
                                            <p className="text-4xl font-bold text-orange-600">
                                                ฿{result.suggestedPrice.toLocaleString()}
                                            </p>
                                        </div>

                                        {/* Price Range */}
                                        <div className="grid grid-cols-3 gap-3">
                                            <div className="text-center p-4 rounded-xl bg-green-50 dark:bg-green-900/20">
                                                <p className="text-xs text-gray-500">{t.sellFast}</p>
                                                <p className="text-lg font-bold text-green-600">฿{result.sellFast.toLocaleString()}</p>
                                            </div>
                                            <div className="text-center p-4 rounded-xl bg-orange-100 dark:bg-orange-900/30 border-2 border-orange-500">
                                                <p className="text-xs text-gray-500">{t.recommended}</p>
                                                <p className="text-lg font-bold text-orange-600">฿{result.suggestedPrice.toLocaleString()}</p>
                                            </div>
                                            <div className="text-center p-4 rounded-xl bg-purple-50 dark:bg-purple-900/20">
                                                <p className="text-xs text-gray-500">{t.premium}</p>
                                                <p className="text-lg font-bold text-purple-600">฿{result.premium.toLocaleString()}</p>
                                            </div>
                                        </div>

                                        {/* Market Insight */}
                                        <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800">
                                            <h4 className="font-bold mb-3 flex items-center gap-2">
                                                <Info className="w-4 h-4" />
                                                {t.marketInsight}
                                            </h4>
                                            <div className="grid grid-cols-2 gap-4 text-sm">
                                                <div>
                                                    <span className="text-gray-500">{t.demandLevel}:</span>
                                                    <span className={`ml-2 font-bold ${result.demand === 'high' ? 'text-green-600' : result.demand === 'medium' ? 'text-yellow-600' : 'text-red-600'}`}>
                                                        {t[result.demand as keyof typeof t]}
                                                    </span>
                                                </div>
                                                <div>
                                                    <span className="text-gray-500">Similar listings:</span>
                                                    <span className="ml-2 font-bold">{result.similarListings}</span>
                                                </div>
                                                <div>
                                                    <span className="text-gray-500">{t.lowestPrice}:</span>
                                                    <span className="ml-2 font-bold">฿{result.lowestPrice.toLocaleString()}</span>
                                                </div>
                                                <div>
                                                    <span className="text-gray-500">{t.highestPrice}:</span>
                                                    <span className="ml-2 font-bold">฿{result.highestPrice.toLocaleString()}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </section>

                {/* How It Works */}
                <section className="py-16">
                    <div className="container mx-auto px-4">
                        <h2 className="text-2xl font-bold text-center mb-12">{t.howItWorks}</h2>
                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
                            {factors.map((factor, idx) => (
                                <div key={idx} className="text-center">
                                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${factor.color} flex items-center justify-center text-white mx-auto mb-4`}>
                                        <factor.icon className="w-8 h-8" />
                                    </div>
                                    <h3 className="font-bold mb-2">{factor.title}</h3>
                                    <p className="text-gray-500 text-sm">{factor.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    )
}
