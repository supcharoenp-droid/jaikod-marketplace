'use client'

/**
 * HierarchicalCategorySelector - 14 หมวดหมู่หลัก + หมวดย่อย
 * แสดงผลแบบ expandable tree
 */

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight, ChevronDown, Check } from 'lucide-react'

interface Category {
    id: string
    name: string
    icon?: string
    subcategories?: Category[]
}

// 14 หมวดหมู่หลักตาม JaiKod
const MAIN_CATEGORIES: Category[] = [
    {
        id: '1',
        name: 'อิเล็กทรอนิกส์',
        icon: '📱',
        subcategories: [
            { id: '1-1', name: 'มือถือและแท็บเล็ต' },
            { id: '1-2', name: 'คอมพิวเตอร์' },
            { id: '1-3', name: 'แล็ปท็อป' },
            { id: '1-4', name: 'อุปกรณ์เสริม' }
        ]
    },
    {
        id: '2',
        name: 'ยานยนต์',
        icon: '🚗',
        subcategories: [
            { id: '2-1', name: 'รถยนต์' },
            { id: '2-2', name: 'มอเตอร์ไซค์' },
            { id: '2-3', name: 'อะไหล่รถยนต์' },
            { id: '2-4', name: 'อะไหล่มอเตอร์ไซค์' }
        ]
    },
    {
        id: '3',
        name: 'กล้องและอุปกรณ์',
        icon: '📷',
        subcategories: [
            { id: '3-1', name: 'กล้องดิจิทัล' },
            { id: '3-2', name: 'เลนส์' },
            { id: '3-3', name: 'โดรน' },
            { id: '3-4', name: 'อุปกรณ์เสริม' }
        ]
    },
    {
        id: '4',
        name: 'แฟชั่นและเครื่องแต่งกาย',
        icon: '👕',
        subcategories: [
            { id: '4-1', name: 'เสื้อผ้าผู้ชาย' },
            { id: '4-2', name: 'เสื้อผ้าผู้หญิง' },
            { id: '4-3', name: 'รองเท้า' },
            { id: '4-4', name: 'กระเป๋า' }
        ]
    },
    {
        id: '5',
        name: 'นาฬิกาและเครื่องประดับ',
        icon: '⌚',
        subcategories: [
            { id: '5-1', name: 'นาฬิกาข้อมือ' },
            { id: '5-2', name: 'นาฬิกาอัจฉริยะ' },
            { id: '5-3', name: 'เครื่องประดับ' },
            { id: '5-4', name: 'แหวน/สร้อยคอ' }
        ]
    },
    {
        id: '6',
        name: 'สุขภาพและความงาม',
        icon: '💄',
        subcategories: [
            { id: '6-1', name: 'ผลิตภัณฑ์ดูแลผิว' },
            { id: '6-2', name: 'เครื่องสำอาง' },
            { id: '6-3', name: 'น้ำหอม' },
            { id: '6-4', name: 'อาหารเสริม' }
        ]
    },
    {
        id: '7',
        name: 'แม่และเด็ก',
        icon: '🍼',
        subcategories: [
            { id: '7-1', name: 'เสื้อผ้าเด็ก' },
            { id: '7-2', name: 'รถเข็นเด็ก' },
            { id: '7-3', name: 'ของเล่นเด็ก' },
            { id: '7-4', name: 'อุปกรณ์ให้นม' }
        ]
    },
    {
        id: '8',
        name: 'บ้านและสวน',
        icon: '🏠',
        subcategories: [
            { id: '8-1', name: 'เฟอร์นิเจอร์' },
            { id: '8-2', name: 'ของตกแต่ง' },
            { id: '8-3', name: 'เครื่องนอน' },
            { id: '8-4', name: 'สวนและต้นไม้' }
        ]
    },
    {
        id: '9',
        name: 'เครื่องใช้ไฟฟ้า',
        icon: '🔌',
        subcategories: [
            { id: '9-1', name: 'เครื่องครัว' },
            { id: '9-2', name: 'เครื่องซักผ้า' },
            { id: '9-3', name: 'เครื่องปรับอากาศ' },
            { id: '9-4', name: 'ตู้เย็น' }
        ]
    },
    {
        id: '10',
        name: 'ของเล่นและเกม',
        icon: '🎮',
        subcategories: [
            { id: '10-1', name: 'เครื่องเล่นเกม' },
            { id: '10-2', name: 'เกมและซอฟต์แวร์' },
            { id: '10-3', name: 'ฟิกเกอร์/โมเดล' },
            { id: '10-4', name: 'Board Games' }
        ]
    },
    {
        id: '11',
        name: 'กีฬาและออกกำลังกาย',
        icon: '⚽',
        subcategories: [
            { id: '11-1', name: 'อุปกรณ์ฟิตเนส' },
            { id: '11-2', name: 'จักรยาน' },
            { id: '11-3', name: 'อุปกรณ์กีฬา' },
            { id: '11-4', name: 'เสื้อผ้ากีฬา' }
        ]
    },
    {
        id: '12',
        name: 'หนังสือและสื่อ',
        icon: '📚',
        subcategories: [
            { id: '12-1', name: 'หนังสือ' },
            { id: '12-2', name: 'นิตยสาร' },
            { id: '12-3', name: 'การ์ตูน' },
            { id: '12-4', name: 'DVD/Blu-ray' }
        ]
    },
    {
        id: '13',
        name: 'สัตว์เลี้ยง',
        icon: '🐾',
        subcategories: [
            { id: '13-1', name: 'อาหารสัตว์' },
            { id: '13-2', name: 'อุปกรณ์สัตว์เลี้ยง' },
            { id: '13-3', name: 'บ้านสัตว์เลี้ยง' },
            { id: '13-4', name: 'ยาและวิตามิน' }
        ]
    },
    {
        id: '14',
        name: 'พระเครื่อง',
        icon: '🙏',
        subcategories: [
            { id: '14-1', name: 'พระเครื่องแท้' },
            { id: '14-2', name: 'พระบูชา' },
            { id: '14-3', name: 'เหรียญหลวงพ่อ' },
            { id: '14-4', name: 'วัตถุมงคล' }
        ]
    }
]

interface Props {
    selected?: string
    onSelect: (categoryId: string, categoryPath: string) => void
    aiSuggested?: string
}

export default function HierarchicalCategorySelector({ selected, onSelect, aiSuggested }: Props) {
    const [expanded, setExpanded] = useState<string[]>(
        aiSuggested ? [aiSuggested.split('-')[0]] : []
    )

    const toggleExpand = (categoryId: string) => {
        setExpanded(prev =>
            prev.includes(categoryId)
                ? prev.filter(id => id !== categoryId)
                : [...prev, categoryId]
        )
    }

    const handleSelect = (mainCat: Category, subCat?: Category) => {
        const fullPath = subCat
            ? `${mainCat.name} > ${subCat.name}`
            : mainCat.name
        const id = subCat ? subCat.id : mainCat.id
        onSelect(id, fullPath)
    }

    return (
        <div className="space-y-2">
            {MAIN_CATEGORIES.map((mainCat) => {
                const isExpanded = expanded.includes(mainCat.id)
                const isMainSelected = selected === mainCat.id
                const hasSubSelected = selected?.startsWith(`${mainCat.id}-`)

                return (
                    <motion.div
                        key={mainCat.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        {/* Main Category */}
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => toggleExpand(mainCat.id)}
                                className="p-1 hover:bg-gray-700 rounded transition-colors"
                            >
                                {isExpanded ? (
                                    <ChevronDown className="w-4 h-4 text-gray-400" />
                                ) : (
                                    <ChevronRight className="w-4 h-4 text-gray-400" />
                                )}
                            </button>
                            <button
                                onClick={() => handleSelect(mainCat)}
                                className={`flex-1 flex items-center gap-2 px-3 py-2 rounded-lg transition-all text-left ${isMainSelected || hasSubSelected
                                        ? 'bg-purple-500/20 border-2 border-purple-500'
                                        : 'bg-gray-800/50 border-2 border-gray-700 hover:border-gray-600'
                                    }`}
                            >
                                <span className="text-xl">{mainCat.icon}</span>
                                <span className="text-sm font-medium text-gray-200 flex-1">
                                    {mainCat.name}
                                </span>
                                {(isMainSelected || hasSubSelected) && (
                                    <Check className="w-4 h-4 text-purple-400" />
                                )}
                                {aiSuggested === mainCat.id && (
                                    <span className="text-xs bg-purple-500 text-white px-2 py-0.5 rounded">
                                        AI แนะนำ
                                    </span>
                                )}
                            </button>
                        </div>

                        {/* Subcategories */}
                        <AnimatePresence>
                            {isExpanded && mainCat.subcategories && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="ml-8 mt-1 space-y-1 overflow-hidden"
                                >
                                    {mainCat.subcategories.map((subCat) => {
                                        const isSubSelected = selected === subCat.id

                                        return (
                                            <button
                                                key={subCat.id}
                                                onClick={() => handleSelect(mainCat, subCat)}
                                                className={`w-full flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all text-left ${isSubSelected
                                                        ? 'bg-purple-500/20 border-2 border-purple-500'
                                                        : 'bg-gray-900/50 border border-gray-700 hover:border-gray-600'
                                                    }`}
                                            >
                                                <span className="text-xs text-gray-400 flex-1">
                                                    {subCat.name}
                                                </span>
                                                {isSubSelected && (
                                                    <Check className="w-3 h-3 text-purple-400" />
                                                )}
                                                {aiSuggested === subCat.id && (
                                                    <span className="text-xs bg-purple-500 text-white px-1.5 py-0.5 rounded">
                                                        AI
                                                    </span>
                                                )}
                                            </button>
                                        )
                                    })}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                )
            })}
        </div>
    )
}
