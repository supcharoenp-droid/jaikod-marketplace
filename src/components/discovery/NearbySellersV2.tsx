'use client'

/**
 * Nearby Sellers V2 - Premium Luxury Edition
 * 
 * Features:
 * - Real data from Firestore
 * - Glassmorphism design
 * - Smooth animations
 * - Trust score visualization
 * - Distance calculation
 * - Responsive grid layout
 */

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
    MapPin,
    ShieldCheck,
    Star,
    Award,
    ChevronRight,
    Sparkles,
    TrendingUp,
    Clock,
    Users,
    Store,
    Zap,
    Crown,
    BadgeCheck,
    MessageCircle,
    ArrowRight
} from 'lucide-react'
import { getNearbySellers, RecommendedSeller } from '@/lib/seller'
import { useLanguage } from '@/contexts/LanguageContext'

const translations = {
    th: {
        title: 'ผู้ขายแนะนำใกล้คุณ',
        subtitle: 'คัดสรรร้านค้าคุณภาพ • เชื่อถือได้ • ใกล้บ้านคุณ',
        viewAll: 'ดูทั้งหมด',
        trustScore: 'ความน่าเชื่อถือ',
        km: 'กม.',
        sales: 'ยอดขาย',
        verified: 'ยืนยันตัวตน',
        topSeller: 'ผู้ขายดีเด่น',
        fastReply: 'ตอบไว',
        visitShop: 'เยี่ยมชมร้าน',
        noSellers: 'ยังไม่มีผู้ขายในพื้นที่ของคุณ',
        noSellersDesc: 'ลองกลับมาดูอีกครั้งภายหลัง หรือเป็นคนแรกที่เปิดร้าน!',
        startSelling: 'เริ่มขายสินค้า',
        responseRate: 'อัตราตอบกลับ',
        rating: 'คะแนน',
        nearby: 'ใกล้คุณ',
        trusted: 'น่าเชื่อถือ',
        recommended: 'แนะนำ',
    },
    en: {
        title: 'Recommended Sellers Near You',
        subtitle: 'Premium shops • Trusted • Near your location',
        viewAll: 'View All',
        trustScore: 'Trust Score',
        km: 'km',
        sales: 'Sales',
        verified: 'Verified',
        topSeller: 'Top Seller',
        fastReply: 'Fast Reply',
        visitShop: 'Visit Shop',
        noSellers: 'No sellers in your area yet',
        noSellersDesc: 'Check back later or be the first to open a shop!',
        startSelling: 'Start Selling',
        responseRate: 'Response Rate',
        rating: 'Rating',
        nearby: 'Nearby',
        trusted: 'Trusted',
        recommended: 'Recommended',
    }
}

// Trust score badge colors
function getTrustBadgeStyle(score: number) {
    if (score >= 90) return {
        bg: 'from-emerald-500 to-green-600',
        text: 'text-white',
        glow: 'shadow-emerald-500/30'
    }
    if (score >= 75) return {
        bg: 'from-blue-500 to-indigo-600',
        text: 'text-white',
        glow: 'shadow-blue-500/30'
    }
    if (score >= 60) return {
        bg: 'from-amber-400 to-orange-500',
        text: 'text-white',
        glow: 'shadow-amber-500/30'
    }
    return {
        bg: 'from-gray-400 to-gray-500',
        text: 'text-white',
        glow: 'shadow-gray-500/20'
    }
}

// Premium Seller Card Component
function SellerCard({ seller, index, t }: { seller: RecommendedSeller; index: number; t: typeof translations.th }) {
    const trustStyle = getTrustBadgeStyle(seller.trustScore)

    return (
        <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: index * 0.1, duration: 0.4, ease: 'easeOut' }}
            whileHover={{ y: -4, scale: 1.02 }}
            className="group relative"
        >
            <div className="relative bg-white dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl border border-gray-100 dark:border-gray-700/50 overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500">
                {/* Gradient Overlay Top */}
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Shop Cover/Header */}
                <div className="relative h-20 bg-gradient-to-br from-gray-100 to-gray-50 dark:from-gray-700 dark:to-gray-800 overflow-hidden">
                    {seller.shopCover ? (
                        <img
                            src={seller.shopCover}
                            alt=""
                            className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                        />
                    ) : (
                        <div className="absolute inset-0 opacity-30">
                            <div className="absolute top-2 left-4 w-8 h-8 rounded-full bg-purple-500/20" />
                            <div className="absolute top-8 right-8 w-4 h-4 rounded-full bg-blue-500/20" />
                            <div className="absolute bottom-2 left-1/2 w-6 h-6 rounded-full bg-pink-500/20" />
                        </div>
                    )}

                    {/* Trust Score Badge */}
                    <div className={`absolute top-3 right-3 px-2.5 py-1 rounded-full bg-gradient-to-r ${trustStyle.bg} ${trustStyle.text} ${trustStyle.glow} shadow-lg flex items-center gap-1`}>
                        <Sparkles className="w-3 h-3" />
                        <span className="text-xs font-bold">{seller.trustScore}%</span>
                    </div>

                    {/* Distance Badge */}
                    {seller.distanceKm !== null && (
                        <div className="absolute bottom-3 left-3 px-2 py-1 rounded-full bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm text-xs font-medium text-gray-700 dark:text-gray-200 flex items-center gap-1 shadow-sm">
                            <MapPin className="w-3 h-3 text-blue-500" />
                            <span>{seller.distanceKm.toFixed(1)} {t.km}</span>
                        </div>
                    )}
                </div>

                {/* Avatar - Overlapping */}
                <div className="relative -mt-8 px-4">
                    <div className="relative inline-block">
                        <div className="w-16 h-16 rounded-2xl bg-white dark:bg-gray-900 p-1 shadow-xl ring-2 ring-white dark:ring-gray-900">
                            {seller.shopLogo ? (
                                <img
                                    src={seller.shopLogo}
                                    alt={seller.shopName}
                                    className="w-full h-full object-cover rounded-xl"
                                />
                            ) : (
                                <div className="w-full h-full rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-xl font-bold">
                                    {seller.shopName.charAt(0)}
                                </div>
                            )}
                        </div>

                        {/* Verified Badge */}
                        {seller.isVerified && (
                            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center ring-2 ring-white dark:ring-gray-900">
                                <BadgeCheck className="w-4 h-4 text-white" />
                            </div>
                        )}
                    </div>
                </div>

                {/* Content */}
                <div className="p-4 pt-2">
                    {/* Shop Name & Rating */}
                    <div className="flex items-start justify-between mb-3">
                        <div>
                            <h3 className="font-bold text-gray-900 dark:text-white line-clamp-1 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                                {seller.shopName}
                            </h3>
                            {seller.province && (
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                    {seller.amphoe && `${seller.amphoe}, `}{seller.province}
                                </p>
                            )}
                        </div>

                        {/* Rating */}
                        {seller.ratingScore > 0 && (
                            <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-amber-50 dark:bg-amber-900/20">
                                <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                                <span className="text-sm font-bold text-amber-600 dark:text-amber-400">
                                    {seller.ratingScore.toFixed(1)}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Stats Row */}
                    <div className="flex items-center gap-3 mb-3 text-xs text-gray-500 dark:text-gray-400">
                        {seller.totalSales > 0 && (
                            <div className="flex items-center gap-1">
                                <TrendingUp className="w-3 h-3 text-green-500" />
                                <span>{seller.totalSales}+ {t.sales}</span>
                            </div>
                        )}
                        {seller.responseRate > 0 && (
                            <div className="flex items-center gap-1">
                                <MessageCircle className="w-3 h-3 text-blue-500" />
                                <span>{seller.responseRate}%</span>
                            </div>
                        )}
                    </div>

                    {/* Match Reason Tag */}
                    <div className="mb-4">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/30 dark:to-pink-900/30 text-purple-600 dark:text-purple-400 border border-purple-100 dark:border-purple-800/50">
                            <Zap className="w-3 h-3" />
                            {seller.matchReason}
                        </span>
                    </div>

                    {/* Categories */}
                    {seller.mainCategories.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-4">
                            {seller.mainCategories.slice(0, 3).map((cat, i) => (
                                <span key={i} className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                                    {cat}
                                </span>
                            ))}
                        </div>
                    )}

                    {/* Visit Button */}
                    <Link
                        href={`/shop/${seller.shopSlug}`}
                        className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-gradient-to-r from-gray-900 to-gray-800 dark:from-white dark:to-gray-100 text-white dark:text-gray-900 text-sm font-semibold hover:shadow-lg hover:scale-[1.02] transition-all duration-300 group/btn"
                    >
                        <Store className="w-4 h-4" />
                        <span>{t.visitShop}</span>
                        <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover/btn:opacity-100 group-hover/btn:translate-x-0 transition-all" />
                    </Link>
                </div>

                {/* Badges */}
                {seller.badges.length > 0 && (
                    <div className="absolute top-12 left-3 flex flex-col gap-1">
                        {seller.badges.includes('top_seller') && (
                            <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-[10px] font-bold shadow-lg">
                                <Crown className="w-2.5 h-2.5" />
                                TOP
                            </span>
                        )}
                    </div>
                )}
            </div>
        </motion.div>
    )
}

// Empty State Component
function EmptyState({ t }: { t: typeof translations.th }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12 px-6"
        >
            <div className="relative inline-block mb-6">
                <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 flex items-center justify-center">
                    <Store className="w-12 h-12 text-purple-400" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                </div>
            </div>
            <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2">{t.noSellers}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 max-w-sm mx-auto">{t.noSellersDesc}</p>
            <Link
                href="/sell"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold hover:shadow-lg hover:scale-105 transition-all"
            >
                <Store className="w-4 h-4" />
                {t.startSelling}
            </Link>
        </motion.div>
    )
}

// Loading Skeleton
function LoadingSkeleton() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden animate-pulse">
                    <div className="h-20 bg-gray-200 dark:bg-gray-700" />
                    <div className="p-4">
                        <div className="flex items-center gap-3 -mt-10 mb-4">
                            <div className="w-16 h-16 rounded-2xl bg-gray-300 dark:bg-gray-600" />
                        </div>
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2" />
                        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-4" />
                        <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-xl" />
                    </div>
                </div>
            ))}
        </div>
    )
}

// Main Component
export default function NearbySellersV2() {
    const { language } = useLanguage()
    const t = translations[language as 'th' | 'en'] || translations.th
    const [sellers, setSellers] = useState<RecommendedSeller[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const loadSellers = async () => {
            try {
                setLoading(true)
                const realSellers = await getNearbySellers(6)
                setSellers(realSellers)
            } catch (error) {
                console.error('Error loading sellers:', error)
            } finally {
                setLoading(false)
            }
        }

        loadSellers()
    }, [])

    // Don't render if no sellers and not loading
    if (!loading && sellers.length === 0) {
        return (
            <section className="py-10">
                <div className="container mx-auto px-4">
                    {/* Section Header */}
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-4">
                            <div className="relative">
                                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/25">
                                    <MapPin className="w-7 h-7 text-white" />
                                </div>
                                <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-green-500 border-2 border-white dark:border-gray-900 animate-pulse" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{t.title}</h2>
                                <p className="text-sm text-gray-500 dark:text-gray-400">{t.subtitle}</p>
                            </div>
                        </div>
                    </div>

                    <EmptyState t={t} />
                </div>
            </section>
        )
    }

    return (
        <section className="py-10 relative overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute inset-0 pointer-events-none opacity-30 dark:opacity-10">
                <div className="absolute top-20 left-1/4 w-96 h-96 rounded-full bg-gradient-to-r from-blue-300 to-purple-300 blur-3xl" />
                <div className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full bg-gradient-to-r from-pink-300 to-orange-300 blur-3xl" />
            </div>

            <div className="container mx-auto px-4 relative z-10">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-between mb-8"
                >
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/25">
                                <MapPin className="w-7 h-7 text-white" />
                            </div>
                            <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-green-500 border-2 border-white dark:border-gray-900 animate-pulse" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{t.title}</h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{t.subtitle}</p>
                        </div>
                    </div>

                    <Link
                        href="/sellers/nearby"
                        className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                    >
                        {t.viewAll}
                        <ChevronRight className="w-4 h-4" />
                    </Link>
                </motion.div>

                {/* Sellers Grid */}
                {loading ? (
                    <LoadingSkeleton />
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {sellers.map((seller, index) => (
                            <SellerCard key={seller.id} seller={seller} index={index} t={t} />
                        ))}
                    </div>
                )}

                {/* Mobile View All */}
                {!loading && sellers.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="md:hidden mt-6 text-center"
                    >
                        <Link
                            href="/sellers/nearby"
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                        >
                            {t.viewAll}
                            <ChevronRight className="w-4 h-4" />
                        </Link>
                    </motion.div>
                )}
            </div>
        </section>
    )
}
