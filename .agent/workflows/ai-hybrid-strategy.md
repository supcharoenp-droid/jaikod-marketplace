---
description: AI Hybrid Model Strategy - 2-Layer Pipeline Architecture (IMPLEMENTED ✅)
---

# 🤖 AI Hybrid Model Strategy - JaiKod Marketplace (v3.0)

## 📐 Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                        USER UPLOADS IMAGE                           │
└─────────────────────────────────────────────────────────────────────┘
                                   │
                                   ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    🔵 LAYER 1: VISION ANALYSIS                       │
│                        (gpt-4o-mini)                                │
│                                                                     │
│  ✅ CAN DO:                         ❌ CANNOT DO:                   │
│  • Analyze image content            • Set prices                    │
│  • Detect brand/model               • Calculate pricing factors     │
│  • Identify condition               • Risk assessment               │
│  • Extract text from image          • Category decision             │
│  • Describe visible features        • Content moderation            │
│                                                                     │
│  📤 OUTPUT: Vision JSON Schema                                       │
└─────────────────────────────────────────────────────────────────────┘
                                   │
                                   ▼
                    ┌─────────────────────────────┐
                    │      📄 VISION JSON          │
                    │  {                          │
                    │    detectedBrand: "Honda",  │
                    │    detectedModel: "CB650R", │
                    │    detectedYear: 2022,      │
                    │    detectedColor: "แดง",    │
                    │    visibleCondition: "ดี",   │
                    │    detectedFeatures: [...], │
                    │    extractedTexts: [...],   │
                    │    confidenceScore: 0.85    │
                    │  }                          │
                    └─────────────────────────────┘
                                   │
                                   ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    🟢 LAYER 2: INTELLIGENCE                          │
│                        (gpt-4.1-nano)                               │
│                                                                     │
│  ✅ CAN DO:                         ❌ CANNOT DO:                   │
│  • Analyze Vision JSON              • Access images directly        │
│  • Determine category               • Re-analyze image              │
│  • Calculate price range            • Override Vision JSON          │
│  • Risk assessment                                                  │
│  • Content moderation                                               │
│  • Generate title/description                                       │
│                                                                     │
│  📤 OUTPUT: Complete Listing Recommendation                         │
└─────────────────────────────────────────────────────────────────────┘
                                   │
                                   ▼
┌─────────────────────────────────────────────────────────────────────┐
│                     📊 FINAL OUTPUT                                  │
│  {                                                                  │
│    suggestedCategory: { id: 1, subcategory: 102 },                 │
│    suggestedTitle: "Honda CB650R ปี 2022 สีแดง สภาพดี",             │
│    priceRange: { min: 230000, suggested: 265000, max: 290000 },   │
│    riskAssessment: { level: "low", flags: [] },                    │
│    confidence: 0.92                                                 │
│  }                                                                  │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 🎯 Layer 1: Vision Analysis (gpt-4o-mini)

### Purpose
Analyze images ONLY and extract visual information into structured JSON.

### Model Selection
- **Primary**: `gpt-4o-mini` ($0.15/1M input, $0.60/1M output)
- **Alternative**: `gpt-4.1-mini` (better vision but 2.5x cost)

### Input
```typescript
interface VisionInput {
    images: string[]           // Base64 encoded images
    imageCount: number
    language: 'th' | 'en'
}
```

### Output Schema (Vision JSON)
```typescript
interface VisionJSON {
    // === Detected Objects ===
    detectedBrand: string | null
    detectedModel: string | null
    detectedYear: number | null
    detectedColor: string | null
    detectedSize: string | null       // For electronics: "55 นิ้ว"
    
    // === Condition Assessment ===
    visibleCondition: 'new' | 'like_new' | 'good' | 'fair' | 'poor'
    conditionNotes: string[]          // ["มีรอยขีดข่วนเล็กน้อย", "หน้าจอสมบูรณ์"]
    visibleDefects: string[]          // Specific defects spotted
    
    // === Features ===
    detectedFeatures: string[]        // ["Inverter", "Smart TV", "WiFi"]
    detectedAccessories: string[]     // ["กล่อง", "ที่ชาร์จ", "เคส"]
    
    // === Extracted Text (OCR) ===
    extractedTexts: string[]          // Text visible in image
    
    // === Category Hints ===
    productType: string               // "motorcycle", "tv", "phone"
    categoryHints: string[]           // Keywords for Layer 2
    
    // === Confidence ===
    confidenceScore: number           // 0-1
    imageQuality: 'high' | 'medium' | 'low'
}
```

### Prompt Structure
```typescript
const LAYER1_PROMPT = `
คุณคือ AI Vision ที่วิเคราะห์ภาพสินค้าเท่านั้น

## หน้าที่ของคุณ:
✅ ดูภาพและบอกสิ่งที่เห็น (ยี่ห้อ, รุ่น, สี, สภาพ, ฟีเจอร์)
✅ เดาข้อมูลที่เห็นได้ชัดเจน
✅ อ่านข้อความในภาพ (ป้าย, สติ๊กเกอร์)
✅ ประเมินคุณภาพภาพ

## สิ่งที่คุณห้ามทำ:
❌ ห้ามตั้งราคา หรือประเมินมูลค่า
❌ ห้ามเลือกหมวดหมู่
❌ ห้ามประเมินความเสี่ยง
❌ ห้ามสรุปว่าควรขายหรือไม่

ตอบเป็น JSON ตาม schema ที่กำหนดเท่านั้น
`
```

---

## 🎯 Layer 2: Intelligence Analysis (gpt-4.1-nano)

### Purpose
Use Vision JSON to determine category, pricing, and risk - WITHOUT accessing images.

### Model Selection
- **Primary**: `gpt-4.1-nano` ($0.10/1M input, $0.40/1M output)
- **Fallback**: `gpt-4o-mini`

### Input
```typescript
interface IntelligenceInput {
    visionJSON: VisionJSON           // From Layer 1
    userTitle?: string               // User-provided title (if any)
    userCategory?: number            // User-selected category (if any)
    userSpecs?: Record<string, any>  // Additional specs from form
}
```

### Output Schema
```typescript
interface IntelligenceOutput {
    // === Category ===
    suggestedCategory: {
        id: number
        name_th: string
        subcategoryId?: number
        subcategoryName?: string
        confidence: number
    }
    
    // === Pricing ===
    priceRange: {
        min: number
        suggested: number
        max: number
        currency: 'THB'
        reasoning: string[]
        confidence: number
    }
    
    // === Content ===
    suggestedTitle: {
        th: string
        en: string
    }
    suggestedDescription: string
    
    // === Risk Assessment ===
    riskAssessment: {
        level: 'low' | 'medium' | 'high' | 'blocked'
        flags: string[]              // ["ราคาสูงผิดปกติ", "อาจเป็นของปลอม"]
        contentWarnings: string[]
    }
    
    // === Overall ===
    overallConfidence: number
    processingNotes: string[]
}
```

### Prompt Structure
```typescript
const LAYER2_PROMPT = `
คุณคือ AI Analyst ที่วิเคราะห์ข้อมูลสินค้าจาก Vision JSON

## หน้าที่ของคุณ:
✅ กำหนดหมวดหมู่ที่เหมาะสม
✅ ประเมินช่วงราคาตามตลาดไทย
✅ ตรวจสอบความเสี่ยง (ของผิดกฎหมาย, ของปลอม)
✅ สร้างชื่อและคำอธิบาย

## สิ่งที่คุณห้ามทำ:
❌ ห้ามขอดูรูปภาพ
❌ ห้ามแก้ไขข้อมูลจาก Vision JSON
❌ ห้ามเดาข้อมูลที่ไม่มีใน JSON

## ข้อมูลจาก Vision:
{visionJSON}

วิเคราะห์และตอบเป็น JSON ตาม schema ที่กำหนด
`
```

---

## 💰 Cost Comparison

### Current (Single Model)
| Task | Model | Input Tokens | Output Tokens | Cost/Request |
|------|-------|-------------|---------------|--------------|
| Full Analysis | gpt-4o-mini | ~2000 | ~500 | ~$0.0006 |

### Proposed (2-Layer Pipeline)
| Layer | Model | Input Tokens | Output Tokens | Cost/Request |
|-------|-------|-------------|---------------|--------------|
| Layer 1 | gpt-4o-mini | ~1500 | ~400 | ~$0.0005 |
| Layer 2 | gpt-4.1-nano | ~800 | ~600 | ~$0.0003 |
| **TOTAL** | | | | **~$0.0008** |

**Result**: ~33% increase per request BUT:
- Better accuracy
- Cleaner separation
- Easier debugging
- Flexible model switching

---

## 🛠️ Implementation Files

### New Files to Create
```
src/lib/
├── ai-pipeline/
│   ├── index.ts              # Main pipeline orchestrator
│   ├── layer1-vision.ts      # gpt-4o-mini vision analysis
│   ├── layer2-intelligence.ts # gpt-4.1-nano analysis
│   ├── vision-schema.ts      # Vision JSON types
│   └── intelligence-schema.ts # Intelligence output types
```

### Integration Points
```typescript
// SmartListingPageV2.tsx
const analyzeProduct = async (images: string[]) => {
    // Step 1: Vision Analysis
    const visionJSON = await analyzeWithVision(images)  // gpt-4o-mini
    
    // Step 2: Intelligence Analysis  
    const result = await analyzeWithIntelligence(visionJSON)  // gpt-4.1-nano
    
    return result
}
```

---

## 🚀 Implementation Steps

### Phase 1: Core Pipeline
1. [ ] Create `vision-schema.ts` with VisionJSON interface
2. [ ] Create `layer1-vision.ts` with vision-only analysis
3. [ ] Create `intelligence-schema.ts` with output interface
4. [ ] Create `layer2-intelligence.ts` with pricing/category logic
5. [ ] Create `index.ts` pipeline orchestrator

### Phase 2: Integration
6. [ ] Update `openai-vision-service.ts` to use Layer 1
7. [ ] Update `ai-price-predictor.ts` to use Layer 2 output
8. [ ] Update `SmartListingPageV2.tsx` to use new pipeline

### Phase 3: Testing & Optimization
9. [ ] Test with various product types
10. [ ] Fine-tune prompts for accuracy
11. [ ] Monitor costs and performance

---

## ⚠️ Note on gpt-5-nano

As of December 2024, `gpt-5-nano` is not yet available. Alternatives:
- **gpt-4.1-nano**: Currently available, similar purpose
- **gpt-o3-mini**: Coming soon, may be suitable

We can start with `gpt-4.1-nano` and migrate when `gpt-5-nano` releases.
