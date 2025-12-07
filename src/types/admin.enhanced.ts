/**
 * Enhanced Admin System - Complete Type Definitions
 * JaiKod Marketplace - AI-Native Platform
 * 
 * This file extends the existing admin.ts with:
 * - Enhanced Admin User Profile
 * - Performance Tracking
 * - Advanced Moderation Tools
 * - AI-Assisted Admin Features
 */

import { AdminRole, Permission } from './admin'

// ==========================================
// ENHANCED ADMIN USER
// ==========================================

export interface AdminPerformanceMetrics {
    // Case Management
    cases_handled_total: number
    cases_handled_today: number
    cases_handled_this_week: number
    cases_handled_this_month: number

    // Resolution
    avg_resolution_time_minutes: number
    median_resolution_time_minutes: number
    first_response_time_avg_minutes: number

    // Quality
    user_satisfaction_score: number // 0-5
    total_satisfaction_ratings: number
    resolution_accuracy: number // % ของเคสที่ไม่ถูก appeal

    // Actions
    warnings_issued: number
    bans_issued: number
    bans_reversed: number
    appeals_reviewed: number
    appeals_approved: number
    appeals_rejected: number

    // Content Moderation
    products_reviewed: number
    products_approved: number
    products_rejected: number
    reviews_moderated: number

    // Financial
    withdrawals_approved: number
    withdrawals_rejected: number
    refunds_processed: number
    disputes_resolved: number

    // Efficiency
    productivity_score: number // 0-100 (AI-calculated)
    quality_score: number // 0-100

    last_calculated: Date
}

export interface AdminWorkSchedule {
    // Shift
    shift_type: 'morning' | 'afternoon' | 'night' | 'flexible' | 'on_call'

    // Hours
    working_hours: {
        monday: { start: string, end: string, is_working: boolean }
        tuesday: { start: string, end: string, is_working: boolean }
        wednesday: { start: string, end: string, is_working: boolean }
        thursday: { start: string, end: string, is_working: boolean }
        friday: { start: string, end: string, is_working: boolean }
        saturday: { start: string, end: string, is_working: boolean }
        sunday: { start: string, end: string, is_working: boolean }
    }

    // Timezone
    timezone: string // "Asia/Bangkok"

    // Breaks
    break_duration_minutes: number
    lunch_break?: { start: string, end: string }

    // Availability
    is_available_now: boolean
    next_available_at?: Date

    // Overtime
    overtime_hours_this_week: number
    overtime_hours_this_month: number
}

export interface AdminSpecialization {
    // Areas of Expertise
    specializations: (
        | 'user_support'
        | 'seller_verification'
        | 'fraud_detection'
        | 'content_moderation'
        | 'financial_operations'
        | 'technical_support'
        | 'dispute_resolution'
        | 'data_analysis'
    )[]

    // Skills
    skills: {
        name: string
        level: 'beginner' | 'intermediate' | 'advanced' | 'expert'
        certified: boolean
    }[]

    // Languages
    languages: {
        code: string // "th", "en"
        name: string
        proficiency: 'basic' | 'intermediate' | 'fluent' | 'native'
    }[]

    // Certifications
    certifications: {
        name: string
        issuer: string
        issued_date: Date
        expires_date?: Date
        certificate_url?: string
    }[]
}

export interface AdminTraining {
    // Completed Courses
    courses_completed: {
        course_id: string
        course_name: string
        category: string
        completed_at: Date
        score?: number
        certificate_url?: string
    }[]

    // In Progress
    courses_in_progress: {
        course_id: string
        course_name: string
        progress_percentage: number
        started_at: Date
        estimated_completion?: Date
    }[]

    // Required Training
    required_training_completed: boolean
    required_training_due_date?: Date

    // Stats
    total_training_hours: number
    last_training_date?: Date
}

export interface AdminSecurity {
    // Two-Factor Authentication
    two_factor_enabled: boolean
    two_factor_method?: 'sms' | 'email' | 'authenticator'
    backup_codes?: string[] // Encrypted
    last_2fa_setup?: Date

    // Session Management
    active_sessions: AdminSession[]
    max_concurrent_sessions: number

    // Login Security
    require_verification_new_device: boolean
    require_verification_new_ip: boolean
    auto_logout_minutes: number

    // Access Control
    ip_whitelist?: string[]
    ip_blacklist?: string[]
    allowed_countries?: string[]

    // Audit
    failed_login_attempts: number
    last_failed_login?: Date
    account_locked: boolean
    locked_until?: Date
    locked_reason?: string

    // Password
    password_last_changed: Date
    password_expires_at?: Date
    require_password_change: boolean
}

export interface AdminSession {
    session_id: string
    device: string
    device_type: 'desktop' | 'mobile' | 'tablet'
    browser: string
    os: string

    // Location
    ip_address: string
    country?: string
    city?: string

    // Activity
    started_at: Date
    last_activity: Date
    is_current: boolean

    // Security
    is_trusted: boolean
    risk_score?: number // 0-100
}

export interface EnhancedAdminUser {
    // Basic Info (from existing AdminUser)
    id: string
    email: string
    displayName: string
    role: AdminRole
    permissions: Permission[]

    // Profile
    full_name?: string
    phone_number?: string
    avatar_url?: string

    // Department & Team
    department?: string
    team?: string
    manager_id?: string
    reports_to?: string

    // Performance
    performance_metrics: AdminPerformanceMetrics

    // Schedule
    work_schedule: AdminWorkSchedule

    // Expertise
    specialization: AdminSpecialization

    // Training
    training: AdminTraining

    // Security
    security: AdminSecurity

    // Status
    is_active: boolean
    employment_status: 'active' | 'on_leave' | 'suspended' | 'terminated'
    employment_start_date: Date
    employment_end_date?: Date

    // Activity
    last_login?: Date
    last_action?: Date
    total_login_count: number

    // Metadata
    created_at: Date
    created_by?: string
    updated_at: Date
    notes?: string
}

// ==========================================
// ADVANCED MODERATION TOOLS
// ==========================================

export interface ModerationQueue {
    id: string
    type: 'product' | 'review' | 'user' | 'seller' | 'report'

    // Item Details
    item_id: string
    item_type: string
    item_data: any // The actual item being moderated

    // Priority
    priority: 'critical' | 'high' | 'medium' | 'low'
    priority_score: number // 0-100 (AI-calculated)

    // Reason
    flagged_reason: string[]
    flagged_by: 'ai' | 'user_report' | 'admin' | 'system'
    reporter_id?: string

    // AI Analysis
    ai_recommendation?: 'approve' | 'reject' | 'flag_for_review'
    ai_confidence: number // 0-100
    ai_risk_factors: string[]

    // Assignment
    assigned_to?: string // Admin ID
    assigned_at?: Date

    // Status
    status: 'pending' | 'in_review' | 'approved' | 'rejected' | 'escalated'

    // Resolution
    resolved_by?: string
    resolved_at?: Date
    resolution_action?: string
    resolution_notes?: string

    // Timing
    created_at: Date
    due_date?: Date
    time_in_queue_minutes?: number
}

export interface BulkModerationAction {
    id: string
    admin_id: string

    // Action
    action: 'approve' | 'reject' | 'ban' | 'delete' | 'feature'
    target_type: 'product' | 'review' | 'user' | 'seller'

    // Targets
    target_ids: string[]
    total_targets: number

    // Filters Used
    filters_applied?: Record<string, any>

    // Progress
    processed_count: number
    success_count: number
    failed_count: number

    // Status
    status: 'pending' | 'processing' | 'completed' | 'failed'

    // Results
    results: {
        target_id: string
        success: boolean
        error?: string
    }[]

    // Metadata
    reason?: string
    notes?: string
    created_at: Date
    completed_at?: Date
}

export interface AutoModerationRule {
    id: string
    name: string
    description: string

    // Conditions
    conditions: {
        field: string
        operator: 'equals' | 'contains' | 'greater_than' | 'less_than' | 'in_range'
        value: any
    }[]

    // Action
    action: 'auto_approve' | 'auto_reject' | 'flag_for_review' | 'assign_to_admin'
    action_params?: Record<string, any>

    // Scope
    applies_to: 'product' | 'review' | 'user' | 'seller' | 'all'

    // Priority
    priority: number // Higher = runs first

    // Status
    is_active: boolean

    // Stats
    times_triggered: number
    success_rate: number

    // Metadata
    created_by: string
    created_at: Date
    last_triggered?: Date
}

// ==========================================
// AI-ASSISTED ADMIN FEATURES
// ==========================================

export interface AIAdminAssistant {
    // Suggestions
    suggested_actions: {
        type: string
        description: string
        confidence: number
        impact: 'high' | 'medium' | 'low'
        action_data: any
    }[]

    // Anomaly Detection
    anomalies_detected: {
        type: 'fraud' | 'abuse' | 'unusual_activity' | 'performance_issue'
        severity: 'critical' | 'high' | 'medium' | 'low'
        description: string
        affected_entities: string[]
        recommended_action: string
        detected_at: Date
    }[]

    // Insights
    insights: {
        category: 'user_behavior' | 'sales_trend' | 'fraud_pattern' | 'performance'
        title: string
        description: string
        data_points: any[]
        actionable: boolean
        suggested_response?: string
    }[]

    // Predictions
    predictions: {
        type: 'churn_risk' | 'fraud_likelihood' | 'sales_forecast' | 'support_volume'
        target_id?: string
        prediction_value: number
        confidence: number
        time_horizon: string
        factors: string[]
    }[]
}

export interface SmartAlert {
    id: string

    // Alert Details
    type: 'fraud' | 'abuse' | 'performance' | 'system' | 'security'
    severity: 'critical' | 'high' | 'medium' | 'low'

    title: string
    message: string

    // Context
    related_entity_type?: 'user' | 'seller' | 'product' | 'order'
    related_entity_id?: string

    // AI Analysis
    ai_generated: boolean
    confidence_score: number
    risk_score: number

    // Recommended Action
    recommended_action?: string
    action_url?: string

    // Assignment
    assigned_to?: string[]
    requires_immediate_attention: boolean

    // Status
    status: 'new' | 'acknowledged' | 'investigating' | 'resolved' | 'dismissed'
    acknowledged_by?: string
    acknowledged_at?: Date
    resolved_by?: string
    resolved_at?: Date

    // Metadata
    created_at: Date
    expires_at?: Date
}

// ==========================================
// ADMIN DASHBOARD WIDGETS
// ==========================================

export interface AdminDashboardWidget {
    id: string
    type: 'stat' | 'chart' | 'table' | 'alert' | 'activity'

    // Display
    title: string
    size: 'small' | 'medium' | 'large' | 'full'
    position: { x: number, y: number }

    // Data
    data_source: string
    refresh_interval_seconds?: number

    // Permissions
    required_permissions: Permission[]

    // Customization
    is_customizable: boolean
    user_settings?: Record<string, any>

    // Status
    is_visible: boolean
    is_enabled: boolean
}

// ==========================================
// ADMIN REPORTS
// ==========================================

export interface AdminReport {
    id: string

    // Report Details
    name: string
    description: string
    category: 'financial' | 'operational' | 'user' | 'seller' | 'product' | 'custom'

    // Parameters
    report_type: 'summary' | 'detailed' | 'comparison' | 'trend'
    date_range: {
        start: Date
        end: Date
    }
    filters?: Record<string, any>

    // Data
    data: any
    metrics: {
        name: string
        value: number | string
        change?: number
        trend?: 'up' | 'down' | 'stable'
    }[]

    // Visualization
    charts?: {
        type: 'line' | 'bar' | 'pie' | 'area'
        data: any
    }[]

    // Export
    export_formats: ('pdf' | 'excel' | 'csv')[]

    // Schedule
    is_scheduled: boolean
    schedule_frequency?: 'daily' | 'weekly' | 'monthly'
    recipients?: string[]

    // Metadata
    generated_by: string
    generated_at: Date
    last_run?: Date
}

// ==========================================
// ADMIN NOTIFICATIONS
// ==========================================

export interface AdminNotification {
    id: string
    admin_id: string

    // Type
    type: 'alert' | 'task' | 'approval' | 'info' | 'warning'
    category: string

    // Content
    title: string
    message: string
    icon?: string

    // Action
    action_required: boolean
    action_url?: string
    action_label?: string

    // Priority
    priority: 'urgent' | 'high' | 'normal' | 'low'

    // Related
    related_entity_type?: string
    related_entity_id?: string

    // Status
    is_read: boolean
    read_at?: Date
    is_dismissed: boolean

    // Expiry
    expires_at?: Date

    created_at: Date
}

// ==========================================
// ADMIN ACTIVITY TRACKING
// ==========================================

export interface DetailedAdminActivity {
    id: string
    admin_id: string
    admin_name: string
    admin_role: AdminRole

    // Action
    action: string
    action_category: 'create' | 'read' | 'update' | 'delete' | 'approve' | 'reject'

    // Target
    target_type: 'user' | 'seller' | 'product' | 'order' | 'review' | 'system' | 'config'
    target_id?: string
    target_name?: string

    // Changes
    changes?: {
        field: string
        old_value: any
        new_value: any
    }[]

    // Context
    reason?: string
    notes?: string

    // Technical
    ip_address?: string
    user_agent?: string
    session_id?: string

    // Impact
    impact_level: 'critical' | 'high' | 'medium' | 'low'
    affected_users_count?: number

    // Status
    status: 'success' | 'failed' | 'partial'
    error_message?: string

    timestamp: Date
}
