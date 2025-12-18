'use client'
import AdminPagePlaceholder from '@/components/admin/AdminPagePlaceholder'
import { Ban } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

export default function SuspendedProductsPage() {
    const { t } = useLanguage()
    return <AdminPagePlaceholder title={t('admin.menu_products_suspended')} icon={Ban} />
}
