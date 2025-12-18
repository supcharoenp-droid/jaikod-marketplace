# Progressive Feature Unlocking System

## 📊 User Profile Structure

```json
{
  "role": "buyer | seller | shop | mall",
  "seller_level": "new | active | verified | premium",
  "ai_mode": "basic | pro | mall",
  "onboarding_step": 0-5,
  "features_unlocked": {
    "analytics": false,
    "marketing": false,
    "ai_pricing": false,
    "..."
  }
}
```

## 🎯 Feature Matrix by Role

### Buyer
- **Purpose**: Browse and purchase
- **Features**: None (consumer only)
- **AI Mode**: N/A

### Seller (Individual)
- **Purpose**: Sell personal items
- **Unlocked Features**:
  - ✅ Basic Analytics
  - ✅ Marketing Tools
  - ✅ AI Pricing
  - ✅ AI Description
  - ✅ AI Image Enhancement
- **Locked Features**:
  - 🔒 Advanced Analytics
  - 🔒 Bulk Upload
  - 🔒 Custom Shop Design
  - 🔒 API Access
- **AI Mode**: Basic

### Shop (Professional)
- **Purpose**: Run a professional online shop
- **Unlocked Features**:
  - ✅ All Seller features +
  - ✅ Advanced Analytics
  - ✅ Campaign Manager
  - ✅ Ads Manager
  - ✅ AI Chatbot
  - ✅ Custom Shop Design
  - ✅ Bulk Upload
  - ✅ Priority Support
  - ✅ Advanced Reports
- **Locked Features**:
  - 🔒 API Access
  - 🔒 Team Management
  - 🔒 Tax Invoice
  - 🔒 Custom Domain
- **AI Mode**: Pro

### Mall (Enterprise)
- **Purpose**: Large-scale business operations
- **Unlocked Features**:
  - ✅ ALL features unlocked
  - ✅ API Access
  - ✅ Team Management
  - ✅ Multi-channel Selling
  - ✅ Tax Invoice
  - ✅ Custom Domain
  - ✅ Dedicated Account Manager
  - ✅ AI Inventory Forecast
  - ✅ Competitor Insights
- **AI Mode**: Mall (Full AI Suite)

## 📈 Seller Level Progression

### New (Default)
- Just started selling
- Base features only

### Active
- **Requirements**:
  - 10+ successful sales
  - 30+ days active
- **Bonus Features**:
  - Advanced Analytics
  - Campaign Manager

### Verified
- **Requirements**:
  - KYC completed
  - 50+ successful sales
  - 4.0+ rating
- **Bonus Features**:
  - Priority Support
  - AI Inventory Forecast

### Premium
- **Requirements**:
  - 200+ successful sales
  - 4.5+ rating
  - Business verification
- **Bonus Features**:
  - Competitor Insights
  - Custom Domain
  - Dedicated Account Manager
  - API Access

## 🤖 AI Mode Capabilities

### Basic (Free)
- AI Pricing
- AI Description

### Pro (Shop+)
- All Basic +
- AI Image Enhancement
- AI Chatbot

### Mall (Enterprise)
- All Pro +
- AI Inventory Forecast
- Advanced AI Analytics

## 🔄 Upgrade Paths

### Buyer → Seller
**Benefits**:
- Start selling items
- AI-powered pricing
- Basic analytics
- Marketing tools

**Requirements**:
- ✅ Verify phone number
- ✅ Complete profile

### Seller → Shop
**Benefits**:
- Custom shop design
- Advanced analytics
- Campaign manager
- Bulk upload
- AI chatbot
- Priority support

**Requirements**:
- ✅ Verify identity (KYC)
- ✅ Add bank account
- ✅ Minimum 10 successful sales

### Shop → Mall
**Benefits**:
- Custom domain
- API access
- Team management
- Multi-channel selling
- Tax invoice
- Dedicated account manager
- AI inventory forecast
- Competitor insights

**Requirements**:
- ✅ Business registration
- ✅ Tax ID
- ✅ Minimum 100 products
- ✅ Minimum 50 sales/month

## 💻 Usage Examples

### Check if user has feature
```tsx
import { useUserProfile } from '@/hooks/useUserProfile'

function MyComponent() {
  const { hasFeature } = useUserProfile()
  
  return (
    <div>
      {hasFeature('analytics') && <AnalyticsDashboard />}
      {hasFeature('bulk_upload') && <BulkUploadButton />}
      {!hasFeature('api_access') && <UpgradePrompt />}
    </div>
  )
}
```

### Upgrade user role
```tsx
const { upgradeRole, nextUpgrade } = useUserProfile()

<button onClick={() => upgradeRole('shop')}>
  Upgrade to {nextUpgrade?.to}
</button>
```

### Display features dashboard
```tsx
import FeaturesDashboard from '@/components/profile/FeaturesDashboard'

<FeaturesDashboard />
```

## 🗄️ Firestore Schema

```typescript
// users/{userId}
{
  // Core
  uid: string
  email: string
  displayName: string
  
  // Role & Level
  role: 'buyer' | 'seller' | 'shop' | 'mall'
  seller_level: 'new' | 'active' | 'verified' | 'premium'
  seller_type: 'individual' | 'pro' | 'mall'
  
  // AI
  ai_mode: 'basic' | 'pro' | 'mall'
  ai_preferences: {
    auto_pricing: boolean
    auto_description: boolean
    auto_categorization: boolean
    smart_replies: boolean
  }
  
  // Features
  features_unlocked: {
    analytics: boolean
    advanced_analytics: boolean
    marketing: boolean
    campaigns: boolean
    ai_pricing: boolean
    // ... etc
  }
  
  // Verification
  verification: {
    email: boolean
    phone: boolean
    identity: boolean
    business: boolean
  }
  
  // Metadata
  created_at: timestamp
  updated_at: timestamp
  last_login: timestamp
}
```

## 🎨 UI Components

### FeaturesDashboard
- Shows all features grouped by category
- Visual locked/unlocked states
- Progress bar
- Upgrade suggestions

### FeatureCard
- Individual feature display
- Icon + name + description
- Lock/unlock indicator
- "Coming Soon" badge support

## 🔐 Security Rules

```javascript
// Firestore Security Rules
match /users/{userId} {
  allow read: if request.auth.uid == userId;
  allow write: if request.auth.uid == userId 
    && !request.resource.data.diff(resource.data).affectedKeys()
      .hasAny(['uid', 'created_at']); // Prevent changing immutable fields
}
```

## 📊 Analytics Events

```typescript
// Track feature usage
analytics.track('feature_used', {
  feature: 'ai_pricing',
  user_role: 'seller',
  user_level: 'active'
})

// Track upgrade
analytics.track('role_upgraded', {
  from: 'seller',
  to: 'shop',
  method: 'dashboard_button'
})
```

## 🚀 Future Enhancements

1. **Feature Trials**: Let users try premium features for 7 days
2. **A/B Testing**: Test different feature combinations
3. **Usage Limits**: Soft limits before upgrade (e.g., 5 products for seller)
4. **Gamification**: Badges for unlocking features
5. **Referral Bonuses**: Unlock features by referring friends
