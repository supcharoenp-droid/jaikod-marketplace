# AI Auto-Reply & Smart Assistant Model Specification
**Version:** 1.0
**Role:** ML Engineer & Conversational Designer
**Objective:** Design a hybrid ML system for high-accuracy, low-latency smart replies in the JaiKod Marketplace.

---

## 1. System Architecture (Hybrid Approach)

To meet the requirement of **<200ms latency** for initial suggestions while providing **rich capabilities**, we propose a two-stage architecture:

### Stage 1: Edge / Light Inference (Client-Side or Edge Cloud)
- **Goal:** Immediate classification & Canned Reply selection.
- **Model:** `DistilBERT-base-multilingual-cased` (Fine-tuned for Thai E-commerce Intent).
- **Function:** 
  1. Classifies user text into **Intent** (e.g., `ask_price`, `ask_availability`, `greeting`, `scam_alert`).
  2. If confidence > 85%, maps immediately to a pre-cached **Canned Reply** ID.
- **Latency:** ~50-100ms.

### Stage 2: Server-Side Generative / Context Engine (Async)
- **Goal:** Personalized, context-aware suggestions (e.g., counter-offers, summarization).
- **Model:** `mT5-small` or `Llama-3-8B-Quantized` (server-hosted).
- **Function:** 
  1. Considers Listing Price, User History, and Product Condition.
  2. Generates dynamic text (e.g., "ลดได้ครับ รับได้ที่ 1,200 บ. ไหมครับ" where `1,200` is dynamically calc).
  3. Safety Check: Scans for PII or prohibited content.
- **Latency:** ~300-600ms.

---

## 2. Intent Classification Schema

We define specific intents for the marketplace domain (Thai context).

| Intent Label | Description | Example Phrases |
| :--- | :--- | :--- |
| `inquiry_availability` | Asking if item is still avail | "ยังอยู่ไหม", "ขายยัง", "พร้อมส่งไหม" |
| `inquiry_condition` | Asking about specs/condition | "มือหนึ่งหรือมือสอง", "มีตำหนิไหม", "ใช้มานานยัง" |
| `price_negotiation` | Bargaining | "ลดได้ไหม", "300 ได้ป่าว", "เต็มที่เท่าไหร่" |
| `logistics_query` | Shipping/Meetup questions | "ส่งแฟลชไหม", "นัดรับที่ไหน", "รวมส่งไหม" |
| `payment_request` | Ready to pay/Ask acc info | "ขอเลขบัญชี", "โอนเลย", "เก็บปลายทาง" |
| `scam_attempt` | High risk patterns | "แอดไลน์ id", "โอนมัดจำก่อน", "รับงานกด" |
| `chitchat` | General conversation | "สวัสดี", "ขอบคุณ", "โอเค" |

---

## 3. Training Data Schema (JSONL)

Data used for fine-tuning the Intent Classifier and Generator.

**Intent Classification Dataset:**
```json
{"text": "สนใจครับ ลดได้สุดๆเท่าไหร่", "label": "price_negotiation", "context": "buyer"}
{"text": "นัดรับ bts สยามได้ไหมครับ", "label": "logistics_query", "context": "buyer"}
{"text": "add line maprang.ja มาคุยรายละเอียด", "label": "scam_attempt", "context": "seller"}
```

**Response Generation Dataset (Seq2Seq):**
```json
{
  "input": "User: ลดได้ไหมครับ [Listing: Phone, Price: 5000]",
  "output": "ลดได้นิดหน่อยครับ สนใจรับเลยไหมครับ"
}
```

---

## 4. API Contract

### `POST /ai/chat/suggest`

**Request:**
```json
{
  "chat_id": "c_12345",
  "actor_role": "seller",
  "messages": [
    {"role": "buyer", "text": "ลดได้ไหมครับ"},
    {"role": "seller", "text": "ได้นิดหน่อยครับ"},
    {"role": "buyer", "text": "4,500 ไหวไหม พร้อมโอน"}
  ],
  "listing_context": {
    "price": 5000,
    "min_offer": 4500,
    "category": "mobile"
  }
}
```

**Response:**
```json
{
  "intent": "price_negotiation",
  "confidence": 0.92,
  "safety_flag": "clean",
  "candidates": [
    {
      "id": "sug_1",
      "text": "ได้ครับ 4,500 ยินดีครับ (แนะนำกดสร้างออเดอร์)",
      "type": "canned_template",
      "score": 0.95
    },
    {
      "id": "sug_2",
      "text": "ราคานี้พิเศษแล้วครับ แถมเคสให้ด้วยนะครับ",
      "type": "generative",
      "score": 0.88
    },
    {
      "id": "sug_3",
      "text": "ขอโทษครับ เต็มที่ได้ 4,800 ครับ",
      "type": "generative",
      "score": 0.75
    }
  ],
  "suggested_actions": ["create_offer_4500"]
}
```

---

## 5. Safety & Fallback Heuristics

**Heuristic Layer (Rule-based) runs BEFORE model:**
1.  **Regex Match:** IF text contains Phone Number / External Link patterns => Flag `potential_pii`.
2.  **Keyword Blacklist:** IF text contains "พนัน", "หวย", "drugs" => Flag `prohibited`.

**Fallback Strategy:**
- IF Model Confidence < 60%:
  - Show generic "Safe Reply" list instead of Generative Text.
  - E.g., "สวัสดีครับ", "สอบถามได้ครับ", "รอสักครู่ครับ" (Safe Chitchat).
- IF `scam_attempt` detected:
  - Do NOT suggest reply.
  - Show System Alert to user: *"ระวังมิจฉาชีพห้ามโอนนอกระบบ"*

---

## 6. Evaluation Metrics

1.  **Suggestion Acceptance Rate (SAR):** % of times user clicks a suggested chip. Target > 30%.
2.  **Intent Accuracy (F1-Score):** Target > 0.90 for core intents (Price, Availability).
3.  **Response Latency (P99):** < 500ms (Total roundtrip).
4.  **Safety Recall:** Target > 0.99 (Must catch 99% of scam keywords).

---

**Approved by:** AI Team Lead
**Date:** 2025-12-09
