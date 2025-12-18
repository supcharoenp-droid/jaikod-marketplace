'use client'

import React from 'react'
import {
    ShoppingBag,
    CreditCard,
    Users,
    TrendingUp,
    Package,
    AlertCircle,
    ChevronRight,
    Search,
    BarChart3
} from 'lucide-react'
import Button from '@/components/ui/Button'
import { useRouter } from 'next/navigation'

import { useAuth } from '@/contexts/AuthContext'
import { useLanguage } from '@/contexts/LanguageContext'
import { getSellerOrders } from '@/lib/orders'
import { getProductsBySeller } from '@/lib/products'
import { Order } from '@/types'

import ProductHealthWidget from '@/components/seller/ProductHealthWidget'
import AIActionCenter from '@/components/seller/AIActionCenter'

export default function SellerDashboard() {
    const router = useRouter()
    const { user, storeStatus } = useAuth()
    const { t } = useLanguage()
    const [sellerProfile, setSellerProfile] = React.useState<any>(null)
    const [isLoading, setIsLoading] = React.useState(true)
    const [recentOrders, setRecentOrders] = React.useState<Order[]>([])
    const [showSetupBanner, setShowSetupBanner] = React.useState(false)

    // Stats State
    const [stats, setStats] = React.useState({
        salesToday: 0,
        totalOrders: 0,
        views: 0,
        repurchaseRate: 0,
        ordersToShip: 0,
        outOfStock: 0,
        reviewsToReply: 0
    })

    React.useEffect(() => {
        const fetchDashboardData = async () => {
            if (!user) return

            try {
                // 1. Full Profile
                const { getSellerProfile } = await import('@/lib/seller')
                const profile = await getSellerProfile(user.uid)
                setSellerProfile(profile)

                if (profile && (!profile.description || !profile.location)) {
                    setShowSetupBanner(true)
                }

                // 2. Real Data
                const [ordersData, productsData] = await Promise.all([
                    getSellerOrders(user.uid),
                    getProductsBySeller(user.uid)
                ])

                const todayIndices = new Date().toDateString()
                let todaySales = 0
                let toShipCount = 0

                const sortedOrders = ordersData.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                setRecentOrders(sortedOrders.slice(0, 5))

                sortedOrders.forEach(order => {
                    const orderDate = new Date(order.created_at).toDateString()
                    if (orderDate === todayIndices && order.status !== 'cancelled') {
                        todaySales += order.net_total || 0
                    }
                    if (order.status === 'paid' || order.status === 'shipping') {
                        toShipCount++
                    }
                })

                let stockOutCount = 0
                let totalViews = 0
                productsData.forEach(p => {
                    if (p.stock <= 0) stockOutCount++
                    totalViews += (p.views_count || 0)
                })

                setStats({
                    salesToday: todaySales,
                    totalOrders: sortedOrders.length,
                    views: totalViews,
                    repurchaseRate: 0,
                    ordersToShip: toShipCount,
                    outOfStock: stockOutCount,
                    reviewsToReply: 0
                })

            } catch (error) {
                console.error('Error fetching dashboard data:', error)
            } finally {
                setIsLoading(false)
            }
        }

        fetchDashboardData()
    }, [user, router, storeStatus.hasStore])

    if (isLoading) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <div className="w-8 h-8 border-4 border-neon-purple border-t-transparent rounded-full animate-spin"></div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <p className="text-text-secondary dark:text-gray-400 text-sm mb-1">
                        {t('seller_dashboard.welcome')}, <span className="font-bold text-gray-900 dark:text-white">{sellerProfile?.shop_name}</span>
                    </p>
                    <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">{t('seller_dashboard.menu_dashboard')}</h1>
                </div>
                <div className="flex gap-3">
                    {sellerProfile?.shop_slug && (
                        <Button variant="outline" onClick={() => window.open(`/shop/${sellerProfile.shop_slug}`, '_blank')}>
                            <ShoppingBag className="w-4 h-4 mr-2" />
                            {t('seller_dashboard.view_shop')}
                        </Button>
                    )}
                    <Button variant="primary" onClick={() => router.push('/seller/products/create')} className="shadow-lg shadow-indigo-500/20">
                        <Package className="w-4 h-4 mr-2" />
                        {t('seller_dashboard.add_product')}
                    </Button>
                </div>
            </div>

            {/* Setup Banner (Conditional) */}
            {showSetupBanner && (
                <div className="bg-indigo-600 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-white shadow-xl shadow-indigo-500/10">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
                            <AlertCircle className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h3 className="font-bold text-lg">{t('seller_dashboard.setup_required_title')}</h3>
                            <p className="text-indigo-100 opacity-90">{t('seller_dashboard.setup_required_desc')}</p>
                        </div>
                    </div>
                    <Button onClick={() => router.push('/profile')} className="bg-white text-indigo-600 hover:bg-indigo-50 border-0 whitespace-nowrap">
                        {t('seller_dashboard.complete_setup')}
                    </Button>
                </div>
            )}

            {/* Top KPI Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <DashboardCard
                    title={t('seller_dashboard.stats_sales_today')}
                    value={`฿${stats.salesToday.toLocaleString()}`}
                    trend="+12%" // Mock
                    icon={CreditCard}
                    color="text-blue-500"
                    bg="bg-blue-500/10"
                />
                <DashboardCard
                    title={t('seller_dashboard.stats_total_orders')}
                    value={stats.totalOrders.toLocaleString()}
                    trend="+5"
                    icon={ShoppingBag}
                    color="text-emerald-500"
                    bg="bg-emerald-500/10"
                />
                <DashboardCard
                    title={t('seller_dashboard.stats_total_views')}
                    value={stats.views.toLocaleString()}
                    trend="+24%"
                    icon={Users}
                    color="text-purple-500"
                    bg="bg-purple-500/10"
                />
                <DashboardCard
                    title={t('seller_dashboard.stats_repurchase_rate')}
                    value="18%" // Mock
                    trend="+2%"
                    icon={TrendingUp}
                    color="text-amber-500"
                    bg="bg-amber-500/10"
                    isNegative={false}
                />
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Left Column (2/3) */}
                <div className="lg:col-span-2 space-y-6">

                    {/* Predictive Sales Chart */}
                    <PredictiveSalesWidget />

                    {/* Product Health & Tools */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <ProductHealthWidget />

                        {/* Quick Actions / Todo */}
                        <div className="bg-orange-50 dark:bg-orange-900/10 border border-orange-100 dark:border-orange-800/30 rounded-xl p-6">
                            <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                <AlertCircle className="w-5 h-5 text-orange-500" />
                                {t('seller_dashboard.todo_list')}
                            </h3>
                            <div className="space-y-3">
                                <QuickActionItem
                                    label={t('seller_dashboard.orders_to_ship')}
                                    count={stats.ordersToShip}
                                    isActive={stats.ordersToShip > 0}
                                    onClick={() => router.push('/seller/orders?status=paid')}
                                />
                                <QuickActionItem
                                    label={t('seller_dashboard.out_of_stock')}
                                    count={stats.outOfStock}
                                    isActive={stats.outOfStock > 0}
                                    onClick={() => router.push('/seller/products?filter=out_of_stock')}
                                />
                                <QuickActionItem
                                    label={t('seller_dashboard.reviews_to_reply')}
                                    count={stats.reviewsToReply}
                                    isActive={stats.reviewsToReply > 0}
                                    onClick={() => router.push('/seller/reviews')}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Recent Orders */}
                    <div className="bg-white dark:bg-surface-dark rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
                        <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
                            <h2 className="text-lg font-bold text-gray-900 dark:text-white">{t('seller_dashboard.recent_orders')}</h2>
                            <Button variant="outline" size="sm" onClick={() => router.push('/seller/orders')}>
                                {t('common.view_all')}
                            </Button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 dark:bg-gray-800/50 text-xs font-bold text-gray-500 uppercase tracking-wider">
                                    <tr>
                                        <th className="p-4">{t('seller_dashboard.order_id')}</th>
                                        <th className="p-4">{t('seller_dashboard.product')}</th>
                                        <th className="p-4">{t('seller_dashboard.status')}</th>
                                        <th className="p-4 text-right">{t('seller_dashboard.total')}</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                    {recentOrders.length > 0 ? (
                                        recentOrders.map(order => (
                                            <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors text-sm">
                                                <td className="p-4 font-bold text-indigo-600">#{order.order_number}</td>
                                                <td className="p-4 text-gray-700 dark:text-gray-300">
                                                    {order.items?.[0]?.product_title?.substring(0, 20)}...
                                                    {order.items.length > 1 && ` +${order.items.length - 1}`}
                                                </td>
                                                <td className="p-4">
                                                    <StatusBadge status={order.status} />
                                                </td>
                                                <td className="p-4 text-right font-bold text-gray-900 dark:text-white">
                                                    ฿{order.net_total?.toLocaleString()}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={4} className="p-8 text-center text-gray-400">
                                                {t('seller_dashboard.no_orders')}
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                </div>

                {/* Right Column (1/3) */}
                <div className="space-y-6">
                    {/* AI Action Center */}
                    <AIActionCenter />

                    {/* AI Advisor Banner (Vertical) */}
                    <div className="bg-gradient-to-br from-violet-600 to-indigo-700 rounded-xl p-6 text-white relative overflow-hidden">
                        <TrendingUp className="absolute bottom-0 right-0 w-32 h-32 opacity-10 translate-x-4 translate-y-4" />
                        <div className="relative z-10">
                            <div className="px-2 py-1 bg-white/20 backdrop-blur-sm rounded text-[10px] font-bold uppercase tracking-wider inline-block mb-3">
                                {t('seller_dashboard.ai_advisor_trend')}
                            </div>
                            <h3 className="font-bold text-lg mb-2">Vintage Cameras are HoT! 🔥</h3>
                            <p className="text-indigo-100 text-sm mb-4 leading-relaxed">
                                Demand is up 240%. You have stock that fits this trend.
                            </p>
                            <Button size="sm" className="w-full bg-white text-indigo-600 hover:bg-indigo-50 border-0">
                                {t('seller_dashboard.ai_advisor_action')}
                            </Button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}

// --- Sub Components ---

function PredictiveSalesWidget() {
    const { t } = useLanguage()
    // Mock Data for 7 days
    const data = [40, 65, 45, 80, 55, 90, 70]
    const max = Math.max(...data)

    return (
        <div className="bg-white dark:bg-surface-dark border border-gray-100 dark:border-gray-800 rounded-xl p-6 shadow-sm">
            <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-indigo-500" />
                    {t('seller_dashboard.predictive_sales_title')}
                </h3>
                <span className="text-sm font-bold text-indigo-600 bg-indigo-50 dark:bg-indigo-900/30 px-3 py-1 rounded-full">
                    {t('seller_dashboard.predictive_sales_forecast')}
                </span>
            </div>

            <div className="flex items-end justify-between h-32 gap-2">
                {data.map((h, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                        <div className="w-full relative h-full flex items-end">
                            <div
                                className="w-full bg-indigo-100 dark:bg-indigo-900/30 rounded-t-lg group-hover:bg-indigo-200 transition-colors relative"
                                style={{ height: `${(h / max) * 100}%` }}
                            >
                                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                    ฿{h}k
                                </div>
                            </div>
                        </div>
                        <span className="text-xs text-gray-400 font-medium">
                            {['M', 'T', 'W', 'T', 'F', 'S', 'S'][i]}
                        </span>
                    </div>
                ))}
            </div>

            <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-800 flex justify-between items-center text-sm">
                <span className="text-gray-500">{t('seller_dashboard.predictive_sales_revenue')}</span>
                <span className="text-xl font-black text-gray-900 dark:text-white">฿445,000</span>
            </div>
        </div>
    )
}

function DashboardCard({ title, value, trend, icon: Icon, color, bg, isNegative }: any) {
    return (
        <div className="bg-white dark:bg-surface-dark p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
                <div>
                    <p className="text-sm text-text-secondary dark:text-gray-400 mb-1 font-medium">{title}</p>
                    <h3 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">{value}</h3>
                </div>
                <div className={`p-3 rounded-xl ${bg} ${color}`}>
                    <Icon className="w-5 h-5" />
                </div>
            </div>
            <div className="flex items-center text-xs font-bold">
                <span className={`flex items-center ${isNegative ? 'text-red-500' : 'text-emerald-500'}`}>
                    {trend}
                </span>
                <span className="text-gray-400 ml-1 font-normal">vs yesterday</span>
            </div>
        </div>
    )
}

function QuickActionItem({ label, count, isActive, onClick }: any) {
    return (
        <button
            onClick={onClick}
            className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors group ${isActive ? 'bg-white shadow-sm hover:shadow dark:bg-gray-800' : 'hover:bg-white/50 dark:hover:bg-gray-800/50'}`}
        >
            <span className={`text-sm ${isActive ? 'text-orange-600 font-bold dark:text-orange-400' : 'text-gray-500'}`}>
                {label}
            </span>
            {count > 0 && (
                <span className="bg-orange-100 text-orange-600 text-xs font-bold px-2 py-0.5 rounded-full dark:bg-orange-900/50 dark:text-orange-400">
                    {count}
                </span>
            )}
        </button>
    )
}

function StatusBadge({ status }: { status: string }) {
    const { t } = useLanguage()
    const styles: any = {
        paid: 'bg-emerald-100 text-emerald-700',
        pending: 'bg-amber-100 text-amber-700',
        shipped: 'bg-blue-100 text-blue-700',
        cancelled: 'bg-red-100 text-red-700',
    }

    // Map backend status to locale keys
    const statusKeyMap: any = {
        paid: 'order_status_processing',
        pending: 'order_status_pending',
        shipping: 'order_status_shipped',
        shipped: 'order_status_shipped',
        completed: 'order_status_completed',
        cancelled: 'order_status_cancelled'
    }

    const simpleStatus = status.split('_')[0]
    return (
        <span className={`px-2 py-1 rounded-full text-xs font-bold ${styles[simpleStatus] || 'bg-gray-100 text-gray-600'}`}>
            {t(`common.${statusKeyMap[simpleStatus] || 'status_unknown'}`)}
        </span>
    )
}
