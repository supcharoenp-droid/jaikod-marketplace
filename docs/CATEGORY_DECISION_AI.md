# Category Decision AI - Human-in-the-Loop

## 📋 **Overview**

Intelligent category selection system that uses AI confidence scores to decide when to auto-select categories vs. when to ask for human confirmation.

---

## 🎯 **Decision Logic**

### **Process Flow:**

```
1. Upload Photo
   ↓
2. AI Analyzes (OpenAI Vision)
   ↓
3. Category Decision AI
   ├─ Calculate confidence scores for all categories
   ├─ Apply sanity rules
   └─ Make decision
      ↓
   ├─ ≥ 80% confidence → Auto-select → Go to Details
   └─ < 80% confidence → Show top 2-3 options → User confirms → Go to Details
```

---

## 🧮 **Confidence Calculation**

### **Scoring Method:**

| Signal | Weight | Max Score |
|--------|--------|-----------|
| **Title keywords match** | Highest | 40 points |
| **Description keywords match** | High | 30 points |
| **Detected objects match** | Medium | 20 points |
| **Image analysis match** | Low | 10 points |
| **Total** | | **100 points** |

**Final Confidence = Score / 100**

---

## 🛡️ **Sanity Rules**

### **Forbidden Combinations:**

Prevents illogical category assignments:

```typescript
{
  keywords: ['ปั๊มลม', 'air pump'],
  forbidden_categories: ['Computer', 'Game', 'Camera']
},
{
  keywords: ['iPhone', 'Samsung', 'มือถือ'],
  forbidden_categories: ['Vehicle', 'Property', 'Computer']
}
```

**Effect**: Sets confidence to 0 for forbidden combinations

---

## 🎨 **User Interface**

### **High Confidence (≥80%):**

```
┌────────────────────────────────────┐
│ ✨ AI เลือกหมวดหมู่ให้คุณแล้ว       │
│                                    │
│ 📱 มือถือและแท็บเล็ต                │
│ [95% มั่นใจ]                       │
│                                    │
│ AI มั่นใจสูงมาก - ตรงกับคำค้นหลายคำ│
│                                    │
│ [✓ ใช่ ถูกต้องแล้ว ดำเนินการต่อ]    │
│                                    │
│ > หรือเลือกหมวดอื่น (2 ตัวเลือก)    │
└────────────────────────────────────┘
```

###  **Low Confidence (<80%):**

```
┌────────────────────────────────────┐
│ ⚠️ กรุณาเลือกหมวดหมู่ที่ตรงที่สุด    │
│                                    │
│ AI ไม่มั่นใจเพียงพอ (72%)           │
│ กรุณาช่วยตรวจสอบและเลือก            │
│                                    │
│ ┌──────────────────────────┐      │
│ │ ○ มือถือและแท็บเล็ต [72%]│      │
│ │   ตรงกับคำค้นหลายคำ      │      │
│ └──────────────────────────┘      │
│                                    │
│ ┌──────────────────────────┐      │
│ │ ○ อิเล็กทรอนิกส์ [65%]   │      │
│ │   มีคำค้นที่เกี่ยวข้อง    │      │
│ └──────────────────────────┘      │
│                                    │
│ [ยืนยันและดำเนินการต่อ]             │
└────────────────────────────────────┘
```

---

## 🔧 **API Reference**

### **`decideCategoryWithAI()`**

```typescript
interface CategoryDecisionParams {
  title: string
  description: string
  detectedObjects: string[]
  imageAnalysis?: string
  aiSuggestedCategory?: string
}

interface CategoryDecisionResult {
  recommended_categories: CategoryRecommendation[]
  confidence_scores: Record<string, number>
  require_user_confirmation: boolean
  auto_selected?: CategoryRecommendation
}
```

**Usage:**

```typescript
const decision = decideCategoryWithAI({
  title: 'iPhone 15 Pro Max 256GB',
  description: 'มือสอง สภาพดี ยังอยู่ในประกัน',
  detectedObjects: ['smartphone', 'phone'],
  imageAnalysis: 'mobile phone device'
})

if (decision.require_user_confirmation) {
  // Show CategoryConfirmation component
} else {
  // Auto-select: decision.auto_selected
}
```

---

## 📊 **Example Scenarios**

### **Scenario 1: High Confidence - Auto-Select**

```
Input:
- Title: "iPhone 15 Pro Max 256GB"
- Detected: ["smartphone", "phone"]

Decision:
- Top Category: มือถือและแท็บเล็ต (95%)
- Action: Auto-select → Go to details
- No user confirmation needed
```

### **Scenario 2: Low Confidence - Ask User**

```
Input:
- Title: "ปั๊มลมพกพา Air Pump"
- Detected: ["pump", "device"]

Decision:
- Top 1: อื่นๆ (72%)
- Top 2: เครื่องใช้ไฟฟ้า (65%)
- Top 3: อุปกรณ์ช่าง (58%)
- Action: Show 3 options → User confirms
```

### **Scenario 3: Sanity Rule Violation**

```
Input:
- Title: "ปั๊มลมพกพา"
- AI suggests: "คอมพิวเตอร์" (85%)

Decision:
- Sanity rule triggered!
- Confidence set to 0%
- Fallback to next best category
- Requires user confirmation
```

---

## ✅ **Benefits**

1. **Smart Auto-Selection**: High confidence → no friction
2. **Human Verification**: Low confidence → user decides
3. **Error Prevention**: Sanity rules prevent nonsense
4. **Transparency**: Shows confidence scores & reasoning
5. **Flexibility**: User can always override

---

## 🚀 **Integration Points**

### **Files Modified:**

1. **`/src/lib/category-decision-ai.ts`** - Decision engine
2. **`/src/components/listing/CategoryConfirmation.tsx`** - UI component
3. **`/src/app/sell-simple/page.tsx`** - Main integration

### **New Flow:**

```
Upload → AI Analysis → Category Decision
  ├─ High confidence → Details
  └─ Low confidence → Category Confirm → Details
```

---

**🎊 Smart, transparent, and user-friendly!**
