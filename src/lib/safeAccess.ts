/**
 * Safe Data Access Utilities
 * JaiKod Marketplace
 * 
 * Helper functions for safely accessing potentially undefined/null data
 */

// ==========================================
// SAFE STRING ACCESS
// ==========================================

/**
 * Get string value with fallback
 */
export function safeString(value: string | null | undefined, fallback: string = ''): string {
    return value ?? fallback
}

/**
 * Get first character of string safely
 */
export function safeFirstChar(value: string | null | undefined, fallback: string = '?'): string {
    return value?.[0] ?? fallback
}

/**
 * Truncate string safely
 */
export function safeTruncate(
    value: string | null | undefined,
    maxLength: number,
    ellipsis: string = '...'
): string {
    if (!value) return ''
    if (value.length <= maxLength) return value
    return value.substring(0, maxLength - ellipsis.length) + ellipsis
}

// ==========================================
// SAFE NUMBER ACCESS
// ==========================================

/**
 * Get number value with fallback
 */
export function safeNumber(value: number | null | undefined, fallback: number = 0): number {
    return value ?? fallback
}

/**
 * Format number safely
 */
export function safeNumberFormat(
    value: number | null | undefined,
    locale: string = 'th-TH',
    fallback: string = '0'
): string {
    if (value === null || value === undefined) return fallback
    return value.toLocaleString(locale)
}

/**
 * Format currency safely
 */
export function safeCurrency(
    value: number | null | undefined,
    currency: string = 'THB',
    fallback: string = '฿0'
): string {
    if (value === null || value === undefined) return fallback
    return new Intl.NumberFormat('th-TH', {
        style: 'currency',
        currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
    }).format(value)
}

// ==========================================
// SAFE DATE ACCESS
// ==========================================

/**
 * Get date value with fallback
 */
export function safeDate(value: Date | string | null | undefined, fallback?: Date): Date {
    if (!value) return fallback ?? new Date()
    if (value instanceof Date) return value
    return new Date(value)
}

/**
 * Format date safely
 */
export function safeDateFormat(
    value: Date | string | null | undefined,
    locale: string = 'th-TH',
    options?: Intl.DateTimeFormatOptions,
    fallback: string = 'ไม่ระบุ'
): string {
    if (!value) return fallback
    const date = safeDate(value)
    return date.toLocaleDateString(locale, options)
}

// ==========================================
// SAFE ARRAY ACCESS
// ==========================================

/**
 * Get array with fallback
 */
export function safeArray<T>(value: T[] | null | undefined, fallback: T[] = []): T[] {
    return value ?? fallback
}

/**
 * Get array length safely
 */
export function safeArrayLength<T>(value: T[] | null | undefined): number {
    return value?.length ?? 0
}

/**
 * Get first item from array safely
 */
export function safeFirst<T>(value: T[] | null | undefined, fallback?: T): T | undefined {
    return value?.[0] ?? fallback
}

/**
 * Get last item from array safely
 */
export function safeLast<T>(value: T[] | null | undefined, fallback?: T): T | undefined {
    if (!value || value.length === 0) return fallback
    return value[value.length - 1]
}

// ==========================================
// SAFE OBJECT ACCESS
// ==========================================

/**
 * Get nested object property safely
 */
export function safeGet<T>(
    obj: any,
    path: string,
    fallback?: T
): T | undefined {
    const keys = path.split('.')
    let result = obj

    for (const key of keys) {
        if (result === null || result === undefined) {
            return fallback
        }
        result = result[key]
    }

    return result ?? fallback
}

/**
 * Check if object has property
 */
export function safeHas(obj: any, path: string): boolean {
    const keys = path.split('.')
    let result = obj

    for (const key of keys) {
        if (result === null || result === undefined) {
            return false
        }
        if (!(key in result)) {
            return false
        }
        result = result[key]
    }

    return true
}

// ==========================================
// SAFE URL/IMAGE ACCESS
// ==========================================

/**
 * Get image URL with fallback
 */
export function safeImageUrl(
    value: string | null | undefined,
    fallback: string = '/images/placeholder.jpg'
): string {
    return value ?? fallback
}

/**
 * Get avatar URL or generate initials
 */
export function safeAvatarUrl(
    imageUrl: string | null | undefined,
    name: string | null | undefined,
    fallback: string = '/images/default-avatar.jpg'
): string {
    if (imageUrl) return imageUrl
    if (name) {
        // Generate avatar from initials (could use a service like ui-avatars.com)
        const initials = safeFirstChar(name, '?')
        return `https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&background=random`
    }
    return fallback
}

// ==========================================
// PRODUCT-SPECIFIC HELPERS
// ==========================================

/**
 * Get seller name safely
 */
export function safeSellerName(
    sellerName: string | null | undefined,
    fallback: string = 'JaiKod Seller'
): string {
    return safeString(sellerName, fallback)
}

/**
 * Get seller initial safely
 */
export function safeSellerInitial(
    sellerName: string | null | undefined,
    fallback: string = 'J'
): string {
    return safeFirstChar(sellerName, fallback)
}

/**
 * Get location safely
 */
export function safeLocation(
    province: string | null | undefined,
    amphoe?: string | null | undefined,
    fallback: string = 'ไม่ระบุ'
): string {
    const provinceName = safeString(province, fallback)

    if (amphoe) {
        const amphoeName = safeString(amphoe, '')
        return `${amphoeName}, ${provinceName}`
    }

    return provinceName
}

/**
 * Get product condition label
 */
export function safeConditionLabel(
    condition: string | null | undefined,
    fallback: string = 'ไม่ระบุ'
): string {
    const conditions: Record<string, string> = {
        'new': 'ใหม่',
        'like_new': 'เหมือนใหม่',
        'good': 'ดี',
        'fair': 'พอใช้',
        'poor': 'ต้องซ่อม'
    }

    if (!condition) return fallback
    return conditions[condition] ?? fallback
}

/**
 * Calculate discount percentage safely
 */
export function safeDiscountPercent(
    originalPrice: number | null | undefined,
    currentPrice: number | null | undefined
): number {
    if (!originalPrice || !currentPrice) return 0
    if (originalPrice <= currentPrice) return 0

    return Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
}

// ==========================================
// VALIDATION HELPERS
// ==========================================

/**
 * Check if value is empty
 */
export function isEmpty(value: any): boolean {
    if (value === null || value === undefined) return true
    if (typeof value === 'string') return value.trim() === ''
    if (Array.isArray(value)) return value.length === 0
    if (typeof value === 'object') return Object.keys(value).length === 0
    return false
}

/**
 * Check if value is not empty
 */
export function isNotEmpty(value: any): boolean {
    return !isEmpty(value)
}

/**
 * Get value or throw error
 */
export function required<T>(
    value: T | null | undefined,
    errorMessage: string = 'Required value is missing'
): T {
    if (value === null || value === undefined) {
        throw new Error(errorMessage)
    }
    return value
}

// ==========================================
// EXPORT ALL
// ==========================================

export const SafeAccess = {
    // String
    string: safeString,
    firstChar: safeFirstChar,
    truncate: safeTruncate,

    // Number
    number: safeNumber,
    numberFormat: safeNumberFormat,
    currency: safeCurrency,

    // Date
    date: safeDate,
    dateFormat: safeDateFormat,

    // Array
    array: safeArray,
    arrayLength: safeArrayLength,
    first: safeFirst,
    last: safeLast,

    // Object
    get: safeGet,
    has: safeHas,

    // URL/Image
    imageUrl: safeImageUrl,
    avatarUrl: safeAvatarUrl,

    // Product-specific
    sellerName: safeSellerName,
    sellerInitial: safeSellerInitial,
    location: safeLocation,
    conditionLabel: safeConditionLabel,
    discountPercent: safeDiscountPercent,

    // Validation
    isEmpty,
    isNotEmpty,
    required
}

export default SafeAccess
