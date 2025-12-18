
'use client'

import { ReactNode } from 'react'
import { useSystemConfig, SystemModule } from '@/lib/system-config'
import { AlertCircle } from 'lucide-react'

interface FeatureGuardProps {
    module: SystemModule
    children: ReactNode
    fallback?: ReactNode // What to show if disabled (default: null)
    showWarning?: boolean // Show a warning banner instead of disappearing?
}

export default function FeatureGuard({
    module,
    children,
    fallback = null,
    showWarning = false
}: FeatureGuardProps) {
    const { isModuleEnabled, loading } = useSystemConfig()

    // Don't hide while loading to prevent flickering (or show loader?)
    // Strategy: Optimistically show if loading, check later? No, safer to wait or cache.
    // For now, if loading, we render nothing or skeleton? Let's render children to be fast and hide later.
    // Actually, secure approach: default off.

    if (loading) return null // Or Skeleton

    if (isModuleEnabled(module)) {
        return <>{children}</>
    }

    // Module Disabled
    if (showWarning) {
        return (
            <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg flex items-center gap-3 text-yellow-800 dark:text-yellow-200">
                <AlertCircle className="w-5 h-5" />
                <div>
                    <h4 className="font-bold text-sm">Feature Temporarily Unavailable</h4>
                    <p className="text-xs opacity-80">The {module} system is currently undergoing maintenance.</p>
                </div>
            </div>
        )
    }

    return <>{fallback}</>
}
