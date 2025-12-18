'use client'

import React from 'react'
import { Lightbulb, Sparkles, X } from 'lucide-react'

interface AIAdvisorWidgetProps {
    suggestions: {
        type: string
        message: string
        autoActionLabel?: string
    }[]
}

export default function AIAdvisorWidget({ suggestions }: AIAdvisorWidgetProps) {
    if (!suggestions || suggestions.length === 0) return null

    const topTip = suggestions[0]

    return (
        <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl p-0.5 shadow-xl shadow-indigo-200 overflow-hidden group">
            <div className="bg-white/10 backdrop-blur-md rounded-[14px] p-4 text-white relative">
                {/* Shine Effect */}
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>

                <div className="flex items-start gap-4">
                    <div className="p-3 bg-white/20 rounded-xl shadow-inner backdrop-blur-sm shrink-0 animate-pulse">
                        <Lightbulb className="w-6 h-6 text-yellow-300 fill-yellow-300/50" />
                    </div>

                    <div className="flex-1">
                        <h4 className="font-bold flex items-center gap-2 text-lg mb-1">
                            AI Personal Advisor
                            <Sparkles className="w-3 h-3 text-yellow-300" />
                        </h4>
                        <p className="text-white/90 text-sm font-medium leading-relaxed mb-3">
                            {topTip.message}
                        </p>

                        {topTip.autoActionLabel && (
                            <button className="bg-white text-indigo-700 font-bold text-xs px-4 py-2 rounded-lg hover:bg-indigo-50 hover:scale-105 transition-all shadow-md">
                                {topTip.autoActionLabel}
                            </button>
                        )}
                    </div>

                    <button className="text-white/50 hover:text-white transition-colors">
                        <X className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    )
}
