'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import ProductCard from '@/components/product/ProductCard'
import InfiniteScroll from '@/components/ui/InfiniteScroll'
import { CATEGORIES } from '@/constants/categories'
import { Product } from '@/types'
import {
    Search, SlidersHorizontal, X, ChevronDown, Sparkles, MapPin,
    ArrowUpDown, Filter, XCircle, ChevronRight, Home
} from 'lucide-react'
import Button from '@/components/ui/Button'
import { trackSearch } from '@/services/behaviorTracking'
import { getAllProducts } from '@/services/productService'
import { calculateDistanceToProduct } from '@/lib/geolocation'
import { useLanguage } from '@/contexts/LanguageContext'

interface SmartFilter {
    id: string
    labelKey: string
    icon?: React.ElementType
    type: 'sort' | 'filter' | 'ai'
    value: any
}

function SearchContent() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const { t, language } = useLanguage()

    // URL Params
    const query = searchParams.get('q') || ''
    const categorySlug = searchParams.get('category') || ''

    // State
    const [searchQuery, setSearchQuery] = useState(query)
    const [results, setResults] = useState<Product[]>([])
    const [loading, setLoading] = useState(false)
    const [showMobileFilters, setShowMobileFilters] = useState(false)
    const [hasMore, setHasMore] = useState(true)
    const [page, setPage] = useState(1)

    // Active Filters State
    const [selectedCategory, setSelectedCategory] = useState(categorySlug)
    const [priceRange, setPriceRange] = useState({ min: '', max: '' })
    const [sortMode, setSortMode] = useState<'ai_hybrid' | 'nearest' | 'price_asc' | 'price_desc' | 'newest'>('ai_hybrid')
    const [maxDistance, setMaxDistance] = useState<number | null>(null) // km

    // AI & Dynamic Data
    const [relatedKeywords, setRelatedKeywords] = useState<string[]>([])

    // Smart Chips (AI Suggested)
    const smartFilters: SmartFilter[] = [
        { id: 'ai', labelKey: 'sort_ai_recommended', icon: Sparkles, type: 'sort', value: 'ai_hybrid' },
        { id: 'near_10', labelKey: 'sort_nearest', icon: MapPin, type: 'filter', value: 10 },
        { id: 'price_low', labelKey: 'sort_price_asc', icon: ArrowUpDown, type: 'sort', value: 'price_asc' },
        { id: 'newest', labelKey: 'sort_newest', icon: Sparkles, type: 'sort', value: 'newest' },
    ]

    useEffect(() => {
        // Mock AI "Rewrite Search" or Related Keywords
        if (query) {
            setRelatedKeywords([
                `${query} pro`,
                `${query} max`,
                `used ${query}`,
                `cheap ${query}`
            ])
        }
    }, [query])

    // Update derived states when URL changes
    useEffect(() => {
        if (searchQuery !== query) setSearchQuery(query)
        if (categorySlug !== selectedCategory && !loading) setSelectedCategory(categorySlug)
    }, [query, categorySlug])

    // Main Search Logic
    const performSearch = async (isLoadMore = false) => {
        if (!isLoadMore) {
            setLoading(true)
            setResults([])
            setPage(1)
        }

        try {
            // Simulate API Latency & Fetch
            await new Promise(r => setTimeout(r, 600))
            const allProducts = await getAllProducts(50)
            let filtered = [...allProducts]

            // 1. Text Search
            if (query) {
                const lowerQuery = query.toLowerCase()
                filtered = filtered.filter(p =>
                    p.title.toLowerCase().includes(lowerQuery) ||
                    p.description.toLowerCase().includes(lowerQuery) ||
                    (p.location_province?.includes(query))
                )
            }

            // 2. Category Filter
            if (selectedCategory) {
                const category = CATEGORIES.find(c => c.slug === selectedCategory)
                if (category) {
                    filtered = filtered.filter(p => String(p.category_id) === String(category.id))
                }
            }

            // 3. Price Filter
            if (priceRange.min) filtered = filtered.filter(p => p.price >= Number(priceRange.min))
            if (priceRange.max) filtered = filtered.filter(p => p.price <= Number(priceRange.max))

            // 4. Distance Calculation
            const productsWithDistance = await Promise.all(filtered.map(async (p) => {
                let dist = Infinity
                if (p.location_province) {
                    const d = await calculateDistanceToProduct(p.location_province)
                    if (d !== null) dist = d
                }
                return { ...p, _distance: dist }
            }))

            let processed = productsWithDistance

            if (maxDistance) {
                processed = processed.filter(p => p._distance <= maxDistance)
            }

            // 5. Ranking / Sorting
            processed.sort((a, b) => {
                switch (sortMode) {
                    case 'price_asc': return a.price - b.price
                    case 'price_desc': return b.price - a.price
                    case 'newest': return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
                    case 'nearest': return a._distance - b._distance
                    case 'ai_hybrid':
                    default:
                        // Simple score: Distance (30) + Views (20) + Verified (10)
                        let scoreA = (a._distance < 10 ? 30 : 0) + Math.min((a.views_count || 0) / 100, 20) + ((a as any).seller?.is_verified_seller ? 10 : 0)
                        let scoreB = (b._distance < 10 ? 30 : 0) + Math.min((b.views_count || 0) / 100, 20) + ((b as any).seller?.is_verified_seller ? 10 : 0)
                        return scoreB - scoreA
                }
            })

            // Pagination Slice
            const ITEMS_PER_PAGE = 8
            const startIndex = 0
            const endIndex = (isLoadMore ? page + 1 : 1) * ITEMS_PER_PAGE
            const currentSlice = processed.slice(startIndex, endIndex)

            setResults(currentSlice)
            setHasMore(endIndex < processed.length)
            setPage(prev => isLoadMore ? prev + 1 : 1)

            // Tracking
            if (!isLoadMore && query) {
                trackSearch(query, processed.length, {
                    categoryId: selectedCategory ? Number(CATEGORIES.find(c => c.slug === selectedCategory)?.id) : undefined,
                })
            }

        } catch (error) {
            console.error('Search error:', error)
        } finally {
            setLoading(false)
        }
    }

    // Trigger search
    useEffect(() => {
        performSearch(false)
    }, [query, selectedCategory, priceRange, sortMode, maxDistance])

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (searchQuery.trim()) {
            router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
        }
    }

    const clearFilters = () => {
        setPriceRange({ min: '', max: '' })
        setMaxDistance(null)
        setSelectedCategory('')
        setSortMode('ai_hybrid')
        router.push('/search')
    }

    const currentCategoryName = selectedCategory
        ? (language === 'th' ? CATEGORIES.find(c => c.slug === selectedCategory)?.name_th : CATEGORIES.find(c => c.slug === selectedCategory)?.name_en)
        : t('search_page.all_categories')

    return (
        <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-black font-sans">
            <Header />

            {/* Breadcrumbs */}
            <div className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800">
                <div className="max-w-7xl mx-auto px-4 py-3 text-sm text-gray-500 flex items-center gap-2 overflow-x-auto whitespace-nowrap">
                    <Link href="/" className="hover:text-purple-600 flex items-center gap-1">
                        <Home className="w-3.5 h-3.5" /> Home
                    </Link>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-900 dark:text-gray-100 font-medium truncate">
                        {query ? `${t('search_page.results_for')} "${query}"` : t('common.search')}
                    </span>
                    {selectedCategory && (
                        <>
                            <ChevronRight className="w-4 h-4 text-gray-400" />
                            <span className="text-purple-600 font-medium">{currentCategoryName}</span>
                        </>
                    )}
                </div>
            </div>

            <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-6">
                <div className="flex flex-col lg:flex-row gap-8">

                    {/* LEFT SIDEBAR (Desktop) */}
                    <aside className="hidden lg:block w-64 flex-shrink-0 space-y-8">
                        <div>
                            <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                <Filter className="w-4 h-4" /> {t('search_page.filters')}
                            </h3>

                            {/* Category Filter */}
                            <div className="mb-6">
                                <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">{t('search_page.category')}</label>
                                <div className="space-y-2 max-h-60 overflow-y-auto custom-scrollbar">
                                    <button
                                        onClick={() => setSelectedCategory('')}
                                        className={`block w-full text-left text-sm py-1 px-2 rounded ${!selectedCategory ? 'bg-purple-50 text-purple-700 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}
                                    >
                                        {t('search_page.all_categories')}
                                    </button>
                                    {CATEGORIES.map(c => (
                                        <button
                                            key={c.id}
                                            onClick={() => setSelectedCategory(c.slug)}
                                            className={`block w-full text-left text-sm py-1 px-2 rounded ${selectedCategory === c.slug ? 'bg-purple-50 text-purple-700 font-medium' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'}`}
                                        >
                                            {language === 'th' ? c.name_th : c.name_en}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Price Range */}
                            <div className="mb-6">
                                <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">{t('search_page.price_range')}</label>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="number"
                                        value={priceRange.min}
                                        onChange={e => setPriceRange({ ...priceRange, min: e.target.value })}
                                        placeholder={t('search_page.min')}
                                        className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm outline-none focus:border-purple-500"
                                    />
                                    <span className="text-gray-400">-</span>
                                    <input
                                        type="number"
                                        value={priceRange.max}
                                        onChange={e => setPriceRange({ ...priceRange, max: e.target.value })}
                                        placeholder={t('search_page.max')}
                                        className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm outline-none focus:border-purple-500"
                                    />
                                </div>
                            </div>

                            <Button variant="outline" className="w-full" onClick={clearFilters}>
                                {t('search_page.clear_filters')}
                            </Button>
                        </div>
                    </aside>

                    {/* MAIN CONTENT Area */}
                    <div className="flex-1 min-w-0">

                        {/* 1. Header & Controls */}
                        <div className="mb-6 space-y-4">
                            {/* Search Input */}
                            <form onSubmit={handleSearchSubmit} className="relative">
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder={t('header.search_placeholder')}
                                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-purple-500 outline-none transition-all"
                                />
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            </form>

                            {/* AI Chips / Smart Suggestion */}
                            <div className="flex flex-wrap items-center gap-2">
                                <div className="flex items-center gap-1 text-xs font-bold text-purple-600 bg-purple-50 dark:bg-purple-900/20 px-2 py-1 rounded-md">
                                    <Sparkles className="w-3 h-3" /> {t('search_page.ai_suggestion')}
                                </div>
                                {relatedKeywords.map((kw, i) => (
                                    <button
                                        key={i}
                                        onClick={() => { setSearchQuery(kw); router.push(`/search?q=${encodeURIComponent(kw)}`) }}
                                        className="text-xs px-3 py-1 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-purple-400 hover:text-purple-600 transition-colors"
                                    >
                                        {kw}
                                    </button>
                                ))}
                            </div>

                            {/* Mobile Filter Button & Sort */}
                            <div className="flex items-center justify-between gap-4">
                                <Button
                                    className="lg:hidden"
                                    variant="outline"
                                    onClick={() => setShowMobileFilters(true)}
                                >
                                    <SlidersHorizontal className="w-4 h-4 mr-2" /> {t('search_page.filters')}
                                </Button>

                                <div className="flex items-center gap-2 ml-auto overflow-x-auto no-scrollbar">
                                    <span className="text-sm text-gray-500 whitespace-nowrap hidden sm:inline">{t('search_page.sort_by')}:</span>
                                    {smartFilters.map(filter => (
                                        <button
                                            key={filter.id}
                                            onClick={() => {
                                                if (filter.type === 'sort') setSortMode(filter.value)
                                                else if (filter.type === 'filter') setMaxDistance(maxDistance === filter.value ? null : filter.value)
                                            }}
                                            className={`
                                                flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap border transition-all
                                                ${(filter.type === 'sort' && sortMode === filter.value) || (filter.type === 'filter' && maxDistance === filter.value)
                                                    ? 'bg-black dark:bg-white text-white dark:text-black border-transparent'
                                                    : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-gray-400'
                                                }
                                            `}
                                        >
                                            {filter.icon && <filter.icon className="w-3 h-3" />}
                                            {t(`search_page.${filter.labelKey}`)}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* 2. Product Grid */}
                        <InfiniteScroll onLoadMore={() => performSearch(true)} hasMore={hasMore} isLoading={loading}>
                            {results.length > 0 ? (
                                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                                    {results.map(product => (
                                        <ProductCard
                                            key={product.id}
                                            product={product}
                                            isAiRecommended={sortMode === 'ai_hybrid' && (product as any)._distance < 20}
                                        />
                                    ))}
                                </div>
                            ) : !loading ? (
                                <div className="flex flex-col items-center justify-center py-20 text-center">
                                    <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-6">
                                        <Search className="w-10 h-10 text-gray-400" />
                                    </div>
                                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{t('search_page.no_results')}</h2>
                                    <p className="text-gray-500 max-w-sm">{t('search_page.ai_learning')}</p>
                                    <Button className="mt-6" onClick={clearFilters} variant="outline">
                                        {t('search_page.clear_filters')}
                                    </Button>
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                                    {[...Array(8)].map((_, i) => (
                                        <div key={i} className="aspect-[4/5] bg-gray-200 dark:bg-gray-800 rounded-2xl animate-pulse" />
                                    ))}
                                </div>
                            )}
                        </InfiniteScroll>
                    </div>
                </div>
            </main>

            {/* Mobile Filter Modal */}
            {showMobileFilters && (
                <div className="fixed inset-0 z-50 lg:hidden flex justify-end">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowMobileFilters(false)} />
                    <div className="relative w-80 h-full bg-white dark:bg-gray-900 shadow-2xl p-6 overflow-y-auto animate-in slide-in-from-right duration-300">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="font-bold text-lg">{t('search_page.filters')}</h3>
                            <button onClick={() => setShowMobileFilters(false)} className="p-2 hover:bg-gray-100 rounded-full">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Mobile Sidebar Content Replicated */}
                        <div className="space-y-8">
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase mb-3 block">{t('search_page.category')}</label>
                                <select
                                    className="w-full p-3 bg-gray-50 dark:bg-gray-800 rounded-xl"
                                    value={selectedCategory}
                                    onChange={e => setSelectedCategory(e.target.value)}
                                >
                                    <option value="">{t('search_page.all_categories')}</option>
                                    {CATEGORIES.map(c => (
                                        <option key={c.id} value={c.slug}>{language === 'th' ? c.name_th : c.name_en}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase mb-3 block">{t('search_page.price_range')}</label>
                                <div className="flex gap-3">
                                    <input
                                        type="number"
                                        placeholder={t('search_page.min')}
                                        value={priceRange.min}
                                        onChange={e => setPriceRange({ ...priceRange, min: e.target.value })}
                                        className="w-full p-3 bg-gray-50 dark:bg-gray-800 rounded-xl"
                                    />
                                    <input
                                        type="number"
                                        placeholder={t('search_page.max')}
                                        value={priceRange.max}
                                        onChange={e => setPriceRange({ ...priceRange, max: e.target.value })}
                                        className="w-full p-3 bg-gray-50 dark:bg-gray-800 rounded-xl"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="mt-12 space-y-3">
                            <Button className="w-full py-4 text-base" onClick={() => setShowMobileFilters(false)}>
                                {t('search_page.apply')}
                            </Button>
                            <Button variant="ghost" className="w-full text-red-500" onClick={() => { clearFilters(); setShowMobileFilters(false); }}>
                                {t('search_page.clear_filters')}
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            <Footer />
        </div>
    )
}

export default function SearchPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-gray-50 dark:bg-black" />}>
            <SearchContent />
        </Suspense>
    )
}
