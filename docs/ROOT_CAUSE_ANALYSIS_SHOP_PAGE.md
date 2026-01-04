# 🔍 Root Cause Analysis - Shop Page Issue

**วันที่:** 28 ธันวาคม 2568  
**ปัญหา:** หน้า Shop Page แสดง "ไม่พบร้านค้า"  
**สถานะ:** ✅ **ระบุสาเหตุสำเร็จ** — รอแก้ไข

---

## 📌 สรุป Root Cause

### ปัญหาหลัก: **Data Inconsistency ระหว่าง Collections**

```plaintext
❌ MISMATCH FOUND:

Collection: listings/honda-jazz-15-turbo-2563-a00001
├─ seller_id: "QSNb9fGPr5dFaBUiKMBAhJT7kFs2"   ← ไม่มีใน users
├─ seller_name: "suchart chansawang"
└─ ... other fields

Collection: users/
├─ users/GCtQ3Lx5AhcMeM5jV4HP3PSRkZx2 (Active Buyer)
├─ users/gqmFOWFja3dDKw11IwOum8dnv1A2 (Hybrid User)
├─ users/wRiBf2FGyDhms62E5e7O7njuu203 (New Seller)
├─ users/KEr6EdEpF8gmsbmZ0vHihjbkZkI2 (New User)
└─ users/UeMNx72WSNSHQim5br4HvvJMK4L2 (Pro Seller)

⚠️ ไม่มี users/QSNb9fGPr5dFaBUiKMBAhJT7kFs2 ในระบบ!
```

---

## 🔎 การตรวจสอบที่ทำ

### 1. Console Logs Analysis
```
[Shop] 🔍 Fetching seller data for: QSNb9fGPr5dFaBUiKMBAhJT7kFs2
[Shop] ⚠️ Seller not found by UID, trying displayName query...
[Shop] ⚠️ Still not found, trying to find actual seller_id from listings...
[Shop] ❌ Seller not found after 3 attempts: QSNb9fGPr5dFaBUiKMBAhJT7kFs2
```

### 2. Firestore Query Results
**Users Collection (ตัวอย่าง 5 รายการ):**
- ✅ GCtQ3Lx5AhcMeM5jV4HP3PSRkZx2 - Active Buyer
- ✅ gqmFOWFja3dDKw11IwOum8dnv1A2 - Hybrid User  
- ✅ wRiBf2FGyDhms62E5e7O7njuu203 - New Seller
- ✅ KEr6EdEpF8gmsbmZ0vHihjbkZkI2 - New User
- ✅ UeMNx72WSNSHQim5br4HvvJMK4L2 - Pro Seller
- ❌ **QSNb9fGPr5dFaBUiKMBAhJT7kFs2** - **NOT FOUND**

**Listings Collection:**
- Document ID: honda-jazz-15-turbo-2563-a00001
- seller_id: `QSNb9fGPr5dFaBUiKMBAhJT7kFs2` ← ค่านี้ไม่มีใน users
- seller_name: "suchart chansawang"

### 3. Browser Live Test
**URL ที่ทดสอบ:**
```
http://localhost:3000/listing/honda-jazz-15-turbo-2563-a00001
→ Click "ดูประกาศทั้งหมด"
→ Redirect to: /shop/QSNb9fGPr5dFaBUiKMBAhJT7kFs2
→ Result: "🏪 ไม่พบร้านค้า"
```

---

## 🎯 สาเหตุที่แท้จริง (True Root Cause)

### Scenario 1: User ที่ถูกลบออกจากระบบ (Deleted User)
- User เคยสร้างประกาศ → ถูกลบบัญชี (หรือ soft delete)
- Listing ยังคงอยู่ แต่ seller_id ชี้ไปที่ user ที่ไม่มีแล้ว

### Scenario 2: การสร้าง Listing แบบ Manual/Import
- ประกาศอาจถูกสร้างโดย Admin หรือ Import จาก CSV
- seller_id ถูก hardcode หรือใช้ค่าผิด

### Scenario 3: Bug ในระบบลงประกาศ
- ตอนที่ user submit listing form, seller_id ถูกเก็บผิด
- อาจใช้ค่าอื่นแทน `auth.currentUser.uid`

---

## ✅ แนวทางแก้ไข (Solution)

### 🔧 Short-term Fix: Fallback Mechanism (ทำแล้ว ✅)
ปรับ `src/app/shop/[sellerId]/page.tsx` ให้มี 3-step fallback:
1. ลองดึงจาก `users/{sellerId}` โดยตรง
2. ถ้าไม่มี → Query by `displayName`
3. ถ้ายังไม่มี → Query จาก `listings/products` เพื่อหา `seller_id` จริง

**ปัญหา:** แม้จะมี fallback แล้ว ก็ยังไม่ช่วยอะไร เพราะ seller นี้ไม่มีใน users จริงๆ!

### 🛠️ Long-term Fix: แก้ที่ต้นทาง

#### Option A: สร้าง User Document ที่หายไป
```typescript
// สร้าง user document สำหรับ seller_id ที่หายไป
const missingUserId = "QSNb9fGPr5dFaBUiKMBAhJT7kFs2"
await setDoc(doc(db, 'users', missingUserId), {
  displayName: "suchart chansawang",
  email: "[email tạo tạm]",
  role: "seller",
  createdAt: serverTimestamp(),
  // ... other required fields
})
```

#### Option B: ใช้ Fallback User (ผู้ขายไม่ระบุตัวตน)
```typescript
// ถ้าไม่เจอ seller → ใช้ fallback generic seller
if (!userDocSnap.exists()) {
  setSellerInfo({
    displayName: "ผู้ขายไม่ระบุตัวตน",
    email: "",
    photoURL: "/default-avatar.png",
    memberSince: new Date(),
    trustScore: 0,
    // ...
  })
  setIsAnonymousSeller(true)
}
```

#### Option C: แก้ไข seller_id ใน Listings
```typescript
// อัพเดท listing ให้ใช้ seller_id ที่ถูกต้อง
// หาก "suchart chansawang" คือ user ใด → ใช้ UID ของคนนั้น
const actualUserId = "[UID ของ suchart chansawang จริง]"
await updateDoc(doc(db, 'listings', 'honda-jazz-15-turbo-2563-a00001'), {
  seller_id: actualUserId
})
```

---

## 📊 Impact Analysis

### Current Impact (ปัจจุบัน)
- ❌ ผู้ซื้อไม่สามารถดูประกาศอื่นของผู้ขายได้
- ❌ ไม่สามารถสร้างความเชื่อมั่นจากประวัติการขาย
- ❌ สูญเสีย Cross-selling opportunity
- ❌ UX ที่แย่มาก

### Affected Items
- ✅ **จำนวนประกาศที่กระทบ:** ไม่แน่ใจ - ต้องสแกนทั้ง listings collection
- ✅ **จำนวน Seller ที่กระทบ:** อย่างน้อย 1 ราย (อาจมีมากกว่า)

---

## 🔍 ขั้นตอนต่อไป (Next Steps)

### 1. ✅ **สแกนหา Orphaned Listings** (listings ที่ seller_id ไม่มีใน users)
```typescript
// Query all listings
// For each: check if users/{seller_id} exists
// If not → mark as orphaned
```

### 2. ⚠️ **ตัดสินใจ Strategy:**
- สร้าง user documents ที่หายไป?
- หรือใช้ Fallback Anonymous Seller?
- หรืออัพเดท seller_id ให้ถูกต้อง?

### 3. ✅ **แก้ไขระบบลงประกาศ** (ตรวจสอบว่า seller_id ถูกเก็บถูกต้อง)
```typescript
// ใน listing creation flow
const currentUser = auth.currentUser
if (!currentUser) throw new Error("User not authenticated")

await addDoc(collection(db, 'listings'), {
  seller_id: currentUser.uid,  // ← ต้องใช้ auth.uid เท่านั้น!
  seller_name: currentUser.displayName || "Unknown",
  // ...
})
```

---

## 📝 สรุป

**ปัญหา:** Data Inconsistency - `seller_id` ใน listings ไม่ตรงกับ document ID ใน users  
**สาเหตุ:** User ถูกลบ / Import ผิด / Bug ในระบบลงประกาศ  
**ผลกระทบ:** หน้า Shop ใช้งานไม่ได้  
**แก้ไข:**  
1. ✅ เพิ่ม Fallback mechanism (แก้แล้ว แต่ยังไม่ช่วย)
2. ⚠️ ต้องแก้ที่ข้อมูล: สร้าง user / แก้ seller_id / ใช้ Anonymous Seller
3. ⚠️ ต้องแก้ที่ต้นทาง: ตรวจสอบระบบลงประกาศใหม่

**Status:** รอการตัดสินใจจากผู้ใช้ว่าจะใช้ Strategy ใด

---

**ผู้วิเคราะห์:** AI System Analyst  
**วันที่รายงาน:** 28 ธันวาคม 2568 20:45 GMT+7
