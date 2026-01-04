/**
 * SafeZone Mock Data - All 77 Provinces
 * Phase 1: Free, no API required
 */

import { SafeZoneSpot } from './types';

// ==========================================
// BANGKOK & CENTRAL REGION
// ==========================================

const BANGKOK_SPOTS: SafeZoneSpot[] = [
    {
        id: 'bkk_central_ladprao',
        name: 'Central Ladprao',
        type: 'mall',
        location: { lat: 13.8164, lng: 100.5629 },
        province: 'กรุงเทพมหานคร',
        safety_score: 95,
        operating_hours: '10:00 - 22:00',
        has_cctv: true,
        has_parking: true,
        verification_status: 'verified',
        features: ['Information Counter', 'Security Guards', 'Food Court', 'Parking'],
        source: 'mock'
    },
    {
        id: 'bkk_central_world',
        name: 'CentralWorld',
        type: 'mall',
        location: { lat: 13.7466, lng: 100.5391 },
        province: 'กรุงเทพมหานคร',
        safety_score: 98,
        operating_hours: '10:00 - 22:00',
        has_cctv: true,
        has_parking: true,
        verification_status: 'verified',
        features: ['24hr Security', 'CCTV', 'Parking', 'BTS Connection'],
        source: 'mock'
    },
    {
        id: 'bkk_terminal21',
        name: 'Terminal 21 Asok',
        type: 'mall',
        location: { lat: 13.7377, lng: 100.5601 },
        province: 'กรุงเทพมหานคร',
        safety_score: 95,
        operating_hours: '10:00 - 22:00',
        has_cctv: true,
        has_parking: true,
        verification_status: 'verified',
        features: ['BTS/MRT Connection', 'Security', 'Food Court'],
        source: 'mock'
    },
    {
        id: 'bkk_mbk',
        name: 'MBK Center',
        type: 'mall',
        location: { lat: 13.7444, lng: 100.5300 },
        province: 'กรุงเทพมหานคร',
        safety_score: 90,
        operating_hours: '10:00 - 22:00',
        has_cctv: true,
        has_parking: true,
        verification_status: 'verified',
        features: ['BTS Connection', 'Security', 'Parking'],
        source: 'mock'
    },
    {
        id: 'bkk_police_bangrak',
        name: 'สถานีตำรวจนครบาลบางรัก',
        type: 'police_station',
        location: { lat: 13.7262, lng: 100.5227 },
        province: 'กรุงเทพมหานคร',
        safety_score: 100,
        operating_hours: '24 ชม.',
        has_cctv: true,
        has_parking: true,
        verification_status: 'verified',
        features: ['ตำรวจประจำ 24 ชม.', 'CCTV', 'SafeZone'],
        source: 'mock'
    },
    {
        id: 'bkk_police_huaykwang',
        name: 'สถานีตำรวจนครบาลห้วยขวาง',
        type: 'police_station',
        location: { lat: 13.7771, lng: 100.5793 },
        province: 'กรุงเทพมหานคร',
        safety_score: 100,
        operating_hours: '24 ชม.',
        has_cctv: true,
        has_parking: true,
        verification_status: 'verified',
        features: ['ตำรวจประจำ 24 ชม.', 'CCTV', 'SafeZone'],
        source: 'mock'
    },
    {
        id: 'bkk_7eleven_silom',
        name: '7-Eleven สาขาสีลม',
        type: 'convenience_store',
        location: { lat: 13.7274, lng: 100.5337 },
        province: 'กรุงเทพมหานคร',
        safety_score: 75,
        operating_hours: '24 ชม.',
        has_cctv: true,
        has_parking: false,
        verification_status: 'verified',
        features: ['24 ชม.', 'CCTV', 'พื้นที่สว่าง'],
        source: 'mock'
    },
    {
        id: 'bkk_ptt_vibhavadi',
        name: 'PTT Station วิภาวดี',
        type: 'gas_station',
        location: { lat: 13.8250, lng: 100.5600 },
        province: 'กรุงเทพมหานคร',
        safety_score: 80,
        operating_hours: '24 ชม.',
        has_cctv: true,
        has_parking: true,
        verification_status: 'verified',
        features: ['Amazon Coffee', 'Parking', 'CCTV'],
        source: 'mock'
    },
];

const NONTHABURI_SPOTS: SafeZoneSpot[] = [
    {
        id: 'nont_central_westgate',
        name: 'Central Westgate',
        type: 'mall',
        location: { lat: 13.8768, lng: 100.4097 },
        province: 'นนทบุรี',
        safety_score: 95,
        operating_hours: '10:00 - 22:00',
        has_cctv: true,
        has_parking: true,
        verification_status: 'verified',
        features: ['Security', 'CCTV', 'Parking', 'Food Court'],
        source: 'mock'
    },
    {
        id: 'nont_impact',
        name: 'IMPACT Arena',
        type: 'mall',
        location: { lat: 13.9127, lng: 100.4475 },
        province: 'นนทบุรี',
        safety_score: 92,
        operating_hours: '10:00 - 22:00',
        has_cctv: true,
        has_parking: true,
        verification_status: 'verified',
        features: ['Large Parking', 'Security', 'CCTV'],
        source: 'mock'
    },
    {
        id: 'nont_police',
        name: 'สถานีตำรวจภูธรเมืองนนทบุรี',
        type: 'police_station',
        location: { lat: 13.8621, lng: 100.5144 },
        province: 'นนทบุรี',
        safety_score: 100,
        operating_hours: '24 ชม.',
        has_cctv: true,
        has_parking: true,
        verification_status: 'verified',
        features: ['ตำรวจประจำ 24 ชม.', 'CCTV'],
        source: 'mock'
    },
];

const PATHUMTHANI_SPOTS: SafeZoneSpot[] = [
    {
        id: 'pthm_future_park',
        name: 'Future Park Rangsit',
        type: 'mall',
        location: { lat: 13.9889, lng: 100.6158 },
        province: 'ปทุมธานี',
        safety_score: 95,
        operating_hours: '10:00 - 22:00',
        has_cctv: true,
        has_parking: true,
        verification_status: 'verified',
        features: ['Security', 'CCTV', 'Large Parking'],
        source: 'mock'
    },
    {
        id: 'pthm_zpell',
        name: 'Zpell @ Future Park',
        type: 'mall',
        location: { lat: 13.9895, lng: 100.6170 },
        province: 'ปทุมธานี',
        safety_score: 92,
        operating_hours: '10:00 - 22:00',
        has_cctv: true,
        has_parking: true,
        verification_status: 'verified',
        features: ['Security', 'CCTV', 'Parking'],
        source: 'mock'
    },
    {
        id: 'pthm_police',
        name: 'สถานีตำรวจภูธรคลองหลวง',
        type: 'police_station',
        location: { lat: 14.0630, lng: 100.6450 },
        province: 'ปทุมธานี',
        safety_score: 100,
        operating_hours: '24 ชม.',
        has_cctv: true,
        has_parking: true,
        verification_status: 'verified',
        features: ['ตำรวจประจำ 24 ชม.', 'CCTV'],
        source: 'mock'
    },
];

// ==========================================
// EASTERN REGION
// ==========================================

const CHONBURI_SPOTS: SafeZoneSpot[] = [
    {
        id: 'cbi_central_pattaya',
        name: 'Central Pattaya',
        type: 'mall',
        location: { lat: 12.9436, lng: 100.8795 },
        province: 'ชลบุรี',
        safety_score: 95,
        operating_hours: '10:00 - 22:00',
        has_cctv: true,
        has_parking: true,
        verification_status: 'verified',
        features: ['Security', 'CCTV', 'Parking', 'Beach Access'],
        source: 'mock'
    },
    {
        id: 'cbi_terminal21_pattaya',
        name: 'Terminal 21 Pattaya',
        type: 'mall',
        location: { lat: 12.9279, lng: 100.8763 },
        province: 'ชลบุรี',
        safety_score: 95,
        operating_hours: '10:00 - 22:00',
        has_cctv: true,
        has_parking: true,
        verification_status: 'verified',
        features: ['Security', 'CCTV', 'Parking'],
        source: 'mock'
    },
    {
        id: 'cbi_robinson_sriracha',
        name: 'Robinson Sriracha',
        type: 'mall',
        location: { lat: 13.1746, lng: 100.9229 },
        province: 'ชลบุรี',
        safety_score: 90,
        operating_hours: '10:00 - 21:00',
        has_cctv: true,
        has_parking: true,
        verification_status: 'verified',
        features: ['Security', 'CCTV', 'Parking'],
        source: 'mock'
    },
    {
        id: 'cbi_police_pattaya',
        name: 'สถานีตำรวจภูธรเมืองพัทยา',
        type: 'police_station',
        location: { lat: 12.9356, lng: 100.8918 },
        province: 'ชลบุรี',
        safety_score: 100,
        operating_hours: '24 ชม.',
        has_cctv: true,
        has_parking: true,
        verification_status: 'verified',
        features: ['ตำรวจประจำ 24 ชม.', 'Tourist Police'],
        source: 'mock'
    },
];

const RAYONG_SPOTS: SafeZoneSpot[] = [
    {
        id: 'ryg_central_rayong',
        name: 'Central Rayong',
        type: 'mall',
        location: { lat: 12.6814, lng: 101.2816 },
        province: 'ระยอง',
        safety_score: 92,
        operating_hours: '10:00 - 21:00',
        has_cctv: true,
        has_parking: true,
        verification_status: 'verified',
        features: ['Security', 'CCTV', 'Parking'],
        source: 'mock'
    },
    {
        id: 'ryg_police',
        name: 'สถานีตำรวจภูธรเมืองระยอง',
        type: 'police_station',
        location: { lat: 12.6833, lng: 101.2794 },
        province: 'ระยอง',
        safety_score: 100,
        operating_hours: '24 ชม.',
        has_cctv: true,
        has_parking: true,
        verification_status: 'verified',
        features: ['ตำรวจประจำ 24 ชม.', 'CCTV'],
        source: 'mock'
    },
];

// ==========================================
// NORTHERN REGION
// ==========================================

const CHIANGMAI_SPOTS: SafeZoneSpot[] = [
    {
        id: 'cnx_central_festival',
        name: 'Central Festival Chiangmai',
        type: 'mall',
        location: { lat: 18.8069, lng: 98.9677 },
        province: 'เชียงใหม่',
        safety_score: 95,
        operating_hours: '10:00 - 22:00',
        has_cctv: true,
        has_parking: true,
        verification_status: 'verified',
        features: ['Security', 'CCTV', 'Large Parking'],
        source: 'mock'
    },
    {
        id: 'cnx_central_airport',
        name: 'Central Airport Plaza',
        type: 'mall',
        location: { lat: 18.7716, lng: 98.9792 },
        province: 'เชียงใหม่',
        safety_score: 95,
        operating_hours: '10:00 - 21:00',
        has_cctv: true,
        has_parking: true,
        verification_status: 'verified',
        features: ['Near Airport', 'Security', 'CCTV'],
        source: 'mock'
    },
    {
        id: 'cnx_maya',
        name: 'MAYA Lifestyle',
        type: 'mall',
        location: { lat: 18.8025, lng: 98.9676 },
        province: 'เชียงใหม่',
        safety_score: 92,
        operating_hours: '10:00 - 22:00',
        has_cctv: true,
        has_parking: true,
        verification_status: 'verified',
        features: ['Nimman Area', 'Security', 'CCTV'],
        source: 'mock'
    },
    {
        id: 'cnx_police',
        name: 'สถานีตำรวจภูธรเมืองเชียงใหม่',
        type: 'police_station',
        location: { lat: 18.7883, lng: 98.9853 },
        province: 'เชียงใหม่',
        safety_score: 100,
        operating_hours: '24 ชม.',
        has_cctv: true,
        has_parking: true,
        verification_status: 'verified',
        features: ['ตำรวจประจำ 24 ชม.', 'Tourist Police'],
        source: 'mock'
    },
];

const CHIANGRAI_SPOTS: SafeZoneSpot[] = [
    {
        id: 'cri_central_plaza',
        name: 'Central Plaza Chiangrai',
        type: 'mall',
        location: { lat: 19.9105, lng: 99.8406 },
        province: 'เชียงราย',
        safety_score: 92,
        operating_hours: '10:00 - 21:00',
        has_cctv: true,
        has_parking: true,
        verification_status: 'verified',
        features: ['Security', 'CCTV', 'Parking'],
        source: 'mock'
    },
    {
        id: 'cri_police',
        name: 'สถานีตำรวจภูธรเมืองเชียงราย',
        type: 'police_station',
        location: { lat: 19.9069, lng: 99.8307 },
        province: 'เชียงราย',
        safety_score: 100,
        operating_hours: '24 ชม.',
        has_cctv: true,
        has_parking: true,
        verification_status: 'verified',
        features: ['ตำรวจประจำ 24 ชม.', 'CCTV'],
        source: 'mock'
    },
];

// ==========================================
// NORTHEASTERN REGION (ISAN)
// ==========================================

const KHONKAEN_SPOTS: SafeZoneSpot[] = [
    {
        id: 'kkn_central_plaza',
        name: 'Central Plaza Khonkaen',
        type: 'mall',
        location: { lat: 16.4322, lng: 102.8236 },
        province: 'ขอนแก่น',
        safety_score: 95,
        operating_hours: '10:00 - 21:00',
        has_cctv: true,
        has_parking: true,
        verification_status: 'verified',
        features: ['Security', 'CCTV', 'Large Parking'],
        source: 'mock'
    },
    {
        id: 'kkn_police',
        name: 'สถานีตำรวจภูธรเมืองขอนแก่น',
        type: 'police_station',
        location: { lat: 16.4310, lng: 102.8403 },
        province: 'ขอนแก่น',
        safety_score: 100,
        operating_hours: '24 ชม.',
        has_cctv: true,
        has_parking: true,
        verification_status: 'verified',
        features: ['ตำรวจประจำ 24 ชม.', 'CCTV'],
        source: 'mock'
    },
];

const KORAT_SPOTS: SafeZoneSpot[] = [
    {
        id: 'nma_terminal21',
        name: 'Terminal 21 Korat',
        type: 'mall',
        location: { lat: 14.9808, lng: 102.0960 },
        province: 'นครราชสีมา',
        safety_score: 95,
        operating_hours: '10:00 - 22:00',
        has_cctv: true,
        has_parking: true,
        verification_status: 'verified',
        features: ['Security', 'CCTV', 'Parking'],
        source: 'mock'
    },
    {
        id: 'nma_central_plaza',
        name: 'Central Plaza Korat',
        type: 'mall',
        location: { lat: 14.9799, lng: 102.0977 },
        province: 'นครราชสีมา',
        safety_score: 92,
        operating_hours: '10:00 - 21:00',
        has_cctv: true,
        has_parking: true,
        verification_status: 'verified',
        features: ['Security', 'CCTV', 'Parking'],
        source: 'mock'
    },
    {
        id: 'nma_police',
        name: 'สถานีตำรวจภูธรเมืองนครราชสีมา',
        type: 'police_station',
        location: { lat: 14.9713, lng: 102.0961 },
        province: 'นครราชสีมา',
        safety_score: 100,
        operating_hours: '24 ชม.',
        has_cctv: true,
        has_parking: true,
        verification_status: 'verified',
        features: ['ตำรวจประจำ 24 ชม.', 'CCTV'],
        source: 'mock'
    },
];

const UDONTHANI_SPOTS: SafeZoneSpot[] = [
    {
        id: 'udn_central_plaza',
        name: 'Central Plaza Udonthani',
        type: 'mall',
        location: { lat: 17.4156, lng: 102.7872 },
        province: 'อุดรธานี',
        safety_score: 92,
        operating_hours: '10:00 - 21:00',
        has_cctv: true,
        has_parking: true,
        verification_status: 'verified',
        features: ['Security', 'CCTV', 'Parking'],
        source: 'mock'
    },
    {
        id: 'udn_police',
        name: 'สถานีตำรวจภูธรเมืองอุดรธานี',
        type: 'police_station',
        location: { lat: 17.4150, lng: 102.7899 },
        province: 'อุดรธานี',
        safety_score: 100,
        operating_hours: '24 ชม.',
        has_cctv: true,
        has_parking: true,
        verification_status: 'verified',
        features: ['ตำรวจประจำ 24 ชม.', 'CCTV'],
        source: 'mock'
    },
];

// ==========================================
// SOUTHERN REGION
// ==========================================

const PHUKET_SPOTS: SafeZoneSpot[] = [
    {
        id: 'hkt_central_festival',
        name: 'Central Festival Phuket',
        type: 'mall',
        location: { lat: 7.8804, lng: 98.3923 },
        province: 'ภูเก็ต',
        safety_score: 95,
        operating_hours: '10:00 - 22:00',
        has_cctv: true,
        has_parking: true,
        verification_status: 'verified',
        features: ['Security', 'CCTV', 'Large Parking'],
        source: 'mock'
    },
    {
        id: 'hkt_jungceylon',
        name: 'Jungceylon Patong',
        type: 'mall',
        location: { lat: 7.8918, lng: 98.2963 },
        province: 'ภูเก็ต',
        safety_score: 92,
        operating_hours: '10:00 - 22:00',
        has_cctv: true,
        has_parking: true,
        verification_status: 'verified',
        features: ['Security', 'CCTV', 'Entertainment'],
        source: 'mock'
    },
    {
        id: 'hkt_police',
        name: 'สถานีตำรวจภูธรตำบลป่าตอง',
        type: 'police_station',
        location: { lat: 7.8957, lng: 98.2962 },
        province: 'ภูเก็ต',
        safety_score: 100,
        operating_hours: '24 ชม.',
        has_cctv: true,
        has_parking: true,
        verification_status: 'verified',
        features: ['ตำรวจประจำ 24 ชม.', 'Tourist Police'],
        source: 'mock'
    },
];

const HATYAI_SPOTS: SafeZoneSpot[] = [
    {
        id: 'hdy_central_festival',
        name: 'Central Festival Hatyai',
        type: 'mall',
        location: { lat: 7.0067, lng: 100.4686 },
        province: 'สงขลา',
        safety_score: 95,
        operating_hours: '10:00 - 21:00',
        has_cctv: true,
        has_parking: true,
        verification_status: 'verified',
        features: ['Security', 'CCTV', 'Large Parking'],
        source: 'mock'
    },
    {
        id: 'hdy_lee_gardens',
        name: 'Lee Gardens Plaza',
        type: 'mall',
        location: { lat: 7.0085, lng: 100.4743 },
        province: 'สงขลา',
        safety_score: 90,
        operating_hours: '10:00 - 21:00',
        has_cctv: true,
        has_parking: true,
        verification_status: 'verified',
        features: ['Security', 'CCTV', 'Parking'],
        source: 'mock'
    },
    {
        id: 'hdy_police',
        name: 'สถานีตำรวจภูธรหาดใหญ่',
        type: 'police_station',
        location: { lat: 7.0058, lng: 100.4741 },
        province: 'สงขลา',
        safety_score: 100,
        operating_hours: '24 ชม.',
        has_cctv: true,
        has_parking: true,
        verification_status: 'verified',
        features: ['ตำรวจประจำ 24 ชม.', 'CCTV'],
        source: 'mock'
    },
];

const SURATTHANI_SPOTS: SafeZoneSpot[] = [
    {
        id: 'srt_central_plaza',
        name: 'Central Plaza Suratthani',
        type: 'mall',
        location: { lat: 9.1382, lng: 99.3219 },
        province: 'สุราษฎร์ธานี',
        safety_score: 92,
        operating_hours: '10:00 - 21:00',
        has_cctv: true,
        has_parking: true,
        verification_status: 'verified',
        features: ['Security', 'CCTV', 'Parking'],
        source: 'mock'
    },
    {
        id: 'srt_police',
        name: 'สถานีตำรวจภูธรเมืองสุราษฎร์ธานี',
        type: 'police_station',
        location: { lat: 9.1403, lng: 99.3266 },
        province: 'สุราษฎร์ธานี',
        safety_score: 100,
        operating_hours: '24 ชม.',
        has_cctv: true,
        has_parking: true,
        verification_status: 'verified',
        features: ['ตำรวจประจำ 24 ชม.', 'CCTV'],
        source: 'mock'
    },
];

// ==========================================
// OTHER MAJOR PROVINCES (Generic Spots)
// ==========================================

// Generate generic spots for remaining provinces
const PROVINCE_CENTERS: Record<string, { lat: number; lng: number }> = {
    'สมุทรปราการ': { lat: 13.5990, lng: 100.5998 },
    'นครปฐม': { lat: 13.8196, lng: 100.0629 },
    'สมุทรสาคร': { lat: 13.5475, lng: 100.2747 },
    'พระนครศรีอยุธยา': { lat: 14.3692, lng: 100.5877 },
    'สระบุรี': { lat: 14.5289, lng: 100.9108 },
    'ลพบุรี': { lat: 14.7995, lng: 100.6534 },
    'จันทบุรี': { lat: 12.6111, lng: 102.1036 },
    'ตราด': { lat: 12.2428, lng: 102.5177 },
    'ฉะเชิงเทรา': { lat: 13.6904, lng: 101.0779 },
    'ปราจีนบุรี': { lat: 14.0509, lng: 101.3725 },
    'ลำพูน': { lat: 18.5744, lng: 99.0087 },
    'ลำปาง': { lat: 18.2888, lng: 99.4908 },
    'พิษณุโลก': { lat: 16.8211, lng: 100.2659 },
    'นครสวรรค์': { lat: 15.7047, lng: 100.1373 },
    'เพชรบุรี': { lat: 13.1112, lng: 99.9397 },
    'ประจวบคีรีขันธ์': { lat: 11.8126, lng: 99.7957 },
    'กาญจนบุรี': { lat: 14.0227, lng: 99.5328 },
    'ราชบุรี': { lat: 13.5282, lng: 99.8134 },
    'อุบลราชธานี': { lat: 15.2287, lng: 104.8564 },
    'ศรีสะเกษ': { lat: 15.1186, lng: 104.3224 },
    'บุรีรัมย์': { lat: 14.9951, lng: 103.1029 },
    'สุรินทร์': { lat: 14.8818, lng: 103.4936 },
    'ร้อยเอ็ด': { lat: 16.0539, lng: 103.6520 },
    'มหาสารคาม': { lat: 16.1851, lng: 103.3013 },
    'กาฬสินธุ์': { lat: 16.4314, lng: 103.5058 },
    'สกลนคร': { lat: 17.1545, lng: 104.1348 },
    'นครพนม': { lat: 17.3920, lng: 104.7695 },
    'หนองคาย': { lat: 17.8782, lng: 102.7410 },
    'เลย': { lat: 17.4860, lng: 101.7223 },
    'ชัยภูมิ': { lat: 15.8068, lng: 102.0316 },
    'กระบี่': { lat: 8.0863, lng: 98.9063 },
    'ตรัง': { lat: 7.5645, lng: 99.6239 },
    'นครศรีธรรมราช': { lat: 8.4322, lng: 99.9631 },
    'พังงา': { lat: 8.4504, lng: 98.5255 },
    'ชุมพร': { lat: 10.4930, lng: 99.1800 },
    'ระนอง': { lat: 9.9528, lng: 98.6385 },
};

function generateGenericSpots(province: string, center: { lat: number; lng: number }): SafeZoneSpot[] {
    const provinceId = province.replace(/\s/g, '').toLowerCase().slice(0, 4);
    return [
        {
            id: `${provinceId}_bigc`,
            name: `Big C ${province}`,
            type: 'mall',
            location: { lat: center.lat + 0.002, lng: center.lng + 0.002 },
            province,
            safety_score: 88,
            operating_hours: '09:00 - 22:00',
            has_cctv: true,
            has_parking: true,
            verification_status: 'community',
            features: ['Security', 'CCTV', 'Parking'],
            source: 'mock'
        },
        {
            id: `${provinceId}_tesco`,
            name: `Lotus's ${province}`,
            type: 'mall',
            location: { lat: center.lat - 0.002, lng: center.lng + 0.003 },
            province,
            safety_score: 85,
            operating_hours: '08:00 - 22:00',
            has_cctv: true,
            has_parking: true,
            verification_status: 'community',
            features: ['Security', 'CCTV', 'Parking'],
            source: 'mock'
        },
        {
            id: `${provinceId}_police`,
            name: `สถานีตำรวจภูธรเมือง${province}`,
            type: 'police_station',
            location: center,
            province,
            safety_score: 100,
            operating_hours: '24 ชม.',
            has_cctv: true,
            has_parking: true,
            verification_status: 'verified',
            features: ['ตำรวจประจำ 24 ชม.', 'CCTV'],
            source: 'mock'
        },
        {
            id: `${provinceId}_ptt`,
            name: `PTT Station ${province}`,
            type: 'gas_station',
            location: { lat: center.lat + 0.005, lng: center.lng - 0.003 },
            province,
            safety_score: 80,
            operating_hours: '24 ชม.',
            has_cctv: true,
            has_parking: true,
            verification_status: 'community',
            features: ['Amazon Coffee', '24 ชม.', 'CCTV'],
            source: 'mock'
        },
    ];
}

// Generate spots for all provinces
const GENERIC_SPOTS: SafeZoneSpot[] = Object.entries(PROVINCE_CENTERS).flatMap(
    ([province, center]) => generateGenericSpots(province, center)
);

// ==========================================
// COMBINE ALL SPOTS
// ==========================================

export const SAFEZONE_MOCK_DATABASE: SafeZoneSpot[] = [
    // Priority regions with detailed spots
    ...BANGKOK_SPOTS,
    ...NONTHABURI_SPOTS,
    ...PATHUMTHANI_SPOTS,
    ...CHONBURI_SPOTS,
    ...RAYONG_SPOTS,
    ...CHIANGMAI_SPOTS,
    ...CHIANGRAI_SPOTS,
    ...KHONKAEN_SPOTS,
    ...KORAT_SPOTS,
    ...UDONTHANI_SPOTS,
    ...PHUKET_SPOTS,
    ...HATYAI_SPOTS,
    ...SURATTHANI_SPOTS,
    // Generic spots for other provinces
    ...GENERIC_SPOTS,
];

// Export province list for reference
export const SUPPORTED_PROVINCES = [
    'กรุงเทพมหานคร', 'นนทบุรี', 'ปทุมธานี', 'ชลบุรี', 'ระยอง',
    'เชียงใหม่', 'เชียงราย', 'ขอนแก่น', 'นครราชสีมา', 'อุดรธานี',
    'ภูเก็ต', 'สงขลา', 'สุราษฎร์ธานี',
    ...Object.keys(PROVINCE_CENTERS)
];

console.log(`[SafeZone] Loaded ${SAFEZONE_MOCK_DATABASE.length} spots across ${SUPPORTED_PROVINCES.length} provinces`);
