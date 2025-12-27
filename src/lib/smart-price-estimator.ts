/**
 * SMART PRICE ESTIMATOR
 * 
 * ระบบประเมินราคาอัจฉริยะตามสภาพและ specs
 * ไม่ auto-fill ราคา แต่แสดงคำแนะนำให้ผู้ขาย
 * 
 * @version 1.0.0
 */

import { CATEGORIES } from '@/constants/categories'

// ============================================
// TYPES & INTERFACES
// ============================================

export interface PriceEstimation {
    minPrice: number
    maxPrice: number
    avgPrice: number
    quickSellPrice: number  // ขายเร็ว (ต่ำกว่าตลาด 15%)
    maxProfitPrice: number  // กำไรสูง (สูงกว่าตลาด 10%)
    confidence: number      // 0-100%
    factors: PriceFactor[]  // ปัจจัยที่ส่งผลต่อราคา
    insights: string[]      // เหตุผล/คำแนะนำ
}

export interface PriceFactor {
    name_th: string
    name_en: string
    impact: 'positive' | 'negative' | 'neutral'
    percentage: number  // +10% or -5%
    icon: string
}

export interface EstimationInput {
    categoryId: number
    subcategoryId?: number
    condition: string
    specs?: Record<string, string>
    // ✅ NEW: Category-specific form data for detailed pricing
    formData?: Record<string, string | string[]>
    imageQualityScore?: number
    hasMultipleImages?: boolean
    language?: 'th' | 'en'
}

// ============================================
// BASE PRICE RANGES BY CATEGORY
// ⚠️ MUST MATCH src/constants/categories.ts!
// ============================================

const CATEGORY_BASE_PRICES: Record<number, { min: number; max: number; avg: number }> = {
    // CORRECT CATEGORY IDs from constants/categories.ts:
    1: { min: 50000, max: 3000000, avg: 450000 },  // ยานยนต์ (Automotive) ✅
    2: { min: 500000, max: 50000000, avg: 5000000 }, // อสังหาริมทรัพย์ (Real Estate)
    3: { min: 1000, max: 60000, avg: 15000 },      // มือถือและแท็บเล็ต (Mobiles)
    4: { min: 1000, max: 150000, avg: 20000 },     // คอมพิวเตอร์ (Computers)
    5: { min: 500, max: 80000, avg: 8000 },        // เครื่องใช้ไฟฟ้า (Appliances)
    6: { min: 200, max: 50000, avg: 3000 },        // แฟชั่น (Fashion)
    7: { min: 500, max: 50000, avg: 5000 },        // เกมและแก็ดเจ็ต (Gaming)
    8: { min: 1000, max: 200000, avg: 15000 },     // กล้องถ่ายรูป (Cameras)
    9: { min: 500, max: 1000000, avg: 50000 },     // พระเครื่อง (Amulets)
    10: { min: 100, max: 50000, avg: 5000 },       // สัตว์เลี้ยง (Pets)
    11: { min: 100, max: 10000, avg: 1000 },       // บริการ (Services)
    12: { min: 200, max: 30000, avg: 3000 },       // กีฬาและท่องเที่ยว (Sports)
    13: { min: 500, max: 100000, avg: 10000 },     // บ้านและสวน (Home & Garden)
    14: { min: 100, max: 10000, avg: 1500 },       // เครื่องสำอาง (Beauty)
    15: { min: 50, max: 15000, avg: 1500 },        // เด็กและทารก (Baby & Kids)
    16: { min: 50, max: 5000, avg: 300 },          // หนังสือ (Books)
    99: { min: 50, max: 10000, avg: 1000 },        // เบ็ดเตล็ด (Others)
}

// ============================================
// SUBCATEGORY-SPECIFIC PRICES (More Accurate!)
// ⚠️ Subcategory IDs from constants/categories.ts
// ============================================

const SUBCATEGORY_BASE_PRICES: Record<number, { min: number; max: number; avg: number }> = {
    // === Category 1: ยานยนต์ (Automotive) ===
    101: { min: 150000, max: 3000000, avg: 500000 },  // รถยนต์มือสอง
    102: { min: 8000, max: 300000, avg: 35000 },      // มอเตอร์ไซค์ (ปรับให้เหมาะกับ Wave/Click ราคา 25-40k)
    103: { min: 100, max: 50000, avg: 2000 },         // อะไหล่รถยนต์
    104: { min: 100, max: 20000, avg: 1000 },         // อะไหล่มอเตอร์ไซค์
    105: { min: 300000, max: 5000000, avg: 800000 },  // รถบรรทุก
    106: { min: 500, max: 30000, avg: 5000 },         // ล้อและยาง
    107: { min: 200000, max: 2000000, avg: 450000 },  // รถกระบะ
    108: { min: 100000, max: 1000000, avg: 300000 },  // รถตู้
    109: { min: 100, max: 10000, avg: 1000 },         // อุปกรณ์บำรุงรักษารถ


    // === Category 3: มือถือและแท็บเล็ต ===
    301: { min: 3000, max: 70000, avg: 20000 },   // โทรศัพท์มือถือ
    302: { min: 3000, max: 50000, avg: 12000 },   // แท็บเล็ต
    303: { min: 500, max: 15000, avg: 3000 },     // Wearables
    304: { min: 100, max: 5000, avg: 500 },       // อุปกรณ์เสริมมือถือ
    305: { min: 50, max: 5000, avg: 300 },        // อะไหล่มือถือ
    306: { min: 50, max: 1500, avg: 200 },        // ฟิล์ม/เคส
    307: { min: 200, max: 5000, avg: 800 },       // แบตสำรอง

    // === Category 4: คอมพิวเตอร์ ===
    401: { min: 10000, max: 80000, avg: 25000 },  // โน้ตบุ๊ค
    402: { min: 15000, max: 150000, avg: 40000 }, // คอมพิวเตอร์ตั้งโต๊ะ
    403: { min: 3000, max: 30000, avg: 8000 },    // จอคอมพิวเตอร์
    404: { min: 200, max: 10000, avg: 1500 },     // อุปกรณ์เสริม (Peripherals)
    405: { min: 1000, max: 30000, avg: 5000 },    // ปริ้นเตอร์/อุปกรณ์สำนักงาน
    406: { min: 500, max: 50000, avg: 5000 },     // Components
    407: { min: 20000, max: 200000, avg: 60000 }, // Gaming PC
    408: { min: 300, max: 15000, avg: 2000 },     // คีย์บอร์ด
    409: { min: 200, max: 5000, avg: 800 },       // เมาส์
    410: { min: 500, max: 100000, avg: 10000 },   // PC Parts (RAM/GPU/PSU/MB)

    // === Category 5: เครื่องใช้ไฟฟ้า ===
    501: { min: 5000, max: 50000, avg: 15000 },   // แอร์
    502: { min: 5000, max: 30000, avg: 12000 },   // ตู้เย็น
    503: { min: 3000, max: 25000, avg: 10000 },   // เครื่องซักผ้า
    504: { min: 5000, max: 80000, avg: 20000 },   // ทีวีและเครื่องเสียง
    505: { min: 500, max: 20000, avg: 3000 },     // เครื่องใช้ไฟฟ้าในครัว
    506: { min: 1500, max: 15000, avg: 5000 },    // เครื่องทำน้ำอุ่น
    507: { min: 1000, max: 50000, avg: 8000 },    // เครื่องดูดฝุ่น
    508: { min: 300, max: 5000, avg: 1000 },      // พัดลม
    509: { min: 2000, max: 50000, avg: 10000 },   // เครื่องฟอกอากาศ
    510: { min: 300, max: 5000, avg: 1500 },      // เครื่องรีดผ้า
    511: { min: 1000, max: 15000, avg: 4000 },    // เครื่องทำน้ำดื่ม

    // === Category 6: แฟชั่น ===
    601: { min: 100, max: 10000, avg: 800 },      // เสื้อผ้าผู้ชาย
    602: { min: 100, max: 15000, avg: 1000 },     // เสื้อผ้าผู้หญิง
    603: { min: 5000, max: 200000, avg: 25000 },  // กระเป๋าแบรนด์เนม
    604: { min: 500, max: 30000, avg: 3000 },     // รองเท้า/Sneakers
    605: { min: 2000, max: 500000, avg: 25000 },  // นาฬิกาข้อมือ
    606: { min: 500, max: 100000, avg: 5000 },    // เครื่องประดับ
    607: { min: 100, max: 5000, avg: 500 },       // แฟชั่นอุปกรณ์เสริม
    608: { min: 100, max: 3000, avg: 300 },       // เสื้อผ้าเด็ก

    // === Category 7: เกม ===
    701: { min: 5000, max: 25000, avg: 12000 },   // เครื่องเกมคอนโซล
    702: { min: 500, max: 3000, avg: 1000 },      // แผ่นเกม
    703: { min: 500, max: 15000, avg: 2500 },     // เกมมิ่งเกียร์
    704: { min: 500, max: 10000, avg: 2000 },     // หูฟังเกมมิ่ง
    705: { min: 1000, max: 20000, avg: 3000 },    // คีย์บอร์ดเกมมิ่ง
    706: { min: 2000, max: 100000, avg: 15000 },  // โดรน
    707: { min: 5000, max: 50000, avg: 15000 },   // VR Headset

    // === Category 8: กล้องถ่ายรูป ===
    801: { min: 5000, max: 150000, avg: 25000 },  // กล้องดิจิตอล
    802: { min: 3000, max: 100000, avg: 15000 },  // กล้องฟิล์ม
    803: { min: 3000, max: 200000, avg: 20000 },  // เลนส์
    804: { min: 500, max: 50000, avg: 5000 },     // อุปกรณ์สตูดิโอ

    // === Category 9: พระเครื่องและของสะสม ===
    901: { min: 100, max: 5000000, avg: 10000 },  // พระเครื่อง (wide range!)
    902: { min: 50, max: 500000, avg: 5000 },     // เหรียญกษาปณ์
    903: { min: 100, max: 100000, avg: 2000 },    // ธนบัตรเก่า
    904: { min: 500, max: 1000000, avg: 15000 },  // ของเก่า/โบราณ
    905: { min: 500, max: 50000, avg: 3000 },     // Art Toy / กล่องสุ่ม

    // === Category 10: สัตว์เลี้ยง ===
    1001: { min: 1000, max: 200000, avg: 15000 }, // สุนัข
    1002: { min: 500, max: 100000, avg: 8000 },   // แมว
    1003: { min: 100, max: 50000, avg: 2000 },    // สัตว์เลี้ยงอื่นๆ
    1004: { min: 50, max: 10000, avg: 500 },      // อุปกรณ์สัตว์เลี้ยง
    1005: { min: 50, max: 3000, avg: 300 },       // อาหารสัตว์

    // === Category 11: บริการ (ราคาค่าบริการ) ===
    1101: { min: 500, max: 50000, avg: 3000 },    // บริการช่าง
    1102: { min: 500, max: 20000, avg: 3000 },    // บริการขนย้าย
    1103: { min: 200, max: 5000, avg: 800 },      // แม่บ้าน
    1104: { min: 200, max: 10000, avg: 1000 },    // รับจ้างทั่วไป
    1105: { min: 200, max: 5000, avg: 500 },      // ติวเตอร์ (ต่อชั่วโมง)

    // === Category 12: กีฬาและท่องเที่ยว ===
    1201: { min: 2000, max: 200000, avg: 15000 }, // จักรยาน
    1202: { min: 1000, max: 100000, avg: 10000 }, // เครื่องออกกำลังกาย
    1203: { min: 100, max: 20000, avg: 2000 },    // อุปกรณ์แคมป์ปิ้ง
    1204: { min: 100, max: 30000, avg: 2000 },    // อุปกรณ์กีฬา
    1205: { min: 500, max: 50000, avg: 3000 },    // บัตรท่องเที่ยว
    1206: { min: 500, max: 15000, avg: 2000 },    // สเก็ต/โรลเลอร์

    // === Category 13: บ้านและสวน ===
    1301: { min: 500, max: 100000, avg: 8000 },   // เฟอร์นิเจอร์
    1302: { min: 50, max: 10000, avg: 800 },      // ของตกแต่งบ้าน
    1303: { min: 50, max: 5000, avg: 300 },       // ต้นไม้/ทำสวน
    1304: { min: 100, max: 20000, avg: 1500 },    // เครื่องมือช่าง
    1305: { min: 100, max: 30000, avg: 2000 },    // อุปกรณ์สวน

    // === Category 14: ความงาม ===
    1401: { min: 100, max: 10000, avg: 1000 },    // เครื่องสำอาง
    1402: { min: 200, max: 20000, avg: 1500 },    // ผลิตภัณฑ์ดูแลผิว
    1403: { min: 100, max: 5000, avg: 500 },      // ผลิตภัณฑ์ดูแลผม
    1404: { min: 500, max: 50000, avg: 3000 },    // น้ำหอม
    1405: { min: 100, max: 5000, avg: 500 },      // บำรุงร่างกาย
    1406: { min: 100, max: 10000, avg: 1000 },    // อุปกรณ์ความงาม

    // === Category 15: เด็กและทารก ===
    1501: { min: 50, max: 3000, avg: 300 },       // เสื้อผ้าเด็ก
    1502: { min: 100, max: 3000, avg: 400 },      // รองเท้าเด็ก
    1503: { min: 50, max: 10000, avg: 500 },      // ของเล่นเด็ก
    1504: { min: 500, max: 30000, avg: 5000 },    // อุปกรณ์เด็กอ่อน (รถเข็น ฯลฯ)
    1505: { min: 50, max: 2000, avg: 200 },       // ผลิตภัณฑ์ดูแลเด็ก
    1506: { min: 500, max: 20000, avg: 3000 },    // เฟอร์นิเจอร์เด็ก
}

// ============================================
// CAR BRAND VALUE MULTIPLIERS
// ============================================

const CAR_BRAND_MULTIPLIERS: Record<string, number> = {
    // Premium/Luxury (+20-50%)
    'mercedes': 1.40,
    'mercedes-benz': 1.40,
    'bmw': 1.35,
    'audi': 1.30,
    'lexus': 1.35,
    'porsche': 1.50,
    'volvo': 1.20,
    'land rover': 1.25,

    // Japanese Mainstream (baseline)
    'toyota': 1.05,      // Best resale value
    'honda': 1.00,       // Baseline
    'mazda': 0.95,
    'nissan': 0.92,
    'mitsubishi': 0.90,
    'suzuki': 0.88,
    'subaru': 0.95,
    'isuzu': 1.00,       // Popular for pickups

    // Korean (-5-10%)
    'hyundai': 0.90,
    'kia': 0.88,
    'mg': 0.85,

    // Chinese (-15-20%)
    'byd': 0.85,
    'great wall': 0.80,
    'changan': 0.80,
    'haval': 0.82,

    // Others
    'ford': 0.88,
    'chevrolet': 0.85,
}


// ============================================
// CONDITION MULTIPLIERS (General)
// ⚠️ MUST include ALL condition values from ALL category-condition-options.ts!
// ============================================

const GENERAL_CONDITION_MULTIPLIERS: Record<string, { multiplier: number; label_th: string; label_en: string }> = {
    // ========== STANDARD CONDITIONS ==========
    'new': { multiplier: 1.00, label_th: 'ใหม่', label_en: 'New' },
    'like_new': { multiplier: 0.85, label_th: 'เหมือนใหม่', label_en: 'Like New' },
    'good': { multiplier: 0.70, label_th: 'สภาพดี', label_en: 'Good' },
    'fair': { multiplier: 0.50, label_th: 'ใช้งานได้', label_en: 'Fair' },
    'used': { multiplier: 0.40, label_th: 'มือสอง', label_en: 'Used' },
    'poor': { multiplier: 0.10, label_th: 'ซาก/อะไหล่', label_en: 'For Parts' },

    // ========== ELECTRONICS (Mobile/Computer) ==========
    'new_sealed': { multiplier: 1.00, label_th: 'ใหม่แกะกล่อง', label_en: 'New Sealed' },
    'new_opened': { multiplier: 0.95, label_th: 'ใหม่ แกะแล้ว', label_en: 'New Opened' },
    'refurbished': { multiplier: 0.60, label_th: 'Refurbished', label_en: 'Refurbished' },
    'needs_repair': { multiplier: 0.15, label_th: 'ต้องซ่อม', label_en: 'Needs Repair' },
    'cracked_screen': { multiplier: 0.25, label_th: 'หน้าจอแตก', label_en: 'Cracked Screen' },
    'parts_only': { multiplier: 0.10, label_th: 'ขายอะไหล่', label_en: 'Parts Only' },

    // ========== APPLIANCES ==========
    'new_box': { multiplier: 1.00, label_th: 'ใหม่แกะกล่อง', label_en: 'New in Box' },
    'working': { multiplier: 0.65, label_th: 'ใช้งานได้ปกติ', label_en: 'Working' },
    'needs_maintenance': { multiplier: 0.45, label_th: 'ต้องบำรุงรักษา', label_en: 'Needs Maintenance' },
    'not_working': { multiplier: 0.10, label_th: 'เสีย/ไม่ทำงาน', label_en: 'Not Working' },

    // ========== FASHION ==========
    'new_tag': { multiplier: 1.00, label_th: 'ใหม่ ยังไม่แกะป้าย', label_en: 'New with Tags' },
    'new_no_tag': { multiplier: 0.95, label_th: 'ใหม่ แกะป้ายแล้ว', label_en: 'New no Tags' },
    'worn_once': { multiplier: 0.85, label_th: 'ใส่ครั้งเดียว', label_en: 'Worn Once' },
    'worn_few': { multiplier: 0.75, label_th: 'ใส่ไม่กี่ครั้ง', label_en: 'Worn Few Times' },
    'minor_flaws': { multiplier: 0.55, label_th: 'มีตำหนิเล็กน้อย', label_en: 'Minor Flaws' },
    'visible_wear': { multiplier: 0.40, label_th: 'ร่องรอยใช้งานชัด', label_en: 'Visible Wear' },
    'well_worn': { multiplier: 0.35, label_th: 'ใช้งานมาก', label_en: 'Well Worn' },
    'damaged': { multiplier: 0.15, label_th: 'เสียหาย', label_en: 'Damaged' },

    // ========== VEHICLE ==========
    'excellent': { multiplier: 0.95, label_th: 'ดีเยี่ยม', label_en: 'Excellent' },
    'salvage': { multiplier: 0.15, label_th: 'รถซาก', label_en: 'Salvage' },

    // ========== AUTO PARTS ==========
    'used_good': { multiplier: 0.55, label_th: 'มือสอง สภาพดี', label_en: 'Used Good' },
    'new_oem': { multiplier: 0.95, label_th: 'OEM แท้', label_en: 'OEM Original' },
    'aftermarket': { multiplier: 0.75, label_th: 'Aftermarket', label_en: 'Aftermarket' },

    // ========== GAMING ==========
    'modded': { multiplier: 0.45, label_th: 'แปลงเครื่อง', label_en: 'Modded' },

    // ========== CAMERA ==========
    'mint': { multiplier: 0.90, label_th: 'Mint condition', label_en: 'Mint' },
    'excellent_minus': { multiplier: 0.80, label_th: 'Excellent-', label_en: 'Excellent-' },
    'dust': { multiplier: 0.55, label_th: 'มีฝุ่น', label_en: 'Dust' },
    'haze': { multiplier: 0.30, label_th: 'ขึ้นฝ้า/รา', label_en: 'Haze/Fungus' },

    // ========== AMULETS & COLLECTIBLES ==========
    'original_surface': { multiplier: 1.00, label_th: 'สวยเดิม ผิวเดิม', label_en: 'Original Surface' },
    'natural_patina': { multiplier: 0.95, label_th: 'ผิวเปิดตี้สวย', label_en: 'Natural Patina' },
    'gold_cased': { multiplier: 1.20, label_th: 'เลี่ยมทอง', label_en: 'Gold Cased' },  // เพิ่มมูลค่าจากเลี่ยมทอง
    'silver_cased': { multiplier: 1.05, label_th: 'เลี่ยมเงิน', label_en: 'Silver Cased' },
    'minor_wear': { multiplier: 0.70, label_th: 'มีรอยครูด', label_en: 'Minor Wear' },
    'restored': { multiplier: 0.50, label_th: 'ซ่อม/ล้างแล้ว', label_en: 'Restored' },

    // ========== PETS (สำหรับสินค้าสัตว์เลี้ยง/อุปกรณ์) ==========
    'healthy': { multiplier: 1.00, label_th: 'สุขภาพดี', label_en: 'Healthy' },
    'vaccinated': { multiplier: 1.00, label_th: 'ฉีดวัคซีนครบ', label_en: 'Vaccinated' },
    'neutered': { multiplier: 0.90, label_th: 'ทำหมันแล้ว', label_en: 'Neutered' },
    'needs_care': { multiplier: 0.60, label_th: 'ต้องดูแลพิเศษ', label_en: 'Needs Care' },

    // ========== BEAUTY/COSMETICS (Usage Based) ==========
    'sealed': { multiplier: 1.00, label_th: 'ซีลอยู่', label_en: 'Sealed' },
    'opened_unused': { multiplier: 0.85, label_th: 'เปิดแล้วไม่ได้ใช้', label_en: 'Opened Unused' },
    'lightly_used': { multiplier: 0.70, label_th: 'ใช้น้อย', label_en: 'Lightly Used' },
    'half_used': { multiplier: 0.40, label_th: 'ใช้ไปครึ่ง', label_en: 'Half Used' },
    'used_10': { multiplier: 0.80, label_th: 'ใช้ไป 10%', label_en: 'Used 10%' },
    'used_30': { multiplier: 0.65, label_th: 'ใช้ไป 30%', label_en: 'Used 30%' },
    'used_50': { multiplier: 0.45, label_th: 'ใช้ไป 50%', label_en: 'Used 50%' },
    'used_70': { multiplier: 0.25, label_th: 'ใช้ไป 70%', label_en: 'Used 70%' },
    'almost_empty': { multiplier: 0.10, label_th: 'เหลือนิดเดียว', label_en: 'Almost Empty' },

    // ========== LUXURY (Bags/Watches) ==========
    'new_receipt': { multiplier: 1.00, label_th: 'ใหม่ มีใบเสร็จ', label_en: 'New with Receipt' },
    'new_no_receipt': { multiplier: 0.95, label_th: 'ใหม่ ไม่มีใบเสร็จ', label_en: 'New no Receipt' },
    'very_good': { multiplier: 0.80, label_th: 'สภาพดีมาก', label_en: 'Very Good' },

    // ========== KIDS/BABY ==========
    'like_new_clean': { multiplier: 0.80, label_th: 'เหมือนใหม่ สะอาด', label_en: 'Like New Clean' },
    'gently_used': { multiplier: 0.65, label_th: 'ใช้งานน้อย', label_en: 'Gently Used' },
    'stained': { multiplier: 0.35, label_th: 'มีคราบบ้าง', label_en: 'Some Stains' },

    // ========== SPORTS/TRAVEL ==========
    'worn': { multiplier: 0.40, label_th: 'มีร่องรอยใช้งาน', label_en: 'Visible Wear' },

    // ========== HOME & GARDEN ==========
    'needs_assembly': { multiplier: 0.80, label_th: 'ต้องประกอบ', label_en: 'Needs Assembly' },

    // ========== BOOKS ==========
    'highlighted': { multiplier: 0.60, label_th: 'มีไฮไลท์/ขีดเส้น', label_en: 'Highlighted' },
    'notes': { multiplier: 0.55, label_th: 'มีจดโน้ต', label_en: 'Has Notes' },

    // ========== REAL ESTATE ==========
    'renovated': { multiplier: 0.95, label_th: 'รีโนเวทใหม่', label_en: 'Newly Renovated' },
    'move_in': { multiplier: 0.85, label_th: 'พร้อมเข้าอยู่', label_en: 'Move-in Ready' },
    'needs_renovation': { multiplier: 0.50, label_th: 'ต้องปรับปรุง', label_en: 'Needs Renovation' },
    'under_construction': { multiplier: 0.60, label_th: 'กำลังก่อสร้าง', label_en: 'Under Construction' },
    'vacant_land': { multiplier: 1.00, label_th: 'ที่ดินเปล่า', label_en: 'Vacant Land' },
}

// ============================================
// VEHICLE-SPECIFIC MULTIPLIERS
// ⚠️ MUST MATCH PRODUCT_CONDITIONS from constants/categories.ts!
// ⚠️ These are for PHYSICAL CONDITION only, not age (age is separate depreciation)
// ============================================

const VEHICLE_CONDITION_MULTIPLIERS: Record<string, { multiplier: number; label_th: string }> = {
    // ⚠️ MUST MATCH AUTOMOTIVE_CONDITIONS from category-condition-options.ts!
    // UI options: new, like_new, good, fair, poor
    'new': { multiplier: 1.00, label_th: 'ใหม่ป้ายแดง' },              // 100% - Perfect condition
    'like_new': { multiplier: 0.95, label_th: 'เหมือนใหม่ ไมล์น้อย' },  // 95% - ลด 5% (slight wear)
    'good': { multiplier: 0.85, label_th: 'สภาพดี ใช้งานปกติ' },        // 85% - ลด 15% (normal wear)
    'used': { multiplier: 0.85, label_th: 'สภาพดี (มือสอง)' },          // ⚠️ Fallback for 'used' -> treat as 'good'
    'fair': { multiplier: 0.70, label_th: 'ใช้งานได้ ต้องซ่อมบำรุง' },  // 70% - ลด 30% (needs maintenance)
    'poor': { multiplier: 0.25, label_th: 'ซากรถ/อะไหล่' },            // 25% - ลด 75% (salvage/parts only)
}

// ============================================
// ACCIDENT HISTORY IMPACT
// ============================================

const ACCIDENT_IMPACT: Record<string, number> = {
    'none': 0,           // ไม่เคย → 0%
    'minor_fixed': -0.08, // ชนเล็กน้อย ซ่อมแล้ว → -8%
    'minor': -0.10,      // ชนเล็กน้อย → -10%
    'moderate_fixed': -0.15, // ชนปานกลาง ซ่อมแล้ว → -15%
    'moderate': -0.20,   // ชนปานกลาง → -20%
    'major_fixed': -0.30, // ชนหนัก ซ่อมแล้ว → -30%
    'major': -0.40,      // ชนหนัก → -40%
}

// ============================================
// FLOOD HISTORY IMPACT
// ============================================

const FLOOD_IMPACT: Record<string, number> = {
    'none': 0,            // ไม่เคย → 0%
    'never': 0,           // ไม่เคย → 0%
    'never_flooded': 0,   // ไม่เคย → 0%
    'partial': -0.25,     // น้ำท่วมบางส่วน (ไม่ถึงพื้นห้องโดยสาร) → -25%
    'flooded': -0.35,     // เคยจมน้ำ (backward compatibility) → -35%
    'full': -0.50,        // น้ำท่วมทั้งคัน → -50%
}

// ============================================
// MILEAGE IMPACT (for vehicles)
// ============================================

function calculateMileageImpact(mileage: number, year: number): number {
    const currentYear = new Date().getFullYear()
    const vehicleAge = currentYear - year
    const expectedMileage = vehicleAge * 15000 // 15,000 km per year average

    if (mileage <= expectedMileage * 0.5) {
        // Very low mileage → +5-10%
        return 0.05
    } else if (mileage <= expectedMileage) {
        // Normal mileage → 0%
        return 0
    } else if (mileage <= expectedMileage * 1.5) {
        // High mileage → -5%
        return -0.05
    } else if (mileage <= expectedMileage * 2) {
        // Very high mileage → -10%
        return -0.10
    } else {
        // Extremely high → -15%
        return -0.15
    }
}

// ============================================
// YEAR/AGE DEPRECIATION
// ============================================

function calculateDepreciation(year: number, categoryId: number, subcategoryId?: number): number {
    const currentYear = new Date().getFullYear()
    const age = currentYear - year

    // Motorcycle (subcategory 102) - Lower depreciation than cars
    if (subcategoryId === 102) {
        if (age <= 0) return 0  // ใหม่ป้ายแดง
        if (age === 1) return -0.03  // 1 ปี = -3%
        if (age === 2) return -0.06  // 2 ปี = -6%
        if (age === 3) return -0.09  // 3 ปี = -9%
        if (age <= 5) return -0.10 - ((age - 3) * 0.02)  // 4-5 ปี = -14% max
        if (age <= 10) return -0.15 - ((age - 5) * 0.02) // 6-10 ปี = -25% max
        if (age <= 15) return -0.25 - ((age - 10) * 0.02) // 11-15 ปี = -35% max
        return -0.40 // Max 40% depreciation for motorcycles
    }

    if (categoryId === 1) { // รถยนต์
        // ⚠️ Adjusted: More realistic Thai used car market depreciation
        // Note: Condition multiplier already accounts for wear, so depreciation is mainly for age
        if (age <= 0) return 0  // ใหม่ป้ายแดง
        if (age === 1) return -0.05  // 1 ปี = -5%
        if (age === 2) return -0.10  // 2 ปี = -10%
        if (age === 3) return -0.15  // 3 ปี = -15%
        if (age <= 5) return -0.20 - ((age - 4) * 0.03)  // 4-5 ปี = -23% max
        if (age <= 10) return -0.25 - ((age - 5) * 0.04) // 6-10 ปี = -45% max
        if (age <= 15) return -0.45 - ((age - 10) * 0.03) // 11-15 ปี = -60% max
        return -0.65 // Max 65% depreciation
    }

    // Electronics: faster depreciation
    if (categoryId === 3 || categoryId === 4) {
        if (age <= 0) return 0
        if (age <= 2) return -(age * 0.15)  // -15% per year
        if (age <= 4) return -0.30 - ((age - 2) * 0.10)
        return -0.50 // Max 50%
    }

    // Fashion: moderate
    if (categoryId === 6) {
        if (age <= 0) return 0
        if (age <= 2) return -(age * 0.10)
        return -0.25
    }

    return 0 // Other categories: no year depreciation
}


// ============================================
// MAIN ESTIMATION FUNCTION
// ============================================

export function calculateSmartPriceEstimate(input: EstimationInput): PriceEstimation {
    const { categoryId, subcategoryId, condition, specs = {}, imageQualityScore = 70, hasMultipleImages = false, language = 'th' } = input

    const factors: PriceFactor[] = []
    const insights: string[] = []

    // 1. Get base price - prioritize subcategory, fallback to category
    let basePrice = { min: 100, max: 10000, avg: 1000 } // Default
    let priceSource = 'default'

    if (subcategoryId && SUBCATEGORY_BASE_PRICES[subcategoryId]) {
        basePrice = SUBCATEGORY_BASE_PRICES[subcategoryId]
        priceSource = 'subcategory'
    } else if (categoryId && CATEGORY_BASE_PRICES[categoryId]) {
        basePrice = CATEGORY_BASE_PRICES[categoryId]
        priceSource = 'category'
    }

    let estimatedPrice = basePrice.avg

    // Debug log
    console.log('SmartPriceEstimator:', {
        categoryId,
        subcategoryId,
        priceSource,
        basePrice,
        condition,
        specs,  // ✅ Log specs to see what's being received
        specKeys: Object.keys(specs)
    })

    // 2. Apply condition multiplier
    let conditionMultiplier = 0.7 // Default
    let conditionLabel = ''

    if (categoryId === 1) { // ยานยนต์
        // Vehicle-specific conditions
        const vehicleCond = VEHICLE_CONDITION_MULTIPLIERS[condition]
        if (vehicleCond) {
            conditionMultiplier = vehicleCond.multiplier
            conditionLabel = vehicleCond.label_th
        } else {
            // Try general conditions as fallback
            const generalCond = GENERAL_CONDITION_MULTIPLIERS[condition]
            if (generalCond) {
                conditionMultiplier = generalCond.multiplier
                conditionLabel = generalCond.label_th
            }
        }
    } else {
        const generalCond = GENERAL_CONDITION_MULTIPLIERS[condition]
        if (generalCond) {
            conditionMultiplier = generalCond.multiplier
            conditionLabel = language === 'th' ? generalCond.label_th : generalCond.label_en
        } else {
            // ⚠️ Unknown condition value - log warning
            console.warn(`⚠️ Unknown condition value: "${condition}" - using default 0.7. Add this to GENERAL_CONDITION_MULTIPLIERS!`)
            conditionLabel = condition || 'ไม่ระบุ'
        }
    }

    estimatedPrice *= conditionMultiplier


    const conditionImpact = Math.round((conditionMultiplier - 1) * 100)
    factors.push({
        name_th: `สภาพ: ${conditionLabel}`,
        name_en: `Condition: ${conditionLabel}`,
        impact: conditionImpact >= 0 ? 'positive' : 'negative',
        percentage: conditionImpact,
        icon: conditionImpact >= 0 ? '✅' : '📉'
    })

    // ✅ Extract formData early so it's available for all category-specific logic
    const formData = input.formData || {}

    // 3. Vehicle-specific factors (Category 1 = ยานยนต์)
    if (categoryId === 1) {
        // ✅ DEBUG: Log all data received
        console.log('🚗 Automotive Price Calculation:', {
            specs,
            formData,
            specsBrand: specs['brand'],
            specsYear: specs['year'],
            specsMileage: specs['mileage'],
            formDataBrand: formData['brand'],
            formDataYear: formData['year'],
            formDataMileage: formData['mileage'],
        })

        // Brand multiplier - ✅ Check BOTH specs AND formData!
        const brand = (specs['brand'] || specs['ยี่ห้อ'] || (formData['brand'] as string) || (formData['ยี่ห้อ'] as string) || '').toLowerCase()
        console.log('🏷️ Brand detected:', brand, '| Has multiplier?:', !!CAR_BRAND_MULTIPLIERS[brand])

        if (brand && CAR_BRAND_MULTIPLIERS[brand]) {
            const brandMultiplier = CAR_BRAND_MULTIPLIERS[brand]
            estimatedPrice *= brandMultiplier

            const brandImpact = Math.round((brandMultiplier - 1) * 100)
            if (brandImpact !== 0) {
                factors.push({
                    name_th: `🚗 ยี่ห้อ: ${brand.toUpperCase()}`,
                    name_en: `🚗 Brand: ${brand.toUpperCase()}`,
                    impact: brandImpact >= 0 ? 'positive' : 'negative',
                    percentage: brandImpact,
                    icon: brandImpact >= 0 ? '🏆' : '🏷️'
                })
            }
        }

        // Year depreciation - ✅ Check BOTH specs AND formData!
        const year = parseInt(specs['year'] || specs['ปีรถ'] || (formData['year'] as string) || (formData['ปีรถ'] as string) || '0')
        if (year > 2000) {
            const depreciation = calculateDepreciation(year, categoryId, subcategoryId)
            estimatedPrice *= (1 + depreciation)


            if (depreciation !== 0) {
                factors.push({
                    name_th: `📅 ปีรถ: ${year}`,
                    name_en: `📅 Year: ${year}`,
                    impact: depreciation > 0 ? 'positive' : 'negative',
                    percentage: Math.round(depreciation * 100),
                    icon: '📅'
                })
            }
        }

        // Mileage - ✅ Check BOTH specs AND formData!
        const mileage = parseInt(specs['mileage'] || specs['ระยะทาง'] || (formData['mileage'] as string) || (formData['ระยะทาง'] as string) || '0')
        if (mileage > 0 && year > 2000) {
            const mileageImpact = calculateMileageImpact(mileage, year)
            estimatedPrice *= (1 + mileageImpact)

            factors.push({
                name_th: `🛣️ ระยะทาง: ${mileage.toLocaleString()} km`,
                name_en: `🛣️ Mileage: ${mileage.toLocaleString()} km`,
                impact: mileageImpact >= 0 ? (mileageImpact > 0 ? 'positive' : 'neutral') : 'negative',
                percentage: Math.round(mileageImpact * 100),
                icon: mileageImpact >= 0 ? '🚗' : '⚠️'
            })
        }

        // Accident history - ⚠️ Use correct field key from form!
        const accidentHistory = specs['accident'] || specs['accident_history'] || specs['ประวัติอุบัติเหตุ'] || ''

        // Check accident impact using both enum and lookup
        let accidentImpact = 0
        if (accidentHistory === 'none' || accidentHistory === '') {
            accidentImpact = 0
        } else if (accidentHistory === 'minor') {
            accidentImpact = -0.05  // -5% for minor accident
        } else if (accidentHistory === 'moderate') {
            accidentImpact = -0.10  // -10% for moderate accident
        } else if (accidentHistory === 'major') {
            accidentImpact = -0.20  // -20% for major accident
        } else {
            // Fallback to lookup table or text detection
            accidentImpact = ACCIDENT_IMPACT[accidentHistory] || 0
            if (accidentImpact === 0 && accidentHistory.length > 0) {
                accidentImpact = -0.08  // Default -8% for any non-empty text
            }
        }

        if (accidentImpact !== 0) {
            estimatedPrice *= (1 + accidentImpact)

            factors.push({
                name_th: `ประวัติอุบัติเหตุ`,
                name_en: `Accident History`,
                impact: 'negative',
                percentage: Math.round(accidentImpact * 100),
                icon: '💥'
            })
        }

        // Flood history - ⚠️ Use correct field key from form!
        const floodHistory = specs['flood'] || specs['flood_history'] || specs['ประวัติน้ำท่วม'] || ''

        // Check flood impact using both enum and lookup
        let floodImpact = 0
        if (floodHistory === 'none' || floodHistory === '') {
            floodImpact = 0
        } else if (floodHistory === 'partial') {
            floodImpact = -0.15  // -15% for partial flood
        } else if (floodHistory === 'full') {
            floodImpact = -0.35  // -35% for full flood
        } else {
            floodImpact = FLOOD_IMPACT[floodHistory] || 0
        }

        if (floodImpact !== 0) {
            estimatedPrice *= (1 + floodImpact)

            factors.push({
                name_th: `ประวัติน้ำท่วม`,
                name_en: `Flood History`,
                impact: 'negative',
                percentage: Math.round(floodImpact * 100),
                icon: '🌊'
            })
        }

        // ============================================
        // ADDITIONAL VEHICLE-SPECIFIC PRICING FACTORS (NEW!)
        // ============================================

        // 3.1 Number of Owners
        const owners = specs['owners'] || (formData['owners'] as string) || ''
        if (owners) {
            const OWNERS_IMPACT: Record<string, number> = {
                '1': 0.03,      // มือเดียว +3% (premium)
                '2': 0,         // มือสอง (baseline)
                '3+': -0.08,    // มือสามขึ้นไป -8%
            }
            const ownersImpact = OWNERS_IMPACT[owners] ?? 0
            if (ownersImpact !== 0) {
                estimatedPrice *= (1 + ownersImpact)
                factors.push({
                    name_th: `เจ้าของ: ${owners === '1' ? 'มือเดียว' : owners === '2' ? 'มือสอง' : 'มือ' + owners}`,
                    name_en: `Owner: ${owners === '1' ? '1st Owner' : 'Owner #' + owners}`,
                    impact: ownersImpact >= 0 ? 'positive' : 'negative',
                    percentage: Math.round(ownersImpact * 100),
                    icon: owners === '1' ? '👤' : '👥'
                })
            }
        }

        // 3.2 Usage Type
        const usageType = specs['usage_type'] || (formData['usage_type'] as string) || ''
        if (usageType) {
            const USAGE_IMPACT: Record<string, number> = {
                'personal': 0,          // ใช้ส่วนตัว (baseline)
                'company': -0.05,       // รถบริษัท -5%
                'taxi': -0.25,          // รถแท็กซี่ -25%
                'rental': -0.20,        // รถเช่า -20%
            }
            const usageImpact = USAGE_IMPACT[usageType] ?? 0
            if (usageImpact !== 0) {
                estimatedPrice *= (1 + usageImpact)
                factors.push({
                    name_th: `ประเภทใช้งาน: ${usageType === 'taxi' ? 'รถแท็กซี่' : usageType === 'rental' ? 'รถเช่า' : usageType}`,
                    name_en: `Usage: ${usageType}`,
                    impact: 'negative',
                    percentage: Math.round(usageImpact * 100),
                    icon: usageType === 'taxi' ? '🚕' : '📉'
                })
            }
        }

        // 3.3 Book Status (สมุดเล่มเดิม)
        const bookStatus = specs['book_status'] || (formData['book_status'] as string) || ''
        if (bookStatus) {
            const BOOK_IMPACT: Record<string, number> = {
                'original': 0.02,       // เล่มเดิม +2%
                'copy': -0.08,          // เล่มแดง/สำเนา -8%
                'lost': -0.15,          // หาย/กำลังทำใหม่ -15%
            }
            const bookImpact = BOOK_IMPACT[bookStatus] ?? 0
            if (bookImpact !== 0) {
                estimatedPrice *= (1 + bookImpact)
                factors.push({
                    name_th: `สมุดเล่ม: ${bookStatus === 'original' ? 'เล่มเดิม' : bookStatus === 'copy' ? 'เล่มแดง' : 'ไม่มี'}`,
                    name_en: `Registration Book: ${bookStatus}`,
                    impact: bookImpact >= 0 ? 'positive' : 'negative',
                    percentage: Math.round(bookImpact * 100),
                    icon: bookStatus === 'original' ? '📘' : '⚠️'
                })
            }
        }

        // 3.4 Tax Status (ภาษี/พ.ร.บ.)
        const taxStatus = specs['tax_status'] || (formData['tax_status'] as string) || ''
        if (taxStatus) {
            const TAX_IMPACT: Record<string, number> = {
                'valid': 0,             // ยังไม่ขาด (baseline)
                'expiring_soon': -0.01, // จะขาดเร็วๆ นี้ -1%
                'expired': -0.03,       // ขาดภาษี -3%
                'pending': -0.01,       // กำลังต่อ -1%
            }
            const taxImpact = TAX_IMPACT[taxStatus] ?? 0
            if (taxImpact !== 0) {
                estimatedPrice *= (1 + taxImpact)
                factors.push({
                    name_th: `ภาษี/พ.ร.บ.: ${taxStatus === 'expired' ? 'ขาด' : 'กำลังต่อ'}`,
                    name_en: `Tax/Insurance: ${taxStatus}`,
                    impact: 'negative',
                    percentage: Math.round(taxImpact * 100),
                    icon: '📋'
                })
            }
        }

        // 3.5 Fuel Type (เชื้อเพลิง)
        const fuelType = specs['fuel_type'] || specs['fuel'] || (formData['fuel_type'] as string) || ''
        if (fuelType) {
            const FUEL_IMPACT: Record<string, number> = {
                'petrol': 0,            // เบนซิน (baseline)
                'benzene': 0,
                'diesel': 0.02,         // ดีเซล +2% (ประหยัดน้ำมัน)
                'hybrid': 0.08,         // ไฮบริด +8% (ประหยัด)
                'ev': 0.10,             // ไฟฟ้า +10% (แนวโน้มอนาคต)
                'lpg': -0.08,           // LPG -8% (ระบบแก๊ส)
                'cng': -0.08,           // CNG -8%
            }
            const fuelImpact = FUEL_IMPACT[fuelType] ?? 0
            if (fuelImpact !== 0) {
                estimatedPrice *= (1 + fuelImpact)
                factors.push({
                    name_th: `เชื้อเพลิง: ${fuelType}`,
                    name_en: `Fuel: ${fuelType}`,
                    impact: fuelImpact >= 0 ? 'positive' : 'negative',
                    percentage: Math.round(fuelImpact * 100),
                    icon: fuelImpact >= 0 ? '⛽' : '🔵'
                })
            }
        }

        // 3.6 Transmission (เกียร์)
        const transmission = specs['transmission'] || (formData['transmission'] as string) || ''
        if (transmission) {
            const TRANS_IMPACT: Record<string, number> = {
                'auto': 0.02,           // ออโต้ +2% (นิยมกว่า)
                'cvt': 0.02,            // CVT +2%
                'manual': -0.03,        // ธรรมดา -3%
            }
            const transImpact = TRANS_IMPACT[transmission] ?? 0
            if (transImpact !== 0) {
                estimatedPrice *= (1 + transImpact)
                factors.push({
                    name_th: `เกียร์: ${transmission === 'auto' ? 'ออโต้' : transmission === 'manual' ? 'ธรรมดา' : 'CVT'}`,
                    name_en: `Transmission: ${transmission}`,
                    impact: transImpact >= 0 ? 'positive' : 'negative',
                    percentage: Math.round(transImpact * 100),
                    icon: transmission === 'auto' ? '🅰️' : 'Ⓜ️'
                })
            }
        }

        // 3.7 Color (สีนิยม)
        const color = (specs['color'] || (formData['color'] as string) || '').toLowerCase()
        if (color) {
            const POPULAR_COLORS = ['ขาว', 'white', 'ดำ', 'black', 'เงิน', 'silver', 'เทา', 'gray', 'grey']
            const UNPOPULAR_COLORS = ['เขียว', 'green', 'ม่วง', 'purple', 'ชมพู', 'pink', 'เหลือง', 'yellow']

            let colorImpact = 0
            if (POPULAR_COLORS.some(c => color.includes(c))) {
                colorImpact = 0.02  // สีนิยม +2%
            } else if (UNPOPULAR_COLORS.some(c => color.includes(c))) {
                colorImpact = -0.03 // สีไม่นิยม -3%
            }

            if (colorImpact !== 0) {
                estimatedPrice *= (1 + colorImpact)
                factors.push({
                    name_th: `สี: ${specs['color'] || formData['color']}`,
                    name_en: `Color: ${specs['color'] || formData['color']}`,
                    impact: colorImpact >= 0 ? 'positive' : 'negative',
                    percentage: Math.round(colorImpact * 100),
                    icon: colorImpact >= 0 ? '🎨' : '🖌️'
                })
            }
        }
    }

    // ============================================
    // 3.4. MOTORCYCLE-SPECIFIC FACTORS (Subcategory 102)
    // ============================================
    if (subcategoryId === 102 || (categoryId === 1 && (specs['vehicle_type'] || '').toLowerCase().includes('motorcycle'))) {
        // 3.4.1 Engine CC (ขนาดเครื่อง) - ⚠️ แสดงข้อมูลเท่านั้น ไม่มี factor คำนวณ
        // ผู้ใช้กรอก cc เอง โดยไม่มีผลต่อราคาที่ประเมิน
        const engineCc = parseInt(specs['engine_cc'] || specs['cc'] || (formData['engine_cc'] as string) || '0')
        if (engineCc > 0) {
            // 📝 แสดงข้อมูล CC เป็น factor แบบ neutral (ไม่มีผลต่อราคา)
            let ccLabel = ''
            if (engineCc <= 150) {
                ccLabel = 'สกู๊ตเตอร์เล็ก'
            } else if (engineCc <= 350) {
                ccLabel = 'สแตนดาร์ด 150-350cc'
            } else if (engineCc <= 650) {
                ccLabel = 'บิ๊กไบค์กลาง 350-650cc'
            } else if (engineCc <= 1000) {
                ccLabel = 'บิ๊กไบค์ 650-1000cc'
            } else {
                ccLabel = 'ซูเปอร์ไบค์ 1000cc+'
            }

            // ⚠️ IMPORTANT: ไม่มี factor คำนวณ - แค่แสดงข้อมูลเท่านั้น
            factors.push({
                name_th: `🏍️ ขนาดเครื่อง ${engineCc}cc (${ccLabel})`,
                name_en: `🏍️ Engine: ${engineCc}cc`,
                impact: 'neutral',
                percentage: 0, // ไม่มีผลต่อราคา
                icon: '🏍️'
            })
        }

        // 3.4.2 Motorcycle Type
        const motorcycleType = specs['motorcycle_type'] || (formData['motorcycle_type'] as string) || ''
        if (motorcycleType) {
            const MOTO_TYPE_IMPACT: Record<string, number> = {
                'scooter': 0,           // สกู๊ตเตอร์ (baseline)
                'cruiser': 0.05,        // ครุยเซอร์ +5%
                'sport': 0.08,          // สปอร์ต +8%
                'naked': 0.05,          // เนคเก็ด +5%
                'touring': 0.10,        // ทัวริ่ง +10%
                'off_road': 0,          // ออฟโรด (baseline)
                'classic': 0.08,        // คลาสสิก +8%
            }
            const typeImpact = MOTO_TYPE_IMPACT[motorcycleType] ?? 0
            if (typeImpact !== 0) {
                estimatedPrice *= (1 + typeImpact)
                factors.push({
                    name_th: `ประเภท: ${motorcycleType}`,
                    name_en: `Type: ${motorcycleType}`,
                    impact: 'positive',
                    percentage: Math.round(typeImpact * 100),
                    icon: '🏁'
                })
            }
        }

        // 3.4.3 Motorcycle Modifications
        const modifications = specs['modifications'] || (formData['modifications'] as string) || ''
        if (modifications) {
            const MODS_IMPACT: Record<string, number> = {
                'stock': 0,             // สต็อก (baseline)
                'minor_mods': 0.03,     // แต่งเบาๆ +3%
                'major_mods': -0.05,    // แต่งหนัก -5% (ลดกลุ่มผู้ซื้อ)
                'racing': -0.10,        // แต่งซิ่ง -10%
            }
            const modsImpact = MODS_IMPACT[modifications] ?? 0
            if (modsImpact !== 0) {
                estimatedPrice *= (1 + modsImpact)
                factors.push({
                    name_th: `ของแต่ง: ${modifications === 'stock' ? 'สต็อก' : modifications === 'minor_mods' ? 'แต่งเบาๆ' : 'แต่งหนัก'}`,
                    name_en: `Mods: ${modifications}`,
                    impact: modsImpact >= 0 ? 'positive' : 'negative',
                    percentage: Math.round(modsImpact * 100),
                    icon: modsImpact >= 0 ? '⚙️' : '⚠️'
                })
            }
        }

        // Motorcycle Brand Multiplier (override generic car brands)
        const motoBrand = (specs['brand'] || '').toLowerCase()
        if (motoBrand) {
            const MOTO_BRAND_IMPACT: Record<string, number> = {
                'honda': 0,             // Honda = baseline (most popular)
                'yamaha': -0.02,
                'kawasaki': -0.05,
                'suzuki': -0.08,
                'vespa': 0.08,          // Premium scooter
                'bmw': 0.15,
                'ducati': 0.15,
                'harley-davidson': 0.10,
                'triumph': 0.08,
                'ktm': 0.05,
                'gpx': -0.15,
                'other': -0.15,
            }
            const brandImpact = MOTO_BRAND_IMPACT[motoBrand] ?? 0
            // Only add if not already added by generic brand logic
            if (brandImpact !== 0 && !factors.some(f => f.name_th.includes('ยี่ห้อ'))) {
                estimatedPrice *= (1 + brandImpact)
                factors.push({
                    name_th: `ยี่ห้อ: ${motoBrand.toUpperCase()}`,
                    name_en: `Brand: ${motoBrand.toUpperCase()}`,
                    impact: brandImpact >= 0 ? 'positive' : 'negative',
                    percentage: Math.round(brandImpact * 100),
                    icon: brandImpact >= 0 ? '🏆' : '🏷️'
                })
            }
        }
    }

    // ============================================
    // 3.4.5. REAL ESTATE FACTORS (Category 2)
    // ============================================
    if (categoryId === 2) {
        // 3.4.5.1 Floor Level (for Condo)
        const floor = parseInt(specs['floor'] || (formData['floor'] as string) || '0')
        if (floor > 0) {
            // Higher floor = higher price (up to +15% for very high floors)
            let floorImpact = 0
            if (floor >= 1 && floor <= 5) {
                floorImpact = -0.05  // Low floors -5%
            } else if (floor >= 6 && floor <= 10) {
                floorImpact = 0      // Mid floors baseline
            } else if (floor >= 11 && floor <= 20) {
                floorImpact = 0.05   // +5%
            } else if (floor >= 21 && floor <= 30) {
                floorImpact = 0.10   // +10%
            } else if (floor > 30) {
                floorImpact = 0.15   // +15%
            }

            if (floorImpact !== 0) {
                estimatedPrice *= (1 + floorImpact)
                factors.push({
                    name_th: `ชั้น: ${floor}`,
                    name_en: `Floor: ${floor}`,
                    impact: floorImpact >= 0 ? 'positive' : 'negative',
                    percentage: Math.round(floorImpact * 100),
                    icon: floorImpact >= 0 ? '🏢' : '🏠'
                })
            }
        }

        // 3.4.5.2 Room Type
        const roomType = specs['room_type'] || (formData['room_type'] as string) || ''
        if (roomType) {
            const ROOM_TYPE_IMPACT: Record<string, number> = {
                'studio': -0.10,        // สตูดิโอ -10% (ราคาต่อ ตร.ม. ต่ำกว่า)
                '1bed': 0,              // 1 ห้องนอน (baseline)
                '2bed': 0.08,           // 2 ห้องนอน +8%
                '3bed': 0.15,           // 3 ห้องนอน +15%
                'duplex': 0.20,         // Duplex +20%
                'penthouse': 0.30,      // Penthouse +30%
            }
            const roomImpact = ROOM_TYPE_IMPACT[roomType] ?? 0
            if (roomImpact !== 0) {
                estimatedPrice *= (1 + roomImpact)
                factors.push({
                    name_th: `ประเภทห้อง: ${roomType === 'studio' ? 'สตูดิโอ' : roomType === 'penthouse' ? 'Penthouse' : roomType}`,
                    name_en: `Room Type: ${roomType}`,
                    impact: roomImpact >= 0 ? 'positive' : 'negative',
                    percentage: Math.round(roomImpact * 100),
                    icon: roomType === 'penthouse' ? '👑' : '🛏️'
                })
            }
        }

        // 3.4.5.3 View
        const view = specs['view'] || (formData['view'] as string) || ''
        if (view) {
            const VIEW_IMPACT: Record<string, number> = {
                'river': 0.15,          // วิวแม่น้ำ +15%
                'sea': 0.18,            // วิวทะเล +18%
                'park': 0.10,           // วิวสวนสาธารณะ +10%
                'city': 0.08,           // วิวเมือง +8%
                'pool': 0.05,           // วิวสระ +5%
                'garden': 0.03,         // วิวสวน +3%
                'other': 0,             // อื่นๆ (baseline)
            }
            const viewImpact = VIEW_IMPACT[view] ?? 0
            if (viewImpact !== 0) {
                estimatedPrice *= (1 + viewImpact)
                factors.push({
                    name_th: `วิว: ${view === 'river' ? 'แม่น้ำ' : view === 'city' ? 'เมือง' : view}`,
                    name_en: `View: ${view}`,
                    impact: 'positive',
                    percentage: Math.round(viewImpact * 100),
                    icon: view === 'river' ? '🌊' : view === 'city' ? '🌆' : '🌳'
                })
            }
        }

        // 3.4.5.4 Furnishing
        const furnishing = specs['furnishing'] || (formData['furnishing'] as string) || ''
        if (furnishing) {
            const FURNISH_IMPACT: Record<string, number> = {
                'fully': 0.10,          // Fully furnished +10%
                'partial': 0.05,        // Partially +5%
                'unfurnished': 0,       // ไม่มี (baseline)
            }
            const furnishImpact = FURNISH_IMPACT[furnishing] ?? 0
            if (furnishImpact !== 0) {
                estimatedPrice *= (1 + furnishImpact)
                factors.push({
                    name_th: `เฟอร์นิเจอร์: ${furnishing === 'fully' ? 'ครบ' : 'บางส่วน'}`,
                    name_en: `Furnishing: ${furnishing}`,
                    impact: 'positive',
                    percentage: Math.round(furnishImpact * 100),
                    icon: '🛋️'
                })
            }
        }

        // 3.4.5.5 Parking
        const parking = specs['parking'] || (formData['parking'] as string) || ''
        if (parking && parking !== '0') {
            const parkingSlots = parking === '2+' ? 2 : parseInt(parking) || 0
            const parkingImpact = parkingSlots * 0.03  // +3% per slot
            if (parkingImpact !== 0) {
                estimatedPrice *= (1 + parkingImpact)
                factors.push({
                    name_th: `ที่จอดรถ: ${parkingSlots} คัน`,
                    name_en: `Parking: ${parkingSlots} slot(s)`,
                    impact: 'positive',
                    percentage: Math.round(parkingImpact * 100),
                    icon: '🚗'
                })
            }
        }

        // 3.4.5.6 Land Title (for Land/House)
        const landTitle = specs['land_title'] || (formData['land_title'] as string) || ''
        if (landTitle) {
            const TITLE_IMPACT: Record<string, number> = {
                'ns4j': 0,              // นส.4 จ. (โฉนดครุฑแดง) - baseline
                'ns4': -0.03,           // นส.4 (โฉนดครุฑเขียว) -3%
                'ns3g': -0.08,          // นส.3 ก. -8%
                'ns3': -0.15,           // นส.3 -15%
                'sor_kor': -0.25,       // ส.ค.1 -25%
                'other': -0.30,         // อื่นๆ -30%
            }
            const titleImpact = TITLE_IMPACT[landTitle] ?? 0
            if (titleImpact !== 0) {
                estimatedPrice *= (1 + titleImpact)
                factors.push({
                    name_th: `เอกสารสิทธิ์: ${landTitle}`,
                    name_en: `Land Title: ${landTitle}`,
                    impact: 'negative',
                    percentage: Math.round(titleImpact * 100),
                    icon: '📜'
                })
            }
        }

        // 3.4.5.7 BTS/MRT Proximity (detected from nearby field or location)
        const nearby = (specs['nearby'] || (formData['nearby'] as string) || '').toLowerCase()
        if (nearby) {
            let transitImpact = 0
            if (nearby.includes('bts') || nearby.includes('mrt') || nearby.includes('รถไฟฟ้า')) {
                transitImpact = 0.12  // Near transit +12%
            } else if (nearby.includes('airport') || nearby.includes('สนามบิน')) {
                transitImpact = 0.08  // Near airport +8%
            } else if (nearby.includes('mall') || nearby.includes('ห้าง') || nearby.includes('terminal')) {
                transitImpact = 0.05  // Near mall +5%
            }

            if (transitImpact !== 0) {
                estimatedPrice *= (1 + transitImpact)
                factors.push({
                    name_th: `ใกล้รถไฟฟ้า/สิ่งอำนวยความสะดวก`,
                    name_en: `Near Transit/Amenities`,
                    impact: 'positive',
                    percentage: Math.round(transitImpact * 100),
                    icon: '🚇'
                })
            }
        }

        // 3.4.5.8 Zone/Area (for land)
        const zone = specs['zone'] || (formData['zone'] as string) || ''
        if (zone) {
            const ZONE_IMPACT: Record<string, number> = {
                'residential': 0,       // อยู่อาศัย (baseline)
                'commercial': 0.15,     // พาณิชยกรรม +15%
                'industrial': -0.10,    // อุตสาหกรรม -10%
                'agricultural': -0.20,  // เกษตรกรรม -20%
                'mixed': 0.10,          // ผสม +10%
            }
            const zoneImpact = ZONE_IMPACT[zone] ?? 0
            if (zoneImpact !== 0) {
                estimatedPrice *= (1 + zoneImpact)
                factors.push({
                    name_th: `ผังเมือง: ${zone === 'commercial' ? 'พาณิชยกรรม' : zone}`,
                    name_en: `Zone: ${zone}`,
                    impact: zoneImpact >= 0 ? 'positive' : 'negative',
                    percentage: Math.round(zoneImpact * 100),
                    icon: zoneImpact >= 0 ? '🏙️' : '🌾'
                })
            }
        }

        // ============================================
        // HOUSE-SPECIFIC FACTORS (Subcategory 201)
        // ============================================
        if (subcategoryId === 201) {
            // Bedrooms
            const bedrooms = parseInt(specs['bedrooms'] || (formData['bedrooms'] as string) || '0')
            if (bedrooms > 0) {
                const BEDROOM_IMPACT: Record<number, number> = {
                    1: -0.10,   // 1 ห้อง -10%
                    2: -0.05,   // 2 ห้อง -5%
                    3: 0,       // 3 ห้อง (baseline)
                    4: 0.08,    // 4 ห้อง +8%
                    5: 0.15,    // 5+ ห้อง +15%
                }
                const bedroomImpact = BEDROOM_IMPACT[bedrooms >= 5 ? 5 : bedrooms] ?? 0
                if (bedroomImpact !== 0) {
                    estimatedPrice *= (1 + bedroomImpact)
                    factors.push({
                        name_th: `ห้องนอน: ${bedrooms} ห้อง`,
                        name_en: `Bedrooms: ${bedrooms}`,
                        impact: bedroomImpact >= 0 ? 'positive' : 'negative',
                        percentage: Math.round(bedroomImpact * 100),
                        icon: '🛏️'
                    })
                }
            }

            // Renovation Status
            const renovation = specs['renovation'] || (formData['renovation'] as string) || ''
            if (renovation) {
                const RENO_IMPACT: Record<string, number> = {
                    'new': 0.10,        // ใหม่ไม่เคยอยู่ +10%
                    'renovated': 0.08,  // รีโนเวทใหม่ +8%
                    'good': 0,          // สภาพดี (baseline)
                    'needs_repair': -0.15,// ต้องซ่อม -15%
                }
                const renoImpact = RENO_IMPACT[renovation] ?? 0
                if (renoImpact !== 0) {
                    estimatedPrice *= (1 + renoImpact)
                    factors.push({
                        name_th: `สภาพบ้าน: ${renovation === 'new' ? 'ใหม่' : renovation === 'renovated' ? 'รีโนเวท' : 'ต้องซ่อม'}`,
                        name_en: `Renovation: ${renovation}`,
                        impact: renoImpact >= 0 ? 'positive' : 'negative',
                        percentage: Math.round(renoImpact * 100),
                        icon: renoImpact >= 0 ? '✨' : '🔧'
                    })
                }
            }

            // House Type
            const houseType = specs['house_type'] || (formData['house_type'] as string) || ''
            if (houseType) {
                const HOUSE_TYPE_IMPACT: Record<string, number> = {
                    'detached': 0.05,   // บ้านเดี่ยว +5%
                    'twin': 0,          // บ้านแฝด (baseline)
                    'village': 0.03,    // หมู่บ้านจัดสรร +3%
                }
                const typeImpact = HOUSE_TYPE_IMPACT[houseType] ?? 0
                if (typeImpact !== 0) {
                    estimatedPrice *= (1 + typeImpact)
                    factors.push({
                        name_th: `ประเภท: ${houseType === 'detached' ? 'บ้านเดี่ยว' : 'หมู่บ้านจัดสรร'}`,
                        name_en: `Type: ${houseType}`,
                        impact: 'positive',
                        percentage: Math.round(typeImpact * 100),
                        icon: '🏠'
                    })
                }
            }
        }

        // ============================================
        // LAND-SPECIFIC FACTORS (Subcategory 203)
        // ============================================
        if (subcategoryId === 203) {
            // Road Access
            const roadAccess = specs['road_access'] || (formData['road_access'] as string) || ''
            if (roadAccess) {
                const ROAD_IMPACT: Record<string, number> = {
                    'main_road': 0.20,  // ติดถนนใหญ่ +20%
                    'soi': 0.05,        // ติดซอย +5%
                    'alley': -0.05,     // ซอยเล็ก -5%
                    'none': -0.30,      // ไม่มีทางเข้า -30%
                }
                const roadImpact = ROAD_IMPACT[roadAccess] ?? 0
                if (roadImpact !== 0) {
                    estimatedPrice *= (1 + roadImpact)
                    factors.push({
                        name_th: `ทางเข้า: ${roadAccess === 'main_road' ? 'ติดถนนใหญ่' : roadAccess === 'none' ? 'ไม่มี' : roadAccess}`,
                        name_en: `Road Access: ${roadAccess}`,
                        impact: roadImpact >= 0 ? 'positive' : 'negative',
                        percentage: Math.round(roadImpact * 100),
                        icon: roadImpact >= 0 ? '🛣️' : '🚧'
                    })
                }
            }

            // Utilities
            const utilities = specs['utilities'] || (formData['utilities'] as string) || ''
            if (utilities) {
                const UTIL_IMPACT: Record<string, number> = {
                    'both': 0.10,           // มีน้ำไฟ +10%
                    'electric_only': 0.03,  // มีไฟอย่างเดียว +3%
                    'none': -0.15,          // ไม่มี -15%
                }
                const utilImpact = UTIL_IMPACT[utilities] ?? 0
                if (utilImpact !== 0) {
                    estimatedPrice *= (1 + utilImpact)
                    factors.push({
                        name_th: `สาธารณูปโภค: ${utilities === 'both' ? 'มีน้ำไฟ' : utilities === 'none' ? 'ไม่มี' : 'มีไฟ'}`,
                        name_en: `Utilities: ${utilities}`,
                        impact: utilImpact >= 0 ? 'positive' : 'negative',
                        percentage: Math.round(utilImpact * 100),
                        icon: utilImpact >= 0 ? '⚡' : '❌'
                    })
                }
            }
        }
    }

    // ============================================
    // 3.5. ELECTRONICS-SPECIFIC FACTORS (Category 3 = Mobile, 4 = Computer)
    // ============================================
    // (formData already declared above)

    if (categoryId === 3 || categoryId === 4) {
        // ============================================
        // MOBILE-SPECIFIC FACTORS (Category 3 only)
        // ============================================
        if (categoryId === 3) {
            // Phone Brand Impact
            const phoneBrand = (specs['brand'] || (formData['brand'] as string) || '').toLowerCase()
            if (phoneBrand) {
                const PHONE_BRAND_IMPACT: Record<string, number> = {
                    'apple': 0.05,          // Apple +5% (holds value best)
                    'iphone': 0.05,
                    'samsung': 0,           // Samsung (baseline)
                    'google': 0,            // Pixel (baseline)
                    'oppo': -0.08,
                    'vivo': -0.08,
                    'xiaomi': -0.12,
                    'realme': -0.12,
                    'poco': -0.15,
                    'huawei': -0.15,        // Huawei (no Google services)
                    'oneplus': -0.05,
                    'nothing': -0.05,
                    'other': -0.20,
                }
                // Find matching brand
                let brandImpact = 0
                for (const [brand, impact] of Object.entries(PHONE_BRAND_IMPACT)) {
                    if (phoneBrand.includes(brand)) {
                        brandImpact = impact
                        break
                    }
                }
                if (brandImpact !== 0) {
                    estimatedPrice *= (1 + brandImpact)
                    factors.push({
                        name_th: `📱 แบรนด์: ${specs['brand'] || formData['brand']}`,
                        name_en: `📱 Brand: ${specs['brand'] || formData['brand']}`,
                        impact: brandImpact >= 0 ? 'positive' : 'negative',
                        percentage: Math.round(brandImpact * 100),
                        icon: brandImpact >= 0 ? '🍎' : '📱'
                    })
                }
            }

            // Storage Capacity
            const storage = (specs['storage'] || (formData['storage'] as string) || '').toUpperCase()
            if (storage) {
                const STORAGE_IMPACT: Record<string, number> = {
                    '32GB': -0.15,
                    '64GB': -0.10,
                    '128GB': 0,             // Baseline
                    '256GB': 0.08,
                    '512GB': 0.12,
                    '1TB': 0.18,
                    '2TB': 0.25,
                }
                const storageImpact = STORAGE_IMPACT[storage] ?? 0
                if (storageImpact !== 0) {
                    estimatedPrice *= (1 + storageImpact)
                    factors.push({
                        name_th: `💾 ความจุ: ${storage}`,
                        name_en: `💾 Storage: ${storage}`,
                        impact: storageImpact >= 0 ? 'positive' : 'negative',
                        percentage: Math.round(storageImpact * 100),
                        icon: '💾'
                    })
                }
            }

            // Original Box
            const originalBox = (formData['original_box'] as string) || ''
            if (originalBox) {
                const BOX_IMPACT: Record<string, number> = {
                    'complete': 0.05,       // กล่อง+อุปกรณ์ครบ +5%
                    'box_only': 0.02,       // มีกล่อง +2%
                    'no_box': 0,            // ไม่มีกล่อง (baseline)
                }
                const boxImpact = BOX_IMPACT[originalBox] ?? 0
                if (boxImpact > 0) {
                    estimatedPrice *= (1 + boxImpact)
                    factors.push({
                        name_th: `📦 กล่อง: ${originalBox === 'complete' ? 'มีครบ' : 'มีกล่อง'}`,
                        name_en: `📦 Box: ${originalBox}`,
                        impact: 'positive',
                        percentage: Math.round(boxImpact * 100),
                        icon: '📦'
                    })
                }
            }
        }

        // ============================================
        // COMPUTER-SPECIFIC FACTORS (Category 4 only)
        // ============================================
        if (categoryId === 4) {
            // Computer Brand Impact
            const pcBrand = (specs['brand'] || (formData['brand'] as string) || '').toLowerCase()
            if (pcBrand) {
                const PC_BRAND_IMPACT: Record<string, number> = {
                    'apple': 0.10,          // Apple +10% (holds value best)
                    'macbook': 0.10,
                    'imac': 0.10,
                    'microsoft': 0.05,      // Surface +5%
                    'surface': 0.05,
                    'thinkpad': 0.05,       // ThinkPad +5%
                    'dell': 0,              // Dell (baseline)
                    'hp': 0,                // HP (baseline)
                    'lenovo': 0,
                    'asus': -0.03,
                    'acer': -0.08,
                    'msi': 0.05,            // Gaming brand
                    'razer': 0.08,          // Gaming premium
                    'alienware': 0.08,
                    'other': -0.15,
                }
                // Find matching brand
                let brandImpact = 0
                for (const [brand, impact] of Object.entries(PC_BRAND_IMPACT)) {
                    if (pcBrand.includes(brand)) {
                        brandImpact = impact
                        break
                    }
                }
                if (brandImpact !== 0) {
                    estimatedPrice *= (1 + brandImpact)
                    factors.push({
                        name_th: `💻 แบรนด์: ${specs['brand'] || formData['brand']}`,
                        name_en: `💻 Brand: ${specs['brand'] || formData['brand']}`,
                        impact: brandImpact >= 0 ? 'positive' : 'negative',
                        percentage: Math.round(brandImpact * 100),
                        icon: brandImpact >= 0 ? '🍎' : '💻'
                    })
                }
            }

            // RAM
            const ram = (specs['ram'] || (formData['ram'] as string) || '').toUpperCase()
            if (ram) {
                const RAM_IMPACT: Record<string, number> = {
                    '4GB': -0.15,           // 4GB ต่ำ -15%
                    '8GB': -0.05,           // 8GB -5%
                    '16GB': 0,              // 16GB (baseline)
                    '32GB': 0.08,           // 32GB +8%
                    '64GB': 0.15,           // 64GB +15%
                    '128GB': 0.20,          // 128GB +20%
                }
                const ramImpact = RAM_IMPACT[ram] ?? 0
                if (ramImpact !== 0) {
                    estimatedPrice *= (1 + ramImpact)
                    factors.push({
                        name_th: `🧠 RAM: ${ram}`,
                        name_en: `🧠 RAM: ${ram}`,
                        impact: ramImpact >= 0 ? 'positive' : 'negative',
                        percentage: Math.round(ramImpact * 100),
                        icon: '🧠'
                    })
                }
            }

            // GPU (Graphics Card)
            const gpu = (specs['gpu'] || (formData['gpu'] as string) || '').toLowerCase()
            if (gpu) {
                let gpuImpact = 0
                let gpuLabel = 'integrated'

                // NVIDIA RTX series
                if (gpu.includes('rtx 40') || gpu.includes('rtx40')) {
                    gpuImpact = 0.20  // RTX 40 series +20%
                    gpuLabel = 'RTX 40 Series'
                } else if (gpu.includes('rtx 30') || gpu.includes('rtx30')) {
                    gpuImpact = 0.15  // RTX 30 series +15%
                    gpuLabel = 'RTX 30 Series'
                } else if (gpu.includes('rtx 20') || gpu.includes('rtx20')) {
                    gpuImpact = 0.08  // RTX 20 series +8%
                    gpuLabel = 'RTX 20 Series'
                } else if (gpu.includes('rtx')) {
                    gpuImpact = 0.10  // Generic RTX +10%
                    gpuLabel = 'RTX'
                } else if (gpu.includes('gtx 16') || gpu.includes('gtx16')) {
                    gpuImpact = 0.03  // GTX 16 series +3%
                    gpuLabel = 'GTX 16 Series'
                } else if (gpu.includes('gtx')) {
                    gpuImpact = 0.02  // Older GTX +2%
                    gpuLabel = 'GTX'
                }
                // AMD GPU
                else if (gpu.includes('rx 7') || gpu.includes('rx7')) {
                    gpuImpact = 0.15  // RX 7000 series +15%
                    gpuLabel = 'RX 7000'
                } else if (gpu.includes('rx 6') || gpu.includes('rx6')) {
                    gpuImpact = 0.10  // RX 6000 series +10%
                    gpuLabel = 'RX 6000'
                } else if (gpu.includes('radeon') || gpu.includes('rx')) {
                    gpuImpact = 0.05  // Generic AMD +5%
                    gpuLabel = 'AMD Radeon'
                }
                // Apple Silicon
                else if (gpu.includes('m3 max') || gpu.includes('m2 max')) {
                    gpuImpact = 0.20  // Apple Silicon Max +20%
                    gpuLabel = 'Apple M-Max'
                } else if (gpu.includes('m3 pro') || gpu.includes('m2 pro')) {
                    gpuImpact = 0.12  // Apple Silicon Pro +12%
                    gpuLabel = 'Apple M-Pro'
                } else if (gpu.includes('m1') || gpu.includes('m2') || gpu.includes('m3')) {
                    gpuImpact = 0.05  // Apple Silicon base +5%
                    gpuLabel = 'Apple M-Series'
                }
                // Integrated
                else if (gpu.includes('integrated') || gpu.includes('intel') || gpu.includes('uhd') || gpu.includes('iris')) {
                    gpuImpact = -0.08  // Integrated -8%
                    gpuLabel = 'Integrated'
                }

                if (gpuImpact !== 0) {
                    estimatedPrice *= (1 + gpuImpact)
                    factors.push({
                        name_th: `🎮 การ์ดจอ: ${gpuLabel}`,
                        name_en: `🎮 GPU: ${gpuLabel}`,
                        impact: gpuImpact >= 0 ? 'positive' : 'negative',
                        percentage: Math.round(gpuImpact * 100),
                        icon: '🎮'
                    })
                }
            }

            // Storage Type (SSD vs HDD)
            const storage = (specs['storage'] || (formData['storage'] as string) || '').toLowerCase()
            if (storage) {
                let storageImpact = 0
                let storageLabel = ''

                if (storage.includes('2tb') || storage.includes('2 tb')) {
                    storageImpact = 0.10  // 2TB+ +10%
                    storageLabel = '2TB'
                } else if (storage.includes('1tb') || storage.includes('1 tb')) {
                    storageImpact = 0.05  // 1TB +5%
                    storageLabel = '1TB'
                } else if (storage.includes('512gb') || storage.includes('512 gb')) {
                    storageImpact = 0     // 512GB (baseline)
                    storageLabel = '512GB'
                } else if (storage.includes('256gb') || storage.includes('256 gb')) {
                    storageImpact = -0.05  // 256GB -5%
                    storageLabel = '256GB'
                } else if (storage.includes('128gb') || storage.includes('128 gb')) {
                    storageImpact = -0.10  // 128GB -10%
                    storageLabel = '128GB'
                }

                // SSD vs HDD modifier
                if (storage.includes('ssd') && storage.includes('hdd')) {
                    storageImpact += 0.03  // Dual storage +3%
                } else if (storage.includes('nvme') || storage.includes('ssd')) {
                    storageImpact += 0.03  // SSD +3%
                } else if (storage.includes('hdd')) {
                    storageImpact -= 0.08  // HDD only -8%
                }

                if (storageImpact !== 0 && storageLabel) {
                    estimatedPrice *= (1 + storageImpact)
                    factors.push({
                        name_th: `💾 ความจุ: ${storageLabel}`,
                        name_en: `💾 Storage: ${storageLabel}`,
                        impact: storageImpact >= 0 ? 'positive' : 'negative',
                        percentage: Math.round(storageImpact * 100),
                        icon: '💾'
                    })
                }
            }
        }

        // Battery Health
        const battery = (formData['battery'] as string) || ''
        if (battery) {
            const BATTERY_IMPACT: Record<string, number> = {
                '90-100': 0,
                '80-89': -0.05,
                '70-79': -0.15,
                '60-69': -0.25,
                'below-60': -0.35,
                'unknown': -0.10,
            }
            const batteryImpact = BATTERY_IMPACT[battery] ?? 0
            if (batteryImpact !== 0) {
                estimatedPrice *= (1 + batteryImpact)
                factors.push({
                    name_th: `🔋 แบตเตอรี่: ${battery}`,
                    name_en: `🔋 Battery: ${battery}`,
                    impact: batteryImpact >= 0 ? 'neutral' : 'negative',
                    percentage: Math.round(batteryImpact * 100),
                    icon: '🔋'
                })
            }
        }

        // Screen Condition
        const screen = (formData['screen'] as string) || ''
        if (screen) {
            const SCREEN_IMPACT: Record<string, number> = {
                'perfect': 0,
                'minor_scratches': -0.05,
                'noticeable_scratches': -0.15,
                'screen_burn': -0.25,
                'cracked': -0.50,
            }
            const screenImpact = SCREEN_IMPACT[screen] ?? 0
            if (screenImpact !== 0) {
                estimatedPrice *= (1 + screenImpact)
                factors.push({
                    name_th: `📱 หน้าจอ: ${screen === 'cracked' ? 'แตก/ร้าว' : screen}`,
                    name_en: `📱 Screen: ${screen}`,
                    impact: screenImpact >= 0 ? 'neutral' : 'negative',
                    percentage: Math.round(screenImpact * 100),
                    icon: '📱'
                })
            }
        }

        // Warranty
        const warranty = (formData['warranty'] as string) || ''
        if (warranty) {
            const WARRANTY_IMPACT: Record<string, number> = {
                'more_1y': 0.08,
                '6_12m': 0.05,
                '3_6m': 0.02,
                'less_3m': 0.01,
                'expired': 0,
                'unknown': 0,
            }
            const warrantyImpact = WARRANTY_IMPACT[warranty] ?? 0
            if (warrantyImpact > 0) {
                estimatedPrice *= (1 + warrantyImpact)
                factors.push({
                    name_th: `🛡️ ประกัน: ${warranty}`,
                    name_en: `🛡️ Warranty: ${warranty}`,
                    impact: 'positive',
                    percentage: Math.round(warrantyImpact * 100),
                    icon: '🛡️'
                })
            }
        }

        // Usage Age
        const usageAge = (formData['usage_age'] as string) || ''
        if (usageAge) {
            const USAGE_IMPACT: Record<string, number> = {
                'new': 0,
                'less_3m': -0.02,
                '3_6m': -0.05,
                '6_12m': -0.10,
                '1_2y': -0.15,
                '2_3y': -0.25,
                '3_5y': -0.40,
                'more_5y': -0.60,
            }
            const usageImpact = USAGE_IMPACT[usageAge] ?? 0
            if (usageImpact !== 0) {
                estimatedPrice *= (1 + usageImpact)
                factors.push({
                    name_th: `📅 อายุการใช้งาน: ${usageAge}`,
                    name_en: `📅 Usage: ${usageAge}`,
                    impact: usageImpact >= 0 ? 'neutral' : 'negative',
                    percentage: Math.round(usageImpact * 100),
                    icon: '📅'
                })
            }
        }

        // Defects (multiselect)
        const defects = formData['defects']
        if (defects && Array.isArray(defects) && defects.length > 0 && !defects.includes('none')) {
            // Each defect reduces value
            const defectCount = defects.length
            const defectImpact = -0.05 * defectCount // -5% per defect
            estimatedPrice *= (1 + defectImpact)
            factors.push({
                name_th: `⚠️ ตำหนิ: ${defects.join(', ')}`,
                name_en: `⚠️ Defects: ${defects.join(', ')}`,
                impact: 'negative',
                percentage: Math.round(defectImpact * 100),
                icon: '⚠️'
            })
        }
    }

    // ============================================
    // 3.6. CAMERA-SPECIFIC FACTORS (Category 8)
    // ============================================
    if (categoryId === 8) {
        // Camera Brand Impact
        const cameraBrand = (specs['brand'] || (formData['brand'] as string) || '').toLowerCase()
        if (cameraBrand) {
            const CAMERA_BRAND_IMPACT: Record<string, number> = {
                // Premium
                'leica': 0.25,          // Leica +25% (holds value!)
                'hasselblad': 0.20,     // Hasselblad +20%
                'phase one': 0.15,
                // Pro-tier
                'sony': 0.05,           // Sony (leading mirrorless)
                'canon': 0,             // Canon (baseline)
                'nikon': 0,             // Nikon (baseline)
                'fujifilm': 0.03,       // Fuji (X-series popular)
                'fuji': 0.03,
                // Mid-tier
                'panasonic': -0.05,
                'lumix': -0.05,
                'olympus': -0.10,       // Olympus leaving market
                'om system': -0.08,
                // Action/Compact
                'gopro': 0,
                'dji': 0.05,            // DJI +5%
                'insta360': 0,
            }
            // Find matching brand
            let brandImpact = 0
            for (const [brand, impact] of Object.entries(CAMERA_BRAND_IMPACT)) {
                if (cameraBrand.includes(brand)) {
                    brandImpact = impact
                    break
                }
            }
            if (brandImpact !== 0) {
                estimatedPrice *= (1 + brandImpact)
                factors.push({
                    name_th: `📷 แบรนด์: ${specs['brand'] || formData['brand']}`,
                    name_en: `📷 Brand: ${specs['brand'] || formData['brand']}`,
                    impact: brandImpact >= 0 ? 'positive' : 'negative',
                    percentage: Math.round(brandImpact * 100),
                    icon: brandImpact >= 0 ? '🏆' : '📷'
                })
            }
        }

        // Sensor Size
        const sensor = (formData['sensor'] as string) || ''
        if (sensor) {
            const SENSOR_IMPACT: Record<string, number> = {
                'fullframe': 0.15,      // Full Frame +15%
                'full_frame': 0.15,
                'apsc': 0,              // APS-C (baseline)
                'aps-c': 0,
                'mft': -0.10,           // Micro 4/3 -10%
                'micro43': -0.10,
                '1inch': -0.15,         // 1-inch -15%
                'compact': -0.20,       // Compact sensor -20%
            }
            const sensorImpact = SENSOR_IMPACT[sensor] ?? 0
            if (sensorImpact !== 0) {
                estimatedPrice *= (1 + sensorImpact)
                factors.push({
                    name_th: `📐 เซนเซอร์: ${sensor === 'fullframe' ? 'Full Frame' : sensor.toUpperCase()}`,
                    name_en: `📐 Sensor: ${sensor === 'fullframe' ? 'Full Frame' : sensor.toUpperCase()}`,
                    impact: sensorImpact >= 0 ? 'positive' : 'negative',
                    percentage: Math.round(sensorImpact * 100),
                    icon: sensorImpact >= 0 ? '📐' : '📷'
                })
            }
        }

        // Camera Type
        const cameraType = (formData['type'] as string) || ''
        if (cameraType) {
            const TYPE_IMPACT: Record<string, number> = {
                'mirrorless': 0.08,     // Mirrorless +8% (modern)
                'dslr': 0,              // DSLR (baseline)
                'compact': -0.15,       // Compact -15%
                'action': 0,            // Action Camera
                'film': 0.05,           // Film (collector value) +5%
            }
            const typeImpact = TYPE_IMPACT[cameraType] ?? 0
            if (typeImpact !== 0) {
                estimatedPrice *= (1 + typeImpact)
                factors.push({
                    name_th: `📸 ประเภท: ${cameraType === 'mirrorless' ? 'Mirrorless' : cameraType}`,
                    name_en: `📸 Type: ${cameraType}`,
                    impact: typeImpact >= 0 ? 'positive' : 'negative',
                    percentage: Math.round(typeImpact * 100),
                    icon: '📸'
                })
            }
        }

        // Body Only vs With Lens
        const includedItems = formData['included_items']
        if (includedItems && Array.isArray(includedItems)) {
            const hasLens = includedItems.includes('lens')
            const bodyOnly = !hasLens && includedItems.includes('body')

            if (hasLens) {
                const lensImpact = 0.15  // With Lens +15%
                estimatedPrice *= (1 + lensImpact)
                factors.push({
                    name_th: `🔭 พร้อมเลนส์`,
                    name_en: `🔭 With Lens`,
                    impact: 'positive',
                    percentage: Math.round(lensImpact * 100),
                    icon: '🔭'
                })
            } else if (bodyOnly) {
                const bodyImpact = -0.10  // Body Only -10%
                estimatedPrice *= (1 + bodyImpact)
                factors.push({
                    name_th: `📷 Body Only`,
                    name_en: `📷 Body Only`,
                    impact: 'negative',
                    percentage: Math.round(bodyImpact * 100),
                    icon: '📷'
                })
            }
        }

        // Shutter Count
        const shutterCount = (formData['shutter_count'] as string) || ''
        if (shutterCount) {
            const SHUTTER_IMPACT: Record<string, number> = {
                'under_5k': 0.05,
                '5k_20k': 0,
                '20k_50k': -0.08,
                '50k_100k': -0.18,
                'over_100k': -0.30,
                'unknown': -0.10,
            }
            const shutterImpact = SHUTTER_IMPACT[shutterCount] ?? 0
            if (shutterImpact !== 0) {
                estimatedPrice *= (1 + shutterImpact)
                factors.push({
                    name_th: `📷 ชัตเตอร์: ${shutterCount}`,
                    name_en: `📷 Shutter: ${shutterCount}`,
                    impact: shutterImpact >= 0 ? 'positive' : 'negative',
                    percentage: Math.round(shutterImpact * 100),
                    icon: '📷'
                })
            }
        }

        // Sensor Dust
        const sensorDust = (formData['sensor_dust'] as string) || ''
        if (sensorDust) {
            const DUST_IMPACT: Record<string, number> = {
                'clean': 0,
                'minor': -0.03,
                'visible': -0.10,
                'needs_cleaning': -0.15,
                'unknown': -0.05,
            }
            const dustImpact = DUST_IMPACT[sensorDust] ?? 0
            if (dustImpact !== 0) {
                estimatedPrice *= (1 + dustImpact)
                factors.push({
                    name_th: `🧹 ฝุ่นเซนเซอร์: ${sensorDust}`,
                    name_en: `🧹 Sensor: ${sensorDust}`,
                    impact: 'negative',
                    percentage: Math.round(dustImpact * 100),
                    icon: '🧹'
                })
            }
        }

        // Warranty for Camera
        const cameraWarranty = (formData['warranty'] as string) || ''
        if (cameraWarranty) {
            const WARRANTY_IMPACT: Record<string, number> = {
                'more_1y': 0.08,
                '6_12m': 0.05,
                '3_6m': 0.02,
                'less_3m': 0,
                'expired': 0,
            }
            const warrantyImpact = WARRANTY_IMPACT[cameraWarranty] ?? 0
            if (warrantyImpact > 0) {
                estimatedPrice *= (1 + warrantyImpact)
                factors.push({
                    name_th: `🛡️ ประกัน: ${cameraWarranty}`,
                    name_en: `🛡️ Warranty: ${cameraWarranty}`,
                    impact: 'positive',
                    percentage: Math.round(warrantyImpact * 100),
                    icon: '🛡️'
                })
            }
        }
    }

    // ============================================
    // 3.7. APPLIANCES-SPECIFIC FACTORS (Category 5)
    // ============================================
    if (categoryId === 5) {
        // Appliance Brand Impact
        const appBrand = (specs['brand'] || (formData['brand'] as string) || '').toLowerCase()
        if (appBrand) {
            const APPLIANCE_BRAND_IMPACT: Record<string, number> = {
                // Premium Brands
                'dyson': 0.12,          // Dyson +12%
                'miele': 0.10,          // Miele +10%
                'bosch': 0.08,          // Bosch +8%
                'electrolux': 0.05,     // Electrolux +5%
                // Japanese Premium
                'daikin': 0.08,         // Daikin +8% (best AC)
                'mitsubishi': 0.05,
                'hitachi': 0.05,
                'panasonic': 0.03,
                'sharp': 0.03,
                'toshiba': 0,
                // Korean
                'samsung': 0,           // Samsung (baseline)
                'lg': 0,
                // Thai/Chinese
                'haier': -0.08,
                'midea': -0.08,
                'hisense': -0.05,
                'tcl': -0.05,
                'hatari': -0.05,        // Hatari fans
                'carrier': 0,           // Carrier AC
                'other': -0.15,
            }
            // Find matching brand
            let brandImpact = 0
            for (const [brand, impact] of Object.entries(APPLIANCE_BRAND_IMPACT)) {
                if (appBrand.includes(brand)) {
                    brandImpact = impact
                    break
                }
            }
            if (brandImpact !== 0) {
                estimatedPrice *= (1 + brandImpact)
                factors.push({
                    name_th: `🏭 แบรนด์: ${specs['brand'] || formData['brand']}`,
                    name_en: `🏭 Brand: ${specs['brand'] || formData['brand']}`,
                    impact: brandImpact >= 0 ? 'positive' : 'negative',
                    percentage: Math.round(brandImpact * 100),
                    icon: brandImpact >= 0 ? '🏆' : '🏭'
                })
            }
        }

        // Inverter Technology (for AC, Refrigerator, Washing Machine)
        const inverter = (specs['inverter'] || (formData['inverter'] as string) || '').toLowerCase()
        if (inverter === 'yes' || inverter === 'ใช่' || inverter === 'inverter') {
            const inverterImpact = 0.08  // Inverter +8%
            estimatedPrice *= (1 + inverterImpact)
            factors.push({
                name_th: `⚡ Inverter Technology`,
                name_en: `⚡ Inverter Technology`,
                impact: 'positive',
                percentage: Math.round(inverterImpact * 100),
                icon: '⚡'
            })
        }

        // BTU/Capacity for AC
        const btu = (specs['btu'] || (formData['btu'] as string) || '')
        if (btu) {
            let btuImpact = 0
            const btuNum = parseInt(btu.replace(/[^\d]/g, ''))
            if (btuNum >= 24000) {
                btuImpact = 0.10  // Large AC +10%
            } else if (btuNum >= 18000) {
                btuImpact = 0.05  // Medium AC +5%
            } else if (btuNum >= 12000) {
                btuImpact = 0     // Standard (baseline)
            } else if (btuNum < 12000) {
                btuImpact = -0.05  // Small AC -5%
            }
            if (btuImpact !== 0) {
                estimatedPrice *= (1 + btuImpact)
                factors.push({
                    name_th: `❄️ BTU: ${btu}`,
                    name_en: `❄️ BTU: ${btu}`,
                    impact: btuImpact >= 0 ? 'positive' : 'negative',
                    percentage: Math.round(btuImpact * 100),
                    icon: '❄️'
                })
            }
        }

        // Screen Size for TV
        const screenSize = (specs['screen_size'] || (formData['screen_size'] as string) || specs['size'] || '')
        if (screenSize && (subcategoryId === 504 || screenSize.includes('นิ้ว') || screenSize.includes('inch'))) {
            const sizeNum = parseInt(screenSize.replace(/[^\d]/g, ''))
            let sizeImpact = 0
            if (sizeNum >= 75) {
                sizeImpact = 0.15  // 75"+ TV +15%
            } else if (sizeNum >= 65) {
                sizeImpact = 0.10  // 65" TV +10%
            } else if (sizeNum >= 55) {
                sizeImpact = 0.05  // 55" TV +5%
            } else if (sizeNum >= 43) {
                sizeImpact = 0     // 43" (baseline)
            } else if (sizeNum < 43) {
                sizeImpact = -0.08  // Small TV -8%
            }
            if (sizeImpact !== 0) {
                estimatedPrice *= (1 + sizeImpact)
                factors.push({
                    name_th: `📺 ขนาดจอ: ${sizeNum} นิ้ว`,
                    name_en: `📺 Screen: ${sizeNum}"`,
                    impact: sizeImpact >= 0 ? 'positive' : 'negative',
                    percentage: Math.round(sizeImpact * 100),
                    icon: '📺'
                })
            }
        }

        // Capacity for Washing Machine (KG)
        const capacity = (specs['capacity'] || (formData['capacity'] as string) || specs['capacity_kg'] || '')
        if (capacity && (subcategoryId === 503 || capacity.includes('kg') || capacity.includes('กก'))) {
            const kgNum = parseFloat(capacity.replace(/[^\d.]/g, ''))
            let kgImpact = 0
            if (kgNum >= 15) {
                kgImpact = 0.12  // 15kg+ +12%
            } else if (kgNum >= 12) {
                kgImpact = 0.08  // 12kg +8%
            } else if (kgNum >= 9) {
                kgImpact = 0.03  // 9kg +3%
            } else if (kgNum >= 7) {
                kgImpact = 0     // 7kg (baseline)
            } else if (kgNum < 7) {
                kgImpact = -0.05  // Small capacity -5%
            }
            if (kgImpact !== 0) {
                estimatedPrice *= (1 + kgImpact)
                factors.push({
                    name_th: `🧺 ความจุ: ${kgNum} กก.`,
                    name_en: `🧺 Capacity: ${kgNum}kg`,
                    impact: kgImpact >= 0 ? 'positive' : 'negative',
                    percentage: Math.round(kgImpact * 100),
                    icon: '🧺'
                })
            }
        }

        // Defects (specific to appliances)
        const appDefects = formData['defects']
        if (appDefects && Array.isArray(appDefects) && appDefects.length > 0 && !appDefects.includes('none')) {
            // Check for serious defects
            const seriousDefects = ['cooling_issue', 'heating_issue', 'leak', 'not_working']
            const hasSeriousDefect = appDefects.some(d => seriousDefects.includes(d))

            let defectImpact = hasSeriousDefect ? -0.20 : -0.05 * appDefects.length
            defectImpact = Math.max(defectImpact, -0.40) // Cap at -40%

            estimatedPrice *= (1 + defectImpact)
            factors.push({
                name_th: `⚠️ ตำหนิ: ${appDefects.join(', ')}`,
                name_en: `⚠️ Defects: ${appDefects.join(', ')}`,
                impact: 'negative',
                percentage: Math.round(defectImpact * 100),
                icon: '⚠️'
            })
        }

        // Energy Rating
        const energy = (formData['energy'] as string) || (specs['energy'] as string) || ''
        if (energy) {
            const ENERGY_IMPACT: Record<string, number> = {
                'เบอร์ 5': 0.08,
                'เบอร์ 4': 0.04,
                'เบอร์ 3': 0,
                'ไม่มีฉลาก': -0.05,
            }
            const energyImpact = ENERGY_IMPACT[energy] ?? 0
            if (energyImpact !== 0) {
                estimatedPrice *= (1 + energyImpact)
                factors.push({
                    name_th: `⚡ ฉลากประหยัดไฟ: ${energy}`,
                    name_en: `⚡ Energy: ${energy}`,
                    impact: energyImpact >= 0 ? 'positive' : 'negative',
                    percentage: Math.round(energyImpact * 100),
                    icon: '⚡'
                })
            }
        }

        // Warranty for Appliances
        const appWarranty = (formData['warranty'] as string) || ''
        if (appWarranty) {
            const WARRANTY_IMPACT: Record<string, number> = {
                'more_1y': 0.10,    // More than 1 year +10%
                '6_12m': 0.05,      // 6-12 months +5%
                '3_6m': 0.02,       // 3-6 months +2%
                'less_3m': 0,
                'expired': 0,
                'unknown': 0,
            }
            const warrantyImpact = WARRANTY_IMPACT[appWarranty] ?? 0
            if (warrantyImpact > 0) {
                estimatedPrice *= (1 + warrantyImpact)
                factors.push({
                    name_th: `🛡️ ประกัน: ${appWarranty}`,
                    name_en: `🛡️ Warranty: ${appWarranty}`,
                    impact: 'positive',
                    percentage: Math.round(warrantyImpact * 100),
                    icon: '🛡️'
                })
            }
        }
    }

    // ============================================
    // 3.8. FASHION-SPECIFIC FACTORS (Category 6)
    // ============================================
    if (categoryId === 6) {
        // Fashion Brand Impact (CRITICAL for brandname bags/watches)
        const fashionBrand = (specs['brand'] || (formData['brand'] as string) || '').toLowerCase()
        if (fashionBrand) {
            // Luxury Tier S (Hermès, Patek Philippe)
            const LUXURY_S_BRANDS = ['hermes', 'hermès', 'birkin', 'kelly', 'patek philippe', 'patek', 'richard mille']
            // Luxury Tier A (Chanel, Rolex, LV)
            const LUXURY_A_BRANDS = ['chanel', 'rolex', 'louis vuitton', 'lv', 'cartier', 'audemars piguet', 'vacheron']
            // Luxury Tier B
            const LUXURY_B_BRANDS = ['gucci', 'dior', 'prada', 'celine', 'céline', 'bottega', 'balenciaga', 'omega', 'tag heuer', 'iwc', 'jaeger']
            // Premium Tier
            const PREMIUM_BRANDS = ['burberry', 'fendi', 'goyard', 'ysl', 'saint laurent', 'valentino', 'longchamp', 'coach', 'tissot', 'tudor', 'longines', 'seiko presage']
            // Streetwear/Sneakers
            const STREETWEAR_BRANDS = ['supreme', 'off-white', 'bape', 'fear of god', 'nike dunk', 'jordan', 'air jordan', 'yeezy', 'travis scott']
            // Mass Market
            const MASS_BRANDS = ['zara', 'h&m', 'uniqlo', 'muji', 'pull&bear', 'cotton on']

            let brandImpact = 0
            let brandTier = ''

            for (const brand of LUXURY_S_BRANDS) {
                if (fashionBrand.includes(brand)) {
                    brandImpact = 0.40  // +40% for S-tier
                    brandTier = 'Luxury S'
                    break
                }
            }
            if (brandImpact === 0) {
                for (const brand of LUXURY_A_BRANDS) {
                    if (fashionBrand.includes(brand)) {
                        brandImpact = 0.30  // +30% for A-tier
                        brandTier = 'Luxury A'
                        break
                    }
                }
            }
            if (brandImpact === 0) {
                for (const brand of LUXURY_B_BRANDS) {
                    if (fashionBrand.includes(brand)) {
                        brandImpact = 0.20  // +20% for B-tier
                        brandTier = 'Luxury B'
                        break
                    }
                }
            }
            if (brandImpact === 0) {
                for (const brand of PREMIUM_BRANDS) {
                    if (fashionBrand.includes(brand)) {
                        brandImpact = 0.10  // +10% for Premium
                        brandTier = 'Premium'
                        break
                    }
                }
            }
            if (brandImpact === 0) {
                for (const brand of STREETWEAR_BRANDS) {
                    if (fashionBrand.includes(brand)) {
                        brandImpact = 0.15  // +15% for hyped streetwear
                        brandTier = 'Streetwear'
                        break
                    }
                }
            }
            if (brandImpact === 0) {
                for (const brand of MASS_BRANDS) {
                    if (fashionBrand.includes(brand)) {
                        brandImpact = -0.15  // -15% for mass market
                        brandTier = 'Fast Fashion'
                        break
                    }
                }
            }

            if (brandImpact !== 0) {
                estimatedPrice *= (1 + brandImpact)
                factors.push({
                    name_th: `👜 แบรนด์: ${specs['brand'] || formData['brand']} (${brandTier})`,
                    name_en: `👜 Brand: ${specs['brand'] || formData['brand']} (${brandTier})`,
                    impact: brandImpact >= 0 ? 'positive' : 'negative',
                    percentage: Math.round(brandImpact * 100),
                    icon: brandImpact >= 0 ? '💎' : '👕'
                })
            }
        }

        // Authenticity Documentation (for luxury items)
        const authenticity = (formData['authenticity'] as string) || (formData['receipt'] as string) || ''
        if (authenticity && (subcategoryId === 603 || subcategoryId === 605 || subcategoryId === 606)) {
            const AUTH_IMPACT: Record<string, number> = {
                'with_receipt': 0.15,       // มีใบเสร็จ +15%
                'with_card': 0.12,          // มี authenticity card +12%
                'with_box': 0.08,           // มีกล่อง +8%
                'both': 0.18,               // มีใบเสร็จ+กล่อง +18%
                'complete': 0.20,           // ครบ (ใบเสร็จ+กล่อง+การ์ด) +20%
                'none': -0.10,              // ไม่มีหลักฐาน -10%
            }
            const authImpact = AUTH_IMPACT[authenticity] ?? 0
            if (authImpact !== 0) {
                estimatedPrice *= (1 + authImpact)
                factors.push({
                    name_th: `📜 หลักฐานความแท้: ${authenticity === 'complete' ? 'ครบ' : authenticity}`,
                    name_en: `📜 Authenticity: ${authenticity}`,
                    impact: authImpact >= 0 ? 'positive' : 'negative',
                    percentage: Math.round(authImpact * 100),
                    icon: authImpact >= 0 ? '✅' : '❓'
                })
            }
        }

        // Washed/Usage for Clothing
        const washed = (formData['washed'] as string) || ''
        if (washed && (subcategoryId === 601 || subcategoryId === 602 || subcategoryId === 608)) {
            const WASH_IMPACT: Record<string, number> = {
                'never': 0.05,          // ป้ายติด +5%
                '1-3': 0,               // 1-3 ครั้ง (baseline)
                '4-10': -0.08,          // 4-10 ครั้ง -8%
                'many': -0.15,          // มากกว่า 10 ครั้ง -15%
            }
            const washImpact = WASH_IMPACT[washed] ?? 0
            if (washImpact !== 0) {
                estimatedPrice *= (1 + washImpact)
                factors.push({
                    name_th: `🧺 ซักแล้ว: ${washed === 'never' ? 'ยังไม่เคย' : washed}`,
                    name_en: `🧺 Washed: ${washed}`,
                    impact: washImpact >= 0 ? 'positive' : 'negative',
                    percentage: Math.round(washImpact * 100),
                    icon: washImpact >= 0 ? '✨' : '🧺'
                })
            }
        }

        // Limited Edition / Rare (for Sneakers, Bags)
        const limited = (formData['limited_edition'] as string) || (formData['rare'] as string) || ''
        if (limited === 'yes' || limited === 'limited' || limited === 'rare') {
            const limitedImpact = 0.25  // Limited Edition +25%
            estimatedPrice *= (1 + limitedImpact)
            factors.push({
                name_th: `🔥 Limited Edition / หายาก`,
                name_en: `🔥 Limited Edition / Rare`,
                impact: 'positive',
                percentage: Math.round(limitedImpact * 100),
                icon: '🔥'
            })
        }

        // Watch-specific: Movement type
        if (subcategoryId === 605) {
            const movement = (formData['movement'] as string) || ''
            if (movement) {
                const MOVEMENT_IMPACT: Record<string, number> = {
                    'automatic': 0.10,      // Automatic +10%
                    'mechanical': 0.08,     // Manual wind +8%
                    'quartz': 0,            // Quartz (baseline)
                    'solar': 0.03,          // Solar +3%
                    'smart': -0.05,         // Smart watch -5% (tech depreciates)
                }
                const moveImpact = MOVEMENT_IMPACT[movement] ?? 0
                if (moveImpact !== 0) {
                    estimatedPrice *= (1 + moveImpact)
                    factors.push({
                        name_th: `⚙️ ระบบ: ${movement === 'automatic' ? 'ออโตเมติก' : movement}`,
                        name_en: `⚙️ Movement: ${movement}`,
                        impact: moveImpact >= 0 ? 'positive' : 'negative',
                        percentage: Math.round(moveImpact * 100),
                        icon: '⚙️'
                    })
                }
            }
        }

        // Fashion Defects
        const fashionDefects = formData['defects']
        if (fashionDefects && Array.isArray(fashionDefects) && fashionDefects.length > 0 && !fashionDefects.includes('none')) {
            // Serious fashion defects
            const seriousDefects = ['tear', 'stain', 'faded', 'zipper_issue']
            const hasSeriousDefect = fashionDefects.some(d => seriousDefects.includes(d))

            let defectImpact = hasSeriousDefect ? -0.20 : -0.05 * fashionDefects.length
            defectImpact = Math.max(defectImpact, -0.35) // Cap at -35%

            estimatedPrice *= (1 + defectImpact)
            factors.push({
                name_th: `⚠️ ตำหนิ: ${fashionDefects.join(', ')}`,
                name_en: `⚠️ Defects: ${fashionDefects.join(', ')}`,
                impact: 'negative',
                percentage: Math.round(defectImpact * 100),
                icon: '⚠️'
            })
        }
    }

    // ============================================
    // 3.9. GAMING-SPECIFIC FACTORS (Category 7)
    // ============================================
    if (categoryId === 7) {
        // Console Model Impact
        const model = (specs['model'] || (formData['model'] as string) || '').toLowerCase()
        if (model && subcategoryId === 701) {
            const CONSOLE_MODEL_IMPACT: Record<string, number> = {
                // PlayStation
                'ps5': 0,
                'ps5 digital': -0.10,       // PS5 Digital -10%
                'ps4 pro': -0.40,           // PS4 Pro -40%
                'ps4': -0.50,               // PS4 -50%
                'ps4 slim': -0.45,
                'ps3': -0.80,               // PS3 -80%
                // Xbox
                'xbox series x': 0,
                'xbox series s': -0.15,     // Xbox Series S -15%
                'xbox one x': -0.45,
                'xbox one': -0.55,
                // Nintendo
                'switch oled': 0,
                'nintendo switch oled': 0,
                'switch': -0.15,            // Switch original -15%
                'nintendo switch': -0.15,
                'switch lite': -0.25,       // Switch Lite -25%
                'nintendo switch lite': -0.25,
                '3ds': -0.60,
                // Retro
                'ps2': -0.90,
                'ps1': -0.85,               // Retro collector value
                'gamecube': -0.70,
            }
            // Find matching model
            let modelImpact = 0
            let modelLabel = model
            for (const [consoleModel, impact] of Object.entries(CONSOLE_MODEL_IMPACT)) {
                if (model.includes(consoleModel)) {
                    modelImpact = impact
                    modelLabel = consoleModel.toUpperCase()
                    break
                }
            }
            if (modelImpact !== 0) {
                estimatedPrice *= (1 + modelImpact)
                factors.push({
                    name_th: `🎮 รุ่น: ${modelLabel}`,
                    name_en: `🎮 Model: ${modelLabel}`,
                    impact: modelImpact >= 0 ? 'positive' : 'negative',
                    percentage: Math.round(modelImpact * 100),
                    icon: '🎮'
                })
            }
        }

        // Limited/Special Edition
        const edition = (formData['edition'] as string) || ''
        if (edition) {
            let editionImpact = 0
            if (edition === 'limited' || edition === 'special' || edition === 'collector') {
                editionImpact = 0.15  // Limited Edition +15%
            } else if (edition === 'bundle') {
                editionImpact = 0.05  // Bundle +5%
            }
            if (editionImpact > 0) {
                estimatedPrice *= (1 + editionImpact)
                factors.push({
                    name_th: `🔥 รุ่นพิเศษ: ${edition}`,
                    name_en: `🔥 Edition: ${edition}`,
                    impact: 'positive',
                    percentage: Math.round(editionImpact * 100),
                    icon: '🔥'
                })
            }
        }

        // Storage Capacity (for consoles)
        const storage = (specs['storage'] || (formData['storage'] as string) || '').toLowerCase()
        if (storage) {
            const STORAGE_IMPACT: Record<string, number> = {
                '500gb': -0.10,     // 500GB -10%
                '825gb': 0,         // PS5 standard
                '1tb': 0,           // 1TB (baseline)
                '2tb': 0.08,        // 2TB +8%
            }
            const storageImpact = STORAGE_IMPACT[storage] ?? 0
            if (storageImpact !== 0) {
                estimatedPrice *= (1 + storageImpact)
                factors.push({
                    name_th: `💾 ความจุ: ${storage.toUpperCase()}`,
                    name_en: `💾 Storage: ${storage.toUpperCase()}`,
                    impact: storageImpact >= 0 ? 'positive' : 'negative',
                    percentage: Math.round(storageImpact * 100),
                    icon: '💾'
                })
            }
        }

        // Modded/Jailbroken (NEGATIVE!)
        const modded = (formData['modded'] as string) || (formData['jailbroken'] as string) || ''
        if (modded === 'yes' || modded === 'modded' || modded === 'jailbroken') {
            const moddedImpact = -0.20  // Modded -20% (warranty void, risk)
            estimatedPrice *= (1 + moddedImpact)
            factors.push({
                name_th: `🔧 แปลงเครื่อง/Mod`,
                name_en: `🔧 Modded/Jailbroken`,
                impact: 'negative',
                percentage: Math.round(moddedImpact * 100),
                icon: '🔧'
            })
        }

        // Controllers Included
        const controllers = parseInt((formData['controllers'] as string) || '1')
        if (controllers > 1) {
            const controllerImpact = 0.03 * (controllers - 1)  // +3% per extra controller
            estimatedPrice *= (1 + controllerImpact)
            factors.push({
                name_th: `🕹️ จอย: ${controllers} ตัว`,
                name_en: `🕹️ Controllers: ${controllers}`,
                impact: 'positive',
                percentage: Math.round(controllerImpact * 100),
                icon: '🕹️'
            })
        }

        // Gaming Defects
        const gamingDefects = formData['defects']
        if (gamingDefects && Array.isArray(gamingDefects) && gamingDefects.length > 0 && !gamingDefects.includes('none')) {
            // Serious gaming defects
            const seriousDefects = ['controller_drift', 'overheating', 'disc_issue', 'hdmi_issue']
            const hasSeriousDefect = gamingDefects.some(d => seriousDefects.includes(d))

            let defectImpact = 0
            if (gamingDefects.includes('controller_drift')) {
                defectImpact -= 0.15  // Drift -15%
            }
            if (gamingDefects.includes('overheating')) {
                defectImpact -= 0.20  // Overheating -20%
            }
            if (gamingDefects.includes('disc_issue')) {
                defectImpact -= 0.15  // Disc issue -15%
            }
            if (gamingDefects.includes('hdmi_issue')) {
                defectImpact -= 0.12  // HDMI -12%
            }
            if (!hasSeriousDefect) {
                defectImpact = -0.05 * gamingDefects.length
            }
            defectImpact = Math.max(defectImpact, -0.40) // Cap at -40%

            if (defectImpact !== 0) {
                estimatedPrice *= (1 + defectImpact)
                factors.push({
                    name_th: `⚠️ ตำหนิ: ${gamingDefects.join(', ')}`,
                    name_en: `⚠️ Defects: ${gamingDefects.join(', ')}`,
                    impact: 'negative',
                    percentage: Math.round(defectImpact * 100),
                    icon: '⚠️'
                })
            }
        }

        // Warranty for Gaming
        const gamingWarranty = (formData['warranty'] as string) || ''
        if (gamingWarranty) {
            const WARRANTY_IMPACT: Record<string, number> = {
                'more_1y': 0.08,
                '6_12m': 0.05,
                '3_6m': 0.02,
                'less_3m': 0,
                'expired': 0,
            }
            const warrantyImpact = WARRANTY_IMPACT[gamingWarranty] ?? 0
            if (warrantyImpact > 0) {
                estimatedPrice *= (1 + warrantyImpact)
                factors.push({
                    name_th: `🛡️ ประกัน: ${gamingWarranty}`,
                    name_en: `🛡️ Warranty: ${gamingWarranty}`,
                    impact: 'positive',
                    percentage: Math.round(warrantyImpact * 100),
                    icon: '🛡️'
                })
            }
        }
    }

    // ============================================
    // 3.10. AMULET-SPECIFIC FACTORS (Category 9)
    // ============================================
    if (categoryId === 9) {
        // Certificate/Authentication (CRITICAL for amulets!)
        const certificate = (formData['certificate'] as string) || ''
        if (certificate) {
            const CERT_IMPACT: Record<string, number> = {
                'samakom': 0.30,        // สมาคมพระเครื่อง +30%
                'dd_phra': 0.25,        // DD-Phra +25%
                'g_phra': 0.20,         // G-Phra +20%
                'temple': 0.15,         // ใบจากวัด +15%
                'none': -0.15,          // ไม่มีใบ -15%
            }
            const certImpact = CERT_IMPACT[certificate] ?? 0
            if (certImpact !== 0) {
                estimatedPrice *= (1 + certImpact)
                factors.push({
                    name_th: `📜 ใบรับรอง: ${certificate === 'samakom' ? 'สมาคมพระเครื่อง' : certificate}`,
                    name_en: `📜 Certificate: ${certificate}`,
                    impact: certImpact >= 0 ? 'positive' : 'negative',
                    percentage: Math.round(certImpact * 100),
                    icon: certImpact >= 0 ? '🏆' : '❓'
                })
            }
        }

        // Amulet Condition (Very important for Thai amulets)
        const amuletCondition = (formData['amulet_condition'] as string) || ''
        if (amuletCondition) {
            const CONDITION_IMPACT: Record<string, number> = {
                'perfect': 0.25,        // สวยแชมป์ +25%
                'excellent': 0.15,      // สวยมาก +15%
                'good': 0,              // สวยพอใช้ (baseline)
                'fair': -0.20,          // มีตำหนิ -20%
            }
            const condImpact = CONDITION_IMPACT[amuletCondition] ?? 0
            if (condImpact !== 0) {
                estimatedPrice *= (1 + condImpact)
                factors.push({
                    name_th: `✨ สภาพ: ${amuletCondition === 'perfect' ? 'สวยแชมป์' : amuletCondition}`,
                    name_en: `✨ Condition: ${amuletCondition}`,
                    impact: condImpact >= 0 ? 'positive' : 'negative',
                    percentage: Math.round(condImpact * 100),
                    icon: condImpact >= 0 ? '✨' : '⚠️'
                })
            }
        }

        // Amulet Year (Older = More Valuable)
        const amuletYear = (formData['amulet_year'] as string) || ''
        if (amuletYear) {
            const yearNum = parseInt(amuletYear.replace(/[^\d]/g, ''))
            let yearImpact = 0
            let yearLabel = amuletYear

            if (yearNum && yearNum > 2000) {
                // Buddhist Era (BE)
                if (yearNum <= 2500) {
                    yearImpact = 0.50       // ก่อน พ.ศ. 2500 +50%
                    yearLabel = 'ก่อน พ.ศ. 2500'
                } else if (yearNum <= 2520) {
                    yearImpact = 0.30       // พ.ศ. 2500-2520 +30%
                    yearLabel = 'พ.ศ. 2500-2520'
                } else if (yearNum <= 2540) {
                    yearImpact = 0.15       // พ.ศ. 2520-2540 +15%
                    yearLabel = 'พ.ศ. 2520-2540'
                } else if (yearNum <= 2560) {
                    yearImpact = 0          // พ.ศ. 2540-2560 (baseline)
                } else {
                    yearImpact = -0.10      // หลัง พ.ศ. 2560 -10%
                    yearLabel = 'หลัง พ.ศ. 2560'
                }
            }
            if (yearImpact !== 0) {
                estimatedPrice *= (1 + yearImpact)
                factors.push({
                    name_th: `📅 ปี: ${yearLabel}`,
                    name_en: `📅 Year: ${yearLabel}`,
                    impact: yearImpact >= 0 ? 'positive' : 'negative',
                    percentage: Math.round(yearImpact * 100),
                    icon: yearImpact >= 0 ? '🏛️' : '📅'
                })
            }
        }

        // Amulet Type
        const amuletType = (formData['amulet_type'] as string) || ''
        if (amuletType) {
            const TYPE_IMPACT: Record<string, number> = {
                'phra_somdej': 0.15,    // พระสมเด็จ +15%
                'phra_krueang': 0.10,   // พระกริ่ง +10%
                'phra_pidta': 0.08,     // พระปิดตา +8%
                'phra_phong': 0,        // พระผง (baseline)
                'phra_rod': 0.05,       // พระรอด +5%
                'phra_nang_phaya': 0.10,// พระนางพญา +10%
                'takrut': -0.10,        // ตะกรุด -10%
                'look_om': -0.05,       // ลูกอม -5%
                'other': 0,
            }
            const typeImpact = TYPE_IMPACT[amuletType] ?? 0
            if (typeImpact !== 0) {
                estimatedPrice *= (1 + typeImpact)
                factors.push({
                    name_th: `🙏 ประเภท: ${amuletType}`,
                    name_en: `🙏 Type: ${amuletType}`,
                    impact: typeImpact >= 0 ? 'positive' : 'negative',
                    percentage: Math.round(typeImpact * 100),
                    icon: '🙏'
                })
            }
        }

        // Competition Awards
        const competition = (formData['competition'] as string) || ''
        if (competition && competition.length > 0) {
            const competitionImpact = 0.20  // มีรางวัลประกวด +20%
            estimatedPrice *= (1 + competitionImpact)
            factors.push({
                name_th: `🏆 รางวัลประกวด`,
                name_en: `🏆 Competition Award`,
                impact: 'positive',
                percentage: Math.round(competitionImpact * 100),
                icon: '🏆'
            })
        }

        // Casing (เลี่ยม)
        const amuletCasing = (formData['casing'] as string) || (formData['frame'] as string) || ''
        if (amuletCasing) {
            const CASING_IMPACT: Record<string, number> = {
                'gold': 0.25,           // เลี่ยมทอง +25%
                'gold_diamond': 0.35,   // ทอง+เพชร +35%
                'silver': 0.10,         // เลี่ยมเงิน +10%
                'stainless': 0,         // สแตนเลส (baseline)
                'plastic': -0.05,       // พลาสติก -5%
                'none': 0,
            }
            const casingImpact = CASING_IMPACT[amuletCasing] ?? 0
            if (casingImpact !== 0) {
                estimatedPrice *= (1 + casingImpact)
                factors.push({
                    name_th: `💛 เลี่ยม: ${amuletCasing === 'gold' ? 'ทอง' : amuletCasing}`,
                    name_en: `💛 Casing: ${amuletCasing}`,
                    impact: casingImpact >= 0 ? 'positive' : 'negative',
                    percentage: Math.round(casingImpact * 100),
                    icon: casingImpact >= 0 ? '💛' : '📿'
                })
            }
        }
    }

    // ============================================
    // 3.11. PETS-SPECIFIC FACTORS (Category 10)
    // ============================================
    if (categoryId === 10) {
        // Breed Tier (for Dogs/Cats)
        const breed = (specs['breed'] || (formData['breed'] as string) || '').toLowerCase()
        if (breed && (subcategoryId === 1001 || subcategoryId === 1002)) {
            // Premium Dog Breeds
            const PREMIUM_DOG_BREEDS = ['french bulldog', 'เฟรนช์บลูด็อก', 'bulldog', 'corgi', 'คอร์กี้', 'shiba', 'ชิบะ', 'pomeranian', 'ปอม', 'golden retriever', 'โกลเด้น', 'husky', 'ฮัสกี้', 'samoyed', 'ซามอยด์', 'chow chow', 'เชาเชา']
            const PREMIUM_CAT_BREEDS = ['scottish fold', 'สก็อตติชโฟลด์', 'british shorthair', 'บริติช', 'persian', 'เปอร์เซีย', 'maine coon', 'เมนคูน', 'ragdoll', 'แร็กดอล', 'exotic', 'เอ็กโซติก', 'bengal', 'เบงกอล', 'sphynx', 'สฟิงซ์']

            const RARE_BREEDS = ['tibetan mastiff', 'ทิเบตัน', 'pharaoh hound', 'อาซาวัก', 'savannah cat', 'caracal']

            let breedImpact = 0
            let breedLabel = breed

            // Check Premium
            for (const b of [...PREMIUM_DOG_BREEDS, ...PREMIUM_CAT_BREEDS]) {
                if (breed.includes(b)) {
                    breedImpact = 0.30  // Premium +30%
                    breedLabel = 'Premium'
                    break
                }
            }
            // Check Rare
            if (breedImpact === 0) {
                for (const b of RARE_BREEDS) {
                    if (breed.includes(b)) {
                        breedImpact = 0.50  // Rare +50%
                        breedLabel = 'Rare'
                        break
                    }
                }
            }
            // Check Mixed
            if (breedImpact === 0 && (breed.includes('mix') || breed.includes('ผสม') || breed.includes('ไทย') || breed.includes('street'))) {
                breedImpact = -0.20  // Mixed -20%
                breedLabel = 'Mixed/ผสม'
            }

            if (breedImpact !== 0) {
                estimatedPrice *= (1 + breedImpact)
                factors.push({
                    name_th: `🐾 สายพันธุ์: ${breedLabel}`,
                    name_en: `🐾 Breed: ${breedLabel}`,
                    impact: breedImpact >= 0 ? 'positive' : 'negative',
                    percentage: Math.round(breedImpact * 100),
                    icon: breedImpact >= 0 ? '🏆' : '🐾'
                })
            }
        }

        // Age
        const age = (formData['age'] as string) || ''
        if (age) {
            let ageImpact = 0
            let ageLabel = age

            const ageNum = parseFloat(age.replace(/[^\d.]/g, ''))
            if (age.includes('เดือน') || age.includes('month')) {
                // Puppy/Kitten (1-6 months)
                if (ageNum >= 2 && ageNum <= 6) {
                    ageImpact = 0.10  // Ideal puppy age +10%
                    ageLabel = '2-6 เดือน'
                }
            } else if (ageNum) {
                // Years
                if (ageNum <= 1) {
                    ageImpact = 0.05  // Under 1 year +5%
                    ageLabel = 'ไม่เกิน 1 ปี'
                } else if (ageNum <= 4) {
                    ageImpact = 0     // Adult 1-4 years (baseline)
                    ageLabel = '1-4 ปี'
                } else if (ageNum <= 7) {
                    ageImpact = -0.10  // Older 5-7 years -10%
                    ageLabel = '5-7 ปี'
                } else {
                    ageImpact = -0.20  // Senior 8+ years -20%
                    ageLabel = '8+ ปี'
                }
            }

            if (ageImpact !== 0) {
                estimatedPrice *= (1 + ageImpact)
                factors.push({
                    name_th: `📅 อายุ: ${ageLabel}`,
                    name_en: `📅 Age: ${ageLabel}`,
                    impact: ageImpact >= 0 ? 'positive' : 'negative',
                    percentage: Math.round(ageImpact * 100),
                    icon: ageImpact >= 0 ? '🐕' : '📅'
                })
            }
        }

        // Vaccination Status
        const vaccinated = (formData['vaccinated'] as string) || ''
        if (vaccinated) {
            const VAX_IMPACT: Record<string, number> = {
                'full': 0.15,           // วัคซีนครบ +15%
                'partial': 0.05,        // ฉีดบางส่วน +5%
                'none': -0.10,          // ยังไม่ฉีด -10%
                'unknown': -0.05,
            }
            const vaxImpact = VAX_IMPACT[vaccinated] ?? 0
            if (vaxImpact !== 0) {
                estimatedPrice *= (1 + vaxImpact)
                factors.push({
                    name_th: `💉 วัคซีน: ${vaccinated === 'full' ? 'ครบ' : vaccinated}`,
                    name_en: `💉 Vaccinated: ${vaccinated}`,
                    impact: vaxImpact >= 0 ? 'positive' : 'negative',
                    percentage: Math.round(vaxImpact * 100),
                    icon: vaxImpact >= 0 ? '💉' : '❓'
                })
            }
        }

        // Pedigree Certificate
        const pedigree = (formData['pedigree'] as string) || ''
        if (pedigree === 'yes' || pedigree === 'มี' || pedigree === 'ใบเพ็ดดิกรี') {
            const pedigreeImpact = 0.25  // มีใบเพ็ดดิกรี +25%
            estimatedPrice *= (1 + pedigreeImpact)
            factors.push({
                name_th: `📜 ใบเพ็ดดิกรี`,
                name_en: `📜 Pedigree Certificate`,
                impact: 'positive',
                percentage: Math.round(pedigreeImpact * 100),
                icon: '📜'
            })
        }

        // Microchip
        const microchip = (formData['microchip'] as string) || ''
        if (microchip === 'yes' || microchip === 'มี') {
            const chipImpact = 0.08  // มีไมโครชิพ +8%
            estimatedPrice *= (1 + chipImpact)
            factors.push({
                name_th: `🔘 ไมโครชิพ`,
                name_en: `🔘 Microchip`,
                impact: 'positive',
                percentage: Math.round(chipImpact * 100),
                icon: '🔘'
            })
        }

        // Health Status
        const health = (formData['health'] as string) || ''
        if (health) {
            const HEALTH_IMPACT: Record<string, number> = {
                'excellent': 0.10,      // สมบูรณ์มาก +10%
                'healthy': 0,           // แข็งแรงดี (baseline)
                'needs_care': -0.15,    // ต้องดูแล -15%
                'sick': -0.30,          // ป่วย -30%
            }
            const healthImpact = HEALTH_IMPACT[health] ?? 0
            if (healthImpact !== 0) {
                estimatedPrice *= (1 + healthImpact)
                factors.push({
                    name_th: `❤️ สุขภาพ: ${health}`,
                    name_en: `❤️ Health: ${health}`,
                    impact: healthImpact >= 0 ? 'positive' : 'negative',
                    percentage: Math.round(healthImpact * 100),
                    icon: healthImpact >= 0 ? '❤️' : '🏥'
                })
            }
        }

        // Neutered/Spayed
        const neutered = (formData['neutered'] as string) || (formData['spayed'] as string) || ''
        if (neutered === 'yes' || neutered === 'ทำหมันแล้ว') {
            // Neutered is usually a minus for breeders but plus for pet owners
            // We'll treat it as neutral to slightly positive
            const neuteredImpact = 0.05  // ทำหมันแล้ว +5% (responsible ownership)
            estimatedPrice *= (1 + neuteredImpact)
            factors.push({
                name_th: `✂️ ทำหมันแล้ว`,
                name_en: `✂️ Neutered/Spayed`,
                impact: 'positive',
                percentage: Math.round(neuteredImpact * 100),
                icon: '✂️'
            })
        }
    }

    // ============================================
    // 3.12. SPORTS-SPECIFIC FACTORS (Category 12)
    // ============================================
    if (categoryId === 12) {
        // Bicycle Brand Impact (for 1201)
        if (subcategoryId === 1201) {
            const bikeBrand = (specs['brand'] || (formData['brand'] as string) || '').toLowerCase()
            if (bikeBrand) {
                const BIKE_BRAND_IMPACT: Record<string, number> = {
                    // Premium
                    'specialized': 0.20,
                    'trek': 0.20,
                    'pinarello': 0.25,
                    'cervelo': 0.20,
                    'cannondale': 0.15,
                    'bianchi': 0.15,
                    'colnago': 0.20,
                    'scott': 0.10,
                    // Mid-tier
                    'giant': 0.10,
                    'merida': 0.08,
                    'orbea': 0.08,
                    'canyon': 0.10,
                    // Folding Premium
                    'brompton': 0.25,
                    'dahon': 0.05,
                    'tern': 0.08,
                    // Budget
                    'trinx': -0.05,
                    'java': -0.08,
                    'winn': -0.10,
                    'la': -0.15,
                }
                // Find matching brand
                let brandImpact = 0
                for (const [brand, impact] of Object.entries(BIKE_BRAND_IMPACT)) {
                    if (bikeBrand.includes(brand)) {
                        brandImpact = impact
                        break
                    }
                }
                if (brandImpact !== 0) {
                    estimatedPrice *= (1 + brandImpact)
                    factors.push({
                        name_th: `🚴 แบรนด์: ${specs['brand'] || formData['brand']}`,
                        name_en: `🚴 Brand: ${specs['brand'] || formData['brand']}`,
                        impact: brandImpact >= 0 ? 'positive' : 'negative',
                        percentage: Math.round(brandImpact * 100),
                        icon: brandImpact >= 0 ? '🏆' : '🚴'
                    })
                }
            }

            // Groupset (for road bikes)
            const groupset = (formData['groupset'] as string) || ''
            if (groupset) {
                const GROUPSET_IMPACT: Record<string, number> = {
                    // Shimano Road
                    'shimano_dura_ace': 0.25,
                    'shimano_ultegra': 0.15,
                    'shimano_105': 0.05,
                    'shimano_tiagra': 0,
                    'shimano_claris': -0.08,
                    // Shimano MTB
                    'shimano_xtr': 0.25,
                    'shimano_xt': 0.15,
                    'shimano_slx': 0.08,
                    'shimano_deore': 0,
                    // SRAM
                    'sram_red': 0.25,
                    'sram_force': 0.15,
                    'sram_rival': 0.08,
                    // Campagnolo
                    'campagnolo': 0.20,
                    'other': 0,
                }
                const groupsetImpact = GROUPSET_IMPACT[groupset] ?? 0
                if (groupsetImpact !== 0) {
                    estimatedPrice *= (1 + groupsetImpact)
                    factors.push({
                        name_th: `⚙️ Groupset: ${groupset.replace(/_/g, ' ')}`,
                        name_en: `⚙️ Groupset: ${groupset.replace(/_/g, ' ')}`,
                        impact: groupsetImpact >= 0 ? 'positive' : 'negative',
                        percentage: Math.round(groupsetImpact * 100),
                        icon: '⚙️'
                    })
                }
            }

            // Bike Type
            const bikeType = (formData['bike_type'] as string) || ''
            if (bikeType) {
                const TYPE_IMPACT: Record<string, number> = {
                    'road': 0.10,       // Road bike +10%
                    'gravel': 0.08,     // Gravel +8%
                    'mtb': 0,           // MTB (baseline)
                    'hybrid': -0.05,    // Hybrid -5%
                    'folding': 0.05,    // Folding +5%
                    'ebike': 0.15,      // E-bike +15%
                    'fixie': -0.10,     // Fixed Gear -10%
                    'city': -0.10,
                }
                const typeImpact = TYPE_IMPACT[bikeType] ?? 0
                if (typeImpact !== 0) {
                    estimatedPrice *= (1 + typeImpact)
                    factors.push({
                        name_th: `🚲 ประเภท: ${bikeType}`,
                        name_en: `🚲 Type: ${bikeType}`,
                        impact: typeImpact >= 0 ? 'positive' : 'negative',
                        percentage: Math.round(typeImpact * 100),
                        icon: '🚲'
                    })
                }
            }

            // Frame Material
            const frameMaterial = (formData['frame_material'] as string) || ''
            if (frameMaterial) {
                const MATERIAL_IMPACT: Record<string, number> = {
                    'carbon': 0.20,     // Carbon +20%
                    'titanium': 0.15,   // Titanium +15%
                    'aluminum': 0,      // Aluminum (baseline)
                    'steel': -0.05,     // Steel -5%
                    'hi-ten': -0.15,    // Hi-Ten Steel -15%
                }
                const materialImpact = MATERIAL_IMPACT[frameMaterial] ?? 0
                if (materialImpact !== 0) {
                    estimatedPrice *= (1 + materialImpact)
                    factors.push({
                        name_th: `🔩 วัสดุเฟรม: ${frameMaterial}`,
                        name_en: `🔩 Frame: ${frameMaterial}`,
                        impact: materialImpact >= 0 ? 'positive' : 'negative',
                        percentage: Math.round(materialImpact * 100),
                        icon: '🔩'
                    })
                }
            }
        }

        // Fitness Equipment Brand (for 1202)
        if (subcategoryId === 1202) {
            const fitnessBrand = (specs['brand'] || (formData['brand'] as string) || '').toLowerCase()
            if (fitnessBrand) {
                const FITNESS_BRAND_IMPACT: Record<string, number> = {
                    'technogym': 0.30,      // Technogym +30%
                    'life fitness': 0.25,
                    'matrix': 0.20,
                    'precor': 0.18,
                    'peloton': 0.15,
                    'concept2': 0.20,       // Rowing
                    'rogue': 0.15,          // CrossFit
                    'bowflex': 0.05,
                    'nordictrack': 0.05,
                    'proform': 0,
                    'xiaomi': -0.05,
                    'irun': -0.10,
                }
                let brandImpact = 0
                for (const [brand, impact] of Object.entries(FITNESS_BRAND_IMPACT)) {
                    if (fitnessBrand.includes(brand)) {
                        brandImpact = impact
                        break
                    }
                }
                if (brandImpact !== 0) {
                    estimatedPrice *= (1 + brandImpact)
                    factors.push({
                        name_th: `💪 แบรนด์: ${specs['brand'] || formData['brand']}`,
                        name_en: `💪 Brand: ${specs['brand'] || formData['brand']}`,
                        impact: brandImpact >= 0 ? 'positive' : 'negative',
                        percentage: Math.round(brandImpact * 100),
                        icon: brandImpact >= 0 ? '🏋️' : '💪'
                    })
                }
            }
        }

        // Camping Brand (for 1203)
        if (subcategoryId === 1203) {
            const campBrand = (specs['brand'] || (formData['brand'] as string) || '').toLowerCase()
            if (campBrand) {
                const CAMP_BRAND_IMPACT: Record<string, number> = {
                    'snow peak': 0.25,
                    'msr': 0.20,
                    'hilleberg': 0.25,
                    'big agnes': 0.15,
                    'nemo': 0.15,
                    'coleman': 0,
                    'naturehike': -0.05,
                    'decathlon': -0.05,
                }
                let brandImpact = 0
                for (const [brand, impact] of Object.entries(CAMP_BRAND_IMPACT)) {
                    if (campBrand.includes(brand)) {
                        brandImpact = impact
                        break
                    }
                }
                if (brandImpact !== 0) {
                    estimatedPrice *= (1 + brandImpact)
                    factors.push({
                        name_th: `⛺ แบรนด์: ${specs['brand'] || formData['brand']}`,
                        name_en: `⛺ Brand: ${specs['brand'] || formData['brand']}`,
                        impact: brandImpact >= 0 ? 'positive' : 'negative',
                        percentage: Math.round(brandImpact * 100),
                        icon: brandImpact >= 0 ? '🏕️' : '⛺'
                    })
                }
            }
        }
    }

    // ============================================
    // 3.13. HOME & GARDEN FACTORS (Category 13)
    // ============================================
    if (categoryId === 13) {
        // Furniture Brand (for 1301)
        if (subcategoryId === 1301) {
            const furnitureBrand = (specs['brand'] || (formData['brand'] as string) || '').toLowerCase()
            if (furnitureBrand) {
                const FURNITURE_BRAND_IMPACT: Record<string, number> = {
                    // Designer/Premium
                    'herman miller': 0.40,
                    'steelcase': 0.30,
                    'vitra': 0.35,
                    'knoll': 0.30,
                    'cassina': 0.30,
                    'b&b italia': 0.30,
                    // Premium Thai
                    'koncept': 0.15,
                    'modernform': 0.10,
                    'creative': 0.08,
                    // Mass Market
                    'ikea': 0,
                    'index': -0.05,
                    'sb furniture': -0.05,
                    'winner': -0.10,
                    // Budget
                    'other': -0.20,
                }
                // Find matching brand
                let brandImpact = 0
                for (const [brand, impact] of Object.entries(FURNITURE_BRAND_IMPACT)) {
                    if (furnitureBrand.includes(brand)) {
                        brandImpact = impact
                        break
                    }
                }
                if (brandImpact !== 0) {
                    estimatedPrice *= (1 + brandImpact)
                    factors.push({
                        name_th: `🛋️ แบรนด์: ${specs['brand'] || formData['brand']}`,
                        name_en: `🛋️ Brand: ${specs['brand'] || formData['brand']}`,
                        impact: brandImpact >= 0 ? 'positive' : 'negative',
                        percentage: Math.round(brandImpact * 100),
                        icon: brandImpact >= 0 ? '🏆' : '🛋️'
                    })
                }
            }

            // Material
            const material = (formData['material'] as string) || ''
            if (material) {
                const MATERIAL_IMPACT: Record<string, number> = {
                    'solid_wood': 0.25,     // ไม้จริง +25%
                    'teak': 0.30,           // ไม้สัก +30%
                    'oak': 0.20,            // ไม้โอ๊ค +20%
                    'walnut': 0.25,         // วอลนัท +25%
                    'rattan': 0.15,         // หวาย +15%
                    'metal': 0.05,          // โลหะ +5%
                    'leather': 0.15,        // หนังแท้ +15%
                    'fabric': 0,            // ผ้า (baseline)
                    'particle_board': -0.15,// ปาร์ติเคิล -15%
                    'mdf': -0.10,           // MDF -10%
                    'plastic': -0.20,       // พลาสติก -20%
                }
                const materialImpact = MATERIAL_IMPACT[material] ?? 0
                if (materialImpact !== 0) {
                    estimatedPrice *= (1 + materialImpact)
                    factors.push({
                        name_th: `🪵 วัสดุ: ${material}`,
                        name_en: `🪵 Material: ${material}`,
                        impact: materialImpact >= 0 ? 'positive' : 'negative',
                        percentage: Math.round(materialImpact * 100),
                        icon: materialImpact >= 0 ? '🪵' : '📦'
                    })
                }
            }

            // Style
            const style = (formData['style'] as string) || ''
            if (style) {
                const STYLE_IMPACT: Record<string, number> = {
                    'designer': 0.20,       // Designer +20%
                    'vintage': 0.15,        // Vintage +15%
                    'antique': 0.25,        // Antique +25%
                    'mid_century': 0.15,    // Mid-Century +15%
                    'scandinavian': 0.10,   // Scandinavian +10%
                    'industrial': 0.05,     // Industrial +5%
                    'modern': 0,            // Modern (baseline)
                    'traditional': 0,
                    'contemporary': 0,
                }
                const styleImpact = STYLE_IMPACT[style] ?? 0
                if (styleImpact !== 0) {
                    estimatedPrice *= (1 + styleImpact)
                    factors.push({
                        name_th: `🎨 สไตล์: ${style}`,
                        name_en: `🎨 Style: ${style}`,
                        impact: styleImpact >= 0 ? 'positive' : 'negative',
                        percentage: Math.round(styleImpact * 100),
                        icon: '🎨'
                    })
                }
            }
        }

        // Tool Brand (for 1304)
        if (subcategoryId === 1304) {
            const toolBrand = (specs['brand'] || (formData['brand'] as string) || '').toLowerCase()
            if (toolBrand) {
                const TOOL_BRAND_IMPACT: Record<string, number> = {
                    // Premium
                    'milwaukee': 0.25,
                    'dewalt': 0.20,
                    'makita': 0.20,
                    'hilti': 0.30,
                    'festool': 0.30,
                    'bosch': 0.10,
                    'metabo': 0.15,
                    // Mid-tier
                    'stanley': 0.05,
                    'black+decker': 0,
                    'ryobi': 0,
                    // Budget
                    'total': -0.10,
                    'worx': -0.05,
                    'maktec': -0.08,
                }
                let brandImpact = 0
                for (const [brand, impact] of Object.entries(TOOL_BRAND_IMPACT)) {
                    if (toolBrand.includes(brand)) {
                        brandImpact = impact
                        break
                    }
                }
                if (brandImpact !== 0) {
                    estimatedPrice *= (1 + brandImpact)
                    factors.push({
                        name_th: `🔧 แบรนด์: ${specs['brand'] || formData['brand']}`,
                        name_en: `🔧 Brand: ${specs['brand'] || formData['brand']}`,
                        impact: brandImpact >= 0 ? 'positive' : 'negative',
                        percentage: Math.round(brandImpact * 100),
                        icon: brandImpact >= 0 ? '🛠️' : '🔧'
                    })
                }
            }
        }

        // Plant Type (for 1303)
        if (subcategoryId === 1303) {
            const plantType = (formData['plant_type'] as string) || ''
            if (plantType) {
                const PLANT_IMPACT: Record<string, number> = {
                    'rare': 0.30,           // ไม้หายาก +30%
                    'variegated': 0.25,     // ด่าง +25%
                    'bonsai': 0.20,         // บอนไซ +20%
                    'orchid': 0.15,         // กล้วยไม้ +15%
                    'succulent': 0.05,      // ไม้อวบน้ำ +5%
                    'common': -0.10,        // ไม้ทั่วไป -10%
                }
                const plantImpact = PLANT_IMPACT[plantType] ?? 0
                if (plantImpact !== 0) {
                    estimatedPrice *= (1 + plantImpact)
                    factors.push({
                        name_th: `🌿 ประเภทต้นไม้: ${plantType}`,
                        name_en: `🌿 Plant Type: ${plantType}`,
                        impact: plantImpact >= 0 ? 'positive' : 'negative',
                        percentage: Math.round(plantImpact * 100),
                        icon: plantImpact >= 0 ? '🌿' : '🪴'
                    })
                }
            }
        }
    }

    // ============================================
    // 3.14. BEAUTY FACTORS (Category 14)
    // ============================================
    if (categoryId === 14) {
        // Brand Tier
        const beautyBrand = (specs['brand'] || (formData['brand'] as string) || '').toLowerCase()
        if (beautyBrand) {
            const BEAUTY_BRAND_IMPACT: Record<string, number> = {
                // Luxury
                'la mer': 0.45,
                'la prairie': 0.45,
                'sisley': 0.40,
                'dior': 0.40,
                'chanel': 0.40,
                'tom ford': 0.35,
                'ysl': 0.30,
                'guerlain': 0.35,
                'sk-ii': 0.25,
                'estee lauder': 0.25,
                'lancome': 0.20,
                'shiseido': 0.20,
                // Premium
                'clinique': 0.10,
                'kiehl\'s': 0.10,
                'origins': 0.08,
                'drunk elephant': 0.15,
                'tatcha': 0.15,
                'the ordinary': 0.05,
                // Korean Premium
                'sulwhasoo': 0.25,
                'hera': 0.20,
                'laneige': 0.10,
                'cosrx': 0.05,
                'innisfree': 0,
                // Mass Market
                'maybelline': -0.05,
                'loreal': -0.05,
                'revlon': -0.10,
                // Drugstore
                'eucerin': 0,
                'cetaphil': -0.05,
                'neutrogena': -0.08,
                'nivea': -0.10,
                'pond\'s': -0.15,
                'garnier': -0.15,
            }
            let brandImpact = 0
            for (const [brand, impact] of Object.entries(BEAUTY_BRAND_IMPACT)) {
                if (beautyBrand.includes(brand)) {
                    brandImpact = impact
                    break
                }
            }
            if (brandImpact !== 0) {
                estimatedPrice *= (1 + brandImpact)
                factors.push({
                    name_th: `💄 แบรนด์: ${specs['brand'] || formData['brand']}`,
                    name_en: `💄 Brand: ${specs['brand'] || formData['brand']}`,
                    impact: brandImpact >= 0 ? 'positive' : 'negative',
                    percentage: Math.round(brandImpact * 100),
                    icon: brandImpact >= 0 ? '💎' : '💄'
                })
            }
        }

        // Usage Percent (for 1401, 1402, 1403)
        const usagePercent = (formData['usage_percent'] as string) || (formData['condition'] as string) || ''
        if (usagePercent) {
            const USAGE_IMPACT: Record<string, number> = {
                'new_sealed': 0.20,       // ใหม่ยังซีล +20%
                'new_opened': 0.10,       // ใหม่แกะแล้ว +10%
                'used_10': 0.05,          // ใช้ไป 10% +5%
                'used_30': -0.10,         // ใช้ไป 30% -10%
                'used_50': -0.25,         // ใช้ไป 50% -25%
                'used_70': -0.40,         // ใช้ไป 70% -40%
                'almost_empty': -0.60,    // เกือบหมด -60%
            }
            const usageImpact = USAGE_IMPACT[usagePercent] ?? 0
            if (usageImpact !== 0) {
                estimatedPrice *= (1 + usageImpact)
                factors.push({
                    name_th: `📊 ปริมาณคงเหลือ: ${usagePercent}`,
                    name_en: `📊 Remaining: ${usagePercent}`,
                    impact: usageImpact >= 0 ? 'positive' : 'negative',
                    percentage: Math.round(usageImpact * 100),
                    icon: usageImpact >= 0 ? '✨' : '📊'
                })
            }
        }

        // Expiry Status
        const expiry = (formData['expiry_status'] as string) || ''
        if (expiry) {
            const EXPIRY_IMPACT: Record<string, number> = {
                'fresh': 0.05,            // เหลือ > 1 ปี +5%
                'ok': 0,                  // เหลือ 6-12 เดือน
                'expiring': -0.25,        // ใกล้หมดอายุ -25%
                'expired': -0.80,         // หมดอายุแล้ว -80%
            }
            const expiryImpact = EXPIRY_IMPACT[expiry] ?? 0
            if (expiryImpact !== 0) {
                estimatedPrice *= (1 + expiryImpact)
                factors.push({
                    name_th: `📅 วันหมดอายุ: ${expiry}`,
                    name_en: `📅 Expiry: ${expiry}`,
                    impact: expiryImpact >= 0 ? 'positive' : 'negative',
                    percentage: Math.round(expiryImpact * 100),
                    icon: expiryImpact >= 0 ? '✅' : '⚠️'
                })
            }
        }

        // Perfume Concentration (for 1404)
        if (subcategoryId === 1404) {
            const concentration = (formData['concentration'] as string) || ''
            if (concentration) {
                const CONCENTRATION_IMPACT: Record<string, number> = {
                    'parfum': 0.30,         // Parfum +30%
                    'extrait': 0.35,        // Extrait +35%
                    'edp': 0.15,            // EDP +15%
                    'edt': 0,               // EDT (baseline)
                    'edc': -0.15,           // EDC -15%
                    'body_mist': -0.25,     // Body Mist -25%
                }
                const concentrationImpact = CONCENTRATION_IMPACT[concentration] ?? 0
                if (concentrationImpact !== 0) {
                    estimatedPrice *= (1 + concentrationImpact)
                    factors.push({
                        name_th: `🌸 ความเข้มข้น: ${concentration.toUpperCase()}`,
                        name_en: `🌸 Concentration: ${concentration.toUpperCase()}`,
                        impact: concentrationImpact >= 0 ? 'positive' : 'negative',
                        percentage: Math.round(concentrationImpact * 100),
                        icon: '🌸'
                    })
                }
            }

            // Perfume Size
            const size = (formData['size_ml'] as string) || ''
            if (size) {
                const sizeNum = parseFloat(size.replace(/[^\d.]/g, ''))
                let sizeImpact = 0
                if (sizeNum >= 100) {
                    sizeImpact = 0.15       // 100ml+ +15%
                } else if (sizeNum >= 50) {
                    sizeImpact = 0          // 50-99ml (baseline)
                } else if (sizeNum >= 30) {
                    sizeImpact = -0.10      // 30-49ml -10%
                } else {
                    sizeImpact = -0.20      // <30ml -20%
                }
                if (sizeImpact !== 0) {
                    estimatedPrice *= (1 + sizeImpact)
                    factors.push({
                        name_th: `💧 ขนาด: ${sizeNum}ml`,
                        name_en: `💧 Size: ${sizeNum}ml`,
                        impact: sizeImpact >= 0 ? 'positive' : 'negative',
                        percentage: Math.round(sizeImpact * 100),
                        icon: '💧'
                    })
                }
            }
        }

        // Beauty Tools Brand (for 1406)
        if (subcategoryId === 1406) {
            const toolBrand = (specs['brand'] || (formData['brand'] as string) || '').toLowerCase()
            if (toolBrand) {
                const BEAUTY_TOOL_IMPACT: Record<string, number> = {
                    'dyson': 0.35,          // Dyson +35%
                    'ghd': 0.25,
                    'babyliss': 0.10,
                    'philips': 0.05,
                    'panasonic': 0.05,
                    'braun': 0.05,
                    'remington': 0,
                    'xiaomi': -0.05,
                }
                let toolImpact = 0
                for (const [brand, impact] of Object.entries(BEAUTY_TOOL_IMPACT)) {
                    if (toolBrand.includes(brand)) {
                        toolImpact = impact
                        break
                    }
                }
                if (toolImpact !== 0) {
                    estimatedPrice *= (1 + toolImpact)
                    factors.push({
                        name_th: `💅 แบรนด์อุปกรณ์: ${specs['brand'] || formData['brand']}`,
                        name_en: `💅 Tool Brand: ${specs['brand'] || formData['brand']}`,
                        impact: toolImpact >= 0 ? 'positive' : 'negative',
                        percentage: Math.round(toolImpact * 100),
                        icon: toolImpact >= 0 ? '✨' : '💅'
                    })
                }
            }
        }
    }

    // ============================================
    // 3.15. KIDS & BABY FACTORS (Category 15)
    // ============================================
    if (categoryId === 15) {
        // Baby Gear Brand (for 1504 - strollers, car seats)
        if (subcategoryId === 1504) {
            const babyBrand = (specs['brand'] || (formData['brand'] as string) || '').toLowerCase()
            if (babyBrand) {
                const BABY_GEAR_IMPACT: Record<string, number> = {
                    // Premium
                    'bugaboo': 0.35,
                    'stokke': 0.30,
                    'cybex': 0.30,
                    'uppababy': 0.25,
                    'babyzen': 0.25,
                    'nuna': 0.20,
                    'ergobaby': 0.15,
                    'maxi-cosi': 0.15,
                    'joie': 0.10,
                    'chicco': 0.08,
                    // Mid-tier
                    'britax': 0.05,
                    'graco': 0,
                    'baby jogger': 0.10,
                    'combi': 0.05,
                    'aprica': 0.08,
                    // Budget
                    'generic': -0.20,
                    'lucky baby': -0.10,
                    'babytime': -0.10,
                }
                let brandImpact = 0
                for (const [brand, impact] of Object.entries(BABY_GEAR_IMPACT)) {
                    if (babyBrand.includes(brand)) {
                        brandImpact = impact
                        break
                    }
                }
                if (brandImpact !== 0) {
                    estimatedPrice *= (1 + brandImpact)
                    factors.push({
                        name_th: `🍼 แบรนด์: ${specs['brand'] || formData['brand']}`,
                        name_en: `🍼 Brand: ${specs['brand'] || formData['brand']}`,
                        impact: brandImpact >= 0 ? 'positive' : 'negative',
                        percentage: Math.round(brandImpact * 100),
                        icon: brandImpact >= 0 ? '👶' : '🍼'
                    })
                }
            }
        }

        // Toy Brand (for 1503)
        if (subcategoryId === 1503) {
            const toyBrand = (specs['brand'] || (formData['brand'] as string) || '').toLowerCase()
            if (toyBrand) {
                const TOY_BRAND_IMPACT: Record<string, number> = {
                    // Premium
                    'lego': 0.25,
                    'playmobil': 0.15,
                    'sylvanian': 0.15,
                    'calico critters': 0.15,
                    'jellycats': 0.20,
                    'steiff': 0.30,
                    // Popular
                    'fisher-price': 0.10,
                    'vtech': 0.08,
                    'little tikes': 0.05,
                    'hot wheels': 0.05,
                    'barbie': 0.05,
                    'nerf': 0.05,
                    'transformers': 0.08,
                    'pokemon': 0.10,
                    // Budget
                    'generic': -0.15,
                    'no brand': -0.20,
                }
                let brandImpact = 0
                for (const [brand, impact] of Object.entries(TOY_BRAND_IMPACT)) {
                    if (toyBrand.includes(brand)) {
                        brandImpact = impact
                        break
                    }
                }
                if (brandImpact !== 0) {
                    estimatedPrice *= (1 + brandImpact)
                    factors.push({
                        name_th: `🧸 แบรนด์: ${specs['brand'] || formData['brand']}`,
                        name_en: `🧸 Brand: ${specs['brand'] || formData['brand']}`,
                        impact: brandImpact >= 0 ? 'positive' : 'negative',
                        percentage: Math.round(brandImpact * 100),
                        icon: brandImpact >= 0 ? '🎮' : '🧸'
                    })
                }
            }

            // Toy Type
            const toyType = (formData['toy_type'] as string) || ''
            if (toyType) {
                const TOY_TYPE_IMPACT: Record<string, number> = {
                    'educational': 0.15,    // ของเล่นเสริมพัฒนาการ +15%
                    'collectible': 0.20,    // ของสะสม +20%
                    'electronic': 0.10,     // อิเล็กทรอนิกส์ +10%
                    'building': 0.10,       // ตัวต่อ +10%
                    'outdoor': 0,
                    'basic': -0.10,         // พื้นฐาน -10%
                }
                const typeImpact = TOY_TYPE_IMPACT[toyType] ?? 0
                if (typeImpact !== 0) {
                    estimatedPrice *= (1 + typeImpact)
                    factors.push({
                        name_th: `🎯 ประเภท: ${toyType}`,
                        name_en: `🎯 Type: ${toyType}`,
                        impact: typeImpact >= 0 ? 'positive' : 'negative',
                        percentage: Math.round(typeImpact * 100),
                        icon: '🎯'
                    })
                }
            }
        }

        // Safety Certification
        const safety = (formData['safety'] as string) || (formData['safety_certified'] as string) || ''
        if (safety) {
            const SAFETY_IMPACT: Record<string, number> = {
                'certified': 0.15,          // ผ่าน มอก./CE +15%
                'tis': 0.15,                // มอก. +15%
                'ce': 0.12,                 // CE +12%
                'astm': 0.12,               // ASTM +12%
                'not_certified': -0.10,     // ไม่มี -10%
            }
            const safetyImpact = SAFETY_IMPACT[safety] ?? 0
            if (safetyImpact !== 0) {
                estimatedPrice *= (1 + safetyImpact)
                factors.push({
                    name_th: `🛡️ มาตรฐานความปลอดภัย: ${safety}`,
                    name_en: `🛡️ Safety: ${safety}`,
                    impact: safetyImpact >= 0 ? 'positive' : 'negative',
                    percentage: Math.round(safetyImpact * 100),
                    icon: safetyImpact >= 0 ? '🛡️' : '⚠️'
                })
            }
        }

        // Age Range Optimization
        const ageRange = (formData['age_range'] as string) || ''
        if (ageRange) {
            const AGE_IMPACT: Record<string, number> = {
                '0-6m': 0.10,               // ทารก 0-6 เดือน +10% (high demand)
                '6-12m': 0.08,              // 6-12 เดือน +8%
                '1-2y': 0.05,               // 1-2 ปี +5%
                '2-4y': 0,                  // 2-4 ปี (baseline)
                '4-6y': 0,
                '6-10y': -0.05,             // 6-10 ปี -5%
                '10+': -0.10,               // 10+ ปี -10%
            }
            const ageImpact = AGE_IMPACT[ageRange] ?? 0
            if (ageImpact !== 0) {
                estimatedPrice *= (1 + ageImpact)
                factors.push({
                    name_th: `👶 อายุที่เหมาะสม: ${ageRange}`,
                    name_en: `👶 Age Range: ${ageRange}`,
                    impact: ageImpact >= 0 ? 'positive' : 'negative',
                    percentage: Math.round(ageImpact * 100),
                    icon: '👶'
                })
            }
        }

        // Condition (special handling for kids items)
        const kidsCondition = (formData['condition'] as string) || ''
        if (kidsCondition) {
            const KIDS_CONDITION_IMPACT: Record<string, number> = {
                'new_tag': 0.20,            // ใหม่ ยังไม่แกะป้าย +20%
                'like_new': 0.10,           // เหมือนใหม่ +10%
                'good': 0,                  // สภาพดี (baseline)
                'fair': -0.15,              // พอใช้ -15%
                'heavily_used': -0.30,      // ใช้งานมาก -30% (safety concern)
            }
            const conditionImpact = KIDS_CONDITION_IMPACT[kidsCondition] ?? 0
            if (conditionImpact !== 0) {
                estimatedPrice *= (1 + conditionImpact)
                factors.push({
                    name_th: `✨ สภาพ: ${kidsCondition}`,
                    name_en: `✨ Condition: ${kidsCondition}`,
                    impact: conditionImpact >= 0 ? 'positive' : 'negative',
                    percentage: Math.round(conditionImpact * 100),
                    icon: conditionImpact >= 0 ? '✨' : '⚠️'
                })
            }
        }
    }

    // ============================================
    // 3.16. BOOKS & EDUCATION FACTORS (Category 16)
    // ============================================
    if (categoryId === 16) {
        // Book Category/Type
        const bookCategory = (formData['book_category'] as string) || ''
        if (bookCategory) {
            const BOOK_CATEGORY_IMPACT: Record<string, number> = {
                'rare': 0.40,             // หนังสือหายาก +40%
                'collector': 0.35,        // หนังสือสะสม +35%
                'first_edition': 0.30,    // พิมพ์ครั้งแรก +30%
                'manga': 0.15,            // การ์ตูน/มังงะ +15%
                'textbook': 0.10,         // หนังสือเรียน +10% (demand)
                'novel': 0,               // นิยาย (baseline)
                'self_help': 0,
                'children': 0.05,
                'magazine': -0.15,        // นิตยสาร -15%
                'other': -0.05,
            }
            const categoryImpact = BOOK_CATEGORY_IMPACT[bookCategory] ?? 0
            if (categoryImpact !== 0) {
                estimatedPrice *= (1 + categoryImpact)
                factors.push({
                    name_th: `📚 ประเภท: ${bookCategory}`,
                    name_en: `📚 Type: ${bookCategory}`,
                    impact: categoryImpact >= 0 ? 'positive' : 'negative',
                    percentage: Math.round(categoryImpact * 100),
                    icon: '📚'
                })
            }
        }

        // Book Condition (specific for books)
        const bookCondition = (formData['book_condition'] as string) || (formData['condition'] as string) || ''
        if (bookCondition) {
            const BOOK_CONDITION_IMPACT: Record<string, number> = {
                'new_sealed': 0.25,       // ใหม่ซีล +25%
                'new': 0.15,              // ใหม่ +15%
                'like_new': 0.10,         // เหมือนใหม่ +10%
                'good': 0,                // สภาพดี (baseline)
                'fair': -0.15,            // พอใช้ -15%
                'notes': -0.20,           // มีจดโน้ต -20%
                'worn': -0.30,            // สันหักงอ/มีรอยเปื้อน -30%
            }
            const conditionImpact = BOOK_CONDITION_IMPACT[bookCondition] ?? 0
            if (conditionImpact !== 0) {
                estimatedPrice *= (1 + conditionImpact)
                factors.push({
                    name_th: `📖 สภาพหนังสือ: ${bookCondition}`,
                    name_en: `📖 Condition: ${bookCondition}`,
                    impact: conditionImpact >= 0 ? 'positive' : 'negative',
                    percentage: Math.round(conditionImpact * 100),
                    icon: conditionImpact >= 0 ? '✨' : '📖'
                })
            }
        }

        // Edition (for collectors)
        const edition = (formData['edition'] as string) || ''
        if (edition) {
            const EDITION_IMPACT: Record<string, number> = {
                'signed': 0.50,           // มีลายเซ็น +50%
                'limited': 0.35,          // Limited Edition +35%
                'first': 0.30,            // พิมพ์ครั้งแรก +30%
                'special': 0.20,          // Special Edition +20%
                'hardcover': 0.15,        // ปกแข็ง +15%
                'paperback': 0,           // ปกอ่อน (baseline)
                'reprint': -0.10,         // พิมพ์ซ้ำ -10%
            }
            const editionImpact = EDITION_IMPACT[edition] ?? 0
            if (editionImpact !== 0) {
                estimatedPrice *= (1 + editionImpact)
                factors.push({
                    name_th: `📕 รุ่น: ${edition}`,
                    name_en: `📕 Edition: ${edition}`,
                    impact: editionImpact >= 0 ? 'positive' : 'negative',
                    percentage: Math.round(editionImpact * 100),
                    icon: editionImpact >= 0 ? '⭐' : '📕'
                })
            }
        }

        // Complete Set (for manga)
        if (subcategoryId === 1602) {
            const setComplete = (formData['set_complete'] as string) || ''
            if (setComplete === 'yes' || setComplete === 'complete' || setComplete === 'ครบชุด') {
                const setImpact = 0.20  // ครบชุด +20%
                estimatedPrice *= (1 + setImpact)
                factors.push({
                    name_th: `📚 ครบชุด/ยกชุด`,
                    name_en: `📚 Complete Set`,
                    impact: 'positive',
                    percentage: Math.round(setImpact * 100),
                    icon: '📚'
                })
            }

            // Popular Series Boost
            const title = (specs['title'] || (formData['title'] as string) || '').toLowerCase()
            const POPULAR_MANGA = ['one piece', 'วันพีซ', 'naruto', 'นารูโตะ', 'dragon ball', 'demon slayer', 'attack on titan', 'jojo']
            for (const manga of POPULAR_MANGA) {
                if (title.includes(manga)) {
                    const popularImpact = 0.15  // Popular series +15%
                    estimatedPrice *= (1 + popularImpact)
                    factors.push({
                        name_th: `🔥 ซีรีส์ยอดนิยม`,
                        name_en: `🔥 Popular Series`,
                        impact: 'positive',
                        percentage: Math.round(popularImpact * 100),
                        icon: '🔥'
                    })
                    break
                }
            }
        }

        // Stationery Brand (for 1606)
        if (subcategoryId === 1606) {
            const stationeryBrand = (specs['brand'] || (formData['brand'] as string) || '').toLowerCase()
            if (stationeryBrand) {
                const STATIONERY_IMPACT: Record<string, number> = {
                    // Luxury Pens
                    'montblanc': 0.40,
                    'parker': 0.20,
                    'lamy': 0.20,
                    'cross': 0.15,
                    'waterman': 0.15,
                    'pilot': 0.05,
                    'uni': 0.05,
                    'zebra': 0,
                    'pentel': 0,
                    // Budget
                    'no brand': -0.15,
                }
                let brandImpact = 0
                for (const [brand, impact] of Object.entries(STATIONERY_IMPACT)) {
                    if (stationeryBrand.includes(brand)) {
                        brandImpact = impact
                        break
                    }
                }
                if (brandImpact !== 0) {
                    estimatedPrice *= (1 + brandImpact)
                    factors.push({
                        name_th: `✒️ แบรนด์: ${specs['brand'] || formData['brand']}`,
                        name_en: `✒️ Brand: ${specs['brand'] || formData['brand']}`,
                        impact: brandImpact >= 0 ? 'positive' : 'negative',
                        percentage: Math.round(brandImpact * 100),
                        icon: brandImpact >= 0 ? '✨' : '✒️'
                    })
                }
            }
        }

        // Online Course Platform (for 1605)
        if (subcategoryId === 1605) {
            const platform = (formData['platform'] as string) || ''
            if (platform) {
                const PLATFORM_IMPACT: Record<string, number> = {
                    'udemy': 0,
                    'coursera': 0.10,
                    'skillshare': 0.05,
                    'masterclass': 0.20,
                    'linkedin_learning': 0.10,
                    'domestika': 0.08,
                    'other': -0.05,
                }
                const platformImpact = PLATFORM_IMPACT[platform] ?? 0
                if (platformImpact !== 0) {
                    estimatedPrice *= (1 + platformImpact)
                    factors.push({
                        name_th: `💻 แพลตฟอร์ม: ${platform}`,
                        name_en: `💻 Platform: ${platform}`,
                        impact: platformImpact >= 0 ? 'positive' : 'negative',
                        percentage: Math.round(platformImpact * 100),
                        icon: '💻'
                    })
                }
            }
        }
    }

    // ============================================
    // 3.99. OTHERS/MISCELLANEOUS FACTORS (Category 99)
    // ============================================
    if (categoryId === 99) {
        // Handmade Type (for 9902)
        if (subcategoryId === 9902) {
            const handmadeType = (formData['handmade_type'] as string) || ''
            if (handmadeType) {
                const HANDMADE_IMPACT: Record<string, number> = {
                    'artisan': 0.25,          // งานช่างฝีมือ +25%
                    'custom': 0.20,           // สั่งทำ +20%
                    'limited': 0.15,          // Limited edition +15%
                    'handcrafted': 0.10,      // ทำมือ +10%
                    'homemade': 0,            // ทำเองที่บ้าน
                    'mass': -0.15,            // ผลิตจำนวนมาก -15%
                }
                const typeImpact = HANDMADE_IMPACT[handmadeType] ?? 0
                if (typeImpact !== 0) {
                    estimatedPrice *= (1 + typeImpact)
                    factors.push({
                        name_th: `🎨 ประเภท: ${handmadeType}`,
                        name_en: `🎨 Type: ${handmadeType}`,
                        impact: typeImpact >= 0 ? 'positive' : 'negative',
                        percentage: Math.round(typeImpact * 100),
                        icon: '🎨'
                    })
                }
            }

            // Craft Material
            const craftMaterial = (formData['craft_material'] as string) || ''
            if (craftMaterial) {
                const CRAFT_MATERIAL_IMPACT: Record<string, number> = {
                    'leather': 0.20,          // หนังแท้ +20%
                    'sterling_silver': 0.25,  // เงินแท้ +25%
                    'gold': 0.30,             // ทอง +30%
                    'wood': 0.10,             // ไม้ +10%
                    'ceramic': 0.10,          // เซรามิก +10%
                    'fabric': 0,              // ผ้า
                    'cotton': 0.05,           // ฝ้าย +5%
                    'plastic': -0.15,         // พลาสติก -15%
                    'synthetic': -0.10,       // สังเคราะห์ -10%
                }
                const materialImpact = CRAFT_MATERIAL_IMPACT[craftMaterial] ?? 0
                if (materialImpact !== 0) {
                    estimatedPrice *= (1 + materialImpact)
                    factors.push({
                        name_th: `🧵 วัสดุ: ${craftMaterial}`,
                        name_en: `🧵 Material: ${craftMaterial}`,
                        impact: materialImpact >= 0 ? 'positive' : 'negative',
                        percentage: Math.round(materialImpact * 100),
                        icon: materialImpact >= 0 ? '✨' : '🧵'
                    })
                }
            }
        }

        // DIY Project Type (for 9903)
        if (subcategoryId === 9903) {
            const diyType = (formData['diy_type'] as string) || ''
            if (diyType) {
                const DIY_IMPACT: Record<string, number> = {
                    'electronics': 0.15,      // DIY อิเล็กทรอนิกส์ +15%
                    'arduino': 0.12,          // Arduino project +12%
                    'woodwork': 0.10,         // งานไม้ +10%
                    'kit': 0.05,              // DIY Kit +5%
                    'craft': 0,
                    'basic': -0.10,           // พื้นฐาน -10%
                }
                const diyImpact = DIY_IMPACT[diyType] ?? 0
                if (diyImpact !== 0) {
                    estimatedPrice *= (1 + diyImpact)
                    factors.push({
                        name_th: `🔧 ประเภท DIY: ${diyType}`,
                        name_en: `🔧 DIY Type: ${diyType}`,
                        impact: diyImpact >= 0 ? 'positive' : 'negative',
                        percentage: Math.round(diyImpact * 100),
                        icon: '🔧'
                    })
                }
            }
        }

        // Recycled/Upcycled Items (for 9904)
        if (subcategoryId === 9904) {
            const recycleType = (formData['recycle_type'] as string) || ''
            if (recycleType) {
                const RECYCLE_IMPACT: Record<string, number> = {
                    'vintage': 0.30,          // Vintage +30%
                    'antique': 0.35,          // Antique +35%
                    'upcycled': 0.15,         // Upcycled +15%
                    'restored': 0.20,         // บูรณะแล้ว +20%
                    'refurbished': 0.10,      // Refurbished +10%
                    'recycled': 0,            // รีไซเคิล (baseline)
                    'scrap': -0.20,           // เศษวัสดุ -20%
                }
                const recycleImpact = RECYCLE_IMPACT[recycleType] ?? 0
                if (recycleImpact !== 0) {
                    estimatedPrice *= (1 + recycleImpact)
                    factors.push({
                        name_th: `♻️ ประเภท: ${recycleType}`,
                        name_en: `♻️ Type: ${recycleType}`,
                        impact: recycleImpact >= 0 ? 'positive' : 'negative',
                        percentage: Math.round(recycleImpact * 100),
                        icon: recycleImpact >= 0 ? '⭐' : '♻️'
                    })
                }
            }
        }

        // Office Supplies Brand (for 9905)
        if (subcategoryId === 9905) {
            const officeBrand = (specs['brand'] || (formData['brand'] as string) || '').toLowerCase()
            if (officeBrand) {
                const OFFICE_BRAND_IMPACT: Record<string, number> = {
                    // Premium
                    '3m': 0.10,
                    'fellowes': 0.15,
                    'leitz': 0.12,
                    'brother': 0.08,
                    // Standard
                    'scotch': 0.05,
                    'post-it': 0.05,
                    'double a': 0,
                    // Budget
                    'no brand': -0.15,
                    'generic': -0.10,
                }
                let brandImpact = 0
                for (const [brand, impact] of Object.entries(OFFICE_BRAND_IMPACT)) {
                    if (officeBrand.includes(brand)) {
                        brandImpact = impact
                        break
                    }
                }
                if (brandImpact !== 0) {
                    estimatedPrice *= (1 + brandImpact)
                    factors.push({
                        name_th: `🏢 แบรนด์: ${specs['brand'] || formData['brand']}`,
                        name_en: `🏢 Brand: ${specs['brand'] || formData['brand']}`,
                        impact: brandImpact >= 0 ? 'positive' : 'negative',
                        percentage: Math.round(brandImpact * 100),
                        icon: brandImpact >= 0 ? '✨' : '🏢'
                    })
                }
            }
        }

        // General Condition for all Others subcategories
        const othersCondition = (formData['condition'] as string) || ''
        if (othersCondition) {
            const OTHERS_CONDITION_IMPACT: Record<string, number> = {
                'new': 0.15,              // ใหม่ +15%
                'like_new': 0.10,         // เหมือนใหม่ +10%
                'good': 0,                // สภาพดี (baseline)
                'fair': -0.15,            // พอใช้ -15%
                'poor': -0.30,            // แย่ -30%
            }
            const conditionImpact = OTHERS_CONDITION_IMPACT[othersCondition] ?? 0
            if (conditionImpact !== 0) {
                estimatedPrice *= (1 + conditionImpact)
                factors.push({
                    name_th: `📦 สภาพ: ${othersCondition}`,
                    name_en: `📦 Condition: ${othersCondition}`,
                    impact: conditionImpact >= 0 ? 'positive' : 'negative',
                    percentage: Math.round(conditionImpact * 100),
                    icon: conditionImpact >= 0 ? '✨' : '📦'
                })
            }
        }
    }

    // 4. Image quality bonus
    if (imageQualityScore >= 85) {
        const bonus = 0.05
        estimatedPrice *= (1 + bonus)
        factors.push({
            name_th: 'รูปภาพคุณภาพสูง',
            name_en: 'High Quality Photos',
            impact: 'positive',
            percentage: Math.round(bonus * 100),
            icon: '📸'
        })
    }

    // 5. Multiple images bonus
    if (hasMultipleImages) {
        const bonus = 0.03
        estimatedPrice *= (1 + bonus)
        factors.push({
            name_th: 'มีรูปหลายมุม',
            name_en: 'Multiple Photos',
            impact: 'positive',
            percentage: Math.round(bonus * 100),
            icon: '🖼️'
        })
    }

    // 6. Calculate price range
    const avgPrice = smartRound(estimatedPrice)
    const minPrice = smartRound(avgPrice * 0.85)  // -15%
    const maxPrice = smartRound(avgPrice * 1.15)  // +15%
    const quickSellPrice = smartRound(avgPrice * 0.85)  // ขายเร็ว
    const maxProfitPrice = smartRound(avgPrice * 1.10)  // กำไรสูง

    // 7. Calculate confidence
    let confidence = 60
    if (specs && Object.keys(specs).length >= 3) confidence += 15
    if (imageQualityScore >= 80) confidence += 10
    if (hasMultipleImages) confidence += 5
    if (categoryId === 1 && specs['year'] && specs['mileage']) confidence += 10 // ยานยนต์
    confidence = Math.min(95, confidence)

    // ✅ DEBUG: Summary of calculation
    console.log('💰 Price Calculation Summary:', {
        basePrice: basePrice.avg,
        conditionMultiplier,
        finalPrice: avgPrice,
        factors: factors.map(f => `${f.name_th}: ${f.percentage}%`),
    })

    // 8. Generate insights
    if (language === 'th') {
        insights.push(`💡 ช่วงราคาแนะนำ: ฿${minPrice.toLocaleString()} - ฿${maxPrice.toLocaleString()}`)
        insights.push(`⚖️ ราคาตลาดเฉลี่ย: ฿${avgPrice.toLocaleString()}`)

        if (factors.some(f => f.impact === 'negative')) {
            insights.push(`📉 มีปัจจัยลดราคา คุณยังสามารถเพิ่มรูปภาพเพื่อเพิ่มมูลค่าได้`)
        }

        if (categoryId === 1) { // ยานยนต์
            insights.push(`🚗 ราคารถมือสองขึ้นอยู่กับยี่ห้อ รุ่น ปี และสภาพ`)
        }
    } else {
        insights.push(`💡 Recommended range: ฿${minPrice.toLocaleString()} - ฿${maxPrice.toLocaleString()}`)
        insights.push(`⚖️ Market average: ฿${avgPrice.toLocaleString()}`)
    }

    return {
        minPrice,
        maxPrice,
        avgPrice,
        quickSellPrice,
        maxProfitPrice,
        confidence,
        factors,
        insights
    }
}

// ============================================
// HELPER: Smart Rounding
// ============================================

function smartRound(price: number): number {
    if (price < 100) return Math.round(price / 10) * 10
    if (price < 1000) return Math.round(price / 50) * 50
    if (price < 10000) return Math.round(price / 100) * 100
    if (price < 100000) return Math.round(price / 1000) * 1000
    if (price < 1000000) return Math.round(price / 5000) * 5000
    return Math.round(price / 10000) * 10000
}

// ============================================
// HYBRID ESTIMATION (Rule-based + AI)
// ============================================

export interface HybridPriceEstimation extends PriceEstimation {
    source: 'rule-based' | 'ai-enhanced' | 'ai-only'
    aiReasoning?: string
    aiInsights?: string[]
    isLoading?: boolean
}

/**
 * Get instant rule-based price estimation
 * Use this for immediate display
 */
export function getInstantPriceEstimate(input: EstimationInput): HybridPriceEstimation {
    const ruleBasedResult = calculateSmartPriceEstimate(input)
    return {
        ...ruleBasedResult,
        source: 'rule-based',
        isLoading: false
    }
}

/**
 * Get AI-enhanced price estimation
 * Use this to refine the price after initial display
 */
export async function getAIEnhancedPriceEstimate(
    input: EstimationInput,
    title: string,
    category: string,
    subcategory?: string
): Promise<HybridPriceEstimation> {
    // First get rule-based estimate
    const ruleBasedResult = calculateSmartPriceEstimate(input)

    try {
        // Dynamic import to avoid circular dependencies
        const { getAIPriceAdvice } = await import('./ai-price-advisor')

        // Map condition to Thai
        const conditionMap: Record<string, string> = {
            'new': 'ใหม่',
            'like_new': 'เหมือนใหม่',
            'good': 'สภาพดี',
            'fair': 'ใช้งานได้',
            'used': 'มือสอง',
            'poor': 'ซาก',
        }

        const aiAdvice = await getAIPriceAdvice({
            title,
            category,
            subcategory,
            condition: conditionMap[input.condition] || input.condition,
            specs: input.specs
        })

        if (aiAdvice) {
            return {
                minPrice: aiAdvice.priceRange.min,
                maxPrice: aiAdvice.priceRange.max,
                avgPrice: aiAdvice.marketPrice,
                quickSellPrice: aiAdvice.quickSellPrice,
                maxProfitPrice: aiAdvice.maxPrice,
                confidence: aiAdvice.confidence,
                factors: aiAdvice.pricingFactors.map(f => ({
                    name_th: f.factor,
                    name_en: f.factor,
                    impact: f.impact,
                    percentage: 0,
                    icon: f.impact === 'positive' ? '✅' : f.impact === 'negative' ? '📉' : '➖'
                })),
                insights: [
                    `💡 ${aiAdvice.reasoning}`,
                    ...aiAdvice.marketInsights.map(i => `📊 ${i}`)
                ],
                source: 'ai-enhanced',
                aiReasoning: aiAdvice.reasoning,
                aiInsights: aiAdvice.marketInsights,
                isLoading: false
            }
        }
    } catch (error) {
        console.error('[HybridPriceEstimate] AI enhancement failed:', error)
    }

    // Fallback to rule-based
    return {
        ...ruleBasedResult,
        source: 'rule-based',
        isLoading: false
    }
}

// ============================================
// EXPORTS
// ============================================

export { smartRound }

