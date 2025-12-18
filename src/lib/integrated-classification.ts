/**
 * INTEGRATED CLASSIFICATION SYSTEM
 * 
 * Combines the Advanced Engine with the existing system
 * - Gradual rollout capability (percentage-based)
 * - Fallback to old system if confidence is low
 * - Logging and monitoring
 * - A/B testing support
 */

import { AdvancedClassificationEngine, ClassificationResult } from './advanced-classification-engine'
import { decideCategoryWithAI, CategoryDecisionResult } from './category-decision-ai'
import { detectSubcategory } from './subcategory-intelligence'

// ========================================
// CONFIGURATION
// ========================================
const FEATURE_FLAGS = {
    // Percentage of requests to use new engine (0-100)
    newEngineRollout: 100, // 100% = fully enabled

    // Minimum confidence to accept new engine result
    minConfidenceThreshold: 0.70,

    // Enable logging
    enableLogging: true,

    // Enable A/B testing
    enableABTesting: false
}

// ========================================
// UNIFIED CLASSIFICATION INTERFACE
// ========================================
export interface UnifiedClassificationResult {
    categoryId: number
    categoryName: string
    subcategoryId?: number
    subcategoryName?: string
    confidence: number
    engine: 'advanced' | 'legacy'
    reasoning: string
    metadata?: {
        signals?: any
        alternatives?: any[]
        processingTime: number
    }
}

// ====================================
// MAIN INTEGRATED CLASSIFIER
// ========================================
export class IntegratedClassificationSystem {
    private advancedEngine: AdvancedClassificationEngine
    private logs: any[] = []

    constructor() {
        this.advancedEngine = new AdvancedClassificationEngine()
    }

    /**
     * Decide which engine to use
     */
    private shouldUseAdvancedEngine(): boolean {
        // A/B testing - random assignment
        if (FEATURE_FLAGS.enableABTesting) {
            return Math.random() * 100 < FEATURE_FLAGS.newEngineRollout
        }

        // Percentage rollout
        return Math.random() * 100 < FEATURE_FLAGS.newEngineRollout
    }

    /**
     * Main classification function
     */
    async classify(params: {
        title: string
        description: string
        price?: number
        imageAnalysis?: string
        detectedObjects?: string[]
    }): Promise<UnifiedClassificationResult> {
        const startTime = performance.now()

        const useAdvanced = this.shouldUseAdvancedEngine()

        if (useAdvanced) {
            return this.classifyWithAdvanced(params, startTime)
        } else {
            return this.classifyWithLegacy(params, startTime)
        }
    }

    /**
     * Classify with Advanced Engine
     */
    private async classifyWithAdvanced(
        params: any,
        startTime: number
    ): Promise<UnifiedClassificationResult> {
        try {
            const result = this.advancedEngine.classify({
                title: params.title,
                description: params.description,
                price: params.price
            })

            // Check confidence threshold
            if (result.confidence < FEATURE_FLAGS.minConfidenceThreshold) {
                // Fall back to legacy system
                console.warn(`⚠️ Advanced engine confidence too low (${result.confidence}). Falling back to legacy.`)
                return this.classifyWithLegacy(params, startTime)
            }

            // Get category name
            const category = await import('@/constants/categories').then(m =>
                m.CATEGORIES.find(c => c.id === result.categoryId)
            )

            // Get subcategory if available
            let subcategoryId = result.subcategoryId
            let subcategoryName = undefined

            if (!subcategoryId && category) {
                // Try to detect subcategory
                const subResult = detectSubcategory({
                    categoryId: result.categoryId,
                    title: params.title,
                    description: params.description,
                    imageAnalysis: params.imageAnalysis
                })

                if (subResult && subResult.confidence >= 0.3) {
                    subcategoryId = Number(subResult.subcategoryId)
                    subcategoryName = subResult.subcategoryName
                }
            }

            const processingTime = performance.now() - startTime

            const unified: UnifiedClassificationResult = {
                categoryId: result.categoryId,
                categoryName: category?.name_en || 'Unknown',
                subcategoryId,
                subcategoryName,
                confidence: result.confidence,
                engine: 'advanced',
                reasoning: result.reasoning,
                metadata: {
                    signals: result.signals,
                    processingTime
                }
            }

            this.logClassification(unified, params)

            return unified

        } catch (error) {
            console.error('Advanced engine error:', error)
            // Fall back to legacy
            return this.classifyWithLegacy(params, startTime)
        }
    }

    /**
     * Classify with Legacy System
     */
    private async classifyWithLegacy(
        params: any,
        startTime: number
    ): Promise<UnifiedClassificationResult> {
        const result = decideCategoryWithAI({
            title: params.title,
            description: params.description,
            detectedObjects: params.detectedObjects || [],
            imageAnalysis: params.imageAnalysis || ''
        })

        const selected = result.auto_selected || result.recommended_categories[0]

        if (!selected) {
            throw new Error('No category recommendation from legacy system')
        }

        const categoryId = Number(selected.categoryId)

        // Detect subcategory
        const subResult = detectSubcategory({
            categoryId,
            title: params.title,
            description: params.description,
            imageAnalysis: params.imageAnalysis
        })

        const processingTime = performance.now() - startTime

        const unified: UnifiedClassificationResult = {
            categoryId,
            categoryName: selected.categoryName,
            subcategoryId: subResult ? Number(subResult.subcategoryId) : undefined,
            subcategoryName: subResult?.subcategoryName,
            confidence: selected.confidence,
            engine: 'legacy',
            reasoning: selected.reasoning,
            metadata: {
                alternatives: result.recommended_categories,
                processingTime
            }
        }

        this.logClassification(unified, params)

        return unified
    }

    /**
     * Log classification for monitoring
     */
    private logClassification(result: UnifiedClassificationResult, input: any) {
        if (!FEATURE_FLAGS.enableLogging) return

        const logEntry = {
            timestamp: new Date(),
            engine: result.engine,
            categoryId: result.categoryId,
            subcategoryId: result.subcategoryId,
            confidence: result.confidence,
            input: {
                titleLength: input.title.length,
                descLength: input.description?.length || 0,
                hasPrice: !!input.price
            },
            processingTime: result.metadata?.processingTime
        }

        this.logs.push(logEntry)

        // Keep only last 1000 logs
        if (this.logs.length > 1000) {
            this.logs.shift()
        }

        // Optional: Send to analytics service
        // await sendToAnalytics(logEntry)
    }

    /**
     * Get classification statistics
     */
    getStatistics() {
        if (this.logs.length === 0) {
            return null
        }

        const totalLogs = this.logs.length
        const advancedCount = this.logs.filter(l => l.engine === 'advanced').length
        const legacyCount = this.logs.filter(l => l.engine === 'legacy').length

        const avgConfidence = this.logs.reduce((sum, l) => sum + l.confidence, 0) / totalLogs
        const avgProcessingTime = this.logs.reduce((sum, l) => sum + (l.processingTime || 0), 0) / totalLogs

        return {
            totalClassifications: totalLogs,
            advancedEngine: {
                count: advancedCount,
                percentage: (advancedCount / totalLogs) * 100
            },
            legacyEngine: {
                count: legacyCount,
                percentage: (legacyCount / totalLogs) * 100
            },
            avgConfidence,
            avgProcessingTime,
            logs: this.logs.slice(-10) // Last 10 logs
        }
    }

    /**
     * Force use of advanced engine (for testing)
     */
    async classifyWithAdvancedEngine(params: any): Promise<UnifiedClassificationResult> {
        const startTime = performance.now()
        return this.classifyWithAdvanced(params, startTime)
    }

    /**
     * Force use of legacy engine (for testing)
     */
    async classifyWithLegacyEngine(params: any): Promise<UnifiedClassificationResult> {
        const startTime = performance.now()
        return this.classifyWithLegacy(params, startTime)
    }
}

// ========================================
// SINGLETON INSTANCE
// ========================================
let classifierInstance: IntegratedClassificationSystem | null = null

export function getClassifier(): IntegratedClassificationSystem {
    if (!classifierInstance) {
        classifierInstance = new IntegratedClassificationSystem()
    }
    return classifierInstance
}

// ========================================
// CONVENIENCE FUNCTIONS
// ========================================

/**
 * Classify product (main entry point)
 */
export async function classifyProduct(params: {
    title: string
    description: string
    price?: number
    imageAnalysis?: string
    detectedObjects?: string[]
}): Promise<UnifiedClassificationResult> {
    const classifier = getClassifier()
    return classifier.classify(params)
}

/**
 * Classify and return category + subcategory
 */
export async function getProductCategories(params: {
    title: string
    description: string
    price?: number
}): Promise<{
    categoryId: number
    subcategoryId?: number
}> {
    const result = await classifyProduct(params)
    return {
        categoryId: result.categoryId,
        subcategoryId: result.subcategoryId
    }
}

/**
 * Update feature flags (for gradual rollout)
 */
export function updateFeatureFlags(flags: Partial<typeof FEATURE_FLAGS>) {
    Object.assign(FEATURE_FLAGS, flags)
}

/**
 * Get current configuration
 */
export function getConfiguration() {
    return { ...FEATURE_FLAGS }
}
