'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { useAuth } from '@/contexts/AuthContext'
import Button from '@/components/ui/Button'
import {
    Settings, Package, Heart, Star, Edit, MapPin,
    Calendar, LogOut, ChevronRight, TrendingUp,
    MessageCircle, ShieldCheck, Wallet, RefreshCw
} from 'lucide-react'

// Mock Data for Dashboard
const STATS = [
    { label: 'ยอดขายเดือนนี้', value: '฿0', icon: TrendingUp, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { label: 'สินค้าทั้งหมด', value: '0', icon: Package, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { label: 'คะแนนร้านค้า', value: '5.0', icon: Star, color: 'text-amber-500', bg: 'bg-amber-500/10' },
    { label: 'ผู้ติดตาม', value: '0', icon: Heart, color: 'text-rose-500', bg: 'bg-rose-500/10' },
]

export default function ProfilePage() {
    const { user, loading, logout } = useAuth()
    const router = useRouter()
    const [activeTab, setActiveTab] = useState<'products' | 'favorites' | 'reviews'>('products')
    const [isEditing, setIsEditing] = useState(false)
    const [displayName, setDisplayName] = useState('')

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login')
        }
        if (user?.displayName) {
            setDisplayName(user.displayName)
        }
    }, [user, loading, router])

    const handleLogout = async () => {
        try {
            await logout()
            router.push('/login')
        } catch (error) {
            console.error('Logout error:', error)
        }
    }

    const handleSaveProfile = async () => {
        if (!user) return

        try {
            // Import dynamically to avoid SSR issues if needed, or just standard import
            const { updateProfile } = await import('firebase/auth')
            const { auth } = await import('@/lib/firebase')

            if (auth.currentUser) {
                await updateProfile(auth.currentUser, {
                    displayName: displayName
                })
                setIsEditing(false)
                // Force reload or state update if needed, but AuthContext listener might catch it
                // In some cases we might need to manually trigger a refresh or wait for the listener
                alert('บันทึกข้อมูลสำเร็จ')
            }
        } catch (error) {
            console.error('Error updating profile:', error)
            alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล')
        }
    }

    if (loading || !user) {
        return (
            <div className="min-h-screen pt-20 flex flex-col items-center justify-center bg-gray-50/50">
                <div className="w-12 h-12 border-4 border-neon-purple border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-text-secondary animate-pulse">กำลังโหลดข้อมูล...</p>
            </div>
        )
    }

    return (
        <div className="min-h-screen pt-24 pb-12 bg-gray-50/50 dark:bg-bg-dark bg-[url('/grid-pattern.svg')]">
            <div className="container mx-auto px-4 max-w-6xl">

                {/* 1. Profile Header Section - Modern Gradient Card */}
                <div className="relative overflow-hidden bg-white dark:bg-surface-dark rounded-3xl shadow-xl shadow-purple-500/5 mb-8 border border-white/50 dark:border-gray-800">
                    {/* Background Decoration */}
                    <div className="absolute top-0 w-full h-48 bg-gradient-to-r from-violet-600 via-fuchsia-500 to-orange-400">
                        <div className="absolute inset-0 bg-black/10"></div>
                        <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-white dark:from-surface-dark to-transparent"></div>
                    </div>

                    <div className="relative px-6 md:px-10 pb-8 pt-24">
                        <div className="flex flex-col md:flex-row items-end gap-6">
                            {/* Avatar */}
                            <div className="relative group">
                                <div className="w-32 h-32 md:w-36 md:h-36 rounded-full border-[6px] border-white dark:border-surface-dark bg-gray-100 shadow-2xl flex items-center justify-center text-5xl font-bold text-gray-400 overflow-hidden relative z-10 transition-transform duration-300 group-hover:scale-105">
                                    {user.photoURL ? (
                                        <Image src={user.photoURL} alt="Profile" fill className="object-cover" />
                                    ) : (
                                        <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center">
                                            {user.displayName?.[0]?.toUpperCase() || 'U'}
                                        </div>
                                    )}
                                </div>
                                <button className="absolute bottom-2 right-2 p-2.5 bg-white dark:bg-gray-800 rounded-full shadow-lg border border-gray-100 dark:border-gray-700 text-gray-600 hover:text-neon-purple hover:scale-110 transition-all z-20">
                                    <Edit className="w-4 h-4" />
                                </button>
                            </div>

                            {/* Info */}
                            <div className="flex-1 mb-2">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div>
                                        {isEditing ? (
                                            <div className="mb-2">
                                                <input
                                                    type="text"
                                                    value={displayName}
                                                    onChange={(e) => setDisplayName(e.target.value)}
                                                    className="text-3xl font-display font-bold text-gray-900 border-b-2 border-neon-purple outline-none bg-transparent"
                                                    autoFocus
                                                />
                                            </div>
                                        ) : (
                                            <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-3">
                                                {user.displayName || 'สมาชิก JaiKod'}
                                                <div className="px-2.5 py-1 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-xs font-semibold flex items-center gap-1 shadow-sm shadow-blue-500/20">
                                                    <ShieldCheck className="w-3 h-3" />
                                                    ยืนยันตัวตนแล้ว
                                                </div>
                                            </h1>
                                        )}

                                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                                            <span className="flex items-center gap-1.5 bg-gray-100 dark:bg-gray-800/50 px-3 py-1 rounded-full">
                                                <Package className="w-4 h-4" />
                                                ID: {user.uid.slice(0, 8)}...
                                            </span>
                                            <span className="flex items-center gap-1.5">
                                                <MapPin className="w-4 h-4" />
                                                กรุงเทพฯ
                                            </span>
                                            <span className="flex items-center gap-1.5">
                                                <Calendar className="w-4 h-4" />
                                                สมาชิกใหม่
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex gap-3">
                                        {isEditing ? (
                                            <>
                                                <Button variant="outline" onClick={() => setIsEditing(false)} className="border-gray-200">
                                                    ยกเลิก
                                                </Button>
                                                <Button variant="primary" onClick={handleSaveProfile} className="shadow-lg shadow-neon-purple/20">
                                                    บันทึก
                                                </Button>
                                            </>
                                        ) : (
                                            <>
                                                <Button variant="outline" onClick={handleLogout} className="border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300">
                                                    <LogOut className="w-4 h-4 mr-2" />
                                                    ออกจากระบบ
                                                </Button>
                                                <Button variant="primary" onClick={() => setIsEditing(true)} className="shadow-lg shadow-neon-purple/20">
                                                    <Settings className="w-4 h-4 mr-2" />
                                                    ตั้งค่าโปรไฟล์
                                                </Button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. Dashboard Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8 text-black">
                    <div className="col-span-1 md:col-span-3 grid grid-cols-2 md:grid-cols-4 gap-4">
                        {STATS.map((stat, idx) => (
                            <div key={idx} className="bg-white dark:bg-surface-dark p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 hover:shadow-md transition-shadow group cursor-default">
                                <div className={`w-10 h-10 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                                    <stat.icon className="w-5 h-5" />
                                </div>
                                <div className="text-2xl font-bold font-display mb-1">{stat.value}</div>
                                <div className="text-xs text-text-secondary font-medium uppercase tracking-wide">{stat.label}</div>
                            </div>
                        ))}
                    </div>

                    {/* Wallet Card */}
                    <div className="bg-gradient-to-br from-gray-900 to-gray-800 text-white p-6 rounded-2xl shadow-lg relative overflow-hidden flex flex-col justify-between">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-10 -mt-10 blur-2xl"></div>
                        <div>
                            <div className="flex items-center gap-2 text-gray-300 mb-4 text-sm font-medium">
                                <Wallet className="w-4 h-4" />
                                กระเป๋าเงิน
                            </div>
                            <div className="text-3xl font-bold mb-1">฿0.00</div>
                            <div className="text-xs text-gray-400">รายได้รอโอนเข้าบัญชี</div>
                        </div>
                        <button className="mt-4 w-full py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-medium transition-colors backdrop-blur-sm">
                            ถอนเงิน
                        </button>
                    </div>
                </div>

                {/* 3. Main Content Tabs */}
                <div className="bg-white dark:bg-surface-dark rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 min-h-[500px] flex flex-col">
                    {/* Tab Header */}
                    <div className="flex items-center gap-1 p-2 border-b border-gray-100 dark:border-gray-800 overflow-x-auto">
                        <button
                            onClick={() => setActiveTab('products')}
                            className={`px-6 py-3 rounded-xl text-sm font-semibold transition-all whitespace-nowrap flex items-center gap-2 ${activeTab === 'products' ? 'bg-neon-purple/10 text-neon-purple' : 'text-text-secondary hover:bg-gray-50 dark:hover:bg-gray-800'}`}
                        >
                            <Package className="w-4 h-4" />
                            สินค้าของฉัน (0)
                        </button>
                        <button
                            onClick={() => setActiveTab('favorites')}
                            className={`px-6 py-3 rounded-xl text-sm font-semibold transition-all whitespace-nowrap flex items-center gap-2 ${activeTab === 'favorites' ? 'bg-rose-500/10 text-rose-600' : 'text-text-secondary hover:bg-gray-50 dark:hover:bg-gray-800'}`}
                        >
                            <Heart className="w-4 h-4" />
                            รายการที่ชอบ (3)
                        </button>
                        <button
                            onClick={() => setActiveTab('reviews')}
                            className={`px-6 py-3 rounded-xl text-sm font-semibold transition-all whitespace-nowrap flex items-center gap-2 ${activeTab === 'reviews' ? 'bg-amber-500/10 text-amber-600' : 'text-text-secondary hover:bg-gray-50 dark:hover:bg-gray-800'}`}
                        >
                            <Star className="w-4 h-4" />
                            รีวิวจากลูกค้า (0)
                        </button>
                    </div>

                    {/* Tab Content */}
                    <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
                        {activeTab === 'products' && (
                            <div className="animate-fade-in-up">
                                <div className="w-40 h-40 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6 relative">
                                    <div className="absolute inset-0 bg-neon-purple/5 rounded-full animate-ping opacity-75"></div>
                                    <Package className="w-16 h-16 text-gray-300 dark:text-gray-600" />
                                    <div className="absolute bottom-2 right-2 w-10 h-10 bg-white dark:bg-gray-700 rounded-full shadow-md flex items-center justify-center">
                                        <PlusIcon className="w-5 h-5 text-neon-purple" />
                                    </div>
                                </div>
                                <h3 className="text-xl font-bold mb-2">เริ่มสร้างรายได้ชิ้นแรก</h3>
                                <p className="text-text-secondary dark:text-gray-400 max-w-sm mx-auto mb-8 leading-relaxed">
                                    คุณยังไม่มีสินค้าที่ลงขาย ลองค้นหาของไม่ได้ใช้รอบตัว <br /> มาเปลี่ยนเป็นเงินกันเถอะ
                                </p>
                                <Button size="lg" variant="primary" onClick={() => router.push('/sell')} className="shadow-lg shadow-neon-purple/20 hover:shadow-neon-purple/40">
                                    <Package className="w-5 h-5 mr-2" />
                                    ลงขายสินค้าทันที
                                </Button>
                            </div>
                        )}

                        {activeTab === 'favorites' && (
                            <div className="animate-fade-in-up">
                                <span className="text-gray-400">ยังไม่มีรายการที่ชอบ</span>
                            </div>
                        )}
                        {activeTab === 'reviews' && (
                            <div className="animate-fade-in-up">
                                <span className="text-gray-400">ยังไม่มีรีวิว</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

function PlusIcon({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <path d="M5 12h14" />
            <path d="M12 5v14" />
        </svg>
    )
}
