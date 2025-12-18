'use client'

import React, { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Package,
    Clock,
    Truck,
    CheckCircle,
    XCircle,
    Eye,
    MessageCircle,
    RotateCcw,
    Download,
    MapPin,
    Calendar,
    DollarSign,
    Sparkles,
    AlertCircle,
    ChevronRight,
    Search
} from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import useProfile from '@/hooks/useProfile'
import ProfileLayout from '@/components/profile/v2/ProfileLayout'
import Image from 'next/image'

interface OrderItem {
    productId: string
    title: string
    qty: number
    price: number
    image: string
}

interface Order {
    id: string
    createdAt: Date
    status: 'pending' | 'paid' | 'shipped' | 'completed' | 'cancelled'
    total: number
    items: OrderItem[]
    seller: {
        id: string
        name: string
    }
    tracking?: {
        carrier: string
        trackingNo: string
        status: string
    }
}

const ORDER_STATUSES = ['all', 'pending', 'paid', 'shipped', 'completed', 'cancelled'] as const
type OrderStatus = typeof ORDER_STATUSES[number]

export default function OrdersPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const { t, language } = useLanguage()
    const { user, ordersSummary } = useProfile()

    const [activeTab, setActiveTab] = useState<OrderStatus>('all')
    const [orders, setOrders] = useState<Order[]>([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')

    // Get status from URL
    useEffect(() => {
        const status = searchParams.get('status') as OrderStatus
        if (status && ORDER_STATUSES.includes(status)) {
            setActiveTab(status)
        }
    }, [searchParams])

    // Fetch orders
    useEffect(() => {
        fetchOrders(activeTab)
    }, [activeTab, user])

    const fetchOrders = async (status: OrderStatus) => {
        setLoading(true)
        try {
            // TODO: Replace with actual API call
            // const response = await fetch(`/api/users/${user?.uid}/orders?status=${status}&lang=${language}`)
            // const data = await response.json()

            // Mock data for now
            await new Promise(resolve => setTimeout(resolve, 500))
            setOrders(getMockOrders(status))
        } catch (error) {
            console.error('Error fetching orders:', error)
        } finally {
            setLoading(false)
        }
    }

    const getMockOrders = (status: OrderStatus): Order[] => {
        const mockOrders: Order[] = [
            {
                id: 'ORD-2024-001',
                createdAt: new Date('2024-12-10'),
                status: 'shipped',
                total: 1299,
                items: [
                    {
                        productId: '1',
                        title: 'iPhone 13 Pro Max 256GB',
                        qty: 1,
                        price: 1299,
                        image: '/images/products/iphone.jpg'
                    }
                ],
                seller: { id: 's1', name: 'TechStore Bangkok' },
                tracking: {
                    carrier: 'Kerry Express',
                    trackingNo: 'KE123456789TH',
                    status: 'In Transit'
                }
            },
            {
                id: 'ORD-2024-002',
                createdAt: new Date('2024-12-08'),
                status: 'completed',
                total: 450,
                items: [
                    {
                        productId: '2',
                        title: 'AirPods Pro 2nd Gen',
                        qty: 1,
                        price: 450,
                        image: '/images/products/airpods.jpg'
                    }
                ],
                seller: { id: 's2', name: 'Audio Paradise' }
            },
            {
                id: 'ORD-2024-003',
                createdAt: new Date('2024-12-05'),
                status: 'pending',
                total: 899,
                items: [
                    {
                        productId: '3',
                        title: 'Sony WH-1000XM5',
                        qty: 1,
                        price: 899,
                        image: '/images/products/headphones.jpg'
                    }
                ],
                seller: { id: 's3', name: 'Sound Master' }
            }
        ]

        if (status === 'all') return mockOrders
        return mockOrders.filter(order => order.status === status)
    }

    const getStatusBadge = (status: Order['status']) => {
        const badges = {
            pending: {
                icon: Clock,
                color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
                label: language === 'th' ? 'รอชำระเงิน' : 'Pending Payment'
            },
            paid: {
                icon: CheckCircle,
                color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
                label: language === 'th' ? 'ชำระแล้ว' : 'Paid'
            },
            shipped: {
                icon: Truck,
                color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
                label: language === 'th' ? 'กำลังจัดส่ง' : 'Shipped'
            },
            completed: {
                icon: CheckCircle,
                color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
                label: language === 'th' ? 'สำเร็จ' : 'Completed'
            },
            cancelled: {
                icon: XCircle,
                color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
                label: language === 'th' ? 'ยกเลิก' : 'Cancelled'
            }
        }
        return badges[status]
    }

    const getAISuggestion = (order: Order) => {
        const suggestions = {
            pending: language === 'th'
                ? 'ชำระเงินภายใน 24 ชม. เพื่อรับส่วนลด 5%'
                : 'Pay within 24h to get 5% discount',
            paid: language === 'th'
                ? 'ผู้ขายกำลังเตรียมสินค้า คาดว่าจะจัดส่งภายใน 1-2 วัน'
                : 'Seller is preparing your order. Expected to ship in 1-2 days',
            shipped: language === 'th'
                ? 'ติดตามพัสดุได้แล้ว! คาดว่าจะถึงภายใน 2-3 วัน'
                : 'Track your package! Expected delivery in 2-3 days',
            completed: language === 'th'
                ? 'ชอบสินค้านี้ไหม? แนะนำสินค้าที่คล้ายกัน'
                : 'Like this product? Check out similar items',
            cancelled: language === 'th'
                ? 'เราเสียใจที่คำสั่งซื้อถูกยกเลิก ลองดูสินค้าอื่นไหม?'
                : 'Sorry your order was cancelled. Browse similar products?'
        }
        return suggestions[order.status]
    }

    const handleTabChange = (status: OrderStatus) => {
        setActiveTab(status)
        router.push(`/profile/orders?status=${status}`, { scroll: false })
    }

    const filteredOrders = orders.filter(order =>
        order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.items.some(item => item.title.toLowerCase().includes(searchQuery.toLowerCase()))
    )

    return (
        <ProfileLayout>
            <div className="space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                        {language === 'th' ? 'คำสั่งซื้อของฉัน' : 'My Orders'}
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                        {language === 'th' ? 'ติดตามและจัดการคำสั่งซื้อของคุณ' : 'Track and manage your orders'}
                    </p>
                </div>

                {/* Search */}
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder={language === 'th' ? 'ค้นหาคำสั่งซื้อ...' : 'Search orders...'}
                        className="w-full pl-12 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                </div>

                {/* Status Tabs */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-2 border border-gray-200 dark:border-gray-700">
                    <div className="flex gap-2 overflow-x-auto scrollbar-hide">
                        {ORDER_STATUSES.map((status) => {
                            const count = status === 'all'
                                ? ordersSummary.all
                                : ordersSummary[status as keyof typeof ordersSummary] || 0

                            return (
                                <button
                                    key={status}
                                    onClick={() => handleTabChange(status)}
                                    className={`
                                        flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm whitespace-nowrap transition-all
                                        ${activeTab === status
                                            ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/30'
                                            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                                        }
                                    `}
                                >
                                    <span className="capitalize">
                                        {language === 'th'
                                            ? { all: 'ทั้งหมด', pending: 'รอชำระ', paid: 'ชำระแล้ว', shipped: 'จัดส่ง', completed: 'สำเร็จ', cancelled: 'ยกเลิก' }[status]
                                            : status === 'all' ? 'All' : status.charAt(0).toUpperCase() + status.slice(1)
                                        }
                                    </span>
                                    {count > 0 && (
                                        <span className={`
                                            px-2 py-0.5 rounded-full text-xs font-bold
                                            ${activeTab === status ? 'bg-white/20' : 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400'}
                                        `}>
                                            {count}
                                        </span>
                                    )}
                                </button>
                            )
                        })}
                    </div>
                </div>

                {/* Orders List */}
                {loading ? (
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 animate-pulse">
                                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4"></div>
                                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                            </div>
                        ))}
                    </div>
                ) : filteredOrders.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white dark:bg-gray-800 rounded-2xl p-12 border border-gray-200 dark:border-gray-700 text-center"
                    >
                        <Package className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                            {language === 'th' ? 'ยังไม่มีคำสั่งซื้อ' : 'No orders yet'}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">
                            {language === 'th' ? 'เริ่มช้อปปิ้งและสร้างคำสั่งซื้อแรกของคุณ' : 'Start shopping and create your first order'}
                        </p>
                        <div className="flex items-start gap-3 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl mb-6">
                            <Sparkles className="w-5 h-5 text-purple-500 shrink-0 mt-0.5" />
                            <p className="text-sm text-purple-700 dark:text-purple-300 text-left">
                                {language === 'th'
                                    ? 'AI แนะนำ: ดูสินค้ายอดนิยมที่คนอื่นซื้อกัน'
                                    : 'AI suggests: Check out trending products that others are buying'
                                }
                            </p>
                        </div>
                        <button
                            onClick={() => router.push('/')}
                            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-medium hover:shadow-lg transition-all"
                        >
                            {language === 'th' ? 'เริ่มช้อปปิ้ง' : 'Start Shopping'}
                        </button>
                    </motion.div>
                ) : (
                    <div className="space-y-4">
                        <AnimatePresence mode="popLayout">
                            {filteredOrders.map((order) => {
                                const badge = getStatusBadge(order.status)
                                const StatusIcon = badge.icon

                                return (
                                    <motion.div
                                        key={order.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-shadow"
                                    >
                                        {/* Order Header */}
                                        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                                            <div className="flex items-start justify-between mb-4">
                                                <div>
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                                                            {order.id}
                                                        </h3>
                                                        <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${badge.color}`}>
                                                            <StatusIcon className="w-3.5 h-3.5" />
                                                            {badge.label}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                                                        <span className="flex items-center gap-1.5">
                                                            <Calendar className="w-4 h-4" />
                                                            {order.createdAt.toLocaleDateString(language === 'th' ? 'th-TH' : 'en-US')}
                                                        </span>
                                                        <span className="flex items-center gap-1.5">
                                                            <DollarSign className="w-4 h-4" />
                                                            ฿{order.total.toLocaleString()}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* AI Suggestion */}
                                            <div className="flex items-start gap-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
                                                <Sparkles className="w-4 h-4 text-purple-500 shrink-0 mt-0.5" />
                                                <p className="text-sm text-purple-700 dark:text-purple-300">
                                                    {getAISuggestion(order)}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Order Items */}
                                        <div className="p-6 space-y-3">
                                            {order.items.map((item, idx) => (
                                                <div key={idx} className="flex items-center gap-4">
                                                    <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                                                        <Package className="w-8 h-8 text-gray-400" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <h4 className="font-medium text-gray-900 dark:text-white">
                                                            {item.title}
                                                        </h4>
                                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                                            {language === 'th' ? 'จำนวน' : 'Qty'}: {item.qty} × ฿{item.price.toLocaleString()}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Actions */}
                                        <div className="p-6 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700">
                                            <div className="flex flex-wrap gap-3">
                                                <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                                                    <Eye className="w-4 h-4" />
                                                    <span className="text-sm font-medium">{language === 'th' ? 'ดูรายละเอียด' : 'View Details'}</span>
                                                </button>
                                                {order.tracking && (
                                                    <button className="flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors">
                                                        <MapPin className="w-4 h-4" />
                                                        <span className="text-sm font-medium">{language === 'th' ? 'ติดตามพัสดุ' : 'Track'}</span>
                                                    </button>
                                                )}
                                                <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                                                    <MessageCircle className="w-4 h-4" />
                                                    <span className="text-sm font-medium">{language === 'th' ? 'ติดต่อผู้ขาย' : 'Contact Seller'}</span>
                                                </button>
                                                {order.status === 'completed' && (
                                                    <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                                                        <RotateCcw className="w-4 h-4" />
                                                        <span className="text-sm font-medium">{language === 'th' ? 'สั่งซื้ออีกครั้ง' : 'Reorder'}</span>
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </motion.div>
                                )
                            })}
                        </AnimatePresence>
                    </div>
                )}
            </div>
        </ProfileLayout>
    )
}
