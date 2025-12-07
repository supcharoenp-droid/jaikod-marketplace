'use client';

import { getDistanceDisplay, getEstimatedTravelTime, DEFAULT_DISTANCE_CONFIG, DistanceDisplayConfig } from '@/lib/distance-display';

export interface DistanceBadgeProps {
    userLat: number;
    userLng: number;
    productLat: number;
    productLng: number;
    config?: DistanceDisplayConfig;
    showTravelTime?: boolean;
    size?: 'sm' | 'md' | 'lg';
}

/**
 * Distance Badge Component
 * แสดงระยะทางระหว่างผู้ซื้อกับสินค้า
 */
export function DistanceBadge({
    userLat,
    userLng,
    productLat,
    productLng,
    config = DEFAULT_DISTANCE_CONFIG,
    showTravelTime = false,
    size = 'md'
}: DistanceBadgeProps) {
    const distanceInfo = getDistanceDisplay(userLat, userLng, productLat, productLng, config);

    if (!distanceInfo) {
        return null;
    }

    const sizeClasses = {
        sm: 'text-xs px-2 py-1',
        md: 'text-sm px-3 py-1.5',
        lg: 'text-base px-4 py-2'
    };

    const colorClasses = {
        green: 'bg-green-100 text-green-700 border-green-200',
        blue: 'bg-blue-100 text-blue-700 border-blue-200',
        orange: 'bg-orange-100 text-orange-700 border-orange-200',
        gray: 'bg-gray-100 text-gray-700 border-gray-200'
    };

    const travelTime = showTravelTime ? getEstimatedTravelTime(distanceInfo.distance) : null;

    return (
        <div className="inline-block">
            <span
                className={`
                    inline-flex items-center gap-1 rounded-full border
                    ${sizeClasses[size]}
                    ${colorClasses[distanceInfo.color as keyof typeof colorClasses]}
                    font-semibold
                `}
            >
                <span>{distanceInfo.icon}</span>
                <span>{distanceInfo.displayText}</span>
            </span>

            {showTravelTime && travelTime && (
                <div className="mt-2 text-xs text-gray-600">
                    <div>🚶 {travelTime.byWalking}</div>
                    <div>🚴 {travelTime.byBike}</div>
                    <div>🚗 {travelTime.byCar}</div>
                </div>
            )}
        </div>
    );
}
