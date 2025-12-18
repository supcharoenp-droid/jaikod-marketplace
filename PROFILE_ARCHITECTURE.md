// Profile System - Step 1 Foundation
// This file documents the architecture and routing structure

## ROUTING STRUCTURE
```
/profile                    → redirects to /profile/overview
/profile/overview           → Main dashboard
/profile/orders             → Order list (all statuses)
/profile/orders/:status     → Filtered orders (pending, paid, shipped, completed, cancelled)
/profile/address            → Address management  
/profile/payments           → Payment methods
/profile/wishlist           → Saved items
/profile/settings           → User settings
```

## SELLER ROUTES (for hybrid users)
```
/seller/dashboard           → Seller overview
/seller/products            → Product management
/seller/orders              → Seller orders
/seller/settings            → Seller settings
```

## GLOBAL STATE (ProfileContext)
Available via `useProfile()` hook:

```typescript
{
  user: {
    id: string
    name: string
    avatar: string
    email: string
    phone: string
    roles: ['buyer' | 'seller']
    prefersLanguage: 'th' | 'en'
  },
  
  stats: {
    coins: number
    points: number
    buyerLevel: number
    sellerLevel: number
    progress: { buyer: number, seller: number }
  },
  
  ordersSummary: {
    all, pending, paid, shipped, completed, cancelled: number
  },
  
  preferences: {
    notifications: boolean
    darkMode: boolean
  },
  
  roleMode: 'buyer' | 'seller' | 'hybrid'
}
```

## MODULE PLACEHOLDERS (Ready for Step 2-6)
- ProfileHeaderAI
- SidebarDynamic
- OrdersModule
- AddressModule
- PaymentsModule
- WishlistModule
- SettingsModule
- ActivityFeedAI

## DEV MODE
Mock user enabled by default in ProfileContext
- ID: dev_001
- Roles: buyer + seller
- Mock stats and orders included

## BREADCRUMB & NAVIGATION
- `useBreadcrumb()` hook tracks navigation history
- Smart back button logic:
  - Returns to previous page if in trail
  - Returns to /seller/dashboard if came from seller
  - Returns to / (home) as fallback

## I18N SUPPORT
All profile strings use `t('profile.key')` format
Supports TH/EN switching via LanguageContext
