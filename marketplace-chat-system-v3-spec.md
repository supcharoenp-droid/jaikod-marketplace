# Marketplace Chat System V3: Technical Specification
**Version:** 3.0
**Role:** Chat System Architect & UI/UX Specialist
**Objective:** Transform simple chat into a powerful Marketplace Trading & CRM Platform.

## 1. System Architecture & Features

### 1.1 Core Chat Layout (3-Column Responsive)
- **Left (Conversation List):**
  - **Filters:** All, Unread, Buying, Selling, Important.
  - **Search:** Message content & Usernames.
  - **Quick Stats:** Response Rate, Unread Count.
  - **CRM Indicators:** Tags (New, VIP, Pending Payment).

- **Center (Main Chat):**
  - **Sticky Header:** User Status, Last Seen, Verification Badge, Action Menu (Report/Block).
  - **Sticky Product Strip:** Product context with "Buy Now" / "Make Offer" actions.
  - **Message Area:** Grouped messages, Read Receipts (Sent/Delivered/Read), Date separators.
  - **Rich Message Types:** Text, Image (Gallery), Video, File, Location, Product Card, Order Summary, Coupon.
  - **Input Composer:** Textarea, Voice Recorder, Attachment Menu, Emoji Picker.
  - **AI Smart Bar:** Context-aware suggestions (Quick Replies, Safety Warnings).

- **Right (Context & Tools):**
  - **Tab 1: Info (Buyer View):** Product Details, Seller Trust Score, Safety Tips.
  - **Tab 2: Seller Tools (Store View):** 
    - **CRM:** Customer Tags (Edit/Add).
    - **Actions:** Create Order, Send Coupon, Request Review.
    - **Canned Replies:** Quick access to saved templates.

### 1.2 Seller Pro Features (CRM & Productivity)
- **Customer Tagging:** Manually or AI-auto tag customers (e.g., "High Potential", "Price Sensitive").
- **Canned Responses:** Library of pre-set answers (e.g., "Shipping Info", "Bank Details").
- **In-Chat Order Creation:** Seller can generate a custom "Offer/Order" card. The buyer clicks "Pay" directly in chat.
- **Broadcast:** Send updates to past customers (with rate limits).

### 1.3 AI Intelligence System
- **AI Assist (Smart Reply):** Analyzes conversation context to suggest polite/closing/negotiating replies.
- **AI Safety Guard:** 
  - Real-time scanning for keywords: "Line ID", "Transfer first", "Gambling".
  - Pop-up warnings for high-risk behavior.
- **AI Product Insight:** Verifies if uploaded product images match description or look generic/fake.
- **Auto-Summary:** Summarizes long negotiations into key points (Price agreed, Condition, Delivery method).

### 1.4 Security & Safety
- **Safe Meeting Points:** Suggests verified public locations (Police stations, Malls) for "Meetup" deals.
- **Fraud Score:** Dynamic score updating based on user reports and chat behavior.
- **Spam Control:** Rate limiting messages for new accounts.

---

## 2. Data Models (TypeScript Interfaces)

```typescript
// Core Message Extension
interface ChatMessage {
  // ... existing fields
  type: 'text' | 'image' | 'video' | 'file' | 'location' | 'product_card' | 'order_offer' | 'coupon' | 'system_alert'
  metadata?: {
    orderId?: string
    offerPrice?: number
    couponCode?: string
    latitude?: number
    longitude?: number
    locationName?: string
    safetyRiskScore?: number // 0-1 (AI analyzed)
  }
}

// Conversation Extension
interface Conversation {
  // ... existing fields
  tags: string[] // ['vip', 'pending_pay', 'return_requested']
  notes: string // Private seller notes
  stage: 'inquiry' | 'negotiation' | 'closed_won' | 'closed_lost'
}

// Seller Tools
interface CannedReply {
  id: string
  shortcut: string // e.g., "/bank"
  text: string
  category: 'logistics' | 'payment' | 'greeting'
}
```

## 3. UI/UX Design Guidelines

### Visual Hierarchy
- **Primary Actions:** "Send", "Buy Now", "Create Order" (High contrast, Neon/Violet).
- **Secondary Actions:** "Attach", "Quick Reply" (Neutral/Ghost).
- **Safety Alerts:** Distinct Red/Orange background with icon, non-intrusive but visible.
- **System Messages:** Center-aligned, small gray text, reduced opacity.

### Interaction Design
- **Hover Effects:** Show timestamps and message actions (Reply, Delete) on hover.
- **Typing Indicators:** Smooth dot animation.
- **Transition:** Slide-in for right sidebar panels.
- **Feedback:** Toast notifications for "Copied", "Sent", "reported".

## 4. Implementation Roadmap

1.  **Phase 1 (Frontend Layout):** Update `ChatSystemV2` to include Right Sidebar Tabs (Info vs Tools) and expanded Input features.
2.  **Phase 2 (Data Layer):** Enhance `realtimeChatService` to mock new message types (Location, Order).
3.  **Phase 3 (AI Integration):** Mock AI suggestions and Safety Risk analysis.
4.  **Phase 4 (Seller Tools):** Implement Canned Reply selector and Order Creation modal.

---

**Approved by:** Chat System Architect
**Date:** 2025-12-09
