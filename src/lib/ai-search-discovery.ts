/**
 * Advanced Search & Discovery System
 * ระบบค้นหาและค้นพบสินค้าขั้นสูง
 */

export interface SearchFilters {
    // Basic Search
    keyword?: string;
    categoryId?: string;

    // Price Range
    minPrice?: number;
    maxPrice?: number;

    // Location Filters
    province?: string;
    district?: string;
    subdistrict?: string;
    zone?: 'north' | 'northeast' | 'central' | 'east' | 'west' | 'south';

    // Geolocation Search
    latitude?: number;
    longitude?: number;
    radiusKm?: number;  // รัศมีการค้นหา (กิโลเมตร)

    // Condition
    condition?: string[];

    // Sorting
    sortBy?: 'newest' | 'price-low' | 'price-high' | 'distance' | 'relevance';

    // Pagination
    page?: number;
    limit?: number;
}

export interface SearchResult {
    products: ProductWithDistance[];
    totalCount: number;
    filters: AppliedFilters;
    suggestions?: string[];
}

export interface ProductWithDistance {
    id: string;
    title: string;
    price: number;
    images: string[];
    location: {
        province: string;
        district: string;
        subdistrict: string;
        latitude?: number;
        longitude?: number;
    };
    distance?: number;  // ระยะทางจากผู้ค้นหา (กิโลเมตร)
    createdAt: Date;
}

export interface AppliedFilters {
    keyword?: string;
    location?: string;
    priceRange?: string;
    zone?: string;
}

// ========================================
// 1. Thailand Zones & Provinces
// ========================================

export const THAILAND_ZONES = {
    north: {
        name: 'ภาคเหนือ',
        provinces: [
            'เชียงใหม่', 'เชียงราย', 'ลำปาง', 'ลำพูน', 'แม่ฮ่องสอน',
            'น่าน', 'พะเยา', 'แพร่', 'อุตรดิตถ์'
        ]
    },
    northeast: {
        name: 'ภาคตะวันออกเฉียงเหนือ',
        provinces: [
            'นครราชสีมา', 'บุรีรัมย์', 'สุรินทร์', 'ศรีสะเกษ', 'อุบลราชธานี',
            'ยโสธร', 'ชัยภูมิ', 'อำนาจเจริญ', 'หนองบัวลำภู', 'ขอนแก่น',
            'อุดรธานี', 'เลย', 'หนองคาย', 'มหาสารคาม', 'ร้อยเอ็ด',
            'กาฬสินธุ์', 'สกลนคร', 'นครพนม', 'มุกดาหาร', 'บึงกาฬ'
        ]
    },
    central: {
        name: 'ภาคกลาง',
        provinces: [
            'กรุงเทพมหานคร', 'นนทบุรี', 'ปทุมธานี', 'สมุทรปราการ', 'สมุทรสาคร',
            'นครปฐม', 'สุพรรณบุรี', 'อยุธยา', 'อ่างทอง', 'ลพบุรี',
            'สิงห์บุรี', 'ชัยนาท', 'สระบุรี', 'ชลบุรี', 'ระยอง',
            'จันทบุรี', 'ตราด', 'ฉะเชิงเทรา', 'ปราจีนบุรี', 'นครนายก',
            'สระแก้ว', 'เพชรบุรี', 'ประจวบคีรีขันธ์', 'กาญจนบุรี', 'ราชบุรี'
        ]
    },
    east: {
        name: 'ภาคตะวันออก',
        provinces: [
            'ชลบุรี', 'ระยอง', 'จันทบุรี', 'ตราด', 'ฉะเชิงเทรา',
            'ปราจีนบุรี', 'นครนายก', 'สระแก้ว'
        ]
    },
    west: {
        name: 'ภาคตะวันตก',
        provinces: [
            'กาญจนบุรี', 'ราชบุรี', 'เพชรบุรี', 'ประจวบคีรีขันธ์', 'สุพรรณบุรี',
            'นครปฐม', 'สมุทรสาคร', 'สมุทรสงคราม'
        ]
    },
    south: {
        name: 'ภาคใต้',
        provinces: [
            'ชุมพร', 'สุราษฎร์ธานี', 'นครศรีธรรมราช', 'กระบี่', 'พังงา',
            'ภูเก็ต', 'ระนอง', 'สงขลา', 'สตูล', 'ตรัง', 'พัทลุง',
            'ปัตตานี', 'ยะลา', 'นราธิวาส'
        ]
    }
};

/**
 * หาโซนจากจังหวัด
 */
export function getZoneFromProvince(province: string): string | null {
    for (const [zoneId, zoneData] of Object.entries(THAILAND_ZONES)) {
        if (zoneData.provinces.includes(province)) {
            return zoneId;
        }
    }
    return null;
}

// ========================================
// 2. Geolocation Functions
// ========================================

/**
 * คำนวณระยะทางระหว่าง 2 จุดพิกัด (Haversine Formula)
 * @returns ระยะทางเป็นกิโลเมตร
 */
export function calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
): number {
    const R = 6371; // รัศมีโลกเป็นกิโลเมตร
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);

    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    return Math.round(distance * 10) / 10; // ปัดเป็นทศนิยม 1 ตำแหน่ง
}

function toRad(degrees: number): number {
    return degrees * (Math.PI / 180);
}

/**
 * ดึงพิกัดปัจจุบันของผู้ใช้
 */
export async function getCurrentLocation(): Promise<{
    latitude: number;
    longitude: number;
} | null> {
    return new Promise((resolve) => {
        if (!navigator.geolocation) {
            console.warn('Geolocation is not supported');
            resolve(null);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                resolve({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                });
            },
            (error) => {
                console.warn('Error getting location:', error);
                resolve(null);
            },
            {
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 0
            }
        );
    });
}

// ========================================
// 3. Search Functions
// ========================================

/**
 * ค้นหาสินค้าด้วยฟิลเตอร์ต่างๆ
 */
export async function searchProducts(
    filters: SearchFilters
): Promise<SearchResult> {
    // TODO: Implement Firestore query

    return {
        products: [],
        totalCount: 0,
        filters: buildAppliedFilters(filters),
        suggestions: []
    };
}

/**
 * ค้นหาสินค้าใกล้ฉัน
 */
export async function searchNearby(
    latitude: number,
    longitude: number,
    radiusKm: number = 10,
    categoryId?: string
): Promise<ProductWithDistance[]> {
    const filters: SearchFilters = {
        latitude,
        longitude,
        radiusKm,
        categoryId,
        sortBy: 'distance'
    };

    const result = await searchProducts(filters);
    return result.products;
}

/**
 * ค้นหาสินค้าในโซน
 */
export async function searchByZone(
    zone: string,
    categoryId?: string
): Promise<SearchResult> {
    const filters: SearchFilters = {
        zone: zone as any,
        categoryId,
        sortBy: 'newest'
    };

    return searchProducts(filters);
}

/**
 * ค้นหาสินค้าในจังหวัด
 */
export async function searchByProvince(
    province: string,
    categoryId?: string
): Promise<SearchResult> {
    const filters: SearchFilters = {
        province,
        categoryId,
        sortBy: 'newest'
    };

    return searchProducts(filters);
}

// ========================================
// 4. Helper Functions
// ========================================

/**
 * เรียงลำดับสินค้า
 */
function sortProducts(
    products: ProductWithDistance[],
    sortBy: string
): ProductWithDistance[] {
    switch (sortBy) {
        case 'newest':
            return products.sort((a, b) =>
                b.createdAt.getTime() - a.createdAt.getTime()
            );
        case 'price-low':
            return products.sort((a, b) => a.price - b.price);
        case 'price-high':
            return products.sort((a, b) => b.price - a.price);
        case 'distance':
            return products.sort((a, b) => {
                if (a.distance === undefined) return 1;
                if (b.distance === undefined) return -1;
                return a.distance - b.distance;
            });
        case 'relevance':
            return products;
        default:
            return products;
    }
}

/**
 * สร้าง Applied Filters สำหรับแสดงผล
 */
function buildAppliedFilters(filters: SearchFilters): AppliedFilters {
    const applied: AppliedFilters = {};

    if (filters.keyword) {
        applied.keyword = filters.keyword;
    }

    if (filters.province) {
        applied.location = filters.province;
        if (filters.district) {
            applied.location += ` > ${filters.district}`;
        }
    } else if (filters.zone) {
        applied.zone = THAILAND_ZONES[filters.zone].name;
    } else if (filters.latitude && filters.longitude) {
        applied.location = `ใกล้ฉัน (${filters.radiusKm || 10} km)`;
    }

    if (filters.minPrice || filters.maxPrice) {
        const min = filters.minPrice ? `฿${filters.minPrice.toLocaleString()}` : '฿0';
        const max = filters.maxPrice ? `฿${filters.maxPrice.toLocaleString()}` : '∞';
        applied.priceRange = `${min} - ${max}`;
    }

    return applied;
}
