/**
 * Admin Dashboard - Main Overview Page
 * Statistics, Charts, Recent Activities
 */
'use client'

import { useEffect, useState } from 'react'
import { useAdmin } from '@/contexts/AdminContext'
import { useLanguage } from '@/contexts/LanguageContext'
import AdminLayout from '@/components/admin/AdminLayout'
import { AdminStats } from '@/types/admin'
import {
    Users,
    Store,
    Package,
    ShoppingCart,
    TrendingUp,
    TrendingDown,
    DollarSign,
    AlertCircle,
    CheckCircle,
    Clock,
    Zap,
    ShieldAlert,
    Activity
} from 'lucide-react'
import { mockAIDetection } from '@/lib/ai-admin'
import Link from 'next/link'

export default function AdminDashboard() {
    const { adminUser } = useAdmin()
    const { t } = useLanguage()
    const [stats, setStats] = useState<AdminStats>({
        total_users: 0,
        total_buyers: 0,
        total_sellers: 0,
        new_users_today: 0,
        total_products: 0,
        active_products: 0,
        pending_review: 0,
        suspended_products: 0,
        total_orders: 0,
        orders_today: 0,
        pending_orders: 0,
        completed_orders: 0,
        gmv: 0,
        platform_revenue: 0,
        pending_withdrawals: 0,
        user_growth_rate: 0,
        seller_growth_rate: 0,
        gmv_growth_rate: 0
    })
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // Fetch stats from API
        // For now, using mock data
        setTimeout(() => {
            setStats({
                total_users: 15234,
                total_buyers: 12456,
                total_sellers: 2778,
                new_users_today: 127,
                total_products: 45678,
                active_products: 42341,
                pending_review: 234,
                suspended_products: 103,
                total_orders: 8934,
                orders_today: 156,
                pending_orders: 89,
                completed_orders: 7823,
                gmv: 12456789,
                platform_revenue: 623456,
                pending_withdrawals: 234567,
                user_growth_rate: 12.5,
                seller_growth_rate: 8.3,
                gmv_growth_rate: 15.7
            })
            setLoading(false)
        }, 500)
    }, [])

    const statCards = [
        {
            title: t('admin.total_users'),
            value: stats.total_users.toLocaleString(),
            change: `+${stats.user_growth_rate}%`,
            trend: 'up',
            icon: Users,
            color: 'blue',
            subtitle: `${t('admin.new_today')}: ${stats.new_users_today}`
        },
        {
            title: t('admin.sellers'),
            value: stats.total_sellers.toLocaleString(),
            change: `+${stats.seller_growth_rate}%`,
            trend: 'up',
            icon: Store,
            color: 'green',
            subtitle: `${t('admin.buyers')}: ${stats.total_buyers.toLocaleString()}`
        },
        {
            title: t('admin.total_products'),
            value: stats.total_products.toLocaleString(),
            change: `${t('admin.pending_review')}: ${stats.pending_review}`,
            trend: 'neutral',
            icon: Package,
            color: 'purple',
            subtitle: `${t('admin.active')}: ${stats.active_products.toLocaleString()}`
        },
        {
            title: t('admin.orders'),
            value: stats.total_orders.toLocaleString(),
            change: `${t('admin.today')}: ${stats.orders_today}`,
            trend: 'up',
            icon: ShoppingCart,
            color: 'orange',
            subtitle: `${t('admin.pending')}: ${stats.pending_orders}`
        },
        {
            title: t('admin.gmv_total_sales'),
            value: `฿${(stats.gmv / 1000000).toFixed(1)}M`,
            change: `+${stats.gmv_growth_rate}%`,
            trend: 'up',
            icon: TrendingUp,
            color: 'emerald',
            subtitle: t('admin.this_month')
        },
        {
            title: t('admin.platform_revenue'),
            value: `฿${(stats.platform_revenue / 1000).toFixed(0)}K`,
            change: t('admin.commission'),
            trend: 'up',
            icon: DollarSign,
            color: 'amber',
            subtitle: t('admin.this_month')
        }
    ]

    const quickActions = [
        {
            title: t('admin.pending_kyc'),
            count: 23,
            icon: Clock,
            color: 'yellow',
            link: '/admin/sellers/pending'
        },
        {
            title: t('admin.reported_products'),
            count: 12,
            icon: AlertCircle,
            color: 'red',
            link: '/admin/products/reported'
        },
        {
            title: t('admin.withdrawal_requests'),
            count: 45,
            icon: DollarSign,
            color: 'blue',
            link: '/admin/finance/withdrawals'
        },
        {
            title: t('admin.disputes'),
            count: 8,
            icon: AlertCircle,
            color: 'orange',
            link: '/admin/orders/disputes'
        }
    ]

    if (loading) {
        return (
            <AdminLayout>
                <div className="flex items-center justify-center h-96">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
                </div>
            </AdminLayout>
        )
    }

    return (
        <AdminLayout>
            <div className="space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                        {t('admin.dashboard')}
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">
                        {t('admin.welcome')}, {adminUser?.displayName} 👋
                    </p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {statCards.map((card, index) => {
                        const Icon = card.icon
                        return (
                            <div
                                key={index}
                                className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow"
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                                            {card.title}
                                        </p>
                                        <p className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                                            {card.value}
                                        </p>
                                        <div className="flex items-center gap-2">
                                            <span
                                                className={`text-sm font-medium ${card.trend === 'up'
                                                    ? 'text-green-600'
                                                    : card.trend === 'down'
                                                        ? 'text-red-600'
                                                        : 'text-gray-600'
                                                    }`}
                                            >
                                                {card.change}
                                            </span>
                                            <span className="text-xs text-gray-400">
                                                {card.subtitle}
                                            </span>
                                        </div>
                                    </div>
                                    <div
                                        className={`p-3 rounded-lg bg-${card.color}-50 dark:bg-${card.color}-900/20`}
                                    >
                                        <Icon className={`w-6 h-6 text-${card.color}-600`} />
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>

                {/* Quick Actions */}
                <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                        {t('admin.action_required')}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {quickActions.map((action, index) => {
                            const Icon = action.icon
                            return (
                                <a
                                    key={index}
                                    href={action.link}
                                    className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all hover:scale-105"
                                >
                                    <div className="flex items-center justify-between mb-3">
                                        <Icon className={`w-5 h-5 text-${action.color}-600`} />
                                        <span
                                            className={`px-3 py-1 rounded-full text-sm font-bold bg-${action.color}-100 dark:bg-${action.color}-900/30 text-${action.color}-700 dark:text-${action.color}-400`}
                                        >
                                            {action.count}
                                        </span>
                                    </div>
                                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                        {action.title}
                                    </p>
                                </a>
                            )
                        })}
                    </div>
                </div>

                {/* AI & System Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left: AI Alerts */}
                    <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                <Zap className="w-6 h-6 text-yellow-500" />
                                {t('admin.ai_control_center')}
                            </h2>
                            <Link href="/admin/ai-features" className="text-sm text-purple-600 hover:text-purple-700 font-medium">
                                {t('admin.view_all')} &rarr;
                            </Link>
                        </div>

                        <div className="space-y-4">
                            {mockAIDetection.map((alert, i) => (
                                <div key={i} className="flex items-start gap-4 p-4 rounded-xl bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-800">
                                    <div className={`p-2 rounded-lg ${alert.riskLevel === 'critical' ? 'bg-red-100 text-red-600' :
                                        alert.riskLevel === 'high' ? 'bg-orange-100 text-orange-600' :
                                            'bg-blue-100 text-blue-600'
                                        }`}>
                                        <ShieldAlert className="w-6 h-6" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="font-bold text-gray-900 dark:text-white text-sm">
                                                    {t(`admin.${alert.reason}`) || alert.reason}
                                                </h3>
                                                <p className="text-xs text-gray-500 mt-1">
                                                    {t('admin.user')}: <span className="font-medium text-purple-600">{alert.userName}</span>
                                                </p>
                                            </div>
                                            <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${alert.riskLevel === 'critical' ? 'bg-red-100 text-red-700' :
                                                alert.riskLevel === 'high' ? 'bg-orange-100 text-orange-700' :
                                                    'bg-blue-100 text-blue-700'
                                                }`}>
                                                {t(`admin.risk_${alert.riskLevel}`) || alert.riskLevel}
                                            </span>
                                        </div>
                                        <div className="mt-3 flex gap-2">
                                            <button className="px-3 py-1 bg-white border border-gray-200 rounded-lg text-xs font-medium hover:bg-gray-50 shadow-sm">
                                                {t('admin.review')}
                                            </button>
                                            <button className="px-3 py-1 bg-red-600 text-white rounded-lg text-xs font-medium hover:bg-red-700 shadow-sm">
                                                {t('admin.suspend_immediately')}
                                            </button>
                                        </div>
                                    </div>
                                    <div className="text-center px-2">
                                        <div className="text-2xl font-bold text-gray-900 dark:text-white">{alert.score}</div>
                                        <div className="text-[10px] text-gray-400 uppercase">{t('admin.score')}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right: Support & System Health */}
                    <div className="space-y-6">
                        {/* Support Report */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
                            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                <Activity className="w-5 h-5 text-blue-500" />
                                {t('admin.top_issues')}
                            </h2>
                            <div className="col-span-1">
                                <ul className="space-y-3">
                                    <li className="flex justify-between items-center text-sm">
                                        <span className="text-gray-600">{t('admin.payment_issues')}</span>
                                        <span className="font-bold text-red-500">42 {t('admin.cases')}</span>
                                    </li>
                                    <li className="flex justify-between items-center text-sm">
                                        <span className="text-gray-600">{t('admin.kyc_failed')}</span>
                                        <span className="font-bold text-orange-500">28 {t('admin.cases')}</span>
                                    </li>
                                    <li className="flex justify-between items-center text-sm">
                                        <span className="text-gray-600">{t('admin.counterfeit_reports')}</span>
                                        <span className="font-bold text-yellow-500">15 {t('admin.cases')}</span>
                                    </li>
                                    <li className="flex justify-between items-center text-sm">
                                        <span className="text-gray-600">{t('admin.refund_requests')}</span>
                                        <span className="font-bold text-gray-700">9 {t('admin.cases')}</span>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* System Health */}
                        <div className="bg-gradient-to-br from-purple-900 to-indigo-900 rounded-xl p-6 text-white shadow-lg">
                            <h2 className="font-bold mb-4 flex items-center gap-2">
                                <Activity className="w-5 h-5" />
                                {t('admin.system_health')}
                            </h2>
                            <div className="space-y-4">
                                <div>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-purple-200">{t('admin.server_load')}</span>
                                        <span className="font-bold">24%</span>
                                    </div>
                                    <div className="h-2 bg-purple-900/50 rounded-full overflow-hidden">
                                        <div className="h-full bg-green-400 w-[24%]"></div>
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-purple-200">{t('admin.database_latency')}</span>
                                        <span className="font-bold">12ms</span>
                                    </div>
                                    <div className="h-2 bg-purple-900/50 rounded-full overflow-hidden">
                                        <div className="h-full bg-blue-400 w-[10%]"></div>
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-purple-200">{t('admin.ai_processing')}</span>
                                        <span className="font-bold">Active</span>
                                    </div>
                                    <div className="flex gap-1 mt-1">
                                        <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                                        <span className="text-xs text-purple-200">{t('admin.online_monitoring')}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recent Activity Placeholder */}
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                        {t('admin.recent_activity')}
                    </h2>
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div
                                key={i}
                                className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50"
                            >
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
                                    A
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                                        {t('admin.admin_reviewed_product')} #8823{i}
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        {i * 15} {t('admin.minutes_ago')}
                                    </p>
                                </div>
                                <CheckCircle className="w-5 h-5 text-green-500" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </AdminLayout>
    )
}
