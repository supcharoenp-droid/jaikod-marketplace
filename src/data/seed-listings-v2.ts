import { Listing } from '@/types/api'

export const SEED_LISTINGS_V2: Listing[] = [
    // 1. CARS (Automotive)
    {
        id: 'car_001',
        title: 'Toyota Vios 1.5 E (2015) สภาพนางฟ้า ไมล์น้อย',
        price: 285000,
        price_old: 320000,
        thumbnail: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=500&q=80',
        images: [
            'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800',
            'https://images.unsplash.com/photo-1599955728518-e37456d9b4ac?w=800'
        ],
        province: 'Bangkok',
        district: 'Chatuchak',
        lat: 13.8282,
        lng: 100.5591,
        badges: ['GOOD_PRICE', 'VERIFIED'],
        status: 'active',
        seller: { id: 's_car_1', name: 'Win Auto Car', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Win', rating: 4.8, trust_score: 95, is_official: true },
        views: 1250, likes: 45,
        ai: { price_score: 92, condition_score: 90, image_quality: 95, tags: ['Toyota', 'Vios', 'Sedan'] },
        created_at: new Date(Date.now() - 2 * 86400000).toISOString()
    },
    {
        id: 'car_002',
        title: 'Honda Jazz GK (2018) รถบ้านมือเดียว แต่งสวยพร้อมซิ่ง',
        price: 399000,
        thumbnail: 'https://images.unsplash.com/photo-1609520505218-7421da3b3f9d?w=500&q=80',
        images: ['https://images.unsplash.com/photo-1609520505218-7421da3b3f9d?w=800'],
        province: 'Nonthaburi',
        district: 'Pak Kret',
        lat: 13.9070,
        lng: 100.5229,
        badges: ['HOT', 'NEARBY'],
        status: 'active',
        seller: { id: 's_car_2', name: 'Ploy Garage', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ploy', rating: 4.5, trust_score: 88, is_official: false },
        views: 3400, likes: 120,
        ai: { price_score: 85, condition_score: 88, image_quality: 90, tags: ['Honda', 'Jazz', 'Hatchback'] },
        created_at: new Date(Date.now() - 5 * 3600000).toISOString()
    },
    {
        id: 'car_003',
        title: 'Mercedes-Benz C200 (2012) สีดำ เครื่องแน่น',
        price: 650000,
        price_old: 680000,
        thumbnail: 'https://images.unsplash.com/photo-1616788494672-ec7ca25f750d?w=500&q=80',
        images: ['https://images.unsplash.com/photo-1616788494672-ec7ca25f750d?w=800'],
        province: 'Chiang Mai',
        district: 'Mueang',
        lat: 18.7883,
        lng: 98.9853,
        badges: [],
        status: 'active',
        seller: { id: 's_user_10', name: 'Benz Lover CNX', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Benz', rating: 4.2, trust_score: 80, is_official: false },
        views: 890, likes: 30,
        ai: { price_score: 75, condition_score: 82, image_quality: 85, tags: ['Benz', 'Luxury'] },
        created_at: new Date(Date.now() - 10 * 86400000).toISOString()
    },

    // 2. MOTORCYCLES
    {
        id: 'moto_001',
        title: 'Yamaha NMAX 155 (2022) สีเทา วิ่งน้อย 3,xxx โล',
        price: 72000,
        thumbnail: 'https://images.unsplash.com/photo-1596422345095-2ac0f7ba0b86?w=500&q=80', // Replace with moto similar
        images: ['https://images.unsplash.com/photo-1596422345095-2ac0f7ba0b86?w=800'],
        province: 'Bangkok',
        district: 'Bang Kapi',
        lat: 13.7656,
        lng: 100.6476,
        badges: ['GOOD_PRICE'],
        status: 'active',
        seller: { id: 's_moto_1', name: 'Bike Center', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bike', rating: 4.9, trust_score: 93, is_official: true },
        views: 560, likes: 12,
        ai: { price_score: 95, condition_score: 98, image_quality: 88, tags: ['Yamaha', 'Scooter'] },
        created_at: new Date(Date.now() - 1 * 86400000).toISOString()
    },
    {
        id: 'moto_002',
        title: 'Honda Scoopy i (2020) สีชมพูน่ารัก ผู้หญิงขับ',
        price: 35000,
        thumbnail: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=500&q=80',
        images: ['https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=800'],
        province: 'Pathum Thani',
        district: 'Khlong Luang',
        lat: 14.0647,
        lng: 100.6277,
        badges: [],
        status: 'active',
        seller: { id: 's_user_55', name: 'Nong May', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=May', rating: 5.0, trust_score: 85, is_official: false },
        views: 200, likes: 8,
        ai: { price_score: 80, condition_score: 92, image_quality: 75, tags: ['Honda', 'Scooter'] },
        created_at: new Date(Date.now() - 3 * 86400000).toISOString()
    },

    // 3. MOBILES
    {
        id: 'mob_001',
        title: 'iPhone 13 Pro Max 256GB Sierra Blue ศูนย์ไทย ครบกล่อง',
        price: 24900,
        price_old: 28000,
        thumbnail: 'https://images.unsplash.com/photo-1632661674596-df8be070a5c5?w=500&q=80',
        images: ['https://images.unsplash.com/photo-1632661674596-df8be070a5c5?w=800'],
        province: 'Bangkok',
        district: 'Pathum Wan',
        lat: 13.7433,
        lng: 100.5405,
        badges: ['VERIFIED', 'HOT'],
        status: 'active',
        seller: { id: 's_mob_1', name: 'iStore MBK', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=iStore', rating: 4.7, trust_score: 98, is_official: true },
        views: 4500, likes: 320,
        ai: { price_score: 88, condition_score: 95, image_quality: 92, tags: ['Apple', 'iPhone'] },
        created_at: new Date(Date.now() - 1700000).toISOString()
    },
    {
        id: 'mob_002',
        title: 'Samsung Galaxy S23 Ultra 512GB สภาพ 95%',
        price: 31500,
        thumbnail: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500&q=80',
        images: ['https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800'],
        province: 'Khon Kaen',
        district: 'Mueang',
        lat: 16.4322,
        lng: 102.8236,
        badges: ['GOOD_PRICE'],
        status: 'active',
        seller: { id: 's_user_88', name: 'Somchai Mobile', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Somchai', rating: 4.4, trust_score: 82, is_official: false },
        views: 890, likes: 45,
        ai: { price_score: 91, condition_score: 85, image_quality: 80, tags: ['Samsung', 'Android'] },
        created_at: new Date(Date.now() - 4 * 3600000).toISOString()
    },

    // 4. COMPUTERS
    {
        id: 'com_001',
        title: 'Gaming PC i5-12400F / RTX 3060 / Ram 32GB พร้อมจอ 144Hz',
        price: 25900,
        thumbnail: 'https://images.unsplash.com/photo-1587202372775-52294fb880aa?w=500&q=80',
        images: ['https://images.unsplash.com/photo-1587202372775-52294fb880aa?w=800'],
        province: 'Bangkok',
        district: 'Lat Phrao',
        lat: 13.8036,
        lng: 100.6050,
        badges: ['URGENT'],
        status: 'active',
        seller: { id: 's_user_22', name: 'Gamer Zone', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Gamer', rating: 4.6, trust_score: 89, is_official: false },
        views: 1100, likes: 67,
        ai: { price_score: 93, condition_score: 90, image_quality: 85, tags: ['PC', 'Gaming'] },
        created_at: new Date(Date.now() - 8 * 3600000).toISOString()
    },
    {
        id: 'com_002',
        title: 'MacBook Air M1 Ram 8 SSD 256 สภาพนางฟ้า',
        price: 21500,
        thumbnail: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca4?w=500&q=80',
        images: ['https://images.unsplash.com/photo-1517336714731-489689fd1ca4?w=800'],
        province: 'Phuket',
        district: 'Mueang',
        lat: 7.8804,
        lng: 98.3923,
        badges: [],
        status: 'active',
        seller: { id: 's_user_phuket', name: 'Design Studio', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Design', rating: 4.9, trust_score: 96, is_official: false },
        views: 750, likes: 55,
        ai: { price_score: 87, condition_score: 96, image_quality: 91, tags: ['Apple', 'MacBook'] },
        created_at: new Date(Date.now() - 2 * 86400000).toISOString()
    },

    // 5. FURNITURE
    {
        id: 'fur_001',
        title: 'โซฟา IKEA 3 ที่นั่ง รุ่น LANDSKRONA สีเทาเข้ม',
        price: 8500,
        price_old: 15990,
        thumbnail: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500&q=80',
        images: ['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800'],
        province: 'Samut Prakan',
        district: 'Bang Phli',
        lat: 13.6353,
        lng: 100.7058,
        badges: ['GOOD_PRICE'],
        status: 'active',
        seller: { id: 's_home_1', name: 'Home Second Hand', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Home', rating: 4.3, trust_score: 86, is_official: false },
        views: 400, likes: 23,
        ai: { price_score: 96, condition_score: 88, image_quality: 82, tags: ['Sofa', 'IKEA', 'Furniture'] },
        created_at: new Date(Date.now() - 6 * 86400000).toISOString()
    },

    // 6. REAL ESTATE
    {
        id: 'prop_001',
        title: 'ปล่อยเช่า คอนโด The Line Jatujak 1 Bed 35sqm ชั้น 25',
        price: 18000,
        thumbnail: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=500&q=80',
        images: ['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800'],
        province: 'Bangkok',
        district: 'Chatuchak',
        lat: 13.8140,
        lng: 100.5600,
        badges: ['VERIFIED'],
        status: 'active',
        seller: { id: 's_agent_1', name: 'BKK Agent', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Agent', rating: 4.8, trust_score: 92, is_official: true },
        views: 1500, likes: 80,
        ai: { price_score: 84, condition_score: 98, image_quality: 94, tags: ['Condo', 'Rent'] },
        created_at: new Date(Date.now() - 500000).toISOString()
    },

    // 7. FASHION
    {
        id: 'fash_001',
        title: 'รองเท้า Nike Dunk Low Panda Size 9US แท้ 100%',
        price: 3500,
        thumbnail: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=500&q=80',
        images: ['https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800'],
        province: 'Bangkok',
        district: 'Siam',
        lat: 13.7462,
        lng: 100.5347,
        badges: ['HOT'],
        status: 'active',
        seller: { id: 's_sneaker_1', name: 'Sneaker King', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sneaker', rating: 4.6, trust_score: 91, is_official: false },
        views: 2200, likes: 150,
        ai: { price_score: 89, condition_score: 94, image_quality: 88, tags: ['Nike', 'Shoes'] },
        created_at: new Date(Date.now() - 45 * 60000).toISOString()
    },
    {
        id: 'fash_002',
        title: 'เสื้อวง Vintage Iron Maiden ปี 90s สภาพเดือด',
        price: 4500,
        thumbnail: 'https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?w=500&q=80',
        images: ['https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?w=800'],
        province: 'Chiang Mai',
        district: 'Nimman',
        lat: 18.7967,
        lng: 98.9694,
        badges: [],
        status: 'active',
        seller: { id: 's_vtg_1', name: 'Old School CM', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Old', rating: 4.8, trust_score: 94, is_official: false },
        views: 600, likes: 90,
        ai: { price_score: 82, condition_score: 80, image_quality: 85, tags: ['Vintage', 'Shirt'] },
        created_at: new Date(Date.now() - 4 * 86400000).toISOString()
    },

    // 8. GADGETS
    {
        id: 'gad_001',
        title: 'Sony WH-1000XM5 หูฟัง Noise Cancelling สีดำ',
        price: 8900,
        price_old: 10900,
        thumbnail: 'https://images.unsplash.com/photo-1613040809024-b4ef7ba99bc3?w=500&q=80',
        images: ['https://images.unsplash.com/photo-1613040809024-b4ef7ba99bc3?w=800'],
        province: 'Bangkok',
        district: 'Din Daeng',
        lat: 13.7694,
        lng: 100.5540,
        badges: ['GOOD_PRICE'],
        status: 'active',
        seller: { id: 's_gadget_1', name: 'Digital Lovers', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Digital', rating: 4.7, trust_score: 93, is_official: false },
        views: 890, likes: 44,
        ai: { price_score: 94, condition_score: 95, image_quality: 90, tags: ['Sony', 'Headphones'] },
        created_at: new Date(Date.now() - 1 * 86400000).toISOString()
    },

    // 9. COLLECTIBLES
    {
        id: 'col_001',
        title: 'ฟิกเกอร์ Luffy Gear 5 งานจับฉลาก Ichiban Kuji ล่าสุด',
        price: 2800,
        thumbnail: 'https://images.unsplash.com/photo-1608889175123-8ee362201f81?w=500&q=80',
        images: ['https://images.unsplash.com/photo-1608889175123-8ee362201f81?w=800'],
        province: 'Nonthaburi',
        district: 'Bang Yai',
        lat: 13.8757,
        lng: 100.4124,
        badges: ['NEW'],
        status: 'active',
        seller: { id: 's_toy_1', name: 'Toy Hunter', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Toy', rating: 4.9, trust_score: 97, is_official: false },
        views: 1500, likes: 120,
        ai: { price_score: 90, condition_score: 100, image_quality: 90, tags: ['Figure', 'OnePiece'] },
        created_at: new Date(Date.now() - 3600000).toISOString()
    },

    // 10. GENERAL
    {
        id: 'gen_001',
        title: 'สว่านไร้สาย Makita 18V ครบชุดพร้อมแบต 2 ก้อน',
        price: 3200,
        thumbnail: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=500&q=80',
        images: ['https://images.unsplash.com/photo-1504148455328-c376907d081c?w=800'],
        province: 'Chon Buri',
        district: 'Si Racha',
        lat: 13.1147,
        lng: 100.9298,
        badges: [],
        status: 'active',
        seller: { id: 's_tool_1', name: 'Chang Man', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Chang', rating: 4.5, trust_score: 85, is_official: false },
        views: 350, likes: 15,
        ai: { price_score: 85, condition_score: 90, image_quality: 80, tags: ['Tools', 'Makita'] },
        created_at: new Date(Date.now() - 5 * 86400000).toISOString()
    }
]

// Duplicate to reach ~30 items for testing infinite scroll
const EXTRA_ITEMS: Listing[] = Array.from({ length: 20 }).map((_, i) => ({
    ...SEED_LISTINGS_V2[i % SEED_LISTINGS_V2.length],
    id: `copy_${i}_${Date.now()}`,
    title: `${SEED_LISTINGS_V2[i % SEED_LISTINGS_V2.length].title} (Item ${i + 1})`,
    price: Math.floor(SEED_LISTINGS_V2[i % SEED_LISTINGS_V2.length].price * (0.9 + Math.random() * 0.2)) // Randomize price slightly
}))

export const FULL_SEED_DATA = [...SEED_LISTINGS_V2, ...EXTRA_ITEMS]
