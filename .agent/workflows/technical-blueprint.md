---
description: JaiKod.com - Technical Blueprint & System Architecture
---

# 🏗️ JaiKod.com - Technical Blueprint

## 📊 1. Database Structure Design

### Core Tables

#### **Users Table**
```sql
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    
    -- Profile
    display_name VARCHAR(100),
    avatar_url TEXT,
    bio TEXT,
    
    -- Address (Thai format)
    address_line1 VARCHAR(255),
    subdistrict VARCHAR(100),  -- ตำบล
    district VARCHAR(100),      -- อำเภอ
    province VARCHAR(100),      -- จังหวัด
    postal_code VARCHAR(10),    -- รหัสไปรษณีย์
    
    -- Trust & Verification
    verification_level VARCHAR(20) DEFAULT 'unverified',
    -- Values: unverified, email_verified, phone_verified, id_verified, bank_verified
    trust_score INTEGER DEFAULT 50, -- 0-100, calculated by AI
    verified_badges JSONB DEFAULT '[]', -- ["phone", "id_card", "bank"]
    
    -- AI Features
    behavior_vector VECTOR(512), -- For personalization (pgvector)
    risk_score INTEGER DEFAULT 0, -- 0-100, scam detection
    
    -- Stats
    total_sales INTEGER DEFAULT 0,
    total_purchases INTEGER DEFAULT 0,
    avg_rating DECIMAL(3,2) DEFAULT 0,
    response_rate DECIMAL(5,2) DEFAULT 0, -- Percentage
    avg_response_time INTEGER, -- In minutes
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_active_at TIMESTAMP,
    
    -- Soft delete
    deleted_at TIMESTAMP
);

CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_trust_score ON users(trust_score);
CREATE INDEX idx_users_verification_level ON users(verification_level);
```

#### **Products Table**
```sql
CREATE TABLE products (
    id BIGSERIAL PRIMARY KEY,
    seller_id BIGINT REFERENCES users(id),
    
    -- Basic Info
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category_id INTEGER REFERENCES categories(id),
    subcategory_id INTEGER,
    
    -- Pricing
    price DECIMAL(10,2) NOT NULL,
    original_price DECIMAL(10,2), -- For "was/now" display
    currency VARCHAR(3) DEFAULT 'THB',
    
    -- Condition
    condition VARCHAR(20) NOT NULL,
    -- Values: new, like_new, good, fair, poor
    
    -- AI Generated Data
    ai_suggested_category INTEGER,
    ai_suggested_price DECIMAL(10,2),
    ai_price_confidence DECIMAL(5,2), -- 0-100%
    ai_tags JSONB DEFAULT '[]', -- ["vintage", "nike", "streetwear"]
    ai_extracted_brand VARCHAR(100),
    ai_extracted_model VARCHAR(100),
    ai_quality_score INTEGER, -- 0-100, listing quality
    
    -- Images
    images JSONB NOT NULL DEFAULT '[]',
    -- [{"url": "...", "order": 1, "is_primary": true}]
    thumbnail_url TEXT,
    
    -- Location
    location_province VARCHAR(100),
    location_district VARCHAR(100),
    latitude DECIMAL(10,8),
    longitude DECIMAL(11,8),
    
    -- Shipping
    shipping_methods JSONB DEFAULT '[]',
    -- [{"method": "kerry", "price": 45, "days": "1-2"}]
    can_ship BOOLEAN DEFAULT true,
    can_pickup BOOLEAN DEFAULT false,
    
    -- Status
    status VARCHAR(20) DEFAULT 'draft',
    -- Values: draft, active, sold, reserved, removed, banned
    
    -- Engagement
    views_count INTEGER DEFAULT 0,
    favorites_count INTEGER DEFAULT 0,
    shares_count INTEGER DEFAULT 0,
    
    -- SEO
    slug VARCHAR(255) UNIQUE,
    meta_description TEXT,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    published_at TIMESTAMP,
    sold_at TIMESTAMP,
    
    -- Soft delete
    deleted_at TIMESTAMP
);

CREATE INDEX idx_products_seller ON products(seller_id);
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_status ON products(status);
CREATE INDEX idx_products_price ON products(price);
CREATE INDEX idx_products_created ON products(created_at DESC);
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_location ON products(location_province, location_district);

-- Full-text search
CREATE INDEX idx_products_search ON products USING GIN(
    to_tsvector('thai', title || ' ' || COALESCE(description, ''))
);
```

#### **Categories Table**
```sql
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name_th VARCHAR(100) NOT NULL,
    name_en VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    icon VARCHAR(50), -- Emoji or icon name
    parent_id INTEGER REFERENCES categories(id),
    order_index INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    
    -- AI Training
    ai_keywords JSONB DEFAULT '[]',
    -- Keywords for AI category detection
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO categories (name_th, name_en, slug, icon) VALUES
('มือถือและแท็บเล็ต', 'Mobiles & Tablets', 'mobiles', '📱'),
('กล้องและอุปกรณ์', 'Cameras', 'cameras', '📷'),
('แฟชั่น', 'Fashion', 'fashion', '👕'),
('ของตะแต่งบ้าน', 'Home Decor', 'home-decor', '🏠'),
('คอมพิวเตอร์และ IT', 'Computers & IT', 'computers', '💻'),
('ของสะสม', 'Collectibles', 'collectibles', '🎨'),
('กีฬาและกิจกรรมกลางแจ้ง', 'Sports & Outdoors', 'sports', '⚽'),
('เครื่องใช้ไฟฟ้า', 'Electronics', 'electronics', '🔌'),
('หนังสือและนิตยสาร', 'Books & Magazines', 'books', '📚'),
('ของเล่นและเกม', 'Toys & Games', 'toys', '🎮'),
('อื่นๆ', 'Others', 'others', '📦');
```

#### **Offers Table** (ระบบต่อรองราคา)
```sql
CREATE TABLE offers (
    id BIGSERIAL PRIMARY KEY,
    product_id BIGINT REFERENCES products(id),
    buyer_id BIGINT REFERENCES users(id),
    seller_id BIGINT REFERENCES users(id),
    
    -- Offer Details
    offer_price DECIMAL(10,2) NOT NULL,
    message TEXT,
    
    -- Status
    status VARCHAR(20) DEFAULT 'pending',
    -- Values: pending, accepted, rejected, counter_offered, expired, withdrawn
    
    -- Counter Offer
    counter_price DECIMAL(10,2),
    counter_message TEXT,
    
    -- AI Insights
    ai_fair_price BOOLEAN, -- Is this offer fair based on market data?
    ai_acceptance_probability DECIMAL(5,2), -- Likelihood seller will accept
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    responded_at TIMESTAMP,
    expires_at TIMESTAMP DEFAULT (CURRENT_TIMESTAMP + INTERVAL '48 hours')
);

CREATE INDEX idx_offers_product ON offers(product_id);
CREATE INDEX idx_offers_buyer ON offers(buyer_id);
CREATE INDEX idx_offers_seller ON offers(seller_id);
CREATE INDEX idx_offers_status ON offers(status);
```

#### **Conversations & Messages Table**
```sql
CREATE TABLE conversations (
    id BIGSERIAL PRIMARY KEY,
    product_id BIGINT REFERENCES products(id),
    buyer_id BIGINT REFERENCES users(id),
    seller_id BIGINT REFERENCES users(id),
    
    -- Status
    status VARCHAR(20) DEFAULT 'active',
    -- Values: active, archived, blocked
    
    -- Last Message
    last_message_at TIMESTAMP,
    last_message_preview TEXT,
    
    -- Unread Count
    buyer_unread_count INTEGER DEFAULT 0,
    seller_unread_count INTEGER DEFAULT 0,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(product_id, buyer_id, seller_id)
);

CREATE TABLE messages (
    id BIGSERIAL PRIMARY KEY,
    conversation_id BIGINT REFERENCES conversations(id),
    sender_id BIGINT REFERENCES users(id),
    
    -- Content
    message_type VARCHAR(20) DEFAULT 'text',
    -- Values: text, image, offer, system
    content TEXT NOT NULL,
    attachments JSONB DEFAULT '[]',
    
    -- AI Moderation
    ai_sentiment VARCHAR(20), -- positive, neutral, negative, suspicious
    ai_flagged BOOLEAN DEFAULT false,
    ai_flag_reason TEXT,
    
    -- Status
    is_read BOOLEAN DEFAULT false,
    read_at TIMESTAMP,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);

CREATE INDEX idx_messages_conversation ON messages(conversation_id);
CREATE INDEX idx_messages_sender ON messages(sender_id);
CREATE INDEX idx_messages_created ON messages(created_at DESC);
```

#### **Reviews Table**
```sql
CREATE TABLE reviews (
    id BIGSERIAL PRIMARY KEY,
    product_id BIGINT REFERENCES products(id),
    reviewer_id BIGINT REFERENCES users(id),
    reviewee_id BIGINT REFERENCES users(id),
    transaction_id BIGINT,
    
    -- Rating
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    review_text TEXT,
    
    -- Review Type
    review_type VARCHAR(20) NOT NULL,
    -- Values: buyer_to_seller, seller_to_buyer
    
    -- AI Analysis
    ai_sentiment VARCHAR(20),
    ai_authenticity_score INTEGER, -- 0-100, detect fake reviews
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_reviews_reviewee ON reviews(reviewee_id);
CREATE INDEX idx_reviews_product ON reviews(product_id);
```

#### **AI Analytics Tables**

```sql
-- Product Embeddings (for semantic search)
CREATE TABLE product_embeddings (
    product_id BIGINT PRIMARY KEY REFERENCES products(id),
    title_embedding VECTOR(768),
    description_embedding VECTOR(768),
    image_embedding VECTOR(512),
    combined_embedding VECTOR(1024),
    
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_product_embeddings_combined 
ON product_embeddings USING ivfflat (combined_embedding vector_cosine_ops);

-- Search Analytics
CREATE TABLE search_logs (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id),
    query TEXT NOT NULL,
    query_type VARCHAR(20), -- text, image, voice
    
    -- Results
    results_count INTEGER,
    clicked_product_id BIGINT,
    click_position INTEGER,
    
    -- AI Processing
    ai_interpreted_query TEXT,
    ai_extracted_filters JSONB,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Price History (for AI price suggestions)
CREATE TABLE price_history (
    id BIGSERIAL PRIMARY KEY,
    product_id BIGINT REFERENCES products(id),
    price DECIMAL(10,2) NOT NULL,
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 🤖 2. AI Workflow Integration

### A. Snap & Sell Workflow

```
┌─────────────────────────────────────────────────────────────┐
│                    USER UPLOADS IMAGE(S)                    │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│              FRONTEND: Image Preprocessing                  │
│  - Resize to max 2048px                                     │
│  - Compress to < 5MB                                        │
│  - Convert to JPEG/WebP                                     │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│         BACKEND API: POST /api/ai/analyze-product           │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                  AI SERVICE ORCHESTRATOR                    │
│                                                             │
│  Parallel Processing:                                       │
│  ┌──────────────────┐  ┌──────────────────┐               │
│  │ Google Vision API│  │ Custom ML Model  │               │
│  │ - Object Detection│  │ - Brand Detection│               │
│  │ - Label Detection│  │ - Condition Score│               │
│  │ - Text Detection │  │ - Category Pred. │               │
│  └──────────────────┘  └──────────────────┘               │
│           │                      │                          │
│           └──────────┬───────────┘                          │
│                      ▼                                      │
│           ┌──────────────────┐                             │
│           │ Result Aggregator│                             │
│           │ - Confidence Score│                             │
│           │ - Conflict Resolve│                             │
│           └──────────────────┘                             │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│              PRICE SUGGESTION SERVICE                       │
│  - Query similar products from DB                           │
│  - Calculate price range using XGBoost model                │
│  - Return: min, max, recommended, confidence                │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                   RESPONSE TO FRONTEND                      │
│  {                                                          │
│    "title": "Nike Air Jordan 1 High OG",                    │
│    "category": "fashion",                                   │
│    "subcategory": "sneakers",                               │
│    "brand": "Nike",                                         │
│    "condition": "like_new",                                 │
│    "tags": ["sneakers", "nike", "jordan", "streetwear"],   │
│    "price_suggestion": {                                    │
│      "min": 3500,                                           │
│      "max": 5500,                                           │
│      "recommended": 4500,                                   │
│      "confidence": 0.87                                     │
│    },                                                       │
│    "confidence_scores": {                                   │
│      "title": 0.92,                                         │
│      "category": 0.95,                                      │
│      "brand": 0.88                                          │
│    }                                                        │
│  }                                                          │
└─────────────────────────────────────────────────────────────┘
```

### B. Semantic Search Workflow

```
USER QUERY: "ชุดใส่ไปงานแต่ง ธีมสีชมพู งบไม่เกิน 2000"
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│              NLP PROCESSING (Thai Language)                 │
│  - Tokenization (pythainlp)                                 │
│  - Intent Classification                                    │
│  - Entity Extraction:                                       │
│    • Event: งานแต่ง (wedding)                              │
│    • Color: สีชมพู (pink)                                  │
│    • Budget: < 2000 THB                                     │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│              QUERY EXPANSION & EMBEDDING                    │
│  - Expand: งานแต่ง → [งานแต่งงาน, งานเลี้ยง, formal]      │
│  - Generate embedding using Sentence-BERT                   │
│  - Query vector: [0.23, -0.45, 0.67, ...]                  │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                 HYBRID SEARCH EXECUTION                     │
│                                                             │
│  ┌─────────────────┐         ┌──────────────────┐         │
│  │ Vector Search   │         │ Keyword Search   │         │
│  │ (Semantic)      │         │ (Elasticsearch)  │         │
│  │                 │         │                  │         │
│  │ Find similar    │         │ Match: ชุด, สีชมพู│         │
│  │ products by     │         │ Filter: price<2000│         │
│  │ meaning         │         │                  │         │
│  └────────┬────────┘         └────────┬─────────┘         │
│           │                           │                    │
│           └───────────┬───────────────┘                    │
│                       ▼                                    │
│            ┌──────────────────┐                           │
│            │ Result Fusion    │                           │
│            │ (RRF Algorithm)  │                           │
│            └──────────────────┘                           │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                  AI RE-RANKING                              │
│  - User preferences (past clicks, purchases)                │
│  - Seller trust score                                       │
│  - Listing quality score                                    │
│  - Recency boost                                            │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
                  RETURN RESULTS
```

### C. Trust & Safety Workflow

```
┌─────────────────────────────────────────────────────────────┐
│              REAL-TIME MONITORING TRIGGERS                  │
│  - New user registration                                    │
│  - Product listing created                                  │
│  - Message sent                                             │
│  - Transaction initiated                                    │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                  AI RISK ASSESSMENT                         │
│                                                             │
│  User Behavior Analysis:                                    │
│  ✓ Account age                                              │
│  ✓ Verification status                                      │
│  ✓ Transaction history                                      │
│  ✓ Review ratings                                           │
│  ✓ Response time patterns                                   │
│  ✓ Device fingerprint                                       │
│  ✓ IP reputation                                            │
│                                                             │
│  Content Analysis:                                          │
│  ✓ Message sentiment (NLP)                                  │
│  ✓ Scam keyword detection                                   │
│  ✓ Image reverse search                                     │
│  ✓ Price anomaly detection                                  │
│                                                             │
│  Risk Score: 0-100                                          │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
                    DECISION TREE
                         │
        ┌────────────────┼────────────────┐
        │                │                │
    Score < 30      30 ≤ Score < 70   Score ≥ 70
        │                │                │
        ▼                ▼                ▼
    ┌───────┐      ┌──────────┐     ┌──────────┐
    │ ALLOW │      │  FLAG    │     │  BLOCK   │
    │       │      │ for      │     │ + Notify │
    │       │      │ Review   │     │  Admin   │
    └───────┘      └──────────┘     └──────────┘
```

---

## 🛠️ 3. Recommended Tech Stack

### **Frontend Stack**

```yaml
Framework: Next.js 14+ (App Router)
  Why: 
    - Server-side rendering (SEO-friendly)
    - Image optimization
    - API routes
    - Fast page loads

Styling: Tailwind CSS + shadcn/ui
  Why:
    - Rapid development
    - Consistent design system
    - Pre-built accessible components

State Management: Zustand + React Query
  Why:
    - Simple, lightweight
    - Excellent caching
    - Optimistic updates

Real-time: Socket.io Client
  Why:
    - Chat messaging
    - Live notifications
    - Offer updates

Image Upload: react-dropzone + Uppy
  Why:
    - Drag & drop
    - Progress tracking
    - Multiple files

Maps: Mapbox GL JS
  Why:
    - Beautiful maps
    - Custom styling
    - Location picker
```

### **Backend Stack**

```yaml
API Server: FastAPI (Python) or NestJS (Node.js)
  
  Option A - FastAPI (Recommended for AI-heavy):
    Pros:
      - Native Python (easy AI integration)
      - Fast performance
      - Auto-generated API docs
      - Async support
    
  Option B - NestJS (Recommended for real-time):
    Pros:
      - TypeScript
      - Excellent WebSocket support
      - Modular architecture
      - Large ecosystem

Database:
  Primary: PostgreSQL 15+
    - Reliable, mature
    - JSON support (JSONB)
    - Full-text search
    - pgvector extension (vector search)
  
  Cache: Redis
    - Session storage
    - Rate limiting
    - Real-time data
    - Job queues

Search Engine: Elasticsearch or Meilisearch
  Elasticsearch:
    - Powerful, scalable
    - Complex queries
    - Analytics
  
  Meilisearch:
    - Easier to setup
    - Fast out-of-the-box
    - Good for MVP

Vector Database: Pinecone or pgvector
  Pinecone:
    - Managed service
    - Easy to use
    - Scalable
  
  pgvector:
    - Free
    - Integrated with PostgreSQL
    - Good for small-medium scale

Message Queue: BullMQ (Redis-based)
  - Background jobs
  - Email sending
  - AI processing
  - Image optimization

File Storage: AWS S3 or Cloudflare R2
  - Product images
  - User avatars
  - Documents
```

### **AI/ML Stack**

```yaml
Computer Vision:
  - Google Cloud Vision API (primary)
  - Azure Computer Vision (backup)
  - Custom models: PyTorch + Hugging Face

NLP (Thai Language):
  - pythainlp (Thai tokenization)
  - Sentence-BERT (multilingual)
  - OpenAI GPT-4 (chat assistant)

Price Prediction:
  - XGBoost
  - scikit-learn
  - pandas, numpy

Fraud Detection:
  - scikit-learn (Isolation Forest)
  - Custom neural network

Model Serving:
  - FastAPI endpoints
  - TensorFlow Serving (for heavy models)
  - ONNX Runtime (optimization)
```

### **Infrastructure**

```yaml
Hosting:
  Frontend: Vercel (Next.js optimized)
  Backend: 
    - AWS EC2 / ECS (flexible)
    - Google Cloud Run (serverless)
    - Railway (easy deployment)
  
  Database: 
    - Supabase (PostgreSQL + Auth)
    - AWS RDS
    - Neon (serverless PostgreSQL)

CDN: Cloudflare
  - Fast global delivery
  - DDoS protection
  - Image optimization

Monitoring:
  - Sentry (error tracking)
  - LogRocket (session replay)
  - Grafana + Prometheus (metrics)

CI/CD:
  - GitHub Actions
  - Automated testing
  - Deployment pipelines
```

---

## 📡 4. API Architecture

### **RESTful API Endpoints**

```
Authentication:
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/logout
POST   /api/auth/refresh
POST   /api/auth/verify-email
POST   /api/auth/forgot-password

Users:
GET    /api/users/:id
PUT    /api/users/:id
GET    /api/users/:id/listings
GET    /api/users/:id/reviews
POST   /api/users/:id/verify (KYC)

Products:
GET    /api/products (list with filters)
POST   /api/products (create)
GET    /api/products/:id
PUT    /api/products/:id
DELETE /api/products/:id
POST   /api/products/:id/favorite
GET    /api/products/:id/similar

AI Features:
POST   /api/ai/analyze-image (Snap & Sell)
POST   /api/ai/suggest-price
POST   /api/ai/visual-search
GET    /api/ai/recommendations

Search:
GET    /api/search?q=...&filters=...
POST   /api/search/semantic

Offers:
POST   /api/offers (create offer)
GET    /api/offers/:id
PUT    /api/offers/:id/accept
PUT    /api/offers/:id/reject
PUT    /api/offers/:id/counter

Messages:
GET    /api/conversations
GET    /api/conversations/:id/messages
POST   /api/conversations/:id/messages
PUT    /api/messages/:id/read

Reviews:
POST   /api/reviews
GET    /api/reviews?user_id=...
```

### **WebSocket Events**

```javascript
// Client → Server
socket.emit('join_conversation', { conversationId })
socket.emit('send_message', { conversationId, content })
socket.emit('typing', { conversationId })

// Server → Client
socket.on('new_message', (message) => {})
socket.on('user_typing', (userId) => {})
socket.on('offer_received', (offer) => {})
socket.on('offer_accepted', (offer) => {})
```

---

## 🔐 5. Security Best Practices

```yaml
Authentication:
  - JWT tokens (access + refresh)
  - HttpOnly cookies
  - CSRF protection
  - Rate limiting

Data Protection:
  - Bcrypt password hashing
  - Encryption at rest (S3)
  - SSL/TLS (HTTPS only)
  - Input sanitization

API Security:
  - API key authentication
  - Request signing
  - IP whitelisting (admin)
  - DDoS protection (Cloudflare)

Privacy:
  - GDPR compliance
  - Data anonymization
  - Right to deletion
  - Consent management
```

---

## 📦 6. Development Workflow

```bash
# Project Structure
jaikod/
├── frontend/              # Next.js app
│   ├── app/              # App router pages
│   ├── components/       # React components
│   ├── lib/              # Utilities
│   └── public/           # Static assets
│
├── backend/              # FastAPI or NestJS
│   ├── api/              # API routes
│   ├── services/         # Business logic
│   ├── models/           # Database models
│   ├── ai/               # AI services
│   └── utils/            # Helpers
│
├── ml/                   # Machine learning
│   ├── models/           # Trained models
│   ├── training/         # Training scripts
│   └── notebooks/        # Jupyter notebooks
│
├── database/
│   ├── migrations/       # SQL migrations
│   └── seeds/            # Sample data
│
└── docker/               # Docker configs
```

---

## 🚀 Deployment Checklist

```markdown
Phase 1: MVP Setup
- [ ] Setup PostgreSQL + pgvector
- [ ] Deploy Next.js to Vercel
- [ ] Deploy FastAPI to Cloud Run
- [ ] Configure S3 bucket
- [ ] Setup Redis cache
- [ ] Integrate Google Vision API

Phase 2: AI Integration
- [ ] Train category classification model
- [ ] Implement price prediction
- [ ] Setup vector search
- [ ] Deploy semantic search

Phase 3: Production Ready
- [ ] Setup monitoring (Sentry)
- [ ] Configure CDN (Cloudflare)
- [ ] Load testing
- [ ] Security audit
- [ ] Backup strategy
```

---

**Document Version:** 1.0  
**Last Updated:** 2025-12-06  
**Status:** Ready for Development 🚀
