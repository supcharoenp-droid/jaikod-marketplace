/**
 * 🧠 AI MODEL STRATEGY - 2-LAYER PIPELINE ARCHITECTURE
 * 
 * 🔵 Layer 1 (Vision): gpt-4o-mini
 *    - วิเคราะห์ภาพ → VisionJSON
 *    - ห้ามตั้งราคา
 *    - $0.15/1M input, $0.60/1M output
 * 
 * 🟢 Layer 2 (Intelligence): gpt-5-nano
 *    - วิเคราะห์หมวดหมู่ + ราคา + ความเสี่ยง
 *    - ห้ามดูรูปภาพ
 *    - $0.05/1M input, $0.40/1M output
 * 
 * @version 3.0.0
 * @architecture 2-Layer Pipeline (Vision → Intelligence)
 */

// ============================================
// MODEL CONFIGURATION - 2-LAYER PIPELINE
// ============================================

/**
 * 🚀 PRODUCTION MODELS - 2-Layer Pipeline
 * 
 * Layer 1 (Vision): gpt-4o-mini
 *   - ราคา: $0.15/1M input, $0.60/1M output
 *   - ความสามารถ: วิเคราะห์ภาพ, ตรวจจับยี่ห้อ/รุ่น/สภาพ
 * 
 * Layer 2 (Intelligence): gpt-5-nano (NEW!)
 *   - ราคา: $0.05/1M input, $0.40/1M output
 *   - ความสามารถ: หมวดหมู่, ราคา, ความเสี่ยง, content
 * 
 * ค่าใช้จ่ายประมาณ: ~$12-15/month สำหรับ 1,000 listings/day
 */
export const AI_MODELS = {
    // 🔵 LAYER 1: Vision Analysis (Image Processing)
    // เปลี่ยนมาใช้ gpt-5-nano เพราะรองรับ Vision API และถูกกว่า (Input $0.05/1M)
    VISION: 'gpt-5-nano',

    // 🟢 LAYER 2: Intelligence Analysis (Text/Reasoning)
    // ใช้ gpt-5-nano เพราะถูกที่สุดและเก่งในงาน Classification
    INTELLIGENCE: 'gpt-5-nano',

    // 🔧 Utility Tasks (Backend/Rules-based)
    UTILITY: 'gpt-5-nano',

    // 🔄 Fallback Models
    VISION_FALLBACK: 'gpt-4o-mini', // Use 4o-mini as fallback if nano fails
    INTELLIGENCE_FALLBACK: 'gpt-4.1-nano',

    // === DEPRECATED (kept for backward compatibility) ===
    PRIMARY: 'gpt-5-nano',      // Use INTELLIGENCE instead
    FALLBACK: 'gpt-4o-mini',    // Use VISION_FALLBACK instead
} as const

// ============================================
// 🧪 EXPERIMENTAL FEATURES (POC)
// ============================================

/**
 * Feature Flag: Two-Layer Vision Pipeline
 * 
 * When enabled:
 * - Layer 1: gpt-4o (superior vision, better OCR)
 * - Layer 2: gpt-5-nano (fast decision making)
 * 
 * Trade-offs:
 * - Cost: ~25x more expensive
 * - Speed: ~2x slower (2 API calls)
 * - Accuracy: +15-20% improvement expected
 * 
 * Set to `true` to test the new pipeline
 */
export const EXPERIMENTAL_FEATURES = {
    USE_TWO_LAYER_VISION: false, // Set to true to enable POC
} as const

export type AIModelType = typeof AI_MODELS[keyof typeof AI_MODELS]

// ============================================
// TASK DEFINITIONS - เลือก Model ตาม Task
// ============================================

export type AITask =
    // Tasks ที่ต้อง "คิดแทนมนุษย์" → gpt-5-nano
    | 'image_analysis'           // วิเคราะห์ภาพสินค้า
    | 'category_decision'        // เลือกหมวดหมู่
    | 'price_intelligence'       // ประเมินราคาเชิงตลาด
    | 'product_understanding'    // เข้าใจสินค้าโดยรวม
    | 'ambiguity_detection'      // ตรวจจับความกำกวม
    | 'authenticity_check'       // ตรวจของแท้/เลียนแบบ
    // Tasks ที่แค่ "ทำตามกติกา" → gpt-4.1-nano
    | 'content_moderation'       // ตรวจคำไม่เหมาะสม
    | 'data_normalization'       // normalize ข้อมูล
    | 'form_validation'          // validate ฟอร์ม
    | 'policy_enforcement'       // enforce policy
    | 'text_summarization'       // สรุปข้อความ
    | 'translation'              // แปลภาษา

/**
 * เลือก Model ที่เหมาะกับ Task
 */
export function getModelForTask(task: AITask): AIModelType {
    // Tasks ที่ต้องใช้สมองคิด → gpt-5-nano
    const intelligenceTasks: AITask[] = [
        'image_analysis',
        'category_decision',
        'price_intelligence',
        'product_understanding',
        'ambiguity_detection',
        'authenticity_check',
    ]

    if (intelligenceTasks.includes(task)) {
        return AI_MODELS.PRIMARY
    }

    // Tasks ที่เป็นงานเชิงกฎ → gpt-4.1-nano
    return AI_MODELS.UTILITY
}

// ============================================
// CONFIDENCE THRESHOLDS
// ============================================

export const CONFIDENCE_THRESHOLDS = {
    // ถ้า confidence ต่ำกว่านี้ → ถือว่าไม่มั่นใจ
    HIGH: 0.85,
    MEDIUM: 0.70,
    LOW: 0.50,

    // Threshold สำหรับ fallback
    REQUIRE_CONFIRMATION: 0.65,  // ต้องถามผู้ใช้
    REQUIRE_FALLBACK: 0.40,      // ต้อง fallback เป็น rule-based
}

// ============================================
// OUTPUT TYPES (JSON Format ที่กำหนด)
// ============================================

export interface ProductUnderstanding {
    summary: string           // สรุปสั้น ๆ ว่าเป็นอะไร
    condition: string         // ใหม่ / ใช้งานแล้ว / เก่า
    notes: string             // หมายเหตุเพิ่มเติม
}

export interface CategoryDecision {
    main: string              // หมวดหลัก
    sub: string               // หมวดย่อย
    confidence_score: number  // 0.00 – 1.00
    reason: string            // สั้น กระชับ สำหรับระบบ
}

export interface PriceIntelligence {
    price_min: number         // ราคาต่ำสุด
    price_recommended: number // ราคาแนะนำ
    price_max: number         // ราคาสูงสุด
    currency: 'THB'
    pricing_note: string      // เช่น "เหมาะกับขายเร็ว", "ของสะสม"
}

export interface RiskCheck {
    risk_level: 'low' | 'medium' | 'high'
    ambiguity_reason: string
    suggested_questions: string[]
}

export interface AIAnalysisResult {
    product_understanding: ProductUnderstanding
    category: CategoryDecision
    pricing: PriceIntelligence
    risk_check: RiskCheck

    // Metadata
    model_used: AIModelType
    processing_time_ms: number
    fallback_used: boolean
}

// ============================================
// FALLBACK STRATEGY
// ============================================

export interface FallbackDecision {
    shouldFallback: boolean
    reason: 'low_confidence' | 'error' | 'ambiguity' | 'timeout' | 'none'
    action: 'ask_user' | 'use_rule_based' | 'proceed' | 'reject'
}

/**
 * ตัดสินใจว่าควร fallback หรือไม่
 * 
 * กฎสำคัญ:
 * - ถ้า gpt-5-nano confidence ต่ำ → ขอ input เพิ่มจากผู้ใช้
 * - หรือ fallback เป็น rule-based (4.1-nano)
 * - ห้ามเดามั่วแล้วส่งผลลัพธ์สุดท้ายทันที
 */
export function decideFallback(
    confidenceScore: number,
    hasError: boolean = false
): FallbackDecision {
    // Error → ใช้ rule-based
    if (hasError) {
        return {
            shouldFallback: true,
            reason: 'error',
            action: 'use_rule_based',
        }
    }

    // High confidence → proceed
    if (confidenceScore >= CONFIDENCE_THRESHOLDS.HIGH) {
        return {
            shouldFallback: false,
            reason: 'none',
            action: 'proceed',
        }
    }

    // Medium confidence → ถามผู้ใช้เพิ่ม
    if (confidenceScore >= CONFIDENCE_THRESHOLDS.REQUIRE_CONFIRMATION) {
        return {
            shouldFallback: true,
            reason: 'low_confidence',
            action: 'ask_user',
        }
    }

    // Low confidence → fallback to rule-based
    if (confidenceScore >= CONFIDENCE_THRESHOLDS.REQUIRE_FALLBACK) {
        return {
            shouldFallback: true,
            reason: 'ambiguity',
            action: 'use_rule_based',
        }
    }

    // Very low → reject and ask for better input
    return {
        shouldFallback: true,
        reason: 'ambiguity',
        action: 'reject',
    }
}

// ============================================
// BEHAVIORAL RULES (สำคัญมาก)
// ============================================

export const AI_BEHAVIORAL_RULES = {
    // ถ้าไม่มั่นใจ → บอก ไม่เดา
    NO_GUESSING: true,

    // ห้ามทำตัวเป็นฝ่ายขาย
    NO_SELLER_BIAS: true,

    // ห้ามอวยราคา
    NO_PRICE_FLATTERY: true,

    // คิดแบบ Admin ที่ต้องรับผิดชอบระบบทั้งเว็บ
    ADMIN_MINDSET: true,

    // ความแม่น > ความเร็ว
    ACCURACY_OVER_SPEED: true,

    // ความจริง > ความถูกใจผู้ขาย
    TRUTH_OVER_PLEASURE: true,
}

// ============================================
// SYSTEM PROMPTS
// ============================================

/**
 * System Prompt สำหรับ Image Intelligence (gpt-5-nano)
 */
export const IMAGE_INTELLIGENCE_PROMPT = `คุณคือ AI Image Intelligence สำหรับ JaiKod Marketplace

🎯 หน้าที่หลัก:
- วิเคราะห์ภาพสินค้า
- ระบุชนิดสินค้า / สภาพ / ความใหม่เก่า
- ตรวจจับความกำกวม (เช่น อะไหล่ / ของตกแต่ง / ของเลียนแบบ)

⚠️ กฎสำคัญ:
- เป้าหมาย: เข้าใจ "ของในมือคนขาย" ไม่ใช่แค่เห็นวัตถุ
- ถ้าภาพไม่ชัด หรือเสี่ยงตีความผิด → ระบุว่า ambiguous
- ถ้าไม่มั่นใจ → บอก ไม่เดา
- ห้ามทำตัวเป็นฝ่ายขาย

📤 ตอบเป็น JSON เท่านั้น ห้าม markdown`

/**
 * System Prompt สำหรับ Category Decision (gpt-5-nano)
 */
export const CATEGORY_DECISION_PROMPT = `คุณคือ AI Category Decision Engine สำหรับ JaiKod Marketplace

🎯 หน้าที่หลัก:
- เลือกหมวดหมู่หลัก + ย่อย
- อธิบายเหตุผลสั้น ๆ (internal)
- แจ้งระดับความมั่นใจ (confidence score)

📋 หลักการ:
- ยึด "หน้าที่หลักของสินค้า"
- ห้ามเลือกหมวดจากรูปร่างภายนอกอย่างเดียว
- ห้ามเลือกหมวดตามชื่อที่ผู้ใช้พิมพ์ ถ้าขัดกับภาพ

⚠️ กฎสำคัญ:
- เป้าหมาย: ลดหมวดผิด = ลดดราม่า = ลดงาน admin
- ถ้าไม่มั่นใจ → confidence_score ต่ำ
- ห้ามเดามั่ว

📤 ตอบเป็น JSON เท่านั้น ห้าม markdown`

/**
 * System Prompt สำหรับ Price Intelligence (gpt-5-nano)
 */
export const PRICE_INTELLIGENCE_PROMPT = `คุณคือ AI Price Intelligence สำหรับ JaiKod Marketplace

🎯 หน้าที่หลัก:
- ประเมินช่วงราคา (min / recommended / max)
- วิเคราะห์จากภาพ + สภาพ + หมวด
- แยกกรณี มือหนึ่ง / มือสอง / ของเก่า / ของสะสม

💰 ประเมินราคาโดยดูจาก:
- ประเภทสินค้า
- สภาพจริงจากภาพ
- สถานะ (มือหนึ่ง / มือสอง)
- ความนิยมในตลาดทั่วไป (ไม่อิงราคาหลอก)

⚠️ กฎสำคัญ:
- เป้าหมาย: ราคา "ขายได้จริง" ไม่ใช่สวยบนกระดาษ
- ❗ห้ามตั้งราคาสูงเกินจริงเพื่อเอาใจผู้ขาย
- ความจริง > ความถูกใจผู้ขาย
- ถ้าไม่มั่นใจ → บอก ไม่เดา

📤 ตอบเป็น JSON เท่านั้น ห้าม markdown`

/**
 * System Prompt สำหรับ Rule/Safety (gpt-4.1-nano)
 */
export const SAFETY_RULES_PROMPT = `คุณคือ AI Safety & Rules Engine สำหรับ JaiKod Marketplace

🎯 หน้าที่หลัก:
- ตรวจคำไม่เหมาะสม
- normalize ข้อมูล
- validate ฟอร์ม
- enforce policy

⚠️ กฎสำคัญ:
- เป้าหมาย: ประหยัด + เสถียร + ไม่ต้องใช้สมองขั้นสูง
- ทำตามกฎเท่านั้น ไม่ต้องคิดเชิงตลาด
- รวดเร็ว แม่นยำ

📤 ตอบเป็น JSON เท่านั้น`

/**
 * Combined System Prompt สำหรับ Full Analysis (gpt-5-nano)
 */
export const FULL_ANALYSIS_PROMPT = `คุณคือ สมองกลางของ JaiKod Marketplace

🧠 Final Mindset:
- คุณไม่ใช่แชทบอท
- คุณคือ สมองกลางของ Marketplace
- ถ้าตัดสินใจผิด = คนขายด่า + คนซื้อหนี
- ดังนั้นคิดให้รอบ แล้วค่อยตอบ

📋 Step 1: Image Analysis
วิเคราะห์จากภาพโดยพิจารณา:
- ประเภทสินค้า
- ยี่ห้อ / รุ่น (ถ้ามองเห็น)
- สภาพการใช้งาน (ใหม่ / ใช้งานแล้ว / เก่า)
- สิ่งที่ "ไม่ใช่ตัวสินค้า" (กล่อง, อะไหล่, ของตกแต่ง)
- ความเป็นของแท้ / เลียนแบบ (ถ้ามีสัญญาณ)
- ถ้าภาพไม่ชัด หรือเสี่ยงตีความผิด → ระบุว่า ambiguous

🗂️ Step 2: Category Decision
เลือก:
- category_main
- category_sub

หลักการ:
- ยึด "หน้าที่หลักของสินค้า"
- ห้ามเลือกหมวดจากรูปร่างภายนอกอย่างเดียว
- ห้ามเลือกหมวดตามชื่อที่ผู้ใช้พิมพ์ ถ้าขัดกับภาพ

ต้องให้:
- confidence_score (0.00 – 1.00)
- reason (สั้น กระชับ สำหรับระบบ ไม่ต้องหวาน)

💰 Step 3: Price Intelligence
ประเมินราคาโดยดูจาก:
- ประเภทสินค้า
- สภาพจริงจากภาพ
- สถานะ (มือหนึ่ง / มือสอง)
- ความนิยมในตลาดทั่วไป (ไม่อิงราคาหลอก)

ต้องให้:
- price_min
- price_recommended
- price_max
- currency = THB
- pricing_note (เช่น "เหมาะกับขายเร็ว", "ของสะสม", "ต้องหาผู้ซื้อเฉพาะกลุ่ม")

❗ห้ามตั้งราคาสูงเกินจริงเพื่อเอาใจผู้ขาย
เป้าหมายคือ "ขายได้จริง"

⚠️ Step 4: Risk & Ambiguity Check
ตรวจ:
- หมวดอาจผิด
- ราคาคลาดเคลื่อนสูง
- สินค้าเข้าข่ายต้องการข้อมูลเพิ่ม

ถ้ามีความเสี่ยง:
- ระบุ risk_level: low / medium / high
- แนะนำสิ่งที่ควรถามผู้ใช้เพิ่ม (สั้น ๆ)

📤 Output Format (JSON ONLY)
ห้ามตอบเป็นข้อความยาว
ห้ามใส่ markdown
ห้ามคอมเมนต์นอก JSON

{
  "product_understanding": {
    "summary": "",
    "condition": "",
    "notes": ""
  },
  "category": {
    "main": "",
    "sub": "",
    "confidence_score": 0.00,
    "reason": ""
  },
  "pricing": {
    "price_min": 0,
    "price_recommended": 0,
    "price_max": 0,
    "currency": "THB",
    "pricing_note": ""
  },
  "risk_check": {
    "risk_level": "low | medium | high",
    "ambiguity_reason": "",
    "suggested_questions": []
  }
}

🧠 Behavioral Rules (สำคัญมาก)
- ถ้าไม่มั่นใจ → บอก ไม่เดา
- ห้ามทำตัวเป็นฝ่ายขาย
- ห้ามอวยราคา
- คิดแบบ Admin ที่ต้องรับผิดชอบระบบทั้งเว็บ
- ความแม่น > ความเร็ว
- ความจริง > ความถูกใจผู้ขาย`

// ============================================
// COST ESTIMATION
// ============================================

export const MODEL_PRICING = {
    // gpt-4o-mini pricing (Fallback)
    'gpt-4o-mini': {
        input_per_1m: 0.15,      // $0.15 per 1M input tokens
        output_per_1m: 0.60,     // $0.60 per 1M output tokens
        vision_per_1m: 0.15,     // Vision uses same rate as input
    },
    'gpt-5-nano': {
        input_per_1m: 0.05,      // $0.05 per 1M input tokens (CHEAPEST!)
        output_per_1m: 0.40,     // $0.40 per 1M output tokens
        vision_per_1m: 0.05,     // ✅ Vision Capable! Same rate as input
    },
    'gpt-4.1-nano': {
        input_per_1m: 0.10,      // $0.10 per 1M input tokens
        output_per_1m: 0.40,     // $0.40 per 1M output tokens
        vision_per_1m: 0,        // Cannot process images
    },
    'gpt-4.1-mini': {
        input_per_1m: 0.40,      // $0.40 per 1M input tokens
        output_per_1m: 1.60,     // $1.60 per 1M output tokens
        vision_per_1m: 0.40,     // Vision capable
    },
    'gpt-5-mini': {
        input_per_1m: 0.25,      // $0.25 per 1M input tokens
        output_per_1m: 2.00,     // $2.00 per 1M output tokens
        vision_per_1m: 0.25,     // Vision capable (if needed)
    },
}

/**
 * ประมาณค่าใช้จ่ายต่อ request
 */
export function estimateCost(
    model: AIModelType,
    inputTokens: number,
    outputTokens: number,
    hasImage: boolean = false
): number {
    const pricing = MODEL_PRICING[model]
    let cost = 0

    cost += (inputTokens / 1_000_000) * pricing.input_per_1m
    cost += (outputTokens / 1_000_000) * pricing.output_per_1m

    if (hasImage) {
        // Vision typically uses ~1000 tokens per image
        cost += (1000 / 1_000_000) * pricing.vision_per_1m
    }

    return cost
}

/**
 * ประมาณค่าใช้จ่ายรายเดือน
 */
export function estimateMonthlyCost(
    requestsPerDay: number,
    avgInputTokens: number = 500,
    avgOutputTokens: number = 300,
    percentageWithImages: number = 80
): { primary: number; utility: number; total: number } {
    const requestsPerMonth = requestsPerDay * 30

    // Primary model (image + category + price)
    const primaryRequests = requestsPerMonth
    const primaryCost = primaryRequests * estimateCost(
        AI_MODELS.PRIMARY,
        avgInputTokens,
        avgOutputTokens,
        percentageWithImages > 0
    )

    // Utility model (validation, safety)
    const utilityRequests = requestsPerMonth * 0.5 // ~50% need validation
    const utilityCost = utilityRequests * estimateCost(
        AI_MODELS.UTILITY,
        200, // validation is shorter
        100,
        false
    )

    return {
        primary: primaryCost,
        utility: utilityCost,
        total: primaryCost + utilityCost,
    }
}

// Export default config
export default {
    AI_MODELS,
    getModelForTask,
    decideFallback,
    CONFIDENCE_THRESHOLDS,
    FULL_ANALYSIS_PROMPT,
    IMAGE_INTELLIGENCE_PROMPT,
    CATEGORY_DECISION_PROMPT,
    PRICE_INTELLIGENCE_PROMPT,
    SAFETY_RULES_PROMPT,
    AI_BEHAVIORAL_RULES,
    estimateCost,
    estimateMonthlyCost,
}
