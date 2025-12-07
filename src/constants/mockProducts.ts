import { Product, User } from '@/types'
import { CATEGORIES } from './categories'

const MOCK_SELLER: User = {
    id: '1',
    role: 'seller',
    email: 'hello@jaikod.com',
    displayName: 'JaiKod Official',
    photoURL: null,
    phoneNumber: null,
    is_verified: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
} as unknown as User

const createMockProduct = (
    id: number | string,
    categorySlug: string,
    title: string,
    price: number,
    imageIndex: number,
    province: string = 'กรุงเทพมหานคร'
): Product => {
    const category = CATEGORIES.find(c => c.slug === categorySlug)
    if (!category) throw new Error(`Category ${categorySlug} not found`)

    // Use Picsum with seed for deterministic random images
    const getPlaceholderImage = (slug: string, index: number) => {
        return `https://picsum.photos/seed/${slug}-${index}/800/800`
    }

    // Simulate metrics
    const views = Math.floor(Math.random() * 5000) + 50
    const sold = Math.floor(Math.random() * 200)
    const isTrendingResult = views > 3000
    const isBestSellerResult = sold > 50

    return {
        id: id.toString(),
        seller_id: MOCK_SELLER.id,
        seller: undefined, // Type mismatch User vs SellerProfile. Keeping undefined to avoid complexity or need to cast
        seller_name: MOCK_SELLER.displayName,
        title,
        description: `This is a detailed description for ${title}. It is in great condition and ready for a new owner.`,
        category_id: category.id.toString(),
        category: category,
        price,
        original_price: Math.random() > 0.6 ? Math.round(price * (1.1 + Math.random() * 0.4)) : undefined,
        price_type: 'fixed',
        condition: 'good',
        stock: 1,
        tags: [],
        ai_tags: ['recommended', 'good_condition'],
        images: [{
            url: getPlaceholderImage(categorySlug, imageIndex),
            order: 0,
            is_primary: true
        }],
        thumbnail_url: getPlaceholderImage(categorySlug, imageIndex),
        location_province: province,
        can_ship: true,
        can_pickup: true,
        status: 'active',
        views_count: views,
        sold_count: sold,
        is_trending: isTrendingResult,
        is_best_seller: isBestSellerResult,
        favorites_count: Math.floor(Math.random() * 100),
        slug: `${categorySlug}-${id}`,
        created_at: new Date(Date.now() - Math.random() * 1000000000).toISOString(),
        updated_at: new Date().toISOString()
    }
}

export const MOCK_PRODUCTS: Product[] = [
    // 1. Mobiles
    createMockProduct(101, 'mobiles', 'iPhone 15 Pro Max 256GB', 41900, 1),
    createMockProduct(102, 'mobiles', 'Samsung Galaxy S24 Ultra', 38500, 2, 'เชียงใหม่'),
    createMockProduct(103, 'mobiles', 'iPad Air 5 WiFi', 16900, 3, 'นนทบุรี'),
    createMockProduct(104, 'mobiles', 'Xiaomi 13T Pro', 13500, 4, 'ขอนแก่น'),
    createMockProduct(105, 'mobiles', 'Galaxy Tab S9', 22000, 5),

    // 2. Cameras
    createMockProduct(201, 'cameras', 'Sony A7IV Body', 65900, 1),
    createMockProduct(202, 'cameras', 'Fujifilm X-T5 Kit', 58500, 2, 'เชียงราย'),
    createMockProduct(203, 'cameras', 'Canon EOS R6', 49900, 3, 'ปทุมธานี'),
    createMockProduct(204, 'cameras', 'DJI Mini 4 Pro', 32000, 4, 'ชลบุรี'),
    createMockProduct(205, 'cameras', 'GoPro Hero 12', 11500, 5, 'ภูเก็ต'),

    // 3. Home Living (was Home Decor)
    createMockProduct(301, 'home-living', 'Sofa Bed IKEA', 4500, 1),
    createMockProduct(302, 'home-living', 'lamp Minimal', 890, 2, 'นนทบุรี'),
    createMockProduct(303, 'home-living', 'Monstera Albo', 3500, 3, 'นครราชสีมา'),
    createMockProduct(304, 'home-living', 'Wooden Desk', 2200, 4, 'ปทุมธานี'),
    createMockProduct(305, 'home-living', 'Ceramic Vase', 450, 5, 'เชียงใหม่'),

    // 4. Fashion
    createMockProduct(401, 'fashion', 'Nike Dunk Low Panda', 3200, 1),
    createMockProduct(402, 'fashion', 'Gentlewoman Tote', 390, 2, 'สมุทรปราการ'),
    createMockProduct(403, 'fashion', 'Vintage Metallica Tee', 1500, 3),
    createMockProduct(404, 'fashion', 'G-Shock GA-2100', 2800, 4, 'ชลบุรี'),
    createMockProduct(405, 'fashion', 'Zara Dress White', 750, 5, 'เชียงใหม่'),

    // 5. Computers
    createMockProduct(501, 'computers', 'MacBook Air M1', 21500, 1),
    createMockProduct(502, 'computers', 'RTX 3070 Ti', 12500, 2, 'นนทบุรี'),
    createMockProduct(503, 'computers', 'Dell U2422H Monitor', 5900, 3, 'ปทุมธานี'),
    createMockProduct(504, 'computers', 'Keychron K2', 2200, 4),
    createMockProduct(505, 'computers', 'Ram DDR4 16GB', 1200, 5, 'สมุทรปราการ'),

    // 6. Collectibles
    createMockProduct(601, 'collectibles', 'Molly Space 400%', 8500, 1),
    createMockProduct(602, 'collectibles', 'Luang Phor Koon Coin', 15000, 2, 'นครราชสีมา'),
    createMockProduct(603, 'collectibles', 'Rare Banknotes 999', 2500, 3),
    createMockProduct(604, 'collectibles', 'Thai Stamps Set', 4500, 4, 'เชียงใหม่'),
    createMockProduct(605, 'collectibles', 'Bearbrick 1000%', 18900, 5),

    // 7. Sports
    createMockProduct(701, 'sports', 'Yonex Astrox 88D', 4200, 1),
    createMockProduct(702, 'sports', 'Java Decaf Road Bike', 8500, 2, 'นนทบุรี'),
    createMockProduct(703, 'sports', 'Coleman Tent', 5500, 3, 'เชียงราย'),
    createMockProduct(704, 'sports', 'Dumbbell 24kg', 2500, 4),
    createMockProduct(705, 'sports', 'Hoka Clifton 9', 3500, 5, 'อุดรธานี'),

    // 8. Home Appliances (was Electronics)
    createMockProduct(801, 'home-appliances', 'Samsung Fridge', 4500, 1),
    createMockProduct(802, 'home-appliances', 'LG Washing Machine', 5900, 2, 'สมุทรปราการ'),
    createMockProduct(803, 'home-appliances', 'Xiaomi Air Fryer', 790, 3, 'ปทุมธานี'),
    createMockProduct(804, 'home-appliances', 'TCL TV 55"', 6500, 4, 'ชลบุรี'),
    createMockProduct(805, 'home-appliances', 'Hatari Air Cooler', 1200, 5),

    // 9. Books
    createMockProduct(901, 'books', 'Sapiens', 350, 1),
    createMockProduct(902, 'books', 'One Piece Set', 3500, 2, 'นนทบุรี'),
    createMockProduct(903, 'books', 'Vogue Magazine', 250, 3),
    createMockProduct(904, 'books', 'English Grammar', 200, 4, 'ขอนแก่น'),
    createMockProduct(905, 'books', 'Harry Potter Boxset', 2500, 5, 'เชียงใหม่'),

    // 10. Toys & Hobbies
    createMockProduct(1001, 'toys-hobbies', 'Nintendo Switch OLED', 8900, 1),
    createMockProduct(1002, 'toys-hobbies', 'PS5 God of War', 1200, 2, 'สมุทรปราการ'),
    createMockProduct(1003, 'toys-hobbies', 'Lego Ferrari', 12000, 3, 'นนทบุรี'),
    createMockProduct(1004, 'toys-hobbies', 'Catan Thai', 950, 4),
    createMockProduct(1005, 'toys-hobbies', 'Care Bears', 550, 5, 'ชลบุรี'),

    // 11. Others
    createMockProduct(1101, 'others', 'Yamaha F310 Guitar', 2900, 1),
    createMockProduct(1102, 'others', 'Central Voucher', 4500, 2, 'สมุทรปราการ'),
    createMockProduct(1103, 'others', 'Cat Food 10kg', 1800, 3, 'ปทุมธานี'),
    createMockProduct(1104, 'others', 'Fish Tank 24"', 800, 4),
    createMockProduct(1105, 'others', 'Bosch Drill', 2500, 5, 'นนทบุรี'),
]
