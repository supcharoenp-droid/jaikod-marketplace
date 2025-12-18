# 🔧 Dev Login Page - คู่มือการใช้งาน

## 🎯 URL:
```
http://localhost:3000/dev-login
```

---

## 👥 Test Accounts

### 1. **Super Admin** 🛡️
```
Email: admin@jaikod.com
Password: admin123
Role: Admin
Level: Super Admin
Redirect: /admin
```
**ใช้สำหรับ:**
- ทดสอบ Admin Panel
- จัดการ Users, Products, Orders
- ดู Analytics
- System Configuration

---

### 2. **Pro Seller (Level 5)** 👑
```
Email: proseller@jaikod.com
Password: seller123
Role: Seller
Level: Level 5
Redirect: /seller
```
**ใช้สำหรับ:**
- ทดสอบ Seller Dashboard
- โพสต์สินค้า (unlocked all features)
- จัดการ Orders
- ดู Analytics
- Marketing Tools

---

### 3. **New Seller (Level 1)** 🏪
```
Email: newseller@jaikod.com
Password: seller123
Role: Seller
Level: Level 1
Redirect: /seller
```
**ใช้สำหรับ:**
- ทดสอบ Onboarding Flow
- Limited features
- Basic seller functions

---

### 4. **Active Buyer** 🛒
```
Email: buyer@jaikod.com
Password: buyer123
Role: Buyer
Level: Active
Redirect: /
```
**ใช้สำหรับ:**
- ทดสอบการซื้อสินค้า
- ดู Order History
- Wishlist
- Chat with Sellers

---

### 5. **New User** 👤
```
Email: newuser@jaikod.com
Password: user123
Role: Buyer
Level: New
Redirect: /
```
**ใช้สำหรับ:**
- ทดสอบ First-time User Experience
- Onboarding
- Tutorial

---

### 6. **Hybrid User** 📦
```
Email: hybrid@jaikod.com
Password: hybrid123
Role: Buyer + Seller
Level: Level 3
Redirect: /seller
```
**ใช้สำหรับ:**
- ทดสอบ Dual Role
- Switch between Buyer/Seller mode
- Profile management

---

## 🚀 วิธีใช้งาน:

### **Option 1: Quick Login (แนะนำ)**
1. ไปที่ `http://localhost:3000/dev-login`
2. คลิกปุ่ม **Quick Login** ของ account ที่ต้องการ
3. ระบบจะ login และ redirect อัตโนมัติ

### **Option 2: Manual Login**
1. ไปที่ `http://localhost:3000/login`
2. กรอก email และ password จากตารางด้านบน
3. คลิก "เข้าสู่ระบบ"

---

## ⚙️ Setup (ครั้งแรก):

### **ต้องสร้าง Accounts ใน Firebase Authentication ก่อน!**

#### **วิธีที่ 1: ผ่าน Firebase Console**
1. เปิด Firebase Console
2. ไปที่ **Authentication** → **Users**
3. คลิก **Add User**
4. สร้าง user ตามตารางด้านบน (ทั้ง 6 accounts)

#### **วิธีที่ 2: ผ่าน Script (แนะนำ)**

สร้างไฟล์: `scripts/create-dev-accounts.js`

```javascript
const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const accounts = [
  { email: 'admin@jaikod.com', password: 'admin123', displayName: 'Super Admin' },
  { email: 'proseller@jaikod.com', password: 'seller123', displayName: 'Pro Seller' },
  { email: 'newseller@jaikod.com', password: 'seller123', displayName: 'New Seller' },
  { email: 'buyer@jaikod.com', password: 'buyer123', displayName: 'Active Buyer' },
  { email: 'newuser@jaikod.com', password: 'user123', displayName: 'New User' },
  { email: 'hybrid@jaikod.com', password: 'hybrid123', displayName: 'Hybrid User' }
];

async function createAccounts() {
  for (const account of accounts) {
    try {
      const user = await admin.auth().createUser(account);
      console.log(`✅ Created: ${account.email} (${user.uid})`);
    } catch (error) {
      console.error(`❌ Error creating ${account.email}:`, error.message);
    }
  }
}

createAccounts().then(() => {
  console.log('\n🎉 All accounts created!');
  process.exit(0);
});
```

รัน:
```bash
node scripts/create-dev-accounts.js
```

---

## 🎨 Features:

### ✅ **Quick Login Buttons**
- คลิกเดียว login ทันที
- แสดง credentials ชัดเจน
- Loading state

### ✅ **Auto Redirect**
- Admin → `/admin`
- Seller → `/seller`
- Buyer → `/`

### ✅ **Visual Indicators**
- สีต่างกันตาม role
- Icon แสดง level
- Description ชัดเจน

### ✅ **Error Handling**
- แสดง error message
- แนะนำวิธีแก้ไข

---

## 📊 Use Cases:

### **ทดสอบ Seller Features:**
1. Login as **Pro Seller**
2. ไปที่ `/sell/smart`
3. โพสต์สินค้า
4. ตรวจสอบว่าบันทึกลง Firestore ได้

### **ทดสอบ Admin Panel:**
1. Login as **Super Admin**
2. ไปที่ `/admin`
3. ทดสอบ User Management
4. ทดสอบ Product Moderation

### **ทดสอบ Buyer Experience:**
1. Login as **Active Buyer**
2. ค้นหาสินค้า
3. Add to Cart
4. Checkout

### **ทดสอบ Onboarding:**
1. Login as **New Seller**
2. ไปที่ `/onboarding/1`
3. ทดสอบ Onboarding Flow

---

## 🔒 Security:

### ⚠️ **Production:**
- **ลบหน้านี้ออก** ก่อน deploy!
- หรือเพิ่ม authentication check
- ใช้ได้เฉพาะ development mode

### 🛡️ **Recommendation:**
```typescript
// Add to page.tsx
if (process.env.NODE_ENV === 'production') {
  return <div>404 - Page Not Found</div>
}
```

---

## 📝 สรุป:

### **URL:**
```
http://localhost:3000/dev-login
```

### **Accounts:**
- ✅ 6 test accounts
- ✅ ครบทุก role (Admin, Seller, Buyer)
- ✅ ครบทุก level (1-5, Super Admin)

### **Features:**
- ✅ Quick login (1 click)
- ✅ Auto redirect
- ✅ Visual feedback
- ✅ Error handling

---

**พร้อมใช้งานแล้ว!** 🚀

ไปที่ `http://localhost:3000/dev-login` เพื่อเริ่มทดสอบ!
