# 🚀 Enhanced Member System - Quick Reference Guide

## 📖 Table of Contents

1. [Quick Start](#quick-start)
2. [Common Use Cases](#common-use-cases)
3. [API Examples](#api-examples)
4. [Component Examples](#component-examples)
5. [Database Queries](#database-queries)
6. [Best Practices](#best-practices)

---

## 🎯 Quick Start

### Import Types

```typescript
// User types
import { 
    EnhancedUser, 
    TrustScore, 
    BehaviorScore,
    GamificationProfile 
} from '@/types/user.enhanced'

// Seller types
import { 
    EnhancedSellerProfile,
    SellerTier,
    DetailedRatings,
    AIInsights
} from '@/types/seller.enhanced'

// Review types
import { 
    EnhancedReview,
    AIReviewAnalysis,
    ReviewStatistics
} from '@/types/review.enhanced'

// Loyalty types
import { 
    LoyaltyProgram,
    ReferralProgram,
    Wishlist
} from '@/types/loyalty'

// Admin types
import { 
    EnhancedAdminUser,
    ModerationQueue,
    AIAdminAssistant
} from '@/types/admin.enhanced'
```

### Import Utilities

```typescript
import { MemberSystemUtils } from '@/lib/memberSystemUtils'

// Or import specific functions
import { 
    calculateTrustScore,
    formatCurrency,
    validateThaiPhoneNumber
} from '@/lib/memberSystemUtils'
```

---

## 💡 Common Use Cases

### 1. Display User Trust Badge

```typescript
import { getTrustLevel, getTrustLevelIcon } from '@/lib/memberSystemUtils'

function UserTrustBadge({ user }: { user: EnhancedUser }) {
    const level = user.trust_score.level
    const icon = getTrustLevelIcon(level)
    const score = user.trust_score.overall_score
    
    return (
        <div className="trust-badge">
            <span>{icon}</span>
            <span>{level.toUpperCase()}</span>
            <span>({score}/100)</span>
        </div>
    )
}
```

### 2. Calculate and Display Seller Tier

```typescript
import { getSellerTierBadgeProps } from '@/lib/memberSystemUtils'

function SellerTierBadge({ seller }: { seller: EnhancedSellerProfile }) {
    const tier = seller.tier_info.current_tier
    const props = getSellerTierBadgeProps(tier)
    
    return (
        <div className="tier-badge" style={{ color: props.color }}>
            <span>{props.icon}</span>
            <span>{props.name}</span>
        </div>
    )
}
```

### 3. Show Loyalty Points

```typescript
import { formatPoints, getPointsToNextTier } from '@/lib/memberSystemUtils'

function LoyaltyDisplay({ loyalty }: { loyalty: LoyaltyProgram }) {
    const points = formatPoints(loyalty.points_balance)
    const toNext = getPointsToNextTier(
        loyalty.points_balance, 
        loyalty.tier
    )
    
    return (
        <div>
            <h3>คะแนนของคุณ: {points}</h3>
            <p>อีก {formatPoints(toNext)} แต้ม เพื่อเลื่อนระดับ</p>
        </div>
    )
}
```

### 4. Display Detailed Ratings

```typescript
import { formatRating, getStarIcons } from '@/lib/memberSystemUtils'

function DetailedRatingsDisplay({ ratings }: { ratings: DetailedRatings }) {
    return (
        <div className="ratings">
            <div className="overall">
                <span>{getStarIcons(ratings.overall)}</span>
                <span>{formatRating(ratings.overall)}</span>
                <span>({ratings.total_reviews} รีวิว)</span>
            </div>
            
            <div className="breakdown">
                <RatingBar label="คุณภาพสินค้า" value={ratings.product_quality} />
                <RatingBar label="การสื่อสาร" value={ratings.communication} />
                <RatingBar label="ความเร็วจัดส่ง" value={ratings.shipping_speed} />
                <RatingBar label="การบรรจุภัณฑ์" value={ratings.packaging} />
                <RatingBar label="ความแม่นยำ" value={ratings.accuracy} />
            </div>
        </div>
    )
}

function RatingBar({ label, value }: { label: string, value: number }) {
    const percentage = (value / 5) * 100
    return (
        <div className="rating-bar">
            <span>{label}</span>
            <div className="bar">
                <div className="fill" style={{ width: `${percentage}%` }} />
            </div>
            <span>{formatRating(value)}</span>
        </div>
    )
}
```

---

## 🔌 API Examples

### User APIs

#### Get Enhanced User Profile

```typescript
// GET /api/users/:id/enhanced
async function getEnhancedUser(userId: string): Promise<EnhancedUser> {
    const response = await fetch(`/api/users/${userId}/enhanced`)
    return response.json()
}
```

#### Update Trust Score

```typescript
// POST /api/users/:id/trust-score/calculate
async function calculateUserTrustScore(userId: string) {
    const response = await fetch(`/api/users/${userId}/trust-score/calculate`, {
        method: 'POST'
    })
    return response.json()
}
```

#### Verify KYC

```typescript
// POST /api/users/:id/verify-kyc
async function verifyKYC(userId: string, documents: {
    nationalId?: File
    facePhoto?: File
    bankStatement?: File
}) {
    const formData = new FormData()
    if (documents.nationalId) formData.append('nationalId', documents.nationalId)
    if (documents.facePhoto) formData.append('facePhoto', documents.facePhoto)
    if (documents.bankStatement) formData.append('bankStatement', documents.bankStatement)
    
    const response = await fetch(`/api/users/${userId}/verify-kyc`, {
        method: 'POST',
        body: formData
    })
    return response.json()
}
```

### Seller APIs

#### Get Seller Performance

```typescript
// GET /api/sellers/:id/performance
async function getSellerPerformance(sellerId: string) {
    const response = await fetch(`/api/sellers/${sellerId}/performance`)
    return response.json()
}
```

#### Get AI Insights

```typescript
// GET /api/sellers/:id/ai-insights
async function getAIInsights(sellerId: string): Promise<AIInsights> {
    const response = await fetch(`/api/sellers/${sellerId}/ai-insights`)
    return response.json()
}
```

#### Update Seller Tier

```typescript
// POST /api/sellers/:id/update-tier
async function updateSellerTier(sellerId: string) {
    const response = await fetch(`/api/sellers/${sellerId}/update-tier`, {
        method: 'POST'
    })
    return response.json()
}
```

### Review APIs

#### Create Enhanced Review

```typescript
// POST /api/reviews/create-enhanced
async function createEnhancedReview(review: {
    orderId: string
    productId: string
    ratings: {
        product_quality: number
        value_for_money: number
        seller_service: number
        shipping_speed: number
        packaging_quality: number
        accuracy: number
    }
    comment: string
    title?: string
    pros?: string[]
    cons?: string[]
    media?: File[]
}) {
    const formData = new FormData()
    formData.append('orderId', review.orderId)
    formData.append('productId', review.productId)
    formData.append('ratings', JSON.stringify(review.ratings))
    formData.append('comment', review.comment)
    if (review.title) formData.append('title', review.title)
    if (review.pros) formData.append('pros', JSON.stringify(review.pros))
    if (review.cons) formData.append('cons', JSON.stringify(review.cons))
    
    review.media?.forEach((file, index) => {
        formData.append(`media_${index}`, file)
    })
    
    const response = await fetch('/api/reviews/create-enhanced', {
        method: 'POST',
        body: formData
    })
    return response.json()
}
```

#### Get Review Statistics

```typescript
// GET /api/reviews/statistics?productId=xxx or sellerId=xxx
async function getReviewStatistics(params: {
    productId?: string
    sellerId?: string
}): Promise<ReviewStatistics> {
    const query = new URLSearchParams(params as any)
    const response = await fetch(`/api/reviews/statistics?${query}`)
    return response.json()
}
```

### Loyalty APIs

#### Get Loyalty Program

```typescript
// GET /api/loyalty/:userId
async function getLoyaltyProgram(userId: string): Promise<LoyaltyProgram> {
    const response = await fetch(`/api/loyalty/${userId}`)
    return response.json()
}
```

#### Earn Points

```typescript
// POST /api/loyalty/earn-points
async function earnPoints(data: {
    userId: string
    source: 'purchase' | 'review' | 'referral' | 'signup' | 'daily_login'
    amount: number
    sourceId?: string
    description: string
}) {
    const response = await fetch('/api/loyalty/earn-points', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })
    return response.json()
}
```

#### Redeem Points

```typescript
// POST /api/loyalty/redeem-points
async function redeemPoints(data: {
    userId: string
    rewardId: string
    pointsToSpend: number
}) {
    const response = await fetch('/api/loyalty/redeem-points', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })
    return response.json()
}
```

### Referral APIs

#### Get Referral Stats

```typescript
// GET /api/referral/:userId
async function getReferralStats(userId: string): Promise<ReferralProgram> {
    const response = await fetch(`/api/referral/${userId}`)
    return response.json()
}
```

#### Create Referral Code

```typescript
// POST /api/referral/create-code
async function createReferralCode(userId: string, customCode?: string) {
    const response = await fetch('/api/referral/create-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, customCode })
    })
    return response.json()
}
```

### Admin APIs

#### Get Moderation Queue

```typescript
// GET /api/admin/moderation-queue
async function getModerationQueue(filters?: {
    type?: 'product' | 'review' | 'user' | 'seller'
    priority?: 'critical' | 'high' | 'medium' | 'low'
    status?: 'pending' | 'in_review' | 'approved' | 'rejected'
    assignedTo?: string
}): Promise<ModerationQueue[]> {
    const query = new URLSearchParams(filters as any)
    const response = await fetch(`/api/admin/moderation-queue?${query}`)
    return response.json()
}
```

#### Perform Bulk Action

```typescript
// POST /api/admin/bulk-action
async function performBulkAction(data: {
    action: 'approve' | 'reject' | 'ban' | 'delete'
    targetType: 'product' | 'review' | 'user' | 'seller'
    targetIds: string[]
    reason?: string
    notes?: string
}) {
    const response = await fetch('/api/admin/bulk-action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })
    return response.json()
}
```

---

## 🎨 Component Examples

### Trust Score Card

```tsx
import { EnhancedUser } from '@/types/user.enhanced'
import { getTrustLevelColor, getTrustLevelIcon } from '@/lib/memberSystemUtils'

export function TrustScoreCard({ user }: { user: EnhancedUser }) {
    const { trust_score } = user
    const color = getTrustLevelColor(trust_score.level)
    const icon = getTrustLevelIcon(trust_score.level)
    
    return (
        <div className="trust-score-card" style={{ borderColor: color }}>
            <div className="header">
                <span className="icon">{icon}</span>
                <h3>{trust_score.level.toUpperCase()}</h3>
                <span className="score">{trust_score.overall_score}/100</span>
            </div>
            
            <div className="breakdown">
                <ScoreBar label="ยืนยันตัวตน" value={trust_score.identity_score} />
                <ScoreBar label="ประวัติการซื้อขาย" value={trust_score.transaction_score} />
                <ScoreBar label="พฤติกรรม" value={trust_score.behavior_score} />
                <ScoreBar label="ชุมชน" value={trust_score.community_score} />
            </div>
            
            <div className="factors">
                <div className="positive">
                    <h4>จุดเด่น</h4>
                    <ul>
                        {trust_score.factors.positive.map((factor, i) => (
                            <li key={i}>✓ {factor}</li>
                        ))}
                    </ul>
                </div>
                {trust_score.factors.negative.length > 0 && (
                    <div className="negative">
                        <h4>ควรปรับปรุง</h4>
                        <ul>
                            {trust_score.factors.negative.map((factor, i) => (
                                <li key={i}>⚠ {factor}</li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    )
}

function ScoreBar({ label, value }: { label: string, value: number }) {
    return (
        <div className="score-bar">
            <span className="label">{label}</span>
            <div className="bar">
                <div className="fill" style={{ width: `${value}%` }} />
            </div>
            <span className="value">{value}</span>
        </div>
    )
}
```

### Seller Tier Progress

```tsx
import { EnhancedSellerProfile } from '@/types/seller.enhanced'
import { calculateTierProgress, getSellerTierBadgeProps } from '@/lib/memberSystemUtils'

export function SellerTierProgress({ seller }: { seller: EnhancedSellerProfile }) {
    const { tier_info, performance, ratings } = seller
    const progress = calculateTierProgress(tier_info.current_tier, performance, ratings)
    const currentProps = getSellerTierBadgeProps(tier_info.current_tier)
    
    return (
        <div className="tier-progress">
            <div className="current-tier">
                <span className="icon">{currentProps.icon}</span>
                <h3>{currentProps.name}</h3>
            </div>
            
            {tier_info.next_tier && (
                <>
                    <div className="progress-bars">
                        <ProgressBar 
                            label="ยอดขาย" 
                            progress={progress.sales} 
                            target={tier_info.next_tier_requirements?.min_sales}
                        />
                        <ProgressBar 
                            label="รายได้" 
                            progress={progress.revenue}
                            target={tier_info.next_tier_requirements?.min_revenue}
                        />
                        <ProgressBar 
                            label="คะแนน" 
                            progress={progress.rating}
                            target={tier_info.next_tier_requirements?.min_rating}
                        />
                    </div>
                    
                    <div className="overall-progress">
                        <h4>ความคืบหน้าโดยรวม</h4>
                        <div className="big-progress-bar">
                            <div className="fill" style={{ width: `${progress.overall}%` }} />
                        </div>
                        <span>{progress.overall}%</span>
                    </div>
                </>
            )}
        </div>
    )
}
```

### Loyalty Dashboard

```tsx
import { LoyaltyProgram } from '@/types/loyalty'
import { formatPoints, getPointsToNextTier, LOYALTY_TIER_CONFIG } from '@/lib/memberSystemUtils'

export function LoyaltyDashboard({ loyalty }: { loyalty: LoyaltyProgram }) {
    const tierConfig = LOYALTY_TIER_CONFIG[loyalty.tier]
    const toNext = getPointsToNextTier(loyalty.points_balance, loyalty.tier)
    
    return (
        <div className="loyalty-dashboard">
            <div className="tier-badge" style={{ backgroundColor: tierConfig.color }}>
                <span className="icon">{tierConfig.icon}</span>
                <h2>{tierConfig.name_th}</h2>
            </div>
            
            <div className="points-balance">
                <h3>คะแนนของคุณ</h3>
                <div className="balance">{formatPoints(loyalty.points_balance)}</div>
                {loyalty.next_tier && (
                    <p>อีก {formatPoints(toNext)} แต้ม เพื่อเป็น {LOYALTY_TIER_CONFIG[loyalty.next_tier].name_th}</p>
                )}
            </div>
            
            <div className="benefits">
                <h4>สิทธิพิเศษของคุณ</h4>
                <ul>
                    {tierConfig.benefits.map((benefit, i) => (
                        <li key={i}>✓ {benefit}</li>
                    ))}
                </ul>
            </div>
            
            <div className="recent-transactions">
                <h4>ประวัติการใช้แต้ม</h4>
                {loyalty.points_history.slice(0, 5).map(tx => (
                    <div key={tx.id} className="transaction">
                        <span className={tx.type}>{tx.description}</span>
                        <span className={tx.amount > 0 ? 'earn' : 'redeem'}>
                            {tx.amount > 0 ? '+' : ''}{formatPoints(tx.amount)}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    )
}
```

---

## 🗄️ Database Queries

### Get User with Enhanced Data

```sql
SELECT 
    u.*,
    u.trust_score,
    u.behavior_score,
    u.preferences,
    u.gamification,
    l.points_balance,
    l.tier as loyalty_tier
FROM users u
LEFT JOIN loyalty_programs l ON l.user_id = u.id
WHERE u.id = $1;
```

### Get Seller with Performance Metrics

```sql
SELECT 
    sp.*,
    sp.ratings,
    sp.performance,
    sp.tier_info,
    sp.ai_insights,
    COUNT(DISTINCT o.id) as total_orders,
    SUM(o.net_total) as total_revenue,
    AVG(r.rating) as avg_rating
FROM seller_profiles sp
LEFT JOIN orders o ON o.seller_id = sp.id AND o.status = 'completed'
LEFT JOIN reviews r ON r.seller_id = sp.id
WHERE sp.id = $1
GROUP BY sp.id;
```

### Get Top Sellers by Tier

```sql
SELECT 
    sp.*,
    u.displayName,
    u.photoURL
FROM seller_profiles sp
JOIN users u ON u.id = sp.user_id
WHERE sp.tier_info->>'current_tier' = 'top_seller'
ORDER BY (sp.performance->>'total_revenue')::numeric DESC
LIMIT 10;
```

### Get Pending Moderation Queue

```sql
SELECT 
    mq.*,
    p.title as product_title,
    u.displayName as reporter_name
FROM moderation_queue mq
LEFT JOIN products p ON p.id = mq.item_id AND mq.type = 'product'
LEFT JOIN users u ON u.id = mq.reporter_id
WHERE mq.status = 'pending'
ORDER BY mq.priority_score DESC, mq.created_at ASC
LIMIT 50;
```

---

## ✅ Best Practices

### 1. Trust Score Calculation

- ✅ Recalculate trust scores **daily** via cron job
- ✅ Update immediately after significant events (KYC verification, major purchase)
- ✅ Cache trust scores for 1 hour to reduce database load
- ❌ Don't calculate on every page load

### 2. Seller Tier Updates

- ✅ Check tier eligibility **daily**
- ✅ Notify sellers when they're close to next tier (90% progress)
- ✅ Celebrate tier upgrades with email/notification
- ❌ Don't downgrade tiers immediately - give grace period

### 3. Review Moderation

- ✅ Use AI for initial spam detection
- ✅ Flag suspicious reviews for manual review
- ✅ Respond to all negative reviews within 24 hours
- ❌ Don't auto-reject reviews without human verification

### 4. Loyalty Points

- ✅ Award points immediately after purchase confirmation
- ✅ Send expiry warnings 30 days before points expire
- ✅ Make redemption process simple (1-click)
- ❌ Don't expire points without warning

### 5. Performance Optimization

- ✅ Use database indexes on frequently queried fields
- ✅ Cache expensive calculations (AI insights, statistics)
- ✅ Use pagination for large lists
- ✅ Lazy load images and heavy components
- ❌ Don't load all data at once

### 6. Security

- ✅ Encrypt sensitive data (KYC documents, bank accounts)
- ✅ Use HTTPS for all API calls
- ✅ Implement rate limiting on sensitive endpoints
- ✅ Log all admin actions for audit trail
- ❌ Don't expose internal IDs in URLs

---

## 📚 Additional Resources

- [Full Documentation](./enhanced_member_system.md)
- [Type Definitions](../src/types/)
- [Utility Functions](../src/lib/memberSystemUtils.ts)
- [Product Specification](../.agent/workflows/jaikod-product-spec.md)

---

**Last Updated:** 2025-12-07  
**Version:** 1.0  
**Status:** Ready for Implementation 🚀
