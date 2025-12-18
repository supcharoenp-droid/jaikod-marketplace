# 🚀 Quick Start Guide - JaiKod Development
## คู่มือเริ่มต้นทำงานทุกวัน

**สำหรับ:** เปิดเครื่องใหม่ทุกวัน  
**เวลาใช้:** ~2 นาที

---

## ⚡ **ขั้นตอนเริ่มต้น (ทุกวัน)**

### **1. เปิด Terminal**
กด `Ctrl + ~` ใน VS Code หรือเปิด PowerShell

### **2. ไปที่โฟลเดอร์โปรเจค**
```bash
cd C:\xampp\htdocs\jaikod
```

### **3. รัน Development Server**
```bash
npm run dev
```

**รอ 5-10 วินาที** จนเห็นข้อความ:
```
✓ Ready in 2.5s
- Local:        http://localhost:3000
```

### **4. เปิดเว็บเบราว์เซอร์**
ไปที่: **http://localhost:3000** (หรือ Port ที่แสดง)

---

## 🎯 **เสร็จแล้ว! พร้อมทำงาน**

ตอนนี้คุณสามารถ:
- ✅ แก้ไขโค้ดใน VS Code
- ✅ ดูผลลัพธ์ทันทีในเบราว์เซอร์ (Auto Reload)
- ✅ เริ่มพัฒนาฟีเจอร์ใหม่

---

## 📝 **คำสั่งที่ใช้บ่อย**

### **Development**
```bash
# รัน Dev Server
npm run dev

# หยุด Dev Server
Ctrl + C

# Build Production (ทดสอบ)
npm run build

# รัน Production Build
npm start
```

### **Git Commands**
```bash
# ดูสถานะไฟล์ที่แก้ไข
git status

# Add ไฟล์ทั้งหมด
git add .

# Commit
git commit -m "คำอธิบายการแก้ไข"

# Push ขึ้น GitHub (Vercel จะ Deploy อัตโนมัติ)
git push origin main

# ดู History
git log --oneline -10
```

### **Useful Commands**
```bash
# ติดตั้ง Package ใหม่
npm install package-name

# ลบ node_modules (ถ้ามีปัญหา)
rm -r node_modules
npm install

# ลบ .next (ถ้า Build Error)
rm -r .next
```

---

## 🐛 **แก้ปัญหาที่พบบ่อย**

### **1. Port 3000 ถูกใช้งานอยู่**
```
⚠ Port 3000 is in use, trying 3001 instead.
```

**วิธีแก้:**
- ใช้ Port ที่แสดงแทน (เช่น 3001, 3002, 3003)
- หรือหยุด Process เก่า:
  ```bash
  netstat -ano | findstr :3000
  taskkill /PID <process_id> /F
  ```

### **2. Module Not Found Error**
```
Error: Cannot find module 'xxx'
```

**วิธีแก้:**
```bash
npm install
```

### **3. Build Error หลัง Pull Code ใหม่**
```bash
# ลบ .next และ Build ใหม่
rm -r .next
npm run dev
```

### **4. Git Push ไม่ผ่าน**
```bash
# Pull ก่อน Push
git pull origin main
git push origin main
```

---

## 📂 **โครงสร้างโปรเจค (ที่ควรรู้)**

```
jaikod/
├── src/
│   ├── app/              # หน้าเว็บทั้งหมด (แก้ที่นี่)
│   │   ├── page.tsx      # Homepage
│   │   ├── login/        # หน้า Login
│   │   ├── product/      # หน้าสินค้า
│   │   └── admin/        # Admin Panel
│   ├── components/       # React Components
│   ├── lib/              # Business Logic
│   ├── config/           # Configuration
│   └── types/            # TypeScript Types
├── public/               # Static Files (รูปภาพ)
├── .env.local           # Environment Variables (ต้องสร้างเอง!)
└── package.json         # Dependencies
```

---

## 🔗 **ลิงก์สำคัญ**

### **Development**
- **Localhost:** http://localhost:3000
- **VS Code:** เปิดโฟลเดอร์ `C:\xampp\htdocs\jaikod`

### **Production**
- **Live Site:** https://jaikod-marketplace-cef2.vercel.app
- **Vercel Dashboard:** https://vercel.com/dashboard
- **GitHub Repo:** https://github.com/supcharoenp-droid/jaikod-marketplace

### **Documentation**
- **Current Status:** `.agent/docs/current-status.md`
- **Deployment Guide:** `.agent/docs/deployment-guide.md`
- **Product Spec:** `.agent/workflows/jaikod-product-spec.md`

---

## 📋 **Checklist ก่อนเริ่มทำงาน**

- [ ] เปิด VS Code
- [ ] เปิด Terminal (`Ctrl + ~`)
- [ ] `cd C:\xampp\htdocs\jaikod`
- [ ] `npm run dev`
- [ ] เปิดเบราว์เซอร์ http://localhost:3000
- [ ] ดู Current Status (`.agent/docs/current-status.md`)
- [ ] เริ่มทำงาน! 🚀

---

## 🎯 **ขั้นตอนถัดไป (พรุ่งนี้)**

**แนะนำ: เริ่มทำ Authentication**

1. สร้าง Firebase Project
2. Setup Authentication
3. เชื่อม Login/Register
4. ทดสอบ

**ดูรายละเอียดใน:** `.agent/docs/current-status.md`

---

## 💡 **Tips**

### **เพิ่มความเร็ว:**
- ใช้ `Ctrl + P` ค้นหาไฟล์ใน VS Code
- ใช้ `Ctrl + Shift + F` ค้นหาโค้ดทั้งโปรเจค
- ใช้ `F5` Refresh เบราว์เซอร์

### **ก่อน Commit:**
```bash
# เช็คว่าแก้อะไรบ้าง
git status

# ดูความแตกต่าง
git diff

# Add เฉพาะไฟล์ที่ต้องการ
git add src/app/page.tsx
```

### **ถ้าติด Error:**
1. อ่าน Error Message ให้ดี
2. ลอง Google หา Solution
3. ลองลบ `.next` และรันใหม่
4. ถามผม! 😊

---

## 🆘 **ติดปัญหา?**

**ลำดับการแก้:**
1. อ่าน Error Message
2. ลอง Restart Dev Server (`Ctrl+C` แล้ว `npm run dev`)
3. ลบ `.next`: `rm -r .next`
4. ลบ `node_modules`: `rm -r node_modules && npm install`
5. ถามผม!

---

## 🎉 **พร้อมแล้ว!**

**ขั้นตอนสั้นๆ:**
```bash
cd C:\xampp\htdocs\jaikod
npm run dev
```

**เปิดเบราว์เซอร์:** http://localhost:3000

**เริ่มทำงาน!** 🚀

---

**Good luck! พรุ่งนี้เจอกันครับ!** 😊
