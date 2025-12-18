'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import OnboardingFlow from '@/components/onboarding/OnboardingFlow'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'

export default function OnboardingPage() {
    const router = useRouter()
    const { user, storeStatus } = useAuth()
    const [showOnboarding, setShowOnboarding] = useState(true)
    const [isChecking, setIsChecking] = useState(true)

    // Check if user needs onboarding
    useEffect(() => {
        const checkOnboardingStatus = async () => {
            if (!user) {
                router.push('/login')
                return
            }

            try {
                // Check if user has completed onboarding
                const userDoc = await getDoc(doc(db, 'users', user.uid))
                const userData = userDoc.data()

                // If user has a role and onboarding is completed, redirect
                if (userData?.role && userData.role !== 'buyer') {
                    // Check if onboarding is completed
                    const onboardingCompleted = userData.onboarding?.isCompleted ||
                        storeStatus.hasStore ||
                        storeStatus.onboardingProgress >= 2

                    if (onboardingCompleted) {
                        // Redirect based on role
                        if (userData.role === 'seller' || userData.role === 'shop' || userData.role === 'mall') {
                            router.push('/seller')
                        } else {
                            router.push('/sell')
                        }
                        return
                    }
                }

                // If user is a buyer trying to access onboarding, show the flow
                setIsChecking(false)
            } catch (error) {
                console.error('Error checking onboarding status:', error)
                setIsChecking(false)
            }
        }

        checkOnboardingStatus()
    }, [user, router, storeStatus])

    // Redirect after onboarding complete
    useEffect(() => {
        if (!showOnboarding && user) {
            router.push('/sell')
        }
    }, [showOnboarding, user, router])

    // Show loading while checking
    if (!user || isChecking) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                    <p className="text-gray-500">Loading...</p>
                </div>
            </div>
        )
    }

    return (
        <OnboardingFlow
            onComplete={() => {
                setShowOnboarding(false)
            }}
        />
    )
}
