# JaiKod Category System Documentation

## 📋 Overview

ระบบหมวดหมู่สินค้าแบบ Multi-Level สำหรับ JaiKod Marketplace ที่ออกแบบมาเพื่อรองรับ:
- **24 หมวดหมู่หลัก** (Main Categories)
- **หมวดหมู่ย่อยระดับ 2 และ 3** (Sub-categories)
- **Attributes เฉพาะสำหรับแต่ละหมวดหมู่**
- **AI Auto-fill Support**
- **Validation System**

---

## 🗂️ Category Structure

### Level 1: Main Categories (24 categories)

1. **มือถือและแท็บเล็ต** (Mobiles & Tablets) 📱
2. **คอมพิวเตอร์และแล็ปท็อป** (Computers & Laptops) 💻
3. **กล้องและอุปกรณ์ถ่ายภาพ** (Cameras & Photography) 📷
4. **แฟชั่นและเครื่องแต่งกาย** (Fashion & Accessories) 👕
5. **นาฬิกาและเครื่องประดับ** (Watches & Jewelry) ⌚
6. **สุขภาพและความงาม** (Health & Beauty) 💄
7. **แม่และเด็ก** (Mom & Baby) 🍼
8. **ของตกแต่งบ้านและสวน** (Home & Living) 🏠
9. **เครื่องใช้ไฟฟ้าภายในบ้าน** (Home Appliances) 🔌
10. **ของเล่น เกม และงานอดิเรก** (Toys, Games & Hobbies) 🎮
11. **กีฬาและกิจกรรมกลางแจ้ง** (Sports & Outdoors) ⚽
12. **ยานยนต์และอะไหล่** (Automotive) 🚗
13. **สัตว์เลี้ยง** (Pet Supplies) 🐱
14. **ของสะสมและงานศิลปะ** (Collectibles & Art) 🎨
15. **พระเครื่องและวัตถุมงคล** (Amulets & Sacred Items) 🙏
16. **หนังสือและความรู้** (Books & Stationery) 📚
17. **ดนตรีและเครื่องดนตรี** (Music & Instruments) 🎸
18. **ตั๋วและบัตรกำนัล** (Tickets & Vouchers) 🎫
19. **อสังหาริมทรัพย์** (Real Estate) 🏢
20. **อื่นๆ** (Others) 📦

### 🆕 Trending Categories (4 new categories)

21. **Cryptocurrency & NFT** ₿
22. **Sustainability & Eco-Friendly** ♻️
23. **Work From Home** 🏡
24. **Vintage & Retro** 📻

---

## 💡 Key Features

### 1. Multi-Level Hierarchy
```
Main Category (Level 1)
  └── Sub Category (Level 2)
        └── Sub-Sub Category (Level 3)
```

**Example:**
```
มือถือและแท็บเล็ต (Mobiles & Tablets)
  └── สมาร์ทโฟน (Smartphones)
        ├── iPhone
        ├── Samsung Galaxy
        ├── Xiaomi / Redmi
        └── Gaming Phones
```

### 2. Category Attributes

แต่ละหมวดหมู่มี attributes เฉพาะที่ช่วยในการ:
- กรอกข้อมูลสินค้า
- ค้นหาและกรอง
- AI Classification

**Attribute Types:**
- `select` - เลือกจากตัวเลือก
- `multiselect` - เลือกได้หลายตัวเลือก
- `text` - ข้อความอิสระ
- `number` - ตัวเลข
- `boolean` - ใช่/ไม่ใช่

**Example Attributes for Smartphones:**
```typescript
{
  brand: 'Apple',
  model: 'iPhone 15 Pro',
  storage: '256GB',
  ram: '8GB',
  color: 'Natural Titanium',
  condition: 'like_new',
  unlocked: true,
  battery_health: 98,
  accessories_included: ['Charger', 'Cable', 'Box']
}
```

### 3. AI Auto-fill Support

Attributes ที่มี `aiSuggested: true` สามารถให้ AI เติมข้อมูลอัตโนมัติจากรูปภาพได้:

**AI can auto-fill:**
- ✅ Brand
- ✅ Model
- ✅ Color
- ✅ Condition
- ✅ Storage
- ✅ Category

**User must fill:**
- ❌ Price
- ❌ Warranty status
- ❌ Accessories included
- ❌ Battery health

---

## 🔧 Usage Guide

### Import the System

```typescript
import {
  ALL_CATEGORIES,
  getMainCategories,
  getSubCategories,
  findCategoryBySlug,
  getAttributesForCategory,
  getCategoryBreadcrumb,
  searchCategories,
  getAISuggestedAttributes,
  validateProductAttributes
} from '@/constants/categorySystem'
```

### 1. Get All Main Categories

```typescript
const mainCategories = getMainCategories()
// Returns: Array of 24 main categories
```

### 2. Get Subcategories

```typescript
const subcategories = getSubCategories('mobiles')
// Returns: ['smartphones', 'tablets', 'mobile-accessories']
```

### 3. Find Category by Slug

```typescript
const category = findCategoryBySlug('smartphones')
// Returns: Category object with all details
```

### 4. Get Category Attributes

```typescript
const attributes = getAttributesForCategory('smartphones')
// Returns: All attributes including inherited from parent
```

### 5. Get Breadcrumb Path

```typescript
const breadcrumb = getCategoryBreadcrumb('iphone')
// Returns: [
//   { name_th: 'มือถือและแท็บเล็ต', slug: 'mobiles' },
//   { name_th: 'สมาร์ทโฟน', slug: 'smartphones' },
//   { name_th: 'iPhone', slug: 'iphone' }
// ]
```

### 6. Search Categories

```typescript
const results = searchCategories('กล้อง')
// Returns: All categories matching "กล้อง" in Thai or English
```

### 7. Get AI-Suggested Attributes

```typescript
const aiAttrs = getAISuggestedAttributes('smartphones')
// Returns: Only attributes that AI can auto-fill
```

### 8. Validate Product Attributes

```typescript
const validation = validateProductAttributes('smartphones', {
  brand: 'Apple',
  model: 'iPhone 15',
  storage: '256GB'
  // Missing required fields...
})
// Returns: { valid: false, errors: ['condition is required'] }
```

---

## 📊 Category Statistics

```typescript
import { getCategoryStats } from '@/constants/categorySystem'

const stats = getCategoryStats()
// Returns:
// {
//   total: 300+,
//   level1: 24,
//   level2: 150+,
//   level3: 200+
// }
```

---

## 🎯 Use Cases

### 1. Product Listing Form

```typescript
// Step 1: User selects main category
const mainCategories = getMainCategories()

// Step 2: Show subcategories
const subcategories = getSubCategories(selectedMainCategory)

// Step 3: Get attributes for selected category
const attributes = getAttributesForCategory(selectedCategory)

// Step 4: AI fills suggested attributes
const aiAttrs = getAISuggestedAttributes(selectedCategory)
// Auto-fill these from image recognition

// Step 5: Validate before submission
const validation = validateProductAttributes(selectedCategory, formData)
```

### 2. Search & Filter

```typescript
// Get all products in category
const category = findCategoryBySlug('smartphones')

// Build filter UI from attributes
const attributes = getAttributesForCategory('smartphones')
attributes.forEach(attr => {
  if (attr.type === 'select') {
    // Render dropdown with attr.options
  }
})
```

### 3. Breadcrumb Navigation

```typescript
const breadcrumb = getCategoryBreadcrumb('iphone')
// Render: Home > มือถือและแท็บเล็ต > สมาร์ทโฟน > iPhone
```

---

## 🤖 AI Integration

### Snap & Sell Feature

```typescript
// 1. User uploads image
const imageFile = uploadedImage

// 2. AI analyzes image
const aiAnalysis = await analyzeImage(imageFile)
// Returns: {
//   category: 'smartphones',
//   brand: 'Apple',
//   model: 'iPhone 15 Pro',
//   color: 'Natural Titanium',
//   condition: 'like_new',
//   confidence: 0.95
// }

// 3. Get AI-suggested attributes for this category
const aiAttrs = getAISuggestedAttributes(aiAnalysis.category)

// 4. Auto-fill form
aiAttrs.forEach(attr => {
  if (aiAnalysis[attr.name]) {
    formData[attr.name] = aiAnalysis[attr.name]
  }
})

// 5. User reviews and submits
```

---

## 📝 Common Attributes

All categories inherit these common attributes:

```typescript
COMMON_ATTRIBUTES = {
  CONDITION: {
    options: ['new', 'like_new', 'good', 'fair', 'poor'],
    required: true,
    aiSuggested: true
  },
  BRAND: {
    type: 'text',
    aiSuggested: true
  },
  COLOR: {
    type: 'text',
    aiSuggested: true
  },
  WARRANTY: {
    type: 'boolean',
    aiSuggested: false
  },
  ORIGINAL_BOX: {
    type: 'boolean',
    aiSuggested: true
  }
}
```

---

## 🔍 Category Examples

### Example 1: Smartphones

```typescript
{
  id: 'smartphones',
  name_th: 'สมาร์ทโฟน',
  name_en: 'Smartphones',
  slug: 'smartphones',
  attributes: [
    { name: 'brand', type: 'select', options: ['Apple', 'Samsung', ...] },
    { name: 'model', type: 'text', required: true },
    { name: 'storage', type: 'select', options: ['64GB', '128GB', ...] },
    { name: 'ram', type: 'select', options: ['4GB', '6GB', '8GB', ...] },
    { name: 'battery_health', type: 'number' }
  ],
  subCategories: [
    { id: 'iphone', name_th: 'iPhone', slug: 'iphone' },
    { id: 'samsung-galaxy', name_th: 'Samsung Galaxy', slug: 'samsung-galaxy' }
  ]
}
```

### Example 2: Fashion

```typescript
{
  id: 'footwear',
  name_th: 'รองเท้า',
  name_en: 'Footwear',
  slug: 'footwear',
  attributes: [
    { name: 'brand', type: 'select', options: ['Nike', 'Adidas', ...] },
    { name: 'size', type: 'text', required: true },
    { name: 'gender', type: 'select', options: ['Men', 'Women', 'Unisex'] }
  ],
  subCategories: [
    { id: 'sneakers', name_th: 'รองเท้าผ้าใบ', slug: 'sneakers' },
    { id: 'boots', name_th: 'รองเท้าบูท', slug: 'boots' }
  ]
}
```

---

## 🚀 Migration from Old System

### Old System (categories.ts)
```typescript
export const CATEGORIES = [
  { id: 1, name_th: 'มือถือ', slug: 'mobiles', icon: '📱' }
]
```

### New System (categorySystem.ts)
```typescript
import { ALL_CATEGORIES, CATEGORIES } from '@/constants/categorySystem'

// For backward compatibility, CATEGORIES is still available
// But use ALL_CATEGORIES for full hierarchy
```

---

## 📚 File Structure

```
src/constants/
├── categoryHierarchy.ts          # Categories 1-2 + Base types
├── categoryHierarchyExtended.ts  # Categories 3-10
├── categoryHierarchyFinal.ts     # Categories 11-24
└── categorySystem.ts             # Master export + Helper functions
```

---

## ✅ Best Practices

1. **Always use helper functions** instead of directly accessing arrays
2. **Validate attributes** before saving products
3. **Use breadcrumbs** for better UX
4. **Leverage AI suggestions** for faster listing
5. **Keep attributes consistent** across similar categories

---

## 🎨 UI Components Suggestions

### Category Selector Component
```tsx
<CategorySelector
  level={1}
  onSelect={(category) => {
    setSelectedCategory(category)
    const subs = getSubCategories(category.slug)
    // Show next level
  }}
/>
```

### Attribute Form Component
```tsx
<AttributeForm
  categorySlug={selectedCategory}
  aiSuggestions={aiData}
  onSubmit={(data) => {
    const validation = validateProductAttributes(categorySlug, data)
    if (validation.valid) {
      // Submit
    }
  }}
/>
```

---

## 📞 Support

For questions or suggestions about the category system:
- Check this documentation
- Review code examples in `/src/constants/`
- Test with helper functions

---

**Last Updated:** 2025-12-07  
**Version:** 1.0  
**Total Categories:** 24 Main + 300+ Sub-categories
