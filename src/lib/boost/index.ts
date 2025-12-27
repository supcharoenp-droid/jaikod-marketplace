/**
 * Boost System - Main Export
 * 
 * Complete boost system for JaiKod marketplace
 * Usage:
 *   import { Boost } from '@/lib/boost'
 *   await Boost.create({ ... })
 *   const packages = Boost.packages.getAll()
 */

// Re-export types
export * from './types'

// Re-export packages
export {
    BOOST_PACKAGES,
    getActivePackages,
    getPackageById,
    getPackagesByType,
    getPackagesForSeller,
    getCheapestPackage,
    getMostPopularPackage,
    getBestValuePackage,
    calculateBoostPrice,
    formatBoostDuration,
    getPackageComparison
} from './packages'

// Re-export service functions
export {
    createBoost,
    getBoost,
    getActiveBoostForListing,
    getSellerBoosts,
    getActiveBoosts,
    cancelBoost,
    pauseBoost,
    resumeBoost,
    expireBoosts,
    updateBoostStats,
    recordBoostView,
    recordBoostInquiry,
    isListingBoosted,
    getBoostBadgeInfo,
    getBoostTimeRemaining
} from './boostService'

// Namespaced export
import * as packagesModule from './packages'
import * as serviceModule from './boostService'

export const Boost = {
    // Package operations
    packages: {
        getAll: packagesModule.getActivePackages,
        getById: packagesModule.getPackageById,
        getByType: packagesModule.getPackagesByType,
        getForSeller: packagesModule.getPackagesForSeller,
        getCheapest: packagesModule.getCheapestPackage,
        getMostPopular: packagesModule.getMostPopularPackage,
        getBestValue: packagesModule.getBestValuePackage,
        calculatePrice: packagesModule.calculateBoostPrice,
        formatDuration: packagesModule.formatBoostDuration,
        compare: packagesModule.getPackageComparison
    },

    // Boost operations
    create: serviceModule.createBoost,
    get: serviceModule.getBoost,
    getForListing: serviceModule.getActiveBoostForListing,
    getForSeller: serviceModule.getSellerBoosts,
    getActive: serviceModule.getActiveBoosts,

    // Management
    cancel: serviceModule.cancelBoost,
    pause: serviceModule.pauseBoost,
    resume: serviceModule.resumeBoost,
    expireAll: serviceModule.expireBoosts,

    // Stats
    updateStats: serviceModule.updateBoostStats,
    recordView: serviceModule.recordBoostView,
    recordInquiry: serviceModule.recordBoostInquiry,

    // Utilities
    isListingBoosted: serviceModule.isListingBoosted,
    getBadgeInfo: serviceModule.getBoostBadgeInfo,
    getTimeRemaining: serviceModule.getBoostTimeRemaining
}

export default Boost
