# AI Mentor System Documentation

## 🤖 Overview
AI Mentor เป็นผู้ช่วยส่วนตัวที่แนะนำผู้ใช้ทีละขั้นตอนในกระบวนการ Onboarding และการขายสินค้า

## ✨ Core Principles

### 1. เป็นมิตร ไม่ใช้ภาษาเทคนิค
❌ **ไม่ดี**: "กรุณาดำเนินการ KYC verification เพื่อ authenticate identity"
✅ **ดี**: "ยืนยันตัวตนด้วยบัตรประชาชนครับ ช่วยสร้างความน่าเชื่อถือ"

### 2. บอกว่าข้ามได้ ไม่บังคับ
- ใช้คำว่า "แนะนำ" แทน "ต้อง"
- ใช้คำว่า "ควร" แทน "จำเป็น"
- เน้นประโยชน์ ไม่ใช่ข้อบังคับ

### 3. ปรับตาม Role
- **Individual**: เน้นความง่าย รวดเร็ว
- **Pro**: เน้นเครื่องมือ การเติบโต
- **Mall**: เน้นระบบ ประสิทธิภาพ

## 📋 Message Contexts

### Onboarding Contexts
```typescript
'onboarding_start'      // เริ่มต้น onboarding
'goal_selection'        // เลือกเป้าหมาย
'checklist_phone'       // ยืนยันเบอร์
'checklist_kyc'         // ยืนยันตัวตน
'checklist_bank'        // เพิ่มบัญชี
'checklist_product'     // โพสสินค้าแรก
'checklist_shipping'    // ตั้งค่าจัดส่ง
'checklist_bulk'        // นำเข้าจำนวนมาก
```

### Product Listing Contexts
```typescript
'first_product'         // สินค้าชิ้นแรก
'pricing'               // ตั้งราคา
'description'           // เขียนคำอธิบาย
'images'                // อัปโหลดรูป
'category'              // เลือกหมวดหมู่
'completed'             // เสร็จสิ้น
```

## 💬 Message Structure

```typescript
interface MentorMessage {
    context: MentorContext
    role?: SellerType
    language: 'th' | 'en'
    message: string        // ข้อความหลัก
    tip?: string          // เคล็ดลับเพิ่มเติม
    canSkip?: boolean     // ข้ามได้หรือไม่
    priority?: 'low' | 'medium' | 'high'
}
```

## 🎨 UI Components

### 1. AiMentorBubble (Main)
```tsx
<AiMentorBubble
    message={getMentorMessage('goal_selection', 'th')}
    onDismiss={() => {}}
    compact={false}
/>
```

**Features**:
- ✅ Expandable/Collapsible
- ✅ Animated entrance
- ✅ Dismissible
- ✅ Priority indicator
- ✅ Tip section

### 2. AiMentorInline (Compact)
```tsx
<AiMentorInline
    message={getMentorMessage('pricing', 'th')}
/>
```

**Use Cases**:
- Form hints
- Quick tips
- Inline guidance

### 3. AiMentorFloatingButton
```tsx
<AiMentorFloatingButton
    onClick={() => setShowMentor(true)}
/>
```

**Features**:
- Fixed position (bottom-right)
- Pulsing indicator
- Always accessible

## 📝 Message Examples

### Thai Messages
```typescript
{
    context: 'checklist_phone',
    message: 'ยืนยันเบอร์โทรเพื่อความปลอดภัยครับ ใช้เวลาแค่ 1 นาที',
    tip: 'ลูกค้าจะมั่นใจมากขึ้นถ้าคุณยืนยันเบอร์แล้ว',
    canSkip: true
}
```

### English Messages
```typescript
{
    context: 'checklist_phone',
    message: 'Verify your phone for security. Takes just 1 minute!',
    tip: 'Buyers trust verified sellers more',
    canSkip: true
}
```

## 🎯 Role-Specific Tips

### Individual Seller
```typescript
th: [
    'เริ่มต้นง่าย ๆ ไม่ต้องเปิดร้าน โพสได้เลย',
    'ถ่ายรูปด้วยมือถือก็ได้ แค่ให้ชัด',
    'ตั้งราคาตามใจ ปรับได้ทุกเมื่อ'
]
```

### Professional Shop
```typescript
th: [
    'ร้านของคุณจะมีหน้าตาเป็นของตัวเอง',
    'ใช้เครื่องมือวิเคราะห์ดูว่าสินค้าไหนขายดี',
    'ตั้งแคมเปญลดราคาได้ด้วยตัวเอง'
]
```

### Mall
```typescript
th: [
    'เชื่อมต่อระบบของคุณผ่าน API ได้',
    'จัดการทีมงานและมอบหมายงาน',
    'AI จะช่วยคาดการณ์สต็อกให้'
]
```

## 🔧 Usage Examples

### Basic Usage
```tsx
import { getMentorMessage } from '@/types/ai-mentor'
import AiMentorBubble from '@/components/onboarding/AiMentorBubble'

function MyComponent() {
    const language = 'th'
    
    return (
        <AiMentorBubble
            message={getMentorMessage('first_product', language)}
        />
    )
}
```

### Dynamic Context
```tsx
const [currentStep, setCurrentStep] = useState('pricing')

<AiMentorBubble
    message={getMentorMessage(currentStep, language, sellerType)}
    compact={true}
/>
```

### With Dismiss Handler
```tsx
const [showMentor, setShowMentor] = useState(true)

{showMentor && (
    <AiMentorBubble
        message={getMentorMessage('goal_selection', 'th')}
        onDismiss={() => setShowMentor(false)}
    />
)}
```

## 🎨 Visual Design

### Colors
- **Primary**: Purple to Pink gradient (`from-purple-500 to-pink-500`)
- **Background**: Light purple/pink (`from-purple-50 to-pink-50`)
- **Border**: Purple 200 (`border-purple-200`)
- **Tip Section**: Amber (`bg-amber-50`)

### Animations
- **Entrance**: Scale + Fade in
- **Exit**: Scale + Fade out
- **Expand/Collapse**: Height animation
- **Pulse**: Avatar indicator

### Icons
- **Main**: Sparkles ✨
- **Tip**: Lightbulb 💡
- **Status**: Green dot (online)

## 📊 Priority Levels

### High Priority
- First product upload
- Payment setup
- Critical errors

**Visual**: Ring effect + exclamation mark

### Medium Priority
- Checklist items
- Verification steps

**Visual**: Standard bubble

### Low Priority
- General tips
- Optional features

**Visual**: Compact/inline

## 🌐 Localization

### Adding New Language
1. Add to `MENTOR_MESSAGES` in `ai-mentor.ts`
2. Add to `ROLE_SPECIFIC_TIPS`
3. Update `MentorMessage` language type

```typescript
export const MENTOR_MESSAGES: Record<MentorContext, {
    th: { message: string; tip?: string }
    en: { message: string; tip?: string }
    ja: { message: string; tip?: string } // New
}> = {
    // ...
}
```

## 🚀 Best Practices

### DO ✅
- Use friendly, conversational tone
- Explain benefits, not requirements
- Keep messages short (1-2 sentences)
- Provide actionable tips
- Allow dismissal
- Adapt to user's role

### DON'T ❌
- Use technical jargon
- Force users to complete steps
- Write long paragraphs
- Be pushy or salesy
- Block the main flow
- Repeat the same message

## 📈 Future Enhancements

1. **Contextual Learning**: Remember dismissed messages
2. **Smart Timing**: Show based on user behavior
3. **A/B Testing**: Test different message variations
4. **Voice Support**: Audio mentor (optional)
5. **Personalization**: Use user's name
6. **Progress Tracking**: Show completion percentage
7. **Gamification**: Rewards for following tips

## 🔍 Analytics

Track these events:
```typescript
// Mentor shown
analytics.track('mentor_shown', {
    context: 'goal_selection',
    language: 'th',
    role: 'seller'
})

// Mentor dismissed
analytics.track('mentor_dismissed', {
    context: 'checklist_phone',
    time_shown_seconds: 15
})

// Tip followed
analytics.track('mentor_tip_followed', {
    context: 'pricing',
    tip: 'quick_sell_price'
})
```
