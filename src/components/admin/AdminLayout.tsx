/**
 * Admin Layout Component
 * Sidebar + Header + Main Content Area
 */
'use client'

import { useState, useEffect, ReactNode } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { useAdmin } from '@/contexts/AdminContext'
import { useLanguage } from '@/contexts/LanguageContext'
import { ADMIN_MENU, ICON_MAP } from '@/constants/adminMenu'
import { filterMenuByPermissions, getRoleName, getRoleColor } from '@/lib/rbac'
import {
    Menu,
    X,
    ChevronDown,
    ChevronRight,
    LogOut,
    Bell,
    Search,
    User,
    Globe
} from 'lucide-react'
import NotificationCenter from './NotificationCenter'
import AdminGuard from './AdminGuard'
import AdminGlobalSearch from './AdminGlobalSearch'

interface AdminLayoutProps {
    children: ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
    const router = useRouter()
    const pathname = usePathname()
    const { adminUser, isAdmin, loading } = useAdmin()
    const { t, language, setLanguage } = useLanguage()
    const [sidebarOpen, setSidebarOpen] = useState(true)
    const [expandedMenus, setExpandedMenus] = useState<string[]>(['dashboard'])

    useEffect(() => {
        if (!loading && !isAdmin) {
            router.push('/')
        }
    }, [isAdmin, loading, router])

    // Auto-expand menu based on current path
    useEffect(() => {
        const findActiveParent = () => {
            for (const item of ADMIN_MENU) {
                if (item.children) {
                    for (const child of item.children) {
                        if (child.path && pathname.startsWith(child.path)) {
                            setExpandedMenus(prev => {
                                if (!prev.includes(item.id)) return [...prev, item.id]
                                return prev
                            })
                            return
                        }
                    }
                }
            }
        }
        findActiveParent()
    }, [pathname])

    if (loading) return null // Or show a loader
    if (!isAdmin) return null

    // Filter menu based on role
    const filteredMenu = filterMenuByPermissions(ADMIN_MENU, adminUser?.role || 'super_admin')

    const toggleMenu = (menuId: string) => {
        setExpandedMenus(prev =>
            prev.includes(menuId)
                ? prev.filter(id => id !== menuId)
                : [...prev, menuId]
        )
    }

    const roleColor = getRoleColor(adminUser?.role || 'super_admin')
    const roleName = getRoleName(adminUser?.role || 'super_admin')

    return (
        <AdminGuard>
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
                {/* Sidebar */}
                <aside
                    className={`fixed top-0 left-0 z-40 h-screen transition-transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                        } w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700`}
                >
                    {/* Logo */}
                    <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200 dark:border-gray-700">
                        <Link href="/admin" className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-white font-bold">
                                J
                            </div>
                            <span className="font-bold text-lg">JaiKod Admin</span>
                        </Link>
                    </div>

                    {/* Admin Info */}
                    <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold">
                                {adminUser?.displayName?.[0] || 'A'}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">{adminUser?.displayName}</p>
                                <p className={`text-xs text-${roleColor}-600 dark:text-${roleColor}-400`}>
                                    {roleName}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 overflow-y-auto p-4 space-y-1">
                        {filteredMenu.map((item) => {
                            const Icon = ICON_MAP[item.icon || 'LayoutDashboard']
                            const isExpanded = expandedMenus.includes(item.id)
                            const isActive = pathname === item.path

                            if (item.children && item.children.length > 0) {
                                return (
                                    <div key={item.id}>
                                        <button
                                            onClick={() => toggleMenu(item.id)}
                                            className="w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                        >
                                            <div className="flex items-center gap-3">
                                                <Icon className="w-5 h-5 text-gray-500" />
                                                <span>{t(item.label)}</span>
                                            </div>
                                            {isExpanded ? (
                                                <ChevronDown className="w-4 h-4" />
                                            ) : (
                                                <ChevronRight className="w-4 h-4" />
                                            )}
                                        </button>
                                        {isExpanded && (
                                            <div className="ml-8 mt-1 space-y-1">
                                                {item.children.map((child) => (
                                                    <Link
                                                        key={child.id}
                                                        href={child.path || '#'}
                                                        className={`block px-3 py-2 text-sm rounded-lg transition-colors ${pathname === child.path
                                                            ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 font-medium'
                                                            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                                                            }`}
                                                    >
                                                        {t(child.label)}
                                                    </Link>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )
                            }

                            return (
                                <Link
                                    key={item.id}
                                    href={item.path || '#'}
                                    className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${isActive
                                        ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400'
                                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                                        }`}
                                >
                                    <Icon className="w-5 h-5" />
                                    <span>{t(item.label)}</span>
                                </Link>
                            )
                        })}
                    </nav>

                    {/* Logout */}
                    <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                        <button
                            onClick={() => router.push('/')}
                            className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        >
                            <LogOut className="w-5 h-5" />
                            <span>{t('common.logout') || 'ออกจากระบบ'}</span>
                        </button>
                    </div>
                </aside>

                {/* Main Content */}
                <div className={`${sidebarOpen ? 'ml-64' : 'ml-0'} transition-all`}>
                    {/* Header */}
                    <header className="h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-6">
                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </button>

                        <div className="flex items-center gap-4">
                            {/* Search */}
                            <AdminGlobalSearch />

                            {/* Language Switcher */}
                            <button
                                onClick={() => setLanguage(language === 'th' ? 'en' : 'th')}
                                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300"
                                title={language === 'th' ? 'Switch to English' : 'เปลี่ยนเป็นภาษาไทย'}
                            >
                                <Globe className="w-4 h-4" />
                                <span className="text-sm font-medium uppercase">{language}</span>
                            </button>

                            {/* Notifications */}
                            <NotificationCenter />

                            {/* Profile */}
                            <button className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white text-sm font-bold">
                                    {adminUser?.displayName?.[0] || 'A'}
                                </div>
                            </button>
                        </div>
                    </header>

                    {/* Page Content */}
                    <main className="p-6">
                        {children}
                    </main>
                </div>
            </div >
        </AdminGuard >
    )
}
