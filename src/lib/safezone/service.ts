/**
 * SafeZone Service - Scalable Search
 * 
 * Layer Priority:
 * 1. Firebase verified spots (Phase 2)
 * 2. Google Places API (Phase 3)
 * 3. Mock Data (Phase 1 - Current)
 */

import { SafeZoneSpot, SafeZoneLocation, SafeZoneSearchParams, SafeZoneSearchResult } from './types';
import { SAFEZONE_MOCK_DATABASE } from './mock-data';

// ==========================================
// UTILITY FUNCTIONS
// ==========================================

/**
 * Calculate distance between two coordinates (Haversine formula)
 */
export function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(R * c * 10) / 10; // Round to 1 decimal
}

/**
 * Calculate midpoint between two locations
 */
export function calculateMidpoint(loc1: SafeZoneLocation, loc2: SafeZoneLocation): SafeZoneLocation {
    return {
        lat: (loc1.lat + loc2.lat) / 2,
        lng: (loc1.lng + loc2.lng) / 2,
    };
}

/**
 * Get province from coordinates (approximate)
 */
export function getProvinceFromCoords(lat: number, lng: number): string {
    // Simple bounding box check for major regions
    if (lat >= 13.5 && lat <= 14.2 && lng >= 100.3 && lng <= 100.9) return 'กรุงเทพมหานคร';
    if (lat >= 13.7 && lat <= 14.1 && lng >= 100.4 && lng <= 100.6) return 'นนทบุรี';
    if (lat >= 13.9 && lat <= 14.3 && lng >= 100.5 && lng <= 100.8) return 'ปทุมธานี';
    if (lat >= 12.5 && lat <= 13.5 && lng >= 100.7 && lng <= 101.5) return 'ชลบุรี';
    if (lat >= 18.5 && lat <= 19.5 && lng >= 98.5 && lng <= 99.5) return 'เชียงใหม่';
    if (lat >= 16.0 && lat <= 17.0 && lng >= 102.3 && lng <= 103.3) return 'ขอนแก่น';
    if (lat >= 14.5 && lat <= 15.5 && lng >= 101.5 && lng <= 102.5) return 'นครราชสีมา';
    if (lat >= 7.5 && lat <= 8.5 && lng >= 98.0 && lng <= 99.0) return 'ภูเก็ต';
    if (lat >= 6.5 && lat <= 7.5 && lng >= 100.0 && lng <= 101.0) return 'สงขลา';

    // Default to Bangkok for unknown areas
    return 'กรุงเทพมหานคร';
}

// ==========================================
// SEARCH FUNCTIONS
// ==========================================

/**
 * Search SafeZone spots from Mock Database (Phase 1)
 */
export function searchMockSafeZones(params: SafeZoneSearchParams): SafeZoneSearchResult {
    const { buyerLocation, sellerLocation, province, maxDistance = 50, types, limit = 5 } = params;

    let spots = [...SAFEZONE_MOCK_DATABASE];
    let midpoint: SafeZoneLocation | undefined;
    let searchProvince = province;

    // Calculate midpoint if both locations available
    if (buyerLocation && sellerLocation) {
        midpoint = calculateMidpoint(buyerLocation, sellerLocation);
        searchProvince = searchProvince || getProvinceFromCoords(midpoint.lat, midpoint.lng);
    } else if (buyerLocation) {
        searchProvince = searchProvince || getProvinceFromCoords(buyerLocation.lat, buyerLocation.lng);
    } else if (sellerLocation) {
        searchProvince = searchProvince || sellerLocation.province || getProvinceFromCoords(sellerLocation.lat, sellerLocation.lng);
    }

    // If still no province, default to Bangkok (most common)
    if (!searchProvince) {
        searchProvince = 'กรุงเทพมหานคร';
        console.log('[SafeZone] No location provided, defaulting to Bangkok');
    }

    // Filter by province
    let filteredSpots = spots.filter(spot => spot.province === searchProvince);

    // If no spots in province, try nearby provinces or return top spots nationwide
    if (filteredSpots.length === 0) {
        console.log(`[SafeZone] No spots found in ${searchProvince}, returning top nationwide spots`);
        // Return top-rated spots from any province
        filteredSpots = spots
            .sort((a, b) => b.safety_score - a.safety_score)
            .slice(0, limit);
    } else {
        spots = filteredSpots;
    }

    // Filter by types if specified
    if (types && types.length > 0) {
        spots = spots.filter(spot => types.includes(spot.type));
    }

    // Calculate distance from midpoint or buyer location
    const referencePoint = midpoint || buyerLocation || sellerLocation;
    if (referencePoint) {
        spots = spots.map(spot => ({
            ...spot,
            distance: calculateDistance(
                referencePoint.lat,
                referencePoint.lng,
                spot.location.lat,
                spot.location.lng
            )
        }));

        // Filter by max distance
        spots = spots.filter(spot => (spot.distance || 0) <= maxDistance);

        // Sort by distance (nearest first)
        spots.sort((a, b) => (a.distance || 0) - (b.distance || 0));
    } else {
        // Sort by safety score if no location reference
        spots.sort((a, b) => b.safety_score - a.safety_score);
    }

    // Limit results
    spots = spots.slice(0, limit);

    // Ensure we always return at least something
    if (spots.length === 0) {
        console.log('[SafeZone] No spots after filtering, returning top 3 Bangkok spots');
        spots = SAFEZONE_MOCK_DATABASE
            .filter(s => s.province === 'กรุงเทพมหานคร')
            .sort((a, b) => b.safety_score - a.safety_score)
            .slice(0, 3);
    }

    return {
        spots,
        midpoint,
        source: 'mock'
    };
}

/**
 * Search SafeZone spots from Firebase (Phase 2 - Placeholder)
 */
export async function searchFirebaseSafeZones(params: SafeZoneSearchParams): Promise<SafeZoneSearchResult> {
    // TODO: Implement Firebase query
    // const { province, maxDistance, types, limit } = params;
    // const spotsRef = collection(db, 'safezones');
    // const q = query(spotsRef, where('province', '==', province), limit(limit));
    // const snapshot = await getDocs(q);

    console.log('[SafeZone] Firebase search not implemented yet, falling back to mock');
    return searchMockSafeZones(params);
}

/**
 * Search SafeZone spots from Google Places API (Phase 3 - Placeholder)
 */
export async function searchGooglePlacesSafeZones(params: SafeZoneSearchParams): Promise<SafeZoneSearchResult> {
    // TODO: Implement Google Places API
    // const { buyerLocation, sellerLocation } = params;
    // const midpoint = calculateMidpoint(buyerLocation!, sellerLocation!);
    // const response = await fetch(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?
    //     location=${midpoint.lat},${midpoint.lng}&
    //     radius=5000&
    //     type=shopping_mall|police&
    //     key=${process.env.GOOGLE_PLACES_API_KEY}`);

    console.log('[SafeZone] Google Places API not implemented yet, falling back to mock');
    return searchMockSafeZones(params);
}

/**
 * Main search function with layer priority
 */
export async function searchSafeZones(params: SafeZoneSearchParams): Promise<SafeZoneSearchResult> {
    // Phase 1: Use mock data only
    // Phase 2: Try Firebase first, fallback to mock
    // Phase 3: Try Firebase -> Google Places -> Mock

    const USE_FIREBASE = false; // Enable when Firebase is ready
    const USE_GOOGLE_PLACES = false; // Enable when Google API key is configured

    try {
        // Layer 1: Firebase (if enabled)
        if (USE_FIREBASE) {
            const firebaseResult = await searchFirebaseSafeZones(params);
            if (firebaseResult.spots.length > 0) {
                return { ...firebaseResult, source: 'firebase' };
            }
        }

        // Layer 2: Google Places (if enabled)
        if (USE_GOOGLE_PLACES && params.buyerLocation) {
            const googleResult = await searchGooglePlacesSafeZones(params);
            if (googleResult.spots.length > 0) {
                return { ...googleResult, source: 'google_places' };
            }
        }

        // Layer 3: Mock data (always available)
        return searchMockSafeZones(params);

    } catch (error) {
        console.error('[SafeZone] Search error, falling back to mock:', error);
        return searchMockSafeZones(params);
    }
}

// ==========================================
// HELPER EXPORTS
// ==========================================

export { SAFEZONE_MOCK_DATABASE } from './mock-data';
