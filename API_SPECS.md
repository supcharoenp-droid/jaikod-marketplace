# API Integration Specifications

This document defines the API contracts, data models, and integration patterns for the JaiKod Marketplace Frontend.

## 1. Global Standards

- **Base URL**: `https://api.jaikod.com/v1`
- **Date Format**: ISO 8601 (`YYYY-MM-DDTHH:mm:ssZ`)
- **Pagination**: Curosor-based (`cursor`, `limit`, `next_cursor`).
- **Response Wrapper**:
  ```json
  {
    "data": T,
    "meta": {
      "total": 120,
      "limit": 20,
      "has_more": true,
      "next_cursor": "eyJpZCI6..."
    }
  }
  ```

---

## 2. Product & Search (Search V3 / Card V3)

### `GET /listings`
Search and filter products.

**Query Params:**
- `q`: Search keyword
- `category_id`: Filter by category
- `min_price`, `max_price`
- `sort`: `latest` | `price_asc` | `price_desc` | `distance`
- `lat`, `lng`: User location (required for `sort=distance`)
- `cursor`: Pagination cursor

**Response (Listing Object):**
```json
{
  "id": "prod_123",
  "title": "iPhone 13 Pro Max",
  "price": 25000,
  "original_price": 28000,
  "thumbnail": "https://hw-media.aws/img1.jpg",
  "badges": ["GOOD_PRICE", "VERIFIED_SELLER"],
  "location": {
    "province": "Bangkok",
    "district": "Chatuchak",
    "distance_km": 5.2
  },
  "seller": {
    "id": "sel_99",
    "name": "SuperShop",
    "avatar": "https://...",
    "rating": 4.8,
    "is_official": true
  },
  "stats": {
    "views": 100,
    "likes": 12
  },
  "ai_insights": {
    "price_score": 90, // 0-100 (High = Good Deal)
    "match_score": 85 // Personalization score
  }
}
```

### `POST /listings/{id}/like` (Optimistic Update)
Toggle like status.
- **On Success**: `200 OK`
- **On Client**: Toggle immediately. Revert if API fails.

---

## 3. Storefront (Shop Page)

### `GET /shops/{slug}`
Get store profile details.

**Response:**
```json
{
  "id": "shop_123",
  "name": "Camera Pro Shop",
  "slug": "camera-pro",
  "description": "Professional camera equipment specialized store.",
  "avatar": "...",
  "cover_image": "...",
  "rating": 4.9,
  "followers_count": 15000,
  "response_rate": 98, // Percent
  "joined_at": "2023-01-01T00:00:00Z",
  "badges": ["VERIFIED", "FAST_SHIPPER"],
  "is_following": false
}
```

### `GET /shops/{slug}/products`
Get products specifically for a store. Supports same pagination as `/listings`.

---

## 4. Smart Upload (AI Form)

### `POST /ai/analyze-image`
Upload an image to get AI suggestions before creating a product.

**Request:** `FormData` with `image` file.

**Response:**
```json
{
  "detected_category_id": "2",
  "confidence": 0.95,
  "image_quality": {
    "score": 88,
    "is_blurry": false,
    "lighting": "good"
  },
  "suggested_price": {
    "min": 10000,
    "max": 12000,
    "avg": 11000,
    "good_deal_threshold": 10500
  },
  "extracted_tags": ["electronics", "camera", "sony"],
  "description_draft": "สภาพดี 95% อุปกรณ์ครบ..."
}
```

### `POST /listings`
Create final listing.

**Request Body:**
```json
{
  "title": "Sony A7III",
  "price": 45000,
  "category_id": "2",
  "images": ["url1", "url2"],
  "description": "...",
  "attributes": {
    "shutter_count": "5000",
    "box_included": true
  }
}
```

---

## 5. Real-time Chat (WebSocket)

**Endpoint**: `wss://api.jaikod.com/ws/chat`

**Events:**
- `client:message`: User sends message.
- `server:message`: Receive new message.
- `server:typing`: Other user typing status.
- `server:read_receipt`: Message read status update.

**Payload Structure:**
```json
{
  "event": "client:message",
  "payload": {
    "conversation_id": "conv_123",
    "text": "Hi, is this available?",
    "type": "text" // or "image", "location"
  }
}
```

---

## Integration Guidelines

1.  **Optimistic UI**: For actions like `Like`, `Follow`, `AddToCart`, update the UI state **immediately** before waiting for the server. If the request fails, unroll the state and show a Toast error.
2.  **Error Handling**:
    - `401 Unauthorized`: Redirect to Login (save current URL to `redirect_to`).
    - `404 Not Found`: Show "Content Deleted" placeholder.
    - `422 Validation`: Map field errors to form inputs.
    - `5xx`: Show generic "System Error" toast.
3.  **Caching**:
    - Use `Next.js` Cache (SWR/React Query recommended) for `GET` requests.
    - Cache `geo-location` data (Provinces/Districts) locally `localStorage` for 7 days.
