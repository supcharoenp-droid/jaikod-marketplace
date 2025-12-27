'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { Search, Heart, MessageCircle, User, Menu, X, Plus, LogOut, Bell, Sparkles, SlidersHorizontal, Store, ShoppingBag } from 'lucide-react'
import Button from '@/components/ui/Button'
import { useAuth } from '@/contexts/AuthContext'
import { subscribeToNotifications, Notification } from '@/lib/notifications'
import { subscribeToUserChatRooms } from '@/lib/chat'
import NotificationCenter from '@/components/notification/NotificationCenter'
import { injectMockNotifications } from '@/services/aiNotificationService'

import ChatDropdown from './ChatDropdown'
import { useLanguage } from '@/contexts/LanguageContext'
import LanguageSwitcher from '@/components/ui/LanguageSwitcher'

export default function Header() {
    const { user, logout, storeStatus } = useAuth()
    const { t, language } = useLanguage()
    const router = useRouter()
    const pathname = usePathname()
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const [userMenuOpen, setUserMenuOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')
    const [notifications, setNotifications] = useState<Notification[]>([])
    const [unreadCount, setUnreadCount] = useState(0)
    const [unreadChatCount, setUnreadChatCount] = useState(0)
    const [showNotifications, setShowNotifications] = useState(false)

    const isSellerMode = pathname?.startsWith('/seller')

    // Subscribe to Notifications
    useEffect(() => {
        if (!user) return
        const unsubscribe = subscribeToNotifications(user.uid, (notifs) => {
            setNotifications(notifs)
            setUnreadCount(notifs.filter(n => !n.isRead).length)
            if (notifs.length === 0) injectMockNotifications(user.uid).catch(console.error)
        })
        return () => unsubscribe()
    }, [user])

    // Subscribe to Chats for Badge
    useEffect(() => {
        if (!user) return
        const unsubscribe = subscribeToUserChatRooms(user.uid, (rooms) => {
            const totalUnread = rooms.reduce((acc, room) => {
                if (room.buyer_id === user.uid) return acc + room.unread_count_buyer
                else return acc + room.unread_count_seller
            }, 0)
            setUnreadChatCount(totalUnread)
        })
        return () => unsubscribe()
    }, [user])

    const handleLogout = async () => {
        try { await logout() } catch (error) { console.error('Logout error:', error) }
    }

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        if (searchQuery.trim()) {
            router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
            setSearchQuery('')
        }
    }

    if (isSellerMode) {
        return (
            <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-8">
                        <Link href="/" className="flex items-center gap-2 group">
                            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold">S</div>
                            <span className="font-bold text-gray-900 text-lg">{t('header.seller_centre')}</span>
                        </Link>
                        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium text-gray-600">
                            <Link href="/seller" className={`hover:text-indigo-600 ${pathname === '/seller' ? 'text-indigo-600' : ''}`}>{t('header.dashboard')}</Link>
                            <Link href="/seller/products" className={`hover:text-indigo-600 ${pathname?.startsWith('/seller/products') ? 'text-indigo-600' : ''}`}>{t('header.products')}</Link>
                            <Link href="/seller/orders" className={`hover:text-indigo-600 ${pathname?.startsWith('/seller/orders') ? 'text-indigo-600' : ''}`}>{t('header.orders')}</Link>
                            <Link href="/seller/finance" className={`hover:text-indigo-600 ${pathname?.startsWith('/seller/finance') ? 'text-indigo-600' : ''}`}>{t('header.finance')}</Link>
                        </nav>
                    </div>
                    <div className="flex items-center gap-3">
                        <LanguageSwitcher />
                        <div className="hidden md:flex items-center gap-3 pr-4 border-r border-gray-200">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-bold text-gray-900">{storeStatus.shopName || user?.displayName}</p>
                                <p className="text-xs text-green-600 flex items-center gap-1">
                                    <span className="w-2 h-2 rounded-full bg-green-500"></span>
                                    {language === 'th' ? 'ออนไลน์' : 'Online'}
                                </p>
                            </div>
                            <div className="w-8 h-8 bg-gray-200 rounded-full overflow-hidden">
                                {user?.photoURL && <img src={user.photoURL} className="w-full h-full object-cover" alt="" />}
                            </div>
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => router.push('/')}>
                            <LogOut className="w-4 h-4 mr-2" />
                            {t('header.exit_to_buyer')}
                        </Button>
                    </div>
                </div>
            </header>
        )
    }

    return (
        <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm transition-all duration-300">
            <div className="container mx-auto px-4">
                {/* Desktop Header */}
                <div className="flex items-center justify-between h-20">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-3 group mr-8">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-neon-purple to-indigo-600 flex items-center justify-center text-white shadow-lg group-hover:scale-105 transition-all duration-300">
                            <span className="text-xl font-bold">J</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xl font-black tracking-tight text-gray-900">
                                JaiKod
                            </span>
                        </div>
                    </Link>

                    {/* Search Bar - Desktop */}
                    <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-2xl mx-auto">
                        <div className="relative w-full group">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder={t('header.search_placeholder')}
                                className="relative w-full pl-6 pr-32 py-3 rounded-full border border-gray-200 bg-gray-50 focus:bg-white focus:border-neon-purple focus:outline-none focus:ring-4 focus:ring-neon-purple/10 transition-all"
                            />
                            <div className="absolute right-2 top-1.5 bottom-1.5 flex items-center gap-2">
                                <button type="submit" className="h-full px-6 rounded-full bg-neon-purple text-white text-sm font-bold hover:bg-indigo-600 transition-colors shadow-md flex items-center gap-2">
                                    <Search className="w-4 h-4" />
                                    {t('common.search')}
                                </button>
                            </div>
                        </div>
                    </form>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center space-x-3 ml-8">
                        <LanguageSwitcher />
                        {user ? (
                            <>
                                <Link href="/cart">
                                    <Button variant="ghost" size="icon" className="relative text-gray-600 hover:text-neon-purple bg-gray-50 hover:bg-purple-50">
                                        <ShoppingBag className="w-5 h-5" />
                                    </Button>
                                </Link>

                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="relative text-gray-600 hover:text-neon-purple bg-gray-50 hover:bg-purple-50"
                                    onClick={() => setShowNotifications(!showNotifications)}
                                >
                                    <Bell className="w-5 h-5" />
                                    {unreadCount > 0 && (
                                        <span className="absolute top-1 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
                                    )}
                                </Button>
                                {showNotifications && (
                                    <NotificationCenter notifications={notifications} userId={user.uid} onClose={() => setShowNotifications(false)} />
                                )}

                                <ChatDropdown />

                                <div className="h-8 w-[1px] bg-gray-200 mx-2"></div>

                                {storeStatus.hasStore ? (
                                    <Link href="/seller">
                                        <Button variant="outline" size="sm" className="hidden lg:flex border-gray-200 hover:border-neon-purple hover:text-neon-purple">
                                            <Store className="w-4 h-4 mr-2" />
                                            {t('header.seller_centre')}
                                        </Button>
                                    </Link>
                                ) : (
                                    <Link href="/sell">
                                        <Button variant="outline" size="sm" className="hidden lg:flex border-gray-200 hover:border-gray-900">
                                            {t('header.start_selling')}
                                        </Button>
                                    </Link>
                                )}

                                {/* User Dropdown */}
                                <div className="relative ml-2 group">
                                    <button
                                        className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden border-2 border-transparent hover:border-neon-purple transition-all focus:outline-none"
                                        onClick={() => setUserMenuOpen(!userMenuOpen)}
                                        onBlur={() => setTimeout(() => setUserMenuOpen(false), 200)}
                                    >
                                        {user.photoURL ? (
                                            <img src={user.photoURL} className="w-full h-full object-cover" alt="Profile" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-500 font-bold bg-gray-100">
                                                {user.displayName?.[0]?.toUpperCase() || <User className="w-5 h-5" />}
                                            </div>
                                        )}
                                    </button>

                                    {/* Dropdown Menu */}
                                    <div className={`absolute right-0 top-full mt-2 w-64 bg-white rounded-2xl shadow-xl border border-gray-100 transform transition-all duration-200 origin-top-right z-50 ${userMenuOpen ? 'opacity-100 scale-100 visible' : 'opacity-0 scale-95 invisible'}`}>
                                        {/* User Info Header */}
                                        <div className="p-4 border-b border-gray-50">
                                            <p className="font-bold text-gray-900 truncate">{user.displayName}</p>
                                            <p className="text-xs text-gray-500 truncate">{user.email}</p>
                                        </div>

                                        <div className="p-2 space-y-1">
                                            <Link href="/profile/overview" className="flex items-center w-full px-3 py-2 text-sm text-gray-700 rounded-xl hover:bg-gray-50 hover:text-neon-purple transition-colors">
                                                <User className="w-4 h-4 mr-3" />
                                                {t('header.profile')}
                                            </Link>
                                            <Link href="/profile/orders" className="flex items-center w-full px-3 py-2 text-sm text-gray-700 rounded-xl hover:bg-gray-50 hover:text-neon-purple transition-colors">
                                                <ShoppingBag className="w-4 h-4 mr-3" />
                                                {t('header.orders')}
                                            </Link>
                                            <Link href="/seller" className="flex items-center w-full px-3 py-2 text-sm text-gray-700 rounded-xl hover:bg-gray-50 hover:text-neon-purple transition-colors">
                                                <Store className="w-4 h-4 mr-3" />
                                                {t('header.seller_centre')}
                                            </Link>
                                            <Link href="/profile/settings" className="flex items-center w-full px-3 py-2 text-sm text-gray-700 rounded-xl hover:bg-gray-50 hover:text-neon-purple transition-colors">
                                                <SlidersHorizontal className="w-4 h-4 mr-3" />
                                                {t('seller_dashboard.menu_settings')}
                                            </Link>
                                        </div>

                                        <div className="border-t border-gray-50 p-2">
                                            <button
                                                onClick={handleLogout}
                                                className="flex items-center w-full px-3 py-2 text-sm text-red-600 rounded-xl hover:bg-red-50 transition-colors"
                                            >
                                                <LogOut className="w-4 h-4 mr-3" />
                                                {t('header.logout')}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="flex items-center gap-3">
                                <Link href="/login">
                                    <Button variant="ghost" className="text-gray-600">{t('header.log_in')}</Button>
                                </Link>
                                <Link href="/register">
                                    <Button variant="primary" className="shadow-lg shadow-neon-purple/20">{t('header.sign_up')}</Button>
                                </Link>
                            </div>
                        )}
                    </nav>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>

                {/* Mobile Search & Filter */}
                <div className="md:hidden pb-4">
                    <form onSubmit={handleSearch} className="relative">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder={t('header.search_placeholder')}
                            className="w-full pl-10 pr-4 py-3 rounded-2xl bg-gray-100 focus:bg-white border-transparent focus:border-neon-purple focus:ring-0 text-sm"
                        />
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    </form>
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="md:hidden absolute top-full left-0 right-0 bg-white border-t border-gray-100 shadow-xl p-4">
                    <nav className="space-y-4">
                        <div className="flex justify-end p-2">
                            <LanguageSwitcher />
                        </div>
                        {user ? (
                            <>
                                <Link href="/profile" className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center font-bold">
                                        {user.displayName?.[0]}
                                    </div>
                                    <div>
                                        <div className="font-bold text-gray-900">{user.displayName}</div>
                                        <div className="text-xs text-gray-500">{t('header.view_profile')}</div>
                                    </div>
                                </Link>
                                <div className="grid grid-cols-2 gap-3">
                                    <Link href="/seller">
                                        <Button variant="outline" className="w-full justify-center">{t('header.seller_centre')}</Button>
                                    </Link>
                                    <Button variant="outline" className="w-full justify-center text-red-500" onClick={handleLogout}>{t('header.logout')}</Button>
                                </div>
                            </>
                        ) : (
                            <div className="grid grid-cols-2 gap-3">
                                <Link href="/login">
                                    <Button variant="outline" className="w-full justify-center">{t('header.log_in')}</Button>
                                </Link>
                                <Link href="/register">
                                    <Button variant="primary" className="w-full justify-center">{t('header.sign_up')}</Button>
                                </Link>
                            </div>
                        )}
                    </nav>
                </div>
            )}
        </header>
    )
}
