# 🎨 JaiKod Chat System - UI/UX Design Guide

> **Complete Design System** สำหรับระบบ Chat  
> รวม Mockups, Components, Colors, Typography, และ Guidelines

---

## 📋 สารบัญ

1. [UI Mockups](#ui-mockups)
2. [Design System](#design-system)
3. [Component Library](#component-library)
4. [Responsive Design](#responsive-design)
5. [Accessibility](#accessibility)
6. [Animation Guidelines](#animation-guidelines)

---

## 🖼️ UI Mockups

### 1. Desktop Chat Interface (3-Column Layout)

**Mockup:** `chat_desktop_mockup.png`

#### Layout Structure:
```
┌─────────────────────────────────────────────────────────────┐
│  Header (Logo, Search, Notifications, Profile)             │
├──────────────┬──────────────────────────┬──────────────────┤
│              │                          │                  │
│  Chat List   │    Chat Screen           │  Product Info    │
│  (320px)     │    (Flexible)            │  (360px)         │
│              │                          │                  │
│  - Search    │  - Header                │  - Product       │
│  - Filters   │  - Product Bar           │  - Seller Trust  │
│  - Convs     │  - Messages              │  - Safety        │
│              │  - Quick Replies         │                  │
│              │  - Input                 │                  │
│              │                          │                  │
└──────────────┴──────────────────────────┴──────────────────┘
```

#### Key Features:
- ✅ **Left Column (320px fixed)**
  - Search conversations
  - Filter tabs (All, Unread, Tagged)
  - Conversation list with avatars, trust scores, unread counts
  - Product thumbnails

- ✅ **Center Column (Flexible)**
  - Chat header with seller info
  - Product context bar
  - Message bubbles (buyer: white, seller: purple gradient)
  - Quick reply buttons
  - Rich input area (AI, Image, File, Location)

- ✅ **Right Column (360px fixed)**
  - Product image & details
  - Seller trust score (circular progress)
  - Safety warnings
  - Seller stats

---

### 2. Mobile Chat Interface (iOS Style)

**Mockup:** `chat_mobile_mockup.png`

#### Screen Flow:
```
Chat List → Chat Screen → AI Assist Menu
   ↓            ↓              ↓
 Search      Messages      AI Tools
 Filter      Input         Suggestions
 Convs       Quick Reply   Analysis
```

#### Screen 1: Chat List
- Header with "แชท" title
- Search bar
- Conversation cards:
  - Avatar (gradient)
  - Name + Trust score
  - Online status (green dot)
  - Last message preview
  - Timestamp
  - Unread badge
  - Product thumbnail
- Bottom navigation (5 tabs)

#### Screen 2: Chat Conversation
- Header:
  - Back button
  - Seller info (avatar, name, online)
  - More menu (3 dots)
- Product banner (collapsible)
- Messages:
  - White bubbles (received)
  - Purple bubbles (sent)
  - Read receipts
- Quick replies (horizontal scroll)
- Input bar:
  - Attachment button (+)
  - AI assist button (✨)
  - Text input
  - Send button

#### Screen 3: AI Assist Menu
- Bottom sheet modal
- Purple header "AI ช่วยเหลือ"
- Menu options:
  - 📄 สรุปการคุย
  - 💡 แนะนำคำตอบ (3 ตัวเลือก)
  - 🏷️ แนะนำราคา
  - 📅 สรุปเงื่อนไขนัดรับ

---

### 3. Feature Components

**Mockup:** `chat_features_components.png`

#### Image Upload Component
```
┌─────────────────────────────────┐
│  Image Preview Grid (3x2)       │
│  ┌───┐ ┌───┐ ┌───┐             │
│  │ X │ │ X │ │ X │             │
│  └───┘ └───┘ └───┘             │
│  ┌───┐ ┌───┐ ┌───┐             │
│  │ X │ │ X │ │ + │ Add More    │
│  └───┘ └───┘ └───┘             │
│                                 │
│  [ส่งรูป (5)]                   │
└─────────────────────────────────┘
```

**Features:**
- Preview before send
- Remove individual images
- Add more (up to 5)
- Auto-compress
- Progress indicator

#### Location Sharing Component
```
┌─────────────────────────────────┐
│  Map Preview                     │
│  📍 (Red pin marker)            │
│                                 │
│  ที่อยู่: [Address text]        │
│                                 │
│  [📍 ใช้ตำแหน่งปัจจุบัน]       │
│                                 │
│  🛡️ จุดนัดรับที่แนะนำ          │
│  ┌──────┐ ┌──────┐             │
│  │ 🏪   │ │ ⛽   │             │
│  │7-11  │ │ PTT  │             │
│  │⭐⭐⭐⭐⭐│ │⭐⭐⭐⭐⭐│             │
│  └──────┘ └──────┘             │
│  ┌──────┐ ┌──────┐             │
│  │ 🚇   │ │ 🏬   │             │
│  │ BTS  │ │ Mall │             │
│  │⭐⭐⭐⭐  │ │⭐⭐⭐⭐⭐│             │
│  └──────┘ └──────┘             │
│                                 │
│  [ส่งตำแหน่ง]                   │
└─────────────────────────────────┘
```

**Features:**
- Current location
- Map preview
- AI safe meeting points
- Safety ratings
- Distance info

#### Pinned Messages Component
```
┌─────────────────────────────────┐
│  📌 ข้อความที่ปักหมุด           │
│  ┌─────────────────────────┐   │
│  │ 📌 ราคาตกลง 3,500 บาท  │ X │
│  │    10:30 AM             │   │
│  └─────────────────────────┘   │
│  ┌─────────────────────────┐   │
│  │ 📌 นัดรับหน้า 7-11 สยาม │ X │
│  │    10:35 AM             │   │
│  └─────────────────────────┘   │
│  ┌─────────────────────────┐   │
│  │ 📌 วันเสาร์ 15 ธ.ค. 14:00│ X │
│  │    10:40 AM             │   │
│  └─────────────────────────┘   │
└─────────────────────────────────┘
```

**Features:**
- Max 3 pinned messages
- Pin/Unpin toggle
- Always visible at top
- Timestamp shown

---

### 4. Seller Pro Interface

**Mockup:** `chat_seller_pro_mockup.png`

#### Enhanced Features:

**Left Panel - Chat List:**
- Tabs: ทั้งหมด | ยังไม่อ่าน | Tagged
- Customer tags:
  - 🆕 ลูกค้าใหม่ (Blue)
  - 💰 รอชำระ (Orange)
  - 👑 VIP (Gold)
  - 📦 รอส่ง (Purple)
  - ⚠️ มีปัญหา (Red)
- Internal notes icon
- Filter & sort options

**Center Panel - Pro Tools:**
- Toolbar:
  - ⚡ Canned Messages
  - 🏷️ Tag Customer
  - 🛍️ Create Order
  - 📢 Broadcast
- Canned messages sidebar:
  - Categories (ทักทาย, ราคา, การส่ง, ปิดการขาย)
  - Quick insert buttons
  - Keyboard shortcuts (Ctrl+1-9)

**Right Panel - Customer Info:**
- Customer profile:
  - Avatar & name
  - Tags
  - Purchase history (3 orders, ฿12,500)
  - Last active
- Internal notes (seller only)
- Quick actions:
  - สร้างออเดอร์
  - ส่งคูปอง
  - ส่งเลขพัสดุ

---

### 5. Safety Features

**Mockup:** `chat_safety_features.png`

#### Scam Detection Alert
```
┌─────────────────────────────────────┐
│ 🚨 คำเตือน: ข้อความนี้มีความเสี่ยง │
│    มิจฉาชีพ                         │
│                                     │
│ ข้อความ: "โอนเงินมาก่อนนะครับ"     │
│          ^^^^^^^^^^^^^^^^           │
│          (highlighted in red)       │
│                                     │
│ [เรียนรู้เพิ่มเติม] [รายงาน] [บล็อก]│
└─────────────────────────────────────┘
```

#### Safe Meeting Points Map
```
┌─────────────────────────────────────┐
│  Map with pins:                     │
│  🟢 7-Eleven (⭐⭐⭐⭐⭐) 500m        │
│  🟢 PTT (⭐⭐⭐⭐⭐) 800m            │
│  🟢 BTS (⭐⭐⭐⭐) 1.2km             │
│  🟢 Mall (⭐⭐⭐⭐⭐) 1.5km          │
│                                     │
│ 💡 เคล็ดลับ: นัดรับที่สถานที่       │
│    สาธารณะ มีกล้องวงจรปิด          │
└─────────────────────────────────────┘
```

#### Block/Report Interface
```
┌─────────────────────────────────────┐
│  เลือกการดำเนินการ:                │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ 🚫 บล็อกผู้ใช้              │   │
│  │ ผู้ใช้นี้จะไม่สามารถส่ง     │   │
│  │ ข้อความหาคุณได้อีก          │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ 🚩 รายงานผู้ใช้             │   │
│  │ ส่งรายงานให้ทีมงานตรวจสอบ   │   │
│  └─────────────────────────────┘   │
│                                     │
│  เหตุผล:                            │
│  ☐ มิจฉาชีพ                         │
│  ☐ สินค้าปลอม                       │
│  ☐ ภาษาไม่สุภาพ                     │
│  ☐ ขายของผิดกฎหมาย                  │
│                                     │
│  ⚠️ คำเตือน: การดำเนินการนี้       │
│     ไม่สามารถยกเลิกได้             │
│                                     │
│  [ยกเลิก]  [ยืนยัน]                │
└─────────────────────────────────────┘
```

---

## 🎨 Design System

### Color Palette

#### Primary Colors
```css
--primary-purple: #8B5CF6;      /* Main brand color */
--primary-purple-dark: #7C3AED; /* Hover state */
--primary-purple-light: #A78BFA;/* Disabled state */
--primary-purple-50: #F5F3FF;   /* Background */
```

#### Secondary Colors
```css
--coral-orange: #FF6B6B;        /* Accent color */
--neon-green: #10B981;          /* Success */
--warning-orange: #F59E0B;      /* Warning */
--danger-red: #EF4444;          /* Error */
```

#### Neutral Colors
```css
--gray-50: #F9FAFB;
--gray-100: #F3F4F6;
--gray-200: #E5E7EB;
--gray-300: #D1D5DB;
--gray-400: #9CA3AF;
--gray-500: #6B7280;
--gray-600: #4B5563;
--gray-700: #374151;
--gray-800: #1F2937;
--gray-900: #111827;
```

#### Semantic Colors
```css
/* Online Status */
--online-green: #10B981;
--offline-gray: #9CA3AF;

/* Trust Score */
--trust-high: #10B981;    /* 90-100% */
--trust-medium: #F59E0B;  /* 70-89% */
--trust-low: #EF4444;     /* <70% */

/* Message Bubbles */
--bubble-sent: linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%);
--bubble-received: #FFFFFF;
--bubble-system: #F3F4F6;
```

---

### Typography

#### Font Family
```css
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
```

#### Font Sizes
```css
--text-xs: 12px;    /* Timestamps, badges */
--text-sm: 14px;    /* Secondary text */
--text-base: 16px;  /* Body text */
--text-lg: 18px;    /* Headings */
--text-xl: 20px;    /* Page titles */
--text-2xl: 24px;   /* Hero text */
```

#### Font Weights
```css
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
```

---

### Spacing

```css
--space-1: 4px;
--space-2: 8px;
--space-3: 12px;
--space-4: 16px;
--space-5: 20px;
--space-6: 24px;
--space-8: 32px;
--space-10: 40px;
--space-12: 48px;
```

---

### Border Radius

```css
--radius-sm: 4px;    /* Badges */
--radius-md: 8px;    /* Buttons, inputs */
--radius-lg: 12px;   /* Cards */
--radius-xl: 16px;   /* Modals */
--radius-full: 9999px; /* Avatars, pills */
```

---

### Shadows

```css
--shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
--shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
```

---

## 📦 Component Library

### 1. Avatar Component

```typescript
interface AvatarProps {
  src?: string;
  name: string;
  size: 'sm' | 'md' | 'lg';
  online?: boolean;
  trustScore?: number;
}
```

**Sizes:**
- `sm`: 32px (chat list)
- `md`: 40px (chat header)
- `lg`: 64px (profile)

**Features:**
- Gradient fallback (purple to pink)
- Online indicator (green dot)
- Trust score badge

---

### 2. Message Bubble

```typescript
interface MessageBubbleProps {
  type: 'sent' | 'received' | 'system';
  content: string;
  timestamp: Date;
  status?: 'sent' | 'delivered' | 'read';
  isPinned?: boolean;
}
```

**Styles:**
- **Sent:** Purple gradient, right-aligned
- **Received:** White, left-aligned
- **System:** Gray, center-aligned

**Features:**
- Read receipts (✓ / ✓✓)
- Timestamp
- Pin indicator
- Long-press menu (mobile)

---

### 3. Quick Reply Button

```typescript
interface QuickReplyProps {
  text: string;
  onClick: () => void;
  icon?: React.ReactNode;
}
```

**Style:**
```css
.quick-reply {
  padding: 8px 16px;
  border: 2px solid var(--primary-purple);
  border-radius: var(--radius-full);
  background: white;
  color: var(--primary-purple);
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  cursor: pointer;
  transition: all 0.2s;
}

.quick-reply:hover {
  background: var(--primary-purple-50);
}
```

---

### 4. Trust Score Badge

```typescript
interface TrustScoreBadgeProps {
  score: number; // 0-100
  size: 'sm' | 'md' | 'lg';
}
```

**Circular Progress:**
```
  98%
 ┌───┐
 │ ● │  Purple ring
 └───┘
```

**Colors:**
- 90-100%: Green
- 70-89%: Orange
- <70%: Red

---

### 5. Safety Warning Card

```typescript
interface SafetyWarningProps {
  level: 'info' | 'warning' | 'danger';
  message: string;
  tips: string[];
}
```

**Levels:**
- **Info:** Blue icon, informational
- **Warning:** Orange icon, caution
- **Danger:** Red icon, critical

---

## 📱 Responsive Design

### Breakpoints

```css
/* Mobile First */
--mobile: 0px;      /* 0-639px */
--tablet: 640px;    /* 640-1023px */
--desktop: 1024px;  /* 1024-1279px */
--wide: 1280px;     /* 1280px+ */
```

### Layout Adaptations

#### Mobile (< 640px)
- Single column
- Bottom navigation
- Full-screen chat
- Swipe gestures
- Bottom sheets for modals

#### Tablet (640-1023px)
- 2 columns (Chat List + Chat Screen)
- Product info in modal
- Side navigation
- Slide-over panels

#### Desktop (1024px+)
- 3 columns (List + Chat + Info)
- Persistent sidebar
- Hover states
- Keyboard shortcuts

---

## ♿ Accessibility

### WCAG 2.1 AA Compliance

#### Color Contrast
- Text: 4.5:1 minimum
- Large text: 3:1 minimum
- UI components: 3:1 minimum

#### Keyboard Navigation
```
Tab: Next element
Shift+Tab: Previous element
Enter: Activate
Escape: Close modal
Arrow keys: Navigate lists
Ctrl+1-9: Canned messages (Pro)
```

#### Screen Reader Support
- ARIA labels on all interactive elements
- Role attributes (button, link, dialog)
- Live regions for new messages
- Alt text for images

#### Focus Indicators
```css
:focus-visible {
  outline: 2px solid var(--primary-purple);
  outline-offset: 2px;
}
```

---

## 🎬 Animation Guidelines

### Transitions

```css
/* Default */
transition: all 0.2s ease-in-out;

/* Hover */
transition: transform 0.2s, box-shadow 0.2s;

/* Modal */
transition: opacity 0.3s, transform 0.3s;
```

### Micro-interactions

#### Button Click
```css
@keyframes button-click {
  0% { transform: scale(1); }
  50% { transform: scale(0.95); }
  100% { transform: scale(1); }
}
```

#### New Message
```css
@keyframes slide-in {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

#### Typing Indicator
```css
@keyframes typing {
  0%, 60%, 100% { opacity: 0.3; }
  30% { opacity: 1; }
}
```

---

## 📐 Grid System

### Chat List Grid
```css
.chat-list-item {
  display: grid;
  grid-template-columns: 48px 1fr auto;
  gap: 12px;
  padding: 12px;
}
```

### Message Grid
```css
.message-container {
  display: grid;
  grid-template-columns: 40px 1fr 40px;
  gap: 8px;
}
```

---

## 🎯 Best Practices

### Do's ✅
- Use consistent spacing (multiples of 4px)
- Maintain color contrast ratios
- Provide clear feedback for actions
- Use loading states
- Show error messages clearly
- Support keyboard navigation
- Test on real devices

### Don'ts ❌
- Don't use too many colors
- Don't hide important actions
- Don't use tiny touch targets (<44px)
- Don't auto-play sounds
- Don't block user input
- Don't use confusing icons

---

## 📚 Resources

### Design Files
- Figma: [Link to Figma file]
- Adobe XD: [Link to XD file]
- Sketch: [Link to Sketch file]

### Assets
- Icons: Lucide React
- Illustrations: [Custom illustrations]
- Photos: Unsplash, Pexels

### Tools
- Color Contrast Checker: WebAIM
- Accessibility Checker: axe DevTools
- Performance: Lighthouse

---

**Created by:** Antigravity AI  
**Date:** 10 ธันวาคม 2568  
**Version:** 1.0
