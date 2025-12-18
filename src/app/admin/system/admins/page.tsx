'use client'

import { useState, useEffect } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import { db } from '@/lib/firebase'
import { collection, getDocs, doc, setDoc, query, where, updateDoc } from 'firebase/firestore'
import { AdminUser, AdminRole, ADMIN_ROLES, Permission } from '@/types/admin'
import { getRolePermissions, getRoleName, getRoleColor } from '@/lib/rbac'
import {
    Users, Shield, CheckCircle, XCircle, Edit,
    Plus, Search, Save, X
} from 'lucide-react'
import Image from 'next/image'
import { useLanguage } from '@/contexts/LanguageContext'

export default function AdminManagementPage() {
    const { t } = useLanguage()
    const [admins, setAdmins] = useState<AdminUser[]>([])
    const [loading, setLoading] = useState(true)
    const [isAdding, setIsAdding] = useState(false)
    const [searchEmail, setSearchEmail] = useState('')
    const [foundUser, setFoundUser] = useState<any>(null)
    const [searchError, setSearchError] = useState('')

    // Edit State
    const [editingAdmin, setEditingAdmin] = useState<AdminUser | null>(null)
    const [selectedRole, setSelectedRole] = useState<AdminRole>('customer_support')
    const [customPermissions, setCustomPermissions] = useState<Permission[]>([])

    const allPermissions = getRolePermissions('super_admin')

    useEffect(() => {
        fetchAdmins()
    }, [])

    const fetchAdmins = async () => {
        try {
            const snap = await getDocs(collection(db, 'admins'))
            const data = snap.docs.map(d => ({ id: d.id, ...d.data() })) as AdminUser[]
            setAdmins(data)
        } catch (error) {
            console.error('Error fetching admins:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleSearchUser = async () => {
        setSearchError('')
        setFoundUser(null)
        if (!searchEmail) return

        try {
            const usersRef = collection(db, 'users')
            const q = query(usersRef, where('email', '==', searchEmail))
            const snap = await getDocs(q)

            if (snap.empty) {
                setSearchError(t('admin.admins_not_found'))
                return
            }

            const userDoc = snap.docs[0]
            setFoundUser({ id: userDoc.id, ...userDoc.data() })
        } catch (error) {
            console.error(error)
            setSearchError('Error searching user')
        }
    }

    const handleAddAdmin = async () => {
        if (!foundUser) return

        try {
            const newAdmin: AdminUser = {
                id: foundUser.id,
                email: foundUser.email,
                displayName: foundUser.displayName || 'Admin',
                role: 'customer_support', // Default role
                permissions: [],
                avatar_url: foundUser.photoURL,
                is_active: true,
                created_at: new Date()
            }

            await setDoc(doc(db, 'admins', foundUser.id), newAdmin)

            setIsAdding(false)
            setSearchEmail('')
            setFoundUser(null)
            fetchAdmins()
        } catch (error) {
            console.error(error)
            alert('Error adding admin')
        }
    }

    const handleEditClick = (admin: AdminUser) => {
        setEditingAdmin(admin)
        setSelectedRole(admin.role)
        setCustomPermissions(admin.permissions || [])
    }

    const handleSaveEdit = async () => {
        if (!editingAdmin) return

        try {
            await updateDoc(doc(db, 'admins', editingAdmin.id), {
                role: selectedRole,
                permissions: customPermissions
            })

            setEditingAdmin(null)
            fetchAdmins()
        } catch (error) {
            console.error(error)
            alert('Error saving admin')
        }
    }

    const togglePermission = (perm: Permission) => {
        setCustomPermissions(prev =>
            prev.includes(perm)
                ? prev.filter(p => p !== perm)
                : [...prev, perm]
        )
    }

    return (
        <AdminLayout>
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <Shield className="w-8 h-8 text-purple-600" />
                            {t('admin.admins_management')}
                        </h1>
                        <p className="text-gray-500 mt-1">{t('admin.admins_desc')}</p>
                    </div>
                    <button
                        onClick={() => setIsAdding(true)}
                        className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" />
                        {t('admin.add_admin')}
                    </button>
                </div>

                {/* Admins Table */}
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm">
                    <table className="w-full">
                        <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">{t('admin.user')}</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">{t('admin.menu_system_roles')}</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">{t('admin.admins_permissions_custom')}</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">{t('admin.table_payout_status')}</th>
                                <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {admins.map(admin => (
                                <tr key={admin.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-gray-200 relative overflow-hidden">
                                                {admin.avatar_url ? (
                                                    <Image src={admin.avatar_url} alt={admin.displayName} fill className="object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center bg-purple-100 text-purple-600 font-bold">
                                                        {admin.displayName[0]}
                                                    </div>
                                                )}
                                            </div>
                                            <div>
                                                <div className="font-medium text-gray-900 dark:text-white">{admin.displayName}</div>
                                                <div className="text-xs text-gray-500">{admin.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold bg-${getRoleColor(admin.role)}-100 text-${getRoleColor(admin.role)}-700`}>
                                            {getRoleName(admin.role)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        {admin.permissions && admin.permissions.length > 0 ? (
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                +{admin.permissions.length}
                                            </span>
                                        ) : (
                                            <span className="text-gray-400 text-xs">-</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        {admin.is_active ? (
                                            <span className="flex items-center gap-1 text-green-600 text-sm">
                                                <CheckCircle className="w-4 h-4" /> Active
                                            </span>
                                        ) : (
                                            <span className="flex items-center gap-1 text-red-600 text-sm">
                                                <XCircle className="w-4 h-4" /> Suspended
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button
                                            onClick={() => handleEditClick(admin)}
                                            className="text-gray-400 hover:text-purple-600 transition-colors p-2"
                                            title="Edit"
                                        >
                                            <Edit className="w-5 h-5" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {admins.length === 0 && !loading && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                                        {t('common.no_data')}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* ADD MODAL */}
                {isAdding && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                        <div className="bg-white dark:bg-gray-800 w-full max-w-lg rounded-2xl shadow-2xl p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold">{t('admin.add_admin')}</h2>
                                <button onClick={() => setIsAdding(false)}><X className="w-5 h-5" /></button>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">{t('admin.admins_search_user')}</label>
                                    <div className="flex gap-2">
                                        <input
                                            type="email"
                                            value={searchEmail}
                                            onChange={e => setSearchEmail(e.target.value)}
                                            placeholder={t('admin.admins_search_placeholder')}
                                            className="flex-1 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-900"
                                        />
                                        <button
                                            onClick={handleSearchUser}
                                            className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800"
                                        >
                                            <Search className="w-4 h-4" />
                                        </button>
                                    </div>
                                    {searchError && <p className="text-red-500 text-sm mt-1">{searchError}</p>}
                                </div>

                                {foundUser && (
                                    <div className="p-4 bg-purple-50 dark:bg-purple-900/10 border border-purple-100 dark:border-purple-800 rounded-xl flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-purple-200 flex items-center justify-center font-bold text-purple-700">
                                                {foundUser.displayName?.[0]}
                                            </div>
                                            <div>
                                                <div className="font-bold">{foundUser.displayName}</div>
                                                <div className="text-xs text-gray-500">{foundUser.email}</div>
                                            </div>
                                        </div>
                                        <button
                                            onClick={handleAddAdmin}
                                            className="px-3 py-1.5 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 font-medium"
                                        >
                                            {t('admin.admins_confirm_add').replace('{{name}}', '')}
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* EDIT MODAL (Manage Permissions) */}
                {editingAdmin && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
                        <div className="bg-white dark:bg-gray-800 w-full max-w-4xl rounded-2xl shadow-2xl p-6 my-8 max-h-[90vh] overflow-y-auto">
                            <div className="flex justify-between items-center mb-6 sticky top-0 bg-white dark:bg-gray-800 z-10 pb-4 border-b border-gray-100">
                                <div>
                                    <h2 className="text-xl font-bold flex items-center gap-2">
                                        <Shield className="w-6 h-6 text-purple-600" />
                                        {editingAdmin.displayName}
                                    </h2>
                                    <p className="text-sm text-gray-500">{t('admin.admins_desc')}</p>
                                </div>
                                <button onClick={() => setEditingAdmin(null)}><X className="w-5 h-5" /></button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                {/* Left: Role Selection */}
                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-bold mb-2">{t('admin.admins_role_select')}</label>
                                        <div className="space-y-2">
                                            {Object.values(ADMIN_ROLES).map((role) => (
                                                <button
                                                    key={role.id}
                                                    onClick={() => setSelectedRole(role.id)}
                                                    className={`w-full text-left px-4 py-3 rounded-xl border transition-all flex items-center justify-between ${selectedRole === role.id
                                                        ? `border-${role.color}-500 bg-${role.color}-50 dark:bg-${role.color}-900/10 ring-1 ring-${role.color}-500`
                                                        : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
                                                        }`}
                                                >
                                                    <div>
                                                        <div className={`font-bold text-${role.color}-700 dark:text-${role.color}-400 text-sm`}>{role.name}</div>
                                                        <div className="text-xs text-gray-400">{role.name_th}</div>
                                                    </div>
                                                    {selectedRole === role.id && <CheckCircle className={`w-5 h-5 text-${role.color}-500`} />}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Right: Granular Permissions */}
                                <div className="md:col-span-2">
                                    <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-6">
                                        <div className="flex justify-between items-center mb-4">
                                            <h3 className="font-bold text-gray-900 dark:text-white">{t('admin.admins_permissions_custom')}</h3>
                                            <span className="text-xs text-gray-400">{t('admin.admins_permissions_desc')}</span>
                                        </div>

                                        {/* Group Permissions by Category */}
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            {['users', 'sellers', 'products', 'orders', 'finance', 'system'].map(category => {
                                                const categoryPerms = allPermissions.filter(p => p.startsWith(category + '.'))
                                                if (categoryPerms.length === 0) return null

                                                // Check if role already has these permissions
                                                const rolePerms = ADMIN_ROLES[selectedRole].permissions

                                                return (
                                                    <div key={category} className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                                                        <h4 className="font-bold capitalize mb-3 text-gray-700 dark:text-gray-300 border-b pb-2">{category}</h4>
                                                        <div className="space-y-2">
                                                            {categoryPerms.map(perm => {
                                                                const isInherited = selectedRole === 'super_admin' || rolePerms.includes(perm)
                                                                const isCustom = customPermissions.includes(perm)

                                                                return (
                                                                    <label key={perm} className={`flex items-start gap-2 cursor-pointer ${isInherited ? 'opacity-50' : ''}`}>
                                                                        <div className="relative flex items-center">
                                                                            <input
                                                                                type="checkbox"
                                                                                checked={isInherited || isCustom}
                                                                                disabled={isInherited}
                                                                                onChange={() => togglePermission(perm)}
                                                                                className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500 border-gray-300 mt-1"
                                                                            />
                                                                        </div>
                                                                        <div>
                                                                            <div className="text-sm font-medium text-gray-700 dark:text-gray-300">{perm.split('.')[1]}</div>
                                                                            {isInherited && <div className="text-[10px] text-green-600">{t('admin.admins_inherited')}</div>}
                                                                        </div>
                                                                    </label>
                                                                )
                                                            })}
                                                        </div>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </div>

                                    <div className="mt-6 flex justify-end gap-3 sticky bottom-0 bg-gray-50 dark:bg-gray-900 pt-4 border-t border-gray-200 dark:border-gray-700">
                                        <button
                                            onClick={() => setEditingAdmin(null)}
                                            className="px-6 py-2 rounded-lg text-gray-600 hover:bg-gray-200"
                                        >
                                            {t('admin.action_cancel')}
                                        </button>
                                        <button
                                            onClick={handleSaveEdit}
                                            className="px-6 py-2 bg-purple-600 text-white font-bold rounded-lg hover:bg-purple-700 flex items-center gap-2"
                                        >
                                            <Save className="w-4 h-4" />
                                            {t('admin.save_settings')}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    )
}
