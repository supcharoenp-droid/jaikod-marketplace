export interface ThaiAddress {
    district: string      // ตำบล/แขวง
    amphoe: string       // อำเภอ/เขต
    province: string     // จังหวัด
    zipcode: number      // รหัสไปรษณีย์
    district_code: number
    amphoe_code: number
    province_code: number
}

// URL ของ Raw Data (ใช้ของ jquery.Thailand.js ซึ่งเป็นมาตรฐานและครบถ้วนที่สุด)
const DB_URL = 'https://raw.githubusercontent.com/earthchie/jquery.Thailand.js/master/jquery.Thailand.js/database/raw_database/raw_database.json'

let cachedData: ThaiAddress[] | null = null

export const getThaiAddressData = async (): Promise<ThaiAddress[]> => {
    if (cachedData) return cachedData

    try {
        const response = await fetch(DB_URL)
        if (!response.ok) throw new Error('Failed to fetch address data')
        cachedData = await response.json()
        return cachedData || []
    } catch (error) {
        console.error('Error loading Thai address data:', error)
        return []
    }
}

// 77 Provinces of Thailand
export const PROVINCES = [
    "กระบี่", "กรุงเทพมหานคร", "กาญจนบุรี", "กาฬสินธุ์", "กำแพงเพชร", "ขอนแก่น", "จันทบุรี", "ฉะเชิงเทรา", "ชลบุรี", "ชัยนาท",
    "ชัยภูมิ", "ชุมพร", "เชียงราย", "เชียงใหม่", "ตรัง", "ตราด", "ตาก", "นครนายก", "นครปฐม", "นครพนม",
    "นครราชสีมา", "นครศรีธรรมราช", "นครสวรรค์", "นนทบุรี", "นราธิวาส", "น่าน", "บึงกาฬ", "บุรีรัมย์", "ปทุมธานี", "ประจวบคีรีขันธ์",
    "ปราจีนบุรี", "ปัตตานี", "พระนครศรีอยุธยา", "พะเยา", "พังงา", "พัทลุง", "พิจิตร", "พิษณุโลก", "เพชรบุรี", "เพชรบูรณ์",
    "แพร่", "ภูเก็ต", "มหาสารคาม", "มุกดาหาร", "แม่ฮ่องสอน", "ยโสธร", "ยะลา", "ร้อยเอ็ด", "ระนอง", "ระยอง",
    "ราชบุรี", "ลพบุรี", "ลำปาง", "ลำพูน", "เลย", "ศรีสะเกษ", "สกลนคร", "สงขลา", "สตูล", "สมุทรปราการ",
    "สมุทรสงคราม", "สมุทรสาคร", "สระแก้ว", "สระบุรี", "สิงห์บุรี", "สุโขทัย", "สุพรรณบุรี", "สุราษฎร์ธานี", "สุรินทร์", "หนองคาย",
    "หนองบัวลำภู", "อ่างทอง", "อำนาจเจริญ", "อุดรธานี", "อุตรดิตถ์", "อุทัยธานี", "อุบลราชธานี"
].sort((a, b) => a.localeCompare(b, 'th'))

export const getProvinces = async (): Promise<string[]> => {
    // Return hardcoded list immediately for speed & reliability
    return PROVINCES
}

export const getAmphoes = async (province: string): Promise<string[]> => {
    const data = await getThaiAddressData()
    const amphoes = new Set(
        data
            .filter(item => item.province === province)
            .map(item => item.amphoe)
    )
    return Array.from(amphoes).sort((a, b) => a.localeCompare(b, 'th'))
}

export const getDistricts = async (province: string, amphoe: string): Promise<string[]> => {
    const data = await getThaiAddressData()
    const districts = new Set(
        data
            .filter(item => item.province === province && item.amphoe === amphoe)
            .map(item => item.district)
    )
    return Array.from(districts).sort((a, b) => a.localeCompare(b, 'th'))
}

export const getZipcode = async (province: string, amphoe: string, district: string): Promise<number | null> => {
    const data = await getThaiAddressData()
    const item = data.find(
        item => item.province === province && item.amphoe === amphoe && item.district === district
    )
    return item ? item.zipcode : null
}
