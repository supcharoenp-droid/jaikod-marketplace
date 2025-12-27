/**
 * JaiStar Transaction Service
 * 
 * จัดการธุรกรรม JaiStar (แต้ม)
 */

import {
    collection, doc, getDoc, setDoc, getDocs,
    query, where, orderBy, limit, Timestamp
} from 'firebase/firestore'
import { db } from '../firebase'
import {
    JaiStarTransaction, JaiStarTransactionType, JaiStarTransactionStatus,
    TransactionFilter
} from './types'
import { getAccount, addStars, spendStars } from './account'

const TRANSACTIONS_COLLECTION = 'jaistar_transactions'

// Generate unique transaction ID
function generateTransactionId(): string {
    const timestamp = Date.now().toString(36)
    const random = Math.random().toString(36).substring(2, 6)
    return `jst_${timestamp}_${random}`.toUpperCase()
}

// ==========================================
// TRANSACTION CREATION
// ==========================================

/**
 * Create a transaction record
 */
export async function createTransaction(
    accountId: string,
    type: JaiStarTransactionType,
    amount: number,
    options: {
        title: string
        title_en?: string
        description?: string
        reference_type?: string
        reference_id?: string
        payment_method?: string
        price_thb?: number
        expires_at?: Date
    }
): Promise<JaiStarTransaction> {
    const transactionId = generateTransactionId()
    const transactionRef = doc(db, TRANSACTIONS_COLLECTION, transactionId)

    const account = await getAccount(accountId)
    const currentBalance = account?.balance || 0

    // Determine if incoming or outgoing
    const incomingTypes: JaiStarTransactionType[] = [
        'topup', 'promotion_bonus', 'referral_bonus', 'welcome_bonus',
        'daily_checkin', 'achievement'
    ]
    const isIncoming = incomingTypes.includes(type)
    const balanceChange = isIncoming ? amount : -amount

    const now = new Date()
    const transaction: JaiStarTransaction = {
        id: transactionId,
        account_id: accountId,
        type,
        amount: isIncoming ? amount : -amount,
        balance_before: currentBalance,
        balance_after: currentBalance + balanceChange,
        title: options.title,
        title_en: options.title_en,
        description: options.description,
        reference_type: options.reference_type as any,
        reference_id: options.reference_id,
        payment_method: options.payment_method as any,
        price_thb: options.price_thb,
        status: 'pending',
        expires_at: options.expires_at,
        created_at: now
    }

    await setDoc(transactionRef, {
        ...transaction,
        created_at: Timestamp.fromDate(now),
        expires_at: options.expires_at ? Timestamp.fromDate(options.expires_at) : null
    })

    return transaction
}

/**
 * Complete a transaction (apply balance change)
 */
export async function completeTransaction(
    transactionId: string
): Promise<{ success: boolean; error?: string }> {
    try {
        const transactionRef = doc(db, TRANSACTIONS_COLLECTION, transactionId)
        const transactionDoc = await getDoc(transactionRef)

        if (!transactionDoc.exists()) {
            return { success: false, error: 'Transaction not found' }
        }

        const transaction = transactionDoc.data() as JaiStarTransaction

        if (transaction.status === 'completed') {
            return { success: false, error: 'Transaction already completed' }
        }

        // Apply balance change
        const incomingTypes: JaiStarTransactionType[] = [
            'topup', 'promotion_bonus', 'referral_bonus', 'welcome_bonus',
            'daily_checkin', 'achievement'
        ]
        const isIncoming = incomingTypes.includes(transaction.type)
        const absAmount = Math.abs(transaction.amount)

        let result
        if (isIncoming) {
            result = await addStars(transaction.account_id, absAmount, transaction.type === 'topup')
        } else {
            result = await spendStars(transaction.account_id, absAmount)
        }

        if (!result.success) {
            await setDoc(transactionRef, {
                status: 'failed',
                error_message: result.error
            }, { merge: true })
            return { success: false, error: result.error }
        }

        // Update transaction status
        await setDoc(transactionRef, {
            status: 'completed',
            balance_after: result.new_balance,
            completed_at: Timestamp.now()
        }, { merge: true })

        return { success: true }
    } catch (error) {
        return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
    }
}

// ==========================================
// TRANSACTION QUERIES
// ==========================================

/**
 * Get transaction by ID
 */
export async function getTransaction(transactionId: string): Promise<JaiStarTransaction | null> {
    const transactionDoc = await getDoc(doc(db, TRANSACTIONS_COLLECTION, transactionId))
    if (!transactionDoc.exists()) return null

    const data = transactionDoc.data()
    return {
        id: transactionDoc.id,
        ...data,
        created_at: data.created_at?.toDate(),
        completed_at: data.completed_at?.toDate(),
        expires_at: data.expires_at?.toDate()
    } as JaiStarTransaction
}

/**
 * Get transactions for an account
 */
export async function getTransactions(
    accountId: string,
    filter?: TransactionFilter
): Promise<{ transactions: JaiStarTransaction[]; hasMore: boolean }> {
    let q = query(
        collection(db, TRANSACTIONS_COLLECTION),
        where('account_id', '==', accountId),
        orderBy('created_at', 'desc'),
        limit((filter?.limit || 20) + 1)
    )

    const snapshot = await getDocs(q)
    const transactions: JaiStarTransaction[] = []

    snapshot.forEach((doc) => {
        const data = doc.data()
        transactions.push({
            id: doc.id,
            ...data,
            created_at: data.created_at?.toDate(),
            completed_at: data.completed_at?.toDate(),
            expires_at: data.expires_at?.toDate()
        } as JaiStarTransaction)
    })

    const hasMore = transactions.length > (filter?.limit || 20)
    if (hasMore) transactions.pop()

    return { transactions, hasMore }
}

/**
 * Get recent transactions
 */
export async function getRecentTransactions(
    accountId: string,
    count: number = 5
): Promise<JaiStarTransaction[]> {
    const result = await getTransactions(accountId, { limit: count })
    return result.transactions
}

// ==========================================
// UTILITY FUNCTIONS
// ==========================================

/**
 * Get transaction type display name
 */
export function getTransactionTypeName(type: JaiStarTransactionType): { th: string; en: string } {
    const names: Record<JaiStarTransactionType, { th: string; en: string }> = {
        topup: { th: 'เติมแต้ม', en: 'Top Up' },
        boost_payment: { th: 'โปรโมทสินค้า', en: 'Boost Product' },
        highlight_payment: { th: 'ไฮไลต์การ์ด', en: 'Highlight Card' },
        feature_unlock: { th: 'ปลดล็อกฟีเจอร์', en: 'Unlock Feature' },
        promotion_bonus: { th: 'โบนัสโปรโมชั่น', en: 'Promotion Bonus' },
        referral_bonus: { th: 'โบนัสแนะนำเพื่อน', en: 'Referral Bonus' },
        welcome_bonus: { th: 'โบนัสสมัครใหม่', en: 'Welcome Bonus' },
        daily_checkin: { th: 'เช็คอินรายวัน', en: 'Daily Check-in' },
        achievement: { th: 'รางวัลความสำเร็จ', en: 'Achievement Reward' },
        expired: { th: 'แต้มหมดอายุ', en: 'Stars Expired' },
        adjustment: { th: 'ปรับยอด', en: 'Adjustment' }
    }
    return names[type] || { th: type, en: type }
}

/**
 * Check if transaction is incoming (adds stars)
 */
export function isIncomingTransaction(type: JaiStarTransactionType): boolean {
    return ['topup', 'promotion_bonus', 'referral_bonus', 'welcome_bonus',
        'daily_checkin', 'achievement'].includes(type)
}

/**
 * Format transaction amount with sign
 */
export function formatTransactionAmount(amount: number, type: JaiStarTransactionType): string {
    const isIncoming = isIncomingTransaction(type)
    const prefix = isIncoming ? '+' : ''
    return `${prefix}${amount} ⭐`
}
