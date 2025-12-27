# JaiKod Shop System - Comprehensive Documentation

## 📚 Overview

ระบบร้านค้า JaiKod เป็น **Enterprise-Grade Marketplace System** ที่รองรับ 3 ประเภทร้านค้า:

| ประเภท | ไอคอน | คำอธิบาย | สิทธิ์ |
|--------|------|---------|-------|
| **Individual Seller** | 👤 | ผู้ขายทั่วไป (C2C) | ไม่มีหน้าร้านค้า, แชร์ profile เท่านั้น |
| **General Store** | 🏪 | ร้านค้าทั่วไป | มีหน้าร้าน, สร้างคูปอง, ค่าคอม 4% |
| **Official Store** | 🏢 | ร้านค้าทางการ | Verified Badge, Flash Sale, API, ค่าคอม 3% |

---

## 🏗️ Architecture

### Firestore Collections

```
shops/                          # Main shop collection
├── {shopId}/
│   ├── owner_id               # Firebase Auth UID
│   ├── type                   # 'individual' | 'general_store' | 'official_store'
│   ├── status                 # 'active' | 'suspended' | 'vacation' | 'closed'
│   ├── name, slug, tagline
│   ├── branding/              # logo_url, cover_url, theme_color
│   ├── location/              # province, amphoe, coordinates
│   ├── contact/               # phone, email, line_id, social links
│   ├── ratings/               # overall, breakdown, distribution
│   ├── trust_score/           # overall_score, breakdown, badges
│   ├── stats/                 # products, orders, views, followers
│   ├── settings/              # auto_reply, vacation_mode, notifications
│   ├── promotions[]           # Active coupons and promotions
│   └── badges[]               # Earned badges

shop_followers/                 # Following relationships
├── {userId}_{shopId}/
│   ├── shop_id
│   ├── user_id
│   ├── followed_at
│   └── notifications_enabled

shop_reviews/                   # Shop reviews
├── {reviewId}/
│   ├── shop_id, order_id, product_id
│   ├── reviewer_id, reviewer_name
│   ├── overall_rating, ratings
│   ├── content, media[]
│   └── seller_response

shop_notifications/             # Shop notifications
├── {notificationId}/
│   ├── shop_id
│   ├── type                   # 'new_order', 'new_follower', etc.
│   ├── title, message
│   └── is_read, created_at
```

---

## 🔗 System Integration

### 1. Member System V2
```
┌───────────────────────────────────────────────────────────────┐
│  MEMBER SYSTEM V2 (member-system-v2.ts)                       │
│                                                               │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐           │
│  │ Individual  │  │   General   │  │  Official   │           │
│  │   Seller    │  │    Store    │  │    Store    │           │
│  │ (ผู้ขายทั่วไป) │  │ (ร้านค้าทั่วไป) │  │ (ร้านค้าทางการ) │           │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘           │
│         │                │                │                   │
│         └────────────────┼────────────────┘                   │
│                          │                                    │
│                    ┌─────▼─────┐                              │
│                    │   SHOP    │                              │
│                    │  SYSTEM   │                              │
│                    └───────────┘                              │
└───────────────────────────────────────────────────────────────┘
```

### 2. JaiStar Points System
```typescript
// เชื่อมต่อกับระบบ JaiStar
shop.jaistar_account_id  // Reference to JaiStar account
shop.jaistar_balance     // Cached balance for quick display

// ใช้ JaiStar สำหรับ
- Boost สินค้า/ร้านค้า
- Highlight บน homepage
- Unlock premium features
```

### 3. Seller Tier System
```
┌────────────────────────────────────────────────────────────────┐
│  SELLER TIERS (seller.enhanced.ts)                             │
│                                                                │
│  🌱 Starter   →   ⭐ Rising   →   🏆 Established              │
│  (5% คอม)        (4.5% คอม)      (4% คอม)                      │
│                                                                │
│  →   💎 Power Seller   →   👑 Top Seller                      │
│       (3.5% คอม)            (3% คอม)                          │
│                                                                │
│  Benefits:                                                     │
│  - Lower commission                                            │
│  - Free boosts                                                 │
│  - Priority support                                            │
│  - Featured placement                                          │
└────────────────────────────────────────────────────────────────┘
```

---

## 📁 File Structure

```
src/
├── types/
│   ├── shop.ts                 # ✅ Shop type definitions
│   ├── member-system-v2.ts     # Seller account types
│   └── seller.enhanced.ts      # Seller tier & performance
│
├── services/
│   ├── shopService.ts          # ✅ Firestore CRUD operations
│   └── storeService.ts         # Mock service (fallback)
│
├── app/shop/[slug]/
│   └── page.tsx                # ✅ Premium Shop page
│
├── lib/
│   ├── jaistar/                # Points system
│   └── profile/                # User profiles
│
└── contexts/
    └── AuthContext.tsx         # Authentication
```

---

## 🎨 Shop Page Design

### Premium Dark Theme
```css
/* Color Palette */
--bg-primary: #0f172a;      /* slate-900 */
--bg-secondary: #1e1b4b;    /* purple-950 */
--accent: #a855f7;          /* purple-500 */
--accent-pink: #ec4899;     /* pink-500 */

/* Gradient Background */
background: linear-gradient(to bottom right, var(--bg-primary), var(--bg-secondary), var(--bg-primary));
```

### UI Components
1. **Hero Banner** (320px) - Full-width cover image with gradient overlay
2. **Shop Logo** (128px) - Rounded, bordered, with Official/Verified badge
3. **Stats Grid** - 4-column: Rating, Followers, Sold, Products
4. **AI Shop Snapshot** - AI-powered highlights summary
5. **Trust Score Panel** - 4 metrics with progress bars
6. **Promotions Carousel** - Horizontal scrollable coupon cards
7. **Tab Navigation** - Home, Products, Reviews, About
8. **Mobile Bottom Bar** - Fixed CTA for Chat, Share, Follow, Shop Now

---

## 🔧 API Reference

### shopService

```typescript
// Get Shop
getShopById(shopId: string): Promise<Shop | null>
getShopBySlug(slug: string): Promise<Shop | null>
getShopByOwnerId(ownerId: string): Promise<Shop | null>

// Create/Update
createShop(ownerId: string, input: ShopCreationInput): Promise<Shop>
updateShop(shopId: string, input: ShopUpdateInput): Promise<Shop | null>
closeShop(shopId: string): Promise<boolean>

// List/Search
getShops(options: {...}): Promise<ShopListResponse>
getFeaturedShops(limit: number): Promise<Shop[]>
getNearbyShops(province: string, limit: number): Promise<Shop[]>

// Followers
followShop(shopId: string, userId: string): Promise<boolean>
unfollowShop(shopId: string, userId: string): Promise<boolean>
isFollowingShop(shopId: string, userId: string): Promise<boolean>
getShopFollowers(shopId: string, limit: number): Promise<ShopFollower[]>

// Products & Reviews
getShopProducts(shopId: string, options: {...}): Promise<{products, total, hasMore}>
getShopReviews(shopId: string, options: {...}): Promise<{reviews, total, hasMore}>

// Analytics
incrementShopView(shopId: string): Promise<void>
updateShopStats(shopId: string): Promise<void>
```

---

## 🚀 Future Enhancements

### Phase 2 - Advanced Features
- [ ] **Shop Analytics Dashboard** - Real-time sales, traffic, conversion
- [ ] **AI Product Recommendations** - Based on shop category & buyer behavior
- [ ] **Shop Flash Sales** - Time-limited promotions (Official only)
- [ ] **Multi-language Support** - Shop descriptions in TH/EN

### Phase 3 - Enterprise Features
- [ ] **API Access** - External inventory sync (Official only)
- [ ] **Sub-accounts** - Staff management with permissions
- [ ] **Branded Checkout** - Custom checkout experience
- [ ] **White-label Integration** - For B2B partners

---

## 📊 Trust Score Calculation

```typescript
trust_score = {
    verification: 0-20 points,      // ID/Business verification
    sales_history: 0-25 points,     // Order count & revenue
    ratings: 0-25 points,           // Average rating * 5
    response: 0-15 points,          // Response rate & speed
    delivery: 0-15 points           // On-time delivery rate
}

// Trust Levels
new:          0-30
basic:        31-50
trusted:      51-70
verified:     71-85
top_trusted:  86-100
```

---

## ✅ Completed Work

1. ✅ Created `src/types/shop.ts` - Complete Shop type definitions
2. ✅ Created `src/services/shopService.ts` - Firestore CRUD operations
3. ✅ Upgraded `src/app/shop/[slug]/page.tsx` - Premium dark theme design
4. ✅ Integrated with existing systems:
   - Member System V2
   - JaiStar Points
   - Seller Tiers
   - Authentication

---

## 🔗 Related Files

- `src/types/member-system-v2.ts` - Seller account types
- `src/types/seller.enhanced.ts` - Seller performance & tiers
- `src/lib/jaistar/types.ts` - JaiStar points system
- `src/services/storeService.ts` - Mock data (fallback)
- `src/contexts/AuthContext.tsx` - User authentication
