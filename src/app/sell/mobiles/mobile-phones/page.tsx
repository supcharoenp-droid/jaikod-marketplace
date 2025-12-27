'use client'

import React, { useState, useCallback, useMemo, useRef, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import dynamic from 'next/dynamic'
import { useAuth } from '@/contexts/AuthContext'
import { createListing, SellerInfo, CreateListingInput } from '@/lib/listings'
import { getOpenAIVisionService } from '@/lib/openai-vision-service'

// Dynamic import for HybridPhotoUploader
const HybridPhotoUploader = dynamic(() => import('@/components/ui/HybridPhotoUploader'), {
    ssr: false,
    loading: () => (
        <div className="h-48 bg-slate-800 rounded-xl animate-pulse flex items-center justify-center text-gray-500 text-sm">
            กำลังโหลด Photo Uploader...
        </div>
    )
})

// Dynamic import for ThaiLocationPicker (to avoid SSR issues with Leaflet)
const ThaiLocationPicker = dynamic(() => import('@/components/ui/ThaiLocationPicker'), {
    ssr: false,
    loading: () => (
        <div className="h-32 bg-slate-800 rounded-xl animate-pulse flex items-center justify-center text-gray-500 text-sm">
            กำลังโหลดแผนที่...
        </div>
    )
})

// ============================================
// 📱 MOBILE PHONE TEMPLATE DATA
// Based on Buyer/Seller Psychology Analysis
// ============================================
const MOBILE_TEMPLATE = {
    sections: [
        {
            id: 'device_info',
            emoji: '📱',
            title_th: 'ข้อมูลเครื่อง',
            title_en: 'Device Information',
            fields: [
                {
                    key: 'brand', label_th: 'แบรนด์', label_en: 'Brand', importance: 'required', type: 'select',
                    options: [
                        { value: 'apple', label_th: '🍎 Apple (iPhone)', label_en: '🍎 Apple (iPhone)' },
                        { value: 'samsung', label_th: '📱 Samsung', label_en: '📱 Samsung' },
                        { value: 'xiaomi', label_th: '🔶 Xiaomi (Redmi/POCO)', label_en: '🔶 Xiaomi (Redmi/POCO)' },
                        { value: 'oppo', label_th: '💚 OPPO', label_en: '💚 OPPO' },
                        { value: 'vivo', label_th: '💙 Vivo', label_en: '💙 Vivo' },
                        { value: 'realme', label_th: '🟡 Realme', label_en: '🟡 Realme' },
                        { value: 'huawei', label_th: '🔴 Huawei', label_en: '🔴 Huawei' },
                        { value: 'google', label_th: '🔵 Google Pixel', label_en: '🔵 Google Pixel' },
                        { value: 'oneplus', label_th: '⚫ OnePlus', label_en: '⚫ OnePlus' },
                        { value: 'asus', label_th: '🎮 ASUS ROG Phone', label_en: '🎮 ASUS ROG Phone' },
                        { value: 'nothing', label_th: '⚪ Nothing', label_en: '⚪ Nothing' },
                        { value: 'sony', label_th: '📷 Sony Xperia', label_en: '📷 Sony Xperia' },
                        { value: 'other', label_th: '📱 อื่นๆ', label_en: '📱 Other' },
                    ],
                    aiTip_th: '🎯 Apple, Samsung ขายได้เร็วที่สุด',
                    aiTip_en: '🎯 Apple, Samsung sell fastest',
                },
                {
                    key: 'model', label_th: 'รุ่น', label_en: 'Model', importance: 'required', type: 'text',
                    placeholder_th: 'เช่น iPhone 15 Pro Max, Galaxy S24 Ultra',
                    aiTip_th: '💡 ระบุรุ่นให้ชัดเจน เช่น "iPhone 15 Pro" ไม่ใช่แค่ "iPhone"',
                    aiTip_en: '💡 Be specific, e.g. "iPhone 15 Pro" not just "iPhone"',
                },
                {
                    key: 'storage', label_th: 'ความจุ', label_en: 'Storage', importance: 'required', type: 'select',
                    options: [
                        { value: '16gb', label_th: '16 GB', label_en: '16 GB' },
                        { value: '32gb', label_th: '32 GB', label_en: '32 GB' },
                        { value: '64gb', label_th: '64 GB', label_en: '64 GB' },
                        { value: '128gb', label_th: '128 GB', label_en: '128 GB' },
                        { value: '256gb', label_th: '256 GB', label_en: '256 GB' },
                        { value: '512gb', label_th: '512 GB', label_en: '512 GB' },
                        { value: '1tb', label_th: '1 TB', label_en: '1 TB' },
                    ],
                    aiTip_th: '📊 ความจุสูง = ราคาสูงกว่า 10-20%',
                    aiTip_en: '📊 Higher storage = 10-20% higher price',
                },
                {
                    key: 'color', label_th: 'สี', label_en: 'Color', importance: 'recommended', type: 'select',
                    options: [
                        { value: 'black', label_th: '⬛ ดำ / Space Black', label_en: '⬛ Black / Space Black' },
                        { value: 'white', label_th: '⬜ ขาว / Silver', label_en: '⬜ White / Silver' },
                        { value: 'gold', label_th: '🟨 ทอง / Gold', label_en: '🟨 Gold' },
                        { value: 'blue', label_th: '🔵 น้ำเงิน / Blue', label_en: '🔵 Blue' },
                        { value: 'purple', label_th: '🟣 ม่วง / Purple', label_en: '🟣 Purple' },
                        { value: 'pink', label_th: '🩷 ชมพู / Pink', label_en: '🩷 Pink' },
                        { value: 'green', label_th: '🟢 เขียว / Green', label_en: '🟢 Green' },
                        { value: 'titanium', label_th: '🪨 Titanium', label_en: '🪨 Titanium' },
                        { value: 'other', label_th: '🎨 อื่นๆ', label_en: '🎨 Other' },
                    ],
                    aiTip_th: '🎨 สียอดนิยม: ดำ, ขาว ขายง่ายกว่า',
                    aiTip_en: '🎨 Popular: Black, White sell faster',
                },
                {
                    key: 'ram', label_th: 'RAM', label_en: 'RAM', importance: 'optional', type: 'select',
                    options: [
                        { value: '3gb', label_th: '3 GB', label_en: '3 GB' },
                        { value: '4gb', label_th: '4 GB', label_en: '4 GB' },
                        { value: '6gb', label_th: '6 GB', label_en: '6 GB' },
                        { value: '8gb', label_th: '8 GB', label_en: '8 GB' },
                        { value: '12gb', label_th: '12 GB', label_en: '12 GB' },
                        { value: '16gb', label_th: '16 GB', label_en: '16 GB' },
                    ],
                    aiTip_th: 'iPhone ไม่ต้องระบุ / Android ระบุจะช่วยขาย',
                    aiTip_en: 'Skip for iPhone / Android buyers look for this',
                },
            ]
        },
        {
            id: 'condition',
            emoji: '🔍',
            title_th: 'สภาพเครื่อง',
            title_en: 'Device Condition',
            fields: [
                {
                    key: 'battery_health', label_th: 'สุขภาพแบตเตอรี่', label_en: 'Battery Health', importance: 'required', type: 'select',
                    options: [
                        { value: '100', label_th: '🔋 100% (ใหม่/เปลี่ยนใหม่)', label_en: '🔋 100% (New/Replaced)' },
                        { value: '95-99', label_th: '🔋 95-99% (ดีมาก)', label_en: '🔋 95-99% (Excellent)' },
                        { value: '90-94', label_th: '🔋 90-94% (ดี)', label_en: '🔋 90-94% (Good)' },
                        { value: '85-89', label_th: '🔋 85-89% (ปกติ)', label_en: '🔋 85-89% (Normal)' },
                        { value: '80-84', label_th: '⚠️ 80-84% (ควรเปลี่ยน)', label_en: '⚠️ 80-84% (Should Replace)' },
                        { value: 'below_80', label_th: '🔴 ต่ำกว่า 80%', label_en: '🔴 Below 80%' },
                        { value: 'replaced', label_th: '🆕 เปลี่ยนแบตใหม่แล้ว', label_en: '🆕 Battery Replaced' },
                        { value: 'unknown', label_th: '❓ ไม่ทราบ (Android)', label_en: '❓ Unknown (Android)' },
                    ],
                    aiTip_th: '🔋 แบต 90%+ ขายได้ราคาดี | 85%+ ยังใช้ได้ปกติ',
                    aiTip_en: '🔋 90%+ sells well | 85%+ still usable',
                },
                {
                    key: 'screen_condition', label_th: 'สภาพหน้าจอ', label_en: 'Screen Condition', importance: 'required', type: 'select',
                    options: [
                        { value: 'perfect', label_th: '✨ สมบูรณ์แบบ ไม่มีรอยเลย', label_en: '✨ Perfect, No Scratches' },
                        { value: 'excellent', label_th: '👍 ดีมาก รอยเล็กน้อยมองไม่เห็น', label_en: '👍 Excellent, Invisible Minor Marks' },
                        { value: 'good', label_th: '👌 ดี มีรอยบ้างไม่กระทบใช้งาน', label_en: '👌 Good, Minor Scratches' },
                        { value: 'fair', label_th: '⚠️ พอใช้ มีรอยชัดเจน', label_en: '⚠️ Fair, Visible Scratches' },
                        { value: 'cracked', label_th: '💔 จอแตก/ร้าว', label_en: '💔 Cracked/Damaged' },
                    ],
                    aiTip_th: '📱 หน้าจอสมบูรณ์ = ราคาดีกว่า 15-20%',
                    aiTip_en: '📱 Perfect screen = 15-20% higher price',
                },
                {
                    key: 'body_condition', label_th: 'สภาพตัวเครื่อง (ฝาหลัง/ขอบ)', label_en: 'Body Condition', importance: 'required', type: 'select',
                    options: [
                        { value: 'new', label_th: '🆕 ใหม่ ยังไม่แกะซีล', label_en: '🆕 New, Sealed' },
                        { value: 'like_new', label_th: '✨ ใหม่มาก ไม่มีรอย', label_en: '✨ Like New, No Marks' },
                        { value: 'excellent', label_th: '👍 ดีเยี่ยม รอยเล็กน้อย', label_en: '👍 Excellent, Minor Marks' },
                        { value: 'good', label_th: '👌 ดี มีรอยใช้งานบ้าง', label_en: '👌 Good, Normal Wear' },
                        { value: 'fair', label_th: '⚠️ พอใช้ มีรอยชัดเจน', label_en: '⚠️ Fair, Visible Wear' },
                        { value: 'dented', label_th: '💔 มีรอยบุบ/งอ', label_en: '💔 Dented/Bent' },
                    ],
                },
            ]
        },
        {
            id: 'status',
            emoji: '📶',
            title_th: 'สถานะเครื่อง',
            title_en: 'Device Status',
            fields: [
                {
                    key: 'network_status', label_th: 'สถานะเครือข่าย', label_en: 'Network Status', importance: 'required', type: 'select',
                    options: [
                        { value: 'unlocked', label_th: '✅ ปลดล็อคแล้ว ใช้ได้ทุกค่าย', label_en: '✅ Unlocked, All Carriers' },
                        { value: 'ais', label_th: '🔒 ติดล็อค AIS', label_en: '🔒 Locked to AIS' },
                        { value: 'true', label_th: '🔒 ติดล็อค True', label_en: '🔒 Locked to True' },
                        { value: 'dtac', label_th: '🔒 ติดล็อค Dtac', label_en: '🔒 Locked to Dtac' },
                        { value: 'installment', label_th: '⏳ ติดสัญญา/ผ่อนอยู่', label_en: '⏳ Under Contract' },
                    ],
                    aiTip_th: '⚠️ เครื่องปลดล็อคขายได้ราคาดีกว่า',
                    aiTip_en: '⚠️ Unlocked devices sell for higher prices',
                },
                {
                    key: 'icloud_status', label_th: 'สถานะ iCloud/Google Account', label_en: 'iCloud/Google Status', importance: 'required', type: 'select',
                    options: [
                        { value: 'logged_out', label_th: '✅ ออกจากระบบแล้ว (พร้อมขาย)', label_en: '✅ Logged Out (Ready)' },
                        { value: 'will_logout', label_th: '📅 จะออกให้ตอนส่งมอบ', label_en: '📅 Will Logout on Delivery' },
                    ],
                    aiTip_th: '🔐 สำคัญมาก! ต้องออกจาก iCloud/Google ก่อนขาย',
                    aiTip_en: '🔐 Critical! Must logout before selling',
                },
            ]
        },
        {
            id: 'pricing',
            emoji: '💰',
            title_th: 'ราคา',
            title_en: 'Pricing',
            fields: [
                {
                    key: 'price', label_th: 'ราคาขาย (บาท)', label_en: 'Price (THB)', importance: 'required', type: 'text',
                    placeholder_th: 'เช่น 25000',
                    aiTip_th: '💰 ราคาที่เหมาะสมจะช่วยให้ขายได้เร็ว',
                    aiTip_en: '💰 Fair pricing helps sell faster',
                },
                {
                    key: 'negotiable', label_th: 'ต่อรองได้?', label_en: 'Negotiable?', importance: 'recommended', type: 'select',
                    options: [
                        { value: 'yes', label_th: '✅ ต่อรองได้', label_en: '✅ Yes' },
                        { value: 'little', label_th: '↔️ ต่อได้นิดหน่อย', label_en: '↔️ A little' },
                        { value: 'no', label_th: '❌ ราคาตายตัว', label_en: '❌ Fixed' },
                    ]
                },
            ]
        },
        {
            id: 'trust',
            emoji: '🛡️',
            title_th: 'ความน่าเชื่อถือ',
            title_en: 'Trust Builders',
            fields: [
                {
                    key: 'warranty', label_th: 'ประกัน', label_en: 'Warranty', importance: 'recommended', type: 'select',
                    options: [
                        { value: 'none', label_th: '❌ ไม่มีประกัน', label_en: '❌ No Warranty' },
                        { value: 'applecare', label_th: '🍎 AppleCare+', label_en: '🍎 AppleCare+' },
                        { value: 'brand_3m', label_th: '🛡️ ประกันศูนย์ 3 เดือน', label_en: '🛡️ Brand 3 months' },
                        { value: 'brand_6m', label_th: '🛡️ ประกันศูนย์ 6 เดือน', label_en: '🛡️ Brand 6 months' },
                        { value: 'brand_1y', label_th: '🛡️ ประกันศูนย์ 1 ปี', label_en: '🛡️ Brand 1 year' },
                        { value: 'store', label_th: '🏪 ประกันร้าน', label_en: '🏪 Store Warranty' },
                        { value: 'expired', label_th: '⏰ หมดประกันแล้ว', label_en: '⏰ Expired' },
                    ],
                    aiTip_th: '🛡️ มีประกัน = เพิ่มความมั่นใจ ขายได้เร็ว',
                    aiTip_en: '🛡️ Warranty = More confidence, sells faster',
                },
                {
                    key: 'has_receipt', label_th: 'มีใบเสร็จ/ใบรับประกัน', label_en: 'Has Receipt', importance: 'optional', type: 'select',
                    options: [
                        { value: 'yes', label_th: '✅ มี (แสดงได้)', label_en: '✅ Yes' },
                        { value: 'no', label_th: '❌ ไม่มี', label_en: '❌ No' },
                    ],
                },
                {
                    key: 'accessories', label_th: 'อุปกรณ์ที่มี', label_en: 'Included Accessories', importance: 'recommended', type: 'multiselect',
                    options: [
                        { value: 'box', label_th: '📦 กล่อง', label_en: '📦 Box' },
                        { value: 'charger', label_th: '🔌 สายชาร์จ', label_en: '🔌 Cable' },
                        { value: 'adapter', label_th: '🔋 หัวชาร์จ', label_en: '🔋 Adapter' },
                        { value: 'earphones', label_th: '🎧 หูฟัง', label_en: '🎧 Earphones' },
                        { value: 'case', label_th: '📱 เคส', label_en: '📱 Case' },
                        { value: 'screen_protector', label_th: '🖼️ ฟิล์ม', label_en: '🖼️ Film' },
                    ],
                    aiTip_th: '🎁 ครบกล่อง = ราคาดีกว่า 5-10%',
                    aiTip_en: '🎁 Complete box = 5-10% higher price',
                },
            ]
        },
        {
            id: 'issues',
            emoji: '⚠️',
            title_th: 'ปัญหาที่ทราบ (ถ้ามี)',
            title_en: 'Known Issues',
            fields: [
                {
                    key: 'known_issues', label_th: 'ปัญหาที่พบ', label_en: 'Known Issues', importance: 'optional', type: 'multiselect',
                    options: [
                        { value: 'none', label_th: '✅ ไม่มีปัญหา', label_en: '✅ No Issues' },
                        { value: 'battery_drain', label_th: '🔋 แบตหมดไว', label_en: '🔋 Battery Drains Fast' },
                        { value: 'speaker', label_th: '🔊 ลำโพงมีปัญหา', label_en: '🔊 Speaker Issues' },
                        { value: 'camera', label_th: '📷 กล้องมีปัญหา', label_en: '📷 Camera Issues' },
                        { value: 'faceid', label_th: '👤 Face ID ไม่ทำงาน', label_en: '👤 Face ID Not Working' },
                        { value: 'wifi', label_th: '📶 WiFi/BT มีปัญหา', label_en: '📶 WiFi/BT Issues' },
                        { value: 'charging', label_th: '⚡ ชาร์จมีปัญหา', label_en: '⚡ Charging Issues' },
                        { value: 'screen_burn', label_th: '🔥 จอ Burn-in', label_en: '🔥 Screen Burn-in' },
                    ],
                    aiTip_th: '💡 แจ้งปัญหาตรงๆ = ไม่ต้องถกเถียงภายหลัง',
                    aiTip_en: '💡 Disclosing issues = Avoid disputes later',
                },
            ]
        },
        {
            id: 'context',
            emoji: '📋',
            title_th: 'ข้อมูลเพิ่มเติม',
            title_en: 'Additional Info',
            fields: [
                {
                    key: 'original_purchase', label_th: 'ซื้อจากที่ไหน', label_en: 'Original Purchase', importance: 'optional', type: 'select',
                    options: [
                        { value: 'official', label_th: '🏪 Apple Store / Samsung Store', label_en: '🏪 Official Store' },
                        { value: 'authorized', label_th: '🏬 ตัวแทน (iStudio, AIS, True)', label_en: '🏬 Authorized Reseller' },
                        { value: 'online', label_th: '🛒 ออนไลน์ (Shopee, Lazada)', label_en: '🛒 Online Store' },
                        { value: 'secondhand', label_th: '🔄 มือสอง', label_en: '🔄 Secondhand' },
                        { value: 'gift', label_th: '🎁 ได้รับเป็นของขวัญ', label_en: '🎁 Gift' },
                    ],
                },
                {
                    key: 'selling_reason', label_th: 'สาเหตุที่ขาย', label_en: 'Selling Reason', importance: 'optional', type: 'select',
                    options: [
                        { value: 'upgrade', label_th: '⬆️ เปลี่ยนรุ่นใหม่', label_en: '⬆️ Upgrading' },
                        { value: 'switch', label_th: '🔄 เปลี่ยนแบรนด์', label_en: '🔄 Switching Brands' },
                        { value: 'extra', label_th: '📱 เครื่องสำรอง ไม่ได้ใช้', label_en: '📱 Extra, Not Using' },
                        { value: 'need_money', label_th: '💵 ต้องการเงินสด', label_en: '💵 Need Cash' },
                    ],
                    aiTip_th: '📝 ระบุเหตุผล สร้างความน่าเชื่อถือ',
                    aiTip_en: '📝 Stating reason builds trust',
                },
                {
                    key: 'additional_description', label_th: 'รายละเอียดเพิ่มเติม', label_en: 'Additional Details',
                    importance: 'optional', type: 'textarea',
                    placeholder_th: 'ใส่ข้อมูลเพิ่มเติม เช่น ประวัติการใช้งาน, อุปกรณ์เสริมอื่นๆ...'
                },
            ]
        },
        {
            id: 'meeting_location',
            emoji: '📍',
            title_th: 'สถานที่นัดดูสินค้า',
            title_en: 'Meeting Location',
            fields: [
                {
                    key: 'meeting_location_picker', label_th: '📍 เลือกสถานที่นัดดู', label_en: '📍 Select Meeting Location',
                    importance: 'recommended', type: 'location_picker'
                },
                {
                    key: 'meeting_landmark', label_th: 'จุดนัดพบ', label_en: 'Meeting Point', importance: 'recommended', type: 'text',
                    placeholder_th: 'เช่น ห้างเซ็นทรัล, ปั๊ม PTT, สถานี BTS...'
                },
                {
                    key: 'meeting_preference', label_th: 'เวลาที่สะดวก', label_en: 'Available Time', importance: 'optional', type: 'multiselect',
                    options: [
                        { value: 'weekday', label_th: '📅 วันธรรมดา', label_en: '📅 Weekday' },
                        { value: 'weekend', label_th: '🌟 เสาร์-อาทิตย์', label_en: '🌟 Weekend' },
                        { value: 'anytime', label_th: '⏰ ทุกวัน', label_en: '⏰ Anytime' },
                    ]
                },
                {
                    key: 'delivery_option', label_th: 'บริการส่ง', label_en: 'Delivery', importance: 'optional', type: 'select',
                    options: [
                        { value: 'pickup_only', label_th: '🏠 นัดรับเท่านั้น', label_en: '🏠 Pickup Only' },
                        { value: 'delivery_bkk', label_th: '🚗 ส่งในกรุงเทพ', label_en: '🚗 BKK Delivery' },
                        { value: 'delivery_nationwide', label_th: '🚚 ส่งทั่วประเทศ', label_en: '🚚 Nationwide' },
                    ],
                    aiTip_th: '🚚 ส่งได้ทั่วประเทศ = ขายได้กว้างกว่า',
                    aiTip_en: '🚚 Nationwide shipping = More buyers',
                },
                {
                    key: 'shipping_cost', label_th: 'ค่าส่ง', label_en: 'Shipping Cost', importance: 'optional', type: 'select',
                    options: [
                        { value: 'free', label_th: '🎁 ส่งฟรี', label_en: '🎁 Free Shipping' },
                        { value: 'buyer_pays', label_th: '💵 ผู้ซื้อออก', label_en: '💵 Buyer Pays' },
                        { value: 'split', label_th: '🤝 คนละครึ่ง', label_en: '🤝 Split' },
                    ],
                },
                {
                    key: 'cod_available', label_th: 'เก็บเงินปลายทาง (COD)', label_en: 'COD Available', importance: 'optional', type: 'select',
                    options: [
                        { value: 'yes', label_th: '✅ รับ COD', label_en: '✅ COD Available' },
                        { value: 'no', label_th: '❌ ไม่รับ COD', label_en: '❌ No COD' },
                    ],
                },
            ]
        },
        {
            id: 'payment',
            emoji: '💳',
            title_th: 'การชำระเงิน',
            title_en: 'Payment',
            fields: [
                {
                    key: 'payment_methods', label_th: 'ช่องทางชำระเงิน', label_en: 'Payment Methods', importance: 'optional', type: 'multiselect',
                    options: [
                        { value: 'cash', label_th: '💵 เงินสด', label_en: '💵 Cash' },
                        { value: 'transfer', label_th: '🏦 โอนเงิน', label_en: '🏦 Bank Transfer' },
                        { value: 'promptpay', label_th: '📱 PromptPay', label_en: '📱 PromptPay' },
                        { value: 'credit_card', label_th: '💳 บัตรเครดิต', label_en: '💳 Credit Card' },
                        { value: 'installment', label_th: '📆 ผ่อนได้', label_en: '📆 Installment' },
                    ],
                },
                {
                    key: 'device_age', label_th: 'อายุการใช้งาน', label_en: 'Device Age', importance: 'optional', type: 'select',
                    options: [
                        { value: 'new', label_th: '✨ ใหม่มาก (ไม่ถึงเดือน)', label_en: '✨ Like New (< 1 month)' },
                        { value: '1-3m', label_th: '📅 1-3 เดือน', label_en: '📅 1-3 months' },
                        { value: '3-6m', label_th: '📅 3-6 เดือน', label_en: '📅 3-6 months' },
                        { value: '6-12m', label_th: '📅 6 เดือน - 1 ปี', label_en: '📅 6-12 months' },
                        { value: '1-2y', label_th: '📅 1-2 ปี', label_en: '📅 1-2 years' },
                        { value: '2y+', label_th: '📅 มากกว่า 2 ปี', label_en: '📅 2+ years' },
                    ],
                    aiTip_th: '📅 บอกอายุเครื่อง ช่วยให้ผู้ซื้อตัดสินใจง่ายขึ้น',
                    aiTip_en: '📅 Device age helps buyers decide',
                },
            ]
        },
        {
            id: 'contact',
            emoji: '📞',
            title_th: 'ช่องทางติดต่อ',
            title_en: 'Contact Info',
            fields: [
                { key: 'contact_phone', label_th: '📞 เบอร์โทรศัพท์', label_en: '📞 Phone', importance: 'recommended', type: 'text', placeholder_th: 'เช่น 081-234-5678' },
                { key: 'contact_line', label_th: '💚 LINE ID', label_en: '💚 LINE ID', importance: 'optional', type: 'text', placeholder_th: 'เช่น @mylineid' },
            ]
        },
    ]
}

// ============================================
// HELPER FUNCTIONS
// ============================================
const formatPrice = (price: string) => {
    const num = parseInt(price.replace(/,/g, ''))
    if (isNaN(num)) return ''
    return num.toLocaleString('th-TH')
}

// Bilingual UI Labels
const UI_LABELS = {
    th: {
        pageTitle: 'ลงขายมือถือ',
        pageSubtitle: 'กรอกข้อมูลและดูตัวอย่างทันที',
        completion: 'ความสมบูรณ์',
        formTab: '✏️ กรอก',
        previewTab: '👁️ ตัวอย่าง',
        formHeader: '📝 กรอกข้อมูล',
        previewHeader: '👁️ ตัวอย่างประกาศ',
        imageUpload: '📸 รูปภาพมือถือ (สูงสุด 10 รูป)',
        addImage: 'เพิ่มรูป',
        delete: 'ลบ',
        selectPlaceholder: '-- เลือก --',
        noImage: 'ยังไม่มีรูปภาพ',
        moreImages: 'รูป',
        postListing: '🚀 ลงประกาศเลย',
        fillMore: 'กรอกให้ครบ',
        remaining: 'อีก',
        emptyTitle: 'ยังไม่ได้กรอกข้อมูล...',
        battery: '🔋 แบต',
        screen: '📱 จอ',
        body: '📦 ตัวเครื่อง',
        network: '📶 เครือข่าย',
        storage: '💾 ความจุ',
        color: '🎨 สี',
        icloud: '🔐 iCloud',
        warranty: '🛡️ ประกัน',
        accessories: '📦 อุปกรณ์',
        delivery: '🚚 ส่ง',
        meetingLocation: '📍 นัดดูที่',
        meetingTime: '⏰ เวลา',
        includedItems: '📦 อุปกรณ์ที่มี',
        sellingReason: '💬 เหตุผลที่ขาย',
        missingFields: 'ยังขาด:',
        readyToPublish: 'พร้อมลงประกาศ!',
        saveDraft: '💾 บันทึกแบบร่าง',
    },
    en: {
        pageTitle: 'Sell Mobile Phone',
        pageSubtitle: 'Fill in details and preview instantly',
        completion: 'Completion',
        formTab: '✏️ Form',
        previewTab: '👁️ Preview',
        formHeader: '📝 Fill Details',
        previewHeader: '👁️ Listing Preview',
        imageUpload: '📸 Phone Photos (max 10)',
        addImage: 'Add',
        delete: 'Delete',
        selectPlaceholder: '-- Select --',
        noImage: 'No images yet',
        moreImages: 'more',
        postListing: '🚀 Post Listing',
        fillMore: 'Complete',
        remaining: 'more',
        emptyTitle: 'No data entered yet...',
        battery: '🔋 Battery',
        screen: '📱 Screen',
        body: '📦 Body',
        network: '📶 Network',
        storage: '💾 Storage',
        color: '🎨 Color',
        icloud: '🔐 iCloud',
        warranty: '🛡️ Warranty',
        accessories: '📦 Extras',
        delivery: '🚚 Delivery',
        meetingLocation: '📍 Meet at',
        meetingTime: '⏰ Time',
        includedItems: '📦 Included',
        sellingReason: '💬 Reason',
        missingFields: 'Missing:',
        readyToPublish: 'Ready to publish!',
        saveDraft: '💾 Save Draft',
    }
}

type Language = 'th' | 'en'

const getOptionLabel = (options: { value: string, label_th: string, label_en: string }[] | undefined, value: string, lang: Language): string => {
    if (!options || !value) return ''
    const option = options.find(o => o.value === value)
    return lang === 'th' ? (option?.label_th || value) : (option?.label_en || value)
}

// ============================================
// MAIN COMPONENT
// ============================================
function MobilePhoneListingPage() {
    const [activeTab, setActiveTab] = useState<'form' | 'preview'>('form')
    // Smart defaults for common fields
    const [formData, setFormData] = useState<Record<string, string | string[]>>({
        network_status: 'unlocked',      // Most phones are unlocked
        icloud_status: 'logged_out',     // Required before selling
        negotiable: 'yes',               // Most sellers allow negotiation
    })
    const [uploadedImages, setUploadedImages] = useState<File[]>([])
    const [imagePreviews, setImagePreviews] = useState<string[]>([])
    const [language, setLanguage] = useState<Language>('th')

    // AI Analysis State
    const [isAnalyzing, setIsAnalyzing] = useState(false)
    const hasAnalyzedRef = useRef(false)
    const [aiResult, setAiResult] = useState<{
        brand?: string
        model?: string
        storage?: string
        color?: string
        estimatedPrice?: { min: number; max: number; suggested: number }
        confidence?: number
    } | null>(null)

    // Publishing State
    const router = useRouter()
    const { user } = useAuth()
    const [isPublishing, setIsPublishing] = useState(false)
    const [publishSuccess, setPublishSuccess] = useState<{ listing_code: string; listing_number: string; slug: string } | null>(null)
    const [showPreviewModal, setShowPreviewModal] = useState(false)

    // Collapsible Sections State - Show required sections by default
    const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['device_info', 'condition', 'status', 'pricing']))

    const toggleSection = useCallback((sectionId: string) => {
        setExpandedSections(prev => {
            const next = new Set(prev)
            if (next.has(sectionId)) {
                next.delete(sectionId)
            } else {
                next.add(sectionId)
            }
            return next
        })
    }, [])

    const t = UI_LABELS[language]

    // Handle form field changes
    const handleFieldChange = useCallback((key: string, value: string | string[]) => {
        setFormData(prev => ({ ...prev, [key]: value }))
    }, [])

    // Handle multiselect toggle
    const handleMultiselectToggle = useCallback((key: string, optionValue: string) => {
        setFormData(prev => {
            const current = (prev[key] as string[]) || []
            const updated = current.includes(optionValue)
                ? current.filter(v => v !== optionValue)
                : [...current, optionValue]
            return { ...prev, [key]: updated }
        })
    }, [])

    // Calculate completion percentage and missing fields
    const { completionPercentage, missingFields, filledCount, totalRequired } = useMemo(() => {
        const requiredFields = MOBILE_TEMPLATE.sections.flatMap(s =>
            s.fields.filter(f => f.importance === 'required')
        )
        const missing: { key: string; label: string }[] = []
        let filled = 0

        requiredFields.forEach(f => {
            const val = formData[f.key]
            const isFilled = val && (Array.isArray(val) ? val.length > 0 : (val as string).trim() !== '')
            if (isFilled) {
                filled++
            } else {
                missing.push({
                    key: f.key,
                    label: language === 'th' ? f.label_th : f.label_en
                })
            }
        })

        return {
            completionPercentage: Math.round((filled / requiredFields.length) * 100),
            missingFields: missing,
            filledCount: filled,
            totalRequired: requiredFields.length
        }
    }, [formData, language])

    // Generate title from form data
    const generateTitle = useMemo(() => {
        const { brand, model, storage, color } = formData
        if (!brand || !model) return t.emptyTitle

        const brandLabel = MOBILE_TEMPLATE.sections[0].fields[0].options?.find(o => o.value === brand)
        const brandName = brandLabel ? (language === 'th' ? brandLabel.label_th : brandLabel.label_en).replace(/[🍎📱🔶💚💙🟡🔴🔵⚫🎮⚪📷]/g, '').trim() : brand

        const parts = [brandName, model as string]

        if (storage) {
            const storageLabel = MOBILE_TEMPLATE.sections[0].fields[2].options?.find(o => o.value === storage)
            if (storageLabel) parts.push(language === 'th' ? storageLabel.label_th : storageLabel.label_en)
        }

        if (color) {
            const colorLabel = MOBILE_TEMPLATE.sections[0].fields[3].options?.find(o => o.value === color)
            if (colorLabel) {
                const colorName = (language === 'th' ? colorLabel.label_th : colorLabel.label_en).replace(/[⬛⬜🟨🔵🟣🩷🟢🪨🎨]/g, '').trim()
                parts.push(colorName)
            }
        }

        return parts.join(' ')
    }, [formData, language, t.emptyTitle])

    // Handle publish
    const handlePublish = useCallback(async () => {
        if (!user) {
            router.push('/login?redirect=/sell/mobiles/mobile-phones')
            return
        }

        if (completionPercentage < 100) {
            alert(language === 'th' ? 'กรุณากรอกข้อมูลให้ครบถ้วน' : 'Please fill in all required fields')
            return
        }

        setIsPublishing(true)

        try {
            // Build SellerInfo with correct interface
            const sellerInfo: SellerInfo = {
                name: user.displayName || 'Unknown',
                avatar: user.photoURL || undefined,
                verified: false,
                trust_score: 50,
                response_rate: 80,
                response_time_minutes: 30,
                total_listings: 0,
                successful_sales: 0,
            }

            // Build CreateListingInput
            const listingInput: CreateListingInput = {
                category_type: 'mobile',
                category_id: 3,
                subcategory_id: 301,
                title: generateTitle,
                price: parseInt((formData.price as string)?.replace(/,/g, '') || '0'),
                price_negotiable: formData.negotiable === 'yes' || formData.negotiable === 'little',
                price_type: 'negotiable',
                template_data: {
                    brand: formData.brand,
                    model: formData.model,
                    storage: formData.storage,
                    color: formData.color,
                    ram: formData.ram,
                    battery_health: formData.battery_health,
                    screen_condition: formData.screen_condition,
                    body_condition: formData.body_condition,
                    network_status: formData.network_status,
                    icloud_status: formData.icloud_status,
                    warranty: formData.warranty,
                    accessories: formData.accessories,
                    known_issues: formData.known_issues,
                    selling_reason: formData.selling_reason,
                    additional_description: formData.additional_description,
                },
                images: uploadedImages,
                location: {
                    province: formData.meeting_province as string || 'กรุงเทพมหานคร',
                    amphoe: formData.meeting_amphoe as string || '',
                    landmark: formData.meeting_landmark as string || '',
                    coordinates: formData.meeting_lat && formData.meeting_lng ? {
                        lat: parseFloat(formData.meeting_lat as string),
                        lng: parseFloat(formData.meeting_lng as string),
                    } : undefined,
                },
                meeting: {
                    province: formData.meeting_province as string || '',
                    amphoe: formData.meeting_amphoe as string || '',
                    landmark: formData.meeting_landmark as string || '',
                    available_times: formData.meeting_preference as string[] || ['anytime'],
                    delivery_option: formData.delivery_option as string || 'pickup_only',
                },
                contact: {
                    show_phone: !!formData.contact_phone,
                    phone: formData.contact_phone as string || '',
                    show_line: !!formData.contact_line,
                    line_id: formData.contact_line as string || '',
                    preferred_contact: 'chat',
                },
            }

            const result = await createListing(listingInput, user.uid, sellerInfo)
            setPublishSuccess(result)

        } catch (error) {
            console.error('Publish error:', error)
            alert(language === 'th' ? 'เกิดข้อผิดพลาด กรุณาลองใหม่' : 'An error occurred. Please try again.')
        } finally {
            setIsPublishing(false)
        }
    }, [user, completionPercentage, generateTitle, formData, uploadedImages, language, router])

    // Success modal
    if (publishSuccess) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 flex items-center justify-center p-4">
                <div className="bg-slate-800/90 backdrop-blur-xl rounded-3xl p-8 max-w-md w-full text-center border border-purple-500/30 shadow-2xl">
                    <div className="w-20 h-20 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">
                        {language === 'th' ? '🎉 ลงประกาศสำเร็จ!' : '🎉 Listing Published!'}
                    </h2>
                    <p className="text-gray-400 mb-6">
                        {language === 'th' ? 'รหัสประกาศ: ' : 'Listing Code: '}
                        <span className="text-purple-400 font-mono">{publishSuccess.listing_code}</span>
                    </p>
                    <div className="space-y-3">
                        <button
                            onClick={() => router.push(`/listing/${publishSuccess.slug}`)}
                            className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all"
                        >
                            {language === 'th' ? '👁️ ดูประกาศ' : '👁️ View Listing'}
                        </button>
                        <button
                            onClick={() => router.push('/seller/products')}
                            className="w-full py-3 bg-slate-700 text-white font-semibold rounded-xl hover:bg-slate-600 transition-all"
                        >
                            {language === 'th' ? '📋 จัดการประกาศ' : '📋 Manage Listings'}
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-xl border-b border-white/10">
                <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <button onClick={() => router.back()} className="p-2 hover:bg-white/10 rounded-xl transition-colors">
                            <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <div>
                            <h1 className="text-xl font-bold text-white flex items-center gap-2">
                                📱 {t.pageTitle}
                            </h1>
                            <p className="text-xs text-gray-400">{t.pageSubtitle}</p>
                        </div>
                    </div>

                    {/* Completion Badge */}
                    <div className="flex items-center gap-4">
                        <div className="hidden md:flex items-center gap-2 bg-slate-800/50 px-4 py-2 rounded-xl">
                            <span className="text-sm text-gray-400">{t.completion}</span>
                            <div className="w-24 h-2 bg-slate-700 rounded-full overflow-hidden">
                                <div
                                    className={`h-full transition-all duration-500 ${completionPercentage >= 100 ? 'bg-gradient-to-r from-green-400 to-emerald-500' :
                                        completionPercentage >= 70 ? 'bg-gradient-to-r from-yellow-400 to-orange-500' :
                                            'bg-gradient-to-r from-purple-500 to-indigo-500'
                                        }`}
                                    style={{ width: `${completionPercentage}%` }}
                                />
                            </div>
                            <span className={`text-sm font-bold ${completionPercentage >= 100 ? 'text-green-400' : 'text-purple-400'}`}>
                                {completionPercentage >= 100 ? '✓' : `${filledCount}/${totalRequired}`}
                            </span>
                        </div>

                        {/* Missing Fields Hint - Desktop */}
                        {missingFields.length > 0 && missingFields.length <= 3 && (
                            <div className="hidden lg:flex items-center gap-1 text-xs text-yellow-400">
                                <span>{t.missingFields}</span>
                                <span className="text-gray-300">
                                    {missingFields.slice(0, 2).map(f => f.label).join(', ')}
                                    {missingFields.length > 2 && ` +${missingFields.length - 2}`}
                                </span>
                            </div>
                        )}

                        {/* Language Toggle */}
                        <button
                            onClick={() => setLanguage(l => l === 'th' ? 'en' : 'th')}
                            className="px-3 py-1.5 bg-slate-800/50 text-gray-300 rounded-lg text-sm font-medium hover:bg-slate-700/50 transition-colors"
                        >
                            {language === 'th' ? 'EN' : 'TH'}
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content - Full Width Form */}
            <main className="max-w-3xl mx-auto px-4 py-6 pb-32">
                {/* Form Panel */}
                <div className="w-full">
                    <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden">
                        <div className="p-4 border-b border-white/10 bg-slate-800/50">
                            <h2 className="text-lg font-bold text-white">{t.formHeader}</h2>
                        </div>

                        <div className="p-4 space-y-4">
                            {/* Photo Upload */}
                            <div className="bg-slate-900/50 rounded-xl p-4 border border-white/5">
                                <h3 className="text-sm font-semibold text-gray-300 mb-3">{t.imageUpload}</h3>
                                <HybridPhotoUploader
                                    maxPhotos={10}
                                    language={language}
                                    onPhotosChange={(photos) => {
                                        // Store File objects for upload
                                        const files = photos.map(p => p.file).filter(Boolean)
                                        setUploadedImages(files)
                                        // Store previews for UI display
                                        const previews = photos.map(p => p.preview)
                                        setImagePreviews(previews)
                                    }}
                                    onFirstPhotoReady={async (photo) => {
                                        if (hasAnalyzedRef.current) return
                                        hasAnalyzedRef.current = true
                                        setIsAnalyzing(true)

                                        try {
                                            // Need to get the File from photo object
                                            if (!photo.file) {
                                                console.warn('No file in photo object')
                                                return
                                            }

                                            // Call AI Vision Service for mobile analysis
                                            const visionService = getOpenAIVisionService()
                                            const result = await visionService.analyzeImage(photo.file)

                                            if (result) {
                                                // Extract specs from structuredSpecs
                                                const specs = result.structuredSpecs || {}
                                                const avgConfidence = result.confidence
                                                    ? Math.round((result.confidence.brand + result.confidence.model + result.confidence.specs) / 3)
                                                    : 70

                                                setAiResult({
                                                    brand: specs.brand || result.detectedBrands?.[0],
                                                    model: specs.model,
                                                    storage: specs.storage,
                                                    color: specs.color,
                                                    estimatedPrice: result.estimatedPrice,
                                                    confidence: avgConfidence,
                                                })

                                                // Auto-fill form data from specs
                                                if (specs.brand) {
                                                    // Map brand to select value
                                                    const brandMap: Record<string, string> = {
                                                        'apple': 'apple', 'iphone': 'apple',
                                                        'samsung': 'samsung', 'galaxy': 'samsung',
                                                        'xiaomi': 'xiaomi', 'redmi': 'xiaomi', 'poco': 'xiaomi',
                                                        'oppo': 'oppo', 'realme': 'realme',
                                                        'vivo': 'vivo', 'huawei': 'huawei',
                                                        'google': 'google', 'pixel': 'google',
                                                        'oneplus': 'oneplus',
                                                    }
                                                    const brandKey = specs.brand.toLowerCase()
                                                    const mappedBrand = Object.entries(brandMap).find(([k]) => brandKey.includes(k))?.[1] || 'other'
                                                    handleFieldChange('brand', mappedBrand)
                                                }
                                                if (specs.model) handleFieldChange('model', specs.model)
                                                if (specs.storage) {
                                                    const storageMap: Record<string, string> = {
                                                        '64': '64gb', '128': '128gb', '256': '256gb',
                                                        '512': '512gb', '1tb': '1tb',
                                                    }
                                                    const storageKey = specs.storage.toLowerCase().replace(/\s|gb/gi, '')
                                                    handleFieldChange('storage', storageMap[storageKey] || '128gb')
                                                }
                                                if (specs.color) {
                                                    const colorMap: Record<string, string> = {
                                                        'black': 'black', 'ดำ': 'black',
                                                        'white': 'white', 'ขาว': 'white',
                                                        'silver': 'silver', 'เงิน': 'silver',
                                                        'gold': 'gold', 'ทอง': 'gold',
                                                        'blue': 'blue', 'น้ำเงิน': 'blue',
                                                        'purple': 'purple', 'ม่วง': 'purple',
                                                        'pink': 'pink', 'ชมพู': 'pink',
                                                        'green': 'green', 'เขียว': 'green',
                                                        'red': 'red', 'แดง': 'red',
                                                    }
                                                    const colorKey = specs.color.toLowerCase()
                                                    const mappedColor = Object.entries(colorMap).find(([k]) => colorKey.includes(k))?.[1] || 'black'
                                                    handleFieldChange('color', mappedColor)
                                                }
                                                if (result.estimatedPrice?.suggested) {
                                                    handleFieldChange('price', result.estimatedPrice.suggested.toString())
                                                }
                                            }
                                        } catch (error) {
                                            console.error('AI Analysis error:', error)
                                        } finally {
                                            setIsAnalyzing(false)
                                        }
                                    }}
                                />

                                {/* AI Analysis Status */}
                                {isAnalyzing && (
                                    <div className="mt-3 flex items-center gap-3 p-3 bg-purple-500/10 rounded-lg border border-purple-500/20">
                                        <div className="w-5 h-5 border-2 border-purple-400 border-t-transparent rounded-full animate-spin" />
                                        <span className="text-sm text-purple-300">
                                            {language === 'th' ? '🤖 AI กำลังวิเคราะห์มือถือ...' : '🤖 AI analyzing phone...'}
                                        </span>
                                    </div>
                                )}

                                {/* AI Result Badge */}
                                {aiResult && !isAnalyzing && (
                                    <div className="mt-3 p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                                        <div className="flex items-center gap-2 text-green-400 text-sm font-medium mb-2">
                                            <span>✅</span>
                                            <span>{language === 'th' ? 'AI กรอกข้อมูลให้แล้ว!' : 'AI auto-filled!'}</span>
                                            <span className="ml-auto text-xs opacity-70">
                                                {aiResult.confidence}% confidence
                                            </span>
                                        </div>
                                        <div className="text-xs text-gray-400">
                                            {aiResult.brand} {aiResult.model} {aiResult.storage} {aiResult.color}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Form Sections (Accordion) */}
                            {MOBILE_TEMPLATE.sections.map(section => (
                                <div key={section.id} className="bg-slate-900/50 rounded-xl border border-white/5 overflow-hidden">
                                    <button
                                        onClick={() => toggleSection(section.id)}
                                        className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors"
                                    >
                                        <span className="font-semibold text-white">
                                            {section.emoji} {language === 'th' ? section.title_th : section.title_en}
                                        </span>
                                        <svg
                                            className={`w-5 h-5 text-gray-400 transition-transform ${expandedSections.has(section.id) ? 'rotate-180' : ''}`}
                                            fill="none" viewBox="0 0 24 24" stroke="currentColor"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>

                                    {expandedSections.has(section.id) && (
                                        <div className="p-4 pt-0 space-y-4 border-t border-white/5">
                                            {section.fields.map(field => (
                                                <div key={field.key}>
                                                    <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                                                        {language === 'th' ? field.label_th : field.label_en}
                                                        {field.importance === 'required' && <span className="text-red-400">*</span>}
                                                    </label>

                                                    {/* Text Input */}
                                                    {field.type === 'text' && (
                                                        <input
                                                            type="text"
                                                            value={formData[field.key] as string || ''}
                                                            onChange={(e) => handleFieldChange(field.key, e.target.value)}
                                                            placeholder={field.placeholder_th}
                                                            className="w-full px-4 py-3 bg-slate-800 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500"
                                                        />
                                                    )}

                                                    {/* Textarea */}
                                                    {field.type === 'textarea' && (
                                                        <textarea
                                                            value={formData[field.key] as string || ''}
                                                            onChange={(e) => handleFieldChange(field.key, e.target.value)}
                                                            placeholder={field.placeholder_th}
                                                            rows={3}
                                                            className="w-full px-4 py-3 bg-slate-800 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 resize-none"
                                                        />
                                                    )}

                                                    {/* Select */}
                                                    {field.type === 'select' && (
                                                        <select
                                                            value={formData[field.key] as string || ''}
                                                            onChange={(e) => handleFieldChange(field.key, e.target.value)}
                                                            className="w-full px-4 py-3 bg-slate-800 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 appearance-none cursor-pointer"
                                                        >
                                                            <option value="">{t.selectPlaceholder}</option>
                                                            {field.options?.map(opt => (
                                                                <option key={opt.value} value={opt.value}>
                                                                    {language === 'th' ? opt.label_th : opt.label_en}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    )}

                                                    {/* Multiselect */}
                                                    {field.type === 'multiselect' && (
                                                        <div className="flex flex-wrap gap-2">
                                                            {field.options?.map(opt => {
                                                                const selected = ((formData[field.key] as string[]) || []).includes(opt.value)
                                                                return (
                                                                    <button
                                                                        key={opt.value}
                                                                        onClick={() => handleMultiselectToggle(field.key, opt.value)}
                                                                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${selected
                                                                            ? 'bg-purple-600 text-white'
                                                                            : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                                                                            }`}
                                                                    >
                                                                        {language === 'th' ? opt.label_th : opt.label_en}
                                                                    </button>
                                                                )
                                                            })}
                                                        </div>
                                                    )}

                                                    {/* Location Picker */}
                                                    {field.type === 'location_picker' && (
                                                        <ThaiLocationPicker
                                                            province={formData.meeting_province as string || ''}
                                                            amphoe={formData.meeting_amphoe as string || ''}
                                                            onProvinceChange={(province) => handleFieldChange('meeting_province', province)}
                                                            onAmphoeChange={(amphoe) => handleFieldChange('meeting_amphoe', amphoe)}
                                                            onLocationChange={(lat, lng) => {
                                                                handleFieldChange('meeting_lat', lat.toString())
                                                                handleFieldChange('meeting_lng', lng.toString())
                                                            }}
                                                            language={language}
                                                            showMap={true}
                                                        />
                                                    )}

                                                    {/* AI Tip */}
                                                    {field.aiTip_th && (
                                                        <p className="mt-2 text-xs text-purple-400/80">
                                                            {language === 'th' ? field.aiTip_th : field.aiTip_en}
                                                        </p>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>

            {/* Floating Summary Bar */}
            <div className="fixed bottom-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-xl border-t border-white/10 shadow-2xl">
                <div className="max-w-3xl mx-auto px-4 py-3">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-lg bg-slate-800 overflow-hidden flex-shrink-0">
                            {imagePreviews.length > 0 ? (
                                <img src={imagePreviews[0]} alt="" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-2xl">📱</div>
                            )}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-white font-medium text-sm truncate">{generateTitle || t.emptyTitle}</p>
                            <div className="flex items-center gap-2 mt-0.5">
                                {formData.price ? (
                                    <span className="text-green-400 font-bold text-sm">฿{formatPrice(formData.price as string)}</span>
                                ) : (
                                    <span className="text-gray-500 text-xs">{language === 'th' ? 'ยังไม่ตั้งราคา' : 'No price'}</span>
                                )}
                                <span className="text-gray-600">•</span>
                                <span className={`text-xs ${completionPercentage >= 100 ? 'text-green-400' : 'text-gray-400'}`}>{filledCount}/{totalRequired}</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                            <button onClick={() => setShowPreviewModal(true)} className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-sm font-medium transition-colors hidden sm:flex items-center gap-1">
                                👁️ {language === 'th' ? 'ดูตัวอย่าง' : 'Preview'}
                            </button>
                            <button onClick={handlePublish} disabled={isPublishing || completionPercentage < 100}
                                className={`px-5 py-2 rounded-lg text-sm font-bold transition-all ${completionPercentage >= 100 ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:shadow-lg' : 'bg-purple-600/80 text-white/90 hover:bg-purple-600'}`}>
                                {isPublishing ? '...' : completionPercentage >= 100 ? `✨ ${language === 'th' ? 'ลงประกาศ' : 'Publish'}` : `🚀 (${missingFields.length})`}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Preview Modal - Large 2-Column Layout */}
            {showPreviewModal && (
                <div className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setShowPreviewModal(false)}>
                    <div className="bg-slate-900 rounded-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden border border-white/10" onClick={e => e.stopPropagation()}>
                        <div className="p-4 border-b border-white/10 flex items-center justify-between bg-slate-800/50">
                            <h3 className="text-xl font-bold text-white">👁️ ตัวอย่างประกาศ</h3>
                            <button onClick={() => setShowPreviewModal(false)} className="p-2 hover:bg-white/10 rounded-lg text-white">✕</button>
                        </div>
                        <div className="overflow-y-auto max-h-[calc(90vh-140px)] custom-scrollbar">
                            {/* 2-Column Layout */}
                            <div className="grid md:grid-cols-2 gap-0">
                                {/* Left Column - Images */}
                                <div className="bg-slate-800">
                                    <div className="aspect-[4/3] relative">
                                        {imagePreviews.length > 0 ? (
                                            <img src={imagePreviews[0]} alt="Preview" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-8xl bg-gradient-to-br from-slate-700 to-slate-800">📱</div>
                                        )}
                                        {imagePreviews.length > 1 && (
                                            <div className="absolute bottom-3 right-3 bg-black/70 px-3 py-1.5 rounded-lg text-sm text-white font-medium">
                                                📷 +{imagePreviews.length - 1} รูป
                                            </div>
                                        )}
                                    </div>
                                    {/* Thumbnail strip */}
                                    {imagePreviews.length > 1 && (
                                        <div className="flex gap-2 p-3 overflow-x-auto">
                                            {imagePreviews.slice(0, 5).map((img, idx) => (
                                                <div key={idx} className="w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden border-2 border-white/20">
                                                    <img src={img} alt={`Preview ${idx + 1}`} className="w-full h-full object-cover" />
                                                </div>
                                            ))}
                                            {imagePreviews.length > 5 && (
                                                <div className="w-16 h-16 flex-shrink-0 rounded-lg bg-slate-700 flex items-center justify-center text-white text-sm">
                                                    +{imagePreviews.length - 5}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Right Column - Details */}
                                <div className="p-5 space-y-4 overflow-y-auto max-h-[60vh] md:max-h-[calc(90vh-140px)]">
                                    {/* Title & Price */}
                                    <div className="border-b border-white/10 pb-4">
                                        <h4 className="text-2xl font-bold text-white leading-tight">{generateTitle}</h4>
                                        {formData.price && <p className="text-3xl font-bold text-green-400 mt-2">฿{formatPrice(formData.price as string)}</p>}
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            {formData.negotiable === 'yes' && <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded-lg text-xs">💬 ต่อรองได้</span>}
                                            {formData.delivery_option !== 'pickup_only' && formData.delivery_option && (
                                                <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded-lg text-xs">
                                                    {formData.delivery_option === 'delivery_bkk' ? '🚗 ส่งในกรุงเทพ' : '🚚 ส่งทั่วประเทศ'}
                                                </span>
                                            )}
                                            {formData.shipping_cost === 'free' && <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded-lg text-xs">🎁 ส่งฟรี</span>}
                                            {formData.cod_available === 'yes' && <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded-lg text-xs">📦 รับ COD</span>}
                                        </div>
                                    </div>

                                    {/* Quick Specs */}
                                    <div className="flex flex-wrap gap-2">
                                        {formData.storage && <span className="px-3 py-1 bg-slate-800 rounded-lg text-sm text-white">{getOptionLabel(MOBILE_TEMPLATE.sections[0].fields[2].options, formData.storage as string, language)}</span>}
                                        {formData.color && <span className="px-3 py-1 bg-slate-800 rounded-lg text-sm text-white">{getOptionLabel(MOBILE_TEMPLATE.sections[0].fields[3].options, formData.color as string, language).split('/')[0]}</span>}
                                        {formData.ram && <span className="px-3 py-1 bg-slate-800 rounded-lg text-sm text-white">RAM {getOptionLabel(MOBILE_TEMPLATE.sections[0].fields[4].options, formData.ram as string, language)}</span>}
                                    </div>

                                    {/* Status Badges */}
                                    <div className="flex flex-wrap gap-1.5">
                                        {formData.icloud_status === 'logged_out' && <span className="px-2.5 py-1 bg-green-500/20 text-green-400 rounded-full text-xs">✓ iCloud ออกแล้ว</span>}
                                        {formData.network_status === 'unlocked' && <span className="px-2.5 py-1 bg-green-500/20 text-green-400 rounded-full text-xs">✓ ปลดล็อคแล้ว</span>}
                                        {formData.network_status === 'locked' && <span className="px-2.5 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-xs">🔒 ติดล็อค</span>}
                                    </div>

                                    {/* Device Condition */}
                                    {(formData.battery_health || formData.screen_condition || formData.body_condition) && (
                                        <div className="bg-slate-800/50 rounded-xl p-3 space-y-2">
                                            <p className="text-xs text-gray-400 font-medium">📊 สภาพเครื่อง</p>
                                            <div className="grid grid-cols-3 gap-2 text-center">
                                                {formData.battery_health && (
                                                    <div className="bg-slate-700/50 py-2 px-1.5 rounded-lg">
                                                        <div className="text-lg">🔋</div>
                                                        <div className="text-[10px] text-gray-400">แบต</div>
                                                        <div className="text-xs text-white font-medium">
                                                            {(formData.battery_health as string).includes('100') ? '100%' :
                                                                (formData.battery_health as string).includes('95') ? '95%+' :
                                                                    (formData.battery_health as string).includes('90') ? '90%+' :
                                                                        (formData.battery_health as string).includes('85') ? '85%+' : '80%+'}
                                                        </div>
                                                    </div>
                                                )}
                                                {formData.screen_condition && (
                                                    <div className="bg-slate-700/50 py-2 px-1.5 rounded-lg">
                                                        <div className="text-lg">📱</div>
                                                        <div className="text-[10px] text-gray-400">จอ</div>
                                                        <div className="text-xs text-white font-medium">
                                                            {formData.screen_condition === 'perfect' ? 'สมบูรณ์' :
                                                                formData.screen_condition === 'excellent' ? 'ดีมาก' :
                                                                    formData.screen_condition === 'good' ? 'ดี' : 'พอใช้'}
                                                        </div>
                                                    </div>
                                                )}
                                                {formData.body_condition && (
                                                    <div className="bg-slate-700/50 py-2 px-1.5 rounded-lg">
                                                        <div className="text-lg">✨</div>
                                                        <div className="text-[10px] text-gray-400">เครื่อง</div>
                                                        <div className="text-xs text-white font-medium">
                                                            {formData.body_condition === 'new' ? 'ใหม่' :
                                                                formData.body_condition === 'like_new' ? 'ใหม่มาก' :
                                                                    formData.body_condition === 'excellent' ? 'ดีเยี่ยม' : 'ดี'}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {/* Warranty */}
                                    {formData.warranty && formData.warranty !== 'none' && (
                                        <div className="bg-green-500/10 border border-green-500/30 rounded-lg px-3 py-2 flex items-center gap-2">
                                            <span>🛡️</span>
                                            <span className="text-xs text-green-400 font-medium">
                                                {getOptionLabel(MOBILE_TEMPLATE.sections[4].fields[0].options, formData.warranty as string, language)}
                                            </span>
                                        </div>
                                    )}

                                    {/* Accessories */}
                                    {(formData.accessories as string[])?.length > 0 && (
                                        <div className="bg-slate-800/50 rounded-xl p-3">
                                            <p className="text-xs text-gray-400 mb-2">📦 อุปกรณ์ที่มี</p>
                                            <div className="flex flex-wrap gap-1.5">
                                                {(formData.accessories as string[]).map(acc => {
                                                    const opt = MOBILE_TEMPLATE.sections[4].fields[2].options?.find(o => o.value === acc)
                                                    return (
                                                        <span key={acc} className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded-md text-xs">
                                                            {language === 'th' ? opt?.label_th : opt?.label_en}
                                                        </span>
                                                    )
                                                })}
                                            </div>
                                        </div>
                                    )}

                                    {/* Known Issues */}
                                    {(formData.known_issues as string[])?.filter(i => i !== 'none').length > 0 && (
                                        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
                                            <p className="text-xs text-red-400 font-medium mb-2">⚠️ ปัญหาที่พบ</p>
                                            <div className="flex flex-wrap gap-1.5">
                                                {(formData.known_issues as string[]).filter(i => i !== 'none').map(issue => {
                                                    const opt = MOBILE_TEMPLATE.sections[5].fields[0].options?.find(o => o.value === issue)
                                                    return (
                                                        <span key={issue} className="px-2 py-1 bg-red-500/20 text-red-300 rounded-md text-xs">
                                                            {language === 'th' ? opt?.label_th : opt?.label_en}
                                                        </span>
                                                    )
                                                })}
                                            </div>
                                        </div>
                                    )}

                                    {/* Meeting Location */}
                                    {(formData.meeting_province || formData.meeting_landmark || (formData.meeting_preference as string[])?.length > 0) && (
                                        <div className="bg-gradient-to-r from-purple-500/10 to-indigo-500/10 rounded-xl p-3 border border-purple-500/20">
                                            <p className="text-xs text-gray-400 mb-1">📍 นัดรับสินค้า</p>
                                            {formData.meeting_province && (
                                                <p className="text-white font-medium text-sm">
                                                    {formData.meeting_province}
                                                    {formData.meeting_amphoe && `, ${formData.meeting_amphoe}`}
                                                </p>
                                            )}
                                            {formData.meeting_landmark && (
                                                <p className="text-white text-sm mt-1.5 bg-white/5 px-2 py-1 rounded inline-block">🏪 {formData.meeting_landmark as string}</p>
                                            )}
                                            {(formData.meeting_preference as string[])?.length > 0 && (
                                                <div className="flex flex-wrap gap-1 mt-2">
                                                    {(formData.meeting_preference as string[]).map(pref => {
                                                        const opt = MOBILE_TEMPLATE.sections[7].fields[2].options?.find(o => o.value === pref)
                                                        return <span key={pref} className="px-2 py-0.5 bg-indigo-500/20 text-indigo-300 rounded text-[10px]">{language === 'th' ? opt?.label_th : opt?.label_en}</span>
                                                    })}
                                                </div>
                                            )}
                                            {formData.delivery_option && formData.delivery_option !== 'pickup_only' && (
                                                <p className="text-xs text-green-400 mt-1.5">
                                                    {getOptionLabel(MOBILE_TEMPLATE.sections[7].fields[3].options, formData.delivery_option as string, language)}
                                                </p>
                                            )}
                                        </div>
                                    )}

                                    {/* Purchase Info & Selling Reason */}
                                    {(formData.original_purchase || formData.selling_reason) && (
                                        <div className="bg-slate-800/50 rounded-xl p-3 space-y-2">
                                            <p className="text-xs text-gray-400 font-medium">📋 ข้อมูลเพิ่มเติม</p>
                                            <div className="space-y-1.5">
                                                {formData.original_purchase && (
                                                    <div className="flex items-center gap-2 text-sm">
                                                        <span className="text-gray-500">ซื้อจาก:</span>
                                                        <span className="text-white">{getOptionLabel(MOBILE_TEMPLATE.sections[6].fields[0].options, formData.original_purchase as string, language)}</span>
                                                    </div>
                                                )}
                                                {formData.selling_reason && (
                                                    <div className="flex items-center gap-2 text-sm">
                                                        <span className="text-gray-500">เหตุผลขาย:</span>
                                                        <span className="text-white">{getOptionLabel(MOBILE_TEMPLATE.sections[6].fields[1].options, formData.selling_reason as string, language)}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {/* Additional Description */}
                                    {formData.additional_description && (
                                        <div className="bg-slate-800/50 rounded-xl p-3">
                                            <p className="text-xs text-gray-400 mb-1">💬 รายละเอียดเพิ่มเติม</p>
                                            <p className="text-white text-sm whitespace-pre-wrap">{formData.additional_description as string}</p>
                                        </div>
                                    )}

                                    {/* Contact Info */}
                                    {(formData.contact_phone || formData.contact_line) && (
                                        <div className="bg-slate-800/50 rounded-xl p-3">
                                            <p className="text-xs text-gray-400 mb-2">📞 ช่องทางติดต่อ</p>
                                            <div className="flex flex-wrap gap-3">
                                                {formData.contact_phone && (
                                                    <span className="text-sm text-white">📱 {formData.contact_phone}</span>
                                                )}
                                                {formData.contact_line && (
                                                    <span className="text-sm text-green-400">💚 {formData.contact_line}</span>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {/* Payment Methods */}
                                    {(formData.payment_methods as string[])?.length > 0 && (
                                        <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-xl p-3 border border-blue-500/20">
                                            <p className="text-xs text-gray-400 mb-2">💳 ช่องทางชำระเงิน</p>
                                            <div className="flex flex-wrap gap-1.5">
                                                {(formData.payment_methods as string[]).map(pm => {
                                                    const opt = MOBILE_TEMPLATE.sections[8].fields[0].options?.find(o => o.value === pm)
                                                    return (
                                                        <span key={pm} className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded-lg text-xs">
                                                            {language === 'th' ? opt?.label_th : opt?.label_en}
                                                        </span>
                                                    )
                                                })}
                                            </div>
                                        </div>
                                    )}

                                    {/* Device Age */}
                                    {formData.device_age && (
                                        <div className="bg-slate-800/50 rounded-xl p-3">
                                            <p className="text-xs text-gray-400 mb-1">📅 อายุการใช้งาน</p>
                                            <p className="text-white text-sm font-medium">
                                                {getOptionLabel(MOBILE_TEMPLATE.sections[8].fields[1].options, formData.device_age as string, language)}
                                            </p>
                                        </div>
                                    )}

                                    {/* Ready Status */}
                                    <div className={`rounded-lg p-3 ${completionPercentage >= 100 ? 'bg-green-500/10 border border-green-500/30' : 'bg-yellow-500/10 border border-yellow-500/30'}`}>
                                        {completionPercentage >= 100 ? (
                                            <p className="text-green-400 font-medium">✅ พร้อมลงประกาศแล้ว!</p>
                                        ) : (
                                            <p className="text-yellow-400 font-medium">⚠️ กรอกอีก {missingFields.length} ช่อง</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="p-4 border-t border-white/10 flex gap-3">
                            <button onClick={() => setShowPreviewModal(false)} className="flex-1 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-xl font-medium">← กลับไปแก้ไข</button>
                            <button onClick={() => { setShowPreviewModal(false); handlePublish() }} disabled={completionPercentage < 100}
                                className={`flex-1 py-3 rounded-xl font-bold ${completionPercentage >= 100 ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white' : 'bg-slate-600 text-gray-400 cursor-not-allowed'}`}>
                                {completionPercentage >= 100 ? '✨ ลงประกาศเลย' : 'ยังไม่ครบ'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

// Wrap with Suspense
export default function Page() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-slate-900 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
            </div>
        }>
            <MobilePhoneListingPage />
        </Suspense>
    )
}
