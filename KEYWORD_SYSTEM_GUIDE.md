# 🔧 Keyword System Usage Guide

## 📖 Overview

ระบบ keyword ของ JaiKod ใช้ **2 ระดับ** ในการจัดหมวดหมู่สินค้า:

1. **Category Level** - จัดหมวดหมู่หลัก (เช่น Computers, Automotive)
2. **Subcategory Level** - จัดหมวดหมู่ย่อย (เช่น Keyboards, Monitors, Laptops)

## 🎯 How It Works

### Step 1: Category Detection
```typescript
import { decideCategoryWithAI } from '@/lib/category-decision-ai'

const result = decideCategoryWithAI({
    title: 'คีย์บอร์ดเกมมิ่ง Razer BlackWidow',
    description: 'คีย์บอร์ดเมคานิคัล RGB',
    detectedObjects: ['keyboard'],
    imageAnalysis: 'Gaming keyboard with RGB lighting'
})

// Result:
// {
//   recommended_categories: [
//     { categoryId: '4', categoryName: 'คอมพิวเตอร์และไอที', confidence: 0.95 }
//   ],
//   require_user_confirmation: false,
//   auto_selected: { categoryId: '4', ... }
// }
```

### Step 2: Subcategory Detection
```typescript
import { detectSubcategory } from '@/lib/subcategory-intelligence'

const subResult = detectSubcategory({
    categoryId: 4,
    title: 'คีย์บอร์ดเกมมิ่ง Razer BlackWidow',
    description: 'คีย์บอร์ดเมคานิคัล RGB',
    imageAnalysis: 'Gaming keyboard with RGB lighting',
    detectedObjects: ['keyboard']
})

// Result:
// {
//   subcategoryId: '408',  // Keyboards subcategory! ✅
//   subcategoryName: 'คีย์บอร์ด',
//   confidence: 0.85,
//   matchedKeywords: ['คีย์บอร์ด', 'keyboard', 'gaming keyboard', 'razer']
// }
```

## 📝 Keyword File Structure

### Each Category Has 2 Exports:

#### 1. Main Category Keywords (for category-level matching)
```typescript
export const COMPREHENSIVE_COMPUTER_KEYWORDS = [
    'คอมพิวเตอร์', 'computer', 'pc', 'laptop', 'monitor',
    'keyboard', 'mouse', 'printer'
]
```

#### 2. Subcategory Keywords (for precise matching)
```typescript
export const COMPUTER_SUBCATEGORY_KEYWORDS: Record<number, string[]> = {
    // 401: Laptops
    401: [
        'โน้ตบุ๊ค', 'laptop', 'notebook', 'macbook',
        'gaming laptop', 'asus laptop', 'hp laptop'
    ],
    
    // 408: Keyboards
    408: [
        'คีย์บอร์ด', 'keyboard', 'mechanical keyboard',
        'gaming keyboard', 'wireless keyboard',
        'razer keyboard', 'corsair keyboard'
    ],
    
    // 409: Mouse
    409: [
        'เมาส์', 'mouse', 'gaming mouse',
        'wireless mouse', 'logitech mouse'
    ]
}
```

## 🎨 Adding New Keywords

### For Existing Subcategory:
```typescript
// File: comprehensive-computer-keywords.ts
export const COMPUTER_SUBCATEGORY_KEYWORDS: Record<number, string[]> = {
    408: [
        // Existing keywords...
        'คีย์บอร์ด', 'keyboard',
        
        // ✅ ADD NEW KEYWORDS HERE
        'keychron', 'ducky keyboard', 'anne pro',
        'hot swap keyboard', 'custom keyboard'
    ]
}
```

### For New Subcategory:
If you add a new subcategory to `categories.ts`:

```typescript
// 1. Add to categories.ts
{
    id: 4,
    name_th: 'คอมพิวเตอร์และไอที',
    subcategories: [
        // ... existing subcategories
        { id: 411, name_th: 'แท็บเล็ตวาดรูป', name_en: 'Drawing Tablets', slug: 'drawing-tablets' } // NEW!
    ]
}

// 2. Add keywords to comprehensive file
export const COMPUTER_SUBCATEGORY_KEYWORDS: Record<number, string[]> = {
    // ... existing subcategories
    
    411: [  // NEW!
        'drawing tablet', 'แท็บเล็ตวาดรูป', 'pen tablet',
        'wacom', 'huion', 'xp-pen',
        'tablet วาดรูป', 'กระดานเขียน'
    ]
}
```

## 🧪 Testing Keywords

### Test Category Matching:
```typescript
// Test if product goes to correct category
const testCategoryMatch = (title: string, expectedCategoryId: number) => {
    const result = decideCategoryWithAI({
        title,
        description: '',
        detectedObjects: [],
        imageAnalysis: title
    })
    
    const topCategory = result.recommended_categories[0]
    console.log(`Expected: ${expectedCategoryId}, Got: ${topCategory.categoryId}`)
    console.log(`Confidence: ${topCategory.confidence}`)
}

// Test cases
testCategoryMatch('คีย์บอร์ด Razer', 4)  // Should → Category 4
testCategoryMatch('รถยนต์ Toyota Camry', 1)  // Should → Category 1
```

### Test Subcategory Matching:
```typescript
// Test if product goes to correct subcategory
const testSubcategoryMatch = (categoryId: number, title: string, expectedSubId: number) => {
    const result = detectSubcategory({
        categoryId,
        title,
        description: '',
        imageAnalysis: title
    })
    
    console.log(`Expected: ${expectedSubId}, Got: ${result?.subcategoryId}`)
    console.log(`Confidence: ${result?.confidence}`)
    console.log(`Matched: ${result?.matchedKeywords.join(', ')}`)
}

// Test cases
testSubcategoryMatch(4, 'คีย์บอร์ด Razer BlackWidow', 408)  // → Keyboards
testSubcategoryMatch(4, 'เมาส์ Logitech G502', 409)         // → Mouse
testSubcategoryMatch(4, 'จอ LG 27 นิ้ว 144Hz', 403)         // → Monitors
```

## 🎯 Best Practices

### 1. **Use Both Thai and English**
```typescript
✅ GOOD:
['คีย์บอร์ด', 'keyboard', 'คีย์บอร์ดเกม', 'gaming keyboard']

❌ BAD:
['keyboard']  // Missing Thai keywords
```

### 2. **Include Common Misspellings**
```typescript
✅ GOOD:
['โน้ตบุ๊ค', 'โนตบุค', 'โน๊ตบุ๊ค', 'laptop']

❌ BAD:
['โน้ตบุ๊ค', 'laptop']  // Missing variations
```

### 3. **Add Brand Names and Models**
```typescript
✅ GOOD:
['keyboard', 'razer keyboard', 'corsair k70', 'logitech g pro']

❌ BAD:
['keyboard']  // Too generic
```

### 4. **Include Specific Features**
```typescript
✅ GOOD:
['mechanical keyboard', 'wireless keyboard', 'rgb keyboard', 'hot swap']

❌ BAD:
['keyboard with lights']  // Too vague
```

### 5. **Avoid Overlapping Keywords Between Subcategories**
```typescript
❌ BAD:
408: ['keyboard', 'gaming', 'rgb', 'wireless']  // Keyboards
409: ['mouse', 'gaming', 'rgb', 'wireless']     // Mouse
// 'gaming', 'rgb', 'wireless' are too generic!

✅ GOOD:
408: ['keyboard', 'mechanical keyboard', 'gaming keyboard', 'wireless keyboard']
409: ['mouse', 'gaming mouse', 'wireless mouse', 'optical mouse']
```

## 📊 Confidence Levels

| Confidence | Meaning | Action |
|-----------|---------|--------|
| ≥ 80% | Very Confident | Auto-select |
| 60-79% | Confident | Show top 2-3 options |
| 40-59% | Moderate | Show top 3 options |
| < 40% | Low | Require manual selection |

## 🚫 Common Mistakes

### ❌ Mistake 1: Keywords Too Generic
```typescript
// BAD - Will match too many products
404: ['usb', 'rgb', 'wireless', 'gaming']
```

### ❌ Mistake 2: Missing Alternative Terms
```typescript
// BAD - Only one term
408: ['keyboard']

// GOOD - Multiple alternatives
408: ['keyboard', 'คีย์บอร์ด', 'แป้นพิมพ์', 'คีบอร์ด']
```

### ❌ Mistake 3: Not Using Model Numbers
```typescript
// BAD
403: ['monitor', 'จอ']

// GOOD - Includes model numbers that AI might detect
403: ['monitor', 'จอ', 'vg279', 'w2072a', 'e243']
```

## 🔍 Debugging Tips

### Check What Keywords Matched:
```typescript
const result = detectSubcategory({...})
console.log('Matched keywords:', result?.matchedKeywords)
console.log('Confidence:', result?.confidence)
```

### View Scoring Breakdown:
```typescript
// Enable detailed logging in category-decision-ai.ts
// Look for console.log statements showing score breakdown
```

### Test with Real Product Data:
```typescript
// Use actual product titles from your database
import { getProductById } from '@/lib/products'

const product = await getProductById('some-id')
const result = detectSubcategory({
    categoryId: product.category_id,
    title: product.title,
    description: product.description
})
```

## 📚 Related Files

- `src/lib/category-decision-ai.ts` - Category matching logic
- `src/lib/subcategory-intelligence.ts` - Subcategory matching logic
- `src/lib/expert-category-keywords.ts` - Main keyword registry
- `src/lib/comprehensive-*-keywords.ts` - Individual category keyword files
- `src/constants/categories.ts` - Category and subcategory definitions

---

**Last Updated:** 2025-12-17  
**Need Help?** Check `KEYWORD_IMPROVEMENT_SUMMARY.md` for recent changes
