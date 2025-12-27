'use client'

/**
 * 🏍️ Smart Motorcycle Selector
 * 
 * Features:
 * - AI Auto-fill from image analysis
 * - Cascading dropdowns (Brand → Model → Year)
 * - Auto-fill CC and Type from database
 * - User can override if AI is wrong
 * - Shows AI confidence indicator
 */

import { useState, useEffect, useMemo, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, ChevronDown, Check, AlertCircle, Search/*, RefreshCw*/ } from 'lucide-react'
import {
    MOTORCYCLE_DATABASE,
    getAllBrands,
    getModelsByBrand,
    getModelDetails,
    getYearsForModel,
    MOTORCYCLE_TYPE_LABELS,
    type MotorcycleModel,
    type MotorcycleType
} from '@/lib/motorcycle-database'

// ============================================
// TYPES
// ============================================
interface MotorcycleData {
    brand: string           // Brand key (e.g., 'honda')
    brandName: string       // Display name (e.g., 'Honda')
    model: string           // Model name
    year: number | null
    color: string
    cc: number | null
    type: MotorcycleType | null
    variant?: string
    // ✅ Essential fields for buyers
    mileage?: string        // Mileage in km
    taxStatus?: 'valid' | 'expiring' | 'expired'
    bookStatus?: 'original' | 'red_copy' | 'lost'
    accidentHistory?: 'none' | 'minor' | 'major'
    ownerCount?: '1' | '2' | '3+'
    modifications?: string
    // ✅ NEW: Priority A+B fields
    registrationProvince?: string
    spareKeys?: '2' | '1' | 'remote'
    insuranceType?: 'class1' | 'class2' | 'class3' | 'none'
    includedItems?: string[]
    sellingReason?: string
}

interface AIDetectedData {
    brand?: string          // AI detected brand
    model?: string          // AI detected model
    year?: number
    color?: string
    confidence?: number     // 0-1
}

interface SmartMotorcycleSelectorProps {
    aiData?: AIDetectedData
    initialData?: Partial<MotorcycleData>
    onChange: (data: MotorcycleData) => void
    language?: 'th' | 'en'
}

// ============================================
// SMART BRAND/MODEL MATCHER
// ============================================
function matchBrandFromText(text: string): { key: string; name: string; confidence: number } | null {
    if (!text) return null

    const textLower = text.toLowerCase().trim()

    // Direct match
    for (const [key, brand] of Object.entries(MOTORCYCLE_DATABASE)) {
        if (
            textLower === key ||
            textLower === brand.name_en.toLowerCase() ||
            textLower === brand.name_th
        ) {
            return { key, name: brand.name_en, confidence: 1.0 }
        }
    }

    // Partial match
    for (const [key, brand] of Object.entries(MOTORCYCLE_DATABASE)) {
        if (
            textLower.includes(key) ||
            textLower.includes(brand.name_en.toLowerCase()) ||
            textLower.includes(brand.name_th)
        ) {
            return { key, name: brand.name_en, confidence: 0.8 }
        }
    }

    // Fuzzy match for common variations
    const brandAliases: Record<string, string> = {
        'ฮอนด้า': 'honda',
        'ยามาฮ่า': 'yamaha',
        'คาวาซากิ': 'kawasaki',
        'ซูซูกิ': 'suzuki',
        'เวสป้า': 'vespa',
        'ดูคาติ': 'ducati',
        'บีเอ็ม': 'bmw',
        'ฮาร์เลย์': 'harley',
        'จีพีเอ็กซ์': 'gpx',
        'ไทรอัมพ์': 'triumph',
        'เคทีเอ็ม': 'ktm',
    }

    for (const [alias, brandKey] of Object.entries(brandAliases)) {
        if (textLower.includes(alias.toLowerCase())) {
            const brand = MOTORCYCLE_DATABASE[brandKey]
            if (brand) {
                return { key: brandKey, name: brand.name_en, confidence: 0.7 }
            }
        }
    }

    return null
}

function matchModelFromText(brandKey: string, text: string): { model: MotorcycleModel; confidence: number } | null {
    if (!brandKey || !text) return null

    const models = getModelsByBrand(brandKey)
    const textLower = text.toLowerCase().trim()

    // Direct match
    for (const model of models) {
        if (textLower.includes(model.name.toLowerCase())) {
            return { model, confidence: 0.9 }
        }
    }

    // Partial match (first word)
    for (const model of models) {
        const modelFirstWord = model.name.split(' ')[0].toLowerCase()
        if (textLower.includes(modelFirstWord) && modelFirstWord.length > 2) {
            return { model, confidence: 0.6 }
        }
    }

    return null
}

// ============================================
// COMPONENT
// ============================================
export default function SmartMotorcycleSelector({
    aiData,
    initialData,
    onChange,
    language = 'th'
}: SmartMotorcycleSelectorProps) {
    // State
    const [selectedBrand, setSelectedBrand] = useState<string>('')
    const [selectedModel, setSelectedModel] = useState<string>('')
    const [selectedYear, setSelectedYear] = useState<number | null>(null)
    const [color, setColor] = useState<string>('')
    const [searchQuery, setSearchQuery] = useState<string>('')
    const [showBrandDropdown, setShowBrandDropdown] = useState(false)
    const [showModelDropdown, setShowModelDropdown] = useState(false)
    const [aiMatched, setAiMatched] = useState<{
        brand?: boolean
        model?: boolean
        confidence?: number
    }>({})

    // ✅ NEW: Essential buyer info states
    const [mileage, setMileage] = useState<string>('')
    const [taxStatus, setTaxStatus] = useState<'valid' | 'expiring' | 'expired' | ''>('')
    const [bookStatus, setBookStatus] = useState<'original' | 'red_copy' | 'lost' | ''>('')
    const [accidentHistory, setAccidentHistory] = useState<'none' | 'minor' | 'major' | ''>('')
    const [ownerCount, setOwnerCount] = useState<'1' | '2' | '3+' | ''>('')
    const [modifications, setModifications] = useState<string>('')

    // ✅ NEW: Priority A+B fields
    const [registrationProvince, setRegistrationProvince] = useState<string>('')
    const [spareKeys, setSpareKeys] = useState<'2' | '1' | 'remote' | ''>('')
    const [insuranceType, setInsuranceType] = useState<'class1' | 'class2' | 'class3' | 'none' | ''>('')
    const [includedItems, setIncludedItems] = useState<string[]>([])
    const [sellingReason, setSellingReason] = useState<string>('')

    // ✅ Refs to prevent infinite loops
    const hasProcessedAiData = useRef(false)
    const hasProcessedInitialData = useRef(false)
    const onChangeRef = useRef(onChange)
    onChangeRef.current = onChange

    // Get data from database
    const allBrands = useMemo(() => getAllBrands(), [])
    const models = useMemo(() => getModelsByBrand(selectedBrand), [selectedBrand])
    const modelDetails = useMemo(() =>
        selectedBrand && selectedModel
            ? getModelDetails(selectedBrand, selectedModel)
            : null
        , [selectedBrand, selectedModel])
    const availableYears = useMemo(() =>
        selectedBrand && selectedModel
            ? getYearsForModel(selectedBrand, selectedModel).reverse()
            : []
        , [selectedBrand, selectedModel])

    // Filter brands by search
    const filteredBrands = useMemo(() => {
        if (!searchQuery) return allBrands
        const query = searchQuery.toLowerCase()
        return allBrands.filter(b =>
            b.name_th.includes(searchQuery) ||
            b.name_en.toLowerCase().includes(query) ||
            b.key.includes(query)
        )
    }, [allBrands, searchQuery])

    // Filter models by search
    const filteredModels = useMemo(() => {
        if (!searchQuery) return models
        const query = searchQuery.toLowerCase()
        return models.filter(m =>
            m.name.toLowerCase().includes(query) ||
            m.type.includes(query)
        )
    }, [models, searchQuery])

    // ✅ AI Auto-match - ONLY ONCE
    useEffect(() => {
        if (aiData && !hasProcessedAiData.current) {
            hasProcessedAiData.current = true

            let matchedBrand = false
            let matchedModel = false

            // Try to match brand
            if (aiData.brand) {
                const brandMatch = matchBrandFromText(aiData.brand)
                if (brandMatch) {
                    setSelectedBrand(brandMatch.key)
                    matchedBrand = true

                    // Try to match model
                    if (aiData.model) {
                        const modelMatch = matchModelFromText(brandMatch.key, aiData.model)
                        if (modelMatch) {
                            setSelectedModel(modelMatch.model.name)
                            matchedModel = true
                        }
                    }
                }
            }

            // Set color if provided
            if (aiData.color) {
                setColor(aiData.color)
            }

            // Set year if provided
            if (aiData.year) {
                setSelectedYear(aiData.year)
            }

            setAiMatched({
                brand: matchedBrand,
                model: matchedModel,
                confidence: aiData.confidence
            })
        }
    }, [aiData])

    // ✅ Initialize from initialData - ONLY ONCE
    useEffect(() => {
        if (initialData && !hasProcessedInitialData.current) {
            hasProcessedInitialData.current = true

            if (initialData.brand) setSelectedBrand(initialData.brand)
            if (initialData.model) setSelectedModel(initialData.model)
            if (initialData.year) setSelectedYear(initialData.year)
            if (initialData.color) setColor(initialData.color)

            // Initialize essential buyer info
            if (initialData.mileage) setMileage(initialData.mileage)
            if (initialData.taxStatus) setTaxStatus(initialData.taxStatus)
            if (initialData.bookStatus) setBookStatus(initialData.bookStatus)
            if (initialData.accidentHistory) setAccidentHistory(initialData.accidentHistory)
            if (initialData.ownerCount) setOwnerCount(initialData.ownerCount)
            if (initialData.modifications) setModifications(initialData.modifications)

            // ✅ NEW: Initialize Priority A+B fields
            if (initialData.registrationProvince) setRegistrationProvince(initialData.registrationProvince)
            if (initialData.spareKeys) setSpareKeys(initialData.spareKeys)
            if (initialData.insuranceType) setInsuranceType(initialData.insuranceType)
            if (initialData.includedItems) setIncludedItems(initialData.includedItems)
            if (initialData.sellingReason) setSellingReason(initialData.sellingReason)
        }
    }, [initialData])

    // ✅ Notify parent when data changes - use ref to avoid dependency issues
    useEffect(() => {
        const brandInfo = MOTORCYCLE_DATABASE[selectedBrand]

        onChangeRef.current({
            brand: selectedBrand,
            brandName: brandInfo?.name_en || selectedBrand,
            model: selectedModel,
            year: selectedYear,
            color,
            cc: modelDetails?.cc || null,
            type: modelDetails?.type || null,
            variant: modelDetails?.variants?.[0],
            // Essential buyer info
            mileage,
            taxStatus: taxStatus || undefined,
            bookStatus: bookStatus || undefined,
            accidentHistory: accidentHistory || undefined,
            ownerCount: ownerCount || undefined,
            modifications,
            // ✅ NEW: Priority A+B fields
            registrationProvince: registrationProvince || undefined,
            spareKeys: spareKeys || undefined,
            insuranceType: insuranceType || undefined,
            includedItems: includedItems.length > 0 ? includedItems : undefined,
            sellingReason: sellingReason || undefined,
        })
    }, [selectedBrand, selectedModel, selectedYear, color, modelDetails, mileage, taxStatus, bookStatus, accidentHistory, ownerCount, modifications, registrationProvince, spareKeys, insuranceType, includedItems, sellingReason])

    // Reset model when brand changes (but not on initial load)
    const hasMounted = useRef(false)
    useEffect(() => {
        if (hasMounted.current && selectedBrand && !models.find(m => m.name === selectedModel)) {
            setSelectedModel('')
            setSelectedYear(null)
        }
        hasMounted.current = true
    }, [selectedBrand]) // Only depend on brand change

    // Labels
    const labels = {
        th: {
            brand: 'ยี่ห้อ',
            model: 'รุ่น',
            year: 'ปี (พ.ศ./ค.ศ.)',
            color: 'สี',
            cc: 'ขนาดเครื่อง',
            type: 'ประเภท',
            selectBrand: '-- เลือกยี่ห้อ --',
            selectModel: '-- เลือกรุ่น --',
            selectYear: '-- เลือกปี --',
            search: 'ค้นหา...',
            aiDetected: 'AI ตรวจพบ',
            aiConfidence: 'ความมั่นใจ',
            canChange: 'แก้ไขได้ถ้าไม่ถูกต้อง',
            // ✅ NEW: Essential fields
            mileage: 'ระยะทาง (กม.)',
            taxStatus: 'ภาษี/พ.ร.บ.',
            bookStatus: 'สมุดเล่ม',
            accidentHistory: 'ประวัติอุบัติเหตุ',
            ownerCount: 'เจ้าของกี่มือ',
            modifications: 'ของแต่ง/อุปกรณ์เสริม',
            // Options
            taxValid: '✅ ไม่ขาด',
            taxExpiring: '⏰ ใกล้ขาด',
            taxExpired: '⚠️ ขาดแล้ว',
            bookOriginal: '📘 เล่มเดิม',
            bookRedCopy: '📕 เล่มแดง',
            bookLost: '❌ หาย',
            accidentNone: '✅ ไม่เคยมี',
            accidentMinor: '⚠️ เคยล้มเบาๆ',
            accidentMajor: '🔴 เคยซ่อมใหญ่',
            owner1: '👤 มือเดียว',
            owner2: '👥 มือสอง',
            owner3: '👥 มือสาม+',
        },
        en: {
            brand: 'Brand',
            model: 'Model',
            year: 'Year',
            color: 'Color',
            cc: 'Engine Size',
            type: 'Type',
            selectBrand: '-- Select Brand --',
            selectModel: '-- Select Model --',
            selectYear: '-- Select Year --',
            search: 'Search...',
            aiDetected: 'AI Detected',
            aiConfidence: 'Confidence',
            canChange: 'You can change if incorrect',
            // ✅ NEW: Essential fields
            mileage: 'Mileage (km)',
            taxStatus: 'Tax/Insurance',
            bookStatus: 'Registration Book',
            accidentHistory: 'Accident History',
            ownerCount: 'Previous Owners',
            modifications: 'Modifications',
            // Options
            taxValid: '✅ Valid',
            taxExpiring: '⏰ Expiring Soon',
            taxExpired: '⚠️ Expired',
            bookOriginal: '📘 Original',
            bookRedCopy: '📕 Red Copy',
            bookLost: '❌ Lost',
            accidentNone: '✅ None',
            accidentMinor: '⚠️ Minor',
            accidentMajor: '🔴 Major',
            owner1: '👤 First Owner',
            owner2: '👥 Second',
            owner3: '👥 Third+',
        }
    }

    const t = labels[language]

    return (
        <div className="space-y-4">
            {/* AI Detection Badge */}
            {(aiMatched.brand || aiMatched.model) && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 rounded-lg bg-gradient-to-r from-purple-500/20 to-pink-500/20 
                               border border-purple-500/30"
                >
                    <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-purple-400" />
                        <span className="text-sm text-purple-300">
                            {t.aiDetected}: {MOTORCYCLE_DATABASE[selectedBrand]?.name_en} {selectedModel}
                        </span>
                        {aiMatched.confidence && (
                            <span className="text-xs text-purple-400/70 ml-auto">
                                {t.aiConfidence}: {Math.round(aiMatched.confidence * 100)}%
                            </span>
                        )}
                    </div>
                    <p className="text-xs text-gray-400 mt-1">
                        💡 {t.canChange}
                    </p>
                </motion.div>
            )}

            {/* Brand Selector */}
            <div className="relative">
                <label className="text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                    {t.brand} <span className="text-red-400">*</span>
                    {aiMatched.brand && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/20 text-green-400">
                            ✓ AI
                        </span>
                    )}
                </label>

                <div
                    className="relative cursor-pointer"
                    onClick={() => {
                        setShowBrandDropdown(!showBrandDropdown)
                        setShowModelDropdown(false)
                    }}
                >
                    <div className={`w-full px-3 py-2.5 text-sm rounded-lg bg-gray-900 border 
                                    ${showBrandDropdown ? 'border-purple-500' : 'border-gray-700'}
                                    text-white flex items-center justify-between`}>
                        {selectedBrand ? (
                            <span className="flex items-center gap-2">
                                <span className="text-lg">{getCountryFlag(selectedBrand)}</span>
                                {MOTORCYCLE_DATABASE[selectedBrand]?.name_en}
                                <span className="text-gray-500">
                                    ({MOTORCYCLE_DATABASE[selectedBrand]?.name_th})
                                </span>
                            </span>
                        ) : (
                            <span className="text-gray-500">{t.selectBrand}</span>
                        )}
                        <ChevronDown className={`w-4 h-4 transition-transform ${showBrandDropdown ? 'rotate-180' : ''}`} />
                    </div>

                    {/* Brand Dropdown */}
                    <AnimatePresence>
                        {showBrandDropdown && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="absolute z-50 w-full mt-1 bg-gray-800 border border-gray-700 
                                           rounded-lg shadow-xl max-h-64 overflow-hidden"
                            >
                                {/* Search */}
                                <div className="p-2 border-b border-gray-700">
                                    <div className="relative">
                                        <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                        <input
                                            type="text"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            placeholder={t.search}
                                            className="w-full pl-8 pr-3 py-2 text-sm bg-gray-900 border border-gray-700 
                                                       rounded-lg text-white placeholder-gray-500 outline-none
                                                       focus:border-purple-500"
                                            onClick={(e) => e.stopPropagation()}
                                        />
                                    </div>
                                </div>

                                {/* Brand List */}
                                <div className="overflow-y-auto max-h-48">
                                    {filteredBrands.map((brand) => (
                                        <div
                                            key={brand.key}
                                            className={`px-3 py-2 cursor-pointer flex items-center gap-2
                                                       hover:bg-purple-500/20 transition-colors
                                                       ${selectedBrand === brand.key ? 'bg-purple-500/30' : ''}`}
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                setSelectedBrand(brand.key)
                                                setSearchQuery('')
                                                setShowBrandDropdown(false)
                                            }}
                                        >
                                            <span className="text-lg">{getCountryFlag(brand.key)}</span>
                                            <span className="text-white">{brand.name_en}</span>
                                            <span className="text-gray-500 text-sm">({brand.name_th})</span>
                                            {selectedBrand === brand.key && (
                                                <Check className="w-4 h-4 text-purple-400 ml-auto" />
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Model Selector */}
            <div className="relative">
                <label className="text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                    {t.model} <span className="text-red-400">*</span>
                    {aiMatched.model && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/20 text-green-400">
                            ✓ AI
                        </span>
                    )}
                </label>

                <div
                    className={`relative ${!selectedBrand ? 'opacity-50 pointer-events-none' : 'cursor-pointer'}`}
                    onClick={() => {
                        if (selectedBrand) {
                            setShowModelDropdown(!showModelDropdown)
                            setShowBrandDropdown(false)
                        }
                    }}
                >
                    <div className={`w-full px-3 py-2.5 text-sm rounded-lg bg-gray-900 border 
                                    ${showModelDropdown ? 'border-purple-500' : 'border-gray-700'}
                                    text-white flex items-center justify-between`}>
                        {selectedModel ? (
                            <span className="flex items-center gap-2">
                                <span>{selectedModel}</span>
                                {modelDetails && (
                                    <span className="text-gray-500 text-xs">
                                        ({modelDetails.cc}cc • {MOTORCYCLE_TYPE_LABELS[modelDetails.type]?.th})
                                    </span>
                                )}
                            </span>
                        ) : (
                            <span className="text-gray-500">{t.selectModel}</span>
                        )}
                        <ChevronDown className={`w-4 h-4 transition-transform ${showModelDropdown ? 'rotate-180' : ''}`} />
                    </div>

                    {/* Model Dropdown */}
                    <AnimatePresence>
                        {showModelDropdown && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="absolute z-50 w-full mt-1 bg-gray-800 border border-gray-700 
                                           rounded-lg shadow-xl max-h-64 overflow-hidden"
                            >
                                {/* Search */}
                                <div className="p-2 border-b border-gray-700">
                                    <div className="relative">
                                        <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                        <input
                                            type="text"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            placeholder={t.search}
                                            className="w-full pl-8 pr-3 py-2 text-sm bg-gray-900 border border-gray-700 
                                                       rounded-lg text-white placeholder-gray-500 outline-none
                                                       focus:border-purple-500"
                                            onClick={(e) => e.stopPropagation()}
                                        />
                                    </div>
                                </div>

                                {/* Model List - Grouped by Type */}
                                <div className="overflow-y-auto max-h-48">
                                    {Object.entries(groupModelsByType(filteredModels)).map(([type, typeModels]) => (
                                        <div key={type}>
                                            <div className="px-3 py-1 text-xs font-medium text-gray-500 bg-gray-900/50 sticky top-0">
                                                {MOTORCYCLE_TYPE_LABELS[type as MotorcycleType]?.emoji} {' '}
                                                {language === 'th'
                                                    ? MOTORCYCLE_TYPE_LABELS[type as MotorcycleType]?.th
                                                    : MOTORCYCLE_TYPE_LABELS[type as MotorcycleType]?.en}
                                            </div>
                                            {typeModels.map((model) => (
                                                <div
                                                    key={model.name}
                                                    className={`px-3 py-2 cursor-pointer flex items-center gap-2
                                                               hover:bg-purple-500/20 transition-colors
                                                               ${selectedModel === model.name ? 'bg-purple-500/30' : ''}`}
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        setSelectedModel(model.name)
                                                        setSearchQuery('')
                                                        setShowModelDropdown(false)
                                                    }}
                                                >
                                                    <span className="text-white">{model.name}</span>
                                                    <span className="text-gray-500 text-xs ml-auto">
                                                        {model.cc}cc
                                                    </span>
                                                    {selectedModel === model.name && (
                                                        <Check className="w-4 h-4 text-purple-400" />
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Year & Color Row */}
            <div className="grid grid-cols-2 gap-4">
                {/* Year */}
                <div>
                    <label className="text-sm font-medium text-gray-300 mb-2 block">
                        {t.year}
                    </label>
                    <select
                        value={selectedYear || ''}
                        onChange={(e) => setSelectedYear(e.target.value ? parseInt(e.target.value) : null)}
                        disabled={!selectedModel}
                        className="w-full px-3 py-2.5 text-sm rounded-lg bg-gray-900 border border-gray-700 
                                   text-white disabled:opacity-50 outline-none focus:border-purple-500"
                    >
                        <option value="">{t.selectYear}</option>
                        {availableYears.map(year => (
                            <option key={year} value={year}>
                                {year} (พ.ศ. {year + 543})
                            </option>
                        ))}
                    </select>
                </div>

                {/* Color */}
                <div>
                    <label className="text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                        {t.color}
                        {color && aiData?.color && (
                            <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/20 text-green-400">
                                ✓ AI
                            </span>
                        )}
                    </label>
                    <input
                        type="text"
                        value={color}
                        onChange={(e) => setColor(e.target.value)}
                        placeholder={language === 'th' ? 'เช่น ดำ-แดง, ขาว' : 'e.g. Black-Red, White'}
                        className="w-full px-3 py-2.5 text-sm rounded-lg bg-gray-900 border border-gray-700 
                                   text-white placeholder-gray-500 outline-none focus:border-purple-500"
                    />
                </div>
            </div>

            {/* ✅ NEW: Essential Buyer Info Section */}
            <div className="mt-4 pt-4 border-t border-gray-700">
                <div className="flex items-center gap-2 mb-3">
                    <span className="text-sm">📋</span>
                    <span className="text-sm font-medium text-purple-300">
                        {language === 'th' ? 'ข้อมูลสำคัญสำหรับผู้ซื้อ' : 'Essential Buyer Info'}
                    </span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    {/* Mileage */}
                    <div>
                        <label className="text-sm font-medium text-gray-300 mb-2 block">
                            🛣️ {t.mileage} <span className="text-red-400">*</span>
                        </label>
                        <input
                            type="text"
                            inputMode="numeric"
                            value={mileage}
                            onChange={(e) => {
                                const val = e.target.value.replace(/[^0-9]/g, '')
                                setMileage(val ? parseInt(val).toLocaleString() : '')
                            }}
                            placeholder={language === 'th' ? 'เช่น 15,000' : 'e.g. 15,000'}
                            className="w-full px-3 py-2.5 text-sm rounded-lg bg-gray-900 border border-gray-700 
                                       text-white placeholder-gray-500 outline-none focus:border-purple-500"
                        />
                    </div>

                    {/* Owner Count */}
                    <div>
                        <label className="text-sm font-medium text-gray-300 mb-2 block">
                            👤 {t.ownerCount}
                        </label>
                        <select
                            value={ownerCount}
                            onChange={(e) => setOwnerCount(e.target.value as any)}
                            className="w-full px-3 py-2.5 text-sm rounded-lg bg-gray-900 border border-gray-700 
                                       text-white outline-none focus:border-purple-500"
                        >
                            <option value="">{language === 'th' ? '-- เลือก --' : '-- Select --'}</option>
                            <option value="มือ 1">{t.owner1}</option>
                            <option value="มือ 2">{t.owner2}</option>
                            <option value="มือ 3+">{t.owner3}</option>
                        </select>
                    </div>

                    {/* Tax Status */}
                    <div>
                        <label className="text-sm font-medium text-gray-300 mb-2 block">
                            📋 {t.taxStatus}
                        </label>
                        <select
                            value={taxStatus}
                            onChange={(e) => setTaxStatus(e.target.value as any)}
                            className="w-full px-3 py-2.5 text-sm rounded-lg bg-gray-900 border border-gray-700 
                                       text-white outline-none focus:border-purple-500"
                        >
                            <option value="">{language === 'th' ? '-- เลือก --' : '-- Select --'}</option>
                            <option value="ภาษี/พ.ร.บ. ยังไม่ขาด">{t.taxValid}</option>
                            <option value="จะขาดใน 1-3 เดือน">{t.taxExpiring}</option>
                            <option value="ขาดภาษี/พ.ร.บ.">{t.taxExpired}</option>
                        </select>
                    </div>

                    {/* Book Status */}
                    <div>
                        <label className="text-sm font-medium text-gray-300 mb-2 block">
                            📘 {t.bookStatus}
                        </label>
                        <select
                            value={bookStatus}
                            onChange={(e) => setBookStatus(e.target.value as any)}
                            className="w-full px-3 py-2.5 text-sm rounded-lg bg-gray-900 border border-gray-700 
                                       text-white outline-none focus:border-purple-500"
                        >
                            <option value="">{language === 'th' ? '-- เลือก --' : '-- Select --'}</option>
                            <option value="เล่มเดิม">{t.bookOriginal}</option>
                            <option value="เล่มแดง/สำเนา">{t.bookRedCopy}</option>
                            <option value="หาย/กำลังทำใหม่">{t.bookLost}</option>
                        </select>
                    </div>

                    {/* Accident History */}
                    <div className="col-span-2">
                        <label className="text-sm font-medium text-gray-300 mb-2 block">
                            🔧 {t.accidentHistory} <span className="text-red-400">*</span>
                        </label>
                        <select
                            value={accidentHistory}
                            onChange={(e) => setAccidentHistory(e.target.value as any)}
                            className="w-full px-3 py-2.5 text-sm rounded-lg bg-gray-900 border border-gray-700 
                                       text-white outline-none focus:border-purple-500"
                        >
                            <option value="">{language === 'th' ? '-- เลือก --' : '-- Select --'}</option>
                            <option value="ไม่เคยมีอุบัติเหตุ">{t.accidentNone}</option>
                            <option value="เคยล้มเบาๆ (ซ่อมแล้ว)">{t.accidentMinor}</option>
                            <option value="เคยมีอุบัติเหตุหนัก">{t.accidentMajor}</option>
                        </select>
                    </div>


                    {/* Modifications */}
                    <div className="col-span-2">
                        <label className="text-sm font-medium text-gray-300 mb-2 block">
                            ⚙️ {t.modifications}
                        </label>
                        <input
                            type="text"
                            value={modifications}
                            onChange={(e) => setModifications(e.target.value)}
                            placeholder={language === 'th'
                                ? 'เช่น ท่อแต่ง, ไฟ LED, กระจกมองข้างแต่ง'
                                : 'e.g. Custom exhaust, LED lights, mirrors'}
                            className="w-full px-3 py-2.5 text-sm rounded-lg bg-gray-900 border border-gray-700 
                                       text-white placeholder-gray-500 outline-none focus:border-purple-500"
                        />
                    </div>
                </div>

                {/* ✅ NEW: Priority A+B Fields Section */}
                <div className="mt-4 pt-4 border-t border-gray-700/50">
                    <div className="flex items-center gap-2 mb-3">
                        <span className="text-sm">📦</span>
                        <span className="text-sm font-medium text-blue-300">
                            {language === 'th' ? 'ข้อมูลเพิ่มเติม (ช่วยขายได้เร็วขึ้น)' : 'Additional Info (Helps Sell Faster)'}
                        </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {/* Registration Province */}
                        <div>
                            <label className="text-sm font-medium text-gray-300 mb-2 block">
                                📍 {language === 'th' ? 'จังหวัดจดทะเบียน' : 'Registration Province'}
                            </label>
                            <input
                                type="text"
                                value={registrationProvince}
                                onChange={(e) => setRegistrationProvince(e.target.value)}
                                placeholder={language === 'th' ? 'เช่น กรุงเทพฯ' : 'e.g. Bangkok'}
                                className="w-full px-3 py-2.5 text-sm rounded-lg bg-gray-900 border border-gray-700 
                                           text-white placeholder-gray-500 outline-none focus:border-purple-500"
                            />
                        </div>

                        {/* Spare Keys */}
                        <div>
                            <label className="text-sm font-medium text-gray-300 mb-2 block">
                                🔑 {language === 'th' ? 'กุญแจ' : 'Keys'}
                            </label>
                            <select
                                value={spareKeys}
                                onChange={(e) => setSpareKeys(e.target.value as any)}
                                className="w-full px-3 py-2.5 text-sm rounded-lg bg-gray-900 border border-gray-700 
                                           text-white outline-none focus:border-purple-500"
                            >
                                <option value="">{language === 'th' ? '-- เลือก --' : '-- Select --'}</option>
                                <option value="มี 2 ดอก (ครบ)">{language === 'th' ? '🔑 มี 2 ดอก (ครบ)' : '🔑 2 Keys (Complete)'}</option>
                                <option value="มีดอกเดียว">{language === 'th' ? '🔑 มีดอกเดียว' : '🔑 1 Key Only'}</option>
                                <option value="มีรีโมท">{language === 'th' ? '📱 มีรีโมท' : '📱 With Remote'}</option>
                            </select>
                        </div>

                        {/* Insurance Type */}
                        <div>
                            <label className="text-sm font-medium text-gray-300 mb-2 block">
                                🛡️ {language === 'th' ? 'ประกันภัย' : 'Insurance'}
                            </label>
                            <select
                                value={insuranceType}
                                onChange={(e) => setInsuranceType(e.target.value as any)}
                                className="w-full px-3 py-2.5 text-sm rounded-lg bg-gray-900 border border-gray-700 
                                           text-white outline-none focus:border-purple-500"
                            >
                                <option value="">{language === 'th' ? '-- เลือก --' : '-- Select --'}</option>
                                <option value="ประกันชั้น 1">{language === 'th' ? '🛡️ ประกันชั้น 1' : '🛡️ Class 1'}</option>
                                <option value="ประกันชั้น 2">{language === 'th' ? '🛡️ ประกันชั้น 2' : '🛡️ Class 2'}</option>
                                <option value="ประกันชั้น 3">{language === 'th' ? '🛡️ ประกันชั้น 3' : '🛡️ Class 3'}</option>
                                <option value="ไม่มีประกันภัย">{language === 'th' ? '❌ ไม่มี' : '❌ None'}</option>
                            </select>
                        </div>

                        {/* Selling Reason */}
                        <div>
                            <label className="text-sm font-medium text-gray-300 mb-2 block">
                                📝 {language === 'th' ? 'เหตุผลที่ขาย' : 'Reason for Selling'}
                            </label>
                            <select
                                value={sellingReason}
                                onChange={(e) => setSellingReason(e.target.value)}
                                className="w-full px-3 py-2.5 text-sm rounded-lg bg-gray-900 border border-gray-700 
                                           text-white outline-none focus:border-purple-500"
                            >
                                <option value="">{language === 'th' ? '-- เลือก --' : '-- Select --'}</option>
                                <option value="เปลี่ยนรุ่นใหม่">{language === 'th' ? '⬆️ เปลี่ยนรุ่นใหม่' : '⬆️ Upgrading'}</option>
                                <option value="ใช้น้อย">{language === 'th' ? '🕐 ใช้น้อย' : '🕐 Rarely Used'}</option>
                                <option value="ต้องการเงินก้อน">{language === 'th' ? '💰 ต้องการเงินก้อน' : '💰 Need Money'}</option>
                                <option value="ย้ายบ้าน/ย้ายที่อยู่">{language === 'th' ? '🏠 ย้ายบ้าน' : '🏠 Moving'}</option>
                                <option value="เหตุผลส่วนตัว">{language === 'th' ? '🙏 เหตุผลส่วนตัว' : '🙏 Personal'}</option>
                            </select>
                        </div>

                        {/* Included Items - Multiselect */}
                        <div className="col-span-2">
                            <label className="text-sm font-medium text-gray-300 mb-2 block">
                                📦 {language === 'th' ? 'อุปกรณ์ที่ให้' : 'Included Items'}
                            </label>
                            <div className="flex flex-wrap gap-2">
                                {[
                                    { value: 'หมวกกันน็อค', th: '🪖 หมวก', en: '🪖 Helmet' },
                                    { value: 'ถุงมือ', th: '🧤 ถุงมือ', en: '🧤 Gloves' },
                                    { value: 'ผ้าคลุมรถ', th: '🎪 ผ้าคลุม', en: '🎪 Cover' },
                                    { value: 'ที่จับมือถือ', th: '📱 ที่จับมือถือ', en: '📱 Phone Holder' },
                                    { value: 'ที่ชาร์จ USB', th: '🔌 USB', en: '🔌 USB' },
                                    { value: 'กล่องท้าย', th: '📦 กล่องท้าย', en: '📦 Box' },
                                ].map(item => (
                                    <button
                                        key={item.value}
                                        type="button"
                                        onClick={() => {
                                            setIncludedItems(prev =>
                                                prev.includes(item.value)
                                                    ? prev.filter(i => i !== item.value)
                                                    : [...prev, item.value]
                                            )
                                        }}
                                        className={`px-3 py-1.5 text-xs rounded-full transition-all
                                            ${includedItems.includes(item.value)
                                                ? 'bg-green-900/30 text-green-400 border border-green-700/50'
                                                : 'bg-gray-800 text-gray-400 border border-gray-700 hover:border-gray-600'
                                            }`}
                                    >
                                        {language === 'th' ? item.th : item.en}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {modelDetails && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="p-3 rounded-lg bg-gray-800/50 border border-gray-700"
                >
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <span className="text-gray-500">{t.cc}:</span>
                            <span className="text-white ml-2 font-medium">{modelDetails.cc}cc</span>
                        </div>
                        <div>
                            <span className="text-gray-500">{t.type}:</span>
                            <span className="text-white ml-2 font-medium">
                                {MOTORCYCLE_TYPE_LABELS[modelDetails.type]?.emoji} {' '}
                                {language === 'th'
                                    ? MOTORCYCLE_TYPE_LABELS[modelDetails.type]?.th
                                    : MOTORCYCLE_TYPE_LABELS[modelDetails.type]?.en}
                            </span>
                        </div>
                    </div>

                    {/* Variants */}
                    {modelDetails.variants && modelDetails.variants.length > 0 && (
                        <div className="mt-2 pt-2 border-t border-gray-700">
                            <span className="text-gray-500 text-xs">รุ่นย่อย: </span>
                            <div className="flex flex-wrap gap-1 mt-1">
                                {modelDetails.variants.map(v => (
                                    <span
                                        key={v}
                                        className="text-xs px-2 py-0.5 rounded-full bg-gray-700 text-gray-300"
                                    >
                                        {v}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </motion.div>
            )}

            {/* Warning if no match */}
            {selectedBrand && selectedModel && !modelDetails && (
                <div className="p-3 rounded-lg bg-yellow-900/20 border border-yellow-700/50 flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-yellow-400 mt-0.5" />
                    <div className="text-sm text-yellow-200">
                        ไม่พบรุ่นนี้ในฐานข้อมูล กรุณากรอกข้อมูลเพิ่มเติม
                    </div>
                </div>
            )}
        </div>
    )
}

// ============================================
// HELPER FUNCTIONS
// ============================================
function getCountryFlag(brandKey: string): string {
    const flags: Record<string, string> = {
        honda: '🇯🇵',
        yamaha: '🇯🇵',
        kawasaki: '🇯🇵',
        suzuki: '🇯🇵',
        gpx: '🇹🇭',
        vespa: '🇮🇹',
        bmw: '🇩🇪',
        ducati: '🇮🇹',
        harley: '🇺🇸',
        triumph: '🇬🇧',
        ktm: '🇦🇹',
        royalenfield: '🇮🇳',
        benelli: '🇮🇹',
        aprilia: '🇮🇹',
        sym: '🇹🇼',
        indian: '🇺🇸',
    }
    return flags[brandKey] || '🏍️'
}

function groupModelsByType(models: MotorcycleModel[]): Record<string, MotorcycleModel[]> {
    const groups: Record<string, MotorcycleModel[]> = {}

    models.forEach(model => {
        if (!groups[model.type]) {
            groups[model.type] = []
        }
        groups[model.type].push(model)
    })

    return groups
}
