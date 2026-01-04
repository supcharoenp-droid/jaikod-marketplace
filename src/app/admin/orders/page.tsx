'use client'

import { useState, useEffect } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import {
    ShoppingCart, Search, CheckCircle, XCircle, Clock,
    Truck, Package, AlertCircle
} from 'lucide-react'
import { useAdmin } from '@/contexts/AdminContext'
import { useLanguage } from '@/contexts/LanguageContext'
import { getAdminOrders, getOrderStats, updateAdminOrderStatus, refundOrder, AdminOrder } from '@/lib/admin/order-service'
import { format } from 'date-fns'
import { th, enUS } from 'date-fns/locale'

export default function OrderManagementPage() {
    const { adminUser } = useAdmin()
    const { t, language } = useLanguage()
    const [orders, setOrders] = useState<AdminOrder[]>([])
    const [stats, setStats] = useState({ total: 0, pending: 0, paid: 0, shipped: 0, completed: 0, cancelled: 0 })
    const [loading, setLoading] = useState(true)

    // Filters
    const [filterStatus, setFilterStatus] = useState('all') // all, pending_payment, paid, shipped, cancelled
    const [searchTerm, setSearchTerm] = useState('')

    // Refund Modal
    const [isRefundModalOpen, setIsRefundModalOpen] = useState(false)
    const [refundTarget, setRefundTarget] = useState<{ id: string, amount: number } | null>(null)
    const [refundReason, setRefundReason] = useState('')
    const [refundAmount, setRefundAmount] = useState(0)

    useEffect(() => {
        loadData()
    }, [filterStatus])

    const loadData = async () => {
        setLoading(true)
        const [oData, sData] = await Promise.all([
            getAdminOrders({ status: filterStatus, search: searchTerm }),
            getOrderStats()
        ])
        setOrders(oData)
        setStats(sData)
        setLoading(false)
    }

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        loadData()
    }

    const handleStatusUpdate = async (orderId: string, status: string) => {
        if (!adminUser) return
        const confirmMsg = t('admin.confirm_status_change').replace('{{status}}', status)
        if (!confirm(confirmMsg)) return

        let note = ''
        if (status === 'cancelled') {
            note = prompt(t('admin.prompt_cancel_reason')) || ''
            if (!note) return
        }

        try {
            await updateAdminOrderStatus(adminUser, orderId, status, note)
            alert(t('admin.settings_saved_success') || 'Success')
            loadData()
        } catch (e) {
            alert(t('admin.save_failed') || 'Error')
        }
    }

    const openRefundModal = (order: AdminOrder) => {
        setRefundTarget({ id: order.id, amount: order.net_total || 0 })
        setRefundAmount(order.net_total || 0)
        setRefundReason('')
        setIsRefundModalOpen(true)
    }

    const handleRefundSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!adminUser || !refundTarget) return

        if (!confirm(`ยืนยันการคืนเงิน ฿${refundAmount.toLocaleString()}?`)) return

        try {
            await refundOrder(adminUser, refundTarget.id, refundAmount, refundReason)
            setIsRefundModalOpen(false)
            alert(t('admin.refund_success') || 'Refund processed successfully')
            loadData()
        } catch (e) {
            alert('Refund Failed: ' + e)
        }
    }


    return (
        <AdminLayout>
            <div className="space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <ShoppingCart className="w-8 h-8 text-orange-500" />
                        {t('admin.orders_management')}
                    </h1>
                    <p className="text-gray-500 mt-1">
                        {t('admin.orders_desc')}
                    </p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <div className="bg-white p-4 rounded-xl border shadow-sm">
                        <div className="text-gray-500 text-xs">{t('admin.orders_total')}</div>
                        <div className="text-xl font-bold">{stats.total}</div>
                    </div>
                    <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-100">
                        <div className="text-yellow-600 text-xs">{t('admin.orders_pending_payment')}</div>
                        <div className="text-xl font-bold text-yellow-700">{stats.pending}</div>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                        <div className="text-blue-600 text-xs">{t('admin.orders_to_ship')}</div>
                        <div className="text-xl font-bold text-blue-700">{stats.paid}</div>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-xl border border-purple-100">
                        <div className="text-purple-600 text-xs">{t('admin.orders_shipping')}</div>
                        <div className="text-xl font-bold text-purple-700">{stats.shipped}</div>
                    </div>
                    <div className="bg-red-50 p-4 rounded-xl border border-red-100">
                        <div className="text-red-600 text-xs">{t('admin.orders_cancelled')}</div>
                        <div className="text-xl font-bold text-red-700">{stats.cancelled}</div>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex flex-col md:flex-row gap-4 justify-between bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                    <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
                        {[
                            { id: 'all', label: t('admin.filter_status_all') },
                            { id: 'pending_payment', label: t('admin.orders_pending_payment') },
                            { id: 'paid', label: t('admin.orders_to_ship') },
                            { id: 'shipped', label: t('admin.filter_shipped') }, // Assuming filter_shipped = 'Shipped' or fallback to orders_shipping
                            { id: 'completed', label: t('admin.filter_completed') }, // Assuming filter_completed exists or fallback
                            { id: 'cancelled', label: t('admin.orders_cancelled') }
                        ].map((f) => {
                            // Manual fallback for keys I might have missed explicitly defining as filters, reusing similar ones
                            const label = f.label || t(`admin.filter_${f.id}`) || f.id
                            return (
                                <button
                                    key={f.id}
                                    onClick={() => setFilterStatus(f.id)}
                                    className={`px-3 py-1.5 rounded-lg text-sm font-bold whitespace-nowrap ${filterStatus === f.id ? 'bg-gray-900 text-white' : 'text-gray-500 hover:bg-gray-100'}`}
                                >
                                    {label}
                                </button>
                            )
                        })}
                    </div>
                    <form onSubmit={handleSearch} className="relative w-full md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder={t('admin.search_orders_placeholder')}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 rounded-lg border outline-none focus:ring-2 focus:ring-orange-500"
                        />
                    </form>
                </div>

                {/* Table */}
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 dark:bg-gray-900 text-gray-500 font-bold uppercase text-xs">
                            <tr>
                                <th className="px-6 py-4">{t('admin.table_order_id')}</th>
                                <th className="px-6 py-4">{t('admin.table_customer')}</th>
                                <th className="px-6 py-4">{t('admin.table_total')}</th>
                                <th className="px-6 py-4">{t('admin.table_status')}</th>
                                <th className="px-6 py-4">{t('admin.table_order_date')}</th>
                                <th className="px-6 py-4 text-right">{t('admin.table_action')}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {orders.map(order => (
                                <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                    <td className="px-6 py-4 font-mono font-medium text-purple-600">
                                        #{order.order_number || order.id.substring(0, 8)}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="font-bold text-gray-900 dark:text-white">
                                            {order.shipping_address?.name || 'Unknown'}
                                        </div>
                                        <div className="text-xs text-gray-500">
                                            {order.shipping_address?.phone || '-'}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 font-bold">
                                        ฿{order.net_total?.toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-bold capitalize ${order.status === 'completed' ? 'bg-green-100 text-green-700' :
                                            order.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                                                order.status === 'paid' ? 'bg-blue-100 text-blue-700' :
                                                    order.status === 'shipped' ? 'bg-purple-100 text-purple-700' :
                                                        'bg-yellow-100 text-yellow-700'
                                            }`}>
                                            {t(`admin.status_${order.status}`) || order.status?.replace('_', ' ')}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-500 text-xs">
                                        {order.created_at ? format(order.created_at, 'dd MMM yy HH:mm', { locale: language === 'th' ? th : enUS }) : '-'}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        {/* Dynamic Actions based on status */}
                                        <div className="flex justify-end gap-2">
                                            {order.status === 'pending_payment' && (
                                                <button onClick={() => handleStatusUpdate(order.id, 'paid')} className="text-blue-600 hover:underline font-bold text-xs">
                                                    {t('admin.action_mark_paid')}
                                                </button>
                                            )}
                                            {order.status === 'paid' && (
                                                <button onClick={() => handleStatusUpdate(order.id, 'shipped')} className="text-purple-600 hover:underline font-bold text-xs">
                                                    {t('admin.action_mark_shipped')}
                                                </button>
                                            )}
                                            {order.status === 'shipped' && (
                                                <button onClick={() => handleStatusUpdate(order.id, 'completed')} className="text-green-600 hover:underline font-bold text-xs">
                                                    {t('admin.action_complete')}
                                                </button>
                                            )}
                                            {order.status !== 'cancelled' && order.status !== 'completed' && order.status !== 'refunded' && (
                                                <button onClick={() => handleStatusUpdate(order.id, 'cancelled')} className="text-red-500 hover:underline text-xs ml-2">
                                                    {t('admin.action_cancel')}
                                                </button>
                                            )}

                                            {/* Refund Button for Paid/Shipped/Cancelled/Completed */}
                                            {['paid', 'shipped', 'completed', 'cancelled'].includes(order.status) && (
                                                <button
                                                    onClick={() => openRefundModal(order)}
                                                    className="text-orange-500 hover:underline text-xs ml-2 font-bold"
                                                >
                                                    {t('admin.action_refund') || 'Refund'}
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {orders.length === 0 && !loading && (
                                <tr><td colSpan={6} className="text-center py-12 text-gray-500">{t('admin.no_products_found') || 'No orders found'}</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
                {/* Refund Modal */}
                {isRefundModalOpen && refundTarget && (
                    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                        <div className="bg-white dark:bg-gray-800 w-full max-w-md rounded-2xl shadow-xl overflow-hidden">
                            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                                <h3 className="font-bold text-lg text-red-600 flex items-center gap-2">
                                    <AlertCircle className="w-5 h-5" />
                                    {t('admin.refund_title') || 'Process Refund'}
                                </h3>
                                <button onClick={() => setIsRefundModalOpen(false)}><XCircle className="w-6 h-6 text-gray-400" /></button>
                            </div>
                            <form onSubmit={handleRefundSubmit} className="p-6 space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">{t('admin.refund_amount') || 'Refund Amount (THB)'}</label>
                                    <input
                                        type="number"
                                        max={refundTarget.amount}
                                        min={0}
                                        className="w-full border p-2 rounded-lg font-mono text-lg font-bold"
                                        value={refundAmount}
                                        onChange={e => setRefundAmount(Number(e.target.value))}
                                    />
                                    <div className="text-xs text-gray-500 mt-1">Max: ฿{refundTarget.amount.toLocaleString()}</div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">{t('admin.refund_reason') || 'Reason'}</label>
                                    <textarea
                                        required
                                        className="w-full border p-2 rounded-lg"
                                        rows={3}
                                        value={refundReason}
                                        onChange={e => setRefundReason(e.target.value)}
                                        placeholder="e.g. Out of stock, Damaged item..."
                                    ></textarea>
                                </div>
                                <div className="pt-2 flex gap-2 justify-end">
                                    <button type="button" onClick={() => setIsRefundModalOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
                                    <button type="submit" className="px-4 py-2 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700">Confirm Refund</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    )
}
