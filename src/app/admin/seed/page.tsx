'use client'

import { useState } from 'react'
import { db } from '@/lib/firebase'
import { collection, addDoc, doc, setDoc, Timestamp, getDocs, deleteDoc, writeBatch } from 'firebase/firestore'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import { Loader2, Database, CheckCircle, XCircle, Trash2 } from 'lucide-react'

// Mock Images (Unsplash)
const MOCK_IMAGES = {
    mobile: [
        'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1598327105655-cfa97641cbe7?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1616348436168-de43ad0db179?auto=format&fit=crop&w=800&q=80'
    ],
    fashion: [
        'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1551232864-3f0890e580d9?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=800&q=80'
    ],
    car: [
        'https://images.unsplash.com/photo-1533473359331-0135ef1bcfb0?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=800&q=80'
    ],
    watch: [
        'https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?auto=format&fit=crop&w=800&q=80'
    ],
    decor: [
        'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80'
    ]
}

const SELLERS = [
    {
        uid: 'seed_seller_001',
        name: 'Tech Gadget Pro',
        email: 'tech@example.com',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
        category_focus: ['mobile', 'watch']
    },
    {
        uid: 'seed_seller_002',
        name: 'Vintage Collectibles',
        email: 'vintage@example.com',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Annie',
        category_focus: ['fashion', 'car', 'decor']
    }
]

export default function SeederPage() {
    const [loading, setLoading] = useState(false)
    const [logs, setLogs] = useState<string[]>([])

    const addLog = (msg: string) => setLogs(prev => [...prev, msg])

    const clearData = async () => {
        // if (!confirm('⚠️ Are you sure you want to DELETE ALL PRODUCTS and SEED SELLERS? This cannot be undone.')) return

        setLoading(true)
        setLogs([])
        addLog('🗑️ Starting Data Cleanup...')

        try {
            const batch = writeBatch(db)
            let opCount = 0

            // 1. Delete All Products
            const productsSnapshot = await getDocs(collection(db, 'products'))
            addLog(`Found ${productsSnapshot.size} products to delete.`)

            for (const doc of productsSnapshot.docs) {
                batch.delete(doc.ref)
                opCount++
            }

            // 2. Delete Seed Sellers (only specific ones to avoid wiping real admin)
            for (const seller of SELLERS) {
                batch.delete(doc(db, 'users', seller.uid))
                batch.delete(doc(db, 'sellers', seller.uid))
                opCount += 2
                addLog(`Scheduled deletion for seller: ${seller.name}`)
            }

            if (opCount > 0) {
                await batch.commit()
                addLog(`✅ Successfully deleted ${productsSnapshot.size} products and ${SELLERS.length} sellers.`)
            } else {
                addLog('ℹ️ No data to delete.')
            }

        } catch (error) {
            console.error(error)
            addLog(`❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`)
        } finally {
            setLoading(false)
        }
    }

    const runSeeder = async () => {
        setLoading(true)
        setLogs([])
        addLog('🚀 Starting Data Seeding...')

        try {
            for (const seller of SELLERS) {
                // 1. Create Seller Document
                addLog(`👤 Creating Seller: ${seller.name}...`)
                await setDoc(doc(db, 'users', seller.uid), {
                    uid: seller.uid,
                    displayName: seller.name,
                    email: seller.email,
                    photoURL: seller.avatar,
                    role: 'seller',
                    createdAt: Timestamp.now()
                })

                await setDoc(doc(db, 'sellers', seller.uid), {
                    id: seller.uid,
                    name: seller.name,
                    description: `Professional seller of ${seller.category_focus.join(', ')}`,
                    rate: 4.8,
                    verified: true,
                    joinedAt: Timestamp.now(),
                    address: 'Bangkok, Thailand'
                })

                // 2. Create 20 Products for this seller
                for (let i = 1; i <= 20; i++) {
                    const categoryType = seller.category_focus[Math.floor(Math.random() * seller.category_focus.length)]
                    const images = MOCK_IMAGES[categoryType as keyof typeof MOCK_IMAGES]
                    const image = images[Math.floor(Math.random() * images.length)]

                    const price = Math.floor(Math.random() * 10000) + 500

                    // Simple logic to map type to category ID
                    let catId = '1' // Mobile
                    let titlePrefix = 'Smartphone'
                    if (categoryType === 'car') { catId = '2'; titlePrefix = 'Used Car' }
                    if (categoryType === 'fashion') { catId = '3'; titlePrefix = 'Vintage Shirt' }
                    if (categoryType === 'decor') { catId = '4'; titlePrefix = 'Home Decor' }
                    if (categoryType === 'watch') { catId = '5'; titlePrefix = 'Luxury Watch' }

                    const productData = {
                        title: `${titlePrefix} Model X-${i} (${seller.name})`,
                        description: `This is a high quality ${categoryType} item from ${seller.name}. Condition is good. Ready to ship.`,
                        category_id: catId,
                        price: price,
                        original_price: price + 1000,
                        price_type: 'fixed',
                        condition: 'good',
                        images: [image], // Use remote image
                        stock: 1,
                        province: 'กรุงเทพมหานคร',
                        amphoe: 'Pathum Wan',
                        district: 'Pathum Wan',
                        zipcode: '10330',
                        can_ship: true,
                        can_pickup: true,
                        shipping_fee: 50,
                        status: 'active',
                        seller_id: seller.uid,
                        seller_name: seller.name,
                        seller_avatar: seller.avatar,
                        created_at: Timestamp.now(),
                        updated_at: Timestamp.now(),
                        views_count: Math.floor(Math.random() * 500),
                        sold_count: Math.floor(Math.random() * 50)
                    }

                    await addDoc(collection(db, 'products'), productData)
                    if (i % 5 === 0) addLog(`   📦 Added product ${i}/20 for ${seller.name}`)
                }
            }

            addLog('✅ Seeding Complete! Refresh the homepage to see products.')

        } catch (error) {
            console.error(error)
            addLog(`❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <Card className="max-w-md w-full p-6 space-y-6">
                <div className="text-center">
                    <Database className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                    <h1 className="text-2xl font-bold text-gray-900">System Data Seeder</h1>
                    <p className="text-gray-500">Inject 2 Sellers & 40 Products</p>
                </div>

                <div className="bg-gray-900 rounded-lg p-4 h-64 overflow-y-auto font-mono text-xs text-green-400">
                    {logs.length === 0 ? '> Ready to seed...' : logs.map((log, i) => (
                        <div key={i}>{log}</div>
                    ))}
                </div>

                <div className="space-y-3">
                    <Button
                        className="w-full h-12 text-lg"
                        onClick={runSeeder}
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                Processing...
                            </>
                        ) : (
                            'Run Seed Script'
                        )}
                    </Button>

                    <Button
                        variant="ghost"
                        className="w-full h-12 text-lg text-red-600 hover:bg-red-50 hover:text-red-700"
                        onClick={clearData}
                        disabled={loading}
                    >
                        <Trash2 className="w-5 h-5 mr-2" />
                        Clear All Data
                    </Button>
                </div>
            </Card>
        </div>
    )
}
