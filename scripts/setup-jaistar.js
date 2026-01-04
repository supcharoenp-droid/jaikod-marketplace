/**
 * JaiStar Setup Script
 * สร้าง seller profile และ demo listings สำหรับ JaiStar
 * 
 * Run: node scripts/setup-jaistar.js
 */

import { initializeApp } from 'firebase/app'
import { getFirestore, doc, setDoc, Timestamp } from 'firebase/firestore'
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth'

// Firebase config (ใช้ค่าเดียวกับ app)
const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)
const auth = getAuth(app)

// ====================================
// 1. CREATE USER ACCOUNT
// ====================================
async function createJaiStarUser() {
    console.log('🌟 Creating JaiStar user account...')

    try {
        const userCredential = await createUserWithEmailAndPassword(
            auth,
            'jaistar@jaikod.com',
            'JaiStar2026!' // Change in production
        )

        const user = userCredential.user
        console.log('✅ User created:', user.uid)
        return user.uid
    } catch (error) {
        if (error.code === 'auth/email-already-in-use') {
            console.log('ℹ️  User already exists, skipping...')
            // Return hardcoded UID or fetch existing
            return 'jaistar' // Use consistent UID
        }
        throw error
    }
}

// ====================================
// 2. CREATE SELLER PROFILE
// ====================================
async function createSellerProfile(userId) {
    console.log('📝 Creating seller profile...')

    const sellerProfile = {
        id: 'jaistar',
        user_id: userId,

        // Basic Info
        shop_name: 'JaiStar Premium Shop',
        business_name: 'JaiStar Co., Ltd.',
        slug: 'jaistar',

        // Verification
        verified: true,
        verification_level: 'premium',
        verification_date: Timestamp.now(),

        // Stats
        rating: 5.0,
        total_sales: 1234,
        total_reviews: 456,
        total_listings: 0, // Will update after creating listings
        satisfaction_rate: 99,
        response_rate: 100,
        response_time_minutes: 15,

        // Badges
        badges: [
            'top_seller_2026',
            'verified_seller',
            'fast_shipping',
            'premium_quality',
            'excellent_service'
        ],

        // Contact
        contact: {
            phone: '02-123-4567',
            line: '@jaistar',
            email: 'support@jaistar.com',
            show_phone: true,
            show_line: true,
            show_email: true
        },

        // Location
        location: {
            province: 'กรุงเทพมหานคร',
            amphoe: 'วัฒนา',
            coordinates: {
                lat: 13.7563,
                lng: 100.5018
            }
        },

        // Store Info
        description: 'ร้านค้าชั้นนำ รับประกันคุณภาพ 100% | สินค้าแท้ทุกชิ้น | จัดส่งรวดเร็ว',
        established_date: '2020-01-01',
        logo_url: null, // Add later
        banner_url: null, // Add later

        // Settings
        auto_accept_orders: false,
        shipping_methods: ['pickup', 'delivery', 'nationwide'],
        payment_methods: ['cash', 'transfer', 'promptpay', 'qr'],

        // Status
        status: 'active',
        featured: true,
        premium_until: Timestamp.fromDate(new Date('2026-12-31')),

        // Timestamps
        created_at: Timestamp.now(),
        updated_at: Timestamp.now()
    }

    await setDoc(doc(db, 'sellers', 'jaistar'), sellerProfile)
    console.log('✅ Seller profile created')
}

// ====================================
// 3. CREATE DEMO LISTINGS
// ====================================
async function createDemoListings() {
    console.log('📦 Creating demo listings...')

    const listings = [
        {
            id: 'jaistar-iphone15',
            seller_id: 'jaistar',
            title: 'iPhone 15 Pro Max 256GB Natural Titanium 🌟',
            description: 'สภาพใหม่ ยังไม่แกะกล่อง รับประกันศูนย์ไทย 1 ปีเต็มรับประกันของแท้ 100%',
            price: 39900,
            category_type: 'mobile',
            category_id: 3,
            subcategory_id: 301,
            status: 'active',
            featured: true,
            images: [
                'https://placehold.co/800x800/3b82f6/white?text=iPhone+15+Pro'
            ],
            location: {
                province: 'กรุงเทพมหานคร',
                amphoe: 'วัฒนา'
            },
            template_data: {
                brand: 'apple',
                model: 'iPhone 15 Pro Max',
                storage: '256gb',
                color: 'natural',
                battery_health: '100',
                screen_condition: 'perfect',
                network_status: 'unlocked'
            },
            views: 1250,
            favorites: 89,
            created_at: Timestamp.now(),
            updated_at: Timestamp.now()
        },
        {
            id: 'jaistar-macbook',
            seller_id: 'jaistar',
            title: 'MacBook Pro 16" M3 Max 36GB RAM 1TB SSD ⭐',
            description: 'ของใหม่ แกะกล่อง รับประกันศูนย์ไทย สเปคสูงสุด เหมาะกับ Pro User',
            price: 129900,
            category_type: 'electronics',
            category_id: 4,
            subcategory_id: 401,
            status: 'active',
            featured: true,
            images: [
                'https://placehold.co/800x800/6366f1/white?text=MacBook+Pro'
            ],
            location: {
                province: 'กรุงเทพมหานคร',
                amphoe: 'วัฒนา'
            },
            views: 892,
            favorites: 56,
            created_at: Timestamp.now(),
            updated_at: Timestamp.now()
        },
        {
            id: 'jaistar-airpods',
            seller_id: 'jaistar',
            title: 'AirPods Pro (2nd Gen) USB-C 🎧',
            description: 'ใหม่ล่าสุด พร้อม Active Noise Cancellation รับประกันศูนย์',
            price: 8900,
            category_type: 'electronics',
            category_id: 4,
            subcategory_id: 402,
            status: 'active',
            featured: true,
            images: [
                'https://placehold.co/800x800/10b981/white?text=AirPods+Pro'
            ],
            location: {
                province: 'กรุงเทพมหานคร',
                amphoe: 'วัฒนา'
            },
            views: 2156,
            favorites: 124,
            created_at: Timestamp.now(),
            updated_at: Timestamp.now()
        }
    ]

    for (const listing of listings) {
        await setDoc(doc(db, 'listings', listing.id), listing)
        console.log(`  ✅ Created: ${listing.title}`)
    }

    console.log(`✅ ${listings.length} listings created`)

    // Update seller's total_listings
    await setDoc(
        doc(db, 'sellers', 'jaistar'),
        { total_listings: listings.length, updated_at: Timestamp.now() },
        { merge: true }
    )
}

// ====================================
// 4. CREATE FEATURED ENTRY
// ====================================
async function createFeaturedEntry() {
    console.log('⭐ Creating featured seller entry...')

    const featured = {
        seller_id: 'jaistar',
        priority: 1,
        placement: 'homepage_hero',
        title: '🌟 JaiStar Premium Shop',
        subtitle: 'ผู้ขายอันดับ 1 | รับประกันคุณภาพ 100%',
        cta_text: 'เลือกซื้อสินค้า',
        cta_link: '/shop/jaistar',
        active: true,
        start_date: Timestamp.now(),
        end_date: Timestamp.fromDate(new Date('2026-12-31')),
        created_at: Timestamp.now()
    }

    await setDoc(doc(db, 'featured_sellers', 'jaistar'), featured)
    console.log('✅ Featured entry created')
}

// ====================================
// MAIN
// ====================================
async function main() {
    console.log('🚀 Starting JaiStar Setup...\n')

    try {
        // Step 1: Create user
        const userId = await createJaiStarUser()

        // Step 2: Create seller profile
        await createSellerProfile(userId)

        // Step 3: Create demo listings
        await createDemoListings()

        // Step 4: Create featured entry
        await createFeaturedEntry()

        console.log('\n✅ JaiStar setup complete!')
        console.log('\n📍 Access at: http://localhost:3000/profile/jaistar')
        console.log('📍 Shop at: http://localhost:3000/shop/jaistar')

    } catch (error) {
        console.error('❌ Error:', error)
        process.exit(1)
    }
}

main()
