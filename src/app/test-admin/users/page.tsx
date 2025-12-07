/**
 * Test Users Management Page (No Auth)
 */
'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
    Search,
    Download,
    Eye,
    UserX,
    UserCheck,
    CheckCircle,
    XCircle,
    Menu,
    X,
    Users as UsersIcon
} from 'lucide-react'

interface User {
    id: string
    email: string
    displayName: string
    role: 'buyer' | 'seller'
    is_verified: boolean
    is_banned: boolean
    total_orders: number
    total_spent: number
    created_at: Date
    last_login?: Date
}

export default function TestUsersPage() {
    const [sidebarOpen, setSidebarOpen] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')
    const [filterRole, setFilterRole] = useState<'all' | 'buyer' | 'seller'>('all')
    const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'banned'>('all')

    const users: User[] = [
        {
            id: '1',
            email: 'user1@example.com',
            displayName: 'สมชาย ใจดี',
            role: 'buyer',
            is_verified: true,
            is_banned: false,
            total_orders: 15,
            total_spent: 45000,
            created_at: new Date('2024-01-15'),
            last_login: new Date('2024-12-06')
        },
        {
            id: '2',
            email: 'seller1@example.com',
            displayName: 'ร้านมือถือมือสอง',
            role: 'seller',
            is_verified: true,
            is_banned: false,
            total_orders: 234,
            total_spent: 0,
            created_at: new Date('2024-02-20'),
            last_login: new Date('2024-12-07')
        },
        {
            id: '3',
            email: 'banned@example.com',
            displayName: 'ผู้ใช้ถูกระงับ',
            role: 'buyer',
            is_verified: false,
            is_banned: true,
            total_orders: 2,
            total_spent: 1200,
            created_at: new Date('2024-11-01'),
            last_login: new Date('2024-11-15')
        },
        {
            id: '4',
            email: 'newuser@example.com',
            displayName: 'ผู้ใช้ใหม่',
            role: 'buyer',
            is_verified: false,
            is_banned: false,
            total_orders: 0,
            total_spent: 0,
            created_at: new Date('2024-12-05'),
            last_login: new Date('2024-12-07')
        }
    ]

    const filteredUsers = users.filter(user => {
        const matchesSearch =
            user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.displayName.toLowerCase().includes(searchQuery.toLowerCase())

        const matchesRole = filterRole === 'all' || user.role === filterRole
        const matchesStatus =
            filterStatus === 'all' ||
            (filterStatus === 'banned' && user.is_banned) ||
            (filterStatus === 'active' && !user.is_banned)

        return matchesSearch && matchesRole && matchesStatus
    })

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Test Mode Banner */}
            <div className="bg-yellow-500 text-white px-4 py-2 text-center text-sm font-medium">
                ⚠️ TEST MODE - Users Management Preview
            </div>

            {/* Sidebar */}
            <aside className={`fixed top-0 left-0 z-40 h-screen transition-transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                } w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 mt-10`}>
                <div className="p-4 border-b">
                    <Link href="/test-admin" className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-white font-bold">J</div>
                        <span className="font-bold text-lg">JaiKod Admin</span>
                    </Link>
                </div>
                <nav className="p-4 space-y-2">
                    <Link href="/test-admin/dashboard" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100">Dashboard</Link>
                    <Link href="/test-admin/users" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg bg-purple-50 text-purple-600">
                        <UsersIcon className="w-5 h-5" />
                        จัดการผู้ใช้
                    </Link>
                </nav>
            </aside>

            {/* Main */}
            <div className={`${sidebarOpen ? 'ml-64' : 'ml-0'} transition-all mt-10`}>
                <header className="h-16 bg-white border-b flex items-center justify-between px-6">
                    <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 rounded-lg hover:bg-gray-100">
                        {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>
                </header>

                <main className="p-6 space-y-6">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">จัดการผู้ใช้</h1>
                            <p className="text-gray-500 mt-1">ทั้งหมด {filteredUsers.length} ผู้ใช้</p>
                        </div>
                        <button className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                            <Download className="w-4 h-4" />
                            Export
                        </button>
                    </div>

                    {/* Filters */}
                    <div className="bg-white rounded-xl p-4 border">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div className="md:col-span-2 relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="ค้นหาชื่อหรืออีเมล..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                />
                            </div>
                            <select value={filterRole} onChange={(e) => setFilterRole(e.target.value as any)} className="px-4 py-2 border rounded-lg">
                                <option value="all">ทุกบทบาท</option>
                                <option value="buyer">ผู้ซื้อ</option>
                                <option value="seller">ผู้ขาย</option>
                            </select>
                            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value as any)} className="px-4 py-2 border rounded-lg">
                                <option value="all">ทุกสถานะ</option>
                                <option value="active">ใช้งานปกติ</option>
                                <option value="banned">ถูกระงับ</option>
                            </select>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="bg-white rounded-xl border overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ผู้ใช้</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">บทบาท</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">สถานะ</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">คำสั่งซื้อ</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ยอดใช้จ่าย</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">เข้าสู่ระบบล่าสุด</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">การกระทำ</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {filteredUsers.map((user) => (
                                        <tr key={user.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
                                                        {user.displayName[0]}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-900">{user.displayName}</p>
                                                        <p className="text-xs text-gray-500">{user.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${user.role === 'seller' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
                                                    }`}>
                                                    {user.role === 'seller' ? 'ผู้ขาย' : 'ผู้ซื้อ'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    {user.is_banned ? (
                                                        <>
                                                            <XCircle className="w-4 h-4 text-red-500" />
                                                            <span className="text-sm text-red-600">ระงับ</span>
                                                        </>
                                                    ) : user.is_verified ? (
                                                        <>
                                                            <CheckCircle className="w-4 h-4 text-green-500" />
                                                            <span className="text-sm text-green-600">ยืนยันแล้ว</span>
                                                        </>
                                                    ) : (
                                                        <span className="text-sm text-gray-500">ยังไม่ยืนยัน</span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm">{user.total_orders}</td>
                                            <td className="px-6 py-4 text-sm">฿{user.total_spent.toLocaleString()}</td>
                                            <td className="px-6 py-4 text-sm text-gray-500">
                                                {user.last_login?.toLocaleDateString('th-TH')}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg" title="ดูรายละเอียด">
                                                        <Eye className="w-4 h-4" />
                                                    </button>
                                                    {user.is_banned ? (
                                                        <button className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg" title="ปลดระงับ">
                                                            <UserCheck className="w-4 h-4" />
                                                        </button>
                                                    ) : (
                                                        <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg" title="ระงับผู้ใช้">
                                                            <UserX className="w-4 h-4" />
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
                </main>
            </div>
        </div>
    )
}
