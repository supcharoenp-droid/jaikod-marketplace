# 📋 Keyword System Restructuring Plan

## 🎯 Objective
Improve categorization accuracy by restructuring keyword files to support **subcategory-level matching**.

## 🔍 Current Issues
1. **Keywords are combined in single arrays** - Cannot differentiate between subcategories
2. **`subcategory-intelligence.ts` has limited coverage** - Only categories 3 & 4
3. **Inaccurate subcategory assignment** - Products may go to wrong subcategories (e.g., keyboards → Peripherals instead of Keyboards subcategory 408)

## ✅ Solution Structure

### 1. **New Keyword File Format**
Each comprehensive keyword file should export **TWO** things:

```typescript
// Main category keywords (for category-level matching)
export const COMPREHENSIVE_XXX_KEYWORDS = [
    // General category terms only
]

// Subcategory keywords (for precise subcategory matching)
export const XXX_SUBCATEGORY_KEYWORDS: Record<number, string[]> = {
    101: [/* subcategory 101 keywords */],
    102: [/* subcategory 102 keywords */],
    // ...
}
```

### 2. **Files to Restructure**

#### ✅ COMPLETED:
- [x] `comprehensive-computer-keywords.ts` - Category 4
  - Exported `COMPUTER_SUBCATEGORY_KEYWORDS` with IDs 401-410
  - Integrated into `subcategory-intelligence.ts`

#### 🔧 TODO:
- [ ] `comprehensive-automotive-keywords.ts` - Category 1
  - Subcategories: 101-109 (9 subcategories)
  
- [ ] `comprehensive-beauty-keywords.ts` - Category 14
  - Subcategories: 1401-1406 (6 subcategories)
  
- [ ] `comprehensive-baby-kids-keywords.ts` - Category 15
  - Subcategories: 1501-1506 (6 subcategories)
  
- [ ] `comprehensive-appliances-keywords.ts` - Category 5
  - Subcategories: 501-511 (11 subcategories)

- [ ] `comprehensive-mobiles-keywords.ts` - Category 3
  - Subcategories: 301-307 (7 subcategories)

- [ ] `comprehensive-realestate-keywords.ts` - Category 2
  - Subcategories: 201-208 (8 subcategories)

- [ ] `comprehensive-fashion-keywords.ts` - Category 6
  - Subcategories: 601-606 (6 subcategories)

- [ ] `comprehensive-gaming-keywords.ts` - Category 7
  - Subcategories: 701-707 (7 subcategories)

- [ ] `comprehensive-cameras-keywords.ts` - Category 8
  - Subcategories: 801-804 (4 subcategories)

- [ ] `comprehensive-collectibles-keywords.ts` - Category 9
  - Subcategories: 901-905 (5 subcategories)

- [ ] `comprehensive-pets-keywords.ts` - Category 10
  - Subcategories: 1001-1005 (5 subcategories)

- [ ] `comprehensive-sports-keywords.ts` - Category 12
  - Subcategories: 1201-1206 (6 subcategories)

- [ ] `comprehensive-home-garden-keywords.ts` - Category 13
  - Subcategories: 1301-1305 (5 subcategories)

- [ ] `comprehensive-books-education-keywords.ts` - Category 16
  - Subcategories: 1601-1606 (6 subcategories)

- [ ] `comprehensive-others-keywords.ts` - Category 99
  - Subcategories: 9901-9905 (5 subcategories)

### 3. **Update `subcategory-intelligence.ts`**

After each keyword file is restructured, import and add to `SUBCATEGORY_KEYWORDS`:

```typescript
import { COMPUTER_SUBCATEGORY_KEYWORDS } from './comprehensive-computer-keywords'
import { AUTOMOTIVE_SUBCATEGORY_KEYWORDS } from './comprehensive-automotive-keywords'
// ... add more

const SUBCATEGORY_KEYWORDS: Record<number, string[]> = {
    ...COMPUTER_SUBCATEGORY_KEYWORDS,     // 401-410 ✅
    ...AUTOMOTIVE_SUBCATEGORY_KEYWORDS,    // 101-109 ⏳
    // ... add more
}
```

## 🎯 Expected Benefits

1. **Accurate Subcategory Matching**
   - Keyboards → Subcategory 408 (not 404)
   - Mice → Subcategory 409 (not 404)
   - Printers → Subcategory 405

2. **Better User Experience**
   - Products appear in correct subcategory filters
   - Search results are more relevant

3. **Scalability**
   - Easy to add new keywords per subcategory
   - Clear separation of concerns

## 📝 Implementation Priority

**PHASE 1 (High Priority):**
1. Category 4 - Computers ✅ DONE
2. Category 1 - Automotive (many subcategories)
3. Category 14 - Beauty (popular category)

**PHASE 2 (Medium Priority):**
4. Category 5 - Appliances
5. Category 15 - Baby & Kids
6. Category 3 - Mobiles

**PHASE 3 (Lower Priority):**
7-15. Remaining categories

## 🧪 Testing

After implementing each category:
1. Test product creation with keywords from different subcategories
2. Verify `detectSubcategory()` returns correct subcategory
3. Check confidence scores are meaningful
4. Ensure no regression in category-level matching

---
**Status:** 🟢 In Progress  
**Last Updated:** 2025-12-17  
**Completed:** 1/15 categories (Computer - Category 4)
