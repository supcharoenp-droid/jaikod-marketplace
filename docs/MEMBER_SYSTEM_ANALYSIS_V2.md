# 🔬 JaiKod Member System - Advanced Analysis & Redesign V2

**Version:** 2.0.0  
**Date:** 2025-12-24  
**Status:** Analysis Complete - Ready for Implementation

---

## 📊 Part 1: Current System Analysis

### 1.1 Current Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                    CURRENT JAIKOD MEMBER SYSTEM                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────┐    ┌─────────────────┐                    │
│  │     User        │    │     Seller      │                    │
│  │   (buyer/       │───▶│   Profile       │                    │
│  │    seller)      │    │                 │                    │
│  └─────────────────┘    └─────────────────┘                    │
│           │                     │                               │
│           ▼                     ▼                               │
│  ┌─────────────────┐    ┌─────────────────┐                    │
│  │  sellerType:    │    │    Tier:        │                    │
│  │  - individual   │    │  - starter      │                    │
│  │  - pro          │    │  - rising       │                    │
│  │  - mall         │    │  - established  │                    │
│  └─────────────────┘    │  - power_seller │                    │
│                         │  - top_seller   │                    │
│                         └─────────────────┘                    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 1.2 Existing Types & Structures

| Component | File | Status | Assessment |
|-----------|------|--------|------------|
| User Enhanced | `user.enhanced.ts` | ✅ Complete | Good foundation, needs expansion |
| Seller Enhanced | `seller.enhanced.ts` | ✅ Complete | Needs store type differentiation |
| AuthContext | `AuthContext.tsx` | ⚠️ Basic | Only supports individual/pro/mall |
| Official Store | `official-store.ts` | ❌ Incomplete | Minimal implementation |
| Member Utils | `memberSystemUtils.ts` | ✅ Complete | Well-structured utilities |

### 1.3 Gap Analysis

#### ❌ What's Missing:

1. **แบบที่ 1: ผู้ขายทั่วไป (Individual Seller)**
   - ❌ ระบบ CoinJai Wallet
   - ❌ ระบบ Boost Post พื้นฐาน
   - ⚠️ Dashboard ผู้ขาย (มีบางส่วน)
   - ❌ ระบบรายงานโพสต์ผิดกฎ
   - ⚠️ ระบบรีวิวผู้ขาย (มีบางส่วน)

2. **แบบที่ 2: ร้านค้าออนไลน์ (Online Store)**
   - ❌ การแยก General Store vs Official Store ชัดเจน
   - ❌ ระบบ Custom Dynamic Form Fields
   - ❌ ระบบ Verified Badge
   - ❌ Business Verification Flow
   - ❌ Custom Store Layout
   - ❌ Advanced Promotion Tools

3. **ระบบ CoinJai**
   - ❌ Wallet System
   - ❌ Top-up Flow
   - ❌ Transaction History
   - ❌ Boost Payment Integration

---

## 🏗️ Part 2: New Architecture Design

### 2.1 Complete Member Hierarchy

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         JAIKOD MEMBER SYSTEM V2                          │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │                          BASE USER                                 │ │
│  │   - Authentication (Firebase Auth)                                │ │
│  │   - Profile (Basic Info)                                          │ │
│  │   - Trust Score & KYC Status                                      │ │
│  │   - CoinJai Wallet                                                │ │
│  │   - Notification Preferences                                       │ │
│  └───────────────────────────────────────────────────────────┬───────┘ │
│                                                               │         │
│           ┌───────────────────────────────────────────────────┼───┐     │
│           │                                                   │   │     │
│           ▼                                                   ▼   ▼     │
│  ┌─────────────────┐    ┌─────────────────────────────────────────┐    │
│  │     BUYER       │    │              SELLER                      │    │
│  │                 │    │                                          │    │
│  │  - Wishlist     │    │    ┌─────────────┬─────────────────────┐│    │
│  │  - Orders       │    │    │             │                     ││    │
│  │  - Reviews      │    │    ▼             ▼                     ││    │
│  │  - Loyalty      │    │  ┌─────────┐  ┌───────────────────────┐││    │
│  └─────────────────┘    │  │INDIVIDUAL│  │   STORE SELLER        │││    │
│                         │  │ SELLER   │  │                       ││    │
│                         │  │          │  │  ┌─────────┬────────┐ ││    │
│                         │  │ • Basic  │  │  │         │        │ ││    │
│                         │  │   Listing│  │  │ GENERAL │OFFICIAL│ ││    │
│                         │  │ • Chat   │  │  │  STORE  │ STORE  │ ││    │
│                         │  │ • Boost  │  │  │         │        │ ││    │
│                         │  │ • Review │  │  │ • Shop  │• Verify│ ││    │
│                         │  │          │  │  │   Page  │  Badge │ ││    │
│                         │  └─────────┘  │  │ • Stock │• Flash │ ││    │
│                         │               │  │ • Basic │  Sale  │ ││    │
│                         │               │  │   Promo │• API   │ ││    │
│                         │               │  └─────────┴────────┘ ││    │
│                         │               └───────────────────────┘│    │
│                         └─────────────────────────────────────────┘    │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### 2.2 Seller Type Comparison Matrix

| Feature | Individual | General Store | Official Store |
|---------|------------|---------------|----------------|
| **ลงขายสินค้า** | ✅ | ✅ | ✅ |
| **จำนวนสินค้า** | ไม่จำกัด | ไม่จำกัด | ไม่จำกัด |
| **หน้าร้านค้า** | ❌ | ✅ Basic | ✅ Custom Layout |
| **โลโก้ร้าน** | Avatar Only | ✅ | ✅ |
| **ปกร้าน/Banner** | ❌ | ✅ | ✅ Multi-Banner |
| **ธีมร้าน** | ❌ | ❌ | ✅ Custom Theme |
| **หมวดหมู่ในร้าน** | ❌ | ✅ | ✅ Advanced |
| **คลังสินค้า/Stock** | ❌ Basic | ✅ | ✅ Advanced |
| **ฟอร์มพิเศษ** | Standard | Custom Fields | ✅ Full Custom |
| **Verified Badge** | ❌ | ❌ | ✅ |
| **Flash Sale** | ❌ | ❌ | ✅ |
| **คูปอง/ส่วนลด** | ❌ | ✅ Basic | ✅ Advanced |
| **รายงานขั้นสูง** | ✅ Basic | ✅ | ✅ Premium |
| **API เชื่อมต่อ** | ❌ | ❌ | ✅ |
| **Priority Support** | ❌ | ✅ | ✅ 24/7 |
| **Commission Rate** | 5% | 4% | 3% |

---

## 📋 Part 3: Complete Type Definitions

### 3.1 New Seller Type System

```typescript
// ==========================================
// SELLER TYPE SYSTEM
// ==========================================

export type SellerAccountType = 
  | 'individual'      // ผู้ขายทั่วไป
  | 'general_store'   // ร้านค้าทั่วไป
  | 'official_store'  // ร้านค้าทางการ

export type SellerVerificationStatus = 
  | 'unverified'           // ยังไม่ยืนยัน
  | 'phone_verified'       // ยืนยันเบอร์โทรแล้ว
  | 'id_verified'          // ยืนยันบัตรประชาชนแล้ว
  | 'business_verified'    // ยืนยันธุรกิจแล้ว (Official only)

export interface SellerAccountConfig {
  type: SellerAccountType
  
  // Permissions
  permissions: {
    can_have_storefront: boolean
    can_customize_theme: boolean
    can_create_coupons: boolean
    can_run_flash_sale: boolean
    can_use_api: boolean
    can_add_custom_fields: boolean
    max_products: number | 'unlimited'
    max_images_per_product: number
  }
  
  // Fees
  commission_rate: number
  listing_fee: number
  boost_discount: number
  
  // Requirements
  requirements: {
    min_kyc_level: SellerVerificationStatus
    needs_business_documents: boolean
    needs_bank_verification: boolean
  }
}

// Config for each type
export const SELLER_TYPE_CONFIG: Record<SellerAccountType, SellerAccountConfig> = {
  individual: {
    type: 'individual',
    permissions: {
      can_have_storefront: false,
      can_customize_theme: false,
      can_create_coupons: false,
      can_run_flash_sale: false,
      can_use_api: false,
      can_add_custom_fields: false,
      max_products: 'unlimited',
      max_images_per_product: 10
    },
    commission_rate: 5.0,
    listing_fee: 0,
    boost_discount: 0,
    requirements: {
      min_kyc_level: 'phone_verified',
      needs_business_documents: false,
      needs_bank_verification: false
    }
  },
  
  general_store: {
    type: 'general_store',
    permissions: {
      can_have_storefront: true,
      can_customize_theme: false,
      can_create_coupons: true,
      can_run_flash_sale: false,
      can_use_api: false,
      can_add_custom_fields: true,
      max_products: 'unlimited',
      max_images_per_product: 15
    },
    commission_rate: 4.0,
    listing_fee: 0,
    boost_discount: 10,
    requirements: {
      min_kyc_level: 'id_verified',
      needs_business_documents: false,
      needs_bank_verification: true
    }
  },
  
  official_store: {
    type: 'official_store',
    permissions: {
      can_have_storefront: true,
      can_customize_theme: true,
      can_create_coupons: true,
      can_run_flash_sale: true,
      can_use_api: true,
      can_add_custom_fields: true,
      max_products: 'unlimited',
      max_images_per_product: 20
    },
    commission_rate: 3.0,
    listing_fee: 0,
    boost_discount: 25,
    requirements: {
      min_kyc_level: 'business_verified',
      needs_business_documents: true,
      needs_bank_verification: true
    }
  }
}
```

### 3.2 Individual Seller Complete Type

```typescript
// ==========================================
// INDIVIDUAL SELLER (แบบที่ 1)
// ==========================================

export interface IndividualSeller {
  id: string
  user_id: string
  account_type: 'individual'
  
  // Basic Profile
  display_name: string
  avatar_url?: string
  bio?: string
  phone_verified: boolean
  
  // Location
  location: {
    province: string
    amphoe?: string
    district?: string
    coordinates?: { lat: number, lng: number }
    show_approximate_location: boolean
  }
  
  // Verification
  verification: {
    status: SellerVerificationStatus
    phone_verified_at?: Date
    id_verified_at?: Date
    verified_by?: 'ai' | 'manual'
  }
  
  // Ratings & Trust
  ratings: {
    overall: number           // 0-5
    total_reviews: number
    response_rate: number     // %
    response_time_avg: number // minutes
    positive_rate: number     // %
  }
  
  // Activity Stats
  stats: {
    total_listings: number
    active_listings: number
    sold_items: number
    total_views: number
    total_chats: number
    joined_at: Date
    last_active: Date
  }
  
  // CoinJai
  coinjai: {
    balance: number
    total_earned: number
    total_spent: number
    pending_balance: number
  }
  
  // Settings
  settings: {
    auto_reply_enabled: boolean
    auto_reply_message?: string
    accept_offers: boolean
    min_offer_percentage: number // e.g., 80 = accepts offers 80%+ of asking price
    notification_preferences: NotificationPreferences
  }
  
  // Metadata
  created_at: Date
  updated_at: Date
}

// Individual Seller Listing
export interface IndividualListing {
  id: string
  seller_id: string
  seller_type: 'individual'
  
  // Basic Info
  title: string
  description: string
  category_id: string
  subcategory_id?: string
  
  // Condition (for used items)
  condition: 'new' | 'like_new' | 'good' | 'fair' | 'for_parts'
  condition_notes?: string
  
  // Price
  price: number
  currency: 'THB'
  negotiable: boolean
  min_acceptable_price?: number
  
  // Media
  images: {
    url: string
    thumbnail_url: string
    order: number
    is_primary: boolean
  }[]
  video_url?: string
  
  // Location
  location: {
    province: string
    amphoe?: string
    district?: string
    coordinates?: { lat: number, lng: number }
  }
  
  // Status
  status: 'draft' | 'active' | 'sold' | 'reserved' | 'expired' | 'removed'
  sold_at?: Date
  buyer_id?: string
  
  // Visibility & Boost
  visibility: {
    views: number
    unique_visitors: number
    saved_count: number
    chat_count: number
    share_count: number
  }
  
  boost: {
    is_boosted: boolean
    boost_type?: 'basic' | 'premium' | 'urgent'
    boost_started_at?: Date
    boost_expires_at?: Date
    boost_position?: number
  }
  
  // AI Analysis
  ai_analysis?: {
    suggested_price: { min: number, max: number, suggested: number }
    category_confidence: number
    keywords: string[]
    quality_score: number
    improvement_tips: string[]
  }
  
  // Metadata
  created_at: Date
  updated_at: Date
  expires_at: Date
}
```

### 3.3 Store Seller Complete Type

```typescript
// ==========================================
// STORE SELLER (แบบที่ 2)
// ==========================================

export interface StoreSeller {
  id: string
  user_id: string
  account_type: 'general_store' | 'official_store'
  
  // Store Profile
  store: {
    name: string
    slug: string                // URL-friendly name
    description: string
    short_description?: string
    logo_url: string
    cover_url?: string
    banner_urls?: string[]      // Multiple banners for Official
    
    // Theme (Official only)
    theme?: {
      id: string
      primary_color: string
      secondary_color: string
      layout: 'default' | 'minimal' | 'premium'
      custom_css?: string
    }
  }
  
  // Verification (for Official Store)
  business_verification?: {
    status: 'pending' | 'verified' | 'rejected'
    company_name: string
    registration_number: string  // เลขทะเบียนนิติบุคคล
    tax_id: string              // เลขประจำตัวผู้เสียภาษี
    business_type: 'individual_business' | 'company' | 'partnership'
    verified_at?: Date
    verified_by?: string
    documents: {
      type: 'registration_cert' | 'tax_cert' | 'id_card' | 'authorization_letter'
      url: string
      uploaded_at: Date
      verified: boolean
    }[]
  }
  
  // Store Categories
  categories: {
    id: string
    name: string
    name_en?: string
    slug: string
    parent_id?: string
    order: number
    product_count: number
  }[]
  
  // Inventory Management
  inventory: {
    enabled: boolean
    low_stock_threshold: number
    auto_deactivate_when_out: boolean
    sku_prefix?: string
  }
  
  // Custom Form Fields (for products)
  custom_fields?: {
    id: string
    name: string
    type: 'text' | 'number' | 'select' | 'multiselect' | 'boolean'
    options?: string[]
    required: boolean
    category_ids?: string[]  // Apply to specific categories only
  }[]
  
  // Promotions
  promotions: {
    active_coupons: number
    active_flash_sales: number
    active_bundles: number
  }
  
  // Ratings & Performance
  ratings: {
    overall: number
    product_quality: number
    shipping_speed: number
    customer_service: number
    total_reviews: number
    positive_rate: number
  }
  
  performance: {
    total_products: number
    total_orders: number
    total_revenue: number
    avg_order_value: number
    return_rate: number
    fulfillment_rate: number
    response_time_avg: number
    response_rate: number
  }
  
  // Follower System
  followers: {
    count: number
    new_this_month: number
  }
  
  // CoinJai
  coinjai: {
    balance: number
    total_earned: number
    total_spent: number
    pending_balance: number
  }
  
  // Settings
  settings: {
    operating_hours?: OperatingHours
    shipping: ShippingSettings
    return_policy?: string
    warranty_policy?: string
    auto_reply: {
      enabled: boolean
      message?: string
      outside_hours_message?: string
    }
    vacation_mode: {
      enabled: boolean
      start_date?: Date
      end_date?: Date
      message?: string
    }
  }
  
  // Badges & Certifications
  badges: {
    type: 'verified' | 'top_seller' | 'fast_shipper' | 'eco_friendly' | 'recommended'
    earned_at: Date
    expires_at?: Date
  }[]
  
  // Metadata
  created_at: Date
  updated_at: Date
  last_active: Date
}

// Store Product (extends Individual Listing)
export interface StoreProduct extends Omit<IndividualListing, 'seller_type' | 'condition'> {
  seller_type: 'general_store' | 'official_store'
  store_id: string
  
  // Store-specific
  store_category_id?: string
  
  // Inventory
  inventory: {
    sku?: string
    stock_quantity: number
    reserved_quantity: number
    sold_quantity: number
    low_stock_alert: boolean
    allow_backorder: boolean
  }
  
  // Variants (for Store only)
  has_variants: boolean
  variants?: {
    id: string
    name: string           // e.g., "Size", "Color"
    options: {
      value: string        // e.g., "L", "Red"
      price_adjustment: number
      stock_quantity: number
      sku?: string
      image_url?: string
    }[]
  }[]
  
  // Pricing Options
  pricing: {
    original_price?: number   // ราคาเดิม (show discount)
    sale_price?: number       // ราคาลด
    bulk_pricing?: {
      min_quantity: number
      price_per_unit: number
    }[]
    wholesale_enabled: boolean
    wholesale_min_quantity?: number
    wholesale_price?: number
  }
  
  // Custom Fields
  custom_field_values?: Record<string, any>
  
  // Shipping
  shipping: {
    weight: number          // grams
    dimensions?: {
      length: number
      width: number
      height: number
    }
    free_shipping: boolean
    free_shipping_min_amount?: number
    shipping_methods: string[]
  }
  
  // SEO
  seo?: {
    meta_title?: string
    meta_description?: string
    keywords?: string[]
  }
}
```

### 3.4 CoinJai Wallet System

```typescript
// ==========================================
// COINJAI WALLET SYSTEM
// ==========================================

export interface CoinJaiWallet {
  user_id: string
  
  // Balance
  balance: number              // Current available
  pending_balance: number      // From sales, not yet released
  frozen_balance: number       // Under dispute
  
  // Lifetime Stats
  total_earned: number         // From sales
  total_deposited: number      // Top-ups
  total_spent: number          // Boosts, ads, purchases
  total_withdrawn: number      // To bank
  
  // Last Activities
  last_transaction_at?: Date
  last_topup_at?: Date
  last_withdraw_at?: Date
  
  // Settings
  settings: {
    auto_withdraw: boolean
    auto_withdraw_threshold?: number
    withdrawal_bank_account?: {
      bank_code: string
      account_number: string  // Encrypted
      account_name: string
      verified: boolean
    }
  }
  
  created_at: Date
  updated_at: Date
}

export type CoinJaiTransactionType = 
  | 'topup'           // เติมเงิน
  | 'withdraw'        // ถอนเงิน
  | 'boost_payment'   // จ่ายค่า Boost
  | 'ad_payment'      // จ่ายค่าโฆษณา
  | 'sale_income'     // รายได้จากขาย
  | 'refund'          // คืนเงิน
  | 'bonus'           // โบนัส/โปรโมชั่น
  | 'fee'             // ค่าธรรมเนียม
  | 'transfer_in'     // รับโอน
  | 'transfer_out'    // โอนออก

export interface CoinJaiTransaction {
  id: string
  wallet_id: string
  
  type: CoinJaiTransactionType
  amount: number
  balance_after: number
  
  // Reference
  reference_type?: 'listing' | 'order' | 'boost' | 'ad' | 'withdrawal'
  reference_id?: string
  
  // Description
  title: string
  description?: string
  
  // Status
  status: 'pending' | 'completed' | 'failed' | 'cancelled'
  
  // For topups
  payment_method?: 'credit_card' | 'promptpay' | 'bank_transfer' | 'truemoney'
  payment_ref?: string
  
  // Metadata
  created_at: Date
  completed_at?: Date
  metadata?: Record<string, any>
}

// Top-up packages
export interface CoinJaiTopupPackage {
  id: string
  amount: number
  bonus_amount: number
  price: number
  popular: boolean
  limited_time?: {
    ends_at: Date
    original_bonus: number
  }
}

export const COINJAI_TOPUP_PACKAGES: CoinJaiTopupPackage[] = [
  { id: 'pack_50', amount: 50, bonus_amount: 0, price: 50, popular: false },
  { id: 'pack_100', amount: 100, bonus_amount: 5, price: 100, popular: false },
  { id: 'pack_300', amount: 300, bonus_amount: 30, price: 300, popular: true },
  { id: 'pack_500', amount: 500, bonus_amount: 75, price: 500, popular: false },
  { id: 'pack_1000', amount: 1000, bonus_amount: 200, price: 1000, popular: false },
]
```

### 3.5 Boost System

```typescript
// ==========================================
// BOOST SYSTEM
// ==========================================

export type BoostType = 'basic' | 'premium' | 'urgent' | 'homepage'

export interface BoostPackage {
  id: string
  type: BoostType
  name: string
  name_th: string
  description: string
  
  // Duration
  duration_hours: number
  
  // Pricing
  price_coinjai: number
  
  // Benefits
  visibility_multiplier: number    // e.g., 2x views
  position_boost: boolean          // Show higher in search
  highlight_badge: boolean         // Special badge on listing
  homepage_feature: boolean        // Feature on homepage
  
  // Stats (historical averages)
  avg_view_increase: number        // %
  avg_inquiry_increase: number     // %
}

export const BOOST_PACKAGES: BoostPackage[] = [
  {
    id: 'basic_24h',
    type: 'basic',
    name: 'Basic Boost',
    name_th: 'Boost พื้นฐาน',
    description: 'เพิ่มการมองเห็น 2 เท่า นาน 24 ชั่วโมง',
    duration_hours: 24,
    price_coinjai: 29,
    visibility_multiplier: 2,
    position_boost: true,
    highlight_badge: false,
    homepage_feature: false,
    avg_view_increase: 150,
    avg_inquiry_increase: 80
  },
  {
    id: 'premium_48h',
    type: 'premium',
    name: 'Premium Boost',
    name_th: 'Boost พรีเมียม',
    description: 'เพิ่มการมองเห็น 5 เท่า + ป้ายพิเศษ นาน 48 ชั่วโมง',
    duration_hours: 48,
    price_coinjai: 79,
    visibility_multiplier: 5,
    position_boost: true,
    highlight_badge: true,
    homepage_feature: false,
    avg_view_increase: 400,
    avg_inquiry_increase: 200
  },
  {
    id: 'urgent_24h',
    type: 'urgent',
    name: 'Urgent Sale',
    name_th: 'ขายด่วน!',
    description: 'ป้าย "ขายด่วน" + แสดงบนหน้าแรก 24 ชั่วโมง',
    duration_hours: 24,
    price_coinjai: 149,
    visibility_multiplier: 10,
    position_boost: true,
    highlight_badge: true,
    homepage_feature: true,
    avg_view_increase: 800,
    avg_inquiry_increase: 400
  },
  {
    id: 'homepage_7d',
    type: 'homepage',
    name: 'Homepage Feature',
    name_th: 'แสดงหน้าแรก 7 วัน',
    description: 'แสดงบนหน้าแรก Section "สินค้าแนะนำ" 7 วัน',
    duration_hours: 168,
    price_coinjai: 299,
    visibility_multiplier: 15,
    position_boost: true,
    highlight_badge: true,
    homepage_feature: true,
    avg_view_increase: 2000,
    avg_inquiry_increase: 800
  }
]

export interface ListingBoost {
  id: string
  listing_id: string
  seller_id: string
  
  package: BoostPackage
  
  // Status
  status: 'active' | 'expired' | 'cancelled'
  started_at: Date
  expires_at: Date
  
  // Payment
  amount_paid: number
  transaction_id: string
  
  // Performance
  stats: {
    views_before: number
    views_during: number
    inquiries_before: number
    inquiries_during: number
    saves_during: number
  }
  
  created_at: Date
}
```

### 3.6 Report & Moderation System

```typescript
// ==========================================
// REPORT & MODERATION SYSTEM
// ==========================================

export type ReportReason = 
  | 'fake_product'          // สินค้าปลอม
  | 'misleading_info'       // ข้อมูลเป็นเท็จ
  | 'prohibited_item'       // สินค้าต้องห้าม
  | 'scam'                  // หลอกลวง
  | 'duplicate'             // โพสต์ซ้ำ
  | 'wrong_category'        // ผิดหมวดหมู่
  | 'spam'                  // สแปม
  | 'inappropriate_content' // เนื้อหาไม่เหมาะสม
  | 'copyright'            // ละเมิดลิขสิทธิ์
  | 'other'                 // อื่นๆ

export interface ListingReport {
  id: string
  listing_id: string
  reporter_id: string
  
  reason: ReportReason
  description: string
  evidence_urls?: string[]
  
  // Status
  status: 'pending' | 'reviewing' | 'resolved' | 'dismissed'
  
  // Resolution
  resolution?: {
    action: 'no_action' | 'warning' | 'listing_removed' | 'seller_suspended' | 'seller_banned'
    admin_id: string
    notes: string
    resolved_at: Date
  }
  
  // AI Pre-analysis
  ai_analysis?: {
    risk_score: number       // 0-100
    category_match: boolean
    duplicates_found: string[]
    spam_probability: number
    suggested_action: string
  }
  
  created_at: Date
  updated_at: Date
}

export interface SellerReport {
  id: string
  seller_id: string
  reporter_id: string
  
  reason: 'non_delivery' | 'fraud' | 'harassment' | 'poor_communication' | 'fake_reviews' | 'other'
  description: string
  order_id?: string          // If related to specific order
  evidence_urls?: string[]
  
  status: 'pending' | 'investigating' | 'resolved' | 'dismissed'
  
  resolution?: {
    action: 'no_action' | 'warning' | 'temporary_ban' | 'permanent_ban'
    admin_id: string
    notes: string
    ban_until?: Date
    resolved_at: Date
  }
  
  created_at: Date
  updated_at: Date
}
```

---

## 🚀 Part 4: Implementation Roadmap

### Phase 1: Foundation (Week 1-2)

```
✅ Create new type definitions
   └── src/types/member-system-v2.ts
   
✅ Update AuthContext
   └── Add support for new seller types
   
✅ Create CoinJai Wallet Service
   └── src/lib/coinjai/
       ├── wallet.ts
       ├── transactions.ts
       └── topup.ts
```

### Phase 2: Individual Seller (Week 2-3)

```
✅ Enhanced Listing Form
   └── Standard fields + AI analysis
   
✅ Boost System
   └── Package selection + payment
   
✅ Seller Dashboard
   └── Listings, views, chats, sold
   
✅ Report System
   └── Report form + admin queue
```

### Phase 3: Store Seller (Week 3-5)

```
✅ Store Setup Wizard
   └── Logo, cover, description, categories
   
✅ Store Dashboard
   └── Products, orders, analytics
   
✅ Inventory Management
   └── Stock tracking, variants
   
✅ Custom Fields
   └── Dynamic form builder
```

### Phase 4: Official Store (Week 5-7)

```
✅ Business Verification Flow
   └── Document upload + review
   
✅ Advanced Theme System
   └── Color picker, layout options
   
✅ Flash Sale System
   └── Time-limited promotions
   
✅ Coupon System
   └── Create, distribute, track
   
✅ API Access
   └── Stock sync, order webhook
```

### Phase 5: Polish & Launch (Week 7-8)

```
✅ Testing all flows
✅ Performance optimization
✅ Documentation
✅ Admin tools
✅ Gradual rollout
```

---

## 📊 Part 5: Database Schema (Firestore)

### Collections Structure

```
/users/{userId}
  ├── Basic user info
  ├── coinjai_wallet (embedded)
  └── /seller_profile/{sellerId}  (subcollection)

/sellers/{sellerId}
  ├── Individual Seller OR Store Seller
  ├── type: 'individual' | 'general_store' | 'official_store'
  └── /products/{productId}  (subcollection for stores)

/listings/{listingId}
  ├── For individual sellers
  ├── seller_id, seller_type
  └── All listing data

/products/{productId}
  ├── For store sellers
  ├── store_id, seller_type
  └── All product data + inventory

/coinjai_transactions/{transactionId}
  ├── wallet_id
  ├── type, amount
  └── status, created_at

/listing_boosts/{boostId}
  ├── listing_id, seller_id
  ├── package, status
  └── stats

/reports/{reportId}
  ├── Type: listing | seller
  ├── reporter_id, target_id
  └── status, resolution

/stores/{storeId}
  ├── For general_store & official_store
  ├── All store settings
  ├── /categories/{categoryId}
  └── /coupons/{couponId}
```

---

## 🎯 Summary: Key Changes from Current System

1. **SellerType Enhancement**
   - Current: `individual | pro | mall`
   - New: `individual | general_store | official_store`

2. **CoinJai Wallet** (NEW)
   - Full wallet system with transactions
   - Top-up packages
   - Boost payments

3. **Boost System** (NEW)
   - 4 boost packages
   - Performance tracking
   - Clear ROI metrics

4. **Store System** (ENHANCED)
   - Custom categories
   - Theme customization (Official)
   - Inventory management
   - Variants support

5. **Business Verification** (NEW)
   - Document upload
   - Admin review flow
   - Verified badge

6. **Report System** (NEW)
   - Structured reporting
   - AI pre-analysis
   - Admin resolution flow

---

**Document Status:** ✅ Complete Analysis  
**Next Step:** Begin implementation of Phase 1  
**Estimated Total Duration:** 8 weeks for full implementation
