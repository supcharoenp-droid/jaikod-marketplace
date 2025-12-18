'use client'

import React from 'react'
import { Wallet, ArrowUpRight, ArrowDownLeft, CreditCard, Banknote, Calendar } from 'lucide-react'
import Button from '@/components/ui/Button'
import { useLanguage } from '@/contexts/LanguageContext'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const data = [
    { name: 'Mon', income: 4000 },
    { name: 'Tue', income: 3000 },
    { name: 'Wed', income: 2000 },
    { name: 'Thu', income: 2780 },
    { name: 'Fri', income: 1890 },
    { name: 'Sat', income: 2390 },
    { name: 'Sun', income: 3490 },
]

export default function SellerFinancePage() {
    const { t } = useLanguage()
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t('seller_finance.title')}</h1>
                    <p className="text-gray-500">{t('seller_finance.subtitle')}</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline">
                        <Banknote className="w-4 h-4 mr-2" />
                        {t('seller_finance.tax_invoice')}
                    </Button>
                </div>
            </div>

            {/* Wallet Overview */}
            <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl p-8 text-white shadow-xl shadow-indigo-200 dark:shadow-none relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                                <Wallet className="w-6 h-6 text-white" />
                            </div>
                            <span className="font-medium opacity-90">{t('seller_finance.seller_balance')}</span>
                        </div>
                        <h2 className="text-4xl font-bold mb-2">฿12,450.00</h2>
                        <div className="flex gap-2 text-sm opacity-75 mb-8">
                            <span>{t('seller_finance.available_withdraw')}</span>
                        </div>
                        <div className="flex gap-3">
                            <Button className="bg-white/10 hover:bg-white/20 text-white border-0 flex-1 backdrop-blur-sm">
                                <ArrowUpRight className="w-4 h-4 mr-2" />
                                {t('seller_finance.withdraw')}
                            </Button>
                            <Button className="bg-white text-indigo-700 hover:bg-gray-100 border-0 flex-1 shadow-lg">
                                <ArrowDownLeft className="w-4 h-4 mr-2" />
                                {t('seller_finance.top_up')}
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-surface-dark rounded-2xl p-6 border border-gray-100 dark:border-gray-800 flex flex-col justify-between">
                    <div>
                        <h3 className="font-bold mb-4 flex items-center gap-2">
                            <CreditCard className="w-5 h-5 text-gray-400" />
                            {t('seller_finance.linked_accounts')}
                        </h3>
                        <div className="space-y-3">
                            <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-xl flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center text-green-700 font-bold text-xs">OK</div>
                                    <div>
                                        <p className="font-bold text-sm">Kasikorn Bank</p>
                                        <p className="text-xs text-gray-500">xxx-x-xx889-2</p>
                                    </div>
                                </div>
                                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">{t('seller_finance.primary')}</span>
                            </div>
                        </div>
                    </div>
                    <Button variant="outline" className="w-full mt-4 border-dashed border-gray-300 hover:border-neon-purple hover:text-neon-purple">
                        + {t('seller_finance.add_bank_account')}
                    </Button>
                </div>
            </div>

            {/* Income Chart */}
            <div className="bg-white dark:bg-surface-dark rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-6">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-lg">{t('seller_finance.income_overview')}</h3>
                    <select className="text-sm border-gray-200 rounded-lg">
                        <option>{t('seller_finance.last_7_days')}</option>
                        <option>Last 30 Days</option>
                    </select>
                </div>
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data}>
                            <defs>
                                <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12 }} dy={10} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12 }} />
                            <Tooltip
                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                            />
                            <Area type="monotone" dataKey="income" stroke="#8884d8" fillOpacity={1} fill="url(#colorIncome)" strokeWidth={3} />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Recent Transactions */}
            <div className="bg-white dark:bg-surface-dark rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
                <div className="p-6 border-b border-gray-100 dark:border-gray-800 font-bold flex justify-between items-center">
                    <span>Recent Transactions</span>
                    <Button variant="ghost" size="sm">View All</Button>
                </div>
                <div className="divide-y divide-gray-100 dark:divide-gray-800">
                    {[1, 2, 3].map((_, i) => (
                        <div key={i} className="p-4 flex justify-between items-center hover:bg-gray-50 dark:hover:bg-gray-800/50 transition">
                            <div className="flex items-center gap-4">
                                <div className="p-2 bg-green-50 text-green-600 rounded-lg">
                                    <ArrowDownLeft className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900 dark:text-white">Order Payout #ORD-{2390 + i}</p>
                                    <p className="text-xs text-gray-500">12 Dec 2024, 14:3{i}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="font-bold text-green-600">+฿450.00</p>
                                <p className="text-xs text-gray-400">Completed</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
