/**
 * VISION JSON SCHEMA
 * 
 * Output schema for Layer 1 Vision Analysis
 * This is the ONLY output from gpt-4o-mini
 */

// ============================================
// MAIN SCHEMA
// ============================================
export interface VisionJSON {
    // === Detected Objects ===
    detectedBrand: string | null           // "Honda", "Samsung", null if unclear
    detectedModel: string | null           // "CB650R", "[ไม่ระบุรุ่น]"
    detectedYear: number | string | null   // 2022, "2020-2023", null
    detectedColor: string | null           // "แดง", "ขาว"
    detectedSize: string | null            // "55 นิ้ว", "650cc", "128GB"

    // === Condition Assessment ===
    visibleCondition: ConditionLevel
    conditionNotes: string[]               // ["มีรอยขีดข่วนเล็กน้อย", "หน้าจอสมบูรณ์"]
    visibleDefects: string[]               // Specific defects spotted

    // === Features ===
    detectedFeatures: string[]             // ["Inverter", "Smart TV", "WiFi", "ABS"]
    detectedAccessories: string[]          // ["กล่อง", "ที่ชาร์จ", "เคส", "หมวกกันน็อค"]

    // === Extracted Text (OCR) ===
    extractedTexts: string[]               // Text visible in image

    // === Category Hints (NOT final category) ===
    productType: string                    // "motorcycle", "tv", "phone", "aircon"
    categoryHints: string[]                // Keywords for Layer 2: ["big bike", "650cc", "naked"]

    // === Confidence ===
    confidenceScore: number                // 0-1
    imageQuality: ImageQuality
}

// ============================================
// ENUMS
// ============================================
export type ConditionLevel =
    | 'new'      // ใหม่แกะกล่อง
    | 'like_new' // เหมือนใหม่
    | 'good'     // สภาพดี
    | 'fair'     // พอใช้
    | 'poor'     // สภาพไม่ดี

export type ImageQuality =
    | 'high'     // ชัด สว่าง หลายมุม
    | 'medium'   // พอใช้ได้
    | 'low'      // มืด เบลอ มุมเดียว

// ============================================
// VALIDATION HELPERS
// ============================================
export function isValidVisionJSON(obj: unknown): obj is VisionJSON {
    if (!obj || typeof obj !== 'object') return false

    const json = obj as Record<string, unknown>

    // Required fields
    if (typeof json.productType !== 'string') return false
    if (typeof json.confidenceScore !== 'number') return false

    return true
}

export function createEmptyVisionJSON(): VisionJSON {
    return {
        detectedBrand: null,
        detectedModel: null,
        detectedYear: null,
        detectedColor: null,
        detectedSize: null,
        visibleCondition: 'good',
        conditionNotes: [],
        visibleDefects: [],
        detectedFeatures: [],
        detectedAccessories: [],
        extractedTexts: [],
        productType: 'unknown',
        categoryHints: [],
        confidenceScore: 0,
        imageQuality: 'low',
    }
}
