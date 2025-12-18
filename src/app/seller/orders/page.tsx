'use client'

import React, { useEffect, useState } from 'react'
import {
    ShoppingBag,
    Search,
    Filter,
    Printer,
    Truck,
    CheckCircle,
    XCircle,
    MoreHorizontal,
    Package,
    AlertCircle,
    Wand2
} from 'lucide-react'
import Button from '@/components/ui/Button'
import { useAuth } from '@/contexts/AuthContext'
import { useLanguage } from '@/contexts/LanguageContext'
import { getSellerOrders, updateOrderStatus, createMockOrder, deleteOrder } from '@/lib/orders'
import { Order } from '@/types'
import Link from 'next/link'
import Image from 'next/image'

// Mock AI Fulfillment Type
const AIFulfillmentSuggestion = ({ order }: { order: Order }) => {
    const { t } = useLanguage()
    // Determine suggested box size based on items (mock logic)
    const itemCount = order.items.length
    const boxSize = itemCount > 2 ? 'Large (L)' : itemCount > 1 ? 'Medium (M)' : 'Small (S)'

    return (
        <div className="bg-indigo-50 dark:bg-indigo-900/20 p-3 rounded-lg border border-indigo-100 dark:border-indigo-800 flex items-start gap-3 mt-3">
            <div className="bg-white dark:bg-indigo-800 p-1.5 rounded-full shadow-sm">
                <Wand2 className="w-3 h-3 text-indigo-600 dark:text-indigo-300" />
            </div>
            <div>
                <p className="text-xs font-bold text-indigo-700 dark:text-indigo-300 mb-0.5">{t('seller_orders.ai_fulfillment')}</p>
                <p className="text-xs text-indigo-600 dark:text-indigo-400">
                    {t('seller_orders.recommended_package')}: <span className="font-bold">{boxSize}</span>.
                    {order.payment_method === 'cod' ? ' Remember to attach COD red label.' : ' Standard shipping label ready.'}
                </p>
            </div>
        </div>
    )
}

export default function SellerOrdersPage() {
    const { user } = useAuth()
    const { t } = useLanguage()
    const [orders, setOrders] = useState<Order[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [statusFilter, setStatusFilter] = useState<string>('all')
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedOrderIds, setSelectedOrderIds] = useState<Set<string>>(new Set())

    useEffect(() => {
        if (user) {
            fetchOrders()
        }
    }, [user])

    const fetchOrders = async () => {
        if (!user) return
        setIsLoading(true)
        try {
            const data = await getSellerOrders(user.uid)
            setOrders(data)
        } catch (error) {
            console.error(error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleStatusUpdate = async (orderId: string, newStatus: Order['status']) => {
        try {
            await updateOrderStatus(orderId, newStatus, newStatus === 'shipping' ? 'KER-123456789' : undefined)
            // Refresh local state
            setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o))
        } catch (error) {
            alert('Update failed')
        }
    }

    const generateDemoOrders = async () => {
        if (!user) return
        try {
            // Mock product for order
            const mockProduct = { id: 'prod-temp', title: 'Vintage Camera', price: 2500, images: [{ url: 'https://placehold.co/100' }] }
            await createMockOrder(user.uid, 'buyer-123', [mockProduct])
            await createMockOrder(user.uid, 'buyer-456', [mockProduct, mockProduct])
            fetchOrders()
            alert('Demo orders created!')
        } catch (error) {
            console.error(error)
        }
    }

    const filteredOrders = orders.filter(order => {
        const matchesStatus = statusFilter === 'all' || order.status === statusFilter
        const matchesSearch =
            order.order_number?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            order.items.some(i => i.product_title.toLowerCase().includes(searchQuery.toLowerCase()))
        return matchesStatus && matchesSearch
    })

    const toggleSelection = (id: string) => {
        const newSet = new Set(selectedOrderIds)
        if (newSet.has(id)) newSet.delete(id)
        else newSet.add(id)
        setSelectedOrderIds(newSet)
    }

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'pending_payment': return <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-lg text-xs font-bold">{t('seller_orders.status_pending')}</span>
            case 'paid': return <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded-lg text-xs font-bold">{t('seller_orders.status_paid')}</span>
            case 'shipping': return <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-lg text-xs font-bold">{t('seller_orders.status_shipping')}</span>
            case 'completed': return <span className="px-2 py-1 bg-green-100 text-green-700 rounded-lg text-xs font-bold">{t('seller_orders.status_completed')}</span>
            case 'cancelled': return <span className="px-2 py-1 bg-red-100 text-red-700 rounded-lg text-xs font-bold">{t('seller_orders.status_cancelled')}</span>
            default: return <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-lg text-xs font-bold">{status}</span>
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t('seller_orders.title')}</h1>
                    <p className="text-gray-500">{t('seller_orders.subtitle')}</p>
                </div>
                <div className="flex gap-2">
                    {orders.length === 0 && (
                        <Button variant="outline" onClick={generateDemoOrders}>
                            + {t('seller_orders.generate_demo')}
                        </Button>
                    )}
                    <Button variant="outline">
                        <Printer className="w-4 h-4 mr-2" />
                        {t('seller_orders.batch_print')}
                    </Button>
                </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex overflow-x-auto pb-2 gap-2 border-b border-gray-100 dark:border-gray-800">
                {['all', 'pending_payment', 'paid', 'shipping', 'completed', 'cancelled'].map(status => (
                    <button
                        key={status}
                        onClick={() => setStatusFilter(status)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${statusFilter === status
                            ? 'bg-black text-white dark:bg-white dark:text-black'
                            : 'bg-white text-gray-500 hover:bg-gray-50 dark:bg-surface-dark dark:text-gray-400 dark:hover:bg-gray-800'
                            }`}
                    >
                        {status === 'all' ? 'All Orders' : status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </button>
                ))}
            </div>

            {/* Filter Bar */}
            <div className="bg-white dark:bg-surface-dark p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <input
                        type="text"
                        placeholder={t('seller_orders.search_placeholder')}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-bg-dark focus:outline-none focus:ring-2 focus:ring-neon-purple"
                    />
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                </div>
                <Button variant="ghost" className="border">
                    <Filter className="w-4 h-4 mr-2" />
                    {t('seller_orders.filter_date')}
                </Button>
            </div>

            {/* Orders List */}
            {isLoading ? (
                <div className="flex justify-center py-12">
                    <div className="w-8 h-8 border-4 border-neon-purple border-t-transparent rounded-full animate-spin"></div>
                </div>
            ) : filteredOrders.length === 0 ? (
                <div className="bg-white dark:bg-surface-dark rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-12 text-center">
                    <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                        <ShoppingBag className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{t('seller_orders.no_orders')}</h3>
                    <p className="text-gray-500 max-w-sm mx-auto">
                        {t('seller_orders.no_orders_desc')}
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {filteredOrders.map(order => (
                        <div key={order.id} className="bg-white dark:bg-surface-dark p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800">
                            <div className="flex flex-col md:flex-row gap-6">
                                {/* Product Summary */}
                                <div className="flex-1">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <input
                                                type="checkbox"
                                                checked={selectedOrderIds.has(order.id)}
                                                onChange={() => toggleSelection(order.id)}
                                                className="rounded border-gray-300"
                                            />
                                            <div className="text-sm font-bold text-gray-900 dark:text-white">{order.order_number}</div>
                                            <div className="text-xs text-gray-500">{new Date(order.created_at).toLocaleDateString()}</div>
                                        </div>
                                        {getStatusBadge(order.status)}
                                    </div>

                                    <div className="space-y-3">
                                        {order.items.map((item, idx) => (
                                            <div key={idx} className="flex gap-4">
                                                <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                                                    {item.product_image && (
                                                        <Image src={item.product_image} alt={item.product_title} fill className="object-cover" />
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-800 dark:text-gray-200 line-clamp-1">{item.product_title}</p>
                                                    <p className="text-sm text-gray-500">x{item.quantity}</p>
                                                </div>
                                                <div className="ml-auto text-right">
                                                    <p className="font-medium">฿{item.total_price.toLocaleString()}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* AI Suggestion (Only for active orders) */}
                                    {['paid', 'shipping'].includes(order.status) && (
                                        <AIFulfillmentSuggestion order={order} />
                                    )}
                                </div>

                                {/* Order Actions */}
                                <div className="w-full md:w-64 border-t md:border-t-0 md:border-l border-gray-100 dark:border-gray-800 pt-4 md:pt-0 md:pl-6 flex flex-col justify-between">
                                    <div>
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-sm text-gray-500">{t('seller_orders.total_amount')}</span>
                                            <span className="text-xl font-bold text-neon-purple">฿{order.net_total.toLocaleString()}</span>
                                        </div>
                                        <div className="text-xs text-gray-400 mb-4">
                                            {t('seller_orders.via')} {order.payment_method}
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        {order.status === 'paid' && (
                                            <>
                                                <Button
                                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                                                    onClick={() => handleStatusUpdate(order.id, 'shipping')}
                                                >
                                                    <Truck className="w-4 h-4 mr-2" />
                                                    {t('seller_orders.arrange_shipment')}
                                                </Button>
                                                <Button variant="outline" className="w-full">
                                                    {t('seller_orders.print_label')}
                                                </Button>
                                            </>
                                        )}
                                        {order.status === 'shipping' && (
                                            <Button
                                                variant="outline"
                                                className="w-full border-green-200 text-green-700 hover:bg-green-50"
                                                onClick={() => handleStatusUpdate(order.id, 'completed')}
                                            >
                                                <CheckCircle className="w-4 h-4 mr-2" />
                                                {t('seller_orders.mark_delivered')}
                                            </Button>
                                        )}
                                        <Button variant="ghost" className="w-full text-sm">
                                            {t('seller_orders.view_details')}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
