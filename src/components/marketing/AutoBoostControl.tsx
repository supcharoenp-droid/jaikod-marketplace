'use client'

import React, { useState, useEffect } from 'react'
import { Rocket, Zap, Settings, History, CheckCircle, PauseCircle, PlayCircle } from 'lucide-react'
import { checkAndTriggerAutoBoost, getBoostHistory, AutoBoostSettings, BoostAction } from '@/services/aiAutoBoost'

interface AutoBoostControlProps {
    productId: string
}

export default function AutoBoostControl({ productId }: AutoBoostControlProps) {
    const [settings, setSettings] = useState<AutoBoostSettings>({
        isEnabled: true,
        dailyBudget: 100,
        maxBidPerBoost: 10,
        targetRoas: 3.0
    })
    const [history, setHistory] = useState<BoostAction[]>([])
    const [activeTab, setActiveTab] = useState<'settings' | 'history'>('settings')

    useEffect(() => {
        // Mock load history
        getBoostHistory(productId).then(setHistory)
    }, [productId])

    const handleToggle = () => {
        setSettings({ ...settings, isEnabled: !settings.isEnabled })
    }

    return (
        <div className="bg-white dark:bg-card-dark rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-4 text-white flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <Rocket className="w-5 h-5" />
                    <div>
                        <h3 className="font-bold text-sm">AI Auto-Boost</h3>
                        <p className="text-[10px] opacity-80">ดันสินค้าอัตโนมัติเมื่อมีโอกาสขายสูง</p>
                    </div>
                </div>
                <button onClick={handleToggle} className="text-white hover:opacity-90 transition">
                    {settings.isEnabled ? <PauseCircle className="w-6 h-6" /> : <PlayCircle className="w-6 h-6 opacity-50" />}
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
                        <div className={`p-3 rounded-lg border ${settings.isEnabled ? 'bg-green-50 border-green-200 text-green-700' : 'bg-gray-50 border-gray-200 text-gray-500'}`}>
                            <div className="flex items-center gap-2 text-sm font-bold">
                                {settings.isEnabled ? <CheckCircle className="w-4 h-4" /> : <PauseCircle className="w-4 h-4" />}
                                สถานะ: {settings.isEnabled ? 'กำลังทำงาน (Active)' : 'หยุดชั่วคราว (Paused)'}
                            </div>
                            {settings.isEnabled && <p className="text-xs mt-1 ml-6">AI จะวิเคราะห์และดันสินค้าให้คุณอัตโนมัติ 24 ชม.</p>}
                        </div>

                        <div>
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">งบประมาณรายวัน (บาท)</label>
                            <input
                                type="number"
                                value={settings.dailyBudget}
                                onChange={(e) => setSettings({ ...settings, dailyBudget: Number(e.target.value) })}
                                className="w-full border rounded-lg p-2 text-sm"
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">ประมูลสูงสุดต่อครั้ง (Max Bid)</label>
                            <input
                                type="number"
                                value={settings.maxBidPerBoost}
                                onChange={(e) => setSettings({ ...settings, maxBidPerBoost: Number(e.target.value) })}
                                className="w-full border rounded-lg p-2 text-sm"
                            />
                            <p className="text-[10px] text-gray-400 mt-1">แนะนำ: 10-20 บาท เพื่อผลลัพธ์ที่ดีที่สุด</p>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                        {history.length > 0 ? history.map((action, idx) => (
                            <div key={idx} className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3 relative">
                                <div className="flex justify-between items-start mb-1">
                                    <span className="text-xs font-bold text-purple-600 px-2 py-0.5 bg-purple-100 rounded-full">
                                        {action.boostType === 'trending_page' ? 'ติดเทรนด์' :
                                            action.boostType === 'for_you_feed' ? 'For You Feed' : 'Search Top'}
                                    </span>
                                    <span className="text-[10px] text-gray-400">
                                        {new Date(action.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                                <p className="text-xs font-medium text-gray-800 dark:text-gray-200 mb-2">{action.reason}</p>
                                <div className="flex items-center gap-3 text-[10px] text-gray-500 border-t border-gray-200 pt-2">
                                    <div className="flex items-center gap-1">
                                        <Zap className="w-3 h-3 text-yellow-500" />
                                        {action.metrics.impressions} เห็น
                                    </div>
                                    <div>
                                        {action.metrics.clicks} คลิก
                                    </div>
                                    <div>
                                        ฿{action.cost}
                                    </div>
                                </div>
                            </div>
                        )) : (
                            <div className="text-center py-8 text-gray-400 text-xs">
                                ยังไม่มีประวัติการ Boost
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}
