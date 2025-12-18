'use client';

import { useMemo } from 'react';

interface QuickReplyButtonsProps {
    onSelect: (text: string) => void
    role: 'buyer' | 'seller'
    productTitle?: string
    categoryId?: string | number
}

const COMMON_BUYER = [
    "สวัสดีครับ สนใจสินค้าชิ้นนี้ครับ",
    "สินค้ายังอยู่ไหมครับ?",
    "ลดราคาได้ไหมครับ?",
    "สะดวกนัดรับไหมครับ?"
]

const COMMON_SELLER = [
    "สวัสดีครับ สอบถามข้อมูลเพิ่มเติมได้ครับ",
    "สินค้ายังอยู่ครับ พร้อมส่งเลย",
    "ลดได้นิดหน่อยครับ",
    "สามารถนัดรับได้ครับ"
]

const CATEGORY_REPLIES = {
    MOBILE: {
        buyer: ["แบตเตอรี่เหลือเท่าไหร่ครับ?", "อุปกรณ์ครบกล่องไหม?", "เครื่องศูนย์ไทยหรือเปล่า?", "สแกนหน้า/นิ้วปกติไหม?", "ขอดูรูปเพิ่มเติมหน่อยครับ"],
        seller: ["สุขภาพแบตเตอรี่สมบูรณ์ครับ", "อุปกรณ์ครบกล่องครับ", "เครื่องศูนย์ไทยครับ", "ใช้งานปกติทุกฟังก์ชันครับ", "แสกนหน้า/นิ้ว ปกติครับ"]
    },
    FASHION: {
        buyer: ["ขอดูไซส์ชาร์ตหน่อยครับ", "ผ้าชนิดไหนครับ?", "อก/เอว เท่าไหร่ครับ?", "มีตำหนิตรงไหนไหมครับ?", "ซักเครื่องได้ไหม?"],
        seller: ["ขนาด อก/เอว ตามรายละเอียดเลยครับ", "ผ้าใส่สบาย ไม่ร้อนครับ", "ไม่มีตำหนิครับ สภาพดีมาก", "ซักเก็บอย่างดีครับ", "งานแบรนด์แท้แน่นอนครับ"]
    },
    VEHICLE: {
        buyer: ["รถปีอะไรครับ?", "ไมล์เท่าไหร่ครับ?", "เล่มพร้อมโอนไหม?", "เคยชนหนัก/น้ำท่วมไหม?", "ขอดูเล่มหน่อยครับ"],
        seller: ["รถปีใหม่ ไมล์น้อยครับ", "เล่มทะเบียนพร้อมโอนครับ", "รถบ้านมือเดียวครับ", "ไม่เคยชนหนัก ไม่เคยน้ำท่วมครับ", "เข้าศูนย์ตลอดครับ"]
    },
    REAL_ESTATE: {
        buyer: ["โฉนดพร้อมโอนไหมครับ?", "ราคาประเมินเท่าไหร่ครับ?", "น้ำท่วมไหมครับ?", "ติดภาระจำยอมไหมครับ?"],
        seller: ["โฉนดพร้อมโอนครับ", "ทำเลดี น้ำไม่ท่วมครับ", "เจ้าของขายเองครับ", "ราคาต่อรองได้ครับ"]
    },
    AMULET: { // พระเครื่อง
        buyer: ["รับประกันแท้ไหมครับ?", "มีใบรับรองไหม?", "ทันยุคไหมครับ?", "ขอรูปขอบตัดหน่อยครับ"],
        seller: ["รับประกันแท้ตลอดชีพครับ", "มีใบรับรองสมาคมฯ ครับ", "พระสวย ผิวเดิมครับ", "ส่งประกวดได้เลยครับ"]
    }
}

// AI Logic: Detect category from title keywords if ID matches nothing or is unknown
function detectContext(title: string = ''): keyof typeof CATEGORY_REPLIES | 'GENERAL' {
    const t = title.toLowerCase()

    // Mobile / IT
    if (t.match(/iphone|samsung|oppo|vivo|xiaomi|realme|infinix|redmi|honor|oneplus|sony|โทรศัพท์|มือถือ|สมาร์ทโฟน|ipad|tablet|แท็บเล็ต/)) return 'MOBILE'

    // Fashion
    if (t.match(/เสื้อ|กางเกง|เดรส|ชุด|รองเท้า|กระเป๋า|หมวก|นาฬิกา|เข็มขัด|suit|dress|shirt|pants|jeans|sneaker|bag/)) return 'FASHION'

    // Vehicle
    if (t.match(/รถ|honda|toyota|isuzu|benz|bmw|ford|mazda|nissan|mitsubishi|mg|byd|tesla|porsche|ferrari|lamborghini|มอเตอร์ไซค์|bigbike|ducati|yamaha|kawasaki|vespa/)) return 'VEHICLE'

    // Real Estate
    if (t.match(/บ้าน|คอนโด|ที่ดิน|ตึกแถว|อาคารพาณิชย์|ทาวน์โฮม|ทาวน์เฮ้าส์|home|condo|land/)) return 'REAL_ESTATE'

    // Amulet
    if (t.match(/พระ|เหรียญ|หลวงพ่อ|วัด|เครื่องราง|ตะกรุด|ผ้ายันต์|รูปหล่อ/)) return 'AMULET'

    return 'GENERAL'
}

export default function QuickReplyButtons({ onSelect, role, productTitle, categoryId }: QuickReplyButtonsProps) {

    const replies = useMemo(() => {
        const common = role === 'buyer' ? COMMON_BUYER : COMMON_SELLER
        const contextKey = detectContext(productTitle)

        // If generalized context found, append specific questions
        if (contextKey !== 'GENERAL') {
            const specific = CATEGORY_REPLIES[contextKey][role]
            // Mix: 3 Common + 3 Specific = 6 choices
            return [
                ...common.slice(0, 3),
                ...specific.slice(0, 4)
            ]
        }

        return role === 'buyer' ?
            [...COMMON_BUYER, "มีตำหนิตรงไหนบ้างครับ?", "สภาพสินค้าเป็นยังไงบ้างครับ?"] :
            [...COMMON_SELLER, "ขอบคุณที่สนใจสินค้าของเราครับ", "ขออภัยครับ สินค้าหมดแล้ว"]

    }, [role, productTitle, categoryId])

    return (
        <div className="flex gap-2 p-3 overflow-x-auto no-scrollbar mask-gradient-x py-4">
            {replies.map((text, index) => (
                <button
                    key={index}
                    onClick={() => onSelect(text)}
                    className="flex-shrink-0 px-3 py-1.5 bg-white dark:bg-gray-800 hover:bg-purple-50 dark:hover:bg-purple-900/30 text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 text-xs font-medium rounded-full border border-gray-200 dark:border-gray-700 shadow-sm transition-all whitespace-nowrap active:scale-95"
                >
                    {text}
                </button>
            ))}
        </div>
    )
}
