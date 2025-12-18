'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import Button from '@/components/ui/Button'
import { db } from '@/lib/firebase'
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore'

export default function CheckFirebaseDataPage() {
    const { user } = useAuth()
    const [products, setProducts] = useState<any[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const checkData = async () => {
        setLoading(true)
        setError(null)

        try {
            const productsRef = collection(db, 'products')
            const q = query(productsRef, orderBy('created_at', 'desc'), limit(20))
            const snapshot = await getDocs(q)

            const productsList = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }))

            setProducts(productsList)

            if (productsList.length === 0) {
                setError('ไม่พบสินค้าใน Firebase')
            }
        } catch (err: any) {
            console.error('Error fetching products:', err)
            setError(`เกิดข้อผิดพลาด: ${err.message}`)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        checkData()
    }, [])

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-bg-dark p-4">
            <div className="max-w-6xl mx-auto">
                <div className="bg-white dark:bg-surface-dark rounded-xl p-6 mb-4">
                    <h1 className="text-2xl font-bold mb-4">🔍 ตรวจสอบข้อมูลใน Firebase</h1>

                    <div className="flex gap-4 mb-4">
                        <Button onClick={checkData} disabled={loading}>
                            {loading ? 'กำลังโหลด...' : '🔄 รีเฟรช'}
                        </Button>
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-600">
                                พบสินค้า: <strong>{products.length}</strong> รายการ
                            </span>
                        </div>
                    </div>

                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                            <p className="text-red-600">{error}</p>
                        </div>
                    )}
                </div>

                {products.length > 0 && (
                    <div className="space-y-4">
                        {products.map((product, index) => (
                            <div key={product.id} className="bg-white dark:bg-surface-dark rounded-xl p-6 border border-gray-200">
                                <div className="flex items-start gap-4">
                                    <div className="flex-shrink-0 w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                                        <span className="text-sm font-bold text-purple-600">{index + 1}</span>
                                    </div>

                                    <div className="flex-1 space-y-2">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <h3 className="font-bold text-lg">{product.title || 'ไม่มีชื่อ'}</h3>
                                                <p className="text-sm text-gray-500 font-mono">ID: {product.id}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-xl font-bold text-purple-600">
                                                    ฿{product.price?.toLocaleString() || '0'}
                                                </p>
                                                <span className={`text-xs px-2 py-1 rounded-full ${product.status === 'active'
                                                        ? 'bg-green-100 text-green-700'
                                                        : 'bg-gray-100 text-gray-700'
                                                    }`}>
                                                    {product.status || 'unknown'}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                            <div>
                                                <span className="text-gray-500">Seller ID:</span>
                                                <p className="font-mono text-xs truncate">{product.seller_id || '-'}</p>
                                            </div>
                                            <div>
                                                <span className="text-gray-500">Seller Name:</span>
                                                <p className="font-medium">{product.seller_name || '-'}</p>
                                            </div>
                                            <div>
                                                <span className="text-gray-500">Category:</span>
                                                <p className="font-medium">{product.category_id || '-'}</p>
                                            </div>
                                            <div>
                                                <span className="text-gray-500">Condition:</span>
                                                <p className="font-medium">{product.condition || '-'}</p>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                            <div>
                                                <span className="text-gray-500">Province:</span>
                                                <p className="font-medium">{product.province || product.location_province || '-'}</p>
                                            </div>
                                            <div>
                                                <span className="text-gray-500">Amphoe:</span>
                                                <p className="font-medium">{product.amphoe || product.location_amphoe || '-'}</p>
                                            </div>
                                            <div>
                                                <span className="text-gray-500">Slug:</span>
                                                <p className="font-mono text-xs truncate">{product.slug || '-'}</p>
                                            </div>
                                            <div>
                                                <span className="text-gray-500">Images:</span>
                                                <p className="font-medium">
                                                    {Array.isArray(product.images)
                                                        ? `${product.images.length} รูป`
                                                        : '-'}
                                                </p>
                                            </div>
                                        </div>

                                        {product.images && Array.isArray(product.images) && product.images.length > 0 && (
                                            <div>
                                                <span className="text-sm text-gray-500">รูปภาพ:</span>
                                                <div className="mt-2 flex gap-2 overflow-x-auto">
                                                    {product.images.map((img: any, idx: number) => {
                                                        const imageUrl = typeof img === 'string' ? img : img?.url
                                                        return imageUrl ? (
                                                            <div key={idx} className="flex-shrink-0">
                                                                <img
                                                                    src={imageUrl}
                                                                    alt={`Product ${idx + 1}`}
                                                                    className="w-24 h-24 object-cover rounded-lg border"
                                                                    onError={(e) => {
                                                                        (e.target as HTMLImageElement).src = '/placeholder-product.png'
                                                                    }}
                                                                />
                                                                <p className="text-xs text-gray-400 mt-1 truncate w-24">
                                                                    {typeof img === 'string' ? 'String' : 'Object'}
                                                                </p>
                                                            </div>
                                                        ) : null
                                                    })}
                                                </div>
                                            </div>
                                        )}

                                        <details className="text-xs">
                                            <summary className="cursor-pointer text-gray-500 hover:text-gray-700">
                                                ดูข้อมูลทั้งหมด (JSON)
                                            </summary>
                                            <pre className="mt-2 p-4 bg-gray-50 rounded-lg overflow-x-auto">
                                                {JSON.stringify(product, null, 2)}
                                            </pre>
                                        </details>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
