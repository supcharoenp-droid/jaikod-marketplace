'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import Button from '@/components/ui/Button'
import { db } from '@/lib/firebase'
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore'

export default function FixProductsPage() {
    const { user } = useAuth()
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [message, setMessage] = useState('')
    const [fixedCount, setFixedCount] = useState(0)

    const fixAllProducts = async () => {
        if (!user) {
            setMessage('❌ กรุณาเข้าสู่ระบบก่อน')
            return
        }

        setIsLoading(true)
        setMessage('🔧 กำลังแก้ไขข้อมูลสินค้า...')
        let count = 0

        try {
            // Get all products
            const productsSnapshot = await getDocs(collection(db, 'products'))
            setMessage(`📦 พบสินค้า ${productsSnapshot.size} รายการ กำลังแก้ไข...`)

            for (const productDoc of productsSnapshot.docs) {
                const productData = productDoc.data()
                const productId = productDoc.id

                // Generate proper slug from title
                const slug = productData.title
                    ? productData.title
                        .toLowerCase()
                        .trim()
                        // Keep Thai characters, English letters, and numbers
                        .replace(/[^\u0E00-\u0E7Fa-z0-9\s]/g, '')
                        // Replace spaces with hyphens
                        .replace(/\s+/g, '-')
                        // Remove leading/trailing hyphens
                        .replace(/^-+|-+$/g, '')
                    // Add product ID to make it unique
                    + '-' + productId.substring(0, 8)
                    : productId

                // Use a better placeholder image service
                const imageUrl = `https://placehold.co/800x600/4F46E5/FFFFFF/png?text=${encodeURIComponent(productData.title?.substring(0, 20) || 'Product')}`

                // Update product with fixes
                await updateDoc(doc(db, 'products', productId), {
                    id: productId, // Add missing id field
                    slug: slug, // Fix slug
                    images: productData.images && productData.images.length > 0
                        ? [imageUrl] // Replace with working image
                        : [imageUrl]
                })

                count++
                setMessage(`✅ แก้ไขแล้ว ${count}/${productsSnapshot.size} รายการ`)
            }

            setFixedCount(count)
            setMessage(`🎉 แก้ไขสินค้าสำเร็จ ${count} รายการ!`)

            // Redirect to homepage after 3 seconds
            setTimeout(() => {
                router.push('/')
            }, 3000)

        } catch (error: any) {
            console.error('Error fixing products:', error)
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
                        คุณต้องเข้าสู่ระบบก่อนจึงจะสามารถแก้ไขสินค้าได้
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
                <h1 className="text-3xl font-bold mb-2 text-center">🔧 แก้ไขข้อมูลสินค้า</h1>
                <p className="text-gray-600 dark:text-gray-400 text-center mb-8">
                    แก้ไขปัญหา: รูปภาพไม่แสดง, slug ไม่ถูกต้อง, ขาด id field
                </p>

                {!isLoading && fixedCount === 0 && (
                    <div className="space-y-4">
                        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                            <h3 className="font-semibold mb-2">⚠️ ปัญหาที่พบ:</h3>
                            <ul className="text-sm space-y-1 text-gray-700 dark:text-gray-300 list-disc list-inside">
                                <li>รูปภาพไม่แสดง (ใช้ URL ที่โหลดไม่ได้)</li>
                                <li>Product slug ไม่ถูกต้อง (ทำให้เข้าหน้า detail ไม่ได้)</li>
                                <li>ขาด id field ในเอกสาร</li>
                            </ul>
                        </div>

                        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                            <h3 className="font-semibold mb-2">✅ การแก้ไข:</h3>
                            <ul className="text-sm space-y-1 text-gray-700 dark:text-gray-300 list-disc list-inside">
                                <li>เปลี่ยนเป็นรูปภาพ placeholder ที่ใช้งานได้</li>
                                <li>สร้าง slug ใหม่ที่รองรับภาษาไทย</li>
                                <li>เพิ่ม id field ให้ทุกสินค้า</li>
                            </ul>
                        </div>

                        <Button
                            onClick={fixAllProducts}
                            className="w-full py-3 text-lg"
                            variant="primary"
                        >
                            🔧 เริ่มแก้ไขสินค้าทั้งหมด
                        </Button>
                    </div>
                )}

                {isLoading && (
                    <div className="space-y-4">
                        <div className="flex items-center justify-center">
                            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-neon-purple"></div>
                        </div>
                        <p className="text-center text-lg font-medium">{message}</p>
                    </div>
                )}

                {fixedCount > 0 && (
                    <div className="space-y-4">
                        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6 text-center">
                            <div className="text-6xl mb-4">✅</div>
                            <h2 className="text-2xl font-bold mb-2">{message}</h2>
                            <p className="text-gray-600 dark:text-gray-400 mb-4">
                                กำลังนำคุณไปยังหน้าแรก...
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                ตอนนี้สินค้าควรแสดงรูปภาพและเข้าหน้า detail ได้แล้ว
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
