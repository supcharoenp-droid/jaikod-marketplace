'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
    Search, MapPin, TrendingUp, Clock,
    Sparkles, X, ChevronRight, Tag, Zap
} from 'lucide-react'
import { useOnClickOutside } from '@/hooks/useOnClickOutside'
import { CATEGORIES } from '@/constants/categories'
import { trackSearch } from '@/services/behaviorTracking'
import { getUserLocation, formatDistance, calculateDistance } from '@/lib/geolocation'
import { useLanguage } from '@/contexts/LanguageContext'

// Mock Data for "AI Suggestions"
const TRENDING_SEARCHES = [
    "iPhone 15 Pro Max",
    "PS5 มือสอง",
    "กล้องฟิล์ม",
    "รองเท้า Nike Dunk",
    "เสื้อผ้า Vintage",
    "iPad Air 5"
]

const QUICK_FILTERS = [
    { id: 'near_me', key: 'quick_filter_near', icon: MapPin, color: 'text-red-500' },
    { id: 'lowest_price', key: 'quick_filter_lowest', icon: Tag, color: 'text-blue-500' },
    { id: 'ai_choice', key: 'quick_filter_ai', icon: Sparkles, color: 'text-purple-500' },
    { id: 'new_arrival', key: 'quick_filter_new', icon: Clock, color: 'text-green-500' },
    { id: 'hot', key: 'quick_filter_hot', icon: TrendingUp, color: 'text-orange-500' },
]

export default function SmartSearch() {
    const router = useRouter()
    const { t, language } = useLanguage()
    const [query, setQuery] = useState('')
    const [isOpen, setIsOpen] = useState(false)
    const [recentSearches, setRecentSearches] = useState<string[]>([])
    const [location, setLocation] = useState<{ lat: number, lng: number } | null>(null)
    const containerRef = useRef<HTMLDivElement>(null)

    useOnClickOutside(containerRef, () => setIsOpen(false))

    useEffect(() => {
        // Load recent searches
        const saved = localStorage.getItem('jaikod_recent_searches')
        if (saved) {
            setRecentSearches(JSON.parse(saved).slice(0, 5))
        }

        // Get generic location for UI feedback
        getUserLocation().then(loc => {
            if (loc) setLocation({ lat: loc.latitude, lng: loc.longitude })
        })
    }, [])

    const handleSearch = (searchQuery: string) => {
        if (!searchQuery.trim()) return

        // Save to recent
        const newRecent = [searchQuery, ...recentSearches.filter(s => s !== searchQuery)].slice(0, 5)
        setRecentSearches(newRecent)
        localStorage.setItem('jaikod_recent_searches', JSON.stringify(newRecent))

        // Track
        trackSearch(searchQuery, 0) // We don't know count yet

        setIsOpen(false)
        router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
    }

    const handleQuickFilter = (filterId: string) => {
        let url = '/search?'
        switch (filterId) {
            case 'near_me':
                url += 'sort=distance'
                break
            case 'lowest_price':
                url += 'sort=price_asc'
                break
            case 'new_arrival':
                url += 'sort=newest'
                break
            case 'hot':
                url += 'sort=popular'
                break
            case 'ai_choice':
                url += 'sort=recommended'
                break
        }
        router.push(url)
    }

    const matchedCategories = query
        ? CATEGORIES.filter(c =>
            c.name_th.toLowerCase().includes(query.toLowerCase()) ||
            c.name_en.toLowerCase().includes(query.toLowerCase())
        ).slice(0, 3)
        : []

    return (
        <div className="w-full max-w-2xl mx-auto relative z-50" ref={containerRef}>
            {/* Search Input Bar */}
            <div className={`
                relative flex items-center bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl 
                border transition-all duration-300 shadow-lg
                ${isOpen
                    ? 'rounded-t-3xl border-purple-500/30'
                    : 'rounded-full border-white/20 hover:border-purple-500/30 hover:shadow-purple-500/10'
                }
            `}>
                <div className="pl-6 text-gray-400">
                    <Search className={`w-5 h-5 ${isOpen ? 'text-purple-600' : ''}`} />
                </div>

                <input
                    type="text"
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value)
                        setIsOpen(true)
                    }}
                    onFocus={() => setIsOpen(true)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch(query)}
                    placeholder={t('smart_search.placeholder')}
                    className="w-full bg-transparent border-none outline-none px-4 py-4 text-base lg:text-lg text-gray-800 dark:text-gray-100 placeholder:text-gray-400"
                />

                {/* Clear Button */}
                {query && (
                    <button
                        onClick={() => {
                            setQuery('')
                            setIsOpen(true)
                        }}
                        className="p-2 mr-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full text-gray-400"
                    >
                        <X className="w-4 h-4" />
                    </button>
                )}

                {/* Search Button */}
                <button
                    onClick={() => handleSearch(query)}
                    className="mr-2 px-6 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-full font-medium shadow-md shadow-purple-500/20 transition-all hover:scale-105 active:scale-95"
                >
                    {t('smart_search.search_btn')}
                </button>
            </div>

            {/* Dropdown Suggestions */}
            {isOpen && (
                <div className="absolute top-full left-0 right-0 bg-white dark:bg-gray-800 rounded-b-3xl border-x border-b border-gray-100 dark:border-gray-700 shadow-2xl overflow-hidden divide-y divide-gray-100 dark:divide-gray-700 animate-in fade-in slide-in-from-top-2 duration-200">

                    {/* 1. Category Matches (if typing) */}
                    {matchedCategories.length > 0 && (
                        <div className="p-2 bg-purple-50/50 dark:bg-purple-900/10">
                            {matchedCategories.map(cat => (
                                <div
                                    key={cat.id}
                                    onClick={() => handleSearch(cat.name_th)}
                                    className="flex items-center gap-3 p-3 hover:bg-white dark:hover:bg-gray-700 rounded-xl cursor-pointer transition-colors group"
                                >
                                    <span className="text-2xl">{cat.icon}</span>
                                    <div className="flex-1">
                                        <div className="font-medium text-purple-900 dark:text-purple-100">
                                            {t('smart_search.search_in_cat')} "{language === 'th' ? cat.name_th : cat.name_en}"
                                        </div>
                                        <div className="text-xs text-purple-500 dark:text-purple-400">
                                            Category
                                        </div>
                                    </div>
                                    <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-purple-500" />
                                </div>
                            ))}
                        </div>
                    )}

                    {!query && (
                        <>
                            {/* 2. Recent Searches */}
                            {recentSearches.length > 0 && (
                                <div className="p-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <h3 className="text-sm font-semibold text-gray-400 flex items-center gap-2">
                                            <Clock className="w-4 h-4" /> {t('smart_search.recent_searches')}
                                        </h3>
                                        <button
                                            onClick={() => {
                                                setRecentSearches([])
                                                localStorage.removeItem('jaikod_recent_searches')
                                            }}
                                            className="text-xs text-gray-400 hover:text-red-500"
                                        >
                                            {t('smart_search.clear_history')}
                                        </button>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {recentSearches.map((s, i) => (
                                            <button
                                                key={i}
                                                onClick={() => handleSearch(s)}
                                                className="px-3 py-1.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg text-sm transition-colors text-gray-700 dark:text-gray-300"
                                            >
                                                {s}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* 3. Trending Now */}
                            <div className="p-4">
                                <h3 className="text-sm font-semibold text-gray-400 mb-3 flex items-center gap-2">
                                    <TrendingUp className="w-4 h-4 text-rose-500" /> {t('smart_search.trending_searches')}
                                </h3>
                                <div className="space-y-1">
                                    {TRENDING_SEARCHES.map((s, i) => (
                                        <div
                                            key={i}
                                            onClick={() => handleSearch(s)}
                                            className="flex items-center justify-between p-2 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg cursor-pointer group"
                                        >
                                            <div className="flex items-center gap-3">
                                                <span className={`
                                                    w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold
                                                    ${i < 3 ? 'bg-orange-100 text-orange-600' : 'bg-gray-100 text-gray-500'}
                                                `}>
                                                    {i + 1}
                                                </span>
                                                <span className="text-gray-700 dark:text-gray-200 group-hover:text-purple-600 transition-colors">
                                                    {s}
                                                </span>
                                            </div>
                                            {i < 3 && <span className="text-xs text-rose-500 font-medium flex items-center gap-1"><Zap className="w-3 h-3" /> มาแรง</span>}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </>
                    )}
                </div>
            )}

            {/* Quick Filters / Chips */}
            <div className="flex items-center justify-center gap-2 mt-6 flex-wrap">
                {QUICK_FILTERS.map((f) => (
                    <button
                        key={f.id}
                        onClick={() => handleQuickFilter(f.id)}
                        className="
                            flex items-center gap-1.5 px-4 py-2 rounded-full 
                            bg-white/40 dark:bg-black/20 border border-white/20 backdrop-blur-md 
                            hover:bg-white hover:shadow-lg hover:-translate-y-1 
                            transition-all duration-300 text-sm font-medium text-gray-700 dark:text-gray-200
                        "
                    >
                        <f.icon className={`w-3.5 h-3.5 ${f.color}`} />
                        {t(`smart_search.${f.key}`)}
                    </button>
                ))}
            </div>
        </div>
    )
}
