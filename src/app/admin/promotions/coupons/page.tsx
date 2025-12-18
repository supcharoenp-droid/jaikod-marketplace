'use client'
import AdminPagePlaceholder from '@/components/admin/AdminPagePlaceholder'
import { Ticket } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

export default function CouponsPage() {
    const { t } = useLanguage()
    return <AdminPagePlaceholder title={t('admin.menu_promotions_coupons')} icon={Ticket} />
}
