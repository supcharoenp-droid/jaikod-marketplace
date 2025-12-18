/**
 * Admin Menu Configuration
 * Dynamic menu based on roles and permissions
 */

import { MenuItem } from '@/lib/rbac'
import {
    LayoutDashboard,
    Users,
    Store,
    Package,
    ShoppingCart,
    Wallet,
    Megaphone,
    BarChart3,
    Settings,
    FileText,
    Shield,
    MessageSquare,
    AlertTriangle,
    TrendingUp,
    UserCog,
    Database
} from 'lucide-react'

export const ADMIN_MENU: MenuItem[] = [
    {
        id: 'dashboard',
        label: 'admin.menu_dashboard',
        icon: 'LayoutDashboard',
        path: '/admin',
        requiredPermission: 'analytics.view_dashboard'
    },
    {
        id: 'users',
        label: 'admin.menu_users',
        icon: 'Users',
        requiredPermission: 'users.view',
        children: [
            {
                id: 'users-list',
                label: 'admin.menu_users_list',
                path: '/admin/users',
                requiredPermission: 'users.view'
            },
            {
                id: 'users-banned',
                label: 'admin.menu_users_banned',
                path: '/admin/users/banned',
                requiredPermission: 'users.view'
            }
        ]
    },
    {
        id: 'sellers',
        label: 'admin.menu_sellers',
        icon: 'Store',
        requiredPermission: 'sellers.view',
        children: [
            {
                id: 'sellers-list',
                label: 'admin.menu_sellers_list',
                path: '/admin/sellers',
                requiredPermission: 'sellers.view'
            },
            {
                id: 'sellers-pending',
                label: 'admin.menu_sellers_pending',
                path: '/admin/sellers/pending',
                requiredPermission: 'sellers.approve_kyc'
            },
            {
                id: 'sellers-wallets',
                label: 'admin.menu_sellers_wallets',
                path: '/admin/sellers/wallets',
                requiredPermission: 'sellers.view_wallet'
            }
        ]
    },
    {
        id: 'products',
        label: 'admin.menu_products',
        icon: 'Package',
        requiredPermission: 'products.view',
        children: [
            {
                id: 'products-all',
                label: 'admin.menu_products_all',
                path: '/admin/products',
                requiredPermission: 'products.view'
            },
            {
                id: 'products-pending',
                label: 'admin.menu_products_pending',
                path: '/admin/products/pending',
                requiredPermission: 'products.moderate'
            },
            {
                id: 'products-reported',
                label: 'admin.menu_products_reported',
                path: '/admin/products/reported',
                requiredPermission: 'products.moderate'
            },
            {
                id: 'products-suspended',
                label: 'admin.menu_products_suspended',
                path: '/admin/products/suspended',
                requiredPermission: 'products.view'
            }
        ]
    },
    {
        id: 'orders',
        label: 'admin.menu_orders',
        icon: 'ShoppingCart',
        requiredPermission: 'orders.view',
        children: [
            {
                id: 'orders-all',
                label: 'admin.menu_orders_all',
                path: '/admin/orders',
                requiredPermission: 'orders.view'
            },
            {
                id: 'orders-disputes',
                label: 'admin.menu_orders_disputes',
                path: '/admin/orders/disputes',
                requiredPermission: 'orders.dispute'
            },
            {
                id: 'orders-refunds',
                label: 'admin.menu_orders_refunds',
                path: '/admin/orders/refunds',
                requiredPermission: 'orders.refund'
            }
        ]
    },
    {
        id: 'finance',
        label: 'admin.menu_finance',
        icon: 'Wallet',
        requiredPermission: 'finance.view_reports',
        children: [
            {
                id: 'finance-overview',
                label: 'admin.menu_finance_overview',
                path: '/admin/finance',
                requiredPermission: 'finance.view_reports'
            },
            {
                id: 'finance-withdrawals',
                label: 'admin.menu_finance_withdrawals',
                path: '/admin/finance/withdrawals',
                requiredPermission: 'finance.approve_withdrawals'
            },
            {
                id: 'finance-commission',
                label: 'admin.menu_finance_commission',
                path: '/admin/finance/commission',
                requiredPermission: 'finance.edit_commission'
            },
            {
                id: 'finance-reports',
                label: 'admin.menu_finance_reports',
                path: '/admin/finance/reports',
                requiredPermission: 'finance.export_data'
            }
        ]
    },
    {
        id: 'promotions',
        label: 'admin.menu_promotions',
        icon: 'Megaphone',
        requiredPermission: 'promotions.view',
        children: [
            {
                id: 'promotions-system',
                label: 'admin.menu_promotions_system',
                path: '/admin/promotions',
                requiredPermission: 'promotions.view'
            },
            {
                id: 'promotions-coupons',
                label: 'admin.menu_promotions_coupons',
                path: '/admin/promotions/coupons',
                requiredPermission: 'promotions.create'
            },
            {
                id: 'promotions-boost',
                label: 'admin.menu_promotions_boost',
                path: '/admin/promotions/boost',
                requiredPermission: 'promotions.view'
            }
        ]
    },
    {
        id: 'content',
        label: 'admin.menu_content',
        icon: 'FileText',
        requiredPermission: 'content.review',
        children: [
            {
                id: 'content-queue',
                label: 'admin.menu_content_queue',
                path: '/admin/content/queue',
                requiredPermission: 'content.review'
            },
            {
                id: 'content-approved',
                label: 'admin.menu_content_approved',
                path: '/admin/content/approved',
                requiredPermission: 'content.review'
            },
            {
                id: 'content-rejected',
                label: 'admin.menu_content_rejected',
                path: '/admin/content/rejected',
                requiredPermission: 'content.review'
            }
        ]
    },
    {
        id: 'analytics',
        label: 'admin.menu_analytics',
        icon: 'BarChart3',
        requiredPermission: 'analytics.view_dashboard',
        children: [
            {
                id: 'analytics-overview',
                label: 'admin.menu_analytics_overview',
                path: '/admin/analytics',
                requiredPermission: 'analytics.view_dashboard'
            },
            {
                id: 'analytics-users',
                label: 'admin.menu_analytics_users',
                path: '/admin/analytics/users',
                requiredPermission: 'analytics.view_reports'
            },
            {
                id: 'analytics-sales',
                label: 'admin.menu_analytics_sales',
                path: '/admin/analytics/sales',
                requiredPermission: 'analytics.view_reports'
            },
            {
                id: 'analytics-products',
                label: 'admin.menu_analytics_products',
                path: '/admin/analytics/products',
                requiredPermission: 'analytics.view_reports'
            }
        ]
    },
    {
        id: 'system',
        label: 'admin.menu_system',
        icon: 'Settings',
        requiredPermission: 'system.view_config',
        children: [
            {
                id: 'system-modules',
                label: 'admin.menu_system_modules',
                path: '/admin/system/modules',
                requiredPermission: 'system.manage_modules'
            },
            {
                id: 'system-roles',
                label: 'admin.menu_system_roles',
                path: '/admin/system/roles',
                requiredPermission: 'system.manage_roles'
            },
            {
                id: 'system-admins',
                label: 'admin.menu_system_admins',
                path: '/admin/system/admins',
                requiredPermission: 'system.manage_roles'
            },
            {
                id: 'system-config',
                label: 'admin.menu_system_config',
                path: '/admin/system/config',
                requiredPermission: 'system.edit_config'
            },
            {
                id: 'system-devtools',
                label: 'admin.menu_system_devtools',
                path: '/admin/system/devtools',
                requiredPermission: 'system.view_logs'
            },
            {
                id: 'system-logs',
                label: 'admin.menu_system_logs',
                path: '/admin/system/logs',
                requiredPermission: 'system.view_logs'
            },
            {
                id: 'system-security',
                label: 'admin.menu_system_security',
                path: '/admin/system/security',
                requiredPermission: 'system.view_logs'
            }
        ]
    }
]

// Icon mapping for dynamic rendering
export const ICON_MAP: Record<string, any> = {
    LayoutDashboard,
    Users,
    Store,
    Package,
    ShoppingCart,
    Wallet,
    Megaphone,
    BarChart3,
    Settings,
    FileText,
    Shield,
    MessageSquare,
    AlertTriangle,
    TrendingUp,
    UserCog,
    Database
}
