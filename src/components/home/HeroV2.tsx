'use client'

/**
 * HeroV2 - AI-Powered Premium Hero Section
 * 
 * Features:
 * - Dynamic greeting based on time
 * - Voice search ready
 * - Visual search button
 * - Live trending searches
 * - Smart quick filters
 * - Animated statistics
 * - AI Assistant integration
 */

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Search, Camera, Mic, Sparkles, ArrowRight, TrendingUp,
    MapPin, Zap, Shield, Star, X, ChevronRight, Flame,
    Clock, Package, Users, Target, Wand2
} from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import { useAuth } from '@/contexts/AuthContext'

// ==========================================
// TYPES
// ==========================================

interface TrendingSearch {
    query: string
    count: number
    isHot?: boolean
}

interface QuickFilter {
    id: string
    label: string
    icon: React.ReactNode
    href: string
    color: string
}

// ==========================================
// MOCK DATA (Would come from API)
// ==========================================

const TRENDING_SEARCHES: TrendingSearch[] = [
    { query: 'iPhone 15 Pro', count: 1234, isHot: true },
    { query: 'MacBook Air M3', count: 892 },
    { query: 'รถมือสอง กรุงเทพ', count: 756 },
    { query: 'คอนโด ใกล้ BTS', count: 654, isHot: true },
    { query: 'Nike Air Force', count: 543 },
    { query: 'PS5', count: 432 },
]

const QUICK_FILTERS_TH: QuickFilter[] = [
    { id: 'near', label: 'ใกล้ฉัน', icon: <MapPin className="w-4 h-4" />, href: '/search?sort=nearest', color: 'from-green-500 to-emerald-500' },
    { id: 'deals', label: 'ราคาดี', icon: <Zap className="w-4 h-4" />, href: '/search?filter=deals', color: 'from-orange-500 to-red-500' },
    { id: 'ai', label: 'AI แนะนำ', icon: <Sparkles className="w-4 h-4" />, href: '/ai-discover', color: 'from-purple-500 to-pink-500' },
    { id: 'new', label: 'ใหม่ล่าสุด', icon: <Clock className="w-4 h-4" />, href: '/search?sort=newest', color: 'from-blue-500 to-cyan-500' },
    { id: 'verified', label: 'ผู้ขายยืนยัน', icon: <Shield className="w-4 h-4" />, href: '/search?filter=verified', color: 'from-emerald-500 to-teal-500' },
]

const QUICK_FILTERS_EN: QuickFilter[] = [
    { id: 'near', label: 'Near Me', icon: <MapPin className="w-4 h-4" />, href: '/search?sort=nearest', color: 'from-green-500 to-emerald-500' },
    { id: 'deals', label: 'Best Deals', icon: <Zap className="w-4 h-4" />, href: '/search?filter=deals', color: 'from-orange-500 to-red-500' },
    { id: 'ai', label: 'AI Picks', icon: <Sparkles className="w-4 h-4" />, href: '/ai-discover', color: 'from-purple-500 to-pink-500' },
    { id: 'new', label: 'New Arrivals', icon: <Clock className="w-4 h-4" />, href: '/search?sort=newest', color: 'from-blue-500 to-cyan-500' },
    { id: 'verified', label: 'Verified', icon: <Shield className="w-4 h-4" />, href: '/search?filter=verified', color: 'from-emerald-500 to-teal-500' },
]

// ==========================================
// ANIMATED COUNTER COMPONENT
// ==========================================

function AnimatedCounter({ end, duration = 2000, suffix = '' }: { end: number; duration?: number; suffix?: string }) {
    const [count, setCount] = useState(0)

    useEffect(() => {
        let startTime: number | null = null
        const animate = (timestamp: number) => {
            if (!startTime) startTime = timestamp
            const progress = Math.min((timestamp - startTime) / duration, 1)
            setCount(Math.floor(progress * end))
            if (progress < 1) requestAnimationFrame(animate)
        }
        requestAnimationFrame(animate)
    }, [end, duration])

    return <>{count.toLocaleString()}{suffix}</>
}

// ==========================================
// TYPING TEXT COMPONENT
// ==========================================

function TypingText({ texts, speed = 100 }: { texts: string[]; speed?: number }) {
    const [currentTextIndex, setCurrentTextIndex] = useState(0)
    const [currentText, setCurrentText] = useState('')
    const [isDeleting, setIsDeleting] = useState(false)

    useEffect(() => {
        const targetText = texts[currentTextIndex]
        const timeout = setTimeout(() => {
            if (!isDeleting) {
                if (currentText.length < targetText.length) {
                    setCurrentText(targetText.slice(0, currentText.length + 1))
                } else {
                    setTimeout(() => setIsDeleting(true), 2000)
                }
            } else {
                if (currentText.length > 0) {
                    setCurrentText(currentText.slice(0, -1))
                } else {
                    setIsDeleting(false)
                    setCurrentTextIndex((prev) => (prev + 1) % texts.length)
                }
            }
        }, isDeleting ? speed / 2 : speed)

        return () => clearTimeout(timeout)
    }, [currentText, currentTextIndex, isDeleting, texts, speed])

    return (
        <span className="text-purple-600 dark:text-purple-400">
            {currentText}
            <span className="animate-blink">|</span>
        </span>
    )
}

// ==========================================
// MAIN COMPONENT
// ==========================================

export default function HeroV2() {
    const router = useRouter()
    const { language, t } = useLanguage()
    const { user } = useAuth()
    const searchInputRef = useRef<HTMLInputElement>(null)

    const [searchQuery, setSearchQuery] = useState('')
    const [isFocused, setIsFocused] = useState(false)
    const [showTrending, setShowTrending] = useState(false)
    const [isVoiceListening, setIsVoiceListening] = useState(false)

    const quickFilters = language === 'th' ? QUICK_FILTERS_TH : QUICK_FILTERS_EN

    // Greeting based on time
    const getGreeting = useCallback(() => {
        const hour = new Date().getHours()
        if (language === 'th') {
            if (hour < 12) return 'สวัสดีตอนเช้า'
            if (hour < 17) return 'สวัสดีตอนบ่าย'
            if (hour < 21) return 'สวัสดีตอนเย็น'
            return 'สวัสดีตอนค่ำ'
        } else {
            if (hour < 12) return 'Good morning'
            if (hour < 17) return 'Good afternoon'
            if (hour < 21) return 'Good evening'
            return 'Good night'
        }
    }, [language])

    // Typing texts
    const typingTexts = language === 'th'
        ? ['iPhone 15 Pro Max...', 'รถยนต์มือสอง...', 'คอนโดใกล้ BTS...', 'MacBook Air M3...']
        : ['iPhone 15 Pro Max...', 'Used cars nearby...', 'Condo near MRT...', 'MacBook Air M3...']

    // Handle search submit
    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        if (searchQuery.trim()) {
            router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
        }
    }

    // Handle trending click
    const handleTrendingClick = (query: string) => {
        setSearchQuery(query)
        router.push(`/search?q=${encodeURIComponent(query)}`)
    }

    // Handle voice search (placeholder)
    const handleVoiceSearch = () => {
        setIsVoiceListening(true)
        // Voice search logic would go here
        setTimeout(() => setIsVoiceListening(false), 3000)
    }

    // Handle visual search
    const handleVisualSearch = () => {
        router.push('/sell') // For now, redirect to sell page with camera
    }

    return (
        <section className="relative py-8 md:py-12 overflow-hidden">
            {/* Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-slate-900 dark:via-slate-900 dark:to-purple-900/20" />

            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-20 left-10 w-72 h-72 bg-purple-300/20 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-10 right-10 w-96 h-96 bg-pink-300/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
                <div className="absolute top-40 right-1/4 w-48 h-48 bg-blue-300/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
            </div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="max-w-4xl mx-auto">

                    {/* GREETING & HEADLINE */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center mb-8"
                    >
                        {/* Personalized Greeting */}
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-full mb-4">
                            <span className="text-2xl">👋</span>
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                {getGreeting()}{user?.displayName ? `, ${user.displayName.split(' ')[0]}` : ''}!
                            </span>
                        </div>

                        {/* Main Headline */}
                        <h1 className="text-3xl md:text-5xl font-display font-bold text-gray-900 dark:text-white mb-3">
                            {language === 'th'
                                ? 'ค้นหาสิ่งที่คุณต้องการ'
                                : 'Find What You Need'
                            }
                        </h1>

                        {/* Subheadline with AI */}
                        <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400">
                            {language === 'th'
                                ? 'AI ช่วยค้นหาสินค้าที่ใช่สำหรับคุณ'
                                : 'AI-powered search just for you'
                            }
                            <Sparkles className="inline w-5 h-5 ml-1 text-purple-500" />
                        </p>
                    </motion.div>

                    {/* SEARCH BOX */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="relative mb-6"
                    >
                        <form onSubmit={handleSearch} className="relative">
                            <div className={`
                                relative flex items-center bg-white dark:bg-slate-800 
                                rounded-2xl shadow-xl shadow-purple-500/10
                                border-2 transition-all duration-300
                                ${isFocused
                                    ? 'border-purple-500 ring-4 ring-purple-500/20'
                                    : 'border-gray-100 dark:border-slate-700'
                                }
                            `}>
                                {/* Search Icon */}
                                <div className="pl-4 md:pl-6">
                                    <Search className={`w-5 h-5 transition-colors ${isFocused ? 'text-purple-500' : 'text-gray-400'}`} />
                                </div>

                                {/* Input */}
                                <input
                                    ref={searchInputRef}
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onFocus={() => { setIsFocused(true); setShowTrending(true) }}
                                    onBlur={() => { setIsFocused(false); setTimeout(() => setShowTrending(false), 200) }}
                                    placeholder={language === 'th' ? 'ค้นหาสินค้า แบรนด์ หรือหมวดหมู่...' : 'Search products, brands, or categories...'}
                                    className="flex-1 py-4 md:py-5 px-4 bg-transparent outline-none text-gray-900 dark:text-white placeholder-gray-400"
                                />

                                {/* Action Buttons */}
                                <div className="flex items-center gap-1 pr-2 md:pr-3">
                                    {/* Clear Button */}
                                    {searchQuery && (
                                        <button
                                            type="button"
                                            onClick={() => setSearchQuery('')}
                                            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                        >
                                            <X className="w-5 h-5" />
                                        </button>
                                    )}

                                    {/* Voice Search */}
                                    <button
                                        type="button"
                                        onClick={handleVoiceSearch}
                                        className={`p-2.5 rounded-xl transition-all ${isVoiceListening
                                            ? 'bg-red-500 text-white animate-pulse'
                                            : 'bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-400 hover:bg-purple-100 dark:hover:bg-purple-900/30 hover:text-purple-600'
                                            }`}
                                        title={language === 'th' ? 'ค้นหาด้วยเสียง' : 'Voice search'}
                                    >
                                        <Mic className="w-5 h-5" />
                                    </button>

                                    {/* Visual Search */}
                                    <button
                                        type="button"
                                        onClick={handleVisualSearch}
                                        className="p-2.5 bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-400 rounded-xl hover:bg-purple-100 dark:hover:bg-purple-900/30 hover:text-purple-600 transition-all"
                                        title={language === 'th' ? 'ค้นหาด้วยรูปภาพ' : 'Visual search'}
                                    >
                                        <Camera className="w-5 h-5" />
                                    </button>

                                    {/* Submit Button */}
                                    <button
                                        type="submit"
                                        className="hidden md:flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl hover:opacity-90 transition-opacity"
                                    >
                                        <Search className="w-4 h-4" />
                                        {language === 'th' ? 'ค้นหา' : 'Search'}
                                    </button>
                                </div>
                            </div>
                        </form>

                        {/* TRENDING DROPDOWN */}
                        <AnimatePresence>
                            {showTrending && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-gray-100 dark:border-slate-700 overflow-hidden z-50"
                                >
                                    <div className="p-4">
                                        <div className="flex items-center gap-2 text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">
                                            <TrendingUp className="w-4 h-4 text-orange-500" />
                                            {language === 'th' ? 'กำลังค้นหามาก' : 'Trending searches'}
                                        </div>

                                        <div className="space-y-1">
                                            {TRENDING_SEARCHES.map((item, idx) => (
                                                <button
                                                    key={idx}
                                                    onClick={() => handleTrendingClick(item.query)}
                                                    className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <span className="w-6 h-6 rounded-full bg-gray-100 dark:bg-slate-600 flex items-center justify-center text-xs font-bold text-gray-500">
                                                            {idx + 1}
                                                        </span>
                                                        <span className="text-sm text-gray-900 dark:text-white">
                                                            {item.query}
                                                        </span>
                                                        {item.isHot && (
                                                            <Flame className="w-3 h-3 text-orange-500" />
                                                        )}
                                                    </div>
                                                    <span className="text-xs text-gray-400">
                                                        {item.count.toLocaleString()} {language === 'th' ? 'ครั้ง' : 'searches'}
                                                    </span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>

                    {/* QUICK FILTERS */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="flex flex-wrap justify-center gap-2 md:gap-3 mb-8"
                    >
                        {quickFilters.map((filter) => (
                            <Link
                                key={filter.id}
                                href={filter.href}
                                className={`
                                    inline-flex items-center gap-2 px-4 py-2.5 rounded-full
                                    bg-gradient-to-r ${filter.color} text-white
                                    font-medium text-sm shadow-lg shadow-purple-500/20
                                    hover:opacity-90 hover:scale-105 transition-all
                                `}
                            >
                                {filter.icon}
                                {filter.label}
                            </Link>
                        ))}
                    </motion.div>

                    {/* STATS BAR */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl p-4 md:p-6 border border-gray-100 dark:border-slate-700"
                    >
                        <StatItem
                            icon={<Package className="w-5 h-5" />}
                            value={<AnimatedCounter end={50000} suffix="+" />}
                            label={language === 'th' ? 'สินค้าทั้งหมด' : 'Total Listings'}
                            color="text-purple-500"
                        />
                        <StatItem
                            icon={<Users className="w-5 h-5" />}
                            value={<AnimatedCounter end={5000} suffix="+" />}
                            label={language === 'th' ? 'ผู้ใช้งาน' : 'Active Users'}
                            color="text-blue-500"
                        />
                        <StatItem
                            icon={<MapPin className="w-5 h-5" />}
                            value="77"
                            label={language === 'th' ? 'จังหวัดทั่วประเทศ' : 'Provinces'}
                            color="text-green-500"
                        />
                        <StatItem
                            icon={<Star className="w-5 h-5" />}
                            value="4.8"
                            label={language === 'th' ? 'ความพึงพอใจ' : 'Satisfaction'}
                            color="text-amber-500"
                        />
                    </motion.div>

                    {/* AI QUICK ACTION */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="mt-6 text-center"
                    >
                        <Link
                            href="/sell"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-2xl shadow-lg shadow-purple-500/30 hover:shadow-xl hover:scale-105 transition-all"
                        >
                            <Wand2 className="w-5 h-5" />
                            {language === 'th'
                                ? 'ลงขายด้วย AI - ถ่ายรูป พิมพ์ไม่ต้อง!'
                                : 'List with AI - Just snap a photo!'
                            }
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    </motion.div>
                </div>
            </div>
        </section>
    )
}

// ==========================================
// STAT ITEM SUBCOMPONENT
// ==========================================

interface StatItemProps {
    icon: React.ReactNode
    value: React.ReactNode
    label: string
    color: string
}

function StatItem({ icon, value, label, color }: StatItemProps) {
    return (
        <div className="text-center">
            <div className={`inline-flex items-center justify-center w-10 h-10 rounded-xl mb-2 ${color} bg-current/10`}>
                <span className={color}>{icon}</span>
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{value}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">{label}</div>
        </div>
    )
}
