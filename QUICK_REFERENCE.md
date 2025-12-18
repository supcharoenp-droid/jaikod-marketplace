# 🚀 Quick Reference: Intelligent Image Intake AI

## Single-Page Cheat Sheet

### ⚡ Quick Start

```typescript
// 1. Import the service
import { processImageIntake } from '@/services/intelligentImageIntake'

// 2. Process images
const result = await processImageIntake(imageFiles)

// 3. Check status
if (result.status === 'ready_for_enhancement') {
    // ✅ Good to go!
}
```

### 📊 Key Numbers

| Metric | Value |
|--------|-------|
| Max Images | 10 |
| Min Resolution | 640x640px |
| Recommended Resolution | 1200x1200px |
| Max File Size | 10MB |
| Processing Time | 1-2 seconds |
| Blur Threshold | 30 (0-100 scale) |

### 🎯 Status Codes

```typescript
'ready_for_enhancement'  // ✅ Good quality, proceed
'needs_review'           // ⚠️ Some issues, review needed
'rejected'               // ❌ Poor quality, retry
```

### ⚠️ Warning Types

```typescript
'blur'        // Image is blurry
'lighting'    // Too dark or too bright
'resolution'  // Below minimum resolution
'duplicate'   // Duplicate image detected
'size'        // File too small
'format'      // Unsupported format
```

### 💡 Suggestion Types

```typescript
'add_more'           // Need more images
'retake'             // Retake blurry images
'reorder'            // Rearrange image order
'remove_duplicate'   // Remove duplicate images
```

### 🔧 Quick Config

```typescript
// File: src/services/intelligentImageIntake.ts
const CONFIG = {
    MAX_IMAGES: 10,
    MIN_RESOLUTION: { width: 640, height: 640 },
    BLUR_THRESHOLD: 30,        // ← Adjust blur sensitivity
    DUPLICATE_THRESHOLD: 0.90, // ← Adjust duplicate detection
}
```

### 🌐 Bilingual Messages

```typescript
// Thai
getIntakeMessage(result, 'th')
// "เพิ่มรูปได้สูงสุด 10 รูป AI จะช่วยดูแลให้เอง"

// English
getIntakeMessage(result, 'en')
// "Upload up to 10 images. AI will handle the rest"
```

### 🎨 UI Integration

```tsx
// In your component
const [isProcessing, setIsProcessing] = useState(false)
const [intakeResult, setIntakeResult] = useState<ImageIntakeResult | null>(null)

// On upload
const handleUpload = async (files: File[]) => {
    setIsProcessing(true)
    const result = await processImageIntake(files)
    setIntakeResult(result)
    setIsProcessing(false)
}

// Display feedback
{intakeResult && (
    <div className="bg-green-50 p-4 rounded-xl">
        <p>{getIntakeMessage(intakeResult, language)}</p>
        <p>Quality: {avgQuality}%</p>
    </div>
)}
```

### 📦 File Structure

```
src/
├── services/
│   └── intelligentImageIntake.ts    ← Core AI service
└── components/
    └── listing/
        └── steps/
            └── Step1ImageUpload.tsx  ← Enhanced UI
```

### 🧪 Quick Test

```bash
# 1. Navigate to /sell page
# 2. Upload images
# 3. Check for:
#    - Instant preview ✓
#    - AI processing indicator ✓
#    - Quality score display ✓
#    - Warnings/suggestions ✓
#    - Bilingual support ✓
```

### 📱 Supported Platforms

```
✅ Desktop (Chrome, Firefox, Safari, Edge)
✅ iOS (Safari, Chrome)
✅ Android (Chrome, Samsung Internet)
```

### 🔍 Debugging

```typescript
// Enable detailed logging
console.log('[AI Intake]', result)

// Check specific image
result.processed_images.forEach(img => {
    console.log(`Image ${img.id}:`, {
        quality: img.quality_score,
        blur: img.blur_score,
        lighting: img.lighting_quality
    })
})
```

### ⚡ Performance Tips

```typescript
// 1. Use async/await
await processImageIntake(files)

// 2. Don't block UI
setImmediate(() => processImages())

// 3. Show loading state
if (isProcessing) return <Loader />

// 4. Compress large files
if (file.size > 5MB) compressImage(file)
```

### 🎯 Quality Score Formula

```
Score = 100 
    - (resolution penalty)     // 0-30 points
    - (blur score × 0.5)       // 0-50 points
    - (lighting penalty)       // 0-30 points
    - (product detection)      // 0-40 points
    - (file size check)        // 0-20 points

Range: 0 (worst) to 100 (perfect)
```

### 🚨 Common Issues

**Issue:** Images not processing
**Fix:** Check file format is supported (JPG, PNG, WEBP, HEIC)

**Issue:** Slow processing
**Fix:** Reduce image size or count

**Issue:** False blur warnings
**Fix:** Adjust `BLUR_THRESHOLD` (increase = more permissive)

**Issue:** Wrong language
**Fix:** Pass correct language parameter ('th' | 'en')

### 📚 Related Documentation

- `INTELLIGENT_IMAGE_INTAKE.md` - Full API reference
- `INTELLIGENT_IMAGE_INTAKE_DEMO.md` - Visual examples
- `IMPLEMENTATION_SUMMARY.md` - Complete overview
- `AI_SMART_LISTING_FLOW.md` - 8-step wizard flow

### 🎓 Learn More

```typescript
// Explore the types
import type { 
    ImageIntakeResult,
    ProcessedImage,
    ImageWarning,
    ImageSuggestion 
} from '@/services/intelligentImageIntake'

// Read the implementation
// src/services/intelligentImageIntake.ts
```

### 🆘 Need Help?

1. Check console for errors
2. Review config settings
3. Test with different images
4. Verify TypeScript types
5. Check component props

---

**Quick Links:**
- Service: `src/services/intelligentImageIntake.ts`
- Component: `src/components/listing/steps/Step1ImageUpload.tsx`
- Docs: `INTELLIGENT_IMAGE_INTAKE.md`

**Status:** ✅ Production Ready
**Version:** 1.0.0
