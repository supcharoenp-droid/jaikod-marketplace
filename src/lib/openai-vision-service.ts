/**
 * OpenAI Vision Service - Best for Production
 * Using GPT-4o-mini for cost-effectiveness
 */

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
    detectedObjects: string[]
    detectedBrands?: string[]
    isProhibited: boolean
    prohibitedReason?: string
}

export class OpenAIVisionService {
    private apiKey: string
    private baseURL = 'https://api.openai.com/v1'

    constructor(apiKey?: string) {
        // 🔐 SECURITY: Use environment variable, never hardcode API keys!
        this.apiKey = apiKey || process.env.NEXT_PUBLIC_OPENAI_API_KEY || ''

        if (!this.apiKey) {
            console.warn('⚠️ OpenAI API Key not found. Set NEXT_PUBLIC_OPENAI_API_KEY in .env.local')
            // Don't throw error, allow app to load but API calls will fail
        }
    }

    /**
     * Analyze product image with GPT-4o-mini
     */
    async analyzeImage(imageFile: File): Promise<ProductAnalysis> {
        try {
            // Convert to base64
            const base64Image = await this.fileToBase64(imageFile)

            const response = await fetch(`${this.baseURL}/chat/completions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.apiKey}`
                },
                body: JSON.stringify({
                    model: 'gpt-4o-mini', // 94% cheaper than GPT-4o! ✅
                    messages: [
                        {
                            role: 'user',
                            content: [
                                {
                                    type: 'text',
                                    text: `วิเคราะห์สินค้า ตอบ JSON:
{
  "title": "ชื่อสินค้า (ไทย) ยี่ห้อ+รุ่น+สเปค",
  "description": "คำอธิบาย 100-150 คำ ระบุยี่ห้อ รุ่น สภาพ จุดเด่น",
  "suggestedCategory": "อิเล็กทรอนิกส์|แฟชั่น|ยานยนต์|บ้านและสวน|งานอดิเรก|ความงาม|พระเครื่อง|นาฬิกา|สัตว์เลี้ยง",
  "suggestedSubcategory": "หมวดย่อย",
  "keywords": ["คำสำคัญ"],
  "estimatedCondition": "new|like_new|good|fair|used",
  "estimatedPrice": {"min": 0, "max": 0, "suggested": 0},
  "detectedObjects": ["วัตถุที่เห็น"],
  "detectedBrands": ["ยี่ห้อ"],
  "isProhibited": false,
  "prohibitedReason": null
}

กฎ:
- นาฬิกาข้อมือ/นาฬิกาติดผนัง → หมวด "นาฬิกา"
- มือถือ/แทปเล็ต/คอม → "อิเล็กทรอนิกส์"
- เสื้อผ้า/รองเท้า/กระเป๋า → "แฟชั่น"
- รถยนต์/มอเตอร์ไซค์/ยาง → "ยานยนต์"
- ราคาตามตลาดไทย
- ห้าม: อาวุธ ยาเสพติด บุหรี่ เหล้า ของปลอม สัตว์มีชีวิต
- ถ้าต้องห้าม: isProhibited=true`
                                },
                                {
                                    type: 'image_url',
                                    image_url: {
                                        url: `data:${imageFile.type};base64,${base64Image}`,
                                        detail: 'low' // 'low' = ประหยัด 85%, เพียงพอสำหรับ product analysis
                                    }
                                }
                            ]
                        }
                    ],
                    max_tokens: 800, // ลดจาก 1500 (ประหยัด output tokens)
                    temperature: 0.2 // Lower = more consistent & deterministic
                })
            })

            if (!response.ok) {
                const error = await response.json()
                throw new Error(`OpenAI API Error: ${error.error?.message || response.statusText}`)
            }

            const data = await response.json()
            const content = data.choices[0].message.content

            // Extract JSON from response
            const jsonMatch = content.match(/\{[\s\S]*\}/)
            if (!jsonMatch) {
                throw new Error('No valid JSON in response')
            }

            const result = JSON.parse(jsonMatch[0])

            console.log('✅ OpenAI Vision Analysis สำเร็จ!')
            console.log('📝 Title:', result.title)
            console.log('📁 Category:', result.suggestedCategory)
            console.log('💰 Price:', result.estimatedPrice?.suggested)

            return result

        } catch (error: any) {
            console.error('OpenAI Vision Error:', error)
            throw error
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
        const map: Record<string, number> = {
            'อิเล็กทรอนิกส์': 1,
            'แฟชั่น': 2,
            'ยานยนต์': 3,
            'บ้านและสวน': 4,
            'งานอดิเรก': 5,
            'ความงาม': 6,
            'พระเครื่อง': 7,
        }
        return map[categoryName] || 0
    }
}

// Singleton
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
