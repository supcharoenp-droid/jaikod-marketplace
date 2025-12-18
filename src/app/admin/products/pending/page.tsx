'use client'
import AdminPagePlaceholder from '@/components/admin/AdminPagePlaceholder'
import { PackageSearch } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

export default function PendingProductsPage() {
    const { t } = useLanguage()
    return <AdminPagePlaceholder title={t('admin.menu_products_pending')} icon={PackageSearch} />
}
