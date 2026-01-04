/**
 * AI Services Integration Example
 * 
 * Shows how to use all AI services together in the Smart Listing flow
 */

import { precheckImages } from './imagePrecheck'
import { evaluateImageQuality } from './imageQualityEvaluator'
import { checkImageCompliance } from './imageComplianceChecker'
import { enhanceProductImages } from './professionalImageEnhancer'
import { analyzeProductForListing } from './intelligentListingAssistant'

/**
 * Complete AI Pipeline for Product Listing
 * 
 * STEP 1: Upload → Quick Precheck
 * STEP 2: Processing → Quality + Compliance + Enhancement + Suggestions
 * STEP 3: Form → Display results & AI assistance
 */

export interface CompletePipelineResult {
    // Phase 1: Initial Validation
    precheck: {
        passed: boolean
        overall_score: number
        duplicate_detected: boolean
        suggestion_text: { th: string; en: string }
    }

    // Phase 2: Quality Analysis
    quality: {
        overall_quality: number
        recommended_main_image_id: string | null
        best_score: number
        worst_score: number
    }

    // Phase 3: Safety & Compliance
    compliance: {
        is_safe: boolean
        risk_level: 'low' | 'medium' | 'high'
        requires_review: boolean
        user_message?: { th: string; en: string }
    }

    // Phase 4: Professional Enhancement
    enhancement: {
        image_score: number
        detected_product?: string
        detected_category?: string
        recommendations: string[]
    }

    // Phase 5: Listing Intelligence
    suggestions: {
        completion_score: number
        category_recommendation: any
        title_suggestions: any[]
        price_guidance?: any
    }

    // Overall Status
    ready_to_proceed: boolean
    blocking_issues: string[]
    warnings: string[]
}

/**
 * Run complete AI pipeline on uploaded images
 */
export async function runCompleteAIPipeline(
    images: File[],
    userInput?: {
        title?: string
        description?: string
        price?: number
        categoryId?: number
    }
): Promise<CompletePipelineResult> {
    console.log('[AI Pipeline] Starting complete analysis...')

    const blocking_issues: string[] = []
    const warnings: string[] = []

    try {
        // ==============================================
        // PHASE 1: PRECHECK (Fast validation)
        // ==============================================
        console.log('[AI Pipeline] Phase 1: Precheck...')
        const precheckResult = await precheckImages(images)

        const precheck = {
            passed: precheckResult.overall_score >= 40,
            overall_score: precheckResult.overall_score,
            duplicate_detected: precheckResult.duplicate_detected,
            suggestion_text: precheckResult.soft_suggestion_text
        }

        if (!precheck.passed) {
            blocking_issues.push('Image quality too low')
        }

        // ==============================================
        // PHASE 2: QUALITY EVALUATION (Detailed scoring)
        // ==============================================
        console.log('[AI Pipeline] Phase 2: Quality evaluation...')
        const qualityResult = await evaluateImageQuality(images)

        const quality = {
            overall_quality: qualityResult.overall_quality,
            recommended_main_image_id: qualityResult.recommended_main_image_id,
            best_score: qualityResult.best_score,
            worst_score: qualityResult.worst_score
        }

        if (quality.worst_score < 30) {
            warnings.push('Some images have very low quality')
        }

        // ==============================================
        // PHASE 3: COMPLIANCE CHECK (Safety screening)
        // ==============================================
        console.log('[AI Pipeline] Phase 3: Compliance check...')
        const complianceResult = await checkImageCompliance(images)

        const compliance = {
            is_safe: complianceResult.overall_risk_level !== 'high',
            risk_level: complianceResult.overall_risk_level,
            requires_review: complianceResult.requires_manual_review,
            user_message: complianceResult.results
                .find(r => r.user_message)?.user_message
        }

        // CRITICAL: Block high-risk content
        if (compliance.risk_level === 'high') {
            const blockResult = complianceResult.results
                .find(r => r.action_recommendation === 'block')

            if (blockResult) {
                blocking_issues.push('Image violates content policy')
            } else {
                warnings.push('Images flagged for manual review')
            }
        }

        // ==============================================
        // PHASE 4: ENHANCEMENT (Professional processing)
        // ==============================================
        console.log('[AI Pipeline] Phase 4: Image enhancement...')
        const enhancementResult = await enhanceProductImages(images, {
            auto_enhance: true
        })

        const enhancement = {
            image_score: enhancementResult.image_score,
            detected_product: enhancementResult.detected_product,
            detected_category: enhancementResult.detected_category,
            recommendations: enhancementResult.recommendations.map((r: any) => typeof r === 'string' ? r : r.text || r.message || String(r))
        }

        // ==============================================
        // PHASE 5: LISTING INTELLIGENCE (Smart suggestions)
        // ==============================================
        console.log('[AI Pipeline] Phase 5: Listing intelligence...')
        const suggestionsResult = await analyzeProductForListing({
            detected_product: enhancement.detected_product,
            detected_category: enhancement.detected_category,
            images_count: images.length,
            user_input: userInput
        })

        const suggestions = {
            completion_score: suggestionsResult.completion_score,
            category_recommendation: suggestionsResult.category_recommendation,
            title_suggestions: suggestionsResult.title_suggestions,
            price_guidance: suggestionsResult.price_guidance
        }

        // ==============================================
        // FINAL DECISION
        // ==============================================
        const ready_to_proceed =
            blocking_issues.length === 0 &&
            precheck.passed &&
            compliance.is_safe

        console.log(`[AI Pipeline] Complete! Ready: ${ready_to_proceed}`)

        return {
            precheck,
            quality,
            compliance,
            enhancement,
            suggestions,
            ready_to_proceed,
            blocking_issues,
            warnings
        }

    } catch (error) {
        console.error('[AI Pipeline] Error:', error)

        // Graceful degradation
        return {
            precheck: {
                passed: true,
                overall_score: 50,
                duplicate_detected: false,
                suggestion_text: { th: 'ไม่สามารถวิเคราะห์ได้', en: 'Analysis unavailable' }
            },
            quality: {
                overall_quality: 50,
                recommended_main_image_id: null,
                best_score: 50,
                worst_score: 50
            },
            compliance: {
                is_safe: true,
                risk_level: 'low',
                requires_review: false
            },
            enhancement: {
                image_score: 50,
                recommendations: []
            },
            suggestions: {
                completion_score: 30,
                category_recommendation: null as any,
                title_suggestions: [],
            },
            ready_to_proceed: true, // Allow on error
            blocking_issues: [],
            warnings: ['AI analysis temporarily unavailable']
        }
    }
}

/**
 * Quick check (for real-time feedback during upload)
 */
export async function quickImageCheck(images: File[]): Promise<{
    canProceed: boolean
    quickScore: number
    hint: { th: string; en: string }
}> {
    const precheck = await precheckImages(images)

    return {
        canProceed: precheck.overall_score >= 40,
        quickScore: precheck.overall_score,
        hint: precheck.soft_suggestion_text
    }
}

/**
 * Background quality analysis (non-blocking)
 */
export async function backgroundQualityCheck(images: File[]): Promise<void> {
    // Run quality check in background
    // Store results for later use
    try {
        const quality = await evaluateImageQuality(images)

        // Store in localStorage or state management
        if (typeof window !== 'undefined') {
            sessionStorage.setItem('image_quality', JSON.stringify({
                timestamp: Date.now(),
                overall: quality.overall_quality,
                recommended_main: quality.recommended_main_image_id
            }))
        }
    } catch (error) {
        console.error('Background quality check failed:', error)
    }
}

/**
 * Silent compliance check (for admin queue)
 */
export async function silentComplianceCheck(
    images: File[],
    sellerId: string,
    listingId: string
): Promise<{
    shouldQueue: boolean
    adminNote?: string
}> {
    const compliance = await checkImageCompliance(images)

    if (compliance.requires_manual_review) {
        const report = compliance.results
            .filter(r => r.action_recommendation === 'admin_review')
            .map(r => r.admin_note)
            .join('; ')

        // Queue for admin review
        // In production, this would insert into admin_review_queue table
        console.log(`[Admin Queue] Seller ${sellerId}, Listing ${listingId}: ${report}`)

        return {
            shouldQueue: true,
            adminNote: report
        }
    }

    return {
        shouldQueue: false
    }
}

/**
 * Example: Complete workflow integration
 */
export async function exampleCompleteWorkflow() {
    // Simulated file upload
    const mockImages: File[] = [] // Would be actual File objects

    // Run complete pipeline
    const result = await runCompleteAIPipeline(mockImages, {
        title: 'iPhone 13 Pro',
        price: 25000
    })

    // Check if ready
    if (!result.ready_to_proceed) {
        console.log('❌ Blocking issues:', result.blocking_issues)
        return false
    }

    // Show warnings to user
    if (result.warnings.length > 0) {
        console.log('⚠️ Warnings:', result.warnings)
    }

    // Display AI suggestions
    console.log('📊 Quality Score:', result.quality.overall_quality)
    console.log('🎯 Suggested Category:', result.suggestions.category_recommendation)
    console.log('✍️ Title Suggestions:', result.suggestions.title_suggestions)
    console.log('💰 Price Guidance:', result.suggestions.price_guidance)

    // Use recommended main image
    if (result.quality.recommended_main_image_id) {
        console.log('🖼️ Use this as main image:', result.quality.recommended_main_image_id)
    }

    // Compliance status
    if (result.compliance.requires_review) {
        console.log('👮 Flagged for admin review (silent)')
    }

    return true
}
