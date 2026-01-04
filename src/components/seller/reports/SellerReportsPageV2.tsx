'use client'

import React, { useState } from 'react'
import dynamic from 'next/dynamic'
import {
    BarChart3,
    TrendingUp,
    TrendingDown,
    Users,
    ShoppingBag,
    ArrowUp,
    ArrowDown,
    Calendar,
    Download,
    Filter,
    Sparkles,
    Eye,
    MousePointer,
    Clock,
    Target,
    Zap,
    Star,
    Package,
    ChevronRight,
    ChevronDown
} from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

// Dynamic import recharts
const BarChart = dynamic(() => import('recharts').then(mod => mod.BarChart), { ssr: false })
const Bar = dynamic(() => import('recharts').then(mod => mod.Bar), { ssr: false })
const XAxis = dynamic(() => import('recharts').then(mod => mod.XAxis), { ssr: false })
const YAxis = dynamic(() => import('recharts').then(mod => mod.YAxis), { ssr: false })
const CartesianGrid = dynamic(() => import('recharts').then(mod => mod.CartesianGrid), { ssr: false })
const Tooltip = dynamic(() => import('recharts').then(mod => mod.Tooltip), { ssr: false })
const ResponsiveContainer = dynamic(() => import('recharts').then(mod => mod.ResponsiveContainer), { ssr: false })
const LineChart = dynamic(() => import('recharts').then(mod => mod.LineChart), { ssr: false })
const Line = dynamic(() => import('recharts').then(mod => mod.Line), { ssr: false })
const Legend = dynamic(() => import('recharts').then(mod => mod.Legend), { ssr: false })
const AreaChart = dynamic(() => import('recharts').then(mod => mod.AreaChart), { ssr: false })
const Area = dynamic(() => import('recharts').then(mod => mod.Area), { ssr: false })
const PieChart = dynamic(() => import('recharts').then(mod => mod.PieChart), { ssr: false })
const Pie = dynamic(() => import('recharts').then(mod => mod.Pie), { ssr: false })
const Cell = dynamic(() => import('recharts').then(mod => mod.Cell), { ssr: false })

// ==================== Types ====================
interface MetricCard {
    labelTh: string
    labelEn: string
    value: string
    change: number
    icon: React.ElementType
    color: string
    bgColor: string
}

interface TopProduct {
    id: string
    name: string
    sold: number
    revenue: number
    views: number
    conversionRate: number
}

// ==================== Mock Data ====================
const salesData = [
    { name: 'ม.ค.', revenue: 42000, orders: 24, visitors: 1200 },
    { name: 'ก.พ.', revenue: 38000, orders: 19, visitors: 980 },
    { name: 'มี.ค.', revenue: 51000, orders: 32, visitors: 1450 },
    { name: 'เม.ย.', revenue: 27800, orders: 18, visitors: 890 },
    { name: 'พ.ค.', revenue: 48900, orders: 28, visitors: 1320 },
    { name: 'มิ.ย.', revenue: 53900, orders: 35, visitors: 1580 },
    { name: 'ก.ค.', revenue: 64900, orders: 42, visitors: 1890 },
]

const visitorData = [
    { name: 'จ.', visitors: 320, views: 890 },
    { name: 'อ.', visitors: 280, views: 720 },
    { name: 'พ.', visitors: 410, views: 1100 },
    { name: 'พฤ.', visitors: 350, views: 920 },
    { name: 'ศ.', visitors: 520, views: 1450 },
    { name: 'ส.', visitors: 680, views: 1820 },
    { name: 'อา.', visitors: 450, views: 1200 },
]

const trafficSources = [
    { name: 'ค้นหา', nameTh: 'ค้นหา', nameEn: 'Search', value: 45, color: '#8884d8' },
    { name: 'โดยตรง', nameTh: 'โดยตรง', nameEn: 'Direct', value: 28, color: '#82ca9d' },
    { name: 'โซเชียล', nameTh: 'โซเชียล', nameEn: 'Social', value: 18, color: '#ffc658' },
    { name: 'อ้างอิง', nameTh: 'อ้างอิง', nameEn: 'Referral', value: 9, color: '#ff8042' },
]

const topProducts: TopProduct[] = [
    { id: '1', name: 'หูฟังไร้สาย Sony WH-1000XM4', sold: 45, revenue: 135000, views: 1250, conversionRate: 3.6 },
    { id: '2', name: 'กล้อง Canon EOS R50', sold: 12, revenue: 360000, views: 890, conversionRate: 1.3 },
    { id: '3', name: 'เสื้อยืด Vintage Collection', sold: 89, revenue: 35600, views: 2100, conversionRate: 4.2 },
    { id: '4', name: 'กระเป๋าสะพาย Coach', sold: 23, revenue: 115000, views: 780, conversionRate: 2.9 },
    { id: '5', name: 'รองเท้า Nike Air Max', sold: 67, revenue: 201000, views: 1890, conversionRate: 3.5 },
]

// ==================== Helper Components ====================

/**
 * AI Report Insights
 */
function AIReportInsights() {
    const { t, language } = useLanguage()

    const insights = [
        {
            type: 'positive',
            icon: TrendingUp,
            th: '📈 ยอดขายเพิ่มขึ้น 18% เทียบกับสัปดาห์ก่อน สินค้าหมวดหูฟังขายดีที่สุด',
            en: '📈 Sales up 18% vs last week. Headphones category performing best.'
        },
        {
            type: 'opportunity',
            icon: Target,
            th: '🎯 Conversion Rate เฉลี่ย 3.2% ต่ำกว่ามาตรฐาน 5% แนะนำปรับปรุงรูปสินค้า',
            en: '🎯 Conversion Rate 3.2% below 5% benchmark. Consider improving product images.'
        },
        {
            type: 'timing',
            icon: Clock,
            th: '⏰ ช่วงเวลา 19:00-21:00 น. มีผู้เข้าชมสูงสุด แนะนำทำโปรโมชันช่วงนี้',
            en: '⏰ Peak traffic at 7-9 PM. Best time for promotions.'
        }
    ]

    return (
        <div className="bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-600 rounded-2xl p-6 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-400/20 rounded-full blur-2xl" />

            <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                        <Sparkles className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h3 className="font-bold text-lg">{t('AI สรุปผลการดำเนินงาน', 'AI Performance Summary')}</h3>
                        <p className="text-sm text-white/70">{t('วิเคราะห์แนวโน้มสัปดาห์นี้', 'This week\'s trend analysis')}</p>
                    </div>
                </div>

                <div className="space-y-2">
                    {insights.map((insight, idx) => (
                        <div
                            key={idx}
                            className={`p-3 rounded-xl text-sm ${insight.type === 'positive' ? 'bg-emerald-500/20 border border-emerald-300/30'
                                : insight.type === 'opportunity' ? 'bg-amber-500/20 border border-amber-300/30'
                                    : 'bg-white/10 border border-white/10'
                                }`}
                        >
                            {language === 'th' ? insight.th : insight.en}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

/**
 * Metric Card Component
 */
function MetricCardComponent({ metric, t, language }: { metric: MetricCard, t: (th: string, en: string) => string, language: string }) {
    const Icon = metric.icon
    const isPositive = metric.change >= 0

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border-2 border-gray-200 dark:border-gray-700 hover:border-indigo-300 transition-all">
            <div className="flex justify-between items-start mb-4">
                <div className={`w-12 h-12 ${metric.bgColor} rounded-2xl flex items-center justify-center`}>
                    <Icon className={`w-6 h-6 ${metric.color}`} />
                </div>
                <span className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${isPositive ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                    }`}>
                    {isPositive ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                    {Math.abs(metric.change)}%
                </span>
            </div>
            <p className="text-sm text-gray-500 mb-1">
                {language === 'th' ? metric.labelTh : metric.labelEn}
            </p>
            <h3 className="text-2xl font-black text-gray-900 dark:text-white">{metric.value}</h3>
        </div>
    )
}

// ==================== Main Component ====================
export default function SellerReportsPageV2() {
    const { t, language } = useLanguage()
    const [period, setPeriod] = useState<'7d' | '30d' | 'month'>('7d')

    // Metrics
    const metrics: MetricCard[] = [
        { labelTh: 'รายได้', labelEn: 'Revenue', value: '฿64,900', change: 18.5, icon: TrendingUp, color: 'text-emerald-600', bgColor: 'bg-emerald-100' },
        { labelTh: 'คำสั่งซื้อ', labelEn: 'Orders', value: '42', change: 12.2, icon: ShoppingBag, color: 'text-blue-600', bgColor: 'bg-blue-100' },
        { labelTh: 'ผู้เข้าชม', labelEn: 'Visitors', value: '1,890', change: -2.1, icon: Users, color: 'text-orange-600', bgColor: 'bg-orange-100' },
        { labelTh: 'Conversion', labelEn: 'Conversion', value: '3.2%', change: 0.4, icon: Target, color: 'text-purple-600', bgColor: 'bg-purple-100' },
    ]

    // Period tabs
    const periodTabs = [
        { id: '7d', labelTh: '7 วัน', labelEn: '7 Days' },
        { id: '30d', labelTh: '30 วัน', labelEn: '30 Days' },
        { id: 'month', labelTh: 'เดือนนี้', labelEn: 'This Month' },
    ]

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-black text-gray-900 dark:text-white">
                        {t('📊 รายงานและสถิติ', '📊 Reports & Analytics')}
                    </h1>
                    <p className="text-gray-500 mt-1">
                        {t('วิเคราะห์ผลการดำเนินงานร้านค้า', 'Analyze your shop performance')}
                    </p>
                </div>
                <div className="flex gap-3">
                    <div className="flex gap-1 bg-white dark:bg-gray-800 p-1 rounded-xl border border-gray-200 dark:border-gray-700">
                        {periodTabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setPeriod(tab.id as any)}
                                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${period === tab.id
                                    ? 'bg-indigo-600 text-white shadow-md'
                                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                                    }`}
                            >
                                {language === 'th' ? tab.labelTh : tab.labelEn}
                            </button>
                        ))}
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 text-gray-700 dark:text-gray-300 rounded-xl font-medium transition-colors">
                        <Download className="w-4 h-4" />
                        {t('ส่งออก', 'Export')}
                    </button>
                </div>
            </div>

            {/* AI Insights */}
            <AIReportInsights />

            {/* Key Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {metrics.map((metric, idx) => (
                    <MetricCardComponent key={idx} metric={metric} t={t} language={language} />
                ))}
            </div>

            {/* Charts Row */}
            <div className="grid md:grid-cols-2 gap-6">
                {/* Revenue & Orders Chart */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h3 className="font-bold text-lg text-gray-900 dark:text-white">{t('รายได้และคำสั่งซื้อ', 'Revenue & Orders')}</h3>
                            <p className="text-sm text-gray-500">{t('แนวโน้มรายเดือน', 'Monthly trend')}</p>
                        </div>
                    </div>
                    <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={salesData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12 }} />
                                <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12 }} />
                                <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12 }} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    formatter={(value, name) => [
                                        name === 'revenue' ? `฿${Number(value).toLocaleString()}` : value,
                                        name === 'revenue' ? t('รายได้', 'Revenue') : t('คำสั่งซื้อ', 'Orders')
                                    ]}
                                />
                                <Legend />
                                <Bar yAxisId="left" dataKey="revenue" fill="#8B5CF6" name={t('รายได้', 'Revenue')} radius={[4, 4, 0, 0]} barSize={20} />
                                <Bar yAxisId="right" dataKey="orders" fill="#10B981" name={t('คำสั่งซื้อ', 'Orders')} radius={[4, 4, 0, 0]} barSize={20} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Visitor Traffic Chart */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h3 className="font-bold text-lg text-gray-900 dark:text-white">{t('ผู้เข้าชมและ Pageviews', 'Visitors & Pageviews')}</h3>
                            <p className="text-sm text-gray-500">{t('รายวัน', 'Daily')}</p>
                        </div>
                    </div>
                    <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={visitorData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                <defs>
                                    <linearGradient id="colorVisitors" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#F59E0B" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12 }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12 }} />
                                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                                <Legend />
                                <Area type="monotone" dataKey="visitors" stroke="#3B82F6" fillOpacity={1} fill="url(#colorVisitors)" strokeWidth={2} name={t('ผู้เข้าชม', 'Visitors')} />
                                <Area type="monotone" dataKey="views" stroke="#F59E0B" fillOpacity={1} fill="url(#colorViews)" strokeWidth={2} name={t('Pageviews', 'Pageviews')} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Top Products Table */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex justify-between items-center">
                        <div>
                            <h3 className="font-bold text-lg text-gray-900 dark:text-white">{t('สินค้าขายดี', 'Top Products')}</h3>
                            <p className="text-sm text-gray-500">{t('จัดอันดับตามยอดขาย', 'Ranked by sales')}</p>
                        </div>
                        <button className="text-indigo-600 hover:text-indigo-700 font-medium text-sm flex items-center gap-1">
                            {t('ดูทั้งหมด', 'View All')}
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 dark:bg-gray-900/50 text-sm text-gray-600 dark:text-gray-400">
                            <tr>
                                <th className="p-4 pl-6 font-semibold text-left">#</th>
                                <th className="p-4 font-semibold text-left">{t('สินค้า', 'Product')}</th>
                                <th className="p-4 font-semibold text-right">{t('ขายแล้ว', 'Sold')}</th>
                                <th className="p-4 font-semibold text-right">{t('รายได้', 'Revenue')}</th>
                                <th className="p-4 font-semibold text-right">{t('ผู้ชม', 'Views')}</th>
                                <th className="p-4 pr-6 font-semibold text-right">{t('Conversion', 'Conversion')}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                            {topProducts.map((product, idx) => (
                                <tr key={product.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                                    <td className="p-4 pl-6">
                                        <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${idx === 0 ? 'bg-yellow-100 text-yellow-700'
                                            : idx === 1 ? 'bg-gray-100 text-gray-700'
                                                : idx === 2 ? 'bg-orange-100 text-orange-700'
                                                    : 'bg-gray-50 text-gray-500'
                                            }`}>
                                            {idx + 1}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <span className="font-medium text-gray-900 dark:text-white">{product.name}</span>
                                    </td>
                                    <td className="p-4 text-right font-bold text-gray-900 dark:text-white">
                                        {product.sold} {t('ชิ้น', 'pcs')}
                                    </td>
                                    <td className="p-4 text-right font-mono font-bold text-emerald-600">
                                        ฿{product.revenue.toLocaleString()}
                                    </td>
                                    <td className="p-4 text-right text-gray-600 dark:text-gray-400">
                                        {product.views.toLocaleString()}
                                    </td>
                                    <td className="p-4 pr-6 text-right">
                                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${product.conversionRate >= 3.5 ? 'bg-emerald-100 text-emerald-700'
                                            : product.conversionRate >= 2 ? 'bg-amber-100 text-amber-700'
                                                : 'bg-red-100 text-red-700'
                                            }`}>
                                            {product.conversionRate}%
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
