'use client'

import React, { useState, useEffect } from 'react'
import { Rocket, Zap, Settings, History, CheckCircle, PauseCircle, PlayCircle, Loader2 } from 'lucide-react'
// import { checkAndTriggerAutoBoost, getBoostHistory, AutoBoostSettings, BoostAction } from '@/services/aiAutoBoost'
import { campaignService } from '@/services/campaignService'
import { useAuth } from '@/contexts/AuthContext'
import Button from '@/components/ui/Button'

// Reusing types roughly but adapting to real service
interface AutoBoostSettings {
    isEnabled: boolean
    dailyBudget: number
    maxBidPerBoost: number
    targetRoas: number
}

interface AutoBoostControlProps {
    productId: string
}

export default function AutoBoostControl({ productId }: AutoBoostControlProps) {
    const { user } = useAuth()
    const [settings, setSettings] = useState<AutoBoostSettings>({
        isEnabled: false, // Default to false for safety
        dailyBudget: 100,
        maxBidPerBoost: 10,
        targetRoas: 3.0
    })

    // Using simple history from local state for this demo, 
    // in real app would fetch from campaignService
    const [history, setHistory] = useState<any[]>([])
    const [activeTab, setActiveTab] = useState<'settings' | 'history'>('settings')
    const [loading, setLoading] = useState(false)
    const [activeCampaign, setActiveCampaign] = useState<any>(null)

    // Load active campaign state
    useEffect(() => {
        if (!productId) return
        const checkStatus = async () => {
            const campaign = await campaignService.getProductCampaign(productId)
            if (campaign) {
                // If active campaign found, set switch to ON
                setSettings(prev => ({ ...prev, isEnabled: true }))
                setActiveCampaign(campaign)
            }
        }
        checkStatus()
    }, [productId])

    const handleToggle = async () => {
        if (!user) return alert("Please login first")
        if (loading) return

        const newState = !settings.isEnabled
        setLoading(true)

        try {
            if (newState) {
                // User wants to ENABLE boost -> Start a mock campaign immediately for demo
                const result = await campaignService.startCampaign(
                    user.uid,
                    productId,
                    'boost',
                    24, // 24 hours
                    15 // 15 stars cost
                )

                if (result.success) {
                    setSettings(prev => ({ ...prev, isEnabled: true }))
                    setActiveCampaign({
                        id: result.campaignId,
                        type: 'boost',
                        status: 'active'
                    })
                    alert("Auto-Boost Activated! 15 Stars deducted.")
                } else {
                    alert(`Failed: ${result.error}`)
                    // Reset switch if failed
                    if (result.error === 'Insufficient funds') {
                        // Prompt to top up?
                    }
                }
            } else {
                // User wants to PAUSE
                // In real app calls campaignService.stopCampaign(id)
                setSettings(prev => ({ ...prev, isEnabled: false }))
                setActiveCampaign(null)
                alert("Auto-Boost Paused.")
            }
        } catch (e) {
            console.error(e)
            alert("Error updating boost status")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="bg-white dark:bg-card-dark rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
            <div className={`
                p-4 flex justify-between items-center transition-colors
                ${settings.isEnabled
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-500'}
            `}>
                <div className="flex items-center gap-2">
                    <Rocket className={`w-5 h-5 ${settings.isEnabled ? 'text-white' : 'text-gray-400'}`} />
                    <div>
                        <h3 className={`font-bold text-sm ${settings.isEnabled ? 'text-white' : 'text-gray-700 dark:text-gray-300'}`}>
                            AI Auto-Boost
                        </h3>
                        <p className={`text-[10px] ${settings.isEnabled ? 'text-purple-100' : 'text-gray-400'}`}>
                            {settings.isEnabled ? 'Active & Optimizing' : 'Inactive'}
                        </p>
                    </div>
                </div>
                <button
                    onClick={handleToggle}
                    className={`
                        transition-transform hover:scale-105
                        ${loading ? 'opacity-50 cursor-not-allowed' : ''}
                    `}
                    disabled={loading}
                >
                    {loading ? (
                        <Loader2 className={`w-6 h-6 animate-spin ${settings.isEnabled ? 'text-white' : 'text-purple-600'}`} />
                    ) : settings.isEnabled ? (
                        <PauseCircle className="w-8 h-8 text-white" />
                    ) : (
                        <PlayCircle className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                    )}
                </button>
            </div>

            <div className="flex border-b border-gray-100 dark:border-gray-800">
                <button
                    onClick={() => setActiveTab('settings')}
                    className={`flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 ${activeTab === 'settings' ? 'text-purple-600 border-b-2 border-purple-600' : 'text-gray-500'}`}
                >
                    <Settings className="w-4 h-4" /> ตั้งค่า
                </button>
                <button
                    onClick={() => setActiveTab('history')}
                    className={`flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 ${activeTab === 'history' ? 'text-purple-600 border-b-2 border-purple-600' : 'text-gray-500'}`}
                >
                    <History className="w-4 h-4" /> ประวัติการทำงาน
                </button>
            </div>

            <div className="p-4">
                {activeTab === 'settings' ? (
                    <div className="space-y-4">
                        <div className={`p-3 rounded-lg border flex gap-3 ${settings.isEnabled ? 'bg-green-50 border-green-200 text-green-700' : 'bg-gray-50 border-gray-200 text-gray-500'}`}>
                            <div className="mt-0.5">
                                {settings.isEnabled ? <CheckCircle className="w-4 h-4" /> : <PauseCircle className="w-4 h-4" />}
                            </div>
                            <div>
                                <p className="text-xs font-bold">
                                    สถานะ: {settings.isEnabled ? 'กำลังทำงาน (Active)' : 'หยุดชั่วคราว (Paused)'}
                                </p>
                                <p className="text-[10px] mt-1 opacity-80">
                                    {settings.isEnabled
                                        ? 'AI กำลังวิเคราะห์แนวโน้มตลาดและดันสินค้าของคุณเมื่อมีโอกาสขายดีที่สุด'
                                        : 'เปิดใช้งานเพื่อให้ AI ช่วยดันสินค้าของคุณโดยอัตโนมัติ'}
                                </p>
                            </div>
                        </div>

                        <div>
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">งบประมาณรายวัน (บาท)</label>
                            <input
                                type="number"
                                value={settings.dailyBudget}
                                onChange={(e) => setSettings({ ...settings, dailyBudget: Number(e.target.value) })}
                                className="w-full border rounded-lg p-2 text-sm bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700"
                                disabled={!settings.isEnabled && loading} // Just example logic
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">ประมูลสูงสุดต่อครั้ง (Max Bid)</label>
                            <input
                                type="number"
                                value={settings.maxBidPerBoost}
                                onChange={(e) => setSettings({ ...settings, maxBidPerBoost: Number(e.target.value) })}
                                className="w-full border rounded-lg p-2 text-sm bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700"
                            />
                            <p className="text-[10px] text-gray-400 mt-1">แนะนำ: 10-20 บาท เพื่อผลลัพธ์ที่ดีที่สุด</p>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                        {/* Mock history or fetch real later */}
                        <div className="text-center py-8 text-gray-400 text-xs">
                            Coming Soon: Real-time logs
                        </div>
                    </div>
                )}
            </div>

            {/* Real Campaign Status Banner */}
            {settings.isEnabled && activeCampaign && (
                <div className="px-4 py-2 bg-purple-50 dark:bg-purple-900/20 border-t border-purple-100 dark:border-purple-800 text-[10px] text-center text-purple-600 dark:text-purple-300">
                    <Zap className="w-3 h-3 inline mr-1" />
                    Campaign ID: {activeCampaign.id} connected via CampaignService
                </div>
            )}
        </div>
    )
}
