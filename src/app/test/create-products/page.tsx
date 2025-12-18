'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import Button from '@/components/ui/Button'
import { db } from '@/lib/firebase'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'

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
        category_id: '1',
        price: 25900,
        condition: 'like_new',
        tags: ['iPhone', 'Apple', 'มือสอง']
    },
    {
        title: 'Canon EOS R6 Mark II Body + เลนส์ RF 24-105mm',
        description: `กล้อง Canon EOS R6 Mark II สภาพสวยมาก
ซื้อมา 6 เดือน ใช้ถ่ายงานอีเว้นท์
ชัตเตอร์ประมาณ 5,000 ครั้ง
พร้อมเลนส์ RF 24-105mm F4-7.1 IS STM
ครบกล่อง ประกันศูนย์เหลืออีก 1 ปี 6 เดือน
สภาพ 98% เหมือนใหม่`,
        category_id: '3',
        price: 89900,
        condition: 'like_new',
        tags: ['Canon', 'กล้อง', 'Mirrorless']
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
        category_id: '2',
        price: 42900,
        condition: 'like_new',
        tags: ['MacBook', 'Apple', 'M2']
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
        category_id: '10',
        price: 16900,
        condition: 'like_new',
        tags: ['PS5', 'PlayStation', 'เกม']
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
        category_id: '5',
        price: 385000,
        condition: 'good',
        tags: ['Rolex', 'นาฬิกา', 'Submariner']
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
        category_id: '8',
        price: 32900,
        condition: 'good',
        tags: ['เก้าอี้', 'Herman Miller', 'Aeron']
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
        category_id: '4',
        price: 8900,
        condition: 'like_new',
        tags: ['Nike', 'Jordan', 'รองเท้า']
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
        category_id: '9',
        price: 19900,
        condition: 'like_new',
        tags: ['Dyson', 'เครื่องดูดฝุ่น', 'ไร้สาย']
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
        category_id: '17',
        price: 52900,
        condition: 'like_new',
        tags: ['Fender', 'กีตาร์', 'Stratocaster']
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
        category_id: '14',
        price: 28900,
        condition: 'new',
        tags: ['Supreme', 'Hoodie', 'Streetwear']
    }
]

export default function TestCreateProductsPage() {
    const { user } = useAuth()
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [progress, setProgress] = useState(0)
    const [message, setMessage] = useState('')
    const [createdProducts, setCreatedProducts] = useState<string[]>([])

    const createSampleProducts = async () => {
        if (!user) {
            setMessage('❌ กรุณาเข้าสู่ระบบก่อน')
            return
        }

        setIsLoading(true)
        setProgress(0)
        setMessage('🚀 เริ่มสร้างสินค้าทดสอบ...')
        const productIds: string[] = []

        try {
            for (let i = 0; i < sampleProducts.length; i++) {
                const productData = sampleProducts[i]
                setMessage(`📦 กำลังสร้างสินค้า ${i + 1}/${sampleProducts.length}: ${productData.title}`)

                // Create placeholder image URL
                const imageUrl = `https://via.placeholder.com/800x600/4F46E5/FFFFFF?text=${encodeURIComponent(productData.title.substring(0, 30))}`

                // Generate slug
                const slug = productData.title
                    .toLowerCase()
                    .replace(/[^\u0E00-\u0E7Fa-z0-9]+/g, '-')
                    .replace(/^-+|-+$/g, '')

                // Create product document
                const productRef = await addDoc(collection(db, 'products'), {
                    title: productData.title,
                    slug: slug + '-' + Date.now(),
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
                    seller_name: user.displayName || 'ผู้ขาย',
                    seller_avatar: user.photoURL || null,

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
                })

                productIds.push(productRef.id)
                setProgress(((i + 1) / sampleProducts.length) * 100)

                // Wait a bit to avoid rate limiting
                await new Promise(resolve => setTimeout(resolve, 500))
            }

            setCreatedProducts(productIds)
            setMessage(`✅ สร้างสินค้าสำเร็จ ${productIds.length} รายการ!`)

            // Redirect to homepage after 3 seconds
            setTimeout(() => {
                router.push('/')
            }, 3000)

        } catch (error: any) {
            console.error('Error creating products:', error)
            setMessage(`❌ เกิดข้อผิดพลาด: ${error.message}`)
        } finally {
            setIsLoading(false)
        }
    }

    if (!user) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-bg-dark flex items-center justify-center p-4">
                <div className="bg-white dark:bg-surface-dark rounded-xl p-8 max-w-md w-full text-center">
                    <h1 className="text-2xl font-bold mb-4">กรุณาเข้าสู่ระบบ</h1>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                        คุณต้องเข้าสู่ระบบก่อนจึงจะสามารถสร้างสินค้าทดสอบได้
                    </p>
                    <Button onClick={() => router.push('/login')}>
                        เข้าสู่ระบบ
                    </Button>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-bg-dark flex items-center justify-center p-4">
            <div className="bg-white dark:bg-surface-dark rounded-xl p-8 max-w-2xl w-full">
                <h1 className="text-3xl font-bold mb-2 text-center">🧪 ทดสอบสร้างสินค้า</h1>
                <p className="text-gray-600 dark:text-gray-400 text-center mb-8">
                    สร้างสินค้าตัวอย่าง 10 รายการเพื่อทดสอบระบบ
                </p>

                {!isLoading && createdProducts.length === 0 && (
                    <div className="space-y-4">
                        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                            <h3 className="font-semibold mb-2">📋 สินค้าที่จะสร้าง:</h3>
                            <ul className="text-sm space-y-1 text-gray-700 dark:text-gray-300">
                                {sampleProducts.map((p, i) => (
                                    <li key={i}>
                                        {i + 1}. {p.title} - ฿{p.price.toLocaleString()}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <Button
                            onClick={createSampleProducts}
                            className="w-full py-3 text-lg"
                            variant="primary"
                        >
                            🚀 เริ่มสร้างสินค้า 10 รายการ
                        </Button>
                    </div>
                )}

                {isLoading && (
                    <div className="space-y-4">
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 overflow-hidden">
                            <div
                                className="bg-gradient-to-r from-neon-purple to-neon-cyan h-full transition-all duration-500 ease-out"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                        <p className="text-center text-lg font-medium">{Math.round(progress)}%</p>
                        <p className="text-center text-gray-600 dark:text-gray-400">{message}</p>
                    </div>
                )}

                {createdProducts.length > 0 && (
                    <div className="space-y-4">
                        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6 text-center">
                            <div className="text-6xl mb-4">✅</div>
                            <h2 className="text-2xl font-bold mb-2">{message}</h2>
                            <p className="text-gray-600 dark:text-gray-400 mb-4">
                                กำลังนำคุณไปยังหน้าแรก...
                            </p>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                <p className="font-semibold mb-2">Product IDs:</p>
                                <div className="max-h-40 overflow-y-auto space-y-1">
                                    {createdProducts.map((id, i) => (
                                        <div key={id} className="font-mono text-xs">
                                            {i + 1}. {id}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
