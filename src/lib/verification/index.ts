/**
 * Verification Service
 * 
 * Handles user verification status management with Firestore
 * Currently in DEMO MODE - Set to production when ready to go live
 */

import { db } from '@/lib/firebase'
import {
    doc,
    getDoc,
    setDoc,
    updateDoc,
    serverTimestamp,
    Timestamp
} from 'firebase/firestore'

// ==========================================
// CONFIG
// ==========================================

const DEMO_MODE = true // Set to false when connecting to real services

// ==========================================
// TYPES
// ==========================================

export interface UserVerification {
    user_id: string

    // Phone Verification
    phone_number?: string
    phone_verified: boolean
    phone_verified_at?: Timestamp

    // ID Verification
    id_verified: boolean
    id_verified_at?: Timestamp
    id_verification_method?: 'ai' | 'manual'
    id_document_encrypted?: string // Base64 encrypted
    id_selfie_encrypted?: string // Base64 encrypted
    id_match_score?: number // 0-100

    // Bank Verification  
    bank_verified: boolean
    bank_verified_at?: Timestamp
    bank_accounts?: BankAccountInfo[]

    // Business Verification (for Official Store)
    business_verified: boolean
    business_verified_at?: Timestamp
    business_documents?: BusinessDocument[]

    // Computed
    trust_score: number
    verification_tier: 'unverified' | 'basic' | 'pro' | 'official'

    // Metadata
    created_at: Timestamp
    updated_at: Timestamp
}

export interface BankAccountInfo {
    id: string
    bank_code: string
    bank_name: string
    account_number_masked: string // Last 4 digits only
    account_name: string
    is_primary: boolean
    verified_at: Timestamp
}

export interface BusinessDocument {
    type: 'registration_cert' | 'tax_cert' | 'authorization_letter'
    file_encrypted: string
    uploaded_at: Timestamp
    verified: boolean
    verified_at?: Timestamp
    notes?: string
}

// ==========================================
// DEFAULT VALUES
// ==========================================

const DEFAULT_VERIFICATION: Partial<UserVerification> = {
    phone_verified: false,
    id_verified: false,
    bank_verified: false,
    business_verified: false,
    trust_score: 50,
    verification_tier: 'unverified',
    bank_accounts: [],
    business_documents: []
}

// ==========================================
// HELPER FUNCTIONS
// ==========================================

/**
 * Calculate trust score based on verification status
 */
function calculateTrustScore(verification: Partial<UserVerification>): number {
    let score = 50 // Base score

    if (verification.phone_verified) score += 15
    if (verification.id_verified) score += 25
    if (verification.bank_verified) score += 15
    if (verification.business_verified) score += 10

    return Math.min(score, 100)
}

/**
 * Determine verification tier based on status
 */
function determineVerificationTier(verification: Partial<UserVerification>): UserVerification['verification_tier'] {
    if (verification.business_verified) return 'official'
    if (verification.id_verified && verification.bank_verified) return 'pro'
    if (verification.phone_verified) return 'basic'
    return 'unverified'
}

// ==========================================
// SERVICE FUNCTIONS
// ==========================================

/**
 * Get user verification status
 */
export async function getUserVerification(userId: string): Promise<UserVerification | null> {
    try {
        const docRef = doc(db, 'user_verifications', userId)
        const docSnap = await getDoc(docRef)

        if (!docSnap.exists()) {
            return null
        }

        return docSnap.data() as UserVerification
    } catch (error) {
        console.error('Error getting user verification:', error)
        return null
    }
}

/**
 * Initialize verification record for new user
 */
export async function initUserVerification(userId: string): Promise<UserVerification> {
    const now = serverTimestamp()

    const verification: Partial<UserVerification> = {
        user_id: userId,
        ...DEFAULT_VERIFICATION,
        created_at: now as Timestamp,
        updated_at: now as Timestamp
    }

    try {
        const docRef = doc(db, 'user_verifications', userId)
        await setDoc(docRef, verification)

        return verification as UserVerification
    } catch (error) {
        console.error('Error initializing user verification:', error)
        throw error
    }
}

/**
 * Update phone verification status
 */
export async function updatePhoneVerification(
    userId: string,
    phoneNumber: string,
    verified: boolean = true
): Promise<void> {
    try {
        const docRef = doc(db, 'user_verifications', userId)
        const docSnap = await getDoc(docRef)

        const currentData = docSnap.exists() ? docSnap.data() : DEFAULT_VERIFICATION

        const updates: Partial<UserVerification> = {
            phone_number: phoneNumber,
            phone_verified: verified,
            phone_verified_at: verified ? serverTimestamp() as Timestamp : undefined,
            updated_at: serverTimestamp() as Timestamp
        }

        // Recalculate trust score
        const newData = { ...currentData, ...updates }
        updates.trust_score = calculateTrustScore(newData)
        updates.verification_tier = determineVerificationTier(newData)

        if (docSnap.exists()) {
            await updateDoc(docRef, updates)
        } else {
            await setDoc(docRef, {
                user_id: userId,
                ...DEFAULT_VERIFICATION,
                ...updates,
                created_at: serverTimestamp()
            })
        }

        // Also update user profile
        await updateUserProfile(userId, {
            phone_verified: verified,
            trust_score: updates.trust_score
        })

        console.log(`✅ Phone verification updated for user ${userId}`)
    } catch (error) {
        console.error('Error updating phone verification:', error)
        throw error
    }
}

/**
 * Update ID verification status
 */
export async function updateIDVerification(
    userId: string,
    verified: boolean = true,
    matchScore?: number,
    method: 'ai' | 'manual' = 'ai'
): Promise<void> {
    try {
        const docRef = doc(db, 'user_verifications', userId)
        const docSnap = await getDoc(docRef)

        const currentData = docSnap.exists() ? docSnap.data() : DEFAULT_VERIFICATION

        const updates: Partial<UserVerification> = {
            id_verified: verified,
            id_verified_at: verified ? serverTimestamp() as Timestamp : undefined,
            id_verification_method: method,
            id_match_score: matchScore,
            updated_at: serverTimestamp() as Timestamp
        }

        // Recalculate trust score
        const newData = { ...currentData, ...updates }
        updates.trust_score = calculateTrustScore(newData)
        updates.verification_tier = determineVerificationTier(newData)

        if (docSnap.exists()) {
            await updateDoc(docRef, updates)
        } else {
            await setDoc(docRef, {
                user_id: userId,
                ...DEFAULT_VERIFICATION,
                ...updates,
                created_at: serverTimestamp()
            })
        }

        // Also update user profile
        await updateUserProfile(userId, {
            id_verified: verified,
            trust_score: updates.trust_score,
            verification_tier: updates.verification_tier
        })

        console.log(`✅ ID verification updated for user ${userId}`)
    } catch (error) {
        console.error('Error updating ID verification:', error)
        throw error
    }
}

/**
 * Update bank verification status
 */
export async function updateBankVerification(
    userId: string,
    account: {
        bank_code: string
        bank_name: string
        account_number: string
        account_name: string
    },
    verified: boolean = true
): Promise<void> {
    try {
        const docRef = doc(db, 'user_verifications', userId)
        const docSnap = await getDoc(docRef)

        const currentData = docSnap.exists() ? docSnap.data() : DEFAULT_VERIFICATION
        const currentAccounts = currentData.bank_accounts || []

        // Mask account number (show only last 4 digits)
        const maskedNumber = '•••• •••• ' + account.account_number.slice(-4)

        const newAccount: BankAccountInfo = {
            id: Date.now().toString(),
            bank_code: account.bank_code,
            bank_name: account.bank_name,
            account_number_masked: maskedNumber,
            account_name: account.account_name,
            is_primary: currentAccounts.length === 0, // First account is primary
            verified_at: serverTimestamp() as Timestamp
        }

        const updates: Partial<UserVerification> = {
            bank_verified: verified,
            bank_verified_at: verified ? serverTimestamp() as Timestamp : undefined,
            bank_accounts: [...currentAccounts, newAccount],
            updated_at: serverTimestamp() as Timestamp
        }

        // Recalculate trust score
        const newData = { ...currentData, ...updates }
        updates.trust_score = calculateTrustScore(newData)
        updates.verification_tier = determineVerificationTier(newData)

        if (docSnap.exists()) {
            await updateDoc(docRef, updates)
        } else {
            await setDoc(docRef, {
                user_id: userId,
                ...DEFAULT_VERIFICATION,
                ...updates,
                created_at: serverTimestamp()
            })
        }

        // Also update user profile
        await updateUserProfile(userId, {
            bank_verified: verified,
            trust_score: updates.trust_score,
            verification_tier: updates.verification_tier
        })

        console.log(`✅ Bank verification updated for user ${userId}`)
    } catch (error) {
        console.error('Error updating bank verification:', error)
        throw error
    }
}

/**
 * Helper to update user profile document
 */
async function updateUserProfile(userId: string, updates: Record<string, any>): Promise<void> {
    try {
        // Update profiles collection
        const profileRef = doc(db, 'profiles', userId)
        const profileSnap = await getDoc(profileRef)

        if (profileSnap.exists()) {
            await updateDoc(profileRef, {
                ...updates,
                updated_at: serverTimestamp()
            })
        }

        // Also update stores collection if exists
        const storeRef = doc(db, 'stores', userId)
        const storeSnap = await getDoc(storeRef)

        if (storeSnap.exists()) {
            await updateDoc(storeRef, {
                trust_score: updates.trust_score,
                updated_at: serverTimestamp()
            })
        }
    } catch (error) {
        console.error('Error updating user profile:', error)
        // Don't throw - this is a secondary update
    }
}

// ==========================================
// OTP SERVICE (Demo Implementation)
// ==========================================

/**
 * Send OTP to phone number
 * In production, replace with actual SMS service (Twilio, Firebase, etc.)
 */
export async function sendOTP(phoneNumber: string): Promise<{ success: boolean; message: string }> {
    if (DEMO_MODE) {
        console.log(`📱 [DEMO] Sending OTP to ${phoneNumber}`)
        console.log(`📱 [DEMO] OTP Code: 123456`)

        return {
            success: true,
            message: 'OTP sent successfully (Demo Mode)'
        }
    }

    // TODO: Implement real SMS service
    // Example with Twilio:
    // const twilioClient = require('twilio')(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)
    // await twilioClient.messages.create({
    //     body: `Your JaiKod verification code is: ${otpCode}`,
    //     to: phoneNumber,
    //     from: TWILIO_PHONE_NUMBER
    // })

    throw new Error('SMS service not configured')
}

/**
 * Verify OTP code
 * In production, verify against stored OTP
 */
export async function verifyOTP(phoneNumber: string, otpCode: string): Promise<boolean> {
    if (DEMO_MODE) {
        return otpCode === '123456'
    }

    // TODO: Implement real OTP verification
    // Check against stored OTP in Redis/Firestore with expiry

    throw new Error('OTP verification not configured')
}

// ==========================================
// EXPORTS
// ==========================================

export default {
    getUserVerification,
    initUserVerification,
    updatePhoneVerification,
    updateIDVerification,
    updateBankVerification,
    sendOTP,
    verifyOTP
}
