# 🚀 Boost Integration - Implementation Plan

## 🔍 การวิเคราะห์ระบบ Boost ที่มีอยู่

### ✅ สิ่งที่พบ:

**1. Boost Service มีอยู่แล้ว:**
- `src/lib/boost/boostService.ts` (565 lines)
- ใช้ JaiStar points (stars) แทนเงิน
- มี packages, transactions, stats tracking

**2. ระบบทำงาน:**
```typescript
// Create boost
createBoost(request: BoostRequest) {
  - ตรวจสอบ package
  - เช็ค JaiStar balance
  - หัก stars
  - สร้าง boost record
  - Return success/error
}
```

**3. Error "Failed to create boost":**

**สาเหตุเป็นได้:**
- `hasEnoughStars()` fail
- `getPackageById()` null
- Firestore permissions
- Missing dependencies

---

## 📊 ระบบที่มีอยู่

### Collections:
```
listing_boosts/          ← Boost records
jaistar_accounts/        ← User balances
jaistar_transactions/    ← Payment history
```

### Flow:
```
1. User Request Boost
   ↓
2. Check Package & Balance
   ↓
3. Create Transaction (หัก stars)
   ↓
4. Create Boost Record
   ↓
5. Return Success
```

---

## 🎯 Integration Strategy

### แนวทางที่ 1: **Extend Existing Boost** (แนะนำ) ⭐

**Concept:** ใช้ Boost System ที่มี เชื่อมกับ Promotion

```
JaiStar Points (existing)
    ↓
Boost System (existing)
    ↓
Promotion System (new) ← เชื่อมตรงนี้
```

**ข้อดี:**
- ✅ ไม่ต้องสร้างของใหม่
- ✅ Boost system ทำงานได้แล้ว
- ✅ มี points economy อยู่แล้ว

**Implementation:**
```typescript
// When boost is created successfully
await createBoost(request)
  ↓
// Also create promotion campaign
await createPromotionCampaign({
  type: 'boost',
  boost_id: boostId,
  seller_id: sellerId,
  placement: getPlacementFromPackage(packageId),
  priority: getPriorityFromPackage(packageId)
})
```

---

### แนวทางที่ 2: **Unified System**

**Concept:** รวม Boost + Promotion เป็นตัวเดียว

**ข้อเสีย:**
- ❌ ต้อง refactor เยอะ
- ❌ Break existing code
- ❌ Risky

---

## 🔧 Fix "Failed to create boost" Error

### Checklist:

**1. Firebase Permissions**
```javascript
// firestore.rules
match /listing_boosts/{boostId} {
  allow create: if request.auth != null;
  allow read: if true;
  allow update: if request.auth.uid == resource.data.seller_id;
}
```

**2. JaiStar Account**
```typescript
// Ensure user has account
const account = await getAccount(userId)
if (!account) {
  await createAccount(userId)  // Auto-create
}
```

**3. Package Validation**
```typescript
// Check if package exists
const pkg = getPackageById(packageId)
if (!pkg) {
  throw new Error('Invalid package')
}
```

---

## 📝 Implementation Steps

### Phase 1: Fix Boost System (Week 1)

**Day 1-2: Debug & Fix**
- [ ] ตรวจสอบ Firestore rules
- [ ] ตรวจสอบ getAccount()
- [ ] ตรวจสอบ packages
- [ ] แก้ error handling
- [ ] Test boost creation

**Day 3-4: Enhance Boost**
- [ ] Auto-create account ถ้าไม่มี
- [ ] Better error messages
- [ ] Validation improvements
- [ ] Unit tests

**Day 5: Documentation**
- [ ] API documentation
- [ ] Error codes guide
- [ ] User guide

---

### Phase 2: Connect to Promotion (Week 2)

**Step 1: Database Schema**
```typescript
// Add to existing listing_boosts collection
interface ListingBoost {
  // Existing fields...
  
  // New promotion fields
  promotion_campaign_id?: string
  promotion_placement?: string
  promotion_priority?: number
}
```

**Step 2: Create Promotion on Boost**
```typescript
// src/lib/boost/promotion-integration.ts
export async function createBoostWithPromotion(
  boostRequest: BoostRequest
) {
  // 1. Create boost (existing)
  const boostResult = await createBoost(boostRequest)
  
  if (!boostResult.success) {
    return boostResult
  }
  
  // 2. Create promotion campaign
  const campaign = await createPromotionCampaign({
    type: 'boost',
    boost_id: boostResult.boost_id,
    seller_id: boostRequest.seller_id,
    listing_id: boostRequest.listing_id,
    placement: mapPackageToPlacement(boostRequest.package_id),
    priority: mapPackageToPriority(boostRequest.package_id),
    start_date: boostResult.started_at,
    end_date: boostResult.expires_at
  })
  
  // 3. Update boost with campaign_id
  await updateBoost(boostResult.boost_id, {
    promotion_campaign_id: campaign.id
  })
  
  return {
    ...boostResult,
    promotion_campaign_id: campaign.id
  }
}
```

**Step 3: Package Mapping**
```typescript
// Map boost packages to promotion placements
function mapPackageToPlacement(packageId: string): string {
  const mapping = {
    'urgent': 'category_top',
    'premium': 'homepage_hero',
    'standard': 'search_boost',
    'basic': 'organic_boost'
  }
  return mapping[packageId] || 'organic_boost'
}

function mapPackageToPriority(packageId: string): number {
  const mapping = {
    'urgent': 100,
    'premium': 80,
    'standard': 50,
    'basic': 20
  }
  return mapping[packageId] || 10
}
```

**Step 4: Display Boosted Items**
```typescript
// When fetching listings for homepage/category
export async function getFeaturedListings() {
  // Get active boosts with promotions
  const activeBoosts = await getActiveBoosts({ limit: 10 })
  
  // Get listing details
  const listings = await Promise.all(
    activeBoosts.map(boost => getListingById(boost.listing_id))
  )
  
  // Add boost/promotion info
  return listings.map((listing, i) => ({
    ...listing,
    is_boosted: true,
    boost_info: activeBoosts[i],
    badge: getBoostBadge(activeBoosts[i])
  }))
}
```

---

### Phase 3: Unified UI (Week 3)

**Create Promotion Page:**
```tsx
// src/app/seller/promote/page.tsx
export default function PromotePage() {
  const { user } = useAuth()
  const jaistarBalance = useJaiStarBalance(user?.uid)
  const boostPackages = useBoostPackages()
  
  return (
    <div>
      <h1>โปรโมทสินค้า</h1>
      
      {/* Balance Display */}
      <BalanceCard
        stars={jaistarBalance}
        link="/jaistar"
      />
      
      {/* Package Options */}
      <PackageGrid>
        {boostPackages.map(pkg => (
          <PackageCard
            key={pkg.id}
            package={pkg}
            onSelect={() => createBoost({
              package_id: pkg.id,
              listing_id: selectedListing,
              ...
            })}
            disabled={jaistarBalance < pkg.price}
          />
        ))}
      </PackageGrid>
      
      {/* Existing Boosts */}
      <ActiveBoosts userId={user?.uid} />
    </div>
  )
}
```

---

## 🎯 Quick Win (This Week)

### Minimal Viable Integration:

**1. Fix boost errors** (1 day)
```typescript
// Better error handling
// Auto-create accounts
// Validate packages
```

**2. Connect to promotion** (1 day)
```typescript
// When boost created → create promotion campaign
// Map packages → placements
// Display boosted items on homepage
```

**3. Test** (1 day)
```
// Create boost
// Verify promotion appears
// Check analytics
```

**Total:** 3 days

---

## 🚀 Next Actions

**Immediate (Today):**
1. ตรวจสอบ Firestore rules
2. Debug createBoost error
3. Test with actual data

**This Week:**
4. Fix all boost errors
5. Create promotion on boost success
6. Display boosted items

**Next Week:**
7. Unified UI
8. Analytics integration
9. Documentation

---

**พร้อมเริ่มทำได้เลยครับ! เริ่มจาก?**

1. Debug boost errors
2. Check Firestore rules
3. Test boost creation
4. หรืออื่นๆ?
