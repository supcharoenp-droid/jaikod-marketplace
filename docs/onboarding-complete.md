# Progressive Onboarding System - Complete Documentation

## 📋 Overview
ระบบ Onboarding แบบ Progressive ที่ออกแบบมาเพื่อแยกกลุ่มผู้ใช้ตามเป้าหมายการขาย และปรับ UI/Features ให้เหมาะสมอัตโนมัติ

## 🎯 Core Objectives
1. **Segmentation**: แยกผู้ใช้เป็น Individual / Pro / Mall
2. **Simplicity**: ถามคำถามไม่เกิน 3 ข้อ
3. **Progressive**: ไม่บังคับ สามารถข้ามได้
4. **Bilingual**: รองรับ TH/EN ตาม user profile
5. **AI-Assisted**: มี AI Mentor แนะนำทุกขั้นตอน

---

## 🔄 Onboarding Flow

### Step 0: Pre-check
**Trigger**: User clicks "ขายสินค้า" (Sell) button

**Logic**:
```typescript
if (user.onboarding?.isCompleted) {
  → Navigate to /sell
} else if (user.onboarding?.step > 0) {
  → Resume from last step
} else {
  → Start Step 1
}
```

### Step 1: Goal Selection
**Screen**: `OnboardingGoalScreen`

**Question (TH)**: "อยากขายแบบไหน?"
**Question (EN)**: "How do you want to sell?"

**Options**:
1. **ปล่อยของมือสอง** (Clear Closet)
   - Role: `individual`
   - Goal: `clear_closet`
   - Icon: 📦
   - Color: Blue → Cyan gradient

2. **ร้านค้ามืออาชีพ** (Professional Shop)
   - Role: `pro`
   - Goal: `side_hustle`
   - Icon: 🏪
   - Color: Purple → Pink gradient

3. **แบรนด์ / ธุรกิจ** (Brand/Business)
   - Role: `mall`
   - Goal: `business`
   - Icon: 🏢
   - Color: Orange → Red gradient

**Output**: Sets `seller_type` and `selling_goal` in Firebase

### Step 2: Auto Role Assignment
**Automatic Process** (No UI)

Based on selection:
```typescript
const ROLE_MAPPING = {
  clear_closet: {
    seller_type: 'individual',
    features: {
      can_customize_shop: false,
      can_bulk_upload: false,
      can_issue_tax: false,
      use_simple_upload: true
    }
  },
  side_hustle: {
    seller_type: 'pro',
    features: {
      can_customize_shop: true,
      can_bulk_upload: true,
      can_issue_tax: false,
      use_simple_upload: false
    }
  },
  business: {
    seller_type: 'mall',
    features: {
      can_customize_shop: true,
      can_bulk_upload: true,
      can_issue_tax: true,
      use_simple_upload: false
    }
  }
}
```

### Step 3: Role-Based Checklist
**Screen**: `OnboardingChecklist`

**Individual Checklist**:
- [ ] ยืนยันเบอร์โทร (Phone OTP)
- [ ] โพสสินค้าชิ้นแรก (First Product with AI)

**Pro Checklist**:
- [ ] ยืนยันเบอร์โทร (Phone OTP)
- [ ] ยืนยันตัวตน (ID Card KYC)
- [ ] ตั้งค่าบัญชีรับเงิน (Bank Account)
- [ ] โพสสินค้าชิ้นแรก (First Product)

**Mall Checklist**:
- [ ] ยืนยันเบอร์โทร (Phone OTP)
- [ ] อัปโหลดเอกสารนิติบุคคล (Business Registration)
- [ ] ตั้งค่าบัญชีธุรกิจ (Business Bank + Tax)
- [ ] ตั้งค่าการจัดส่ง (Shipping Setup)
- [ ] นำเข้าสินค้า (Bulk Import)

### Step 4: AI Context Activation
**Automatic Process**

Enables AI features based on role:
```typescript
const AI_FEATURES = {
  individual: ['quick_price_check', 'auto_description'],
  pro: ['shop_insights', 'auto_reply', 'price_optimization'],
  mall: ['inventory_forecast', 'team_analytics', 'api_integration']
}
```

### Step 5: Skip Safety
Users can skip at any point:
- Saves `onboarding.skipped = true`
- Sets minimal permissions
- Can resume later from profile

---

## 🗄️ Firebase Schema Changes

### `users` Collection
```typescript
interface UserDocument {
  // ... existing fields ...
  
  // NEW FIELDS (Non-destructive additions)
  seller_type?: 'individual' | 'pro' | 'mall'
  selling_goal?: 'clear_closet' | 'side_hustle' | 'business'
  
  onboarding?: {
    step: number // 0-4
    isCompleted: boolean
    selectedGoal?: 'clear_closet' | 'side_hustle' | 'business'
    assignedRole?: 'individual' | 'pro' | 'mall'
    skipped?: boolean
  }
  
  onboarding_checklist?: {
    phone_verified: boolean
    id_verified: boolean
    bank_added: boolean
    first_product_posted: boolean
    shipping_setup?: boolean // Mall only
    bulk_upload?: boolean // Mall only
  }
  
  features_enabled?: {
    can_customize_shop: boolean
    can_bulk_upload: boolean
    can_issue_tax: boolean
    use_simple_upload: boolean
  }
}
```

### `sellers` Collection
```typescript
interface SellerDocument {
  // ... existing fields ...
  
  // NEW FIELDS
  seller_type?: 'individual' | 'pro' | 'mall'
  selling_goal?: 'clear_closet' | 'side_hustle' | 'business'
}
```

---

## 🎨 UI Copy Examples

### Thai (TH)
```typescript
const COPY_TH = {
  goal_screen: {
    title: 'อยากขายแบบไหน?',
    subtitle: 'เลือกให้ตรงจุดประสงค์ เพื่อให้เราปรับแต่งเครื่องมือให้คุณ',
    ai_hint: '💡 AI จะช่วยแนะนำเครื่องมือที่เหมาะสมตามที่คุณเลือก'
  },
  checklist: {
    title: 'เริ่มต้นใช้งาน',
    subtitle: 'ทำตามขั้นตอนเหล่านี้เพื่อเริ่มขาย',
    ai_mentor: 'AI Mentor พร้อมช่วยเหลือคุณทุกขั้นตอน'
  }
}
```

### English (EN)
```typescript
const COPY_EN = {
  goal_screen: {
    title: 'How do you want to sell?',
    subtitle: 'Choose your goal so we can tailor the tools for you',
    ai_hint: '💡 AI will recommend the right tools based on your choice'
  },
  checklist: {
    title: 'Getting Started',
    subtitle: 'Complete these steps to start selling',
    ai_mentor: 'AI Mentor ready to help at every step'
  }
}
```

---

## 🔐 Role Permission Matrix

| Feature | Buyer | Individual | Pro | Mall |
|---------|-------|-----------|-----|------|
| **Sell Items** | ❌ | ✅ (5/month) | ✅ Unlimited | ✅ Unlimited |
| **Shop Page** | ❌ | Basic Profile | Custom Design | Fully Custom |
| **Bulk Upload** | ❌ | ❌ | ✅ Excel | ✅ Excel/API |
| **Tax Invoice** | ❌ | ❌ | ❌ | ✅ |
| **Analytics** | ❌ | Basic | Advanced | Enterprise |
| **API Access** | ❌ | ❌ | ❌ | ✅ |
| **Team Management** | ❌ | ❌ | ❌ | ✅ |
| **Fees** | - | Standard | -10% | Negotiated |
| **Verification** | Email | Phone | ID Card | Business Cert |

---

## 🚀 Implementation Checklist

### ✅ Completed
- [x] Type definitions (`src/types/onboarding.ts`)
- [x] AuthContext update with `sellerType`
- [x] OnboardingGoalScreen component
- [x] OnboardingChecklist component
- [x] OnboardingFlow orchestrator
- [x] Design documentation

### 🔄 Next Steps
1. **Phone Verification Modal**
   - OTP input component
   - Firebase Auth phone verification
   
2. **ID Verification Modal**
   - Image upload for ID card
   - OCR integration (optional)
   
3. **Bank Account Setup**
   - Form for bank details
   - Secure storage in Firestore
   
4. **Product Upload Integration**
   - Redirect to `/sell` with AI assist
   - Pre-fill based on `seller_type`
   
5. **AI Mentor Component**
   - Contextual tips based on current step
   - Chat-like interface (optional)

---

## 🎯 Usage Example

```tsx
// In your app (e.g., when user clicks "Sell")
import OnboardingFlow from '@/components/onboarding/OnboardingFlow'

function SellPage() {
  const { user, storeStatus } = useAuth()
  const [showOnboarding, setShowOnboarding] = useState(false)
  
  useEffect(() => {
    // Check if onboarding needed
    if (user && !storeStatus.sellerType) {
      setShowOnboarding(true)
    }
  }, [user, storeStatus])
  
  if (showOnboarding) {
    return (
      <OnboardingFlow 
        onComplete={() => {
          setShowOnboarding(false)
          // Proceed to sell page
        }}
      />
    )
  }
  
  return <YourSellPageContent />
}
```

---

## 📊 Analytics Events

Track these events for optimization:
```typescript
// Goal selection
analytics.track('onboarding_goal_selected', {
  goal: 'clear_closet' | 'side_hustle' | 'business',
  role: 'individual' | 'pro' | 'mall'
})

// Checklist progress
analytics.track('onboarding_checklist_item_completed', {
  item: 'phone_verified' | 'id_verified' | ...,
  role: 'individual' | 'pro' | 'mall'
})

// Completion
analytics.track('onboarding_completed', {
  role: 'individual' | 'pro' | 'mall',
  time_taken_seconds: number
})

// Skip
analytics.track('onboarding_skipped', {
  at_step: number
})
```

---

## 🎨 Design Tokens

```css
/* Gradients */
--gradient-individual: linear-gradient(135deg, #3B82F6 0%, #06B6D4 100%);
--gradient-pro: linear-gradient(135deg, #A855F7 0%, #EC4899 100%);
--gradient-mall: linear-gradient(135deg, #F97316 0%, #EF4444 100%);

/* AI Mentor */
--gradient-ai: linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%);
```

---

## 🔧 Troubleshooting

**Q: User stuck in onboarding loop?**
A: Check `onboarding.step` in Firestore. Reset to 0 or set `isCompleted: true`

**Q: Features not showing after onboarding?**
A: Verify `features_enabled` object is set correctly. Call `refreshProfile()`

**Q: Language not switching?**
A: Ensure `language` field in user document is 'th' or 'en'

---

## 📝 Notes
- All onboarding steps are **optional** (Progressive Enhancement)
- Users can **skip** and complete later from profile settings
- **No destructive changes** to existing database schema
- **Backward compatible** with existing users (they get default 'individual' role)
