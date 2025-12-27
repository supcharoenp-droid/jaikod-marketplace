'use client'

import React from 'react'
import {
    Package,
    MessageCircle,
    Star,
    AlertTriangle,
    TrendingUp,
    TrendingDown,
    ChevronRight,
    Sparkles,
    Zap,
    Eye,
    ShoppingCart,
    RefreshCw,
    BarChart3,
    Clock,
    CheckCircle,
    XCircle,
    Truck
} from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import Link from 'next/link'

// ==================== Types ====================
interface ActionItem {
    id: string
    icon: React.ElementType
    label: string
    count: number
    color: string
    bgColor: string
    link: string
    urgent?: boolean
}

interface KPIData {
    label: string
    value: string | number
    trend: number
    trendLabel: string
    icon: React.ElementType
    color: string
    bgColor: string
}

interface AIInsight {
    summary: string
    topProduct: string
    topProductSales: number
    peakHour: string
    recommendation: string
}

interface PredictionData {
    day: string
    predicted: number
    actual?: number
}

interface RecentOrder {
    id: string
    customer: string
    product: string
    amount: number
    status: 'pending' | 'paid' | 'shipping' | 'completed' | 'cancelled'
    date: string
}

// ==================== Sub Components ====================

/**
 * Action Required Section - แสดงสิ่งที่ต้องทำวันนี้
 */
export function ActionRequiredSection({ items }: { items: ActionItem[] }) {
    const { t } = useLanguage()

    // Show all items, don't filter by count (show even if 0)
    const hasUrgentItems = items.some(item => item.count > 0)

    if (!hasUrgentItems) {
        return (
            <div className="bg-emerald-50 dark:bg-emerald-900/50 border-2 border-emerald-300 dark:border-emerald-600 rounded-2xl p-6">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-emerald-500 rounded-xl">
                        <CheckCircle className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h3 className="font-bold text-lg text-emerald-800 dark:text-emerald-200">
                            {t('ทำงานครบแล้ววันนี้! 🎉', 'All caught up! 🎉')}
                        </h3>
                        <p className="text-sm text-emerald-700 dark:text-emerald-300">
                            {t('ไม่มีงานที่ต้องทำ ลองดูรายงานหรือเพิ่มสินค้าใหม่', 'No pending tasks. Check reports or add new products.')}
                        </p>
                    </div>
                </div>
            </div>
        )
    }

    // Card configs with high contrast
    const cardConfigs: Record<string, { bg: string, iconBg: string, iconColor: string, textColor: string, borderColor: string }> = {
        orders: {
            bg: 'bg-blue-50 dark:bg-blue-900/60',
            iconBg: 'bg-blue-500',
            iconColor: 'text-white',
            textColor: 'text-blue-900 dark:text-blue-100',
            borderColor: 'border-blue-300 dark:border-blue-500'
        },
        chats: {
            bg: 'bg-pink-50 dark:bg-pink-900/60',
            iconBg: 'bg-pink-500',
            iconColor: 'text-white',
            textColor: 'text-pink-900 dark:text-pink-100',
            borderColor: 'border-pink-300 dark:border-pink-500'
        },
        reviews: {
            bg: 'bg-amber-50 dark:bg-amber-900/60',
            iconBg: 'bg-amber-500',
            iconColor: 'text-white',
            textColor: 'text-amber-900 dark:text-amber-100',
            borderColor: 'border-amber-300 dark:border-amber-500'
        },
        stock: {
            bg: 'bg-red-50 dark:bg-red-900/60',
            iconBg: 'bg-red-500',
            iconColor: 'text-white',
            textColor: 'text-red-900 dark:text-red-100',
            borderColor: 'border-red-300 dark:border-red-500'
        }
    }

    return (
        <div className="bg-orange-50 dark:bg-orange-950/80 border-2 border-orange-400 dark:border-orange-600 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-orange-500 rounded-xl shadow-md">
                        <AlertTriangle className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="font-black text-xl text-orange-800 dark:text-orange-200">
                        {t('⚡ ต้องดำเนินการ', '⚡ Action Required')}
                    </h3>
                </div>
                <Link
                    href="/seller/tasks"
                    className="text-sm font-bold text-orange-700 dark:text-orange-300 hover:text-orange-900 dark:hover:text-orange-100 flex items-center gap-1 bg-orange-200 dark:bg-orange-800 px-4 py-2 rounded-lg hover:bg-orange-300 dark:hover:bg-orange-700 transition-colors"
                >
                    {t('ดูทั้งหมด', 'View All')}
                    <ChevronRight className="w-4 h-4" />
                </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {items.map((item) => {
                    const config = cardConfigs[item.id] || cardConfigs.orders
                    return (
                        <Link
                            key={item.id}
                            href={item.link}
                            className={`group relative p-4 rounded-xl border-2 transition-all duration-300 hover:scale-[1.03] hover:shadow-xl ${config.bg} ${config.borderColor}`}
                        >
                            {item.urgent && (
                                <>
                                    <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-red-500 rounded-full animate-ping" />
                                    <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-red-500 rounded-full border-2 border-white" />
                                </>
                            )}
                            <div className="flex items-center gap-3">
                                <div className={`p-2.5 rounded-xl shadow-md ${config.iconBg}`}>
                                    <item.icon className={`w-5 h-5 ${config.iconColor}`} />
                                </div>
                                <div>
                                    <p className={`text-3xl font-black ${config.textColor}`}>{item.count}</p>
                                    <p className={`text-sm font-semibold ${config.textColor} opacity-80`}>{item.label}</p>
                                </div>
                            </div>
                            <div className={`mt-3 text-xs font-bold ${config.textColor} opacity-60 group-hover:opacity-100 transition-opacity flex items-center gap-1`}>
                                {t('จัดการ →', 'Manage →')}
                            </div>
                        </Link>
                    )
                })}
            </div>
        </div>
    )
}

/**
 * AI Business Insights - AI สรุปให้
 */
export function AIBusinessInsights({ insight, isLoading }: { insight: AIInsight | null, isLoading?: boolean }) {
    const { t } = useLanguage()

    if (isLoading) {
        return (
            <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 rounded-2xl p-6 animate-pulse">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 bg-white/20 rounded-xl">
                        <Sparkles className="w-6 h-6 text-white" />
                    </div>
                    <div className="h-6 w-32 bg-white/30 rounded" />
                </div>
                <div className="space-y-2">
                    <div className="h-4 w-full bg-white/20 rounded" />
                    <div className="h-4 w-3/4 bg-white/20 rounded" />
                    <div className="h-4 w-1/2 bg-white/20 rounded" />
                </div>
            </div>
        )
    }

    return (
        <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 rounded-2xl p-6 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-pink-400/20 rounded-full blur-2xl" />

            <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                        <Sparkles className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h3 className="font-bold text-lg text-white flex items-center gap-2">
                            {t('AI สรุปให้', 'AI Summary')}
                            <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">{t('วันนี้', 'Today')}</span>
                        </h3>
                    </div>
                </div>

                <div className="space-y-3 text-white/90">
                    <p className="leading-relaxed">
                        {insight?.summary || t(
                            '"ยอดขายวันนี้ดีกว่าเมื่อวาน 24% 🎉 สินค้าขายดีที่สุด: iPhone 15 Pro (3 ชิ้น) ช่วงเวลาที่ขายดี: 19:00-21:00 น."',
                            '"Sales today are 24% better than yesterday 🎉 Best seller: iPhone 15 Pro (3 units) Peak hours: 7-9 PM"'
                        )}
                    </p>

                    <div className="flex items-center gap-2 pt-2">
                        <Zap className="w-4 h-4 text-yellow-300" />
                        <span className="text-sm font-medium text-yellow-200">
                            {insight?.recommendation || t(
                                'แนะนำ: ลองโปรโมท "กล้อง Sony" ที่มีคนดูเยอะแต่ยังไม่ซื้อ',
                                'Tip: Promote "Sony Camera" - high views but low conversions'
                            )}
                        </span>
                    </div>
                </div>

                <div className="mt-4 flex gap-2">
                    <button className="px-4 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg text-sm font-medium text-white transition-colors">
                        {t('ดูรายละเอียด', 'View Details')}
                    </button>
                    <button className="px-4 py-2 bg-white text-purple-600 rounded-lg text-sm font-bold hover:bg-white/90 transition-colors">
                        {t('ทำตามคำแนะนำ', 'Apply Suggestions')}
                    </button>
                </div>
            </div>
        </div>
    )
}

/**
 * KPI Stats Cards - 4 ตัวชี้วัดหลัก
 */
export function KPIStatsCards({ stats }: { stats: KPIData[] }) {
    const { t } = useLanguage()

    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, index) => (
                <div
                    key={index}
                    className="bg-surface-dark border border-white/5 rounded-2xl p-5 hover:border-white/10 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/5"
                >
                    <div className="flex items-start justify-between mb-3">
                        <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                            <stat.icon className={`w-5 h-5 ${stat.color}`} />
                        </div>
                        <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${stat.trend >= 0
                            ? 'bg-emerald-500/10 text-emerald-400'
                            : 'bg-red-500/10 text-red-400'
                            }`}>
                            {stat.trend >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                            {stat.trend >= 0 ? '+' : ''}{stat.trend}%
                        </div>
                    </div>

                    <p className="text-3xl font-black text-white mb-1 tracking-tight">
                        {stat.value}
                    </p>
                    <p className="text-sm text-gray-400">{stat.label}</p>
                    <p className="text-xs text-gray-500 mt-1">{stat.trendLabel}</p>
                </div>
            ))}
        </div>
    )
}

/**
 * Predictive Sales Chart - กราฟพยากรณ์ยอดขาย
 */
export function PredictiveSalesChart({ data, expectedRevenue }: { data: PredictionData[], expectedRevenue: number }) {
    const { t } = useLanguage()
    const maxValue = Math.max(...data.map(d => Math.max(d.predicted, d.actual || 0)))

    return (
        <div className="bg-surface-dark border border-white/5 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="font-bold text-lg text-white flex items-center gap-2">
                        <BarChart3 className="w-5 h-5 text-purple-400" />
                        {t('พยากรณ์ยอดขาย 7 วัน', '7-Day Sales Forecast')}
                    </h3>
                    <p className="text-sm text-gray-400 mt-1">
                        {t('รายได้คาดหวัง', 'Expected Revenue')}:
                        <span className="text-emerald-400 font-bold ml-2">฿{expectedRevenue.toLocaleString()}</span>
                    </p>
                </div>
                <div className="flex items-center gap-4 text-xs">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-purple-500 rounded-full" />
                        <span className="text-gray-400">{t('คาดการณ์', 'Predicted')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-emerald-400 rounded-full" />
                        <span className="text-gray-400">{t('จริง', 'Actual')}</span>
                    </div>
                </div>
            </div>

            {/* Chart */}
            <div className="flex items-end justify-between gap-2 h-40">
                {data.map((item, index) => (
                    <div key={index} className="flex-1 flex flex-col items-center gap-1">
                        <div className="w-full flex items-end justify-center gap-1 h-32">
                            {/* Predicted Bar */}
                            <div
                                className="w-5 bg-gradient-to-t from-purple-600 to-purple-400 rounded-t-md transition-all duration-500 hover:from-purple-500 hover:to-purple-300"
                                style={{ height: `${(item.predicted / maxValue) * 100}%` }}
                                title={`${t('คาดการณ์', 'Predicted')}: ฿${item.predicted.toLocaleString()}`}
                            />
                            {/* Actual Bar (if exists) */}
                            {item.actual !== undefined && (
                                <div
                                    className="w-5 bg-gradient-to-t from-emerald-600 to-emerald-400 rounded-t-md transition-all duration-500"
                                    style={{ height: `${(item.actual / maxValue) * 100}%` }}
                                    title={`${t('จริง', 'Actual')}: ฿${item.actual.toLocaleString()}`}
                                />
                            )}
                        </div>
                        <span className="text-xs text-gray-500">{item.day}</span>
                    </div>
                ))}
            </div>

            {/* AI Accuracy */}
            <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm">
                    <Sparkles className="w-4 h-4 text-purple-400" />
                    <span className="text-gray-400">{t('ความแม่นยำ AI', 'AI Accuracy')}:</span>
                    <span className="text-emerald-400 font-bold">89%</span>
                </div>
                <button className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1">
                    {t('ดูรายละเอียด', 'View Details')}
                    <ChevronRight className="w-3 h-3" />
                </button>
            </div>
        </div>
    )
}

/**
 * Recent Orders Table - ตารางคำสั่งซื้อล่าสุด
 */
export function RecentOrdersTable({ orders }: { orders: RecentOrder[] }) {
    const { t } = useLanguage()

    const statusConfig: Record<string, { label: string, labelEn: string, color: string, bgColor: string, icon: React.ElementType }> = {
        pending: { label: 'รอชำระเงิน', labelEn: 'Pending', color: 'text-amber-400', bgColor: 'bg-amber-500/10', icon: Clock },
        paid: { label: 'รอจัดส่ง', labelEn: 'To Ship', color: 'text-blue-400', bgColor: 'bg-blue-500/10', icon: Package },
        shipping: { label: 'กำลังจัดส่ง', labelEn: 'Shipping', color: 'text-purple-400', bgColor: 'bg-purple-500/10', icon: Truck },
        completed: { label: 'สำเร็จ', labelEn: 'Completed', color: 'text-emerald-400', bgColor: 'bg-emerald-500/10', icon: CheckCircle },
        cancelled: { label: 'ยกเลิก', labelEn: 'Cancelled', color: 'text-red-400', bgColor: 'bg-red-500/10', icon: XCircle },
    }

    return (
        <div className="bg-surface-dark border border-white/5 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-lg text-white">
                    {t('คำสั่งซื้อล่าสุด', 'Recent Orders')}
                </h3>
                <Link href="/seller/orders" className="text-sm text-purple-400 hover:text-purple-300 flex items-center gap-1">
                    {t('ดูทั้งหมด', 'View All')}
                    <ChevronRight className="w-4 h-4" />
                </Link>
            </div>

            {orders.length === 0 ? (
                <div className="text-center py-8">
                    <Package className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                    <p className="text-gray-400">{t('ยังไม่มีคำสั่งซื้อ', 'No orders yet')}</p>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="text-left text-sm text-gray-500 border-b border-white/5">
                                <th className="pb-3 font-medium">{t('หมายเลข', 'Order ID')}</th>
                                <th className="pb-3 font-medium">{t('สินค้า', 'Product')}</th>
                                <th className="pb-3 font-medium">{t('ยอดรวม', 'Amount')}</th>
                                <th className="pb-3 font-medium">{t('สถานะ', 'Status')}</th>
                                <th className="pb-3 font-medium">{t('เวลา', 'Time')}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {orders.map((order) => {
                                const status = statusConfig[order.status] || statusConfig.pending
                                const StatusIcon = status.icon
                                return (
                                    <tr key={order.id} className="hover:bg-white/5 transition-colors">
                                        <td className="py-4">
                                            <span className="text-sm font-mono text-white">#{order.id.slice(-6)}</span>
                                        </td>
                                        <td className="py-4">
                                            <div>
                                                <p className="text-sm text-white line-clamp-1">{order.product}</p>
                                                <p className="text-xs text-gray-500">{order.customer}</p>
                                            </div>
                                        </td>
                                        <td className="py-4">
                                            <span className="text-sm font-bold text-white">฿{order.amount.toLocaleString()}</span>
                                        </td>
                                        <td className="py-4">
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${status.bgColor} ${status.color}`}>
                                                <StatusIcon className="w-3 h-3" />
                                                {t(status.label, status.labelEn)}
                                            </span>
                                        </td>
                                        <td className="py-4">
                                            <span className="text-xs text-gray-400">{order.date}</span>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    )
}

/**
 * Quick Actions Grid - ทางลัดด่วน
 */
export function QuickActionsGrid() {
    const { t } = useLanguage()

    const actions = [
        { icon: Package, label: t('เพิ่มสินค้า', 'Add Product'), href: '/sell', color: 'from-purple-500 to-indigo-500' },
        { icon: RefreshCw, label: t('อัพเดทสต็อก', 'Update Stock'), href: '/seller/products', color: 'from-emerald-500 to-teal-500' },
        { icon: BarChart3, label: t('ดูรายงาน', 'View Reports'), href: '/seller/reports', color: 'from-blue-500 to-cyan-500' },
        { icon: MessageCircle, label: t('ตอบแชท', 'Reply Chats'), href: '/chat', color: 'from-pink-500 to-rose-500' },
    ]

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {actions.map((action, index) => (
                <Link
                    key={index}
                    href={action.href}
                    className={`group relative p-4 rounded-xl bg-gradient-to-br ${action.color} hover:scale-[1.02] transition-all duration-300 overflow-hidden`}
                >
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="relative z-10 flex flex-col items-center gap-2 text-center">
                        <action.icon className="w-6 h-6 text-white" />
                        <span className="text-sm font-medium text-white">{action.label}</span>
                    </div>
                </Link>
            ))}
        </div>
    )
}
