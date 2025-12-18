/**
 * Test Script: Create 10 Sample Products
 * This script simulates a new seller creating 10 different products
 */

import { initializeApp } from 'firebase/app'
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth'
import { getFirestore, collection, addDoc, serverTimestamp, doc, setDoc } from 'firebase/firestore'
import { getStorage, ref, uploadString, getDownloadURL } from 'firebase/storage'

// Firebase config (same as in your app)
const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
}

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const db = getFirestore(app)
const storage = getStorage(app)

// Sample products data
const sampleProducts = [
    {
        title: 'iPhone 13 Pro 256GB สีน้ำเงิน สภาพสวย 95%',
        description: `iPhone 13 Pro 256GB สีน้ำเงิน Pacific Blue
ใช้งานมา 8 เดือน สภาพสวยมาก 95%
ไม่มีรอยขีดข่วน ไม่เคยตก ไม่เคยซ่อม
แบตเตอรี่ 92% ยังแรงมาก
ครบกล่อง อุปกรณ์ครบ
รับประกันเครื่องแท้ Apple`,
        category_id: '1', // มือถือและแท็บเล็ต
        price: 25900,
        condition: 'like_new',
        tags: ['iPhone', 'Apple', 'มือสอง'],
        color: '#1E3A8A'
    },
    {
        title: 'Canon EOS R6 Mark II Body + เลนส์ RF 24-105mm',
        description: `กล้อง Canon EOS R6 Mark II สภาพสวยมาก
ซื้อมา 6 เดือน ใช้ถ่ายงานอีเว้นท์
ชัตเตอร์ประมาณ 5,000 ครั้ง
พร้อมเลนส์ RF 24-105mm F4-7.1 IS STM
ครบกล่อง ประกันศูนย์เหลืออีก 1 ปี 6 เดือน
สภาพ 98% เหมือนใหม่`,
        category_id: '3', // กล้องและอุปกรณ์ถ่ายภาพ
        price: 89900,
        condition: 'like_new',
        tags: ['Canon', 'กล้อง', 'Mirrorless'],
        color: '#DC2626'
    },
    {
        title: 'MacBook Air M2 2023 16GB/512GB สี Midnight',
        description: `MacBook Air M2 Chip 2023
RAM 16GB / SSD 512GB
สี Midnight สวยหรู
ซื้อมา 4 เดือน ใช้งานเบาๆ
สภาพสวยมาก 99% เหมือนใหม่
ไม่มีรอยขีดข่วน ไม่มีตำหนิ
ครบกล่อง ประกันศูนย์ Apple เหลือ 8 เดือน
Battery Cycle Count: 12 ครั้ง`,
        category_id: '2', // คอมพิวเตอร์และแล็ปท็อป
        price: 42900,
        condition: 'like_new',
        tags: ['MacBook', 'Apple', 'M2'],
        color: '#6B7280'
    },
    {
        title: 'PlayStation 5 Slim Digital Edition + จอย 2 ตัว',
        description: `PS5 Slim Digital Edition
ซื้อมา 3 เดือน เล่นน้อย
สภาพสวยมาก 98%
พร้อมจอยเสริม 1 ตัว (รวม 2 ตัว)
เกมส์ในเครื่อง: FIFA 24, Spider-Man 2
ครบกล่อง ประกันศูนย์เหลือ 9 เดือน
ไม่มีตำหนิ ไม่เคยซ่อม`,
        category_id: '10', // ของเล่น เกม และงานอดิเรก
        price: 16900,
        condition: 'like_new',
        tags: ['PS5', 'PlayStation', 'เกม'],
        color: '#3B82F6'
    },
    {
        title: 'Rolex Submariner Date 41mm สีดำ (116610LN)',
        description: `Rolex Submariner Date 41mm
รุ่น 116610LN สีดำ
ปี 2019 ครบเซ็ต
กล่อง ใบรับประกัน การ์ดครบ
สภาพสวยมาก 95%
ตัวเรือนไม่มีรอยขีดข่วนชัดเจน
เดินเวลาแม่นยำ
พร้อมใบเซอร์วิสจากศูนย์
ของแท้ 100% รับประกัน`,
        category_id: '5', // นาฬิกาและเครื่องประดับ
        price: 385000,
        condition: 'good',
        tags: ['Rolex', 'นาฬิกา', 'Submariner'],
        color: '#000000'
    },
    {
        title: 'Herman Miller Aeron Chair Size B (Medium)',
        description: `เก้าอี้ Herman Miller Aeron
ไซส์ B (Medium) เหมาะกับคนส่วนใหญ่
ปี 2021 ซื้อจากศูนย์ไทย
ใช้งานมา 1 ปี สภาพดีมาก
ไม่มีตำหนิ ทุกฟังก์ชันใช้งานได้ปกติ
ปรับระดับได้ครบทุกจุด
เบาะตาข่ายระบายอากาศดี
ประกันศูนย์เหลืออีก 11 ปี`,
        category_id: '8', // ของตกแต่งบ้านและสวน
        price: 32900,
        condition: 'good',
        tags: ['เก้าอี้', 'Herman Miller', 'Aeron'],
        color: '#374151'
    },
    {
        title: 'Nike Air Jordan 1 Retro High OG "Chicago" Size US 9',
        description: `Nike Air Jordan 1 Retro High OG
สี "Chicago" (แดง-ขาว-ดำ)
Size US 9 / EU 42.5
ปี 2022 ของแท้ 100%
สภาพ 9/10 ใส่ไม่กี่ครั้ง
ไม่มีรอยเหลือง ไม่มีตำหนิ
ครบกล่อง ใบเสร็จจากร้านครบ
พร้อมส่ง`,
        category_id: '4', // แฟชั่นและเครื่องแต่งกาย
        price: 8900,
        condition: 'like_new',
        tags: ['Nike', 'Jordan', 'รองเท้า'],
        color: '#DC2626'
    },
    {
        title: 'Dyson V15 Detect Absolute เครื่องดูดฝุ่นไร้สาย',
        description: `Dyson V15 Detect Absolute
เครื่องดูดฝุ่นไร้สายรุ่นท็อป
ซื้อมา 5 เดือน ใช้งานน้อย
สภาพสวยมาก 95%
ครบอุปกรณ์ทุกชิ้น
แบตเตอรี่ยังแรง ใช้งานได้เต็มที่
ทำความสะอาดเรียบร้อยแล้ว
ประกันศูนย์เหลือ 1 ปี 7 เดือน`,
        category_id: '9', // เครื่องใช้ไฟฟ้าภายในบ้าน
        price: 19900,
        condition: 'like_new',
        tags: ['Dyson', 'เครื่องดูดฝุ่น', 'ไร้สาย'],
        color: '#7C3AED'
    },
    {
        title: 'Fender American Professional II Stratocaster',
        description: `Fender American Professional II Stratocaster
สี Miami Blue สวยสุดๆ
ปี 2021 ซื้อจากศูนย์ไทย
สภาพสวยมาก 98%
เล่นที่บ้านอย่างเดียว
ไม่มีรอยกระแทก ไม่มีตำหนิ
เสียงดีมาก ทุกปิ๊กอัพใช้งานปกติ
ครบกล่อง ใบรับประกัน การ์ดครบ`,
        category_id: '17', // ดนตรีและเครื่องดนตรี
        price: 52900,
        condition: 'like_new',
        tags: ['Fender', 'กีตาร์', 'Stratocaster'],
        color: '#06B6D4'
    },
    {
        title: 'Supreme Box Logo Hoodie FW22 สีดำ Size L',
        description: `Supreme Box Logo Hoodie
ฤดูกาล Fall/Winter 2022
สีดำ Size L
ของแท้ 100% มีใบเสร็จ
สภาพ 10/10 ไม่เคยใส่
เก็บไว้ในถุงตลอด
ไม่มีรอยเหลือง ไม่มีตำหนิ
พร้อมถุง Supreme
สินค้าหายาก`,
        category_id: '14', // ของสะสมและงานศิลปะ
        price: 28900,
        condition: 'new',
        tags: ['Supreme', 'Hoodie', 'Streetwear'],
        color: '#000000'
    }
]

// Helper function to create a placeholder image
async function createPlaceholderImage(productTitle: string, color: string): Promise<string> {
    // Create a simple colored rectangle as base64
    const canvas = `
    <svg width="800" height="600" xmlns="http://www.w3.org/2000/svg">
        <rect width="800" height="600" fill="${color}"/>
        <text x="50%" y="50%" font-family="Arial" font-size="24" fill="white" text-anchor="middle" dominant-baseline="middle">
            ${productTitle}
        </text>
    </svg>
    `
    return `data:image/svg+xml;base64,${Buffer.from(canvas).toString('base64')}`
}

async function uploadImage(userId: string, productId: string, imageData: string, index: number): Promise<string> {
    const storageRef = ref(storage, `products/${userId}/${productId}/image_${index}.svg`)
    await uploadString(storageRef, imageData, 'data_url')
    return await getDownloadURL(storageRef)
}

async function createTestUser() {
    const email = 'somchai.jaidee@gmail.com'
    const password = 'Test1234!'
    const displayName = 'สมชาย ใจดี'

    try {
        // Try to sign in first
        const userCredential = await signInWithEmailAndPassword(auth, email, password)
        console.log('✅ Signed in as existing user:', userCredential.user.email)
        return userCredential.user
    } catch (error: any) {
        if (error.code === 'auth/user-not-found') {
            // Create new user
            const userCredential = await createUserWithEmailAndPassword(auth, email, password)
            console.log('✅ Created new user:', userCredential.user.email)

            // Create user profile in Firestore
            await setDoc(doc(db, 'users', userCredential.user.uid), {
                email: email,
                display_name: displayName,
                first_name: 'สมชาย',
                last_name: 'ใจดี',
                phone: '0812345678',
                role: 'seller',
                created_at: serverTimestamp(),
                updated_at: serverTimestamp()
            })

            // Create seller profile
            await setDoc(doc(db, 'sellers', userCredential.user.uid), {
                user_id: userCredential.user.uid,
                shop_name: 'ร้านสมชาย',
                description: 'ขายของมือสอง สภาพดี ราคาถูก',
                rating: 5.0,
                total_sales: 0,
                total_products: 0,
                status: 'active',
                created_at: serverTimestamp(),
                updated_at: serverTimestamp()
            })

            return userCredential.user
        }
        throw error
    }
}

async function createProduct(user: any, productData: any, index: number) {
    console.log(`\n📦 Creating product ${index + 1}/10: ${productData.title}`)

    try {
        // Generate product ID
        const productRef = doc(collection(db, 'products'))
        const productId = productRef.id

        // Create placeholder image
        const imageData = await createPlaceholderImage(productData.title, productData.color)

        // Upload image
        console.log('  📸 Uploading image...')
        const imageUrl = await uploadImage(user.uid, productId, imageData, 0)

        // Create product document
        const product = {
            id: productId,
            title: productData.title,
            description: productData.description,
            category_id: productData.category_id,
            price: productData.price,
            original_price: null,
            price_type: 'fixed',
            condition: productData.condition,
            usage_detail: '',
            stock: 1,
            tags: productData.tags,
            images: [imageUrl],

            // Seller info
            seller_id: user.uid,
            seller_name: 'สมชาย ใจดี',
            seller_avatar: null,

            // Location
            province: 'กรุงเทพมหานคร',
            amphoe: 'คลองเตย',
            district: 'คลองตัน',
            zipcode: '10110',

            // Shipping
            can_ship: true,
            can_pickup: false,
            shipping_fee: 0,
            shipping_options: [],

            // Status
            status: 'active',
            moderation_status: 'approved',

            // Stats
            views: 0,
            favorites: 0,

            // Timestamps
            created_at: serverTimestamp(),
            updated_at: serverTimestamp()
        }

        await setDoc(productRef, product)
        console.log(`  ✅ Product created successfully! ID: ${productId}`)

        return productId
    } catch (error) {
        console.error(`  ❌ Error creating product:`, error)
        throw error
    }
}

async function main() {
    console.log('🚀 Starting test: Create 10 sample products')
    console.log('='.repeat(60))

    try {
        // Step 1: Create/Login user
        console.log('\n👤 Step 1: Creating/logging in test user...')
        const user = await createTestUser()

        // Step 2: Create 10 products
        console.log('\n📦 Step 2: Creating 10 sample products...')
        const productIds: string[] = []

        for (let i = 0; i < sampleProducts.length; i++) {
            const productId = await createProduct(user, sampleProducts[i], i)
            productIds.push(productId)

            // Wait a bit between products to avoid rate limiting
            await new Promise(resolve => setTimeout(resolve, 1000))
        }

        // Summary
        console.log('\n' + '='.repeat(60))
        console.log('✅ TEST COMPLETED SUCCESSFULLY!')
        console.log('='.repeat(60))
        console.log(`\n📊 Summary:`)
        console.log(`   User: ${user.email}`)
        console.log(`   Products created: ${productIds.length}`)
        console.log(`\n🔗 View products at: http://localhost:3000`)
        console.log(`\n📝 Product IDs:`)
        productIds.forEach((id, i) => {
            console.log(`   ${i + 1}. ${id}`)
        })

    } catch (error) {
        console.error('\n❌ TEST FAILED:', error)
        process.exit(1)
    }
}

// Run the test
main()
    .then(() => {
        console.log('\n✅ Script completed')
        process.exit(0)
    })
    .catch((error) => {
        console.error('\n❌ Script failed:', error)
        process.exit(1)
    })
