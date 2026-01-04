# Promotion System Implementation Plan

This plan details the steps required to move the JaiKod Promotion System from its current "Mock" state to a fully functional "Production" state using Firebase.

## Phase 1: Data Architecture (Day 1)

### 1.1 Firestore Collections
Create the following collections to support the system:

- **`campaigns`**
    - `id`: string
    - `seller_id`: string
    - `product_id`: string
    - `type`: 'auto_boost' | 'flash_sale' | 'keyword_ad'
    - `status`: 'active' | 'paused' | 'completed' | 'no_budget'
    - `budget`: { `daily_limit`: number, `total_limit`: number, `spent_today`: number }
    - `bid_strategy`: { `type`: 'auto' | 'manual', `max_bid`: number }
    - `targeting`: { `keywords`: string[], `categories`: string[] }
    - `stats`: { `impressions`: number, `clicks`: number, `conversions`: number }
    - `created_at`: timestamp
    - `updated_at`: timestamp

- **`transactions_ad_spend`**
    - `id`: string
    - `seller_id`: string
    - `campaign_id`: string
    - `amount`: number
    - `type`: 'debit'
    - `reason`: 'click_charge' | 'impression_charge'
    - `timestamp`: timestamp

- **`wallets`**
    - `seller_id`: string
    - `balance`: number
    - `credits`: number (free credits)
    - `updated_at`: timestamp

### 1.2 Indexes
- Create composite indexes for:
    - `campaigns`: `status` + `type` + `budget.spent_today` (for fast ad serving queries)
    - `campaigns`: `seller_id` + `status` (for seller dashboard)

---

## Phase 2: Core Services (Day 2-3)

### 2.1 Wallet Service (`src/services/wallet.ts`)
- `getBalance(sellerId)`
- `deductFunds(sellerId, amount, reason)`
- `addFunds(sellerId, amount, source)`

### 2.2 Campaign Service (`src/services/campaign.ts`)
- `createCampaign(data)`
- `updateCampaignStatus(id, status)`
- `getActiveCampaignsForSearch(query, category)`: This is the critical function for the search engine.
- `trackImpression(campaignId)`: Batch updates every few minutes to save writes.
- `trackClick(campaignId)`: Real-time update + deduction.

---

## Phase 3: Search Engine Integration (Day 4)

### 3.1 Modify `unified-search.ts`
- **Inject Ads:**
    ```typescript
    // Inside search()
    const adSlots = [0, 5, 12, 20]; // Positions to insert ads
    const activeCampaigns = await campaignService.getActiveCampaignsForSearch(query);

    // Merge logic
    adSlots.forEach((slot, index) => {
        if (activeCampaigns[index]) {
            results.splice(slot, 0, transformCampaignToResult(activeCampaigns[index]));
        }
    });
    ```
- **Relevance Check:** Ensure ad keywords match or category matches current search context.

---

## Phase 4: Frontend "Realification" (Day 5)

### 4.1 Update Dashboards
- Replace `MOCK_` calls in `SellerInsightsDashboard.tsx` with `useQuery` hooks calling the real API.
- Connect `AutoBoostControl.tsx` toggle to `updateCampaignStatus`.

### 4.2 Top-up UI
- Create a "Wallet" page for sellers to buy credits.

## Phase 5: AI "Brain" Upgrade (Post-Launch)
- Replace static rules in `aiAutoBoost.ts` with a Cloud Function that runs nightly:
- Analyze CTR of all successful products.
- Update `suggested_bid` and `virality_score` on products.
