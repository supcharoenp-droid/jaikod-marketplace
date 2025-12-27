'use client'

import { useState, useEffect, useCallback } from 'react'
import dynamic from 'next/dynamic'
import { MapPin, Navigation, Loader2, ChevronDown } from 'lucide-react'
import { PROVINCES, getAmphoes } from '@/services/thaiAddress'

// Dynamically import MapPicker to avoid SSR issues with Leaflet
const MapPicker = dynamic(() => import('./MapPicker'), {
    ssr: false,
    loading: () => (
        <div className="h-48 bg-slate-800 rounded-xl animate-pulse flex items-center justify-center">
            <Loader2 className="w-6 h-6 animate-spin text-purple-400" />
        </div>
    )
})

// Province coordinates for map centering
const PROVINCE_COORDS: Record<string, { lat: number; lng: number }> = {
    'กระบี่': { lat: 8.0863, lng: 98.9063 },
    'กรุงเทพมหานคร': { lat: 13.7563, lng: 100.5018 },
    'กาญจนบุรี': { lat: 14.0041, lng: 99.5489 },
    'กาฬสินธุ์': { lat: 16.4314, lng: 103.5058 },
    'กำแพงเพชร': { lat: 16.4827, lng: 99.5226 },
    'ขอนแก่น': { lat: 16.4322, lng: 102.8236 },
    'จันทบุรี': { lat: 12.6103, lng: 102.1028 },
    'ฉะเชิงเทรา': { lat: 13.6904, lng: 101.0779 },
    'ชลบุรี': { lat: 13.3611, lng: 100.9847 },
    'ชัยนาท': { lat: 15.1851, lng: 100.1251 },
    'ชัยภูมิ': { lat: 15.8068, lng: 102.0316 },
    'ชุมพร': { lat: 10.4930, lng: 99.1800 },
    'เชียงราย': { lat: 19.9167, lng: 99.8333 },
    'เชียงใหม่': { lat: 18.7883, lng: 98.9853 },
    'ตรัง': { lat: 7.5563, lng: 99.6114 },
    'ตราด': { lat: 12.2428, lng: 102.5177 },
    'ตาก': { lat: 16.8840, lng: 99.1258 },
    'นครนายก': { lat: 14.2069, lng: 101.2134 },
    'นครปฐม': { lat: 13.8196, lng: 100.0644 },
    'นครพนม': { lat: 17.3920, lng: 104.7697 },
    'นครราชสีมา': { lat: 14.9799, lng: 102.0978 },
    'นครศรีธรรมราช': { lat: 8.4304, lng: 99.9631 },
    'นครสวรรค์': { lat: 15.7030, lng: 100.1367 },
    'นนทบุรี': { lat: 13.8622, lng: 100.5143 },
    'นราธิวาส': { lat: 6.4264, lng: 101.8232 },
    'น่าน': { lat: 18.7756, lng: 100.7730 },
    'บึงกาฬ': { lat: 18.3609, lng: 103.6466 },
    'บุรีรัมย์': { lat: 14.9930, lng: 103.1029 },
    'ปทุมธานี': { lat: 14.0208, lng: 100.5250 },
    'ประจวบคีรีขันธ์': { lat: 11.8126, lng: 99.7957 },
    'ปราจีนบุรี': { lat: 14.0509, lng: 101.3685 },
    'ปัตตานี': { lat: 6.8692, lng: 101.2508 },
    'พระนครศรีอยุธยา': { lat: 14.3692, lng: 100.5877 },
    'พะเยา': { lat: 19.1664, lng: 99.9018 },
    'พังงา': { lat: 8.4513, lng: 98.5180 },
    'พัทลุง': { lat: 7.6167, lng: 100.0833 },
    'พิจิตร': { lat: 16.4429, lng: 100.3488 },
    'พิษณุโลก': { lat: 16.8211, lng: 100.2659 },
    'เพชรบุรี': { lat: 13.1119, lng: 99.9398 },
    'เพชรบูรณ์': { lat: 16.4190, lng: 101.1566 },
    'แพร่': { lat: 18.1445, lng: 100.1403 },
    'ภูเก็ต': { lat: 7.8804, lng: 98.3923 },
    'มหาสารคาม': { lat: 16.1850, lng: 103.3009 },
    'มุกดาหาร': { lat: 16.5449, lng: 104.7236 },
    'แม่ฮ่องสอน': { lat: 19.3020, lng: 97.9654 },
    'ยโสธร': { lat: 15.7930, lng: 104.1451 },
    'ยะลา': { lat: 6.5400, lng: 101.2800 },
    'ร้อยเอ็ด': { lat: 16.0538, lng: 103.6520 },
    'ระนอง': { lat: 9.9528, lng: 98.6085 },
    'ระยอง': { lat: 12.6833, lng: 101.2500 },
    'ราชบุรี': { lat: 13.5282, lng: 99.8134 },
    'ลพบุรี': { lat: 14.7995, lng: 100.6534 },
    'ลำปาง': { lat: 18.2855, lng: 99.4908 },
    'ลำพูน': { lat: 18.5742, lng: 99.0087 },
    'เลย': { lat: 17.4860, lng: 101.7223 },
    'ศรีสะเกษ': { lat: 15.1186, lng: 104.3220 },
    'สกลนคร': { lat: 17.1545, lng: 104.1348 },
    'สงขลา': { lat: 7.2006, lng: 100.5953 },
    'สตูล': { lat: 6.6238, lng: 100.0673 },
    'สมุทรปราการ': { lat: 13.5991, lng: 100.5998 },
    'สมุทรสงคราม': { lat: 13.4094, lng: 100.0023 },
    'สมุทรสาคร': { lat: 13.5475, lng: 100.2745 },
    'สระแก้ว': { lat: 13.8240, lng: 102.0645 },
    'สระบุรี': { lat: 14.5286, lng: 100.9101 },
    'สิงห์บุรี': { lat: 14.8936, lng: 100.3967 },
    'สุโขทัย': { lat: 17.0078, lng: 99.8232 },
    'สุพรรณบุรี': { lat: 14.4744, lng: 100.1177 },
    'สุราษฎร์ธานี': { lat: 9.1382, lng: 99.3217 },
    'สุรินทร์': { lat: 14.8818, lng: 103.4936 },
    'หนองคาย': { lat: 17.8783, lng: 102.7420 },
    'หนองบัวลำภู': { lat: 17.2218, lng: 102.4260 },
    'อ่างทอง': { lat: 14.5896, lng: 100.4549 },
    'อำนาจเจริญ': { lat: 15.8656, lng: 104.6263 },
    'อุดรธานี': { lat: 17.4156, lng: 102.7872 },
    'อุตรดิตถ์': { lat: 17.6200, lng: 100.0993 },
    'อุทัยธานี': { lat: 15.3797, lng: 100.0245 },
    'อุบลราชธานี': { lat: 15.2286, lng: 104.8564 },
}

interface ThaiLocationPickerProps {
    province: string
    amphoe: string
    lat?: number
    lng?: number
    onProvinceChange: (province: string) => void
    onAmphoeChange: (amphoe: string) => void
    onLocationChange?: (lat: number, lng: number) => void
    language?: 'th' | 'en'
    showMap?: boolean
    compact?: boolean
    hideAmphoe?: boolean  // Hide amphoe dropdown (for registration province only)
}

export default function ThaiLocationPicker({
    province,
    amphoe,
    lat,
    lng,
    onProvinceChange,
    onAmphoeChange,
    onLocationChange,
    language = 'th',
    showMap = true,
    compact = false,
    hideAmphoe = false  // Hide amphoe for registration province only
}: ThaiLocationPickerProps) {
    const [amphoes, setAmphoes] = useState<string[]>([])
    const [isLoadingAmphoes, setIsLoadingAmphoes] = useState(false)
    const [mapVisible, setMapVisible] = useState(false)
    const [currentLat, setCurrentLat] = useState(lat || 13.7563)
    const [currentLng, setCurrentLng] = useState(lng || 100.5018)

    // Load amphoes when province changes
    useEffect(() => {
        if (province) {
            setIsLoadingAmphoes(true)
            getAmphoes(province).then((data) => {
                setAmphoes(data)
                setIsLoadingAmphoes(false)
            }).catch(() => {
                setAmphoes([])
                setIsLoadingAmphoes(false)
            })

            // Update map center based on province (only set internal state, don't call parent callback here)
            if (PROVINCE_COORDS[province]) {
                const coords = PROVINCE_COORDS[province]
                setCurrentLat(coords.lat)
                setCurrentLng(coords.lng)
            }
        } else {
            setAmphoes([])
        }
        // NOTE: onLocationChange is intentionally excluded to prevent infinite loops
        // Location change callback is triggered by user actions (click/drag) not province selection
    }, [province])

    // GPS state
    const [isGettingLocation, setIsGettingLocation] = useState(false)
    const [gpsError, setGpsError] = useState<string | null>(null)

    // Handle GPS location
    const getCurrentLocation = useCallback(() => {
        if (!navigator.geolocation) {
            setGpsError(language === 'th' ? 'Browser ไม่รองรับ GPS' : 'GPS not supported')
            setTimeout(() => setGpsError(null), 3000)
            return
        }

        setIsGettingLocation(true)
        setGpsError(null)

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords
                setCurrentLat(latitude)
                setCurrentLng(longitude)
                setMapVisible(true)
                setIsGettingLocation(false)
                if (onLocationChange) {
                    onLocationChange(latitude, longitude)
                }
            },
            (error) => {
                console.warn('Geolocation error:', error.message)
                setIsGettingLocation(false)
                // Show friendly error message based on error code
                let errorMsg = language === 'th' ? 'ไม่สามารถดึงตำแหน่งได้' : 'Could not get location'
                if (error.code === 1) {
                    errorMsg = language === 'th' ? 'กรุณาอนุญาตการเข้าถึงตำแหน่ง' : 'Please allow location access'
                } else if (error.code === 2) {
                    errorMsg = language === 'th' ? 'ไม่มีสัญญาณ GPS' : 'Position unavailable'
                } else if (error.code === 3) {
                    errorMsg = language === 'th' ? 'หมดเวลาค้นหาตำแหน่ง' : 'Location timeout'
                }
                setGpsError(errorMsg)
                // Auto-hide error after 3 seconds
                setTimeout(() => setGpsError(null), 3000)
            },
            { enableHighAccuracy: true, timeout: 10000 }
        )
    }, [language, onLocationChange])

    // State for reverse geocoding
    const [isReverseGeocoding, setIsReverseGeocoding] = useState(false)

    // Reverse Geocode: Get province/amphoe from coordinates
    const reverseGeocode = useCallback(async (lat: number, lng: number) => {
        setIsReverseGeocoding(true)
        try {
            // Use Nominatim (OpenStreetMap) for reverse geocoding - free, no API key needed
            const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=th&addressdetails=1`,
                {
                    headers: {
                        'User-Agent': 'JaiKod-Marketplace/1.0'
                    }
                }
            )

            if (!response.ok) throw new Error('Reverse geocoding failed')

            const data = await response.json()
            const address = data.address || {}

            // Extract province (state) and amphoe (county/city_district)
            // Nominatim returns Thai admin divisions as:
            // - state = จังหวัด
            // - county or city_district = อำเภอ/เขต
            let detectedProvince = address.state || address.province || ''
            let detectedAmphoe = address.county || address.city_district || address.suburb || ''

            // Clean up province name (remove "จังหวัด" prefix if present)
            if (detectedProvince.startsWith('จังหวัด')) {
                detectedProvince = detectedProvince.replace('จังหวัด', '').trim()
            }
            // Handle Bangkok special case
            if (detectedProvince === 'กรุงเทพ' || address.city === 'กรุงเทพมหานคร') {
                detectedProvince = 'กรุงเทพมหานคร'
            }

            // Clean up amphoe name (remove "อำเภอ" or "เขต" prefix)
            if (detectedAmphoe.startsWith('อำเภอ')) {
                detectedAmphoe = detectedAmphoe.replace('อำเภอ', '').trim()
            } else if (detectedAmphoe.startsWith('เขต')) {
                detectedAmphoe = detectedAmphoe.replace('เขต', '').trim()
            }

            console.log('Reverse geocode result:', { detectedProvince, detectedAmphoe, raw: address })

            // Update province and amphoe if detected
            if (detectedProvince && PROVINCES.includes(detectedProvince)) {
                onProvinceChange(detectedProvince)
                // Wait a bit for amphoe list to load, then set amphoe
                setTimeout(() => {
                    if (detectedAmphoe) {
                        onAmphoeChange(detectedAmphoe)
                    }
                }, 500)
            }
        } catch (error) {
            console.warn('Reverse geocoding error:', error)
            // Don't show error to user - just keep existing province/amphoe
        } finally {
            setIsReverseGeocoding(false)
        }
    }, [onProvinceChange, onAmphoeChange])

    const handleMapLocationSelect = useCallback((newLat: number, newLng: number) => {
        setCurrentLat(newLat)
        setCurrentLng(newLng)
        if (onLocationChange) {
            onLocationChange(newLat, newLng)
        }

        // Trigger reverse geocoding to auto-detect province/amphoe
        reverseGeocode(newLat, newLng)
    }, [onLocationChange, reverseGeocode])

    return (
        <div className="space-y-3">
            {/* Province & Amphoe Row */}
            <div className="grid grid-cols-2 gap-2">
                {/* Province Dropdown */}
                <div>
                    <label className="block text-xs text-gray-400 mb-1">
                        {language === 'th' ? 'จังหวัด' : 'Province'}
                        <span className="text-red-400 ml-1">*</span>
                    </label>
                    <div className="relative">
                        <select
                            value={province}
                            onChange={(e) => {
                                onProvinceChange(e.target.value)
                                onAmphoeChange('') // Reset amphoe
                            }}
                            className="w-full px-3 py-2 bg-slate-700/50 border border-white/10 rounded-lg text-white text-sm 
                                     focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent 
                                     transition-all appearance-none cursor-pointer pr-8"
                        >
                            <option value="" className="bg-slate-800">
                                {language === 'th' ? '-- เลือกจังหวัด --' : '-- Select Province --'}
                            </option>
                            {PROVINCES.map((prov) => (
                                <option key={prov} value={prov} className="bg-slate-800">
                                    {prov}
                                </option>
                            ))}
                        </select>
                        <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    </div>
                </div>

                {/* Amphoe Dropdown - Hidden for registration province */}
                {!hideAmphoe && (
                    <div>
                        <label className="block text-xs text-gray-400 mb-1">
                            {language === 'th' ? 'อำเภอ/เขต' : 'District'}
                        </label>
                        <div className="relative">
                            <select
                                value={amphoe}
                                onChange={(e) => onAmphoeChange(e.target.value)}
                                disabled={!province || isLoadingAmphoes}
                                className="w-full px-3 py-2 bg-slate-700/50 border border-white/10 rounded-lg text-white text-sm 
                                     focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent 
                                     transition-all appearance-none cursor-pointer pr-8 disabled:opacity-50"
                            >
                                <option value="" className="bg-slate-800">
                                    {isLoadingAmphoes
                                        ? (language === 'th' ? 'กำลังโหลด...' : 'Loading...')
                                        : (language === 'th' ? '-- เลือกอำเภอ --' : '-- Select District --')
                                    }
                                </option>
                                {amphoes.map((amp) => (
                                    <option key={amp} value={amp} className="bg-slate-800">
                                        {amp}
                                    </option>
                                ))}
                            </select>
                            {isLoadingAmphoes ? (
                                <Loader2 className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400 animate-spin pointer-events-none" />
                            ) : (
                                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Map Section */}
            {showMap && (
                <div className="space-y-2">
                    {!mapVisible ? (
                        <div className="space-y-1.5">
                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    onClick={() => setMapVisible(true)}
                                    disabled={!province}
                                    className="flex-1 py-2.5 px-4 rounded-xl border-2 border-dashed border-gray-600 hover:border-purple-500 
                                               bg-slate-800/50 hover:bg-slate-700/50 transition-all flex items-center justify-center gap-2
                                               text-gray-400 hover:text-purple-400 text-sm disabled:opacity-40 disabled:cursor-not-allowed"
                                >
                                    <MapPin className="w-4 h-4" />
                                    {language === 'th' ? '📍 เลือกจากแผนที่' : '📍 Select on Map'}
                                </button>
                                <button
                                    type="button"
                                    onClick={getCurrentLocation}
                                    disabled={isGettingLocation}
                                    className="py-2.5 px-4 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30
                                               text-blue-400 text-sm flex items-center justify-center gap-2 transition-all
                                               disabled:opacity-50 disabled:cursor-wait"
                                    title={language === 'th' ? 'ใช้ GPS (ถ้ามี)' : 'Use GPS (if available)'}
                                >
                                    {isGettingLocation ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                        <Navigation className="w-4 h-4" />
                                    )}
                                </button>
                            </div>
                            {/* Helper text for desktop users */}
                            <p className="text-xs text-gray-500 text-center">
                                {language === 'th'
                                    ? '💡 คลิกแผนที่เพื่อเลือกตำแหน่ง (ไม่จำเป็นต้องใช้ GPS)'
                                    : '💡 Click on map to select location (GPS optional)'}
                            </p>
                            {/* GPS Error/Info Message */}
                            {gpsError && (
                                <div className="text-xs flex items-center justify-between gap-2 px-2 py-1.5 bg-slate-700/50 rounded-lg">
                                    <span className="text-amber-400">⚠️ {gpsError}</span>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setGpsError(null)
                                            setMapVisible(true)
                                        }}
                                        className="text-purple-400 hover:text-purple-300 underline"
                                    >
                                        {language === 'th' ? 'เลือกจากแผนที่แทน' : 'Use map instead'}
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="space-y-2">
                            <MapPicker
                                lat={currentLat}
                                lng={currentLng}
                                onLocationSelect={handleMapLocationSelect}
                                province={province}
                                language={language}
                                compact={compact}
                            />
                            <div className="flex items-center justify-between text-xs">
                                <span className="text-green-400 flex items-center gap-1">
                                    <MapPin className="w-3 h-3" />
                                    ✓ พิกัด: {currentLat.toFixed(4)}, {currentLng.toFixed(4)}
                                    {isReverseGeocoding && (
                                        <span className="ml-2 text-purple-400 flex items-center gap-1">
                                            <Loader2 className="w-3 h-3 animate-spin" />
                                            {language === 'th' ? 'วิเคราะห์...' : 'Analyzing...'}
                                        </span>
                                    )}
                                </span>
                                <button
                                    type="button"
                                    onClick={() => setMapVisible(false)}
                                    className="text-gray-500 hover:text-gray-300 transition-colors"
                                >
                                    {language === 'th' ? 'ซ่อนแผนที่' : 'Hide Map'}
                                </button>
                            </div>
                            {/* Reverse Geocoding Result Hint */}
                            {!isReverseGeocoding && province && (
                                <p className="text-xs text-gray-500">
                                    💡 {language === 'th'
                                        ? 'ลากหมุดเพื่อเปลี่ยนตำแหน่ง - จังหวัด/อำเภอจะอัปเดตอัตโนมัติ'
                                        : 'Drag pin to change - province/district updates automatically'}
                                </p>
                            )}
                        </div>
                    )}
                </div>
            )}

            {/* Location Summary */}
            {province && (
                <div className="text-xs text-gray-400 flex items-center gap-2 p-2 bg-slate-800/50 rounded-lg">
                    <MapPin className="w-3 h-3 text-purple-400" />
                    <span>
                        📍 {province}
                        {amphoe && ` » ${amphoe}`}
                    </span>
                </div>
            )}
        </div>
    )
}
