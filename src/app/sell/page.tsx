'use client'

import React, { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
    ChevronRight, Sparkles, X, Check, ArrowRight, Home, Search, ArrowLeft, Zap
} from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import { CATEGORIES as BASE_CATEGORIES } from '@/constants/categories'

// ============================================
// EMOJI MAPPING FOR CATEGORIES
// ============================================
const CATEGORY_EMOJIS: Record<number, string> = {
    1: '🚗',   // Automotive
    2: '🏠',   // Property
    3: '📱',   // Mobile
    4: '💻',   // Computer
    5: '📺',   // Appliances
    6: '👗',   // Fashion
    7: '🎮',   // Gaming
    8: '📷',   // Camera
    9: '🙏',   // Amulets
    10: '🐕',  // Pets
    11: '🔧',  // Services
    12: '⚽',  // Sports
    13: '🏡',  // Home & Garden
    14: '💄',  // Beauty
    15: '👶',  // Baby
    16: '📚',  // Books
    17: '🍜',  // Food & Beverages
    18: '💊',  // Health & Supplements
    19: '🎸',  // Musical Instruments
    20: '💼',  // Jobs & Freelance
    21: '🎟️',  // Tickets & Vouchers
    99: '📦',  // Others
}

// Transform categories from constants to add emoji and slug-based subcategories
const CATEGORIES = BASE_CATEGORIES.map(cat => ({
    id: cat.id,
    slug: cat.slug,
    name_th: cat.name_th,
    name_en: cat.name_en,
    emoji: CATEGORY_EMOJIS[cat.id] || '📦',
    badge: cat.is_hot ? 'hot' as const : cat.is_new ? 'new' as const : undefined,
    subcategories: (cat.subcategories || []).map(sub => ({
        id: sub.id,
        slug: sub.slug,
        name_th: sub.name_th,
        name_en: sub.name_en,
        hot: false, // Can be enhanced later
    }))
}))

// Type definitions
interface SubCategory {
    id: number
    slug: string
    name_th: string
    name_en: string
    hot?: boolean
}

interface MainCategory {
    id: number
    slug: string
    name_th: string
    name_en: string
    emoji: string
    badge?: 'hot' | 'new'
    subcategories: SubCategory[]
}

// ============================================
// MAIN COMPONENT
// ============================================

export default function SellEntryPage() {
    const router = useRouter()
    const { language } = useLanguage()
    const lang = language as 'th' | 'en'

    const [selectedCategory, setSelectedCategory] = useState<MainCategory | null>(null)
    const [showExitConfirm, setShowExitConfirm] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')
    const subcategoryPanelRef = useRef<HTMLDivElement>(null)

    const handleCategoryClick = (cat: MainCategory) => {
        if (cat.id === 99) {
            // Show all categories view
            router.push('/categories')
            return
        }
        setSelectedCategory(cat)

        // Scroll to subcategory panel
        setTimeout(() => {
            subcategoryPanelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }, 100)
    }

    const handleSubcategorySelect = (sub: SubCategory) => {
        // Use new URL format: /sell/[category]/[subcategory]
        if (selectedCategory) {
            router.push(`/sell/${selectedCategory.slug}/${sub.slug}`)
        }
    }

    const handleAISnap = () => {
        router.push('/sell/ai-detect')
    }

    const handleExit = () => {
        // Go to homepage instead of browser back
        router.push('/')
    }

    // Filter categories based on search
    const filteredCategories = searchQuery
        ? CATEGORIES.filter(cat =>
            cat.name_th.toLowerCase().includes(searchQuery.toLowerCase()) ||
            cat.name_en.toLowerCase().includes(searchQuery.toLowerCase())
        )
        : CATEGORIES

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">

            {/* Exit Confirmation Modal */}
            {showExitConfirm && (
                <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-sm w-full p-6 animate-in zoom-in-95 duration-200">
                        <div className="text-center mb-4">
                            <div className="w-16 h-16 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Home className="w-8 h-8 text-amber-600" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2">
                                {lang === 'th' ? 'ออกจากหน้านี้?' : 'Leave this page?'}
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                {lang === 'th'
                                    ? 'คุณจะกลับไปหน้าแรก'
                                    : 'You will return to the homepage'}
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowExitConfirm(false)}
                                className="flex-1 px-4 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                            >
                                {lang === 'th' ? 'ยกเลิก' : 'Cancel'}
                            </button>
                            <button
                                onClick={handleExit}
                                className="flex-1 px-4 py-3 bg-purple-600 text-white rounded-xl font-medium hover:bg-purple-700 transition-colors"
                            >
                                {lang === 'th' ? 'ไปหน้าแรก' : 'Go Home'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modern Header with Glassmorphism */}
            <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-700/50">
                <div className="max-w-5xl mx-auto px-4 py-3">
                    <div className="flex items-center justify-between">
                        {/* Left: Back/Home button */}
                        <button
                            onClick={() => router.push('/')}
                            className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5" />
                            <span className="text-lg font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                                JaiKod
                            </span>
                        </button>

                        {/* Center: Title with Step indicator */}
                        <div className="flex items-center gap-3">
                            <div className="hidden sm:flex items-center gap-2 text-xs text-gray-400">
                                <span className="w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold">1</span>
                                <span className="text-purple-600 font-medium">{lang === 'th' ? 'เลือกหมวดหมู่' : 'Category'}</span>
                                <ChevronRight className="w-4 h-4" />
                                <span className="w-6 h-6 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">2</span>
                                <span>{lang === 'th' ? 'กรอกข้อมูล' : 'Details'}</span>
                                <ChevronRight className="w-4 h-4" />
                                <span className="w-6 h-6 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">3</span>
                                <span>{lang === 'th' ? 'เสร็จสิ้น' : 'Done'}</span>
                            </div>
                            <h1 className="sm:hidden text-sm font-semibold text-gray-700 dark:text-gray-200">
                                {lang === 'th' ? 'ลงขายสินค้า' : 'Sell Item'}
                            </h1>
                        </div>

                        {/* Right: Close button */}
                        <button
                            onClick={() => setShowExitConfirm(true)}
                            className="p-2.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-all"
                            title={lang === 'th' ? 'ปิด' : 'Close'}
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-5xl mx-auto px-4 py-6">

                {/* AI Snap Banner - Minimal */}
                <button
                    onClick={handleAISnap}
                    className="w-full mb-6 bg-gradient-to-r from-violet-600 to-purple-600 rounded-2xl p-4 text-white flex items-center gap-4 group hover:shadow-lg transition-shadow"
                >
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
                        <Sparkles className="w-6 h-6 text-yellow-300" />
                    </div>
                    <div className="flex-1 text-left">
                        <div className="flex items-center gap-2 mb-0.5">
                            <span className="px-2 py-0.5 bg-yellow-400 text-yellow-900 text-[10px] font-bold rounded-full">AI</span>
                            <span className="text-sm font-semibold">{lang === 'th' ? 'ถ่ายรูป ลงขายได้เลย!' : 'Snap & Sell!'}</span>
                        </div>
                        <p className="text-xs text-white/70">{lang === 'th' ? 'AI กรอกให้อัตโนมัติ เร็วกว่า 10 เท่า' : 'AI auto-fills. 10x faster'}</p>
                    </div>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>

                {/* Category Title with Search */}
                <div className="mb-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                        <h2 className="text-lg font-bold text-gray-800 dark:text-white">
                            {lang === 'th' ? '📂 เลือกหมวดหมู่' : '📂 Select Category'}
                        </h2>
                        {/* Search Box */}
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder={lang === 'th' ? 'ค้นหาหมวดหมู่...' : 'Search category...'}
                                className="w-full sm:w-56 pl-9 pr-4 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                            />
                        </div>
                    </div>
                </div>

                {/* Category Grid - Icon Style */}
                {/* Category Grid with Animations */}
                <motion.div
                    className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-7 lg:grid-cols-9 gap-2 md:gap-3 mb-6"
                    initial="hidden"
                    animate="visible"
                    variants={{
                        visible: {
                            transition: {
                                staggerChildren: 0.03
                            }
                        }
                    }}
                >
                    {filteredCategories.map((cat, index) => (
                        <motion.button
                            key={cat.id}
                            onClick={() => handleCategoryClick(cat)}
                            variants={{
                                hidden: { opacity: 0, y: 20, scale: 0.9 },
                                visible: { opacity: 1, y: 0, scale: 1 }
                            }}
                            whileHover={{
                                scale: 1.08,
                                y: -4,
                                transition: { type: 'spring', stiffness: 400, damping: 17 }
                            }}
                            whileTap={{ scale: 0.95 }}
                            className={`
                                relative flex flex-col items-center p-2 md:p-3 rounded-2xl transition-colors duration-200
                                ${selectedCategory?.id === cat.id
                                    ? 'bg-gradient-to-br from-purple-100 to-indigo-100 dark:from-purple-900/50 dark:to-indigo-900/50 ring-2 ring-purple-500 shadow-lg shadow-purple-500/20'
                                    : 'bg-white dark:bg-gray-800 hover:bg-gradient-to-br hover:from-purple-50 hover:to-indigo-50 dark:hover:from-gray-700 dark:hover:to-gray-600'}
                                shadow-sm hover:shadow-lg border border-gray-100 dark:border-gray-700
                            `}
                        >
                            {/* Badge */}
                            {cat.badge && (
                                <motion.span
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className={`
                                        absolute -top-1.5 -right-1.5 w-5 h-5 flex items-center justify-center text-[10px] font-bold rounded-full shadow-sm
                                        ${cat.badge === 'hot'
                                            ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white'
                                            : 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white'}
                                    `}
                                >
                                    {cat.badge === 'hot' ? '🔥' : '✨'}
                                </motion.span>
                            )}

                            {/* Emoji Icon with Hover Effect */}
                            <div className="text-2xl md:text-3xl mb-1.5 transition-transform group-hover:scale-110">
                                {cat.emoji}
                            </div>

                            {/* Selected Indicator */}
                            {selectedCategory?.id === cat.id && (
                                <motion.div
                                    layoutId="selectedCategory"
                                    className="absolute inset-0 rounded-2xl border-2 border-purple-500"
                                    initial={false}
                                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                                />
                            )}

                            {/* Name */}
                            <span className={`
                                text-[10px] md:text-xs text-center leading-tight line-clamp-2 font-medium
                                ${selectedCategory?.id === cat.id
                                    ? 'text-purple-700 dark:text-purple-300'
                                    : 'text-gray-600 dark:text-gray-300'}
                            `}>
                                {lang === 'th' ? cat.name_th : cat.name_en}
                            </span>
                        </motion.button>
                    ))}
                </motion.div>

                {/* Quick Stats / Motivation Banner */}
                {!selectedCategory && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-6 p-4 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-2xl border border-emerald-100 dark:border-emerald-800"
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center">
                                <Zap className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-emerald-800 dark:text-emerald-200">
                                    {lang === 'th' ? '⚡ ลงขายวันนี้ ขายได้เร็วกว่า!' : '⚡ List today, sell faster!'}
                                </p>
                                <p className="text-xs text-emerald-600 dark:text-emerald-400">
                                    {lang === 'th' ? 'สินค้าใหม่มีโอกาสถูกเห็นมากกว่า 3 เท่า' : 'New listings get 3x more visibility'}
                                </p>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Subcategory Panel */}
                <div
                    ref={subcategoryPanelRef}
                    className={`
                        transition-all duration-300 ease-out overflow-hidden
                        ${selectedCategory ? 'opacity-100' : 'opacity-0 pointer-events-none'}
                    `}
                >
                    {selectedCategory && (
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
                            {/* Panel Header */}
                            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-5 py-4 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <span className="text-3xl">{selectedCategory.emoji}</span>
                                    <div>
                                        <h3 className="text-lg font-bold text-white">
                                            {lang === 'th' ? selectedCategory.name_th : selectedCategory.name_en}
                                        </h3>
                                        <p className="text-xs text-white/70">
                                            {lang === 'th' ? 'เลือกประเภทสินค้า' : 'Select item type'}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setSelectedCategory(null)}
                                    className="p-2 hover:bg-white/10 rounded-full transition-colors"
                                >
                                    <X className="w-5 h-5 text-white" />
                                </button>
                            </div>

                            {/* Subcategories Grid */}
                            <div className="p-4">
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                                    {selectedCategory.subcategories.map((sub) => (
                                        <button
                                            key={sub.id}
                                            onClick={() => handleSubcategorySelect(sub)}
                                            className="group flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl border-2 border-transparent hover:border-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all text-left"
                                        >
                                            <div className="flex-1">
                                                <span className="text-sm font-medium text-gray-800 dark:text-gray-200 group-hover:text-purple-700 dark:group-hover:text-purple-300">
                                                    {lang === 'th' ? sub.name_th : sub.name_en}
                                                </span>
                                            </div>

                                            {sub.hot && (
                                                <span className="px-2 py-0.5 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 text-[10px] font-bold rounded-full shrink-0">
                                                    HOT
                                                </span>
                                            )}

                                            <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-purple-600 group-hover:translate-x-1 transition-all shrink-0" />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Tips Section - Show when no category selected */}
                {!selectedCategory && (
                    <div className="mt-6 p-5 bg-blue-50 dark:bg-blue-900/20 rounded-2xl">
                        <h4 className="font-medium text-blue-800 dark:text-blue-300 mb-3 flex items-center gap-2">
                            <Check className="w-5 h-5" />
                            {lang === 'th' ? 'เคล็ดลับขายได้ไว' : 'Tips for Fast Sales'}
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm text-blue-700 dark:text-blue-400">
                            <div className="flex items-start gap-2">
                                <span className="text-lg">📸</span>
                                <span>{lang === 'th' ? 'ถ่ายรูปชัด แสงสว่าง หลายมุม' : 'Clear photos, good lighting'}</span>
                            </div>
                            <div className="flex items-start gap-2">
                                <span className="text-lg">💰</span>
                                <span>{lang === 'th' ? 'ตั้งราคาเหมาะสม' : 'Fair pricing'}</span>
                            </div>
                            <div className="flex items-start gap-2">
                                <span className="text-lg">📝</span>
                                <span>{lang === 'th' ? 'บอกรายละเอียดครบ' : 'Complete details'}</span>
                            </div>
                        </div>
                    </div>
                )}

            </main>

            {/* Bottom Safe Area */}
            <div className="h-16" />
        </div>
    )
}
