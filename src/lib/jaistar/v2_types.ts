/**
 * JAISTAR ALPHA V2 - UNIFIED TYPES
 */

export type JaiStarTierV2 = 'bronze' | 'silver' | 'gold' | 'platinum' | 'legendary'

export type JaiStarTransactionTypeV2 =
    | 'topup'           // User buys stars
    | 'listing_boost'   // Spend on ads
    | 'listing_highlight' // Extra visual feature
    | 'bonus_gift'      // System rewards
    | 'refund'          // Returned stars
    | 'adjustment'      // Manual admin fix
    | 'subscription'    // Monthly pro plan

export interface JaiStarRegistryV2 {
    userId: string
    balance: number
    tier: JaiStarTierV2
    tier_points: number
    lifetime_spent: number
    lifetime_earned: number
    last_transaction_id: string
    updated_at: any
    created_at: any
    status: 'active' | 'suspended' | 'locked'
}

export interface JaiStarLedgerEntryV2 {
    id: string
    userId: string
    type: JaiStarTransactionTypeV2
    amount: number          // Negative for spend, positive for earn
    balance_after: number
    reference_id?: string   // Order ID, Campaign ID, etc.
    description: string
    metadata?: Record<string, any>
    status: 'pending' | 'completed' | 'failed' | 'reversed'
    created_at: any
}

export const JAISTAR_TIER_CONFIG_V2: Record<JaiStarTierV2, {
    min_points: number,
    discount: number,
    multiplier: number
}> = {
    bronze: { min_points: 0, discount: 0, multiplier: 1.0 },
    silver: { min_points: 1000, discount: 5, multiplier: 1.1 },
    gold: { min_points: 5000, discount: 10, multiplier: 1.25 },
    platinum: { min_points: 20000, discount: 15, multiplier: 1.5 },
    legendary: { min_points: 100000, discount: 25, multiplier: 2.0 }
}
