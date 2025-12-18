'use client'
import AdminPagePlaceholder from '@/components/admin/AdminPagePlaceholder'
import { useLanguage } from '@/contexts/LanguageContext'
import { CheckCircle } from 'lucide-react'

export default function ContentApprovedPage() {
    const { t } = useLanguage()
    return <AdminPagePlaceholder title={t('admin.menu_content_approved')} icon={CheckCircle} />
}
