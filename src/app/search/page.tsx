'use client'

import { useSearchParams } from 'next/navigation'
import { useState, useEffect, Suspense } from 'react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import ProductCard from '@/components/product/ProductCard'
import { MOCK_PRODUCTS } from '@/constants/mockProducts'
import { CATEGORIES } from '@/constants/categories'
import { Product } from '@/types'
import { Search, SlidersHorizontal, X, ChevronDown } from 'lucide-react'
import Button from '@/components/ui/Button'
import { trackSearch } from '@/services/behaviorTracking'

function SearchContent() {
    const searchParams = useSearchParams()
    const query = searchParams.get('q') || ''
    const categorySlug = searchParams.get('category') || ''
    const sortBy = searchParams.get('sort') || 'newest'

    const [searchQuery, setSearchQuery] = useState(query)
    const [results, setResults] = useState<Product[]>([])
    const [showFilters, setShowFilters] = useState(false)
    const [selectedCategory, setSelectedCategory] = useState(categorySlug)
    const [selectedSort, setSelectedSort] = useState(sortBy)
    const [priceRange, setPriceRange] = useState({ min: '', max: '' })

    // Search Logic
    useEffect(() => {
        let filtered = [...MOCK_PRODUCTS]

        // Filter by search query
        if (query) {
            const lowerQuery = query.toLowerCase()
            filtered = filtered.filter(p =>
                p.title.toLowerCase().includes(lowerQuery) ||
                p.description.toLowerCase().includes(lowerQuery) ||
                p.category?.name_th.toLowerCase().includes(lowerQuery) ||
                p.category?.name_en.toLowerCase().includes(lowerQuery)
            )
        }

        // Filter by category
        if (selectedCategory) {
            filtered = filtered.filter(p => p.category?.slug === selectedCategory)
        }

        // Filter by price range
        if (priceRange.min) {
            filtered = filtered.filter(p => p.price >= Number(priceRange.min))
        }
        if (priceRange.max) {
            filtered = filtered.filter(p => p.price <= Number(priceRange.max))
        }

        // Sort
        switch (selectedSort) {
            case 'price_low':
                filtered.sort((a, b) => a.price - b.price)
                break
            case 'price_high':
                filtered.sort((a, b) => b.price - a.price)
                break
            case 'popular':
                filtered.sort((a, b) => b.views_count - a.views_count)
                break
            case 'best_seller':
                filtered.sort((a, b) => (b.sold_count || 0) - (a.sold_count || 0))
                break
            case 'newest':
            default:
                filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        }

        setResults(filtered)

        // Track search behavior for AI recommendations
        if (query) {
            trackSearch(query, filtered.length)
        }
    }, [query, selectedCategory, selectedSort, priceRange])

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        // Update URL with search query
        const url = new URL(window.location.href)
        url.searchParams.set('q', searchQuery)
        window.history.pushState({}, '', url.toString())
        // Trigger re-filter
        setResults(prev => [...prev]) // Force re-render (in real app, this would be a proper state update)
    }

    const clearFilters = () => {
        setSelectedCategory('')
        setSelectedSort('newest')
        setPriceRange({ min: '', max: '' })
    }

    return (
        <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-bg-dark">
            <Header />
            <main className="flex-1 pt-24 pb-12">
                <div className="container mx-auto px-4">

                    {/* Search Header */}
                    <div className="mb-6">
                        <form onSubmit={handleSearch} className="relative max-w-2xl">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="ค้นหาสินค้า..."
                                className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-surface-dark focus:ring-2 focus:ring-neon-purple focus:border-transparent outline-none text-lg shadow-sm"
                            />
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 px-5 py-2 bg-neon-purple text-white rounded-xl font-medium hover:bg-purple-600 transition-colors">
                                ค้นหา
                            </button>
                        </form>

                        {query && (
                            <p className="mt-4 text-text-secondary">
                                ผลการค้นหา &quot;<span className="font-semibold text-text-primary dark:text-white">{query}</span>&quot;
                                <span className="ml-2 text-neon-purple font-bold">{results.length}</span> รายการ
                            </p>
                        )}
                    </div>

                    {/* Filters Bar */}
                    <div className="flex flex-wrap items-center gap-3 mb-6 pb-4 border-b border-gray-200 dark:border-gray-800">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setShowFilters(!showFilters)}
                            className={showFilters ? 'bg-neon-purple/10 border-neon-purple text-neon-purple' : ''}
                        >
                            <SlidersHorizontal className="w-4 h-4 mr-2" />
                            ตัวกรอง
                        </Button>

                        {/* Category Pills */}
                        <div className="flex gap-2 overflow-x-auto pb-1">
                            <button
                                onClick={() => setSelectedCategory('')}
                                className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${!selectedCategory ? 'bg-neon-purple text-white' : 'bg-gray-100 dark:bg-gray-800 text-text-secondary hover:bg-gray-200'}`}
                            >
                                ทั้งหมด
                            </button>
                            {CATEGORIES.slice(0, 6).map(cat => (
                                <button
                                    key={cat.id}
                                    onClick={() => setSelectedCategory(cat.slug)}
                                    className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${selectedCategory === cat.slug ? 'bg-neon-purple text-white' : 'bg-gray-100 dark:bg-gray-800 text-text-secondary hover:bg-gray-200'}`}
                                >
                                    {cat.icon} {cat.name_th}
                                </button>
                            ))}
                        </div>

                        {/* Sort Dropdown */}
                        <div className="ml-auto relative">
                            <select
                                value={selectedSort}
                                onChange={(e) => setSelectedSort(e.target.value)}
                                className="appearance-none bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2 pr-8 text-sm font-medium focus:ring-2 focus:ring-neon-purple outline-none"
                            >
                                <option value="newest">ใหม่ล่าสุด</option>
                                <option value="popular">ยอดนิยม</option>
                                <option value="best_seller">ขายดี</option>
                                <option value="price_low">ราคาต่ำ-สูง</option>
                                <option value="price_high">ราคาสูง-ต่ำ</option>
                            </select>
                            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                        </div>
                    </div>

                    {/* Expanded Filters Panel */}
                    {showFilters && (
                        <div className="bg-white dark:bg-surface-dark rounded-xl p-4 mb-6 shadow-sm border border-gray-100 dark:border-gray-800 animate-fade-in">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-bold">ตัวกรองขั้นสูง</h3>
                                <button onClick={clearFilters} className="text-sm text-neon-purple hover:underline">
                                    ล้างทั้งหมด
                                </button>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div>
                                    <label className="text-xs font-medium text-text-secondary mb-1 block">ราคาต่ำสุด</label>
                                    <input
                                        type="number"
                                        value={priceRange.min}
                                        onChange={(e) => setPriceRange(p => ({ ...p, min: e.target.value }))}
                                        placeholder="฿0"
                                        className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-medium text-text-secondary mb-1 block">ราคาสูงสุด</label>
                                    <input
                                        type="number"
                                        value={priceRange.max}
                                        onChange={(e) => setPriceRange(p => ({ ...p, max: e.target.value }))}
                                        placeholder="฿999,999"
                                        className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Results Grid */}
                    {results.length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                            {results.map(product => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-16">
                            <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-xl font-bold mb-2">ไม่พบสินค้าที่ค้นหา</h3>
                            <p className="text-text-secondary mb-6">ลองค้นหาด้วยคำอื่น หรือลองดูสินค้าทั้งหมด</p>
                            <Button variant="primary" onClick={clearFilters}>
                                ดูสินค้าทั้งหมด
                            </Button>
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    )
}

export default function SearchPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-neon-purple border-t-transparent rounded-full animate-spin"></div>
            </div>
        }>
            <SearchContent />
        </Suspense>
    )
}
