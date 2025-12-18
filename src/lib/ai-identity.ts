
export interface IdentityVerificationResult {
    success: boolean
    score: number
    ocrData?: {
        idNumber: string
        fullNameTh: string
        fullNameEn: string
        dateOfBirth: string
        address: string
    }
    error?: string
}

export async function verifyIdentity(idCardImage: File | null, selfieImage: File | null, isDevMode = false): Promise<IdentityVerificationResult> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 2500))

    if (isDevMode) {
        return {
            success: true,
            score: 99.9,
            ocrData: {
                idNumber: '1-2345-67890-12-3',
                fullNameTh: 'นายใจดี มีสุข',
                fullNameEn: 'Mr. Jaidee Meesuk',
                dateOfBirth: '1990-01-01',
                address: '123 Bangkok, Thailand'
            }
        }
    }

    if (!idCardImage || !selfieImage) {
        return { success: false, score: 0, error: 'Missing images' }
    }

    // Mock random success/fail for "Real" mode if we wanted, but usually for demo we default to success or check file names.
    // Let's assume always success for now unless specific fail trigger.
    return {
        success: true,
        score: 88.5, // > 80 is pass
        ocrData: {
            idNumber: '1-xxxx-xxxxx-xx-x',
            fullNameTh: 'นายตัวอย่าง ทดสอบ',
            fullNameEn: 'Mr. Sample Test',
            dateOfBirth: '1995-05-05',
            address: 'Unknown Address from OCR'
        }
    }
}
