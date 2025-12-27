'use client'

/**
 * CategoriesV2 - AI-Enhanced Category Navigation
 * 
 * Features:
 * - Dynamic trending indicators
 * - Category popularity scores
 * - Smart visual hierarchy
 * - AI-powered category suggestions
 * - International-ready design
 */

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import {
    ChevronRight, TrendingUp, Sparkles, Flame, Star,
    Smartphone, Car, Home, ShoppingBag, Watch, Laptop,
    Shirt, Baby, PawPrint, Gamepad2, Dumbbell, Gem,
    Palette, BookOpen, Gift, MoreHorizontal, Zap, Search,
    ArrowRight
} from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import { CATEGORIES } from '@/constants/categories'

// ==========================================
// CATEGORY ICONS MAPPING
// ==========================================

const CATEGORY_ICONS: Record<number, React.ElementType> = {
    1: Smartphone,   // มือถือ
    2: Car,          // ยานยนต์
    3: Home,         // อสังหาริมทรัพย์
    4: Laptop,       // คอมพิวเตอร์
    5: Home,         // เครื่องใช้ไฟฟ้า
    6: ShoppingBag,  // แฟชั่น
    7: Watch,        // นาฬิกา/แว่น
    8: Gamepad2,     // เกม/คอนโซล
    9: Baby,         // เด็ก/ของเล่น
    10: PawPrint,    // สัตว์เลี้ยง
    11: Dumbbell,    // กีฬา
    12: Gift,        // งานอดิเรก
    13: Palette,     // บ้านและสวน
    14: Gem,         // ความงาม
    15: BookOpen,    // หนังสือ
    16: Gem,         // เครื่องประดับ
    17: Shirt,       // เสื้อผ้า
}

// Mock trending data (would come from API in production)
const TRENDING_CATEGORIES = [1, 2, 3, 6, 7]
const HOT_CATEGORIES = [1, 4]
const NEW_CATEGORIES = [12, 17]

// ==========================================
// TYPES
// ==========================================

interface CategoryData {
    id: number
    name_th: string
    name_en: string
    slug: string
    icon?: React.ElementType
    emoji?: string
    itemCount?: number
    trendingScore?: number
    isHot?: boolean
    isNew?: boolean
    color?: string
}

// ==========================================
// MAIN COMPONENT
// ==========================================

export default function CategoriesV2() {
    const { language, t } = useLanguage()
    const [selectedTab, setSelectedTab] = useState<'all' | 'trending' | 'new'>('all')
    const [isExpanded, setIsExpanded] = useState(false)
    const [hoveredCategory, setHoveredCategory] = useState<number | null>(null)

    // Transform categories to enhanced data (use deterministic values to avoid hydration mismatch)
    const enhancedCategories = useMemo<CategoryData[]>(() => {
        return CATEGORIES.map(cat => ({
            id: cat.id,
            name_th: cat.name_th,
            name_en: cat.name_en,
            slug: cat.slug,
            icon: CATEGORY_ICONS[cat.id],
            emoji: cat.icon, // Use icon field from Category (contains emoji string)
            // Use deterministic values based on category ID to avoid hydration mismatch
            itemCount: ((cat.id * 347) % 5000) + 100,
            trendingScore: TRENDING_CATEGORIES.includes(cat.id)
                ? ((cat.id * 17) % 50) + 50
                : ((cat.id * 13) % 30),
            isHot: HOT_CATEGORIES.includes(cat.id),
            isNew: NEW_CATEGORIES.includes(cat.id),
            color: getColorForCategory(cat.id)
        }))
    }, [])

    // Filter by tab
    const displayedCategories = useMemo(() => {
        let filtered = enhancedCategories
        if (selectedTab === 'trending') {
            filtered = enhancedCategories.filter(cat => TRENDING_CATEGORIES.includes(cat.id))
        } else if (selectedTab === 'new') {
            filtered = enhancedCategories.filter(cat => NEW_CATEGORIES.includes(cat.id))
        }
        return isExpanded ? filtered : filtered.slice(0, 12)
    }, [enhancedCategories, selectedTab, isExpanded])

    // Top trending for header
    const topTrending = useMemo(() => {
        return enhancedCategories
            .filter(cat => TRENDING_CATEGORIES.includes(cat.id))
            .slice(0, 5)
    }, [enhancedCategories])

    return (
        <section className="py-8 bg-white dark:bg-slate-900">
            <div className="container mx-auto px-4">

                {/* HEADER */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                            <Search className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
                                {language === 'th' ? 'หมวดหมู่สินค้า' : 'Categories'}
                            </h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                                <Sparkles className="w-3 h-3 text-purple-500" />
                                {language === 'th' ? 'AI แนะนำสำหรับคุณ' : 'AI-powered recommendations'}
                            </p>
                        </div>
                    </div>

                    {/* QUICK TABS */}
                    <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
                        <TabButton
                            active={selectedTab === 'all'}
                            onClick={() => setSelectedTab('all')}
                            icon={<MoreHorizontal className="w-4 h-4" />}
                            label={language === 'th' ? 'ทั้งหมด' : 'All'}
                        />
                        <TabButton
                            active={selectedTab === 'trending'}
                            onClick={() => setSelectedTab('trending')}
                            icon={<TrendingUp className="w-4 h-4" />}
                            label={language === 'th' ? 'มาแรง' : 'Trending'}
                            highlight
                        />
                        <TabButton
                            active={selectedTab === 'new'}
                            onClick={() => setSelectedTab('new')}
                            icon={<Zap className="w-4 h-4" />}
                            label={language === 'th' ? 'ใหม่' : 'New'}
                        />
                    </div>
                </div>

                {/* TRENDING QUICK LINKS */}
                <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
                    <span className="text-xs font-medium text-gray-400 whitespace-nowrap">
                        <Flame className="w-3 h-3 inline mr-1 text-orange-500" />
                        {language === 'th' ? 'กำลังฮิต:' : 'Hot now:'}
                    </span>
                    {topTrending.map(cat => (
                        <Link
                            key={cat.id}
                            href={`/category/${cat.slug}`}
                            className="px-3 py-1.5 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 
                                     text-orange-600 dark:text-orange-400 text-sm font-medium rounded-full 
                                     hover:from-orange-100 hover:to-red-100 transition-colors whitespace-nowrap
                                     border border-orange-200 dark:border-orange-800"
                        >
                            {cat.emoji} {language === 'th' ? cat.name_th : cat.name_en}
                        </Link>
                    ))}
                </div>

                {/* CATEGORIES GRID */}
                <motion.div
                    layout
                    className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3 md:gap-4"
                >
                    <AnimatePresence mode="popLayout">
                        {displayedCategories.map((category, index) => (
                            <motion.div
                                key={category.id}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.2, delay: index * 0.02 }}
                            >
                                <CategoryCard
                                    category={category}
                                    language={language as 'th' | 'en'}
                                    isHovered={hoveredCategory === category.id}
                                    onHover={() => setHoveredCategory(category.id)}
                                    onLeave={() => setHoveredCategory(null)}
                                />
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>

                {/* EXPAND/COLLAPSE BUTTON */}
                {enhancedCategories.length > 12 && (
                    <div className="mt-6 text-center">
                        <button
                            onClick={() => setIsExpanded(!isExpanded)}
                            className="inline-flex items-center gap-2 px-6 py-3 bg-gray-100 dark:bg-slate-800 
                                     text-gray-700 dark:text-gray-300 rounded-xl font-medium
                                     hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors"
                        >
                            {isExpanded
                                ? (language === 'th' ? 'แสดงน้อยลง' : 'Show Less')
                                : (language === 'th' ? 'ดูทั้งหมด' : 'View All')
                            }
                            <ChevronRight className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                        </button>
                    </div>
                )}

                {/* AI SUGGESTION BANNER */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="mt-8 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 rounded-2xl p-4 md:p-6"
                >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                                <Sparkles className="w-6 h-6 text-white" />
                            </div>
                            <div className="text-white">
                                <h3 className="font-bold">
                                    {language === 'th' ? 'ไม่แน่ใจว่าจะหาอะไร?' : "Not sure what to look for?"}
                                </h3>
                                <p className="text-sm text-white/80">
                                    {language === 'th'
                                        ? 'ให้ AI ช่วยค้นหาสินค้าที่ใช่สำหรับคุณ'
                                        : 'Let AI find the perfect items for you'}
                                </p>
                            </div>
                        </div>
                        <Link
                            href="/ai-discover"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-purple-600 
                                     rounded-xl font-bold hover:bg-gray-50 transition-colors self-start md:self-auto"
                        >
                            {language === 'th' ? 'ค้นหากับ AI' : 'Discover with AI'}
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                </motion.div>
            </div>
        </section>
    )
}

// ==========================================
// CATEGORY CARD SUBCOMPONENT
// ==========================================

interface CategoryCardProps {
    category: CategoryData
    language: 'th' | 'en'
    isHovered: boolean
    onHover: () => void
    onLeave: () => void
}

function CategoryCard({ category, language, isHovered, onHover, onLeave }: CategoryCardProps) {
    const Icon = category.icon || ShoppingBag

    return (
        <Link href={`/category/${category.slug}`}>
            <motion.div
                onHoverStart={onHover}
                onHoverEnd={onLeave}
                whileHover={{ scale: 1.05, y: -4 }}
                whileTap={{ scale: 0.98 }}
                className={`
                    relative flex flex-col items-center p-4 rounded-2xl border
                    bg-white dark:bg-slate-800 
                    border-gray-100 dark:border-slate-700
                    hover:border-purple-300 dark:hover:border-purple-700
                    hover:shadow-lg hover:shadow-purple-500/10
                    transition-all duration-300 cursor-pointer
                    overflow-hidden group
                `}
            >
                {/* Background Gradient */}
                <div
                    className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                    style={{
                        background: `linear-gradient(135deg, ${category.color}10, ${category.color}05)`
                    }}
                />

                {/* Badges */}
                <div className="absolute top-1 right-1 flex flex-col gap-0.5">
                    {category.isHot && (
                        <span className="px-1.5 py-0.5 bg-red-500 text-white text-[8px] font-bold rounded-full">
                            🔥
                        </span>
                    )}
                    {category.isNew && (
                        <span className="px-1.5 py-0.5 bg-blue-500 text-white text-[8px] font-bold rounded-full">
                            NEW
                        </span>
                    )}
                </div>

                {/* Icon */}
                <div
                    className={`
                        w-14 h-14 rounded-2xl mb-3 flex items-center justify-center
                        transition-all duration-300
                        ${isHovered
                            ? 'bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-lg'
                            : 'bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-400'
                        }
                    `}
                >
                    {category.emoji ? (
                        <span className="text-2xl">{category.emoji}</span>
                    ) : (
                        <Icon className="w-6 h-6" />
                    )}
                </div>

                {/* Name */}
                <h3 className="text-sm font-medium text-center text-gray-900 dark:text-white line-clamp-2 min-h-[40px]">
                    {language === 'th' ? category.name_th : category.name_en}
                </h3>

                {/* Item Count */}
                {category.itemCount && (
                    <span className="text-[10px] text-gray-400 dark:text-gray-500 mt-1">
                        {category.itemCount.toLocaleString()} {language === 'th' ? 'รายการ' : 'items'}
                    </span>
                )}

                {/* Trending Indicator */}
                {category.trendingScore && category.trendingScore > 40 && (
                    <div className="absolute bottom-1 left-1/2 -translate-x-1/2">
                        <span className="flex items-center gap-0.5 text-[9px] text-green-600 dark:text-green-400 font-medium">
                            <TrendingUp className="w-2.5 h-2.5" />
                            +{category.trendingScore}%
                        </span>
                    </div>
                )}
            </motion.div>
        </Link>
    )
}

// ==========================================
// TAB BUTTON SUBCOMPONENT
// ==========================================

interface TabButtonProps {
    active: boolean
    onClick: () => void
    icon: React.ReactNode
    label: string
    highlight?: boolean
}

function TabButton({ active, onClick, icon, label, highlight }: TabButtonProps) {
    return (
        <button
            onClick={onClick}
            className={`
                flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm
                transition-all duration-200 whitespace-nowrap
                ${active
                    ? highlight
                        ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg'
                        : 'bg-purple-600 text-white shadow-lg'
                    : 'bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-slate-700'
                }
            `}
        >
            {icon}
            {label}
        </button>
    )
}

// ==========================================
// HELPER FUNCTIONS
// ==========================================

function getColorForCategory(id: number): string {
    const colors = [
        '#6366f1', // indigo
        '#8b5cf6', // violet
        '#a855f7', // purple
        '#d946ef', // fuchsia
        '#ec4899', // pink
        '#f43f5e', // rose
        '#ef4444', // red
        '#f97316', // orange
        '#f59e0b', // amber
        '#84cc16', // lime
        '#22c55e', // green
        '#14b8a6', // teal
        '#06b6d4', // cyan
        '#0ea5e9', // sky
        '#3b82f6', // blue
    ]
    return colors[id % colors.length]
}
