'use client'

/**
 * JaiKod Homepage - AI-Powered Premium Marketplace
 * 
 * Simplified Structure:
 * 1. HeroV2 - Smart search
 * 2. CategoriesV2 - Category navigation
 * 3. NewArrivals - Latest products
 * 4. PersonalizedSections - Trending, Hot, Near You, AI Recommendations, Recently Viewed
 * 5. NearbySellersResult - Nearby sellers
 * 6. TrendingCategories, SmartCouponSection, CTA, Features
 */

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Rocket, ShieldCheck, Zap, Award, ArrowRight, Sparkles } from 'lucide-react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import HeroV2 from '@/components/home/HeroV2'
import CategoriesV2 from '@/components/home/CategoriesV2'
import PersonalizedSections from '@/components/home/PersonalizedSections'
import NewArrivals from '@/components/home/NewArrivals'
import AIAssistantWidget from '@/components/widgets/AIAssistantWidget'
import NearbySellersResult from '@/components/discovery/NearbySellersResult'
import TrendingCategories from '@/components/home/TrendingCategories'
import SmartCouponSection from '@/components/promotion/SmartCouponSection'
import Features from '@/components/home/Features'
import { FloatingCTA } from '@/components/cta/CTAComponents'
import { useSiteSettings } from '@/contexts/SiteSettingsContext'
import { useAuth } from '@/contexts/AuthContext'
import { useLanguage } from '@/contexts/LanguageContext'

// Feature flag for V2 components (easy toggle)
const USE_V2_COMPONENTS = true

export default function HomePage() {
    const { settings } = useSiteSettings()
    const { user } = useAuth()
    const { language } = useLanguage()


    // Maintenance Mode View
    if (settings.maintenanceMode && !user) {
        return <MaintenanceScreen />
    }

    return (
        <div className="min-h-screen flex flex-col bg-gray-50/50 dark:bg-slate-950">
            {/* Maintenance Mode Banner for Logged In Users */}
            {settings.maintenanceMode && user && (
                <div className="bg-red-500 text-white px-4 py-2 text-center text-sm font-medium relative hover:bg-red-600 transition-colors cursor-help group z-50">
                    ⚠️ Maintenance Mode is ACTIVE - Visible only to logged-in users ⚠️
                </div>
            )}

            <Header />

            <main className="flex-1 space-y-6 pb-12">
                {/* 1. Hero - Enhanced with Voice/Visual Search */}
                {USE_V2_COMPONENTS ? <HeroV2 /> : null}

                {/* 2. Categories - AI Enhanced */}
                {USE_V2_COMPONENTS ? <CategoriesV2 /> : null}

                {/* 3. NEW ARRIVALS - ✨ สินค้าใหม่ (Priority: High) */}
                <div className="bg-gradient-to-r from-pink-50 via-white to-rose-50 dark:from-pink-900/10 dark:via-gray-900 dark:to-rose-900/10 py-6">
                    <NewArrivals maxItems={12} />
                </div>

                {/* 4. AI PERSONALIZED SECTIONS 
                    - 🔥 Trending Now
                    - 🏆 Hot Items / Best Sellers
                    - 📍 Near You
                    - ✨ AI Recommendations
                    - 👁️ Recently Viewed
                */}
                <PersonalizedSections />

                {/* 5. AI Nearby Sellers */}
                <NearbySellersResult />

                {/* 6. Trending Categories (AI Driven) */}
                <TrendingCategories />

                {/* 7. AI Smart Coupons */}
                <SmartCouponSection />

                {/* 8. CTA Section - Premium Design */}
                <CTASection language={language as 'th' | 'en'} />

                {/* 9. Features */}
                <Features />
            </main>

            <Footer />

            {/* AI Assistant Widget */}
            <AIAssistantWidget />

            {/* Floating CTA Button */}
            {settings.floatingCTAEnabled && <FloatingCTA />}
        </div>
    )
}

// ==========================================
// CTA SECTION COMPONENT
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
// MAINTENANCE SCREEN - COMING SOON PAGE
// ==========================================

function MaintenanceScreen() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-900 flex flex-col items-center justify-center p-4 text-center relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-400/10 rounded-full blur-3xl" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative z-10 max-w-lg w-full"
            >
                {/* Logo */}
                <motion.div
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200 }}
                    className="mb-8"
                >
                    <div className="w-24 h-24 bg-white/10 backdrop-blur-xl rounded-3xl flex items-center justify-center mx-auto mb-4 border border-white/20">
                        <Sparkles className="w-12 h-12 text-white" />
                    </div>
                    <h1 className="text-5xl font-display font-bold text-white mb-2">
                        JaiKod
                    </h1>
                    <p className="text-purple-200 text-lg">
                        ใจโค้ด
                    </p>
                </motion.div>

                {/* Tagline */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="mb-8"
                >
                    <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                        ขายง่าย ซื้อใจ ด้วยพลัง AI
                    </h2>
                    <p className="text-purple-200/80 text-lg">
                        ตลาดออนไลน์ AI-Native สำหรับคนไทย
                    </p>
                </motion.div>

                {/* Coming Soon Badge */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 }}
                    className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-xl px-6 py-3 rounded-full border border-white/20 mb-8"
                >
                    <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="w-3 h-3 bg-green-400 rounded-full"
                    />
                    <span className="text-white font-medium">กำลังพัฒนา • เปิดตัวเร็วๆ นี้</span>
                </motion.div>

                {/* Features Preview */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    className="grid grid-cols-2 gap-4 mb-8"
                >
                    {[
                        { icon: '📸', text: 'ถ่ายรูป AI ช่วยขาย' },
                        { icon: '💰', text: 'AI แนะนำราคา' },
                        { icon: '🛡️', text: 'ซื้อขายปลอดภัย' },
                        { icon: '⚡', text: 'ลงขายใน 30 วินาที' },
                    ].map((feature, i) => (
                        <div key={i} className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                            <span className="text-2xl mb-2 block">{feature.icon}</span>
                            <span className="text-white/80 text-sm">{feature.text}</span>
                        </div>
                    ))}
                </motion.div>

                {/* Admin Login */}
                <div className="bg-white/5 backdrop-blur-xl p-4 rounded-2xl border border-white/10">
                    <p className="text-sm text-purple-300 mb-3">สำหรับทีมพัฒนา</p>
                    <Link href="/login">
                        <button className="w-full bg-white text-purple-700 py-3 rounded-xl font-bold hover:bg-purple-50 transition flex items-center justify-center gap-2">
                            <Zap className="w-5 h-5" />
                            เข้าสู่ระบบ
                        </button>
                    </Link>
                </div>
            </motion.div>

            {/* Footer */}
            <p className="absolute bottom-6 text-purple-300/60 text-sm">
                © 2025 JaiKod Marketplace • AI-Powered
            </p>
        </div>
    )
}
