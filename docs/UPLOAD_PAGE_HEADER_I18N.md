# ✅ Upload Page Header - i18n Added!

## 🐛 **Missing Translation:**
```
📸 อัพโหลดรูปสินค้า
สูงสุด 10 รูป • AI จะวิเคราะห์อัตโนมัติ

[ถัดไป →]
```

❌ ไม่เปลี่ยนภาษาตาม!

---

## ✅ **Solution:**

### **File:** `src/app/sell-simple/page.tsx`

### **1. Import LanguageContext**
```tsx
import { useLanguage } from '@/contexts/LanguageContext'
```

### **2. Add Translations to UploadStep**
```tsx
function UploadStep({ photos, isAnalyzing, analysisProgress, onPhotoUpload, onRemovePhoto, onNext }: any) {
    const { language } = useLanguage()
    
    const t = {
        title: language === 'th' 
            ? '📸 อัพโหลดรูปสินค้า' 
            : '📸 Upload Product Photos',
        subtitle: language === 'th' 
            ? 'สูงสุด 10 รูป • AI จะวิเคราะห์อัตโนมัติ' 
            : 'Max 10 photos • AI will analyze automatically',
        next: language === 'th' 
            ? 'ถัดไป' 
            : 'Next'
    }
    
    return (
        <motion.div>
            <div className="text-center mb-8">
                <h2>{t.title}</h2>
                <p>{t.subtitle}</p>
            </div>
            
            <PhotoUploaderAdvanced ... />
            
            {photos.length > 0 && !isAnalyzing && (
                <button onClick={onNext}>
                    {t.next} <ArrowRight />
                </button>
            )}
        </motion.div>
    )
}
```

---

## 🎯 **Result:**

### **TH (ไทย):**
```
📸 อัพโหลดรูปสินค้า
สูงสุด 10 รูป • AI จะวิเคราะห์อัตโนมัติ

[ถัดไป →]
```

### **EN (English):**
```
📸 Upload Product Photos
Max 10 photos • AI will analyze automatically

[Next →]
```

---

## 📊 **Changes:**

```diff
+ import { useLanguage } from '@/contexts/LanguageContext'

function UploadStep(...) {
+   const { language } = useLanguage()
+   
+   const t = {
+       title: language === 'th' ? '📸 อัพโหลดรูปสินค้า' : '📸 Upload Product Photos',
+       subtitle: language === 'th' ? 'สูงสุด 10 รูป • AI จะวิเคราะห์อัตโนมัติ' : 'Max 10 photos • AI will analyze automatically',
+       next: language === 'th' ? 'ถัดไป' : 'Next'
+   }

-   <h2>📸 อัพโหลดรูปสินค้า</h2>
+   <h2>{t.title}</h2>

-   <p>สูงสุด 10 รูป • AI จะวิเคราะห์อัตโนมัติ</p>
+   <p>{t.subtitle}</p>

-   ถัดไป <ArrowRight />
+   {t.next} <ArrowRight />
}
```

---

## 🧪 **Testing:**

```bash
1. Refresh browser (Ctrl + F5)
2. Go to /sell-simple
3. Click "TH ไทย":
   ✓ "📸 อัพโหลดรูปสินค้า"
   ✓ "สูงสุด 10 รูป • AI จะวิเคราะห์อัตโนมัติ"
   ✓ "ถัดไป"
4. Click "English":
   ✓ "📸 Upload Product Photos"
   ✓ "Max 10 photos • AI will analyze automatically"
   ✓ "Next"
```

---

## ✅ **Status:**

```
✅ Import LanguageContext
✅ Create translation object (t)
✅ Translate page title
✅ Translate subtitle
✅ Translate Next button
✅ Support both TH and EN
```

---

**🎉 Fixed! Header เปลี่ยนภาษาได้แล้ว!** 🌍  
**Refresh browser และลองครับ!** 🚀
