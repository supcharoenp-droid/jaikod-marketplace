'use client'

/**
 * ============================================
 * Star Rating Input
 * ============================================
 * 
 * Interactive star rating component
 */

import React, { useState } from 'react'
import { Star } from 'lucide-react'
import { motion } from 'framer-motion'

interface StarRatingInputProps {
    value: number
    onChange: (value: number) => void
    size?: 'sm' | 'md' | 'lg'
    disabled?: boolean
    showLabel?: boolean
}

const labels = {
    1: { th: 'แย่มาก', en: 'Terrible' },
    2: { th: 'แย่', en: 'Poor' },
    3: { th: 'พอใช้', en: 'Average' },
    4: { th: 'ดี', en: 'Good' },
    5: { th: 'ยอดเยี่ยม', en: 'Excellent' }
}

const sizeClasses = {
    sm: 'w-5 h-5',
    md: 'w-7 h-7',
    lg: 'w-10 h-10'
}

export default function StarRatingInput({
    value,
    onChange,
    size = 'md',
    disabled = false,
    showLabel = true
}: StarRatingInputProps) {
    const [hoverValue, setHoverValue] = useState(0)

    const displayValue = hoverValue || value

    return (
        <div className="flex flex-col items-center gap-2">
            <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <motion.button
                        key={star}
                        type="button"
                        disabled={disabled}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => onChange(star)}
                        onMouseEnter={() => setHoverValue(star)}
                        onMouseLeave={() => setHoverValue(0)}
                        className={`
                            ${sizeClasses[size]} 
                            transition-colors 
                            disabled:cursor-not-allowed
                            ${disabled ? 'opacity-50' : 'cursor-pointer'}
                        `}
                    >
                        <Star
                            className={`
                                w-full h-full transition-all
                                ${displayValue >= star
                                    ? 'text-amber-400 fill-amber-400'
                                    : 'text-gray-300 dark:text-gray-600'
                                }
                            `}
                        />
                    </motion.button>
                ))}
            </div>

            {showLabel && displayValue > 0 && (
                <motion.span
                    key={displayValue}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`
                        text-sm font-medium
                        ${displayValue >= 4 ? 'text-green-600 dark:text-green-400' : ''}
                        ${displayValue === 3 ? 'text-amber-600 dark:text-amber-400' : ''}
                        ${displayValue <= 2 ? 'text-red-600 dark:text-red-400' : ''}
                    `}
                >
                    {labels[displayValue as 1 | 2 | 3 | 4 | 5].th}
                </motion.span>
            )}
        </div>
    )
}
