// Product Moderation Status Types
export type ModerationStatus =
    | 'pending'           // รอตรวจสอบ
    | 'under_review'      // กำลังตรวจสอบ
    | 'approved'          // ผ่านการตรวจสอบ
    | 'rejected'          // ไม่ผ่าน - ต้องแก้ไข
    | 'flagged'           // ถูกรายงาน

export type ModerationReason =
    | 'prohibited_item'   // สินค้าต้องห้าม
    | 'illegal_content'   // ผิดกฎหมาย
    | 'inappropriate'     // ไม่เหมาะสม
    | 'fake_product'      // สินค้าปลอม
    | 'misleading'        // ข้อมูลเข้าใจผิด
    | 'poor_quality'      // คุณภาพรูปภาพต่ำ
    | 'missing_info'      // ข้อมูลไม่ครบ
    | 'spam'              // สแปม

export interface ModerationCheck {
    check_id: string
    type: 'ai' | 'manual' | 'auto'
    status: 'pass' | 'fail' | 'warning'
    category: string
    message: string
    confidence: number // 0-1
    checked_at: Date
}

export interface ModerationResult {
    product_id: string
    status: ModerationStatus
    overall_score: number // 0-100
    checks: ModerationCheck[]
    reasons?: ModerationReason[]
    admin_notes?: string
    reviewed_by?: string
    reviewed_at?: Date
    auto_approved: boolean
    created_at: Date
    updated_at: Date
}

export interface ModerationHistory {
    id: string
    product_id: string
    status: ModerationStatus
    changed_by: 'system' | 'admin' | 'user'
    changed_by_id?: string
    reason?: string
    timestamp: Date
}

// AI Moderation Checks
export interface AICheck {
    name: string
    description: string
    weight: number // Importance weight
    run: (product: any) => Promise<ModerationCheck>
}
