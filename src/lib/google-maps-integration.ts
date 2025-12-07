/**
 * Google Maps API Integration
 * บริการแผนที่และค้นหาสถานที่ด้วย Google Maps
 */

// ========================================
// Feature Flag Configuration
// ========================================

export interface GoogleMapsConfig {
    enabled: boolean;
    apiKey: string;
    showMap: boolean;          // แสดงแผนที่หรือไม่
    showDirections: boolean;   // แสดงเส้นทางหรือไม่
    showPlaces: boolean;       // แสดงสถานที่ใกล้เคียงหรือไม่
}

export const DEFAULT_MAPS_CONFIG: GoogleMapsConfig = {
    enabled: false,  // ปิดไว้ก่อน รอ API Key
    apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
    showMap: true,
    showDirections: true,
    showPlaces: true
};

// ========================================
// Types
// ========================================

export interface Place {
    place_id: string;
    name: string;
    formatted_address: string;
    geometry: {
        location: {
            lat: number;
            lng: number;
        };
    };
    types: string[];
    rating?: number;
    user_ratings_total?: number;
}

export interface DirectionsResult {
    distance: {
        text: string;
        value: number;  // meters
    };
    duration: {
        text: string;
        value: number;  // seconds
    };
    steps: Array<{
        distance: { text: string; value: number };
        duration: { text: string; value: number };
        instructions: string;
    }>;
}

// ========================================
// Google Maps Loader
// ========================================

let googleMapsLoaded = false;
let googleMapsPromise: Promise<void> | null = null;

/**
 * โหลด Google Maps API
 */
export async function loadGoogleMaps(
    config: GoogleMapsConfig = DEFAULT_MAPS_CONFIG
): Promise<boolean> {
    if (!config.enabled || !config.apiKey) {
        console.warn('Google Maps is disabled or API key is missing');
        return false;
    }

    if (googleMapsLoaded) {
        return true;
    }

    if (googleMapsPromise) {
        await googleMapsPromise;
        return true;
    }

    googleMapsPromise = new Promise((resolve, reject) => {
        if (typeof window === 'undefined') {
            reject(new Error('Window is not defined'));
            return;
        }

        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${config.apiKey}&libraries=places,geometry`;
        script.async = true;
        script.defer = true;

        script.onload = () => {
            googleMapsLoaded = true;
            resolve();
        };

        script.onerror = () => {
            reject(new Error('Failed to load Google Maps'));
        };

        document.head.appendChild(script);
    });

    try {
        await googleMapsPromise;
        return true;
    } catch (error) {
        console.error('Error loading Google Maps:', error);
        return false;
    }
}

// ========================================
// Places API
// ========================================

/**
 * ค้นหาสถานที่ใกล้เคียง
 */
export async function searchNearbyPlaces(
    lat: number,
    lng: number,
    radius: number = 2000,  // meters
    type?: string,
    config: GoogleMapsConfig = DEFAULT_MAPS_CONFIG
): Promise<Place[]> {
    if (!config.enabled || !config.showPlaces) {
        console.warn('Google Maps Places is disabled');
        return [];
    }

    const loaded = await loadGoogleMaps(config);
    if (!loaded || !window.google) {
        return [];
    }

    return new Promise((resolve) => {
        const map = new google.maps.Map(document.createElement('div'));
        const service = new google.maps.places.PlacesService(map);

        const request: google.maps.places.PlaceSearchRequest = {
            location: new google.maps.LatLng(lat, lng),
            radius,
            type
        };

        service.nearbySearch(request, (results, status) => {
            if (status === google.maps.places.PlacesServiceStatus.OK && results) {
                const places: Place[] = results.map(place => ({
                    place_id: place.place_id || '',
                    name: place.name || '',
                    formatted_address: place.vicinity || '',
                    geometry: {
                        location: {
                            lat: place.geometry?.location?.lat() || 0,
                            lng: place.geometry?.location?.lng() || 0
                        }
                    },
                    types: place.types || [],
                    rating: place.rating,
                    user_ratings_total: place.user_ratings_total
                }));
                resolve(places);
            } else {
                console.error('Places search failed:', status);
                resolve([]);
            }
        });
    });
}

/**
 * ค้นหาห้างสรรพสินค้าใกล้เคียง (สำหรับจุดนัดพบ)
 */
export async function findMeetingPlaces(
    lat: number,
    lng: number,
    config: GoogleMapsConfig = DEFAULT_MAPS_CONFIG
): Promise<Place[]> {
    const malls = await searchNearbyPlaces(lat, lng, 3000, 'shopping_mall', config);
    const cafes = await searchNearbyPlaces(lat, lng, 2000, 'cafe', config);
    const stations = await searchNearbyPlaces(lat, lng, 2000, 'transit_station', config);

    return [...malls, ...cafes, ...stations]
        .sort((a, b) => (b.rating || 0) - (a.rating || 0))
        .slice(0, 10);
}

// ========================================
// Directions API
// ========================================

/**
 * คำนวณเส้นทาง
 */
export async function getDirections(
    originLat: number,
    originLng: number,
    destLat: number,
    destLng: number,
    travelMode: 'DRIVING' | 'WALKING' | 'BICYCLING' | 'TRANSIT' = 'DRIVING',
    config: GoogleMapsConfig = DEFAULT_MAPS_CONFIG
): Promise<DirectionsResult | null> {
    if (!config.enabled || !config.showDirections) {
        console.warn('Google Maps Directions is disabled');
        return null;
    }

    const loaded = await loadGoogleMaps(config);
    if (!loaded || !window.google) {
        return null;
    }

    return new Promise((resolve) => {
        const service = new google.maps.DirectionsService();

        const request: google.maps.DirectionsRequest = {
            origin: new google.maps.LatLng(originLat, originLng),
            destination: new google.maps.LatLng(destLat, destLng),
            travelMode: google.maps.TravelMode[travelMode]
        };

        service.route(request, (result, status) => {
            if (status === google.maps.DirectionsStatus.OK && result) {
                const route = result.routes[0];
                const leg = route.legs[0];

                const directionsResult: DirectionsResult = {
                    distance: {
                        text: leg.distance?.text || '',
                        value: leg.distance?.value || 0
                    },
                    duration: {
                        text: leg.duration?.text || '',
                        value: leg.duration?.value || 0
                    },
                    steps: leg.steps?.map(step => ({
                        distance: {
                            text: step.distance?.text || '',
                            value: step.distance?.value || 0
                        },
                        duration: {
                            text: step.duration?.text || '',
                            value: step.duration?.value || 0
                        },
                        instructions: step.instructions || ''
                    })) || []
                };

                resolve(directionsResult);
            } else {
                console.error('Directions request failed:', status);
                resolve(null);
            }
        });
    });
}

// ========================================
// Geocoding API
// ========================================

/**
 * แปลงที่อยู่เป็นพิกัด
 */
export async function geocodeAddress(
    address: string,
    config: GoogleMapsConfig = DEFAULT_MAPS_CONFIG
): Promise<{ lat: number; lng: number } | null> {
    if (!config.enabled) {
        console.warn('Google Maps is disabled');
        return null;
    }

    const loaded = await loadGoogleMaps(config);
    if (!loaded || !window.google) {
        return null;
    }

    return new Promise((resolve) => {
        const geocoder = new google.maps.Geocoder();

        geocoder.geocode({ address }, (results, status) => {
            if (status === google.maps.GeocoderStatus.OK && results && results[0]) {
                const location = results[0].geometry.location;
                resolve({
                    lat: location.lat(),
                    lng: location.lng()
                });
            } else {
                console.error('Geocoding failed:', status);
                resolve(null);
            }
        });
    });
}

/**
 * แปลงพิกัดเป็นที่อยู่
 */
export async function reverseGeocode(
    lat: number,
    lng: number,
    config: GoogleMapsConfig = DEFAULT_MAPS_CONFIG
): Promise<string | null> {
    if (!config.enabled) {
        console.warn('Google Maps is disabled');
        return null;
    }

    const loaded = await loadGoogleMaps(config);
    if (!loaded || !window.google) {
        return null;
    }

    return new Promise((resolve) => {
        const geocoder = new google.maps.Geocoder();
        const latlng = new google.maps.LatLng(lat, lng);

        geocoder.geocode({ location: latlng }, (results, status) => {
            if (status === google.maps.GeocoderStatus.OK && results && results[0]) {
                resolve(results[0].formatted_address);
            } else {
                console.error('Reverse geocoding failed:', status);
                resolve(null);
            }
        });
    });
}

// ========================================
// Admin Configuration
// ========================================

/**
 * บันทึกการตั้งค่า Google Maps
 */
export async function saveMapsConfig(config: GoogleMapsConfig): Promise<void> {
    // TODO: Save to Firestore
    localStorage.setItem('google_maps_config', JSON.stringify(config));
}

/**
 * ดึงการตั้งค่า Google Maps
 */
export async function getMapsConfig(): Promise<GoogleMapsConfig> {
    try {
        const saved = localStorage.getItem('google_maps_config');
        if (saved) {
            return JSON.parse(saved);
        }
    } catch (error) {
        console.error('Error loading Maps config:', error);
    }

    return DEFAULT_MAPS_CONFIG;
}

// ========================================
// Type Declarations
// ========================================

declare global {
    interface Window {
        google: typeof google;
    }
}
