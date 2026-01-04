/**
 * ============================================
 * Phone Verification Service
 * ============================================
 * 
 * Uses Firebase Phone Authentication
 * - Send OTP via SMS
 * - Verify OTP code
 * - Update user verification status
 */

import { auth, db } from '@/lib/firebase'
import {
    RecaptchaVerifier,
    signInWithPhoneNumber,
    ConfirmationResult,
    PhoneAuthProvider,
    linkWithCredential,
    updateProfile
} from 'firebase/auth'
import { doc, updateDoc, Timestamp, getDoc } from 'firebase/firestore'

// ============================================
// TYPES
// ============================================

export interface PhoneVerificationResult {
    success: boolean
    message: string
    error?: string
}

export interface UserVerificationStatus {
    phoneVerified: boolean
    phone?: string
    phoneVerifiedAt?: Date
    emailVerified: boolean
    idVerified: boolean
    verificationLevel: 'none' | 'basic' | 'verified' | 'premium'
}

// ============================================
// GLOBALS
// ============================================

let recaptchaVerifier: RecaptchaVerifier | null = null
let confirmationResult: ConfirmationResult | null = null

// ============================================
// PHONE VERIFICATION SERVICE
// ============================================

class PhoneVerificationService {

    /**
     * Initialize reCAPTCHA verifier
     */
    initRecaptcha(containerId: string): void {
        if (typeof window === 'undefined') return

        try {
            // Clear existing verifier if any
            if (recaptchaVerifier) {
                recaptchaVerifier.clear()
            }

            recaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
                size: 'invisible',
                callback: () => {
                    console.log('📱 reCAPTCHA verified')
                },
                'expired-callback': () => {
                    console.log('📱 reCAPTCHA expired')
                }
            })
        } catch (error) {
            console.error('Error initializing reCAPTCHA:', error)
        }
    }

    /**
     * Format Thai phone number
     */
    formatPhoneNumber(phone: string): string {
        // Remove all non-digits
        let cleaned = phone.replace(/\D/g, '')

        // If starts with 0, replace with +66
        if (cleaned.startsWith('0')) {
            cleaned = '66' + cleaned.substring(1)
        }

        // Add + if not present
        if (!cleaned.startsWith('+')) {
            cleaned = '+' + cleaned
        }

        return cleaned
    }

    /**
     * Validate Thai phone number
     */
    validatePhoneNumber(phone: string): boolean {
        const cleaned = phone.replace(/\D/g, '')

        // Thai mobile: 08x, 09x (10 digits)
        // Or with country code: 668x, 669x (11 digits)
        if (cleaned.length === 10 && (cleaned.startsWith('08') || cleaned.startsWith('09'))) {
            return true
        }
        if (cleaned.length === 11 && (cleaned.startsWith('668') || cleaned.startsWith('669'))) {
            return true
        }
        if (cleaned.length === 12 && (cleaned.startsWith('6608') || cleaned.startsWith('6609'))) {
            return true
        }

        return false
    }

    /**
     * Send OTP to phone number
     */
    async sendOTP(phoneNumber: string): Promise<PhoneVerificationResult> {
        try {
            // Validate phone number
            if (!this.validatePhoneNumber(phoneNumber)) {
                return {
                    success: false,
                    message: 'เบอร์โทรศัพท์ไม่ถูกต้อง กรุณาใส่เบอร์มือถือ 10 หลัก',
                    error: 'INVALID_PHONE'
                }
            }

            // Format phone number
            const formattedPhone = this.formatPhoneNumber(phoneNumber)

            // Check if recaptcha is initialized
            if (!recaptchaVerifier) {
                return {
                    success: false,
                    message: 'กรุณารอสักครู่แล้วลองใหม่',
                    error: 'RECAPTCHA_NOT_INITIALIZED'
                }
            }

            // Send OTP
            confirmationResult = await signInWithPhoneNumber(auth, formattedPhone, recaptchaVerifier)

            console.log('📱 OTP sent to:', formattedPhone)

            return {
                success: true,
                message: 'ส่งรหัส OTP ไปยังเบอร์ ' + this.maskPhoneNumber(phoneNumber) + ' แล้ว'
            }
        } catch (error: any) {
            console.error('Error sending OTP:', error)

            // Map Firebase errors to Thai messages
            const errorMessage = this.getErrorMessage(error.code)

            return {
                success: false,
                message: errorMessage,
                error: error.code
            }
        }
    }

    /**
     * Verify OTP code
     */
    async verifyOTP(code: string, phoneNumber: string): Promise<PhoneVerificationResult> {
        try {
            if (!confirmationResult) {
                return {
                    success: false,
                    message: 'กรุณาขอรหัส OTP ใหม่',
                    error: 'NO_CONFIRMATION_RESULT'
                }
            }

            // Validate code format (6 digits)
            if (!/^\d{6}$/.test(code)) {
                return {
                    success: false,
                    message: 'รหัส OTP ต้องเป็นตัวเลข 6 หลัก',
                    error: 'INVALID_CODE_FORMAT'
                }
            }

            // Verify the code
            const result = await confirmationResult.confirm(code)

            if (result.user) {
                // Update user's phone verification status in Firestore
                const currentUser = auth.currentUser
                if (currentUser) {
                    await this.updateVerificationStatus(currentUser.uid, phoneNumber)
                }

                console.log('📱 Phone verified successfully')

                return {
                    success: true,
                    message: 'ยืนยันเบอร์โทรศัพท์สำเร็จ!'
                }
            }

            return {
                success: false,
                message: 'ไม่สามารถยืนยันได้ กรุณาลองใหม่',
                error: 'VERIFICATION_FAILED'
            }
        } catch (error: any) {
            console.error('Error verifying OTP:', error)

            const errorMessage = this.getErrorMessage(error.code)

            return {
                success: false,
                message: errorMessage,
                error: error.code
            }
        }
    }

    /**
     * Link phone to existing account (for logged in users)
     */
    async linkPhoneToAccount(code: string, phoneNumber: string): Promise<PhoneVerificationResult> {
        try {
            const currentUser = auth.currentUser
            if (!currentUser) {
                return {
                    success: false,
                    message: 'กรุณาเข้าสู่ระบบก่อน',
                    error: 'NOT_LOGGED_IN'
                }
            }

            if (!confirmationResult) {
                return {
                    success: false,
                    message: 'กรุณาขอรหัส OTP ใหม่',
                    error: 'NO_CONFIRMATION_RESULT'
                }
            }

            // Create phone credential
            const credential = PhoneAuthProvider.credential(
                confirmationResult.verificationId,
                code
            )

            // Link to current user
            await linkWithCredential(currentUser, credential)

            // Update Firestore
            await this.updateVerificationStatus(currentUser.uid, phoneNumber)

            return {
                success: true,
                message: 'เชื่อมต่อเบอร์โทรศัพท์สำเร็จ!'
            }
        } catch (error: any) {
            console.error('Error linking phone:', error)

            // If already linked, just update the status
            if (error.code === 'auth/provider-already-linked') {
                const currentUser = auth.currentUser
                if (currentUser) {
                    await this.updateVerificationStatus(currentUser.uid, phoneNumber)
                }
                return {
                    success: true,
                    message: 'เบอร์โทรศัพท์ได้รับการยืนยันแล้ว'
                }
            }

            return {
                success: false,
                message: this.getErrorMessage(error.code),
                error: error.code
            }
        }
    }

    /**
     * Update user's verification status in Firestore
     */
    private async updateVerificationStatus(userId: string, phoneNumber: string): Promise<void> {
        try {
            const userRef = doc(db, 'users', userId)
            await updateDoc(userRef, {
                phone: this.formatPhoneNumber(phoneNumber),
                phoneVerified: true,
                phoneVerifiedAt: Timestamp.now(),
                updatedAt: Timestamp.now()
            })
        } catch (error) {
            console.error('Error updating verification status:', error)
        }
    }

    /**
     * Get user's verification status
     */
    async getVerificationStatus(userId: string): Promise<UserVerificationStatus> {
        try {
            const userRef = doc(db, 'users', userId)
            const userDoc = await getDoc(userRef)

            if (!userDoc.exists()) {
                return {
                    phoneVerified: false,
                    emailVerified: false,
                    idVerified: false,
                    verificationLevel: 'none'
                }
            }

            const data = userDoc.data()
            const phoneVerified = data.phoneVerified || false
            const emailVerified = data.emailVerified || auth.currentUser?.emailVerified || false
            const idVerified = data.idVerified || false

            // Calculate verification level
            let verificationLevel: UserVerificationStatus['verificationLevel'] = 'none'
            if (emailVerified) verificationLevel = 'basic'
            if (emailVerified && phoneVerified) verificationLevel = 'verified'
            if (emailVerified && phoneVerified && idVerified) verificationLevel = 'premium'

            return {
                phoneVerified,
                phone: data.phone,
                phoneVerifiedAt: data.phoneVerifiedAt?.toDate(),
                emailVerified,
                idVerified,
                verificationLevel
            }
        } catch (error) {
            console.error('Error getting verification status:', error)
            return {
                phoneVerified: false,
                emailVerified: false,
                idVerified: false,
                verificationLevel: 'none'
            }
        }
    }

    /**
     * Mask phone number for display
     */
    maskPhoneNumber(phone: string): string {
        const cleaned = phone.replace(/\D/g, '')
        if (cleaned.length >= 10) {
            const last4 = cleaned.slice(-4)
            return `xxx-xxx-${last4}`
        }
        return phone
    }

    /**
     * Map Firebase error codes to Thai messages
     */
    private getErrorMessage(errorCode: string): string {
        const messages: Record<string, string> = {
            'auth/invalid-phone-number': 'เบอร์โทรศัพท์ไม่ถูกต้อง',
            'auth/too-many-requests': 'ส่ง OTP มากเกินไป กรุณารอ 1 ชั่วโมงแล้วลองใหม่',
            'auth/invalid-verification-code': 'รหัส OTP ไม่ถูกต้อง',
            'auth/code-expired': 'รหัส OTP หมดอายุ กรุณาขอรหัสใหม่',
            'auth/missing-verification-code': 'กรุณาใส่รหัส OTP',
            'auth/quota-exceeded': 'ระบบโอเวอร์โหลด กรุณาลองใหม่ภายหลัง',
            'auth/captcha-check-failed': 'การยืนยัน reCAPTCHA ล้มเหลว กรุณาลองใหม่',
            'auth/network-request-failed': 'ไม่สามารถเชื่อมต่อได้ กรุณาตรวจสอบอินเทอร์เน็ต',
            'auth/provider-already-linked': 'เบอร์นี้เชื่อมต่อกับบัญชีอื่นแล้ว',
            'auth/credential-already-in-use': 'เบอร์นี้ใช้งานกับบัญชีอื่นแล้ว',
        }

        return messages[errorCode] || 'เกิดข้อผิดพลาด กรุณาลองใหม่'
    }

    /**
     * Cleanup
     */
    cleanup(): void {
        if (recaptchaVerifier) {
            recaptchaVerifier.clear()
            recaptchaVerifier = null
        }
        confirmationResult = null
    }
}

// ============================================
// EXPORT SINGLETON
// ============================================

export const phoneVerificationService = new PhoneVerificationService()
export default phoneVerificationService
