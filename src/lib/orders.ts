import {
    collection,
    query,
    where,
    orderBy,
    getDocs,
    doc,
    updateDoc,
    serverTimestamp,
    addDoc
} from 'firebase/firestore'
import { db } from './firebase'
import { Order } from '@/types'

const ORDERS_COLLECTION = 'orders'

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

// Temporary: Function to create a mock order for testing
export async function createMockOrder(sellerId: string, buyerId: string, products: any[]): Promise<string> {
    try {
        const orderData = {
            order_number: `ORD-${Date.now()}`,
            seller_id: sellerId,
            buyer_id: buyerId,
            items: products.map(p => ({
                id: `item-${Math.random().toString(36).substr(2, 9)}`,
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
            status: 'pending_payment',
            payment_method: 'promptpay',
            shipping_address: {
                address_line1: '123 Fake Street',
                subdistrict: 'Luka',
                district: 'Sathorn',
                province: 'Bangkok',
                postal_code: '10120',
                phone: '0812345678',
                name: 'Test Buyer'
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
