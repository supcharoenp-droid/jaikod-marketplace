
// Interface for Location Data
export interface LocationData {
    lat: number
    lng: number
    address?: {
        province: string
        district: string
        subdistrict: string
        zipcode?: string
    }
}

export interface Landmark {
    id: string
    name: string
    type: 'transport' | 'mall' | 'facility'
    distance: number // in meters
}

// Mock Store Locations for the User
export const MOCK_SAVED_LOCATIONS = [
    { id: 'home', name: 'บ้าน (Home)', lat: 13.7563, lng: 100.5018, address: { province: 'กรุงเทพมหานคร', district: 'พระนคร', subdistrict: 'เสาชิงช้า' } },
    { id: 'shop', name: 'ร้าน Jaikod สาขา 1', lat: 13.690, lng: 100.550, address: { province: 'กรุงเทพมหานคร', district: 'ยานนาวา', subdistrict: 'ช่องนนทรี' } }
]

// Mock AI Optimization Data
export const getLocationInsights = (category: string) => {
    return {
        hotspot: 'ลาดพร้าว 101',
        insight: `สินค้าหมวด "${category}" กำลังเป็นที่ต้องการในย่าน ลาดพร้าว มากกว่าปกติ 20%`,
        recommended_action: 'นัดรับย่านลาดพร้าวเพื่อปิดการขายไวขึ้น'
    }
}

// Mock Function to get nearby landmarks (Smart Meeting Points)
export const getNearbyLandmarks = async (lat: number, lng: number): Promise<Landmark[]> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500))

    // Return dummy landmarks based on dummy logic (randomized for demo)
    return [
        { id: 'bts', name: 'BTS สยาม', type: 'transport', distance: 150 },
        { id: 'mrt', name: 'MRT สามย่าน', type: 'transport', distance: 800 },
        { id: 'mall', name: 'Central World', type: 'mall', distance: 500 },
        { id: '711', name: '7-Eleven สาขาปากซอย', type: 'facility', distance: 50 }
    ]
}

// Mock Reverse Geocoding (Coords -> Address)
export const reverseGeocode = async (lat: number, lng: number): Promise<LocationData['address']> => {
    await new Promise(resolve => setTimeout(resolve, 800))
    // Determine roughly by coords (Mock)
    if (lat > 13.7 && lat < 13.8) return { province: 'กรุงเทพมหานคร', district: 'ปทุมวัน', subdistrict: 'ปทุมวัน' }
    if (lat > 18) return { province: 'เชียงใหม่', district: 'เมือง', subdistrict: 'สุเทพ' }
    return { province: 'กรุงเทพมหานคร', district: 'จตุจักร', subdistrict: 'จอมพล' }
}

// Browser Geolocation Wrapper with High Accuracy
export const getCurrentPosition = (): Promise<GeolocationPosition> => {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            reject(new Error('Geolocation not supported'))
            return
        }
        navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
        })
    })
}
