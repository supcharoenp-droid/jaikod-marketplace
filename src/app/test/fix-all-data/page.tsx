'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import Button from '@/components/ui/Button'
import { db } from '@/lib/firebase'
import { collection, getDocs, updateDoc, doc, deleteDoc } from 'firebase/firestore'

export default function FixProductDataPage() {
    const { user } = useAuth()
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [message, setMessage] = useState('')
    const [fixedCount, setFixedCount] = useState(0)
    const [deletedCount, setDeletedCount] = useState(0)

    const fixAllProductData = async () => {
        if (!user) {
            setMessage('❌ กรุณาเข้าสู่ระบบก่อน')
            return
        }

        setIsLoading(true)
        setMessage('🔧 กำลังแก้ไขข้อมูลสินค้า...')
        let fixed = 0
        let deleted = 0

        try {
            // Get all products
            const productsSnapshot = await getDocs(collection(db, 'products'))
            setMessage(`📦 พบสินค้า ${productsSnapshot.size} รายการ กำลังแก้ไข...`)

            for (const productDoc of productsSnapshot.docs) {
                const productData = productDoc.data()
                const productId = productDoc.id

                // Check if product has required fields
                if (!productData.title || !productData.seller_id) {
                    // Delete invalid products
                    await deleteDoc(doc(db, 'products', productId))
                    deleted++
                    setMessage(`🗑️ ลบสินค้าที่ไม่ถูกต้อง ${deleted} รายการ`)
                    continue
                }

                // Prepare updates
                const updates: any = {
                    id: productId, // Add missing id field
                }

                // Fix slug - support Thai characters
                if (!productData.slug || productData.slug.includes('%')) {
                    const slug = productData.title
                        .toLowerCase()
                        .trim()
                        .replace(/[^\u0E00-\u0E7Fa-z0-9\s]/g, '')
                        .replace(/\s+/g, '-')
                        .replace(/^-+|-+$/g, '')
                        + '-' + productId.substring(0, 8)
                    updates.slug = slug
                }

                // Fix location fields - rename to match productService
                if (productData.province && !productData.location_province) {
                    updates.location_province = productData.province
                }
                if (productData.amphoe && !productData.location_amphoe) {
                    updates.location_amphoe = productData.amphoe
                }
                if (productData.district && !productData.location_district) {
                    updates.location_district = productData.district
                }
                if (productData.zipcode && !productData.location_zipcode) {
                    updates.location_zipcode = productData.zipcode
                }

                // Fix images - convert string array to ProductImage array
                if (productData.images && Array.isArray(productData.images)) {
                    const firstImage = productData.images[0]

                    // If images are strings, convert to proper format
                    if (typeof firstImage === 'string') {
                        // Use a working placeholder service
                        const placeholderUrl = `https://placehold.co/800x600/4F46E5/FFFFFF/png?text=${encodeURIComponent(productData.title?.substring(0, 20) || 'Product')}`

                        updates.images = [{
                            url: placeholderUrl,
                            order: 0
                        }]
                        updates.thumbnail_url = placeholderUrl
                    }
                }

                // Apply updates
                if (Object.keys(updates).length > 1) { // More than just 'id'
                    await updateDoc(doc(db, 'products', productId), updates)
                    fixed++
                    setMessage(`✅ แก้ไขแล้ว ${fixed}/${productsSnapshot.size} รายการ`)
                }
            }

            setFixedCount(fixed)
            setDeletedCount(deleted)
            setMessage(`🎉 แก้ไขสำเร็จ ${fixed} รายการ, ลบ ${deleted} รายการ!`)

            // Redirect after 3 seconds
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
                <h1 className="text-3xl font-bold mb-2 text-center">🔧 แก้ไขข้อมูลสินค้าทั้งหมด</h1>
                <p className="text-gray-600 dark:text-gray-400 text-center mb-8">
                    แก้ไขปัญหา: รูปภาพ, slug, ชื่อฟิลด์ location, และลบข้อมูลที่ไม่ถูกต้อง
                </p>

                {!isLoading && fixedCount === 0 && (
                    <div className="space-y-4">
                        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                            <h3 className="font-semibold mb-2">⚠️ ปัญหาที่พบ:</h3>
                            <ul className="text-sm space-y-1 text-gray-700 dark:text-gray-300 list-disc list-inside">
                                <li>รูปภาพเป็น string array แทน ProductImage[]</li>
                                <li>ชื่อฟิลด์ location ไม่ตรงกัน (province vs location_province)</li>
                                <li>Product slug ไม่รองรับภาษาไทย</li>
                                <li>ขาด id field และ thumbnail_url</li>
                            </ul>
                        </div>

                        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                            <h3 className="font-semibold mb-2">✅ การแก้ไข:</h3>
                            <ul className="text-sm space-y-1 text-gray-700 dark:text-gray-300 list-disc list-inside">
                                <li>แปลง images เป็น ProductImage[] format</li>
                                <li>เพิ่ม location_* fields ให้ตรงกับ productService</li>
                                <li>สร้าง slug ใหม่ที่รองรับภาษาไทย</li>
                                <li>เพิ่ม id และ thumbnail_url</li>
                                <li>ลบสินค้าที่ไม่มีข้อมูลสำคัญ</li>
                            </ul>
                        </div>

                        <Button
                            onClick={fixAllProductData}
                            className="w-full py-3 text-lg"
                            variant="primary"
                        >
                            🔧 เริ่มแก้ไขข้อมูลทั้งหมด
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

                {(fixedCount > 0 || deletedCount > 0) && (
                    <div className="space-y-4">
                        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6 text-center">
                            <div className="text-6xl mb-4">✅</div>
                            <h2 className="text-2xl font-bold mb-2">{message}</h2>
                            <div className="text-gray-600 dark:text-gray-400 space-y-2">
                                <p>✅ แก้ไขสินค้า: {fixedCount} รายการ</p>
                                {deletedCount > 0 && <p>🗑️ ลบสินค้าที่ไม่ถูกต้อง: {deletedCount} รายการ</p>}
                                <p className="mt-4">กำลังนำคุณไปยังหน้าแรก...</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
