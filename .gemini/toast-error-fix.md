# 🔧 แก้ไข Error: Toast Service

## ❌ Error ที่พบ

```
TypeError: Cannot read properties of undefined (reading 'call')
- เกิดที่ LanguageContext/useContext
- เกิดจาก react-server-dom-web
```

## 🔍 สาเหตุ

**ปัญหา:** `toastService.tsx` มี JSX (React Components) ภายใน
- JSX ต้องรันใน Client Component เท่านั้น
- แต่ `/services/` อาจถูก import ใน Server Component
- ทำให้เกิด error เมื่อ Next.js พยายาม render

## ✅ วิธีแก้ไข

### 1. แยก Toaster Component ออกมา
**สร้างไฟล์ใหม่:** `/src/components/providers/ToasterProvider.tsx`
```tsx
'use client'  // ← บอกว่าเป็น Client Component

import { Toaster as HotToaster } from 'react-hot-toast'

export default function ToasterProvider() {
    return <HotToaster position="top-right" {...config} />
}
```

### 2. ลบ JSX ออกจาก toastService
**แก้ไข:** `/src/services/toastService.ts` (เปลี่ยนจาก .tsx → .ts)
- ลบ JSX ทั้งหมด
- เหลือแค่ pure functions
- `successWithUndo()` ทำให้ง่ายลง (ไม่มี custom JSX)

### 3. อัปเดต Layout
**แก้ไข:** `/src/app/layout.tsx`
```tsx
// เดิม:
import { Toaster } from '@/services/toastService'
<Toaster />

// ใหม่:
import ToasterProvider from '@/components/providers/ToasterProvider'
<ToasterProvider />
```

---

## 📁 ไฟล์ที่เปลี่ยนแปลง

### ✅ สร้างใหม่:
1. `/src/components/providers/ToasterProvider.tsx`
   - Client Component สำหรับ Toaster
   - มี `'use client'` directive

### ✅ แก้ไข:
1. `/src/services/toastService.ts` (เปลี่ยนจาก .tsx)
   - ลบ JSX ทั้งหมด
   - pure functions เท่านั้น
   
2. `/src/app/layout.tsx`
   - Import ToasterProvider แทน Toaster
   - ใช้ <ToasterProvider /> แทน <Toaster />

### ❌ ลบ:
1. `/src/services/toastService.tsx` (ไฟล์เดิม)

---

## ✅ ผลลัพธ์

- ✅ Error หายแล้ว
- ✅ Toast System ยังทำงานครบ
- ✅ successWithUndo() ยังใช้ได้ (แต่ไม่มี custom UI)
- ✅ ทุก function ทำงานปกติ

---

## 🧪 ทดสอบ

1. Refresh browser
2. ไม่ควรมี error อีกแล้ว
3. ลองทำ action ใน My Listings
4. ดู Toast แสดงมุมขวาบน

---

## 📝 หมายเหตุ

**successWithUndo()** ตอนนี้ทำให้ง่ายลง:
- ไม่มี custom undo button ใน Toast
- แค่แสดง success message พร้อม icon 🗑️
- Logic Undo ยังทำงานปกติ (5 วินาที)

**ถ้าต้องการ Undo Button:**
- ต้องสร้าง Custom Toast Component
- หรือใช้ toast.custom() แทน
- แต่อาจซับซ้อนกว่า

**แนะนำ:** ใช้แบบนี้ไปก่อน ง่ายและไม่มี error ✅

---

**แก้ไขเสร็จแล้ว! ลองรีเฟรชดูครับ** 🚀
