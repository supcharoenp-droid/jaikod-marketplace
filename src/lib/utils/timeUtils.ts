/**
 * TIME UTILITIES
 * 
 * Helper functions for displaying relative time in Thai
 */

/**
 * Convert timestamp to relative time in Thai
 * Examples: "เมื่อสักครู่", "5 นาทีที่แล้ว", "2 ชั่วโมงที่แล้ว", "3 วันที่แล้ว"
 */
export function getRelativeTime(date: Date | any, language: 'th' | 'en' = 'th'): string {
    // Handle Firestore Timestamp
    let targetDate: Date
    if (date?.toDate && typeof date.toDate === 'function') {
        targetDate = date.toDate()
    } else if (date instanceof Date) {
        targetDate = date
    } else if (date?.seconds) {
        targetDate = new Date(date.seconds * 1000)
    } else if (typeof date === 'string' || typeof date === 'number') {
        targetDate = new Date(date)
    } else {
        return language === 'th' ? 'ไม่ทราบ' : 'Unknown'
    }

    const now = new Date()
    const diffMs = now.getTime() - targetDate.getTime()
    const diffSeconds = Math.floor(diffMs / 1000)
    const diffMinutes = Math.floor(diffSeconds / 60)
    const diffHours = Math.floor(diffMinutes / 60)
    const diffDays = Math.floor(diffHours / 24)
    const diffMonths = Math.floor(diffDays / 30)
    const diffYears = Math.floor(diffDays / 365)

    if (language === 'th') {
        // Thai language
        if (diffSeconds < 60) {
            return 'เมื่อสักครู่'
        } else if (diffMinutes < 60) {
            return `${diffMinutes} นาทีที่แล้ว`
        } else if (diffHours < 24) {
            return `${diffHours} ชั่วโมงที่แล้ว`
        } else if (diffDays < 7) {
            return `${diffDays} วันที่แล้ว`
        } else if (diffDays < 30) {
            const weeks = Math.floor(diffDays / 7)
            return `${weeks} สัปดาห์ที่แล้ว`
        } else if (diffMonths < 12) {
            return `${diffMonths} เดือนที่แล้ว`
        } else {
            return `${diffYears} ปีที่แล้ว`
        }
    } else {
        // English language
        if (diffSeconds < 60) {
            return 'just now'
        } else if (diffMinutes === 1) {
            return '1 minute ago'
        } else if (diffMinutes < 60) {
            return `${diffMinutes} minutes ago`
        } else if (diffHours === 1) {
            return '1 hour ago'
        } else if (diffHours < 24) {
            return `${diffHours} hours ago`
        } else if (diffDays === 1) {
            return '1 day ago'
        } else if (diffDays < 7) {
            return `${diffDays} days ago`
        } else if (diffDays < 30) {
            const weeks = Math.floor(diffDays / 7)
            return `${weeks} ${weeks === 1 ? 'week' : 'weeks'} ago`
        } else if (diffMonths === 1) {
            return '1 month ago'
        } else if (diffMonths < 12) {
            return `${diffMonths} months ago`
        } else if (diffYears === 1) {
            return '1 year ago'
        } else {
            return `${diffYears} years ago`
        }
    }
}

/**
 * Format date to Thai format
 * Example: "28 ธ.ค. 2568, 22:10"
 */
export function formatThaiDate(date: Date | any, includeTime: boolean = false): string {
    let targetDate: Date
    if (date?.toDate && typeof date.toDate === 'function') {
        targetDate = date.toDate()
    } else if (date instanceof Date) {
        targetDate = date
    } else if (date?.seconds) {
        targetDate = new Date(date.seconds * 1000)
    } else if (typeof date === 'string' || typeof date === 'number') {
        targetDate = new Date(date)
    } else {
        return 'ไม่ทราบ'
    }

    const thaiMonths = [
        'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.',
        'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'
    ]

    const day = targetDate.getDate()
    const month = thaiMonths[targetDate.getMonth()]
    const year = targetDate.getFullYear() + 543 // Convert to Thai Buddhist year

    if (includeTime) {
        const hours = targetDate.getHours().toString().padStart(2, '0')
        const minutes = targetDate.getMinutes().toString().padStart(2, '0')
        return `${day} ${month} ${year}, ${hours}:${minutes} น.`
    }

    return `${day} ${month} ${year}`
}

/**
 * Get smart date display (relative for recent, absolute for old)
 * Examples: "5 นาทีที่แล้ว" (if today), "เมื่อวาน เวลา 14:30" (if yesterday), "25 ธ.ค. 2568" (if older)
 */
export function getSmartDateDisplay(date: Date | any, language: 'th' | 'en' = 'th'): string {
    let targetDate: Date
    if (date?.toDate && typeof date.toDate === 'function') {
        targetDate = date.toDate()
    } else if (date instanceof Date) {
        targetDate = date
    } else if (date?.seconds) {
        targetDate = new Date(date.seconds * 1000)
    } else if (typeof date === 'string' || typeof date === 'number') {
        targetDate = new Date(date)
    } else {
        return language === 'th' ? 'ไม่ทราบ' : 'Unknown'
    }

    const now = new Date()
    const diffMs = now.getTime() - targetDate.getTime()
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    // If within last 24 hours, show relative time
    if (diffHours < 24 && now.getDate() === targetDate.getDate()) {
        return getRelativeTime(targetDate, language)
    }

    // If yesterday
    if (diffDays === 1 || (diffHours < 48 && now.getDate() - targetDate.getDate() === 1)) {
        const hours = targetDate.getHours().toString().padStart(2, '0')
        const minutes = targetDate.getMinutes().toString().padStart(2, '0')
        return language === 'th'
            ? `เมื่อวาน เวลา ${hours}:${minutes} น.`
            : `Yesterday at ${hours}:${minutes}`
    }

    // If within last week, show day name + time
    if (diffDays < 7) {
        const dayNames = language === 'th'
            ? ['อาทิตย์', 'จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์']
            : ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
        const dayName = dayNames[targetDate.getDay()]
        const hours = targetDate.getHours().toString().padStart(2, '0')
        const minutes = targetDate.getMinutes().toString().padStart(2, '0')
        return language === 'th'
            ? `วัน${dayName} เวลา ${hours}:${minutes} น.`
            : `${dayName} at ${hours}:${minutes}`
    }

    // Otherwise show full date
    if (language === 'th') {
        return formatThaiDate(targetDate, false)
    } else {
        return targetDate.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        })
    }
}

/**
 * Check if date is recent (within last hour)
 */
export function isRecent(date: Date | any): boolean {
    let targetDate: Date
    if (date?.toDate && typeof date.toDate === 'function') {
        targetDate = date.toDate()
    } else if (date instanceof Date) {
        targetDate = date
    } else if (date?.seconds) {
        targetDate = new Date(date.seconds * 1000)
    } else {
        return false
    }

    const now = new Date()
    const diffMs = now.getTime() - targetDate.getTime()
    const diffHours = diffMs / (1000 * 60 * 60)

    return diffHours < 1
}
