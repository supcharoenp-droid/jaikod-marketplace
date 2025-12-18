'use client'

import { useState, useEffect } from 'react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import Hero from '@/components/home/Hero'
import Categories from '@/components/home/Categories'
import Features from '@/components/home/Features'
import ProductSection from '@/components/home/ProductSection'
import PersonalizedSections from '@/components/home/PersonalizedSections'
import NewArrivals from '@/components/home/NewArrivals'
import { getBestSellingProducts, getTrendingProducts } from '@/lib/products'
import { Product } from '@/types'
import { TrendingUp, Award, Zap, Gift, Rocket, ShieldCheck } from 'lucide-react'
import { FloatingCTA, CTACard, CountdownCTA } from '@/components/cta/CTAComponents'
import { useSiteSettings } from '@/contexts/SiteSettingsContext'
import { useAuth } from '@/contexts/AuthContext'
import { useLanguage } from '@/contexts/LanguageContext'
import Link from 'next/link'
import TrendingCategories from '@/components/home/TrendingCategories'
import NearbySellersResult from '@/components/discovery/NearbySellersResult'
import SmartCouponSection from '@/components/promotion/SmartCouponSection'

export default function HomePage() {
    const { settings } = useSiteSettings()
    const { user } = useAuth()
    const { t } = useLanguage()
    const [bestSellers, setBestSellers] = useState<Product[]>([])
    const [trending, setTrending] = useState<Product[]>([])

    useEffect(() => {
        const loadData = async () => {
            try {
                // Fetch individually to prevent one failure from blocking others
                // and use try-catch internally if needed, or catch all here
                const best = await getBestSellingProducts(10).catch(e => {
                    console.error('Failed to load best sellers:', e)
                    return []
                })
                const trend = await getTrendingProducts(10).catch(e => {
                    console.error('Failed to load trending:', e)
                    return []
                })

                setBestSellers(best)
                setTrending(trend)
            } catch (error) {
                console.error('HomePage loadData error:', error)
            }
        }
        loadData()
    }, [])

    // Maintenance Mode View
    if (settings.maintenanceMode && !user) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 text-center">
                <div className="bg-white p-8 rounded-3xl shadow-xl max-w-lg w-full">
                    <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                        <Zap className="w-12 h-12 text-red-500" />
                    </div>
                    <h1 className="text-3xl font-bold mb-4 text-gray-900">ปิดปรับปรุงระบบชั่วคราว</h1>
                    <p className="text-gray-500 mb-8">
                        เรากำลังอัปเกรดระบบเพื่อประสบการณ์ที่ดียิ่งขึ้น<br />
                        กรุณากลับมาใหม่ในภายหลัง
                    </p>
                    <div className="space-y-4">
                        <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                            <p className="text-sm text-gray-400">สำหรับผู้ดูแลระบบ</p>
                            <Link href="/login">
                                <button className="mt-2 w-full bg-gray-900 text-white py-3 rounded-xl font-semibold hover:bg-gray-800 transition">
                                    เข้าสู่ระบบ
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
                <div className="mt-8 text-gray-400 text-sm">
                    &copy; 2024 JaiKod Marketplace
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen flex flex-col bg-gray-50/50 dark:bg-bg-dark">
            {/* Maintenance Mode Banner for Logged In Users */}
            {settings.maintenanceMode && user && (
                <div className="bg-red-500 text-white px-4 py-2 text-center text-sm font-medium relative hover:bg-red-600 transition-colors cursor-help group z-50">
                    ⚠️ Maintenance Mode is ACTIVE - Visible only to logged-in users ⚠️
                    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-max px-3 py-1 bg-gray-900 text-white text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                        Users who are not logged in will see the maintenance screen.
                    </div>
                </div>
            )}
            <Header />
            <main className="flex-1 space-y-4 pb-12">
                <Hero />
                <Categories />

                {/* AI Personalized Sections (High Priority) */}
                <div className="mt-8">
                    <PersonalizedSections />
                </div>

                {/* Flash Sale Countdown CTA - Controlled by Admin */}
                {settings.flashSaleEnabled && (
                    <div className="container mx-auto px-4 py-4">
                        <CountdownCTA />
                    </div>
                )}

                {/* NEW ARRIVALS - Real products from Firebase */}
                <div className="bg-gradient-to-r from-pink-50 via-white to-rose-50 dark:from-pink-900/10 dark:via-gray-900 dark:to-rose-900/10 py-6 my-4">
                    <NewArrivals />
                </div>

                {/* Best Sellers Section */}
                <div className="bg-white dark:bg-card-dark py-4 my-4 shadow-sm">
                    <ProductSection
                        title={t('home.best_seller')}
                        subtitle={t('home.best_seller_desc')}
                        icon={<Award className="w-6 h-6 text-amber-500" />}
                        products={bestSellers}
                        layout="slider"
                        viewAllLink="/search?sort=best_seller"
                    />
                </div>

                {/* Mid-Page CTA - Sell - Controlled by Admin */}
                {settings.showSellCTA && (
                    <div className="container mx-auto px-4 py-4">
                        <CTACard
                            variant="gradient"
                            title={t('home.cta_sell_title')}
                            description={t('home.cta_sell_desc')}
                            buttonText={t('home.cta_sell_btn')}
                            buttonLink="/sell"
                            icon={<Rocket className="w-8 h-8 text-white" />}
                        />
                    </div>
                )}

                {/* Trending Categories (AI Driven) */}
                <TrendingCategories />

                {/* AI Nearby Sellers Recommendation */}
                <NearbySellersResult />

                {/* AI Smart Coupons */}
                <SmartCouponSection />

                {/* Trending Section */}
                <ProductSection
                    title={t('home.trending')}
                    subtitle={t('home.trending_desc')}
                    icon={<TrendingUp className="w-6 h-6 text-rose-500" />}
                    products={trending}
                    layout="slider"
                    viewAllLink="/search?sort=trending"
                />

                {/* Flash Deal Banner - Controlled by Admin */}
                {settings.flashSaleEnabled && (
                    <div className="container mx-auto px-4 py-8">
                        <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-violet-600 to-indigo-600 h-48 md:h-64 flex items-center px-8 md:px-16 shadow-xl">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
                            <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/10 rounded-full -ml-16 -mb-16 blur-2xl"></div>

                            <div className="relative z-10 text-white max-w-lg">
                                <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-sm font-medium mb-4">
                                    <Zap className="w-4 h-4 text-yellow-300 fill-current" />
                                    <span>{t('home.flash_sale')}</span>
                                </div>
                                <h3 className="text-3xl md:text-4xl font-bold mb-4">{t('home.flash_desc')}</h3>
                                <p className="text-white/80 mb-6">{t('home.flash_desc')}</p>
                                <Link href="/promotions">
                                    <button className="bg-white text-violet-600 px-6 py-3 rounded-xl font-bold hover:bg-gray-100 transition shadow-lg hover:scale-105">
                                        {t('home.flash_btn')} →
                                    </button>
                                </Link>
                            </div>
                        </div>
                    </div>
                )}

                {/* Secondary CTA - Register - Controlled by Admin */}
                {settings.showRegisterCTA && (
                    <div className="container mx-auto px-4 py-4">
                        <CTACard
                            variant="secondary"
                            title={t('home.cta_reg_title')}
                            description={t('home.cta_reg_desc')}
                            buttonText={t('home.cta_reg_btn')}
                            buttonLink="/register"
                            icon={<Gift className="w-8 h-8" />}
                        />
                    </div>
                )}



                {/* Trust CTA */}
                <div className="container mx-auto px-4 py-8">
                    <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl p-8 md:p-12 text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
                        <div className="relative z-10">
                            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                                <div className="flex items-center gap-6">
                                    <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center">
                                        <ShieldCheck className="w-10 h-10 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl md:text-3xl font-bold mb-2">{t('home.trust_title')}</h3>
                                        <p className="text-white/80 text-lg">{t('home.trust_desc')}</p>
                                    </div>
                                </div>
                                <Link href="/safety">
                                    <button className="bg-white text-emerald-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all hover:scale-105 whitespace-nowrap">
                                        {t('home.trust_btn')} →
                                    </button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                <Features />
            </main>
            <Footer />

            {/* Floating CTA Button - Controlled by Admin */}
            {settings.floatingCTAEnabled && <FloatingCTA />}
        </div>
    )
}

