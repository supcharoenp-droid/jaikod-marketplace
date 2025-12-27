'use client'

/**
 * 📂 Categories Page - Redesigned for Better UX
 * 
 * Features:
 * - Compact hero section
 * - Grid layout with subcategories
 * - Responsive design
 * - Smooth hover effects
 */

import { useState } from 'react'
import Link from 'next/link'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { CATEGORIES } from '@/constants/categories'
import { MOCK_PRODUCTS } from '@/constants/mockProducts'
import { ArrowRight, ChevronDown, ChevronUp, Search, Sparkles, TrendingUp, Grid3X3, List } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

export default function CategoriesPage() {
    const { language } = useLanguage()
    const lang = language as 'th' | 'en'

    const [expandedCategory, setExpandedCategory] = useState<number | null>(null)
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
    const [searchTerm, setSearchTerm] = useState('')

    // Count products per category
    const categoryCounts = CATEGORIES.map(cat => ({
        ...cat,
        count: MOCK_PRODUCTS.filter(p => p.category_id === cat.id).length,
        subcategoryCount: cat.subcategories?.length || 0
    }))

    // Filter categories by search
    const filteredCategories = searchTerm
        ? categoryCounts.filter(cat =>
            cat.name_th.toLowerCase().includes(searchTerm.toLowerCase()) ||
            cat.name_en.toLowerCase().includes(searchTerm.toLowerCase()) ||
            cat.subcategories?.some(sub =>
                sub.name_th.toLowerCase().includes(searchTerm.toLowerCase()) ||
                sub.name_en.toLowerCase().includes(searchTerm.toLowerCase())
            )
        )
        : categoryCounts

    // Hot categories (marked with is_hot or first 6)
    const hotCategories = categoryCounts.filter(c => c.is_hot).slice(0, 6)
    const newCategories = categoryCounts.filter(c => c.is_new)

    return (
        <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
            <Header />
            <main className="flex-1">
                {/* Compact Hero */}
                <section className="py-6 md:py-8 bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700">
                    <div className="container mx-auto px-4">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                            <div>
                                <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-2">
                                    📂 {lang === 'th' ? 'หมวดหมู่ทั้งหมด' : 'All Categories'}
                                </h1>
                                <p className="text-purple-200 text-sm mt-1">
                                    {lang === 'th'
                                        ? `${CATEGORIES.length} หมวดหลัก • ${CATEGORIES.reduce((acc, c) => acc + (c.subcategories?.length || 0), 0)}+ หมวดย่อย`
                                        : `${CATEGORIES.length} main • ${CATEGORIES.reduce((acc, c) => acc + (c.subcategories?.length || 0), 0)}+ sub`
                                    }
                                </p>
                            </div>

                            {/* Search */}
                            <div className="relative w-full md:w-80">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder={lang === 'th' ? 'ค้นหาหมวดหมู่...' : 'Search categories...'}
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-purple-200 focus:outline-none focus:ring-2 focus:ring-white/30"
                                />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Hot Tags */}
                {!searchTerm && hotCategories.length > 0 && (
                    <section className="py-4 bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700">
                        <div className="container mx-auto px-4">
                            <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-1">
                                <span className="flex items-center gap-1 text-sm text-gray-500 whitespace-nowrap">
                                    <TrendingUp className="w-4 h-4 text-red-500" />
                                    {lang === 'th' ? 'ยอดนิยม:' : 'Trending:'}
                                </span>
                                {hotCategories.map(cat => (
                                    <Link
                                        key={cat.id}
                                        href={`/category/${cat.slug}`}
                                        className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-full text-sm font-medium hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors whitespace-nowrap"
                                    >
                                        <span>{cat.icon}</span>
                                        {lang === 'th' ? cat.name_th : cat.name_en}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </section>
                )}

                {/* Main Categories Grid */}
                <section className="py-6 md:py-8">
                    <div className="container mx-auto px-4">
                        {/* View Toggle */}
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-bold text-gray-800 dark:text-white">
                                {searchTerm
                                    ? `${lang === 'th' ? 'ผลการค้นหา' : 'Search Results'} (${filteredCategories.length})`
                                    : lang === 'th' ? 'เลือกหมวดหมู่' : 'Browse Categories'
                                }
                            </h2>
                            <div className="flex gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
                                <button
                                    onClick={() => setViewMode('grid')}
                                    className={`p-2 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-white dark:bg-gray-700 shadow-sm' : 'hover:bg-gray-200 dark:hover:bg-gray-700'}`}
                                >
                                    <Grid3X3 className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => setViewMode('list')}
                                    className={`p-2 rounded-md transition-colors ${viewMode === 'list' ? 'bg-white dark:bg-gray-700 shadow-sm' : 'hover:bg-gray-200 dark:hover:bg-gray-700'}`}
                                >
                                    <List className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        {/* Grid View */}
                        {viewMode === 'grid' && (
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                                {filteredCategories.map((category) => (
                                    <div
                                        key={category.id}
                                        className="group relative"
                                    >
                                        {/* Main Card */}
                                        <Link
                                            href={`/category/${category.slug}`}
                                            className="block bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm hover:shadow-md border border-gray-100 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-700 transition-all"
                                        >
                                            {/* Badges */}
                                            {category.is_hot && (
                                                <span className="absolute -top-1 -right-1 px-1.5 py-0.5 bg-red-500 text-white text-[9px] font-bold rounded-full">
                                                    🔥
                                                </span>
                                            )}
                                            {category.is_new && (
                                                <span className="absolute -top-1 -right-1 px-1.5 py-0.5 bg-blue-500 text-white text-[9px] font-bold rounded-full">
                                                    NEW
                                                </span>
                                            )}

                                            {/* Icon */}
                                            <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">
                                                {category.icon}
                                            </div>

                                            {/* Name */}
                                            <h3 className="font-semibold text-sm text-gray-800 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors line-clamp-2 leading-tight">
                                                {lang === 'th' ? category.name_th : category.name_en}
                                            </h3>

                                            {/* Subcategory count */}
                                            <p className="text-xs text-gray-400 mt-1">
                                                {category.subcategoryCount} {lang === 'th' ? 'หมวดย่อย' : 'subcategories'}
                                            </p>
                                        </Link>

                                        {/* Expand Button */}
                                        {category.subcategories && category.subcategories.length > 0 && (
                                            <button
                                                onClick={() => setExpandedCategory(expandedCategory === category.id ? null : category.id)}
                                                className="absolute bottom-2 right-2 p-1 bg-gray-100 dark:bg-gray-700 rounded-full hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors"
                                            >
                                                {expandedCategory === category.id
                                                    ? <ChevronUp className="w-3 h-3 text-purple-600" />
                                                    : <ChevronDown className="w-3 h-3 text-gray-400" />
                                                }
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* List View */}
                        {viewMode === 'list' && (
                            <div className="space-y-2">
                                {filteredCategories.map((category) => (
                                    <div key={category.id} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
                                        {/* Category Header */}
                                        <div
                                            className="flex items-center gap-3 p-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
                                            onClick={() => setExpandedCategory(expandedCategory === category.id ? null : category.id)}
                                        >
                                            <span className="text-2xl">{category.icon}</span>
                                            <div className="flex-1">
                                                <h3 className="font-semibold text-gray-800 dark:text-white">
                                                    {lang === 'th' ? category.name_th : category.name_en}
                                                </h3>
                                                <p className="text-xs text-gray-400">
                                                    {category.subcategoryCount} {lang === 'th' ? 'หมวดย่อย' : 'subcategories'}
                                                </p>
                                            </div>

                                            {/* Badges */}
                                            {category.is_hot && (
                                                <span className="px-2 py-0.5 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-xs font-medium rounded-full">
                                                    🔥 HOT
                                                </span>
                                            )}
                                            {category.is_new && (
                                                <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-medium rounded-full">
                                                    ✨ NEW
                                                </span>
                                            )}

                                            <Link
                                                href={`/category/${category.slug}`}
                                                className="px-3 py-1.5 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 text-sm font-medium rounded-lg hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                {lang === 'th' ? 'ดูทั้งหมด' : 'View All'}
                                            </Link>

                                            <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${expandedCategory === category.id ? 'rotate-180' : ''}`} />
                                        </div>

                                        {/* Subcategories */}
                                        {expandedCategory === category.id && category.subcategories && (
                                            <div className="px-3 pb-3 pt-1 border-t border-gray-100 dark:border-gray-700">
                                                <div className="flex flex-wrap gap-2">
                                                    {category.subcategories.map(sub => (
                                                        <Link
                                                            key={sub.id}
                                                            href={`/category/${category.slug}?sub=${sub.id}`}
                                                            className="px-3 py-1.5 bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                                                        >
                                                            {lang === 'th' ? sub.name_th : sub.name_en}
                                                        </Link>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* No Results */}
                        {filteredCategories.length === 0 && (
                            <div className="text-center py-12">
                                <div className="text-4xl mb-3">🔍</div>
                                <p className="text-gray-500">
                                    {lang === 'th' ? 'ไม่พบหมวดหมู่ที่ค้นหา' : 'No categories found'}
                                </p>
                            </div>
                        )}
                    </div>
                </section>

                {/* New Categories Highlight */}
                {!searchTerm && newCategories.length > 0 && (
                    <section className="py-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10">
                        <div className="container mx-auto px-4">
                            <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                                <Sparkles className="w-5 h-5 text-blue-500" />
                                {lang === 'th' ? 'หมวดหมู่ใหม่' : 'New Categories'}
                            </h3>
                            <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
                                {newCategories.map(cat => (
                                    <Link
                                        key={cat.id}
                                        href={`/category/${cat.slug}`}
                                        className="flex-shrink-0 flex items-center gap-3 px-4 py-3 bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md border border-blue-100 dark:border-blue-900/30 transition-all"
                                    >
                                        <span className="text-2xl">{cat.icon}</span>
                                        <div>
                                            <h4 className="font-semibold text-gray-800 dark:text-white text-sm">
                                                {lang === 'th' ? cat.name_th : cat.name_en}
                                            </h4>
                                            <p className="text-xs text-gray-400">
                                                {cat.subcategoryCount} {lang === 'th' ? 'หมวดย่อย' : 'sub'}
                                            </p>
                                        </div>
                                        <ArrowRight className="w-4 h-4 text-blue-500" />
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </section>
                )}

                {/* Quick Actions */}
                <section className="py-6">
                    <div className="container mx-auto px-4">
                        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-5 md:p-6">
                            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                                <div className="text-center sm:text-left">
                                    <h2 className="text-lg font-bold text-white mb-1">
                                        {lang === 'th' ? 'มีของอยากขาย?' : 'Got something to sell?'}
                                    </h2>
                                    <p className="text-purple-200 text-sm">
                                        {lang === 'th' ? 'ลงขายฟรี ไม่มีค่าธรรมเนียม' : 'List for free, no fees'}
                                    </p>
                                </div>
                                <div className="flex gap-3">
                                    <Link
                                        href="/sell"
                                        className="px-5 py-2.5 bg-white text-purple-600 rounded-xl font-bold text-sm hover:bg-purple-50 transition-colors shadow-lg"
                                    >
                                        📦 {lang === 'th' ? 'ลงขายเลย' : 'Sell Now'}
                                    </Link>
                                    <Link
                                        href="/sell/ai-detect"
                                        className="px-5 py-2.5 bg-yellow-400 text-yellow-900 rounded-xl font-bold text-sm hover:bg-yellow-300 transition-colors shadow-lg flex items-center gap-1.5"
                                    >
                                        <Sparkles className="w-4 h-4" />
                                        AI Snap
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Stats */}
                <section className="py-6 border-t border-gray-100 dark:border-gray-800">
                    <div className="container mx-auto px-4">
                        <div className="grid grid-cols-4 gap-4 text-center">
                            <div>
                                <div className="text-2xl md:text-3xl font-bold text-purple-600">{CATEGORIES.length}</div>
                                <div className="text-xs text-gray-500">{lang === 'th' ? 'หมวดหลัก' : 'Categories'}</div>
                            </div>
                            <div>
                                <div className="text-2xl md:text-3xl font-bold text-purple-600">
                                    {CATEGORIES.reduce((acc, c) => acc + (c.subcategories?.length || 0), 0)}+
                                </div>
                                <div className="text-xs text-gray-500">{lang === 'th' ? 'หมวดย่อย' : 'Subcategories'}</div>
                            </div>
                            <div>
                                <div className="text-2xl md:text-3xl font-bold text-purple-600">10K+</div>
                                <div className="text-xs text-gray-500">{lang === 'th' ? 'ผู้ขาย' : 'Sellers'}</div>
                            </div>
                            <div>
                                <div className="text-2xl md:text-3xl font-bold text-purple-600">50K+</div>
                                <div className="text-xs text-gray-500">{lang === 'th' ? 'ผู้ใช้' : 'Users'}</div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    )
}
