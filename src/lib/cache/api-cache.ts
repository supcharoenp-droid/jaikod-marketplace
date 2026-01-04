/**
 * API CACHE SERVICE
 * 
 * Simple in-memory cache สำหรับ API responses
 * ลด Firestore reads และ improve performance
 * 
 * Features:
 * - TTL-based expiration
 * - Max size limit
 * - LRU eviction
 * - Cache key generation
 * 
 * Usage:
 *   const data = await apiCache.getOrFetch('categories', fetchCategories, 5 * 60 * 1000)
 * 
 * @version 1.0.0
 * @date 2024-12-29
 */

// ==========================================
// TYPES
// ==========================================

interface CacheEntry<T> {
    data: T
    expiry: number
    accessedAt: number
    size: number
}

interface CacheStats {
    hits: number
    misses: number
    size: number
    entries: number
    hitRate: number
}

interface CacheConfig {
    maxSize: number        // Max cache size in bytes (approx)
    maxEntries: number     // Max number of entries
    defaultTTL: number     // Default TTL in ms
    cleanupInterval: number // Cleanup interval in ms
}

// ==========================================
// CACHE SERVICE
// ==========================================

class APICacheService {
    private static instance: APICacheService
    private cache: Map<string, CacheEntry<any>> = new Map()
    private stats = { hits: 0, misses: 0 }
    private cleanupTimer: NodeJS.Timeout | null = null

    private config: CacheConfig = {
        maxSize: 10 * 1024 * 1024,    // 10 MB
        maxEntries: 1000,
        defaultTTL: 5 * 60 * 1000,    // 5 minutes
        cleanupInterval: 60 * 1000    // 1 minute
    }

    private constructor() {
        this.startCleanupTimer()
    }

    public static getInstance(): APICacheService {
        if (!APICacheService.instance) {
            APICacheService.instance = new APICacheService()
        }
        return APICacheService.instance
    }

    // ========================================
    // CONFIGURATION
    // ========================================

    configure(options: Partial<CacheConfig>) {
        this.config = { ...this.config, ...options }
    }

    // ========================================
    // CORE METHODS
    // ========================================

    /**
     * Get from cache or fetch
     */
    async getOrFetch<T>(
        key: string,
        fetcher: () => Promise<T>,
        ttl?: number
    ): Promise<T> {
        const cached = this.get<T>(key)
        if (cached !== null) {
            return cached
        }

        // Fetch and cache
        const data = await fetcher()
        this.set(key, data, ttl)
        return data
    }

    /**
     * Get from cache
     */
    get<T>(key: string): T | null {
        const entry = this.cache.get(key)

        if (!entry) {
            this.stats.misses++
            return null
        }

        // Check expiry
        if (Date.now() > entry.expiry) {
            this.cache.delete(key)
            this.stats.misses++
            return null
        }

        // Update access time for LRU
        entry.accessedAt = Date.now()
        this.stats.hits++

        return entry.data as T
    }

    /**
     * Set cache entry
     */
    set<T>(key: string, data: T, ttl?: number): void {
        const actualTTL = ttl ?? this.config.defaultTTL
        const size = this.estimateSize(data)

        // Evict if necessary
        this.evictIfNeeded(size)

        this.cache.set(key, {
            data,
            expiry: Date.now() + actualTTL,
            accessedAt: Date.now(),
            size
        })
    }

    /**
     * Delete cache entry
     */
    delete(key: string): boolean {
        return this.cache.delete(key)
    }

    /**
     * Delete entries matching pattern
     */
    deletePattern(pattern: string | RegExp): number {
        const regex = typeof pattern === 'string' ? new RegExp(pattern) : pattern
        let deleted = 0

        for (const key of this.cache.keys()) {
            if (regex.test(key)) {
                this.cache.delete(key)
                deleted++
            }
        }

        return deleted
    }

    /**
     * Clear all cache
     */
    clear(): void {
        this.cache.clear()
        this.stats.hits = 0
        this.stats.misses = 0
    }

    // ========================================
    // CACHE KEYS
    // ========================================

    /**
     * Generate cache key from function args
     */
    static key(prefix: string, ...args: any[]): string {
        const argsKey = args.map(arg =>
            typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
        ).join(':')

        return `${prefix}:${argsKey}`
    }

    // ========================================
    // STATS
    // ========================================

    /**
     * Get cache statistics
     */
    getStats(): CacheStats {
        let totalSize = 0
        for (const entry of this.cache.values()) {
            totalSize += entry.size
        }

        const total = this.stats.hits + this.stats.misses

        return {
            hits: this.stats.hits,
            misses: this.stats.misses,
            size: totalSize,
            entries: this.cache.size,
            hitRate: total > 0 ? Math.round((this.stats.hits / total) * 100) : 0
        }
    }

    // ========================================
    // PRIVATE METHODS
    // ========================================

    private estimateSize(data: any): number {
        try {
            return JSON.stringify(data).length * 2 // Rough estimate (UTF-16)
        } catch {
            return 1000 // Default size if can't stringify
        }
    }

    private evictIfNeeded(newSize: number): void {
        // Check entry count
        while (this.cache.size >= this.config.maxEntries) {
            this.evictLRU()
        }

        // Check size
        let totalSize = 0
        for (const entry of this.cache.values()) {
            totalSize += entry.size
        }

        while (totalSize + newSize > this.config.maxSize && this.cache.size > 0) {
            const evicted = this.evictLRU()
            if (evicted) {
                totalSize -= evicted.size
            } else {
                break
            }
        }
    }

    private evictLRU(): CacheEntry<any> | null {
        let oldest: { key: string; entry: CacheEntry<any> } | null = null

        for (const [key, entry] of this.cache.entries()) {
            if (!oldest || entry.accessedAt < oldest.entry.accessedAt) {
                oldest = { key, entry }
            }
        }

        if (oldest) {
            this.cache.delete(oldest.key)
            return oldest.entry
        }

        return null
    }

    private startCleanupTimer(): void {
        if (typeof window === 'undefined') return

        this.cleanupTimer = setInterval(() => {
            this.cleanup()
        }, this.config.cleanupInterval)
    }

    private cleanup(): void {
        const now = Date.now()

        for (const [key, entry] of this.cache.entries()) {
            if (now > entry.expiry) {
                this.cache.delete(key)
            }
        }
    }

    /**
     * Stop cleanup timer (for testing)
     */
    destroy(): void {
        if (this.cleanupTimer) {
            clearInterval(this.cleanupTimer)
        }
    }
}

// ==========================================
// SINGLETON EXPORT
// ==========================================

export const apiCache = APICacheService.getInstance()

// ==========================================
// CONVENIENCE FUNCTIONS
// ==========================================

/**
 * Cache wrapper for async functions
 */
export function withCache<T>(
    key: string,
    fetcher: () => Promise<T>,
    ttl?: number
): Promise<T> {
    return apiCache.getOrFetch(key, fetcher, ttl)
}

/**
 * Generate cache key
 */
export const cacheKey = APICacheService.key

/**
 * Invalidate cache by pattern
 */
export function invalidateCache(pattern: string | RegExp): number {
    return apiCache.deletePattern(pattern)
}

/**
 * Clear all cache
 */
export function clearCache(): void {
    apiCache.clear()
}

/**
 * Get cache stats
 */
export function getCacheStats(): CacheStats {
    return apiCache.getStats()
}

// ==========================================
// PREDEFINED CACHE KEYS
// ==========================================

export const CACHE_KEYS = {
    CATEGORIES: 'categories:all',
    CATEGORY: (id: number) => `category:${id}`,
    POPULAR_SEARCHES: 'search:popular',
    USER: (id: string) => `user:${id}`,
    LISTING: (id: string) => `listing:${id}`,
    NEW_ARRIVALS: 'listings:new_arrivals',
    FEATURED: 'listings:featured',
    PROVINCES: 'location:provinces'
}

// ==========================================
// CACHE TTLS (in milliseconds)
// ==========================================

export const CACHE_TTL = {
    SHORT: 1 * 60 * 1000,          // 1 minute
    MEDIUM: 5 * 60 * 1000,         // 5 minutes
    LONG: 30 * 60 * 1000,          // 30 minutes
    VERY_LONG: 60 * 60 * 1000,     // 1 hour

    CATEGORIES: 60 * 60 * 1000,    // 1 hour (rarely changes)
    USER: 5 * 60 * 1000,           // 5 minutes
    LISTING: 2 * 60 * 1000,        // 2 minutes
    SEARCH: 5 * 60 * 1000,         // 5 minutes
    NEW_ARRIVALS: 1 * 60 * 1000    // 1 minute (updates frequently)
}
