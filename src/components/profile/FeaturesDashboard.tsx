'use client'

import { motion } from 'framer-motion'
import {
    TrendingUp, Megaphone, Sparkles, Crown,
    CheckCircle2, Lock, ArrowRight, Zap
} from 'lucide-react'
import { useUserProfile } from '@/hooks/useUserProfile'
import { FeaturesUnlocked } from '@/types/user-profile'

interface FeatureCardProps {
    icon: any
    name: string
    description: string
    unlocked: boolean
    comingSoon?: boolean
}

function FeatureCard({ icon: Icon, name, description, unlocked, comingSoon }: FeatureCardProps) {
    return (
        <div className={`p-4 rounded-xl border-2 transition-all ${unlocked
                ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50'
            }`}>
            <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${unlocked
                        ? 'bg-green-500'
                        : 'bg-gray-300 dark:bg-gray-700'
                    }`}>
                    <Icon className={`w-5 h-5 ${unlocked ? 'text-white' : 'text-gray-500'
                        }`} />
                </div>
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                        <h3 className={`font-bold ${unlocked
                                ? 'text-green-900 dark:text-green-100'
                                : 'text-gray-600 dark:text-gray-400'
                            }`}>
                            {name}
                        </h3>
                        {unlocked && (
                            <CheckCircle2 className="w-4 h-4 text-green-500" />
                        )}
                        {!unlocked && !comingSoon && (
                            <Lock className="w-4 h-4 text-gray-400" />
                        )}
                        {comingSoon && (
                            <span className="text-xs bg-purple-100 text-purple-600 px-2 py-0.5 rounded-full font-bold">
                                Soon
                            </span>
                        )}
                    </div>
                    <p className={`text-sm ${unlocked
                            ? 'text-green-700 dark:text-green-300'
                            : 'text-gray-500 dark:text-gray-500'
                        }`}>
                        {description}
                    </p>
                </div>
            </div>
        </div>
    )
}

export default function FeaturesDashboard() {
    const { profile, hasFeature, canUpgrade, nextUpgrade, upgradeRole } = useUserProfile()

    if (!profile) {
        return (
            <div className="p-8 text-center">
                <div className="animate-spin w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full mx-auto"></div>
                <p className="text-gray-500 mt-4">Loading your features...</p>
            </div>
        )
    }

    const FEATURE_GROUPS = [
        {
            title: 'Analytics & Insights',
            icon: TrendingUp,
            features: [
                { key: 'analytics', name: 'Basic Analytics', description: 'Views, clicks, and basic metrics' },
                { key: 'advanced_analytics', name: 'Advanced Analytics', description: 'Conversion rates, customer journey' },
                { key: 'competitor_insights', name: 'Competitor Insights', description: 'Market trends and competitor analysis' }
            ]
        },
        {
            title: 'Marketing & Promotion',
            icon: Megaphone,
            features: [
                { key: 'marketing', name: 'Marketing Tools', description: 'Basic promotion and discounts' },
                { key: 'campaigns', name: 'Campaign Manager', description: 'Create and manage marketing campaigns' },
                { key: 'ads_manager', name: 'Ads Manager', description: 'Run paid advertisements' }
            ]
        },
        {
            title: 'AI Features',
            icon: Sparkles,
            features: [
                { key: 'ai_pricing', name: 'AI Pricing', description: 'Smart price recommendations' },
                { key: 'ai_description', name: 'AI Description', description: 'Auto-generate product descriptions' },
                { key: 'ai_image_enhancement', name: 'AI Image Enhancement', description: 'Enhance product photos' },
                { key: 'ai_chatbot', name: 'AI Chatbot', description: 'Automated customer support' },
                { key: 'ai_inventory_forecast', name: 'AI Inventory Forecast', description: 'Predict stock needs' }
            ]
        },
        {
            title: 'Premium Features',
            icon: Crown,
            features: [
                { key: 'custom_shop_design', name: 'Custom Shop Design', description: 'Personalize your shop' },
                { key: 'bulk_upload', name: 'Bulk Upload', description: 'Upload multiple products at once' },
                { key: 'api_access', name: 'API Access', description: 'Integrate with external systems' },
                { key: 'team_management', name: 'Team Management', description: 'Add team members' },
                { key: 'tax_invoice', name: 'Tax Invoice', description: 'Issue tax invoices' },
                { key: 'priority_support', name: 'Priority Support', description: 'Get help faster' }
            ]
        }
    ]

    const unlockedCount = Object.values(profile.features_unlocked).filter(Boolean).length
    const totalFeatures = Object.keys(profile.features_unlocked).length

    return (
        <div className="max-w-6xl mx-auto p-6">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                            Your Features
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400">
                            {profile.role === 'buyer' ? 'Buyer Account' :
                                profile.role === 'seller' ? 'Individual Seller' :
                                    profile.role === 'shop' ? 'Professional Shop' : 'Mall Account'}
                        </p>
                    </div>
                    <div className="text-right">
                        <div className="text-4xl font-black text-indigo-600 dark:text-indigo-400">
                            {unlockedCount}
                        </div>
                        <div className="text-sm text-gray-500">
                            features unlocked
                        </div>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="bg-gray-200 dark:bg-gray-700 h-3 rounded-full overflow-hidden">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(unlockedCount / totalFeatures) * 100}%` }}
                        className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
                    />
                </div>
            </div>

            {/* Upgrade Banner */}
            {canUpgrade && nextUpgrade && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-6 text-white"
                >
                    <div className="flex items-start justify-between">
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                                <Zap className="w-6 h-6" />
                                <h3 className="text-xl font-bold">
                                    Upgrade to {nextUpgrade.to.charAt(0).toUpperCase() + nextUpgrade.to.slice(1)}
                                </h3>
                            </div>
                            <p className="text-white/90 mb-4">
                                Unlock {nextUpgrade.benefits.length} more powerful features
                            </p>
                            <div className="grid grid-cols-2 gap-2 mb-4">
                                {nextUpgrade.benefits.slice(0, 4).map((benefit, i) => (
                                    <div key={i} className="flex items-center gap-2 text-sm">
                                        <CheckCircle2 className="w-4 h-4" />
                                        <span>{benefit}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <button
                            onClick={() => upgradeRole(nextUpgrade.to)}
                            className="px-6 py-3 bg-white text-purple-600 rounded-xl font-bold hover:shadow-lg transition-all flex items-center gap-2"
                        >
                            Upgrade Now
                            <ArrowRight className="w-5 h-5" />
                        </button>
                    </div>
                </motion.div>
            )}

            {/* Feature Groups */}
            <div className="space-y-8">
                {FEATURE_GROUPS.map((group, groupIndex) => {
                    const GroupIcon = group.icon
                    return (
                        <motion.div
                            key={group.title}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: groupIndex * 0.1 }}
                        >
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                                    <GroupIcon className="w-5 h-5 text-white" />
                                </div>
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                                    {group.title}
                                </h2>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {group.features.map((feature) => (
                                    <FeatureCard
                                        key={feature.key}
                                        icon={group.icon}
                                        name={feature.name}
                                        description={feature.description}
                                        unlocked={hasFeature(feature.key as keyof FeaturesUnlocked)}
                                    />
                                ))}
                            </div>
                        </motion.div>
                    )
                })}
            </div>

            {/* AI Mode Badge */}
            <div className="mt-8 p-6 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl border border-purple-200 dark:border-purple-800">
                <div className="flex items-center gap-3">
                    <Sparkles className="w-8 h-8 text-purple-600" />
                    <div>
                        <h3 className="font-bold text-purple-900 dark:text-purple-100">
                            AI Mode: {profile.ai_mode.toUpperCase()}
                        </h3>
                        <p className="text-sm text-purple-700 dark:text-purple-300">
                            {profile.ai_mode === 'basic' && 'Essential AI features for getting started'}
                            {profile.ai_mode === 'pro' && 'Advanced AI tools for professional sellers'}
                            {profile.ai_mode === 'mall' && 'Enterprise-grade AI with full automation'}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
