# Progressive Unlock System

## 🎯 Concept
ระบบ Progressive Unlock ช่วยลด **cognitive load** สำหรับมือใหม่ โดยแสดงเฉพาะฟีเจอร์ที่จำเป็น และค่อย ๆ ปลดล็อกฟีเจอร์ขั้นสูงเมื่อผู้ใช้พร้อม

## 📊 Unlock Stages

### 1. Beginner (เริ่มต้น)
**Visible Features**:
- ✅ Upload Photo
- ✅ Set Price
- ✅ Basic Description
- ✅ Post Listing

**Philosophy**: ฟีเจอร์จำเป็นเท่านั้น ไม่มีอะไรซับซ้อน

### 2. Intermediate (กลาง)
**Unlocked After**: โพสสินค้าชิ้นแรกสำเร็จ

**New Features**:
- ✨ AI Price Suggestion
- ✨ AI Description Writer
- ✨ Category Selection
- ✨ Shipping Options

**Philosophy**: เพิ่มเครื่องมือ AI ช่วยทำงาน

### 3. Advanced (ขั้นสูง)
**Unlocked After**: โพสสินค้า 5 ชิ้น หรือ ขายสำเร็จครั้งแรก

**New Features**:
- 📊 Analytics Dashboard
- 📦 Bulk Upload
- 🎯 Promotions & Discounts
- 📈 Inventory Management

**Philosophy**: เครื่องมือจัดการธุรกิจ

### 4. Expert (ผู้เชี่ยวชาญ)
**Unlocked After**: ยืนยันตัวตน หรือ ขายครบ 50 รายการ

**New Features**:
- 🔌 API Access
- 👥 Team Management
- 📊 Advanced Analytics
- 🔧 Custom Integrations

**Philosophy**: ฟีเจอร์ทั้งหมด สำหรับ power users

## 🔓 Progression Triggers

```typescript
{
  first_listing: {
    action: 'post_first_product',
    nextStage: 'intermediate',
    requirement: 'โพสสินค้าชิ้นแรกสำเร็จ'
  },
  
  five_listings: {
    action: 'post_five_products',
    nextStage: 'advanced',
    requirement: 'โพสสินค้าครบ 5 ชิ้น'
  },
  
  first_sale: {
    action: 'complete_first_sale',
    nextStage: 'advanced',
    requirement: 'ขายสินค้าสำเร็จครั้งแรก'
  },
  
  verified_seller: {
    action: 'complete_verification',
    nextStage: 'expert',
    requirement: 'ยืนยันตัวตนเรียบร้อย'
  },
  
  power_user: {
    action: 'reach_50_sales',
    nextStage: 'expert',
    requirement: 'ขายสินค้าครบ 50 รายการ'
  }
}
```

## ✅ Core Principles

### 1. ทุกขั้นข้ามได้
```typescript
{
  isOptional: true,
  canSkip: true
}
```

- ไม่มีฟีเจอร์ใดบังคับ (ยกเว้น 4 ฟีเจอร์พื้นฐาน)
- ผู้ใช้สามารถข้ามได้ทุกเมื่อ
- ไม่มี error ถ้าข้าม

### 2. ไม่มี Error ถ้าข้าม
```typescript
const skipAction = async (action: string) => {
    // บันทึกว่าข้ามแล้ว แต่ไม่ block อะไร
    skippedActions: [...prev, action]
}
```

### 3. ลด Cognitive Load
- **Beginner**: 4 ฟีเจอร์เท่านั้น
- **Intermediate**: +4 ฟีเจอร์ (รวม 8)
- **Advanced**: +4 ฟีเจอร์ (รวม 12)
- **Expert**: +4 ฟีเจอร์ (รวม 16)

## 💻 Usage Examples

### Check if feature is unlocked
```tsx
import { useProgressiveUnlock } from '@/hooks/useProgressiveUnlock'

function MyComponent() {
  const { isUnlocked } = useProgressiveUnlock()
  
  return (
    <div>
      {isUnlocked('ai_pricing') && <AiPricingSuggestion />}
      {isUnlocked('bulk_upload') && <BulkUploadButton />}
      {!isUnlocked('analytics') && <FeatureLockIndicator featureId="analytics" />}
    </div>
  )
}
```

### Display progress banner
```tsx
import ProgressiveUnlockBanner from '@/components/onboarding/ProgressiveUnlockBanner'

<ProgressiveUnlockBanner language="th" compact={false} />
```

### Record action completion
```tsx
const { recordAction } = useProgressiveUnlock()

// After user posts first product
await recordAction('post_first_product')
// This automatically unlocks intermediate features!
```

### Show unlock celebration
```tsx
import { UnlockCelebration } from '@/components/onboarding/ProgressiveUnlockBanner'

const [showCelebration, setShowCelebration] = useState(false)

{showCelebration && (
  <UnlockCelebration
    featureName="AI Price Suggestion"
    language="th"
    onClose={() => setShowCelebration(false)}
  />
)}
```

## 🗄️ Firestore Schema

```typescript
// users/{userId}
{
  progressive_unlock: {
    currentStage: 'beginner' | 'intermediate' | 'advanced' | 'expert',
    completedActions: string[],      // ['post_first_product', 'complete_first_sale']
    skippedActions: string[],        // ['complete_verification']
    unlockedFeatures: string[],      // ['ai_pricing', 'analytics']
    lastUpdated: timestamp
  }
}
```

## 📈 Progress Calculation

```typescript
// Total unlocked features / Total features
const progress = (unlockedCount / totalFeatures) * 100

// Example:
// Beginner: 4/16 = 25%
// Intermediate: 8/16 = 50%
// Advanced: 12/16 = 75%
// Expert: 16/16 = 100%
```

## 🎨 UI Components

### 1. ProgressiveUnlockBanner
Shows overall progress and next milestone

**Compact Mode**:
```tsx
<ProgressiveUnlockBanner language="th" compact={true} />
```

**Full Mode**:
```tsx
<ProgressiveUnlockBanner language="th" compact={false} />
```

### 2. FeatureLockIndicator
Shows lock badge on locked features

```tsx
<FeatureLockIndicator featureId="bulk_upload" language="th" />
```

### 3. UnlockCelebration
Celebration modal when feature unlocks

```tsx
<UnlockCelebration
  featureName="Advanced Analytics"
  language="en"
  onClose={() => {}}
/>
```

## 🔄 User Journey Example

```
Day 1: New User
├─ Stage: Beginner
├─ Visible: 4 features
└─ Action: Upload first product ✅

Day 1: After First Post
├─ Stage: Intermediate (AUTO UNLOCK!)
├─ Visible: 8 features
├─ Celebration: "You unlocked AI tools!"
└─ Action: Post 4 more products

Day 3: Active Seller
├─ Stage: Advanced (AUTO UNLOCK!)
├─ Visible: 12 features
├─ Celebration: "You unlocked Analytics!"
└─ Action: Complete verification

Day 7: Verified Seller
├─ Stage: Expert (AUTO UNLOCK!)
├─ Visible: 16 features (ALL)
└─ Celebration: "You're now an expert!"
```

## ⚡ Benefits

### For New Users
- ✅ Not overwhelmed (only 4 features)
- ✅ Clear path forward
- ✅ Sense of progression
- ✅ Can skip anything

### For Platform
- ✅ Higher completion rates
- ✅ Better onboarding metrics
- ✅ Natural user education
- ✅ Reduced support tickets

## 🚫 What NOT to Do

❌ **Don't**:
- Force users to complete stages
- Show error if they skip
- Lock essential features
- Make progression confusing
- Hide the unlock criteria

✅ **Do**:
- Show clear progress
- Allow skipping
- Celebrate unlocks
- Keep it simple
- Be transparent

## 📊 Analytics Events

```typescript
// Stage progression
analytics.track('stage_unlocked', {
  from: 'beginner',
  to: 'intermediate',
  trigger: 'post_first_product'
})

// Feature unlock
analytics.track('feature_unlocked', {
  feature: 'ai_pricing',
  stage: 'intermediate'
})

// Action skipped
analytics.track('action_skipped', {
  action: 'complete_verification',
  stage: 'advanced'
})
```

## 🎯 Success Metrics

Track these to measure effectiveness:
- **Completion Rate**: % users reaching each stage
- **Time to Intermediate**: Days to unlock AI tools
- **Skip Rate**: % of actions skipped
- **Feature Adoption**: % using unlocked features
- **Retention**: Users active after unlock

## 🚀 Future Enhancements

1. **Personalized Paths**: Different unlock paths for different roles
2. **Temporary Unlocks**: Try features for 7 days
3. **Social Unlocks**: Unlock by referring friends
4. **Achievement Badges**: Gamification layer
5. **Custom Milestones**: Let users set their own goals
