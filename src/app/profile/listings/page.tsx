'use client'

/**
 * 📦 My Listings Page - Premium Edition
 * 
 * Features:
 * - Stats Summary Dashboard
 * - Sorting & Filtering
 * - Bulk Actions (Delete, Close, Renew)
 * - Listing Health Score
 * - Bilingual (Thai/English)
 * - Working CRUD operations
 */

import React, { useState, useEffect, useMemo, Suspense, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Package, Plus, Eye, Heart, MessageCircle, Clock,
    CheckCircle, AlertTriangle, XCircle, Trash2, Edit,
    Zap, RefreshCw, MoreVertical, ChevronRight, Search,
    Filter, ArrowUpDown, Calendar, Copy, ExternalLink,
    AlertCircle, CheckCircle2, RotateCcw, Lock, TrendingUp,
    DollarSign, ShoppingBag, BarChart3, ChevronDown,
    ArrowUp, ArrowDown, SlidersHorizontal, X
} from 'lucide-react'
import ProfileLayoutV3 from '@/components/profile/v3/ProfileLayoutV3'
import { useLanguage } from '@/contexts/LanguageContext'
import { useAuth } from '@/contexts/AuthContext'
import { getListingsBySeller, deleteListing, updateListingStatus } from '@/lib/listings'
import { UniversalListing } from '@/lib/listings/types'

// ==========================================
// TRANSLATIONS
// ==========================================

const T = {
    th: {
        pageTitle: 'ประกาศของฉัน',
        totalListings: 'ทั้งหมด {count} ประกาศ',
        newListing: 'ลงประกาศใหม่',

        // Stats
        totalViews: 'ยอดดูทั้งหมด',
        totalLikes: 'ถูกใจ',
        totalInquiries: 'สอบถาม',
        totalValue: 'มูลค่ารวม',
        thisWeek: 'สัปดาห์นี้',
        thisMonth: 'เดือนนี้',

        // Status
        all: 'ทั้งหมด',
        active: 'กำลังขาย',
        pending: 'รอตรวจสอบ',
        expired: 'หมดอายุ',
        sold: 'ขายแล้ว',
        closed: 'ปิดการขาย',
        rejected: 'ถูกปฏิเสธ',

        // Sorting
        sortBy: 'เรียงตาม',
        newestFirst: 'ใหม่สุด',
        oldestFirst: 'เก่าสุด',
        priceHighLow: 'ราคาสูง-ต่ำ',
        priceLowHigh: 'ราคาต่ำ-สูง',
        mostViews: 'ยอดดูมากสุด',
        mostLikes: 'ถูกใจมากสุด',

        // Actions
        edit: 'แก้ไข',
        boost: 'โปรโมท',
        copy: 'คัดลอกลิงก์',
        markSold: 'ขายแล้ว',
        close: 'ปิดการขาย',
        delete: 'ลบ',
        renew: 'ต่ออายุ',
        relist: 'ลงขายใหม่',
        reopen: 'เปิดขายใหม่',
        cancel: 'ยกเลิก',
        view: 'ดู',

        // Bulk Actions
        selected: 'เลือก {count} รายการ',
        bulkDelete: 'ลบที่เลือก',
        bulkClose: 'ปิดที่เลือก',
        bulkRenew: 'ต่ออายุที่เลือก',
        clearSelection: 'ยกเลิกการเลือก',

        // Expired Warning
        expiredWarning: '{count} ประกาศหมดอายุ',
        expiredHint: 'ต่ออายุเพื่อให้แสดงบนเว็บอีกครั้ง',
        viewExpired: 'ดูรายการ',

        // Empty State
        noListings: 'ยังไม่มีประกาศ',
        noListingsInCategory: 'ไม่พบประกาศในหมวดนี้',
        startSelling: 'เริ่มขายสินค้ากับเราวันนี้',
        createFirst: 'ลงประกาศแรก',

        // Other
        searchPlaceholder: 'ค้นหาประกาศ...',
        selectAll: 'เลือกทั้งหมด',
        expiresIn: 'หมดอายุใน {days} วัน',
        expiredDays: 'หมดอายุ {days} วันแล้ว',
        linkCopied: 'คัดลอกลิงก์แล้ว!',
        confirmDelete: 'ต้องการลบประกาศนี้?',
        confirmBulkDelete: 'ต้องการลบ {count} ประกาศที่เลือก?',
        confirmMarkSold: 'ยืนยันว่าขายแล้ว?',
        confirmClose: 'ปิดการขายประกาศนี้?',
        deleteSuccess: 'ลบประกาศสำเร็จ',
        updateSuccess: 'อัปเดตสถานะสำเร็จ',
        errorOccurred: 'เกิดข้อผิดพลาด กรุณาลองใหม่',

        // Health Score
        healthScore: 'คะแนนประกาศ',
        healthExcellent: 'ดีเยี่ยม',
        healthGood: 'ดี',
        healthFair: 'พอใช้',
        healthPoor: 'ควรปรับปรุง',
    },
    en: {
        pageTitle: 'My Listings',
        totalListings: '{count} listings total',
        newListing: 'New Listing',

        // Stats
        totalViews: 'Total Views',
        totalLikes: 'Likes',
        totalInquiries: 'Inquiries',
        totalValue: 'Total Value',
        thisWeek: 'This Week',
        thisMonth: 'This Month',

        // Status
        all: 'All',
        active: 'Active',
        pending: 'Pending',
        expired: 'Expired',
        sold: 'Sold',
        closed: 'Closed',
        rejected: 'Rejected',

        // Sorting
        sortBy: 'Sort by',
        newestFirst: 'Newest First',
        oldestFirst: 'Oldest First',
        priceHighLow: 'Price: High to Low',
        priceLowHigh: 'Price: Low to High',
        mostViews: 'Most Views',
        mostLikes: 'Most Likes',

        // Actions
        edit: 'Edit',
        boost: 'Boost',
        copy: 'Copy Link',
        markSold: 'Mark Sold',
        close: 'Close Listing',
        delete: 'Delete',
        renew: 'Renew',
        relist: 'Relist',
        reopen: 'Reopen',
        cancel: 'Cancel',
        view: 'View',

        // Bulk Actions
        selected: '{count} selected',
        bulkDelete: 'Delete Selected',
        bulkClose: 'Close Selected',
        bulkRenew: 'Renew Selected',
        clearSelection: 'Clear Selection',

        // Expired Warning
        expiredWarning: '{count} expired listings',
        expiredHint: 'Renew to show them again',
        viewExpired: 'View',

        // Empty State
        noListings: 'No listings yet',
        noListingsInCategory: 'No listings in this category',
        startSelling: 'Start selling with us today',
        createFirst: 'Create First Listing',

        // Other
        searchPlaceholder: 'Search listings...',
        selectAll: 'Select all',
        expiresIn: 'Expires in {days} days',
        expiredDays: 'Expired {days} days ago',
        linkCopied: 'Link copied!',
        confirmDelete: 'Delete this listing?',
        confirmBulkDelete: 'Delete {count} selected listings?',
        confirmMarkSold: 'Mark as sold?',
        confirmClose: 'Close this listing?',
        deleteSuccess: 'Listing deleted',
        updateSuccess: 'Status updated',
        errorOccurred: 'An error occurred. Please try again.',

        // Health Score
        healthScore: 'Listing Score',
        healthExcellent: 'Excellent',
        healthGood: 'Good',
        healthFair: 'Fair',
        healthPoor: 'Needs Work',
    }
}

// ==========================================
// TYPES
// ==========================================

type ListingStatus = 'all' | 'active' | 'pending' | 'expired' | 'sold' | 'closed' | 'rejected'
type SortOption = 'newest' | 'oldest' | 'price_high' | 'price_low' | 'views' | 'likes'
type Lang = 'th' | 'en'

interface StatusConfig {
    id: ListingStatus
    labelKey: string
    icon: React.ReactNode
    color: string
    bgColor: string
}

const STATUS_CONFIGS: StatusConfig[] = [
    { id: 'all', labelKey: 'all', icon: <Package className="w-4 h-4" />, color: 'text-gray-600', bgColor: 'bg-gray-100 dark:bg-gray-800' },
    { id: 'active', labelKey: 'active', icon: <CheckCircle className="w-4 h-4" />, color: 'text-emerald-600', bgColor: 'bg-emerald-100 dark:bg-emerald-900/30' },
    { id: 'pending', labelKey: 'pending', icon: <Clock className="w-4 h-4" />, color: 'text-yellow-600', bgColor: 'bg-yellow-100 dark:bg-yellow-900/30' },
    { id: 'expired', labelKey: 'expired', icon: <AlertTriangle className="w-4 h-4" />, color: 'text-orange-600', bgColor: 'bg-orange-100 dark:bg-orange-900/30' },
    { id: 'sold', labelKey: 'sold', icon: <CheckCircle2 className="w-4 h-4" />, color: 'text-blue-600', bgColor: 'bg-blue-100 dark:bg-blue-900/30' },
    { id: 'closed', labelKey: 'closed', icon: <Lock className="w-4 h-4" />, color: 'text-purple-600', bgColor: 'bg-purple-100 dark:bg-purple-900/30' },
    { id: 'rejected', labelKey: 'rejected', icon: <XCircle className="w-4 h-4" />, color: 'text-red-600', bgColor: 'bg-red-100 dark:bg-red-900/30' }
]

const SORT_OPTIONS: { id: SortOption; labelKey: string }[] = [
    { id: 'newest', labelKey: 'newestFirst' },
    { id: 'oldest', labelKey: 'oldestFirst' },
    { id: 'price_high', labelKey: 'priceHighLow' },
    { id: 'price_low', labelKey: 'priceLowHigh' },
    { id: 'views', labelKey: 'mostViews' },
    { id: 'likes', labelKey: 'mostLikes' },
]

// ==========================================
// STATS CARD COMPONENT
// ==========================================

interface StatsCardProps {
    icon: React.ReactNode
    label: string
    value: string | number
    trend?: number
    color: string
}

function StatsCard({ icon, label, value, trend, color }: StatsCardProps) {
    return (
        <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-slate-700">
            <div className="flex items-center justify-between mb-2">
                <div className={`p-2 rounded-lg ${color}`}>
                    {icon}
                </div>
                {trend !== undefined && (
                    <span className={`text-xs font-medium flex items-center gap-1 ${trend >= 0 ? 'text-green-500' : 'text-red-500'
                        }`}>
                        {trend >= 0 ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                        {Math.abs(trend)}%
                    </span>
                )}
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
        </div>
    )
}

// ==========================================
// LISTING CARD COMPONENT
// ==========================================

interface ListingCardProps {
    listing: UniversalListing
    t: typeof T.th
    lang: Lang
    onAction: (action: string, listing: UniversalListing) => void
    selected?: boolean
    onSelect?: (id: string) => void
}

function ListingCard({ listing, t, lang, onAction, selected, onSelect }: ListingCardProps) {
    const [showMenu, setShowMenu] = useState(false)

    const statusConfig = STATUS_CONFIGS.find(s => s.id === listing.status) || STATUS_CONFIGS[0]

    const formatPrice = (price: number) => new Intl.NumberFormat('th-TH').format(price)

    const getDaysRemaining = () => {
        if (!listing.expires_at) return null
        const now = new Date()
        const expires = new Date(listing.expires_at)
        const days = Math.ceil((expires.getTime() - now.getTime()) / (24 * 60 * 60 * 1000))
        if (days < 0) return { days: Math.abs(days), expired: true }
        return { days, expired: false }
    }

    const daysInfo = getDaysRemaining()

    // Calculate health score
    const healthScore = useMemo(() => {
        let score = 0
        if (listing.images && listing.images.length >= 5) score += 40
        else if (listing.images && listing.images.length >= 3) score += 25
        else if (listing.thumbnail_url) score += 10

        const desc = listing.template_data?.additional_description || listing.template_data?.description || ''
        if (typeof desc === 'string' && desc.length >= 100) score += 30
        else if (typeof desc === 'string' && desc.length >= 50) score += 15

        if (listing.price > 0) score += 20
        if (listing.location?.province) score += 10

        return score
    }, [listing])

    const getHealthLabel = () => {
        if (healthScore >= 80) return { label: t.healthExcellent, color: 'text-green-500', bg: 'bg-green-100' }
        if (healthScore >= 60) return { label: t.healthGood, color: 'text-blue-500', bg: 'bg-blue-100' }
        if (healthScore >= 40) return { label: t.healthFair, color: 'text-yellow-500', bg: 'bg-yellow-100' }
        return { label: t.healthPoor, color: 'text-red-500', bg: 'bg-red-100' }
    }

    const getActions = () => {
        switch (listing.status) {
            case 'active':
                return ['view', 'edit', 'boost', 'copy', 'markSold', 'close', 'delete']
            case 'expired':
                return ['view', 'renew', 'edit', 'delete']
            case 'sold':
                return ['view', 'relist', 'delete']
            case 'closed':
                return ['view', 'reopen', 'delete']
            case 'pending':
                return ['view', 'edit', 'cancel']
            case 'rejected':
                return ['view', 'edit', 'delete']
            default:
                return ['view']
        }
    }

    const actionIcons: Record<string, React.ReactNode> = {
        view: <ExternalLink className="w-4 h-4" />,
        edit: <Edit className="w-4 h-4" />,
        boost: <Zap className="w-4 h-4 text-yellow-500" />,
        copy: <Copy className="w-4 h-4" />,
        markSold: <CheckCircle2 className="w-4 h-4 text-blue-500" />,
        close: <Lock className="w-4 h-4" />,
        delete: <Trash2 className="w-4 h-4 text-red-500" />,
        renew: <RefreshCw className="w-4 h-4 text-green-500" />,
        relist: <RotateCcw className="w-4 h-4" />,
        reopen: <RefreshCw className="w-4 h-4" />,
        cancel: <XCircle className="w-4 h-4" />
    }

    const health = getHealthLabel()

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className={`bg-white dark:bg-slate-800 rounded-xl overflow-hidden shadow-sm border transition-all ${selected
                ? 'border-purple-500 ring-2 ring-purple-500/20'
                : 'border-gray-100 dark:border-slate-700 hover:shadow-md'
                }`}
        >
            <div className="flex gap-4 p-4">
                {/* Checkbox */}
                {onSelect && (
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            checked={selected}
                            onChange={() => onSelect(listing.id)}
                            className="w-5 h-5 rounded border-gray-300 text-purple-500 focus:ring-purple-500"
                        />
                    </div>
                )}

                {/* Thumbnail */}
                <Link href={`/listing/${listing.slug}`} className="relative flex-shrink-0">
                    <div className="w-28 h-28 md:w-36 md:h-36 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-700">
                        {listing.thumbnail_url ? (
                            <Image
                                src={listing.thumbnail_url}
                                alt={listing.title}
                                width={144}
                                height={144}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400 text-2xl">
                                📷
                            </div>
                        )}
                    </div>
                    {/* Status overlay for non-active */}
                    {listing.status !== 'active' && (
                        <div className={`absolute inset-0 ${statusConfig.bgColor} bg-opacity-80 flex items-center justify-center rounded-lg`}>
                            <span className={`text-sm font-bold ${statusConfig.color}`}>
                                {t[statusConfig.labelKey as keyof typeof t] || statusConfig.labelKey}
                            </span>
                        </div>
                    )}
                </Link>

                {/* Info */}
                <div className="flex-1 min-w-0 flex flex-col">
                    {/* Status + Code + Health Score */}
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${statusConfig.bgColor} ${statusConfig.color}`}>
                            {statusConfig.icon}
                            {t[statusConfig.labelKey as keyof typeof t] || statusConfig.labelKey}
                        </span>
                        <span className="text-xs text-gray-400 font-mono">
                            {listing.listing_code}
                        </span>
                        {/* Health Score Badge */}
                        <span className={`hidden md:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${health.bg} ${health.color}`}>
                            <BarChart3 className="w-3 h-3" />
                            {healthScore}%
                        </span>
                    </div>

                    {/* Title */}
                    <Link href={`/listing/${listing.slug}`}>
                        <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-2 hover:text-purple-500 transition-colors">
                            {listing.title}
                        </h3>
                    </Link>

                    {/* Price */}
                    <p className="text-lg font-bold text-purple-500 mt-1">
                        ฿{formatPrice(listing.price)}
                    </p>

                    {/* Stats */}
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                            <Eye className="w-4 h-4" />
                            {listing.stats?.views || 0}
                        </span>
                        <span className="flex items-center gap-1">
                            <Heart className="w-4 h-4" />
                            {listing.stats?.favorites || 0}
                        </span>
                        <span className="flex items-center gap-1">
                            <MessageCircle className="w-4 h-4" />
                            {listing.stats?.inquiries || 0}
                        </span>
                    </div>

                    {/* Expiry warning */}
                    {daysInfo && listing.status === 'active' && daysInfo.days <= 7 && !daysInfo.expired && (
                        <div className="mt-2 text-xs text-orange-500 flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3" />
                            {t.expiresIn.replace('{days}', daysInfo.days.toString())}
                        </div>
                    )}

                    {daysInfo && daysInfo.expired && (
                        <div className="mt-2 text-xs text-red-500 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            {t.expiredDays.replace('{days}', daysInfo.days.toString())}
                        </div>
                    )}
                </div>

                {/* Actions */}
                <div className="flex flex-col items-end justify-between flex-shrink-0">
                    {/* Quick actions */}
                    <div className="flex items-center gap-1">
                        {listing.status === 'active' && (
                            <button
                                onClick={() => onAction('boost', listing)}
                                className="p-2 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 rounded-lg transition-colors"
                                title={t.boost}
                            >
                                <Zap className="w-5 h-5 text-yellow-500" />
                            </button>
                        )}
                        {listing.status === 'expired' && (
                            <button
                                onClick={() => onAction('renew', listing)}
                                className="p-2 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                                title={t.renew}
                            >
                                <RefreshCw className="w-5 h-5 text-green-500" />
                            </button>
                        )}
                        <button
                            onClick={() => onAction('edit', listing)}
                            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                            title={t.edit}
                        >
                            <Edit className="w-5 h-5 text-gray-400" />
                        </button>

                        {/* More menu */}
                        <div className="relative">
                            <button
                                onClick={() => setShowMenu(!showMenu)}
                                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                            >
                                <MoreVertical className="w-5 h-5 text-gray-400" />
                            </button>

                            <AnimatePresence>
                                {showMenu && (
                                    <>
                                        <div
                                            className="fixed inset-0 z-10"
                                            onClick={() => setShowMenu(false)}
                                        />
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.95, y: -10 }}
                                            animate={{ opacity: 1, scale: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            className="absolute right-0 top-10 z-20 w-48 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-gray-100 dark:border-slate-700 py-2"
                                        >
                                            {getActions().map(action => (
                                                <button
                                                    key={action}
                                                    onClick={() => {
                                                        setShowMenu(false)
                                                        onAction(action, listing)
                                                    }}
                                                    className={`w-full flex items-center gap-3 px-4 py-2 text-sm text-left hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors ${action === 'delete' ? 'text-red-500' : 'text-gray-700 dark:text-gray-300'
                                                        }`}
                                                >
                                                    {actionIcons[action]}
                                                    <span>{t[action as keyof typeof t] || action}</span>
                                                </button>
                                            ))}
                                        </motion.div>
                                    </>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* Date */}
                    <div className="text-xs text-gray-400 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(listing.created_at).toLocaleDateString(lang === 'th' ? 'th-TH' : 'en-US', { day: 'numeric', month: 'short' })}
                    </div>
                </div>
            </div>
        </motion.div>
    )
}

// ==========================================
// MOCK DATA (Demo fallback)
// ==========================================

const MOCK_LISTINGS: UniversalListing[] = [
    {
        id: '1',
        listing_code: 'JK-A72M3X',
        listing_number: 'CAR-202412-00001',
        slug: 'honda-civic-2020-jk-a72m3x',
        category_type: 'car',
        category_id: 101,
        subcategory_id: 10101,
        title: 'Honda Civic 2020 RS Turbo ออโต้ไมล์น้อย',
        description: 'รถบ้านมือเดียว ออกศูนย์ Honda สภาพดีมาก ไม่เคยชน ไม่เคยน้ำท่วม เจ้าของขายเอง ดูรถได้ทุกวัน',
        price: 789000,
        status: 'active',
        thumbnail_url: 'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=400',
        images: [],
        seller_id: '123',
        seller_info: {} as any,
        location: { province: 'กรุงเทพมหานคร' },
        stats: { views: 1234, favorites: 45, shares: 12, inquiries: 8 },
        created_at: new Date('2024-12-15'),
        updated_at: new Date('2024-12-20'),
        expires_at: new Date('2025-01-15')
    } as UniversalListing,
    {
        id: '2',
        listing_code: 'JK-B8K4PQ',
        listing_number: 'MOT-202412-00002',
        slug: 'yamaha-mt15-jk-b8k4pq',
        category_type: 'motorcycle',
        category_id: 102,
        subcategory_id: 10201,
        title: 'Yamaha MT-15 2023 สีดำ สภาพนางฟ้า',
        description: 'มอเตอร์ไซค์สภาพดีมาก',
        price: 89000,
        status: 'active',
        thumbnail_url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400',
        images: [],
        seller_id: '123',
        seller_info: {} as any,
        location: { province: 'นนทบุรี' },
        stats: { views: 567, favorites: 23, shares: 5, inquiries: 3 },
        created_at: new Date('2024-12-10'),
        updated_at: new Date('2024-12-18'),
        expires_at: new Date('2025-01-10')
    } as UniversalListing,
    {
        id: '3',
        listing_code: 'JK-C3R2TY',
        listing_number: 'ELE-202412-00003',
        slug: 'iphone-15-pro-max-jk-c3r2ty',
        category_type: 'electronics',
        category_id: 4,
        subcategory_id: 401,
        title: 'iPhone 15 Pro Max 256GB Natural Titanium',
        description: 'ใหม่แกะกล่อง ประกันศูนย์ 1 ปี',
        price: 45900,
        status: 'expired',
        thumbnail_url: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400',
        images: [],
        seller_id: '123',
        seller_info: {} as any,
        location: { province: 'กรุงเทพมหานคร' },
        stats: { views: 2345, favorites: 89, shares: 34, inquiries: 15 },
        created_at: new Date('2024-11-01'),
        updated_at: new Date('2024-11-15'),
        expires_at: new Date('2024-12-01')
    } as UniversalListing,
    {
        id: '4',
        listing_code: 'JK-D5F7GH',
        listing_number: 'ELE-202412-00004',
        slug: 'macbook-air-m2-jk-d5f7gh',
        category_type: 'electronics',
        category_id: 4,
        subcategory_id: 402,
        title: 'MacBook Air M2 2023 8/256 สีเงิน',
        description: 'ครบกล่อง ใช้งานน้อยมาก',
        price: 32500,
        status: 'sold',
        thumbnail_url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400',
        images: [],
        seller_id: '123',
        seller_info: {} as any,
        location: { province: 'กรุงเทพมหานคร' },
        stats: { views: 1890, favorites: 67, shares: 28, inquiries: 12 },
        created_at: new Date('2024-11-20'),
        updated_at: new Date('2024-12-10'),
        sold_at: new Date('2024-12-10')
    } as UniversalListing
]

// ==========================================
// MAIN PAGE COMPONENT
// ==========================================

function MyListingsContent() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const { language } = useLanguage()
    const { user } = useAuth()

    const lang = (language || 'th') as Lang
    const t = T[lang]

    const [activeStatus, setActiveStatus] = useState<ListingStatus>('all')
    const [sortOption, setSortOption] = useState<SortOption>('newest')
    const [showSortMenu, setShowSortMenu] = useState(false)
    const [listings, setListings] = useState<UniversalListing[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
    const [searchQuery, setSearchQuery] = useState('')
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

    // Get status from URL
    useEffect(() => {
        const status = searchParams.get('status') as ListingStatus
        if (status && STATUS_CONFIGS.find(s => s.id === status)) {
            setActiveStatus(status)
        }
    }, [searchParams])

    // Load listings
    useEffect(() => {
        loadListings()
    }, [user])

    const loadListings = async () => {
        setLoading(true)
        try {
            if (user) {
                const data = await getListingsBySeller(user.uid, 100)
                if (data.length > 0) {
                    setListings(data)
                } else {
                    setListings(MOCK_LISTINGS)
                }
            } else {
                setListings(MOCK_LISTINGS)
            }
        } catch (error) {
            console.error('Error loading listings:', error)
            setListings(MOCK_LISTINGS)
        } finally {
            setLoading(false)
        }
    }

    // Show toast
    const showToast = useCallback((message: string, type: 'success' | 'error') => {
        setToast({ message, type })
        setTimeout(() => setToast(null), 3000)
    }, [])

    // Calculate stats
    const stats = useMemo(() => {
        const totalViews = listings.reduce((sum, l) => sum + (l.stats?.views || 0), 0)
        const totalLikes = listings.reduce((sum, l) => sum + (l.stats?.favorites || 0), 0)
        const totalInquiries = listings.reduce((sum, l) => sum + (l.stats?.inquiries || 0), 0)
        const totalValue = listings.filter(l => l.status === 'active').reduce((sum, l) => sum + l.price, 0)
        return { totalViews, totalLikes, totalInquiries, totalValue }
    }, [listings])

    // Filter and sort listings
    const filteredListings = useMemo(() => {
        let result = [...listings]

        // Filter by status
        if (activeStatus !== 'all') {
            result = result.filter(l => l.status === activeStatus)
        }

        // Filter by search
        if (searchQuery) {
            const q = searchQuery.toLowerCase()
            result = result.filter(l =>
                l.title.toLowerCase().includes(q) ||
                l.listing_code?.toLowerCase().includes(q)
            )
        }

        // Sort
        result.sort((a, b) => {
            switch (sortOption) {
                case 'newest':
                    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
                case 'oldest':
                    return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
                case 'price_high':
                    return b.price - a.price
                case 'price_low':
                    return a.price - b.price
                case 'views':
                    return (b.stats?.views || 0) - (a.stats?.views || 0)
                case 'likes':
                    return (b.stats?.favorites || 0) - (a.stats?.favorites || 0)
                default:
                    return 0
            }
        })

        return result
    }, [listings, activeStatus, searchQuery, sortOption])

    // Count by status
    const statusCounts = useMemo(() => {
        const counts: Record<string, number> = { all: listings.length }
        listings.forEach(l => {
            counts[l.status] = (counts[l.status] || 0) + 1
        })
        return counts
    }, [listings])

    const expiredCount = statusCounts['expired'] || 0

    // Selection handlers
    const toggleSelect = (id: string) => {
        const newSelected = new Set(selectedIds)
        if (newSelected.has(id)) {
            newSelected.delete(id)
        } else {
            newSelected.add(id)
        }
        setSelectedIds(newSelected)
    }

    const selectAll = () => {
        if (selectedIds.size === filteredListings.length) {
            setSelectedIds(new Set())
        } else {
            setSelectedIds(new Set(filteredListings.map(l => l.id)))
        }
    }

    // Single action handlers
    const handleAction = async (action: string, listing: UniversalListing) => {
        switch (action) {
            case 'view':
                window.open(`/listing/${listing.slug}`, '_blank')
                break

            case 'edit':
                router.push(`/sell/edit/${listing.id}`)
                break

            case 'boost':
                router.push(`/boost/${listing.id}`)
                break

            case 'copy':
                await navigator.clipboard.writeText(`https://jaikod.com/listing/${listing.slug}`)
                showToast(t.linkCopied, 'success')
                break

            case 'delete':
                if (confirm(t.confirmDelete)) {
                    try {
                        if (user) {
                            await deleteListing(listing.id, user.uid)
                        }
                        setListings(prev => prev.filter(l => l.id !== listing.id))
                        showToast(t.deleteSuccess, 'success')
                    } catch (error) {
                        console.error('Delete error:', error)
                        showToast(t.errorOccurred, 'error')
                    }
                }
                break

            case 'markSold':
                if (confirm(t.confirmMarkSold)) {
                    try {
                        if (user) {
                            await updateListingStatus(listing.id, 'sold', user.uid)
                        }
                        setListings(prev => prev.map(l =>
                            l.id === listing.id ? { ...l, status: 'sold' } : l
                        ))
                        showToast(t.updateSuccess, 'success')
                    } catch (error) {
                        console.error('Update error:', error)
                        showToast(t.errorOccurred, 'error')
                    }
                }
                break

            case 'close':
                if (confirm(t.confirmClose)) {
                    try {
                        if (user) {
                            await updateListingStatus(listing.id, 'closed', user.uid)
                        }
                        setListings(prev => prev.map(l =>
                            l.id === listing.id ? { ...l, status: 'closed' } : l
                        ))
                        showToast(t.updateSuccess, 'success')
                    } catch (error) {
                        console.error('Update error:', error)
                        showToast(t.errorOccurred, 'error')
                    }
                }
                break

            case 'renew':
            case 'relist':
            case 'reopen':
                try {
                    if (user) {
                        await updateListingStatus(listing.id, 'active', user.uid)
                    }
                    setListings(prev => prev.map(l =>
                        l.id === listing.id ? {
                            ...l,
                            status: 'active',
                            expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
                        } : l
                    ))
                    showToast(t.updateSuccess, 'success')
                } catch (error) {
                    console.error('Update error:', error)
                    showToast(t.errorOccurred, 'error')
                }
                break

            default:
                console.log(action, listing.id)
        }
    }

    // Bulk action handlers
    const handleBulkAction = async (action: string) => {
        const ids = Array.from(selectedIds)

        if (action === 'delete') {
            if (!confirm(t.confirmBulkDelete.replace('{count}', ids.length.toString()))) return

            try {
                for (const id of ids) {
                    if (user) {
                        await deleteListing(id, user.uid)
                    }
                }
                setListings(prev => prev.filter(l => !ids.includes(l.id)))
                setSelectedIds(new Set())
                showToast(t.deleteSuccess, 'success')
            } catch (error) {
                console.error('Bulk delete error:', error)
                showToast(t.errorOccurred, 'error')
            }
        } else if (action === 'close') {
            try {
                for (const id of ids) {
                    if (user) {
                        await updateListingStatus(id, 'closed', user.uid)
                    }
                }
                setListings(prev => prev.map(l =>
                    ids.includes(l.id) ? { ...l, status: 'closed' } : l
                ))
                setSelectedIds(new Set())
                showToast(t.updateSuccess, 'success')
            } catch (error) {
                console.error('Bulk close error:', error)
                showToast(t.errorOccurred, 'error')
            }
        } else if (action === 'renew') {
            try {
                for (const id of ids) {
                    if (user) {
                        await updateListingStatus(id, 'active', user.uid)
                    }
                }
                setListings(prev => prev.map(l =>
                    ids.includes(l.id) ? {
                        ...l,
                        status: 'active',
                        expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
                    } : l
                ))
                setSelectedIds(new Set())
                showToast(t.updateSuccess, 'success')
            } catch (error) {
                console.error('Bulk renew error:', error)
                showToast(t.errorOccurred, 'error')
            }
        }
    }

    const getMemberType = (): 'general' | 'store_general' | 'store_official' => {
        // TODO: Get seller type from user profile
        return 'general'
    }

    const formatNumber = (num: number) => new Intl.NumberFormat(lang === 'th' ? 'th-TH' : 'en-US').format(num)

    return (
        <ProfileLayoutV3
            title={t.pageTitle}
            memberType={getMemberType()}
        >
            <div className="space-y-6">
                {/* Toast Notification */}
                <AnimatePresence>
                    {toast && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className={`fixed top-20 right-4 z-50 px-4 py-3 rounded-xl shadow-lg flex items-center gap-2 ${toast.type === 'success'
                                ? 'bg-green-500 text-white'
                                : 'bg-red-500 text-white'
                                }`}
                        >
                            {toast.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                            {toast.message}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                            {t.pageTitle}
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400 mt-1">
                            {t.totalListings.replace('{count}', listings.length.toString())}
                        </p>
                    </div>

                    <Link
                        href="/sell"
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium rounded-xl hover:opacity-90 transition-opacity shadow-lg shadow-purple-500/30"
                    >
                        <Plus className="w-5 h-5" />
                        {t.newListing}
                    </Link>
                </div>

                {/* Stats Dashboard */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <StatsCard
                        icon={<Eye className="w-5 h-5 text-blue-600" />}
                        label={t.totalViews}
                        value={formatNumber(stats.totalViews)}
                        trend={12}
                        color="bg-blue-100 dark:bg-blue-900/30"
                    />
                    <StatsCard
                        icon={<Heart className="w-5 h-5 text-pink-600" />}
                        label={t.totalLikes}
                        value={formatNumber(stats.totalLikes)}
                        trend={8}
                        color="bg-pink-100 dark:bg-pink-900/30"
                    />
                    <StatsCard
                        icon={<MessageCircle className="w-5 h-5 text-green-600" />}
                        label={t.totalInquiries}
                        value={formatNumber(stats.totalInquiries)}
                        trend={-3}
                        color="bg-green-100 dark:bg-green-900/30"
                    />
                    <StatsCard
                        icon={<DollarSign className="w-5 h-5 text-purple-600" />}
                        label={t.totalValue}
                        value={`฿${formatNumber(stats.totalValue)}`}
                        color="bg-purple-100 dark:bg-purple-900/30"
                    />
                </div>

                {/* Expired Warning */}
                {expiredCount > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-4 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-xl flex items-center justify-between"
                    >
                        <div className="flex items-center gap-3">
                            <AlertTriangle className="w-5 h-5 text-orange-500" />
                            <div>
                                <p className="font-medium text-orange-700 dark:text-orange-400">
                                    {t.expiredWarning.replace('{count}', expiredCount.toString())}
                                </p>
                                <p className="text-sm text-orange-600 dark:text-orange-500">
                                    {t.expiredHint}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={() => setActiveStatus('expired')}
                            className="px-4 py-2 bg-orange-500 text-white font-medium rounded-lg hover:bg-orange-600 transition-colors"
                        >
                            {t.viewExpired}
                        </button>
                    </motion.div>
                )}

                {/* Status Tabs */}
                <div className="flex gap-2 overflow-x-auto pb-2">
                    {STATUS_CONFIGS.filter(s => s.id === 'all' || statusCounts[s.id]).map(status => (
                        <button
                            key={status.id}
                            onClick={() => {
                                setActiveStatus(status.id)
                                router.push(`/profile/listings?status=${status.id}`, { scroll: false })
                            }}
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${activeStatus === status.id
                                ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/30'
                                : `${status.bgColor} ${status.color} hover:opacity-80`
                                }`}
                        >
                            {status.icon}
                            {t[status.labelKey as keyof typeof t] || status.labelKey}
                            <span className={`px-1.5 py-0.5 rounded-full text-xs font-bold ${activeStatus === status.id
                                ? 'bg-white/20 text-white'
                                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                                }`}>
                                {statusCounts[status.id] || 0}
                            </span>
                        </button>
                    ))}
                </div>

                {/* Search & Sort */}
                <div className="flex gap-3">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder={t.searchPlaceholder}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-slate-800 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                    </div>

                    {/* Sort Dropdown */}
                    <div className="relative">
                        <button
                            onClick={() => setShowSortMenu(!showSortMenu)}
                            className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700"
                        >
                            <ArrowUpDown className="w-4 h-4 text-gray-500" />
                            <span className="hidden md:inline text-sm">{t.sortBy}</span>
                            <ChevronDown className="w-4 h-4 text-gray-500" />
                        </button>

                        <AnimatePresence>
                            {showSortMenu && (
                                <>
                                    <div className="fixed inset-0 z-10" onClick={() => setShowSortMenu(false)} />
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="absolute right-0 top-12 z-20 w-48 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-gray-100 dark:border-slate-700 py-2"
                                    >
                                        {SORT_OPTIONS.map(option => (
                                            <button
                                                key={option.id}
                                                onClick={() => {
                                                    setSortOption(option.id)
                                                    setShowSortMenu(false)
                                                }}
                                                className={`w-full px-4 py-2 text-sm text-left hover:bg-gray-50 dark:hover:bg-slate-700 ${sortOption === option.id
                                                    ? 'text-purple-500 font-medium'
                                                    : 'text-gray-700 dark:text-gray-300'
                                                    }`}
                                            >
                                                {t[option.labelKey as keyof typeof t] || option.labelKey}
                                            </button>
                                        ))}
                                    </motion.div>
                                </>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Bulk Actions */}
                <AnimatePresence>
                    {selectedIds.size > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="flex items-center gap-4 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl border border-purple-200 dark:border-purple-800"
                        >
                            <span className="text-purple-700 dark:text-purple-400 font-medium">
                                {t.selected.replace('{count}', selectedIds.size.toString())}
                            </span>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleBulkAction('renew')}
                                    className="px-3 py-1.5 bg-green-500 text-white text-sm font-medium rounded-lg hover:bg-green-600 flex items-center gap-1"
                                >
                                    <RefreshCw className="w-4 h-4" />
                                    {t.bulkRenew}
                                </button>
                                <button
                                    onClick={() => handleBulkAction('close')}
                                    className="px-3 py-1.5 bg-gray-500 text-white text-sm font-medium rounded-lg hover:bg-gray-600 flex items-center gap-1"
                                >
                                    <Lock className="w-4 h-4" />
                                    {t.bulkClose}
                                </button>
                                <button
                                    onClick={() => handleBulkAction('delete')}
                                    className="px-3 py-1.5 bg-red-500 text-white text-sm font-medium rounded-lg hover:bg-red-600 flex items-center gap-1"
                                >
                                    <Trash2 className="w-4 h-4" />
                                    {t.bulkDelete}
                                </button>
                            </div>
                            <button
                                onClick={() => setSelectedIds(new Set())}
                                className="ml-auto text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
                            >
                                <X className="w-4 h-4" />
                                {t.clearSelection}
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Listings */}
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : filteredListings.length === 0 ? (
                    <div className="text-center py-20 bg-white dark:bg-slate-800 rounded-2xl">
                        <Package className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
                        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            {activeStatus === 'all' ? t.noListings : t.noListingsInCategory}
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400 mb-6">
                            {t.startSelling}
                        </p>
                        <Link
                            href="/sell"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-purple-500 text-white font-medium rounded-xl hover:bg-purple-600 transition-colors"
                        >
                            <Plus className="w-5 h-5" />
                            {t.createFirst}
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {/* Select All */}
                        <div className="flex items-center gap-3 px-2">
                            <input
                                type="checkbox"
                                checked={selectedIds.size === filteredListings.length && filteredListings.length > 0}
                                onChange={selectAll}
                                className="w-5 h-5 rounded border-gray-300 text-purple-500 focus:ring-purple-500"
                            />
                            <span className="text-sm text-gray-500">
                                {t.selectAll}
                            </span>
                        </div>

                        {/* Listing Cards */}
                        <AnimatePresence mode="popLayout">
                            {filteredListings.map(listing => (
                                <ListingCard
                                    key={listing.id}
                                    listing={listing}
                                    t={t}
                                    lang={lang}
                                    onAction={handleAction}
                                    selected={selectedIds.has(listing.id)}
                                    onSelect={toggleSelect}
                                />
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </div>
        </ProfileLayoutV3>
    )
}

// ==========================================
// EXPORT WITH SUSPENSE
// ==========================================

export default function MyListingsPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-900">
                <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
            </div>
        }>
            <MyListingsContent />
        </Suspense>
    )
}
