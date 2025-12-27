/**
 * Report & Moderation System - Types
 * 
 * ระบบแจ้งปัญหา/รายงานสินค้าและผู้ขาย
 */

// ==========================================
// REPORT TYPES
// ==========================================

/**
 * What can be reported
 */
export type ReportTargetType =
    | 'listing'      // รายงานประกาศขาย
    | 'product'      // รายงานสินค้า
    | 'seller'       // รายงานผู้ขาย
    | 'user'         // รายงานผู้ใช้
    | 'review'       // รายงานรีวิว
    | 'message'      // รายงานข้อความ

/**
 * Report categories
 */
export type ReportCategory =
    // Product/Listing related
    | 'prohibited_item'          // สินค้าต้องห้าม
    | 'counterfeit'              // สินค้าปลอม/ละเมิดลิขสิทธิ์
    | 'misleading_info'          // ข้อมูลเท็จ/หลอกลวง
    | 'wrong_category'           // หมวดหมู่ผิด
    | 'duplicate_listing'        // ลงซ้ำ
    | 'inappropriate_content'    // เนื้อหาไม่เหมาะสม
    | 'price_gouging'            // ขายราคาแพงเกินจริง

    // Seller/User related
    | 'scam'                     // โกง/ฉ้อโกง
    | 'harassment'               // คุกคาม/กลั่นแกล้ง
    | 'spam'                     // สแปม
    | 'fake_account'             // บัญชีปลอม
    | 'impersonation'            // แอบอ้าง
    | 'non_delivery'             // ไม่ส่งสินค้า
    | 'poor_quality'             // คุณภาพสินค้าต่ำ

    // Review related
    | 'fake_review'              // รีวิวปลอม
    | 'irrelevant_review'        // รีวิวไม่เกี่ยวข้อง

    // Other
    | 'other'                    // อื่นๆ

/**
 * Report status
 */
export type ReportStatus =
    | 'pending'                  // รอตรวจสอบ
    | 'under_review'             // กำลังตรวจสอบ
    | 'resolved_action_taken'    // แก้ไขแล้ว (ดำเนินการ)
    | 'resolved_no_action'       // แก้ไขแล้ว (ไม่ดำเนินการ)
    | 'dismissed'                // ปฏิเสธ
    | 'escalated'                // ส่งต่อผู้เชี่ยวชาญ

/**
 * Report priority
 */
export type ReportPriority = 'low' | 'medium' | 'high' | 'critical'

// ==========================================
// REPORT CATEGORY CONFIG
// ==========================================

export interface ReportCategoryConfig {
    id: ReportCategory
    name: string
    name_th: string
    description_th: string
    icon: string
    applicable_to: ReportTargetType[]
    default_priority: ReportPriority
    requires_evidence: boolean
    auto_escalate_threshold?: number // auto escalate after N reports
}

export const REPORT_CATEGORIES: ReportCategoryConfig[] = [
    // Product/Listing
    {
        id: 'prohibited_item',
        name: 'Prohibited Item',
        name_th: 'สินค้าต้องห้าม',
        description_th: 'ยาเสพติด อาวุธ สัตว์ป่า หรือสินค้าผิดกฎหมาย',
        icon: '🚫',
        applicable_to: ['listing', 'product'],
        default_priority: 'critical',
        requires_evidence: true,
        auto_escalate_threshold: 1
    },
    {
        id: 'counterfeit',
        name: 'Counterfeit/IP Violation',
        name_th: 'สินค้าปลอม/ละเมิดลิขสิทธิ์',
        description_th: 'สินค้าก๊อปปี้ ละเมิดเครื่องหมายการค้า หรือลิขสิทธิ์',
        icon: '©️',
        applicable_to: ['listing', 'product', 'seller'],
        default_priority: 'high',
        requires_evidence: true,
        auto_escalate_threshold: 3
    },
    {
        id: 'misleading_info',
        name: 'Misleading Information',
        name_th: 'ข้อมูลเท็จ/หลอกลวง',
        description_th: 'ชื่อสินค้า คำอธิบาย หรือรูปภาพไม่ตรงกับสินค้าจริง',
        icon: '⚠️',
        applicable_to: ['listing', 'product'],
        default_priority: 'medium',
        requires_evidence: true,
        auto_escalate_threshold: 5
    },
    {
        id: 'wrong_category',
        name: 'Wrong Category',
        name_th: 'หมวดหมู่ผิด',
        description_th: 'สินค้าอยู่ในหมวดหมู่ที่ไม่ถูกต้อง',
        icon: '📂',
        applicable_to: ['listing', 'product'],
        default_priority: 'low',
        requires_evidence: false
    },
    {
        id: 'duplicate_listing',
        name: 'Duplicate Listing',
        name_th: 'ลงซ้ำ',
        description_th: 'ผู้ขายลงสินค้าเดียวกันหลายครั้ง',
        icon: '📋',
        applicable_to: ['listing'],
        default_priority: 'low',
        requires_evidence: false
    },
    {
        id: 'inappropriate_content',
        name: 'Inappropriate Content',
        name_th: 'เนื้อหาไม่เหมาะสม',
        description_th: 'รูปภาพหรือข้อความไม่เหมาะสม ลามก หยาบคาย',
        icon: '🔞',
        applicable_to: ['listing', 'product', 'review', 'message'],
        default_priority: 'high',
        requires_evidence: true,
        auto_escalate_threshold: 2
    },
    {
        id: 'price_gouging',
        name: 'Price Gouging',
        name_th: 'ขายราคาแพงเกินจริง',
        description_th: 'ตั้งราคาสูงผิดปกติ หรือใช้โอกาสฉวยโอกาส',
        icon: '💸',
        applicable_to: ['listing', 'product'],
        default_priority: 'medium',
        requires_evidence: false
    },

    // Seller/User
    {
        id: 'scam',
        name: 'Scam/Fraud',
        name_th: 'โกง/ฉ้อโกง',
        description_th: 'พฤติกรรมฉ้อโกง หลอกลวง หรือไม่ซื่อสัตย์',
        icon: '🎭',
        applicable_to: ['seller', 'user'],
        default_priority: 'critical',
        requires_evidence: true,
        auto_escalate_threshold: 1
    },
    {
        id: 'harassment',
        name: 'Harassment',
        name_th: 'คุกคาม/กลั่นแกล้ง',
        description_th: 'ข่มขู่ คุกคาม หรือมีพฤติกรรมไม่เหมาะสม',
        icon: '😠',
        applicable_to: ['seller', 'user', 'message'],
        default_priority: 'high',
        requires_evidence: true,
        auto_escalate_threshold: 2
    },
    {
        id: 'spam',
        name: 'Spam',
        name_th: 'สแปม',
        description_th: 'ส่งข้อความสแปม โฆษณา หรือลิงก์ไม่พึงประสงค์',
        icon: '📨',
        applicable_to: ['seller', 'user', 'message', 'review'],
        default_priority: 'medium',
        requires_evidence: false
    },
    {
        id: 'fake_account',
        name: 'Fake Account',
        name_th: 'บัญชีปลอม',
        description_th: 'บัญชีที่สร้างขึ้นเพื่อหลอกลวงหรือทำผิดกฎ',
        icon: '👻',
        applicable_to: ['seller', 'user'],
        default_priority: 'high',
        requires_evidence: true
    },
    {
        id: 'impersonation',
        name: 'Impersonation',
        name_th: 'แอบอ้าง',
        description_th: 'แอบอ้างเป็นบุคคลอื่น แบรนด์ หรือองค์กร',
        icon: '🎭',
        applicable_to: ['seller', 'user'],
        default_priority: 'high',
        requires_evidence: true
    },
    {
        id: 'non_delivery',
        name: 'Non-Delivery',
        name_th: 'ไม่ส่งสินค้า',
        description_th: 'รับเงินแล้วแต่ไม่ส่งสินค้า หรือส่งช้าเกินไป',
        icon: '📦',
        applicable_to: ['seller'],
        default_priority: 'high',
        requires_evidence: true
    },
    {
        id: 'poor_quality',
        name: 'Poor Quality',
        name_th: 'คุณภาพสินค้าต่ำ',
        description_th: 'สินค้าคุณภาพต่ำกว่าที่โฆษณาไว้มาก',
        icon: '👎',
        applicable_to: ['seller', 'product'],
        default_priority: 'medium',
        requires_evidence: true
    },

    // Review
    {
        id: 'fake_review',
        name: 'Fake Review',
        name_th: 'รีวิวปลอม',
        description_th: 'รีวิวที่ไม่ได้มาจากการซื้อจริง หรือถูกจ้างให้เขียน',
        icon: '⭐',
        applicable_to: ['review'],
        default_priority: 'medium',
        requires_evidence: false
    },
    {
        id: 'irrelevant_review',
        name: 'Irrelevant Review',
        name_th: 'รีวิวไม่เกี่ยวข้อง',
        description_th: 'รีวิวที่ไม่เกี่ยวกับสินค้าหรือประสบการณ์การซื้อ',
        icon: '❔',
        applicable_to: ['review'],
        default_priority: 'low',
        requires_evidence: false
    },

    // Other
    {
        id: 'other',
        name: 'Other',
        name_th: 'อื่นๆ',
        description_th: 'ปัญหาอื่นๆ ที่ไม่อยู่ในหมวดหมู่ข้างต้น',
        icon: '❓',
        applicable_to: ['listing', 'product', 'seller', 'user', 'review', 'message'],
        default_priority: 'low',
        requires_evidence: false
    }
]

// ==========================================
// REPORT INTERFACE
// ==========================================

export interface ReportEvidence {
    type: 'image' | 'screenshot' | 'document' | 'link' | 'order_id'
    url?: string
    description?: string
    uploaded_at: Date
}

export interface Report {
    id: string

    // Who reported
    reporter_id: string
    reporter_email?: string  // For anonymous reports

    // What was reported
    target_type: ReportTargetType
    target_id: string
    target_title?: string    // Cached title for quick reference
    target_seller_id?: string

    // Report details
    category: ReportCategory
    sub_categories?: ReportCategory[]
    description: string
    evidence: ReportEvidence[]

    // Status & Processing
    status: ReportStatus
    priority: ReportPriority
    assigned_to?: string     // Moderator ID

    // Resolution
    resolution?: {
        action_taken: ReportAction
        notes: string
        resolved_by: string
        resolved_at: Date
    }

    // Metadata
    created_at: Date
    updated_at: Date

    // Related reports (same target)
    related_report_count?: number
}

// ==========================================
// MODERATION ACTIONS
// ==========================================

export type ReportAction =
    | 'no_action'               // ไม่ดำเนินการ
    | 'warning_issued'          // ส่งคำเตือน
    | 'content_removed'         // ลบเนื้อหา
    | 'listing_suspended'       // ระงับประกาศ
    | 'listing_deleted'         // ลบประกาศ
    | 'seller_warning'          // เตือนผู้ขาย
    | 'seller_suspended'        // ระงับผู้ขาย (ชั่วคราว)
    | 'seller_banned'           // แบนผู้ขาย (ถาวร)
    | 'user_warning'            // เตือนผู้ใช้
    | 'user_suspended'          // ระงับผู้ใช้ (ชั่วคราว)
    | 'user_banned'             // แบนผู้ใช้ (ถาวร)
    | 'review_removed'          // ลบรีวิว
    | 'refund_processed'        // คืนเงิน
    | 'escalated_to_legal'      // ส่งต่อฝ่ายกฎหมาย

export interface ModeratorAction {
    id: string
    report_id: string
    action: ReportAction
    action_details: string
    performed_by: string
    performed_at: Date

    // Effect tracking
    target_notified: boolean
    reporter_notified: boolean

    // Undo capability
    can_undo: boolean
    undo_deadline?: Date
    undone?: boolean
    undo_reason?: string
}

// ==========================================
// REPORT REQUEST/RESPONSE
// ==========================================

export interface CreateReportRequest {
    target_type: ReportTargetType
    target_id: string
    category: ReportCategory
    sub_categories?: ReportCategory[]
    description: string
    evidence?: Omit<ReportEvidence, 'uploaded_at'>[]
}

export interface CreateReportResult {
    success: boolean
    report_id?: string
    message?: string
    error?: {
        code: string
        message: string
    }
}

export interface ReportFilter {
    status?: ReportStatus[]
    priority?: ReportPriority[]
    category?: ReportCategory[]
    target_type?: ReportTargetType[]
    assigned_to?: string
    date_from?: Date
    date_to?: Date
    search?: string
}

// ==========================================
// MODERATION STATS
// ==========================================

export interface ModerationStats {
    period: 'day' | 'week' | 'month'

    total_reports: number
    pending_reports: number
    resolved_reports: number
    avg_resolution_time_hours: number

    by_category: {
        category: ReportCategory
        count: number
        percentage: number
    }[]

    by_priority: {
        priority: ReportPriority
        count: number
    }[]

    by_action: {
        action: ReportAction
        count: number
    }[]

    top_reported_sellers: {
        seller_id: string
        seller_name: string
        report_count: number
    }[]
}

// ==========================================
// UTILITY FUNCTIONS
// ==========================================

export function getCategoriesForTarget(targetType: ReportTargetType): ReportCategoryConfig[] {
    return REPORT_CATEGORIES.filter(cat => cat.applicable_to.includes(targetType))
}

export function getCategoryConfig(category: ReportCategory): ReportCategoryConfig | undefined {
    return REPORT_CATEGORIES.find(cat => cat.id === category)
}

export function getStatusDisplay(status: ReportStatus): { label_th: string; color: string } {
    const statusMap: Record<ReportStatus, { label_th: string; color: string }> = {
        'pending': { label_th: 'รอตรวจสอบ', color: '#F59E0B' },
        'under_review': { label_th: 'กำลังตรวจสอบ', color: '#3B82F6' },
        'resolved_action_taken': { label_th: 'ดำเนินการแล้ว', color: '#10B981' },
        'resolved_no_action': { label_th: 'ไม่พบปัญหา', color: '#6B7280' },
        'dismissed': { label_th: 'ปฏิเสธ', color: '#EF4444' },
        'escalated': { label_th: 'ส่งต่อผู้เชี่ยวชาญ', color: '#8B5CF6' }
    }
    return statusMap[status]
}

export function getPriorityDisplay(priority: ReportPriority): { label_th: string; color: string; icon: string } {
    const priorityMap: Record<ReportPriority, { label_th: string; color: string; icon: string }> = {
        'low': { label_th: 'ต่ำ', color: '#6B7280', icon: '🔵' },
        'medium': { label_th: 'ปานกลาง', color: '#F59E0B', icon: '🟡' },
        'high': { label_th: 'สูง', color: '#F97316', icon: '🟠' },
        'critical': { label_th: 'วิกฤต', color: '#EF4444', icon: '🔴' }
    }
    return priorityMap[priority]
}

export function getActionDisplay(action: ReportAction): { label_th: string; severity: 'info' | 'warning' | 'danger' } {
    const actionMap: Record<ReportAction, { label_th: string; severity: 'info' | 'warning' | 'danger' }> = {
        'no_action': { label_th: 'ไม่ดำเนินการ', severity: 'info' },
        'warning_issued': { label_th: 'ส่งคำเตือน', severity: 'warning' },
        'content_removed': { label_th: 'ลบเนื้อหา', severity: 'warning' },
        'listing_suspended': { label_th: 'ระงับประกาศ', severity: 'warning' },
        'listing_deleted': { label_th: 'ลบประกาศ', severity: 'danger' },
        'seller_warning': { label_th: 'เตือนผู้ขาย', severity: 'warning' },
        'seller_suspended': { label_th: 'ระงับผู้ขาย', severity: 'danger' },
        'seller_banned': { label_th: 'แบนผู้ขาย', severity: 'danger' },
        'user_warning': { label_th: 'เตือนผู้ใช้', severity: 'warning' },
        'user_suspended': { label_th: 'ระงับผู้ใช้', severity: 'danger' },
        'user_banned': { label_th: 'แบนผู้ใช้', severity: 'danger' },
        'review_removed': { label_th: 'ลบรีวิว', severity: 'warning' },
        'refund_processed': { label_th: 'คืนเงินแล้ว', severity: 'info' },
        'escalated_to_legal': { label_th: 'ส่งฝ่ายกฎหมาย', severity: 'danger' }
    }
    return actionMap[action]
}
