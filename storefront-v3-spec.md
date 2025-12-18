# JaiKod Storefront V3 - Technical Specification

## 1. Overview
This feature upgrades the "Seller Profile" into a full-fledged "Storefront" (Mini-site) experience. It differentiates between **General Stores** (Personal/SME) and **Official Stores** (Verified Brands) and introduces a robust Merchant Admin Panel with AI capabilities.

## 2. Data Model & Schema Updates

### 2.1 Store (Evolution of SellerProfile)
```typescript
interface Store {
  id: string;
  owner_id: string;
  slug: string; // Unique, SEO-friendly (e.g., 'samsung-official')
  name: string;
  type: 'general' | 'official';
  
  // Branding
  logo_url: string;
  cover_url: string;
  tagline: string;
  description: string;
  theme_settings: {
    primary_color: string;
    template_id: 'standard' | 'minimal' | 'brand-focus';
    banner_images: string[]; // Carousel
  };

  // Verification & Trust
  verified_status: 'unverified' | 'pending' | 'verified';
  verified_docs: { doc_url: string; type: string; uploaded_at: Date }[];
  trust_score: number; // 0-100
  seller_level: 'new' | 'standard' | 'pro' | 'official';
  badges: string[]; // ['fast_shipping', 'top_rated', 'official']

  // Ops Info
  contact_email: string;
  contact_phone: string;
  location: {
    province: string;
    district: string;
    formatted_address: string;
    coordinates?: { lat: number; lng: number };
  };
  shipping_info: {
    methods: string[];
    avg_prep_time_hours: number;
    return_policy: string;
  };

  // Stats (Denormalized for read performance)
  followers_count: number;
  sales_count: number;
  rating_avg: number;
  response_rate: number;
  response_time_minutes: number;

  created_at: Date;
  updated_at: Date;
}
```

### 2.2 Store Staff (RBAC)
```typescript
interface StoreStaff {
  id: string;
  store_id: string;
  user_id: string;
  role: 'owner' | 'manager' | 'editor' | 'analyst';
  status: 'active' | 'invited';
}
```

### 2.3 Promotions
```typescript
interface Promotion {
  id: string;
  store_id: string;
  type: 'discount_code' | 'flash_sale' | 'bundle';
  name: string;
  
  // Logic
  code?: string; // for coupons
  discount_type: 'percent' | 'fixed_amount';
  discount_value: number;
  min_spend?: number;
  bundle_products?: string[]; // IDs
  
  start_at: Date;
  end_at: Date;
  usage_limit: number;
  usage_count: number;
  status: 'scheduled' | 'active' | 'ended' | 'disabled';
}
```

---

## 3. Public Storefront UI (Customer Facing)
**URL:** `/shop/[slug]`

### 3.1 Layout Structure
- **Header:** Sticky nav + Hero Banner (Cover Image + Logo overlap).
- **Info Bar:** Trust Score, Badge (Official), Stats (Rate, Followers, Sales).
- **Navigation Tabs:**
  1.  **Home:** Featured Carousel, "Top Picks" (AI or Manual), New Arrivals.
  2.  **Products:** Grid with faceted search (Cat, Price, Sort).
  3.  **Promotions:** List of active coupons/bundles.
  4.  **About:** Description, Map, Reviews.
- **Floating CTA:** "Chat with Shop" (pulsing).

### 3.2 Components
- `StoreHeader`: Adaptable based on theme (Standard/Official).
- `PromoCarousel`: Slider for banners.
- `ProductShowcase`: Grid for "Best Sellers" or "Flash Sale".
- `StoreFilterSidebar`: Dedicated filters for this store's inventory.

---

## 4. Merchant Admin Panel (Store Owner)
**URL:** `/seller/dashboard` (redirects to specific store context)

### 4.1 Features
- **Dashboard:**
    - Graphs: Revenue (Daily/Monthly), Visitors.
    - Action Items: "3 Orders to ship", "1 Low stock".
    - **AI Insight Card:** "Your 'iPhone Case' has high clicks but low sales. Consider lowering price by 5%."
- **Product Manager:**
    - Bulk Actions: Delete, Hide, Change Price.
    - **Smart Upload:** (Already implemented V1, enhance for V3).
- **Promotions:**
    - Campaign Scheduler.
    - **AI Suggestion:** "Create a Flash Sale for 'Old Stock' items this Friday."
- **Design Studio:**
    - Theme Picker.
    - Banner Uploader with simple AI Crop/Enhance.

---

## 5. API Endpoints

### Public
- `GET /api/v1/stores/{slug}`: Fetch store public profile.
- `GET /api/v1/stores/{slug}/products`: List products with store-scoped filters.
- `POST /api/v1/stores/{slug}/follow`: Follow toggle.

### Private (Merchant)
- `GET /api/v1/seller/stats`: Dashboard metrics.
- `POST /api/v1/seller/promotions`: Create campaign.
- `PUT /api/v1/seller/settings`: Update theme/info.
- `POST /api/v1/seller/verify`: Submit official docs.

---

## 6. AI Hooks & Automation
1.  **Auto-Highlight:** Cron job analyzes `click_through_rate` of products daily. Top 5 items are auto-added to "Trending" section if not manually overridden.
2.  **Smart Pricing:** On product edit, call `AIPriceService` to compare with category benchmark.
3.  **Chat Auto-Reply:** NLP classifier on incoming message. If "Is this available?", check stock -> Reply "Yes/No".
4.  **Banner Generation:** (Future) Text-to-Image generation for simple promo banners using store theme colors.
