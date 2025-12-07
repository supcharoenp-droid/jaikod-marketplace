# AI Product Data System - Quick Start Guide

## 🚀 เริ่มต้นใช้งาน 5 นาที

### 1️⃣ Import ไฟล์ที่จำเป็น

```typescript
// ใน Component ของคุณ
import { getCategorySchema } from '@/config/category-schemas';
import { estimatePrice } from '@/lib/ai-price-estimator';
import { generateProductDescription } from '@/lib/ai-description-generator';
```

---

### 2️⃣ ดึง Schema ของหมวดหมู่

```typescript
// ดึง Schema ทั้งหมด
const schema = getCategorySchema('mobiles');

console.log(schema.categoryName);  // "โทรศัพท์มือถือ"
console.log(schema.attributes);    // Array ของ Attributes
console.log(schema.priceFactors);  // Array ของ Price Factors
```

---

### 3️⃣ ประเมินราคาสินค้า

```typescript
const productData = {
  categoryId: 'mobiles',
  attributes: {
    brand: 'Apple',
    model: 'iPhone 14 Pro',
    storage: '256GB',
    condition: 'มือสอง สภาพดีมาก',
    batteryHealth: 88,
    warranty: 'หมดประกันแล้ว'
  },
  purchaseDate: new Date('2023-01-15'),
  originalPrice: 42900
};

const estimation = await estimatePrice(productData);

console.log('ราคาแนะนำ:', estimation.estimatedPrice);
console.log('ช่วงราคา:', estimation.priceRange);
console.log('ความมั่นใจ:', estimation.confidence);
console.log('ปัจจัย:', estimation.factors);
console.log('คำแนะนำ:', estimation.recommendations);
```

**Output:**
```json
{
  "estimatedPrice": 36800,
  "priceRange": { "min": 31280, "max": 42320 },
  "confidence": 0.85,
  "factors": [
    { "factor": "ค่าแบรนด์", "impact": 3.75, "description": "..." },
    { "factor": "อายุการใช้งาน", "impact": -14.25, "description": "..." },
    { "factor": "สภาพเครื่อง", "impact": 0, "description": "..." },
    { "factor": "สุขภาพแบตเตอรี่", "impact": -1.8, "description": "..." },
    { "factor": "ความต้องการตลาด", "impact": 0, "description": "..." }
  ],
  "recommendations": [
    "📸 เพิ่มรูปภาพอย่างน้อย 5 รูปเพื่อดึงดูดผู้ซื้อ"
  ]
}
```

---

### 4️⃣ สร้างรายละเอียดสินค้า

```typescript
const input = {
  categoryId: 'mobiles',
  attributes: {
    brand: 'Apple',
    model: 'iPhone 14 Pro',
    storage: '256GB',
    condition: 'มือสอง สภาพดีมาก',
    batteryHealth: 88,
    accessories: ['กล่อง', 'สายชาร์จ', 'เคส']
  },
  tone: 'casual' // หรือ 'professional', 'enthusiastic'
};

const description = await generateProductDescription(input);

console.log('หัวข้อ:', description.title);
console.log('รายละเอียด:', description.description);
console.log('จุดเด่น:', description.highlights);
console.log('แท็ก:', description.tags);
console.log('SEO:', description.seoKeywords);
```

**Output:**
```json
{
  "title": "Apple iPhone 14 Pro 256GB มือสอง สภาพดีมาก",
  "description": "🔥 Apple iPhone 14 Pro 256GB สภาพมือสอง สภาพดีมาก...",
  "highlights": [
    "ยี่ห้อ: Apple",
    "รุ่น: iPhone 14 Pro",
    "ความจุ: 256GB",
    "สภาพ: มือสอง สภาพดีมาก",
    "สุขภาพแบตเตอรี่: 88"
  ],
  "tags": [
    "โทรศัพท์มือถือ",
    "Apple",
    "iPhone 14 Pro",
    "256GB",
    "มือสอง สภาพดีมาก"
  ],
  "seoKeywords": [
    "โทรศัพท์มือถือ",
    "โทรศัพท์มือถือมือสอง",
    "ขายโทรศัพท์มือถือ",
    "Apple iPhone 14 Pro",
    "Apple iPhone 14 Pro มือสอง",
    "ขาย Apple iPhone 14 Pro",
    "โทรศัพท์มือสอง",
    "มือถือมือสอง",
    "Apple 256GB"
  ]
}
```

---

## 📚 ตัวอย่างการใช้งานแต่ละหมวดหมู่

### 📱 โทรศัพท์มือถือ

```typescript
// 1. ดึง Schema
const schema = getCategorySchema('mobiles');

// 2. ตรวจสอบ Attributes ที่จำเป็น
const requiredFields = schema.attributes.filter(a => a.required);
console.log('ฟิลด์ที่ต้องกรอก:', requiredFields.map(f => f.label));
// Output: ['ยี่ห้อ', 'รุ่น', 'ความจุ', 'สภาพ']

// 3. ประเมินราคา
const estimation = await estimatePrice({
  categoryId: 'mobiles',
  attributes: {
    brand: 'Samsung',
    model: 'Galaxy S23 Ultra',
    storage: '512GB',
    condition: 'มือสอง สภาพดี',
    batteryHealth: 82
  },
  originalPrice: 45900
});

// 4. สร้างรายละเอียด
const description = await generateProductDescription({
  categoryId: 'mobiles',
  attributes: {
    brand: 'Samsung',
    model: 'Galaxy S23 Ultra',
    storage: '512GB',
    condition: 'มือสอง สภาพดี',
    batteryHealth: 82
  }
});
```

---

### 💻 คอมพิวเตอร์

```typescript
const estimation = await estimatePrice({
  categoryId: 'computers',
  attributes: {
    type: 'Gaming Laptop',
    brand: 'MSI',
    model: 'Katana 15',
    processor: 'Intel Core i7-13700H',
    ram: '16GB',
    storage: '1TB SSD',
    gpu: 'NVIDIA RTX 4070',
    condition: 'มือสอง สภาพดีมาก'
  },
  originalPrice: 55000
});

const description = await generateProductDescription({
  categoryId: 'computers',
  attributes: {
    type: 'Gaming Laptop',
    brand: 'MSI',
    model: 'Katana 15',
    processor: 'Intel Core i7-13700H',
    ram: '16GB',
    storage: '1TB SSD',
    gpu: 'NVIDIA RTX 4070',
    condition: 'มือสอง สภาพดีมาก'
  },
  tone: 'professional'
});
```

---

### 🐾 สัตว์เลี้ยง

```typescript
const estimation = await estimatePrice({
  categoryId: 'pets',
  attributes: {
    petType: 'สุนัข',
    breed: 'Shiba Inu',
    age: '2 เดือน',
    gender: 'ตัวผู้',
    vaccinated: 'ครบถ้วน',
    sterilized: 'ยังไม่ได้ทำ',
    health: 'แข็งแรงดี',
    personality: ['เชื่อง', 'ขี้เล่น', 'เข้ากับคนง่าย'],
    pedigree: 'มี'
  }
});

const description = await generateProductDescription({
  categoryId: 'pets',
  attributes: {
    petType: 'สุนัข',
    breed: 'Shiba Inu',
    age: '2 เดือน',
    gender: 'ตัวผู้',
    vaccinated: 'ครบถ้วน',
    health: 'แข็งแรงดี',
    personality: ['เชื่อง', 'ขี้เล่น']
  },
  tone: 'casual'
});
```

---

### 📸 กล้องถ่ายรูป

```typescript
const estimation = await estimatePrice({
  categoryId: 'cameras',
  attributes: {
    type: 'Mirrorless',
    brand: 'Sony',
    model: 'A7 IV',
    sensor: 'Full Frame',
    megapixels: 33,
    condition: 'มือสอง สภาพดีมาก',
    shutterCount: 8500,
    lens: '28-70mm f/3.5-5.6'
  },
  originalPrice: 95000
});

const description = await generateProductDescription({
  categoryId: 'cameras',
  attributes: {
    type: 'Mirrorless',
    brand: 'Sony',
    model: 'A7 IV',
    sensor: 'Full Frame',
    megapixels: 33,
    condition: 'มือสอง สภาพดีมาก',
    shutterCount: 8500
  },
  tone: 'professional'
});
```

---

## 🎨 ใช้งานใน React Component

### ตัวอย่าง: หน้าลงขายสินค้า

```typescript
'use client';

import { useState } from 'react';
import { estimatePrice } from '@/lib/ai-price-estimator';
import { generateProductDescription } from '@/lib/ai-description-generator';

export default function SellPage() {
  const [categoryId, setCategoryId] = useState('mobiles');
  const [formData, setFormData] = useState({});
  const [price, setPrice] = useState(null);
  const [description, setDescription] = useState(null);

  const handleEstimatePrice = async () => {
    const result = await estimatePrice({
      categoryId,
      attributes: formData
    });
    setPrice(result);
  };

  const handleGenerateDescription = async () => {
    const result = await generateProductDescription({
      categoryId,
      attributes: formData
    });
    setDescription(result);
  };

  return (
    <div>
      {/* Category Selector */}
      <select onChange={(e) => setCategoryId(e.target.value)}>
        <option value="mobiles">โทรศัพท์มือถือ</option>
        <option value="computers">คอมพิวเตอร์</option>
        <option value="pets">สัตว์เลี้ยง</option>
        <option value="cameras">กล้องถ่ายรูป</option>
      </select>

      {/* Dynamic Form */}
      <DynamicProductForm 
        categoryId={categoryId}
        formData={formData}
        onChange={setFormData}
      />

      {/* AI Buttons */}
      <button onClick={handleEstimatePrice}>
        💰 AI ประเมินราคา
      </button>
      <button onClick={handleGenerateDescription}>
        ✨ AI เขียนรายละเอียด
      </button>

      {/* Results */}
      {price && <PriceEstimationCard data={price} />}
      {description && <DescriptionCard data={description} />}
    </div>
  );
}
```

---

## 🔧 Helper Functions

### ตรวจสอบฟิลด์ที่จำเป็น

```typescript
import { getRequiredAttributes } from '@/config/category-schemas';

const requiredFields = getRequiredAttributes('mobiles');
console.log(requiredFields);
// Output: [
//   { key: 'brand', label: 'ยี่ห้อ', ... },
//   { key: 'model', label: 'รุ่น', ... },
//   { key: 'storage', label: 'ความจุ', ... },
//   { key: 'condition', label: 'สภาพ', ... }
// ]
```

### ตรวจสอบความครบถ้วนของข้อมูล

```typescript
function validateProductData(categoryId: string, attributes: any): boolean {
  const requiredFields = getRequiredAttributes(categoryId);
  
  for (const field of requiredFields) {
    if (!attributes[field.key]) {
      console.error(`Missing required field: ${field.label}`);
      return false;
    }
  }
  
  return true;
}

// ใช้งาน
const isValid = validateProductData('mobiles', {
  brand: 'Apple',
  model: 'iPhone 14 Pro',
  storage: '256GB',
  condition: 'มือสอง สภาพดีมาก'
});
```

### ดึง AI Template

```typescript
import { getAIDescriptionTemplate } from '@/config/category-schemas';

const template = getAIDescriptionTemplate('mobiles');
console.log(template.structure);
// Output: ['intro', 'specs', 'condition', 'accessories', 'highlights', 'usage']

console.log(template.toneOfVoice);
// Output: "เป็นกันเอง น่าเชื่อถือ ให้ข้อมูลครบถ้วน"

console.log(template.keyPoints);
// Output: [
//   'ระบุรุ่นและสเปคให้ชัดเจน',
//   'เน้นสภาพสินค้าและความใหม่',
//   ...
// ]
```

### ดึง Price Factors

```typescript
import { getPriceFactors } from '@/config/category-schemas';

const factors = getPriceFactors('mobiles');
console.log(factors);
// Output: [
//   { key: 'brand_premium', label: 'ค่าแบรนด์', weight: 0.25, ... },
//   { key: 'age_depreciation', label: 'อายุการใช้งาน', weight: 0.30, ... },
//   ...
// ]
```

---

## 🎯 Best Practices

### 1. ตรวจสอบข้อมูลก่อนส่ง AI

```typescript
// ❌ ไม่ดี
const estimation = await estimatePrice({
  categoryId: 'mobiles',
  attributes: {} // ข้อมูลไม่ครบ
});

// ✅ ดี
const requiredFields = getRequiredAttributes('mobiles');
const isValid = validateProductData('mobiles', formData);

if (isValid) {
  const estimation = await estimatePrice({
    categoryId: 'mobiles',
    attributes: formData
  });
}
```

### 2. แสดง Loading State

```typescript
const [isLoading, setIsLoading] = useState(false);

const handleEstimate = async () => {
  setIsLoading(true);
  try {
    const result = await estimatePrice(productData);
    setPrice(result);
  } catch (error) {
    console.error('Error:', error);
  } finally {
    setIsLoading(false);
  }
};

return (
  <button onClick={handleEstimate} disabled={isLoading}>
    {isLoading ? '🤖 กำลังคำนวณ...' : '💰 AI ประเมินราคา'}
  </button>
);
```

### 3. Handle Errors

```typescript
try {
  const estimation = await estimatePrice(productData);
  setPrice(estimation);
} catch (error) {
  if (error.message.includes('Schema not found')) {
    alert('ไม่พบข้อมูลหมวดหมู่นี้');
  } else {
    alert('เกิดข้อผิดพลาด กรุณาลองใหม่');
  }
}
```

### 4. ใช้ Confidence Score

```typescript
const estimation = await estimatePrice(productData);

if (estimation.confidence < 0.5) {
  console.warn('⚠️ ความมั่นใจต่ำ - ข้อมูลไม่ครบถ้วน');
  // แสดงข้อความแนะนำให้เพิ่มข้อมูล
}

if (estimation.confidence >= 0.8) {
  console.log('✅ ความมั่นใจสูง - ราคาน่าจะแม่นยำ');
}
```

---

## 🐛 Troubleshooting

### ปัญหา: Schema not found

```typescript
// ตรวจสอบว่า categoryId ถูกต้อง
const validCategories = ['mobiles', 'computers', 'pets', 'cameras'];
if (!validCategories.includes(categoryId)) {
  console.error('Invalid category:', categoryId);
}
```

### ปัญหา: ราคาประเมินผิดปกติ

```typescript
// ตรวจสอบ originalPrice และ purchaseDate
if (!productData.originalPrice) {
  console.warn('ไม่มีราคาเดิม - จะใช้ราคากลางของหมวดหมู่');
}

if (!productData.purchaseDate) {
  console.warn('ไม่มีวันที่ซื้อ - จะประมาณจากสภาพสินค้า');
}
```

### ปัญหา: Description ไม่ครบ

```typescript
// ตรวจสอบ Attributes ที่จำเป็น
const template = getAIDescriptionTemplate(categoryId);
console.log('Required sections:', template.requiredSections);

// เพิ่มข้อมูลที่ขาด
const missingFields = template.requiredSections.filter(
  section => !productData.attributes[section]
);
console.log('Missing:', missingFields);
```

---

## 📖 API Reference

### `getCategorySchema(categoryId: string)`
ดึง Schema ของหมวดหมู่

**Parameters:**
- `categoryId`: 'mobiles' | 'computers' | 'pets' | 'cameras'

**Returns:** `CategorySchema | null`

---

### `estimatePrice(productData: ProductData)`
ประเมินราคาสินค้า

**Parameters:**
```typescript
{
  categoryId: string;
  attributes: Record<string, any>;
  images?: string[];
  purchaseDate?: Date;
  originalPrice?: number;
}
```

**Returns:** `Promise<PriceEstimation>`

---

### `generateProductDescription(input: GenerateDescriptionInput)`
สร้างรายละเอียดสินค้า

**Parameters:**
```typescript
{
  categoryId: string;
  attributes: Record<string, any>;
  images?: string[];
  sellerNotes?: string;
  tone?: 'casual' | 'professional' | 'enthusiastic';
}
```

**Returns:** `Promise<GeneratedDescription>`

---

## 🎓 เรียนรู้เพิ่มเติม

- 📚 [AI Product Data System - Full Documentation](./ai-product-data-system.md)
- 📊 [System Summary](./ai-system-summary.md)
- 🏗️ [Category Schemas Source Code](../src/config/category-schemas.ts)
- 💰 [Price Estimator Source Code](../src/lib/ai-price-estimator.ts)
- ✨ [Description Generator Source Code](../src/lib/ai-description-generator.ts)

---

## 💬 ต้องการความช่วยเหลือ?

หากมีคำถามหรือพบปัญหา:
1. ตรวจสอบ [Troubleshooting](#-troubleshooting) ก่อน
2. ดู [Full Documentation](./ai-product-data-system.md)
3. ติดต่อทีมพัฒนา

---

**Happy Coding! 🚀**
