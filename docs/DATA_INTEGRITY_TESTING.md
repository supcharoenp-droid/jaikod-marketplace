# 🧪 Data Integrity Testing & Validation Guide
## JaiKod Enhanced Member System

## 📋 Overview

คู่มือนี้ให้วิธีการทดสอบความสมบูรณ์ของข้อมูลในระบบสมาชิกทุกระดับ

---

## ✅ Pre-Testing Checklist

- [ ] Database constraints ถูกติดตั้งแล้ว
- [ ] Database triggers ทำงานปกติ
- [ ] Backup ฐานข้อมูลก่อนทดสอบ
- [ ] มี test environment แยกจาก production

---

## 🎯 1. User System Testing

### 1.1 Trust Score Integrity

#### Test Case 1: Trust Level Auto-Update
```sql
-- Test: อัพเดท trust score → level ต้องเปลี่ยนตาม

-- Setup
INSERT INTO users (id, email, trust_score) VALUES
('test-user-1', 'test1@example.com', '{
    "overall_score": 45,
    "level": "bronze"
}'::jsonb);

-- Action: เพิ่ม score เป็น 85
UPDATE users 
SET trust_score = jsonb_set(trust_score, '{overall_score}', '85')
WHERE id = 'test-user-1';

-- Verify: level ต้องเป็น "gold"
SELECT 
    id,
    trust_score->>'overall_score' as score,
    trust_score->>'level' as level
FROM users 
WHERE id = 'test-user-1';

-- Expected: level = "gold"
-- ✅ PASS if level = "gold"
-- ❌ FAIL if level != "gold"
```

#### Test Case 2: Invalid Trust Score
```sql
-- Test: ป้อน score นอกช่วง → ต้อง error

-- Action: พยายามใส่ score = 150
UPDATE users 
SET trust_score = jsonb_set(trust_score, '{overall_score}', '150')
WHERE id = 'test-user-1';

-- Expected: ERROR - check_trust_score_range constraint violation
-- ✅ PASS if error
-- ❌ FAIL if no error
```

### 1.2 Gamification Integrity

#### Test Case 3: XP and Level Sync
```sql
-- Test: XP และ Level ต้องตรงกัน

-- Setup
INSERT INTO users (id, email, gamification) VALUES
('test-user-2', 'test2@example.com', '{
    "level": 10,
    "experience_points": 10000
}'::jsonb);

-- Verify: Level ถูกต้อง (level 10 = XP 8100-10000)
SELECT 
    id,
    gamification->>'experience_points' as xp,
    gamification->>'level' as level,
    FLOOR(SQRT((gamification->>'experience_points')::int / 100.0)) + 1 as calculated_level
FROM users 
WHERE id = 'test-user-2';

-- Expected: level = calculated_level
-- ✅ PASS if match
-- ❌ FAIL if mismatch
```

#### Test Case 4: Invalid Level-XP Combination
```sql
-- Test: ใส่ level ไม่ตรงกับ XP → ต้อง error

-- Action
INSERT INTO users (id, email, gamification) VALUES
('test-user-3', 'test3@example.com', '{
    "level": 50,
    "experience_points": 100
}'::jsonb);

-- Expected: ERROR - check_level_xp_match constraint violation
-- ✅ PASS if error
-- ❌ FAIL if no error
```

---

## 🏪 2. Seller System Testing

### 2.1 Tier and Commission Rate Sync

#### Test Case 5: Commission Rate Auto-Update
```sql
-- Test: เปลี่ยน tier → commission rate ต้องเปลี่ยนตาม

-- Setup
INSERT INTO seller_profiles (id, user_id, tier_info) VALUES
('test-seller-1', 'test-user-1', '{
    "current_tier": "starter",
    "commission_rate": 5.0
}'::jsonb);

-- Action: เปลี่ยนเป็น power_seller
UPDATE seller_profiles
SET tier_info = jsonb_set(tier_info, '{current_tier}', '"power_seller"')
WHERE id = 'test-seller-1';

-- Verify
SELECT 
    id,
    tier_info->>'current_tier' as tier,
    tier_info->>'commission_rate' as commission
FROM seller_profiles
WHERE id = 'test-seller-1';

-- Expected: commission = 3.5
-- ✅ PASS if commission = 3.5
-- ❌ FAIL if commission != 3.5
```

### 2.2 Rating Validation

#### Test Case 6: Rating Range Validation
```sql
-- Test: Rating นอกช่วง 0-5 → ต้อง error

-- Action
UPDATE seller_profiles
SET ratings = '{
    "overall": 6.0,
    "product_quality": 5.0
}'::jsonb
WHERE id = 'test-seller-1';

-- Expected: ERROR - check_rating_range constraint violation
-- ✅ PASS if error
-- ❌ FAIL if no error
```

#### Test Case 7: Rating Distribution Sum
```sql
-- Test: Rating distribution ต้องรวมเท่ากับ total_reviews

-- Setup
UPDATE seller_profiles
SET ratings = '{
    "total_reviews": 100,
    "rating_distribution": {
        "five_star": 50,
        "four_star": 30,
        "three_star": 15,
        "two_star": 3,
        "one_star": 2
    }
}'::jsonb
WHERE id = 'test-seller-1';

-- Verify
SELECT 
    id,
    (ratings->'rating_distribution'->>'five_star')::int +
    (ratings->'rating_distribution'->>'four_star')::int +
    (ratings->'rating_distribution'->>'three_star')::int +
    (ratings->'rating_distribution'->>'two_star')::int +
    (ratings->'rating_distribution'->>'one_star')::int as sum,
    (ratings->>'total_reviews')::int as total
FROM seller_profiles
WHERE id = 'test-seller-1';

-- Expected: sum = total
-- ✅ PASS if sum = total
-- ❌ FAIL if sum != total
```

---

## ⭐ 3. Review System Testing

### 3.1 Overall Rating Calculation

#### Test Case 8: Auto-Calculate Overall Rating
```sql
-- Test: Overall rating ต้องคำนวณจาก detailed ratings

-- Setup
INSERT INTO reviews (id, product_id, reviewer_id, detailed_ratings) VALUES
('test-review-1', 'product-1', 'user-1', '{
    "product_quality": 5.0,
    "value_for_money": 4.0,
    "seller_service": 5.0,
    "shipping_speed": 4.0,
    "packaging_quality": 5.0,
    "accuracy": 5.0
}'::jsonb);

-- Verify
SELECT 
    id,
    detailed_ratings->>'overall' as overall,
    ROUND(
        (
            (detailed_ratings->>'product_quality')::numeric +
            (detailed_ratings->>'value_for_money')::numeric +
            (detailed_ratings->>'seller_service')::numeric +
            (detailed_ratings->>'shipping_speed')::numeric +
            (detailed_ratings->>'packaging_quality')::numeric +
            (detailed_ratings->>'accuracy')::numeric
        ) / 6.0,
        1
    ) as calculated
FROM reviews
WHERE id = 'test-review-1';

-- Expected: overall = calculated (4.7)
-- ✅ PASS if match
-- ❌ FAIL if mismatch
```

### 3.2 AI Analysis Validation

#### Test Case 9: Sentiment Score Range
```sql
-- Test: Sentiment score นอกช่วง -1 ถึง 1 → ต้อง error

-- Action
UPDATE reviews
SET ai_analysis = '{
    "sentiment_score": 1.5
}'::jsonb
WHERE id = 'test-review-1';

-- Expected: ERROR - check_sentiment_score constraint violation
-- ✅ PASS if error
-- ❌ FAIL if no error
```

---

## 🎁 4. Loyalty System Testing

### 4.1 Points Balance Integrity

#### Test Case 10: Negative Balance Prevention
```sql
-- Test: ห้ามมี negative balance

-- Setup
INSERT INTO loyalty_programs (user_id, points_balance) VALUES
('test-user-4', 100);

-- Action: พยายามลบแต้มมากกว่าที่มี
UPDATE loyalty_programs
SET points_balance = -50
WHERE user_id = 'test-user-4';

-- Expected: ERROR - check_positive_balance constraint violation
-- ✅ PASS if error
-- ❌ FAIL if no error
```

#### Test Case 11: Points Balance Reconciliation
```sql
-- Test: Reconcile points balance

-- Setup
INSERT INTO loyalty_programs (user_id, points_balance) VALUES
('test-user-5', 1000);

INSERT INTO points_transactions (user_id, amount, status) VALUES
('test-user-5', 100, 'confirmed'),
('test-user-5', 200, 'confirmed'),
('test-user-5', -50, 'confirmed');

-- Action: Run reconciliation
SELECT * FROM reconcile_points_balance('test-user-5');

-- Verify
SELECT points_balance FROM loyalty_programs WHERE user_id = 'test-user-5';

-- Expected: points_balance = 250 (100 + 200 - 50)
-- ✅ PASS if balance = 250
-- ❌ FAIL if balance != 250
```

### 4.2 Tier Auto-Update

#### Test Case 12: Tier Update on Points Change
```sql
-- Test: เพิ่มแต้ม → tier ต้องอัพเดท

-- Setup
INSERT INTO loyalty_programs (user_id, points_balance, tier) VALUES
('test-user-6', 900, 'bronze');

-- Action: เพิ่มแต้มเป็น 1100
UPDATE loyalty_programs
SET points_balance = 1100
WHERE user_id = 'test-user-6';

-- Verify
SELECT tier FROM loyalty_programs WHERE user_id = 'test-user-6';

-- Expected: tier = 'silver'
-- ✅ PASS if tier = 'silver'
-- ❌ FAIL if tier != 'silver'
```

---

## 🔄 5. Integration Testing

### 5.1 Complete User Journey

#### Test Case 13: New User Registration to First Purchase
```sql
-- Test: User journey ครบวงจร

-- 1. Create user
INSERT INTO users (id, email, trust_score, gamification) VALUES
('journey-user-1', 'journey@example.com', '{
    "overall_score": 50,
    "level": "silver"
}'::jsonb, '{
    "level": 1,
    "experience_points": 0
}'::jsonb);

-- 2. Create loyalty program
INSERT INTO loyalty_programs (user_id, points_balance, tier) VALUES
('journey-user-1', 100, 'bronze');

-- 3. User makes purchase (earn points)
INSERT INTO points_transactions (user_id, type, amount, source, status) VALUES
('journey-user-1', 'earn', 150, 'purchase', 'confirmed');

-- 4. Update loyalty balance
UPDATE loyalty_programs
SET points_balance = points_balance + 150
WHERE user_id = 'journey-user-1';

-- 5. User writes review (earn XP)
UPDATE users
SET gamification = jsonb_set(
    gamification,
    '{experience_points}',
    ((gamification->>'experience_points')::int + 100)::text::jsonb
)
WHERE id = 'journey-user-1';

-- Verify all data is consistent
SELECT 
    u.id,
    u.trust_score->>'level' as trust_level,
    u.gamification->>'level' as game_level,
    lp.points_balance,
    lp.tier as loyalty_tier,
    (SELECT COUNT(*) FROM points_transactions WHERE user_id = u.id) as tx_count
FROM users u
LEFT JOIN loyalty_programs lp ON lp.user_id = u.id
WHERE u.id = 'journey-user-1';

-- Expected:
-- - trust_level = 'silver'
-- - game_level = 1
-- - points_balance = 250
-- - loyalty_tier = 'silver' (1000+ points)
-- - tx_count = 1
```

---

## 📊 6. Data Quality Checks

### 6.1 Run All Integrity Checks
```sql
-- Run comprehensive data integrity validation
SELECT * FROM validate_data_integrity();

-- Expected: All counts should be 0
-- ✅ PASS if all counts = 0
-- ❌ FAIL if any count > 0
```

### 6.2 Check for Orphaned Records
```sql
-- Check 1: Reviews without orders
SELECT COUNT(*) as orphaned_reviews
FROM reviews r
WHERE NOT EXISTS (
    SELECT 1 FROM orders o WHERE o.id = r.order_id
);

-- Check 2: Wishlists with deleted products
SELECT COUNT(*) as orphaned_wishlists
FROM wishlists w
WHERE NOT EXISTS (
    SELECT 1 FROM products p WHERE p.id = w.product_id
);

-- Check 3: Points transactions without loyalty program
SELECT COUNT(*) as orphaned_transactions
FROM points_transactions pt
WHERE NOT EXISTS (
    SELECT 1 FROM loyalty_programs lp WHERE lp.user_id = pt.user_id
);

-- Expected: All counts = 0
```

---

## 🚨 7. Error Handling Tests

### 7.1 Concurrent Update Test
```sql
-- Test: Concurrent points redemption

-- Session 1:
BEGIN;
SELECT points_balance FROM loyalty_programs WHERE user_id = 'test-user-7' FOR UPDATE;
-- balance = 1000

-- Session 2 (should wait):
BEGIN;
UPDATE loyalty_programs SET points_balance = points_balance - 600 WHERE user_id = 'test-user-7';

-- Session 1:
UPDATE loyalty_programs SET points_balance = points_balance - 500 WHERE user_id = 'test-user-7';
COMMIT;

-- Session 2:
COMMIT;

-- Verify
SELECT points_balance FROM loyalty_programs WHERE user_id = 'test-user-7';

-- Expected: balance = -100 (should fail due to constraint)
-- ✅ PASS if constraint prevents negative balance
-- ❌ FAIL if negative balance allowed
```

---

## 📋 Test Results Template

```markdown
## Test Execution Report
**Date:** 2025-12-07
**Tester:** [Your Name]
**Environment:** [Development/Staging/Production]

### Summary
- Total Tests: 13
- Passed: ___
- Failed: ___
- Skipped: ___

### Failed Tests
| Test Case | Expected | Actual | Notes |
|-----------|----------|--------|-------|
| TC-01 | ... | ... | ... |

### Recommendations
1. ...
2. ...
3. ...

### Sign-off
- [ ] All critical tests passed
- [ ] Database constraints working
- [ ] Triggers functioning correctly
- [ ] Ready for next phase
```

---

## 🔧 Automated Testing Script

```bash
#!/bin/bash
# automated_data_integrity_test.sh

echo "🧪 Running Data Integrity Tests..."

# Run SQL tests
psql -U postgres -d jaikod_db -f tests/user_system_tests.sql > results/user_tests.log
psql -U postgres -d jaikod_db -f tests/seller_system_tests.sql > results/seller_tests.log
psql -U postgres -d jaikod_db -f tests/review_system_tests.sql > results/review_tests.log
psql -U postgres -d jaikod_db -f tests/loyalty_system_tests.sql > results/loyalty_tests.log

# Run integrity checks
psql -U postgres -d jaikod_db -c "SELECT * FROM validate_data_integrity();" > results/integrity_check.log

# Check for errors
if grep -q "ERROR" results/*.log; then
    echo "❌ Tests FAILED - Check logs for details"
    exit 1
else
    echo "✅ All tests PASSED"
    exit 0
fi
```

---

## ✅ Acceptance Criteria

### Must Pass (Critical)
- [ ] All database constraints working
- [ ] All triggers functioning correctly
- [ ] No data integrity violations
- [ ] No orphaned records
- [ ] Points balance always correct
- [ ] Ratings always in valid range
- [ ] Trust levels sync with scores

### Should Pass (Important)
- [ ] Concurrent updates handled correctly
- [ ] Error messages are clear
- [ ] Performance acceptable (<100ms for checks)
- [ ] Audit logs created for changes

### Nice to Have
- [ ] Automated tests run daily
- [ ] Monitoring dashboard shows metrics
- [ ] Alerts sent for violations

---

**Document Version:** 1.0  
**Last Updated:** 2025-12-07  
**Status:** ✅ Ready for Testing
