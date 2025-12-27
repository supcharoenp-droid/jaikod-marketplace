/**
 * Location Localization Helper
 * 
 * แปลงชื่อจังหวัด/อำเภอ จากภาษาอังกฤษเป็นภาษาไทย
 * เพื่อให้แสดงผลสอดคล้องกันทั้งระบบ
 */

// English to Thai province mapping
export const PROVINCE_EN_TO_TH: Record<string, string> = {
    // Major Cities
    'Bangkok': 'กรุงเทพมหานคร',
    'Chiang Mai': 'เชียงใหม่',
    'Chiang Rai': 'เชียงราย',
    'Phuket': 'ภูเก็ต',
    'Pattaya': 'พัทยา',
    'Chonburi': 'ชลบุรี',
    'Nonthaburi': 'นนทบุรี',
    'Pathum Thani': 'ปทุมธานี',
    'Samut Prakan': 'สมุทรปราการ',
    'Nakhon Ratchasima': 'นครราชสีมา',
    'Khon Kaen': 'ขอนแก่น',
    'Udon Thani': 'อุดรธานี',
    'Songkhla': 'สงขลา',
    'Rayong': 'ระยอง',
    'Surat Thani': 'สุราษฎร์ธานี',
    'Phitsanulok': 'พิษณุโลก',
    'Nakhon Pathom': 'นครปฐม',
    'Ayutthaya': 'พระนครศรีอยุธยา',
    'Phra Nakhon Si Ayutthaya': 'พระนครศรีอยุธยา',
    'Ubon Ratchathani': 'อุบลราชธานี',
    'Nakhon Si Thammarat': 'นครศรีธรรมราช',
    'Lopburi': 'ลพบุรี',
    'Saraburi': 'สระบุรี',
    'Krabi': 'กระบี่',
    'Kanchanaburi': 'กาญจนบุรี',
    'Lampang': 'ลำปาง',
    'Lamphun': 'ลำพูน',
    'Mae Hong Son': 'แม่ฮ่องสอน',
    'Nan': 'น่าน',
    'Phrae': 'แพร่',
    'Sukhothai': 'สุโขทัย',
    'Tak': 'ตาก',
    'Kamphaeng Phet': 'กำแพงเพชร',
    'Phetchabun': 'เพชรบูรณ์',
    'Roi Et': 'ร้อยเอ็ด',
    'Kalasin': 'กาฬสินธุ์',
    'Sakon Nakhon': 'สกลนคร',
    'Nakhon Phanom': 'นครพนม',
    'Mukdahan': 'มุกดาหาร',
    'Yasothon': 'ยโสธร',
    'Amnat Charoen': 'อำนาจเจริญ',
    'Bueng Kan': 'บึงกาฬ',
    'Loei': 'เลย',
    'Nong Khai': 'หนองคาย',
    'Nong Bua Lamphu': 'หนองบัวลำภู',
    'Chaiyaphum': 'ชัยภูมิ',
    'Buriram': 'บุรีรัมย์',
    'Surin': 'สุรินทร์',
    'Sisaket': 'ศรีสะเกษ',
    'Maha Sarakham': 'มหาสารคาม',
    'Hua Hin': 'หัวหิน',
    'Phra Nakhon': 'พระนคร',
    'Hat Yai': 'หาดใหญ่',
    'Korat': 'โคราช',
    // More provinces...
    'Phetchaburi': 'เพชรบุรี',
    'Prachuap Khiri Khan': 'ประจวบคีรีขันธ์',
    'Chumphon': 'ชุมพร',
    'Ranong': 'ระนอง',
    'Phang Nga': 'พังงา',
    'Trang': 'ตรัง',
    'Satun': 'สตูล',
    'Pattani': 'ปัตตานี',
    'Yala': 'ยะลา',
    'Narathiwat': 'นราธิวาส',
    'Samut Sakhon': 'สมุทรสาคร',
    'Samut Songkhram': 'สมุทรสงคราม',
    'Nakhon Nayok': 'นครนายก',
    'Prachinburi': 'ปราจีนบุรี',
    'Sa Kaeo': 'สระแก้ว',
    'Chachoengsao': 'ฉะเชิงเทรา',
    'Chanthaburi': 'จันทบุรี',
    'Trat': 'ตราด',
    'Sing Buri': 'สิงห์บุรี',
    'Ang Thong': 'อ่างทอง',
    'Chai Nat': 'ชัยนาท',
    'Uthai Thani': 'อุทัยธานี',
    'Nakhon Sawan': 'นครสวรรค์',
    'Phichit': 'พิจิตร',
    'Phayao': 'พะเยา',
    'Uttaradit': 'อุตรดิตถ์',
}

// Common amphoe (district) translations
export const AMPHOE_EN_TO_TH: Record<string, string> = {
    // Bangkok Districts
    'Bangkapi': 'บางกะปิ',
    'Bang Kapi': 'บางกะปิ',
    'Chatuchak': 'จตุจักร',
    'Lat Phrao': 'ลาดพร้าว',
    'Huai Khwang': 'ห้วยขวาง',
    'Din Daeng': 'ดินแดง',
    'Ratchathewi': 'ราชเทวี',
    'Phaya Thai': 'พญาไท',
    'Dusit': 'ดุสิต',
    'Phra Nakhon': 'พระนคร',
    'Samphanthawong': 'สัมพันธวงศ์',
    'Pomprap Sattruphai': 'ป้อมปราบศัตรูพ่าย',
    'Pom Prap Sattru Phai': 'ป้อมปราบศัตรูพ่าย',
    'Bang Rak': 'บางรัก',
    'Pathum Wan': 'ปทุมวัน',
    'Sathon': 'สาทร',
    'Bang Sue': 'บางซื่อ',
    'Bang Phlat': 'บางพลัด',
    'Bangkok Noi': 'บางกอกน้อย',
    'Bangkok Yai': 'บางกอกใหญ่',
    'Thon Buri': 'ธนบุรี',
    'Khlong San': 'คลองสาน',
    'Chom Thong': 'จอมทอง',
    'Rat Burana': 'ราษฎร์บูรณะ',
    'Bang Khun Thian': 'บางขุนเทียน',
    'Thawi Watthana': 'ทวีวัฒนา',
    'Taling Chan': 'ตลิ่งชัน',
    'Phasi Charoen': 'ภาษีเจริญ',
    'Nong Khaem': 'หนองแขม',
    'Bang Khae': 'บางแค',
    'Bang Bon': 'บางบอน',
    'Yan Nawa': 'ยานนาวา',
    'Khan Na Yao': 'คันนายาว',
    'Saphan Sung': 'สะพานสูง',
    'Wang Thonglang': 'วังทองหลาง',
    'Khlong Toei': 'คลองเตย',
    'Watthana': 'วัฒนา',
    'Suan Luang': 'สวนหลวง',
    'Prawet': 'ประเวศ',
    'Bang Na': 'บางนา',
    'Phra Khanong': 'พระโขนง',
    'Sai Mai': 'สายไหม',
    'Don Mueang': 'ดอนเมือง',
    'Lak Si': 'หลักสี่',
    'Bang Khen': 'บางเขน',
    'Bueng Kum': 'บึงกุ่ม',
    'Khlong Sam Wa': 'คลองสามวา',
    'Min Buri': 'มีนบุรี',
    'Lat Krabang': 'ลาดกระบัง',
    'Nong Chok': 'หนองจอก',
    // Central districts
    'Muang': 'เมือง',
    'Mueang': 'เมือง',
    'Central': 'เมือง',
}

/**
 * แปลงชื่อจังหวัดเป็นภาษาไทย
 */
export function toThaiProvince(province: string | undefined | null): string {
    if (!province) return ''

    // Already Thai
    if (/[\u0E00-\u0E7F]/.test(province)) {
        return province
    }

    // Try exact match
    const exact = PROVINCE_EN_TO_TH[province]
    if (exact) return exact

    // Try case-insensitive match
    const lowerProvince = province.toLowerCase()
    for (const [en, th] of Object.entries(PROVINCE_EN_TO_TH)) {
        if (en.toLowerCase() === lowerProvince) {
            return th
        }
    }

    // Return original if no match
    return province
}

/**
 * แปลงชื่ออำเภอเป็นภาษาไทย
 */
export function toThaiAmphoe(amphoe: string | undefined | null): string {
    if (!amphoe) return ''

    // Already Thai
    if (/[\u0E00-\u0E7F]/.test(amphoe)) {
        return amphoe
    }

    // Try exact match
    const exact = AMPHOE_EN_TO_TH[amphoe]
    if (exact) return exact

    // Try case-insensitive match
    const lowerAmphoe = amphoe.toLowerCase()
    for (const [en, th] of Object.entries(AMPHOE_EN_TO_TH)) {
        if (en.toLowerCase() === lowerAmphoe) {
            return th
        }
    }

    // Return original if no match
    return amphoe
}

/**
 * Format location consistently
 * Returns: "อำเภอ, จังหวัด" or just "จังหวัด" if no amphoe
 */
export function formatLocation(
    province?: string | null,
    amphoe?: string | null
): string {
    const thaiProvince = toThaiProvince(province)
    const thaiAmphoe = toThaiAmphoe(amphoe)

    if (thaiAmphoe && thaiProvince) {
        return `${thaiAmphoe}, ${thaiProvince}`
    }

    return thaiProvince || 'ไม่ระบุตำแหน่ง'
}

/**
 * Format distance for display
 * Returns formatted distance string with appropriate unit
 */
export function formatDistanceDisplay(
    distance: number | undefined | null,
    language: 'th' | 'en' = 'th'
): { text: string; isNearby: boolean; colorClass: string } | null {
    if (distance === undefined || distance === null || !isFinite(distance)) {
        return null
    }

    const isNearby = distance < 5
    const isMedium = distance >= 5 && distance <= 20

    let text: string
    if (distance < 1) {
        // Show in meters
        const meters = Math.round(distance * 1000)
        text = language === 'th' ? `${meters} ม.` : `${meters} m`
    } else if (distance < 100) {
        // Show with 1 decimal
        text = language === 'th' ? `${distance.toFixed(1)} กม.` : `${distance.toFixed(1)} km`
    } else {
        // Show rounded
        text = language === 'th' ? `${Math.round(distance)} กม.` : `${Math.round(distance)} km`
    }

    let colorClass: string
    if (isNearby) {
        colorClass = 'from-emerald-500 to-green-500'
    } else if (isMedium) {
        colorClass = 'from-amber-500 to-orange-500'
    } else {
        colorClass = 'from-gray-500 to-slate-500'
    }

    return { text, isNearby, colorClass }
}
