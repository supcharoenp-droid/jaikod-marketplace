import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import useProfile from '@/hooks/useProfile'
import { useLanguage } from '@/contexts/LanguageContext'
import { generateAIGreeting, generateDevModeGreeting } from '@/lib/ai-greeting-engine'
import { Coins, Star, TrendingUp, Package, Crown, Zap } from 'lucide-react'

export default function ProfileHeaderAI() {
    const { user, stats, ordersSummary, roleMode, isLoading } = useProfile()
    const { t, language } = useLanguage()
    const [greeting, setGreeting] = useState<{ messageTh: string; messageEn: string } | null>(null)

    useEffect(() => {
        const currentHour = new Date().getHours()

        if (user) {
            const aiGreeting = generateAIGreeting({
                user,
                stats,
                ordersSummary,
                currentHour
            })
            setGreeting(aiGreeting)
        } else {
            // Dev mode or loading
            const devGreeting = generateDevModeGreeting(currentHour)
            setGreeting(devGreeting)
        }
    }, [user, stats, ordersSummary])

    if (isLoading) {
        return (
            <div className="animate-pulse bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-3xl p-8 mb-8">
                <div className="flex items-center gap-6">
                    <div className="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-full" />
                    <div className="flex-1 space-y-3">
                        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
                    </div>
                </div>
            </div>
        )
    }

    const greetingMessage = language === 'th' ? greeting?.messageTh : greeting?.messageEn

    // Role tag
    const getRoleTag = () => {
        if (roleMode === 'hybrid') return t('profile.header.role_hybrid')
        if (roleMode === 'seller') return t('profile.header.role_seller')
        return t('profile.header.role_buyer')
    }

    const getRoleColor = () => {
        if (roleMode === 'hybrid') return 'from-purple-500 to-pink-500'
        if (roleMode === 'seller') return 'from-green-500 to-emerald-500'
        return 'from-blue-500 to-indigo-500'
    }

    return (
        <div className="relative bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-indigo-950/30 dark:via-purple-950/30 dark:to-pink-950/30 rounded-3xl p-6 md:p-8 mb-8 overflow-hidden border border-indigo-100 dark:border-indigo-800/30">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-purple-200/20 to-pink-200/20 dark:from-purple-500/10 dark:to-pink-500/10 rounded-full blur-3xl -z-0" />

            <div className="relative z-10">
                {/* Mobile Layout */}
                <div className="flex flex-col md:hidden items-center text-center gap-4">
                    {/* Avatar */}
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.4 }}
                        className="relative"
                    >
                        <motion.div
                            animate={{ scale: [1, 1.05, 1] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                            className="w-24 h-24 rounded-full overflow-hidden ring-4 ring-white dark:ring-gray-800 shadow-xl"
                        >
                            <img
                                src={user?.avatar || 'https://via.placeholder.com/150'}
                                alt={user?.name || 'User'}
                                className="w-full h-full object-cover"
                            />
                        </motion.div>
                        {/* Level badge */}
                        <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-black px-2 py-1 rounded-full shadow-lg flex items-center gap-1">
                            <Crown className="w-3 h-3" />
                            <span>{roleMode === 'seller' ? stats.sellerLevel : stats.buyerLevel}</span>
                        </div>
                    </motion.div>

                    {/* Name & Role */}
                    <div>
                        <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-2">
                            {user?.name || 'Guest User'}
                        </h2>
                        <span className={`inline-block px-3 py-1 bg-gradient-to-r ${getRoleColor()} text-white text-xs font-bold rounded-full shadow-md`}>
                            {getRoleTag()}
                        </span>
                    </div>

                    {/* AI Greeting */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.2 }}
                        className="flex items-center gap-2 bg-white/60 dark:bg-gray-800/60 backdrop-blur-md px-4 py-2 rounded-2xl border border-indigo-200 dark:border-indigo-700"
                    >
                        <Zap className="w-4 h-4 text-yellow-500" />
                        <p className="text-sm text-gray-700 dark:text-gray-200 font-medium">
                            {greetingMessage}
                        </p>
                    </motion.div>
                </div>

                {/* Desktop Layout */}
                <div className="hidden md:flex items-center justify-between gap-8">
                    {/* Left: Avatar + Name + Greeting */}
                    <div className="flex items-center gap-6 flex-1">
                        {/* Avatar */}
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.4 }}
                            className="relative shrink-0"
                        >
                            <motion.div
                                animate={{ scale: [1, 1.05, 1] }}
                                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                className="w-24 h-24 rounded-full overflow-hidden ring-4 ring-white dark:ring-gray-800 shadow-xl"
                            >
                                <img
                                    src={user?.avatar || 'https://via.placeholder.com/150'}
                                    alt={user?.name || 'User'}
                                    className="w-full h-full object-cover"
                                />
                            </motion.div>
                            {/* Level badge */}
                            <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-black px-2 py-1 rounded-full shadow-lg flex items-center gap-1">
                                <Crown className="w-3 h-3" />
                                <span>{roleMode === 'seller' ? stats.sellerLevel : stats.buyerLevel}</span>
                            </div>
                        </motion.div>

                        {/* Name, Role, Greeting */}
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                                <h2 className="text-3xl font-black text-gray-900 dark:text-white">
                                    {user?.name || 'Guest User'}
                                </h2>
                                <span className={`px-3 py-1 bg-gradient-to-r ${getRoleColor()} text-white text-xs font-bold rounded-full shadow-md`}>
                                    {getRoleTag()}
                                </span>
                            </div>

                            {/* AI Greeting */}
                            <motion.div
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.4, delay: 0.2 }}
                                className="flex items-center gap-2 bg-white/60 dark:bg-gray-800/60 backdrop-blur-md px-4 py-2 rounded-2xl border border-indigo-200 dark:border-indigo-700 inline-flex"
                            >
                                <Zap className="w-4 h-4 text-yellow-500" />
                                <p className="text-sm text-gray-700 dark:text-gray-200 font-medium">
                                    {greetingMessage}
                                </p>
                            </motion.div>
                        </div>
                    </div>
                </div>

                {/* Quick Stats Grid */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.3 }}
                    className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6"
                >
                    {/* Coins */}
                    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl p-4 border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-shadow">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center">
                                <Coins className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">{t('profile.header.stats_coins')}</p>
                                <p className="text-xl font-black text-gray-900 dark:text-white">{stats.coins.toLocaleString()}</p>
                            </div>
                        </div>
                    </div>

                    {/* Points */}
                    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl p-4 border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-shadow">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-500 rounded-xl flex items-center justify-center">
                                <Star className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">{t('profile.header.stats_points')}</p>
                                <p className="text-xl font-black text-gray-900 dark:text-white">{stats.points.toLocaleString()}</p>
                            </div>
                        </div>
                    </div>

                    {/* Level */}
                    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl p-4 border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-shadow">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-xl flex items-center justify-center">
                                <TrendingUp className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">{t('profile.header.stats_level')}</p>
                                <p className="text-xl font-black text-gray-900 dark:text-white">
                                    {roleMode === 'seller' ? stats.sellerLevel : stats.buyerLevel}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Pending Orders */}
                    {ordersSummary.pending > 0 && (
                        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl p-4 border border-orange-200 dark:border-orange-700 hover:shadow-lg transition-shadow">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-red-500 rounded-xl flex items-center justify-center">
                                    <Package className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">{t('profile.header.stats_pending')}</p>
                                    <p className="text-xl font-black text-orange-600 dark:text-orange-400">{ordersSummary.pending}</p>
                                </div>
                            </div>
                        </div>
                    )}
                </motion.div>

                {/* Progress Bars */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.4 }}
                    className="mt-6 space-y-3"
                >
                    {/* Buyer Progress */}
                    {(roleMode === 'buyer' || roleMode === 'hybrid') && (
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-xs font-bold text-gray-600 dark:text-gray-400">{t('profile.header.buyer_progress')}</span>
                                <span className="text-xs font-black text-indigo-600 dark:text-indigo-400">{stats.progress.buyer}%</span>
                            </div>
                            <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${stats.progress.buyer}%` }}
                                    transition={{ duration: 1, delay: 0.5 }}
                                    className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full"
                                />
                            </div>
                        </div>
                    )}

                    {/* Seller Progress */}
                    {(roleMode === 'seller' || roleMode === 'hybrid') && (
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-xs font-bold text-gray-600 dark:text-gray-400">{t('profile.header.seller_progress')}</span>
                                <span className="text-xs font-black text-green-600 dark:text-green-400">{stats.progress.seller}%</span>
                            </div>
                            <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${stats.progress.seller}%` }}
                                    transition={{ duration: 1, delay: 0.6 }}
                                    className="h-full bg-gradient-to-r from-green-500 to-emerald-600 rounded-full"
                                />
                            </div>
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    )
}
