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

import dynamic from 'next/dynamic'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Rocket, ShieldCheck, Zap, Award, ArrowRight, Sparkles } from 'lucide-react'
import Footer from '@/components/layout/Footer'
import HeroV2 from '@/components/home/HeroV2'

// Dynamic import Header to avoid hydration mismatch
const Header = dynamic(() => import('@/components/layout/Header'), { ssr: false })
import CategoriesV2 from '@/components/home/CategoriesV2'
import PersonalizedSections from '@/components/home/PersonalizedSections'
import NewArrivals from '@/components/home/NewArrivals'
import AIAssistantWidget from '@/components/widgets/AIAssistantWidget'
import NearbySellersV2 from '@/components/discovery/NearbySellersV2'
import TrendingCategories from '@/components/home/TrendingCategories'
import SmartCouponSection from '@/components/promotion/SmartCouponSection'
import FeaturedSellerBanner from '@/components/promotion/FeaturedSellerBanner'
import Features from '@/components/home/Features'
import AILiveTicker from '@/components/home/AILiveTicker'
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
        <div
            className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 selection:bg-purple-100 selection:text-purple-700 relative overflow-hidden"
            suppressHydrationWarning
        >
            {/* World-Class Mesh Gradient Background */}
            <div className="fixed inset-0 pointer-events-none z-0" suppressHydrationWarning>
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-200/30 dark:bg-purple-900/10 blur-[120px] rounded-full animate-mesh-1" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-pink-200/20 dark:bg-rose-900/5 blur-[120px] rounded-full animate-mesh-2" />
                <div className="absolute top-[20%] right-[10%] w-[40%] h-[40%] bg-blue-100/30 dark:bg-blue-900/5 blur-[100px] rounded-full animate-mesh-3" />
            </div>

            {/* Maintenance Mode Banner for Logged In Users */}
            {settings.maintenanceMode && user && (
                <div className="bg-red-500 text-white px-4 py-2 text-center text-[10px] font-black uppercase tracking-widest relative hover:bg-red-600 transition-colors cursor-help group z-50">
                    ⚠️ Maintenance Mode is ACTIVE - Visible only to logged-in users ⚠️
                </div>
            )}

            <Header />

            {/* Live AI Activity Feed */}
            <AILiveTicker />

            <main className="flex-1 space-y-24 pb-20 relative z-10 transition-all duration-700">
                {/* 1. Hero - Enhanced with Voice/Visual Search */}
                <section className="pt-8">
                    {USE_V2_COMPONENTS ? <HeroV2 /> : null}
                </section>

                {/* 2. Categories - AI Enhanced */}
                <div className="container mx-auto">
                    {USE_V2_COMPONENTS ? <CategoriesV2 /> : null}
                </div>

                {/* 2.5 FEATURED SELLER BANNER - 🌟 JaiStar Promotion */}
                <div className="container mx-auto px-4">
                    <FeaturedSellerBanner />
                </div>

                {/* 3. NEW ARRIVALS - ✨ สินค้าใหม่ (Focus: Discovery) */}
                <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-b from-white to-gray-50/50 dark:from-slate-900 dark:to-slate-950 -z-10" />
                    <NewArrivals maxItems={12} />
                </div>

                {/* 4. AI PERSONALIZED SECTIONS */}
                {/* <div className="container mx-auto">
                    <PersonalizedSections />
                </div> */}

                {/* 5. AI Nearby Sellers - Premium V2 */}
                {/* <div className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-3xl py-12 border-y border-gray-100 dark:border-white/5">
                    <NearbySellersV2 />
                </div> */}

                {/* 6. Trending Categories (AI Driven) */}
                {/* <TrendingCategories /> */}

                {/* 7. AI Smart Coupons */}
                {/* <div className="container mx-auto">
                    <SmartCouponSection />
                </div> */}

                {/* 8. CTA Section - Premium Design */}
                <CTASection language={language as 'th' | 'en'} />

                {/* 9. Features */}
                <Features />
            </main>

            <Footer />

            {/* AI Assistant Widget */}
            {/* <AIAssistantWidget /> */}

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
        <div className="container mx-auto px-4 py-8 relative">
            <div className="grid md:grid-cols-2 gap-8">
                {/* SELL CTA */}
                <Link href="/sell" className="group block h-full">
                    <motion.div
                        whileHover={{ y: -8 }}
                        className="relative rounded-[40px] overflow-hidden bg-slate-900 border border-white/10 p-8 md:p-12 h-full min-h-[300px] flex flex-col justify-between shadow-2xl group transition-all duration-500"
                    >
                        {/* Animated Gradient Border */}
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 via-transparent to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                        <div className="relative z-10">
                            <div className="w-16 h-16 bg-gradient-to-tr from-purple-600 to-indigo-600 rounded-3xl flex items-center justify-center mb-6 shadow-lg shadow-purple-500/20 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                                <Rocket className="w-8 h-8 text-white" />
                            </div>

                            <h3 className="text-3xl md:text-4xl font-black text-white mb-4 tracking-tight leading-tight">
                                {language === 'th' ? 'เปลี่ยนของเหลือใช้ เป็นรายได้ด้วย AI' : 'Turn Clutter into Cash with AI'}
                            </h3>

                            <p className="text-slate-400 text-lg md:text-xl max-w-sm font-medium">
                                {language === 'th'
                                    ? 'แค่ถ่ายรูป ระบบ AI จะช่วยเติมข้อมูลและตั้งราคาขายให้คุณทันที'
                                    : 'Just snap a photo, our AI fills details and suggests the best price.'}
                            </p>
                        </div>

                        <div className="relative z-10 mt-8">
                            <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/10 px-6 py-3 rounded-2xl text-white font-black text-lg group-hover:bg-white group-hover:text-slate-950 transition-all duration-500">
                                <Sparkles className="w-5 h-5 text-purple-400 group-hover:text-purple-600" />
                                <span>{language === 'th' ? 'ลงขายใน 30 วินาที' : 'List in 30 Seconds'}</span>
                                <ArrowRight className="w-5 h-5 translate-x-0 group-hover:translate-x-2 transition-transform" />
                            </div>
                        </div>
                    </motion.div>
                </Link>

                {/* TRUST CTA */}
                <Link href="/safety" className="group block h-full">
                    <motion.div
                        whileHover={{ y: -8 }}
                        className="relative rounded-[40px] overflow-hidden bg-white border border-slate-100 p-8 md:p-12 h-full min-h-[300px] flex flex-col justify-between shadow-2xl transition-all duration-500"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-transparent to-teal-50 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                        <div className="relative z-10">
                            <div className="w-16 h-16 bg-gradient-to-tr from-emerald-500 to-teal-600 rounded-3xl flex items-center justify-center mb-6 shadow-lg shadow-emerald-500/20 group-hover:scale-110 group-hover:-rotate-6 transition-all duration-500">
                                <ShieldCheck className="w-8 h-8 text-white" />
                            </div>

                            <h3 className="text-3xl md:text-4xl font-black text-slate-900 mb-4 tracking-tight leading-tight">
                                {language === 'th' ? 'ช้อปปิ้งปลอดภัย 100% กับ JaiKod' : '100% Secure Shopping with JaiKod'}
                            </h3>

                            <p className="text-slate-500 text-lg md:text-xl max-w-sm font-medium">
                                {language === 'th'
                                    ? 'ปกป้องด้วยระบบ AI ตรวจสอบการโกง และผู้ขายที่ได้รับการยืนยันตัวตน'
                                    : 'Protected by anti-fraud AI and fully verified seller network.'}
                            </p>
                        </div>

                        <div className="relative z-10 mt-8">
                            <div className="inline-flex items-center gap-3 bg-slate-100 px-6 py-3 rounded-2xl text-slate-900 font-black text-lg group-hover:bg-emerald-600 group-hover:text-white transition-all duration-500">
                                <Award className="w-5 h-5 text-emerald-500 group-hover:text-white" />
                                <span>{language === 'th' ? 'ดูระบบความปลอดภัย' : 'Explore Safety'}</span>
                                <ArrowRight className="w-5 h-5 translate-x-0 group-hover:translate-x-2 transition-transform" />
                            </div>
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


            </motion.div>

            {/* Footer */}
            <p className="absolute bottom-6 text-purple-300/60 text-sm">
                © 2025 JaiKod Marketplace • AI-Powered
            </p>
        </div>
    )
}
