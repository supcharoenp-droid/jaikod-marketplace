/**
 * Test Sellers Management Page (No Auth)
 */
'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
    Search,
    CheckCircle,
    XCircle,
    Eye,
    Ban,
    Star,
    Clock,
    Shield,
    Menu,
    X,
    Store,
    TrendingUp
} from 'lucide-react'

export default function TestSellersPage() {
    const [sidebarOpen, setSidebarOpen] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')
    const [filterKYC, setFilterKYC] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all')

    const sellers = [
        {
            id: '1',
            shop_name: 'ร้านมือถือมือสอง',
            email: 'seller1@example.com',
            kyc_status: 'approved' as const,
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
            kyc_status: 'pending' as const,
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
            kyc_status: 'approved' as const,
            is_verified_seller: true,
            is_suspended: true,
            rating_score: 3.2,
            rating_count: 45,
            total_sales: 120000,
            wallet_balance: 0,
            pending_withdrawal: 0,
            created_at: new Date('2024-08-10')
        }
    ]

    const filteredSellers = sellers.filter(seller => {
        const matchesSearch =
            seller.shop_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            seller.email.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesKYC = filterKYC === 'all' || seller.kyc_status === filterKYC
        return matchesSearch && matchesKYC
    })

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="bg-yellow-500 text-white px-4 py-2 text-center text-sm font-medium">
                ⚠️ TEST MODE - Sellers Management Preview
            </div>

            <aside className={`fixed top-0 left-0 z-40 h-screen transition-transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} w-64 bg-white border-r mt-10`}>
                <div className="p-4 border-b">
                    <Link href="/test-admin" className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-white font-bold">J</div>
                        <span className="font-bold text-lg">JaiKod Admin</span>
                    </Link>
                </div>
                <nav className="p-4 space-y-2">
                    <Link href="/test-admin/dashboard" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg text-gray-700 hover:bg-gray-100">Dashboard</Link>
                    <Link href="/test-admin/users" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg text-gray-700 hover:bg-gray-100">Users</Link>
                    <Link href="/test-admin/sellers" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg bg-purple-50 text-purple-600">
                        <Store className="w-5 h-5" />
                        Sellers
                    </Link>
                </nav>
            </aside>

            <div className={`${sidebarOpen ? 'ml-64' : 'ml-0'} transition-all mt-10`}>
                <header className="h-16 bg-white border-b flex items-center justify-between px-6">
                    <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 rounded-lg hover:bg-gray-100">
                        {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>
                </header>

                <main className="p-6 space-y-6">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">จัดการผู้ขาย</h1>
                        <p className="text-gray-500 mt-1">ทั้งหมด {filteredSellers.length} ร้านค้า</p>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="bg-white rounded-xl p-4 border">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-yellow-100 rounded-lg">
                                    <Clock className="w-5 h-5 text-yellow-600" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold">{sellers.filter(s => s.kyc_status === 'pending').length}</p>
                                    <p className="text-xs text-gray-500">รอตรวจสอบ KYC</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white rounded-xl p-4 border">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-green-100 rounded-lg">
                                    <CheckCircle className="w-5 h-5 text-green-600" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold">{sellers.filter(s => s.is_verified_seller).length}</p>
                                    <p className="text-xs text-gray-500">ยืนยันแล้ว</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white rounded-xl p-4 border">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-red-100 rounded-lg">
                                    <Ban className="w-5 h-5 text-red-600" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold">{sellers.filter(s => s.is_suspended).length}</p>
                                    <p className="text-xs text-gray-500">ถูกระงับ</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white rounded-xl p-4 border">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-100 rounded-lg">
                                    <TrendingUp className="w-5 h-5 text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold">฿{(sellers.reduce((sum, s) => sum + s.total_sales, 0) / 1000000).toFixed(1)}M</p>
                                    <p className="text-xs text-gray-500">ยอดขายรวม</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="bg-white rounded-xl p-4 border">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="md:col-span-2 relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="ค้นหาชื่อร้านหรืออีเมล..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                />
                            </div>
                            <select value={filterKYC} onChange={(e) => setFilterKYC(e.target.value as any)} className="px-4 py-2 border rounded-lg">
                                <option value="all">สถานะ KYC ทั้งหมด</option>
                                <option value="pending">รอตรวจสอบ</option>
                                <option value="approved">อนุมัติแล้ว</option>
                                <option value="rejected">ปฏิเสธ</option>
                            </select>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="bg-white rounded-xl border overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ร้านค้า</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">KYC</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">คะแนน</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ยอดขาย</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">กระเป๋าเงิน</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">การกระทำ</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {filteredSellers.map((seller) => (
                                    <tr key={seller.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold">
                                                    {seller.shop_name[0]}
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <p className="text-sm font-medium">{seller.shop_name}</p>
                                                        {seller.is_verified_seller && <Shield className="w-4 h-4 text-blue-500" />}
                                                    </div>
                                                    <p className="text-xs text-gray-500">{seller.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${seller.kyc_status === 'approved' ? 'bg-green-100 text-green-700' :
                                                    seller.kyc_status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                                        'bg-red-100 text-red-700'
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
                                        <td className="px-6 py-4 text-sm">฿{seller.total_sales.toLocaleString()}</td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm">
                                                <p className="font-medium">฿{seller.wallet_balance.toLocaleString()}</p>
                                                {seller.pending_withdrawal > 0 && (
                                                    <p className="text-xs text-orange-600">รอถอน: ฿{seller.pending_withdrawal.toLocaleString()}</p>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end gap-2">
                                                {seller.kyc_status === 'pending' && (
                                                    <>
                                                        <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg" title="อนุมัติ KYC">
                                                            <CheckCircle className="w-4 h-4" />
                                                        </button>
                                                        <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg" title="ปฏิเสธ KYC">
                                                            <XCircle className="w-4 h-4" />
                                                        </button>
                                                    </>
                                                )}
                                                <button className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg" title="ดูรายละเอียด">
                                                    <Eye className="w-4 h-4" />
                                                </button>
                                                {!seller.is_suspended && (
                                                    <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg" title="ระงับร้านค้า">
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
                </main>
            </div>
        </div>
    )
}
