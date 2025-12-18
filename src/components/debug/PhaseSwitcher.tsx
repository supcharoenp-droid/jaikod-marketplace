'use client'

import React from 'react'
import { useFeatures } from '@/contexts/FeatureContext'
import { SystemPhase } from '@/config/feature-flags'
import { Rocket, Layers, Zap, Crown } from 'lucide-react'

export default function PhaseSwitcher() {
    const { currentPhase, setPhase } = useFeatures()

    const phases = [
        { id: SystemPhase.PHASE_1_BASIC, label: 'Phase 1: Basic', icon: Layers },
        { id: SystemPhase.PHASE_2_AI_ASSIST, label: 'Phase 2: AI', icon: Zap },
        { id: SystemPhase.PHASE_3_MONETIZATION, label: 'Phase 3: Pro', icon: Rocket },
        { id: SystemPhase.PHASE_4_ADVANCED, label: 'Phase 4: Mall', icon: Crown },
    ]

    return (
        <div className="fixed bottom-4 left-4 z-50 bg-white/90 backdrop-blur shadow-lg border border-gray-200 rounded-full p-1.5 flex gap-1 items-center animate-in slide-in-from-left">
            {phases.map((p) => {
                const isActive = currentPhase === p.id
                const Icon = p.icon
                return (
                    <button
                        key={p.id}
                        onClick={() => setPhase(p.id)}
                        className={`
                            px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 transition-all
                            ${isActive
                                ? 'bg-indigo-600 text-white shadow-md transform scale-105'
                                : 'text-gray-500 hover:bg-gray-100'
                            }
                        `}
                    >
                        <Icon className="w-3 h-3" />
                        <span className={`${isActive ? 'opacity-100' : 'opacity-0 hidden sm:inline-block w-0 overflow-hidden'} duration-300`}>
                            {p.label}
                        </span>
                        {isActive && p.label}
                    </button>
                )
            })}
        </div>
    )
}
