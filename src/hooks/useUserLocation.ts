'use client'

/**
 * useUserLocation Hook
 * 
 * Hook สำหรับจัดการตำแหน่งผู้ใช้
 * - รองรับ GPS จริง
 * - รองรับการตั้งค่าตำแหน่งด้วยตนเอง
 * - Cache ใน localStorage
 */

import { useState, useEffect, useCallback } from 'react'
import { PROVINCE_CENTROIDS } from '@/lib/geo/thailand-centroids'

export interface UserLocation {
    latitude: number
    longitude: number
    source: 'gps' | 'manual' | 'ip' | 'default'
    provinceName?: string
    districtName?: string
    accuracy?: number
    timestamp?: number
}

const STORAGE_KEY = 'jaikod_user_location'
const DEFAULT_LOCATION: UserLocation = {
    latitude: 13.7563,
    longitude: 100.5018,
    source: 'default',
    provinceName: 'กรุงเทพมหานคร'
}

/**
 * Get stored location from localStorage
 */
function getStoredLocation(): UserLocation | null {
    if (typeof window === 'undefined') return null

    try {
        const stored = localStorage.getItem(STORAGE_KEY)
        if (stored) {
            const parsed = JSON.parse(stored)
            // Check if not too old (30 days)
            if (parsed.timestamp && Date.now() - parsed.timestamp < 30 * 24 * 60 * 60 * 1000) {
                return parsed
            }
        }
    } catch (e) {
        console.warn('[useUserLocation] Failed to parse stored location')
    }
    return null
}

/**
 * Save location to localStorage
 */
function saveLocation(location: UserLocation): void {
    if (typeof window === 'undefined') return

    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({
            ...location,
            timestamp: Date.now()
        }))
    } catch (e) {
        console.warn('[useUserLocation] Failed to save location')
    }
}

/**
 * Hook: useUserLocation
 */
export function useUserLocation() {
    const [location, setLocation] = useState<UserLocation | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    // Initialize on mount
    useEffect(() => {
        const init = async () => {
            setIsLoading(true)

            // 1. Check for stored manual location first
            const stored = getStoredLocation()
            if (stored && stored.source === 'manual') {
                console.log('[useUserLocation] Using manual location:', stored.provinceName)
                setLocation(stored)
                setIsLoading(false)
                return
            }

            // 2. Try to get GPS location
            if (typeof navigator !== 'undefined' && navigator.geolocation) {
                try {
                    const gpsLocation = await new Promise<UserLocation>((resolve, reject) => {
                        navigator.geolocation.getCurrentPosition(
                            (position) => {
                                resolve({
                                    latitude: position.coords.latitude,
                                    longitude: position.coords.longitude,
                                    source: 'gps',
                                    accuracy: position.coords.accuracy
                                })
                            },
                            (err) => {
                                reject(err)
                            },
                            {
                                enableHighAccuracy: true,
                                timeout: 10000,
                                maximumAge: 60000
                            }
                        )
                    })

                    // Check if GPS seems accurate (within Thailand bounds)
                    if (isLocationInThailand(gpsLocation.latitude, gpsLocation.longitude)) {
                        console.log('[useUserLocation] Using GPS location')
                        setLocation(gpsLocation)
                        saveLocation(gpsLocation)
                        setIsLoading(false)
                        return
                    }
                } catch (err) {
                    console.warn('[useUserLocation] GPS failed:', err)
                }
            }

            // 3. Fall back to stored location or default
            if (stored) {
                console.log('[useUserLocation] Using stored location:', stored.source)
                setLocation(stored)
            } else {
                console.log('[useUserLocation] Using default location (Bangkok)')
                setLocation(DEFAULT_LOCATION)
            }

            setIsLoading(false)
        }

        init()
    }, [])

    /**
     * Set location manually by province name
     */
    const setManualLocation = useCallback((provinceName: string, districtName?: string) => {
        // Find province in centroids
        for (const [id, data] of Object.entries(PROVINCE_CENTROIDS)) {
            if (data.name_th === provinceName) {
                const newLocation: UserLocation = {
                    latitude: data.lat,
                    longitude: data.lng,
                    source: 'manual',
                    provinceName,
                    districtName
                }
                setLocation(newLocation)
                saveLocation(newLocation)
                console.log('[useUserLocation] Set manual location:', provinceName)
                return true
            }
        }
        setError(`ไม่พบจังหวัด: ${provinceName}`)
        return false
    }, [])

    /**
     * Set location manually by coordinates
     */
    const setManualCoordinates = useCallback((lat: number, lng: number, provinceName?: string) => {
        const newLocation: UserLocation = {
            latitude: lat,
            longitude: lng,
            source: 'manual',
            provinceName
        }
        setLocation(newLocation)
        saveLocation(newLocation)
        console.log('[useUserLocation] Set manual coordinates:', lat, lng)
    }, [])

    /**
     * Request GPS location again
     */
    const refreshGPSLocation = useCallback(() => {
        setIsLoading(true)
        setError(null)

        if (typeof navigator === 'undefined' || !navigator.geolocation) {
            setError('Geolocation not supported')
            setIsLoading(false)
            return
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const newLocation: UserLocation = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    source: 'gps',
                    accuracy: position.coords.accuracy
                }
                setLocation(newLocation)
                saveLocation(newLocation)
                setIsLoading(false)
            },
            (err) => {
                setError(`GPS Error: ${err.message}`)
                setIsLoading(false)
            },
            {
                enableHighAccuracy: true,
                timeout: 15000,
                maximumAge: 0
            }
        )
    }, [])

    /**
     * Clear stored location
     */
    const clearLocation = useCallback(() => {
        if (typeof window !== 'undefined') {
            localStorage.removeItem(STORAGE_KEY)
        }
        setLocation(DEFAULT_LOCATION)
    }, [])

    return {
        location,
        isLoading,
        error,
        setManualLocation,
        setManualCoordinates,
        refreshGPSLocation,
        clearLocation,
        isManual: location?.source === 'manual',
        isGPS: location?.source === 'gps'
    }
}

/**
 * Check if coordinates are within Thailand's bounds
 */
function isLocationInThailand(lat: number, lng: number): boolean {
    // Thailand bounds: ~5.6°N to ~20.5°N, ~97.3°E to ~105.6°E
    return lat >= 5.5 && lat <= 21.0 && lng >= 97.0 && lng <= 106.0
}

/**
 * Get list of all provinces for selection
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
