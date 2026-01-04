/**
 * Geolocation Service
 * Calculate distance between two locations
 * 
 * ✅ ใช้ข้อมูลพิกัดจาก thailand-centroids.ts
 * ✅ รองรับทั้งระดับจังหวัดและอำเภอ
 */

import { PROVINCE_CENTROIDS, DISTRICT_CENTROIDS } from '@/lib/geo/thailand-centroids'

export interface Location {
    latitude: number
    longitude: number
}

/**
 * Calculate distance between two points using Haversine formula
 * Returns distance in kilometers
 */
export function calculateDistance(
    from: Location,
    to: Location
): number {
    const R = 6371 // Earth's radius in km
    const dLat = toRad(to.latitude - from.latitude)
    const dLon = toRad(to.longitude - from.longitude)

    const lat1 = toRad(from.latitude)
    const lat2 = toRad(to.latitude)

    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    const distance = R * c

    return Math.round(distance * 10) / 10 // Round to 1 decimal
}

function toRad(degrees: number): number {
    return (degrees * Math.PI) / 180
}

/**
 * Format distance for display
 */
export function formatDistance(km: number): string {
    if (km < 1) {
        return `${Math.round(km * 1000)} ม.`
    } else if (km < 10) {
        return `${km.toFixed(1)} กม.`
    } else {
        return `${Math.round(km)} กม.`
    }
}

const STORAGE_KEY = 'jaikod_user_location'

/**
 * Get cached user location from localStorage
 */
function getCachedUserLocation(): Location | null {
    if (typeof window === 'undefined') return null

    try {
        const stored = localStorage.getItem(STORAGE_KEY)
        if (stored) {
            const parsed = JSON.parse(stored)
            // Check if not too old (30 days) and has coordinates
            if (parsed.latitude && parsed.longitude) {
                if (parsed.timestamp && Date.now() - parsed.timestamp < 30 * 24 * 60 * 60 * 1000) {
                    console.log('[Geolocation] Using cached location:', parsed.source || 'unknown', parsed.provinceName || '')
                    return {
                        latitude: parsed.latitude,
                        longitude: parsed.longitude
                    }
                }
            }
        }
    } catch (e) {
        console.warn('[Geolocation] Failed to parse cached location')
    }
    return null
}

/**
 * Get user's current location
 * Priority: Cached Manual > GPS > Cached Any
 */
export async function getUserLocation(): Promise<Location | null> {
    // 1. Try cached location first (especially manual ones)
    const cached = getCachedUserLocation()
    if (cached) {
        return cached
    }

    // 2. Try GPS
    return new Promise((resolve) => {
        if (typeof navigator === 'undefined' || !navigator.geolocation) {
            console.warn('[Geolocation] Geolocation not supported')
            resolve(null)
            return
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                console.log('[Geolocation] GPS success:', position.coords.latitude, position.coords.longitude)
                resolve({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                })
            },
            (error) => {
                console.warn('[Geolocation] GPS error:', error.message)
                resolve(null)
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 60000 // 1 minute cache
            }
        )
    })
}

/**
 * Province name to ID mapping for lookup in centroids database
 * เพื่อ map ชื่อจังหวัดเป็น ID สำหรับ lookup
 */
const PROVINCE_NAME_TO_ID: Record<string, string> = {
    // ภาคกลาง
    'กรุงเทพมหานคร': '10',
    'กรุงเทพ': '10',
    'กทม': '10',
    'สมุทรปราการ': '11',
    'นนทบุรี': '12',
    'ปทุมธานี': '13',
    'พระนครศรีอยุธยา': '14',
    'อยุธยา': '14',
    'อ่างทอง': '15',
    'ลพบุรี': '16',
    'สิงห์บุรี': '17',
    'ชัยนาท': '18',
    'สระบุรี': '19',

    // ภาคตะวันออก
    'ชลบุรี': '20',
    'ระยอง': '21',
    'จันทบุรี': '22',
    'ตราด': '23',
    'ฉะเชิงเทรา': '24',
    'ปราจีนบุรี': '25',
    'นครนายก': '26',
    'สระแก้ว': '27',

    // ภาคตะวันออกเฉียงเหนือ
    'นครราชสีมา': '30',
    'โคราช': '30',
    'บุรีรัมย์': '31',
    'สุรินทร์': '32',
    'ศรีสะเกษ': '33',
    'อุบลราชธานี': '34',
    'ยโสธร': '35',
    'ชัยภูมิ': '36',
    'อำนาจเจริญ': '37',
    'บึงกาฬ': '38',
    'หนองบัวลำภู': '39',
    'ขอนแก่น': '40',
    'อุดรธานี': '41',
    'เลย': '42',
    'หนองคาย': '43',
    'มหาสารคาม': '44',
    'ร้อยเอ็ด': '45',
    'กาฬสินธุ์': '46',
    'สกลนคร': '47',
    'นครพนม': '48',
    'มุกดาหาร': '49',

    // ภาคเหนือ
    'เชียงใหม่': '50',
    'ลำพูน': '51',
    'ลำปาง': '52',
    'อุตรดิตถ์': '53',
    'แพร่': '54',
    'น่าน': '55',
    'พะเยา': '56',
    'เชียงราย': '57',
    'แม่ฮ่องสอน': '58',

    // ภาคตะวันตก
    'นครสวรรค์': '60',
    'อุทัยธานี': '61',
    'กำแพงเพชร': '62',
    'ตาก': '63',
    'สุโขทัย': '64',
    'พิษณุโลก': '65',
    'พิจิตร': '66',
    'เพชรบูรณ์': '67',
    'ราชบุรี': '70',
    'กาญจนบุรี': '71',
    'สุพรรณบุรี': '72',
    'นครปฐม': '73',
    'สมุทรสาคร': '74',
    'สมุทรสงคราม': '75',
    'เพชรบุรี': '76',
    'ประจวบคีรีขันธ์': '77',

    // ภาคใต้
    'นครศรีธรรมราช': '80',
    'กระบี่': '81',
    'พังงา': '82',
    'ภูเก็ต': '83',
    'สุราษฎร์ธานี': '84',
    'ระนอง': '85',
    'ชุมพร': '86',
    'สงขลา': '90',
    'สตูล': '91',
    'ตรัง': '92',
    'พัทลุง': '93',
    'ปัตตานี': '94',
    'ยะลา': '95',
    'นราธิวาส': '96'
}

/**
 * Get coordinates for a province (by name)
 * ค้นหาพิกัดจากชื่อจังหวัด
 */
export function getProvinceCoordinates(provinceName: string): Location | null {
    // Clean up province name
    const cleanName = provinceName.trim().replace(/จังหวัด|จ\./g, '').trim()

    // Try to find province ID
    const provinceId = PROVINCE_NAME_TO_ID[cleanName]

    if (provinceId && PROVINCE_CENTROIDS[provinceId]) {
        const centroid = PROVINCE_CENTROIDS[provinceId]
        return {
            latitude: centroid.lat,
            longitude: centroid.lng
        }
    }

    // Fallback: Try matching by name in centroids
    for (const [id, data] of Object.entries(PROVINCE_CENTROIDS)) {
        if (data.name_th === cleanName || data.name_en.toLowerCase() === cleanName.toLowerCase()) {
            return {
                latitude: data.lat,
                longitude: data.lng
            }
        }
    }

    return null
}

/**
 * Get coordinates for a district (by name and province)
 * ค้นหาพิกัดจากชื่ออำเภอ + จังหวัด
 */
export function getDistrictCoordinates(districtName: string, provinceName?: string): Location | null {
    // Clean up names
    const cleanDistrict = districtName.trim().replace(/อำเภอ|อ\.|เขต/g, '').trim()

    // Try to find in district centroids
    for (const [id, data] of Object.entries(DISTRICT_CENTROIDS)) {
        const districtClean = data.name_th.replace(/อำเภอ|อ\.|เขต/g, '').trim()

        if (districtClean === cleanDistrict || data.name_th.includes(cleanDistrict)) {
            // If province specified, verify it matches
            if (provinceName) {
                const provinceId = PROVINCE_NAME_TO_ID[provinceName.replace(/จังหวัด|จ\./g, '').trim()]
                if (provinceId && data.province_id !== provinceId) continue
            }

            return {
                latitude: data.lat,
                longitude: data.lng
            }
        }
    }

    // Fallback to province coordinates
    if (provinceName) {
        return getProvinceCoordinates(provinceName)
    }

    return null
}

/**
 * Get coordinates for a location (district or province)
 * Smart lookup - tries district first, then province
 */
export function getLocationCoordinates(
    provinceName?: string,
    districtName?: string
): { location: Location | null; accuracy: 'exact' | 'district' | 'province' | 'unknown' } {
    // Try district first (more accurate)
    if (districtName && provinceName) {
        const districtLoc = getDistrictCoordinates(districtName, provinceName)
        if (districtLoc) {
            return { location: districtLoc, accuracy: 'district' }
        }
    }

    // Fall back to province
    if (provinceName) {
        const provinceLoc = getProvinceCoordinates(provinceName)
        if (provinceLoc) {
            return { location: provinceLoc, accuracy: 'province' }
        }
    }

    return { location: null, accuracy: 'unknown' }
}

/**
 * Calculate distance from user to product
 * @param productProvince - Province name for fallback coordinates
 * @param productLat - Optional exact latitude
 * @param productLng - Optional exact longitude
 * @param productDistrict - Optional district name for more accurate fallback
 */
export async function calculateDistanceToProduct(
    productProvince: string,
    productLat?: number,
    productLng?: number,
    productDistrict?: string
): Promise<number | null> {
    const userLocation = await getUserLocation()
    if (!userLocation) return null

    // Priority 1: Use exact coordinates if provided
    if (productLat && productLng) {
        return calculateDistance(userLocation, {
            latitude: productLat,
            longitude: productLng
        })
    }

    // Priority 2: Try district then province
    const { location: productLocation } = getLocationCoordinates(productProvince, productDistrict)
    if (!productLocation) {
        console.warn(`[Geolocation] No coordinates found for: ${productDistrict || ''}, ${productProvince}`)
        return null
    }

    return calculateDistance(userLocation, productLocation)
}
