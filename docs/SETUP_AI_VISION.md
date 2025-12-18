# 🚀 AI Vision Integration - Setup Guide

## Step 1: Install Dependencies

### วิธีแก้ Dependency Conflict:

เนื่องจากมี conflict ระหว่าง React 19 กับ @dnd-kit ให้ใช้ `--legacy-peer-deps`:

```bash
npm install @google-cloud/vision @google/generative-ai --legacy-peer-deps
```

**หรือ** ถ้ายังไม่ได้ผล:

```bash
npm install @google-cloud/vision@4.3.2 @google/generative-ai@0.21.0 --force
```

---

## Step 2: Setup Environment Variables

สร้างหรือเพิ่มใน `.env.local`:

```env
# Google Cloud Vision API
GOOGLE_CLOUD_PROJECT_ID=your-project-id
GOOGLE_APPLICATION_CREDENTIALS=./config/google-cloud-key.json

# Gemini API (FREE!)
NEXT_PUBLIC_GEMINI_API_KEY=your-gemini-api-key
```

### วิธีขอ API Keys:

#### 2.1 Gemini API Key (ฟรี!) 🎉

1. ไปที่: https://aistudio.google.com/app/apikey
2. คลิก "Get API Key"
3. คลิก "Create API Key"
4. Copy API key มาใส่ใน `.env.local`

#### 2.2 Google Cloud Vision API

**Option A: ใช้ Gemini อย่างเดียว (แนะนำ - ฟรี!)** 

ถ้าไม่ต้องการ Safe Search detection, สามารถข้าม Cloud Vision และใช้ Gemini อย่างเดียวได้

**Option B: Setup Cloud Vision (ถ้าต้องการ Safe Search)**

1. ไปที่: https://console.cloud.google.com/
2. สร้าง Project ใหม่ หรือเลือก Project ที่มีอยู่
3. Enable Vision API:
   - ไปที่ "APIs & Services" > "Library"
   - ค้นหา "Cloud Vision API"
   - คลิก "Enable"
4. สร้าง Service Account:
   - ไปที่ "IAM & Admin" > "Service Accounts"
   - คลิก "Create Service Account"
   - ตั้งชื่อ: "jaikod-vision"
   - Role: "Cloud Vision AI Service Agent"
   - คลิก "Create Key" > "JSON"
   - Save file เป็น `config/google-cloud-key.json`

---

## Step 3: Test Installation

รันคำสั่งนี้เพื่อตรวจสอบว่า install สำเร็จ:

```bash
npm list @google/generative-ai @google-cloud/vision
```

ควรเห็น:
```
├── @google/generative-ai@0.21.0
└── @google-cloud/vision@4.3.2
```

---

## Next Steps:

เมื่อ install เสร็จแล้ว:

1. ✅ สร้าง API Keys (Gemini ฟรี!)
2. ✅ เพิ่มใน `.env.local`
3. ✅ ผมจะสร้าง `AIVisionService`
4. ✅ Integrate เข้า upload flow
5. ✅ ทดสอบกับรูปจริง

---

## Alternative: Gemini-Only Approach (แนะนำ!)

ถ้าไม่ต้องการ Cloud Vision, ใช้ Gemini อย่างเดียวก็ได้:

```bash
# ติดตั้งแค่ Gemini
npm install @google/generative-ai --legacy-peer-deps
```

**ข้อดี:**
- ✅ ฟรี 100% (1,500 requests/day)
- ✅ ไม่ต้อง setup Cloud Project
- ✅ ทำได้ทุกอย่างที่ Vision API ทำได้
- ✅ แม่นยำกว่าด้วยซ้ำ (Gemini ใหม่กว่า)

**ข้อเสี่ย:**
- ❌ Rate limit ต่ำกว่า (15 req/min vs ไม่จำกัด)

---

## 🎯 Recommended Setup:

**For MVP:** ใช้ Gemini อย่างเดียว (ฟรี!)
**For Production:** Gemini + Cloud Vision (Safe Search)

---

## พร้อมแล้วให้บอกผมนะครับ! 🚀

หลังจาก install เสร็จ และได้ API key แล้ว ผมจะ:
1. สร้าง AIVisionService
2. Integrate เข้าระบบ
3. ทดสอบ
