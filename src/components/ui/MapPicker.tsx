'use client'

import { useEffect, useState, useCallback, useId } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L, { LeafletEvent } from 'leaflet'
import { MapPin, Navigation, Loader2 } from 'lucide-react'

// Fix for default marker icon in Next.js/Leaflet
const icon = L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
})

// Province coordinates for auto-centering
const PROVINCE_COORDS: Record<string, { lat: number; lng: number }> = {
    'กรุงเทพมหานคร': { lat: 13.7563, lng: 100.5018 },
    'นนทบุรี': { lat: 13.8622, lng: 100.5143 },
    'ปทุมธานี': { lat: 14.0208, lng: 100.5250 },
    'สมุทรปราการ': { lat: 13.5991, lng: 100.5998 },
    'ชลบุรี': { lat: 13.3611, lng: 100.9847 },
    'ระยอง': { lat: 12.6833, lng: 101.2500 },
    'เชียงใหม่': { lat: 18.7883, lng: 98.9853 },
    'เชียงราย': { lat: 19.9167, lng: 99.8333 },
    'ขอนแก่น': { lat: 16.4322, lng: 102.8236 },
    'นครราชสีมา': { lat: 14.9799, lng: 102.0978 },
    'อุดรธานี': { lat: 17.4156, lng: 102.7872 },
    'ภูเก็ต': { lat: 7.8804, lng: 98.3923 },
    'สงขลา': { lat: 7.2006, lng: 100.5953 },
    'นครศรีธรรมราช': { lat: 8.4304, lng: 99.9631 },
    'สุราษฎร์ธานี': { lat: 9.1382, lng: 99.3217 },
}

// Component to handle map center changes
function MapController({ center, zoom }: { center: [number, number], zoom?: number }) {
    const map = useMap()
    useEffect(() => {
        if (center) {
            map.setView(center, zoom || map.getZoom())
        }
    }, [center, zoom, map])
    return null
}

// Component to handle click events
function LocationMarker({
    position,
    onLocationSelect,
    draggable = true
}: {
    position: [number, number]
    onLocationSelect: (lat: number, lng: number) => void
    draggable?: boolean
}) {
    const [markerPosition, setMarkerPosition] = useState<[number, number]>(position)

    useMapEvents({
        click(e) {
            const { lat, lng } = e.latlng
            setMarkerPosition([lat, lng])
            onLocationSelect(lat, lng)
        },
    })

    useEffect(() => {
        setMarkerPosition(position)
    }, [position])

    return (
        <Marker
            position={markerPosition}
            icon={icon}
            draggable={draggable}
            eventHandlers={{
                dragend: (e: LeafletEvent) => {
                    const marker = e.target as L.Marker
                    const pos = marker.getLatLng()
                    setMarkerPosition([pos.lat, pos.lng])
                    onLocationSelect(pos.lat, pos.lng)
                }
            }}
        >
            <Popup>
                📍 พิกัด: {markerPosition[0].toFixed(6)}, {markerPosition[1].toFixed(6)}
                <br />
                <span className="text-xs text-gray-500">ลากเพื่อปรับตำแหน่ง</span>
            </Popup>
        </Marker>
    )
}

interface MapPickerProps {
    lat: number
    lng: number
    onLocationSelect: (lat: number, lng: number) => void
    province?: string
    language?: 'th' | 'en'
    compact?: boolean
}

export default function MapPicker({
    lat,
    lng,
    onLocationSelect,
    province,
    language = 'th',
    compact = false
}: MapPickerProps) {
    const mapId = useId() // Unique ID for this map instance
    const [isMounted, setIsMounted] = useState(false)
    const [showMap, setShowMap] = useState(lat !== 13.7563 || lng !== 100.5018)
    const [isGettingLocation, setIsGettingLocation] = useState(false)
    const [currentCenter, setCurrentCenter] = useState<[number, number]>([lat, lng])

    // Ensure component is mounted before rendering map (prevents SSR issues)
    useEffect(() => {
        setIsMounted(true)
        return () => setIsMounted(false)
    }, [])

    // Update center when province changes
    useEffect(() => {
        if (province && PROVINCE_COORDS[province]) {
            const coords = PROVINCE_COORDS[province]
            setCurrentCenter([coords.lat, coords.lng])
        }
    }, [province])

    // Get current GPS location (optional - graceful fallback if unavailable)
    const getCurrentLocation = useCallback(() => {
        if (!navigator.geolocation) {
            // GPS not supported - silently ignore, user can click on map
            console.log('GPS not supported on this device')
            setShowMap(true) // Just show map, let user click
            return
        }

        setIsGettingLocation(true)
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords
                setCurrentCenter([latitude, longitude])
                onLocationSelect(latitude, longitude)
                setShowMap(true)
                setIsGettingLocation(false)
            },
            (error) => {
                // GPS failed - silently ignore, just show the map
                console.log('GPS unavailable:', error.message)
                setIsGettingLocation(false)
                setShowMap(true) // Show map anyway, user can click to select
            },
            { enableHighAccuracy: true, timeout: 10000 }
        )
    }, [onLocationSelect])

    // Collapsed state - show button to expand
    if (!showMap) {
        return (
            <div className="space-y-2">
                <button
                    type="button"
                    onClick={() => setShowMap(true)}
                    className="w-full py-3 px-4 rounded-xl border-2 border-dashed border-gray-600 hover:border-purple-500 
                               bg-slate-800/50 hover:bg-slate-700/50 transition-all flex items-center justify-center gap-2
                               text-gray-400 hover:text-purple-400"
                >
                    <MapPin className="w-5 h-5" />
                    {language === 'th' ? '📍 ปักหมุดบนแผนที่' : '📍 Pin on Map'}
                </button>
                <button
                    type="button"
                    onClick={getCurrentLocation}
                    disabled={isGettingLocation}
                    className="w-full py-2 px-4 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30
                               text-blue-400 text-sm flex items-center justify-center gap-2 transition-all"
                >
                    {isGettingLocation ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                        <Navigation className="w-4 h-4" />
                    )}
                    {language === 'th' ? 'ใช้ตำแหน่งปัจจุบัน GPS' : 'Use Current GPS Location'}
                </button>
            </div>
        )
    }

    // Show loading state while waiting for mount
    if (!isMounted) {
        return (
            <div
                className="flex items-center justify-center bg-slate-800 rounded-xl"
                style={{ height: compact ? '180px' : '220px' }}
            >
                <Loader2 className="w-6 h-6 animate-spin text-purple-400" />
            </div>
        )
    }

    return (
        <div className="space-y-2">
            {/* Map Container */}
            <div className="relative z-0 rounded-xl overflow-hidden">
                <MapContainer
                    key={mapId} // Unique key prevents reuse error
                    center={currentCenter}
                    zoom={14}
                    scrollWheelZoom={true}
                    style={{
                        height: compact ? '180px' : '220px',
                        width: '100%',
                        borderRadius: '12px',
                        zIndex: 0
                    }}
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <MapController center={currentCenter} />
                    <LocationMarker
                        position={currentCenter}
                        onLocationSelect={(newLat, newLng) => {
                            setCurrentCenter([newLat, newLng])
                            onLocationSelect(newLat, newLng)
                        }}
                    />
                </MapContainer>

                {/* GPS Button Overlay */}
                <button
                    type="button"
                    onClick={getCurrentLocation}
                    disabled={isGettingLocation}
                    className="absolute top-2 right-2 z-[1000] p-2 rounded-lg bg-white/90 hover:bg-white shadow-lg 
                               text-gray-700 transition-all disabled:opacity-50"
                    title={language === 'th' ? 'ใช้ตำแหน่ง GPS' : 'Use GPS'}
                >
                    {isGettingLocation ? (
                        <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
                    ) : (
                        <Navigation className="w-5 h-5 text-blue-500" />
                    )}
                </button>
            </div>

            {/* Coordinates display */}
            <div className="flex items-center justify-between text-xs">
                <span className="text-gray-400 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-green-500" />
                    {currentCenter[0].toFixed(5)}, {currentCenter[1].toFixed(5)}
                </span>
                <span className="text-gray-500">
                    {language === 'th' ? 'คลิกหรือลากหมุด' : 'Click or drag pin'}
                </span>
            </div>
        </div>
    )
}

// Utility function to calculate distance between two points (Haversine formula)
export function calculateDistance(
    lat1: number,
    lng1: number,
    lat2: number,
    lng2: number
): { meters: number; kilometers: number; displayText: string; displayTextEn: string } {
    const R = 6371e3 // Earth radius in meters
    const φ1 = lat1 * Math.PI / 180
    const φ2 = lat2 * Math.PI / 180
    const Δφ = (lat2 - lat1) * Math.PI / 180
    const Δλ = (lng2 - lng1) * Math.PI / 180

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
        Math.cos(φ1) * Math.cos(φ2) *
        Math.sin(Δλ / 2) * Math.sin(Δλ / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

    const meters = R * c
    const kilometers = meters / 1000

    // Format display text
    let displayText: string
    let displayTextEn: string
    if (meters < 1000) {
        displayText = `${Math.round(meters)} ม.`
        displayTextEn = `${Math.round(meters)} m`
    } else if (kilometers < 10) {
        displayText = `${kilometers.toFixed(1)} กม.`
        displayTextEn = `${kilometers.toFixed(1)} km`
    } else {
        displayText = `${Math.round(kilometers)} กม.`
        displayTextEn = `${Math.round(kilometers)} km`
    }

    return { meters, kilometers, displayText, displayTextEn }
}

// Distance Badge Component for product cards
export function DistanceBadge({
    sellerLat,
    sellerLng,
    buyerLat,
    buyerLng,
    language = 'th'
}: {
    sellerLat?: number
    sellerLng?: number
    buyerLat?: number
    buyerLng?: number
    language?: 'th' | 'en'
}) {
    if (!sellerLat || !sellerLng || !buyerLat || !buyerLng) return null

    const distance = calculateDistance(buyerLat, buyerLng, sellerLat, sellerLng)
    const isNearby = distance.kilometers < 10
    const isVeryNear = distance.kilometers < 5

    return (
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium
            ${isVeryNear
                ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                : isNearby
                    ? 'bg-blue-500/20 text-blue-400'
                    : 'bg-gray-500/20 text-gray-400'
            }`}
        >
            <MapPin className="w-3 h-3" />
            {language === 'th' ? distance.displayText : distance.displayTextEn}
            {isVeryNear && (
                <span className="ml-0.5">
                    {language === 'th' ? '🔥' : ''}
                </span>
            )}
        </span>
    )
}
