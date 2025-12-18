/**
 * Product Object & Category AI
 * 
 * Detects products in images and maps to marketplace categories
 * Provides intelligent category suggestions that are always editable
 */

import { CATEGORIES, type Category, type Subcategory } from '@/constants/categories'

export interface DetectedObject {
    name: string
    confidence: number // 0-1
    bounding_box?: {
        x: number
        y: number
        width: number
        height: number
    }
    is_primary: boolean
}

export interface CategoryMatch {
    category_id: number
    category_name: { th: string; en: string }
    category_slug: string
    subcategory_id?: number
    subcategory_name?: { th: string; en: string }
    subcategory_slug?: string
    confidence_score: number // 0-100
    reasoning: {
        th: string
        en: string
    }
}

export interface CategoryDetectionResult {
    primary_category: CategoryMatch
    secondary_category?: CategoryMatch
    alternative_categories: CategoryMatch[]
    detected_objects: DetectedObject[]
    suggestion_note: {
        th: string
        en: string
    }
}

/**
 * Object detection keywords mapping
 * Maps detected words/patterns to categories
 */
interface CategoryKeywords {
    category_id: number
    subcategory_id?: number
    keywords: string[]
    confidence_boost: number
}

const CATEGORY_KEYWORDS: CategoryKeywords[] = [
    // Automotive
    { category_id: 1, subcategory_id: 101, keywords: ['car', 'รถยนต์', 'sedan', 'suv', 'vehicle', 'automobile'], confidence_boost: 0.8 },
    { category_id: 1, subcategory_id: 102, keywords: ['motorcycle', 'มอเตอร์ไซค์', 'มอเตอไซค์', 'bike', 'motorbike', 'scooter'], confidence_boost: 0.8 },
    { category_id: 1, subcategory_id: 103, keywords: ['tire', 'ยาง', 'wheel', 'ล้อ', 'alloy', 'rim'], confidence_boost: 0.7 },

    // Real Estate
    { category_id: 2, subcategory_id: 201, keywords: ['house', 'บ้าน', 'home', 'residence'], confidence_boost: 0.7 },
    { category_id: 2, subcategory_id: 202, keywords: ['condo', 'คอนโด', 'apartment'], confidence_boost: 0.7 },
    { category_id: 2, subcategory_id: 203, keywords: ['land', 'ที่ดิน', 'plot'], confidence_boost: 0.7 },

    // Mobiles & Tablets
    { category_id: 3, subcategory_id: 301, keywords: ['phone', 'smartphone', 'iphone', 'samsung', 'มือถือ', 'โทรศัพท์', 'mobile'], confidence_boost: 0.9 },
    { category_id: 3, subcategory_id: 302, keywords: ['tablet', 'ipad', 'แท็บเล็ต'], confidence_boost: 0.85 },
    { category_id: 3, subcategory_id: 303, keywords: ['watch', 'smartwatch', 'นาฬิกาอัจฉริยะ', 'apple watch'], confidence_boost: 0.8 },
    { category_id: 3, subcategory_id: 304, keywords: ['case', 'เคส', 'cover', 'screen protector', 'ฟิล์ม', 'charger', 'cable'], confidence_boost: 0.7 },

    // Computers & IT
    { category_id: 4, subcategory_id: 401, keywords: ['laptop', 'notebook', 'โน้ตบุ๊ค', 'macbook'], confidence_boost: 0.9 },
    { category_id: 4, subcategory_id: 402, keywords: ['desktop', 'pc', 'คอมพิวเตอร์', 'computer'], confidence_boost: 0.85 },
    { category_id: 4, subcategory_id: 403, keywords: ['monitor', 'จอ', 'display', 'screen'], confidence_boost: 0.8 },
    { category_id: 4, subcategory_id: 404, keywords: ['keyboard', 'คีย์บอร์ด', 'mouse', 'เมาส์', 'headset'], confidence_boost: 0.7 },
    { category_id: 4, subcategory_id: 405, keywords: ['printer', 'ปริ้นเตอร์', 'scanner', 'เครื่องพิมพ์'], confidence_boost: 0.8 },

    // Home Appliances
    { category_id: 5, subcategory_id: 501, keywords: ['air conditioner', 'แอร์', 'aircon', 'เครื่องปรับอากาศ'], confidence_boost: 0.85 },
    { category_id: 5, subcategory_id: 502, keywords: ['refrigerator', 'ตู้เย็น', 'fridge', 'freezer'], confidence_boost: 0.85 },
    { category_id: 5, subcategory_id: 503, keywords: ['washing machine', 'เครื่องซักผ้า', 'dryer'], confidence_boost: 0.85 },
    { category_id: 5, subcategory_id: 504, keywords: ['tv', 'television', 'ทีวี', 'smart tv', 'speaker'], confidence_boost: 0.8 },
    { category_id: 5, subcategory_id: 505, keywords: ['microwave', 'ไมโครเวฟ', 'oven', 'rice cooker', 'หม้อหุงข้าว'], confidence_boost: 0.75 },

    // Fashion
    { category_id: 6, subcategory_id: 601, keywords: ['shirt', 'เสื้อ', 'pants', 'กางเกง', 'jacket', 'suit'], confidence_boost: 0.7 },
    { category_id: 6, subcategory_id: 602, keywords: ['dress', 'skirt', 'กระโปรง', 'blouse'], confidence_boost: 0.7 },
    { category_id: 6, subcategory_id: 603, keywords: ['bag', 'กระเป๋า', 'handbag', 'lv', 'gucci', 'chanel', 'hermes'], confidence_boost: 0.8 },
    { category_id: 6, subcategory_id: 604, keywords: ['shoes', 'รองเท้า', 'sneakers', 'สนีกเกอร์', 'nike', 'adidas'], confidence_boost: 0.8 },
    { category_id: 6, subcategory_id: 605, keywords: ['watch', 'นาฬิกา', 'นาฬิกาข้อมือ', 'rolex', 'omega'], confidence_boost: 0.75 },

    // Gaming & Gadgets
    { category_id: 7, subcategory_id: 701, keywords: ['playstation', 'ps5', 'ps4', 'xbox', 'nintendo', 'switch', 'console'], confidence_boost: 0.9 },
    { category_id: 7, subcategory_id: 702, keywords: ['game', 'เกม', 'video game', 'แผ่นเกม'], confidence_boost: 0.75 },
    { category_id: 7, subcategory_id: 706, keywords: ['drone', 'โดรน', 'dji'], confidence_boost: 0.85 },

    // Cameras
    { category_id: 8, subcategory_id: 801, keywords: ['camera', 'กล้อง', 'dslr', 'mirrorless', 'canon', 'nikon', 'sony'], confidence_boost: 0.9 },
    { category_id: 8, subcategory_id: 803, keywords: ['lens', 'เลนส์', 'zoom lens'], confidence_boost: 0.85 },

    // Sports & Travel
    { category_id: 12, subcategory_id: 1201, keywords: ['bicycle', 'จักรยาน', 'bike', 'cycling'], confidence_boost: 0.8 },
    { category_id: 12, subcategory_id: 1202, keywords: ['treadmill', 'ลู่วิ่ง', 'dumbbell', 'ดัมเบล', 'fitness', 'gym'], confidence_boost: 0.75 },

    // Home & Garden
    { category_id: 13, subcategory_id: 1301, keywords: ['sofa', 'โซฟา', 'table', 'โต๊ะ', 'chair', 'เก้าอี้', 'bed', 'เตียง', 'furniture'], confidence_boost: 0.8 },
    { category_id: 13, subcategory_id: 1303, keywords: ['plant', 'ต้นไม้', 'tree', 'flower', 'ดอกไม้', 'garden'], confidence_boost: 0.7 },
    { category_id: 13, subcategory_id: 1304, keywords: ['drill', 'สว่าน', 'hammer', 'ค้อน', 'tool', 'เครื่องมือ'], confidence_boost: 0.75 },
]

/**
 * Detect products and suggest categories
 */
export async function detectProductCategory(
    images: File[],
    userInput?: {
        title?: string
        description?: string
    }
): Promise<CategoryDetectionResult> {
    console.log(`[CategoryAI] Analyzing ${images.length} images...`)

    try {
        // Analyze images for visual cues
        const visualAnalysis = await analyzeImagesForObjects(images)

        // Analyze text input for keywords
        const textAnalysis = analyzeTextForCategory(userInput)

        // Combine analyses
        const categoryScores = calculateCategoryScores(visualAnalysis, textAnalysis)

        // Get top matches
        const matches = getCategoryMatches(categoryScores)

        // Generate results
        return {
            primary_category: matches[0],
            secondary_category: matches[1],
            alternative_categories: matches.slice(2, 5),
            detected_objects: visualAnalysis.objects,
            suggestion_note: {
                th: 'หมวดหมู่ที่แนะนำโดย AI - คุณสามารถเปลี่ยนได้ตลอดเวลา',
                en: 'AI-suggested category - you can change this anytime'
            }
        }
    } catch (error) {
        console.error('[CategoryAI] Error:', error)

        // Return default fallback
        return createFallbackResult()
    }
}

/**
 * Analyze images for objects (simplified canvas-based)
 */
interface VisualAnalysis {
    objects: DetectedObject[]
    dominant_colors: string[]
    has_text: boolean
}

async function analyzeImagesForObjects(images: File[]): Promise<VisualAnalysis> {
    const objects: DetectedObject[] = []
    const all_colors: string[] = []

    // Analyze first image (primary)
    if (images.length > 0) {
        const firstImage = images[0]
        const analysis = await analyzeImageContent(firstImage)

        // Simple object detection based on image characteristics
        // In production, this would use YOLO, Vision Transformer, or similar

        // Color-based heuristics
        if (analysis.colorAnalysis.dominantColors.includes('black') &&
            analysis.width > 1000 && analysis.height > 1000) {
            objects.push({
                name: 'electronic_device',
                confidence: 0.6,
                is_primary: true
            })
        }

        all_colors.push(...analysis.colorAnalysis.dominantColors)
    }

    return {
        objects,
        dominant_colors: all_colors,
        has_text: false
    }
}

/**
 * Analyze text for category keywords
 */
interface TextAnalysis {
    matched_keywords: Array<{
        keyword: string
        category_id: number
        subcategory_id?: number
        boost: number
    }>
}

function analyzeTextForCategory(userInput?: {
    title?: string
    description?: string
}): TextAnalysis {
    const matched_keywords: TextAnalysis['matched_keywords'] = []

    if (!userInput) return { matched_keywords }

    const combined_text = `${userInput.title || ''} ${userInput.description || ''}`.toLowerCase()

    // Match against keyword dictionary
    for (const entry of CATEGORY_KEYWORDS) {
        for (const keyword of entry.keywords) {
            if (combined_text.includes(keyword.toLowerCase())) {
                matched_keywords.push({
                    keyword,
                    category_id: entry.category_id,
                    subcategory_id: entry.subcategory_id,
                    boost: entry.confidence_boost
                })
            }
        }
    }

    return { matched_keywords }
}

/**
 * Calculate category scores
 */
function calculateCategoryScores(
    visual: VisualAnalysis,
    text: TextAnalysis
): Map<string, number> {
    const scores = new Map<string, number>()

    // Score from text keywords (primary signal)
    for (const match of text.matched_keywords) {
        const key = match.subcategory_id
            ? `${match.category_id}-${match.subcategory_id}`
            : `${match.category_id}`

        const current = scores.get(key) || 0
        scores.set(key, current + (match.boost * 100))
    }

    // Score from visual objects (secondary signal)
    for (const obj of visual.objects) {
        // Map object names to categories
        // This is simplified - production would use ML embeddings
        if (obj.name === 'electronic_device') {
            const phoneScore = scores.get('3-301') || 0
            scores.set('3-301', phoneScore + (obj.confidence * 30))

            const laptopScore = scores.get('4-401') || 0
            scores.set('4-401', laptopScore + (obj.confidence * 25))
        }
    }

    // If no matches, return default "Others" category
    if (scores.size === 0) {
        scores.set('99', 50)
    }

    return scores
}

/**
 * Get category matches from scores
 */
function getCategoryMatches(scores: Map<string, number>): CategoryMatch[] {
    const matches: CategoryMatch[] = []

    // Sort by score
    const sorted = Array.from(scores.entries())
        .sort((a, b) => b[1] - a[1])

    for (const [key, score] of sorted) {
        const parts = key.split('-')
        const category_id = parseInt(parts[0])
        const subcategory_id = parts[1] ? parseInt(parts[1]) : undefined

        const category = CATEGORIES.find(c => c.id === category_id)
        if (!category) continue

        const subcategory = subcategory_id
            ? category.subcategories?.find(s => s.id === subcategory_id)
            : undefined

        matches.push({
            category_id,
            category_name: {
                th: category.name_th,
                en: category.name_en
            },
            category_slug: category.slug,
            subcategory_id,
            subcategory_name: subcategory ? {
                th: subcategory.name_th,
                en: subcategory.name_en
            } : undefined,
            subcategory_slug: subcategory?.slug,
            confidence_score: Math.min(Math.round(score), 100),
            reasoning: generateReasoning(category, subcategory, score)
        })
    }

    return matches
}

/**
 * Generate reasoning for category suggestion
 */
function generateReasoning(
    category: Category,
    subcategory: Subcategory | undefined,
    score: number
): { th: string; en: string } {
    if (score >= 80) {
        return {
            th: `ตรงกับคำอธิบาย "${subcategory?.name_th || category.name_th}" มากที่สุด`,
            en: `Best match for "${subcategory?.name_en || category.name_en}"`
        }
    } else if (score >= 60) {
        return {
            th: `น่าจะเป็น "${subcategory?.name_th || category.name_th}"`,
            en: `Likely "${subcategory?.name_en || category.name_en}"`
        }
    } else {
        return {
            th: `อาจเป็น "${subcategory?.name_th || category.name_th}"`,
            en: `Possibly "${subcategory?.name_en || category.name_en}"`
        }
    }
}

/**
 * Create fallback result
 */
function createFallbackResult(): CategoryDetectionResult {
    const othersCategory = CATEGORIES.find(c => c.id === 99)!

    const fallbackMatch: CategoryMatch = {
        category_id: 99,
        category_name: {
            th: othersCategory.name_th,
            en: othersCategory.name_en
        },
        category_slug: othersCategory.slug,
        confidence_score: 50,
        reasoning: {
            th: 'กรุณาเลือกหมวดหมู่ที่เหมาะสม',
            en: 'Please select appropriate category'
        }
    }

    return {
        primary_category: fallbackMatch,
        alternative_categories: [],
        detected_objects: [],
        suggestion_note: {
            th: 'ไม่สามารถระบุหมวดหมู่ได้ - กรุณาเลือกเอง',
            en: 'Cannot determine category - please select manually'
        }
    }
}

/**
 * Helper: Analyze image content (reuse from compliance checker)
 */
interface ImageContentAnalysis {
    width: number
    height: number
    colorAnalysis: {
        dominantColors: string[]
    }
}

async function analyzeImageContent(file: File): Promise<ImageContentAnalysis> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()

        reader.onload = (e) => {
            const img = new Image()
            img.src = e.target?.result as string

            img.onload = () => {
                resolve({
                    width: img.width,
                    height: img.height,
                    colorAnalysis: {
                        dominantColors: ['black', 'white'] // Simplified
                    }
                })
            }

            img.onerror = () => reject(new Error('Failed to load image'))
        }

        reader.onerror = () => reject(new Error('Failed to read file'))
        reader.readAsDataURL(file)
    })
}

/**
 * Get all categories for selection
 */
export function getAllCategories(): Category[] {
    return CATEGORIES
}

/**
 * Get category by ID
 */
export function getCategoryById(id: number): Category | undefined {
    return CATEGORIES.find(c => c.id === id)
}

/**
 * Get subcategory by ID
 */
export function getSubcategoryById(categoryId: number, subcategoryId: number): Subcategory | undefined {
    const category = getCategoryById(categoryId)
    return category?.subcategories?.find(s => s.id === subcategoryId)
}

/**
 * Quick category detection from title only
 */
export function quickCategoryFromTitle(title: string): CategoryMatch | null {
    const textAnalysis = analyzeTextForCategory({ title })
    const scores = calculateCategoryScores(
        { objects: [], dominant_colors: [], has_text: true },
        textAnalysis
    )

    if (scores.size === 0) return null

    const matches = getCategoryMatches(scores)
    return matches[0] || null
}
