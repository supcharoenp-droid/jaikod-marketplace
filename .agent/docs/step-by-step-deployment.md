# Step-by-Step Deployment Guide
## คู่มือ Deploy ทีละขั้นตอน (สำหรับมือใหม่)

---

## 🎯 **เลือกวิธี Deploy**

เราจะสอน 3 วิธี เรียงจากง่าย → ยาก:

1. ✅ **Vercel** - ง่ายที่สุด, แนะนำสำหรับเริ่มต้น (5 นาที)
2. ✅ **Firebase Hosting** - ถูกที่สุด (10 นาที)
3. ✅ **VPS (DigitalOcean)** - ควบคุมได้มากที่สุด (30 นาที)

---

# 🚀 **วิธีที่ 1: Deploy ด้วย Vercel (แนะนำ)**

## **ทำไมต้อง Vercel?**
- ✅ ง่ายที่สุด - ไม่ต้องตั้งค่าอะไรมาก
- ✅ ฟรี - รองรับ 100GB bandwidth/เดือน
- ✅ Auto Deploy - Push GitHub แล้ว Deploy อัตโนมัติ
- ✅ SSL ฟรี - HTTPS ให้อัตโนมัติ
- ✅ Global CDN - เร็วทั่วโลก

---

## **ขั้นตอนที่ 1: เตรียม GitHub Repository**

### **1.1 สร้าง GitHub Account (ถ้ายังไม่มี)**
1. ไปที่ https://github.com
2. คลิก "Sign up"
3. กรอกข้อมูล Email, Password
4. Verify email

### **1.2 สร้าง Repository ใหม่**
1. คลิก "+" ขวาบน → "New repository"
2. ตั้งชื่อ: `jaikod-marketplace`
3. เลือก: **Public** (ฟรี) หรือ **Private** (ถ้าไม่อยากให้คนอื่นเห็น)
4. คลิก "Create repository"

### **1.3 Push โค้ดขึ้น GitHub**

เปิด Terminal/PowerShell ในโฟลเดอร์โปรเจค:

```bash
# 1. Initialize Git (ถ้ายังไม่ได้ทำ)
git init

# 2. เพิ่มไฟล์ทั้งหมด
git add .

# 3. Commit
git commit -m "Initial commit - JaiKod Marketplace"

# 4. เชื่อมกับ GitHub (เปลี่ยน YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/jaikod-marketplace.git

# 5. Push ขึ้น GitHub
git branch -M main
git push -u origin main
```

**หมายเหตุ:** ถ้า Git ถาม Username/Password:
- Username: ชื่อ GitHub ของคุณ
- Password: ใช้ **Personal Access Token** แทน (สร้างที่ GitHub Settings → Developer settings → Personal access tokens)

---

## **ขั้นตอนที่ 2: สร้าง Vercel Account**

### **2.1 สมัคร Vercel**
1. ไปที่ https://vercel.com
2. คลิก "Sign Up"
3. เลือก "Continue with GitHub"
4. อนุญาตให้ Vercel เข้าถึง GitHub

### **2.2 Import Project**
1. คลิก "Add New..." → "Project"
2. เลือก Repository: `jaikod-marketplace`
3. คลิก "Import"

---

## **ขั้นตอนที่ 3: ตั้งค่า Environment Variables**

### **3.1 เพิ่ม Environment Variables**

ในหน้า Import Project:
1. เลื่อนลงไปหา "Environment Variables"
2. เพิ่มตัวแปรทีละตัว:

```env
# Firebase (จำเป็น)
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abcdef123456

# Google Maps (ถ้ามี - ไม่บังคับ)
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

# Payment (ถ้ามี - ไม่บังคับ)
NEXT_PUBLIC_OMISE_PUBLIC_KEY=pkey_test_XXXXXXXXXXXXXXXXXX
OMISE_SECRET_KEY=skey_test_XXXXXXXXXXXXXXXXXX

# App Settings
NEXT_PUBLIC_APP_URL=https://jaikod.vercel.app
NEXT_PUBLIC_APP_ENV=production
```

### **3.2 หา Firebase Config**

**ถ้ายังไม่มี Firebase Project:**

1. ไปที่ https://console.firebase.google.com
2. คลิก "Add project"
3. ตั้งชื่อ: `jaikod-marketplace`
4. ปิด Google Analytics (ไม่จำเป็น)
5. คลิก "Create project"

**ดึง Config:**

1. ไปที่ Project Settings (⚙️ ขวาบน)
2. เลื่อนลงหา "Your apps"
3. คลิก "Web" (</>) icon
4. ตั้งชื่อ: `JaiKod Web`
5. คลิก "Register app"
6. **คัดลอก Config** ที่แสดง:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSy...",           // ← คัดลอกมาใส่ใน Vercel
  authDomain: "...",
  projectId: "...",
  storageBucket: "...",
  messagingSenderId: "...",
  appId: "..."
};
```

---

## **ขั้นตอนที่ 4: Deploy!**

### **4.1 Deploy**
1. คลิก "Deploy" (ปุ่มสีน้ำเงิน)
2. รอ 2-3 นาที (Vercel จะ Build และ Deploy ให้)
3. เมื่อเสร็จจะเห็น "🎉 Congratulations!"

### **4.2 ดู Website**
1. คลิก "Visit" หรือ "Go to Dashboard"
2. URL จะเป็น: `https://jaikod-marketplace.vercel.app`
3. **เสร็จแล้ว!** 🎉

---

## **ขั้นตอนที่ 5: ตั้งค่า Custom Domain (ถ้ามี)**

### **5.1 เพิ่ม Domain**
1. ไปที่ Vercel Dashboard → Project → Settings → Domains
2. พิมพ์ domain ของคุณ: `jaikod.com`
3. คลิก "Add"

### **5.2 ตั้งค่า DNS**

ไปที่ผู้ให้บริการ Domain (เช่น Namecheap, GoDaddy):

**Option A: A Record (แนะนำ)**
```
Type: A
Name: @
Value: 76.76.21.21
TTL: 3600
```

**Option B: CNAME Record**
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
TTL: 3600
```

### **5.3 รอ DNS Propagate**
- รอ 5-30 นาที
- ตรวจสอบที่ https://dnschecker.org

---

## **ขั้นตอนที่ 6: Auto Deploy**

### **6.1 ตั้งค่า Auto Deploy**

**ไม่ต้องทำอะไร!** Vercel ตั้งค่าให้อัตโนมัติแล้ว

เมื่อคุณ Push โค้ดใหม่:
```bash
git add .
git commit -m "Update features"
git push
```

Vercel จะ Deploy ใหม่อัตโนมัติภายใน 2-3 นาที! 🚀

---

# 🔥 **วิธีที่ 2: Deploy ด้วย Firebase Hosting**

## **ทำไมต้อง Firebase?**
- ✅ ถูกที่สุด - Free tier ใหญ่มาก
- ✅ รวมกับ Firebase - ใช้ Firestore อยู่แล้ว
- ✅ SSL ฟรี
- ✅ Global CDN

---

## **ขั้นตอนที่ 1: ติดตั้ง Firebase CLI**

```bash
# ติดตั้ง Firebase Tools
npm install -g firebase-tools

# Login
firebase login
```

Browser จะเปิดขึ้นมา → Login ด้วย Google Account

---

## **ขั้นตอนที่ 2: Initialize Firebase Hosting**

```bash
# ในโฟลเดอร์โปรเจค
firebase init hosting
```

**คำถามที่จะถาม:**

1. **Select a default Firebase project:**
   - เลือก: `jaikod-marketplace` (ที่สร้างไว้แล้ว)
   - หรือ "Create a new project"

2. **What do you want to use as your public directory?**
   - พิมพ์: `out`

3. **Configure as a single-page app?**
   - พิมพ์: `Yes`

4. **Set up automatic builds and deploys with GitHub?**
   - พิมพ์: `No` (ทำเองก่อน)

---

## **ขั้นตอนที่ 3: แก้ไข package.json**

เพิ่ม script สำหรับ export:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "export": "next export",  // ← เพิ่มบรรทัดนี้
    "deploy": "npm run build && npm run export && firebase deploy"  // ← เพิ่มบรรทัดนี้
  }
}
```

---

## **ขั้นตอนที่ 4: แก้ไข next.config.js**

สร้างหรือแก้ไข `next.config.js`:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',  // สำคัญ! สำหรับ Static Export
  images: {
    unoptimized: true  // ปิด Image Optimization
  }
}

module.exports = nextConfig
```

---

## **ขั้นตอนที่ 5: สร้าง .env.production**

สร้างไฟล์ `.env.production`:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

---

## **ขั้นตอนที่ 6: Build & Deploy**

```bash
# Build
npm run build

# Export
npm run export

# Deploy
firebase deploy --only hosting
```

**หรือใช้คำสั่งเดียว:**
```bash
npm run deploy
```

รอ 1-2 นาที → เสร็จ! 🎉

---

## **ขั้นตอนที่ 7: ดู Website**

URL จะเป็น: `https://your-project-id.web.app`

---

## **ขั้นตอนที่ 8: Custom Domain (ถ้ามี)**

```bash
# เพิ่ม domain
firebase hosting:channel:deploy production --only hosting

# ตั้งค่า custom domain
firebase hosting:channel:deploy production --only hosting --site jaikod.com
```

หรือตั้งค่าใน Firebase Console:
1. ไปที่ Hosting → Add custom domain
2. ใส่ `jaikod.com`
3. ตั้งค่า DNS ตามที่บอก

---

# 💻 **วิธีที่ 3: Deploy บน VPS (DigitalOcean)**

## **ทำไมต้อง VPS?**
- ✅ ควบคุมได้ 100%
- ✅ ราคาคงที่ ($5-$40/เดือน)
- ✅ Scale ได้ไม่จำกัด
- ✅ รัน Background Jobs ได้

---

## **ขั้นตอนที่ 1: สร้าง Droplet**

### **1.1 สมัคร DigitalOcean**
1. ไปที่ https://www.digitalocean.com
2. Sign up (ได้ $200 credit ฟรี 60 วัน)

### **1.2 สร้าง Droplet**
1. คลิก "Create" → "Droplets"
2. เลือก:
   - **Image:** Ubuntu 22.04 LTS
   - **Plan:** Basic ($6/mo)
   - **CPU:** Regular (1GB RAM)
   - **Datacenter:** Singapore (ใกล้ไทย)
3. **Authentication:** SSH Key (แนะนำ) หรือ Password
4. คลิก "Create Droplet"

รอ 1-2 นาที → ได้ IP Address (เช่น 123.456.789.012)

---

## **ขั้นตอนที่ 2: SSH เข้า Server**

```bash
# Windows (PowerShell)
ssh root@123.456.789.012

# Mac/Linux
ssh root@123.456.789.012
```

พิมพ์ Password (ถ้าใช้ Password)

---

## **ขั้นตอนที่ 3: ติดตั้ง Node.js**

```bash
# Update system
apt update && apt upgrade -y

# Install Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs

# ตรวจสอบ
node -v  # ควรเป็น v20.x.x
npm -v   # ควรเป็น 10.x.x
```

---

## **ขั้นตอนที่ 4: ติดตั้ง PM2**

```bash
# Install PM2 (Process Manager)
npm install -g pm2

# ตรวจสอบ
pm2 -v
```

---

## **ขั้นตอนที่ 5: Clone โปรเจค**

```bash
# Install Git
apt install -y git

# Clone repository
git clone https://github.com/YOUR_USERNAME/jaikod-marketplace.git

# เข้าโฟลเดอร์
cd jaikod-marketplace
```

---

## **ขั้นตอนที่ 6: ตั้งค่า Environment Variables**

```bash
# สร้างไฟล์ .env.local
nano .env.local
```

วาง Config:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain
# ... (เหมือนตัวอย่างข้างบน)
```

กด `Ctrl+X` → `Y` → `Enter` (บันทึก)

---

## **ขั้นตอนที่ 7: Build & Start**

```bash
# Install dependencies
npm install

# Build
npm run build

# Start with PM2
pm2 start npm --name "jaikod" -- start

# บันทึก PM2 config
pm2 save

# Auto start on reboot
pm2 startup
```

---

## **ขั้นตอนที่ 8: ติดตั้ง Nginx**

```bash
# Install Nginx
apt install -y nginx

# สร้าง config
nano /etc/nginx/sites-available/jaikod
```

วาง config:
```nginx
server {
    listen 80;
    server_name jaikod.com www.jaikod.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

กด `Ctrl+X` → `Y` → `Enter`

```bash
# Enable site
ln -s /etc/nginx/sites-available/jaikod /etc/nginx/sites-enabled/

# Test config
nginx -t

# Restart Nginx
systemctl restart nginx
```

---

## **ขั้นตอนที่ 9: ติดตั้ง SSL (HTTPS)**

```bash
# Install Certbot
apt install -y certbot python3-certbot-nginx

# Get certificate
certbot --nginx -d jaikod.com -d www.jaikod.com
```

ตอบคำถาม:
1. Email: your@email.com
2. Agree to terms: Y
3. Share email: N
4. Redirect HTTP to HTTPS: 2 (Yes)

---

## **ขั้นตอนที่ 10: ตั้งค่า DNS**

ไปที่ผู้ให้บริการ Domain:

```
Type: A
Name: @
Value: 123.456.789.012  (IP ของ Droplet)
TTL: 3600

Type: A
Name: www
Value: 123.456.789.012
TTL: 3600
```

รอ 5-30 นาที → เสร็จ! 🎉

---

## **ขั้นตอนที่ 11: Update โค้ด (ในอนาคต)**

```bash
# SSH เข้า server
ssh root@123.456.789.012

# Pull code ใหม่
cd jaikod-marketplace
git pull

# Build
npm run build

# Restart
pm2 restart jaikod
```

---

# 📊 **เปรียบเทียบ 3 วิธี**

| ฟีเจอร์ | Vercel | Firebase | VPS |
|---------|--------|----------|-----|
| **ความง่าย** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐ |
| **ราคา** | $0-$20/mo | $0-$25/mo | $6-$40/mo |
| **Auto Deploy** | ✅ | ❌ | ❌ |
| **SSL** | ✅ Auto | ✅ Auto | ✅ Manual |
| **CDN** | ✅ | ✅ | ❌ |
| **Control** | ⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ |

---

# ✅ **แนะนำสำหรับคุณ**

### **ถ้าเพิ่งเริ่มต้น:**
→ ใช้ **Vercel** (5 นาที, ฟรี, ง่ายที่สุด)

### **ถ้าต้องการประหยัด:**
→ ใช้ **Firebase Hosting** (10 นาที, ฟรี, รวมกับ Firebase)

### **ถ้าต้องการควบคุมเต็มที่:**
→ ใช้ **VPS** (30 นาที, $6/mo, ควบคุมได้ 100%)

---

# 🆘 **แก้ปัญหาที่พบบ่อย**

### **1. Build Failed**
```bash
# ลบ node_modules และ install ใหม่
rm -rf node_modules
npm install
npm run build
```

### **2. Environment Variables ไม่ทำงาน**
- ตรวจสอบว่าขึ้นต้นด้วย `NEXT_PUBLIC_` (สำหรับ client-side)
- Redeploy หลังเพิ่ม env vars

### **3. Firebase Connection Error**
- ตรวจสอบ Firebase Config ใน Console
- ตรวจสอบ API Key ถูกต้อง

### **4. Domain ไม่ทำงาน**
- รอ DNS Propagate (5-30 นาที)
- ตรวจสอบที่ https://dnschecker.org

---

# 🎉 **เสร็จแล้ว!**

**คุณพร้อม Deploy แล้วครับ!**

เลือกวิธีที่เหมาะกับคุณ:
- ✅ Vercel → ง่ายที่สุด
- ✅ Firebase → ถูกที่สุด
- ✅ VPS → ควบคุมได้มากที่สุด

**ขอให้โชคดีครับ!** 🚀
