/**
 * JAISTAR ALPHA V2 - CORE LEDGER
 * 
 * atomic execution for all star movements.
 */

import { db } from '@/lib/firebase'
import {
    doc,
    runTransaction,
    serverTimestamp,
    collection,
    increment,
    getDoc
} from 'firebase/firestore'
import {
    JaiStarRegistryV2,
    JaiStarLedgerEntryV2,
    JaiStarTransactionTypeV2,
    JaiStarTierV2,
    JAISTAR_TIER_CONFIG_V2
} from './v2_types'

export class JaiStarLedger {
    private static REGISTRY = 'jaistar_v2_registry'
    private static LEDGER = 'jaistar_v2_ledger'

    /**
     * get current user registry
     */
    static async getRegistry(userId: string): Promise<JaiStarRegistryV2 | null> {
        const ref = doc(db, this.REGISTRY, userId)
        const snap = await getDoc(ref)
        if (!snap.exists()) return null
        return snap.data() as JaiStarRegistryV2
    }

    /**
     * THE ATOMIC MOVE
     * Moves stars in or out with absolute integrity.
     */
    static async execute(params: {
        userId: string,
        amount: number, // positive for earn, negative for spend
        type: JaiStarTransactionTypeV2,
        description: string,
        referenceId?: string,
        metadata?: any
    }): Promise<{ success: boolean; newBalance: number; error?: string }> {
        const { userId, amount, type, description, referenceId, metadata } = params
        const registryRef = doc(db, this.REGISTRY, userId)
        const ledgerRef = doc(collection(db, this.LEDGER))

        try {
            const result = await runTransaction(db, async (tx) => {
                const regSnap = await tx.get(registryRef)

                let currentBalance = 0
                let currentTier: JaiStarTierV2 = 'bronze'
                let currentTierPoints = 0
                let currentLifetimeEarned = 0
                let currentLifetimeSpent = 0

                if (regSnap.exists()) {
                    const data = regSnap.data() as JaiStarRegistryV2
                    currentBalance = data.balance || 0
                    currentTier = data.tier || 'bronze'
                    currentTierPoints = data.tier_points || 0
                    currentLifetimeEarned = data.lifetime_earned || 0
                    currentLifetimeSpent = data.lifetime_spent || 0
                }

                // Security Check: Insufficient funds
                if (amount < 0 && currentBalance + amount < 0) {
                    throw new Error('INSUFFICIENT_STARS')
                }

                const newBalance = currentBalance + amount
                const newLifetimeEarned = amount > 0 ? currentLifetimeEarned + amount : currentLifetimeEarned
                const newLifetimeSpent = amount < 0 ? currentLifetimeSpent + Math.abs(amount) : currentLifetimeSpent
                const newTierPoints = amount > 0 ? currentTierPoints + amount : currentTierPoints

                // Tier Calculation Logic (Progressive)
                let newTier = currentTier
                for (const [tier, config] of Object.entries(JAISTAR_TIER_CONFIG_V2)) {
                    if (newTierPoints >= config.min_points) {
                        newTier = tier as JaiStarTierV2
                    }
                }

                // 1. Update/Create Registry
                const registryUpdate: Partial<JaiStarRegistryV2> = {
                    userId,
                    balance: newBalance,
                    tier: newTier,
                    tier_points: newTierPoints,
                    lifetime_earned: newLifetimeEarned,
                    lifetime_spent: newLifetimeSpent,
                    last_transaction_id: ledgerRef.id,
                    updated_at: serverTimestamp(),
                    status: 'active'
                }

                if (!regSnap.exists()) {
                    tx.set(registryRef, {
                        ...registryUpdate,
                        created_at: serverTimestamp()
                    })
                } else {
                    tx.update(registryRef, registryUpdate)
                }

                // 2. Write Immutable Ledger Entry
                const ledgerEntry: JaiStarLedgerEntryV2 = {
                    id: ledgerRef.id,
                    userId,
                    type,
                    amount,
                    balance_after: newBalance,
                    description,
                    reference_id: referenceId,
                    metadata,
                    status: 'completed',
                    created_at: serverTimestamp()
                }
                tx.set(ledgerRef, ledgerEntry)

                return { success: true, newBalance }
            })

            return result
        } catch (error: any) {
            console.error('[JaiStarLedger] Transaction Failed:', error)
            return {
                success: false,
                newBalance: 0,
                error: error.message || 'TRANSACTION_FAILED'
            }
        }
    }
}
