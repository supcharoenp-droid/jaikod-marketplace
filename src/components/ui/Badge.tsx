'use client'

import { cn } from '@/lib/utils'

interface BadgeProps {
    children: React.ReactNode
    variant?: 'verified' | 'new' | 'hot' | 'default'
    className?: string
}

export default function Badge({ children, variant = 'default', className }: BadgeProps) {
    const variants = {
        verified: 'badge-verified',
        new: 'badge-new',
        hot: 'badge-hot',
        default: 'badge bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200',
    }

    return (
        <span className={cn(variants[variant], className)}>
            {children}
        </span>
    )
}
