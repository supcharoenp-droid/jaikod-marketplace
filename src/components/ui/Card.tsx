'use client'

import { cn } from '@/lib/utils'

interface CardProps {
    children: React.ReactNode
    className?: string
    hover?: boolean
    onClick?: () => void
}

export default function Card({ children, className, hover = false, onClick }: CardProps) {
    return (
        <div
            className={cn(
                'card',
                hover && 'card-hover cursor-pointer',
                className
            )}
            onClick={onClick}
        >
            {children}
        </div>
    )
}
