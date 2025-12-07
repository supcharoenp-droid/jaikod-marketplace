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
}

export const CATEGORIES: Category[] = [
    {
        id: 1,
        name_th: 'มือถือและแท็บเล็ต',
        name_en: 'Mobiles & Tablets',
        slug: 'mobiles',
        icon: '📱',
        order_index: 1,
        subcategories: [
            { id: 101, name_th: 'โทรศัพท์มือถือ', name_en: 'Mobile Phones', slug: 'mobile-phones' },
            { id: 102, name_th: 'แท็บเล็ต', name_en: 'Tablets', slug: 'tablets' },
            { id: 103, name_th: 'อุปกรณ์เสริม', name_en: 'Accessories', slug: 'mobile-accessories' },
            { id: 104, name_th: 'ซิมการ์ด', name_en: 'SIM Cards', slug: 'sim-cards' },
            { id: 105, name_th: 'อื่นๆ', name_en: 'Others', slug: 'mobile-others' },
        ],
    },
    {
        id: 2,
        name_th: 'คอมพิวเตอร์และแล็ปท็อป',
        name_en: 'Computers & Laptops',
        slug: 'computers',
        icon: '💻',
        order_index: 2,
        subcategories: [
            { id: 201, name_th: 'โน้ตบุ๊ค', name_en: 'Laptops', slug: 'laptops' },
            { id: 202, name_th: 'คอมพิวเตอร์ตั้งโต๊ะ', name_en: 'Desktop PCs', slug: 'desktops' },
            { id: 203, name_th: 'จอคอมพิวเตอร์', name_en: 'Monitors', slug: 'monitors' },
            { id: 204, name_th: 'อุปกรณ์เสริม', name_en: 'Accessories', slug: 'computer-accessories' },
            { id: 205, name_th: 'ชิ้นส่วนคอมพิวเตอร์', name_en: 'Components', slug: 'components' },
            { id: 206, name_th: 'อื่นๆ', name_en: 'Others', slug: 'computer-others' },
        ],
    },
    {
        id: 3,
        name_th: 'กล้องและอุปกรณ์ถ่ายภาพ',
        name_en: 'Cameras',
        slug: 'cameras',
        icon: '📷',
        order_index: 3,
        subcategories: [
            { id: 301, name_th: 'กล้อง DSLR', name_en: 'DSLR Cameras', slug: 'dslr' },
            { id: 302, name_th: 'กล้อง Mirrorless', name_en: 'Mirrorless', slug: 'mirrorless' },
            { id: 303, name_th: 'กล้อง Compact', name_en: 'Compact Cameras', slug: 'compact' },
            { id: 304, name_th: 'เลนส์', name_en: 'Lenses', slug: 'lenses' },
            { id: 305, name_th: 'อุปกรณ์เสริม', name_en: 'Accessories', slug: 'camera-accessories' },
            { id: 306, name_th: 'อื่นๆ', name_en: 'Others', slug: 'camera-others' },
        ],
    },
    {
        id: 4,
        name_th: 'แฟชั่นและเครื่องแต่งกาย',
        name_en: 'Fashion & Accessories',
        slug: 'fashion',
        icon: '👕',
        order_index: 4,
        subcategories: [
            { id: 401, name_th: 'เสื้อผ้าผู้ชาย', name_en: "Men's Clothing", slug: 'mens-clothing' },
            { id: 402, name_th: 'เสื้อผ้าผู้หญิง', name_en: "Women's Clothing", slug: 'womens-clothing' },
            { id: 403, name_th: 'รองเท้า', name_en: 'Shoes', slug: 'shoes' },
            { id: 404, name_th: 'กระเป๋า', name_en: 'Bags', slug: 'bags' },
            { id: 405, name_th: 'เครื่องประดับ', name_en: 'Accessories', slug: 'fashion-accessories' },
            { id: 406, name_th: 'อื่นๆ', name_en: 'Others', slug: 'fashion-others' },
        ],
    },
    {
        id: 5,
        name_th: 'นาฬิกาและเครื่องประดับ',
        name_en: 'Watches & Jewelry',
        slug: 'watches-jewelry',
        icon: '⌚',
        order_index: 5,
    },
    {
        id: 6,
        name_th: 'สุขภาพและความงาม',
        name_en: 'Health & Beauty',
        slug: 'health-beauty',
        icon: '💄',
        order_index: 6,
    },
    {
        id: 7,
        name_th: 'แม่และเด็ก',
        name_en: 'Mom & Baby',
        slug: 'mom-baby',
        icon: '🍼',
        order_index: 7,
    },
    {
        id: 8,
        name_th: 'ของตกแต่งบ้านและสวน',
        name_en: 'Home & Living',
        slug: 'home-living',
        icon: '🏠',
        order_index: 8,
    },
    {
        id: 9,
        name_th: 'เครื่องใช้ไฟฟ้าภายในบ้าน',
        name_en: 'Home Appliances',
        slug: 'home-appliances',
        icon: '🔌',
        order_index: 9,
    },
    {
        id: 10,
        name_th: 'ของเล่น เกม และงานอดิเรก',
        name_en: 'Toys, Games & Hobbies',
        slug: 'toys-hobbies',
        icon: '🎮',
        order_index: 10,
    },
    {
        id: 11,
        name_th: 'กีฬาและกิจกรรมกลางแจ้ง',
        name_en: 'Sports & Outdoors',
        slug: 'sports',
        icon: '⚽',
        order_index: 11,
    },
    {
        id: 12,
        name_th: 'ยานยนต์และอะไหล่',
        name_en: 'Automotive',
        slug: 'automotive',
        icon: '🚗',
        order_index: 12,
    },
    {
        id: 13,
        name_th: 'สัตว์เลี้ยง',
        name_en: 'Pet Supplies',
        slug: 'pets',
        icon: '🐱',
        order_index: 13,
        subcategories: [
            { id: 1301, name_th: 'สุนัข', name_en: 'Dogs', slug: 'dogs' },
            { id: 1302, name_th: 'แมว', name_en: 'Cats', slug: 'cats' },
            { id: 1303, name_th: 'นก', name_en: 'Birds', slug: 'birds' },
            { id: 1304, name_th: 'ปลา', name_en: 'Fish', slug: 'fish' },
            { id: 1305, name_th: 'อาหารและอุปกรณ์', name_en: 'Food & Supplies', slug: 'pet-supplies' },
            { id: 1306, name_th: 'อื่นๆ', name_en: 'Others', slug: 'pet-others' },
        ],
    },
    {
        id: 14,
        name_th: 'ของสะสมและงานศิลปะ',
        name_en: 'Collectibles & Art',
        slug: 'collectibles',
        icon: '🎨',
        order_index: 14,
    },
    {
        id: 15,
        name_th: 'พระเครื่องและวัตถุมงคล',
        name_en: 'Amulets',
        slug: 'amulets',
        icon: '🙏',
        order_index: 15,
    },
    {
        id: 16,
        name_th: 'หนังสือและความรู้',
        name_en: 'Books & Stationery',
        slug: 'books',
        icon: '📚',
        order_index: 16,
    },
    {
        id: 17,
        name_th: 'ดนตรีและเครื่องดนตรี',
        name_en: 'Music & Instruments',
        slug: 'music',
        icon: '🎸',
        order_index: 17,
    },
    {
        id: 18,
        name_th: 'ตั๋วและบัตรกำนัล',
        name_en: 'Tickets & Vouchers',
        slug: 'tickets',
        icon: '🎫',
        order_index: 18,
    },
    {
        id: 19,
        name_th: 'อสังหาริมทรัพย์',
        name_en: 'Real Estate',
        slug: 'real-estate',
        icon: '🏢',
        order_index: 19,
    },
    {
        id: 20,
        name_th: 'อื่นๆ',
        name_en: 'Others',
        slug: 'others',
        icon: '📦',
        order_index: 20,
    },
]

export const PRODUCT_CONDITIONS = [
    { value: 'new', label: 'ใหม่', label_en: 'New' },
    { value: 'like_new', label: 'เหมือนใหม่', label_en: 'Like New' },
    { value: 'good', label: 'ดี', label_en: 'Good' },
    { value: 'fair', label: 'พอใช้', label_en: 'Fair' },
    { value: 'poor', label: 'ต้องซ่อม', label_en: 'Poor' },
] as const

export const VERIFICATION_LEVELS = [
    { level: 'unverified', label: 'ยังไม่ยืนยัน', icon: '⚪', color: 'gray' },
    { level: 'bronze', label: 'ยืนยันเบอร์โทร', icon: '🥉', color: 'amber' },
    { level: 'silver', label: 'ยืนยันบัตรประชาชน', icon: '🥈', color: 'gray' },
    { level: 'gold', label: 'ยืนยันบัญชีธนาคาร', icon: '🥇', color: 'yellow' },
    { level: 'diamond', label: 'ผู้ขายมืออาชีพ', icon: '💎', color: 'blue' },
] as const

export const THAI_PROVINCES = [
    'กรุงเทพมหานคร',
    'เชียงใหม่',
    'เชียงราย',
    'นครราชสีมา',
    'ขอนแก่น',
    'อุดรธานี',
    'สุราษฎร์ธานี',
    'ภูเก็ต',
    'สงขลา',
    'ชลบุรี',
    'ระยอง',
    'นนทบุรี',
    'ปทุมธานี',
    'สมุทรปราการ',
    // ... (เพิ่มจังหวัดอื่นๆ ตามต้องการ)
] as const

export const SHIPPING_METHODS = [
    { id: 'kerry', name: 'Kerry Express', icon: '📦', estimatedDays: '1-2' },
    { id: 'flash', name: 'Flash Express', icon: '⚡', estimatedDays: '2-3' },
    { id: 'thailand_post', name: 'ไปรษณีย์ไทย', icon: '📮', estimatedDays: '3-5' },
    { id: 'pickup', name: 'นัดรับเอง', icon: '🤝', estimatedDays: '0' },
] as const

export const PAYMENT_METHODS = [
    { id: 'credit_card', name: 'บัตรเครดิต/เดบิต', icon: '💳' },
    { id: 'mobile_banking', name: 'Mobile Banking', icon: '🏦' },
    { id: 'truemoney', name: 'TrueMoney Wallet', icon: '💰' },
    { id: 'promptpay', name: 'PromptPay', icon: '📱' },
] as const
