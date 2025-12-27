
import {
    collection,
    query,
    where,
    orderBy,
    getDocs,
    doc,
    updateDoc,
    deleteDoc,
    serverTimestamp,
    addDoc,
    Timestamp
} from 'firebase/firestore'
import { db } from './firebase'
import { Order, Address } from '@/types'
import { CartItem } from '@/services/cartService'


const ORDERS_COLLECTION = 'orders'

// Define Order Input Interface
export interface CreateOrderInput {
    buyer_id: string
    seller_id: string // Currently assume single seller per order or mixed? Complex marketplaces split orders by seller
    items: CartItem[]
    shipping_address: Address
    payment_method: string
    shipping_method: string
    shipping_fee: number
    discount: number
    total: number
}

// Helper to Group Cart Items by Seller (Marketplace style)
export function groupItemsBySeller(items: CartItem[]) {
    const groups: Record<string, CartItem[]> = {}
    items.forEach(item => {
        const sellerId = item.product.seller_id
        if (!groups[sellerId]) groups[sellerId] = []
        groups[sellerId].push(item)
    })
    return groups
}

// Function to Create Orders (Splits by Seller automatically)
export async function createOrdersFromCart(input: Omit<CreateOrderInput, 'seller_id'>): Promise<string[]> {
    try {
        const sellerGroups = groupItemsBySeller(input.items)
        const orderIds: string[] = []

        for (const [sellerId, items] of Object.entries(sellerGroups)) {
            // Calculate subtotal for this seller
            const subtotal = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0)
            // Simplified shipping fee logic: Just split or duplicate? 
            // For MVP, assumed fixed shipping per order or per seller. Let's use input.shipping_fee for the first or split.
            // Let's assume input.shipping_fee is PER ORDER for now.

            const orderData = {
                order_string_id: `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`, // Friendlier ID
                buyer_id: input.buyer_id,
                seller_id: sellerId,
                items: items.map(item => ({
                    id: item.id,
                    product_id: item.product.id,
                    product_title: item.product.title,
                    product_image: item.product.thumbnail_url || item.product.images[0]?.url || '',
                    quantity: item.quantity,
                    price_per_unit: item.product.price,
                    total_price: item.product.price * item.quantity,
                    options: item.selectedOptions || {}
                })),

                // Financials
                subtotal_price: subtotal,
                shipping_fee: input.shipping_fee, // Verify logic later
                discount_amount: input.discount, // This might need pro-ration if multiple sellers
                net_total: subtotal + input.shipping_fee - input.discount,

                // Status
                status: 'pending_payment', // Initial state
                payment_method: input.payment_method,
                payment_status: 'unpaid',

                // Logistics
                shipping_address: input.shipping_address,
                shipping_method: input.shipping_method,

                created_at: serverTimestamp(),
                updated_at: serverTimestamp()
            }

            const ref = await addDoc(collection(db, ORDERS_COLLECTION), orderData)
            orderIds.push(ref.id)
        }

        return orderIds
    } catch (error) {
        console.error('Error creating orders:', error)
        throw error
    }
}

export async function getSellerOrders(sellerId: string): Promise<Order[]> {
    try {
        const q = query(
            collection(db, ORDERS_COLLECTION),
            where('seller_id', '==', sellerId),
            orderBy('created_at', 'desc')
        )
        const snapshot = await getDocs(q)
        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            created_at: doc.data().created_at?.toDate?.() || new Date(),
            updated_at: doc.data().updated_at?.toDate?.() || new Date(),
        })) as Order[]
    } catch (error) {
        console.error('Error getting seller orders:', error)
        return []
    }
}

export async function updateOrderStatus(
    orderId: string,
    status: Order['status'],
    trackingNumber?: string
): Promise<void> {
    try {
        const orderRef = doc(db, ORDERS_COLLECTION, orderId)
        const updates: any = {
            status,
            updated_at: serverTimestamp()
        }

        if (trackingNumber) {
            updates.tracking_number = trackingNumber
            updates.shipping_provider = 'Kerry Express' // Example default
        }

        await updateDoc(orderRef, updates)
    } catch (error) {
        console.error('Error updating order status:', error)
        throw error
    }
}

export async function deleteOrder(orderId: string): Promise<void> {
    try {
        const orderRef = doc(db, ORDERS_COLLECTION, orderId)
        await deleteDoc(orderRef)
    } catch (error) {
        console.error('Error deleting order:', error)
        throw error
    }
}

// Demo function to create mock orders for testing
export async function createMockOrder(
    sellerId: string,
    buyerId: string,
    products: { id: string; title: string; price: number; images?: { url: string }[] }[]
): Promise<string> {
    try {
        const orderData = {
            order_number: `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
            buyer_id: buyerId,
            seller_id: sellerId,
            items: products.map((p, idx) => ({
                id: `item_${idx}`,
                product_id: p.id,
                product_title: p.title,
                product_image: p.images?.[0]?.url || '',
                quantity: 1,
                price_per_unit: p.price,
                total_price: p.price
            })),
            total_price: products.reduce((sum, p) => sum + p.price, 0),
            shipping_fee: 50,
            discount_amount: 0,
            net_total: products.reduce((sum, p) => sum + p.price, 0) + 50,
            status: 'paid',
            payment_method: 'promptpay',
            shipping_address: {
                name: 'Demo Customer',
                phone: '0812345678',
                address_line1: '123/45 Demo Street',
                subdistrict: 'Demo Tambon',
                district: 'Demo Amphoe',
                province: 'Bangkok',
                postal_code: '10200'
            },
            created_at: serverTimestamp(),
            updated_at: serverTimestamp()
        }

        const ref = await addDoc(collection(db, ORDERS_COLLECTION), orderData)
        return ref.id
    } catch (error) {
        console.error('Error creating mock order:', error)
        throw error
    }
}
