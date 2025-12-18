'use client'

import AdminLayout from '@/components/admin/AdminLayout'
import { LucideIcon, Construction } from 'lucide-react'

import { useLanguage } from '@/contexts/LanguageContext'

interface AdminPagePlaceholderProps {
    title: string
    description?: string
    icon?: LucideIcon
}

export default function AdminPagePlaceholder({ title, description, icon: Icon }: AdminPagePlaceholderProps) {
    const { t } = useLanguage()
    return (
        <AdminLayout>
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
                <div className="w-20 h-20 bg-purple-50 dark:bg-purple-900/20 rounded-full flex items-center justify-center mb-6">
                    {Icon ? (
                        <Icon className="w-10 h-10 text-purple-500" />
                    ) : (
                        <Construction className="w-10 h-10 text-purple-500" />
                    )}
                </div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">{title}</h1>
                <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-8 text-lg">
                    {description || t('admin.under_development_desc')}
                </p>
                <button
                    onClick={() => window.history.back()}
                    className="px-6 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg font-medium transition-colors"
                >
                    {t('common.back')}
                </button>
            </div>
        </AdminLayout>
    )
}
