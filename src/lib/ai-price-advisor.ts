/**
 * AI PRICE ADVISOR
 * 
 * เรียก GPT-4o-mini เพื่อประเมินราคาตลาดไทยอย่างแม่นยำ
 * ใช้ข้อมูลจาก: รูปภาพ, ยี่ห้อ, รุ่น, สภาพ, ปี
 * 
 * @version 1.0.0
 */

// ============================================
// TYPES
// ============================================

export interface AIPriceAdvice {
    quickSellPrice: number      // ขายเร็ว (ต่ำกว่าตลาด)
    marketPrice: number         // ราคาตลาด
    maxPrice: number            // ราคากำไรสูง
    confidence: number          // 0-100
    priceRange: {
        min: number
        max: number
    }
    reasoning: string           // เหตุผลในการประเมิน
    marketInsights: string[]    // ข้อมูลตลาด
    pricingFactors: {
        factor: string
        impact: 'positive' | 'negative' | 'neutral'
        detail: string
    }[]
    sources: string[]           // แหล่งอ้างอิง (estimation)
}

export interface PriceAdvisorInput {
    title: string
    category: string
    categoryId?: number          // Category ID for config lookup
    subcategory?: string
    subcategoryId?: number       // Subcategory ID for config lookup
    condition: string            // Main condition (critical for pricing!)
    specs?: Record<string, string>
    formData?: Record<string, string | string[]>  // All form data for detailed analysis
    imageBase64?: string         // Optional: image for visual assessment
}

// ============================================
// CONFIGURATION
// ============================================

const CONFIG = {
    MODEL: 'gpt-4o-mini',       // Using gpt-4o-mini temporarily (TODO: switch to gpt-4.1-nano when ready)
    MAX_TOKENS: 800,            // Reduced for cost savings
    TEMPERATURE: 0.3,           // More deterministic for pricing
    REQUEST_TIMEOUT_MS: 15000,  // Faster timeout
}

// ============================================
// PRICE ADVISOR PROMPT
// ============================================

const PRICE_ADVISOR_PROMPT = `คุณคือผู้เชี่ยวชาญประเมินราคาสินค้ามือสองในตลาดไทย มีความรู้เกี่ยวกับ:
- ราคาตลาด Kaidee, Facebook Marketplace, Shopee มือสอง
- ราคารถมือสองใน Rod.Thai, One2Car, Taladrod
- ราคามือถือมือสองใน JIB, Banana IT, ร้านค้าทั่วไป
- ราคาเครื่องใช้ไฟฟ้า Power Buy, HomePro มือสอง
- ราคาแฟชั่นมือสองใน Vestiaire, Carousell

**กฎการประเมินราคา:**
1. ใช้ราคาตลาดไทยปัจจุบัน (ธันวาคม 2024) เป็นหลัก
2. พิจารณา: ยี่ห้อ, รุ่น, อายุ, สภาพ, ความนิยม
3. มอเตอร์ไซค์รุ่นเล็ก (Wave, Click, Scoopy): 20,000-50,000 บาท
4. มอเตอร์ไซค์รุ่นกลาง (PCX, Forza, ADV): 50,000-120,000 บาท
5. มอเตอร์ไซค์ Big Bike: 100,000-500,000+ บาท
6. รถยนต์: ดูจาก One2Car, Taladrod เป็นหลัก

**📱 กฎพิเศษสำหรับสมาร์ทโฟน (สำคัญมาก!):**
- iPhone รุ่นล่าสุด (15, 16 series): ราคาลด 15-30% จากใหม่
- iPhone รุ่นใกล้ (13, 14 series): ราคาลด 30-50% จากใหม่
- iPhone รุ่นเก่า 5+ ปี (11, XS, XR, X และเก่ากว่า): ราคา 3,000-8,000 บาท
- iPhone รุ่นเก่ามาก 7+ ปี (8, 7, 6s และเก่ากว่า): ราคา 1,500-4,000 บาท
- iPhone 8/8 Plus (ปี 2017): ราคา 1,500-3,500 บาท ขึ้นกับสภาพ
- iPhone 7/7 Plus (ปี 2016): ราคา 1,000-2,500 บาท
- iPhone 6s และเก่ากว่า: ราคา 500-1,500 บาท
- Android รุ่นเก่า 5+ ปี: มักขายไม่ได้หรือราคาต่ำมาก 500-2,000 บาท
- มือถือติด iCloud/Google Lock: ขายเป็นอะไหล่เท่านั้น ราคา 500-1,500 บาท

**🔧 กฎสำหรับขายเป็นอะไหล่:**
- มือถือขายอะไหล่: ราคา 500-2,000 บาท ไม่ว่ารุ่นใด
- เครื่องเสีย/จอแตก: ลดราคา 50-70% จากสภาพดี
- แบตเสื่อมหนัก (<60%): ลดราคา 20-30%

7. iPhone รุ่นใหม่: ราคาลดจากใหม่ 20-40% ขึ้นกับรุ่นและสภาพ
8. โน้ตบุ๊ค: ราคาลดจากใหม่ 30-50%

**🔴 สำคัญมาก:**
- ห้ามประเมินราคาเกินจริง
- มือถือเก่า 7+ ปี ราคาต้องต่ำมาก (ส่วนใหญ่ต่ำกว่า 3,000 บาท)
- ราคาสำหรับ "ขายมือสอง" ไม่ใช่ราคาใหม่
- ควรมี range ที่เหมาะสม (ไม่ห่างเกิน 30%)

**ตอบ JSON เท่านั้น:**
{
  "quickSellPrice": 25000,
  "marketPrice": 30000,
  "maxPrice": 35000,
  "confidence": 80,
  "priceRange": {"min": 25000, "max": 35000},
  "reasoning": "Honda Wave 125i ปี 2020 สภาพดี ราคาตลาดมือสอง 28,000-35,000 บาท...",
  "marketInsights": [
    "Wave 125i เป็นรุ่นยอดนิยม ขายง่าย",
    "สีขาวแดงเป็นสีมาตรฐาน ไม่กระทบราคา"
  ],
  "pricingFactors": [
    {"factor": "ยี่ห้อ Honda", "impact": "positive", "detail": "ยี่ห้อยอดนิยม ราคาตกน้อย"},
    {"factor": "อายุ 4-5 ปี", "impact": "negative", "detail": "ลดราคาจากใหม่ ~30%"},
    {"factor": "สภาพดี", "impact": "positive", "detail": "ไม่มีรอยร้าว ไม่เคยชน"}
  ],
  "sources": ["Kaidee", "Facebook Marketplace", "ร้านมอเตอร์ไซค์มือสอง"]
}`

// ============================================
// MAIN FUNCTION
// ============================================

export async function getAIPriceAdvice(input: PriceAdvisorInput): Promise<AIPriceAdvice | null> {
    const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY

    if (!apiKey) {
        console.error('[AIPriceAdvisor] Missing OpenAI API key')
        return null
    }

    try {
        // Build user message with product details
        const userMessage = buildUserMessage(input)

        // Prepare messages
        const messages: { role: string; content: any }[] = [
            { role: 'system', content: PRICE_ADVISOR_PROMPT },
            { role: 'user', content: userMessage }
        ]

        // If image provided, use vision capability
        if (input.imageBase64) {
            messages[1] = {
                role: 'user',
                content: [
                    { type: 'text', text: userMessage },
                    {
                        type: 'image_url',
                        image_url: {
                            url: input.imageBase64,
                            detail: 'low'  // Low detail for cost savings
                        }
                    }
                ]
            }
        }

        // Call OpenAI - gpt-4o-mini uses /chat/completions endpoint
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: CONFIG.MODEL,
                messages,
                max_tokens: CONFIG.MAX_TOKENS,
                temperature: CONFIG.TEMPERATURE
            })
        })

        if (!response.ok) {
            const error = await response.text()
            console.error('[AIPriceAdvisor] API error:', error)
            return null
        }

        const data = await response.json()
        const content = data.choices?.[0]?.message?.content

        if (!content) {
            console.error('[AIPriceAdvisor] Empty response')
            return null
        }

        // Parse JSON response
        const parsed = parseJSONResponse(content)

        if (!parsed) {
            console.error('[AIPriceAdvisor] Failed to parse response')
            return null
        }

        console.log('[AIPriceAdvisor] Success:', {
            quickSell: parsed.quickSellPrice,
            market: parsed.marketPrice,
            max: parsed.maxPrice,
            confidence: parsed.confidence
        })

        return parsed

    } catch (error) {
        console.error('[AIPriceAdvisor] Error:', error)
        return null
    }
}

// ============================================
// HELPER: Build User Message
// ============================================

// Condition mapping for clear AI understanding
const CONDITION_DESCRIPTIONS: Record<string, { th: string; priceNote: string }> = {
    'new_sealed': { th: 'ใหม่ ยังไม่แกะซีล', priceNote: 'ราคาใกล้เคียงใหม่ ลด 5-10%' },
    'new_opened': { th: 'ใหม่ แกะแล้วไม่ได้ใช้', priceNote: 'ราคาลด 10-15% จากใหม่' },
    'like_new': { th: 'เหมือนใหม่ 99%', priceNote: 'ราคาลด 15-25% จากใหม่' },
    'good': { th: 'สภาพดี มีรอยใช้งานเล็กน้อย', priceNote: 'ราคาลด 25-35% จากใหม่' },
    'fair': { th: 'ใช้งานได้ปกติ มีรอยเยอะ', priceNote: 'ราคาลด 40-50% จากใหม่' },
    'screen_cracked': { th: 'หน้าจอแตก/ร้าว', priceNote: '⚠️ ราคาลด 50-70% จากปกติ' },
    'parts_only': { th: 'ขายเป็นอะไหล่', priceNote: '🔴 ราคาต่ำมาก 500-2,000 บาท ไม่ว่ารุ่นใด' },
}

function buildUserMessage(input: PriceAdvisorInput): string {
    let message = `ประเมินราคาสินค้านี้:\n\n`
    message += `📦 ชื่อสินค้า: ${input.title}\n`
    message += `📁 หมวดหมู่: ${input.category}`
    if (input.subcategory) {
        message += ` > ${input.subcategory}`
    }
    message += `\n`

    // ⚠️ CRITICAL: Condition with price impact note
    const conditionInfo = CONDITION_DESCRIPTIONS[input.condition]
    message += `📊 สภาพ: ${input.condition}`
    if (conditionInfo) {
        message += ` (${conditionInfo.th})`
    }
    message += `\n`

    // 🔴 SPECIAL WARNING for parts_only
    if (input.condition === 'parts_only') {
        message += `\n🔴🔴🔴 สำคัญมาก: สินค้านี้ "ขายเป็นอะไหล่" 🔴🔴🔴\n`
        message += `- ราคาต้องต่ำมาก ไม่ว่าจะเป็นรุ่นใด\n`
        message += `- มือถือขายอะไหล่: 500-2,000 บาท\n`
        message += `- โน้ตบุ๊คขายอะไหล่: 1,000-5,000 บาท\n`
        message += `- ห้ามแนะนำราคาสูงกว่านี้!\n\n`
    }

    // ⚠️ WARNING for screen_cracked
    if (input.condition === 'screen_cracked') {
        message += `\n⚠️ หน้าจอแตก/ร้าว - ราคาลด 50-70% จากสภาพดี\n\n`
    }

    // Include specs
    if (input.specs && Object.keys(input.specs).length > 0) {
        message += `\n📋 รายละเอียด:\n`
        for (const [key, value] of Object.entries(input.specs)) {
            if (value) {
                message += `- ${key}: ${value}\n`
            }
        }
    }

    // Include form data (battery, warranty, defects, etc.)
    if (input.formData && Object.keys(input.formData).length > 0) {
        message += `\n📝 ข้อมูลเพิ่มเติมจากฟอร์ม:\n`

        // Priority fields that affect pricing
        const priorityFields = ['battery', 'screen', 'defects', 'warranty', 'usage_age', 'shutter_count', 'mileage']

        for (const key of priorityFields) {
            const value = input.formData[key]
            if (value) {
                if (Array.isArray(value)) {
                    message += `- ${key}: ${value.join(', ')}\n`
                } else {
                    message += `- ${key}: ${value}\n`
                }
            }
        }

        // Other fields
        for (const [key, value] of Object.entries(input.formData)) {
            if (!priorityFields.includes(key) && value) {
                if (Array.isArray(value)) {
                    message += `- ${key}: ${value.join(', ')}\n`
                } else {
                    message += `- ${key}: ${value}\n`
                }
            }
        }
    }

    message += `\nกรุณาประเมินราคาตลาดมือสองในไทย พิจารณาสภาพสินค้าเป็นหลัก`

    // Final reminder for low-value items
    if (input.condition === 'parts_only') {
        message += `\n\n⚠️ ย้ำอีกครั้ง: สินค้านี้ขายเป็นอะไหล่ ราคาต้องต่ำมาก (ไม่เกิน 2,000 บาทสำหรับมือถือ)`
    }

    return message
}

// ============================================
// HELPER: Parse JSON Response
// ============================================

function parseJSONResponse(content: string): AIPriceAdvice | null {
    try {
        // Try to extract JSON from response
        const jsonMatch = content.match(/\{[\s\S]*\}/)
        if (!jsonMatch) return null

        const parsed = JSON.parse(jsonMatch[0])

        // Validate required fields
        if (!parsed.marketPrice || typeof parsed.marketPrice !== 'number') {
            return null
        }

        // Build result with defaults
        return {
            quickSellPrice: parsed.quickSellPrice || Math.round(parsed.marketPrice * 0.85),
            marketPrice: parsed.marketPrice,
            maxPrice: parsed.maxPrice || Math.round(parsed.marketPrice * 1.1),
            confidence: parsed.confidence || 70,
            priceRange: parsed.priceRange || {
                min: parsed.quickSellPrice || Math.round(parsed.marketPrice * 0.85),
                max: parsed.maxPrice || Math.round(parsed.marketPrice * 1.1)
            },
            reasoning: parsed.reasoning || '',
            marketInsights: parsed.marketInsights || [],
            pricingFactors: parsed.pricingFactors || [],
            sources: parsed.sources || ['AI Estimation']
        }

    } catch (error) {
        console.error('[AIPriceAdvisor] JSON parse error:', error)
        return null
    }
}

// ============================================
// QUICK PRICE CHECK (Lightweight)
// ============================================

export async function quickAIPriceCheck(
    title: string,
    category: string,
    condition: string
): Promise<{ min: number; max: number; suggested: number } | null> {
    const advice = await getAIPriceAdvice({
        title,
        category,
        condition
    })

    if (!advice) return null

    return {
        min: advice.quickSellPrice,
        max: advice.maxPrice,
        suggested: advice.marketPrice
    }
}
