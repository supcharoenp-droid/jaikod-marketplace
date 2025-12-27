/**
 * AI PIPELINE ORCHESTRATOR
 * 
 * Main entry point for the 2-Layer AI Pipeline
 * 
 * Layer 1: gpt-4o-mini (Vision) → VisionJSON
 * Layer 2: gpt-5-nano (Intelligence) → IntelligenceOutput
 */

import { analyzeWithVision } from './layer1-vision'
import { analyzeWithIntelligence } from './layer2-intelligence'
import { VisionJSON, createEmptyVisionJSON } from './vision-schema'
import { IntelligenceOutput, createEmptyIntelligenceOutput } from './intelligence-schema'

// ============================================
// TYPES
// ============================================
export interface PipelineResult {
    success: boolean

    // Layer outputs
    vision: VisionJSON
    intelligence: IntelligenceOutput

    // Combined results
    category: {
        id: number
        subcategoryId?: number
        name: string
        confidence: number
    }

    pricing: {
        min: number
        suggested: number
        max: number
        confidence: number
        reasoning: string[]
    }

    content: {
        title: string
        description: string
    }

    risk: {
        level: 'low' | 'medium' | 'high' | 'blocked'
        flags: string[]
    }

    // Meta
    processingTime: number
    layerTimes: {
        vision: number
        intelligence: number
    }
    confidence: number
    errors: string[]
}

// ============================================
// MAIN PIPELINE FUNCTION
// ============================================
export async function runAIPipeline(
    images: string[],
    options?: {
        userTitle?: string
        userCategory?: number
        userSpecs?: Record<string, string>
        language?: 'th' | 'en'
    }
): Promise<PipelineResult> {
    const startTime = Date.now()
    const errors: string[] = []

    let visionResult: VisionJSON = createEmptyVisionJSON()
    let intelligenceResult: IntelligenceOutput = createEmptyIntelligenceOutput()
    let visionTime = 0
    let intelligenceTime = 0

    // ============================================
    // LAYER 1: VISION ANALYSIS
    // ============================================
    try {
        const visionStart = Date.now()
        visionResult = await analyzeWithVision(images, {
            language: options?.language || 'th',
            maxImages: 5,
        })
        visionTime = Date.now() - visionStart

        console.log('[Pipeline] Layer 1 completed:', {
            brand: visionResult.detectedBrand,
            model: visionResult.detectedModel,
            type: visionResult.productType,
            confidence: visionResult.confidenceScore,
            time: `${visionTime}ms`,
        })
    } catch (error: any) {
        errors.push(`Layer 1 Error: ${error.message}`)
        console.error('[Pipeline] Layer 1 failed:', error)
    }

    // ============================================
    // LAYER 2: INTELLIGENCE ANALYSIS
    // ============================================
    try {
        const intelligenceStart = Date.now()
        intelligenceResult = await analyzeWithIntelligence(visionResult, {
            title: options?.userTitle,
            category: options?.userCategory,
            specs: options?.userSpecs,
        })
        intelligenceTime = Date.now() - intelligenceStart

        console.log('[Pipeline] Layer 2 completed:', {
            category: intelligenceResult.suggestedCategory.name_th,
            price: intelligenceResult.priceRange.suggested,
            risk: intelligenceResult.riskAssessment.level,
            confidence: intelligenceResult.overallConfidence,
            time: `${intelligenceTime}ms`,
        })
    } catch (error: any) {
        errors.push(`Layer 2 Error: ${error.message}`)
        console.error('[Pipeline] Layer 2 failed:', error)
    }

    // ============================================
    // COMBINE RESULTS
    // ============================================
    const totalTime = Date.now() - startTime
    const success = errors.length === 0

    // Calculate combined confidence
    const combinedConfidence = (visionResult.confidenceScore + intelligenceResult.overallConfidence) / 2

    return {
        success,

        // Raw layer outputs
        vision: visionResult,
        intelligence: intelligenceResult,

        // Combined category
        category: {
            id: intelligenceResult.suggestedCategory.id,
            subcategoryId: intelligenceResult.suggestedCategory.subcategoryId,
            name: intelligenceResult.suggestedCategory.name_th,
            confidence: intelligenceResult.suggestedCategory.confidence,
        },

        // Combined pricing
        pricing: {
            min: intelligenceResult.priceRange.min,
            suggested: intelligenceResult.priceRange.suggested,
            max: intelligenceResult.priceRange.max,
            confidence: intelligenceResult.priceRange.confidence,
            reasoning: intelligenceResult.priceRange.reasoning,
        },

        // Combined content
        content: {
            title: intelligenceResult.suggestedTitle.th,
            description: intelligenceResult.suggestedDescription,
        },

        // Risk assessment
        risk: {
            level: intelligenceResult.riskAssessment.level,
            flags: intelligenceResult.riskAssessment.flags,
        },

        // Meta
        processingTime: totalTime,
        layerTimes: {
            vision: visionTime,
            intelligence: intelligenceTime,
        },
        confidence: combinedConfidence,
        errors,
    }
}

// ============================================
// EXPORTS
// ============================================
export { analyzeWithVision } from './layer1-vision'
export { analyzeWithIntelligence } from './layer2-intelligence'
export type { VisionJSON } from './vision-schema'
export type { IntelligenceOutput } from './intelligence-schema'

export default runAIPipeline
