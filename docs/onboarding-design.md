# Progressive Onboarding System Design

## 1. Overview
ระบบ Onboarding ใหม่มุ่งเป้าการแยกกลุ่มผู้ใช้ (Segmentation) เพื่อนำเสนอ UX ที่เหมาะสมที่สุด โดยไม่บังคับ (Progressive) และใช้ AI Mentor เป็นตัวช่วย

## 2. Onboarding Flow

**Step 0: Pre-check**
- Trigger: User clicks "Sale" (ขายสินค้า)
- Check: `user.role` or `user.seller_profile`
  - If `has_profile` & `completed` -> Redirect to Dashboard
  - If `no_profile` -> Start Step 1

**Step 1: Goal Selection (ถามเป้าหมาย)**
- **UI**: "สวัสดีครับ วันนี้คุณอยากทำอะไร?" (Hi! What brings you here today?)
- **Options**:
  1. **โละของไม่ได้ใช้ (Clear Closet)** -> เหมาะกับ Individual Seller
     - *Focus*: ความเร็ว, ถ่ายรูปแล้วโพสเลย
  2. **หารายได้เสริม (Side Hustle)** -> เหมาะกับ Professional Seller
     - *Focus*: การสร้างร้าน, ความน่าเชื่อถือ
  3. **เปิดร้านจริงจัง / แบรนด์ (Official Brand)** -> เหมาะกับ Mall/Business
     - *Focus*: ระบบจัดการสต็อก, ภาษี, ทีมงาน

**Step 2: Role & Permission Assignment (ตั้งค่าอัตโนมัติ)**
- **Action**: เมื่อเลือก Goal -> System set flags:
  - Role: `SELLER_INDIVIDUAL | SELLER_PRO | SELLER_MALL`
  - Features: Toggle visibility (e.g. Hide Tax Invoice for Individual)

**Step 3: Role-Based Checklist (แสดงสิ่งที่ต้องทำ)**
- **Individual**:
  1. [ ] ยืนยันเบอร์โทร (OTP)
  2. [ ] โพสสินค้าชิ้นแรก (AI Assist)
- **Pro**:
  1. [ ] ตั้งชื่อร้าน & โลโก้
  2. [ ] ยืนยันตัวตน (KYC - ID Card)
  3. [ ] ตั้งค่าบัญชีรับเงิน
- **Mall**:
  1. [ ] อัปโหลดเอกสารนิติบุคคล
  2. [ ] ตั้งค่า Shipping (Standard/DHL)
  3. [ ] นำเข้าสินค้า (Excel/API)

**Step 4: AI Context Activation**
- **Smart Assist**:
  - Individual: "AI Price Check" & "Quick Description" active by default.
  - Pro/Mall: "Shop Insights" & "Auto-Reply" active.

## 3. Data Structure Changes (Non-destructive)

เพิ่ม Fields ใน `users` collection หรือ `sellers` specific doc:

```typescript
interface UserOnboardingFields {
  // Segmentation
  seller_type: 'individual' | 'pro' | 'mall'; // default: 'individual'
  selling_goal: 'clear_closet' | 'side_hustle' | 'business';
  
  // Progress Flags
  onboarding_step: number; // 0-5
  is_onboarding_completed: boolean;
  
  // Feature Flags (Optional)
  features_enabled: {
    tax_invoice: boolean; // true for Mall
    bulk_upload: boolean; // true for Pro/Mall
    quick_sell: boolean;  // true for Individual
  };
}
```

## 4. Role Permission Matrix

| Feature | Buyer | Seller (Individual) | Seller (Pro) | Seller (Mall) |
| :--- | :---: | :---: | :---: | :---: |
| **Sell Item** | ❌ | ✅ (Limit 5/mo) | ✅ (Unlimited) | ✅ (Unlimited) |
| **Shop Page** | ❌ | Basic Profile | Decoratable | Fully Custom |
| **Fees** | - | Standard | Lower % | Negotiated |
| **Tools** | - | Simple App | Analytics/Ads | API/ERP Link |
| **Verification** | Email | Phone | ID Card | Company Cert |

## 5. UI Copy (Example)

**Screen: Selection**
> **TH**: "อยากขายแบบไหน? เลือกให้ตรงจุดประสงค์ เพื่อให้เราปรับแต่งเครื่องมือให้คุณ"
> **EN**: "How do you want to sell? Choose your goal so we can tailor the tools for you."

**Choice 1**:
> **TH**: "ปล่อยของมือสอง" (ขายง่าย ไว ไม่ต้องตั้งค่าเยอะ)
> **EN**: "Sell Pre-owned" (Quick, easy, minimal setup)

**Choice 2**:
> **TH**: "ร้านค้ามืออาชีพ" (ต้องการเครื่องมือช่วยขาย และสร้างฐานลูกค้า)
> **EN**: "Professional Shop" (Need growth tools & customer base)

## 6. Implementation Plan (Next Steps)
1. Update `AuthProvider` to fetch/store `seller_type`.
2. Create `OnboardingGoalScreen` component.
3. Update `ProductEditor` (Sell Page) to adapt based on `seller_type`.
