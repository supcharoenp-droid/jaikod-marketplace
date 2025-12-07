'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
    LayoutDashboard,
    Package,
    ShoppingBag,
    TrendingUp,
    Wallet,
    Settings,
    Menu,
    X,
    LogOut,
    Store
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import Image from 'next/image'

export default function SellerLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const pathname = usePathname()
    const { user } = useAuth()
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen)

    const MENU_ITEMS = [
        { name: 'ภาพรวมร้านค้า', icon: LayoutDashboard, href: '/seller' },
        { name: 'สินค้าของฉัน', icon: Package, href: '/seller/products' },
        { name: 'คำสั่งซื้อ', icon: ShoppingBag, href: '/seller/orders' },
        { name: 'การตลาด', icon: TrendingUp, href: '/seller/marketing' },
        { name: 'การเงิน', icon: Wallet, href: '/seller/finance' },
        { name: 'ตั้งค่าร้านค้า', icon: Settings, href: '/seller/settings' },
    ]

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-bg-dark flex">
            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar Navigation */}
            <aside
                className={`
                    fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white dark:bg-surface-dark border-r border-gray-200 dark:border-gray-800 transition-transform duration-300 ease-in-out
                    ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                `}
            >
                <div className="h-full flex flex-col">
                    {/* Sidebar Header */}
                    <div className="h-16 flex items-center px-6 border-b border-gray-200 dark:border-gray-800">
                        <Link href="/" className="flex items-center gap-2 font-display font-bold text-xl">
                            <Store className="w-6 h-6 text-neon-purple" />
                            <span className="text-gray-900 dark:text-white">Seller Centre</span>
                        </Link>
                        <button
                            className="ml-auto lg:hidden text-gray-500"
                            onClick={toggleSidebar}
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    {/* User Info (Mini) */}
                    <div className="p-6 border-b border-gray-100 dark:border-gray-800">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden relative">
                                {user?.photoURL ? (
                                    <Image src={user.photoURL} alt="User" fill className="object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-neon-purple text-white font-bold">
                                        {user?.displayName?.[0] || 'S'}
                                    </div>
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="text-sm font-bold text-gray-900 dark:text-white truncate">
                                    {user?.displayName || 'ร้านค้าของฉัน'}
                                </h3>
                                <p className="text-xs text-green-500 flex items-center gap-1">
                                    <span className="w-2 h-2 rounded-full bg-green-500"></span>
                                    ออนไลน์
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Navigation Links */}
                    <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                        {MENU_ITEMS.map((item) => {
                            const isActive = pathname === item.href
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`
                                        flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors
                                        ${isActive
                                            ? 'bg-neon-purple/10 text-neon-purple'
                                            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                                        }
                                    `}
                                >
                                    <item.icon className="w-5 h-5" />
                                    {item.name}
                                </Link>
                            )
                        })}
                    </nav>

                    {/* Bottom Actions */}
                    <div className="p-4 border-t border-gray-200 dark:border-gray-800">
                        <Link
                            href="/"
                            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        >
                            <LogOut className="w-5 h-5" />
                            กลับสู่หน้าหลัก
                        </Link>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
                {/* Mobile Header */}
                <header className="h-16 lg:hidden bg-white dark:bg-surface-dark border-b border-gray-200 dark:border-gray-800 flex items-center px-4 justify-between">
                    <button
                        onClick={toggleSidebar}
                        className="p-2 -ml-2 text-gray-600 dark:text-gray-300"
                    >
                        <Menu className="w-6 h-6" />
                    </button>
                    <span className="font-bold text-lg">Seller Centre</span>
                    <div className="w-6" /> {/* Spacer */}
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto p-4 md:p-8">
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    )
}
