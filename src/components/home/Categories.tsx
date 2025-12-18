'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { CATEGORIES } from '@/constants/categories'
import { getFrequentCategories, getTopSearches } from '@/services/behaviorTracking'
import { Sparkles, MapPin, TrendingUp, ChevronRight } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

export default function Categories() {
    const { t, language } = useLanguage()
    const [frequentCats, setFrequentCats] = useState<{ id: number, name: string }[]>([])
    const [activeTab, setActiveTab] = useState<'all' | 'popular'>('all')

    useEffect(() => {
        const loadAiData = async () => {
            // Load frequent categories
            const frequent = await getFrequentCategories(5)
            setFrequentCats(frequent)
        }
        loadAiData()
    }, [])

    return (
        <section className="py-8">
            <div className="container mx-auto px-4">

                {/* AI Header Suggestions */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
                    <div>
                        <h2 className="text-xl md:text-2xl font-display font-bold flex items-center gap-2">
                            {t('home.cat_title')}
                            {frequentCats.length > 0 && (
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-normal bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300">
                                    <Sparkles className="w-3 h-3 mr-1" /> {t('home.cat_recommended')}
                                </span>
                            )}
                        </h2>
                    </div>

                    {/* Quick Filters / AI Chips */}
                    <div className="flex overflow-x-auto gap-2 no-scrollbar pb-2 md:pb-0">
                        <Link href="/search?sort=nearby">
                            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-700 hover:border-purple-500 hover:text-purple-600 transition-colors whitespace-nowrap">
                                <MapPin className="w-3 h-3 text-red-500" />
                                {t('home.cat_near_me')}
                            </button>
                        </Link>
                        {frequentCats.map(cat => {
                            // Find actual category object to get localized names
                            const fullCat = CATEGORIES.find(c => c.id === cat.id) ||
                                CATEGORIES.flatMap(c => c.subcategories || []).find(s => s.id === cat.id)

                            if (!fullCat) return null;

                            return (
                                <Link key={cat.id} href={`/category/${fullCat.slug || cat.id}`}>
                                    <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-700 hover:border-purple-500 hover:text-purple-600 transition-colors whitespace-nowrap">
                                        <Sparkles className="w-3 h-3 text-yellow-500" />
                                        {language === 'th' ? fullCat.name_th : fullCat.name_en}
                                    </button>
                                </Link>
                            )
                        })}
                    </div>
                </div>

                {/* Main Category Grid */}
                <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-3 md:gap-4">
                    {CATEGORIES.map((category) => (
                        <Link
                            key={category.id}
                            href={`/category/${category.slug}`}
                            className="group relative flex flex-col items-center"
                        >
                            {/* Card Body */}
                            <div className="w-full aspect-square flex flex-col items-center justify-center p-2 rounded-2xl bg-white dark:bg-surface-dark border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md hover:border-purple-200 dark:hover:border-purple-900 transition-all duration-300 group-hover:-translate-y-1">
                                <div className="text-3xl md:text-3xl mb-1 group-hover:scale-110 transition-transform duration-300 filter drop-shadow-sm">
                                    {category.icon}
                                </div>
                                {/* Mobile-optimized text */}
                                <span className="text-[10px] md:text-xs text-center font-medium text-gray-700 dark:text-gray-300 leading-tight line-clamp-2 px-1 group-hover:text-purple-600 dark:group-hover:text-purple-400">
                                    {language === 'th' ? category.name_th : category.name_en}
                                </span>
                            </div>

                            {/* Badges */}
                            {category.is_hot && (
                                <span className="absolute -top-1 -right-1 flex h-4 w-4">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 text-[8px] text-white items-center justify-center font-bold">H</span>
                                </span>
                            )}
                            {category.is_new && (
                                <span className="absolute -top-1 -right-1 px-1.5 py-0.5 bg-blue-500 text-white text-[8px] font-bold rounded-full shadow-sm">
                                    NEW
                                </span>
                            )}
                        </Link>
                    ))}

                    {/* 'See All' Card (if needed or just use link) */}
                    <Link href="/categories" className="flex flex-col items-center group">
                        <div className="w-full aspect-square flex flex-col items-center justify-center p-2 rounded-2xl bg-gray-50 dark:bg-gray-800 border-2 border-dashed border-gray-200 dark:border-gray-700 hover:border-purple-300 hover:bg-purple-50 dark:hover:bg-purple-900/10 transition-all">
                            <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mb-1 group-hover:bg-white dark:group-hover:bg-gray-600">
                                <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-purple-500" />
                            </div>
                            <span className="text-[10px] md:text-xs text-center font-medium text-gray-500">{t('home.cat_see_all')}</span>
                        </div>
                    </Link>
                </div>

                {/* Dynamic Subcategories / Popular Niches (Horizontal Scroll) */}
                <div className="mt-8">
                    <div className="flex items-center gap-2 mb-4">
                        <TrendingUp className="w-4 h-4 text-orange-500" />
                        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200">{t('home.cat_popular')}</h3>
                    </div>

                    <div className="flex overflow-x-auto gap-3 pb-4 no-scrollbar mask-gradient-right">
                        {/* Flatten some popular subcategories manually for demo */}
                        {[
                            ...CATEGORIES.find(c => c.slug === 'mobiles')?.subcategories || [],
                            ...CATEGORIES.find(c => c.slug === 'automotive')?.subcategories || [],
                            ...CATEGORIES.find(c => c.slug === 'real-estate')?.subcategories || []
                        ].slice(0, 10).map((sub) => (
                            <Link
                                key={sub.id}
                                href={`/category/${CATEGORIES.find(c => c.subcategories?.some(s => s.id === sub.id))?.slug}?sub=${sub.id}`}
                            >
                                <div className="min-w-[120px] md:min-w-[140px] p-3 rounded-xl bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-800/50 border border-gray-100 dark:border-gray-700 hover:shadow-md hover:border-purple-200 transition-all cursor-pointer">
                                    <span className="block text-xs text-gray-400 mb-1">
                                        {language === 'th'
                                            ? CATEGORIES.find(c => c.subcategories?.some(s => s.id === sub.id))?.name_th
                                            : CATEGORIES.find(c => c.subcategories?.some(s => s.id === sub.id))?.name_en}
                                    </span>
                                    <span className="block text-sm font-medium text-gray-800 dark:text-gray-200 truncate">
                                        {language === 'th' ? sub.name_th : sub.name_en}
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>

            </div>
        </section>
    )
}
