'use client'

import React from 'react'
import {
    Package,
    MessageCircle,
    Star,
    AlertCircle,
    ShoppingBag,
    Eye,
    ShoppingCart,
    Percent,
    Sparkles,
    Settings,
    Plus
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { useLanguage } from '@/contexts/LanguageContext'
import { getSellerOrders } from '@/lib/orders'
import { getProductsBySeller } from '@/lib/products'
import { Order } from '@/types'

// Dashboard Components
import {
    ActionRequiredSection,
    AIBusinessInsights,
    KPIStatsCards,
    PredictiveSalesChart,
    RecentOrdersTable,
    QuickActionsGrid
} from '@/components/seller/dashboard/DashboardComponents'

// Existing Components
import SellerOnboarding from '@/components/seller/SellerOnboarding'
import AIActionCenter from '@/components/seller/AIActionCenter'
import ProductHealthWidget from '@/components/seller/ProductHealthWidget'

export default function SellerDashboardV2() {
    const router = useRouter()
    const { user, storeStatus } = useAuth()
    const { t, language } = useLanguage()

    // States
    const [isLoading, setIsLoading] = React.useState(true)
    const [sellerProfile, setSellerProfile] = React.useState<any>(null)
    const [recentOrders, setRecentOrders] = React.useState<any[]>([])
    const [stats, setStats] = React.useState({
        salesToday: 0,
        salesTrend: 0,
        totalOrders: 0,
        ordersTrend: 0,
        views: 0,
        viewsTrend: 0,
        conversionRate: 0,
        conversionTrend: 0,
        ordersToShip: 0,
        pendingChats: 0,
        reviewsToReply: 0,
        outOfStock: 0
    })

    // Fetch dashboard data
    React.useEffect(() => {
        const fetchDashboardData = async () => {
            if (!user) return
            setIsLoading(true)

            try {
                // Get seller profile
                const { getSellerProfile } = await import('@/lib/seller')
                const profile = await getSellerProfile(user.uid)
                setSellerProfile(profile)

                // Get orders and products
                const [ordersData, productsData] = await Promise.all([
                    getSellerOrders(user.uid),
                    getProductsBySeller(user.uid)
                ])

                // Calculate today's sales
                const todayStr = new Date().toDateString()
                let todaySales = 0
                let toShipCount = 0

                const sortedOrders = ordersData.sort((a, b) =>
                    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
                )

                // Format recent orders for table
                const formattedOrders = sortedOrders.slice(0, 5).map(order => ({
                    id: order.id,
                    customer: order.shipping_address?.name || 'ลูกค้า',
                    product: order.items?.[0]?.title || 'สินค้า',
                    amount: order.net_total || 0,
                    status: order.status as any,
                    date: formatTimeAgo(order.created_at)
                }))
                setRecentOrders(formattedOrders)

                sortedOrders.forEach(order => {
                    const orderDate = new Date(order.created_at).toDateString()
                    if (orderDate === todayStr && order.status !== 'cancelled') {
                        todaySales += order.net_total || 0
                    }
                    if (order.status === 'paid') {
                        toShipCount++
                    }
                })

                // Calculate product stats
                let stockOutCount = 0
                let totalViews = 0
                productsData.forEach(p => {
                    if (p.stock <= 0) stockOutCount++
                    totalViews += (p.views_count || 0)
                })

                // Calculate conversion rate
                const conversionRate = totalViews > 0
                    ? ((sortedOrders.length / totalViews) * 100).toFixed(1)
                    : 0

                setStats({
                    salesToday: todaySales,
                    salesTrend: Math.floor(Math.random() * 30) - 10, // Mock trend
                    totalOrders: sortedOrders.length,
                    ordersTrend: Math.floor(Math.random() * 20) - 5,
                    views: totalViews,
                    viewsTrend: Math.floor(Math.random() * 15) - 5,
                    conversionRate: parseFloat(conversionRate as string) || 0,
                    conversionTrend: Math.floor(Math.random() * 10) - 3,
                    ordersToShip: toShipCount,
                    pendingChats: Math.floor(Math.random() * 15), // Mock
                    reviewsToReply: Math.floor(Math.random() * 5), // Mock
                    outOfStock: stockOutCount
                })

            } catch (error) {
                console.error('Error fetching dashboard:', error)
            } finally {
                setIsLoading(false)
            }
        }

        fetchDashboardData()
    }, [user])

    // Format time ago
    function formatTimeAgo(dateStr: string): string {
        const date = new Date(dateStr)
        const now = new Date()
        const diffMs = now.getTime() - date.getTime()
        const diffMins = Math.floor(diffMs / 60000)
        const diffHours = Math.floor(diffMins / 60)
        const diffDays = Math.floor(diffHours / 24)

        if (diffMins < 60) return `${diffMins} ${t('นาทีที่แล้ว', 'mins ago')}`
        if (diffHours < 24) return `${diffHours} ${t('ชั่วโมงที่แล้ว', 'hours ago')}`
        return `${diffDays} ${t('วันที่แล้ว', 'days ago')}`
    }

    // Prepare action items
    const actionItems = [
        {
            id: 'orders',
            icon: Package,
            label: t('คำสั่งซื้อรอจัดส่ง', 'Orders to Ship'),
            count: stats.ordersToShip,
            color: 'text-blue-400',
            bgColor: 'bg-blue-500/10',
            link: '/seller/orders?status=paid',
            urgent: stats.ordersToShip > 3
        },
        {
            id: 'chats',
            icon: MessageCircle,
            label: t('แชทยังไม่ได้ตอบ', 'Pending Chats'),
            count: stats.pendingChats,
            color: 'text-pink-400',
            bgColor: 'bg-pink-500/10',
            link: '/chat',
            urgent: stats.pendingChats > 5
        },
        {
            id: 'reviews',
            icon: Star,
            label: t('รีวิวรอตอบกลับ', 'Reviews to Reply'),
            count: stats.reviewsToReply,
            color: 'text-amber-400',
            bgColor: 'bg-amber-500/10',
            link: '/seller/reviews'
        },
        {
            id: 'stock',
            icon: AlertCircle,
            label: t('สินค้าหมดสต็อก', 'Out of Stock'),
            count: stats.outOfStock,
            color: 'text-red-400',
            bgColor: 'bg-red-500/10',
            link: '/seller/products?filter=out-of-stock',
            urgent: stats.outOfStock > 0
        }
    ]

    // Prepare KPI data
    const kpiStats = [
        {
            label: t('ยอดขายวันนี้', 'Sales Today'),
            value: `฿${stats.salesToday.toLocaleString()}`,
            trend: stats.salesTrend,
            trendLabel: t('เทียบกับเมื่อวาน', 'vs yesterday'),
            icon: ShoppingBag,
            color: 'text-emerald-400',
            bgColor: 'bg-emerald-500/10'
        },
        {
            label: t('คำสั่งซื้อทั้งหมด', 'Total Orders'),
            value: stats.totalOrders,
            trend: stats.ordersTrend,
            trendLabel: t('เทียบกับเมื่อวาน', 'vs yesterday'),
            icon: ShoppingCart,
            color: 'text-blue-400',
            bgColor: 'bg-blue-500/10'
        },
        {
            label: t('ยอดเข้าชม', 'Total Views'),
            value: stats.views.toLocaleString(),
            trend: stats.viewsTrend,
            trendLabel: t('เทียบกับเมื่อวาน', 'vs yesterday'),
            icon: Eye,
            color: 'text-purple-400',
            bgColor: 'bg-purple-500/10'
        },
        {
            label: t('อัตราแปลง', 'Conversion Rate'),
            value: `${stats.conversionRate}%`,
            trend: stats.conversionTrend,
            trendLabel: t('เทียบกับเมื่อวาน', 'vs yesterday'),
            icon: Percent,
            color: 'text-pink-400',
            bgColor: 'bg-pink-500/10'
        }
    ]

    // Prepare prediction data (mock)
    const predictionData = [
        { day: t('จ.', 'Mon'), predicted: 15000, actual: 14500 },
        { day: t('อ.', 'Tue'), predicted: 18000, actual: 19200 },
        { day: t('พ.', 'Wed'), predicted: 22000, actual: 21000 },
        { day: t('พฤ.', 'Thu'), predicted: 20000 },
        { day: t('ศ.', 'Fri'), predicted: 25000 },
        { day: t('ส.', 'Sat'), predicted: 30000 },
        { day: t('อา.', 'Sun'), predicted: 28000 },
    ]

    // Loading state
    if (isLoading) {
        return (
            <div className="min-h-screen bg-background-dark flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-gray-400">{t('กำลังโหลดแดชบอร์ด...', 'Loading dashboard...')}</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background-dark">
            {/* Header */}
            <div className="mb-8">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-black text-white flex items-center gap-3">
                            <span className="text-3xl">👋</span>
                            {t('สวัสดี', 'Hello')}, {sellerProfile?.shop_name || user?.displayName || 'Seller'}!
                        </h1>
                        <p className="text-gray-400 mt-1">
                            {t('นี่คือสรุปธุรกิจร้านคุณวันนี้', 'Here\'s your business summary for today')}
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Link
                            href="/sell"
                            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl font-medium transition-all duration-300 shadow-lg shadow-purple-500/25"
                        >
                            <Plus className="w-5 h-5" />
                            {t('เพิ่มสินค้า', 'Add Product')}
                        </Link>
                        <Link
                            href="/seller/settings"
                            className="p-2.5 bg-surface-dark border border-white/5 hover:border-white/10 rounded-xl transition-colors"
                        >
                            <Settings className="w-5 h-5 text-gray-400" />
                        </Link>
                    </div>
                </div>
            </div>

            {/* Onboarding for new sellers */}
            {!storeStatus?.hasStore && (
                <div className="mb-8">
                    <SellerOnboarding
                        shopName={sellerProfile?.shop_name}
                        hasAddress={!!sellerProfile?.address}
                        hasBankAccount={!!sellerProfile?.bank_account}
                        hasProducts={stats.totalOrders > 0}
                    />
                </div>
            )}

            {/* Action Required */}
            <div className="mb-8">
                <ActionRequiredSection items={actionItems} />
            </div>

            {/* AI Insights + Quick Actions */}
            <div className="grid lg:grid-cols-3 gap-6 mb-8">
                <div className="lg:col-span-2">
                    <AIBusinessInsights
                        insight={null}
                        isLoading={false}
                    />
                </div>
                <div className="space-y-4">
                    <h3 className="font-bold text-white flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-purple-400" />
                        {t('ทางลัดด่วน', 'Quick Actions')}
                    </h3>
                    <QuickActionsGrid />
                </div>
            </div>

            {/* KPI Stats */}
            <div className="mb-8">
                <KPIStatsCards stats={kpiStats} />
            </div>

            {/* Charts & Tables Row */}
            <div className="grid lg:grid-cols-2 gap-6 mb-8">
                {/* Predictive Sales Chart */}
                <PredictiveSalesChart
                    data={predictionData}
                    expectedRevenue={158000}
                />

                {/* Product Health Widget */}
                <div className="bg-surface-dark border border-white/5 rounded-2xl p-6">
                    <ProductHealthWidget />
                </div>
            </div>

            {/* Recent Orders + AI Action Center */}
            <div className="grid lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <RecentOrdersTable orders={recentOrders} />
                </div>
                <div>
                    <AIActionCenter />
                </div>
            </div>
        </div>
    )
}
