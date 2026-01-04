/**
 * ============================================
 * Order Service (Placeholder)
 * ============================================
 * 
 * Ready for Phase 2 - Marketplace Mode
 * Enable by setting FEATURE_FLAGS.ORDER_SYSTEM_ENABLED = true
 * 
 * Features:
 * - Order creation & management
 * - Order status tracking
 * - Order history
 */

import { FEATURE_FLAGS, PLATFORM_CONFIG } from '@/config/platform'
import { db } from '@/lib/firebase'
import { collection, doc, setDoc, getDoc, updateDoc, query, where, getDocs, orderBy, Timestamp } from 'firebase/firestore'
import { getUserProfile } from '@/lib/user'

// ============================================
// TYPES
// ============================================

export type OrderStatus =
    | 'pending'           // รอชำระเงิน
    | 'paid'              // ชำระเงินแล้ว
    | 'confirmed'         // ผู้ขายยืนยัน
    | 'shipping'          // กำลังจัดส่ง
    | 'delivered'         // จัดส่งแล้ว
    | 'completed'         // เสร็จสิ้น
    | 'cancelled'         // ยกเลิก
    | 'refunded'          // คืนเงิน
    | 'disputed'          // มีข้อพิพาท

export type DeliveryMethod = 'shipping' | 'meetup' | 'pickup'

export interface OrderItem {
    listingId: string
    title: string
    price: number
    quantity: number
    thumbnailUrl?: string
}

export interface ShippingInfo {
    method: DeliveryMethod
    carrier?: string // Kerry, Flash, etc.
    trackingNumber?: string
    address?: {
        name: string
        phone: string
        address: string
        district: string
        amphoe: string
        province: string
        zipcode: string
    }
    meetupLocation?: {
        name: string
        lat?: number
        lng?: number
        datetime?: Date
    }
}

export interface Order {
    id: string
    orderNumber: string // JK-20251229-XXXXX

    // Participants
    buyerId: string
    buyerName: string
    sellerId: string
    sellerName: string

    // Items
    items: OrderItem[]

    // Pricing
    subtotal: number
    shippingFee: number
    platformFee: number
    total: number

    // Status
    status: OrderStatus
    statusHistory: {
        status: OrderStatus
        timestamp: Date
        note?: string
    }[]

    // Payment
    paymentIntentId?: string
    paymentMethod?: string
    paidAt?: Date

    // Shipping
    shipping: ShippingInfo

    // Timestamps
    createdAt: Date
    updatedAt: Date
    completedAt?: Date
    cancelledAt?: Date

    // Notes
    buyerNote?: string
    sellerNote?: string
    cancelReason?: string
}

// ============================================
// ORDER SERVICE
// ============================================

class OrderService {
    private isEnabled: boolean
    private collectionName = 'orders'

    constructor() {
        this.isEnabled = FEATURE_FLAGS.ORDER_SYSTEM_ENABLED
    }

    /**
     * Check if order system is available
     */
    isAvailable(): boolean {
        return this.isEnabled
    }

    /**
     * Generate order number
     */
    private generateOrderNumber(): string {
        const date = new Date()
        const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '')
        const random = Math.random().toString(36).substr(2, 5).toUpperCase()
        return `JK-${dateStr}-${random}`
    }

    /**
     * Create a new order
     */
    async createOrder(
        buyerId: string,
        buyerName: string,
        sellerId: string,
        sellerName: string,
        items: OrderItem[],
        shipping: ShippingInfo,
        buyerNote?: string
    ): Promise<Order | null> {
        if (!this.isEnabled) {
            console.log('📦 Order system is disabled in Classified mode')
            return null
        }

        const orderId = doc(collection(db, this.collectionName)).id
        const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
        const shippingFee = this.calculateShippingFee(shipping)
        const platformFee = this.calculatePlatformFee(subtotal)
        const now = new Date()

        // Construct internal Order object (CamelCase) for return
        const order: Order = {
            id: orderId,
            orderNumber: this.generateOrderNumber(),
            buyerId,
            buyerName,
            sellerId,
            sellerName,
            items,
            subtotal,
            shippingFee,
            platformFee,
            total: subtotal + shippingFee,
            status: 'pending',
            statusHistory: [{
                status: 'pending',
                timestamp: now,
                note: 'Order created'
            }],
            shipping,
            createdAt: now,
            updatedAt: now,
            buyerNote: buyerNote || ''
        }

        try {
            // Map to Snake Case for Firestore (Legacy/Seller Dashboard Compatibility)
            const orderData = {
                id: order.id,
                order_number: order.orderNumber,

                // Participants
                buyer_id: order.buyerId,
                buyer_name: order.buyerName,
                seller_id: order.sellerId,
                seller_name: order.sellerName,

                // Items (Mapped to Seller Dashboard Format)
                items: order.items.map(item => ({
                    product_id: item.listingId,
                    product_title: item.title,
                    product_image: item.thumbnailUrl || '',
                    quantity: item.quantity,
                    price_per_unit: item.price,
                    total_price: item.price * item.quantity
                })),

                // Pricing
                subtotal_price: order.subtotal,
                shipping_fee: order.shippingFee,
                platform_fee: order.platformFee,
                net_total: order.total, // Seller dashboard uses net_total

                // Status
                status: order.status,
                status_history: order.statusHistory.map(h => ({
                    status: h.status,
                    timestamp: Timestamp.fromDate(h.timestamp),
                    note: h.note || ''
                })),

                // Shipping
                shipping_address: order.shipping.address ? { ...order.shipping.address } : null,
                shipping_method: order.shipping.method,

                // Meta
                created_at: Timestamp.fromDate(order.createdAt),
                updated_at: Timestamp.fromDate(order.updatedAt),
                buyer_note: order.buyerNote || ''
            }

            // Remove undefined values
            const cleanData = JSON.parse(JSON.stringify(orderData))

            await setDoc(doc(db, this.collectionName, orderId), cleanData)

            console.log('📦 Order created:', order.orderNumber)
            return order
        } catch (error) {
            console.error('Error creating order:', error)
            return null
        }
    }

    /**
      * Create Order from Offer (Chat Integration)
      */
    async createOrderFromOffer(
        offerMetadata: { price: number; offer_status: string },
        chatRoom: any // Type ChatRoom but avoid circular dependency
    ): Promise<string | null> {
        if (!this.isEnabled) return null
        if (offerMetadata.offer_status !== 'accepted') return null

        try {
            // 1. Get User Details
            const [buyer, seller] = await Promise.all([
                getUserProfile(chatRoom.buyer_id),
                getUserProfile(chatRoom.seller_id)
            ])

            if (!buyer || !seller) throw new Error('User not found')

            // 2. Prepare Order Data
            const items: OrderItem[] = [{
                listingId: chatRoom.listing_id,
                title: chatRoom.listing_title,
                price: offerMetadata.price,
                quantity: 1,
                thumbnailUrl: chatRoom.listing_image
            }]

            // Default Shipping (Will be updated in Checkout)
            // Use dummy address or rely on later update?
            // For now, minimal shipping info. Secure checkout will require address.
            const shipping: ShippingInfo = {
                method: 'shipping',
                // address: { ... } // Address not known yet at offer acceptance time
            }

            // 3. Create Order
            const order = await this.createOrder(
                chatRoom.buyer_id,
                buyer.displayName || 'Buyer',
                chatRoom.seller_id,
                seller.displayName || 'Seller',
                items,
                shipping,
                'Created from Chat Offer'
            )

            return order ? order.id : null

        } catch (error) {
            console.error('Failed to create order from offer:', error)
            return null
        }
    }

    /**
     * Get order by ID
     */
    async getOrder(orderId: string): Promise<Order | null> {
        if (!this.isEnabled) return null

        try {
            const docRef = doc(db, this.collectionName, orderId)
            const docSnap = await getDoc(docRef)

            if (docSnap.exists()) {
                return this.parseOrder(docSnap.data())
            }
            return null
        } catch (error) {
            console.error('Error getting order:', error)
            return null
        }
    }

    /**
     * Get orders for buyer
     */
    async getBuyerOrders(buyerId: string): Promise<Order[]> {
        if (!this.isEnabled) return []

        try {
            const q = query(
                collection(db, this.collectionName),
                where('buyer_id', '==', buyerId),
                orderBy('created_at', 'desc')
            )
            const snapshot = await getDocs(q)
            return snapshot.docs.map(doc => this.parseOrder(doc.data()))
        } catch (error) {
            console.error('Error getting buyer orders:', error)
            return []
        }
    }

    /**
     * Get orders for seller
     */
    async getSellerOrders(sellerId: string): Promise<Order[]> {
        if (!this.isEnabled) return []

        try {
            const q = query(
                collection(db, this.collectionName),
                where('seller_id', '==', sellerId),
                orderBy('created_at', 'desc')
            )
            const snapshot = await getDocs(q)
            return snapshot.docs.map(doc => this.parseOrder(doc.data()))
        } catch (error) {
            console.error('Error getting seller orders:', error)
            return []
        }
    }

    /**
     * Update order status
     */
    async updateStatus(orderId: string, status: OrderStatus, note?: string): Promise<boolean> {
        if (!this.isEnabled) return false

        try {
            const docRef = doc(db, this.collectionName, orderId)
            const orderDoc = await getDoc(docRef) // Fetch raw to get history

            if (!orderDoc.exists()) return false

            const currentHistory = orderDoc.data().status_history || []

            const statusEntry = {
                status,
                timestamp: Timestamp.now(),
                note: note || ''
            }

            const updates: any = {
                status,
                status_history: [...currentHistory, statusEntry],
                updated_at: Timestamp.now()
            }

            if (status === 'completed') updates.completed_at = Timestamp.now()
            if (status === 'cancelled') updates.cancelled_at = Timestamp.now()
            if (status === 'paid') updates.paid_at = Timestamp.now()

            await updateDoc(docRef, updates)

            console.log('📦 Order status updated:', orderId, status)
            return true
        } catch (error) {
            console.error('Error updating order status:', error)
            return false
        }
    }

    /**
     * Add tracking number
     */
    async addTrackingNumber(orderId: string, carrier: string, trackingNumber: string): Promise<boolean> {
        if (!this.isEnabled) return false

        try {
            const docRef = doc(db, this.collectionName, orderId)
            await updateDoc(docRef, {
                'shipping_provider': carrier,
                'tracking_number': trackingNumber, // Seller dashboard uses this
                // 'shipping.carrier': carrier, // Old way
                // 'shipping.trackingNumber': trackingNumber, // Old way
                status: 'shipping',
                updated_at: Timestamp.now()
            })
            return true
        } catch (error) {
            console.error('Error adding tracking:', error)
            return false
        }
    }

    /**
     * Calculate shipping fee
     */
    private calculateShippingFee(shipping: ShippingInfo): number {
        if (shipping.method === 'meetup' || shipping.method === 'pickup') {
            return 0
        }
        return 50 // Default 50 THB
    }

    /**
     * Calculate platform fee
     */
    private calculatePlatformFee(subtotal: number): number {
        const feePercent = PLATFORM_CONFIG.payment.platformFeePercent
        return Math.round(subtotal * (feePercent / 100))
    }

    /**
     * Parse Firestore data (Snake Case) to Order (Camel Case)
     */
    private parseOrder(data: any): Order {
        return {
            id: data.id,
            orderNumber: data.order_number || data.orderNumber, // Support both for safety

            buyerId: data.buyer_id || data.buyerId,
            buyerName: data.buyer_name || data.buyerName || 'Unknown Buyer',
            sellerId: data.seller_id || data.sellerId,
            sellerName: data.seller_name || data.sellerName || 'Unknown Seller',

            items: (data.items || []).map((item: any) => ({
                listingId: item.product_id || item.listingId,
                title: item.product_title || item.title,
                price: item.price_per_unit || item.price,
                quantity: item.quantity,
                thumbnailUrl: item.product_image || item.thumbnailUrl
            })),

            subtotal: data.subtotal_price || data.subtotal,
            shippingFee: data.shipping_fee || data.shippingFee,
            platformFee: data.platform_fee || data.platformFee,
            total: data.net_total || data.total,

            status: data.status,
            statusHistory: (data.status_history || data.statusHistory || []).map((h: any) => ({
                status: h.status,
                timestamp: h.timestamp?.toDate ? h.timestamp.toDate() : new Date(h.timestamp),
                note: h.note
            })),

            shipping: {
                method: data.shipping_method || 'shipping',
                address: data.shipping_address,
                trackingNumber: data.tracking_number,
                carrier: data.shipping_provider
            },

            paymentMethod: data.payment_method || data.paymentMethod,
            paidAt: data.paid_at?.toDate ? data.paid_at.toDate() : undefined,

            createdAt: data.created_at?.toDate ? data.created_at.toDate() : new Date(),
            updatedAt: data.updated_at?.toDate ? data.updated_at.toDate() : new Date(),
            completedAt: data.completed_at?.toDate ? data.completed_at.toDate() : undefined,
            cancelledAt: data.cancelled_at?.toDate ? data.cancelled_at.toDate() : undefined,

            buyerNote: data.buyer_note || data.buyerNote,
        }
    }

    // ==========================================
    // MOCK PAYMENT MODE (Phase 0)
    // ==========================================

    /**
     * Generate mock PromptPay QR (for testing)
     */
    generateMockPromptPayQR(amount: number): string {
        const mockData = `PROMPTPAY|MOCK|${amount}|THB|${Date.now()}`
        return `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(mockData)}`
    }

    /**
     * Simulate payment verification (Mock Mode)
     */
    async simulateMockPayment(
        orderId: string,
        delay: number = 2000
    ): Promise<{ success: boolean; message: string }> {
        console.log('🔄 [MOCK] Simulating payment verification...')

        await new Promise(resolve => setTimeout(resolve, delay))

        // Mock: 95% success rate
        const success = Math.random() > 0.05

        if (success) {
            // Update using the same updateStatus method
            await this.updateStatus(orderId, 'paid', 'Mock payment successful')

            // Additional Payment details in snake_case
            const docRef = doc(db, this.collectionName, orderId)
            await updateDoc(docRef, {
                payment_method: 'mock_promptpay',
                payment_intent_id: `mock_${Date.now()}`
            })

            console.log('✅ [MOCK] Payment verified!')
            return { success: true, message: 'การชำระเงินสำเร็จ (Mock Mode)' }
        } else {
            console.log('❌ [MOCK] Payment failed!')
            return { success: false, message: 'การชำระเงินล้มเหลว (Mock Mode)' }
        }
    }

    /**
     * Get order status display
     */
    getStatusDisplay(status: OrderStatus, lang: 'th' | 'en' = 'th'): { text: string; color: string } {
        const statusMap = {
            pending: { th: 'รอชำระเงิน', en: 'Pending Payment', color: 'yellow' },
            paid: { th: 'ชำระเงินแล้ว', en: 'Paid', color: 'blue' },
            confirmed: { th: 'ยืนยันแล้ว', en: 'Confirmed', color: 'cyan' },
            shipping: { th: 'กำลังจัดส่ง', en: 'Shipping', color: 'purple' },
            delivered: { th: 'ส่งถึงแล้ว', en: 'Delivered', color: 'indigo' },
            completed: { th: 'เสร็จสิ้น', en: 'Completed', color: 'green' },
            cancelled: { th: 'ยกเลิก', en: 'Cancelled', color: 'gray' },
            refunded: { th: 'คืนเงินแล้ว', en: 'Refunded', color: 'orange' },
            disputed: { th: 'มีข้อพิพาท', en: 'Disputed', color: 'red' }
        }

        const status_info = statusMap[status] || { th: status, en: status, color: 'gray' }
        return {
            text: lang === 'th' ? status_info.th : status_info.en,
            color: status_info.color
        }
    }

    /**
     * Check if order can be cancelled
     */
    canCancel(status: OrderStatus): boolean {
        return ['pending', 'paid', 'confirmed'].includes(status)
    }

    /**
     * Check if order can be marked as shipped
     */
    canShip(status: OrderStatus): boolean {
        return ['paid', 'confirmed'].includes(status)
    }

    /**
     * Check if order can be completed
     */
    canComplete(status: OrderStatus): boolean {
        return status === 'delivered'
    }
}

export const orderService = new OrderService()
export default orderService
