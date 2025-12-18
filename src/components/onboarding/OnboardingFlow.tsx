'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { doc, updateDoc, getDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import OnboardingGoalScreen from './OnboardingGoalScreen'
import OnboardingChecklist from './OnboardingChecklist'
import { SellingGoal, SellerType, OnboardingState } from '@/types/onboarding'

interface OnboardingFlowProps {
    onComplete: () => void
}

export default function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
    const { user, storeStatus, refreshProfile } = useAuth()
    const [currentStep, setCurrentStep] = useState<'goal' | 'checklist' | 'complete'>('goal')
    const [selectedGoal, setSelectedGoal] = useState<SellingGoal | null>(null)
    const [selectedRole, setSelectedRole] = useState<SellerType | null>(null)
    const [language, setLanguage] = useState<'th' | 'en'>('th')
    const [checklist, setChecklist] = useState({
        phone_verified: false,
        id_verified: false,
        bank_added: false,
        first_product_posted: false
    })

    // Load user language preference
    useEffect(() => {
        const loadUserPreferences = async () => {
            if (user) {
                try {
                    const userDoc = await getDoc(doc(db, 'users', user.uid))
                    if (userDoc.exists()) {
                        const userData = userDoc.data()
                        setLanguage(userData.language === 'en' ? 'en' : 'th')

                        // Load existing checklist status
                        if (userData.onboarding_checklist) {
                            setChecklist(userData.onboarding_checklist)
                        }
                    }
                } catch (error) {
                    console.error('Error loading user preferences:', error)
                }
            }
        }
        loadUserPreferences()
    }, [user])

    const handleGoalComplete = async (goal: SellingGoal, role: SellerType) => {
        setSelectedGoal(goal)
        setSelectedRole(role)

        // Save to Firebase
        if (user) {
            try {
                const userRef = doc(db, 'users', user.uid)
                await updateDoc(userRef, {
                    'onboarding.selectedGoal': goal,
                    'onboarding.assignedRole': role,
                    'onboarding.step': 2,
                    seller_type: role,
                    selling_goal: goal,
                    updated_at: new Date().toISOString()
                })

                // Also update seller profile if exists
                if (storeStatus.storeId) {
                    const sellerRef = doc(db, 'sellers', storeStatus.storeId)
                    await updateDoc(sellerRef, {
                        seller_type: role,
                        selling_goal: goal,
                        updated_at: new Date().toISOString()
                    })
                }

                await refreshProfile()
                setCurrentStep('checklist')
            } catch (error) {
                console.error('Error saving onboarding progress:', error)
            }
        }
    }

    const handleChecklistItemClick = async (itemId: string) => {
        // Handle specific actions based on item
        switch (itemId) {
            case 'phone_verified':
                // TODO: Open phone verification modal
                console.log('Open phone verification')
                break
            case 'id_verified':
                // TODO: Open ID verification modal
                console.log('Open ID verification')
                break
            case 'bank_added':
                // TODO: Open bank account setup
                console.log('Open bank setup')
                break
            case 'first_product_posted':
                // TODO: Navigate to product upload
                console.log('Navigate to product upload')
                break
            default:
                break
        }
    }

    const handleChecklistComplete = async () => {
        if (user) {
            try {
                const userRef = doc(db, 'users', user.uid)
                await updateDoc(userRef, {
                    'onboarding.step': 4,
                    'onboarding.isCompleted': true,
                    updated_at: new Date().toISOString()
                })

                await refreshProfile()
                onComplete()
            } catch (error) {
                console.error('Error completing onboarding:', error)
            }
        }
    }

    const handleSkip = async () => {
        if (user) {
            try {
                const userRef = doc(db, 'users', user.uid)
                await updateDoc(userRef, {
                    'onboarding.skipped': true,
                    'onboarding.step': 4,
                    updated_at: new Date().toISOString()
                })

                await refreshProfile()
                onComplete()
            } catch (error) {
                console.error('Error skipping onboarding:', error)
            }
        }
    }

    if (currentStep === 'goal') {
        return (
            <OnboardingGoalScreen
                language={language}
                onComplete={handleGoalComplete}
                onSkip={handleSkip}
            />
        )
    }

    if (currentStep === 'checklist' && selectedRole) {
        return (
            <OnboardingChecklist
                sellerType={selectedRole}
                language={language}
                checklist={checklist}
                onItemClick={handleChecklistItemClick}
                onComplete={handleChecklistComplete}
            />
        )
    }

    return null
}
