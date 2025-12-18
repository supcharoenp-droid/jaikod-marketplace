# 📝 Add Crop Feature to PhotoEditor

## 🎯 **Requirement:**
เพิ่มฟังก์ชันตัดรูป (Crop) ในตัว Photo Editor

---

## 📦 **Library Recommendation:**

### **Option 1: react-image-crop (Recommended)**
```bash
npm install react-image-crop
```

**Pros:**
- ✅ ง่าย รวดเร็ว
- ✅ ขนาดเล็ก (~ 10KB)
- ✅ รองรับ aspect ratio
- ✅ Responsive
- ✅ Free & Open Source

**Cons:**
- ⚠️ ต้องจัดการ canvas เอง

### **Option 2: react-easy-crop**
```bash
npm install react-easy-crop
```

**Pros:**
- ✅ UI สวยงาม
- ✅ Pinch zoom support
- ✅ Smooth animations
- ✅ Mobile friendly

**Cons:**
- ⚠️ ขนาดใหญ่กว่าเล็กน้อย

---

## 🔧 **Implementation Guide:**

### **Step 1: Install Library**
```bash
npm install react-image-crop
```

### **Step 2: Import in PhotoEditor.tsx**
```tsx
import ReactCrop, { Crop } from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'
```

### **Step 3: Add Crop State**
```tsx
const [crop, setCrop] = useState<Crop>({
  unit: '%',
  width: 90,
  height: 90,
  x: 5,
  y: 5
})
const [completedCrop, setCompletedCrop] = useState<Crop | null>(null)
```

### **Step 4: Add Crop Tab Button**
```tsx
<button
    onClick={() => setActiveTab('crop')}
    className={`w-full px-4 py-3 rounded-lg flex items-center gap-3 transition-colors ${
        activeTab === 'crop' 
            ? 'bg-purple-600 text-white' 
            : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
    }`}
>
    <Crop className="w-5 h-5" />
    <span className="font-medium">ตัดรูป</span>
</button>
```

### **Step 5: Add Crop Controls**
```tsx
{activeTab === 'crop' && (
    <div className="space-y-4">
        <p className="text-sm text-gray-400">
            เลือกส่วนที่ต้องการตัด
        </p>
        
        {/* Aspect Ratio Presets */}
        <div className="grid grid-cols-4 gap-2">
            <button
                onClick={() => setCropAspect('free')}
                className={`px-3 py-2 rounded text-xs ${
                    cropAspect === 'free'
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-800 text-gray-400'
                }`}
            >
                อิสระ
            </button>
            <button
                onClick={() => setCropAspect('1:1')}
                className={`px-3 py-2 rounded text-xs ${
                    cropAspect === '1:1'
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-800 text-gray-400'
                }`}
            >
                1:1
            </button>
            <button
                onClick={() => setCropAspect('4:3')}
                className={`px-3 py-2 rounded text-xs ${
                    cropAspect === '4:3'
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-800 text-gray-400'
                }`}
            >
                4:3
            </button>
            <button
                onClick={() => setCropAspect('16:9')}
                className={`px-3 py-2 rounded text-xs ${
                    cropAspect === '16:9'
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-800 text-gray-400'
                }`}
            >
                16:9
            </button>
        </div>
    </div>
)}
```

### **Step 6: Replace Image Preview with ReactCrop**
```tsx
{activeTab === 'crop' ? (
    <ReactCrop
        crop={crop}
        onChange={(c) => setCrop(c)}
        onComplete={(c) => setCompletedCrop(c)}
        aspect={
            cropAspect === '1:1' ? 1 :
            cropAspect === '4:3' ? 4/3 :
            cropAspect === '16:9' ? 16/9 :
            undefined
        }
    >
        <img
            src={photo.preview}
            alt="Preview"
            className="max-w-full h-auto"
        />
    </ReactCrop>
) : (
    <img
        src={photo.preview}
        alt="Preview"
        className="max-w-full h-auto"
        style={{
            filter: `${filters.find(f => f.id === selectedFilter)?.filter} brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`,
            transform: `rotate(${rotation}deg)`
        }}
    />
)}
```

### **Step 7: Add Crop Apply Function**
```tsx
const applyCrop = async () => {
    if (!completedCrop) return

    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')!
    const image = new Image()
    
    image.onload = () => {
        const scaleX = image.naturalWidth / image.width
        const scaleY = image.naturalHeight / image.height
        
        canvas.width = completedCrop.width
        canvas.height = completedCrop.height
        
        ctx.drawImage(
            image,
            completedCrop.x * scaleX,
            completedCrop.y * scaleY,
            completedCrop.width * scaleX,
            completedCrop.height * scaleY,
            0,
            0,
            completedCrop.width,
            completedCrop.height
        )
        
        canvas.toBlob((blob) => {
            if (blob) {
                const file = new File([blob], photo.file.name, {
                    type: 'image/jpeg'
                })
                onSave(file)
            }
        }, 'image/jpeg', 0.95)
    }
    
    image.src = photo.preview
}
```

---

## 🎨 **UI Preview:**

```
┌─────────────────────────────────┐
│ แต่งรูปภาพ                  ✕  │
├─────────────────────────────────┤
│ ┌──────────┐  ┌──────────────┐ │
│ │ ☀️ ปรับแสง│  │              │ │
│ ├──────────┤  │   [IMAGE]    │ │
│ │ 🔄 หมุน   │  │  with crop   │ │
│ ├──────────┤  │   overlay    │ │
│ │ 🪄 ฟิลเตอร์│  │              │ │
│ ├──────────┤  └──────────────┘ │
│ │✂️ ตัดรูป  │                   │
│ │ (active) │  อัตราส่วน:       │
│ ├──────────┤  [อิสระ][1:1]    │
│ │✨ ปรับอัตโน│  [4:3][16:9]     │
│ └──────────┘                   │
│         [ยกเลิก] [บันทึก]      │
└─────────────────────────────────┘
```

---

## ✅ **Features:**

```
✅ Drag to select crop area
✅ Resize crop box
✅ Aspect ratio presets (Free, 1:1, 4:3, 16:9)
✅ Visual crop overlay
✅ Apply crop to image
✅ Maintain image quality
```

---

## 🧪 **Testing:**

```bash
1. Upload photo
2. Click "Edit" button
3. Click "✂️ ตัดรูป" tab
4. Drag crop area
5. Select aspect ratio (1:1, 4:3, 16:9)
6. Click "บันทึก"
7. Verify cropped image
```

---

## 🚀 **Quick Start:**

```bash
# Install
npm install react-image-crop

# Then integrate code from steps above
```

---

**ต้องการให้ผม implement crop feature เต็มรูปแบบไหมครับ?** 🎯
