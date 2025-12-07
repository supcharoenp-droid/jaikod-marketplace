/**
 * Admin Dashboard - Main Overview Page
 * Statistics, Charts, Recent Activities
 */
'use client'

import { useEffect, useState } from 'react'
import { useAdmin } from '@/contexts/AdminContext'
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
    Clock
} from 'lucide-react'

export default function AdminDashboard() {
    const { adminUser } = useAdmin()
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
            title: 'ผู้ใช้ทั้งหมด',
            value: stats.total_users.toLocaleString(),
            change: `+${stats.user_growth_rate}%`,
            trend: 'up',
            icon: Users,
            color: 'blue',
            subtitle: `ใหม่วันนี้: ${stats.new_users_today}`
        },
        {
            title: 'ผู้ขาย',
            value: stats.total_sellers.toLocaleString(),
            change: `+${stats.seller_growth_rate}%`,
            trend: 'up',
            icon: Store,
            color: 'green',
            subtitle: `ผู้ซื้อ: ${stats.total_buyers.toLocaleString()}`
        },
        {
            title: 'สินค้าทั้งหมด',
            value: stats.total_products.toLocaleString(),
            change: `รอตรวจ: ${stats.pending_review}`,
            trend: 'neutral',
            icon: Package,
            color: 'purple',
            subtitle: `ใช้งาน: ${stats.active_products.toLocaleString()}`
        },
        {
            title: 'คำสั่งซื้อ',
            value: stats.total_orders.toLocaleString(),
            change: `วันนี้: ${stats.orders_today}`,
            trend: 'up',
            icon: ShoppingCart,
            color: 'orange',
            subtitle: `รอดำเนินการ: ${stats.pending_orders}`
        },
        {
            title: 'GMV (ยอดขายรวม)',
            value: `฿${(stats.gmv / 1000000).toFixed(1)}M`,
            change: `+${stats.gmv_growth_rate}%`,
            trend: 'up',
            icon: TrendingUp,
            color: 'emerald',
            subtitle: 'เดือนนี้'
        },
        {
            title: 'รายได้แพลตฟอร์ม',
            value: `฿${(stats.platform_revenue / 1000).toFixed(0)}K`,
            change: 'ค่าธรรมเนียม',
            trend: 'up',
            icon: DollarSign,
            color: 'amber',
            subtitle: 'เดือนนี้'
        }
    ]

    const quickActions = [
        {
            title: 'รอตรวจสอบ KYC',
            count: 23,
            icon: Clock,
            color: 'yellow',
            link: '/admin/sellers/pending'
        },
        {
            title: 'สินค้าถูกรายงาน',
            count: 12,
            icon: AlertCircle,
            color: 'red',
            link: '/admin/products/reported'
        },
        {
            title: 'คำขอถอนเงิน',
            count: 45,
            icon: DollarSign,
            color: 'blue',
            link: '/admin/finance/withdrawals'
        },
        {
            title: 'ข้อพิพาท',
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
                        แดชบอร์ด
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">
                        ยินดีต้อนรับ, {adminUser?.displayName} 👋
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
                        ต้องดำเนินการ
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

                {/* Recent Activity Placeholder */}
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                        กิจกรรมล่าสุด
                    </h2>
                    <div className="space-y-4">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div
                                key={i}
                                className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50"
                            >
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
                                    {i}
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                                        กิจกรรมตัวอย่าง #{i}
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        {i} นาทีที่แล้ว
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
