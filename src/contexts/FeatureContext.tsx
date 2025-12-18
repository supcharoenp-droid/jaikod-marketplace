'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { SystemPhase, FEATURE_FLAGS, isFeatureEnabled } from '@/config/feature-flags'

interface FeatureContextType {
    currentPhase: SystemPhase
    setPhase: (phase: SystemPhase) => void
    isEnabled: (featureMinPhase: SystemPhase) => boolean
}

const FeatureContext = createContext<FeatureContextType>({
    currentPhase: SystemPhase.PHASE_1_BASIC,
    setPhase: () => { },
    isEnabled: () => false
})

export function FeatureProvider({ children }: { children: React.ReactNode }) {
    const [currentPhase, setCurrentPhase] = useState<SystemPhase>(SystemPhase.PHASE_1_BASIC)

    const isEnabled = (featureMinPhase: SystemPhase) => {
        return isFeatureEnabled(featureMinPhase, currentPhase)
    }

    return (
        <FeatureContext.Provider value={{ currentPhase, setPhase: setCurrentPhase, isEnabled }}>
            {children}
        </FeatureContext.Provider>
    )
}

export const useFeatures = () => useContext(FeatureContext)

interface FeatureGuardProps {
    phase: SystemPhase
    children: React.ReactNode
    fallback?: React.ReactNode
}

export function FeatureGuard({ phase, children, fallback = null }: FeatureGuardProps) {
    const { isEnabled } = useFeatures()

    if (isEnabled(phase)) {
        return <>{children}</>
    }

    return <>{fallback}</>
}
