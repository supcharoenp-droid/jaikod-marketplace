'use client'

import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import {
    User,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    updateProfile,
    sendPasswordResetEmail,
    GoogleAuthProvider,
    FacebookAuthProvider,
    signInWithPopup,
    OAuthProvider
} from 'firebase/auth'
import { auth, db } from '@/lib/firebase'
import { doc, getDoc } from 'firebase/firestore'
import { getSellerProfile } from '@/lib/seller'
import { logSecurityEvent } from '@/lib/securityLogger'

// ==========================================
// SELLER TYPE DEFINITIONS
// ==========================================

/**
 * Seller Account Types
 * - individual: ผู้ขายทั่วไป (C2C)
 * - general_store: ร้านค้าทั่วไป (B2C)
 * - official_store: ร้านค้าทางการ (Verified Business)
 */
export type SellerAccountType = 'individual' | 'general_store' | 'official_store'

/**
 * Legacy seller types (for backwards compatibility)
 */
type LegacySellerType = 'pro' | 'mall'

/**
 * Seller Verification Status
 */
export type SellerVerificationStatus = 'unverified' | 'pending' | 'verified' | 'rejected'

// ==========================================
// SELLER CONFIG
// ==========================================

export interface SellerTypeConfig {
    id: SellerAccountType
    name: string
    name_th: string
    description: string
    icon: string
    color: string
    features: {
        listing_limit: number | null  // null = unlimited
        photo_per_listing: number
        can_create_store: boolean
        can_create_coupons: boolean
        can_flash_sale: boolean
        api_access: boolean
        priority_support: boolean
        verified_badge: boolean
    }
    requirements: {
        kyc_required: boolean
        business_doc_required: boolean
        min_sales?: number
    }
}

export const SELLER_TYPE_CONFIG: Record<SellerAccountType, SellerTypeConfig> = {
    individual: {
        id: 'individual',
        name: 'Individual Seller',
        name_th: 'ผู้ขายทั่วไป',
        description: 'สำหรับขายของมือสอง ของสะสม หรือของใช้ส่วนตัว',
        icon: '👤',
        color: '#6B7280',
        features: {
            listing_limit: 20,
            photo_per_listing: 5,
            can_create_store: false,
            can_create_coupons: false,
            can_flash_sale: false,
            api_access: false,
            priority_support: false,
            verified_badge: false
        },
        requirements: {
            kyc_required: false,
            business_doc_required: false
        }
    },
    general_store: {
        id: 'general_store',
        name: 'General Store',
        name_th: 'ร้านค้าทั่วไป',
        description: 'สำหรับร้านค้าขนาดเล็ก-กลาง ลงขายไม่จำกัด มีหน้าร้าน',
        icon: '🏪',
        color: '#3B82F6',
        features: {
            listing_limit: null,
            photo_per_listing: 10,
            can_create_store: true,
            can_create_coupons: true,
            can_flash_sale: false,
            api_access: false,
            priority_support: false,
            verified_badge: false
        },
        requirements: {
            kyc_required: true,
            business_doc_required: false
        }
    },
    official_store: {
        id: 'official_store',
        name: 'Official Store',
        name_th: 'ร้านค้าทางการ',
        description: 'สำหรับแบรนด์และธุรกิจที่จดทะเบียน ได้เครื่องหมายยืนยัน',
        icon: '🏢',
        color: '#10B981',
        features: {
            listing_limit: null,
            photo_per_listing: 20,
            can_create_store: true,
            can_create_coupons: true,
            can_flash_sale: true,
            api_access: true,
            priority_support: true,
            verified_badge: true
        },
        requirements: {
            kyc_required: true,
            business_doc_required: true
        }
    }
}

// ==========================================
// STORE STATUS INTERFACE
// ==========================================

interface StoreStatus {
    hasStore: boolean
    storeId: string | null
    shopName: string | null
    onboardingStep?: number
    onboardingProgress: number // 0-7

    // New seller type system
    sellerType: SellerAccountType | null
    sellerConfig: SellerTypeConfig | null
    verificationStatus: SellerVerificationStatus

    // JaiStar info
    jaistarBalance: number
    jaistarTier: 'bronze' | 'silver' | 'gold' | 'platinum'
}

// ==========================================
// JAISTAR ACCOUNT INFO
// ==========================================

interface JaiStarInfo {
    balance: number
    tier: 'bronze' | 'silver' | 'gold' | 'platinum'
}

// ==========================================
// AUTH CONTEXT
// ==========================================

interface AuthContextType {
    user: User | null
    loading: boolean
    storeStatus: StoreStatus
    signUp: (email: string, password: string, displayName: string) => Promise<void>
    signIn: (email: string, password: string) => Promise<void>
    signInWithGoogle: () => Promise<void>
    signInWithFacebook: () => Promise<void>
    signInWithLine: () => Promise<void>
    resetPassword: (email: string) => Promise<void>
    logout: () => Promise<void>
    impersonate: (uid: string) => Promise<void>
    refreshProfile: () => Promise<void>

    // Helper functions
    isStoreSeller: () => boolean
    isOfficialStore: () => boolean
    canCreateStore: () => boolean
    getSellerConfig: () => SellerTypeConfig | null
}

const defaultStoreStatus: StoreStatus = {
    hasStore: false,
    storeId: null,
    shopName: null,
    onboardingProgress: 0,
    sellerType: null,
    sellerConfig: null,
    verificationStatus: 'unverified',
    jaistarBalance: 0,
    jaistarTier: 'bronze'
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
    storeStatus: defaultStoreStatus,
    signUp: async () => { },
    signIn: async () => { },
    signInWithGoogle: async () => { },
    signInWithFacebook: async () => { },
    signInWithLine: async () => { },
    resetPassword: async () => { },
    logout: async () => { },
    impersonate: async () => { },
    refreshProfile: async () => { },
    isStoreSeller: () => false,
    isOfficialStore: () => false,
    canCreateStore: () => true,
    getSellerConfig: () => null
})

export const useAuth = () => useContext(AuthContext)

// ==========================================
// UTILITY FUNCTIONS
// ==========================================

/**
 * Map legacy seller types to new types
 */
function mapLegacySellerType(type: string | null | undefined): SellerAccountType {
    if (!type) return 'individual'

    const mapping: Record<string, SellerAccountType> = {
        'individual': 'individual',
        'pro': 'general_store',      // Legacy: pro -> general_store
        'mall': 'official_store',    // Legacy: mall -> official_store
        'general_store': 'general_store',
        'official_store': 'official_store'
    }

    return mapping[type] || 'individual'
}

/**
 * Fetch JaiStar account info
 */
async function getJaiStarInfo(userId: string): Promise<JaiStarInfo> {
    try {
        const accountDoc = await getDoc(doc(db, 'jaistar_accounts', userId))
        if (accountDoc.exists()) {
            const data = accountDoc.data()
            return {
                balance: data.balance || 0,
                tier: data.tier || 'bronze'
            }
        }
    } catch (error) {
        console.error('Error fetching JaiStar info:', error)
    }
    return { balance: 0, tier: 'bronze' }
}

// ==========================================
// AUTH PROVIDER
// ==========================================

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)
    const [storeStatus, setStoreStatus] = useState<StoreStatus>(defaultStoreStatus)

    const refreshProfile = useCallback(async () => {
        if (!auth.currentUser) {
            setStoreStatus(defaultStoreStatus)
            return
        }

        try {
            const profile = await getSellerProfile(auth.currentUser.uid)
            const jaistarInfo = await getJaiStarInfo(auth.currentUser.uid)

            if (profile) {
                const rawSellerType = (profile as any).seller_type
                const sellerType = mapLegacySellerType(rawSellerType)
                const sellerConfig = SELLER_TYPE_CONFIG[sellerType]

                setStoreStatus({
                    hasStore: true,
                    storeId: profile.id,
                    shopName: profile.name,
                    onboardingProgress: profile.onboarding_progress || 0,
                    sellerType,
                    sellerConfig,
                    verificationStatus: (profile as any).verification_status || 'unverified',
                    jaistarBalance: jaistarInfo.balance,
                    jaistarTier: jaistarInfo.tier
                })
            } else {
                setStoreStatus({
                    ...defaultStoreStatus,
                    jaistarBalance: jaistarInfo.balance,
                    jaistarTier: jaistarInfo.tier
                })
            }
        } catch (error) {
            console.error("Error refreshing profile:", error)
            setStoreStatus(defaultStoreStatus)
        }
    }, [])

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            setUser(user)
            if (user) {
                await refreshProfile()
            } else {
                setStoreStatus(defaultStoreStatus)
            }
            setLoading(false)
        })

        return unsubscribe
    }, [refreshProfile])

    const signUp = async (email: string, password: string, displayName: string) => {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password)

        if (userCredential.user) {
            await updateProfile(userCredential.user, {
                displayName: displayName
            })
            setUser(auth.currentUser)
            await refreshProfile()
        }
    }

    const signIn = async (email: string, password: string) => {
        try {
            const result = await signInWithEmailAndPassword(auth, email, password)
            if (result.user) {
                logSecurityEvent(result.user.uid, 'LOGIN', 'SUCCESS')
            }
        } catch (error: any) {
            logSecurityEvent(email, 'LOGIN_FAILED', 'FAILURE', error.message)
            throw error
        }
    }

    const resetPassword = async (email: string) => {
        await sendPasswordResetEmail(auth, email)
    }

    // Google Sign In
    const signInWithGoogle = async () => {
        const provider = new GoogleAuthProvider()
        provider.addScope('email')
        provider.addScope('profile')
        try {
            const result = await signInWithPopup(auth, provider)
            if (result.user) {
                logSecurityEvent(result.user.uid, 'LOGIN_GOOGLE', 'SUCCESS')
            }
        } catch (error: any) {
            logSecurityEvent('google', 'LOGIN_GOOGLE_FAILED', 'FAILURE', error.message)
            throw error
        }
    }

    // Facebook Sign In
    const signInWithFacebook = async () => {
        const provider = new FacebookAuthProvider()
        provider.addScope('email')
        provider.addScope('public_profile')
        try {
            const result = await signInWithPopup(auth, provider)
            if (result.user) {
                logSecurityEvent(result.user.uid, 'LOGIN_FACEBOOK', 'SUCCESS')
            }
        } catch (error: any) {
            logSecurityEvent('facebook', 'LOGIN_FACEBOOK_FAILED', 'FAILURE', error.message)
            throw error
        }
    }

    // LINE Sign In (using OIDC)
    const signInWithLine = async () => {
        // LINE Login uses OIDC provider in Firebase
        // Note: You need to configure LINE Login in Firebase Console
        const provider = new OAuthProvider('oidc.line')
        provider.addScope('openid')
        provider.addScope('profile')
        provider.addScope('email')
        try {
            const result = await signInWithPopup(auth, provider)
            if (result.user) {
                logSecurityEvent(result.user.uid, 'LOGIN_LINE', 'SUCCESS')
            }
        } catch (error: any) {
            logSecurityEvent('line', 'LOGIN_LINE_FAILED', 'FAILURE', error.message)
            throw error
        }
    }

    const impersonate = async (uid: string) => {
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
            setStoreStatus({
                hasStore: true,
                storeId: 'mock-store-id',
                shopName: 'Vintage Collectibles',
                onboardingProgress: 7,
                sellerType: 'general_store',
                sellerConfig: SELLER_TYPE_CONFIG.general_store,
                verificationStatus: 'verified',
                jaistarBalance: 500,
                jaistarTier: 'silver'
            })
        } else if (uid === 'official_store_001') {
            mockUser = {
                ...mockUser,
                email: 'official@example.com',
                displayName: 'Samsung Official Store',
                photoURL: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Samsung'
            }
            setStoreStatus({
                hasStore: true,
                storeId: 'official-store-id',
                shopName: 'Samsung Official Store',
                onboardingProgress: 7,
                sellerType: 'official_store',
                sellerConfig: SELLER_TYPE_CONFIG.official_store,
                verificationStatus: 'verified',
                jaistarBalance: 5000,
                jaistarTier: 'platinum'
            })
        } else if (uid === 'new_buyer_001') {
            mockUser = {
                ...mockUser,
                email: 'newbie@example.com',
                displayName: 'New Shopper',
                photoURL: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix'
            }
            setStoreStatus({
                ...defaultStoreStatus,
                jaistarBalance: 50,
                jaistarTier: 'bronze'
            })
        } else {
            mockUser = {
                ...mockUser,
                email: 'mock@example.com',
                displayName: 'Mock User',
                photoURL: ''
            }
            await refreshProfile()
        }

        setUser(mockUser as unknown as User)
    }

    const logout = async () => {
        const uid = auth.currentUser?.uid
        await signOut(auth)
        if (uid) {
            logSecurityEvent(uid, 'LOGOUT', 'SUCCESS')
        }
        setStoreStatus(defaultStoreStatus)
    }

    // Helper functions
    const isStoreSeller = () => {
        return storeStatus.sellerType === 'general_store' || storeStatus.sellerType === 'official_store'
    }

    const isOfficialStore = () => {
        return storeStatus.sellerType === 'official_store'
    }

    const canCreateStore = () => {
        // Individual can upgrade to store
        return storeStatus.sellerType === 'individual' || !storeStatus.hasStore
    }

    const getSellerConfig = () => {
        return storeStatus.sellerConfig
    }

    const value = {
        user,
        loading,
        storeStatus,
        signUp,
        signIn,
        signInWithGoogle,
        signInWithFacebook,
        signInWithLine,
        resetPassword,
        logout,
        impersonate,
        refreshProfile,
        isStoreSeller,
        isOfficialStore,
        canCreateStore,
        getSellerConfig
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}
