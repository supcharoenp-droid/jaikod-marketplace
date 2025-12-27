'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { ChevronRight, Home, ArrowLeft } from 'lucide-react'
import ProfileSidebarV3 from './ProfileSidebarV3'
import { useLanguage } from '@/contexts/LanguageContext'

// ==========================================
// TYPES
// ==========================================

interface ProfileLayoutV3Props {
    children: React.ReactNode
    title?: string
    showBack?: boolean
    className?: string
    memberType?: 'general' | 'store_general' | 'store_official'
}

// ==========================================
// MAIN LAYOUT
// ==========================================

export default function ProfileLayoutV3({
    children,
    title,
    showBack = false,
    className,
    memberType = 'general'
}: ProfileLayoutV3Props) {
    const pathname = usePathname()
    const router = useRouter()
    const { t, language } = useLanguage()

    // Smart Breadcrumbs
    const generateBreadcrumbs = () => {
        const segments = pathname?.split('/').filter(Boolean) || []
        const breadcrumbMap: Record<string, { th: string; en: string }> = {
            'profile': { th: 'บัญชีของฉัน', en: 'My Account' },
            'overview': { th: 'ภาพรวม', en: 'Overview' },
            'orders': { th: 'คำสั่งซื้อ', en: 'Orders' },
            'wishlist': { th: 'รายการโปรด', en: 'Wishlist' },
            'addresses': { th: 'ที่อยู่', en: 'Addresses' },
            'payments': { th: 'ชำระเงิน', en: 'Payments' },
            'settings': { th: 'ตั้งค่า', en: 'Settings' },
            'privacy': { th: 'ความเป็นส่วนตัว', en: 'Privacy' },
            'listings': { th: 'ประกาศของฉัน', en: 'My Listings' },
            'chats': { th: 'แชท', en: 'Chats' },
            'reviews': { th: 'รีวิว', en: 'Reviews' },
            'jaistar': { th: 'JaiStar', en: 'JaiStar' },
            'store': { th: 'ร้านค้า', en: 'Store' },
            'dashboard': { th: 'แดชบอร์ด', en: 'Dashboard' },
            'products': { th: 'สินค้า', en: 'Products' },
            'analytics': { th: 'วิเคราะห์', en: 'Analytics' },
            'promotions': { th: 'โปรโมชั่น', en: 'Promotions' },
            'finance': { th: 'การเงิน', en: 'Finance' }
        }

        return (
            <nav className="flex items-center text-sm text-gray-500 mb-6 overflow-x-auto no-scrollbar whitespace-nowrap">
                <Link href="/" className="hover:text-purple-500 transition-colors flex items-center gap-1">
                    <Home className="w-4 h-4" />
                    <span className="hidden sm:inline">
                        {language === 'th' ? 'หน้าแรก' : 'Home'}
                    </span>
                </Link>
                {segments.map((segment, index) => {
                    const href = `/${segments.slice(0, index + 1).join('/')}`
                    const isLast = index === segments.length - 1
                    const labelData = breadcrumbMap[segment]
                    const label = labelData
                        ? (language === 'th' ? labelData.th : labelData.en)
                        : segment

                    return (
                        <div key={href} className="flex items-center">
                            <ChevronRight className="w-4 h-4 mx-2 text-gray-300" />
                            {isLast ? (
                                <span className="font-bold text-gray-900 dark:text-white capitalize">{label}</span>
                            ) : (
                                <Link href={href} className="hover:text-purple-500 transition-colors capitalize">
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
        <div className="min-h-screen bg-gray-50/50 dark:bg-slate-900 pb-12">
            <div className="container mx-auto px-4 py-6 md:py-8">

                {generateBreadcrumbs()}

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar - Desktop */}
                    <div className="hidden lg:block">
                        <ProfileSidebarV3 memberType={memberType} />
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
                                    <ArrowLeft className="w-6 h-6 text-gray-700 dark:text-gray-300" />
                                </button>
                            ) : (
                                <Link href="/" className="p-2 -ml-2">
                                    <ArrowLeft className="w-6 h-6 text-gray-700 dark:text-gray-300" />
                                </Link>
                            )}
                            <h1 className="text-xl font-bold text-gray-900 dark:text-white truncate">
                                {title || (language === 'th' ? 'บัญชีของฉัน' : 'My Account')}
                            </h1>
                        </div>

                        {children}
                    </div>
                </div>
            </div>
        </div>
    )
}
