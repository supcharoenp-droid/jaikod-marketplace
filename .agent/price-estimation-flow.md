# 💰 Price Estimation Flow - JaiKod

## 📊 ภาพรวมระบบประเมินราคา

```
                      ┌─────────────────────────────────────────────┐
                      │           SMART PRICE ESTIMATOR             │
                      │      src/lib/smart-price-estimator.ts       │
                      └─────────────────────────────────────────────┘
                                          │
        ┌─────────────────────────────────┼─────────────────────────────────┐
        ▼                                 ▼                                 ▼
  ┌───────────┐                    ┌───────────┐                    ┌───────────┐
  │ BASE PRICE│                    │MULTIPLIERS│                    │  FACTORS  │
  └───────────┘                    └───────────┘                    └───────────┘
        │                                 │                                 │
        ▼                                 ▼                                 ▼
  ┌───────────────┐              ┌─────────────────┐              ┌─────────────────┐
  │Category Base  │              │ Brand           │              │ Year/Age        │
  │Subcategory    │              │ Condition       │              │ Mileage         │
  └───────────────┘              │ Quality         │              │ Accident        │
                                 └─────────────────┘              │ Flood           │
                                                                  └─────────────────┘
```

---

## 🔗 Field Mapping - ฟิลด์ที่มีผลต่อราคา

### 1️⃣ Category & Subcategory → Base Price

| ฟิลด์ในฟอร์ม | Field Key | ใช้ใน | ผลกระทบ |
|-------------|-----------|-------|---------|
| หมวดหมู่ | `category` | `CATEGORY_BASE_PRICES` | กำหนดราคาฐาน |
| หมวดย่อย | `subcategory` | `SUBCATEGORY_BASE_PRICES` | ราคาแม่นยำกว่า |

**ตัวอย่าง:**
- Category 1 (ยานยนต์) → avg ฿450,000
- Subcategory 101 (รถยนต์มือสอง) → avg ฿500,000 ✅

---

### 2️⃣ Brand → Brand Multiplier

| ยี่ห้อ | Multiplier | อธิบาย |
|--------|-----------|--------|
| Toyota | 1.05 | +5% (รีเซลสูง) |
| Honda | 1.00 | Baseline |
| Nissan | 0.92 | -8% |
| MG | 0.85 | -15% |
| BYD | 0.85 | -15% |

**ใช้จาก:** `specs['brand']` ในฟอร์ม

---

### 3️⃣ Condition → Condition Multiplier

| ค่าในฟอร์ม | Multiplier | Label |
|-----------|-----------|-------|
| `new` | 1.00 | ใหม่แกะกล่อง |
| `like_new` | 0.85 | เหมือนใหม่ ใช้น้อย |
| `good` | 0.70 | สภาพดี |
| `fair` | 0.50 | ใช้งานได้ปกติ |
| `used` | 0.40 | มือสองทั่วไป |
| `poor` | 0.10 | ซาก/อะไหล่ |

**ใช้จาก:** Dropdown "สภาพ" (`data.condition`)

---

### 4️⃣ Year/Age → Depreciation (เฉพาะรถยนต์)

| อายุรถ | ลดราคา |
|--------|--------|
| 1 ปี | -10% |
| 2 ปี | -18% |
| 3 ปี | -25% |
| 5 ปี | -35% |
| 10 ปี | -60% |
| 15+ ปี | -75% (max) |

**ใช้จาก:** `specs['year']` ในฟอร์ม

---

### 5️⃣ Mileage → Mileage Adjustment (เฉพาะรถยนต์)

| ระยะทาง | ผลกระทบ |
|--------|---------|
| < 10,000 km | +10% |
| 10,000-30,000 km | +5% |
| 30,000-60,000 km | 0% |
| 60,000-100,000 km | -5% |
| > 100,000 km | -10% |
| > 150,000 km | -15% |

**ใช้จาก:** `specs['mileage']` ในฟอร์ม

---

### 6️⃣ Accident History → Negative Impact

| ค่าในฟอร์ม | ลดราคา |
|-----------|-------|
| `none` | 0% |
| `minor` | -5% |
| `moderate` | -10% |
| `major` | -20% |

**ใช้จาก:** `specs['accident']` ในฟอร์ม

---

### 7️⃣ Flood History → Negative Impact

| ค่าในฟอร์ม | ลดราคา |
|-----------|-------|
| `none` | 0% |
| `partial` | -15% |
| `full` | -35% |

**ใช้จาก:** `specs['flood']` ในฟอร์ม

---

## 📝 ตัวอย่างการคำนวณ: Nissan Almera 2022

```
📦 Base Price (รถยนต์มือสอง 101): ฿500,000
   × Brand (Nissan 0.92):         = ฿460,000
   × Depreciation (2 ปี -18%):    = ฿377,200
   × Condition (like_new 0.85):   = ฿320,620
   × Accident (none 0%):          = ฿320,620
   × Flood (none 0%):             = ฿320,620

💰 ราคาแนะนำ: ~฿320,000
```

---

## ⚠️ ปัญหาที่พบ

### 1. ฟิลด์ซ้ำกัน
- `accident` และ `flood` ปรากฏใน 2 sections:
  - "สภาพและประวัติ" (จาก world-class-description-engine.ts)
  - "รายละเอียดเฉพาะหมวด" 
  
**แก้ไข:** ลบออกจาก "รายละเอียดเฉพาะหมวด" ให้อยู่แค่ "สภาพและประวัติ"

### 2. Specs ไม่ถูกส่งไปคำนวณ
- Form specs ไม่ถูก pass ไปยัง `estimatePrice()` อย่างครบถ้วน
- ต้องตรวจสอบ data flow

---

## 🔧 Files ที่เกี่ยวข้อง

| ไฟล์ | หน้าที่ |
|------|--------|
| `smart-price-estimator.ts` | คำนวณราคา |
| `world-class-description-engine.ts` | กำหนด fields ตาม category |
| `SmartDescriptionPanel.tsx` | แสดงฟอร์ม specs |
| `SmartDetailsFormI18n.tsx` | รวม form + price panel |
| `PriceAnalysisPanel.tsx` | แสดงผลราคา |

---

## ✅ TODO
- [ ] ลบฟิลด์ซ้ำจาก template
- [ ] ตรวจสอบ specs ถูกส่งครบ
- [ ] เพิ่ม logging เพื่อ debug
- [ ] ปรับ subcategory base prices ให้ตรงตลาด
