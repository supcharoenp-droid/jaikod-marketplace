'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import {
    Plus,
    Search,
    Edit,
    Trash2,
    Eye,
    MoreHorizontal,
    AlertCircle,
    Package
} from 'lucide-react'
import Button from '@/components/ui/Button'
import { useAuth } from '@/contexts/AuthContext'
import { getProductsBySeller, deleteProduct } from '@/lib/products'
import { Product } from '@/types'

export default function SellerProductsPage() {
    const { user } = useAuth()
    const router = useRouter()
    const [products, setProducts] = useState<Product[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')
    const [deletingId, setDeletingId] = useState<string | null>(null)

    useEffect(() => {
        const fetchProducts = async () => {
            if (!user) return
            try {
                setIsLoading(true)
                const data = await getProductsBySeller(user.uid)
                setProducts(data)
            } catch (error) {
                console.error('Error fetching seller products:', error)
            } finally {
                setIsLoading(false)
            }
        }

        fetchProducts()
    }, [user])

    const handleDelete = async (id: string | number) => {
        if (!confirm('คุณแน่ใจหรือไม่ว่าต้องการลบสินค้านี้? การกระทำนี้ไม่สามารถยกเลิกได้')) return

        // Ensure id is string
        const productId = String(id)

        try {
            setDeletingId(productId)
            await deleteProduct(productId)
            // Remove from list
            setProducts(prev => prev.filter(p => String(p.id) !== productId))
        } catch (error) {
            console.error('Error deleting product:', error)
            alert('เกิดข้อผิดพลาดในการลบสินค้า')
        } finally {
            setDeletingId(null)
        }
    }

    const filteredProducts = products.filter(p =>
        p.title.toLowerCase().includes(searchQuery.toLowerCase())
    )

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="w-8 h-8 border-4 border-neon-purple border-t-transparent rounded-full animate-spin"></div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">สินค้าของฉัน</h1>
                    <p className="text-text-secondary dark:text-gray-400">
                        จัดการสินค้าทั้งหมด {products.length} รายการ
                    </p>
                </div>
                <Link href="/sell">
                    <Button variant="primary">
                        <Plus className="w-5 h-5 mr-2" />
                        ลงขายสินค้าใหม่
                    </Button>
                </Link>
            </div>

            {/* Filter Bar */}
            <div className="bg-white dark:bg-surface-dark p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <input
                        type="text"
                        placeholder="ค้นหาชื่อสินค้ารหัสสินค้า..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-bg-dark focus:outline-none focus:ring-2 focus:ring-neon-purple"
                    />
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                </div>
                <div className="flex gap-2">
                    <select className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-bg-dark focus:outline-none focus:ring-2 focus:ring-neon-purple">
                        <option value="all">สถานะ: ทั้งหมด</option>
                        <option value="active">กำลังขาย</option>
                        <option value="sold">ขายแล้ว</option>
                        <option value="hidden">ซ่อน</option>
                    </select>
                </div>
            </div>

            {/* Products Table */}
            <div className="bg-white dark:bg-surface-dark rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
                {products.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                            <Package className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">ยังไม่มีสินค้า</h3>
                        <p className="text-gray-500 max-w-sm mb-6">
                            คุณยังไม่ได้ลงขายสินค้าใดๆ เริ่มต้นสร้างรายได้ด้วยการลงขายสินค้าชิ้นแรกของคุณ
                        </p>
                        <Link href="/sell">
                            <Button variant="primary">
                                <Plus className="w-5 h-5 mr-2" />
                                ลงขายสินค้า
                            </Button>
                        </Link>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 dark:bg-gray-800/50 text-text-secondary dark:text-gray-400 text-sm">
                                    <th className="p-4 font-medium pl-6">สินค้า</th>
                                    <th className="p-4 font-medium">ราคา</th>
                                    <th className="p-4 font-medium">สถานะ</th>
                                    <th className="p-4 font-medium">สถิติ</th>
                                    <th className="p-4 font-medium text-right pr-6">จัดการ</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                {filteredProducts.map((product) => (
                                    <tr key={product.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/20 transition-colors">
                                        <td className="p-4 pl-6">
                                            <div className="flex items-center gap-4">
                                                <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-200 dark:border-gray-700">
                                                    {product.images && product.images.length > 0 ? (
                                                        <Image
                                                            src={product.images[0].url}
                                                            alt={product.title}
                                                            fill
                                                            className="object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                            <Package className="w-6 h-6" />
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="min-w-0">
                                                    <h3 className="font-medium text-gray-900 dark:text-white truncate max-w-[200px] mb-1">
                                                        {product.title}
                                                    </h3>
                                                    <div className="text-xs text-gray-500">
                                                        ID: {product.id}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4 font-medium">
                                            ฿{product.price.toLocaleString()}
                                        </td>
                                        <td className="p-4">
                                            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300">
                                                กำลังขาย
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-4 text-sm text-gray-500">
                                                <div className="flex items-center gap-1" title="ยอดเข้าชม">
                                                    <Eye className="w-4 h-4" />
                                                    {product.views_count || 0}
                                                </div>
                                                {/* Add more stats here like favorites if available */}
                                            </div>
                                        </td>
                                        <td className="p-4 pr-6 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => window.open(`/product/${product.slug || product.id}`, '_blank')}
                                                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-gray-500 transition-colors"
                                                    title="ดูสินค้า"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </button>
                                                <Link href={`/sell?edit=${product.id}`}>
                                                    <button
                                                        className="p-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg text-blue-600 transition-colors"
                                                        title="แก้ไข"
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                    </button>
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(product.id)}
                                                    className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg text-red-600 transition-colors"
                                                    disabled={deletingId === String(product.id)}
                                                    title="ลบ"
                                                >
                                                    {deletingId === String(product.id) ? (
                                                        <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                                                    ) : (
                                                        <Trash2 className="w-4 h-4" />
                                                    )}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    )
}
