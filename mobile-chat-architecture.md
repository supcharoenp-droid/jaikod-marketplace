# Mobile-First Marketplace Chat Architecture (v1.0)
**Role:** Mobile Product Lead & UX Architect
**Context:** Native-like mobile web experience for JaiKod Chat.

## 1. UX/UI Layout Strategy (Mobile First)

### 1.1 Viewport Structure
- **Global:** `fixed inset-0 overflow-hidden bg-white` (Prevents body scroll bounce).
- **Header:** Fixed top (`h-14`), z-index 50. Contains navigation and presence.
- **Message List:** Scrollable area (`flex-1`), with `overscroll-behavior-y: contain`. Bottom-up grouping.
- **Context Strip (Product):** Sticky *above* the composer (not top of screen), ensuring context is always near the action.
- **Composer (Footer):** Fixed bottom (`pb-safe-area`), expands with content.

### 1.2 Interactive Elements
- **Tap Targets:** Minimum 44x44px for all icons.
- **Gestures:**
  - **Swipe Right** on message: Reveal timestamp/status.
  - **Swipe Down** on keyboard: Dismiss keyboard.
  - **Long Press** on message: Context menu (Reply, Copy, Delete).
- **Feedback:** Haptic feedback simulation (vibrate on long press/send).

---

## 2. API Contracts & Synchronization

### 2.1 WebSocket Protocol (`wss://api.jaikod.com/chat/ws`)
**Handshake:**
```json
// Client -> Server (Auth)
{ "type": "auth", "token": "JWT_TOKEN", "agent": "mobile_web_v1" }

// Server -> Client (Ack)
{ "type": "auth_ack", "user_id": "u123", "sync_cursor": "msg_999" }
```

**Real-time Events:**
- `msg.new`: New incoming message.
- `msg.ack`: Server received sent message (Single Check).
- `msg.read`: Peer read the message (Double Check).
- `typing`: Peer typing status (debounce 3s).

### 2.2 REST Fallback & History
- `GET /chat/{id}/messages?limit=50&before={cursor}`
  - Returns: `messages[]`, `next_cursor`
- `POST /chat/{id}/attachments`
  - Multipart upload. Returns `{ url, thumb_url, type, size }`.

### 2.3 Offline & Sync Strategy
1.  **Optimistic UI:** Append message locally immediately with status `pending`.
2.  **Queue:** Store `pending` messages in `IndexedDB` or `localStorage` (`chat_outbox`).
3.  **Sync Loop:**
    - On `online` event or WS reconnect:
    - Iterate `chat_outbox`: Retry Send.
    - If success -> update ID & status -> remove from queue.
    - If fail (4xx) -> mark `failed` (user must retry).

---

## 3. Data Models

### 3.1 Mobile Cache Schema (Client DB)
```typescript
interface CachedMessage {
    localId: string;   // uuid-v4
    serverId?: string; // synced id
    conversationId: string;
    body: string;
    type: 'text' | 'image' | 'location' | 'product';
    status: 'pending' | 'sent' | 'delivered' | 'read' | 'failed';
    timestamp: number;
}
```

---

## 4. AI & Smart Features (Mobile Optimized)
- **Zero-UI Activation:** AI suggestions appear as "Chips" above text input when user stops typing, or on empty state.
- **Smart Actions:**
  - "Create Order": Detects keywords like "buy", "price", "take it".
  - "Share Location": Detects "where", "meetup".
- **Risk Shield:**
  - If incoming msg contains sensitive keywords ("transfer", "id card"), display a non-intrusive toast warning: *"For safety, keep transactions within JaiKod."*

---

## 5. Metrics & Analytics
- **UX Metrics:**
  - **TBT (Time to Bubble):** Time from "Talk" button on product page -> First message bubble rendered.
  - **Input Latency:** Milliseconds between Send tap and bubble appearance (Optimistic).
- **Business Metrics:**
  - **Attachment Rate:** % of chats with images (indicates high intent).
  - **Order Conversion:** % of chats where "Create Order" is tapped.

---

**Approver:** Mobile Experience Team
**Status:** Draft v1
