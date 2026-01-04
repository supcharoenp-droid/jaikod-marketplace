'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'

interface TypingIndicatorProps {
    partnerName?: string
    partnerImage?: string
    className?: string
}

/**
 * TypingIndicator - แสดง animation เมื่อคู่สนทนากำลังพิมพ์
 * Feature จาก ChatSystemV2 ย้ายมาใช้ใน Production
 */
export default function TypingIndicator({
    partnerName = 'User',
    partnerImage,
    className = ''
}: TypingIndicatorProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className={`flex items-end gap-2 ${className}`}
        >
            {/* Avatar */}
            <div className="w-8 h-8 rounded-full overflow-hidden bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center text-white text-sm font-bold flex-shrink-0 shadow-sm">
                {partnerImage ? (
                    <Image
                        src={partnerImage}
                        alt={partnerName}
                        width={32}
                        height={32}
                        className="object-cover"
                    />
                ) : (
                    partnerName[0]?.toUpperCase() || '?'
                )}
            </div>

            {/* Typing Bubble */}
            <div className="bg-white dark:bg-gray-800 px-4 py-3 rounded-2xl rounded-bl-sm shadow-sm border border-gray-100 dark:border-gray-700">
                <div className="flex items-center gap-1.5">
                    <motion.div
                        className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full"
                        animate={{ y: [0, -5, 0] }}
                        transition={{ repeat: Infinity, duration: 0.6 }}
                    />
                    <motion.div
                        className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full"
                        animate={{ y: [0, -5, 0] }}
                        transition={{ repeat: Infinity, duration: 0.6, delay: 0.15 }}
                    />
                    <motion.div
                        className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full"
                        animate={{ y: [0, -5, 0] }}
                        transition={{ repeat: Infinity, duration: 0.6, delay: 0.3 }}
                    />
                </div>
            </div>

            {/* Label */}
            <span className="text-[10px] text-gray-400 dark:text-gray-500 mb-1">
                กำลังพิมพ์...
            </span>
        </motion.div>
    )
}
