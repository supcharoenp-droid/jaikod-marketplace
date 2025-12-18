# 🔧 FIX: Admin Login Error

## ❌ Error
```
Firebase: Error (auth/invalid-credential)
```

## 🔍 สาเหตน:
1. ยังไม่มี admin user ใน Firebase Authentication
2. หรือ email/password ไม่ถูกต้อง

---

## ✅ วิธีแก้:

### **Option 1: สร้าง Admin User ผ่าน Firebase Console**

1. เปิด Firebase Console: https://console.firebase.google.com
2. เลือก Project: `jaikod`
3. ไปที่ **Authentication** → **Users**
4. คลิก **Add User**
5. กรอก:
   - Email: `admin@jaikod.com`
   - Password: `admin123`
6. คลิก **Add User**

7. **สร้าง Admin Document ใน Firestore:**
   - ไปที่ **Firestore Database**
   - สร้าง Collection: `admins`
   - สร้าง Document ใหม่:
     - Document ID: `{UID ของ user ที่สร้าง}`
     - Fields:
       ```
       email: "admin@jaikod.com"
       role: "super_admin"
       displayName: "Admin"
       createdAt: {timestamp}
       ```

---

### **Option 2: ใช้ Script สร้าง Admin**

สร้างไฟล์: `scripts/create-admin.js`

```javascript
const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

async function createAdmin() {
  try {
    // Create user
    const userRecord = await admin.auth().createUser({
      email: 'admin@jaikod.com',
      password: 'admin123',
      displayName: 'Admin'
    });

    console.log('✅ User created:', userRecord.uid);

    // Add to admins collection
    await admin.firestore().collection('admins').doc(userRecord.uid).set({
      email: 'admin@jaikod.com',
      role: 'super_admin',
      displayName: 'Admin',
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });

    console.log('✅ Admin document created');
    console.log('\n📧 Email: admin@jaikod.com');
    console.log('🔑 Password: admin123');
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

createAdmin();
```

รัน:
```bash
node scripts/create-admin.js
```

---

### **Option 3: ใช้ DEV BACKDOOR (ชั่วคราว)**

ใน `src/contexts/AdminContext.tsx` มี DEV BACKDOOR อยู่แล้ว (บรรทัด 63-75):

```typescript
// 🚨 DEV BACKDOOR - Remove in production
if (process.env.NODE_ENV === 'development') {
    setAdminUser({
        uid: currentUser.uid,
        email: currentUser.email || '',
        role: 'super_admin',
        displayName: currentUser.displayName || 'Dev Admin'
    })
    setIsAdmin(true)
    setLoading(false)
    return
}
```

**วิธีใช้:**
1. Login ด้วย user ธรรมดาก่อน (ไม่ต้องเป็น admin)
2. ไปที่ `/admin/login`
3. ระบบจะ treat user นั้นเป็น admin อัตโนมัติ

---

## 🧪 ทดสอบ:

1. ไปที่: `http://localhost:3000/admin/login`
2. กรอก:
   - Email: `admin@jaikod.com`
   - Password: `admin123`
3. คลิก **เข้าสู่ระบบ**

---

## ⚠️ สำคัญ:

**ก่อน Deploy Production:**
1. ลบ DEV BACKDOOR ใน `AdminContext.tsx`
2. ใช้ admin user จริง
3. เปลี่ยน password ให้ปลอดภัย

---

## 📝 Credentials (DEV):

```
Email: admin@jaikod.com
Password: admin123
```

---

**Status:** Ready to fix! 🔧
