/**
 * CLASSIFICATION CACHE SYSTEM
 * 
 * Cache classification results to improve performance
 * - Cache by title hash
 * - TTL: 24 hours
 * - Auto-invalidate on keyword updates
 */

interface CachedClassification {
    categoryId: number
    subcategoryId?: number
    confidence: number
    timestamp: number
    ttl: number
}

class ClassificationCache {
    private cache = new Map<string, CachedClassification>()
    private readonly DEFAULT_TTL = 24 * 60 * 60 * 1000 // 24 hours

    /**
     * Generate cache key from product title
     */
    private generateKey(title: string): string {
        // Simple hash function
        return title.toLowerCase().trim().replace(/\s+/g, '-')
    }

    /**
     * Get cached result
     */
    get(title: string): CachedClassification | null {
        const key = this.generateKey(title)
        const cached = this.cache.get(key)

        if (!cached) return null

        // Check if expired
        const now = Date.now()
        if (now - cached.timestamp > cached.ttl) {
            this.cache.delete(key)
            return null
        }

        return cached
    }

    /**
     * Set cache
     */
    set(title: string, result: Omit<CachedClassification, 'timestamp' | 'ttl'>): void {
        const key = this.generateKey(title)

        this.cache.set(key, {
            ...result,
            timestamp: Date.now(),
            ttl: this.DEFAULT_TTL
        })
    }

    /**
     * Clear cache (call when keywords updated)
     */
    clear(): void {
        this.cache.clear()
    }

    /**
     * Get cache stats
     */
    getStats() {
        return {
            size: this.cache.size,
            entries: Array.from(this.cache.entries()).map(([key, value]) => ({
                key,
                categoryId: value.categoryId,
                age: Date.now() - value.timestamp
            }))
        }
    }
}

// Singleton instance
export const classificationCache = new ClassificationCache()

/**
 * Cached classification function
 */
export async function classifyWithCache(
    title: string,
    description: string,
    options?: { bypassCache?: boolean }
) {
    // Check cache first
    if (!options?.bypassCache) {
        const cached = classificationCache.get(title)
        if (cached) {
            console.log('✅ Cache hit:', title.substring(0, 50))
            return {
                ...cached,
                source: 'cache'
            }
        }
    }

    // If not cached, classify
    const { decideCategoryWithAI } = await import('./category-decision-ai')

    const result = decideCategoryWithAI({
        title,
        description,
        detectedObjects: [],
        imageAnalysis: ''
    })

    const topResult = result.auto_selected || result.recommended_categories[0]

    if (topResult) {
        // Cache the result
        classificationCache.set(title, {
            categoryId: Number(topResult.categoryId),
            subcategoryId: topResult.subcategoryId ? Number(topResult.subcategoryId) : undefined,
            confidence: topResult.confidence
        })
    }

    return {
        ...topResult,
        source: 'fresh'
    }
}

/**
 * Performance monitoring
 */
export class PerformanceMonitor {
    private metrics: {
        cacheHits: number
        cacheMisses: number
        avgClassificationTime: number
        totalClassifications: number
    } = {
            cacheHits: 0,
            cacheMisses: 0,
            avgClassificationTime: 0,
            totalClassifications: 0
        }

    recordCacheHit() {
        this.metrics.cacheHits++
    }

    recordCacheMiss() {
        this.metrics.cacheMisses++
    }

    recordClassificationTime(ms: number) {
        const total = this.metrics.totalClassifications
        this.metrics.avgClassificationTime =
            (this.metrics.avgClassificationTime * total + ms) / (total + 1)
        this.metrics.totalClassifications++
    }

    getStats() {
        const total = this.metrics.cacheHits + this.metrics.cacheMisses
        return {
            ...this.metrics,
            cacheHitRate: total > 0 ? (this.metrics.cacheHits / total) * 100 : 0
        }
    }

    reset() {
        this.metrics = {
            cacheHits: 0,
            cacheMisses: 0,
            avgClassificationTime: 0,
            totalClassifications: 0
        }
    }
}

export const performanceMonitor = new PerformanceMonitor()
