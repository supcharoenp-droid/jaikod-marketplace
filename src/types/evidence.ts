/**
 * Digital Evidence & Compliance Types
 * โครงสร้างข้อมูลสำหรับงานตรวจสอบและหลักฐานดิจิทัล
 */

import { AdminRole } from './admin'

// 1. ประเภทข้อมูลที่รองรับการ Export
export type EvidenceType =
    | 'user_profile'        // ข้อมูลส่วนตัว / KYC
    | 'chat_history'        // ประวัติการสนทนา
    | 'transaction_log'     // ประวัติการเงิน
    | 'audit_trail'         // Log ระบบ
    | 'product_snapshot'    // ข้อมูลสินค้า ณ เวลาหนึ่ง

export type EvidenceFormat = 'json' | 'csv' | 'pdf' | 'zip'

// 2. สถานะคำร้องขอข้อมูล
export type EvidenceRequestStatus =
    | 'pending_approval'    // รอ DPO/Legal อนุมัติ
    | 'processing'          // กำลังรวบรวมข้อมูล
    | 'ready'               // เสร็จสิ้น (รอ Download)
    | 'downloaded'          // ดาวน์โหลดแล้ว (เริ่มนับถอยหลังลบ)
    | 'expired'             // หมดอายุ (ไฟล์ถูกลบ)
    | 'rejected'            // ถูกปฏิเสธคำขอ

// 3. โครงสร้าง Metadata กำกับหลักฐาน (สำคัญมากทางกฎหมาย)
export interface EvidenceMetadata {
    id: string                  // Unique Request ID
    caseId?: string             // เลขที่คดี / เลขที่รับเรื่อง (Optional)
    reason: string              // เหตุผลในการขอข้อมูล (Required)

    requestor: {
        adminId: string
        role: AdminRole
        ipAddress: string
        userAgent?: string
        requestedAt: Date
    }

    target: {
        userId?: string         // ผู้ถูกตรวจสอบ (Target User)
        orderId?: string        // Order ที่เกี่ยวข้อง
        dateRange?: {
            start: Date
            end: Date
        }
    }

    content: {
        type: EvidenceType
        format: EvidenceFormat
        fileSizeBytes?: number
        checksum?: string       // SHA-256 Hash ของไฟล์ Data
        passwordProtected: boolean
    }

    security: {
        approvedBy?: string     // Admin ID ผู้อนุมัติ
        downloadCount: number
        maxDownloads: number
        expiresAt: Date
    }
}

// 4. Log การเข้าถึงหลักฐาน (Chain of Custody)
export interface ChainOfCustodyLog {
    evidenceId: string
    action: 'created' | 'viewed_metadata' | 'downloaded' | 'deleted'
    actorId: string
    timestamp: Date
    ipAddress: string
    note?: string
}
