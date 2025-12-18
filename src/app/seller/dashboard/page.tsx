'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
    TrendingUp, Users, ShoppingBag, MessageSquare,
    AlertCircle, Zap, MapPin, Clock, ArrowUpRight,
    ArrowDownRight, BarChart3, Target, MousePointer2,
    Calendar, Package, Download, Plus, Rocket, FileText,
    ShieldCheck, AlertTriangle, Truck, CheckCircle2, ChevronDown, MoreHorizontal,
    Search
} from 'lucide-react'
import { getSellerDashboardData } from '@/services/sellerDashboardService'
import { SellerDashboardData, ProductPerformance, RecentOrder } from '@/types/dashboard'
import { useAuth } from '@/contexts/AuthContext'
import Link from 'next/link'
import Image from 'next/image'
import Button from '@/components/ui/Button'

export default function SellerDashboardPage() {
    const { user } = useAuth()
    const [data, setData] = useState<SellerDashboardData | null>(null)
    const [loading, setLoading] = useState(true)
    const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d')

    useEffect(() => {
        const fetchData = async () => {
            // Simulate fetch with range
            const result = await getSellerDashboardData(user?.uid || 'mock-id', timeRange)
            setData(result)
            setLoading(false)
        }
        fetchData()
    }, [user, timeRange])

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neon-purple"></div>
            </div>
        )
    }

    if (!data) return null

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-6 lg:p-8 pb-20">
            <div className="max-w-7xl mx-auto space-y-6">

                {/* 1. Header & Controls */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold bg-gradient-to-r from-neon-purple to-coral-orange bg-clip-text text-transparent">
                            Seller Dashboard
                        </h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            ยินดีต้อนรับกลับ, {user?.displayName || 'JaiKod Seller'}
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-1 flex items-center">
                            {(['7d', '30d', '90d'] as const).map((range) => (
                                <button
                                    key={range}
                                    onClick={() => setTimeRange(range)}
                                    className={`px-3 py-1.5 text-xs font-bold rounded-md transition-colors ${timeRange === range
                                            ? 'bg-neon-purple text-white shadow-sm'
                                            : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700'
                                        }`}
                                >
                                    {range.toUpperCase()}
                                </button>
                            ))}
                        </div>
                        <Button variant="outline" size="sm" className="hidden md:flex">
                            <Download className="w-4 h-4 mr-2" /> Export
                        </Button>
                    </div>
                </div>

                {/* 2. Overview Cards (Summary Bar) */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                    <StatCard
                        title="รายได้รวม (Revenue)"
                        value={`฿${data.overview.totalSales.toLocaleString()}`}
                        change={data.overview.salesChange}
                        icon={<TrendingUp className="w-5 h-5 text-green-600" />}
                        trendLabel="vs last period"
                    />
                    <StatCard
                        title="คำสั่งซื้อ (Orders)"
                        value={data.overview.totalOrders.toLocaleString()}
                        change={data.overview.ordersChange}
                        icon={<Package className="w-5 h-5 text-blue-600" />}
                        trendLabel="vs last period"
                    />
                    <StatCard
                        title="การเข้าชม (Views)"
                        value={data.overview.totalViews.toLocaleString()}
                        change={data.overview.viewsChange}
                        icon={<Users className="w-5 h-5 text-purple-600" />}
                        trendLabel="vs last period"
                    />
                    <StatCard
                        title="ข้อความ (Messages)"
                        value={data.overview.totalChats.toLocaleString()}
                        change={5.2}
                        icon={<MessageSquare className="w-5 h-5 text-orange-600" />}
                        trendLabel="response rate 98%"
                    />
                </div>

                {/* 3. Action Strip (Quick Actions) */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700 flex flex-nowrap overflow-x-auto gap-4 no-scrollbar items-center">
                    <Link href="/sell">
                        <Button variant="primary" size="sm" className="whitespace-nowrap">
                            <Plus className="w-4 h-4 mr-2" />
                            ลงขายสินค้า
                        </Button>
                    </Link>
                    <div className="w-px h-8 bg-gray-200 dark:bg-gray-700 mx-2 flex-shrink-0" />
                    <button className="flex items-center gap-2 px-4 py-2 bg-purple-50 dark:bg-purple-900/20 text-neon-purple rounded-xl text-sm font-bold whitespace-nowrap hover:bg-purple-100 transition-colors">
                        <Rocket className="w-4 h-4" />
                        โปรโมทสินค้า
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-orange-50 dark:bg-orange-900/20 text-orange-600 rounded-xl text-sm font-bold whitespace-nowrap hover:bg-orange-100 transition-colors">
                        <FileText className="w-4 h-4" />
                        จัดการสต็อก
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-xl text-sm font-bold whitespace-nowrap hover:bg-blue-100 transition-colors">
                        <ShieldCheck className="w-4 h-4" />
                        ศูนย์ตรวจสอบ
                    </button>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* Left Column: Charts & Products (2/3 width) */}
                    <div className="lg:col-span-2 space-y-6">

                        {/* Performance Chart */}
                        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="font-bold flex items-center gap-2">
                                    <BarChart3 className="w-5 h-5 text-gray-500" />
                                    แนวโน้มยอดขาย (Sales Trend)
                                </h2>
                                {/* Simple Legend */}
                                <div className="flex gap-4 text-xs font-medium">
                                    <div className="flex items-center gap-1">
                                        <div className="w-2 h-2 rounded-full bg-neon-purple" /> ยอดขาย
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <div className="w-2 h-2 rounded-full bg-gray-300" /> Views
                                    </div>
                                </div>
                            </div>

                            {/* Simple SVG Line Chart */}
                            <div className="h-64 w-full relative">
                                <SimpleLineChart data={data.chartData} />
                            </div>
                        </div>

                        {/* Top Products Table */}
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                            <div className="p-5 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
                                <h2 className="font-bold">สินค้าขายดี & คำแนะนำ (Top Products)</h2>
                                <button className="text-xs text-neon-purple font-bold">ดูทั้งหมด</button>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse min-w-[600px]">
                                    <thead className="bg-gray-50/50 dark:bg-gray-800/50 text-xs text-gray-500">
                                        <tr>
                                            <th className="py-3 px-5 font-medium">สินค้า</th>
                                            <th className="py-3 px-2 font-medium text-center">Views</th>
                                            <th className="py-3 px-2 font-medium text-center">CTR</th>
                                            <th className="py-3 px-2 font-medium text-center">Conv.</th>
                                            <th className="py-3 px-5 font-medium">AI Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-sm">
                                        {data.topProducts.map((product) => (
                                            <tr key={product.id} className="border-b border-gray-50 dark:border-gray-800 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                                                <td className="py-3 px-5">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 relative">
                                                            <Image src={product.thumbnail} alt="" fill className="object-cover" />
                                                        </div>
                                                        <div>
                                                            <div className="font-bold text-gray-900 dark:text-gray-200 line-clamp-1 max-w-[150px]">{product.title}</div>
                                                            <div className="text-[10px] text-gray-400">ID: {product.id}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-3 px-2 text-center text-gray-600 dark:text-gray-400">{product.views}</td>
                                                <td className="py-3 px-2 text-center text-gray-600 dark:text-gray-400">{product.ctr}%</td>
                                                <td className="py-3 px-2 text-center text-gray-600 dark:text-gray-400">{product.conversionRate}%</td>
                                                <td className="py-3 px-5">
                                                    {product.aiAnalysis?.recommendation ? (
                                                        <button className="text-xs flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-300 rounded-lg font-bold hover:bg-indigo-100 transition-colors w-full">
                                                            <Zap className="w-3 h-3" />
                                                            {product.aiAnalysis.recommendation}
                                                        </button>
                                                    ) : (
                                                        <span className="text-xs text-green-500 font-medium flex items-center gap-1">
                                                            <CheckCircle2 className="w-3 h-3" /> Optimized
                                                        </span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Recent Orders */}
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-5">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="font-bold">คำสั่งซื้อล่าสุด (Recent Orders)</h2>
                                <Link href="/seller/orders" className="text-xs text-neon-purple font-bold">ดูทั้งหมด</Link>
                            </div>
                            <div className="space-y-3">
                                {data.recentOrders.map(order => (
                                    <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900/50 rounded-xl">
                                        <div className="flex items-center gap-3">
                                            <div className={`p-2 rounded-full ${order.status === 'pending' ? 'bg-orange-100 text-orange-600' :
                                                order.status === 'shipping' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'}`}>
                                                <Package className="w-4 h-4" />
                                            </div>
                                            <div>
                                                <div className="text-sm font-bold text-gray-900 dark:text-gray-200">{order.productTitle}</div>
                                                <div className="text-xs text-gray-500">คุณ {order.buyerName} • ฿{order.amount.toLocaleString()}</div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${order.status === 'pending' ? 'bg-orange-100 text-orange-600' :
                                                    order.status === 'shipping' ? 'bg-blue-100 text-blue-600' :
                                                        'bg-green-100 text-green-600'
                                                }`}>
                                                {order.status}
                                            </span>
                                            <div className="text-[10px] text-gray-400 mt-1">{order.date}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: AI & Trust (1/3 width) */}
                    <div className="space-y-6">

                        {/* AI Suggestions Card */}
                        <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-3xl p-6 text-white shadow-xl shadow-indigo-200 dark:shadow-none relative overflow-hidden">
                            <div className="relative z-10">
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="bg-white/20 backdrop-blur-md p-2 rounded-lg">
                                        <Zap className="w-5 h-5 text-yellow-300 fill-yellow-300" />
                                    </div>
                                    <h2 className="font-bold text-lg">AI Suggestions</h2>
                                </div>
                                <div className="space-y-3">
                                    {data.suggestions.map((suggestion, idx) => (
                                        <div key={idx} className="bg-white/10 backdrop-blur-sm border border-white/10 p-3 rounded-xl hover:bg-white/20 transition-colors cursor-pointer group">
                                            <div className="flex justify-between items-start mb-1">
                                                <div className="text-[10px] font-bold uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded text-white/90">
                                                    {suggestion.type}
                                                </div>
                                                {suggestion.priority === 'high' && <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse" />}
                                            </div>
                                            <div className="font-bold text-sm mb-1 group-hover:underline decoration-white/50">{suggestion.title}</div>
                                            <div className="text-xs text-white/70 leading-relaxed mb-2">{suggestion.description}</div>

                                            {suggestion.estimatedCost && (
                                                <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/10">
                                                    <div className="text-xs font-bold text-yellow-300">
                                                        ใช้ {suggestion.estimatedCost} Coins
                                                    </div>
                                                    <div className="text-[10px] bg-green-500/20 text-green-300 px-1.5 py-0.5 rounded">
                                                        คาดการณ์: {suggestion.expectedImpact}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                            {/* Bg Decor */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/30 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
                            <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/30 rounded-full blur-3xl -ml-16 -mb-16 pointer-events-none" />
                        </div>

                        {/* Trust & Compliance */}
                        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                            <h3 className="font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2 mb-4">
                                <ShieldCheck className="w-5 h-5 text-green-500" />
                                ความน่าเชื่อถือ (Trust Score)
                            </h3>

                            <div className="flex items-center justify-center py-4 relative">
                                <svg className="transform -rotate-90 w-32 h-32">
                                    <circle cx="64" cy="64" r="56" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-gray-100" />
                                    <circle cx="64" cy="64" r="56" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray={351.86} strokeDashoffset={351.86 - (351.86 * data.trustStats.trustScore) / 100} className="text-green-500" strokeLinecap="round" />
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <span className="text-3xl font-black text-gray-900 dark:text-white">{data.trustStats.trustScore}</span>
                                    <span className="text-[10px] text-gray-400">เต็ม 100</span>
                                </div>
                            </div>

                            <div className="space-y-3 mt-2">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-500">สถานะ e-KYC</span>
                                    {data.trustStats.ekycStatus === 'verified' ? (
                                        <span className="flex items-center gap-1 text-green-600 font-bold text-xs bg-green-50 px-2 py-1 rounded-full">
                                            <CheckCircle2 className="w-3 h-3" /> ยืนยันแล้ว
                                        </span>
                                    ) : (
                                        <span className="text-orange-500 font-bold text-xs" >รอการตรวจสอบ</span>
                                    )}
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-500">การละเมิดกฎ</span>
                                    <span className={`font-bold ${data.trustStats.warningCount > 0 ? 'text-red-500' : 'text-green-500'}`}>
                                        {data.trustStats.warningCount} ครั้ง
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Inventory Quick View */}
                        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-bold flex items-center gap-2">
                                    <Package className="w-5 h-5 text-gray-500" />
                                    คลังสินค้า (Stock)
                                </h3>
                                <button className="p-1 hover:bg-gray-100 rounded">
                                    <ChevronDown className="w-4 h-4 text-gray-400" />
                                </button>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-xl text-center">
                                    <div className="text-2xl font-bold text-gray-900 dark:text-white">124</div>
                                    <div className="text-xs text-gray-500">พร้อมขาย</div>
                                </div>
                                <div className="bg-red-50 dark:bg-red-900/10 p-3 rounded-xl text-center">
                                    <div className="text-2xl font-bold text-red-500">3</div>
                                    <div className="text-xs text-red-400">สินค้าใกล้หมด</div>
                                </div>
                            </div>
                            <button className="w-full mt-4 py-2 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50 transition-colors">
                                จัดการคลังสินค้า (Bulk Edit)
                            </button>
                        </div>

                    </div>

                </div>
            </div>
        </div>
    )
}

// Sub-component: Stat Card
function StatCard({ title, value, change, icon, trendLabel }: { title: string, value: string, change: number, icon: React.ReactNode, trendLabel?: string }) {
    return (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="flex justify-between items-start mb-3">
                <div className="p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    {icon}
                </div>
                <div className={`flex items-center text-xs font-bold ${change >= 0 ? 'text-green-500' : 'text-red-500'} bg-gray-50 dark:bg-gray-900 px-2 py-1 rounded-full`}>
                    {change >= 0 ? <ArrowUpRight className="w-3 h-3 mr-0.5" /> : <ArrowDownRight className="w-3 h-3 mr-0.5" />}
                    {Math.abs(change)}%
                </div>
            </div>
            <div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">{title}</div>
                <div className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white leading-tight">{value}</div>
                {trendLabel && <div className="text-[10px] text-gray-400 font-medium mt-1">{trendLabel}</div>}
            </div>
        </div>
    )
}

// Sub-component: Simple Line Chart (Mock SVG)
function SimpleLineChart({ data }: { data: any[] }) {
    // Determine bounds
    const maxVal = Math.max(...data.map((d: any) => d.sales)) || 1000
    const points = data.map((d: any, i: number) => {
        const x = (i / (data.length - 1)) * 100
        const y = 100 - (d.sales / maxVal) * 80 // leave 20% padded top
        return `${x},${y}`
    }).join(' ')

    const viewPoints = data.map((d: any, i: number) => {
        const mv = Math.max(...data.map((v: any) => v.views)) || 100
        const x = (i / (data.length - 1)) * 100
        const y = 100 - (d.views / mv) * 60
        return `${x},${y}`
    }).join(' ')

    return (
        <div className="absolute inset-0 w-full h-full flex flex-col justify-end">
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full overflow-visible">
                {/* Grid Lines */}
                <line x1="0" y1="20" x2="100" y2="20" stroke="#f3f4f6" strokeWidth="0.5" />
                <line x1="0" y1="50" x2="100" y2="50" stroke="#f3f4f6" strokeWidth="0.5" />
                <line x1="0" y1="80" x2="100" y2="80" stroke="#f3f4f6" strokeWidth="0.5" />

                {/* Sales Line (Purple) */}
                <polyline
                    fill="none"
                    stroke="#8b5cf6"
                    strokeWidth="2"
                    points={points}
                    vectorEffect="non-scaling-stroke"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                {/* Views Line (Gray) */}
                <polyline
                    fill="none"
                    stroke="#d1d5db"
                    strokeWidth="2"
                    points={viewPoints}
                    vectorEffect="non-scaling-stroke"
                    strokeDasharray="4 4"
                />
            </svg>

            {/* X-Axis Labels */}
            <div className="flex justify-between text-[10px] text-gray-400 mt-2 px-1">
                {data.map((d: any, i: number) => (
                    <span key={i}>{d.date}</span>
                ))}
            </div>
        </div>
    )
}
