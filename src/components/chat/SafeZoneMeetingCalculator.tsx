/**
 * SafeZone Meeting Calculator
 * 
 * AI-powered system to calculate optimal meeting points between buyer and seller
 * Features:
 * - Calculate midpoint between two locations
 * - Find safe zones near the midpoint
 * - Consider factors like safety rating, operating hours, parking
 * - Suggest best meeting times
 */

'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    MapPin, Navigation, Shield, Clock, Car, Star,
    Users, ChevronRight, Locate, Check, AlertTriangle,
    Store, Building2, Coffee, ShoppingBag, Sparkles
} from 'lucide-react';

// Types
interface Location {
    lat: number;
    lng: number;
    address?: string;
    province?: string;
    amphoe?: string;
}

interface SafeZoneSpot {
    id: string;
    name: string;
    type: 'mall' | 'convenience_store' | 'police_station' | 'gas_station' | 'restaurant' | 'bank';
    location: Location;
    distance: number; // km from midpoint
    safety_score: number; // 1-100
    operating_hours: string;
    has_cctv: boolean;
    has_parking: boolean;
    verification_status: 'verified' | 'unverified';
    features: string[];
    photo_url?: string;
}

interface MeetingAnalysis {
    buyer_location: Location | null;
    seller_location: Location | null;
    midpoint: Location | null;
    recommended_spots: SafeZoneSpot[];
    travel_time_buyer?: string;
    travel_time_seller?: string;
    suggested_time_slots: string[];
    safety_tips: string[];
}

interface SafeZoneMeetingCalculatorProps {
    sellerId: string;
    sellerLocation?: Location;
    buyerLocation?: Location;
    /** Listing location as fallback for seller location */
    listingLocation?: Location;
    productId?: string;
    onSelectSpot?: (spot: SafeZoneSpot) => void;
    onSendMeetingRequest?: (spot: SafeZoneSpot, timeSlot: string) => void;
    /** Callback to send a location request message in chat */
    onRequestSellerLocation?: () => Promise<void>;
    /** Callback when buyer shares their location */
    onShareMyLocation?: (location: Location) => Promise<void>;
}

// Import SafeZone service (scalable architecture)
import { searchSafeZones, calculateDistance as calcDist } from '@/lib/safezone/service';
import { SafeZoneSpot as ServiceSafeZoneSpot } from '@/lib/safezone/types';

// Convert service SafeZoneSpot to component SafeZoneSpot
function convertToComponentSpot(spot: ServiceSafeZoneSpot): SafeZoneSpot {
    return {
        id: spot.id,
        name: spot.name,
        type: spot.type as SafeZoneSpot['type'],
        location: {
            lat: spot.location.lat,
            lng: spot.location.lng,
            province: spot.location.province || spot.province,
            amphoe: spot.location.amphoe,
        },
        distance: spot.distance || 0,
        safety_score: spot.safety_score,
        operating_hours: spot.operating_hours,
        has_cctv: spot.has_cctv,
        has_parking: spot.has_parking,
        verification_status: spot.verification_status as 'verified' | 'unverified',
        features: spot.features,
        photo_url: spot.photo_url,
    };
}

// Utility Functions
function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(R * c * 10) / 10; // Round to 1 decimal
}

function calculateMidpoint(loc1: Location, loc2: Location): Location {
    return {
        lat: (loc1.lat + loc2.lat) / 2,
        lng: (loc1.lng + loc2.lng) / 2,
    };
}

function estimateTravelTime(distance: number): string {
    // Rough estimate: 30km/h average in Bangkok traffic
    const hours = distance / 30;
    if (hours < 1) {
        return `${Math.round(hours * 60)} นาที`;
    }
    return `${hours.toFixed(1)} ชม.`;
}

function getTypeIcon(type: SafeZoneSpot['type']) {
    switch (type) {
        case 'mall': return <ShoppingBag className="w-4 h-4" />;
        case 'convenience_store': return <Store className="w-4 h-4" />;
        case 'police_station': return <Shield className="w-4 h-4" />;
        case 'gas_station': return <Car className="w-4 h-4" />;
        case 'restaurant': return <Coffee className="w-4 h-4" />;
        case 'bank': return <Building2 className="w-4 h-4" />;
        default: return <MapPin className="w-4 h-4" />;
    }
}

function getSafetyBadgeColor(score: number): string {
    if (score >= 90) return 'bg-green-500';
    if (score >= 70) return 'bg-yellow-500';
    return 'bg-orange-500';
}

// Main Component
export default function SafeZoneMeetingCalculator({
    sellerId,
    sellerLocation,
    buyerLocation,
    listingLocation,
    productId,
    onSelectSpot,
    onSendMeetingRequest,
    onRequestSellerLocation,
    onShareMyLocation
}: SafeZoneMeetingCalculatorProps) {
    const [isLocating, setIsLocating] = useState(false);
    const [isLoadingSellerLoc, setIsLoadingSellerLoc] = useState(false);
    const [myLocation, setMyLocation] = useState<Location | null>(buyerLocation || null);
    const [fetchedSellerLocation, setFetchedSellerLocation] = useState<Location | null>(sellerLocation || null);
    const [locationRequestSent, setLocationRequestSent] = useState(false);
    const [selectedSpot, setSelectedSpot] = useState<SafeZoneSpot | null>(null);
    const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('');
    const [analysis, setAnalysis] = useState<MeetingAnalysis | null>(null);
    const [showMapPicker, setShowMapPicker] = useState(false);
    const [manualProvince, setManualProvince] = useState<string>('');

    // Use provided sellerLocation, listingLocation, or fetched one as fallback
    const effectiveSellerLocation = sellerLocation || listingLocation || fetchedSellerLocation;

    // Auto-request GPS on mount (silent, non-blocking)
    useEffect(() => {
        if (myLocation) return; // Already have location
        if (!navigator.geolocation) return;

        // Silent auto-request (no alert on failure)
        navigator.geolocation.getCurrentPosition(
            (position) => {
                setMyLocation({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                });
            },
            () => {
                // Silent fail - user can manually request later
                console.log('Auto GPS request denied or failed');
            },
            { enableHighAccuracy: false, timeout: 5000, maximumAge: 60000 }
        );
    }, []); // Run only on mount

    // Try to get seller location from profile on mount
    useEffect(() => {
        const fetchSellerLocation = async () => {
            if (sellerLocation || !sellerId) return;

            setIsLoadingSellerLoc(true);
            try {
                // Try to get from user profile in Firebase
                const { getUserProfile } = await import('@/lib/user');
                const profile = await getUserProfile(sellerId);

                if (profile?.location && typeof profile.location === 'object' &&
                    'lat' in profile.location && 'lng' in profile.location) {
                    setFetchedSellerLocation({
                        lat: profile.location.lat,
                        lng: profile.location.lng,
                        province: profile.location.province,
                        amphoe: profile.location.amphoe,
                    });
                } else if (profile?.location?.province) {
                    // Fallback to province-based location (approximate) - All 77 provinces
                    const PROVINCE_CENTERS: Record<string, { lat: number; lng: number }> = {
                        // ภาคกลาง
                        'กรุงเทพมหานคร': { lat: 13.7563, lng: 100.5018 },
                        'นนทบุรี': { lat: 13.8621, lng: 100.5144 },
                        'ปทุมธานี': { lat: 14.0208, lng: 100.5254 },
                        'สมุทรปราการ': { lat: 13.5990, lng: 100.5998 },
                        'นครปฐม': { lat: 13.8196, lng: 100.0629 },
                        'สมุทรสาคร': { lat: 13.5475, lng: 100.2747 },
                        'สมุทรสงคราม': { lat: 13.4098, lng: 100.0021 },
                        'พระนครศรีอยุธยา': { lat: 14.3692, lng: 100.5877 },
                        'อ่างทอง': { lat: 14.5896, lng: 100.4549 },
                        'ลพบุรี': { lat: 14.7995, lng: 100.6534 },
                        'สิงห์บุรี': { lat: 14.8936, lng: 100.3967 },
                        'ชัยนาท': { lat: 15.1851, lng: 100.1251 },
                        'สระบุรี': { lat: 14.5289, lng: 100.9108 },
                        'นครนายก': { lat: 14.2069, lng: 101.2131 },
                        'ปราจีนบุรี': { lat: 14.0509, lng: 101.3725 },
                        'สระแก้ว': { lat: 13.8240, lng: 102.0645 },
                        // ภาคตะวันออก
                        'ชลบุรี': { lat: 13.3611, lng: 100.9847 },
                        'ระยอง': { lat: 12.6814, lng: 101.2816 },
                        'จันทบุรี': { lat: 12.6111, lng: 102.1036 },
                        'ตราด': { lat: 12.2428, lng: 102.5177 },
                        'ฉะเชิงเทรา': { lat: 13.6904, lng: 101.0779 },
                        // ภาคเหนือ
                        'เชียงใหม่': { lat: 18.7883, lng: 98.9853 },
                        'เชียงราย': { lat: 19.9105, lng: 99.8406 },
                        'ลำพูน': { lat: 18.5744, lng: 99.0087 },
                        'ลำปาง': { lat: 18.2888, lng: 99.4908 },
                        'แพร่': { lat: 18.1445, lng: 100.1403 },
                        'น่าน': { lat: 18.7756, lng: 100.7730 },
                        'พะเยา': { lat: 19.1664, lng: 99.9016 },
                        'แม่ฮ่องสอน': { lat: 19.2990, lng: 97.9654 },
                        'อุตรดิตถ์': { lat: 17.6200, lng: 100.0993 },
                        'พิษณุโลก': { lat: 16.8211, lng: 100.2659 },
                        'สุโขทัย': { lat: 17.0076, lng: 99.8230 },
                        'ตาก': { lat: 16.8840, lng: 99.1259 },
                        'กำแพงเพชร': { lat: 16.4827, lng: 99.5226 },
                        'พิจิตร': { lat: 16.4429, lng: 100.3487 },
                        'เพชรบูรณ์': { lat: 16.4189, lng: 101.1591 },
                        'นครสวรรค์': { lat: 15.7047, lng: 100.1373 },
                        'อุทัยธานี': { lat: 15.3812, lng: 100.0246 },
                        // ภาคตะวันออกเฉียงเหนือ
                        'นครราชสีมา': { lat: 14.9799, lng: 102.0977 },
                        'ขอนแก่น': { lat: 16.4322, lng: 102.8236 },
                        'อุดรธานี': { lat: 17.4156, lng: 102.7872 },
                        'อุบลราชธานี': { lat: 15.2287, lng: 104.8564 },
                        'กาฬสินธุ์': { lat: 16.4314, lng: 103.5058 },
                        'ชัยภูมิ': { lat: 15.8068, lng: 102.0316 },
                        'บุรีรัมย์': { lat: 14.9951, lng: 103.1029 },
                        'มหาสารคาม': { lat: 16.1851, lng: 103.3013 },
                        'ร้อยเอ็ด': { lat: 16.0539, lng: 103.6520 },
                        'ศรีสะเกษ': { lat: 15.1186, lng: 104.3224 },
                        'สกลนคร': { lat: 17.1545, lng: 104.1348 },
                        'สุรินทร์': { lat: 14.8818, lng: 103.4936 },
                        'หนองคาย': { lat: 17.8782, lng: 102.7410 },
                        'หนองบัวลำภู': { lat: 17.2218, lng: 102.4260 },
                        'เลย': { lat: 17.4860, lng: 101.7223 },
                        'ยโสธร': { lat: 15.7921, lng: 104.1452 },
                        'อำนาจเจริญ': { lat: 15.8656, lng: 104.6258 },
                        'มุกดาหาร': { lat: 16.5453, lng: 104.7235 },
                        'นครพนม': { lat: 17.3920, lng: 104.7695 },
                        'บึงกาฬ': { lat: 18.3609, lng: 103.6466 },
                        // ภาคตะวันตก
                        'กาญจนบุรี': { lat: 14.0227, lng: 99.5328 },
                        'ราชบุรี': { lat: 13.5282, lng: 99.8134 },
                        'สุพรรณบุรี': { lat: 14.4744, lng: 100.1177 },
                        'เพชรบุรี': { lat: 13.1112, lng: 99.9397 },
                        'ประจวบคีรีขันธ์': { lat: 11.8126, lng: 99.7957 },
                        // ภาคใต้
                        'สุราษฎร์ธานี': { lat: 9.1382, lng: 99.3219 },
                        'นครศรีธรรมราช': { lat: 8.4322, lng: 99.9631 },
                        'สงขลา': { lat: 7.1756, lng: 100.6143 },
                        'ภูเก็ต': { lat: 7.8804, lng: 98.3923 },
                        'กระบี่': { lat: 8.0863, lng: 98.9063 },
                        'ชุมพร': { lat: 10.4930, lng: 99.1800 },
                        'ระนอง': { lat: 9.9528, lng: 98.6385 },
                        'พังงา': { lat: 8.4504, lng: 98.5255 },
                        'ตรัง': { lat: 7.5645, lng: 99.6239 },
                        'พัทลุง': { lat: 7.6167, lng: 100.0740 },
                        'สตูล': { lat: 6.6238, lng: 100.0673 },
                        'ปัตตานี': { lat: 6.8676, lng: 101.2502 },
                        'ยะลา': { lat: 6.5414, lng: 101.2803 },
                        'นราธิวาส': { lat: 6.4264, lng: 101.8253 },
                    };
                    const center = PROVINCE_CENTERS[profile.location.province];
                    if (center) {
                        setFetchedSellerLocation({
                            ...center,
                            province: profile.location.province,
                        });
                    }
                }
            } catch (error) {
                console.error('Error fetching seller location:', error);
            } finally {
                setIsLoadingSellerLoc(false);
            }
        };

        fetchSellerLocation();
    }, [sellerId, sellerLocation]);

    // Get user's current location
    const handleGetMyLocation = () => {
        if (!navigator.geolocation) {
            alert('เบราว์เซอร์ไม่รองรับการระบุตำแหน่ง กรุณาใช้มือถือหรือเปิด Location Permission');
            return;
        }

        setIsLocating(true);
        navigator.geolocation.getCurrentPosition(
            (position) => {
                setMyLocation({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                });
                setIsLocating(false);
            },
            (error) => {
                console.error('Geolocation error:', error);
                // More helpful error messages
                let message = 'ไม่สามารถระบุตำแหน่งได้';
                if (error.code === 1) {
                    message = 'กรุณาอนุญาตให้เข้าถึงตำแหน่งในเบราว์เซอร์';
                } else if (error.code === 2) {
                    message = 'ไม่สามารถระบุตำแหน่งได้ (ลองเชื่อมต่อ WiFi หรือใช้มือถือ)';
                } else if (error.code === 3) {
                    message = 'การระบุตำแหน่งใช้เวลานานเกินไป โปรดลองอีกครั้ง';
                }
                alert(message);
                setIsLocating(false);
            },
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 30000 }
        );
    };

    // Request location from seller via chat
    const handleRequestSellerLocation = async () => {
        setLocationRequestSent(true);
        try {
            if (onRequestSellerLocation) {
                await onRequestSellerLocation();
            }
        } catch (error) {
            console.error('Error requesting seller location:', error);
        }
        // Reset after 10 seconds
        setTimeout(() => setLocationRequestSent(false), 10000);
    };

    // Share my location with seller
    const handleShareMyLocation = async (location: Location) => {
        try {
            if (onShareMyLocation) {
                await onShareMyLocation(location);
            }
        } catch (error) {
            console.error('Error sharing location:', error);
        }
    };

    // Handle getting location and optionally sharing it
    const handleGetAndShareLocation = () => {
        if (!navigator.geolocation) {
            alert('เบราว์เซอร์ไม่รองรับการระบุตำแหน่ง กรุณาใช้มือถือหรือเปิด Location Permission');
            return;
        }

        setIsLocating(true);
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const newLocation = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                };
                setMyLocation(newLocation);
                setIsLocating(false);

                // Optionally share with seller
                if (onShareMyLocation) {
                    await handleShareMyLocation(newLocation);
                }
            },
            (error) => {
                console.error('Geolocation error:', error);
                let message = 'ไม่สามารถระบุตำแหน่งได้';
                if (error.code === 1) {
                    message = 'กรุณาอนุญาตให้เข้าถึงตำแหน่งในเบราว์เซอร์';
                } else if (error.code === 2) {
                    message = 'ไม่สามารถระบุตำแหน่งได้ (ลองเชื่อมต่อ WiFi หรือใช้มือถือ)';
                } else if (error.code === 3) {
                    message = 'การระบุตำแหน่งใช้เวลานานเกินไป โปรดลองอีกครั้ง';
                }
                alert(message);
                setIsLocating(false);
            },
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 30000 }
        );
    };

    // State for SafeZone spots (fetched from service)
    const [safeZoneSpots, setSafeZoneSpots] = useState<SafeZoneSpot[]>([]);

    // Fetch SafeZone spots when locations change
    useEffect(() => {
        const fetchSafeZones = async () => {
            const buyer = myLocation;
            const seller = effectiveSellerLocation || null;

            try {
                const result = await searchSafeZones({
                    buyerLocation: buyer || undefined,
                    sellerLocation: seller || undefined,
                    limit: 5
                });

                const convertedSpots = result.spots.map(convertToComponentSpot);
                setSafeZoneSpots(convertedSpots);
            } catch (error) {
                console.error('[SafeZone] Error fetching spots:', error);
                // Fallback to empty array
                setSafeZoneSpots([]);
            }
        };

        fetchSafeZones();
    }, [myLocation, effectiveSellerLocation]);

    // Calculate meeting analysis when locations change
    const meetingAnalysis = useMemo<MeetingAnalysis>(() => {
        const buyer = myLocation;
        const seller = effectiveSellerLocation || null;

        if (!buyer || !seller) {
            return {
                buyer_location: buyer,
                seller_location: seller,
                midpoint: null,
                recommended_spots: safeZoneSpots.length > 0 ? safeZoneSpots.slice(0, 3) : [],
                suggested_time_slots: ['10:00-12:00', '13:00-15:00', '16:00-18:00', '19:00-21:00'],
                safety_tips: [
                    'นัดพบในที่สาธารณะเท่านั้น',
                    'แจ้งคนรู้จักก่อนไปนัดพบ',
                    'หลีกเลี่ยงการนัดพบในที่ลับตา',
                ],
            };
        }

        // Calculate midpoint
        const midpoint = calculateMidpoint(buyer, seller);

        // Use pre-fetched spots with distance
        const spotsWithDistance = safeZoneSpots.length > 0
            ? safeZoneSpots.slice(0, 5)
            : [];

        // Calculate travel times
        const buyerToMidpoint = calculateDistance(buyer.lat, buyer.lng, midpoint.lat, midpoint.lng);
        const sellerToMidpoint = calculateDistance(seller.lat, seller.lng, midpoint.lat, midpoint.lng);

        return {
            buyer_location: buyer,
            seller_location: seller,
            midpoint,
            recommended_spots: spotsWithDistance,
            travel_time_buyer: estimateTravelTime(buyerToMidpoint),
            travel_time_seller: estimateTravelTime(sellerToMidpoint),
            suggested_time_slots: ['10:00-12:00', '13:00-15:00', '16:00-18:00', '19:00-21:00'],
            safety_tips: [
                'ตรวจสอบตัวตนก่อนนัดพบจริง',
                'นัดในที่มี CCTV เสมอ',
                'แจ้ง Live Location ให้คนรู้จัก',
                'ตรวจเช็คสินค้าก่อนโอนเงิน',
            ],
        };
    }, [myLocation, effectiveSellerLocation, safeZoneSpots]);

    const handleSelectSpot = (spot: SafeZoneSpot) => {
        setSelectedSpot(spot);
        onSelectSpot?.(spot);
    };

    const handleSendMeetingRequest = () => {
        if (!selectedSpot || !selectedTimeSlot) return;
        onSendMeetingRequest?.(selectedSpot, selectedTimeSlot);
    };

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                        <Shield className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-gray-900 dark:text-white">SafeZone Meeting</h3>
                        <p className="text-xs text-gray-500">AI คำนวณจุดนัดที่ปลอดภัย</p>
                    </div>
                </div>
                <div className="flex items-center gap-1 text-[10px] font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">
                    <Sparkles className="w-3 h-3" />
                    AI
                </div>
            </div>

            {/* Location Setup */}
            <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-xl space-y-2">
                {/* My Location */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center">
                            <Users className="w-3 h-3 text-white" />
                        </div>
                        <span className="text-xs font-medium text-gray-700 dark:text-gray-300">ตำแหน่งของฉัน</span>
                    </div>
                    {myLocation ? (
                        <span className="text-xs text-green-600 flex items-center gap-1">
                            <Check className="w-3 h-3" />
                            ระบุแล้ว
                        </span>
                    ) : (
                        <button
                            onClick={handleGetAndShareLocation}
                            disabled={isLocating}
                            className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 font-medium"
                        >
                            {isLocating ? (
                                <>
                                    <div className="w-3 h-3 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                                    กำลังค้นหา...
                                </>
                            ) : (
                                <>
                                    <Locate className="w-3 h-3" />
                                    ระบุตำแหน่ง
                                </>
                            )}
                        </button>
                    )}
                </div>

                {/* Seller Location */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-purple-500 flex items-center justify-center">
                            <Store className="w-3 h-3 text-white" />
                        </div>
                        <span className="text-xs font-medium text-gray-700 dark:text-gray-300">ตำแหน่งผู้ขาย</span>
                    </div>
                    {effectiveSellerLocation ? (
                        <span className="text-xs text-green-600 flex items-center gap-1">
                            <Check className="w-3 h-3" />
                            {effectiveSellerLocation.province || 'ระบุแล้ว'}
                        </span>
                    ) : isLoadingSellerLoc ? (
                        <span className="text-xs text-gray-400 flex items-center gap-1">
                            <div className="w-3 h-3 border-2 border-purple-400 border-t-transparent rounded-full animate-spin" />
                            กำลังค้นหา...
                        </span>
                    ) : locationRequestSent ? (
                        <span className="text-xs text-purple-600 flex items-center gap-1">
                            <Check className="w-3 h-3" />
                            ส่งคำขอแล้ว
                        </span>
                    ) : (
                        <button
                            onClick={handleRequestSellerLocation}
                            className="flex items-center gap-1 text-xs text-purple-600 hover:text-purple-700 font-medium"
                        >
                            <Navigation className="w-3 h-3" />
                            ขอตำแหน่ง
                        </button>
                    )}
                </div>

                {/* Travel Time Summary */}
                {meetingAnalysis.travel_time_buyer && meetingAnalysis.travel_time_seller && (
                    <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
                        <span className="text-xs text-gray-500">เวลาเดินทางโดยประมาณ</span>
                        <div className="flex items-center gap-3">
                            <span className="text-[10px] text-blue-600 font-medium">ฉัน: {meetingAnalysis.travel_time_buyer}</span>
                            <span className="text-gray-300">|</span>
                            <span className="text-[10px] text-purple-600 font-medium">ผู้ขาย: {meetingAnalysis.travel_time_seller}</span>
                        </div>
                    </div>
                )}
            </div>

            {/* Recommended SafeZones */}
            <div className="space-y-2">
                <h4 className="text-xs font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                    <MapPin className="w-3 h-3 text-green-600" />
                    จุดนัดแนะนำ (เรียงตามความใกล้จุดกึ่งกลาง)
                </h4>

                {meetingAnalysis.recommended_spots.map((spot, index) => (
                    <motion.div
                        key={spot.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`w-full p-3 rounded-xl border transition-all cursor-pointer ${selectedSpot?.id === spot.id
                            ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                            : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-green-300'
                            }`}
                    >
                        <div
                            className="flex items-start gap-3"
                            onClick={() => handleSelectSpot(spot)}
                        >
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${spot.type === 'police_station' ? 'bg-blue-100 text-blue-600' :
                                spot.type === 'mall' ? 'bg-purple-100 text-purple-600' :
                                    'bg-green-100 text-green-600'
                                }`}>
                                {getTypeIcon(spot.type)}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-bold text-gray-900 dark:text-white truncate">{spot.name}</span>
                                    {spot.verification_status === 'verified' && (
                                        <span className="text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full font-bold">✓ VERIFIED</span>
                                    )}
                                </div>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="text-[10px] text-gray-500 flex items-center gap-0.5">
                                        <Navigation className="w-3 h-3" />
                                        {spot.distance} กม.
                                    </span>
                                    <span className="text-[10px] text-gray-500 flex items-center gap-0.5">
                                        <Clock className="w-3 h-3" />
                                        {spot.operating_hours}
                                    </span>
                                    <span className={`text-[10px] font-bold text-white px-1.5 py-0.5 rounded-full ${getSafetyBadgeColor(spot.safety_score)}`}>
                                        {spot.safety_score >= 90 ? 'High' : spot.safety_score >= 70 ? 'Medium' : 'Low'}
                                    </span>
                                </div>
                                <div className="flex flex-wrap gap-1 mt-2">
                                    {spot.has_cctv && (
                                        <span className="text-[9px] bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-1.5 py-0.5 rounded">📹 CCTV</span>
                                    )}
                                    {spot.has_parking && (
                                        <span className="text-[9px] bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-1.5 py-0.5 rounded">🅿️ ที่จอดรถ</span>
                                    )}
                                    {spot.features.slice(0, 2).map((feature, i) => (
                                        <span key={i} className="text-[9px] bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-1.5 py-0.5 rounded">
                                            {feature}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <div className="flex items-center">
                                {selectedSpot?.id === spot.id ? (
                                    <Check className="w-5 h-5 text-green-600" />
                                ) : (
                                    <ChevronRight className="w-5 h-5 text-gray-400" />
                                )}
                            </div>
                        </div>
                        {/* Quick Send Location Button - Now outside the clickable div */}
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                handleSelectSpot(spot);
                                onSendMeetingRequest?.(spot, 'เลือกเวลาภายหลัง');
                            }}
                            className="mt-2 w-full py-1.5 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg text-[10px] font-bold flex items-center justify-center gap-1 hover:from-cyan-600 hover:to-blue-600 transition-all"
                        >
                            <Navigation className="w-3 h-3" />
                            SEND LOCATION →
                        </button>
                    </motion.div>
                ))}
            </div>

            {/* Time Slot Selection */}
            {selectedSpot && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="space-y-2"
                >
                    <h4 className="text-xs font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                        <Clock className="w-3 h-3 text-blue-600" />
                        เลือกช่วงเวลา
                    </h4>
                    <div className="flex flex-wrap gap-2">
                        {meetingAnalysis.suggested_time_slots.map((slot) => (
                            <button
                                key={slot}
                                onClick={() => setSelectedTimeSlot(slot)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${selectedTimeSlot === slot
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-blue-50'
                                    }`}
                            >
                                {slot}
                            </button>
                        ))}
                    </div>
                </motion.div>
            )}

            {/* Send Meeting Request Button */}
            {selectedSpot && selectedTimeSlot && (
                <button
                    onClick={handleSendMeetingRequest}
                    className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:from-green-600 hover:to-emerald-700 transition-all shadow-lg shadow-green-500/25"
                >
                    <Navigation className="w-4 h-4" />
                    ส่งคำขอนัดพบ
                </button>
            )}

            {/* Safety Tips */}
            <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-700">
                <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    <span className="text-xs font-bold text-amber-700 dark:text-amber-400">คำแนะนำความปลอดภัย</span>
                </div>
                <ul className="space-y-1">
                    {meetingAnalysis.safety_tips.map((tip, index) => (
                        <li key={index} className="text-[10px] text-amber-700 dark:text-amber-300 flex items-start gap-1">
                            <span>•</span>
                            <span>{tip}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
