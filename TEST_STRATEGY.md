# JaiKod Marketplace - QA & SRE Test Strategy

## 1. Overview & Test Scope

This document outlines the comprehensive testing strategy to ensure the reliability, performance, and security of the JaiKod Marketplace, specifically focusing on its AI-driven features and high-concurrency capability (Goal: 100k+ concurrent users).

**Test Pyramid Strategy:**
*   **E2E (20%)**: Critical User Journeys (Cypress/Playwright).
*   **Integration (30%)**: Service-to-Service contracts, AI Pipelines.
*   **Unit/Component (50%)**: Business logic, UI components.

---

## 2. Functional & E2E Test Suites

### Critical User Journey: "Snap & Sell" (Listing Creation)
| ID | Test Case | Steps | Expected Result |
| :--- | :--- | :--- | :--- |
| **TC-01** | **Upload & AI Analysis** | 1. Use Mobile View.<br>2. Upload image of "iPhone 13".<br>3. Wait 3s for AI. | 1. AI Auto-fills Title: "iPhone 13"<br>2. Category: "Mobiles"<br>3. Condition Score: >80 (if good img). |
| **TC-02** | **Fraud Check** | 1. Enter Description: "Line ID: scam123, transfer first".<br>2. Click Publish. | 1. System blocks submission.<br>2. Error: "Contains prohibited keywords/patterns". |
| **TC-03** | **Geo-Tagging** | 1. Select "Current Location" (Mock GPS). | 1. Address fills automatically (Province/District). |

### Critical User Journey: "Search & Discovery"
| ID | Test Case | Steps | Expected Result |
| :--- | :--- | :--- | :--- |
| **TC-04** | **Semantic Search** | 1. Search "มือถือถ่ายรูปสวย" (Good camera phone). | 1. Results include: iPhone Pro, Samsung S Series, Pixel.<br>2. No "Nokia 3310" (irrelevant). |
| **TC-05** | **Filter & Sort** | 1. Filter Price: 500-1000.<br>2. Sort: "Near Me". | 1. All results within price range.<br>2. Results sorted by distance ascending. |
| **TC-06** | **For You Feed** | 1. View 5 "Watch" listings.<br>2. Refresh Feed. | 1. Feed updates to show more "Watches" or related accessories. |

### Critical User Journey: "Trust & Safety"
| ID | Test Case | Steps | Expected Result |
| :--- | :--- | :--- | :--- |
| **TC-07** | **eKYC Flow** | 1. Upload ID + Selfie (Mock valid). | 1. Status changes to "Verified".<br>2. Trust Score increases by +20. |
| **TC-08** | **Chat Safety** | 1. Send "add my line" in chat. | 1. Warning banner appears for *Sender* and *Receiver*. |

---

## 3. Performance & Load Testing (k6)

**Objective**: Validate system behavior under peak load (simulating 10k concurrent users).
**Tools**: Grafana k6

### Example k6 Script: `load_test_marketplace.js`

```javascript
import http from 'k6/http';
import { check, sleep } from 'k6';
import { Trend } from 'k6/metrics';

// Custom Metrics
const searchLatency = new Trend('search_latency');
const feedLatency = new Trend('feed_latency');

export const options = {
  stages: [
    { duration: '2m', target: 1000 }, // Ramp up to 1k
    { duration: '5m', target: 5000 }, // Load 5k
    { duration: '2m', target: 10000 }, // Spike to 10k
    { duration: '2m', target: 0 },    // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p95<200'], // 95% of requests must complete below 200ms
    http_req_failed: ['rate<0.01'], // <1% errors
    'search_latency': ['p95<300'],  // Search can be slightly slower (AI overhead)
  },
};

const BASE_URL = 'https://api.jaikod.com/v1';

export default function () {
  const userId = Math.floor(Math.random() * 100000);
  
  // 1. Visit Homepage (Feed)
  let resFeed = http.get(`${BASE_URL}/feed/foryou?userId=${userId}`);
  check(resFeed, { 'status was 200': (r) => r.status == 200 });
  feedLatency.add(resFeed.timings.duration);
  
  sleep(1);

  // 2. Perform Search
  const keywords = ['iphone', 'nike', 'camera', 'dress'];
  const query = keywords[Math.floor(Math.random() * keywords.length)];
  
  let resSearch = http.get(`${BASE_URL}/search?q=${query}`);
  check(resSearch, { 'search success': (r) => r.status == 200 });
  searchLatency.add(resSearch.timings.duration);

  sleep(Math.random() * 3);
}
```

### Stress & Soak Strategy
*   **Soak Test**: Run simulated traffic at 50% load (5k users) for **24 hours**. Monitor Memory Leaks (RAM usage) and Disk I/O.
*   **Stress Test**: Increase load until failure (Break Point). Identify bottleneck (e.g., Database connections vs CPU).

---

## 4. Resilience & Chaos Engineering

We test "Graceful Degradation" – the system should bend, not break.

| Scenario | Component Failure | Expected Behavior (Fallback) |
| :--- | :--- | :--- |
| **Chaos-01** | **Vector DB (Milvus) Down** | Search Service switches to **Keyword-only mode** (Elasticsearch). "Semantic" results unavailable, but basic search works. |
| **Chaos-02** | **Recommendation Engine Latency > 500ms** | API triggers timeout. Returns **"Global Trending"** static list from Redis cache. User sees generic but valid content. |
| **Chaos-03** | **Redis Cache Flushed** | DB load spikes but handles traffic via Read Replicas. Latency increases temporarily but recovers as cache warms. |
| **Chaos-04** | **Payment Gateway Timeout** | Transaction status holds as "Pending". Background worker retries check every 1 min. User notified "Processing". |

---

## 5. Security Testing (Pentest Vectors)

1.  **IDOR (Insecure Direct Object Reference)**:
    *   Attempt to access/edit another user's listing by changing `listing_id` in API PUT request.
    *   Attempt to view another user's `order_history` or `chat_messages`.
2.  **Rate Limiting & Abuse**:
    *   Spam API calls to `POST /chat/message` (1000 req/sec) -> Expect `429 Too Many Requests`.
    *   Spam OTP Request -> Expect "Cooldown" error.
3.  **Malicious File Upload**:
    *   Upload `image.php.jpg` or `exploit.exe` disguised as image.
    *   Verify S3 bucket only serves content-type `image/*` and executes no code.
4.  **Injection**:
    *   SQL Injection tests on Search Query params.
    *   XSS payloads in "Listing Description" (`<script>alert(1)</script>`).

---

## 6. AI Model Validation & Monitoring

*   **Offline Evaluation (Pre-deploy)**:
    *   **Ranking**: `NDCG@10` must be > 0.85 on test set.
    *   **Fraud Detection**: `Recall` must be > 95% (Catch 95% of fraud), `Precision` > 80% (Minimize false bans).
*   **Online Monitoring (Post-deploy)**:
    *   **Data Drift**: Alert if distribution of "Search Queries" or "Price inputs" shifts by > 20% (PSI score).
    *   **Business Metrics**: If `Conversion Rate` drops by > 10% after model update -> **Auto-Rollback**.
*   **A/B Testing**:
    *   Control Group (50%): Current Model.
    *   Variant Group (50%): New Model.
    *   Compare `Click-Through Rate (CTR)` and `Session Time`.

## 7. Synthetic Data Generator

To test "Auto-Boost" and "Trending" without waiting for real users:
*   **Traffic Replay Bot**:
    *   Reads `access_logs` from previous day.
    *   Replays timestamped requests at 5x speed to "fast-forward" trend generation.
    *   Generates spikes (e.g., 1000 bots clicking "PS5" category) to verify "Trending Section" updates.

---

**Sign-off Criteria for Production Release:**
1.  [ ] All Critical User Journeys (TC-01 to TC-08) pass.
2.  [ ] Load Test: Supports 10k users with p95 Latency < 200ms.
3.  [ ] Pentest Report: No "High" or "Critical" vulnerabilities.
4.  [ ] AI Model: Shows positive lift in offline metrics vs baseline.
