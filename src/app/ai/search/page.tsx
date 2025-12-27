'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { useLanguage } from '@/contexts/LanguageContext'
import {
    Search, Sparkles, Mic, Camera, ArrowRight, History, TrendingUp,
    Filter, MapPin, Tag, Clock, Star, Heart, ShoppingCart
} from 'lucide-react'
import Button from '@/components/ui/Button'

const translations = {
    th: {
        title: 'ค้นหาอัจฉริยะ',
        subtitle: 'ค้นหาสินค้าด้วย AI - พิมพ์ภาษาธรรมดาหรือถ่ายรูป',
        searchPlaceholder: 'ค้นหาอะไรก็ได้ เช่น "iPhone สภาพดี ใกล้ฉัน งบไม่เกิน 15,000"',
        voiceSearch: 'ค้นหาด้วยเสียง',
        imageSearch: 'ค้นหาด้วยรูป',
        searchBtn: 'ค้นหา',
        recentSearches: 'การค้นหาล่าสุด',
        trendingSearches: 'กำลังนิยม',
        aiSuggestions: 'AI แนะนำสำหรับคุณ',
        howItWorks: 'ค้นหาอัจฉริยะทำงานอย่างไร',
        step1Title: 'พิมพ์ธรรมชาติ',
        step1Desc: 'พิมพ์สิ่งที่ต้องการเหมือนพูดกับเพื่อน',
        step2Title: 'AI วิเคราะห์',
        step2Desc: 'AI แปลความต้องการและค้นหาให้',
        step3Title: 'ผลลัพธ์เฉพาะคุณ',
        step3Desc: 'ได้ผลลัพธ์ที่ตรงใจที่สุด',
        exampleQueries: 'ตัวอย่างการค้นหา',
        noResults: 'ไม่พบผลลัพธ์',
        tryDifferent: 'ลองค้นหาด้วยคำอื่น',
        filters: 'ตัวกรอง',
        price: 'ราคา',
        location: 'ตำแหน่ง',
        condition: 'สภาพ',
        category: 'หมวดหมู่',
    },
    en: {
        title: 'Smart Search',
        subtitle: 'AI-powered search - Type naturally or use a photo',
        searchPlaceholder: 'Search anything like "iPhone good condition near me under 15,000"',
        voiceSearch: 'Voice Search',
        imageSearch: 'Image Search',
        searchBtn: 'Search',
        recentSearches: 'Recent Searches',
        trendingSearches: 'Trending',
        aiSuggestions: 'AI Suggestions for You',
        howItWorks: 'How Smart Search Works',
        step1Title: 'Type Naturally',
        step1Desc: 'Type what you want like talking to a friend',
        step2Title: 'AI Analyzes',
        step2Desc: 'AI understands and searches for you',
        step3Title: 'Personalized Results',
        step3Desc: 'Get the most relevant results',
        exampleQueries: 'Example Queries',
        noResults: 'No results found',
        tryDifferent: 'Try a different search',
        filters: 'Filters',
        price: 'Price',
        location: 'Location',
        condition: 'Condition',
        category: 'Category',
    }
}

const exampleQueries = {
    th: [
        'iPhone 15 Pro Max สีดำ สภาพดี งบไม่เกิน 35,000',
        'รถมอเตอร์ไซค์ Honda Wave ปี 2020 ขึ้นไป',
        'กล้อง Mirrorless สำหรับมือใหม่ ราคาถูก',
        'MacBook Air M2 มือสอง กรุงเทพ',
        'เฟอร์นิเจอร์สำนักงาน โต๊ะทำงาน เก้าอี้',
        'PS5 พร้อมเกม ประกันเหลือ',
    ],
    en: [
        'iPhone 15 Pro Max black good condition under 35,000',
        'Honda Wave motorcycle year 2020 or newer',
        'Mirrorless camera for beginners cheap',
        'MacBook Air M2 secondhand Bangkok',
        'Office furniture desk chair',
        'PS5 with games warranty remaining',
    ]
}

const recentSearchesMock = [
    'iPhone 14 สภาพดี',
    'รถยนต์มือสอง กรุงเทพ',
    'Nike Air Jordan 1',
    'แอร์ Inverter ราคาถูก',
]

const trendingMock = [
    { query: 'iPhone 15', count: '2.4K' },
    { query: 'PS5', count: '1.8K' },
    { query: 'MacBook M3', count: '1.2K' },
    { query: 'รถยนต์ไฟฟ้า EV', count: '980' },
    { query: 'กล้อง Sony A7', count: '750' },
]

export default function AISearchPage() {
    const { language } = useLanguage()
    const t = translations[language as 'th' | 'en'] || translations.th
    const examples = exampleQueries[language as 'th' | 'en'] || exampleQueries.th

    const [searchQuery, setSearchQuery] = useState('')
    const [isSearching, setIsSearching] = useState(false)
    const [showResults, setShowResults] = useState(false)

    const handleSearch = () => {
        if (!searchQuery.trim()) return
        setIsSearching(true)
        // Simulate AI search
        setTimeout(() => {
            setIsSearching(false)
            setShowResults(true)
        }, 1500)
    }

    const handleExampleClick = (query: string) => {
        setSearchQuery(query)
    }

    return (
        <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-bg-dark">
            <Header />
            <main className="flex-1">
                {/* Hero Section */}
                <section className="relative py-16 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 overflow-hidden">
                    <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
                    <div className="container mx-auto px-4 relative z-10">
                        <div className="text-center mb-8">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-white mb-4">
                                <Sparkles className="w-4 h-4" />
                                <span className="text-sm font-medium">AI-Powered</span>
                            </div>
                            <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
                                🔍 {t.title}
                            </h1>
                            <p className="text-lg text-white/80 max-w-2xl mx-auto">
                                {t.subtitle}
                            </p>
                        </div>

                        {/* Search Box */}
                        <div className="max-w-3xl mx-auto">
                            <div className="bg-white dark:bg-surface-dark rounded-2xl shadow-2xl p-2">
                                <div className="flex items-center gap-2">
                                    <div className="flex-1 relative">
                                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <input
                                            type="text"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                            placeholder={t.searchPlaceholder}
                                            className="w-full pl-12 pr-4 py-4 rounded-xl bg-gray-50 dark:bg-gray-800 border-0 focus:ring-2 focus:ring-purple-500 text-gray-900 dark:text-white"
                                        />
                                    </div>
                                    <button className="p-3 rounded-xl bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors" title={t.voiceSearch}>
                                        <Mic className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                                    </button>
                                    <button className="p-3 rounded-xl bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors" title={t.imageSearch}>
                                        <Camera className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                                    </button>
                                    <Button
                                        onClick={handleSearch}
                                        disabled={isSearching}
                                        className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:opacity-90 transition-opacity flex items-center gap-2"
                                    >
                                        {isSearching ? (
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        ) : (
                                            <>
                                                {t.searchBtn}
                                                <ArrowRight className="w-4 h-4" />
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </div>

                            {/* Quick Filters */}
                            <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
                                <button className="px-3 py-1.5 rounded-full bg-white/10 text-white text-sm flex items-center gap-1 hover:bg-white/20 transition-colors">
                                    <Tag className="w-3 h-3" /> {t.category}
                                </button>
                                <button className="px-3 py-1.5 rounded-full bg-white/10 text-white text-sm flex items-center gap-1 hover:bg-white/20 transition-colors">
                                    <MapPin className="w-3 h-3" /> {t.location}
                                </button>
                                <button className="px-3 py-1.5 rounded-full bg-white/10 text-white text-sm flex items-center gap-1 hover:bg-white/20 transition-colors">
                                    <span>฿</span> {t.price}
                                </button>
                                <button className="px-3 py-1.5 rounded-full bg-white/10 text-white text-sm flex items-center gap-1 hover:bg-white/20 transition-colors">
                                    <Star className="w-3 h-3" /> {t.condition}
                                </button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Recent & Trending */}
                <section className="py-12">
                    <div className="container mx-auto px-4">
                        <div className="grid md:grid-cols-2 gap-8">
                            {/* Recent Searches */}
                            <div className="bg-white dark:bg-surface-dark rounded-2xl p-6 shadow-sm">
                                <div className="flex items-center gap-2 mb-4">
                                    <History className="w-5 h-5 text-gray-500" />
                                    <h3 className="font-bold text-lg">{t.recentSearches}</h3>
                                </div>
                                <div className="space-y-2">
                                    {recentSearchesMock.map((query, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => handleExampleClick(query)}
                                            className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex items-center gap-3"
                                        >
                                            <Clock className="w-4 h-4 text-gray-400" />
                                            <span className="text-gray-700 dark:text-gray-300">{query}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Trending */}
                            <div className="bg-white dark:bg-surface-dark rounded-2xl p-6 shadow-sm">
                                <div className="flex items-center gap-2 mb-4">
                                    <TrendingUp className="w-5 h-5 text-pink-500" />
                                    <h3 className="font-bold text-lg">{t.trendingSearches}</h3>
                                </div>
                                <div className="space-y-2">
                                    {trendingMock.map((item, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => handleExampleClick(item.query)}
                                            className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex items-center justify-between"
                                        >
                                            <div className="flex items-center gap-3">
                                                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${idx < 3 ? 'bg-pink-100 text-pink-600' : 'bg-gray-100 text-gray-500'}`}>
                                                    {idx + 1}
                                                </span>
                                                <span className="text-gray-700 dark:text-gray-300">{item.query}</span>
                                            </div>
                                            <span className="text-xs text-gray-400">{item.count} searches</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Example Queries */}
                <section className="py-12 bg-white dark:bg-surface-dark">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-8">
                            <h2 className="text-2xl font-bold mb-2">{t.exampleQueries}</h2>
                            <p className="text-gray-500">{t.subtitle}</p>
                        </div>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
                            {examples.map((query, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => handleExampleClick(query)}
                                    className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-purple-500 dark:hover:border-purple-500 hover:shadow-md transition-all text-left group"
                                >
                                    <div className="flex items-start gap-3">
                                        <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30 group-hover:bg-purple-200 dark:group-hover:bg-purple-900/50 transition-colors">
                                            <Search className="w-4 h-4 text-purple-600" />
                                        </div>
                                        <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2">
                                            "{query}"
                                        </p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                </section>

                {/* How It Works */}
                <section className="py-16">
                    <div className="container mx-auto px-4">
                        <h2 className="text-2xl font-bold text-center mb-12">{t.howItWorks}</h2>
                        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                            <div className="text-center">
                                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white text-2xl mx-auto mb-4">
                                    💬
                                </div>
                                <h3 className="font-bold text-lg mb-2">{t.step1Title}</h3>
                                <p className="text-gray-500">{t.step1Desc}</p>
                            </div>
                            <div className="text-center">
                                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-2xl mx-auto mb-4">
                                    🤖
                                </div>
                                <h3 className="font-bold text-lg mb-2">{t.step2Title}</h3>
                                <p className="text-gray-500">{t.step2Desc}</p>
                            </div>
                            <div className="text-center">
                                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center text-white text-2xl mx-auto mb-4">
                                    🎯
                                </div>
                                <h3 className="font-bold text-lg mb-2">{t.step3Title}</h3>
                                <p className="text-gray-500">{t.step3Desc}</p>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    )
}
