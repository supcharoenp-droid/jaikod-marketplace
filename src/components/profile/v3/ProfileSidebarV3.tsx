'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
    // General
    LayoutDashboard, ShoppingBag, MapPin, CreditCard, Heart, Settings,
    LogOut, ChevronRight, ChevronDown, Bell, Globe, Lock, User, Shield,
    // Seller
    Package, Plus, MessageCircle, Star, Zap, AlertTriangle,
    // Store
    Store, BarChart3, Gift, Tag, Wallet, Users, Image as ImageIcon,
    // Status
    Clock, CheckCircle, XCircle, AlertCircle
} from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import { useAuth } from '@/contexts/AuthContext'
import { getListingsBySeller, UniversalListing } from '@/lib/listings'
import { getSellerProfile } from '@/lib/seller'

// ==========================================
// TYPES
// ==========================================

type MemberType = 'general' | 'store_general' | 'store_official'

interface MenuItem {
    id: string
    icon: any
    label_th: string
    label_en: string
    href: string
    badge?: number
    warning?: boolean
    highlight?: boolean
    children?: MenuItem[]
}

interface MenuSection {
    id: string
    title_th: string
    title_en: string
    icon?: string
    items: MenuItem[]
    collapsed?: boolean
}

// ==========================================
// USER STATS TYPE (Replace mock with real data)
// ==========================================

interface UserStats {
    jaistar_balance: number
    jaistar_tier: string
    trust_score: number
    total_reviews: number
    avg_rating: number
    listings: {
        active: number
        pending: number
        expired: number
        sold: number
        closed: number
    }
    orders: {
        to_pay: number
        to_receive: number
        completed: number
    }
    unread_messages: number
    wishlist_count: number
    followers: number
}

const defaultUserStats: UserStats = {
    jaistar_balance: 0,
    jaistar_tier: 'bronze',
    trust_score: 50,
    total_reviews: 0,
    avg_rating: 0,
    listings: {
        active: 0,
        pending: 0,
        expired: 0,
        sold: 0,
        closed: 0
    },
    orders: {
        to_pay: 0,
        to_receive: 0,
        completed: 0
    },
    unread_messages: 0,
    wishlist_count: 2, // TODO: Fetch from wishlist collection
    followers: 0
}

// ==========================================
// PROFILE HEADER COMPONENT
// ==========================================

interface ProfileHeaderProps {
    memberType: MemberType
    language: 'th' | 'en'
    userStats: UserStats
}

function ProfileHeader({ memberType, language, userStats }: ProfileHeaderProps) {
    const { user } = useAuth()

    const getMemberTypeBadge = () => {
        switch (memberType) {
            case 'store_official':
                return { label: language === 'th' ? 'ร้านค้าทางการ ✅' : 'Official Store ✅', color: 'bg-blue-500' }
            case 'store_general':
                return { label: language === 'th' ? 'ร้านค้าทั่วไป' : 'General Store', color: 'bg-purple-500' }
            default:
                return { label: language === 'th' ? 'สมาชิกทั่วไป' : 'Member', color: 'bg-gray-500' }
        }
    }

    const badge = getMemberTypeBadge()

    return (
        <div className="p-4 border-b border-gray-100 dark:border-gray-700">
            {/* User Info */}
            <div className="flex items-center gap-3 mb-3">
                <div className="relative">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-lg font-bold overflow-hidden">
                        {user?.photoURL ? (
                            <Image src={user.photoURL} alt="" width={48} height={48} className="w-full h-full object-cover" />
                        ) : (
                            user?.displayName?.charAt(0).toUpperCase() || 'U'
                        )}
                    </div>
                    {/* Online indicator */}
                    <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full" />
                </div>
                <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-900 dark:text-white truncate">
                        {user?.displayName || 'User'}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {user?.email}
                    </p>
                </div>
            </div>

            {/* Member Badge */}
            <div className="flex items-center gap-2 mb-3">
                <span className={`px-2 py-0.5 text-xs font-medium text-white rounded-full ${badge.color}`}>
                    {badge.label}
                </span>
                {userStats.trust_score >= 80 && (
                    <span className="px-2 py-0.5 text-xs font-medium text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 rounded-full">
                        ⭐ Trust {userStats.trust_score}
                    </span>
                )}
            </div>

            {/* JaiStar Balance */}
            <Link href="/profile/jaistar" className="block">
                <div className="flex items-center justify-between p-3 bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 rounded-xl hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-2">
                        <span className="text-xl">⭐</span>
                        <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">JaiStar</p>
                            <p className="font-bold text-gray-900 dark:text-white">
                                {userStats.jaistar_balance.toLocaleString()}
                            </p>
                        </div>
                    </div>
                    <button className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white text-xs font-medium rounded-lg transition-colors">
                        {language === 'th' ? '+ เติม' : '+ Top Up'}
                    </button>
                </div>
            </Link>
        </div>
    )
}

// ==========================================
// MENU ITEM COMPONENT
// ==========================================

interface MenuItemRowProps {
    item: MenuItem
    isActive: boolean
    language: 'th' | 'en'
    expanded?: boolean
    onToggle?: () => void
}

function MenuItemRow({ item, isActive, language, expanded, onToggle }: MenuItemRowProps) {
    const Icon = item.icon
    const hasChildren = item.children && item.children.length > 0
    const pathname = usePathname()
    const router = useRouter()

    const content = (
        <motion.div
            className={`
                flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer
                ${isActive
                    ? 'bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                }
                ${item.highlight ? 'ring-2 ring-orange-400' : ''}
            `}
            whileHover={{ x: 3 }}
        >
            <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-purple-600 dark:text-purple-400' : 'text-gray-400'}`} />
            <span className="flex-1">{language === 'th' ? item.label_th : item.label_en}</span>

            {/* Badge */}
            {item.badge !== undefined && item.badge > 0 && (
                <span className={`px-1.5 min-w-[20px] h-5 flex items-center justify-center text-xs font-bold rounded-full ${item.warning ? 'bg-orange-500 text-white' : 'bg-red-500 text-white'
                    }`}>
                    {item.badge}
                </span>
            )}

            {/* Warning icon */}
            {item.warning && !item.badge && (
                <AlertTriangle className="w-4 h-4 text-orange-500" />
            )}

            {/* Expand arrow for children */}
            {hasChildren && (
                <ChevronDown className={`w-4 h-4 transition-transform ${expanded ? 'rotate-180' : ''}`} />
            )}
        </motion.div>
    )

    // Items with children - collapsible menu
    if (hasChildren) {
        return (
            <div>
                <div onClick={onToggle}>{content}</div>
                <AnimatePresence>
                    {expanded && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="ml-4 mt-1 space-y-1 overflow-hidden"
                        >
                            {item.children!.map(child => {
                                const ChildIcon = child.icon
                                const childActive = pathname?.startsWith(child.href)
                                return (
                                    <motion.div
                                        key={child.id}
                                        onClick={() => router.push(child.href)}
                                        className={`
                                            flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all cursor-pointer
                                            ${childActive
                                                ? 'bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300'
                                                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                                            }
                                        `}
                                        whileHover={{ x: 3 }}
                                    >
                                        <ChildIcon className={`w-4 h-4 flex-shrink-0 ${childActive ? 'text-purple-600 dark:text-purple-400' : 'text-gray-400'}`} />
                                        <span className="flex-1">{language === 'th' ? child.label_th : child.label_en}</span>
                                        {child.warning && <AlertTriangle className="w-3 h-3 text-orange-500" />}
                                    </motion.div>
                                )
                            })}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        )
    }

    // Regular items without children - use Link
    return <Link href={item.href}>{content}</Link>
}

// ==========================================
// MAIN SIDEBAR COMPONENT
// ==========================================

interface ProfileSidebarV3Props {
    memberType?: MemberType
    className?: string
}

export default function ProfileSidebarV3({
    memberType = 'general',
    className = ''
}: ProfileSidebarV3Props) {
    const pathname = usePathname()
    const router = useRouter()
    const { t, language } = useLanguage()
    const { logout, user } = useAuth()

    // State for real user stats
    const [userStats, setUserStats] = useState<UserStats>(defaultUserStats)

    const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({
        'my-listings': true  // Default expanded
    })

    // Fetch real data
    useEffect(() => {
        async function fetchUserStats() {
            if (!user?.uid) return

            try {
                // Fetch listings
                const listings = await getListingsBySeller(user.uid, 50)

                // Calculate stats from listings
                const activeListings = listings.filter(l => l.status === 'active')
                const pendingListings = listings.filter(l => l.status === 'pending')
                const expiredListings = listings.filter(l => l.status === 'expired')
                const soldListings = listings.filter(l => l.status === 'sold')
                const totalInquiries = listings.reduce((sum, l) => sum + (l.stats?.inquiries || 0), 0)

                // Fetch seller profile
                let trustScore = 50
                let reviewCount = 0
                let reviewAvg = 0

                try {
                    const sellerProfile = await getSellerProfile(user.uid)
                    if (sellerProfile) {
                        trustScore = sellerProfile.trust_score || 50
                        reviewCount = sellerProfile.rating_count || 0
                        reviewAvg = sellerProfile.rating_avg || 0
                    }
                } catch (e) {
                    console.log('No seller profile yet')
                }

                setUserStats({
                    jaistar_balance: 0, // TODO: Fetch from jaistar collection
                    jaistar_tier: 'bronze',
                    trust_score: trustScore,
                    total_reviews: reviewCount,
                    avg_rating: reviewAvg,
                    listings: {
                        active: activeListings.length,
                        pending: pendingListings.length,
                        expired: expiredListings.length,
                        sold: soldListings.length,
                        closed: 0
                    },
                    orders: {
                        to_pay: 1, // TODO: Fetch from orders collection
                        to_receive: 2,
                        completed: 0
                    },
                    unread_messages: totalInquiries,
                    wishlist_count: 2, // TODO: Fetch from wishlist collection
                    followers: 0
                })
            } catch (error) {
                console.error('Error fetching user stats:', error)
            }
        }

        fetchUserStats()
    }, [user?.uid])

    const toggleExpand = (id: string) => {
        setExpandedItems(prev => ({ ...prev, [id]: !prev[id] }))
    }

    const isActive = (path: string) => {
        if (path === '/profile/overview' && pathname === '/profile/overview') return true
        if (path !== '/profile/overview' && pathname?.startsWith(path)) return true
        return false
    }

    // Build menu based on member type
    const buildMenu = (): MenuSection[] => {
        const sections: MenuSection[] = []

        // === BUYER SECTION (Always present) ===
        sections.push({
            id: 'buying',
            title_th: '📦 การซื้อของฉัน',
            title_en: '📦 My Purchases',
            items: [
                {
                    id: 'overview',
                    icon: LayoutDashboard,
                    label_th: 'ภาพรวม',
                    label_en: 'Overview',
                    href: '/profile/overview'
                },
                {
                    id: 'orders',
                    icon: ShoppingBag,
                    label_th: 'คำสั่งซื้อ',
                    label_en: 'Orders',
                    href: '/profile/orders',
                    badge: userStats.orders.to_receive
                },
                {
                    id: 'wishlist',
                    icon: Heart,
                    label_th: 'รายการโปรด',
                    label_en: 'Wishlist',
                    href: '/profile/wishlist',
                    badge: userStats.wishlist_count > 0 ? undefined : undefined
                },
                {
                    id: 'addresses',
                    icon: MapPin,
                    label_th: 'ที่อยู่จัดส่ง',
                    label_en: 'Addresses',
                    href: '/profile/addresses'
                },
                {
                    id: 'payments',
                    icon: CreditCard,
                    label_th: 'วิธีชำระเงิน',
                    label_en: 'Payment Methods',
                    href: '/profile/payments'
                }
            ]
        })

        // === SELLER SECTION (For General Member) ===
        if (memberType === 'general') {
            sections.push({
                id: 'selling',
                title_th: '🛒 การขายของฉัน',
                title_en: '🛒 My Selling',
                items: [
                    {
                        id: 'my-listings',
                        icon: Package,
                        label_th: 'ประกาศของฉัน',
                        label_en: 'My Listings',
                        href: '/profile/listings',
                        badge: userStats.listings.active,
                        children: [
                            {
                                id: 'listings-active',
                                icon: CheckCircle,
                                label_th: `กำลังขาย (${userStats.listings.active})`,
                                label_en: `Active (${userStats.listings.active})`,
                                href: '/profile/listings?status=active'
                            },
                            {
                                id: 'listings-pending',
                                icon: Clock,
                                label_th: `รอตรวจสอบ (${userStats.listings.pending})`,
                                label_en: `Pending (${userStats.listings.pending})`,
                                href: '/profile/listings?status=pending'
                            },
                            {
                                id: 'listings-expired',
                                icon: AlertCircle,
                                label_th: `หมดอายุ (${userStats.listings.expired})`,
                                label_en: `Expired (${userStats.listings.expired})`,
                                href: '/profile/listings?status=expired',
                                warning: userStats.listings.expired > 0
                            },
                            {
                                id: 'listings-sold',
                                icon: CheckCircle,
                                label_th: `ขายแล้ว (${userStats.listings.sold})`,
                                label_en: `Sold (${userStats.listings.sold})`,
                                href: '/profile/listings?status=sold'
                            }
                        ]
                    },
                    {
                        id: 'new-listing',
                        icon: Plus,
                        label_th: 'ลงประกาศใหม่',
                        label_en: 'New Listing',
                        href: '/sell',
                        highlight: true
                    },
                    {
                        id: 'chats',
                        icon: MessageCircle,
                        label_th: 'แชทกับลูกค้า',
                        label_en: 'Customer Chats',
                        href: '/profile/chats',
                        badge: userStats.unread_messages
                    },
                    {
                        id: 'reviews',
                        icon: Star,
                        label_th: 'รีวิวจากผู้ซื้อ',
                        label_en: 'Buyer Reviews',
                        href: '/profile/reviews'
                    }
                ]
            })
        }

        // === STORE SECTION (For Store Owners) ===
        if (memberType === 'store_general' || memberType === 'store_official') {
            sections.push({
                id: 'store',
                title_th: '🏪 จัดการร้านค้า',
                title_en: '🏪 Store Management',
                items: [
                    {
                        id: 'store-dashboard',
                        icon: LayoutDashboard,
                        label_th: 'แดชบอร์ด',
                        label_en: 'Dashboard',
                        href: '/store/dashboard'
                    },
                    {
                        id: 'store-products',
                        icon: Package,
                        label_th: 'สินค้าทั้งหมด',
                        label_en: 'All Products',
                        href: '/store/products',
                        badge: userStats.listings.active
                    },
                    {
                        id: 'store-orders',
                        icon: ShoppingBag,
                        label_th: 'คำสั่งซื้อ',
                        label_en: 'Orders',
                        href: '/store/orders',
                        badge: 5
                    },
                    {
                        id: 'store-messages',
                        icon: MessageCircle,
                        label_th: 'ข้อความ',
                        label_en: 'Messages',
                        href: '/store/messages',
                        badge: userStats.unread_messages
                    },
                    {
                        id: 'store-analytics',
                        icon: BarChart3,
                        label_th: 'วิเคราะห์ยอดขาย',
                        label_en: 'Analytics',
                        href: '/store/analytics'
                    },
                    {
                        id: 'store-promotions',
                        icon: Gift,
                        label_th: 'โปรโมชั่น',
                        label_en: 'Promotions',
                        href: '/store/promotions'
                    },
                    {
                        id: 'store-coupons',
                        icon: Tag,
                        label_th: 'คูปอง',
                        label_en: 'Coupons',
                        href: '/store/coupons'
                    },
                    {
                        id: 'store-finance',
                        icon: Wallet,
                        label_th: 'การเงิน',
                        label_en: 'Finance',
                        href: '/store/finance'
                    }
                ]
            })

            // Store settings
            sections.push({
                id: 'store-settings',
                title_th: '⚙️ ตั้งค่าร้านค้า',
                title_en: '⚙️ Store Settings',
                items: [
                    {
                        id: 'store-profile',
                        icon: Store,
                        label_th: 'ข้อมูลร้านค้า',
                        label_en: 'Store Profile',
                        href: '/store/settings/profile'
                    },
                    {
                        id: 'store-branding',
                        icon: ImageIcon,
                        label_th: 'โลโก้ & แบนเนอร์',
                        label_en: 'Logo & Banner',
                        href: '/store/settings/branding'
                    }
                ]
            })
        }

        // === SETTINGS SECTION (Always present) ===
        sections.push({
            id: 'settings',
            title_th: '⚙️ ตั้งค่า',
            title_en: '⚙️ Settings',
            items: [
                {
                    id: 'edit-profile',
                    icon: User,
                    label_th: 'แก้ไขโปรไฟล์',
                    label_en: 'Edit Profile',
                    href: '/profile/settings'
                },
                {
                    id: 'notifications',
                    icon: Bell,
                    label_th: 'การแจ้งเตือน',
                    label_en: 'Notifications',
                    href: '/profile/settings/notifications'
                },
                {
                    id: 'verification',
                    icon: Shield,
                    label_th: 'ยืนยันตัวตน',
                    label_en: 'Verification',
                    href: '/profile/verification',
                    highlight: true
                },
                {
                    id: 'privacy',
                    icon: Lock,
                    label_th: 'ความเป็นส่วนตัว',
                    label_en: 'Privacy',
                    href: '/profile/privacy'
                },
                {
                    id: 'language',
                    icon: Globe,
                    label_th: `ภาษา: ${language === 'th' ? 'ไทย' : 'English'}`,
                    label_en: `Language: ${language === 'th' ? 'Thai' : 'English'}`,
                    href: '/profile/settings/language'
                }
            ]
        })

        return sections
    }

    const menuSections = buildMenu()

    const handleLogout = async () => {
        await logout()
        router.push('/')
    }

    return (
        <div className={`w-full lg:w-72 flex-shrink-0 ${className}`}>
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 sticky top-24 max-h-[calc(100vh-120px)] overflow-y-auto">

                {/* Profile Header with JaiStar */}
                <ProfileHeader memberType={memberType} language={language as 'th' | 'en'} userStats={userStats} />

                {/* Menu Sections */}
                <div className="p-3 space-y-4">
                    {menuSections.map((section) => (
                        <div key={section.id}>
                            {/* Section Title */}
                            <h4 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2 px-3">
                                {language === 'th' ? section.title_th : section.title_en}
                            </h4>

                            {/* Menu Items */}
                            <nav className="space-y-1">
                                {section.items.map((item) => (
                                    <MenuItemRow
                                        key={item.id}
                                        item={item}
                                        isActive={isActive(item.href)}
                                        language={language as 'th' | 'en'}
                                        expanded={expandedItems[item.id]}
                                        onToggle={() => toggleExpand(item.id)}
                                    />
                                ))}
                            </nav>
                        </div>
                    ))}

                    {/* Upgrade CTA (For General Member only) */}
                    {memberType === 'general' && (
                        <div className="p-3">
                            <Link href="/store/create" className="block">
                                <div className="p-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl text-white">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Store className="w-5 h-5" />
                                        <span className="font-bold">
                                            {language === 'th' ? 'เปิดร้านค้ากับเรา' : 'Open Your Store'}
                                        </span>
                                    </div>
                                    <ul className="text-xs space-y-1 mb-3 opacity-90">
                                        <li>✓ {language === 'th' ? 'ลงขายไม่จำกัด' : 'Unlimited listings'}</li>
                                        <li>✓ {language === 'th' ? 'หน้าร้านส่วนตัว' : 'Custom store page'}</li>
                                        <li>✓ {language === 'th' ? 'Commission ลด 1%' : '1% lower commission'}</li>
                                    </ul>
                                    <span className="inline-block px-3 py-1.5 bg-white/20 rounded-lg text-sm font-medium">
                                        {language === 'th' ? 'เริ่มต้นฟรี →' : 'Start Free →'}
                                    </span>
                                </div>
                            </Link>
                        </div>
                    )}

                    {/* Logout */}
                    <div className="pt-2 border-t border-gray-100 dark:border-gray-700">
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-3 w-full px-3 py-2.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors"
                        >
                            <LogOut className="w-5 h-5" />
                            <span>{language === 'th' ? 'ออกจากระบบ' : 'Logout'}</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
