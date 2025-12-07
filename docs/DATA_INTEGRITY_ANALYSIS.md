# 🔍 Data Integrity & Validation Analysis
## Enhanced Member System - JaiKod Marketplace

## 📋 Overview

เอกสารนี้วิเคราะห์ความสมบูรณ์ของข้อมูล การเชื่อมโยง และจุดที่อาจเกิดปัญหาในระบบสมาชิกทุกระดับ

---

## 🎯 1. User Profile Data Integrity

### 1.1 ข้อมูลพื้นฐาน (Basic Profile)

#### ✅ ข้อมูลที่แก้ไขได้
```typescript
interface EditableUserFields {
    displayName: string          // ✅ แก้ไขได้
    full_name: string            // ✅ แก้ไขได้
    phoneNumber: string          // ⚠️ ต้องยืนยันใหม่
    photoURL: string             // ✅ แก้ไขได้
    address: Address             // ✅ แก้ไขได้
    preferences: UserPreferences // ✅ แก้ไขได้
}
```

#### ❌ ข้อมูลที่แก้ไขไม่ได้
```typescript
interface ReadOnlyUserFields {
    id: string                   // ❌ ห้ามแก้ไข (Primary Key)
    email: string                // ⚠️ แก้ไขได้แต่ต้องยืนยันใหม่
    role: 'buyer' | 'seller'     // ⚠️ ต้องผ่าน Admin
    created_at: Date             // ❌ ห้ามแก้ไข
    is_verified: boolean         // ⚠️ ระบบคำนวณเอง
}
```

#### 🔗 ความเชื่อมโยงข้อมูล

```typescript
// User → Orders (1:N)
// ถ้าลบ User → CASCADE DELETE orders? ❌ ไม่ควร!
// แนะนำ: Soft delete (is_deleted = true)

// User → Reviews (1:N)
// ถ้าลบ User → SET NULL reviewer_id? ✅ ควรเก็บรีวิวไว้

// User → Loyalty Program (1:1)
// ถ้าลบ User → CASCADE DELETE loyalty? ✅ ควรลบ

// User → Wishlist (1:N)
// ถ้าลบ User → CASCADE DELETE wishlist? ✅ ควรลบ
```

### 1.2 Trust Score & Verification

#### ⚠️ จุดที่อาจเกิดปัญหา

**Problem 1: Trust Score ไม่อัพเดท**
```typescript
// ❌ ปัญหา: Trust score คำนวณแล้วไม่อัพเดทอัตโนมัติ
interface TrustScore {
    overall_score: number
    last_calculated: Date  // ⚠️ ต้องมี cron job อัพเดท
    next_review: Date      // ⚠️ ต้องตรวจสอบ
}

// ✅ แก้ไข: สร้าง background job
// Schedule: ทุก 1 ชั่วโมง หรือเมื่อมี transaction สำคัญ
```

**Problem 2: KYC Documents หายหลังอัพโหลด**
```typescript
// ❌ ปัญหา: เก็บ URL ตรงๆ อาจหายถ้า storage ล้ม
interface KYCDocuments {
    national_id?: string  // ⚠️ ต้อง encrypt + backup
}

// ✅ แก้ไข: เก็บหลายชั้น
interface SecureKYCDocuments {
    national_id_encrypted: string      // Encrypted reference
    national_id_backup_url: string     // Backup storage
    national_id_hash: string           // For verification
    uploaded_at: Date
    verified_at?: Date
    verified_by?: string               // Admin ID
}
```

**Problem 3: Trust Level ไม่สอดคล้องกับ Score**
```typescript
// ❌ ปัญหา: Score = 85 แต่ level = "silver"
// เกิดจาก: อัพเดท score แต่ไม่อัพเดท level

// ✅ แก้ไข: ใช้ computed property หรือ database trigger
CREATE OR REPLACE FUNCTION update_trust_level()
RETURNS TRIGGER AS $$
BEGIN
    NEW.trust_score = jsonb_set(
        NEW.trust_score,
        '{level}',
        to_jsonb(
            CASE 
                WHEN (NEW.trust_score->>'overall_score')::int >= 90 THEN 'diamond'
                WHEN (NEW.trust_score->>'overall_score')::int >= 75 THEN 'gold'
                WHEN (NEW.trust_score->>'overall_score')::int >= 50 THEN 'silver'
                ELSE 'bronze'
            END
        )
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trust_level_sync
    BEFORE UPDATE ON users
    FOR EACH ROW
    WHEN (OLD.trust_score IS DISTINCT FROM NEW.trust_score)
    EXECUTE FUNCTION update_trust_level();
```

### 1.3 Gamification Data

#### ⚠️ จุดที่อาจเกิดปัญหา

**Problem 1: XP และ Level ไม่ตรงกัน**
```typescript
// ❌ ปัญหา: XP = 10000 แต่ Level = 5 (ควรเป็น 10)

// ✅ แก้ไข: Validation function
function validateGamificationData(gamification: GamificationProfile): boolean {
    const calculatedLevel = calculateLevel(gamification.experience_points)
    
    if (calculatedLevel !== gamification.level) {
        console.error('Level mismatch!', {
            xp: gamification.experience_points,
            currentLevel: gamification.level,
            calculatedLevel
        })
        return false
    }
    
    return true
}

// Database constraint
ALTER TABLE users ADD CONSTRAINT check_level_xp 
CHECK (
    (gamification->>'level')::int = 
    FLOOR(SQRT((gamification->>'experience_points')::int / 100)) + 1
);
```

**Problem 2: Badges ซ้ำกัน**
```typescript
// ❌ ปัญหา: User ได้ badge เดียวกันหลายครั้ง

// ✅ แก้ไข: Unique constraint
interface UserBadge {
    id: string
    type: BadgeType  // ⚠️ ต้อง unique per user
    earned_at: Date
}

// ใน database
CREATE UNIQUE INDEX idx_user_badges_unique 
ON user_badges(user_id, badge_type);
```

---

## 🏪 2. Seller Profile Data Integrity

### 2.1 Seller Tier System

#### ⚠️ จุดวิกฤต (Critical Issues)

**Problem 1: Tier Downgrade ทันที**
```typescript
// ❌ ปัญหา: ยอดขายลด → ลด tier ทันที → ผู้ขายไม่พอใจ

// ✅ แก้ไข: Grace Period
interface SellerTierInfo {
    current_tier: SellerTier
    tier_achieved_at: Date
    
    // เพิ่ม grace period
    grace_period_ends?: Date  // ให้เวลา 30 วัน
    pending_downgrade?: SellerTier
    downgrade_reason?: string
}

// Logic
function checkTierDowngrade(seller: EnhancedSellerProfile) {
    const meetsRequirements = checkTierRequirements(
        seller.tier_info.current_tier,
        seller.performance
    )
    
    if (!meetsRequirements) {
        // ไม่ลด tier ทันที
        if (!seller.tier_info.grace_period_ends) {
            // เริ่ม grace period
            seller.tier_info.grace_period_ends = addDays(new Date(), 30)
            seller.tier_info.pending_downgrade = calculateNewTier(seller.performance)
            
            // แจ้งเตือนผู้ขาย
            sendTierWarningEmail(seller)
        } else if (new Date() > seller.tier_info.grace_period_ends) {
            // หมดเวลา grace period → ลด tier
            downgradeTier(seller)
        }
    } else {
        // กลับมาผ่านเกณฑ์ → ยกเลิก downgrade
        seller.tier_info.grace_period_ends = undefined
        seller.tier_info.pending_downgrade = undefined
    }
}
```

**Problem 2: Commission Rate ไม่อัพเดท**
```typescript
// ❌ ปัญหา: Tier เปลี่ยน แต่ commission rate ยังเป็นค่าเก่า

// ✅ แก้ไข: Database trigger
CREATE OR REPLACE FUNCTION update_commission_rate()
RETURNS TRIGGER AS $$
BEGIN
    NEW.tier_info = jsonb_set(
        NEW.tier_info,
        '{commission_rate}',
        to_jsonb(
            CASE (NEW.tier_info->>'current_tier')
                WHEN 'top_seller' THEN 3.0
                WHEN 'power_seller' THEN 3.5
                WHEN 'established' THEN 4.0
                WHEN 'rising' THEN 4.5
                ELSE 5.0
            END
        )
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER commission_rate_sync
    BEFORE UPDATE ON seller_profiles
    FOR EACH ROW
    WHEN (
        OLD.tier_info->>'current_tier' IS DISTINCT FROM 
        NEW.tier_info->>'current_tier'
    )
    EXECUTE FUNCTION update_commission_rate();
```

### 2.2 Performance Metrics

#### ⚠️ จุดที่อาจเกิดปัญหา

**Problem 1: Metrics ไม่ตรงกับความเป็นจริง**
```typescript
// ❌ ปัญหา: total_sales = 100 แต่ในฐานข้อมูลมี 150 orders

// ✅ แก้ไข: Recalculate function
async function recalculateSellerPerformance(sellerId: string) {
    const orders = await db.orders.findMany({
        where: { 
            seller_id: sellerId,
            status: 'completed'
        }
    })
    
    const performance: SellerPerformance = {
        total_sales: orders.length,
        total_revenue: orders.reduce((sum, o) => sum + o.net_total, 0),
        avg_order_value: orders.length > 0 
            ? orders.reduce((sum, o) => sum + o.net_total, 0) / orders.length 
            : 0,
        // ... คำนวณต่อ
    }
    
    // อัพเดทกลับ database
    await db.sellerProfiles.update({
        where: { id: sellerId },
        data: { performance }
    })
    
    return performance
}

// Schedule: ทุกวันเวลา 02:00
```

**Problem 2: Rating Distribution ไม่รวม 100%**
```typescript
// ❌ ปัญหา: 5★=30% + 4★=40% + 3★=20% + 2★=5% + 1★=3% = 98%

// ✅ แก้ไข: Validation
function validateRatingDistribution(ratings: DetailedRatings): boolean {
    const { rating_distribution } = ratings
    const total = 
        rating_distribution.five_star +
        rating_distribution.four_star +
        rating_distribution.three_star +
        rating_distribution.two_star +
        rating_distribution.one_star
    
    if (total !== ratings.total_reviews) {
        console.error('Rating distribution mismatch!', {
            sum: total,
            total_reviews: ratings.total_reviews
        })
        return false
    }
    
    return true
}
```

### 2.3 AI Insights

#### ⚠️ จุดที่อาจเกิดปัญหา

**Problem 1: AI Insights ล้าสมัย**
```typescript
// ❌ ปัญหา: แสดง insights จาก 30 วันที่แล้ว

// ✅ แก้ไข: เพิ่ม timestamp และ expiry
interface AIInsights {
    // ... existing fields
    last_updated: Date
    next_update: Date
    is_stale: boolean  // true ถ้าเกิน 24 ชั่วโมง
}

// Check before display
function getAIInsights(seller: EnhancedSellerProfile): AIInsights | null {
    if (!seller.ai_insights) return null
    
    const hoursSinceUpdate = differenceInHours(
        new Date(),
        seller.ai_insights.last_updated
    )
    
    if (hoursSinceUpdate > 24) {
        // Insights ล้าสมัย → trigger regeneration
        queueAIInsightsGeneration(seller.id)
        return null
    }
    
    return seller.ai_insights
}
```

---

## ⭐ 3. Review System Data Integrity

### 3.1 Review Ratings

#### ⚠️ จุดที่อาจเกิดปัญหา

**Problem 1: Overall Rating ไม่ตรงกับ Detailed Ratings**
```typescript
// ❌ ปัญหา: overall=5.0 แต่ product_quality=3.0, service=2.0

// ✅ แก้ไข: Auto-calculate
function calculateOverallRating(ratings: DetailedReviewRatings): number {
    const sum = 
        ratings.product_quality +
        ratings.value_for_money +
        ratings.seller_service +
        ratings.shipping_speed +
        ratings.packaging_quality +
        ratings.accuracy
    
    return Math.round((sum / 6) * 10) / 10
}

// Database trigger
CREATE OR REPLACE FUNCTION sync_overall_rating()
RETURNS TRIGGER AS $$
BEGIN
    NEW.detailed_ratings = jsonb_set(
        NEW.detailed_ratings,
        '{overall}',
        to_jsonb(
            ROUND(
                (
                    (NEW.detailed_ratings->>'product_quality')::numeric +
                    (NEW.detailed_ratings->>'value_for_money')::numeric +
                    (NEW.detailed_ratings->>'seller_service')::numeric +
                    (NEW.detailed_ratings->>'shipping_speed')::numeric +
                    (NEW.detailed_ratings->>'packaging_quality')::numeric +
                    (NEW.detailed_ratings->>'accuracy')::numeric
                ) / 6,
                1
            )
        )
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

**Problem 2: Verified Purchase แต่ไม่มี Order**
```typescript
// ❌ ปัญหา: is_verified_purchase=true แต่ไม่เจอ order_id

// ✅ แก้ไข: Foreign key constraint + validation
ALTER TABLE reviews 
ADD CONSTRAINT fk_review_order 
FOREIGN KEY (order_id) 
REFERENCES orders(id) 
ON DELETE RESTRICT;  // ห้ามลบ order ถ้ามีรีวิว

// Validation
async function validateVerifiedPurchase(review: EnhancedReview): Promise<boolean> {
    if (!review.ai_analysis.is_verified_purchase) return true
    
    const order = await db.orders.findUnique({
        where: { id: review.order_id }
    })
    
    if (!order) {
        console.error('Verified purchase but order not found!', review.id)
        return false
    }
    
    if (order.buyer_id !== review.reviewer_id) {
        console.error('Reviewer is not the buyer!', review.id)
        return false
    }
    
    if (order.status !== 'completed') {
        console.error('Order not completed yet!', review.id)
        return false
    }
    
    return true
}
```

### 3.2 AI Analysis

#### ⚠️ จุดที่อาจเกิดปัญหา

**Problem 1: Sentiment Score นอกช่วง**
```typescript
// ❌ ปัญหา: sentiment_score = 1.5 (ควรเป็น -1 ถึง 1)

// ✅ แก้ไข: Validation + constraint
ALTER TABLE reviews ADD CONSTRAINT check_sentiment_score
CHECK (
    (ai_analysis->>'sentiment_score')::numeric >= -1 AND
    (ai_analysis->>'sentiment_score')::numeric <= 1
);

// Validation function
function validateSentimentScore(score: number): number {
    return Math.max(-1, Math.min(1, score))
}
```

---

## 🎁 4. Loyalty Program Data Integrity

### 4.1 Points Balance

#### ⚠️ จุดวิกฤต (Critical Issues)

**Problem 1: Points Balance ไม่ตรงกับ Transactions**
```typescript
// ❌ ปัญหา: balance=1000 แต่ sum(transactions)=1200

// ✅ แก้ไข: Reconciliation function
async function reconcilePointsBalance(userId: string) {
    const transactions = await db.pointsTransactions.findMany({
        where: { user_id: userId, status: 'confirmed' }
    })
    
    const calculatedBalance = transactions.reduce(
        (sum, tx) => sum + tx.amount,
        0
    )
    
    const loyalty = await db.loyaltyPrograms.findUnique({
        where: { user_id: userId }
    })
    
    if (loyalty.points_balance !== calculatedBalance) {
        console.error('Points balance mismatch!', {
            userId,
            recorded: loyalty.points_balance,
            calculated: calculatedBalance,
            difference: Math.abs(loyalty.points_balance - calculatedBalance)
        })
        
        // Auto-fix
        await db.loyaltyPrograms.update({
            where: { user_id: userId },
            data: { 
                points_balance: calculatedBalance,
                last_updated: new Date()
            }
        })
        
        // Log for audit
        await db.auditLogs.create({
            data: {
                type: 'points_reconciliation',
                user_id: userId,
                old_value: loyalty.points_balance,
                new_value: calculatedBalance,
                reason: 'Auto-reconciliation'
            }
        })
    }
}

// Schedule: ทุกวันเวลา 03:00
```

**Problem 2: Negative Points Balance**
```typescript
// ❌ ปัญหา: User แลกแต้มมากกว่าที่มี → balance = -500

// ✅ แก้ไข: Database constraint + transaction
ALTER TABLE loyalty_programs 
ADD CONSTRAINT check_positive_balance 
CHECK (points_balance >= 0);

// Transaction-safe redemption
async function redeemPoints(
    userId: string, 
    pointsToSpend: number
): Promise<boolean> {
    return await db.$transaction(async (tx) => {
        // Lock row
        const loyalty = await tx.loyaltyPrograms.findUnique({
            where: { user_id: userId },
            // FOR UPDATE
        })
        
        if (!loyalty) throw new Error('Loyalty program not found')
        
        if (loyalty.points_balance < pointsToSpend) {
            throw new Error('Insufficient points')
        }
        
        // Deduct points
        await tx.loyaltyPrograms.update({
            where: { user_id: userId },
            data: {
                points_balance: loyalty.points_balance - pointsToSpend
            }
        })
        
        // Record transaction
        await tx.pointsTransactions.create({
            data: {
                user_id: userId,
                type: 'redeem',
                amount: -pointsToSpend,
                balance_after: loyalty.points_balance - pointsToSpend,
                source: 'redemption',
                description: 'Points redeemed',
                status: 'confirmed'
            }
        })
        
        return true
    })
}
```

### 4.2 Tier Calculation

#### ⚠️ จุดที่อาจเกิดปัญหา

**Problem 1: Tier ไม่อัพเดทหลังได้แต้ม**
```typescript
// ❌ ปัญหา: points=6000 (ควรเป็น Gold) แต่ tier=Silver

// ✅ แก้ไข: Trigger on points update
CREATE OR REPLACE FUNCTION update_loyalty_tier()
RETURNS TRIGGER AS $$
BEGIN
    NEW.tier = CASE
        WHEN NEW.points_balance >= 50000 THEN 'diamond'
        WHEN NEW.points_balance >= 15000 THEN 'platinum'
        WHEN NEW.points_balance >= 5000 THEN 'gold'
        WHEN NEW.points_balance >= 1000 THEN 'silver'
        ELSE 'bronze'
    END;
    
    -- อัพเดท tier_achieved_at ถ้า tier เปลี่ยน
    IF OLD.tier IS DISTINCT FROM NEW.tier THEN
        NEW.tier_achieved_at = NOW();
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER loyalty_tier_sync
    BEFORE UPDATE ON loyalty_programs
    FOR EACH ROW
    WHEN (OLD.points_balance IS DISTINCT FROM NEW.points_balance)
    EXECUTE FUNCTION update_loyalty_tier();
```

---

## 👨‍💼 5. Admin System Data Integrity

### 5.1 Performance Metrics

#### ⚠️ จุดที่อาจเกิดปัญหา

**Problem 1: Cases Handled ไม่ตรงกับ Activity Log**
```typescript
// ❌ ปัญหา: cases_handled=50 แต่ activity log มี 45 records

// ✅ แก้ไข: Recalculate from activity log
async function recalculateAdminPerformance(adminId: string) {
    const activities = await db.adminActivityLogs.findMany({
        where: {
            admin_id: adminId,
            action_category: { in: ['approve', 'reject', 'resolve'] }
        }
    })
    
    const today = startOfDay(new Date())
    const thisWeek = startOfWeek(new Date())
    const thisMonth = startOfMonth(new Date())
    
    const metrics: AdminPerformanceMetrics = {
        cases_handled_total: activities.length,
        cases_handled_today: activities.filter(a => 
            a.timestamp >= today
        ).length,
        cases_handled_this_week: activities.filter(a => 
            a.timestamp >= thisWeek
        ).length,
        cases_handled_this_month: activities.filter(a => 
            a.timestamp >= thisMonth
        ).length,
        // ... calculate other metrics
    }
    
    await db.adminUsers.update({
        where: { id: adminId },
        data: { performance_metrics: metrics }
    })
}
```

---

## 🔄 6. Data Migration & Future-Proofing

### 6.1 Schema Changes Impact Analysis

#### Scenario 1: เพิ่ม Field ใหม่

```typescript
// เพิ่ม field: user.middle_name

// ✅ Safe - Nullable field
ALTER TABLE users ADD COLUMN middle_name VARCHAR(100);

// ผลกระทบ:
// - Existing users: middle_name = NULL ✅ OK
// - New users: ต้องอัพเดท registration form
// - API: ต้องเพิ่ม field ใน response (optional)
// - Frontend: ต้องเพิ่มช่องกรอก (optional)
```

#### Scenario 2: เปลี่ยน Type ของ Field

```typescript
// เปลี่ยน: trust_score.overall_score จาก number เป็น string

// ❌ Dangerous - Breaking change!

// ผลกระทบ:
// - Existing data: ต้อง migrate ทั้งหมด
// - API: Breaking change - clients ต้องอัพเดท
// - Calculations: ทุก function ที่ใช้ต้องแก้
// - Database queries: ต้องแก้ทุก query

// แนะนำ: ใช้ versioning
interface TrustScoreV1 {
    overall_score: number
}

interface TrustScoreV2 {
    overall_score: string
    overall_score_numeric: number  // Keep for backward compatibility
    version: 2
}
```

#### Scenario 3: ลบ Field

```typescript
// ลบ field: user.old_password_hash

// ⚠️ Risky - ต้องระวัง

// ขั้นตอนที่ปลอดภัย:
// 1. Deprecate (mark as deprecated)
// 2. Stop writing to field
// 3. Wait 30 days (grace period)
// 4. Remove from code
// 5. Wait 30 days
// 6. Drop column from database

// ผลกระทบ:
// - Old API versions: อาจ error
// - Rollback: ไม่สามารถ rollback ได้ถ้าลบแล้ว
```

### 6.2 Data Retention Policy

```typescript
interface DataRetentionPolicy {
    // User Data
    user_profiles: 'forever' | 'until_deletion_request'
    user_activity_logs: '2_years'
    user_sessions: '30_days'
    
    // Seller Data
    seller_profiles: 'forever' | 'until_deletion_request'
    seller_performance_history: '5_years'
    seller_payouts: '7_years'  // Tax requirement
    
    // Reviews
    reviews: 'forever'  // Public record
    review_moderation_logs: '2_years'
    
    // Loyalty
    points_transactions: '3_years'
    expired_points: '1_year'
    
    // Admin
    admin_activity_logs: '7_years'  // Audit requirement
    moderation_queue: '1_year'
}

// Auto-cleanup job
async function cleanupOldData() {
    // ลบ sessions เก่า
    await db.userSessions.deleteMany({
        where: {
            last_activity: {
                lt: subDays(new Date(), 30)
            }
        }
    })
    
    // Archive activity logs เก่า
    const oldLogs = await db.userActivityLogs.findMany({
        where: {
            timestamp: {
                lt: subYears(new Date(), 2)
            }
        }
    })
    
    // Move to archive storage
    await archiveStorage.save('activity_logs', oldLogs)
    
    // Delete from main database
    await db.userActivityLogs.deleteMany({
        where: {
            timestamp: {
                lt: subYears(new Date(), 2)
            }
        }
    })
}
```

### 6.3 Backward Compatibility

```typescript
// API Versioning Strategy

// v1: Original
interface UserV1 {
    id: string
    name: string
    email: string
}

// v2: Enhanced
interface UserV2 extends UserV1 {
    displayName: string
    full_name: string
    trust_score: TrustScore
}

// API Response Handler
function getUserResponse(user: EnhancedUser, apiVersion: string) {
    switch (apiVersion) {
        case 'v1':
            return {
                id: user.id,
                name: user.displayName || user.full_name,
                email: user.email
            } as UserV1
            
        case 'v2':
        default:
            return user as UserV2
    }
}

// Endpoint
app.get('/api/v1/users/:id', async (req, res) => {
    const user = await getEnhancedUser(req.params.id)
    res.json(getUserResponse(user, 'v1'))
})

app.get('/api/v2/users/:id', async (req, res) => {
    const user = await getEnhancedUser(req.params.id)
    res.json(getUserResponse(user, 'v2'))
})
```

---

## 🛡️ 7. Data Validation Rules

### 7.1 Input Validation

```typescript
// Validation Schema (using Zod)
import { z } from 'zod'

const UserProfileUpdateSchema = z.object({
    displayName: z.string()
        .min(2, 'ชื่อต้องมีอย่างน้อย 2 ตัวอักษร')
        .max(50, 'ชื่อต้องไม่เกิน 50 ตัวอักษร')
        .regex(/^[ก-๙a-zA-Z0-9\s]+$/, 'ชื่อมีตัวอักษรไม่ถูกต้อง')
        .optional(),
        
    phoneNumber: z.string()
        .regex(/^0\d{9}$/, 'เบอร์โทรไม่ถูกต้อง')
        .optional(),
        
    photoURL: z.string()
        .url('URL รูปภาพไม่ถูกต้อง')
        .optional(),
        
    address: z.object({
        address_line1: z.string().min(5),
        subdistrict: z.string().min(2),
        district: z.string().min(2),
        province: z.string().min(2),
        postal_code: z.string().regex(/^\d{5}$/)
    }).optional()
})

// Usage
async function updateUserProfile(userId: string, data: unknown) {
    // Validate input
    const validated = UserProfileUpdateSchema.parse(data)
    
    // Update database
    return await db.users.update({
        where: { id: userId },
        data: validated
    })
}
```

### 7.2 Business Logic Validation

```typescript
// Complex validation rules

async function validateSellerTierUpgrade(
    seller: EnhancedSellerProfile,
    newTier: SellerTier
): Promise<{ valid: boolean, errors: string[] }> {
    const errors: string[] = []
    const requirements = SELLER_TIER_CONFIG[newTier].requirements
    
    // Check sales
    if (seller.performance.total_sales < requirements.min_sales) {
        errors.push(
            `ยอดขายไม่ถึงเกณฑ์ (${seller.performance.total_sales}/${requirements.min_sales})`
        )
    }
    
    // Check revenue
    if (seller.performance.total_revenue < requirements.min_revenue) {
        errors.push(
            `รายได้ไม่ถึงเกณฑ์ (฿${seller.performance.total_revenue}/฿${requirements.min_revenue})`
        )
    }
    
    // Check rating
    if (seller.ratings.overall < requirements.min_rating) {
        errors.push(
            `คะแนนไม่ถึงเกณฑ์ (${seller.ratings.overall}/${requirements.min_rating})`
        )
    }
    
    // Check reviews
    if (seller.ratings.total_reviews < requirements.min_reviews) {
        errors.push(
            `จำนวนรีวิวไม่ถึงเกณฑ์ (${seller.ratings.total_reviews}/${requirements.min_reviews})`
        )
    }
    
    // Check for violations
    const violations = await db.sellerViolations.count({
        where: {
            seller_id: seller.id,
            created_at: { gte: subMonths(new Date(), 6) }
        }
    })
    
    if (violations > 0) {
        errors.push(`มีการละเมิดกฎ ${violations} ครั้งในช่วง 6 เดือนที่ผ่านมา`)
    }
    
    return {
        valid: errors.length === 0,
        errors
    }
}
```

---

## 📊 8. Monitoring & Alerts

### 8.1 Data Quality Metrics

```typescript
interface DataQualityMetrics {
    // Completeness
    users_with_complete_profile: number  // %
    sellers_with_kyc: number             // %
    products_with_images: number         // %
    
    // Accuracy
    trust_score_calculation_errors: number
    tier_calculation_errors: number
    points_balance_mismatches: number
    
    // Consistency
    orphaned_reviews: number             // Reviews without orders
    orphaned_wishlists: number           // Wishlists with deleted products
    duplicate_badges: number             // Same badge multiple times
    
    // Timeliness
    stale_ai_insights: number            // > 24 hours old
    pending_kyc_verifications: number    // > 7 days
    unprocessed_points_transactions: number
}

// Monitor function
async function monitorDataQuality(): Promise<DataQualityMetrics> {
    const metrics: DataQualityMetrics = {
        users_with_complete_profile: await calculateProfileCompleteness(),
        sellers_with_kyc: await calculateKYCRate(),
        // ... calculate all metrics
    }
    
    // Alert if thresholds exceeded
    if (metrics.points_balance_mismatches > 10) {
        await sendAlert({
            type: 'critical',
            message: `${metrics.points_balance_mismatches} points balance mismatches detected!`,
            action: 'Run reconciliation job immediately'
        })
    }
    
    if (metrics.stale_ai_insights > 100) {
        await sendAlert({
            type: 'warning',
            message: `${metrics.stale_ai_insights} sellers have stale AI insights`,
            action: 'Trigger AI insights regeneration'
        })
    }
    
    return metrics
}

// Schedule: ทุก 1 ชั่วโมง
```

### 8.2 Automated Fixes

```typescript
// Auto-fix common issues

async function runDataIntegrityChecks() {
    console.log('Running data integrity checks...')
    
    // 1. Fix trust level mismatches
    const usersWithMismatch = await db.users.findMany({
        where: {
            // SQL: trust_score.level != calculated_level
        }
    })
    
    for (const user of usersWithMismatch) {
        const correctLevel = getTrustLevel(user.trust_score.overall_score)
        await db.users.update({
            where: { id: user.id },
            data: {
                trust_score: {
                    ...user.trust_score,
                    level: correctLevel
                }
            }
        })
        console.log(`Fixed trust level for user ${user.id}`)
    }
    
    // 2. Reconcile points balances
    const loyaltyPrograms = await db.loyaltyPrograms.findMany()
    
    for (const loyalty of loyaltyPrograms) {
        await reconcilePointsBalance(loyalty.user_id)
    }
    
    // 3. Update stale AI insights
    const sellersWithStaleInsights = await db.sellerProfiles.findMany({
        where: {
            // ai_insights.last_updated < 24 hours ago
        }
    })
    
    for (const seller of sellersWithStaleInsights) {
        await queueAIInsightsGeneration(seller.id)
    }
    
    console.log('Data integrity checks completed')
}

// Schedule: ทุกวันเวลา 04:00
```

---

## ✅ Recommendations

### High Priority (ต้องทำทันที)

1. **✅ Implement Database Constraints**
   - Foreign keys
   - Check constraints
   - Unique constraints

2. **✅ Add Database Triggers**
   - Auto-update trust levels
   - Auto-update commission rates
   - Auto-calculate ratings

3. **✅ Implement Transaction Safety**
   - Points redemption
   - Tier upgrades/downgrades
   - Balance updates

4. **✅ Set Up Monitoring**
   - Data quality metrics
   - Automated alerts
   - Error tracking

### Medium Priority (ควรทำภายใน 1 เดือน)

5. **⚠️ Implement Reconciliation Jobs**
   - Points balance
   - Performance metrics
   - Rating distributions

6. **⚠️ Add Validation Layers**
   - Input validation (Zod)
   - Business logic validation
   - Data integrity checks

7. **⚠️ Implement Grace Periods**
   - Tier downgrades
   - Points expiry warnings
   - KYC verification reminders

### Low Priority (Nice to have)

8. **📝 API Versioning**
   - v1, v2 endpoints
   - Backward compatibility
   - Deprecation notices

9. **📝 Data Archival**
   - Old activity logs
   - Expired transactions
   - Deleted user data

10. **📝 Advanced Monitoring**
    - Real-time dashboards
    - Predictive alerts
    - Anomaly detection

---

**Document Version:** 1.0  
**Last Updated:** 2025-12-07  
**Status:** ✅ Complete  
**Severity Levels:** 🔴 Critical | ⚠️ Warning | ℹ️ Info
