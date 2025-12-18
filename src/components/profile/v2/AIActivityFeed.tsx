'use client'

import React from 'react'
import { Sparkles, ArrowRight, Wand2 } from 'lucide-react'
import { motion } from 'framer-motion'
import { useLanguage } from '@/contexts/LanguageContext'

export default function AIActivityFeed() {
    const { t } = useLanguage()

    const activities = [
        {
            id: '1',
            type: 'insight',
            title: t('profile.ai_feed_insight_title'),
            message: t('profile.ai_feed_insight_desc'),
            time: '2m ago',
            icon: Wand2,
            color: 'text-indigo-600',
            bg: 'bg-indigo-50'
        },
        {
            id: '2',
            type: 'suggestion',
            title: t('profile.ai_feed_suggest_title'),
            message: t('profile.ai_feed_suggest_desc'),
            time: '1h ago',
            icon: Sparkles,
            color: 'text-amber-500',
            bg: 'bg-amber-50'
        }
    ]

    return (
        <div className="bg-gradient-to-br from-indigo-900 via-violet-900 to-purple-900 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden mb-8">
            {/* Background Effects */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-neon-purple/20 rounded-full blur-2xl -ml-24 -mb-24"></div>

            <div className="relative z-10 flex flex-col md:flex-row gap-8">
                {/* Header */}
                <div className="md:w-1/3">
                    <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold mb-4 border border-white/10">
                        <Sparkles className="w-3 h-3 text-yellow-300 animate-pulse" />
                        <span>AI Activity Feed</span>
                    </div>
                    <h3 className="text-2xl font-bold mb-2">Real-time Insights</h3>
                    <p className="text-indigo-200 text-sm leading-relaxed mb-6">
                        AI helps analyze your buying and selling habits to suggest the best opportunities.
                    </p>
                    <button className="text-sm font-bold text-white bg-white/20 hover:bg-white/30 px-5 py-2.5 rounded-xl transition-all flex items-center gap-2 w-fit">
                        View All Activity <ArrowRight className="w-4 h-4" />
                    </button>
                </div>

                {/* Feed List */}
                <div className="md:w-2/3 space-y-4">
                    {activities.map((item, idx) => (
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            key={item.id}
                            className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-4 flex items-start gap-4 hover:bg-white/15 transition-colors cursor-pointer"
                        >
                            <div className={`p-3 rounded-xl bg-white/10 text-white shrink-0`}>
                                <item.icon className="w-5 h-5" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-start mb-1">
                                    <h4 className="font-bold text-white truncate pr-4">{item.title}</h4>
                                    <span className="text-xs text-indigo-300 whitespace-nowrap">{item.time}</span>
                                </div>
                                <p className="text-sm text-indigo-100 line-clamp-2">{item.message}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    )
}
