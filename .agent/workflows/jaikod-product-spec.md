---
description: JaiKod.com - AI-Native Hybrid Marketplace Product Specification
---

# 🎯 JaiKod.com - Product Specification & Design Document

## 📌 Brand Identity

**Name:** JaiKod (ใจโค้ด)
- **ใจ (Jai)** = Heart, Care, Attention
- **โค้ด (Code)** = Technology, Digital, Modern

**Tagline:** "ขายง่าย ซื้อใจ ด้วยพลัง AI" (Sell Easy, Buy with Confidence, Powered by AI)

**Brand Personality:**
- 🎨 Modern & Minimalist
- 🤖 AI-Native & Intelligent
- 💜 Trustworthy & Caring
- ⚡ Fast & Frictionless
- 🌈 Playful & Gen-Z Friendly

---

## 🚀 5 Killer Features (AI-Powered)

### 1. 📸 Snap & Sell (AI Image Recognition)
**Inspired by:** Carousell, Mercari, OfferUp

**Pain Point:** ผู้ขายขี้เกียจกรอกข้อมูล ลงขายยาก ใช้เวลานาน

**Solution:**
- ถ่ายรูปสินค้า 1-5 ภาพ
- AI วิเคราะห์รูปภาพทันที:
  - ✅ ชื่อสินค้า (Product Title)
  - ✅ หมวดหมู่ (Category)
  - ✅ แบรนด์ (Brand)
  - ✅ สภาพสินค้า (Condition: New/Like New/Good/Fair)
  - ✅ คำอธิบาย (Auto-generated Description)
- ผู้ขายแค่ตรวจสอบและแก้ไขเล็กน้อย
- **ลงขายเสร็จภายใน 30 วินาที**

**Tech Stack:**
- Google Vision API / Azure Computer Vision
- Custom ML Model trained on Thai marketplace data
- Image Classification + Object Detection

**UX Flow:**
```
1. กดปุ่ม "ลงขายด่วน"
2. เปิดกล้อง/เลือกรูป
3. AI วิเคราะห์ (2-3 วินาที)
4. แสดงข้อมูลที่ AI เติมให้
5. ผู้ใช้ตรวจสอบ/แก้ไข
6. ตั้งราคา (มี AI Suggestion)
7. เผยแพร่ทันที
```

---

### 2. 💰 AI Price Suggestion (Smart Pricing)
**Inspired by:** eBay, Mercari, StockX

**Pain Point:** ผู้ขายไม่รู้ว่าควรตั้งราคาเท่าไหร่ ตั้งแพงเกินไปก็ขายไม่ออก ตั้งถูกเกินไปก็เสียเปรียบ

**Solution:**
- AI วิเคราะห์ข้อมูลตลาดแบบ Real-time:
  - ราคาสินค้าเดียวกันที่ขายไปแล้ว
  - ราคาสินค้าที่กำลังขายอยู่
  - สภาพสินค้า
  - ความต้องการในตลาด (Demand Score)
  - ฤดูกาล/เทรนด์
- แนะนำช่วงราคา: "ราคาแนะนำ: 500-700 บาท"
- แสดง Confidence Score: "สินค้าในสภาพนี้มักขายได้ที่ 600 บาท (90% แม่นยำ)"
- เปรียบเทียบกับราคาตลาด: "ถูกกว่าตลาด 15%"

**Data Sources:**
- Historical sales data
- Current listings
- External market data (Shopee, Lazada price comparison)
- Seasonal trends

**Display:**
```
┌─────────────────────────────────────┐
│ 💡 AI แนะนำราคา                     │
├─────────────────────────────────────┤
│ ราคาแนะนำ: 500-700 บาท             │
│ ราคาเฉลี่ย: 600 บาท                │
│ ขายเร็วที่: 550 บาท (ภายใน 3 วัน)  │
│ ราคาสูงสุด: 750 บาท                │
│                                     │
│ [ใช้ราคาแนะนำ] [กำหนดเอง]          │
└─────────────────────────────────────┘
```

---

### 3. 🛡️ AI Trust & Safety (Scam Detection)
**Inspired by:** Vestiaire Collective, Grailed, Facebook Marketplace

**Pain Point:** กลัวโดนโกง กลัวของปลอม ไม่กล้าซื้อของมูลค่าสูง

**Solution:**

**A. AI Scammer Detection**
- วิเคราะห์พฤติกรรมผู้ใช้:
  - ✅ ประวัติการซื้อขาย
  - ✅ รูปแบบการแชท (ใช้คำหลอกลวงหรือไม่)
  - ✅ ความเร็วในการตอบกลับ
  - ✅ จำนวนบัญชีที่ถูกรายงาน
  - ✅ IP Address / Device Fingerprinting
- แจ้งเตือนแบบ Real-time: "⚠️ ผู้ใช้รายนี้มีพฤติกรรมที่น่าสงสัย"

**B. JaiKod Verified Badge**
- ระบบยืนยันตัวตนแบบ E-KYC:
  - ✅ เชื่อมต่อกับ National ID API
  - ✅ Face Recognition
  - ✅ Phone Number Verification
  - ✅ Bank Account Verification
- ระดับความน่าเชื่อถือ:
  - 🥉 Bronze: Phone verified
  - 🥈 Silver: ID verified
  - 🥇 Gold: Bank + 10+ successful sales
  - 💎 Diamond: Power seller (100+ sales, 4.8+ rating)

**C. AI Image Authenticity Check**
- ตรวจจับรูปที่ถูกขโมยจากเว็บอื่น (Reverse Image Search)
- ตรวจจับรูปที่ถูกแก้ไขมากเกินไป (Photoshop Detection)
- เตือนผู้ซื้อ: "⚠️ รูปนี้พบในเว็บไซต์อื่น กรุณาขอรูปจริงจากผู้ขาย"

---

### 4. 🔍 Semantic Search (ค้นหาแบบเข้าใจบริบท)
**Inspired by:** Pinterest, Google Lens, Depop

**Pain Point:** ค้นหายาก พิมพ์ผิดก็หาไม่เจอ ไม่รู้จะพิมพ์คำว่าอะไร

**Solution:**

**A. Natural Language Search**
- ค้นหาด้วยประโยคธรรมดา:
  - "ชุดใส่ไปงานแต่ง ธีมสีชมพู"
  - "กล้องถ่ายรูปราคาไม่เกิน 5000"
  - "รองเท้าผ้าใบ Nike มือสอง สภาพดี"
- AI เข้าใจความหมาย ไม่ต้องมีคำว่า "งานแต่ง" ในชื่อสินค้าก็ได้

**B. Visual Search (ค้นหาด้วยรูปภาพ)**
- ถ่ายรูปสินค้าที่เห็น → ค้นหาสินค้าคล้ายๆ ใน JaiKod
- อัปโหลดรูป screenshot → หาสินค้าเดียวกัน

**C. Smart Filters**
- AI แนะนำ Filter ที่เกี่ยวข้อง:
  - ค้นหา "iPhone" → แนะนำ: "iPhone 13, iPhone 14, iPhone 15"
  - ค้นหา "กล้อง" → แนะนำ: "Canon, Nikon, Sony, Fujifilm"

**D. Typo Tolerance**
- พิมพ์ผิดก็หาเจอ:
  - "ไอโฟน" → iPhone
  - "กล้องถ่ายรุป" → กล้องถ่ายรูป

---

### 5. 🤝 Seamless Transaction (ซื้อขายง่าย ไม่ต้องคุยเยอะ)
**Inspired by:** Shopee, Mercari, Vinted

**Pain Point:** ทักแชทแล้วเงียบ ต่อรองราคายาก ไม่รู้ค่าส่ง

**Solution:**

**A. Quick Offer System**
- ปุ่ม "เสนอราคา" (Make Offer)
- ผู้ซื้อเสนอราคา → ผู้ขายกด Accept/Decline/Counter
- ไม่ต้องพิมพ์แชทยาวๆ

**B. Instant Shipping Calculator**
- เชื่อมต่อ API ขนส่ง (Kerry, Flash, Thailand Post)
- คำนวณค่าส่งทันทีตามระยะทาง
- แสดงตัวเลือก:
  ```
  📦 Kerry Express: 45 บาท (1-2 วัน)
  📦 Flash Express: 35 บาท (2-3 วัน)
  📦 ไปรษณีย์: 25 บาท (3-5 วัน)
  ```

**C. In-App Payment (ชำระเงินในแอป)**
- รองรับ:
  - 💳 บัตรเครดิต/เดบิต
  - 🏦 Mobile Banking
  - 💰 TrueMoney Wallet
  - 📱 PromptPay
- ระบบ Escrow: เงินจะถูกโอนให้ผู้ขายหลังผู้ซื้อได้รับสินค้าแล้ว

**D. AI Chat Assistant**
- ตอบคำถามทั่วไป:
  - "สินค้ายังมีอยู่ไหม?"
  - "ส่งฟรีไหม?"
  - "ลดได้ไหม?"
- ผู้ขายสามารถตั้งค่า Auto-reply ได้

---

## 🗺️ Sitemap Structure

```
JaiKod.com
│
├── 🏠 Home (/)
│   ├── Hero Section (AI-powered search bar)
│   ├── Featured Categories
│   ├── Trending Items (AI-curated)
│   ├── New Arrivals
│   ├── Success Stories
│   └── Trust Badges
│
├── 🔍 Search & Browse
│   ├── /search (Search Results)
│   ├── /categories (All Categories)
│   ├── /category/[slug] (Category Page)
│   └── /trending (Trending Items)
│
├── 📦 Product
│   ├── /product/[id] (Product Detail)
│   ├── /product/[id]/offer (Make Offer)
│   └── /product/[id]/report (Report Listing)
│
├── 🛍️ Selling
│   ├── /sell (Snap & Sell - Main Upload)
│   ├── /sell/draft (Draft Listings)
│   └── /sell/success (Listing Published)
│
├── 👤 User Profile
│   ├── /profile/[username] (Public Profile)
│   ├── /profile/[username]/reviews (Reviews)
│   └── /profile/[username]/listings (All Listings)
│
├── ⚙️ Dashboard (Logged-in Users)
│   ├── /dashboard (Overview)
│   ├── /dashboard/selling (My Listings)
│   ├── /dashboard/buying (My Purchases)
│   ├── /dashboard/offers (Offers Received/Sent)
│   ├── /dashboard/messages (Chat Inbox)
│   ├── /dashboard/favorites (Saved Items)
│   ├── /dashboard/settings (Account Settings)
│   └── /dashboard/verification (Get Verified)
│
├── 💬 Messaging
│   ├── /messages (Inbox)
│   └── /messages/[conversationId] (Chat Thread)
│
├── 🔐 Authentication
│   ├── /login
│   ├── /register
│   ├── /forgot-password
│   └── /verify-email
│
├── ℹ️ Information
│   ├── /about (About JaiKod)
│   ├── /how-it-works (How to Buy/Sell)
│   ├── /safety-tips (Safety & Trust)
│   ├── /pricing (Fees & Pricing)
│   ├── /faq
│   ├── /terms
│   └── /privacy
│
└── 🤖 AI Features (Showcase)
    ├── /ai/snap-and-sell (Demo)
    ├── /ai/price-suggestion (Demo)
    └── /ai/trust-score (How it works)
```

---

## 🤖 AI Capabilities - Technical Implementation

### 1. AI Image Recognition (Snap & Sell)

**Models Used:**
- **Primary:** Google Cloud Vision API
- **Backup:** Azure Computer Vision
- **Custom Model:** Fine-tuned ResNet-50 on Thai marketplace data

**Process Flow:**
```
User uploads image(s)
    ↓
Image preprocessing (resize, normalize)
    ↓
Multi-model analysis:
    ├── Object Detection (what is it?)
    ├── Text Recognition (brand, model)
    ├── Scene Understanding (context)
    └── Condition Assessment (new/used)
    ↓
Combine results with confidence scores
    ↓
Generate structured data:
    ├── Title
    ├── Category
    ├── Brand
    ├── Condition
    └── Description
    ↓
Return to user for review
```

**Training Data:**
- 500K+ Thai marketplace listings
- 50K+ manually labeled images
- Continuous learning from user corrections

---

### 2. AI Price Suggestion

**Algorithm:**
- **Model:** Gradient Boosting (XGBoost)
- **Features:**
  - Product category
  - Brand
  - Condition
  - Age/Release date
  - Market demand (search volume)
  - Seasonal factors
  - Location
  - Seller reputation
  - Historical sales data

**Data Pipeline:**
```
Collect data:
    ├── Internal sales history
    ├── Current active listings
    ├── External market data (web scraping)
    └── Search trends
    ↓
Feature engineering
    ↓
Model training (daily updates)
    ↓
Price prediction with confidence interval
    ↓
A/B testing (track conversion rates)
```

**Output:**
- Recommended price range
- Expected time to sell
- Comparison with market
- Dynamic pricing suggestions

---

### 3. AI Trust & Safety

**A. Scam Detection Model**
- **Type:** Anomaly Detection + Classification
- **Features:**
  - User behavior patterns
  - Chat message analysis (NLP)
  - Transaction history
  - Device fingerprinting
  - IP reputation
  - Image authenticity
  - Response time patterns

**B. Real-time Monitoring:**
```
User action (listing, message, transaction)
    ↓
Risk scoring (0-100)
    ↓
If score > 70: Flag for review
If score > 85: Auto-suspend + notify user
If score < 40: Allow
    ↓
Human review (for flagged cases)
    ↓
Update model with feedback
```

**C. Image Verification:**
- Reverse image search (Google, TinEye)
- EXIF data analysis
- Photoshop detection (Error Level Analysis)
- Duplicate detection across platform

---

### 4. Semantic Search

**Technology Stack:**
- **Search Engine:** Elasticsearch + Vector Search
- **Embeddings:** Sentence-BERT (multilingual)
- **NLP:** spaCy (Thai language support)

**Search Pipeline:**
```
User query (text or image)
    ↓
Query understanding:
    ├── Intent classification
    ├── Entity extraction
    ├── Typo correction
    └── Query expansion
    ↓
Generate query embedding
    ↓
Vector similarity search + Keyword matching
    ↓
Ranking (ML-based):
    ├── Relevance score
    ├── Seller reputation
    ├── Price competitiveness
    ├── Listing quality
    └── Recency
    ↓
Return ranked results
```

**Visual Search:**
- Extract image features (ResNet embeddings)
- Compare with product image database
- Return visually similar items

---

### 5. AI Chat Assistant

**Technology:**
- **LLM:** GPT-4 Turbo (via Azure OpenAI)
- **Fallback:** Claude 3 Haiku
- **Local Model:** Llama 3 (for simple queries)

**Capabilities:**
- Answer FAQs
- Suggest responses to sellers
- Detect inappropriate messages
- Auto-translate (Thai ↔ English)
- Sentiment analysis

**Context Awareness:**
```
Chat message
    ↓
Load context:
    ├── Product details
    ├── Conversation history
    ├── User profiles
    └── Platform policies
    ↓
Generate response
    ↓
Safety check (filter harmful content)
    ↓
Send to user
```

---

## 🎨 UI Mood & Tone Description

### Visual Identity

**Color Palette:**

**Primary Colors:**
- **Neon Purple:** `#8B5CF6` (Main brand color - modern, tech-forward)
- **Coral Orange:** `#FF6B6B` (Accent - energetic, friendly)
- **Electric Blue:** `#3B82F6` (Trust, reliability)

**Neutral Colors:**
- **Background (Light Mode):** `#FAFAFA` (Off-white, easy on eyes)
- **Background (Dark Mode):** `#1A1A1A` (Deep charcoal)
- **Text Primary:** `#1F2937` (Almost black)
- **Text Secondary:** `#6B7280` (Gray)

**Semantic Colors:**
- **Success:** `#10B981` (Green)
- **Warning:** `#F59E0B` (Amber)
- **Error:** `#EF4444` (Red)
- **Info:** `#3B82F6` (Blue)

---

### Typography

**Font Stack:**
```css
--font-primary: 'Sarabun', 'Noto Sans Thai', -apple-system, BlinkMacSystemFont, sans-serif;
--font-display: 'Prompt', 'Sarabun', sans-serif;
--font-mono: 'JetBrains Mono', 'Courier New', monospace;
```

**Type Scale:**
- **H1 (Hero):** 48px / 3rem (Bold)
- **H2 (Section):** 36px / 2.25rem (SemiBold)
- **H3 (Card Title):** 24px / 1.5rem (SemiBold)
- **Body:** 16px / 1rem (Regular)
- **Small:** 14px / 0.875rem (Regular)
- **Tiny:** 12px / 0.75rem (Medium)

---

### Layout Principles

**1. Mobile-First Design**
- Breakpoints:
  - Mobile: 320px - 640px
  - Tablet: 641px - 1024px
  - Desktop: 1025px+
- Touch-friendly (min 44px tap targets)
- Bottom navigation on mobile

**2. Masonry Grid (Pinterest-style)**
```
┌──────┬──────┬──────┐
│      │  2   │      │
│  1   ├──────┤  3   │
│      │  4   │      │
├──────┴──────┼──────┤
│      5      │  6   │
└─────────────┴──────┘
```
- Dynamic heights based on image aspect ratio
- Infinite scroll
- Lazy loading

**3. Card Design**
- Rounded corners (12px)
- Subtle shadow: `0 2px 8px rgba(0,0,0,0.08)`
- Hover effect: Lift + shadow increase
- Smooth transitions (200ms ease-out)

---

### Micro-interactions

**1. Button States:**
```
Default → Hover → Active → Success
  ↓        ↓        ↓        ↓
Scale   Scale    Scale    ✓ Icon
1.0     1.02     0.98     + Color
```

**2. Loading States:**
- Skeleton screens (not spinners)
- Shimmer effect
- Progressive image loading (blur-up)

**3. Animations:**
- Fade in on scroll (Intersection Observer)
- Stagger animations for lists
- Spring physics for modals
- Smooth page transitions

---

### Component Style Guide

**Product Card:**
```
┌─────────────────────┐
│                     │
│   [Product Image]   │ ← Rounded corners, hover zoom
│                     │
├─────────────────────┤
│ Product Title       │ ← 2 lines max, ellipsis
│ ฿ 1,500             │ ← Bold, large
│ 👤 Seller Name      │ ← Small, gray
│ 📍 Bangkok          │
│ [❤️ 24] [💬 5]     │ ← Engagement metrics
└─────────────────────┘
```

**Search Bar (Hero):**
```
┌──────────────────────────────────────┐
│ 🔍  ค้นหาสินค้า หรือถ่ายรูปเพื่อค้นหา │ ← Large, prominent
│                              📷  🎤   │ ← Visual/Voice search
└──────────────────────────────────────┘
```

**Trust Badge:**
```
┌──────────────────┐
│ ✓ JaiKod Verified│ ← Gradient background
│ 4.9 ⭐ (127)     │ ← Rating
└──────────────────┘
```

---

### Tone of Voice

**Brand Voice:**
- 😊 **Friendly:** ใช้ภาษาเป็นกันเอง ไม่เป็นทางการจนเกินไป
- 🎯 **Clear:** สื่อสารตรงประเด็น ไม่วกวน
- 💪 **Confident:** มั่นใจในเทคโนโลยี AI
- 🤝 **Supportive:** ช่วยเหลือผู้ใช้ตลอดเวลา

**Example Copy:**

❌ **Old (Formal):**
"กรุณาอัปโหลดรูปภาพสินค้าของท่านเพื่อดำเนินการต่อ"

✅ **New (JaiKod Style):**
"ถ่ายรูปสินค้าสักรูป เราช่วยเติมรายละเอียดให้! 📸"

---

❌ **Old:**
"ระบบได้ทำการวิเคราะห์ราคาตลาดเรียบร้อยแล้ว"

✅ **New:**
"AI แนะนำว่าราคา 600 บาท น่าจะขายได้ไวนะ! 💡"

---

### Accessibility

- **WCAG 2.1 AA Compliance**
- Contrast ratio ≥ 4.5:1
- Keyboard navigation
- Screen reader support
- Alt text for all images
- Focus indicators

---

### Dark Mode

**Auto-switch based on:**
- System preference
- Time of day (6 PM - 6 AM)
- User preference (saved)

**Dark Mode Palette:**
- Background: `#1A1A1A`
- Surface: `#2D2D2D`
- Text: `#E5E5E5`
- Accent colors: Slightly desaturated versions

---

## 📱 Mobile-First Features

### Bottom Navigation (Mobile)
```
┌─────┬─────┬─────┬─────┬─────┐
│ 🏠  │ 🔍  │  +  │ 💬  │ 👤  │
│Home │Search│Sell │Chat │ Me  │
└─────┴─────┴─────┴─────┴─────┘
```

### Quick Actions (Floating Button)
- Tap to expand:
  - 📸 Snap & Sell
  - 🔍 Visual Search
  - 💬 Chat Support

### Gestures
- Swipe left: Add to favorites
- Swipe right: Share
- Pull to refresh
- Pinch to zoom (product images)

---

## 🎯 Success Metrics (KPIs)

**User Acquisition:**
- Monthly Active Users (MAU)
- New registrations
- App downloads

**Engagement:**
- Listing creation rate
- Search queries per session
- Time spent on platform
- Chat messages sent

**Transaction:**
- Gross Merchandise Value (GMV)
- Conversion rate (view → purchase)
- Average order value
- Repeat purchase rate

**AI Performance:**
- Snap & Sell accuracy (% of fields correctly filled)
- Price suggestion acceptance rate
- Scam detection precision/recall
- Search relevance (click-through rate)

**Trust:**
- Verification rate
- Dispute rate
- User satisfaction score (NPS)

---

## 🚀 Implementation Phases

### Phase 1: MVP (Month 1-2)
- ✅ Basic listing creation (manual)
- ✅ Search & browse
- ✅ User profiles
- ✅ Chat messaging
- ✅ Basic payment integration

### Phase 2: AI Core (Month 3-4)
- 🤖 Snap & Sell (AI image recognition)
- 💰 AI Price Suggestion
- 🔍 Semantic search

### Phase 3: Trust & Safety (Month 5-6)
- 🛡️ Scam detection
- ✓ Verification system
- 🖼️ Image authenticity check

### Phase 4: Optimization (Month 7-8)
- ⚡ Performance optimization
- 📊 Analytics & insights
- 🎨 UI/UX refinements
- 🌐 SEO optimization

### Phase 5: Scale (Month 9-12)
- 🚀 Marketing campaigns
- 🤝 Partnerships
- 📱 Mobile app (iOS/Android)
- 🌏 Regional expansion

---

## 🎨 Design References

**Inspiration:**
- **Carousell:** Clean product cards, simple listing flow
- **Depop:** Gen-Z aesthetic, social features
- **Mercari:** AI-powered features, trust badges
- **Vinted:** Sustainability focus, community feel
- **OfferUp:** Local marketplace, safety features

**Thai Market Adaptation:**
- Support Thai language (primary)
- Thai payment methods (PromptPay, TrueMoney)
- Thai shipping providers (Kerry, Flash, Thailand Post)
- Thai address format (ตำบล, อำเภอ, จังหวัด, รหัสไปรษณีย์)
- Cultural preferences (bargaining culture)

---

## 💡 Unique Selling Points (USPs)

1. **AI-Native:** ไม่ใช่แค่เพิ่ม AI เข้าไป แต่สร้างจาก AI ตั้งแต่ต้น
2. **30-Second Listing:** ลงขายเร็วที่สุดในตลาด
3. **Smart Pricing:** ไม่ต้องเดาราคา AI บอกให้
4. **Trust First:** ระบบความปลอดภัยที่ดีที่สุด
5. **Thai-Optimized:** ออกแบบมาสำหรับคนไทยโดยเฉพาะ

---

**Document Version:** 1.0  
**Last Updated:** 2025-12-06  
**Status:** Ready for Implementation 🚀
