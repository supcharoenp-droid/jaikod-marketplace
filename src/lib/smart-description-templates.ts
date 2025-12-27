/**
 * SMART DESCRIPTION TEMPLATES - Complete Subcategory Coverage
 * 
 * ออกแบบจากการวิเคราะห์: Kaidee, Shopee, Lazada, CarMax, Facebook Marketplace
 * 
 * หลักการ:
 * 1. แต่ละ subcategory มี fields ที่เหมาะสมกับประเภทสินค้า
 * 2. "เหมาะสำหรับ" เปลี่ยนตามประเภทสินค้า
 * 3. ซ่อน fields/sections ที่ว่าง
 */

type FieldType = 'text' | 'select' | 'number'

interface SubcategoryTemplate {
    name: string
    emoji: string
    fields: string[]  // Field keys ที่ต้องแสดง
    targetAudience: { th: string[]; en: string[] }
}

// ============================================
// 1. AUTOMOTIVE (ID: 1)
// ============================================
const AUTOMOTIVE_TEMPLATES: Record<number, SubcategoryTemplate> = {
    101: { // รถยนต์มือสอง
        name: 'Used Cars',
        emoji: '🚗',
        fields: ['brand', 'model', 'year', 'mileage', 'color', 'transmission', 'fuel', 'engine_size', 'registration', 'accident_history', 'condition'],
        targetAudience: { th: ['ครอบครัว', 'คนทำงาน', 'วัยรุ่น'], en: ['Families', 'Professionals', 'Young Adults'] }
    },
    102: { // มอเตอร์ไซค์
        name: 'Motorcycles',
        emoji: '🏍️',
        fields: ['brand', 'model', 'year', 'mileage', 'cc', 'color', 'registration', 'condition'],
        targetAudience: { th: ['นักขี่', 'คนส่งของ', 'วัยรุ่น'], en: ['Riders', 'Delivery', 'Young Adults'] }
    },
    103: { // อะไหล่รถยนต์
        name: 'Car Parts',
        emoji: '🔧',
        fields: ['brand', 'part_name', 'part_number', 'compatible_vehicles', 'oem_or_aftermarket', 'condition', 'warranty'],
        targetAudience: { th: ['ช่างซ่อมรถ', 'อู่รถ', 'DIY'], en: ['Mechanics', 'Garages', 'DIY'] }
    },
    104: { // อะไหล่มอเตอร์ไซค์
        name: 'Motorcycle Parts',
        emoji: '🔩',
        fields: ['brand', 'part_name', 'compatible_models', 'oem_or_aftermarket', 'condition'],
        targetAudience: { th: ['ช่างมอเตอร์ไซค์', 'นักขี่'], en: ['Mechanics', 'Riders'] }
    },
    105: { // รถบรรทุก
        name: 'Trucks',
        emoji: '🚛',
        fields: ['brand', 'model', 'year', 'mileage', 'payload_capacity', 'fuel', 'registration', 'condition'],
        targetAudience: { th: ['ผู้ประกอบการ', 'บริษัทขนส่ง'], en: ['Business Owners', 'Transport Companies'] }
    },
    106: { // ล้อและยาง
        name: 'Wheels & Tires',
        emoji: '🛞',
        fields: ['brand', 'model', 'size', 'quantity', 'tread_remaining', 'year_manufactured', 'condition'],
        targetAudience: { th: ['คนใช้รถ', 'ช่างซ่อม', 'อู่ยาง'], en: ['Drivers', 'Mechanics', 'Tire Shops'] }
    },
    107: { // รถกระบะ
        name: 'Pickup Trucks',
        emoji: '🛻',
        fields: ['brand', 'model', 'year', 'mileage', 'cab_type', 'fuel', 'registration', 'condition'],
        targetAudience: { th: ['เกษตรกร', 'ผู้รับเหมา', 'ครอบครัว'], en: ['Farmers', 'Contractors', 'Families'] }
    },
    108: { // รถตู้
        name: 'Vans',
        emoji: '🚐',
        fields: ['brand', 'model', 'year', 'mileage', 'seats', 'fuel', 'registration', 'condition'],
        targetAudience: { th: ['ธุรกิจท่องเที่ยว', 'ครอบครัวใหญ่'], en: ['Tour Business', 'Large Families'] }
    },
    109: { // อุปกรณ์บำรุงรักษารถ
        name: 'Car Maintenance',
        emoji: '🧴',
        fields: ['brand', 'product_name', 'type', 'size', 'expiry', 'condition'],
        targetAudience: { th: ['คนใช้รถ', 'อู่รถ'], en: ['Car Owners', 'Garages'] }
    },
}

// ============================================
// 2. REAL ESTATE (ID: 2)
// ============================================
const REAL_ESTATE_TEMPLATES: Record<number, SubcategoryTemplate> = {
    201: { // บ้านเดี่ยว
        name: 'House',
        emoji: '🏠',
        fields: ['location', 'land_size', 'usable_area', 'bedrooms', 'bathrooms', 'parking', 'furnishing', 'facilities'],
        targetAudience: { th: ['ครอบครัว', 'นักลงทุน'], en: ['Families', 'Investors'] }
    },
    202: { // คอนโด
        name: 'Condo',
        emoji: '🏢',
        fields: ['project_name', 'location', 'floor', 'size_sqm', 'bedrooms', 'furnishing', 'facilities', 'bts_mrt'],
        targetAudience: { th: ['คนทำงาน', 'นักลงทุน', 'นักศึกษา'], en: ['Professionals', 'Investors', 'Students'] }
    },
    203: { // ที่ดิน
        name: 'Land',
        emoji: '🌍',
        fields: ['location', 'land_size', 'land_type', 'road_access', 'utilities', 'zoning'],
        targetAudience: { th: ['นักลงทุน', 'ผู้ประกอบการ'], en: ['Investors', 'Developers'] }
    },
    204: { // ทาวน์เฮ้าส์
        name: 'Townhouse',
        emoji: '🏘️',
        fields: ['location', 'land_size', 'usable_area', 'bedrooms', 'bathrooms', 'parking', 'furnishing'],
        targetAudience: { th: ['ครอบครัวเล็ก', 'คู่แต่งงานใหม่'], en: ['Small Families', 'Newlyweds'] }
    },
    205: { // อาคารพาณิชย์
        name: 'Commercial',
        emoji: '🏬',
        fields: ['location', 'floors', 'usable_area', 'road_frontage', 'parking', 'utilities'],
        targetAudience: { th: ['ผู้ประกอบการ', 'นักลงทุน'], en: ['Business Owners', 'Investors'] }
    },
    206: { // หอพัก/ห้องเช่า
        name: 'Apartment',
        emoji: '🏨',
        fields: ['location', 'room_size', 'furnishing', 'utilities_included', 'facilities', 'nearby'],
        targetAudience: { th: ['นักศึกษา', 'คนทำงาน'], en: ['Students', 'Workers'] }
    },
    207: { // โกดัง/โรงงาน
        name: 'Warehouse',
        emoji: '🏭',
        fields: ['location', 'size_sqm', 'ceiling_height', 'loading_dock', 'power', 'road_access'],
        targetAudience: { th: ['ผู้ประกอบการ', 'โรงงาน'], en: ['Business Owners', 'Factories'] }
    },
    208: { // สำนักงาน
        name: 'Office Space',
        emoji: '🖥️',
        fields: ['building_name', 'location', 'floor', 'size_sqm', 'furnishing', 'facilities', 'parking'],
        targetAudience: { th: ['บริษัท', 'Startup'], en: ['Companies', 'Startups'] }
    },
}

// ============================================
// 3. MOBILE (ID: 3)
// ============================================
const MOBILE_TEMPLATES: Record<number, SubcategoryTemplate> = {
    301: { // มือถือ
        name: 'Mobile Phones',
        emoji: '📱',
        fields: ['brand', 'model', 'storage', 'ram', 'color', 'battery_health', 'screen_condition', 'icloud_status', 'accessories', 'condition'],
        targetAudience: { th: ['นักศึกษา', 'คนทำงาน', 'เกมเมอร์', 'ผู้สูงอายุ'], en: ['Students', 'Professionals', 'Gamers', 'Seniors'] }
    },
    302: { // แท็บเล็ต
        name: 'Tablets',
        emoji: '📲',
        fields: ['brand', 'model', 'storage', 'screen_size', 'cellular', 'battery_health', 'accessories', 'condition'],
        targetAudience: { th: ['นักศึกษา', 'ศิลปิน', 'เด็ก'], en: ['Students', 'Artists', 'Kids'] }
    },
    303: { // Wearables
        name: 'Wearables',
        emoji: '⌚',
        fields: ['brand', 'model', 'size', 'color', 'battery_life', 'features', 'condition'],
        targetAudience: { th: ['คนรักสุขภาพ', 'นักกีฬา'], en: ['Health Conscious', 'Athletes'] }
    },
    304: { // อุปกรณ์เสริมมือถือ
        name: 'Mobile Accessories',
        emoji: '🔌',
        fields: ['brand', 'type', 'compatible_models', 'color', 'condition'],
        targetAudience: { th: ['คนใช้มือถือ'], en: ['Mobile Users'] }
    },
    305: { // อะไหล่มือถือ
        name: 'Mobile Parts',
        emoji: '🔧',
        fields: ['brand', 'part_type', 'compatible_models', 'oem_or_copy', 'condition'],
        targetAudience: { th: ['ช่างซ่อมมือถือ', 'DIY'], en: ['Repair Technicians', 'DIY'] }
    },
    306: { // ฟิล์ม/เคส
        name: 'Film & Cases',
        emoji: '📦',
        fields: ['type', 'compatible_models', 'material', 'color', 'condition'],
        targetAudience: { th: ['คนใช้มือถือ'], en: ['Mobile Users'] }
    },
    307: { // แบตสำรอง
        name: 'Power Banks',
        emoji: '🔋',
        fields: ['brand', 'capacity_mah', 'output_watts', 'ports', 'fast_charging', 'condition'],
        targetAudience: { th: ['คนเดินทาง', 'นักศึกษา'], en: ['Travelers', 'Students'] }
    },
}

// ============================================
// 4. COMPUTERS (ID: 4)
// ============================================
const COMPUTER_TEMPLATES: Record<number, SubcategoryTemplate> = {
    401: { // โน้ตบุ๊ค
        name: 'Laptops',
        emoji: '💻',
        fields: ['brand', 'model', 'cpu', 'ram', 'storage', 'gpu', 'screen_size', 'battery_health', 'os', 'condition'],
        targetAudience: { th: ['นักศึกษา', 'โปรแกรมเมอร์', 'นักออกแบบ', 'เกมเมอร์'], en: ['Students', 'Programmers', 'Designers', 'Gamers'] }
    },
    402: { // PC ตั้งโต๊ะ
        name: 'Desktop PCs',
        emoji: '🖥️',
        fields: ['cpu', 'ram', 'storage', 'gpu', 'psu', 'case', 'os', 'condition'],
        targetAudience: { th: ['เกมเมอร์', 'โปรแกรมเมอร์', 'สตรีมเมอร์'], en: ['Gamers', 'Programmers', 'Streamers'] }
    },
    403: { // จอคอมพิวเตอร์
        name: 'Monitors',
        emoji: '🖥️',
        fields: ['brand', 'model', 'size', 'resolution', 'refresh_rate', 'panel_type', 'ports', 'condition'],
        targetAudience: { th: ['เกมเมอร์', 'นักออกแบบ', 'คนทำงาน'], en: ['Gamers', 'Designers', 'Workers'] }
    },
    404: { // อุปกรณ์เสริม
        name: 'Peripherals',
        emoji: '🖱️',
        fields: ['brand', 'type', 'connectivity', 'features', 'condition'],
        targetAudience: { th: ['คนใช้คอม'], en: ['Computer Users'] }
    },
    405: { // ปริ้นเตอร์
        name: 'Printers',
        emoji: '🖨️',
        fields: ['brand', 'model', 'type', 'print_technology', 'features', 'condition'],
        targetAudience: { th: ['ออฟฟิศ', 'ร้านถ่ายเอกสาร'], en: ['Offices', 'Print Shops'] }
    },
    406: { // Components
        name: 'Components',
        emoji: '🔧',
        fields: ['brand', 'model', 'type', 'specs', 'warranty', 'condition'],
        targetAudience: { th: ['ช่างคอม', 'เกมเมอร์'], en: ['PC Builders', 'Gamers'] }
    },
    407: { // Gaming PC
        name: 'Gaming PCs',
        emoji: '🎮',
        fields: ['cpu', 'gpu', 'ram', 'storage', 'psu', 'cooling', 'rgb', 'condition'],
        targetAudience: { th: ['เกมเมอร์', 'สตรีมเมอร์'], en: ['Gamers', 'Streamers'] }
    },
    408: { // คีย์บอร์ด
        name: 'Keyboards',
        emoji: '⌨️',
        fields: ['brand', 'model', 'switch_type', 'layout', 'rgb', 'connectivity', 'condition'],
        targetAudience: { th: ['เกมเมอร์', 'โปรแกรมเมอร์'], en: ['Gamers', 'Programmers'] }
    },
    409: { // เมาส์
        name: 'Mouse',
        emoji: '🖱️',
        fields: ['brand', 'model', 'dpi', 'connectivity', 'rgb', 'condition'],
        targetAudience: { th: ['เกมเมอร์', 'นักออกแบบ'], en: ['Gamers', 'Designers'] }
    },
    410: { // ชิ้นส่วน PC
        name: 'PC Parts',
        emoji: '🔩',
        fields: ['type', 'brand', 'model', 'specs', 'warranty', 'condition'],
        targetAudience: { th: ['ช่างประกอบ', 'เกมเมอร์'], en: ['PC Builders', 'Gamers'] }
    },
}

// ============================================
// 5. HOME APPLIANCES (ID: 5)
// ============================================
const APPLIANCES_TEMPLATES: Record<number, SubcategoryTemplate> = {
    501: { // แอร์
        name: 'Air Conditioners',
        emoji: '❄️',
        fields: ['brand', 'model', 'btu', 'type', 'inverter', 'energy_rating', 'installation', 'warranty', 'condition'],
        targetAudience: { th: ['บ้านพักอาศัย', 'คอนโด', 'ออฟฟิศ', 'ร้านค้า'], en: ['Homes', 'Condos', 'Offices', 'Shops'] }
    },
    502: { // ตู้เย็น
        name: 'Refrigerators',
        emoji: '🧊',
        fields: ['brand', 'model', 'capacity_liters', 'type', 'energy_rating', 'features', 'condition'],
        targetAudience: { th: ['ครอบครัว', 'ร้านอาหาร'], en: ['Families', 'Restaurants'] }
    },
    503: { // เครื่องซักผ้า
        name: 'Washing Machines',
        emoji: '🫧',
        fields: ['brand', 'model', 'capacity_kg', 'type', 'features', 'energy_rating', 'condition'],
        targetAudience: { th: ['ครอบครัว', 'ร้านซักรีด'], en: ['Families', 'Laundry Shops'] }
    },
    504: { // ทีวี
        name: 'TV & Audio',
        emoji: '📺',
        fields: ['brand', 'model', 'screen_size', 'resolution', 'smart_tv', 'panel_type', 'condition'],
        targetAudience: { th: ['ครอบครัว', 'เกมเมอร์'], en: ['Families', 'Gamers'] }
    },
    505: { // เครื่องใช้ในครัว
        name: 'Kitchen Appliances',
        emoji: '🍳',
        fields: ['brand', 'type', 'model', 'capacity', 'features', 'condition'],
        targetAudience: { th: ['คนชอบทำอาหาร', 'ครอบครัว'], en: ['Home Chefs', 'Families'] }
    },
    506: { // เครื่องทำน้ำอุ่น
        name: 'Water Heaters',
        emoji: '🚿',
        fields: ['brand', 'model', 'type', 'power_watts', 'safety_features', 'condition'],
        targetAudience: { th: ['บ้าน', 'คอนโด'], en: ['Homes', 'Condos'] }
    },
    507: { // เครื่องดูดฝุ่น
        name: 'Vacuum Cleaners',
        emoji: '🧹',
        fields: ['brand', 'model', 'type', 'power', 'cordless', 'features', 'condition'],
        targetAudience: { th: ['บ้าน', 'ออฟฟิศ'], en: ['Homes', 'Offices'] }
    },
    508: { // พัดลม
        name: 'Fans',
        emoji: '🌀',
        fields: ['brand', 'model', 'size', 'type', 'features', 'color', 'condition'],
        targetAudience: { th: ['บ้าน', 'หอพัก', 'ออฟฟิศ'], en: ['Homes', 'Dorms', 'Offices'] }
    },
    509: { // เครื่องฟอกอากาศ
        name: 'Air Purifiers',
        emoji: '🌬️',
        fields: ['brand', 'model', 'coverage_sqm', 'filter_type', 'features', 'condition'],
        targetAudience: { th: ['ครอบครัว', 'คนแพ้ฝุ่น'], en: ['Families', 'Allergy Sufferers'] }
    },
    510: { // เครื่องรีดผ้า
        name: 'Irons',
        emoji: '👕',
        fields: ['brand', 'model', 'type', 'power', 'features', 'condition'],
        targetAudience: { th: ['บ้าน', 'ร้านซักรีด'], en: ['Homes', 'Laundry Shops'] }
    },
    511: { // เครื่องทำน้ำดื่ม
        name: 'Water Dispensers',
        emoji: '💧',
        fields: ['brand', 'model', 'type', 'features', 'condition'],
        targetAudience: { th: ['บ้าน', 'ออฟฟิศ'], en: ['Homes', 'Offices'] }
    },
}

// ============================================
// 6. FASHION (ID: 6)
// ============================================
const FASHION_TEMPLATES: Record<number, SubcategoryTemplate> = {
    601: { // เสื้อผ้าผู้ชาย
        name: "Men's Clothing",
        emoji: '👔',
        fields: ['brand', 'type', 'size', 'color', 'material', 'condition'],
        targetAudience: { th: ['ผู้ชาย'], en: ['Men'] }
    },
    602: { // เสื้อผ้าผู้หญิง
        name: "Women's Clothing",
        emoji: '👗',
        fields: ['brand', 'type', 'size', 'color', 'material', 'condition'],
        targetAudience: { th: ['ผู้หญิง'], en: ['Women'] }
    },
    603: { // กระเป๋าแบรนด์เนม
        name: 'Brandname Bags',
        emoji: '👜',
        fields: ['brand', 'model', 'size', 'color', 'material', 'serial', 'authenticity', 'receipt', 'condition'],
        targetAudience: { th: ['คนรักแบรนด์เนม', 'นักสะสม', 'สาวออฟฟิศ'], en: ['Brand Lovers', 'Collectors', 'Professionals'] }
    },
    604: { // รองเท้า
        name: 'Shoes & Sneakers',
        emoji: '👟',
        fields: ['brand', 'model', 'size_eu', 'size_us', 'color', 'authenticity', 'condition'],
        targetAudience: { th: ['Sneakerhead', 'นักกีฬา'], en: ['Sneakerheads', 'Athletes'] }
    },
    605: { // นาฬิกา
        name: 'Watches',
        emoji: '⌚',
        fields: ['brand', 'model', 'movement', 'case_size', 'case_material', 'strap_material', 'box_papers', 'condition'],
        targetAudience: { th: ['นักสะสม', 'สุภาพบุรุษ', 'นักลงทุน'], en: ['Collectors', 'Gentlemen', 'Investors'] }
    },
    606: { // เครื่องประดับ
        name: 'Jewelry',
        emoji: '💍',
        fields: ['type', 'material', 'gemstone', 'weight', 'authenticity', 'condition'],
        targetAudience: { th: ['สุภาพสตรี', 'นักสะสม'], en: ['Ladies', 'Collectors'] }
    },
    607: { // แฟชั่นเสริม
        name: 'Fashion Accessories',
        emoji: '🧣',
        fields: ['brand', 'type', 'color', 'material', 'condition'],
        targetAudience: { th: ['คนรักแฟชั่น'], en: ['Fashion Lovers'] }
    },
    608: { // เสื้อผ้าเด็ก
        name: 'Kids Fashion',
        emoji: '👶',
        fields: ['brand', 'type', 'size', 'age_range', 'color', 'condition'],
        targetAudience: { th: ['พ่อแม่'], en: ['Parents'] }
    },
}

// ============================================
// 7. GAMING (ID: 7)
// ============================================
const GAMING_TEMPLATES: Record<number, SubcategoryTemplate> = {
    701: { // เครื่องเกม
        name: 'Game Consoles',
        emoji: '🎮',
        fields: ['brand', 'model', 'storage', 'color', 'edition', 'controllers', 'games_included', 'condition'],
        targetAudience: { th: ['เกมเมอร์', 'ครอบครัว'], en: ['Gamers', 'Families'] }
    },
    702: { // แผ่นเกม
        name: 'Video Games',
        emoji: '💿',
        fields: ['title', 'platform', 'region', 'language', 'condition'],
        targetAudience: { th: ['เกมเมอร์', 'นักสะสม'], en: ['Gamers', 'Collectors'] }
    },
    703: { // เกมมิ่งเกียร์
        name: 'Gaming Gear',
        emoji: '🕹️',
        fields: ['brand', 'type', 'model', 'features', 'rgb', 'condition'],
        targetAudience: { th: ['เกมเมอร์'], en: ['Gamers'] }
    },
    704: { // หูฟังเกมมิ่ง
        name: 'Gaming Headsets',
        emoji: '🎧',
        fields: ['brand', 'model', 'driver_size', 'surround', 'microphone', 'connectivity', 'condition'],
        targetAudience: { th: ['เกมเมอร์', 'สตรีมเมอร์'], en: ['Gamers', 'Streamers'] }
    },
    705: { // คีย์บอร์ดเกมมิ่ง
        name: 'Gaming Keyboards',
        emoji: '⌨️',
        fields: ['brand', 'model', 'switch_type', 'layout', 'rgb', 'features', 'condition'],
        targetAudience: { th: ['เกมเมอร์'], en: ['Gamers'] }
    },
    706: { // โดรน
        name: 'Drones',
        emoji: '🛸',
        fields: ['brand', 'model', 'camera', 'flight_time', 'range', 'features', 'condition'],
        targetAudience: { th: ['ช่างภาพ', 'ผู้สร้างคอนเทนต์'], en: ['Photographers', 'Content Creators'] }
    },
    707: { // VR
        name: 'VR Headsets',
        emoji: '🥽',
        fields: ['brand', 'model', 'resolution', 'tracking', 'controllers', 'condition'],
        targetAudience: { th: ['เกมเมอร์', 'นักพัฒนา'], en: ['Gamers', 'Developers'] }
    },
}

// ============================================
// 8. CAMERAS (ID: 8)
// ============================================
const CAMERA_TEMPLATES: Record<number, SubcategoryTemplate> = {
    801: { // กล้องดิจิตอล
        name: 'Digital Cameras',
        emoji: '📷',
        fields: ['brand', 'model', 'type', 'sensor', 'megapixels', 'lens_mount', 'shutter_count', 'accessories', 'condition'],
        targetAudience: { th: ['ช่างภาพ', 'Content Creator', 'นักท่องเที่ยว'], en: ['Photographers', 'Content Creators', 'Travelers'] }
    },
    802: { // กล้องฟิล์ม
        name: 'Film Cameras',
        emoji: '📸',
        fields: ['brand', 'model', 'type', 'film_format', 'lens_mount', 'shutter_works', 'condition'],
        targetAudience: { th: ['นักสะสม', 'ช่างภาพฟิล์ม'], en: ['Collectors', 'Film Photographers'] }
    },
    803: { // เลนส์
        name: 'Lenses',
        emoji: '🔭',
        fields: ['brand', 'model', 'focal_length', 'aperture', 'mount', 'autofocus', 'condition'],
        targetAudience: { th: ['ช่างภาพ'], en: ['Photographers'] }
    },
    804: { // อุปกรณ์สตูดิโอ
        name: 'Studio Equipment',
        emoji: '💡',
        fields: ['type', 'brand', 'model', 'power', 'features', 'condition'],
        targetAudience: { th: ['ช่างภาพ', 'สตูดิโอ'], en: ['Photographers', 'Studios'] }
    },
}

// ============================================
// 9. AMULETS & COLLECTIBLES (ID: 9)
// ============================================
const AMULETS_TEMPLATES: Record<number, SubcategoryTemplate> = {
    901: { // พระเครื่อง
        name: 'Thai Amulets',
        emoji: '🙏',
        fields: ['name', 'temple', 'year', 'material', 'size', 'certificate', 'condition'],
        targetAudience: { th: ['นักสะสม', 'ผู้ศรัทธา'], en: ['Collectors', 'Believers'] }
    },
    902: { // เหรียญ
        name: 'Coins',
        emoji: '🪙',
        fields: ['name', 'year', 'material', 'denomination', 'rarity', 'condition'],
        targetAudience: { th: ['นักสะสม'], en: ['Collectors'] }
    },
    903: { // ธนบัตร
        name: 'Banknotes',
        emoji: '💵',
        fields: ['denomination', 'year', 'series', 'serial', 'rarity', 'condition'],
        targetAudience: { th: ['นักสะสม'], en: ['Collectors'] }
    },
    904: { // ของเก่า
        name: 'Antiques',
        emoji: '🏺',
        fields: ['type', 'era', 'origin', 'material', 'size', 'provenance', 'condition'],
        targetAudience: { th: ['นักสะสม', 'นักประวัติศาสตร์'], en: ['Collectors', 'Historians'] }
    },
    905: { // Art Toy
        name: 'Art Toys',
        emoji: '🎨',
        fields: ['brand', 'series', 'name', 'size', 'limited_edition', 'sealed', 'condition'],
        targetAudience: { th: ['นักสะสม', 'คนรัก Art Toy'], en: ['Collectors', 'Art Toy Fans'] }
    },
}

// ============================================
// 10. PETS (ID: 10)
// ============================================
const PETS_TEMPLATES: Record<number, SubcategoryTemplate> = {
    1001: { // สุนัข
        name: 'Dogs',
        emoji: '🐕',
        fields: ['breed', 'age', 'gender', 'color', 'vaccinated', 'pedigree', 'microchip'],
        targetAudience: { th: ['คนรักสุนัข', 'ครอบครัว'], en: ['Dog Lovers', 'Families'] }
    },
    1002: { // แมว
        name: 'Cats',
        emoji: '🐈',
        fields: ['breed', 'age', 'gender', 'color', 'vaccinated', 'pedigree'],
        targetAudience: { th: ['คนรักแมว', 'คนอยู่คนเดียว'], en: ['Cat Lovers', 'Singles'] }
    },
    1003: { // สัตว์อื่น
        name: 'Other Pets',
        emoji: '🐹',
        fields: ['type', 'breed', 'age', 'gender', 'health'],
        targetAudience: { th: ['คนรักสัตว์'], en: ['Pet Lovers'] }
    },
    1004: { // อุปกรณ์สัตว์เลี้ยง
        name: 'Pet Supplies',
        emoji: '🦴',
        fields: ['type', 'brand', 'size', 'for_pet_type', 'condition'],
        targetAudience: { th: ['เจ้าของสัตว์เลี้ยง'], en: ['Pet Owners'] }
    },
    1005: { // อาหารสัตว์
        name: 'Pet Food',
        emoji: '🍖',
        fields: ['brand', 'type', 'for_pet_type', 'weight', 'expiry'],
        targetAudience: { th: ['เจ้าของสัตว์เลี้ยง'], en: ['Pet Owners'] }
    },
}

// ============================================
// 12. SPORTS & TRAVEL (ID: 12)
// ============================================
const SPORTS_TEMPLATES: Record<number, SubcategoryTemplate> = {
    1201: { // จักรยาน
        name: 'Bicycles',
        emoji: '🚲',
        fields: ['brand', 'model', 'type', 'frame_size', 'wheel_size', 'groupset', 'condition'],
        targetAudience: { th: ['นักปั่น', 'คนรักสุขภาพ'], en: ['Cyclists', 'Fitness Enthusiasts'] }
    },
    1202: { // เครื่องออกกำลังกาย
        name: 'Fitness Equipment',
        emoji: '🏋️',
        fields: ['brand', 'type', 'model', 'features', 'max_weight', 'condition'],
        targetAudience: { th: ['คนรักสุขภาพ', 'ฟิตเนส'], en: ['Fitness Enthusiasts', 'Gyms'] }
    },
    1203: { // แคมป์ปิ้ง
        name: 'Camping',
        emoji: '⛺',
        fields: ['brand', 'type', 'capacity', 'weight', 'features', 'condition'],
        targetAudience: { th: ['นักแคมป์', 'นักเดินทาง'], en: ['Campers', 'Travelers'] }
    },
    1204: { // อุปกรณ์กีฬา
        name: 'Sports Gear',
        emoji: '⚽',
        fields: ['brand', 'sport', 'type', 'size', 'condition'],
        targetAudience: { th: ['นักกีฬา'], en: ['Athletes'] }
    },
    1205: { // บัตรท่องเที่ยว
        name: 'Travel Vouchers',
        emoji: '✈️',
        fields: ['type', 'destination', 'validity', 'includes', 'original_price'],
        targetAudience: { th: ['นักท่องเที่ยว'], en: ['Travelers'] }
    },
    1206: { // สเก็ต
        name: 'Skate/Roller',
        emoji: '🛹',
        fields: ['brand', 'type', 'size', 'skill_level', 'condition'],
        targetAudience: { th: ['วัยรุ่น', 'นักกีฬา'], en: ['Teens', 'Athletes'] }
    },
}

// ============================================
// 13. HOME & GARDEN (ID: 13)
// ============================================
const HOME_TEMPLATES: Record<number, SubcategoryTemplate> = {
    1301: { // เฟอร์นิเจอร์
        name: 'Furniture',
        emoji: '🛋️',
        fields: ['brand', 'type', 'material', 'size', 'color', 'style', 'condition'],
        targetAudience: { th: ['บ้านใหม่', 'ตกแต่งบ้าน'], en: ['New Homes', 'Interior Design'] }
    },
    1302: { // ของตกแต่งบ้าน
        name: 'Home Decor',
        emoji: '🖼️',
        fields: ['type', 'style', 'material', 'size', 'color', 'condition'],
        targetAudience: { th: ['คนตกแต่งบ้าน'], en: ['Home Decorators'] }
    },
    1303: { // ต้นไม้/สวน
        name: 'Gardening',
        emoji: '🌱',
        fields: ['plant_name', 'type', 'size', 'age', 'care_level'],
        targetAudience: { th: ['คนรักต้นไม้', 'ชาวสวน'], en: ['Plant Lovers', 'Gardeners'] }
    },
    1304: { // เครื่องมือช่าง
        name: 'Tools',
        emoji: '🔨',
        fields: ['brand', 'type', 'power_source', 'features', 'condition'],
        targetAudience: { th: ['ช่าง', 'DIY'], en: ['Technicians', 'DIY'] }
    },
    1305: { // อุปกรณ์สวน
        name: 'Garden Equipment',
        emoji: '🌿',
        fields: ['brand', 'type', 'power_source', 'features', 'condition'],
        targetAudience: { th: ['ชาวสวน'], en: ['Gardeners'] }
    },
}

// ============================================
// 14. BEAUTY & COSMETICS (ID: 14)
// ============================================
const BEAUTY_TEMPLATES: Record<number, SubcategoryTemplate> = {
    1401: { // เครื่องสำอาง
        name: 'Makeup',
        emoji: '💄',
        fields: ['brand', 'product_name', 'type', 'shade', 'size', 'expiry', 'usage_percent', 'condition'],
        targetAudience: { th: ['สาวๆ', 'ช่างแต่งหน้า'], en: ['Women', 'Makeup Artists'] }
    },
    1402: { // สกินแคร์
        name: 'Skincare',
        emoji: '🧴',
        fields: ['brand', 'product_name', 'type', 'size', 'skin_type', 'expiry', 'usage_percent'],
        targetAudience: { th: ['สาวๆ', 'คนรักผิว'], en: ['Women', 'Skincare Enthusiasts'] }
    },
    1403: { // แฮร์แคร์
        name: 'Haircare',
        emoji: '💇',
        fields: ['brand', 'product_name', 'type', 'size', 'hair_type', 'expiry'],
        targetAudience: { th: ['ทุกคน'], en: ['Everyone'] }
    },
    1404: { // น้ำหอม
        name: 'Perfumes',
        emoji: '🌸',
        fields: ['brand', 'name', 'type', 'size_ml', 'concentration', 'remaining_percent'],
        targetAudience: { th: ['ทุกคน', 'นักสะสม'], en: ['Everyone', 'Collectors'] }
    },
    1405: { // บอดี้แคร์
        name: 'Body Care',
        emoji: '🛁',
        fields: ['brand', 'product_name', 'type', 'size', 'expiry'],
        targetAudience: { th: ['ทุกคน'], en: ['Everyone'] }
    },
    1406: { // อุปกรณ์ความงาม
        name: 'Beauty Tools',
        emoji: '💅',
        fields: ['brand', 'type', 'features', 'power_source', 'condition'],
        targetAudience: { th: ['สาวๆ', 'ช่างทำผม'], en: ['Women', 'Stylists'] }
    },
}

// ============================================
// 15. BABY & KIDS (ID: 15)
// ============================================
const KIDS_TEMPLATES: Record<number, SubcategoryTemplate> = {
    1501: { // เสื้อผ้าเด็ก
        name: 'Kids Clothing',
        emoji: '👕',
        fields: ['brand', 'type', 'size', 'age_range', 'gender', 'color', 'condition'],
        targetAudience: { th: ['พ่อแม่'], en: ['Parents'] }
    },
    1502: { // รองเท้าเด็ก
        name: 'Kids Shoes',
        emoji: '👟',
        fields: ['brand', 'type', 'size', 'age_range', 'gender', 'color', 'condition'],
        targetAudience: { th: ['พ่อแม่'], en: ['Parents'] }
    },
    1503: { // ของเล่น
        name: 'Toys',
        emoji: '🧸',
        fields: ['brand', 'name', 'type', 'age_range', 'completeness', 'battery_required', 'condition'],
        targetAudience: { th: ['พ่อแม่', 'นักสะสม'], en: ['Parents', 'Collectors'] }
    },
    1504: { // อุปกรณ์เด็กอ่อน
        name: 'Baby Gear',
        emoji: '🍼',
        fields: ['brand', 'type', 'age_range', 'features', 'safety_certified', 'condition'],
        targetAudience: { th: ['พ่อแม่มือใหม่'], en: ['New Parents'] }
    },
    1505: { // ดูแลเด็ก
        name: 'Baby Care',
        emoji: '👶',
        fields: ['brand', 'type', 'size', 'age_range', 'expiry'],
        targetAudience: { th: ['พ่อแม่'], en: ['Parents'] }
    },
    1506: { // เฟอร์นิเจอร์เด็ก
        name: 'Kids Furniture',
        emoji: '🛏️',
        fields: ['brand', 'type', 'size', 'age_range', 'material', 'safety_certified', 'condition'],
        targetAudience: { th: ['พ่อแม่'], en: ['Parents'] }
    },
}

// ============================================
// 16. BOOKS & EDUCATION (ID: 16)
// ============================================
const BOOKS_TEMPLATES: Record<number, SubcategoryTemplate> = {
    1601: { // หนังสือทั่วไป
        name: 'General Books',
        emoji: '📖',
        fields: ['title', 'author', 'publisher', 'language', 'isbn', 'condition'],
        targetAudience: { th: ['นักอ่าน'], en: ['Readers'] }
    },
    1602: { // การ์ตูน
        name: 'Comics & Manga',
        emoji: '📚',
        fields: ['title', 'author', 'publisher', 'volume', 'language', 'condition'],
        targetAudience: { th: ['คนรักการ์ตูน', 'นักสะสม'], en: ['Manga Fans', 'Collectors'] }
    },
    1603: { // นิตยสาร
        name: 'Magazines',
        emoji: '📰',
        fields: ['title', 'issue', 'year', 'language', 'condition'],
        targetAudience: { th: ['นักอ่าน', 'นักสะสม'], en: ['Readers', 'Collectors'] }
    },
    1604: { // หนังสือเรียน
        name: 'Textbooks',
        emoji: '📕',
        fields: ['title', 'subject', 'level', 'author', 'edition', 'condition'],
        targetAudience: { th: ['นักศึกษา'], en: ['Students'] }
    },
    1605: { // คอร์สออนไลน์
        name: 'Online Courses',
        emoji: '💻',
        fields: ['platform', 'course_name', 'instructor', 'duration', 'language', 'lifetime_access'],
        targetAudience: { th: ['ผู้เรียน'], en: ['Learners'] }
    },
    1606: { // เครื่องเขียน
        name: 'Stationery',
        emoji: '✏️',
        fields: ['brand', 'type', 'quantity', 'color', 'condition'],
        targetAudience: { th: ['นักศึกษา', 'ออฟฟิศ'], en: ['Students', 'Offices'] }
    },
}

// ============================================
// EXPORT ALL TEMPLATES
// ============================================
export const ALL_SUBCATEGORY_TEMPLATES: Record<number, SubcategoryTemplate> = {
    ...AUTOMOTIVE_TEMPLATES,
    ...REAL_ESTATE_TEMPLATES,
    ...MOBILE_TEMPLATES,
    ...COMPUTER_TEMPLATES,
    ...APPLIANCES_TEMPLATES,
    ...FASHION_TEMPLATES,
    ...GAMING_TEMPLATES,
    ...CAMERA_TEMPLATES,
    ...AMULETS_TEMPLATES,
    ...PETS_TEMPLATES,
    ...SPORTS_TEMPLATES,
    ...HOME_TEMPLATES,
    ...BEAUTY_TEMPLATES,
    ...KIDS_TEMPLATES,
    ...BOOKS_TEMPLATES,
}

// Helper function
export function getSmartTemplateBySubcategory(subcategoryId: number): SubcategoryTemplate | null {
    return ALL_SUBCATEGORY_TEMPLATES[subcategoryId] || null
}

// Get target audience for subcategory
export function getTargetAudience(subcategoryId: number, lang: 'th' | 'en'): string[] {
    const template = ALL_SUBCATEGORY_TEMPLATES[subcategoryId]
    if (template) {
        return template.targetAudience[lang]
    }
    return lang === 'th' ? ['ทุกคน'] : ['Everyone']
}
