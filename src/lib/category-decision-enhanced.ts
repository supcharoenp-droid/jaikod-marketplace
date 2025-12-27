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
    let recommendations: CategoryRecommendation[] = ranked
        .slice(0, 3)
        .filter(item => item.confidence > 0.1) // Minimum 10% confidence
        .map(item => ({
            categoryId: String(item.category.id),
            categoryName: item.category.name_th,
            confidence: item.confidence,
            reasoning: item.reasoning.join('; ')
        }))

    // 🔥 FALLBACK: If no recommendations, try keyword-based detection
    if (recommendations.length === 0) {
        console.warn('⚠️ No confident category found, using fallback detection...')
        const titleLower = title.toLowerCase()

        // Fallback keyword mapping - ⚠️ CORRECT CATEGORY IDs!
        const fallbackKeywords: Record<number, string[]> = {
            // Category 1 = มือถือ/อิเล็กทรอนิกส์ (Mobile & Electronics)
            1: ['มือถือ', 'smartphone', 'phone', 'iphone', 'samsung galaxy', 'xiaomi', 'oppo', 'vivo', 'หูฟัง', 'headphone', 'airpods', 'สายชาร์จ', 'powerbank', 'tablet', 'ipad'],

            // Category 2 = ยานพาหนะ (Vehicles) ✅ FIXED!
            2: ['รถ', 'car', 'รถยนต์', 'ยาง', 'tire', 'ปั๊มลม', 'honda', 'toyota', 'nissan', 'mazda', 'isuzu', 'mitsubishi', 'ford', 'chevrolet', 'benz', 'bmw', 'audi', 'มอเตอร์ไซค์', 'motorcycle', 'bigbike', 'almera', 'camry', 'city', 'civic', 'fortuner', 'hilux', 'vios'],

            // Category 3 = แฟชั่น (Fashion)
            3: ['เสื้อ', 'กางเกง', 'รองเท้า', 'กระเป๋า', 'nike', 'adidas', 'gucci', 'นาฬิกา', 'watch', 'rolex', 'louis vuitton'],

            // Category 4 = คอมพิวเตอร์ (Computers)
            4: ['คีย์บอร์ด', 'keyboard', 'เมาส์', 'mouse', 'laptop', 'โน้ตบุ๊ค', 'คอมพิวเตอร์', 'computer', 'monitor', 'จอ', 'printer', 'ปริ้นเตอร์', 'logitech', 'razer', 'asus', 'dell', 'hp', 'lenovo', 'acer', 'macbook', 'gaming pc'],

            // Category 5 = เครื่องใช้ไฟฟ้า (Appliances)
            5: ['ทีวี', 'tv', 'ตู้เย็น', 'แอร์', 'พัดลม', 'fan', 'เครื่องซักผ้า', 'ฟอกอากาศ', 'air purifier', 'sharp', 'panasonic', 'lg', 'samsung tv', 'เครื่องปรับอากาศ'],

            // Category 7 = กีฬา (Sports)
            7: ['ฟุตบอล', 'บาสเก็ตบอล', 'กอล์ฟ', 'จักรยาน', 'ออกกำลังกาย', 'gym', 'fitness'],

            // Category 8 = กล้อง/ภาพยนตร์ (Camera)
            8: ['กล้อง', 'camera', 'เลนส์', 'lens', 'dslr', 'mirrorless', 'canon eos', 'nikon', 'sony alpha', 'fujifilm', 'gopro'],

            // Category 13 = บ้านและสวน (Home & Garden)
            13: ['เฟอร์นิเจอร์', 'โซฟา', 'เตียง', 'โต๊ะ', 'เก้าอี้', 'ต้นไม้', 'สว่าน', 'furniture'],

            // Category 15 = ของเล่น/เด็ก (Toys & Kids)
            15: ['ของเล่น', 'toy', 'ตุ๊กตา', 'doll', 'เด็ก', 'baby', 'ผ้าอ้อม', 'lego'],
        }

        for (const [catId, keywords] of Object.entries(fallbackKeywords)) {
            const matchedKeywords = keywords.filter(kw => titleLower.includes(kw.toLowerCase()))
            if (matchedKeywords.length > 0) {
                const category = CATEGORIES.find(c => c.id === Number(catId))
                if (category) {
                    recommendations.push({
                        categoryId: String(catId),
                        categoryName: category.name_th,
                        confidence: 0.3 + (matchedKeywords.length * 0.1), // Base 30% + 10% per keyword
                        reasoning: `Fallback: matched "${matchedKeywords.join(', ')}"`
                    })
                    console.log(`🔄 Fallback matched: ${category.name_th} (${matchedKeywords.join(', ')})`)
                    break
                }
            }
        }
    }

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
