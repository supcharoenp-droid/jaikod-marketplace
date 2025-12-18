
'use client'

import { ReactNode } from 'react'
import { useAdmin } from '@/contexts/AdminContext'
import { canPerform, hasAllPermissions, hasAnyPermission } from '@/lib/rbac'
import { Permission } from '@/types/admin'
import { Lock } from 'lucide-react'

interface PermissionGuardProps {
    children: ReactNode
    /** Single permission to check */
    permission?: Permission
    /** Multiple permissions (All required if logic='AND', Any if logic='OR') */
    permissions?: Permission[]
    /** Logic for multiple permissions */
    logic?: 'AND' | 'OR'
    /** Fallback content if permission denied */
    fallback?: ReactNode
    /** If true, show a simple lock icon/tooltip instead of hiding completely */
    showLock?: boolean
}

export default function PermissionGuard({
    children,
    permission,
    permissions,
    logic = 'AND',
    fallback = null,
    showLock = false
}: PermissionGuardProps) {
    const { adminUser, loading } = useAdmin()

    // 1. Loading state: render nothing or fallback? 
    // Usually best to wait to avoid flashing restricted content.
    if (loading) return null

    if (!adminUser) return <>{fallback}</>

    let hasAccess = false

    // 2. Check Logic
    if (permission) {
        hasAccess = canPerform(adminUser, permission)
    } else if (permissions && permissions.length > 0) {
        if (logic === 'AND') {
            hasAccess = hasAllPermissions(adminUser.role, permissions)
            // Note: rbac.ts helper checks 'Role' level.
            // If we want granular user check for arrays, we might need to extend rbac.ts or loop here.
            // For strict correctness, let's loop canPerform which handles both Role & User overrides.
            hasAccess = permissions.every(p => canPerform(adminUser, p))
        } else {
            hasAccess = permissions.some(p => canPerform(adminUser, p))
        }
    } else {
        // No checks defined? Allow by default or block?
        // Safe default: Block if used improperly
        console.warn('PermissionGuard used without permission props')
        return <>{fallback}</>
    }

    // 3. Render
    if (hasAccess) {
        return <>{children}</>
    }

    // 4. Fallback or Lock UI
    if (showLock) {
        return (
            <div className="opacity-50 cursor-not-allowed relative group inline-block">
                <div className="pointer-events-none grayscale blur-[1px] select-none">
                    {children}
                </div>
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100/10 rounded">
                    <Lock className="w-5 h-5 text-gray-500" />
                </div>
            </div>
        )
    }

    return <>{fallback}</>
}
