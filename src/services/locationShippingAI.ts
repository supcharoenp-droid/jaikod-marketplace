/**
 * Location & Shipping AI
 * 
 * Intelligent location and shipping assistance
 * GPS detection, auto-fill, and smart shipping suggestions
 */

export type GPSPermissionStatus = 'granted' | 'denied' | 'prompt' | 'not_requested'
export type SellerType = 'individual' | 'shop' | 'business'

export interface LocationData {
    province: string
    amphoe: string // District
    district: string // Sub-district (Tambon)
    zipcode: string
    gps_coordinates?: {
        latitude: number
        longitude: number
    }
    formatted_address?: string
}

export interface ShippingOption {
    option_id: string
    name: {
        th: string
        en: string
    }
    estimated_days: string
    cost_range?: {
        min: number
        max: number
    }
    icon: string
    recommended: boolean
    trust_boost: boolean
}

export interface LocationShippingResult {
    suggested_location?: LocationData
    gps_permission_status: GPSPermissionStatus
    shipping_options: ShippingOption[]
    seller_type: SellerType
    saved_locations: LocationData[] // For shop users
    smart_hints: {
        th: string[]
        en: string[]
    }
}

/**
 * Get location and shipping suggestions
 */
export async function getLocationShippingSuggestions(input: {
    user_id?: string
    seller_type?: SellerType
    category_id?: number
    request_gps?: boolean
}): Promise<LocationShippingResult> {
    console.log('[LocationShippingAI] Getting suggestions...')

    const sellerType = input.seller_type || 'individual'
    let gpsPermissionStatus: GPSPermissionStatus = 'not_requested'
    let suggestedLocation: LocationData | undefined

    // Try GPS if requested
    if (input.request_gps) {
        const gpsResult = await requestGPSLocation()
        gpsPermissionStatus = gpsResult.status

        if (gpsResult.location) {
            // Reverse geocode to get address
            suggestedLocation = await reverseGeocode(gpsResult.location)
        }
    }

    // Get saved locations for shops
    const savedLocations = sellerType !== 'individual'
        ? await getSavedLocations(input.user_id)
        : []

    // Get shipping options based on category and seller type
    const shippingOptions = getShippingOptions(input.category_id, sellerType)

    // Generate smart hints
    const smartHints = generateLocationHints(sellerType, gpsPermissionStatus)

    return {
        suggested_location: suggestedLocation,
        gps_permission_status: gpsPermissionStatus,
        shipping_options: shippingOptions,
        seller_type: sellerType,
        saved_locations: savedLocations,
        smart_hints: smartHints
    }
}

/**
 * Request GPS location from browser
 */
async function requestGPSLocation(): Promise<{
    status: GPSPermissionStatus
    location?: { latitude: number; longitude: number }
}> {
    // Check if geolocation is supported
    if (!navigator.geolocation) {
        return {
            status: 'denied'
        }
    }

    try {
        // Check permission status first
        if ('permissions' in navigator) {
            const permission = await navigator.permissions.query({ name: 'geolocation' as PermissionName })

            if (permission.state === 'denied') {
                return { status: 'denied' }
            } else if (permission.state === 'granted') {
                // Permission already granted, get position
                const position = await new Promise<GeolocationPosition>((resolve, reject) => {
                    navigator.geolocation.getCurrentPosition(resolve, reject, {
                        enableHighAccuracy: true,
                        timeout: 5000,
                        maximumAge: 0
                    })
                })

                return {
                    status: 'granted',
                    location: {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                    }
                }
            }
        }

        // Request permission and location
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(
                resolve,
                reject,
                {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 0
                }
            )
        })

        return {
            status: 'granted',
            location: {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
            }
        }
    } catch (error: any) {
        console.error('[GPS] Error:', error)

        if (error.code === 1) { // PERMISSION_DENIED
            return { status: 'denied' }
        } else if (error.code === 2) { // POSITION_UNAVAILABLE
            return { status: 'denied' }
        } else if (error.code === 3) { // TIMEOUT
            return { status: 'prompt' }
        }

        return { status: 'denied' }
    }
}

/**
 * Reverse geocode GPS coordinates to address
 * In production, this would call Google Maps API, Nominatim, or similar
 */
async function reverseGeocode(coords: {
    latitude: number
    longitude: number
}): Promise<LocationData> {
    console.log('[Geocoding] Reverse geocoding:', coords)

    // Mock implementation - in production, use real geocoding API
    // Example: Google Maps Geocoding API, OpenStreetMap Nominatim, etc.

    // For demonstration, return Bangkok area
    const mockLocations: LocationData[] = [
        {
            province: 'กรุงเทพมหานคร',
            amphoe: 'คลองเตย',
            district: 'คลองเตยเหนือ',
            zipcode: '10110',
            gps_coordinates: coords,
            formatted_address: 'คลองเตยเหนือ คลองเตย กรุงเทพมหานคร 10110'
        },
        {
            province: 'กรุงเทพมหานคร',
            amphoe: 'วัฒนา',
            district: 'คลองตันเหนือ',
            zipcode: '10110',
            gps_coordinates: coords,
            formatted_address: 'คลองตันเหนือ วัฒนา กรุงเทพมหานคร 10110'
        }
    ]

    // In production: 
    // const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${coords.latitude},${coords.longitude}&key=${API_KEY}`)
    // Parse response and extract province, district, etc.

    return mockLocations[0]
}

/**
 * Get saved locations for shop users
 */
async function getSavedLocations(userId?: string): Promise<LocationData[]> {
    if (!userId) return []

    // In production, fetch from database
    // Example: Firestore query for user's saved locations

    // Mock saved locations
    return [
        {
            province: 'กรุงเทพมหานคร',
            amphoe: 'คลองเตย',
            district: 'คลองเตยเหนือ',
            zipcode: '10110',
            formatted_address: 'ร้านค้า - คลองเตยเหนือ คลองเตย กรุงเทพมหานคร 10110'
        },
        {
            province: 'กรุงเทพมหานคร',
            amphoe: 'บางนา',
            district: 'บางนา',
            zipcode: '10260',
            formatted_address: 'คลังสินค้า - บางนา บางนา กรุงเทพมหานคร 10260'
        }
    ]
}

/**
 * Get shipping options based on category and seller type
 */
function getShippingOptions(
    categoryId?: number,
    sellerType: SellerType = 'individual'
): ShippingOption[] {
    const baseOptions: ShippingOption[] = [
        {
            option_id: 'kerry',
            name: { th: 'Kerry Express', en: 'Kerry Express' },
            estimated_days: '1-3',
            cost_range: { min: 35, max: 70 },
            icon: '🚚',
            recommended: true,
            trust_boost: true
        },
        {
            option_id: 'flash',
            name: { th: 'Flash Express', en: 'Flash Express' },
            estimated_days: '1-3',
            cost_range: { min: 30, max: 65 },
            icon: '⚡',
            recommended: true,
            trust_boost: true
        },
        {
            option_id: 'jt',
            name: { th: 'J&T Express', en: 'J&T Express' },
            estimated_days: '2-4',
            cost_range: { min: 25, max: 60 },
            icon: '📦',
            recommended: false,
            trust_boost: true
        },
        {
            option_id: 'thaipost_ems',
            name: { th: 'EMS ไปรษณีย์ไทย', en: 'Thailand Post EMS' },
            estimated_days: '1-3',
            cost_range: { min: 40, max: 100 },
            icon: '📮',
            recommended: false,
            trust_boost: true
        },
        {
            option_id: 'thaipost_reg',
            name: { th: 'ลงทะเบียน', en: 'Registered Mail' },
            estimated_days: '3-7',
            cost_range: { min: 20, max: 50 },
            icon: '✉️',
            recommended: false,
            trust_boost: false
        },
        {
            option_id: 'lalamove',
            name: { th: 'Lalamove (ส่งด่วนในวันเดียว)', en: 'Lalamove (Same Day)' },
            estimated_days: '0-1',
            cost_range: { min: 50, max: 200 },
            icon: '🏍️',
            recommended: false,
            trust_boost: true
        },
        {
            option_id: 'pickup',
            name: { th: 'นัดรับสินค้าเอง', en: 'Meet Up / Self Pickup' },
            estimated_days: '0',
            icon: '🤝',
            recommended: false,
            trust_boost: false
        }
    ]

    // Category-specific shipping suggestions
    if (categoryId === 2) { // Real Estate
        return [
            {
                option_id: 'viewing',
                name: { th: 'นัดดูสถานที่', en: 'Property Viewing' },
                estimated_days: '0',
                icon: '🏠',
                recommended: true,
                trust_boost: true
            }
        ]
    }

    if (categoryId === 1) { // Automotive
        return [
            {
                option_id: 'test_drive',
                name: { th: 'นัดชมรถ/ทดลองขับ', en: 'Test Drive Appointment' },
                estimated_days: '0',
                icon: '🚗',
                recommended: true,
                trust_boost: true
            }
        ]
    }

    // For large items (furniture, appliances)
    if (categoryId === 5 || categoryId === 13) {
        return [
            ...baseOptions.filter(o => o.option_id === 'lalamove' || o.option_id === 'pickup'),
            {
                option_id: 'delivery_service',
                name: { th: 'บริการขนส่งติดตั้ง', en: 'Delivery & Installation' },
                estimated_days: '1-3',
                cost_range: { min: 200, max: 1000 },
                icon: '🛠️',
                recommended: true,
                trust_boost: true
            }
        ]
    }

    // Shop users get all options
    if (sellerType === 'shop' || sellerType === 'business') {
        return baseOptions
    }

    // Individual sellers get simplified options
    return baseOptions.filter(o =>
        o.option_id === 'kerry' ||
        o.option_id === 'flash' ||
        o.option_id === 'thaipost_ems' ||
        o.option_id === 'pickup'
    )
}

/**
 * Generate smart hints
 */
function generateLocationHints(
    sellerType: SellerType,
    gpsStatus: GPSPermissionStatus
): { th: string[]; en: string[] } {
    const hints = {
        th: [] as string[],
        en: [] as string[]
    }

    // GPS hints
    if (gpsStatus === 'granted') {
        hints.th.push('✅ ตำแหน่งถูกกรอกอัตโนมัติจาก GPS')
        hints.en.push('✅ Location auto-filled from GPS')
    } else if (gpsStatus === 'denied') {
        hints.th.push('📍 กรุณาเลือกที่อยู่ด้วยตนเอง')
        hints.en.push('📍 Please select location manually')
    } else if (gpsStatus === 'prompt') {
        hints.th.push('💡 เปิด GPS เพื่อกรอกที่อยู่อัตโนมัติ')
        hints.en.push('💡 Enable GPS for auto-fill')
    }

    // Seller type hints
    if (sellerType === 'shop' || sellerType === 'business') {
        hints.th.push('🏪 คุณสามารถบันทึกที่อยู่เพื่อใช้ซ้ำได้')
        hints.en.push('🏪 You can save locations for reuse')
    } else {
        hints.th.push('💡 ระบุที่อยู่ที่ชัดเจนช่วยเพิ่มความน่าเชื่อถือ')
        hints.en.push('💡 Clear address increases trust')
    }

    // Shipping hints
    hints.th.push('🚚 ส่งฟรี = ขายเร็วขึ้น 30%')
    hints.en.push('🚚 Free shipping = 30% faster sales')

    return hints
}

/**
 * Validate location data
 */
export function validateLocation(location: Partial<LocationData>): {
    is_valid: boolean
    errors: Array<{ field: string; message: { th: string; en: string } }>
} {
    const errors: any[] = []

    if (!location.province) {
        errors.push({
            field: 'province',
            message: {
                th: 'กรุณาเลือกจังหวัด',
                en: 'Please select province'
            }
        })
    }

    if (!location.amphoe) {
        errors.push({
            field: 'amphoe',
            message: {
                th: 'กรุณาเลือกอำเภอ/เขต',
                en: 'Please select district'
            }
        })
    }

    if (!location.district) {
        errors.push({
            field: 'district',
            message: {
                th: 'กรุณาเลือกตำบล/แขวง',
                en: 'Please select sub-district'
            }
        })
    }

    if (!location.zipcode) {
        errors.push({
            field: 'zipcode',
            message: {
                th: 'กรุณาระบุรหัสไปรษณีย์',
                en: 'Please specify zipcode'
            }
        })
    }

    // Validate zipcode format (5 digits)
    if (location.zipcode && !/^\d{5}$/.test(location.zipcode)) {
        errors.push({
            field: 'zipcode',
            message: {
                th: 'รหัสไปรษณีย์ไม่ถูกต้อง (ต้องเป็นตัวเลข 5 หลัก)',
                en: 'Invalid zipcode (must be 5 digits)'
            }
        })
    }

    return {
        is_valid: errors.length === 0,
        errors
    }
}

/**
 * Calculate shipping cost estimate
 */
export function calculateShippingCost(input: {
    shipping_option_id: string
    weight_kg?: number
    from_province: string
    to_province: string
}): {
    estimated_cost: number
    breakdown: {
        base_cost: number
        distance_fee: number
        weight_fee: number
    }
} {
    // Base costs by shipping method
    const baseCosts: Record<string, number> = {
        kerry: 40,
        flash: 35,
        jt: 30,
        thaipost_ems: 45,
        thaipost_reg: 25,
        lalamove: 60,
        pickup: 0
    }

    const baseCost = baseCosts[input.shipping_option_id] || 40

    // Distance fee (same province = 0, different = +15-30)
    const distanceFee = input.from_province === input.to_province ? 0 : 20

    // Weight fee (>1kg = +10 per kg)
    const weight = input.weight_kg || 0.5
    const weightFee = weight > 1 ? (weight - 1) * 10 : 0

    const estimatedCost = Math.round(baseCost + distanceFee + weightFee)

    return {
        estimated_cost: estimatedCost,
        breakdown: {
            base_cost: baseCost,
            distance_fee: distanceFee,
            weight_fee: weightFee
        }
    }
}

/**
 * Save location for future use (shop users)
 */
export async function saveLocation(
    userId: string,
    location: LocationData,
    locationName: string
): Promise<{ success: boolean; message: { th: string; en: string } }> {
    try {
        // In production: Save to Firestore
        // await db.collection('users').doc(userId).collection('saved_locations').add({
        //     ...location,
        //     name: locationName,
        //     created_at: new Date()
        // })

        console.log('[LocationAI] Saving location:', locationName)

        return {
            success: true,
            message: {
                th: 'บันทึกที่อยู่สำเร็จ',
                en: 'Location saved successfully'
            }
        }
    } catch (error) {
        console.error('[LocationAI] Save error:', error)
        return {
            success: false,
            message: {
                th: 'ไม่สามารถบันทึกที่อยู่ได้',
                en: 'Failed to save location'
            }
        }
    }
}

/**
 * Get recommended shipping method based on category
 */
export function getRecommendedShipping(categoryId: number): {
    option_id: string
    reason: { th: string; en: string }
} {
    const recommendations: Record<number, any> = {
        3: { // Mobiles
            option_id: 'kerry',
            reason: {
                th: 'Kerry Express มีบริการประกันสูงสุด เหมาะกับอุปกรณ์อิเล็กทรอนิกส์',
                en: 'Kerry Express has high insurance coverage, suitable for electronics'
            }
        },
        1: { // Automotive
            option_id: 'test_drive',
            reason: {
                th: 'ผู้ซื้อมักต้องการชมรถก่อนตัดสินใจ',
                en: 'Buyers usually want to test drive before deciding'
            }
        },
        2: { // Real Estate
            option_id: 'viewing',
            reason: {
                th: 'จำเป็นต้องนัดดูสถานที่จริง',
                en: 'Property viewing is required'
            }
        },
        6: { // Fashion
            option_id: 'flash',
            reason: {
                th: 'Flash Express ราคาประหยัด เหมาะกับสินค้าแฟชั่น',
                en: 'Flash Express is economical, suitable for fashion items'
            }
        }
    }

    return recommendations[categoryId] || {
        option_id: 'kerry',
        reason: {
            th: 'ระบบแนะนำให้ใช้ Kerry Express',
            en: 'System recommends Kerry Express'
        }
    }
}
