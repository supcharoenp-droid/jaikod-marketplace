'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAdmin } from '@/contexts/AdminContext'
import { useAuth } from '@/contexts/AuthContext'

export default function AdminGuard({ children }: { children: React.ReactNode }) {
    const router = useRouter()
    const pathname = usePathname()
    const { user, loading: authLoading } = useAuth()
    const { isAdmin, loading: adminLoading } = useAdmin()

    useEffect(() => {
        // Skip check on login page
        if (pathname === '/admin/login') return

        // Wait for auth to load
        if (authLoading || adminLoading) return

        // Not logged in -> redirect to login
        if (!user) {
            router.push('/admin/login')
            return
        }

        // Logged in but not admin -> redirect to login with error
        if (!isAdmin) {
            router.push('/admin/login?error=unauthorized')
            return
        }
    }, [user, isAdmin, authLoading, adminLoading, pathname, router])

    // Show loading while checking
    if (authLoading || adminLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">กำลังตรวจสอบสิทธิ์...</p>
                </div>
            </div>
        )
    }

    // Not logged in or not admin
    if (!user || !isAdmin) {
        return null
    }

    // Authorized - show content
    return <>{children}</>
}
