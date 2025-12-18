'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import {
    UnlockStage,
    UserProgress,
    isFeatureUnlocked,
    getNextMilestone,
    calculateProgress,
    PROGRESSION_TRIGGERS
} from '@/types/progressive-unlock'

interface UseProgressiveUnlockReturn {
    progress: UserProgress | null
    loading: boolean

    // Feature checks
    isUnlocked: (featureId: string) => boolean
    getVisibleFeatures: () => string[]

    // Progress
    progressPercentage: number
    nextMilestone: ReturnType<typeof getNextMilestone>

    // Actions
    recordAction: (action: string) => Promise<void>
    skipAction: (action: string) => Promise<void>
    unlockFeature: (featureId: string) => Promise<void>

    // Refresh
    refresh: () => Promise<void>
}

export function useProgressiveUnlock(): UseProgressiveUnlockReturn {
    const { user } = useAuth()
    const [progress, setProgress] = useState<UserProgress | null>(null)
    const [loading, setLoading] = useState(true)

    // Load user progress
    const loadProgress = useCallback(async () => {
        if (!user) {
            setProgress(null)
            setLoading(false)
            return
        }

        try {
            setLoading(true)
            const userDoc = await getDoc(doc(db, 'users', user.uid))

            if (userDoc.exists()) {
                const data = userDoc.data()

                const userProgress: UserProgress = {
                    currentStage: data.progressive_unlock?.currentStage || 'beginner',
                    completedActions: data.progressive_unlock?.completedActions || [],
                    skippedActions: data.progressive_unlock?.skippedActions || [],
                    unlockedFeatures: data.progressive_unlock?.unlockedFeatures || [],
                    lastUpdated: data.progressive_unlock?.lastUpdated || new Date().toISOString()
                }

                setProgress(userProgress)
            } else {
                // Initialize for new user
                const defaultProgress: UserProgress = {
                    currentStage: 'beginner',
                    completedActions: [],
                    skippedActions: [],
                    unlockedFeatures: [],
                    lastUpdated: new Date().toISOString()
                }

                setProgress(defaultProgress)

                await updateDoc(doc(db, 'users', user.uid), {
                    progressive_unlock: defaultProgress
                })
            }
        } catch (error) {
            console.error('Error loading progressive unlock:', error)
        } finally {
            setLoading(false)
        }
    }, [user])

    useEffect(() => {
        loadProgress()
    }, [loadProgress])

    // Check if feature is unlocked
    const isUnlocked = useCallback((featureId: string): boolean => {
        if (!progress) return false
        return isFeatureUnlocked(featureId, progress)
    }, [progress])

    // Get all visible features for current stage
    const getVisibleFeatures = useCallback((): string[] => {
        if (!progress) return []

        return progress.unlockedFeatures
    }, [progress])

    // Calculate progress percentage
    const progressPercentage = progress ? calculateProgress(progress) : 0

    // Get next milestone
    const nextMilestone = progress ? getNextMilestone(progress) : null

    // Record completed action
    const recordAction = useCallback(async (action: string) => {
        if (!user || !progress) return

        try {
            const updatedActions = [...progress.completedActions, action]

            // Check if this action triggers stage progression
            let newStage = progress.currentStage
            for (const [key, trigger] of Object.entries(PROGRESSION_TRIGGERS)) {
                if (trigger.action === action) {
                    newStage = trigger.nextStage
                    break
                }
            }

            const updatedProgress: UserProgress = {
                ...progress,
                currentStage: newStage,
                completedActions: updatedActions,
                lastUpdated: new Date().toISOString()
            }

            await updateDoc(doc(db, 'users', user.uid), {
                progressive_unlock: updatedProgress
            })

            setProgress(updatedProgress)
        } catch (error) {
            console.error('Error recording action:', error)
        }
    }, [user, progress])

    // Skip action
    const skipAction = useCallback(async (action: string) => {
        if (!user || !progress) return

        try {
            const updatedSkipped = [...progress.skippedActions, action]

            const updatedProgress: UserProgress = {
                ...progress,
                skippedActions: updatedSkipped,
                lastUpdated: new Date().toISOString()
            }

            await updateDoc(doc(db, 'users', user.uid), {
                progressive_unlock: updatedProgress
            })

            setProgress(updatedProgress)
        } catch (error) {
            console.error('Error skipping action:', error)
        }
    }, [user, progress])

    // Manually unlock feature (admin override)
    const unlockFeature = useCallback(async (featureId: string) => {
        if (!user || !progress) return

        try {
            const updatedFeatures = [...progress.unlockedFeatures, featureId]

            const updatedProgress: UserProgress = {
                ...progress,
                unlockedFeatures: updatedFeatures,
                lastUpdated: new Date().toISOString()
            }

            await updateDoc(doc(db, 'users', user.uid), {
                progressive_unlock: updatedProgress
            })

            setProgress(updatedProgress)
        } catch (error) {
            console.error('Error unlocking feature:', error)
        }
    }, [user, progress])

    return {
        progress,
        loading,
        isUnlocked,
        getVisibleFeatures,
        progressPercentage,
        nextMilestone,
        recordAction,
        skipAction,
        unlockFeature,
        refresh: loadProgress
    }
}
