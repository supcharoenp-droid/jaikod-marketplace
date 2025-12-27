'use client'

import { useState } from 'react'
import { Flag } from 'lucide-react'
import ReportModal from './ReportModal'
import { ReportTargetType } from '@/lib/report/types'

interface ReportButtonProps {
    targetType: ReportTargetType
    targetId: string
    targetTitle?: string
    reporterId: string
    variant?: 'icon' | 'text' | 'full'
    className?: string
}

export default function ReportButton({
    targetType,
    targetId,
    targetTitle,
    reporterId,
    variant = 'icon',
    className = ''
}: ReportButtonProps) {
    const [isModalOpen, setIsModalOpen] = useState(false)

    const baseClasses = "flex items-center gap-2 transition-colors"

    const variantClasses = {
        icon: "p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full",
        text: "text-sm text-gray-500 hover:text-red-500",
        full: "px-4 py-2 text-sm text-gray-600 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
    }

    return (
        <>
            <button
                onClick={() => setIsModalOpen(true)}
                className={`${baseClasses} ${variantClasses[variant]} ${className}`}
                title="รายงาน"
            >
                <Flag className="w-4 h-4" />
                {variant !== 'icon' && <span>รายงาน</span>}
            </button>

            <ReportModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                targetType={targetType}
                targetId={targetId}
                targetTitle={targetTitle}
                reporterId={reporterId}
            />
        </>
    )
}
