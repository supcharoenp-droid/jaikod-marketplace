/**
 * Profile System - Main Export
 */

export * from './types'
export * from './seller-listings'

// Re-export with namespace
import {
    UserLevel,
    SellerType,
    ListingStatus,
    UserPermissions,
    ListingStatusConfig,
    AutoDeleteConfig,
    DashboardSectionConfig,
    USER_LEVEL_PERMISSIONS,
    LISTING_STATUS_CONFIG,
    AUTO_DELETE_CONFIG,
    DASHBOARD_SECTIONS,
    getPermissions,
    getListingStatusConfig,
    getAutoDeleteConfig,
    getDashboardSections,
    canPerformAction,
    getUserLevelLabel,
    getSellerTypeLabel
} from './types'

import { SellerListingsService } from './seller-listings'

export const Profile = {
    // Permissions
    getPermissions,
    canPerformAction,

    // Listing Status
    getListingStatusConfig,

    // Auto-delete
    getAutoDeleteConfig,

    // Dashboard
    getDashboardSections,

    // Labels
    getUserLevelLabel,
    getSellerTypeLabel,

    // Services
    Listings: SellerListingsService,

    // Configs
    PERMISSIONS: USER_LEVEL_PERMISSIONS,
    STATUS_CONFIG: LISTING_STATUS_CONFIG,
    DELETE_CONFIG: AUTO_DELETE_CONFIG,
    SECTIONS: DASHBOARD_SECTIONS
}

export default Profile
