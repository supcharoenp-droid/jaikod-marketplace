'use client'
import AdminPagePlaceholder from '@/components/admin/AdminPagePlaceholder'
import { useLanguage } from '@/contexts/LanguageContext'
import { XCircle } from 'lucide-react'

export default function ContentRejectedPage() {
    const { t } = useLanguage()
    return <AdminPagePlaceholder title={t('admin.menu_content_rejected')} icon={XCircle} />
}
