/**
 * Seller Management Panel
 * Approve KYC, View Wallets, Suspend Sellers
 */
'use client'

import { useState, useEffect } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import { useAdmin } from '@/contexts/AdminContext'
import { canPerform } from '@/lib/rbac'
import {
    Search,
    CheckCircle,
    XCircle,
    Eye,
    Wallet,
    Ban,
    Star,
    TrendingUp,
    Clock,
    Shield
} from 'lucide-react'

interface Seller {
    id: string
    shop_name: string
    email: string
    kyc_status: 'pending' | 'approved' | 'rejected'
    is_verified_seller: boolean
    is_suspended: boolean
    rating_score: number
    rating_count: number
    total_sales: number
    wallet_balance: number
    pending_withdrawal: number
    created_at: Date
}

export default function SellersManagementPage() {
    const { adminUser } = useAdmin()
    const [sellers, setSellers] = useState<Seller[]>([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')
    const [filterKYC, setFilterKYC] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all')

    useEffect(() => {
        fetchSellers()
    }, [])

    const fetchSellers = async () => {
        // Mock data
        setTimeout(() => {
            setSellers([
                {
                    id: '1',
                    shop_name: 'ร้านมือถือมือสอง',
                    email: 'seller1@example.com',
                    kyc_status: 'approved',
                    is_verified_seller: true,
                    is_suspended: false,
                    rating_score: 4.8,
                    rating_count: 234,
                    total_sales: 1250000,
                    wallet_balance: 45000,
                    pending_withdrawal: 0,
                    created_at: new Date('2024-02-15')
                },
                {
                    id: '2',
                    shop_name: 'ร้านของเล่นมือสอง',
                    email: 'seller2@example.com',
                    kyc_status: 'pending',
                    is_verified_seller: false,
                    is_suspended: false,
                    rating_score: 4.5,
                    rating_count: 89,
                    total_sales: 340000,
                    wallet_balance: 12000,
                    pending_withdrawal: 5000,
                    created_at: new Date('2024-11-20')
                },
                {
                    id: '3',
                    shop_name: 'ร้านถูกระงับ',
                    email: 'banned@example.com',
                    kyc_status: 'approved',
                    is_verified_seller: true,
                    is_suspended: true,
                    rating_score: 3.2,
                    rating_count: 45,
                    total_sales: 120000,
                    wallet_balance: 0,
                    pending_withdrawal: 0,
                    created_at: new Date('2024-08-10')
                }
            ])
            setLoading(false)
        }, 500)
    }

    const handleApproveKYC = async (sellerId: string) => {
        if (!canPerform(adminUser, 'sellers.approve_kyc')) {
            alert('คุณไม่มีสิทธิ์อนุมัติ KYC')
            return
        }

        if (confirm('ยืนยันการอนุมัติ KYC?')) {
            alert('อนุมัติ KYC สำเร็จ')
            fetchSellers()
        }
    }

    const handleRejectKYC = async (sellerId: string) => {
        if (!canPerform(adminUser, 'sellers.approve_kyc')) {
            alert('คุณไม่มีสิทธิ์ปฏิเสธ KYC')
            return
        }

        if (confirm('ยืนยันการปฏิเสธ KYC?')) {
            alert('ปฏิเสธ KYC สำเร็จ')
            fetchSellers()
        }
    }

    const handleSuspend = async (sellerId: string) => {
        if (!canPerform(adminUser, 'sellers.suspend')) {
            alert('คุณไม่มีสิทธิ์ระงับผู้ขาย')
            return
        }

        if (confirm('ยืนยันการระงับร้านค้า?')) {
            alert('ระงับร้านค้าสำเร็จ')
            fetchSellers()
        }
    }

    const filteredSellers = sellers.filter(seller => {
        const matchesSearch =
            seller.shop_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            seller.email.toLowerCase().includes(searchQuery.toLowerCase())

        const matchesKYC = filterKYC === 'all' || seller.kyc_status === filterKYC

        return matchesSearch && matchesKYC
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
                        จัดการผู้ขาย
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">
                        ทั้งหมด {filteredSellers.length} ร้านค้า
                    </p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                                <Clock className="w-5 h-5 text-yellow-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {sellers.filter(s => s.kyc_status === 'pending').length}
                                </p>
                                <p className="text-xs text-gray-500">รอตรวจสอบ KYC</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                                <CheckCircle className="w-5 h-5 text-green-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {sellers.filter(s => s.is_verified_seller).length}
                                </p>
                                <p className="text-xs text-gray-500">ยืนยันแล้ว</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                                <Ban className="w-5 h-5 text-red-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {sellers.filter(s => s.is_suspended).length}
                                </p>
                                <p className="text-xs text-gray-500">ถูกระงับ</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                                <TrendingUp className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                    ฿{(sellers.reduce((sum, s) => sum + s.total_sales, 0) / 1000000).toFixed(1)}M
                                </p>
                                <p className="text-xs text-gray-500">ยอดขายรวม</p>
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
                                    placeholder="ค้นหาชื่อร้านหรืออีเมล..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                />
                            </div>
                        </div>
                        <select
                            value={filterKYC}
                            onChange={(e) => setFilterKYC(e.target.value as any)}
                            className="px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        >
                            <option value="all">สถานะ KYC ทั้งหมด</option>
                            <option value="pending">รอตรวจสอบ</option>
                            <option value="approved">อนุมัติแล้ว</option>
                            <option value="rejected">ปฏิเสธ</option>
                        </select>
                    </div>
                </div>

                {/* Sellers Table */}
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                                        ร้านค้า
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                                        KYC
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                                        คะแนน
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                                        ยอดขาย
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                                        กระเป๋าเงิน
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                                        การกระทำ
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                {filteredSellers.map((seller) => (
                                    <tr key={seller.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold">
                                                    {seller.shop_name[0]}
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                                                            {seller.shop_name}
                                                        </p>
                                                        {seller.is_verified_seller && (
                                                            <Shield className="w-4 h-4 text-blue-500" />
                                                        )}
                                                    </div>
                                                    <p className="text-xs text-gray-500">{seller.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${seller.kyc_status === 'approved'
                                                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30'
                                                    : seller.kyc_status === 'pending'
                                                        ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30'
                                                        : 'bg-red-100 text-red-700 dark:bg-red-900/30'
                                                }`}>
                                                {seller.kyc_status === 'approved' ? 'อนุมัติ' : seller.kyc_status === 'pending' ? 'รอตรวจ' : 'ปฏิเสธ'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-1">
                                                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                                                <span className="text-sm font-medium">{seller.rating_score}</span>
                                                <span className="text-xs text-gray-500">({seller.rating_count})</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                                            ฿{seller.total_sales.toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm">
                                                <p className="font-medium text-gray-900 dark:text-white">
                                                    ฿{seller.wallet_balance.toLocaleString()}
                                                </p>
                                                {seller.pending_withdrawal > 0 && (
                                                    <p className="text-xs text-orange-600">
                                                        รอถอน: ฿{seller.pending_withdrawal.toLocaleString()}
                                                    </p>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end gap-2">
                                                {seller.kyc_status === 'pending' && (
                                                    <>
                                                        <button
                                                            onClick={() => handleApproveKYC(seller.id)}
                                                            className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg"
                                                            title="อนุมัติ KYC"
                                                        >
                                                            <CheckCircle className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleRejectKYC(seller.id)}
                                                            className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                                                            title="ปฏิเสธ KYC"
                                                        >
                                                            <XCircle className="w-4 h-4" />
                                                        </button>
                                                    </>
                                                )}
                                                <button
                                                    onClick={() => alert(`View seller ${seller.id}`)}
                                                    className="p-2 text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg"
                                                    title="ดูรายละเอียด"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </button>
                                                {!seller.is_suspended && (
                                                    <button
                                                        onClick={() => handleSuspend(seller.id)}
                                                        className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                                                        title="ระงับร้านค้า"
                                                    >
                                                        <Ban className="w-4 h-4" />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AdminLayout>
    )
}
