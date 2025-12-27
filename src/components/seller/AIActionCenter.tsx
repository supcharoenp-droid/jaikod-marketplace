'use client'

import React from 'react'
import { Sparkles, ArrowRight, Package, RefreshCw, DollarSign, TrendingUp } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

export default function AIActionCenter() {
    const { t, language } = useLanguage()

    // Mock Tasks with bilingual support
    const tasks = [
        {
            id: 1,
            type: 'optimize',
            title: {
                th: 'ปรับปรุง "กล้องวินเทจ"',
                en: 'Optimize "Vintage Camera"'
            },
            desc: {
                th: 'เพิ่ม 3 แท็กที่ขาดหาย เพื่อเพิ่มการค้นหา +20%',
                en: 'Add 3 missing tags to improve search +20%'
            },
            impact: 'high',
            icon: Sparkles,
            color: 'text-purple-500',
            bg: 'bg-purple-100 dark:bg-purple-900/30'
        },
        {
            id: 2,
            type: 'inventory',
            title: {
                th: 'เติมสต็อก "เลนส์ Sony"',
                en: 'Restock "Sony Lens"'
            },
            desc: {
                th: 'สต็อกเหลือน้อย (เหลือ 2 ชิ้น) สั่งเติมตอนนี้',
                en: 'Stock low (2 remaining). Reorder now.'
            },
            impact: 'medium',
            icon: Package,
            color: 'text-blue-500',
            bg: 'bg-blue-100 dark:bg-blue-900/30'
        },
        {
            id: 3,
            type: 'pricing',
            title: {
                th: 'แจ้งเตือนราคา: Canon AE-1',
                en: 'Price Alert: Canon AE-1'
            },
            desc: {
                th: 'ราคาตลาดเพิ่มขึ้น 10% แนะนำปรับเป็น ฿4,500',
                en: 'Market price rose 10%. Adjust to ฿4,500.'
            },
            impact: 'high',
            icon: DollarSign,
            color: 'text-emerald-500',
            bg: 'bg-emerald-100 dark:bg-emerald-900/30'
        }
    ]

    // Get text based on language
    const getText = (textObj: { th: string; en: string }) => {
        return language === 'th' ? textObj.th : textObj.en
    }

    return (
        <div className="bg-white dark:bg-surface-dark border border-gray-100 dark:border-gray-800 rounded-xl p-6 shadow-sm h-full">
            <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-6">
                <Sparkles className="w-5 h-5 text-neon-purple" />
                {t('ศูนย์ปฏิบัติการ AI', 'AI Action Center')}
            </h3>

            <div className="space-y-4">
                {tasks.map(task => (
                    <div
                        key={task.id}
                        className="group p-4 border border-gray-100 dark:border-gray-800 rounded-xl hover:border-indigo-200 dark:hover:border-indigo-800 hover:shadow-md transition-all cursor-pointer bg-white dark:bg-surface-dark"
                    >
                        <div className="flex gap-4">
                            <div className={`p-3 rounded-xl ${task.bg} ${task.color} h-fit`}>
                                <task.icon className="w-5 h-5" />
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between items-start gap-2">
                                    <h4 className="font-bold text-gray-800 dark:text-gray-200 text-sm">
                                        {getText(task.title)}
                                    </h4>
                                    {task.impact === 'high' && (
                                        <span className="text-[10px] uppercase font-black tracking-wider text-white bg-gradient-to-r from-pink-500 to-rose-500 px-2 py-0.5 rounded-full shadow-sm shadow-rose-200 dark:shadow-none whitespace-nowrap">
                                            {t('ผลกระทบสูง', 'High Impact')}
                                        </span>
                                    )}
                                </div>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">
                                    {getText(task.desc)}
                                </p>
                            </div>
                            <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity -mr-2">
                                <ArrowRight className="w-4 h-4 text-gray-400" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <button className="w-full mt-6 py-2 text-sm font-bold text-gray-500 dark:text-gray-400 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors">
                {t('ดูคำแนะนำทั้งหมด', 'View All Suggestions')}
            </button>
        </div>
    )
}
