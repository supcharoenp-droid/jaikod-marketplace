/**
 * Geolocation Service
 * Calculate distance between two locations
 */

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

/**
 * Get user's current location
 */
export async function getUserLocation(): Promise<Location | null> {
    return new Promise((resolve) => {
        if (!navigator.geolocation) {
            console.warn('Geolocation not supported')
            resolve(null)
            return
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                resolve({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                })
            },
            (error) => {
                console.warn('Error getting location:', error)
                resolve(null)
            },
            {
                enableHighAccuracy: false,
                timeout: 5000,
                maximumAge: 300000 // 5 minutes
            }
        )
    })
}

/**
 * Approximate coordinates for Thai provinces
 * For production, use a proper geocoding service
 */
export const PROVINCE_COORDINATES: Record<string, Location> = {
    'กรุงเทพมหานคร': { latitude: 13.7563, longitude: 100.5018 },
    'เชียงใหม่': { latitude: 18.7883, longitude: 98.9853 },
    'ภูเก็ต': { latitude: 7.8804, longitude: 98.3923 },
    'ขอนแก่น': { latitude: 16.4322, longitude: 102.8236 },
    'นครราชสีมา': { latitude: 14.9799, longitude: 102.0977 },
    'สงขลา': { latitude: 7.1756, longitude: 100.6144 },
    'ชลบุรี': { latitude: 13.3611, longitude: 100.9847 },
    'นนทบุรี': { latitude: 13.8621, longitude: 100.5144 },
    'ปทุมธานี': { latitude: 14.0208, longitude: 100.5250 },
    'สมุทรปราการ': { latitude: 13.5990, longitude: 100.5998 },
    'ระยอง': { latitude: 12.6828, longitude: 101.2816 },
    'เชียงราย': { latitude: 19.9086, longitude: 99.8325 },
    'สุราษฎร์ธานี': { latitude: 9.1482, longitude: 99.3296 },
    'อุดรธานี': { latitude: 17.4138, longitude: 102.7872 },
    'พิษณุโลก': { latitude: 16.8211, longitude: 100.2659 },
    'นครปฐม': { latitude: 13.8188, longitude: 100.0373 },
    'พระนครศรีอยุธยา': { latitude: 14.3532, longitude: 100.5684 },
    'อุบลราชธานี': { latitude: 15.2287, longitude: 104.8564 },
    'นครศรีธรรมราช': { latitude: 8.4309, longitude: 99.9631 },
    'ลพบุรี': { latitude: 14.7995, longitude: 100.6533 },
    'สระบุรี': { latitude: 14.5289, longitude: 100.9101 },
}

/**
 * Get coordinates for a province
 */
export function getProvinceCoordinates(province: string): Location | null {
    return PROVINCE_COORDINATES[province] || null
}

/**
 * Calculate distance from user to product
 */
export async function calculateDistanceToProduct(
    productProvince: string
): Promise<number | null> {
    const userLocation = await getUserLocation()
    if (!userLocation) return null

    const productLocation = getProvinceCoordinates(productProvince)
    if (!productLocation) return null

    return calculateDistance(userLocation, productLocation)
}
