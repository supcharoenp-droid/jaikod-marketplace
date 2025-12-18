'use client'

import React from 'react'
import { Crown, Sparkles, MapPin, Calendar, Edit3, Eye, TrendingUp, Award, Zap } from 'lucide-react'
import { motion } from 'framer-motion'
import { useAuth } from '@/contexts/AuthContext'
import { useLanguage } from '@/contexts/LanguageContext'

interface ProfileHeaderProps {
    onEdit?: () => void
}

export default function ProfileHeader({ onEdit }: ProfileHeaderProps) {
    const { user } = useAuth()
    const { t } = useLanguage()

    // Mock Dynamic Data (Simulating Real-time)
    const stats = [
        { label: t('profile.stat_coins'), value: '2,450', icon: Zap, color: 'text-yellow-500', bg: 'bg-yellow-100' },
        { label: t('profile.stat_points'), value: '850', icon: Award, color: 'text-purple-500', bg: 'bg-purple-100' },
        { label: t('profile.stat_level'), value: 'Gold', icon: Crown, color: 'text-orange-500', bg: 'bg-orange-100' },
    ]

    // AI Dynamic Greeting
    const hour = new Date().getHours()
    let greeting = t('profile.greeting_day')
    if (hour < 12) greeting = t('profile.greeting_morning')
    else if (hour > 18) greeting = t('profile.greeting_evening')

    const aiTip = t('profile.ai_tip_trust')

    return (
        <div className="relative mb-12">
            {/* Banner Background with Animated Gradient */}
            <div className="h-48 md:h-64 w-full rounded-b-[2.5rem] overflow-hidden relative shadow-lg group">
                <div className="absolute inset-0 bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 animate-gradient-xy"></div>
                <div className="absolute inset-0 bg-[url('/patterns/grid.svg')] opacity-20"></div>
                <div className="absolute inset-0 bg-black/10 backdrop-blur-[1px]"></div>

                {/* Decorative & Motion Elements */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1 }}
                    className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl"
                />
                <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, delay: 0.2 }}
                    className="absolute bottom-0 left-0 w-64 h-64 bg-pink-500/20 rounded-full -ml-10 -mb-10 blur-3xl"
                />
            </div>

            {/* Profile Content Container */}
            <div className="container mx-auto px-4 sm:px-6 absolute top-28 md:top-40 left-0 right-0">
                <div className="bg-white/80 dark:bg-card-dark/90 backdrop-blur-xl rounded-3xl p-6 md:p-8 shadow-xl border border-white/60 dark:border-white/10 flex flex-col md:flex-row items-center md:items-end gap-6 relative">

                    {/* Glowing Avatar */}
                    <div className="absolute -top-16 md:-top-20 left-1/2 md:left-8 -translate-x-1/2 md:translate-x-0 group cursor-pointer">
                        <div className="relative w-32 h-32 md:w-40 md:h-40">
                            {/* Glow Effect */}
                            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-neon-purple to-pink-500 blur-xl opacity-40 group-hover:opacity-70 transition-opacity duration-500"></div>
                            <div className="w-full h-full rounded-full p-1 bg-white dark:bg-card-dark relative z-10">
                                <img
                                    src={user?.photoURL || 'https://via.placeholder.com/150'}
                                    alt={user?.displayName || 'User'}
                                    className="w-full h-full rounded-full object-cover border-4 border-white dark:border-card-dark shadow-sm"
                                />
                            </div>
                            {/* Level Badge */}
                            <div className="absolute bottom-1 right-1 z-20 bg-gradient-to-r from-amber-400 to-orange-500 text-white p-1.5 rounded-full ring-4 ring-white dark:ring-card-dark shadow-lg" title="Gold Member">
                                <Crown className="w-5 h-5 fill-current" />
                            </div>
                        </div>
                    </div>

                    {/* Spacer for Avatar on Desktop */}
                    <div className="md:w-44 hidden md:block shrink-0"></div>

                    {/* Info Section */}
                    <div className="flex-1 text-center md:text-left mt-16 md:mt-0 w-full">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                                <div className="flex flex-col md:flex-row md:items-center gap-2 mb-1 justify-center md:justify-start">
                                    <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">{user?.displayName}</h1>
                                </div>
                                <div className="flex items-center justify-center md:justify-start gap-2 text-sm mb-4">
                                    <span className="text-gray-500 dark:text-gray-400">{greeting}, {user?.displayName?.split(' ')[0]}!</span>
                                    <span className="px-2 py-0.5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-300 rounded-full text-xs font-bold flex items-center gap-1">
                                        <Sparkles className="w-3 h-3" />
                                        {aiTip}
                                    </span>
                                </div>
                            </div>

                            {/* Stats Widget */}
                            <div className="flex items-center justify-center md:justify-end gap-3 md:gap-6 bg-gray-50 dark:bg-white/5 rounded-2xl p-3 md:p-4 border border-gray-100 dark:border-white/5 shadow-inner">
                                {stats.map((stat, idx) => (
                                    <div key={idx} className="flex flex-col items-center min-w-[60px]">
                                        <div className="flex items-center gap-1.5 mb-1">
                                            <stat.icon className={`w-3.5 h-3.5 ${stat.color}`} />
                                            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">{stat.label}</span>
                                        </div>
                                        <span className="text-lg font-black text-gray-900 dark:text-white">{stat.value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
