'use client'

import { useState, useEffect } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import {
    Zap, Terminal, Settings, UserCheck,
    Globe
} from 'lucide-react'
import {
    toggleDevMode,
    updateUserOnboarding,
    simulateAIResponse,
} from '@/lib/admin/system-service'
import { useLanguage } from '@/contexts/LanguageContext'

export default function DevToolsPage() {
    const { t } = useLanguage()
    const [devMode, setDevMode] = useState(false)
    const [loading, setLoading] = useState(false)
    const [result, setResult] = useState<any>(null)

    // Forms
    const [onboardUserId, setOnboardUserId] = useState('')
    const [onboardStep, setOnboardStep] = useState(1)

    const [aiPrompt, setAiPrompt] = useState('')
    const [aiType, setAiType] = useState<'description' | 'price' | 'moderation'>('description')

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setDevMode(localStorage.getItem('NEXT_PUBLIC_DEV_MODE') === 'true')
        }
    }, [])

    const handleToggleDev = async () => {
        const newState = !devMode
        setDevMode(newState)
        await toggleDevMode(newState)
    }

    const handleOnboardOverride = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        const res = await updateUserOnboarding(onboardUserId, onboardStep, onboardStep === 4)
        setResult(res)
        setLoading(false)
    }

    const handleSimulateAI = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        const res = await simulateAIResponse(aiPrompt, aiType)
        setResult(res)
        setLoading(false)
    }

    return (
        <AdminLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <Terminal className="w-8 h-8 text-purple-600" />
                            {t('admin.menu_system_devtools')}
                        </h1>
                        <p className="text-gray-500">
                            {t('admin.devtools_desc')}
                        </p>
                    </div>
                </div>

                {/* System Toggles */}
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
                    <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                        <Settings className="w-5 h-5" />
                        {t('admin.devtools_switches')}
                    </h2>
                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                        <div>
                            <div className="font-bold">{t('admin.devtools_bypass')}</div>
                            <div className="text-sm text-gray-500">
                                {t('admin.devtools_bypass_desc')}
                            </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                className="sr-only peer"
                                checked={devMode}
                                onChange={handleToggleDev}
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                        </label>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Onboarding Override */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
                        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                            <UserCheck className="w-5 h-5 text-blue-500" />
                            {t('admin.devtools_title_onboarding') || t('admin.devtools_onboarding')}
                        </h2>
                        <form onSubmit={handleOnboardOverride} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">{t('admin.devtools_label_userid')}</label>
                                <input
                                    type="text"
                                    required
                                    value={onboardUserId}
                                    onChange={e => setOnboardUserId(e.target.value)}
                                    className="w-full px-3 py-2 border rounded-lg dark:bg-gray-900 dark:border-gray-700"
                                    placeholder={t('admin.devtools_ph_uid')}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">{t('admin.devtools_label_step')}</label>
                                <input
                                    type="range"
                                    min="1"
                                    max="4"
                                    value={onboardStep}
                                    onChange={e => setOnboardStep(Number(e.target.value))}
                                    className="w-full"
                                />
                                <div className="flex justify-between text-xs text-gray-500">
                                    <span>{t('admin.devtools_step_start')}</span>
                                    <span>{t('admin.devtools_step_profile')}</span>
                                    <span>{t('admin.devtools_step_store')}</span>
                                    <span>{t('admin.devtools_step_complete')}</span>
                                </div>
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold disabled:opacity-50"
                            >
                                {loading ? t('common.loading') : t('admin.devtools_btn_update')}
                            </button>
                        </form>
                    </div>

                    {/* AI Simulator */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
                        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                            <Zap className="w-5 h-5 text-yellow-500" />
                            {t('admin.devtools_ai')}
                        </h2>
                        <form onSubmit={handleSimulateAI} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">{t('admin.devtools_label_type')}</label>
                                <select
                                    value={aiType}
                                    onChange={(e: any) => setAiType(e.target.value)}
                                    className="w-full px-3 py-2 border rounded-lg dark:bg-gray-900 dark:border-gray-700"
                                >
                                    <option value="description">{t('admin.devtools_opt_desc')}</option>
                                    <option value="price">{t('admin.devtools_opt_price')}</option>
                                    <option value="moderation">{t('admin.devtools_opt_mod')}</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">{t('admin.devtools_label_prompt')}</label>
                                <textarea
                                    required
                                    value={aiPrompt}
                                    onChange={e => setAiPrompt(e.target.value)}
                                    className="w-full px-3 py-2 border rounded-lg dark:bg-gray-900 dark:border-gray-700 h-24"
                                    placeholder={t('admin.devtools_ph_prompt')}
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg font-bold disabled:opacity-50"
                            >
                                {loading ? t('admin.devtools_btn_simulating') : t('admin.devtools_btn_simulate')}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Result Area */}
                {result && (
                    <div className="bg-gray-900 text-green-400 p-4 rounded-xl font-mono text-sm overflow-x-auto">
                        <h3 className="text-gray-500 uppercase text-xs mb-2">{t('admin.devtools_result_title')}</h3>
                        <pre>{JSON.stringify(result, null, 2)}</pre>
                        <button
                            onClick={() => setResult(null)}
                            className="mt-2 text-xs text-gray-500 hover:text-white"
                        >
                            {t('admin.devtools_result_clear')}
                        </button>
                    </div>
                )}
            </div>
        </AdminLayout>
    )
}
