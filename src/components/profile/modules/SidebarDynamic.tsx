'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
    LayoutDashboard,
    ShoppingBag,
    MapPin,
    CreditCard,
    Heart,
    Settings,
    Store,
    Package,
    TrendingUp,
    DollarSign,
    Megaphone,
    ChevronRight,
    AlertCircle,
    Sparkles
} from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import useProfile from '@/hooks/useProfile'

interface SidebarDynamicProps {
    className?: string
}

interface MenuItem {
    icon: any
    label: string
    href: string
    badge?: number
    highlight?: boolean
    highlightMessage?: string
    tooltip?: string
}

interface MenuSection {
    title: string
    items: MenuItem[]
}

export default function SidebarDynamic({ className = '' }: SidebarDynamicProps) {
    const pathname = usePathname()
    const { t, language } = useLanguage()
    const { user, ordersSummary, roleMode, stats } = useProfile()
    const [hoveredItem, setHoveredItem] = useState<string | null>(null)
    const [tooltipTimer, setTooltipTimer] = useState<NodeJS.Timeout | null>(null)

    // Check if active
    const isActive = (path: string) => {
        if (path === '/profile/overview' && pathname === '/profile/overview') return true
        if (path !== '/profile/overview' && pathname?.startsWith(path)) return true
        return false
    }

    // AI Highlight System
    const getHighlights = () => {
        const highlights: Record<string, { highlight: boolean; message: string }> = {}

        // Pending orders
        if (ordersSummary.pending > 0) {
            highlights['/profile/orders'] = {
                highlight: true,
                message: t('profile.sidebar.highlight_pending_orders')
            }
        }

        // No address (mock check - in real app check from profile)
        const hasAddress = user?.roles && user.roles.length > 0 // Mock
        if (!hasAddress) {
            highlights['/profile/addresses'] = {
                highlight: true,
                message: t('profile.sidebar.highlight_no_address')
            }
        }

        // Incomplete shop setup (for sellers)
        if (roleMode === 'seller' || roleMode === 'hybrid') {
            const onboardingProgress = 7 // Mock - should come from storeStatus
            if (onboardingProgress < 7) {
                highlights['/seller/dashboard'] = {
                    highlight: true,
                    message: t('profile.sidebar.highlight_incomplete_shop')
                }
            }
        }

        return highlights
    }

    const highlights = getHighlights()

    // Build menu based on role
    const buildMenu = (): MenuSection[] => {
        const sections: MenuSection[] = []

        // Buyer-only menu
        if (roleMode === 'buyer') {
            sections.push({
                title: t('profile.sidebar.section_profile'),
                items: [
                    {
                        icon: LayoutDashboard,
                        label: t('profile.sidebar.overview'),
                        href: '/profile/overview',
                        tooltip: t('profile.sidebar.tooltip_overview')
                    },
                    {
                        icon: ShoppingBag,
                        label: t('profile.sidebar.orders'),
                        href: '/profile/orders',
                        badge: ordersSummary.pending,
                        highlight: highlights['/profile/orders']?.highlight,
                        highlightMessage: highlights['/profile/orders']?.message,
                        tooltip: t('profile.sidebar.tooltip_orders')
                    },
                    {
                        icon: MapPin,
                        label: t('profile.sidebar.address'),
                        href: '/profile/addresses',
                        highlight: highlights['/profile/addresses']?.highlight,
                        highlightMessage: highlights['/profile/addresses']?.message,
                        tooltip: t('profile.sidebar.tooltip_address')
                    },
                    {
                        icon: CreditCard,
                        label: t('profile.sidebar.payments'),
                        href: '/profile/payments',
                        tooltip: t('profile.sidebar.tooltip_payments')
                    },
                    {
                        icon: Heart,
                        label: t('profile.sidebar.wishlist'),
                        href: '/profile/wishlist',
                        badge: (stats as any).wishlistCount || 0,
                        tooltip: t('profile.sidebar.tooltip_wishlist')
                    }
                ]
            })

            // Settings section (separate)
            sections.push({
                title: '',
                items: [
                    {
                        icon: Settings,
                        label: t('profile.sidebar.settings'),
                        href: '/profile/settings',
                        tooltip: t('profile.sidebar.tooltip_settings')
                    }
                ]
            })
        }

        // Seller-only menu
        if (roleMode === 'seller') {
            sections.push({
                title: t('profile.sidebar.section_profile'),
                items: [
                    {
                        icon: LayoutDashboard,
                        label: t('profile.sidebar.overview'),
                        href: '/profile/overview',
                        tooltip: t('profile.sidebar.tooltip_overview')
                    }
                ]
            })

            sections.push({
                title: t('profile.sidebar.section_seller_tools'),
                items: [
                    {
                        icon: Store,
                        label: language === 'th' ? 'แดชบอร์ด' : 'Dashboard',
                        href: '/seller/dashboard',
                        highlight: highlights['/seller/dashboard']?.highlight,
                        highlightMessage: highlights['/seller/dashboard']?.message,
                        tooltip: language === 'th' ? 'จัดการร้านค้าของคุณ' : 'Manage your shop'
                    },
                    {
                        icon: Package,
                        label: language === 'th' ? 'สินค้า' : 'Products',
                        href: '/seller/products',
                        tooltip: language === 'th' ? 'จัดการสินค้าของคุณ' : 'Manage your products'
                    },
                    {
                        icon: ShoppingBag,
                        label: language === 'th' ? 'คำสั่งซื้อ' : 'Orders',
                        href: '/seller/orders',
                        tooltip: language === 'th' ? 'ดูคำสั่งซื้อจากลูกค้า' : 'View customer orders'
                    },
                    {
                        icon: DollarSign,
                        label: language === 'th' ? 'การเงิน' : 'Finance',
                        href: '/seller/finance',
                        tooltip: language === 'th' ? 'ดูรายได้และการเงิน' : 'View revenue and finances'
                    },
                    {
                        icon: TrendingUp,
                        label: language === 'th' ? 'วิเคราะห์' : 'Analytics',
                        href: '/seller/analytics',
                        tooltip: language === 'th' ? 'ดูสถิติและข้อมูลเชิงลึก' : 'View stats and insights'
                    },
                    {
                        icon: Megaphone,
                        label: language === 'th' ? 'โปรโมชั่น' : 'Promotions',
                        href: '/seller/marketing',
                        tooltip: language === 'th' ? 'สร้างโปรโมชั่นและแคมเปญ' : 'Create promotions and campaigns'
                    }
                ]
            })

            // Settings section (separate)
            sections.push({
                title: '',
                items: [
                    {
                        icon: Settings,
                        label: t('profile.sidebar.settings'),
                        href: '/profile/settings',
                        tooltip: t('profile.sidebar.tooltip_settings')
                    }
                ]
            })
        }

        // Hybrid menu
        if (roleMode === 'hybrid') {
            // Buyer section
            sections.push({
                title: `📦 ${t('profile.sidebar.section_buyer')}`,
                items: [
                    {
                        icon: LayoutDashboard,
                        label: t('profile.sidebar.overview'),
                        href: '/profile/overview',
                        tooltip: t('profile.sidebar.tooltip_overview')
                    },
                    {
                        icon: ShoppingBag,
                        label: t('profile.sidebar.orders'),
                        href: '/profile/orders',
                        badge: ordersSummary.pending,
                        highlight: highlights['/profile/orders']?.highlight,
                        highlightMessage: highlights['/profile/orders']?.message,
                        tooltip: t('profile.sidebar.tooltip_orders')
                    },
                    {
                        icon: MapPin,
                        label: t('profile.sidebar.address'),
                        href: '/profile/addresses',
                        highlight: highlights['/profile/addresses']?.highlight,
                        highlightMessage: highlights['/profile/addresses']?.message,
                        tooltip: t('profile.sidebar.tooltip_address')
                    },
                    {
                        icon: Heart,
                        label: t('profile.sidebar.wishlist'),
                        href: '/profile/wishlist',
                        badge: (stats as any).wishlistCount || 0,
                        tooltip: t('profile.sidebar.tooltip_wishlist')
                    }
                ]
            })

            // Seller section
            sections.push({
                title: `🛒 ${t('profile.sidebar.section_seller')}`,
                items: [
                    {
                        icon: Store,
                        label: language === 'th' ? 'แดชบอร์ด' : 'Dashboard',
                        href: '/seller/dashboard',
                        highlight: highlights['/seller/dashboard']?.highlight,
                        highlightMessage: highlights['/seller/dashboard']?.message,
                        tooltip: language === 'th' ? 'จัดการร้านค้าของคุณ' : 'Manage your shop'
                    },
                    {
                        icon: Package,
                        label: language === 'th' ? 'สินค้า' : 'Products',
                        href: '/seller/products',
                        tooltip: language === 'th' ? 'จัดการสินค้าของคุณ' : 'Manage your products'
                    },
                    {
                        icon: TrendingUp,
                        label: language === 'th' ? 'วิเคราะห์' : 'Analytics',
                        href: '/seller/analytics',
                        tooltip: language === 'th' ? 'ดูสถิติและข้อมูลเชิงลึก' : 'View stats and insights'
                    }
                ]
            })

            // Settings section
            sections.push({
                title: '',
                items: [
                    {
                        icon: Settings,
                        label: t('profile.sidebar.settings'),
                        href: '/profile/settings',
                        tooltip: t('profile.sidebar.tooltip_settings')
                    }
                ]
            })
        }

        return sections
    }

    const menuSections = buildMenu()

    // Handle hover with delay for tooltip
    const handleMouseEnter = (href: string) => {
        const timer = setTimeout(() => {
            setHoveredItem(href)
        }, 1000) // 1 second delay
        setTooltipTimer(timer)
    }

    const handleMouseLeave = () => {
        if (tooltipTimer) {
            clearTimeout(tooltipTimer)
        }
        setHoveredItem(null)
    }

    return (
        <div className={`w-full lg:w-64 flex-shrink-0 ${className}`}>
            <div className="bg-white dark:bg-card-dark rounded-3xl p-4 shadow-sm border border-gray-100 dark:border-border-dark sticky top-24 max-h-[calc(100vh-120px)] overflow-y-auto">
                {menuSections.map((section, sectionIdx) => (
                    <div key={sectionIdx} className={sectionIdx > 0 ? 'mt-6' : ''}>
                        {section.title && (
                            <h4 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3 px-3">
                                {section.title}
                            </h4>
                        )}
                        <nav className="space-y-1">
                            {section.items.map((item) => {
                                const Icon = item.icon
                                const active = isActive(item.href)
                                const showTooltip = hoveredItem === item.href

                                return (
                                    <div key={item.href} className="relative">
                                        <Link
                                            href={item.href}
                                            onMouseEnter={() => handleMouseEnter(item.href)}
                                            onMouseLeave={handleMouseLeave}
                                        >
                                            <motion.div
                                                className={`
                                                    flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all relative
                                                    ${active
                                                        ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400'
                                                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                                                    }
                                                    ${item.highlight ? 'ring-2 ring-orange-400 dark:ring-orange-600' : ''}
                                                `}
                                                whileHover={{ x: 4 }}
                                                animate={item.highlight ? {
                                                    boxShadow: [
                                                        '0 0 0 0 rgba(251, 146, 60, 0)',
                                                        '0 0 0 4px rgba(251, 146, 60, 0.1)',
                                                        '0 0 0 0 rgba(251, 146, 60, 0)'
                                                    ]
                                                } : {}}
                                                transition={item.highlight ? { duration: 2, repeat: Infinity } : {}}
                                            >
                                                <Icon className={`w-5 h-5 ${active ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-400'}`} />
                                                <span className="flex-1">{item.label}</span>

                                                {/* Badge */}
                                                {item.badge && item.badge > 0 && (
                                                    <span className="px-2 py-0.5 bg-orange-500 text-white text-xs font-bold rounded-full">
                                                        {item.badge}
                                                    </span>
                                                )}

                                                {/* Highlight indicator */}
                                                {item.highlight && (
                                                    <motion.div
                                                        animate={{ scale: [1, 1.2, 1] }}
                                                        transition={{ duration: 1, repeat: Infinity }}
                                                    >
                                                        <AlertCircle className="w-4 h-4 text-orange-500" />
                                                    </motion.div>
                                                )}

                                                {/* Active indicator */}
                                                {active && (
                                                    <motion.div
                                                        layoutId="active-pill"
                                                        className="w-1.5 h-1.5 rounded-full bg-indigo-600 dark:bg-indigo-400"
                                                    />
                                                )}
                                            </motion.div>
                                        </Link>

                                        {/* AI Tooltip */}
                                        <AnimatePresence>
                                            {showTooltip && item.tooltip && (
                                                <motion.div
                                                    initial={{ opacity: 0, x: -10 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    exit={{ opacity: 0, x: -10 }}
                                                    className="absolute left-full ml-2 top-0 z-50 w-64 bg-gray-900 dark:bg-gray-800 text-white text-xs p-3 rounded-lg shadow-xl pointer-events-none"
                                                >
                                                    <div className="flex items-start gap-2">
                                                        <Sparkles className="w-4 h-4 text-yellow-400 shrink-0 mt-0.5" />
                                                        <p>{item.tooltip}</p>
                                                    </div>
                                                    {/* Arrow */}
                                                    <div className="absolute right-full top-3 w-0 h-0 border-t-4 border-t-transparent border-b-4 border-b-transparent border-r-4 border-r-gray-900 dark:border-r-gray-800" />
                                                </motion.div>
                                            )}
                                        </AnimatePresence>

                                        {/* Highlight Message Tooltip */}
                                        {item.highlight && item.highlightMessage && (
                                            <div className="mt-1 px-3">
                                                <div className="text-xs text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20 px-2 py-1 rounded-lg">
                                                    {item.highlightMessage}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )
                            })}
                        </nav>
                    </div>
                ))}
            </div>
        </div>
    )
}
