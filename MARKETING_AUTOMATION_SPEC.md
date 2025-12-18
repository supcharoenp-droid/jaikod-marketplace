# JaiKod AI Marketing Automation Specification

## 1. System Architecture

The Marketing Automation Platform (MAP) acts as the "Growth Engine" of JaiKod, sitting between raw data and user communication channels.

### High-Level Data Flow

```mermaid
graph LR
    Data[User Behavior / Events] --> SegmentEng[Segmentation Engine]
    SegmentEng --> Trigger[Trigger & Flow Logic]
    
    subgraph "AI Optimization Layer"
        Trigger --> PersEng[Personalization Engine]
        PersEng --> SendTimeAI[Send Time Optimizer]
        PersEng --> ContentGen[GenAI Content Creator]
    end
    
    SendTimeAI --> Orchestrator[Channel Orchestrator]
    
    subgraph "Channels"
        Orchestrator --> Push[Mobile Push (FCM)]
        Orchestrator --> Email[Email (SendGrid/SES)]
        Orchestrator --> InApp[In-App Message]
        Orchestrator --> SMS[SMS Gateway]
        Orchestrator --> Ads[Paid Ads Sync (FB/Google)]
    end
    
    Channels --> Feedback[Feedback Loop (Open/Click/Convert)]
    Feedback --> Data
```

---

## 2. Segmentation Engine (Dynamic Audiences)

Segments update in real-time based on `UserProfile` and `EventStream`.

| Segment Name | Definition Logic | Update Frequency | Goal |
| :--- | :--- | :--- | :--- |
| **🚨 Churn Risk** | `last_active > 30 days` AND `previous_engagement = high` | Daily | Reactivation |
| **💎 High LTV** | `total_spend > 5000 THB` OR `sales_count > 10` | Real-time | VIP Treatment / Upsell |
| **👀 Window Shoppers** | `view_item_count > 20` AND `purchase_count = 0` (Last 7d) | Hourly | Conversion (First Buy) |
| **📍 Local Buyers** | `location_search_count > 5` (Specific Province) | Daily | Geo-targeted Promos |
| **🛒 Cart Abandoners** | `add_to_cart` event with no `purchase` within 1h | Real-time | Recovery |

---

## 3. Automation Playbooks (Triggered Flows)

### Flow A: "The Nudge" (Cart Abandonment)
*   **Trigger**: Item added to cart, no checkout for 60 mins.
*   **Step 1 (T+1h)**: **Push Notification**
    *   *Message*: "ลืมของไว้หรือเปล่า? 😲 [Product Name] รอคุณอยู่!"
    *   *AI*: Insert product image + Low stock warning if applicable.
*   **Step 2 (T+24h)**: **Email** if not converted.
    *   *Subject*: "ลดให้พิเศษ 5% เฉพาะคุณ 🏷️"
    *   *Action*: Call `CouponEngine` -> Generate unique code -> Insert in Email.
*   **Step 3 (T+48h)**: **In-App Modal** on next open.
    *   *Content*: "โอกาสสุดท้าย! คูปองของคุณจะหมดอายุใน 2 ชม."

### Flow B: "Price Drop Alert" (Wishlist)
*   **Trigger**: Listing price decreases by > 10%.
*   **Target**: All users who have this item in `Favorites`.
*   **Channel**: **Push Notification** (High urgency).
*   **Message**: "ราคาลงแล้ว! [Product] เหลือเพียง ฿[NewPrice] (จาก ฿[OldPrice]) 🔥"

### Flow C: "Seller Success Coach" (New Seller)
*   **Trigger**: Registered as seller but 0 listings after 3 days.
*   **Channel**: **In-App Message** / **Email Series**.
*   **Content**: "3 เคล็ดลับถ่ายรูปให้ขายออกไว 📸" (Link to Blog/Video).
*   **Goal**: Drive first listing.

---

## 4. AI & Optimization Features

### A. Send Time AI (STO)
*   **Logic**: Analyze user's historical `open_timestamp` distribution.
*   **Action**: Instead of sending a blast at 9:00 AM, send to User A at 8:15 AM (commute) and User B at 8:00 PM (relax time).
*   **Fallback**: If no history, use global peak time (18:00 - 21:00).

### B. GenAI Content Personalization
*   **User Context**: "Loves Cameras", "Sensitive to Price".
*   **Template**: `[Opening_Hook] [Product_Highlight] [Call_To_Action]`
*   **AI Variant A (Camera Lover)**: "อัปเกรดเลนส์ใหม่? ส่องโปรกล้องฟิล์มสภาพนางฟ้า..."
*   **AI Variant B (Price Sensitive)**: "ลดล้างสต็อก! กล้องมือสองเริ่มต้น 500.-..."
*   **Testing**: Automatically A/B test these variants on 10% of audience, roll out winner to 90%.

### C. Channel Preference Scoring
*   Assign a score (0-1) per channel per user based on engagement.
*   *Optimization*: If `email_score < 0.1` and `push_score > 0.8`, stop sending promotional emails (save cost/span reputation) and focus on Push.

---

## 5. Integration Points & Contracts

### 1. Connection to Recommendation Engine
*   **Use Case**: "Weekly For You Digest" Email.
*   **API Call**: `POST /recommendations/batch`
    *   *Input*: `[user_id_1, user_id_2, ...]`
    *   *Output*: `{ user_id: [products...] }`
*   **Template Logic**: `foreach product in recommendations: render(product_card)`

### 2. Connection to Coupon Engine
*   **Use Case**: Incentivized Recovery.
*   **API Call**: `POST /coupons/generate`
    *   *Input*: `{ type: 'percent', value: 5, expiry: '24h', user_id: '...' }`
    *   *Output*: `code: 'SAVE5-XYZ'`

### 3. Connection to Ads Manager
*   **Use Case**: Retargeting Churned Users.
*   **Logic**:
    *   If `segment = churn_risk` AND `email_open = false`,
    *   Sync `user_email_hash` to **Facebook Custom Audience** ("Winback Campaign").

---

## 6. Dashboards & KPIs

### Campaign Performance Dashboard
| Metric | Definition | Good Benchmark |
| :--- | :--- | :--- |
| **Delivery Rate** | % of messages successfully sent | > 98% |
| **Open Rate** | % opened (Email/Push) | Push > 5%, Email > 20% |
| **CTR (Click-Through)** | % clicked link inside | > 2-3% |
| **Conversion Rate** | % purchased within attribution window | > 1.5% |
| **Uplift** | (Conversion of Test Group - Control Group) | Positive |
| **Unsubscribe Rate** | % opted out | < 0.5% |

### Compliance Guardrails
*   **Frequency Capping**: Max 1 marketing push/day, 3 emails/week per user.
*   **Quiet Hours**: Do not send Push between 22:00 - 08:00 (unless transactional).
*   **Consent**: Strict adherence to explicit opt-in flags in User Profile.
