'use client'

import React, { useState } from 'react'
import {
    Zap, CheckCircle2, Circle, AlertTriangle,
    Sparkles, MessageSquare, ChevronRight,
    Wand2, ShieldCheck, ArrowUpRight
} from 'lucide-react'
import type { SmartUserProfile } from '@/services/mockProfile'

interface AIProfileCoachProps {
    data: SmartUserProfile['coaching']
    role: string
}

export default function AIProfileCoach({ data, role }: AIProfileCoachProps) {
    const [isExpanded, setIsExpanded] = useState(true)
    const [tasks, setTasks] = useState(data.dailyTasks)
    const [chatOpen, setChatOpen] = useState(false)

    const handleCompleteTask = (id: string, actionType: string) => {
        // In a real app, this would call an API
        // For now, visualize the 'Auto Action'
        if (actionType === 'gen_bio') {
            alert('AI is writing your bio... Done! "Vintage collector with a passion for storytelling."')
        } else if (actionType === 'verify_id') {
            alert('Opening Verification Flow...')
        }

        setTasks(prev => prev.map(t => t.id === id ? { ...t, isCompleted: true } : t))
    }

    // Circular Progress Component
    const TrustScoreRing = ({ score }: { score: number }) => {
        const radius = 30
        const circumference = 2 * Math.PI * radius
        const offset = circumference - (score / 100) * circumference

        return (
            <div className="relative w-20 h-20 flex items-center justify-center shrink-0">
                <svg className="w-full h-full transform -rotate-90">
                    <circle cx="40" cy="40" r={radius} stroke="#f3f4f6" strokeWidth="6" fill="transparent" />
                    <circle cx="40" cy="40" r={radius} stroke="url(#gradientScore)" strokeWidth="6" fill="transparent"
                        strokeDasharray={circumference}
                        strokeDashoffset={offset}
                        strokeLinecap="round"
                        className="transition-all duration-1000 ease-out"
                    />
                    <defs>
                        <linearGradient id="gradientScore" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#818cf8" />
                            <stop offset="100%" stopColor="#c084fc" />
                        </linearGradient>
                    </defs>
                </svg>
                <div className="absolute flex flex-col items-center">
                    <span className="text-xl font-bold text-gray-800">{score}</span>
                    <span className="text-[9px] text-gray-400 uppercase">Trust</span>
                </div>
            </div>
        )
    }

    return (
        <section className="bg-white rounded-3xl p-6 shadow-lg border border-purple-100 relative overflow-hidden">
            {/* Header / Summary */}
            <div className="flex items-center justify-between mb-6 relative z-10">
                <div className="flex items-center gap-4">
                    <TrustScoreRing score={data.trustScoreBreakdown.score} />
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                            AI Profile Coach
                            <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full border border-purple-200">Beta</span>
                        </h2>
                        <p className="text-sm text-gray-500">
                            {data.trustScoreBreakdown.score >= 90 ? 'สุดยอด! โปรไฟล์ของคุณน่าเชื่อถือมาก' :
                                data.trustScoreBreakdown.score >= 70 ? 'ดีมาก! แต่ยังเพิ่มความน่าเชื่อถือได้อีก' :
                                    'โปรไฟล์ของคุณต้องการการปรับปรุงเร่งด่วน'}
                        </p>
                    </div>
                </div>
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="p-2 hover:bg-gray-100 rounded-full transition"
                >
                    {isExpanded ? <ChevronRight className="rotate-90 text-gray-400" /> : <ChevronRight className="text-gray-400" />}
                </button>
            </div>

            {/* Content Area */}
            <div className={`transition-all duration-500 ease-in-out ${isExpanded ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>

                {/* 1. Critical Breakdown */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    {data.trustScoreBreakdown.factors.map((factor, i) => (
                        <div key={i} className={`flex items-center gap-3 p-3 rounded-xl border ${factor.status === 'critical' ? 'bg-red-50 border-red-100' :
                                factor.status === 'warning' ? 'bg-yellow-50 border-yellow-100' : 'bg-green-50 border-green-100'
                            }`}>
                            {factor.status === 'critical' ? <AlertTriangle className="w-5 h-5 text-red-500" /> :
                                factor.status === 'warning' ? <ShieldCheck className="w-5 h-5 text-yellow-500" /> :
                                    <CheckCircle2 className="w-5 h-5 text-green-500" />}
                            <div>
                                <p className="text-xs font-bold text-gray-700">{factor.label}</p>
                                <p className={`text-[10px] ${factor.status === 'critical' ? 'text-red-600' :
                                        factor.status === 'warning' ? 'text-yellow-600' : 'text-green-600'
                                    }`}>
                                    {factor.status === 'good' ? 'Complete' : `Impact: -${factor.impact}`}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* 2. Daily Missions */}
                <div className="mb-6">
                    <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                        <Zap className="w-4 h-4 text-orange-500" /> Daily Missions
                        <span className="text-xs font-normal text-gray-400">ทำภารกิจให้ครบเพื่อบูสต์ร้านค้า</span>
                    </h3>
                    <div className="space-y-3">
                        {tasks.map((task) => (
                            <div key={task.id} className={`group flex items-center justify-between p-4 rounded-xl border transition-all ${task.isCompleted ? 'bg-gray-50 border-gray-100 opacity-60' : 'bg-white border-gray-100 hover:shadow-md hover:border-purple-200'
                                }`}>
                                <div className="flex items-start gap-3">
                                    <div className={`mt-1 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${task.isCompleted ? 'border-green-500 bg-green-500' : 'border-gray-300 group-hover:border-purple-500'
                                        }`}>
                                        {task.isCompleted && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                                    </div>
                                    <div>
                                        <p className={`text-sm font-medium ${task.isCompleted ? 'text-gray-500 line-through' : 'text-gray-800'}`}>
                                            {task.title}
                                        </p>
                                        <p className="text-xs text-gray-500">{task.desc}</p>
                                        {!task.isCompleted && (
                                            <span className="inline-block mt-1 text-[10px] bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full font-bold">
                                                Reward: {task.reward}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                {!task.isCompleted && (
                                    <button
                                        onClick={() => handleCompleteTask(task.id, task.actionType)}
                                        className="text-xs bg-purple-600 text-white px-3 py-1.5 rounded-lg hover:bg-purple-700 transition flex items-center gap-1 shadow-sm shadow-purple-200"
                                    >
                                        {task.actionType === 'gen_bio' ? <Wand2 className="w-3 h-3" /> : <ArrowUpRight className="w-3 h-3" />}
                                        {task.actionType === 'gen_bio' ? 'Auto Write' : 'Do it'}
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* 3. AI Suggestions / Chat Assist */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
                    <div className="flex items-start gap-4">
                        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm text-blue-600 shrink-0">
                            <MessageSquare className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                            <p className="text-sm font-bold text-gray-800">AI Chat Assistant</p>
                            <p className="text-xs text-gray-600 mt-1">
                                "สวัสดีครับ! ผมวิเคราะห์ร้านค้าของคุณแล้ว พบว่าช่วงนี้คนค้นหา 'กล้องฟิล์ม' เยอะมาก สนใจให้ผมช่วยร่างคำโฆษณาไหม?"
                            </p>
                            <div className="flex gap-2 mt-3">
                                <button className="text-xs bg-white border border-blue-200 text-blue-700 px-3 py-1.5 rounded-full hover:bg-blue-50 transition">
                                    ช่วยร่างคำโฆษณาหน่อย
                                </button>
                                <button className="text-xs bg-white border border-blue-200 text-blue-700 px-3 py-1.5 rounded-full hover:bg-blue-50 transition">
                                    วิเคราะห์ราคาให้ที
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

            {/* Background Decor */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-purple-100/30 to-blue-100/30 rounded-full blur-3xl -z-0 transform translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
        </section>
    )
}
