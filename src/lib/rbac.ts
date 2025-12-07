/**
 * RBAC (Role-Based Access Control) Service
 * Permission checking and role management
 */

import { AdminRole, Permission, ADMIN_ROLES, AdminUser } from '@/types/admin'

/**
 * Check if a role has a specific permission
 */
export function hasPermission(role: AdminRole, permission: Permission): boolean {
    const roleConfig = ADMIN_ROLES[role]

    // Super admin has all permissions
    if (role === 'super_admin') return true

    // Check if permission exists in role's permission list
    return roleConfig.permissions.includes(permission)
}

/**
 * Check if admin user has permission
 */
export function canPerform(admin: AdminUser | null, permission: Permission): boolean {
    if (!admin || !admin.is_active) return false
    return hasPermission(admin.role, permission)
}

/**
 * Check multiple permissions (AND logic)
 */
export function hasAllPermissions(role: AdminRole, permissions: Permission[]): boolean {
    return permissions.every(p => hasPermission(role, p))
}

/**
 * Check multiple permissions (OR logic)
 */
export function hasAnyPermission(role: AdminRole, permissions: Permission[]): boolean {
    return permissions.some(p => hasPermission(role, p))
}

/**
 * Get all permissions for a role
 */
export function getRolePermissions(role: AdminRole): Permission[] {
    if (role === 'super_admin') {
        // Return all possible permissions
        return [
            'users.view', 'users.create', 'users.edit', 'users.delete', 'users.ban', 'users.unban',
            'sellers.view', 'sellers.approve_kyc', 'sellers.suspend', 'sellers.edit', 'sellers.view_wallet',
            'products.view', 'products.edit', 'products.delete', 'products.moderate', 'products.feature',
            'orders.view', 'orders.edit', 'orders.cancel', 'orders.refund', 'orders.dispute',
            'finance.view_reports', 'finance.approve_withdrawals', 'finance.edit_commission', 'finance.export_data',
            'promotions.view', 'promotions.create', 'promotions.edit', 'promotions.delete',
            'analytics.view_dashboard', 'analytics.view_reports', 'analytics.export_data',
            'system.view_config', 'system.edit_config', 'system.manage_modules', 'system.manage_roles', 'system.view_logs',
            'content.review', 'content.approve', 'content.reject', 'content.batch_action'
        ]
    }

    return ADMIN_ROLES[role].permissions
}

/**
 * Check if role A has higher authority than role B
 */
export function hasHigherAuthority(roleA: AdminRole, roleB: AdminRole): boolean {
    return ADMIN_ROLES[roleA].level < ADMIN_ROLES[roleB].level
}

/**
 * Get role display name (Thai)
 */
export function getRoleName(role: AdminRole): string {
    return ADMIN_ROLES[role].name_th
}

/**
 * Get role color for UI
 */
export function getRoleColor(role: AdminRole): string {
    return ADMIN_ROLES[role].color
}

/**
 * Filter menu items based on permissions
 */
export interface MenuItem {
    id: string
    label: string
    icon?: string
    path?: string
    requiredPermission?: Permission
    requiredPermissions?: Permission[] // All required (AND)
    anyPermission?: Permission[] // Any required (OR)
    children?: MenuItem[]
}

export function filterMenuByPermissions(
    menu: MenuItem[],
    role: AdminRole
): MenuItem[] {
    return menu.filter(item => {
        // Check single permission
        if (item.requiredPermission && !hasPermission(role, item.requiredPermission)) {
            return false
        }

        // Check all permissions (AND)
        if (item.requiredPermissions && !hasAllPermissions(role, item.requiredPermissions)) {
            return false
        }

        // Check any permission (OR)
        if (item.anyPermission && !hasAnyPermission(role, item.anyPermission)) {
            return false
        }

        // Filter children recursively
        if (item.children) {
            item.children = filterMenuByPermissions(item.children, role)
        }

        return true
    })
}
