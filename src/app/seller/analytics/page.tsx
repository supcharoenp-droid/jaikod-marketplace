'use client'

import React from 'react'
import { BarChart3, TrendingUp, Users, ShoppingCart, DollarSign, Calendar } from 'lucide-react'
import Button from '@/components/ui/Button'

// Mock Data for Charts (Simulated with CSS bars for simplicity)
const SALES_DATA = [
    { day: 'Mon', value: 30 },
    { day: 'Tue', value: 45 },
    { day: 'Wed', value: 25 },
    { day: 'Thu', value: 60 },
    { day: 'Fri', value: 75 },
    { day: 'Sat', value: 90 },
    { day: 'Sun', value: 50 },
]

export default function SellerAnalyticsPage() {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <BarChart3 className="w-8 h-8 text-neon-purple" />
                        รายงานผล (Analytics)
                    </h1>
                    <p className="text-text-secondary dark:text-gray-400">
                        วิเคราะห์ยอดขายและพฤติกรรมลูกค้า
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                        <Calendar className="w-4 h-4 mr-2" /> 7 วันล่าสุด
                    </Button>
                </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <MetricCard
                    title="ยอดขายรวม"
                    value="฿12,500"
                    trend="+15%"
                    icon={DollarSign}
                    color="text-blue-500"
                    bg="bg-blue-500/10"
                />
                <MetricCard
                    title="คำสั่งซื้อ"
                    value="48"
                    trend="+5%"
                    icon={ShoppingCart}
                    color="text-emerald-500"
                    bg="bg-emerald-500/10"
                />
                <MetricCard
                    title="ยอดผู้เข้าชม"
                    value="1,240"
                    trend="+22%"
                    icon={Users}
                    color="text-purple-500"
                    bg="bg-purple-500/10"
                />
                <MetricCard
                    title="รายได้ต่อออเดอร์"
                    value="฿260"
                    trend="-2%"
                    icon={TrendingUp}
                    color="text-amber-500"
                    bg="bg-amber-500/10"
                    isNegative
                />
            </div>

            {/* Sales Chart (Mock) */}
            <div className="bg-white dark:bg-surface-dark p-6 rounded-xl border border-gray-100 dark:border-gray-800">
                <h3 className="text-lg font-bold mb-6">ยอดขายรายวัน</h3>
                <div className="h-64 flex items-end justify-between gap-2">
                    {SALES_DATA.map((item, index) => (
                        <div key={index} className="flex-1 flex flex-col items-center gap-2 group">
                            <div className="relative w-full flex justify-center">
                                <div
                                    className="w-full max-w-[40px] bg-neon-purple/80 rounded-t-lg transition-all group-hover:bg-neon-purple group-hover:scale-105"
                                    style={{ height: `${item.value * 2}px` }}
                                >
                                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                        {item.value}k
                                    </div>
                                </div>
                            </div>
                            <span className="text-sm text-gray-500 font-medium">{item.day}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Top Products */}
            <div className="bg-white dark:bg-surface-dark rounded-xl border border-gray-100 dark:border-gray-800 overflow-hidden">
                <div className="p-6 border-b border-gray-100 dark:border-gray-800">
                    <h3 className="text-lg font-bold">สินค้าขายดี 5 อันดับแรก</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 dark:bg-gray-800/50 text-xs text-gray-500 uppercase">
                            <tr>
                                <th className="px-6 py-4 font-medium">ชื่อสินค้า</th>
                                <th className="px-6 py-4 font-medium text-right">ราคา</th>
                                <th className="px-6 py-4 font-medium text-right">ยอดขาย (ชิ้น)</th>
                                <th className="px-6 py-4 font-medium text-right">รวมเป็นเงิน</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <tr key={i} className="hover:bg-gray-50 dark:hover:bg-gray-800/30">
                                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">สินค้า Example #{i}</td>
                                    <td className="px-6 py-4 text-right">฿{100 * i}</td>
                                    <td className="px-6 py-4 text-right">{20 - i}</td>
                                    <td className="px-6 py-4 text-right font-bold text-neon-purple">฿{(100 * i) * (20 - i)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

function MetricCard({ title, value, trend, icon: Icon, color, bg, isNegative }: any) {
    return (
        <div className="bg-white dark:bg-surface-dark p-6 rounded-xl border border-gray-100 dark:border-gray-800">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <p className="text-sm text-gray-500 mb-1">{title}</p>
                    <h3 className="text-2xl font-bold">{value}</h3>
                </div>
                <div className={`p-3 rounded-lg ${bg} ${color}`}>
                    <Icon className="w-5 h-5" />
                </div>
            </div>
            <div className="flex items-center text-xs">
                <span className={`font-bold ${isNegative ? 'text-red-500' : 'text-green-500'} flex items-center`}>
                    {trend}
                </span>
                <span className="text-gray-400 ml-1">จากสัปดาห์ที่แล้ว</span>
            </div>
        </div>
    )
}
