# 🤖 **Product Detail Intelligence AI - Integration Guide**

## 📋 **Overview:**

Hybrid AI system that assists users in creating accurate, complete product listings using a **Human-in-the-loop** approach.

### **Core Philosophy:**
1. ✅ **Form data = Source of truth**
2. ✅ **AI assists, never overrides**
3. ✅ **Never blocks posting**
4. ✅ **Soft guidance only**

---

## 🎯 **What It Does:**

### **6-Step Analysis Process:**

```
1. Context Understanding      → Detect product type
2. Consistency Check          → Validate category/form alignment
3. Required Field Validation  → Check missing critical fields
4. Smart Suggestions          → Recommend additional details
5. Language Improvement       → Suggest better title/description
6. Sell Readiness Evaluation  → Overall quality score
```

---

## 📦 **Installation & Usage:**

### **1. Import the Service:**

```typescript
import { 
  analyzeProductDetails,
  type ProductDetailInput,
  type ProductDetailAnalysis 
} from '@/lib/product-detail-intelligence'
```

### **2. Prepare Input:**

```typescript
const input: ProductDetailInput = {
  images: [file1, file2], // Optional
  title: "จอมอนิเตอร์ HP 24 นิ้ว",
  mainCategory: "4", // Computers
  subcategory: "403", // Monitors
  formFields: {
    price: 3500,
    condition: 'used',
    brand: 'HP',
    model: 'W1973a',
    screenSize: '24',
    resolution: 'Full HD'
  },
  sellerType: 'individual',
  description: "จอคอมสภาพดี"
}
```

### **3. Call Analysis:**

```typescript
const analysis = await analyzeProductDetails(input)
```

### **4. Display Results:**

```typescript
console.log('Product Type:', analysis.detected_product_type)
console.log('Confidence:', analysis.confidence_level)
console.log('Readiness Level:', analysis.sell_readiness_level)
console.log('Readiness Score:', analysis.sell_readiness_score)
console.log('Tips:', analysis.final_soft_tips.th)
```

---

## 🎨 **UI Integration:**

### **Step-by-Step UI Flow:**

```tsx
// 1. User fills form
const [formData, setFormData] = useState(...)
const [analysis, setAnalysis] = useState<ProductDetailAnalysis>()

// 2. Trigger analysis (on blur or button click)
const handleAnalyze = async () => {
  const result = await analyzeProductDetails({
    title: formData.title,
    mainCategory: formData.category,
    subcategory: formData.subcategory,
    formFields: formData.fields,
    sellerType: 'individual'
  })
  
  setAnalysis(result)
}

// 3. Display soft suggestions
{analysis && (
  <div className="mt-4 p-4 bg-blue-50 rounded-lg">
    <h3>💡 คำแนะนำจาก AI</h3>
    
    {/* Readiness Badge */}
    <div className="mb-2">
      <span className={getBadgeColor(analysis.sell_readiness_level)}>
        {analysis.sell_readiness_level}
      </span>
      <span className="ml-2">
        {analysis.sell_readiness_score}/100
      </span>
    </div>
    
    {/* Tips */}
    <ul>
      {analysis.final_soft_tips.th.map((tip, i) => (
        <li key={i}>{tip}</li>
      ))}
    </ul>
    
    {/* Suggested Title */}
    {analysis.suggested_title !== formData.title && (
      <div className="mt-2">
        <p className="text-sm text-gray-600">แนะนำชื่อใหม่:</p>
        <p className="font-medium">{analysis.suggested_title}</p>
        <button onClick={() => setFormData({...formData, title: analysis.suggested_title})}>
          ใช้ชื่อนี้
        </button>
      </div>
    )}
    
    {/* Missing Fields */}
    {analysis.missing_required_fields.length > 0 && (
      <div className="mt-2 text-orange-600">
        <p>⚠️ ควรเพิ่ม: {analysis.missing_required_fields.join(', ')}</p>
      </div>
    )}
    
    {/* Suggested Additional Fields */}
    {analysis.suggested_additional_fields.map((field, i) => (
      <div key={i} className="mt-2 border-l-4 border-blue-400 pl-2">
        <p className="font-medium">{field.field_label_th}</p>
        <p className="text-sm text-gray-600">{field.why_it_matters}</p>
        <p className="text-xs text-gray-500">
          ผู้ซื้อถาม: {analysis.buyer_question_simulation.find(
            q => q.related_field === field.field_name
          )?.question_th}
        </p>
      </div>
    ))}
  </div>
)}
```

---

## 📊 **Output Structure:**

### **Full Analysis Object:**

```typescript
{
  // STEP 1: Context
  "detected_product_type": "จอคอมพิวเตอร์",
  "confidence_level": 85,
  
  // STEP 2: Consistency
  "consistency_score": 95,
  "detected_conflicts": [],
  "soft_category_suggestion": "",
  
  // STEP 3: Validation
  "missing_required_fields": [],
  "missing_trust_fields": ["อายุการใช้งาน"],
  
  // STEP 4: Suggestions
  "suggested_additional_fields": [
    {
      "field_name": "warranty",
      "field_label_th": "การรับประกัน",
      "field_label_en": "Warranty",
      "why_it_matters": "สร้างความมั่นใจให้ผู้ซื้อ",
      "sample_value": "ยังเหลือประกัน 6 เดือน",
      "buyer_cares_because": "การรับประกันลดความเสี่ยง"
    }
  ],
  "buyer_question_simulation": [
    {
      "question_th": "ยังมีประกันไหม?",
      "question_en": "Is warranty available?",
      "related_field": "warranty"
    }
  ],
  
  // STEP 5: Language
  "suggested_title": "HP W1973a จอมอนิเตอร์ HP 24 นิ้ว มือสอง",
  "suggested_description": "...",
  
  // STEP 6: Readiness
  "sell_readiness_level": "Good",
  "sell_readiness_score": 85,
  "final_soft_tips": {
    "th": [
      "👍 ดีแล้ว แต่อาจเพิ่มรายละเอียดอีกนิด",
      "พิจารณาเพิ่ม: อายุการใช้งาน"
    ],
    "en": [
      "👍 Good, but could add more details",
      "Consider adding: usage duration"
    ]
  }
}
```

---

## 🎯 **Real-World Examples:**

### **Example 1: Excellent Listing**

```typescript
Input:
{
  title: "iPhone 15 Pro Max 256GB สีทอง เครื่องไทย",
  mainCategory: "3",
  subcategory: "301",
  formFields: {
    price: 42000,
    condition: 'like_new',
    brand: 'Apple',
    model: 'iPhone 15 Pro Max',
    storage: '256GB',
    color: 'ทอง',
    battery_health: '100%',
    warranty: 'เหลือประกัน 11 เดือน',
    accessories: 'กล่อง + สายชาร์จ + หูฟัง ครบ'
  }
}

Output:
{
  sell_readiness_level: "Excellent",
  sell_readiness_score: 98,
  final_soft_tips: {
    th: ["🎉 พร้อมลงขายเลย!", "✨ รายละเอียดสอดคล้องกันดีมาก!"]
  }
}
```

### **Example 2: Needs Improvement**

```typescript
Input:
{
  title: "จอคอม",
  mainCategory: "4",
  formFields: {
    price: 0,  // Missing!
    condition: ''  // Missing!
  }
}

Output:
{
  sell_readiness_level: "Risky",
  sell_readiness_score: 45,
  missing_required_fields: ["ราคา", "สภาพสินค้า"],
  missing_trust_fields: ["ยี่ห้อ", "รุ่น"],
  final_soft_tips: {
    th: [
      "🚨 ขาดรายละเอียดสำคัญ อาจไม่น่าเชื่อถือ",
      "กรอก: ราคา, สภาพสินค้า",
      "พิจารณาเพิ่ม: ยี่ห้อ, รุ่น"
    ]
  },
  suggested_title: "จอคอม มือสอง",
  suggested_description: "...(template with placeholders)"
}
```

### **Example 3: Category Conflict**

```typescript
Input:
{
  title: "เครื่องพิมพ์ Epson L3110",
  mainCategory: "4",
  subcategory: "403"  // Monitor subcategory! Wrong!
}

Output:
{
  consistency_score: 85,
  detected_conflicts: [
    {
      field: "subcategory",
      expected_value: "เครื่องพิมพ์",
      actual_value: "จอคอมพิวเตอร์",
      reason: "ชื่อสินค้าบ่งบอกว่าเป็นเครื่องพิมพ์",
      severity: "medium"
    }
  ],
  soft_category_suggestion: "สินค้านี้ดูเหมือนจะเป็น \"เครื่องพิมพ์\" มากกว่า"
}
```

---

## 🎨 **UI Components:**

### **1. Readiness Badge:**

```tsx
function ReadinessBadge({ level, score }: { level: string, score: number }) {
  const colors = {
    'Excellent': 'bg-green-100 text-green-800',
    'Good': 'bg-blue-100 text-blue-800',
    'Needs Improvement': 'bg-yellow-100 text-yellow-800',
    'Risky': 'bg-red-100 text-red-800'
  }
  
  return (
    <span className={`px-3 py-1 rounded-full ${colors[level]}`}>
      {level} ({score}/100)
    </span>
  )
}
```

### **2. Soft Suggestion Card:**

```tsx
function SuggestionCard({ field }: { field: SuggestedField }) {
  return (
    <div className="p-3 bg-white border-l-4 border-blue-400 rounded">
      <h4 className="font-medium">{field.field_label_th}</h4>
      <p className="text-sm text-gray-600 mt-1">{field.why_it_matters}</p>
      {field.sample_value && (
        <p className="text-xs text-gray-500 mt-1">
          ตัวอย่าง: {field.sample_value}
        </p>
      )}
      <button className="mt-2 text-sm text-blue-600 hover:underline">
        + เพิ่มฟิลด์นี้
      </button>
    </div>
  )
}
```

### **3. Buyer Questions Simulator:**

```tsx
function BuyerQuestions({ questions }: { questions: BuyerQuestion[] }) {
  return (
    <div className="p-4 bg-purple-50 rounded-lg">
      <h3 className="font-bold mb-2">🤔 คำถามที่ผู้ซื้อมักถาม:</h3>
      <ul className="space-y-2">
        {questions.map((q, i) => (
          <li key={i} className="flex items-start gap-2">
            <span className="text-purple-600">❓</span>
            <span className="text-sm">{q.question_th}</span>
          </li>
        ))}
      </ul>
      <p className="text-xs text-gray-600 mt-2">
        💡 เพิ่มรายละเอียดเหล่านี้จะช่วยตอบคำถามล่วงหน้า
      </p>
    </div>
  )
}
```

---

## 🔧 **Configuration:**

### **Customizable Thresholds:**

```typescript
// In product-detail-intelligence.ts

const CONFIG = {
  // Readiness score thresholds
  EXCELLENT_THRESHOLD: 90,
  GOOD_THRESHOLD: 75,
  NEEDS_IMPROVEMENT_THRESHOLD: 60,
  
  // Penalty weights
  CONFLICT_PENALTY: 10,
  MISSING_REQUIRED_PENALTY: 15,
  MISSING_TRUST_PENALTY: 5,
  
  // Confidence boosts
  SUBCATEGORY_BOOST: 15,
  KEYWORD_MATCH_BOOST: 10
}
```

---

## 📈 **Performance Considerations:**

### **When to Trigger Analysis:**

1. **On form blur** (best UX)
2. **On button click** (user-controlled)
3. **Before submit** (final check)

### **Debouncing:**

```typescript
import { debounce } from 'lodash'

const debouncedAnalyze = debounce(async (input) => {
  const analysis = await analyzeProductDetails(input)
  setAnalysis(analysis)
}, 1000) // Wait 1s after user stops typing
```

### **Caching:**

```typescript
const analysisCache = new Map()

async function getCachedAnalysis(input: ProductDetailInput) {
  const key = JSON.stringify(input)
  
  if (analysisCache.has(key)) {
    return analysisCache.get(key)
  }
  
  const analysis = await analyzeProductDetails(input)
  analysisCache.set(key, analysis)
  
  return analysis
}
```

---

## ✅ **Best Practices:**

### **1. Never Block User:**
```tsx
// ❌ DON'T
if (analysis.sell_readiness_score < 60) {
  return <div>Cannot submit!</div>
}

// ✅ DO
<button onClick={handleSubmit}>
  ลงขาย
  {analysis.sell_readiness_score < 60 && (
    <span className="text-xs text-yellow-600 ml-2">
      (แนะนำเพิ่มรายละเอียด)
    </span>
  )}
</button>
```

### **2. Soft Language:**
```tsx
// ❌ DON'T
<p className="text-red-600">ERROR: Missing fields!</p>

// ✅ DO
<p className="text-blue-600">💡 เพิ่มฟิลด์เหล่านี้จะช่วยขายได้เร็วขึ้น</p>
```

### **3. Make Suggestions Actionable:**
```tsx
// ✅ DO
<div>
  <p>แนะนำชื่อ: {analysis.suggested_title}</p>
  <button onClick={() => applyTitle(analysis.suggested_title)}>
    ใช้ชื่อนี้
  </button>
  <button onClick={() => {}}>
    ไม่ใช้
  </button>
</div>
```

---

## 🚀 **Next Steps:**

1. **Integrate into sell-simple page**
2. **Add real-time analysis**
3. **Create beautiful UI components**
4. **Test with real users**
5. **Collect feedback and iterate**

---

**Result: AI Assistant that helps, never hinders! 🌟**
