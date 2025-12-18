
import { decideCategoryWithAI } from './category-decision-ai'
import { CATEGORIES } from '@/constants/categories'

export interface CategoryNode {
    id: number;
    name_th: string;
    name_en: string;
    keywords: string[];
    parent_id?: number | null;
}

export interface CategoryPrediction {
    category_id: number | null;
    category_name_th: string | null;
    category_name_en: string | null;
    confidence: number;
}

export interface CategorySuggestionResponse {
    primary: CategoryPrediction;
    alternatives: CategoryPrediction[];
    recommended_action: 'keep' | 'change' | 'ask_more_info';
    short_reason: string;
    explain?: string;
    suggestions_for_user: string[];
}

/**
 * Suggest category using the robust AI classifier
 * This now uses decideCategoryWithAI which has all the fixes for:
 * - Canon Printer vs Camera
 * - Air Pump vs Computer
 * - Brand context detection
 * - Sanity rules
 */
export async function suggestCategoryPro(input: {
    title: string;
    description?: string;
    attributes?: any;
    current_category_id?: number | null;
}): Promise<CategorySuggestionResponse> {
    const { title, description = '', current_category_id } = input;

    // Use the robust decideCategoryWithAI
    const aiResult = decideCategoryWithAI({
        title,
        description,
        detectedObjects: [],
        imageAnalysis: ''
    })

    // Get the top recommendation
    const topRecommendation = aiResult.auto_selected || aiResult.recommended_categories[0]

    if (!topRecommendation) {
        return {
            primary: {
                category_id: null,
                category_name_th: null,
                category_name_en: null,
                confidence: 0
            },
            alternatives: [],
            recommended_action: 'ask_more_info',
            short_reason: 'ไม่พบหมวดหมู่ที่ชัดเจน',
            suggestions_for_user: ['ระบุชื่อสินค้าให้ชัดเจน', 'เพิ่มรูปภาพ']
        }
    }

    // Map to our response format
    const categoryId = Number(topRecommendation.categoryId)
    const category = CATEGORIES.find(c => c.id === categoryId)

    const confidence = topRecommendation.confidence

    // Determine action
    let recommended_action: 'keep' | 'change' | 'ask_more_info' = 'keep'
    if (confidence >= 0.7) {
        recommended_action = current_category_id === categoryId ? 'keep' : 'change'
    } else if (confidence >= 0.5) {
        recommended_action = 'ask_more_info'
    } else {
        recommended_action = 'ask_more_info'
    }

    // Get alternatives
    const alternatives = aiResult.recommended_categories
        .slice(1, 4) // Top 3 alternatives
        .map(rec => {
            const catId = Number(rec.categoryId)
            const cat = CATEGORIES.find(c => c.id === catId)
            return {
                category_id: catId,
                category_name_th: cat?.name_th || rec.categoryName,
                category_name_en: cat?.name_en || rec.categoryName,
                confidence: rec.confidence
            }
        })

    // Build result
    const result: CategorySuggestionResponse = {
        primary: {
            category_id: categoryId,
            category_name_th: category?.name_th || topRecommendation.categoryName,
            category_name_en: category?.name_en || topRecommendation.categoryName,
            confidence: Number(confidence.toFixed(2))
        },
        alternatives,
        recommended_action,
        short_reason: topRecommendation.reasoning || 'AI วิเคราะห์จากชื่อสินค้า',
        suggestions_for_user: confidence < 0.6
            ? ['ระบุชื่อสินค้าให้ชัดเจน', 'เพิ่มรายละเอียดเพิ่มเติม']
            : []
    }

    return result
}
