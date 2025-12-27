/**
 * JaiStar Top-up Service
 * 
 * เติมแต้ม JaiStar
 */

import { JAISTAR_PACKAGES, getPackage, TopupRequest, TopupResult } from './types'
import { getOrCreateAccount, addStars } from './account'
import { createTransaction, completeTransaction } from './transactions'

// ==========================================
// PACKAGE UTILITIES
// ==========================================

/**
 * Get all packages
 */
export function getPackages() {
    return JAISTAR_PACKAGES
}

/**
 * Get popular package
 */
export function getPopularPackage() {
    return JAISTAR_PACKAGES.find(p => p.popular)
}

/**
 * Get best value package
 */
export function getBestValuePackage() {
    return JAISTAR_PACKAGES.find(p => p.best_value)
}

/**
 * Calculate total stars from package
 */
export function calculatePackageTotal(packageId: string): {
    stars: number
    bonus: number
    total: number
    price: number
    bonus_percent: number
} | null {
    const pkg = getPackage(packageId)
    if (!pkg) return null

    return {
        stars: pkg.stars,
        bonus: pkg.bonus_stars,
        total: pkg.stars + pkg.bonus_stars,
        price: pkg.price_thb,
        bonus_percent: Math.round((pkg.bonus_stars / pkg.stars) * 100)
    }
}

// ==========================================
// TOPUP OPERATIONS
// ==========================================

/**
 * Initiate a top-up
 */
export async function initiateTopup(request: TopupRequest): Promise<TopupResult> {
    try {
        const pkg = getPackage(request.package_id)
        if (!pkg) {
            return { success: false, error: { code: 'INVALID_PACKAGE', message: 'แพ็คเกจไม่ถูกต้อง' } }
        }

        // Ensure account exists
        const account = await getOrCreateAccount(request.user_id)

        const totalStars = pkg.stars + pkg.bonus_stars

        // Create pending transaction
        const transaction = await createTransaction(
            account.id,
            'topup',
            totalStars,
            {
                title: `เติมแต้ม ${pkg.stars.toLocaleString()} ⭐`,
                title_en: `Top Up ${pkg.stars.toLocaleString()} ⭐`,
                description: pkg.bonus_stars > 0 ? `รับโบนัส +${pkg.bonus_stars} ⭐` : undefined,
                reference_type: 'topup',
                payment_method: request.payment_method,
                price_thb: pkg.price_thb
            }
        )

        // Generate payment URL/QR
        let paymentUrl: string | undefined
        let qrCode: string | undefined

        switch (request.payment_method) {
            case 'promptpay':
                qrCode = `https://promptpay.io/mock/${transaction.id}/${pkg.price_thb}`
                break
            case 'truemoney':
                paymentUrl = `/payment/truemoney?txn=${transaction.id}&amount=${pkg.price_thb}`
                break
            default:
                paymentUrl = `/payment/card?txn=${transaction.id}&amount=${pkg.price_thb}`
        }

        return {
            success: true,
            transaction_id: transaction.id,
            stars_added: pkg.stars,
            bonus_added: pkg.bonus_stars,
            payment_url: paymentUrl,
            qr_code: qrCode
        }
    } catch (error) {
        return {
            success: false,
            error: {
                code: 'TOPUP_FAILED',
                message: error instanceof Error ? error.message : 'ไม่สามารถเติมแต้มได้'
            }
        }
    }
}

/**
 * Confirm top-up payment (called by webhook)
 */
export async function confirmTopupPayment(
    transactionId: string,
    paymentRef: string
): Promise<TopupResult> {
    try {
        const result = await completeTransaction(transactionId)

        if (!result.success) {
            return {
                success: false,
                error: { code: 'CONFIRM_FAILED', message: result.error || 'การยืนยันล้มเหลว' }
            }
        }

        return { success: true, transaction_id: transactionId }
    } catch (error) {
        return {
            success: false,
            error: {
                code: 'CONFIRM_ERROR',
                message: error instanceof Error ? error.message : 'ไม่สามารถยืนยันการชำระเงินได้'
            }
        }
    }
}

/**
 * Add bonus stars (promotional)
 */
export async function addBonusStars(
    userId: string,
    amount: number,
    type: 'promotion_bonus' | 'referral_bonus' | 'welcome_bonus' | 'daily_checkin' | 'achievement',
    description: string
): Promise<TopupResult> {
    try {
        const account = await getOrCreateAccount(userId)

        const transaction = await createTransaction(
            account.id,
            type,
            amount,
            {
                title: getTypeTitleTH(type, amount),
                title_en: getTypeTitleEN(type, amount),
                description,
                reference_type: 'promo'
            }
        )

        const result = await completeTransaction(transaction.id)

        if (!result.success) {
            return {
                success: false,
                error: { code: 'BONUS_FAILED', message: result.error || 'ไม่สามารถเพิ่มโบนัสได้' }
            }
        }

        return {
            success: true,
            transaction_id: transaction.id,
            stars_added: amount,
            bonus_added: 0
        }
    } catch (error) {
        return {
            success: false,
            error: {
                code: 'BONUS_ERROR',
                message: error instanceof Error ? error.message : 'เกิดข้อผิดพลาด'
            }
        }
    }
}

// Helper functions
function getTypeTitleTH(type: string, amount: number): string {
    const titles: Record<string, string> = {
        promotion_bonus: `โบนัสโปรโมชั่น +${amount} ⭐`,
        referral_bonus: `โบนัสแนะนำเพื่อน +${amount} ⭐`,
        welcome_bonus: `โบนัสสมาชิกใหม่ +${amount} ⭐`,
        daily_checkin: `เช็คอินรายวัน +${amount} ⭐`,
        achievement: `รางวัลความสำเร็จ +${amount} ⭐`
    }
    return titles[type] || `+${amount} ⭐`
}

function getTypeTitleEN(type: string, amount: number): string {
    const titles: Record<string, string> = {
        promotion_bonus: `Promotion Bonus +${amount} ⭐`,
        referral_bonus: `Referral Bonus +${amount} ⭐`,
        welcome_bonus: `Welcome Bonus +${amount} ⭐`,
        daily_checkin: `Daily Check-in +${amount} ⭐`,
        achievement: `Achievement Reward +${amount} ⭐`
    }
    return titles[type] || `+${amount} ⭐`
}
