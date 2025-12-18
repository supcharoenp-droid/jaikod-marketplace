/**
 * System Configuration Panel
 * Manage Modules, Roles, Settings
 */
'use client'

import { useState } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import { useAdmin } from '@/contexts/AdminContext'
import { useLanguage } from '@/contexts/LanguageContext'
import { canPerform } from '@/lib/rbac'
import { SystemModule, ModuleConfig } from '@/types/admin'
import { ADMIN_ROLES } from '@/types/admin'
import {
    Settings,
    ToggleLeft,
    ToggleRight,
    Shield,
    Users,
    Package,
    MessageSquare,
    CreditCard,
    Truck,
    Star,
    Megaphone,
    BarChart3,
    Bell,
    Save
} from 'lucide-react'

const MODULE_ICONS: Record<SystemModule, any> = {
    marketplace: Package,
    chat: MessageSquare,
    payment: CreditCard,
    shipping: Truck,
    review: Star,
    promotion: Megaphone,
    analytics: BarChart3,
    notification: Bell
}

export default function SystemConfigPage() {
    const { adminUser } = useAdmin()
    const { t, language } = useLanguage()
    const [modules, setModules] = useState<ModuleConfig[]>([
        { id: 'marketplace', name: 'Marketplace', name_th: 'ระบบตลาด', enabled: true },
        { id: 'chat', name: 'Chat', name_th: 'ระบบแชท', enabled: true },
        { id: 'payment', name: 'Payment', name_th: 'ระบบชำระเงิน', enabled: true },
        { id: 'shipping', name: 'Shipping', name_th: 'ระบบจัดส่ง', enabled: true },
        { id: 'review', name: 'Review', name_th: 'ระบบรีวิว', enabled: true },
        { id: 'promotion', name: 'Promotion', name_th: 'ระบบโปรโมชัน', enabled: true },
        { id: 'analytics', name: 'Analytics', name_th: 'ระบบวิเคราะห์', enabled: true },
        { id: 'notification', name: 'Notification', name_th: 'ระบบแจ้งเตือน', enabled: true }
    ])

    const [settings, setSettings] = useState({
        platform_commission: 5,
        min_withdrawal: 100,
        max_withdrawal: 100000,
        auto_approve_products: false,
        require_kyc: true,
        enable_cod: true,
        maintenance_mode: false
    })

    const toggleModule = (moduleId: SystemModule) => {
        if (!canPerform(adminUser, 'system.manage_modules')) {
            alert(t('admin.no_permission_module'))
            return
        }

        setModules(prev =>
            prev.map(m =>
                m.id === moduleId ? { ...m, enabled: !m.enabled } : m
            )
        )
    }

    const handleSaveSettings = () => {
        if (!canPerform(adminUser, 'system.edit_config')) {
            alert(t('admin.no_permission_config'))
            return
        }

        alert(t('admin.settings_saved_success'))
    }

    return (
        <AdminLayout>
            <div className="space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                        {t('admin.system_config')}
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">
                        {t('admin.system_config_desc')}
                    </p>
                </div>

                {/* System Modules */}
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                    <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <Settings className="w-5 h-5" />
                            {t('admin.system_modules')}
                        </h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            {t('admin.system_modules_desc')}
                        </p>
                    </div>
                    <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {modules.map((module) => {
                                const Icon = MODULE_ICONS[module.id]
                                return (
                                    <div
                                        key={module.id}
                                        className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={`p-2 rounded-lg ${module.enabled
                                                ? 'bg-green-100 dark:bg-green-900/30'
                                                : 'bg-gray-100 dark:bg-gray-700'
                                                }`}>
                                                <Icon className={`w-5 h-5 ${module.enabled ? 'text-green-600' : 'text-gray-400'
                                                    }`} />
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900 dark:text-white">
                                                    {t(`admin.${module.id}_system`)}
                                                </p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                                    {module.name}
                                                </p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => toggleModule(module.id)}
                                            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                                        >
                                            {module.enabled ? (
                                                <ToggleRight className="w-8 h-8 text-green-600" />
                                            ) : (
                                                <ToggleLeft className="w-8 h-8 text-gray-400" />
                                            )}
                                        </button>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>

                {/* Platform Settings */}
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                    <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                            {t('admin.platform_settings')}
                        </h2>
                    </div>
                    <div className="p-6 space-y-6">
                        {/* Commission */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                {t('admin.platform_commission')}
                            </label>
                            <input
                                type="number"
                                value={settings.platform_commission}
                                onChange={(e) => setSettings({ ...settings, platform_commission: Number(e.target.value) })}
                                className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                        </div>

                        {/* Withdrawal Limits */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    {t('admin.min_withdrawal')}
                                </label>
                                <input
                                    type="number"
                                    value={settings.min_withdrawal}
                                    onChange={(e) => setSettings({ ...settings, min_withdrawal: Number(e.target.value) })}
                                    className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    {t('admin.max_withdrawal')}
                                </label>
                                <input
                                    type="number"
                                    value={settings.max_withdrawal}
                                    onChange={(e) => setSettings({ ...settings, max_withdrawal: Number(e.target.value) })}
                                    className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                />
                            </div>
                        </div>

                        {/* Toggles */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                                <div>
                                    <p className="font-medium text-gray-900 dark:text-white">
                                        {t('admin.auto_approve_products')}
                                    </p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        {t('admin.auto_approve_desc')}
                                    </p>
                                </div>
                                <button
                                    onClick={() => setSettings({ ...settings, auto_approve_products: !settings.auto_approve_products })}
                                    className="p-2"
                                >
                                    {settings.auto_approve_products ? (
                                        <ToggleRight className="w-8 h-8 text-green-600" />
                                    ) : (
                                        <ToggleLeft className="w-8 h-8 text-gray-400" />
                                    )}
                                </button>
                            </div>

                            <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                                <div>
                                    <p className="font-medium text-gray-900 dark:text-white">
                                        {t('admin.require_kyc')}
                                    </p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        {t('admin.require_kyc_desc')}
                                    </p>
                                </div>
                                <button
                                    onClick={() => setSettings({ ...settings, require_kyc: !settings.require_kyc })}
                                    className="p-2"
                                >
                                    {settings.require_kyc ? (
                                        <ToggleRight className="w-8 h-8 text-green-600" />
                                    ) : (
                                        <ToggleLeft className="w-8 h-8 text-gray-400" />
                                    )}
                                </button>
                            </div>

                            <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                                <div>
                                    <p className="font-medium text-gray-900 dark:text-white">
                                        {t('admin.enable_cod_setting')}
                                    </p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        {t('admin.enable_cod_desc')}
                                    </p>
                                </div>
                                <button
                                    onClick={() => setSettings({ ...settings, enable_cod: !settings.enable_cod })}
                                    className="p-2"
                                >
                                    {settings.enable_cod ? (
                                        <ToggleRight className="w-8 h-8 text-green-600" />
                                    ) : (
                                        <ToggleLeft className="w-8 h-8 text-gray-400" />
                                    )}
                                </button>
                            </div>

                            <div className="flex items-center justify-between p-4 border-2 border-red-200 dark:border-red-800 rounded-lg bg-red-50 dark:bg-red-900/10">
                                <div>
                                    <p className="font-medium text-red-900 dark:text-red-400">
                                        {t('admin.maintenance_mode')}
                                    </p>
                                    <p className="text-sm text-red-600 dark:text-red-500">
                                        {t('admin.maintenance_desc')}
                                    </p>
                                </div>
                                <button
                                    onClick={() => setSettings({ ...settings, maintenance_mode: !settings.maintenance_mode })}
                                    className="p-2"
                                >
                                    {settings.maintenance_mode ? (
                                        <ToggleRight className="w-8 h-8 text-red-600" />
                                    ) : (
                                        <ToggleLeft className="w-8 h-8 text-gray-400" />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Save Button */}
                        <button
                            onClick={handleSaveSettings}
                            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
                        >
                            <Save className="w-5 h-5" />
                            {t('admin.save_settings')}
                        </button>
                    </div>
                </div>

                {/* Admin Roles Overview */}
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                    <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <Shield className="w-5 h-5" />
                            {t('admin.admin_roles')}
                        </h2>
                    </div>
                    <div className="p-6">
                        <div className="space-y-3">
                            {Object.values(ADMIN_ROLES).map((role) => (
                                <div
                                    key={role.id}
                                    className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`w-3 h-3 rounded-full bg-${role.color}-500`}></div>
                                        <div>
                                            <p className="font-medium text-gray-900 dark:text-white">
                                                {language === 'th' ? role.name_th : role.name}
                                            </p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                {role.description}
                                            </p>
                                        </div>
                                    </div>
                                    <span className="text-sm text-gray-500 dark:text-gray-400">
                                        {t('admin.level')} {role.level}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Maintenance Scripts */}
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 border-l-4 border-l-orange-500">
                    <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <Save className="w-5 h-5 text-orange-500" />
                            Maintenance Scripts & Migrations
                        </h2>
                    </div>
                    <div className="p-6">
                        <div className="flex items-center justify-between p-4 bg-orange-50 dark:bg-orange-900/10 rounded-lg border border-orange-100 dark:border-orange-900/50">
                            <div>
                                <p className="font-bold text-gray-900 dark:text-white">Initialize Trust Scores</p>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                    Calculate and populate 'trustScore' and 'riskLevel' for all existing users based on current data.
                                    <br /><span className="text-xs text-orange-600">Run this once after deploying Trust & Safety module.</span>
                                </p>
                            </div>
                            <button
                                onClick={async () => {
                                    if (!adminUser) return
                                    if (!confirm('Are you sure you want to run this migration? It may take a while.')) return;
                                    try {
                                        const { runTrustScoreMigration } = await import('@/lib/admin/system-scripts')
                                        const res = await runTrustScoreMigration(adminUser)
                                        alert(`Migration Complete!\nProcessed: ${res.processed}\nUpdated: ${res.updated}\nErrors: ${res.errors}`)
                                    } catch (e) {
                                        alert('Migration Failed. Check console.')
                                    }
                                }}
                                className="px-4 py-2 bg-white border border-gray-300 shadow-sm rounded-lg text-sm font-medium hover:bg-gray-50 text-gray-700"
                            >
                                Run Script
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    )
}
