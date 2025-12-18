'use client'

import { motion } from 'framer-motion'
import { Sparkles, Edit3, RefreshCw, Check } from 'lucide-react'
import { useState } from 'react'

interface SmartEditFieldProps {
    label: string
    value: string
    onChange: (value: string) => void
    onRegenerate?: () => void
    isAIGenerated?: boolean
    placeholder?: string
    rows?: number
    maxLength?: number
}

export default function SmartEditField({
    label,
    value,
    onChange,
    onRegenerate,
    isAIGenerated = false,
    placeholder = '',
    rows = 4,
    maxLength
}: SmartEditFieldProps) {
    const [isEditing, setIsEditing] = useState(false)
    const [isRegenerating, setIsRegenerating] = useState(false)

    const handleRegenerate = async () => {
        if (onRegenerate) {
            setIsRegenerating(true)
            await onRegenerate()
            setTimeout(() => setIsRegenerating(false), 1000)
        }
    }

    const handleApprove = () => {
        setIsEditing(false)
    }

    return (
        <div className="relative">
            {/* Label */}
            <label className="block text-sm font-medium text-gray-300 mb-2">
                {label}
                {maxLength && (
                    <span className="ml-2 text-xs text-gray-500">
                        {value.length}/{maxLength}
                    </span>
                )}
            </label>

            {/* Field Container */}
            <div className="relative">
                {/* AI Generated Badge */}
                {isAIGenerated && (
                    <motion.div
                        className="absolute -top-3 left-4 z-10 px-3 py-1 
                       bg-gradient-to-r from-purple-500 to-pink-500 
                       rounded-full text-xs font-bold text-white
                       flex items-center gap-1 shadow-lg"
                        initial={{ scale: 0, y: 10 }}
                        animate={{ scale: 1, y: 0 }}
                        transition={{ type: 'spring', delay: 0.2 }}
                    >
                        <Sparkles className="w-3 h-3" />
                        AI GENERATED
                    </motion.div>
                )}

                {/* Textarea */}
                <motion.textarea
                    value={value}
                    onChange={(e) => {
                        onChange(e.target.value)
                        setIsEditing(true)
                    }}
                    placeholder={placeholder}
                    rows={rows}
                    maxLength={maxLength}
                    className={`w-full p-4 pt-6 bg-gray-800/50 rounded-xl
                     text-gray-100 resize-none
                     transition-all duration-200
                     ${isAIGenerated
                            ? 'border-2 border-purple-500/30 focus:border-purple-500'
                            : 'border-2 border-gray-700 focus:border-blue-500'}
                     focus:ring-2 focus:ring-purple-500/20
                     ${isEditing ? 'shadow-lg shadow-purple-500/20' : ''}`}
                    whileFocus={{ scale: 1.01 }}
                />

                {/* Character Count Progress */}
                {maxLength && (
                    <div className="absolute bottom-2 right-2">
                        <div className="w-12 h-12 relative">
                            <svg className="transform -rotate-90 w-12 h-12">
                                <circle
                                    cx="24"
                                    cy="24"
                                    r="20"
                                    stroke="currentColor"
                                    strokeWidth="3"
                                    fill="none"
                                    className="text-gray-700"
                                />
                                <circle
                                    cx="24"
                                    cy="24"
                                    r="20"
                                    stroke="currentColor"
                                    strokeWidth="3"
                                    fill="none"
                                    strokeDasharray={`${2 * Math.PI * 20}`}
                                    strokeDashoffset={`${2 * Math.PI * 20 * (1 - value.length / maxLength)}`}
                                    className={`transition-all ${value.length > maxLength * 0.9
                                            ? 'text-red-500'
                                            : value.length > maxLength * 0.7
                                                ? 'text-yellow-500'
                                                : 'text-purple-500'
                                        }`}
                                />
                            </svg>
                        </div>
                    </div>
                )}
            </div>

            {/* Action Buttons */}
            {isAIGenerated && (
                <motion.div
                    className="flex gap-2 mt-3"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <motion.button
                        type="button"
                        onClick={() => setIsEditing(true)}
                        className="px-4 py-2 bg-gray-700 hover:bg-gray-600 
                       rounded-lg text-sm text-gray-200
                       transition-colors flex items-center gap-2"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <Edit3 className="w-4 h-4" />
                        แก้ไขเอง
                    </motion.button>

                    {onRegenerate && (
                        <motion.button
                            type="button"
                            onClick={handleRegenerate}
                            disabled={isRegenerating}
                            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 
                         rounded-lg text-sm text-white
                         transition-colors flex items-center gap-2
                         disabled:opacity-50 disabled:cursor-not-allowed"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <RefreshCw className={`w-4 h-4 ${isRegenerating ? 'animate-spin' : ''}`} />
                            {isRegenerating ? 'กำลังสร้างใหม่...' : 'สร้างใหม่'}
                        </motion.button>
                    )}

                    {isEditing && (
                        <motion.button
                            type="button"
                            onClick={handleApprove}
                            className="px-4 py-2 bg-green-600 hover:bg-green-700 
                         rounded-lg text-sm text-white
                         transition-colors flex items-center gap-2"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <Check className="w-4 h-4" />
                            ดูดีแล้ว
                        </motion.button>
                    )}
                </motion.div>
            )}
        </div>
    )
}
