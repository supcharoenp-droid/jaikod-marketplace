/**
 * ============================================
 * Escrow Service (Placeholder)
 * ============================================
 * 
 * Ready for Phase 2 - Marketplace Mode
 * Enable by setting FEATURE_FLAGS.ESCROW_ENABLED = true
 * 
 * Escrow Flow:
 * 1. Buyer pays → Money held in escrow
 * 2. Seller ships → Update tracking
 * 3. Buyer confirms receipt → Money released to seller
 * 4. Dispute → Admin review
 */

import { FEATURE_FLAGS, PLATFORM_CONFIG } from '@/config/platform'

// ============================================
// TYPES
// ============================================

export type EscrowStatus =
    | 'pending'         // รอการชำระเงิน
    | 'funded'          // เก็บเงินแล้ว
    | 'shipping'        // กำลังจัดส่ง
    | 'delivered'       // ส่งถึงแล้ว รอยืนยัน
    | 'released'        // ปล่อยเงินให้ผู้ขาย
    | 'disputed'        // มีข้อพิพาท
    | 'refunded'        // คืนเงินผู้ซื้อ
    | 'cancelled'       // ยกเลิก

export interface EscrowTransaction {
    id: string
    orderId: string
    paymentIntentId: string

    // Participants
    buyerId: string
    sellerId: string

    // Amount
    amount: number
    platformFee: number
    sellerPayout: number

    // Status
    status: EscrowStatus

    // Timestamps
    createdAt: Date
    fundedAt?: Date
    shippedAt?: Date
    deliveredAt?: Date
    releasedAt?: Date
    refundedAt?: Date

    // Auto-release
    autoReleaseAt?: Date

    // Dispute
    disputeId?: string
    disputeReason?: string
}

export interface EscrowRelease {
    transactionId: string
    releaseType: 'auto' | 'buyer_confirm' | 'admin_override'
    releasedAt: Date
}

export interface EscrowDispute {
    id: string
    escrowId: string
    raisedBy: 'buyer' | 'seller'
    reason: string
    evidence: string[]
    status: 'open' | 'reviewing' | 'resolved'
    resolution?: 'refund_buyer' | 'release_seller' | 'partial_refund'
    resolutionNote?: string
    createdAt: Date
    resolvedAt?: Date
}

// ============================================
// ESCROW SERVICE
// ============================================

class EscrowService {
    private isEnabled: boolean
    private holdDays: number

    constructor() {
        this.isEnabled = FEATURE_FLAGS.ESCROW_ENABLED
        this.holdDays = PLATFORM_CONFIG.payment.escrowHoldDays
    }

    /**
     * Check if escrow is available
     */
    isAvailable(): boolean {
        return this.isEnabled
    }

    /**
     * Create escrow transaction
     */
    async createEscrow(
        orderId: string,
        paymentIntentId: string,
        buyerId: string,
        sellerId: string,
        amount: number
    ): Promise<EscrowTransaction | null> {
        if (!this.isEnabled) {
            console.log('🔒 Escrow is disabled in Classified mode')
            return null
        }

        const platformFee = this.calculatePlatformFee(amount)
        const sellerPayout = amount - platformFee

        const escrow: EscrowTransaction = {
            id: `esc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            orderId,
            paymentIntentId,
            buyerId,
            sellerId,
            amount,
            platformFee,
            sellerPayout,
            status: 'pending',
            createdAt: new Date()
        }

        console.log('🔒 Escrow created:', escrow.id)

        // TODO: Save to database
        return escrow
    }

    /**
     * Fund escrow (when payment is confirmed)
     */
    async fundEscrow(escrowId: string): Promise<boolean> {
        if (!this.isEnabled) return false

        // TODO: Update escrow status and set auto-release timer
        console.log('🔒 Escrow funded:', escrowId)

        return true
    }

    /**
     * Mark as shipped
     */
    async markShipped(escrowId: string, trackingNumber: string): Promise<boolean> {
        if (!this.isEnabled) return false

        // TODO: Update status and start delivery countdown
        console.log('🔒 Escrow marked shipped:', escrowId, trackingNumber)

        return true
    }

    /**
     * Mark as delivered
     */
    async markDelivered(escrowId: string): Promise<boolean> {
        if (!this.isEnabled) return false

        // Calculate auto-release date
        const autoReleaseAt = new Date()
        autoReleaseAt.setDate(autoReleaseAt.getDate() + this.holdDays)

        // TODO: Update status and set auto-release
        console.log('🔒 Escrow marked delivered:', escrowId)
        console.log('🔒 Auto-release scheduled:', autoReleaseAt)

        return true
    }

    /**
     * Release to seller (buyer confirms or auto-release)
     */
    async releaseToSeller(escrowId: string, releaseType: 'auto' | 'buyer_confirm' | 'admin_override'): Promise<boolean> {
        if (!this.isEnabled) return false

        // TODO: 
        // 1. Update escrow status
        // 2. Transfer money to seller wallet/bank
        // 3. Record platform fee
        console.log('🔒 Escrow released to seller:', escrowId, releaseType)

        return true
    }

    /**
     * Refund to buyer
     */
    async refundToBuyer(escrowId: string, reason: string, refundAmount?: number): Promise<boolean> {
        if (!this.isEnabled) return false

        // TODO:
        // 1. Calculate refund amount (full or partial)
        // 2. Process refund to buyer
        // 3. Update escrow status
        console.log('🔒 Escrow refunded to buyer:', escrowId, reason)

        return true
    }

    /**
     * Open dispute
     */
    async openDispute(
        escrowId: string,
        raisedBy: 'buyer' | 'seller',
        reason: string,
        evidence: string[]
    ): Promise<EscrowDispute | null> {
        if (!this.isEnabled) return null

        const dispute: EscrowDispute = {
            id: `disp_${Date.now()}`,
            escrowId,
            raisedBy,
            reason,
            evidence,
            status: 'open',
            createdAt: new Date()
        }

        // TODO: Save dispute and notify admin
        console.log('🔒 Dispute opened:', dispute.id)

        return dispute
    }

    /**
     * Resolve dispute (admin only)
     */
    async resolveDispute(
        disputeId: string,
        resolution: 'refund_buyer' | 'release_seller' | 'partial_refund',
        note: string,
        partialAmount?: number
    ): Promise<boolean> {
        if (!this.isEnabled) return false

        // TODO: Apply resolution
        console.log('🔒 Dispute resolved:', disputeId, resolution)

        return true
    }

    /**
     * Get escrow status message
     */
    getStatusMessage(status: EscrowStatus, lang: 'th' | 'en' = 'th'): string {
        const messages = {
            pending: { th: 'รอการชำระเงิน', en: 'Pending payment' },
            funded: { th: 'เก็บเงินแล้ว รอผู้ขายจัดส่ง', en: 'Funded, awaiting shipment' },
            shipping: { th: 'กำลังจัดส่ง', en: 'Shipping' },
            delivered: { th: 'ส่งถึงแล้ว รอยืนยัน', en: 'Delivered, awaiting confirmation' },
            released: { th: 'ปล่อยเงินให้ผู้ขายแล้ว', en: 'Released to seller' },
            disputed: { th: 'มีข้อพิพาท กำลังตรวจสอบ', en: 'Disputed, under review' },
            refunded: { th: 'คืนเงินแล้ว', en: 'Refunded' },
            cancelled: { th: 'ยกเลิกแล้ว', en: 'Cancelled' }
        }
        return messages[status][lang]
    }

    /**
     * Calculate platform fee
     */
    private calculatePlatformFee(amount: number): number {
        const feePercent = PLATFORM_CONFIG.payment.platformFeePercent
        return Math.round(amount * (feePercent / 100))
    }

    /**
     * Process auto-releases (called by cron job)
     */
    async processAutoReleases(): Promise<number> {
        if (!this.isEnabled) return 0

        // TODO: Find escrows past auto-release date and release them
        console.log('🔒 Processing auto-releases...')

        return 0
    }
}

// ============================================
// EXPORT SINGLETON
// ============================================

export const escrowService = new EscrowService()
export default escrowService
