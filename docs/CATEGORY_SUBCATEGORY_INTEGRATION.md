# 🎯 AI-Powered Category & Subcategory System - Complete Integration

## 📋 **System Overview**

ระบบการเลือกหมวดหมู่และหมวดย่อยที่ใช้ AI พร้อม Human-in-the-loop validation

---

## 🏗️ ** Architecture**

```
┌─────────────────┐
│  Upload Photo   │
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│  AI Analysis    │ (OpenAI Vision)
│  - Category     │
│  - Title        │
│  - Description  │
└────────┬────────┘
         │
         ↓
┌─────────────────────────┐
│  Category Decision AI   │
│  1. Calculate scores    │
│  2. Apply sanity rules  │
│  3. Decide confidence   │
└────────┬────────────────┘
         │
    ┌────┴────┐
    │         │
≥80%│         │<80%
    │         │
    ↓         ↓
┌────────┐  ┌────────────┐
│ Auto   │  │ User Picks │
│ Select │  │ Top 2-3    │
└───┬────┘  └─────┬──────┘
    │             │
    └──────┬──────┘
           ↓
┌──────────────────────────┐
│ Subcategory Validator AI │
│ - Check if required      │
│ - Suggest 2-3 options    │
│ - Validate selection     │
└────────┬─────────────────┘
         │
    ┌────┴────┐
    │         │
 Required│    │Not Required
    │         │
    ↓         │
┌────────┐   │
│ User   │   │
│ Picks  │   │
└───┬────┘   │
    │        │
    └────┬───┘
         ↓
┌─────────────┐
│   Details   │
│    Form     │
└─────────────┘
```

---

## 🔧 **Components**

### **1. Category Decision AI**
`src/lib/category-decision-ai.ts`

**Functions:**
- `decideCategoryWithAI()` - Main decision function
- `getCategoryExplanation()` - Human-readable confidence

**Features:**
- ✅ Confidence scoring (title, description, objects, image analysis)
- ✅ Sanity rules (forbidden combinations)
- ✅ Auto-select at 80%+ confidence
- ✅ Show top 2-3 at <80% confidence

---

### **2. Subcategory Validator AI**
`src/lib/subcategory-validator-ai.ts`

**Functions:**
- `validateSubcategory()` - Validation + suggestions
- `getSubcategoriesForCategory()` - Get all subcategories
- `categoryRequiresSubcategory()` - Check if required

**Features:**
- ✅ Keyword matching for suggestions
- ✅ Confidence scoring
- ✅ Only validates when required
- ✅ Returns top 2-3 suggestions

---

### **3. CategoryConfirmation Component**
`src/components/listing/CategoryConfirmation.tsx`

**Props:**
```typescript
{
  recommendations: CategoryRecommendation[]
  autoSelected?: CategoryRecommendation
  selectedCategoryId: string
  selectedSubcategoryId?: string
  productTitle: string
  productDescription: string
  onSelectCategory: (id: string) => void
  onSelectSubcategory: (id: string) => void
  onConfirm: () => void
}
```

**Features:**
- ✅ Shows auto-selected category (high confidence)
- ✅ Shows 2-3 options (low confidence)
- ✅ Integrated SubcategorySelector
- ✅ Validates before allowing confirmation
- ✅ Prevents confirmation if subcategory required but missing

---

### **4. SubcategorySelector Component**
`src/components/listing/SubcategorySelector.tsx`

**Props:**
```typescript
{
  validation: SubcategoryValidationResult
  selectedSubcategoryId?: string
  onSelectSubcategory: (id: string) => void
}
```

**Features:**
- ✅ Shows AI-suggested subcategories
- ✅ Displays confidence scores
- ✅ Only shown when required
- ✅ Confirmation when valid

---

## 🎨 **User Experience Flow**

### **Scenario 1: High Confidence + No Subcategory**

```
1. User uploads photo of "ปั๊มลม"
2. AI: 85% → "อื่นๆ" (auto-select)
3. Show: ✅ AI เลือกให้แล้ว: อื่นๆ [85%]
4. Subcategory: Not required
5. Button: [✓ ใช่ ถูกต้องแล้ว ดำเนินการต่อ] ← ENABLED
6. Click → Go to details
```

### **Scenario 2: High Confidence + Subcategory Required**

```
1. User uploads photo of "iPhone 15"
2. AI: 95% → "มือถือและแท็บเล็ต" (auto-select)
3. Show: ✅ AI เลือกให้แล้ว: มือถือและแท็บเล็ต [95%]
4. Subcategory: ⚠️ จำเป็นต้องเลือกหมวดย่อย
5. AI suggests:
   - มือถือ / โทรศัพท์ [85% ตรง] ← Top
   - แท็บเล็ต / iPad
6. Button: [✓ ใช่ ถูกต้องแล้ว...] ← DISABLED
7. User clicks "มือถือ / โทรศัพท์"
8. Button: ← ENABLED
9. Click → Go to details
```

### **Scenario 3: Low Confidence + Subcategory Required**

```
1. User uploads unclear photo
2. AI: 65% → "อิเล็กทรอนิกส์" (low confidence)
3. Show: ⚠️ AI ไม่มั่นใจเพียงพอ (65%) กรุณาเลือก
4. Options:
   - ○ อิเล็กทรอนิกส์ [65%]
   - ○ อื่นๆ [58%]
   - ○ เครื่องใช้ไฟฟ้า [52%]
5. User picks "อิเล็กทรอนิกส์"
6. Subcategory: ⚠️ จำเป็นต้องเลือกหมวดย่อย
7. AI suggests:
   - เครื่องเสียง [45%]
   - กล้อง [40%]
8. User picks "เครื่องเสียง"
9. Button: [ยืนยันและดำเนินการต่อ] ← ENABLED
10. Click → Go to details
```

---

## 🛡️ **Validation Rules**

### **Category Level:**
```typescript
// Sanity Rules
{
  keywords: ['ปั๊มลม', 'air pump'],
  forbidden_categories: ['Computer', 'Game']
} → Confidence = 0 if violated
```

### **Subcategory Level:**
```typescript
// Required for:
- มือถือและแท็บเล็ต (ID: 3)
- คอมพิวเตอร์และไอที (ID: 4)
- อิเล็กทรอนิกส์ (ID: 5)
- ยานยนต์ (ID: 1)
- อสังหาริมทรัพย์ (ID: 2)

// Not required for:
- อื่นๆ (ID: 13)
- Most other categories
```

---

## 📊 **Confidence Scoring**

### **Category Decision:**
```
Title keywords:      40 points (highest weight)
Description keywords: 30 points
Detected objects:    20 points
Image analysis:      10 points
─────────────────────────────
Total:               100 points → 0-1.0 confidence
```

### **Subcategory Decision:**
```
Keyword matches in title + description
Normalized: matches / min(total_keywords, 5)
```

---

## 🚀 **Integration Example**

```tsx
// In sell-simple/page.tsx

// 1. After AI analysis
const decision = decideCategoryWithAI({
  title: result.title,
  description: result.description,
  detectedObjects: result.detectedObjects,
  imageAnalysis: result.suggestedCategory
})

// 2. Route based on confidence
if (decision.require_user_confirmation) {
  setStep('category-confirm') // Show CategoryConfirmation
} else {
  setStep('details') // Skip confirmation
}

// 3. In CategoryConfirmation step
<CategoryConfirmation
  recommendations={categoryDecision.recommended_categories}
  autoSelected={categoryDecision.auto_selected}
  selectedCategoryId={selectedCategoryId}
  selectedSubcategoryId={selectedSubcategoryId}
  productTitle={listingData.title}
  productDescription={listingData.description}
  onSelectCategory={(id) => setSelectedCategoryId(id)}
  onSelectSubcategory={(id) => setSelectedSubcategoryId(id)}
  onConfirm={() => setStep('details')}
/>

// 4. Subcategory auto-validates inside CategoryConfirmation
// - Checks if required
// - Shows SubcategorySelector if needed
// - Disables confirm button until valid
```

---

## ✅ **Benefits**

1. **Smart Auto-Selection** - 80%+ confidence → no friction
2. **Human Verification** - <80% confidence → user decides
3. **Subcategory Intelligence** - AI suggests relevant options
4. **Error Prevention** - Sanity rules + validation
5. **Transparent** - Shows confidence + reasoning
6. **Flexible** - Only validates when needed
7. **Seamless UX** - Integrated flow

---

## 📁 **Files Created/Modified**

### **New Files:**
1. `/src/lib/category-decision-ai.ts`
2. `/src/lib/subcategory-validator-ai.ts`
3. `/src/components/listing/CategoryConfirmation.tsx`
4. `/src/components/listing/SubcategorySelector.tsx`
5. `/docs/CATEGORY_DECISION_AI.md`
6. `/docs/SUBCATEGORY_VALIDATOR.md`

### **Modified Files:**
1. `/src/app/sell-simple/page.tsx`
   - Added category-confirm step
   - Integrated decision logic
   - Added subcategory state

---

## 🎊 **Complete System Ready!**

**Test at:** `http://localhost:3000/sell-simple`

**Flow:**
```
Upload Photo → AI Analysis → Category Decision
  ├─ ≥80% → [Auto-select] → Subcategory? → Details
  └─ <80% → [User picks] → Subcategory? → Details
```

**Smart, transparent, and user-friendly!** 🚀
