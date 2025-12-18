export type FieldType = 'text' | 'number' | 'select' | 'year' | 'textarea' | 'checkbox'

export interface FormField {
    id: string
    label: string
    type: FieldType
    options?: { label: string; value: string }[]
    required?: boolean
    placeholder?: string
    suffix?: string
}

export interface CategoryFormConfig {
    categoryId: string
    fields: FormField[]
}

const CONDITION_OPTIONS = [
    { label: 'ใหม่แกะกล่อง', value: 'new' },
    { label: 'เหมือนใหม่ (95-99%)', value: 'like_new' },
    { label: 'สภาพดี (85-94%)', value: 'good' },
    { label: 'พอใช้ (70-84%)', value: 'fair' },
    { label: 'ซาก/อะไหล่', value: 'poor' }
]

export const CATEGORY_FORMS: Record<string, FormField[]> = {
    // Mobile / IT
    '1': [ // Electronics / Mobiles
        { id: 'brand', label: 'ยี่ห้อ (Brand)', type: 'text', required: true, placeholder: 'Apple, Samsung' },
        { id: 'model', label: 'รุ่น (Model)', type: 'text', required: true, placeholder: 'iPhone 15 Pro Max' },
        {
            id: 'storage', label: 'ความจุ (Storage)', type: 'select', required: true, options: [
                { label: '64 GB', value: '64gb' },
                { label: '128 GB', value: '128gb' },
                { label: '256 GB', value: '256gb' },
                { label: '512 GB', value: '512gb' },
                { label: '1 TB', value: '1tb' }
            ]
        },
        { id: 'battery_health', label: 'สุขภาพแบต (%)', type: 'number', placeholder: '85-100', suffix: '%' },
        {
            id: 'warranty', label: 'ประกันศูนย์', type: 'select', options: [
                { label: 'หมดประกัน', value: 'expired' },
                { label: 'มีประกัน', value: 'active' }
            ]
        }
    ],
    // Cars
    '2': [ // Vehicles
        { id: 'brand', label: 'ยี่ห้อ', type: 'text', required: true },
        { id: 'year', label: 'ปีรถ (Year)', type: 'year', required: true, placeholder: '2020' },
        {
            id: 'gear', label: 'เกียร์', type: 'select', required: true, options: [
                { label: 'อัตโนมัติ (Auto)', value: 'auto' },
                { label: 'ธรรมดา (Manual)', value: 'manual' }
            ]
        },
        { id: 'mileage', label: 'เลขไมล์ (กม.)', type: 'number', required: true, suffix: 'km' },
        { id: 'engine', label: 'เครื่องยนต์ (CC)', type: 'text', placeholder: '1.9, 2.4' }
    ],
    // Fashion
    '3': [
        { id: 'brand', label: 'แบรนด์', type: 'text', placeholder: 'Nike, Zara' },
        { id: 'size', label: 'ไซส์', type: 'text', required: true, placeholder: 'S, M, L, XL, 38, 42' },
        { id: 'material', label: 'วัสดุ', type: 'text', placeholder: 'Cotton, Polymer' },
        {
            id: 'gender', label: 'เหมาะสำหรับ', type: 'select', options: [
                { label: 'ชาย', value: 'men' },
                { label: 'หญิง', value: 'women' },
                { label: 'Unisex', value: 'unisex' }
            ]
        }
    ],
    // Real Estate
    '4': [
        {
            id: 'type', label: 'ประเภท', type: 'select', required: true, options: [
                { label: 'คอนโด', value: 'condo' },
                { label: 'บ้านเดี่ยว', value: 'house' },
                { label: 'ที่ดิน', value: 'land' }
            ]
        },
        { id: 'size', label: 'ขนาดพื้นที่', type: 'number', required: true, suffix: 'sq.m/wa' },
        { id: 'bedroom', label: 'ห้องนอน', type: 'number' },
        { id: 'bathroom', label: 'ห้องน้ำ', type: 'number' },
        { id: 'floor', label: 'ชั้นที่', type: 'number' }
    ]
}

export const COMMON_FIELDS: FormField[] = [
    { id: 'condition', label: 'สภาพสินค้า', type: 'select', required: true, options: CONDITION_OPTIONS },
    { id: 'description', label: 'รายละเอียดเพิ่มเติม', type: 'textarea', required: true, placeholder: 'อธิบายรายละเอียดสินค้า ตำหนิ หรือประวัติการใช้งาน...' }
]
