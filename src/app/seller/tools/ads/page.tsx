'use client'

import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import Header from '@/components/layout/Header'
import {
    Megaphone, Plus, TrendingUp, Users, MousePointer, DollarSign, ArrowLeft,
    Search, MoreVertical, Play, Pause, Copy, Trash2,
    ChevronDown, ChevronUp, Eye, AlertCircle, CheckCircle, RefreshCw, X
} from 'lucide-react'
import Button from '@/components/ui/Button'
import { useLanguage } from '@/contexts/LanguageContext'
import sellerTranslations from '@/i18n/seller-centre.json'
import type { Campaign, CampaignStatus, CampaignTableSort, SortField } from '@/types/shop-ads'

// Mock data
const MOCK_CAMPAIGNS: Campaign[] = [
    {
        id: '1',
        name: 'iPhone 15 Pro Promo',
        status: 'Active',
        type: 'Product',
        budget: { type: 'daily', amount: 500, spent: 342 },
        targeting: { categories: ['electronics'] },
        performance: { impressions: 5230, clicks: 342, ctr: 6.54, conversions: 24, revenue: 48000, roi: 4.5 },
        createdAt: new Date('2025-12-20'),
        updatedAt: new Date('2025-12-27'),
        createdBy: 'seller1'
    },
    {
        id: '2',
        name: 'Sneakers Clearance',
        status: 'Paused',
        type: 'Category',
        budget: { type: 'daily', amount: 300, spent: 87 },
        targeting: { categories: ['fashion'] },
        performance: { impressions: 2100, clicks: 120, ctr: 5.71, conversions: 8, revenue: 12000, roi: 2.1 },
        createdAt: new Date('2025-12-18'),
        updatedAt: new Date('2025-12-26'),
        createdBy: 'seller1'
    },
    {
        id: '3',
        name: 'Vintage Watch Collection',
        status: 'Completed',
        type: 'Shop',
        budget: { type: 'total', amount: 5000, spent: 5000 },
        targeting: { categories: ['accessories'] },
        performance: { impressions: 45000, clicks: 3500, ctr: 7.78, conversions: 245, revenue: 340000, roi: 6.8 },
        createdAt: new Date('2025-11-01'),
        updatedAt: new Date('2025-12-15'),
        createdBy: 'seller1'
    }
]

// Delete Modal Component
function DeleteModal({
    show,
    campaignName,
    langKey,
    onCancel,
    onConfirm
}: {
    show: boolean
    campaignName: string
    langKey: 'th' | 'en'
    onCancel: () => void
    onConfirm: () => void
}) {
    if (!show) return null

    return (
        <div className="fixed inset-0 flex items-center justify-center p-4" style={{ zIndex: 99999 }}>
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onCancel} />
            <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 max-w-md w-full transform transition-all">
                <button
                    onClick={onCancel}
                    className="absolute top-4 right-4 p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                >
                    <X className="w-5 h-5 text-gray-400" />
                </button>
                <div className="flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center flex-shrink-0">
                        <Trash2 className="w-7 h-7 text-red-600 dark:text-red-400" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                            {langKey === 'th' ? 'ยืนยันการลบ' : 'Confirm Delete'}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            {langKey === 'th' ? 'การกระทำนี้ไม่สามารถย้อนกลับได้' : 'This action cannot be undone'}
                        </p>
                    </div>
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-6 bg-gray-50 dark:bg-gray-900/50 p-3 rounded-lg">
                    {langKey === 'th'
                        ? <>คุณแน่ใจหรือไม่ว่าต้องการลบแคมเปญ <strong>&quot;{campaignName}&quot;</strong>?</>
                        : <>Are you sure you want to delete <strong>&quot;{campaignName}&quot;</strong>?</>
                    }
                </p>
                <div className="flex gap-3">
                    <button
                        onClick={onCancel}
                        className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 font-semibold transition-colors"
                    >
                        {langKey === 'th' ? 'ยกเลิก' : 'Cancel'}
                    </button>
                    <button
                        onClick={onConfirm}
                        className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold shadow-lg shadow-red-500/25 transition-colors"
                    >
                        {langKey === 'th' ? 'ลบเลย' : 'Delete'}
                    </button>
                </div>
            </div>
        </div>
    )
}

// Notification Toast Component
function NotificationToast({ notification }: {
    notification: { type: 'success' | 'error', message: string } | null
}) {
    if (!notification) return null

    return (
        <div
            className={`fixed top-20 right-4 px-5 py-3 rounded-xl shadow-lg flex items-center gap-3 ${notification.type === 'success'
                ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white'
                : 'bg-gradient-to-r from-red-500 to-rose-500 text-white'
                }`}
            style={{ zIndex: 99998 }}
        >
            {notification.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
            <span className="font-medium">{notification.message}</span>
        </div>
    )
}

// Main Content Component (ใช้ภายใน เพื่อหลีกเลี่ยง hydration mismatch)
function ShopAdsContent() {
    const { language } = useLanguage()
    const langKey: 'th' | 'en' = language === 'th' ? 'th' : 'en'

    // Get translations based on current language
    const t = sellerTranslations.shopAds[langKey]
    const tCommon = sellerTranslations.common[langKey]

    // State
    const [campaigns, setCampaigns] = useState<Campaign[]>(MOCK_CAMPAIGNS)
    const [searchQuery, setSearchQuery] = useState('')
    const [statusFilter, setStatusFilter] = useState<CampaignStatus | 'All'>('All')
    const [dateRange, setDateRange] = useState<'7' | '30' | '90'>('7')
    const [sort, setSort] = useState<CampaignTableSort>({ field: 'createdAt', order: 'desc' })
    const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null)

    // Delete modal state
    const [deleteModalOpen, setDeleteModalOpen] = useState(false)
    const [deleteCampaignId, setDeleteCampaignId] = useState('')
    const [deleteCampaignName, setDeleteCampaignName] = useState('')

    // Auto-hide notification
    useEffect(() => {
        if (notification) {
            const timer = setTimeout(() => setNotification(null), 3000)
            return () => clearTimeout(timer)
        }
    }, [notification])

    // Computed stats
    const stats = useMemo(() => {
        const active = campaigns.filter(c => c.status === 'Active')
        return {
            impressions: active.reduce((sum, c) => sum + c.performance.impressions, 0),
            clicks: active.reduce((sum, c) => sum + c.performance.clicks, 0),
            ctr: active.length > 0 ? (active.reduce((sum, c) => sum + c.performance.ctr, 0) / active.length) : 0,
            spend: active.reduce((sum, c) => sum + c.budget.spent, 0),
            trends: { impressions: 15, clicks: 5, ctr: 0.2, spend: 10 }
        }
    }, [campaigns])

    // Filtered campaigns
    const filteredCampaigns = useMemo(() => {
        let result = campaigns
        if (searchQuery) {
            result = result.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()))
        }
        if (statusFilter !== 'All') {
            result = result.filter(c => c.status === statusFilter)
        }
        return [...result].sort((a, b) => {
            let aVal: number | string | Date, bVal: number | string | Date
            switch (sort.field) {
                case 'name': aVal = a.name; bVal = b.name; break
                case 'impressions': aVal = a.performance.impressions; bVal = b.performance.impressions; break
                case 'clicks': aVal = a.performance.clicks; bVal = b.performance.clicks; break
                case 'roi': aVal = a.performance.roi; bVal = b.performance.roi; break
                default: aVal = a.createdAt; bVal = b.createdAt
            }
            return sort.order === 'asc' ? (aVal > bVal ? 1 : -1) : (aVal < bVal ? 1 : -1)
        })
    }, [campaigns, searchQuery, statusFilter, sort])

    // Handlers
    const showNotification = useCallback((type: 'success' | 'error', message: string) => {
        setNotification({ type, message })
    }, [])

    const handleCreateCampaign = useCallback(() => {
        showNotification('success', langKey === 'th' ? 'กำลังเปิดหน้าสร้างแคมเปญ...' : 'Opening campaign creation...')
    }, [langKey, showNotification])

    const handleManageCampaign = useCallback((campaignId: string) => {
        const campaign = campaigns.find(c => c.id === campaignId)
        showNotification('success', langKey === 'th' ? `กำลังเปิดรายละเอียด: ${campaign?.name}` : `Opening: ${campaign?.name}`)
    }, [campaigns, langKey, showNotification])

    const handleTogglePause = useCallback((campaignId: string) => {
        setCampaigns(prev => prev.map(c => {
            if (c.id === campaignId) {
                const newStatus = c.status === 'Active' ? 'Paused' as const : 'Active' as const
                showNotification('success', langKey === 'th'
                    ? `${c.name} ${newStatus === 'Active' ? 'เปิดใช้งานแล้ว' : 'หยุดชั่วคราวแล้ว'}`
                    : `${c.name} ${newStatus === 'Active' ? 'activated' : 'paused'}`)
                return { ...c, status: newStatus }
            }
            return c
        }))
    }, [langKey, showNotification])

    const handleDuplicate = useCallback((campaignId: string) => {
        const campaign = campaigns.find(c => c.id === campaignId)
        if (campaign) {
            const newCampaign: Campaign = {
                ...campaign,
                id: `${campaign.id}-copy-${Date.now()}`,
                name: `${campaign.name} (${langKey === 'th' ? 'สำเนา' : 'Copy'})`,
                status: 'Draft',
                createdAt: new Date(),
                updatedAt: new Date()
            }
            setCampaigns(prev => [newCampaign, ...prev])
            showNotification('success', langKey === 'th' ? `ทำสำเนา "${campaign.name}" แล้ว` : `Duplicated "${campaign.name}"`)
        }
    }, [campaigns, langKey, showNotification])

    // Delete handlers
    const openDeleteModal = useCallback((campaignId: string, campaignName: string) => {
        setDeleteCampaignId(campaignId)
        setDeleteCampaignName(campaignName)
        setDeleteModalOpen(true)
    }, [])

    const closeDeleteModal = useCallback(() => {
        setDeleteModalOpen(false)
        setDeleteCampaignId('')
        setDeleteCampaignName('')
    }, [])

    const executeDelete = useCallback(() => {
        setCampaigns(prev => prev.filter(c => c.id !== deleteCampaignId))
        showNotification('success', langKey === 'th' ? `ลบ "${deleteCampaignName}" แล้ว` : `Deleted "${deleteCampaignName}"`)
        closeDeleteModal()
    }, [deleteCampaignId, deleteCampaignName, langKey, showNotification, closeDeleteModal])

    const handleSort = useCallback((field: SortField) => {
        setSort(prev => ({ field, order: prev.field === field && prev.order === 'desc' ? 'asc' : 'desc' }))
    }, [])

    const handleReset = useCallback(() => {
        setCampaigns([...MOCK_CAMPAIGNS])
        showNotification('success', langKey === 'th' ? 'รีเซ็ตข้อมูลแล้ว' : 'Data reset')
    }, [langKey, showNotification])

    return (
        <>
            {/* Delete Modal */}
            <DeleteModal
                show={deleteModalOpen}
                campaignName={deleteCampaignName}
                langKey={langKey}
                onCancel={closeDeleteModal}
                onConfirm={executeDelete}
            />

            {/* Notification */}
            <NotificationToast notification={notification} />

            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
                <Header />

                <main className="container mx-auto px-4 py-8 max-w-7xl">
                    {/* Back Link */}
                    <div className="mb-6">
                        <Link href="/seller/tools" className="inline-flex items-center text-gray-500 hover:text-neon-purple dark:text-gray-400 dark:hover:text-neon-purple transition-colors group">
                            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                            {t.backToTools}
                        </Link>
                    </div>

                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                        <div>
                            <h1 className="text-3xl font-bold flex items-center gap-3 text-gray-900 dark:text-white">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center shadow-lg shadow-orange-500/25">
                                    <Megaphone className="w-6 h-6 text-white" />
                                </div>
                                {t.title}
                            </h1>
                            <p className="text-gray-500 dark:text-gray-400 mt-2">{t.subtitle}</p>
                        </div>
                        <Button variant="primary" onClick={handleCreateCampaign} className="shadow-lg shadow-neon-purple/25">
                            <Plus className="w-4 h-4 mr-2" />{t.createCampaign}
                        </Button>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                        <StatCard label={t.stats.impressions} value={stats.impressions.toLocaleString()} trend={`+${stats.trends.impressions}%`} icon={<Users className="w-5 h-5" />} color="blue" />
                        <StatCard label={t.stats.clicks} value={stats.clicks.toLocaleString()} trend={`+${stats.trends.clicks}%`} icon={<MousePointer className="w-5 h-5" />} color="purple" />
                        <StatCard label={t.stats.ctr} value={`${stats.ctr.toFixed(1)}%`} trend={`+${stats.trends.ctr}%`} icon={<TrendingUp className="w-5 h-5" />} color="green" />
                        <StatCard label={t.stats.spend} value={`฿${stats.spend.toLocaleString()}`} trend={`+${stats.trends.spend}%`} icon={<DollarSign className="w-5 h-5" />} color="orange" />
                    </div>

                    {/* Filters */}
                    <div className="bg-white dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-100 dark:border-gray-700/50 shadow-sm mb-6 p-4">
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1 relative group">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-neon-purple transition-colors" />
                                <input
                                    type="text"
                                    placeholder={t.filters.search}
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-gray-900/50 border-2 border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:ring-0 focus:border-neon-purple transition-colors"
                                />
                            </div>
                            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as CampaignStatus | 'All')} className="bg-gray-50 dark:bg-gray-900/50 border-2 border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-sm focus:ring-0 focus:border-neon-purple min-w-[140px]">
                                <option value="All">{tCommon.all}</option>
                                <option value="Active">{t.status.active}</option>
                                <option value="Paused">{t.status.paused}</option>
                                <option value="Completed">{t.status.completed}</option>
                                <option value="Draft">{t.status.draft}</option>
                            </select>
                            <select value={dateRange} onChange={(e) => setDateRange(e.target.value as '7' | '30' | '90')} className="bg-gray-50 dark:bg-gray-900/50 border-2 border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-sm focus:ring-0 focus:border-neon-purple min-w-[140px]">
                                <option value="7">{t.filters.last7days}</option>
                                <option value="30">{t.filters.last30days}</option>
                                <option value="90">{t.filters.last90days}</option>
                            </select>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="bg-white dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-100 dark:border-gray-700/50 shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-gray-100 dark:border-gray-700/50 flex items-center justify-between">
                            <h2 className="font-bold text-lg text-gray-900 dark:text-white">
                                {t.activeCampaigns} <span className="ml-2 text-sm font-normal text-gray-500">({filteredCampaigns.length})</span>
                            </h2>
                            <button onClick={handleReset} className="text-sm text-gray-500 hover:text-neon-purple flex items-center gap-2 px-3 py-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                                <RefreshCw className="w-4 h-4" />{langKey === 'th' ? 'รีเซ็ต' : 'Reset'}
                            </button>
                        </div>

                        {filteredCampaigns.length === 0 ? (
                            <div className="p-12 text-center">
                                <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-700 flex items-center justify-center">
                                    <Megaphone className="w-10 h-10 text-gray-400 dark:text-gray-500" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{t.empty.title}</h3>
                                <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-sm mx-auto">{t.empty.description}</p>
                                <Button variant="primary" onClick={handleCreateCampaign}><Plus className="w-4 h-4 mr-2" />{t.empty.action}</Button>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-gray-50/50 dark:bg-gray-900/30 text-gray-500 dark:text-gray-400 font-medium">
                                        <tr>
                                            <SortableHeader label={t.table.campaignName} field="name" currentSort={sort} onSort={handleSort} />
                                            <th className="px-6 py-4">{t.table.status}</th>
                                            <th className="px-6 py-4">{t.table.budget}</th>
                                            <SortableHeader label={t.table.impressions} field="impressions" currentSort={sort} onSort={handleSort} />
                                            <SortableHeader label={t.table.clicks} field="clicks" currentSort={sort} onSort={handleSort} />
                                            <SortableHeader label={t.table.roi} field="roi" currentSort={sort} onSort={handleSort} />
                                            <th className="px-6 py-4 text-right">{t.table.actions}</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100 dark:divide-gray-700/50">
                                        {filteredCampaigns.map(campaign => (
                                            <CampaignRow
                                                key={campaign.id}
                                                campaign={campaign}
                                                translations={t}
                                                onManage={handleManageCampaign}
                                                onTogglePause={handleTogglePause}
                                                onDuplicate={handleDuplicate}
                                                onDelete={openDeleteModal}
                                            />
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </>
    )
}

// Export with dynamic loading to avoid hydration mismatch
export default function ShopAdsPage() {
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])


    // Show loading skeleton during SSR to avoid hydration mismatch
    if (!mounted) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
                <Header />
                <main className="container mx-auto px-4 py-8 max-w-7xl">
                    <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse mb-8" />
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="h-32 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl animate-pulse" />
                        ))}
                    </div>
                    <div className="h-64 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl animate-pulse" />
                </main>
            </div>
        )
    }

    return <ShopAdsContent />
}

// ========== Sub-components ==========

interface StatCardProps {
    label: string; value: string; trend: string; icon: React.ReactNode; color: 'blue' | 'purple' | 'green' | 'orange'
}

function StatCard({ label, value, trend, icon, color }: StatCardProps) {
    const colors = { blue: 'from-blue-500 to-blue-600', purple: 'from-purple-500 to-purple-600', green: 'from-green-500 to-green-600', orange: 'from-orange-500 to-pink-500' }
    return (
        <div className="bg-white dark:bg-gray-800/50 p-5 rounded-2xl border border-gray-100 dark:border-gray-700/50 shadow-sm hover:shadow-lg hover:scale-[1.02] transition-all">
            <div className="flex justify-between items-start mb-4">
                <div className={`p-2.5 rounded-xl bg-gradient-to-br ${colors[color]} text-white shadow-lg`}>{icon}</div>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400">{trend}</span>
            </div>
            <div className="text-2xl font-bold mb-1 text-gray-900 dark:text-white">{value}</div>
            <div className="text-gray-500 dark:text-gray-400 text-sm">{label}</div>
        </div>
    )
}

interface SortableHeaderProps {
    label: string; field: SortField; currentSort: CampaignTableSort; onSort: (field: SortField) => void
}

function SortableHeader({ label, field, currentSort, onSort }: SortableHeaderProps) {
    const isActive = currentSort.field === field
    return (
        <th className="px-6 py-4 cursor-pointer hover:bg-gray-100/50 dark:hover:bg-gray-800/50 transition-colors select-none group" onClick={() => onSort(field)}>
            <div className="flex items-center gap-1">
                <span>{label}</span>
                <span className={`transition-opacity ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-50'}`}>
                    {currentSort.order === 'desc' ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
                </span>
            </div>
        </th>
    )
}

interface CampaignRowProps {
    campaign: Campaign
    translations: typeof sellerTranslations.shopAds.th
    onManage: (id: string) => void
    onTogglePause: (id: string) => void
    onDuplicate: (id: string) => void
    onDelete: (id: string, name: string) => void
}

function CampaignRow({ campaign, translations: t, onManage, onTogglePause, onDuplicate, onDelete }: CampaignRowProps) {
    const [showActions, setShowActions] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowActions(false)
            }
        }
        if (showActions) {
            document.addEventListener('mousedown', handleClickOutside)
            return () => document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [showActions])

    const statusColors: Record<CampaignStatus, string> = {
        Active: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
        Paused: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
        Completed: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400',
        Draft: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
        Scheduled: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
    }

    const budgetText = campaign.budget.type === 'daily'
        ? `฿${campaign.budget.amount.toLocaleString()}${t.perDay}`
        : `${t.total} ฿${campaign.budget.amount.toLocaleString()}`

    return (
        <tr className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors">
            <td className="px-6 py-4"><span className="font-medium text-gray-900 dark:text-white">{campaign.name}</span></td>
            <td className="px-6 py-4"><span className={`px-2.5 py-1 rounded-full text-xs font-bold ${statusColors[campaign.status]}`}>{t.status[campaign.status.toLowerCase() as keyof typeof t.status]}</span></td>
            <td className="px-6 py-4 text-gray-600 dark:text-gray-400">{budgetText}</td>
            <td className="px-6 py-4 text-gray-700 dark:text-gray-300">{campaign.performance.impressions.toLocaleString()}</td>
            <td className="px-6 py-4 text-gray-700 dark:text-gray-300">{campaign.performance.clicks.toLocaleString()}</td>
            <td className="px-6 py-4"><span className="font-bold text-green-600 dark:text-green-400">{campaign.performance.roi}x</span></td>
            <td className="px-6 py-4 text-right">
                <div className="relative inline-block" ref={dropdownRef}>
                    <button onClick={() => setShowActions(!showActions)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors" aria-label="Actions">
                        <MoreVertical className="w-4 h-4 text-gray-500" />
                    </button>
                    {showActions && (
                        <div className="absolute right-0 top-full mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl py-2 min-w-[180px]" style={{ zIndex: 1000 }}>
                            <button onClick={() => { onManage(campaign.id); setShowActions(false) }} className="w-full px-4 py-2.5 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-3 text-gray-700 dark:text-gray-300">
                                <Eye className="w-4 h-4" />{t.actions.manage}
                            </button>
                            {campaign.status !== 'Completed' && (
                                <button onClick={() => { onTogglePause(campaign.id); setShowActions(false) }} className="w-full px-4 py-2.5 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-3 text-gray-700 dark:text-gray-300">
                                    {campaign.status === 'Active' ? <><Pause className="w-4 h-4" />{t.actions.pause}</> : <><Play className="w-4 h-4" />{t.actions.resume}</>}
                                </button>
                            )}
                            <button onClick={() => { onDuplicate(campaign.id); setShowActions(false) }} className="w-full px-4 py-2.5 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-3 text-gray-700 dark:text-gray-300">
                                <Copy className="w-4 h-4" />{t.actions.duplicate}
                            </button>
                            <div className="border-t border-gray-100 dark:border-gray-700 my-2" />
                            <button
                                onClick={() => {
                                    // เรียก onDelete ก่อน แล้วค่อยปิด dropdown ใน next frame
                                    onDelete(campaign.id, campaign.name)
                                    requestAnimationFrame(() => setShowActions(false))
                                }}
                                className="w-full px-4 py-2.5 text-left text-sm hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 flex items-center gap-3"
                            >
                                <Trash2 className="w-4 h-4" />{t.actions.delete}
                            </button>
                        </div>
                    )}
                </div>
            </td>
        </tr>
    )
}
