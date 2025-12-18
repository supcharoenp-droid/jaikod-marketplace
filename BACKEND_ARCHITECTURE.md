# JaiKod Backend Architecture Specification

> **Version**: 1.0  
> **Type**: Technical Specification  
> **Status**: Approved for Implementation

---

## 1. System Overview
This document outlines the complete backend architecture for **JaiKod**, an AI-Native Marketplace. The system is designed for high scalability, real-time interaction, and deep AI integration.

### Technology Stack
- **API Runtime**: Node.js (TypeScript) / Go (High Performance Services)
- **Protocol**: RESTful API (Standard), WebSocket (Real-time), gRPC (Internal AI)
- **Databases**:
  - **Relational**: PostgreSQL (Core Data, ACID Transactions)
  - **Search Engine**: Elasticsearch or Meilisearch (Geo-spatial & Full-text)
  - **Vector DB**: Pinecone/Milvus (Image & Semantic Embeddings)
  - **Cache**: Redis (Session, Rate Limiting, Geo-caching, Scores)

---

## 2. Database Schema (Relational & Normalized)

### 2.1 Identity & Access
#### `users`
| Field | Type | Attributes | Description |
|---|---|---|---|
| `id` | UUID | PK | Unique User Identifier |
| `email` | VARCHAR | Unique, Not Null | Login Credential |
| `phone` | VARCHAR | Unique, Not Null | Mobile verification |
| `password_hash` | VARCHAR | Not Null | Argon2/Bcrypt hash |
| `first_name` | VARCHAR | Not Null | |
| `last_name` | VARCHAR | Not Null | |
| `avatar_url` | TEXT | | Profile image |
| `trust_score` | INT | Default 0 | 0-100 AI Calculated Score |
| `is_verified` | BOOLEAN | Default False | Identity verified badge |
| `ekyc_status` | ENUM | `pending`, `verified`, `rejected` | eKYC state |
| `created_at` | TIMESTAMP | | |
| `updated_at` | TIMESTAMP | | |

#### `sellers`
| Field | Type | Attributes | Description |
|---|---|---|---|
| `id` | UUID | PK | Seller Profile ID |
| `user_id` | UUID | FK -> `users.id` | Owner |
| `store_name` | VARCHAR | Unique | |
| `store_banner` | TEXT | | |
| `store_logo` | TEXT | | |
| `seller_rating` | FLOAT | Default 0.0 | Aggregated 5-star rating |
| `total_sales` | INT | Default 0 | Verified sales count |
| `response_rate` | INT | Default 100 | Percentage of chats answered < 1hr |
| `official_store` | BOOLEAN | Default False | Brand/Official Mall Flag |
| `business_reg_doc` | TEXT | | Encrypted path to doc |

### 2.2 Marketplace Core
#### `listings`
| Field | Type | Attributes | Description |
|---|---|---|---|
| `id` | UUID | PK | |
| `seller_id` | UUID | FK -> `sellers.id` | |
| `category_id` | INT/UUID | FK -> `categories.id` | |
| `title` | VARCHAR(120) | Not Null, Index | |
| `description` | TEXT | Not Null | |
| `price` | DECIMAL(12,2) | Not Null | |
| `condition` | ENUM | `new`, `mint`, `good`, `fair`, `broken` | |
| `province` | VARCHAR | Index | Geo-location (Level 1) |
| `district` | VARCHAR | Index | Geo-location (Level 2) |
| `subdistrict` | VARCHAR | | Geo-location (Level 3) |
| `lat` | FLOAT | Index (GIST) | Latitude |
| `lng` | FLOAT | Index (GIST) | Longitude |
| `status` | ENUM | `active`, `inactive`, `sold` | |
| **AI Metadata** | | | |
| `ai_price_score` | INT | | 0 (Overpriced) - 100 (Great Deal) |
| `ai_condition_score` | INT | | 0-100 Confidence from Image |
| `ai_good_deal` | BOOLEAN | | Calculated flag |
| `image_urls` | JSONB | | Array of image objects |
| `views` | INT | Default 0 | |
| `likes` | INT | Default 0 | |

#### `categories`
| Field | Type | Attributes |
|---|---|---|
| `id` | UUID | PK |
| `name` | VARCHAR | |
| `icon` | TEXT | |
| `parent_id` | UUID | Nullable (Self-ref) |
| `is_trending` | BOOLEAN | For "Hot Categories" |

### 2.3 Interaction & Trust
#### `chat_messages`
| Field | Type | Attributes |
|---|---|---|
| `id` | UUID | PK |
| `chat_id` | UUID | Index (Conversation) |
| `sender_id` | UUID | FK |
| `message` | TEXT | Content |
| `message_type` | ENUM | `text`, `image`, `product`, `location` |
| `read_status` | BOOLEAN | |
| `created_at` | TIMESTAMP | Index |

#### `reviews`
| Field | Type | Attributes |
|---|---|---|
| `id` | UUID | PK |
| `seller_id` | UUID | FK |
| `user_id` | UUID | FK |
| `rating` | INT | 1-5 |
| `comment` | TEXT | |

#### `fraud_flags`
| Field | Type | Attributes |
|---|---|---|
| `id` | UUID | PK |
| `listing_id` | UUID | FK |
| `reason` | ENUM | `spam`, `counterfeit`, `scam`, `abusive` |
| `risk_score` | INT | 0-100 AI Assessed |

### 2.4 Marketing Engine
#### `boosts`
| Field | Type | Attributes |
|---|---|---|
| `id` | UUID | PK |
| `listing_id` | UUID | FK |
| `boost_type` | ENUM | `normal` (feed), `geo` (local), `hot` (top) |
| `start_time` | TIMESTAMP | |
| `end_time` | TIMESTAMP | |
| `cost_coin` | INT | |

#### `coupons`
| Field | Type | Attributes |
|---|---|---|
| `id` | UUID | PK |
| `seller_id` | UUID | FK |
| `discount_type` | ENUM | `percent`, `amount` |
| `value` | DECIMAL | |
| `min_spend` | DECIMAL | |
| `usage_limit` | INT | |

#### `ads`
| Field | Type | Attributes |
|---|---|---|
| `id` | UUID | PK |
| `seller_id` | UUID | FK |
| `ad_type` | ENUM | `banner`, `sponsored_listing` |
| `target_category` | UUID | |
| `target_radius_km` | FLOAT | Geo-targeting |
| `daily_budget` | DECIMAL | |

---

## 3. Data Validation Rules (Strict Interceptor Layer)

All incoming write requests must pass the `ValidationMiddleware` before reaching controllers.

### `ProductListingValidator`
1.  **Title**:
    *   Required, String.
    *   Length: 5 - 120 characters.
    *   *Sanitization*: Remove HTML tags, excessive emojis.
2.  **Description**:
    *   Required.
    *   **AI Check**: Run `ai_bad_description_detector`. fail if contains prohibited keywords (e.g., "line id", "bank transfer only").
3.  **Price**:
    *   Required, Number > 0.
    *   **AI Check**: Compare with `ai_price_benchmark_engine`. Warn user if standard deviation > 2.0 (Too cheap/expensive).
4.  **Location**:
    *   `province`, `district`: Required.
    *   `lat`, `lng`: Required if `delivery_type` includes "meetup".
5.  **Images**:
    *   Minimum 1, Maximum 10.
    *   Valid URL format.
    *   **AI Check**: `ai_image_analyzer` must return `NSFW: false` and `Clarity_Score > 60`.
6.  **Category**:
    *   Must exist in `categories` table.
7.  **Condition**:
    *   Must match ENUM [`new`, `mint`, `good`, `fair`, `broken`].

---

## 4. API Specification (REST & WebSocket)

### 4.1 Listings & Search
- **GET /api/v1/listings**
    - **Query**: `category`, `lat`, `lng`, `radius`, `price_min`, `price_max`, `sort` (ai_hybrid/nearest/price), `keyword`.
    - **Response**: `ProductCardV3[]` enriched with `distance`, `ai_badges`.
- **GET /api/v1/listings/{id}**
    - **Response**: Full details + AI Summary + Seller Profile + Reviews.
- **POST /api/v1/listings** (Protected)
    - **Body**: JSON matching `listings` schema.
    - **Triggers**: Async job for AI scoring and Vector embeddings.
- **GET /api/v1/search/smart**
    - **Query**: `q`
    - **Response**: AI-summarized intent, category suggestions, top results.

### 4.2 Sellers & Stores
- **GET /api/v1/sellers/{id}**
    - Seller profile, stats, trust score.
- **GET /api/v1/sellers/{id}/listings**
- **POST /api/v1/store/settings**

### 4.3 Chat (Real-time)
- **WS /ws/chat/connect**
    - Authenticate via JWT.
    - Subscribe to `user:{id}:messages`.
- **POST /api/v1/chat/{chat_id}/message**
    - Send message via REST (for reliability).
    - Pushes event to WebSocket subscribers.

### 4.4 Growth & Marketing
- **POST /api/v1/boost/start**
    - Deduct coins, create `boosts` record.
- **GET /api/v1/boost/suggestions**
    - AI analyzes listing performance and suggests boost packs.
- **POST /api/v1/coupons**
- **POST /api/v1/ads/create**

### 4.5 Trust & Safety
- **POST /api/v1/fraud/report**
- **Internal**: `POST /internal/fraud/check-image` (Called by Listing Service).

---

## 5. AI Processes & Integration

The backend interacts with the **AI Engine (Python/FastAPI)** via gRPC or Message Queue (RabbitMQ) for heavy lifting.

| AI Process | Trigger | Output | DB Field |
|---|---|---|---|
| **Ranking Engine** | Search / Feed Request | Sorted List IDs | N/A (Dynamic) |
| **Price Estimator** | Listing Creation | Recommended Price Range | `ai_price_score` |
| **Condition Classifier** | Image Upload | Condition: New/Used | `ai_condition_score` |
| **Bad Desc. Detector** | Listing Creation | Validation Error/Flag | `fraud_flags` |
| **Trust Scorer** | User Activity / Review | 0-100 Score | `users.trust_score` |
| **Matching (Tinder)** | User Browse/Swipe | Personalized Feed | N/A (Redis Cache) |
| **Trending Detector** | Hourly Cron | Top Categories | `categories.is_trending` |
