'use client'
import AdminPagePlaceholder from '@/components/admin/AdminPagePlaceholder'
import { Ban } from 'lucide-react'

export default function BannedUsersPage() {
    return <AdminPagePlaceholder title="ผู้ใช้ถูกระงับ (Banned Users)" icon={Ban} />
}
