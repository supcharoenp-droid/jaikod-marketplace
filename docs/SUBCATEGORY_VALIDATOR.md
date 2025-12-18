# Subcategory Validator AI

## 📋 **Overview**

AI-powered subcategory validation that ensures users select appropriate subcategories for categories that require them, with intelligent suggestions based on product data.

---

## 🎯 **Purpose**

Some main categories (e.g., Mobile Phones, Computers) require subcategory selection for better product organization. This system:

1. ✅ Validates if subcategory is required
2. 🤖 Suggests 2-3 most relevant subcategories
3. 💡 Provides helpful guidance
4. ✓ Confirms when valid

---

## 📊 **Categories Requiring Subcategory**

| Category ID | Category Name | Subcategory Required |
|-------------|---------------|---------------------|
| 3 | มือถือและแท็บเล็ต | ✅ Yes |
| 4 | คอมพิวเตอร์และไอที | ✅ Yes |
| 5 | อิเล็กทรอนิกส์ | ✅ Yes |
| 1 | ยานยนต์ | ✅ Yes |
| 2 | อสังหาริมทรัพย์ | ✅ Yes |
| Others | ... | ❌ No |

---

## 🧮 **Suggestion Algorithm**

### **Confidence Calculation:**

```typescript
1. Extract keywords from subcategory definition
2. Match keywords in title + description
3. Count matches
4. Normalize: confidence = matches / min(total_keywords, 5)
```

### **Example:**

```
Subcategory: "มือถือ / โทรศัพท์"
Keywords: ['iphone', 'samsung', 'smartphone', 'มือถือ']

Title: "iPhone 15 Pro Max"
Description: "สมาร์ทโฟน flagship..."

Matches:
- 'iphone' ✓
- 'smartphone' ✓
Count: 2/5 = 40% confidence

Result: Include in suggestions
```

---

## 🎨 **UI States**

### **State 1: Valid (Already Selected)**
```
✓ หมวดย่อยถูกต้อง
```

### **State 2: Not Required**
```
(No UI shown)
```

### **State 3: Required but Missing**
```
┌────────────────────────────────────┐
│ ⚠️ จำเป็นต้องเลือกหมวดย่อย         │
│ กรุณาเลือกหมวดย่อยที่ตรงที่สุด      │
└────────────────────────────────────┘

✨ AI แนะนำหมวดย่อยที่เหมาะสม:

┌──────────────────────────────────┐
│ ○ มือถือ / โทรศัพท์ [85% ตรง]   │
│   ตรงกับคำที่ใช้ในรายละเอียดสินค้า│
└──────────────────────────────────┘

┌──────────────────────────────────┐
│ ○ แท็บเล็ต / iPad              │
│   เกี่ยวข้องกับหมวดหมู่นี้        │
└──────────────────────────────────┘
```

---

## 🔧 **API Reference**

### **`validateSubcategory()`**

```typescript
interface SubcategoryValidationParams {
  categoryId: string
  subcategoryId?: string
  title: string
  description: string
  detectedObjects?: string[]
}

interface SubcategoryValidationResult {
  is_valid: boolean
  suggested_subcategories: Array<{
    id: string
    name: string
    confidence: number
    reasoning: string
  }>
  helper_text: string
  requires_subcategory: boolean
}
```

**Usage:**

```typescript
import { validateSubcategory } from '@/lib/subcategory-validator-ai'

const result = validateSubcategory({
  categoryId: '3', // มือถือ
  subcategoryId: undefined, // ยังไม่เลือก
  title: 'iPhone 15 Pro Max 256GB',
  description: 'มือถือสมาร์ทโฟน flagship'
})

if (!result.is_valid && result.requires_subcategory) {
  // Show SubcategorySelector with suggestions
  console.log(result.suggested_subcategories)
  // Output: [
  //   { id: 'mobile-phone', name: 'มือถือ / โทรศัพท์', confidence: 0.85, ... }
  // ]
}
```

---

## 📊 **Example Scenarios**

### **Scenario 1: Auto-Suggest (High Confidence)**

```
Input:
- Category: มือถือและแท็บเล็ต
- Title: "iPhone 15 Pro Max"
- Description: "smartphone flagship"

AI Suggests:
1. มือถือ / โทรศัพท์ [85%] ✨
2. อุปกรณ์เสริม [20%]

User: Clicks #1 → Valid ✓
```

### **Scenario 2: Equal Confidence**

```
Input:
- Category: อิเล็กทรอนิกส์
- Title: "กล้อง Canon EOS"
- Description: "กล้องดิจิตอล"

AI Suggests:
1. กล้อง [90%] ✨
2. เครื่องเสียง [10%]

User: Clicks #1 → Valid ✓
```

### **Scenario 3: No Subcategory Needed**

```
Input:
- Category: อื่นๆ (ID: 13)

Result:
- is_valid: true
- requires_subcategory: false
- No UI shown ✓
```

---

## ✅ **Validation Flow**

```
1. Check if category requires subcategory
   ↓
   NO → is_valid: true (skip)
   YES → Continue
   ↓
2. Check if subcategory already selected
   ↓
   YES → Validate ID → is_valid: true/false
   NO → Continue
   ↓
3. Calculate confidence for all subcategories
   ↓
4. Sort by confidence, take top 3
   ↓
5. Return:
   - is_valid: false
   - suggested_subcategories: [top 3]
   - helper_text: "กรุณาเลือก..."
```

---

## 🚀 **Integration**

### **In Category Confirmation:**

```tsx
import { validateSubcategory } from '@/lib/subcategory-validator-ai'
import SubcategorySelector from '@/components/listing/SubcategorySelector'

// After user selects category
const subcatValidation = validateSubcategory({
  categoryId: selectedCategory,
  title: listingData.title,
  description: listingData.description
})

<SubcategorySelector
  validation={subcatValidation}
  selectedSubcategoryId={selectedSubcategoryId}
  onSelectSubcategory={(id) => setSelectedSubcategoryId(id)}
/>
```

---

## 💡 **Benefits**

1. **Better Organization**: Ensures products are in correct subcategories
2. **AI Assistance**: Smart suggestions save user time
3. **Gentle Prompts**: Non-blocking validation with helpful guidance
4. **Flexibility**: Works only for categories that need it
5. **Transparency**: Shows confidence scores & reasoning

---

## 📁 **Files**

1. **`/src/lib/subcategory-validator-ai.ts`** - Validation logic
2. **`/src/components/listing/SubcategorySelector.tsx`** - UI component
3. **`/docs/SUBCATEGORY_VALIDATOR.md`** - This documentation

---

**🎊 Smart subcategory selection made easy!**
