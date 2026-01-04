/**
 * ============================================
 * Payment Service (Placeholder)
 * ============================================
 * 
 * Ready for Phase 2 - Marketplace Mode
 * Enable by setting FEATURE_FLAGS.PAYMENT_ENABLED = true
 * 
 * Supported Providers:
 * - PromptPay (Thai QR Payment)
 * - Credit/Debit Card (via Omise/2C2P)
 * - True Money Wallet
 */

import { FEATURE_FLAGS, PLATFORM_CONFIG } from '@/config/platform'

// ============================================
// TYPES
// ============================================

export type PaymentProvider = 'promptpay' | 'credit_card' | 'true_wallet' | 'bank_transfer'
export type PaymentStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'refunded' | 'cancelled'

export interface PaymentIntent {
    id: string
    orderId: string
    amount: number
    currency: string
    provider: PaymentProvider
    status: PaymentStatus
    metadata?: Record<string, any>
    createdAt: Date
    updatedAt: Date
    expiresAt?: Date
}

export interface PaymentResult {
    success: boolean
    paymentId?: string
    transactionId?: string
    error?: string
    redirectUrl?: string
    qrCode?: string // for PromptPay
}

export interface RefundRequest {
    paymentId: string
    amount?: number // partial refund
    reason: string
}

// ============================================
// PAYMENT SERVICE
// ============================================

class PaymentService {
    private isEnabled: boolean

    constructor() {
        this.isEnabled = FEATURE_FLAGS.PAYMENT_ENABLED
    }

    /**
     * Check if payment is available
     */
    isAvailable(): boolean {
        return this.isEnabled
    }

    /**
     * Create a payment intent
     */
    async createPaymentIntent(
        orderId: string,
        amount: number,
        provider: PaymentProvider
    ): Promise<PaymentIntent | null> {
        if (!this.isEnabled) {
            console.log('💳 Payment is disabled in Classified mode')
            return null
        }

        // TODO: Implement actual payment gateway integration
        // This is a placeholder structure

        const paymentIntent: PaymentIntent = {
            id: `pay_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            orderId,
            amount,
            currency: PLATFORM_CONFIG.payment.currency,
            provider,
            status: 'pending',
            createdAt: new Date(),
            updatedAt: new Date(),
            expiresAt: new Date(Date.now() + 30 * 60 * 1000), // 30 minutes
        }

        console.log('💳 Payment intent created:', paymentIntent)
        return paymentIntent
    }

    /**
     * Process payment (initiate with provider)
     */
    async processPayment(paymentIntentId: string): Promise<PaymentResult> {
        if (!this.isEnabled) {
            return { success: false, error: 'Payment is not enabled' }
        }

        // TODO: Integrate with actual payment providers
        // - Omise for credit cards
        // - PromptPay API
        // - True Money Wallet API

        console.log('💳 Processing payment:', paymentIntentId)

        return {
            success: false,
            error: 'Payment integration not yet implemented. Coming in Phase 2!'
        }
    }

    /**
     * Generate PromptPay QR Code
     */
    async generatePromptPayQR(amount: number, reference: string): Promise<string | null> {
        if (!this.isEnabled) {
            return null
        }

        // TODO: Generate actual PromptPay QR code
        // Using PromptPay API or library like 'promptpay-qr'

        console.log('💳 Generating PromptPay QR for:', amount, reference)
        return null
    }

    /**
     * Verify payment status
     */
    async verifyPayment(paymentIntentId: string): Promise<PaymentStatus> {
        if (!this.isEnabled) {
            return 'cancelled'
        }

        // TODO: Check payment status with provider
        console.log('💳 Verifying payment:', paymentIntentId)
        return 'pending'
    }

    /**
     * Process refund
     */
    async refund(request: RefundRequest): Promise<PaymentResult> {
        if (!this.isEnabled) {
            return { success: false, error: 'Payment is not enabled' }
        }

        // TODO: Process refund with provider
        console.log('💳 Processing refund:', request)

        return {
            success: false,
            error: 'Refund integration not yet implemented'
        }
    }

    /**
     * Calculate platform fee
     */
    calculatePlatformFee(amount: number): number {
        const feePercent = PLATFORM_CONFIG.payment.platformFeePercent
        return Math.round(amount * (feePercent / 100))
    }

    /**
     * Calculate seller payout
     */
    calculateSellerPayout(amount: number): number {
        const fee = this.calculatePlatformFee(amount)
        return amount - fee
    }
}

// ============================================
// EXPORT SINGLETON
// ============================================

export const paymentService = new PaymentService()
export default paymentService
