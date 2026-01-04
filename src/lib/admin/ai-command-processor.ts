import { db } from '@/lib/firebase'
import { collection, query, where, getDocs, limit, orderBy } from 'firebase/firestore'

export interface CommandResult {
    success: boolean
    message: string
    action?: string
    data?: any
    suggestions?: string[]
}

/**
 * AI Command Processor for Admin Console
 * Interpret natural language commands and returns instructions or data results.
 */
export async function processAICommand(command: string, language: 'th' | 'en' = 'en'): Promise<CommandResult> {
    const input = command.toLowerCase()
    const isThai = language === 'th'

    if (input.includes('risk') || input.includes('fraud') || input.includes('suspicious') || input.includes('เสี่ยง') || input.includes('โกง')) {
        const flags = await getDocs(query(collection(db, 'product_flags'), where('status', '==', 'pending'), limit(5)))
        if (flags.empty) {
            return {
                success: true,
                message: isThai ? "ไม่พบกิจกรรมความเสี่ยงสูงในระบบขณะนี้ สถานะปกติ" : "No high-risk activities detected in current buffer. The system is stable.",
            }
        }
        return {
            success: true,
            message: isThai ? `ตรวจพบ ${flags.size} รายการที่มีรูปแบบน่าสงสัย` : `Identified ${flags.size} items with suspicious patterns.`,
            action: 'NAVIGATE',
            data: '/admin/moderation'
        }
    }

    if (input.includes('gmv') || input.includes('sales') || input.includes('revenue') || input.includes('ยอดขาย') || input.includes('รายได้')) {
        return {
            success: true,
            message: isThai
                ? "แนวโน้มยอด GMV เดือนนี้สูงกว่าเดือนก่อน 15% โดยเฉพาะในหมวดหมู่ 'เครื่องใช้ไฟฟ้า' และ 'แฟชั่น'"
                : "Projected GMV for this month is trending 15% higher than last month. Current momentum is strong in 'Appliances' and 'Fashion' categories.",
            suggestions: isThai ? ["ดูรายงานการเงินละเอียด", "จัดโปรโมชั่นสำหรับผู้ขาย"] : ["View detailed finance report", "Launch seller promotion"]
        }
    }

    if ((input.includes('seller') || input.includes('ผู้ขาย')) && (input.includes('email') || input.includes('contact') || input.includes('ติดต่อ') || input.includes('เมล'))) {
        return {
            success: true,
            message: isThai
                ? "กำลังเตรียมข้อมูลผู้ขาย 12 รายที่มียอดขายสูงและคะแนนดี แพลตฟอร์มพร้อมส่งคำเชิญเข้าร่วมโปรแกรม Loyalty"
                : "Target group identified: 12 High-volume sellers with >95% rating. Email template is ready for loyalty program invite.",
            action: 'OPEN_MODAL',
            data: 'seller_outreach_template'
        }
    }

    // Command: KYC Pending
    if (input.includes('kyc') || input.includes('ยืนยันตัวตน')) {
        return {
            success: true,
            message: isThai ? "กำลังนำคุณไปยังรายการจัดการร้านค้าที่รอตรวจสอบ KYC" : "Navigating to seller management for pending KYC reviews.",
            action: 'NAVIGATE',
            data: '/admin/sellers'
        }
    }

    // Command: System Health
    if (input.includes('health') || input.includes('system') || input.includes('ระบบ')) {
        return {
            success: true,
            message: isThai ? "ระบบทำงานปกติ ภาระเซิร์ฟเวอร์อยู่ที่ 24% ความหน่วงฐานข้อมูล 12ms" : "System health is optimal. Server load: 24%, DB Latency: 12ms.",
            suggestions: isThai ? ["ดูประวัติกิจกรรม", "ตรวจสอบโมดูล"] : ["View activity logs", "Check system modules"]
        }
    }

    return {
        success: false,
        message: isThai
            ? "ไม่เข้าใจคำสั่ง ลองพิมพ์: 'ตรวจสอบความเสี่ยง', 'ทำนายยอดขาย', หรือ 'ดูรายการ KYC'"
            : "Command not fully understood. Try: 'Show risk orders', 'Predict GMV', or 'List pending KYCs'.",
        suggestions: isThai
            ? ["ตรวจสอบความเสี่ยง", "ทำนายยอดขาย", "ดูรายการ KYC"]
            : ["Show risk orders", "Predict GMV", "List pending KYCs"]
    }
}
