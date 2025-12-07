/**
 * Test Admin Dashboard (No Auth Required)
 */
'use client'

import Link from 'next/link'
import {
    Users,
    Store,
    Package,
    ShoppingCart,
    TrendingUp,
    DollarSign,
    Clock,
    CheckCircle,
    AlertTriangle,
    Menu,
    X
} from 'lucide-react'
import { useState } from 'react'

export default function TestAdminDashboard() {
    const [sidebarOpen, setSidebarOpen] = useState(true)

    const stats = {
        total_users: 15234,
        new_users_today: 127,
        total_sellers: 2778,
        total_products: 45678,
        pending_review: 234,
        total_orders: 8934,
        orders_today: 156,
        gmv: 12456789,
        platform_revenue: 623456,
        user_growth_rate: 12.5,
        seller_growth_rate: 8.3,
        gmv_growth_rate: 15.7
    }

    const statCards = [
        {
            title: 'ผู้ใช้ทั้งหมด',
            value: stats.total_users.toLocaleString(),
            change: `+${stats.user_growth_rate}%`,
            icon: Users,
            color: 'blue',
            subtitle: `ใหม่วันนี้: ${stats.new_users_today}`
        },
        {
            title: 'ผู้ขาย',
            value: stats.total_sellers.toLocaleString(),
            change: `+${stats.seller_growth_rate}%`,
            icon: Store,
            color: 'green',
            subtitle: 'ร้านค้าทั้งหมด'
        },
        {
            title: 'สินค้าทั้งหมด',
            value: stats.total_products.toLocaleString(),
            change: `รอตรวจ: ${stats.pending_review}`,
            icon: Package,
            color: 'purple',
            subtitle: 'รายการสินค้า'
        },
        {
            title: 'คำสั่งซื้อ',
            value: stats.total_orders.toLocaleString(),
            change: `วันนี้: ${stats.orders_today}`,
            icon: ShoppingCart,
            color: 'orange',
            subtitle: 'ออเดอร์ทั้งหมด'
        },
        {
            title: 'GMV (ยอดขายรวม)',
            value: `฿${(stats.gmv / 1000000).toFixed(1)}M`,
            change: `+${stats.gmv_growth_rate}%`,
            icon: TrendingUp,
            color: 'emerald',
            subtitle: 'เดือนนี้'
        },
        {
            title: 'รายได้แพลตฟอร์ม',
            value: `฿${(stats.platform_revenue / 1000).toFixed(0)}K`,
            change: 'ค่าธรรมเนียม',
            icon: DollarSign,
            color: 'amber',
            subtitle: 'เดือนนี้'
        }
    ]

    const quickActions = [
        { title: 'รอตรวจสอบ KYC', count: 23, icon: Clock, color: 'yellow' },
        { title: 'สินค้าถูกรายงาน', count: 12, icon: AlertTriangle, color: 'red' },
        { title: 'คำขอถอนเงิน', count: 45, icon: DollarSign, color: 'blue' },
        { title: 'ข้อพิพาท', count: 8, icon: AlertTriangle, color: 'orange' }
    ]

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Test Mode Banner */}
            <div className="bg-yellow-500 text-white px-4 py-2 text-center text-sm font-medium">
                ⚠️ TEST MODE - UI Preview Only (No Authentication Required)
            </div>

            {/* Sidebar */}
            <aside className={`fixed top-0 left-0 z-40 h-screen transition-transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                } w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 mt-10`}>
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                    <Link href="/test-admin" className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-white font-bold">
                            J
                        </div>
                        <span className="font-bold text-lg">JaiKod Admin</span>
                    </Link>
                </div>

                <nav className="p-4 space-y-2">
                    <Link href="/test-admin/dashboard" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400">
                        <TrendingUp className="w-5 h-5" />
                        <span>แดชบอร์ด</span>
                    </Link>
                    <Link href="/test-admin/users" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                        <Users className="w-5 h-5" />
                        <span>จัดการผู้ใช้</span>
                    </Link>
                    <Link href="/test-admin/sellers" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                        <Store className="w-5 h-5" />
                        <span>จัดการผู้ขาย</span>
                    </Link>
                    <Link href="/test-admin/products" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                        <Package className="w-5 h-5" />
                        <span>จัดการสินค้า</span>
                    </Link>
                </nav>
            </aside>

            {/* Main Content */}
            <div className={`${sidebarOpen ? 'ml-64' : 'ml-0'} transition-all mt-10`}>
                {/* Header */}
                <header className="h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-6">
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                        {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>
                    <div className="text-sm text-gray-500">Test Admin - UI Preview</div>
                </header>

                {/* Page Content */}
                <main className="p-6">
                    <div className="space-y-6">
                        {/* Header */}
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                                แดชบอร์ด
                            </h1>
                            <p className="text-gray-500 dark:text-gray-400 mt-1">
                                ยินดีต้อนรับ, Test Admin 👋
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
                                                    <span className="text-sm font-medium text-green-600">
                                                        {card.change}
                                                    </span>
                                                    <span className="text-xs text-gray-400">
                                                        {card.subtitle}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className={`p-3 rounded-lg bg-${card.color}-50 dark:bg-${card.color}-900/20`}>
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
                                        <div
                                            key={index}
                                            className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all hover:scale-105 cursor-pointer"
                                        >
                                            <div className="flex items-center justify-between mb-3">
                                                <Icon className={`w-5 h-5 text-${action.color}-600`} />
                                                <span className={`px-3 py-1 rounded-full text-sm font-bold bg-${action.color}-100 dark:bg-${action.color}-900/30 text-${action.color}-700 dark:text-${action.color}-400`}>
                                                    {action.count}
                                                </span>
                                            </div>
                                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                {action.title}
                                            </p>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>

                        {/* Recent Activity */}
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
                </main>
            </div>
        </div>
    )
}
