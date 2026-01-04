/**
 * ============================================
 * Shipping Service (Placeholder)
 * ============================================
 * 
 * Ready for Phase 2 - Marketplace Mode
 * Enable by setting FEATURE_FLAGS.SHIPPING_ENABLED = true
 * 
 * Supported Carriers:
 * - Kerry Express
 * - Flash Express
 * - J&T Express
 * - Thailand Post
 */

import { FEATURE_FLAGS } from '@/config/platform'

// ============================================
// TYPES
// ============================================

export type ShippingCarrier = 'kerry' | 'flash' | 'jt' | 'thaipost' | 'lalamove' | 'lineman'

export interface CarrierInfo {
    id: ShippingCarrier
    name: string
    name_th: string
    logo: string
    trackingUrl: string
    supportsCOD: boolean
    supportsPickup: boolean
    estimatedDays: { min: number; max: number }
}

export interface ShippingRate {
    carrier: ShippingCarrier
    price: number
    estimatedDays: number
    serviceType: string
}

export interface ShipmentRequest {
    orderId: string
    carrier: ShippingCarrier
    senderAddress: Address
    receiverAddress: Address
    packageInfo: PackageInfo
    cod?: number // Cash on delivery amount
}

export interface Address {
    name: string
    phone: string
    address: string
    district: string
    amphoe: string
    province: string
    zipcode: string
}

export interface PackageInfo {
    weight: number // kg
    width?: number // cm
    height?: number // cm
    length?: number // cm
    description?: string
}

export interface Shipment {
    id: string
    orderId: string
    carrier: ShippingCarrier
    trackingNumber: string
    status: ShipmentStatus
    labelUrl?: string
    createdAt: Date
    updatedAt: Date
}

export type ShipmentStatus =
    | 'created'
    | 'picked_up'
    | 'in_transit'
    | 'out_for_delivery'
    | 'delivered'
    | 'failed'
    | 'returned'

// ============================================
// CARRIER DATA
// ============================================

export const CARRIERS: Record<ShippingCarrier, CarrierInfo> = {
    kerry: {
        id: 'kerry',
        name: 'Kerry Express',
        name_th: 'เคอรี่ เอ็กซ์เพรส',
        logo: '/images/carriers/kerry.png',
        trackingUrl: 'https://th.kerryexpress.com/th/track',
        supportsCOD: true,
        supportsPickup: true,
        estimatedDays: { min: 1, max: 3 }
    },
    flash: {
        id: 'flash',
        name: 'Flash Express',
        name_th: 'แฟลช เอ็กซ์เพรส',
        logo: '/images/carriers/flash.png',
        trackingUrl: 'https://flashexpress.com/tracking',
        supportsCOD: true,
        supportsPickup: true,
        estimatedDays: { min: 1, max: 2 }
    },
    jt: {
        id: 'jt',
        name: 'J&T Express',
        name_th: 'เจแอนด์ที เอ็กซ์เพรส',
        logo: '/images/carriers/jt.png',
        trackingUrl: 'https://www.jtexpress.co.th/trajectoryQuery',
        supportsCOD: true,
        supportsPickup: true,
        estimatedDays: { min: 2, max: 4 }
    },
    thaipost: {
        id: 'thaipost',
        name: 'Thailand Post',
        name_th: 'ไปรษณีย์ไทย',
        logo: '/images/carriers/thaipost.png',
        trackingUrl: 'https://track.thailandpost.co.th',
        supportsCOD: false,
        supportsPickup: false,
        estimatedDays: { min: 3, max: 7 }
    },
    lalamove: {
        id: 'lalamove',
        name: 'Lalamove',
        name_th: 'ลาลามูฟ',
        logo: '/images/carriers/lalamove.png',
        trackingUrl: 'https://www.lalamove.com',
        supportsCOD: true,
        supportsPickup: false,
        estimatedDays: { min: 0, max: 1 }
    },
    lineman: {
        id: 'lineman',
        name: 'LINE MAN',
        name_th: 'ไลน์แมน',
        logo: '/images/carriers/lineman.png',
        trackingUrl: 'https://lineman.line.me',
        supportsCOD: true,
        supportsPickup: false,
        estimatedDays: { min: 0, max: 1 }
    }
}

// ============================================
// SHIPPING SERVICE
// ============================================

class ShippingService {
    private isEnabled: boolean

    constructor() {
        this.isEnabled = FEATURE_FLAGS.SHIPPING_ENABLED
    }

    /**
     * Check if shipping is available
     */
    isAvailable(): boolean {
        return this.isEnabled
    }

    /**
     * Get all available carriers
     */
    getCarriers(): CarrierInfo[] {
        return Object.values(CARRIERS)
    }

    /**
     * Get carrier info
     */
    getCarrier(carrierId: ShippingCarrier): CarrierInfo | null {
        return CARRIERS[carrierId] || null
    }

    /**
     * Calculate shipping rates
     */
    async calculateRates(
        fromProvince: string,
        toProvince: string,
        packageInfo: PackageInfo
    ): Promise<ShippingRate[]> {
        if (!this.isEnabled) {
            console.log('📦 Shipping is disabled in Classified mode')
            return []
        }

        // TODO: Integrate with actual carrier APIs
        // This returns mock rates for now

        const rates: ShippingRate[] = [
            {
                carrier: 'flash',
                price: 40,
                estimatedDays: 1,
                serviceType: 'Standard'
            },
            {
                carrier: 'kerry',
                price: 50,
                estimatedDays: 2,
                serviceType: 'Standard'
            },
            {
                carrier: 'jt',
                price: 35,
                estimatedDays: 3,
                serviceType: 'Economy'
            },
            {
                carrier: 'thaipost',
                price: 30,
                estimatedDays: 5,
                serviceType: 'EMS'
            }
        ]

        // Adjust for weight
        const weightMultiplier = Math.max(1, Math.ceil(packageInfo.weight / 2))

        return rates.map(rate => ({
            ...rate,
            price: rate.price * weightMultiplier
        }))
    }

    /**
     * Create shipment
     */
    async createShipment(request: ShipmentRequest): Promise<Shipment | null> {
        if (!this.isEnabled) {
            console.log('📦 Shipping is disabled in Classified mode')
            return null
        }

        // TODO: Integrate with carrier APIs
        console.log('📦 Creating shipment:', request)

        // Return mock shipment for structure
        const shipment: Shipment = {
            id: `ship_${Date.now()}`,
            orderId: request.orderId,
            carrier: request.carrier,
            trackingNumber: '', // Will be assigned by carrier
            status: 'created',
            createdAt: new Date(),
            updatedAt: new Date()
        }

        return shipment
    }

    /**
     * Track shipment
     */
    async trackShipment(carrier: ShippingCarrier, trackingNumber: string): Promise<any[]> {
        if (!this.isEnabled) return []

        // TODO: Integrate with carrier tracking APIs
        console.log('📦 Tracking:', carrier, trackingNumber)

        // Return empty tracking history for now
        return []
    }

    /**
     * Get tracking URL
     */
    getTrackingUrl(carrier: ShippingCarrier, trackingNumber: string): string {
        const carrierInfo = CARRIERS[carrier]
        if (!carrierInfo) return ''

        // Different carriers have different URL formats
        switch (carrier) {
            case 'kerry':
                return `${carrierInfo.trackingUrl}?tracking=${trackingNumber}`
            case 'flash':
                return `${carrierInfo.trackingUrl}?se=${trackingNumber}`
            case 'jt':
                return `${carrierInfo.trackingUrl}?billcode=${trackingNumber}`
            case 'thaipost':
                return `${carrierInfo.trackingUrl}?trackNumber=${trackingNumber}`
            default:
                return carrierInfo.trackingUrl
        }
    }

    /**
     * Cancel shipment
     */
    async cancelShipment(shipmentId: string): Promise<boolean> {
        if (!this.isEnabled) return false

        // TODO: Cancel with carrier API
        console.log('📦 Cancelling shipment:', shipmentId)
        return false
    }

    /**
     * Request pickup from carrier
     */
    async requestPickup(shipmentId: string, pickupDate: Date): Promise<boolean> {
        if (!this.isEnabled) return false

        // TODO: Schedule pickup with carrier
        console.log('📦 Requesting pickup:', shipmentId, pickupDate)
        return false
    }
}

// ============================================
// EXPORT SINGLETON
// ============================================

export const shippingService = new ShippingService()
export default shippingService
