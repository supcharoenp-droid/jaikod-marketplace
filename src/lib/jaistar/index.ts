/**
 * JaiStar System - Main Export
 * 
 * ⭐ JaiStar คือแต้ม (Point) สำหรับใช้บริการภายในแพลตฟอร์ม JaiKod เท่านั้น
 * ⭐ ใช้เพื่อโปรโมทสินค้า เพิ่มการมองเห็น และปลดล็อกฟีเจอร์บางอย่าง
 * ⭐ JaiStar ไม่ใช่เงินสด ไม่ใช่สินทรัพย์ และไม่สามารถโอนหรือแลกคืนเป็นเงินได้
 * 
 * Usage:
 *   import { JaiStar } from '@/lib/jaistar'
 *   
 *   // Check balance
 *   const balance = await JaiStar.account.getBalance(userId)
 *   
 *   // Top up
 *   await JaiStar.topup.initiate({ user_id: userId, package_id: 'pack_300', ... })
 *   
 *   // Spend stars
 *   await JaiStar.account.spendStars(userId, 50)
 */

// Re-export types
export * from './types'

// Re-export account functions
export {
    createAccount,
    getAccount,
    getOrCreateAccount,
    getBalance,
    hasEnoughStars,
    addStars,
    spendStars,
    checkTierUpgrade,
    getTierDiscount,
    formatStars,
    formatStarsWithLabel,
    getStarMessage
} from './account'

// Re-export transaction functions
export {
    createTransaction,
    completeTransaction,
    getTransaction,
    getTransactions,
    getRecentTransactions,
    getTransactionTypeName,
    isIncomingTransaction,
    formatTransactionAmount
} from './transactions'

// Re-export topup functions
export {
    getPackages,
    getPopularPackage,
    getBestValuePackage,
    calculatePackageTotal,
    initiateTopup,
    confirmTopupPayment,
    addBonusStars
} from './topup'

// Namespaced export
import * as accountModule from './account'
import * as transactionsModule from './transactions'
import * as topupModule from './topup'
import { JAISTAR_PACKAGES, JAISTAR_TIERS, getTier, getNextTier } from './types'

export const JaiStar = {
    // Account operations
    account: {
        create: accountModule.createAccount,
        get: accountModule.getAccount,
        getOrCreate: accountModule.getOrCreateAccount,
        getBalance: accountModule.getBalance,
        hasEnough: accountModule.hasEnoughStars,
        addStars: accountModule.addStars,
        spendStars: accountModule.spendStars,
        getTierDiscount: accountModule.getTierDiscount,
        formatStars: accountModule.formatStars,
        formatWithLabel: accountModule.formatStarsWithLabel,
        getMessage: accountModule.getStarMessage
    },

    // Transaction operations
    transactions: {
        create: transactionsModule.createTransaction,
        complete: transactionsModule.completeTransaction,
        get: transactionsModule.getTransaction,
        list: transactionsModule.getTransactions,
        getRecent: transactionsModule.getRecentTransactions,
        getTypeName: transactionsModule.getTransactionTypeName,
        isIncoming: transactionsModule.isIncomingTransaction,
        formatAmount: transactionsModule.formatTransactionAmount
    },

    // Topup operations
    topup: {
        getPackages: topupModule.getPackages,
        getPopular: topupModule.getPopularPackage,
        getBestValue: topupModule.getBestValuePackage,
        calculateTotal: topupModule.calculatePackageTotal,
        initiate: topupModule.initiateTopup,
        confirm: topupModule.confirmTopupPayment,
        addBonus: topupModule.addBonusStars
    },

    // Tier operations
    tiers: {
        all: JAISTAR_TIERS,
        get: getTier,
        getNext: getNextTier
    },

    // Packages
    packages: JAISTAR_PACKAGES
}

export default JaiStar
