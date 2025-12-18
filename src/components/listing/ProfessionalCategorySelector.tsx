'use client'

/**
 * ProfessionalCategorySelector - แบบมืออาชีพ 14 หมวด
 * 2-Level: หมวดใหญ่ → หมวดย่อย
 * UI: Card Grid + Search + AI Suggestion
 */

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, ChevronRight, Sparkles, X } from 'lucide-react'

// 14 หมวดหมู่หลักตาม Shopee/Lazada/Kaidee
const CATEGORIES = [
    {
        id: '1',
        name: 'ยานยนต์',
        icon: '🚗',
        subs: ['รถยนต์', 'มอเตอร์ไซค์', 'อะไหล่รถยนต์', 'อุปกรณ์ตกแต่งรถ', 'ล้อ & ยาง', 'รถกระบะ', 'รถตู้', 'รถคลาสสิก', 'อุปกรณ์บำรุงรักษารถ']
    },
    {
        id: '2',
        name: 'อสังหาริมทรัพย์',
        icon: '🏢',
        subs: ['บ้านเดี่ยว', 'คอนโด', 'ที่ดิน', 'ทาวน์เฮาส์', 'อาคารพาณิชย์', 'ห้องเช่า', 'โกดัง / โรงงาน', 'พื้นที่สำนักงาน']
    },
    {
        id: '3',
        name: 'มือถือและแท็บเล็ต',
        icon: '📱',
        subs: ['สมาร์ทโฟน', 'แท็บเล็ต', 'ฟิล์ม / เคส', 'แบตสำรอง', 'สายชาร์จ / อะแดปเตอร์', 'หูฟังมือถือ', 'อุปกรณ์เสริมสำหรับมือถือ']
    },
    {
        id: '4',
        name: 'คอมพิวเตอร์และไอที',
        icon: '💻',
        subs: ['Laptop', 'Desktop PC', 'Gaming PC', 'Keyboard', 'Mouse', 'Monitor', 'External HDD / SSD', 'Networking (Router, Switch)', 'Printer', 'PC Parts (RAM, GPU, PSU, MB)']
    },
    {
        id: '5',
        name: 'เครื่องใช้ไฟฟ้า',
        icon: '🔌',
        subs: ['ทีวี', 'ตู้เย็น', 'แอร์', 'เครื่องซักผ้า', 'เตารีด', 'ไมโครเวฟ', 'เครื่องดูดฝุ่น']
    },
    {
        id: '6',
        name: 'แฟชั่น',
        icon: '👕',
        subs: ['เสื้อผ้าผู้ชาย', 'เสื้อผ้าผู้หญิง', 'รองเท้า', 'กระเป๋า', 'นาฬิกา', 'เครื่องประดับ', 'แบรนด์เนมมือสอง']
    },
    {
        id: '7',
        name: 'เกมและแก็ดเจ็ต',
        icon: '🎮',
        subs: ['เครื่องเกม (PS, Xbox, Switch)', 'Joy / Controller', 'การ์ดเกม', 'VR Headset', 'Smartwatch', 'Drone']
    },
    {
        id: '8',
        name: 'กล้องถ่ายรูป',
        icon: '📷',
        subs: ['กล้อง DSLR', 'กล้อง Mirrorless', 'เลนส์', 'ขาตั้ง', 'แฟลช', 'อุปกรณ์เสริม']
    },
    {
        id: '9',
        name: 'พระเครื่องและของสะสม',
        icon: '🙏',
        subs: ['พระเครื่อง', 'เหรียญ', 'การ์ดสะสม', 'ของแรร์', 'โมเดลฟิกเกอร์']
    },
    {
        id: '10',
        name: 'สัตว์เลี้ยง',
        icon: '🐾',
        subs: ['สุนัข', 'แมว', 'อาหารสัตว์', 'ของเล่นสัตว์', 'อุปกรณ์สัตว์เลี้ยง', 'กรง / ที่นอน']
    },
    {
        id: '11',
        name: 'บริการ',
        icon: '🛠️',
        subs: ['ช่างซ่อม', 'ทำความสะอาด', 'ซ่อมคอม', 'ติวเตอร์', 'ถ่ายรูป / ถ่ายวิดีโอ', 'บริการยานยนต์']
    },
    {
        id: '12',
        name: 'กีฬาและท่องเที่ยว',
        icon: '⚽',
        subs: ['อุปกรณ์ฟิตเนส', 'อุปกรณ์กีฬา', 'Camping & Hiking', 'จักรยาน', 'อุปกรณ์เดินป่า', 'สเก็ต / โรลเลอร์']
    },
    {
        id: '13',
        name: 'บ้านและสวน',
        icon: '🏠',
        subs: ['เฟอร์นิเจอร์', 'ของแต่งบ้าน', 'ต้นไม้', 'อุปกรณ์สวน', 'เครื่องมือช่าง']
    },
    {
        id: '14',
        name: 'เบ็ดเตล็ด',
        icon: '📦',
        subs: ['ของใช้ทั่วไป', 'สินค้าแฮนด์เมด', 'DIY', 'ของรีไซเคิล', 'เครื่องมือสำนักงาน']
    }
]

interface Props {
    selectedMain?: string
    selectedSub?: string
    onSelect: (mainId: string, mainName: string, subName?: string) => void
    aiSuggestion?: { mainId: string; subName?: string; confidence: number }
}

export default function ProfessionalCategorySelector({
    selectedMain,
    selectedSub,
    onSelect,
    aiSuggestion
}: Props) {
    const [search, setSearch] = useState('')
    const [expandedMain, setExpandedMain] = useState<string | null>(
        aiSuggestion?.mainId || null
    )

    // Filter categories by search
    const filteredCategories = CATEGORIES.filter(cat =>
        cat.name.toLowerCase().includes(search.toLowerCase()) ||
        cat.subs.some(sub => sub.toLowerCase().includes(search.toLowerCase()))
    )

    const handleMainClick = (cat: typeof CATEGORIES[0]) => {
        if (expandedMain === cat.id) {
            // If already expanded, select main category
            onSelect(cat.id, cat.name)
            setExpandedMain(null)
        } else {
            // Expand to show subcategories
            setExpandedMain(cat.id)
        }
    }

    const handleSubClick = (cat: typeof CATEGORIES[0], sub: string) => {
        onSelect(cat.id, cat.name, sub)
        setExpandedMain(null) // Collapse after selection
    }

    const handleAIClick = () => {
        if (!aiSuggestion) return
        const cat = CATEGORIES.find(c => c.id === aiSuggestion.mainId)
        if (cat) {
            onSelect(cat.id, cat.name, aiSuggestion.subName)
        }
    }

    return (
        <div className="space-y-4">
            {/* Search */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="🔍 ค้นหาหมวดหมู่..."
                    className="w-full pl-10 pr-10 py-2.5 rounded-lg bg-gray-900 border border-gray-700
                     focus:border-purple-500 text-white text-sm
                     transition-all outline-none placeholder-gray-500"
                />
                {search && (
                    <button
                        onClick={() => setSearch('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                    >
                        <X className="w-4 h-4" />
                    </button>
                )}
            </div>

            {/* AI Suggestion Button */}
            {aiSuggestion && (
                <motion.button
                    onClick={handleAIClick}
                    className="w-full p-3 rounded-lg bg-gradient-to-r from-purple-500/20 to-pink-500/20
                     border-2 border-purple-500/50 hover:border-purple-500
                     flex items-center gap-2 justify-center
                     transition-all group"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    <Sparkles className="w-4 h-4 text-purple-400 group-hover:animate-pulse" />
                    <span className="text-sm font-medium text-purple-300">
                        ใช้หมวดที่ AI แนะนำ ({aiSuggestion.confidence}% ตรง)
                    </span>
                </motion.button>
            )}

            {/* Main Categories */}
            <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
                {filteredCategories.map((cat) => {
                    const isExpanded = expandedMain === cat.id
                    const isMainSelected = selectedMain === cat.id && !selectedSub
                    const hasSubSelected = selectedMain === cat.id && selectedSub
                    const isAISuggested = aiSuggestion?.mainId === cat.id

                    return (
                        <motion.div
                            key={cat.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            {/* Main Category Card */}
                            <button
                                onClick={() => handleMainClick(cat)}
                                className={`w-full flex items-center gap-3 p-3 rounded-lg
                                 border-2 transition-all text-left group ${isMainSelected || hasSubSelected
                                        ? 'bg-purple-500/20 border-purple-500'
                                        : 'bg-gray-800/50 border-gray-700 hover:border-gray-600'
                                    }`}
                            >
                                <span className="text-2xl">{cat.icon}</span>
                                <span className="flex-1 font-medium text-white text-sm">
                                    {cat.name}
                                </span>
                                {isAISuggested && (
                                    <span className="text-xs bg-purple-500 text-white px-2 py-0.5 rounded">
                                        AI
                                    </span>
                                )}
                                <ChevronRight className={`w-4 h-4 text-gray-400 transition-transform ${isExpanded ? 'rotate-90' : ''
                                    }`} />
                            </button>

                            {/* Subcategories */}
                            <AnimatePresence>
                                {isExpanded && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                        className="overflow-hidden mt-2 ml-4"
                                    >
                                        <div className="grid grid-cols-2 gap-2">
                                            {cat.subs.map((sub, idx) => {
                                                const isSubSelected = selectedMain === cat.id && selectedSub === sub
                                                const isAISuggestedSub = aiSuggestion?.mainId === cat.id &&
                                                    aiSuggestion?.subName === sub

                                                return (
                                                    <button
                                                        key={idx}
                                                        onClick={() => handleSubClick(cat, sub)}
                                                        className={`p-2 rounded-lg text-xs text-left
                                                         border transition-all ${isSubSelected
                                                                ? 'bg-purple-500/20 border-purple-500 text-purple-300 font-medium'
                                                                : 'bg-gray-900/50 border-gray-700 hover:border-gray-600 text-gray-300'
                                                            }`}
                                                    >
                                                        {sub}
                                                        {isAISuggestedSub && (
                                                            <span className="ml-1 text-purple-400">★</span>
                                                        )}
                                                    </button>
                                                )
                                            })}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    )
                })}
            </div>

            {/* Empty State */}
            {filteredCategories.length === 0 && (
                <div className="text-center py-8 text-gray-500 text-sm">
                    ไม่พบหมวดหมู่ "{search}"
                </div>
            )}
        </div>
    )
}
