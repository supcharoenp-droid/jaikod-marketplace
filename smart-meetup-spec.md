# Smart Meetup & Safe Zone System Specification
**Version:** 1.0
**Role:** Location Product Lead & ML Geospatial Engineer
**Objective:** Secure offline transactions by algorithmically suggesting the safest and most convenient meeting points.

---

## 1. Geospatial Ranking Algorithm (Pseudo-code)

The core engine ranks Potential Points of Interest (POIs) based on a weighted `SuitabilityScore`.

```python
def calculate_meetup_score(poi, buyer_loc, seller_loc):
    # 1. Safety Score (Weight: 50%)
    # Features: Police proximity, Open 24h, Lighting condition (Time-based), Crowd density
    safety_score = 0
    if poi.type == 'police_station': safety_score += 100
    elif poi.type == 'mall': safety_score += 80
    elif poi.type == 'bts_mrt': safety_score += 70
    elif poi.type == 'park': safety_score += 40 (day) / 10 (night)
    
    # CCTV Bonus
    if poi.has_cctv: safety_score *= 1.1 
    
    # 2. Convenience Score (Weight: 30%)
    # Logic: Minimize max travel time for both parties (Fairness)
    eta_buyer = get_traffic_eta(buyer_loc, poi.loc)
    eta_seller = get_traffic_eta(seller_loc, poi.loc)
    avg_eta = (eta_buyer + eta_seller) / 2
    eta_diff = abs(eta_buyer - eta_seller)
    
    # Penalize if one person travels much longer than the other
    convenience_score = 100 - (avg_eta * 1.5) - (eta_diff * 0.5)
    
    # 3. Environment Score (Weight: 20%)
    # Weather, Parking availability
    env_score = poi.parking_rating * 10
    
    # Final Weighted Score
    final_score = (safety_score * 0.5) + (convenience_score * 0.3) + (env_score * 0.2)
    
    return {
        "score": final_score,
        "eta": { "buyer": eta_buyer, "seller": eta_seller },
        "badges": ["Safe Zone"] if safety_score > 80 else []
    }
```

---

## 2. API Contracts

### `POST /meetups/propose`
**Request:**
```json
{
  "chat_id": "c_123",
  "locations": {
    "buyer": { "lat": 13.7563, "lng": 100.5018 },
    "seller": { "lat": 13.7469, "lng": 100.5349 }
  },
  "preferences": {
    "mode": "public_transport", // drive, walk
    "time_window": { "start": "18:00", "end": "20:00" }
  }
}
```

**Response:**
```json
{
  "recommendations": [
    {
      "id": "poi_555",
      "name": "Siam Paragon (Main Hall)",
      "type": "mall",
      "lat": 13.7462, "lng": 100.5347,
      "score": 92,
      "meta": {
        "eta_buyer": "15 min (BTS)",
        "eta_seller": "12 min (Walk)",
        "badges": ["High Safety", "CCTV"]
      }
    },
    {
      "id": "poi_999",
      "name": "Pathum Wan Police Station",
      "type": "police",
      "score": 98,
      "meta": { "badges": ["Maximum Security"] }
    }
  ]
}
```

---

## 3. Privacy & Safety Checklist
- [x] **Fuzzy Location:** Never store or reveal user's exact "Home" address. Only use Lat/Lng for calculation, then discard.
- [x] **Ephemeral Sharing:** Live location sharing is token-based and expires automatically after 1 hour.
- [x] **No-Go Zones:** Hard-coded exclusion of high-crime areas or dark alleys based on crime heatmaps.
- [x] **Consent:** Both parties must explicitly trigger the "Meetup Request".

---

## 4. Map & UI Interaction (Mobile)
- **Heatmap Layer:** Subtle overlay showing "Green" (Safe/Crowded) vs "Red" (Isolated) zones.
- **Midpoint Marker:** Visual "Center of Gravity" between two users.
- **Spot Card:**
  - **Title:** "Central World"
  - **Badges:** 🛡️ Safe Zone | 🎥 CCTV
  - **Travel:** You (15 min) | Seller (20 min)
  - **Action:** [Confirm Time]

---

**Approved by:** Safety Team
**Date:** 2025-12-09
