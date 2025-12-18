# 🔧 Setup Dev Accounts - คู่มือทีละขั้นตอน

## ✅ Step 1: Install firebase-admin

```bash
npm install firebase-admin --legacy-peer-deps
```

**สถานะ:** ✅ ติดตั้งเรียบร้อยแล้ว!

---

## 📥 Step 2: Download Service Account Key

### 1. **ไปที่ Firebase Console**
```
https://console.firebase.google.com
```

### 2. **เลือก Project**
- เลือก project: `jaikod`

### 3. **ไปที่ Project Settings**
- คลิกไอคอน ⚙️ (Settings) ที่มุมซ้ายบน
- เลือก **Project settings**

### 4. **ไปที่ Service Accounts**
- คลิกแท็บ **Service accounts**

### 5. **Generate New Private Key**
- คลิกปุ่ม **Generate new private key**
- ยืนยันโดยคลิก **Generate key**
- ไฟล์ JSON จะถูก download

### 6. **Rename และ Move ไฟล์**
```bash
# Rename ไฟล์ที่ download เป็น:
serviceAccountKey.json

# Move ไปที่:
C:\xampp\htdocs\jaikod\scripts\serviceAccountKey.json
```

---

## 🚀 Step 3: Run Script

```bash
node scripts/create-dev-accounts.js
```

### **ผลลัพธ์ที่คาดหวัง:**
```
✅ Firebase Admin initialized

🚀 Creating dev test accounts...

✅ Created: admin@jaikod.com
   UID: abc123...
   Display Name: Super Admin
   📄 Profile created in Firestore
   🛡️  Admin document created

✅ Created: proseller@jaikod.com
   UID: def456...
   Display Name: Pro Seller
   📄 Profile created in Firestore
   🏪 Seller profile created

... (และอื่นๆ)

🎉 Done! All dev accounts created.

📋 Summary:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Super Admin          admin@jaikod.com               admin123
Pro Seller           proseller@jaikod.com           seller123
New Seller           newseller@jaikod.com           seller123
Active Buyer         buyer@jaikod.com               buyer123
New User             newuser@jaikod.com             user123
Hybrid User          hybrid@jaikod.com              hybrid123
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✨ You can now use these accounts at:
   http://localhost:3000/dev-login
```

---

## 🧪 Step 4: ทดสอบ

### 1. **เปิดหน้า Dev Login**
```
http://localhost:3000/dev-login
```

### 2. **คลิก Quick Login**
- เลือก account ที่ต้องการทดสอบ
- คลิกปุ่ม "Quick Login"

### 3. **ตรวจสอบ**
- ✅ Login สำเร็จ
- ✅ Redirect ถูกต้อง
- ✅ แสดงข้อมูล user

---

## ⚠️ Troubleshooting

### **Error: serviceAccountKey.json not found**
```
❌ Error: serviceAccountKey.json not found!
```

**วิธีแก้:**
1. ตรวจสอบว่าไฟล์อยู่ที่: `scripts/serviceAccountKey.json`
2. ตรวจสอบชื่อไฟล์ (ต้องเป็น `serviceAccountKey.json` ตรงตัว)
3. ตรวจสอบว่าอยู่ใน folder `scripts/`

---

### **Error: Account already exists**
```
⚠️  admin@jaikod.com already exists (UID: abc123)
```

**ไม่ต้องกังวล!** 
- Script จะข้าม account ที่มีอยู่แล้ว
- ไม่มีผลกระทบ

---

### **Error: Permission denied**
```
❌ Error: Permission denied
```

**วิธีแก้:**
1. ตรวจสอบว่า Service Account Key ถูกต้อง
2. ตรวจสอบว่า Firebase project ถูกต้อง
3. ตรวจสอบ Firebase Rules

---

## 📁 โครงสร้างไฟล์:

```
jaikod/
├── scripts/
│   ├── create-dev-accounts.js       ← Script
│   └── serviceAccountKey.json       ← ต้องมีไฟล์นี้!
├── src/
│   └── app/
│       └── dev-login/
│           └── page.tsx             ← Dev Login Page
└── package.json
```

---

## 🔒 Security:

### **⚠️ สำคัญมาก!**

1. **ห้าม commit `serviceAccountKey.json`**
   ```bash
   # เพิ่มใน .gitignore
   scripts/serviceAccountKey.json
   ```

2. **ลบไฟล์หลังใช้งาน** (ถ้าไม่ต้องการเก็บ)
   ```bash
   rm scripts/serviceAccountKey.json
   ```

3. **ใช้เฉพาะ Development**
   - ไม่ควรใช้ใน Production
   - ลบ dev accounts ก่อน deploy

---

## 📝 สรุป:

### **Checklist:**
- ✅ ติดตั้ง firebase-admin
- ⬜ Download serviceAccountKey.json
- ⬜ วางไฟล์ใน scripts/
- ⬜ Run script
- ⬜ ทดสอบที่ /dev-login

### **Next Steps:**
1. Download Service Account Key
2. Run script
3. Test at `/dev-login`

---

**พร้อมแล้ว!** 🚀

ทำตาม Step 2 ต่อได้เลยครับ!
