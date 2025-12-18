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
    getCountFromServer,
    addDoc
} from 'firebase/firestore'
import { logAdminAction } from '@/lib/adminLogger'
import { AdminUser } from '@/types/admin'

export interface PayoutRequest {
    id: string
    seller_id: string
    seller_name: string
    seller_bank: string // e.g. "KBANK 123-4-56789-0"
    amount: number
    status: 'pending' | 'approved' | 'rejected'
    created_at: Date
    processed_at?: Date
    reject_reason?: string
}

export interface FinanceStats {
    totalRevenue: number
    pendingPayoutsAmount: number
    pendingPayoutsCount: number
    processedPayoutsAmount: number
}

// 1. GET /admin/payouts
export async function getPayouts(status: string = 'all') {
    try {
        const ref = collection(db, 'payouts')
        let q = query(ref, orderBy('created_at', 'desc'), limit(50))

        if (status !== 'all') {
            q = query(ref, where('status', '==', status), orderBy('created_at', 'desc'), limit(50))
        }

        const snap = await getDocs(q)
        return snap.docs.map(d => {
            const data = d.data()
            return {
                id: d.id,
                ...data,
                created_at: data.created_at?.toDate(),
                processed_at: data.processed_at?.toDate()
            } as PayoutRequest
        })
    } catch (e) {
        console.error('Error fetching payouts:', e)
        return []
    }
}

// 2. Actions
export async function approvePayout(admin: AdminUser, payoutId: string) {
    try {
        await updateDoc(doc(db, 'payouts', payoutId), {
            status: 'approved',
            processed_by: admin.id,
            processed_at: Timestamp.now()
        })

        // In a real system, this would trigger a bank API transfer or create a transaction log

        await logAdminAction(admin, 'FINANCE_APPROVE', `Payout: ${payoutId}`, `Approved withdrawal`)
        return true
    } catch (e) { throw e }
}

export async function rejectPayout(admin: AdminUser, payoutId: string, reason: string) {
    try {
        await updateDoc(doc(db, 'payouts', payoutId), {
            status: 'rejected',
            reject_reason: reason,
            processed_by: admin.id,
            processed_at: Timestamp.now()
        })
        await logAdminAction(admin, 'FINANCE_REJECT', `Payout: ${payoutId}`, `Rejected: ${reason}`)
        return true
    } catch (e) { throw e }
}

// 3. Stats
export async function getFinanceStats(): Promise<FinanceStats> {
    try {
        // Mock calculation or fetch from aggregations
        // In real Firestore, use distributed counters or cloud functions to aggregate 'transactions'

        // For MVP, allow mock stats or simple fetch calculation if data is small
        const payoutsSnap = await getDocs(collection(db, 'payouts'))
        const payouts = payoutsSnap.docs.map(d => d.data())

        const pending = payouts.filter(p => p.status === 'pending')
        const approved = payouts.filter(p => p.status === 'approved')

        // Total revenue usually comes from Orders commission.
        // Let's assume a simplified commission model or just sum of order totals for now
        // Or better, fetch 'system_revenue' doc if we had one.
        // Let's mock Total Revenue as 15% of total approved transactions for display

        return {
            totalRevenue: 1250000, // Mock for 'Total Revenue' (e.g. commission collected)
            pendingPayoutsAmount: pending.reduce((sum, p) => sum + (p.amount || 0), 0),
            pendingPayoutsCount: pending.length,
            processedPayoutsAmount: approved.reduce((sum, p) => sum + (p.amount || 0), 0)
        }
    } catch (e) {
        return { totalRevenue: 0, pendingPayoutsAmount: 0, pendingPayoutsCount: 0, processedPayoutsAmount: 0 }
    }
}

// Temporary: Create Mock Payouts for Testing
export async function seedMockPayouts() {
    const mocks = [
        { seller_name: 'Somchai Shop', seller_bank: 'KBANK 123-xxx-7890', amount: 5000, status: 'pending' },
        { seller_name: 'Fashion D', seller_bank: 'SCB 987-xxx-6543', amount: 12500, status: 'pending' },
        { seller_name: 'IT Gadget', seller_bank: 'BBL 111-xxx-2222', amount: 8000, status: 'approved' },
        { seller_name: 'Keng Mobile', seller_bank: 'TrueMoney 081-xxx-8888', amount: 3500, status: 'rejected' },
    ]

    // Check if empty
    const s = await getDocs(collection(db, 'payouts'))
    if (!s.empty) return

    for (const m of mocks) {
        await addDoc(collection(db, 'payouts'), {
            ...m,
            seller_id: 'mock_seller_id',
            created_at: Timestamp.now()
        })
    }
}
