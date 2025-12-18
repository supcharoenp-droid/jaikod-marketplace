'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Search, Camera, Sparkles, Zap, ShieldCheck, SlidersHorizontal } from 'lucide-react'
import Button from '@/components/ui/Button'
import AdvancedSearch from '@/components/search/AdvancedSearch'
import SmartSearch from '@/components/search/SmartSearch'
import { useLanguage } from '@/contexts/LanguageContext'

export default function Hero() {
    const router = useRouter()
    const { t } = useLanguage()
    const [showAdvancedSearch, setShowAdvancedSearch] = useState(false)



    return (
        <section className="relative pt-20 pb-20 lg:pt-32 lg:pb-32 overflow-hidden">
            {/* Background Gradients */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute -top-[30%] -right-[10%] w-[70%] h-[70%] bg-gradient-to-br from-neon-purple/20 to-coral-orange/20 rounded-full blur-[120px]" />
                <div className="absolute bottom-0 left-0 w-[50%] h-[50%] bg-gradient-to-tr from-electric-blue/10 to-neon-purple/10 rounded-full blur-[100px]" />
            </div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">

                    {/* Left Column: Content */}
                    <div className="flex-1 text-center lg:text-left space-y-8">
                        {/* New Badge */}
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/50 dark:bg-white/5 border border-purple-200 dark:border-purple-800/50 backdrop-blur-sm shadow-sm animate-fade-in-up">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neon-purple opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-neon-purple"></span>
                            </span>
                            <span className="text-sm font-medium bg-gradient-to-r from-neon-purple to-coral-orange bg-clip-text text-transparent">
                                {t('home.hero_badge')}
                            </span>
                        </div>

                        <h1
                            className="font-display font-extrabold tracking-tight mb-6"
                            style={{
                                fontSize: 'clamp(2.4rem, 4vw, 4.5rem)',
                                lineHeight: '1.15',
                                fontWeight: 800
                            }}
                        >
                            <div className="mb-2">
                                {t('home.hero_title_1')}{' '}
                                <span
                                    style={{
                                        backgroundImage: 'linear-gradient(90deg, #A855F7, #EC4899, #F97316)',
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent',
                                        backgroundClip: 'text',
                                        color: 'transparent'
                                    }}
                                >
                                    {t('home.hero_title_2')}
                                </span>
                            </div>
                            <div>
                                {t('home.hero_title_3')}
                            </div>
                        </h1>

                        <p className="text-lg text-text-secondary dark:text-gray-400 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                            <strong className="text-gray-700 dark:text-gray-300">{t('home.hero_desc_seller')}</strong> → {t('home.hero_desc_seller_text')}<br />
                            <strong className="text-gray-700 dark:text-gray-300">{t('home.hero_desc_shop')}</strong> → {t('home.hero_desc_shop_text')}<br />
                            <strong className="text-gray-700 dark:text-gray-300">{t('home.hero_desc_buyer')}</strong> → {t('home.hero_desc_buyer_text')}
                        </p>

                        {/* Search Bar - FUNCTIONAL */}
                        {/* Search Bar - SMART AI */}
                        <div className="w-full max-w-xl mx-auto lg:mx-0">
                            <SmartSearch />
                        </div>

                        {/* Quick Stats / Trust */}
                        <div className="flex items-center justify-center lg:justify-start gap-8 pt-4 text-sm font-medium text-text-secondary dark:text-gray-400">
                            <div className="flex items-center gap-2">
                                <Zap className="w-5 h-5 text-yellow-500 fill-current" />
                                <span>{t('home.stat_quick_sell')}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <ShieldCheck className="w-5 h-5 text-green-500 fill-current" />
                                <span>{t('home.stat_verified')}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Sparkles className="w-5 h-5 text-neon-purple fill-current" />
                                <span>{t('home.stat_ai')}</span>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: 3D Visuals */}
                    <div className="flex-1 w-full relative h-[400px] lg:h-[600px] hidden md:block">
                        {/* Abstract Floating Elements representing JaiKod Features */}
                        <div className="relative w-full h-full">
                            {/* Main Phone Frame Mockup */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-[500px] bg-gray-900 rounded-[3rem] border-8 border-gray-800 shadow-2xl z-20 overflow-hidden transform rotate-[-5deg] hover:rotate-0 transition-transform duration-500">
                                {/* Screen Content */}
                                <div className="absolute inset-0 bg-gray-800 flex flex-col">
                                    {/* Header */}
                                    <div className="h-16 bg-gradient-to-r from-neon-purple to-coral-orange flex items-center px-4 justify-between">
                                        <div className="w-8 h-1 bg-white/30 rounded-full"></div>
                                        <div className="w-8 h-8 rounded-full bg-white/20"></div>
                                    </div>
                                    {/* Product Grid Mockup */}
                                    <div className="p-4 grid grid-cols-2 gap-3">
                                        {[1, 2, 3, 4].map(i => (
                                            <div key={i} className="aspect-[3/4] bg-white/5 rounded-xl animate-pulse"></div>
                                        ))}
                                    </div>
                                    {/* Floating Button */}
                                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-16 h-16 bg-neon-purple rounded-full flex items-center justify-center shadow-lg shadow-neon-purple/50">
                                        <Camera className="w-8 h-8 text-white" />
                                    </div>
                                </div>
                            </div>

                            {/* Floating Product Cards (Glassmorphism) */}
                            <div className="absolute top-20 right-10 p-4 bg-white/80 dark:bg-surface-dark/80 backdrop-blur-md rounded-2xl shadow-xl z-30 animate-bounce-slow border border-white/20">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center text-2xl">👟</div>
                                    <div>
                                        <div className="text-xs text-gray-500">ขายออกแล้ว</div>
                                        <div className="font-bold text-green-600">฿3,500 +</div>
                                    </div>
                                </div>
                            </div>

                            <div className="absolute bottom-40 left-0 p-4 bg-white/80 dark:bg-surface-dark/80 backdrop-blur-md rounded-2xl shadow-xl z-30 animate-bounce-slow delay-700 border border-white/20">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center text-2xl">📱</div>
                                    <div>
                                        <div className="text-xs text-gray-500">iPhone 14 Pro</div>
                                        <div className="font-bold text-neon-purple">฿28,900</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Advanced Search Modal */}
            {showAdvancedSearch && (
                <AdvancedSearch onClose={() => setShowAdvancedSearch(false)} />
            )}
        </section>
    )
}
