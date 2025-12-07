'use client'

import React from 'react'
import { Construction } from 'lucide-react'

export default function UnderConstructionPage({ title }: { title: string }) {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8 bg-white dark:bg-surface-dark rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800">
            <div className="w-24 h-24 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mb-6 animate-bounce-slow">
                <Construction className="w-12 h-12 text-orange-500" />
            </div>
            <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-white mb-4">
                {title}
            </h1>
            <p className="text-lg text-text-secondary dark:text-gray-400 max-w-md mb-8">
                เรากำลังพัฒนาระบบส่วนนี้ เพื่อให้คุณใช้งานได้อย่างมีประสิทธิภาพสูงสุด เร็วๆ นี้!
            </p>
            <div className="flex gap-2 text-sm text-gray-400">
                <span className="px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800">Phase 2</span>
                <span className="px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800">Coming Soon</span>
            </div>
        </div>
    )
}
