/**
 * AI DYNAMIC FORM SELECTOR - Form Schema Configuration
 * 
 * ระบบจัดการฟอร์มอัจฉริยะที่เปลี่ยนตามหมวดหมู่สินค้า
 * 
 * หลักการ:
 * 1. ทุกฟิลด์เป็น Optional - ไม่บังคับกรอก
 * 2. AI แนะนำ แต่ไม่รบกวน
 * 3. ฟอร์มเปลี่ยนทันทีเมื่อหมวดหมู่เปลี่ยน
 * 4. เก็บค่าที่กรอกไว้ถ้าฟิลด์ยังตรงกับหมวดใหม่
 */

// ========================================
// FIELD TYPES - ประเภทของฟิลด์
// ========================================
export type FieldType =
    | 'text'           // ข้อความทั่วไป
    | 'number'         // ตัวเลข
    | 'select'         // Dropdown เลือกตัวเลือก
    | 'multi-select'   // เลือกหลายตัวเลือก
    | 'year'           // ปี (dropdown)
    | 'color'          // สี (color picker หรือ dropdown)
    | 'condition'      // สภาพสินค้า (มือหนึ่ง/มือสอง)
    | 'warranty'       // ประกัน
    | 'textarea'       // ข้อความยาว
    | 'checkbox'       // checkbox
    | 'range'          // ช่วงตัวเลข (min-max)

// ========================================
// FIELD DEFINITION - การกำหนดฟิลด์
// ========================================
export interface FormField {
    id: string                      // รหัสฟิลด์
    name_th: string                 // ชื่อภาษาไทย
    name_en: string                 // ชื่อภาษาอังกฤษ
    type: FieldType                 // ประเภทฟิลด์
    placeholder_th?: string         // Placeholder ภาษาไทย
    placeholder_en?: string         // Placeholder ภาษาอังกฤษ
    options?: Array<{               // ตัวเลือก (สำหรับ select/multi-select)
        value: string
        label_th: string
        label_en: string
    }>
    unit?: string                   // หน่วย เช่น "บาท", "กม.", "ปี"
    aiTip_th?: string               // คำแนะนำจาก AI (ภาษาไทย)
    aiTip_en?: string               // คำแนะนำจาก AI (ภาษาอังกฤษ)
    priority: number                // ลำดับความสำคัญ (1 = สูงสุด)
    showByDefault: boolean          // แสดงเป็นค่าเริ่มต้น
}

// ========================================
// FORM SCHEMA - โครงสร้างฟอร์มแต่ละหมวด
// ========================================
export interface FormSchema {
    categoryId: number              // รหัสหมวดหมู่
    categoryName_th: string
    categoryName_en: string
    subcategoryId?: number          // รหัสหมวดย่อย (optional)
    fields: FormField[]             // ฟิลด์ทั้งหมด
    hiddenFields?: string[]         // ฟิลด์ที่ต้องซ่อน (จากฟอร์มทั่วไป)
}

// ========================================
// COMMON FIELDS - ฟิลด์ทั่วไปที่ใช้ร่วมกัน
// ========================================
export const COMMON_FIELDS: Record<string, FormField> = {
    brand: {
        id: 'brand',
        name_th: 'ยี่ห้อ/แบรนด์',
        name_en: 'Brand',
        type: 'text',
        placeholder_th: 'ระบุยี่ห้อ เช่น Apple, Samsung, Sony',
        placeholder_en: 'Enter brand e.g. Apple, Samsung, Sony',
        aiTip_th: 'การระบุยี่ห้อช่วยให้ผู้ซื้อค้นหาเจอง่ายขึ้น',
        aiTip_en: 'Specifying brand helps buyers find your item',
        priority: 1,
        showByDefault: true
    },
    model: {
        id: 'model',
        name_th: 'รุ่น',
        name_en: 'Model',
        type: 'text',
        placeholder_th: 'ระบุรุ่น เช่น iPhone 15, Galaxy S24',
        placeholder_en: 'Enter model e.g. iPhone 15, Galaxy S24',
        priority: 2,
        showByDefault: true
    },
    condition: {
        id: 'condition',
        name_th: 'สภาพสินค้า',
        name_en: 'Condition',
        type: 'select',
        options: [
            { value: 'new', label_th: 'ใหม่ (ยังไม่แกะกล่อง)', label_en: 'New (Sealed)' },
            { value: 'like_new', label_th: 'ใหม่มาก (แกะกล่องแล้ว)', label_en: 'Like New (Opened)' },
            { value: 'excellent', label_th: 'สภาพดีเยี่ยม', label_en: 'Excellent' },
            { value: 'good', label_th: 'สภาพดี', label_en: 'Good' },
            { value: 'fair', label_th: 'สภาพพอใช้', label_en: 'Fair' },
            { value: 'for_parts', label_th: 'เพื่อซ่อม/ชิ้นส่วน', label_en: 'For Parts/Repair' }
        ],
        aiTip_th: 'สินค้าสภาพดีมักขายได้เร็วกว่า',
        aiTip_en: 'Items in better condition sell faster',
        priority: 3,
        showByDefault: true
    },
    color: {
        id: 'color',
        name_th: 'สี',
        name_en: 'Color',
        type: 'text',
        placeholder_th: 'ระบุสี เช่น ดำ, ขาว, เงิน',
        placeholder_en: 'Enter color e.g. Black, White, Silver',
        priority: 5,
        showByDefault: false
    },
    warranty: {
        id: 'warranty',
        name_th: 'ประกัน',
        name_en: 'Warranty',
        type: 'select',
        options: [
            { value: 'none', label_th: 'ไม่มีประกัน', label_en: 'No Warranty' },
            { value: 'store', label_th: 'ประกันร้าน', label_en: 'Store Warranty' },
            { value: 'brand_3m', label_th: 'ประกันศูนย์ 3 เดือน', label_en: 'Brand Warranty 3 months' },
            { value: 'brand_6m', label_th: 'ประกันศูนย์ 6 เดือน', label_en: 'Brand Warranty 6 months' },
            { value: 'brand_1y', label_th: 'ประกันศูนย์ 1 ปี', label_en: 'Brand Warranty 1 year' },
            { value: 'brand_2y', label_th: 'ประกันศูนย์ 2 ปี', label_en: 'Brand Warranty 2 years' }
        ],
        aiTip_th: 'สินค้ามีประกันมักขายได้ราคาดีกว่า',
        aiTip_en: 'Items with warranty typically sell for higher prices',
        priority: 6,
        showByDefault: false
    },
    purchase_year: {
        id: 'purchase_year',
        name_th: 'ปีที่ซื้อ',
        name_en: 'Purchase Year',
        type: 'year',
        placeholder_th: 'เลือกปีที่ซื้อ',
        placeholder_en: 'Select purchase year',
        priority: 7,
        showByDefault: false
    },
    accessories: {
        id: 'accessories',
        name_th: 'อุปกรณ์เสริมที่มี',
        name_en: 'Included Accessories',
        type: 'text',
        placeholder_th: 'เช่น กล่อง, สายชาร์จ, หูฟัง',
        placeholder_en: 'e.g. Box, Charger, Earphones',
        priority: 8,
        showByDefault: false
    }
}

// ========================================
// CATEGORY-SPECIFIC FIELDS
// ========================================

// ===== AUTOMOTIVE (Category 1) =====
export const AUTOMOTIVE_FIELDS: FormField[] = [
    {
        id: 'vehicle_brand',
        name_th: 'ยี่ห้อรถ',
        name_en: 'Vehicle Brand',
        type: 'select',
        options: [
            { value: 'toyota', label_th: 'Toyota', label_en: 'Toyota' },
            { value: 'honda', label_th: 'Honda', label_en: 'Honda' },
            { value: 'isuzu', label_th: 'Isuzu', label_en: 'Isuzu' },
            { value: 'mitsubishi', label_th: 'Mitsubishi', label_en: 'Mitsubishi' },
            { value: 'mazda', label_th: 'Mazda', label_en: 'Mazda' },
            { value: 'nissan', label_th: 'Nissan', label_en: 'Nissan' },
            { value: 'ford', label_th: 'Ford', label_en: 'Ford' },
            { value: 'chevrolet', label_th: 'Chevrolet', label_en: 'Chevrolet' },
            { value: 'benz', label_th: 'Mercedes-Benz', label_en: 'Mercedes-Benz' },
            { value: 'bmw', label_th: 'BMW', label_en: 'BMW' },
            { value: 'other', label_th: 'อื่นๆ', label_en: 'Other' }
        ],
        priority: 1,
        showByDefault: true
    },
    {
        id: 'vehicle_model',
        name_th: 'รุ่น',
        name_en: 'Model',
        type: 'text',
        placeholder_th: 'เช่น Camry, Civic, D-Max',
        placeholder_en: 'e.g. Camry, Civic, D-Max',
        priority: 2,
        showByDefault: true
    },
    {
        id: 'vehicle_year',
        name_th: 'ปีจดทะเบียน',
        name_en: 'Registration Year',
        type: 'year',
        aiTip_th: 'ปีรถยิ่งใหม่ ยิ่งขายได้ราคาดี',
        aiTip_en: 'Newer cars sell for better prices',
        priority: 3,
        showByDefault: true
    },
    {
        id: 'mileage',
        name_th: 'เลขไมล์',
        name_en: 'Mileage',
        type: 'number',
        unit: 'กม.',
        placeholder_th: 'ระบุเลขไมล์ปัจจุบัน',
        placeholder_en: 'Enter current mileage',
        aiTip_th: 'เลขไมล์ต่ำมักขายได้ราคาดี ผู้ซื้อมักถามเลขไมล์เป็นอันดับแรก',
        aiTip_en: 'Lower mileage sells better. Buyers often ask mileage first.',
        priority: 4,
        showByDefault: true
    },
    {
        id: 'gear_type',
        name_th: 'ประเภทเกียร์',
        name_en: 'Transmission',
        type: 'select',
        options: [
            { value: 'auto', label_th: 'เกียร์ออโต้', label_en: 'Automatic' },
            { value: 'manual', label_th: 'เกียร์ธรรมดา', label_en: 'Manual' },
            { value: 'cvt', label_th: 'CVT', label_en: 'CVT' }
        ],
        priority: 5,
        showByDefault: true
    },
    {
        id: 'fuel_type',
        name_th: 'ประเภทเชื้อเพลิง',
        name_en: 'Fuel Type',
        type: 'select',
        options: [
            { value: 'gasoline', label_th: 'เบนซิน', label_en: 'Gasoline' },
            { value: 'diesel', label_th: 'ดีเซล', label_en: 'Diesel' },
            { value: 'hybrid', label_th: 'ไฮบริด', label_en: 'Hybrid' },
            { value: 'electric', label_th: 'ไฟฟ้า', label_en: 'Electric' },
            { value: 'lpg', label_th: 'แก๊ส LPG', label_en: 'LPG' }
        ],
        priority: 6,
        showByDefault: false
    },
    {
        id: 'vehicle_color',
        name_th: 'สีรถ',
        name_en: 'Vehicle Color',
        type: 'text',
        placeholder_th: 'เช่น ขาว, ดำ, เงิน',
        placeholder_en: 'e.g. White, Black, Silver',
        priority: 7,
        showByDefault: false
    },
    {
        id: 'vehicle_condition',
        name_th: 'สภาพรถ',
        name_en: 'Vehicle Condition',
        type: 'select',
        options: [
            { value: 'excellent', label_th: 'สภาพดีเยี่ยม ไม่เคยชน', label_en: 'Excellent, Never Crashed' },
            { value: 'good', label_th: 'สภาพดี มีรอยนิดหน่อย', label_en: 'Good, Minor Scratches' },
            { value: 'fair', label_th: 'สภาพพอใช้', label_en: 'Fair Condition' },
            { value: 'needs_repair', label_th: 'ต้องซ่อม', label_en: 'Needs Repair' }
        ],
        priority: 8,
        showByDefault: true
    }
]

// ===== REAL ESTATE (Category 2) =====
export const REAL_ESTATE_FIELDS: FormField[] = [
    {
        id: 'listing_type',
        name_th: 'ประเภทประกาศ',
        name_en: 'Listing Type',
        type: 'select',
        options: [
            { value: 'sale', label_th: 'ขาย', label_en: 'For Sale' },
            { value: 'rent', label_th: 'ให้เช่า', label_en: 'For Rent' },
            { value: 'sale_rent', label_th: 'ขายหรือให้เช่า', label_en: 'Sale or Rent' }
        ],
        priority: 1,
        showByDefault: true
    },
    {
        id: 'property_type',
        name_th: 'ประเภทอสังหาฯ',
        name_en: 'Property Type',
        type: 'select',
        options: [
            { value: 'condo', label_th: 'คอนโด', label_en: 'Condominium' },
            { value: 'house', label_th: 'บ้านเดี่ยว', label_en: 'House' },
            { value: 'townhouse', label_th: 'ทาวน์เฮาส์', label_en: 'Townhouse' },
            { value: 'land', label_th: 'ที่ดิน', label_en: 'Land' },
            { value: 'commercial', label_th: 'อาคารพาณิชย์', label_en: 'Commercial' },
            { value: 'apartment', label_th: 'อพาร์ทเมนต์', label_en: 'Apartment' }
        ],
        priority: 2,
        showByDefault: true
    },
    {
        id: 'area_sqm',
        name_th: 'ขนาดพื้นที่',
        name_en: 'Area Size',
        type: 'number',
        unit: 'ตร.ม.',
        placeholder_th: 'ระบุขนาดพื้นที่ใช้สอย',
        placeholder_en: 'Enter usable area',
        aiTip_th: 'ขนาดพื้นที่เป็นสิ่งแรกที่ผู้ซื้อมักถาม',
        aiTip_en: 'Area size is what buyers ask first',
        priority: 3,
        showByDefault: true
    },
    {
        id: 'bedrooms',
        name_th: 'จำนวนห้องนอน',
        name_en: 'Bedrooms',
        type: 'select',
        options: [
            { value: 'studio', label_th: 'สตูดิโอ', label_en: 'Studio' },
            { value: '1', label_th: '1 ห้อง', label_en: '1 Bedroom' },
            { value: '2', label_th: '2 ห้อง', label_en: '2 Bedrooms' },
            { value: '3', label_th: '3 ห้อง', label_en: '3 Bedrooms' },
            { value: '4', label_th: '4 ห้อง', label_en: '4 Bedrooms' },
            { value: '5+', label_th: '5 ห้องขึ้นไป', label_en: '5+ Bedrooms' }
        ],
        priority: 4,
        showByDefault: true
    },
    {
        id: 'bathrooms',
        name_th: 'จำนวนห้องน้ำ',
        name_en: 'Bathrooms',
        type: 'select',
        options: [
            { value: '1', label_th: '1 ห้อง', label_en: '1 Bathroom' },
            { value: '2', label_th: '2 ห้อง', label_en: '2 Bathrooms' },
            { value: '3', label_th: '3 ห้อง', label_en: '3 Bathrooms' },
            { value: '4+', label_th: '4 ห้องขึ้นไป', label_en: '4+ Bathrooms' }
        ],
        priority: 5,
        showByDefault: true
    },
    {
        id: 'floor',
        name_th: 'ชั้น',
        name_en: 'Floor',
        type: 'text',
        placeholder_th: 'เช่น ชั้น 15, ชั้นล่าง',
        placeholder_en: 'e.g. 15th floor, Ground floor',
        priority: 6,
        showByDefault: false
    },
    {
        id: 'parking',
        name_th: 'ที่จอดรถ',
        name_en: 'Parking',
        type: 'select',
        options: [
            { value: 'none', label_th: 'ไม่มี', label_en: 'None' },
            { value: '1', label_th: '1 คัน', label_en: '1 Car' },
            { value: '2', label_th: '2 คัน', label_en: '2 Cars' },
            { value: '3+', label_th: '3 คันขึ้นไป', label_en: '3+ Cars' }
        ],
        priority: 7,
        showByDefault: false
    },
    {
        id: 'furnishing',
        name_th: 'เฟอร์นิเจอร์',
        name_en: 'Furnishing',
        type: 'select',
        options: [
            { value: 'none', label_th: 'ไม่มีเฟอร์นิเจอร์', label_en: 'Unfurnished' },
            { value: 'partial', label_th: 'มีบางส่วน', label_en: 'Partially Furnished' },
            { value: 'full', label_th: 'ครบชุด', label_en: 'Fully Furnished' }
        ],
        priority: 8,
        showByDefault: false
    }
]

// ===== MOBILE & TABLETS (Category 3) =====
// 📱 Enhanced Smart Form - Based on Buyer/Seller Psychology Analysis
// Critical fields: brand, model, storage, battery_health, screen_condition, price
// Important fields: color, accessories, warranty, network_status
export const MOBILE_FIELDS: FormField[] = [
    // ========== CRITICAL FIELDS (ต้องมี - ผู้ซื้อถามเป็นอันดับแรก) ==========
    {
        id: 'phone_brand',
        name_th: 'แบรนด์',
        name_en: 'Brand',
        type: 'select',
        options: [
            { value: 'apple', label_th: 'Apple (iPhone)', label_en: 'Apple (iPhone)' },
            { value: 'samsung', label_th: 'Samsung', label_en: 'Samsung' },
            { value: 'xiaomi', label_th: 'Xiaomi (Redmi/POCO)', label_en: 'Xiaomi (Redmi/POCO)' },
            { value: 'oppo', label_th: 'OPPO', label_en: 'OPPO' },
            { value: 'vivo', label_th: 'Vivo', label_en: 'Vivo' },
            { value: 'realme', label_th: 'Realme', label_en: 'Realme' },
            { value: 'huawei', label_th: 'Huawei', label_en: 'Huawei' },
            { value: 'google', label_th: 'Google Pixel', label_en: 'Google Pixel' },
            { value: 'oneplus', label_th: 'OnePlus', label_en: 'OnePlus' },
            { value: 'asus', label_th: 'ASUS (ROG Phone)', label_en: 'ASUS (ROG Phone)' },
            { value: 'nothing', label_th: 'Nothing', label_en: 'Nothing' },
            { value: 'nokia', label_th: 'Nokia', label_en: 'Nokia' },
            { value: 'sony', label_th: 'Sony', label_en: 'Sony' },
            { value: 'other', label_th: 'อื่นๆ', label_en: 'Other' }
        ],
        aiTip_th: '🎯 แบรนด์ยอดนิยม: Apple, Samsung ขายได้เร็วที่สุด',
        aiTip_en: '🎯 Popular brands: Apple, Samsung sell fastest',
        priority: 1,
        showByDefault: true
    },
    {
        id: 'phone_model',
        name_th: 'รุ่น',
        name_en: 'Model',
        type: 'text',
        placeholder_th: 'เช่น iPhone 15 Pro Max, Galaxy S24 Ultra',
        placeholder_en: 'e.g. iPhone 15 Pro Max, Galaxy S24 Ultra',
        aiTip_th: '💡 ระบุรุ่นให้ชัดเจน เช่น "iPhone 15 Pro" ไม่ใช่แค่ "iPhone"',
        aiTip_en: '💡 Be specific, e.g. "iPhone 15 Pro" not just "iPhone"',
        priority: 2,
        showByDefault: true
    },
    {
        id: 'storage',
        name_th: 'ความจุ',
        name_en: 'Storage',
        type: 'select',
        options: [
            { value: '16gb', label_th: '16 GB', label_en: '16 GB' },
            { value: '32gb', label_th: '32 GB', label_en: '32 GB' },
            { value: '64gb', label_th: '64 GB', label_en: '64 GB' },
            { value: '128gb', label_th: '128 GB', label_en: '128 GB' },
            { value: '256gb', label_th: '256 GB', label_en: '256 GB' },
            { value: '512gb', label_th: '512 GB', label_en: '512 GB' },
            { value: '1tb', label_th: '1 TB', label_en: '1 TB' }
        ],
        aiTip_th: '📊 ความจุสูง = ราคาสูงกว่า 10-20%',
        aiTip_en: '📊 Higher storage = 10-20% higher price',
        priority: 3,
        showByDefault: true
    },
    {
        id: 'battery_health',
        name_th: 'สุขภาพแบตเตอรี่',
        name_en: 'Battery Health',
        type: 'select',
        options: [
            { value: '100', label_th: '100% (ใหม่/เปลี่ยนใหม่)', label_en: '100% (New/Replaced)' },
            { value: '95-99', label_th: '95-99% (ดีมาก)', label_en: '95-99% (Excellent)' },
            { value: '90-94', label_th: '90-94% (ดี)', label_en: '90-94% (Good)' },
            { value: '85-89', label_th: '85-89% (ปกติ)', label_en: '85-89% (Normal)' },
            { value: '80-84', label_th: '80-84% (ควรเปลี่ยน)', label_en: '80-84% (Should Replace)' },
            { value: 'below_80', label_th: 'ต่ำกว่า 80%', label_en: 'Below 80%' },
            { value: 'replaced', label_th: 'เปลี่ยนแบตใหม่แล้ว', label_en: 'Battery Replaced' },
            { value: 'unknown', label_th: 'ไม่ทราบ', label_en: 'Unknown' }
        ],
        aiTip_th: '🔋 แบต 90%+ ขายได้ราคาดี | แบต 85%+ ยังใช้ได้ปกติ',
        aiTip_en: '🔋 90%+ sells well | 85%+ still usable',
        priority: 4,
        showByDefault: true
    },
    {
        id: 'screen_condition',
        name_th: 'สภาพหน้าจอ',
        name_en: 'Screen Condition',
        type: 'select',
        options: [
            { value: 'perfect', label_th: 'สมบูรณ์แบบ ไม่มีรอยเลย', label_en: 'Perfect, No Scratches' },
            { value: 'excellent', label_th: 'ดีมาก รอยเล็กน้อยมองไม่เห็น', label_en: 'Excellent, Invisible Minor Marks' },
            { value: 'good', label_th: 'ดี มีรอยบ้างแต่ไม่กระทบการใช้งาน', label_en: 'Good, Minor Scratches' },
            { value: 'fair', label_th: 'พอใช้ มีรอยชัดเจน', label_en: 'Fair, Visible Scratches' },
            { value: 'cracked', label_th: 'จอแตก/ร้าว', label_en: 'Cracked/Damaged' }
        ],
        aiTip_th: '📱 หน้าจอสมบูรณ์ = ขายได้ราคาดีกว่า 15-20%',
        aiTip_en: '📱 Perfect screen = 15-20% higher price',
        priority: 5,
        showByDefault: true
    },
    {
        id: 'phone_condition',
        name_th: 'สภาพตัวเครื่อง (ฝาหลัง/ขอบ)',
        name_en: 'Body Condition (Back/Frame)',
        type: 'select',
        options: [
            { value: 'new', label_th: 'ใหม่ ยังไม่แกะซีล', label_en: 'New, Sealed' },
            { value: 'like_new', label_th: 'ใหม่มาก ไม่มีรอย', label_en: 'Like New, No Marks' },
            { value: 'excellent', label_th: 'ดีเยี่ยม รอยเล็กน้อย', label_en: 'Excellent, Minor Marks' },
            { value: 'good', label_th: 'ดี มีรอยใช้งานบ้าง', label_en: 'Good, Normal Wear' },
            { value: 'fair', label_th: 'พอใช้ มีรอยชัดเจน', label_en: 'Fair, Visible Wear' },
            { value: 'dented', label_th: 'มีรอยบุบ/งอ', label_en: 'Dented/Bent' }
        ],
        priority: 6,
        showByDefault: true
    },
    // ========== IMPORTANT FIELDS (สำคัญ - ช่วยตัดสินใจซื้อ) ==========
    {
        id: 'phone_color',
        name_th: 'สี',
        name_en: 'Color',
        type: 'text',
        placeholder_th: 'เช่น Space Black, Natural Titanium, Deep Purple',
        placeholder_en: 'e.g. Space Black, Natural Titanium, Deep Purple',
        aiTip_th: '🎨 สียอดนิยม: ดำ, ขาว, น้ำเงิน ขายง่ายกว่า',
        aiTip_en: '🎨 Popular colors: Black, White, Blue sell faster',
        priority: 7,
        showByDefault: true
    },
    {
        id: 'ram',
        name_th: 'RAM',
        name_en: 'RAM',
        type: 'select',
        options: [
            { value: '2gb', label_th: '2 GB', label_en: '2 GB' },
            { value: '3gb', label_th: '3 GB', label_en: '3 GB' },
            { value: '4gb', label_th: '4 GB', label_en: '4 GB' },
            { value: '6gb', label_th: '6 GB', label_en: '6 GB' },
            { value: '8gb', label_th: '8 GB', label_en: '8 GB' },
            { value: '12gb', label_th: '12 GB', label_en: '12 GB' },
            { value: '16gb', label_th: '16 GB', label_en: '16 GB' },
            { value: 'unknown', label_th: 'ไม่ทราบ', label_en: 'Unknown' }
        ],
        priority: 8,
        showByDefault: false
    },
    {
        id: 'network_status',
        name_th: 'สถานะเครื่อง',
        name_en: 'Network Status',
        type: 'select',
        options: [
            { value: 'unlocked', label_th: 'ปลดล็อคแล้ว ใช้ได้ทุกค่าย', label_en: 'Unlocked, All Carriers' },
            { value: 'ais', label_th: 'ติดล็อค AIS', label_en: 'Locked to AIS' },
            { value: 'true', label_th: 'ติดล็อค True', label_en: 'Locked to True' },
            { value: 'dtac', label_th: 'ติดล็อค Dtac', label_en: 'Locked to Dtac' },
            { value: 'installment', label_th: 'ติดสัญญา/ผ่อนอยู่', label_en: 'Under Contract/Financing' }
        ],
        aiTip_th: '⚠️ เครื่องปลดล็อคขายได้ราคาดีกว่า',
        aiTip_en: '⚠️ Unlocked devices sell for higher prices',
        priority: 9,
        showByDefault: true
    },
    {
        id: 'icloud_status',
        name_th: 'สถานะ iCloud/Google Account',
        name_en: 'iCloud/Google Account Status',
        type: 'select',
        options: [
            { value: 'logged_out', label_th: 'ออกจากระบบแล้ว (พร้อมขาย)', label_en: 'Logged Out (Ready to Sell)' },
            { value: 'will_logout', label_th: 'จะออกให้ตอนส่งมอบ', label_en: 'Will Logout on Delivery' },
            { value: 'unknown', label_th: 'ไม่ทราบ', label_en: 'Unknown' }
        ],
        aiTip_th: '🔐 สำคัญมาก! ต้องออกจาก iCloud/Google ก่อนขาย',
        aiTip_en: '🔐 Critical! Must logout before selling',
        priority: 10,
        showByDefault: true
    },
    // ========== TRUST FIELDS (สร้างความน่าเชื่อถือ) ==========
    {
        id: 'warranty',
        name_th: 'ประกัน',
        name_en: 'Warranty',
        type: 'select',
        options: [
            { value: 'none', label_th: 'ไม่มีประกัน', label_en: 'No Warranty' },
            { value: 'applecare', label_th: 'AppleCare+ (เหลือกี่เดือนระบุเพิ่ม)', label_en: 'AppleCare+ (Specify Remaining)' },
            { value: 'brand_3m', label_th: 'ประกันศูนย์ เหลือ 3 เดือน', label_en: 'Brand Warranty 3 months' },
            { value: 'brand_6m', label_th: 'ประกันศูนย์ เหลือ 6 เดือน', label_en: 'Brand Warranty 6 months' },
            { value: 'brand_1y', label_th: 'ประกันศูนย์ เหลือ 1 ปี', label_en: 'Brand Warranty 1 year' },
            { value: 'store', label_th: 'ประกันร้าน', label_en: 'Store Warranty' },
            { value: 'expired', label_th: 'หมดประกันแล้ว', label_en: 'Warranty Expired' }
        ],
        aiTip_th: '🛡️ มีประกัน = เพิ่มความมั่นใจ ขายได้เร็วขึ้น',
        aiTip_en: '🛡️ Warranty = More confidence, sells faster',
        priority: 11,
        showByDefault: false
    },
    {
        id: 'has_receipt',
        name_th: 'ใบเสร็จ/ใบรับประกัน',
        name_en: 'Receipt/Warranty Card',
        type: 'select',
        options: [
            { value: 'yes', label_th: 'มี (แสดงได้)', label_en: 'Yes (Can Show)' },
            { value: 'no', label_th: 'ไม่มี', label_en: 'No' }
        ],
        aiTip_th: '📄 มีใบเสร็จ = พิสูจน์ที่มา เพิ่มความน่าเชื่อถือ',
        aiTip_en: '📄 Receipt = Proves origin, increases trust',
        priority: 12,
        showByDefault: false
    },
    {
        id: 'phone_accessories',
        name_th: 'อุปกรณ์ที่มี',
        name_en: 'Included Accessories',
        type: 'multi-select',
        options: [
            { value: 'box', label_th: '📦 กล่อง', label_en: '📦 Original Box' },
            { value: 'charger', label_th: '🔌 สายชาร์จ', label_en: '🔌 Charging Cable' },
            { value: 'adapter', label_th: '🔋 หัวชาร์จ', label_en: '🔋 Power Adapter' },
            { value: 'earphones', label_th: '🎧 หูฟัง', label_en: '🎧 Earphones' },
            { value: 'case', label_th: '📱 เคส', label_en: '📱 Case' },
            { value: 'screen_protector', label_th: '🖼️ ฟิล์มกระจก', label_en: '🖼️ Screen Protector' },
            { value: 'sim_ejector', label_th: '📍 เข็มจิ้ม SIM', label_en: '📍 SIM Ejector' },
            { value: 'manual', label_th: '📖 คู่มือ', label_en: '📖 Manual' }
        ],
        aiTip_th: '🎁 ครบกล่อง = ขายได้ราคาดีกว่า 5-10%',
        aiTip_en: '🎁 Complete box = 5-10% higher price',
        priority: 13,
        showByDefault: true
    },
    // ========== CONTEXT FIELDS (ข้อมูลเพิ่มเติม) ==========
    {
        id: 'original_purchase',
        name_th: 'ซื้อจากที่ไหน',
        name_en: 'Original Purchase',
        type: 'select',
        options: [
            { value: 'official_store', label_th: 'Apple Store / Samsung Store ทางการ', label_en: 'Official Brand Store' },
            { value: 'authorized', label_th: 'ตัวแทนจำหน่าย (iStudio, AIS, True)', label_en: 'Authorized Reseller' },
            { value: 'online', label_th: 'ออนไลน์ (Shopee, Lazada)', label_en: 'Online (Shopee, Lazada)' },
            { value: 'secondhand', label_th: 'มือสอง', label_en: 'Secondhand' },
            { value: 'gift', label_th: 'ได้รับเป็นของขวัญ', label_en: 'Received as Gift' },
            { value: 'other', label_th: 'อื่นๆ', label_en: 'Other' }
        ],
        priority: 14,
        showByDefault: false
    },
    {
        id: 'purchase_date',
        name_th: 'ซื้อเมื่อ',
        name_en: 'Purchase Date',
        type: 'select',
        options: [
            { value: '1m', label_th: 'ไม่เกิน 1 เดือน', label_en: 'Less than 1 month' },
            { value: '3m', label_th: '1-3 เดือน', label_en: '1-3 months' },
            { value: '6m', label_th: '3-6 เดือน', label_en: '3-6 months' },
            { value: '1y', label_th: '6 เดือน - 1 ปี', label_en: '6 months - 1 year' },
            { value: '2y', label_th: '1-2 ปี', label_en: '1-2 years' },
            { value: '3y', label_th: '2-3 ปี', label_en: '2-3 years' },
            { value: 'over3y', label_th: 'มากกว่า 3 ปี', label_en: 'Over 3 years' }
        ],
        priority: 15,
        showByDefault: false
    },
    {
        id: 'selling_reason',
        name_th: 'สาเหตุที่ขาย',
        name_en: 'Reason for Selling',
        type: 'select',
        options: [
            { value: 'upgrade', label_th: 'เปลี่ยนรุ่นใหม่', label_en: 'Upgrading to New Model' },
            { value: 'switch', label_th: 'เปลี่ยนแบรนด์ (iPhone↔Android)', label_en: 'Switching Brands' },
            { value: 'extra', label_th: 'เครื่องสำรอง ไม่ได้ใช้', label_en: 'Extra Device, Not Using' },
            { value: 'gift_unused', label_th: 'ได้มา ไม่ได้ใช้งาน', label_en: 'Received, Never Used' },
            { value: 'need_money', label_th: 'ต้องการเงินสด', label_en: 'Need Cash' },
            { value: 'other', label_th: 'อื่นๆ', label_en: 'Other' }
        ],
        aiTip_th: '📝 ระบุเหตุผล สร้างความน่าเชื่อถือ',
        aiTip_en: '📝 Stating reason builds trust',
        priority: 16,
        showByDefault: false
    },
    // ========== ISSUE DISCLOSURE (แจ้งปัญหา - สร้างความโปร่งใส) ==========
    {
        id: 'known_issues',
        name_th: 'ปัญหาที่ทราบ (ถ้ามี)',
        name_en: 'Known Issues (If Any)',
        type: 'multi-select',
        options: [
            { value: 'none', label_th: '✅ ไม่มีปัญหา', label_en: '✅ No Issues' },
            { value: 'battery_drain', label_th: '🔋 แบตหมดไว', label_en: '🔋 Battery Drains Fast' },
            { value: 'speaker', label_th: '🔊 ลำโพงเสียงเบา/ไม่ดัง', label_en: '🔊 Speaker Issues' },
            { value: 'mic', label_th: '🎤 ไมค์มีปัญหา', label_en: '🎤 Microphone Issues' },
            { value: 'camera', label_th: '📷 กล้องมีปัญหา', label_en: '📷 Camera Issues' },
            { value: 'faceid', label_th: '👤 Face ID ใช้ไม่ได้', label_en: '👤 Face ID Not Working' },
            { value: 'touchid', label_th: '👆 Touch ID ใช้ไม่ได้', label_en: '👆 Touch ID Not Working' },
            { value: 'wifi', label_th: '📶 WiFi/Bluetooth มีปัญหา', label_en: '📶 WiFi/Bluetooth Issues' },
            { value: 'charging', label_th: '⚡ ชาร์จไม่เข้า/ช้า', label_en: '⚡ Charging Issues' },
            { value: 'screen_burn', label_th: '🔥 จอ Burn-in', label_en: '🔥 Screen Burn-in' },
            { value: 'ghost_touch', label_th: '👻 จอกดเอง (Ghost Touch)', label_en: '👻 Ghost Touch' }
        ],
        aiTip_th: '💡 แจ้งปัญหาตรงๆ = ไม่ต้องถกเถียงภายหลัง',
        aiTip_en: '💡 Disclosing issues = Avoid disputes later',
        priority: 17,
        showByDefault: false
    }
]

// ===== COMPUTERS (Category 4) =====
export const COMPUTER_FIELDS: FormField[] = [
    COMMON_FIELDS.brand,
    COMMON_FIELDS.model,
    {
        id: 'cpu',
        name_th: 'CPU/Processor',
        name_en: 'CPU/Processor',
        type: 'text',
        placeholder_th: 'เช่น Intel Core i5-12400, AMD Ryzen 5 5600X',
        placeholder_en: 'e.g. Intel Core i5-12400, AMD Ryzen 5 5600X',
        priority: 3,
        showByDefault: false
    },
    {
        id: 'ram',
        name_th: 'RAM',
        name_en: 'RAM',
        type: 'select',
        options: [
            { value: '4gb', label_th: '4 GB', label_en: '4 GB' },
            { value: '8gb', label_th: '8 GB', label_en: '8 GB' },
            { value: '16gb', label_th: '16 GB', label_en: '16 GB' },
            { value: '32gb', label_th: '32 GB', label_en: '32 GB' },
            { value: '64gb', label_th: '64 GB', label_en: '64 GB' }
        ],
        priority: 4,
        showByDefault: false
    },
    {
        id: 'storage_type',
        name_th: 'พื้นที่เก็บข้อมูล',
        name_en: 'Storage',
        type: 'text',
        placeholder_th: 'เช่น SSD 512GB, HDD 1TB',
        placeholder_en: 'e.g. SSD 512GB, HDD 1TB',
        priority: 5,
        showByDefault: false
    },
    {
        id: 'gpu',
        name_th: 'การ์ดจอ',
        name_en: 'Graphics Card',
        type: 'text',
        placeholder_th: 'เช่น RTX 4060, Intel Iris Xe',
        placeholder_en: 'e.g. RTX 4060, Intel Iris Xe',
        priority: 6,
        showByDefault: false
    },
    {
        id: 'screen_size',
        name_th: 'ขนาดหน้าจอ',
        name_en: 'Screen Size',
        type: 'text',
        placeholder_th: 'เช่น 15.6 นิ้ว, 27 นิ้ว',
        placeholder_en: 'e.g. 15.6 inches, 27 inches',
        priority: 7,
        showByDefault: false
    },
    COMMON_FIELDS.condition,
    COMMON_FIELDS.warranty
]

// ===== AMULETS (Category 9) =====
export const AMULET_FIELDS: FormField[] = [
    {
        id: 'amulet_name',
        name_th: 'ชื่อพระ/รุ่น',
        name_en: 'Amulet Name/Edition',
        type: 'text',
        placeholder_th: 'เช่น หลวงพ่อโต รุ่นแรก, พระขุนแผน',
        placeholder_en: 'e.g. Luang Pho To First Edition',
        priority: 1,
        showByDefault: true
    },
    {
        id: 'temple',
        name_th: 'วัด',
        name_en: 'Temple',
        type: 'text',
        placeholder_th: 'ระบุชื่อวัด',
        placeholder_en: 'Enter temple name',
        priority: 2,
        showByDefault: true
    },
    {
        id: 'monk',
        name_th: 'พระเกจิ/เจ้าอาวาส',
        name_en: 'Monk/Abbot',
        type: 'text',
        placeholder_th: 'ระบุชื่อพระเกจิ',
        placeholder_en: 'Enter monk name',
        priority: 3,
        showByDefault: true
    },
    {
        id: 'amulet_year',
        name_th: 'ปี พ.ศ.',
        name_en: 'Year (B.E.)',
        type: 'text',
        placeholder_th: 'เช่น 2515, 2530',
        placeholder_en: 'e.g. 2515, 2530',
        aiTip_th: 'พระปีเก่ามักมีมูลค่าสูง',
        aiTip_en: 'Older amulets are often more valuable',
        priority: 4,
        showByDefault: true
    },
    {
        id: 'material',
        name_th: 'เนื้อ/วัสดุ',
        name_en: 'Material',
        type: 'select',
        options: [
            { value: 'bronze', label_th: 'เนื้อทองแดง', label_en: 'Bronze' },
            { value: 'gold', label_th: 'เนื้อทองคำ', label_en: 'Gold' },
            { value: 'silver', label_th: 'เนื้อเงิน', label_en: 'Silver' },
            { value: 'sacred_powder', label_th: 'เนื้อผง', label_en: 'Sacred Powder' },
            { value: 'lead', label_th: 'เนื้อตะกั่ว', label_en: 'Lead' },
            { value: 'earth', label_th: 'เนื้อดิน', label_en: 'Clay/Earth' },
            { value: 'other', label_th: 'อื่นๆ', label_en: 'Other' }
        ],
        priority: 5,
        showByDefault: true
    },
    {
        id: 'certificate',
        name_th: 'ใบรับรอง/การันตี',
        name_en: 'Certificate/Guarantee',
        type: 'select',
        options: [
            { value: 'none', label_th: 'ไม่มี', label_en: 'None' },
            { value: 'store', label_th: 'การันตีร้าน', label_en: 'Store Guarantee' },
            { value: 'association', label_th: 'ใบรับรองสมาคม', label_en: 'Association Certificate' }
        ],
        aiTip_th: 'พระมีใบรับรองมักขายได้ราคาดีกว่า',
        aiTip_en: 'Certified amulets sell for higher prices',
        priority: 6,
        showByDefault: false
    }
]

// ===== CAMERAS (Category 8) =====
export const CAMERA_FIELDS: FormField[] = [
    {
        id: 'camera_brand',
        name_th: 'ยี่ห้อ',
        name_en: 'Brand',
        type: 'select',
        options: [
            { value: 'canon', label_th: 'Canon', label_en: 'Canon' },
            { value: 'nikon', label_th: 'Nikon', label_en: 'Nikon' },
            { value: 'sony', label_th: 'Sony', label_en: 'Sony' },
            { value: 'fujifilm', label_th: 'Fujifilm', label_en: 'Fujifilm' },
            { value: 'panasonic', label_th: 'Panasonic', label_en: 'Panasonic' },
            { value: 'olympus', label_th: 'Olympus', label_en: 'Olympus' },
            { value: 'leica', label_th: 'Leica', label_en: 'Leica' },
            { value: 'gopro', label_th: 'GoPro', label_en: 'GoPro' },
            { value: 'dji', label_th: 'DJI', label_en: 'DJI' },
            { value: 'other', label_th: 'อื่นๆ', label_en: 'Other' }
        ],
        priority: 1,
        showByDefault: true
    },
    COMMON_FIELDS.model,
    {
        id: 'camera_type',
        name_th: 'ประเภทกล้อง',
        name_en: 'Camera Type',
        type: 'select',
        options: [
            { value: 'dslr', label_th: 'DSLR', label_en: 'DSLR' },
            { value: 'mirrorless', label_th: 'Mirrorless', label_en: 'Mirrorless' },
            { value: 'compact', label_th: 'กล้องคอมแพค', label_en: 'Compact' },
            { value: 'action', label_th: 'Action Camera', label_en: 'Action Camera' },
            { value: 'instant', label_th: 'กล้องโพลารอยด์', label_en: 'Instant Camera' },
            { value: 'film', label_th: 'กล้องฟิล์ม', label_en: 'Film Camera' }
        ],
        priority: 3,
        showByDefault: true
    },
    {
        id: 'shutter_count',
        name_th: 'จำนวนชัตเตอร์',
        name_en: 'Shutter Count',
        type: 'number',
        placeholder_th: 'ระบุจำนวนชัตเตอร์',
        placeholder_en: 'Enter shutter count',
        aiTip_th: 'ชัตเตอร์ต่ำกว่า 50,000 ครั้งถือว่าใช้น้อย',
        aiTip_en: 'Under 50,000 shots is considered low usage',
        priority: 4,
        showByDefault: false
    },
    {
        id: 'sensor_type',
        name_th: 'ขนาดเซ็นเซอร์',
        name_en: 'Sensor Size',
        type: 'select',
        options: [
            { value: 'full_frame', label_th: 'Full Frame', label_en: 'Full Frame' },
            { value: 'aps_c', label_th: 'APS-C', label_en: 'APS-C' },
            { value: 'micro43', label_th: 'Micro Four Thirds', label_en: 'Micro Four Thirds' },
            { value: '1inch', label_th: '1 นิ้ว', label_en: '1 inch' }
        ],
        priority: 5,
        showByDefault: false
    },
    COMMON_FIELDS.condition,
    COMMON_FIELDS.warranty
]

// ========================================
// FORM SCHEMA REGISTRY - รวมทุกหมวด
// ========================================
export const FORM_SCHEMAS: FormSchema[] = [
    {
        categoryId: 1,
        categoryName_th: 'ยานยนต์',
        categoryName_en: 'Automotive',
        fields: AUTOMOTIVE_FIELDS,
        hiddenFields: ['brand', 'model', 'color', 'size']
    },
    {
        categoryId: 2,
        categoryName_th: 'อสังหาริมทรัพย์',
        categoryName_en: 'Real Estate',
        fields: REAL_ESTATE_FIELDS,
        hiddenFields: ['brand', 'model', 'color', 'warranty', 'serial_number']
    },
    {
        categoryId: 3,
        categoryName_th: 'มือถือและแท็บเล็ต',
        categoryName_en: 'Mobile & Tablets',
        fields: MOBILE_FIELDS,
        hiddenFields: ['mileage', 'vehicle_year']
    },
    {
        categoryId: 4,
        categoryName_th: 'คอมพิวเตอร์และไอที',
        categoryName_en: 'Computers & IT',
        fields: COMPUTER_FIELDS,
        hiddenFields: ['mileage', 'vehicle_year', 'bedrooms']
    },
    // 🔥 NEW: Appliances (5)
    {
        categoryId: 5,
        categoryName_th: 'เครื่องใช้ไฟฟ้า',
        categoryName_en: 'Home Appliances',
        fields: [
            COMMON_FIELDS.brand,
            COMMON_FIELDS.model,
            {
                id: 'appliance_type',
                name_th: 'ประเภทเครื่องใช้ไฟฟ้า',
                name_en: 'Appliance Type',
                type: 'select',
                options: [
                    { value: 'tv', label_th: 'ทีวี', label_en: 'TV' },
                    { value: 'refrigerator', label_th: 'ตู้เย็น', label_en: 'Refrigerator' },
                    { value: 'ac', label_th: 'แอร์', label_en: 'Air Conditioner' },
                    { value: 'washing', label_th: 'เครื่องซักผ้า', label_en: 'Washing Machine' },
                    { value: 'fan', label_th: 'พัดลม', label_en: 'Fan' },
                    { value: 'air_purifier', label_th: 'เครื่องฟอกอากาศ', label_en: 'Air Purifier' },
                    { value: 'vacuum', label_th: 'เครื่องดูดฝุ่น', label_en: 'Vacuum Cleaner' },
                    { value: 'other', label_th: 'อื่นๆ', label_en: 'Other' }
                ],
                priority: 3,
                showByDefault: true
            },
            {
                id: 'screen_size_tv',
                name_th: 'ขนาดหน้าจอ',
                name_en: 'Screen Size',
                type: 'text',
                placeholder_th: 'เช่น 55 นิ้ว',
                placeholder_en: 'e.g. 55 inches',
                priority: 4,
                showByDefault: false
            },
            {
                id: 'btu',
                name_th: 'BTU',
                name_en: 'BTU',
                type: 'text',
                placeholder_th: 'เช่น 12000 BTU',
                placeholder_en: 'e.g. 12000 BTU',
                priority: 5,
                showByDefault: false
            },
            COMMON_FIELDS.condition,
            COMMON_FIELDS.warranty
        ],
        hiddenFields: ['mileage', 'vehicle_year', 'bedrooms']
    },
    // 🔥 NEW: Fashion (6)
    {
        categoryId: 6,
        categoryName_th: 'แฟชั่น',
        categoryName_en: 'Fashion',
        fields: [
            COMMON_FIELDS.brand,
            {
                id: 'fashion_type',
                name_th: 'ประเภท',
                name_en: 'Type',
                type: 'select',
                options: [
                    { value: 'shirt', label_th: 'เสื้อ', label_en: 'Shirt/Top' },
                    { value: 'pants', label_th: 'กางเกง', label_en: 'Pants' },
                    { value: 'dress', label_th: 'ชุดเดรส', label_en: 'Dress' },
                    { value: 'shoes', label_th: 'รองเท้า', label_en: 'Shoes' },
                    { value: 'bag', label_th: 'กระเป๋า', label_en: 'Bag' },
                    { value: 'watch', label_th: 'นาฬิกา', label_en: 'Watch' },
                    { value: 'accessory', label_th: 'เครื่องประดับ', label_en: 'Accessory' }
                ],
                priority: 2,
                showByDefault: true
            },
            {
                id: 'size',
                name_th: 'ไซส์',
                name_en: 'Size',
                type: 'text',
                placeholder_th: 'เช่น S, M, L, XL, 40, 42',
                placeholder_en: 'e.g. S, M, L, XL, 40, 42',
                priority: 3,
                showByDefault: true
            },
            COMMON_FIELDS.color,
            {
                id: 'material',
                name_th: 'วัสดุ',
                name_en: 'Material',
                type: 'text',
                placeholder_th: 'เช่น ผ้าฝ้าย, หนังแท้',
                placeholder_en: 'e.g. Cotton, Genuine Leather',
                priority: 5,
                showByDefault: false
            },
            {
                id: 'authenticity',
                name_th: 'ความแท้',
                name_en: 'Authenticity',
                type: 'select',
                options: [
                    { value: 'authentic', label_th: 'ของแท้ 100%', label_en: '100% Authentic' },
                    { value: 'inspired', label_th: 'สินค้าแรงบันดาลใจ', label_en: 'Inspired Item' },
                    { value: 'handmade', label_th: 'Handmade', label_en: 'Handmade' }
                ],
                aiTip_th: 'ของแท้มีใบรับรองจะขายได้ราคาดีกว่า',
                aiTip_en: 'Authentic items with certificate sell better',
                priority: 6,
                showByDefault: false
            },
            COMMON_FIELDS.condition
        ],
        hiddenFields: ['cpu', 'ram', 'storage', 'mileage']
    },
    // 🔥 NEW: Gaming (7)
    {
        categoryId: 7,
        categoryName_th: 'เกม',
        categoryName_en: 'Gaming',
        fields: [
            {
                id: 'platform',
                name_th: 'แพลตฟอร์ม',
                name_en: 'Platform',
                type: 'select',
                options: [
                    { value: 'ps5', label_th: 'PlayStation 5', label_en: 'PlayStation 5' },
                    { value: 'ps4', label_th: 'PlayStation 4', label_en: 'PlayStation 4' },
                    { value: 'xbox_series', label_th: 'Xbox Series X/S', label_en: 'Xbox Series X/S' },
                    { value: 'xbox_one', label_th: 'Xbox One', label_en: 'Xbox One' },
                    { value: 'switch', label_th: 'Nintendo Switch', label_en: 'Nintendo Switch' },
                    { value: 'pc', label_th: 'PC', label_en: 'PC' },
                    { value: 'retro', label_th: 'เครื่องเกมย้อนยุค', label_en: 'Retro Console' }
                ],
                priority: 1,
                showByDefault: true
            },
            {
                id: 'game_type',
                name_th: 'ประเภทสินค้า',
                name_en: 'Product Type',
                type: 'select',
                options: [
                    { value: 'console', label_th: 'เครื่องเกม', label_en: 'Console' },
                    { value: 'game_disc', label_th: 'แผ่นเกม', label_en: 'Game Disc' },
                    { value: 'controller', label_th: 'จอย/คอนโทรลเลอร์', label_en: 'Controller' },
                    { value: 'accessory', label_th: 'อุปกรณ์เสริม', label_en: 'Accessory' },
                    { value: 'vr', label_th: 'VR/AR', label_en: 'VR/AR' }
                ],
                priority: 2,
                showByDefault: true
            },
            {
                id: 'game_title',
                name_th: 'ชื่อเกม',
                name_en: 'Game Title',
                type: 'text',
                placeholder_th: 'ระบุชื่อเกม (ถ้าเป็นแผ่นเกม)',
                placeholder_en: 'Enter game title (if disc)',
                priority: 3,
                showByDefault: false
            },
            COMMON_FIELDS.condition,
            COMMON_FIELDS.warranty
        ],
        hiddenFields: ['brand', 'model', 'mileage', 'bedrooms']
    },
    {
        categoryId: 8,
        categoryName_th: 'กล้องถ่ายรูปและอุปกรณ์',
        categoryName_en: 'Cameras & Equipment',
        fields: CAMERA_FIELDS,
        hiddenFields: ['mileage', 'vehicle_year', 'storage']
    },
    {
        categoryId: 9,
        categoryName_th: 'พระเครื่องและของสะสม',
        categoryName_en: 'Amulets & Collectibles',
        fields: AMULET_FIELDS,
        hiddenFields: ['brand', 'model', 'warranty', 'serial_number', 'storage', 'ram', 'cpu']
    },
    // 🔥 NEW: Sports (12)
    {
        categoryId: 12,
        categoryName_th: 'กีฬา',
        categoryName_en: 'Sports',
        fields: [
            {
                id: 'sport_type',
                name_th: 'ประเภทกีฬา',
                name_en: 'Sport Type',
                type: 'select',
                options: [
                    { value: 'football', label_th: 'ฟุตบอล', label_en: 'Football/Soccer' },
                    { value: 'basketball', label_th: 'บาสเกตบอล', label_en: 'Basketball' },
                    { value: 'golf', label_th: 'กอล์ฟ', label_en: 'Golf' },
                    { value: 'tennis', label_th: 'เทนนิส/แบดมินตัน', label_en: 'Tennis/Badminton' },
                    { value: 'cycling', label_th: 'จักรยาน', label_en: 'Cycling' },
                    { value: 'fitness', label_th: 'ฟิตเนส', label_en: 'Fitness' },
                    { value: 'swimming', label_th: 'ว่ายน้ำ', label_en: 'Swimming' },
                    { value: 'camping', label_th: 'แคมป์ปิ้ง', label_en: 'Camping' },
                    { value: 'other', label_th: 'อื่นๆ', label_en: 'Other' }
                ],
                priority: 1,
                showByDefault: true
            },
            COMMON_FIELDS.brand,
            COMMON_FIELDS.model,
            {
                id: 'equipment_size',
                name_th: 'ขนาด',
                name_en: 'Size',
                type: 'text',
                placeholder_th: 'เช่น 26 นิ้ว, Size 5',
                placeholder_en: 'e.g. 26 inches, Size 5',
                priority: 4,
                showByDefault: false
            },
            COMMON_FIELDS.condition
        ],
        hiddenFields: ['cpu', 'ram', 'storage', 'mileage', 'bedrooms']
    },
    // 🔥 NEW: Baby & Kids (15)
    {
        categoryId: 15,
        categoryName_th: 'เด็กและของเล่น',
        categoryName_en: 'Baby & Kids',
        fields: [
            {
                id: 'kids_type',
                name_th: 'ประเภทสินค้า',
                name_en: 'Product Type',
                type: 'select',
                options: [
                    { value: 'toy', label_th: 'ของเล่น', label_en: 'Toy' },
                    { value: 'clothing', label_th: 'เสื้อผ้าเด็ก', label_en: 'Kids Clothing' },
                    { value: 'stroller', label_th: 'รถเข็นเด็ก', label_en: 'Stroller' },
                    { value: 'carseat', label_th: 'คาร์ซีท', label_en: 'Car Seat' },
                    { value: 'crib', label_th: 'เปลเด็ก/เตียงเด็ก', label_en: 'Crib/Baby Bed' },
                    { value: 'feeding', label_th: 'อุปกรณ์ให้นม', label_en: 'Feeding Equipment' },
                    { value: 'diaper', label_th: 'ผ้าอ้อม', label_en: 'Diapers' },
                    { value: 'educational', label_th: 'ของเล่นเสริมพัฒนาการ', label_en: 'Educational Toy' }
                ],
                priority: 1,
                showByDefault: true
            },
            COMMON_FIELDS.brand,
            {
                id: 'age_range',
                name_th: 'ช่วงอายุ',
                name_en: 'Age Range',
                type: 'select',
                options: [
                    { value: '0-6m', label_th: '0-6 เดือน', label_en: '0-6 months' },
                    { value: '6-12m', label_th: '6-12 เดือน', label_en: '6-12 months' },
                    { value: '1-2y', label_th: '1-2 ปี', label_en: '1-2 years' },
                    { value: '3-5y', label_th: '3-5 ปี', label_en: '3-5 years' },
                    { value: '6-8y', label_th: '6-8 ปี', label_en: '6-8 years' },
                    { value: '9-12y', label_th: '9-12 ปี', label_en: '9-12 years' },
                    { value: 'all', label_th: 'ทุกวัย', label_en: 'All Ages' }
                ],
                priority: 3,
                showByDefault: true
            },
            {
                id: 'gender',
                name_th: 'เพศ',
                name_en: 'Gender',
                type: 'select',
                options: [
                    { value: 'boy', label_th: 'เด็กผู้ชาย', label_en: 'Boy' },
                    { value: 'girl', label_th: 'เด็กผู้หญิง', label_en: 'Girl' },
                    { value: 'unisex', label_th: 'Unisex', label_en: 'Unisex' }
                ],
                priority: 4,
                showByDefault: false
            },
            COMMON_FIELDS.condition
        ],
        hiddenFields: ['cpu', 'ram', 'storage', 'mileage', 'warranty']
    }
]

// ========================================
// DEFAULT FORM - ฟอร์มเริ่มต้น
// ========================================
export const DEFAULT_FORM_FIELDS: FormField[] = [
    COMMON_FIELDS.brand,
    COMMON_FIELDS.model,
    COMMON_FIELDS.condition,
    COMMON_FIELDS.color,
    COMMON_FIELDS.warranty,
    COMMON_FIELDS.purchase_year,
    COMMON_FIELDS.accessories
]

// ========================================
// HELPER FUNCTIONS
// ========================================

/**
 * Get form schema by category ID
 */
export function getFormSchema(categoryId: number): FormSchema | null {
    return FORM_SCHEMAS.find(schema => schema.categoryId === categoryId) || null
}

/**
 * Get fields for a category (with default fallback)
 */
export function getFieldsForCategory(categoryId: number): FormField[] {
    const schema = getFormSchema(categoryId)
    if (schema) {
        return schema.fields
    }
    return DEFAULT_FORM_FIELDS
}

/**
 * Get visible fields (sorted by priority, filtered by showByDefault)
 */
export function getVisibleFields(categoryId: number, showAll: boolean = false): FormField[] {
    const fields = getFieldsForCategory(categoryId)

    const filtered = showAll
        ? fields
        : fields.filter(f => f.showByDefault)

    return filtered.sort((a, b) => a.priority - b.priority)
}

/**
 * Check if a field should be hidden for a category
 */
export function shouldHideField(categoryId: number, fieldId: string): boolean {
    const schema = getFormSchema(categoryId)
    if (!schema || !schema.hiddenFields) return false
    return schema.hiddenFields.includes(fieldId)
}
