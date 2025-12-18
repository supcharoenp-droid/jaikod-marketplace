'use client'
import AdminPagePlaceholder from '@/components/admin/AdminPagePlaceholder'
import { Rocket } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

export default function BoostPage() {
    const { t } = useLanguage()
    return <AdminPagePlaceholder title={t('admin.menu_promotions_boost')} icon={Rocket} />
}
