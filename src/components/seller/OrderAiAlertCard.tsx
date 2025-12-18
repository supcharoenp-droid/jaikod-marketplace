'use client'

import { motion } from 'framer-motion'
import { AlertTriangle, MessageCircle, Star, TrendingUp } from 'lucide-react'
import { OrderAiAlert } from '@/lib/order-ai'

interface OrderAiAlertCardProps {
    alert: OrderAiAlert
    language: 'th' | 'en'
    onDismiss?: () => void
}

export default function OrderAiAlertCard({ alert, language, onDismiss }: OrderAiAlertCardProps) {
    const severityStyles = {
        high: {
            bg: 'bg-red-50 dark:bg-red-900/20',
            border: 'border-red-300 dark:border-red-700',
            text: 'text-red-700 dark:text-red-300',
            icon: 'text-red-500'
        },
        medium: {
            bg: 'bg-amber-50 dark:bg-amber-900/20',
            border: 'border-amber-300 dark:border-amber-700',
            text: 'text-amber-700 dark:text-amber-300',
            icon: 'text-amber-500'
        },
        low: {
            bg: 'bg-blue-50 dark:bg-blue-900/20',
            border: 'border-blue-300 dark:border-blue-700',
            text: 'text-blue-700 dark:text-blue-300',
            icon: 'text-blue-500'
        }
    }

    const style = severityStyles[alert.severity]

    const typeIcons = {
        late_shipping: AlertTriangle,
        customer_message: MessageCircle,
        review_warning: Star,
        payment_issue: TrendingUp
    }

    const Icon = typeIcons[alert.type]

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className={`${style.bg} border-2 ${style.border} rounded-xl p-4`}
        >
            <div className="flex items-start gap-3">
                <div className={`${style.icon} flex-shrink-0 mt-0.5`}>
                    <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                    <h4 className={`font-bold ${style.text} mb-1`}>
                        {alert.title[language]}
                    </h4>
                    <p className={`text-sm ${style.text} opacity-90 leading-relaxed`}>
                        {alert.message[language]}
                    </p>
                    {alert.action && (
                        <button
                            onClick={alert.action.onClick}
                            className={`mt-3 text-sm font-bold ${style.text} hover:underline`}
                        >
                            {alert.action.label[language]} →
                        </button>
                    )}
                </div>
                {onDismiss && (
                    <button
                        onClick={onDismiss}
                        className={`${style.text} opacity-50 hover:opacity-100 transition-opacity flex-shrink-0`}
                    >
                        ✕
                    </button>
                )}
            </div>
        </motion.div>
    )
}

// Message Suggestion Component
export function MessageSuggestionCard({
    suggestions,
    onSelect
}: {
    suggestions: string[]
    onSelect: (message: string) => void
}) {
    return (
        <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
                <MessageCircle className="w-4 h-4 text-purple-600" />
                <h4 className="font-bold text-purple-900 dark:text-purple-100 text-sm">
                    AI แนะนำข้อความ
                </h4>
            </div>
            <div className="space-y-2">
                {suggestions.map((msg, index) => (
                    <button
                        key={index}
                        onClick={() => onSelect(msg)}
                        className="w-full text-left p-3 bg-white dark:bg-gray-800 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:shadow-md transition-shadow border border-purple-100 dark:border-purple-800"
                    >
                        {msg}
                    </button>
                ))}
            </div>
        </div>
    )
}
