'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Lock, Unlock, Star, TrendingUp, Award, Zap } from 'lucide-react'
import { useProgressiveUnlock } from '@/hooks/useProgressiveUnlock'
import { PROGRESSIVE_FEATURES, UnlockStage } from '@/types/progressive-unlock'

interface ProgressiveUnlockBannerProps {
    language: 'th' | 'en'
    compact?: boolean
}

export default function ProgressiveUnlockBanner({ language, compact = false }: ProgressiveUnlockBannerProps) {
    const { progress, progressPercentage, nextMilestone } = useProgressiveUnlock()

    if (!progress || !nextMilestone) return null

    const copy = {
        th: {
            title: 'ปลดล็อกฟีเจอร์ใหม่',
            progress: 'ความคืบหน้า',
            nextUnlock: 'ปลดล็อกถัดไป',
            unlocked: 'ปลดล็อกแล้ว',
            features: 'ฟีเจอร์'
        },
        en: {
            title: 'Unlock New Features',
            progress: 'Progress',
            nextUnlock: 'Next Unlock',
            unlocked: 'Unlocked',
            features: 'features'
        }
    }

    const stageIcons: Record<UnlockStage, any> = {
        beginner: Star,
        intermediate: TrendingUp,
        advanced: Award,
        expert: Zap
    }

    const StageIcon = stageIcons[progress.currentStage]

    const unlockedCount = PROGRESSIVE_FEATURES.filter(f =>
        progress.unlockedFeatures.includes(f.id)
    ).length

    if (compact) {
        return (
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl p-4 border border-indigo-200 dark:border-indigo-800">
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                        <StageIcon className="w-5 h-5 text-indigo-600" />
                        <span className="text-sm font-bold text-indigo-900 dark:text-indigo-100">
                            {copy[language].progress}: {progressPercentage}%
                        </span>
                    </div>
                    <span className="text-xs text-indigo-600 dark:text-indigo-400">
                        {unlockedCount} {copy[language].features}
                    </span>
                </div>
                <div className="h-2 bg-indigo-200 dark:bg-indigo-800 rounded-full overflow-hidden">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progressPercentage}%` }}
                        className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
                    />
                </div>
            </div>
        )
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-2xl p-6 text-white shadow-2xl mb-6"
        >
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                        <StageIcon className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold">{copy[language].title}</h3>
                        <p className="text-white/80 text-sm">
                            {unlockedCount} / {PROGRESSIVE_FEATURES.length} {copy[language].unlocked}
                        </p>
                    </div>
                </div>
                <div className="text-right">
                    <div className="text-3xl font-black">{progressPercentage}%</div>
                    <div className="text-xs text-white/80">{copy[language].progress}</div>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-4">
                <div className="h-3 bg-white/20 rounded-full overflow-hidden backdrop-blur-sm">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progressPercentage}%` }}
                        transition={{ duration: 1, ease: 'easeOut' }}
                        className="h-full bg-white rounded-full shadow-lg"
                    />
                </div>
            </div>

            {/* Next Milestone */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="flex items-center gap-2 mb-2">
                    <Unlock className="w-4 h-4" />
                    <span className="text-sm font-bold">{copy[language].nextUnlock}:</span>
                </div>
                <p className="text-sm text-white/90 mb-2">
                    {nextMilestone.description[language]}
                </p>
                <div className="flex items-center gap-2 text-xs text-white/70">
                    <Zap className="w-3 h-3" />
                    <span>{nextMilestone.reward}</span>
                </div>
            </div>
        </motion.div>
    )
}

// Feature Lock Indicator Component
export function FeatureLockIndicator({
    featureId,
    language
}: {
    featureId: string
    language: 'th' | 'en'
}) {
    const { isUnlocked, nextMilestone } = useProgressiveUnlock()
    const feature = PROGRESSIVE_FEATURES.find(f => f.id === featureId)

    if (!feature || isUnlocked(featureId)) return null

    const copy = {
        th: {
            locked: 'ล็อกอยู่',
            unlock: 'ปลดล็อกโดย'
        },
        en: {
            locked: 'Locked',
            unlock: 'Unlock by'
        }
    }

    return (
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-100 dark:bg-gray-800 rounded-full text-sm">
            <Lock className="w-3 h-3 text-gray-500" />
            <span className="text-gray-600 dark:text-gray-400">
                {copy[language].locked}
            </span>
        </div>
    )
}

// Unlock Celebration Component
export function UnlockCelebration({
    featureName,
    language,
    onClose
}: {
    featureName: string
    language: 'th' | 'en'
    onClose: () => void
}) {
    const copy = {
        th: {
            title: 'ปลดล็อกแล้ว! 🎉',
            message: 'คุณได้ปลดล็อกฟีเจอร์ใหม่',
            button: 'เริ่มใช้งาน'
        },
        en: {
            title: 'Unlocked! 🎉',
            message: 'You unlocked a new feature',
            button: 'Start Using'
        }
    }

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            >
                <motion.div
                    initial={{ y: 50 }}
                    animate={{ y: 0 }}
                    className="bg-white dark:bg-gray-900 rounded-3xl p-8 max-w-md w-full text-center shadow-2xl"
                >
                    <motion.div
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{ repeat: 3, duration: 0.5 }}
                        className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center"
                    >
                        <Unlock className="w-10 h-10 text-white" />
                    </motion.div>

                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                        {copy[language].title}
                    </h2>

                    <p className="text-gray-600 dark:text-gray-400 mb-2">
                        {copy[language].message}
                    </p>

                    <p className="text-xl font-bold text-indigo-600 dark:text-indigo-400 mb-6">
                        {featureName}
                    </p>

                    <button
                        onClick={onClose}
                        className="w-full px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl font-bold hover:shadow-lg transition-all"
                    >
                        {copy[language].button}
                    </button>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    )
}
