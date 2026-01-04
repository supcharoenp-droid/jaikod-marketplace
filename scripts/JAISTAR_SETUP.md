# 🌟 JaiStar MVP Setup Guide

## 📋 Overview

สคริปต์นี้จะสร้าง:
1. ✅ JaiStar user account (Firebase Auth)
2. ✅ Seller profile พร้อม stats และ badges
3. ✅ 3 demo listings (iPhone, MacBook, AirPods)
4. ✅ Featured seller entry

---

## 🚀 วิธีใช้งาน

### Step 1: ติดตั้ง Dependencies

```bash
npm install
```

### Step 2: ตรวจสอบ Firebase Config

ตรวจสอบว่ามี env variables ครบ:
```
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
```

### Step 3: รัน Setup Script

```bash
npm run setup:jaistar
```

หรือ

```bash
node scripts/setup-jaistar.js
```

---

## ✅ ผลลัพธ์ที่ได้

### 1. User Account
```
Email: jaistar@jaikod.com
Password: JaiStar2026!
UID: jaistar
```

### 2. Seller Profile
```firestore
sellers/jaistar {
  shop_name: "JaiStar Premium Shop"
  verified: true
  rating: 5.0
  total_sales: 1234
  badges: [...]
  featured: true
}
```

### 3. Demo Listings
```
✅ iPhone 15 Pro Max 256GB - ฿39,900
✅ MacBook Pro 16" M3 Max - ฿129,900
✅ AirPods Pro (2nd Gen) - ฿8,900
```

### 4. Featured Entry
```firestore
featured_sellers/jaistar {
  placement: "homepage_hero"
  priority: 1
  active: true
}
```

---

## 🧪 ทดสอบ

### หลังรันสคริปต์:

1. **Profile Page:**
   ```
   http://localhost:3000/profile/jaistar
   ```
   ✅ ต้องเห็น Premium UI

2. **Shop Page:**
   ```
   http://localhost:3000/shop/jaistar
   ```
   ✅ ต้องเห็น 3 products

3. **Login:**
   ```
   Email: jaistar@jaikod.com
   Password: JaiStar2026!
   ```
   ✅ Login ได้

---

## 🔧 Troubleshooting

### Error: "email-already-in-use"
**สาเหตุ:** User มีอยู่แล้ว
**แก้ไข:** สคริปต์จะข้ามขั้นตอนนี้อัตโนมัติ

### Error: "permission-denied"
**สาเหตุ:** Firebase rules ไม่อนุญาต
**แก้ไข:** เปิด test mode ใน Firestore rules ชั่วคราว

### Error: "network error"
**สาเหตุ:** ไม่มี internet
**แก้ไข:** เช็ค connection

---

## 📝 Next Steps

### หลังจาก Setup เสร็จ:

#### 1. Homepage Integration (30 นาที)
เพิ่ม Featured Seller Banner ใน homepage:

```tsx
// app/page.tsx
import FeaturedSellerBanner from '@/components/promotion/FeaturedSellerBanner'

export default function HomePage() {
  return (
    <div>
      <FeaturedSellerBanner sellerId="jaistar" />
      {/* ... */}
    </div>
  )
}
```

#### 2. Search Boost (15 นาที)
Boost JaiStar ใน search results:

```typescript
// lib/search.ts
const FEATURED_SELLERS = ['jaistar']

function boostResults(results) {
  return results.sort((a, b) => {
    const aBoost = FEATURED_SELLERS.includes(a.seller_id) ? 1000 : 0
    const bBoost = FEATURED_SELLERS.includes(b.seller_id) ? 1000 : 0
    return bBoost - aBoost
  })
}
```

#### 3. Add Real Images (15 นาที)
แทนที่ placeholder images ด้วยรูปจริง

---

## 🎯 Production Checklist

ก่อนเปิดใช้งานจริง:

- [ ] เปลี่ยนรหัสผ่าน (จาก `JaiStar2026!`)
- [ ] อัปโหลดรูป logo และ banner
- [ ] อัปโหลดรูป products จริง
- [ ] ตั้งค่า Firebase Security Rules
- [ ] ตรวจสอบ seller info (phone, email, line)
- [ ] ทดสอบ order flow
- [ ] เพิ่ม payment gateway
- [ ] เพิ่ม shipping integration

---

## 📊 Data Structure

### Firestore Collections:

```
firestore/
├── sellers/
│   └── jaistar/                    ← Seller profile
├── listings/
│   ├── jaistar-iphone15/           ← Product 1
│   ├── jaistar-macbook/            ← Product 2
│   └── jaistar-airpods/            ← Product 3
└── featured_sellers/
    └── jaistar/                    ← Featured config
```

### Firebase Auth:

```
users/
└── jaistar/
    ├── email: jaistar@jaikod.com
    ├── emailVerified: true
    └── uid: jaistar
```

---

## 🔒 Security Notes

### ⚠️ สำคัญ!

1. **Password:** `JaiStar2026!` เป็นรหัสผ่านชั่วคราว
   - เปลี่ยนทันทีหลัง setup
   - ใช้รหัสผ่านที่แข็งแรงกว่า

2. **Firebase Rules:** เปิด test mode เฉพาะ dev
   - Production ต้องมี proper security rules

3. **API Keys:** ไม่ควร commit ลง git
   - ใช้ `.env.local`
   - เพิ่ม `.env.local` ใน `.gitignore`

---

## 💡 Tips

### Development:
- ใช้ Firebase Emulator สำหรับ local testing
- ใช้ separate Firebase project สำหรับ dev/prod

### Testing:
- ทดสอบบน mobile device จริง
- ทดสอบ order flow ครบทุกขั้นตอน
- ทดสอบ payment integration

### Monitoring:
- เปิด Firebase Analytics
- ติดตาม conversion rate
- วัดผล ROI ของ promotion

---

## 📞 Support

หากมีปัญหา:
1. เช็ค console logs
2. เช็ค Firebase console
3. อ่าน error message
4. ลองรันใหม่

---

## ✨ Summary

**ใช้เวลาทั้งหมด:** ~5 นาที  
**ผลลัพธ์:** JaiStar พร้อมโปรโมท 100%

**URLs:**
- Profile: `http://localhost:3000/profile/jaistar`
- Shop: `http://localhost:3000/shop/jaistar`

**Credentials:**
- Email: `jaistar@jaikod.com`
- Password: `JaiStar2026!`

---

**🎉 Ready to promote! 🌟**
