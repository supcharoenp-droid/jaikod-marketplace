/**
 * Bilingual Utilities for JaiKod AI Suite
 * 
 * Helper functions to ensure consistent bilingual support
 * across all AI services
 */

export type Language = 'th' | 'en'

export interface BilingualText {
    th: string
    en: string
}

export interface BilingualArray<T> {
    th: T[]
    en: T[]
}

/**
 * Get text in specific language
 */
export function getText(text: BilingualText, language: Language): string {
    return text[language]
}

/**
 * Get array in specific language
 */
export function getArray<T>(arr: BilingualArray<T>, language: Language): T[] {
    return arr[language]
}

/**
 * Create bilingual text
 */
export function createBilingualText(th: string, en: string): BilingualText {
    return { th, en }
}

/**
 * Validate bilingual text
 */
export function validateBilingualText(text: any): text is BilingualText {
    return (
        typeof text === 'object' &&
        text !== null &&
        typeof text.th === 'string' &&
        typeof text.en === 'string'
    )
}

/**
 * Format with variables
 */
export function formatBilingualText(
    template: BilingualText,
    vars: Record<string, string | number>
): BilingualText {
    const formatString = (str: string): string => {
        return Object.entries(vars).reduce((result, [key, value]) => {
            return result.replace(new RegExp(`{${key}}`, 'g'), String(value))
        }, str)
    }

    return {
        th: formatString(template.th),
        en: formatString(template.en)
    }
}

/**
 * Common bilingual messages
 */
export const COMMON_MESSAGES = {
    success: {
        th: '✅ สำเร็จ!',
        en: '✅ Success!'
    },
    error: {
        th: '❌ เกิดข้อผิดพลาด',
        en: '❌ Error occurred'
    },
    loading: {
        th: '⏳ กำลังโหลด...',
        en: '⏳ Loading...'
    },
    processing: {
        th: '🤖 กำลังประมวลผล...',
        en: '🤖 Processing...'
    },
    complete: {
        th: '🎉 เสร็จสมบูรณ์!',
        en: '🎉 Complete!'
    },
    cancel: {
        th: 'ยกเลิก',
        en: 'Cancel'
    },
    confirm: {
        th: 'ยืนยัน',
        en: 'Confirm'
    },
    save: {
        th: 'บันทึก',
        en: 'Save'
    },
    publish: {
        th: 'เผยแพร่',
        en: 'Publish'
    },
    edit: {
        th: 'แก้ไข',
        en: 'Edit'
    },
    delete: {
        th: 'ลบ',
        en: 'Delete'
    },
    optional: {
        th: '(ไม่บังคับ)',
        en: '(Optional)'
    },
    required: {
        th: '(จำเป็น)',
        en: '(Required)'
    },
    recommended: {
        th: '(แนะนำ)',
        en: '(Recommended)'
    }
}

/**
 * Trust boost messages
 */
export const TRUST_MESSAGES = {
    increases_trust: {
        th: 'เพิ่มความน่าเชื่อถือ',
        en: 'Increases trust'
    },
    builds_confidence: {
        th: 'สร้างความมั่นใจ',
        en: 'Builds confidence'
    },
    verified: {
        th: 'ยืนยันแล้ว',
        en: 'Verified'
    },
    guaranteed: {
        th: 'รับประกัน',
        en: 'Guaranteed'
    }
}

/**
 * Quality messages
 */
export const QUALITY_MESSAGES = {
    excellent: {
        th: 'ยอดเยี่ยม',
        en: 'Excellent'
    },
    very_good: {
        th: 'ดีมาก',
        en: 'Very Good'
    },
    good: {
        th: 'ดี',
        en: 'Good'
    },
    fair: {
        th: 'พอใช้',
        en: 'Fair'
    },
    needs_improvement: {
        th: 'ควรปรับปรุง',
        en: 'Needs Improvement'
    }
}

/**
 * Category labels
 */
export const CATEGORY_LABELS = {
    automotive: { th: 'ยานยนต์', en: 'Automotive' },
    real_estate: { th: 'อสังหาริมทรัพย์', en: 'Real Estate' },
    mobiles: { th: 'มือถือและแท็บเล็ต', en: 'Mobiles & Tablets' },
    computers: { th: 'คอมพิวเตอร์และไอที', en: 'Computers & IT' },
    home_appliances: { th: 'เครื่องใช้ไฟฟ้า', en: 'Home Appliances' },
    fashion: { th: 'แฟชั่น', en: 'Fashion' },
    others: { th: 'อื่นๆ', en: 'Others' }
}

/**
 * Shipping labels
 */
export const SHIPPING_LABELS = {
    kerry: { th: 'Kerry Express', en: 'Kerry Express' },
    flash: { th: 'Flash Express', en: 'Flash Express' },
    jt: { th: 'J&T Express', en: 'J&T Express' },
    thailand_post: { th: 'ไปรษณีย์ไทย', en: 'Thailand Post' },
    pickup: { th: 'นัดรับเอง', en: 'Self Pickup' },
    free_shipping: { th: 'ส่งฟรี', en: 'Free Shipping' }
}

/**
 * Time labels
 */
export const TIME_LABELS = {
    days: { th: 'วัน', en: 'days' },
    hours: { th: 'ชั่วโมง', en: 'hours' },
    minutes: { th: 'นาที', en: 'minutes' },
    just_now: { th: 'เมื่อสักครู่', en: 'just now' },
    today: { th: 'วันนี้', en: 'today' },
    yesterday: { th: 'เมื่อวาน', en: 'yesterday' }
}

/**
 * Format relative time
 */
export function formatRelativeTime(
    date: Date,
    language: Language
): string {
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) {
        return getText(TIME_LABELS.just_now, language)
    } else if (diffMins < 60) {
        return `${diffMins} ${getText(TIME_LABELS.minutes, language)}`
    } else if (diffHours < 24) {
        return `${diffHours} ${getText(TIME_LABELS.hours, language)}`
    } else if (diffDays === 0) {
        return getText(TIME_LABELS.today, language)
    } else if (diffDays === 1) {
        return getText(TIME_LABELS.yesterday, language)
    } else {
        return `${diffDays} ${getText(TIME_LABELS.days, language)}`
    }
}

/**
 * Format currency
 */
export function formatCurrency(
    amount: number,
    language: Language
): string {
    const formatted = amount.toLocaleString(language === 'th' ? 'th-TH' : 'en-US')
    return `฿${formatted}`
}

/**
 * Format percentage
 */
export function formatPercentage(
    value: number,
    language: Language
): string {
    return `${value}%`
}

/**
 * Ensure all AI response text is bilingual
 */
export function ensureBilingual<T extends Record<string, any>>(
    obj: T,
    textFields: Array<keyof T>
): boolean {
    for (const field of textFields) {
        const value = obj[field]
        if (!validateBilingualText(value)) {
            console.error(`Field ${String(field)} is not bilingual:`, value)
            return false
        }
    }
    return true
}

/**
 * Get language from user preference or browser
 */
export function detectLanguage(): Language {
    // Check localStorage
    const stored = localStorage.getItem('language')
    if (stored === 'th' || stored === 'en') {
        return stored
    }

    // Check browser language
    const browserLang = navigator.language.toLowerCase()
    if (browserLang.includes('th')) {
        return 'th'
    }

    // Default to Thai
    return 'th'
}

/**
 * Save language preference
 */
export function saveLanguagePreference(language: Language): void {
    localStorage.setItem('language', language)
}

/**
 * Switch language
 */
export function switchLanguage(currentLanguage: Language): Language {
    const newLanguage: Language = currentLanguage === 'th' ? 'en' : 'th'
    saveLanguagePreference(newLanguage)
    return newLanguage
}
