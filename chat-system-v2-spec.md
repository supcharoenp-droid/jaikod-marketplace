# JaiKod Chat System V2 - Technical Specification

## 1. Overview
The V2 Chat System transforms simple messaging into a **Smart Sales Assistant**. It utilizes real-time communication coupled with an AI layer to assist sellers in closing deals faster (Smart Replies, Summaries) and protecting users (Scam Detection, Safe Meeting Points).

## 2. Infrastructure & Architecture

### 2.1 Real-time Layer
- **Tech Stack:** Firebase Firestore (for message persistence & sync) + Cloud Functions (for AI hooks).
- **Presence:** Realtime Database (optional) or Firestore `last_seen` timestamps for "Online/Offline" status.
- **Typing Indicators:** Ephemeral writes to Firestore sub-collection `typing_status` or Realtime DB paths.

### 2.2 AI Processing Pipeline (Async)
1.  **Ingest:** New message added to Firestore `messages/{id}`.
2.  **Trigger:** Cloud Function `onMessageCreate`.
3.  **Analysis:**
    -   **Safety Check:** Regex scan for phone/bank/off-platform links.
    -   **Intent Classification:** LLM (Gemini/GPT) classifies as `buy_intent`, `negotiation`, `question`, `spam`.
    -   **Contextual Reply Gen:** Generate 3 suggested replies based on Product Info + previous chat history.
    -   **Entity Extraction:** Detect dates/times for meeting proposals.
4.  **Update:** Write analysis results back to `messages/{id}/ai_metadata` (invisible to buyer, visible to seller as suggestions).

---

## 3. Data Model

### 3.1 Conversation
```typescript
interface Conversation {
  id: string;
  type: 'buying' | 'selling' | 'support';
  participants: string[]; // [buyer_id, seller_id]
  product_id?: string; // Context
  
  // Status
  last_message: {
    text: string;
    sender_id: string;
    sent_at: Date;
    is_read: boolean;
  };
  unread_counts: Record<string, number>; // {user_id: count}
  pinned_by: string[];
  archived_by: string[];
  
  // AI Metadata
  overall_risk_score: number; // 0-100 (High is risky)
  deal_stage: 'inquiry' | 'negotiation' | 'agreement' | 'completed';
  
  created_at: Date;
  updated_at: Date;
}
```

### 3.2 Message
```typescript
interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  type: 'text' | 'image' | 'video' | 'location' | 'offer' | 'meeting_proposal' | 'system';
  
  content: string; // Text or URL
  media_url?: string;
  
  // Structured Data (for Offers/Meetings)
  payload?: {
    offer_price?: number;
    meeting_location?: { name: string; lat: number; lng: number };
    meeting_time?: Date;
  };

  // AI & Safety (Private to system/admin)
  metadata?: {
    intent?: string;
    risk_score?: number;
    detected_entities?: string[];
  };

  // Status
  read_by: string[]; // List of user IDs who read it
  created_at: Date;
}
```

### 3.3 AI Suggestion (Client-side usage)
```typescript
interface ChatSuggestion {
  id: string;
  message_id: string; // The user message this replies to
  type: 'reply' | 'action';
  text: string; // "Yes, it is available."
  action_payload?: any; // { action: 'send_offer', price: 500 }
  confidence: number;
}
```

---

## 4. Features & Logic

### 4.1 Safety Scanner (Pre-send & Post-send)
- **Client-side:** Warn user if they type phone numbers or external links (Soft block).
- **Server-side:**
    -   **Keyword Block:** "Line id", "Transfer to bank", "OTP".
    -   **Action:** If high risk, mask content with `***` and flag for admin. Replace message with "Safety Warning: Content hidden for security."

### 4.2 AI Smart Assistant
- **Auto-Reply Suggestions:**
    -   *Input:* "ลดได้อีกไหมครับ?" (Can you discount?)
    -   *AI Suggestion 1:* "ขอโทษครับ ราคานี้พิเศษแล้วครับ" (Polite refusal)
    -   *AI Suggestion 2:* "ลดได้นิดหน่อยครับ ถ้ามารับเองให้ 500" (Conditional offer)
- **Meeting Point Recommender:**
    -   If Buyer asks "นัดรับที่ไหน?", AI suggests "BTS Siam" (Safe Landmark) if Seller's location is near Siam.

### 4.3 Deal Workflow
- **Offer System:** Buyer sends `type: offer`. Seller can `Accept` -> Changes `deal_stage` to `agreement`.
- **Meeting Scheduler:** Integrated UI to pick Date/Time. Generates a calendar invite card in chat.

---

## 5. API Endpoints

### 5.1 Realtime / CRUD
- `GET /api/v2/chat/conversations`
- `GET /api/v2/chat/conversations/{id}/messages`
- `POST /api/v2/chat/conversations/{id}/messages` (triggers socket/push)
- `POST /api/v2/chat/conversations/{id}/read` (mark read)

### 5.2 AI & Tools
- `POST /api/v2/chat/analyze/suggest`: Ad-hoc request for reply suggestions (if not auto-generated).
- `GET /api/v2/chat/tools/safe-locations?lat={...}&lng={...}`: Get nearby police stations/malls.

---

## 6. UX Guidelines
- **Suggestion Chips:** Floating pills above the input bar: `[Yes, available]`, `[Accept 500]`, `[Send Location]`.
- **Risk Warning:** Bright Red Banner at top if `risk_score` > 80.
- **Smart Summary:** "Summarize" button in header for Sellers. Opens modal with specific deal details (Item, Price, Meeting Time) extracted by AI.

## 7. Sample AI Prompts (System Instructions)

**Intent Detection:**
> "Analyze the following message for eCommerce intent. Categories: [Buy_Intent, Negotiation, Question_Specs, Question_Availability, Spam, Scam_Attempt]. Output JSON."

**Smart Reply:**
> "You are a helpful Thai seller assistant. The buyer asked: '{msg}'. Product is '{product}'. Generate 3 shorts, polite Thai responses: 1) Accept/Agree, 2) Polite Refusal/Counter, 3) Request more info."
