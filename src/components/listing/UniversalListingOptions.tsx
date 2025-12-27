'use client'

/**
 * UNIVERSAL LISTING OPTIONS COMPONENT
 * 
 * ตัวเลือกที่ใช้ได้กับทุกหมวดหมู่:
 * - 📦 อุปกรณ์ที่แถมมา
 * - 💬 เปิดต่อราคาไหม
 * - 📍 จุดนัดรับสินค้า
 * - 🚚 วิธีจัดส่ง
 * - 💳 วิธีชำระเงิน
 * - ⏰ ส่งได้เมื่อไหร่
 */

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Package, MapPin, Truck, CreditCard, Clock, ChevronDown, ChevronUp, Check,
    MessageSquare
} from 'lucide-react'
import {
    INCLUDED_ACCESSORIES_OPTIONS,
    NEGOTIABLE_OPTIONS,
    MEETING_POINT_OPTIONS,
    SHIPPING_METHOD_OPTIONS,
    PAYMENT_METHOD_OPTIONS,
    SHIPPING_TIME_OPTIONS,
    type SelectOption,
    type MultiSelectOption,
} from '@/lib/enhanced-listing-options'

interface UniversalOptionsState {
    includedAccessories: string[]
    negotiable: string
    meetingPoints: string[]
    shippingMethods: string[]
    paymentMethods: string[]
    shippingTime: string
    otherAccessories?: string  // For "other" option
}

interface UniversalListingOptionsProps {
    values: UniversalOptionsState
    onChange: (values: UniversalOptionsState) => void
    language?: 'th' | 'en'
    categoryId?: number  // To filter relevant accessories
}

export default function UniversalListingOptions({
    values,
    onChange,
    language = 'th',
    categoryId
}: UniversalListingOptionsProps) {
    const [expandedSections, setExpandedSections] = useState<Set<string>>(
        new Set(['negotiable', 'shipping'])  // Default expanded
    )

    const toggleSection = (section: string) => {
        setExpandedSections(prev => {
            const next = new Set(prev)
            if (next.has(section)) {
                next.delete(section)
            } else {
                next.add(section)
            }
            return next
        })
    }

    const updateValue = <K extends keyof UniversalOptionsState>(
        key: K,
        value: UniversalOptionsState[K]
    ) => {
        onChange({ ...values, [key]: value })
    }

    const toggleMultiSelect = (key: 'includedAccessories' | 'meetingPoints' | 'shippingMethods' | 'paymentMethods', value: string) => {
        const current = values[key] || []
        const updated = current.includes(value)
            ? current.filter(v => v !== value)
            : [...current, value]
        updateValue(key, updated)
    }

    // Sections configuration
    const sections = [
        {
            id: 'negotiable',
            icon: <MessageSquare className="w-4 h-4" />,
            title_th: '💬 เปิดต่อราคาไหม',
            title_en: '💬 Negotiable?',
            type: 'single' as const,
            options: NEGOTIABLE_OPTIONS,
            value: values.negotiable,
            onSelect: (v: string) => updateValue('negotiable', v),
        },
        {
            id: 'shipping_time',
            icon: <Clock className="w-4 h-4" />,
            title_th: '⏰ ส่งได้เมื่อไหร่',
            title_en: '⏰ Shipping Time',
            type: 'single' as const,
            options: SHIPPING_TIME_OPTIONS,
            value: values.shippingTime,
            onSelect: (v: string) => updateValue('shippingTime', v),
        },
        {
            id: 'shipping',
            icon: <Truck className="w-4 h-4" />,
            title_th: '🚚 วิธีจัดส่ง',
            title_en: '🚚 Shipping Methods',
            type: 'multi' as const,
            options: SHIPPING_METHOD_OPTIONS,
            selectedValues: values.shippingMethods || [],
            onToggle: (v: string) => toggleMultiSelect('shippingMethods', v),
        },
        {
            id: 'payment',
            icon: <CreditCard className="w-4 h-4" />,
            title_th: '💳 วิธีชำระเงิน',
            title_en: '💳 Payment Methods',
            type: 'multi' as const,
            options: PAYMENT_METHOD_OPTIONS,
            selectedValues: values.paymentMethods || [],
            onToggle: (v: string) => toggleMultiSelect('paymentMethods', v),
        },
        {
            id: 'meeting',
            icon: <MapPin className="w-4 h-4" />,
            title_th: '📍 จุดนัดรับสินค้า',
            title_en: '📍 Meeting Points',
            type: 'multi' as const,
            options: MEETING_POINT_OPTIONS,
            selectedValues: values.meetingPoints || [],
            onToggle: (v: string) => toggleMultiSelect('meetingPoints', v),
        },
        {
            id: 'accessories',
            icon: <Package className="w-4 h-4" />,
            title_th: '📦 อุปกรณ์ที่แถมมา',
            title_en: '📦 Included Accessories',
            type: 'multi' as const,
            options: filterAccessoriesByCategory(INCLUDED_ACCESSORIES_OPTIONS, categoryId),
            selectedValues: values.includedAccessories || [],
            onToggle: (v: string) => toggleMultiSelect('includedAccessories', v),
        },
    ]

    return (
        <div className="space-y-3">
            {sections.map((section) => {
                const isExpanded = expandedSections.has(section.id)
                const title = language === 'th' ? section.title_th : section.title_en

                // Count filled items
                const filledCount = section.type === 'multi'
                    ? (section.selectedValues?.length || 0)
                    : (section.value ? 1 : 0)

                return (
                    <div
                        key={section.id}
                        className={`rounded-lg border transition-all ${isExpanded
                                ? 'border-purple-500/40 bg-purple-500/5'
                                : 'border-gray-700/50 bg-gray-800/30'
                            }`}
                    >
                        {/* Section Header */}
                        <button
                            type="button"
                            onClick={() => toggleSection(section.id)}
                            className="w-full flex items-center justify-between px-3 py-2.5"
                        >
                            <div className="flex items-center gap-2">
                                {section.icon}
                                <span className="text-sm font-medium text-white">{title}</span>
                                {filledCount > 0 && (
                                    <span className="text-xs bg-green-600/30 text-green-400 px-1.5 py-0.5 rounded">
                                        {filledCount}
                                    </span>
                                )}
                            </div>
                            {isExpanded ? (
                                <ChevronUp className="w-4 h-4 text-gray-400" />
                            ) : (
                                <ChevronDown className="w-4 h-4 text-gray-400" />
                            )}
                        </button>

                        {/* Section Content */}
                        <AnimatePresence>
                            {isExpanded && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="overflow-hidden"
                                >
                                    <div className="px-3 pb-3">
                                        {section.type === 'single' ? (
                                            <SingleSelectOptions
                                                options={section.options as SelectOption[]}
                                                selectedValue={section.value || ''}
                                                onSelect={section.onSelect!}
                                                language={language}
                                            />
                                        ) : (
                                            <MultiSelectOptions
                                                options={section.options as MultiSelectOption[]}
                                                selectedValues={section.selectedValues || []}
                                                onToggle={section.onToggle!}
                                                language={language}
                                            />
                                        )}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                )
            })}
        </div>
    )
}

// Single Select Component
function SingleSelectOptions({
    options,
    selectedValue,
    onSelect,
    language
}: {
    options: SelectOption[]
    selectedValue: string
    onSelect: (value: string) => void
    language: 'th' | 'en'
}) {
    return (
        <div className="flex flex-wrap gap-2">
            {options.map((option) => {
                const isSelected = selectedValue === option.value
                const label = language === 'th' ? option.label_th : option.label_en

                return (
                    <button
                        key={option.value}
                        type="button"
                        onClick={() => onSelect(option.value)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${isSelected
                                ? 'bg-purple-600 text-white'
                                : 'bg-gray-700/50 text-gray-300 hover:bg-gray-700'
                            }`}
                    >
                        {option.emoji && <span>{option.emoji}</span>}
                        {label}
                        {isSelected && <Check className="w-3 h-3" />}
                    </button>
                )
            })}
        </div>
    )
}

// Multi Select Component
function MultiSelectOptions({
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

    return (
        <div className="space-y-2">
            {Object.entries(grouped).map(([category, categoryOptions]) => (
                <div key={category} className="flex flex-wrap gap-2">
                    {categoryOptions.map((option) => {
                        const isSelected = selectedValues.includes(option.value)
                        const label = language === 'th' ? option.label_th : option.label_en

                        return (
                            <button
                                key={option.value}
                                type="button"
                                onClick={() => onToggle(option.value)}
                                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all flex items-center gap-1 ${isSelected
                                        ? 'bg-green-600/30 text-green-300 border border-green-500/50'
                                        : 'bg-gray-700/30 text-gray-400 border border-gray-700 hover:border-gray-600'
                                    }`}
                            >
                                {option.emoji && <span>{option.emoji}</span>}
                                {label}
                                {isSelected && <Check className="w-3 h-3 text-green-400" />}
                            </button>
                        )
                    })}
                </div>
            ))}
        </div>
    )
}

// Helper: Filter accessories by category
function filterAccessoriesByCategory(
    accessories: MultiSelectOption[],
    categoryId?: number
): MultiSelectOption[] {
    if (!categoryId) return accessories

    const categoryAccessoryMap: Record<number, string[]> = {
        1: ['manual', 'other'], // Auto - minimal
        3: ['charger', 'adapter', 'earphones', 'case', 'screen_protector', 'manual', 'other'], // Mobile
        4: ['charger', 'adapter', 'bag', 'mouse', 'keyboard', 'stand', 'manual', 'other'], // Computer
        5: ['manual', 'other'], // Appliances
        7: ['controller', 'games', 'charger', 'manual', 'other'], // Gaming
        8: ['strap', 'lens_cap', 'sd_card', 'bag', 'manual', 'other'], // Camera
    }

    const relevantCategories = categoryAccessoryMap[categoryId]
    if (!relevantCategories) return accessories

    return accessories.filter(acc =>
        relevantCategories.includes(acc.value) || acc.category === 'documents'
    )
}

// Export default state
export function getDefaultUniversalOptions(): UniversalOptionsState {
    return {
        includedAccessories: [],
        negotiable: '',
        meetingPoints: [],
        shippingMethods: [],
        paymentMethods: ['transfer', 'promptpay'],  // Default common methods
        shippingTime: '',
    }
}
