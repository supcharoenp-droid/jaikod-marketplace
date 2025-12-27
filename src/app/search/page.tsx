'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { useState, useEffect, Suspense, useCallback } from 'react'
import Link from 'next/link'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { CATEGORIES } from '@/constants/categories'
import {
    Search, SlidersHorizontal, X, ChevronDown, Sparkles, MapPin,
    ArrowUpDown, Filter, ChevronRight, Home, Zap, TrendingUp,
    Grid3X3, List, Clock, Star, BadgeCheck, Loader2, Tag, ChevronUp, Map
} from 'lucide-react'
import Button from '@/components/ui/Button'
import { useLanguage } from '@/contexts/LanguageContext'
import { performUnifiedSearch, UnifiedSearchResponse, UnifiedSearchItem } from '@/services/search/unified-search'
import { queryAnalyzer } from '@/services/search/ai-query-analyzer'
import { trackSearch, trackSearchClick } from '@/services/search/search-analytics'
import Image from 'next/image'
import { ProvinceFilter, QuickPriceFilter } from '@/components/search/EnhancedFilters'
import { ZeroResultsFallback } from '@/components/search/ZeroResultsFallback'
import SmartProductCardV3 from '@/components/product/SmartProductCardV3'
import { SmartProductData, toSmartProductData } from '@/components/product/SmartProductCardV2'
import { toThaiProvince, toThaiAmphoe } from '@/lib/location-localization'
import {
    BrandFilterWithLogos,
    QuickFilterChips,
    SearchHistory,
    AIRecommendationBanner,
    ViewModeToggle,
    saveSearchToHistory
} from '@/components/search/SearchEnhancements'

// ==========================================
// UNIFIED PRODUCT CARD (For search results)
// ==========================================

function SearchResultCard({
    item,
    position,
    query,
    isAiRecommended
}: {
    item: UnifiedSearchItem
    position: number
    query: string
    isAiRecommended?: boolean
}) {
    const router = useRouter()

    const handleClick = async () => {
        // Track click
        await trackSearchClick(query, item.id, item.source, position)

        // Navigate
        const url = item.source === 'listing'
            ? `/listing/${item.id}`
            : `/product/${item.id}`
        router.push(url)
    }

    return (
        <div
            onClick={handleClick}
            className="group cursor-pointer bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700 hover:shadow-xl hover:border-purple-200 dark:hover:border-purple-700 transition-all duration-300 hover:-translate-y-1"
        >
            {/* Image Container */}
            <div className="relative aspect-square overflow-hidden bg-gray-100 dark:bg-gray-900">
                {(item.thumbnail && item.thumbnail.length > 0) ? (
                    <Image
                        src={item.thumbnail}
                        alt={item.title || 'Product'}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-200 dark:bg-gray-700">
                        <span className="text-4xl">📦</span>
                    </div>
                )}

                {/* Badges */}
                <div className="absolute top-2 left-2 flex flex-col gap-1">
                    {isAiRecommended && (
                        <span className="px-2 py-0.5 bg-purple-500 text-white text-[10px] font-bold rounded-full flex items-center gap-1">
                            <Sparkles className="w-3 h-3" /> AI แนะนำ
                        </span>
                    )}
                    {item.seller_verified && (
                        <span className="px-2 py-0.5 bg-blue-500 text-white text-[10px] font-bold rounded-full flex items-center gap-1">
                            <BadgeCheck className="w-3 h-3" /> Verified
                        </span>
                    )}
                </div>

                {/* Source Badge */}
                <div className="absolute bottom-2 right-2">
                    <span className={`px-2 py-0.5 text-[10px] font-medium rounded ${item.source === 'listing'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-600'
                        }`}>
                        {item.source === 'listing' ? 'AI Listing' : 'Classic'}
                    </span>
                </div>
            </div>

            {/* Content */}
            <div className="p-3">
                {/* Title */}
                <h3 className="font-medium text-gray-900 dark:text-white text-sm line-clamp-2 group-hover:text-purple-600 transition-colors min-h-[40px]">
                    {item.title_th || item.title}
                </h3>

                {/* Price */}
                <div className="mt-2">
                    <span className="text-lg font-bold text-purple-600">
                        ฿{item.price.toLocaleString()}
                    </span>
                </div>

                {/* Meta */}
                <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {item.province || 'ไม่ระบุ'}
                    </span>
                    {item.condition && (
                        <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-[10px]">
                            {item.condition === 'new' ? 'ใหม่' : 'มือสอง'}
                        </span>
                    )}
                </div>
            </div>
        </div>
    )
}

// ==========================================
// CONVERT SEARCH ITEM TO SMART PRODUCT DATA
// ==========================================

function searchItemToSmartProduct(item: UnifiedSearchItem): SmartProductData {
    // Get images as string array
    const imageUrls = item.images?.map((img: any) =>
        typeof img === 'string' ? img : img?.url || ''
    ).filter(Boolean) || []

    return {
        id: item.id,
        slug: item.id,
        title: item.title_th || item.title,
        price: item.price || 0,
        thumbnailUrl: item.thumbnail || imageUrls[0] || '',
        images: imageUrls,
        condition: item.condition as SmartProductData['condition'],
        location: {
            province: toThaiProvince(item.province),
            amphoe: toThaiAmphoe(item.amphoe),
            distance: undefined // Will be calculated by SmartProductCardV3
        },
        seller: {
            id: item.seller_id || '',
            name: item.seller_name || 'ผู้ขาย',
            avatar: undefined,
            isVerified: item.seller_verified,
            trustScore: 50,
            responseTime: undefined,
            isOnline: false,
            lastActive: undefined
        },
        stats: {
            views: item.views_count || 0,
            favorites: 0,
            inquiries: 0
        },
        ai: {
            score: item.ai_score,
            priceInsight: undefined,
            pricePercentage: undefined,
            qualityScore: item.ai_score
        },
        source: item.source as 'listing' | 'product',
        listingCode: undefined,
        // Handle various date formats: Date, Firestore Timestamp, ISO string, or fallback to now
        createdAt: (() => {
            if (item.created_at instanceof Date && !isNaN(item.created_at.getTime())) {
                return item.created_at
            }
            if (item.created_at && typeof item.created_at === 'object' && 'seconds' in item.created_at) {
                // Firestore Timestamp format
                return new Date((item.created_at as any).seconds * 1000)
            }
            if (item.created_at && typeof item.created_at === 'string') {
                const parsed = new Date(item.created_at)
                if (!isNaN(parsed.getTime())) return parsed
            }
            return new Date() // Fallback to current date
        })(),
        isHot: (item.views_count || 0) > 500,
        isFeatured: false
    }
}

// ==========================================
// SMART SORT/FILTER CHIPS
// ==========================================

interface SmartChip {
    id: string
    labelKey: string
    label_th: string
    label_en: string
    icon: React.ElementType
    type: 'sort' | 'filter'
    value: string
}

const SMART_CHIPS: SmartChip[] = [
    { id: 'ai', labelKey: 'ai_recommended', label_th: 'AI แนะนำ', label_en: 'AI Recommended', icon: Sparkles, type: 'sort', value: 'relevance' },
    { id: 'newest', labelKey: 'newest', label_th: 'ใหม่ล่าสุด', label_en: 'Newest', icon: Clock, type: 'sort', value: 'newest' },
    { id: 'price_low', labelKey: 'price_low', label_th: 'ราคาต่ำ→สูง', label_en: 'Price Low', icon: ArrowUpDown, type: 'sort', value: 'price_asc' },
    { id: 'price_high', labelKey: 'price_high', label_th: 'ราคาสูง→ต่ำ', label_en: 'Price High', icon: ArrowUpDown, type: 'sort', value: 'price_desc' },
]

// ==========================================
// MAIN SEARCH CONTENT
// ==========================================

function SearchContent() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const { t, language } = useLanguage()

    // URL Params
    const urlQuery = searchParams.get('q') || ''
    const urlCategory = searchParams.get('category') || ''
    const urlSort = searchParams.get('sort') || 'relevance'

    // State
    const [searchQuery, setSearchQuery] = useState(urlQuery)
    const [searchResponse, setSearchResponse] = useState<UnifiedSearchResponse | null>(null)
    const [loading, setLoading] = useState(false)
    const [showMobileFilters, setShowMobileFilters] = useState(false)
    const [viewMode, setViewMode] = useState<'grid' | 'list' | 'map'>('grid')

    // Filter State
    const [selectedCategory, setSelectedCategory] = useState(urlCategory)
    const [priceRange, setPriceRange] = useState({ min: '', max: '' })
    const [sortMode, setSortMode] = useState(urlSort)
    const [selectedCondition, setSelectedCondition] = useState<string>('all')
    const [selectedBrand, setSelectedBrand] = useState('')
    const [selectedProvince, setSelectedProvince] = useState('')
    const [showAllCategories, setShowAllCategories] = useState(false)
    const [activeQuickFilters, setActiveQuickFilters] = useState<string[]>([])

    // AI Analysis State
    const [queryAnalysis, setQueryAnalysis] = useState<ReturnType<typeof queryAnalyzer.analyze> | null>(null)

    // ==========================================
    // SEARCH FUNCTION
    // ==========================================

    const performSearch = useCallback(async () => {
        setLoading(true)

        try {
            // AI Query Analysis
            let analysis = null
            if (urlQuery.trim()) {
                analysis = queryAnalyzer.analyze(urlQuery)
                setQueryAnalysis(analysis)
            }

            // Build search request
            // Note: We DON'T auto-apply AI suggested category to show broader results
            // User can manually select category from filters if needed
            const request = {
                query: analysis?.correctedQuery || urlQuery,
                page: 1,
                limit: 24,
                category_id: selectedCategory
                    ? CATEGORIES.find(c => c.slug === selectedCategory)?.id
                    : undefined, // Don't auto-apply AI category - show all results
                min_price: priceRange.min ? Number(priceRange.min) : analysis?.suggestedFilters.min_price,
                max_price: priceRange.max ? Number(priceRange.max) : analysis?.suggestedFilters.max_price,
                condition: selectedCondition !== 'all' ? selectedCondition as any : undefined,
                province: selectedProvince || undefined, // Add province filter
                sort_by: sortMode as any,
                include_products: true,
                include_listings: true
            }

            const response = await performUnifiedSearch(request)
            setSearchResponse(response)

            // Save to search history
            if (urlQuery.trim()) {
                saveSearchToHistory(urlQuery)
            }

            // Track search - filter out undefined values
            const trackFilters: Record<string, any> = {}
            if (request.category_id !== undefined) trackFilters.category_id = request.category_id
            if (request.min_price !== undefined) trackFilters.min_price = request.min_price
            if (request.max_price !== undefined) trackFilters.max_price = request.max_price
            if (selectedCondition && selectedCondition !== 'all') trackFilters.condition = selectedCondition
            trackFilters.sort_by = sortMode

            await trackSearch({
                event_type: 'search',
                query: urlQuery || '',
                results_count: response.total_count,
                execution_time_ms: response.execution_time_ms,
                detected_intent: analysis?.intent.type || undefined,
                detected_brand: analysis?.entities.brand || undefined,
                detected_category: analysis?.entities.category || undefined,
                filters: Object.keys(trackFilters).length > 0 ? trackFilters : undefined
            })

        } catch (error) {
            console.error('[Search] Error:', error)
        } finally {
            setLoading(false)
        }
    }, [urlQuery, selectedCategory, priceRange, sortMode, selectedCondition])

    // Trigger search on param changes
    useEffect(() => {
        performSearch()
    }, [performSearch])

    // ==========================================
    // HANDLERS
    // ==========================================

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (searchQuery.trim()) {
            router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
        }
    }

    const clearFilters = () => {
        setPriceRange({ min: '', max: '' })
        setSelectedCategory('')
        setSelectedCondition('all')
        setSelectedBrand('')
        setSelectedProvince('')
        setSortMode('relevance')
        router.push('/search')
    }

    const handleSortChange = (value: string) => {
        setSortMode(value)
    }

    // ==========================================
    // DERIVED DATA
    // ==========================================

    const currentCategoryName = selectedCategory
        ? (language === 'th'
            ? CATEGORIES.find(c => c.slug === selectedCategory)?.name_th
            : CATEGORIES.find(c => c.slug === selectedCategory)?.name_en)
        : t('search_page.all_categories')

    const results = searchResponse?.results || []
    const facets = searchResponse?.facets
    const suggestions = searchResponse?.suggestions

    // ==========================================
    // RENDER
    // ==========================================

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
                        {urlQuery ? `ค้นหา "${urlQuery}"` : 'ค้นหาสินค้า'}
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

                    {/* ==========================================
                        LEFT SIDEBAR (Desktop)
                    ========================================== */}
                    <aside className="hidden lg:block w-72 flex-shrink-0 space-y-6">
                        {/* Category Filter */}
                        <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700">
                            <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                <Filter className="w-4 h-4 text-purple-500" /> หมวดหมู่
                                <span className="ml-auto text-xs text-gray-400 font-normal">
                                    ({CATEGORIES.length} หมวด)
                                </span>
                            </h3>
                            <div className="space-y-1">
                                {/* All Categories Button */}
                                <button
                                    onClick={() => setSelectedCategory('')}
                                    className={`flex items-center gap-2 w-full text-left text-sm py-2.5 px-3 rounded-xl transition-all ${!selectedCategory
                                        ? 'bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/30 dark:to-pink-900/30 text-purple-700 dark:text-purple-300 font-medium shadow-sm'
                                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                                        }`}
                                >
                                    <span className="text-base">📚</span>
                                    <span className="flex-1">ทั้งหมด</span>
                                    <span className="text-xs text-gray-400">{facets?.categories.reduce((a, c) => a + c.count, 0) || 0}</span>
                                </button>

                                {/* Category List - Show first 8 or all */}
                                {(showAllCategories ? CATEGORIES : CATEGORIES.slice(0, 8)).map(c => {
                                    const facet = facets?.categories.find(f => f.id === c.id)
                                    const isSelected = selectedCategory === c.slug
                                    return (
                                        <button
                                            key={c.id}
                                            onClick={() => setSelectedCategory(c.slug)}
                                            className={`flex items-center gap-2 w-full text-left text-sm py-2.5 px-3 rounded-xl transition-all ${isSelected
                                                ? 'bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/30 dark:to-pink-900/30 text-purple-700 dark:text-purple-300 font-medium shadow-sm'
                                                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                                                }`}
                                        >
                                            <span className="text-base">{c.icon}</span>
                                            <span className="flex-1 truncate">{language === 'th' ? c.name_th : c.name_en}</span>
                                            {facet && <span className="text-xs text-gray-400">({facet.count})</span>}
                                            {c.is_hot && <span className="px-1.5 py-0.5 text-[9px] bg-red-100 text-red-600 rounded-full">HOT</span>}
                                        </button>
                                    )
                                })}

                                {/* Show More/Less Button */}
                                {CATEGORIES.length > 8 && (
                                    <button
                                        onClick={() => setShowAllCategories(!showAllCategories)}
                                        className="flex items-center justify-center gap-1 w-full text-sm py-2.5 px-3 rounded-xl text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all font-medium"
                                    >
                                        {showAllCategories ? (
                                            <>
                                                <ChevronUp className="w-4 h-4" />
                                                ซ่อนหมวดหมู่
                                            </>
                                        ) : (
                                            <>
                                                <ChevronDown className="w-4 h-4" />
                                                ดูทั้ง {CATEGORIES.length} หมวด
                                            </>
                                        )}
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Price Filter */}
                        <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700">
                            <h3 className="font-bold text-gray-900 dark:text-white mb-4">💰 ช่วงราคา</h3>
                            <div className="flex items-center gap-2">
                                <input
                                    type="number"
                                    value={priceRange.min}
                                    onChange={e => setPriceRange({ ...priceRange, min: e.target.value })}
                                    placeholder="ต่ำสุด"
                                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm outline-none focus:border-purple-500"
                                />
                                <span className="text-gray-400">-</span>
                                <input
                                    type="number"
                                    value={priceRange.max}
                                    onChange={e => setPriceRange({ ...priceRange, max: e.target.value })}
                                    placeholder="สูงสุด"
                                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm outline-none focus:border-purple-500"
                                />
                            </div>

                            {/* Quick price ranges */}
                            {facets?.price_ranges && facets.price_ranges.length > 0 && (
                                <div className="mt-3 space-y-1">
                                    {facets.price_ranges.map((range, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setPriceRange({
                                                min: String(range.min),
                                                max: range.max === Infinity ? '' : String(range.max)
                                            })}
                                            className="block w-full text-left text-sm py-1.5 px-2 rounded hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400"
                                        >
                                            {range.label} <span className="text-gray-400">({range.count})</span>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Condition Filter */}
                        <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700">
                            <h3 className="font-bold text-gray-900 dark:text-white mb-4">🏷️ สภาพสินค้า</h3>
                            <div className="space-y-2">
                                {['all', 'new', 'used'].map(cond => (
                                    <label key={cond} className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="condition"
                                            checked={selectedCondition === cond}
                                            onChange={() => setSelectedCondition(cond)}
                                            className="text-purple-600"
                                        />
                                        <span className="text-sm text-gray-700 dark:text-gray-300">
                                            {cond === 'all' ? 'ทั้งหมด' : cond === 'new' ? 'ใหม่' : 'มือสอง'}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Brand Filter with Logos */}
                        <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700">
                            <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                <Tag className="w-4 h-4 text-purple-500" /> แบรนด์
                            </h3>
                            <BrandFilterWithLogos
                                detectedBrand={queryAnalysis?.entities.brand}
                                selectedBrand={selectedBrand}
                                onBrandChange={setSelectedBrand}
                                categorySlug={selectedCategory}
                                language={language}
                            />
                        </div>

                        {/* Province Filter */}
                        <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700">
                            <ProvinceFilter
                                selectedProvince={selectedProvince}
                                onProvinceChange={setSelectedProvince}
                                language={language}
                            />
                        </div>

                        {/* Clear Filters */}
                        <Button variant="outline" className="w-full" onClick={clearFilters}>
                            <X className="w-4 h-4 mr-2" /> ล้างตัวกรอง
                        </Button>
                    </aside>

                    {/* ==========================================
                        MAIN CONTENT
                    ========================================== */}
                    <div className="flex-1 min-w-0">

                        {/* Search Bar */}
                        <form onSubmit={handleSearchSubmit} className="relative mb-6">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder={t('header.search_placeholder')}
                                className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all text-lg shadow-sm"
                            />
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <button
                                type="submit"
                                className="absolute right-3 top-1/2 -translate-y-1/2 px-5 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-medium hover:opacity-90 transition-opacity"
                            >
                                ค้นหา
                            </button>
                        </form>

                        {/* AI Query Analysis Banner */}
                        {/* AI Spelling Correction */}
                        {queryAnalysis && queryAnalysis.didCorrect && (
                            <div className="mb-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl flex items-center gap-2">
                                <Sparkles className="w-4 h-4 text-yellow-600" />
                                <span className="text-sm text-yellow-800 dark:text-yellow-200">
                                    AI แก้ไขคำค้นเป็น: <strong>"{queryAnalysis.correctedQuery}"</strong>
                                </span>
                            </div>
                        )}

                        {/* AI Recommendation Banner */}
                        <AIRecommendationBanner
                            query={urlQuery}
                            detectedBrand={queryAnalysis?.entities.brand}
                            detectedCategory={queryAnalysis?.entities.category}
                            suggestedFilters={queryAnalysis?.expandedQueries || []}
                            onSuggestionClick={(suggestion) => {
                                router.push(`/search?q=${encodeURIComponent(suggestion)}`)
                            }}
                            language={language}
                        />

                        {/* Quick Filter Chips */}
                        <QuickFilterChips
                            activeFilters={activeQuickFilters}
                            onToggleFilter={(filterId, filterKey, filterValue) => {
                                setActiveQuickFilters(prev =>
                                    prev.includes(filterId)
                                        ? prev.filter(f => f !== filterId)
                                        : [...prev, filterId]
                                )
                                // Apply filter logic
                                if (filterKey === 'condition' && filterValue === 'new') {
                                    setSelectedCondition(activeQuickFilters.includes(filterId) ? 'all' : 'new')
                                }
                                if (filterKey === 'max_price' && filterValue === 5000) {
                                    setPriceRange(prev => ({
                                        ...prev,
                                        max: activeQuickFilters.includes(filterId) ? '' : '5000'
                                    }))
                                }
                            }}
                            language={language}
                        />

                        {/* Sort & View Controls */}
                        <div className="flex items-center justify-between gap-4 mb-6">
                            {/* Mobile Filter Button */}
                            <Button
                                className="lg:hidden"
                                variant="outline"
                                onClick={() => setShowMobileFilters(true)}
                            >
                                <SlidersHorizontal className="w-4 h-4 mr-2" /> ตัวกรอง
                            </Button>

                            {/* Results Count */}
                            <div className="hidden sm:block text-sm text-gray-500">
                                พบ <span className="font-bold text-gray-900 dark:text-white">{searchResponse?.total_count || 0}</span> รายการ
                                {searchResponse?.execution_time_ms && (
                                    <span className="text-gray-400"> ({searchResponse.execution_time_ms}ms)</span>
                                )}
                            </div>

                            {/* Sort Chips */}
                            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
                                {SMART_CHIPS.map(chip => (
                                    <button
                                        key={chip.id}
                                        onClick={() => handleSortChange(chip.value)}
                                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap border transition-all ${sortMode === chip.value
                                            ? 'bg-purple-600 text-white border-purple-600'
                                            : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-purple-400'
                                            }`}
                                    >
                                        <chip.icon className="w-3 h-3" />
                                        {language === 'th' ? chip.label_th : chip.label_en}
                                    </button>
                                ))}
                            </div>


                            {/* View Mode Toggle with Map */}
                            <ViewModeToggle
                                currentMode={viewMode}
                                onModeChange={setViewMode}
                                language={language}
                            />
                        </div>

                        {/* Search History (when no query) */}
                        {!urlQuery && results.length === 0 && (
                            <SearchHistory
                                onSearchClick={(query) => {
                                    setSearchQuery(query)
                                    router.push(`/search?q=${encodeURIComponent(query)}`)
                                }}
                                language={language}
                            />
                        )}

                        {/* Related Keywords */}
                        {suggestions?.related_keywords && suggestions.related_keywords.length > 0 && (
                            <div className="mb-6 flex flex-wrap items-center gap-2">
                                <span className="text-xs text-gray-500 flex items-center gap-1">
                                    <TrendingUp className="w-3 h-3" /> คำค้นที่เกี่ยวข้อง:
                                </span>
                                {suggestions.related_keywords.map((kw, i) => (
                                    <button
                                        key={i}
                                        onClick={() => {
                                            setSearchQuery(kw)
                                            router.push(`/search?q=${encodeURIComponent(kw)}`)
                                        }}
                                        className="text-xs px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-purple-100 hover:text-purple-600 transition-colors"
                                    >
                                        {kw}
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* ==========================================
                            RESULTS GRID
                        ========================================== */}
                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-20">
                                <Loader2 className="w-10 h-10 text-purple-600 animate-spin mb-4" />
                                <p className="text-gray-500">กำลังค้นหา...</p>
                            </div>
                        ) : results.length > 0 ? (
                            <div className={viewMode === 'grid'
                                ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4"
                                : "space-y-4"
                            }>
                                {results.map((item) => (
                                    <SmartProductCardV3
                                        key={`${item.source}-${item.id}`}
                                        product={searchItemToSmartProduct(item)}
                                        showAIInsights={true}
                                        showSellerInfo={true}
                                    />
                                ))}
                            </div>
                        ) : (
                            <ZeroResultsFallback
                                query={urlQuery}
                                detectedBrand={queryAnalysis?.entities.brand}
                                detectedCategory={queryAnalysis?.entities.category}
                                suggestions={suggestions?.similar_searches || queryAnalysis?.expandedQueries || []}
                                onSuggestionClick={(suggestion) => {
                                    setSearchQuery(suggestion)
                                    router.push(`/search?q=${encodeURIComponent(suggestion)}`)
                                }}
                                language={language}
                            />
                        )}

                        {/* Pagination Info */}
                        {searchResponse && searchResponse.total_pages > 1 && (
                            <div className="mt-8 text-center text-sm text-gray-500">
                                หน้า {searchResponse.page} จาก {searchResponse.total_pages}
                            </div>
                        )}
                    </div>
                </div>
            </main>

            {/* ==========================================
                MOBILE FILTER MODAL
            ========================================== */}
            {showMobileFilters && (
                <div className="fixed inset-0 z-50 lg:hidden flex justify-end">
                    <div
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        onClick={() => setShowMobileFilters(false)}
                    />
                    <div className="relative w-80 h-full bg-white dark:bg-gray-900 shadow-2xl p-6 overflow-y-auto animate-in slide-in-from-right duration-300">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="font-bold text-lg">ตัวกรอง</h3>
                            <button
                                onClick={() => setShowMobileFilters(false)}
                                className="p-2 hover:bg-gray-100 rounded-full"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Mobile Filters */}
                        <div className="space-y-6">
                            {/* Category */}
                            <div>
                                <label className="text-sm font-bold text-gray-700 mb-3 block">หมวดหมู่</label>
                                <select
                                    className="w-full p-3 bg-gray-50 dark:bg-gray-800 rounded-xl border-0"
                                    value={selectedCategory}
                                    onChange={e => setSelectedCategory(e.target.value)}
                                >
                                    <option value="">ทั้งหมด</option>
                                    {CATEGORIES.map(c => (
                                        <option key={c.id} value={c.slug}>
                                            {language === 'th' ? c.name_th : c.name_en}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Price */}
                            <div>
                                <label className="text-sm font-bold text-gray-700 mb-3 block">ช่วงราคา</label>
                                <div className="flex gap-3">
                                    <input
                                        type="number"
                                        placeholder="ต่ำสุด"
                                        value={priceRange.min}
                                        onChange={e => setPriceRange({ ...priceRange, min: e.target.value })}
                                        className="w-full p-3 bg-gray-50 dark:bg-gray-800 rounded-xl"
                                    />
                                    <input
                                        type="number"
                                        placeholder="สูงสุด"
                                        value={priceRange.max}
                                        onChange={e => setPriceRange({ ...priceRange, max: e.target.value })}
                                        className="w-full p-3 bg-gray-50 dark:bg-gray-800 rounded-xl"
                                    />
                                </div>
                            </div>

                            {/* Condition */}
                            <div>
                                <label className="text-sm font-bold text-gray-700 mb-3 block">สภาพสินค้า</label>
                                <select
                                    className="w-full p-3 bg-gray-50 dark:bg-gray-800 rounded-xl border-0"
                                    value={selectedCondition}
                                    onChange={e => setSelectedCondition(e.target.value)}
                                >
                                    <option value="all">ทั้งหมด</option>
                                    <option value="new">ใหม่</option>
                                    <option value="used">มือสอง</option>
                                </select>
                            </div>
                        </div>

                        <div className="mt-12 space-y-3">
                            <Button
                                className="w-full py-4 text-base"
                                onClick={() => setShowMobileFilters(false)}
                            >
                                แสดงผลลัพธ์
                            </Button>
                            <Button
                                variant="ghost"
                                className="w-full text-red-500"
                                onClick={() => { clearFilters(); setShowMobileFilters(false); }}
                            >
                                ล้างตัวกรอง
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            <Footer />
        </div>
    )
}

// ==========================================
// MAIN EXPORT
// ==========================================

export default function SearchPageV2() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-gray-50 dark:bg-black flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
            </div>
        }>
            <SearchContent />
        </Suspense>
    )
}
