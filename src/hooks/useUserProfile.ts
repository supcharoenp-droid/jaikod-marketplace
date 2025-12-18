'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import {
    UserProfile,
    UserRole,
    SellerLevel,
    AiMode,
    FeaturesUnlocked,
    calculateUnlockedFeatures,
    UPGRADE_PATHS,
    UpgradeSuggestion
} from '@/types/user-profile'

interface UseUserProfileReturn {
    profile: UserProfile | null
    loading: boolean
    error: Error | null

    // Feature checks
    hasFeature: (feature: keyof FeaturesUnlocked) => boolean
    canUpgrade: boolean
    nextUpgrade: UpgradeSuggestion | null

    // Actions
    updateProfile: (updates: Partial<UserProfile>) => Promise<void>
    upgradeRole: (newRole: UserRole) => Promise<void>
    unlockFeature: (feature: keyof FeaturesUnlocked) => Promise<void>

    // Refresh
    refresh: () => Promise<void>
}

export function useUserProfile(): UseUserProfileReturn {
    const { user } = useAuth()
    const [profile, setProfile] = useState<UserProfile | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<Error | null>(null)

    // Load user profile from Firestore
    const loadProfile = useCallback(async () => {
        if (!user) {
            setProfile(null)
            setLoading(false)
            return
        }

        try {
            setLoading(true)
            const userDoc = await getDoc(doc(db, 'users', user.uid))

            if (userDoc.exists()) {
                const data = userDoc.data()

                // Calculate features based on role, level, and AI mode
                const calculatedFeatures = calculateUnlockedFeatures(
                    data.role || 'buyer',
                    data.seller_level,
                    data.ai_mode
                )

                const userProfile: UserProfile = {
                    uid: user.uid,
                    email: user.email || '',
                    displayName: user.displayName || data.displayName || '',
                    photoURL: user.photoURL || data.photoURL,
                    role: data.role || 'buyer',
                    seller_level: data.seller_level,
                    seller_type: data.seller_type,
                    onboarding_step: data.onboarding?.step || 0,
                    onboarding_completed: data.onboarding?.isCompleted || false,
                    ai_mode: data.ai_mode || 'basic',
                    ai_preferences: data.ai_preferences || {
                        auto_pricing: true,
                        auto_description: true,
                        auto_categorization: true,
                        smart_replies: false
                    },
                    features_unlocked: {
                        ...calculatedFeatures,
                        ...data.features_unlocked // Allow manual overrides
                    },
                    verification: data.verification || {
                        email: user.emailVerified || false,
                        phone: false,
                        identity: false,
                        business: false
                    },
                    language: data.language || 'th',
                    currency: data.currency || 'THB',
                    timezone: data.timezone || 'Asia/Bangkok',
                    created_at: data.created_at || new Date().toISOString(),
                    updated_at: data.updated_at || new Date().toISOString(),
                    last_login: new Date().toISOString()
                }

                setProfile(userProfile)

                // Update last login
                await updateDoc(doc(db, 'users', user.uid), {
                    last_login: new Date().toISOString()
                })
            } else {
                // Create default profile for new user
                const defaultProfile: UserProfile = {
                    uid: user.uid,
                    email: user.email || '',
                    displayName: user.displayName || '',
                    photoURL: user.photoURL || undefined,
                    role: 'buyer',
                    onboarding_step: 0,
                    onboarding_completed: false,
                    ai_mode: 'basic',
                    features_unlocked: calculateUnlockedFeatures('buyer'),
                    verification: {
                        email: user.emailVerified || false,
                        phone: false,
                        identity: false,
                        business: false
                    },
                    language: 'th',
                    currency: 'THB',
                    timezone: 'Asia/Bangkok',
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                    last_login: new Date().toISOString()
                }

                setProfile(defaultProfile)

                // Save to Firestore
                await updateDoc(doc(db, 'users', user.uid), defaultProfile)
            }

            setError(null)
        } catch (err) {
            console.error('Error loading user profile:', err)
            setError(err as Error)
        } finally {
            setLoading(false)
        }
    }, [user])

    useEffect(() => {
        loadProfile()
    }, [loadProfile])

    // Check if user has a specific feature
    const hasFeature = useCallback((feature: keyof FeaturesUnlocked): boolean => {
        if (!profile) return false
        return profile.features_unlocked[feature] === true
    }, [profile])

    // Check if user can upgrade
    const canUpgrade = profile ? profile.role !== 'mall' : false

    const nextUpgrade = profile
        ? UPGRADE_PATHS.find(path => path.from === profile.role) || null
        : null

    // Update profile
    const updateProfile = useCallback(async (updates: Partial<UserProfile>) => {
        if (!user || !profile) return

        try {
            const updatedData = {
                ...updates,
                updated_at: new Date().toISOString()
            }

            await updateDoc(doc(db, 'users', user.uid), updatedData)

            // Recalculate features if role/level/ai_mode changed
            if (updates.role || updates.seller_level || updates.ai_mode) {
                const newFeatures = calculateUnlockedFeatures(
                    updates.role || profile.role,
                    updates.seller_level || profile.seller_level,
                    updates.ai_mode || profile.ai_mode
                )

                await updateDoc(doc(db, 'users', user.uid), {
                    features_unlocked: newFeatures
                })
            }

            await loadProfile()
        } catch (err) {
            console.error('Error updating profile:', err)
            throw err
        }
    }, [user, profile, loadProfile])

    // Upgrade role
    const upgradeRole = useCallback(async (newRole: UserRole) => {
        if (!user || !profile) return

        const newFeatures = calculateUnlockedFeatures(
            newRole,
            profile.seller_level,
            profile.ai_mode
        )

        await updateProfile({
            role: newRole,
            features_unlocked: newFeatures
        })
    }, [user, profile, updateProfile])

    // Unlock specific feature (manual override)
    const unlockFeature = useCallback(async (feature: keyof FeaturesUnlocked) => {
        if (!user || !profile) return

        const updatedFeatures = {
            ...profile.features_unlocked,
            [feature]: true
        }

        await updateDoc(doc(db, 'users', user.uid), {
            features_unlocked: updatedFeatures,
            updated_at: new Date().toISOString()
        })

        await loadProfile()
    }, [user, profile, loadProfile])

    return {
        profile,
        loading,
        error,
        hasFeature,
        canUpgrade,
        nextUpgrade,
        updateProfile,
        upgradeRole,
        unlockFeature,
        refresh: loadProfile
    }
}
