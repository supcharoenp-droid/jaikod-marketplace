# AI-Enhanced Buyer-Seller Distance System
## ระบบแสดงระยะทางระหว่างผู้ซื้อ-ผู้ขายด้วย AI

---

## 🎯 **ภาพรวมระบบ**

ระบบนี้ใช้ AI เพื่อ:
1. **คำนวณระยะทางอัจฉริยะ** - ระหว่างผู้ซื้อกับผู้ขาย/ร้านค้า
2. **แนะนำจุดนัดพบ** - AI หาจุดกึ่งกลางที่เหมาะสม
3. **ประเมินต้นทุนการเดินทาง** - คำนวณค่าน้ำมัน ค่าโดยสาร
4. **แนะนำเส้นทาง** - เส้นทางที่เร็วที่สุด/ประหยัดที่สุด
5. **ปกป้องความเป็นส่วนตัว** - ไม่เปิดเผยตำแหน่งแน่นอน

---

## 📊 **สถาปัตยกรรมระบบ**

```
┌─────────────────────────────────────────────────────────────┐
│                    ผู้ซื้อ (Buyer)                          │
│  📍 ตำแหน่ง: กรุงเทพฯ (13.7563, 100.5018)                  │
└─────────────────────────────────────────────────────────────┘
                            │
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                  AI Distance Engine                         │
│  • คำนวณระยะทาง (Haversine)                                │
│  • วิเคราะห์การจราจร (Real-time)                           │
│  • หาจุดนัดพบที่เหมาะสม (ML)                               │
│  • ประเมินต้นทุน (AI Estimation)                           │
└─────────────────────────────────────────────────────────────┘
                            │
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                  ผู้ขาย/ร้านค้า (Seller)                   │
│  📍 ตำแหน่ง: นนทบุรี (13.8500, 100.5833)                   │
└─────────────────────────────────────────────────────────────┘
```

---

## 🤖 **AI Features**

### **1. Smart Meeting Point Recommendation**
AI หาจุดนัดพบที่เหมาะสมที่สุด

**ปัจจัยที่พิจารณา:**
- ✅ ระยะทางจากทั้งสองฝ่าย (ควรเท่ากัน)
- ✅ ความสะดวกในการเดินทาง (ใกล้ BTS/MRT)
- ✅ ความปลอดภัย (สถานที่สาธารณะ)
- ✅ ความเป็นส่วนตัว (ไม่เปิดเผยบ้าน)
- ✅ เวลาเปิด-ปิด (ร้านค้า, ห้างสรรพสินค้า)

**ตัวอย่างจุดนัดพบ:**
```typescript
{
    name: "Central Ladprao",
    type: "shopping_mall",
    distance_from_buyer: 3.2,  // km
    distance_from_seller: 3.5, // km
    safety_score: 95,           // 0-100
    convenience_score: 90,      // มี BTS, ที่จอดรถ
    privacy_score: 80,          // สาธารณะแต่ไม่แออัดเกินไป
    ai_recommendation: "แนะนำสูง - ห้างใหญ่ มีที่จอดรถ ปลอดภัย"
}
```

### **2. Travel Cost Estimation**
AI ประเมินต้นทุนการเดินทาง

**สำหรับผู้ซื้อ:**
```typescript
{
    by_car: {
        distance: 8.5,        // km
        fuel_cost: 42.50,     // บาท (5 บาท/km)
        parking_cost: 30,     // บาท
        toll_cost: 0,         // บาท
        total: 72.50,
        time: "15 นาที"
    },
    by_public_transport: {
        bts_fare: 42,         // บาท
        walk_distance: 0.5,   // km
        total: 42,
        time: "25 นาที"
    },
    by_motorcycle_taxi: {
        fare: 60,             // บาท (ประมาณการ)
        time: "12 นาที"
    }
}
```

### **3. Traffic-Aware Routing**
AI วิเคราะห์การจราจรแบบ Real-time

**ข้อมูลที่ใช้:**
- 🚦 ข้อมูลการจราจรปัจจุบัน (Google Maps API)
- 📊 ข้อมูลสถิติการจราจรตามช่วงเวลา
- 🎯 ML Model ทำนายเวลาเดินทาง

**ตัวอย่าง:**
```typescript
{
    current_traffic: "heavy",
    estimated_time: "25 นาที",
    normal_time: "15 นาที",
    delay: "+10 นาที",
    alternative_route: {
        name: "เส้นทางเลี่ยงรามอินทรา",
        time: "18 นาที",
        distance: 10.2,  // km (ไกลกว่า แต่เร็วกว่า)
        savings: "7 นาที"
    }
}
```

### **4. Seller Verification Score**
AI ประเมินความน่าเชื่อถือของผู้ขาย

**ปัจจัยที่พิจารณา:**
- ⭐ คะแนนรีวิว (4.8/5.0)
- 📦 จำนวนสินค้าที่ขายไปแล้ว (127 รายการ)
- ✅ การยืนยันตัวตน (KYC)
- 📍 ตำแหน่งที่ตั้งคงที่ (ร้านค้าจริง vs. บุคคล)
- ⏱️ เวลาตอบกลับเฉลี่ย (< 5 นาที)

**Trust Score:**
```typescript
{
    overall_score: 92,  // 0-100
    badges: [
        "✓ ยืนยันตัวตนแล้ว",
        "✓ ร้านค้าจริง",
        "⭐ ผู้ขายยอดนิยม",
        "🚀 ตอบกลับเร็ว"
    ],
    risk_level: "low",
    ai_comment: "ผู้ขายน่าเชื่อถือ มีประวัติการขายที่ดี"
}
```

### **5. Privacy Protection**
AI ปกป้องความเป็นส่วนตัว

**กลไก:**
- 🔒 ไม่แสดงตำแหน่งแน่นอนจนกว่าจะตกลงซื้อขาย
- 📍 แสดงเฉพาะโซน/เขต (เช่น "บางกะปิ, กรุงเทพฯ")
- 🎭 ใช้ Fuzzy Location (เลื่อนพิกัด ±500m)
- 🤝 เปิดเผยตำแหน่งจริงเมื่อนัดพบแล้ว

**ตัวอย่าง:**
```typescript
// ก่อนตกลงซื้อขาย
{
    display_location: "บางกะปิ, กรุงเทพฯ",
    approximate_distance: "5-10 km",
    exact_location: null  // ซ่อนไว้
}

// หลังตกลงซื้อขาย
{
    display_location: "Central Ladprao",
    exact_location: {
        lat: 13.8143,
        lng: 100.5615,
        address: "ห้างเซ็นทรัล ลาดพร้าว ชั้น 1 หน้า Starbucks"
    }
}
```

---

## 💬 **AI Chat Assistant Integration**

### **สถานการณ์ที่ 1: ผู้ซื้อถามระยะทาง**

**ผู้ซื้อ:** "สินค้าอยู่ไกลจากผมไหมครับ?"

**AI Assistant:**
```
📍 สินค้าอยู่ห่างจากคุณประมาณ 8.5 km (ปานกลาง)

🚗 วิธีการเดินทาง:
• ขับรถ: 15 นาที (ค่าน้ำมัน ~43 บาท)
• BTS: 25 นาที (ค่าโดยสาร 42 บาท)
• Grab: 12 นาที (ค่าโดยสาร ~60 บาท)

💡 คำแนะนำ: ขับรถไปเองจะคุ้มที่สุด และเร็วกว่า BTS

ต้องการให้แนะนำจุดนัดพบกึ่งกลางไหมครับ?
```

### **สถานการณ์ที่ 2: ขอแนะนำจุดนัดพบ**

**ผู้ซื้อ:** "ช่วยแนะนำจุดนัดพบหน่อยครับ"

**AI Assistant:**
```
🎯 AI แนะนำจุดนัดพบ 3 ตัวเลือก:

1. ⭐ Central Ladprao (แนะนำสูงสุด)
   • ห่างจากคุณ: 3.2 km (7 นาที)
   • ห่างจากผู้ขาย: 3.5 km (8 นาที)
   • ความปลอดภัย: 95/100
   • มี BTS, ที่จอดรถ, ร้านอาหาร
   
2. The Mall Bangkapi
   • ห่างจากคุณ: 2.8 km (6 นาที)
   • ห่างจากผู้ขาย: 4.2 km (10 นาที)
   • ความปลอดภัย: 90/100
   
3. Starbucks Ramintra
   • ห่างจากคุณ: 4.1 km (9 นาที)
   • ห่างจากผู้ขาย: 2.9 km (7 นาที)
   • ความปลอดภัย: 85/100

คุณต้องการนัดที่ไหนครับ?
```

### **สถานการณ์ที่ 3: ตรวจสอบความน่าเชื่อถือ**

**ผู้ซื้อ:** "ผู้ขายน่าเชื่อถือไหมครับ?"

**AI Assistant:**
```
✅ ผู้ขายน่าเชื่อถือมาก (Trust Score: 92/100)

📊 ข้อมูลผู้ขาย:
• ⭐ คะแนน: 4.8/5.0 (จาก 89 รีวิว)
• 📦 ขายไปแล้ว: 127 รายการ
• ✓ ยืนยันตัวตนแล้ว (KYC)
• 🏪 ร้านค้าจริง (มีหน้าร้าน)
• ⏱️ ตอบกลับเฉลี่ย: 3 นาที

🎖️ ตรา:
✓ ยืนยันตัวตนแล้ว
✓ ร้านค้าจริง
⭐ ผู้ขายยอดนิยม
🚀 ตอบกลับเร็ว

💬 รีวิวล่าสุด:
"สินค้าตรงปก ผู้ขายใจดี แนะนำเลยครับ" - คุณ A.
"ของดีมาก ส่งไว นัดตรงเวลา" - คุณ B.

คุณสามารถซื้อได้อย่างมั่นใจครับ 👍
```

---

## 🔧 **Technical Implementation**

### **1. Distance Calculation Service**

```typescript
// src/lib/buyer-seller-distance.ts

export interface BuyerSellerDistance {
    distance_km: number;
    travel_time: {
        by_car: string;
        by_public: string;
        by_bike: string;
    };
    cost_estimate: {
        by_car: number;
        by_public: number;
        by_taxi: number;
    };
    traffic_status: 'light' | 'moderate' | 'heavy';
    ai_recommendation: string;
}

export async function calculateBuyerSellerDistance(
    buyerLat: number,
    buyerLng: number,
    sellerLat: number,
    sellerLng: number
): Promise<BuyerSellerDistance> {
    // 1. คำนวณระยะทาง
    const distance = calculateDistance(buyerLat, buyerLng, sellerLat, sellerLng);
    
    // 2. ดึงข้อมูลการจราจร (Google Maps API)
    const traffic = await getTrafficStatus(buyerLat, buyerLng, sellerLat, sellerLng);
    
    // 3. คำนวณเวลาเดินทาง
    const travelTime = calculateTravelTime(distance, traffic);
    
    // 4. ประเมินต้นทุน
    const cost = estimateTravelCost(distance, traffic);
    
    // 5. AI แนะนำ
    const recommendation = generateAIRecommendation(distance, traffic, cost);
    
    return {
        distance_km: distance,
        travel_time: travelTime,
        cost_estimate: cost,
        traffic_status: traffic,
        ai_recommendation: recommendation
    };
}
```

### **2. Meeting Point Finder**

```typescript
// src/lib/meeting-point-finder.ts

export interface MeetingPoint {
    name: string;
    type: 'shopping_mall' | 'cafe' | 'park' | 'station';
    location: { lat: number; lng: number };
    distance_from_buyer: number;
    distance_from_seller: number;
    safety_score: number;
    convenience_score: number;
    ai_score: number;  // Overall AI recommendation score
    amenities: string[];
}

export async function findMeetingPoints(
    buyerLat: number,
    buyerLng: number,
    sellerLat: number,
    sellerLng: number
): Promise<MeetingPoint[]> {
    // 1. หาจุดกึ่งกลาง
    const midpoint = calculateMidpoint(buyerLat, buyerLng, sellerLat, sellerLng);
    
    // 2. ค้นหาสถานที่ใกล้เคียง (Google Places API)
    const places = await searchNearbyPlaces(midpoint.lat, midpoint.lng, 2000); // 2km radius
    
    // 3. AI ให้คะแนนแต่ละสถานที่
    const scoredPlaces = places.map(place => ({
        ...place,
        ai_score: calculateAIScore(place, buyerLat, buyerLng, sellerLat, sellerLng)
    }));
    
    // 4. เรียงตามคะแนน AI
    return scoredPlaces.sort((a, b) => b.ai_score - a.ai_score).slice(0, 5);
}

function calculateAIScore(
    place: any,
    buyerLat: number,
    buyerLng: number,
    sellerLat: number,
    sellerLng: number
): number {
    let score = 0;
    
    // ระยะทางเท่ากัน (40 คะแนน)
    const buyerDist = calculateDistance(buyerLat, buyerLng, place.lat, place.lng);
    const sellerDist = calculateDistance(sellerLat, sellerLng, place.lat, place.lng);
    const distanceDiff = Math.abs(buyerDist - sellerDist);
    score += Math.max(0, 40 - (distanceDiff * 10));
    
    // ความปลอดภัย (30 คะแนน)
    if (place.type === 'shopping_mall') score += 30;
    else if (place.type === 'cafe') score += 20;
    else if (place.type === 'station') score += 15;
    
    // ความสะดวก (30 คะแนน)
    if (place.has_parking) score += 10;
    if (place.near_bts) score += 10;
    if (place.has_restroom) score += 5;
    if (place.has_wifi) score += 5;
    
    return score;
}
```

### **3. Privacy Protection**

```typescript
// src/lib/privacy-protection.ts

export function getFuzzyLocation(
    exactLat: number,
    exactLng: number,
    radiusMeters: number = 500
): { lat: number; lng: number } {
    // เลื่อนพิกัดแบบสุ่มภายในรัศมีที่กำหนด
    const angle = Math.random() * 2 * Math.PI;
    const distance = Math.random() * radiusMeters;
    
    const deltaLat = (distance * Math.cos(angle)) / 111000; // 1 degree ≈ 111km
    const deltaLng = (distance * Math.sin(angle)) / (111000 * Math.cos(exactLat * Math.PI / 180));
    
    return {
        lat: exactLat + deltaLat,
        lng: exactLng + deltaLng
    };
}

export function getLocationDisplayLevel(
    buyerStatus: 'browsing' | 'interested' | 'agreed',
    sellerStatus: 'listed' | 'negotiating' | 'agreed'
): 'zone' | 'district' | 'approximate' | 'exact' {
    if (buyerStatus === 'agreed' && sellerStatus === 'agreed') {
        return 'exact';  // แสดงตำแหน่งจริง
    } else if (buyerStatus === 'interested') {
        return 'approximate';  // แสดงพิกัดคร่าวๆ (±500m)
    } else if (buyerStatus === 'browsing') {
        return 'district';  // แสดงเฉพาะเขต/อำเภอ
    }
    return 'zone';  // แสดงเฉพาะโซน
}
```

---

## 🎨 **UI/UX Design**

### **Product Card with Distance**

```
┌─────────────────────────────────────────┐
│ 📱 iPhone 13 Pro Max 256GB             │
│ ฿32,000                                │
├─────────────────────────────────────────┤
│ 📍 ใกล้ (3-5 km)                       │
│ 🚗 10 นาที | 💰 ~50 บาท               │
│                                         │
│ ✅ ผู้ขายน่าเชื่อถือ (92/100)          │
│ 🏪 ร้าน Mobile Shop                   │
├─────────────────────────────────────────┤
│ [💬 แชท] [📍 ดูแผนที่] [🤝 นัดพบ]    │
└─────────────────────────────────────────┘
```

### **Meeting Point Suggestion Modal**

```
┌─────────────────────────────────────────┐
│ 🎯 AI แนะนำจุดนัดพบ                   │
├─────────────────────────────────────────┤
│ ⭐ Central Ladprao (แนะนำ)             │
│ • คุณ: 3.2 km (7 นาที)                │
│ • ผู้ขาย: 3.5 km (8 นาที)             │
│ • ปลอดภัย มีที่จอดรถ                  │
│ [เลือกที่นี่]                          │
├─────────────────────────────────────────┤
│ The Mall Bangkapi                      │
│ • คุณ: 2.8 km (6 นาที)                │
│ • ผู้ขาย: 4.2 km (10 นาที)            │
│ [เลือกที่นี่]                          │
└─────────────────────────────────────────┘
```

---

## ✅ **สรุป**

**ระบบแสดงระยะทางระหว่างผู้ซื้อ-ผู้ขายด้วย AI มีฟีเจอร์:**

1. ✅ คำนวณระยะทางและเวลาเดินทาง
2. ✅ ประเมินต้นทุนการเดินทาง
3. ✅ แนะนำจุดนัดพบที่เหมาะสม (AI)
4. ✅ วิเคราะห์การจราจรแบบ Real-time
5. ✅ ประเมินความน่าเชื่อถือผู้ขาย (AI)
6. ✅ ปกป้องความเป็นส่วนตัว
7. ✅ AI Chat Assistant ช่วยตอบคำถาม
8. ✅ Admin เปิด-ปิดได้

**พร้อมใช้งานในอนาคต!** 🚀
