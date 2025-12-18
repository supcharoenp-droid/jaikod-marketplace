'use client'

import React from 'react'
import { motion } from 'framer-motion'
import Button from '@/components/ui/Button'
import { LucideIcon } from 'lucide-react'

interface EmptyStateProps {
    icon: LucideIcon
    title: string
    description: string
    actionLabel: string
    onAction: () => void
    color?: string
}

export default function EmptyState({ icon: Icon, title, description, actionLabel, onAction, color = 'text-gray-400' }: EmptyStateProps) {
    return (
        <div className="flex flex-col items-center justify-center py-16 px-4 bg-gray-50 dark:bg-card-dark/30 rounded-3xl border border-dashed border-gray-200 dark:border-border-dark text-center">
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className={`w-20 h-20 bg-white dark:bg-card-dark rounded-full flex items-center justify-center mb-6 shadow-sm border border-gray-100 dark:border-border-dark`}
            >
                <Icon className={`w-10 h-10 ${color}`} />
            </motion.div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{title}</h3>
            <p className="text-gray-500 dark:text-gray-400 max-w-sm mb-8 leading-relaxed">
                {description}
            </p>
            <Button
                variant="primary"
                onClick={onAction}
                className="shadow-lg shadow-neon-purple/20 px-8"
            >
                {actionLabel}
            </Button>
        </div>
    )
}
