export interface KycCheckResult {
    is_valid: boolean
    face_match_score?: number // 0-100
    liveness_score?: number
    id_card_data?: {
        name_th: string
        name_en: string
        id_number: string
        date_of_birth: string
    }
    error_reason?: string
}

// Mock eKYC Verification
export async function performEkycVerification(
    idCardImage: File,
    selfieImage: File
): Promise<KycCheckResult> {
    // 1. Simulate Upload & Processing Delays
    await new Promise(resolve => setTimeout(resolve, 3000))

    // 2. Mock Logic based on file size/name or just random for demo
    // In real world: Send to eKYC Provider (AWS Rekognition / Google Vision / Local Model)

    // Simulate Success Case (80% chance)
    const isSuccess = Math.random() > 0.2

    if (isSuccess) {
        return {
            is_valid: true,
            face_match_score: 98.5,
            liveness_score: 99.2,
            id_card_data: {
                name_th: 'นายใจกด ขายดี',
                name_en: 'Mr. Jaikod Kaidee',
                id_number: '1-2345-67890-12-3',
                date_of_birth: '1990-01-01'
            }
        }
    } else {
        // Simulate Failure
        const errorType = Math.random()
        if (errorType > 0.6) {
            return { is_valid: false, error_reason: 'Face did not match ID card photo (Score: 45%)' }
        } else if (errorType > 0.3) {
            return { is_valid: false, error_reason: 'Liveness check failed (Potential passive liveness spoofing)' }
        } else {
            return { is_valid: false, error_reason: 'ID Card image unclear or unreadable' }
        }
    }
}
