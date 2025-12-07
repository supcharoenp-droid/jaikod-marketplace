'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { Search, Filter, Package, Truck, CheckCircle, XCircle, Clock, MoreVertical, CreditCard } from 'lucide-react'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { useAuth } from '@/contexts/AuthContext'
import { getSellerOrders, updateOrderStatus, createMockOrder } from '@/lib/orders'
import { Order } from '@/types'

const TABS = [
    { id: 'all', label: 'ทั้งหมด' },
    { id: 'pending_payment', label: 'ที่ต้องชำระ' },
    { id: 'paid', label: 'ที่ต้องจัดส่ง' },
    { id: 'shipping', label: 'กำลังจัดส่ง' },
    { id: 'completed', label: 'สำเร็จ' },
    { id: 'cancelled', label: 'ยกเลิกแล้ว' },
]

export default function SellerOrdersPage() {
    const { user } = useAuth()
    const [orders, setOrders] = useState<Order[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [activeTab, setActiveTab] = useState('all')
    const [searchQuery, setSearchQuery] = useState('')

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

    useEffect(() => {
        fetchOrders()
    }, [user])

    // Filter Logic
    const filteredOrders = orders.filter(order => {
        const matchesTab = activeTab === 'all' || order.status === activeTab
        const matchesSearch =
            order.order_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
            order.items.some(item => item.product_title.toLowerCase().includes(searchQuery.toLowerCase()))

        return matchesTab && matchesSearch
    })

    // Action Handlers
    const handleShipOrder = async (orderId: string) => {
        if (confirm('ยืนยันการจัดส่งสินค้า?')) {
            await updateOrderStatus(orderId, 'shipping', 'KERRY-123456789')
            fetchOrders()
        }
    }

    const handleCreateTestOrder = async () => {
        if (!user) return
        try {
            await createMockOrder(user.uid, 'TEST-BUYER', [{ id: 'TEST-PROD', title: 'สินค้าทดสอบ', price: 500 }])
            alert('สร้างคำสั่งซื้อทดสอบแล้ว!')
            fetchOrders()
        } catch (error) {
            console.error(error)
        }
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending_payment': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
            case 'paid': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
            case 'shipping': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300'
            case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
            case 'cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
            default: return 'bg-gray-100 text-gray-800'
        }
    }

    const getStatusLabel = (status: string) => {
        const found = TABS.find(t => t.id === status)
        return found ? found.label : status
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">คำสั่งซื้อ</h1>
                {process.env.NODE_ENV === 'development' && (
                    <Button variant="outline" size="sm" onClick={handleCreateTestOrder}>
                        + สร้างคำสั่งซื้อทดสอบ
                    </Button>
                )}
            </div>

            {/* Filter Bar */}
            <div className="bg-white dark:bg-surface-dark rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-4">
                <div className="flex flex-col md:flex-row gap-4 justify-between">
                    {/* Tabs */}
                    <div className="flex overflow-x-auto pb-2 md:pb-0 gap-2 no-scrollbar">
                        {TABS.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`whitespace-nowrap px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === tab.id
                                        ? 'bg-neon-purple text-white shadow-lg shadow-neon-purple/20'
                                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                                    }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Search */}
                    <div className="relative w-full md:w-64">
                        <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="ค้นหาคำสั่งซื้อ, สินค้า..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 text-sm focus:outline-none focus:border-neon-purple"
                        />
                    </div>
                </div>
            </div>

            {/* Orders List */}
            <div className="space-y-4">
                {isLoading ? (
                    <div className="text-center py-12">
                        <div className="w-8 h-8 mx-auto border-4 border-neon-purple border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : filteredOrders.length > 0 ? (
                    filteredOrders.map(order => (
                        <div key={order.id} className="bg-white dark:bg-surface-dark rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
                            {/* Header */}
                            <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex flex-wrap justify-between items-center gap-2 bg-gray-50/50 dark:bg-gray-800/20">
                                <div className="flex items-center gap-3">
                                    <span className="font-bold text-gray-900 dark:text-white text-sm md:text-base">
                                        {order.order_number}
                                    </span>
                                    <span className="text-xs text-text-secondary">
                                        {new Date(order.created_at as any).toLocaleDateString('th-TH')}
                                    </span>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                                    {getStatusLabel(order.status)}
                                </span>
                            </div>

                            {/* Items */}
                            <div className="p-4 space-y-4">
                                {order.items.map((item, idx) => (
                                    <div key={idx} className="flex gap-4">
                                        <div className="relative w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                            {item.product_image && (
                                                <Image src={item.product_image} alt="" fill className="object-cover" />
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-medium text-gray-900 dark:text-white text-sm line-clamp-1">
                                                {item.product_title}
                                            </h3>
                                            <p className="text-sm text-text-secondary">
                                                x{item.quantity}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-neon-purple">฿{item.total_price.toLocaleString()}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Footer / Actions */}
                            <div className="p-4 border-t border-gray-100 dark:border-gray-800 flex justify-between items-center">
                                <div>
                                    <p className="text-xs text-text-secondary">ยอดคำสั่งซื้อทั้งหมด</p>
                                    <p className="text-lg font-bold text-gray-900 dark:text-white">฿{order.net_total.toLocaleString()}</p>
                                </div>
                                <div className="flex gap-2">
                                    <Button variant="outline" size="sm">
                                        รายละเอียด
                                    </Button>
                                    {order.status === 'paid' && (
                                        <Button variant="primary" size="sm" onClick={() => handleShipOrder(order.id)}>
                                            จัดส่งสินค้า
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="bg-white dark:bg-surface-dark rounded-xl p-12 text-center border border-gray-100 dark:border-gray-800">
                        <Package className="w-16 h-16 text-gray-200 dark:text-gray-700 mx-auto mb-4" />
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">ไม่พบคำสั่งซื้อ</h3>
                        <p className="text-text-secondary">ยังไม่มีรายการคำสั่งซื้อในสถานะนี้</p>
                    </div>
                )}
            </div>
        </div>
    )
}
