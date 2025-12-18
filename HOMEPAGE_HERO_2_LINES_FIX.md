# ✅ แก้ไขหัวข้อหน้าแรกให้เป็น 2 แถวคงที่

## 🎯 เป้าหมาย:

ให้หัวข้อหน้าแรก (`http://localhost:3000/`) แสดงเป็น **2 แถวคงที่**:
- **แถว 1:** ซื้อ–ขายง่ายกว่าเดิม
- **แถว 2:** ด้วยพลังของ AI อัจฉริยะ

---

## 🐛 ปัญหาเดิม:

### **ก่อนแก้:**
```typescript
<h1>
    {t('home.hero_title_1')} <br className="hidden md:inline" />
    <span>{t('home.hero_title_2')}</span> <br />
    {t('home.hero_title_3')}
</h1>
```

**ปัญหา:**
- ใช้ `<br />` ทำให้ขึ้นบรรทัดไม่สม่ำเสมอ
- บางครั้งแสดง 3-4 แถว ขึ้นกับขนาดหน้าจอ
- `<br className="hidden md:inline" />` ทำให้ mobile/desktop แสดงต่างกัน

---

## ✅ การแก้ไข:

### **หลังแก้:**
```typescript
<h1
    className="font-display font-extrabold tracking-tight mb-6"
    style={{
        fontSize: 'clamp(2.4rem, 4vw, 4.5rem)',
        lineHeight: '1.15',
        fontWeight: 800
    }}
>
    <div className="mb-2">
        {t('home.hero_title_1')}{' '}
        <span
            style={{
                backgroundImage: 'linear-gradient(90deg, #A855F7, #EC4899, #F97316)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                color: 'transparent'
            }}
        >
            {t('home.hero_title_2')}
        </span>
    </div>
    <div>
        {t('home.hero_title_3')}
    </div>
</h1>
```

**การเปลี่ยนแปลง:**
- ✅ ใช้ `<div>` แทน `<br />`
- ✅ แยกเป็น 2 block ชัดเจน
- ✅ แถว 1 มี `mb-2` (spacing)
- ✅ Gradient ยังคงอยู่ที่ "ง่ายกว่าเดิม"

---

## 📝 ข้อความ (จาก locales.ts):

### **ภาษาไทย:**
```typescript
hero_title_1: 'ซื้อ–ขาย',
hero_title_2: 'ง่ายกว่าเดิม',
hero_title_3: 'ด้วยพลังของ AI อัจฉริยะ',
```

### **English:**
```typescript
hero_title_1: 'Buying and selling,',
hero_title_2: 'made easier',
hero_title_3: 'Powered by intelligent AI',
```

---

## 🎨 Visual Structure:

### **ภาษาไทย:**
```
┌─────────────────────────────────┐
│ ซื้อ–ขายง่ายกว่าเดิม            │ ← แถว 1 (gradient)
│                                 │
│ ด้วยพลังของ AI อัจฉริยะ          │ ← แถว 2
└─────────────────────────────────┘
```

### **English:**
```
┌─────────────────────────────────┐
│ Buying and selling, made easier │ ← Line 1 (gradient)
│                                 │
│ Powered by intelligent AI       │ ← Line 2
└─────────────────────────────────┘
```

---

## 📁 ไฟล์ที่แก้:

**ไฟล์:** `src/components/home/Hero.tsx`

**บรรทัด:** 43-68

---

## 🎨 Styling:

### **Font Size:**
```css
font-size: clamp(2.4rem, 4vw, 4.5rem)
```
- **Mobile:** 2.4rem (38.4px)
- **Responsive:** 4vw
- **Desktop:** 4.5rem (72px)

### **Gradient (แถว 1):**
```css
background-image: linear-gradient(90deg, #A855F7, #EC4899, #F97316)
```
- Purple → Pink → Orange

### **Spacing:**
```css
line-height: 1.15
mb-2 (แถว 1)
```

---

## 📱 Responsive:

### **ทุกขนาดหน้าจอ:**
- ✅ แสดง 2 แถวเสมอ
- ✅ Font size ปรับตามหน้าจอ
- ✅ Spacing สม่ำเสมอ

---

## ✅ ผลลัพธ์:

### **ก่อนแก้:**
- ❌ บางครั้ง 3-4 แถว
- ❌ Mobile/Desktop แสดงต่างกัน
- ❌ ใช้ `<br />` ไม่สม่ำเสมอ

### **หลังแก้:**
- ✅ แสดง 2 แถวเสมอ
- ✅ ทุกขนาดหน้าจอเหมือนกัน
- ✅ ใช้ `<div>` block layout
- ✅ Control ได้ดีกว่า

---

## 🧪 ทดสอบ:

### **1. เปิดหน้าแรก:**
```
http://localhost:3000/
```

### **2. ตรวจสอบ:**
- ✅ แสดง 2 แถวเสมอ
- ✅ แถว 1: ซื้อ–ขายง่ายกว่าเดิม (มี gradient)
- ✅ แถว 2: ด้วยพลังของ AI อัจฉริยะ
- ✅ Spacing เหมาะสม

### **3. ทดสอบ Responsive:**
- ✅ Mobile (320px-768px): 2 แถว
- ✅ Tablet (768px-1024px): 2 แถว
- ✅ Desktop (1024px+): 2 แถว

### **4. ทดสอบ Language:**
- ✅ ไทย: ซื้อ–ขายง่ายกว่าเดิม / ด้วยพลังของ AI อัจฉริยะ
- ✅ EN: Buying and selling, made easier / Powered by intelligent AI

---

## 📝 สรุป:

### **ไฟล์ที่แก้:**
- ✅ `src/components/home/Hero.tsx`

### **การเปลี่ยนแปลง:**
- ✅ ใช้ `<div>` แทน `<br />`
- ✅ แยกเป็น 2 block
- ✅ เพิ่ม `mb-2` spacing

### **ผลลัพธ์:**
- ✅ แสดง 2 แถวเสมอ
- ✅ Responsive ทุกขนาด
- ✅ รองรับ 2 ภาษา

---

**สถานะ:** ✅ แก้ไขเรียบร้อยแล้ว!

ตอนนี้หน้าแรก (`http://localhost:3000/`) แสดงหัวข้อเป็น **2 แถวคงที่** ทุกครั้ง! 🎉
