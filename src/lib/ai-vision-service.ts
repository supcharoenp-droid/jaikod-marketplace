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
    detectedSpecs?: {
        cpu?: string
        gpu?: string
        ram?: string
        storage?: string
    }
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

**🔍 ภารกิจสำคัญ:**
1. **อ่านสติ๊กเกอร์และข้อความบนสินค้า** - ดูสติ๊กเกอร์ยี่ห้อ, รุ่น, สเปก (CPU/RAM) อย่างละเอียด
2. **สำหรับโน้ตบุ๊ค/คอมพิวเตอร์:** 
   - ดูสติ๊กเกอร์ CPU: Intel Core i3/i5/i7/i9 หรือ AMD Ryzen 3/5/7/9
   - ดูสติ๊กเกอร์ GPU: NVIDIA GeForce หรือ AMD Radeon
   - อ่านข้อความบนเครื่อง: ยี่ห้อ, series, รุ่น
3. **สำหรับมือถือ:** ดูรุ่นที่ box หรือหน้าจอถ้าเห็น
4. ตรวจสอบสินค้าต้องห้าม
5. ประเมินสภาพจากรูปที่เห็น

**⚠️ สำคัญ:**
- ใช้ข้อมูลจากสติ๊กเกอร์และข้อความ **เท่านั้น** อย่าเดา!
- Intel และ AMD เป็นคนละค่าย - ห้ามสับสน!
- ถ้ามีสติ๊กเกอร์ Intel → ใช้ Intel ในชื่อ
- ถ้ามีสติ๊กเกอร์ AMD → ใช้ AMD ในชื่อ

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
    "title": "ชื่อสินค้า (ใช้ข้อมูลจากสติ๊กเกอร์)",
    "description": "คำอธิบายละเอียด 100-200 คำ",
    "suggestedCategory": "คอมพิวเตอร์และไอที",
    "keywords": ["keyword1", "keyword2"],
    "estimatedCondition": "like_new",
    "estimatedPrice": {
      "min": 1000,
      "max": 5000,
      "suggested": 3000
    },
    "detectedObjects": [{"name": "วัตถุ", "confidence": 0.95, "category": "หมวดหมู่"}],
    "detectedText": "ข้อความทั้งหมดที่อ่านได้จากสติ๊กเกอร์และตัวเครื่อง",
    "detectedBrands": ["Acer"],
    "detectedSpecs": {
      "cpu": "Intel Core i5-10th Gen (จากสติ๊กเกอร์)",
      "gpu": "Intel Integrated",
      "ram": "ไม่เห็น",
      "storage": "ไม่เห็น"
    }
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
     * ⚠️ CRITICAL: Must match category names from CATEGORIES constant
     */
    mapCategoryToId(categoryName: string): number {
        const categoryMap: Record<string, number> = {
            // Main Categories
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

            // Aliases
            'อิเล็กทรอนิกส์': 4,
            'งานอดิเรก': 12,
            'ความงาม': 14,
            'พระเครื่อง': 9,
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
