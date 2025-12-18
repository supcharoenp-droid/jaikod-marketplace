/**
 * Trust & Safety Type Definitions
 * โครงสร้างข้อมูลสำหรับงานความปลอดภัยและการจัดการข้อพิพาท
 */

import { AdminUser } from './admin'

// 1. มาตรฐานรหัสความผิด (Violation Codes)
export type ViolationCategory =
    | 'CONTENT_POLICY'      // เนื้อหาไม่เหมาะสม
    | 'INTELLECTUAL_PROP'   // ละเมิดลิขสิทธิ์
    | 'FRAUD_SCAM'         // ฉ้อโกง / หลอกลวง
    | 'HARASSMENT'         // คุกคาม / กลั่นแกล้ง
    | 'ILLEGAL_ITEM'       // สินค้าผิดกฎหมาย
    | 'SPAM_BOT'           // สแปม / บอท

export interface ViolationReason {
    code: string           // e.g. "VIO-001"
    category: ViolationCategory
    description_th: string
    description_en: string
    severity: 'WARN' | 'SUSPEND' | 'BAN'
}

// 2. โครงสร้างการอุทธรณ์ (Appeal Request)
export type AppealStatus = 'OPEN' | 'UNDER_REVIEW' | 'GRANTED' | 'DENIED'

export interface AppealRequest {
    id: string
    userId: string              // ผู้ยื่นอุทธรณ์
    caseId: string              // Reference ถึง ContentFlag หรือ Ban ID ที่ถูกลงโทษ

    reason: string              // เหตุผลที่ขออุทธรณ์
    evidence_urls: string[]     // หลักฐานประกอบ (รูป/เอกสาร)

    status: AppealStatus
    created_at: Date
    updated_at: Date

    reviewerId?: string         // Admin ผู้พิจารณา
    review_note?: string
    decision_at?: Date
}

// 3. ปรับปรุง ContentFlag (Proposed Enhancement)
// (อันนี้เป็น Type เสริมเพื่อใช้คู่กับ moderation-service เดิม)
export interface EnhancedFlagData {
    evidence_urls?: string[]    // เพิ่มช่องแนบหลักฐาน
    reporter_trust_score?: number // คะแนน Trust ของคนแจ้ง (กันแกล้ง Report)
}
