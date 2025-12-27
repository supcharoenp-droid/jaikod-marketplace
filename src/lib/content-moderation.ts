/**
 * 🛡️ Content Moderation Service
 * 
 * ตรวจสอบเนื้อหาก่อนลงประกาศ:
 * - ตรวจคำต้องห้าม
 * - ตรวจสินค้าผิดกฎหมาย
 * - ตรวจรูปแบบการหลอกลวง
 * 
 * ใช้ gpt-4o-mini สำหรับ edge cases ที่ rule-based ตรวจไม่ได้
 */

import { getAIUtilityService, ModerationResult, ModerationViolation } from './ai-utility-service'

/**
 * ตรวจสอบเนื้อหาสำหรับการลงประกาศ
 * 
 * @param title ชื่อสินค้า
 * @param description คำอธิบาย
 * @returns ผลการตรวจสอบ
 */
export async function moderateContent(
    title: string,
    description: string
): Promise<ModerationResult> {
    const service = getAIUtilityService()

    // Combine title and description for checking
    const fullText = `${title} ${description}`

    console.log('🛡️ Moderating content:', { titleLength: title.length, descLength: description.length })

    try {
        const result = await service.moderateContent(fullText)

        // Log result
        if (result.isApproved) {
            console.log('✅ Content approved')
        } else {
            console.log('❌ Content rejected:', result.violations.length, 'violations')
        }

        return result
    } catch (error) {
        console.error('Error in content moderation:', error)

        // On error, approve by default but log warning
        console.warn('⚠️ Content moderation failed, allowing by default')
        return {
            isApproved: true,
            violations: [],
            confidence: 0.5
        }
    }
}

/**
 * ตรวจสอบเนื้อหาแบบเข้มงวด (สำหรับ admin review)
 */
export async function strictModerateContent(
    title: string,
    description: string
): Promise<{
    titleResult: ModerationResult
    descriptionResult: ModerationResult
    overallApproved: boolean
}> {
    const service = getAIUtilityService()

    const [titleResult, descriptionResult] = await Promise.all([
        service.moderateContent(title),
        service.moderateContent(description)
    ])

    return {
        titleResult,
        descriptionResult,
        overallApproved: titleResult.isApproved && descriptionResult.isApproved
    }
}

/**
 * ตรวจสอบคำต้องห้ามแบบเบื้องต้น (rule-based only, ไม่เรียก AI)
 * ใช้สำหรับ real-time validation ขณะพิมพ์
 */
export function quickModerationCheck(text: string): {
    hasIssues: boolean
    issues: string[]
} {
    const issues: string[] = []
    const lowerText = text.toLowerCase()

    // Prohibited items
    const prohibitedItems = [
        { word: 'ปืน', reason: 'อาวุธ' },
        { word: 'บุหรี่', reason: 'ยาสูบ' },
        { word: 'บุหรี่ไฟฟ้า', reason: 'ยาสูบ' },
        { word: 'vape', reason: 'ยาสูบ' },
        { word: 'ยาเสพติด', reason: 'ยาเสพติด' },
        { word: 'กัญชา', reason: 'ยาเสพติด' },
        { word: 'ของปลอม', reason: 'สินค้าละเมิดลิขสิทธิ์' },
        { word: 'replica', reason: 'สินค้าละเมิดลิขสิทธิ์' },
        { word: 'ก๊อปปี้', reason: 'สินค้าละเมิดลิขสิทธิ์' },
    ]

    for (const item of prohibitedItems) {
        if (lowerText.includes(item.word)) {
            issues.push(`พบคำต้องห้าม: "${item.word}" (${item.reason})`)
        }
    }

    // Scam patterns
    const scamPatterns = [
        { pattern: /โอนก่อน/i, reason: 'รูปแบบการหลอกลวง' },
        { pattern: /โอนเงินมา/i, reason: 'รูปแบบการหลอกลวง' },
    ]

    for (const scam of scamPatterns) {
        if (scam.pattern.test(text)) {
            issues.push(`⚠️ ${scam.reason}`)
        }
    }

    return {
        hasIssues: issues.length > 0,
        issues
    }
}

// Re-export types for convenience
export type { ModerationResult, ModerationViolation }
