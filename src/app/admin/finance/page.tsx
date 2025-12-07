/**
 * Finance Management Panel
 * Withdrawals, Commission, Reports
 */
'use client'

import { useState, useEffect } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import { useAdmin } from '@/contexts/AdminContext'
import { canPerform } from '@/lib/rbac'
import {
    DollarSign,
    TrendingUp,
    TrendingDown,
    Download,
    CheckCircle,
    XCircle,
    Clock,
    Wallet,
    CreditCard
} from 'lucide-react'

interface Withdrawal {
    id: string
    seller_name: string
    amount: number
    bank_account: string
    status: 'pending' | 'approved' | 'rejected' | 'completed'
    requested_at: Date
    processed_at?: Date
}

export default function FinanceManagementPage() {
    const { adminUser } = useAdmin()
    const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([])
    const [loading, setLoading] = useState(true)
    const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'approved' | 'completed'>('all')

    const stats = {
        total_gmv: 12456789,
        platform_revenue: 623456,
        pending_withdrawals: 234567,
        completed_withdrawals: 1890234,
        commission_rate: 5
    }

    useEffect(() => {
        fetchWithdrawals()
    }, [])

    const fetchWithdrawals = async () => {
        // Mock data
        setTimeout(() => {
            setWithdrawals([
                {
                    id: '1',
                    seller_name: 'ร้านมือถือมือสอง',
                    amount: 45000,
                    bank_account: 'xxx-x-x1234-x',
                    status: 'pending',
                    requested_at: new Date('2024-12-06')
                },
                {
                    id: '2',
                    seller_name: 'ร้านของเล่น',
                    amount: 12000,
                    bank_account: 'xxx-x-x5678-x',
                    status: 'approved',
                    requested_at: new Date('2024-12-05'),
                    processed_at: new Date('2024-12-06')
                },
                {
                    id: '3',
                    seller_name: 'ร้านเสื้อผ้า',
                    amount: 8500,
                    bank_account: 'xxx-x-x9012-x',
                    status: 'completed',
                    requested_at: new Date('2024-12-04'),
                    processed_at: new Date('2024-12-05')
                }
            ])
            setLoading(false)
        }, 500)
    }

    const handleApprove = async (withdrawalId: string) => {
        if (!canPerform(adminUser, 'finance.approve_withdrawals')) {
            alert('คุณไม่มีสิทธิ์อนุมัติการถอนเงิน')
            return
        }

        if (confirm('ยืนยันการอนุมัติการถอนเงิน?')) {
            alert('อนุมัติการถอนเงินสำเร็จ')
            fetchWithdrawals()
        }
    }

    const handleReject = async (withdrawalId: string) => {
        if (!canPerform(adminUser, 'finance.approve_withdrawals')) {
            alert('คุณไม่มีสิทธิ์ปฏิเสธการถอนเงิน')
            return
        }

        const reason = prompt('เหตุผลในการปฏิเสธ:')
        if (reason) {
            alert('ปฏิเสธการถอนเงินสำเร็จ')
            fetchWithdrawals()
        }
    }

    const filteredWithdrawals = withdrawals.filter(w =>
        filterStatus === 'all' || w.status === filterStatus
    )

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
                            การเงิน
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400 mt-1">
                            ภาพรวมการเงินแพลตฟอร์ม
                        </p>
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                        <Download className="w-4 h-4" />
                        Export รายงาน
                    </button>
                </div>

                {/* Financial Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl p-6 text-white">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-2 bg-white/20 rounded-lg">
                                <TrendingUp className="w-6 h-6" />
                            </div>
                            <span className="text-xs bg-white/20 px-2 py-1 rounded-full">
                                +15.7%
                            </span>
                        </div>
                        <p className="text-sm opacity-90 mb-1">GMV (ยอดขายรวม)</p>
                        <p className="text-3xl font-bold">
                            ฿{(stats.total_gmv / 1000000).toFixed(1)}M
                        </p>
                    </div>

                    <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl p-6 text-white">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-2 bg-white/20 rounded-lg">
                                <DollarSign className="w-6 h-6" />
                            </div>
                            <span className="text-xs bg-white/20 px-2 py-1 rounded-full">
                                {stats.commission_rate}%
                            </span>
                        </div>
                        <p className="text-sm opacity-90 mb-1">รายได้แพลตฟอร์ม</p>
                        <p className="text-3xl font-bold">
                            ฿{(stats.platform_revenue / 1000).toFixed(0)}K
                        </p>
                    </div>

                    <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl p-6 text-white">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-2 bg-white/20 rounded-lg">
                                <Clock className="w-6 h-6" />
                            </div>
                            <span className="text-xs bg-white/20 px-2 py-1 rounded-full">
                                {withdrawals.filter(w => w.status === 'pending').length}
                            </span>
                        </div>
                        <p className="text-sm opacity-90 mb-1">รอถอนเงิน</p>
                        <p className="text-3xl font-bold">
                            ฿{(stats.pending_withdrawals / 1000).toFixed(0)}K
                        </p>
                    </div>

                    <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl p-6 text-white">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-2 bg-white/20 rounded-lg">
                                <CheckCircle className="w-6 h-6" />
                            </div>
                        </div>
                        <p className="text-sm opacity-90 mb-1">ถอนเงินสำเร็จ</p>
                        <p className="text-3xl font-bold">
                            ฿{(stats.completed_withdrawals / 1000000).toFixed(1)}M
                        </p>
                    </div>
                </div>

                {/* Withdrawals Section */}
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                    <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                                คำขอถอนเงิน
                            </h2>
                            <select
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value as any)}
                                className="px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                            >
                                <option value="all">ทั้งหมด</option>
                                <option value="pending">รอดำเนินการ</option>
                                <option value="approved">อนุมัติแล้ว</option>
                                <option value="completed">สำเร็จ</option>
                            </select>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                                        ผู้ขาย
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                                        จำนวนเงิน
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                                        บัญชีธนาคาร
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                                        สถานะ
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                                        วันที่ขอ
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                                        การกระทำ
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                {filteredWithdrawals.map((withdrawal) => (
                                    <tr key={withdrawal.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold">
                                                    {withdrawal.seller_name[0]}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                                                        {withdrawal.seller_name}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <p className="text-lg font-bold text-gray-900 dark:text-white">
                                                ฿{withdrawal.amount.toLocaleString()}
                                            </p>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                                <CreditCard className="w-4 h-4" />
                                                {withdrawal.bank_account}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${withdrawal.status === 'completed'
                                                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30'
                                                    : withdrawal.status === 'approved'
                                                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30'
                                                        : withdrawal.status === 'pending'
                                                            ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30'
                                                            : 'bg-red-100 text-red-700 dark:bg-red-900/30'
                                                }`}>
                                                {withdrawal.status === 'completed' ? 'สำเร็จ' :
                                                    withdrawal.status === 'approved' ? 'อนุมัติแล้ว' :
                                                        withdrawal.status === 'pending' ? 'รอดำเนินการ' : 'ปฏิเสธ'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                            {withdrawal.requested_at.toLocaleDateString('th-TH')}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right">
                                            {withdrawal.status === 'pending' && (
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => handleApprove(withdrawal.id)}
                                                        className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                                                        title="อนุมัติ"
                                                    >
                                                        <CheckCircle className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleReject(withdrawal.id)}
                                                        className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                                        title="ปฏิเสธ"
                                                    >
                                                        <XCircle className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            )}
                                            {withdrawal.status === 'approved' && (
                                                <span className="text-sm text-blue-600 dark:text-blue-400">
                                                    กำลังโอนเงิน...
                                                </span>
                                            )}
                                            {withdrawal.status === 'completed' && (
                                                <span className="text-sm text-green-600 dark:text-green-400">
                                                    โอนเงินแล้ว
                                                </span>
                                            )}
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
