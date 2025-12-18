'use client'

import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import {
    User,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    updateProfile
} from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { getSellerProfile } from '@/lib/seller'
import { logSecurityEvent } from '@/lib/securityLogger'

interface StoreStatus {
    hasStore: boolean
    storeId: string | null
    shopName: string | null
    onboardingStep?: number // Optional: track progress if needed
    onboardingProgress: number // 0-7
    sellerType: 'individual' | 'pro' | 'mall' | null
}

interface AuthContextType {
    user: User | null
    loading: boolean
    storeStatus: StoreStatus
    signUp: (email: string, password: string, displayName: string) => Promise<void>
    signIn: (email: string, password: string) => Promise<void>
    logout: () => Promise<void>
    impersonate: (uid: string) => Promise<void>
    refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
    storeStatus: { hasStore: false, storeId: null, shopName: null, onboardingProgress: 0, sellerType: null },
    signUp: async () => { },
    signIn: async () => { },
    logout: async () => { },
    impersonate: async () => { },
    refreshProfile: async () => { }
})

export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)
    const [storeStatus, setStoreStatus] = useState<StoreStatus>({ hasStore: false, storeId: null, shopName: null, onboardingProgress: 0, sellerType: null })

    const refreshProfile = useCallback(async () => {
        if (!auth.currentUser) {
            setStoreStatus({ hasStore: false, storeId: null, shopName: null, onboardingProgress: 0, sellerType: null })
            return
        }

        try {
            const profile = await getSellerProfile(auth.currentUser.uid)
            if (profile) {
                setStoreStatus({
                    hasStore: true,
                    storeId: profile.id,
                    shopName: profile.name,
                    onboardingProgress: profile.onboarding_progress || 0,
                    sellerType: (profile as any).seller_type || 'individual'
                })
            } else {
                setStoreStatus({ hasStore: false, storeId: null, shopName: null, onboardingProgress: 0, sellerType: null })
            }
        } catch (error) {
            console.error("Error refreshing profile:", error)
            setStoreStatus({ hasStore: false, storeId: null, shopName: null, onboardingProgress: 0, sellerType: null })
        }
    }, [])

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            setUser(user)
            if (user) {
                await refreshProfile()
            } else {
                setStoreStatus({ hasStore: false, storeId: null, shopName: null, onboardingProgress: 0, sellerType: null })
            }
            setLoading(false)
        })

        return unsubscribe
    }, [refreshProfile])

    const signUp = async (email: string, password: string, displayName: string) => {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password)

        // Update display name
        if (userCredential.user) {
            await updateProfile(userCredential.user, {
                displayName: displayName
            })
            // Refresh user to get updated profile
            setUser(auth.currentUser)
            await refreshProfile()
        }
    }

    const signIn = async (email: string, password: string) => {
        try {
            const result = await signInWithEmailAndPassword(auth, email, password)
            if (result.user) {
                // Non-blocking security log
                logSecurityEvent(result.user.uid, 'LOGIN', 'SUCCESS')
            }
        } catch (error: any) {
            // Log failed attempt
            logSecurityEvent(email, 'LOGIN_FAILED', 'FAILURE', error.message)
            throw error // Re-throw to handle in UI
        }
    }

    const impersonate = async (uid: string) => {
        // Mock user for development
        let mockUser: any = {
            uid,
            emailVerified: true,
            isAnonymous: false,
            metadata: {},
            providerData: [],
            refreshToken: '',
            tenantId: '',
            delete: async () => { },
            getIdToken: async () => 'mock-token',
            getIdTokenResult: async () => ({} as any),
            reload: async () => { },
            toJSON: () => ({}),
            phoneNumber: null,
            providerId: 'firebase'
        }

        if (uid === 'seed_seller_002') {
            mockUser = {
                ...mockUser,
                email: 'vintage@example.com',
                displayName: 'Vintage Collectibles',
                photoURL: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Annie'
            }
        } else if (uid === 'new_buyer_001') {
            mockUser = {
                ...mockUser,
                email: 'newbie@example.com',
                displayName: 'New Shopper',
                photoURL: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix'
            }
        } else {
            mockUser = {
                ...mockUser,
                email: 'mock@example.com',
                displayName: 'Mock User',
                photoURL: ''
            }
        }

        // Cast to unknown first to avoid partial type errors with User interface
        setUser(mockUser as unknown as User)
        // Note: effectively we should also mock storeStatus for impersonated users
        // But for now, we assume getSellerProfile(uid) connects to real DB which might not have these mocks.
        // For 'seed_seller_002', we might want to fake it if not in DB.
        if (uid === 'seed_seller_002') {
            setStoreStatus({ hasStore: true, storeId: 'mock-store-id', shopName: 'Vintage Collectibles', onboardingProgress: 7, sellerType: 'pro' })
        } else {
            await refreshProfile()
        }
    }

    const logout = async () => {
        const uid = auth.currentUser?.uid
        await signOut(auth)
        if (uid) {
            logSecurityEvent(uid, 'LOGOUT', 'SUCCESS')
        }
        setStoreStatus({ hasStore: false, storeId: null, shopName: null, onboardingProgress: 0, sellerType: null })
    }

    const value = {
        user,
        loading,
        storeStatus,
        signUp,
        signIn,
        logout,
        impersonate,
        refreshProfile
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}
