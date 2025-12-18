'use client'
import AdminPagePlaceholder from '@/components/admin/AdminPagePlaceholder'
import { AlertTriangle } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

export default function ReportedProductsPage() {
    const { t } = useLanguage()
    return <AdminPagePlaceholder title={t('admin.menu_products_reported')} icon={AlertTriangle} />
}
