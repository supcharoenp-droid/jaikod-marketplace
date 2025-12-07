# 🎨 AI Product Data System - Visual Overview

> ภาพรวมระบบแบบ Visual สำหรับเข้าใจง่าย

---

## 📁 โครงสร้างไฟล์ทั้งหมด

```
jaikod/
│
├── 📂 src/
│   ├── 📂 config/
│   │   └── 📄 category-schemas.ts          ⭐ Schema ของแต่ละหมวดหมู่
│   │
│   ├── 📂 lib/
│   │   ├── 📄 ai-price-estimator.ts        ⭐ ระบบประเมินราคา
│   │   └── 📄 ai-description-generator.ts  ⭐ ระบบสร้างรายละเอียด
│   │
│   └── 📂 components/
│       └── 📂 sell/
│           └── 📄 DynamicProductForm.tsx   ⭐ ฟอร์มแบบ Dynamic
│
└── 📂 docs/
    ├── 📄 AI_SYSTEM_INDEX.md               📚 Index หลัก
    ├── 📄 AI_FAQ_ANSWERS.md                ❓ คำตอบคำถาม
    ├── 📄 ai-system-README.md              📖 README หลัก
    ├── 📄 ai-product-data-system.md        📘 เอกสารเต็ม
    ├── 📄 ai-system-summary.md             📊 สรุประบบ
    ├── 📄 ai-quick-start.md                ⚡ Quick Start
    └── 📄 category-comparison.md           📊 เปรียบเทียบหมวดหมู่
```

---

## 🔄 Flow การทำงานของระบบ

```
┌─────────────────────────────────────────────────────────────────┐
│                    JAIKOD AI PRODUCT SYSTEM                     │
└─────────────────────────────────────────────────────────────────┘

1️⃣ ผู้ขายเลือกหมวดหมู่
   ┌──────────────────────────────────────────────┐
   │  📱 โทรศัพท์  💻 คอมพิวเตอร์  🐾 สัตว์เลี้ยง  📸 กล้อง  │
   └──────────────────────────────────────────────┘
                      │
                      ▼
2️⃣ ระบบโหลด Schema
   ┌──────────────────────────────────────────────┐
   │  getCategorySchema(categoryId)               │
   │  → ดึง Attributes, Price Factors, Template  │
   └──────────────────────────────────────────────┘
                      │
                      ▼
3️⃣ แสดงฟอร์มแบบ Dynamic
   ┌──────────────────────────────────────────────┐
   │  <DynamicProductForm>                        │
   │  → แสดงฟิลด์ตาม Schema                       │
   │  → ยี่ห้อ, รุ่น, สเปค, สภาพ, ฯลฯ            │
   └──────────────────────────────────────────────┘
                      │
                      ▼
4️⃣ ผู้ขายกรอกข้อมูล
   ┌──────────────────────────────────────────────┐
   │  formData = {                                │
   │    brand: "Apple",                           │
   │    model: "iPhone 14 Pro",                   │
   │    storage: "256GB",                         │
   │    condition: "มือสอง สภาพดีมาก",            │
   │    batteryHealth: 88                         │
   │  }                                           │
   └──────────────────────────────────────────────┘
                      │
          ┌───────────┴───────────┐
          │                       │
          ▼                       ▼
5️⃣ AI ประเมินราคา        6️⃣ AI เขียนรายละเอียด
┌─────────────────┐      ┌─────────────────┐
│ estimatePrice() │      │ generateDesc()  │
│                 │      │                 │
│ Input:          │      │ Input:          │
│ • categoryId    │      │ • categoryId    │
│ • attributes    │      │ • attributes    │
│ • originalPrice │      │ • tone          │
│                 │      │                 │
│ Output:         │      │ Output:         │
│ • price: 36,800 │      │ • title         │
│ • range         │      │ • description   │
│ • confidence    │      │ • highlights    │
│ • factors       │      │ • tags          │
│ • recommend     │      │ • seoKeywords   │
└─────────────────┘      └─────────────────┘
          │                       │
          └───────────┬───────────┘
                      ▼
7️⃣ แสดงผลลัพธ์
   ┌──────────────────────────────────────────────┐
   │  💰 ราคาแนะนำ: ฿36,800                       │
   │  📊 ช่วงราคา: ฿31,280 - ฿42,320              │
   │  ✅ ความมั่นใจ: 85%                          │
   │                                              │
   │  ✨ รายละเอียดที่ AI สร้าง:                  │
   │  📝 หัวข้อ: Apple iPhone 14 Pro 256GB...    │
   │  📄 รายละเอียด: 🔥 Apple iPhone 14 Pro...   │
   │  🏷️ แท็ก: โทรศัพท์มือถือ, Apple, ...        │
   └──────────────────────────────────────────────┘
                      │
                      ▼
8️⃣ บันทึกสินค้า
   ┌──────────────────────────────────────────────┐
   │  saveProduct({                               │
   │    ...formData,                              │
   │    price: 36800,                             │
   │    title: "Apple iPhone 14 Pro 256GB...",    │
   │    description: "🔥 Apple iPhone...",        │
   │    tags: [...],                              │
   │    seoKeywords: [...]                        │
   │  })                                          │
   └──────────────────────────────────────────────┘
                      │
                      ▼
9️⃣ ✅ สินค้าถูกลงขายสำเร็จ!
```

---

## 🗂️ หมวดหมู่สินค้าทั้ง 4 หมวด

```
┌─────────────────────────────────────────────────────────────────┐
│                     CATEGORY SCHEMAS                            │
└─────────────────────────────────────────────────────────────────┘

📱 โทรศัพท์มือถือ (mobiles)
├── Attributes: 10 ฟิลด์
│   ├── ✅ ยี่ห้อ (Brand) - Critical
│   ├── ✅ รุ่น (Model) - Critical
│   ├── ✅ ความจุ (Storage) - High
│   ├── ✅ สภาพ (Condition) - Critical
│   ├── 🔋 แบตเตอรี่ (Battery Health) - High
│   └── 📦 อุปกรณ์ (Accessories) - Medium
├── Price Factors:
│   ├── อายุการใช้งาน (30%)
│   ├── ค่าแบรนด์ (25%)
│   ├── สภาพเครื่อง (20%)
│   ├── สุขภาพแบตเตอรี่ (15%)
│   └── ความต้องการตลาด (10%)
├── Depreciation: 25%/ปี
└── Price Range: ฿1,000 - ฿80,000

💻 คอมพิวเตอร์ (computers)
├── Attributes: 11 ฟิลด์
│   ├── ✅ ประเภท (Type) - Critical
│   ├── ✅ CPU (Processor) - High
│   ├── ✅ RAM - High
│   ├── ✅ Storage - High
│   ├── 🎮 GPU - High
│   └── ✅ สภาพ (Condition) - Critical
├── Price Factors:
│   ├── ประสิทธิภาพสเปค (35%)
│   ├── อายุการใช้งาน (25%)
│   ├── ค่าแบรนด์ (15%)
│   ├── สภาพเครื่อง (15%)
│   └── ความต้องการตลาด (10%)
├── Depreciation: 20%/ปี
└── Price Range: ฿5,000 - ฿150,000

🐾 สัตว์เลี้ยง (pets)
├── Attributes: 10 ฟิลด์
│   ├── ✅ ประเภทสัตว์ (Pet Type) - Critical
│   ├── ✅ สายพันธุ์ (Breed) - Critical
│   ├── ✅ อายุ (Age) - High
│   ├── ✅ วัคซีน (Vaccinated) - Critical
│   ├── ✅ สุขภาพ (Health) - Critical
│   └── 😊 นิสัย (Personality) - High
├── Price Factors:
│   ├── ความหายากของสายพันธุ์ (30%)
│   ├── สุขภาพและวัคซีน (25%)
│   ├── อายุ (20%)
│   ├── ใบเพ็ดดิกรี (15%)
│   └── ความนิยม (10%)
├── Depreciation: 0%/ปี
└── Price Range: ฿500 - ฿50,000

📸 กล้องถ่ายรูป (cameras)
├── Attributes: 9 ฟิลด์
│   ├── ✅ ประเภท (Type) - Critical
│   ├── ✅ ยี่ห้อ (Brand) - Critical
│   ├── ✅ รุ่น (Model) - Critical
│   ├── 📷 เซ็นเซอร์ (Sensor) - High
│   ├── 🔢 Shutter Count - High
│   └── ✅ สภาพ (Condition) - Critical
├── Price Factors:
│   ├── ยี่ห้อและรุ่น (30%)
│   ├── Shutter Count (25%)
│   ├── อายุการใช้งาน (20%)
│   ├── สภาพเครื่อง (15%)
│   └── ความต้องการตลาด (10%)
├── Depreciation: 15%/ปี
└── Price Range: ฿2,000 - ฿200,000
```

---

## 💰 ตัวอย่างการคำนวณราคา

```
┌─────────────────────────────────────────────────────────────────┐
│         PRICE ESTIMATION EXAMPLE: iPhone 14 Pro 256GB           │
└─────────────────────────────────────────────────────────────────┘

📥 INPUT
├── Brand: Apple
├── Model: iPhone 14 Pro
├── Storage: 256GB
├── Condition: มือสอง สภาพดีมาก
├── Battery Health: 88%
├── Purchase Date: 2023-01-15 (อายุ 1.9 ปี)
└── Original Price: ฿42,900

⚙️ CALCULATION
├── 1. Base Price = ฿42,900
│
├── 2. Apply Price Factors:
│   ├── ค่าแบรนด์ (Apple = +15%)
│   │   → +15% × 0.25 = +3.75%
│   │
│   ├── อายุ 1.9 ปี (ลด 25%/ปี)
│   │   → -47.5% × 0.30 = -14.25%
│   │
│   ├── สภาพดีมาก (0%)
│   │   → 0% × 0.20 = 0%
│   │
│   ├── แบต 88% (ลด 12%)
│   │   → -12% × 0.15 = -1.8%
│   │
│   └── ตลาด (0%)
│       → 0% × 0.10 = 0%
│
├── 3. Total Impact = +3.75% - 14.25% - 1.8% = -12.3%
│
├── 4. Adjusted Price
│   → ฿42,900 × (1 - 0.123) = ฿37,624
│
└── 5. Market Adjustment (ถ้ามีข้อมูล)
    → (฿37,624 × 0.7) + (฿35,000 × 0.3)
    → ฿26,337 + ฿10,500
    → ฿36,837

📤 OUTPUT
├── Estimated Price: ฿36,800
├── Price Range: ฿31,280 - ฿42,320
├── Confidence: 85%
├── Factors Breakdown:
│   ├── ค่าแบรนด์: +3.75%
│   ├── อายุการใช้งาน: -14.25%
│   ├── สภาพเครื่อง: 0%
│   ├── สุขภาพแบตเตอรี่: -1.8%
│   └── ความต้องการตลาด: 0%
└── Recommendations:
    └── 📸 เพิ่มรูปภาพอย่างน้อย 5 รูปเพื่อดึงดูดผู้ซื้อ
```

---

## ✨ ตัวอย่าง AI Description

```
┌─────────────────────────────────────────────────────────────────┐
│              AI DESCRIPTION GENERATION EXAMPLE                  │
└─────────────────────────────────────────────────────────────────┘

📥 INPUT (โทรศัพท์มือถือ)
├── Brand: Apple
├── Model: iPhone 14 Pro
├── Storage: 256GB
├── Condition: มือสอง สภาพดีมาก
├── Battery Health: 88%
└── Accessories: [กล่อง, สายชาร์จ, เคส]

⚙️ PROCESSING
├── 1. Load Template: mobiles
│   → [intro] → [specs] → [condition] → [accessories] → [highlights] → [usage]
│
├── 2. Generate Each Section:
│   ├── [intro] → "🔥 Apple iPhone 14 Pro 256GB สภาพมือสอง..."
│   ├── [specs] → "📱 **สเปค**\n- ยี่ห้อ: Apple..."
│   ├── [condition] → "✨ **สภาพสินค้า**\n- สภาพ: มือสอง..."
│   ├── [accessories] → "📦 **อุปกรณ์ที่มาด้วย**..."
│   ├── [highlights] → "💎 **จุดเด่น**..."
│   └── [usage] → "👥 **เหมาะสำหรับ**..."
│
├── 3. Generate Title
│   → "Apple iPhone 14 Pro 256GB มือสอง สภาพดีมาก"
│
├── 4. Generate Highlights
│   → ["ยี่ห้อ: Apple", "รุ่น: iPhone 14 Pro", ...]
│
├── 5. Generate Tags
│   → ["โทรศัพท์มือถือ", "Apple", "iPhone 14 Pro", ...]
│
└── 6. Generate SEO Keywords
    → ["โทรศัพท์มือถือมือสอง", "Apple iPhone 14 Pro", ...]

📤 OUTPUT
├── Title: "Apple iPhone 14 Pro 256GB มือสอง สภาพดีมาก"
│
├── Description: (150-200 คำ)
│   "🔥 Apple iPhone 14 Pro 256GB สภาพมือสอง สภาพดีมาก พร้อมใช้งาน!
│   
│   📱 **สเปค**
│   - ยี่ห้อ: Apple
│   - รุ่น: iPhone 14 Pro
│   - ความจุ: 256GB
│   - สุขภาพแบตเตอรี่: 88%
│   
│   ✨ **สภาพสินค้า**
│   - สภาพ: มือสอง สภาพดีมาก
│   - ตัวเครื่อง: สวยมาก ไม่มีรอยขีดข่วน
│   - แบตเตอรี่สุขภาพดี (88%)
│   
│   📦 **อุปกรณ์ที่มาด้วย**
│   - กล่อง
│   - สายชาร์จ
│   - เคส
│   
│   💎 **จุดเด่น**
│   - 🔋 แบตเตอรี่สุขภาพดี
│   - 📱 พร้อมใช้งานทันที
│   
│   👥 **เหมาะสำหรับ**
│   - ใช้งานทั่วไป โซเชียล ถ่ายรูป
│   - คนที่ต้องการโทรศัพท์คุณภาพในราคาคุ้มค่า"
│
├── Highlights:
│   ├── "ยี่ห้อ: Apple"
│   ├── "รุ่น: iPhone 14 Pro"
│   ├── "ความจุ: 256GB"
│   ├── "สภาพ: มือสอง สภาพดีมาก"
│   └── "สุขภาพแบตเตอรี่: 88"
│
├── Tags:
│   ├── "โทรศัพท์มือถือ"
│   ├── "Apple"
│   ├── "iPhone 14 Pro"
│   ├── "256GB"
│   └── "มือสอง สภาพดีมาก"
│
└── SEO Keywords:
    ├── "โทรศัพท์มือถือ"
    ├── "โทรศัพท์มือถือมือสอง"
    ├── "ขายโทรศัพท์มือถือ"
    ├── "Apple iPhone 14 Pro"
    ├── "Apple iPhone 14 Pro มือสอง"
    ├── "ขาย Apple iPhone 14 Pro"
    ├── "โทรศัพท์มือสอง"
    ├── "มือถือมือสอง"
    └── "Apple 256GB"
```

---

## 📊 สถิติสรุป

```
┌─────────────────────────────────────────────────────────────────┐
│                    SYSTEM STATISTICS                            │
└─────────────────────────────────────────────────────────────────┘

📁 ไฟล์ที่สร้าง
├── Source Code: 4 ไฟล์
│   ├── category-schemas.ts (~1,200 บรรทัด)
│   ├── ai-price-estimator.ts (~600 บรรทัด)
│   ├── ai-description-generator.ts (~800 บรรทัด)
│   └── DynamicProductForm.tsx (~500 บรรทัด)
│
└── Documentation: 7 ไฟล์ (~93 KB)
    ├── AI_SYSTEM_INDEX.md
    ├── AI_FAQ_ANSWERS.md
    ├── ai-system-README.md
    ├── ai-product-data-system.md
    ├── ai-system-summary.md
    ├── ai-quick-start.md
    └── category-comparison.md

📊 หมวดหมู่สินค้า: 4 หมวด
├── 📱 โทรศัพท์มือถือ
├── 💻 คอมพิวเตอร์
├── 🐾 สัตว์เลี้ยง
└── 📸 กล้องถ่ายรูป

🔢 Attributes รวม: 40 ฟิลด์
├── โทรศัพท์: 10 ฟิลด์
├── คอมพิวเตอร์: 11 ฟิลด์
├── สัตว์เลี้ยง: 10 ฟิลด์
└── กล้อง: 9 ฟิลด์

⚖️ Price Factors รวม: 20 ปัจจัย
└── แต่ละหมวดหมู่: 5 ปัจจัย

📝 AI Templates: 4 Templates
└── โครงสร้างเฉลี่ย: 6 ส่วน/Template

💰 ช่วงราคารวม: ฿500 - ฿200,000
├── โทรศัพท์: ฿1,000 - ฿80,000
├── คอมพิวเตอร์: ฿5,000 - ฿150,000
├── สัตว์เลี้ยง: ฿500 - ฿50,000
└── กล้อง: ฿2,000 - ฿200,000
```

---

## 🎯 Quick Reference

### 🚀 เริ่มต้นใช้งาน
```typescript
// 1. Import
import { getCategorySchema, estimatePrice, generateProductDescription } from '@/lib/...';

// 2. ดึง Schema
const schema = getCategorySchema('mobiles');

// 3. ประเมินราคา
const price = await estimatePrice({ categoryId, attributes, originalPrice });

// 4. สร้างรายละเอียด
const desc = await generateProductDescription({ categoryId, attributes });

// 5. บันทึก
await saveProduct({ ...formData, ...price, ...desc });
```

### 📚 เอกสารทั้งหมด
- 📖 [AI System README](./ai-system-README.md)
- ❓ [FAQ Answers](./AI_FAQ_ANSWERS.md)
- 📘 [Full Documentation](./ai-product-data-system.md)
- 📊 [System Summary](./ai-system-summary.md)
- ⚡ [Quick Start](./ai-quick-start.md)
- 📊 [Category Comparison](./category-comparison.md)
- 📚 [Documentation Index](./AI_SYSTEM_INDEX.md)

---

**สร้างด้วย ❤️ โดยทีม JaiKod**

*Last Updated: 2024-12-07*
