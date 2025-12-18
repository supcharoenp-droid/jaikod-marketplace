'use client'
import AdminPagePlaceholder from '@/components/admin/AdminPagePlaceholder'
import { Wallet } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

export default function SellerWalletsPage() {
    const { t } = useLanguage()
    return <AdminPagePlaceholder title={t('admin.menu_sellers_wallets')} icon={Wallet} />
}
