'use client'

import { useState, useEffect } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import {
    ShieldAlert, Search, CheckCircle, XCircle, AlertTriangle,
    Flag, User, Package, MessageSquare, Zap
} from 'lucide-react'
import { useAdmin } from '@/contexts/AdminContext'
import { getModerationFlags, resolveFlag, getModerationStats, seedMockFlags, ContentFlag, ModerationStats } from '@/lib/admin/moderation-service'
import { format } from 'date-fns'
import { th } from 'date-fns/locale'
import Image from 'next/image'

export default function ModerationPage() {
    const { adminUser } = useAdmin()
    const [flags, setFlags] = useState<ContentFlag[]>([])
    const [stats, setStats] = useState<ModerationStats>({ total: 0, pending: 0, resolved: 0, highRisk: 0 })
    const [loading, setLoading] = useState(true)
    const [filterStatus, setFilterStatus] = useState('all')

    useEffect(() => {
        const init = async () => {
            // await seedMockFlags() // Uncomment to auto seed first run or use button
            await loadData()
        }
        init()
    }, [filterStatus])

    const loadData = async () => {
        setLoading(true)
        const [fData, sData] = await Promise.all([
            getModerationFlags(filterStatus),
            getModerationStats()
        ])
        setFlags(fData)
        setStats(sData)
        setLoading(false)
    }

    const handleSeed = async () => {
        await seedMockFlags()
        loadData()
    }

    const handleAction = async (flag: ContentFlag, action: 'ban_target' | 'dismiss' | 'warn') => {
        if (!adminUser) return

        const confirmMsg = action === 'ban_target' ? 'ยืนยันลงโทษ/ลบ (Ban/Delete)?' :
            action === 'dismiss' ? 'ยืนยันยกเลิกการธง (Dismiss)?' : 'ยืนยันว่ากล่าวตักเตือน?'

        if (!confirm(confirmMsg)) return

        const note = prompt('บันทึกเพิ่มเติม (Optional):') || ''

        try {
            await resolveFlag(adminUser, flag.id, action, note)
            alert('ดำเนินการเรียบร้อย')
            loadData()
        } catch (e) {
            alert('เกิดข้อผิดพลาด')
        }
    }

    const getIcon = (type: string) => {
        if (type === 'product') return <Package className="w-5 h-5 text-purple-500" />
        if (type === 'user') return <User className="w-5 h-5 text-blue-500" />
        if (type === 'review') return <MessageSquare className="w-5 h-5 text-orange-500" />
        return <Flag className="w-5 h-5 text-gray-500" />
    }

    return (
        <AdminLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <ShieldAlert className="w-8 h-8 text-red-600" />
                            ตรวจสอบเนื้อหา (Moderation Center)
                        </h1>
                        <p className="text-gray-500 mt-1">
                            จัดการรายงานความไม่เหมาะสมและ AI Flags
                        </p>
                    </div>
                    <button onClick={handleSeed} className="text-xs text-gray-400 hover:text-gray-600">(System) Seed Data</button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-white p-4 rounded-xl border shadow-sm">
                        <div className="text-gray-500 text-sm">การแจ้งเตือนทั้งหมด</div>
                        <div className="text-2xl font-bold">{stats.total}</div>
                    </div>
                    <div className="bg-red-50 p-4 rounded-xl border border-red-100 relative overflow-hidden">
                        <div className="text-red-600 text-sm font-bold flex items-center gap-1">
                            <Zap className="w-4 h-4" /> ความเสี่ยงสูง (High Risk)
                        </div>
                        <div className="text-2xl font-bold text-red-700">{stats.highRisk}</div>
                        <div className="absolute right-2 top-2 opacity-20"><ShieldAlert className="w-12 h-12 text-red-600" /></div>
                    </div>
                    <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-100">
                        <div className="text-yellow-600 text-sm">รอตรวจสอบ (Pending)</div>
                        <div className="text-2xl font-bold text-yellow-700">{stats.pending}</div>
                    </div>
                    <div className="bg-green-50 p-4 rounded-xl border border-green-100">
                        <div className="text-green-600 text-sm">จัดการแล้ว (Resolved)</div>
                        <div className="text-2xl font-bold text-green-700">{stats.resolved}</div>
                    </div>
                </div>

                {/* Filter & List */}
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
                    <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex gap-2">
                        {['all', 'pending', 'resolved', 'dismissed'].map(s => (
                            <button
                                key={s}
                                onClick={() => setFilterStatus(s)}
                                className={`px-3 py-1.5 rounded-lg text-sm font-bold capitalize ${filterStatus === s ? 'bg-gray-900 text-white' : 'text-gray-500 hover:bg-gray-100'}`}
                            >
                                {s}
                            </button>
                        ))}
                    </div>

                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 dark:bg-gray-900 text-gray-500 font-bold uppercase text-xs">
                            <tr>
                                <th className="px-6 py-4">เป้าหมาย (Target)</th>
                                <th className="px-6 py-4">สาเหตุ (Reason)</th>
                                <th className="px-6 py-4">AI Score</th>
                                <th className="px-6 py-4">สถานะ</th>
                                <th className="px-6 py-4">วันที่แจ้ง</th>
                                <th className="px-6 py-4 text-right">ดำเนินการ</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {flags.map(flag => (
                                <tr key={flag.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-gray-100 rounded-lg">
                                                {getIcon(flag.target_type)}
                                            </div>
                                            <div>
                                                <div className="font-bold text-gray-900 dark:text-white flex items-center gap-1">
                                                    {flag.target_name || 'Unknown Target'}
                                                    <span className="text-[10px] bg-gray-200 px-1 rounded uppercase font-medium">{flag.target_type}</span>
                                                </div>
                                                {flag.target_preview && (
                                                    <div className="text-xs text-gray-500 mt-0.5 line-clamp-1 max-w-[200px]">
                                                        {flag.target_preview.startsWith('http') ? (
                                                            <span className="text-blue-500 underline flex items-center gap-1"><Package className="w-3 h-3" /> ดูรูปภาพ</span>
                                                        ) : (
                                                            flag.target_preview
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-gray-700 dark:text-gray-300 font-medium">{flag.reason}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        {flag.ai_score ? (
                                            <span className={`px-2 py-1 rounded text-xs font-bold ${flag.ai_score > 80 ? 'bg-red-100 text-red-700' :
                                                    flag.ai_score > 50 ? 'bg-yellow-100 text-yellow-700' :
                                                        'bg-green-100 text-green-700'
                                                }`}>
                                                {flag.ai_score}%
                                            </span>
                                        ) : '-'}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-bold capitalize ${flag.status === 'resolved' ? 'bg-green-100 text-green-700' :
                                                flag.status === 'dismissed' ? 'bg-gray-100 text-gray-600' :
                                                    'bg-yellow-100 text-yellow-700'
                                            }`}>
                                            {flag.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-500 text-xs">
                                        {flag.created_at ? format(flag.created_at, 'dd MMM yy HH:mm', { locale: th }) : '-'}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        {flag.status === 'pending' && (
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => handleAction(flag, 'ban_target')}
                                                    className="bg-red-50 text-red-600 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-red-100 border border-transparent"
                                                >
                                                    ลงโทษ (Ban)
                                                </button>
                                                <button
                                                    onClick={() => handleAction(flag, 'dismiss')}
                                                    className="bg-white border border-gray-300 text-gray-600 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-gray-50"
                                                >
                                                    ยกเลิก (Dismiss)
                                                </button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            {flags.length === 0 && !loading && (
                                <tr><td colSpan={6} className="text-center py-12 text-gray-500">
                                    ไม่มีรายการตรวจสอบ
                                    <br />
                                    <button onClick={handleSeed} className="text-blue-500 underline text-xs mt-2">Seed Data</button>
                                </td></tr>
                            )}
                        </tbody>
                    </table>
                </div>

            </div>
        </AdminLayout>
    )
}
