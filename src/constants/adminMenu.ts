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
        label: 'แดชบอร์ด',
        icon: 'LayoutDashboard',
        path: '/admin',
        requiredPermission: 'analytics.view_dashboard'
    },
    {
        id: 'users',
        label: 'จัดการผู้ใช้',
        icon: 'Users',
        requiredPermission: 'users.view',
        children: [
            {
                id: 'users-list',
                label: 'รายชื่อผู้ใช้',
                path: '/admin/users',
                requiredPermission: 'users.view'
            },
            {
                id: 'users-banned',
                label: 'ผู้ใช้ถูกระงับ',
                path: '/admin/users/banned',
                requiredPermission: 'users.view'
            }
        ]
    },
    {
        id: 'sellers',
        label: 'จัดการผู้ขาย',
        icon: 'Store',
        requiredPermission: 'sellers.view',
        children: [
            {
                id: 'sellers-list',
                label: 'รายชื่อผู้ขาย',
                path: '/admin/sellers',
                requiredPermission: 'sellers.view'
            },
            {
                id: 'sellers-pending',
                label: 'รอตรวจสอบ KYC',
                path: '/admin/sellers/pending',
                requiredPermission: 'sellers.approve_kyc'
            },
            {
                id: 'sellers-wallets',
                label: 'กระเป๋าเงินผู้ขาย',
                path: '/admin/sellers/wallets',
                requiredPermission: 'sellers.view_wallet'
            }
        ]
    },
    {
        id: 'products',
        label: 'จัดการสินค้า',
        icon: 'Package',
        requiredPermission: 'products.view',
        children: [
            {
                id: 'products-all',
                label: 'สินค้าทั้งหมด',
                path: '/admin/products',
                requiredPermission: 'products.view'
            },
            {
                id: 'products-pending',
                label: 'รอตรวจสอบ',
                path: '/admin/products/pending',
                requiredPermission: 'products.moderate'
            },
            {
                id: 'products-reported',
                label: 'สินค้าถูกรายงาน',
                path: '/admin/products/reported',
                requiredPermission: 'products.moderate'
            },
            {
                id: 'products-suspended',
                label: 'สินค้าถูกระงับ',
                path: '/admin/products/suspended',
                requiredPermission: 'products.view'
            }
        ]
    },
    {
        id: 'orders',
        label: 'จัดการคำสั่งซื้อ',
        icon: 'ShoppingCart',
        requiredPermission: 'orders.view',
        children: [
            {
                id: 'orders-all',
                label: 'คำสั่งซื้อทั้งหมด',
                path: '/admin/orders',
                requiredPermission: 'orders.view'
            },
            {
                id: 'orders-disputes',
                label: 'ข้อพิพาท',
                path: '/admin/orders/disputes',
                requiredPermission: 'orders.dispute'
            },
            {
                id: 'orders-refunds',
                label: 'คำขอคืนเงิน',
                path: '/admin/orders/refunds',
                requiredPermission: 'orders.refund'
            }
        ]
    },
    {
        id: 'finance',
        label: 'การเงิน',
        icon: 'Wallet',
        requiredPermission: 'finance.view_reports',
        children: [
            {
                id: 'finance-overview',
                label: 'ภาพรวมการเงิน',
                path: '/admin/finance',
                requiredPermission: 'finance.view_reports'
            },
            {
                id: 'finance-withdrawals',
                label: 'คำขอถอนเงิน',
                path: '/admin/finance/withdrawals',
                requiredPermission: 'finance.approve_withdrawals'
            },
            {
                id: 'finance-commission',
                label: 'ค่าธรรมเนียม',
                path: '/admin/finance/commission',
                requiredPermission: 'finance.edit_commission'
            },
            {
                id: 'finance-reports',
                label: 'รายงานบัญชี',
                path: '/admin/finance/reports',
                requiredPermission: 'finance.export_data'
            }
        ]
    },
    {
        id: 'promotions',
        label: 'โปรโมชัน',
        icon: 'Megaphone',
        requiredPermission: 'promotions.view',
        children: [
            {
                id: 'promotions-system',
                label: 'โปรโมชันระบบ',
                path: '/admin/promotions',
                requiredPermission: 'promotions.view'
            },
            {
                id: 'promotions-coupons',
                label: 'คูปอง',
                path: '/admin/promotions/coupons',
                requiredPermission: 'promotions.create'
            },
            {
                id: 'promotions-boost',
                label: 'Boost สินค้า',
                path: '/admin/promotions/boost',
                requiredPermission: 'promotions.view'
            }
        ]
    },
    {
        id: 'content',
        label: 'ตรวจสอบเนื้อหา',
        icon: 'FileText',
        requiredPermission: 'content.review',
        children: [
            {
                id: 'content-queue',
                label: 'คิวตรวจสอบ',
                path: '/admin/content/queue',
                requiredPermission: 'content.review'
            },
            {
                id: 'content-approved',
                label: 'อนุมัติแล้ว',
                path: '/admin/content/approved',
                requiredPermission: 'content.review'
            },
            {
                id: 'content-rejected',
                label: 'ปฏิเสธ',
                path: '/admin/content/rejected',
                requiredPermission: 'content.review'
            }
        ]
    },
    {
        id: 'analytics',
        label: 'วิเคราะห์ข้อมูล',
        icon: 'BarChart3',
        requiredPermission: 'analytics.view_dashboard',
        children: [
            {
                id: 'analytics-overview',
                label: 'ภาพรวม',
                path: '/admin/analytics',
                requiredPermission: 'analytics.view_dashboard'
            },
            {
                id: 'analytics-users',
                label: 'พฤติกรรมผู้ใช้',
                path: '/admin/analytics/users',
                requiredPermission: 'analytics.view_reports'
            },
            {
                id: 'analytics-sales',
                label: 'ยอดขาย',
                path: '/admin/analytics/sales',
                requiredPermission: 'analytics.view_reports'
            },
            {
                id: 'analytics-products',
                label: 'สินค้ายอดนิยม',
                path: '/admin/analytics/products',
                requiredPermission: 'analytics.view_reports'
            }
        ]
    },
    {
        id: 'system',
        label: 'ตั้งค่าระบบ',
        icon: 'Settings',
        requiredPermission: 'system.view_config',
        children: [
            {
                id: 'system-modules',
                label: 'โมดูลระบบ',
                path: '/admin/system/modules',
                requiredPermission: 'system.manage_modules'
            },
            {
                id: 'system-roles',
                label: 'จัดการสิทธิ',
                path: '/admin/system/roles',
                requiredPermission: 'system.manage_roles'
            },
            {
                id: 'system-admins',
                label: 'ผู้ดูแลระบบ',
                path: '/admin/system/admins',
                requiredPermission: 'system.manage_roles'
            },
            {
                id: 'system-config',
                label: 'การตั้งค่า',
                path: '/admin/system/config',
                requiredPermission: 'system.edit_config'
            },
            {
                id: 'system-logs',
                label: 'บันทึกกิจกรรม',
                path: '/admin/system/logs',
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
