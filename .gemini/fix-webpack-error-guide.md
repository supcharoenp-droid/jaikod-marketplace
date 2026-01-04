# 🔧 แก้ Error: Webpack Call Error (ยังไม่หาย)

## ❌ Error ที่พบ

```
TypeError: Cannot read properties of undefined (reading 'call')
at options.factory (webpack.js:1:1)
at __webpack_require__ (webpack.js:1:1)
```

## 🔍 สาเหตุที่เป็นไปได้

### 1. **Webpack Cache Corruption**
- `.next` folder มี cache เก่า
- Next.js webpack ไม่ rebuild ถูกต้อง

### 2. **Dynamic Import ยังไม่ทำงาน**
- `toastService.ts` ใช้ dynamic import แล้ว
- แต่ webpack อาจยังไม่ compile ใหม่

### 3. **SSR/Client Boundary Issue**
- Component boundary ไม่ชัดเจน
- React Server Component tree corrupted

---

## ✅ วิธีแก้ไข (ลำดับ)

### 🔥 Step 1: ลบ Cache และ Rebuild (สำคัญที่สุด!)

```bash
# ลบ .next folder
Remove-Item -Path ".next" -Recurse -Force

# ลบ node_modules cache (optional)
Remove-Item -Path "node_modules\.cache" -Recurse -Force -ErrorAction SilentlyContinue

# Stop dev server (Ctrl+C)

# Start ใหม่
npm run dev
```

---

### 🛠️ Step 2: ตรวจสอบ toastService.ts

**ไฟล์:** `/src/services/toastService.ts`

**ตรวจสอบว่ามี dynamic import:**
```typescript
successWithUndo: async (...) => {
    const { showUndoToast } = await import('@/components/ui/UndoToast')
    return showUndoToast(...)
}
```

✅ ถูกต้อง - มี `async` และ `await import()`

---

### 🧩 Step 3: ตรวจสอบ UndoToast.tsx

**ไฟล์:** `/src/components/ui/UndoToast.tsx`

**ต้องมี:**
```tsx
'use client'  // ← บรรทัดแรก!

export function UndoToast(...) { ... }
export function showUndoToast(...) { ... }
```

✅ มี `'use client'` แล้ว

---

### 📦 Step 4: ตรวจสอบ ToasterProvider.tsx

**ไฟล์:** `/src/components/providers/ToasterProvider.tsx`

**ต้องมี:**
```tsx
'use client'  // ← บรรทัดแรก!

export default function ToasterProvider() { ... }
```

✅ มี `'use client'` แล้ว

---

### 🔍 Step 5: ตรวจสอบ layout.tsx

**ไฟล์:** `/src/app/layout.tsx`

**ต้อง import:**
```tsx
import ToasterProvider from '@/components/providers/ToasterProvider'

// ใน JSX:
<ToasterProvider />
```

✅ import ถูกต้องแล้ว

---

## 🎯 วิธีแก้แบบเร่งด่วน

### Option A: Hard Rebuild (แนะนำ!)

```bash
# 1. Stop server
Ctrl+C

# 2. ลบ cache ทั้งหมด
Remove-Item -Path ".next" -Recurse -Force
Remove-Item -Path ".swc" -Recurse -Force -ErrorAction SilentlyContinue

# 3. Start ใหม่
npm run dev
```

---

### Option B: ใช้ Toast แบบ Simple แทน

**ถ้า rebuild ไม่ช่วย ให้ใช้ toast ธรรมดาแทน Undo:**

```typescript
// MyListingsWidget.tsx

// แทนที่
toastService.successWithUndo(...)

// ด้วย
toastService.success('ลบประกาศสำเร็จ', { 
    duration: 5000,
    icon: '🗑️' 
})
```

**ข้อดี:**
- ไม่มี dynamic import
- ไม่มี error
- ทำงานได้เลย

**ข้อเสีย:**
- ไม่มี Undo button

---

### Option C: Simplify UndoToast

**ทำ UndoToast ให้เรียบง่ายลง:**

**ไฟล์:** `/src/components/ui/UndoToast.tsx`

```tsx
'use client'

import toast from 'react-hot-toast'

export function showUndoToast(
    message: string,
    onUndo: () => void,
    options?: { undoLabel?: string; duration?: number }
) {
    const { undoLabel = 'ย้อนกลับ', duration = 5000 } = options || {}

    return toast(
        (t) => (
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <span>🗑️ {message}</span>
                <button
                    onClick={() => {
                        onUndo()
                        toast.dismiss(t.id)
                        toast.success('กู้คืนสำเร็จ')
                    }}
                    style={{
                        padding: '6px 16px',
                        background: 'white',
                        border: '2px solid #10b981',
                        color: '#059669',
                        borderRadius: '8px',
                        fontWeight: 'bold',
                        cursor: 'pointer'
                    }}
                >
                    {undoLabel}
                </button>
            </div>
        ),
        {
            duration,
            position: 'top-right'
        }
    )
}
```

**ข้อดี:**
- เรียบง่าย ไม่ซับซ้อน
- ใช้ inline styles (ไม่ต้อง Tailwind)
- มี Undo button

---

## 📋 Checklist

### ตรวจสอบก่อนทำต่อ:

- [ ] **Stop dev server** (Ctrl+C)
- [ ] **ลบ `.next` folder** (`Remove-Item -Path ".next" -Recurse -Force`)
- [ ] **ตรวจสอบ `toastService.ts`** มี `async` และ `await import()`
- [ ] **ตรวจสอบ `UndoToast.tsx`** มี `'use client'`
- [ ] **ตรวจสอบ `ToasterProvider.tsx`** มี `'use client'`
- [ ] **Start dev server** (`npm run dev`)
- [ ] **Refresh browser** (Ctrl+Shift+R หรือ Hard refresh)
- [ ] **ทดสอบ** เข้าหน้าใดก็ได้

---

## 🐛 Debug Steps

### 1. เช็ค Console
```
// Error ควรหาย ถ้ายังมี:
[GlobalError] TypeError: Cannot read properties of undefined (reading 'call')
```

### 2. เช็ค Network Tab
- ดู module ที่โหลด
- ต้องไม่มี failed requests

### 3. เช็ค ไฟล์ถูกสร้าง
```
.next/
└── server/
    └── app/
        └── ... (ควรมีไฟล์ใหม่)
```

---

## 💡 ทำไมถึงเกิด Error

### Webpack Module Resolution:
```
1. Next.js compile toastService.ts
2. พบ import { showUndoToast }
3. พยายาม resolve module
4. เจอ Client Component (UndoToast)
5. Bundle ใน Server
6. ❌ ERROR!
```

### Dynamic Import แก้ยังไง:
```
1. Next.js compile toastService.ts
2. พบ await import(...)
3. ข้าม! (จะ import ตอน runtime)
4. User เรียก successWithUndo()
5. Runtime import UndoToast (client-side)
6. ✅ Works!
```

---

## 🚀 Next Steps

### หลัง Rebuild:

**A. ถ้า Error หาย:**
- ✅ ทดสอบ Undo Delete
- ✅ ใช้งานได้ปกติ
- 🎉 เสร็จสมบูรณ์!

**B. ถ้า Error ยังมี:**
- 🔄 ลอง Option B (Toast ธรรมดา)
- 🔄 ลอง Option C (Simplify UndoToast)
- 📧 บอกผม error log เพิ่มเติม

---

## 📝 คำสั่งลัด

### Windows PowerShell:
```powershell
# ลบ .next
Remove-Item -Path ".next" -Recurse -Force

# Start dev
npm run dev
```

### CMD:
```cmd
# ลบ .next
rmdir /s /q .next

# Start dev
npm run dev
```

---

## ⚠️ สิ่งที่ต้องทำ **ตอนนี้**

1. 🛑 **Stop dev server** (Ctrl+C)
2. 🗑️ **ลบ `.next`** folder
3. ▶️ **Start `npm run dev`** ใหม่
4. 🔄 **Hard refresh browser** (Ctrl+Shift+R)
5. 🧪 **ทดสอบ**

---

**ลองทำตามขั้นตอนแล้วแจ้งผลได้เลยครับ!** 🚀
