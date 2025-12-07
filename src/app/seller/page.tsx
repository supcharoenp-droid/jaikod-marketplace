'use client'

import React from 'react'
import {
    ShoppingBag,
    CreditCard,
    Users,
    TrendingUp,
    Package,
    AlertCircle,
    ChevronRight,
    Search
} from 'lucide-react'
import Button from '@/components/ui/Button'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'

export default function SellerDashboard() {
    const router = useRouter()
    const { user } = useAuth()
    const [sellerProfile, setSellerProfile] = React.useState<any>(null)
    const [isLoading, setIsLoading] = React.useState(true)

    React.useEffect(() => {
        const checkProfile = async () => {
            if (!user) return

            try {
                // Import dynamically to avoid circular deps if any, or just use standard import
                const { getSellerProfile } = await import('@/lib/seller')
                const profile = await getSellerProfile(user.uid)

                if (!profile) {
                    router.push('/seller/register')
                    return
                }

                setSellerProfile(profile)
            } catch (error) {
                console.error('Error checking seller profile:', error)
            } finally {
                setIsLoading(false)
            }
        }

        checkProfile()
    }, [user, router])

    if (isLoading) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <div className="w-8 h-8 border-4 border-neon-purple border-t-transparent rounded-full animate-spin"></div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">ภาพรวมร้านค้า</h1>
                    <p className="text-text-secondary dark:text-gray-400">
                        ยินดีต้อนรับร้าน <span className="text-neon-purple font-semibold">{sellerProfile?.shop_name}</span>!
                    </p>
                </div>
                <div className="flex gap-3">
                    {sellerProfile?.shop_slug && (
                        <Button variant="outline" onClick={() => window.open(`/shop/${sellerProfile.shop_slug}`, '_blank')}>
                            <ShoppingBag className="w-5 h-5 mr-2" />
                            หน้าร้านของฉัน
                        </Button>
                    )}
                    <Button variant="primary" onClick={() => router.push('/seller/products/create')}>
                        <Package className="w-5 h-5 mr-2" />
                        ลงขายสินค้าใหม่
                    </Button>
                </div>
            </div>

            {/* Todo List / Notifications */}
            <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-xl p-4 flex items-start gap-4">
                <div className="p-2 bg-orange-100 dark:bg-orange-800/50 rounded-lg text-orange-600 dark:text-orange-400">
                    <AlertCircle className="w-6 h-6" />
                </div>
                <div className="flex-1">
                    <h3 className="font-bold text-gray-900 dark:text-white mb-1">สิ่งที่คุณต้องทำ (To Do List)</h3>
                    <div className="flex flex-wrap gap-4 mt-2">
                        <button className="text-sm text-gray-600 dark:text-gray-300 hover:text-neon-purple underline text-left">
                            • 0 คำสั่งซื้อที่ต้องจัดส่ง
                        </button>
                        <button className="text-sm text-gray-600 dark:text-gray-300 hover:text-neon-purple underline text-left">
                            • 0 สินค้าหมดสต็อก
                        </button>
                        <button className="text-sm text-gray-600 dark:text-gray-300 hover:text-neon-purple underline text-left">
                            • 0 รีวิวที่ยังไม่ได้ตอบกลับ
                        </button>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <DashboardCard
                    title="ยอดขายวันนี้"
                    value="฿0"
                    trend="+0%"
                    icon={CreditCard}
                    color="text-blue-500"
                    bg="bg-blue-500/10"
                />
                <DashboardCard
                    title="คำสั่งซื้อ"
                    value="0"
                    trend="+0"
                    icon={ShoppingBag}
                    color="text-emerald-500"
                    bg="bg-emerald-500/10"
                />
                <DashboardCard
                    title="ยอดเข้าชม"
                    value="0"
                    trend="+0%"
                    icon={Users}
                    color="text-purple-500"
                    bg="bg-purple-500/10"
                />
                <DashboardCard
                    title="อัตราซื้อซ้ำ"
                    value="0%"
                    trend="0%"
                    icon={TrendingUp}
                    color="text-amber-500"
                    bg="bg-amber-500/10"
                    isNegative={false}
                />
            </div>

            {/* Recent Orders Table */}
            <div className="bg-white dark:bg-surface-dark rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
                <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
                    <h2 className="text-lg font-bold">คำสั่งซื้อล่าสุด</h2>
                    <Button variant="outline" size="sm" onClick={() => router.push('/seller/orders')}>
                        ดูทั้งหมด <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 dark:bg-gray-800/50 text-text-secondary dark:text-gray-400 text-sm">
                                <th className="p-4 font-medium">หมายเลขคำสั่งซื้อ</th>
                                <th className="p-4 font-medium">สินค้า</th>
                                <th className="p-4 font-medium">วันที่สั่งซื้อ</th>
                                <th className="p-4 font-medium">สถานะ</th>
                                <th className="p-4 font-medium text-right">ยอดรวม</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                            <tr>
                                <td colSpan={5} className="p-8 text-center text-gray-400">
                                    ยังไม่มีคำสั่งซื้อในขณะนี้
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

function DashboardCard({
    title,
    value,
    trend,
    icon: Icon,
    color,
    bg,
    isNegative
}: {
    title: string,
    value: string,
    trend: string,
    icon: any,
    color: string,
    bg: string,
    isNegative?: boolean
}) {
    return (
        <div className="bg-white dark:bg-surface-dark p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800">
            <div className="flex items-start justify-between mb-4">
                <div>
                    <p className="text-sm text-text-secondary dark:text-gray-400 mb-1">{title}</p>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{value}</h3>
                </div>
                <div className={`p-3 rounded-xl ${bg} ${color}`}>
                    <Icon className="w-5 h-5" />
                </div>
            </div>
            <div className="flex items-center text-xs">
                <span className={`font-semibold ${isNegative ? 'text-red-500' : 'text-emerald-500'} flex items-center`}>
                    {trend}
                </span>
                <span className="text-gray-400 ml-1">เทียบกับเมื่อวาน</span>
            </div>
        </div>
    )
}
