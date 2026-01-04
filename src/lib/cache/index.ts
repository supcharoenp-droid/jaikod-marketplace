/**
 * CACHE MODULE INDEX
 * 
 * Central exports สำหรับ caching utilities
 */

// Core cache service
export {
    apiCache,
    withCache,
    cacheKey,
    invalidateCache,
    clearCache,
    getCacheStats,
    CACHE_KEYS,
    CACHE_TTL
} from './api-cache'

// Cached data services
export {
    // Categories
    getCategoriesCached,
    getCategoryByIdCached,

    // Listings
    getNewArrivalsCached,
    getFeaturedListingsCached,
    getListingByIdCached,
    invalidateListingCache,

    // Users
    getUserProfileCached,
    invalidateUserCache,

    // Search
    getPopularSearchesCached,

    // Location
    getProvincesCached
} from './cached-services'
