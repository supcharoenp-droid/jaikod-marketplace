# 📚 AI Product Data System - Documentation Index

> คู่มือและเอกสารประกอบทั้งหมดสำหรับระบบข้อมูลสินค้าอัจฉริยะ

---

## 🚀 เริ่มต้นใช้งาน (Start Here)

### สำหรับนักพัฒนา
1. **[AI System README](./ai-system-README.md)** 📖
   - ภาพรวมระบบ
   - คุณสมบัติหลัก
   - ตัวอย่างการใช้งานพื้นฐาน
   - **เริ่มต้นที่นี่!**

2. **[Quick Start Guide](./ai-quick-start.md)** ⚡
   - เริ่มต้นใช้งาน 5 นาที
   - ตัวอย่างโค้ดพร้อมใช้
   - Best Practices
   - Troubleshooting

### สำหรับผู้ใช้งาน
3. **[System Summary](./ai-system-summary.md)** 📊
   - สรุประบบแบบเข้าใจง่าย
   - แผนภาพการทำงาน
   - ตัวอย่างการคำนวณราคา
   - คำถาม-คำตอบ

---

## 📖 เอกสารหลัก (Core Documentation)

### 1. AI Product Data System
**[Full Documentation](./ai-product-data-system.md)** 📘

**เนื้อหา:**
- ภาพรวมระบบทั้งหมด
- Category Schema Templates (4 หมวดหมู่)
  - 📱 โทรศัพท์มือถือ
  - 💻 คอมพิวเตอร์และแล็ปท็อป
  - 🐾 สัตว์เลี้ยง
  - 📸 กล้องถ่ายรูป
- AI Price Estimator
- AI Description Generator
- ตัวอย่างการใช้งานแต่ละหมวดหมู่
- วิธีเพิ่มหมวดหมู่ใหม่

**ความยาว:** ~24,000 คำ  
**เวลาอ่าน:** ~30 นาที

---

### 2. Category Comparison Table
**[Category Comparison](./category-comparison.md)** 📊

**เนื้อหา:**
- ตารางเปรียบเทียบ Attributes
- ตารางเปรียบเทียบ Price Factors
- ตัวอย่างการคำนวณราคาแต่ละหมวดหมู่
- ความแตกต่างหลักของแต่ละหมวดหมู่
- สถิติสรุป

**ความยาว:** ~17,000 คำ  
**เวลาอ่าน:** ~20 นาที

---

## 🔧 Technical Reference

### Source Code Files

#### 1. Category Schemas
**[category-schemas.ts](../src/config/category-schemas.ts)**

**เนื้อหา:**
- Interface definitions
- Schema สำหรับ 4 หมวดหมู่
- Helper functions
- Registry

**ขนาด:** ~1,200 บรรทัด

---

#### 2. AI Price Estimator
**[ai-price-estimator.ts](../src/lib/ai-price-estimator.ts)**

**เนื้อหา:**
- `estimatePrice()` - ฟังก์ชันหลัก
- Price calculation engine
- Factor impact calculations
- Market data integration
- Confidence scoring

**ขนาด:** ~600 บรรทัด

---

#### 3. AI Description Generator
**[ai-description-generator.ts](../src/lib/ai-description-generator.ts)**

**เนื้อหา:**
- `generateProductDescription()` - ฟังก์ชันหลัก
- Section generators แต่ละหมวดหมู่
- Title generation
- Highlights generation
- Tags & SEO keywords generation

**ขนาด:** ~800 บรรทัด

---

#### 4. Dynamic Product Form
**[DynamicProductForm.tsx](../src/components/sell/DynamicProductForm.tsx)**

**เนื้อหา:**
- React component สำหรับฟอร์มลงขาย
- Dynamic form fields
- AI integration (Price & Description)
- Result display components

**ขนาด:** ~500 บรรทัด

---

## 📊 ข้อมูลอ้างอิง (Reference)

### หมวดหมู่สินค้า

#### 📱 โทรศัพท์มือถือ (Mobiles)
- **Category ID:** `mobiles`
- **Attributes:** 10 ฟิลด์
- **Required Fields:** 4 ฟิลด์
- **Price Factors:** 5 ปัจจัย
- **Depreciation:** 25%/ปี
- **Price Range:** ฿1,000 - ฿80,000

**Key Attributes:**
- ยี่ห้อ (Brand) ⭐⭐⭐⭐⭐
- รุ่น (Model) ⭐⭐⭐⭐⭐
- ความจุ (Storage) ⭐⭐⭐⭐
- สภาพ (Condition) ⭐⭐⭐⭐⭐
- แบตเตอรี่ (Battery Health) ⭐⭐⭐⭐

**Top Price Factors:**
1. อายุการใช้งาน (30%)
2. ค่าแบรนด์ (25%)
3. สภาพเครื่อง (20%)

---

#### 💻 คอมพิวเตอร์ (Computers)
- **Category ID:** `computers`
- **Attributes:** 11 ฟิลด์
- **Required Fields:** 6 ฟิลด์
- **Price Factors:** 5 ปัจจัย
- **Depreciation:** 20%/ปี
- **Price Range:** ฿5,000 - ฿150,000

**Key Attributes:**
- CPU (Processor) ⭐⭐⭐⭐⭐
- RAM ⭐⭐⭐⭐
- GPU ⭐⭐⭐⭐⭐
- Storage ⭐⭐⭐⭐
- สภาพ (Condition) ⭐⭐⭐⭐

**Top Price Factors:**
1. ประสิทธิภาพสเปค (35%)
2. อายุการใช้งาน (25%)
3. ค่าแบรนด์ (15%)

---

#### 🐾 สัตว์เลี้ยง (Pets)
- **Category ID:** `pets`
- **Attributes:** 10 ฟิลด์
- **Required Fields:** 5 ฟิลด์
- **Price Factors:** 5 ปัจจัย
- **Depreciation:** 0%/ปี
- **Price Range:** ฿500 - ฿50,000

**Key Attributes:**
- สายพันธุ์ (Breed) ⭐⭐⭐⭐⭐
- สุขภาพ (Health) ⭐⭐⭐⭐⭐
- วัคซีน (Vaccinated) ⭐⭐⭐⭐
- อายุ (Age) ⭐⭐⭐⭐
- นิสัย (Personality) ⭐⭐⭐

**Top Price Factors:**
1. ความหายากของสายพันธุ์ (30%)
2. สุขภาพและวัคซีน (25%)
3. อายุ (20%)

---

#### 📸 กล้องถ่ายรูป (Cameras)
- **Category ID:** `cameras`
- **Attributes:** 9 ฟิลด์
- **Required Fields:** 3 ฟิลด์
- **Price Factors:** 5 ปัจจัย
- **Depreciation:** 15%/ปี
- **Price Range:** ฿2,000 - ฿200,000

**Key Attributes:**
- รุ่น (Model) ⭐⭐⭐⭐⭐
- เซ็นเซอร์ (Sensor) ⭐⭐⭐⭐⭐
- Shutter Count ⭐⭐⭐⭐⭐
- เลนส์ (Lens) ⭐⭐⭐⭐
- สภาพ (Condition) ⭐⭐⭐⭐

**Top Price Factors:**
1. ยี่ห้อและรุ่น (30%)
2. Shutter Count (25%)
3. อายุการใช้งาน (20%)

---

## 🎯 Use Cases

### Use Case 1: ผู้ขายลงขายโทรศัพท์
```typescript
// 1. เลือกหมวดหมู่
const categoryId = 'mobiles';

// 2. กรอกข้อมูล
const productData = {
  brand: 'Apple',
  model: 'iPhone 14 Pro',
  storage: '256GB',
  condition: 'มือสอง สภาพดีมาก',
  batteryHealth: 88
};

// 3. AI ประเมินราคา
const price = await estimatePrice({ categoryId, attributes: productData });
// → ราคาแนะนำ: ฿36,800

// 4. AI เขียนรายละเอียด
const desc = await generateProductDescription({ categoryId, attributes: productData });
// → รายละเอียดครบถ้วน พร้อม SEO

// 5. ลงขาย
await saveProduct({ ...productData, ...price, ...desc });
```

---

### Use Case 2: ผู้ซื้อค้นหาคอมพิวเตอร์
```typescript
// ค้นหาด้วย Attributes
const results = await searchProducts({
  categoryId: 'computers',
  filters: {
    type: 'Gaming Laptop',
    ram: '16GB',
    gpu: 'RTX 4060',
    priceRange: { min: 40000, max: 60000 }
  }
});

// ผลลัพธ์จะมีข้อมูลครบถ้วนเพราะใช้ Schema เดียวกัน
```

---

## 🔍 API Quick Reference

### Core Functions

```typescript
// 1. Get Category Schema
import { getCategorySchema } from '@/config/category-schemas';
const schema = getCategorySchema('mobiles');

// 2. Estimate Price
import { estimatePrice } from '@/lib/ai-price-estimator';
const estimation = await estimatePrice({ categoryId, attributes, originalPrice });

// 3. Generate Description
import { generateProductDescription } from '@/lib/ai-description-generator';
const description = await generateProductDescription({ categoryId, attributes, tone });

// 4. Helper Functions
import { 
  getRequiredAttributes,
  getAIDescriptionTemplate,
  getPriceFactors 
} from '@/config/category-schemas';
```

---

## 📈 Roadmap

### ✅ Phase 1: Foundation (เสร็จแล้ว)
- [x] Category Schemas (4 หมวดหมู่)
- [x] AI Price Estimator
- [x] AI Description Generator
- [x] Dynamic Product Form
- [x] Documentation

### 🚧 Phase 2: Enhancement (กำลังทำ)
- [ ] เพิ่มหมวดหมู่ใหม่ (เฟอร์นิเจอร์, ของสะสม, กีฬา, แฟชั่น)
- [ ] Market Data Integration (API)
- [ ] Machine Learning Model
- [ ] Image Recognition (Snap & Sell)

### 📅 Phase 3: Advanced (แผนอนาคต)
- [ ] AI Chatbot
- [ ] Personalized Recommendations
- [ ] Dynamic Pricing
- [ ] Multi-language Support

---

## 🎓 Learning Resources

### Tutorials
1. **[Quick Start Guide](./ai-quick-start.md)** - เริ่มต้นใช้งาน 5 นาที
2. **[Full Documentation](./ai-product-data-system.md)** - เรียนรู้แบบละเอียด
3. **[Category Comparison](./category-comparison.md)** - เปรียบเทียบหมวดหมู่

### Examples
- ตัวอย่างโค้ดใน Quick Start Guide
- ตัวอย่างการคำนวณใน System Summary
- ตัวอย่าง Component ใน DynamicProductForm.tsx

### Best Practices
- ตรวจสอบข้อมูลก่อนส่ง AI
- แสดง Loading State
- Handle Errors อย่างเหมาะสม
- ใช้ Confidence Score

---

## 🐛 Troubleshooting

### ปัญหาที่พบบ่อย

1. **Schema not found**
   - ตรวจสอบ categoryId ว่าถูกต้อง
   - ดูรายการหมวดหมู่ที่รองรับ

2. **ราคาประเมินผิดปกติ**
   - ตรวจสอบ originalPrice และ purchaseDate
   - ดูว่าข้อมูลครบถ้วนหรือไม่

3. **Description ไม่ครบ**
   - ตรวจสอบ Required Attributes
   - เพิ่มข้อมูลที่ขาดหายไป

📖 **[ดู Troubleshooting แบบเต็ม](./ai-quick-start.md#-troubleshooting)**

---

## 📞 Support & Contact

### Documentation
- 📚 [Full Docs](./ai-product-data-system.md)
- 🚀 [Quick Start](./ai-quick-start.md)
- 📊 [System Summary](./ai-system-summary.md)

### Source Code
- 📁 [Category Schemas](../src/config/category-schemas.ts)
- 💰 [Price Estimator](../src/lib/ai-price-estimator.ts)
- ✨ [Description Generator](../src/lib/ai-description-generator.ts)
- 🎨 [Dynamic Form](../src/components/sell/DynamicProductForm.tsx)

### Community
- 📧 Email: dev@jaikod.com
- 💬 Discord: JaiKod Dev Community
- 📖 Docs Site: docs.jaikod.com

---

## 📝 Document Version

| Document | Version | Last Updated | Size |
|----------|---------|--------------|------|
| AI System README | 1.0 | 2024-12-07 | 14 KB |
| Full Documentation | 1.0 | 2024-12-07 | 24 KB |
| System Summary | 1.0 | 2024-12-07 | 20 KB |
| Quick Start Guide | 1.0 | 2024-12-07 | 18 KB |
| Category Comparison | 1.0 | 2024-12-07 | 17 KB |
| **Total** | - | - | **93 KB** |

---

## 🎯 Quick Links

### 🚀 Start Here
- [AI System README](./ai-system-README.md) - ภาพรวม
- [Quick Start Guide](./ai-quick-start.md) - เริ่มใช้งาน

### 📖 Learn More
- [Full Documentation](./ai-product-data-system.md) - เอกสารเต็ม
- [System Summary](./ai-system-summary.md) - สรุประบบ
- [Category Comparison](./category-comparison.md) - เปรียบเทียบ

### 🔧 Reference
- [category-schemas.ts](../src/config/category-schemas.ts) - Schema
- [ai-price-estimator.ts](../src/lib/ai-price-estimator.ts) - Estimator
- [ai-description-generator.ts](../src/lib/ai-description-generator.ts) - Generator
- [DynamicProductForm.tsx](../src/components/sell/DynamicProductForm.tsx) - Form

---

**สร้างด้วย ❤️ โดยทีม JaiKod**

*Last Updated: 2024-12-07*
