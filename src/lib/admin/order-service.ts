import { db } from '@/lib/firebase'
import {
    collection,
    doc,
    getDocs,
    getDoc,
    updateDoc,
    query,
    where,
    orderBy,
    limit,
    Timestamp,
    getCountFromServer
} from 'firebase/firestore'
import { logAdminAction } from '@/lib/adminLogger'
import { AdminUser } from '@/types/admin'
import { Order } from '@/types' // Assuming Order type exists

export interface AdminOrder extends Order {
    buyer_name?: string
    seller_name?: string
}

// 1. GET /admin/orders
export async function getAdminOrders(filter: { status?: string, search?: string }) {
    try {
        const orderRef = collection(db, 'orders')

        let q = query(orderRef, orderBy('created_at', 'desc'), limit(50))

        const snap = await getDocs(q)
        let orders = snap.docs.map(docSnap => {
            const d = docSnap.data()
            return {
                id: docSnap.id,
                ...d,
                created_at: d.created_at?.toDate(),
                updated_at: d.updated_at?.toDate()
            } as AdminOrder
        })

        // Client-side filtering
        if (filter.search) {
            const term = filter.search.toLowerCase()
            orders = orders.filter(o =>
                o.id.toLowerCase().includes(term) ||
                o.order_number?.toLowerCase().includes(term) ||
                o.shipping_address?.name?.toLowerCase().includes(term)
            )
        }

        if (filter.status && filter.status !== 'all') {
            orders = orders.filter(o => o.status === filter.status)
        }

        return orders
    } catch (error) {
        console.error('Error fetching admin orders:', error)
        return []
    }
}

// 2. GET Stats
export async function getOrderStats() {
    try {
        const coll = collection(db, 'orders')

        // Simple client-side stats from a reasonable fetch size or use count aggregation
        // For accurate dashboard, we'd enable count aggregation indexes.

        // Let's rely on mapping simple counts or returning 0 if too costly to query all
        // For MVP, we'll return default 0s or try fetching a batch
        const snap = await getDocs(query(coll, limit(200)))
        const orders = snap.docs.map(d => d.data())

        return {
            total: orders.length, // approximate if > 200
            pending: orders.filter(o => o.status === 'pending_payment').length,
            paid: orders.filter(o => o.status === 'paid').length,
            shipped: orders.filter(o => o.status === 'shipped').length,
            completed: orders.filter(o => o.status === 'completed').length,
            cancelled: orders.filter(o => o.status === 'cancelled').length
        }
    } catch (e) {
        return { total: 0, pending: 0, paid: 0, shipped: 0, completed: 0, cancelled: 0 }
    }
}

// 3. Update Status
export async function updateAdminOrderStatus(admin: AdminUser, orderId: string, status: string, note?: string) {
    try {
        const updates: any = {
            status,
            updated_at: Timestamp.now()
        }
        if (status === 'cancelled' && note) {
            updates.cancel_reason = note
            updates.cancelled_by = 'admin'
        }

        await updateDoc(doc(db, 'orders', orderId), updates)
        await logAdminAction(admin, 'ORDER_UPDATE', `Order: ${orderId}`, `Status changed to ${status}. ${note || ''}`)
        return true
    } catch (e) {
        throw e
    }
}
