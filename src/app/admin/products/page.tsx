/**
 * Product Management Panel
 * Moderate, Approve, Reject, Suspend Products
 */
'use client'

import { useState, useEffect } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import { useAdmin } from '@/contexts/AdminContext'
import { canPerform } from '@/lib/rbac'
import Image from 'next/image'
import {
    Search,
    Filter,
    Eye,
    CheckCircle,
    XCircle,
    Ban,
    Flag,
    TrendingUp,
    Package,
    AlertTriangle
} from 'lucide-react'

interface Product {
    id: string
    title: string
    seller_name: string
    category: string
    price: number
    status: 'active' | 'pending' | 'suspended' | 'rejected'
    views_count: number
    sold_count: number
    reported_count: number
    thumbnail_url: string
    created_at: Date
}

export default function ProductsManagementPage() {
    const { adminUser } = useAdmin()
    const [products, setProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')
    const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'pending' | 'suspended'>('all')

    useEffect(() => {
        fetchProducts()
    }, [])

    const fetchProducts = async () => {
        // Mock data
        setTimeout(() => {
            setProducts([
                {
                    id: '1',
                    title: 'iPhone 15 Pro Max 256GB',
                    seller_name: 'ร้านมือถือมือสอง',
                    category: 'มือถือ',
                    price: 42900,
                    status: 'active',
                    views_count: 1234,
                    sold_count: 5,
                    reported_count: 0,
                    thumbnail_url: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=200',
                    created_at: new Date('2024-12-01')
                },
                {
                    id: '2',
                    title: 'สินค้ารอตรวจสอบ',
                    seller_name: 'ร้านใหม่',
                    category: 'อิเล็กทรอนิกส์',
                    price: 5900,
                    status: 'pending',
                    views_count: 45,
                    sold_count: 0,
                    reported_count: 0,
                    thumbnail_url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200',
                    created_at: new Date('2024-12-06')
                },
                {
                    id: '3',
                    title: 'สินค้าถูกรายงาน',
                    seller_name: 'ร้านปัญหา',
                    category: 'เสื้อผ้า',
                    price: 299,
                    status: 'active',
                    views_count: 567,
                    sold_count: 12,
                    reported_count: 5,
                    thumbnail_url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200',
                    created_at: new Date('2024-11-15')
                },
                {
                    id: '4',
                    title: 'สินค้าถูกระงับ',
                    seller_name: 'ร้านถูกแบน',
                    category: 'อื่นๆ',
                    price: 1200,
                    status: 'suspended',
                    views_count: 234,
                    sold_count: 3,
                    reported_count: 8,
                    thumbnail_url: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=200',
                    created_at: new Date('2024-10-20')
                }
            ])
            setLoading(false)
        }, 500)
    }

    const handleApprove = async (productId: string) => {
        if (!canPerform(adminUser, 'products.moderate')) {
            alert('คุณไม่มีสิทธิ์อนุมัติสินค้า')
            return
        }

        if (confirm('ยืนยันการอนุมัติสินค้า?')) {
            alert('อนุมัติสินค้าสำเร็จ')
            fetchProducts()
        }
    }

    const handleReject = async (productId: string) => {
        if (!canPerform(adminUser, 'products.moderate')) {
            alert('คุณไม่มีสิทธิ์ปฏิเสธสินค้า')
            return
        }

        const reason = prompt('เหตุผลในการปฏิเสธ:')
        if (reason) {
            alert('ปฏิเสธสินค้าสำเร็จ')
            fetchProducts()
        }
    }

    const handleSuspend = async (productId: string) => {
        if (!canPerform(adminUser, 'products.moderate')) {
            alert('คุณไม่มีสิทธิ์ระงับสินค้า')
            return
        }

        if (confirm('ยืนยันการระงับสินค้า?')) {
            alert('ระงับสินค้าสำเร็จ')
            fetchProducts()
        }
    }

    const filteredProducts = products.filter(product => {
        const matchesSearch =
            product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.seller_name.toLowerCase().includes(searchQuery.toLowerCase())

        const matchesStatus = filterStatus === 'all' || product.status === filterStatus

        return matchesSearch && matchesStatus
    })

    if (loading) {
        return (
            <AdminLayout>
                <div className="flex items-center justify-center h-96">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
                </div>
            </AdminLayout>
        )
    }

    return (
        <AdminLayout>
            <div className="space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                        จัดการสินค้า
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">
                        ทั้งหมด {filteredProducts.length} รายการ
                    </p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                                <Package className="w-5 h-5 text-green-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {products.filter(p => p.status === 'active').length}
                                </p>
                                <p className="text-xs text-gray-500">สินค้าใช้งาน</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                                <AlertTriangle className="w-5 h-5 text-yellow-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {products.filter(p => p.status === 'pending').length}
                                </p>
                                <p className="text-xs text-gray-500">รอตรวจสอบ</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                                <Flag className="w-5 h-5 text-red-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {products.filter(p => p.reported_count > 0).length}
                                </p>
                                <p className="text-xs text-gray-500">ถูกรายงาน</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                                <Ban className="w-5 h-5 text-gray-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {products.filter(p => p.status === 'suspended').length}
                                </p>
                                <p className="text-xs text-gray-500">ถูกระงับ</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="md:col-span-2">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="ค้นหาชื่อสินค้าหรือผู้ขาย..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                />
                            </div>
                        </div>
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value as any)}
                            className="px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        >
                            <option value="all">สถานะทั้งหมด</option>
                            <option value="active">ใช้งาน</option>
                            <option value="pending">รอตรวจสอบ</option>
                            <option value="suspended">ถูกระงับ</option>
                        </select>
                    </div>
                </div>

                {/* Products Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProducts.map((product) => (
                        <div
                            key={product.id}
                            className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-shadow"
                        >
                            {/* Image */}
                            <div className="relative aspect-square bg-gray-100 dark:bg-gray-700">
                                <Image
                                    src={product.thumbnail_url}
                                    alt={product.title}
                                    fill
                                    className="object-cover"
                                />
                                {/* Status Badge */}
                                <div className="absolute top-2 right-2">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${product.status === 'active'
                                            ? 'bg-green-100 text-green-700'
                                            : product.status === 'pending'
                                                ? 'bg-yellow-100 text-yellow-700'
                                                : product.status === 'suspended'
                                                    ? 'bg-red-100 text-red-700'
                                                    : 'bg-gray-100 text-gray-700'
                                        }`}>
                                        {product.status === 'active' ? 'ใช้งาน' : product.status === 'pending' ? 'รอตรวจ' : 'ระงับ'}
                                    </span>
                                </div>
                                {/* Reported Badge */}
                                {product.reported_count > 0 && (
                                    <div className="absolute top-2 left-2">
                                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-500 text-white flex items-center gap-1">
                                            <Flag className="w-3 h-3" />
                                            {product.reported_count}
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Content */}
                            <div className="p-4">
                                <h3 className="font-medium text-gray-900 dark:text-white mb-1 line-clamp-2">
                                    {product.title}
                                </h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                                    {product.seller_name}
                                </p>
                                <p className="text-lg font-bold text-purple-600 mb-3">
                                    ฿{product.price.toLocaleString()}
                                </p>

                                {/* Stats */}
                                <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400 mb-4">
                                    <div className="flex items-center gap-1">
                                        <Eye className="w-3 h-3" />
                                        {product.views_count}
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <TrendingUp className="w-3 h-3" />
                                        ขาย {product.sold_count}
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex gap-2">
                                    {product.status === 'pending' && (
                                        <>
                                            <button
                                                onClick={() => handleApprove(product.id)}
                                                className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors text-sm font-medium"
                                            >
                                                <CheckCircle className="w-4 h-4" />
                                                อนุมัติ
                                            </button>
                                            <button
                                                onClick={() => handleReject(product.id)}
                                                className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium"
                                            >
                                                <XCircle className="w-4 h-4" />
                                                ปฏิเสธ
                                            </button>
                                        </>
                                    )}
                                    {product.status === 'active' && (
                                        <>
                                            <button
                                                onClick={() => alert(`View product ${product.id}`)}
                                                className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 transition-colors text-sm font-medium"
                                            >
                                                <Eye className="w-4 h-4" />
                                                ดู
                                            </button>
                                            <button
                                                onClick={() => handleSuspend(product.id)}
                                                className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium"
                                            >
                                                <Ban className="w-4 h-4" />
                                                ระงับ
                                            </button>
                                        </>
                                    )}
                                    {product.status === 'suspended' && (
                                        <button
                                            onClick={() => handleApprove(product.id)}
                                            className="w-full flex items-center justify-center gap-1 px-3 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors text-sm font-medium"
                                        >
                                            <CheckCircle className="w-4 h-4" />
                                            ปลดระงับ
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </AdminLayout>
    )
}
