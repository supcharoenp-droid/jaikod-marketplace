# 📚 Keywords Management Guide

บทความแนะนำการจัดการ Keywords สำหรับระบบจัดหมวดหมู่สินค้า

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [File Structure](#file-structure)
3. [Adding Keywords](#adding-keywords)
4. [Search Tools](#search-tools)
5. [Coverage Analysis](#coverage-analysis)
6. [Auto-suggestions](#auto-suggestions)
7. [Best Practices](#best-practices)
8. [Troubleshooting](#troubleshooting)

---

## 🎯 Overview

ระบบ Keywords Management ช่วยให้คุณ:
- ✅ เพิ่ม/แก้ไข keywords ได้ง่าย
- ✅ ค้นหาว่า keyword อยู่ที่ไหน
- ✅ วิเคราะห์ความครอบคลุม
- ✅ รับคำแนะนำอัตโนมัติจาก feedback

---

## 📂 File Structure

```
src/lib/
├── comprehensive-automotive-keywords.ts    # ยานยนต์
├── comprehensive-computer-keywords.ts      # คอมพิวเตอร์
├── comprehensive-mobile-keywords.ts        # มือถือและแท็บเล็ต
├── comprehensive-fashion-keywords.ts       # แฟชั่น
├── comprehensive-camera-keywords.ts        # กล้อง
├── comprehensive-gaming-keywords.ts        # เกมและแก็ดเจ็ต
├── comprehensive-appliances-keywords.ts    # เครื่องใช้ไฟฟ้า
├── comprehensive-home-keywords.ts          # บ้านและสวน
├── comprehensive-beauty-keywords.ts        # ความงาม
├── comprehensive-sports-keywords.ts        # กีฬา
├── comprehensive-pets-keywords.ts          # สัตว์เลี้ยง
├── comprehensive-amulet-keywords.ts        # พระเครื่อง
├── comprehensive-kids-keywords.ts          # เด็กและของเล่น
├── comprehensive-books-keywords.ts         # หนังสือ
├── comprehensive-services-keywords.ts      # บริการ
└── expert-category-keywords.ts             # รวมทุกหมวด
```

---

## ➕ Adding Keywords

### วิธีที่ 1: เพิ่มใน Main Category

```typescript
// src/lib/comprehensive-automotive-keywords.ts

export const COMPREHENSIVE_AUTOMOTIVE_KEYWORDS = [
    // เพิ่มที่นี่
    'ปั๊มลม',
    'air pump',
    'เติมลม',
    'tire inflator',
    
    // Existing keywords...
    ...AUTOMOTIVE_SUBCATEGORY_KEYWORDS.flat()
]
```

### วิธีที่ 2: เพิ่มใน Subcategory

```typescript
// Car Maintenance (109)
109: [
    // เพิ่มที่นี่
    'ปั๊มลมกางกา',
    'air compressor',
    
    // Existing keywords...
    'น้ำมันเครื่อง',
    'engine oil'
]
```

### วิธีที่ 3: เพิ่ม Typos/Variations

```typescript
// Common typos and variations
const TYPOS_AND_VARIATIONS = [
    'ปั้มลม',      // ผิดจาก ปั๊มลม
    'ปํ๊มลม',      // พิมพ์ผิด
    'ที่เติมลม',   // คำที่ใกล้เคียง
]
```

---

## 🔍 Search Tools

### ค้นหา Keyword

```bash
# ค้นหา keyword
npm run search:keywords "ปั๊มลม"

# Output:
# 📁 comprehensive-automotive-keywords.ts
# Line 288:
# Category: automotive
# Subcategory: Car Maintenance (109)
# Code: 'ปั๊มลม', 'air pump', 'เติมลม',
```

### ค้นหาแบบ Wildcard

```bash
# ค้นหาทุก keyword ที่มี "pump"
npm run search:keywords "pump"

# ค้นหาทั้ง Thai และ English
npm run search:keywords "ปั๊ม"
npm run search:keywords "air"
```

---

## 📊 Coverage Analysis

### วิเคราะห์ความครอบคลุม

```bash
npm run analyze:coverage
```

**Output:**
```
📊 KEYWORDS COVERAGE ANALYSIS
================================================================================

📈 SUMMARY:
   Total Categories: 15
   With Keyword Files: 15 (100.0%)
   ✅ Excellent (500+): 3
   🟢 Good (300-499): 5
   🟡 Fair (100-299): 4
   🟠 Poor (1-99): 2
   ❌ None (0): 1

ID    Category                       Keywords     Subs   Status
--------------------------------------------------------------------------------
4     Computers & IT                 812          12     ✅ excellent
3     Mobiles & Tablets              654          10     ✅ excellent
1     Automotive                     532          8      ✅ excellent
6     Fashion                        387          15     🟢 good
8     Camera                         298          6      🟡 fair
...
```

### ระดับความครอบคลุม

| Status | Keywords | คำอธิบาย |
|--------|----------|----------|
| ✅ Excellent | 500+ | ครอบคลุมดีมาก |
| 🟢 Good | 300-499 | ใช้งานได้ดี |
| 🟡 Fair | 100-299 | ควรเพิ่มเติม |
| 🟠 Poor | 1-99 | ต้องปรับปรุง |
| ❌ None | 0 | ยังไม่มี |

---

## 💡 Auto-suggestions

### สร้างคำแนะนำจาก Feedback

```bash
# วิเคราะห์ feedback 30 วันล่าสุด
npm run suggest:keywords

# วิเคราะห์ feedback 7 วันล่าสุด
npm run suggest:keywords 7
```

**Output:**
```
💡 KEYWORD SUGGESTIONS FROM FEEDBACK
================================================================================

Found 15 suggested keywords:

1. "ปั๊มลมกางกา xiaomi"
   Category: Automotive (1)
   Frequency: 12 occurrences
   Confidence: 85%
   Reason: Frequently appears in misclassified products

2. "canon card printer"
   Category: Computers & IT (4)
   Frequency: 8 occurrences
   Confidence: 90%
   Reason: Brand context: Add canon + printer to brand context rules

...
```

### ไฟล์ที่ Export

```typescript
// keyword-suggestions.ts
export const SUGGESTED_KEYWORDS = {
    // Frequently appears in misclassified products
    'ปั๊มลมกางกา xiaomi': {
        category: 1,
        frequency: 12,
        confidence: 0.85
    },
    
    // Brand context: Add canon + printer to brand context rules
    'canon card printer': {
        category: 4,
        frequency: 8,
        confidence: 0.90
    }
}
```

---

## ✅ Best Practices

### 1. การเพิ่ม Keywords

```typescript
// ❌ ไม่ดี: แค่คำเดียว
'canon'

// ✅ ดี: มีบริบท
'canon eos',
'canon pixma',
'canon printer',

// ✅ ดีมาก: ทั้งไทยและอังกฤษ
'canon eos',      // English
'แคนนอน อีโอเอส',  // Thai
'แคนนอน eos',     // Mixed
```

### 2. การจัดกลุ่ม

```typescript
// ✅ จัดกลุ่มตาม Context
const AUTOMOTIVE_KEYWORDS = {
    // Brand Names
    brands: ['toyota', 'honda', 'mazda'],
    
    // Product Types
    types: ['รถยนต์', 'car', 'มอเตอร์ไซค์'],
    
    // Accessories
    accessories: ['ปั๊มลม', 'air pump', 'กันชน'],
    
    // Common Typos
    typos: ['ปั้มลม', 'ใช้เติมลม']
}
```

### 3. การทดสอบ

```typescript
// เพิ่ม keyword ใหม่
109: [
    'ปั๊มลมกางกา',  // NEW
    'air pump xiaomi' // NEW
]

// ทดสอบทันที
npm run test:classification

// ดู accuracy
// ✅ Should increase from 92% → 95%
```

### 4. Documentation

```typescript
// ✅ เพิ่ม comment อธิบาย
109: [
    // Air pumps - เพิ่ม 2025-12-18 (Issue #123)
    'ปั๊มลม',
    'air pump',
    'เติมลม',
    
    // Engine oil
    'น้ำมันเครื่อง',
    'engine oil'
]
```

---

## 🐛 Troubleshooting

### ปัญหา: ไม่พบ Keyword

```bash
# 1. ตรวจสอบว่ามีไฟล์หรือไม่
ls src/lib/comprehensive-*-keywords.ts

# 2. ค้นหาด้วย tool
npm run search:keywords "ปั๊มลม"

# 3. ค้นหาแบบ manual
grep -rn "ปั๊มลม" src/lib/comprehensive-*.ts
```

### ปัญหา: Keyword ไม่ทำงาน

```typescript
// ❌ ผิด: ไม่ได้อยู่ใน export
const HIDDEN_KEYWORDS = ['ปั๊มลม'] // ไม่ export

// ✅ ถูก: export ออกมา
export const AUTOMOTIVE_KEYWORDS = [
    'ปั๊มลม',  // ✅ จะถูกใช้
    ...
]
```

### ปัญหา: Accuracy ต่ำ

```bash
# 1. ดู coverage
npm run analyze:coverage

# 2. ดู suggestions
npm run suggest:keywords

# 3. เพิ่ม keywords ที่แนะนำ

# 4. Test อีกครั้ง
npm run test:classification
```

---

## 🎓 Advanced Topics

### Custom Keyword Patterns

```typescript
// Regex patterns สำหรับ automotive
const TIRE_SIZE_PATTERN = /\d{3}\/\d{2}[RZ]\d{2}/
// Match: 205/55R16, 195/65R15

const ENGINE_SIZE_PATTERN = /\d\.\d\s*(?:L|ลิตร)/
// Match: 2.0L, 1.6 ลิตร

const YEAR_PATTERN = /20\d{2}/
// Match: 2020, 2021, 2025
```

### Dynamic Keywords

```typescript
// โหลด keywords แบบ lazy
export function getKeywords(categoryId: number) {
    switch(categoryId) {
        case 1:
            return import('./comprehensive-automotive-keywords')
        case 4:
            return import('./comprehensive-computer-keywords')
        // ...
    }
}
```

---

## 📞 Support

หากมีปัญหา:

1. ตรวจสอบ [Test Results](/test-classification)
2. ดู [Analytics Dashboard](/analytics/classification)
3. รัน `npm run analyze:coverage`
4. ตรวจสอบ Console Logs

---

**Last Updated**: 2025-12-18  
**Version**: 2.0.0  
**Maintainer**: JaiKod Development Team
