# JaiKod Marketplace - Technical Architecture Blueprint

## 1. System Overview & High-Level Architecture

We adopt a **Hybrid Microservices Architecture**, prioritizing scalability and separation of concerns. Critical paths (Ordering/Payment) are isolated, while high-throughput features (Analytics/Trends) rely on event-driven pipelines.

### High-Level Diagram (Mermaid)

```mermaid
graph TD
    Client[Web / Mobile App] --> CDN[Cloudflare CDN]
    CDN --> LB[Load Balancer / Ingress]
    LB --> APIG[API Gateway (Kong / AWS API Gateway)]

    subgraph "Core Services"
        APIG --> AuthSvc[Auth Service (OAuth/JWT)]
        APIG --> UserSvc[User & Profile Service]
        APIG --> ListingSvc[Listing Service]
        APIG --> OrderSvc[Order & Transaction Service]
        APIG --> ChatSvc[Realtime Chat Service]
    end

    subgraph "AI & Intelligence Layer"
        APIG --> SearchSvc[Search Engine (Hybrid)]
        APIG --> RecSvc[Recommendation Engine]
        APIG --> FraudSvc[Fraud & Trust Engine]
        APIG --> PriceSvc[Price Analytics Engine]
    end

    subgraph "Data & Events"
        Kafka[Event Bus (Kafka/PubSub)]
        ListingSvc --> Kafka
        UserSvc --> Kafka
        OrderSvc --> Kafka
    end

    subgraph "Async Workers"
        Kafka --> TrendWorker[Trend Analytics Worker]
        Kafka --> BoostWorker[Auto-Boost Worker]
        Kafka --> ImageWorker[Image AI Worker (Analysis/Condition)]
        Kafka --> NotifWorker[Notification Worker]
    end

    subgraph "Storage"
        Postgres[(PostgreSQL - Primary OLTP)]
        Redis[(Redis - Cache/PubSub)]
        Elastic[(Elasticsearch - Search)]
        VectorDB[(Pinecone/Milvus - Vector Search)]
        Mongo[(MongoDB - Chat History)]
        S3[Object Storage - Images/Video]
    end

    ListingSvc --> Postgres
    ListingSvc --> Redis
    SearchSvc --> Elastic
    RecSvc --> VectorDB
    ChatSvc --> Mongo
    ChatSvc --> Redis
```

---

## 2. Service Inventory

| Service Name | Key Responsibilities | Tech Stack (Suggested) | Scaling Strategy |
| :--- | :--- | :--- | :--- |
| **Auth Service** | Identity, OAuth2, Session Management, PII Encryption | Go / Node.js | Horizontal (Stateless) |
| **User Service** | Profiles, Trust Score, eKYC integration, Addresses | Node.js (NestJS) | Read Replicas (Cached) |
| **Listing Service** | CRUD Listings, Condition Check, Inventory | Go / Node.js | Horizontal + Sharding |
| **Search Service** | Keyword + Semantic Search, Filtering, Facets | Python / Java | Elastic Scaling |
| **Recommendation** | For You Feed, Personalized Ads, Ranking | Python (FastAPI) | GPU Instances (Inference) |
| **Chat Service** | WebSocket, Smart Replies, Safe Meeting Points | Go / Node.js + Socket.IO | Connection Pooling |
| **Transaction Svc** | Orders, Payments, Escrow, Wallet (CoinJai) | Java / Go | High Consistency (ACID) |
| **Marketing Svc** | Ads, Auto-Boost Logic, Coupons | Node.js | Event-driven |
| **Ops/Admin** | Moderation, Category Mgmt, System Config | Next.js (Internal) | Low traffic |

---

## 3. Data Architecture & Schemas

### Core Data Models (Relational - PostgreSQL)

**Users Table**
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR UNIQUE,
  phone VARCHAR UNIQUE,
  trust_score INT DEFAULT 0,
  kyc_status ENUM('pending', 'verified', 'rejected'),
  is_official_store BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP
);
```

**Listings Table**
```sql
CREATE TABLE listings (
  id UUID PRIMARY KEY,
  seller_id UUID REFERENCES users(id),
  category_id INT,
  title VARCHAR,
  price DECIMAL(10, 2),
  condition_score INT, -- from AI Visual Analysis
  quality_score INT, -- from AI Description Check
  embedding_vector VECTOR(1536), -- for semantic search (if using pgvector)
  geo_location POINT,
  status ENUM('active', 'sold', 'hidden', 'banned'),
  indexed_at TIMESTAMP
);
```

**Transactions**
```sql
CREATE TABLE transactions (
  id UUID PRIMARY KEY,
  buyer_id UUID,
  listing_id UUID,
  amount DECIMAL,
  escrow_status ENUM('held', 'released', 'refunded'),
  payment_method VARCHAR
);
```

### NoSQL & Specialized Storage

*   **Elasticsearch/OpenSearch**: Stores denormalized listing data for fast filtering, faceted search, and fuzzy matching.
*   **Vector DB (Pinecone/Milvus)**: Stores embedding vectors of product images and descriptions for "Visual Search" and "Recommendation".
*   **MongoDB/Cassandra**: Stores Chat messages (`conversation_id`, `message_payload`, `ai_safety_tags`).
*   **Redis**:
    *   `session:{userId}`: faster auth checks.
    *   `trends:hourly:{categoryId}`: Sorted Sets for trending scores.
    *   `ratelimit:{ip}`: API throttling.

---

## 4. AI & Intelligence Pipelines

### A. Real-time Trend Pipeline
**Source**: `view_listing_event`, `search_event`, `add_to_cart_event` -> **Kafka Topic**: `user.activity`
**Processor**: Spark Streaming / Flink
**Logic**:
1.  Aggregate events per 5-minute window.
2.  Calculate Velocity (Speed of change) and Volume.
3.  Update Redis Sorted Set `trending_categories`.
4.  Broadcasting via WebSocket to "Hourly Trends" UI.

### B. Auto-Boost Engine (The "Sales Agent")
**Trigger**: Hourly Cron or "High Attention" Event.
**Logic Module**:
1.  Check `listings` where `auto_boost_enabled = true`.
2.  Analyze active metrics (CTR, Chat Rate) vs. Peers.
3.  If conditions met (e.g., CTR > 5%), perform "Bid Action".
4.  Result: Inject listing ID into `feed:foryou:{segment}` or `search:promoted`.

### C. Safety & Fraud Layer
**Synchronous (Blocking)**:
*   **Listing Creation**: Text analysis for prohibited keywords.
*   **Chat**: Regex/AI check for off-platform diversion ("add line").

**Asynchronous (Non-blocking)**:
*   **Image Analysis**: Condition scoring, duplicate image detection (Perceptual Hash).
*   **Trust Score Update**: Recalculate nightly based on reviews and report history.

---

## 5. Event Flows (Key User Journeys)

### Scenario: Posting a Listing (Snap & Sell)
1.  **User** uploads image to `Upload Endpoint`.
2.  **API** saves raw image to S3 (tmp bucket).
3.  **Event** `image.uploaded` emitted.
4.  **AI Image Worker** picks up event:
    *   Classifies Category (Mobile).
    *   Analyzes Condition (Scratches detected -> Score 85).
    *   Generates Auto-Description.
5.  **Frontend** receives callback via WebSocket with pre-filled form.
6.  **User** confirms/edits and clicks "Publish".
7.  **Listing Service** saves to DB.
8.  **Search Service** indexes the new item.

### Scenario: "For You" Feed Generation
1.  **App** requests `GET /feed/foryou`.
2.  **Recommendation Engine**:
    *   Fetches `UserBehavior` (recent clicks, search history) from Redis/Feature Store.
    *   Queries **Vector DB** for items similar to recent interactions (Candidate Generation).
    *   Queries **Trend Service** for global hot items.
    *   **Re-Ranking Model** (XGBoost/LightGBM) scores candidates based on probability of click.
3.  **API** returns sorted list of products.

---

## 6. Infrastructure & Deployment

### Cloud Native (AWS/GCP)
*   **Kubernetes (EKS/GKE)**: Orchestration for all microservices.
    *   *Autoscaling (HPA)* based on CPU/Memory and custom metrics (Request Queue Depth).
*   **Terraform**: All infra defined as code (VPC, RDS, Redis, IAM).
*   **CI/CD (GitHub Actions)**:
    *   PR -> Unit Tests -> Build Docker Image -> Push ECR.
    *   Merge Main -> Deploy to Staging -> Integration Tests.
    *   Tag Release -> Deploy to Prod (Canary Deployment).

### Scalability Strategy
*   **Read-Heavy Paths** (Feed, Search): Extensive CDN caching for static assets. API response caching (Varnish/Redis) for public endpoints.
*   **Write-Heavy Paths** (Analytics): Async processing via Kafka buffer prevents database overwhelming.
*   **Database**: Sharding `Listings` table by `Category` or `Region` if rows > 100M.

---

## 7. Security & Privacy

*   **Encryption**:
    *   At Rest: AES-256 for all DB volumes and S3 buckets.
    *   In Transit: TLS 1.3 for all internal/external traffic.
*   **PII Protection**:
    *   Phone numbers and Citizen IDs stored in isolated vault (Tokenization).
    *   Access logs masked (`081-xxx-xxxx`).
*   **Bot Protection**:
    *   WAF (Web Application Firewall) limits rate of calls.
    *   Captcha challenge on suspicious Login/Register patterns.
*   **Audit**:
    *   Immutable logs for all "Trust Score" changes and "Transaction" events.
