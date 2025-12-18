'use client'

/**
 * DropdownCategorySelector - Dropdown 2 ช่อง
 * ช่อง 1: หมวดใหญ่
 * ช่อง 2: หมวดย่อย (แสดงตามหมวดใหญ่)
 */

import { useState, useEffect } from 'react'
import { ChevronDown } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import { CATEGORIES } from '@/constants/categories'
import { getCategoryName, getSubcategoriesForLanguage } from '@/lib/category-i18n'

// 16 หมวดหมู่หลัก (Sorted by Popularity - Based on Shopee/Lazada TH)
// NOTE: This is legacy hardcoded data - should eventually migrate to use constants/categories.ts
const LOCAL_CATS = [
    // Top Tier - Highest Traffic
    {
        id: '6',
        name: 'แฟชั่น',
        icon: '👕',
        subs: ['เสื้อผ้าผู้ชาย', 'เสื้อผ้าผู้หญิง', 'เสื้อผ้าเด็ก', 'รองเท้า', 'กระเป๋า', 'นาฬิกา', 'เครื่องประดับ', 'แบรนด์เนมมือสอง', 'ชุดว่ายน้ำ', 'ชุดชั้นใน']
    },
    {
        id: '3',
        name: 'มือถือและแท็บเล็ต',
        icon: '📱',
        subs: ['สมาร์ทโฟน', 'แท็บเล็ต', 'ฟิล์ม / เคส', 'แบตสำรอง', 'สายชาร์จ / อะแดปเตอร์', 'หูฟัง True Wireless', 'ที่ชาร์จไร้สาย', 'นาฬิกาอัจฉริยะ', 'อุปกรณ์เสริมสำหรับมือถือ']
    },
    {
        id: '15',
        name: 'ความงามและของใช้ส่วนตัว',
        icon: '💄',
        subs: ['เครื่องสำอาง', 'ผลิตภัณฑ์ดูแลผิว', 'ผลิตภัณฑ์ดูแลผม', 'น้ำหอม', 'อุปกรณ์ทำความสะอาดร่างกาย', 'อุปกรณ์แต่งหน้า', 'ผลิตภัณฑ์ผู้ชาย']
    },
    {
        id: '5',
        name: 'เครื่องใช้ไฟฟ้า',
        icon: '🔌',
        subs: ['ทีวี', 'ตู้เย็น', 'แอร์', 'เครื่องซักผ้า', 'เตารีด', 'ไมโครเวฟ', 'เครื่องดูดฝุ่น', 'หม้อหุงข้าว', 'เครื่องฟอกอากาศ', 'เครื่องทำน้ำอุ่น', 'เตาไฟฟ้า', 'พัดลม']
    },

    // High Tier - Popular
    {
        id: '13',
        name: 'บ้านและสวน',
        icon: '🏠',
        subs: ['เฟอร์นิเจอร์', 'ของแต่งบ้าน', 'ต้นไม้', 'อุปกรณ์สวน', 'เครื่องมือช่าง', 'เครื่องครัว', 'ผ้าปูที่นอน / ผ้าม่าน', 'โคมไฟ', 'พรม / เสื่อ']
    },
    {
        id: '4',
        name: 'คอมพิวเตอร์และไอที',
        icon: '💻',
        subs: ['Laptop', 'Desktop PC', 'Gaming PC', 'Keyboard', 'Mouse', 'Monitor', 'External HDD / SSD', 'Networking (Router, Switch)', 'Printer / เครื่องพิมพ์', 'PC Parts (RAM, GPU, PSU, MB)', 'เก้าอี้เกมมิ่ง', 'โต๊ะคอมพิวเตอร์']
    },
    {
        id: '16',
        name: 'แม่และเด็ก',
        icon: '👶',
        subs: ['นมผง / อาหารเด็ก', 'ผ้าอ้อม / ของใช้เด็ก', 'ของเล่นเด็ก', 'รถเข็นเด็ก / คาร์ซีท', 'เสื้อผ้าเด็ก', 'ของใช้คุณแม่', 'อุปกรณ์ให้นม']
    },
    {
        id: '12',
        name: 'กีฬาและท่องเที่ยว',
        icon: '⚽',
        subs: ['อุปกรณ์ฟิตเนส', 'อุปกรณ์กีฬา', 'Camping & Hiking', 'จักรยาน', 'อุปกรณ์เดินป่า', 'สเก็ต / โรลเลอร์', 'โยคะ / พิลาทิส', 'มวย / ศิลปะการต่อสู้', 'ว่ายน้ำ']
    },

    // Mid Tier - Steady Traffic
    {
        id: '1',
        name: 'ยานยนต์',
        icon: '🚗',
        subs: ['รถยนต์', 'มอเตอร์ไซค์', 'อะไหล่รถยนต์', 'อุปกรณ์ตกแต่งรถ', 'ล้อ & ยาง', 'รถกระบะ', 'รถตู้', 'รถคลาสสิก', 'อุปกรณ์บำรุงรักษารถ']
    },
    {
        id: '10',
        name: 'สัตว์เลี้ยง',
        icon: '🐾',
        subs: ['สุนัข', 'แมว', 'อาหารสัตว์', 'ของเล่นสัตว์', 'อุปกรณ์สัตว์เลี้ยง', 'กรง / ที่นอน']
    },
    {
        id: '7',
        name: 'เกมและแก็ดเจ็ต',
        icon: '🎮',
        subs: ['เครื่องเกม (PS, Xbox, Switch)', 'Joy / Controller', 'การ์ดเกม', 'VR Headset', 'Drone', 'อุปกรณ์เสริมเกม']
    },
    {
        id: '8',
        name: 'กล้องถ่ายรูป',
        icon: '📷',
        subs: ['กล้อง DSLR', 'กล้อง Mirrorless', 'เลนส์', 'ขาตั้ง', 'แฟลช', 'Action Camera', 'Drone Camera', 'อุปกรณ์เสริม']
    },

    // Niche Tier - Specialized
    {
        id: '9',
        name: 'พระเครื่องและของสะสม',
        icon: '🙏',
        subs: ['พระเครื่อง', 'เหรียญ', 'การ์ดสะสม', 'ของแรร์', 'โมเดลฟิกเกอร์']
    },
    {
        id: '2',
        name: 'อสังหาริมทรัพย์',
        icon: '🏢',
        subs: ['บ้านเดี่ยว', 'คอนโด', 'ที่ดิน', 'ทาวน์เฮาส์', 'อาคารพาณิชย์', 'ห้องเช่า', 'โกดัง / โรงงาน', 'พื้นที่สำนักงาน']
    },
    {
        id: '11',
        name: 'บริการ',
        icon: '🛠️',
        subs: ['ช่างซ่อม', 'ทำความสะอาด', 'ซ่อมคอม', 'ติวเตอร์', 'ถ่ายรูป / ถ่ายวิดีโอ', 'บริการยานยนต์']
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
    selectedSub?: string  // Now expects subcategory ID (e.g., '401', '408')
    onSelect: (mainId: string, mainName: string, subId?: string, subName?: string) => void  // ✅ Added subId
    aiSuggestion?: {
        mainName: string
        subId?: string      // ✅ Added: AI suggested subcategory ID
        subName?: string
        title?: string      // For keyword analysis
    }
}

// Helper: Detect category from title/product name
function detectCategoryFromTitle(title: string): { mainId: string | null, subName?: string } {
    const normalized = title.toLowerCase().trim()

    // Product keyword mapping with priority (Based on Shopee/Lazada/JD standards)
    const productMap: Record<string, { id: string, sub?: string, priority?: number }> = {
        // ยานยนต์ (Vehicles)
        'รถยนต์': { id: '1', sub: 'รถยนต์', priority: 10 },
        'รถเก๋ง': { id: '1', sub: 'รถยนต์', priority: 10 },
        'รถซีดาน': { id: '1', sub: 'รถยนต์', priority: 10 },
        'รถกระบะ': { id: '1', sub: 'รถกระบะ', priority: 10 },
        'pickup': { id: '1', sub: 'รถกระบะ', priority: 9 },
        'มอเตอร์ไซค์': { id: '1', sub: 'มอเตอร์ไซค์', priority: 10 },
        'มอไซค์': { id: '1', sub: 'มอเตอร์ไซค์', priority: 10 },
        'รถจักรยานยนต์': { id: '1', sub: 'มอเตอร์ไซค์', priority: 10 },
        'บิ๊กไบค์': { id: '1', sub: 'มอเตอร์ไซค์', priority: 9 },
        'ยาง': { id: '1', sub: 'ล้อ & ยาง', priority: 9 },
        'ล้อแม็ก': { id: '1', sub: 'ล้อ & ยาง', priority: 9 },
        'ปั๊มลม': { id: '1', sub: 'อุปกรณ์บำรุงรักษารถ', priority: 10 },
        'เครื่องปั๊มลม': { id: '1', sub: 'อุปกรณ์บำรุงรักษารถ', priority: 10 },
        'air pump': { id: '1', sub: 'อุปกรณ์บำรุงรักษารถ', priority: 10 },
        'ปั๊มลมพกพา': { id: '1', sub: 'อุปกรณ์บำรุงรักษารถ', priority: 10 },
        'ที่เติมลมยาง': { id: '1', sub: 'อุปกรณ์บำรุงรักษารถ', priority: 10 },
        'น้ำมันเครื่อง': { id: '1', sub: 'อุปกรณ์บำรุงรักษารถ', priority: 9 },
        'แบตเตอรี่': { id: '1', sub: 'อุปกรณ์บำรุงรักษารถ', priority: 9 },
        'battery': { id: '1', sub: 'อุปกรณ์บำรุงรักษารถ', priority: 8 },

        // อสังหาริมทรัพย์ (Real Estate)
        'บ้าน': { id: '2', sub: 'บ้านเดี่ยว', priority: 8 },
        'บ้านเดี่ยว': { id: '2', sub: 'บ้านเดี่ยว', priority: 10 },
        'คอนโด': { id: '2', sub: 'คอนโด', priority: 10 },
        'คอนโดมิเนียม': { id: '2', sub: 'คอนโด', priority: 10 },
        'ทาวน์เฮ้าส์': { id: '2', sub: 'ทาวน์เฮาส์', priority: 10 },
        'ทาวน์โฮม': { id: '2', sub: 'ทาวน์เฮาส์', priority: 10 },
        'ที่ดิน': { id: '2', sub: 'ที่ดิน', priority: 10 },

        // มือถือและแท็บเล็ต (Mobile & Tablet)
        'iphone': { id: '3', sub: 'สมาร์ทโฟน', priority: 10 },
        'samsung': { id: '3', sub: 'สมาร์ทโฟน', priority: 10 },
        'oppo': { id: '3', sub: 'สมาร์ทโฟน', priority: 10 },
        'vivo': { id: '3', sub: 'สมาร์ทโฟน', priority: 10 },
        'xiaomi': { id: '3', sub: 'สมาร์ทโฟน', priority: 10 },
        'มือถือ': { id: '3', sub: 'สมาร์ทโฟน', priority: 9 },
        'โทรศัพท์': { id: '3', sub: 'สมาร์ทโฟน', priority: 9 },
        'สมาร์ทโฟน': { id: '3', sub: 'สมาร์ทโฟน', priority: 10 },
        'smartphone': { id: '3', sub: 'สมาร์ทโฟน', priority: 8 },
        'ipad': { id: '3', sub: 'แท็บเล็ต', priority: 10 },
        'แท็บเล็ต': { id: '3', sub: 'แท็บเล็ต', priority: 10 },
        'tablet': { id: '3', sub: 'แท็บเล็ต', priority: 8 },
        'airpods': { id: '3', sub: 'หูฟัง True Wireless', priority: 10 },
        'หูฟังบลูทูธ': { id: '3', sub: 'หูฟัง True Wireless', priority: 9 },
        'หูฟังไร้สาย': { id: '3', sub: 'หูฟัง True Wireless', priority: 9 },
        'true wireless': { id: '3', sub: 'หูฟัง True Wireless', priority: 8 },
        'เคสมือถือ': { id: '3', sub: 'ฟิล์ม / เคส', priority: 9 },
        'ฟิล์มกันรอย': { id: '3', sub: 'ฟิล์ม / เคส', priority: 9 },
        'powerbank': { id: '3', sub: 'แบตสำรอง', priority: 10 },
        'แบตสำรอง': { id: '3', sub: 'แบตสำรอง', priority: 10 },

        // คอมพิวเตอร์และไอที (Computer & IT)
        'notebook': { id: '4', sub: 'Laptop', priority: 10 },
        'laptop': { id: '4', sub: 'Laptop', priority: 10 },
        'แล็ปท็อป': { id: '4', sub: 'Laptop', priority: 10 },
        'โน้ตบุ๊ค': { id: '4', sub: 'Laptop', priority: 10 },
        'macbook': { id: '4', sub: 'Laptop', priority: 10 },
        'gaming pc': { id: '4', sub: 'Gaming PC', priority: 10 },
        'คอมเกม': { id: '4', sub: 'Gaming PC', priority: 10 },
        'pantum': { id: '4', sub: 'Printer / เครื่องพิมพ์', priority: 10 },
        'hp': { id: '4', sub: 'Printer / เครื่องพิมพ์', priority: 9 },
        'epson': { id: '4', sub: 'Printer / เครื่องพิมพ์', priority: 9 },
        'brother': { id: '4', sub: 'Printer / เครื่องพิมพ์', priority: 9 },
        'printer': { id: '4', sub: 'Printer / เครื่องพิมพ์', priority: 10 },
        'เครื่องพิมพ์': { id: '4', sub: 'Printer / เครื่องพิมพ์', priority: 10 },
        'เลเซอร์': { id: '4', sub: 'Printer / เครื่องพิมพ์', priority: 9 },
        'laser': { id: '4', sub: 'Printer / เครื่องพิมพ์', priority: 9 },
        'คีย์บอร์ด': { id: '4', sub: 'Keyboard', priority: 9 },
        'keyboard': { id: '4', sub: 'Keyboard', priority: 9 },
        'เมาส์': { id: '4', sub: 'Mouse', priority: 9 },
        'mouse': { id: '4', sub: 'Mouse', priority: 9 },
        'จอคอม': { id: '4', sub: 'Monitor', priority: 9 },
        'monitor': { id: '4', sub: 'Monitor', priority: 9 },
        'ssd': { id: '4', sub: 'External HDD / SSD', priority: 10 },
        'harddisk': { id: '4', sub: 'External HDD / SSD', priority: 9 },
        'ram': { id: '4', sub: 'PC Parts (RAM, GPU, PSU, MB)', priority: 10 },
        'graphic card': { id: '4', sub: 'PC Parts (RAM, GPU, PSU, MB)', priority: 10 },
        'การ์ดจอ': { id: '4', sub: 'PC Parts (RAM, GPU, PSU, MB)', priority: 10 },

        // เครื่องใช้ไฟฟ้า (Appliances)
        'ทีวี': { id: '5', sub: 'ทีวี', priority: 10 },
        'โทรทัศน์': { id: '5', sub: 'ทีวี', priority: 10 },
        'smart tv': { id: '5', sub: 'ทีวี', priority: 10 },
        'samsung tv': { id: '5', sub: 'ทีวี', priority: 10 },
        'lg tv': { id: '5', sub: 'ทีวี', priority: 10 },
        'ตู้เย็น': { id: '5', sub: 'ตู้เย็น', priority: 10 },
        'refrigerator': { id: '5', sub: 'ตู้เย็น', priority: 8 },
        'แอร์': { id: '5', sub: 'แอร์', priority: 10 },
        'เครื่องปรับอากาศ': { id: '5', sub: 'แอร์', priority: 10 },
        'air conditioner': { id: '5', sub: 'แอร์', priority: 8 },
        'เครื่องซักผ้า': { id: '5', sub: 'เครื่องซักผ้า', priority: 10 },
        'washing machine': { id: '5', sub: 'เครื่องซักผ้า', priority: 8 },
        'ไมโครเวฟ': { id: '5', sub: 'ไมโครเวฟ', priority: 10 },
        'microwave': { id: '5', sub: 'ไมโครเวฟ', priority: 8 },
        'หม้อหุงข้าว': { id: '5', sub: 'หม้อหุงข้าว', priority: 10 },
        'rice cooker': { id: '5', sub: 'หม้อหุงข้าว', priority: 8 },
        'เครื่องฟอกอากาศ': { id: '5', sub: 'เครื่องฟอกอากาศ', priority: 10 },
        'air purifier': { id: '5', sub: 'เครื่องฟอกอากาศ', priority: 8 },
        'พัดลม ': { id: '5', sub: 'พัดลม', priority: 8 },
        ' พัดลม': { id: '5', sub: 'พัดลม', priority: 8 },
        'fan ': { id: '5', sub: 'พัดลม', priority: 7 },
        'hatari': { id: '5', sub: 'พัดลม', priority: 9 },
        'mitsubishi': { id: '5', sub: 'พัดลม', priority: 9 },
        'เครื่องดูดฝุ่น': { id: '5', sub: 'เครื่องดูดฝุ่น', priority: 10 },
        'เครื่องทำน้ำอุ่น': { id: '5', sub: 'เครื่องทำน้ำอุ่น', priority: 10 },

        // แฟชั่น (Fashion)
        'เสื้อ': { id: '6', sub: 'เสื้อผ้าผู้ชาย', priority: 6 },
        'กางเกง': { id: '6', sub: 'เสื้อผ้าผู้ชาย', priority: 6 },
        'เดรส': { id: '6', sub: 'เสื้อผ้าผู้หญิง', priority: 9 },
        'กระโปรง': { id: '6', sub: 'เสื้อผ้าผู้หญิง', priority: 9 },
        'รองเท้า': { id: '6', sub: 'รองเท้า', priority: 9 },
        'รองเท้าผ้าใบ': { id: '6', sub: 'รองเท้า', priority: 9 },
        'รองเท้าส้นสูง': { id: '6', sub: 'รองเท้า', priority: 9 },
        'sneaker': { id: '6', sub: 'รองเท้า', priority: 9 },
        'nike': { id: '6', sub: 'รองเท้า', priority: 9 },
        'adidas': { id: '6', sub: 'รองเท้า', priority: 9 },
        'กระเป๋า': { id: '6', sub: 'กระเป๋า', priority: 9 },
        'กระเป๋าสตางค์': { id: '6', sub: 'กระเป๋า', priority: 9 },
        'กระเป๋าเป้': { id: '6', sub: 'กระเป๋า', priority: 9 },
        'backpack': { id: '6', sub: 'กระเป๋า', priority: 8 },
        'นาฬิกา': { id: '6', sub: 'นาฬิกา', priority: 9 },
        'นาฬิกาข้อมือ': { id: '6', sub: 'นาฬิกา', priority: 9 },
        'watch': { id: '6', sub: 'นาฬิกา', priority: 8 },
        'rolex': { id: '6', sub: 'นาฬิกา', priority: 10 },
        'seiko': { id: '6', sub: 'นาฬิกา', priority: 10 },
        'casio': { id: '6', sub: 'นาฬิกา', priority: 10 },
        'สร้อย': { id: '6', sub: 'เครื่องประดับ', priority: 9 },
        'แหวน': { id: '6', sub: 'เครื่องประดับ', priority: 9 },
        'ต่างหู': { id: '6', sub: 'เครื่องประดับ', priority: 9 },

        // เกมและแก็ดเจ็ต (Gaming & Gadgets)
        'playstation': { id: '7', sub: 'เครื่องเกม (PS, Xbox, Switch)', priority: 10 },
        'ps5': { id: '7', sub: 'เครื่องเกม (PS, Xbox, Switch)', priority: 10 },
        'ps4': { id: '7', sub: 'เครื่องเกม (PS, Xbox, Switch)', priority: 10 },
        'xbox': { id: '7', sub: 'เครื่องเกม (PS, Xbox, Switch)', priority: 10 },
        'nintendo switch': { id: '7', sub: 'เครื่องเกม (PS, Xbox, Switch)', priority: 10 },
        'switch': { id: '7', sub: 'เครื่องเกม (PS, Xbox, Switch)', priority: 6 },
        'จอยเกม': { id: '7', sub: 'Joy / Controller', priority: 9 },
        'controller': { id: '7', sub: 'Joy / Controller', priority: 9 },
        'vr': { id: '7', sub: 'VR Headset', priority: 10 },
        'oculus': { id: '7', sub: 'VR Headset', priority: 10 },
        'drone': { id: '7', sub: 'Drone', priority: 10 },
        'โดรน': { id: '7', sub: 'Drone', priority: 10 },

        // กล้องถ่ายรูป (Camera)
        'กล้อง': { id: '8', priority: 8 },
        'camera': { id: '8', priority: 7 },
        'dslr': { id: '8', sub: 'กล้อง DSLR', priority: 10 },
        'mirrorless': { id: '8', sub: 'กล้อง Mirrorless', priority: 10 },
        'canon': { id: '8', sub: 'กล้อง DSLR', priority: 9 },
        'nikon': { id: '8', sub: 'กล้อง DSLR', priority: 9 },
        'sony': { id: '8', sub: 'กล้อง Mirrorless', priority: 9 },
        'fujifilm': { id: '8', sub: 'กล้อง Mirrorless', priority: 9 },
        'เลนส์': { id: '8', sub: 'เลนส์', priority: 9 },
        'lens': { id: '8', sub: 'เลนส์', priority: 8 },
        'gopro': { id: '8', sub: 'Action Camera', priority: 10 },
        'action camera': { id: '8', sub: 'Action Camera', priority: 9 },
        'กล้องกันน้ำ': { id: '8', sub: 'Action Camera', priority: 9 },

        // พระเครื่อง (Amulets & Collectibles)
        'พระ': { id: '9', sub: 'พระเครื่อง', priority: 9 },
        'พระเครื่อง': { id: '9', sub: 'พระเครื่อง', priority: 10 },
        'amulet': { id: '9', sub: 'พระเครื่อง', priority: 10 },
        'เหรียญ': { id: '9', sub: 'เหรียญ', priority: 9 },
        'การ์ดโปเกมอน': { id: '9', sub: 'การ์ดสะสม', priority: 10 },
        'pokemon card': { id: '9', sub: 'การ์ดสะสม', priority: 10 },
        'โมเดล': { id: '9', sub: 'โมเดลฟิกเกอร์', priority: 9 },
        'ฟิกเกอร์': { id: '9', sub: 'โมเดลฟิกเกอร์', priority: 9 },

        // สัตว์เลี้ยง (Pets)
        'สุนัข': { id: '10', sub: 'สุนัข', priority: 10 },
        'หมา': { id: '10', sub: 'สุนัข', priority: 10 },
        'dog': { id: '10', sub: 'สุนัข', priority: 8 },
        'แมว': { id: '10', sub: 'แมว', priority: 10 },
        'cat': { id: '10', sub: 'แมว', priority: 8 },
        'อาหารสุนัข': { id: '10', sub: 'อาหารสัตว์', priority: 10 },
        'อาหารแมว': { id: '10', sub: 'อาหารสัตว์', priority: 10 },
        'ขนมสุนัข': { id: '10', sub: 'อาหารสัตว์', priority: 9 },
        'ขนมแมว': { id: '10', sub: 'อาหารสัตว์', priority: 9 },

        // กีฬา (Sports)
        'ดัมเบล': { id: '12', sub: 'อุปกรณ์ฟิตเนส', priority: 10 },
        'dumbbell': { id: '12', sub: 'อุปกรณ์ฟิตเนส', priority: 9 },
        'บาร์เบล': { id: '12', sub: 'อุปกรณ์ฟิตเนส', priority: 10 },
        'ลู่วิ่ง': { id: '12', sub: 'อุปกรณ์ฟิตเนส', priority: 10 },
        'treadmill': { id: '12', sub: 'อุปกรณ์ฟิตเนส', priority: 9 },
        'จักรยาน': { id: '12', sub: 'จักรยาน', priority: 10 },
        'จักรยานเสือภูเขา': { id: '12', sub: 'จักรยาน', priority: 10 },
        'จักรยานเสือหมอบ': { id: '12', sub: 'จักรยาน', priority: 10 },
        'bike': { id: '12', sub: 'จักรยาน', priority: 8 },
        'เสื่อโยคะ': { id: '12', sub: 'โยคะ / พิลาทิส', priority: 10 },
        'yoga mat': { id: '12', sub: 'โยคะ / พิลาทิส', priority: 9 },

        // ความงาม (Beauty)
        'ลิปสติก': { id: '15', sub: 'เครื่องสำอาง', priority: 10 },
        'lipstick': { id: '15', sub: 'เครื่องสำอาง', priority: 9 },
        'รองพื้น': { id: '15', sub: 'เครื่องสำอาง', priority: 10 },
        'foundation': { id: '15', sub: 'เครื่องสำอาง', priority: 9 },
        'แป้ง': { id: '15', sub: 'เครื่องสำอาง', priority: 8 },
        'คุชชั่น': { id: '15', sub: 'เครื่องสำอาง', priority: 9 },
        'cushion': { id: '15', sub: 'เครื่องสำอาง', priority: 8 },
        'ครีม': { id: '15', sub: 'ผลิตภัณฑ์ดูแลผิว', priority: 7 },
        'ครีมบำรุง': { id: '15', sub: 'ผลิตภัณฑ์ดูแลผิว', priority: 9 },
        'เซรั่ม': { id: '15', sub: 'ผลิตภัณฑ์ดูแลผิว', priority: 10 },
        'serum': { id: '15', sub: 'ผลิตภัณฑ์ดูแลผิว', priority: 9 },
        'โลชั่น': { id: '15', sub: 'ผลิตภัณฑ์ดูแลผิว', priority: 9 },
        'lotion': { id: '15', sub: 'ผลิตภัณฑ์ดูแลผิว', priority: 8 },
        'มาส์ก': { id: '15', sub: 'ผลิตภัณฑ์ดูแลผิว', priority: 9 },
        'mask': { id: '15', sub: 'ผลิตภัณฑ์ดูแลผิว', priority: 8 },
        'แชมพู': { id: '15', sub: 'ผลิตภัณฑ์ดูแลผม', priority: 10 },
        'shampoo': { id: '15', sub: 'ผลิตภัณฑ์ดูแลผม', priority: 9 },
        'ครีมนวด': { id: '15', sub: 'ผลิตภัณฑ์ดูแลผม', priority: 9 },
        'conditioner': { id: '15', sub: 'ผลิตภัณฑ์ดูแลผม', priority: 9 },
        'น้ำหอม': { id: '15', sub: 'น้ำหอม', priority: 10 },
        'perfume': { id: '15', sub: 'น้ำหอม', priority: 10 },
        'โคโลญ': { id: '15', sub: 'น้ำหอม', priority: 9 },

        // แม่และเด็ก (Mother & Baby)
        'นมผง': { id: '16', sub: 'นมผง / อาหารเด็ก', priority: 10 },
        'นมผงเด็ก': { id: '16', sub: 'นมผง / อาหารเด็ก', priority: 10 },
        'milk powder': { id: '16', sub: 'นมผง / อาหารเด็ก', priority: 9 },
        'ผ้าอ้อม': { id: '16', sub: 'ผ้าอ้อม / ของใช้เด็ก', priority: 10 },
        'diaper': { id: '16', sub: 'ผ้าอ้อม / ของใช้เด็ก', priority: 10 },
        'pampers': { id: '16', sub: 'ผ้าอ้อม / ของใช้เด็ก', priority: 10 },
        'รถเข็นเด็ก': { id: '16', sub: 'รถเข็นเด็ก / คาร์ซีท', priority: 10 },
        'stroller': { id: '16', sub: 'รถเข็นเด็ก / คาร์ซีท', priority: 10 },
        'คาร์ซีท': { id: '16', sub: 'รถเข็นเด็ก / คาร์ซีท', priority: 10 },
        'car seat': { id: '16', sub: 'รถเข็นเด็ก / คาร์ซีท', priority: 9 },
        'ของเล่นเด็ก': { id: '16', sub: 'ของเล่นเด็ก', priority: 9 },
        'baby toy': { id: '16', sub: 'ของเล่นเด็ก', priority: 9 }
    }

    // Sort by priority and check matches
    let bestMatch: { mainId: string, subName?: string } | null = null
    let highestPriority = 0

    for (const [keyword, mapping] of Object.entries(productMap)) {
        if (normalized.includes(keyword)) {
            const priority = mapping.priority || 5
            if (priority > highestPriority) {
                highestPriority = priority
                bestMatch = { mainId: mapping.id, subName: mapping.sub }
            }
        }
    }

    if (bestMatch) return bestMatch
    return { mainId: null }
}

// Helper: Map AI category name to ID (fallback)
function findCategoryByName(categoryName: string): string | null {
    const normalized = categoryName.toLowerCase().trim()

    // Direct matches (check both TH and EN names)
    const directMatch = CATEGORIES.find(c =>
        c.name_th?.toLowerCase() === normalized ||
        c.name_en?.toLowerCase() === normalized ||
        c.name_th?.toLowerCase().includes(normalized) ||
        c.name_en?.toLowerCase().includes(normalized) ||
        normalized.includes(c.name_th?.toLowerCase() || '') ||
        normalized.includes(c.name_en?.toLowerCase() || '')
    )
    if (directMatch) return String(directMatch.id)

    // Keyword matching for common AI responses
    const keywordMap: Record<string, string> = {
        'รถ': '1', 'ยาน': '1',
        'บ้าน': '2', 'คอนโด': '2', 'ที่ดิน': '2',
        'คอม': '4', 'computer': '4',
        'ไฟฟ้า': '5',
        'แฟชั่น': '6', 'fashion': '6', 'เสื้อ': '6',
        'เกม': '7', 'game': '7',
        'กล้อง': '8', 'camera': '8',
        'พระ': '9',
        'สัตว์': '10', 'pet': '10',
        'บริการ': '11', 'service': '11',
        'กีฬา': '12', 'sport': '12',
        'สวน': '13',
        'เบ็ด': '14',
        'ความงาม': '15', 'beauty': '15', 'cosmetic': '15',
        'แม่': '16', 'เด็ก': '16', 'baby': '16', 'mother': '16'
    }

    for (const [keyword, id] of Object.entries(keywordMap)) {
        if (normalized.includes(keyword)) return id
    }

    return null
}


export default function DropdownCategorySelector({ selectedMain, selectedSub, onSelect, aiSuggestion }: Props) {
    const { language } = useLanguage()

    // State now uses subcategory ID (e.g., '401', '408') instead of name
    const [mainId, setMainId] = useState<string>(selectedMain || '4')
    const [subId, setSubId] = useState<string>(selectedSub || '')  // ✅ Changed from subName to subId

    const currentCategory = CATEGORIES.find(c => c.id === Number(mainId)) || CATEGORIES[3]  // Default to Computers

    // Auto-fill from AI when component mounts or AI suggestion changes
    useEffect(() => {
        // Priority 1: Use AI suggested subcategory ID if provided
        if (aiSuggestion?.subId) {
            const validSubcategory = currentCategory.subcategories?.find(
                s => String(s.id) === aiSuggestion.subId
            )

            if (validSubcategory) {
                setSubId(aiSuggestion.subId)
                onSelect(mainId, currentCategory.name_th, aiSuggestion.subId, validSubcategory.name_th)
                return
            }
        }

        // Priority 2: Use selected values if provided
        if (selectedMain && selectedMain !== mainId) {
            setMainId(selectedMain)
        }

        if (selectedSub && selectedSub !== subId) {
            // Validate that subcategory exists in current category
            const validSubcategory = currentCategory.subcategories?.find(
                s => String(s.id) === selectedSub
            )

            if (validSubcategory) {
                setSubId(selectedSub)
            } else {
                // Invalid subcategory for this category - clear it
                setSubId('')
            }
        }
    }, [aiSuggestion?.subId, selectedMain, selectedSub])

    // Update subcategory when main category changes
    useEffect(() => {
        // Reset sub if it doesn't exist in new main category
        if (subId) {
            const subExists = currentCategory.subcategories?.some(
                s => String(s.id) === subId
            )
            if (!subExists) {
                setSubId('')
                onSelect(mainId, currentCategory.name_th, undefined, undefined)
            }
        }
    }, [mainId])

    const handleMainChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newMainId = e.target.value
        setMainId(newMainId)
        setSubId('')  // Clear subcategory when changing main category

        const cat = CATEGORIES.find(c => c.id === Number(newMainId))
        if (cat) {
            onSelect(newMainId, cat.name_th, undefined, undefined)
        }
    }

    const handleSubChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newSubId = e.target.value
        setSubId(newSubId)

        const subcategory = currentCategory.subcategories?.find(
            s => String(s.id) === newSubId
        )

        if (subcategory) {
            onSelect(mainId, currentCategory.name_th, newSubId, subcategory.name_th)
        } else {
            onSelect(mainId, currentCategory.name_th, undefined, undefined)
        }
    }

    return (
        <div className="space-y-3">
            {/* หมวดหมู่ใหญ่ */}
            <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">
                    หมวดหมู่
                </label>
                <div className="relative">
                    <select
                        value={mainId}
                        onChange={handleMainChange}
                        className="w-full px-3 py-2.5 pr-10 rounded-lg bg-gray-900 border border-gray-700
                         focus:border-purple-500 text-white text-sm
                         transition-all outline-none appearance-none cursor-pointer"
                    >
                        {CATEGORIES.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                                {cat.icon} {language === 'th' ? cat.name_th : cat.name_en}
                            </option>
                        ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
            </div>

            {/* หมวดย่อย */}
            <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">
                    หมวดย่อย
                </label>
                <div className="relative">
                    <select
                        value={subId}  // ✅ Use subId instead of subName
                        onChange={handleSubChange}
                        className="w-full px-3 py-2.5 pr-10 rounded-lg bg-gray-900 border border-gray-700
                         focus:border-purple-500 text-white text-sm
                         transition-all outline-none appearance-none cursor-pointer"
                    >
                        <option value="">
                            {language === 'th' ? '-- เลือกหมวดย่อย --' : '-- Select Subcategory --'}
                        </option>
                        {currentCategory.subcategories?.map((sub) => (
                            <option key={sub.id} value={sub.id}>  {/* ✅ Use sub.id as value */}
                                {language === 'th' ? sub.name_th : sub.name_en}
                            </option>
                        ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
            </div>
        </div>
    )
}
