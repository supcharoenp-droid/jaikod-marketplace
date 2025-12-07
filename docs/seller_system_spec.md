# Seller System Specification for JaiKod
**Version:** 1.0.0
**Status:** In Progress

## 1. Overview
The **JaiKod Seller System** aims to replicate the robust feature sets of leading e-commerce platforms like Shopee, Mercari, and Kaidee. It is designed to be intuitive for beginners ("Mini Shop" style) while providing advanced tools for professional sellers (Analytics, Promotions, Inventory Management).

## 2. Roadmap

### Phase 1: Foundation (Current Sprint)
- **Seller Center Dashboard (UI):** Central hub for all seller activities.
- **Enhanced Product Listing (v2):** 
    - AI-assisted descriptions (placeholder/mockup for now).
    - Multi-image drag & drop (improve existing).
    - Basic stock management (quantity).
- **Core Seller Profile:** Store name, cover image, basic verification badges.

### Phase 2: Engagement & Growth
- **Promotion Tools:** Boost products, discount coupons.
- **Chat System Upgrade:** Quick replies, offer negotiations.
- **Order Management:** Tracking status (Pending -> Shipped -> Completed).

### Phase 3: Professional Tools
- **Advanced Analytics:** Views, sales trends, conversion rates.
- **Financial Center:** Wallet system, withdrawal requests, transaction logs.
- **KYC & Verification:** ID Card upload and verification workflow.

## 3. Data Model Enhancements (Draft)

### User Profile Expansion (Firestore `users` collection)
```typescript
interface SellerProfile {
    // Basic Store Info
    storeName: string;
    storeDescription: string;
    storeCoverUrl?: string;
    
    // Verification
    isVerified: boolean;
    verificationLevel: 'unverified' | 'bronze' | 'silver' | 'gold' | 'diamond';
    kycStatus: 'none' | 'pending' | 'approved' | 'rejected';
    
    // Metrics
    rating: number; // 0-5
    reviewCount: number;
    followerCount: number;
    responseRate: number; // Percentage
    
    // Policies
    shippingPolicy: string;
    refundPolicy: string;
    
    // Seller Settings
    autoReplyMessage?: string;
}
```

### Product Expansion (Firestore `products` collection)
```typescript
interface Product {
    // ... existing fields ...
    
    // Inventory
    stockQuantity: number;
    sku?: string;
    
    // Variants (Phase 2+)
    hasVariants: boolean;
    variants?: ProductVariant[];
    
    // Promotion
    isBoosted: boolean;
    boostExpiry?: Timestamp;
    discount?: {
        type: 'percent' | 'fixed';
        value: number;
        startDate: Timestamp;
        endDate: Timestamp;
    };
    
    // SEO
    seoTitle?: string;
    seoDescription?: string;
    keywords?: string[];
}
```

## 4. UI/UX Plan

### Structure
- **Global Header:** Add "Seller Centre" link.
- **Seller Layout:** Sidebar with sections:
    - **Dashboard** (Overview)
    - **My Products** (List, Add New)
    - **My Sales** (Orders, Returns)
    - **Marketing Centre** (Coupons, Boosts)
    - **Finance** (Income, Bank Accounts)
    - **Shop Settings** (Profile, Decoration)

### Design Language
- **Clean & Professional:** Use white/gray backgrounds for data density.
- **Primary Color:** Use the brand's Neon Purple/Orange for primary actions (e.g., "Add Product").
- **Mobile First:** All tables and dashboards must collapse gracefully on mobile.

## 5. Technical Implementation Steps

1.  **Create Directory Structure:** `src/app/seller/*`
    - `layout.tsx`: Sidebar navigation.
    - `page.tsx`: Dashboard overview.
    - `products/page.tsx`: Product management list.
    - `products/create/page.tsx`: Enhanced Selling Form.
2.  **Dashboard Components:**
    - `StatCard`: Reusable component for metrics.
    - `RecentOrders`: Table widget.
    - `PerformanceChart`: ChartJS or Recharts widget.
3.  **Integrate:** Link standard user profile to Seller Centre.
