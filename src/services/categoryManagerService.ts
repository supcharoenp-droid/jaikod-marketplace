import { CATEGORIES, Category } from '@/constants/categories'

// Extended type for admin
export interface AdminCategory extends Category {
    ai_keywords?: string[]
    ai_confidence_threshold?: number
}

// Mock AI Suggestions
export async function getAiCategorySuggestions() {
    return [
        {
            suggested_name: 'Smart Home Devices',
            reason: 'High search volume for "smart switch", "alexa"',
            parent_category_id: 5, // Home Appliances
            confidence: 0.85
        },
        {
            suggested_name: 'Cryptocurrency Hardware',
            reason: 'Rising listings for "Ledger", "Trezor"',
            parent_category_id: 4, // Computers
            confidence: 0.72
        }
    ]
}

export async function autoMapCategory(productTitle: string): Promise<{ category_id: number, confidence: number } | null> {
    // Mock AI Classification
    const lower = productTitle.toLowerCase()

    if (lower.includes('iphone') || lower.includes('samsung')) return { category_id: 3, confidence: 0.95 } // Mobiles
    if (lower.includes('nike') || lower.includes('adidas')) return { category_id: 6, confidence: 0.90 } // Fashion
    if (lower.includes('rolex')) return { category_id: 6, confidence: 0.85 } // Fashion (Watches)
    if (lower.includes('canon') || lower.includes('sony')) return { category_id: 8, confidence: 0.92 } // Cameras

    return null
}
