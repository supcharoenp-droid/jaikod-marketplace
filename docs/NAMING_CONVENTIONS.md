# 📖 JaiKod Naming Conventions & Standards
## วันที่อัปเดต: 2025-12-30

---

## 🎯 Overview

เอกสารนี้กำหนด naming conventions สำหรับ JaiKod codebase เพื่อความสอดคล้องและ maintainability

---

## 📦 Firestore Collections

### Collection Names
```
✅ ใช้ snake_case พหูพจน์
users, listings, orders, reviews, seller_profiles
```

### Field Names
```
✅ ใช้ snake_case สำหรับ Firestore fields
seller_id, created_at, is_verified, thumbnail_url

❌ หลีกเลี่ยง camelCase ใน Firestore
sellerId, createdAt, isVerified, thumbnailUrl
```

### Canonical Field Names

| Field | Standard | Notes |
|-------|----------|-------|
| ID references | `seller_id`, `buyer_id` | Always snake_case |
| Timestamps | `created_at`, `updated_at` | snake_case |
| Booleans | `is_verified`, `is_active` | Prefix with `is_` |
| Counts | `views_count`, `sales_count` | Suffix with `_count` |
| URLs | `thumbnail_url`, `image_url` | Suffix with `_url` |

---

## 📝 TypeScript/JavaScript

### Interface Names
```typescript
// ✅ PascalCase
interface UniversalListing { }
interface SellerProfile { }
interface ListingSellerInfo { }

// ❌ Avoid
interface universalListing { }
interface seller_profile { }
```

### Function Names
```typescript
// ✅ camelCase, descriptive verbs
export async function getSellerProfile(id: string) { }
export async function createListing(data: CreateListingInput) { }
export async function syncSellerInfoToListings(sellerId: string) { }

// ❌ Avoid
export async function seller_profile_get(id: string) { }
export async function doStuff() { }
```

### Variable Names
```typescript
// ✅ camelCase
const sellerId = listing.seller_id
const activeListings = listings.filter(l => l.status === 'active')
const trustScore = calculateTrustScore(data)

// ❌ Avoid
const seller_id = listing.seller_id  // Don't match Firestore naming
const x = listings.filter(l => l.status === 'active')
```

### Boolean Variables
```typescript
// ✅ Prefix with is, has, can, should
const isVerified = seller.is_verified
const hasStore = user.hasStore
const canEdit = isOwner && !isLocked

// ❌ Avoid
const verified = seller.is_verified
const store = user.hasStore
```

### Constants
```typescript
// ✅ SCREAMING_SNAKE_CASE for true constants
const MAX_IMAGES = 10
const DEFAULT_TRUST_SCORE = 50
const LISTINGS_COLLECTION = 'listings'

// ❌ Avoid for non-constants
const MAX_IMAGES = calculateMax()  // Not a constant if calculated
```

---

## 📁 File & Directory Names

### Files
```
✅ kebab-case for files
seller-service.ts
unified-search.ts
ai-price-estimator.ts

✅ Component files can use PascalCase
NearbySellersV2.tsx
SmartProductCard.tsx

❌ Avoid
sellerService.ts
unified_search.ts
```

### Directories
```
✅ kebab-case
lib/ai-pipeline/
components/product-card/
services/search/

❌ Avoid
lib/aiPipeline/
components/ProductCard/
services/Search/
```

---

## 🔗 Import Conventions

### Type Imports
```typescript
// ✅ Always import types from @/types
import { UniversalListing, SellerProfile, ListingLocation } from '@/types'

// ❌ Avoid importing from scattered locations
import { SellerProfile } from '@/lib/seller/index'
import { UniversalListing } from '@/lib/listings/types'
```

### Service Imports
```typescript
// ✅ Import from canonical module
import { getSellerProfile, syncSellerInfoToListings } from '@/lib/seller'
import { createListing, getListingBySlug } from '@/lib/listings'

// ❌ Avoid direct index imports
import { getSellerProfile } from '@/lib/seller/index'
```

---

## 🗄️ Database Schema Patterns

### Seller Info Embedding
```typescript
// ✅ Use standardized ListingSellerInfo structure
listing.seller_info = {
    name: string,
    avatar?: string,
    verified: boolean,
    phone_verified?: boolean,
    trust_score: number,
    response_time_minutes?: number,
    total_listings?: number,
    active_listings?: number
}
```

### Status Values
```typescript
// ✅ Use consistent status strings
type ListingStatus = 
    | 'draft' 
    | 'pending' 
    | 'active' 
    | 'expired' 
    | 'sold' 
    | 'closed' 
    | 'rejected'
```

### Category Type Values
```typescript
// ✅ Use predefined category types
type ListingCategoryType = 
    | 'car' 
    | 'motorcycle' 
    | 'mobile' 
    | 'property' 
    | 'general'
```

---

## ⚠️ Migration Notes

### Legacy Fields Still in Use
Some documents still have camelCase fields. When reading:
```typescript
// Handle both formats during transition
const sellerId = doc.seller_id || doc.sellerId
const createdAt = doc.created_at || doc.createdAt
```

### Gradual Migration
New documents should always use snake_case. Old documents will be migrated gradually via:
1. `syncSellerInfoToListings()` - updates seller_info
2. `updateSellerStats()` - updates seller counts
3. Future migration scripts for field normalization

---

## ✅ Quick Reference

| Context | Convention | Example |
|---------|------------|---------|
| Firestore fields | snake_case | `seller_id`, `created_at` |
| TypeScript interfaces | PascalCase | `SellerProfile` |
| Functions | camelCase | `getSellerProfile()` |
| Variables | camelCase | `activeListing` |
| Constants | SCREAMING_SNAKE | `MAX_IMAGES` |
| Files | kebab-case | `seller-service.ts` |
| Components | PascalCase | `SellerCard.tsx` |
| Directories | kebab-case | `lib/seller/` |

---

## 📚 Related Documents

- `docs/SERVICE_ARCHITECTURE_MAP.md` - Service locations
- `docs/CLEANUP_PLAN.md` - Cleanup progress
- `docs/DATA_ARCHITECTURE_ANALYSIS_20251230.md` - Full analysis
