/**
 * Distance Calculator Utility
 * 
 * Calculates distance between two points using Haversine formula
 * and manages user location state
 */

// Province coordinates (centroids) for distance calculation
export const PROVINCE_COORDINATES: Record<string, { lat: number; lng: number }> = {
    'กรุงเทพมหานคร': { lat: 13.7563, lng: 100.5018 },
    'กรุงเทพ': { lat: 13.7563, lng: 100.5018 },
    'นนทบุรี': { lat: 13.8622, lng: 100.5144 },
    'ปทุมธานี': { lat: 14.0208, lng: 100.5250 },
    'สมุทรปราการ': { lat: 13.5991, lng: 100.5998 },
    'สมุทรสาคร': { lat: 13.5475, lng: 100.2745 },
    'นครปฐม': { lat: 13.8199, lng: 100.0645 },
    'ชลบุรี': { lat: 13.3611, lng: 100.9847 },
    'ระยอง': { lat: 12.6814, lng: 101.2816 },
    'เชียงใหม่': { lat: 18.7883, lng: 98.9853 },
    'เชียงราย': { lat: 19.9107, lng: 99.8406 },
    'ภูเก็ต': { lat: 7.8804, lng: 98.3923 },
    'กระบี่': { lat: 8.0863, lng: 98.9063 },
    'สุราษฎร์ธานี': { lat: 9.1382, lng: 99.3217 },
    'ขอนแก่น': { lat: 16.4322, lng: 102.8236 },
    'อุดรธานี': { lat: 17.4156, lng: 102.7874 },
    'นครราชสีมา': { lat: 14.9799, lng: 102.0978 },
    'อยุธยา': { lat: 14.3532, lng: 100.5685 },
    'พระนครศรีอยุธยา': { lat: 14.3532, lng: 100.5685 },
}

/**
 * Calculate distance between two coordinates using Haversine formula
 * @returns Distance in kilometers (rounded)
 */
export function calculateDistance(
    lat1: number,
    lng1: number,
    lat2: number,
    lng2: number
): number {
    const R = 6371 // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180
    const dLng = (lng2 - lng1) * Math.PI / 180
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLng / 2) * Math.sin(dLng / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return Math.round(R * c)
}

/**
 * Get user's current location
 * Returns Promise with coordinates or null
 */
export async function getUserLocation(): Promise<{ lat: number; lng: number } | null> {
    // Try to get from localStorage first
    const savedLoc = localStorage.getItem('user_location')
    if (savedLoc) {
        try {
            const parsed = JSON.parse(savedLoc)
            if (parsed.lat && parsed.lng && parsed.timestamp) {
                // Check if less than 1 hour old
                const age = Date.now() - parsed.timestamp
                if (age < 3600000) { // 1 hour
                    return { lat: parsed.lat, lng: parsed.lng }
                }
            }
        } catch (e) {
            // Ignore parse errors
        }
    }

    // Try to get GPS location
    if (typeof navigator !== 'undefined' && 'geolocation' in navigator) {
        try {
            const position = await new Promise<GeolocationPosition>((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(resolve, reject, {
                    timeout: 5000,
                    maximumAge: 300000 // 5 minutes
                })
            })

            const coords = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            }

            // Save to localStorage
            localStorage.setItem('user_location', JSON.stringify({
                ...coords,
                timestamp: Date.now()
            }))

            return coords
        } catch (error) {
            console.log('Could not get GPS location:', error)
        }
    }

    // Fallback to Bangkok
    return { lat: 13.7563, lng: 100.5018 }
}

/**
 * Calculate distance from user to product location
 * @param productProvince - Product's province
 * @param userLocation - User's coordinates (optional, will fetch if not provided)
 * @returns Distance in km or null if can't calculate
 */
export async function calculateDistanceToProduct(
    productProvince?: string,
    userLocation?: { lat: number; lng: number }
): Promise<number | null> {
    if (!productProvince) return null

    // Get user location if not provided
    const userLoc = userLocation || await getUserLocation()
    if (!userLoc) return null

    // Get product coordinates from province
    const productCoords = PROVINCE_COORDINATES[productProvince]
    if (!productCoords) return null

    // Calculate distance
    return calculateDistance(
        userLoc.lat,
        userLoc.lng,
        productCoords.lat,
        productCoords.lng
    )
}
