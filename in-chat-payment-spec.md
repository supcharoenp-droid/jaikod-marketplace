# In-Chat Payment & SafePay System Specification
**Version:** 1.0
**Role:** Payments Product Lead & Security Architect
**Context:** Seamless, Secure, and Compliant In-Chat Payments for JaiKod Marketplace.

## 1. User Experience (UX) Flows

### 1.1 Seller Request Flow
1.  **Trigger:** Seller taps `+` -> `Create Order/Request Payment` in chat.
2.  **Input:** Select Product (or Custom Amount) -> Add Shipping Fee -> Confirm Total.
3.  **Output:** A **"Payment Card" bubble** appears in chat. Status: `PENDING`.

### 1.2 Buyer Payment Flow
1.  **Trigger:** Buyer sees "Payment Card" -> Taps "Pay Now (฿1,250)".
2.  **Selection:** specific Payment Modal opens (Sheet on Mobile).
    - *Options:* Credit Card, PromptPay QR, CoinJai Wallet (Balance).
3.  **Confirmation:**
    - *Wallet:* Pin/Biometric.
    - *Card:* 3D Secure (OTP).
    - *QR:* Save image / App switch.
4.  **Completion:** Modal closes. Chat bubble updates to `PAID`.
5.  **Receipt:** System inserts a "Receipt Slip" message automatically.

### 1.3 Refund / Dispute Flow
1.  **Trigger:** Buyer taps "Request Refund" on a Paid Card (only if Escrow Active).
2.  **Process:** Form appears (Reason, Photo Evidence).
3.  **Chat Update:** System posts " Refund Requested: [Reason]". Funds frozen.
4.  **Resolution:** Seller "Accepts" -> Instant Refund to Wallet. Seller "Rejects" -> Admin Dispute Ticket.

---

## 2. Security & Compliance Architecture

### 2.1 PCI-DSS & Data Handling
- **No Card Data Stored:** All credit card inputs are hosted via `iFrame` or `SDK` of the Payment Gateway (e.g., Omise/Stripe).
- **Tokenization:** Server only receives/stores `tok_12345` (Token ID), never PAN (Primary Account Number).
- **Encryption:** TLS 1.3 for transit. AES-256 for sensitive transaction logs (PII masked).

### 2.2 Identification & Auth
- **KYC (Know Your Customer):** Sellers withdrawing > ฿50k must pass ID Verification (Laser ID / NDID).
- **2FA (Strong Auth):** Required for payments > ฿2,000 or unusual device activity.

### 2.3 Idempotency
- **Idempotency Keys:** Clients generate UUID `idempotency_key` for every payment click to prevent double-charging on network retry.

---

## 3. Escrow (JaiKod SafePay) Rules

| State | Condition | Action |
| :--- | :--- | :--- |
| **Pending** | Payment created, not paid. | Msg: "Waiting for payment". |
| **Held** | Payment success. | Funds move to `Escrow_Wallet`. Msg: "Payment Secured. Please Ship." |
| **Shipped** | Seller adds tracking. | System tracks status via Logistics API. |
| **Release** | Buyer clicks "Received" OR 3 days after "Delivered" status. | Funds move to `Seller_Wallet`. Msg: "Money Released." |
| **Dispute** | Buyer reports issue before Release. | Funds Frozen. Admin Review triggered. |

---

## 4. API Spec (RESTful)

### `POST /payments/request`
**Request:**
```json
{
  "chat_id": "c_999",
  "product_id": "p_888",
  "amount": 1250.00,
  "currency": "THB",
  "config": {
    "enable_escrow": true,
    "buyer_pays_fee": false
  }
}
```
**Response:** `201 Created` -> `{ "payment_id": "pay_555", "status": "pending" }`

### `POST /payments/{id}/charge`
**Request:**
```json
{ 
  "method": "credit_card", 
  "token": "tok_visa_123", 
  "idempotency_key": "uuid-v4" 
}
```
**Response:** `200 OK` -> `{ "status": "success", "transaction_ref": "tx_777" }` OR `{ "status": "requires_action", "redirect_url": "..." }` (3DS)

---

## 5. Mobile UI Components (Mockup Spec)

### Payment Card (Bubble)
```tsx
<div className="card">
  <Header>WAITING FOR PAYMENT</Header>
  <ProductRow>
     <Img src="..." /> 
     <Text>Sony A7III (x1)</Text>
  </ProductRow>
  <TotalRow>฿42,500</TotalRow>
  <Button>Pay Now</Button> // Transforms to "Paid" (Green) on success
</div>
```

### Payment Sheet (Modal)
- **Header:** "Secure Checkout" (+ SSL Lock Icon)
- **Methods:**
  - [x] **CoinJai Balance** (฿50.00) - *Insufficient*
  - [ ] **PromptPay QR** (Free)
  - [ ] **Credit/Debit Card** (+2.5%)
- **Footer:** "Pay ฿42,500"

---

**Approved by:** CISO & Product Director
**Date:** 2025-12-09
