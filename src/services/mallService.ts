import { SellerProfile, Product, Promotion } from '@/types'
import { getTrustedSellersNearMe } from './sellerScoring'
import { getBestSellingProducts } from '@/lib/products'

// Mock Data for Official Stores
const OFFICIAL_STORES: any[] = [
    {
        id: 'mall1',
        user_id: 'u_mall1',
        shop_name: 'Samsung Official',
        shop_slug: 'samsung-official',
        shop_description: 'Official Samsung Store for certified pre-owned devices',
        shop_logo: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=150&h=150&fit=crop',
        cover_image: 'https://images.unsplash.com/photo-1550906265-5f7823e87aa1?w=800&h=300&fit=crop',
        is_verified_seller: true,
        verification_status: 'verified',
        shop_type: 'official_store',
        rating_score: 4.8,
        rating_count: 5200,
        follower_count: 12000,
        badges: ['official_store', 'top_seller'],
        main_categories: ['1'] // Mobile
    },
    {
        id: 'mall2',
        user_id: 'u_mall2',
        shop_name: 'Sony Camera Hub',
        shop_slug: 'sony-hub',
        shop_description: 'Premium second-hand Sony cameras and lenses.',
        shop_logo: 'https://images.unsplash.com/photo-1588534510807-8686e0642ceb?w=150&h=150&fit=crop',
        cover_image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&h=300&fit=crop',
        is_verified_seller: true,
        verification_status: 'verified',
        shop_type: 'official_store',
        rating_score: 4.9,
        rating_count: 850,
        follower_count: 3400,
        badges: ['official_store', 'highly_rated'],
        main_categories: ['2'] // Camera
    },
    {
        id: 'mall3',
        user_id: 'u_mall3',
        shop_name: 'iStudio Secondhand',
        shop_slug: 'istudio-2nd',
        shop_description: 'Certified Apple Products. Checked by experts.',
        shop_logo: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=150&h=150&fit=crop',
        cover_image: 'https://images.unsplash.com/photo-1556656793-0275bada8d64?w=800&h=300&fit=crop',
        is_verified_seller: true,
        verification_status: 'verified',
        shop_type: 'official_store',
        rating_score: 4.7,
        rating_count: 15400,
        follower_count: 45000,
        badges: ['official_store', 'top_seller'],
        main_categories: ['1', '3'] // Mobile, IT
    },
    {
        id: 'mall4',
        user_id: 'u_mall4',
        shop_name: 'Nike Vintage',
        shop_slug: 'nike-vintage',
        shop_description: 'Rare and authentic vintage Nike gears.',
        shop_logo: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=150&h=150&fit=crop',
        cover_image: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?w=800&h=300&fit=crop',
        is_verified_seller: true,
        verification_status: 'verified',
        shop_type: 'official_store',
        rating_score: 4.6,
        rating_count: 2100,
        follower_count: 8900,
        badges: ['official_store'],
        main_categories: ['4'] // Fashion
    }
]

export const MALL_CATEGORIES = [
    { id: '1', name: 'Electronics', icon: 'Smartphone', slug: 'mobile-tablet', image: 'https://images.unsplash.com/photo-1550009158-9ebf6917f92e?w=100&h=100&fit=crop' },
    { id: '4', name: 'Fashion Brand', icon: 'Shirt', slug: 'fashion', image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=100&h=100&fit=crop' },
    { id: '2', name: 'Cameras', icon: 'Camera', slug: 'cameras', image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=100&h=100&fit=crop' },
    { id: '5', name: 'Home & Living', icon: 'Home', slug: 'home-decoration', image: 'https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=100&h=100&fit=crop' },
    { id: '8', name: 'Beauty', icon: 'Sparkles', slug: 'beauty', image: 'https://images.unsplash.com/photo-1596462502278-27bfdd403348?w=100&h=100&fit=crop' },
]

export async function getFeaturedOfficialStores(): Promise<Partial<SellerProfile>[]> {
    // In real app: await db.collection('sellers').where('shop_type', '==', 'official_store').limit(10).get()
    return OFFICIAL_STORES as unknown as SellerProfile[]
}

export async function getMallPromotions(): Promise<Promotion[]> {
    // Mock Coupons
    return [
        {
            id: 'p1',
            seller_id: 'mall1',
            type: 'shop_coupon',
            name: 'Samsung 500 OFF',
            code: 'MALL500',
            discount_type: 'fixed',
            discount_value: 500,
            min_spend: 5000,
            start_date: new Date().toISOString(),
            end_date: new Date().toISOString(),
            is_active: true,
            usage_count: 10
        },
        {
            id: 'p2',
            seller_id: 'mall3',
            type: 'discount_code',
            name: 'Apple 10% OFF',
            code: 'APPLE10',
            discount_type: 'percent',
            discount_value: 10,
            min_spend: 2000,
            start_date: new Date().toISOString(),
            end_date: new Date().toISOString(),
            is_active: true,
            usage_count: 45
        }
    ]
}

export async function getMallFlashSales(): Promise<Product[]> {
    const products = await getBestSellingProducts(6)
    return products.map(p => ({
        ...p,
        price: Math.floor(p.price * 0.8), // 20% off mock
        original_price: p.price
    }))
}
