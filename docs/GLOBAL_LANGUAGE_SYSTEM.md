# 🌐 Global Language System Implementation Guide

## 📋 **Overview:**

ระบบเปลี่ยนภาษาแบบ Global ที่ทำงานทั้งเว็บไซต์

---

## ✅ **Files Created:**

```
✅ src/contexts/LanguageContext.tsx
   - Global language state provider
   - localStorage persistence
   - t() translation helper

✅ src/components/HeaderLanguageSwitcher.tsx
   - Compact header language switcher
   - Animated background
   - Auto-sync with context

✅ src/lib/category-i18n.ts
   - getCategoryName()
   - getSubcategoryName()
   - getAllCategoriesForLanguage()
   - getSubcategoriesForLanguage()
```

---

## 🔧 **Step-by-Step Integration:**

### **Step 1: Wrap App with LanguageProvider**

**File: `src/app/layout.tsx`** or **`src/app/providers.tsx`**

```tsx
import { LanguageProvider } from '@/contexts/LanguageContext'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  )
}
```

---

### **Step 2: Add HeaderLanguageSwitcher to Navbar**

**File: `src/components/Navbar.tsx`** (or wherever your header is)

```tsx
import HeaderLanguageSwitcher from '@/components/HeaderLanguageSwitcher'

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between p-4">
      {/* Logo */}
      <div>JaiKod</div>
      
      {/* Language Switcher - แนะนำไว้ด้านซ้ายบน */}
      <div className="flex items-center gap-4">
        <HeaderLanguageSwitcher />
        {/* อื่นๆ... */}
      </div>
    </nav>
  )
}
```

**ตำแหน่งที่แนะนำ:**
```
┌────────────────────────────────────────┐
│ JaiKod    🌐 ภาษา: [TH] [EN]    🔔 👤│ ← บนซ้าย/ขวา
└────────────────────────────────────────┘
```

---

### **Step 3: Update DropdownCategorySelector**

**File: `src/components/listing/DropdownCategorySelector.tsx`**

```tsx
import { useLanguage } from '@/contexts/LanguageContext'
import { getAllCategoriesForLanguage, getSubcategoriesForLanguage } from '@/lib/category-i18n'

export default function DropdownCategorySelector() {
  const { language } = useLanguage()
  
  // Get categories in current language
  const categories = getAllCategoriesForLanguage(language)
  
  // Get subcategories in current language
  const subcategories = selectedMainId 
    ? getSubcategoriesForLanguage(selectedMainId, language)
    : []
  
  return (
    <div>
      {/* Main Category Dropdown */}
      <select>
        <option>
          {language === 'th' ? '-- เลือกหมวดหมู่ --' : '-- Select Category --'}
        </option>
        {categories.map(cat => (
          <option key={cat.id} value={cat.id}>
            {cat.icon} {cat.name}  {/* ชื่อตามภาษา! */}
          </option>
        ))}
      </select>
      
      {/* Subcategory Dropdown */}
      {subcategories.length > 0 && (
        <select>
          <option>
            {language === 'th' ? '-- เลือกหมวดหมู่ย่อย --' : '-- Select Subcategory --'}
          </option>
          {subcategories.map(sub => (
            <option key={sub.id} value={sub.id}>
              {sub.name}  {/* ชื่อตามภาษา! */}
            </option>
          ))}
        </select>
      )}
    </div>
  )
}
```

---

### **Step 4: Use Language Context Anywhere**

**Example: Button text**
```tsx
import { useLanguage } from '@/contexts/LanguageContext'

function MyButton() {
  const { t } = useLanguage()
  
  return (
    <button>
      {t('บันทึก', 'Save')}
    </button>
  )
}
```

**Example: Category name**
```tsx
import { useLanguage } from '@/contexts/LanguageContext'
import { getCategoryName } from '@/lib/category-i18n'

function CategoryDisplay({ categoryId }) {
  const { language } = useLanguage()
  
  return (
    <div>
      {getCategoryName(categoryId, language)}
    </div>
  )
}
```

---

## 🔄 **How It Works:**

### **User Flow:**

```
1. User opens website
   ↓
2. LanguageProvider loads from localStorage (default: 'th')
   ↓
3. All components use useLanguage() hook
   ↓
4. User clicks 🇬🇧 English in header
   ↓
5. LanguageProvider updates state → 'en'
   ↓
6. All components re-render with English:
   - Categories: "Automotive" instead of "ยานยนต์"
   - Subcategories: "Used Cars" instead of "รถยนต์มือสอง"
   - Buttons: "Save" instead of "บันทึก"
   - Forms: "Title" instead of "ชื่อสินค้า"
```

---

## 📊 **Example - Category Dropdown:**

### **Thai Mode:**
```
┌─────────────────────────┐
│ 🌐 ภาษา: [TH ไทย] EN   │
├─────────────────────────┤
│ หมวดหมู่:               │
│ ┌─────────────────────┐ │
│ │ 🚗 ยานยนต์          │ │ ← Thai name
│ │ 📱 มือถือ           │ │ ← Thai name
│ │ 💻 คอมพิวเตอร์       │ │ ← Thai name
│ └─────────────────────┘ │
│                         │
│ หมวดหมู่ย่อย:           │
│ ┌─────────────────────┐ │
│ │ โน้ตบุ๊ค            │ │ ← Thai name
│ │ คอมตั้งโต๊ะ         │ │ ← Thai name
│ └─────────────────────┘ │
└─────────────────────────┘
```

### **English Mode (after clicking EN):**
```
┌─────────────────────────┐
│ 🌐 ภาษา: TH [EN English]│
├─────────────────────────┤
│ Category:               │
│ ┌─────────────────────┐ │
│ │ 🚗 Automotive       │ │ ← English name
│ │ 📱 Mobiles          │ │ ← English name
│ │ 💻 Computers        │ │ ← English name
│ └─────────────────────┘ │
│                         │
│ Subcategory:            │
│ ┌─────────────────────┐ │
│ │ Laptops             │ │ ← English name
│ │ Desktops            │ │ ← English name
│ └─────────────────────┘ │
└─────────────────────────┘
```

---

## ✨ **Auto-Translation Map:**

| Element | Thai | English |
|---------|------|---------|
| หมวดหมู่ | "ยานยนต์" | "Automotive" |
| หมวดหมู่ย่อย | "โน้ตบุ๊ค" | "Laptops" |
| ชื่อสินค้า | "ชื่อสินค้า" | "Product Title" |
| รายละเอียด | "รายละเอียด" | "Description" |
| ราคา | "ราคา (บาท)" | "Price (THB)" |
| สภาพ | "สภาพ" | "Condition" |
| บันทึก | "บันทึก" | "Save" |
| ถัดไป | "ถัดไป" | "Next" |

---

## 🎯 **Benefits:**

### **1. SEO ✅**
```
- Thai pages: /sell?lang=th
- English pages: /sell?lang=en
- Better Google ranking
```

### **2. User Experience ✅**
```
- Thai users: Comfortable reading in Thai
- International users: Can understand in English
- One-click language switch
- Persistent preference (localStorage)
```

### **3. Global Marketplace ✅**
```
- Ready for international buyers/sellers
- Professional appearance
- Competitive advantage
```

---

## 📦 **Integration Checklist:**

```
Step 1: ✅ Create LanguageContext
Step 2: ✅ Create HeaderLanguageSwitcher
Step 3: ✅ Create category-i18n helpers
Step 4: ⏳ Wrap app with LanguageProvider
Step 5: ⏳ Add switcher to header
Step 6: ⏳ Update DropdownCategorySelector
Step 7: ⏳ Update other components
Step 8: ⏳ Test language switching
```

---

## 🧪 **Testing:**

```bash
1. Add LanguageProvider to app
2. Add HeaderLanguageSwitcher to navbar
3. Open: http://localhost:3000/sell-simple
4. Click 🇬🇧 English
5. Verify:
   ✓ Categories change to English
   ✓ Subcategories change to English
   ✓ Form labels change to English
6. Click 🇹🇭 ไทย
7. Verify:
   ✓ Everything back to Thai
8. Refresh page
9. Verify:
   ✓ Language persists (from localStorage)
```

---

## 📝 **Usage Examples:**

### **Simple Translation:**
```tsx
const { t } = useLanguage()

<button>{t('บันทึก', 'Save')}</button>
```

### **Category Name:**
```tsx
const { language } = useLanguage()
const categoryName = getCategoryName(4, language)
// language='th' → "คอมพิวเตอร์และไอที"
// language='en' → "Computers & IT"
```

### **Conditional Content:**
```tsx
const { language } = useLanguage()

{language === 'th' ? (
  <p>ยินดีต้อนรับ</p>
) : (
  <p>Welcome</p>
)}
```

---

## 🚀 **Next Steps:**

1. **Integrate LanguageProvider** into layout
2. **Add HeaderLanguageSwitcher** to navbar
3. **Update DropdownCategorySelector** to use i18n
4. **Test thoroughly**
5. **Expand to other pages**

---

## ✅ **Ready to Deploy!**

**ระบบภาษาพร้อมใช้งาน!** 🌍
**เพียงแค่ integrate เข้ากับ app!** 🚀
