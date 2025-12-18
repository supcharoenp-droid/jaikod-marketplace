'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { ChevronRight, Home, ArrowLeft } from 'lucide-react'
import SidebarDynamic from '../modules/SidebarDynamic'
import { useLanguage } from '@/contexts/LanguageContext'

interface ProfileLayoutProps {
    children: React.ReactNode
    title?: string
    showBack?: boolean
    className?: string
}

export default function ProfileLayout({ children, title, showBack = false, className }: ProfileLayoutProps) {
    const pathname = usePathname()
    const router = useRouter()
    const { t } = useLanguage()

    // Smart Breadcrumbs
    const generateBreadcrumbs = () => {
        const segments = pathname?.split('/').filter(Boolean) || []
        const breadcrumbMap: Record<string, string> = {
            'profile': t('header.profile'),
            'overview': t('profile.overview'),
            'orders': t('profile.tab_orders'),
            'wishlist': t('profile.tab_wishlist'),
            'addresses': t('profile.tab_addresses'),
            'payments': t('profile.tab_payment'),
            'settings': t('profile.tab_settings')
        }

        return (
            <nav className="flex items-center text-sm text-gray-500 mb-6 overflow-x-auto no-scrollbar whitespace-nowrap">
                <Link href="/" className="hover:text-neon-purple transition-colors flex items-center gap-1">
                    <Home className="w-4 h-4" />
                    <span>Home</span>
                </Link>
                {segments.map((segment, index) => {
                    const href = `/${segments.slice(0, index + 1).join('/')}`
                    const isLast = index === segments.length - 1
                    const label = breadcrumbMap[segment] || segment

                    return (
                        <div key={href} className="flex items-center">
                            <ChevronRight className="w-4 h-4 mx-2 text-gray-300" />
                            {isLast ? (
                                <span className="font-bold text-gray-900 dark:text-white capitalize">{label}</span>
                            ) : (
                                <Link href={href} className="hover:text-neon-purple transition-colors capitalize">
                                    {label}
                                </Link>
                            )}
                        </div>
                    )
                })}
            </nav>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50/50 dark:bg-bg-dark pb-12">
            <div className="container mx-auto px-4 py-6 md:py-8">

                {generateBreadcrumbs()}

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar - Desktop */}
                    <div className="hidden lg:block">
                        <SidebarDynamic />
                    </div>

                    {/* Main Content */}
                    <div className={`flex-1 min-w-0 ${className || ''}`}>
                        {/* Mobile Header / Back Button */}
                        <div className="lg:hidden mb-6 flex items-center gap-4">
                            {showBack ? (
                                <button
                                    onClick={() => router.back()}
                                    className="p-2 -ml-2 rounded-full hover:bg-white/50 active:bg-white/80 transition-colors"
                                >
                                    <ArrowLeft className="w-6 h-6 text-gray-700" />
                                </button>
                            ) : (
                                <Link href="/" className="p-2 -ml-2">
                                    <ArrowLeft className="w-6 h-6 text-gray-700" />
                                </Link>
                            )}
                            <h1 className="text-xl font-bold text-gray-900 truncate">{title || t('header.profile')}</h1>
                        </div>

                        {children}
                    </div>
                </div>
            </div>
        </div>
    )
}
