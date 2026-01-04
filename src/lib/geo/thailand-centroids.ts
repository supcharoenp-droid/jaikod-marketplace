/**
 * Thailand Geographic Centroids Database
 * 
 * พิกัดกลางสำหรับจังหวัดและอำเภอในประเทศไทย
 * ใช้สำหรับคำนวณระยะทางเมื่อไม่มี GPS pin
 */

// Province Centroids (77 provinces)
export const PROVINCE_CENTROIDS: Record<string, { lat: number; lng: number; name_th: string; name_en: string }> = {
    // ภาคกลาง
    "10": { lat: 13.7563, lng: 100.5018, name_th: "กรุงเทพมหานคร", name_en: "Bangkok" },
    "11": { lat: 13.8058, lng: 100.0517, name_th: "สมุทรปราการ", name_en: "Samut Prakan" },
    "12": { lat: 13.8620, lng: 100.5149, name_th: "นนทบุรี", name_en: "Nonthaburi" },
    "13": { lat: 14.0208, lng: 100.5231, name_th: "ปทุมธานี", name_en: "Pathum Thani" },
    "14": { lat: 14.3532, lng: 100.5686, name_th: "พระนครศรีอยุธยา", name_en: "Phra Nakhon Si Ayutthaya" },
    "15": { lat: 14.8054, lng: 100.6549, name_th: "อ่างทอง", name_en: "Ang Thong" },
    "16": { lat: 14.7914, lng: 100.6134, name_th: "ลพบุรี", name_en: "Lopburi" },
    "17": { lat: 14.8098, lng: 100.2039, name_th: "สิงห์บุรี", name_en: "Sing Buri" },
    "18": { lat: 15.1856, lng: 100.1253, name_th: "ชัยนาท", name_en: "Chai Nat" },
    "19": { lat: 14.8016, lng: 100.6545, name_th: "สระบุรี", name_en: "Saraburi" },

    // ภาคเหนือ
    "50": { lat: 18.7883, lng: 98.9853, name_th: "เชียงใหม่", name_en: "Chiang Mai" },
    "51": { lat: 18.4310, lng: 99.5011, name_th: "ลำพูน", name_en: "Lamphun" },
    "52": { lat: 18.2855, lng: 99.4888, name_th: "ลำปาง", name_en: "Lampang" },
    "53": { lat: 17.5642, lng: 99.0073, name_th: "อุตรดิตถ์", name_en: "Uttaradit" },
    "54": { lat: 18.1446, lng: 100.1400, name_th: "แพร่", name_en: "Phrae" },
    "55": { lat: 18.8412, lng: 100.7787, name_th: "น่าน", name_en: "Nan" },
    "56": { lat: 19.1587, lng: 99.8976, name_th: "พะเยา", name_en: "Phayao" },
    "57": { lat: 19.9104, lng: 99.8325, name_th: "เชียงราย", name_en: "Chiang Rai" },
    "58": { lat: 19.2991, lng: 97.9658, name_th: "แม่ฮ่องสอน", name_en: "Mae Hong Son" },

    // ภาคตะวันออกเฉียงเหนือ
    "30": { lat: 14.9799, lng: 102.0977, name_th: "นครราชสีมา", name_en: "Nakhon Ratchasima" },
    "31": { lat: 14.9951, lng: 103.1029, name_th: "บุรีรัมย์", name_en: "Buri Ram" },
    "32": { lat: 14.8829, lng: 103.4943, name_th: "สุรินทร์", name_en: "Surin" },
    "33": { lat: 15.1186, lng: 104.3267, name_th: "ศรีสะเกษ", name_en: "Si Sa Ket" },
    "34": { lat: 15.2519, lng: 104.8498, name_th: "อุบลราชธานี", name_en: "Ubon Ratchathani" },
    "35": { lat: 15.7909, lng: 104.1502, name_th: "ยโสธร", name_en: "Yasothon" },
    "36": { lat: 15.8700, lng: 102.0169, name_th: "ชัยภูมิ", name_en: "Chaiyaphum" },
    "37": { lat: 15.8619, lng: 104.7519, name_th: "อำนาจเจริญ", name_en: "Amnat Charoen" },
    "38": { lat: 17.1543, lng: 104.1426, name_th: "บึงกาฬ", name_en: "Bueng Kan" },
    "39": { lat: 17.4138, lng: 102.7873, name_th: "หนองบัวลำภู", name_en: "Nong Bua Lam Phu" },
    "40": { lat: 16.4419, lng: 102.8360, name_th: "ขอนแก่น", name_en: "Khon Kaen" },
    "41": { lat: 17.4138, lng: 102.7873, name_th: "อุดรธานี", name_en: "Udon Thani" },
    "42": { lat: 17.8782, lng: 102.7420, name_th: "เลย", name_en: "Loei" },
    "43": { lat: 17.8847, lng: 103.6502, name_th: "หนองคาย", name_en: "Nong Khai" },
    "44": { lat: 16.1847, lng: 103.3020, name_th: "มหาสารคาม", name_en: "Maha Sarakham" },
    "45": { lat: 16.0471, lng: 103.6528, name_th: "ร้อยเอ็ด", name_en: "Roi Et" },
    "46": { lat: 16.7136, lng: 103.0841, name_th: "กาฬสินธุ์", name_en: "Kalasin" },
    "47": { lat: 17.1545, lng: 104.1426, name_th: "สกลนคร", name_en: "Sakon Nakhon" },
    "48": { lat: 17.4004, lng: 104.7764, name_th: "นครพนม", name_en: "Nakhon Phanom" },
    "49": { lat: 16.4265, lng: 104.2289, name_th: "มุกดาหาร", name_en: "Mukdahan" },

    // ภาคตะวันออก
    "20": { lat: 13.3611, lng: 100.9847, name_th: "ชลบุรี", name_en: "Chon Buri" },
    "21": { lat: 12.6803, lng: 101.2677, name_th: "ระยอง", name_en: "Rayong" },
    "22": { lat: 12.6109, lng: 102.1044, name_th: "จันทบุรี", name_en: "Chanthaburi" },
    "23": { lat: 11.8074, lng: 102.6411, name_th: "ตราด", name_en: "Trat" },
    "24": { lat: 13.6913, lng: 101.0779, name_th: "ฉะเชิงเทรา", name_en: "Chachoengsao" },
    "25": { lat: 13.8621, lng: 101.4969, name_th: "ปราจีนบุรี", name_en: "Prachin Buri" },
    "26": { lat: 14.0437, lng: 102.0135, name_th: "นครนายก", name_en: "Nakhon Nayok" },
    "27": { lat: 13.7549, lng: 102.0647, name_th: "สระแก้ว", name_en: "Sa Kaeo" },

    // ภาคตะวันตก
    "60": { lat: 15.7157, lng: 100.1370, name_th: "นครสวรรค์", name_en: "Nakhon Sawan" },
    "61": { lat: 15.3836, lng: 99.5310, name_th: "อุทัยธานี", name_en: "Uthai Thani" },
    "62": { lat: 16.7118, lng: 99.1059, name_th: "กำแพงเพชร", name_en: "Kamphaeng Phet" },
    "63": { lat: 16.8840, lng: 99.1258, name_th: "ตาก", name_en: "Tak" },
    "64": { lat: 17.0109, lng: 99.8265, name_th: "สุโขทัย", name_en: "Sukhothai" },
    "65": { lat: 16.8211, lng: 100.2659, name_th: "พิษณุโลก", name_en: "Phitsanulok" },
    "66": { lat: 16.4385, lng: 100.3479, name_th: "พิจิตร", name_en: "Phichit" },
    "67": { lat: 16.4469, lng: 100.1201, name_th: "เพชรบูรณ์", name_en: "Phetchabun" },
    "70": { lat: 13.5356, lng: 99.8142, name_th: "ราชบุรี", name_en: "Ratchaburi" },
    "71": { lat: 14.0227, lng: 99.5328, name_th: "กาญจนบุรี", name_en: "Kanchanaburi" },
    "72": { lat: 14.0975, lng: 100.0631, name_th: "สุพรรณบุรี", name_en: "Suphan Buri" },
    "73": { lat: 13.8199, lng: 100.0660, name_th: "นครปฐม", name_en: "Nakhon Pathom" },
    "74": { lat: 13.5475, lng: 100.2767, name_th: "สมุทรสาคร", name_en: "Samut Sakhon" },
    "75": { lat: 13.4099, lng: 99.9575, name_th: "สมุทรสงคราม", name_en: "Samut Songkhram" },
    "76": { lat: 13.1058, lng: 99.9312, name_th: "เพชรบุรี", name_en: "Phetchaburi" },
    "77": { lat: 11.8108, lng: 99.7977, name_th: "ประจวบคีรีขันธ์", name_en: "Prachuap Khiri Khan" },

    // ภาคใต้
    "80": { lat: 8.4315, lng: 99.9617, name_th: "นครศรีธรรมราช", name_en: "Nakhon Si Thammarat" },
    "81": { lat: 8.0863, lng: 99.3286, name_th: "กระบี่", name_en: "Krabi" },
    "82": { lat: 8.4411, lng: 98.5265, name_th: "พังงา", name_en: "Phang Nga" },
    "83": { lat: 7.8804, lng: 98.3923, name_th: "ภูเก็ต", name_en: "Phuket" },
    "84": { lat: 9.1382, lng: 99.3219, name_th: "สุราษฎร์ธานี", name_en: "Surat Thani" },
    "85": { lat: 9.9598, lng: 99.0956, name_th: "ระนอง", name_en: "Ranong" },
    "86": { lat: 10.4858, lng: 99.1817, name_th: "ชุมพร", name_en: "Chumphon" },
    "90": { lat: 7.2084, lng: 100.4259, name_th: "สงขลา", name_en: "Songkhla" },
    "91": { lat: 6.8694, lng: 100.4715, name_th: "สตูล", name_en: "Satun" },
    "92": { lat: 7.5615, lng: 99.6113, name_th: "ตรัง", name_en: "Trang" },
    "93": { lat: 7.4659, lng: 99.9715, name_th: "พัทลุง", name_en: "Phatthalung" },
    "94": { lat: 6.6159, lng: 101.2820, name_th: "ปัตตานี", name_en: "Pattani" },
    "95": { lat: 6.4242, lng: 101.8230, name_th: "ยะลา", name_en: "Yala" },
    "96": { lat: 6.1131, lng: 101.7972, name_th: "นราธิวาส", name_en: "Narathiwat" }
}

// Common District Centroids (major districts)
// Full database should have ~900 entries
export const DISTRICT_CENTROIDS: Record<string, { lat: number; lng: number; province_id: string; name_th: string }> = {
    // กรุงเทพมหานคร (50 เขต - sample)
    "1001": { lat: 13.7525, lng: 100.4930, province_id: "10", name_th: "เขตพระนคร" },
    "1002": { lat: 13.7407, lng: 100.5113, province_id: "10", name_th: "เขตดุสิต" },
    "1003": { lat: 13.7563, lng: 100.5018, province_id: "10", name_th: "เขตหนองจอก" },
    "1004": { lat: 13.7271, lng: 100.5275, province_id: "10", name_th: "เขตบางรัก" },
    "1005": { lat: 13.7282, lng: 100.5148, province_id: "10", name_th: "เขตบางเขน" },
    "1006": { lat: 13.7642, lng: 100.5689, province_id: "10", name_th: "เขตบางกะปิ" },
    "1007": { lat: 13.7370, lng: 100.5612, province_id: "10", name_th: "เขตปทุมวัน" },
    "1008": { lat: 13.7119, lng: 100.5594, province_id: "10", name_th: "เขตป้อมปราบศัตรูพ่าย" },
    "1009": { lat: 13.6883, lng: 100.4972, province_id: "10", name_th: "เขตพระโขนง" },
    "1010": { lat: 13.7650, lng: 100.5000, province_id: "10", name_th: "เขตมีนบุรี" },
    "1011": { lat: 13.7300, lng: 100.4980, province_id: "10", name_th: "เขตลาดกระบัง" },
    "1012": { lat: 13.7150, lng: 100.5280, province_id: "10", name_th: "เขตยานนาวา" },
    "1013": { lat: 13.7159, lng: 100.5050, province_id: "10", name_th: "เขตสัมพันธวงศ์" },
    "1014": { lat: 13.7600, lng: 100.4800, province_id: "10", name_th: "เขตพญาไท" },
    "1015": { lat: 13.7700, lng: 100.4650, province_id: "10", name_th: "เขตธนบุรี" },
    "1016": { lat: 13.7400, lng: 100.4550, province_id: "10", name_th: "เขตบางกอกใหญ่" },
    "1017": { lat: 13.7185, lng: 100.4800, province_id: "10", name_th: "เขตห้วยขวาง" },
    "1018": { lat: 13.7400, lng: 100.5500, province_id: "10", name_th: "เขตคลองสาน" },
    "1019": { lat: 13.7015, lng: 100.5055, province_id: "10", name_th: "เขตตลิ่งชัน" },
    "1020": { lat: 13.7200, lng: 100.4700, province_id: "10", name_th: "เขตบางกอกน้อย" },
    "1021": { lat: 13.7600, lng: 100.4200, province_id: "10", name_th: "เขตบางขุนเทียน" },
    "1022": { lat: 13.7100, lng: 100.4600, province_id: "10", name_th: "เขตภาษีเจริญ" },
    "1023": { lat: 13.7300, lng: 100.4250, province_id: "10", name_th: "เขตหนองแขม" },
    "1024": { lat: 13.6900, lng: 100.4800, province_id: "10", name_th: "เขตราษฎร์บูรณะ" },
    "1025": { lat: 13.6700, lng: 100.4650, province_id: "10", name_th: "เขตบางพลัด" },
    "1026": { lat: 13.8600, lng: 100.5900, province_id: "10", name_th: "เขตดินแดง" },
    "1027": { lat: 13.7450, lng: 100.4350, province_id: "10", name_th: "เขตบึงกุ่ม" },
    "1028": { lat: 13.7150, lng: 100.5280, province_id: "10", name_th: "เขตสาทร" },
    "1029": { lat: 13.7100, lng: 100.5100, province_id: "10", name_th: "เขตบางซื่อ" },
    "1030": { lat: 13.8100, lng: 100.6100, province_id: "10", name_th: "เขตจตุจักร" },

    // เชียงราย - sample districts
    "5701": { lat: 19.9104, lng: 99.8325, province_id: "57", name_th: "อ.เมืองเชียงราย" },
    "5702": { lat: 20.1900, lng: 100.1200, province_id: "57", name_th: "อ.เวียงชัย" },
    "5703": { lat: 20.2750, lng: 100.0833, province_id: "57", name_th: "อ.เชียงแสน" },
    "5704": { lat: 20.4292, lng: 99.8826, province_id: "57", name_th: "อ.แม่สาย" },
    "5705": { lat: 20.3500, lng: 100.2700, province_id: "57", name_th: "อ.เชียงของ" },
    "5706": { lat: 19.8500, lng: 100.3200, province_id: "57", name_th: "อ.เทิง" },
    "5707": { lat: 19.7800, lng: 99.6700, province_id: "57", name_th: "อ.พาน" },
    "5708": { lat: 19.5600, lng: 100.2500, province_id: "57", name_th: "อ.ป่าแดด" },
    "5709": { lat: 20.0300, lng: 99.5200, province_id: "57", name_th: "อ.แม่จัน" },
    "5710": { lat: 20.1500, lng: 100.2600, province_id: "57", name_th: "อ.เชียงแสน" },

    // ชัยนาท - sample districts
    "1801": { lat: 15.1856, lng: 100.1253, province_id: "18", name_th: "อ.เมืองชัยนาท" },
    "1802": { lat: 15.1200, lng: 100.2100, province_id: "18", name_th: "อ.มโนรมย์" },
    "1803": { lat: 15.2500, lng: 100.0500, province_id: "18", name_th: "อ.วัดสิงห์" },
    "1804": { lat: 15.0800, lng: 99.9600, province_id: "18", name_th: "อ.สรรพยา" },
    "1805": { lat: 15.2800, lng: 100.2000, province_id: "18", name_th: "อ.สรรคบุรี" },
    "1806": { lat: 15.3500, lng: 100.1200, province_id: "18", name_th: "อ.หันคา" },
    "1807": { lat: 15.0500, lng: 100.1000, province_id: "18", name_th: "อ.หนองมะโมง" },
    "1808": { lat: 15.1000, lng: 100.0300, province_id: "18", name_th: "อ.เนินขาม" }
}

/**
 * Get centroid coordinates for a location
 */
export function getLocationCentroid(
    provinceId?: string | number,
    districtId?: string | number
): { lat: number; lng: number; accuracy: 'exact' | 'district' | 'province' | 'unknown' } | null {
    const pId = provinceId?.toString()
    const dId = districtId?.toString()

    // Try district first (more accurate)
    if (dId && DISTRICT_CENTROIDS[dId]) {
        return {
            ...DISTRICT_CENTROIDS[dId],
            accuracy: 'district'
        }
    }

    // Fall back to province
    if (pId && PROVINCE_CENTROIDS[pId]) {
        return {
            lat: PROVINCE_CENTROIDS[pId].lat,
            lng: PROVINCE_CENTROIDS[pId].lng,
            accuracy: 'province'
        }
    }

    return null
}

/**
 * Calculate distance using Haversine formula
 */
export function calculateDistance(
    lat1: number,
    lng1: number,
    lat2: number,
    lng2: number
): number {
    const R = 6371 // Earth's radius in km
    const dLat = toRad(lat2 - lat1)
    const dLng = toRad(lng2 - lng1)

    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
        Math.sin(dLng / 2) * Math.sin(dLng / 2)

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

    return Math.round(R * c)
}

function toRad(deg: number): number {
    return deg * (Math.PI / 180)
}

/**
 * Get distance display for a listing
 */
export function getDistanceDisplay(
    userLat: number | null,
    userLng: number | null,
    listingLat?: number,
    listingLng?: number,
    provinceId?: string | number,
    districtId?: string | number,
    language: 'th' | 'en' = 'th'
): { text: string; distance: number | null; isApproximate: boolean; color: string } {
    if (!userLat || !userLng) {
        return { text: '', distance: null, isApproximate: false, color: '' }
    }

    let targetLat: number | null = null
    let targetLng: number | null = null
    let isApproximate = false

    // Priority 1: Exact GPS coordinates
    if (listingLat && listingLng) {
        targetLat = listingLat
        targetLng = listingLng
        isApproximate = false
    } else {
        // Priority 2: District/Province centroid
        const centroid = getLocationCentroid(provinceId, districtId)
        if (centroid) {
            targetLat = centroid.lat
            targetLng = centroid.lng
            isApproximate = true
        }
    }

    if (targetLat === null || targetLng === null) {
        return { text: '', distance: null, isApproximate: false, color: '' }
    }

    const distance = calculateDistance(userLat, userLng, targetLat, targetLng)

    // Determine color based on distance
    let color = 'gray'
    if (distance <= 10) color = 'green'
    else if (distance <= 50) color = 'blue'
    else if (distance <= 200) color = 'yellow'
    else if (distance <= 500) color = 'orange'

    // Format text
    let text = ''
    if (distance <= 10) {
        text = language === 'th'
            ? `ใกล้คุณ ${distance} กม.`
            : `Near you ${distance} km`
    } else {
        const prefix = isApproximate ? '~' : ''
        text = `${prefix}${distance} ${language === 'th' ? 'กม.' : 'km'}`
    }

    return { text, distance, isApproximate, color }
}

/**
 * Format distance for badge display
 */
export function formatDistanceBadge(
    distance: number,
    isApproximate: boolean = false
): string {
    const prefix = isApproximate ? '~' : ''

    if (distance < 1) {
        return `${prefix}${Math.round(distance * 1000)} ม.`
    } else if (distance < 10) {
        return `${prefix}${distance.toFixed(1)} กม.`
    } else if (distance >= 1000) {
        return `${prefix}${(distance / 1000).toFixed(0)}k กม.`
    }

    return `${prefix}${Math.round(distance)} กม.`
}
