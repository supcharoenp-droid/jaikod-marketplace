# 🔧 Boost Error Debugging - Implementation

## ✅ สิ่งที่ทำเสร็จแล้ว

### 1. วิเคราะห์ระบบ Boost

**Dependencies พบ:** ✅
- `lib/jaistar/account.ts` - JaiStar accounts & balance
- `lib/jaistar/transactions.ts` - Payment transactions
- `lib/boost/packages.ts` - Boost packages config
- `lib/boost/boostService.ts` - Main boost logic

**Packages มี:** ✅
- basic_24h, basic_72h
- premium_24h, premium_48h
- urgent_24h
- homepage_3d, homepage_7d
- category_top_3d

### 2. สร้าง Debug Tools

**A. Debug Script** (`lib/boost/debug.ts`)
```typescript
// Test functions:
✅ testPackageExists() - เช็คว่า package มีอยู่
✅ testAccountAccess() - เช็ค account สามารถ access ได้
✅ testBalance() - เช็ค balance พอหรือไม่
✅ testCreateBoost() - ทดสอบสร้าง boost
✅ testVerifyBoost() - verify ว่าสร้างสำเร็จ

// Utilities:
✅ runAllTests() - รัน test ทั้งหมด
✅ addTestBalance() - เติมแต้มทดสอบ
```

**B. Debug API** (`api/debug/boost/route.ts`)
```typescript
// GET /api/debug/boost
// Returns: test results

// POST /api/debug/boost
// Body: { action: 'add_balance', user_id, amount }
// Returns: new balance
```

---

## 🧪 วิธีทดสอบ

### Option A: ผ่าน API (แนะนำ)

**1. เปิด browser console:**
```javascript
// Run all tests
fetch('http://localhost:3000/api/debug/boost')
  .then(r => r.json())
  .then(console.log)

// Expected result:
{
  success: true,
  results: {
    package: true,
    account: true,
    balance: false,  // อาจจะ false ถ้าไม่มี balance
    create: false,
    verify: false
  }
}
```

**2. เพิ่มแต้มทดสอบ:**
```javascript
fetch('http://localhost:3000/api/debug/boost', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    action: 'add_balance',
    user_id: 'YOUR_USER_ID',
    amount: 1000
  })
})
.then(r => r.json())
.then(console.log)

// Expected:
{
  success: true,
  new_balance: 1000
}
```

**3. ทดสอบสร้าง boost อีกครั้ง:**
```javascript
// Run tests again after adding balance
fetch('http://localhost:3000/api/debug/boost')
  .then(r => r.json())
  .then(console.log)

// Now should see:
{
  results: {
    package: true,
    account: true,
    balance: true,   // ✅ Now true!
    create: true,    // ✅ Should succeed!
    verify: true
  }
}
```

---

### Option B: ผ่าน Script

**1. สร้าง test file:**
```typescript
// scripts/test-boost.ts
import { runAllTests } from '../src/lib/boost/debug'

async function main() {
  const results = await runAllTests()
  console.log(results)
}

main()
```

**2. รัน:**
```bash
npx ts-node scripts/test-boost.ts
```

---

## 🐛 Error Scenarios & Solutions

### Error 1: "Package not found"

**Symptoms:**
```
❌ FAIL: Package not found: basic_24h
```

**Cause:**
- Package ID ผิด
- Package ไม่ active

**Solution:**
```typescript
// Check available packages
import { getActivePackages } from '@/lib/boost/packages'
const packages = getActivePackages()
console.log(packages.map(p => p.id))
```

---

### Error 2: "Account not found"

**Symptoms:**
```
❌ FAIL: Account error: Cannot read properties of null
```

**Cause:**
- ผู้ใช้ไม่มี JaiStar account

**Solution:**
```typescript
// Auto-create account
import { getOrCreateAccount } from '@/lib/jaistar/account'
await getOrCreateAccount(userId)
```

---

### Error 3: "Insufficient balance"

**Symptoms:**
```
⚠️  INSUFFICIENT BALANCE
- Current: 0 ⭐
- Required: 50 ⭐
```

**Cause:**
- ผู้ใช้ยังไม่มีแต้ม

**Solution A: เติมแต้มผ่าน API**
```javascript
fetch('/api/debug/boost', {
  method: 'POST',
  body: JSON.stringify({
    action: 'add_balance',
    user_id: 'xxx',
    amount: 1000
  })
})
```

**Solution B: เติมผ่าน code**
```typescript
import { addStars } from '@/lib/jaistar/account'
await addStars(userId, 1000, false)
```

---

### Error 4: "Firestore permission denied"

**Symptoms:**
```
FirebaseError: Missing or insufficient permissions
```

**Cause:**
- Firestore rules ไม่อนุญาต

**Solution:**
```javascript
// firestore.rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // JaiStar accounts
    match /jaistar_accounts/{accountId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // JaiStar transactions
    match /jaistar_transactions/{txId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
    }
    
    // Listing boosts
    match /listing_boosts/{boostId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update, delete: if request.auth.uid == resource.data.seller_id;
    }
  }
}
```

---

### Error 5: "Already boosted"

**Symptoms:**
```
error: { code: 'ALREADY_BOOSTED', message: 'This listing already has an active boost' }
```

**Cause:**
- Listing นี้มี boost อยู่แล้ว

**Solution:**
```typescript
// Cancel existing boost first
import { cancelBoost, getActiveBoostForListing } from '@/lib/boost/boostService'

const existingBoost = await getActiveBoostForListing(listingId)
if (existingBoost) {
  await cancelBoost(existingBoost.id, userId)
}

// Then create new boost
await createBoost(request)
```

---

## 📊 Expected Test Results

### ✅ All Tests Pass:

```
🚀 BOOST DEBUG & TEST SUITE
==================================================

🧪 Test 1: Checking package...
✅ PASS: Package found: Boost พื้นฐาน
   - Price: 50 ⭐
   - Duration: 24 hours
   - Available for: individual, general_store, official_store

🧪 Test 2: Checking account access...
✅ PASS: Account accessible
   - Balance: 1000 ⭐
   - Tier: bronze
   - Created: Thu Jan 02 2026

🧪 Test 3: Checking balance...
✅ PASS: Sufficient balance
   - Balance: 1000 ⭐
   - Cost: 50 ⭐
   - After: 950 ⭐

🧪 Test 4: Creating boost...
✅ PASS: Boost created successfully!
   - Boost ID: BOOST_ABC123
   - Transaction ID: TXN_XYZ789
   - Amount paid: 50 ⭐
   - Discount: 0 ⭐
   - Started: 2026-01-02T23:00:00
   - Expires: 2026-01-03T23:00:00
   - New balance: 950 ⭐

==================================================
📊 TEST SUMMARY:
==================================================

1. Package check: ✅ PASS
2. Account access: ✅ PASS
3. Balance check: ✅ PASS
4. Boost creation: ✅ PASS

Overall: 4/4 tests passed

🎉 ALL TESTS PASSED! Boost system is working!
```

---

## 🎯 Next Steps

### After Debugging:

**1. If all tests pass:** ✅
- Boost system ทำงานได้
- พร้อมต่อไป Phase 2 (Integration)

**2. If tests fail:**
- ดู error messages
- แก้ตาม solutions ข้างบน
- Run tests ใหม่

**3. Production setup:**
- Update Firestore rules
- Set up proper permissions
- Add error monitoring
- Create admin tools

---

## 📝 Files Created

1. ✅ `src/lib/boost/debug.ts` - Debug & test functions
2. ✅ `src/app/api/debug/boost/route.ts` - Debug API endpoint
3. ✅ `.gemini/boost-debug-implementation.md` - This documentation

---

## 🚀 Quick Start

**เริ่มทดสอบเลย:**

```bash
# 1. Start dev server
npm run dev

# 2. Open browser console
# 3. Run test
fetch('http://localhost:3000/api/debug/boost').then(r=>r.json()).then(console.log)

# 4. Add balance if needed
fetch('http://localhost:3000/api/debug/boost', {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({
    action: 'add_balance',
    user_id: 'YOUR_USER_ID',
    amount: 1000
  })
}).then(r=>r.json()).then(console.log)

# 5. Test again
fetch('http://localhost:3000/api/debug/boost').then(r=>r.json()).then(console.log)
```

---

**พร้อมทดสอบได้เลยครับ!** 🎉

**บอกผลลัพธ์มาได้นะครับว่าเจออะไร!**
