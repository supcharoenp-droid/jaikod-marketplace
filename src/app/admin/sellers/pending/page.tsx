'use client'
import AdminPagePlaceholder from '@/components/admin/AdminPagePlaceholder'
import { UserCog } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

export default function PendingSellersPage() {
    const { t } = useLanguage()
    return <AdminPagePlaceholder title={t('admin.menu_sellers_pending')} icon={UserCog} />
}
