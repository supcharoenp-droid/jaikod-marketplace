/**
 * User Management Panel
 * View, Search, Ban/Unban Users
 */
'use client'

import { useState, useEffect } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import { useAdmin } from '@/contexts/AdminContext'
import { canPerform } from '@/lib/rbac'
import {
    Search,
    Filter,
    Download,
    Ban,
    CheckCircle,
    XCircle,
    Eye,
    MoreVertical,
    UserX,
    UserCheck
} from 'lucide-react'

interface User {
    id: string
    email: string
    displayName: string
    role: 'buyer' | 'seller' | 'admin'
    is_verified: boolean
    is_banned: boolean
    total_orders: number
    total_spent: number
    created_at: Date
    last_login?: Date
}

export default function UsersManagementPage() {
    const { adminUser } = useAdmin()
    const [users, setUsers] = useState<User[]>([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')
    const [filterRole, setFilterRole] = useState<'all' | 'buyer' | 'seller'>('all')
    const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'banned'>('all')

    useEffect(() => {
        fetchUsers()
    }, [])

    const fetchUsers = async () => {
        // Mock data for now
        setTimeout(() => {
            setUsers([
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
                }
            ])
            setLoading(false)
        }, 500)
    }

    const handleBanUser = async (userId: string) => {
        if (!canPerform(adminUser, 'users.ban')) {
            alert('คุณไม่มีสิทธิ์ระงับผู้ใช้')
            return
        }

        if (confirm('ยืนยันการระงับผู้ใช้นี้?')) {
            // API call here
            alert('ระงับผู้ใช้สำเร็จ')
            fetchUsers()
        }
    }

    const handleUnbanUser = async (userId: string) => {
        if (!canPerform(adminUser, 'users.unban')) {
            alert('คุณไม่มีสิทธิ์ปลดระงับผู้ใช้')
            return
        }

        if (confirm('ยืนยันการปลดระงับผู้ใช้นี้?')) {
            // API call here
            alert('ปลดระงับผู้ใช้สำเร็จ')
            fetchUsers()
        }
    }

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
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                            จัดการผู้ใช้
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400 mt-1">
                            ทั้งหมด {filteredUsers.length} ผู้ใช้
                        </p>
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                        <Download className="w-4 h-4" />
                        Export
                    </button>
                </div>

                {/* Filters */}
                <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        {/* Search */}
                        <div className="md:col-span-2">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="ค้นหาชื่อหรืออีเมล..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                />
                            </div>
                        </div>

                        {/* Role Filter */}
                        <select
                            value={filterRole}
                            onChange={(e) => setFilterRole(e.target.value as any)}
                            className="px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        >
                            <option value="all">ทุกบทบาท</option>
                            <option value="buyer">ผู้ซื้อ</option>
                            <option value="seller">ผู้ขาย</option>
                        </select>

                        {/* Status Filter */}
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value as any)}
                            className="px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        >
                            <option value="all">ทุกสถานะ</option>
                            <option value="active">ใช้งานปกติ</option>
                            <option value="banned">ถูกระงับ</option>
                        </select>
                    </div>
                </div>

                {/* Users Table */}
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        ผู้ใช้
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        บทบาท
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        สถานะ
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        คำสั่งซื้อ
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        ยอดใช้จ่าย
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        เข้าสู่ระบบล่าสุด
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        การกระทำ
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                {filteredUsers.map((user) => (
                                    <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
                                                    {user.displayName[0]}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                                                        {user.displayName}
                                                    </p>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                                        {user.email}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${user.role === 'seller'
                                                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                                                    : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                                                }`}>
                                                {user.role === 'seller' ? 'ผู้ขาย' : 'ผู้ซื้อ'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-2">
                                                {user.is_banned ? (
                                                    <>
                                                        <XCircle className="w-4 h-4 text-red-500" />
                                                        <span className="text-sm text-red-600 dark:text-red-400">ระงับ</span>
                                                    </>
                                                ) : user.is_verified ? (
                                                    <>
                                                        <CheckCircle className="w-4 h-4 text-green-500" />
                                                        <span className="text-sm text-green-600 dark:text-green-400">ยืนยันแล้ว</span>
                                                    </>
                                                ) : (
                                                    <span className="text-sm text-gray-500">ยังไม่ยืนยัน</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                            {user.total_orders}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                            ฿{user.total_spent.toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                            {user.last_login?.toLocaleDateString('th-TH')}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => alert(`View user ${user.id}`)}
                                                    className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg transition-colors"
                                                    title="ดูรายละเอียด"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </button>
                                                {user.is_banned ? (
                                                    <button
                                                        onClick={() => handleUnbanUser(user.id)}
                                                        className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                                                        title="ปลดระงับ"
                                                    >
                                                        <UserCheck className="w-4 h-4" />
                                                    </button>
                                                ) : (
                                                    <button
                                                        onClick={() => handleBanUser(user.id)}
                                                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                                        title="ระงับผู้ใช้"
                                                    >
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
            </div>
        </AdminLayout>
    )
}
