# 🐛 **Bug Report: Notebook → แฟชั่น**

## ❌ **ปัญหา:**

**Input:**
```
Title: "โน้ตบุ๊ก Acer Aspire 5 A515-45-R3A4"
```

**Output:**
```
Category: แฟชั่น (6) ❌
Subcategory: (ไม่เลือก)
```

**Expected:**
```
Category: คอมพิวเตอร์และไอที (4) ✅
Subcategory: โน้ตบุ๊ค (401) ✅
```

---

## 🔍 **สาเหตุที่เป็นไปได้:**

### **1. Keywords ครบแล้ว:**
```typescript
Category 4 (Computers):
✅ 'โน้ตบุ๊ค'
✅ 'laptop'
✅ 'notebook'
✅ 'acer'
✅ 'aspire' (ยังไม่มี!)
```

### **2. AI Image Analysis อาจผิด:**
```typescript
// ถ้า OpenAI Vision return:
imageAnalysis: "fashion item" หรือ "bag" 
// → ทำให้เลือก Fashion!
```

### **3. Title Matching แข่งกับ Fashion:**
```typescript
Fashion keywords: ['bag', 'backpack', ...]
Computer keywords: ['โน้ตบุ๊ค', 'acer', ...]

// ถ้า imageAnalysis ให้ Fashion → มีน้ำหนักสูงกว่า!
```

---

## 🔧 **วิธีแก้:**

### **Quick Fix 1: เพิ่ม Debug Logs** 🐛
```typescript
// In decideCategoryWithAI()
console.log('🔍 Input Signals:', {
  title,
  description,
  detectedObjects,
  imageAnalysis
})

CATEGORIES.forEach(category => {
  const confidence = calculateCategoryConfidence(category, signals)
  console.log(`📊 Category ${category.id} (${category.name_th}):`, confidence)
})
```

### **Quick Fix 2: เพิ่มน้ำหนัก Title** ⬆️
```typescript
// Change weights:
Image:  35% → 30%  // ลดลง
Title:  30% → 40%  // เพิ่มขึ้น! ✅

// Title มี "โน้ตบุ๊ค" ชัดเจน → ควรให้น้ำหนักมากกว่า!
```

### **Quick Fix 3: เพิ่ม Strong Indicators** 💪
```typescript
// In category-decision-ai.ts
const STRONG_INDICATORS = {
  4: ['โน้ตบุ๊ค', 'laptop', 'notebook', 'acer', 'asus', 'dell', 'lenovo'],
  6: ['เสื้อ', 'กางเกง', 'รองเท้า', 'nike', 'adidas']
}

// If title has strong indicator → +30 bonus!
```

---

## 📊 **Test Request:**

**กรุณาเปิด Console (F12) และดู logs:**

```javascript
🔍 Input Signals: {
  title: "โน้ตบุ๊ก Acer Aspire 5...",
  imageAnalysis: "???" // ← ต้องดูนี่!
}

📊 Category 4 (คอมพิวเตอร์และไอที) Score Breakdown: {
  image: ??,    // ← คะแนนจาก Image
  title: ??,    // ← คะแนนจาก Title  
  description: ??,
  objects: ??,
  total: ??
}

📊 Category 6 (แฟชั่น) Score Breakdown: {
  image: ??,
  title: ??,
  total: ??
}
```

---

## ✅ **Immediate Action:**

**1. Refresh + Test:**
```bash
F5 → Upload "notebook" image
→ Open Console (F12)
→ Copy ALL logs
→ Send to me
```

**2. ส่ง Logs มาให้ผม:**
```
- Input Signals
- Category Score Breakdowns
- Final Decision
```

**3. ผมจะแก้ให้ based on logs!**

---

## 💡 **Hypothesis:**

ผมเชื่อว่า **AI Image Analysis กำลังส่งค่าผิด** หรือ **Fashion มี keyword ที่ match โดยไม่ตั้งใจ**

**Need logs to confirm!** 🔍

---

**Status: ⏸️ Waiting for Console Logs**

**Next:** ส่ง logs มา → ผมจะแก้ทันที!
