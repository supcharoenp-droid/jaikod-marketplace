'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useLanguage } from '@/contexts/LanguageContext'

// --- Types ---

export type UserRole = 'buyer' | 'seller'

export interface ProfileUser {
    id: string
    name: string
    avatar: string
    email: string
    phone: string
    roles: UserRole[]
    prefersLanguage: 'th' | 'en'
}

export interface ProfileStats {
    coins: number
    points: number
    buyerLevel: number
    sellerLevel: number
    progress: {
        buyer: number
        seller: number
    }
}

export interface OrdersSummary {
    all: number
    pending: number
    paid: number
    shipped: number
    completed: number
    cancelled: number
}

export interface ProfilePreferences {
    notifications: boolean
    darkMode: boolean
}

export interface ProfileState {
    user: ProfileUser | null
    stats: ProfileStats
    ordersSummary: OrdersSummary
    preferences: ProfilePreferences
    isLoading: boolean
}

// --- Dev Mode Configuration ---
const DEV_MODE = {
    mockUser: true,
    bypassKYC: true,
    mockOrders: true
}

const MOCK_PROFILE: ProfileState = {
    user: {
        id: 'dev_001',
        name: 'Test Identity',
        avatar: 'https://via.placeholder.com/150',
        email: 'dev@jaikod.com',
        phone: '0812345678',
        roles: ['buyer', 'seller'],
        prefersLanguage: 'th'
    },
    stats: {
        coins: 1250,
        points: 450,
        buyerLevel: 2,
        sellerLevel: 1,
        progress: {
            buyer: 75,
            seller: 30
        }
    },
    ordersSummary: {
        all: 15,
        pending: 1,
        paid: 0,
        shipped: 2,
        completed: 11,
        cancelled: 1
    },
    preferences: {
        notifications: true,
        darkMode: false
    },
    isLoading: false
}

// --- Context ---

interface ProfileContextType extends ProfileState {
    refreshProfile: () => Promise<void>
    updatePreferences: (prefs: Partial<ProfilePreferences>) => Promise<void>
    roleMode: 'buyer' | 'seller' | 'hybrid'
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined)

export function ProfileProvider({ children }: { children: React.ReactNode }) {
    const { user: authUser } = useAuth()
    const { language } = useLanguage() // Assuming LanguageContext provides current language code

    // Core State
    const [state, setState] = useState<ProfileState>({
        user: null,
        stats: { coins: 0, points: 0, buyerLevel: 1, sellerLevel: 0, progress: { buyer: 0, seller: 0 } },
        ordersSummary: { all: 0, pending: 0, paid: 0, shipped: 0, completed: 0, cancelled: 0 },
        preferences: { notifications: true, darkMode: false },
        isLoading: true
    })

    // Computed Role Mode (Buyer | Seller | Hybrid)
    const roleMode = state.user?.roles.includes('seller') ? 'hybrid' : 'buyer'

    // Load Profile Data
    const refreshProfile = async () => {
        setState(prev => ({ ...prev, isLoading: true }))

        try {
            if (DEV_MODE.mockUser) {
                // Simulate API latency
                await new Promise(resolve => setTimeout(resolve, 500))
                setState({
                    ...MOCK_PROFILE,
                    // Override mock language with actual app language context if needed, or sync them
                    user: {
                        ...MOCK_PROFILE.user!,
                        prefersLanguage: language as 'th' | 'en'
                    }
                })
            } else {
                // TODO: Real API call here using authUser.uid
                // const data = await fetchProfile(authUser.uid)
                // setState(data)
            }
        } catch (error) {
            console.error("Failed to load profile", error)
        } finally {
            setState(prev => ({ ...prev, isLoading: false }))
        }
    }

    const updatePreferences = async (prefs: Partial<ProfilePreferences>) => {
        setState(prev => ({
            ...prev,
            preferences: { ...prev.preferences, ...prefs }
        }))
        // TODO: Sync with backend
    }

    // Initial Load
    useEffect(() => {
        refreshProfile()
    }, [authUser])

    return (
        <ProfileContext.Provider value={{
            ...state,
            refreshProfile,
            updatePreferences,
            roleMode
        }}>
            {children}
        </ProfileContext.Provider>
    )
}

export function useProfile() {
    const context = useContext(ProfileContext)
    if (context === undefined) {
        throw new Error('useProfile must be used within a ProfileProvider')
    }
    return context
}
