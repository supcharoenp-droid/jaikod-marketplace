'use client'

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * useViewerLocation Hook
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * React hook for managing viewer location state
 * Follows the Global Location & Distance Standard Engine rules:
 * - Request GPS once per session
 * - Cache location securely
 * - NO IP-based geolocation fallback
 * - Allow manual location override
 */

import { useState, useEffect, useCallback } from 'react'
import {
    ViewerLocation,
    getCachedViewerLocation,
    requestViewerLocation,
    setManualViewerLocation,
    clearViewerLocation
} from '@/lib/location-engine'
import { PROVINCE_CENTROIDS } from '@/lib/geo/thailand-centroids'

interface UseViewerLocationReturn {
    /** Current viewer location (null if unavailable) */
    location: ViewerLocation | null
    /** Loading state during initial GPS request */
    isLoading: boolean
    /** Whether location was set manually */
    isManual: boolean
    /** Whether location came from GPS */
    isGPS: boolean
    /** Location is available */
    hasLocation: boolean
    /** Set location manually by province name */
    setLocationByProvince: (province: string, district?: string) => boolean
    /** Request GPS location again */
    refreshGPS: () => Promise<void>
    /** Clear stored location */
    clear: () => void
}

export function useViewerLocation(): UseViewerLocationReturn {
    const [location, setLocation] = useState<ViewerLocation | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    // Initialize location on mount
    useEffect(() => {
        const init = async () => {
            setIsLoading(true)

            // Check for cached location first
            const cached = getCachedViewerLocation()
            if (cached) {
                console.log('[useViewerLocation] Using cached:', cached.source, cached.provinceName || '')
                setLocation(cached)
                setIsLoading(false)
                return
            }

            // Try to get GPS location
            const gpsLocation = await requestViewerLocation()
            if (gpsLocation) {
                setLocation(gpsLocation)
            }

            setIsLoading(false)
        }

        init()
    }, [])

    // Set location manually by province
    const setLocationByProvince = useCallback((province: string, district?: string): boolean => {
        const newLocation = setManualViewerLocation(province, district)
        if (newLocation) {
            setLocation(newLocation)
            return true
        }
        return false
    }, [])

    // Request GPS again
    const refreshGPS = useCallback(async () => {
        setIsLoading(true)
        clearViewerLocation() // Clear cache first
        const gpsLocation = await requestViewerLocation()
        if (gpsLocation) {
            setLocation(gpsLocation)
        }
        setIsLoading(false)
    }, [])

    // Clear location
    const clear = useCallback(() => {
        clearViewerLocation()
        setLocation(null)
    }, [])

    return {
        location,
        isLoading,
        isManual: location?.source === 'manual',
        isGPS: location?.source === 'gps',
        hasLocation: location !== null,
        setLocationByProvince,
        refreshGPS,
        clear
    }
}

/**
 * Get list of all provinces for dropdown selection
 */
export function getAllProvinces(): { id: string; name_th: string; name_en: string }[] {
    return Object.entries(PROVINCE_CENTROIDS)
        .map(([id, data]) => ({
            id,
            name_th: data.name_th,
            name_en: data.name_en
        }))
        .sort((a, b) => a.name_th.localeCompare(b.name_th, 'th'))
}

export type { ViewerLocation }
