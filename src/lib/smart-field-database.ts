/**
 * SMART FIELD DATABASE - Complete Field Definitions with Options
 * 
 * ระบบฐานข้อมูล Fields ที่ครบถ้วนสำหรับทุก Subcategory
 * - Brand Database ตามหมวดหมู่
 * - Field Options (Dropdowns)
 * - AI Vision Mapping
 */

// ============================================
// TYPE DEFINITIONS
// ============================================
export type FieldType = 'text' | 'select' | 'multiselect' | 'number'
export type FieldImportance = 'required' | 'recommended' | 'optional'

export interface FieldOption {
    value: string
    label_th: string
    label_en: string
}

export interface SmartField {
    key: string
    label_th: string
    label_en: string
    type: FieldType
    importance: FieldImportance
    options?: FieldOption[]
    aiDetectable?: boolean      // ตรวจจับได้จาก AI Vision
    extractFromTitle?: boolean  // ดึงจากชื่อสินค้า
    placeholder_th?: string
    placeholder_en?: string
    validation?: {
        min?: number
        max?: number
        pattern?: string
    }
}

// ============================================
// BRAND DATABASE BY CATEGORY
// ============================================
export const BRAND_DATABASE = {
    // ----- AUTOMOTIVE -----
    cars: ['Toyota', 'Honda', 'Isuzu', 'Mitsubishi', 'Nissan', 'Mazda', 'Ford', 'Chevrolet', 'Suzuki', 'MG', 'BYD', 'GWM', 'Hyundai', 'Kia', 'BMW', 'Mercedes-Benz', 'Audi', 'Volvo', 'Subaru', 'Lexus'],
    motorcycles: ['Honda', 'Yamaha', 'Kawasaki', 'Suzuki', 'Ducati', 'BMW', 'Harley-Davidson', 'Vespa', 'GPX', 'Benelli', 'Royal Enfield', 'KTM', 'Triumph'],
    car_parts: ['Bosch', 'Denso', 'NGK', 'Aisin', 'KYB', 'Brembo', 'Continental', 'Valeo', 'ACDelco', 'Monroe', 'Bilstein', 'Sachs'],
    tires: ['Michelin', 'Bridgestone', 'Goodyear', 'Continental', 'Dunlop', 'Yokohama', 'Pirelli', 'Hankook', 'Maxxis', 'Firestone', 'Toyo', 'Nitto'],

    // ----- MOBILE & TABLETS -----
    mobile: ['Apple', 'Samsung', 'Xiaomi', 'OPPO', 'Vivo', 'Realme', 'OnePlus', 'Google', 'Huawei', 'ASUS', 'Sony', 'Nothing', 'Poco', 'Honor'],
    tablets: ['Apple', 'Samsung', 'Xiaomi', 'Huawei', 'Lenovo', 'Microsoft', 'Amazon', 'OPPO'],
    wearables: ['Apple', 'Samsung', 'Garmin', 'Fitbit', 'Xiaomi', 'Huawei', 'Amazfit', 'COROS', 'Polar'],
    power_banks: ['Anker', 'Xiaomi', 'Baseus', 'RAVPower', 'UGREEN', 'Belkin', 'Aukey', 'Samsung', 'Energizer'],

    // ----- COMPUTERS -----
    laptops: ['Apple', 'Lenovo', 'ASUS', 'Dell', 'HP', 'Acer', 'MSI', 'Microsoft', 'Razer', 'Gigabyte', 'Huawei', 'Samsung', 'LG'],
    desktops: ['Dell', 'HP', 'Lenovo', 'ASUS', 'Acer', 'Apple', 'MSI', 'Corsair', 'NZXT'],
    monitors: ['Dell', 'LG', 'Samsung', 'ASUS', 'BenQ', 'Acer', 'AOC', 'ViewSonic', 'MSI', 'Alienware', 'Gigabyte'],
    keyboards: ['Logitech', 'Razer', 'Corsair', 'SteelSeries', 'HyperX', 'Ducky', 'Keychron', 'Royal Kludge', 'Akko', 'Leopold', 'Filco'],
    mouse: ['Logitech', 'Razer', 'Corsair', 'SteelSeries', 'Zowie', 'Pulsar', 'Endgame Gear', 'Lamzu', 'Finalmouse'],
    gpu: ['NVIDIA', 'AMD', 'ASUS', 'MSI', 'Gigabyte', 'EVGA', 'Zotac', 'Sapphire', 'PowerColor', 'Galax'],
    cpu: ['Intel', 'AMD'],

    // ----- APPLIANCES -----
    air_conditioner: ['Daikin', 'Mitsubishi Electric', 'Panasonic', 'LG', 'Samsung', 'Carrier', 'Trane', 'Haier', 'TCL', 'Sharp', 'Toshiba', 'Hitachi', 'Fujitsu'],
    refrigerator: ['Samsung', 'LG', 'Panasonic', 'Hitachi', 'Mitsubishi', 'Sharp', 'Toshiba', 'Haier', 'Electrolux', 'Beko'],
    washing_machine: ['Samsung', 'LG', 'Panasonic', 'Electrolux', 'Toshiba', 'Hitachi', 'Sharp', 'Haier', 'Whirlpool', 'Bosch'],
    tv: ['Samsung', 'LG', 'Sony', 'TCL', 'Hisense', 'Panasonic', 'Sharp', 'Philips', 'Toshiba', 'Xiaomi'],
    fans: ['Hatari', 'Panasonic', 'Mitsubishi', 'Sharp', 'Toshiba', 'Dyson', 'Xiaomi', 'Tefal', 'Singer'],
    vacuum: ['Dyson', 'Xiaomi', 'Electrolux', 'Philips', 'Miele', 'LG', 'Samsung', 'Shark', 'Karcher', 'Roborock'],

    // ----- FASHION -----
    bags_luxury: ['Louis Vuitton', 'Gucci', 'Chanel', 'Hermès', 'Prada', 'Dior', 'Balenciaga', 'Bottega Veneta', 'Celine', 'Fendi', 'YSL', 'Loewe', 'Burberry', 'Coach', 'Michael Kors', 'Kate Spade'],
    watches_luxury: ['Rolex', 'Omega', 'Patek Philippe', 'Audemars Piguet', 'IWC', 'Cartier', 'Tudor', 'Tag Heuer', 'Breitling', 'Panerai', 'Jaeger-LeCoultre', 'Longines', 'Grand Seiko'],
    watches_fashion: ['Casio', 'G-Shock', 'Seiko', 'Citizen', 'Orient', 'Fossil', 'Daniel Wellington', 'Timex', 'Tissot', 'Hamilton'],
    sneakers: ['Nike', 'Adidas', 'New Balance', 'Converse', 'Vans', 'Puma', 'Reebok', 'ASICS', 'Jordan', 'Yeezy', 'Salomon', 'On Running'],
    clothing: ['Uniqlo', 'H&M', 'Zara', 'GU', 'MUJI', 'GAP', 'Levi\'s', 'COS', 'Massimo Dutti'],

    // ----- GAMING -----
    consoles: ['Sony PlayStation', 'Xbox', 'Nintendo', 'Steam Deck', 'ASUS ROG Ally'],
    gaming_gear: ['Razer', 'Logitech G', 'Corsair', 'SteelSeries', 'HyperX', 'ASUS ROG', 'MSI'],

    // ----- CAMERAS -----
    cameras: ['Canon', 'Nikon', 'Sony', 'Fujifilm', 'Panasonic', 'Olympus', 'Leica', 'Hasselblad', 'Sigma', 'GoPro', 'DJI', 'Insta360'],
    lenses: ['Canon', 'Nikon', 'Sony', 'Sigma', 'Tamron', 'Tokina', 'Samyang', 'Viltrox', 'Zeiss', 'Fujifilm'],

    // ----- BEAUTY -----
    makeup_luxury: ['Chanel', 'Dior', 'YSL', 'MAC', 'NARS', 'Estée Lauder', 'Tom Ford', 'Charlotte Tilbury', 'Bobbi Brown', 'Laura Mercier'],
    makeup_drugstore: ['Maybelline', 'L\'Oréal', 'NYX', 'Revlon', 'Rimmel', 'e.l.f.', 'Wet n Wild', 'Essence'],
    skincare: ['La Mer', 'SK-II', 'Drunk Elephant', 'Sunday Riley', 'The Ordinary', 'CeraVe', 'Paula\'s Choice', 'Kiehl\'s', 'Clinique', 'Shiseido'],
    skincare_korean: ['Sulwhasoo', 'Laneige', 'Innisfree', 'Etude House', 'COSRX', 'Some By Mi', 'Anessa', 'Biore'],
    perfume: ['Chanel', 'Dior', 'Tom Ford', 'Jo Malone', 'Versace', 'Armani', 'Gucci', 'YSL', 'Prada', 'Hermès', 'Creed', 'Le Labo'],

    // ----- KIDS & BABY -----
    baby_gear: ['Combi', 'Aprica', 'Joie', 'Chicco', 'Graco', 'Britax', 'Cybex', 'Stokke', 'Bugaboo', 'Nuna'],
    toys: ['LEGO', 'Bandai', 'Hasbro', 'Mattel', 'Hot Wheels', 'Barbie', 'Fisher-Price', 'Playmobil', 'Sylvanian Families', 'Takara Tomy'],

    // ----- HOME -----
    furniture: ['IKEA', 'Modernform', 'SB Furniture', 'Index Livingmall', 'HomeB', 'Koncept', 'Muji'],
    tools: ['Bosch', 'Makita', 'DeWalt', 'Milwaukee', 'Stanley', 'Black+Decker', 'Ryobi', 'Hitachi'],
}

// ============================================
// COMMON FIELD OPTIONS
// ============================================
export const COMMON_OPTIONS = {
    condition: [
        { value: 'new', label_th: 'ใหม่แกะกล่อง', label_en: 'Brand New' },
        { value: 'like_new', label_th: 'เหมือนใหม่ 99%', label_en: 'Like New 99%' },
        { value: 'good', label_th: 'สภาพดี', label_en: 'Good' },
        { value: 'fair', label_th: 'พอใช้', label_en: 'Fair' },
        { value: 'for_parts', label_th: 'ขายซาก/อะไหล่', label_en: 'For Parts' },
    ],

    yes_no: [
        { value: 'yes', label_th: 'มี', label_en: 'Yes' },
        { value: 'no', label_th: 'ไม่มี', label_en: 'No' },
    ],

    authenticity: [
        { value: 'authentic', label_th: 'ของแท้ 100%', label_en: '100% Authentic' },
        { value: 'authentic_used', label_th: 'ของแท้ มือสอง', label_en: 'Authentic Used' },
        { value: 'inspired', label_th: 'Inspired', label_en: 'Inspired' },
        { value: 'replica', label_th: 'งานปั๊ม', label_en: 'Replica' },
    ],

    mobile_storage: [
        { value: '32GB', label_th: '32GB', label_en: '32GB' },
        { value: '64GB', label_th: '64GB', label_en: '64GB' },
        { value: '128GB', label_th: '128GB', label_en: '128GB' },
        { value: '256GB', label_th: '256GB', label_en: '256GB' },
        { value: '512GB', label_th: '512GB', label_en: '512GB' },
        { value: '1TB', label_th: '1TB', label_en: '1TB' },
    ],

    ram: [
        { value: '4GB', label_th: '4GB', label_en: '4GB' },
        { value: '8GB', label_th: '8GB', label_en: '8GB' },
        { value: '16GB', label_th: '16GB', label_en: '16GB' },
        { value: '32GB', label_th: '32GB', label_en: '32GB' },
        { value: '64GB', label_th: '64GB', label_en: '64GB' },
    ],

    battery_health: [
        { value: '100%', label_th: '100%', label_en: '100%' },
        { value: '95-99%', label_th: '95-99%', label_en: '95-99%' },
        { value: '90-94%', label_th: '90-94%', label_en: '90-94%' },
        { value: '85-89%', label_th: '85-89%', label_en: '85-89%' },
        { value: '80-84%', label_th: '80-84%', label_en: '80-84%' },
        { value: 'below_80%', label_th: 'ต่ำกว่า 80%', label_en: 'Below 80%' },
    ],

    transmission: [
        { value: 'auto', label_th: 'ออโต้', label_en: 'Automatic' },
        { value: 'manual', label_th: 'ธรรมดา', label_en: 'Manual' },
        { value: 'cvt', label_th: 'CVT', label_en: 'CVT' },
        { value: 'dct', label_th: 'DCT', label_en: 'DCT' },
    ],

    fuel: [
        { value: 'benzene', label_th: 'เบนซิน', label_en: 'Gasoline' },
        { value: 'diesel', label_th: 'ดีเซล', label_en: 'Diesel' },
        { value: 'hybrid', label_th: 'ไฮบริด', label_en: 'Hybrid' },
        { value: 'phev', label_th: 'ปลั๊กอินไฮบริด', label_en: 'PHEV' },
        { value: 'ev', label_th: 'ไฟฟ้า 100%', label_en: 'Electric' },
        { value: 'lpg', label_th: 'LPG', label_en: 'LPG' },
    ],

    ac_type: [
        { value: 'wall', label_th: 'ติดผนัง', label_en: 'Wall-mounted' },
        { value: 'portable', label_th: 'เคลื่อนที่', label_en: 'Portable' },
        { value: 'cassette', label_th: 'ฝังฝ้า', label_en: 'Cassette' },
        { value: 'floor', label_th: 'ตั้งพื้น', label_en: 'Floor Standing' },
    ],

    energy_rating: [
        { value: '5', label_th: 'เบอร์ 5 ⭐⭐⭐⭐⭐', label_en: '5-Star' },
        { value: '4', label_th: 'เบอร์ 4 ⭐⭐⭐⭐', label_en: '4-Star' },
        { value: '3', label_th: 'เบอร์ 3 ⭐⭐⭐', label_en: '3-Star' },
        { value: '2', label_th: 'เบอร์ 2 ⭐⭐', label_en: '2-Star' },
        { value: '1', label_th: 'เบอร์ 1 ⭐', label_en: '1-Star' },
    ],

    fan_type: [
        { value: 'stand', label_th: 'ตั้งพื้น', label_en: 'Stand Fan' },
        { value: 'wall', label_th: 'ติดผนัง', label_en: 'Wall Fan' },
        { value: 'desk', label_th: 'ตั้งโต๊ะ', label_en: 'Desk Fan' },
        { value: 'tower', label_th: 'ทาวเวอร์', label_en: 'Tower Fan' },
        { value: 'ceiling', label_th: 'โคมไฟพัดลม', label_en: 'Ceiling Fan' },
    ],

    watch_movement: [
        { value: 'automatic', label_th: 'Automatic', label_en: 'Automatic' },
        { value: 'manual', label_th: 'Manual Wind', label_en: 'Manual Wind' },
        { value: 'quartz', label_th: 'Quartz', label_en: 'Quartz' },
        { value: 'solar', label_th: 'Solar', label_en: 'Solar' },
        { value: 'smart', label_th: 'Smart Watch', label_en: 'Smart Watch' },
    ],

    gender: [
        { value: 'male', label_th: 'ชาย', label_en: 'Male' },
        { value: 'female', label_th: 'หญิง', label_en: 'Female' },
        { value: 'unisex', label_th: 'Unisex', label_en: 'Unisex' },
    ],

    clothing_size: [
        { value: 'XS', label_th: 'XS', label_en: 'XS' },
        { value: 'S', label_th: 'S', label_en: 'S' },
        { value: 'M', label_th: 'M', label_en: 'M' },
        { value: 'L', label_th: 'L', label_en: 'L' },
        { value: 'XL', label_th: 'XL', label_en: 'XL' },
        { value: '2XL', label_th: '2XL', label_en: '2XL' },
        { value: '3XL', label_th: '3XL', label_en: '3XL' },
    ],

    kids_age: [
        { value: '0-3m', label_th: '0-3 เดือน', label_en: '0-3 months' },
        { value: '3-6m', label_th: '3-6 เดือน', label_en: '3-6 months' },
        { value: '6-12m', label_th: '6-12 เดือน', label_en: '6-12 months' },
        { value: '1-2y', label_th: '1-2 ปี', label_en: '1-2 years' },
        { value: '2-4y', label_th: '2-4 ปี', label_en: '2-4 years' },
        { value: '4-6y', label_th: '4-6 ปี', label_en: '4-6 years' },
        { value: '6-8y', label_th: '6-8 ปี', label_en: '6-8 years' },
        { value: '8-12y', label_th: '8-12 ปี', label_en: '8-12 years' },
    ],

    camera_sensor: [
        { value: 'fullframe', label_th: 'Full Frame', label_en: 'Full Frame' },
        { value: 'apsc', label_th: 'APS-C', label_en: 'APS-C' },
        { value: 'm43', label_th: 'Micro 4/3', label_en: 'Micro 4/3' },
        { value: 'medium', label_th: 'Medium Format', label_en: 'Medium Format' },
        { value: '1inch', label_th: '1 นิ้ว', label_en: '1 inch' },
    ],

    oem_aftermarket: [
        { value: 'oem', label_th: 'OEM แท้', label_en: 'OEM Original' },
        { value: 'oem_dealer', label_th: 'OEM ศูนย์', label_en: 'OEM Dealer' },
        { value: 'aftermarket_quality', label_th: 'Aftermarket คุณภาพ', label_en: 'Quality Aftermarket' },
        { value: 'aftermarket', label_th: 'Aftermarket ทั่วไป', label_en: 'Aftermarket' },
        { value: 'used', label_th: 'ถอดจากรถ', label_en: 'Used/Pulled' },
    ],
}

// ============================================
// AI VISION → FIELD MAPPING
// ============================================
export const AI_VISION_FIELD_MAPPING = {
    // AI ตรวจจับจากภาพ → map ไป field ไหน
    detected_brand: 'brand',
    detected_model: 'model',
    detected_color: 'color',
    detected_size: 'size',
    detected_capacity: 'storage',
    detected_condition: 'overall',
    detected_year: 'year',
    detected_material: 'material',
    detected_type: 'type',

    // Specific category mappings
    phone_storage: 'storage',
    phone_color: 'color',
    car_mileage: 'mileage',
    car_registration: 'registration',
    ac_btu: 'btu',
    watch_dial_size: 'case_size',
    camera_megapixels: 'megapixels',
}

// ============================================
// FIELD DEFINITIONS BY SUBCATEGORY
// ============================================
export const SMART_FIELDS: Record<number, SmartField[]> = {
    // 301: Mobile Phones
    301: [
        {
            key: 'brand', label_th: 'แบรนด์', label_en: 'Brand', type: 'select', importance: 'required', aiDetectable: true, extractFromTitle: true,
            options: BRAND_DATABASE.mobile.map(b => ({ value: b, label_th: b, label_en: b }))
        },
        {
            key: 'model', label_th: 'รุ่น', label_en: 'Model', type: 'text', importance: 'required', aiDetectable: true, extractFromTitle: true,
            placeholder_th: 'เช่น iPhone 15 Pro Max', placeholder_en: 'e.g. iPhone 15 Pro Max'
        },
        {
            key: 'storage', label_th: 'ความจุ', label_en: 'Storage', type: 'select', importance: 'required', aiDetectable: true,
            options: COMMON_OPTIONS.mobile_storage
        },
        { key: 'color', label_th: 'สี', label_en: 'Color', type: 'text', importance: 'required', aiDetectable: true },
        {
            key: 'battery_health', label_th: 'สุขภาพแบต', label_en: 'Battery Health', type: 'select', importance: 'recommended',
            options: COMMON_OPTIONS.battery_health
        },
        {
            key: 'overall', label_th: 'สภาพ', label_en: 'Condition', type: 'select', importance: 'required',
            options: COMMON_OPTIONS.condition
        },
        {
            key: 'warranty', label_th: 'ประกัน', label_en: 'Warranty', type: 'text', importance: 'optional',
            placeholder_th: 'เช่น ศูนย์ไทย 1 ปี', placeholder_en: 'e.g. 1 year warranty'
        },
    ],

    // 501: Air Conditioners
    501: [
        {
            key: 'brand', label_th: 'แบรนด์', label_en: 'Brand', type: 'select', importance: 'required', aiDetectable: true,
            options: BRAND_DATABASE.air_conditioner.map(b => ({ value: b, label_th: b, label_en: b }))
        },
        { key: 'model', label_th: 'รุ่น', label_en: 'Model', type: 'text', importance: 'required', extractFromTitle: true },
        {
            key: 'btu', label_th: 'BTU', label_en: 'BTU', type: 'select', importance: 'required',
            options: [9000, 12000, 13000, 18000, 24000, 30000].map(b => ({ value: String(b), label_th: `${b.toLocaleString()} BTU`, label_en: `${b.toLocaleString()} BTU` }))
        },
        {
            key: 'type', label_th: 'ประเภท', label_en: 'Type', type: 'select', importance: 'required',
            options: COMMON_OPTIONS.ac_type
        },
        {
            key: 'inverter', label_th: 'Inverter', label_en: 'Inverter', type: 'select', importance: 'recommended',
            options: COMMON_OPTIONS.yes_no
        },
        {
            key: 'energy', label_th: 'ฉลากเบอร์', label_en: 'Energy Rating', type: 'select', importance: 'optional',
            options: COMMON_OPTIONS.energy_rating
        },
        {
            key: 'overall', label_th: 'สภาพ', label_en: 'Condition', type: 'select', importance: 'required',
            options: COMMON_OPTIONS.condition
        },
    ],

    // 508: Fans
    508: [
        {
            key: 'brand', label_th: 'แบรนด์', label_en: 'Brand', type: 'select', importance: 'required', aiDetectable: true,
            options: BRAND_DATABASE.fans.map(b => ({ value: b, label_th: b, label_en: b }))
        },
        { key: 'model', label_th: 'รุ่น', label_en: 'Model', type: 'text', importance: 'recommended', extractFromTitle: true },
        {
            key: 'size', label_th: 'ขนาด', label_en: 'Size', type: 'select', importance: 'required',
            options: [12, 14, 16, 18, 20].map(s => ({ value: `${s}`, label_th: `${s} นิ้ว`, label_en: `${s} inches` }))
        },
        {
            key: 'type', label_th: 'ประเภท', label_en: 'Type', type: 'select', importance: 'required',
            options: COMMON_OPTIONS.fan_type
        },
        { key: 'color', label_th: 'สี', label_en: 'Color', type: 'text', importance: 'optional', aiDetectable: true },
        {
            key: 'overall', label_th: 'สภาพ', label_en: 'Condition', type: 'select', importance: 'required',
            options: COMMON_OPTIONS.condition
        },
    ],

    // 603: Brandname Bags
    603: [
        {
            key: 'brand', label_th: 'แบรนด์', label_en: 'Brand', type: 'select', importance: 'required', aiDetectable: true,
            options: BRAND_DATABASE.bags_luxury.map(b => ({ value: b, label_th: b, label_en: b }))
        },
        {
            key: 'model', label_th: 'รุ่น', label_en: 'Model', type: 'text', importance: 'required', extractFromTitle: true,
            placeholder_th: 'เช่น Neverfull MM', placeholder_en: 'e.g. Neverfull MM'
        },
        { key: 'color', label_th: 'สี', label_en: 'Color', type: 'text', importance: 'required', aiDetectable: true },
        { key: 'size', label_th: 'ขนาด', label_en: 'Size', type: 'text', importance: 'recommended' },
        { key: 'material', label_th: 'วัสดุ', label_en: 'Material', type: 'text', importance: 'recommended', aiDetectable: true },
        {
            key: 'authenticity', label_th: 'ความแท้', label_en: 'Authenticity', type: 'select', importance: 'required',
            options: COMMON_OPTIONS.authenticity
        },
        { key: 'serial', label_th: 'รหัส/Date Code', label_en: 'Serial/Date Code', type: 'text', importance: 'recommended' },
        {
            key: 'overall', label_th: 'สภาพ', label_en: 'Condition', type: 'select', importance: 'required',
            options: COMMON_OPTIONS.condition
        },
    ],

    // 605: Watches
    605: [
        {
            key: 'brand', label_th: 'แบรนด์', label_en: 'Brand', type: 'select', importance: 'required', aiDetectable: true,
            options: [...BRAND_DATABASE.watches_luxury, ...BRAND_DATABASE.watches_fashion].map(b => ({ value: b, label_th: b, label_en: b }))
        },
        { key: 'model', label_th: 'รุ่น', label_en: 'Model', type: 'text', importance: 'required', extractFromTitle: true },
        {
            key: 'movement', label_th: 'ระบบ', label_en: 'Movement', type: 'select', importance: 'required',
            options: COMMON_OPTIONS.watch_movement
        },
        {
            key: 'case_size', label_th: 'ขนาดหน้าปัด', label_en: 'Case Size', type: 'text', importance: 'recommended',
            placeholder_th: 'เช่น 40mm', placeholder_en: 'e.g. 40mm'
        },
        { key: 'material', label_th: 'วัสดุ', label_en: 'Material', type: 'text', importance: 'recommended', aiDetectable: true },
        {
            key: 'box_papers', label_th: 'กล่อง/ใบเสร็จ', label_en: 'Box/Papers', type: 'select', importance: 'recommended',
            options: [
                { value: 'full_set', label_th: 'Full Set ครบ', label_en: 'Full Set' },
                { value: 'box_only', label_th: 'มีเฉพาะกล่อง', label_en: 'Box Only' },
                { value: 'papers_only', label_th: 'มีเฉพาะใบเสร็จ', label_en: 'Papers Only' },
                { value: 'none', label_th: 'ไม่มี', label_en: 'None' },
            ]
        },
        {
            key: 'overall', label_th: 'สภาพ', label_en: 'Condition', type: 'select', importance: 'required',
            options: COMMON_OPTIONS.condition
        },
    ],

    // 103: Car Parts
    103: [
        {
            key: 'brand', label_th: 'ยี่ห้อ', label_en: 'Brand', type: 'select', importance: 'required', aiDetectable: true,
            options: BRAND_DATABASE.car_parts.map(b => ({ value: b, label_th: b, label_en: b }))
        },
        { key: 'part_name', label_th: 'ชื่อชิ้นส่วน', label_en: 'Part Name', type: 'text', importance: 'required', extractFromTitle: true },
        { key: 'part_number', label_th: 'เลขพาร์ท/OEM', label_en: 'Part Number', type: 'text', importance: 'recommended' },
        {
            key: 'compatible', label_th: 'รถที่รองรับ', label_en: 'Compatible Vehicles', type: 'text', importance: 'recommended',
            placeholder_th: 'เช่น Toyota Camry 2018-2023', placeholder_en: 'e.g. Toyota Camry 2018-2023'
        },
        {
            key: 'oem_type', label_th: 'ประเภท', label_en: 'Type', type: 'select', importance: 'required',
            options: COMMON_OPTIONS.oem_aftermarket
        },
        {
            key: 'overall', label_th: 'สภาพ', label_en: 'Condition', type: 'select', importance: 'required',
            options: COMMON_OPTIONS.condition
        },
        { key: 'warranty', label_th: 'ประกัน', label_en: 'Warranty', type: 'text', importance: 'optional' },
    ],

    // 401: Laptops
    401: [
        {
            key: 'brand', label_th: 'แบรนด์', label_en: 'Brand', type: 'select', importance: 'required', aiDetectable: true,
            options: BRAND_DATABASE.laptops.map(b => ({ value: b, label_th: b, label_en: b }))
        },
        { key: 'model', label_th: 'รุ่น', label_en: 'Model', type: 'text', importance: 'required', extractFromTitle: true },
        {
            key: 'cpu', label_th: 'CPU', label_en: 'CPU', type: 'text', importance: 'required', aiDetectable: true,
            placeholder_th: 'เช่น M3 Pro, i7-13700H', placeholder_en: 'e.g. M3 Pro, i7-13700H'
        },
        {
            key: 'ram', label_th: 'RAM', label_en: 'RAM', type: 'select', importance: 'required',
            options: COMMON_OPTIONS.ram
        },
        {
            key: 'storage', label_th: 'Storage', label_en: 'Storage', type: 'text', importance: 'required',
            placeholder_th: 'เช่น SSD 512GB', placeholder_en: 'e.g. SSD 512GB'
        },
        { key: 'gpu', label_th: 'การ์ดจอ', label_en: 'GPU', type: 'text', importance: 'recommended', aiDetectable: true },
        {
            key: 'screen', label_th: 'หน้าจอ', label_en: 'Display', type: 'text', importance: 'recommended',
            placeholder_th: 'เช่น 15.6" FHD 144Hz', placeholder_en: 'e.g. 15.6" FHD 144Hz'
        },
        { key: 'battery_health', label_th: 'สุขภาพแบต', label_en: 'Battery', type: 'text', importance: 'recommended' },
        {
            key: 'overall', label_th: 'สภาพ', label_en: 'Condition', type: 'select', importance: 'required',
            options: COMMON_OPTIONS.condition
        },
    ],

    // 801: Digital Cameras
    801: [
        {
            key: 'brand', label_th: 'แบรนด์', label_en: 'Brand', type: 'select', importance: 'required', aiDetectable: true,
            options: BRAND_DATABASE.cameras.map(b => ({ value: b, label_th: b, label_en: b }))
        },
        { key: 'model', label_th: 'รุ่น', label_en: 'Model', type: 'text', importance: 'required', extractFromTitle: true },
        {
            key: 'sensor', label_th: 'เซนเซอร์', label_en: 'Sensor', type: 'select', importance: 'required',
            options: COMMON_OPTIONS.camera_sensor
        },
        { key: 'megapixels', label_th: 'Megapixels', label_en: 'Megapixels', type: 'text', importance: 'recommended' },
        {
            key: 'shutter_count', label_th: 'Shutter Count', label_en: 'Shutter Count', type: 'number', importance: 'recommended',
            placeholder_th: 'เช่น 15000', placeholder_en: 'e.g. 15000'
        },
        {
            key: 'overall', label_th: 'สภาพ', label_en: 'Condition', type: 'select', importance: 'required',
            options: COMMON_OPTIONS.condition
        },
    ],
}

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Get smart fields for a subcategory
 */
export function getSmartFields(subcategoryId: number): SmartField[] {
    return SMART_FIELDS[subcategoryId] || []
}

/**
 * Get brand options for a category
 */
export function getBrandOptions(categoryKey: keyof typeof BRAND_DATABASE): FieldOption[] {
    const brands = BRAND_DATABASE[categoryKey] || []
    return brands.map(b => ({ value: b, label_th: b, label_en: b }))
}

/**
 * Map AI Vision result to field values
 */
export function mapAIVisionToFields(aiResult: Record<string, string>): Record<string, string> {
    const mapped: Record<string, string> = {}

    for (const [aiKey, fieldKey] of Object.entries(AI_VISION_FIELD_MAPPING)) {
        if (aiResult[aiKey]) {
            mapped[fieldKey] = aiResult[aiKey]
        }
    }

    return mapped
}

/**
 * Get AI-detectable fields for a subcategory
 */
export function getAIDetectableFields(subcategoryId: number): string[] {
    const fields = SMART_FIELDS[subcategoryId] || []
    return fields.filter(f => f.aiDetectable).map(f => f.key)
}

/**
 * Validate field value
 */
export function validateField(field: SmartField, value: string): { valid: boolean; error?: string } {
    if (field.importance === 'required' && !value) {
        return { valid: false, error: `กรุณาระบุ${field.label_th}` }
    }

    if (field.validation) {
        if (field.validation.min && value.length < field.validation.min) {
            return { valid: false, error: `${field.label_th}ต้องมีอย่างน้อย ${field.validation.min} ตัวอักษร` }
        }
        if (field.validation.max && value.length > field.validation.max) {
            return { valid: false, error: `${field.label_th}ต้องไม่เกิน ${field.validation.max} ตัวอักษร` }
        }
    }

    return { valid: true }
}
