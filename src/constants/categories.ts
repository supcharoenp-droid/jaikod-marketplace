export interface Subcategory {
    id: number
    name_th: string
    name_en: string
    slug: string
}

export interface Category {
    id: number
    name_th: string
    name_en: string
    slug: string
    icon: string
    order_index: number
    subcategories?: Subcategory[]
    is_hot?: boolean
    is_new?: boolean
}

export const CATEGORIES: Category[] = [
    {
        id: 1,
        name_th: 'ยานยนต์',
        name_en: 'Automotive',
        slug: 'automotive',
        icon: '🚗',
        order_index: 1,
        is_hot: true,
        subcategories: [
            { id: 101, name_th: 'รถยนต์มือสอง', name_en: 'Used Cars', slug: 'cars' },
            { id: 102, name_th: 'มอเตอร์ไซค์', name_en: 'Motorcycles', slug: 'motorcycles' },
            { id: 103, name_th: 'อะไหล่รถยนต์', name_en: 'Car Parts', slug: 'car-parts' },
            { id: 104, name_th: 'อะไหล่มอเตอร์ไซค์', name_en: 'Motorcycle Parts', slug: 'motorcycle-parts' },
            { id: 105, name_th: 'รถบรรทุกและรถเพื่อการพาณิชย์', name_en: 'Trucks & Commercial', slug: 'trucks' },
            { id: 106, name_th: 'ล้อและยาง', name_en: 'Wheels & Tires', slug: 'wheels' },
            { id: 107, name_th: 'รถกระบะ', name_en: 'Pickup Trucks', slug: 'pickups' },
            { id: 108, name_th: 'รถตู้', name_en: 'Vans', slug: 'vans' },
            { id: 109, name_th: 'อุปกรณ์บำรุงรักษารถ', name_en: 'Car Maintenance', slug: 'car-maintenance' },
        ],
    },
    {
        id: 2,
        name_th: 'อสังหาริมทรัพย์',
        name_en: 'Real Estate',
        slug: 'real-estate',
        icon: '🏠',
        order_index: 2,
        is_hot: true,
        subcategories: [
            { id: 201, name_th: 'บ้านเดี่ยว', name_en: 'House', slug: 'house' },
            { id: 202, name_th: 'คอนโดมิเนียม', name_en: 'Condo', slug: 'condo' },
            { id: 203, name_th: 'ที่ดิน', name_en: 'Land', slug: 'land' },
            { id: 204, name_th: 'ทาวน์เฮ้าส์', name_en: 'Townhouse', slug: 'townhouse' },
            { id: 205, name_th: 'อาคารพาณิชย์', name_en: 'Commercial', slug: 'commercial' },
            { id: 206, name_th: 'หอพัก/ห้องเช่า', name_en: 'Apartment for Rent', slug: 'apartment' },
            { id: 207, name_th: 'โกดัง/โรงงาน', name_en: 'Warehouse/Factory', slug: 'warehouse' },
            { id: 208, name_th: 'พื้นที่สำนักงาน', name_en: 'Office Space', slug: 'office-space' },
        ],
    },
    {
        id: 3,
        name_th: 'มือถือและแท็บเล็ต',
        name_en: 'Mobiles & Tablets',
        slug: 'mobiles',
        icon: '📱',
        order_index: 3,
        subcategories: [
            { id: 301, name_th: 'โทรศัพท์มือถือ', name_en: 'Mobile Phones', slug: 'mobile-phones' },
            { id: 302, name_th: 'แท็บเล็ต', name_en: 'Tablets', slug: 'tablets' },
            { id: 303, name_th: 'อุปกรณ์สวมใส่ (Wearables)', name_en: 'Wearables', slug: 'wearables' },
            { id: 304, name_th: 'อุปกรณ์เสริมมือถือ', name_en: 'Accessories', slug: 'mobile-main-access' },
            { id: 305, name_th: 'อะไหล่มือถือ', name_en: 'Parts', slug: 'mobile-parts' },
            { id: 306, name_th: 'ฟิล์ม/เคส', name_en: 'Film/Cases', slug: 'film-cases' },
            { id: 307, name_th: 'แบตสำรอง', name_en: 'Power Banks', slug: 'power-banks' },
        ],
    },
    {
        id: 4,
        name_th: 'คอมพิวเตอร์และไอที',
        name_en: 'Computers & IT',
        slug: 'computers',
        icon: '💻',
        order_index: 4,
        subcategories: [
            { id: 401, name_th: 'โน้ตบุ๊ค', name_en: 'Laptops', slug: 'laptops' },
            { id: 402, name_th: 'คอมพิวเตอร์ตั้งโต๊ะ', name_en: 'Desktop PCs', slug: 'desktops' },
            { id: 403, name_th: 'จอคอมพิวเตอร์', name_en: 'Monitors', slug: 'monitors' },
            { id: 404, name_th: 'อุปกรณ์เสริมคอมพิวเตอร์', name_en: 'Peripherals', slug: 'peripherals' },
            { id: 405, name_th: 'ปริ้นเตอร์และเครื่องตอกบัตร', name_en: 'Printers & Office', slug: 'printers' },
            { id: 406, name_th: 'Components & Parts', name_en: 'Components', slug: 'components' },
            { id: 407, name_th: 'Gaming PC', name_en: 'Gaming PCs', slug: 'gaming-pc' },
            { id: 408, name_th: 'คีย์บอร์ด', name_en: 'Keyboards', slug: 'keyboards' },
            { id: 409, name_th: 'เมาส์', name_en: 'Mouse', slug: 'mouse' },
            { id: 410, name_th: 'ชิ้นส่วน PC (RAM/GPU/PSU/MB)', name_en: 'PC Parts', slug: 'pc-parts' },
        ],
    },
    {
        id: 5,
        name_th: 'เครื่องใช้ไฟฟ้า',
        name_en: 'Home Appliances',
        slug: 'home-appliances',
        icon: '🔌',
        order_index: 5,
        subcategories: [
            { id: 501, name_th: 'แอร์ / เครื่องปรับอากาศ', name_en: 'Air Conditioners', slug: 'air-conditioners' },
            { id: 502, name_th: 'ตู้เย็น / ตู้แช่', name_en: 'Refrigerators', slug: 'refrigerators' },
            { id: 503, name_th: 'เครื่องซักผ้า / อบผ้า', name_en: 'Washing Machines', slug: 'washing-machines' },
            { id: 504, name_th: 'ทีวี และเครื่องเสียง', name_en: 'TV & Audio', slug: 'tv-audio' },
            { id: 505, name_th: 'เครื่องใช้ไฟฟ้าในครัว', name_en: 'Kitchen Appliances', slug: 'kitchen-appliances' },
            { id: 506, name_th: 'เครื่องทำน้ำอุ่น/น้ำร้อน', name_en: 'Water Heaters', slug: 'water-heaters' },
            { id: 507, name_th: 'เครื่องดูดฝุ่น', name_en: 'Vacuum Cleaners', slug: 'vacuum-cleaners' },
            { id: 508, name_th: 'พัดลม', name_en: 'Fans', slug: 'fans' },
            { id: 509, name_th: 'เครื่องฟอกอากาศ', name_en: 'Air Purifiers', slug: 'air-purifiers' },
            { id: 510, name_th: 'เครื่องรีดผ้า', name_en: 'Irons & Steamers', slug: 'irons-steamers' },
            { id: 511, name_th: 'เครื่องทำน้ำดื่ม', name_en: 'Water Dispensers', slug: 'water-dispensers' },
        ],
    },
    {
        id: 6,
        name_th: 'แฟชั่น',
        name_en: 'Fashion',
        slug: 'fashion',
        icon: '👕',
        order_index: 6,
        subcategories: [
            { id: 601, name_th: 'เสื้อผ้าผู้ชาย', name_en: "Men's Clothing", slug: 'mens-clothing' },
            { id: 602, name_th: 'เสื้อผ้าผู้หญิง', name_en: "Women's Clothing", slug: 'womens-clothing' },
            { id: 603, name_th: 'กระเป๋าแบรนด์เนม', name_en: 'Brandname Bags', slug: 'brandname-bags' },
            { id: 604, name_th: 'รองเท้า / Sneakers', name_en: 'Shoes & Sneakers', slug: 'sneakers' },
            { id: 605, name_th: 'นาฬิกาข้อมือ', name_en: 'Watches', slug: 'watches' },
            { id: 606, name_th: 'เครื่องประดับ', name_en: 'Jewelry', slug: 'jewelry' },
            { id: 607, name_th: 'แฟชั่นอุปกรณ์เสริม', name_en: 'Fashion Accessories', slug: 'fashion-accessories' },
            { id: 608, name_th: 'เสื้อผ้าเด็ก', name_en: 'Kids Fashion', slug: 'kids-fashion' },
        ],
    },
    {
        id: 7,
        name_th: 'เกมและแก็ดเจ็ต',
        name_en: 'Gaming & Gadgets',
        slug: 'gaming',
        icon: '🎮',
        order_index: 7,
        is_new: true,
        subcategories: [
            { id: 701, name_th: 'เครื่องเกมคอนโซล', name_en: 'Game Consoles', slug: 'consoles' },
            { id: 702, name_th: 'แผ่นเกม / ตลับเกม', name_en: 'Video Games', slug: 'video-games' },
            { id: 703, name_th: 'เกมมิ่งเกียร์', name_en: 'Gaming Gear', slug: 'gaming-gear' },
            { id: 704, name_th: 'หูฟังเกมมิ่ง', name_en: 'Gaming Headsets', slug: 'gaming-headsets' },
            { id: 705, name_th: 'คีย์บอร์ดเกมมิ่ง', name_en: 'Gaming Keyboards', slug: 'gaming-keyboards' },
            { id: 706, name_th: 'โดรนและอุปกรณ์', name_en: 'Drones', slug: 'drones' },
            { id: 707, name_th: 'VR Headset', name_en: 'VR Headsets', slug: 'vr-headsets' },
        ],
    },
    {
        id: 8,
        name_th: 'กล้องถ่ายรูป',
        name_en: 'Cameras',
        slug: 'cameras',
        icon: '📷',
        order_index: 8,
        subcategories: [
            { id: 801, name_th: 'กล้องดิจิตอล', name_en: 'Digital Cameras', slug: 'digital-cameras' },
            { id: 802, name_th: 'กล้องฟิล์ม', name_en: 'Film Cameras', slug: 'film-cameras' },
            { id: 803, name_th: 'เลนส์', name_en: 'Lenses', slug: 'lenses' },
            { id: 804, name_th: 'อุปกรณ์สตูดิโอ', name_en: 'Studio Equipment', slug: 'studio' },
        ],
    },
    {
        id: 9,
        name_th: 'พระเครื่องและของสะสม',
        name_en: 'Amulets & Collectibles',
        slug: 'amulets-collectibles',
        icon: '🙏',
        order_index: 9,
        subcategories: [
            { id: 901, name_th: 'พระเครื่อง', name_en: 'Thai Amulets', slug: 'thai-amulets' },
            { id: 902, name_th: 'เหรียญกษาปณ์', name_en: 'Coins', slug: 'coins' },
            { id: 903, name_th: 'ธนบัตรเก่า', name_en: 'Banknotes', slug: 'banknotes' },
            { id: 904, name_th: 'ของเก่า/โบราณ', name_en: 'Antiques', slug: 'antiques' },
            { id: 905, name_th: 'Art Toy / กล่องสุ่ม', name_en: 'Art Toys', slug: 'art-toys' },
        ],
    },
    {
        id: 10,
        name_th: 'สัตว์เลี้ยง',
        name_en: 'Pets',
        slug: 'pets',
        icon: '🐶',
        order_index: 10,
        subcategories: [
            { id: 1001, name_th: 'สุนัข', name_en: 'Dogs', slug: 'dogs' },
            { id: 1002, name_th: 'แมว', name_en: 'Cats', slug: 'cats' },
            { id: 1003, name_th: 'สัตว์เลี้ยงอื่นๆ', name_en: 'Other Pets', slug: 'other-pets' },
            { id: 1004, name_th: 'อุปกรณ์สัตว์เลี้ยง', name_en: 'Pet Supplies', slug: 'pet-supplies' },
            { id: 1005, name_th: 'อาหารสัตว์', name_en: 'Pet Food', slug: 'pet-food' },
        ],
    },
    {
        id: 11,
        name_th: 'บริการ',
        name_en: 'Services',
        slug: 'services',
        icon: '🛠️',
        order_index: 11,
        is_new: true,
        subcategories: [
            { id: 1101, name_th: 'บริการช่าง/ซ่อมบำรุง', name_en: 'Technicians', slug: 'technicians' },
            { id: 1102, name_th: 'บริการขนย้าย', name_en: 'Moving Services', slug: 'moving' },
            { id: 1103, name_th: 'แม่บ้าน/ทำความสะอาด', name_en: 'Cleaning', slug: 'cleaning' },
            { id: 1104, name_th: 'รับจ้างทั่วไป', name_en: 'General Services', slug: 'general-services' },
            { id: 1105, name_th: 'ติวเตอร์/สอนพิเศษ', name_en: 'Tutoring', slug: 'tutoring' },
        ],
    },
    {
        id: 12,
        name_th: 'กีฬาและท่องเที่ยว',
        name_en: 'Sports & Travel',
        slug: 'sports',
        icon: '⚽',
        order_index: 12,
        subcategories: [
            { id: 1201, name_th: 'จักรยาน', name_en: 'Bicycles', slug: 'bicycles' },
            { id: 1202, name_th: 'เครื่องออกกำลังกาย', name_en: 'Fitness', slug: 'fitness' },
            { id: 1203, name_th: 'อุปกรณ์แคมป์ปิ้ง', name_en: 'Camping', slug: 'camping' },
            { id: 1204, name_th: 'อุปกรณ์กีฬา', name_en: 'Sports Gear', slug: 'sports-gear' },
            { id: 1205, name_th: 'บัตรท่องเที่ยว/ที่พัก', name_en: 'Travel Vouchers', slug: 'travel-vouchers' },
            { id: 1206, name_th: 'สเก็ต/โรลเลอร์', name_en: 'Skate/Roller', slug: 'skate-roller' },
        ],
    },
    {
        id: 13,
        name_th: 'บ้านและสวน',
        name_en: 'Home & Garden',
        slug: 'home-garden',
        icon: '🌳',
        order_index: 13,
        subcategories: [
            { id: 1301, name_th: 'เฟอร์นิเจอร์', name_en: 'Furniture', slug: 'furniture' },
            { id: 1302, name_th: 'ของตกแต่งบ้าน', name_en: 'Home Decor', slug: 'home-decor' },
            { id: 1303, name_th: 'ต้นไม้/ทำสวน', name_en: 'Gardening', slug: 'gardening' },
            { id: 1304, name_th: 'เครื่องมือช่าง', name_en: 'Tools', slug: 'tools' },
            { id: 1305, name_th: 'อุปกรณ์สวน', name_en: 'Garden Equipment', slug: 'garden-equipment' },
        ],
    },
    {
        id: 14,
        name_th: 'เครื่องสำอางและความงาม',
        name_en: 'Beauty & Cosmetics',
        slug: 'beauty-cosmetics',
        icon: '💄',
        order_index: 14,
        is_hot: true,
        subcategories: [
            { id: 1401, name_th: 'เครื่องสำอาง', name_en: 'Makeup', slug: 'makeup' },
            { id: 1402, name_th: 'ผลิตภัณฑ์ดูแลผิว', name_en: 'Skincare', slug: 'skincare' },
            { id: 1403, name_th: 'ผลิตภัณฑ์ดูแลผม', name_en: 'Haircare', slug: 'haircare' },
            { id: 1404, name_th: 'น้ำหอม', name_en: 'Perfumes', slug: 'perfumes' },
            { id: 1405, name_th: 'ผลิตภัณฑ์บำรุงร่างกาย', name_en: 'Body Care', slug: 'body-care' },
            { id: 1406, name_th: 'อุปกรณ์ความงาม', name_en: 'Beauty Tools', slug: 'beauty-tools' },
        ],
    },
    {
        id: 15,
        name_th: 'เด็กและทารก',
        name_en: 'Baby & Kids',
        slug: 'baby-kids',
        icon: '👶',
        order_index: 15,
        is_hot: true,
        subcategories: [
            { id: 1501, name_th: 'เสื้อผ้าเด็ก', name_en: 'Kids Clothing', slug: 'kids-clothing' },
            { id: 1502, name_th: 'รองเท้าเด็ก', name_en: 'Kids Shoes', slug: 'kids-shoes' },
            { id: 1503, name_th: 'ของเล่นเด็ก', name_en: 'Toys', slug: 'toys' },
            { id: 1504, name_th: 'อุปกรณ์เด็กอ่อน', name_en: 'Baby Gear', slug: 'baby-gear' },
            { id: 1505, name_th: 'ผลิตภัณฑ์ดูแลเด็ก', name_en: 'Baby Care', slug: 'baby-care' },
            { id: 1506, name_th: 'เฟอร์นิเจอร์เด็ก', name_en: 'Kids Furniture', slug: 'kids-furniture' },
        ],
    },
    {
        id: 16,
        name_th: 'หนังสือและการศึกษา',
        name_en: 'Books & Education',
        slug: 'books-education',
        icon: '📚',
        order_index: 16,
        subcategories: [
            { id: 1601, name_th: 'หนังสือทั่วไป', name_en: 'General Books', slug: 'general-books' },
            { id: 1602, name_th: 'หนังสือการ์ตูน/มังงะ', name_en: 'Comics & Manga', slug: 'comics-manga' },
            { id: 1603, name_th: 'นิตยสาร', name_en: 'Magazines', slug: 'magazines' },
            { id: 1604, name_th: 'หนังสือเรียน/อ้างอิง', name_en: 'Textbooks', slug: 'textbooks' },
            { id: 1605, name_th: 'คอร์สออนไลน์', name_en: 'Online Courses', slug: 'online-courses' },
            { id: 1606, name_th: 'เครื่องเขียน/อุปกรณ์การเรียน', name_en: 'Stationery', slug: 'stationery' },
        ],
    },
    {
        id: 99,
        name_th: 'เบ็ดเตล็ด',
        name_en: 'Others',
        slug: 'others',
        icon: '📦',
        order_index: 99,
        subcategories: [
            { id: 9901, name_th: 'ของใช้ทั่วไป', name_en: 'General Items', slug: 'general-items' },
            { id: 9902, name_th: 'สินค้าแฮนด์เมด', name_en: 'Handmade', slug: 'handmade' },
            { id: 9903, name_th: 'DIY', name_en: 'DIY', slug: 'diy' },
            { id: 9904, name_th: 'ของรีไซเคิล', name_en: 'Recycled Items', slug: 'recycled' },
            { id: 9905, name_th: 'เครื่องมือสำนักงาน', name_en: 'Office Supplies', slug: 'office-supplies' },
        ],
    },
]

export const PRODUCT_CONDITIONS = [
    { value: 'new', label: 'ใหม่แกะกล่อง', label_en: 'Brand New' },
    { value: 'like_new', label: 'มือสองเหมือนใหม่', label_en: 'Like New' },
    { value: 'good', label: 'มือสองสภาพดี', label_en: 'Good Condition' },
    { value: 'fair', label: 'มือสองสภาพใช้งาน', label_en: 'Fair Condition' },
    { value: 'poor', label: 'ซาก/อะไหล่', label_en: 'For Parts' },
] as const

export const VERIFICATION_LEVELS = [
    { level: 'unverified', label: 'ยังไม่ยืนยัน', icon: '⚪', color: 'gray' },
    { level: 'bronze', label: 'ยืนยันตัวตนแล้ว', icon: '🥉', color: 'amber' },
    { level: 'silver', label: 'ผู้ขายแนะนำ', icon: '🥈', color: 'gray' },
    { level: 'gold', label: 'ร้านค้าทางการ', icon: '🥇', color: 'yellow' },
] as const

export const SHIPPING_METHODS = [
    { id: 'standard', name: 'ขนส่งเอกชน (Kerry/Flash/J&T)', icon: '🚚', estimatedDays: '1-3' },
    { id: 'thaipost_ems', name: 'EMS ไปรษณีย์ไทย', icon: '📮', estimatedDays: '1-3' },
    { id: 'thaipost_reg', name: 'ลงทะเบียน', icon: '📦', estimatedDays: '3-7' },
    { id: 'same_day', name: 'ส่งด่วนในวันเดียว (Lalamove/Grab)', icon: '⚡', estimatedDays: '0-1' },
    { id: 'pickup', name: 'นัดรับสินค้าเอง', icon: '🤝', estimatedDays: '0' },
] as const

export const PAYMENT_METHODS = [
    { id: 'promptpay', name: 'PromptPay', icon: '📱' },
    { id: 'credit_card', name: 'บัตรเครดิต/เดบิต', icon: '💳' },
    { id: 'transfer', name: 'โอนเงินธนาคาร', icon: '🏦' },
    { id: 'cod', name: 'เก็บเงินปลายทาง', icon: '💵' },
] as const

// Helper to find category by slug
export function getCategoryBySlug(slug: string): Category | undefined {
    return CATEGORIES.find(c => c.slug === slug)
}

export function getSubcategoryBySlug(categorySlug: string, subSlug: string): Subcategory | undefined {
    const category = getCategoryBySlug(categorySlug)
    return category?.subcategories?.find(s => s.slug === subSlug)
}
