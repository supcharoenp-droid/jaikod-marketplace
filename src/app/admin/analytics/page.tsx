'use client'

import { useState, useEffect } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import { useLanguage } from '@/contexts/LanguageContext'
import {
    BarChart3, TrendingUp, Users, ShoppingBag, Store,
    DollarSign, ArrowUpRight, ArrowDownRight
} from 'lucide-react'
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend
} from 'recharts'
import { getAnalyticsDashboard, AnalyticsSummary } from '@/lib/admin/analytics-service'

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8']

export default function AnalyticsPage() {
    const { t } = useLanguage()
    const [data, setData] = useState<AnalyticsSummary | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function load() {
            setLoading(true)
            const res = await getAnalyticsDashboard()
            setData(res)
            setLoading(false)
        }
        load()
    }, [])

    return (
        <AdminLayout>
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <BarChart3 className="w-8 h-8 text-indigo-500" />
                            {t('admin.ana_title')}
                        </h1>
                        <p className="text-gray-500">Platform performance and growth insights.</p>
                    </div>
                    <div className="flex gap-2 text-sm text-gray-500 bg-white dark:bg-gray-800 px-3 py-1 rounded-lg border dark:border-gray-700">
                        <span>Last updated: {new Date().toLocaleTimeString()}</span>
                    </div>
                </div>

                {loading || !data ? (
                    <div className="h-96 flex items-center justify-center text-gray-400">Loading Analytics...</div>
                ) : (
                    <>
                        {/* KPI Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <StatCard
                                title={t('admin.ana_total_rev')}
                                value={`฿${data.totalRevenue.toLocaleString()}`}
                                icon={DollarSign}
                                color="bg-green-500"
                                trend={data.gmvGrowth}
                            />
                            <StatCard
                                title={t('admin.ana_total_orders')}
                                value={data.totalOrders.toLocaleString()}
                                icon={ShoppingBag}
                                color="bg-blue-500"
                                subtext="+120 this week"
                            />
                            <StatCard
                                title={t('admin.ana_total_users')}
                                value={data.totalUsers.toLocaleString()}
                                icon={Users}
                                color="bg-purple-500"
                                subtext="+50 today"
                            />
                            <StatCard
                                title={t('admin.ana_total_shops')}
                                value={data.totalShops.toLocaleString()}
                                icon={Store}
                                color="bg-orange-500"
                            />
                        </div>

                        {/* Charts Area */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Revenue Chart (Bar) */}
                            <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">{t('admin.ana_chart_rev')}</h3>
                                <div className="h-64 sm:h-80 w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={data.revenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                            <CartesianGrid strokeDasharray="3 3" opacity={0.3} vertical={false} />
                                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} dy={10} />
                                            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                                            <Tooltip
                                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                            />
                                            <Bar dataKey="value" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={40} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            {/* Category Chart (Pie) */}
                            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col">
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">{t('admin.ana_chart_cat')}</h3>
                                <div className="flex-1 min-h-[250px] relative">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={data.categoryData}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={60}
                                                outerRadius={80}
                                                paddingAngle={5}
                                                dataKey="value"
                                            >
                                                {data.categoryData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip />
                                            <Legend verticalAlign="bottom" height={36} />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </div>

                        {/* Recent Sales Table */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
                            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white">{t('admin.ana_recent_sales')}</h3>
                            </div>
                            <table className="w-full text-left text-sm">
                                <thead className="bg-gray-50 dark:bg-gray-900 text-gray-500">
                                    <tr>
                                        <th className="px-6 py-4">Order ID</th>
                                        <th className="px-6 py-4">Date</th>
                                        <th className="px-6 py-4">Amount</th>
                                        <th className="px-6 py-4 text-right">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                    {data.recentSales.map((sale) => (
                                        <tr key={sale.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                            <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{sale.id}</td>
                                            <td className="px-6 py-4 text-gray-500">{sale.date}</td>
                                            <td className="px-6 py-4 font-mono">฿{sale.amount.toLocaleString()}</td>
                                            <td className="px-6 py-4 text-right">
                                                <span className={`px-2 py-1 rounded text-xs font-bold capitalize
                                                    ${sale.status === 'completed' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                                                        sale.status === 'pending' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                                                            'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                                                    }`}>
                                                    {sale.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}
            </div>
        </AdminLayout>
    )
}

function StatCard({ title, value, icon: Icon, color, trend, subtext }: any) {
    // Extract color class base (e.g. bg-green-500 -> text-green-500, bg-green-50)
    // Simplify: just use the prop directly for icon bg, and hardcode variations or use style

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{value}</h3>
                </div>
                <div className={`p-3 rounded-lg text-white ${color} shadow-lg shadow-gray-200 dark:shadow-none`}>
                    <Icon className="w-5 h-5" />
                </div>
            </div>
            {(trend !== undefined || subtext) && (
                <div className="mt-4 flex items-center text-sm">
                    {trend !== undefined && (
                        <span className={`font-bold flex items-center ${trend >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                            {trend >= 0 ? <ArrowUpRight className="w-4 h-4 mr-1" /> : <ArrowDownRight className="w-4 h-4 mr-1" />}
                            {Math.abs(trend)}%
                        </span>
                    )}
                    {subtext && <span className="text-gray-400 ml-2">{subtext}</span>}
                    {trend !== undefined && <span className="text-gray-400 ml-2">vs last month</span>}
                </div>
            )}
        </div>
    )
}
