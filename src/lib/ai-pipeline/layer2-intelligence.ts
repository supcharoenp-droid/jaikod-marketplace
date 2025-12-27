/**
 * AI PIPELINE LAYER 2: INTELLIGENCE ANALYSIS
 * 
 * Model: gpt-5-nano (Text-only, cheapest)
 * Purpose: Analyze Vision JSON to determine category, pricing, and risk
 * 
 * ✅ CAN DO:
 * - Determine product category
 * - Calculate price range (Thai market)
 * - Risk assessment
 * - Generate title/description
 * - Content moderation
 * 
 * ❌ CANNOT DO:
 * - Access images directly
 * - Override Vision JSON data
 * - Re-analyze visual features
 */

// No OpenAI SDK import needed - using fetch directly for API calls
import { VisionJSON } from './vision-schema'
import { IntelligenceOutput } from './intelligence-schema'

// ============================================
// MODEL CONFIGURATION
// ============================================
const INTELLIGENCE_MODEL = 'gpt-5-nano'  // Cheapest text model - $0.05 input, $0.40 output
const FALLBACK_MODEL = 'gpt-4.1-nano'    // Fallback if gpt-5-nano unavailable

// ============================================
// INTELLIGENCE PROMPT
// ============================================
const INTELLIGENCE_PROMPT = `คุณคือ AI Analyst ที่วิเคราะห์ข้อมูลสินค้าจาก Vision JSON
คุณเป็นผู้เชี่ยวชาญตลาดมือสองไทย ปี 2024-2025

## หน้าที่ของคุณ:
✅ กำหนดหมวดหมู่ที่เหมาะสมจากข้อมูลที่ได้รับ
✅ ประเมินช่วงราคาตามตลาดไทย (มือสอง)
✅ ตรวจสอบความเสี่ยง (ของผิดกฎหมาย, ของปลอม, ราคาผิดปกติ)
✅ สร้างชื่อและคำอธิบายที่ดึงดูด
✅ ให้คำแนะนำในการลงขาย

## ⚠️ สิ่งที่คุณห้ามทำ (STRICT):
❌ ห้ามขอดูรูปภาพ - คุณไม่มีความสามารถวิเคราะห์ภาพ
❌ ห้ามเดาข้อมูลที่ไม่มีใน Vision JSON
❌ ห้ามแก้ไขข้อมูลที่ Vision มอบให้

## หมวดหมู่หลัก:
1: ยานยนต์ (101: รถยนต์, 102: มอเตอร์ไซค์, 103-104: อะไหล่)
2: อสังหาริมทรัพย์
3: มือถือและแท็บเล็ต (301: โทรศัพท์, 302: แท็บเล็ต)
4: คอมพิวเตอร์
5: เครื่องใช้ไฟฟ้า (501: แอร์, 502: ตู้เย็น, 503: เครื่องซักผ้า, 504: ทีวี)
6: แฟชั่น
7: เกมและแก็ดเจ็ต
8: กล้องถ่ายรูป
9: พระเครื่อง
10: สัตว์เลี้ยง

## เกณฑ์ราคามอเตอร์ไซค์ (ตัวอย่าง):
- 0-150cc (Wave, Click): 15,000 - 45,000 บาท
- 150-350cc (PCX, Forza): 45,000 - 100,000 บาท
- 350-650cc (CB500, Ninja400): 100,000 - 200,000 บาท
- 650-1000cc (CB650R, Z900): 200,000 - 350,000 บาท
- 1000cc+ (S1000RR): 400,000 - 1,500,000 บาท

ตอบเป็น JSON ตาม schema:`

// ============================================
// INTELLIGENCE ANALYSIS FUNCTION
// ============================================
export async function analyzeWithIntelligence(
    visionJSON: VisionJSON,
    userInput?: {
        title?: string
        category?: number
        specs?: Record<string, string>
    }
): Promise<IntelligenceOutput> {
    // Using fetch directly for API calls (no OpenAI SDK needed)

    // Build context from Vision JSON
    const visionContext = `
## ข้อมูลจาก Vision Analysis:
- ยี่ห้อ: ${visionJSON.detectedBrand || 'ไม่ระบุ'}
- รุ่น: ${visionJSON.detectedModel || 'ไม่ระบุ'}
- ปี: ${visionJSON.detectedYear || 'ไม่ระบุ'}
- สี: ${visionJSON.detectedColor || 'ไม่ระบุ'}
- ขนาด/สเปค: ${visionJSON.detectedSize || 'ไม่ระบุ'}
- สภาพ: ${visionJSON.visibleCondition}
- หมายเหตุสภาพ: ${visionJSON.conditionNotes.join(', ') || 'ไม่มี'}
- ตำหนิที่เห็น: ${visionJSON.visibleDefects.join(', ') || 'ไม่มี'}
- ฟีเจอร์: ${visionJSON.detectedFeatures.join(', ') || 'ไม่มี'}
- อุปกรณ์เสริม: ${visionJSON.detectedAccessories.join(', ') || 'ไม่มี'}
- ข้อความในภาพ: ${visionJSON.extractedTexts.join(', ') || 'ไม่มี'}
- ประเภทสินค้า: ${visionJSON.productType}
- คำใบ้หมวด: ${visionJSON.categoryHints.join(', ') || 'ไม่มี'}
- ความมั่นใจ Vision: ${(visionJSON.confidenceScore * 100).toFixed(0)}%
- คุณภาพภาพ: ${visionJSON.imageQuality}
`

    // Add user input if available
    const userContext = userInput ? `
## ข้อมูลจากผู้ใช้:
${userInput.title ? `- ชื่อที่ผู้ใช้ตั้ง: ${userInput.title}` : ''}
${userInput.category ? `- หมวดที่เลือก: ${userInput.category}` : ''}
${userInput.specs ? `- สเปคเพิ่มเติม: ${JSON.stringify(userInput.specs)}` : ''}
` : ''

    let model = INTELLIGENCE_MODEL

    try {
        // ⚠️ CRITICAL: gpt-5-nano requires /v1/responses endpoint, NOT /chat/completions
        // And uses max_completion_tokens instead of max_tokens

        const isGpt5Nano = model === 'gpt-5-nano'
        const endpoint = isGpt5Nano ? '/v1/responses' : '/v1/chat/completions'

        const messages = [
            {
                role: 'system' as const,
                content: INTELLIGENCE_PROMPT,
            },
            {
                role: 'user' as const,
                content: `วิเคราะห์สินค้านี้และให้ข้อมูลครบถ้วน:\n${visionContext}${userContext}`,
            },
        ]

        // Build payload based on model type
        const payload: any = {
            model,
            messages,
            temperature: 0.4,
        }

        if (isGpt5Nano) {
            // gpt-5-nano specific settings
            payload.max_completion_tokens = 1500
            payload.response_format = { type: 'json_object' }
        } else {
            // Legacy models (gpt-4o-mini, gpt-4.1-nano)
            payload.max_tokens = 1500
            payload.response_format = { type: 'json_object' }
        }

        // Use fetch directly for gpt-5-nano (OpenAI SDK may not support /v1/responses yet)
        const response = await fetch(`https://api.openai.com${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
            },
            body: JSON.stringify(payload),
        })

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}))
            throw new Error(`OpenAI API Error: ${errorData.error?.message || response.statusText}`)
        }

        const data = await response.json()

        // Extract content based on endpoint type
        let content: string
        if (isGpt5Nano) {
            // /v1/responses returns different structure
            content = data.output?.[0]?.content?.[0]?.text || data.choices?.[0]?.message?.content || '{}'
        } else {
            content = data.choices?.[0]?.message?.content || '{}'
        }

        console.log(`🟢 [Layer2] gpt-5-nano completed via ${endpoint}`)
        return parseIntelligenceOutput(content, visionJSON)

    } catch (error: any) {
        console.error(`[Layer2] ${INTELLIGENCE_MODEL} error:`, error.message)

        // Fallback to gpt-4.1-nano using /v1/chat/completions
        console.warn(`[Layer2] Falling back to ${FALLBACK_MODEL}`)
        model = FALLBACK_MODEL

        const fallbackPayload = {
            model,
            messages: [
                {
                    role: 'system',
                    content: INTELLIGENCE_PROMPT,
                },
                {
                    role: 'user',
                    content: `วิเคราะห์สินค้านี้:\n${visionContext}${userContext}`,
                },
            ],
            max_tokens: 1500,
            temperature: 0.4,
            response_format: { type: 'json_object' },
        }

        const fallbackResponse = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
            },
            body: JSON.stringify(fallbackPayload),
        })

        if (!fallbackResponse.ok) {
            const errorData = await fallbackResponse.json().catch(() => ({}))
            throw new Error(`Fallback API Error: ${errorData.error?.message || fallbackResponse.statusText}`)
        }

        const fallbackData = await fallbackResponse.json()
        const content = fallbackData.choices?.[0]?.message?.content || '{}'
        return parseIntelligenceOutput(content, visionJSON)
    }
}

// ============================================
// PARSE HELPER
// ============================================
function parseIntelligenceOutput(content: string, visionJSON: VisionJSON): IntelligenceOutput {
    try {
        const parsed = JSON.parse(content)

        return {
            // Category
            suggestedCategory: {
                id: parsed.suggestedCategory?.id || 99,
                name_th: parsed.suggestedCategory?.name_th || 'อื่นๆ',
                subcategoryId: parsed.suggestedCategory?.subcategoryId,
                subcategoryName: parsed.suggestedCategory?.subcategoryName,
                confidence: parsed.suggestedCategory?.confidence || 0.5,
            },

            // Pricing
            priceRange: {
                min: parsed.priceRange?.min || 0,
                suggested: parsed.priceRange?.suggested || 0,
                max: parsed.priceRange?.max || 0,
                currency: 'THB',
                reasoning: parsed.priceRange?.reasoning || [],
                confidence: parsed.priceRange?.confidence || 0.5,
            },

            // Content
            suggestedTitle: {
                th: parsed.suggestedTitle?.th || `${visionJSON.detectedBrand || ''} ${visionJSON.detectedModel || 'สินค้ามือสอง'}`.trim(),
                en: parsed.suggestedTitle?.en || '',
            },
            suggestedDescription: parsed.suggestedDescription || '',

            // Risk
            riskAssessment: {
                level: parsed.riskAssessment?.level || 'low',
                flags: parsed.riskAssessment?.flags || [],
                contentWarnings: parsed.riskAssessment?.contentWarnings || [],
            },

            // Overall
            overallConfidence: parsed.overallConfidence || 0.6,
            processingNotes: parsed.processingNotes || [],

            // Meta
            modelUsed: parsed.modelUsed || INTELLIGENCE_MODEL,
            visionConfidence: visionJSON.confidenceScore,
        }
    } catch (error) {
        console.error('[Layer2] Failed to parse Intelligence JSON:', error)

        // Return minimal output
        return {
            suggestedCategory: {
                id: 99,
                name_th: 'อื่นๆ',
                confidence: 0.3,
            },
            priceRange: {
                min: 0,
                suggested: 0,
                max: 0,
                currency: 'THB',
                reasoning: ['ไม่สามารถประเมินราคาได้'],
                confidence: 0.3,
            },
            suggestedTitle: {
                th: visionJSON.detectedBrand || 'สินค้ามือสอง',
                en: '',
            },
            suggestedDescription: '',
            riskAssessment: {
                level: 'medium',
                flags: ['ข้อมูลไม่เพียงพอ'],
                contentWarnings: [],
            },
            overallConfidence: 0.3,
            processingNotes: ['Analysis failed, using fallback'],
            modelUsed: FALLBACK_MODEL,
            visionConfidence: visionJSON.confidenceScore,
        }
    }
}

// ============================================
// EXPORT
// ============================================
export default analyzeWithIntelligence
