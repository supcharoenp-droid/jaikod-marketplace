'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp, MapPin, Tag, Check } from 'lucide-react'

// ==========================================
// BRAND FILTER
// ==========================================

export interface BrandOption {
    brand: string
    displayName: string
    count?: number
}

// Popular brands by category
export const POPULAR_BRANDS: Record<string, BrandOption[]> = {
    mobiles: [
        { brand: 'apple', displayName: 'Apple' },
        { brand: 'samsung', displayName: 'Samsung' },
        { brand: 'oppo', displayName: 'OPPO' },
        { brand: 'vivo', displayName: 'Vivo' },
        { brand: 'xiaomi', displayName: 'Xiaomi' },
        { brand: 'huawei', displayName: 'Huawei' },
        { brand: 'realme', displayName: 'Realme' },
        { brand: 'google', displayName: 'Google' },
    ],
    computers: [
        { brand: 'apple', displayName: 'Apple' },
        { brand: 'asus', displayName: 'ASUS' },
        { brand: 'dell', displayName: 'Dell' },
        { brand: 'hp', displayName: 'HP' },
        { brand: 'lenovo', displayName: 'Lenovo' },
        { brand: 'acer', displayName: 'Acer' },
        { brand: 'msi', displayName: 'MSI' },
    ],
    gaming: [
        { brand: 'sony', displayName: 'Sony (PlayStation)' },
        { brand: 'nintendo', displayName: 'Nintendo' },
        { brand: 'microsoft', displayName: 'Xbox' },
        { brand: 'razer', displayName: 'Razer' },
        { brand: 'logitech', displayName: 'Logitech' },
    ],
    automotive: [
        { brand: 'toyota', displayName: 'Toyota' },
        { brand: 'honda', displayName: 'Honda' },
        { brand: 'mazda', displayName: 'Mazda' },
        { brand: 'nissan', displayName: 'Nissan' },
        { brand: 'mitsubishi', displayName: 'Mitsubishi' },
        { brand: 'ford', displayName: 'Ford' },
        { brand: 'isuzu', displayName: 'Isuzu' },
        { brand: 'mg', displayName: 'MG' },
        { brand: 'bmw', displayName: 'BMW' },
        { brand: 'mercedes', displayName: 'Mercedes-Benz' },
    ],
    fashion: [
        { brand: 'nike', displayName: 'Nike' },
        { brand: 'adidas', displayName: 'Adidas' },
        { brand: 'converse', displayName: 'Converse' },
        { brand: 'vans', displayName: 'Vans' },
        { brand: 'uniqlo', displayName: 'Uniqlo' },
        { brand: 'gucci', displayName: 'Gucci' },
        { brand: 'louis vuitton', displayName: 'Louis Vuitton' },
    ],
    cameras: [
        { brand: 'canon', displayName: 'Canon' },
        { brand: 'nikon', displayName: 'Nikon' },
        { brand: 'sony', displayName: 'Sony' },
        { brand: 'fujifilm', displayName: 'Fujifilm' },
        { brand: 'panasonic', displayName: 'Panasonic' },
        { brand: 'gopro', displayName: 'GoPro' },
    ],
}

interface BrandFilterProps {
    detectedBrand?: string
    selectedBrand: string
    onBrandChange: (brand: string) => void
    categorySlug?: string
    language?: 'th' | 'en'
}

export function BrandFilter({
    detectedBrand,
    selectedBrand,
    onBrandChange,
    categorySlug,
    language = 'th'
}: BrandFilterProps) {
    const [expanded, setExpanded] = useState(true)

    // Get brands based on category
    const brands = categorySlug && POPULAR_BRANDS[categorySlug]
        ? POPULAR_BRANDS[categorySlug]
        : Object.values(POPULAR_BRANDS).flat().reduce((acc, b) => {
            if (!acc.find(x => x.brand === b.brand)) acc.push(b)
            return acc
        }, [] as BrandOption[]).slice(0, 10)

    // If AI detected a brand, prioritize it
    const sortedBrands = detectedBrand
        ? [
            ...brands.filter(b => b.brand.toLowerCase() === detectedBrand.toLowerCase()),
            ...brands.filter(b => b.brand.toLowerCase() !== detectedBrand.toLowerCase())
        ]
        : brands

    return (
        <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
            <button
                onClick={() => setExpanded(!expanded)}
                className="w-full flex items-center justify-between py-2 text-sm font-semibold text-gray-900 dark:text-white"
            >
                <span className="flex items-center gap-2">
                    <Tag className="w-4 h-4 text-purple-500" />
                    {language === 'th' ? 'แบรนด์' : 'Brand'}
                </span>
                {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {expanded && (
                <div className="mt-2 space-y-1">
                    {/* AI Detected Badge */}
                    {detectedBrand && (
                        <div className="mb-2 p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                            <span className="text-xs text-purple-600 dark:text-purple-400">
                                🤖 AI ตรวจพบ: <strong>{detectedBrand.toUpperCase()}</strong>
                            </span>
                        </div>
                    )}

                    {/* Brand Options */}
                    {sortedBrands.map(brand => (
                        <button
                            key={brand.brand}
                            onClick={() => onBrandChange(selectedBrand === brand.brand ? '' : brand.brand)}
                            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${selectedBrand === brand.brand
                                    ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'
                                    : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
                                }`}
                        >
                            <span>{brand.displayName}</span>
                            {selectedBrand === brand.brand && (
                                <Check className="w-4 h-4 text-purple-600" />
                            )}
                        </button>
                    ))}

                    {/* Clear Brand */}
                    {selectedBrand && (
                        <button
                            onClick={() => onBrandChange('')}
                            className="w-full text-center text-xs text-gray-500 hover:text-red-500 mt-2"
                        >
                            ล้างตัวกรองแบรนด์
                        </button>
                    )}
                </div>
            )}
        </div>
    )
}

// ==========================================
// PROVINCE/LOCATION FILTER
// ==========================================

export const THAI_PROVINCES = [
    { value: 'กรุงเทพฯ', label_th: 'กรุงเทพมหานคร', label_en: 'Bangkok', region: 'central' },
    { value: 'นนทบุรี', label_th: 'นนทบุรี', label_en: 'Nonthaburi', region: 'central' },
    { value: 'ปทุมธานี', label_th: 'ปทุมธานี', label_en: 'Pathum Thani', region: 'central' },
    { value: 'สมุทรปราการ', label_th: 'สมุทรปราการ', label_en: 'Samut Prakan', region: 'central' },
    { value: 'ชลบุรี', label_th: 'ชลบุรี', label_en: 'Chonburi', region: 'east' },
    { value: 'ภูเก็ต', label_th: 'ภูเก็ต', label_en: 'Phuket', region: 'south' },
    { value: 'เชียงใหม่', label_th: 'เชียงใหม่', label_en: 'Chiang Mai', region: 'north' },
    { value: 'เชียงราย', label_th: 'เชียงราย', label_en: 'Chiang Rai', region: 'north' },
    { value: 'ขอนแก่น', label_th: 'ขอนแก่น', label_en: 'Khon Kaen', region: 'northeast' },
    { value: 'อุดรธานี', label_th: 'อุดรธานี', label_en: 'Udon Thani', region: 'northeast' },
    { value: 'นครราชสีมา', label_th: 'นครราชสีมา', label_en: 'Nakhon Ratchasima', region: 'northeast' },
    { value: 'สุราษฎร์ธานี', label_th: 'สุราษฎร์ธานี', label_en: 'Surat Thani', region: 'south' },
    { value: 'หาดใหญ่', label_th: 'สงขลา (หาดใหญ่)', label_en: 'Songkhla (Hat Yai)', region: 'south' },
    { value: 'ระยอง', label_th: 'ระยอง', label_en: 'Rayong', region: 'east' },
]

const REGIONS = [
    { id: 'central', label_th: 'ภาคกลาง', label_en: 'Central' },
    { id: 'north', label_th: 'ภาคเหนือ', label_en: 'North' },
    { id: 'northeast', label_th: 'ภาคอีสาน', label_en: 'Northeast' },
    { id: 'east', label_th: 'ภาคตะวันออก', label_en: 'East' },
    { id: 'south', label_th: 'ภาคใต้', label_en: 'South' },
]

interface ProvinceFilterProps {
    selectedProvince: string
    onProvinceChange: (province: string) => void
    language?: 'th' | 'en'
}

export function ProvinceFilter({
    selectedProvince,
    onProvinceChange,
    language = 'th'
}: ProvinceFilterProps) {
    const [expanded, setExpanded] = useState(false)
    const [selectedRegion, setSelectedRegion] = useState<string>('')

    const filteredProvinces = selectedRegion
        ? THAI_PROVINCES.filter(p => p.region === selectedRegion)
        : THAI_PROVINCES

    return (
        <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
            <button
                onClick={() => setExpanded(!expanded)}
                className="w-full flex items-center justify-between py-2 text-sm font-semibold text-gray-900 dark:text-white"
            >
                <span className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-blue-500" />
                    {language === 'th' ? 'พื้นที่' : 'Location'}
                    {selectedProvince && (
                        <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded-full">
                            {selectedProvince}
                        </span>
                    )}
                </span>
                {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {expanded && (
                <div className="mt-2 space-y-2">
                    {/* Region Quick Filters */}
                    <div className="flex flex-wrap gap-1 mb-2">
                        <button
                            onClick={() => setSelectedRegion('')}
                            className={`px-2 py-1 text-xs rounded-full transition-colors ${!selectedRegion
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                                }`}
                        >
                            ทั้งหมด
                        </button>
                        {REGIONS.map(region => (
                            <button
                                key={region.id}
                                onClick={() => setSelectedRegion(region.id)}
                                className={`px-2 py-1 text-xs rounded-full transition-colors ${selectedRegion === region.id
                                        ? 'bg-blue-500 text-white'
                                        : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                                    }`}
                            >
                                {language === 'th' ? region.label_th : region.label_en}
                            </button>
                        ))}
                    </div>

                    {/* Province List */}
                    <div className="max-h-48 overflow-y-auto space-y-1">
                        {filteredProvinces.map(province => (
                            <button
                                key={province.value}
                                onClick={() => onProvinceChange(
                                    selectedProvince === province.value ? '' : province.value
                                )}
                                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${selectedProvince === province.value
                                        ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                                        : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
                                    }`}
                            >
                                <span>{language === 'th' ? province.label_th : province.label_en}</span>
                                {selectedProvince === province.value && (
                                    <Check className="w-4 h-4 text-blue-600" />
                                )}
                            </button>
                        ))}
                    </div>

                    {/* Clear Province */}
                    {selectedProvince && (
                        <button
                            onClick={() => onProvinceChange('')}
                            className="w-full text-center text-xs text-gray-500 hover:text-red-500"
                        >
                            ล้างตัวกรองพื้นที่
                        </button>
                    )}
                </div>
            )}
        </div>
    )
}

// ==========================================
// QUICK PRICE RANGES
// ==========================================

interface QuickPriceRange {
    label_th: string
    label_en: string
    min?: number
    max?: number
}

export const QUICK_PRICE_RANGES: QuickPriceRange[] = [
    { label_th: 'ต่ำกว่า ฿1,000', label_en: 'Under ฿1,000', max: 1000 },
    { label_th: '฿1,000 - ฿5,000', label_en: '฿1,000 - ฿5,000', min: 1000, max: 5000 },
    { label_th: '฿5,000 - ฿10,000', label_en: '฿5,000 - ฿10,000', min: 5000, max: 10000 },
    { label_th: '฿10,000 - ฿30,000', label_en: '฿10,000 - ฿30,000', min: 10000, max: 30000 },
    { label_th: '฿30,000 - ฿100,000', label_en: '฿30,000 - ฿100,000', min: 30000, max: 100000 },
    { label_th: 'มากกว่า ฿100,000', label_en: 'Over ฿100,000', min: 100000 },
]

interface QuickPriceFilterProps {
    currentMin?: number
    currentMax?: number
    onPriceChange: (min?: number, max?: number) => void
    language?: 'th' | 'en'
}

export function QuickPriceFilter({
    currentMin,
    currentMax,
    onPriceChange,
    language = 'th'
}: QuickPriceFilterProps) {
    const isSelected = (range: QuickPriceRange) => {
        return currentMin === range.min && currentMax === range.max
    }

    return (
        <div className="flex flex-wrap gap-1">
            {QUICK_PRICE_RANGES.map((range, idx) => (
                <button
                    key={idx}
                    onClick={() => {
                        if (isSelected(range)) {
                            onPriceChange(undefined, undefined)
                        } else {
                            onPriceChange(range.min, range.max)
                        }
                    }}
                    className={`px-2 py-1 text-xs rounded-full transition-colors ${isSelected(range)
                            ? 'bg-green-500 text-white'
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                        }`}
                >
                    {language === 'th' ? range.label_th : range.label_en}
                </button>
            ))}
        </div>
    )
}
