/**
 * Admin System - Type Definitions
 * Complete RBAC (Role-Based Access Control) System
 */

// ==========================================
// ADMIN ROLES
// ==========================================

export type AdminRole =
    | 'super_admin'           // ผู้บริหารสูงสุด
    | 'admin_manager'         // ผู้บริหารระบบ
    | 'operations_admin'      // ดูแลกิจกรรมประจำวัน
    | 'finance_admin'         // บัญชี
    | 'content_moderator'     // ตรวจคอนเทนต์
    | 'data_analyst'          // วิเคราะห์ข้อมูล
    | 'customer_support'      // บริการลูกค้า

// ==========================================
// PERMISSIONS (Granular)
// ==========================================

export type Permission =
    // User Management
    | 'users.view'
    | 'users.create'
    | 'users.edit'
    | 'users.delete'
    | 'users.ban'
    | 'users.unban'

    // Seller Management
    | 'sellers.view'
    | 'sellers.approve_kyc'
    | 'sellers.suspend'
    | 'sellers.edit'
    | 'sellers.view_wallet'

    // Product Management
    | 'products.view'
    | 'products.edit'
    | 'products.delete'
    | 'products.moderate'
    | 'products.feature'

    // Order Management
    | 'orders.view'
    | 'orders.edit'
    | 'orders.cancel'
    | 'orders.refund'
    | 'orders.dispute'

    // Finance
    | 'finance.view_reports'
    | 'finance.approve_withdrawals'
    | 'finance.edit_commission'
    | 'finance.export_data'

    // Promotion
    | 'promotions.view'
    | 'promotions.create'
    | 'promotions.edit'
    | 'promotions.delete'

    // Analytics
    | 'analytics.view_dashboard'
    | 'analytics.view_reports'
    | 'analytics.export_data'

    // System Configuration
    | 'system.view_config'
    | 'system.edit_config'
    | 'system.manage_modules'
    | 'system.manage_roles'
    | 'system.view_logs'

    // Content Moderation
    | 'content.review'
    | 'content.approve'
    | 'content.reject'
    | 'content.batch_action'

// ==========================================
// ROLE CONFIGURATION
// ==========================================

export interface RoleConfig {
    id: AdminRole
    name: string
    name_th: string
    description: string
    permissions: Permission[]
    level: number // 1 = highest, 7 = lowest
    color: string // For UI
}

export const ADMIN_ROLES: Record<AdminRole, RoleConfig> = {
    super_admin: {
        id: 'super_admin',
        name: 'Super Admin',
        name_th: 'ผู้บริหารสูงสุด',
        description: 'Full system access with all permissions',
        permissions: ['*'] as any, // All permissions
        level: 1,
        color: 'purple'
    },
    admin_manager: {
        id: 'admin_manager',
        name: 'Admin Manager',
        name_th: 'ผู้บริหารระบบ',
        description: 'Manage admin team and core settings',
        permissions: [
            'users.view', 'users.edit', 'users.ban', 'users.unban',
            'sellers.view', 'sellers.approve_kyc', 'sellers.suspend', 'sellers.edit',
            'products.view', 'products.edit', 'products.moderate',
            'system.view_config', 'system.edit_config', 'system.manage_roles',
            'analytics.view_dashboard', 'analytics.view_reports'
        ],
        level: 2,
        color: 'blue'
    },
    operations_admin: {
        id: 'operations_admin',
        name: 'Operations Admin',
        name_th: 'ดูแลกิจกรรมประจำวัน',
        description: 'Daily operations and monitoring',
        permissions: [
            'users.view', 'users.ban',
            'sellers.view', 'sellers.suspend',
            'products.view', 'products.moderate',
            'orders.view', 'orders.edit', 'orders.dispute',
            'content.review', 'content.approve', 'content.reject'
        ],
        level: 3,
        color: 'green'
    },
    finance_admin: {
        id: 'finance_admin',
        name: 'Finance Admin',
        name_th: 'บัญชี',
        description: 'Financial operations and reporting',
        permissions: [
            'finance.view_reports',
            'finance.approve_withdrawals',
            'finance.edit_commission',
            'finance.export_data',
            'sellers.view_wallet',
            'orders.view',
            'analytics.view_reports',
            'analytics.export_data'
        ],
        level: 4,
        color: 'amber'
    },
    content_moderator: {
        id: 'content_moderator',
        name: 'Content Moderator',
        name_th: 'ตรวจคอนเทนต์',
        description: 'Review and moderate content',
        permissions: [
            'products.view',
            'products.moderate',
            'content.review',
            'content.approve',
            'content.reject',
            'content.batch_action',
            'sellers.view'
        ],
        level: 5,
        color: 'orange'
    },
    data_analyst: {
        id: 'data_analyst',
        name: 'Data Analyst',
        name_th: 'วิเคราะห์ข้อมูล',
        description: 'Analytics and reporting',
        permissions: [
            'analytics.view_dashboard',
            'analytics.view_reports',
            'analytics.export_data',
            'users.view',
            'sellers.view',
            'products.view',
            'orders.view'
        ],
        level: 6,
        color: 'cyan'
    },
    customer_support: {
        id: 'customer_support',
        name: 'Customer Support',
        name_th: 'บริการลูกค้า',
        description: 'Customer service and support',
        permissions: [
            'users.view',
            'sellers.view',
            'products.view',
            'orders.view',
            'orders.edit'
        ],
        level: 7,
        color: 'pink'
    }
}

// ==========================================
// ADMIN USER
// ==========================================

export interface AdminUser {
    id: string
    email: string
    displayName: string
    role: AdminRole
    permissions: Permission[]
    department?: string
    avatar_url?: string
    is_active: boolean
    last_login?: Date
    created_at: Date
    created_by?: string
}

// ==========================================
// SYSTEM MODULES
// ==========================================

export type SystemModule =
    | 'marketplace'
    | 'chat'
    | 'payment'
    | 'shipping'
    | 'review'
    | 'promotion'
    | 'analytics'
    | 'notification'

export interface ModuleConfig {
    id: SystemModule
    name: string
    name_th: string
    enabled: boolean
    settings?: Record<string, any>
}

// ==========================================
// ADMIN STATISTICS
// ==========================================

export interface AdminStats {
    // Users
    total_users: number
    total_buyers: number
    total_sellers: number
    new_users_today: number

    // Products
    total_products: number
    active_products: number
    pending_review: number
    suspended_products: number

    // Orders
    total_orders: number
    orders_today: number
    pending_orders: number
    completed_orders: number

    // Finance
    gmv: number // Gross Merchandise Value
    platform_revenue: number
    pending_withdrawals: number

    // Growth
    user_growth_rate: number
    seller_growth_rate: number
    gmv_growth_rate: number
}

// ==========================================
// ACTIVITY LOG
// ==========================================

export interface AdminActivityLog {
    id: string
    admin_id: string
    admin_name: string
    action: string
    target_type: 'user' | 'seller' | 'product' | 'order' | 'system'
    target_id?: string
    details: string
    ip_address?: string
    timestamp: Date
}
