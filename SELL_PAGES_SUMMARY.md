# 📋 สรุปหน้าโพสขายสินค้า (Sell/Upload Pages)

## 📁 โครงสร้างไฟล์

### 1. **Routes (App Router)**

```
src/app/
├── sell/
│   ├── page.tsx                    ← หน้าหลักโพสขายสินค้า
│   └── smart/
│       └── page.tsx                ← หน้า Smart Listing (เก่า)
```

---

## 🎯 หน้าที่ใช้งานหลัก

### **`/sell` - หน้าโพสขายสินค้าหลัก** ✅

**ไฟล์:** `src/app/sell/page.tsx`

**Component ที่ใช้:** `SmartUploadForm`

**ฟีเจอร์:**
- ✅ **One-Page Form** - ฟอร์มเดียวครบ ไม่ต้องเปลี่ยนหน้า
- ✅ **AI Image Analysis** - วิเคราะห์รูปภาพอัตโนมัติ
- ✅ **Auto-fill** - กรอกข้อมูลอัตโนมัติจาก AI
- ✅ **Category-specific Forms** - ฟอร์มแตกต่างตามหมวดหมู่
- ✅ **Edit Mode** - แก้ไขสินค้าได้ (ใช้ query param `?edit={productId}`)
- ✅ **Draft Save** - บันทึกแบบร่าง
- ✅ **Image Upload** - อัปโหลดรูปภาพหลายรูป
- ✅ **Quality Check** - ตรวจสอบคุณภาพรูปภาพ

**URL:**
- สร้างใหม่: `/sell`
- แก้ไข: `/sell?edit={productId}`

---

### **`/sell/smart` - Smart Listing (เก่า)** ⚠️

**ไฟล์:** `src/app/sell/smart/page.tsx`

**Component ที่ใช้:** `SmartListingPage`

**สถานะ:** เก่า, อาจจะไม่ใช้แล้ว

---

## 🧩 Components หลัก

### **1. SmartUploadForm** ⭐ (ใช้งานหลัก)

**ไฟล์:** `src/components/upload/SmartUploadForm.tsx`

**ขนาด:** 293 บรรทัด

**ฟีเจอร์:**
- One-page form design
- AI image analysis integration
- Category detection
- Price suggestion
- Auto-fill description
- Edit mode support
- Draft saving
- Publishing workflow

**Sub-components ที่ใช้:**
- `OnePageListingForm` - ฟอร์มหลัก
- `AutomotiveForm` - ฟอร์มรถยนต์
- `RealEstateForm` - ฟอร์มอสังหาริมทรัพย์
- `MobileForm` - ฟอร์มมือถือ
- `GeneralSmartForm` - ฟอร์มทั่วไป

**State Management:**
```typescript
- step: 1 | 2 | 3 (ไม่ใช้แล้ว - ใช้ one-page)
- images: File[]
- previews: string[]
- imageQuality: ImageAnalysis | null
- scanResult: AIListingAnalysis | null
- formData: Record<string, any>
- publishStatus: 'idle' | 'publishing' | 'done'
```

**API Calls:**
```typescript
- analyzeImageQuality(file) → ImageAnalysis
- analyzeListingImage(file, title) → AIListingAnalysis
- createProduct(input, userId, userName, userPhoto)
- updateProduct(productId, input) → สำหรับแก้ไข
```

---

### **2. OnePageListingForm** ⭐

**ไฟล์:** `src/components/upload/forms/OnePageListingForm.tsx`

**ฟีเจอร์:**
- Single-page form
- Category selection
- Dynamic fields based on category
- Image upload
- Price input
- Description editor
- Shipping options
- Location selector
- Preview mode

---

### **3. Category-Specific Forms**

**ไฟล์:**
- `src/components/upload/forms/AutomotiveForm.tsx`
- `src/components/upload/forms/RealEstateForm.tsx`
- `src/components/upload/forms/MobileForm.tsx`
- `src/components/upload/forms/GeneralSmartForm.tsx`

**ใช้สำหรับ:** แสดงฟิลด์เฉพาะตามหมวดหมู่

---

## 🔄 Flow การทำงาน

### **สร้างสินค้าใหม่:**
```
1. User ไปที่ /sell
2. อัปโหลดรูปภาพ
3. AI วิเคราะห์รูป → auto-fill ข้อมูล
4. User แก้ไข/เพิ่มเติมข้อมูล
5. กด "Publish"
6. Redirect → /seller/products
```

### **แก้ไขสินค้า:**
```
1. User ไปที่ /sell?edit={productId}
2. โหลดข้อมูลเดิมจาก Firestore
3. แสดงในฟอร์ม
4. User แก้ไข
5. กด "Update"
6. Redirect → /product/{productId}
```

---

## 🎨 UI/UX Features

### **Loading States:**
- ✅ Loading edit data
- ✅ Publishing overlay
- ✅ Success animation

### **Error Handling:**
- ✅ Upload errors
- ✅ Validation errors
- ✅ API errors

### **AI Features:**
- ✅ Image quality check
- ✅ Category detection
- ✅ Price suggestion
- ✅ Description generation
- ✅ Tag suggestions

---

## 📊 Data Structure

### **CreateProductInput:**
```typescript
{
  title: string
  description: string
  category_id: number
  price: number
  original_price: number
  price_type: 'fixed'
  condition: string
  stock: number
  tags: string[]
  province: string
  amphoe: string
  district: string
  zipcode: string
  can_ship: boolean
  can_pickup: boolean
  shipping_fee: number
  images: File[]
}
```

---

## 🔧 Configuration Files

### **Category Forms:**
**ไฟล์:** `src/config/category-forms.ts`

**ใช้สำหรับ:** กำหนดฟิลด์ของแต่ละหมวดหมู่

### **Categories:**
**ไฟล์:** `src/constants/categories.ts`

**ใช้สำหรับ:** รายการหมวดหมู่ทั้งหมด

---

## 📝 สรุป

### **หน้าที่ใช้งานจริง:**
✅ **`/sell`** - หน้าหลักโพสขายสินค้า (One-Page Form)

### **Component หลัก:**
✅ **`SmartUploadForm`** - Component หลักที่ใช้งาน

### **ฟีเจอร์เด่น:**
- ✅ One-page form (ไม่ต้องเปลี่ยนหน้า)
- ✅ AI auto-fill
- ✅ Edit mode
- ✅ Draft save
- ✅ Image quality check

### **จำนวนหน้า:**
**2 หน้า:**
1. `/sell` - หน้าหลัก (ใช้งาน)
2. `/sell/smart` - หน้าเก่า (อาจไม่ใช้)

---

**สถานะ:** ✅ พร้อมใช้งาน

**ล่าสุด:** ใช้ One-Page Form แทน Multi-Step Form
