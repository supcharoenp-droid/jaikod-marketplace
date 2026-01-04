'use client'

import React, { useState, useEffect } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import { useLanguage } from '@/contexts/LanguageContext'
import { useAdmin } from '@/contexts/AdminContext'
import { getUsers, banUser, unbanUser, updateUserOnboarding, updateUserRoles, UserData } from '@/lib/admin/user-service'
import {
    Search,
    User as UserIcon,
    Shield,
    Ban,
    CheckCircle,
    Calendar,
    Store,
    ChevronRight,
    ChevronDown,
    Edit,
    Zap,
    Award,
    AlertTriangle,
    TrendingUp,
    Package,
    ShoppingBag,
    Star
} from 'lucide-react'
import { format } from 'date-fns'
import { th, enUS } from 'date-fns/locale'
import Image from 'next/image'

export default function UsersManagement() {
    const { language, t } = useLanguage()
    const { adminUser } = useAdmin()
    const [users, setUsers] = useState<UserData[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'banned'>('all')
    const [expandedUserId, setExpandedUserId] = useState<string | null>(null)
    const [editingOnboarding, setEditingOnboarding] = useState<{ id: string, step: number, isVerified: boolean } | null>(null)
    const [isUpdatingRole, setIsUpdatingRole] = useState(false)

    useEffect(() => {
        fetchUsers()
    }, [filterStatus])

    const fetchUsers = async () => {
        setLoading(true)
        try {
            const result = await getUsers({ status: filterStatus })
            setUsers(result.users)
        } catch (error) {
            console.error('Error fetching users:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        try {
            const result = await getUsers({ search: searchTerm })
            setUsers(result.users)
        } catch (error) {
            console.error('Error searching users:', error)
        } finally {
            setLoading(false)
        }
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
                isVerified: user.isVerified || false
            })
        }
    }

    const handleSaveOnboarding = async () => {
        if (!editingOnboarding) return
        try {
            await updateUserOnboarding(editingOnboarding.id, {
                onboardingStep: editingOnboarding.step,
                isVerified: editingOnboarding.isVerified
            })
            alert(t('admin.data_saved') || 'Data Saved Successfully')
            fetchUsers()
        } catch (error) {
            alert(t('admin.error_update_user') || 'Failed to update user')
        }
    }

    const handleBanAction = async (user: UserData) => {
        if (!adminUser) {
            alert(t('admin.session_not_found') || 'Admin session not found')
            return
        }

        if (user.status === 'banned') {
            if (confirm(t('admin.confirm_unban', { name: user.displayName }) || `Unban user ${user.displayName}?`)) {
                await unbanUser(adminUser, user.id)
                alert(t('admin.user_unbanned_success') || 'User unbanned')
                fetchUsers()
            }
        } else {
            const reason = prompt(t('admin.enter_ban_reason') || 'Enter reason for ban:')
            if (reason) {
                await banUser(adminUser, user.id, reason)
                alert(t('admin.user_banned_success') || 'User banned')
                fetchUsers()
            }
        }
    }

    const handleRoleUpdate = async (user: UserData, newRole: string) => {
        if (!adminUser) return

        let newRoles = ['buyer']
        if (newRole === 'seller') newRoles = ['buyer', 'seller']
        if (newRole === 'admin') newRoles = ['admin']

        if (confirm(`Change ${user.displayName}'s role to ${newRole.toUpperCase()}?`)) {
            setIsUpdatingRole(true)
            try {
                await updateUserRoles(adminUser, user.id, newRoles)
                alert(t('admin.role_updated_success') || 'Role updated successfully')
                fetchUsers()
            } catch (error) {
                alert('Update failed')
            } finally {
                setIsUpdatingRole(false)
            }
        }
    }

    return (
        <AdminLayout>
            <div className="p-6 max-w-7xl mx-auto space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <UserIcon className="w-6 h-6 text-blue-600" />
                            {t('admin.users_management') || 'User Management'}
                        </h1>
                        <p className="text-gray-500 text-sm mt-1">{t('admin.sellers_management_desc') || 'Manage users and sellers'}</p>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="bg-blue-50 dark:bg-blue-900/30 px-4 py-2 rounded-xl border border-blue-100 dark:border-blue-800">
                            <span className="text-[10px] uppercase font-bold text-blue-600 dark:text-blue-400 block tracking-wider">
                                {t('admin.total_users_label') || 'Total Users'}
                            </span>
                            <span className="text-xl font-bold text-blue-700 dark:text-blue-300">
                                {users.length}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Filters & Search */}
                <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col md:flex-row gap-4 items-center">
                    <div className="flex bg-gray-100 dark:bg-gray-900 p-1 rounded-xl">
                        {(['all', 'active', 'banned'] as const).map((status) => (
                            <button
                                key={status}
                                onClick={() => setFilterStatus(status)}
                                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${filterStatus === status
                                    ? 'bg-white dark:bg-gray-800 text-blue-600 shadow-sm'
                                    : 'text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                {t(`admin.filter_${status}`) || status}
                            </button>
                        ))}
                    </div>

                    <form onSubmit={handleSearch} className="flex-1 relative w-full">
                        <input
                            type="text"
                            placeholder={t('admin.search_placeholder') || 'Search...'}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-900 border-none rounded-xl focus:ring-2 focus:ring-blue-500 dark:text-white"
                        />
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <button type="submit" className="hidden" />
                    </form>
                </div>

                {/* Users Table */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 dark:bg-gray-900/50 text-[10px] uppercase font-bold text-gray-400 tracking-wider">
                                    <th className="px-6 py-4">{t('admin.table_user') || 'User'}</th>
                                    <th className="px-6 py-4">{t('admin.table_registered') || 'Registered'}</th>
                                    <th className="px-6 py-4">{t('admin.table_verified') || 'Verified'}</th>
                                    <th className="px-6 py-4">{t('admin.table_shop') || 'Shop'}</th>
                                    <th className="px-6 py-4 text-right">{t('admin.table_action') || 'Action'}</th>
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
                                                            <Image src={user.photoURL} alt={user.displayName || 'User'} fill className="object-cover" />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center bg-gray-300 text-gray-600 font-bold">
                                                                {user.displayName?.[0] || 'U'}
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                                            {user.displayName || t('admin.unknown_user')}
                                                            {(user.displayName || '').toLowerCase().includes('admin') ? (
                                                                <span className="text-[10px] bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded font-bold border border-purple-200">
                                                                    {t('admin.role_admin') || 'Administrator'}
                                                                </span>
                                                            ) : (user.shopName || (user.displayName || '').toLowerCase().includes('seller')) ? (
                                                                <span className="text-[10px] bg-orange-100 text-orange-700 px-1.5 py-0.5 rounded font-bold border border-orange-200">
                                                                    {t('common.seller') || 'Seller'}
                                                                </span>
                                                            ) : (
                                                                <span className="text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded font-bold border border-blue-200">
                                                                    {t('common.buyer') || 'Buyer'}
                                                                </span>
                                                            )}
                                                        </div>
                                                        <div className="flex items-center gap-1.5 mt-0.5">
                                                            <div className="flex gap-0.5">
                                                                {[1, 2, 3, 4, 5].map((s) => (
                                                                    <div
                                                                        key={s}
                                                                        className={`w-1.5 h-1.5 rounded-full ${s <= (user.aiTrustScore || (user.isVerified ? 5 : 3)) ? 'bg-green-500' : 'bg-gray-200'}`}
                                                                    />
                                                                ))}
                                                            </div>
                                                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">
                                                                {t('admin.ai_trust_score') || 'AI Trust Score'}
                                                                {user.aiTrustScore ? ` (${user.aiTrustScore}/5)` : ''}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center gap-2 text-[10px] text-gray-500 mt-1">
                                                            <span>{user.email}</span>
                                                            <span className="text-gray-300">•</span>
                                                            <span className="font-mono bg-gray-50 px-1 rounded">{user.id.slice(0, 6)}</span>
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
                                                        <CheckCircle className="w-3 h-3" /> {t('admin.verified_badge') || 'Verified'}
                                                    </span>
                                                ) : (
                                                    <span className="text-gray-400 text-xs font-medium">{t('admin.unverified_badge') || 'Unverified'}</span>
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
                                                <div className="flex justify-end gap-2 text-xs font-bold">
                                                    {user.status !== 'banned' && (
                                                        <span className={`px-2 py-1 rounded border ${user.riskLevel === 'high' ? 'bg-red-50 text-red-600 border-red-100' :
                                                            user.isVerified ? 'bg-green-50/50 text-green-600 border-green-100' : 'bg-orange-50/50 text-orange-600 border-orange-100'
                                                            }`}>
                                                            {user.riskLevel === 'high' ? 'High Risk' : user.isVerified ? (t('admin.high_trust') || 'High Trust') : (t('admin.new_member') || 'New Member')}
                                                        </span>
                                                    )}
                                                    <button
                                                        onClick={() => toggleExpand(user)}
                                                        className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-gray-500 transition-colors"
                                                    >
                                                        {expandedUserId === user.id ? <ChevronDown className="w-5 h-5 text-blue-600" /> : <ChevronRight className="w-5 h-5" />}
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                        {/* Expanded Row */}
                                        {expandedUserId === user.id && editingOnboarding && (
                                            <tr className="bg-gray-50 dark:bg-gray-900/50">
                                                <td colSpan={5} className="px-6 py-6">
                                                    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col md:flex-row gap-6">
                                                        {/* AI & Activity Summary */}
                                                        <div className="flex-1 space-y-6">
                                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                                {/* Account Stats */}
                                                                <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-4 border border-gray-100 dark:border-gray-800">
                                                                    <h4 className="text-xs font-bold text-gray-400 uppercase mb-3 flex items-center gap-2">
                                                                        <Zap className="w-3 h-3" /> {t('admin.account_stats') || 'Account Statistics'}
                                                                    </h4>
                                                                    <div className="grid grid-cols-3 gap-2">
                                                                        <div className="text-center">
                                                                            <div className="text-lg font-bold text-gray-900 dark:text-white flex items-center justify-center gap-1">
                                                                                <Package className="w-3 h-3 text-purple-500" /> 12
                                                                            </div>
                                                                            <div className="text-[10px] text-gray-500">{t('admin.listings_count') || 'Listings'}</div>
                                                                        </div>
                                                                        <div className="text-center border-x border-gray-200 dark:border-gray-700">
                                                                            <div className="text-lg font-bold text-gray-900 dark:text-white flex items-center justify-center gap-1">
                                                                                <ShoppingBag className="w-3 h-3 text-blue-500" /> 8
                                                                            </div>
                                                                            <div className="text-[10px] text-gray-500">{t('admin.orders_count') || 'Orders'}</div>
                                                                        </div>
                                                                        <div className="text-center">
                                                                            <div className="text-lg font-bold text-gray-900 dark:text-white flex items-center justify-center gap-1">
                                                                                <Star className="w-3 h-3 text-yellow-500" /> 4.9
                                                                            </div>
                                                                            <div className="text-[10px] text-gray-500">{t('admin.avg_rating') || 'Avg. Rating'}</div>
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                {/* AI Indicators */}
                                                                <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-4 border border-gray-100 dark:border-gray-800">
                                                                    <h4 className="text-xs font-bold text-gray-400 uppercase mb-3 flex items-center gap-2">
                                                                        <TrendingUp className="w-3 h-3" /> {t('admin.user_activity_summary') || 'User Activity Summary'}
                                                                    </h4>
                                                                    <div className="space-y-2">
                                                                        <div className="flex justify-between items-center">
                                                                            <span className="text-xs text-gray-600">{t('admin.predicted_ltv') || 'AI Predicted LTV'}</span>
                                                                            <span className="text-xs font-bold text-green-600">฿{(user.predictedLTV || 0).toLocaleString()}</span>
                                                                        </div>
                                                                        <div className="flex justify-between items-center">
                                                                            <span className="text-xs text-gray-600">{t('admin.risk_factors') || 'Risk Factors'}</span>
                                                                            {user.riskFactors && user.riskFactors.length > 0 ? (
                                                                                <div className="flex flex-wrap gap-1 justify-end max-w-[150px]">
                                                                                    {user.riskFactors.map((f, i) => (
                                                                                        <span key={i} className="text-[8px] font-bold px-1 py-0.5 rounded bg-red-100 text-red-700">{f}</span>
                                                                                    ))}
                                                                                </div>
                                                                            ) : (
                                                                                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-green-100 text-green-700">
                                                                                    {t('admin.no_risk_detected') || 'No major risk factors detected'}
                                                                                </span>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            {/* Controls */}
                                                            <div className="space-y-4">
                                                                <div className="flex items-center justify-between">
                                                                    <h3 className="font-bold flex items-center gap-2 text-sm text-gray-700 dark:text-white">
                                                                        <Edit className="w-4 h-4" />
                                                                        {t('admin.manage_state') || 'Manage State'}
                                                                    </h3>
                                                                    <div className="flex items-center gap-2">
                                                                        <input
                                                                            type="checkbox"
                                                                            id={`verify-check-${user.id}`}
                                                                            checked={editingOnboarding.isVerified}
                                                                            onChange={(e) => setEditingOnboarding({ ...editingOnboarding, isVerified: e.target.checked })}
                                                                            className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                                                                        />
                                                                        <label htmlFor={`verify-check-${user.id}`} className="text-sm font-bold text-gray-600">{t('admin.verified_kyc') || 'Verified (KYC Passed)'}</label>
                                                                    </div>
                                                                </div>

                                                                <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-xl border border-gray-100 dark:border-gray-800">
                                                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-4">{t('admin.onboarding_step') || 'Onboarding Step (1-4)'}</label>
                                                                    <div className="relative h-2 bg-gray-200 dark:bg-gray-700 rounded-full mb-6">
                                                                        <div
                                                                            className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-500"
                                                                            style={{ width: `${((editingOnboarding.step - 1) / 3) * 100}%` }}
                                                                        />
                                                                        <div className="flex justify-between absolute -top-1 w-full px-1">
                                                                            {[1, 2, 3, 4].map(step => (
                                                                                <button
                                                                                    key={step}
                                                                                    onClick={() => setEditingOnboarding({ ...editingOnboarding, step })}
                                                                                    className={`w-4 h-4 rounded-full border-2 transition-all ${editingOnboarding.step >= step ? 'bg-white border-blue-500 scale-110 shadow-sm' : 'bg-gray-300 border-transparent'
                                                                                        }`}
                                                                                />
                                                                            ))}
                                                                        </div>
                                                                    </div>
                                                                    <div className="flex justify-between text-[10px] font-bold text-gray-500 mt-1">
                                                                        <span className={editingOnboarding.step === 1 ? 'text-blue-600' : ''}>{t('admin.step_start') || 'Start'}</span>
                                                                        <span className={editingOnboarding.step === 2 ? 'text-blue-600' : ''}>{t('admin.step_profile') || 'Profile'}</span>
                                                                        <span className={editingOnboarding.step === 3 ? 'text-blue-600' : ''}>{t('admin.step_store') || 'Store'}</span>
                                                                        <span className={editingOnboarding.step === 4 ? 'text-blue-600' : ''}>{t('admin.step_done') || 'Done'}</span>
                                                                    </div>
                                                                </div>

                                                                <button
                                                                    onClick={handleSaveOnboarding}
                                                                    className="w-full md:w-auto px-8 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 transition-all hover:-translate-y-0.5"
                                                                >
                                                                    {t('admin.save_changes') || 'Save Changes'}
                                                                </button>
                                                            </div>
                                                        </div>

                                                        {/* Danger Zone */}
                                                        <div className="w-full md:w-64 border-l pl-0 md:pl-6 border-gray-200 dark:border-gray-700 space-y-4">
                                                            <h3 className="font-bold text-red-600 flex items-center gap-2">
                                                                <Shield className="w-4 h-4" />
                                                                {t('admin.danger_zone') || 'Danger Zone'}
                                                            </h3>

                                                            {/* Role Selection UI */}
                                                            <div className="space-y-1">
                                                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{t('admin.account_role') || 'Account Role'}</p>
                                                                <select
                                                                    className="w-full bg-white dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700 rounded-xl px-3 py-2 text-xs font-black shadow-sm"
                                                                    disabled={isUpdatingRole}
                                                                    defaultValue={user.shopName ? 'seller' : (user.displayName || '').toLowerCase().includes('admin') ? 'admin' : 'buyer'}
                                                                    onChange={(e) => handleRoleUpdate(user, e.target.value)}
                                                                >
                                                                    <option value="buyer">Buyer/Member</option>
                                                                    <option value="seller">Seller/Merchant</option>
                                                                    <option value="admin">Platform Admin</option>
                                                                </select>
                                                            </div>

                                                            <button
                                                                onClick={() => handleBanAction(user)}
                                                                className={`w-full px-3 py-2 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-colors ${user.status === 'banned'
                                                                    ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                                                    : 'bg-red-50 text-red-600 hover:bg-red-100'
                                                                    }`}
                                                            >
                                                                {user.status === 'banned' ? (
                                                                    <>
                                                                        <CheckCircle className="w-4 h-4" /> {t('admin.unban_user') || 'Unban User'}
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <Ban className="w-4 h-4" /> {t('admin.ban_user') || 'Ban User'}
                                                                    </>
                                                                )}
                                                            </button>
                                                            {user.status === 'banned' && (
                                                                <div className="text-xs text-red-500 bg-red-50 p-2 rounded">
                                                                    <strong>{t('admin.ban_reason') || 'Reason'}:</strong> {user.suspendReason || t('admin.not_available')}
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
                                            {t('admin.no_users_found') || 'No users found'}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AdminLayout>
    )
}
