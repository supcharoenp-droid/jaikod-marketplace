import { Product } from '@/types'

// Mock Data Types
export interface StoreProfile {
    id: string
    name: string
    slug: string
    logoUrl: string
    bannerUrl: string
    tagline: string
    rating: number
    trustScore: number
    ownerId?: string
    isOfficial: boolean
    isVerified: boolean
    followersCount: number
    followingCount: number
    totalSales: number
    responseRate: number
    avgDispatchTime: string // e.g. "1.2 วัน"
    joinedDate: string
    description: string
    location: {
        province: string
        district: string
    }
    socialLinks?: {
        facebook?: string
        instagram?: string
        line?: string
        website?: string
    }
    operatingHours?: string
    isClosed?: boolean
    nextOpenTime?: string
}

export interface Promotion {
    id: string
    title: string
    code: string
    discountType: 'percent' | 'amount'
    discountValue: number
    minSpend: number
    expiryDate: string
    remaining?: number
}

// Mock Service
export const storeService = {
    getStoreProfile: async (slug: string): Promise<StoreProfile> => {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500))

        if (slug === 'jaikod-official') {
            return {
                id: 's1',
                name: 'Seller Pro Shop',
                slug: 'jaikod-official',
                logoUrl: 'https://ui-avatars.com/api/?name=Seller+Pro&background=8B5CF6&color=fff',
                bannerUrl: 'https://images.unsplash.com/photo-1556742049-0cfed4f7a07d?w=1600&fit=crop',
                tagline: 'ร้านค้าคุณภาพที่คุณวางใจได้',
                rating: 4.9,
                trustScore: 98,
                ownerId: 'user_123', // Mock owner
                isOfficial: true,
                isVerified: true,
                followersCount: 9500,
                followingCount: 10,
                totalSales: 3200,
                responseRate: 99,
                avgDispatchTime: 'ภายใน 2 ชม.',
                joinedDate: '2023-01-01',
                description: 'Seller Pro Shop ยินดีให้บริการ',
                location: { province: 'กรุงเทพมหานคร', district: 'ปทุมวัน' }
            }
        }

        const nearbyStores: StoreProfile[] = [
            {
                id: 's_local_1',
                name: 'Lung Somchai Shop',
                slug: 'lung-somchai',
                logoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&fit=crop',
                bannerUrl: 'https://images.unsplash.com/photo-1534723452862-4c874018d66d?w=1600&fit=crop',
                tagline: 'ของวินเทจ ของเก่าเก็บ',
                rating: 4.5,
                trustScore: 88,
                isOfficial: false,
                isVerified: true,
                followersCount: 150,
                followingCount: 5,
                totalSales: 45,
                responseRate: 90,
                avgDispatchTime: '2 วัน',
                joinedDate: '2023-05-10',
                description: 'ขายของสะสมส่วนตัวครับ นัดรับได้แถวบางกะปิ',
                location: {
                    province: 'กรุงเทพมหานคร',
                    district: 'บางกะปิ'
                },
                operatingHours: 'ทุกวัน',
                isClosed: false
            },
            {
                id: 's_local_2',
                name: 'Jibjib Bakery & Cafe',
                slug: 'jibjib-bakery',
                logoUrl: 'https://images.unsplash.com/photo-1556910103-1c02745a30bf?w=200&fit=crop',
                bannerUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1600&fit=crop',
                tagline: 'ขนมโฮมเมด อบใหม่ทุกวัน',
                rating: 4.9,
                trustScore: 95,
                isOfficial: false,
                isVerified: true,
                followersCount: 3000,
                followingCount: 200,
                totalSales: 1200,
                responseRate: 99,
                avgDispatchTime: '1 วัน',
                joinedDate: '2023-02-20',
                description: 'รับทำเค้กวันเกิด คุกกี้ บราวนี่ จัดส่งทั่วประเทศ',
                location: {
                    province: 'กรุงเทพมหานคร',
                    district: 'ลาดพร้าว'
                },
                socialLinks: {
                    instagram: 'jibjib_bake'
                },
                operatingHours: '09:00 - 18:00 (ปิดวันจันทร์)',
                isClosed: false
            }
        ]

        const found = nearbyStores.find(s => s.slug === slug)
        if (found) return found

        return {
            id: 's_12345',
            name: 'iStudio Official',
            slug: slug,
            logoUrl: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?q=80&w=200&auto=format&fit=crop',
            bannerUrl: 'https://images.unsplash.com/photo-1556742049-0cfed4f7a07d?q=80&w=1600&auto=format&fit=crop',
            tagline: 'ตัวแทนจำหน่ายสินค้า Apple อย่างเป็นทางการ',
            rating: 4.8,
            trustScore: 92,
            isOfficial: true,
            isVerified: true,
            followersCount: 12500,
            followingCount: 12,
            totalSales: 4500,
            responseRate: 98,
            avgDispatchTime: 'ภายใน 24 ชม.',
            joinedDate: '2023-01-15',
            description: 'มั่นใจได้ในคุณภาพและการรับประกันศูนย์ไทย 100% สินค้าทุกชิ้นมีใบรับประกัน ออกใบกำกับภาษีได้',
            location: {
                province: 'กรุงเทพมหานคร',
                district: 'ปทุมวัน'
            },
            socialLinks: {
                website: 'https://www.istudio.store',
                facebook: 'iStudioTH'
            },
            operatingHours: 'จันทร์ - ศุกร์ 10:00 - 20:00',
            isClosed: false
        }
    },

    getStorePromotions: async (storeId: string): Promise<Promotion[]> => {
        await new Promise(resolve => setTimeout(resolve, 300))
        return [
            { id: 'p1', title: 'ลด 500.- เมื่อช้อปครบ 10,000', code: 'NEW500', discountType: 'amount', discountValue: 500, minSpend: 10000, expiryDate: '2024-12-31', remaining: 50 },
            { id: 'p2', title: 'ลด 10% Accessories', code: 'ACC10', discountType: 'percent', discountValue: 10, minSpend: 500, expiryDate: '2024-12-31' }
        ]
    },

    getStoreProducts: async (storeId: string, filter: 'all' | 'featured' = 'all'): Promise<Product[]> => {
        await new Promise(resolve => setTimeout(resolve, 600))

        let products: any[] = []

        if (storeId === 'lung-somchai') {
            products = [
                { id: 'l1', title: 'กล้องฟิล์ม Nikon FM2 สภาพสะสม', price: 12500, thumbnail_url: 'https://images.unsplash.com/photo-1517260739337-6799d2ff9ee3?w=500&fit=crop', category_id: 3, location_province: 'กรุงเทพมหานคร', views_count: 500, favorites_count: 45, seller: { shop_name: 'Lung Somchai' } },
                { id: 'l2', title: 'นาฬิกา Seiko Vintage 1980s', price: 4500, thumbnail_url: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=500&fit=crop', category_id: 8, location_province: 'กรุงเทพมหานคร', views_count: 300, favorites_count: 20, seller: { shop_name: 'Lung Somchai' } },
            ]
        } else if (storeId === 'jibjib-bakery') {
            products = [
                { id: 'j1', title: 'เค้กช็อกโกแลตหน้านิ่ม 1 ปอนด์', price: 450, thumbnail_url: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500&fit=crop', category_id: 11, location_province: 'กรุงเทพมหานคร', views_count: 800, favorites_count: 120, seller: { shop_name: 'Jibjib Bakery' } },
                { id: 'j2', title: 'คุกกี้เนยสดแท้ กล่องใหญ่', price: 250, thumbnail_url: 'https://images.unsplash.com/photo-1499636138143-bd649043ea52?w=500&fit=crop', category_id: 11, location_province: 'กรุงเทพมหานคร', views_count: 600, favorites_count: 90, seller: { shop_name: 'Jibjib Bakery' } },
            ]
        } else {
            // Return mock products compatible with ProductCard
            products = [
                { id: '1', title: 'iPhone 15 Pro Max 256GB Natural Titanium', price: 48900, original_price: 52900, thumbnail_url: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&q=80&w=500', created_at: new Date().toISOString(), category_id: 1, location_province: 'กรุงเทพมหานคร', views_count: 1200, favorites_count: 54, ai_image_score: 95, seller: { is_verified_seller: true, shop_name: 'iStudio' } },
                { id: '2', title: 'iPad Air 5 WiFi 64GB Blue', price: 23900, original_price: 25900, thumbnail_url: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&q=80&w=500', created_at: new Date(Date.now() - 86400000).toISOString(), category_id: 2, location_province: 'กรุงเทพมหานคร', views_count: 850, favorites_count: 32, ai_image_score: 88, seller: { is_verified_seller: true, shop_name: 'iStudio' } },
                { id: '3', title: 'MacBook Air M2 13" Midnight', price: 39900, thumbnail_url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca4?auto=format&fit=crop&q=80&w=500', created_at: new Date(Date.now() - 100000000).toISOString(), category_id: 3, location_province: 'กรุงเทพมหานคร', views_count: 2100, favorites_count: 120, ai_image_score: 92, seller: { is_verified_seller: true, shop_name: 'iStudio' } },
                { id: '4', title: 'AirPods Pro 2 USB-C', price: 8990, thumbnail_url: 'https://images.unsplash.com/photo-1628210889224-53b2e368d78b?auto=format&fit=crop&q=80&w=500', created_at: new Date().toISOString(), category_id: 4, location_province: 'กรุงเทพมหานคร', views_count: 3400, favorites_count: 250, ai_image_score: 85, seller: { is_verified_seller: true, shop_name: 'iStudio' } },
                { id: '5', title: 'Apple Pencil 2', price: 4590, thumbnail_url: 'https://images.unsplash.com/photo-1558562788-b78824137c63?auto=format&fit=crop&q=80&w=500', created_at: new Date().toISOString(), category_id: 4, location_province: 'กรุงเทพมหานคร', views_count: 560, favorites_count: 45, ai_image_score: 80, seller: { is_verified_seller: true, shop_name: 'iStudio' } }
            ]
        }

        if (filter === 'featured') {
            return products.slice(0, 3)
        }

        // Return 3x products with UNIQUE IDs to prevent key errors
        const p1 = products.map(p => ({ ...p, id: `${p.id}_a` }))
        const p2 = products.map(p => ({ ...p, id: `${p.id}_b` }))
        const p3 = products.map(p => ({ ...p, id: `${p.id}_c` }))

        return [...p1, ...p2, ...p3]
    },

    followStore: async (storeId: string): Promise<boolean> => {
        await new Promise(resolve => setTimeout(resolve, 300))
        return true
    },

    getNearbyStores: async (lat: number, lng: number): Promise<StoreProfile[]> => {
        await new Promise(resolve => setTimeout(resolve, 800))
        return [
            {
                id: 's_local_1',
                name: 'Lung  Somchai Shop',
                slug: 'lung-somchai',
                logoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&fit=crop',
                bannerUrl: 'https://images.unsplash.com/photo-1534723452862-4c874018d66d?w=1600&fit=crop',
                tagline: 'ของวินเทจ ของเก่าเก็บ',
                rating: 4.5,
                trustScore: 88,
                isOfficial: false,
                isVerified: true,
                followersCount: 150,
                followingCount: 5,
                totalSales: 45,
                responseRate: 90,
                avgDispatchTime: '2 วัน',
                joinedDate: '2023-05-10',
                description: 'ขายของสะสมส่วนตัวครับ นัดรับได้แถวบางกะปิ',
                location: {
                    province: 'กรุงเทพมหานคร',
                    district: 'บางกะปิ'
                },
                operatingHours: 'ทุกวัน',
                isClosed: false
            },
            {
                id: 's_local_2',
                name: 'Jibjib Bakery & Cafe',
                slug: 'jibjib-bakery',
                logoUrl: 'https://images.unsplash.com/photo-1556910103-1c02745a30bf?w=200&fit=crop',
                bannerUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1600&fit=crop',
                tagline: 'ขนมโฮมเมด อบใหม่ทุกวัน',
                rating: 4.9,
                trustScore: 95,
                isOfficial: false,
                isVerified: true,
                followersCount: 3000,
                followingCount: 200,
                totalSales: 1200,
                responseRate: 99,
                avgDispatchTime: '1 วัน',
                joinedDate: '2023-02-20',
                description: 'รับทำเค้กวันเกิด คุกกี้ บราวนี่ จัดส่งทั่วประเทศ',
                location: {
                    province: 'กรุงเทพมหานคร',
                    district: 'ลาดพร้าว'
                },
                socialLinks: {
                    instagram: 'jibjib_bake'
                },
                operatingHours: '09:00 - 18:00 (ปิดวันจันทร์)',
                isClosed: false
            }
        ]
    }
}
