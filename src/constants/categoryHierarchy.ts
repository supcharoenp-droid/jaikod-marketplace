/**
 * JaiKod Category Hierarchy System
 * Multi-level category structure with attributes for AI classification
 */

export interface CategoryAttribute {
    name: string
    type: 'select' | 'multiselect' | 'text' | 'number' | 'boolean'
    options?: string[]
    required?: boolean
    aiSuggested?: boolean // Can AI auto-fill this?
}

export interface SubCategory {
    id: string
    name_th: string
    name_en: string
    slug: string
    attributes?: CategoryAttribute[]
    subCategories?: SubCategory[] // Level 3
}

export interface MainCategory {
    id: number
    name_th: string
    name_en: string
    slug: string
    icon: string
    order_index: number
    description_th?: string
    description_en?: string
    subCategories: SubCategory[]
    commonAttributes?: CategoryAttribute[] // Shared across all subcategories
}

// Common attributes used across multiple categories
export const COMMON_ATTRIBUTES = {
    CONDITION: {
        name: 'condition',
        type: 'select' as const,
        options: ['new', 'like_new', 'good', 'fair', 'poor'],
        required: true,
        aiSuggested: true
    },
    BRAND: {
        name: 'brand',
        type: 'text' as const,
        required: false,
        aiSuggested: true
    },
    COLOR: {
        name: 'color',
        type: 'text' as const,
        required: false,
        aiSuggested: true
    },
    WARRANTY: {
        name: 'warranty',
        type: 'boolean' as const,
        required: false,
        aiSuggested: false
    },
    ORIGINAL_BOX: {
        name: 'original_box',
        type: 'boolean' as const,
        required: false,
        aiSuggested: true
    }
}

export const CATEGORY_HIERARCHY: MainCategory[] = [
    {
        id: 1,
        name_th: 'มือถือและแท็บเล็ต',
        name_en: 'Mobiles & Tablets',
        slug: 'mobiles',
        icon: '📱',
        order_index: 1,
        description_th: 'สมาร์ทโฟน แท็บเล็ต และอุปกรณ์เสริม',
        commonAttributes: [COMMON_ATTRIBUTES.CONDITION, COMMON_ATTRIBUTES.WARRANTY],
        subCategories: [
            {
                id: 'smartphones',
                name_th: 'สมาร์ทโฟน',
                name_en: 'Smartphones',
                slug: 'smartphones',
                attributes: [
                    { name: 'brand', type: 'select', options: ['Apple', 'Samsung', 'Xiaomi', 'OPPO', 'Vivo', 'Realme', 'OnePlus', 'Google', 'Huawei', 'ASUS', 'Sony', 'Other'], required: true, aiSuggested: true },
                    { name: 'model', type: 'text', required: true, aiSuggested: true },
                    { name: 'storage', type: 'select', options: ['32GB', '64GB', '128GB', '256GB', '512GB', '1TB'], required: true, aiSuggested: true },
                    { name: 'ram', type: 'select', options: ['2GB', '3GB', '4GB', '6GB', '8GB', '12GB', '16GB', '18GB'], required: false, aiSuggested: true },
                    { name: 'color', type: 'text', required: false, aiSuggested: true },
                    { name: 'unlocked', type: 'boolean', required: false, aiSuggested: false },
                    { name: 'battery_health', type: 'number', required: false, aiSuggested: false },
                    { name: 'accessories_included', type: 'multiselect', options: ['Charger', 'Cable', 'Box', 'Earphones', 'Case', 'Screen Protector'], required: false, aiSuggested: false }
                ],
                subCategories: [
                    { id: 'iphone', name_th: 'iPhone', name_en: 'iPhone', slug: 'iphone' },
                    { id: 'samsung-galaxy', name_th: 'Samsung Galaxy', name_en: 'Samsung Galaxy', slug: 'samsung-galaxy' },
                    { id: 'xiaomi-redmi', name_th: 'Xiaomi / Redmi', name_en: 'Xiaomi / Redmi', slug: 'xiaomi-redmi' },
                    { id: 'oppo-realme', name_th: 'OPPO / Realme', name_en: 'OPPO / Realme', slug: 'oppo-realme' },
                    { id: 'gaming-phones', name_th: 'มือถือเกมมิ่ง', name_en: 'Gaming Phones', slug: 'gaming-phones' }
                ]
            },
            {
                id: 'tablets',
                name_th: 'แท็บเล็ต',
                name_en: 'Tablets',
                slug: 'tablets',
                attributes: [
                    { name: 'brand', type: 'select', options: ['Apple', 'Samsung', 'Huawei', 'Lenovo', 'Xiaomi', 'Amazon', 'Microsoft', 'Other'], required: true, aiSuggested: true },
                    { name: 'model', type: 'text', required: true, aiSuggested: true },
                    { name: 'storage', type: 'select', options: ['32GB', '64GB', '128GB', '256GB', '512GB', '1TB'], required: true, aiSuggested: true },
                    { name: 'screen_size', type: 'select', options: ['7-8 inch', '9-10 inch', '11-12 inch', '13+ inch'], required: false, aiSuggested: true },
                    { name: 'cellular', type: 'boolean', required: false, aiSuggested: true }
                ],
                subCategories: [
                    { id: 'ipad', name_th: 'iPad', name_en: 'iPad', slug: 'ipad' },
                    { id: 'samsung-tab', name_th: 'Samsung Galaxy Tab', name_en: 'Samsung Galaxy Tab', slug: 'samsung-tab' },
                    { id: 'android-tablets', name_th: 'แท็บเล็ต Android อื่นๆ', name_en: 'Other Android Tablets', slug: 'android-tablets' }
                ]
            },
            {
                id: 'mobile-accessories',
                name_th: 'อุปกรณ์เสริม',
                name_en: 'Accessories',
                slug: 'mobile-accessories',
                subCategories: [
                    { id: 'cases-covers', name_th: 'เคสและซอง', name_en: 'Cases & Covers', slug: 'cases-covers' },
                    { id: 'screen-protectors', name_th: 'ฟิล์มกันรอย', name_en: 'Screen Protectors', slug: 'screen-protectors' },
                    { id: 'chargers-cables', name_th: 'หัวชาร์จและสายชาร์จ', name_en: 'Chargers & Cables', slug: 'chargers-cables' },
                    { id: 'power-banks', name_th: 'Power Bank', name_en: 'Power Banks', slug: 'power-banks' },
                    { id: 'mobile-audio', name_th: 'หูฟังและลำโพง', name_en: 'Audio Accessories', slug: 'mobile-audio' }
                ]
            }
        ]
    },
    {
        id: 2,
        name_th: 'คอมพิวเตอร์และแล็ปท็อป',
        name_en: 'Computers & Laptops',
        slug: 'computers',
        icon: '💻',
        order_index: 2,
        description_th: 'แล็ปท็อป คอมพิวเตอร์ และอุปกรณ์',
        commonAttributes: [COMMON_ATTRIBUTES.CONDITION, COMMON_ATTRIBUTES.WARRANTY],
        subCategories: [
            {
                id: 'laptops',
                name_th: 'แล็ปท็อป',
                name_en: 'Laptops',
                slug: 'laptops',
                attributes: [
                    { name: 'brand', type: 'select', options: ['Apple', 'Dell', 'HP', 'Lenovo', 'ASUS', 'Acer', 'MSI', 'Razer', 'Microsoft', 'LG', 'Other'], required: true, aiSuggested: true },
                    { name: 'model', type: 'text', required: true, aiSuggested: true },
                    { name: 'processor', type: 'select', options: ['Intel Core i3', 'Intel Core i5', 'Intel Core i7', 'Intel Core i9', 'AMD Ryzen 3', 'AMD Ryzen 5', 'AMD Ryzen 7', 'AMD Ryzen 9', 'Apple M1', 'Apple M2', 'Apple M3', 'Other'], required: true, aiSuggested: true },
                    { name: 'ram', type: 'select', options: ['4GB', '8GB', '16GB', '32GB', '64GB'], required: true, aiSuggested: true },
                    { name: 'storage', type: 'text', required: true, aiSuggested: true },
                    { name: 'screen_size', type: 'select', options: ['11-12 inch', '13-14 inch', '15-16 inch', '17+ inch'], required: false, aiSuggested: true },
                    { name: 'gpu', type: 'text', required: false, aiSuggested: true }
                ],
                subCategories: [
                    { id: 'macbook', name_th: 'MacBook', name_en: 'MacBook', slug: 'macbook' },
                    { id: 'gaming-laptops', name_th: 'Gaming Laptops', name_en: 'Gaming Laptops', slug: 'gaming-laptops' },
                    { id: 'business-laptops', name_th: 'Business Laptops', name_en: 'Business Laptops', slug: 'business-laptops' },
                    { id: 'ultrabooks', name_th: 'Ultrabooks', name_en: 'Ultrabooks', slug: 'ultrabooks' },
                    { id: 'chromebooks', name_th: 'Chromebooks', name_en: 'Chromebooks', slug: 'chromebooks' }
                ]
            },
            {
                id: 'desktops',
                name_th: 'คอมพิวเตอร์ตั้งโต๊ะ',
                name_en: 'Desktop Computers',
                slug: 'desktops',
                subCategories: [
                    { id: 'all-in-one', name_th: 'All-in-One', name_en: 'All-in-One', slug: 'all-in-one' },
                    { id: 'gaming-pc', name_th: 'Gaming PC', name_en: 'Gaming PC', slug: 'gaming-pc' },
                    { id: 'workstation', name_th: 'Workstation', name_en: 'Workstation', slug: 'workstation' },
                    { id: 'mini-pc', name_th: 'Mini PC', name_en: 'Mini PC', slug: 'mini-pc' }
                ]
            },
            {
                id: 'pc-components',
                name_th: 'ชิ้นส่วนคอมพิวเตอร์',
                name_en: 'PC Components',
                slug: 'pc-components',
                subCategories: [
                    { id: 'cpu', name_th: 'CPU', name_en: 'Processors', slug: 'cpu' },
                    { id: 'gpu', name_th: 'การ์ดจอ', name_en: 'Graphics Cards', slug: 'gpu' },
                    { id: 'motherboard', name_th: 'เมนบอร์ด', name_en: 'Motherboards', slug: 'motherboard' },
                    { id: 'ram', name_th: 'RAM', name_en: 'Memory', slug: 'ram' },
                    { id: 'storage', name_th: 'SSD / HDD', name_en: 'Storage', slug: 'storage' },
                    { id: 'psu', name_th: 'Power Supply', name_en: 'Power Supply', slug: 'psu' },
                    { id: 'pc-case', name_th: 'เคส PC', name_en: 'PC Cases', slug: 'pc-case' },
                    { id: 'cooling', name_th: 'ระบบระบายความร้อน', name_en: 'Cooling Systems', slug: 'cooling' }
                ]
            },
            {
                id: 'peripherals',
                name_th: 'อุปกรณ์เสริม',
                name_en: 'Peripherals',
                slug: 'peripherals',
                subCategories: [
                    { id: 'keyboards', name_th: 'คีย์บอร์ด', name_en: 'Keyboards', slug: 'keyboards' },
                    { id: 'mice', name_th: 'เมาส์', name_en: 'Mice', slug: 'mice' },
                    { id: 'monitors', name_th: 'จอมอนิเตอร์', name_en: 'Monitors', slug: 'monitors' },
                    { id: 'webcams', name_th: 'เว็บแคม', name_en: 'Webcams', slug: 'webcams' },
                    { id: 'microphones', name_th: 'ไมโครโฟน', name_en: 'Microphones', slug: 'microphones' },
                    { id: 'speakers', name_th: 'ลำโพง', name_en: 'Speakers', slug: 'speakers' }
                ]
            }
        ]
    }
]

// Helper function to get all categories as flat list
export function getAllCategories(): { id: string; name_th: string; name_en: string; slug: string; level: number; parentId?: string }[] {
    const result: { id: string; name_th: string; name_en: string; slug: string; level: number; parentId?: string }[] = []

    CATEGORY_HIERARCHY.forEach(main => {
        result.push({
            id: main.slug,
            name_th: main.name_th,
            name_en: main.name_en,
            slug: main.slug,
            level: 1
        })

        main.subCategories.forEach(sub => {
            result.push({
                id: sub.slug,
                name_th: sub.name_th,
                name_en: sub.name_en,
                slug: sub.slug,
                level: 2,
                parentId: main.slug
            })

            sub.subCategories?.forEach(subsub => {
                result.push({
                    id: subsub.slug,
                    name_th: subsub.name_th,
                    name_en: subsub.name_en,
                    slug: subsub.slug,
                    level: 3,
                    parentId: sub.slug
                })
            })
        })
    })

    return result
}

// Helper function to get category by slug
export function getCategoryBySlug(slug: string): MainCategory | SubCategory | null {
    for (const main of CATEGORY_HIERARCHY) {
        if (main.slug === slug) return main

        for (const sub of main.subCategories) {
            if (sub.slug === slug) return sub

            if (sub.subCategories) {
                for (const subsub of sub.subCategories) {
                    if (subsub.slug === slug) return subsub
                }
            }
        }
    }
    return null
}

// Helper function to get attributes for a category
export function getCategoryAttributes(slug: string): CategoryAttribute[] {
    for (const main of CATEGORY_HIERARCHY) {
        if (main.slug === slug) return main.commonAttributes || []

        for (const sub of main.subCategories) {
            if (sub.slug === slug) {
                return [...(main.commonAttributes || []), ...(sub.attributes || [])]
            }

            if (sub.subCategories) {
                for (const subsub of sub.subCategories) {
                    if (subsub.slug === slug) {
                        return [...(main.commonAttributes || []), ...(sub.attributes || []), ...(subsub.attributes || [])]
                    }
                }
            }
        }
    }
    return []
}
