'use client'

/**
 * ProductSectionV2 - AI-Enhanced Product Display Section
 * 
 * Features:
 * - Uses SmartProductCardV2 for premium display
 * - Horizontal scroll with snap
 * - Grid or slider layouts
 * - AI insights integration
 * - Smart empty states
 * - Skeleton loading
 */

import { useRef, useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
    ChevronLeft, ChevronRight, ArrowRight, Sparkles,
    Package, TrendingUp, Flame, Clock, RefreshCw
} from 'lucide-react'
import { SmartProductData, toSmartProductData } from '@/components/product/SmartProductCardV2'
import SmartProductCardV3 from '@/components/product/SmartProductCardV3'
import { useLanguage } from '@/contexts/LanguageContext'
import { Product } from '@/types'

// ==========================================
// TYPES
// ==========================================

interface ProductSectionV2Props {
    title: string
    subtitle?: string
    icon?: React.ReactNode
    products: Product[] | SmartProductData[]
    viewAllLink?: string
    layout?: 'slider' | 'grid' | 'featured'
    hideHeader?: boolean
    actionButton?: React.ReactNode
    showAIInsights?: boolean
    emptyMessage?: string
    isLoading?: boolean
    onRefresh?: () => void
    maxItems?: number
}

// ==========================================
// SKELETON LOADER
// ==========================================

function ProductSkeleton() {
    return (
        <div className="animate-pulse">
            <div className="aspect-square bg-gradient-to-br from-gray-200 to-gray-100 dark:from-slate-700 dark:to-slate-800 rounded-2xl mb-3" />
            <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded-lg w-4/5 mb-2" />
            <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded-lg w-2/3 mb-3" />
            <div className="h-5 bg-gray-200 dark:bg-slate-700 rounded-lg w-1/2" />
        </div>
    )
}

// ==========================================
// MAIN COMPONENT
// ==========================================

export default function ProductSectionV2({
    title,
    subtitle,
    icon,
    products,
    viewAllLink,
    layout = 'slider',
    hideHeader = false,
    actionButton,
    showAIInsights = true,
    emptyMessage,
    isLoading = false,
    onRefresh,
    maxItems
}: ProductSectionV2Props) {
    const { language, t } = useLanguage()
    const scrollContainerRef = useRef<HTMLDivElement>(null)
    const [canScrollLeft, setCanScrollLeft] = useState(false)
    const [canScrollRight, setCanScrollRight] = useState(true)

    // Convert products to SmartProductData
    const smartProducts: SmartProductData[] = (products as any[]).map(p => {
        if ('thumbnailUrl' in p) return p as SmartProductData
        return toSmartProductData(p)
    })

    // Limit items if specified
    const displayProducts = maxItems ? smartProducts.slice(0, maxItems) : smartProducts

    // Check scroll position
    const checkScroll = () => {
        const container = scrollContainerRef.current
        if (container) {
            setCanScrollLeft(container.scrollLeft > 0)
            setCanScrollRight(container.scrollLeft < container.scrollWidth - container.clientWidth - 10)
        }
    }

    useEffect(() => {
        checkScroll()
        const container = scrollContainerRef.current
        if (container) {
            container.addEventListener('scroll', checkScroll)
            return () => container.removeEventListener('scroll', checkScroll)
        }
    }, [displayProducts])

    // Scroll handler
    const scroll = (direction: 'left' | 'right') => {
        const container = scrollContainerRef.current
        if (container) {
            const scrollAmount = container.clientWidth * 0.8
            container.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            })
        }
    }

    return (
        <section className="py-6">
            <div className="container mx-auto px-4">

                {/* HEADER */}
                {!hideHeader && (
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            {icon && (
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white">
                                    {icon}
                                </div>
                            )}
                            <div>
                                <h2 className="text-xl md:text-2xl font-display font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                    {title}
                                    {showAIInsights && (
                                        <span className="text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 px-2 py-0.5 rounded-full font-medium">
                                            AI
                                        </span>
                                    )}
                                </h2>
                                {subtitle && (
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        {subtitle}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            {onRefresh && (
                                <button
                                    onClick={onRefresh}
                                    className="p-2 rounded-xl bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors"
                                    title={language === 'th' ? 'รีเฟรช' : 'Refresh'}
                                >
                                    <RefreshCw className="w-4 h-4" />
                                </button>
                            )}

                            {actionButton}

                            {viewAllLink && (
                                <Link
                                    href={viewAllLink}
                                    className="hidden md:flex items-center gap-1 text-sm font-medium text-purple-600 hover:text-purple-700 transition-colors"
                                >
                                    {language === 'th' ? 'ดูทั้งหมด' : 'View All'}
                                    <ArrowRight className="w-4 h-4" />
                                </Link>
                            )}
                        </div>
                    </div>
                )}

                {/* LOADING STATE */}
                {isLoading && (
                    <div className={`grid ${layout === 'grid'
                        ? 'grid-cols-2 md:grid-cols-4 lg:grid-cols-5'
                        : 'grid-cols-2 md:grid-cols-4 lg:grid-cols-5'
                        } gap-3 md:gap-4`}>
                        {[1, 2, 3, 4, 5].map(i => (
                            <ProductSkeleton key={i} />
                        ))}
                    </div>
                )}

                {/* EMPTY STATE */}
                {!isLoading && displayProducts.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center py-16 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-slate-800 dark:to-slate-900 rounded-2xl"
                    >
                        <div className="w-16 h-16 mx-auto mb-4 bg-gray-200 dark:bg-slate-700 rounded-2xl flex items-center justify-center">
                            <Package className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                            {language === 'th' ? 'ยังไม่มีสินค้า' : 'No products yet'}
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400 mb-4">
                            {emptyMessage || (language === 'th' ? 'สินค้าจะปรากฏที่นี่เร็วๆ นี้' : 'Products will appear here soon')}
                        </p>
                        <Link
                            href="/sell"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl hover:opacity-90 transition-opacity"
                        >
                            <Sparkles className="w-4 h-4" />
                            {language === 'th' ? 'ลงขายสินค้าแรก' : 'List your first item'}
                        </Link>
                    </motion.div>
                )}

                {/* SLIDER LAYOUT */}
                {!isLoading && displayProducts.length > 0 && layout === 'slider' && (
                    <div className="relative group">
                        {/* Scroll Buttons */}
                        <AnimatePresence>
                            {canScrollLeft && (
                                <motion.button
                                    initial={{ opacity: 0, x: 10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 10 }}
                                    onClick={() => scroll('left')}
                                    className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 z-20 w-10 h-10 bg-white dark:bg-slate-800 rounded-full shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-50 dark:hover:bg-slate-700"
                                >
                                    <ChevronLeft className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                                </motion.button>
                            )}
                        </AnimatePresence>

                        <AnimatePresence>
                            {canScrollRight && (
                                <motion.button
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -10 }}
                                    onClick={() => scroll('right')}
                                    className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 z-20 w-10 h-10 bg-white dark:bg-slate-800 rounded-full shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-50 dark:hover:bg-slate-700"
                                >
                                    <ChevronRight className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                                </motion.button>
                            )}
                        </AnimatePresence>

                        {/* Scroll Container */}
                        <div
                            ref={scrollContainerRef}
                            className="flex gap-3 md:gap-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory scroll-p-4 -mx-4 px-4"
                        >
                            {displayProducts.map((product, idx) => (
                                <motion.div
                                    key={product.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.05 }}
                                    className="flex-shrink-0 w-[48vw] md:w-[24vw] lg:w-[19vw] xl:w-[16vw] snap-start"
                                >
                                    <SmartProductCardV3
                                        product={product}
                                        showAIInsights={showAIInsights}
                                    />
                                </motion.div>
                            ))}
                        </div>
                    </div>
                )}

                {/* GRID LAYOUT */}
                {!isLoading && displayProducts.length > 0 && layout === 'grid' && (
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
                        {displayProducts.map((product, idx) => (
                            <motion.div
                                key={product.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.03 }}
                            >
                                <SmartProductCardV3
                                    product={product}
                                    showAIInsights={showAIInsights}
                                />
                            </motion.div>
                        ))}
                    </div>
                )}

                {/* FEATURED LAYOUT */}
                {!isLoading && displayProducts.length > 0 && layout === 'featured' && (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                        {/* First item is larger */}
                        {displayProducts[0] && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="col-span-2 row-span-2"
                            >
                                <SmartProductCardV3
                                    product={displayProducts[0]}
                                    variant="featured"
                                    showAIInsights={showAIInsights}
                                />
                            </motion.div>
                        )}

                        {/* Rest are regular */}
                        {displayProducts.slice(1).map((product, idx) => (
                            <motion.div
                                key={product.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: (idx + 1) * 0.05 }}
                            >
                                <SmartProductCardV3
                                    product={product}
                                    showAIInsights={showAIInsights}
                                />
                            </motion.div>
                        ))}
                    </div>
                )}

                {/* MOBILE VIEW ALL */}
                {!isLoading && viewAllLink && displayProducts.length > 0 && (
                    <div className="mt-6 text-center md:hidden">
                        <Link
                            href={viewAllLink}
                            className="inline-flex items-center justify-center w-full px-6 py-3 bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 font-medium rounded-xl hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors"
                        >
                            {language === 'th' ? 'ดูสินค้าทั้งหมด' : 'View All Products'}
                            <ArrowRight className="w-4 h-4 ml-2" />
                        </Link>
                    </div>
                )}
            </div>
        </section>
    )
}

// ==========================================
// PRESET SECTIONS
// ==========================================

export function TrendingSection({ products }: { products: Product[] }) {
    const { language } = useLanguage()
    return (
        <ProductSectionV2
            title={language === 'th' ? '🔥 กำลังเทรนด์วันนี้' : '🔥 Trending Today'}
            subtitle={language === 'th' ? 'สิ่งที่คนสนใจมากที่สุด' : 'Most popular right now'}
            icon={<TrendingUp className="w-5 h-5" />}
            products={products}
            viewAllLink="/search?sort=trending"
            layout="slider"
        />
    )
}

export function HotDealsSection({ products }: { products: Product[] }) {
    const { language } = useLanguage()
    return (
        <div className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/10 dark:to-red-900/10 py-8 rounded-3xl mx-[-1rem] px-4 md:mx-0">
            <ProductSectionV2
                title={language === 'th' ? '🏆 สินค้ายอดนิยม' : '🏆 Best Sellers'}
                subtitle={language === 'th' ? 'สินค้าขายดีประจำสัปดาห์' : 'This week\'s top sellers'}
                icon={<Flame className="w-5 h-5" />}
                products={products}
                viewAllLink="/search?sort=best_seller"
                layout="grid"
                maxItems={10}
            />
        </div>
    )
}

export function NewArrivalsSection({ products }: { products: Product[] }) {
    const { language } = useLanguage()
    return (
        <ProductSectionV2
            title={language === 'th' ? '✨ มาใหม่ล่าสุด' : '✨ New Arrivals'}
            subtitle={language === 'th' ? 'เพิ่งลงใน 24 ชั่วโมงที่ผ่านมา' : 'Listed in the past 24 hours'}
            icon={<Clock className="w-5 h-5" />}
            products={products}
            viewAllLink="/search?sort=newest"
            layout="slider"
        />
    )
}

export function AIRecommendationSection({ products }: { products: Product[] }) {
    const { language } = useLanguage()
    return (
        <ProductSectionV2
            title={language === 'th' ? '✨ AI แนะนำเฉพาะคุณ' : '✨ AI Picks for You'}
            subtitle={language === 'th' ? 'คัดสรรตามความสนใจของคุณ' : 'Curated based on your interests'}
            icon={<Sparkles className="w-5 h-5" />}
            products={products}
            viewAllLink="/ai-discover"
            layout="grid"
            maxItems={10}
        />
    )
}
