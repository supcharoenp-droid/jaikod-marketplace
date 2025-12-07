'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search, Heart, MessageCircle, User, Menu, X, Plus, LogOut } from 'lucide-react'
import Button from '@/components/ui/Button'
import { useAuth } from '@/contexts/AuthContext'

export default function Header() {
    const { user, logout } = useAuth()
    const router = useRouter()
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')

    const handleLogout = async () => {
        try {
            await logout()
        } catch (error) {
            console.error('Logout error:', error)
        }
    }

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        if (searchQuery.trim()) {
            router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
            setSearchQuery('')
        }
    }

    return (
        <header className="sticky top-0 z-50 bg-white/80 dark:bg-bg-dark/80 backdrop-blur-md border-b border-gray-200/50 dark:border-gray-800/50 shadow-sm transition-all duration-300">
            <div className="container mx-auto px-4">
                {/* Desktop Header */}
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-neon-purple to-coral-orange flex items-center justify-center text-white shadow-lg shadow-neon-purple/20 group-hover:shadow-neon-purple/40 group-hover:scale-105 transition-all duration-300">
                            <span className="text-2xl font-bold">J</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-2xl font-display font-black tracking-tight bg-gradient-to-r from-neon-purple to-coral-orange bg-clip-text text-transparent group-hover:opacity-80 transition-opacity">
                                JaiKod
                            </span>
                            <span className="hidden sm:block text-[10px] font-medium tracking-wider text-text-secondary uppercase">
                                AI Marketplace
                            </span>
                        </div>
                    </Link>

                    {/* Search Bar - Desktop - NOW FUNCTIONAL */}
                    <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-2xl mx-8">
                        <div className="relative w-full">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="ค้นหาสินค้า หรือถ่ายรูปเพื่อค้นหา..."
                                className="w-full pl-12 pr-4 py-3 rounded-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-surface-dark focus:outline-none focus:ring-2 focus:ring-neon-purple focus:border-transparent transition-all"
                                suppressHydrationWarning
                            />
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-1.5 rounded-full bg-neon-purple text-white text-sm font-medium hover:bg-purple-600 transition-colors">
                                ค้นหา
                            </button>
                        </div>
                    </form>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center space-x-2">
                        {user ? (
                            <>
                                <Link href="/favorites">
                                    <Button variant="ghost" size="sm" className="relative">
                                        <Heart className="w-5 h-5 mr-2" />
                                        ถูกใจ
                                    </Button>
                                </Link>
                                <Link href="/chat">
                                    <Button variant="ghost" size="sm" className="relative">
                                        <MessageCircle className="w-5 h-5 mr-2" />
                                        แชท
                                    </Button>
                                </Link>
                                <Link href="/wallet">
                                    <Button variant="ghost" size="sm" className="relative text-amber-600">
                                        <span className="mr-1">🪙</span>
                                        125
                                    </Button>
                                </Link>
                                <Link href="/seller">
                                    <Button variant="ghost" size="sm" className="relative group/seller">
                                        <div className="flex items-center gap-1">
                                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                                            ร้านค้า
                                        </div>
                                    </Button>
                                </Link>
                                <div className="relative group/profile">
                                    <Link href="/profile">
                                        <Button variant="ghost" size="sm">
                                            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-neon-purple to-coral-orange flex items-center justify-center text-white text-xs font-bold mr-2">
                                                {user.displayName?.[0] || 'U'}
                                            </div>
                                            <span className="max-w-[100px] truncate">{user.displayName || 'ผู้ใช้'}</span>
                                        </Button>
                                    </Link>
                                </div>
                                <Button variant="ghost" size="sm" onClick={handleLogout} title="ออกจากระบบ">
                                    <LogOut className="w-5 h-5" />
                                </Button>
                                <Link href="/sell">
                                    <Button variant="primary" size="sm">
                                        <Plus className="w-5 h-5 mr-2" />
                                        ลงขาย
                                    </Button>
                                </Link>
                            </>
                        ) : (
                            <>
                                <Link href="/login">
                                    <Button variant="outline" size="sm">
                                        เข้าสู่ระบบ
                                    </Button>
                                </Link>
                                <Link href="/register">
                                    <Button variant="primary" size="sm">
                                        สมัครสมาชิก
                                    </Button>
                                </Link>
                            </>
                        )}
                    </nav>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        {mobileMenuOpen ? (
                            <X className="w-6 h-6" />
                        ) : (
                            <Menu className="w-6 h-6" />
                        )}
                    </button>
                </div>

                {/* Mobile Search */}
                <div className="md:hidden pb-3">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="ค้นหาสินค้า..."
                            className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-surface-dark focus:outline-none focus:ring-2 focus:ring-neon-purple text-sm"
                            suppressHydrationWarning
                        />
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="md:hidden border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-bg-dark">
                    <nav className="container mx-auto px-4 py-4 space-y-2">
                        {user ? (
                            <>
                                <div className="px-4 py-2 mb-2 flex items-center space-x-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-neon-purple to-coral-orange flex items-center justify-center text-white font-bold">
                                        {user.displayName?.[0] || 'U'}
                                    </div>
                                    <div>
                                        <div className="font-semibold">{user.displayName || 'ผู้ใช้'}</div>
                                        <div className="text-xs text-text-secondary dark:text-gray-400">{user.email}</div>
                                    </div>
                                </div>
                                <Link href="/favorites" className="block">
                                    <Button variant="ghost" size="sm" className="w-full justify-start">
                                        <Heart className="w-5 h-5 mr-3" />
                                        ถูกใจ
                                    </Button>
                                </Link>
                                <Link href="/chat" className="block">
                                    <Button variant="ghost" size="sm" className="w-full justify-start">
                                        <MessageCircle className="w-5 h-5 mr-3" />
                                        แชท
                                    </Button>
                                </Link>
                                <Link href="/seller" className="block">
                                    <Button variant="ghost" size="sm" className="w-full justify-start text-neon-purple">
                                        <div className="w-5 h-5 mr-3 flex items-center justify-center">
                                            <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse"></span>
                                        </div>
                                        ร้านค้าของฉัน
                                    </Button>
                                </Link>
                                <Link href="/profile" className="block">
                                    <Button variant="ghost" size="sm" className="w-full justify-start">
                                        <User className="w-5 h-5 mr-3" />
                                        โปรไฟล์
                                    </Button>
                                </Link>
                                <Link href="/sell" className="block">
                                    <Button variant="primary" size="sm" className="w-full">
                                        <Plus className="w-5 h-5 mr-2" />
                                        ลงขาย
                                    </Button>
                                </Link>
                                <Button variant="ghost" size="sm" className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20" onClick={handleLogout}>
                                    <LogOut className="w-5 h-5 mr-3" />
                                    ออกจากระบบ
                                </Button>
                            </>
                        ) : (
                            <>
                                <Link href="/login" className="block">
                                    <Button variant="outline" size="sm" className="w-full">
                                        เข้าสู่ระบบ
                                    </Button>
                                </Link>
                                <Link href="/register" className="block">
                                    <Button variant="primary" size="sm" className="w-full">
                                        สมัครสมาชิก
                                    </Button>
                                </Link>
                            </>
                        )}
                    </nav>
                </div>
            )}
        </header>
    )
}
