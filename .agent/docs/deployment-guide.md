# JaiKod.com - Production Deployment Guide
## คู่มือการ Deploy สู่ Production

---

## 🚀 **ขั้นตอนการ Deploy**

### **Option 1: Vercel (แนะนำ - ง่ายที่สุด)**

#### **1. เตรียมโปรเจค**
```bash
# ติดตั้ง Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Initialize project
vercel
```

#### **2. ตั้งค่า Environment Variables**
ไปที่ Vercel Dashboard → Project Settings → Environment Variables

```env
# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Google Maps
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_maps_api_key

# Payment Gateway (Omise)
NEXT_PUBLIC_OMISE_PUBLIC_KEY=your_omise_public_key
OMISE_SECRET_KEY=your_omise_secret_key

# App Settings
NEXT_PUBLIC_APP_URL=https://jaikod.com
NEXT_PUBLIC_APP_ENV=production
```

#### **3. Deploy**
```bash
# Deploy to production
vercel --prod

# หรือ push to GitHub (Auto deploy)
git push origin main
```

#### **4. Custom Domain**
```bash
# เพิ่ม domain
vercel domains add jaikod.com
vercel domains add www.jaikod.com

# ตั้งค่า DNS
# A Record: @ → 76.76.21.21
# CNAME: www → cname.vercel-dns.com
```

---

### **Option 2: Firebase Hosting**

#### **1. ติดตั้ง Firebase CLI**
```bash
npm install -g firebase-tools

# Login
firebase login

# Initialize
firebase init hosting
```

#### **2. ตั้งค่า firebase.json**
```json
{
  "hosting": {
    "public": "out",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}
```

#### **3. Build & Deploy**
```bash
# Build for production
npm run build
npm run export  # สร้าง static files

# Deploy
firebase deploy --only hosting
```

---

### **Option 3: VPS (DigitalOcean, AWS, etc.)**

#### **1. Setup Server**
```bash
# SSH to server
ssh root@your-server-ip

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2
npm install -g pm2
```

#### **2. Deploy Application**
```bash
# Clone repository
git clone https://github.com/your-username/jaikod.git
cd jaikod

# Install dependencies
npm install

# Build
npm run build

# Start with PM2
pm2 start npm --name "jaikod" -- start
pm2 save
pm2 startup
```

#### **3. Setup Nginx**
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

#### **4. SSL Certificate**
```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Get certificate
sudo certbot --nginx -d jaikod.com -d www.jaikod.com
```

---

## 🔧 **Production Checklist**

### **1. Environment Variables** ✅
- [ ] Firebase credentials
- [ ] Google Maps API key
- [ ] Payment gateway keys
- [ ] App URL

### **2. Security** ✅
- [ ] Enable HTTPS
- [ ] Set up CORS
- [ ] Enable rate limiting
- [ ] Add security headers

### **3. Performance** ✅
- [ ] Enable caching
- [ ] Optimize images
- [ ] Minify CSS/JS
- [ ] Enable compression

### **4. Monitoring** ✅
- [ ] Setup error tracking (Sentry)
- [ ] Setup analytics (Google Analytics)
- [ ] Setup uptime monitoring
- [ ] Setup performance monitoring

### **5. Backup** ✅
- [ ] Database backup
- [ ] File storage backup
- [ ] Code repository backup

---

## 📊 **Feature Flags for Production**

### **ไฟล์: `src/config/production-features.ts`**

```typescript
export const PRODUCTION_CONFIG = {
    // Firebase
    firebase: {
        enabled: true,
        useRealtime: false,
        cacheEnabled: true,
        offlineMode: true
    },
    
    // Google Maps
    googleMaps: {
        enabled: true,  // เปิดเมื่อมี API Key
        showMap: true,
        showDirections: true,
        showPlaces: true
    },
    
    // Payment
    payment: {
        enabled: true,  // เปิดเมื่อพร้อม
        methods: {
            promptpay: true,
            creditCard: false,  // เปิดเมื่อผ่าน KYC
            bankTransfer: true,
            cod: true
        },
        testMode: false  // ปิด Test Mode ใน Production
    },
    
    // AI Features
    ai: {
        priceEstimator: true,
        descriptionGenerator: true,
        chatAssistant: true,
        distanceDisplay: true
    }
};
```

---

## 🔒 **Security Best Practices**

### **1. Environment Variables**
```bash
# ห้ามเก็บใน Git
echo ".env" >> .gitignore
echo ".env.local" >> .gitignore
echo ".env.production" >> .gitignore
```

### **2. API Keys**
```typescript
// ใช้ environment variables เท่านั้น
const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;

// ห้าม hardcode
// const apiKey = "AIzaSyXXXXXXXXXX"; ❌
```

### **3. CORS**
```typescript
// next.config.js
module.exports = {
    async headers() {
        return [
            {
                source: '/api/:path*',
                headers: [
                    { key: 'Access-Control-Allow-Origin', value: 'https://jaikod.com' },
                    { key: 'Access-Control-Allow-Methods', value: 'GET,POST,PUT,DELETE' }
                ]
            }
        ];
    }
};
```

---

## 📈 **Monitoring & Analytics**

### **1. Error Tracking (Sentry)**
```bash
npm install @sentry/nextjs

# Initialize
npx @sentry/wizard@latest -i nextjs
```

### **2. Analytics (Google Analytics)**
```typescript
// src/lib/analytics.ts
export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID;

export const pageview = (url: string) => {
    window.gtag('config', GA_TRACKING_ID, {
        page_path: url,
    });
};
```

### **3. Performance Monitoring**
```typescript
// Firebase Performance
import { getPerformance } from 'firebase/performance';

const perf = getPerformance(app);
```

---

## 💰 **Cost Estimation**

### **Monthly Costs (Estimated)**

| Service | Free Tier | Paid (Small) | Paid (Medium) |
|---------|-----------|--------------|---------------|
| **Vercel** | Free | $20/mo | $40/mo |
| **Firebase** | Free | $25/mo | $100/mo |
| **Google Maps** | $200 credit | $50/mo | $200/mo |
| **Payment (Omise)** | 2.9% + ฿10 | 2.9% + ฿10 | 2.65% + ฿10 |
| **Total** | ~$0 | ~$95/mo | ~$340/mo |

**หมายเหตุ:**
- Free Tier เหมาะสำหรับ MVP และ Testing
- Paid (Small) รองรับ ~1,000 users/day
- Paid (Medium) รองรับ ~10,000 users/day

---

## 🎯 **Deployment Strategy**

### **Phase 1: Soft Launch** (Week 1-2)
```
✅ Deploy to Vercel (Free)
✅ Enable Firebase (Free Tier)
❌ Google Maps (ปิดไว้)
❌ Payment (ปิดไว้)
🎯 Goal: Test with 100 beta users
```

### **Phase 2: Beta Launch** (Week 3-4)
```
✅ Enable Google Maps
✅ Enable PromptPay + Bank Transfer
❌ Credit Card (ยังไม่เปิด)
🎯 Goal: 1,000 users, 100 transactions
```

### **Phase 3: Public Launch** (Month 2)
```
✅ Enable all features
✅ Upgrade to Paid plans
✅ Enable Credit Card
🎯 Goal: 10,000 users, 1,000 transactions/month
```

---

## ✅ **Quick Deploy Commands**

### **Development**
```bash
npm run dev
```

### **Build & Test**
```bash
npm run build
npm run start
```

### **Deploy to Vercel**
```bash
vercel --prod
```

### **Deploy to Firebase**
```bash
npm run build
firebase deploy
```

---

## 📞 **Support & Resources**

- **Vercel Docs:** https://vercel.com/docs
- **Firebase Docs:** https://firebase.google.com/docs
- **Next.js Docs:** https://nextjs.org/docs
- **Omise Docs:** https://www.omise.co/docs

---

**พร้อม Deploy แล้วครับ!** 🚀

เลือก Option ที่เหมาะสมกับคุณ:
- **Vercel** → ง่ายที่สุด, แนะนำสำหรับเริ่มต้น
- **Firebase Hosting** → ถูกที่สุด, เหมาะกับ Static Site
- **VPS** → ควบคุมได้มากที่สุด, เหมาะกับ Scale ใหญ่
