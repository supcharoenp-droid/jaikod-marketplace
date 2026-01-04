# 📚 JaiKod Service Architecture Map
## วันที่อัปเดต: 2025-12-30

---

## 🎯 Quick Reference

### ❓ "ต้องการแสดงข้อมูล Seller ใน UI"
```typescript
// ✅ ใช้
import { getSellerProfile, getSellerListings } from '@/lib/seller'

// ❌ อย่าใช้
import { getSellerProfile } from '@/lib/seller.ts' // This is for shop registration
import { getRealNearbySellers } from '@/services/realSellerService' // Deprecated
```

### ❓ "ต้องการสร้าง/แก้ไข Shop Profile"
```typescript
// ✅ ใช้
import { createSellerProfile, updateSellerProfile } from '@/lib/seller'
// หรือ
import { createSellerProfile } from '@/lib/seller.ts'
```

### ❓ "ต้องการ Listing data"
```typescript
// ✅ ใช้
import { UniversalListing, ListingLocation } from '@/types'
import { getListingBySlug } from '@/lib/listings'
```

---

## 📦 Seller Services

### 1. `lib/seller/index.ts` ✅ CANONICAL

**Purpose:** แสดงข้อมูล Seller ใน UI (Real-time display data)

| Function | Description |
|----------|-------------|
| `getSellerProfile(sellerId)` | ดึง profile พร้อม listings count จริง |
| `getSellerListings(sellerId, excludeId, limit)` | ดึง listings อื่นๆ ของ seller |
| `getSimilarListings(listingId, categoryId, limit)` | ดึง listings คล้ายกัน |
| `updateSellerStats(sellerId)` | อัปเดต stats ของ seller |

**Collections:** `users`, `listings`, `products`

---

### 2. `lib/seller.ts` ⚠️ SHOP REGISTRATION ONLY

**Purpose:** Create/Update Shop Profile (Registration flow)

| Function | Description |
|----------|-------------|
| `createSellerProfile(userId, data)` | สร้าง shop ใหม่ |
| `updateSellerProfile(userId, data)` | อัปเดต shop |
| `getSellerProfileBySlug(slug)` | ดึง shop by slug |
| `checkShopNameAvailability(name)` | เช็คชื่อซ้ำ |

**Collections:** `seller_profiles`

**Note:** `getSellerProfile` in this file is **DEPRECATED** - use `lib/seller/index.ts` instead

---

### 3. `services/realSellerService.ts` ⛔ DEPRECATED

**Status:** Will be removed in future

| Function | Migration Path |
|----------|----------------|
| `getRealNearbySellers()` | Use cached-services.ts |
| `getSellersByCategory()` | Use lib/seller/index.ts |

---

## 📦 Listing Services

### 1. `lib/listings/index.ts` ✅ CANONICAL

**Purpose:** CRUD สำหรับ Listings

| Function | Description |
|----------|-------------|
| `createListing(data)` | สร้าง listing ใหม่ |
| `getListingBySlug(slug)` | ดึง listing by slug |
| `getListingById(id)` | ดึง listing by id |
| `updateListing(id, data)` | อัปเดต listing |
| `incrementListingViews(id)` | เพิ่ม view count |

**Collections:** `listings`

---

### 2. `lib/products.ts` ⚠️ LEGACY ONLY

**Purpose:** Query legacy `products` collection

**Note:** ใช้สำหรับ backward compatibility กับข้อมูลเก่า

---

### 3. `services/listing/unifiedListingService.ts` ⚠️ ALTERNATIVE

**Purpose:** Query ทั้ง `listings` และ `products` collections พร้อมกัน

**Use when:** ต้องการ query ข้อมูลจากทั้งสอง collections

---

## 📦 Type Definitions

### `@/types` ✅ CANONICAL

```typescript
// Listing Types
import { 
    UniversalListing, 
    ListingLocation, 
    ListingImage,
    ListingStatus,
    ListingSellerInfo,
    AIContent
} from '@/types'

// Seller Types
import {
    SellerProfile,
    SellerStore,
    SellerListing,
    SellerStats
} from '@/types'
```

---

## 🗂️ Collection Reference

| Collection | Primary Service | Purpose |
|------------|-----------------|---------|
| `users` | `lib/seller/index.ts` | User & seller profiles |
| `seller_profiles` | `lib/seller.ts` | Shop registration data |
| `listings` | `lib/listings/index.ts` | New listing system (v2) |
| `products` | `lib/products.ts` | Legacy products (v1) |

---

## ⚠️ Common Mistakes

### ❌ Mistake 1: Using wrong getSellerProfile
```typescript
// ❌ Wrong - this queries seller_profiles (shop data)
import { getSellerProfile } from '@/lib/seller.ts'

// ✅ Correct - this queries users (display data)
import { getSellerProfile } from '@/lib/seller'
// or
import { getSellerDisplayProfile } from '@/lib/seller'
```

### ❌ Mistake 2: Using deprecated service
```typescript
// ❌ Deprecated
import { getRealNearbySellers } from '@/services/realSellerService'

// ✅ Use lib/seller instead
import { getSellerProfile } from '@/lib/seller'
```

### ❌ Mistake 3: Importing types from scattered locations
```typescript
// ❌ Wrong
import { SellerProfile } from '@/lib/seller/index'
import { UniversalListing } from '@/lib/listings/types'

// ✅ Correct - always import types from @/types
import { SellerProfile, UniversalListing } from '@/types'
```

---

## 📊 Migration Status

| Service | Status | Action |
|---------|--------|--------|
| `lib/seller/index.ts` | ✅ Canonical | Keep & maintain |
| `lib/seller.ts` | ⚠️ Specialized | Keep for shop registration |
| `services/realSellerService.ts` | ⛔ Deprecated | Migrate & remove |
| `lib/listings/index.ts` | ✅ Canonical | Keep & maintain |
| `lib/products.ts` | ⚠️ Legacy | Keep for backward compat |
