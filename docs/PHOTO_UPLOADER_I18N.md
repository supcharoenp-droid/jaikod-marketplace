# ✅ PhotoUploaderAdvanced - i18n Support Added!

## 🐛 **Problem:**
```
เปลี่ยนภาษา EN แล้วหน้าจอไม่เปลี่ยนตาม ❌
ข้อความยังเป็นภาษาไทยตลอด
```

## 🔍 **Root Cause:**
```tsx
// ❌ PhotoUploaderAdvanced ยัง hard-code ภาษาไทย
<h4>อัพโหลดหรือถ่ายรูปสินค้า</h4>
<button>เลือกรูป</button>
<button>ถ่ายรูป</button>

// ❌ ไม่ใช้ LanguageContext
```

---

## ✅ **Solution:**

### **1. Import LanguageContext**
```tsx
import { useLanguage } from '@/contexts/LanguageContext'
```

### **2. Use Language Hook**
```tsx
const { language } = useLanguage()
```

### **3. Create Translation Object**
```tsx
const t = {
    maxPhotos: language === 'th' 
        ? `สูงสุด ${maxPhotos} รูปเท่านั้น` 
        : `Maximum ${maxPhotos} photos only`,
    photoCount: (count: number) => language === 'th' 
        ? `${count}/${maxPhotos} รูป` 
        : `${count}/${maxPhotos} photos`,
    compressing: language === 'th' 
        ? 'กำลังบีบอัด...' 
        : 'Compressing...',
    main: 'Main', // Same in both languages
    uploadOrTake: language === 'th' 
        ? 'อัพโหลดหรือถ่ายรูปสินค้า' 
        : 'Upload or Take Product Photos',
    cameraOrGallery: language === 'th' 
        ? `ถ่ายจากกล้อง หรือเลือกจากคลัง สูงสุด ${maxPhotos} รูป` 
        : `Take with camera or choose from gallery, max ${maxPhotos} photos`,
    choosePhoto: language === 'th' 
        ? 'เลือกรูป' 
        : 'Choose Photo',
    takePhoto: language === 'th' 
        ? 'ถ่ายรูป' 
        : 'Take Photo',
    addMore: language === 'th' 
        ? 'เพิ่ม' 
        : 'Add',
    tips: language === 'th' 
        ? '💡 รูปแรก = รูปหลัก • ถ่าย 5-10 รูป = ขายได้เร็วขึ้น ~18%' 
        : '💡 First photo = Main • Take 5-10 photos = Sell ~18% faster',
    fileInfo: language === 'th' 
        ? 'JPG, PNG, WEBP • สูงสุด 10MB/รูป • จะบีบอัดอัตโนมัติ' 
        : 'JPG, PNG, WEBP • Max 10MB/photo • Auto-compressed'
}
```

### **4. Replace Hard-coded Text**
```tsx
// ✅ Before:
<h4>อัพโหลดหรือถ่ายรูปสินค้า</h4>
<span>{photos.length}/{maxPhotos} รูป</span>
<button>เลือกรูป</button>
<button>ถ่ายรูป</button>

// ✅ After:
<h4>{t.uploadOrTake}</h4>
<span>{t.photoCount(photos.length)}</span>
<button>{t.choosePhoto}</button>
<button>{t.takePhoto}</button>
```

---

## 📊 **Changed Texts:**

### **Alert:**
- `สูงสุด ${maxPhotos} รูปเท่านั้น` → `t.maxPhotos`

### **UI Labels:**
- `{photos.length}/{maxPhotos} รูป` → `t.photoCount(photos.length)`
- `กำลังบีบอัด...` → `t.compressing`
- `Main` → `t.main`
- `เพิ่ม` → `t.addMore`

### **Empty State:**
- `อัพโหลดหรือถ่ายรูปสินค้า` → `t.uploadOrTake`
- `ถ่ายจากกล้อง หรือเลือกจากคลัง สูงสุด ${maxPhotos} รูป` → `t.cameraOrGallery`
- `เลือกรูป` → `t.choosePhoto`
- `ถ่ายรูป` → `t.takePhoto`

### **Tips & Info:**
- `💡 รูปแรก = รูปหลัก • ถ่าย 5-10 รูป = ขายได้เร็วขึ้น ~18%` → `t.tips`
- `JPG, PNG, WEBP • สูงสุด 10MB/รูป • จะบีบอัดอัตโนมัติ` → `t.fileInfo`

---

## 🎯 **Result:**

### **TH (ไทย):**
```
📸 อัพโหลดครูปสินค้า
สูงสุด 10 รูป • AI จะวิเคราะห์อัตโนมัติ

4/10 รูป
กำลังบีบอัด...

[Main]  [เพิ่ม]

💡 รูปแรก = รูปหลัก • ถ่าย 5-10 รูป = ขายได้เร็วขึ้น ~18%

อัพโหลดหรือถ่ายรูปสินค้า
ถ่ายจากกล้อง หรือเลือกจากคลัง สูงสุด 10 รูป

[เลือกรูป]  [ถ่ายรูป]

JPG, PNG, WEBP • สูงสุด 10MB/รูป • จะบีบอัดอัตโนมัติ
```

### **EN (English):**
```
📸 Upload Product Photos
Max 10 photos • AI will analyze automatically

4/10 photos
Compressing...

[Main]  [Add]

💡 First photo = Main • Take 5-10 photos = Sell ~18% faster

Upload or Take Product Photos
Take with camera or choose from gallery, max 10 photos

[Choose Photo]  [Take Photo]

JPG, PNG, WEBP • Max 10MB/photo • Auto-compressed
```

---

## 🧪 **Testing:**

```bash
1. Refresh browser (Ctrl + F5)
2. Click "TH ไทย" → ข้อความเป็นภาษาไทย ✅
3. Click "English" → ข้อความเป็นภาษาอังกฤษ ✅
4. Upload photo → ข้อความเปลี่ยนตามภาษา ✅
```

---

## ✅ **Status:**

```
✅ Import LanguageContext
✅ Create translation object (t)
✅ Replace all hard-coded text
✅ Add t to useCallback dependencies
✅ Support both TH and EN
```

---

**🎉 Fixed! ตอนนี้เปลี่ยนภาษาแล้วหน้าจอเปลี่ยนตามแล้ว!** 🌐  
**Refresh browser และลองเปลี่ยนภาษาดูครับ!** 🚀
