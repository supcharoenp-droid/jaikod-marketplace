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
    addDoc,
    getCountFromServer
} from 'firebase/firestore'
import { logAdminAction } from '@/lib/adminLogger'
import { AdminUser } from '@/types/admin'
import { Product } from '@/types'

// Type extension for Admin
export interface AdminProduct extends Product {
    violationCount?: number
}

// 1. GET /admin/products (List + Filter)
export async function getAdminProducts(filter: { status?: string, search?: string }) {
    try {
        const prodRef = collection(db, 'products')
        // In real app, we would dynamically build query.
        // For simple admin dashboard, let's fetch latest 50-100 items.

        let q = query(prodRef, orderBy('created_at', 'desc'), limit(100))

        const snap = await getDocs(q)
        let products = snap.docs.map(dS => {
            const d = dS.data()
            return {
                id: dS.id,
                ...d,
                created_at: d.created_at?.toDate(),
                updated_at: d.updated_at?.toDate()
            } as AdminProduct
        })

        // NOTE: In production, use Algolia/Typesense for this.
        if (filter.search) {
            const term = filter.search.toLowerCase()
            products = products.filter(p =>
                p.title.toLowerCase().includes(term) ||
                p.description.toLowerCase().includes(term)
            )
        }

        if (filter.status && filter.status !== 'all') {
            products = products.filter(p => p.status === filter.status)
        }

        return products
    } catch (error) {
        console.error('Error fetching admin products:', error)
        return []
    }
}

// 2. GET /admin/products/:id
export async function getAdminProductById(id: string): Promise<AdminProduct | null> {
    try {
        const d = await getDoc(doc(db, 'products', id))
        if (d.exists()) {
            const data = d.data()
            return {
                id: d.id,
                ...data,
                created_at: data.created_at?.toDate(),
                updated_at: data.updated_at?.toDate()
            } as AdminProduct
        }
        return null
    } catch (e) {
        return null
    }
}

// 3. Stats
export async function getProductStats() {
    try {
        const coll = collection(db, 'products')
        const snap = await getCountFromServer(coll)
        // Note: Counting by status efficiently requires aggregated counters or individual queries
        // which might be expensive. For demo, we might just estimate or do partial counts if scaling.
        // Or fetch all metadata if small.

        // Let's do a quick estimation based on the list we fetched or separate simple queries
        // For scalability, we should use counters. For now, let's just return placeholders or query simple counts
        const activeQ = query(coll, where('status', '==', 'active'))
        const activeSnap = await getCountFromServer(activeQ)

        const pendingQ = query(coll, where('status', '==', 'pending')) // If we had a pending status
        const pendingSnap = await getCountFromServer(pendingQ)

        const bannedQ = query(coll, where('status', '==', 'suspended'))
        const bannedSnap = await getCountFromServer(bannedQ)

        return {
            total: snap.data().count,
            active: activeSnap.data().count,
            pending: pendingSnap.data().count, // Often 0 if no pre-approve
            suspended: bannedSnap.data().count
        }
    } catch (e) {
        return { total: 0, active: 0, pending: 0, suspended: 0 }
    }
}

// 4. Actions

export async function approveProduct(admin: AdminUser, id: string) {
    try {
        await updateDoc(doc(db, 'products', id), {
            status: 'active',
            approved_by: admin.id,
            approved_at: Timestamp.now()
        })
        await logAdminAction(admin, 'PRODUCT_APPROVE', `Product: ${id}`, 'Approved product listing')
    } catch (e) { throw e }
}

export async function rejectProduct(admin: AdminUser, id: string, reason: string) {
    try {
        await updateDoc(doc(db, 'products', id), {
            status: 'rejected',
            reject_reason: reason,
            rejected_by: admin.id,
            rejected_at: Timestamp.now()
        })
        await logAdminAction(admin, 'PRODUCT_REJECT', `Product: ${id}`, `Rejected: ${reason}`)
    } catch (e) { throw e }
}

export async function freezeProduct(admin: AdminUser, id: string, reason: string) {
    try {
        await updateDoc(doc(db, 'products', id), {
            status: 'suspended',
            suspend_reason: reason,
            suspended_by: admin.id,
            suspended_at: Timestamp.now()
        })
        await logAdminAction(admin, 'PRODUCT_FREEZE', `Product: ${id}`, `Suspended: ${reason}`)
    } catch (e) { throw e }
}

export async function flagProduct(admin: AdminUser, id: string, reason: string) {
    try {
        // Increment violations
        const ref = doc(db, 'products', id)
        const d = await getDoc(ref)
        const currentViolations = d.data()?.violation_count || 0

        await updateDoc(ref, {
            violation_count: currentViolations + 1,
            last_flagged_at: Timestamp.now(),
            last_flag_reason: reason
        })

        // Also add to flags collection
        await addDoc(collection(db, 'product_flags'), {
            product_id: id,
            reason: reason,
            flagged_by: admin.id,
            created_at: Timestamp.now(),
            type: 'manual'
        })

        await logAdminAction(admin, 'PRODUCT_FLAG', `Product: ${id}`, `Flagged: ${reason}`)
    } catch (e) { throw e }
}
