# 🚀 Quick Start Guide - สร้าง Admin Users

## วิธีที่ 1: ใช้ Firebase Console (ง่ายที่สุด) ⭐

### ขั้นตอนที่ 1: สร้าง Authentication User
1. เปิด [Firebase Console](https://console.firebase.google.com)
2. เลือก Project ของคุณ
3. ไปที่ **Authentication** → **Users**
4. คลิก **Add User**
5. กรอกข้อมูล:
   ```
   Email: superadmin@jaikod.com
   Password: SuperAdmin123!
   ```
6. คลิก **Add User**
7. **คัดลอก User UID** (จะใช้ในขั้นตอนถัดไป)

### ขั้นตอนที่ 2: สร้าง Admin Document
1. ไปที่ **Firestore Database**
2. คลิก **Start Collection**
3. Collection ID: `admins`
4. คลิก **Next**
5. Document ID: **วาง User UID ที่คัดลอกมา**
6. เพิ่ม Fields:

| Field | Type | Value |
|-------|------|-------|
| email | string | superadmin@jaikod.com |
| displayName | string | Super Admin |
| role | string | super_admin |
| permissions | array | [] (ว่างเปล่า) |
| is_active | boolean | true |
| created_at | timestamp | (คลิก "Use server timestamp") |
| created_by | string | system |

7. คลิก **Save**

### ✅ เสร็จแล้ว! ทดสอบเข้าสู่ระบบ:
```
URL: http://localhost:3000/admin
Email: superadmin@jaikod.com
Password: SuperAdmin123!
```

---

## วิธีที่ 2: ใช้ Script (สำหรับ Developer) 💻

### ขั้นตอนที่ 1: ติดตั้ง Dependencies
```bash
cd c:/xampp/htdocs/jaikod
npm install firebase-admin --save-dev
```

### ขั้นตอนที่ 2: ดาวน์โหลด Service Account Key
1. ไปที่ Firebase Console → **Project Settings** (⚙️)
2. เลือกแท็บ **Service Accounts**
3. คลิก **Generate New Private Key**
4. บันทึกไฟล์เป็น `serviceAccountKey.json`
5. วางไฟล์ใน `c:/xampp/htdocs/jaikod/scripts/`

### ขั้นตอนที่ 3: แก้ไข Script
เปิดไฟล์ `scripts/create-admin-users.js` และแก้ไขบรรทัดที่ 9-13:

```javascript
admin.initializeApp({
  credential: admin.credential.cert(
    require('./serviceAccountKey.json')  // ← ชี้ไปที่ไฟล์ที่ดาวน์โหลด
  )
});
```

### ขั้นตอนที่ 4: รัน Script
```bash
node scripts/create-admin-users.js
```

### ผลลัพธ์:
```
🚀 Starting Admin User Creation...
============================================================

🔄 Creating super_admin...
✅ Auth User Created: abc123xyz
✅ Firestore Document Created
📧 Email: superadmin@jaikod.com
🔑 Password: SuperAdmin123!@#
👤 Role: super_admin
✨ Status: Active

... (สร้าง Admin อีก 6 คน)

============================================================
📊 SUMMARY

✅ Successful: 7/7
❌ Failed: 0/7

🎉 Admin creation process completed!
============================================================
```

---

## 📋 Admin Accounts ที่สร้างโดย Script

| Role | Email | Password | Department |
|------|-------|----------|------------|
| Super Admin | superadmin@jaikod.com | SuperAdmin123!@# | Executive |
| Admin Manager | manager@jaikod.com | Manager123!@# | Management |
| Operations Admin | operations@jaikod.com | Operations123!@# | Operations |
| Finance Admin | finance@jaikod.com | Finance123!@# | Finance |
| Content Moderator | moderator@jaikod.com | Moderator123!@# | Content |
| Data Analyst | analyst@jaikod.com | Analyst123!@# | Analytics |
| Customer Support | support@jaikod.com | Support123!@# | Support |

---

## 🔧 การใช้งาน Script Functions

### สร้าง Admin เพิ่ม (1 คน)
```javascript
const { createAdmin } = require('./scripts/create-admin-users');

createAdmin({
  email: 'newadmin@jaikod.com',
  password: 'NewAdmin123!',
  displayName: 'New Admin',
  role: 'operations_admin',
  department: 'Operations'
});
```

### เปลี่ยน Role
```javascript
const { updateAdminRole } = require('./scripts/create-admin-users');

updateAdminRole('support@jaikod.com', 'operations_admin');
```

### ระงับ Admin
```javascript
const { deactivateAdmin } = require('./scripts/create-admin-users');

deactivateAdmin('support@jaikod.com');
```

### เปิดใช้งาน Admin อีกครั้ง
```javascript
const { reactivateAdmin } = require('./scripts/create-admin-users');

reactivateAdmin('support@jaikod.com');
```

### ดูรายชื่อ Admin ทั้งหมด
```javascript
const { listAllAdmins } = require('./scripts/create-admin-users');

listAllAdmins();
```

---

## ⚠️ Security Best Practices

### 1. เปลี่ยนรหัสผ่านทันทีหลังสร้าง
```
1. Login ด้วย Admin account
2. ไปที่ Profile Settings
3. เปลี่ยนรหัสผ่านเป็นรหัสที่ปลอดภัยกว่า
```

### 2. ใช้รหัสผ่านที่แข็งแรง
- ความยาวอย่างน้อย 12 ตัวอักษร
- มีตัวพิมพ์ใหญ่ + พิมพ์เล็ก
- มีตัวเลข
- มีอักขระพิเศษ (!@#$%^&*)

### 3. เก็บ Service Account Key ให้ปลอดภัย
```bash
# เพิ่มใน .gitignore
echo "serviceAccountKey.json" >> .gitignore
```

### 4. ลบ Script หลังใช้งาน (Production)
```bash
rm scripts/create-admin-users.js
rm scripts/serviceAccountKey.json
```

---

## 🐛 Troubleshooting

### ❌ Error: "Email already exists"
**วิธีแก้:**
1. ลบ User เดิมใน Firebase Authentication
2. ลบ Document เดิมใน Firestore > admins
3. สร้างใหม่

### ❌ Error: "Permission denied"
**วิธีแก้:**
1. ตรวจสอบ Firestore Rules
2. เพิ่ม Rule สำหรับ admins collection:
```javascript
match /admins/{adminId} {
  allow read, write: if request.auth != null;
}
```

### ❌ Login แล้วไม่เข้า Admin Panel
**วิธีแก้:**
1. ตรวจสอบว่า Document ใน `admins` collection มี `is_active: true`
2. ตรวจสอบว่า `role` ถูกต้อง
3. Clear Browser Cache และ Login ใหม่

---

## 📞 ต้องการความช่วยเหลือ?

- 📧 Email: dev@jaikod.com
- 📚 Documentation: `/docs/admin_user_manual.md`
- 🐛 Report Bug: GitHub Issues

---

**อัปเดตล่าสุด:** 7 ธันวาคม 2024
