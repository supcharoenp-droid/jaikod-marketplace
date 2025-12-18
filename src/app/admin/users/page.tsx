'use client'

import React, { useState, useEffect } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import {
    Users, Search, Shield, Ban, Eye, CheckCircle,
    XCircle, MoreVertical, Calendar, ChevronRight, ChevronDown,
    Filter, Store, Globe, Edit
} from 'lucide-react'
import { useAdmin } from '@/contexts/AdminContext'
import { useLanguage } from '@/contexts/LanguageContext'
import { getUsers, getUserStats, banUser, unbanUser, UserData } from '@/lib/admin/user-service'
import { updateUserOnboarding } from '@/lib/admin/system-service'
import { format } from 'date-fns'
import { th, enUS } from 'date-fns/locale'
import Image from 'next/image'

export default function UserManagementPage() {
    const { adminUser } = useAdmin()
    const { t, language } = useLanguage()
    const [users, setUsers] = useState<UserData[]>([])
    const [loading, setLoading] = useState(true)
    const [stats, setStats] = useState({ total: 0, active: 0, banned: 0 })

    // Filters
    const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'banned'>('all')
    const [searchTerm, setSearchTerm] = useState('')

    // Pagination (Simple Cursor based)
    const [lastDoc, setLastDoc] = useState<any>(null)

    // Expanded View
    const [expandedUserId, setExpandedUserId] = useState<string | null>(null)
    const [editingOnboarding, setEditingOnboarding] = useState<{ id: string, step: number, isVerified: boolean } | null>(null)

    useEffect(() => {
        loadData(true)
        loadStats()
    }, [filterStatus])

    const loadStats = async () => {
        const s = await getUserStats()
        setStats(s)
    }

    const loadData = async (reset = false) => {
        setLoading(true)
        const result = await getUsers({
            status: filterStatus,
            search: searchTerm,
            lastDoc: reset ? null : lastDoc
        })

        if (reset) {
            setUsers(result.users)
        } else {
            setUsers(prev => [...prev, ...result.users])
        }

        setLastDoc(result.lastDoc)
        setLoading(false)
    }

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        loadData(true)
    }

    const handleBanAction = async (user: UserData) => {
        if (!adminUser) return

        if (user.status === 'banned') {
            const confirmMsg = t('admin.confirm_unban').replace('{{name}}', user.displayName) || `Unban ${user.displayName}?`
            if (!confirm(confirmMsg)) return
            await unbanUser(adminUser, user.id)
        } else {
            const promptMsg = t('admin.enter_ban_reason') || 'Enter reason:'
            const reason = prompt(promptMsg)
            if (!reason) return
            await banUser(adminUser, user.id, reason)
        }
        loadData(true)
        loadStats()
    }

    const toggleExpand = (user: UserData) => {
        if (expandedUserId === user.id) {
            setExpandedUserId(null)
            setEditingOnboarding(null)
        } else {
            setExpandedUserId(user.id)
            setEditingOnboarding({
                id: user.id,
                step: user.onboardingStep || 1,
                isVerified: !!user.isVerified
            })
        }
    }

    const handleSaveOnboarding = async () => {
        if (!editingOnboarding) return
        await updateUserOnboarding(editingOnboarding.id, editingOnboarding.step, editingOnboarding.isVerified)
        // Update local state
        setUsers(users.map(u => u.id === editingOnboarding.id ? {
            ...u,
            onboardingStep: editingOnboarding.step,
            isVerified: editingOnboarding.isVerified
        } : u))
        alert(t('admin.data_saved') || 'Saved')
    }

    return (
        <AdminLayout>
            <div className="space-y-6">
                {/* Header & Stats */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <Users className="w-8 h-8 text-blue-600" />
                            {t('admin.users_management')}
                        </h1>
                        <p className="text-gray-500 mt-1">
                            {t('admin.total_users_label')} <span className="font-bold text-gray-900 dark:text-white">{stats.total.toLocaleString()}</span>
                        </p>
                    </div>
                    <div className="flex gap-2 items-center">
                        <div className="bg-white dark:bg-gray-800 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-green-500"></div>
                            <span className="text-sm font-medium">{t('admin.active_users')}: {stats.active.toLocaleString()}</span>
                        </div>
                        <div className="bg-white dark:bg-gray-800 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-red-500"></div>
                            <span className="text-sm font-medium">{t('admin.banned_users')}: {stats.banned.toLocaleString()}</span>
                        </div>
                    </div>
                </div>

                {/* Filters & Search */}
                <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col md:flex-row gap-4">
                    <div className="flex bg-gray-100 dark:bg-gray-900 p-1 rounded-lg self-start">
                        {['all', 'active', 'banned'].map((s) => (
                            <button
                                key={s}
                                onClick={() => setFilterStatus(s as any)}
                                className={`px-4 py-1.5 rounded-md text-sm font-bold transition-all capitalize ${filterStatus === s ? 'bg-white dark:bg-gray-700 shadow text-gray-900 dark:text-white' : 'text-gray-500 hover:text-gray-900'}`}
                            >
                                {s === 'all' && t('admin.filter_all')}
                                {s === 'active' && t('admin.filter_active')}
                                {s === 'banned' && t('admin.filter_banned')}
                            </button>
                        ))}
                    </div>

                    <form onSubmit={handleSearch} className="flex-1 flex gap-2">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder={t('admin.search_placeholder')}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-900 outline-none focus:ring-2 focus:ring-blue-500 h-full"
                            />
                        </div>
                        <button type="submit" className="px-6 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700">
                            {t('admin.search_button')}
                        </button>
                    </form>
                </div>

                {/* Table */}
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-gray-50 dark:bg-gray-900 text-gray-500 font-bold uppercase text-xs">
                                <tr>
                                    <th className="px-6 py-4">{t('admin.table_user')}</th>
                                    <th className="px-6 py-4">{t('admin.table_registered')}</th>
                                    <th className="px-6 py-4">{t('admin.table_verified')}</th>
                                    <th className="px-6 py-4">{t('admin.table_shop')}</th>
                                    <th className="px-6 py-4 text-right">{t('admin.table_action')}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                {users.map(user => (
                                    <React.Fragment key={user.id}>
                                        <tr className={`hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${user.status === 'banned' ? 'bg-red-50/50 dark:bg-red-900/10' : ''}`}>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-gray-200 relative overflow-hidden flex-shrink-0">
                                                        {user.photoURL ? (
                                                            <Image src={user.photoURL} alt={user.displayName} fill className="object-cover" />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center bg-gray-300 text-gray-600 font-bold">
                                                                {user.displayName?.[0] || 'U'}
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                                            {user.displayName}
                                                            {user.displayName.toLowerCase().includes('admin') ? (
                                                                <span className="text-[10px] bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded font-bold border border-purple-200">
                                                                    {t('admin.role_admin') || 'ผู้ดูแลระบบ'}
                                                                </span>
                                                            ) : (user.shopName || user.displayName.toLowerCase().includes('seller')) ? (
                                                                <span className="text-[10px] bg-orange-100 text-orange-700 px-1.5 py-0.5 rounded font-bold border border-orange-200">
                                                                    {t('admin.role_seller') || 'ผู้ขาย'}
                                                                </span>
                                                            ) : (
                                                                <span className="text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded font-bold border border-blue-200">
                                                                    {t('admin.role_buyer') || 'ผู้ซื้อ'}
                                                                </span>
                                                            )}
                                                        </div>
                                                        <div className="flex items-center gap-2 text-xs text-gray-500">
                                                            <span>{user.email}</span>
                                                            <span className="text-gray-300">•</span>
                                                            <span className="font-mono text-[10px] bg-gray-50 px-1 rounded">{user.id.slice(0, 6)}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-gray-500 whitespace-nowrap">
                                                <div className="flex items-center gap-1">
                                                    <Calendar className="w-3 h-3" />
                                                    {user.createdAt ? format(user.createdAt.toDate(), 'dd MMM yyyy', { locale: language === 'th' ? th : enUS }) : '-'}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                {user.isVerified ? (
                                                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-700">
                                                        <CheckCircle className="w-3 h-3" /> {t('admin.verified_badge')}
                                                    </span>
                                                ) : (
                                                    <span className="text-gray-400 text-xs font-medium">{t('admin.unverified_badge')}</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                {user.shopName ? (
                                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-medium bg-purple-50 text-purple-700 border border-purple-100">
                                                        <Store className="w-3 h-3" /> {user.shopName}
                                                    </span>
                                                ) : (
                                                    <span className="text-gray-400 text-xs">-</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <button
                                                        onClick={() => toggleExpand(user)}
                                                        className="p-1.5 hover:bg-gray-100 rounded text-gray-500"
                                                    >
                                                        {expandedUserId === user.id ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                        {/* Expanded Row */}
                                        {expandedUserId === user.id && editingOnboarding && (
                                            <tr className="bg-gray-50 dark:bg-gray-900/50">
                                                <td colSpan={5} className="px-6 py-6">
                                                    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col md:flex-row gap-6">
                                                        {/* Status Controls */}
                                                        <div className="flex-1 space-y-4">
                                                            <h3 className="font-bold flex items-center gap-2">
                                                                <Edit className="w-4 h-4" />
                                                                {t('admin.manage_state')}
                                                            </h3>

                                                            <div className="space-y-3">
                                                                <div>
                                                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">{t('admin.onboarding_step')}</label>
                                                                    <div className="flex items-center gap-4 mt-1">
                                                                        <input
                                                                            type="range" min="1" max="4"
                                                                            value={editingOnboarding.step}
                                                                            onChange={(e) => setEditingOnboarding({ ...editingOnboarding, step: Number(e.target.value) })}
                                                                            className="flex-1"
                                                                        />
                                                                        <span className="font-bold text-lg w-8 text-center">{editingOnboarding.step}</span>
                                                                    </div>
                                                                    <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                                                                        <span>{t('admin.step_start')}</span>
                                                                        <span>{t('admin.step_profile')}</span>
                                                                        <span>{t('admin.step_store')}</span>
                                                                        <span>{t('admin.step_done')}</span>
                                                                    </div>
                                                                </div>

                                                                <div className="flex items-center gap-2">
                                                                    <input
                                                                        type="checkbox"
                                                                        id="verify-check"
                                                                        checked={editingOnboarding.isVerified}
                                                                        onChange={(e) => setEditingOnboarding({ ...editingOnboarding, isVerified: e.target.checked })}
                                                                        className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                                                                    />
                                                                    <label htmlFor="verify-check" className="text-sm font-medium">{t('admin.verified_kyc')}</label>
                                                                </div>

                                                                <button
                                                                    onClick={handleSaveOnboarding}
                                                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors"
                                                                >
                                                                    {t('admin.save_changes')}
                                                                </button>
                                                            </div>
                                                        </div>

                                                        {/* Danger Zone */}
                                                        <div className="w-full md:w-64 border-l pl-0 md:pl-6 border-gray-200 dark:border-gray-700 space-y-4">
                                                            <h3 className="font-bold text-red-600 flex items-center gap-2">
                                                                <Shield className="w-4 h-4" />
                                                                {t('admin.danger_zone')}
                                                            </h3>
                                                            <button
                                                                onClick={() => handleBanAction(user)}
                                                                className={`w-full px-3 py-2 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-colors ${user.status === 'banned'
                                                                    ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                                                    : 'bg-red-50 text-red-600 hover:bg-red-100'
                                                                    }`}
                                                            >
                                                                {user.status === 'banned' ? (
                                                                    <>
                                                                        <CheckCircle className="w-4 h-4" /> {t('admin.unban_user')}
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <Ban className="w-4 h-4" /> {t('admin.ban_user')}
                                                                    </>
                                                                )}
                                                            </button>
                                                            {user.status === 'banned' && (
                                                                <div className="text-xs text-red-500 bg-red-50 p-2 rounded">
                                                                    <strong>{t('admin.ban_reason')}:</strong> {user.suspendReason || 'N/A'}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </React.Fragment>
                                ))}
                                {users.length === 0 && !loading && (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                                            {t('admin.no_users_found')}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AdminLayout >
    )
}
