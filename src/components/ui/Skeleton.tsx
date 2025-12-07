'use client'

import { cn } from '@/lib/utils'

interface SkeletonProps {
    className?: string
    variant?: 'text' | 'circular' | 'rectangular'
}

export default function Skeleton({ className, variant = 'rectangular' }: SkeletonProps) {
    const variants = {
        text: 'h-4 w-full',
        circular: 'rounded-full',
        rectangular: 'rounded',
    }

    return (
        <div
            className={cn(
                'skeleton',
                variants[variant],
                className
            )}
        />
    )
}

export function ProductCardSkeleton() {
    return (
        <div className="card">
            <Skeleton className="w-full aspect-square mb-3" />
            <Skeleton variant="text" className="mb-2" />
            <Skeleton variant="text" className="w-3/4 mb-2" />
            <Skeleton variant="text" className="w-1/2" />
        </div>
    )
}
