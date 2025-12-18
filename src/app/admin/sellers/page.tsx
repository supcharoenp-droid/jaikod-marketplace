'use client'

import { useState, useEffect } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import {
    Users, Search, Shield, ShoppingBag,
    CheckCircle, XCircle, AlertTriangle,
    MoreVertical, UserCheck, UserX
} from 'lucide-react'
import { useAdmin } from '@/contexts/AdminContext'
import { useLanguage } from '@/contexts/LanguageContext'
import { getSellers, Seller, approveSellerKYC, rejectSellerKYC, banSeller, unbanSeller } from '@/lib/admin/seller-service'
import { format } from 'date-fns'
import { th, enUS } from 'date-fns/locale'

export default function SellerManagementPage() {
    const { adminUser } = useAdmin()
    const { t, language } = useLanguage()
    const [sellers, setSellers] = useState<Seller[]>([])
    const [loading, setLoading] = useState(true)
    const [filterStatus, setFilterStatus] = useState('ALL') // ALL, PENDING, APPROVED, BANNED
    const [searchTerm, setSearchTerm] = useState('')

    // Stats
    const stats = {
        total: sellers.length,
        approved: sellers.filter(s => s.kycStatus === 'approved').length,
        pending: sellers.filter(s => s.kycStatus === 'pending').length,
        banned: sellers.filter(s => s.isSuspended).length
    }

    useEffect(() => {
        loadData()
    }, [])

    const loadData = async () => {
        setLoading(true)
        const data = await getSellers()
        setSellers(data)
        setLoading(false)
    }

    const handleAction = async (action: 'approve' | 'reject' | 'ban' | 'unban', seller: Seller) => {
        if (!adminUser) return

        let reason = ''
        if (action === 'reject' || action === 'ban') {
            const promptMsg = action === 'reject'
                ? t('admin.reason_reject') || 'Reason for rejection:'
                : t('admin.enter_ban_reason') || 'Reason for ban:'
            reason = prompt(promptMsg) || ''
            if (!reason) return // dashboard cancel
        }

        try {
            if (action === 'approve') await approveSellerKYC(adminUser, seller.id)
            if (action === 'reject') await rejectSellerKYC(adminUser, seller.id, reason)
            if (action === 'ban') await banSeller(adminUser, seller.id, reason)
            if (action === 'unban') await unbanSeller(adminUser, seller.id)

            // Reload
            loadData()
            alert(t('admin.settings_saved_success') || 'Success')
        } catch (err) {
            alert(t('common.error') || 'Error')
        }
    }

    // Filter Logic
    const filteredSellers = sellers.filter(s => {
        const matchesSearch = s.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            s.shopName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            s.email.toLowerCase().includes(searchTerm.toLowerCase())

        let matchesStatus = true
        if (filterStatus === 'PENDING') matchesStatus = s.kycStatus === 'pending'
        if (filterStatus === 'APPROVED') matchesStatus = s.kycStatus === 'approved'
        if (filterStatus === 'BANNED') matchesStatus = s.isSuspended

        return matchesSearch && matchesStatus
    })

    return (
        <AdminLayout>
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <ShoppingBag className="w-8 h-8 text-blue-600" />
                        {t('admin.menu_sellers')}
                    </h1>
                    <p className="text-gray-500 mt-1">
                        {t('admin.sellers_management_desc')}
                    </p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                        <div className="text-gray-500 text-sm mb-1">{t('admin.sellers_total')}</div>
                        <div className="text-2xl font-bold">{stats.total}</div>
                    </div>
                    <div className="bg-yellow-50 dark:bg-yellow-900/10 p-4 rounded-xl border border-yellow-100 dark:border-yellow-800">
                        <div className="text-yellow-600 text-sm mb-1">{t('admin.kyc_pending')}</div>
                        <div className="text-2xl font-bold text-yellow-700">{stats.pending}</div>
                    </div>
                    <div className="bg-green-50 dark:bg-green-900/10 p-4 rounded-xl border border-green-100 dark:border-green-800">
                        <div className="text-green-600 text-sm mb-1">{t('admin.kyc_approved')}</div>
                        <div className="text-2xl font-bold text-green-700">{stats.approved}</div>
                    </div>
                    <div className="bg-red-50 dark:bg-red-900/10 p-4 rounded-xl border border-red-100 dark:border-red-800">
                        <div className="text-red-600 text-sm mb-1">{t('admin.suspended')}</div>
                        <div className="text-2xl font-bold text-red-700">{stats.banned}</div>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex flex-col md:flex-row gap-4 justify-between bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                    <div className="flex gap-2 overflow-x-auto">
                        {['ALL', 'PENDING', 'APPROVED', 'BANNED'].map(status => (
                            <button
                                key={status}
                                onClick={() => setFilterStatus(status)}
                                className={`px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition-colors ${filterStatus === status
                                    ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300'
                                    }`}
                            >
                                {status === 'ALL' && t('admin.filter_all')}
                                {status === 'PENDING' && t('admin.filter_pending')}
                                {status === 'APPROVED' && t('admin.filter_approved')}
                                {status === 'BANNED' && t('admin.filter_suspended')}
                            </button>
                        ))}
                    </div>
                    <div className="relative w-full md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder={t('admin.search_sellers')}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-900 outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>

                {/* Table */}
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 dark:bg-gray-900 text-gray-500 font-bold uppercase text-xs">
                            <tr>
                                <th className="px-6 py-4">{t('admin.table_shop_seller')}</th>
                                <th className="px-6 py-4">{t('admin.table_kyc_status')}</th>
                                <th className="px-6 py-4">{t('admin.table_total_sales')}</th>
                                <th className="px-6 py-4">{t('admin.table_shop_score')}</th>
                                <th className="px-6 py-4">{t('admin.table_joined_at')}</th>
                                <th className="px-6 py-4 text-right">{t('common.actions')}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {filteredSellers.map(seller => (
                                <tr key={seller.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                                                {seller.shopName?.[0] || seller.displayName[0]}
                                            </div>
                                            <div>
                                                <div className="font-bold text-gray-900 dark:text-white flex items-center gap-1">
                                                    {seller.shopName || seller.displayName}
                                                    {seller.isSuspended && <span className="text-[10px] bg-red-100 text-red-600 px-1 rounded">BANNED</span>}
                                                </div>
                                                <div className="text-xs text-gray-500">{seller.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        {seller.kycStatus === 'approved' && (
                                            <span className="flex items-center gap-1 text-green-600 font-bold text-xs"><CheckCircle className="w-4 h-4" /> Passed</span>
                                        )}
                                        {seller.kycStatus === 'pending' && (
                                            <span className="flex items-center gap-1 text-yellow-600 font-bold text-xs"><AlertTriangle className="w-4 h-4" /> Pending</span>
                                        )}
                                        {seller.kycStatus === 'rejected' && (
                                            <span className="flex items-center gap-1 text-red-600 font-bold text-xs"><XCircle className="w-4 h-4" /> Rejected</span>
                                        )}
                                        {seller.kycStatus === 'none' && (
                                            <span className="flex items-center gap-1 text-gray-400 font-bold text-xs">-</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 font-mono">
                                        ฿{seller.totalSales.toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-1">
                                            <Shield className="w-4 h-4 text-purple-500" />
                                            <span className="font-bold">100</span> Score
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-gray-500">
                                        {seller.joinedAt ? format(seller.joinedAt.toDate(), 'dd MMM yy', { locale: language === 'th' ? th : enUS }) : '-'}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            {seller.kycStatus === 'pending' && (
                                                <>
                                                    <button onClick={() => handleAction('approve', seller)} className="p-2 text-green-600 hover:bg-green-50 rounded-lg" title={t('admin.kyc_approved')}>
                                                        <UserCheck className="w-5 h-5" />
                                                    </button>
                                                    <button onClick={() => handleAction('reject', seller)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg" title={t('admin.kyc_rejected')}>
                                                        <UserX className="w-5 h-5" />
                                                    </button>
                                                </>
                                            )}
                                            {seller.isSuspended ? (
                                                <button onClick={() => handleAction('unban', seller)} className="p-2 text-green-600 hover:bg-green-50 rounded-lg" title={t('admin.unban_user')}>
                                                    <CheckCircle className="w-5 h-5" />
                                                </button>
                                            ) : (
                                                <button onClick={() => handleAction('ban', seller)} className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg" title={t('admin.ban_user')}>
                                                    <AlertTriangle className="w-5 h-5" />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filteredSellers.length === 0 && !loading && (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">{t('admin.no_sellers_found')}</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
    )
}
