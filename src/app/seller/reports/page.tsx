'use client'

import React from 'react'
import { BarChart3, TrendingUp, Users, ShoppingBag, ArrowUp, Calendar } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend } from 'recharts'
import Button from '@/components/ui/Button'
import { useLanguage } from '@/contexts/LanguageContext'

const salesData = [
    { name: 'Jan', revenue: 4000, orders: 24 },
    { name: 'Feb', revenue: 3000, orders: 13 },
    { name: 'Mar', revenue: 2000, orders: 8 },
    { name: 'Apr', revenue: 2780, orders: 18 },
    { name: 'May', revenue: 1890, orders: 11 },
    { name: 'Jun', revenue: 2390, orders: 15 },
    { name: 'Jul', revenue: 3490, orders: 20 },
]

const visitorData = [
    { name: '01/12', visitors: 120 },
    { name: '02/12', visitors: 132 },
    { name: '03/12', visitors: 101 },
    { name: '04/12', visitors: 134 },
    { name: '05/12', visitors: 90 },
    { name: '06/12', visitors: 230 },
    { name: '07/12', visitors: 210 },
]

export default function SellerReportsPage() {
    const { t } = useLanguage()
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t('seller_reports.title')}</h1>
                    <p className="text-gray-500">{t('seller_reports.subtitle')}</p>
                </div>
                <div className="flex gap-2 bg-white dark:bg-surface-dark p-1 rounded-lg border border-gray-200 dark:border-gray-700">
                    <button className="px-3 py-1 text-sm font-medium bg-gray-100 dark:bg-gray-700 rounded-md shadow-sm">Last 7 Days</button>
                    <button className="px-3 py-1 text-sm font-medium text-gray-500 hover:text-gray-900">Last 30 Days</button>
                    <button className="px-3 py-1 text-sm font-medium text-gray-500 hover:text-gray-900">Month</button>
                </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: 'Revenue', val: '฿12,450', diff: '+12.5%', icon: TrendingUp, color: 'text-green-500', bg: 'bg-green-100' },
                    { label: 'Orders', val: '45', diff: '+5.2%', icon: ShoppingBag, color: 'text-blue-500', bg: 'bg-blue-100' },
                    { label: 'Visitors', val: '1,240', diff: '-2.1%', icon: Users, color: 'text-orange-500', bg: 'bg-orange-100' },
                    { label: 'Conversion', val: '3.6%', diff: '+0.4%', icon: BarChart3, color: 'text-purple-500', bg: 'bg-purple-100' },
                ].map((stat, i) => (
                    <div key={i} className="bg-white dark:bg-surface-dark p-6 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm">
                        <div className="flex justify-between items-start mb-4">
                            <div className={`w-10 h-10 ${stat.bg} ${stat.color} rounded-lg flex items-center justify-center`}>
                                <stat.icon className="w-5 h-5" />
                            </div>
                            <span className={`text-xs font-bold px-2 py-1 rounded-full ${stat.diff.startsWith('+') ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                                {stat.diff}
                            </span>
                        </div>
                        <p className="text-sm text-gray-500 mb-1">{stat.label}</p>
                        <h3 className="text-2xl font-bold">{stat.val}</h3>
                    </div>
                ))}
            </div>

            {/* Charts */}
            <div className="grid md:grid-cols-2 gap-6">
                {/* Sales Trend */}
                <div className="bg-white dark:bg-surface-dark p-6 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm">
                    <h3 className="font-bold mb-6">Revenue & Orders</h3>
                    <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={salesData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12 }} dy={10} />
                                <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12 }} />
                                <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12 }} />
                                <Tooltip cursor={{ fill: '#f9f9f9' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                                <Legend />
                                <Bar yAxisId="left" dataKey="revenue" fill="#8884d8" name="Revenue (฿)" radius={[4, 4, 0, 0]} barSize={20} />
                                <Bar yAxisId="right" dataKey="orders" fill="#82ca9d" name="Orders" radius={[4, 4, 0, 0]} barSize={20} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Visitor Trend */}
                <div className="bg-white dark:bg-surface-dark p-6 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm">
                    <h3 className="font-bold mb-6">Visitor Traffic</h3>
                    <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={visitorData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12 }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12 }} />
                                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                                <Line type="monotone" dataKey="visitors" stroke="#FF8042" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Product Performance Table */}
            <div className="bg-white dark:bg-surface-dark rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
                <div className="p-6 border-b border-gray-100 dark:border-gray-800 font-bold">
                    Top Products
                </div>
                <table className="w-full text-left">
                    <thead className="bg-gray-50 dark:bg-gray-800/50 text-xs text-gray-500 uppercase">
                        <tr>
                            <th className="p-4 pl-6">Product</th>
                            <th className="p-4 text-right">Unit Sold</th>
                            <th className="p-4 text-right">Revenue</th>
                            <th className="p-4 text-right pr-6">Conversion Rate</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <tr key={i} className="hover:bg-gray-50 dark:hover:bg-gray-800/20">
                                <td className="p-4 pl-6 font-medium">Vintage T-Shirt Collection #{i}</td>
                                <td className="p-4 text-right">{20 - i}</td>
                                <td className="p-4 text-right">฿{(20 - i) * 250}</td>
                                <td className="p-4 text-right pr-6 text-green-600 font-bold">{5 + i}%</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
