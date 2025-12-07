# Category-Specific Features & UI
## การปรับแต่งฟีเจอร์และ UI ตามประเภทสินค้า

---

## 📋 **หลักการออกแบบ**

แต่ละประเภทสินค้ามีลักษณะเฉพาะที่แตกต่างกัน ดังนั้นควรมี:

1. **ฟอร์มกรอกข้อมูลที่แตกต่างกัน** - ถามข้อมูลที่เกี่ยวข้องกับสินค้านั้นๆ
2. **การแสดงผลที่แตกต่างกัน** - เน้นข้อมูลที่สำคัญของแต่ละประเภท
3. **ฟีเจอร์พิเศษเฉพาะประเภท** - เช่น VR Tour สำหรับบ้าน, Size Guide สำหรับเสื้อผ้า
4. **การประเมินราคาที่แตกต่างกัน** - ใช้ปัจจัยที่เหมาะสมกับแต่ละประเภท

---

## 🎯 **สินค้าแต่ละประเภทและฟีเจอร์พิเศษ**

### **1. 🚗 รถยนต์ (Cars)**

#### **ฟอร์มกรอกข้อมูล:**
```typescript
interface CarFormData {
    // พื้นฐาน
    brand: string;              // ยี่ห้อ
    model: string;              // รุ่น
    year: number;               // ปี
    
    // รายละเอียดเฉพาะรถ
    mileage: number;            // เลขไมล์
    transmission: 'manual' | 'automatic' | 'cvt';  // เกียร์
    fuelType: 'gasoline' | 'diesel' | 'hybrid' | 'electric';
    engineSize: number;         // ขนาดเครื่องยนต์ (cc)
    color: string;              // สี
    
    // เอกสารและประวัติ
    registrationProvince: string;  // ทะเบียนจังหวัด
    taxPaid: boolean;           // ภาษีจ่ายแล้ว
    hasServiceHistory: boolean; // มีประวัติการเข้าศูนย์
    accidents: number;          // จำนวนครั้งที่ชน
    
    // สภาพ
    condition: string;
    interiorCondition: string;  // สภาพภายใน
    exteriorCondition: string;  // สภาพภายนอก
}
```

#### **ฟีเจอร์พิเศษ:**
- ✅ **VIN Checker** - ตรวจสอบประวัติรถจากเลขตัวถัง
- ✅ **Mileage Verification** - ยืนยันเลขไมล์จากรูปถ่าย
- ✅ **360° View** - ถ่ายรูปรอบคัน
- ✅ **Test Drive Booking** - นัดชมรถ
- ✅ **Finance Calculator** - คำนวณผ่อน
- ✅ **Insurance Quote** - ประเมินค่าประกัน

#### **การแสดงผล:**
```
┌─────────────────────────────────────┐
│ 🚗 Nissan Almera 2013              │
│ ฿39,580                            │
├─────────────────────────────────────┤
│ 📊 ข้อมูลรถ                        │
│ • เลขไมล์: 300,000 km             │
│ • เกียร์: CVT                      │
│ • เชื้อเพลิง: เบนซิน               │
│ • ทะเบียน: กรุงเทพฯ                │
│ • ภาษี: จ่ายแล้ว ✓                 │
├─────────────────────────────────────┤
│ 📈 Market Insights                 │
│ • เลขไมล์สูงกว่าค่าเฉลี่ย 120k km │
│ • ราคาตลาดคงที่                    │
├─────────────────────────────────────┤
│ [💬 แชท] [📅 นัดชม] [🧮 คำนวณผ่อน]│
└─────────────────────────────────────┘
```

---

### **2. 📱 โทรศัพท์มือถือ (Mobiles)**

#### **ฟอร์มกรอกข้อมูล:**
```typescript
interface MobileFormData {
    brand: string;
    model: string;
    storage: string;            // 64GB, 128GB, 256GB
    ram: string;                // 4GB, 6GB, 8GB
    color: string;
    
    // สภาพเฉพาะโทรศัพท์
    batteryHealth: number;      // 0-100%
    screenCondition: string;    // ไม่มีรอย, รอยเล็กน้อย, แตก
    bodyCondition: string;
    faceIdWorking: boolean;     // Face ID ใช้งานได้
    touchIdWorking: boolean;    // Touch ID ใช้งานได้
    
    // อุปกรณ์
    hasBox: boolean;
    hasCharger: boolean;
    hasCable: boolean;
    hasEarphones: boolean;
    
    // การรับประกัน
    warranty: string;           // หมดแล้ว, ยังเหลือ X เดือน
    purchaseDate: Date;
    originalPrice: number;
}
```

#### **ฟีเจอร์พิเศษ:**
- ✅ **IMEI Checker** - ตรวจสอบ IMEI ว่าหาย/ขโมยหรือไม่
- ✅ **Battery Health Verification** - ถ่ายรูปหน้าจอแสดง Battery Health
- ✅ **Screen Defect Detection** - AI ตรวจจุดด่างดำหน้าจอ
- ✅ **Price History Graph** - กราฟแสดงราคาย้อนหลัง
- ✅ **Trade-in Calculator** - คำนวณราคารับซื้อ
- ✅ **Comparison Tool** - เปรียบเทียบกับรุ่นอื่น

#### **การแสดงผล:**
```
┌─────────────────────────────────────┐
│ 📱 iPhone 13 Pro Max 256GB         │
│ ฿32,038                            │
│ [💚 Battery 88%] [📦 มีกล่อง]      │
├─────────────────────────────────────┤
│ 💎 จุดเด่น                         │
│ ✓ สภาพดีมาก ไม่มีรอยขีดข่วน       │
│ ✓ แบตเตอรี่สุขภาพดี 88%           │
│ ✓ ครบกล่อง อุปกรณ์ครบ              │
├─────────────────────────────────────┤
│ 📊 ราคาเทียบกับตลาด                │
│ [กราฟแสดงราคา 3 เดือนย้อนหลัง]     │
├─────────────────────────────────────┤
│ [💬 แชท] [🔄 Trade-in] [📊 เปรียบเทียบ]│
└─────────────────────────────────────┘
```

---

### **3. 🏠 อสังหาริมทรัพย์ (Real Estate)**

#### **ฟอร์มกรอกข้อมูล:**
```typescript
interface RealEstateFormData {
    type: 'condo' | 'house' | 'townhouse' | 'land';
    
    // ขนาด
    area: number;               // ตารางเมตร
    usableArea: number;         // พื้นที่ใช้สอย
    landArea?: number;          // ที่ดิน (สำหรับบ้าน)
    
    // ห้อง
    bedrooms: number;
    bathrooms: number;
    parkingSpaces: number;
    
    // ที่ตั้ง
    province: string;
    district: string;
    subdistrict: string;
    nearBTS?: boolean;
    nearMRT?: boolean;
    distanceToStation?: number; // เมตร
    
    // อาคาร (สำหรับคอนโด)
    buildingName?: string;
    floor?: number;
    totalFloors?: number;
    facing?: string;            // ทิศ
    
    // สิ่งอำนวยความสะดวก
    facilities: string[];       // สระว่ายน้ำ, ฟิตเนส, etc.
    
    // ราคาและค่าใช้จ่าย
    price: number;
    commonFee?: number;         // ค่าส่วนกลาง/เดือน
    transferFee: 'seller' | 'buyer' | 'split';
}
```

#### **ฟีเจอร์พิเศษ:**
- ✅ **360° Virtual Tour** - ชมบ้านแบบ 360 องศา
- ✅ **Floor Plan Viewer** - ดูแปลนห้อง
- ✅ **Location Map** - แผนที่แสดงสถานที่ใกล้เคียง
- ✅ **Mortgage Calculator** - คำนวณสินเชื่อบ้าน
- ✅ **ROI Calculator** - คำนวณผลตอบแทนการลงทุน
- ✅ **Nearby Amenities** - แสดงร้านค้า โรงเรียน โรงพยาบาลใกล้เคียง
- ✅ **Price per Sqm** - แสดงราคาต่อตารางเมตร

#### **การแสดงผล:**
```
┌─────────────────────────────────────┐
│ 🏠 คอนโด The Loft Asoke            │
│ ฿4,500,000 (฿90,000/ตร.ม.)        │
│ [🎥 Virtual Tour] [📐 Floor Plan]  │
├─────────────────────────────────────┤
│ 📏 ขนาด                            │
│ • พื้นที่: 50 ตร.ม.                │
│ • 1 ห้องนอน 1 ห้องน้ำ              │
│ • ชั้น 15/30                       │
├─────────────────────────────────────┤
│ 📍 ทำเล                            │
│ • ใกล้ BTS อโศก 200 ม.             │
│ • ใกล้ MRT สุขุมวิท 300 ม.         │
│ [🗺️ ดูแผนที่]                      │
├─────────────────────────────────────┤
│ 💰 ค่าใช้จ่าย                      │
│ • ค่าส่วนกลาง: ฿2,500/เดือน        │
│ • ค่าโอน: ผู้ซื้อ-ผู้ขายจ่ายคนละครึ่ง│
│ [🧮 คำนวณผ่อน]                     │
└─────────────────────────────────────┘
```

---

### **4. 👕 เสื้อผ้าและแฟชั่น (Fashion)**

#### **ฟอร์มกรอกข้อมูล:**
```typescript
interface FashionFormData {
    category: 'shirt' | 'pants' | 'dress' | 'shoes' | 'bag';
    brand: string;
    
    // ขนาด
    size: string;               // S, M, L, XL
    measurements?: {            // ขนาดเฉพาะ (cm)
        chest?: number;
        waist?: number;
        hips?: number;
        length?: number;
    };
    
    // รายละเอียด
    color: string;
    material: string;           // ผ้า, หนัง, etc.
    season?: string;            // ฤดูกาล
    
    // สภาพ
    condition: string;
    timesWorn: number;          // ใส่ไปกี่ครั้ง
    hasDefects: boolean;
    defectDescription?: string;
    
    // ของแท้
    isAuthentic: boolean;
    hasCertificate: boolean;
    hasReceipt: boolean;
}
```

#### **ฟีเจอร์พิเศษ:**
- ✅ **Size Guide** - คู่มือเลือกไซส์
- ✅ **Virtual Try-On** - ลองใส่เสื้อผ้าด้วย AR
- ✅ **Authenticity Check** - ตรวจสอบของแท้
- ✅ **Style Matching** - แนะนำเสื้อผ้าที่เข้ากัน
- ✅ **Color Accuracy** - แสดงสีที่แม่นยำ
- ✅ **Care Instructions** - วิธีดูแลรักษา

#### **การแสดงผล:**
```
┌─────────────────────────────────────┐
│ 👕 Supreme Box Logo Hoodie         │
│ ฿8,500                             │
│ [✓ ของแท้] [📏 Size Guide]         │
├─────────────────────────────────────┤
│ 📐 ขนาด                            │
│ • Size: L                          │
│ • อก: 56 cm                        │
│ • ยาว: 72 cm                       │
│ [👤 ลองใส่ด้วย AR]                 │
├─────────────────────────────────────┤
│ 🎨 สี & วัสดุ                      │
│ • สี: Black                        │
│ • วัสดุ: Cotton 100%               │
│ [🎨 ดูสีจริง]                      │
├─────────────────────────────────────┤
│ ✨ สภาพ                            │
│ • ใส่ไป 3 ครั้ง                    │
│ • สภาพดีมาก ไม่มีตำหนิ             │
│ • มีใบเสร็จและกล่อง                │
└─────────────────────────────────────┘
```

---

### **5. 🐕 สัตว์เลี้ยง (Pets)**

#### **ฟอร์มกรอกข้อมูล:**
```typescript
interface PetFormData {
    type: 'dog' | 'cat' | 'bird' | 'fish' | 'other';
    breed: string;              // สายพันธุ์
    
    // ข้อมูลพื้นฐาน
    age: number;                // เดือน
    gender: 'male' | 'female';
    color: string;
    weight: number;             // kg
    
    // สุขภาพ
    vaccinated: boolean;        // ฉีดวัคซีนแล้ว
    vaccineHistory: string[];
    neutered: boolean;          // ทำหมัน
    microchipped: boolean;      // ฝังไมโครชิป
    healthIssues?: string[];
    
    // เอกสาร
    hasPedigree: boolean;       // มีใบเพ็ดดิกรี
    hasVetRecord: boolean;      // มีประวัติสัตวแพทย์
    
    // นิสัย
    temperament: string[];      // ขี้เล่น, เชื่อง, etc.
    trainedCommands?: string[]; // คำสั่งที่ฝึกแล้ว
}
```

#### **ฟีเจอร์พิเศษ:**
- ✅ **Health Certificate Viewer** - ดูใบรับรองสุขภาพ
- ✅ **Vaccination Timeline** - ตารางวัคซีน
- ✅ **Breed Information** - ข้อมูลสายพันธุ์
- ✅ **Care Guide** - คู่มือการดูแล
- ✅ **Video Introduction** - วิดีโอแนะนำตัว
- ✅ **Meet & Greet Booking** - นัดพบสัตว์เลี้ยง

#### **การแสดงผล:**
```
┌─────────────────────────────────────┐
│ 🐕 Golden Retriever                │
│ ฿15,000                            │
│ [✓ ฉีดวัคซีน] [✓ ทำหมัน] [📹 วิดีโอ]│
├─────────────────────────────────────┤
│ 📊 ข้อมูล                          │
│ • อายุ: 6 เดือน                    │
│ • เพศ: ตัวผู้                      │
│ • น้ำหนัก: 15 kg                   │
│ • มีไมโครชิป ✓                    │
├─────────────────────────────────────┤
│ 💉 สุขภาพ                          │
│ • ฉีดวัคซีนครบ (DHPP, Rabies)     │
│ • ทำหมันแล้ว                       │
│ • สุขภาพแข็งแรง ไม่มีโรคประจำตัว   │
│ [📋 ดูประวัติสัตวแพทย์]            │
├─────────────────────────────────────┤
│ 🎭 นิสัย                           │
│ • ขี้เล่น เชื่อง รักเด็ก           │
│ • ฝึกนั่ง นอน มาแล้ว               │
│ [📹 ดูวิดีโอ]                      │
└─────────────────────────────────────┘
```

---

## 🎨 **สรุป: ความแตกต่างของแต่ละประเภท**

| ประเภท | ฟอร์มพิเศษ | ฟีเจอร์เด่น | การแสดงผล |
|--------|-----------|------------|-----------|
| **รถยนต์** | เลขไมล์, เกียร์, ทะเบียน | VIN Check, 360° View, Finance Calc | เน้นเลขไมล์และประวัติ |
| **โทรศัพท์** | Battery Health, IMEI | IMEI Check, Price History | เน้น Battery และสภาพหน้าจอ |
| **บ้าน** | ขนาด, ทำเล, ชั้น | Virtual Tour, Mortgage Calc | เน้นทำเลและราคา/ตร.ม. |
| **เสื้อผ้า** | ไซส์, วัสดุ, ของแท้ | AR Try-On, Size Guide | เน้นไซส์และของแท้ |
| **สัตว์เลี้ยง** | วัคซีน, สายพันธุ์, นิสัย | Health Cert, Video Intro | เน้นสุขภาพและนิสัย |

---

## 💻 **การ Implement ในโค้ด**

### **1. Category-Specific Form Components**

```typescript
// src/components/sell/CategoryForms.tsx

export function CarForm({ onSubmit }: FormProps) {
    return (
        <form>
            <Input label="เลขไมล์" type="number" />
            <Select label="เกียร์" options={['manual', 'automatic', 'cvt']} />
            <Input label="ทะเบียน" />
            {/* ... */}
        </form>
    );
}

export function MobileForm({ onSubmit }: FormProps) {
    return (
        <form>
            <Input label="Battery Health (%)" type="number" max={100} />
            <Input label="IMEI" />
            <Checkbox label="มีกล่อง" />
            {/* ... */}
        </form>
    );
}

// Dynamic Form Selector
export function CategoryForm({ category, onSubmit }: Props) {
    switch (category) {
        case 'cars':
            return <CarForm onSubmit={onSubmit} />;
        case 'mobiles':
            return <MobileForm onSubmit={onSubmit} />;
        case 'real-estate':
            return <RealEstateForm onSubmit={onSubmit} />;
        // ...
        default:
            return <GenericForm onSubmit={onSubmit} />;
    }
}
```

### **2. Category-Specific Display Components**

```typescript
// src/components/product/CategoryDisplay.tsx

export function CarDisplay({ product }: Props) {
    return (
        <div>
            <MileageIndicator mileage={product.mileage} />
            <TransmissionBadge type={product.transmission} />
            <FinanceCalculator price={product.price} />
        </div>
    );
}

export function MobileDisplay({ product }: Props) {
    return (
        <div>
            <BatteryHealthBar health={product.batteryHealth} />
            <PriceHistoryGraph model={product.model} />
            <TradeInCalculator product={product} />
        </div>
    );
}
```

### **3. Category-Specific Pricing Logic**

```typescript
// src/lib/pricing/category-pricing.ts

export async function estimatePrice(
    category: string,
    productData: any
): Promise<PriceEstimation> {
    switch (category) {
        case 'cars':
            return estimateCarPrice(productData);
        case 'mobiles':
            return estimateMobilePrice(productData);
        case 'real-estate':
            return estimateRealEstatePrice(productData);
        default:
            return estimateGenericPrice(productData);
    }
}
```

---

## ✅ **ข้อดีของการแยกตามประเภท**

1. **UX ดีขึ้น** - ผู้ใช้เห็นข้อมูลที่เกี่ยวข้องเท่านั้น
2. **ข้อมูลครบถ้วน** - ถามข้อมูลที่สำคัญสำหรับสินค้านั้นๆ
3. **ราคาแม่นยำขึ้น** - ใช้ปัจจัยที่เหมาะสม
4. **ฟีเจอร์เฉพาะทาง** - มีเครื่องมือที่ช่วยเหลือเฉพาะสินค้า
5. **SEO ดีขึ้น** - ข้อมูลละเอียดช่วยการค้นหา

---

**สรุป: ใช่ครับ ควรแยกตามประเภทสินค้าเพื่อประสบการณ์ที่ดีที่สุด!** 🚀
