# JaiKod Time + Distance Intelligence System

## 🕐 ระบบแสดงเวลา (Time Display Rules)

### **เกณฑ์การแสดงเวลา:**

| ช่วงเวลา | การแสดงผล (TH) | การแสดงผล (EN) |
|----------|----------------|----------------|
| 0-59 วินาที | เมื่อสักครู่ | Just now |
| 1-59 นาที | X นาทีที่แล้ว | X min ago |
| 1-23 ชั่วโมง | X ชั่วโมงที่แล้ว | X hr ago |
| 1 วัน | เมื่อวาน | Yesterday |
| 2-6 วัน | X วันที่แล้ว | X days ago |
| 7-29 วัน | X สัปดาห์ที่แล้ว | X weeks ago |
| 30+ วัน | X เดือนที่แล้ว | X months ago |

### **Auto-Update Intervals:**
- < 1 นาที: Update ทุก 30 วินาที
- < 1 ชั่วโมง: Update ทุก 60 วินาที  
- < 24 ชั่วโมง: Update ทุก 5 นาที
- > 24 ชั่วโมง: Update ทุก 30 นาที

---

## 👁️ ระบบแสดงยอดเข้าชม (Views Display Rules)

### **เกณฑ์การแสดง Views:**

| ยอดวันนี้ | การแสดงผล |
|-----------|-----------|
| 0-4 คน | ❌ ไม่แสดง (น้อยเกินไป) |
| 5-99 คน | ✅ "มีคนดู X คน" |
| 100-999 คน | ✅ "มีคนดู XXX+ คน" 🔥 |
| 1000+ คน | ✅ "มีคนดู X.Xk คน" 🔥🔥 |

### **การแสดงบน Card:**
```
┌─────────────────────────────┐
│ 🕐 5 นาทีที่แล้ว · 👁️ 24 คน │  ← Combined display
└─────────────────────────────┘
```

---

## 📍 ระบบคำนวณระยะทาง (Distance Intelligence)

### **หลักการ:**
1. **ปักหมุด (GPS Pin)** → ใช้พิกัดจริง (แม่นยำ 100%)
2. **เลือกเฉพาะอำเภอ** → ใช้พิกัดกลางอำเภอ (แม่นยำ ~80%)
3. **เลือกเฉพาะจังหวัด** → ใช้พิกัดกลางจังหวัด (แม่นยำ ~60%)

### **ตาราง District Centroids (ตัวอย่าง):**

| Province | District | Latitude | Longitude |
|----------|----------|----------|-----------|
| กรุงเทพฯ | เขตบางรัก | 13.7271 | 100.5275 |
| กรุงเทพฯ | เขตสาทร | 13.7150 | 100.5280 |
| เชียงราย | เชียงแสน | 20.2750 | 100.0833 |
| เชียงราย | แม่สาย | 20.4292 | 99.8826 |
| ชัยนาท | เมืองชัยนาท | 15.1856 | 100.1256 |

### **การแสดงระยะทางบน Card:**

| ระยะทาง | การแสดงผล | สี |
|---------|-----------|-----|
| 0-10 กม. | "ใกล้คุณ X กม." | 🟢 Green |
| 11-50 กม. | "X กม." | 🔵 Blue |
| 51-200 กม. | "X กม." | 🟡 Yellow |
| 201-500 กม. | "X กม." | 🟠 Orange |
| 500+ กม. | "X กม." | ⚫ Gray |

### **Fallback Logic:**

```
IF listing has GPS coordinates:
    distance = haversine(user_location, listing_gps)
    accuracy = "exact"
ELSE IF listing has district:
    district_center = getDistrictCentroid(district_id)
    distance = haversine(user_location, district_center)
    accuracy = "approximate"
    show_indicator = "~" (เช่น "~50 กม.")
ELSE IF listing has province:
    province_center = getProvinceCentroid(province_id)
    distance = haversine(user_location, province_center)
    accuracy = "rough"
    show_indicator = "~" (เช่น "~100 กม.")
ELSE:
    show = "ไม่ทราบที่ตั้ง"
```

---

## 🎨 UI Design for Product Card

### **Current Layout Issues:**
- ไม่มี consistency ในการแสดง views
- ระยะทางบางทีแสดง บางทีไม่แสดง
- ไม่มี visual indicator ว่าเวลายังใหม่หรือเก่า

### **Proposed New Layout:**

```
┌────────────────────────────────────────┐
│ [NEW] 🔥                   👁️ 24  ❤️ │  ← Header badges
│                                        │
│        [   PRODUCT IMAGE   ]          │
│                                        │
│  📍 ~50 กม.                     +5    │  ← Distance badge (bottom left of image)
└────────────────────────────────────────┘
│ Honda Jazz 2562 AT - มือเดียว         │
│ ฿320,000                              │
│ 📍 เมืองชัยนาท, ชัยนาท                │
│ 🕐 5 นาทีที่แล้ว · 👁️ มีคนดู 8 คน    │  ← Combined time + views
└────────────────────────────────────────┘
```

### **Color Coding for Freshness:**
- 🟢 **very_fresh** (< 1 day): Green text, pulse animation option
- 🟡 **fresh** (1-3 days): Yellow/Gold text
- 🔵 **moderate** (3-7 days): Blue text
- ⚫ **old** (7+ days): Gray text

---

## 📊 Data Requirements

### **Listing Document Structure:**
```typescript
interface ListingLocation {
    // GPS coordinates (if pinned)
    coordinates?: {
        lat: number
        lng: number
    }
    
    // Address components
    province_id: number
    province_name: string
    district_id?: number
    district_name?: string
    subdistrict_id?: number
    subdistrict_name?: string
    
    // For distance calculation fallback
    centroid?: {
        lat: number
        lng: number
        accuracy: 'exact' | 'district' | 'province'
    }
}
```

### **District Centroids Database:**
- Source: Thailand Government Open Data
- 77 provinces, ~900 districts
- Store in Firestore: `/geo/districts/{district_id}`
- Cache locally for performance

---

## 🚀 Implementation Priority

1. **Phase 1: Fix Views Display** (Today)
   - Show views consistently on all cards
   - Threshold: Show if views >= 5

2. **Phase 2: Distance Calculation Enhancement** (Today)
   - Create district centroids database
   - Implement fallback logic
   - Add "~" indicator for approximate distances

3. **Phase 3: Time Display Polish** (Today)
   - Ensure auto-update works on all pages
   - Add freshness color coding

4. **Phase 4: UI Consistency** (Tomorrow)
   - Standardize card layout
   - Add proper icons and spacing
