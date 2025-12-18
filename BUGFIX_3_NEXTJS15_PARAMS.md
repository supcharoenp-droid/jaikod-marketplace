# 🔧 BUGFIX 3 - Next.js 15 Params Error

## ปัญหา:
```
Error: A param property was accessed directly with `params.step`. 
`params` is a Promise and must be unwrapped with `React.use()` 
before accessing its properties.
```

**สาเหตุ:**
- Next.js 15 เปลี่ยน `params` prop เป็น `Promise`
- ไม่สามารถเข้าถึง `params.step` โดยตรงได้อีกต่อไป

---

## วิธีแก้ไข:

### ❌ แบบเก่า (Next.js 14):
```tsx
export default function Page({ params }: { params: { step: string } }) {
    const step = parseInt(params.step)  // Error in Next.js 15!
    // ...
}
```

### ✅ แบบใหม่ (Next.js 15) - วิธีที่ 1: Server Component
```tsx
export default async function Page({ params }: { params: Promise<{ step: string }> }) {
    const { step: stepParam } = await params
    const step = parseInt(stepParam)
    // ...
}
```

**ข้อจำกัด:** ไม่สามารถใช้ hooks (`useRouter`, `useAuth`, etc.) ได้

### ✅ แบบใหม่ (Next.js 15) - วิธีที่ 2: Client Component + useParams
```tsx
'use client'

import { useParams } from 'next/navigation'

export default function Page() {
    const params = useParams()
    const step = parseInt(params.step as string)
    // สามารถใช้ hooks ได้ปกติ
}
```

**ข้อดี:** ใช้ hooks ได้ทุกอัน

---

## การแก้ไขในโปรเจค:

### ไฟล์: `src/app/onboarding/[step]/page.tsx`

**Before:**
```tsx
'use client'

export default function OnboardingStepPage({ params }: { params: { step: string } }) {
    const step = parseInt(params.step)  // ❌ Error
    const router = useRouter()
    // ...
}
```

**After:**
```tsx
'use client'

import { useRouter, useParams } from 'next/navigation'

export default function OnboardingStepPage() {
    const router = useRouter()
    const params = useParams()  // ✅ ใช้ hook แทน
    const step = parseInt(params.step as string)
    const { user, storeStatus, refreshProfile } = useAuth()
    // ...
}
```

**การเปลี่ยนแปลง:**
1. ✅ เพิ่ม `useParams` import
2. ✅ ลบ `params` prop ออก
3. ✅ ใช้ `useParams()` hook แทน
4. ✅ Cast `params.step` เป็น `string`

---

## เหตุผลที่เลือกวิธีนี้:

1. **ไฟล์มี `'use client'` อยู่แล้ว** → ไม่สามารถใช้ async Server Component ได้
2. **ต้องใช้ hooks** → `useRouter()`, `useAuth()`, `useLanguage()` ทั้งหมดเป็น Client hooks
3. **`useParams()` เหมาะสมที่สุด** → ทำงานได้ทันทีใน Client Component

---

## การทดสอบ:

1. ✅ ไป `http://localhost:3000/onboarding/1`
2. ✅ ไม่มี error เรื่อง params
3. ✅ Step components แสดงได้ปกติ
4. ✅ Navigation ทำงานได้
5. ✅ Progress bar แสดงถูกต้อง

---

## 🎉 สถานะ: แก้ไขเสร็จสมบูรณ์

✅ Onboarding page ทำงานได้ปกติ
✅ รองรับ Next.js 15
✅ ใช้ hooks ได้ทุกอัน
✅ ไม่มี TypeScript errors

**หมายเหตุ:** วิธีนี้ใช้ได้กับทุก dynamic route ที่เป็น Client Component
