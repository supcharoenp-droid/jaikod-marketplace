'use client'

import { useState, useEffect } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import {
    Package, Search, CheckCircle, XCircle, AlertTriangle,
    MoreVertical, Eye, Lock, Flag
} from 'lucide-react'
import { useAdmin } from '@/contexts/AdminContext'
import { useLanguage } from '@/contexts/LanguageContext'
import { getAdminProducts, getProductStats, approveProduct, rejectProduct, freezeProduct, flagProduct, AdminProduct } from '@/lib/admin/product-service'
import { format } from 'date-fns'
import { th, enUS } from 'date-fns/locale'
import Image from 'next/image'

export default function ProductManagementPage() {
    const { adminUser } = useAdmin()
    const { t, language } = useLanguage()
    const [products, setProducts] = useState<AdminProduct[]>([])
    const [stats, setStats] = useState({ total: 0, active: 0, pending: 0, suspended: 0 })
    const [loading, setLoading] = useState(true)

    // Filters
    const [filterStatus, setFilterStatus] = useState('all') // all, active, pending, suspended
    const [searchTerm, setSearchTerm] = useState('')

    useEffect(() => {
        loadData()
    }, [filterStatus])

    const loadData = async () => {
        setLoading(true)
        const [prodData, statsData] = await Promise.all([
            getAdminProducts({ status: filterStatus, search: searchTerm }),
            getProductStats()
        ])
        setProducts(prodData)
        setStats(statsData)
        setLoading(false)
    }

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        loadData()
    }

    const handleAction = async (action: 'approve' | 'reject' | 'freeze' | 'flag', product: AdminProduct) => {
        if (!adminUser) return

        try {
            if (action === 'approve') {
                if (!confirm(t('admin.confirm_approve') || 'Approve this product?')) return
                await approveProduct(adminUser, product.id)
            }
            if (action === 'reject') {
                const r = prompt(t('admin.reason_reject') || 'Reason for rejection:')
                if (!r) return
                await rejectProduct(adminUser, product.id, r)
            }
            if (action === 'freeze') {
                const r = prompt(t('admin.reason_freeze') || 'Reason for freezing:')
                if (!r) return
                await freezeProduct(adminUser, product.id, r)
            }
            if (action === 'flag') {
                const r = prompt(t('admin.reason_flag') || 'Reason for flagging:')
                if (!r) return
                await flagProduct(adminUser, product.id, r)
            }

            alert(t('admin.settings_saved_success') || 'Success')
            loadData() // reload
        } catch (e) {
            console.error(e)
            alert(t('common.error') || 'Error')
        }
    }

    return (
        <AdminLayout>
            <div className="space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <Package className="w-8 h-8 text-purple-600" />
                        {t('admin.menu_products')}
                    </h1>
                    <p className="text-gray-500 mt-1">
                        {t('admin.products_management_desc')}
                    </p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-white p-4 rounded-xl border shadow-sm">
                        <div className="text-gray-500 text-sm">{t('admin.products_total')}</div>
                        <div className="text-2xl font-bold">{stats.total.toLocaleString()}</div>
                    </div>
                    <div className="bg-green-50 p-4 rounded-xl border border-green-100">
                        <div className="text-green-600 text-sm">{t('admin.products_active')}</div>
                        <div className="text-2xl font-bold text-green-700">{stats.active.toLocaleString()}</div>
                    </div>
                    <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-100">
                        <div className="text-yellow-600 text-sm">{t('admin.products_pending')}</div>
                        <div className="text-2xl font-bold text-yellow-700">{stats.pending.toLocaleString()}</div>
                    </div>
                    <div className="bg-red-50 p-4 rounded-xl border border-red-100">
                        <div className="text-red-600 text-sm">{t('admin.products_suspended')}</div>
                        <div className="text-2xl font-bold text-red-700">{stats.suspended.toLocaleString()}</div>
                    </div>
                </div>

                {/* Toolbar */}
                <div className="flex flex-col md:flex-row gap-4 justify-between bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                    <div className="flex gap-2 bg-gray-100 p-1 rounded-lg">
                        {['all', 'active', 'pending', 'suspended'].map(s => (
                            <button
                                key={s}
                                onClick={() => setFilterStatus(s)}
                                className={`px-3 py-1.5 rounded-md text-sm font-bold capitalize ${filterStatus === s ? 'bg-white shadow text-purple-600' : 'text-gray-500'}`}
                            >
                                {s === 'all' && t('admin.filter_status_all')}
                                {s === 'active' && t('admin.filter_status_active')}
                                {s === 'pending' && t('admin.filter_status_pending')}
                                {s === 'suspended' && t('admin.filter_status_suspended')}
                            </button>
                        ))}
                    </div>
                    <form onSubmit={handleSearch} className="relative w-full md:w-80">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder={t('admin.search_products')}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 rounded-lg border outline-none focus:ring-2 focus:ring-purple-500"
                        />
                    </form>
                </div>

                {/* List */}
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 dark:bg-gray-900 text-gray-500 font-bold uppercase text-xs">
                            <tr>
                                <th className="px-6 py-4">{t('admin.table_product')}</th>
                                <th className="px-6 py-4">{t('admin.table_price')}</th>
                                <th className="px-6 py-4">{t('admin.table_seller')}</th>
                                <th className="px-6 py-4">{t('admin.table_status')}</th>
                                <th className="px-6 py-4">{t('admin.table_created_at')}</th>
                                <th className="px-6 py-4 text-right">{t('common.actions')}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {products.map(p => (
                                <tr key={p.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 relative rounded-lg overflow-hidden bg-gray-100 border">
                                                {p.images?.[0] ? (
                                                    <Image src={p.images[0].url} alt={p.title} fill className="object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-gray-400"><Package className="w-6 h-6" /></div>
                                                )}
                                            </div>
                                            <div>
                                                <div className="font-bold text-gray-900 dark:text-white line-clamp-1">{p.title}</div>
                                                <div className="text-xs text-gray-500 flex items-center gap-1">
                                                    {p.violationCount && p.violationCount > 0 ? (
                                                        <span className="text-red-500 flex items-center"><Flag className="w-3 h-3 mr-1" /> {p.violationCount} Violations</span>
                                                    ) : (
                                                        <span>{t('admin.no_flags') || 'No flags'}</span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 font-mono font-bold text-purple-600">
                                        ฿{p.price.toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-gray-900 dark:text-white font-medium">{p.seller_name}</div>
                                        <div className="text-xs text-gray-500">ID: {p.seller_id.substring(0, 6)}...</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-bold capitalize ${p.status === 'active' ? 'bg-green-100 text-green-700' :
                                            p.status === 'suspended' ? 'bg-red-100 text-red-700' :
                                                'bg-yellow-100 text-yellow-700'
                                            }`}>
                                            {p.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-500 text-xs">
                                        {p.created_at ? format(p.created_at, 'dd MMM yyyy', { locale: language === 'th' ? th : enUS }) : '-'}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            {p.status === 'pending' && (
                                                <>
                                                    <button onClick={() => handleAction('approve', p)} className="p-2 text-green-600 hover:bg-green-50 rounded-lg" title={t('common.confirm')}><CheckCircle className="w-4 h-4" /></button>
                                                    <button onClick={() => handleAction('reject', p)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg" title={t('common.delete')}><XCircle className="w-4 h-4" /></button>
                                                </>
                                            )}
                                            {p.status === 'active' && (
                                                <>
                                                    <button onClick={() => handleAction('freeze', p)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg" title="ระงับ (Freeze)"><Lock className="w-4 h-4" /></button>
                                                    <button onClick={() => handleAction('flag', p)} className="p-2 text-orange-500 hover:bg-orange-50 rounded-lg" title="แจ้งเตือน (Flag)"><Flag className="w-4 h-4" /></button>
                                                </>
                                            )}
                                            {p.status === 'suspended' && (
                                                <button onClick={() => handleAction('approve', p)} className="p-2 text-green-600 hover:bg-green-50 rounded-lg" title="ปลดระงับ (Re-activate)"><CheckCircle className="w-4 h-4" /></button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {products.length === 0 && !loading && (
                                <tr><td colSpan={6} className="text-center py-12 text-gray-500">{t('admin.no_products_found')}</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
    )
}
