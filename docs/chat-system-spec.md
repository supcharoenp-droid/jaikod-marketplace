# JaiKod Enhanced Chat System - Technical Specification

## 📋 Overview

ระบบแชทอัจฉริยะสำหรับ Marketplace ที่รองรับ real-time messaging พร้อม AI assistant เพื่อช่วยเพิ่มประสิทธิภาพการสื่อสารและปิดการขาย

## 🎯 Goals & KPIs

### Primary Goals
- ลด friction ในการสื่อสาร
- เพิ่มอัตราการตอบกลับ (Response Rate)
- ช่วยให้การปิดการขายเร็วขึ้น
- ป้องกันการหลอกลวง (Scam Prevention)

### Target KPIs
- **Response Time**: ลดลง 50% (จาก AI suggestions)
- **Conversion Rate**: เพิ่มขึ้น 30%
- **AI Suggestion Usage**: 60% ของ sellers ใช้งาน
- **Fraud Reduction**: ลดลง 70%

## 🏗️ System Architecture

### Tech Stack
- **Frontend**: React, TypeScript, Tailwind CSS, Framer Motion
- **Backend**: Firebase Firestore (Real-time Database)
- **AI/ML**: Rule-based NLP + Intent Detection
- **State Management**: React Hooks

### Core Components

```
src/
├── lib/
│   ├── chat.ts                    # Chat CRUD operations
│   ├── ai-chat-assistant.ts       # AI features
│   └── firebase.ts                # Firebase config
├── components/
│   └── chat/
│       └── EnhancedChatSystem.tsx # Main chat UI
└── app/
    └── chat/
        └── page.tsx               # Chat page
```

## 📊 Data Model

### Collections

#### 1. `conversations`
```typescript
{
  id: string
  participants: string[]                    // [userId1, userId2]
  participantNames: { [userId]: string }
  participantAvatars: { [userId]: string }
  lastMessage: string
  lastMessageAt: Timestamp
  lastSenderId: string
  productId?: string                        // Context: product being discussed
  productTitle?: string
  productImage?: string
  unreadCount: { [userId]: number }
  createdAt: Timestamp
}
```

#### 2. `messages`
```typescript
{
  id: string
  conversationId: string
  senderId: string
  senderName: string
  text: string
  imageUrl?: string
  productId?: string
  productTitle?: string
  productImage?: string
  isRead: boolean
  createdAt: Timestamp
  
  // AI Analysis (optional, stored separately)
  intent?: 'buy_intent' | 'negotiate' | 'info_request' | 'meeting_request' | 'scam_suspect'
  riskLevel?: 'safe' | 'warning' | 'danger'
  riskReasons?: string[]
}
```

## 🤖 AI Features Implementation

### 1. Intent Detection

**Algorithm**: Keyword-based classification

**Intents**:
- `buy_intent`: ซื้อ, จอง, เอา, สั่ง, โอน
- `negotiate`: ลด, ต่อรอง, ถูก, แพง, ราคา
- `info_request`: สภาพ, รายละเอียด, ข้อมูล, สเปค
- `meeting_request`: นัด, พบ, เจอ, ดู, ที่ไหน
- `scam_suspect`: otp, รหัส, password, บัญชี

**Confidence Score**: Based on keyword match count

### 2. Risk Detection

**Risk Levels**:
- `safe`: No risk patterns detected
- `warning`: Suspicious patterns (e.g., "โอนก่อน", shortened links)
- `danger`: High-risk patterns (e.g., OTP request, password request)

**Risk Patterns**:
```typescript
[
  { pattern: /(otp|รหัส otp)/i, reason: 'ขอรหัส OTP', level: 'danger' },
  { pattern: /(password|รหัสผ่าน)/i, reason: 'ขอรหัสผ่าน', level: 'danger' },
  { pattern: /(เลขบัตร|cvv|pin)/i, reason: 'ขอข้อมูลบัตร', level: 'danger' },
  { pattern: /(โอนก่อน|ส่งเงินก่อน)/i, reason: 'ขอโอนเงินก่อนดูของ', level: 'warning' },
  { pattern: /(bit\.ly|tinyurl)/i, reason: 'ลิงก์ย่อน่าสงสัย', level: 'warning' }
]
```

### 3. Auto-Reply Suggestions

**Generation Logic**:
1. Analyze incoming message intent
2. Select appropriate template based on intent
3. Return 3 suggestions with different tones:
   - Friendly (😊)
   - Professional (🤝)
   - Negotiation (💬)

**Templates by Intent**:
```typescript
{
  buy_intent: [
    'ยินดีครับ! สินค้ายังมีพร้อมส่งเลยครับ 😊',
    'ขอบคุณที่สนใจครับ พร้อมส่งได้เลยครับ',
    'ได้เลยครับ! ต้องการนัดรับหรือส่งให้ครับ?'
  ],
  negotiate: [
    'ราคานี้เป็นราคาพิเศษแล้วครับ แต่ถ้าซื้อเลยวันนี้ ลดให้อีก 5% ได้ครับ',
    'ขอโทษครับ ราคานี้ต่ำสุดแล้ว แต่ส่งฟรีให้ได้ครับ',
    'ราคานี้เป็นราคาสุดท้ายแล้วครับ แต่รับประกันสภาพ 100% เลยครับ'
  ],
  // ... more templates
}
```

### 4. Price Negotiation Helper

**Algorithm**:
```typescript
function suggestCounterOffer(currentPrice, buyerOffer) {
  const difference = currentPrice - buyerOffer
  const percentDiff = (difference / currentPrice) * 100
  
  if (percentDiff > 20) {
    // Too low, suggest meeting halfway
    return (currentPrice + buyerOffer) / 2
  } else if (percentDiff > 10) {
    // Reasonable, suggest 10% discount
    return currentPrice * 0.9
  } else {
    // Close enough, accept + add value (free shipping)
    return buyerOffer + 'ส่งฟรี'
  }
}
```

### 5. Meeting Location Suggestions

**Safe Locations Database**:
```typescript
[
  { name: 'BTS สยาม', type: 'bts', safety: 'high' },
  { name: 'เซ็นทรัลเวิลด์', type: 'mall', safety: 'high' },
  { name: 'MRT สุขุมวิท', type: 'mrt', safety: 'high' },
  { name: 'เทอมินอล 21', type: 'mall', safety: 'high' }
]
```

**Features**:
- Public places only
- CCTV coverage
- High foot traffic
- Distance calculation (if user location available)

### 6. Conversation Summarization

**Summary Components**:
```typescript
{
  buyerIntent: string           // Primary intent
  keyPoints: string[]           // Extracted entities (price, date, location)
  suggestedActions: string[]    // Next steps
  riskFlags: string[]           // Security warnings
}
```

**Extraction Logic**:
1. Analyze all messages in conversation
2. Count intent occurrences → determine primary intent
3. Extract entities from last 5 messages
4. Generate action suggestions based on intent
5. Aggregate risk flags

## 🎨 UI/UX Features

### Chat Interface

**Layout**:
- **Left Panel**: Conversations list (sortable, filterable)
- **Right Panel**: Active chat with messages
- **Bottom**: Input area with AI suggestions

**Key Elements**:
1. **Message Bubbles**
   - Own messages: Purple gradient, right-aligned
   - Other messages: White/gray, left-aligned
   - Read receipts: ✓ (sent), ✓✓ (read)

2. **AI Suggestion Chips**
   - Displayed above keyboard
   - Tappable to auto-fill
   - Dismissible
   - Color-coded by type

3. **Risk Warnings**
   - Inline above risky messages
   - Color: Yellow (warning), Red (danger)
   - Icon: ⚠️ Alert Triangle
   - Dismissible

4. **Intent Badges**
   - Small pills below messages
   - Icons: 💰 (buy), 💬 (negotiate), ❓ (info), 📍 (meeting)

5. **Summary Modal**
   - Triggered by Sparkles icon
   - Shows conversation analysis
   - Suggested next actions
   - Risk flags

### Mobile Optimizations
- Swipe gestures for actions
- Bottom sheet for suggestions
- Compact message bubbles
- Quick action bar (call, location, calendar)

## 🔒 Security & Safety

### Content Scanning

**Patterns Monitored**:
- OTP/password requests
- Bank account requests
- Suspicious links
- Urgency tactics ("ด่วน", "รีบ")

**Actions**:
- Display warning to user
- Flag conversation for review
- Block link clicks (require confirmation)
- Auto-report to Trust & Safety team

### Rate Limiting
- Max 100 messages/hour per user
- Max 10 conversations/hour creation
- Cooldown period for flagged users

### Privacy
- Messages encrypted in transit (HTTPS)
- No end-to-end encryption (to allow scanning)
- Data retention: 90 days
- User can delete conversations

## 📡 API Endpoints

### Chat Operations
```typescript
// Get conversations
GET /api/chat/conversations?userId={userId}

// Get messages
GET /api/chat/conversations/{conversationId}/messages?limit=50&cursor={cursor}

// Send message
POST /api/chat/conversations/{conversationId}/messages
Body: { senderId, text, imageUrl?, productId? }

// Mark as read
POST /api/chat/conversations/{conversationId}/read
Body: { userId }
```

### AI Operations
```typescript
// Get AI suggestions
POST /api/chat/ai/suggest
Body: { message, conversationId, productContext }
Response: { suggestions: AISuggestion[] }

// Analyze message
POST /api/chat/ai/analyze
Body: { message }
Response: { intent, riskLevel, riskReasons, entities }

// Summarize conversation
POST /api/chat/ai/summarize
Body: { conversationId }
Response: { summary: ConversationSummary }

// Report message
POST /api/chat/report
Body: { messageId, reason }
```

## 🚀 Implementation Phases

### Phase 1: Core Chat (✅ Completed)
- [x] Real-time messaging
- [x] Conversation list
- [x] Message history
- [x] Read receipts
- [x] Typing indicators

### Phase 2: AI Features (✅ Completed)
- [x] Intent detection
- [x] Risk detection
- [x] Auto-reply suggestions
- [x] Conversation summary
- [x] Price negotiation helper

### Phase 3: Advanced Features (🔄 In Progress)
- [ ] Image sharing
- [ ] Location sharing
- [ ] Meeting scheduler
- [ ] Voice messages
- [ ] Video calls

### Phase 4: Seller Tools (📋 Planned)
- [ ] Canned responses library
- [ ] Auto-away messages
- [ ] Bulk broadcast
- [ ] Analytics dashboard

## 📈 Metrics & Analytics

### Tracked Metrics
```typescript
{
  // Performance
  avgResponseTime: number           // seconds
  firstResponseTime: number         // seconds
  
  // Engagement
  messagesPerConversation: number
  conversationDuration: number      // minutes
  
  // AI Usage
  aiSuggestionUsageRate: number     // percentage
  aiSuggestionAcceptRate: number    // percentage
  
  // Safety
  riskMessagesDetected: number
  riskMessagesReported: number
  
  // Business
  conversationToOrderRate: number   // percentage
  avgNegotiationRounds: number
}
```

### Dashboard Views
- Real-time chat activity
- AI performance metrics
- Risk detection stats
- Conversion funnel

## 🧪 Testing Strategy

### Unit Tests
- Intent detection accuracy
- Risk pattern matching
- Entity extraction
- Suggestion generation

### Integration Tests
- Message sending/receiving
- Real-time updates
- Conversation creation
- Read receipt updates

### E2E Tests
- Complete chat flow
- AI suggestion usage
- Risk warning display
- Summary generation

## 📝 Future Enhancements

### Short-term (1-3 months)
- [ ] Multi-language support
- [ ] Voice-to-text
- [ ] Smart product recommendations
- [ ] Payment integration

### Long-term (3-6 months)
- [ ] ML-based intent detection
- [ ] Sentiment analysis
- [ ] Chatbot for FAQs
- [ ] Video chat integration

## 🔗 Related Documentation
- [Product Specification](/jaikod-product-spec.md)
- [Technical Blueprint](/technical-blueprint.md)
- [API Documentation](/api-docs.md)

---

**Last Updated**: 2025-12-10
**Version**: 1.0.0
**Status**: Production Ready
