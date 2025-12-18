# 🔧 Gemini API Model Issue - Solutions

## ❌ **ปัญหา:**
```
[GoogleGenerativeAI Error]: models/gemini-1.5-pro is not found for API version v1beta
```

## 🔍 **สาเหตุ:**

SDK version ที่ติดตั้งมาไม่รองรับ Gemini 1.5 models หรือ API key ไม่มีสิทธิ์เข้าถึง

---

## ✅ **Solution 1: อัพเดท SDK (แนะนำ!)**

### **Step 1: อัพเดท Package**
```bash
npm install @google/generative-ai@latest --legacy-peer-deps
```

### **Step 2: Check Version**
```bash
npm list @google/generative-ai
```

ควรได้ version >= 0.21.0

### **Step 3: Restart Server**
```bash
npm run dev
```

---

## ✅ **Solution 2: ใช้ Text-Only Analysis (Workaround)**

ถ้าไม่อยากอัพเดท SDK สามารถใช้ text-based analysis แทน:

### **แก้ไข `ai-vision-service.ts`:**

```typescript
// เปลี่ยนจาก vision analysis เป็น text description
async analyzeImage(imageFile: File): Promise<VisionAnalysisResult> {
  // Convert image to temporary description
  const mockAnalysis = {
    prohibited: {
      isProhibited: false,
      reason: null
    },
    analysis: {
      title: `สินค้า ${imageFile.name.split('.')[0]}`,
      description: 'กรุณาเพิ่มคำอธิบายสินค้า',
      suggestedCategory: 'อื่นๆ',
      keywords: [],
      estimatedCondition: 'used' as const,
      estimatedPrice: {
        min: 100,
        max: 1000,
        suggested: 500
      },
      detectedObjects: [],
      detectedText: null,
      detectedBrands: []
    },
    raw: 'Mock analysis - upgrade SDK for full AI features'
  }
  
  return mockAnalysis
}
```

**ข้อเสีย:** ไม่มี AI analysis จริง แค่ placeholder

---

## ✅ **Solution 3: ใช้ Alternative API (แนะนำถ้า Solution 1 ไม่ได้)**

### **ใช้ OpenAI GPT-4 Vision แทน:**

```bash
npm install openai --legacy-peer-deps
```

### **แก้ env:**
```env
NEXT_PUBLIC_OPENAI_API_KEY=sk-...
```

### **สร้างไฟล์ใหม่ `openai-vision-service.ts`:**

```typescript
import OpenAI from 'openai'

export class OpenAIVisionService {
  private client: OpenAI
  
  constructor(apiKey?: string) {
    this.client = new OpenAI({
      apiKey: apiKey || process.env.NEXT_PUBLIC_OPENAI_API_KEY,
      dangerouslyAllowBrowser: true // For client-side use
    })
  }
  
  async analyzeImage(imageFile: File) {
    // Convert to base64
    const base64 = await this.fileToBase64(imageFile)
    
    const response = await this.client.chat.completions.create({
      model: 'gpt-4-vision-preview',
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: `วิเคราะห์รูปสินค้านี้และตอบเป็น JSON:
              {
                "title": "ชื่อสินค้า",
                "description": "คำอธิบาย",
                "category": "หมวดหมู่",
                "price": 1000,
                "isProhibited": false
              }`
            },
            {
              type: 'image_url',
              image_url: {
                url: `data:image/jpeg;base64,${base64}`
              }
            }
          ]
        }
      ]
    })
    
    const text = response.choices[0].message.content
    return JSON.parse(text)
  }
  
  private async fileToBase64(file: File): Promise<string> {
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.onload = () => {
        const base64 = (reader.result as string).split(',')[1]
        resolve(base64)
      }
      reader.readAsDataURL(file)
    })
  }
}
```

**ข้อดี:**
- ใช้งานได้แน่นอน
- คุณภาพดีมาก

**ข้อเสีย:**
- ต้องจ่ายเงิน (~$0.01/image)
- ต้องสร้าง OpenAI account

---

## 🎯 **คำแนะนำ:**

### **สำหรับ Development:**
**ใช้ Solution 2 (Mock)** ก่อน → ทำให้ระบบทำงานได้ ส่วน AI มาทำทีหลัง

### **สำหรับ Production:**
**ใช้ Solution 1 (Update SDK)** หรือ **Solution 3 (OpenAI)**

---

## 🚀 **Quick Fix ตอนนี้:**

ให้คุณเลือก:

### **Option A: อัพเดท SDK (5 นาที)**
```bash
npm install @google/generative-ai@latest --legacy-peer-deps
npm run dev
```
ลอง refresh + upload ใหม่

### **Option B: ใช้ Mock ก่อน (2 นาที)**
ผมจะแก้ code ให้ skip AI vision และใช้ manual input ก่อน

### **Option C: ลอง OpenAI (10 นาที)**
สมัคร OpenAI API key แล้วใช้ GPT-4 Vision

---

**คุณต้องการทำแบบไหนครับ?** 
- A = อัพเดท SDK
- B = ใช้ Mock ก่อน  
- C = ใช้ OpenAI

บอกมาได้เลยครับ! 🎯
