'use client'

import ProductCard from '@/components/product/ProductCard'
import { Product } from '@/types'
import { ProductCardSkeleton } from '@/components/ui/Skeleton'

// Mock data - TODO: Replace with API call
const mockProducts: Product[] = [
    {
        id: '1',
        seller_id: '1',
        title: 'iPhone 15 Pro Max 256GB สีไทเทเนียมธรรมชาติ',
        description: 'สภาพสวยมาก ใช้งานเพียง 2 เดือน มีกล่อง อุปกรณ์ครบ',
        category_id: '1',
        price: 42900,
        original_price: 48900,
        price_type: 'fixed',
        condition: 'like_new',
        ai_tags: ['iPhone', 'Apple', 'มือถือ'],
        ai_image_score: 95,
        images: [],
        thumbnail_url: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=500',
        can_ship: true,
        can_pickup: true,
        tags: [],
        stock: 1,
        status: 'active',
        views_count: 1234,
        sold_count: 10,
        favorites_count: 45,
        slug: 'iphone-15-pro-max-256gb',
        created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date().toISOString(),
        location_province: 'กรุงเทพมหานคร',
        seller: {
            id: '1',
            user_id: '1',
            shop_name: 'ร้านมือถือมือสอง',
            shop_slug: 'mobile-shop',
            shop_description: 'ขายมือถือมือสองสภาพดี',
            main_categories: ['mobile'],
            rating_score: 4.9,
            rating_count: 150,
            trust_score: 95,
            follower_count: 120,
            response_rate: 98,
            is_verified_seller: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        },
    },
    {
        id: '2',
        seller_id: '2',
        title: 'Sony A7 IV Body กล้อง Mirrorless Full Frame',
        description: 'สภาพใหม่มาก ชัตเตอร์ 5,000 ครั้ง ประกันเหลือ 10 เดือน',
        category_id: '2',
        price: 75000,
        price_type: 'fixed',
        condition: 'like_new',
        ai_tags: ['Sony', 'กล้อง', 'Mirrorless'],
        ai_image_score: 92,
        images: [],
        thumbnail_url: 'https://images.unsplash.com/photo-1606980707498-ab2c6d0c2fd6?w=500',
        can_ship: true,
        can_pickup: false,
        tags: [],
        stock: 1,
        status: 'active',
        views_count: 856,
        sold_count: 2,
        favorites_count: 32,
        slug: 'sony-a7-iv-body',
        created_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date().toISOString(),
        location_province: 'เชียงใหม่',
        seller: {
            id: '2',
            user_id: '2',
            shop_name: 'Camera Lover',
            shop_slug: 'camera-lover',
            shop_description: 'คนรักกล้อง',
            main_categories: ['camera'],
            rating_score: 4.8,
            rating_count: 80,
            trust_score: 88,
            follower_count: 50,
            response_rate: 95,
            is_verified_seller: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        },
    },
    {
        id: '3',
        seller_id: '3',
        title: 'Nike Air Jordan 1 Retro High OG Chicago Size 42',
        description: 'ของแท้ 100% มีใบเสร็จ สภาพ 9/10',
        category_id: '4',
        price: 8500,
        price_type: 'fixed',
        condition: 'good',
        ai_tags: ['Nike', 'Jordan', 'รองเท้า'],
        ai_image_score: 88,
        images: [],
        thumbnail_url: 'https://images.unsplash.com/photo-1556906781-9a412961c28c?w=500',
        can_ship: true,
        can_pickup: true,
        tags: [],
        stock: 1,
        status: 'active',
        views_count: 2341,
        sold_count: 15,
        favorites_count: 89,
        slug: 'nike-air-jordan-1-chicago',
        created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date().toISOString(),
        location_province: 'กรุงเทพมหานคร',
        seller: {
            id: '3',
            user_id: '3',
            shop_name: 'Sneaker Head',
            shop_slug: 'sneaker-head',
            shop_description: 'รองเท้าแรร์ไอเทม',
            main_categories: ['fashion'],
            rating_score: 4.95,
            rating_count: 320,
            trust_score: 98,
            follower_count: 200,
            response_rate: 99,
            is_verified_seller: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        },
    },
    {
        id: '4',
        seller_id: '4',
        title: 'MacBook Pro 14" M3 Pro 18GB 512GB Space Black',
        description: 'ใหม่ เพิ่งซื้อมา 1 สัปดาห์ ยังไม่ได้แกะซีล',
        category_id: '5',
        price: 68900,
        original_price: 74900,
        price_type: 'fixed',
        condition: 'new',
        ai_tags: ['MacBook', 'Apple', 'Laptop'],
        ai_image_score: 98,
        images: [],
        thumbnail_url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500',
        can_ship: true,
        can_pickup: true,
        tags: [],
        stock: 1,
        status: 'active',
        views_count: 3456,
        sold_count: 0,
        favorites_count: 156,
        slug: 'macbook-pro-14-m3-pro',
        created_at: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date().toISOString(),
        location_province: 'ชลบุรี',
        seller: {
            id: '4',
            user_id: '4',
            shop_name: 'Tech Store',
            shop_slug: 'tech-store',
            shop_description: 'อุปกรณ์ไอทีครบวงจร',
            main_categories: ['electronics'],
            rating_score: 4.92,
            rating_count: 280,
            trust_score: 96,
            follower_count: 150,
            response_rate: 97,
            is_verified_seller: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        },
    },
]

export default function FeaturedProducts() {
    const isLoading = false // TODO: Replace with actual loading state

    return (
        <section className="py-16 bg-gray-50 dark:bg-surface-dark/30">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-2xl md:text-3xl font-display font-semibold mb-2">
                            สินค้าแนะนำ
                        </h2>
                        <p className="text-text-secondary dark:text-gray-400">
                            สินค้าคุณภาพดีที่ AI คัดสรรมาให้คุณ
                        </p>
                    </div>
                    <a
                        href="/products"
                        className="text-neon-purple hover:text-purple-600 font-medium transition-colors"
                    >
                        ดูทั้งหมด →
                    </a>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                    {isLoading
                        ? Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)
                        : mockProducts.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                </div>
            </div>
        </section>
    )
}
