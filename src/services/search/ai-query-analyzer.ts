/**
 * AI QUERY ANALYZER
 * 
 * Intelligent query understanding:
 * - Spelling correction (Thai + English)
 * - Entity extraction (brand, price, location)
 * - Intent detection
 * - Auto-filter suggestion
 */

// Brand dictionaries for detection
const BRAND_KEYWORDS: Record<string, { category: string, aliases: string[] }> = {
    // Electronics - Mobile
    'apple': { category: 'mobile', aliases: ['แอปเปิ้ล', 'ไอโฟน', 'iphone', 'ipad', 'mac', 'macbook', 'airpods'] },
    'samsung': { category: 'mobile', aliases: ['ซัมซุง', 'galaxy', 'note', 'fold', 'flip'] },
    'xiaomi': { category: 'mobile', aliases: ['เสี่ยวหมี่', 'mi', 'redmi', 'poco'] },
    'oppo': { category: 'mobile', aliases: ['ออปโป้'] },
    'vivo': { category: 'mobile', aliases: ['วีโว่'] },
    'huawei': { category: 'mobile', aliases: ['หัวเว่ย'] },
    'realme': { category: 'mobile', aliases: ['เรียวมี'] },

    // Electronics - Gaming
    'sony': { category: 'gaming', aliases: ['โซนี่', 'playstation', 'ps5', 'ps4', 'ps3'] },
    'nintendo': { category: 'gaming', aliases: ['นินเทนโด้', 'switch'] },
    'xbox': { category: 'gaming', aliases: ['เอ็กซ์บ็อกซ์'] },

    // Electronics - Camera
    'canon': { category: 'camera', aliases: ['แคนนอน', 'eos'] },
    'nikon': { category: 'camera', aliases: ['นิคอน'] },
    'fujifilm': { category: 'camera', aliases: ['ฟูจิ', 'fuji', 'x-t', 'x100'] },
    'sony_camera': { category: 'camera', aliases: ['โซนี่', 'alpha', 'a7'] },

    // Automotive - Cars
    'toyota': { category: 'car', aliases: ['โตโยต้า', 'camry', 'corolla', 'yaris', 'vios', 'fortuner', 'hilux'] },
    'honda': { category: 'car', aliases: ['ฮอนด้า', 'civic', 'accord', 'city', 'jazz', 'hr-v', 'cr-v'] },
    'mazda': { category: 'car', aliases: ['มาสด้า', 'cx-3', 'cx-5', 'cx-30'] },
    'nissan': { category: 'car', aliases: ['นิสสัน', 'almera', 'kicks', 'navara'] },
    'mitsubishi': { category: 'car', aliases: ['มิตซูบิชิ', 'pajero', 'triton', 'xpander'] },
    'ford': { category: 'car', aliases: ['ฟอร์ด', 'ranger', 'everest'] },
    'isuzu': { category: 'car', aliases: ['อีซูซุ', 'd-max', 'mu-x'] },
    'mg': { category: 'car', aliases: ['เอ็มจี', 'zs', 'hs'] },
    'bmw': { category: 'car', aliases: ['บีเอ็มดับเบิลยู'] },
    'mercedes': { category: 'car', aliases: ['เบนซ์', 'benz', 'เมอร์เซเดส'] },
    'lexus': { category: 'car', aliases: ['เล็กซัส'] },

    // Automotive - Motorcycles
    'honda_motorcycle': { category: 'motorcycle', aliases: ['ฮอนด้า', 'wave', 'click', 'pcx', 'adv', 'forza', 'cbr'] },
    'yamaha': { category: 'motorcycle', aliases: ['ยามาฮ่า', 'fino', 'grand', 'mt', 'xmax', 'r1', 'r6'] },
    'kawasaki': { category: 'motorcycle', aliases: ['คาวาซากิ', 'ninja', 'z'] },
    'suzuki': { category: 'motorcycle', aliases: ['ซูซูกิ', 'gsx'] },
    'vespa': { category: 'motorcycle', aliases: ['เวสป้า'] },
    'harley': { category: 'motorcycle', aliases: ['ฮาร์เลย์', 'harley-davidson'] },
    'ducati': { category: 'motorcycle', aliases: ['ดูคาติ'] },
    'bmw_motorcycle': { category: 'motorcycle', aliases: ['บีเอ็มดับเบิลยู motorrad'] },

    // Fashion
    'nike': { category: 'fashion', aliases: ['ไนกี้', 'air jordan', 'dunk', 'air force'] },
    'adidas': { category: 'fashion', aliases: ['อาดิดาส', 'yeezy', 'ultraboost'] },
    'converse': { category: 'fashion', aliases: ['คอนเวิร์ส', 'chuck'] },
    'vans': { category: 'fashion', aliases: ['แวนส์', 'old skool'] },
    'uniqlo': { category: 'fashion', aliases: ['ยูนิโคล่'] },
    'h&m': { category: 'fashion', aliases: ['เอชแอนด์เอ็ม', 'hm'] },
    'zara': { category: 'fashion', aliases: ['ซาร่า'] },
    'gucci': { category: 'fashion', aliases: ['กุชชี่'] },
    'louis vuitton': { category: 'fashion', aliases: ['หลุยส์', 'lv'] },
    'chanel': { category: 'fashion', aliases: ['ชาแนล'] },
}

// Spelling corrections (common mistakes)
const SPELLING_CORRECTIONS: Record<string, string> = {
    // English typos
    'iphne': 'iphone',
    'ipone': 'iphone',
    'iphon': 'iphone',
    'samsug': 'samsung',
    'samsun': 'samsung',
    'samung': 'samsung',
    'macbok': 'macbook',
    'playstaion': 'playstation',
    'nintedo': 'nintendo',
    'airpod': 'airpods',

    // Thai typos
    'ไอโพน': 'ไอโฟน',
    'ไอโฟ': 'ไอโฟน',
    'แอปเปิล': 'apple',
    'โตโยตา': 'โตโยต้า',
    'ฮอนด้': 'ฮอนด้า',
    'ซัมซุ': 'ซัมซุง',
    'มาสด้': 'มาสด้า',
    'นิสสั': 'นิสสัน',
}

export interface QueryEntity {
    brand?: string
    brandCategory?: string
    model?: string
    priceRange?: {
        min?: number
        max?: number
        mentioned?: string
    }
    location?: string
    condition?: 'new' | 'used' | 'any'
    category?: string
    year?: number
}

export interface QueryAnalysis {
    originalQuery: string
    correctedQuery: string
    didCorrect: boolean

    entities: QueryEntity

    intent: {
        type: 'product_search' | 'category_browse' | 'brand_search' | 'price_check' | 'comparison'
        confidence: number
    }

    suggestedFilters: {
        category_id?: number
        brand?: string
        min_price?: number
        max_price?: number
        condition?: string
        province?: string
    }

    expandedQueries: string[]
}

export class AIQueryAnalyzer {

    /**
     * Main analysis entry point
     */
    analyze(query: string): QueryAnalysis {
        const original = query.trim()

        // Step 1: Spelling correction
        const corrected = this.correctSpelling(original)
        const didCorrect = corrected !== original.toLowerCase()

        // Step 2: Entity extraction
        const entities = this.extractEntities(corrected)

        // Step 3: Intent detection
        const intent = this.detectIntent(corrected, entities)

        // Step 4: Suggest filters
        const suggestedFilters = this.suggestFilters(entities)

        // Step 5: Query expansion
        const expandedQueries = this.expandQuery(corrected, entities)

        return {
            originalQuery: original,
            correctedQuery: corrected,
            didCorrect,
            entities,
            intent,
            suggestedFilters,
            expandedQueries
        }
    }

    /**
     * Correct common spelling mistakes
     * Uses word boundaries to prevent partial matching issues
     */
    private correctSpelling(query: string): string {
        let corrected = query.toLowerCase().trim()

        // Apply known corrections with word boundary matching
        for (const [mistake, fix] of Object.entries(SPELLING_CORRECTIONS)) {
            // Skip if the query already contains the correct word
            if (corrected.includes(fix.toLowerCase())) {
                continue
            }

            // Use word boundary regex to avoid partial matches
            // Example: 'iphon' should match "iphon" but not affect "iphone"
            const regex = new RegExp(`\\b${mistake}\\b`, 'gi')
            corrected = corrected.replace(regex, fix)
        }

        return corrected
    }

    /**
     * Extract entities from query
     */
    private extractEntities(query: string): QueryEntity {
        const entities: QueryEntity = {}
        const lowerQuery = query.toLowerCase()

        // 1. Brand detection
        for (const [brand, info] of Object.entries(BRAND_KEYWORDS)) {
            const allTerms = [brand, ...info.aliases]
            for (const term of allTerms) {
                if (lowerQuery.includes(term.toLowerCase())) {
                    entities.brand = brand
                    entities.brandCategory = info.category
                    break
                }
            }
            if (entities.brand) break
        }

        // 2. Price extraction
        const pricePatterns = [
            // Thai patterns
            { regex: /ไม่เกิน\s*(\d+(?:,\d+)?(?:000)?)/i, type: 'max' },
            { regex: /ต่ำกว่า\s*(\d+(?:,\d+)?(?:000)?)/i, type: 'max' },
            { regex: /ราคา\s*(\d+(?:,\d+)?)\s*[-–]\s*(\d+(?:,\d+)?)/i, type: 'range' },
            { regex: /งบ\s*(\d+(?:,\d+)?(?:000)?)/i, type: 'max' },
            // English patterns
            { regex: /under\s*(\d+(?:,\d+)?(?:k)?)/i, type: 'max' },
            { regex: /below\s*(\d+(?:,\d+)?(?:k)?)/i, type: 'max' },
            { regex: /(\d+(?:,\d+)?)\s*[-–to]\s*(\d+(?:,\d+)?)/i, type: 'range' },
            { regex: /budget\s*(\d+(?:,\d+)?(?:k)?)/i, type: 'max' },
        ]

        for (const pattern of pricePatterns) {
            const match = query.match(pattern.regex)
            if (match) {
                const parsePrice = (s: string): number => {
                    let num = parseInt(s.replace(/,/g, ''))
                    if (s.toLowerCase().includes('k')) num *= 1000
                    return num
                }

                if (pattern.type === 'max') {
                    entities.priceRange = {
                        max: parsePrice(match[1]),
                        mentioned: match[0]
                    }
                } else if (pattern.type === 'range') {
                    entities.priceRange = {
                        min: parsePrice(match[1]),
                        max: parsePrice(match[2]),
                        mentioned: match[0]
                    }
                }
                break
            }
        }

        // 3. Location detection
        const locations = [
            'กรุงเทพ', 'กทม', 'bangkok',
            'เชียงใหม่', 'chiangmai',
            'ภูเก็ต', 'phuket',
            'พัทยา', 'ชลบุรี', 'chonburi',
            'นนทบุรี', 'ปทุมธานี',
            'ใกล้ฉัน', 'near me', 'nearby'
        ]

        for (const loc of locations) {
            if (lowerQuery.includes(loc.toLowerCase())) {
                entities.location = loc === 'ใกล้ฉัน' || loc === 'near me' || loc === 'nearby'
                    ? 'nearby'
                    : loc
                break
            }
        }

        // 4. Condition detection
        const usedTerms = ['มือสอง', 'มือ2', 'secondhand', 'second hand', 'used', 'สภาพดี', 'มือ 2']
        const newTerms = ['มือหนึ่ง', 'มือ1', 'ใหม่', 'new', 'brand new', 'มือ 1', 'ของใหม่']

        for (const term of usedTerms) {
            if (lowerQuery.includes(term)) {
                entities.condition = 'used'
                break
            }
        }

        if (!entities.condition) {
            for (const term of newTerms) {
                if (lowerQuery.includes(term)) {
                    entities.condition = 'new'
                    break
                }
            }
        }

        // 5. Year detection (for vehicles)
        const yearMatch = query.match(/\b(19|20)\d{2}\b/)
        if (yearMatch) {
            const year = parseInt(yearMatch[0])
            if (year >= 1990 && year <= new Date().getFullYear() + 1) {
                entities.year = year
            }
        }

        // 6. Category hints
        const categoryHints: Record<string, string[]> = {
            'car': ['รถยนต์', 'รถเก๋ง', 'รถกระบะ', 'รถ suv', 'car', 'sedan', 'pickup'],
            'motorcycle': ['มอเตอร์ไซค์', 'มอไซค์', 'บิ๊กไบค์', 'สกูตเตอร์', 'motorcycle', 'scooter'],
            'real_estate': ['บ้าน', 'คอนโด', 'ทาวน์โฮม', 'อพาร์ทเม้นท์', 'condo', 'house'],
            'mobile': ['มือถือ', 'โทรศัพท์', 'สมาร์ทโฟน', 'phone', 'smartphone'],
            'gaming': ['เกม', 'เครื่องเล่นเกม', 'game', 'gaming', 'console'],
            'camera': ['กล้อง', 'camera', 'lens', 'เลนส์'],
            'fashion': ['เสื้อผ้า', 'รองเท้า', 'กระเป๋า', 'นาฬิกา', 'clothes', 'shoes', 'bag', 'watch'],
        }

        for (const [category, hints] of Object.entries(categoryHints)) {
            for (const hint of hints) {
                if (lowerQuery.includes(hint)) {
                    entities.category = category
                    break
                }
            }
            if (entities.category) break
        }

        return entities
    }

    /**
     * Detect search intent
     */
    private detectIntent(query: string, entities: QueryEntity): QueryAnalysis['intent'] {
        const lowerQuery = query.toLowerCase()

        // Brand search - high intent for specific brand
        if (entities.brand && !entities.priceRange) {
            return { type: 'brand_search', confidence: 0.85 }
        }

        // Price check - comparing prices
        if (entities.priceRange || lowerQuery.includes('ราคา') || lowerQuery.includes('price')) {
            return { type: 'price_check', confidence: 0.8 }
        }

        // Comparison - looking to compare
        const comparisonTerms = ['เทียบ', 'compare', 'vs', 'หรือ', 'กับ', 'ดีกว่า', 'better']
        if (comparisonTerms.some(t => lowerQuery.includes(t))) {
            return { type: 'comparison', confidence: 0.75 }
        }

        // Category browse - general browsing
        if (entities.category && !entities.brand) {
            return { type: 'category_browse', confidence: 0.7 }
        }

        // Default: product search
        return { type: 'product_search', confidence: 0.6 }
    }

    /**
     * Suggest filters based on entities
     */
    private suggestFilters(entities: QueryEntity): QueryAnalysis['suggestedFilters'] {
        const filters: QueryAnalysis['suggestedFilters'] = {}

        // Category mapping - MUST match src/constants/categories.ts IDs
        const categoryMap: Record<string, number> = {
            'car': 1,          // ยานยนต์
            'motorcycle': 1,   // ยานยนต์
            'real_estate': 2,  // อสังหาริมทรัพย์
            'mobile': 3,       // มือถือและแท็บเล็ต
            'computer': 4,     // คอมพิวเตอร์และไอที
            'appliances': 5,   // เครื่องใช้ไฟฟ้า
            'fashion': 6,      // แฟชั่น
            'gaming': 7,       // เกมและแก็ดเจ็ต
            'camera': 8,       // กล้องถ่ายรูป
        }

        if (entities.category || entities.brandCategory) {
            filters.category_id = categoryMap[entities.category || entities.brandCategory!]
        }

        if (entities.brand) {
            filters.brand = entities.brand
        }

        if (entities.priceRange?.min) {
            filters.min_price = entities.priceRange.min
        }

        if (entities.priceRange?.max) {
            filters.max_price = entities.priceRange.max
        }

        if (entities.condition) {
            filters.condition = entities.condition
        }

        if (entities.location && entities.location !== 'nearby') {
            filters.province = entities.location
        }

        return filters
    }

    /**
     * Expand query with synonyms and related terms
     */
    private expandQuery(query: string, entities: QueryEntity): string[] {
        const expanded: string[] = [query]

        // Add brand aliases
        if (entities.brand) {
            const brandInfo = BRAND_KEYWORDS[entities.brand.toLowerCase()]
            if (brandInfo) {
                expanded.push(...brandInfo.aliases.slice(0, 2))
            }
        }

        // Add common variations
        if (entities.condition === 'used') {
            expanded.push(query.replace(/มือสอง|used|secondhand/gi, 'มือ2'))
        }

        return [...new Set(expanded)].slice(0, 5)
    }
}

// Singleton export
export const queryAnalyzer = new AIQueryAnalyzer()
