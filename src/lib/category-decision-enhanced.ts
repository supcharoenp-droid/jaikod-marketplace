/**
 * Category Decision AI - Enhanced Version
 * 
 * Uses advanced category intelligence for better accuracy
 */

import { CATEGORIES } from '@/constants/categories'
import {
    calculateAdvancedScore,
    shouldAutoSelect,
    rankCategories,
    extractBrand,
    getDetailedAnalysis
} from './advanced-category-intelligence'
import type { CategoryRecommendation, CategoryDecisionResult } from './category-decision-ai'

/**
 * Enhanced category decision with advanced intelligence
 */
export function decideCategoryWithAdvancedAI(params: {
    title: string
    description: string
    detectedObjects: string[]
    imageAnalysis?: string
}): CategoryDecisionResult {
    const { title, description, detectedObjects, imageAnalysis } = params

    // Extract brand for extra intelligence
    const detected_brand = extractBrand(title)

    // Get detailed analysis for debugging
    const analysis = getDetailedAnalysis(title, description, imageAnalysis)

    console.log('🔍 Advanced Analysis:', {
        brand: analysis.detected_brand,
        model: analysis.detected_model,
        technical_terms: analysis.technical_terms.slice(0, 5),
        exclusions: Object.keys(analysis.exclusions_triggered),
        indicators: Object.keys(analysis.strong_indicators)
    })

    // Calculate scores for all categories
    const categoryScores = CATEGORIES.map(category => {
        const result = calculateAdvancedScore(category, {
            title,
            description,
            detectedObjects,
            imageAnalysis,
            brand: detected_brand || undefined
        })

        return {
            category,
            score: result.score,
            confidence: result.confidence,
            reasoning: result.reasoning
        }
    })

    // Rank categories intelligently
    const ranked = rankCategories(categoryScores)

    // Log top 3
    console.log('🏆 Category Rankings:')
    ranked.slice(0, 3).forEach((item, i) => {
        console.log(`${i + 1}. ${item.category.name_th} - Score: ${item.score.toFixed(1)}, Confidence: ${(item.confidence * 100).toFixed(1)}%`)
        if (item.reasoning.length > 0) {
            console.log(`   Reasons:`, item.reasoning.slice(0, 3))
        }
    })

    // Convert to recommendations
    const recommendations: CategoryRecommendation[] = ranked
        .slice(0, 3)
        .filter(item => item.confidence > 0.1) // Minimum 10% confidence
        .map(item => ({
            categoryId: String(item.category.id),
            categoryName: item.category.name_th,
            confidence: item.confidence,
            reasoning: item.reasoning.join('; ')
        }))

    // Build confidence scores map
    const confidenceScores: Record<string, number> = {}
    ranked.forEach(item => {
        confidenceScores[String(item.category.id)] = item.confidence
    })

    // Smart auto-selection decision
    const topScores = ranked.map(r => r.score)
    const topRecommendation = recommendations[0]
    const shouldAuto = topRecommendation
        ? shouldAutoSelect(topRecommendation.confidence, topScores)
        : false

    console.log('🎯 Decision:', {
        top_category: topRecommendation?.categoryName,
        confidence: topRecommendation?.confidence,
        auto_select: shouldAuto,
        reason: shouldAuto ? 'High confidence + good separation' : 'Need user confirmation'
    })

    return {
        recommended_categories: recommendations,
        confidence_scores: confidenceScores,
        require_user_confirmation: !shouldAuto,
        auto_selected: shouldAuto ? topRecommendation : undefined
    }
}
