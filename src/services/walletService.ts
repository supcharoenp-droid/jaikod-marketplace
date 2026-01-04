
import { db } from '@/lib/firebase'
import {
    doc,
    getDoc,
    setDoc,
    updateDoc,
    collection,
    addDoc,
    query,
    orderBy,
    limit,
    getDocs,
    serverTimestamp,
    increment,
    Timestamp,
    runTransaction,
    where
} from 'firebase/firestore'

// ==========================================
// TYPES
// ==========================================

export interface Wallet {
    userId: string
    balance: number
    updatedAt: any
    isInitialized: boolean
}

export type TransactionType = 'topup' | 'payment' | 'refund' | 'bonus' | 'adjustment'

export interface WalletTransaction {
    id: string
    userId: string
    type: TransactionType
    amount: number
    balanceAfter: number
    description: string
    referenceId?: string // e.g. PaymentIntent ID, Order ID, or Campaign ID
    status: 'pending' | 'success' | 'failed'
    createdAt: any
}

// ==========================================
// SERVICE
// ==========================================

class WalletService {
    private static instance: WalletService

    public static getInstance(): WalletService {
        if (!WalletService.instance) {
            WalletService.instance = new WalletService()
        }
        return WalletService.instance
    }

    /**
     * Get user wallet, initializing it if it doesn't exist (Mock logic for "Give everyone free credits")
     */
    async getWallet(userId: string): Promise<Wallet> {
        if (!userId) throw new Error('User ID required')

        const walletRef = doc(db, 'wallets', userId)
        const walletSnap = await getDoc(walletRef)

        if (walletSnap.exists()) {
            return walletSnap.data() as Wallet
        } else {
            // == LOGIC: Initialize new wallet with FREE CREDITS == 
            // This satisfies the requirement: "Give everyone some money first"
            const initialBalance = 500 // Giving 500 Stars free

            const newWallet: Wallet = {
                userId,
                balance: initialBalance,
                updatedAt: serverTimestamp(),
                isInitialized: true
            }

            // Using transaction to ensure we create the wallet and the history record together
            await runTransaction(db, async (transaction) => {
                transaction.set(walletRef, newWallet)

                // Add initial transaction record
                const historyRef = doc(collection(db, 'wallet_transactions'))
                const initialTx: Omit<WalletTransaction, 'id'> = {
                    userId,
                    type: 'bonus',
                    amount: initialBalance,
                    balanceAfter: initialBalance,
                    description: '🎁 Welcome Gift: Free Starter Credits',
                    status: 'success',
                    createdAt: serverTimestamp()
                }
                transaction.set(historyRef, initialTx)
            })

            return newWallet
        }
    }

    /**
     * Top up wallet (Simulates Bank Transfer / Payment Gateway success)
     */
    async topUp(userId: string, amount: number, packageId: string): Promise<boolean> {
        try {
            const walletRef = doc(db, 'wallets', userId)

            await runTransaction(db, async (transaction) => {
                const walletDoc = await transaction.get(walletRef)

                if (!walletDoc.exists()) {
                    throw new Error("Wallet not found")
                }

                const currentBalance = walletDoc.data().balance || 0
                const newBalance = currentBalance + amount

                // Update wallet
                transaction.update(walletRef, {
                    balance: newBalance,
                    updatedAt: serverTimestamp()
                })

                // Add transaction history
                const historyRef = doc(collection(db, 'wallet_transactions'))
                const tx: Omit<WalletTransaction, 'id'> = {
                    userId,
                    type: 'topup',
                    amount: amount,
                    balanceAfter: newBalance,
                    description: `Top up via Mock Bank (Package #${packageId})`,
                    referenceId: `MOCK_PAY_${Date.now()}`,
                    status: 'success',
                    createdAt: serverTimestamp()
                }
                transaction.set(historyRef, tx)
            })

            return true
        } catch (error) {
            console.error("TopUp Failed:", error)
            return false
        }
    }

    /**
     * Deduct funds (for paying for ads/services)
     */
    async deduct(userId: string, amount: number, description: string, referenceId?: string): Promise<boolean> {
        try {
            const walletRef = doc(db, 'wallets', userId)

            await runTransaction(db, async (transaction) => {
                const walletDoc = await transaction.get(walletRef)

                if (!walletDoc.exists()) {
                    throw new Error("Wallet not found")
                }

                const currentBalance = walletDoc.data().balance || 0

                if (currentBalance < amount) {
                    throw new Error("Insufficient funds")
                }

                const newBalance = currentBalance - amount

                // Update wallet
                transaction.update(walletRef, {
                    balance: newBalance,
                    updatedAt: serverTimestamp()
                })

                // Add transaction history
                const historyRef = doc(collection(db, 'wallet_transactions'))
                const tx: Omit<WalletTransaction, 'id'> = {
                    userId,
                    type: 'payment',
                    amount: -amount, // Negative for display logic if needed (though type 'payment' implies deduction)
                    balanceAfter: newBalance,
                    description: description,
                    referenceId: referenceId,
                    status: 'success',
                    createdAt: serverTimestamp()
                }
                transaction.set(historyRef, tx)
            })

            return true
        } catch (error) {
            console.error("Deduct Failed:", error)
            throw error // Re-throw so UI can handle "Insufficient funds"
        }
    }

    /**
     * Get transaction history
     */
    async getHistory(userId: string, limitCount = 20): Promise<WalletTransaction[]> {
        const historyRef = collection(db, 'wallet_transactions')
        const q = query(
            historyRef,
            where('userId', '==', userId),
            orderBy('createdAt', 'desc'),
            limit(limitCount)
        )

        const snapshot = await getDocs(q)
        return snapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                ...data,
                // Convert Firestore Timestamp to JS Date if needed, or handle in UI
                createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date()
            } as WalletTransaction
        })
    }
}

// Helper for 'where' clause - moved to top

export const walletService = WalletService.getInstance()
