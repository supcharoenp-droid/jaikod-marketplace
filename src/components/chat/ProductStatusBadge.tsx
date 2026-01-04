/**
 * Product Status Badge - V2 Feature
 * Shows the current status of a product in chat
 */

'use client';

import { Package, CheckCircle, Clock, AlertTriangle, XCircle } from 'lucide-react';

type ProductStatus = 'available' | 'sold' | 'reserved' | 'deleted' | undefined;

interface ProductStatusBadgeProps {
    status?: ProductStatus;
    size?: 'sm' | 'md' | 'lg';
    showLabel?: boolean;
}

export default function ProductStatusBadge({
    status = 'available',
    size = 'md',
    showLabel = true
}: ProductStatusBadgeProps) {
    const statusConfig = {
        available: {
            icon: Package,
            label: 'ยังมีอยู่',
            labelEN: 'Available',
            bgColor: 'bg-green-100 dark:bg-green-900/30',
            textColor: 'text-green-700 dark:text-green-400',
            iconColor: 'text-green-600',
            pulseColor: 'animate-pulse'
        },
        sold: {
            icon: CheckCircle,
            label: 'ขายแล้ว',
            labelEN: 'Sold',
            bgColor: 'bg-red-100 dark:bg-red-900/30',
            textColor: 'text-red-700 dark:text-red-400',
            iconColor: 'text-red-600',
            pulseColor: ''
        },
        reserved: {
            icon: Clock,
            label: 'จองแล้ว',
            labelEN: 'Reserved',
            bgColor: 'bg-amber-100 dark:bg-amber-900/30',
            textColor: 'text-amber-700 dark:text-amber-400',
            iconColor: 'text-amber-600',
            pulseColor: 'animate-pulse'
        },
        deleted: {
            icon: XCircle,
            label: 'ถูกลบ',
            labelEN: 'Deleted',
            bgColor: 'bg-gray-100 dark:bg-gray-900/30',
            textColor: 'text-gray-500 dark:text-gray-400',
            iconColor: 'text-gray-500',
            pulseColor: ''
        }
    };

    const config = statusConfig[status || 'available'];
    const Icon = config.icon;

    const sizeClasses = {
        sm: {
            container: 'px-1.5 py-0.5 gap-1',
            icon: 'w-3 h-3',
            text: 'text-[10px]'
        },
        md: {
            container: 'px-2 py-1 gap-1.5',
            icon: 'w-4 h-4',
            text: 'text-xs'
        },
        lg: {
            container: 'px-3 py-1.5 gap-2',
            icon: 'w-5 h-5',
            text: 'text-sm'
        }
    };

    const sizes = sizeClasses[size];

    return (
        <div className={`inline-flex items-center ${sizes.container} ${config.bgColor} rounded-full ${config.pulseColor}`}>
            <Icon className={`${sizes.icon} ${config.iconColor}`} />
            {showLabel && (
                <span className={`${sizes.text} font-bold ${config.textColor}`}>
                    {config.label}
                </span>
            )}
        </div>
    );
}

/**
 * Product Status Indicator for Chat Header
 * Shows a small dot indicator with status
 */
export function ProductStatusDot({ status }: { status?: ProductStatus }) {
    const colors = {
        available: 'bg-green-500',
        sold: 'bg-red-500',
        reserved: 'bg-amber-500',
        deleted: 'bg-gray-400'
    };

    const color = colors[status || 'available'];

    return (
        <span className={`inline-block w-2 h-2 rounded-full ${color} ${status === 'available' ? 'animate-pulse' : ''}`} />
    );
}
