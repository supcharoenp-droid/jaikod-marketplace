'use client'

/**
 * CATEGORY-SPECIFIC ENHANCED DETAILS COMPONENT
 * 
 * แสดงฟิลด์เฉพาะตามหมวดหมู่:
 * - 🚗 Automotive: ไมล์, ประวัติชน, เข้าศูนย์, ประกัน, ผ่อนต่อ
 * - 📷 Camera: Shutter count, เซนเซอร์, เลนส์
 * - 👗 Fashion: ของแท้, อุปกรณ์
 * - 🎮 Gaming: สถานะแปลง, จอย, บัญชี
 * - 🏠 Appliances: เบอร์ไฟ, เสียง, ล้างล่าสุด
 */

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, ChevronUp, Check, AlertTriangle } from 'lucide-react'
import {
    // Automotive
    AUTOMOTIVE_MILEAGE_OPTIONS,
    AUTOMOTIVE_ACCIDENT_OPTIONS,
    AUTOMOTIVE_SERVICE_OPTIONS,
    AUTOMOTIVE_INSURANCE_OPTIONS,
    AUTOMOTIVE_FINANCE_OPTIONS,
    AUTOMOTIVE_PLATE_PROVINCE_OPTIONS,
    AUTOMOTIVE_DEFECT_OPTIONS,
    // Camera
    CAMERA_SHUTTER_OPTIONS,
    CAMERA_SENSOR_OPTIONS,
    CAMERA_LENS_OPTIONS,
    CAMERA_DEFECT_OPTIONS,
    // Fashion/Luxury
    LUXURY_AUTHENTICITY_OPTIONS,
    LUXURY_BOX_OPTIONS,
    FASHION_DEFECT_OPTIONS,
    // Gaming
    GAMING_MOD_STATUS_OPTIONS,
    GAMING_CONTROLLER_OPTIONS,
    GAMING_ACCOUNT_OPTIONS,
    GAMING_DEFECT_OPTIONS,
    // Appliances
    APPLIANCE_ENERGY_OPTIONS,
    APPLIANCE_NOISE_OPTIONS,
    APPLIANCE_SERVICE_OPTIONS,
    APPLIANCE_DEFECT_OPTIONS,
    type SelectOption,
    type MultiSelectOption,
} from '@/lib/enhanced-listing-options'

// ============================================
// TYPES
// ============================================

interface CategoryEnhancedDetailsState {
    // Automotive
    mileage?: string
    accident?: string
    service?: string
    insurance?: string
    finance?: string
    plateProvince?: string  // จังหวัดทะเบียนรถ
    // Camera
    shutterCount?: string
    sensorCondition?: string
    lensCondition?: string
    // Fashion
    authenticity?: string
    luxuryBox?: string
    // Gaming
    modStatus?: string
    controllerCondition?: string
    accountIncluded?: string
    // Appliances
    energyRating?: string
    noiseLevel?: string
    lastService?: string
    // Common
    defects?: string[]
    otherDefect?: string
}

interface CategoryEnhancedDetailsProps {
    categoryId: number
    values: CategoryEnhancedDetailsState
    onChange: (values: CategoryEnhancedDetailsState) => void
    language?: 'th' | 'en'
}

// ============================================
// MAIN COMPONENT
// ============================================

export default function CategoryEnhancedDetails({
    categoryId,
    values,
    onChange,
    language = 'th'
}: CategoryEnhancedDetailsProps) {
    const [isExpanded, setIsExpanded] = useState(true)

    const updateValue = <K extends keyof CategoryEnhancedDetailsState>(
        key: K,
        value: CategoryEnhancedDetailsState[K]
    ) => {
        onChange({ ...values, [key]: value })
    }

    const toggleDefect = (value: string) => {
        const current = values.defects || []
        // If selecting "none", clear all others
        if (value === 'none') {
            updateValue('defects', ['none'])
            return
        }
        // If selecting something else, remove "none" if present
        const withoutNone = current.filter(d => d !== 'none')
        const updated = withoutNone.includes(value)
            ? withoutNone.filter(d => d !== value)
            : [...withoutNone, value]
        updateValue('defects', updated)
    }

    // Get category-specific config
    const config = getCategoryConfig(categoryId, language)
    if (!config) {
        return null  // No enhanced details for this category
    }

    const filledCount = countFilledFields(values, categoryId)
    const totalFields = config.fields.length + 1  // +1 for defects

    return (
        <div className={`rounded-lg border transition-all ${isExpanded
            ? 'border-blue-500/40 bg-blue-500/5'
            : 'border-gray-700/50 bg-gray-800/30'
            }`}>
            {/* Header */}
            <button
                type="button"
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full flex items-center justify-between px-4 py-3"
            >
                <div className="flex items-center gap-2">
                    <span className="text-lg">{config.emoji}</span>
                    <span className="text-sm font-medium text-white">
                        {config.title}
                    </span>
                    <span className="text-xs text-gray-500">
                        ({filledCount}/{totalFields} {language === 'th' ? 'รายการ' : 'filled'})
                    </span>
                    {filledCount === totalFields && (
                        <Check className="w-4 h-4 text-green-400" />
                    )}
                </div>
                {isExpanded ? (
                    <ChevronUp className="w-4 h-4 text-gray-400" />
                ) : (
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                )}
            </button>

            {/* Content */}
            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                    >
                        <div className="px-4 pb-4 space-y-4">
                            {/* Category-Specific Fields */}
                            {config.fields.map((field) => (
                                <FieldSelector
                                    key={field.key}
                                    field={field}
                                    value={values[field.key as keyof CategoryEnhancedDetailsState] as string || ''}
                                    onChange={(v) => updateValue(field.key as keyof CategoryEnhancedDetailsState, v)}
                                    language={language}
                                />
                            ))}

                            {/* Defects Section */}
                            <div className="pt-3 border-t border-gray-700">
                                <label className="text-sm font-medium text-gray-300 mb-2 block">
                                    ⚠️ {language === 'th' ? 'ตำหนิ/ข้อบกพร่อง' : 'Defects/Issues'}
                                </label>
                                <DefectSelector
                                    options={config.defects}
                                    selectedValues={values.defects || []}
                                    onToggle={toggleDefect}
                                    language={language}
                                />

                                {/* Other defect input */}
                                {(values.defects || []).includes('other') && (
                                    <input
                                        type="text"
                                        value={values.otherDefect || ''}
                                        onChange={(e) => updateValue('otherDefect', e.target.value)}
                                        placeholder={language === 'th' ? 'ระบุตำหนิอื่นๆ...' : 'Specify other defects...'}
                                        className="mt-2 w-full px-3 py-2 rounded-lg border border-gray-600 bg-gray-800 text-white text-sm placeholder-gray-500"
                                    />
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

// ============================================
// FIELD SELECTOR COMPONENT
// ============================================

interface FieldConfig {
    key: string
    label_th: string
    label_en: string
    emoji: string
    options: SelectOption[]
    required?: boolean
    useDropdown?: boolean  // Force dropdown for many options
}

function FieldSelector({
    field,
    value,
    onChange,
    language
}: {
    field: FieldConfig
    value: string
    onChange: (value: string) => void
    language: 'th' | 'en'
}) {
    const label = language === 'th' ? field.label_th : field.label_en
    const selectedOption = field.options.find(o => o.value === value)

    // Use dropdown if more than 10 options or explicitly set
    const useDropdown = field.useDropdown || field.options.length > 10

    return (
        <div>
            <label className="text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                <span>{field.emoji}</span>
                {label}
                {field.required && <span className="text-red-400">*</span>}
            </label>

            {useDropdown ? (
                // Searchable Dropdown for many options (like provinces)
                <select
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-600 bg-gray-800 text-white text-sm
                              focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                >
                    <option value="">
                        {language === 'th' ? '-- เลือก --' : '-- Select --'}
                    </option>
                    {field.options.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.emoji} {language === 'th' ? option.label_th : option.label_en}
                        </option>
                    ))}
                </select>
            ) : (
                // Button Grid for few options
                <div className="flex flex-wrap gap-2">
                    {field.options.map((option) => {
                        const isSelected = value === option.value
                        const optionLabel = language === 'th' ? option.label_th : option.label_en

                        return (
                            <button
                                key={option.value}
                                type="button"
                                onClick={() => onChange(option.value)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${isSelected
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-700/50 text-gray-300 hover:bg-gray-700'
                                    }`}
                            >
                                {option.emoji && <span>{option.emoji}</span>}
                                {optionLabel}
                                {isSelected && <Check className="w-3 h-3" />}
                            </button>
                        )
                    })}
                </div>
            )}

            {/* Show description if selected */}
            {selectedOption?.description_th && (
                <p className="mt-1 text-xs text-gray-500">
                    💡 {language === 'th' ? selectedOption.description_th : selectedOption.description_en}
                </p>
            )}
        </div>
    )
}

// ============================================
// DEFECT SELECTOR COMPONENT
// ============================================

function DefectSelector({
    options,
    selectedValues,
    onToggle,
    language
}: {
    options: MultiSelectOption[]
    selectedValues: string[]
    onToggle: (value: string) => void
    language: 'th' | 'en'
}) {
    // Group by category
    const grouped = options.reduce((acc, option) => {
        const category = option.category || 'other'
        if (!acc[category]) {
            acc[category] = []
        }
        acc[category].push(option)
        return acc
    }, {} as Record<string, MultiSelectOption[]>)

    const noneSelected = selectedValues.includes('none')

    return (
        <div className="space-y-2">
            {/* "No defects" option separately */}
            {options.find(o => o.value === 'none') && (
                <button
                    type="button"
                    onClick={() => onToggle('none')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${noneSelected
                        ? 'bg-green-600/30 text-green-300 border border-green-500/50'
                        : 'bg-gray-700/30 text-gray-400 border border-gray-700 hover:border-gray-600'
                        }`}
                >
                    ✨ {language === 'th' ? 'ไม่มีตำหนิ' : 'No defects'}
                    {noneSelected && <Check className="w-3 h-3" />}
                </button>
            )}

            {/* Other defects */}
            {!noneSelected && (
                <div className="flex flex-wrap gap-2">
                    {options
                        .filter(o => o.value !== 'none')
                        .map((option) => {
                            const isSelected = selectedValues.includes(option.value)
                            const label = language === 'th' ? option.label_th : option.label_en

                            return (
                                <button
                                    key={option.value}
                                    type="button"
                                    onClick={() => onToggle(option.value)}
                                    className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all flex items-center gap-1 ${isSelected
                                        ? 'bg-amber-600/30 text-amber-300 border border-amber-500/50'
                                        : 'bg-gray-700/30 text-gray-400 border border-gray-700 hover:border-gray-600'
                                        }`}
                                >
                                    {option.emoji && <span>{option.emoji}</span>}
                                    {label}
                                    {isSelected && <Check className="w-3 h-3" />}
                                </button>
                            )
                        })}
                </div>
            )}
        </div>
    )
}

// ============================================
// CATEGORY CONFIGURATIONS
// ============================================

interface CategoryConfig {
    emoji: string
    title: string
    fields: FieldConfig[]
    defects: MultiSelectOption[]
}

function getCategoryConfig(categoryId: number, language: 'th' | 'en'): CategoryConfig | null {
    switch (categoryId) {
        case 1: // Automotive
            return {
                emoji: '🚗',
                title: language === 'th' ? 'รายละเอียดรถยนต์' : 'Vehicle Details',
                fields: [
                    {
                        key: 'mileage',
                        label_th: 'เลขไมล์',
                        label_en: 'Mileage',
                        emoji: '📊',
                        options: AUTOMOTIVE_MILEAGE_OPTIONS,
                        required: true,
                    },
                    {
                        key: 'accident',
                        label_th: 'ประวัติอุบัติเหตุ',
                        label_en: 'Accident History',
                        emoji: '💥',
                        options: AUTOMOTIVE_ACCIDENT_OPTIONS,
                        required: true,
                    },
                    {
                        key: 'service',
                        label_th: 'ประวัติการซ่อมบำรุง',
                        label_en: 'Service History',
                        emoji: '🔧',
                        options: AUTOMOTIVE_SERVICE_OPTIONS,
                    },
                    {
                        key: 'insurance',
                        label_th: 'ประกันรถ',
                        label_en: 'Insurance',
                        emoji: '🛡️',
                        options: AUTOMOTIVE_INSURANCE_OPTIONS,
                    },
                    {
                        key: 'finance',
                        label_th: 'สถานะการผ่อน',
                        label_en: 'Financing Status',
                        emoji: '💳',
                        options: AUTOMOTIVE_FINANCE_OPTIONS,
                        required: true,
                    },
                    {
                        key: 'plateProvince',
                        label_th: 'ทะเบียนรถ (จังหวัด)',
                        label_en: 'License Plate (Province)',
                        emoji: '🚗',
                        options: AUTOMOTIVE_PLATE_PROVINCE_OPTIONS,
                        required: true,
                    },
                ],
                defects: AUTOMOTIVE_DEFECT_OPTIONS,
            }

        case 8: // Camera
            return {
                emoji: '📷',
                title: language === 'th' ? 'รายละเอียดกล้อง' : 'Camera Details',
                fields: [
                    {
                        key: 'shutterCount',
                        label_th: 'Shutter Count',
                        label_en: 'Shutter Count',
                        emoji: '📸',
                        options: CAMERA_SHUTTER_OPTIONS,
                    },
                    {
                        key: 'sensorCondition',
                        label_th: 'สภาพเซนเซอร์',
                        label_en: 'Sensor Condition',
                        emoji: '🎯',
                        options: CAMERA_SENSOR_OPTIONS,
                    },
                    {
                        key: 'lensCondition',
                        label_th: 'สภาพเลนส์ (ถ้าขายด้วย)',
                        label_en: 'Lens Condition (if included)',
                        emoji: '🔍',
                        options: CAMERA_LENS_OPTIONS,
                    },
                ],
                defects: CAMERA_DEFECT_OPTIONS,
            }

        case 6: // Fashion
        case 603: // Luxury Bags
        case 605: // Luxury Watches
            return {
                emoji: '👜',
                title: language === 'th' ? 'รายละเอียดสินค้าแบรนด์' : 'Brand Details',
                fields: [
                    {
                        key: 'authenticity',
                        label_th: 'การยืนยันของแท้',
                        label_en: 'Authenticity',
                        emoji: '✅',
                        options: LUXURY_AUTHENTICITY_OPTIONS,
                        required: true,
                    },
                    {
                        key: 'luxuryBox',
                        label_th: 'อุปกรณ์ที่มี',
                        label_en: 'Included Items',
                        emoji: '📦',
                        options: LUXURY_BOX_OPTIONS,
                    },
                ],
                defects: FASHION_DEFECT_OPTIONS,
            }

        case 7: // Gaming
            return {
                emoji: '🎮',
                title: language === 'th' ? 'รายละเอียดเครื่องเกม' : 'Gaming Console Details',
                fields: [
                    {
                        key: 'modStatus',
                        label_th: 'สถานะเครื่อง',
                        label_en: 'Modification Status',
                        emoji: '🔧',
                        options: GAMING_MOD_STATUS_OPTIONS,
                        required: true,
                    },
                    {
                        key: 'controllerCondition',
                        label_th: 'สภาพจอย/Controller',
                        label_en: 'Controller Condition',
                        emoji: '🕹️',
                        options: GAMING_CONTROLLER_OPTIONS,
                    },
                    {
                        key: 'accountIncluded',
                        label_th: 'บัญชี/เกมที่แถม',
                        label_en: 'Account/Games Included',
                        emoji: '👤',
                        options: GAMING_ACCOUNT_OPTIONS,
                    },
                ],
                defects: GAMING_DEFECT_OPTIONS,
            }

        case 5: // Appliances
            return {
                emoji: '🏠',
                title: language === 'th' ? 'รายละเอียดเครื่องใช้ไฟฟ้า' : 'Appliance Details',
                fields: [
                    {
                        key: 'energyRating',
                        label_th: 'ระดับประหยัดไฟ',
                        label_en: 'Energy Rating',
                        emoji: '⚡',
                        options: APPLIANCE_ENERGY_OPTIONS,
                    },
                    {
                        key: 'noiseLevel',
                        label_th: 'ระดับเสียง',
                        label_en: 'Noise Level',
                        emoji: '🔊',
                        options: APPLIANCE_NOISE_OPTIONS,
                    },
                    {
                        key: 'lastService',
                        label_th: 'ล้าง/ซ่อมบำรุงล่าสุด',
                        label_en: 'Last Service',
                        emoji: '🧹',
                        options: APPLIANCE_SERVICE_OPTIONS,
                    },
                ],
                defects: APPLIANCE_DEFECT_OPTIONS,
            }

        default:
            return null
    }
}

// Helper: Count filled fields
function countFilledFields(values: CategoryEnhancedDetailsState, categoryId: number): number {
    const config = getCategoryConfig(categoryId, 'th')
    if (!config) return 0

    let count = 0
    for (const field of config.fields) {
        const value = values[field.key as keyof CategoryEnhancedDetailsState]
        if (value) count++
    }
    if (values.defects && values.defects.length > 0) count++

    return count
}

// Export default state helper
export function getDefaultCategoryEnhancedState(): CategoryEnhancedDetailsState {
    return {
        defects: [],
    }
}
