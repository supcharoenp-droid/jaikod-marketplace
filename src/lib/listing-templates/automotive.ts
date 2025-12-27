/**
 * 🚗 Automotive Listing Templates
 * 
 * Templates for: Cars, Motorcycles, Pickup Trucks, etc.
 */

import { ListingTemplate, FormField, FieldGroup, COMMON_FIELDS } from './types'

// ============================================
// VEHICLE COMMON FIELDS
// ============================================

const VEHICLE_BRANDS: Record<string, { value: string; label_th: string; label_en: string }[]> = {
    car: [
        { value: 'toyota', label_th: 'Toyota', label_en: 'Toyota' },
        { value: 'honda', label_th: 'Honda', label_en: 'Honda' },
        { value: 'mazda', label_th: 'Mazda', label_en: 'Mazda' },
        { value: 'nissan', label_th: 'Nissan', label_en: 'Nissan' },
        { value: 'mitsubishi', label_th: 'Mitsubishi', label_en: 'Mitsubishi' },
        { value: 'isuzu', label_th: 'Isuzu', label_en: 'Isuzu' },
        { value: 'ford', label_th: 'Ford', label_en: 'Ford' },
        { value: 'chevrolet', label_th: 'Chevrolet', label_en: 'Chevrolet' },
        { value: 'mercedes', label_th: 'Mercedes-Benz', label_en: 'Mercedes-Benz' },
        { value: 'bmw', label_th: 'BMW', label_en: 'BMW' },
        { value: 'audi', label_th: 'Audi', label_en: 'Audi' },
        { value: 'lexus', label_th: 'Lexus', label_en: 'Lexus' },
        { value: 'volvo', label_th: 'Volvo', label_en: 'Volvo' },
        { value: 'porsche', label_th: 'Porsche', label_en: 'Porsche' },
        { value: 'subaru', label_th: 'Subaru', label_en: 'Subaru' },
        { value: 'suzuki', label_th: 'Suzuki', label_en: 'Suzuki' },
        { value: 'mg', label_th: 'MG', label_en: 'MG' },
        { value: 'gwm', label_th: 'GWM', label_en: 'GWM' },
        { value: 'byd', label_th: 'BYD', label_en: 'BYD' },
        { value: 'tesla', label_th: 'Tesla', label_en: 'Tesla' },
        { value: 'other', label_th: 'อื่นๆ', label_en: 'Other' },
    ],
    motorcycle: [
        { value: 'honda', label_th: 'Honda', label_en: 'Honda' },
        { value: 'yamaha', label_th: 'Yamaha', label_en: 'Yamaha' },
        { value: 'kawasaki', label_th: 'Kawasaki', label_en: 'Kawasaki' },
        { value: 'suzuki', label_th: 'Suzuki', label_en: 'Suzuki' },
        { value: 'ducati', label_th: 'Ducati', label_en: 'Ducati' },
        { value: 'bmw', label_th: 'BMW', label_en: 'BMW' },
        { value: 'harley', label_th: 'Harley-Davidson', label_en: 'Harley-Davidson' },
        { value: 'triumph', label_th: 'Triumph', label_en: 'Triumph' },
        { value: 'ktm', label_th: 'KTM', label_en: 'KTM' },
        { value: 'vespa', label_th: 'Vespa', label_en: 'Vespa' },
        { value: 'gpx', label_th: 'GPX', label_en: 'GPX' },
        { value: 'royal_enfield', label_th: 'Royal Enfield', label_en: 'Royal Enfield' },
        { value: 'benelli', label_th: 'Benelli', label_en: 'Benelli' },
        { value: 'other', label_th: 'อื่นๆ', label_en: 'Other' },
    ],
}

const CAR_BODY_TYPES = [
    { value: 'sedan', label_th: 'รถเก๋ง (Sedan)', label_en: 'Sedan' },
    { value: 'suv', label_th: 'SUV', label_en: 'SUV' },
    { value: 'hatchback', label_th: 'แฮทช์แบ็ค', label_en: 'Hatchback' },
    { value: 'pickup', label_th: 'กระบะ', label_en: 'Pickup' },
    { value: 'van', label_th: 'รถตู้', label_en: 'Van' },
    { value: 'coupe', label_th: 'คูเป้', label_en: 'Coupe' },
    { value: 'convertible', label_th: 'เปิดประทุน', label_en: 'Convertible' },
    { value: 'wagon', label_th: 'แวกอน', label_en: 'Wagon' },
    { value: 'crossover', label_th: 'ครอสโอเวอร์', label_en: 'Crossover' },
]

const MOTORCYCLE_TYPES = [
    { value: 'scooter', label_th: 'สกู๊ตเตอร์', label_en: 'Scooter' },
    { value: 'underbone', label_th: 'ครอบครัว/อันเดอร์โบน', label_en: 'Underbone' },
    { value: 'sport', label_th: 'สปอร์ต', label_en: 'Sport' },
    { value: 'naked', label_th: 'เนคเก็ด', label_en: 'Naked' },
    { value: 'touring', label_th: 'ทัวริ่ง', label_en: 'Touring' },
    { value: 'cruiser', label_th: 'ครุยเซอร์', label_en: 'Cruiser' },
    { value: 'adventure', label_th: 'แอดเวนเจอร์', label_en: 'Adventure' },
    { value: 'offroad', label_th: 'ออฟโรด/วิบาก', label_en: 'Off-road' },
    { value: 'classic', label_th: 'คลาสสิก', label_en: 'Classic' },
    { value: 'bigbike', label_th: 'บิ๊กไบค์', label_en: 'Big Bike' },
]

const FUEL_TYPES = [
    { value: 'gasoline', label_th: 'เบนซิน', label_en: 'Gasoline' },
    { value: 'diesel', label_th: 'ดีเซล', label_en: 'Diesel' },
    { value: 'hybrid', label_th: 'ไฮบริด', label_en: 'Hybrid' },
    { value: 'electric', label_th: 'ไฟฟ้า', label_en: 'Electric' },
    { value: 'lpg', label_th: 'LPG/NGV', label_en: 'LPG/NGV' },
]

const TRANSMISSION_TYPES = [
    { value: 'auto', label_th: 'อัตโนมัติ', label_en: 'Automatic' },
    { value: 'manual', label_th: 'ธรรมดา', label_en: 'Manual' },
    { value: 'cvt', label_th: 'CVT', label_en: 'CVT' },
    { value: 'dct', label_th: 'DCT', label_en: 'DCT' },
]

const COLOR_OPTIONS = [
    { value: 'white', label_th: 'ขาว', label_en: 'White', icon: '⚪' },
    { value: 'black', label_th: 'ดำ', label_en: 'Black', icon: '⚫' },
    { value: 'silver', label_th: 'เงิน', label_en: 'Silver', icon: '🔘' },
    { value: 'gray', label_th: 'เทา', label_en: 'Gray', icon: '🩶' },
    { value: 'red', label_th: 'แดง', label_en: 'Red', icon: '🔴' },
    { value: 'blue', label_th: 'น้ำเงิน', label_en: 'Blue', icon: '🔵' },
    { value: 'green', label_th: 'เขียว', label_en: 'Green', icon: '🟢' },
    { value: 'brown', label_th: 'น้ำตาล', label_en: 'Brown', icon: '🟤' },
    { value: 'gold', label_th: 'ทอง', label_en: 'Gold', icon: '🟡' },
    { value: 'orange', label_th: 'ส้ม', label_en: 'Orange', icon: '🟠' },
    { value: 'other', label_th: 'อื่นๆ', label_en: 'Other', icon: '🎨' },
]

// Generate year options (current year to 1990)
const currentYear = new Date().getFullYear()
const YEAR_OPTIONS = Array.from({ length: currentYear - 1989 }, (_, i) => ({
    value: String(currentYear - i),
    label_th: `${currentYear - i}`,
    label_en: `${currentYear - i}`,
}))

// ============================================
// CAR LISTING TEMPLATE
// ============================================

export const CAR_TEMPLATE: ListingTemplate = {
    categoryId: 1,
    categorySlug: 'automotive',
    subcategoryId: 101,
    subcategorySlug: 'cars',
    name_th: 'ประกาศขายรถยนต์',
    name_en: 'Sell Your Car',
    icon: '🚗',

    fields: [
        // Basic Info
        { ...COMMON_FIELDS.title, group: 'basic' },
        {
            id: 'brand',
            name_th: 'ยี่ห้อ',
            name_en: 'Brand',
            type: 'select',
            required: true,
            options: VEHICLE_BRANDS.car,
            group: 'vehicle',
        },
        {
            id: 'model',
            name_th: 'รุ่น',
            name_en: 'Model',
            type: 'text',
            required: true,
            placeholder_th: 'เช่น Camry, Civic, CX-5',
            placeholder_en: 'e.g., Camry, Civic, CX-5',
            group: 'vehicle',
        },
        {
            id: 'subModel',
            name_th: 'รุ่นย่อย',
            name_en: 'Sub-model',
            type: 'text',
            required: false,
            placeholder_th: 'เช่น 2.0 G, EL, V',
            placeholder_en: 'e.g., 2.0 G, EL, V',
            group: 'vehicle',
        },
        {
            id: 'year',
            name_th: 'ปีจดทะเบียน',
            name_en: 'Year',
            type: 'select',
            required: true,
            options: YEAR_OPTIONS,
            group: 'vehicle',
        },
        {
            id: 'bodyType',
            name_th: 'ประเภทตัวถัง',
            name_en: 'Body Type',
            type: 'select',
            required: true,
            options: CAR_BODY_TYPES,
            group: 'vehicle',
        },
        {
            id: 'color',
            name_th: 'สี',
            name_en: 'Color',
            type: 'select',
            required: true,
            options: COLOR_OPTIONS,
            group: 'vehicle',
        },

        // Performance
        {
            id: 'mileage',
            name_th: 'เลขไมล์',
            name_en: 'Mileage',
            type: 'mileage',
            required: true,
            unit: 'km',
            group: 'performance',
        },
        {
            id: 'fuelType',
            name_th: 'เชื้อเพลิง',
            name_en: 'Fuel Type',
            type: 'select',
            required: true,
            options: FUEL_TYPES,
            group: 'performance',
        },
        {
            id: 'transmission',
            name_th: 'เกียร์',
            name_en: 'Transmission',
            type: 'select',
            required: true,
            options: TRANSMISSION_TYPES,
            group: 'performance',
        },
        {
            id: 'engineSize',
            name_th: 'ขนาดเครื่องยนต์',
            name_en: 'Engine Size',
            type: 'text',
            required: false,
            placeholder_th: 'เช่น 1.8, 2.0, 2.5',
            placeholder_en: 'e.g., 1.8, 2.0, 2.5',
            unit: 'cc',
            group: 'performance',
        },

        // Pricing
        { ...COMMON_FIELDS.price, group: 'pricing' },
        { ...COMMON_FIELDS.negotiable, group: 'pricing' },

        // Condition
        {
            id: 'ownerType',
            name_th: 'ประเภทผู้ขาย',
            name_en: 'Seller Type',
            type: 'radio',
            required: true,
            options: [
                { value: 'owner', label_th: 'เจ้าของขายเอง', label_en: 'Owner' },
                { value: 'dealer', label_th: 'เต้นท์/ตัวแทน', label_en: 'Dealer' },
            ],
            group: 'condition',
        },
        {
            id: 'taxStatus',
            name_th: 'สถานะภาษี',
            name_en: 'Tax Status',
            type: 'select',
            required: true,
            options: [
                { value: 'paid', label_th: 'ชำระแล้ว', label_en: 'Paid' },
                { value: 'expired', label_th: 'ขาดต่อ', label_en: 'Expired' },
            ],
            group: 'condition',
        },
        {
            id: 'insuranceStatus',
            name_th: 'ประกันภัย',
            name_en: 'Insurance',
            type: 'select',
            required: false,
            options: [
                { value: 'class1', label_th: 'ชั้น 1', label_en: 'Class 1' },
                { value: 'class2', label_th: 'ชั้น 2', label_en: 'Class 2' },
                { value: 'class3', label_th: 'ชั้น 3', label_en: 'Class 3' },
                { value: 'none', label_th: 'ไม่มี', label_en: 'None' },
            ],
            group: 'condition',
        },

        // Description & Location
        { ...COMMON_FIELDS.description, group: 'details' },
        { ...COMMON_FIELDS.location, group: 'details' },
    ],

    fieldGroups: [
        { id: 'basic', name_th: '📝 ข้อมูลพื้นฐาน', name_en: '📝 Basic Info', fields: ['title'] },
        { id: 'vehicle', name_th: '🚗 ข้อมูลรถ', name_en: '🚗 Vehicle Info', fields: ['brand', 'model', 'subModel', 'year', 'bodyType', 'color'] },
        { id: 'performance', name_th: '⚡ สมรรถนะ', name_en: '⚡ Performance', fields: ['mileage', 'fuelType', 'transmission', 'engineSize'] },
        { id: 'pricing', name_th: '💰 ราคา', name_en: '💰 Pricing', fields: ['price', 'negotiable'] },
        { id: 'condition', name_th: '✅ สภาพและเอกสาร', name_en: '✅ Condition', fields: ['ownerType', 'taxStatus', 'insuranceStatus'] },
        { id: 'details', name_th: '📋 รายละเอียดเพิ่มเติม', name_en: '📋 Details', fields: ['description', 'location'] },
    ],

    aiDescriptionPrompt: 'สร้างคำบรรยายสำหรับรถยนต์ {brand} {model} ปี {year} ที่น่าสนใจและครบถ้วน',
    aiPriceEstimation: true,
    requiredImages: 3,
    maxImages: 20,
    titleTemplate_th: '{brand} {model} ปี {year}',
    titleTemplate_en: '{year} {brand} {model}',
}

// ============================================
// MOTORCYCLE LISTING TEMPLATE
// ============================================

export const MOTORCYCLE_TEMPLATE: ListingTemplate = {
    categoryId: 1,
    categorySlug: 'automotive',
    subcategoryId: 102,
    subcategorySlug: 'motorcycles',
    name_th: 'ประกาศขายมอเตอร์ไซค์',
    name_en: 'Sell Your Motorcycle',
    icon: '🏍️',

    fields: [
        { ...COMMON_FIELDS.title, group: 'basic' },
        {
            id: 'brand',
            name_th: 'ยี่ห้อ',
            name_en: 'Brand',
            type: 'select',
            required: true,
            options: VEHICLE_BRANDS.motorcycle,
            group: 'vehicle',
        },
        {
            id: 'model',
            name_th: 'รุ่น',
            name_en: 'Model',
            type: 'text',
            required: true,
            placeholder_th: 'เช่น Click, Wave, PCX, CBR',
            placeholder_en: 'e.g., Click, Wave, PCX, CBR',
            group: 'vehicle',
        },
        {
            id: 'year',
            name_th: 'ปีจดทะเบียน',
            name_en: 'Year',
            type: 'select',
            required: true,
            options: YEAR_OPTIONS,
            group: 'vehicle',
        },
        {
            id: 'motorcycleType',
            name_th: 'ประเภท',
            name_en: 'Type',
            type: 'select',
            required: true,
            options: MOTORCYCLE_TYPES,
            group: 'vehicle',
        },
        {
            id: 'engineCC',
            name_th: 'ซีซี',
            name_en: 'Engine CC',
            type: 'number',
            required: true,
            unit: 'cc',
            min: 50,
            max: 2500,
            group: 'vehicle',
        },
        {
            id: 'color',
            name_th: 'สี',
            name_en: 'Color',
            type: 'select',
            required: true,
            options: COLOR_OPTIONS,
            group: 'vehicle',
        },
        {
            id: 'mileage',
            name_th: 'เลขไมล์',
            name_en: 'Mileage',
            type: 'mileage',
            required: true,
            unit: 'km',
            group: 'performance',
        },
        { ...COMMON_FIELDS.price, group: 'pricing' },
        { ...COMMON_FIELDS.negotiable, group: 'pricing' },
        {
            id: 'ownerType',
            name_th: 'ประเภทผู้ขาย',
            name_en: 'Seller Type',
            type: 'radio',
            required: true,
            options: [
                { value: 'owner', label_th: 'เจ้าของขายเอง', label_en: 'Owner' },
                { value: 'dealer', label_th: 'เต้นท์/ตัวแทน', label_en: 'Dealer' },
            ],
            group: 'condition',
        },
        {
            id: 'taxStatus',
            name_th: 'สถานะภาษี/พ.ร.บ.',
            name_en: 'Tax/Insurance Status',
            type: 'select',
            required: true,
            options: [
                { value: 'paid', label_th: 'ชำระแล้ว', label_en: 'Paid' },
                { value: 'expired', label_th: 'ขาดต่อ', label_en: 'Expired' },
            ],
            group: 'condition',
        },
        { ...COMMON_FIELDS.description, group: 'details' },
        { ...COMMON_FIELDS.location, group: 'details' },
    ],

    fieldGroups: [
        { id: 'basic', name_th: '📝 ข้อมูลพื้นฐาน', name_en: '📝 Basic Info', fields: ['title'] },
        { id: 'vehicle', name_th: '🏍️ ข้อมูลรถ', name_en: '🏍️ Vehicle Info', fields: ['brand', 'model', 'year', 'motorcycleType', 'engineCC', 'color'] },
        { id: 'performance', name_th: '⚡ สมรรถนะ', name_en: '⚡ Performance', fields: ['mileage'] },
        { id: 'pricing', name_th: '💰 ราคา', name_en: '💰 Pricing', fields: ['price', 'negotiable'] },
        { id: 'condition', name_th: '✅ สภาพและเอกสาร', name_en: '✅ Condition', fields: ['ownerType', 'taxStatus'] },
        { id: 'details', name_th: '📋 รายละเอียดเพิ่มเติม', name_en: '📋 Details', fields: ['description', 'location'] },
    ],

    aiDescriptionPrompt: 'สร้างคำบรรยายสำหรับมอเตอร์ไซค์ {brand} {model} ปี {year} {engineCC} cc',
    aiPriceEstimation: true,
    requiredImages: 3,
    maxImages: 15,
    titleTemplate_th: '{brand} {model} ปี {year}',
    titleTemplate_en: '{year} {brand} {model}',
}
