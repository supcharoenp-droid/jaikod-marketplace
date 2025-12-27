'use client'

import React, { useState } from 'react'
import dynamic from 'next/dynamic'
import {
    Wallet,
    ArrowUpRight,
    ArrowDownLeft,
    CreditCard,
    Banknote,
    Calendar,
    TrendingUp,
    TrendingDown,
    DollarSign,
    Clock,
    CheckCircle,
    AlertCircle,
    ChevronRight,
    FileText,
    Download,
    Filter,
    Search,
    Sparkles,
    ArrowRight,
    Building2,
    Shield,
    RefreshCw
} from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

// Dynamic import recharts to disable SSR
const AreaChart = dynamic(() => import('recharts').then(mod => mod.AreaChart), { ssr: false })
const Area = dynamic(() => import('recharts').then(mod => mod.Area), { ssr: false })
const XAxis = dynamic(() => import('recharts').then(mod => mod.XAxis), { ssr: false })
const YAxis = dynamic(() => import('recharts').then(mod => mod.YAxis), { ssr: false })
const CartesianGrid = dynamic(() => import('recharts').then(mod => mod.CartesianGrid), { ssr: false })
const Tooltip = dynamic(() => import('recharts').then(mod => mod.Tooltip), { ssr: false })
const ResponsiveContainer = dynamic(() => import('recharts').then(mod => mod.ResponsiveContainer), { ssr: false })

// ==================== Types ====================
interface Transaction {
    id: string
    type: 'income' | 'withdraw' | 'fee' | 'refund'
    description: string
    descriptionTh: string
    amount: number
    date: string
    status: 'completed' | 'pending' | 'failed'
    orderId?: string
}

interface FinanceStats {
    balance: number
    pendingBalance: number
    todayIncome: number
    thisMonthIncome: number
    withdrawable: number
}

// ==================== Mock Data ====================
const chartData = [
    { name: 'จ.', income: 4200, expense: 200 },
    { name: 'อ.', income: 3800, expense: 150 },
    { name: 'พ.', income: 5100, expense: 300 },
    { name: 'พฤ.', income: 2780, expense: 100 },
    { name: 'ศ.', income: 6890, expense: 450 },
    { name: 'ส.', income: 8390, expense: 200 },
    { name: 'อา.', income: 5490, expense: 180 },
]

const transactions: Transaction[] = [
    { id: 'TX001', type: 'income', description: 'Order Payout #ORD-2390', descriptionTh: 'รับเงินจากออเดอร์ #ORD-2390', amount: 1250, date: '24 ธ.ค. 2024, 14:32', status: 'completed', orderId: 'ORD-2390' },
    { id: 'TX002', type: 'income', description: 'Order Payout #ORD-2389', descriptionTh: 'รับเงินจากออเดอร์ #ORD-2389', amount: 890, date: '24 ธ.ค. 2024, 11:15', status: 'completed', orderId: 'ORD-2389' },
    { id: 'TX003', type: 'fee', description: 'Platform Fee 3%', descriptionTh: 'ค่าธรรมเนียมแพลตฟอร์ม 3%', amount: -45, date: '24 ธ.ค. 2024, 11:15', status: 'completed' },
    { id: 'TX004', type: 'withdraw', description: 'Withdraw to Kasikorn Bank', descriptionTh: 'ถอนเงินไปธนาคารกสิกร', amount: -5000, date: '23 ธ.ค. 2024, 16:20', status: 'completed' },
    { id: 'TX005', type: 'income', description: 'Order Payout #ORD-2388', descriptionTh: 'รับเงินจากออเดอร์ #ORD-2388', amount: 2100, date: '23 ธ.ค. 2024, 09:45', status: 'pending' },
    { id: 'TX006', type: 'refund', description: 'Refund #ORD-2385', descriptionTh: 'คืนเงินออเดอร์ #ORD-2385', amount: -350, date: '22 ธ.ค. 2024, 14:10', status: 'completed' },
]

// ==================== Helper Components ====================

/**
 * AI Finance Insights
 */
function AIFinanceInsights({ stats }: { stats: FinanceStats }) {
    const { t, language } = useLanguage()

    return (
        <div className="bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-600 rounded-2xl p-6 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-teal-400/20 rounded-full blur-2xl" />

            <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                            <Sparkles className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h3 className="font-bold text-lg">{t('AI วิเคราะห์การเงิน', 'AI Finance Insights')}</h3>
                            <p className="text-sm text-white/70">{t('สรุปรายได้สัปดาห์นี้', 'This week\'s summary')}</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 pt-4 border-t border-white/20">
                    <div className="text-center">
                        <div className="text-2xl font-bold">฿{stats.todayIncome.toLocaleString()}</div>
                        <div className="text-xs text-white/70">{t('รายได้วันนี้', 'Today\'s Income')}</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold">฿{stats.thisMonthIncome.toLocaleString()}</div>
                        <div className="text-xs text-white/70">{t('เดือนนี้', 'This Month')}</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold text-yellow-300">฿{stats.pendingBalance.toLocaleString()}</div>
                        <div className="text-xs text-white/70">{t('รอโอน', 'Pending')}</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold flex items-center justify-center gap-1">
                            <TrendingUp className="w-5 h-5 text-emerald-300" />
                            +23%
                        </div>
                        <div className="text-xs text-white/70">{t('เทียบสัปดาห์ก่อน', 'vs Last Week')}</div>
                    </div>
                </div>

                <div className="mt-4 p-3 bg-white/10 rounded-xl text-sm">
                    💡 {t(
                        'ยอดขายเพิ่มขึ้น 23% จากสัปดาห์ก่อน! วันศุกร์-เสาร์มียอดสูงสุด แนะนำเพิ่มสต็อกก่อนสุดสัปดาห์',
                        'Sales up 23% from last week! Friday-Saturday peak sales. Recommend stocking up before weekends.'
                    )}
                </div>
            </div>
        </div>
    )
}

/**
 * Balance Card
 */
function BalanceCard({ stats }: { stats: FinanceStats }) {
    const { t } = useLanguage()

    return (
        <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-2xl p-8 text-white shadow-xl shadow-indigo-500/25 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

            <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                        <Wallet className="w-7 h-7 text-white" />
                    </div>
                    <div>
                        <span className="font-medium opacity-90">{t('ยอดเงินคงเหลือ', 'Seller Balance')}</span>
                        <div className="flex items-center gap-2 text-xs text-white/60">
                            <Shield className="w-3 h-3" />
                            {t('ปลอดภัย 100%', '100% Secure')}
                        </div>
                    </div>
                </div>

                <h2 className="text-5xl font-black mb-1">฿{stats.balance.toLocaleString()}</h2>
                <p className="text-sm text-white/70 mb-6">
                    {t('ถอนได้', 'Withdrawable')}: ฿{stats.withdrawable.toLocaleString()}
                </p>

                <div className="grid grid-cols-2 gap-3">
                    <button className="py-3 px-4 bg-white text-indigo-700 hover:bg-white/90 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg">
                        <ArrowUpRight className="w-5 h-5" />
                        {t('ถอนเงิน', 'Withdraw')}
                    </button>
                    <button className="py-3 px-4 bg-white/10 hover:bg-white/20 rounded-xl font-medium flex items-center justify-center gap-2 transition-all backdrop-blur-sm">
                        <FileText className="w-5 h-5" />
                        {t('รายงาน', 'Reports')}
                    </button>
                </div>
            </div>
        </div>
    )
}

/**
 * Bank Account Card
 */
function BankAccountCard() {
    const { t } = useLanguage()

    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border-2 border-gray-200 dark:border-gray-700 h-full flex flex-col">
            <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-gray-400" />
                {t('บัญชีธนาคาร', 'Linked Accounts')}
            </h3>

            <div className="space-y-3 flex-1">
                <div className="p-4 border-2 border-emerald-200 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                            <span className="text-green-700 font-bold text-sm">K+</span>
                        </div>
                        <div>
                            <p className="font-bold text-gray-900 dark:text-white">ธนาคารกสิกรไทย</p>
                            <p className="text-sm text-gray-500">xxx-x-xx889-2</p>
                        </div>
                    </div>
                    <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" />
                        {t('หลัก', 'Primary')}
                    </span>
                </div>
            </div>

            <button className="mt-4 w-full py-3 border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-indigo-400 hover:text-indigo-600 rounded-xl text-gray-500 font-medium flex items-center justify-center gap-2 transition-colors">
                + {t('เพิ่มบัญชี', 'Add Account')}
            </button>
        </div>
    )
}

/**
 * Transaction Row
 */
function TransactionRow({ tx, t, language }: { tx: Transaction, t: (th: string, en: string) => string, language: string }) {
    const typeConfig: Record<string, { icon: React.ElementType, color: string, bg: string }> = {
        income: { icon: ArrowDownLeft, color: 'text-emerald-600', bg: 'bg-emerald-100' },
        withdraw: { icon: ArrowUpRight, color: 'text-blue-600', bg: 'bg-blue-100' },
        fee: { icon: Banknote, color: 'text-amber-600', bg: 'bg-amber-100' },
        refund: { icon: RefreshCw, color: 'text-red-600', bg: 'bg-red-100' }
    }

    const statusConfig: Record<string, { labelTh: string, labelEn: string, color: string }> = {
        completed: { labelTh: 'สำเร็จ', labelEn: 'Completed', color: 'text-emerald-600' },
        pending: { labelTh: 'กำลังดำเนินการ', labelEn: 'Pending', color: 'text-amber-600' },
        failed: { labelTh: 'ล้มเหลว', labelEn: 'Failed', color: 'text-red-600' }
    }

    const typeInfo = typeConfig[tx.type] || typeConfig.income
    const statusInfo = statusConfig[tx.status] || statusConfig.completed
    const TypeIcon = typeInfo.icon

    return (
        <div className="p-4 flex justify-between items-center hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
            <div className="flex items-center gap-4">
                <div className={`p-3 ${typeInfo.bg} rounded-xl`}>
                    <TypeIcon className={`w-5 h-5 ${typeInfo.color}`} />
                </div>
                <div>
                    <p className="font-semibold text-gray-900 dark:text-white">
                        {language === 'th' ? tx.descriptionTh : tx.description}
                    </p>
                    <p className="text-xs text-gray-500">{tx.date}</p>
                </div>
            </div>
            <div className="text-right">
                <p className={`font-bold ${tx.amount >= 0 ? 'text-emerald-600' : 'text-gray-700 dark:text-gray-300'}`}>
                    {tx.amount >= 0 ? '+' : ''}฿{Math.abs(tx.amount).toLocaleString()}
                </p>
                <p className={`text-xs ${statusInfo.color}`}>
                    {language === 'th' ? statusInfo.labelTh : statusInfo.labelEn}
                </p>
            </div>
        </div>
    )
}

// ==================== Main Component ====================
export default function SellerFinancePageV2() {
    const { t, language } = useLanguage()
    const [activeTab, setActiveTab] = useState('all')

    // Stats
    const stats: FinanceStats = {
        balance: 12450,
        pendingBalance: 3200,
        todayIncome: 2140,
        thisMonthIncome: 48500,
        withdrawable: 9250
    }

    // Tabs
    const tabs = [
        { id: 'all', labelTh: 'ทั้งหมด', labelEn: 'All' },
        { id: 'income', labelTh: 'รายรับ', labelEn: 'Income' },
        { id: 'withdraw', labelTh: 'ถอนเงิน', labelEn: 'Withdrawals' },
        { id: 'fee', labelTh: 'ค่าธรรมเนียม', labelEn: 'Fees' },
    ]

    // Filter
    const filteredTx = transactions.filter(tx => activeTab === 'all' || tx.type === activeTab)

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-black text-gray-900 dark:text-white">
                        {t('💰 การเงิน', '💰 Finance')}
                    </h1>
                    <p className="text-gray-500 mt-1">
                        {t('จัดการยอดเงินและรายการธุรกรรม', 'Manage balance and transactions')}
                    </p>
                </div>
                <div className="flex gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 text-gray-700 dark:text-gray-300 rounded-xl font-medium transition-colors">
                        <Download className="w-4 h-4" />
                        {t('ดาวน์โหลดรายงาน', 'Download Report')}
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 text-gray-700 dark:text-gray-300 rounded-xl font-medium transition-colors">
                        <Banknote className="w-4 h-4" />
                        {t('ใบกำกับภาษี', 'Tax Invoice')}
                    </button>
                </div>
            </div>

            {/* AI Insights */}
            <AIFinanceInsights stats={stats} />

            {/* Balance & Bank */}
            <div className="grid md:grid-cols-2 gap-6">
                <BalanceCard stats={stats} />
                <BankAccountCard />
            </div>

            {/* Income Chart */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h3 className="font-bold text-lg text-gray-900 dark:text-white">{t('รายได้ 7 วันล่าสุด', 'Last 7 Days Income')}</h3>
                        <p className="text-sm text-gray-500">{t('แนวโน้มรายได้รายวัน', 'Daily income trend')}</p>
                    </div>
                    <select className="px-3 py-2 border-2 border-gray-200 dark:border-gray-600 rounded-xl text-sm bg-white dark:bg-gray-900">
                        <option>{t('7 วันล่าสุด', 'Last 7 days')}</option>
                        <option>{t('30 วันล่าสุด', 'Last 30 days')}</option>
                        <option>{t('เดือนนี้', 'This month')}</option>
                    </select>
                </div>
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData}>
                            <defs>
                                <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12 }} dy={10} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12 }} />
                            <Tooltip
                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                formatter={(value: number) => [`฿${value.toLocaleString()}`, 'รายได้']}
                            />
                            <Area type="monotone" dataKey="income" stroke="#10B981" fillOpacity={1} fill="url(#colorIncome)" strokeWidth={3} />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Transactions */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                            {t('ประวัติธุรกรรม', 'Transaction History')}
                        </h3>
                        <div className="flex gap-2">
                            {tabs.map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${activeTab === tab.id
                                        ? 'bg-indigo-600 text-white'
                                        : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200'
                                        }`}
                                >
                                    {language === 'th' ? tab.labelTh : tab.labelEn}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="divide-y divide-gray-100 dark:divide-gray-700">
                    {filteredTx.map(tx => (
                        <TransactionRow key={tx.id} tx={tx} t={t} language={language} />
                    ))}
                    {filteredTx.length === 0 && (
                        <div className="p-12 text-center">
                            <Wallet className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-500">{t('ไม่มีรายการ', 'No transactions')}</p>
                        </div>
                    )}
                </div>

                <div className="p-4 border-t border-gray-200 dark:border-gray-700 text-center">
                    <button className="text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1 mx-auto">
                        {t('ดูทั้งหมด', 'View All')}
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    )
}
