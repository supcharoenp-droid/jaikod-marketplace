'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
    ShoppingBag,
    Search,
    Filter,
    Printer,
    Truck,
    CheckCircle,
    XCircle,
    Clock,
    Package,
    Wand2,
    ChevronRight,
    MapPin,
    Phone,
    User,
    Calendar,
    CreditCard,
    AlertTriangle,
    TrendingUp,
    Eye,
    FileText,
    Sparkles,
    MoreHorizontal,
    Copy,
    MessageCircle,
    ArrowRight
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { useLanguage } from '@/contexts/LanguageContext'
import { orderService, type Order, type OrderStatus } from '@/services/order/orderService'
import Button from '@/components/ui/Button'

// ==================== Types ====================
interface OrderStats {
    total: number
    pending: number // Changed from pendingPayment
    toShip: number
    shipping: number
    completed: number
    cancelled: number
    refunds: number
}

interface StatusTab {
    id: string
    labelTh: string
    labelEn: string
    count: number
    color: string
    icon: React.ElementType
}

// ==================== Helper Components ====================

/**
 * AI Order Insights Card
 */
function AIOrderInsights({ stats }: { stats: OrderStats }) {
    const { t, language } = useLanguage()

    const insights = []

    if (stats.toShip > 0) {
        insights.push({
            type: 'urgent',
            th: `⚡ มี ${stats.toShip} รายการรอจัดส่ง ควรจัดส่งภายในวันนี้เพื่อให้ได้คะแนนร้านค้าดีเยี่ยม`,
            en: `⚡ ${stats.toShip} orders awaiting shipment. Ship today for excellent shop rating.`
        })
    }

    if (stats.pending > 0) {
        insights.push({
            type: 'warning',
            th: `💳 ${stats.pending} รายการรอชำระเงิน อาจต้องติดตามลูกค้า`,
            en: `💳 ${stats.pending} pending payments. May need customer follow-up.`
        })
    }

    const completionRate = stats.total > 0
        ? Math.round((stats.completed / stats.total) * 100)
        : 100

    return (
        <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 rounded-2xl p-6 text-white relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-400/20 rounded-full blur-2xl" />

            <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                            <Sparkles className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h3 className="font-bold text-lg">
                                {t('AI วิเคราะห์คำสั่งซื้อ', 'AI Order Insights')}
                            </h3>
                            <p className="text-sm text-white/70">
                                {t('สรุปคำสั่งซื้อวันนี้', 'Today\'s summary')}
                            </p>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-4xl font-black">{completionRate}%</div>
                        <div className="text-sm text-white/70">{t('อัตราสำเร็จ', 'Completion')}</div>
                    </div>
                </div>

                {insights.length > 0 ? (
                    <div className="space-y-2 mt-4">
                        {insights.map((insight, idx) => (
                            <div
                                key={idx}
                                className={`p-3 rounded-xl text-sm ${insight.type === 'urgent'
                                    ? 'bg-amber-500/20 border border-amber-300/30'
                                    : 'bg-white/10 border border-white/10'
                                    }`}
                            >
                                {language === 'th' ? insight.th : insight.en}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="mt-4 p-3 bg-emerald-500/20 rounded-xl text-sm border border-emerald-300/30">
                        🎉 {t('ทุกอย่างเรียบร้อยดี! ไม่มีงานเร่งด่วน', 'All caught up! No urgent tasks.')}
                    </div>
                )}

                {/* Quick Stats */}
                <div className="grid grid-cols-4 gap-3 mt-4 pt-4 border-t border-white/20">
                    <div className="text-center">
                        <div className="text-2xl font-bold">{stats.total}</div>
                        <div className="text-xs text-white/70">{t('ทั้งหมด', 'Total')}</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold text-amber-300">{stats.toShip}</div>
                        <div className="text-xs text-white/70">{t('รอจัดส่ง', 'To Ship')}</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold text-blue-300">{stats.shipping}</div>
                        <div className="text-xs text-white/70">{t('กำลังส่ง', 'Shipping')}</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold text-emerald-300">{stats.completed}</div>
                        <div className="text-xs text-white/70">{t('สำเร็จ', 'Done')}</div>
                    </div>
                </div>
            </div>
        </div>
    )
}

/**
 * Order Card Component
 */
function OrderCard({
    order,
    isSelected,
    onToggle,
    onStatusChange,
    t,
    language
}: {
    order: Order
    isSelected: boolean
    onToggle: () => void
    onStatusChange: (status: OrderStatus) => void
    t: (th: string, en: string) => string
    language: string
}) {
    const [showDropdown, setShowDropdown] = useState(false)

    // Status Config
    // Updated to match OrderService Status
    const statusConfig: Record<string, { labelTh: string, labelEn: string, color: string, bg: string, icon: React.ElementType }> = {
        pending: { labelTh: 'รอชำระเงิน', labelEn: 'Pending Payment', color: 'text-amber-700', bg: 'bg-amber-100', icon: Clock },
        paid: { labelTh: 'รอจัดส่ง', labelEn: 'To Ship', color: 'text-orange-700', bg: 'bg-orange-100', icon: Package },
        confirmed: { labelTh: 'รอจัดส่ง', labelEn: 'Confirmed', color: 'text-cyan-700', bg: 'bg-cyan-100', icon: CheckCircle },
        shipping: { labelTh: 'กำลังจัดส่ง', labelEn: 'Shipping', color: 'text-blue-700', bg: 'bg-blue-100', icon: Truck },
        delivered: { labelTh: 'ส่งถึงแล้ว', labelEn: 'Delivered', color: 'text-indigo-700', bg: 'bg-indigo-100', icon: Truck },
        completed: { labelTh: 'สำเร็จ', labelEn: 'Completed', color: 'text-emerald-700', bg: 'bg-emerald-100', icon: CheckCircle },
        cancelled: { labelTh: 'ยกเลิก', labelEn: 'Cancelled', color: 'text-red-700', bg: 'bg-red-100', icon: XCircle },
        refunded: { labelTh: 'คืนเงิน', labelEn: 'Refunded', color: 'text-purple-700', bg: 'bg-purple-100', icon: XCircle },
        disputed: { labelTh: 'มีข้อพิพาท', labelEn: 'Disputed', color: 'text-red-700', bg: 'bg-red-100', icon: AlertTriangle }
    }

    const status = statusConfig[order.status] || statusConfig.pending
    const StatusIcon = status.icon

    // Safe Date Parsing
    const orderDate = order.createdAt instanceof Date
        ? order.createdAt
        : new Date(order.createdAt || Date.now())

    return (
        <div className={`bg-white dark:bg-gray-800 rounded-2xl border-2 shadow-sm overflow-hidden transition-all ${isSelected
            ? 'border-indigo-500 ring-2 ring-indigo-200'
            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
            }`}>
            {/* Order Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
                <div className="flex items-center gap-3">
                    <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={onToggle}
                        className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <div>
                        <span className="font-mono font-bold text-gray-900 dark:text-white">
                            {order.orderNumber}
                        </span>
                        <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
                            <Calendar className="w-3 h-3" />
                            {orderDate.toLocaleDateString(language === 'th' ? 'th-TH' : 'en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                            })}
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${status.bg} ${status.color}`}>
                        <StatusIcon className="w-3.5 h-3.5" />
                        {language === 'th' ? status.labelTh : status.labelEn}
                    </span>
                    <div className="relative">
                        <button
                            onClick={() => setShowDropdown(!showDropdown)}
                            className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
                        >
                            <MoreHorizontal className="w-4 h-4 text-gray-500" />
                        </button>
                        {showDropdown && (
                            <div className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl z-50 py-1">
                                <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2">
                                    <Copy className="w-4 h-4" />
                                    {t('คัดลอกเลขที่', 'Copy Order ID')}
                                </button>
                                <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2">
                                    <FileText className="w-4 h-4" />
                                    {t('ใบเสร็จ', 'Invoice')}
                                </button>
                                <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2">
                                    <MessageCircle className="w-4 h-4" />
                                    {t('แชทกับลูกค้า', 'Chat Customer')}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Order Body */}
            <div className="p-4">
                <div className="flex gap-6">
                    {/* Products */}
                    <div className="flex-1">
                        <div className="space-y-3">
                            {order.items.slice(0, 3).map((item, idx) => (
                                <div key={idx} className="flex gap-3">
                                    <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-gray-100 border border-gray-200 flex-shrink-0">
                                        {item.thumbnailUrl ? (
                                            <Image src={item.thumbnailUrl} alt={item.title} fill className="object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                <Package className="w-6 h-6" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-medium text-gray-900 dark:text-white truncate">
                                            {item.title}
                                        </h4>
                                        <div className="flex items-center gap-3 text-sm text-gray-500 mt-0.5">
                                            <span>x{item.quantity}</span>
                                            <span className="font-medium text-gray-700 dark:text-gray-300">
                                                ฿{(item.price * item.quantity).toLocaleString()}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {order.items.length > 3 && (
                                <p className="text-sm text-gray-500 pl-17">
                                    +{order.items.length - 3} {t('รายการเพิ่มเติม', 'more items')}
                                </p>
                            )}
                        </div>

                        {/* AI Suggestion */}
                        {(order.status === 'paid' || order.status === 'confirmed') && (
                            <div className="mt-4 p-3 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl border border-indigo-200 dark:border-indigo-700">
                                <div className="flex items-start gap-2">
                                    <Wand2 className="w-4 h-4 text-indigo-600 mt-0.5" />
                                    <div className="text-sm">
                                        <span className="font-bold text-indigo-700 dark:text-indigo-300">
                                            {t('AI แนะนำ:', 'AI Suggests:')}
                                        </span>{' '}
                                        <span className="text-indigo-600 dark:text-indigo-400">
                                            {t(
                                                `ใช้กล่องขนาด ${order.items.length > 2 ? 'L' : 'M'} • จัดส่งภายในวันนี้เพื่อรักษาเรตติ้ง`,
                                                `Use ${order.items.length > 2 ? 'Large' : 'Medium'} box • Ship today to maintain rating`
                                            )}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Order Summary & Actions */}
                    <div className="w-56 border-l border-gray-100 dark:border-gray-700 pl-6 flex flex-col">
                        {/* Customer Info */}
                        <div className="mb-4">
                            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-1">
                                <User className="w-3.5 h-3.5" />
                                <span className="truncate">{order.shipping?.address?.name || order.buyerName || t('ลูกค้า', 'Customer')}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                <MapPin className="w-3.5 h-3.5" />
                                <span className="truncate">{order.shipping?.address?.province || '-'}</span>
                            </div>
                        </div>

                        {/* Total */}
                        <div className="mb-4 pb-4 border-b border-gray-100 dark:border-gray-700">
                            <div className="text-sm text-gray-500">{t('ยอดรวม', 'Total')}</div>
                            <div className="text-2xl font-black text-gray-900 dark:text-white">
                                ฿{order.total.toLocaleString()}
                            </div>
                            <div className="text-xs text-gray-400">
                                {t('ผ่าน', 'via')} {order.paymentMethod === 'cod' ? 'COD' : t('โอนเงิน', 'Transfer')}
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="space-y-2 mt-auto">
                            {(order.status === 'paid' || order.status === 'confirmed') && (
                                <>
                                    <button
                                        onClick={() => onStatusChange('shipping')}
                                        className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-colors"
                                    >
                                        <Truck className="w-4 h-4" />
                                        {t('จัดส่ง', 'Ship')}
                                    </button>
                                    <button className="w-full py-2 px-4 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-colors">
                                        <Printer className="w-4 h-4" />
                                        {t('พิมพ์ใบปะหน้า', 'Print Label')}
                                    </button>
                                </>
                            )}
                            {order.status === 'shipping' && (
                                <button
                                    onClick={() => onStatusChange('delivered')}
                                    className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-colors"
                                >
                                    <CheckCircle className="w-4 h-4" />
                                    {t('ยืนยันส่งถึง', 'Mark Delivered')}
                                </button>
                            )}
                            {order.status === 'delivered' && (
                                <button
                                    onClick={() => onStatusChange('completed')}
                                    className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-colors"
                                >
                                    <CheckCircle className="w-4 h-4" />
                                    {t('จบการขาย', 'Complete')}
                                </button>
                            )}
                            <Link
                                href={`/seller/orders/${order.id}`}
                                className="w-full py-2 px-4 text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-xl text-sm font-medium flex items-center justify-center gap-1 transition-colors"
                            >
                                {t('ดูรายละเอียด', 'View Details')}
                                <ChevronRight className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

// ==================== Main Component ====================
export default function SellerOrdersPageV2() {
    const { user } = useAuth()
    const { t, language } = useLanguage()

    // State
    const [orders, setOrders] = useState<Order[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [activeTab, setActiveTab] = useState('all')
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())

    // Fetch orders
    useEffect(() => {
        const fetchOrders = async () => {
            if (!user) {
                setIsLoading(false)
                return
            }
            try {
                setIsLoading(true)
                const data = await orderService.getSellerOrders(user.uid)
                setOrders(data)
            } catch (error) {
                console.error('Error fetching orders:', error)
            } finally {
                setIsLoading(false)
            }
        }
        fetchOrders()
    }, [user])

    // Calculate Stats
    const stats: OrderStats = {
        total: orders.length,
        pending: orders.filter(o => o.status === 'pending').length,
        toShip: orders.filter(o => o.status === 'paid' || o.status === 'confirmed').length,
        shipping: orders.filter(o => o.status === 'shipping').length,
        completed: orders.filter(o => o.status === 'completed' || o.status === 'delivered').length,
        cancelled: orders.filter(o => o.status === 'cancelled').length,
        refunds: orders.filter(o => o.status === 'refunded').length
    }

    // Status Tabs
    const statusTabs: StatusTab[] = [
        { id: 'all', labelTh: 'ทั้งหมด', labelEn: 'All', count: stats.total, color: 'gray', icon: ShoppingBag },
        { id: 'pending', labelTh: 'รอชำระเงิน', labelEn: 'Pending', count: stats.pending, color: 'amber', icon: Clock },
        { id: 'paid', labelTh: 'รอจัดส่ง', labelEn: 'To Ship', count: stats.toShip, color: 'orange', icon: Package },
        { id: 'shipping', labelTh: 'กำลังจัดส่ง', labelEn: 'Shipping', count: stats.shipping, color: 'blue', icon: Truck },
        { id: 'completed', labelTh: 'สำเร็จ', labelEn: 'Completed', count: stats.completed, color: 'emerald', icon: CheckCircle },
        { id: 'cancelled', labelTh: 'ยกเลิก', labelEn: 'Cancelled', count: stats.cancelled, color: 'red', icon: XCircle },
    ]

    // Filter Orders
    const filteredOrders = orders.filter(order => {
        const matchesTab = activeTab === 'all' ||
            (activeTab === 'paid' ? (order.status === 'paid' || order.status === 'confirmed') : order.status === activeTab) ||
            (activeTab === 'completed' ? (order.status === 'completed' || order.status === 'delivered') : false)

        // Note: Simple tab matching needs adjusting for grouped statuses (e.g. paid+confirmed = To Ship)
        // Let's refine for "To Ship" tab specifically.
        if (activeTab === 'paid') {
            if (order.status !== 'paid' && order.status !== 'confirmed') return false;
        } else if (activeTab === 'completed') {
            if (order.status !== 'completed' && order.status !== 'delivered') return false;
        } else if (activeTab !== 'all' && order.status !== activeTab) {
            return false;
        }

        const matchesSearch =
            order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
            order.items.some(i => i.title.toLowerCase().includes(searchQuery.toLowerCase()))
        return matchesSearch // && matchesTab (Already checked above)
    })

    // Handlers
    const toggleSelection = (id: string) => {
        const newSet = new Set(selectedIds)
        if (newSet.has(id)) newSet.delete(id)
        else newSet.add(id)
        setSelectedIds(newSet)
    }

    const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
        try {
            await orderService.updateStatus(orderId, newStatus)
            setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o))
        } catch (error) {
            console.error('Status update failed:', error)
        }
    }

    // Loading
    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-gray-500">{t('กำลังโหลด...', 'Loading...')}</p>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-black text-gray-900 dark:text-white">
                        {t('📦 จัดการคำสั่งซื้อ', '📦 Orders')}
                    </h1>
                    <p className="text-gray-500 mt-1">
                        {stats.total} {t('รายการ', 'orders')} •
                        {stats.toShip > 0 && (
                            <span className="text-orange-600 font-medium ml-1">
                                {stats.toShip} {t('รอจัดส่ง', 'to ship')}
                            </span>
                        )}
                    </p>
                </div>
                <div className="flex gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-medium transition-colors">
                        <Printer className="w-4 h-4" />
                        {t('พิมพ์หลายรายการ', 'Batch Print')}
                    </button>
                </div>
            </div>

            {/* AI Insights */}
            {orders.length > 0 && (
                <AIOrderInsights stats={stats} />
            )}

            {/* Status Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-2">
                {statusTabs.map(tab => {
                    const TabIcon = tab.icon
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm whitespace-nowrap transition-all ${activeTab === tab.id
                                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25'
                                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50'
                                }`}
                        >
                            <TabIcon className="w-4 h-4" />
                            {language === 'th' ? tab.labelTh : tab.labelEn}
                            {tab.count > 0 && (
                                <span className={`px-2 py-0.5 rounded-full text-xs ${activeTab === tab.id
                                    ? 'bg-white/20'
                                    : tab.id === 'paid' ? 'bg-orange-100 text-orange-700'
                                        : tab.color === 'emerald' ? 'bg-emerald-100 text-emerald-700'
                                            : 'bg-gray-100 text-gray-600'
                                    }`}>
                                    {tab.count}
                                </span>
                            )}
                        </button>
                    )
                })}
            </div>

            {/* Search Bar */}
            <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row gap-4 justify-between items-center">
                <div className="relative flex-1 w-full sm:w-auto">
                    <input
                        type="text"
                        placeholder={t('ค้นหาเลขออเดอร์หรือสินค้า...', 'Search order or product...')}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900 focus:outline-none focus:border-indigo-500 transition-colors"
                    />
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>
                {selectedIds.size > 0 && (
                    <div className="flex items-center gap-2 bg-indigo-50 dark:bg-indigo-900/30 px-4 py-2 rounded-xl border-2 border-indigo-200 dark:border-indigo-700">
                        <span className="text-sm font-bold text-indigo-700 dark:text-indigo-300">
                            {selectedIds.size} {t('รายการ', 'items')}
                        </span>
                        <button className="p-1.5 hover:bg-white rounded-lg text-blue-600" title={t('พิมพ์', 'Print')}>
                            <Printer className="w-4 h-4" />
                        </button>
                        <button className="p-1.5 hover:bg-white rounded-lg text-emerald-600" title={t('จัดส่ง', 'Ship')}>
                            <Truck className="w-4 h-4" />
                        </button>
                    </div>
                )}
            </div>

            {/* Orders List */}
            {filteredOrders.length === 0 ? (
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-12 text-center">
                    <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                        {searchQuery
                            ? t('ไม่พบคำสั่งซื้อ', 'No orders found')
                            : t('ยังไม่มีคำสั่งซื้อ', 'No orders yet')
                        }
                    </h3>
                    <p className="text-gray-500">
                        {t('เมื่อมีคำสั่งซื้อเข้ามา จะแสดงที่นี่', 'Orders will appear here when customers place them')}
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {filteredOrders.map(order => (
                        <OrderCard
                            key={order.id}
                            order={order}
                            isSelected={selectedIds.has(order.id)}
                            onToggle={() => toggleSelection(order.id)}
                            onStatusChange={(status) => handleStatusChange(order.id, status)}
                            t={t}
                            language={language}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}
