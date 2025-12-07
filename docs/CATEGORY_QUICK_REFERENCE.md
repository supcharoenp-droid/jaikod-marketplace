# JaiKod Category System - Quick Reference

## 📊 System Statistics

- **Total Main Categories:** 24
- **Total Sub-categories (Level 2):** ~150
- **Total Sub-sub-categories (Level 3):** ~200+
- **Total Categories:** 370+
- **Attributes Defined:** 100+
- **AI-Suggested Attributes:** 60+

---

## 🗂️ All 24 Main Categories

| # | Icon | Thai Name | English Name | Slug |
|---|------|-----------|--------------|------|
| 1 | 📱 | มือถือและแท็บเล็ต | Mobiles & Tablets | `mobiles` |
| 2 | 💻 | คอมพิวเตอร์และแล็ปท็อป | Computers & Laptops | `computers` |
| 3 | 📷 | กล้องและอุปกรณ์ถ่ายภาพ | Cameras & Photography | `cameras` |
| 4 | 👕 | แฟชั่นและเครื่องแต่งกาย | Fashion & Accessories | `fashion` |
| 5 | ⌚ | นาฬิกาและเครื่องประดับ | Watches & Jewelry | `watches-jewelry` |
| 6 | 💄 | สุขภาพและความงาม | Health & Beauty | `health-beauty` |
| 7 | 🍼 | แม่และเด็ก | Mom & Baby | `mom-baby` |
| 8 | 🏠 | ของตกแต่งบ้านและสวน | Home & Living | `home-living` |
| 9 | 🔌 | เครื่องใช้ไฟฟ้าภายในบ้าน | Home Appliances | `home-appliances` |
| 10 | 🎮 | ของเล่น เกม และงานอดิเรก | Toys, Games & Hobbies | `toys-hobbies` |
| 11 | ⚽ | กีฬาและกิจกรรมกลางแจ้ง | Sports & Outdoors | `sports` |
| 12 | 🚗 | ยานยนต์และอะไหล่ | Automotive | `automotive` |
| 13 | 🐱 | สัตว์เลี้ยง | Pet Supplies | `pets` |
| 14 | 🎨 | ของสะสมและงานศิลปะ | Collectibles & Art | `collectibles` |
| 15 | 🙏 | พระเครื่องและวัตถุมงคล | Amulets & Sacred Items | `amulets` |
| 16 | 📚 | หนังสือและความรู้ | Books & Stationery | `books` |
| 17 | 🎸 | ดนตรีและเครื่องดนตรี | Music & Instruments | `music` |
| 18 | 🎫 | ตั๋วและบัตรกำนัล | Tickets & Vouchers | `tickets` |
| 19 | 🏢 | อสังหาริมทรัพย์ | Real Estate | `real-estate` |
| 20 | 📦 | อื่นๆ | Others | `others` |
| 21 | ₿ | Cryptocurrency & NFT | Cryptocurrency & NFT | `crypto-nft` |
| 22 | ♻️ | Sustainability & Eco-Friendly | Sustainability & Eco-Friendly | `sustainability` |
| 23 | 🏡 | Work From Home | Work From Home | `work-from-home` |
| 24 | 📻 | Vintage & Retro | Vintage & Retro | `vintage-retro` |

---

## 🎯 Most Popular Categories (Expected)

Based on market trends:

1. **มือถือและแท็บเล็ต** - Highest volume
2. **แฟชั่นและเครื่องแต่งกาย** - Gen-Z favorite
3. **คอมพิวเตอร์และแล็ปท็อป** - Tech enthusiasts
4. **กล้องและอุปกรณ์ถ่ายภาพ** - Content creators
5. **ของเล่น เกม และงานอดิเรก** - Gaming community

---

## 🤖 AI-Ready Categories

Categories with most AI-suggested attributes:

1. **Smartphones** - 8 AI attributes
2. **Laptops** - 7 AI attributes
3. **Cameras** - 6 AI attributes
4. **Fashion** - 5 AI attributes
5. **Watches** - 5 AI attributes

---

## 📈 Trending Categories (2024-2025)

### 🆕 New & Hot
- **Cryptocurrency & NFT** - Crypto mining, hardware wallets
- **Work From Home** - Standing desks, ergonomic chairs
- **Sustainability** - Eco-friendly, recycled products
- **Vintage & Retro** - Nostalgia trend

### 🔥 Always Popular
- **Gaming** - Consoles, PC components, accessories
- **Smart Home** - IoT devices, security cameras
- **Electric Vehicles** - EVs, charging equipment
- **Fitness** - Home gym, fitness trackers

---

## 💡 Quick Start Examples

### Example 1: List a Smartphone
```typescript
Category Path: mobiles > smartphones > iphone
Required Attributes:
  - brand: "Apple"
  - model: "iPhone 15 Pro"
  - storage: "256GB"
  - condition: "like_new"
AI Can Fill: brand, model, storage, color, condition
User Must Fill: price, warranty, accessories
```

### Example 2: List Fashion Item
```typescript
Category Path: fashion > footwear > sneakers
Required Attributes:
  - brand: "Nike"
  - size: "US 9"
  - condition: "good"
AI Can Fill: brand, size (from image), color, condition
User Must Fill: price, original_box
```

### Example 3: List Gaming Console
```typescript
Category Path: toys-hobbies > gaming-consoles
Required Attributes:
  - platform: "PlayStation 5"
  - condition: "like_new"
AI Can Fill: platform, storage, condition
User Must Fill: price, warranty, accessories_included
```

---

## 🔧 Helper Functions Cheat Sheet

```typescript
// Get all main categories
getMainCategories()

// Get subcategories
getSubCategories('mobiles')

// Find category
findCategoryBySlug('smartphones')

// Get attributes
getAttributesForCategory('smartphones')

// Get breadcrumb
getCategoryBreadcrumb('iphone')

// Search
searchCategories('กล้อง')

// AI attributes
getAISuggestedAttributes('smartphones')

// Validate
validateProductAttributes('smartphones', data)

// Stats
getCategoryStats()
```

---

## 📁 File Locations

```
src/constants/
├── categoryHierarchy.ts          # Base + Categories 1-2
├── categoryHierarchyExtended.ts  # Categories 3-10
├── categoryHierarchyFinal.ts     # Categories 11-24
└── categorySystem.ts             # Master export

docs/
└── CATEGORY_SYSTEM.md            # Full documentation
```

---

## ✅ Implementation Checklist

- [x] Define 24 main categories
- [x] Create 3-level hierarchy
- [x] Add category-specific attributes
- [x] Mark AI-suggested attributes
- [x] Create helper functions
- [x] Write documentation
- [ ] Integrate with product listing form
- [ ] Connect to AI image recognition
- [ ] Build category selector UI
- [ ] Add search & filter
- [ ] Implement validation
- [ ] Test with real data

---

## 🎨 UI Components Needed

1. **CategorySelector** - Multi-level dropdown
2. **AttributeForm** - Dynamic form based on category
3. **CategoryBreadcrumb** - Navigation trail
4. **CategoryFilter** - Search & filter sidebar
5. **CategoryCard** - Display category with icon

---

## 📞 Next Steps

1. **Review** this category structure
2. **Test** helper functions
3. **Build** UI components
4. **Integrate** with AI
5. **Deploy** to production

---

**Created:** 2025-12-07  
**Status:** ✅ Ready for Implementation  
**Files:** 4 TypeScript files + 2 Documentation files
