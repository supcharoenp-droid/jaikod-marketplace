'use client'

import AdminLayout from '@/components/admin/AdminLayout'
import { ADMIN_ROLES } from '@/types/admin'
import { Shield } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

export default function RolesPage() {
    const { t } = useLanguage()

    const getRoleColorClass = (color: string) => {
        const colors: Record<string, string> = {
            purple: 'bg-purple-500',
            blue: 'bg-blue-500',
            green: 'bg-green-500',
            amber: 'bg-amber-500',
            orange: 'bg-orange-500',
            cyan: 'bg-cyan-500',
            pink: 'bg-pink-500'
        }
        return colors[color] || 'bg-gray-500'
    }

    const getRoleTextClass = (color: string) => {
        const colors: Record<string, string> = {
            purple: 'text-purple-600 dark:text-purple-400',
            blue: 'text-blue-600 dark:text-blue-400',
            green: 'text-green-600 dark:text-green-400',
            amber: 'text-amber-600 dark:text-amber-400',
            orange: 'text-orange-600 dark:text-orange-400',
            cyan: 'text-cyan-600 dark:text-cyan-400',
            pink: 'text-pink-600 dark:text-pink-400'
        }
        return colors[color] || 'text-gray-600 dark:text-gray-400'
    }

    return (
        <AdminLayout>
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <Shield className="w-8 h-8 text-purple-600" />
                        {t('admin.roles_page_title')}
                    </h1>
                    <p className="text-gray-500 mt-1">
                        {t('admin.roles_page_desc')}
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {Object.values(ADMIN_ROLES).sort((a, b) => a.level - b.level).map((role) => (
                        <div key={role.id} className={`bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm hover:shadow-md transition-shadow relative`}>
                            <div className={`h-2 w-full absolute top-0 ${getRoleColorClass(role.color)}`}></div>
                            <div className="p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className={`text-lg font-bold ${getRoleTextClass(role.color)}`}>{role.name}</h3>
                                        <p className="text-sm text-gray-500 font-medium">{role.name_th}</p>
                                    </div>
                                    <span className="text-xs font-mono px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-gray-500">
                                        {t('admin.level')} {role.level}
                                    </span>
                                </div>

                                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 min-h-[40px]">
                                    {t(`admin.role_desc_${role.id}`) || role.description}
                                </p>

                                {(role.permissions as string[]).includes('*') ? (
                                    <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg text-purple-700 dark:text-purple-300 text-sm font-medium flex items-center gap-2">
                                        <Shield className="w-4 h-4" />
                                        {t('admin.all_permissions')}
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        <div className="text-xs font-bold text-gray-400 uppercase">{t('admin.default_permissions')}</div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-2 gap-y-3">
                                            {(() => {
                                                const grouped: Record<string, string[]> = {}
                                                role.permissions.forEach(p => {
                                                    const [cat, action] = p.split('.')
                                                    if (!grouped[cat]) grouped[cat] = []
                                                    grouped[cat].push(action)
                                                })
                                                return Object.entries(grouped).map(([category, actions]) => (
                                                    <div key={category} className="bg-gray-50 dark:bg-gray-700/50 p-2 rounded-lg">
                                                        <div className="text-[10px] font-bold text-gray-500 uppercase mb-1.5 flex items-center gap-1">
                                                            <div className={`w-1.5 h-1.5 rounded-full bg-${role.color}-500`}></div>
                                                            {t(`admin.perm_cat_${category}`) || category}
                                                        </div>
                                                        <div className="flex flex-wrap gap-1">
                                                            {actions.map(action => (
                                                                <span key={action} className="text-[10px] px-1.5 py-0.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded text-gray-600 dark:text-gray-300">
                                                                    {t(`admin.perm_${action}`) || action.replace(/_/g, ' ')}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                ))
                                            })()}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </AdminLayout>
    )
}
