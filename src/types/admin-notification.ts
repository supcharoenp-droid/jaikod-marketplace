/**
 * Admin Notification Types
 */

export type AlertType =
    | 'user'
    | 'content'
    | 'transaction'
    | 'system'
    | 'announcement'

export type AlertSeverity = 'info' | 'warning' | 'danger' | 'success'

export interface AdminNotification {
    id: string
    type: AlertType
    title: string
    message: string
    severity: AlertSeverity
    link?: string // Deep link to relevant page (e.g. /admin/users/123)
    is_read: boolean
    created_at: Date
    metadata?: any
}

export const ALERT_TYPE_LABELS: Record<AlertType, string> = {
    user: 'User Alert',
    content: 'Content Alert',
    transaction: 'Transaction Alert',
    system: 'System Alert',
    announcement: 'Announcement'
}
