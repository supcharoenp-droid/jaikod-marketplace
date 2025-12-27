/**
 * Report Service
 * 
 * จัดการการรายงานและ Moderation
 */

import {
    collection, doc, getDoc, getDocs, setDoc, updateDoc,
    query, where, orderBy, limit, Timestamp, increment
} from 'firebase/firestore'
import { db } from '../firebase'
import {
    Report, ReportStatus, ReportPriority, ReportAction,
    ReportEvidence, CreateReportRequest, CreateReportResult,
    ReportFilter, ModeratorAction, ModerationStats,
    ReportCategory, ReportTargetType,
    getCategoryConfig, REPORT_CATEGORIES
} from './types'

const REPORTS_COLLECTION = 'reports'
const ACTIONS_COLLECTION = 'moderation_actions'

// ==========================================
// REPORT ID GENERATION
// ==========================================

function generateReportId(): string {
    const timestamp = Date.now().toString(36)
    const random = Math.random().toString(36).substring(2, 6)
    return `rpt_${timestamp}_${random}`.toUpperCase()
}

// ==========================================
// CREATE REPORT
// ==========================================

export async function createReport(
    reporterId: string,
    request: CreateReportRequest
): Promise<CreateReportResult> {
    try {
        // Validate category
        const categoryConfig = getCategoryConfig(request.category)
        if (!categoryConfig) {
            return {
                success: false,
                error: { code: 'INVALID_CATEGORY', message: 'หมวดหมู่ไม่ถูกต้อง' }
            }
        }

        // Check if category is applicable to target type
        if (!categoryConfig.applicable_to.includes(request.target_type)) {
            return {
                success: false,
                error: { code: 'CATEGORY_NOT_APPLICABLE', message: 'หมวดหมู่ไม่เหมาะกับประเภทที่รายงาน' }
            }
        }

        // Check if evidence is required
        if (categoryConfig.requires_evidence && (!request.evidence || request.evidence.length === 0)) {
            return {
                success: false,
                error: { code: 'EVIDENCE_REQUIRED', message: 'กรุณาแนบหลักฐานประกอบการรายงาน' }
            }
        }

        // Check for duplicate reports from same user on same target
        const existingReport = await checkDuplicateReport(reporterId, request.target_id)
        if (existingReport) {
            return {
                success: false,
                error: { code: 'DUPLICATE_REPORT', message: 'คุณได้รายงานรายการนี้แล้ว' }
            }
        }

        // Create report
        const reportId = generateReportId()
        const now = new Date()

        const evidence: ReportEvidence[] = (request.evidence || []).map(e => ({
            ...e,
            uploaded_at: now
        }))

        const report: Report = {
            id: reportId,
            reporter_id: reporterId,
            target_type: request.target_type,
            target_id: request.target_id,
            category: request.category,
            sub_categories: request.sub_categories,
            description: request.description,
            evidence,
            status: 'pending',
            priority: categoryConfig.default_priority,
            created_at: now,
            updated_at: now
        }

        // Save to Firestore
        const reportRef = doc(db, REPORTS_COLLECTION, reportId)
        await setDoc(reportRef, {
            ...report,
            created_at: Timestamp.fromDate(now),
            updated_at: Timestamp.fromDate(now),
            evidence: evidence.map(e => ({
                ...e,
                uploaded_at: Timestamp.fromDate(e.uploaded_at)
            }))
        })

        // Check for auto-escalation
        if (categoryConfig.auto_escalate_threshold) {
            const relatedCount = await countRelatedReports(request.target_id)
            if (relatedCount >= categoryConfig.auto_escalate_threshold) {
                await escalateReport(reportId)
            }
        }

        // Update target's report count (optional: for tracking)
        await incrementReportCount(request.target_type, request.target_id)

        return {
            success: true,
            report_id: reportId,
            message: 'รายงานของคุณถูกส่งเรียบร้อยแล้ว เราจะตรวจสอบโดยเร็วที่สุด'
        }
    } catch (error) {
        console.error('Error creating report:', error)
        return {
            success: false,
            error: {
                code: 'CREATE_FAILED',
                message: error instanceof Error ? error.message : 'ไม่สามารถส่งรายงานได้'
            }
        }
    }
}

// ==========================================
// QUERY REPORTS
// ==========================================

export async function getReport(reportId: string): Promise<Report | null> {
    const reportDoc = await getDoc(doc(db, REPORTS_COLLECTION, reportId))
    if (!reportDoc.exists()) return null

    const data = reportDoc.data()
    return {
        id: reportDoc.id,
        ...data,
        created_at: data.created_at?.toDate(),
        updated_at: data.updated_at?.toDate(),
        evidence: (data.evidence || []).map((e: any) => ({
            ...e,
            uploaded_at: e.uploaded_at?.toDate()
        })),
        resolution: data.resolution ? {
            ...data.resolution,
            resolved_at: data.resolution.resolved_at?.toDate()
        } : undefined
    } as Report
}

export async function getReports(
    filter?: ReportFilter,
    pageSize: number = 20
): Promise<{ reports: Report[]; hasMore: boolean }> {
    let q = query(
        collection(db, REPORTS_COLLECTION),
        orderBy('created_at', 'desc'),
        limit(pageSize + 1)
    )

    // Note: Firestore has limitations on compound queries
    // In production, you'd use composite indexes or filter client-side

    const snapshot = await getDocs(q)
    const reports: Report[] = []

    snapshot.forEach(doc => {
        const data = doc.data()
        reports.push({
            id: doc.id,
            ...data,
            created_at: data.created_at?.toDate(),
            updated_at: data.updated_at?.toDate()
        } as Report)
    })

    const hasMore = reports.length > pageSize
    if (hasMore) reports.pop()

    return { reports, hasMore }
}

export async function getReportsForTarget(
    targetType: ReportTargetType,
    targetId: string
): Promise<Report[]> {
    const q = query(
        collection(db, REPORTS_COLLECTION),
        where('target_type', '==', targetType),
        where('target_id', '==', targetId),
        orderBy('created_at', 'desc')
    )

    const snapshot = await getDocs(q)
    return snapshot.docs.map(doc => {
        const data = doc.data()
        return {
            id: doc.id,
            ...data,
            created_at: data.created_at?.toDate(),
            updated_at: data.updated_at?.toDate()
        } as Report
    })
}

export async function getPendingReports(): Promise<Report[]> {
    const q = query(
        collection(db, REPORTS_COLLECTION),
        where('status', 'in', ['pending', 'under_review']),
        orderBy('priority', 'desc'),
        orderBy('created_at', 'asc'),
        limit(50)
    )

    const snapshot = await getDocs(q)
    return snapshot.docs.map(doc => {
        const data = doc.data()
        return {
            id: doc.id,
            ...data,
            created_at: data.created_at?.toDate(),
            updated_at: data.updated_at?.toDate()
        } as Report
    })
}

// ==========================================
// UPDATE REPORT STATUS
// ==========================================

export async function updateReportStatus(
    reportId: string,
    status: ReportStatus,
    assignedTo?: string
): Promise<{ success: boolean; error?: string }> {
    try {
        const reportRef = doc(db, REPORTS_COLLECTION, reportId)

        const updates: Record<string, any> = {
            status,
            updated_at: Timestamp.now()
        }

        if (assignedTo) {
            updates.assigned_to = assignedTo
        }

        await updateDoc(reportRef, updates)
        return { success: true }
    } catch (error) {
        return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
    }
}

export async function resolveReport(
    reportId: string,
    action: ReportAction,
    notes: string,
    resolvedBy: string
): Promise<{ success: boolean; error?: string }> {
    try {
        const reportRef = doc(db, REPORTS_COLLECTION, reportId)
        const now = Timestamp.now()

        const status: ReportStatus = action === 'no_action'
            ? 'resolved_no_action'
            : 'resolved_action_taken'

        await updateDoc(reportRef, {
            status,
            resolution: {
                action_taken: action,
                notes,
                resolved_by: resolvedBy,
                resolved_at: now
            },
            updated_at: now
        })

        // Log the action
        await logModeratorAction(reportId, action, notes, resolvedBy)

        return { success: true }
    } catch (error) {
        return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
    }
}

export async function escalateReport(reportId: string): Promise<void> {
    await updateReportStatus(reportId, 'escalated')
}

export async function dismissReport(
    reportId: string,
    reason: string,
    dismissedBy: string
): Promise<{ success: boolean }> {
    try {
        const reportRef = doc(db, REPORTS_COLLECTION, reportId)

        await updateDoc(reportRef, {
            status: 'dismissed',
            resolution: {
                action_taken: 'no_action',
                notes: reason,
                resolved_by: dismissedBy,
                resolved_at: Timestamp.now()
            },
            updated_at: Timestamp.now()
        })

        return { success: true }
    } catch (error) {
        return { success: false }
    }
}

// ==========================================
// HELPER FUNCTIONS
// ==========================================

async function checkDuplicateReport(
    reporterId: string,
    targetId: string
): Promise<boolean> {
    const q = query(
        collection(db, REPORTS_COLLECTION),
        where('reporter_id', '==', reporterId),
        where('target_id', '==', targetId),
        where('status', 'in', ['pending', 'under_review']),
        limit(1)
    )

    const snapshot = await getDocs(q)
    return !snapshot.empty
}

async function countRelatedReports(targetId: string): Promise<number> {
    const q = query(
        collection(db, REPORTS_COLLECTION),
        where('target_id', '==', targetId),
        where('status', 'in', ['pending', 'under_review', 'escalated'])
    )

    const snapshot = await getDocs(q)
    return snapshot.size
}

async function incrementReportCount(
    targetType: ReportTargetType,
    targetId: string
): Promise<void> {
    // This would update a counter on the target document
    // Implementation depends on your data structure
    try {
        const collectionMap: Record<ReportTargetType, string> = {
            listing: 'listings',
            product: 'products',
            seller: 'sellers',
            user: 'users',
            review: 'reviews',
            message: 'messages'
        }

        const targetCollection = collectionMap[targetType]
        if (!targetCollection) return

        const targetRef = doc(db, targetCollection, targetId)
        await updateDoc(targetRef, {
            report_count: increment(1)
        }).catch(() => {
            // Target might not have report_count field, ignore
        })
    } catch (error) {
        // Non-critical, ignore
    }
}

async function logModeratorAction(
    reportId: string,
    action: ReportAction,
    details: string,
    performedBy: string
): Promise<void> {
    const actionId = `act_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 6)}`

    const moderatorAction: ModeratorAction = {
        id: actionId,
        report_id: reportId,
        action,
        action_details: details,
        performed_by: performedBy,
        performed_at: new Date(),
        target_notified: false,
        reporter_notified: false,
        can_undo: ['warning_issued', 'content_removed', 'listing_suspended'].includes(action),
        undo_deadline: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
    }

    await setDoc(doc(db, ACTIONS_COLLECTION, actionId), {
        ...moderatorAction,
        performed_at: Timestamp.now(),
        undo_deadline: moderatorAction.undo_deadline
            ? Timestamp.fromDate(moderatorAction.undo_deadline)
            : null
    })
}

// ==========================================
// QUICK REPORT (Simplified)
// ==========================================

export async function quickReport(
    reporterId: string,
    targetType: ReportTargetType,
    targetId: string,
    category: ReportCategory,
    description?: string
): Promise<CreateReportResult> {
    return createReport(reporterId, {
        target_type: targetType,
        target_id: targetId,
        category,
        description: description || `รายงาน: ${getCategoryConfig(category)?.name_th || category}`
    })
}

// ==========================================
// EXPORT
// ==========================================

export const ReportService = {
    create: createReport,
    get: getReport,
    list: getReports,
    getForTarget: getReportsForTarget,
    getPending: getPendingReports,
    updateStatus: updateReportStatus,
    resolve: resolveReport,
    escalate: escalateReport,
    dismiss: dismissReport,
    quick: quickReport
}
