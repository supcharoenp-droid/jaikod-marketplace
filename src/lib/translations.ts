/**
 * Common translations used across the application
 * For internationalization (i18n) support
 */

export const COMMON_TRANSLATIONS = {
    // Quality issues
    qualityIssues: {
        low_resolution: { th: 'ความละเอียดต่ำ', en: 'Low resolution' },
        bad_aspect_ratio: { th: 'สัดส่วนผิดปกติ', en: 'Unusual aspect ratio' },
        file_too_small: { th: 'ไฟล์เล็กเกินไป', en: 'File too small' },
        blurry: { th: 'ภาพเบลอ', en: 'Blurry image' },
        dark: { th: 'ภาพมืด', en: 'Dark image' },
        overexposed: { th: 'ภาพสว่างเกินไป', en: 'Overexposed' },
    },

    // Status labels
    status: {
        active: { th: 'กำลังขาย', en: 'Active' },
        sold: { th: 'ขายแล้ว', en: 'Sold' },
        expired: { th: 'หมดอายุ', en: 'Expired' },
        draft: { th: 'แบบร่าง', en: 'Draft' },
        pending: { th: 'รอตรวจสอบ', en: 'Pending' },
        rejected: { th: 'ถูกปฏิเสธ', en: 'Rejected' },
        closed: { th: 'ปิดการขาย', en: 'Closed' },
    },

    // Time units
    time: {
        seconds: { th: 'วินาที', en: 'seconds' },
        minutes: { th: 'นาที', en: 'minutes' },
        hours: { th: 'ชั่วโมง', en: 'hours' },
        days: { th: 'วัน', en: 'days' },
        weeks: { th: 'สัปดาห์', en: 'weeks' },
        months: { th: 'เดือน', en: 'months' },
        years: { th: 'ปี', en: 'years' },
        ago: { th: 'ที่แล้ว', en: 'ago' },
        just_now: { th: 'เมื่อสักครู่', en: 'Just now' },
    },

    // Common actions
    actions: {
        save: { th: 'บันทึก', en: 'Save' },
        cancel: { th: 'ยกเลิก', en: 'Cancel' },
        delete: { th: 'ลบ', en: 'Delete' },
        edit: { th: 'แก้ไข', en: 'Edit' },
        view: { th: 'ดู', en: 'View' },
        share: { th: 'แชร์', en: 'Share' },
        copy: { th: 'คัดลอก', en: 'Copy' },
        search: { th: 'ค้นหา', en: 'Search' },
        filter: { th: 'กรอง', en: 'Filter' },
        sort: { th: 'เรียงลำดับ', en: 'Sort' },
        refresh: { th: 'รีเฟรช', en: 'Refresh' },
        more: { th: 'เพิ่มเติม', en: 'More' },
        less: { th: 'แสดงน้อยลง', en: 'Less' },
        confirm: { th: 'ยืนยัน', en: 'Confirm' },
        close: { th: 'ปิด', en: 'Close' },
        back: { th: 'กลับ', en: 'Back' },
        next: { th: 'ถัดไป', en: 'Next' },
        previous: { th: 'ก่อนหน้า', en: 'Previous' },
        submit: { th: 'ส่ง', en: 'Submit' },
        loading: { th: 'กำลังโหลด...', en: 'Loading...' },
        retry: { th: 'ลองอีกครั้ง', en: 'Try again' },
    },

    // Common labels
    labels: {
        price: { th: 'ราคา', en: 'Price' },
        location: { th: 'สถานที่', en: 'Location' },
        category: { th: 'หมวดหมู่', en: 'Category' },
        condition: { th: 'สภาพ', en: 'Condition' },
        description: { th: 'รายละเอียด', en: 'Description' },
        title: { th: 'ชื่อ', en: 'Title' },
        seller: { th: 'ผู้ขาย', en: 'Seller' },
        buyer: { th: 'ผู้ซื้อ', en: 'Buyer' },
        phone: { th: 'เบอร์โทร', en: 'Phone' },
        email: { th: 'อีเมล', en: 'Email' },
        password: { th: 'รหัสผ่าน', en: 'Password' },
        username: { th: 'ชื่อผู้ใช้', en: 'Username' },
        date: { th: 'วันที่', en: 'Date' },
        total: { th: 'รวม', en: 'Total' },
        subtotal: { th: 'รวมย่อย', en: 'Subtotal' },
        shipping: { th: 'ค่าส่ง', en: 'Shipping' },
        free: { th: 'ฟรี', en: 'Free' },
        views: { th: 'ยอดเข้าชม', en: 'Views' },
        likes: { th: 'ถูกใจ', en: 'Likes' },
        followers: { th: 'ผู้ติดตาม', en: 'Followers' },
        rating: { th: 'คะแนน', en: 'Rating' },
        reviews: { th: 'รีวิว', en: 'Reviews' },
    },

    // Messages
    messages: {
        success: { th: 'สำเร็จ!', en: 'Success!' },
        error: { th: 'เกิดข้อผิดพลาด', en: 'An error occurred' },
        warning: { th: 'คำเตือน', en: 'Warning' },
        info: { th: 'ข้อมูล', en: 'Info' },
        confirm_delete: { th: 'ต้องการลบใช่หรือไม่?', en: 'Are you sure you want to delete?' },
        no_results: { th: 'ไม่พบผลลัพธ์', en: 'No results found' },
        loading_error: { th: 'ไม่สามารถโหลดข้อมูลได้', en: 'Failed to load data' },
        network_error: { th: 'ไม่สามารถเชื่อมต่อได้', en: 'Connection failed' },
        session_expired: { th: 'เซสชันหมดอายุ กรุณาเข้าสู่ระบบใหม่', en: 'Session expired. Please sign in again' },
        saved_successfully: { th: 'บันทึกเรียบร้อย', en: 'Saved successfully' },
        deleted_successfully: { th: 'ลบเรียบร้อย', en: 'Deleted successfully' },
        copied: { th: 'คัดลอกแล้ว', en: 'Copied!' },
    },

    // Condition states
    conditions: {
        new: { th: 'มือ 1 ของใหม่', en: 'Brand New' },
        like_new: { th: 'เหมือนใหม่', en: 'Like New' },
        excellent: { th: 'ดีมาก', en: 'Excellent' },
        good: { th: 'ดี', en: 'Good' },
        fair: { th: 'พอใช้', en: 'Fair' },
        poor: { th: 'มีตำหนิ', en: 'Poor' },
    },

    // Shipping options
    shipping: {
        pickup: { th: 'รับเอง', en: 'Pickup' },
        delivery: { th: 'จัดส่ง', en: 'Delivery' },
        both: { th: 'รับเองหรือจัดส่ง', en: 'Pickup or Delivery' },
        free_shipping: { th: 'ส่งฟรี', en: 'Free Shipping' },
        buyer_pays: { th: 'ผู้ซื้อจ่ายค่าส่ง', en: 'Buyer pays shipping' },
    },

    // Payment methods
    payment: {
        cash: { th: 'เงินสด', en: 'Cash' },
        bank_transfer: { th: 'โอนเงิน', en: 'Bank Transfer' },
        credit_card: { th: 'บัตรเครดิต', en: 'Credit Card' },
        promptpay: { th: 'พร้อมเพย์', en: 'PromptPay' },
        installment: { th: 'ผ่อนชำระ', en: 'Installment' },
    },
}

/**
 * Get translated text based on language
 */
export function t(
    category: keyof typeof COMMON_TRANSLATIONS,
    key: string,
    language: 'th' | 'en' = 'th'
): string {
    const cat = COMMON_TRANSLATIONS[category] as Record<string, { th: string; en: string }>
    if (!cat || !cat[key]) return key
    return cat[key][language]
}

/**
 * Format relative time in the specified language
 */
export function formatRelativeTime(date: Date, language: 'th' | 'en' = 'th'): string {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const seconds = Math.floor(diff / 1000)
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)
    const weeks = Math.floor(days / 7)
    const months = Math.floor(days / 30)
    const years = Math.floor(days / 365)

    const time = COMMON_TRANSLATIONS.time

    if (seconds < 60) return time.just_now[language]
    if (minutes === 1) return language === 'th' ? '1 นาทีที่แล้ว' : '1 minute ago'
    if (minutes < 60) return `${minutes} ${time.minutes[language]} ${time.ago[language]}`
    if (hours === 1) return language === 'th' ? '1 ชั่วโมงที่แล้ว' : '1 hour ago'
    if (hours < 24) return `${hours} ${time.hours[language]} ${time.ago[language]}`
    if (days === 1) return language === 'th' ? 'เมื่อวาน' : 'Yesterday'
    if (days < 7) return `${days} ${time.days[language]} ${time.ago[language]}`
    if (weeks === 1) return language === 'th' ? '1 สัปดาห์ที่แล้ว' : '1 week ago'
    if (weeks < 4) return `${weeks} ${time.weeks[language]} ${time.ago[language]}`
    if (months === 1) return language === 'th' ? '1 เดือนที่แล้ว' : '1 month ago'
    if (months < 12) return `${months} ${time.months[language]} ${time.ago[language]}`
    if (years === 1) return language === 'th' ? '1 ปีที่แล้ว' : '1 year ago'
    return `${years} ${time.years[language]} ${time.ago[language]}`
}

/**
 * Format price in Thai Baht
 */
export function formatPrice(price: number, options?: { showCurrency?: boolean }): string {
    const formatted = new Intl.NumberFormat('th-TH').format(price)
    return options?.showCurrency ? `฿${formatted}` : formatted
}

export default COMMON_TRANSLATIONS
