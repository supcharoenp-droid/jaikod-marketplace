/**
 * JaiStar Account Service
 * 
 * จัดการบัญชี JaiStar (แต้ม) สำหรับผู้ใช้
 */

import {
    doc, getDoc, setDoc, updateDoc, Timestamp, increment
} from 'firebase/firestore'
import { db } from '../firebase'
import {
    JaiStarAccount, JaiStarTier, BalanceResponse,
    getTier, getNextTier, JAISTAR_TIERS
} from './types'

const ACCOUNTS_COLLECTION = 'jaistar_accounts'

// ==========================================
// ACCOUNT CREATION & RETRIEVAL
// ==========================================

/**
 * Create a new JaiStar account for user
 */
export async function createAccount(userId: string): Promise<JaiStarAccount> {
    const accountRef = doc(db, ACCOUNTS_COLLECTION, userId)

    // Check if already exists
    const existing = await getDoc(accountRef)
    if (existing.exists()) {
        return { id: existing.id, ...existing.data() } as JaiStarAccount
    }

    const now = new Date()
    const newAccount: Omit<JaiStarAccount, 'id'> = {
        user_id: userId,
        balance: 0,
        pending_balance: 0,
        lifetime_earned: 0,
        lifetime_spent: 0,
        tier: 'bronze',
        tier_points: 0,
        created_at: now,
        updated_at: now
    }

    await setDoc(accountRef, {
        ...newAccount,
        created_at: Timestamp.fromDate(now),
        updated_at: Timestamp.fromDate(now)
    })

    return { id: userId, ...newAccount }
}

/**
 * Get JaiStar account by user ID
 */
export async function getAccount(userId: string): Promise<JaiStarAccount | null> {
    // Guard: Check if userId is valid
    if (!userId || typeof userId !== 'string') {
        console.warn('[JaiStar] getAccount called with invalid userId:', userId)
        return null
    }

    // Guard: Check if db is available
    if (!db) {
        console.warn('[JaiStar] Firebase db is not initialized')
        return null
    }

    try {
        const accountDoc = await getDoc(doc(db, ACCOUNTS_COLLECTION, userId))
        if (!accountDoc.exists()) return null

        const data = accountDoc.data()
        return {
            id: accountDoc.id,
            ...data,
            created_at: data.created_at?.toDate?.() || new Date(),
            updated_at: data.updated_at?.toDate?.() || new Date(),
            last_activity_at: data.last_activity_at?.toDate?.(),
            last_topup_at: data.last_topup_at?.toDate?.()
        } as JaiStarAccount
    } catch (error) {
        console.error('[JaiStar] Error getting account:', error)
        return null
    }
}

/**
 * Get or create account
 */
export async function getOrCreateAccount(userId: string): Promise<JaiStarAccount> {
    const account = await getAccount(userId)
    if (account) return account
    return createAccount(userId)
}

// ==========================================
// BALANCE OPERATIONS
// ==========================================

/**
 * Get balance with tier info
 */
export async function getBalance(userId: string): Promise<BalanceResponse | null> {
    const account = await getAccount(userId)
    if (!account) return null

    const tier = getTier(account.tier_points)
    const nextTier = getNextTier(tier.id)

    return {
        balance: account.balance,
        pending: account.pending_balance,
        tier,
        tier_points: account.tier_points,
        next_tier: nextTier || undefined,
        points_to_next_tier: nextTier ? nextTier.min_points - account.tier_points : undefined
    }
}

/**
 * Check if user has enough stars
 */
export async function hasEnoughStars(userId: string, amount: number): Promise<boolean> {
    try {
        if (!userId) return false
        const account = await getAccount(userId)
        return account !== null && account.balance >= amount
    } catch (error) {
        console.error('[JaiStar] Error checking balance:', error)
        return false
    }
}

/**
 * Add stars to account (for topups, bonuses)
 */
export async function addStars(
    userId: string,
    amount: number,
    addTierPoints: boolean = true
): Promise<{ success: boolean; new_balance: number; error?: string }> {
    if (amount <= 0) {
        return { success: false, new_balance: 0, error: 'Amount must be positive' }
    }

    try {
        const accountRef = doc(db, ACCOUNTS_COLLECTION, userId)
        const accountDoc = await getDoc(accountRef)

        if (!accountDoc.exists()) {
            return { success: false, new_balance: 0, error: 'Account not found' }
        }

        const currentBalance = accountDoc.data().balance || 0
        const newBalance = currentBalance + amount

        const updates: Record<string, any> = {
            balance: increment(amount),
            lifetime_earned: increment(amount),
            last_activity_at: Timestamp.now(),
            updated_at: Timestamp.now()
        }

        // Add tier points (1 star = 1 tier point)
        if (addTierPoints) {
            updates.tier_points = increment(amount)
        }

        await updateDoc(accountRef, updates)

        // Check for tier upgrade
        await checkTierUpgrade(userId)

        return { success: true, new_balance: newBalance }
    } catch (error) {
        return {
            success: false,
            new_balance: 0,
            error: error instanceof Error ? error.message : 'Unknown error'
        }
    }
}

/**
 * Spend stars from account (for boosts, features)
 */
export async function spendStars(
    userId: string,
    amount: number
): Promise<{ success: boolean; new_balance: number; error?: string }> {
    if (amount <= 0) {
        return { success: false, new_balance: 0, error: 'Amount must be positive' }
    }

    try {
        const accountRef = doc(db, ACCOUNTS_COLLECTION, userId)
        const accountDoc = await getDoc(accountRef)

        if (!accountDoc.exists()) {
            return { success: false, new_balance: 0, error: 'Account not found' }
        }

        const currentBalance = accountDoc.data().balance || 0

        if (currentBalance < amount) {
            return {
                success: false,
                new_balance: currentBalance,
                error: `แต้มไม่พอ ต้องการ ${amount} ⭐ แต่มี ${currentBalance} ⭐`
            }
        }

        const newBalance = currentBalance - amount

        await updateDoc(accountRef, {
            balance: increment(-amount),
            lifetime_spent: increment(amount),
            last_activity_at: Timestamp.now(),
            updated_at: Timestamp.now()
        })

        return { success: true, new_balance: newBalance }
    } catch (error) {
        return {
            success: false,
            new_balance: 0,
            error: error instanceof Error ? error.message : 'Unknown error'
        }
    }
}

// ==========================================
// TIER MANAGEMENT
// ==========================================

/**
 * Check and update tier if needed
 */
export async function checkTierUpgrade(userId: string): Promise<JaiStarTier | null> {
    const account = await getAccount(userId)
    if (!account) return null

    const newTier = getTier(account.tier_points)

    if (newTier.id !== account.tier) {
        const accountRef = doc(db, ACCOUNTS_COLLECTION, userId)
        await updateDoc(accountRef, {
            tier: newTier.id,
            updated_at: Timestamp.now()
        })
        return newTier
    }

    return null
}

/**
 * Get tier discount for boost
 */
export async function getTierDiscount(userId: string): Promise<number> {
    const account = await getAccount(userId)
    if (!account) return 0

    const tier = JAISTAR_TIERS.find(t => t.id === account.tier)
    return tier?.boost_discount || 0
}

// ==========================================
// UTILITY FUNCTIONS
// ==========================================

/**
 * Format stars for display
 */
export function formatStars(amount: number): string {
    return `${amount.toLocaleString()} ⭐`
}

/**
 * Format stars with label
 */
export function formatStarsWithLabel(amount: number): string {
    return `${amount.toLocaleString()} ⭐ JaiStar`
}

/**
 * Generate UX message
 */
export function getStarMessage(action: string, amount: number): { th: string; en: string } {
    const messages: Record<string, { th: string; en: string }> = {
        boost: {
            th: `ใช้ ${amount} ⭐ JaiStar เพื่อดันโพสต์นี้`,
            en: `Use ${amount} ⭐ JaiStar to boost this post`
        },
        highlight: {
            th: `ใช้ ${amount} ⭐ JaiStar เพื่อไฮไลต์สินค้า`,
            en: `Use ${amount} ⭐ JaiStar to highlight product`
        },
        feature: {
            th: `ใช้ ${amount} ⭐ JaiStar เพื่อปลดล็อกฟีเจอร์`,
            en: `Use ${amount} ⭐ JaiStar to unlock feature`
        },
        topup: {
            th: `เติม JaiStar เพิ่มการมองเห็น`,
            en: `Top up JaiStar for more visibility`
        },
        insufficient: {
            th: `แต้มไม่พอ ต้องการ ${amount} ⭐ JaiStar`,
            en: `Not enough stars. Need ${amount} ⭐ JaiStar`
        }
    }

    return messages[action] || { th: `${amount} ⭐ JaiStar`, en: `${amount} ⭐ JaiStar` }
}
