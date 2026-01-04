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
    Activity,
    XCircle
} from 'lucide-react'
import { fetchAIFlags, type AIFlag } from '@/lib/ai-admin'
import { getAdminDashboardStats } from '@/services/admin-dashboard'
import { getAdminLogs } from '@/lib/adminLogger'
import { getAIStrategicInsights, type AIInsight } from '@/lib/admin/ai-insight-service'
import { processAICommand, type CommandResult } from '@/lib/admin/ai-command-processor'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import { th, enUS } from 'date-fns/locale'
import { useRouter } from 'next/navigation'

export default function AdminDashboard() {
    const { adminUser } = useAdmin()
    const { language, t } = useLanguage()
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
    const [aiFlags, setAiFlags] = useState<AIFlag[]>([])
    const [recentLogs, setRecentLogs] = useState<any[]>([])
    const [aiInsights, setAiInsights] = useState<AIInsight[]>([])
    const [loading, setLoading] = useState(true)
    const [aiCommand, setAiCommand] = useState('')
    const [commandResult, setCommandResult] = useState<CommandResult | null>(null)
    const [executingCommand, setExecutingCommand] = useState(false)
    const router = useRouter()

    const handleExecuteCommand = async () => {
        if (!aiCommand.trim()) return
        setExecutingCommand(true)
        setCommandResult(null)
        try {
            const res = await processAICommand(aiCommand, language as any)
            setCommandResult(res)

            // Handle Auto-Actions
            if (res.action === 'NAVIGATE' && res.data) {
                setTimeout(() => router.push(res.data), 2000)
            }
        } catch (e) {
            console.error(e)
        } finally {
            setExecutingCommand(false)
        }
    }

    useEffect(() => {
        const loadDashboardData = async () => {
            try {
                const [dashboardStats, flags, logs, insights] = await Promise.all([
                    getAdminDashboardStats(),
                    fetchAIFlags(),
                    getAdminLogs(5),
                    getAIStrategicInsights(language as any)
                ])
                setStats(dashboardStats)
                setAiFlags(flags)
                setRecentLogs(logs)
                setAiInsights(insights)
            } catch (error) {
                console.error("Failed to load dashboard data", error)
            } finally {
                setLoading(false)
            }
        }
        loadDashboardData()
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
            count: stats.pending_kyc || 0,
            icon: Clock,
            color: 'yellow',
            link: '/admin/sellers'
        },
        {
            title: t('admin.reported_products'),
            count: stats.reported_products || 0,
            icon: AlertCircle,
            color: 'red',
            link: '/admin/moderation'
        },
        {
            title: t('admin.withdrawal_requests'),
            count: stats.pending_withdrawal_requests || 0,
            icon: DollarSign,
            color: 'blue',
            link: '/admin/finance'
        },
        {
            title: t('admin.disputes'),
            count: stats.disputes_count || 0,
            icon: AlertCircle,
            color: 'orange',
            link: '/admin/orders'
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

                {/* AI Command Bar - The "Level AI" feature */}
                <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                    <div className="relative bg-white dark:bg-gray-900 ring-1 ring-gray-900/5 rounded-2xl p-4 flex items-center gap-4">
                        <div className="bg-purple-100 dark:bg-purple-900/50 p-2 rounded-xl">
                            <Zap className="w-6 h-6 text-purple-600 animate-pulse" />
                        </div>
                        <input
                            type="text"
                            placeholder={t('admin.ai_command_placeholder')}
                            className="bg-transparent border-none focus:ring-0 flex-1 text-lg font-medium text-gray-900 dark:text-white"
                            value={aiCommand}
                            onChange={(e) => setAiCommand(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleExecuteCommand()}
                        />
                        <button
                            onClick={handleExecuteCommand}
                            disabled={executingCommand}
                            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-xl font-bold shadow-lg hover:shadow-purple-500/30 transition-all disabled:opacity-50"
                        >
                            {executingCommand ? t('admin.ai_thinking') : `${t('admin.ai_execute')} →`}
                        </button>
                    </div>

                    {/* Command Result Overlay */}
                    {commandResult && (
                        <div className="absolute top-full mt-2 left-0 right-0 z-50 animate-in fade-in slide-in-from-top-2">
                            <div className={`p-4 rounded-2xl shadow-2xl border ${commandResult.success ? 'bg-indigo-900 text-white border-indigo-500' : 'bg-red-900 text-white border-red-500'}`}>
                                <div className="flex items-start gap-3">
                                    <div className="p-2 bg-white/10 rounded-lg">
                                        {commandResult.success ? <CheckCircle className="w-5 h-5 text-green-400" /> : <AlertCircle className="w-5 h-5 text-red-400" />}
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-medium text-indigo-100">{commandResult.message}</p>
                                        {commandResult.suggestions && (
                                            <div className="mt-3 flex gap-2">
                                                {commandResult.suggestions.map((s, i) => (
                                                    <button key={i} onClick={() => setAiCommand(s)} className="text-[10px] bg-white/5 hover:bg-white/10 border border-white/10 px-2 py-1 rounded">
                                                        {s}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                    <button onClick={() => setCommandResult(null)}><XCircle className="w-5 h-5 text-indigo-300" /></button>
                                </div>
                            </div>
                        </div>
                    )}
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
                    <div className="lg:col-span-2 space-y-6">
                        {/* Risk Alerts */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                    <ShieldAlert className="w-6 h-6 text-red-500" />
                                    {t('admin.risk_monitoring') || 'Security & Fraud Alerts'}
                                </h2>
                                <Link href="/admin/ai-features" className="text-sm text-purple-600 hover:text-purple-700 font-medium">
                                    {t('admin.view_all')} &rarr;
                                </Link>
                            </div>

                            <div className="space-y-4">
                                {aiFlags.length === 0 && (
                                    <div className="p-4 text-center text-gray-500 text-sm italic">
                                        {t('admin.no_ai_alerts')}
                                    </div>
                                )}
                                {aiFlags.map((alert, i) => (
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
                                                        {alert.reason}
                                                    </h3>
                                                    <p className="text-xs text-gray-500 mt-1">
                                                        {t('admin.user')}: <span className="font-medium text-purple-600">{alert.userName}</span>
                                                    </p>
                                                </div>
                                                <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${alert.riskLevel === 'critical' ? 'bg-red-100 text-red-700' :
                                                    alert.riskLevel === 'high' ? 'bg-orange-100 text-orange-700' :
                                                        'bg-blue-100 text-blue-700'
                                                    }`}>
                                                    {alert.riskLevel}
                                                </span>
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

                        {/* AI Strategic Insights (Level World Class) */}
                        <div className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 rounded-2xl p-6 border border-purple-200 dark:border-purple-900/30">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                                <Activity className="w-6 h-6 text-purple-600" />
                                {t('admin.ai_strategic_insights') || 'AI Strategic Business Insights'}
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {aiInsights.map((insight) => (
                                    <div key={insight.id} className="p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 hover:border-purple-400 transition-colors cursor-pointer group">
                                        <div className="flex justify-between items-start mb-2">
                                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-tighter ${insight.type === 'opportunity' ? 'bg-green-100 text-green-700' :
                                                insight.type === 'risk' ? 'bg-red-100 text-red-700' :
                                                    'bg-blue-100 text-blue-700'
                                                }`}>
                                                {insight.type}
                                            </span>
                                            <span className="text-xs font-bold text-gray-400 group-hover:text-purple-500">{t('admin.score')}: {insight.score}</span>
                                        </div>
                                        <h4 className="font-bold text-gray-900 dark:text-white text-sm mb-1">{insight.title}</h4>
                                        <p className="text-xs text-gray-500 leading-relaxed">{insight.content}</p>
                                    </div>
                                ))}
                            </div>
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
                                        <span className="font-bold">{t('admin.ai_active')}</span>
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
                        {recentLogs.length === 0 && (
                            <div className="p-8 text-center text-gray-400 text-sm">{t('admin.no_recent_activity')}</div>
                        )}
                        {recentLogs.map((log) => (
                            <div
                                key={log.id}
                                className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                            >
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold bg-gradient-to-br ${log.action.includes('BAN') ? 'from-red-500 to-pink-500' :
                                    log.action.includes('PRODUCT') ? 'from-blue-500 to-cyan-500' :
                                        'from-purple-500 to-indigo-500'
                                    }`}>
                                    {log.adminName?.[0] || 'A'}
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                                        <span className="font-bold">{log.adminName}</span> {log.action.toLowerCase().replace(/_/g, ' ')} <span className="text-purple-600">{log.target}</span>
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        {log.details} • {formatDistanceToNow(log.timestamp, { addSuffix: true, locale: language === 'th' ? th : enUS })}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <span className="text-[10px] font-mono text-gray-400 bg-gray-100 dark:bg-gray-900 px-1.5 py-0.5 rounded">{log.ip}</span>
                                    <div className="mt-1">
                                        <CheckCircle className="w-4 h-4 text-green-500 ml-auto" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </AdminLayout>
    )
}
