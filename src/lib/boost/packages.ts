/**
 * Boost Packages Configuration
 * 
 * All available boost packages for JaiKod marketplace
 */

import { BoostPackage, BoostType, SellerAccountType } from './types'

// ==========================================
// BOOST PACKAGES
// ==========================================

export const BOOST_PACKAGES: BoostPackage[] = [
    {
        id: 'basic_24h',
        type: 'basic',
        name: 'Basic Boost',
        name_th: 'Boost พื้นฐาน',
        description: '2x visibility for 24 hours',
        description_th: 'เพิ่มการมองเห็น 2 เท่า นาน 24 ชั่วโมง',
        duration_hours: 24,
        price_jaistar: 29,
        visibility_multiplier: 2,
        position_boost: true,
        highlight_badge: false,
        homepage_feature: false,
        category_feature: false,
        badge_color: '#3B82F6',
        badge_icon: '🚀',
        avg_view_increase: 150,
        avg_inquiry_increase: 80,
        is_active: true,
        available_for: ['individual', 'general_store', 'official_store']
    },
    {
        id: 'basic_72h',
        type: 'basic',
        name: 'Basic Boost 3 Days',
        name_th: 'Boost พื้นฐาน 3 วัน',
        description: '2x visibility for 3 days - Save 15%',
        description_th: 'เพิ่มการมองเห็น 2 เท่า นาน 3 วัน - ประหยัด 15%',
        duration_hours: 72,
        price_jaistar: 75,
        original_price: 87,
        visibility_multiplier: 2,
        position_boost: true,
        highlight_badge: false,
        homepage_feature: false,
        category_feature: false,
        badge_color: '#3B82F6',
        badge_icon: '🚀',
        avg_view_increase: 150,
        avg_inquiry_increase: 80,
        is_active: true,
        available_for: ['individual', 'general_store', 'official_store']
    },
    {
        id: 'premium_24h',
        type: 'premium',
        name: 'Premium Boost',
        name_th: 'Boost พรีเมียม',
        description: '5x visibility + highlighted badge for 24 hours',
        description_th: 'เพิ่มการมองเห็น 5 เท่า + ป้ายเด่น นาน 24 ชั่วโมง',
        duration_hours: 24,
        price_jaistar: 59,
        visibility_multiplier: 5,
        position_boost: true,
        highlight_badge: true,
        homepage_feature: false,
        category_feature: true,
        badge_color: '#8B5CF6',
        badge_icon: '⭐',
        avg_view_increase: 300,
        avg_inquiry_increase: 150,
        is_active: true,
        available_for: ['individual', 'general_store', 'official_store']
    },
    {
        id: 'premium_48h',
        type: 'premium',
        name: 'Premium Boost 2 Days',
        name_th: 'Boost พรีเมียม 2 วัน',
        description: '5x visibility + highlighted badge for 48 hours',
        description_th: 'เพิ่มการมองเห็น 5 เท่า + ป้ายเด่น นาน 48 ชั่วโมง',
        duration_hours: 48,
        price_jaistar: 99,
        original_price: 118,
        visibility_multiplier: 5,
        position_boost: true,
        highlight_badge: true,
        homepage_feature: false,
        category_feature: true,
        badge_color: '#8B5CF6',
        badge_icon: '⭐',
        avg_view_increase: 400,
        avg_inquiry_increase: 200,
        is_active: true,
        available_for: ['individual', 'general_store', 'official_store']
    },
    {
        id: 'urgent_24h',
        type: 'urgent',
        name: 'Urgent Sale',
        name_th: 'ขายด่วน!',
        description: '"URGENT" badge + homepage feature for 24 hours',
        description_th: 'ป้าย "ขายด่วน" + แสดงบนหน้าแรก 24 ชั่วโมง',
        duration_hours: 24,
        price_jaistar: 149,
        visibility_multiplier: 10,
        position_boost: true,
        highlight_badge: true,
        homepage_feature: true,
        category_feature: true,
        badge_color: '#EF4444',
        badge_icon: '🔥',
        avg_view_increase: 800,
        avg_inquiry_increase: 400,
        is_active: true,
        available_for: ['individual', 'general_store', 'official_store']
    },
    {
        id: 'homepage_3d',
        type: 'homepage',
        name: 'Homepage Feature 3 Days',
        name_th: 'แสดงหน้าแรก 3 วัน',
        description: 'Featured on homepage "Recommended" section for 3 days',
        description_th: 'แสดงบนหน้าแรก Section "สินค้าแนะนำ" 3 วัน',
        duration_hours: 72,
        price_jaistar: 199,
        visibility_multiplier: 12,
        position_boost: true,
        highlight_badge: true,
        homepage_feature: true,
        category_feature: true,
        badge_color: '#F59E0B',
        badge_icon: '👑',
        avg_view_increase: 1500,
        avg_inquiry_increase: 600,
        is_active: true,
        available_for: ['general_store', 'official_store']
    },
    {
        id: 'homepage_7d',
        type: 'homepage',
        name: 'Homepage Feature 7 Days',
        name_th: 'แสดงหน้าแรก 7 วัน',
        description: 'Featured on homepage "Recommended" section for 7 days',
        description_th: 'แสดงบนหน้าแรก Section "สินค้าแนะนำ" 7 วัน',
        duration_hours: 168,
        price_jaistar: 349,
        original_price: 398,
        visibility_multiplier: 15,
        position_boost: true,
        highlight_badge: true,
        homepage_feature: true,
        category_feature: true,
        badge_color: '#F59E0B',
        badge_icon: '👑',
        avg_view_increase: 2000,
        avg_inquiry_increase: 800,
        is_active: true,
        available_for: ['general_store', 'official_store']
    },
    {
        id: 'category_top_3d',
        type: 'category_top',
        name: 'Category Top 3 Days',
        name_th: 'อันดับ 1 ในหมวด 3 วัน',
        description: 'Top position in category for 3 days',
        description_th: 'แสดงอันดับต้นๆ ในหมวดหมู่ 3 วัน',
        duration_hours: 72,
        price_jaistar: 179,
        visibility_multiplier: 8,
        position_boost: true,
        highlight_badge: true,
        homepage_feature: false,
        category_feature: true,
        badge_color: '#10B981',
        badge_icon: '📌',
        avg_view_increase: 600,
        avg_inquiry_increase: 300,
        is_active: true,
        available_for: ['general_store', 'official_store']
    }
]

// ==========================================
// PACKAGE UTILITIES
// ==========================================

/**
 * Get all active packages
 */
export function getActivePackages(): BoostPackage[] {
    return BOOST_PACKAGES.filter(p => p.is_active)
}

/**
 * Get package by ID
 */
export function getPackageById(id: string): BoostPackage | undefined {
    return BOOST_PACKAGES.find(p => p.id === id)
}

/**
 * Get packages by type
 */
export function getPackagesByType(type: BoostType): BoostPackage[] {
    return BOOST_PACKAGES.filter(p => p.type === type && p.is_active)
}

/**
 * Get packages available for seller type
 */
export function getPackagesForSeller(sellerType: SellerAccountType): BoostPackage[] {
    return BOOST_PACKAGES.filter(p => p.is_active && p.available_for.includes(sellerType))
}

/**
 * Get cheapest package
 */
export function getCheapestPackage(): BoostPackage {
    return BOOST_PACKAGES
        .filter(p => p.is_active)
        .sort((a, b) => a.price_jaistar - b.price_jaistar)[0]
}

/**
 * Get most popular package (based on avg metrics)
 */
export function getMostPopularPackage(): BoostPackage {
    return BOOST_PACKAGES
        .filter(p => p.is_active)
        .sort((a, b) => {
            const scoreA = a.avg_view_increase / a.price_jaistar
            const scoreB = b.avg_view_increase / b.price_jaistar
            return scoreB - scoreA
        })[0]
}

/**
 * Get best value package (highest ROI)
 */
export function getBestValuePackage(): BoostPackage {
    return BOOST_PACKAGES
        .filter(p => p.is_active && p.original_price)
        .sort((a, b) => {
            const discountA = ((a.original_price || a.price_jaistar) - a.price_jaistar) / (a.original_price || a.price_jaistar)
            const discountB = ((b.original_price || b.price_jaistar) - b.price_jaistar) / (b.original_price || b.price_jaistar)
            return discountB - discountA
        })[0]
}

/**
 * Calculate price with seller discount
 */
export function calculateBoostPrice(
    packageId: string,
    sellerType: SellerAccountType
): { original: number; discount: number; final: number; savings_percent: number } | null {
    const pkg = getPackageById(packageId)
    if (!pkg) return null

    // Seller type discounts
    const discountRates: Record<SellerAccountType, number> = {
        individual: 0,
        general_store: 0.10,    // 10% off
        official_store: 0.25    // 25% off
    }

    const discountRate = discountRates[sellerType]
    const discount = Math.floor(pkg.price_jaistar * discountRate)

    return {
        original: pkg.price_jaistar,
        discount,
        final: pkg.price_jaistar - discount,
        savings_percent: Math.round(discountRate * 100)
    }
}

/**
 * Format duration for display
 */
export function formatBoostDuration(hours: number): { th: string; en: string } {
    if (hours < 24) {
        return { th: `${hours} ชั่วโมง`, en: `${hours} hours` }
    }
    const days = Math.round(hours / 24)
    return {
        th: days === 1 ? '1 วัน' : `${days} วัน`,
        en: days === 1 ? '1 day' : `${days} days`
    }
}

/**
 * Get package comparison data
 */
export function getPackageComparison(): {
    packages: BoostPackage[]
    features: string[]
    comparison: Record<string, Record<string, boolean | string>>
} {
    const packages = getActivePackages()
    const features = [
        'position_boost',
        'highlight_badge',
        'homepage_feature',
        'category_feature'
    ]

    const comparison: Record<string, Record<string, boolean | string>> = {}

    for (const pkg of packages) {
        comparison[pkg.id] = {
            position_boost: pkg.position_boost,
            highlight_badge: pkg.highlight_badge,
            homepage_feature: pkg.homepage_feature,
            category_feature: pkg.category_feature,
            visibility: `${pkg.visibility_multiplier}x`,
            duration: formatBoostDuration(pkg.duration_hours).th
        }
    }

    return { packages, features, comparison }
}
