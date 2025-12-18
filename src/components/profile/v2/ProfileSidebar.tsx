'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
    LayoutDashboard,
    ShoppingBag,
    Heart,
    MapPin,
    CreditCard,
    Settings,
    HelpCircle,
    LogOut,
    Store,
    Sparkles,
    ChevronRight
} from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import { useAuth } from '@/contexts/AuthContext'
import { motion } from 'framer-motion'
import Button from '@/components/ui/Button'

interface SidebarProps {
    className?: string
}

export default function ProfileSidebar({ className = '' }: SidebarProps) {
    const pathname = usePathname()
    const { t } = useLanguage()
    const { user, logout, storeStatus } = useAuth()

    // Helper to check active state
    const isActive = (path: string) => {
        if (path === '/profile' && pathname === '/profile') return true
        if (path !== '/profile' && pathname?.startsWith(path)) return true
        return false
    }

    const menuItems = [
        {
            section: t('profile.menu_section_account'),
            items: [
                { icon: LayoutDashboard, label: t('profile.overview'), href: '/profile/overview' },
                { icon: ShoppingBag, label: t('profile.tab_orders'), href: '/profile/orders' },
                { icon: Heart, label: t('profile.tab_wishlist'), href: '/profile/wishlist' },
                { icon: MapPin, label: t('profile.tab_addresses'), href: '/profile/addresses' },
                { icon: CreditCard, label: t('profile.tab_payment'), href: '/profile/payments' },
            ]
        },
        {
            section: t('profile.menu_section_settings'),
            items: [
                { icon: Settings, label: t('profile.tab_settings'), href: '/profile/settings' },
                { icon: HelpCircle, label: t('profile.menu_help'), href: '/help' },
            ]
        }
    ]

    return (
        <div className={`w-full lg:w-72 flex-shrink-0 ${className}`}>
            <div className="bg-white dark:bg-card-dark rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-border-dark sticky top-24">

                {/* User Info (Mobile Only - Hidden on Desktop Sidebar usually, but good for context) */}
                <div className="lg:hidden flex items-center gap-4 mb-6 pb-6 border-b border-gray-100">
                    <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden">
                        <img src={user?.photoURL || 'https://via.placeholder.com/150'} alt="User" className="w-full h-full object-cover" />
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-900">{user?.displayName}</h3>
                        <p className="text-xs text-gray-500">{user?.email}</p>
                    </div>
                </div>

                {/* Seller Switcher */}
                <div className="mb-8">
                    {storeStatus.hasStore ? (
                        <Link href="/seller">
                            <div className="relative overflow-hidden group rounded-xl p-0.5 bg-gradient-to-r from-neon-purple to-indigo-600">
                                <div className="bg-white dark:bg-card-dark rounded-[10px] p-4 flex items-center justify-between group-hover:bg-opacity-90 transition-all cursor-pointer">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                                            <Store className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-900 dark:text-white text-sm">{t('profile.switch_to_seller')}</p>
                                            <p className="text-[10px] text-gray-500">{storeStatus.shopName}</p>
                                        </div>
                                    </div>
                                    <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-indigo-600 transition-colors" />
                                </div>
                            </div>
                        </Link>
                    ) : (
                        <Link href="/sell">
                            <div className="relative overflow-hidden group rounded-xl bg-gradient-to-br from-indigo-600 to-purple-700 p-4 text-white shadow-lg shadow-indigo-200">
                                <div className="flex items-start justify-between relative z-10">
                                    <div>
                                        <p className="font-bold text-sm mb-1 flex items-center gap-2">
                                            <Sparkles className="w-3 h-3 text-yellow-300" />
                                            {t('profile.become_seller')}
                                        </p>
                                        <p className="text-[10px] text-indigo-100 opacity-90">{t('profile.become_seller_desc')}</p>
                                    </div>
                                    <div className="w-8 h-8 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center">
                                        <Store className="w-4 h-4" />
                                    </div>
                                </div>
                            </div>
                        </Link>
                    )}
                </div>

                {/* Navigation Menus */}
                <nav className="space-y-6">
                    {menuItems.map((section, idx) => (
                        <div key={idx}>
                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 px-3">
                                {section.section}
                            </h4>
                            <div className="space-y-1">
                                {section.items.map((item) => {
                                    const active = isActive(item.href)
                                    return (
                                        <Link href={item.href} key={item.href}>
                                            <motion.div
                                                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${active
                                                    ? 'bg-neon-purple/10 text-neon-purple'
                                                    : 'text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800'
                                                    }`}
                                                whileHover={{ x: 4 }}
                                            >
                                                <item.icon className={`w-5 h-5 ${active ? 'text-neon-purple' : 'text-gray-400'}`} />
                                                <span>{item.label}</span>
                                                {active && <motion.div layoutId="active-pill" className="w-1.5 h-1.5 rounded-full bg-neon-purple ml-auto" />}
                                            </motion.div>
                                        </Link>
                                    )
                                })}
                            </div>
                        </div>
                    ))}

                    <div className="pt-4 border-t border-gray-100 dark:border-border-dark">
                        <button
                            onClick={() => logout()}
                            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-all"
                        >
                            <LogOut className="w-5 h-5" />
                            <span>{t('header.logout')}</span>
                        </button>
                    </div>
                </nav>
            </div>
        </div>
    )
}
