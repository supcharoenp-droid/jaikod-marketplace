/**
 * SafeZone Types
 */

export interface SafeZoneLocation {
    lat: number;
    lng: number;
    address?: string;
    province?: string;
    amphoe?: string;
}

export interface SafeZoneSpot {
    id: string;
    name: string;
    type: 'mall' | 'convenience_store' | 'police_station' | 'gas_station' | 'restaurant' | 'bank' | 'government';
    location: SafeZoneLocation;
    province: string;
    distance?: number; // km from midpoint (calculated)
    safety_score: number; // 1-100
    operating_hours: string;
    has_cctv: boolean;
    has_parking: boolean;
    verification_status: 'verified' | 'community' | 'google_places';
    features: string[];
    photo_url?: string;
    source: 'mock' | 'firebase' | 'google_places';
    google_place_id?: string;
    firebase_doc_id?: string;
}

export interface SafeZoneSearchParams {
    buyerLocation?: SafeZoneLocation;
    sellerLocation?: SafeZoneLocation;
    province?: string;
    maxDistance?: number; // km
    types?: SafeZoneSpot['type'][];
    limit?: number;
}

export interface SafeZoneSearchResult {
    spots: SafeZoneSpot[];
    midpoint?: SafeZoneLocation;
    source: 'mock' | 'firebase' | 'google_places' | 'hybrid';
}
