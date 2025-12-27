/**
 * 🔧 AI UTILITY SERVICE (gpt-4.1-nano)
 * 
 * หน้าที่: งานเชิงกฎ / งานหลังบ้าน เพื่อคุมต้นทุน
 * 
 * Tasks:
 * - ตรวจคำไม่เหมาะสม (Content Moderation)
 * - normalize ข้อมูล
 * - validate ฟอร์ม
 * - enforce policy
 * 
 * เป้าหมาย: ประหยัด + เสถียร + ไม่ต้องใช้สมองขั้นสูง
 * 
 * @version 1.0.0
 * @model gpt-4.1-nano
 */

import {
    AI_MODELS,
    SAFETY_RULES_PROMPT,
    getModelForTask,
} from './ai-model-strategy'

// ============================================
// CONFIGURATION
// ============================================
const CONFIG = {
    MODEL: AI_MODELS.UTILITY,  // gpt-4.1-nano
    MAX_TOKENS: 500,           // ไม่ต้องมากสำหรับงาน validation
    TEMPERATURE: 0.1,          // Low temperature for consistent results
    REQUEST_TIMEOUT_MS: 10000, // 10 seconds - งาน utility ต้องเร็ว
}

// ============================================
// TYPES
// ============================================

export interface ModerationResult {
    isApproved: boolean
    violations: ModerationViolation[]
    sanitizedText?: string
    confidence: number
}

export interface ModerationViolation {
    type: 'profanity' | 'prohibited_item' | 'scam' | 'hate_speech' | 'adult_content' | 'violence' | 'other'
    severity: 'low' | 'medium' | 'high'
    description: string
    originalText: string
    suggestion?: string
}

export interface ValidationResult {
    isValid: boolean
    errors: ValidationError[]
    warnings: ValidationWarning[]
    normalizedData?: Record<string, any>
}

export interface ValidationError {
    field: string
    message: string
    code: string
}

export interface ValidationWarning {
    field: string
    message: string
    suggestion?: string
}

export interface NormalizationResult {
    success: boolean
    normalized: Record<string, any>
    changes: NormalizationChange[]
}

export interface NormalizationChange {
    field: string
    original: string
    normalized: string
    reason: string
}

// ============================================
// PROHIBITED ITEMS LIST (Thailand E-commerce)
// ============================================
const PROHIBITED_ITEMS = [
    // Weapons
    'อาวุธ', 'ปืน', 'มีด', 'กระบอง', 'ระเบิด', 'gun', 'weapon', 'knife',
    // Drugs
    'ยาเสพติด', 'กัญชา', 'ยาบ้า', 'โคเคน', 'drugs', 'marijuana', 'cocaine',
    // Tobacco/Alcohol
    'บุหรี่', 'บุหรี่ไฟฟ้า', 'vape', 'cigarette', 'เหล้า', 'alcohol',
    // Counterfeit
    'ของปลอม', 'ก๊อปปี้', 'เลียนแบบ', 'replica', 'counterfeit', 'fake',
    // Adult
    'ของผู้ใหญ่', 'เซ็กซ์ทอย', 'porn', 'adult',
    // Prescription drugs
    'ยาสั่งแพทย์', 'ยาอันตราย',
]

// ============================================
// PROFANITY LIST (Thai + English)
// ============================================
const PROFANITY_PATTERNS = [
    /(?:^|\s)สัตว์(?:\s|$)/i,
    /(?:^|\s)หมา(?:\s|$)/i,
    /(?:^|\s)ควาย(?:\s|$)/i,
    /เหี้ย/i,
    /อีดอก/i,
    /อีสัตว์/i,
    /แม่ง/i,
    /เย็ด/i,
    /fuck/i,
    /shit/i,
    /damn/i,
    /bitch/i,
]

// ============================================
// SCAM PATTERNS
// ============================================
const SCAM_PATTERNS = [
    /โอนก่อน/i,
    /โอนเงินมา/i,
    /ราคาถูกมาก/i,
    /ลดราคา\s*\d{2,}%/i,
    /ด่วน.*หมดเขต/i,
    /รีบๆ/i,
    /wire money/i,
    /send money first/i,
    /limited time only/i,
]

// ============================================
// MAIN SERVICE CLASS
// ============================================
export class AIUtilityService {
    private apiKey: string
    private baseURL = 'https://api.openai.com/v1'

    constructor(apiKey?: string) {
        this.apiKey = apiKey || process.env.NEXT_PUBLIC_OPENAI_API_KEY || ''
    }

    // ============================================
    // CONTENT MODERATION
    // ============================================

    /**
     * ตรวจคำไม่เหมาะสม / สินค้าต้องห้าม / scam
     * ใช้ gpt-4.1-nano เพราะเป็นงานเชิงกฎ ไม่ต้องคิดเชิงตลาด
     */
    async moderateContent(text: string): Promise<ModerationResult> {
        const violations: ModerationViolation[] = []

        // 1. Check prohibited items (rule-based first - faster)
        for (const item of PROHIBITED_ITEMS) {
            if (text.toLowerCase().includes(item.toLowerCase())) {
                violations.push({
                    type: 'prohibited_item',
                    severity: 'high',
                    description: `พบสินค้าต้องห้าม: ${item}`,
                    originalText: text,
                    suggestion: 'กรุณาลบสินค้านี้ออก'
                })
            }
        }

        // 2. Check profanity (rule-based)
        for (const pattern of PROFANITY_PATTERNS) {
            if (pattern.test(text)) {
                violations.push({
                    type: 'profanity',
                    severity: 'medium',
                    description: 'พบคำไม่เหมาะสม',
                    originalText: text,
                    suggestion: 'กรุณาใช้ภาษาสุภาพ'
                })
                break // Found one is enough
            }
        }

        // 3. Check scam patterns (rule-based)
        for (const pattern of SCAM_PATTERNS) {
            if (pattern.test(text)) {
                violations.push({
                    type: 'scam',
                    severity: 'medium',
                    description: 'พบรูปแบบที่อาจเป็นการหลอกลวง',
                    originalText: text,
                    suggestion: 'กรุณาตรวจสอบเนื้อหาอีกครั้ง'
                })
                break
            }
        }

        // 4. If rule-based found nothing suspicious, use AI for edge cases
        // But only if text is substantial (>50 chars) to save costs
        if (violations.length === 0 && text.length > 50) {
            const aiResult = await this.aiModeration(text)
            violations.push(...aiResult.violations)
        }

        // Calculate confidence based on detection method
        const confidence = violations.length === 0 ? 0.95 :
            violations.some(v => v.severity === 'high') ? 0.99 : 0.85

        return {
            isApproved: violations.filter(v => v.severity === 'high').length === 0,
            violations,
            sanitizedText: this.sanitizeText(text, violations),
            confidence
        }
    }

    /**
     * AI-based moderation (gpt-4.1-nano)
     * ใช้สำหรับ edge cases ที่ rule-based จับไม่ได้
     */
    private async aiModeration(text: string): Promise<ModerationResult> {
        try {
            const response = await this.callAI(
                `ตรวจสอบข้อความนี้ว่ามีเนื้อหาไม่เหมาะสมหรือไม่:
                
"${text}"

ตอบเป็น JSON:
{
    "isApproved": true/false,
    "violations": [
        {
            "type": "profanity|prohibited_item|scam|hate_speech|adult_content|violence|other",
            "severity": "low|medium|high",
            "description": "อธิบายสั้น"
        }
    ]
}

ถ้าไม่พบปัญหา ให้ violations = []`,
                200
            )

            const parsed = JSON.parse(response)
            return {
                isApproved: parsed.isApproved !== false,
                violations: parsed.violations || [],
                confidence: 0.80  // AI moderation has slightly lower confidence
            }
        } catch (error) {
            console.warn('⚠️ AI Moderation error, falling back to approved:', error)
            return {
                isApproved: true,
                violations: [],
                confidence: 0.50
            }
        }
    }

    /**
     * Sanitize text by removing/replacing violations
     */
    private sanitizeText(text: string, violations: ModerationViolation[]): string {
        let sanitized = text

        // Replace profanity with asterisks
        for (const pattern of PROFANITY_PATTERNS) {
            sanitized = sanitized.replace(pattern, '***')
        }

        return sanitized
    }

    // ============================================
    // DATA NORMALIZATION
    // ============================================

    /**
     * Normalize product data (gpt-4.1-nano)
     * - ปรับรูปแบบราคา
     * - ปรับหน่วยวัด
     * - ปรับตัวสะกด
     */
    async normalizeData(data: Record<string, any>): Promise<NormalizationResult> {
        const changes: NormalizationChange[] = []
        const normalized: Record<string, any> = { ...data }

        // 1. Normalize price (rule-based)
        if (data.price) {
            const originalPrice = String(data.price)
            const normalizedPrice = this.normalizePrice(originalPrice)
            if (String(normalizedPrice) !== originalPrice) {
                changes.push({
                    field: 'price',
                    original: originalPrice,
                    normalized: String(normalizedPrice),
                    reason: 'ปรับรูปแบบราคาให้เป็นตัวเลข'
                })
                normalized.price = normalizedPrice
            }
        }

        // 2. Normalize phone number (rule-based)
        if (data.phone) {
            const originalPhone = String(data.phone)
            const normalizedPhone = this.normalizePhone(originalPhone)
            if (normalizedPhone !== originalPhone) {
                changes.push({
                    field: 'phone',
                    original: originalPhone,
                    normalized: normalizedPhone,
                    reason: 'ปรับรูปแบบเบอร์โทรศัพท์'
                })
                normalized.phone = normalizedPhone
            }
        }

        // 3. Normalize title (trim, remove excess spaces)
        if (data.title) {
            const originalTitle = String(data.title)
            const normalizedTitle = originalTitle.trim().replace(/\s+/g, ' ')
            if (normalizedTitle !== originalTitle) {
                changes.push({
                    field: 'title',
                    original: originalTitle,
                    normalized: normalizedTitle,
                    reason: 'ลบช่องว่างซ้ำซ้อน'
                })
                normalized.title = normalizedTitle
            }
        }

        return {
            success: true,
            normalized,
            changes
        }
    }

    /**
     * Normalize price string to number
     */
    private normalizePrice(price: string): number {
        // Remove Thai/English characters, keep numbers and decimal
        const cleanPrice = price
            .replace(/[฿บาท,]/g, '')
            .replace(/THB/gi, '')
            .replace(/[^\d.]/g, '')
            .trim()

        return parseFloat(cleanPrice) || 0
    }

    /**
     * Normalize phone number
     */
    private normalizePhone(phone: string): string {
        // Remove all non-digits
        const digits = phone.replace(/\D/g, '')

        // Thai mobile format
        if (digits.length === 10 && digits.startsWith('0')) {
            return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`
        }

        // With country code
        if (digits.length === 11 && digits.startsWith('66')) {
            return `0${digits.slice(2, 4)}-${digits.slice(4, 7)}-${digits.slice(7)}`
        }

        return phone // Return original if can't normalize
    }

    // ============================================
    // FORM VALIDATION
    // ============================================

    /**
     * Validate listing form data (gpt-4.1-nano for edge cases)
     */
    async validateForm(data: {
        title?: string
        description?: string
        price?: number
        categoryId?: number
        condition?: string
    }): Promise<ValidationResult> {
        const errors: ValidationError[] = []
        const warnings: ValidationWarning[] = []

        // 1. Title validation (rule-based)
        if (!data.title || data.title.length < 10) {
            errors.push({
                field: 'title',
                message: 'ชื่อสินค้าต้องมีอย่างน้อย 10 ตัวอักษร',
                code: 'TITLE_TOO_SHORT'
            })
        } else if (data.title.length > 200) {
            errors.push({
                field: 'title',
                message: 'ชื่อสินค้าต้องไม่เกิน 200 ตัวอักษร',
                code: 'TITLE_TOO_LONG'
            })
        }

        // 2. Description validation
        if (!data.description || data.description.length < 20) {
            warnings.push({
                field: 'description',
                message: 'คำอธิบายควรมีอย่างน้อย 20 ตัวอักษร',
                suggestion: 'เพิ่มรายละเอียดสินค้าเพื่อช่วยให้ขายได้เร็วขึ้น'
            })
        }

        // 3. Price validation
        if (!data.price || data.price <= 0) {
            errors.push({
                field: 'price',
                message: 'กรุณาระบุราคา',
                code: 'PRICE_REQUIRED'
            })
        } else if (data.price > 100_000_000) {
            errors.push({
                field: 'price',
                message: 'ราคาสูงเกินไป',
                code: 'PRICE_TOO_HIGH'
            })
        }

        // 4. Category validation
        if (!data.categoryId || data.categoryId <= 0) {
            errors.push({
                field: 'categoryId',
                message: 'กรุณาเลือกหมวดหมู่',
                code: 'CATEGORY_REQUIRED'
            })
        }

        // 5. Condition validation
        const validConditions = ['new', 'like_new', 'good', 'fair', 'used']
        if (data.condition && !validConditions.includes(data.condition)) {
            errors.push({
                field: 'condition',
                message: 'สภาพสินค้าไม่ถูกต้อง',
                code: 'INVALID_CONDITION'
            })
        }

        return {
            isValid: errors.length === 0,
            errors,
            warnings
        }
    }

    // ============================================
    // POLICY ENFORCEMENT
    // ============================================

    /**
     * Check if listing violates any policies
     */
    async checkPolicyViolations(data: {
        title: string
        description: string
        categoryId: number
        images?: string[]
    }): Promise<{
        hasViolations: boolean
        violations: string[]
        autoRejectReasons: string[]
    }> {
        const violations: string[] = []
        const autoRejectReasons: string[] = []

        // 1. Check title for prohibited content
        const titleMod = await this.moderateContent(data.title)
        if (!titleMod.isApproved) {
            violations.push(...titleMod.violations.map(v => v.description))
            if (titleMod.violations.some(v => v.severity === 'high')) {
                autoRejectReasons.push('ชื่อสินค้ามีเนื้อหาต้องห้าม')
            }
        }

        // 2. Check description
        const descMod = await this.moderateContent(data.description)
        if (!descMod.isApproved) {
            violations.push(...descMod.violations.map(v => v.description))
            if (descMod.violations.some(v => v.severity === 'high')) {
                autoRejectReasons.push('คำอธิบายมีเนื้อหาต้องห้าม')
            }
        }

        return {
            hasViolations: violations.length > 0,
            violations,
            autoRejectReasons
        }
    }

    // ============================================
    // HELPER: Call AI API
    // ============================================

    private async callAI(prompt: string, maxTokens: number = CONFIG.MAX_TOKENS): Promise<string> {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), CONFIG.REQUEST_TIMEOUT_MS)

        try {
            console.log(`🔧 Using model: ${CONFIG.MODEL} for utility task`)

            // gpt-4o-mini uses the standard /chat/completions endpoint
            const response = await fetch(`${this.baseURL}/chat/completions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.apiKey}`
                },
                signal: controller.signal,
                body: JSON.stringify({
                    model: CONFIG.MODEL,
                    messages: [
                        {
                            role: 'system',
                            content: SAFETY_RULES_PROMPT
                        },
                        {
                            role: 'user',
                            content: prompt
                        }
                    ],
                    max_tokens: maxTokens,
                    temperature: CONFIG.TEMPERATURE
                })
            })

            clearTimeout(timeoutId)

            if (!response.ok) {
                throw new Error(`API Error: ${response.statusText}`)
            }

            const data = await response.json()
            return data.choices?.[0]?.message?.content || ''

        } finally {
            clearTimeout(timeoutId)
        }
    }
}

// ============================================
// SINGLETON INSTANCE
// ============================================
let instance: AIUtilityService | null = null

export function getAIUtilityService(): AIUtilityService {
    if (typeof window !== 'undefined') {
        if (!instance) {
            instance = new AIUtilityService()
        }
        return instance
    }
    return new AIUtilityService()
}

export default AIUtilityService
