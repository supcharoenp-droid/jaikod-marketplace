/**
 * ═══════════════════════════════════════════════════════════════════════════
 * GLOBAL LOCATION & DISTANCE STANDARD ENGINE
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * Central location management for:
 * - Listing location capture & storage
 * - Viewer location handling
 * - Distance calculation
 * - Consistent display formatting
 * 
 * RULES:
 * - Every listing MUST have lat/lng coordinates
 * - Distance uses Haversine formula, rounded to 1 decimal
 * - Viewer location cached per session (NO IP-based fallback)
 * - Display format: "📍 X กม."
 */

import { PROVINCE_CENTROIDS, DISTRICT_CENTROIDS } from './geo/thailand-centroids'

// ═══════════════════════════════════════════════════════════════════════════
// TYPES & INTERFACES
// ═══════════════════════════════════════════════════════════════════════════

export type LocationType = 'district_center' | 'map_pin'
export type LocationAccuracy = 'approximate' | 'precise'

/**
 * Standard location data for a listing
 */
export interface ListingLocation {
    latitude: number
    longitude: number
    location_type: LocationType
    location_accuracy: LocationAccuracy
    location_text: string // Human-readable, e.g. "เมืองเชียงใหม่, เชียงใหม่"
    province?: string
    district?: string
}

/**
 * Viewer location (cached per session)
 */
export interface ViewerLocation {
    latitude: number
    longitude: number
    source: 'gps' | 'manual'
    timestamp: number
    provinceName?: string
}

/**
 * Distance calculation result
 */
export interface DistanceResult {
    distance_km: number    // Rounded to 1 decimal
    is_valid: boolean
    listing_accuracy: LocationAccuracy
}

// ═══════════════════════════════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════════════════════════════

const VIEWER_LOCATION_KEY = 'jaikod_viewer_location'
const SESSION_DURATION_MS = 24 * 60 * 60 * 1000 // 24 hours

// Earth's radius in kilometers
const EARTH_RADIUS_KM = 6371

// ═══════════════════════════════════════════════════════════════════════════
// SECTION 1: LOCATION INPUT (POSTING STAGE)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * MODE 1: Get coordinates from administrative area selection
 * Returns the geographic centroid of the selected district/province
 */
export function getDistrictCenterCoordinates(
    province: string,
    district?: string
): ListingLocation | null {
    // Try district first (more precise)
    if (district && province) {
        const districtKey = `${province}_${district}`
        const districtData = DISTRICT_CENTROIDS[districtKey]
        if (districtData) {
            return {
                latitude: districtData.lat,
                longitude: districtData.lng,
                location_type: 'district_center',
                location_accuracy: 'approximate',
                location_text: `${district}, ${province}`,
                province,
                district
            }
        }
    }

    // Fallback to province centroid
    for (const [id, data] of Object.entries(PROVINCE_CENTROIDS)) {
        if (data.name_th === province || data.name_en === province) {
            return {
                latitude: data.lat,
                longitude: data.lng,
                location_type: 'district_center',
                location_accuracy: 'approximate',
                location_text: province,
                province
            }
        }
    }

    return null
}

/**
 * MODE 2: Create location from map pin coordinates
 */
export function createMapPinLocation(
    latitude: number,
    longitude: number,
    locationText: string,
    province?: string,
    district?: string
): ListingLocation {
    return {
        latitude,
        longitude,
        location_type: 'map_pin',
        location_accuracy: 'precise',
        location_text: locationText || `${district || ''}, ${province || ''}`.trim(),
        province,
        district
    }
}

/**
 * Validate listing has required location data
 * RULE: A listing CANNOT be published unless latitude AND longitude are set
 */
export function validateListingLocation(location: Partial<ListingLocation>): boolean {
    return (
        typeof location.latitude === 'number' &&
        typeof location.longitude === 'number' &&
        !isNaN(location.latitude) &&
        !isNaN(location.longitude) &&
        location.latitude >= -90 && location.latitude <= 90 &&
        location.longitude >= -180 && location.longitude <= 180
    )
}

// ═══════════════════════════════════════════════════════════════════════════
// SECTION 3: VIEWER LOCATION HANDLING
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Get cached viewer location (if still valid within session)
 */
export function getCachedViewerLocation(): ViewerLocation | null {
    if (typeof window === 'undefined') return null

    try {
        const cached = localStorage.getItem(VIEWER_LOCATION_KEY)
        if (!cached) return null

        const parsed: ViewerLocation = JSON.parse(cached)

        // Check if still valid (within session duration)
        if (Date.now() - parsed.timestamp > SESSION_DURATION_MS) {
            localStorage.removeItem(VIEWER_LOCATION_KEY)
            return null
        }

        return parsed
    } catch {
        return null
    }
}

/**
 * Cache viewer location for session
 */
export function cacheViewerLocation(location: Omit<ViewerLocation, 'timestamp'>): void {
    if (typeof window === 'undefined') return

    const data: ViewerLocation = {
        ...location,
        timestamp: Date.now()
    }

    try {
        localStorage.setItem(VIEWER_LOCATION_KEY, JSON.stringify(data))
    } catch {
        console.warn('[LocationEngine] Failed to cache viewer location')
    }
}

/**
 * Request viewer's GPS location (once per session)
 * NEVER uses IP-based geolocation
 */
export async function requestViewerLocation(): Promise<ViewerLocation | null> {
    // Check cache first
    const cached = getCachedViewerLocation()
    if (cached) {
        console.log('[LocationEngine] Using cached viewer location:', cached.source)
        return cached
    }

    // Request GPS
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
        console.log('[LocationEngine] Geolocation not supported')
        return null
    }

    return new Promise((resolve) => {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const location: ViewerLocation = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    source: 'gps',
                    timestamp: Date.now()
                }

                // Validate coordinates are within Thailand
                if (isWithinThailand(location.latitude, location.longitude)) {
                    cacheViewerLocation(location)
                    console.log('[LocationEngine] GPS location obtained and cached')
                    resolve(location)
                } else {
                    console.warn('[LocationEngine] GPS location outside Thailand bounds')
                    resolve(null)
                }
            },
            (error) => {
                console.warn('[LocationEngine] GPS request denied or failed:', error.message)
                resolve(null)
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 60000
            }
        )
    })
}

/**
 * Set viewer location manually (from province selector)
 */
export function setManualViewerLocation(province: string, district?: string): ViewerLocation | null {
    const coords = getDistrictCenterCoordinates(province, district)
    if (!coords) return null

    const location: ViewerLocation = {
        latitude: coords.latitude,
        longitude: coords.longitude,
        source: 'manual',
        timestamp: Date.now(),
        provinceName: province
    }

    cacheViewerLocation(location)
    console.log('[LocationEngine] Manual location set:', province, district || '')
    return location
}

/**
 * Clear viewer location cache
 */
export function clearViewerLocation(): void {
    if (typeof window !== 'undefined') {
        localStorage.removeItem(VIEWER_LOCATION_KEY)
    }
}

// ═══════════════════════════════════════════════════════════════════════════
// SECTION 4: DISTANCE CALCULATION
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Calculate distance using Haversine formula
 * Returns distance in kilometers, rounded to 1 decimal place
 */
export function calculateDistance(
    point1: { latitude: number; longitude: number },
    point2: { latitude: number; longitude: number }
): number {
    const lat1Rad = toRadians(point1.latitude)
    const lat2Rad = toRadians(point2.latitude)
    const deltaLat = toRadians(point2.latitude - point1.latitude)
    const deltaLng = toRadians(point2.longitude - point1.longitude)

    const a = Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
        Math.cos(lat1Rad) * Math.cos(lat2Rad) *
        Math.sin(deltaLng / 2) * Math.sin(deltaLng / 2)

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

    const distance = EARTH_RADIUS_KM * c

    // Round to 1 decimal place
    return Math.round(distance * 10) / 10
}

/**
 * Calculate distance from viewer to listing
 * Returns null if viewer location is unavailable
 */
export function calculateDistanceToListing(
    listing: ListingLocation | { latitude: number; longitude: number },
    viewerLocation: ViewerLocation | null
): DistanceResult | null {
    // No viewer location = no distance display
    if (!viewerLocation) return null

    // Validate listing has coordinates
    if (!listing.latitude || !listing.longitude) return null

    const distance_km = calculateDistance(
        { latitude: viewerLocation.latitude, longitude: viewerLocation.longitude },
        { latitude: listing.latitude, longitude: listing.longitude }
    )

    return {
        distance_km,
        is_valid: true,
        listing_accuracy: (listing as ListingLocation).location_accuracy || 'approximate'
    }
}

// ═══════════════════════════════════════════════════════════════════════════
// SECTION 5: GLOBAL DISPLAY STANDARD
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Format distance for display
 * Format: "📍 X กม." or "📍 X km"
 */
export function formatDistanceDisplay(
    distance_km: number,
    language: 'th' | 'en' = 'th'
): string {
    if (distance_km < 1) {
        // Less than 1 km - show as meters
        const meters = Math.round(distance_km * 1000)
        return language === 'th' ? `${meters} ม.` : `${meters}m`
    }

    if (distance_km < 10) {
        // Under 10 km - show 1 decimal
        return language === 'th'
            ? `${distance_km.toFixed(1)} กม.`
            : `${distance_km.toFixed(1)} km`
    }

    // 10+ km - show whole number
    const rounded = Math.round(distance_km)
    return language === 'th' ? `${rounded} กม.` : `${rounded} km`
}

/**
 * Get color class for distance badge
 * Green = close, Yellow = medium, Gray = far
 */
export function getDistanceColorClass(distance_km: number): string {
    if (distance_km <= 5) return 'bg-green-600/80'
    if (distance_km <= 20) return 'bg-green-500/70'
    if (distance_km <= 50) return 'bg-blue-500/70'
    if (distance_km <= 100) return 'bg-yellow-500/70'
    if (distance_km <= 300) return 'bg-orange-500/70'
    return 'bg-gray-600/70'
}

/**
 * Format location text for display
 */
export function formatLocationText(
    province?: string,
    district?: string,
    language: 'th' | 'en' = 'th'
): string {
    if (district && province) {
        return `${district}, ${province}`
    }
    return province || (language === 'th' ? 'ไม่ระบุ' : 'Unknown')
}

// ═══════════════════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════

function toRadians(degrees: number): number {
    return degrees * (Math.PI / 180)
}

function isWithinThailand(lat: number, lng: number): boolean {
    // Thailand bounds: ~5.6°N to ~20.5°N, ~97.3°E to ~105.6°E
    return lat >= 5.5 && lat <= 21.0 && lng >= 97.0 && lng <= 106.0
}

// ═══════════════════════════════════════════════════════════════════════════
// NOTE: Types are already exported via interface declarations above
// Use: import { ViewerLocation, ListingLocation, DistanceResult } from '@/lib/location-engine'
// ═══════════════════════════════════════════════════════════════════════════

