/**
 * ============================================
 * ID Verification Service
 * ============================================
 * 
 * ID Card / Document Verification for Sellers
 * - Upload ID card images
 * - Manual review process
 * - Update verification status
 * 
 * @version 1.0.0
 * @created 2025-12-30
 */

import { db, storage } from '@/lib/firebase'
import { doc, updateDoc, getDoc, setDoc, Timestamp, collection, addDoc } from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'

// ============================================
// TYPES
// ============================================

export type IDVerificationStatus =
    | 'not_submitted'
    | 'pending_review'
    | 'approved'
    | 'rejected'
    | 'expired'

export type IDType =
    | 'thai_id_card'
    | 'passport'
    | 'driver_license'

export interface IDVerificationRequest {
    id?: string
    userId: string
    idType: IDType
    frontImageUrl: string
    backImageUrl?: string
    selfieImageUrl?: string
    documentNumber?: string // Last 4 digits only for privacy
    submittedAt: Date
    status: IDVerificationStatus
    reviewedAt?: Date
    reviewedBy?: string
    rejectionReason?: string
    expiresAt?: Date
}

export interface IDVerificationResult {
    success: boolean
    message: string
    requestId?: string
    error?: string
}

export interface UserIDStatus {
    idVerified: boolean
    idVerificationStatus: IDVerificationStatus
    idType?: IDType
    verifiedAt?: Date
    expiresAt?: Date
}

// ============================================
// COLLECTIONS
// ============================================

const USERS_COLLECTION = 'users'
const VERIFICATION_REQUESTS_COLLECTION = 'id_verification_requests'

// ============================================
// ID VERIFICATION SERVICE
// ============================================

class IDVerificationService {

    /**
     * Validate ID card number (Thai ID)
     */
    validateThaiIDNumber(idNumber: string): boolean {
        const cleaned = idNumber.replace(/\D/g, '')

        // Thai ID is 13 digits
        if (cleaned.length !== 13) return false

        // Checksum validation
        let sum = 0
        for (let i = 0; i < 12; i++) {
            sum += parseInt(cleaned[i]) * (13 - i)
        }
        const checkDigit = (11 - (sum % 11)) % 10

        return checkDigit === parseInt(cleaned[12])
    }

    /**
     * Mask ID number for display
     */
    maskIDNumber(idNumber: string): string {
        const cleaned = idNumber.replace(/\D/g, '')
        if (cleaned.length >= 4) {
            return `xxxx-xxxx-${cleaned.slice(-4)}`
        }
        return 'xxxx-xxxx-xxxx'
    }

    /**
     * Upload ID document image
     */
    async uploadImage(
        userId: string,
        imageBlob: Blob,
        imageType: 'front' | 'back' | 'selfie'
    ): Promise<string | null> {
        try {
            const timestamp = Date.now()
            const fileName = `id_verification/${userId}/${imageType}_${timestamp}.jpg`
            const storageRef = ref(storage, fileName)

            // Upload image
            await uploadBytes(storageRef, imageBlob)

            // Get download URL
            const downloadUrl = await getDownloadURL(storageRef)

            console.log(`📄 Uploaded ${imageType} image for user ${userId}`)
            return downloadUrl

        } catch (error) {
            console.error('Error uploading ID image:', error)
            return null
        }
    }

    /**
     * Submit ID verification request
     */
    async submitVerification(
        userId: string,
        idType: IDType,
        frontImage: Blob,
        backImage?: Blob,
        selfieImage?: Blob,
        documentNumber?: string
    ): Promise<IDVerificationResult> {
        try {
            // Check if user exists
            const userRef = doc(db, USERS_COLLECTION, userId)
            const userDoc = await getDoc(userRef)

            if (!userDoc.exists()) {
                return {
                    success: false,
                    message: 'ไม่พบผู้ใช้',
                    error: 'USER_NOT_FOUND'
                }
            }

            // Check existing pending request
            const existingStatus = await this.getVerificationStatus(userId)
            if (existingStatus.idVerificationStatus === 'pending_review') {
                return {
                    success: false,
                    message: 'คุณมีคำขอที่รอการตรวจสอบอยู่แล้ว',
                    error: 'PENDING_REQUEST_EXISTS'
                }
            }

            // Upload images
            const frontImageUrl = await this.uploadImage(userId, frontImage, 'front')
            if (!frontImageUrl) {
                return {
                    success: false,
                    message: 'ไม่สามารถอัปโหลดรูปด้านหน้าได้',
                    error: 'UPLOAD_FAILED'
                }
            }

            let backImageUrl: string | undefined
            if (backImage) {
                backImageUrl = await this.uploadImage(userId, backImage, 'back') || undefined
            }

            let selfieImageUrl: string | undefined
            if (selfieImage) {
                selfieImageUrl = await this.uploadImage(userId, selfieImage, 'selfie') || undefined
            }

            // Create verification request
            const requestData: Omit<IDVerificationRequest, 'id'> = {
                userId,
                idType,
                frontImageUrl,
                backImageUrl,
                selfieImageUrl,
                documentNumber: documentNumber ? this.maskIDNumber(documentNumber) : undefined,
                submittedAt: new Date(),
                status: 'pending_review'
            }

            const requestRef = await addDoc(
                collection(db, VERIFICATION_REQUESTS_COLLECTION),
                {
                    ...requestData,
                    submittedAt: Timestamp.now()
                }
            )

            // Update user's verification status
            await updateDoc(userRef, {
                idVerificationStatus: 'pending_review',
                idVerificationRequestId: requestRef.id,
                updatedAt: Timestamp.now()
            })

            console.log(`📄 ID verification submitted for user ${userId}`)

            return {
                success: true,
                message: 'ส่งคำขอยืนยันตัวตนแล้ว รอการตรวจสอบภายใน 24 ชั่วโมง',
                requestId: requestRef.id
            }

        } catch (error: any) {
            console.error('Error submitting ID verification:', error)
            return {
                success: false,
                message: 'เกิดข้อผิดพลาด กรุณาลองใหม่',
                error: error.message
            }
        }
    }

    /**
     * Get user's ID verification status
     */
    async getVerificationStatus(userId: string): Promise<UserIDStatus> {
        try {
            const userRef = doc(db, USERS_COLLECTION, userId)
            const userDoc = await getDoc(userRef)

            if (!userDoc.exists()) {
                return {
                    idVerified: false,
                    idVerificationStatus: 'not_submitted'
                }
            }

            const data = userDoc.data()

            return {
                idVerified: data.idVerified || false,
                idVerificationStatus: data.idVerificationStatus || 'not_submitted',
                idType: data.idType,
                verifiedAt: data.idVerifiedAt?.toDate(),
                expiresAt: data.idExpiresAt?.toDate()
            }

        } catch (error) {
            console.error('Error getting ID verification status:', error)
            return {
                idVerified: false,
                idVerificationStatus: 'not_submitted'
            }
        }
    }

    /**
     * ADMIN: Approve verification request
     */
    async approveVerification(
        requestId: string,
        adminUserId: string
    ): Promise<IDVerificationResult> {
        try {
            const requestRef = doc(db, VERIFICATION_REQUESTS_COLLECTION, requestId)
            const requestDoc = await getDoc(requestRef)

            if (!requestDoc.exists()) {
                return {
                    success: false,
                    message: 'ไม่พบคำขอ',
                    error: 'REQUEST_NOT_FOUND'
                }
            }

            const request = requestDoc.data() as IDVerificationRequest
            const expiresAt = new Date()
            expiresAt.setFullYear(expiresAt.getFullYear() + 2) // Valid for 2 years

            // Update request
            await updateDoc(requestRef, {
                status: 'approved',
                reviewedAt: Timestamp.now(),
                reviewedBy: adminUserId,
                expiresAt: Timestamp.fromDate(expiresAt)
            })

            // Update user
            const userRef = doc(db, USERS_COLLECTION, request.userId)
            await updateDoc(userRef, {
                idVerified: true,
                idVerificationStatus: 'approved',
                idType: request.idType,
                idVerifiedAt: Timestamp.now(),
                idExpiresAt: Timestamp.fromDate(expiresAt),
                updatedAt: Timestamp.now()
            })

            console.log(`📄 ID verification approved for user ${request.userId}`)

            return {
                success: true,
                message: 'อนุมัติการยืนยันตัวตนแล้ว',
                requestId
            }

        } catch (error: any) {
            console.error('Error approving verification:', error)
            return {
                success: false,
                message: 'เกิดข้อผิดพลาด',
                error: error.message
            }
        }
    }

    /**
     * ADMIN: Reject verification request
     */
    async rejectVerification(
        requestId: string,
        adminUserId: string,
        reason: string
    ): Promise<IDVerificationResult> {
        try {
            const requestRef = doc(db, VERIFICATION_REQUESTS_COLLECTION, requestId)
            const requestDoc = await getDoc(requestRef)

            if (!requestDoc.exists()) {
                return {
                    success: false,
                    message: 'ไม่พบคำขอ',
                    error: 'REQUEST_NOT_FOUND'
                }
            }

            const request = requestDoc.data() as IDVerificationRequest

            // Update request
            await updateDoc(requestRef, {
                status: 'rejected',
                reviewedAt: Timestamp.now(),
                reviewedBy: adminUserId,
                rejectionReason: reason
            })

            // Update user
            const userRef = doc(db, USERS_COLLECTION, request.userId)
            await updateDoc(userRef, {
                idVerified: false,
                idVerificationStatus: 'rejected',
                idRejectionReason: reason,
                updatedAt: Timestamp.now()
            })

            console.log(`📄 ID verification rejected for user ${request.userId}: ${reason}`)

            return {
                success: true,
                message: 'ปฏิเสธการยืนยันตัวตนแล้ว',
                requestId
            }

        } catch (error: any) {
            console.error('Error rejecting verification:', error)
            return {
                success: false,
                message: 'เกิดข้อผิดพลาด',
                error: error.message
            }
        }
    }

    /**
     * Get ID type display name
     */
    getIDTypeName(idType: IDType, lang: 'th' | 'en' = 'th'): string {
        const names = {
            thai_id_card: {
                th: 'บัตรประชาชน',
                en: 'Thai ID Card'
            },
            passport: {
                th: 'หนังสือเดินทาง',
                en: 'Passport'
            },
            driver_license: {
                th: 'ใบขับขี่',
                en: 'Driver License'
            }
        }
        return names[idType]?.[lang] || idType
    }

    /**
     * Get status display name
     */
    getStatusName(status: IDVerificationStatus, lang: 'th' | 'en' = 'th'): string {
        const names = {
            not_submitted: {
                th: 'ยังไม่ยืนยัน',
                en: 'Not Submitted'
            },
            pending_review: {
                th: 'รอตรวจสอบ',
                en: 'Pending Review'
            },
            approved: {
                th: 'ยืนยันแล้ว',
                en: 'Approved'
            },
            rejected: {
                th: 'ไม่ผ่านการยืนยัน',
                en: 'Rejected'
            },
            expired: {
                th: 'หมดอายุ',
                en: 'Expired'
            }
        }
        return names[status]?.[lang] || status
    }
}

// ============================================
// EXPORT SINGLETON
// ============================================

export const idVerificationService = new IDVerificationService()
export default idVerificationService
