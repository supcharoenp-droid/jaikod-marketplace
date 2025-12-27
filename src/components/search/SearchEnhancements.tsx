'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
    Clock, Search, X, TrendingUp, Sparkles, MapPin,
    BadgeCheck, Tag, Map, Grid3X3, ChevronRight, Flame,
    Star, Lightbulb, ArrowRight
} from 'lucide-react'

// ==========================================
// BRAND LOGOS DATA
// ==========================================

export const BRAND_LOGOS: Record<string, { logo: string; color: string }> = {
    // Automotive
    toyota: { logo: '🚗', color: 'bg-red-50 text-red-600' },
    honda: { logo: '🏍️', color: 'bg-red-50 text-red-700' },
    mazda: { logo: '🔴', color: 'bg-gray-50 text-gray-800' },
    nissan: { logo: '🚙', color: 'bg-gray-100 text-gray-700' },
    mitsubishi: { logo: '🔻', color: 'bg-red-50 text-red-600' },
    ford: { logo: '🔵', color: 'bg-blue-50 text-blue-700' },
    isuzu: { logo: '🛻', color: 'bg-red-50 text-red-600' },
    mg: { logo: '🇬🇧', color: 'bg-red-50 text-red-600' },
    bmw: { logo: '🔵⚪', color: 'bg-blue-50 text-blue-600' },
    mercedes: { logo: '⭐', color: 'bg-gray-100 text-gray-800' },

    // Mobile/Tech
    apple: { logo: '🍎', color: 'bg-gray-100 text-gray-800' },
    samsung: { logo: '🔷', color: 'bg-blue-50 text-blue-600' },
    oppo: { logo: '🟢', color: 'bg-green-50 text-green-600' },
    vivo: { logo: '🔵', color: 'bg-blue-50 text-blue-500' },
    xiaomi: { logo: '🟠', color: 'bg-orange-50 text-orange-500' },
    huawei: { logo: '🔴', color: 'bg-red-50 text-red-500' },
    realme: { logo: '🟡', color: 'bg-yellow-50 text-yellow-600' },
    google: { logo: '🔍', color: 'bg-blue-50 text-blue-600' },

    // Computers
    asus: { logo: '💻', color: 'bg-blue-50 text-blue-600' },
    dell: { logo: '🖥️', color: 'bg-blue-50 text-blue-700' },
    hp: { logo: '🔵', color: 'bg-blue-50 text-blue-600' },
    lenovo: { logo: '🔴', color: 'bg-red-50 text-red-600' },
    acer: { logo: '🟢', color: 'bg-green-50 text-green-600' },
    msi: { logo: '🐉', color: 'bg-red-50 text-red-600' },

    // Gaming
    sony: { logo: '🎮', color: 'bg-blue-50 text-blue-600' },
    nintendo: { logo: '🕹️', color: 'bg-red-50 text-red-500' },
    microsoft: { logo: '🟩', color: 'bg-green-50 text-green-600' },
    razer: { logo: '🐍', color: 'bg-green-50 text-green-500' },
    logitech: { logo: '🎯', color: 'bg-blue-50 text-blue-600' },

    // Fashion
    nike: { logo: '✓', color: 'bg-gray-100 text-gray-800' },
    adidas: { logo: '⚡', color: 'bg-gray-100 text-gray-800' },
    converse: { logo: '⭐', color: 'bg-gray-100 text-gray-700' },
    vans: { logo: '🛹', color: 'bg-gray-100 text-gray-800' },
    uniqlo: { logo: '🔴', color: 'bg-red-50 text-red-600' },
    gucci: { logo: '👜', color: 'bg-green-50 text-green-700' },

    // Cameras
    canon: { logo: '📷', color: 'bg-red-50 text-red-600' },
    nikon: { logo: '📸', color: 'bg-yellow-50 text-yellow-600' },
    fujifilm: { logo: '🎞️', color: 'bg-green-50 text-green-600' },
    panasonic: { logo: '📹', color: 'bg-blue-50 text-blue-600' },
    gopro: { logo: '🎬', color: 'bg-blue-50 text-blue-500' },
}

// ==========================================
// BRAND FILTER WITH LOGOS
// ==========================================

interface BrandWithLogosProps {
    detectedBrand?: string
    selectedBrand: string
    onBrandChange: (brand: string) => void
    categorySlug?: string
    language?: 'th' | 'en'
}

// Get brands by category with logos
const CATEGORY_BRANDS: Record<string, string[]> = {
    automotive: ['toyota', 'honda', 'mazda', 'nissan', 'mitsubishi', 'ford', 'isuzu', 'mg', 'bmw', 'mercedes'],
    mobiles: ['apple', 'samsung', 'oppo', 'vivo', 'xiaomi', 'huawei', 'realme', 'google'],
    computers: ['apple', 'asus', 'dell', 'hp', 'lenovo', 'acer', 'msi'],
    gaming: ['sony', 'nintendo', 'microsoft', 'razer', 'logitech'],
    fashion: ['nike', 'adidas', 'converse', 'vans', 'uniqlo', 'gucci'],
    cameras: ['canon', 'nikon', 'sony', 'fujifilm', 'panasonic', 'gopro'],
}

const BRAND_DISPLAY_NAMES: Record<string, string> = {
    toyota: 'Toyota', honda: 'Honda', mazda: 'Mazda', nissan: 'Nissan',
    mitsubishi: 'Mitsubishi', ford: 'Ford', isuzu: 'Isuzu', mg: 'MG',
    bmw: 'BMW', mercedes: 'Mercedes-Benz', apple: 'Apple', samsung: 'Samsung',
    oppo: 'OPPO', vivo: 'Vivo', xiaomi: 'Xiaomi', huawei: 'Huawei',
    realme: 'Realme', google: 'Google Pixel', asus: 'ASUS', dell: 'Dell',
    hp: 'HP', lenovo: 'Lenovo', acer: 'Acer', msi: 'MSI',
    sony: 'PlayStation', nintendo: 'Nintendo', microsoft: 'Xbox',
    razer: 'Razer', logitech: 'Logitech', nike: 'Nike', adidas: 'Adidas',
    converse: 'Converse', vans: 'Vans', uniqlo: 'Uniqlo', gucci: 'Gucci',
    canon: 'Canon', nikon: 'Nikon', fujifilm: 'Fujifilm', panasonic: 'Panasonic',
    gopro: 'GoPro'
}

export function BrandFilterWithLogos({
    detectedBrand,
    selectedBrand,
    onBrandChange,
    categorySlug,
    language = 'th'
}: BrandWithLogosProps) {
    // Get brands for current category or show all popular
    const categoryBrands = categorySlug && CATEGORY_BRANDS[categorySlug]
        ? CATEGORY_BRANDS[categorySlug]
        : ['toyota', 'honda', 'apple', 'samsung', 'nike', 'sony', 'canon', 'bmw']

    // Sort detected brand first
    const sortedBrands = detectedBrand
        ? [
            ...categoryBrands.filter(b => b.toLowerCase() === detectedBrand.toLowerCase()),
            ...categoryBrands.filter(b => b.toLowerCase() !== detectedBrand.toLowerCase())
        ]
        : categoryBrands

    return (
        <div className="space-y-3">
            {/* AI Detected Brand */}
            {detectedBrand && (
                <div className="p-3 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl border border-purple-200 dark:border-purple-800">
                    <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-purple-500" />
                        <span className="text-xs font-medium text-purple-700 dark:text-purple-300">
                            🤖 AI ตรวจพบแบรนด์
                        </span>
                    </div>
                    <div className="mt-2 flex items-center gap-2">
                        <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-lg ${BRAND_LOGOS[detectedBrand.toLowerCase()]?.color || 'bg-gray-100'}`}>
                            {BRAND_LOGOS[detectedBrand.toLowerCase()]?.logo || '🏷️'}
                        </span>
                        <span className="font-bold text-gray-900 dark:text-white">
                            {BRAND_DISPLAY_NAMES[detectedBrand.toLowerCase()] || detectedBrand.toUpperCase()}
                        </span>
                    </div>
                </div>
            )}

            {/* Brands Grid with Logos */}
            <div className="grid grid-cols-2 gap-2">
                {sortedBrands.map(brandKey => {
                    const brandData = BRAND_LOGOS[brandKey]
                    const isSelected = selectedBrand.toLowerCase() === brandKey

                    return (
                        <button
                            key={brandKey}
                            onClick={() => onBrandChange(isSelected ? '' : brandKey)}
                            className={`flex items-center gap-2 p-2.5 rounded-xl text-sm transition-all ${isSelected
                                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg scale-[1.02]'
                                : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-purple-300 hover:shadow-md hover:scale-[1.01]'
                                }`}
                        >
                            <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-base ${isSelected ? 'bg-white/20' : brandData?.color || 'bg-gray-100'}`}>
                                {brandData?.logo || '🏷️'}
                            </span>
                            <span className="font-medium truncate">
                                {BRAND_DISPLAY_NAMES[brandKey] || brandKey}
                            </span>
                        </button>
                    )
                })}
            </div>

            {/* Clear Button */}
            {selectedBrand && (
                <button
                    onClick={() => onBrandChange('')}
                    className="w-full text-center text-xs text-gray-500 hover:text-red-500 py-2"
                >
                    <X className="w-3 h-3 inline mr-1" />
                    ล้างตัวกรองแบรนด์
                </button>
            )}
        </div>
    )
}

// ==========================================
// QUICK FILTER CHIPS
// ==========================================

interface QuickFilter {
    id: string
    label: string
    icon: React.ElementType
    color: string
    filter: {
        key: string
        value: any
    }
}

const QUICK_FILTERS: QuickFilter[] = [
    { id: 'nearby', label: '📍 ใกล้ฉัน', icon: MapPin, color: 'bg-blue-50 text-blue-600 border-blue-200', filter: { key: 'nearby', value: true } },
    { id: 'verified', label: '✓ Verified', icon: BadgeCheck, color: 'bg-green-50 text-green-600 border-green-200', filter: { key: 'verified', value: true } },
    { id: 'new', label: '✨ สินค้าใหม่', icon: Sparkles, color: 'bg-pink-50 text-pink-600 border-pink-200', filter: { key: 'condition', value: 'new' } },
    { id: 'hot', label: '🔥 ยอดนิยม', icon: Flame, color: 'bg-orange-50 text-orange-600 border-orange-200', filter: { key: 'hot', value: true } },
    { id: 'under5k', label: '💰 ต่ำกว่า 5,000', icon: Tag, color: 'bg-emerald-50 text-emerald-600 border-emerald-200', filter: { key: 'max_price', value: 5000 } },
]

interface QuickFilterChipsProps {
    activeFilters: string[]
    onToggleFilter: (filterId: string, filterKey: string, filterValue: any) => void
    language?: 'th' | 'en'
}

export function QuickFilterChips({
    activeFilters,
    onToggleFilter,
    language = 'th'
}: QuickFilterChipsProps) {
    return (
        <div className="flex flex-wrap gap-2 mb-4">
            {QUICK_FILTERS.map(filter => {
                const isActive = activeFilters.includes(filter.id)
                return (
                    <button
                        key={filter.id}
                        onClick={() => onToggleFilter(filter.id, filter.filter.key, filter.filter.value)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${isActive
                                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white border-transparent shadow-md'
                                : filter.color + ' hover:shadow-sm'
                            }`}
                    >
                        {filter.label}
                    </button>
                )
            })}
        </div>
    )
}

// ==========================================
// SEARCH HISTORY
// ==========================================

interface SearchHistoryProps {
    onSearchClick: (query: string) => void
    language?: 'th' | 'en'
}

export function SearchHistory({ onSearchClick, language = 'th' }: SearchHistoryProps) {
    const [history, setHistory] = useState<string[]>([])
    const [trending, setTrending] = useState<string[]>([
        'iPhone 15', 'รถมือสอง', 'PlayStation 5', 'MacBook', 'Honda Click', 'คอนโดให้เช่า'
    ])

    useEffect(() => {
        // Load history from localStorage
        try {
            const saved = localStorage.getItem('jaikod_search_history')
            if (saved) {
                setHistory(JSON.parse(saved).slice(0, 5))
            }
        } catch (e) {
            console.error('Failed to load search history:', e)
        }
    }, [])

    const clearHistory = () => {
        localStorage.removeItem('jaikod_search_history')
        setHistory([])
    }

    if (history.length === 0 && trending.length === 0) return null

    return (
        <div className="mb-6 p-4 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700">
            {/* Recent Searches */}
            {history.length > 0 && (
                <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
                            <Clock className="w-4 h-4 text-gray-400" />
                            ค้นหาล่าสุด
                        </h4>
                        <button
                            onClick={clearHistory}
                            className="text-xs text-gray-400 hover:text-red-500"
                        >
                            ล้าง
                        </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {history.map((term, idx) => (
                            <button
                                key={idx}
                                onClick={() => onSearchClick(term)}
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 dark:bg-gray-700 rounded-full text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                            >
                                <Search className="w-3 h-3 text-gray-400" />
                                {term}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Trending Searches */}
            <div>
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1.5 mb-2">
                    <TrendingUp className="w-4 h-4 text-orange-500" />
                    กำลังเป็นที่นิยม
                </h4>
                <div className="flex flex-wrap gap-2">
                    {trending.map((term, idx) => (
                        <button
                            key={idx}
                            onClick={() => onSearchClick(term)}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-50 dark:bg-orange-900/20 rounded-full text-sm text-orange-600 dark:text-orange-400 hover:bg-orange-100 dark:hover:bg-orange-900/30 transition-colors"
                        >
                            <Flame className="w-3 h-3" />
                            {term}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    )
}

// ==========================================
// AI RECOMMENDATIONS BANNER
// ==========================================

interface AIRecommendationProps {
    query: string
    detectedBrand?: string
    detectedCategory?: string
    suggestedFilters?: string[]
    onSuggestionClick?: (suggestion: string) => void
    language?: 'th' | 'en'
}

export function AIRecommendationBanner({
    query,
    detectedBrand,
    detectedCategory,
    suggestedFilters = [],
    onSuggestionClick,
    language = 'th'
}: AIRecommendationProps) {
    if (!detectedBrand && !detectedCategory && suggestedFilters.length === 0) {
        return null
    }

    return (
        <div className="mb-4 p-4 bg-gradient-to-r from-purple-50 via-pink-50 to-blue-50 dark:from-purple-900/20 dark:via-pink-900/20 dark:to-blue-900/20 rounded-2xl border border-purple-200 dark:border-purple-800">
            <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Lightbulb className="w-5 h-5 text-white" />
                </div>

                <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-purple-800 dark:text-purple-200 mb-1">
                        🤖 AI วิเคราะห์การค้นหา
                    </h4>

                    <p className="text-sm text-purple-700 dark:text-purple-300">
                        {detectedBrand && (
                            <>ค้นหา <strong>{detectedBrand}</strong> </>
                        )}
                        {detectedCategory && (
                            <>ในหมวด <strong>{detectedCategory}</strong> </>
                        )}
                    </p>

                    {/* Suggestions */}
                    {suggestedFilters.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-2">
                            <span className="text-xs text-purple-600 dark:text-purple-400">
                                ลองค้นหา:
                            </span>
                            {suggestedFilters.slice(0, 4).map((suggestion, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => onSuggestionClick?.(suggestion)}
                                    className="flex items-center gap-1 px-2 py-1 bg-white dark:bg-gray-800 rounded-full text-xs text-purple-600 dark:text-purple-400 hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors border border-purple-200 dark:border-purple-700"
                                >
                                    {suggestion}
                                    <ArrowRight className="w-3 h-3" />
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

// ==========================================
// VIEW MODE TOGGLE WITH MAP
// ==========================================

interface ViewModeToggleProps {
    currentMode: 'grid' | 'list' | 'map'
    onModeChange: (mode: 'grid' | 'list' | 'map') => void
    language?: 'th' | 'en'
}

export function ViewModeToggle({
    currentMode,
    onModeChange,
    language = 'th'
}: ViewModeToggleProps) {
    return (
        <div className="flex items-center gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl">
            <button
                onClick={() => onModeChange('grid')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${currentMode === 'grid'
                        ? 'bg-white dark:bg-gray-700 text-purple-600 shadow-sm'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
            >
                <Grid3X3 className="w-4 h-4" />
                <span className="hidden sm:inline">Grid</span>
            </button>

            <button
                onClick={() => onModeChange('list')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${currentMode === 'list'
                        ? 'bg-white dark:bg-gray-700 text-purple-600 shadow-sm'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
            >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                <span className="hidden sm:inline">List</span>
            </button>

            <button
                onClick={() => onModeChange('map')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${currentMode === 'map'
                        ? 'bg-white dark:bg-gray-700 text-purple-600 shadow-sm'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
            >
                <Map className="w-4 h-4" />
                <span className="hidden sm:inline">
                    {language === 'th' ? 'แผนที่' : 'Map'}
                </span>
            </button>
        </div>
    )
}

// ==========================================
// SAVE SEARCH TO HISTORY
// ==========================================

export function saveSearchToHistory(query: string) {
    if (!query.trim()) return

    try {
        const saved = localStorage.getItem('jaikod_search_history')
        let history: string[] = saved ? JSON.parse(saved) : []

        // Remove duplicate and add to front
        history = [query, ...history.filter(h => h.toLowerCase() !== query.toLowerCase())]

        // Keep only last 10
        history = history.slice(0, 10)

        localStorage.setItem('jaikod_search_history', JSON.stringify(history))
    } catch (e) {
        console.error('Failed to save search history:', e)
    }
}
