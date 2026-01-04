'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Rocket, Clock, Zap, BarChart3, AlertCircle, ChevronRight } from 'lucide-react'
import { campaignService, Campaign } from '@/services/campaignService'
import { useAuth } from '@/contexts/AuthContext'
import Link from 'next/link'

// Quick helper for time remaining
function getTimeRemaining(endTime: any) {
    if (!endTime) return 'Unknown'
    const end = endTime.toDate ? endTime.toDate() : new Date(endTime)
    const now = new Date()
    const diff = end.getTime() - now.getTime()

    if (diff <= 0) return 'Expired'

    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

    return `${hours}h ${minutes}m`
}

function getProgress(startTime: any, endTime: any) {
    if (!startTime || !endTime) return 0
    const startStr = startTime.toDate ? startTime.toDate().getTime() : (typeof startTime === 'string' || typeof startTime === 'number' ? new Date(startTime).getTime() : Date.now())
    const endStr = endTime.toDate ? endTime.toDate().getTime() : (typeof endTime === 'string' || typeof endTime === 'number' ? new Date(endTime).getTime() : Date.now())
    const now = new Date().getTime()

    const total = endStr - startStr
    if (total <= 0) return 100
    const elapsed = now - startStr
    const percent = Math.min(100, Math.max(0, (elapsed / total) * 100))
    return percent
}

export default function ActiveCampaignsWidget() {
    const { user } = useAuth()
    const [campaigns, setCampaigns] = useState<Campaign[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!user) return
        const load = async () => {
            try {
                const list = await campaignService.getActiveCampaigns(user.uid)
                setCampaigns(list)
            } catch (e) {
                console.error(e)
            } finally {
                setLoading(false)
            }
        }
        load()
        // Refresh every minute to update timers
        const interval = setInterval(load, 60000)
        return () => clearInterval(interval)
    }, [user])

    if (loading) return null // Or skeleton
    if (campaigns.length === 0) return null

    return (
        <div className="mb-8">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Rocket className="w-5 h-5 text-neon-purple" />
                กำลังโปรโมท ({campaigns.length})
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {campaigns.map(camp => {
                    const remaining = getTimeRemaining(camp.endTime)
                    const percent = getProgress(camp.startTime, camp.endTime)

                    return (
                        <div key={camp.id} className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-purple-100 dark:border-purple-900/30 shadow-sm relative overflow-hidden group">
                            {/* Animated Background Gradient */}
                            <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-purple-500 to-pink-500" />

                            <div className="flex justify-between items-start mb-3 relative z-10">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center text-neon-purple">
                                        {camp.type === 'boost' ? <Zap className="w-5 h-5" /> : <Rocket className="w-5 h-5" />}
                                    </div>
                                    <div>
                                        <div className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                            {camp.type === 'boost' ? 'Boost Up 24h' : 'Premium Campaign'}
                                            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-green-100 text-green-700 animate-pulse">
                                                ACTIVE
                                            </span>
                                        </div>
                                        <div className="text-xs text-gray-500 font-mono">ID: {camp.productId.substring(0, 8)}...</div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-xs text-gray-400 mb-1">เหลือเวลา</div>
                                    <div className="font-bold text-neon-purple font-mono">{remaining}</div>
                                </div>
                            </div>

                            {/* Progress Bar */}
                            <div className="w-full bg-gray-100 dark:bg-gray-700 h-1.5 rounded-full overflow-hidden mb-3">
                                <motion.div
                                    className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${percent}%` }}
                                    transition={{ duration: 1 }}
                                />
                            </div>

                            {/* Stats */}
                            <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 pt-2 border-t border-gray-100 dark:border-gray-700/50">
                                <div className="flex items-center gap-1">
                                    <BarChart3 className="w-3 h-3" />
                                    <span>Views: <strong className="text-gray-900 dark:text-white">{camp.stats?.impressions || 0}</strong></span>
                                </div>
                                <Link
                                    href={`/seller/insights`}
                                    className="flex items-center gap-1 text-purple-600 hover:underline"
                                >
                                    ดูสถิติ <ChevronRight className="w-3 h-3" />
                                </Link>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
