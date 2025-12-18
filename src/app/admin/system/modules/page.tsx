'use client'

import { useState, useEffect } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import { useLanguage } from '@/contexts/LanguageContext'
import { useAdmin } from '@/contexts/AdminContext'
import { useSystemConfig, updateSystemConfig, SystemModule } from '@/lib/system-config'
import {
    Settings, ShoppingBag, MessageSquare, CreditCard,
    Truck, Star, Tag, BarChart2, Bell, AlertTriangle
} from 'lucide-react'
import { logAdminAction } from '@/lib/adminLogger'

const MODULE_ICONS: Record<SystemModule, any> = {
    marketplace: ShoppingBag,
    chat: MessageSquare,
    payment: CreditCard,
    shipping: Truck,
    review: Star,
    promotion: Tag,
    analytics: BarChart2,
    notification: Bell
}

export default function ModulesPage() {
    const { t } = useLanguage()
    const { adminUser } = useAdmin()
    const { config, loading } = useSystemConfig()
    const [toggling, setToggling] = useState<string | null>(null)

    const handleToggle = async (module: SystemModule, currentState: boolean) => {
        if (!adminUser) return
        if (toggling) return

        setToggling(module)
        try {
            const newState = !currentState
            const updatedModules = { ...config.modules, [module]: newState }

            await updateSystemConfig({ modules: updatedModules })
            await logAdminAction(adminUser, 'SETTINGS_UPDATE', `Module: ${module}`, `Set to ${newState ? 'ON' : 'OFF'}`)

        } catch (error) {
            console.error(error)
            alert('Failed to update module status')
        } finally {
            setToggling(null)
        }
    }

    const moduleKeys: SystemModule[] = [
        'marketplace', 'chat', 'payment', 'shipping',
        'review', 'promotion', 'analytics', 'notification'
    ]

    return (
        <AdminLayout>
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <Settings className="w-8 h-8 text-gray-700 dark:text-gray-300" />
                            {t('admin.sys_mod_title')}
                        </h1>
                        <p className="text-gray-500">{t('admin.sys_mod_desc')}</p>
                    </div>
                </div>

                {config.maintenance_mode && (
                    <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4 rounded-r flex items-start gap-3">
                        <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                        <div>
                            <h3 className="font-bold text-red-800 dark:text-red-200">Maintenance Mode Active</h3>
                            <p className="text-sm text-red-700 dark:text-red-300">
                                All modules are currently disabled globally. Turn off maintenance mode in General Settings to restore individual module control.
                            </p>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {loading ? (
                        // Skeletons
                        Array(6).fill(0).map((_, i) => (
                            <div key={i} className="h-32 bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse"></div>
                        ))
                    ) : (
                        moduleKeys.map(key => {
                            const Icon = MODULE_ICONS[key]
                            const isEnabled = config.modules[key]
                            const isGlobalDisabled = config.maintenance_mode

                            return (
                                <div key={key} className={`
                                    relative p-6 rounded-xl border transition-all duration-200
                                    ${isEnabled
                                        ? 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-sm'
                                        : 'bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800 opacity-75'
                                    }
                                `}>
                                    <div className="flex items-start justify-between mb-4">
                                        <div className={`p-3 rounded-lg ${isEnabled ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600' : 'bg-gray-200 dark:bg-gray-800 text-gray-500'}`}>
                                            <Icon className="w-6 h-6" />
                                        </div>

                                        <button
                                            onClick={() => handleToggle(key, isEnabled)}
                                            disabled={isGlobalDisabled || toggling === key}
                                            className={`
                                                relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                                                ${isEnabled ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}
                                                ${(isGlobalDisabled || toggling === key) ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                                            `}
                                        >
                                            <span className={`
                                                inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                                                ${isEnabled ? 'translate-x-6' : 'translate-x-1'}
                                            `} />
                                        </button>
                                    </div>

                                    <div>
                                        <h3 className="text-lg font-bold text-gray-900 dark:text-white capitalize">
                                            {t(`admin.sys_mod_${key}`)}
                                        </h3>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 h-10">
                                            {t(`admin.sys_mod_${key}_desc`)}
                                        </p>
                                    </div>

                                    {/* Status Indicator text */}
                                    <div className="mt-4 flex items-center gap-2">
                                        <span className={`w-2 h-2 rounded-full ${isEnabled ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                                        <span className={`text-xs font-bold uppercase ${isEnabled ? 'text-green-600' : 'text-gray-500'}`}>
                                            {isEnabled ? 'Active' : 'Disabled'}
                                        </span>
                                    </div>
                                </div>
                            )
                        })
                    )}
                </div>
            </div>
        </AdminLayout>
    )
}
