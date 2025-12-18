# 🌐 Seller Centre Bilingual System - Implementation Guide

## ✅ สร้างเสร็จแล้ว!

ระบบ Bilingual (TH/EN) สำหรับ Seller Centre ทั้งหมด!

---

## 📁 ไฟล์ที่สร้าง:

### **1. Translation Dictionary** ✅
```
src/i18n/seller-centre.json
```
- ครบทุกหน้า (Dashboard, Products, Orders, Marketing, Finance, Reports, Settings)
- รองรับ TH/EN
- Structured JSON format

### **2. Language Context** ✅
```
src/contexts/SellerLanguageContext.tsx
```
- Auto-load จาก user profile
- Fallback to EN
- Save to Firestore

### **3. Language Toggle Component** ✅
```
src/components/seller/SellerLanguageToggle.tsx
```
- Dropdown selector
- Flag icons
- Smooth animations

---

## 🚀 การใช้งาน:

### **Step 1: Wrap Seller Pages with Provider**

```typescript
// src/app/seller/layout.tsx
import { SellerLanguageProvider } from '@/contexts/SellerLanguageContext'

export default function SellerLayout({ children }: { children: React.ReactNode }) {
    return (
        <SellerLanguageProvider>
            {children}
        </SellerLanguageProvider>
    )
}
```

### **Step 2: Use in Components**

```typescript
import { useSellerLanguage } from '@/contexts/SellerLanguageContext'

export default function Dashboard() {
    const { t, tNested, language } = useSellerLanguage()

    return (
        <div>
            <h1>{t('dashboard', 'title')}</h1>
            {/* Output: "แดชบอร์ด" (TH) or "Dashboard" (EN) */}

            <p>{tNested('dashboard', 'stats', 'revenue')}</p>
            {/* Output: "รายได้" (TH) or "Revenue" (EN) */}
        </div>
    )
}
```

### **Step 3: Add Language Toggle to Settings**

```typescript
import SellerLanguageToggle from '@/components/seller/SellerLanguageToggle'

export default function Settings() {
    return (
        <div>
            <h2>Language Settings</h2>
            <SellerLanguageToggle />
        </div>
    )
}
```

---

## 📖 Translation Dictionary Structure:

```json
{
  "dashboard": {
    "th": { "title": "แดชบอร์ด", ... },
    "en": { "title": "Dashboard", ... }
  },
  "products": {
    "th": { "title": "จัดการสินค้า", ... },
    "en": { "title": "Product Management", ... }
  },
  "orders": { ... },
  "marketing": { ... },
  "finance": { ... },
  "reports": { ... },
  "settings": { ... },
  "sidebar": { ... },
  "common": { ... }
}
```

---

## 🎯 API Reference:

### **useSellerLanguage Hook:**

```typescript
const {
    language,      // Current language: 'th' | 'en'
    setLanguage,   // Change language: (lang: 'th' | 'en') => void
    t,             // Simple translation: (section, key) => string
    tNested        // Nested translation: (section, ...keys) => string
} = useSellerLanguage()
```

### **Examples:**

```typescript
// Simple
t('dashboard', 'title')
// → "แดชบอร์ด" (TH) or "Dashboard" (EN)

// Nested
tNested('dashboard', 'stats', 'revenue')
// → "รายได้" (TH) or "Revenue" (EN)

// Change language
setLanguage('th')  // Switch to Thai
setLanguage('en')  // Switch to English
```

---

## 📝 All Available Sections:

### **1. Dashboard**
```typescript
t('dashboard', 'title')
t('dashboard', 'welcome')
tNested('dashboard', 'stats', 'revenue')
tNested('dashboard', 'charts', 'sales')
tNested('dashboard', 'quickActions', 'addProduct')
```

### **2. Products**
```typescript
t('products', 'title')
t('products', 'addNew')
tNested('products', 'filters', 'all')
tNested('products', 'table', 'name')
tNested('products', 'actions', 'edit')
```

### **3. Orders**
```typescript
t('orders', 'title')
tNested('orders', 'filters', 'pending')
tNested('orders', 'status', 'completed')
tNested('orders', 'actions', 'view')
```

### **4. Marketing**
```typescript
t('marketing', 'title')
t('marketing', 'campaigns')
t('marketing', 'promotions')
```

### **5. Finance**
```typescript
t('finance', 'title')
t('finance', 'wallet')
t('finance', 'balance')
```

### **6. Reports**
```typescript
t('reports', 'title')
t('reports', 'insights')
tNested('reports', 'period', 'today')
```

### **7. Settings**
```typescript
t('settings', 'title')
t('settings', 'shopInfo')
t('settings', 'language')
```

### **8. Sidebar**
```typescript
t('sidebar', 'dashboard')
t('sidebar', 'products')
t('sidebar', 'orders')
```

### **9. Common**
```typescript
t('common', 'save')
t('common', 'cancel')
t('common', 'delete')
t('common', 'loading')
```

---

## 🎨 Example Implementation:

### **Dashboard Page:**

```typescript
'use client'

import { useSellerLanguage } from '@/contexts/SellerLanguageContext'
import { Package, ShoppingCart, DollarSign, Users } from 'lucide-react'

export default function SellerDashboard() {
    const { t, tNested } = useSellerLanguage()

    const stats = [
        {
            label: tNested('dashboard', 'stats', 'revenue'),
            value: '฿125,000',
            icon: DollarSign
        },
        {
            label: tNested('dashboard', 'stats', 'orders'),
            value: '342',
            icon: ShoppingCart
        },
        {
            label: tNested('dashboard', 'stats', 'products'),
            value: '89',
            icon: Package
        },
        {
            label: tNested('dashboard', 'stats', 'visitors'),
            value: '1,234',
            icon: Users
        }
    ]

    return (
        <div>
            <h1>{t('dashboard', 'title')}</h1>
            <p>{t('dashboard', 'welcome')}</p>

            <div className="grid grid-cols-4 gap-4">
                {stats.map((stat, i) => (
                    <div key={i} className="card">
                        <stat.icon />
                        <h3>{stat.label}</h3>
                        <p>{stat.value}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}
```

### **Products Page:**

```typescript
'use client'

import { useSellerLanguage } from '@/contexts/SellerLanguageContext'

export default function ProductsPage() {
    const { t, tNested } = useSellerLanguage()

    return (
        <div>
            <div className="header">
                <h1>{t('products', 'title')}</h1>
                <button>{t('products', 'addNew')}</button>
            </div>

            <div className="filters">
                <button>{tNested('products', 'filters', 'all')}</button>
                <button>{tNested('products', 'filters', 'active')}</button>
                <button>{tNested('products', 'filters', 'inactive')}</button>
            </div>

            <table>
                <thead>
                    <tr>
                        <th>{tNested('products', 'table', 'image')}</th>
                        <th>{tNested('products', 'table', 'name')}</th>
                        <th>{tNested('products', 'table', 'price')}</th>
                        <th>{tNested('products', 'table', 'stock')}</th>
                        <th>{tNested('products', 'table', 'actions')}</th>
                    </tr>
                </thead>
            </table>
        </div>
    )
}
```

---

## 🔧 Language Persistence:

### **Auto-load on Login:**
```typescript
// Automatically loads from user.language
// Falls back to browser language or EN
```

### **Save to Firestore:**
```typescript
// When user changes language:
setLanguage('th')
// → Saves to Firestore: users/{uid}/language = "TH"
// → Saves to localStorage: "seller-language" = "th"
```

### **Fallback Logic:**
```
1. Check user.language in Firestore
2. Check localStorage
3. Check browser language
4. Default to EN
```

---

## 📱 Responsive:

### **Language Toggle:**
- Desktop: Dropdown in header/settings
- Mobile: Full-width selector
- Flags + Language names
- Check mark for active language

---

## 🎯 Best Practices:

### **1. Always use translation keys:**
```typescript
// ✅ Good
<h1>{t('dashboard', 'title')}</h1>

// ❌ Bad
<h1>Dashboard</h1>
```

### **2. Use nested keys for organization:**
```typescript
// ✅ Good
tNested('dashboard', 'stats', 'revenue')

// ❌ Bad
t('dashboard', 'stats.revenue')
```

### **3. Provide fallbacks:**
```typescript
const title = t('dashboard', 'title') || 'Dashboard'
```

---

## 📝 สรุป:

### **ไฟล์ที่สร้าง:**
- ✅ `seller-centre.json` - Translation dictionary
- ✅ `SellerLanguageContext.tsx` - Language context
- ✅ `SellerLanguageToggle.tsx` - Toggle component

### **ฟีเจอร์:**
- ✅ TH/EN support
- ✅ Auto-load from user profile
- ✅ Fallback to EN
- ✅ Save to Firestore
- ✅ LocalStorage cache
- ✅ Real-time switching

### **Coverage:**
- ✅ Dashboard
- ✅ Products
- ✅ Orders
- ✅ Marketing
- ✅ Finance
- ✅ Reports
- ✅ Settings
- ✅ Sidebar
- ✅ Common UI

---

**พร้อมใช้งานแล้ว!** 🌐

Wrap Seller pages with `<SellerLanguageProvider>` และใช้ `useSellerLanguage()` hook!
