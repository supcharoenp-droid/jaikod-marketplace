'use client'

/**
 * HomePageV2 - AI-Powered Premium Homepage
 * 
 * Features:
 * - HeroV2 with smart search
 * - CategoriesV2 with AI insights
 * - ProductSectionV2 with premium cards
 * - AI personalization
 * - Live updates
 * - International-ready
 */

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
    TrendingUp, Award, Zap, Rocket, ShieldCheck, ArrowRight,
    Sparkles, MapPin, Flame, Clock, Gift
} from 'lucide-react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import HeroV2 from '@/components/home/HeroV2'
import CategoriesV2 from '@/components/home/CategoriesV2'
import ProductSectionV2, {
    TrendingSection,
    HotDealsSection,
    NewArrivalsSection,
    AIRecommendationSection
} from '@/components/home/ProductSectionV2'
import AIAssistantWidget from '@/components/widgets/AIAssistantWidget'
import { FloatingCTA } from '@/components/cta/CTAComponents'
import NearbySellersResult from '@/components/discovery/NearbySellersResult'
import SmartCouponSection from '@/components/promotion/SmartCouponSection'
import TrendingCategories from '@/components/home/TrendingCategories'
import Features from '@/components/home/Features'
import { useSiteSettings } from '@/contexts/SiteSettingsContext'
import { useAuth } from '@/contexts/AuthContext'
import { useLanguage } from '@/contexts/LanguageContext'
import { getBestSellingProducts, getTrendingProducts } from '@/lib/products'
import { getUnifiedNewArrivals } from '@/services/unifiedMarketplace'
import { getPersonalizedRecommendations } from '@/services/behaviorTracking'
import { Product } from '@/types'
import { toSmartProductData } from '@/components/product/SmartProductCardV2'

// ==========================================
// MAIN COMPONENT
// ==========================================

export default function HomePageV2() {
    const { settings } = useSiteSettings()
    const { user } = useAuth()
    const { language } = useLanguage()

    // Data states
    const [trending, setTrending] = useState<Product[]>([])
    const [bestSellers, setBestSellers] = useState<Product[]>([])
    const [newArrivals, setNewArrivals] = useState<Product[]>([])
    const [recommendations, setRecommendations] = useState<Product[]>([])
    const [isLoading, setIsLoading] = useState(true)

    // Fetch data
    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true)
            try {
                const [trendData, bestData, newData, recomData] = await Promise.all([
                    getTrendingProducts(10).catch(() => []),
                    getBestSellingProducts(10).catch(() => []),
                    getUnifiedNewArrivals(12).catch(() => []),
                    getPersonalizedRecommendations(20).catch(() => [])
                ])

                setTrending(trendData)
                setBestSellers(bestData)
                setNewArrivals(newData as Product[])
                setRecommendations(recomData)
            } catch (error) {
                console.error('Failed to load homepage data:', error)
            } finally {
                setIsLoading(false)
            }
        }

        loadData()
    }, [])

    // Maintenance Mode
    if (settings.maintenanceMode && !user) {
        return <MaintenanceScreen />
    }

    return (
        <div className="min-h-screen flex flex-col bg-gray-50/50 dark:bg-slate-950">
            {/* Maintenance Banner */}
            {settings.maintenanceMode && user && (
                <div className="bg-red-500 text-white px-4 py-2 text-center text-sm font-medium z-50">
                    ⚠️ Maintenance Mode ACTIVE - Visible only to logged-in users
                </div>
            )}

            <Header />

            <main className="flex-1">
                {/* HERO SECTION */}
                <HeroV2 />

                {/* CATEGORIES */}
                <CategoriesV2 />

                {/* AI PERSONALIZED SECTIONS */}
                {recommendations.length > 0 && (
                    <section className="py-6 bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-purple-900/10 dark:via-slate-900 dark:to-pink-900/10">
                        <AIRecommendationSection products={recommendations} />
                    </section>
                )}

                {/* TRENDING TODAY */}
                <section className="py-6">
                    <TrendingSection products={trending} />
                </section>

                {/* AI NEARBY SELLERS */}
                <NearbySellersResult />

                {/* NEW ARRIVALS */}
                <section className="py-6 bg-gradient-to-r from-pink-50 via-white to-rose-50 dark:from-pink-900/10 dark:via-slate-900 dark:to-rose-900/10">
                    <NewArrivalsSection products={newArrivals} />
                </section>

                {/* HOT DEALS / BEST SELLERS */}
                <section className="py-6">
                    <HotDealsSection products={bestSellers} />
                </section>

                {/* TRENDING CATEGORIES */}
                <TrendingCategories />

                {/* SMART COUPONS */}
                <SmartCouponSection />

                {/* CTA SECTION */}
                <CTASection language={language as 'th' | 'en'} />

                {/* FEATURES */}
                <Features />
            </main>

            <Footer />

            {/* AI ASSISTANT WIDGET */}
            <AIAssistantWidget />

            {/* FLOATING CTA */}
            {settings.floatingCTAEnabled && <FloatingCTA />}
        </div>
    )
}

// ==========================================
// CTA SECTION
// ==========================================

function CTASection({ language }: { language: 'th' | 'en' }) {
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="grid md:grid-cols-2 gap-6">
                {/* SELL CTA */}
                <Link href="/sell" className="group block">
                    <motion.div
                        whileHover={{ scale: 1.02, y: -4 }}
                        className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800 p-6 md:p-8 h-full min-h-[220px] flex flex-col justify-between shadow-xl"
                    >
                        {/* Background Effects */}
                        <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -mr-12 -mt-12 blur-2xl" />
                        <div className="absolute bottom-0 left-0 w-32 h-32 bg-pink-500/20 rounded-full -ml-8 -mb-8 blur-xl" />

                        <div className="relative z-10">
                            <motion.div
                                whileHover={{ scale: 1.1, rotate: 5 }}
                                className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mb-4"
                            >
                                <Rocket className="w-7 h-7 text-white" />
                            </motion.div>

                            <h3 className="text-2xl md:text-3xl font-display font-bold text-white mb-2">
                                {language === 'th' ? 'เริ่มขายวันนี้!' : 'Start Selling Today!'}
                            </h3>

                            <p className="text-white/80 text-base md:text-lg max-w-sm">
                                {language === 'th'
                                    ? 'ถ่ายรูป AI ช่วยเติมข้อมูล ขายได้ใน 30 วินาที'
                                    : 'Snap a photo, AI fills details, sell in 30 seconds'}
                            </p>
                        </div>

                        <div className="relative z-10 flex items-center gap-2 text-white font-bold text-lg group-hover:gap-3 transition-all">
                            <Sparkles className="w-5 h-5" />
                            <span>{language === 'th' ? 'ลงขายฟรี' : 'List Free'}</span>
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                        </div>
                    </motion.div>
                </Link>

                {/* TRUST CTA */}
                <Link href="/safety" className="group block">
                    <motion.div
                        whileHover={{ scale: 1.02, y: -4 }}
                        className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-700 p-6 md:p-8 h-full min-h-[220px] flex flex-col justify-between shadow-xl"
                    >
                        {/* Background Effects */}
                        <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -mr-12 -mt-12 blur-2xl" />
                        <div className="absolute bottom-0 left-0 w-32 h-32 bg-teal-400/20 rounded-full -ml-8 -mb-8 blur-xl" />

                        <div className="relative z-10">
                            <motion.div
                                whileHover={{ scale: 1.1, rotate: -5 }}
                                className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mb-4"
                            >
                                <ShieldCheck className="w-7 h-7 text-white" />
                            </motion.div>

                            <h3 className="text-2xl md:text-3xl font-display font-bold text-white mb-2">
                                {language === 'th' ? 'ปลอดภัย มั่นใจ' : 'Safe & Secure'}
                            </h3>

                            <p className="text-white/80 text-base md:text-lg max-w-sm">
                                {language === 'th'
                                    ? 'ผู้ขายยืนยันตัวตน ระบบชำระเงินปลอดภัย'
                                    : 'Verified sellers, protected transactions'}
                            </p>
                        </div>

                        <div className="relative z-10 flex items-center gap-2 text-white font-bold text-lg group-hover:gap-3 transition-all">
                            <Award className="w-5 h-5" />
                            <span>{language === 'th' ? 'เรียนรู้เพิ่มเติม' : 'Learn More'}</span>
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                        </div>
                    </motion.div>
                </Link>
            </div>
        </div>
    )
}

// ==========================================
// MAINTENANCE SCREEN
// ==========================================

function MaintenanceScreen() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 dark:from-slate-900 dark:to-purple-900/20 flex flex-col items-center justify-center p-4 text-center">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-2xl max-w-lg w-full"
            >
                <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6"
                >
                    <Zap className="w-12 h-12 text-white" />
                </motion.div>

                <h1 className="text-3xl font-display font-bold mb-4 text-gray-900 dark:text-white">
                    ปิดปรับปรุงระบบชั่วคราว
                </h1>

                <p className="text-gray-500 dark:text-gray-400 mb-8">
                    เรากำลังอัปเกรดระบบเพื่อประสบการณ์ที่ดียิ่งขึ้น<br />
                    กรุณากลับมาใหม่ในภายหลัง
                </p>

                <div className="p-4 bg-gray-50 dark:bg-slate-700 rounded-xl">
                    <p className="text-sm text-gray-400 mb-2">สำหรับผู้ดูแลระบบ</p>
                    <Link href="/login">
                        <button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-xl font-bold hover:opacity-90 transition">
                            เข้าสู่ระบบ
                        </button>
                    </Link>
                </div>
            </motion.div>

            <p className="mt-8 text-gray-400 text-sm">
                © 2024 JaiKod Marketplace
            </p>
        </div>
    )
}
