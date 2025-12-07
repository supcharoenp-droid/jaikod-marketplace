/**
 * Seed Test Data Script
 * Creates sample products and seller profiles for testing
 */

import { initializeApp } from 'firebase/app'
import { getFirestore, collection, addDoc, setDoc, doc, Timestamp } from 'firebase/firestore'
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth'

// Firebase configuration
const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const db = getFirestore(app)
const auth = getAuth(app)

// Test User ID (use existing user or create new one)
const TEST_USER_ID = 'test-user-123'
const TEST_USER_EMAIL = 'test@jaikod.com'
const TEST_USER_PASSWORD = 'Test123456'

// Sample Products Data
const SAMPLE_PRODUCTS = [
    {
        title: 'iPhone 15 Pro Max 256GB Natural Titanium',
        description: 'iPhone 15 Pro Max สีใหม่ Natural Titanium ความจุ 256GB สภาพใหม่ ยังไม่แกะกล่อง รับประกันศูนย์ไทย 1 ปี',
        price: 45900,
        category_id: 1, // Mobiles
        condition: 'new',
        thumbnail_url: 'https://via.placeholder.com/400x400?text=iPhone+15+Pro+Max',
        image_urls: ['https://via.placeholder.com/800x800?text=iPhone+15+Pro+Max'],
        status: 'active',
        location: {
            province: 'กรุงเทพมหานคร',
            district: 'บางรัก',
            subdistrict: 'สีลม',
            postal_code: '10500'
        },
        tags: ['iPhone', 'Apple', 'มือถือ', 'ใหม่'],
        view_count: 0,
        favorite_count: 0
    },
    {
        title: 'MacBook Pro 14" M3 Pro 18GB/512GB Space Black',
        description: 'MacBook Pro 14 นิ้ว ชิป M3 Pro RAM 18GB SSD 512GB สี Space Black สภาพเหมือนใหม่ ใช้งานเพียง 2 เดือน ยังมีประกัน AppleCare+ อีก 10 เดือน',
        price: 69900,
        category_id: 2, // Computers
        condition: 'like_new',
        thumbnail_url: 'https://via.placeholder.com/400x400?text=MacBook+Pro+M3',
        image_urls: ['https://via.placeholder.com/800x800?text=MacBook+Pro+M3'],
        status: 'active',
        location: {
            province: 'กรุงเทพมหานคร',
            district: 'ปทุมวัน',
            subdistrict: 'ปทุมวัน',
            postal_code: '10330'
        },
        tags: ['MacBook', 'Apple', 'Laptop', 'M3'],
        view_count: 0,
        favorite_count: 0
    },
    {
        title: 'Sony A7 IV Body + Lens 28-70mm',
        description: 'กล้อง Sony A7 IV Body พร้อมเลนส์ Kit 28-70mm สภาพดีมาก ชัตเตอร์ไม่ถึง 5,000 ครั้ง พร้อมกล่อง อุปกรณ์ครบ',
        price: 89900,
        category_id: 3, // Cameras
        condition: 'good',
        thumbnail_url: 'https://via.placeholder.com/400x400?text=Sony+A7+IV',
        image_urls: ['https://via.placeholder.com/800x800?text=Sony+A7+IV'],
        status: 'active',
        location: {
            province: 'เชียงใหม่',
            district: 'เมืองเชียงใหม่',
            subdistrict: 'ช้างเผือก',
            postal_code: '50300'
        },
        tags: ['Sony', 'กล้อง', 'Mirrorless', 'A7IV'],
        view_count: 0,
        favorite_count: 0
    },
    {
        title: 'Nike Air Jordan 1 Retro High OG "Chicago" Size US 9',
        description: 'รองเท้า Nike Air Jordan 1 Retro High OG สี Chicago ไซส์ US 9 สภาพ 9/10 ใส่น้อยมาก มีกล่องและอุปกรณ์ครบ',
        price: 12900,
        category_id: 4, // Fashion
        condition: 'like_new',
        thumbnail_url: 'https://via.placeholder.com/400x400?text=Air+Jordan+1',
        image_urls: ['https://via.placeholder.com/800x800?text=Air+Jordan+1'],
        status: 'active',
        location: {
            province: 'กรุงเทพมหานคร',
            district: 'วัฒนา',
            subdistrict: 'คลองเตย',
            postal_code: '10110'
        },
        tags: ['Nike', 'Jordan', 'Sneakers', 'รองเท้า'],
        view_count: 0,
        favorite_count: 0
    },
    {
        title: 'PlayStation 5 Slim Digital Edition + 2 Controllers',
        description: 'PS5 Slim Digital Edition พร้อมจอย 2 ตัว สภาพสวยมาก ใช้งานเพียง 3 เดือน ยังมีประกันศูนย์อีก 9 เดือน',
        price: 16900,
        category_id: 10, // Toys & Games
        condition: 'like_new',
        thumbnail_url: 'https://via.placeholder.com/400x400?text=PS5+Slim',
        image_urls: ['https://via.placeholder.com/800x800?text=PS5+Slim'],
        status: 'active',
        location: {
            province: 'กรุงเทพมหานคร',
            district: 'บางกะปิ',
            subdistrict: 'คลองจั่น',
            postal_code: '10240'
        },
        tags: ['PS5', 'PlayStation', 'Gaming', 'Console'],
        view_count: 0,
        favorite_count: 0
    }
]

// Seller Profile Data
const SELLER_PROFILE = {
    shop_name: 'JaiKod Shop',
    shop_slug: 'jaikod-shop',
    shop_description: 'ร้านขายของมือสองคุณภาพดี ราคาเป็นกันเอง มีสินค้าหลากหลาย',
    avatar_url: 'https://via.placeholder.com/200x200?text=JaiKod',
    cover_url: 'https://via.placeholder.com/1200x400?text=JaiKod+Shop',
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
    },
    social_links: {
        facebook: 'https://facebook.com/jaikod',
        line: '@jaikod',
        instagram: 'https://instagram.com/jaikod'
    }
}

async function seedTestData() {
    console.log('🌱 Starting to seed test data...')
    console.log('')

    try {
        // 1. Create Seller Profile
        console.log('📝 Creating seller profile...')
        await setDoc(doc(db, 'sellers', TEST_USER_ID), SELLER_PROFILE)
        console.log('✅ Seller profile created')
        console.log('')

        // 2. Create Products
        console.log('📦 Creating sample products...')
        let createdCount = 0

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
            createdCount++
            console.log(`   ✓ Created product ${createdCount}/${SAMPLE_PRODUCTS.length}: ${product.title}`)
        }

        console.log('')
        console.log('✅ SUCCESS! Test data created successfully')
        console.log('')
        console.log('📊 Summary:')
        console.log(`   - Seller Profile: 1`)
        console.log(`   - Products: ${createdCount}`)
        console.log('')
        console.log('🎉 You can now test the application!')
        console.log('')
        console.log('🔗 URLs to test:')
        console.log(`   - Shop: http://localhost:3000/shop/${SELLER_PROFILE.shop_slug}`)
        console.log(`   - Profile: http://localhost:3000/profile/${TEST_USER_ID}`)
        console.log(`   - Homepage: http://localhost:3000`)

    } catch (error) {
        console.error('❌ Error seeding data:', error)
        throw error
    }
}

// Run the script
seedTestData()
    .then(() => {
        console.log('')
        console.log('✅ Script completed successfully')
        process.exit(0)
    })
    .catch((error) => {
        console.error('❌ Script failed:', error)
        process.exit(1)
    })
