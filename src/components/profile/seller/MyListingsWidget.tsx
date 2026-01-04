'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
    Package, Clock, CheckCircle, AlertTriangle,
    XCircle, Lock, FileEdit, Trash2, RefreshCw,
    ChevronRight, Plus, Eye, Heart, MoreVertical,
    Zap, TrendingUp
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    ListingStatus, LISTING_STATUS_CONFIG,
    getAutoDeleteConfig, SellerType
} from '@/lib/profile/types'
import {
    SellerListingsService,
    ListingSummary,
    ListingCounts
} from '@/lib/profile/seller-listings'
import toastService from '@/services/toastService'

// ==========================================
// TYPES
// ==========================================

interface MyListingsWidgetProps {
    sellerId: string
    sellerType: SellerType
    language?: 'th' | 'en'
    compact?: boolean
}

// ==========================================
// STATUS TAB COMPONENT
// ==========================================

interface StatusTabProps {
    status: ListingStatus | 'all'
    count: number
    isActive: boolean
    onClick: () => void
    language: 'th' | 'en'
}

function StatusTab({ status, count, isActive, onClick, language }: StatusTabProps) {
    const config = status === 'all' ? null : LISTING_STATUS_CONFIG[status]
    const icon = config?.icon || '📦'
    const label = status === 'all'
        ? (language === 'th' ? 'ทั้งหมด' : 'All')
        : (language === 'th' ? config?.label_th : config?.label_en)

    return (
        <button
            onClick={onClick}
            className={`
                flex flex-col items-center gap-1 px-4 py-3 rounded-xl transition-all
                ${isActive
                    ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/30'
                    : 'bg-slate-100 dark:bg-slate-800 text-gray-600 dark:text-gray-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                }
            `}
        >
            <span className="text-xl">{icon}</span>
            <span className="text-xs font-medium">{label}</span>
            {count > 0 && (
                <span className={`
                    px-2 py-0.5 rounded-full text-xs font-bold
                    ${isActive ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-slate-700 text-gray-700 dark:text-gray-300'}
                `}>
                    {count}
                </span>
            )}
        </button>
    )
}

// ==========================================
// LISTING CARD COMPONENT
// ==========================================

interface ListingCardProps {
    listing: ListingSummary
    sellerType: SellerType
    language: 'th' | 'en'
    onAction: (action: string, listingId: string) => void
}

function ListingCard({ listing, sellerType, language, onAction }: ListingCardProps) {
    const [showMenu, setShowMenu] = useState(false)
    const config = LISTING_STATUS_CONFIG[listing.status]
    const deleteConfig = getAutoDeleteConfig(sellerType)

    const formatPrice = (price: number) => new Intl.NumberFormat('th-TH').format(price)

    // Calculate days until delete for expired/closed
    const getDaysWarning = () => {
        if (listing.days_until_delete !== undefined && listing.days_until_delete <= 7) {
            return (
                <span className="text-xs text-red-500 font-medium">
                    ⚠️ ถูกลบใน {listing.days_until_delete} วัน
                </span>
            )
        }
        return null
    }

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white dark:bg-slate-800 rounded-xl overflow-hidden shadow-sm border border-gray-100 dark:border-slate-700 hover:shadow-md transition-shadow"
        >
            <div className="flex gap-4 p-4">
                {/* Thumbnail */}
                <Link href={`/listing/${listing.slug}`} className="relative flex-shrink-0">
                    <div className="w-24 h-24 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-700">
                        {listing.thumbnail_url ? (
                            <Image
                                src={listing.thumbnail_url}
                                alt={listing.title}
                                width={96}
                                height={96}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                                📷
                            </div>
                        )}
                    </div>
                    {/* Status Badge */}
                    <span className={`absolute -top-1 -right-1 px-2 py-0.5 rounded-full text-xs font-bold ${config.bg_color} ${config.color}`}>
                        {config.icon}
                    </span>
                </Link>

                {/* Info */}
                <div className="flex-1 min-w-0">
                    <Link href={`/listing/${listing.slug}`}>
                        <h4 className="font-semibold text-gray-900 dark:text-white truncate hover:text-purple-500 transition-colors">
                            {listing.title}
                        </h4>
                    </Link>

                    <p className="text-lg font-bold text-purple-500 mt-1">
                        ฿{formatPrice(listing.price)}
                    </p>

                    {/* Stats */}
                    <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                            <Eye className="w-3 h-3" />
                            {listing.views}
                        </span>
                        <span className="flex items-center gap-1">
                            <Heart className="w-3 h-3" />
                            {listing.favorites}
                        </span>
                    </div>

                    {/* Status info */}
                    <div className="mt-2">
                        <span className={`text-xs ${config.color}`}>
                            {language === 'th' ? config.label_th : config.label_en}
                        </span>
                        {getDaysWarning()}
                    </div>
                </div>

                {/* Actions */}
                <div className="relative flex-shrink-0">
                    <button
                        onClick={() => setShowMenu(!showMenu)}
                        className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                    >
                        <MoreVertical className="w-5 h-5 text-gray-400" />
                    </button>

                    {/* Dropdown Menu */}
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
                                    className="absolute right-0 top-10 z-20 w-44 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-gray-100 dark:border-slate-700 py-2"
                                >
                                    {config.actions.map(action => (
                                        <button
                                            key={action}
                                            onClick={() => {
                                                setShowMenu(false)
                                                onAction(action, listing.id)
                                            }}
                                            className="w-full flex items-center gap-2 px-4 py-2 text-sm text-left hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                                        >
                                            {getActionIcon(action)}
                                            <span>{getActionLabel(action, language)}</span>
                                        </button>
                                    ))}
                                </motion.div>
                            </>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </motion.div>
    )
}

function getActionIcon(action: string): React.ReactNode {
    const icons: Record<string, React.ReactNode> = {
        edit: <FileEdit className="w-4 h-4 text-blue-500" />,
        delete: <Trash2 className="w-4 h-4 text-red-500" />,
        renew: <RefreshCw className="w-4 h-4 text-green-500" />,
        boost: <Zap className="w-4 h-4 text-yellow-500" />,
        mark_sold: <CheckCircle className="w-4 h-4 text-blue-500" />,
        close: <Lock className="w-4 h-4 text-purple-500" />,
        reopen: <RefreshCw className="w-4 h-4 text-green-500" />,
        submit: <TrendingUp className="w-4 h-4 text-blue-500" />,
        cancel: <XCircle className="w-4 h-4 text-orange-500" />,
        appeal: <AlertTriangle className="w-4 h-4 text-orange-500" />,
        edit_resubmit: <FileEdit className="w-4 h-4 text-blue-500" />,
        restore: <RefreshCw className="w-4 h-4 text-green-500" />,
        relist: <Plus className="w-4 h-4 text-purple-500" />
    }
    return icons[action] || <MoreVertical className="w-4 h-4" />
}

function getActionLabel(action: string, language: 'th' | 'en'): string {
    const labels: Record<string, { th: string; en: string }> = {
        edit: { th: 'แก้ไข', en: 'Edit' },
        delete: { th: 'ลบ', en: 'Delete' },
        renew: { th: 'ต่ออายุ', en: 'Renew' },
        boost: { th: 'Boost', en: 'Boost' },
        mark_sold: { th: 'ขายแล้ว', en: 'Mark Sold' },
        close: { th: 'ปิดการขาย', en: 'Close' },
        reopen: { th: 'เปิดขายใหม่', en: 'Reopen' },
        submit: { th: 'ส่งตรวจสอบ', en: 'Submit' },
        cancel: { th: 'ยกเลิก', en: 'Cancel' },
        appeal: { th: 'อุทธรณ์', en: 'Appeal' },
        edit_resubmit: { th: 'แก้ไขและส่งใหม่', en: 'Edit & Resubmit' },
        restore: { th: 'กู้คืน', en: 'Restore' },
        relist: { th: 'ลงขายใหม่', en: 'Relist' }
    }
    return labels[action]?.[language] || action
}

// ==========================================
// MAIN WIDGET COMPONENT
// ==========================================

export default function MyListingsWidget({
    sellerId,
    sellerType,
    language = 'th',
    compact = false
}: MyListingsWidgetProps) {
    const [activeStatus, setActiveStatus] = useState<ListingStatus | 'all'>('all')
    const [listings, setListings] = useState<ListingSummary[]>([])
    const [counts, setCounts] = useState<ListingCounts | null>(null)
    const [loading, setLoading] = useState(true)
    const [deletedListings, setDeletedListings] = useState<Map<string, ListingSummary>>(new Map())

    useEffect(() => {
        loadListings()
    }, [sellerId, activeStatus])

    const loadListings = async () => {
        setLoading(true)
        try {
            const result = await SellerListingsService.getListings(
                sellerId,
                activeStatus === 'all' ? undefined : activeStatus,
                compact ? 5 : 20
            )
            setListings(result.listings)
            setCounts(result.counts)
        } catch (error) {
            console.error('Error loading listings:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleAction = async (action: string, listingId: string) => {
        try {
            switch (action) {
                case 'renew':
                    const renewToast = toastService.loading(language === 'th' ? 'กำลังต่ออายุ...' : 'Renewing...')
                    await SellerListingsService.renew(listingId)
                    toastService.dismiss(renewToast)
                    toastService.success(language === 'th' ? 'ต่ออายุประกาศสำเร็จ' : 'Renewed successfully', { icon: '🔄' })
                    await loadListings()
                    break

                case 'close':
                    if (!confirm(language === 'th' ? 'ต้องการปิดการขายหรือไม่?' : 'Close this listing?')) {
                        return
                    }
                    const closeToast = toastService.loading(language === 'th' ? 'กำลังปิดการขาย...' : 'Closing...')
                    await SellerListingsService.close(listingId)
                    toastService.dismiss(closeToast)
                    toastService.success(language === 'th' ? 'ปิดการขายสำเร็จ' : 'Closed successfully', { icon: '🔒' })
                    await loadListings()
                    break

                case 'reopen':
                    const reopenToast = toastService.loading(language === 'th' ? 'กำลังเปิดขายใหม่...' : 'Reopening...')
                    await SellerListingsService.reopen(listingId)
                    toastService.dismiss(reopenToast)
                    toastService.success(language === 'th' ? 'เปิดขายใหม่สำเร็จ' : 'Reopened successfully', { icon: '✅' })
                    await loadListings()
                    break

                case 'mark_sold':
                    if (!confirm(language === 'th' ? 'ต้องการทำเครื่องหมาย "ขายแล้ว" หรือไม่?' : 'Mark as sold?')) {
                        return
                    }
                    const soldToast = toastService.loading(language === 'th' ? 'กำลังบันทึก...' : 'Updating...')
                    await SellerListingsService.markSold(listingId)
                    toastService.dismiss(soldToast)
                    toastService.success(language === 'th' ? 'ทำเครื่องหมาย "ขายแล้ว" สำเร็จ' : 'Marked as sold', { icon: '💰' })
                    await loadListings()
                    break

                case 'delete':
                    handleDelete(listingId)
                    break

                case 'edit':
                    window.location.href = `/sell/edit/${listingId}`
                    return

                case 'boost':
                    window.location.href = `/boost/${listingId}`
                    return

                default:
                    console.warn('Unknown action:', action)
                    return
            }
        } catch (error: any) {
            console.error('❌ Error performing action:', error)
            toastService.error(
                language === 'th'
                    ? `เกิดข้อผิดพลาด: ${error.message || 'โปรดลองใหม่อีกครั้ง'}`
                    : `Error: ${error.message || 'Please try again'}`,
                {
                    duration: 5000,
                    action: {
                        label: language === 'th' ? 'ลองอีกครั้ง' : 'Retry',
                        onClick: () => handleAction(action, listingId)
                    }
                }
            )
        }
    }

    // Handle Delete with Undo
    const handleDelete = (listingId: string) => {
        // Find the listing
        const listing = listings.find(l => l.id === listingId)
        if (!listing) return

        // Store for potential undo
        setDeletedListings(prev => new Map(prev).set(listingId, listing))

        // Optimistic UI update - remove from list immediately
        setListings(prev => prev.filter(l => l.id !== listingId))

        // Show toast with undo option
        toastService.successWithUndo(
            language === 'th' ? 'ลบประกาศสำเร็จ' : 'Listing deleted',
            () => handleUndoDelete(listingId),
            {
                undoLabel: language === 'th' ? 'ย้อนกลับ' : 'Undo',
                duration: 5000
            }
        )

        // Actually delete after 5 seconds (if not undone)
        setTimeout(async () => {
            if (deletedListings.has(listingId)) {
                try {
                    await SellerListingsService.delete(listingId)
                    // Remove from deleted listings map
                    setDeletedListings(prev => {
                        const newMap = new Map(prev)
                        newMap.delete(listingId)
                        return newMap
                    })
                    // Refresh counts
                    await loadListings()
                } catch (error: any) {
                    console.error('Error deleting:', error)
                    // Restore if delete failed
                    handleUndoDelete(listingId)
                    toastService.error(
                        language === 'th' ? 'ลบไม่สำเร็จ กรุณาลองใหม่' : 'Delete failed. Please try again'
                    )
                }
            }
        }, 5000)
    }

    // Handle Undo Delete
    const handleUndoDelete = (listingId: string) => {
        const listing = deletedListings.get(listingId)
        if (listing) {
            // Restore to list
            setListings(prev => [...prev, listing].sort((a, b) =>
                new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
            ))
            // Remove from deleted map
            setDeletedListings(prev => {
                const newMap = new Map(prev)
                newMap.delete(listingId)
                return newMap
            })
        }
    }

    const statuses: (ListingStatus | 'all')[] = compact
        ? ['active', 'pending', 'expired']
        : ['all', 'active', 'pending', 'expired', 'sold', 'closed']

    return (
        <div className="bg-white dark:bg-slate-800/50 rounded-2xl p-6 border border-gray-100 dark:border-slate-700">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <Package className="w-5 h-5 text-purple-500" />
                    {language === 'th' ? 'ประกาศของฉัน' : 'My Listings'}
                    {counts && (
                        <span className="text-sm font-normal text-gray-500">
                            ({counts.total} รายการ)
                        </span>
                    )}
                </h3>
                <div className="flex items-center gap-2">
                    <Link
                        href="/sell"
                        className="flex items-center gap-1 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl text-sm font-medium hover:opacity-90 transition-opacity"
                    >
                        <Plus className="w-4 h-4" />
                        {language === 'th' ? 'ลงประกาศ' : 'New Listing'}
                    </Link>
                    {!compact && (
                        <Link
                            href="/seller/listings"
                            className="text-sm text-purple-500 hover:underline flex items-center gap-1"
                        >
                            {language === 'th' ? 'จัดการทั้งหมด' : 'Manage All'}
                            <ChevronRight className="w-4 h-4" />
                        </Link>
                    )}
                </div>
            </div>

            {/* Status Tabs */}
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                {statuses.map(status => (
                    <StatusTab
                        key={status}
                        status={status}
                        count={status === 'all' ? (counts?.total || 0) : (counts?.[status as keyof ListingCounts] as number || 0)}
                        isActive={activeStatus === status}
                        onClick={() => setActiveStatus(status)}
                        language={language}
                    />
                ))}
            </div>

            {/* Listings */}
            {loading ? (
                <div className="flex items-center justify-center py-12">
                    <div className="w-8 h-8 border-3 border-purple-500 border-t-transparent rounded-full animate-spin" />
                </div>
            ) : listings.length === 0 ? (
                <div className="text-center py-12">
                    <Package className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600 mb-3" />
                    <p className="text-gray-500 dark:text-gray-400">
                        {language === 'th' ? 'ยังไม่มีประกาศ' : 'No listings yet'}
                    </p>
                    <Link
                        href="/sell"
                        className="inline-flex items-center gap-2 mt-4 px-6 py-3 bg-purple-500 text-white rounded-xl font-medium hover:bg-purple-600 transition-colors"
                    >
                        <Plus className="w-4 h-4" />
                        {language === 'th' ? 'เริ่มลงขายวันนี้' : 'Start Selling Today'}
                    </Link>
                </div>
            ) : (
                <div className="space-y-3">
                    <AnimatePresence mode="popLayout">
                        {listings.map(listing => (
                            <ListingCard
                                key={listing.id}
                                listing={listing}
                                sellerType={sellerType}
                                language={language}
                                onAction={handleAction}
                            />
                        ))}
                    </AnimatePresence>
                </div>
            )}

            {/* View More */}
            {compact && listings.length > 0 && (
                <Link
                    href="/seller/listings"
                    className="flex items-center justify-center gap-2 mt-4 py-3 border border-gray-200 dark:border-slate-700 rounded-xl text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
                >
                    {language === 'th' ? 'ดูประกาศทั้งหมด' : 'View All Listings'}
                    <ChevronRight className="w-4 h-4" />
                </Link>
            )}
        </div>
    )
}
