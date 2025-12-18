# JaiKod AI Systems Architecture & MLOps Strategy

## 1. AI Ecosystem Overview

This document outlines the orchestration of the AI models powering JaiKod's "Intelligence Layer". The goal is to create a cohesive ecosystem where models share data, learn from feedback, and operate within strict latency and safety bounds.

### High-Level AI Data Flow

```mermaid
graph LR
    User[User Interactions] --> EventBus(Kafka)
    EventBus --> StreamProc[Stream Processor (Flink)]
    EventBus --> DataLake[(Data Lake / S3)]
    
    subgraph "Feature Engineering"
        StreamProc --> OnlineStore[(Online Feature Store - Redis)]
        DataLake --> BatchProc[Batch ETL]
        BatchProc --> OfflineStore[(Offline Feature Store - BigQuery/Parquet)]
    end
    
    subgraph "Training Pipeline (Airflow/Kubeflow)"
        OfflineStore --> Training[Model Training]
        Training --> Validation[Model Validation]
        Validation --> Registry[Model Registry (MLflow)]
    end
    
    subgraph "Inference Layer (K8s / Served Models)"
        OnlineStore --> RankingSvc[Ranking Service]
        Registry --> RankingSvc
        OnlineStore --> RecSvc[Recommendation Service]
        OnlineStore --> FraudSvc[Fraud Detector]
        RankingSvc --> FinalOutput
    end
    
    User --> RankingSvc
```

---

## 2. The Core: Feature Store Architecture (Feast)

We utilize a centralized **Feature Store** to ensure consistency between training (offline) and inference (online).

### Key Entities & Features

| Entity | Batch Features (Updated Daily) | Real-time Features (Updated < 1s) |
| :--- | :--- | :--- |
| **User** | `age_group`, `gender`, `lifetime_spend`, `top_categories_30d` | `session_clicks_last_5m`, `current_search_query`, `last_viewed_category` |
| **Product** | `embedding_vector`, `quality_score`, `condition_grade`, `seller_trust_score` | `views_last_hour`, `ctr_last_hour`, `is_boosted_now`, `stock_status` |
| **Context** | `holiday_calendar`, `avg_category_price_history` | `user_geo_latlong`, `time_of_day`, `device_type` |

---

## 3. Inference Orchestration: The Ranking "Brain"

When a user requests the "For You" feed or Search results, the **Ranking Service** orchestrates multiple models in a strictly timed pipeline (Target Latency: < 200ms).

### Request Flow Sequence

1.  **Candidate Generation (Recall)**:
    *   *Input*: User ID, Geo, Query.
    *   *System*: Vector Search (Milvus) + Keyword Search (Elasticsearch).
    *   *Action*: Retrieve Top 1,000 potential matches.
    *   *Fallback*: If Vector DB fails, use popular items in user's region.

2.  **Pre-Filtering (Hard Rules)**:
    *   *Input*: 1,000 Candidates.
    *   *Logic*: Remove out-of-stock, banned sellers, far distance (> 500km relative to settings).

3.  **Feature Hydration**:
    *   *Action*: Fetch `User` and `Product` features from **Online Feature Store** for the remaining candidates.

4.  **Scoring (The Heavy Lifter)**:
    *   *Model*: **LightGBM / XGBoost** (Learning to Rank).
    *   *Input*: Feature Vectors.
    *   *Output*: Probability of Click/Conversion (pCTR, pCVR).
    *   *Logic*: `FinalScore = (pCTR * w1) + (pCVR * w2) + (SellerTrust * w3) + (BoostMultiplier)`.

5.  **Safety & Diversity Re-Ranking**:
    *   *Logic*: Ensure no more than 3 listings from the same seller in a row.
    *   *Fraud Check*: Call **Fraud Service** for score < Threshold checks on high-risk items.

6.  **Final Polish**:
    *   *Logic*: Inject "Sponsored/Ads" slots at fixed positions (e.g., slot 4, 12).
    *   *Output*: Return Top 20 items to Frontend.

---

## 4. Shared AI Services & APIs

These microservices run independently and scale automatically based on queue depth.

### A. Visual Intelligence Service (GPU)
*   **Models**: YOLOv8 (Object Detection), ResNet/EfficientNet (Condition Classification), Siamese Network (Duplicate Detection).
*   **Tasks**:
    *   `POST /analyze-image`: Returns { category, condition_score, safety_flags }.
    *   `POST /ekyc-match`: Returns { face_match_score, liveness_prob }.

### B. Natural Language Service (CPU/GPU)
*   **Models**: DistilBERT (Multilingual) or small LLM (Llama-3-8b-quantized).
*   **Tasks**:
    *   `POST /analyze-text`: Detect offensive language, prohibited items, or "diversion" attempts (e.g., "Line ID").
    *   `POST /auto-reply`: Generate smart chat suggestions.

### C. Auto-Boost Autopilot (Agent)
*   **Type**: Reinforcement Learning (Bandit) or Rule-Based Heuristic.
*   **Logic**: "Pull" listings with high *Momentum* (Velocity of Views) and allocate budget to bid for "Trending" slots.
*   **Feedback**: If Boost -> No Click, reduce aggressive bidding for that item.

---

## 5. MLOps: Lifecycle & Feedback Loops

### Continuous Training (CT) Pipeline
1.  **Data Collection**: Kafka logs every `impression`, `click`, `add_to_cart`, `order`.
2.  **Labeling**: Click = 1, Skip = 0. Attribution window = 1 hour.
3.  **Trigger**: Automatic retraining when:
    *   Data volume > 100k new interactions.
    *   *Model Drift* metric (PSI) exceeds 0.2.
4.  **Evaluation**:
    *   Train on `TrainSet` (Last 28 days).
    *   Test on `HoldoutSet` (Last 24 hours).
    *   Metric: **NDCG@20** (Ranking quality).
5.  **Deployment**:
    *   If `NewModel_NDCG > CurrentModel_NDCG`, push to **Model Registry** tagged `staging`.
    *   **Canary Rollout**: Direct 5% of traffic to new model. Monitor for errors/latency.

### Monitoring & Observability
*   **Operational Metrics**: Latency (p95, p99), Throughput (RPS), Error Rate.
*   **Model Metrics**:
    *   **Drift**: Feature distribution changes (e.g., suddenly everyone searches "Winter Coat").
    *   **Performance**: Real-time CTR per model version.
*   **Alerting**: Slack/PagerDuty if default fallback rate > 10%.

---

## 6. Safety, Explainability & Privacy

### Explainability (XAI)
*   **Why rank this?**: Log Feature Importance (SHAP values) for top 10 results.
*   **Trust Score Audit**: Store breakdown of trust calculation (e.g., "+10 verified ID", "-5 reported") for transparency.

### Privacy & PII
*   **Face Data**: eKYC images are processed *in-memory* for vector generation. Only the *vector hash* is stored; original images are deleted or encrypted in cold storage (Glacier) with strict retention policies (30 days).
*   **Chat Analysis**: Text analysis runs on anonymized streams. No PII is logged in plain text in AI logs.

### Human-in-the-Loop
*   **Flagged Content**: Items with `SafetyScore < 0.4` generated by AI are sent to a **Moderation Queue**.
*   **Override**: Admins can force-boost or ban categories, overriding AI weights immediately (via Feature Store "Global Overrides").

---

## 7. Failure Modes & Fallbacks

| Failure Scenario | Fallback Strategy |
| :--- | :--- |
| **Vector DB Down** | Switch to **Keyword Search** (Elasticsearch) only. |
| **Feature Store Latency > 100ms** | Use **Cached Model Weights** (Generic Popularity) instead of personalized features. |
| **Ranking Service Timeout** | Return **"Trending Globally"** static list (Cached in Redis). |
| **Text Analysis Down** | Allow listing post immediately, flag for **Post-Hoc Batch Review**. |
