/**
 * JaiKod Audit Log System
 * 
 * Enterprise-grade logging for tracking all system actions
 * Compliant with data protection regulations
 */

// ==========================================
// AUDIT LOG TYPES
// ==========================================

export type AuditAction =
    // User Actions
    | 'user.register'
    | 'user.login'
    | 'user.logout'
    | 'user.password_change'
    | 'user.profile_update'
    | 'user.role_change'
    | 'user.suspend'
    | 'user.unsuspend'
    | 'user.delete'
    | 'user.verify'

    // Product Actions
    | 'product.create'
    | 'product.update'
    | 'product.delete'
    | 'product.approve'
    | 'product.reject'
    | 'product.boost'
    | 'product.feature'
    | 'product.report'

    // Transaction Actions
    | 'transaction.create'
    | 'transaction.complete'
    | 'transaction.cancel'
    | 'transaction.refund'
    | 'transaction.dispute'

    // Payment Actions
    | 'payment.topup'
    | 'payment.withdraw'
    | 'payment.subscription'
    | 'payment.cancel_subscription'

    // Admin Actions
    | 'admin.setting_change'
    | 'admin.permission_change'
    | 'admin.ban_user'
    | 'admin.export_data'
    | 'admin.view_sensitive'

    // Security Actions
    | 'security.suspicious_activity'
    | 'security.fraud_detected'
    | 'security.ip_blocked'
    | 'security.rate_limit'

    // AI Actions
    | 'ai.generate'
    | 'ai.moderate'
    | 'ai.price_estimate'

export type AuditSeverity = 'info' | 'warning' | 'critical'

export interface AuditLogEntry {
    id: string
    timestamp: Date
    action: AuditAction
    severity: AuditSeverity

    // Actor (who performed the action)
    actorId: string
    actorType: 'user' | 'admin' | 'system' | 'api'
    actorEmail?: string
    actorRole?: string

    // Target (what was affected)
    targetType: 'user' | 'product' | 'order' | 'transaction' | 'system' | 'setting'
    targetId?: string
    targetName?: string

    // Details
    description: string
    metadata?: Record<string, any>

    // Context
    ipAddress?: string
    userAgent?: string
    sessionId?: string
    requestId?: string

    // Geolocation
    country?: string
    city?: string

    // Status
    success: boolean
    errorMessage?: string
}

// ==========================================
// AUDIT LOG SERVICE
// ==========================================

class AuditLogService {
    private logs: AuditLogEntry[] = []

    // Generate unique ID
    private generateId(): string {
        return `audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    }

    // Log an action
    log(entry: Omit<AuditLogEntry, 'id' | 'timestamp'>): AuditLogEntry {
        const logEntry: AuditLogEntry = {
            ...entry,
            id: this.generateId(),
            timestamp: new Date()
        }

        this.logs.unshift(logEntry)

        // Keep only last 10000 logs in memory (in production, save to database)
        if (this.logs.length > 10000) {
            this.logs = this.logs.slice(0, 10000)
        }

        // In production, also send to:
        // - Database (PostgreSQL, MongoDB)
        // - Log aggregator (ELK Stack, Splunk, Datadog)
        // - SIEM for security events

        console.log(`[AUDIT] ${entry.severity.toUpperCase()}: ${entry.action} - ${entry.description}`)

        return logEntry
    }

    // Get all logs
    getAll(): AuditLogEntry[] {
        return this.logs
    }

    // Get logs by actor
    getByActor(actorId: string): AuditLogEntry[] {
        return this.logs.filter(log => log.actorId === actorId)
    }

    // Get logs by target
    getByTarget(targetType: string, targetId: string): AuditLogEntry[] {
        return this.logs.filter(
            log => log.targetType === targetType && log.targetId === targetId
        )
    }

    // Get logs by action type
    getByAction(action: AuditAction): AuditLogEntry[] {
        return this.logs.filter(log => log.action === action)
    }

    // Get logs by severity
    getBySeverity(severity: AuditSeverity): AuditLogEntry[] {
        return this.logs.filter(log => log.severity === severity)
    }

    // Get logs in date range
    getByDateRange(startDate: Date, endDate: Date): AuditLogEntry[] {
        return this.logs.filter(
            log => log.timestamp >= startDate && log.timestamp <= endDate
        )
    }

    // Get security-related logs
    getSecurityLogs(): AuditLogEntry[] {
        return this.logs.filter(log => log.action.startsWith('security.'))
    }

    // Get admin action logs
    getAdminLogs(): AuditLogEntry[] {
        return this.logs.filter(log => log.action.startsWith('admin.'))
    }

    // Search logs
    search(query: string): AuditLogEntry[] {
        const lowerQuery = query.toLowerCase()
        return this.logs.filter(log =>
            log.description.toLowerCase().includes(lowerQuery) ||
            log.actorEmail?.toLowerCase().includes(lowerQuery) ||
            log.targetName?.toLowerCase().includes(lowerQuery) ||
            log.action.toLowerCase().includes(lowerQuery)
        )
    }

    // Export logs to JSON
    exportToJSON(logs?: AuditLogEntry[]): string {
        return JSON.stringify(logs || this.logs, null, 2)
    }

    // Get statistics
    getStats() {
        const now = new Date()
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
        const thisWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)

        return {
            total: this.logs.length,
            today: this.logs.filter(l => l.timestamp >= today).length,
            thisWeek: this.logs.filter(l => l.timestamp >= thisWeek).length,
            bySeverity: {
                info: this.logs.filter(l => l.severity === 'info').length,
                warning: this.logs.filter(l => l.severity === 'warning').length,
                critical: this.logs.filter(l => l.severity === 'critical').length
            },
            securityEvents: this.getSecurityLogs().length,
            failedActions: this.logs.filter(l => !l.success).length
        }
    }
}

// Singleton instance
export const auditLog = new AuditLogService()

// ==========================================
// HELPER FUNCTIONS
// ==========================================

// Log user login
export function logUserLogin(userId: string, email: string, ip?: string, userAgent?: string, success = true) {
    return auditLog.log({
        action: 'user.login',
        severity: success ? 'info' : 'warning',
        actorId: userId,
        actorType: 'user',
        actorEmail: email,
        targetType: 'user',
        targetId: userId,
        description: success ? `User ${email} logged in successfully` : `Failed login attempt for ${email}`,
        ipAddress: ip,
        userAgent: userAgent,
        success
    })
}

// Log role change
export function logRoleChange(
    adminId: string,
    adminEmail: string,
    targetUserId: string,
    targetEmail: string,
    oldRole: string,
    newRole: string
) {
    return auditLog.log({
        action: 'user.role_change',
        severity: 'warning',
        actorId: adminId,
        actorType: 'admin',
        actorEmail: adminEmail,
        targetType: 'user',
        targetId: targetUserId,
        targetName: targetEmail,
        description: `Role changed from ${oldRole} to ${newRole} for ${targetEmail}`,
        metadata: { oldRole, newRole },
        success: true
    })
}

// Log suspicious activity
export function logSuspiciousActivity(
    userId: string,
    email: string,
    reason: string,
    metadata?: Record<string, any>
) {
    return auditLog.log({
        action: 'security.suspicious_activity',
        severity: 'critical',
        actorId: userId,
        actorType: 'user',
        actorEmail: email,
        targetType: 'user',
        targetId: userId,
        description: `Suspicious activity detected: ${reason}`,
        metadata,
        success: true
    })
}

// Log product action
export function logProductAction(
    action: AuditAction,
    actorId: string,
    actorEmail: string,
    productId: string,
    productTitle: string,
    metadata?: Record<string, any>
) {
    return auditLog.log({
        action,
        severity: 'info',
        actorId,
        actorType: 'user',
        actorEmail,
        targetType: 'product',
        targetId: productId,
        targetName: productTitle,
        description: `Product action: ${action} on "${productTitle}"`,
        metadata,
        success: true
    })
}

// Log admin setting change
export function logSettingChange(
    adminId: string,
    adminEmail: string,
    settingName: string,
    oldValue: any,
    newValue: any
) {
    return auditLog.log({
        action: 'admin.setting_change',
        severity: 'warning',
        actorId: adminId,
        actorType: 'admin',
        actorEmail: adminEmail,
        targetType: 'setting',
        targetName: settingName,
        description: `Setting "${settingName}" changed from "${oldValue}" to "${newValue}"`,
        metadata: { oldValue, newValue },
        success: true
    })
}
