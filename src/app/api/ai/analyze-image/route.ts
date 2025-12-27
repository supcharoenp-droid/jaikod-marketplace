import { NextResponse } from 'next/server'
import { CATEGORIES } from '@/constants/categories'

// Support both server-side and client-side env variable names
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || process.env.NEXT_PUBLIC_OPENAI_API_KEY

export async function POST(request: Request) {
    try {
        const { image, language = 'th' } = await request.json()

        if (!image) {
            return NextResponse.json({ error: 'No image provided' }, { status: 400 })
        }

        if (!OPENAI_API_KEY) {
            return NextResponse.json({ error: 'OpenAI API key not configured' }, { status: 500 })
        }

        // Extract base64 data if it includes the data URL prefix
        const base64Image = image.includes('base64,')
            ? image.split('base64,')[1]
            : image

        const systemPrompt = language === 'th'
            ? `คุณเป็นผู้เชี่ยวชาญด้านการวิเคราะห์สินค้าสำหรับตลาดซื้อขายออนไลน์ในประเทศไทย
               วิเคราะห์รูปภาพและตอบกลับเป็น JSON ที่มีโครงสร้างดังนี้:
               {
                 "title": "ชื่อสินค้าที่น่าสนใจ (ภาษาไทย)",
                 "category": "หมวดหมู่ (เช่น ยานยนต์, มือถือและแท็บเล็ต, เครื่องใช้ไฟฟ้า)",
                 "price": ราคาประมาณการ (ตัวเลข),
                 "description": "รายละเอียดสินค้า (ภาษาไทย)",
                 "condition": "สภาพสินค้า (ใหม่/ดีมาก/ดี/พอใช้)",
                 "confidence": เปอร์เซ็นต์ความมั่นใจ (1-100)
               }`
            : `You are an expert product analyzer for an online marketplace in Thailand.
               Analyze the image and respond with JSON in this structure:
               {
                 "title": "Attractive product title",
                 "category": "Category (e.g. Automotive, Mobiles & Tablets, Home Appliances)",
                 "price": estimated price (number in THB),
                 "description": "Product description",
                 "condition": "Product condition (New/Excellent/Good/Fair)",
                 "confidence": confidence percentage (1-100)
               }`

        // Use fetch directly instead of openai SDK
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: 'gpt-4o-mini',
                messages: [
                    {
                        role: 'system',
                        content: systemPrompt
                    },
                    {
                        role: 'user',
                        content: [
                            {
                                type: 'text',
                                text: language === 'th'
                                    ? 'วิเคราะห์รูปภาพนี้และให้ข้อมูลสำหรับลงขายในตลาดออนไลน์ ตอบเป็น JSON เท่านั้น'
                                    : 'Analyze this image and provide information for listing in an online marketplace. Respond with JSON only.'
                            },
                            {
                                type: 'image_url',
                                image_url: {
                                    url: `data:image/jpeg;base64,${base64Image}`,
                                    detail: 'high'
                                }
                            }
                        ]
                    }
                ],
                max_tokens: 1000,
                response_format: { type: 'json_object' }
            })
        })

        if (!response.ok) {
            throw new Error(`OpenAI API error: ${response.status}`)
        }

        const data = await response.json()
        const content = data.choices?.[0]?.message?.content

        if (!content) {
            throw new Error('No response from AI')
        }

        const result = JSON.parse(content)

        // Map category to match our system
        const matchedCategory = findMatchingCategory(result.category, language)

        return NextResponse.json({
            title: result.title || '',
            category: matchedCategory || result.category,
            price: result.price || 0,
            description: result.description || '',
            condition: result.condition || (language === 'th' ? 'ดี' : 'Good'),
            confidence: result.confidence || 85
        })

    } catch (error) {
        console.error('AI Image Analysis Error:', error)
        return NextResponse.json(
            { error: 'Failed to analyze image' },
            { status: 500 }
        )
    }
}

function findMatchingCategory(categoryName: string, language: string): string {
    if (!categoryName) return language === 'th' ? 'ทั่วไป' : 'General'

    const lowerName = categoryName.toLowerCase()

    for (const cat of CATEGORIES) {
        if (cat.name_th.toLowerCase().includes(lowerName) ||
            cat.name_en.toLowerCase().includes(lowerName) ||
            lowerName.includes(cat.name_th.toLowerCase()) ||
            lowerName.includes(cat.name_en.toLowerCase())) {
            return language === 'th' ? cat.name_th : cat.name_en
        }
    }

    // Check for common keywords
    const categoryMappings: { [key: string]: { th: string, en: string } } = {
        'car': { th: 'ยานยนต์', en: 'Automotive' },
        'รถ': { th: 'ยานยนต์', en: 'Automotive' },
        'vehicle': { th: 'ยานยนต์', en: 'Automotive' },
        'honda': { th: 'ยานยนต์', en: 'Automotive' },
        'toyota': { th: 'ยานยนต์', en: 'Automotive' },
        'phone': { th: 'มือถือและแท็บเล็ต', en: 'Mobiles & Tablets' },
        'มือถือ': { th: 'มือถือและแท็บเล็ต', en: 'Mobiles & Tablets' },
        'iphone': { th: 'มือถือและแท็บเล็ต', en: 'Mobiles & Tablets' },
        'computer': { th: 'คอมพิวเตอร์และไอที', en: 'Computers & IT' },
        'คอม': { th: 'คอมพิวเตอร์และไอที', en: 'Computers & IT' },
        'laptop': { th: 'คอมพิวเตอร์และไอที', en: 'Computers & IT' },
        'fashion': { th: 'แฟชั่น', en: 'Fashion' },
        'เสื้อผ้า': { th: 'แฟชั่น', en: 'Fashion' },
        'appliance': { th: 'เครื่องใช้ไฟฟ้า', en: 'Home Appliances' },
        'เครื่องใช้ไฟฟ้า': { th: 'เครื่องใช้ไฟฟ้า', en: 'Home Appliances' },
        'property': { th: 'อสังหาริมทรัพย์', en: 'Real Estate' },
        'บ้าน': { th: 'อสังหาริมทรัพย์', en: 'Real Estate' },
        'house': { th: 'อสังหาริมทรัพย์', en: 'Real Estate' },
    }

    for (const [keyword, mapping] of Object.entries(categoryMappings)) {
        if (lowerName.includes(keyword)) {
            return language === 'th' ? mapping.th : mapping.en
        }
    }

    return categoryName
}
