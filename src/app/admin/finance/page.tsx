'use client'

import { useState, useEffect } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import {
    DollarSign, Search, CheckCircle, XCircle, Clock,
    CreditCard, PieChart, ArrowUpRight, ArrowDownRight,
    Banknote
} from 'lucide-react'
import { useAdmin } from '@/contexts/AdminContext'
import { useLanguage } from '@/contexts/LanguageContext'
import { getPayouts, approvePayout, rejectPayout, getFinanceStats, seedMockPayouts, PayoutRequest, FinanceStats } from '@/lib/admin/finance-service'
import { format } from 'date-fns'
import { th, enUS } from 'date-fns/locale'

export default function FinancePage() {
    const { adminUser } = useAdmin()
    const { t, language } = useLanguage()
    const [payouts, setPayouts] = useState<PayoutRequest[]>([])
    const [stats, setStats] = useState<FinanceStats>({
        totalRevenue: 0, pendingPayoutsAmount: 0,
        pendingPayoutsCount: 0, processedPayoutsAmount: 0
    })
    const [loading, setLoading] = useState(true)
    const [filterStatus, setFilterStatus] = useState('all') // all, pending, approved, rejected

    useEffect(() => {
        // Init
        const init = async () => {
            // seedMockPayouts() // Run once if needed manually, or just rely on empty state
            await loadData()
        }
        init()
    }, [filterStatus])

    const loadData = async () => {
        setLoading(true)
        const [pData, sData] = await Promise.all([
            getPayouts(filterStatus),
            getFinanceStats()
        ])
        setPayouts(pData)
        setStats(sData)
        setLoading(false)
    }

    const handleAction = async (action: 'approve' | 'reject', item: PayoutRequest) => {
        if (!adminUser) return

        try {
            if (action === 'approve') {
                const confirmMsg = t('admin.confirm_transfer')
                    .replace('{{amount}}', item.amount.toLocaleString())
                    .replace('{{name}}', item.seller_name)
                if (!confirm(confirmMsg)) return
                await approvePayout(adminUser, item.id)
            }
            if (action === 'reject') {
                const reason = prompt(t('admin.prompt_reject_reason'))
                if (!reason) return
                await rejectPayout(adminUser, item.id, reason)
            }
            alert(t('admin.settings_saved_success') || 'Success')
            loadData()
        } catch (e) {
            alert(t('admin.save_failed') || 'Error')
        }
    }

    // Temporary seeder trigger
    const handleSeed = async () => {
        await seedMockPayouts()
        loadData()
    }

    return (
        <AdminLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <Banknote className="w-8 h-8 text-green-600" />
                            {t('admin.finance_management')}
                        </h1>
                        <p className="text-gray-500 mt-1">
                            {t('admin.finance_desc')}
                        </p>
                    </div>
                    <div>
                        {/* Button to seed mock data if empty for demo */}
                        <button onClick={handleSeed} className="text-xs text-gray-400 hover:text-gray-600">
                            {t('admin.seed_data')}
                        </button>
                    </div>
                </div>

                {/* Dashboard Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Revenue Card */}
                    <div className="bg-gradient-to-br from-indigo-600 to-blue-600 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10"><DollarSign className="w-24 h-24" /></div>
                        <div className="text-blue-100 font-medium mb-1">{t('admin.finance_total_revenue')}</div>
                        <div className="text-3xl font-bold mb-2">฿{stats.totalRevenue.toLocaleString()}</div>
                        <div className="flex items-center text-xs text-blue-200 bg-white/10 w-fit px-2 py-1 rounded">
                            <ArrowUpRight className="w-3 h-3 mr-1" /> {t('admin.est_revenue_growth')}
                        </div>
                    </div>

                    {/* Pending Payouts */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm relative">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-10 h-10 rounded-full bg-yellow-50 flex items-center justify-center text-yellow-600">
                                <Clock className="w-6 h-6" />
                            </div>
                            <span className="text-xs font-bold bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full">
                                {t('admin.pending_count_items').replace('{{count}}', stats.pendingPayoutsCount.toString())}
                            </span>
                        </div>
                        <div className="text-gray-500 text-sm">{t('admin.finance_pending_payouts')}</div>
                        <div className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                            ฿{stats.pendingPayoutsAmount.toLocaleString()}
                        </div>
                    </div>

                    {/* Processed */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm relative">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-green-600">
                                <CheckCircle className="w-6 h-6" />
                            </div>
                        </div>
                        <div className="text-gray-500 text-sm">{t('admin.finance_processed_payouts')}</div>
                        <div className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                            ฿{stats.processedPayoutsAmount.toLocaleString()}
                        </div>
                    </div>
                </div>

                {/* Payout Requests */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white">{t('admin.finance_payout_requests')}</h2>
                        <div className="flex bg-gray-100 p-1 rounded-lg">
                            {['all', 'pending', 'approved', 'rejected'].map(s => {
                                // Manual mapping if keys don't exist, strictly we should use keys
                                let label = s
                                if (s === 'all') label = t('admin.filter_status_all') || 'All'
                                if (s === 'pending') label = t('admin.filter_pending') || 'Pending'
                                if (s === 'approved') label = t('admin.filter_approved') || 'Approved'
                                if (s === 'rejected') label = t('admin.kyc_rejected') || 'Rejected' // Reuse key

                                return (
                                    <button
                                        key={s}
                                        onClick={() => setFilterStatus(s)}
                                        className={`px-3 py-1.5 rounded-md text-sm font-bold capitalize ${filterStatus === s ? 'bg-white shadow text-indigo-600' : 'text-gray-500'}`}
                                    >
                                        {label}
                                    </button>
                                )
                            })}
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-gray-50 dark:bg-gray-900 text-gray-500 font-bold uppercase text-xs">
                                <tr>
                                    <th className="px-6 py-4">{t('admin.table_payout_seller')}</th>
                                    <th className="px-6 py-4">{t('admin.table_payout_bank')}</th>
                                    <th className="px-6 py-4">{t('admin.table_payout_amount')}</th>
                                    <th className="px-6 py-4">{t('admin.table_payout_status')}</th>
                                    <th className="px-6 py-4">{t('admin.table_payout_date')}</th>
                                    <th className="px-6 py-4 text-right">{t('admin.table_action')}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                {payouts.map(p => (
                                    <tr key={p.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                        <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                                            {p.seller_name}
                                        </td>
                                        <td className="px-6 py-4 text-gray-500">
                                            <div className="flex items-center gap-2">
                                                <CreditCard className="w-4 h-4" />
                                                {p.seller_bank}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 font-mono font-bold text-lg text-green-600">
                                            ฿{p.amount.toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-bold capitalize ${p.status === 'approved' ? 'bg-green-100 text-green-700' :
                                                p.status === 'rejected' ? 'bg-red-100 text-red-700' :
                                                    'bg-yellow-100 text-yellow-700'
                                                }`}>
                                                {p.status === 'pending' ? t('admin.payout_status_pending') :
                                                    p.status === 'approved' ? t('admin.payout_status_approved') :
                                                        p.status === 'rejected' ? t('admin.payout_status_rejected') : p.status}
                                            </span>
                                            {p.reject_reason && <div className="text-xs text-red-500 mt-1">Ref: {p.reject_reason}</div>}
                                        </td>
                                        <td className="px-6 py-4 text-gray-500 text-xs">
                                            {p.created_at ? format(p.created_at, 'dd MMM yy HH:mm', { locale: language === 'th' ? th : enUS }) : '-'}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            {p.status === 'pending' && (
                                                <div className="flex justify-end gap-2">
                                                    <button
                                                        onClick={() => handleAction('approve', p)}
                                                        className="bg-green-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-green-700 shadow-sm"
                                                    >
                                                        {t('admin.action_approve_transfer')}
                                                    </button>
                                                    <button
                                                        onClick={() => handleAction('reject', p)}
                                                        className="bg-white border border-gray-300 text-gray-700 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-red-50 hover:text-red-600 hover:border-red-200"
                                                    >
                                                        {t('admin.action_reject')}
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                                {payouts.length === 0 && !loading && (
                                    <tr><td colSpan={6} className="text-center py-12 text-gray-500">
                                        {t('admin.no_payouts')}
                                        <br />
                                        <button onClick={handleSeed} className="text-blue-500 underline text-xs mt-2">{t('admin.seed_data')}</button>
                                    </td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AdminLayout>
    )
}
