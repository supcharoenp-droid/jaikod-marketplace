/**
 * Distance Display Feature
 * ฟีเจอร์แสดงระยะทางระหว่างผู้ซื้อกับสินค้า
 */

import { calculateDistance } from './ai-search-discovery';

export interface DistanceDisplayConfig {
    enabled: boolean;
    showInProductCard: boolean;      // แสดงในการ์ดสินค้า
    showInProductDetail: boolean;    // แสดงในหน้ารายละเอียด
    showInSearch: boolean;           // แสดงในผลการค้นหา
    showExactDistance: boolean;      // แสดงระยะทางแบบละเอียด (เช่น 2.5 km) หรือแบบคร่าวๆ (เช่น < 5 km)
    privacyMode: 'exact' | 'approximate' | 'range';  // โหมดความเป็นส่วนตัว
    maxDisplayDistance: number;      // ระยะทางสูงสุดที่แสดง (km) เกินนี้แสดงเป็น "ไกลมาก"
}

export const DEFAULT_DISTANCE_CONFIG: DistanceDisplayConfig = {
    enabled: true,
    showInProductCard: true,
    showInProductDetail: true,
    showInSearch: true,
    showExactDistance: false,        // เริ่มต้นแสดงแบบคร่าวๆ เพื่อความเป็นส่วนตัว
    privacyMode: 'range',
    maxDisplayDistance: 100
};

// ========================================
// Distance Display Functions
// ========================================

/**
 * คำนวณและแสดงระยะทางระหว่างผู้ซื้อกับสินค้า
 */
export function getDistanceDisplay(
    userLat: number,
    userLng: number,
    productLat: number,
    productLng: number,
    config: DistanceDisplayConfig = DEFAULT_DISTANCE_CONFIG
): {
    distance: number;
    displayText: string;
    icon: string;
    color: string;
} | null {
    // ถ้าปิดฟีเจอร์
    if (!config.enabled) {
        return null;
    }

    // ถ้าไม่มีพิกัดสินค้า
    if (!productLat || !productLng) {
        return null;
    }

    // คำนวณระยะทาง
    const distance = calculateDistance(userLat, userLng, productLat, productLng);

    // ถ้าเกินระยะทางสูงสุด
    if (distance > config.maxDisplayDistance) {
        return {
            distance,
            displayText: 'ไกลมาก',
            icon: '🌍',
            color: 'gray'
        };
    }

    // แสดงตามโหมดความเป็นส่วนตัว
    let displayText = '';
    let icon = '📍';
    let color = 'blue';

    switch (config.privacyMode) {
        case 'exact':
            // แสดงระยะทางแบบละเอียด
            displayText = `${distance.toFixed(1)} km`;
            break;

        case 'approximate':
            // แสดงระยะทางแบบประมาณ
            if (distance < 1) {
                displayText = '< 1 km';
                icon = '📍';
                color = 'green';
            } else if (distance < 5) {
                displayText = '< 5 km';
                icon = '📍';
                color = 'green';
            } else if (distance < 10) {
                displayText = '< 10 km';
                icon = '🚗';
                color = 'blue';
            } else if (distance < 20) {
                displayText = '< 20 km';
                icon = '🚗';
                color = 'blue';
            } else if (distance < 50) {
                displayText = '< 50 km';
                icon = '🚙';
                color = 'orange';
            } else {
                displayText = '> 50 km';
                icon = '🌍';
                color = 'gray';
            }
            break;

        case 'range':
            // แสดงระยะทางแบบช่วง
            if (distance < 1) {
                displayText = 'ใกล้มาก (< 1 km)';
                icon = '📍';
                color = 'green';
            } else if (distance < 5) {
                displayText = 'ใกล้ (1-5 km)';
                icon = '📍';
                color = 'green';
            } else if (distance < 10) {
                displayText = 'ปานกลาง (5-10 km)';
                icon = '🚗';
                color = 'blue';
            } else if (distance < 20) {
                displayText = 'ค่อนข้างไกล (10-20 km)';
                icon = '🚗';
                color = 'blue';
            } else if (distance < 50) {
                displayText = 'ไกล (20-50 km)';
                icon = '🚙';
                color = 'orange';
            } else {
                displayText = 'ไกลมาก (> 50 km)';
                icon = '🌍';
                color = 'gray';
            }
            break;
    }

    return {
        distance,
        displayText,
        icon,
        color
    };
}

/**
 * คำนวณเวลาเดินทางโดยประมาณ
 */
export function getEstimatedTravelTime(distanceKm: number): {
    byWalking: string;
    byBike: string;
    byCar: string;
} {
    // ความเร็วเฉลี่ย (km/h)
    const walkingSpeed = 5;
    const bikeSpeed = 15;
    const carSpeed = 40;  // คำนึงถึงการจราจร

    const walkingMinutes = Math.round((distanceKm / walkingSpeed) * 60);
    const bikeMinutes = Math.round((distanceKm / bikeSpeed) * 60);
    const carMinutes = Math.round((distanceKm / carSpeed) * 60);

    return {
        byWalking: formatTime(walkingMinutes),
        byBike: formatTime(bikeMinutes),
        byCar: formatTime(carMinutes)
    };
}

function formatTime(minutes: number): string {
    if (minutes < 60) {
        return `${minutes} นาที`;
    } else {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return mins > 0 ? `${hours} ชม. ${mins} นาที` : `${hours} ชม.`;
    }
}

/**
 * ตรวจสอบว่าสินค้าอยู่ในรัศมีที่กำหนดหรือไม่
 */
export function isWithinRadius(
    userLat: number,
    userLng: number,
    productLat: number,
    productLng: number,
    radiusKm: number
): boolean {
    const distance = calculateDistance(userLat, userLng, productLat, productLng);
    return distance <= radiusKm;
}

/**
 * เรียงสินค้าตามระยะทาง
 */
export function sortByDistance<T extends { location: { latitude?: number; longitude?: number } }>(
    products: T[],
    userLat: number,
    userLng: number
): (T & { distance?: number })[] {
    return products
        .map(product => {
            const distance = product.location.latitude && product.location.longitude
                ? calculateDistance(userLat, userLng, product.location.latitude, product.location.longitude)
                : undefined;
            return { ...product, distance };
        })
        .sort((a, b) => {
            if (a.distance === undefined) return 1;
            if (b.distance === undefined) return -1;
            return a.distance - b.distance;
        });
}

// ========================================
// Admin Configuration
// ========================================

/**
 * บันทึกการตั้งค่าระยะทาง (สำหรับ Admin)
 */
export async function saveDistanceConfig(config: DistanceDisplayConfig): Promise<void> {
    // TODO: Save to Firestore
    // collection: 'system_config'
    // document: 'distance_display'
    console.log('Saving distance config:', config);
}

/**
 * ดึงการตั้งค่าระยะทาง
 */
export async function getDistanceConfig(): Promise<DistanceDisplayConfig> {
    // TODO: Fetch from Firestore
    return DEFAULT_DISTANCE_CONFIG;
}

/**
 * ตรวจสอบว่าฟีเจอร์เปิดใช้งานหรือไม่
 */
export async function isDistanceFeatureEnabled(): Promise<boolean> {
    const config = await getDistanceConfig();
    return config.enabled;
}
