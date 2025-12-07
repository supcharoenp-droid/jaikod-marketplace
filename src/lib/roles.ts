/**
 * JaiKod Role-Based Access Control (RBAC) System
 * 
 * 8 Levels of User Roles with Sub-roles for Staff
 */

// ==========================================
// ROLE DEFINITIONS
// ==========================================

export type UserRole =
    | 'guest'
    | 'buyer'
    | 'seller_basic'
    | 'seller_plus'
    | 'shop_verified'
    | 'shop_premium'
    | 'staff'
    | 'super_admin'

export type StaffRole =
    | 'staff_cs'        // Customer Support
    | 'staff_content'   // Content Moderator
    | 'staff_fraud'     // Fraud Analyst
    | 'staff_marketing' // Marketing
    | 'staff_finance'   // Finance
    | 'manager'         // Department Manager

// ==========================================
// ROLE HIERARCHY & DETAILS
// ==========================================

export interface RoleDefinition {
    id: UserRole
    level: number
    name_th: string
    name_en: string
    description: string
    color: string
    icon: string
    monthlyFee: number // in JaiCoin
    benefits: string[]
    limits: {
        maxListings: number | null   // null = unlimited
        maxBoostsPerMonth: number
        canWithdraw: boolean
        withdrawDays: number         // T+N days
        commissionRate: number       // percentage
    }
}

export const ROLES: Record<UserRole, RoleDefinition> = {
    guest: {
        id: 'guest',
        level: 1,
        name_th: 'ผู้เยี่ยมชม',
        name_en: 'Guest',
        description: 'ผู้เยี่ยมชมที่ยังไม่ได้สมัครสมาชิก',
        color: '#94a3b8',
        icon: '👤',
        monthlyFee: 0,
        benefits: ['ดูสินค้า', 'ค้นหา', 'ดูรายละเอียดร้านค้า'],
        limits: {
            maxListings: 0,
            maxBoostsPerMonth: 0,
            canWithdraw: false,
            withdrawDays: 0,
            commissionRate: 0
        }
    },
    buyer: {
        id: 'buyer',
        level: 2,
        name_th: 'ผู้ซื้อ',
        name_en: 'Buyer',
        description: 'สมาชิกที่ต้องการซื้อสินค้า',
        color: '#3b82f6',
        icon: '🛒',
        monthlyFee: 0,
        benefits: ['ซื้อสินค้า', 'แชทกับผู้ขาย', 'เขียนรีวิว', 'บันทึก Wishlist'],
        limits: {
            maxListings: 0,
            maxBoostsPerMonth: 0,
            canWithdraw: false,
            withdrawDays: 0,
            commissionRate: 0
        }
    },
    seller_basic: {
        id: 'seller_basic',
        level: 3,
        name_th: 'ผู้ขายทั่วไป',
        name_en: 'Basic Seller',
        description: 'ผู้ขายเริ่มต้น ลงขายได้จำกัด',
        color: '#22c55e',
        icon: '📦',
        monthlyFee: 0,
        benefits: ['ลงขาย 10 ชิ้น/เดือน', 'รับแชทจากผู้ซื้อ', 'ดูสถิติพื้นฐาน'],
        limits: {
            maxListings: 10,
            maxBoostsPerMonth: 0,
            canWithdraw: true,
            withdrawDays: 7,  // T+7
            commissionRate: 5 // 5%
        }
    },
    seller_plus: {
        id: 'seller_plus',
        level: 4,
        name_th: 'ผู้ขาย Plus',
        name_en: 'Seller Plus',
        description: 'ผู้ขายที่ต้องการลงขายมากขึ้น',
        color: '#8b5cf6',
        icon: '💎',
        monthlyFee: 99,
        benefits: ['ลงขายไม่จำกัด', 'Analytics พื้นฐาน', 'Boost ฟรี 1 ครั้ง/เดือน', 'Badge Seller Plus'],
        limits: {
            maxListings: null,
            maxBoostsPerMonth: 1,
            canWithdraw: true,
            withdrawDays: 5,  // T+5
            commissionRate: 4 // 4%
        }
    },
    shop_verified: {
        id: 'shop_verified',
        level: 5,
        name_th: 'ร้านค้ายืนยันตัวตน',
        name_en: 'Verified Shop',
        description: 'ร้านค้าที่ผ่านการยืนยันตัวตน',
        color: '#06b6d4',
        icon: '✅',
        monthlyFee: 299,
        benefits: [
            'Badge ✓ Verified',
            'Boost ฟรี 3 ครั้ง/เดือน',
            'แสดงผลสูงกว่าในผลค้นหา',
            'ถอนเงินเร็วขึ้น (T+1)',
            'Priority Customer Support'
        ],
        limits: {
            maxListings: null,
            maxBoostsPerMonth: 3,
            canWithdraw: true,
            withdrawDays: 1,  // T+1
            commissionRate: 3 // 3%
        }
    },
    shop_premium: {
        id: 'shop_premium',
        level: 6,
        name_th: 'ร้านค้าพรีเมียม',
        name_en: 'Premium Shop',
        description: 'ร้านค้าระดับสูงสุดสำหรับธุรกิจ',
        color: '#f59e0b',
        icon: '👑',
        monthlyFee: 599,
        benefits: [
            'หน้าร้านเต็มรูปแบบ (Shop Page)',
            'Analytics ขั้นสูง',
            'Boost ฟรี 10 ครั้ง/เดือน',
            'Flash Sale Slot 2 ครั้ง/เดือน',
            'Priority Support (ตอบใน 2 ชม.)',
            'ค่าธรรมเนียมพิเศษ 2%'
        ],
        limits: {
            maxListings: null,
            maxBoostsPerMonth: 10,
            canWithdraw: true,
            withdrawDays: 0,  // Instant
            commissionRate: 2 // 2%
        }
    },
    staff: {
        id: 'staff',
        level: 7,
        name_th: 'พนักงาน JaiKod',
        name_en: 'Staff',
        description: 'พนักงานดูแลระบบ',
        color: '#64748b',
        icon: '🏢',
        monthlyFee: 0,
        benefits: ['เข้าถึง Admin Panel', 'จัดการตามสิทธิ์ที่กำหนด'],
        limits: {
            maxListings: 0,
            maxBoostsPerMonth: 0,
            canWithdraw: false,
            withdrawDays: 0,
            commissionRate: 0
        }
    },
    super_admin: {
        id: 'super_admin',
        level: 8,
        name_th: 'ผู้ดูแลสูงสุด',
        name_en: 'Super Admin',
        description: 'สิทธิ์สูงสุด ทำได้ทุกอย่าง',
        color: '#dc2626',
        icon: '🔑',
        monthlyFee: 0,
        benefits: ['ทำได้ทุกอย่างในระบบ', 'จัดการสิทธิ์ทุกระดับ', 'ดู Audit Log'],
        limits: {
            maxListings: null,
            maxBoostsPerMonth: 999,
            canWithdraw: true,
            withdrawDays: 0,
            commissionRate: 0
        }
    }
}

// ==========================================
// STAFF SUB-ROLES
// ==========================================

export interface StaffRoleDefinition {
    id: StaffRole
    name_th: string
    name_en: string
    department: string
    permissions: Permission[]
}

export const STAFF_ROLES: Record<StaffRole, StaffRoleDefinition> = {
    staff_cs: {
        id: 'staff_cs',
        name_th: 'Customer Support',
        name_en: 'Customer Support',
        department: 'Customer Service',
        permissions: ['view_users', 'view_orders', 'send_messages', 'handle_disputes', 'view_reports']
    },
    staff_content: {
        id: 'staff_content',
        name_th: 'Content Moderator',
        name_en: 'Content Moderator',
        department: 'Content & Trust',
        permissions: ['view_products', 'approve_products', 'reject_products', 'delete_products', 'view_reports']
    },
    staff_fraud: {
        id: 'staff_fraud',
        name_th: 'Fraud Analyst',
        name_en: 'Fraud Analyst',
        department: 'Trust & Safety',
        permissions: ['view_users', 'view_transactions', 'flag_suspicious', 'suspend_accounts', 'view_fraud_reports']
    },
    staff_marketing: {
        id: 'staff_marketing',
        name_th: 'Marketing',
        name_en: 'Marketing',
        department: 'Marketing',
        permissions: ['manage_banners', 'manage_campaigns', 'manage_promotions', 'view_analytics']
    },
    staff_finance: {
        id: 'staff_finance',
        name_th: 'Finance',
        name_en: 'Finance',
        department: 'Finance',
        permissions: ['view_revenue', 'view_payouts', 'export_reports', 'manage_refunds']
    },
    manager: {
        id: 'manager',
        name_th: 'หัวหน้าแผนก',
        name_en: 'Department Manager',
        department: 'Management',
        permissions: ['manage_staff', 'view_department_reports', 'approve_escalations', 'all_staff_permissions']
    }
}

// ==========================================
// PERMISSIONS
// ==========================================

export type Permission =
    // User Management
    | 'view_users'
    | 'edit_users'
    | 'suspend_accounts'
    | 'delete_accounts'
    | 'manage_staff'

    // Product Management
    | 'view_products'
    | 'approve_products'
    | 'reject_products'
    | 'delete_products'
    | 'feature_products'

    // Order & Transaction
    | 'view_orders'
    | 'view_transactions'
    | 'manage_refunds'
    | 'handle_disputes'

    // Content & Marketing
    | 'manage_banners'
    | 'manage_campaigns'
    | 'manage_promotions'

    // Analytics & Reports
    | 'view_analytics'
    | 'view_revenue'
    | 'view_payouts'
    | 'view_reports'
    | 'view_fraud_reports'
    | 'view_department_reports'
    | 'export_reports'

    // Communication
    | 'send_messages'
    | 'send_notifications'

    // Trust & Safety
    | 'flag_suspicious'
    | 'approve_escalations'

    // System
    | 'manage_settings'
    | 'view_audit_log'
    | 'all_permissions'
    | 'all_staff_permissions'

// ==========================================
// PERMISSION MATRIX
// ==========================================

export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
    guest: [],
    buyer: [],
    seller_basic: [],
    seller_plus: [],
    shop_verified: [],
    shop_premium: [],
    staff: [], // Controlled by StaffRole
    super_admin: ['all_permissions']
}

// ==========================================
// HELPER FUNCTIONS
// ==========================================

export function getRoleLevel(role: UserRole): number {
    return ROLES[role]?.level || 0
}

export function canAccessAdmin(role: UserRole): boolean {
    return getRoleLevel(role) >= 7
}

export function canSell(role: UserRole): boolean {
    return getRoleLevel(role) >= 3 && getRoleLevel(role) <= 6
}

export function canBuy(role: UserRole): boolean {
    return getRoleLevel(role) >= 2
}

export function getMaxListings(role: UserRole): number | null {
    return ROLES[role]?.limits.maxListings ?? 0
}

export function getCommissionRate(role: UserRole): number {
    return ROLES[role]?.limits.commissionRate ?? 5
}

export function hasPermission(userPermissions: Permission[], required: Permission): boolean {
    if (userPermissions.includes('all_permissions')) return true
    return userPermissions.includes(required)
}

export function isStaff(role: UserRole): boolean {
    return role === 'staff' || role === 'super_admin'
}

export function getRoleBadgeColor(role: UserRole): string {
    return ROLES[role]?.color || '#94a3b8'
}

// ==========================================
// UPGRADE PATH
// ==========================================

export interface UpgradePath {
    from: UserRole
    to: UserRole
    requirements: string[]
    monthlyFee: number
}

export const UPGRADE_PATHS: UpgradePath[] = [
    {
        from: 'guest',
        to: 'buyer',
        requirements: ['สมัครสมาชิก', 'ยืนยันอีเมล'],
        monthlyFee: 0
    },
    {
        from: 'buyer',
        to: 'seller_basic',
        requirements: ['ยืนยันเบอร์โทรศัพท์'],
        monthlyFee: 0
    },
    {
        from: 'seller_basic',
        to: 'seller_plus',
        requirements: ['ชำระค่าสมาชิก 99 Coins/เดือน'],
        monthlyFee: 99
    },
    {
        from: 'seller_plus',
        to: 'shop_verified',
        requirements: ['ยืนยันบัตรประชาชน หรือ ทะเบียนการค้า', 'ชำระค่าสมาชิก 299 Coins/เดือน'],
        monthlyFee: 299
    },
    {
        from: 'shop_verified',
        to: 'shop_premium',
        requirements: ['ยอดขายขั้นต่ำ 10,000 บาท/เดือน', 'ชำระค่าสมาชิก 599 Coins/เดือน'],
        monthlyFee: 599
    }
]
