# 📊 JaiKod Database Schema & AI Search Enhancement

## Complete Database Structure Analysis
*วิเคราะห์โครงสร้างฐานข้อมูลและแนวทางพัฒนา AI Search*

---

## 📁 Firestore Collections Overview

### Core Collections (Production Ready)

| Collection | Description | Status | Search Priority |
|------------|-------------|--------|-----------------|
| `users` | User accounts & profiles | ✅ Active | 🟡 Medium |
| `products` | Legacy product listings | ✅ Active | 🔴 High |
| `listings` | New unified listings (AI) | ✅ Active | 🔴 High |
| `stores` | Seller shops/profiles | ✅ Active | 🟡 Medium |
| `orders` | Purchase transactions | ✅ Active | 🟢 Low |
| `conversations` | Chat threads | ✅ Active | 🟢 Low |
| `messages` | Chat messages | ✅ Active | 🟢 Low |
| `reviews` | Product/seller reviews | ✅ Active | 🟡 Medium |
| `wishlists` | User saved items | ✅ Active | 🟢 Low |
| `notifications` | User notifications | ✅ Active | 🟢 Low |

### Support Collections

| Collection | Description | Status |
|------------|-------------|--------|
| `categories` | Product categories | ✅ Active |
| `promotions` | Discount codes/sales | ✅ Active |
| `payouts` | Seller withdrawals | ✅ Active |
| `content_flags` | Moderation reports | ✅ Active |
| `system_logs` | Admin activity logs | ✅ Active |
| `announcements` | System announcements | ✅ Active |
| `background_jobs` | Async job queue | ✅ Active |
| `boosts` | Product promotion boost | ✅ Active |
| `sellers` | Legacy seller data | ⚠️ Deprecated |

### Planned Collections (For AI Search)

| Collection | Description | Priority |
|------------|-------------|----------|
| `search_analytics` | Search queries & clicks | 🔴 High |
| `search_suggestions` | Popular/trending search | 🔴 High |
| `user_preferences` | Personalization data | 🟡 Medium |
| `product_embeddings` | Vector search data | 🟢 Future |

---

## 📋 Detailed Schema Analysis

### 1. Products Collection (Legacy)

```typescript
interface Product {
  id: string
  seller_id: string
  
  // Searchable Fields
  title: string                    // 🔍 Primary search
  title_en?: string                // 🔍 English search
  description: string              // 🔍 Secondary search
  tags: string[]                   // 🔍 Tag search
  
  // Filters
  category_id: string | number     // 🎯 Category filter
  sub_category_id?: string         // 🎯 Subcategory filter
  condition: 'new' | 'like_new' | 'good' | 'fair' | 'poor'  // 🎯 Condition filter
  price: number                    // 🎯 Price filter
  
  // Location
  location_province?: string       // 🎯 Province filter
  location_amphoe?: string
  location_district?: string
  
  // Ranking Signals
  views_count: number              // 📊 Popularity
  favorites_count: number          // 📊 Engagement
  sold_count: number               // 📊 Conversion
  is_best_seller?: boolean         // 📊 Badge
  is_trending?: boolean            // 📊 Badge
  
  // AI Fields (Existing)
  ai_tags?: string[]               // 🤖 AI-generated tags
  ai_image_score?: number          // 🤖 Image quality 0-100
  ai_fraud_score?: number          // 🤖 Risk detection
  ai_price_suggestion?: boolean    // 🤖 Price validation
  
  // Status
  status: 'active' | 'hidden' | 'sold' | 'pending' | 'rejected'
  
  created_at: Date
  updated_at: Date
}
```

### 2. Listings Collection (New AI System)

```typescript
interface UniversalListing {
  id: string
  listing_code: string             // JK-AXXXXX format
  slug: string                     // SEO URL
  
  // Searchable Fields
  title: string                    // 🔍 Primary search
  title_th: string                 // 🔍 Thai search
  title_en?: string                // 🔍 English search
  
  // Category
  category_type: 'car' | 'motorcycle' | 'real_estate' | 'land' | 'mobile' | 'general'
  category_id: number
  subcategory_id?: number
  
  // Pricing
  price: number                    // 🎯 Price filter
  price_negotiable: boolean
  price_type: 'fixed' | 'negotiable' | 'auction' | 'contact_for_price'
  
  // Template-specific Data (Dynamic)
  template_data: {
    // Car
    brand?: string                 // 🔍 Brand search
    model?: string                 // 🔍 Model search
    year?: number                  // 🎯 Year filter
    mileage?: number               // 🎯 Mileage filter
    
    // Real Estate
    property_type?: string
    bedrooms?: number
    area_sqm?: number
    
    // Mobile
    storage?: string
    color?: string
    battery_health?: number
    
    // General
    condition?: string             // 🎯 Condition filter
  }
  
  // Location
  location: {
    province: string               // 🎯 Province filter
    amphoe: string
    district?: string
    coordinates?: { lat, lng }     // 📍 Distance search
  }
  
  // AI Content (Generated)
  ai_content: {
    auto_title: string             // 🤖 AI title
    marketing_copy: {
      headline: string
      selling_points: string[]
      trust_signals: string[]
    }
    seo_keywords: string[]         // 🔍 SEO search
    confidence_score: number       // 🤖 AI confidence
    price_analysis?: {
      market_avg: number
      suggested_price: number
      price_position: 'below' | 'at' | 'above'
    }
  }
  
  // Stats
  stats: {
    views: number                  // 📊 Popularity
    unique_viewers: number
    favorites: number              // 📊 Engagement
    shares: number
    inquiries: number
    offers_received: number
  }
  
  // Seller
  seller_id: string
  seller_info: {
    name: string
    verified: boolean              // 🎯 Verified filter
    trust_score: number            // 📊 Quality signal
    response_rate: number
  }
  
  // Status
  status: 'active' | 'sold' | 'reserved' | 'hidden' | 'expired'
  is_featured: boolean             // 📊 Premium boost
  is_bumped: boolean               // 📊 Recent boost
  
  created_at: Date
  updated_at: Date
  published_at?: Date
  expires_at: Date
}
```

### 3. Stores Collection (Seller Profiles)

```typescript
interface Store {
  id: string
  owner_id: string
  slug: string                     // 🔍 Shop search
  name: string                     // 🔍 Shop name search
  
  // Search Fields
  description?: string             // 🔍 Description search
  tagline?: string
  
  // Trust Signals
  verified_status: 'unverified' | 'pending' | 'verified'
  trust_score: number              // 0-100
  seller_level: 'new' | 'standard' | 'pro' | 'official'
  badges: string[]
  
  // Stats
  followers_count: number          // 📊 Popularity
  sales_count: number              // 📊 Reliability
  rating_avg: number               // 📊 Quality
  rating_count: number
  response_rate: number            // 📊 Service quality
  
  // Location
  location?: {
    province: string
    district: string
    formatted_address: string
  }
  
  created_at: Date
}
```

---

## 🆕 New Collections for AI Search

### 1. Search Analytics Collection

```typescript
// Collection: search_analytics
interface SearchAnalytics {
  id: string
  
  // Query Info
  query: string                    // Original search query
  query_normalized: string         // Lowercase, trimmed
  query_tokens: string[]           // Tokenized for analysis
  
  // User Context
  user_id?: string                 // null for anonymous
  session_id: string
  device_type: 'mobile' | 'desktop' | 'tablet'
  
  // Filters Applied
  filters: {
    category_id?: number
    subcategory_id?: number
    min_price?: number
    max_price?: number
    province?: string
    condition?: string
    sort_by?: string
  }
  
  // Results
  results_count: number
  results_shown: number
  execution_time_ms: number
  
  // User Actions
  clicks: {
    item_id: string
    item_type: 'product' | 'listing'
    position: number
    clicked_at: Date
  }[]
  
  // Outcome
  outcome: 'click' | 'no_click' | 'filter_change' | 'new_search' | 'exit'
  
  // AI Analysis
  detected_intent?: 'browse' | 'compare' | 'buy_now' | 'research'
  detected_category?: number
  detected_brand?: string
  
  created_at: Date
}
```

### 2. Search Suggestions Collection

```typescript
// Collection: search_suggestions
interface SearchSuggestion {
  id: string
  
  // Suggestion Text
  text: string                     // Display text
  text_normalized: string          // For matching
  
  // Type
  type: 'keyword' | 'brand' | 'category' | 'trending' | 'recent'
  
  // Metrics
  search_count: number             // Times searched
  click_through_rate: number       // 0-100
  conversion_rate: number          // 0-100
  
  // Metadata
  category_id?: number
  brand_name?: string
  
  // Ranking
  popularity_score: number         // Calculated
  recency_boost: number            // Time decay
  
  // Status
  is_trending: boolean
  trending_since?: Date
  
  updated_at: Date
}
```

### 3. User Search Preferences

```typescript
// Collection: user_search_preferences
interface UserSearchPreferences {
  user_id: string
  
  // Implicit Preferences (Learned)
  preferred_categories: {
    category_id: number
    weight: number                 // 0-1, based on searches
  }[]
  
  preferred_brands: {
    brand: string
    weight: number
  }[]
  
  price_range: {
    typical_min: number
    typical_max: number
    avg_purchase: number
  }
  
  preferred_provinces: string[]
  
  // Search History
  recent_searches: {
    query: string
    searched_at: Date
      clicked_items: string[]
  }[]
  
  // Behavioral Signals
  browsing_time_avg_seconds: number
  items_viewed_per_session: number
  conversion_rate: number
  
  updated_at: Date
}
```

---

## 🤖 AI Search Enhancement Features

### Phase 1: Intelligent Query Understanding

```typescript
// AI Query Analyzer
interface QueryAnalysis {
  original_query: string
  
  // NLP Processing
  corrected_query?: string         // Spelling fix
  expanded_query: string[]         // Synonyms added
  tokens: string[]                 // Word tokens
  
  // Intent Detection
  intent: {
    type: 'product_search' | 'category_browse' | 'brand_search' | 'price_check' | 'comparison'
    confidence: number
  }
  
  // Entity Extraction
  entities: {
    brand?: string                 // "iPhone" -> Apple
    model?: string                 // "15 Pro Max"
    category?: string              // เสื้อผ้า, รถยนต์
    color?: string
    price_range?: {
      min?: number
      max?: number
      mentioned?: string           // "ไม่เกิน 30000"
    }
    location?: string              // "กรุงเทพ", "ใกล้ฉัน"
    condition?: string             // "มือสอง", "ใหม่"
  }
  
  // Suggested Filters
  auto_filters: {
    category_id?: number
    subcategory_id?: number
    brand?: string
    min_price?: number
    max_price?: number
    condition?: string
  }
}
```

### Phase 2: AI Ranking Algorithm

```typescript
// AI Ranking Score Calculation
interface RankingFactors {
  // Relevance (40%)
  text_match_score: number         // 0-100, title/description match
  semantic_similarity: number      // 0-100, AI embedding distance
  category_match: boolean          // Exact category match
  
  // Quality (25%)
  image_quality_score: number      // 0-100, AI image analysis
  description_quality: number      // 0-100, completeness
  seller_trust_score: number       // 0-100
  
  // Engagement (20%)
  click_through_rate: number       // Historical CTR
  view_to_favorite_ratio: number
  view_to_inquiry_ratio: number
  
  // Freshness (10%)
  recency_score: number            // Days since posted
  last_activity_score: number      // Days since last view
  
  // Boost (5%)
  is_featured: boolean             // Paid promotion
  is_bumped: boolean               // Free boost
  seller_level_boost: number       // Pro/Official sellers
  
  // Final Score
  total_score: number              // Weighted sum
}
```

### Phase 3: Personalization

```typescript
// Personalized Results
interface PersonalizedSearch {
  user_id: string
  query: string
  
  // User Profile Boost
  category_affinity: Map<number, number>  // Category weights
  brand_affinity: Map<string, number>     // Brand weights
  price_preference: { min: number, max: number }
  location_preference: string[]
  
  // Re-ranking
  base_results: SearchResult[]
  personalized_results: SearchResult[]
  
  // Explanations
  personalization_applied: {
    factor: string
    impact: number
    reason: string
  }[]
}
```

---

## 🔧 Implementation: Enhanced Search Service

### Update unified-search.ts

```typescript
// New AI-powered features to add:

class EnhancedSearchService {
  
  // 1. Query Understanding
  async analyzeQuery(query: string): Promise<QueryAnalysis> {
    // Spelling correction
    const corrected = await this.correctSpelling(query)
    
    // Entity extraction
    const entities = this.extractEntities(corrected)
    
    // Intent detection
    const intent = this.detectIntent(corrected, entities)
    
    // Auto-suggest filters
    const autoFilters = this.suggestFilters(entities)
    
    return { corrected, entities, intent, autoFilters }
  }
  
  // 2. Spelling Correction (Thai + English)
  async correctSpelling(query: string): Promise<string> {
    const corrections: Record<string, string> = {
      'iphne': 'iphone',
      'samsug': 'samsung',
      'ไอโพน': 'ไอโฟน',
      'โตโยตา': 'โตโยต้า',
      'ฮอนด้': 'ฮอนด้า'
    }
    // Use fuzzy matching + dictionary
    return FuzzyMatcher.correct(query, corrections)
  }
  
  // 3. Entity Extraction
  extractEntities(query: string): QueryEntities {
    // Brand detection
    const brands = this.detectBrands(query)
    
    // Price mention detection
    const priceRegex = /(?:ไม่เกิน|ต่ำกว่า|under|below)?\s*(\d+(?:,\d+)?(?:k|K|000)?)/
    
    // Location detection
    const locationRegex = /(?:ใกล้ฉัน|กรุงเทพ|เชียงใหม่|ภูเก็ต|...)/
    
    // Condition detection
    const conditionRegex = /(?:มือสอง|มือ1|มือหนึ่ง|ใหม่|second\s*hand|used)/i
    
    return { brands, price, location, condition }
  }
  
  // 4. AI Ranking
  calculateAIScore(item: UnifiedSearchItem, query: string, user?: UserPreferences): number {
    let score = 0
    
    // Text relevance (40%)
    score += this.calculateTextRelevance(item, query) * 0.4
    
    // Quality signals (25%)
    score += this.calculateQualityScore(item) * 0.25
    
    // Engagement (20%)
    score += this.calculateEngagementScore(item) * 0.2
    
    // Freshness (10%)
    score += this.calculateFreshnessScore(item) * 0.1
    
    // Personalization boost (5%)
    if (user) {
      score += this.calculatePersonalizationBoost(item, user) * 0.05
    }
    
    return score
  }
  
  // 5. Search Analytics Tracking
  async trackSearch(event: SearchAnalyticsEvent): Promise<void> {
    await addDoc(collection(db, 'search_analytics'), {
      ...event,
      created_at: serverTimestamp()
    })
    
    // Update suggestion popularity
    if (event.query) {
      await this.updateSuggestionStats(event.query, event.outcome)
    }
  }
}
```

---

## 📊 Firestore Indexes Required

```javascript
// firestore.indexes.json

{
  "indexes": [
    // Products - Search
    {
      "collectionGroup": "products",
      "fields": [
        { "fieldPath": "status", "order": "ASCENDING" },
        { "fieldPath": "category_id", "order": "ASCENDING" },
        { "fieldPath": "price", "order": "ASCENDING" }
      ]
    },
    {
      "collectionGroup": "products",
      "fields": [
        { "fieldPath": "status", "order": "ASCENDING" },
        { "fieldPath": "created_at", "order": "DESCENDING" }
      ]
    },
    
    // Listings - Search
    {
      "collectionGroup": "listings",
      "fields": [
        { "fieldPath": "status", "order": "ASCENDING" },
        { "fieldPath": "category_id", "order": "ASCENDING" },
        { "fieldPath": "price", "order": "ASCENDING" }
      ]
    },
    {
      "collectionGroup": "listings",
      "fields": [
        { "fieldPath": "status", "order": "ASCENDING" },
        { "fieldPath": "location.province", "order": "ASCENDING" },
        { "fieldPath": "created_at", "order": "DESCENDING" }
      ]
    },
    
    // Search Analytics
    {
      "collectionGroup": "search_analytics",
      "fields": [
        { "fieldPath": "query_normalized", "order": "ASCENDING" },
        { "fieldPath": "created_at", "order": "DESCENDING" }
      ]
    },
    
    // Search Suggestions
    {
      "collectionGroup": "search_suggestions",
      "fields": [
        { "fieldPath": "type", "order": "ASCENDING" },
        { "fieldPath": "popularity_score", "order": "DESCENDING" }
      ]
    }
  ]
}
```

---

## 🚀 Implementation Roadmap

### Week 1: Core Infrastructure
- [ ] Create `search_analytics` collection
- [ ] Create `search_suggestions` collection
- [ ] Add Firestore indexes
- [ ] Implement analytics tracking

### Week 2: Query Understanding
- [ ] Spelling correction (Thai + English)
- [ ] Brand detection
- [ ] Price extraction
- [ ] Auto-filter suggestion

### Week 3: AI Ranking
- [ ] Text relevance scoring
- [ ] Quality scoring
- [ ] Engagement scoring
- [ ] Freshness scoring

### Week 4: Personalization
- [ ] User preferences collection
- [ ] Category affinity tracking
- [ ] Personalized re-ranking
- [ ] A/B testing framework

---

## 📈 Expected Improvements

| Metric | Current | Target | Improvement |
|--------|---------|--------|-------------|
| Search CTR | ~15% | 40% | +167% |
| Zero Results | ~20% | <5% | -75% |
| Time to First Click | ~8s | <3s | -63% |
| Relevance Score | Unknown | 4.5/5 | N/A |
| Conversion Rate | ~2% | 5% | +150% |

---

*Document Version: 1.0*
*Created: 2024-12-27*
*Author: JaiKod Development Team*
