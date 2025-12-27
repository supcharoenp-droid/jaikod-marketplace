/**
 * AI PIPELINE LAYER 1: VISION ANALYSIS
 * 
 * Model: gpt-4o-mini (Vision-capable)
 * Purpose: Analyze images ONLY and extract visual information
 * 
 * ✅ CAN DO:
 * - Analyze image content
 * - Detect brand/model/color/condition
 * - Extract text from images (OCR)
 * - Identify visible features
 * 
 * ❌ CANNOT DO:
 * - Set prices
 * - Calculate pricing factors
 * - Determine category
 * - Risk assessment
 */

import OpenAI from 'openai'
import { VisionJSON } from './vision-schema'

// ============================================
// MODEL CONFIGURATION
// ============================================
const VISION_MODEL = 'gpt-4o-mini'  // Vision-capable model

// ============================================
// VISION ANALYSIS PROMPT
// ============================================
const VISION_PROMPT = `คุณคือ AI Vision Analyst ที่วิเคราะห์ภาพสินค้าเท่านั้น

## หน้าที่ของคุณ:
✅ ดูภาพและบอกสิ่งที่เห็น (ยี่ห้อ, รุ่น, สี, สภาพ, ขนาด)
✅ เดาข้อมูลที่เห็นได้ชัดเจนจากภาพ
✅ อ่านข้อความในภาพ (ป้าย, สติ๊กเกอร์, โลโก้)
✅ ระบุฟีเจอร์และอุปกรณ์เสริมที่เห็น
✅ ประเมินคุณภาพภาพ

## ⚠️ สิ่งที่คุณห้ามทำ (STRICT):
❌ ห้ามตั้งราคา หรือประเมินมูลค่า
❌ ห้ามเลือกหมวดหมู่สินค้า
❌ ห้ามประเมินความเสี่ยง
❌ ห้ามบอกว่าควรขายหรือไม่
❌ ห้ามเดาข้อมูลที่ไม่เห็นในภาพ

## กฎการเดา:
• ยี่ห้อ: เดาจากโลโก้ที่เห็นชัด ถ้าไม่ชัดให้ใส่ null
• รุ่น: เดาจากดีไซน์/ข้อความ ถ้าไม่ชัดให้เขียน "[ไม่ระบุรุ่น]"
• ปี: เดาจากดีไซน์ ให้เป็นช่วง เช่น "2020-2023"
• สภาพ: ประเมินจากสิ่งที่เห็น (รอยขีดข่วน, ความสะอาด)

ตอบเป็น JSON ตาม schema ต่อไปนี้เท่านั้น:`

// ============================================
// VISION ANALYSIS FUNCTION
// ============================================
export async function analyzeWithVision(
    images: string[],
    options: {
        language?: 'th' | 'en'
        maxImages?: number
    } = {}
): Promise<VisionJSON> {
    const { language = 'th', maxImages = 5 } = options

    // Limit images
    const imagesToAnalyze = images.slice(0, maxImages)

    if (imagesToAnalyze.length === 0) {
        throw new Error('No images provided for vision analysis')
    }

    const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
    })

    // Build image messages
    const imageMessages: OpenAI.Chat.Completions.ChatCompletionContentPart[] = imagesToAnalyze.map((img, idx) => ({
        type: 'image_url' as const,
        image_url: {
            url: img.startsWith('data:') ? img : `data:image/jpeg;base64,${img}`,
            detail: 'high' as const,
        },
    }))

    const response = await openai.chat.completions.create({
        model: VISION_MODEL,
        messages: [
            {
                role: 'system',
                content: VISION_PROMPT,
            },
            {
                role: 'user',
                content: [
                    {
                        type: 'text',
                        text: `วิเคราะห์ภาพสินค้านี้ (${imagesToAnalyze.length} ภาพ) และตอบเป็น JSON:`,
                    },
                    ...imageMessages,
                ],
            },
        ],
        max_tokens: 1000,
        temperature: 0.3,  // Low temperature for consistency
        response_format: { type: 'json_object' },
    })

    const content = response.choices[0]?.message?.content || '{}'

    try {
        const parsed = JSON.parse(content) as VisionJSON

        // Validate required fields
        return {
            detectedBrand: parsed.detectedBrand || null,
            detectedModel: parsed.detectedModel || null,
            detectedYear: parsed.detectedYear || null,
            detectedColor: parsed.detectedColor || null,
            detectedSize: parsed.detectedSize || null,
            visibleCondition: parsed.visibleCondition || 'good',
            conditionNotes: parsed.conditionNotes || [],
            visibleDefects: parsed.visibleDefects || [],
            detectedFeatures: parsed.detectedFeatures || [],
            detectedAccessories: parsed.detectedAccessories || [],
            extractedTexts: parsed.extractedTexts || [],
            productType: parsed.productType || 'unknown',
            categoryHints: parsed.categoryHints || [],
            confidenceScore: parsed.confidenceScore || 0.5,
            imageQuality: parsed.imageQuality || 'medium',
        }
    } catch (error) {
        console.error('[Layer1] Failed to parse Vision JSON:', error)

        // Return minimal valid JSON
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
            confidenceScore: 0.3,
            imageQuality: 'low',
        }
    }
}

// ============================================
// EXPORT
// ============================================
export default analyzeWithVision
