# 💬 JaiKod Chat System - Complete Specification

> **ระบบแชทครบวงจร** สำหรับ Marketplace ระดับมืออาชีพ  
> รองรับทั้งผู้ขายทั่วไป, ร้านค้า Pro, และ AI Assistant เต็มรูปแบบ

---

## 📋 สารบัญ

1. [ภาพรวมระบบ](#ภาพรวมระบบ)
2. [ระดับผู้ใช้งาน 3 แบบ](#ระดับผู้ใช้งาน-3-แบบ)
3. [Features ทั้งหมด](#features-ทั้งหมด)
4. [UI/UX Layout](#uiux-layout)
5. [AI Features](#ai-features)
6. [Security & Safety](#security--safety)
7. [Database Schema](#database-schema)
8. [Implementation Roadmap](#implementation-roadmap)

---

## 🎯 ภาพรวมระบบ

### Vision
สร้างระบบแชทที่:
- **ปลอดภัย** - ตรวจจับมิจฉาชีพ, คำเสี่ยง, รูปภาพผิดกฎหมาย
- **ฉลาด** - AI ช่วยตอบ, แนะนำ, สรุปการคุย
- **มืออาชีพ** - รองรับร้านค้าขนาดใหญ่
- **ใช้งานง่าย** - Quick Reply, Canned Messages, Auto-Reply

### Architecture
```
┌─────────────────────────────────────────────────────────────┐
│                     Frontend (Next.js)                      │
├─────────────────────────────────────────────────────────────┤
│  Chat UI  │  AI Assistant  │  Safety Monitor  │  Analytics │
├─────────────────────────────────────────────────────────────┤
│                   Firebase Firestore (Real-time)            │
├─────────────────────────────────────────────────────────────┤
│  Conversations │  Messages │  Seller Profiles │  Reports   │
├─────────────────────────────────────────────────────────────┤
│              AI Services (Gemini / OpenAI)                  │
├─────────────────────────────────────────────────────────────┤
│  Auto Reply │ Scam Detection │ Image Verify │ Summarize   │
└─────────────────────────────────────────────────────────────┘
```

---

## 👥 ระดับผู้ใช้งาน 3 แบบ

### 1️⃣ **Chat ปกติ** (ผู้ขายทั่วไป)

**คุณสมบัติ:**
- ✅ ส่ง/รับข้อความ Real-time
- ✅ ส่งรูปภาพ (1-5 รูป)
- ✅ Quick Reply (5 ตัวเลือก)
- ✅ AI แนะนำคำตอบ (3 ตัวเลือก)
- ✅ Read Receipts (✓✓)
- ✅ ค้นหาข้อความ
- ✅ Block/Report
- ✅ Safety Warning

**เหมาะสำหรับ:**
- คนขายของมือสอง
- ขายของใช้ส่วนตัว
- ขายไม่บ่อย (< 10 รายการ/เดือน)

---

### 2️⃣ **Chat Pro** (Seller Pro / Official Store)

**คุณสมบัติเพิ่มเติม:**
- 🏪 **Canned Messages** (10+ templates)
- 🏷️ **Tag Customers** (New, Pending, Ready, Completed)
- 🤖 **AI Auto-Reply** (ตอบอัตโนมัติ)
- 📦 **Order Management** (สร้างออเดอร์ในแชท)
- 📢 **Broadcast Messages** (ส่งถึงลูกค้าเก่า)
- 👥 **Multi-Agent Chat** (หลายคนตอบได้)
- 📊 **Analytics Dashboard** (สถิติการตอบ)
- 🎁 **Send Coupon in Chat**

**เหมาะสำหรับ:**
- ร้านค้าออนไลน์
- ผู้ขายมืออาชีพ
- มีสินค้า > 50 รายการ
- มีลูกค้าประจำ

**ราคา:** ฿299/เดือน

---

### 3️⃣ **AI Chat Assistant** (Enterprise)

**คุณสมบัติเพิ่มเติม:**
- 🤖 **AI Full Auto-Reply** (ตอบอัตโนมัติ 24/7)
- 💰 **AI Price Negotiation** (ต่อรองราคาอัตโนมัติ)
- 🛡️ **Advanced Scam Detection**
- 📸 **AI Image Verification** (ตรวจรูปปลอม)
- 📊 **AI Sales Analytics** (วิเคราะห์ยอดขาย)
- 🎯 **AI Customer Segmentation**
- 🔮 **AI Predict Purchase Intent**
- 🌐 **Multi-language Support**

**เหมาะสำหรับ:**
- ร้านค้าขนาดใหญ่
- Official Store
- มีสินค้า > 500 รายการ
- มีลูกค้า > 1,000 คน/เดือน

**ราคา:** ฿999/เดือน

---

## 🚀 Features ทั้งหมด

### 📱 **Core Chat Features** (ทุกผู้ใช้)

#### 1. ส่งข้อความ
- ✅ Text Message
- ✅ Emoji Support
- ✅ Markdown Support (ตัวหนา, ตัวเอียง)
- ✅ Link Preview
- ✅ Typing Indicator (กำลังพิมพ์...)

#### 2. ส่งรูปภาพ
```typescript
interface ImageUpload {
  maxImages: 5;
  maxSizePerImage: 10MB;
  autoCompress: true;
  formats: ['jpg', 'png', 'webp'];
  preview: true; // แสดงตัวอย่างก่อนส่ง
}
```

**Features:**
- ✅ ส่งได้ 1-5 รูปพร้อมกัน
- ✅ Preview ก่อนส่ง
- ✅ Auto Compress (ลดขนาดอัตโนมัติ)
- ✅ Zoom รูปในแชท
- ✅ Download รูปต้นฉบับ

#### 3. ส่งไฟล์
```typescript
interface FileUpload {
  allowedTypes: ['pdf', 'doc', 'docx', 'xlsx'];
  maxSize: 20MB;
  useCases: [
    'ใบเสร็จ',
    'เอกสารประกัน',
    'ใบรับรอง',
    'คู่มือการใช้งาน'
  ];
}
```

**เหมาะกับ:**
- สินค้าแพง (กล้อง, คอมพิวเตอร์, รถ)
- ต้องการเอกสารประกอบ

#### 4. ส่งตำแหน่ง (Location)
```typescript
interface LocationShare {
  type: 'current' | 'custom';
  features: {
    shareCurrentLocation: true;
    pickOnMap: true;
    aiSuggestSafePlace: true; // AI แนะนำจุดนัดรับ
  };
  safetyTips: [
    'หน้าเซเว่น',
    'ปั๊มน้ำมัน',
    'ห้างสรรพสินค้า',
    'สถานีรถไฟฟ้า'
  ];
}
```

**AI Safe Meeting Point:**
- 🤖 AI แนะนำจุดนัดรับที่ปลอดภัย
- 📍 แสดงสถานที่สาธารณะใกล้เคียง
- ⭐ แสดง Rating ความปลอดภัย

#### 5. ปักหมุดข้อความ (Pin Message)
```typescript
interface PinnedMessage {
  maxPins: 3;
  types: [
    'ราคาตกลง',
    'สถานที่นัดรับ',
    'รายละเอียดสินค้า',
    'เงื่อนไขการขาย'
  ];
  position: 'top'; // แสดงด้านบนแชท
}
```

#### 6. Quick Reply
```typescript
interface QuickReply {
  buyer: [
    'สินค้ายังมีอยู่ไหมครับ?',
    'ราคานี้ลดได้อีกไหมครับ?',
    'สภาพสินค้าเป็นยังไงบ้างครับ?',
    'มีรูปเพิ่มเติมไหมครับ?',
    'ส่งของได้ไหมครับ? ค่าส่งเท่าไหร่?'
  ];
  seller: [
    'ยังมีครับ/ค่ะ สินค้าพร้อมส่งเลยครับ 😊',
    'ลดได้นิดหน่อยครับ/ค่ะ เสนอราคามาได้เลยครับ',
    'สภาพดีมากครับ/ค่ะ ใช้งานน้อย เก็บรักษาดี',
    'ส่งได้ครับ/ค่ะ ค่าส่งตามจริงนะครับ',
    'ขอบคุณมากครับ/ค่ะ จัดส่งให้เร็วที่สุดเลยนะครับ'
  ];
}
```

#### 7. ค้นหาข้อความ
```typescript
interface ChatSearch {
  searchBy: {
    keyword: true;
    date: true;
    sender: true;
    fileType: true;
  };
  filters: {
    dateRange: true;
    hasImage: true;
    hasFile: true;
    hasLocation: true;
  };
}
```

#### 8. Read Receipts
```typescript
interface ReadReceipt {
  states: {
    sent: '✓',      // ส่งแล้ว
    delivered: '✓✓', // ส่งถึงแล้ว
    read: '✓✓',     // อ่านแล้ว (สีน้ำเงิน)
  };
  showReadTime: true; // แสดงเวลาที่อ่าน
}
```

#### 9. Block / Report
```typescript
interface SafetyActions {
  block: {
    reason: [
      'สแปม',
      'มิจฉาชีพ',
      'ภาษาไม่สุภาพ',
      'ขายของผิดกฎหมาย'
    ];
    effect: 'ไม่สามารถส่งข้อความหาคุณได้อีก';
  };
  report: {
    types: [
      'มิจฉาชีพ',
      'สินค้าปลอม',
      'ขายของผิดกฎหมาย',
      'ภาพอนาจาร'
    ];
    action: 'ส่งให้ทีมตรวจสอบ';
  };
}
```

#### 10. แชร์สินค้าอื่นในร้าน
```typescript
interface ProductShare {
  scenario: 'สินค้าหมด แนะนำสินค้าอื่นแทน';
  ui: {
    showProductCard: true;
    showPrice: true;
    showImage: true;
    clickToView: true;
  };
}
```

---

### 🏪 **Seller Pro Features**

#### 1. Canned Messages (ข้อความสำเร็จรูป)
```typescript
interface CannedMessage {
  categories: {
    greeting: [
      'สวัสดีครับ/ค่ะ ยินดีให้บริการครับ 😊',
      'สวัสดีครับ/ค่ะ มีอะไรให้ช่วยไหมครับ'
    ];
    availability: [
      'ยังมีครับ/ค่ะ สินค้าพร้อมส่งเลยครับ',
      'ขออภัยครับ/ค่ะ สินค้าชิ้นนี้ขายไปแล้ว'
    ];
    pricing: [
      'ราคานี้เป็นราคาสุดท้ายแล้วครับ/ค่ะ',
      'ลดได้นิดหน่อยครับ/ค่ะ เสนอราคามาได้เลยครับ'
    ];
    shipping: [
      'ส่งได้ครับ/ค่ะ ส่งทาง Kerry/Flash ค่าส่งตามจริง',
      'นัดรับได้ครับ/ค่ะ อยู่แถว [สถานที่]'
    ];
    payment: [
      'รับชำระผ่าน โอนธนาคาร / พร้อมเพย์ / TrueMoney',
      'รับ COD ได้ครับ/ค่ะ แต่ต้องนัดรับหน้า'
    ];
    closing: [
      'ยินดีมากครับ/ค่ะ ขอบคุณที่เลือกซื้อนะครับ 🙏',
      'ขอบคุณมากครับ/ค่ะ จัดส่งให้เร็วที่สุดเลยนะครับ'
    ];
    followup: [
      'จัดส่งแล้วครับ/ค่ะ เลขพัสดุ [TRACKING]',
      'ได้รับสินค้าเรียบร้อยแล้วใช่ไหมครับ/ค่ะ'
    ];
    promotion: [
      'วันนี้มีโปรโมชั่นพิเศษครับ ลด 20%',
      'ซื้อ 2 ชิ้น ลดเพิ่ม 10%'
    ];
  };
  customizable: true;
  shortcuts: 'Ctrl + 1-9';
}
```

#### 2. AI Auto-Reply
```typescript
interface AutoReply {
  triggers: {
    'ยังมีไหม': {
      checkStock: true;
      reply: 'ยังมีครับ/ค่ะ สินค้าพร้อมส่งเลยครับ 😊';
    };
    'ราคาเท่าไหร่': {
      showPrice: true;
      reply: 'ราคา ฿[PRICE] ครับ/ค่ะ';
    };
    'ส่งได้ไหม': {
      reply: 'ส่งได้ครับ/ค่ะ ค่าส่งตามจริงนะครับ';
    };
    'เปิดกี่โมง': {
      showBusinessHours: true;
      reply: 'เปิดทุกวัน 9:00-18:00 ครับ/ค่ะ';
    };
  };
  settings: {
    autoReplyDelay: '2-5 seconds'; // ดูเหมือนคนจริง
    workingHours: true;
    offlineMessage: 'ขออภัยครับ ปิดทำการแล้ว เปิด 9:00 น. พรุ่งนี้';
  };
}
```

#### 3. Tag Customers
```typescript
interface CustomerTag {
  tags: [
    {
      name: 'ลูกค้าใหม่',
      color: '#3B82F6',
      icon: '🆕',
      autoTag: true
    },
    {
      name: 'ลูกค้าซ้ำ',
      color: '#10B981',
      icon: '⭐',
      autoTag: true
    },
    {
      name: 'รอชำระ',
      color: '#F59E0B',
      icon: '💰',
      autoTag: false
    },
    {
      name: 'รอส่ง',
      color: '#8B5CF6',
      icon: '📦',
      autoTag: false
    },
    {
      name: 'มีปัญหา',
      color: '#EF4444',
      icon: '⚠️',
      autoTag: false
    },
    {
      name: 'VIP',
      color: '#F97316',
      icon: '👑',
      autoTag: false
    }
  ];
  filters: {
    filterByTag: true;
    sortByTag: true;
  };
}
```

#### 4. Order Management in Chat
```typescript
interface OrderInChat {
  actions: [
    'สร้างออเดอร์',
    'ใส่เลขพัสดุ',
    'ส่งสลิป',
    'แจ้งเตือนลูกค้า'
  ];
  workflow: {
    createOrder: {
      autoFillProduct: true;
      autoFillPrice: true;
      addShipping: true;
      addDiscount: true;
    };
    updateTracking: {
      autoNotifyCustomer: true;
      showTrackingLink: true;
    };
    sendReceipt: {
      autoGenerate: true;
      sendToChatAndEmail: true;
    };
  };
}
```

#### 5. Multi-Agent Chat
```typescript
interface MultiAgent {
  features: {
    multipleAgentsCanReply: true;
    showAgentName: true;
    transferChat: true;
    internalNotes: true; // โน้ตภายในที่ลูกค้าไม่เห็น
  };
  permissions: {
    owner: ['all'];
    admin: ['reply', 'transfer', 'note'];
    agent: ['reply', 'note'];
  };
}
```

#### 6. Broadcast Messages
```typescript
interface Broadcast {
  targets: {
    allCustomers: true;
    byTag: true;
    byPurchaseHistory: true;
    byLastActive: true;
  };
  templates: [
    '🎉 โปรโมชั่นพิเศษ! ลด 30% ทุกรายการ',
    '📦 สินค้าใหม่เข้าแล้ว! มาดูกันเลย',
    '⚡ Flash Sale วันนี้! ลดสูงสุด 50%',
    '🎁 ลูกค้าเก่าได้ส่วนลด 20% พิเศษ'
  ];
  limits: {
    maxPerDay: 3;
    maxRecipients: 1000;
  };
  analytics: {
    sentCount: true;
    readCount: true;
    clickRate: true;
  };
}
```

---

### 🤖 **AI Features**

#### 1. AI Assist (ทุกผู้ใช้)
```typescript
interface AIAssist {
  features: {
    summarizeConversation: {
      prompt: 'สรุปการคุยนี้ให้หน่อย';
      output: 'สรุป: ลูกค้าสนใจ [สินค้า] ราคา [ราคา] นัดรับที่ [สถานที่] วันที่ [วันที่]';
    };
    suggestReplies: {
      count: 3;
      contextAware: true;
      examples: [
        'ยังมีครับ/ค่ะ สินค้าพร้อมส่งเลยครับ 😊',
        'ลดได้นิดหน่อยครับ/ค่ะ เสนอราคามาได้เลยครับ',
        'ส่งได้ครับ/ค่ะ ค่าส่งตามจริงนะครับ'
      ];
    };
    recommendPrice: {
      basedOn: ['market', 'condition', 'demand'];
      output: 'แนะนำราคา ฿[PRICE] (ตลาดอยู่ที่ ฿[MARKET_PRICE])';
    };
    extractMeetingDetails: {
      output: {
        location: 'หน้าเซเว่น สยาม',
        date: '15 ธ.ค. 2568',
        time: '14:00 น.',
        price: '฿3,500'
      };
    };
  };
}
```

#### 2. AI Auto-Reply (Seller Pro)
```typescript
interface AIAutoReply {
  intelligence: {
    understandIntent: true;
    contextAware: true;
    personalizedResponse: true;
  };
  scenarios: {
    productInquiry: {
      input: 'สินค้ายังมีไหมครับ?';
      checkStock: true;
      output: 'ยังมีครับ/ค่ะ [ชื่อสินค้า] พร้อมส่งเลยครับ 😊';
    };
    priceNegotiation: {
      input: 'ลดได้ไหมครับ?';
      checkMargin: true;
      output: 'ลดได้นิดหน่อยครับ/ค่ะ เสนอราคามาได้เลยครับ';
    };
    shippingInquiry: {
      input: 'ส่งได้ไหมครับ?';
      calculateShipping: true;
      output: 'ส่งได้ครับ/ค่ะ ค่าส่งประมาณ ฿[SHIPPING] ครับ';
    };
  };
}
```

#### 3. AI Safety Detection
```typescript
interface AISafety {
  scamDetection: {
    riskyPhrases: [
      'โอนมาก่อนนะ',
      'ส่งเลขบัญชี',
      'พรีออเดอร์ต้องจ่ายก่อน',
      'พี่ส่งรูปบัตรประชาชนให้หนูหน่อย',
      'ส่งเงินมาก่อน',
      'จ่ายล่วงหน้า 100%'
    ];
    action: {
      showWarning: true;
      message: '🚨 ข้อความนี้มีความเสี่ยงมิจฉาชีพ กรุณาระวัง';
      color: 'red';
    };
  };
  imageVerification: {
    detectFake: true;
    detectIllegal: [
      'โลโก้ปลอม',
      'อาวุธ',
      'สินค้าผิดกฎหมาย',
      'ละเมิดลิขสิทธิ์',
      'ภาพอนาจาร'
    ];
    action: {
      blockUpload: true;
      reportToAdmin: true;
    };
  };
}
```

#### 4. AI Price Negotiation (Enterprise)
```typescript
interface AIPriceNegotiation {
  strategy: {
    minPrice: 'ราคาต่ำสุดที่ยอมรับได้';
    maxDiscount: 'ส่วนลดสูงสุด';
    autoNegotiate: true;
  };
  flow: {
    step1: {
      buyer: 'ลดได้ไหมครับ?';
      ai: 'ราคานี้ดีที่สุดแล้วครับ แต่ถ้าซื้อวันนี้ลดให้ 5% ครับ';
    };
    step2: {
      buyer: '3,000 ได้ไหม?';
      ai: 'ขออภัยครับ 3,000 ต่ำไปหน่อย แต่ 3,200 ได้ครับ';
    };
    step3: {
      buyer: 'โอเค 3,200';
      ai: 'ยินดีมากครับ ราคา 3,200 บาท ยืนยันเลยนะครับ 🙏';
    };
  };
}
```

#### 5. AI Customer Segmentation (Enterprise)
```typescript
interface AISegmentation {
  segments: {
    hotLead: {
      criteria: 'ถามคำถามเยอะ, ตอบเร็ว, ต่อรองราคา';
      action: 'ให้ความสำคัญสูง, ตอบเร็ว, เสนอดีล';
    };
    warmLead: {
      criteria: 'สนใจ แต่ยังไม่ตัดสินใจ';
      action: 'ส่งข้อมูลเพิ่ม, ติดตาม';
    };
    coldLead: {
      criteria: 'ถามแล้วไม่ตอบ';
      action: 'ส่งข้อความติดตามอีกครั้ง';
    };
    repeatCustomer: {
      criteria: 'ซื้อแล้ว > 2 ครั้ง';
      action: 'ให้ส่วนลดพิเศษ, VIP treatment';
    };
  };
}
```

---

### 🛡️ **Security & Safety**

#### 1. Spam Detection
```typescript
interface SpamDetection {
  rules: {
    sameMessageRepeated: {
      limit: 3;
      timeWindow: '1 minute';
      action: 'block';
    };
    tooManyMessages: {
      limit: 10;
      timeWindow: '1 minute';
      action: 'rate limit';
    };
    suspiciousLinks: {
      detect: true;
      action: 'warn + block';
    };
  };
}
```

#### 2. Fraud Alert
```typescript
interface FraudAlert {
  triggers: [
    'ขอโอนเงินก่อน',
    'ส่งเลขบัญชี',
    'จ่ายล่วงหน้า',
    'พรีออเดอร์',
    'ส่งรูปบัตรประชาชน'
  ];
  action: {
    showWarning: '🚨 คำเตือน: ข้อความนี้มีความเสี่ยง';
    logToAdmin: true;
    educateUser: 'ไม่ควรโอนเงินก่อนได้รับสินค้า';
  };
}
```

#### 3. Rate Limiting
```typescript
interface RateLimit {
  limits: {
    messagesPerMinute: 10;
    imagesPerMinute: 5;
    filesPerMinute: 3;
  };
  action: 'block + show cooldown timer';
}
```

#### 4. Safe Meeting Point
```typescript
interface SafeMeetingPoint {
  aiSuggestions: [
    {
      type: 'ร้านสะดวกซื้อ',
      examples: ['7-Eleven', 'Family Mart'],
      safety: 'มีกล้องวงจรปิด, เปิด 24 ชม.',
      rating: 5
    },
    {
      type: 'ปั๊มน้ำมัน',
      examples: ['PTT', 'Shell', 'Bangchak'],
      safety: 'มีคนเยอะ, มีกล้อง',
      rating: 5
    },
    {
      type: 'ห้างสรรพสินค้า',
      examples: ['Central', 'The Mall', 'Terminal 21'],
      safety: 'มีรปภ., มีกล้องเยอะ',
      rating: 5
    },
    {
      type: 'สถานีรถไฟฟ้า',
      examples: ['BTS', 'MRT'],
      safety: 'มีรปภ., คนเยอะ',
      rating: 4
    }
  ];
  warnings: [
    '❌ ไม่ควรนัดที่บ้านส่วนตัว',
    '❌ ไม่ควรนัดที่ซอยเปลี่ยว',
    '❌ ไม่ควรนัดตอนดึก'
  ];
}
```

---

## 🎨 UI/UX Layout

### Desktop Layout (3 Columns)

```
┌─────────────────────────────────────────────────────────────────┐
│                         Header (Logo, Search, Profile)          │
├──────────────┬──────────────────────────┬───────────────────────┤
│              │                          │                       │
│  Chat List   │      Chat Screen         │   Product & Seller    │
│  (Left)      │      (Center)            │   Info (Right)        │
│              │                          │                       │
│ ┌──────────┐ │ ┌──────────────────────┐ │ ┌───────────────────┐ │
│ │ Search   │ │ │  Product Info Bar    │ │ │  Product Image    │ │
│ └──────────┘ │ └──────────────────────┘ │ │  & Details        │ │
│              │                          │ └───────────────────┘ │
│ ┌──────────┐ │ ┌──────────────────────┐ │                       │
│ │ Seller 1 │ │ │                      │ │ ┌───────────────────┐ │
│ │ 🟢 Online│ │ │   Chat Messages      │ │ │  Seller Trust     │ │
│ │ Trust 98%│ │ │   (Bubbles)          │ │ │  Score            │ │
│ │ 2 unread │ │ │                      │ │ │  ⭐ 98%           │ │
│ └──────────┘ │ │                      │ │ └───────────────────┘ │
│              │ │                      │ │                       │
│ ┌──────────┐ │ │                      │ │ ┌───────────────────┐ │
│ │ Seller 2 │ │ │                      │ │ │  Safety Warning   │ │
│ │ ⚪ Offline│ │ │                      │ │ │  ⚠️ คำเตือน      │ │
│ │ Trust 85%│ │ │                      │ │ └───────────────────┘ │
│ └──────────┘ │ └──────────────────────┘ │                       │
│              │                          │                       │
│ ┌──────────┐ │ ┌──────────────────────┐ │                       │
│ │ Seller 3 │ │ │  Quick Replies       │ │                       │
│ └──────────┘ │ │  [Reply1] [Reply2]   │ │                       │
│              │ └──────────────────────┘ │                       │
│              │                          │                       │
│              │ ┌──────────────────────┐ │                       │
│              │ │ [AI] [📷] [📁] [📍] │ │                       │
│              │ │ Type a message...    │ │                       │
│              │ └──────────────────────┘ │                       │
└──────────────┴──────────────────────────┴───────────────────────┘
```

### Mobile Layout (Single Column)

```
┌─────────────────────────────┐
│  Header                     │
├─────────────────────────────┤
│                             │
│  Chat List View             │
│  (or)                       │
│  Chat Screen View           │
│  (or)                       │
│  Product Info View          │
│                             │
│  (Switch with tabs)         │
│                             │
└─────────────────────────────┘
```

---

### Component Breakdown

#### 1. **Left Column - Chat List**

```typescript
interface ChatListItem {
  avatar: string;
  name: string;
  isOnline: boolean;
  trustScore: number;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  productImage?: string;
  tags?: string[]; // Pro only
}
```

**Features:**
- ✅ Search chats
- ✅ Filter by: All, Unread, Seller Pro, Tagged
- ✅ Sort by: Recent, Unread, Trust Score
- ✅ Show online status (🟢/⚪)
- ✅ Show trust score badge
- ✅ Show product thumbnail

---

#### 2. **Center Column - Chat Screen**

**Top Bar:**
```typescript
interface ChatHeader {
  sellerName: string;
  sellerAvatar: string;
  isOnline: boolean;
  trustScore: number;
  actions: ['Call', 'Video', 'More'];
}
```

**Product Info Bar:**
```typescript
interface ProductBar {
  productImage: string;
  productName: string;
  productPrice: number;
  viewProductLink: string;
}
```

**Messages Area:**
```typescript
interface MessageBubble {
  type: 'text' | 'image' | 'file' | 'location' | 'product';
  sender: 'me' | 'other';
  content: string;
  timestamp: Date;
  status: 'sent' | 'delivered' | 'read';
  isPinned?: boolean;
}
```

**Quick Replies:**
```typescript
interface QuickReplyBar {
  replies: string[];
  maxVisible: 5;
  scrollable: true;
}
```

**AI Assist Button:**
```typescript
interface AIAssistButton {
  icon: '✨';
  color: 'purple';
  menu: [
    'สรุปการคุย',
    'แนะนำคำตอบ (3 ตัวเลือก)',
    'แนะนำราคา',
    'สรุปเงื่อนไขนัดรับ'
  ];
}
```

**Input Area:**
```typescript
interface ChatInput {
  placeholder: 'Type a message...';
  buttons: [
    { icon: '✨', label: 'AI Assist' },
    { icon: '📷', label: 'Image' },
    { icon: '📁', label: 'File' },
    { icon: '📍', label: 'Location' },
    { icon: '➤', label: 'Send' }
  ];
}
```

---

#### 3. **Right Column - Product & Seller Info**

**Product Details:**
```typescript
interface ProductDetails {
  images: string[];
  name: string;
  price: number;
  condition: string;
  warranty?: string;
  included?: string[];
  description: string;
}
```

**Seller Trust:**
```typescript
interface SellerTrust {
  trustScore: number; // 0-100
  badge: 'Verified Seller' | 'Pro Seller' | null;
  stats: {
    totalSales: number;
    responseTime: string;
    responseRate: string;
  };
  reviews: {
    rating: number;
    count: number;
  };
}
```

**Safety Warning:**
```typescript
interface SafetyWarning {
  level: 'info' | 'warning' | 'danger';
  message: string;
  tips: string[];
  visible: boolean;
}
```

**Example:**
```
⚠️ คำเตือนความปลอดภัย

เคล็ดลับการซื้อขายปลอดภัย:
✅ ตรวจสอบสินค้าก่อนชำระเงิน
✅ นัดรับที่สถานที่สาธารณะ
✅ ไม่โอนเงินก่อนได้รับสินค้า
❌ ระวังผู้ขายที่ขอโอนเงินล่วงหน้า
```

---

## 💾 Database Schema

### Collections

#### 1. **conversations**
```typescript
interface Conversation {
  id: string;
  participants: string[]; // [buyerId, sellerId]
  participantNames: {
    [userId: string]: string;
  };
  participantAvatars: {
    [userId: string]: string;
  };
  participantTrustScores: {
    [userId: string]: number;
  };
  productId?: string;
  productTitle?: string;
  productPrice?: number;
  productImage?: string;
  lastMessage: string;
  lastMessageAt: Timestamp;
  lastSenderId: string;
  unreadCount: {
    [userId: string]: number;
  };
  tags?: string[]; // Pro only
  assignedAgent?: string; // Pro only
  status: 'active' | 'archived' | 'blocked';
  pinnedMessages?: string[]; // Message IDs
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

#### 2. **messages**
```typescript
interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  type: 'text' | 'image' | 'file' | 'location' | 'product' | 'system';
  content: string;
  images?: {
    url: string;
    thumbnail: string;
    size: number;
  }[];
  file?: {
    url: string;
    name: string;
    type: string;
    size: number;
  };
  location?: {
    lat: number;
    lng: number;
    address: string;
  };
  productShare?: {
    productId: string;
    productName: string;
    productPrice: number;
    productImage: string;
  };
  isRead: boolean;
  readAt?: Timestamp;
  isPinned: boolean;
  aiGenerated: boolean; // ถ้าเป็นข้อความจาก AI
  createdAt: Timestamp;
}
```

#### 3. **canned_messages** (Pro only)
```typescript
interface CannedMessage {
  id: string;
  sellerId: string;
  category: string;
  text: string;
  shortcut?: string; // e.g., "/greeting"
  usageCount: number;
  createdAt: Timestamp;
}
```

#### 4. **customer_tags** (Pro only)
```typescript
interface CustomerTag {
  id: string;
  sellerId: string;
  customerId: string;
  conversationId: string;
  tags: string[];
  notes?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

#### 5. **broadcast_messages** (Pro only)
```typescript
interface BroadcastMessage {
  id: string;
  sellerId: string;
  message: string;
  targetTags?: string[];
  targetCustomerIds?: string[];
  sentCount: number;
  readCount: number;
  clickCount: number;
  createdAt: Timestamp;
}
```

#### 6. **safety_reports**
```typescript
interface SafetyReport {
  id: string;
  reporterId: string;
  reportedUserId: string;
  conversationId: string;
  messageId?: string;
  type: 'scam' | 'fake_product' | 'illegal' | 'inappropriate';
  reason: string;
  evidence?: string[];
  status: 'pending' | 'reviewed' | 'resolved';
  createdAt: Timestamp;
}
```

---

## 🚀 Implementation Roadmap

### **Phase 1: Core Chat** (Week 1-2) ✅ DONE

- [x] Real-time messaging
- [x] Conversation list
- [x] Unread count
- [x] Mark as read
- [x] Product context
- [x] Auto-create chat
- [x] Read receipts
- [x] Basic AI suggestions

### **Phase 2: Enhanced Features** (Week 3-4)

- [ ] Image upload (1-5 images)
- [ ] Image preview & compress
- [ ] File upload (PDF, DOC)
- [ ] Location sharing
- [ ] Pin messages
- [ ] Search messages
- [ ] Block/Report
- [ ] Share products in chat

### **Phase 3: Seller Pro** (Week 5-6)

- [ ] Canned messages
- [ ] Customer tags
- [ ] AI auto-reply
- [ ] Order management in chat
- [ ] Multi-agent chat
- [ ] Broadcast messages
- [ ] Analytics dashboard

### **Phase 4: AI & Safety** (Week 7-8)

- [ ] AI full auto-reply
- [ ] AI price negotiation
- [ ] Scam detection
- [ ] Image verification
- [ ] Safe meeting point suggestions
- [ ] Customer segmentation
- [ ] Sales analytics

### **Phase 5: Enterprise** (Week 9-10)

- [ ] Multi-language support
- [ ] Advanced analytics
- [ ] API for integrations
- [ ] Webhook support
- [ ] Custom branding (for Official Stores)
- [ ] Dedicated account manager

---

## 📊 Success Metrics

### User Engagement
- **Response Rate:** > 80%
- **Response Time:** < 5 minutes
- **Conversation Completion:** > 60%

### Safety
- **Scam Detection Accuracy:** > 90%
- **False Positive Rate:** < 5%
- **User Reports:** < 1% of conversations

### Business
- **Conversion Rate:** > 30% (chat → sale)
- **Seller Pro Adoption:** > 20% of active sellers
- **AI Auto-Reply Usage:** > 50% of Pro sellers

---

## 🎯 Next Steps

1. **Review this spec** with the team
2. **Prioritize features** based on user needs
3. **Start Phase 2 implementation**
4. **Design UI mockups** for new features
5. **Set up analytics** to track metrics

---

**Created by:** Antigravity AI  
**Date:** 10 ธันวาคม 2568  
**Version:** 2.0 (Complete Spec)
