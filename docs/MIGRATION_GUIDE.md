# 🔄 Migration Guide - Enhanced Member System

## Overview

คู่มือนี้จะช่วยคุณในการอัพเกรดจากระบบสมาชิกเดิมไปสู่ระบบที่ได้รับการปรับปรุงใหม่

---

## 📋 Pre-Migration Checklist

- [ ] Backup ฐานข้อมูลทั้งหมด
- [ ] Review type definitions ใหม่
- [ ] ทดสอบใน development environment ก่อน
- [ ] แจ้งผู้ใช้เกี่ยวกับการอัพเกรด
- [ ] เตรียม rollback plan

---

## 🗄️ Database Migration

### Step 1: Add New Columns to Existing Tables

```sql
-- Users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS trust_score JSONB DEFAULT '{
    "overall_score": 50,
    "level": "bronze",
    "identity_score": 0,
    "transaction_score": 0,
    "behavior_score": 0,
    "community_score": 0,
    "factors": {"positive": [], "negative": []},
    "last_calculated": NOW(),
    "next_review": NOW() + INTERVAL ''7 days''
}'::jsonb;

ALTER TABLE users ADD COLUMN IF NOT EXISTS behavior_score JSONB DEFAULT '{
    "response_rate": 0,
    "response_time_avg": 0,
    "response_time_median": 0,
    "completion_rate": 0,
    "cancellation_rate": 0,
    "dispute_rate": 0,
    "last_active": NOW(),
    "active_days_last_30": 0,
    "avg_session_duration": 0,
    "report_count": 0,
    "warning_count": 0,
    "helpful_reviews_count": 0,
    "risk_level": "low",
    "risk_factors": [],
    "last_updated": NOW()
}'::jsonb;

ALTER TABLE users ADD COLUMN IF NOT EXISTS preferences JSONB DEFAULT '{
    "favorite_categories": [],
    "price_range": {"min": 0, "max": 1000000},
    "preferred_conditions": ["new", "like_new", "good"],
    "preferred_shipping": [],
    "notification_settings": {
        "email": true,
        "sms": false,
        "push": true,
        "marketing": true,
        "price_drop_alerts": true,
        "back_in_stock_alerts": true,
        "new_message_alerts": true,
        "order_updates": true
    },
    "language": "th",
    "theme": "auto",
    "currency": "THB",
    "privacy_settings": {
        "show_online_status": true,
        "show_last_seen": true,
        "allow_messages_from": "everyone",
        "show_purchase_history": false,
        "show_reviews": true
    },
    "ai_recommendations_enabled": true,
    "personalized_search_enabled": true,
    "updated_at": NOW()
}'::jsonb;

ALTER TABLE users ADD COLUMN IF NOT EXISTS gamification JSONB DEFAULT '{
    "level": 1,
    "experience_points": 0,
    "points_to_next_level": 100,
    "badges": [],
    "achievements": [],
    "login_streak": 0,
    "purchase_streak": 0,
    "review_streak": 0,
    "milestones_completed": []
}'::jsonb;

ALTER TABLE users ADD COLUMN IF NOT EXISTS kyc_status VARCHAR(50) DEFAULT 'not_verified';
ALTER TABLE users ADD COLUMN IF NOT EXISTS kyc_documents JSONB;
ALTER TABLE users ADD COLUMN IF NOT EXISTS devices JSONB DEFAULT '[]'::jsonb;
ALTER TABLE users ADD COLUMN IF NOT EXISTS security_settings JSONB DEFAULT '{
    "two_factor_enabled": false,
    "require_verification_new_device": true,
    "blocked_users": [],
    "is_banned": false
}'::jsonb;

-- Seller Profiles table
ALTER TABLE seller_profiles ADD COLUMN IF NOT EXISTS ratings JSONB DEFAULT '{
    "overall": 0,
    "total_reviews": 0,
    "product_quality": 0,
    "communication": 0,
    "shipping_speed": 0,
    "packaging": 0,
    "accuracy": 0,
    "value_for_money": 0,
    "rating_distribution": {
        "five_star": 0,
        "four_star": 0,
        "three_star": 0,
        "two_star": 0,
        "one_star": 0
    },
    "rating_trend": "stable",
    "last_30_days_avg": 0,
    "last_90_days_avg": 0,
    "last_updated": NOW()
}'::jsonb;

ALTER TABLE seller_profiles ADD COLUMN IF NOT EXISTS performance JSONB DEFAULT '{
    "total_sales": 0,
    "total_revenue": 0,
    "avg_order_value": 0,
    "last_30_days_sales": 0,
    "last_30_days_revenue": 0,
    "month_over_month_growth": 0,
    "total_customers": 0,
    "repeat_customer_rate": 0,
    "customer_retention_rate": 0,
    "order_fulfillment_rate": 0,
    "avg_processing_time": 0,
    "on_time_delivery_rate": 0,
    "return_rate": 0,
    "dispute_rate": 0,
    "defect_rate": 0,
    "response_time_avg": 0,
    "response_rate": 0,
    "active_listings": 0,
    "sold_out_listings": 0,
    "avg_stock_level": 0,
    "pending_balance": 0,
    "available_balance": 0,
    "total_withdrawn": 0,
    "last_calculated": NOW()
}'::jsonb;

ALTER TABLE seller_profiles ADD COLUMN IF NOT EXISTS tier_info JSONB DEFAULT '{
    "current_tier": "starter",
    "tier_level": 1,
    "benefits": [],
    "commission_rate": 5.0,
    "boost_multiplier": 1.0,
    "priority_support": false,
    "tier_achieved_at": NOW(),
    "tier_change_history": []
}'::jsonb;

ALTER TABLE seller_profiles ADD COLUMN IF NOT EXISTS ai_insights JSONB;
ALTER TABLE seller_profiles ADD COLUMN IF NOT EXISTS business_info JSONB;
ALTER TABLE seller_profiles ADD COLUMN IF NOT EXISTS operating_hours JSONB;
ALTER TABLE seller_profiles ADD COLUMN IF NOT EXISTS shipping_settings JSONB;
ALTER TABLE seller_profiles ADD COLUMN IF NOT EXISTS certifications JSONB DEFAULT '[]'::jsonb;
ALTER TABLE seller_profiles ADD COLUMN IF NOT EXISTS customer_service JSONB;
```

### Step 2: Create New Tables

```sql
-- Loyalty Programs
CREATE TABLE IF NOT EXISTS loyalty_programs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    points_balance INTEGER DEFAULT 0,
    points_lifetime INTEGER DEFAULT 0,
    points_pending INTEGER DEFAULT 0,
    points_expired INTEGER DEFAULT 0,
    tier VARCHAR(20) DEFAULT 'bronze',
    tier_points_required INTEGER DEFAULT 0,
    tier_achieved_at TIMESTAMP DEFAULT NOW(),
    tier_expires_at TIMESTAMP,
    member_since TIMESTAMP DEFAULT NOW(),
    last_updated TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id)
);

CREATE INDEX idx_loyalty_user_id ON loyalty_programs(user_id);
CREATE INDEX idx_loyalty_tier ON loyalty_programs(tier);

-- Points Transactions
CREATE TABLE IF NOT EXISTS points_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(20) NOT NULL,
    amount INTEGER NOT NULL,
    balance_after INTEGER NOT NULL,
    source VARCHAR(50) NOT NULL,
    source_id UUID,
    description TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'confirmed',
    expires_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_points_user_id ON points_transactions(user_id);
CREATE INDEX idx_points_created_at ON points_transactions(created_at DESC);
CREATE INDEX idx_points_source ON points_transactions(source);

-- Rewards Catalog
CREATE TABLE IF NOT EXISTS rewards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type VARCHAR(50) NOT NULL,
    name VARCHAR(255) NOT NULL,
    name_th VARCHAR(255) NOT NULL,
    description TEXT,
    image_url TEXT,
    points_required INTEGER NOT NULL,
    value VARCHAR(100),
    discount_type VARCHAR(20),
    stock INTEGER,
    stock_unlimited BOOLEAN DEFAULT false,
    min_purchase DECIMAL(10,2),
    applicable_categories JSONB,
    excluded_products JSONB,
    valid_days INTEGER DEFAULT 30,
    per_user_limit INTEGER,
    total_redemptions INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    is_featured BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW(),
    expires_at TIMESTAMP
);

CREATE INDEX idx_rewards_active ON rewards(is_active);
CREATE INDEX idx_rewards_points ON rewards(points_required);

-- Redeemed Rewards
CREATE TABLE IF NOT EXISTS redeemed_rewards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    reward_id UUID NOT NULL REFERENCES rewards(id),
    points_spent INTEGER NOT NULL,
    voucher_code VARCHAR(50),
    is_used BOOLEAN DEFAULT false,
    used_at TIMESTAMP,
    used_on_order UUID,
    valid_until TIMESTAMP NOT NULL,
    is_expired BOOLEAN DEFAULT false,
    redeemed_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_redeemed_user_id ON redeemed_rewards(user_id);
CREATE INDEX idx_redeemed_valid ON redeemed_rewards(valid_until);

-- Referral Programs
CREATE TABLE IF NOT EXISTS referral_programs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    referral_code VARCHAR(50) UNIQUE NOT NULL,
    custom_code VARCHAR(50),
    total_referrals INTEGER DEFAULT 0,
    successful_referrals INTEGER DEFAULT 0,
    pending_referrals INTEGER DEFAULT 0,
    total_earned_points INTEGER DEFAULT 0,
    total_earned_cash DECIMAL(10,2) DEFAULT 0,
    share_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    last_updated TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id)
);

CREATE INDEX idx_referral_code ON referral_programs(referral_code);
CREATE INDEX idx_referral_user_id ON referral_programs(user_id);

-- Referred Users
CREATE TABLE IF NOT EXISTS referred_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    referrer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    referee_id UUID REFERENCES users(id) ON DELETE SET NULL,
    email VARCHAR(255),
    status VARCHAR(50) DEFAULT 'pending',
    referred_at TIMESTAMP DEFAULT NOW(),
    signed_up_at TIMESTAMP,
    first_purchase_at TIMESTAMP,
    referrer_reward_claimed BOOLEAN DEFAULT false,
    referrer_reward_amount INTEGER DEFAULT 0,
    referee_reward_claimed BOOLEAN DEFAULT false,
    referee_reward_amount INTEGER DEFAULT 0,
    total_purchases INTEGER DEFAULT 0,
    total_spent DECIMAL(10,2) DEFAULT 0
);

CREATE INDEX idx_referred_referrer ON referred_users(referrer_id);
CREATE INDEX idx_referred_referee ON referred_users(referee_id);
CREATE INDEX idx_referred_status ON referred_users(status);

-- Wishlists
CREATE TABLE IF NOT EXISTS wishlists (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    added_at TIMESTAMP DEFAULT NOW(),
    price_at_add DECIMAL(10,2),
    price_drop_alert BOOLEAN DEFAULT true,
    target_price DECIMAL(10,2),
    back_in_stock_alert BOOLEAN DEFAULT true,
    price_drop_notified BOOLEAN DEFAULT false,
    back_in_stock_notified BOOLEAN DEFAULT false,
    priority VARCHAR(20) DEFAULT 'medium',
    notes TEXT,
    UNIQUE(user_id, product_id)
);

CREATE INDEX idx_wishlist_user_id ON wishlists(user_id);
CREATE INDEX idx_wishlist_product_id ON wishlists(product_id);

-- Collections
CREATE TABLE IF NOT EXISTS collections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    cover_image TEXT,
    product_ids JSONB DEFAULT '[]'::jsonb,
    item_count INTEGER DEFAULT 0,
    is_public BOOLEAN DEFAULT false,
    is_featured BOOLEAN DEFAULT false,
    follower_count INTEGER DEFAULT 0,
    view_count INTEGER DEFAULT 0,
    share_count INTEGER DEFAULT 0,
    tags JSONB DEFAULT '[]'::jsonb,
    category VARCHAR(100),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_collection_user_id ON collections(user_id);
CREATE INDEX idx_collection_public ON collections(is_public);

-- Enhanced Reviews (extend existing reviews table or create new)
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS detailed_ratings JSONB;
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS ai_analysis JSONB;
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS seller_response JSONB;
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS engagement JSONB DEFAULT '{
    "helpful_count": 0,
    "not_helpful_count": 0,
    "helpful_ratio": 0,
    "reported_count": 0,
    "view_count": 0,
    "share_count": 0
}'::jsonb;
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS moderation JSONB DEFAULT '{
    "status": "pending",
    "auto_moderation_passed": true,
    "requires_manual_review": false
}'::jsonb;
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS context JSONB;
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS badges JSONB DEFAULT '[]'::jsonb;
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS title VARCHAR(255);
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS pros JSONB;
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS cons JSONB;
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS media JSONB DEFAULT '[]'::jsonb;

-- Admin Enhancements
ALTER TABLE admin_users ADD COLUMN IF NOT EXISTS performance_metrics JSONB;
ALTER TABLE admin_users ADD COLUMN IF NOT EXISTS work_schedule JSONB;
ALTER TABLE admin_users ADD COLUMN IF NOT EXISTS specialization JSONB;
ALTER TABLE admin_users ADD COLUMN IF NOT EXISTS training JSONB;
ALTER TABLE admin_users ADD COLUMN IF NOT EXISTS security JSONB;

-- Moderation Queue
CREATE TABLE IF NOT EXISTS moderation_queue (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type VARCHAR(50) NOT NULL,
    item_id UUID NOT NULL,
    item_type VARCHAR(50) NOT NULL,
    item_data JSONB,
    priority VARCHAR(20) DEFAULT 'medium',
    priority_score INTEGER DEFAULT 50,
    flagged_reason JSONB DEFAULT '[]'::jsonb,
    flagged_by VARCHAR(50),
    reporter_id UUID,
    ai_recommendation VARCHAR(50),
    ai_confidence INTEGER,
    ai_risk_factors JSONB DEFAULT '[]'::jsonb,
    assigned_to UUID,
    assigned_at TIMESTAMP,
    status VARCHAR(50) DEFAULT 'pending',
    resolved_by UUID,
    resolved_at TIMESTAMP,
    resolution_action VARCHAR(100),
    resolution_notes TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    due_date TIMESTAMP
);

CREATE INDEX idx_moderation_status ON moderation_queue(status);
CREATE INDEX idx_moderation_priority ON moderation_queue(priority_score DESC);
CREATE INDEX idx_moderation_assigned ON moderation_queue(assigned_to);
```

### Step 3: Migrate Existing Data

```sql
-- Migrate existing user data
UPDATE users SET 
    trust_score = jsonb_set(
        trust_score,
        '{transaction_score}',
        to_jsonb(CASE 
            WHEN (SELECT COUNT(*) FROM orders WHERE buyer_id = users.id AND status = 'completed') > 50 THEN 80
            WHEN (SELECT COUNT(*) FROM orders WHERE buyer_id = users.id AND status = 'completed') > 20 THEN 60
            WHEN (SELECT COUNT(*) FROM orders WHERE buyer_id = users.id AND status = 'completed') > 5 THEN 40
            ELSE 20
        END)
    )
WHERE trust_score IS NOT NULL;

-- Initialize loyalty programs for existing users
INSERT INTO loyalty_programs (user_id, points_balance, tier, member_since)
SELECT 
    id,
    0,
    'bronze',
    created_at
FROM users
ON CONFLICT (user_id) DO NOTHING;

-- Award welcome points to existing users
INSERT INTO points_transactions (user_id, type, amount, balance_after, source, description)
SELECT 
    id,
    'earn',
    100,
    100,
    'signup',
    'Welcome bonus for existing member'
FROM users;

UPDATE loyalty_programs 
SET points_balance = 100
WHERE user_id IN (SELECT id FROM users);

-- Migrate seller ratings
UPDATE seller_profiles sp
SET ratings = jsonb_build_object(
    'overall', COALESCE(sp.rating_score, 0),
    'total_reviews', COALESCE(sp.rating_count, 0),
    'product_quality', COALESCE(sp.rating_score, 0),
    'communication', COALESCE(sp.rating_score, 0),
    'shipping_speed', COALESCE(sp.rating_score, 0),
    'packaging', COALESCE(sp.rating_score, 0),
    'accuracy', COALESCE(sp.rating_score, 0),
    'value_for_money', COALESCE(sp.rating_score, 0),
    'rating_trend', 'stable',
    'last_updated', NOW()
);

-- Calculate initial seller tiers
UPDATE seller_profiles sp
SET tier_info = jsonb_build_object(
    'current_tier', 
    CASE 
        WHEN (SELECT COUNT(*) FROM orders WHERE seller_id = sp.id AND status = 'completed') >= 500 
            AND sp.rating_score >= 4.7 THEN 'top_seller'
        WHEN (SELECT COUNT(*) FROM orders WHERE seller_id = sp.id AND status = 'completed') >= 200 
            AND sp.rating_score >= 4.5 THEN 'power_seller'
        WHEN (SELECT COUNT(*) FROM orders WHERE seller_id = sp.id AND status = 'completed') >= 50 
            AND sp.rating_score >= 4.3 THEN 'established'
        WHEN (SELECT COUNT(*) FROM orders WHERE seller_id = sp.id AND status = 'completed') >= 10 
            AND sp.rating_score >= 4.0 THEN 'rising'
        ELSE 'starter'
    END,
    'tier_achieved_at', NOW()
);
```

---

## 🔄 Code Migration

### Update Imports

**Before:**
```typescript
import { User, SellerProfile, Review } from '@/types'
```

**After:**
```typescript
import { EnhancedUser, EnhancedSellerProfile, EnhancedReview } from '@/types/enhanced'
// Or use individual imports
import { EnhancedUser } from '@/types/user.enhanced'
```

### Update Component Props

**Before:**
```typescript
function UserProfile({ user }: { user: User }) {
    return <div>{user.displayName}</div>
}
```

**After:**
```typescript
function UserProfile({ user }: { user: EnhancedUser }) {
    const trustIcon = getTrustLevelIcon(user.trust_score.level)
    return (
        <div>
            {user.displayName} {trustIcon}
            <TrustScoreBadge score={user.trust_score} />
        </div>
    )
}
```

### Update API Calls

**Before:**
```typescript
const user = await fetch(`/api/users/${id}`).then(r => r.json())
```

**After:**
```typescript
const user: EnhancedUser = await fetch(`/api/users/${id}/enhanced`).then(r => r.json())
```

---

## ⚙️ Configuration Updates

### Environment Variables

Add to `.env`:

```env
# AI Services
GOOGLE_VISION_API_KEY=your_key_here
OPENAI_API_KEY=your_key_here

# Loyalty Program
LOYALTY_POINTS_PER_100_BAHT=1
LOYALTY_WELCOME_BONUS=100
REFERRAL_BONUS_REFERRER=200
REFERRAL_BONUS_REFEREE=100

# Trust Score
TRUST_SCORE_CALCULATION_INTERVAL=3600000
TRUST_SCORE_MIN_TRANSACTIONS_FOR_GOLD=10
TRUST_SCORE_MIN_TRANSACTIONS_FOR_DIAMOND=100

# Seller Tiers
SELLER_TIER_UPDATE_INTERVAL=86400000
```

---

## 🧪 Testing Migration

### 1. Test Data Integrity

```sql
-- Check all users have trust scores
SELECT COUNT(*) FROM users WHERE trust_score IS NULL;

-- Check all sellers have tier info
SELECT COUNT(*) FROM seller_profiles WHERE tier_info IS NULL;

-- Check loyalty programs created
SELECT COUNT(*) FROM loyalty_programs;
```

### 2. Test API Endpoints

```bash
# Test enhanced user endpoint
curl http://localhost:3000/api/users/USER_ID/enhanced

# Test seller performance
curl http://localhost:3000/api/sellers/SELLER_ID/performance

# Test loyalty program
curl http://localhost:3000/api/loyalty/USER_ID
```

### 3. Test UI Components

- [ ] User profile displays trust badge
- [ ] Seller profile shows tier badge
- [ ] Reviews show detailed ratings
- [ ] Loyalty dashboard displays correctly
- [ ] Admin moderation queue works

---

## 🚨 Rollback Plan

If migration fails:

```sql
-- Rollback: Remove new columns
ALTER TABLE users DROP COLUMN IF EXISTS trust_score;
ALTER TABLE users DROP COLUMN IF EXISTS behavior_score;
ALTER TABLE users DROP COLUMN IF EXISTS preferences;
ALTER TABLE users DROP COLUMN IF EXISTS gamification;

-- Rollback: Drop new tables
DROP TABLE IF EXISTS loyalty_programs CASCADE;
DROP TABLE IF EXISTS points_transactions CASCADE;
DROP TABLE IF EXISTS rewards CASCADE;
DROP TABLE IF EXISTS redeemed_rewards CASCADE;
DROP TABLE IF EXISTS referral_programs CASCADE;
DROP TABLE IF EXISTS referred_users CASCADE;
DROP TABLE IF EXISTS wishlists CASCADE;
DROP TABLE IF EXISTS collections CASCADE;
DROP TABLE IF EXISTS moderation_queue CASCADE;

-- Restore from backup
-- psql -U username -d database_name < backup.sql
```

---

## 📊 Post-Migration Tasks

### 1. Run Initial Calculations

```bash
# Calculate trust scores for all users
npm run calculate-trust-scores

# Update seller tiers
npm run update-seller-tiers

# Generate AI insights
npm run generate-ai-insights
```

### 2. Set Up Cron Jobs

```javascript
// In your cron scheduler
schedule.scheduleJob('0 * * * *', calculateTrustScores) // Hourly
schedule.scheduleJob('0 0 * * *', updateSellerTiers) // Daily
schedule.scheduleJob('0 2 * * *', generateAIInsights) // Daily at 2 AM
schedule.scheduleJob('0 0 * * *', expirePoints) // Daily
```

### 3. Monitor Performance

- Check database query performance
- Monitor API response times
- Track error rates
- Review user feedback

---

## ✅ Migration Checklist

- [ ] Backup database
- [ ] Run database migrations
- [ ] Migrate existing data
- [ ] Update code imports
- [ ] Update API endpoints
- [ ] Update UI components
- [ ] Test thoroughly
- [ ] Deploy to staging
- [ ] User acceptance testing
- [ ] Deploy to production
- [ ] Monitor for issues
- [ ] Celebrate! 🎉

---

**Migration Version:** 1.0  
**Last Updated:** 2025-12-07  
**Estimated Time:** 4-6 hours  
**Recommended Downtime:** 1-2 hours
