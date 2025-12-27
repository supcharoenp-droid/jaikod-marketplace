'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import {
    TrendingUp,
    Ticket,
    Megaphone,
    Zap,
    Plus,
    BarChart3,
    Sparkles,
    Target,
    Users,
    Gift,
    Calendar,
    Clock,
    Eye,
    ChevronRight,
    DollarSign,
    Percent,
    Tag,
    Copy,
    Share2,
    Settings,
    Play,
    Pause,
    Edit,
    Trash2,
    ArrowUpRight,
    ShoppingBag,
    Star,
    Bell
} from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import CampaignModal from '@/components/seller/CampaignModal'

// ==================== Types ====================
interface Campaign {
    id: number
    name: string
    nameTh?: string
    type: 'voucher' | 'flash_sale' | 'bundle' | 'ad'
    discount: string
    status: 'active' | 'scheduled' | 'ended' | 'paused'
    startDate: string
    endDate: string
    used: number
    budget?: number
    sales: number
    views?: number
    conversionRate?: number
}

interface MarketingStats {
    totalSales: number
    totalReach: number
    activeCampaigns: number
    conversionRate: number
}

// ==================== Helper Components ====================

/**
 * AI Marketing Insights Card
 */
function AIMarketingInsights({ stats }: { stats: MarketingStats }) {
    const { t, language } = useLanguage()

    const insights = [
        {
            type: 'opportunity',
            icon: Target,
            th: '🎯 พบผู้เข้าชม 150+ คนที่ดูสินค้าแต่ยังไม่ซื้อ ส่งคูปองลด 5% อาจเพิ่ม Conversion ~8%',
            en: '🎯 150+ visitors viewed products without buying. A 5% coupon could boost conversion by ~8%'
        },
        {
            type: 'timing',
            icon: Clock,
            th: '⏰ ช่วง 19:00-21:00 น. มีคนเข้าชมเยอะสุด เหมาะเปิด Flash Sale',
            en: '⏰ Peak traffic at 7-9 PM. Ideal time for Flash Sales'
        }
    ]

    return (
        <div className="bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-600 rounded-2xl p-6 text-white relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-400/20 rounded-full blur-2xl" />

            <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                            <Sparkles className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h3 className="font-bold text-lg">
                                {t('AI แนะนำการตลาด', 'AI Marketing Insights')}
                            </h3>
                            <p className="text-sm text-white/70">
                                {t('โอกาสเพิ่มยอดขายวันนี้', 'Today\'s growth opportunities')}
                            </p>
                        </div>
                    </div>
                    <div className="hidden md:block text-right">
                        <div className="text-3xl font-black">+{stats.conversionRate}%</div>
                        <div className="text-sm text-white/70">{t('Conversion เพิ่มขึ้น', 'Higher Conversion')}</div>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-3 gap-4 mb-4 pt-4 border-t border-white/20">
                    <div className="text-center">
                        <div className="text-2xl font-bold">฿{stats.totalSales.toLocaleString()}</div>
                        <div className="text-xs text-white/70">{t('ยอดขายจากแคมเปญ', 'Campaign Sales')}</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold">{stats.totalReach.toLocaleString()}</div>
                        <div className="text-xs text-white/70">{t('การเข้าถึง', 'Total Reach')}</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold text-yellow-300">{stats.activeCampaigns}</div>
                        <div className="text-xs text-white/70">{t('แคมเปญที่ใช้งาน', 'Active Campaigns')}</div>
                    </div>
                </div>

                {/* Insights */}
                <div className="space-y-2">
                    {insights.map((insight, idx) => (
                        <div
                            key={idx}
                            className="p-3 bg-white/10 border border-white/10 rounded-xl text-sm hover:bg-white/20 transition-colors cursor-pointer"
                        >
                            {language === 'th' ? insight.th : insight.en}
                        </div>
                    ))}
                </div>

                {/* CTA Button */}
                <button className="mt-4 w-full py-3 bg-white text-indigo-600 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-white/90 transition-colors">
                    <Zap className="w-5 h-5" />
                    {t('สร้างแคมเปญจาก AI', 'Create AI Campaign')}
                </button>
            </div>
        </div>
    )
}

/**
 * Marketing Tool Card
 */
function MarketingToolCard({
    icon: Icon,
    title,
    description,
    color,
    bgColor,
    onClick,
    badge,
    stats
}: {
    icon: React.ElementType
    title: string
    description: string
    color: string
    bgColor: string
    onClick?: () => void
    badge?: string
    stats?: { label: string, value: string }
}) {
    return (
        <div
            onClick={onClick}
            className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border-2 border-gray-200 dark:border-gray-700 hover:border-indigo-400 dark:hover:border-indigo-500 transition-all group cursor-pointer"
        >
            <div className="flex items-start justify-between mb-4">
                <div className={`w-14 h-14 ${bgColor} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <Icon className={`w-7 h-7 ${color}`} />
                </div>
                {badge && (
                    <span className="px-2 py-1 bg-orange-100 text-orange-600 rounded-full text-xs font-bold">
                        {badge}
                    </span>
                )}
            </div>
            <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2">{title}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{description}</p>
            {stats && (
                <div className="pt-3 border-t border-gray-100 dark:border-gray-700">
                    <span className="text-xs text-gray-400">{stats.label}</span>
                    <span className="text-lg font-bold text-gray-900 dark:text-white ml-2">{stats.value}</span>
                </div>
            )}
            <div className="flex items-center gap-1 text-indigo-600 dark:text-indigo-400 font-medium text-sm mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                จัดการ <ChevronRight className="w-4 h-4" />
            </div>
        </div>
    )
}

/**
 * Campaign Row Component
 */
function CampaignRow({
    campaign,
    onEdit,
    onToggle,
    t,
    language
}: {
    campaign: Campaign
    onEdit: () => void
    onToggle: () => void
    t: (th: string, en: string) => string
    language: string
}) {
    const typeConfig: Record<string, { icon: React.ElementType, color: string, bg: string, labelTh: string, labelEn: string }> = {
        voucher: { icon: Ticket, color: 'text-blue-600', bg: 'bg-blue-100', labelTh: 'คูปอง', labelEn: 'Voucher' },
        flash_sale: { icon: Zap, color: 'text-orange-600', bg: 'bg-orange-100', labelTh: 'Flash Sale', labelEn: 'Flash Sale' },
        bundle: { icon: Gift, color: 'text-pink-600', bg: 'bg-pink-100', labelTh: 'Bundle', labelEn: 'Bundle' },
        ad: { icon: Megaphone, color: 'text-purple-600', bg: 'bg-purple-100', labelTh: 'โฆษณา', labelEn: 'Ad' }
    }

    const statusConfig: Record<string, { labelTh: string, labelEn: string, color: string, bg: string }> = {
        active: { labelTh: 'กำลังใช้งาน', labelEn: 'Active', color: 'text-emerald-700', bg: 'bg-emerald-100' },
        scheduled: { labelTh: 'กำหนดเวลา', labelEn: 'Scheduled', color: 'text-blue-700', bg: 'bg-blue-100' },
        ended: { labelTh: 'สิ้นสุด', labelEn: 'Ended', color: 'text-gray-600', bg: 'bg-gray-100' },
        paused: { labelTh: 'หยุดชั่วคราว', labelEn: 'Paused', color: 'text-amber-700', bg: 'bg-amber-100' }
    }

    const typeInfo = typeConfig[campaign.type] || typeConfig.voucher
    const statusInfo = statusConfig[campaign.status] || statusConfig.active
    const TypeIcon = typeInfo.icon

    return (
        <tr className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
            <td className="p-4 pl-6">
                <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 ${typeInfo.bg} rounded-xl flex items-center justify-center`}>
                        <TypeIcon className={`w-5 h-5 ${typeInfo.color}`} />
                    </div>
                    <div>
                        <span className="font-semibold text-gray-900 dark:text-white">
                            {language === 'th' && campaign.nameTh ? campaign.nameTh : campaign.name}
                        </span>
                        <div className="text-xs text-gray-500">
                            {language === 'th' ? typeInfo.labelTh : typeInfo.labelEn}
                        </div>
                    </div>
                </div>
            </td>
            <td className="p-4">
                <span className="font-bold text-indigo-600 dark:text-indigo-400">{campaign.discount}</span>
            </td>
            <td className="p-4">
                <div className="text-sm">
                    <div className="text-gray-900 dark:text-white">{campaign.startDate}</div>
                    <div className="text-gray-400 text-xs">{t('ถึง', 'to')} {campaign.endDate}</div>
                </div>
            </td>
            <td className="p-4">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${statusInfo.bg} ${statusInfo.color}`}>
                    {campaign.status === 'active' && <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />}
                    {language === 'th' ? statusInfo.labelTh : statusInfo.labelEn}
                </span>
            </td>
            <td className="p-4">
                <div className="text-sm">
                    <span className="font-bold text-gray-900 dark:text-white">{campaign.used}</span>
                    <span className="text-gray-400 ml-1">{t('ครั้ง', 'times')}</span>
                </div>
            </td>
            <td className="p-4 text-right">
                <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                    ฿{campaign.sales.toLocaleString()}
                </span>
            </td>
            <td className="p-4 pr-6">
                <div className="flex items-center justify-end gap-1">
                    <button
                        onClick={onToggle}
                        className={`p-2 rounded-lg transition-colors ${campaign.status === 'active'
                            ? 'hover:bg-amber-100 text-amber-600'
                            : 'hover:bg-emerald-100 text-emerald-600'
                            }`}
                        title={campaign.status === 'active' ? t('หยุดชั่วคราว', 'Pause') : t('เปิดใช้งาน', 'Activate')}
                    >
                        {campaign.status === 'active' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    </button>
                    <button
                        onClick={onEdit}
                        className="p-2 hover:bg-blue-100 rounded-lg text-blue-600 transition-colors"
                        title={t('แก้ไข', 'Edit')}
                    >
                        <Edit className="w-4 h-4" />
                    </button>
                    <button
                        className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 transition-colors"
                        title={t('คัดลอก', 'Duplicate')}
                    >
                        <Copy className="w-4 h-4" />
                    </button>
                </div>
            </td>
        </tr>
    )
}

// ==================== Main Component ====================
export default function SellerMarketingPageV2() {
    const { t, language } = useLanguage()
    const [isCreateOpen, setIsCreateOpen] = useState(false)
    const [activeTab, setActiveTab] = useState('all')

    // Mock Data
    const [campaigns, setCampaigns] = useState<Campaign[]>([
        {
            id: 1,
            name: 'Welcome New User',
            nameTh: 'ต้อนรับลูกค้าใหม่',
            type: 'voucher',
            discount: '฿50 OFF',
            status: 'active',
            startDate: '20 ธ.ค.',
            endDate: '31 ธ.ค.',
            used: 45,
            sales: 12500
        },
        {
            id: 2,
            name: 'Flash Sale 12.12',
            nameTh: 'Flash Sale 12.12',
            type: 'flash_sale',
            discount: '15% OFF',
            status: 'ended',
            startDate: '12 ธ.ค.',
            endDate: '12 ธ.ค.',
            used: 320,
            sales: 45000
        },
        {
            id: 3,
            name: 'Christmas Bundle',
            nameTh: 'Bundle คริสต์มาส',
            type: 'bundle',
            discount: 'ซื้อ 2 แถม 1',
            status: 'active',
            startDate: '24 ธ.ค.',
            endDate: '26 ธ.ค.',
            used: 18,
            sales: 8200
        },
        {
            id: 4,
            name: 'New Year Boost',
            nameTh: 'โปรโมทปีใหม่',
            type: 'ad',
            discount: '฿500/วัน',
            status: 'scheduled',
            startDate: '1 ม.ค.',
            endDate: '7 ม.ค.',
            used: 0,
            budget: 3500,
            sales: 0
        }
    ])

    // Stats
    const stats: MarketingStats = {
        totalSales: campaigns.reduce((sum, c) => sum + c.sales, 0),
        totalReach: 12500,
        activeCampaigns: campaigns.filter(c => c.status === 'active').length,
        conversionRate: 8.5
    }

    // Tabs
    const tabs = [
        { id: 'all', labelTh: 'ทั้งหมด', labelEn: 'All', count: campaigns.length },
        { id: 'active', labelTh: 'กำลังใช้งาน', labelEn: 'Active', count: campaigns.filter(c => c.status === 'active').length },
        { id: 'scheduled', labelTh: 'กำหนดเวลา', labelEn: 'Scheduled', count: campaigns.filter(c => c.status === 'scheduled').length },
        { id: 'ended', labelTh: 'สิ้นสุด', labelEn: 'Ended', count: campaigns.filter(c => c.status === 'ended').length },
    ]

    // Filter
    const filteredCampaigns = campaigns.filter(c => activeTab === 'all' || c.status === activeTab)

    // Handlers
    const handleCreate = (data: any) => {
        setCampaigns([...campaigns, {
            id: Date.now(),
            name: data.name,
            type: data.type || 'voucher',
            discount: data.type === 'voucher' ? `฿${data.discountAmount}` : 'Custom',
            status: 'active',
            startDate: 'วันนี้',
            endDate: '7 วัน',
            used: 0,
            sales: 0
        }])
        setIsCreateOpen(false)
    }

    const handleToggle = (id: number) => {
        setCampaigns(prev => prev.map(c => {
            if (c.id === id) {
                return { ...c, status: c.status === 'active' ? 'paused' : 'active' as const }
            }
            return c
        }))
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-black text-gray-900 dark:text-white">
                        {t('🎯 ศูนย์การตลาด', '🎯 Marketing Centre')}
                    </h1>
                    <p className="text-gray-500 mt-1">
                        {t('สร้างแคมเปญเพื่อเพิ่มยอดขาย', 'Create campaigns to boost sales')}
                    </p>
                </div>
                <button
                    onClick={() => setIsCreateOpen(true)}
                    className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-xl font-bold shadow-lg shadow-purple-500/25 transition-all"
                >
                    <Plus className="w-5 h-5" />
                    {t('สร้างแคมเปญ', 'Create Campaign')}
                </button>
            </div>

            {/* AI Insights */}
            <AIMarketingInsights stats={stats} />

            {/* Marketing Tools */}
            <div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                    {t('เครื่องมือการตลาด', 'Marketing Tools')}
                </h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <MarketingToolCard
                        icon={Ticket}
                        title={t('คูปองส่วนลด', 'My Vouchers')}
                        description={t('สร้างคูปองให้ลูกค้าเพื่อเพิ่ม Conversion', 'Create coupons to boost conversion')}
                        color="text-blue-600"
                        bgColor="bg-blue-100"
                        onClick={() => setIsCreateOpen(true)}
                        stats={{ label: t('ใช้แล้ว', 'Used'), value: '45' }}
                    />
                    <MarketingToolCard
                        icon={Zap}
                        title={t('Flash Sale', 'Flash Sale')}
                        description={t('เข้าร่วม Flash Sale เพื่อเพิ่มการมองเห็น', 'Join Flash Sales for more visibility')}
                        color="text-orange-600"
                        bgColor="bg-orange-100"
                        badge={t('แนะนำ', 'HOT')}
                        stats={{ label: t('ยอดขาย', 'Sales'), value: '฿45K' }}
                    />
                    <MarketingToolCard
                        icon={Gift}
                        title={t('Bundle Deal', 'Bundle Deal')}
                        description={t('สร้างชุดสินค้าราคาพิเศษ', 'Create bundle deals with special prices')}
                        color="text-pink-600"
                        bgColor="bg-pink-100"
                        stats={{ label: t('Bundle', 'Bundle'), value: '3' }}
                    />
                    <MarketingToolCard
                        icon={Megaphone}
                        title={t('โฆษณา', 'Ads Manager')}
                        description={t('โปรโมทสินค้าในผลการค้นหา', 'Promote products in search results')}
                        color="text-purple-600"
                        bgColor="bg-purple-100"
                        stats={{ label: t('งบประมาณ', 'Budget'), value: '฿500' }}
                    />
                </div>
            </div>

            {/* Campaigns List */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                {/* Table Header */}
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                            {t('แคมเปญทั้งหมด', 'All Campaigns')}
                        </h3>
                        <div className="flex gap-2">
                            {tabs.map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${activeTab === tab.id
                                        ? 'bg-indigo-600 text-white'
                                        : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200'
                                        }`}
                                >
                                    {language === 'th' ? tab.labelTh : tab.labelEn}
                                    {tab.count > 0 && (
                                        <span className={`ml-1.5 px-1.5 py-0.5 rounded-full text-xs ${activeTab === tab.id ? 'bg-white/20' : 'bg-gray-200 dark:bg-gray-600'
                                            }`}>
                                            {tab.count}
                                        </span>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 dark:bg-gray-900/50 text-sm text-gray-600 dark:text-gray-400">
                            <tr>
                                <th className="p-4 pl-6 font-semibold text-left">{t('แคมเปญ', 'Campaign')}</th>
                                <th className="p-4 font-semibold text-left">{t('ส่วนลด', 'Discount')}</th>
                                <th className="p-4 font-semibold text-left">{t('ระยะเวลา', 'Period')}</th>
                                <th className="p-4 font-semibold text-left">{t('สถานะ', 'Status')}</th>
                                <th className="p-4 font-semibold text-left">{t('การใช้', 'Usage')}</th>
                                <th className="p-4 font-semibold text-right">{t('ยอดขาย', 'Sales')}</th>
                                <th className="p-4 pr-6 font-semibold text-right">{t('จัดการ', 'Actions')}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                            {filteredCampaigns.map(campaign => (
                                <CampaignRow
                                    key={campaign.id}
                                    campaign={campaign}
                                    onEdit={() => { }}
                                    onToggle={() => handleToggle(campaign.id)}
                                    t={t}
                                    language={language}
                                />
                            ))}
                            {filteredCampaigns.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="p-12 text-center">
                                        <Ticket className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                                        <p className="text-gray-500 font-medium">
                                            {t('ยังไม่มีแคมเปญ', 'No campaigns yet')}
                                        </p>
                                        <button
                                            onClick={() => setIsCreateOpen(true)}
                                            className="mt-4 text-indigo-600 font-medium hover:text-indigo-700"
                                        >
                                            + {t('สร้างแคมเปญแรก', 'Create first campaign')}
                                        </button>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Campaign Modal */}
            <CampaignModal
                isOpen={isCreateOpen}
                onClose={() => setIsCreateOpen(false)}
                onSave={handleCreate}
            />
        </div>
    )
}
