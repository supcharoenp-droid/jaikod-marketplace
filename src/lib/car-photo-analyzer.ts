'use client'

/**
 * 🚗 Car Photo AI Analyzer
 * 
 * Specialized AI vision analysis for vehicles
 * Auto-detects: Brand, Model, Year, Color, Body Type, etc.
 * 
 * Uses: gpt-4o-mini for cost-effective vision analysis
 */

import { useState, useCallback } from 'react'

// Types
export interface CarAnalysisResult {
    // Core Vehicle Info
    brand: string               // ยี่ห้อ: Honda, Toyota, Mercedes
    model: string               // รุ่น: Civic, Yaris, C-Class
    subModel?: string           // รุ่นย่อย: 1.8 EL, Turbo RS
    year?: string               // ปี: 2568, 2567
    color?: string              // สี: white, black, red
    bodyType?: string           // ประเภทตัวถัง: sedan, suv, pickup

    // Condition
    condition: 'new' | 'like_new' | 'good' | 'fair' | 'poor'
    conditionScore: number      // 0-100
    conditionDetails?: string

    // Specs
    engineSize?: string         // เครื่องยนต์: 1.5, 2.0, 3.0
    transmission?: string       // เกียร์: auto, manual
    fuelType?: string           // เชื้อเพลิง: gasoline, diesel, hybrid, ev

    // Price Estimation
    estimatedPrice: {
        min: number
        max: number
        suggested: number
    }

    // Detection Confidence
    confidence: number          // 0-1
    detectedFeatures: string[]  // สิ่งที่ตรวจพบ

    // For form auto-fill
    formData: Record<string, string>
}

// Car Analysis Prompt (Thai-focused)
const CAR_ANALYSIS_PROMPT = `คุณเป็น AI ผู้เชี่ยวชาญรถยนต์ในตลาดประเทศไทย วิเคราะห์ภาพรถนี้และตอบเป็น JSON

**📸 สิ่งที่ต้องตรวจจับ:**
1. **แบรนด์** - อ่านจากโลโก้ หน้ารถ ฝากระโปรง ท้ายรถ
2. **รุ่น** - อ่านจากป้ายชื่อรุ่นที่ท้ายรถ ด้านข้าง
3. **ปี/ปีที่ผลิต** - ประมาณจากดีไซน์ไฟหน้า/ท้าย กระจังหน้า
4. **สี** - สีตัวรถหลัก
5. **ประเภทตัวถัง** - sedan, suv, pickup, hatchback, van, coupe
6. **สภาพ** - ดูจากรอยขีดข่วน ความสะอาด สภาพยาง ไฟ

**🏷️ แบรนด์ยอดนิยมในไทย:**
- ญี่ปุ่น: Toyota, Honda, Isuzu, Mazda, Nissan, Mitsubishi, Suzuki
- ยุโรป: Mercedes-Benz, BMW, Audi, Volvo, Volkswagen, Porsche
- อเมริกา: Ford, Chevrolet, Jeep
- เกาหลี: Hyundai, Kia
- จีน: MG, Great Wall, BYD, Changan, Haval
- อื่นๆ: Mini, Land Rover, Jaguar, Lexus, Subaru

**📊 ตอบเป็น JSON นี้:**
{
  "brand": "ยี่ห้อ (เช่น Toyota, Honda)",
  "model": "รุ่น (เช่น Yaris, Civic)",
  "subModel": "รุ่นย่อย/แพ็คเกจ (เช่น 1.5 S, EL CVT) หรือ null",
  "year": "ปี พ.ศ. (เช่น 2567) หรือ null ถ้าไม่แน่ใจ",
  "color": "สี (white, black, silver, gray, red, blue, green, brown, gold, orange, other)",
  "bodyType": "sedan|suv|pickup|hatchback|van|coupe|convertible|mpv",
  
  "condition": "new|like_new|good|fair|poor",
  "conditionScore": 0-100,
  "conditionDetails": "รายละเอียดสภาพ เช่น สะอาด ไม่มีรอย",
  
  "engineSize": "ขนาดเครื่อง เช่น 1.5, 2.0 หรือ null",
  "transmission": "auto|manual หรือ null",
  "fuelType": "gasoline|diesel|hybrid|ev|lpg หรือ null",
  
  "estimatedPrice": {
    "min": 200000,
    "max": 350000,
    "suggested": 280000
  },
  
  "confidence": 0.95,
  "detectedFeatures": ["โลโก้ Toyota", "ป้าย Yaris", "ไฟ LED", "ล้อแม็ก"]
}

**⚠️ กฎสำคัญ:**
- ถ้าไม่เห็นชัด ให้ใส่ null หรือประมาณจากดีไซน์
- ราคาประมาณจากตลาดรถมือสองในไทย ปี 2567
- ปีต้องเป็น พ.ศ. (เช่น 2565, 2567)
- ตอบแค่ JSON เท่านั้น ไม่ต้องมีข้อความอื่น`

// Analyze car photo using OpenAI Vision
export async function analyzeCarPhoto(imageBase64: string): Promise<CarAnalysisResult> {
    const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY

    if (!apiKey) {
        throw new Error('OpenAI API key not configured')
    }

    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: 'gpt-4o-mini', // Cost-effective vision model
                messages: [
                    {
                        role: 'user',
                        content: [
                            { type: 'text', text: CAR_ANALYSIS_PROMPT },
                            {
                                type: 'image_url',
                                image_url: {
                                    url: imageBase64.startsWith('data:')
                                        ? imageBase64
                                        : `data:image/jpeg;base64,${imageBase64}`,
                                    detail: 'high'
                                }
                            }
                        ]
                    }
                ],
                max_tokens: 1000,
                temperature: 0.3,
            })
        })

        if (!response.ok) {
            const error = await response.json()
            throw new Error(error.error?.message || 'API request failed')
        }

        const data = await response.json()
        const content = data.choices?.[0]?.message?.content || ''

        // Parse JSON from response
        const jsonMatch = content.match(/\{[\s\S]*\}/)
        if (!jsonMatch) {
            throw new Error('Invalid response format')
        }

        const parsed = JSON.parse(jsonMatch[0])

        // Map to CarAnalysisResult
        const result: CarAnalysisResult = {
            brand: parsed.brand || '',
            model: parsed.model || '',
            subModel: parsed.subModel,
            year: parsed.year,
            color: parsed.color,
            bodyType: parsed.bodyType,
            condition: parsed.condition || 'good',
            conditionScore: parsed.conditionScore || 70,
            conditionDetails: parsed.conditionDetails,
            engineSize: parsed.engineSize,
            transmission: parsed.transmission,
            fuelType: parsed.fuelType,
            estimatedPrice: parsed.estimatedPrice || { min: 0, max: 0, suggested: 0 },
            confidence: parsed.confidence || 0.5,
            detectedFeatures: parsed.detectedFeatures || [],
            // Map to form fields
            formData: {
                brand: parsed.brand || '',
                model: parsed.model || '',
                sub_model: parsed.subModel || '',
                year: parsed.year || '',
                color: mapColorToValue(parsed.color),
                body_type: mapBodyTypeToValue(parsed.bodyType),
                transmission: parsed.transmission || '',
                fuel_type: parsed.fuelType || '',
                condition: parsed.condition || 'good',
            }
        }

        return result

    } catch (error) {
        console.error('Car analysis error:', error)
        throw error
    }
}

// Helper: Map color to form value
function mapColorToValue(color: string | undefined): string {
    if (!color) return ''
    const colorMap: Record<string, string> = {
        'white': 'white',
        'ขาว': 'white',
        'white_pearl': 'white_pearl',
        'ขาวมุก': 'white_pearl',
        'black': 'black',
        'ดำ': 'black',
        'silver': 'silver',
        'เงิน': 'silver',
        'gray': 'gray',
        'grey': 'gray',
        'เทา': 'gray',
        'red': 'red',
        'แดง': 'red',
        'blue': 'blue',
        'น้ำเงิน': 'blue',
        'green': 'green',
        'เขียว': 'green',
        'brown': 'brown',
        'น้ำตาล': 'brown',
        'gold': 'gold',
        'ทอง': 'gold',
        'orange': 'orange',
        'ส้ม': 'orange',
    }
    return colorMap[color.toLowerCase()] || 'other'
}

// Helper: Map body type to form value
function mapBodyTypeToValue(bodyType: string | undefined): string {
    if (!bodyType) return ''
    const typeMap: Record<string, string> = {
        'sedan': 'sedan',
        'suv': 'suv',
        'pickup': 'pickup',
        'hatchback': 'hatchback',
        'van': 'van',
        'coupe': 'coupe',
        'convertible': 'convertible',
        'mpv': 'van',
    }
    return typeMap[bodyType.toLowerCase()] || ''
}

// Helper: Convert File to Base64
export async function fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result as string)
        reader.onerror = reject
        reader.readAsDataURL(file)
    })
}

// React Hook for Car Analysis
export function useCarAnalysis() {
    const [isAnalyzing, setIsAnalyzing] = useState(false)
    const [result, setResult] = useState<CarAnalysisResult | null>(null)
    const [error, setError] = useState<string | null>(null)

    const analyze = useCallback(async (file: File) => {
        setIsAnalyzing(true)
        setError(null)

        try {
            const base64 = await fileToBase64(file)
            const analysis = await analyzeCarPhoto(base64)
            setResult(analysis)
            return analysis
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Analysis failed'
            setError(message)
            throw err
        } finally {
            setIsAnalyzing(false)
        }
    }, [])

    const reset = useCallback(() => {
        setResult(null)
        setError(null)
    }, [])

    return {
        isAnalyzing,
        result,
        error,
        analyze,
        reset
    }
}
