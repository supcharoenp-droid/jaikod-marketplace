/**
 * AI Vision Service - Using Direct REST API
 * Bypasses SDK compatibility issues
 */

export interface ObjectDetection {
    name: string
    confidence: number
    category: string
}

export interface ProhibitedCheck {
    isProhibited: boolean
    reason?: string
    severity?: 'high' | 'medium' | 'low'
}

export interface ProductAnalysis {
    title: string
    description: string
    suggestedCategory: string
    suggestedSubcategory?: string
    keywords: string[]
    estimatedCondition: 'new' | 'like_new' | 'good' | 'fair' | 'used'
    estimatedPrice?: {
        min: number
        max: number
        suggested: number
    }
    detectedObjects: ObjectDetection[]
    detectedText?: string
    detectedBrands?: string[]
}

export interface VisionAnalysisResult {
    prohibited: ProhibitedCheck
    analysis: ProductAnalysis
    raw: any
}

export class AIVisionService {
    private apiKey: string

    constructor(apiKey?: string) {
        this.apiKey = apiKey || process.env.NEXT_PUBLIC_GEMINI_API_KEY || ''

        if (!this.apiKey) {
            throw new Error('Gemini API Key is required')
        }
    }

    /**
     * Analyze image using direct REST API
     */
    async analyzeImage(imageFile: File): Promise<VisionAnalysisResult> {
        try {
            // Convert file to base64
            const imageData = await this.fileToBase64(imageFile)

            const prompt = `วิเคราะห์รูปภาพสินค้านี้อย่างละเอียดและตอบกลับเป็น JSON:

**ภารกิจ:**
1. ตรวจสอบว่าเป็นสินค้าต้องห้ามหรือไม่
2. ระบุวัตถุที่เห็นในรูป
3. แยกหมวดหมู่
4. สร้างชื่อและคำอธิบาย
5. ประเมินสภาพและราคา

**สินค้าต้องห้าม:**
- อาวุธ, ยาเสพติด, บุหรี่, เหล้า
- เนื้อหาไม่เหมาะสม
- ของปลอม

**ตอบกลับในรูปแบบ JSON:**
{
  "prohibited": {
    "isProhibited": false,
    "reason": null
  },
  "analysis": {
    "title": "ชื่อสินค้า (ภาษาไทย)",
    "description": "คำอธิบายละเอียด 100-200 คำ",
    "suggestedCategory": "อิเล็กทรอนิกส์",
    "keywords": ["keyword1", "keyword2"],
    "estimatedCondition": "like_new",
    "estimatedPrice": {
      "min": 1000,
      "max": 5000,
      "suggested": 3000
    },
    "detectedObjects": [{"name": "วัตถุ", "confidence": 0.95, "category": "หมวดหมู่"}],
    "detectedText": "ข้อความที่อ่านได้",
    "detectedBrands": ["Apple"]
  }
}

ตอบ JSON เท่านั้น`

            // Use REST API v1beta with vision-capable model (gemini-pro-vision requires v1beta)
            const response = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro-vision:generateContent?key=${this.apiKey}`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        contents: [{
                            parts: [
                                { text: prompt },
                                {
                                    inline_data: {
                                        mime_type: imageFile.type || 'image/jpeg',
                                        data: imageData
                                    }
                                }
                            ]
                        }]
                    })
                }
            )

            if (!response.ok) {
                const errorText = await response.text()
                console.error('API Error Response:', errorText)
                throw new Error(`API returned ${response.status}: ${errorText}`)
            }

            const data = await response.json()
            const text = data.candidates[0].content.parts[0].text

            // Parse JSON from response
            const jsonMatch = text.match(/\{[\s\S]*\}/)
            if (!jsonMatch) {
                console.warn('No JSON found in response:', text)
                throw new Error('Failed to parse AI response')
            }

            const parsed = JSON.parse(jsonMatch[0])

            return {
                prohibited: parsed.prohibited,
                analysis: parsed.analysis,
                raw: data
            }
        } catch (error: any) {
            console.error('AI Vision Error:', error)

            // Return graceful fallback
            return {
                prohibited: {
                    isProhibited: false
                },
                analysis: {
                    title: imageFile.name.replace(/\.[^/.]+$/, ''),
                    description: 'กรุณาเพิ่มคำอธิบายสินค้า',
                    suggestedCategory: 'อื่นๆ',
                    keywords: [],
                    estimatedCondition: 'used',
                    estimatedPrice: {
                        min: 100,
                        max: 1000,
                        suggested: 500
                    },
                    detectedObjects: [],
                    detectedText: undefined,
                    detectedBrands: []
                },
                raw: { error: error.message }
            }
        }
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
            reader.onerror = reject
            reader.readAsDataURL(file)
        })
    }

    /**
     * Map category name to ID
     */
    mapCategoryToId(categoryName: string): number {
        const categoryMap: Record<string, number> = {
            'อิเล็กทรอนิกส์': 1,
            'แฟชั่น': 2,
            'ยานยนต์': 3,
            'บ้านและสวน': 4,
            'งานอดิเรก': 5,
            'ความงาม': 6,
            'พระเครื่อง': 7,
        }

        return categoryMap[categoryName] || 0
    }
}

// Export singleton
let instance: AIVisionService | null = null

export function getAIVisionService(): AIVisionService {
    if (typeof window !== 'undefined') {
        if (!instance) {
            instance = new AIVisionService()
        }
        return instance
    }
    return new AIVisionService()
}

export default AIVisionService
