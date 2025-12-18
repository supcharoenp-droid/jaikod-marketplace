# ✅ Navigation Bar - i18n Added!

## 🐛 **Missing Translation:**
```
ลงขายสินค้า

1️⃣ รูปภาพ  2️⃣ รายละเอียด  3️⃣ ตรวจสอบ
```

❌ Navigation bar ไม่เปลี่ยนภาษา!

---

## ✅ **Solution:**

### **File:** `src/app/sell-simple/page.tsx`

### **1. Add LanguageContext**
```tsx
export default function SimplifiedSmartListingPage() {
    const { language } = useLanguage()
    
    // Translations
    const t = {
        pageTitle: language === 'th' ? 'ลงขายสินค้า' : 'Sell Product',
        step1: language === 'th' ? '1️⃣ รูปภาพ' : '1️⃣ Photos',
        step2: language === 'th' ? '2️⃣ รายละเอียด' : '2️⃣ Details',
        step3: language === 'th' ? '3️⃣ ตรวจสอบ' : '3️⃣ Review'
    }
```

### **2. Replace Hard-coded Text**
```tsx
// Page Title
<h1 className="...">{t.pageTitle}</h1>

// Progress Steps
<div className={...}>{t.step1}</div>
<div className={...}>{t.step2}</div>
<div className={...}>{t.step3}</div>
```

---

## 🎯 **Result:**

### **TH (ไทย):**
```
ลงขายสินค้า

1️⃣ รูปภาพ  2️⃣ รายละเอียด  3️⃣ ตรวจสอบ
```

### **EN (English):**
```
Sell Product

1️⃣ Photos  2️⃣ Details  3️⃣ Review
```

---

## 📊 **Changes:**

```diff
export default function SimplifiedSmartListingPage() {
+   const { language } = useLanguage()
+   
+   const t = {
+       pageTitle: language === 'th' ? 'ลงขายสินค้า' : 'Sell Product',
+       step1: language === 'th' ? '1️⃣ รูปภาพ' : '1️⃣ Photos',
+       step2: language === 'th' ? '2️⃣ รายละเอียด' : '2️⃣ Details',
+       step3: language === 'th' ? '3️⃣ ตรวจสอบ' : '3️⃣ Review'
+   }

    return (
        <div>
            {/* Header */}
-           <h1>ลงขายสินค้า</h1>
+           <h1>{t.pageTitle}</h1>

            {/* Progress */}
-           <div>1️⃣ รูปภาพ</div>
-           <div>2️⃣ รายละเอียด</div>
-           <div>3️⃣ ตรวจสอบ</div>
+           <div>{t.step1}</div>
+           <div>{t.step2}</div>
+           <div>{t.step3}</div>
        </div>
    )
}
```

---

## 🧪 **Testing:**

```bash
1. Refresh browser (Ctrl + F5)
2. Go to /sell-simple
3. Click "TH ไทย":
   ✓ "ลงขายสินค้า"
   ✓ "1️⃣ รูปภาพ"
   ✓ "2️⃣ รายละเอียด"
   ✓ "3️⃣ ตรวจสอบ"
4. Click "English":
   ✓ "Sell Product"
   ✓ "1️⃣ Photos"
   ✓ "2️⃣ Details"
   ✓ "3️⃣ Review"
```

---

## ✅ **Status:**

```
✅ Import LanguageContext
✅ Create translation object (t)
✅ Translate page title
✅ Translate step 1 (Photos)
✅ Translate step 2 (Details)
✅ Translate step 3 (Review)
✅ Support both TH and EN
```

---

**🎉 Fixed! เมนูบาร์เปลี่ยนภาษาได้แล้ว!** 🌍  
**Refresh browser และลองครับ!** 🚀
