# Promotion System & AI Analysis Report

**Date:** January 3, 2026
**Status:** Alpha (Frontend Polished, Backend Mocked)

## 1. Executive Summary
The promotion system in JaiKod is designed to be "AI-Native", shifting from a traditional "Banner Ad" model to a "Native Content" model. The frontend (Seller Dashboard, Badges) is currently at a **High Fidelity** state, offering a premium experience. However, the backend logic is largely **Mocked**, running on static data and simulated AI scores.

## 2. Component Analysis

### A. Seller Insights Dashboard (`SellerInsightsDashboard.tsx`)
**Status:** ✅ **Complete UI / 🚧 Mock Data**
- **UX/UI:** Extremely polished. Uses a "Dark Mode" aesthetic with neon accents (Purple/Emerald) to convey "AI Intelligence".
- **Features:**
    - **Funnel Visualization:** Impressions -> Clicks -> Leads -> Sales.
    - **AI Predictions:** "Predictive ROI" component allows simulating budget vs. results.
    - **Market Pulse:** Compares seller pricing/response time with competitors.
- **Data Source:** Currently fetches from `getSellerInsights` (Mock Service).

### B. Auto-Boost Logic (`aiAutoBoost.ts`)
**Status:** 🚧 **Prototype**
- **Logic:** Uses a rule-based "Momentum Score" rather than Deep Learning.
    - *Viral Potential:* High CTR (>5%)
    - *High Intent:* High chat rate
- **Automation:** Can "trigger" a boost, but currently just logs to a mock history.
- **Cost Model:** Simulated "Bid" system ($5 max).

### C. Buyer Experience (`PromotionBadge.tsx`, `SmartProductCardV3`)
**Status:** ✅ **Production Ready**
- **Visuals:** High-quality badges (`Premium`, `Sponsored`, `Organic Boost`) that blend into the card design.
- **Transparency:** Users can click an "Info" icon to see *why* an item is promoted (e.g., "Recommended for your browsing history"). This is a crucial "Anti-Dark Pattern" feature.

### D. Search Integration (`search/page.tsx`)
**Status:** ⚠️ **Partial Integration**
- The search page uses `SmartProductCardV3` which supports badges.
- However, the search algorithm (`unified-search.ts`) likely does not yet heavily weigh "Boosted" status in its ranking logic, relying instead on text relevance. Use of `MOCK_PROMOTIONS` suggests "Ad Injection" isn't fully live in the real search index.

---

## 3. Detailed Perspective Analysis

### 🎯 Seller Perspective (The "Promoter")
**Current Experience:**
- **Feeling:** "Professional" and "Empowered". The dashboard makes them feel like a marketing agency is working for them.
- **Pain Points (Potential):**
    - **Confusion on "Why":** If the AI suggests a boost, they might blindly trust it. The explanation (e.g., "Traffic is high in Ari") needs to be accurate, not just random flavor text.
    - **Cost Control:** The current UI simulates a slider, but without a real Wallet, they can't feel the "pain" of spending.

**Missing Flows:**
- **Top-up / Wallet:** No screen to add funds.
- **Campaign Management:** No way to *stop* a campaign manually in the simplified UI (Auto-boost handles it, but manual override is needed).

### 🔍 Searcher Perspective (The "Buyer")
**Current Experience:**
- **Ad Blindness Mitigation:** Ads look like normal native content, just with a small badge. This increases engagement.
- **Relevance:** The "Organic Boost" badge (For You) is excellent for engagement, even if not paid.
- **Trust:** The transparency modal ("Why am I seeing this?") builds immense trust.

**Risks:**
- **Over-saturation:** If too many "Sponsored" items appear, trust will drop.
- **Irrelevance:** If the mock AI logic promotes "Tires" to a user looking for "Lipstick", the "AI-Native" brand promise breaks.

---

## 4. Gap Analysis & Roadmap

| Feature | Current State | Priority | Action Needed |
| :--- | :--- | :--- | :--- |
| **Data Persistence** | Mocked (Static JSON) | 🔴 **Critical** | Create `promotions`, `campaigns`, `wallet` collections in Firestore. |
| **Search Injection** | Manual / Mocked | 🔴 **Critical** | Update `unified-search.ts` to fetch active campaigns and inject them into results (e.g., every 5th slot). |
| **Billing System** | Non-existent | 🟠 **High** | Implement `Credits` system (Deduct on impression/click). |
| **AI Model** | Rule-based (If-else) | 🟡 **Medium** | Keep rule-based for now, but feed it *real* analytics data. |
| **Tracking** | Console Logs | 🟠 **High** | Implement specific `logEvent` calls for Impressions and Clicks to update campaign stats. |

## 5. Next Steps Recommendation

1.  **Backend "Realification":**
    - Create `src/services/promotion-real.ts` connected to Firestore.
    - Define Firestore schema for `campaigns`.
2.  **Search Injection:**
    - Modify `performUnifiedSearch` to query active campaigns alongside products.
    - Merge results: `[Organic, Organic, Sponsored, Organic, ...]`
3.  **Wallet System:**
    - Simple "Credit" field on User profile.
    - Transaction log for ad spend.

