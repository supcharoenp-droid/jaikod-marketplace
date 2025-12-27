'use client'

/**
 * AI DYNAMIC FORM SELECTOR - React Component (V2)
 * 
 * ฟอร์มอัจฉริยะที่เปลี่ยนตาม SUBCATEGORY สินค้า
 * 
 * Features:
 * - เปลี่ยนฟอร์มตาม subcategory (ไม่ใช่แค่ category)
 * - ซ่อนฟอร์มถ้า subcategory ไม่ต้องการข้อมูลพิเศษ
 * - ทุกฟิลด์เป็น Optional
 * - AI แนะนำ แต่ไม่รบกวน
 * - เก็บค่าที่กรอกไว้ถ้าฟิลด์ยังตรงกับหมวดใหม่
 */

import React, { useState, useEffect, useCallback, useMemo } from 'react'
import {
    FormField,
    getFieldsForCategory,
    DEFAULT_FORM_FIELDS
} from '@/lib/dynamic-form-schema'
import {
    getSubcategoryFormConfig,
    requiresDetailedForm,
    getFormType,
    FormType,
    SubcategoryFormConfig
} from '@/lib/subcategory-form-mapping'

// ========================================
// TYPES
// ========================================
interface DynamicFormProps {
    categoryId: number
    subcategoryId?: number
    productTitle?: string
    initialValues?: Record<string, any>
    onChange?: (values: Record<string, any>) => void
    language?: 'th' | 'en'
    showAiTips?: boolean
    showAllFields?: boolean
}

interface FieldInputProps {
    field: FormField
    value: any
    onChange: (value: any) => void
    language: 'th' | 'en'
    showAiTip: boolean
}

// ========================================
// SUBCATEGORY-SPECIFIC FIELDS
// ========================================

// Vehicle Parts Fields (อะไหล่)
const VEHICLE_PARTS_FIELDS: FormField[] = [
    {
        id: 'compatible_brand',
        name_th: 'ใช้กับรถยี่ห้อ',
        name_en: 'Compatible Brand',
        type: 'text',
        placeholder_th: 'เช่น Toyota, Honda, Isuzu',
        placeholder_en: 'e.g. Toyota, Honda, Isuzu',
        priority: 1,
        showByDefault: true
    },
    {
        id: 'compatible_model',
        name_th: 'ใช้กับรุ่น',
        name_en: 'Compatible Model',
        type: 'text',
        placeholder_th: 'เช่น Camry, Civic, D-Max',
        placeholder_en: 'e.g. Camry, Civic, D-Max',
        priority: 2,
        showByDefault: true
    },
    {
        id: 'part_type',
        name_th: 'ประเภทอะไหล่',
        name_en: 'Part Type',
        type: 'select',
        options: [
            { value: 'oem', label_th: 'OEM (ของแท้ศูนย์)', label_en: 'OEM (Original)' },
            { value: 'aftermarket', label_th: 'Aftermarket', label_en: 'Aftermarket' },
            { value: 'used', label_th: 'มือสอง', label_en: 'Used' }
        ],
        priority: 3,
        showByDefault: true
    },
    {
        id: 'condition',
        name_th: 'สภาพ',
        name_en: 'Condition',
        type: 'select',
        options: [
            { value: 'new', label_th: 'ใหม่', label_en: 'New' },
            { value: 'like_new', label_th: 'เหมือนใหม่', label_en: 'Like New' },
            { value: 'good', label_th: 'สภาพดี', label_en: 'Good' },
            { value: 'fair', label_th: 'พอใช้', label_en: 'Fair' }
        ],
        priority: 4,
        showByDefault: true
    }
]

// Wheels & Tires Fields
const WHEELS_TIRES_FIELDS: FormField[] = [
    {
        id: 'tire_size',
        name_th: 'ขนาดยาง',
        name_en: 'Tire Size',
        type: 'text',
        placeholder_th: 'เช่น 205/55R16, 265/70R17',
        placeholder_en: 'e.g. 205/55R16, 265/70R17',
        priority: 1,
        showByDefault: true
    },
    {
        id: 'wheel_size',
        name_th: 'ขนาดล้อ',
        name_en: 'Wheel Size',
        type: 'text',
        placeholder_th: 'เช่น 17 นิ้ว, 18 นิ้ว',
        placeholder_en: 'e.g. 17 inches, 18 inches',
        priority: 2,
        showByDefault: true
    },
    {
        id: 'tire_brand',
        name_th: 'ยี่ห้อยาง',
        name_en: 'Tire Brand',
        type: 'text',
        placeholder_th: 'เช่น Michelin, Bridgestone, Goodyear',
        placeholder_en: 'e.g. Michelin, Bridgestone, Goodyear',
        priority: 3,
        showByDefault: true
    },
    {
        id: 'remaining_tread',
        name_th: 'ดอกยางเหลือ',
        name_en: 'Remaining Tread',
        type: 'select',
        options: [
            { value: '100', label_th: '100% (ใหม่)', label_en: '100% (New)' },
            { value: '80-99', label_th: '80-99%', label_en: '80-99%' },
            { value: '60-79', label_th: '60-79%', label_en: '60-79%' },
            { value: '40-59', label_th: '40-59%', label_en: '40-59%' },
            { value: 'below40', label_th: 'ต่ำกว่า 40%', label_en: 'Below 40%' }
        ],
        priority: 4,
        showByDefault: false
    }
]

// Monitor Fields
const MONITOR_FIELDS: FormField[] = [
    {
        id: 'monitor_brand',
        name_th: 'ยี่ห้อ',
        name_en: 'Brand',
        type: 'text',
        placeholder_th: 'เช่น Dell, LG, Samsung, ASUS',
        placeholder_en: 'e.g. Dell, LG, Samsung, ASUS',
        priority: 1,
        showByDefault: true
    },
    {
        id: 'screen_size',
        name_th: 'ขนาดหน้าจอ',
        name_en: 'Screen Size',
        type: 'text',
        placeholder_th: 'เช่น 24 นิ้ว, 27 นิ้ว',
        placeholder_en: 'e.g. 24 inches, 27 inches',
        priority: 2,
        showByDefault: true
    },
    {
        id: 'resolution',
        name_th: 'ความละเอียด',
        name_en: 'Resolution',
        type: 'select',
        options: [
            { value: 'fhd', label_th: 'Full HD (1920x1080)', label_en: 'Full HD (1920x1080)' },
            { value: 'qhd', label_th: 'QHD (2560x1440)', label_en: 'QHD (2560x1440)' },
            { value: '4k', label_th: '4K (3840x2160)', label_en: '4K (3840x2160)' },
            { value: 'other', label_th: 'อื่นๆ', label_en: 'Other' }
        ],
        priority: 3,
        showByDefault: true
    },
    {
        id: 'panel_type',
        name_th: 'ประเภท Panel',
        name_en: 'Panel Type',
        type: 'select',
        options: [
            { value: 'ips', label_th: 'IPS', label_en: 'IPS' },
            { value: 'va', label_th: 'VA', label_en: 'VA' },
            { value: 'tn', label_th: 'TN', label_en: 'TN' },
            { value: 'oled', label_th: 'OLED', label_en: 'OLED' }
        ],
        priority: 4,
        showByDefault: false
    },
    {
        id: 'refresh_rate',
        name_th: 'อัตรารีเฟรช',
        name_en: 'Refresh Rate',
        type: 'select',
        options: [
            { value: '60hz', label_th: '60 Hz', label_en: '60 Hz' },
            { value: '75hz', label_th: '75 Hz', label_en: '75 Hz' },
            { value: '144hz', label_th: '144 Hz', label_en: '144 Hz' },
            { value: '165hz', label_th: '165 Hz', label_en: '165 Hz' },
            { value: '240hz', label_th: '240 Hz', label_en: '240 Hz' }
        ],
        priority: 5,
        showByDefault: false
    }
]

// Pet Animal Fields
const PET_ANIMAL_FIELDS: FormField[] = [
    {
        id: 'breed',
        name_th: 'สายพันธุ์',
        name_en: 'Breed',
        type: 'text',
        placeholder_th: 'เช่น โกลเด้น, ชิวาว่า, สก็อตติช',
        placeholder_en: 'e.g. Golden, Chihuahua, Scottish',
        aiTip_th: 'ระบุสายพันธุ์ช่วยให้ผู้ซื้อตัดสินใจง่ายขึ้น',
        aiTip_en: 'Specifying breed helps buyers decide',
        priority: 1,
        showByDefault: true
    },
    {
        id: 'pet_age',
        name_th: 'อายุ',
        name_en: 'Age',
        type: 'text',
        placeholder_th: 'เช่น 3 เดือน, 1 ปี',
        placeholder_en: 'e.g. 3 months, 1 year',
        priority: 2,
        showByDefault: true
    },
    {
        id: 'pet_gender',
        name_th: 'เพศ',
        name_en: 'Gender',
        type: 'select',
        options: [
            { value: 'male', label_th: 'ผู้', label_en: 'Male' },
            { value: 'female', label_th: 'เมีย', label_en: 'Female' }
        ],
        priority: 3,
        showByDefault: true
    },
    {
        id: 'vaccinated',
        name_th: 'วัคซีน',
        name_en: 'Vaccination',
        type: 'select',
        options: [
            { value: 'full', label_th: 'ครบแล้ว', label_en: 'Fully Vaccinated' },
            { value: 'partial', label_th: 'บางส่วน', label_en: 'Partially Vaccinated' },
            { value: 'none', label_th: 'ยังไม่ได้ฉีด', label_en: 'Not Vaccinated' }
        ],
        priority: 4,
        showByDefault: true
    },
    {
        id: 'microchip',
        name_th: 'ไมโครชิพ',
        name_en: 'Microchip',
        type: 'select',
        options: [
            { value: 'yes', label_th: 'มี', label_en: 'Yes' },
            { value: 'no', label_th: 'ไม่มี', label_en: 'No' }
        ],
        priority: 5,
        showByDefault: false
    }
]

// Bicycle Fields
const BICYCLE_FIELDS: FormField[] = [
    {
        id: 'bike_brand',
        name_th: 'ยี่ห้อ',
        name_en: 'Brand',
        type: 'text',
        placeholder_th: 'เช่น Trek, Giant, Specialized',
        placeholder_en: 'e.g. Trek, Giant, Specialized',
        priority: 1,
        showByDefault: true
    },
    {
        id: 'bike_type',
        name_th: 'ประเภทจักรยาน',
        name_en: 'Bicycle Type',
        type: 'select',
        options: [
            { value: 'road', label_th: 'เสือหมอบ', label_en: 'Road Bike' },
            { value: 'mtb', label_th: 'เสือภูเขา', label_en: 'Mountain Bike' },
            { value: 'hybrid', label_th: 'ไฮบริด', label_en: 'Hybrid' },
            { value: 'folding', label_th: 'พับได้', label_en: 'Folding' },
            { value: 'fixie', label_th: 'ฟิกซ์เกียร์', label_en: 'Fixed Gear' },
            { value: 'city', label_th: 'จักรยานแม่บ้าน', label_en: 'City Bike' }
        ],
        priority: 2,
        showByDefault: true
    },
    {
        id: 'wheel_size_bike',
        name_th: 'ขนาดล้อ',
        name_en: 'Wheel Size',
        type: 'select',
        options: [
            { value: '20', label_th: '20 นิ้ว', label_en: '20 inches' },
            { value: '24', label_th: '24 นิ้ว', label_en: '24 inches' },
            { value: '26', label_th: '26 นิ้ว', label_en: '26 inches' },
            { value: '27.5', label_th: '27.5 นิ้ว', label_en: '27.5 inches' },
            { value: '29', label_th: '29 นิ้ว', label_en: '29 inches' },
            { value: '700c', label_th: '700c', label_en: '700c' }
        ],
        priority: 3,
        showByDefault: true
    },
    {
        id: 'frame_size',
        name_th: 'ขนาดเฟรม',
        name_en: 'Frame Size',
        type: 'text',
        placeholder_th: 'เช่น 52cm, M, L',
        placeholder_en: 'e.g. 52cm, M, L',
        priority: 4,
        showByDefault: false
    },
    {
        id: 'groupset',
        name_th: 'ชุดเกียร์',
        name_en: 'Groupset',
        type: 'text',
        placeholder_th: 'เช่น Shimano 105, SRAM Rival',
        placeholder_en: 'e.g. Shimano 105, SRAM Rival',
        priority: 5,
        showByDefault: false
    }
]

// ========================================
// GET FIELDS BY FORM TYPE
// ========================================
function getFieldsByFormType(formType: FormType, categoryId: number): FormField[] {
    switch (formType) {
        case 'VEHICLE_PARTS':
            return VEHICLE_PARTS_FIELDS
        case 'COMPUTER_PARTS':
            return MONITOR_FIELDS // ใช้ร่วมกัน
        case 'PET_ANIMAL':
            return PET_ANIMAL_FIELDS
        case 'BICYCLE':
            return BICYCLE_FIELDS
        case 'VEHICLE_FULL':
        case 'REAL_ESTATE':
        case 'MOBILE_DEVICE':
        case 'COMPUTER_FULL':
        case 'AMULET':
        case 'CAMERA_BODY':
        case 'CAMERA_LENS':
        case 'GAMING_CONSOLE':
            // Use category-based fields
            return getFieldsForCategory(categoryId)
        case 'DEFAULT':
        default:
            return DEFAULT_FORM_FIELDS
    }
}

// ========================================
// FIELD INPUT COMPONENT
// ========================================
const FieldInput: React.FC<FieldInputProps> = ({
    field,
    value,
    onChange,
    language,
    showAiTip
}) => {
    const label = language === 'th' ? field.name_th : field.name_en
    const placeholder = language === 'th' ? field.placeholder_th : field.placeholder_en
    const aiTip = language === 'th' ? field.aiTip_th : field.aiTip_en

    const [showTip, setShowTip] = useState(false)

    // Render different input types
    const renderInput = () => {
        switch (field.type) {
            case 'text':
            case 'number':
                return (
                    <div className="relative">
                        <input
                            type={field.type}
                            value={value || ''}
                            onChange={(e) => onChange(e.target.value)}
                            placeholder={placeholder}
                            className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg 
                                       text-white placeholder-slate-500 
                                       focus:border-purple-500 focus:ring-1 focus:ring-purple-500 
                                       transition-all duration-200"
                        />
                        {field.unit && (
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                                {field.unit}
                            </span>
                        )}
                    </div>
                )

            case 'select':
                return (
                    <select
                        value={value || ''}
                        onChange={(e) => onChange(e.target.value)}
                        className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg 
                                   text-white 
                                   focus:border-purple-500 focus:ring-1 focus:ring-purple-500 
                                   transition-all duration-200 appearance-none cursor-pointer"
                    >
                        <option value="">{language === 'th' ? '-- เลือก --' : '-- Select --'}</option>
                        {field.options?.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                                {language === 'th' ? opt.label_th : opt.label_en}
                            </option>
                        ))}
                    </select>
                )

            case 'multi-select':
                return (
                    <div className="flex flex-wrap gap-2">
                        {field.options?.map((opt) => {
                            const isSelected = Array.isArray(value) && value.includes(opt.value)
                            return (
                                <button
                                    key={opt.value}
                                    type="button"
                                    onClick={() => {
                                        const current = Array.isArray(value) ? value : []
                                        if (isSelected) {
                                            onChange(current.filter(v => v !== opt.value))
                                        } else {
                                            onChange([...current, opt.value])
                                        }
                                    }}
                                    className={`px-3 py-1.5 rounded-full text-sm transition-all ${isSelected
                                        ? 'bg-purple-600 text-white'
                                        : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                                        }`}
                                >
                                    {language === 'th' ? opt.label_th : opt.label_en}
                                </button>
                            )
                        })}
                    </div>
                )

            case 'year':
                const currentYear = new Date().getFullYear() + 543 // พ.ศ.
                const years = Array.from({ length: 30 }, (_, i) => currentYear - i)
                return (
                    <select
                        value={value || ''}
                        onChange={(e) => onChange(e.target.value)}
                        className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg 
                                   text-white 
                                   focus:border-purple-500 focus:ring-1 focus:ring-purple-500 
                                   transition-all duration-200"
                    >
                        <option value="">{language === 'th' ? '-- เลือกปี --' : '-- Select Year --'}</option>
                        {years.map((year) => (
                            <option key={year} value={year}>{year}</option>
                        ))}
                    </select>
                )

            case 'textarea':
                return (
                    <textarea
                        value={value || ''}
                        onChange={(e) => onChange(e.target.value)}
                        placeholder={placeholder}
                        rows={3}
                        className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg 
                                   text-white placeholder-slate-500 
                                   focus:border-purple-500 focus:ring-1 focus:ring-purple-500 
                                   transition-all duration-200 resize-none"
                    />
                )

            default:
                return (
                    <input
                        type="text"
                        value={value || ''}
                        onChange={(e) => onChange(e.target.value)}
                        placeholder={placeholder}
                        className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg 
                                   text-white placeholder-slate-500 
                                   focus:border-purple-500 focus:ring-1 focus:ring-purple-500 
                                   transition-all duration-200"
                    />
                )
        }
    }

    return (
        <div className="space-y-2">
            {/* Label with Optional badge */}
            <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-slate-300">
                    {label}
                    <span className="ml-2 text-xs text-slate-500">
                        ({language === 'th' ? 'ไม่บังคับ' : 'Optional'})
                    </span>
                </label>

                {/* AI Tip Toggle */}
                {showAiTip && aiTip && (
                    <button
                        type="button"
                        onClick={() => setShowTip(!showTip)}
                        className="text-purple-400 hover:text-purple-300 text-xs flex items-center gap-1 
                                   transition-colors"
                    >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                        {language === 'th' ? 'คำแนะนำ' : 'Tips'}
                    </button>
                )}
            </div>

            {/* AI Tip Message */}
            {showTip && aiTip && (
                <div className="flex items-start gap-2 p-3 bg-purple-900/30 border border-purple-700/50 
                                rounded-lg text-sm text-purple-200 animate-fadeIn">
                    <span className="text-purple-400">💡</span>
                    <span>{aiTip}</span>
                </div>
            )}

            {/* Input */}
            {renderInput()}
        </div>
    )
}

// ========================================
// MAIN COMPONENT
// ========================================
export const DynamicFormSelector: React.FC<DynamicFormProps> = ({
    categoryId,
    subcategoryId,
    productTitle,
    initialValues = {},
    onChange,
    language = 'th',
    showAiTips = true,
    showAllFields = false
}) => {
    const [formValues, setFormValues] = useState<Record<string, any>>(initialValues)
    const [showMore, setShowMore] = useState(showAllFields)

    // 🔥 NEW: Get form config based on SUBCATEGORY
    const formConfig = useMemo(() => {
        if (subcategoryId) {
            return getSubcategoryFormConfig(subcategoryId)
        }
        // Fallback to category-based
        return {
            formType: 'DEFAULT' as FormType,
            requiresDetailedForm: false,
            formLabel_th: '📦 ข้อมูลสินค้า',
            formLabel_en: '📦 Product Details'
        }
    }, [subcategoryId])

    // 🔥 Get fields based on subcategory form type
    const allFields = useMemo(() => {
        return getFieldsByFormType(formConfig.formType, categoryId)
    }, [formConfig.formType, categoryId])

    const visibleFields = showMore ? allFields : allFields.filter(f => f.showByDefault)

    // Handle field change - use setTimeout to avoid setState during render
    const handleFieldChange = useCallback((fieldId: string, value: any) => {
        setFormValues(prev => {
            const newValues = { ...prev, [fieldId]: value }
            // 🔧 FIX: Defer onChange to next tick to avoid "Cannot update component while rendering"
            if (onChange) {
                setTimeout(() => onChange(newValues), 0)
            }
            return newValues
        })
    }, [onChange])

    // Count filled fields
    const filledCount = Object.values(formValues).filter(v =>
        v !== undefined && v !== null && v !== '' &&
        (Array.isArray(v) ? v.length > 0 : true)
    ).length

    const hiddenFieldsCount = allFields.length - visibleFields.length

    // 🔥 NEW: If subcategory doesn't require detailed form, show minimal or nothing
    if (subcategoryId && !formConfig.requiresDetailedForm && formConfig.formType === 'DEFAULT') {
        // Show a minimal form with just brand/model/condition
        const minimalFields = DEFAULT_FORM_FIELDS.slice(0, 3)

        return (
            <div className="space-y-6">
                {/* Header for minimal form */}
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                            <span className="text-slate-400">📦</span>
                            {language === 'th' ? 'ข้อมูลพื้นฐาน' : 'Basic Details'}
                        </h3>
                        <p className="text-sm text-slate-400 mt-1">
                            {language === 'th'
                                ? 'กรอกถ้าต้องการ (ไม่บังคับ)'
                                : 'Fill if you want (optional)'}
                        </p>
                    </div>
                    <div className="text-right">
                        <div className="text-2xl font-bold text-slate-500">
                            {filledCount}/{minimalFields.length}
                        </div>
                        <div className="text-xs text-slate-600">
                            {language === 'th' ? 'กรอกแล้ว' : 'filled'}
                        </div>
                    </div>
                </div>

                {/* Minimal Fields Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {minimalFields.map((field) => (
                        <div key={field.id} className="animate-fadeIn">
                            <FieldInput
                                field={field}
                                value={formValues[field.id]}
                                onChange={(value) => handleFieldChange(field.id, value)}
                                language={language}
                                showAiTip={false}
                            />
                        </div>
                    ))}
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                        <span className="text-purple-400">✨</span>
                        {language === 'th' ? formConfig.formLabel_th : formConfig.formLabel_en}
                    </h3>
                    <p className="text-sm text-slate-400 mt-1">
                        {formConfig.description_th && language === 'th'
                            ? formConfig.description_th
                            : formConfig.description_en && language === 'en'
                                ? formConfig.description_en
                                : language === 'th'
                                    ? 'กรอกข้อมูลเพิ่มเพื่อช่วยให้ขายง่ายขึ้น (ไม่บังคับ)'
                                    : 'Add more details to help sell faster (optional)'}
                    </p>
                </div>

                {/* Progress indicator */}
                <div className="text-right">
                    <div className="text-2xl font-bold text-purple-400">
                        {filledCount}/{allFields.length}
                    </div>
                    <div className="text-xs text-slate-500">
                        {language === 'th' ? 'กรอกแล้ว' : 'filled'}
                    </div>
                </div>
            </div>

            {/* Fields Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {visibleFields.sort((a, b) => a.priority - b.priority).map((field) => (
                    <div
                        key={field.id}
                        className="animate-fadeIn"
                    >
                        <FieldInput
                            field={field}
                            value={formValues[field.id]}
                            onChange={(value) => handleFieldChange(field.id, value)}
                            language={language}
                            showAiTip={showAiTips}
                        />
                    </div>
                ))}
            </div>

            {/* Show More/Less Button */}
            {hiddenFieldsCount > 0 && (
                <button
                    type="button"
                    onClick={() => setShowMore(!showMore)}
                    className="w-full py-3 border border-dashed border-slate-600 rounded-lg
                               text-slate-400 hover:text-purple-400 hover:border-purple-500
                               transition-all duration-300 flex items-center justify-center gap-2"
                >
                    {showMore ? (
                        <>
                            <span>{language === 'th' ? 'แสดงน้อยลง' : 'Show Less'}</span>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                            </svg>
                        </>
                    ) : (
                        <>
                            <span>
                                {language === 'th'
                                    ? `แสดงเพิ่มเติม (${hiddenFieldsCount} ฟิลด์)`
                                    : `Show More (${hiddenFieldsCount} fields)`}
                            </span>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </>
                    )}
                </button>
            )}

            {/* AI Suggestion Banner - Only for detailed forms */}
            {showAiTips && filledCount === 0 && formConfig.requiresDetailedForm && (
                <div className="p-4 bg-gradient-to-r from-purple-900/30 to-blue-900/30 
                                border border-purple-700/50 rounded-xl flex items-start gap-3">
                    <span className="text-2xl">🤖</span>
                    <div>
                        <p className="text-purple-200 font-medium">
                            {language === 'th'
                                ? 'แนะนำให้กรอกข้อมูลในหมวดนี้'
                                : 'We recommend adding details for this category'}
                        </p>
                        <p className="text-slate-400 text-sm mt-1">
                            {language === 'th'
                                ? 'สินค้าประเภทนี้มักขายได้ดีกว่าเมื่อมีข้อมูลครบถ้วน'
                                : 'Items in this category sell better with complete details'}
                        </p>
                    </div>
                </div>
            )}
        </div>
    )
}

export default DynamicFormSelector
