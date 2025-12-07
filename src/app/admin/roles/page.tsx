'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
    ArrowLeft, Users, Shield, Search, Filter, MoreVertical,
    ChevronDown, Check, X, Crown, Sparkles, Zap, AlertTriangle,
    UserCheck, UserX, Edit, Trash2, Eye, RefreshCw, Download
} from 'lucide-react'
import Button from '@/components/ui/Button'
import { ROLES, STAFF_ROLES, UserRole, StaffRole } from '@/lib/roles'

// Mock Users Data
const MOCK_USERS = [
    { id: '1', email: 'somchai@gmail.com', name: 'สมชาย มั่งมี', role: 'shop_premium' as UserRole, staffRole: null, status: 'active', joinDate: '2024-01-15', lastActive: '2024-12-06', totalSales: 156, revenue: 245000 },
    { id: '2', email: 'somsri@gmail.com', name: 'สมศรี รักขาย', role: 'shop_verified' as UserRole, staffRole: null, status: 'active', joinDate: '2024-03-22', lastActive: '2024-12-05', totalSales: 89, revenue: 67000 },
    { id: '3', email: 'john@company.com', name: 'John Admin', role: 'staff' as UserRole, staffRole: 'staff_cs' as StaffRole, status: 'active', joinDate: '2024-02-01', lastActive: '2024-12-06', totalSales: 0, revenue: 0 },
    { id: '4', email: 'seller001@mail.com', name: 'ร้านค้า ABC', role: 'seller_plus' as UserRole, staffRole: null, status: 'active', joinDate: '2024-06-10', lastActive: '2024-12-04', totalSales: 45, revenue: 32000 },
    { id: '5', email: 'newuser@mail.com', name: 'ผู้ใช้ใหม่', role: 'buyer' as UserRole, staffRole: null, status: 'active', joinDate: '2024-11-28', lastActive: '2024-12-06', totalSales: 0, revenue: 0 },
    { id: '6', email: 'suspended@mail.com', name: 'บัญชีระงับ', role: 'seller_basic' as UserRole, staffRole: null, status: 'suspended', joinDate: '2024-05-15', lastActive: '2024-11-20', totalSales: 12, revenue: 8500 },
    { id: '7', email: 'fraud@mail.com', name: 'มิจฉาชีพ', role: 'seller_basic' as UserRole, staffRole: null, status: 'banned', joinDate: '2024-08-01', lastActive: '2024-10-15', totalSales: 3, revenue: 0 },
]

export default function RoleManagementPage() {
    const [searchQuery, setSearchQuery] = useState('')
    const [filterRole, setFilterRole] = useState<UserRole | 'all'>('all')
    const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'suspended' | 'banned'>('all')
    const [selectedUser, setSelectedUser] = useState<typeof MOCK_USERS[0] | null>(null)
    const [showRoleModal, setShowRoleModal] = useState(false)

    // Filter users
    const filteredUsers = MOCK_USERS.filter(user => {
        const matchesSearch =
            user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesRole = filterRole === 'all' || user.role === filterRole
        const matchesStatus = filterStatus === 'all' || user.status === filterStatus
        return matchesSearch && matchesRole && matchesStatus
    })

    const getRoleBadge = (role: UserRole) => {
        const config = ROLES[role]
        return (
            <span
                className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium"
                style={{ backgroundColor: `${config.color}20`, color: config.color }}
            >
                {config.icon} {config.name_th}
            </span>
        )
    }

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'active':
                return <span className="px-2 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">Active</span>
            case 'suspended':
                return <span className="px-2 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700">ระงับชั่วคราว</span>
            case 'banned':
                return <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">ถูกแบน</span>
            default:
                return null
        }
    }

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
            {/* Header */}
            <header className="sticky top-0 z-40 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/admin" className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <div>
                            <h1 className="text-xl font-bold">จัดการสิทธิ์ผู้ใช้</h1>
                            <p className="text-sm text-gray-500">Role-Based Access Control (RBAC)</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button variant="outline" size="sm">
                            <Download className="w-4 h-4 mr-2" />
                            Export
                        </Button>
                        <Button variant="outline" size="sm">
                            <RefreshCw className="w-4 h-4 mr-2" />
                            Refresh
                        </Button>
                    </div>
                </div>
            </header>

            <main className="p-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6">
                    {Object.entries(ROLES).slice(1, 7).map(([key, role]) => {
                        const count = MOCK_USERS.filter(u => u.role === key).length
                        return (
                            <div
                                key={key}
                                className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700"
                            >
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="text-xl">{role.icon}</span>
                                    <span className="text-sm font-medium text-gray-500">{role.name_th}</span>
                                </div>
                                <div className="text-2xl font-bold" style={{ color: role.color }}>{count}</div>
                            </div>
                        )
                    })}
                </div>

                {/* Filters */}
                <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700 mb-6">
                    <div className="flex flex-wrap items-center gap-4">
                        {/* Search */}
                        <div className="relative flex-1 min-w-[200px]">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="ค้นหาชื่อ, อีเมล..."
                                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-sm focus:ring-2 focus:ring-neon-purple outline-none"
                            />
                        </div>

                        {/* Role Filter */}
                        <div className="relative">
                            <select
                                value={filterRole}
                                onChange={(e) => setFilterRole(e.target.value as UserRole | 'all')}
                                className="appearance-none bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2 pr-10 text-sm focus:ring-2 focus:ring-neon-purple outline-none"
                            >
                                <option value="all">ทุก Role</option>
                                {Object.entries(ROLES).map(([key, role]) => (
                                    <option key={key} value={key}>{role.icon} {role.name_th}</option>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                        </div>

                        {/* Status Filter */}
                        <div className="relative">
                            <select
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value as any)}
                                className="appearance-none bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2 pr-10 text-sm focus:ring-2 focus:ring-neon-purple outline-none"
                            >
                                <option value="all">ทุกสถานะ</option>
                                <option value="active">Active</option>
                                <option value="suspended">ระงับชั่วคราว</option>
                                <option value="banned">ถูกแบน</option>
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                        </div>
                    </div>
                </div>

                {/* Users Table */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-gray-50 dark:bg-gray-900 text-left text-sm text-gray-500">
                                    <th className="p-4 font-medium">ผู้ใช้</th>
                                    <th className="p-4 font-medium">Role</th>
                                    <th className="p-4 font-medium">สถานะ</th>
                                    <th className="p-4 font-medium">สมัครเมื่อ</th>
                                    <th className="p-4 font-medium">ยอดขาย</th>
                                    <th className="p-4 font-medium">รายได้</th>
                                    <th className="p-4 font-medium text-right">จัดการ</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredUsers.map((user) => (
                                    <tr key={user.id} className="border-t border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900/50">
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-neon-purple to-coral-orange flex items-center justify-center text-white font-bold">
                                                    {user.name[0]}
                                                </div>
                                                <div>
                                                    <div className="font-medium">{user.name}</div>
                                                    <div className="text-sm text-gray-500">{user.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4">{getRoleBadge(user.role)}</td>
                                        <td className="p-4">{getStatusBadge(user.status)}</td>
                                        <td className="p-4 text-sm text-gray-500">{user.joinDate}</td>
                                        <td className="p-4 font-medium">{user.totalSales} รายการ</td>
                                        <td className="p-4 font-medium text-emerald-600">฿{user.revenue.toLocaleString()}</td>
                                        <td className="p-4">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => { setSelectedUser(user); setShowRoleModal(true) }}
                                                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-blue-500"
                                                    title="เปลี่ยน Role"
                                                >
                                                    <Shield className="w-4 h-4" />
                                                </button>
                                                <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-gray-500" title="ดูรายละเอียด">
                                                    <Eye className="w-4 h-4" />
                                                </button>
                                                {user.status === 'active' ? (
                                                    <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-amber-500" title="ระงับบัญชี">
                                                        <UserX className="w-4 h-4" />
                                                    </button>
                                                ) : (
                                                    <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-emerald-500" title="เปิดใช้งาน">
                                                        <UserCheck className="w-4 h-4" />
                                                    </button>
                                                )}
                                                <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-red-500" title="ลบบัญชี">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="border-t border-gray-100 dark:border-gray-700 px-4 py-3 flex items-center justify-between">
                        <div className="text-sm text-gray-500">
                            แสดง {filteredUsers.length} จาก {MOCK_USERS.length} รายการ
                        </div>
                        <div className="flex gap-2">
                            <Button variant="outline" size="sm" disabled>ก่อนหน้า</Button>
                            <Button variant="outline" size="sm">หน้า 1</Button>
                            <Button variant="outline" size="sm" disabled>ถัดไป</Button>
                        </div>
                    </div>
                </div>
            </main>

            {/* Role Change Modal */}
            {showRoleModal && selectedUser && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-lg mx-4 shadow-2xl">
                        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                            <h2 className="text-xl font-bold">เปลี่ยน Role</h2>
                            <p className="text-sm text-gray-500 mt-1">
                                {selectedUser.name} ({selectedUser.email})
                            </p>
                        </div>
                        <div className="p-6">
                            <div className="mb-4">
                                <label className="text-sm font-medium text-gray-500 block mb-2">Role ปัจจุบัน</label>
                                {getRoleBadge(selectedUser.role)}
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-500 block mb-2">เลือก Role ใหม่</label>
                                <div className="grid grid-cols-2 gap-2">
                                    {Object.entries(ROLES).slice(1, 7).map(([key, role]) => (
                                        <button
                                            key={key}
                                            className={`p-3 rounded-lg border-2 text-left transition-all ${selectedUser.role === key
                                                    ? 'border-neon-purple bg-neon-purple/5'
                                                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                                                }`}
                                        >
                                            <div className="flex items-center gap-2">
                                                <span className="text-xl">{role.icon}</span>
                                                <span className="font-medium text-sm">{role.name_th}</span>
                                            </div>
                                            <div className="text-xs text-gray-500 mt-1">Level {role.level}</div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Warning */}
                            <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                                <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400">
                                    <AlertTriangle className="w-4 h-4" />
                                    <span className="text-sm font-medium">การเปลี่ยน Role จะถูกบันทึกลง Audit Log</span>
                                </div>
                            </div>
                        </div>
                        <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3">
                            <Button variant="outline" onClick={() => setShowRoleModal(false)}>
                                ยกเลิก
                            </Button>
                            <Button variant="primary" onClick={() => setShowRoleModal(false)}>
                                <Check className="w-4 h-4 mr-2" />
                                บันทึกการเปลี่ยนแปลง
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
