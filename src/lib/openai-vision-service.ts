/**
 * OpenAI Vision Service - Production-Ready
 * 🧠 HYBRID MODEL STRATEGY v2.0
 * 
 * Architecture:
 * - gpt-5-nano = สมองหลัก สำหรับงานที่ต้อง "เข้าใจภาพ + บริบท + ตลาด"
 * - gpt-4.1-nano = ตัวช่วยงานเชิงกฎ / งานหลังบ้าน (fallback/validation)
 * 
 * Features:
 * - Retry logic with exponential backoff
 * - Request timeout
 * - Robust JSON parsing
 * - Default values for missing fields
 * - Image validation
 * - Comprehensive error handling
 * - AI Spec Validation (Phase 2 Anti-Hallucination)
 * - Confidence-based fallback strategy
 */

import {
    quickValidateTitle,
    extractSpecsFromTitle,
    validateAIGeneratedSpec,
    type SpecValidationReport
} from './ai-spec-validator'

import {
    AI_MODELS,
    FULL_ANALYSIS_PROMPT,
    CONFIDENCE_THRESHOLDS,
    decideFallback,
    getModelForTask,
    EXPERIMENTAL_FEATURES,
    type AIModelType,
    type AIAnalysisResult
} from './ai-model-strategy'

import { TwoLayerVisionPipeline } from './two-layer-vision-pipeline'
import { detectScreenshot } from './screenshot-detector'

// ============================================
// CONFIGURATION - 2-LAYER PIPELINE STRATEGY
// ============================================
const CONFIG = {
    // 🔵 LAYER 1: Vision Model for Image Analysis
    // ✅ Uses new gpt-5-nano (vision-capable!) for max speed & efficiency
    VISION_MODEL: AI_MODELS.VISION,          // gpt-5-nano

    // 🟢 LAYER 2: Intelligence Model (not used here, handled by ai-pipeline)
    // INTELLIGENCE_MODEL: AI_MODELS.INTELLIGENCE, // gpt-5-nano

    // 🔄 Fallback Model for Vision
    VISION_FALLBACK: AI_MODELS.VISION_FALLBACK,  // gpt-4.1-mini

    // === MODEL CONFIGURATION (Switching to the Best Value Model) ===
    PRIMARY_MODEL: 'gpt-4o-mini', // 🚀 BEST VALUE: Fast, Cheap, & Reliable Vision
    UTILITY_MODEL: AI_MODELS.UTILITY,
    FALLBACK_MODEL: AI_MODELS.FALLBACK,

    // Config
    MAX_TOKENS: 4096, // Standard token limit (supported by mini)
    STRUCTURED_TOKENS: 25000,
    TEMPERATURE: 0.2, // (Unused for nano, but kept for fallback)
    DETAIL: 'auto' as const,

    // Retry settings
    MAX_RETRIES: 2,
    INITIAL_RETRY_DELAY_MS: 1000,

    // Image limits
    MAX_FILE_SIZE_MB: 10,
    ALLOWED_MIME_TYPES: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],

    // Timeout (Increased for gpt-5-nano reasoning)
    REQUEST_TIMEOUT_MS: 120000, // 2 minutes (was 30s)

    // Confidence thresholds
    CONFIDENCE: CONFIDENCE_THRESHOLDS,
}

// ============================================
// TYPES
// ============================================
export interface ProductAnalysis {
    title: string           // Primary title (Thai)
    description: string     // Primary description (Thai)

    // 🆕 BILINGUAL SUPPORT (v2.1) - Using saved tokens from price removal
    title_th?: string       // Thai title
    title_en?: string       // English title
    description_th?: string // Thai description  
    description_en?: string // English description
    sellingPoints_th?: string[]  // Thai selling points
    sellingPoints_en?: string[]  // English selling points

    // 🆕 Enhanced: Product Type
    productType?: string  // โน๊ตบุ๊ค, ทีวี, รถยนต์, etc.

    suggestedCategory: string
    suggestedSubcategory?: string
    keywords: string[]

    // Condition
    estimatedCondition: 'new' | 'like_new' | 'good' | 'fair' | 'used'
    conditionScore?: number      // 0-100
    conditionDetails?: string    // รายละเอียดสภาพ

    // 🆕 Selling Points (legacy - now prefer bilingual versions)
    sellingPoints?: string[]     // จุดขาย 1-3 ข้อ

    estimatedPrice: {
        min: number
        max: number
        suggested: number
    }
    detectedObjects: string[]
    detectedBrands: string[]

    // 🆕 Confidence Levels
    confidence?: {
        brand: number
        model: number
        specs: number
    }

    // 🆕 Notes/Warnings
    notes?: string[]

    isProhibited: boolean
    prohibitedReason?: string | null

    // Phase 2: Validation Results
    validation?: {
        isValid: boolean
        confidence: number
        warnings: string[]
        suggestedFixes: string[]
    }

    // Phase 3: Structured Specs for World-Class Description
    structuredSpecs?: Record<string, string>

    // 🆕 Phase 4: Title Enhancers for Smart Title Building
    titleEnhancers?: {
        sellerType?: string    // ขายเอง, ร้านค้า, ตัวแทน
        urgency?: string       // ขายด่วน, ราคาพิเศษ
        highlight?: string     // ไมล์น้อย, ไม่เคยล้ม
    }
}

// Default values for ProductAnalysis
const DEFAULT_ANALYSIS: ProductAnalysis = {
    title: 'สินค้า (กรุณาระบุชื่อ)',
    description: '',
    // Bilingual defaults
    title_th: '',
    title_en: '',
    description_th: '',
    description_en: '',
    sellingPoints_th: [],
    sellingPoints_en: [],
    productType: undefined,
    suggestedCategory: 'เบ็ดเตล็ด',
    suggestedSubcategory: undefined,
    keywords: [],
    estimatedCondition: 'good',
    conditionScore: 70,
    conditionDetails: '',
    sellingPoints: [],
    estimatedPrice: { min: 0, max: 0, suggested: 0 },
    detectedObjects: [],
    detectedBrands: [],
    confidence: { brand: 50, model: 50, specs: 50 },
    notes: [],
    isProhibited: false,
    prohibitedReason: null
}

// ============================================
// PROMPT TEMPLATE - JAIKOD THAI MARKETPLACE v3.0
// 🧠 สมองกลางระดับมืออาชีพ - ภาษาไทย 100%
// ============================================

/**
 * 🎯 AI TITLE GENERATION PHILOSOPHY:
 * 
 * 1. ชื่อสินค้าต้องเป็นภาษาไทย (ยกเว้นชื่อแบรนด์/รุ่น)
 * 2. กระชับ ได้ใจความ 40-80 ตัวอักษร
 * 3. ไม่โม้ ไม่เกินจริง ไม่ใช้อีโมจิ
 * 4. เน้น selling point สูงสุด 1-2 ข้อเท่านั้น
 * 5. Category-aware: แต่ละหมวดมีโครงสร้างเฉพาะ
 */

const ANALYSIS_PROMPT = `คุณคือผู้เชี่ยวชาญวิเคราะห์สินค้าสำหรับ JaiKod.com (ตลาดออนไลน์ไทย)

**🎯 งานหลัก:**
วิเคราะห์รูปสินค้าและสร้างข้อมูลลงขายที่น่าเชื่อถือ กระชับ และเป็นมืออาชีพ

**📋 ขั้นตอนการวิเคราะห์ (⚠️ ลำดับสำคัญ!):**

1. **🔍 อ่านโลโก้/ยี่ห้อก่อนเลย! (CRITICAL!)**
   - มองหาโลโก้ที่มุมจอ/ด้านหน้าเครื่อง/ฝาหลัง
   - โลโก้ทั่วไป: LG, Samsung, Sony, Panasonic, Sharp, TCL, Haier, Hisense
   - คอมพิวเตอร์: Acer, Asus, Dell, HP, Lenovo, MSI, Apple
   - ถ้าเห็น "LG" = LG เท่านั้น (ห้าม confuse กับ Samsung)
   - ถ้าเห็น curved screen + LG logo = "LG [รุ่น] จอโค้ง"

2. **อ่านข้อความ/Model Number ในภาพ** 
   - หาเลขรุ่น เช่น "55UK6300", "C1 OLED", "27GP850"
   - ถ้าไม่เห็นรุ่น ให้ระบบแค่ยี่ห้อและประเภท

3. **ระบุแบรนด์ รุ่น สเปค** - เฉพาะที่เห็นชัดเจน

4. **กำหนดหมวดหมู่** - ตามรายการด้านล่าง

5. **ประเมินสภาพ** - จากความเก่า/ใหม่ที่เห็น

6. **ตั้งชื่อสินค้าภาษาไทย** - ตามกฎด้านล่าง

**📦 หมวดหมู่หลัก:**
1. ยานยนต์: รถยนต์, มอเตอร์ไซค์, อะไหล่
2. อสังหาริมทรัพย์: บ้าน, คอนโด, ที่ดิน (❌ห้ามเดาชื่อสถานที่)
3. มือถือและแท็บเล็ต: โทรศัพท์, แท็บเล็ต, อุปกรณ์เสริม
4. คอมพิวเตอร์และไอที: โน๊ตบุ๊ค, คอมตั้งโต๊ะ, จอมอนิเตอร์, เมาส์, คีย์บอร์ด
5. เครื่องใช้ไฟฟ้า: ทีวี, ตู้เย็น, แอร์, เครื่องซักผ้า
6. แฟชั่น: เสื้อผ้า, กระเป๋า, นาฬิกา, รองเท้า
7. เกมและแก็ดเจ็ต: เครื่องเล่นเกม, เกม, อุปกรณ์เกมมิ่ง
8. กล้องถ่ายรูป: กล้องดิจิตอล, เลนส์, โดรน
9. พระเครื่องและของสะสม: อ่านข้อความบนพระให้ชัด
10. สัตว์เลี้ยง: ระบุสายพันธุ์, อายุ
11. บริการ
12. กีฬาและท่องเที่ยว
13. บ้านและสวน
14. เครื่องสำอางและความงาม
15. เด็กและทารก
16. หนังสือและการศึกษา
17. เบ็ดเตล็ด

**🚫 ข้อห้ามเด็ดขาด:**
- ❌ ห้ามเดาสเปค/ปี/แบรนด์ที่ไม่เห็นชัด
- ❌ ห้ามใส่ชื่อสถานที่สำหรับอสังหาฯ ถ้าไม่เห็นในภาพ
- ❌ ห้ามใส่ราคาในชื่อสินค้า
- ❌ ห้ามใช้คำโม้เกินจริง เช่น "สุดยอด", "เทพ", "ดีที่สุด"
- ❌ ห้ามใช้อีโมจิหรือสัญลักษณ์พิเศษในชื่อ

**🖥️ กฎพิเศษ - แยก Monitor vs TV (สำคัญ!):**

📺 **ถ้าเป็นทีวี:**
- อยู่ห่างจากกำแพง/บนตู้ทีวี
- มีรีโมททีวี/Soundbar
- ไม่มีคีย์บอร์ด/เมาส์ใกล้ๆ
- suggestedCategory = "เครื่องใช้ไฟฟ้า"
- suggestedSubcategory = "ทีวี/เครื่องเสียง"

🖥️ **ถ้าเป็นจอคอมพิวเตอร์:**
- อยู่บนโต๊ะทำงาน/มีคีย์บอร์ด
- แสดง CODE/Terminal/IDE/Game interface
- มีขาตั้งจอ/แขนจับจอ
- โค้งสำหรับ gaming (curved monitor)
- suggestedCategory = "คอมพิวเตอร์และไอที"
- suggestedSubcategory = "จอคอมพิวเตอร์"

🔥 ตัวอย่าง: LG จอโค้งบนโต๊ะ + คีย์บอร์ด = "จอมอนิเตอร์ LG โค้ง สภาพดี"

**📝 กฎการตั้งชื่อสินค้า (สำคัญมาก!):**

⚡ โครงสร้างชื่อตามหมวดหมู่:

🔹 มือถือ/แท็บเล็ต/คอม:
"[แบรนด์] [รุ่น] [ความจุ] [สภาพ]"
ตัวอย่าง: "iPhone 13 Pro Max 256GB สภาพดี", "Samsung Galaxy S21 128GB มือสอง"

🔹 ยานยนต์:
"[ยี่ห้อ] [รุ่น] [ปี] [จุดเด่น]"
ตัวอย่าง: "Toyota Altis 2020 ไมล์น้อย ขายเอง", "Honda Wave 110i สภาพดี"

🔹 อสังหาริมทรัพย์:
"[ประเภท] [จุดเด่น] [พื้นที่ใช้สอย/ห้องนอน]"
ตัวอย่าง: "คอนโด 1 ห้องนอน ตกแต่งครบ พร้อมอยู่", "บ้านเดี่ยว 3 นอน หมู่บ้านจัดสรร"
❌ ห้ามเดาชื่อ BTS/ถนน/เขต ถ้าไม่เห็นในภาพ

🔹 เครื่องใช้ไฟฟ้า:  
"[ประเภท] [แบรนด์] [ขนาด/รุ่น] [สภาพ]"
ตัวอย่าง: "ทีวี Samsung 55 นิ้ว 4K สภาพดี", "แอร์ Daikin Inverter 12000 BTU"

🔹 แฟชั่น:
"[ประเภท] [แบรนด์] [รายละเอียด] [สภาพ]"
ตัวอย่าง: "กระเป๋า Louis Vuitton รุ่น Neverfull ของแท้", "รองเท้า Nike Air Max สีขาว เบอร์ 42"

🔹 ทั่วไป:
"[ประเภทสินค้า] [แบรนด์/รุ่น] [จุดเด่น 1-2 อย่าง]"

**⚠️ กฎสภาพสินค้า:**
- new = ใหม่ (ยังไม่แกะกล่อง/มีแท็กติด)
- like_new = สภาพดีมาก (แทบไม่ได้ใช้)
- good = มือสอง สภาพดี (ใช้งานปกติ)
- fair = มือสอง ใช้งานได้ (มีรอย/ตำหนิ)
- used = มือสอง (สภาพทั่วไป)

**📊 รูปแบบคำตอบ (JSON) - BILINGUAL v2.2:**
{
  "title": "ชื่อสินค้าภาษาไทย (40-80 ตัวอักษร, ไม่มีอีโมจิ)",
  "description": "คำอธิบายภาษาไทยสั้นๆ 2-3 ประโยค",
  
  "title_th": "ชื่อสินค้าภาษาไทย (เหมือน title)",
  "title_en": "English product title (40-80 characters, no emoji)",
  "description_th": "คำอธิบายภาษาไทย 2-3 ประโยค เน้น selling point",
  "description_en": "English description 2-3 sentences, focus on selling points",
  "sellingPoints_th": ["จุดขาย 1", "จุดขาย 2", "จุดขาย 3"],
  "sellingPoints_en": ["Selling point 1", "Selling point 2", "Selling point 3"],
  
  "productType": "ประเภทสินค้า (โน๊ตบุ๊ค/ทีวี/รถยนต์/มือถือ/จอมอนิเตอร์)",
  
  "suggestedCategory": "ชื่อหมวดหมู่ภาษาไทย",
  "suggestedSubcategory": "ชื่อหมวดหมู่ย่อยภาษาไทย",
  
  "keywords": ["keyword1", "keyword2", "keyword3"],
  
  "estimatedCondition": "new|like_new|good|fair|used",
  "conditionScore": 0-100,
  "conditionDetails": "รายละเอียดสภาพ เช่น มีรอยขีดข่วนเล็กน้อย",
  
  "sellingPoints": ["จุดขายหลัก 1-3 ข้อ (legacy)"],
  
  "detectedObjects": ["สิ่งที่เห็นในภาพ"],
  "detectedBrands": ["แบรนด์ที่เห็น"],
  
  "structuredSpecs": {
    // ✅ CORE SPECS (ทุกหมวด)
    "brand": "แบรนด์ (Honda, Toyota, Samsung, Apple, etc.)",
    "model": "รุ่น (PCX, Altis, Galaxy S21, iPhone 15, etc.)",
    "year": "ปี (2021, 2022, 2023)",
    "color": "สี (ขาว, ดำ, แดง, เทา, น้ำเงิน)",
    
    // ✅ VEHICLE SPECS (ยานยนต์/มอเตอร์ไซค์)
    "cc": "ขนาดเครื่องยนต์ (เช่น 160cc, 300cc, 1500cc)",
    "mileage": "ระยะทาง กม. (เช่น 5000, 15000)",
    "fuel": "เชื้อเพลิง (เบนซิน, ดีเซล, ไฟฟ้า, ไฮบริด)",
    "transmission": "เกียร์ (ออโต้, ธรรมดา)",
    "taxStatus": "ภาษี (เต็ม, ใกล้หมด, หมดแล้ว)",
    "bookStatus": "สมุดเล่ม (เล่มเดิม, เล่มแดง)",
    "ownerCount": "เจ้าของ (มือ 1, มือ 2, มือ 3+)",
    "accidentHistory": "ประวัติอุบัติเหตุ (ไม่เคย, เคยซ่อม)",
    
    // ✅ MOBILE/TECH SPECS (มือถือ/คอม)
    "storage": "ความจุ (64GB, 128GB, 256GB, 512GB, 1TB)",
    "ram": "RAM (4GB, 8GB, 16GB, 32GB)",
    "screen": "หน้าจอ (6.1 นิ้ว, 15.6 นิ้ว, 27 นิ้ว)",
    "cpu": "CPU (M2, i5, i7, Ryzen 5)",
    "batteryHealth": "สุขภาพแบต % (85%, 92%, 100%)",
    "warranty": "ประกัน (เหลือ 6 เดือน, หมดแล้ว)",
    
    // ✅ REAL ESTATE SPECS (อสังหา)
    "bedrooms": "ห้องนอน (1, 2, 3)",
    "bathrooms": "ห้องน้ำ (1, 2)",
    "sqm": "ตร.ม. (25, 35, 150)",
    "floor": "ชั้น (5, 12, 25)",
    "furnishing": "เฟอร์ฯ (ครบ, บางส่วน, ไม่มี)"
  },
  
  "titleEnhancers": {
    "sellerType": "ขายเอง|ร้านค้า|ตัวแทน",
    "urgency": "ขายด่วน|ราคาพิเศษ|ลดราคา",
    "highlight": "ไมล์น้อย|สภาพป้ายแดง|ไม่เคยล้ม|ไม่เคยชน|ประหยัดน้ำมัน"
  },
  
  "confidence": {
    "brand": 0-100,
    "model": 0-100,
    "specs": 0-100
  },
  
  "notes": ["หมายเหตุ/คำเตือน ถ้ามี เช่น 'ไม่เห็นรุ่นชัด' หรือ 'ควรระบุปีรถ'"],
  
  "isProhibited": false,
  "prohibitedReason": null
}

**⚠️ หมายเหตุสำคัญ:**
- ถ้าไม่แน่ใจค่าใด → ใส่ confidence ต่ำ + ใส่ notes
- suggestedCategory ต้องเป็นภาษาไทยเท่านั้น
- title ต้องเป็นภาษาไทย (ยกเว้นชื่อแบรนด์/รุ่น)
- ถ้าภาพไม่ชัด/ไม่ใช่สินค้า → suggestedCategory: "เบ็ดเตล็ด", title: "สินค้า (กรุณาระบุรายละเอียด)"
- productType สำคัญมาก! ต้องระบุให้ชัด เช่น "โน๊ตบุ๊ค", "ทีวี", "จอมอนิเตอร์"
- ❌ ไม่ต้องประเมินราคา (ผู้ขายจะกรอกเอง)`



// ============================================
// MAIN SERVICE CLASS
// ============================================
export class OpenAIVisionService {
    private apiKey: string
    private baseURL = 'https://api.openai.com/v1'

    constructor(apiKey?: string) {
        // 🔐 SECURITY: Use environment variable
        this.apiKey = apiKey || process.env.NEXT_PUBLIC_OPENAI_API_KEY || ''

        if (!this.apiKey) {
            console.warn('⚠️ OpenAI API Key not found. Set NEXT_PUBLIC_OPENAI_API_KEY in .env.local')
        }
    }

    /**
     * Analyze product image with GPT-4o-mini
     * Includes retry logic and robust error handling
     */
    async analyzeImage(imageFile: File): Promise<ProductAnalysis> {
        // 🧪 EXPERIMENTAL: Use 1.5-Layer Pipeline if enabled
        if (EXPERIMENTAL_FEATURES.USE_TWO_LAYER_VISION) {
            console.log('🧪 [EXPERIMENTAL] Using 1.5-Layer Vision Pipeline (gpt-4o-mini → gpt-5-nano)')
            try {
                const twoLayerPipeline = new TwoLayerVisionPipeline(this.apiKey)
                const result = await twoLayerPipeline.analyzeImage(imageFile)

                // Convert partial result to full ProductAnalysis
                return {
                    ...DEFAULT_ANALYSIS,
                    ...result
                } as ProductAnalysis
            } catch (error) {
                console.warn('⚠️ [EXPERIMENTAL] Two-Layer Pipeline failed, falling back to standard pipeline:', error)
                // Fall through to standard pipeline
            }
        }

        // Standard 1-Layer Pipeline (gpt-4o-mini)
        console.log('🔵 [STANDARD] Using Single-Layer Pipeline (gpt-4o-mini)')

        // 🚫 PRE-SCREENING: Reject screenshots before wasting API calls
        console.log('🔍 [PRE-SCREEN] Checking if image is a screenshot...')
        const screenshotCheck = await detectScreenshot(imageFile)

        if (screenshotCheck.isScreenshot) {
            console.warn('🚫 [PRE-SCREEN] Screenshot detected! Rejecting analysis.')
            console.warn('📋 Reasons:', screenshotCheck.reasons)

            return {
                ...DEFAULT_ANALYSIS,
                title: 'Unknown Item (Screenshot/Desktop Capture)',
                description: 'This appears to be a screenshot or desktop capture, not a product photo. Please upload an actual product image.',
                suggestedCategory: 'Others',
                isProhibited: true,
                prohibitedReason: `Screenshot detected (${screenshotCheck.confidence}% confidence): ${screenshotCheck.reasons.join(', ')}`,
                validation: {
                    isValid: false,
                    confidence: screenshotCheck.confidence,
                    warnings: screenshotCheck.reasons,
                    suggestedFixes: ['Please upload a photo of the actual product', 'Avoid screenshots or desktop captures']
                }
            }
        }

        console.log('✅ [PRE-SCREEN] Image is likely a product photo. Proceeding to AI analysis.')

        // Validate image before processing
        this.validateImage(imageFile)

        let lastError: Error | null = null

        for (let attempt = 0; attempt <= CONFIG.MAX_RETRIES; attempt++) {
            try {
                if (attempt > 0) {
                    const delay = CONFIG.INITIAL_RETRY_DELAY_MS * Math.pow(2, attempt - 1)
                    console.log(`🔄 Retry attempt ${attempt}/${CONFIG.MAX_RETRIES} after ${delay}ms...`)
                    await this.sleep(delay)
                }

                return await this.performAnalysis(imageFile)

            } catch (error: any) {
                lastError = error
                console.warn(`⚠️ Attempt ${attempt + 1} failed:`, error.message)

                // Don't retry on certain errors
                if (this.isNonRetryableError(error)) {
                    break
                }
            }
        }

        console.error('❌ All retry attempts failed')
        throw lastError || new Error('Unknown error during image analysis')
    }

    /**
     * Perform the actual API call
     */
    private async performAnalysis(imageFile: File): Promise<ProductAnalysis> {
        const base64Image = await this.fileToBase64(imageFile)

        // Create abort controller for timeout
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), CONFIG.REQUEST_TIMEOUT_MS)

        try {
            // 🔵 LAYER 1: Use Vision model for image analysis
            const modelToUse = CONFIG.PRIMARY_MODEL // gpt-4o-mini
            console.log(`🔵 [Layer1] Using model: ${modelToUse} for Vision Analysis`)

            // ⚠️ DEBUG: Log prompt to verify it's using the latest version
            console.log(`📝 [DEBUG] Prompt Preview (first 200 chars):`, ANALYSIS_PROMPT.substring(0, 200))

            // ⚠️ SPECIAL HANDLING FOR GPT-5-NANO (if used in future):
            // It prefers all instructions in the "user" role to reason effectively.
            // But for gpt-4o-mini, standard approach is fine.
            // We use the full user prompt approach for consistency and best results.

            const payload: any = {
                model: modelToUse,
                messages: [
                    {
                        role: "user",
                        content: [
                            { type: "text", text: ANALYSIS_PROMPT },
                            {
                                type: "image_url",
                                image_url: {
                                    url: `data:${imageFile.type};base64,${base64Image}`,
                                    detail: CONFIG.DETAIL
                                }
                            },
                        ],
                    },
                ],
                // Standard OpenAI Parameters
                max_tokens: CONFIG.MAX_TOKENS,
                temperature: CONFIG.TEMPERATURE,
                response_format: { type: "json_object" },
            };

            const response = await fetch(`${this.baseURL}/chat/completions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.apiKey}`
                },
                signal: controller.signal,
                body: JSON.stringify(payload)
            })

            clearTimeout(timeoutId)

            if (!response.ok) {
                const error = await response.json().catch(() => ({}))
                throw new Error(`OpenAI API Error: ${error.error?.message || response.statusText}`)
            }

            const data = await response.json()
            const content = data.choices?.[0]?.message?.content

            if (!content) {
                console.error('❌ Empty content received. Full API Response:', JSON.stringify(data, null, 2))
                throw new Error('Empty response from OpenAI (See console for details)')
            }

            return this.parseAndValidateResponse(content)

        } finally {
            clearTimeout(timeoutId)
        }
    }

    /**
     * Parse and validate OpenAI response
     * Returns default values for missing fields
     */
    private parseAndValidateResponse(content: string): ProductAnalysis {
        // Try to extract JSON from response
        let jsonMatch = content.match(/\{[\s\S]*\}/)
        if (!jsonMatch) {
            console.warn('⚠️ No JSON found in response, using defaults')
            return { ...DEFAULT_ANALYSIS }
        }

        try {
            // ✅ Sanitize JSON: Replace Thai text in numeric fields with 0
            let jsonString = jsonMatch[0]

            // Fix common AI mistakes where Thai text is used instead of numbers
            // Pattern: "fieldName": ภาษาไทย, or "fieldName": ภาษาไทย}
            jsonString = jsonString.replace(
                /"(min|max|suggested)"\s*:\s*([ก-๛\s]+)([,}])/g,
                '"$1": 0$3'
            )

            // Also handle cases like: "min": ราคาต่ำสุด (without quotes)
            jsonString = jsonString.replace(
                /:\s*ราคาต่ำสุด/g, ': 0'
            ).replace(
                /:\s*ราคาสูงสุด/g, ': 0'
            ).replace(
                /:\s*ราคาแนะนำ/g, ': 0'
            )

            const parsed = JSON.parse(jsonString)

            // Merge with defaults to ensure all fields exist
            const result: ProductAnalysis = {
                title: parsed.title || DEFAULT_ANALYSIS.title,
                description: parsed.description || DEFAULT_ANALYSIS.description,

                // 🆕 BILINGUAL CONTENT (v2.2)
                title_th: parsed.title_th || parsed.title || '',
                title_en: parsed.title_en || '',
                description_th: parsed.description_th || parsed.description || '',
                description_en: parsed.description_en || '',
                sellingPoints_th: Array.isArray(parsed.sellingPoints_th) ? parsed.sellingPoints_th : [],
                sellingPoints_en: Array.isArray(parsed.sellingPoints_en) ? parsed.sellingPoints_en : [],

                suggestedCategory: parsed.suggestedCategory || DEFAULT_ANALYSIS.suggestedCategory,
                suggestedSubcategory: parsed.suggestedSubcategory,
                keywords: Array.isArray(parsed.keywords) ? parsed.keywords : [],
                estimatedCondition: this.validateCondition(parsed.estimatedCondition),
                estimatedPrice: {
                    min: Number(parsed.estimatedPrice?.min) || 0,
                    max: Number(parsed.estimatedPrice?.max) || 0,
                    suggested: Number(parsed.estimatedPrice?.suggested) || 0
                },
                detectedObjects: Array.isArray(parsed.detectedObjects) ? parsed.detectedObjects : [],
                detectedBrands: Array.isArray(parsed.detectedBrands) ? parsed.detectedBrands : [],
                isProhibited: Boolean(parsed.isProhibited),
                prohibitedReason: parsed.prohibitedReason || null,
                // ✅ NEW: Extract structured specs (brand, model, year, color, etc.)
                structuredSpecs: this.cleanStructuredSpecs(parsed.structuredSpecs || {})
            }

            console.log('✅ OpenAI Vision Analysis Success!')
            console.log('🧠 Model used:', CONFIG.PRIMARY_MODEL)
            console.log('📝 Title (TH):', result.title_th)
            console.log('📝 Title (EN):', result.title_en)
            console.log('📁 Category:', result.suggestedCategory)
            console.log('📂 Subcategory:', result.suggestedSubcategory)
            console.log('🌐 Bilingual:', !!result.title_en ? 'Yes' : 'No')
            console.log('🚗 structuredSpecs:', result.structuredSpecs)

            // === Phase 2: AI Spec Validation ===
            const validationResult = this.validateGeneratedSpecs(result)
            result.validation = validationResult

            if (!validationResult.isValid) {
                console.warn('⚠️ AI Validation Warnings:', validationResult.warnings)
            }
            console.log(`🔍 Validation Confidence: ${validationResult.confidence}%`)

            return result

        } catch (parseError) {
            console.error('❌ JSON Parse Error:', parseError)
            console.log('📄 Raw content:', content.substring(0, 500))
            return { ...DEFAULT_ANALYSIS }
        }
    }

    /**
     * Validate condition value
     */
    private validateCondition(condition: string): ProductAnalysis['estimatedCondition'] {
        const validConditions = ['new', 'like_new', 'good', 'fair', 'used'] as const

        // ⚠️ FIX: Map 'used' to 'good' immediately
        // 'used' causes issues in Automotive/Mobile specific options which don't have 'used' key
        // but have 'good' (used, normal wear)
        if (condition === 'used') {
            return 'good'
        }

        if (validConditions.includes(condition as any)) {
            return condition as ProductAnalysis['estimatedCondition']
        }
        return 'good'
    }

    /**
     * Clean structured specs - remove placeholder values from OpenAI
     */
    private cleanStructuredSpecs(specs: Record<string, string>): Record<string, string> {
        const cleaned: Record<string, string> = {}

        // Placeholder patterns to filter out
        const placeholderPatterns = [
            /ถ้าเห็น/,           // "(ถ้าเห็น)"
            /ถ้าระบุ/,           // "(ถ้าระบุในภาพ)"
            /สำหรับ/,            // "(สำหรับคอมพิวเตอร์)"
            /ไม่ระบุ/,           // "ไม่ระบุ"
            /^null$/i,           // "null"
            /^undefined$/i,      // "undefined"
            /^N\/A$/i,           // "N/A"
            /^-$/,               // "-"
            /^$/,                // empty string
        ]

        for (const [key, value] of Object.entries(specs)) {
            if (!value || typeof value !== 'string') continue

            const trimmedValue = value.trim()

            // Skip if matches any placeholder pattern
            const isPlaceholder = placeholderPatterns.some(pattern => pattern.test(trimmedValue))
            if (isPlaceholder) continue

            // Skip if value is too generic
            if (trimmedValue.length < 1 || trimmedValue.length > 100) continue

            cleaned[key] = trimmedValue
        }

        console.log('🔍 Cleaned structuredSpecs:', cleaned)
        return cleaned
    }

    /**
     * Phase 2: Validate AI-generated specs to prevent hallucination
     */
    private validateGeneratedSpecs(result: ProductAnalysis): {
        isValid: boolean
        confidence: number
        warnings: string[]
        suggestedFixes: string[]
    } {
        // Extract specs from title for validation
        const specs = extractSpecsFromTitle(result.title)

        // Run full validation
        const report = validateAIGeneratedSpec({
            title: result.title,
            suggestedPrice: result.estimatedPrice.suggested,
            specs
        })

        // Collect warnings from failed validations
        const warnings = report.validations
            .filter(v => !v.isValid)
            .map(v => v.reason)

        return {
            isValid: report.overallConfidence >= 70,
            confidence: report.overallConfidence,
            warnings,
            suggestedFixes: report.suggestedFixes
        }
    }


    /**
     * Validate image before processing
     */
    private validateImage(file: File): void {
        // Check file type
        if (!CONFIG.ALLOWED_MIME_TYPES.includes(file.type)) {
            throw new Error(`Invalid file type: ${file.type}. Allowed: ${CONFIG.ALLOWED_MIME_TYPES.join(', ')}`)
        }

        // Check file size
        const sizeMB = file.size / (1024 * 1024)
        if (sizeMB > CONFIG.MAX_FILE_SIZE_MB) {
            throw new Error(`File too large: ${sizeMB.toFixed(1)}MB. Max: ${CONFIG.MAX_FILE_SIZE_MB}MB`)
        }
    }

    /**
     * Check if error should not be retried
     */
    private isNonRetryableError(error: any): boolean {
        const message = error.message?.toLowerCase() || ''

        // Don't retry these errors
        return (
            message.includes('invalid api key') ||
            message.includes('unauthorized') ||
            message.includes('invalid file type') ||
            message.includes('file too large') ||
            message.includes('content policy')
        )
    }

    /**
     * Convert File to base64
     */
    private async fileToBase64(file: File): Promise<string> {
        return new Promise((resolve, reject) => {
            const reader = new FileReader()
            reader.onload = () => {
                const base64 = (reader.result as string).split(',')[1]
                resolve(base64)
            }
            reader.onerror = () => reject(new Error('Failed to read file'))
            reader.readAsDataURL(file)
        })
    }

    /**
     * Sleep utility for retry delays
     */
    private sleep(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms))
    }

    /**
     * Map category name to ID
     * ⚠️ CRITICAL: Must match CATEGORIES constant in constants/categories.ts
     */
    mapCategoryToId(categoryName: string): number {
        const map: Record<string, number> = {
            // Main Categories (Thai)
            'ยานยนต์': 1,
            'อสังหาริมทรัพย์': 2,
            'มือถือและแท็บเล็ต': 3,
            'คอมพิวเตอร์และไอที': 4,
            'เครื่องใช้ไฟฟ้า': 5,
            'แฟชั่น': 6,
            'เกมและแก็ดเจ็ต': 7,
            'กล้องถ่ายรูป': 8,
            'พระเครื่องและของสะสม': 9,
            'สัตว์เลี้ยง': 10,
            'บริการ': 11,
            'กีฬาและท่องเที่ยว': 12,
            'บ้านและสวน': 13,
            'เครื่องสำอางและความงาม': 14,
            'เด็กและทารก': 15,
            'หนังสือและการศึกษา': 16,
            'เบ็ดเตล็ด': 99,

            // Thai Aliases
            'อิเล็กทรอนิกส์': 4,
            'งานอดิเรก': 12,
            'ความงาม': 14,
            'พระเครื่อง': 9,
            'นาฬิกา': 6,
            'โทรศัพท์': 3,
            'มือถือ': 3,
            'คอมพิวเตอร์': 4,
            'รถยนต์': 1,
            'รถมอเตอร์ไซค์': 1,
            'บ้าน': 2,
            'คอนโด': 2,
            'ที่ดิน': 2,

            // English Fallback Aliases
            'automotive': 1,
            'real estate': 2,
            'mobile/tablet': 3,
            'mobile': 3,
            'phone': 3,
            'computer/it': 4,
            'computer': 4,
            'laptop': 4,
            'appliances': 5,
            'fashion': 6,
            'gaming': 7,
            'camera': 8,
            'amulets': 9,
            'collectibles': 9,
            'pets': 10,
            'services': 11,
            'sports': 12,
            'home/garden': 13,
            'beauty': 14,
            'kids': 15,
            'books': 16,
            'others': 99,

            // 🔥 CRITICAL: Appliance Thai Aliases (Category 5)
            'ทีวี': 5,
            'โทรทัศน์': 5,
            'ตู้เย็น': 5,
            'แอร์': 5,
            'เครื่องปรับอากาศ': 5,
            'เครื่องซักผ้า': 5,
            'พัดลม': 5,
            'เครื่องฟอกอากาศ': 5,
            'เครื่องดูดฝุ่น': 5,
            'หม้อหุงข้าว': 5,
            'ไมโครเวฟ': 5,
            'เตาอบ': 5,
            'เครื่องทำน้ำอุ่น': 5,
            'เครื่องใช้ไฟฟ้าในครัว': 5,
            'ทีวี/เครื่องเสียง': 5,
            'tv': 5,
            'television': 5,
            'refrigerator': 5,
            'air conditioner': 5,
            'washing machine': 5,
            'fan': 5,
            'air purifier': 5,

            // 🔥 Computer Subcategory Aliases (Category 4)
            'โน๊ตบุ๊ค': 4,
            'โน้ตบุ๊ค': 4,
            'โน้ตบุ๊ก': 4,
            'notebook': 4,
            'จอคอมพิวเตอร์': 4,
            'จอคอม': 4,
            'monitor': 4,
            'คอมพิวเตอร์ตั้งโต๊ะ': 4,
            'desktop': 4,
            'ปริ๊นเตอร์': 4,
            'เครื่องพิมพ์': 4,
            'printer': 4,
            'keyboard': 4,
            'mouse': 4,

            // 🔥 Mobile Aliases
            'สมาร์ทโฟน': 3,
            'iphone': 3,
            'samsung': 3,
            'แท็บเล็ต': 3,
            'tablet': 3,
            'ipad': 3,
        }

        // Try exact match first
        if (map[categoryName]) return map[categoryName]

        // Try lowercase match
        const lowerName = categoryName.toLowerCase()
        if (map[lowerName]) return map[lowerName]

        // Try partial match for common patterns
        for (const [key, value] of Object.entries(map)) {
            if (lowerName.includes(key.toLowerCase()) || key.toLowerCase().includes(lowerName)) {
                return value
            }
        }

        return 0
    }
}

// ============================================
// SINGLETON INSTANCE
// ============================================
let instance: OpenAIVisionService | null = null

export function getOpenAIVisionService(): OpenAIVisionService {
    if (typeof window !== 'undefined') {
        if (!instance) {
            instance = new OpenAIVisionService()
        }
        return instance
    }
    return new OpenAIVisionService()
}

export default OpenAIVisionService
