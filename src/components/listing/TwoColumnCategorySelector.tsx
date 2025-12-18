'use client'

/**
 * TwoColumnCategorySelector - แบบ 2 แถบ
 * แถบซ้าย: หมวดใหญ่
 * แถบขวา: หมวดย่อย (ตามหมวดใหญ่ที่เลือก)
 */

import { useState } from 'react'
import { motion } from 'framer-motion'

// 14 หมวดหมู่หลัก
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
}

export default function TwoColumnCategorySelector({ selectedMain, selectedSub, onSelect }: Props) {
    const [activeMainId, setActiveMainId] = useState<string>(selectedMain || '6') // Default แฟชั่น

    const activeCategory = CATEGORIES.find(c => c.id === activeMainId) || CATEGORIES[5]

    const handleMainClick = (cat: typeof CATEGORIES[0]) => {
        setActiveMainId(cat.id)
        // Don't auto-select main, wait for user to pick sub or click main again
    }

    const handleSubClick = (sub: string) => {
        onSelect(activeMainId, activeCategory.name, sub)
    }

    return (
        <div className="grid grid-cols-2 gap-3 h-80">
            {/* แถบ 1: หมวดใหญ่ */}
            <div className="border-2 border-gray-700 rounded-lg overflow-hidden">
                <div className="bg-gray-800 px-3 py-2 border-b border-gray-700">
                    <h4 className="text-xs font-medium text-gray-300">หมวดหมู่</h4>
                </div>
                <div className="overflow-y-auto h-[calc(100%-40px)] p-2 space-y-1">
                    {CATEGORIES.map((cat) => {
                        const isActive = activeMainId === cat.id

                        return (
                            <button
                                key={cat.id}
                                onClick={() => handleMainClick(cat)}
                                className={`w-full flex items-center gap-2 px-3 py-2 rounded transition-all text-left ${isActive
                                        ? 'bg-purple-500/20 border-l-4 border-purple-500 text-white'
                                        : 'hover:bg-gray-800 text-gray-400 hover:text-gray-200'
                                    }`}
                            >
                                <span className="text-lg">{cat.icon}</span>
                                <span className="text-sm font-medium">{cat.name}</span>
                            </button>
                        )
                    })}
                </div>
            </div>

            {/* แถบ 2: หมวดย่อย */}
            <div className="border-2 border-gray-700 rounded-lg overflow-hidden">
                <div className="bg-gray-800 px-3 py-2 border-b border-gray-700">
                    <h4 className="text-xs font-medium text-gray-300">หมวดย่อย</h4>
                </div>
                <div className="overflow-y-auto h-[calc(100%-40px)] p-2 space-y-1">
                    {activeCategory.subs.map((sub, idx) => {
                        const isSelected = selectedMain === activeMainId && selectedSub === sub

                        return (
                            <button
                                key={idx}
                                onClick={() => handleSubClick(sub)}
                                className={`w-full px-3 py-2 rounded transition-all text-left ${isSelected
                                        ? 'bg-purple-500/20 border-l-4 border-purple-500 text-white font-medium'
                                        : 'hover:bg-gray-800 text-gray-400 hover:text-gray-200'
                                    }`}
                            >
                                <span className="text-sm">{sub}</span>
                            </button>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}
