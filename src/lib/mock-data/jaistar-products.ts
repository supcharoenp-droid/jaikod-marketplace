/**
 * JAISTAR DEMO PRODUCTS
 * Mock data สำหรับทดสอบ promotion system
 */

export interface DemoProduct {
    id: string
    seller_id: string
    title: string
    price: number
    description: string
    images: string[]
    category_type: string
    status: 'active' | 'sold' | 'inactive'
    views: number
    favorites: number
    location: {
        province: string
        amphoe?: string
    }
    created_at: Date
}

export const JAISTAR_DEMO_PRODUCTS: DemoProduct[] = [
    {
        id: 'jaistar-iphone15-pro-max',
        seller_id: 'jaistar',
        title: 'iPhone 15 Pro Max 256GB Natural Titanium 🌟',
        price: 39900,
        description: 'สภาพใหม่ ยังไม่แกะกล่อง รับประกันศูนย์ไทย 1 ปีเต็ม | รับประกันของแท้ 100% | จัดส่งฟรีทั่วประเทศ',
        images: [
            'https://placehold.co/800x800/3b82f6/white?text=iPhone+15+Pro+Max',
            'https://placehold.co/800x800/6366f1/white?text=Natural+Titanium'
        ],
        category_type: 'mobile',
        status: 'active',
        views: 1250,
        favorites: 89,
        location: {
            province: 'กรุงเทพมหานคร',
            amphoe: 'วัฒนา'
        },
        created_at: new Date('2026-01-01')
    },
    {
        id: 'jaistar-macbook-pro-m3',
        seller_id: 'jaistar',
        title: 'MacBook Pro 16" M3 Max 36GB RAM 1TB SSD ⭐',
        price: 129900,
        description: 'ของใหม่ แกะกล่อง รับประกันศูนย์ไทย | สเปคสูงสุด เหมาะกับ Pro User | จัดส่งฟรี พร้อมของแถม',
        images: [
            'https://placehold.co/800x800/6366f1/white?text=MacBook+Pro+16',
            'https://placehold.co/800x800/8b5cf6/white?text=M3+Max+Chip'
        ],
        category_type: 'electronics',
        status: 'active',
        views: 892,
        favorites: 56,
        location: {
            province: 'กรุงเทพมหานคร',
            amphoe: 'วัฒนา'
        },
        created_at: new Date('2026-01-01')
    },
    {
        id: 'jaistar-airpods-pro-2',
        seller_id: 'jaistar',
        title: 'AirPods Pro (2nd Gen) USB-C 🎧',
        price: 8900,
        description: 'ใหม่ล่าสุด พร้อม Active Noise Cancellation | รับประกันศูนย์ 1 ปี | ส่งฟรี Kerry Express',
        images: [
            'https://placehold.co/800x800/10b981/white?text=AirPods+Pro+2',
            'https://placehold.co/800x800/14b8a6/white?text=USB-C'
        ],
        category_type: 'electronics',
        status: 'active',
        views: 2156,
        favorites: 124,
        location: {
            province: 'กรุงเทพมหานคร',
            amphoe: 'วัฒนา'
        },
        created_at: new Date('2026-01-02')
    },
    {
        id: 'jaistar-ipad-air-m2',
        seller_id: 'jaistar',
        title: 'iPad Air M2 11" WiFi 128GB สีม่วง 💜',
        price: 22900,
        description: 'ของใหม่ในกล่อง รับประกันศูนย์ไทย | พร้อม Apple Pencil รุ่นที่ 2 | ฟรี Magic Keyboard',
        images: [
            'https://placehold.co/800x800/a855f7/white?text=iPad+Air+M2',
            'https://placehold.co/800x800/c084fc/white?text=Purple'
        ],
        category_type: 'electronics',
        status: 'active',
        views: 678,
        favorites: 43,
        location: {
            province: 'กรุงเทพมหานคร',
            amphoe: 'วัฒนา'
        },
        created_at: new Date('2026-01-02')
    },
    {
        id: 'jaistar-apple-watch-ultra-2',
        seller_id: 'jaistar',
        title: 'Apple Watch Ultra 2 49mm Titanium ⌚',
        price: 31900,
        description: 'ของใหม่ยังไม่แกะ รับประกันศูนย์ไทย 1 ปี | พร้อม Ocean Band | ส่งฟรีทั่วไทย',
        images: [
            'https://placehold.co/800x800/f97316/white?text=Watch+Ultra+2',
            'https://placehold.co/800x800/fb923c/white?text=Titanium'
        ],
        category_type: 'electronics',
        status: 'active',
        views: 445,
        favorites: 31,
        location: {
            province: 'กรุงเทพมหานคร',
            amphoe: 'วัฒนา'
        },
        created_at: new Date('2026-01-02')
    }
]

// Helper function to get products by seller
export function getProductsBySeller(sellerId: string): DemoProduct[] {
    return JAISTAR_DEMO_PRODUCTS.filter(p => p.seller_id === sellerId && p.status === 'active')
}

// Helper function to get featured products
export function getFeaturedProducts(limit: number = 3): DemoProduct[] {
    return JAISTAR_DEMO_PRODUCTS
        .filter(p => p.status === 'active')
        .sort((a, b) => b.views - a.views)
        .slice(0, limit)
}

// Stats calculator
export function calculateSellerStats(sellerId: string) {
    const products = getProductsBySeller(sellerId)

    return {
        total_products: products.length,
        total_views: products.reduce((sum, p) => sum + p.views, 0),
        total_favorites: products.reduce((sum, p) => sum + p.favorites, 0),
        avg_price: products.reduce((sum, p) => sum + p.price, 0) / products.length
    }
}
