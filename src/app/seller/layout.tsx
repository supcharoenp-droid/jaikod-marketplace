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
    Store,
    BarChart3,
    Megaphone,
    Ticket,
    Zap,
    ChevronDown,
    ChevronRight,
    ExternalLink
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { useLanguage } from '@/contexts/LanguageContext'
import { SellerLanguageProvider } from '@/contexts/SellerLanguageContext'
import Image from 'next/image'
import AIAssistantWidget from '@/components/seller/AIAssistantWidget'

interface SubMenuItem {
    name: string
    icon: any
    href: string
}

interface MenuItem {
    name: string
    icon: any
    href: string
    subItems?: SubMenuItem[]
}

export default function SellerLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const pathname = usePathname()
    const { user, storeStatus } = useAuth()
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
    const [expandedMenus, setExpandedMenus] = useState<string[]>([])

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen)
    const toggleSubmenu = (href: string) => {
        setExpandedMenus(prev =>
            prev.includes(href)
                ? prev.filter(h => h !== href)
                : [...prev, href]
        )
    }

    // Verify Store Access
    // TEMPORARILY DISABLED FOR TESTING - Uncomment to require store before accessing seller pages
    /*
    if (!storeStatus.hasStore && pathname !== '/seller/register' && !pathname.startsWith('/onboarding')) {
        if (typeof window !== 'undefined') {
            setTimeout(() => {
                window.location.href = '/sell'
            }, 100)
        }
        return null
    }
    */

    const { t, language } = useLanguage()

    // Menu translations with proper fallbacks
    const menuLabels = {
        dashboard: language === 'th' ? 'แดชบอร์ด' : 'Dashboard',
        products: language === 'th' ? 'สินค้า' : 'Products',
        orders: language === 'th' ? 'คำสั่งซื้อ' : 'Orders',
        marketing: language === 'th' ? 'การตลาด' : 'Marketing',
        finance: language === 'th' ? 'การเงิน' : 'Finance',
        reports: language === 'th' ? 'รายงาน' : 'Reports',
        settings: language === 'th' ? 'ตั้งค่า' : 'Settings',
        // Submenu items
        tools: language === 'th' ? 'เครื่องมือ' : 'Tools',
        shopAds: language === 'th' ? 'โฆษณาร้านค้า' : 'Shop Ads',
        vouchers: language === 'th' ? 'คูปอง' : 'Vouchers',
        flashSale: 'Flash Sale',
    }

    const MENU_ITEMS: MenuItem[] = [
        { name: menuLabels.dashboard, icon: LayoutDashboard, href: '/seller' },
        { name: menuLabels.products, icon: Package, href: '/seller/products' },
        { name: menuLabels.orders, icon: ShoppingBag, href: '/seller/orders' },
        {
            name: menuLabels.marketing,
            icon: TrendingUp,
            href: '/seller/marketing',
            subItems: [
                { name: menuLabels.tools, icon: Settings, href: '/seller/tools' },
                { name: menuLabels.shopAds, icon: Megaphone, href: '/seller/tools/ads' },
                { name: menuLabels.vouchers, icon: Ticket, href: '/seller/tools/vouchers' },
                { name: menuLabels.flashSale, icon: Zap, href: '/seller/tools/flash-sale' },
            ]
        },
        { name: menuLabels.finance, icon: Wallet, href: '/seller/finance' },
        { name: menuLabels.reports, icon: BarChart3, href: '/seller/reports' },
        { name: menuLabels.settings, icon: Settings, href: '/seller/settings' },
    ]

    return (
        <SellerLanguageProvider>
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
                                <span className="text-gray-900 dark:text-white">{t('seller_dashboard.seller_centre')}</span>
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
                                        {storeStatus.shopName || user?.displayName || 'My Shop'}
                                    </h3>
                                    {storeStatus.hasStore ? (
                                        <Link
                                            href={`/shop/${(storeStatus.shopName || 'my-shop').toLowerCase().replace(/\s+/g, '-')}`}
                                            className="text-xs text-neon-purple hover:underline flex items-center gap-1"
                                        >
                                            <span className="w-2 h-2 rounded-full bg-green-500"></span>
                                            {language === 'th' ? 'ออนไลน์' : 'Online'}
                                            <ExternalLink className="w-3 h-3" />
                                        </Link>
                                    ) : (
                                        <Link
                                            href="/seller/settings"
                                            className="text-xs text-orange-500 hover:text-orange-600 flex items-center gap-1"
                                        >
                                            <span className="w-2 h-2 rounded-full bg-orange-400"></span>
                                            {language === 'th' ? 'ต้องตั้งค่า' : 'Setup Required'}
                                        </Link>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Navigation Links */}
                        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                            {MENU_ITEMS.map((item) => {
                                const isActive = pathname === item.href || pathname?.startsWith(item.href + '/')
                                const hasSubItems = item.subItems && item.subItems.length > 0
                                const isExpanded = expandedMenus.includes(item.href) || pathname?.startsWith(item.href)

                                return (
                                    <div key={item.href}>
                                        {hasSubItems ? (
                                            <>
                                                <button
                                                    onClick={() => toggleSubmenu(item.href)}
                                                    className={`
                                                        w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors
                                                        ${isActive || isExpanded
                                                            ? 'bg-neon-purple/10 text-neon-purple'
                                                            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                                                        }
                                                    `}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <item.icon className="w-5 h-5" />
                                                        {item.name}
                                                    </div>
                                                    {isExpanded ? (
                                                        <ChevronDown className="w-4 h-4" />
                                                    ) : (
                                                        <ChevronRight className="w-4 h-4" />
                                                    )}
                                                </button>
                                                {isExpanded && (
                                                    <div className="ml-4 mt-1 space-y-1 border-l-2 border-gray-100 dark:border-gray-700 pl-4">
                                                        {item.subItems?.map((subItem) => {
                                                            const isSubActive = pathname === subItem.href
                                                            return (
                                                                <Link
                                                                    key={subItem.href}
                                                                    href={subItem.href}
                                                                    className={`
                                                                        flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors
                                                                        ${isSubActive
                                                                            ? 'bg-neon-purple/10 text-neon-purple font-medium'
                                                                            : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                                                                        }
                                                                    `}
                                                                >
                                                                    <subItem.icon className="w-4 h-4" />
                                                                    {subItem.name}
                                                                </Link>
                                                            )
                                                        })}
                                                    </div>
                                                )}
                                            </>
                                        ) : (
                                            <Link
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
                                        )}
                                    </div>
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
                                {t('seller_dashboard.back_to_home') || 'กลับหน้าแรก'}
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
                        <span className="font-bold text-lg">{t('seller_dashboard.seller_centre')}</span>
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

            {/* AI Assistant Widget */}
            <AIAssistantWidget />
        </SellerLanguageProvider>
    )
}
