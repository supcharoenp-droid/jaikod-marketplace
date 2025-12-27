'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Edit, Trash2, Zap, RefreshCw, CheckCircle2, Lock,
    MoreVertical, ExternalLink, BarChart3, Copy, Eye, Settings
} from 'lucide-react'
import { UniversalListing } from '@/lib/listings/types'

// ==========================================
// TYPES
// ==========================================

interface OwnerActionsProps {
    listing: UniversalListing
    isOwner: boolean
    language?: 'th' | 'en'
    onAction?: (action: string) => void
}

interface ActionItem {
    id: string
    label_th: string
    label_en: string
    icon: React.ReactNode
    color: string
    primary?: boolean
    danger?: boolean
    show?: boolean
}

// ==========================================
// OWNER ACTIONS BAR COMPONENT
// ==========================================

export function OwnerActionsBar({ listing, isOwner, language = 'th', onAction }: OwnerActionsProps) {
    const router = useRouter()

    if (!isOwner) return null

    const actions: ActionItem[] = [
        // Primary actions
        {
            id: 'edit',
            label_th: 'แก้ไข',
            label_en: 'Edit',
            icon: <Edit className="w-4 h-4" />,
            color: 'bg-blue-500 hover:bg-blue-600',
            primary: true,
            show: true
        },
        {
            id: 'boost',
            label_th: 'โปรโมท',
            label_en: 'Boost',
            icon: <Zap className="w-4 h-4" />,
            color: 'bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600',
            primary: true,
            show: listing.status === 'active'
        },
        {
            id: 'mark_sold',
            label_th: 'ขายแล้ว',
            label_en: 'Mark Sold',
            icon: <CheckCircle2 className="w-4 h-4" />,
            color: 'bg-emerald-500 hover:bg-emerald-600',
            primary: true,
            show: listing.status === 'active'
        },
        {
            id: 'renew',
            label_th: 'ต่ออายุ',
            label_en: 'Renew',
            icon: <RefreshCw className="w-4 h-4" />,
            color: 'bg-green-500 hover:bg-green-600',
            primary: true,
            show: listing.status === 'expired'
        }
    ]

    const handleAction = (actionId: string) => {
        switch (actionId) {
            case 'edit':
                router.push(`/sell/edit/${listing.id}`)
                break
            case 'boost':
                router.push(`/boost/${listing.id}`)
                break
            case 'mark_sold':
                onAction?.('mark_sold')
                break
            case 'renew':
                onAction?.('renew')
                break
            default:
                onAction?.(actionId)
        }
    }

    const visibleActions = actions.filter(a => a.show)

    return (
        <div className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 border border-purple-500/30 rounded-xl p-4 mb-4">
            <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                    <Settings className="w-5 h-5 text-purple-400" />
                    <span className="font-medium text-white">
                        {language === 'th' ? 'จัดการประกาศนี้' : 'Manage Listing'}
                    </span>
                </div>

                <div className="flex items-center gap-2">
                    {visibleActions.map(action => (
                        <button
                            key={action.id}
                            onClick={() => handleAction(action.id)}
                            className={`flex items-center gap-2 px-4 py-2 ${action.color} text-white font-medium rounded-lg transition-all`}
                        >
                            {action.icon}
                            <span className="hidden sm:inline">
                                {language === 'th' ? action.label_th : action.label_en}
                            </span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    )
}

// ==========================================
// OWNER QUICK MENU (Compact Version)
// ==========================================

export function OwnerQuickMenu({ listing, isOwner, language = 'th', onAction }: OwnerActionsProps) {
    const [open, setOpen] = useState(false)
    const router = useRouter()

    if (!isOwner) return null

    const allActions: ActionItem[] = [
        { id: 'edit', label_th: 'แก้ไข', label_en: 'Edit', icon: <Edit className="w-4 h-4" />, color: 'text-blue-500' },
        { id: 'boost', label_th: 'โปรโมท', label_en: 'Boost', icon: <Zap className="w-4 h-4" />, color: 'text-yellow-500', show: listing.status === 'active' },
        { id: 'stats', label_th: 'สถิติ', label_en: 'Stats', icon: <BarChart3 className="w-4 h-4" />, color: 'text-purple-500' },
        { id: 'copy_link', label_th: 'คัดลอกลิงก์', label_en: 'Copy Link', icon: <Copy className="w-4 h-4" />, color: 'text-gray-400' },
        { id: 'view', label_th: 'ดูหน้าประกาศ', label_en: 'View Listing', icon: <ExternalLink className="w-4 h-4" />, color: 'text-gray-400' },
        { id: 'mark_sold', label_th: 'ขายแล้ว', label_en: 'Mark Sold', icon: <CheckCircle2 className="w-4 h-4" />, color: 'text-emerald-500', show: listing.status === 'active' },
        { id: 'close', label_th: 'ปิดการขาย', label_en: 'Close', icon: <Lock className="w-4 h-4" />, color: 'text-purple-500', show: listing.status === 'active' },
        { id: 'renew', label_th: 'ต่ออายุ', label_en: 'Renew', icon: <RefreshCw className="w-4 h-4" />, color: 'text-green-500', show: listing.status === 'expired' },
        { id: 'delete', label_th: 'ลบประกาศ', label_en: 'Delete', icon: <Trash2 className="w-4 h-4" />, color: 'text-red-500', danger: true }
    ]

    const handleAction = async (actionId: string) => {
        setOpen(false)

        switch (actionId) {
            case 'edit':
                router.push(`/sell/edit/${listing.id}`)
                break
            case 'boost':
                router.push(`/boost/${listing.id}`)
                break
            case 'stats':
                router.push(`/profile/listings/${listing.id}/stats`)
                break
            case 'copy_link':
                await navigator.clipboard.writeText(`https://jaikod.com/listing/${listing.slug}`)
                // Toast notification
                break
            case 'view':
                router.push(`/listing/${listing.slug}`)
                break
            case 'delete':
                if (confirm(language === 'th' ? 'ต้องการลบประกาศนี้?' : 'Delete this listing?')) {
                    onAction?.('delete')
                }
                break
            default:
                onAction?.(actionId)
        }
    }

    const visibleActions = allActions.filter(a => a.show !== false)

    return (
        <div className="relative">
            <button
                onClick={() => setOpen(!open)}
                className="p-2 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/30 rounded-lg transition-colors"
            >
                <MoreVertical className="w-5 h-5 text-purple-400" />
            </button>

            <AnimatePresence>
                {open && (
                    <>
                        <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: -10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="absolute right-0 top-12 z-50 w-56 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl overflow-hidden"
                        >
                            <div className="p-2">
                                <div className="px-3 py-2 text-xs font-medium text-gray-500 uppercase">
                                    {language === 'th' ? 'จัดการประกาศ' : 'Manage Listing'}
                                </div>

                                {visibleActions.map((action, idx) => (
                                    <React.Fragment key={action.id}>
                                        {action.danger && idx > 0 && (
                                            <div className="border-t border-slate-700 my-1" />
                                        )}
                                        <button
                                            onClick={() => handleAction(action.id)}
                                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${action.danger
                                                    ? 'hover:bg-red-900/30 text-red-400'
                                                    : 'hover:bg-slate-700 text-gray-300'
                                                }`}
                                        >
                                            <span className={action.color}>{action.icon}</span>
                                            <span>{language === 'th' ? action.label_th : action.label_en}</span>
                                        </button>
                                    </React.Fragment>
                                ))}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    )
}

// ==========================================
// OWNER BADGE (For header)
// ==========================================

export function OwnerBadge({ isOwner, language = 'th' }: { isOwner: boolean; language?: 'th' | 'en' }) {
    if (!isOwner) return null

    return (
        <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-500/20 border border-purple-500/30 text-purple-300 text-xs font-medium rounded-full">
            <Eye className="w-3 h-3" />
            {language === 'th' ? 'ประกาศของคุณ' : 'Your Listing'}
        </span>
    )
}

// ==========================================
// EXPORTS
// ==========================================

export default OwnerActionsBar
