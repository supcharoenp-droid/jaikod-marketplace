/**
 * API Route: Seed Test Data
 * POST /api/admin/seed-data
 * 
 * Creates sample seller profile and products for testing
 */

import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/firebase'
import { collection, addDoc, setDoc, doc, Timestamp } from 'firebase/firestore'

const TEST_USER_ID = 'test-user-123'

const SAMPLE_PRODUCTS = [
    {
        title: 'iPhone 15 Pro Max 256GB Natural Titanium',
        description: 'iPhone 15 Pro Max สีใหม่ Natural Titanium ความจุ 256GB สภาพใหม่ ยังไม่แกะกล่อง รับประกันศูนย์ไทย 1 ปี',
        price: 45900,
        category_id: 1,
        condition: 'new',
        thumbnail_url: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400&h=400&fit=crop',
        image_urls: ['https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&h=800&fit=crop'],
        status: 'active',
        location: { province: 'กรุงเทพมหานคร', district: 'บางรัก', subdistrict: 'สีลม', postal_code: '10500' },
        tags: ['iPhone', 'Apple', 'มือถือ', 'ใหม่'],
        view_count: 0,
        favorite_count: 0
    },
    {
        title: 'MacBook Pro 14" M3 Pro 18GB/512GB',
        description: 'MacBook Pro 14 นิ้ว ชิป M3 Pro RAM 18GB SSD 512GB สี Space Black สภาพเหมือนใหม่ ใช้งานเพียง 2 เดือน',
        price: 69900,
        category_id: 2,
        condition: 'like_new',
        thumbnail_url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=400&fit=crop',
        image_urls: ['https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&h=800&fit=crop'],
        status: 'active',
        location: { province: 'กรุงเทพมหานคร', district: 'ปทุมวัน', subdistrict: 'ปทุมวัน', postal_code: '10330' },
        tags: ['MacBook', 'Apple', 'Laptop', 'M3'],
        view_count: 0,
        favorite_count: 0
    },
    {
        title: 'Sony A7 IV Body + Lens 28-70mm',
        description: 'กล้อง Sony A7 IV Body พร้อมเลนส์ Kit 28-70mm สภาพดีมาก ชัตเตอร์ไม่ถึง 5,000 ครั้ง',
        price: 89900,
        category_id: 3,
        condition: 'good',
        thumbnail_url: 'https://images.unsplash.com/photo-1606980707986-a2c1a5b8c5f3?w=400&h=400&fit=crop',
        image_urls: ['https://images.unsplash.com/photo-1606980707986-a2c1a5b8c5f3?w=800&h=800&fit=crop'],
        status: 'active',
        location: { province: 'เชียงใหม่', district: 'เมืองเชียงใหม่', subdistrict: 'ช้างเผือก', postal_code: '50300' },
        tags: ['Sony', 'กล้อง', 'Mirrorless'],
        view_count: 0,
        favorite_count: 0
    },
    {
        title: 'Nike Air Jordan 1 Chicago Size US 9',
        description: 'รองเท้า Nike Air Jordan 1 Retro High OG สี Chicago ไซส์ US 9 สภาพ 9/10 มีกล่องครบ',
        price: 12900,
        category_id: 4,
        condition: 'like_new',
        thumbnail_url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop',
        image_urls: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&h=800&fit=crop'],
        status: 'active',
        location: { province: 'กรุงเทพมหานคร', district: 'วัฒนา', subdistrict: 'คลองเตย', postal_code: '10110' },
        tags: ['Nike', 'Jordan', 'Sneakers'],
        view_count: 0,
        favorite_count: 0
    },
    {
        title: 'PlayStation 5 Slim Digital + 2 Controllers',
        description: 'PS5 Slim Digital Edition พร้อมจอย 2 ตัว สภาพสวยมาก ใช้งาน 3 เดือน ยังมีประกัน 9 เดือน',
        price: 16900,
        category_id: 10,
        condition: 'like_new',
        thumbnail_url: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400&h=400&fit=crop',
        image_urls: ['https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=800&h=800&fit=crop'],
        status: 'active',
        location: { province: 'กรุงเทพมหานคร', district: 'บางกะปิ', subdistrict: 'คลองจั่น', postal_code: '10240' },
        tags: ['PS5', 'PlayStation', 'Gaming'],
        view_count: 0,
        favorite_count: 0
    }
]

const SELLER_PROFILE = {
    shop_name: 'JaiKod Shop',
    shop_slug: 'jaikod-shop',
    shop_description: 'ร้านขายของมือสองคุณภาพดี ราคาเป็นกันเอง',
    avatar_url: 'https://api.dicebear.com/7.x/initials/svg?seed=JaiKod',
    cover_url: 'https://images.unsplash.com/photo-1557821552-17105176677c?w=1200&h=400&fit=crop',
    rating: 4.8,
    total_reviews: 0,
    total_sales: 0,
    response_rate: 95,
    response_time: '< 1 hour',
    joined_date: Timestamp.now(),
    verified: true,
    address: {
        province: 'กรุงเทพมหานคร',
        district: 'บางรัก',
        subdistrict: 'สีลม',
        postal_code: '10500'
    }
}

export async function POST(request: NextRequest) {
    try {
        console.log('🌱 Starting to seed test data...')

        // 1. Create Seller Profile
        await setDoc(doc(db, 'sellers', TEST_USER_ID), SELLER_PROFILE)
        console.log('✅ Seller profile created')

        // 2. Create Products
        const createdProducts = []
        for (const productData of SAMPLE_PRODUCTS) {
            const product = {
                ...productData,
                seller_id: TEST_USER_ID,
                seller_name: SELLER_PROFILE.shop_name,
                seller_avatar: SELLER_PROFILE.avatar_url,
                created_at: Timestamp.now(),
                updated_at: Timestamp.now()
            }

            const docRef = await addDoc(collection(db, 'products'), product)
            createdProducts.push({ id: docRef.id, ...product })
            console.log(`✓ Created: ${product.title}`)
        }

        return NextResponse.json({
            success: true,
            message: 'Test data created successfully',
            data: {
                seller: SELLER_PROFILE,
                products: createdProducts.length,
                urls: {
                    shop: `/shop/${SELLER_PROFILE.shop_slug}`,
                    profile: `/profile/${TEST_USER_ID}`,
                    homepage: '/'
                }
            }
        })

    } catch (error) {
        console.error('❌ Error seeding data:', error)
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to seed data',
                details: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        )
    }
}
