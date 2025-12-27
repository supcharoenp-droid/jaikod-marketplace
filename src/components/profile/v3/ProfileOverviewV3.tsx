'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import {
    ShoppingBag, Package, Heart, MessageCircle, Star,
    TrendingUp, ArrowRight, Eye, Clock, AlertTriangle,
    CheckCircle, Plus, Zap, ChevronRight, Sparkles,
    Shield, Award, Users, Loader2
} from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import { useAuth } from '@/contexts/AuthContext'
import { getListingsBySeller, UniversalListing } from '@/lib/listings'
import { getSellerProfile } from '@/lib/seller'
import { ProfileCompletionWidget } from '@/components/trust'

// ==========================================
// INTERFACES
// ==========================================

interface ProfileStats {
    orders: {
        to_pay: number
        to_receive: number
        completed: number
    }
    listings: {
        active: number
        pending: number
        expired: number
        sold: number
    }
    wishlist: number
    messages: number
    reviews: { count: number; avg: number }
    trust_score: number
    jaistar: number
    followers: number
    views_this_week: number
}

interface WishlistItem {
    id: string
    image: string
    price: number
    title: string
}

// ==========================================
// COMPONENTS
// ==========================================

// Trust Score Card
function TrustScoreCard({ score, reviewCount, reviewAvg, language }: {
    score: number
    reviewCount: number
    reviewAvg: number
    language: 'th' | 'en'
}) {
    const getLevel = (s: number) => {
        if (s >= 90) return { label: language === 'th' ? 'ยอดเยี่ยม' : 'Excellent', color: 'text-emerald-500', bg: 'bg-emerald-500' }
        if (s >= 70) return { label: language === 'th' ? 'ดีมาก' : 'Great', color: 'text-blue-500', bg: 'bg-blue-500' }
        if (s >= 50) return { label: language === 'th' ? 'ปานกลาง' : 'Average', color: 'text-yellow-500', bg: 'bg-yellow-500' }
        return { label: language === 'th' ? 'ต้องปรับปรุง' : 'Needs Work', color: 'text-red-500', bg: 'bg-red-500' }
    }

    const level = getLevel(score)

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-slate-800 to-slate-900 text-white rounded-2xl p-5 relative overflow-hidden"
        >
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl" />

            <div className="flex items-center gap-2 mb-4">
                <Shield className="w-5 h-5 text-purple-400" />
                <span className="font-bold">{language === 'th' ? 'คะแนนความน่าเชื่อถือ' : 'Trust Score'}</span>
            </div>

            <div className="flex items-end gap-3 mb-4">
                <span className="text-4xl font-black">{score}</span>
                <span className="text-gray-400 mb-1">/100</span>
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${level.color} bg-white/10 ml-auto`}>
                    {level.label}
                </span>
            </div>

            {/* Progress bar */}
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${score}%` }}
                    transition={{ delay: 0.3, duration: 0.8 }}
                    className={`h-full ${level.bg}`}
                />
            </div>

            <div className="mt-4 flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                    <span className="text-gray-400">{language === 'th' ? 'ยืนยันตัวตน' : 'Verified'}</span>
                </div>
                <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-400" />
                    <span className="text-gray-400">{reviewAvg.toFixed(1)} ({reviewCount})</span>
                </div>
            </div>
        </motion.div>
    )
}

// Quick Stats Grid
function QuickStatsGrid({ stats, language }: { stats: ProfileStats; language: 'th' | 'en' }) {
    const buyerStats = [
        {
            icon: ShoppingBag,
            label: language === 'th' ? 'รอชำระ' : 'To Pay',
            count: stats.orders.to_pay,
            color: 'text-orange-500',
            bg: 'bg-orange-50 dark:bg-orange-900/20',
            href: '/profile/orders?status=pending'
        },
        {
            icon: Package,
            label: language === 'th' ? 'กำลังส่ง' : 'Shipping',
            count: stats.orders.to_receive,
            color: 'text-blue-500',
            bg: 'bg-blue-50 dark:bg-blue-900/20',
            href: '/profile/orders?status=shipping'
        },
        {
            icon: Heart,
            label: language === 'th' ? 'รายการโปรด' : 'Wishlist',
            count: stats.wishlist,
            color: 'text-pink-500',
            bg: 'bg-pink-50 dark:bg-pink-900/20',
            href: '/profile/wishlist'
        },
        {
            icon: MessageCircle,
            label: language === 'th' ? 'ข้อความ' : 'Messages',
            count: stats.messages,
            color: 'text-purple-500',
            bg: 'bg-purple-50 dark:bg-purple-900/20',
            href: '/profile/chats'
        }
    ]

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {buyerStats.map((stat, idx) => (
                <Link key={idx} href={stat.href}>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        whileHover={{ y: -3 }}
                        className={`${stat.bg} rounded-xl p-4 cursor-pointer transition-shadow hover:shadow-md relative overflow-hidden`}
                    >
                        <div className="flex items-start justify-between mb-2">
                            <stat.icon className={`w-6 h-6 ${stat.color}`} />
                            {stat.count > 0 && (
                                <span className="px-2 py-0.5 bg-red-500 text-white text-xs font-bold rounded-full">
                                    {stat.count}
                                </span>
                            )}
                        </div>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.count}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
                    </motion.div>
                </Link>
            ))}
        </div>
    )
}

// My Listings Summary
function MyListingsSummary({ listings, stats, language, loading }: {
    listings: UniversalListing[]
    stats: ProfileStats['listings']
    language: 'th' | 'en'
    loading: boolean
}) {
    const formatPrice = (price: number) => new Intl.NumberFormat('th-TH').format(price)
    const getDaysAgo = (date: Date) => {
        const days = Math.floor((Date.now() - new Date(date).getTime()) / (24 * 60 * 60 * 1000))
        if (days === 0) return language === 'th' ? 'วันนี้' : 'Today'
        return language === 'th' ? `${days} วันที่แล้ว` : `${days}d ago`
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700"
        >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-slate-700">
                <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <Package className="w-5 h-5 text-purple-500" />
                    {language === 'th' ? 'ประกาศของฉัน' : 'My Listings'}
                </h3>
                <Link
                    href="/sell"
                    className="flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-medium rounded-lg hover:opacity-90 transition-opacity"
                >
                    <Plus className="w-4 h-4" />
                    {language === 'th' ? 'ลงประกาศ' : 'New'}
                </Link>
            </div>

            {/* Status Tabs */}
            <div className="flex gap-2 p-4 overflow-x-auto">
                {[
                    { key: 'active', label: language === 'th' ? 'กำลังขาย' : 'Active', count: stats.active, icon: '🟢' },
                    { key: 'pending', label: language === 'th' ? 'รอตรวจสอบ' : 'Pending', count: stats.pending, icon: '⏳' },
                    { key: 'expired', label: language === 'th' ? 'หมดอายุ' : 'Expired', count: stats.expired, icon: '⏰', warning: stats.expired > 0 },
                    { key: 'sold', label: language === 'th' ? 'ขายแล้ว' : 'Sold', count: stats.sold, icon: '✅' }
                ].map(tab => (
                    <Link
                        key={tab.key}
                        href={`/profile/listings?status=${tab.key}`}
                        className={`flex-shrink-0 flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-colors
                            ${tab.warning
                                ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400'
                                : 'bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600'
                            }
                        `}
                    >
                        <span>{tab.icon}</span>
                        <span>{tab.label}</span>
                        <span className="font-bold">{tab.count}</span>
                        {tab.warning && <AlertTriangle className="w-4 h-4" />}
                    </Link>
                ))}
            </div>

            {/* Expiry Warning */}
            {stats.expired > 0 && (
                <div className="mx-4 mb-4 p-3 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-2 text-orange-600 dark:text-orange-400">
                        <AlertTriangle className="w-4 h-4" />
                        <span className="text-sm font-medium">
                            {stats.expired} {language === 'th' ? 'ประกาศหมดอายุ' : 'expired listings'}
                        </span>
                    </div>
                    <Link href="/profile/listings?status=expired" className="text-sm font-bold text-orange-600 hover:underline">
                        {language === 'th' ? 'ต่ออายุ' : 'Renew'} →
                    </Link>
                </div>
            )}

            {/* Listings Preview */}
            <div className="p-4 pt-0 space-y-3">
                {loading ? (
                    <div className="flex items-center justify-center py-8">
                        <Loader2 className="w-6 h-6 text-purple-500 animate-spin" />
                        <span className="ml-2 text-gray-500">{language === 'th' ? 'กำลังโหลด...' : 'Loading...'}</span>
                    </div>
                ) : listings.length === 0 ? (
                    <div className="text-center py-8">
                        <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500">{language === 'th' ? 'ยังไม่มีประกาศ' : 'No listings yet'}</p>
                        <Link href="/sell" className="text-purple-500 font-medium hover:underline">
                            {language === 'th' ? 'เริ่มลงขายเลย' : 'Start selling now'}
                        </Link>
                    </div>
                ) : (
                    listings.slice(0, 3).map((listing, idx) => (
                        <motion.div
                            key={listing.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="flex gap-3 p-3 bg-gray-50 dark:bg-slate-700/50 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
                        >
                            {/* Thumbnail */}
                            <Link href={`/listing/${listing.slug}`}>
                                <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0">
                                    {listing.thumbnail_url ? (
                                        <Image
                                            src={listing.thumbnail_url}
                                            alt={listing.title}
                                            fill
                                            className="object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-gray-300 dark:bg-slate-600">
                                            <Package className="w-6 h-6 text-gray-400" />
                                        </div>
                                    )}
                                    {listing.status === 'expired' && (
                                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                            <span className="text-white text-xs font-bold">หมดอายุ</span>
                                        </div>
                                    )}
                                </div>
                            </Link>

                            {/* Info */}
                            <div className="flex-1 min-w-0">
                                <Link href={`/listing/${listing.slug}`}>
                                    <h4 className="font-medium text-gray-900 dark:text-white truncate hover:text-purple-500 transition-colors">
                                        {listing.title}
                                    </h4>
                                </Link>
                                <p className="text-sm font-bold text-purple-500">฿{formatPrice(listing.price)}</p>
                                <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                                    <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{listing.stats?.views || 0}</span>
                                    <span className="flex items-center gap-1"><Heart className="w-3 h-3" />{listing.stats?.favorites || 0}</span>
                                    <span className="flex items-center gap-1"><MessageCircle className="w-3 h-3" />{listing.stats?.inquiries || 0}</span>
                                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{getDaysAgo(listing.created_at)}</span>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex flex-col gap-1">
                                <button className="p-2 hover:bg-purple-100 dark:hover:bg-purple-900/30 rounded-lg transition-colors">
                                    <Zap className="w-4 h-4 text-yellow-500" />
                                </button>
                            </div>
                        </motion.div>
                    ))
                )}
            </div>

            {/* View All */}
            <Link href="/profile/listings" className="flex items-center justify-center gap-2 p-4 border-t border-gray-100 dark:border-slate-700 text-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors">
                {language === 'th' ? 'ดูประกาศทั้งหมด' : 'View All Listings'}
                <ChevronRight className="w-4 h-4" />
            </Link>
        </motion.div>
    )
}

// AI Insights Card
function AIInsightsCard({ listings, stats, language }: {
    listings: UniversalListing[]
    stats: ProfileStats
    language: 'th' | 'en'
}) {
    // Generate dynamic AI insights based on real data
    const insights: { type: 'tip' | 'warning' | 'success'; message: string }[] = []

    // Check for popular listings
    const popularListing = listings.find(l => (l.stats?.views || 0) > 100)
    if (popularListing) {
        insights.push({
            type: 'tip',
            message: language === 'th'
                ? `สินค้า "${popularListing.title.substring(0, 20)}..." มีคนดูเยอะ! ลองใช้ Boost เพิ่มยอดขาย`
                : `"${popularListing.title.substring(0, 20)}..." is popular! Try Boost to increase sales`
        })
    }

    // Check for expiring listings
    if (stats.listings.expired > 0) {
        insights.push({
            type: 'warning',
            message: language === 'th'
                ? `${stats.listings.expired} ประกาศหมดอายุแล้ว กรุณาต่ออายุ`
                : `${stats.listings.expired} listings expired. Please renew`
        })
    }

    // Trust score insight
    if (stats.trust_score >= 80) {
        insights.push({
            type: 'success',
            message: language === 'th'
                ? `คะแนนความน่าเชื่อถือของคุณสูงมาก! (${stats.trust_score}/100)`
                : `Your trust score is excellent! (${stats.trust_score}/100)`
        })
    } else if (stats.trust_score < 50) {
        insights.push({
            type: 'warning',
            message: language === 'th'
                ? 'ยืนยันตัวตนเพื่อเพิ่มความน่าเชื่อถือ'
                : 'Verify your identity to increase trust score'
        })
    }

    // Default insight if no others
    if (insights.length === 0) {
        insights.push({
            type: 'tip',
            message: language === 'th'
                ? 'เพิ่มรูปภาพสินค้าให้ครบ 5 รูปเพื่อเพิ่มโอกาสขาย'
                : 'Add 5 product photos to increase sales chances'
        })
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl p-4 border border-purple-100 dark:border-purple-800/30"
        >
            <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-purple-500" />
                <span className="font-bold text-gray-900 dark:text-white">
                    {language === 'th' ? 'AI แนะนำสำหรับคุณ' : 'AI Insights'}
                </span>
            </div>

            <div className="space-y-3">
                {insights.map((insight, idx) => (
                    <div
                        key={idx}
                        className={`flex items-start gap-3 p-3 rounded-xl ${insight.type === 'warning'
                            ? 'bg-orange-100 dark:bg-orange-900/30'
                            : insight.type === 'success'
                                ? 'bg-emerald-100 dark:bg-emerald-900/30'
                                : 'bg-white dark:bg-slate-800'
                            }`}
                    >
                        <span className="text-lg">
                            {insight.type === 'warning' ? '⚠️' : insight.type === 'success' ? '✅' : '💡'}
                        </span>
                        <p className="text-sm text-gray-700 dark:text-gray-300">{insight.message}</p>
                    </div>
                ))}
            </div>
        </motion.div>
    )
}

// Wishlist Preview
function WishlistPreview({ count, language }: { count: number; language: 'th' | 'en' }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-slate-700"
        >
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <Heart className="w-5 h-5 text-pink-500 fill-pink-500" />
                    {language === 'th' ? 'รายการโปรด' : 'Wishlist'}
                </h3>
                <Link href="/profile/wishlist" className="text-sm text-purple-500 hover:underline flex items-center gap-1">
                    {language === 'th' ? 'ดูทั้งหมด' : 'View All'} <ArrowRight className="w-4 h-4" />
                </Link>
            </div>

            <div className="text-center py-6">
                <div className="text-4xl font-bold text-pink-500 mb-2">{count}</div>
                <p className="text-sm text-gray-500">{language === 'th' ? 'รายการที่บันทึกไว้' : 'Saved Items'}</p>
            </div>

            <Link
                href="/profile/wishlist"
                className="block w-full text-center py-2 bg-pink-50 dark:bg-pink-900/20 text-pink-600 dark:text-pink-400 rounded-lg text-sm font-medium hover:bg-pink-100 dark:hover:bg-pink-900/30 transition-colors"
            >
                {language === 'th' ? 'ดูรายการโปรด' : 'View Wishlist'}
            </Link>
        </motion.div>
    )
}

// Performance Summary (For Sellers)
function PerformanceCard({ stats, language }: { stats: ProfileStats; language: 'th' | 'en' }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-slate-700"
        >
            <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-emerald-500" />
                <span className="font-bold text-gray-900 dark:text-white">
                    {language === 'th' ? 'ผลงานสัปดาห์นี้' : "This Week's Performance"}
                </span>
            </div>

            <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.views_this_week}</p>
                    <p className="text-xs text-gray-500">{language === 'th' ? 'ยอดเข้าชม' : 'Views'}</p>
                </div>
                <div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.messages}</p>
                    <p className="text-xs text-gray-500">{language === 'th' ? 'คนสนใจ' : 'Inquiries'}</p>
                </div>
                <div>
                    <p className="text-2xl font-bold text-emerald-500">{stats.listings.sold}</p>
                    <p className="text-xs text-gray-500">{language === 'th' ? 'ขายได้' : 'Sold'}</p>
                </div>
            </div>
        </motion.div>
    )
}

// ==========================================
// MAIN COMPONENT
// ==========================================

interface ProfileOverviewV3Props {
    memberType?: 'general' | 'store_general' | 'store_official'
}

export default function ProfileOverviewV3({ memberType = 'general' }: ProfileOverviewV3Props) {
    const { t, language } = useLanguage()
    const { user } = useAuth()

    // State for real data
    const [loading, setLoading] = useState(true)
    const [listings, setListings] = useState<UniversalListing[]>([])
    const [stats, setStats] = useState<ProfileStats>({
        orders: { to_pay: 0, to_receive: 0, completed: 0 },
        listings: { active: 0, pending: 0, expired: 0, sold: 0 },
        wishlist: 0,
        messages: 0,
        reviews: { count: 0, avg: 0 },
        trust_score: 50,
        jaistar: 0,
        followers: 0,
        views_this_week: 0
    })

    // Fetch real data on mount
    useEffect(() => {
        async function fetchData() {
            if (!user?.uid) {
                setLoading(false)
                return
            }

            try {
                setLoading(true)

                // Fetch seller listings
                const userListings = await getListingsBySeller(user.uid, 50)
                setListings(userListings)

                // Calculate real stats from listings
                const activeListings = userListings.filter(l => l.status === 'active')
                const pendingListings = userListings.filter(l => l.status === 'pending')
                const expiredListings = userListings.filter(l => l.status === 'expired')
                const soldListings = userListings.filter(l => l.status === 'sold')

                // Calculate total views
                const totalViews = userListings.reduce((sum, l) => sum + (l.stats?.views || 0), 0)
                const totalInquiries = userListings.reduce((sum, l) => sum + (l.stats?.inquiries || 0), 0)

                // Try to get seller profile for trust score
                let trustScore = 50
                let reviewCount = 0
                let reviewAvg = 0
                let jaistar = 0

                try {
                    const sellerProfile = await getSellerProfile(user.uid)
                    if (sellerProfile) {
                        trustScore = sellerProfile.trust_score || 50
                        reviewCount = sellerProfile.rating_count || 0
                        reviewAvg = sellerProfile.rating_avg || 0
                        // jaistar not in Store type yet, default to 0
                    }
                } catch (e) {
                    console.log('No seller profile yet')
                }

                // Update stats with real data
                setStats({
                    orders: {
                        to_pay: 1, // TODO: Fetch from orders collection
                        to_receive: 2, // TODO: Fetch from orders collection
                        completed: 0
                    },
                    listings: {
                        active: activeListings.length,
                        pending: pendingListings.length,
                        expired: expiredListings.length,
                        sold: soldListings.length
                    },
                    wishlist: 2, // TODO: Fetch from wishlist collection
                    messages: totalInquiries,
                    reviews: { count: reviewCount, avg: reviewAvg },
                    trust_score: trustScore,
                    jaistar: jaistar,
                    followers: 0,
                    views_this_week: totalViews
                })

            } catch (error) {
                console.error('Error fetching profile data:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [user?.uid])

    const isSeller = stats.listings.active > 0 || stats.listings.sold > 0 || listings.length > 0

    return (
        <div className="space-y-6">
            {/* Trust Score (Top Priority) */}
            <TrustScoreCard
                score={stats.trust_score}
                reviewCount={stats.reviews.count}
                reviewAvg={stats.reviews.avg}
                language={language as 'th' | 'en'}
            />

            {/* Verification Prompt - Encourage users to verify */}
            <ProfileCompletionWidget
                trustScore={stats.trust_score}
                verifications={{
                    phone: stats.trust_score >= 65,  // Inferred from trust score
                    id: stats.trust_score >= 90,
                    bank: stats.trust_score >= 80
                }}
            />

            {/* AI Insights */}
            <AIInsightsCard
                listings={listings}
                stats={stats}
                language={language as 'th' | 'en'}
            />

            {/* Quick Stats */}
            <QuickStatsGrid stats={stats} language={language as 'th' | 'en'} />

            {/* Two Column Layout */}
            <div className="grid md:grid-cols-2 gap-6">
                {/* Left: My Listings (if seller) */}
                {(isSeller || !loading) && (
                    <div className="md:col-span-2">
                        <MyListingsSummary
                            listings={listings}
                            stats={stats.listings}
                            language={language as 'th' | 'en'}
                            loading={loading}
                        />
                    </div>
                )}

                {/* Performance & Wishlist */}
                <PerformanceCard stats={stats} language={language as 'th' | 'en'} />
                <WishlistPreview count={stats.wishlist} language={language as 'th' | 'en'} />
            </div>

            {/* Upgrade CTA (For General Members) */}
            {memberType === 'general' && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-6 text-white relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl" />

                    <div className="relative">
                        <div className="flex items-center gap-2 mb-2">
                            <Award className="w-6 h-6" />
                            <span className="font-bold text-lg">
                                {language === 'th' ? 'เปิดร้านค้ากับ JaiKod' : 'Open Your Store on JaiKod'}
                            </span>
                        </div>

                        <p className="text-white/80 mb-4 max-w-md">
                            {language === 'th'
                                ? 'ปลดล็อคฟีเจอร์พิเศษ ลงขายไม่จำกัด หน้าร้านส่วนตัว และอีกมากมาย'
                                : 'Unlock unlimited listings, custom storefront, analytics, and more'
                            }
                        </p>

                        <div className="flex flex-wrap gap-4 mb-4 text-sm">
                            <span className="flex items-center gap-1">
                                <CheckCircle className="w-4 h-4" />
                                {language === 'th' ? 'ลงขายไม่จำกัด' : 'Unlimited listings'}
                            </span>
                            <span className="flex items-center gap-1">
                                <CheckCircle className="w-4 h-4" />
                                {language === 'th' ? 'หน้าร้านส่วนตัว' : 'Custom storefront'}
                            </span>
                            <span className="flex items-center gap-1">
                                <CheckCircle className="w-4 h-4" />
                                {language === 'th' ? 'Commission ลด 1%' : '1% lower commission'}
                            </span>
                        </div>

                        <Link
                            href="/store/create"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-purple-600 font-bold rounded-xl hover:bg-gray-100 transition-colors"
                        >
                            {language === 'th' ? 'เริ่มต้นฟรี' : 'Start Free'}
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                </motion.div>
            )}
        </div>
    )
}
