/**
 * FEATURED SELLER BANNER
 * Hero banner for promoted sellers (JaiStar)
 */

'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Sparkles, Star, Award, ArrowRight, TrendingUp } from 'lucide-react'
import PromotionBadge from './PromotionBadge'

// ==========================================
// TYPES
// ==========================================

interface FeaturedSeller {
    id: string
    shop_name: string
    slug: string
    description: string
    badge_text?: string
    stats: {
        rating: number
        total_sales: number
        satisfaction_rate: number
    }
    badges: string[]
    image_url?: string
    banner_url?: string
}

interface FeaturedSellerBannerProps {
    sellerId?: string
    className?: string
}

// ==========================================
// COMPONENT
// ==========================================

export default function FeaturedSellerBanner({
    sellerId = 'jaistar',
    className = ''
}: FeaturedSellerBannerProps) {
    const [seller, setSeller] = useState<FeaturedSeller | null>(null)
    const [loading, setLoading] = useState(true)

    // Fetch featured seller data
    useEffect(() => {
        const fetchSeller = async () => {
            try {
                // For now, use hardcoded data for jaistar
                // TODO: Replace with actual API call
                const mockData: FeaturedSeller = {
                    id: 'jaistar',
                    shop_name: 'JaiStar Premium Shop',
                    slug: 'jaistar',
                    description: '🌟 ผู้ขายอันดับ 1 | รับประกันคุณภาพ 100% | สินค้าแท้ จัดส่งรวดเร็ว',
                    badge_text: 'Top Seller 2026',
                    stats: {
                        rating: 5.0,
                        total_sales: 1234,
                        satisfaction_rate: 99
                    },
                    badges: ['verified', 'fast_shipping', 'premium_quality'],
                    image_url: undefined,
                    banner_url: undefined
                }

                setSeller(mockData)
            } catch (error) {
                console.error('Failed to fetch featured seller:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchSeller()
    }, [sellerId])

    // Track impression
    useEffect(() => {
        if (seller) {
            // Track banner impression
            trackBannerImpression(seller.id)
        }
    }, [seller])

    const handleClick = () => {
        if (seller) {
            trackBannerClick(seller.id)
        }
    }

    if (loading) {
        return (
            <div className={`h-[400px] bg-gray-100 dark:bg-gray-800 animate-pulse rounded-2xl ${className}`} />
        )
    }

    if (!seller) return null

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className={`relative overflow-hidden rounded-2xl ${className}`}
        >
            {/* Background with gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-50 via-orange-50 to-pink-50 dark:from-yellow-900/20 dark:via-orange-900/20 dark:to-pink-900/20" />

            {/* Decorative blobs */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-yellow-400/20 to-orange-400/20 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-pink-400/20 to-purple-400/20 rounded-full blur-3xl" />

            {/* Content */}
            <div className="relative z-10 p-8 md:p-12">
                <div className="max-w-7xl mx-auto">
                    <div className="grid md:grid-cols-2 gap-8 items-center">
                        {/* Left: Content */}
                        <div>
                            {/* Promotion Badge */}
                            <div className="mb-4">
                                <PromotionBadge
                                    type="premium"
                                    size="lg"
                                    showInfo={true}
                                />
                            </div>

                            {/* Title */}
                            <motion.h1
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2 }}
                                className="text-4xl md:text-5xl font-black mb-4"
                            >
                                <span className="bg-gradient-to-r from-yellow-600 via-orange-600 to-pink-600 bg-clip-text text-transparent">
                                    {seller.shop_name}
                                </span>
                            </motion.h1>

                            {/* Description */}
                            <motion.p
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3 }}
                                className="text-gray-700 dark:text-gray-300 text-lg mb-6"
                            >
                                {seller.description}
                            </motion.p>

                            {/* Stats */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                                className="grid grid-cols-3 gap-4 mb-6"
                            >
                                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-4 shadow-lg">
                                    <div className="text-2xl font-bold text-yellow-600">⭐ {seller.stats.rating}</div>
                                    <div className="text-xs text-gray-600 dark:text-gray-400">คะแนน</div>
                                </div>
                                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-4 shadow-lg">
                                    <div className="text-2xl font-bold text-green-600">{seller.stats.total_sales.toLocaleString()}</div>
                                    <div className="text-xs text-gray-600 dark:text-gray-400">ขายแล้ว</div>
                                </div>
                                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-4 shadow-lg">
                                    <div className="text-2xl font-bold text-blue-600">{seller.stats.satisfaction_rate}%</div>
                                    <div className="text-xs text-gray-600 dark:text-gray-400">พึงพอใจ</div>
                                </div>
                            </motion.div>

                            {/* Badges */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                                className="flex flex-wrap gap-2 mb-6"
                            >
                                <span className="px-3 py-1.5 bg-purple-500 text-white text-xs font-semibold rounded-full flex items-center gap-1">
                                    <Award className="w-3 h-3" />
                                    {seller.badge_text || 'Top Seller'}
                                </span>
                                <span className="px-3 py-1.5 bg-blue-500 text-white text-xs font-semibold rounded-full">
                                    ✅ ยืนยันตัวตน
                                </span>
                                <span className="px-3 py-1.5 bg-green-500 text-white text-xs font-semibold rounded-full">
                                    🚀 จัดส่งรวดเร็ว
                                </span>
                                <span className="px-3 py-1.5 bg-pink-500 text-white text-xs font-semibold rounded-full">
                                    💎 คุณภาพพรีเมียม
                                </span>
                            </motion.div>

                            {/* CTA Buttons */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.6 }}
                                className="flex gap-4"
                            >
                                <Link
                                    href={`/shop/${seller.slug}`}
                                    onClick={handleClick}
                                    className="group px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
                                >
                                    <Sparkles className="w-5 h-5" />
                                    <span>เลือกซื้อสินค้า</span>
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </Link>

                                <Link
                                    href={`/profile/${seller.id}`}
                                    className="px-8 py-4 bg-white/90 dark:bg-gray-800/90 hover:bg-white dark:hover:bg-gray-800 text-gray-900 dark:text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all backdrop-blur-sm"
                                >
                                    ดูโปรไฟล์
                                </Link>
                            </motion.div>
                        </div>

                        {/* Right: Visual */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.4, duration: 0.6 }}
                            className="relative hidden md:block"
                        >
                            <div className="relative w-full h-[400px] flex items-center justify-center">
                                {/* Star avatar */}
                                <div className="relative">
                                    <div className="w-64 h-64 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-2xl animate-pulse">
                                        <Star className="w-32 h-32 text-white fill-white" />
                                    </div>

                                    {/* Floating badges */}
                                    <motion.div
                                        animate={{
                                            y: [0, -10, 0],
                                            rotate: [0, 5, 0]
                                        }}
                                        transition={{
                                            duration: 3,
                                            repeat: Infinity,
                                            ease: "easeInOut"
                                        }}
                                        className="absolute -top-8 -right-8 w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center shadow-lg"
                                    >
                                        <Sparkles className="w-8 h-8 text-white" />
                                    </motion.div>

                                    <motion.div
                                        animate={{
                                            y: [0, 10, 0],
                                            rotate: [0, -5, 0]
                                        }}
                                        transition={{
                                            duration: 2.5,
                                            repeat: Infinity,
                                            ease: "easeInOut"
                                        }}
                                        className="absolute -bottom-8 -left-8 w-12 h-12 bg-pink-500 rounded-full flex items-center justify-center shadow-lg"
                                    >
                                        <Award className="w-6 h-6 text-white" />
                                    </motion.div>

                                    <motion.div
                                        animate={{
                                            scale: [1, 1.1, 1]
                                        }}
                                        transition={{
                                            duration: 2,
                                            repeat: Infinity,
                                            ease: "easeInOut"
                                        }}
                                        className="absolute top-1/2 -right-12 w-10 h-10 bg-green-500 rounded-full flex items-center justify-center shadow-lg"
                                    >
                                        <TrendingUp className="w-5 h-5 text-white" />
                                    </motion.div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </motion.div>
    )
}

// ==========================================
// ANALYTICS TRACKING
// ==========================================

async function trackBannerImpression(sellerId: string) {
    try {
        await fetch('/api/analytics/banner/impression', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                seller_id: sellerId,
                placement: 'homepage_hero',
                timestamp: Date.now()
            })
        })

        if (process.env.NODE_ENV === 'development') {
            console.log('📊 Banner Impression:', sellerId)
        }
    } catch (error) {
        console.error('Failed to track banner impression:', error)
    }
}

async function trackBannerClick(sellerId: string) {
    try {
        await fetch('/api/analytics/banner/click', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                seller_id: sellerId,
                placement: 'homepage_hero',
                timestamp: Date.now()
            })
        })

        if (process.env.NODE_ENV === 'development') {
            console.log('👆 Banner Click:', sellerId)
        }
    } catch (error) {
        console.error('Failed to track banner click:', error)
    }
}
