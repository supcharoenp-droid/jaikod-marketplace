'use client'

import React, { useState, useCallback, useMemo, useRef, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import dynamic from 'next/dynamic'
import { useAuth } from '@/contexts/AuthContext'
import { createListing, SellerInfo } from '@/lib/listings'

// Dynamic import for ThaiLocationPicker (to avoid SSR issues with Leaflet)
const ThaiLocationPicker = dynamic(() => import('@/components/ui/ThaiLocationPicker'), {
    ssr: false,
    loading: () => (
        <div className="h-32 bg-slate-800 rounded-xl animate-pulse flex items-center justify-center text-gray-500 text-sm">
            กำลังโหลดแผนที่...
        </div>
    )
})

// Dynamic import for HybridPhotoUploader
const HybridPhotoUploader = dynamic(() => import('@/components/ui/HybridPhotoUploader'), {
    ssr: false,
    loading: () => (
        <div className="h-48 bg-slate-800 rounded-xl animate-pulse flex items-center justify-center text-gray-500 text-sm">
            กำลังโหลด Photo Uploader...
        </div>
    )
})

// ============================================
// CAR TEMPLATE DATA (Synced with world-class-description-engine.ts)
// ============================================
const CAR_TEMPLATE = {
    sections: [
        {
            id: 'car_info',
            emoji: '🚙',
            title_th: 'ข้อมูลรถ',
            title_en: 'Vehicle Information',
            fields: [
                { key: 'brand', label_th: 'ยี่ห้อ', label_en: 'Brand', importance: 'required', type: 'text' },
                { key: 'model', label_th: 'รุ่น', label_en: 'Model', importance: 'required', type: 'text' },
                { key: 'sub_model', label_th: 'รุ่นย่อย/แพ็คเกจ', label_en: 'Sub-model', importance: 'recommended', type: 'text', placeholder_th: 'เช่น 1.8 EL, Turbo RS' },
                {
                    key: 'body_type', label_th: 'ประเภทตัวถัง', label_en: 'Body Type', importance: 'recommended', type: 'select',
                    options: [
                        { value: 'sedan', label_th: '🚗 เก๋ง (Sedan)', label_en: '🚗 Sedan' },
                        { value: 'suv', label_th: '🚙 SUV / PPV', label_en: '🚙 SUV / PPV' },
                        { value: 'pickup', label_th: '🛻 กระบะ (Pickup)', label_en: '🛻 Pickup Truck' },
                        { value: 'hatchback', label_th: '🚘 5 ประตู (Hatchback)', label_en: '🚘 Hatchback' },
                        { value: 'van', label_th: '🚐 รถตู้ (Van)', label_en: '🚐 Van' },
                        { value: 'coupe', label_th: '🏎️ คูเป้ (Coupe)', label_en: '🏎️ Coupe' },
                    ]
                },
                {
                    key: 'year', label_th: 'ปีรถ', label_en: 'Year', importance: 'required', type: 'select',
                    options: [
                        // Recent years (2560-2568 / 2017-2025)
                        { value: '2568', label_th: '2568 (2025)', label_en: '2025' },
                        { value: '2567', label_th: '2567 (2024)', label_en: '2024' },
                        { value: '2566', label_th: '2566 (2023)', label_en: '2023' },
                        { value: '2565', label_th: '2565 (2022)', label_en: '2022' },
                        { value: '2564', label_th: '2564 (2021)', label_en: '2021' },
                        { value: '2563', label_th: '2563 (2020)', label_en: '2020' },
                        { value: '2562', label_th: '2562 (2019)', label_en: '2019' },
                        { value: '2561', label_th: '2561 (2018)', label_en: '2018' },
                        { value: '2560', label_th: '2560 (2017)', label_en: '2017' },
                        { value: '2559', label_th: '2559 (2016)', label_en: '2016' },
                        { value: '2558', label_th: '2558 (2015)', label_en: '2015' },
                        { value: '2557', label_th: '2557 (2014)', label_en: '2014' },
                        { value: '2556', label_th: '2556 (2013)', label_en: '2013' },
                        { value: '2555', label_th: '2555 (2012)', label_en: '2012' },
                        { value: '2554', label_th: '2554 (2011)', label_en: '2011' },
                        { value: '2553', label_th: '2553 (2010)', label_en: '2010' },
                        { value: '2552', label_th: '2552 (2009)', label_en: '2009' },
                        { value: '2551', label_th: '2551 (2008)', label_en: '2008' },
                        { value: '2550', label_th: '2550 (2007)', label_en: '2007' },
                        // 2000s (2543-2549 / 2000-2006)
                        { value: '2549', label_th: '2549 (2006)', label_en: '2006' },
                        { value: '2548', label_th: '2548 (2005)', label_en: '2005' },
                        { value: '2547', label_th: '2547 (2004)', label_en: '2004' },
                        { value: '2546', label_th: '2546 (2003)', label_en: '2003' },
                        { value: '2545', label_th: '2545 (2002)', label_en: '2002' },
                        { value: '2544', label_th: '2544 (2001)', label_en: '2001' },
                        { value: '2543', label_th: '2543 (2000)', label_en: '2000' },
                        // 1990s (2533-2542 / 1990-1999)
                        { value: '2542', label_th: '2542 (1999)', label_en: '1999' },
                        { value: '2541', label_th: '2541 (1998)', label_en: '1998' },
                        { value: '2540', label_th: '2540 (1997)', label_en: '1997' },
                        { value: '2539', label_th: '2539 (1996)', label_en: '1996' },
                        { value: '2538', label_th: '2538 (1995)', label_en: '1995' },
                        { value: '2537', label_th: '2537 (1994)', label_en: '1994' },
                        { value: '2536', label_th: '2536 (1993)', label_en: '1993' },
                        { value: '2535', label_th: '2535 (1992)', label_en: '1992' },
                        { value: '2534', label_th: '2534 (1991)', label_en: '1991' },
                        { value: '2533', label_th: '2533 (1990)', label_en: '1990' },
                        // 1980s (2523-2532 / 1980-1989)
                        { value: '2532', label_th: '2532 (1989)', label_en: '1989' },
                        { value: '2531', label_th: '2531 (1988)', label_en: '1988' },
                        { value: '2530', label_th: '2530 (1987)', label_en: '1987' },
                        { value: '2529', label_th: '2529 (1986)', label_en: '1986' },
                        { value: '2528', label_th: '2528 (1985)', label_en: '1985' },
                        { value: '2527', label_th: '2527 (1984)', label_en: '1984' },
                        { value: '2526', label_th: '2526 (1983)', label_en: '1983' },
                        { value: '2525', label_th: '2525 (1982)', label_en: '1982' },
                        { value: '2524', label_th: '2524 (1981)', label_en: '1981' },
                        { value: '2523', label_th: '2523 (1980)', label_en: '1980' },
                        // Classic cars - grouped by decade
                        { value: '1970s', label_th: '📜 ยุค 70s (2513-2522)', label_en: '📜 1970s' },
                        { value: '1960s', label_th: '📜 ยุค 60s (2503-2512)', label_en: '📜 1960s' },
                        { value: 'classic', label_th: '🏛️ รถคลาสสิค (ก่อน 2503)', label_en: '🏛️ Classic (Before 1960)' },
                    ]
                },
                {
                    key: 'color', label_th: 'สี', label_en: 'Color', importance: 'recommended', type: 'select',
                    options: [
                        { value: 'white', label_th: '⚪ ขาว', label_en: '⚪ White' },
                        { value: 'white_pearl', label_th: '🤍 ขาวมุก', label_en: '🤍 Pearl White' },
                        { value: 'black', label_th: '⬛ ดำ', label_en: '⬛ Black' },
                        { value: 'silver', label_th: '🩶 เงิน', label_en: '🩶 Silver' },
                        { value: 'gray', label_th: '⬜ เทา', label_en: '⬜ Gray' },
                        { value: 'red', label_th: '🔴 แดง', label_en: '🔴 Red' },
                        { value: 'blue', label_th: '🔵 น้ำเงิน', label_en: '🔵 Blue' },
                        { value: 'other', label_th: '🎨 อื่นๆ', label_en: '🎨 Other' },
                    ]
                },
            ]
        },
        {
            id: 'mileage_usage',
            emoji: '📊',
            title_th: 'ระยะทางและการใช้งาน',
            title_en: 'Mileage & Usage',
            fields: [
                { key: 'mileage', label_th: 'ระยะทาง (กม.)', label_en: 'Mileage (km)', importance: 'recommended', type: 'text', placeholder_th: 'เช่น 50000' },
                {
                    key: 'owners', label_th: 'เจ้าของกี่มือ', label_en: 'Owners', importance: 'recommended', type: 'select',
                    options: [
                        { value: '1', label_th: '👤 มือเดียว', label_en: '👤 First Owner' },
                        { value: '2', label_th: '👥 มือสอง', label_en: '👥 Second Owner' },
                        { value: '3+', label_th: '👥 มือสามขึ้นไป', label_en: '👥 Third+ Owner' },
                    ]
                },
            ]
        },
        {
            id: 'specs',
            emoji: '⚙️',
            title_th: 'สเปครถ',
            title_en: 'Specifications',
            fields: [
                {
                    key: 'fuel_type', label_th: 'เชื้อเพลิง', label_en: 'Fuel', importance: 'recommended', type: 'select',
                    options: [
                        { value: 'petrol', label_th: '⛽ เบนซิน', label_en: '⛽ Petrol' },
                        { value: 'diesel', label_th: '🛢️ ดีเซล', label_en: '🛢️ Diesel' },
                        { value: 'hybrid', label_th: '🔋 ไฮบริด', label_en: '🔋 Hybrid' },
                        { value: 'ev', label_th: '⚡ ไฟฟ้า', label_en: '⚡ Electric' },
                    ]
                },
                {
                    key: 'transmission', label_th: 'เกียร์', label_en: 'Transmission', importance: 'recommended', type: 'select',
                    options: [
                        { value: 'auto', label_th: '🅰️ ออโต้', label_en: '🅰️ Automatic' },
                        { value: 'manual', label_th: '🅼️ ธรรมดา', label_en: '🅼️ Manual' },
                        { value: 'cvt', label_th: '🔄 CVT', label_en: '🔄 CVT' },
                    ]
                },
                {
                    key: 'engine_cc', label_th: 'ขนาดเครื่อง', label_en: 'Engine Size', importance: 'recommended', type: 'select',
                    options: [
                        // Eco / Small Cars (660cc - 1.4L)
                        { value: '660', label_th: '660cc (Kei Car)', label_en: '660cc (Kei)' },
                        { value: '1000', label_th: '1.0 ลิตร', label_en: '1.0L' },
                        { value: '1200', label_th: '1.2 ลิตร', label_en: '1.2L' },
                        { value: '1300', label_th: '1.3 ลิตร', label_en: '1.3L' },
                        { value: '1400', label_th: '1.4 ลิตร', label_en: '1.4L' },
                        { value: '1500', label_th: '1.5 ลิตร', label_en: '1.5L' },
                        // Medium Cars (1.6L - 2.0L)
                        { value: '1600', label_th: '1.6 ลิตร', label_en: '1.6L' },
                        { value: '1800', label_th: '1.8 ลิตร', label_en: '1.8L' },
                        { value: '2000', label_th: '2.0 ลิตร', label_en: '2.0L' },
                        // Large / Diesel (2.2L - 3.0L)
                        { value: '2200', label_th: '2.2 ลิตร', label_en: '2.2L' },
                        { value: '2300', label_th: '2.3 ลิตร', label_en: '2.3L' },
                        { value: '2400', label_th: '2.4 ลิตร', label_en: '2.4L' },
                        { value: '2500', label_th: '2.5 ลิตร', label_en: '2.5L' },
                        { value: '2700', label_th: '2.7 ลิตร', label_en: '2.7L' },
                        { value: '2800', label_th: '2.8 ลิตร', label_en: '2.8L' },
                        { value: '3000', label_th: '3.0 ลิตร', label_en: '3.0L' },
                        // V6/V8 (3.5L+)
                        { value: '3300', label_th: '3.3 ลิตร', label_en: '3.3L' },
                        { value: '3500', label_th: '3.5 ลิตร (V6)', label_en: '3.5L (V6)' },
                        { value: '4000', label_th: '4.0 ลิตร', label_en: '4.0L' },
                        { value: '5000', label_th: '5.0 ลิตร (V8)', label_en: '5.0L (V8)' },
                        { value: 'other', label_th: 'อื่นๆ / ไม่ทราบ', label_en: 'Other' },
                    ]
                },
            ]
        },
        {
            id: 'condition_history',
            emoji: '🔧',
            title_th: 'สภาพและประวัติ',
            title_en: 'Condition & History',
            fields: [
                {
                    key: 'accident_history', label_th: 'ประวัติอุบัติเหตุ', label_en: 'Accident', importance: 'recommended', type: 'select',
                    options: [
                        { value: 'none', label_th: '✅ ไม่เคยชน', label_en: '✅ No Accidents' },
                        { value: 'minor', label_th: '⚠️ ชนเล็กน้อย', label_en: '⚠️ Minor' },
                        { value: 'major', label_th: '🔴 ชนหนัก', label_en: '🔴 Major' },
                    ]
                },
                {
                    key: 'flood_history', label_th: 'ประวัติน้ำท่วม', label_en: 'Flood', importance: 'recommended', type: 'select',
                    options: [
                        { value: 'none', label_th: '✅ ไม่เคยจมน้ำ', label_en: '✅ Never Flooded' },
                        { value: 'partial', label_th: '💧 น้ำท่วมบางส่วน', label_en: '💧 Partial' },
                        { value: 'full', label_th: '🌊 น้ำท่วมทั้งคัน', label_en: '🌊 Full' },
                    ]
                },
                {
                    key: 'tire_condition', label_th: 'สภาพยาง', label_en: 'Tires', importance: 'recommended', type: 'select',
                    options: [
                        { value: 'new', label_th: '🆕 ยางใหม่', label_en: '🆕 New' },
                        { value: 'good', label_th: '✅ ดอกยางดี', label_en: '✅ Good' },
                        { value: 'fair', label_th: '⚠️ พอใช้', label_en: '⚠️ Fair' },
                        { value: 'need_change', label_th: '🔴 ต้องเปลี่ยน', label_en: '🔴 Needs Change' },
                    ]
                },
            ]
        },
        {
            id: 'registration',
            emoji: '📋',
            title_th: 'ทะเบียนและเอกสาร',
            title_en: 'Registration & Documents',
            fields: [
                // 🆕 Thai Location Picker for Registration Province & Amphoe (77 จังหวัดครบ)
                {
                    key: 'registration_location_picker', label_th: '📍 จังหวัดจดทะเบียน', label_en: '📍 Registration Province',
                    importance: 'recommended', type: 'location_picker'
                },
                {
                    key: 'tax_status', label_th: 'ภาษี/พ.ร.บ.', label_en: 'Tax Status', importance: 'recommended', type: 'select',
                    options: [
                        { value: 'valid', label_th: '✅ ยังไม่ขาด', label_en: '✅ Valid' },
                        { value: 'expiring_soon', label_th: '⏰ จะขาดเร็วๆ นี้', label_en: '⏰ Expiring Soon' },
                        { value: 'expired', label_th: '⚠️ ขาดแล้ว', label_en: '⚠️ Expired' },
                    ]
                },
                {
                    key: 'book_status', label_th: 'สมุดทะเบียน', label_en: 'Book', importance: 'recommended', type: 'select',
                    options: [
                        { value: 'original', label_th: '📘 เล่มเดิม', label_en: '📘 Original' },
                        { value: 'copy', label_th: '📕 เล่มแดง', label_en: '📕 Red Book' },
                        { value: 'lost', label_th: '❓ หาย/ทำใหม่', label_en: '❓ Lost' },
                    ]
                },
                {
                    key: 'spare_keys', label_th: 'กุญแจสำรอง', label_en: 'Spare Keys', importance: 'recommended', type: 'select',
                    options: [
                        { value: '2_remote', label_th: '🔑 2 ดอก + รีโมท', label_en: '🔑 2 Keys + Remote' },
                        { value: '2', label_th: '🔑 2 ดอก', label_en: '🔑 2 Keys' },
                        { value: '1', label_th: '🔑 ดอกเดียว', label_en: '🔑 1 Key Only' },
                    ]
                },
                // 🆕 Insurance
                {
                    key: 'insurance_type', label_th: '🛡️ ประกันภัย', label_en: '🛡️ Insurance', importance: 'recommended', type: 'select',
                    options: [
                        { value: 'class1', label_th: '🥇 ชั้น 1 (ครอบคลุมสูงสุด)', label_en: '🥇 Class 1 (Full Coverage)' },
                        { value: 'class2plus', label_th: '🥈 ชั้น 2+ (คุ้มครองรถหาย)', label_en: '🥈 Class 2+ (With Theft)' },
                        { value: 'class2', label_th: '🥈 ชั้น 2 (บุคคลที่สาม)', label_en: '🥈 Class 2 (Third Party)' },
                        { value: 'class3plus', label_th: '🥉 ชั้น 3+ (ซ่อมรถตัวเอง)', label_en: '🥉 Class 3+ (Own Damage)' },
                        { value: 'class3', label_th: '🥉 ชั้น 3 (พื้นฐาน)', label_en: '🥉 Class 3 (Basic)' },
                        { value: 'none', label_th: '❌ ไม่มีประกัน', label_en: '❌ No Insurance' },
                        { value: 'expired', label_th: '⏰ หมดอายุแล้ว', label_en: '⏰ Expired' },
                    ]
                },
            ]
        },
        {
            id: 'payment_options',
            emoji: '💰',
            title_th: 'ราคาและการชำระ',
            title_en: 'Price & Payment',
            fields: [
                { key: 'price', label_th: 'ราคาขาย (บาท)', label_en: 'Price (THB)', importance: 'required', type: 'text', placeholder_th: 'เช่น 550000' },
                {
                    key: 'negotiable', label_th: 'ต่อรองได้?', label_en: 'Negotiable?', importance: 'recommended', type: 'select',
                    options: [
                        { value: 'yes', label_th: '✅ ต่อรองได้', label_en: '✅ Yes' },
                        { value: 'little', label_th: '↔️ ต่อได้นิดหน่อย', label_en: '↔️ A little' },
                        { value: 'no', label_th: '❌ ราคาตายตัว', label_en: '❌ Fixed' },
                    ]
                },
                {
                    key: 'finance_available', label_th: 'ไฟแนนซ์', label_en: 'Financing', importance: 'recommended', type: 'select',
                    options: [
                        { value: 'cash_only', label_th: '💵 เงินสดเท่านั้น', label_en: '💵 Cash Only' },
                        { value: 'finance_ok', label_th: '🏦 จัดไฟแนนซ์ได้', label_en: '🏦 Financing OK' },
                        { value: 'takeover', label_th: '📑 รับช่วงผ่อน', label_en: '📑 Takeover OK' },
                    ]
                },
            ]
        },
        {
            id: 'extras',
            emoji: '📦',
            title_th: 'อุปกรณ์เสริม',
            title_en: 'Extras',
            fields: [
                {
                    key: 'included_items', label_th: 'ของแถม', label_en: 'Included', importance: 'optional', type: 'multiselect',
                    options: [
                        { value: 'dashcam', label_th: '📹 กล้องหน้ารถ', label_en: '📹 Dashcam' },
                        { value: 'film', label_th: '🪟 ฟิล์มกรองแสง', label_en: '🪟 Window Film' },
                        { value: 'carplay', label_th: '📱 CarPlay/Android Auto', label_en: '📱 CarPlay' },
                        { value: 'leather', label_th: '💺 หุ้มเบาะหนัง', label_en: '💺 Leather Seats' },
                        { value: 'sound', label_th: '🔊 เครื่องเสียง', label_en: '🔊 Sound System' },
                    ]
                },
                {
                    key: 'selling_reason', label_th: 'เหตุผลที่ขาย', label_en: 'Selling Reason', importance: 'optional', type: 'select',
                    options: [
                        { value: 'upgrade', label_th: '⬆️ เปลี่ยนรุ่นใหม่', label_en: '⬆️ Upgrading' },
                        { value: 'rarely_used', label_th: '🕐 ใช้น้อย', label_en: '🕐 Rarely Used' },
                        { value: 'need_money', label_th: '💰 ต้องการเงินก้อน', label_en: '💰 Need Money' },
                        { value: 'moving', label_th: '🏠 ย้ายบ้าน/ต่างประเทศ', label_en: '🏠 Moving/Abroad' },
                    ]
                },
                // 🆕 Service History
                {
                    key: 'service_history', label_th: '🔧 ประวัติการดูแล', label_en: '🔧 Service History', importance: 'recommended', type: 'select',
                    options: [
                        { value: 'dealer', label_th: '🏢 เข้าศูนย์ตลอด', label_en: '🏢 Dealer Only' },
                        { value: 'documented', label_th: '📋 มีบันทึกการซ่อม', label_en: '📋 Documented' },
                        { value: 'local_shop', label_th: '🔧 อู่ทั่วไป', label_en: '🔧 Local Shop' },
                        { value: 'diy', label_th: '🛠️ ดูแลเอง', label_en: '🛠️ DIY' },
                    ]
                },
                // 🆕 Modification Status
                {
                    key: 'modification_status', label_th: '⚙️ การดัดแปลง', label_en: '⚙️ Modifications', importance: 'optional', type: 'select',
                    options: [
                        { value: 'stock', label_th: '✅ รถบ้าน เดิมๆ', label_en: '✅ Stock/Original' },
                        { value: 'minor', label_th: '📝 แต่งนิดหน่อย', label_en: '📝 Minor Mods' },
                        { value: 'performance', label_th: '🏎️ อัพเกรดสมรรถนะ', label_en: '🏎️ Performance' },
                        { value: 'cosmetic', label_th: '🎨 แต่งสวย', label_en: '🎨 Cosmetic' },
                        { value: 'full', label_th: '🔥 แต่งเต็ม', label_en: '🔥 Fully Modified' },
                    ]
                },
                // 🆕 Trade-in
                {
                    key: 'trade_in', label_th: '🔄 รับแลกเปลี่ยน', label_en: '🔄 Trade-in', importance: 'optional', type: 'select',
                    options: [
                        { value: 'yes', label_th: '✅ รับแลก/รับเทิร์น', label_en: '✅ Accept Trade-in' },
                        { value: 'consider', label_th: '🤔 พิจารณา', label_en: '🤔 Will Consider' },
                        { value: 'no', label_th: '❌ ไม่รับแลก', label_en: '❌ No Trade-in' },
                    ]
                },
                { key: 'additional_description', label_th: 'รายละเอียดเพิ่มเติม', label_en: 'Additional Details', importance: 'optional', type: 'textarea', placeholder_th: 'ใส่ข้อมูลเพิ่มเติมที่ต้องการบอกผู้ซื้อ เช่น ประวัติการดูแล, จุดเด่นของรถ, อะไหล่ที่เพิ่งเปลี่ยน...' },
            ]
        },
        {
            id: 'meeting_location',
            emoji: '📍',
            title_th: 'สถานที่นัดดูรถ',
            title_en: 'Meeting Location',
            fields: [
                // Thai Location Picker (special type - renders ThaiLocationPicker component)
                {
                    key: 'meeting_location_picker', label_th: '📍 เลือกสถานที่นัดดูรถ', label_en: '📍 Select Meeting Location',
                    importance: 'recommended', type: 'location_picker'
                },
                // Landmark (full width)
                {
                    key: 'meeting_landmark', label_th: 'จุดนัดพบ', label_en: 'Meeting Point', importance: 'recommended', type: 'text',
                    placeholder_th: 'เช่น ห้างเซ็นทรัล, ปั๊ม PTT, สถานี BTS...'
                },
                // Time preference + Delivery (inline, compact)
                {
                    key: 'meeting_preference', label_th: 'เวลาที่สะดวก', label_en: 'Available Time', importance: 'optional', type: 'multiselect',
                    inline: true, inlineGroup: 'time_row', inlineWidth: '60%',
                    options: [
                        { value: 'weekday', label_th: '📅 วันธรรมดา', label_en: '📅 Weekday' },
                        { value: 'weekend', label_th: '🌟 เสาร์-อาทิตย์', label_en: '🌟 Weekend' },
                        { value: 'anytime', label_th: '⏰ ทุกวัน', label_en: '⏰ Anytime' },
                    ]
                },
                {
                    key: 'delivery_option', label_th: 'ส่งรถ', label_en: 'Delivery', importance: 'optional', type: 'select',
                    inline: true, inlineGroup: 'time_row', inlineWidth: '40%',
                    options: [
                        { value: 'pickup_only', label_th: '🏠 รับเอง', label_en: '🏠 Pickup' },
                        { value: 'delivery_bkk', label_th: '🚗 ส่ง กทม.', label_en: '🚗 BKK' },
                        { value: 'delivery_nationwide', label_th: '🚚 ทั่วไทย', label_en: '🚚 Nationwide' },
                    ]
                },
            ]
        },
        // 🆕 Contact Section
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

const formatMileage = (mileage: string) => {
    const num = parseInt(mileage.replace(/,/g, ''))
    if (isNaN(num)) return ''
    return num.toLocaleString('th-TH')
}

// Bilingual UI Labels
const UI_LABELS = {
    th: {
        pageTitle: 'ลงขายรถยนต์มือสอง',
        pageSubtitle: 'กรอกข้อมูลและดูตัวอย่างทันที',
        completion: 'ความสมบูรณ์',
        formTab: '✏️ กรอก',
        previewTab: '👁️ ตัวอย่าง',
        formHeader: '📝 กรอกข้อมูล',
        previewHeader: '👁️ ตัวอย่างประกาศ',
        imageUpload: '📸 รูปภาพรถ (สูงสุด 10 รูป)',
        addImage: 'เพิ่มรูป',
        delete: 'ลบ',
        selectPlaceholder: '-- เลือก --',
        noImage: 'ยังไม่มีรูปภาพ',
        moreImages: 'รูป',
        postListing: '🚀 ลงประกาศเลย',
        fillMore: 'กรอกให้ครบ',
        remaining: 'อีก',
        emptyTitle: 'ยังไม่ได้กรอกข้อมูล...',
        mileage: '🛣️ ระยะทาง',
        owner: '👤 เจ้าของ',
        bodyType: '🚗 ประเภท',
        color: '🎨 สี',
        fuel: '⛽ เชื้อเพลิง',
        transmission: '🔄 เกียร์',
        engine: '🔧 เครื่องยนต์',
        tires: '🛞 สภาพยาง',
        registration: '📍 ทะเบียน',
        includedItems: '📦 ของแถม',
        sellingReason: '💬 เหตุผลที่ขาย',
        additionalDetails: '📝 รายละเอียดเพิ่มเติม',
        meetingLocation: '📍 สถานที่นัดดูรถ',
        meetingTime: '⏰ เวลาที่สะดวก',
        delivery: '🚚 บริการส่ง',
        km: 'กม.',
    },
    en: {
        pageTitle: 'Sell Your Used Car',
        pageSubtitle: 'Fill in details and preview instantly',
        completion: 'Completion',
        formTab: '✏️ Form',
        previewTab: '👁️ Preview',
        formHeader: '📝 Fill Details',
        previewHeader: '👁️ Listing Preview',
        imageUpload: '📸 Car Photos (max 10)',
        addImage: 'Add',
        delete: 'Delete',
        selectPlaceholder: '-- Select --',
        noImage: 'No images yet',
        moreImages: 'more',
        postListing: '🚀 Post Listing',
        fillMore: 'Complete',
        remaining: 'more',
        emptyTitle: 'No data entered yet...',
        mileage: '🛣️ Mileage',
        owner: '👤 Owner',
        bodyType: '🚗 Type',
        color: '🎨 Color',
        fuel: '⛽ Fuel',
        transmission: '🔄 Gear',
        engine: '🔧 Engine',
        tires: '🛞 Tires',
        registration: '📍 Reg.',
        includedItems: '📦 Included',
        sellingReason: '💬 Selling Reason',
        additionalDetails: '📝 Additional Details',
        meetingLocation: '📍 Meeting Location',
        meetingTime: '⏰ Available Time',
        delivery: '🚚 Delivery',
        km: 'km',
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
function CarListingDemo() {
    const [activeTab, setActiveTab] = useState<'form' | 'preview'>('form')
    const [formData, setFormData] = useState<Record<string, string | string[]>>({})
    const [uploadedImages, setUploadedImages] = useState<string[]>([])
    const [language, setLanguage] = useState<Language>('th')

    // 🤖 AI Analysis State
    const [isAnalyzing, setIsAnalyzing] = useState(false)
    const hasAnalyzedRef = useRef(false) // ป้องกันการวิเคราะห์ซ้ำ
    const [aiResult, setAiResult] = useState<{
        brand?: string
        model?: string
        subModel?: string
        year?: string
        color?: string
        bodyType?: string
        condition?: string
        estimatedPrice?: { min: number; max: number; suggested: number }
        confidence?: number
        detectedFeatures?: string[]
    } | null>(null)

    // 📝 Auto Description State (Marketing Copy)
    const [generatedDescription, setGeneratedDescription] = useState<{
        headline: string
        subheadline: string
        sellingPoints: string[]
        trustSignals: string[]
        bodyCopy: string
        callToAction: string
        fullText: string
        seoKeywords: string[]
    } | null>(null)
    const [showDescription, setShowDescription] = useState(false)
    const [copyToast, setCopyToast] = useState(false) // Toast for copy feedback

    // 🚀 Publishing State
    const router = useRouter()
    const { user } = useAuth()
    const [isPublishing, setIsPublishing] = useState(false)
    const [publishSuccess, setPublishSuccess] = useState<{ listing_code: string; listing_number: string; slug: string } | null>(null)

    // 📂 Collapsible Sections State (ยุบ-ขยาย Accordion)
    const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['car_info', 'payment_options']))

    // Toggle section expand/collapse
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

    // Get current UI labels
    const t = UI_LABELS[language]

    // Get search params to check if coming from AI detect
    const searchParams = useSearchParams()
    const fromAI = searchParams.get('from') === 'ai'

    // 🔄 Load AI Detection Data from sessionStorage
    useEffect(() => {
        if (fromAI) {
            try {
                const aiDataStr = sessionStorage.getItem('ai_detection')
                if (aiDataStr) {
                    const aiData = JSON.parse(aiDataStr)
                    console.log('📦 Loaded AI Detection Data:', aiData)

                    // Load uploaded image
                    if (aiData.uploadedImage) {
                        setUploadedImages([aiData.uploadedImage])
                    }

                    // Pre-fill form with extracted data
                    if (aiData.extractedData) {
                        const { brand, model, subModel, year, color, bodyType, priceEstimate } = aiData.extractedData

                        setFormData(prev => ({
                            ...prev,
                            brand: brand || prev.brand,
                            model: model || prev.model,
                            sub_model: subModel || prev.sub_model,
                            year: year || prev.year,
                            color: color || prev.color,
                            body_type: bodyType || prev.body_type,
                            // Optionally set suggested price
                            price: priceEstimate?.suggested?.toString() || prev.price,
                        }))

                        // Set AI result for price display
                        setAiResult({
                            brand,
                            model,
                            subModel,
                            year,
                            color,
                            bodyType,
                            estimatedPrice: priceEstimate,
                            confidence: aiData.confidence,
                        })
                    }

                    // Mark as already analyzed
                    hasAnalyzedRef.current = true

                    // Clear sessionStorage after loading
                    sessionStorage.removeItem('ai_detection')
                }
            } catch (error) {
                console.error('Error loading AI detection data:', error)
            }
        }
    }, [fromAI])

    // 🤖 AI Car Analysis Handler (with duplicate prevention)
    const handleAIAnalysis = useCallback(async (photoFile: File) => {
        // ป้องกันการเรียกซ้ำ
        if (isAnalyzing || hasAnalyzedRef.current) {
            console.log('⏭️ Skipping AI analysis - already running or completed')
            return
        }

        hasAnalyzedRef.current = true // Mark as started
        setIsAnalyzing(true)

        try {
            // Dynamic import to avoid SSR issues
            const { analyzeCarPhoto, fileToBase64 } = await import('@/lib/car-photo-analyzer')
            const base64 = await fileToBase64(photoFile)
            const result = await analyzeCarPhoto(base64)

            setAiResult(result)

            // Auto-fill form fields from AI results
            if (result.formData) {
                setFormData(prev => {
                    const updates: Record<string, string> = {}

                    // Only fill empty fields
                    if (result.formData.brand && !prev.brand) {
                        updates.brand = result.formData.brand
                    }
                    if (result.formData.model && !prev.model) {
                        updates.model = result.formData.model
                    }
                    if (result.formData.sub_model && result.formData.sub_model !== 'null' && !prev.sub_model) {
                        updates.sub_model = result.formData.sub_model
                    }
                    if (result.formData.year && !prev.year) {
                        updates.year = result.formData.year
                    }
                    if (result.formData.color && !prev.color) {
                        updates.color = result.formData.color
                    }
                    if (result.formData.body_type && !prev.body_type) {
                        updates.body_type = result.formData.body_type
                    }
                    if (result.formData.transmission && !prev.transmission) {
                        updates.transmission = result.formData.transmission
                    }
                    if (result.formData.fuel_type && !prev.fuel_type) {
                        updates.fuel_type = result.formData.fuel_type
                    }
                    if (result.formData.condition && !prev.condition) {
                        updates.condition = result.formData.condition
                    }

                    return { ...prev, ...updates }
                })
            }

            console.log('🤖 AI Analysis Result:', result)
        } catch (error) {
            console.error('AI Analysis Error:', error)
            hasAnalyzedRef.current = false // Allow retry on error
        } finally {
            setIsAnalyzing(false)
        }
    }, []) // Empty dependency - use ref instead

    // Handle form field changes
    const handleFieldChange = useCallback((key: string, value: string | string[]) => {
        setFormData(prev => ({ ...prev, [key]: value }))
    }, [])

    // 📝 Generate Auto Description
    const handleGenerateDescription = useCallback(async () => {
        const { generateCarDescription } = await import('@/lib/car-description-generator')
        const description = generateCarDescription(formData as Record<string, string | string[] | undefined>)
        setGeneratedDescription(description)
        setShowDescription(true)
    }, [formData])

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

    // Handle image upload
    const handleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (!files) return

        Array.from(files).forEach(file => {
            const reader = new FileReader()
            reader.onloadend = () => {
                if (typeof reader.result === 'string') {
                    setUploadedImages(prev => [...prev, reader.result as string].slice(0, 10))
                }
            }
            reader.readAsDataURL(file)
        })
    }, [])

    // Calculate completion percentage
    const completionPercentage = useMemo(() => {
        const requiredFields = CAR_TEMPLATE.sections.flatMap(s =>
            s.fields.filter(f => f.importance === 'required')
        )
        const filledRequired = requiredFields.filter(f => {
            // Handle location_picker fields specially - check actual province key
            if (f.type === 'location_picker') {
                const prefix = f.key.includes('registration') ? 'reg' : 'meeting'
                const provinceVal = formData[`${prefix}_province`]
                return provinceVal && (provinceVal as string).trim() !== ''
            }
            const val = formData[f.key]
            return val && (Array.isArray(val) ? val.length > 0 : (val as string).trim() !== '')
        })
        return Math.round((filledRequired.length / requiredFields.length) * 100)
    }, [formData])

    // Generate title from form data (Enhanced with Selling Tags + Character Limit)
    const TITLE_MAX_LENGTH = 100

    const generateTitle = useMemo(() => {
        const { brand, model, sub_model, year, transmission, mileage, owners, accident_history, flood_history, service_history } = formData
        if (!brand || !model) return t.emptyTitle

        const parts: string[] = [brand as string, model as string]

        // Add sub_model if valid
        if (sub_model && sub_model !== 'null') parts.push(sub_model as string)

        // Add year (short format)
        if (year) {
            const yearOption = CAR_TEMPLATE.sections[0].fields.find(f => f.key === 'year')?.options?.find(o => o.value === year)
            if (yearOption) {
                // Use short year format: "2565" instead of "2565 (2022)"
                const shortYear = language === 'th' ? (year as string) : yearOption.label_en
                parts.push(shortYear)
            }
        }

        // Add transmission short code
        if (transmission) {
            if (transmission === 'auto') parts.push('AT')
            else if (transmission === 'manual') parts.push('MT')
            else if (transmission === 'cvt') parts.push('CVT')
        }

        // Build base title
        let title = parts.join(' ')

        // Generate Selling Tags based on form data
        const tags: string[] = []

        // Tag: First owner
        if (owners === '1') tags.push(language === 'th' ? 'มือเดียว' : '1st Owner')

        // Tag: No accidents
        if (accident_history === 'none' && flood_history === 'none') {
            tags.push(language === 'th' ? 'ไม่เคยชน' : 'No Accidents')
        }

        // Tag: Low mileage
        const mileageNum = parseInt((mileage as string)?.replace(/,/g, '') || '0')
        if (mileageNum > 0 && mileageNum < 50000) {
            tags.push(language === 'th' ? `ไมล์น้อย ${Math.floor(mileageNum / 1000)}k` : `Low ${Math.floor(mileageNum / 1000)}k km`)
        } else if (mileageNum >= 50000 && mileageNum < 100000) {
            tags.push(language === 'th' ? `ไมล์ ${Math.floor(mileageNum / 1000)}k` : `${Math.floor(mileageNum / 1000)}k km`)
        }

        // Tag: Dealer serviced
        if (service_history === 'dealer') tags.push(language === 'th' ? 'ศูนย์ตลอด' : 'Dealer Serviced')

        // Append tags to title (max 2 tags to fit character limit)
        if (tags.length > 0) {
            const tagStr = tags.slice(0, 2).join(' ')
            const potentialTitle = `${title} - ${tagStr}`
            // Only add if within character limit
            if (potentialTitle.length <= TITLE_MAX_LENGTH) {
                title = potentialTitle
            }
        }

        // Ensure title doesn't exceed max length
        return title.substring(0, TITLE_MAX_LENGTH)
    }, [formData, language, t.emptyTitle])

    // Calculate title character count
    const titleCharCount = useMemo(() => {
        const title = generateTitle === t.emptyTitle ? '' : generateTitle
        return title.length
    }, [generateTitle, t.emptyTitle])

    // Calculate Trust Score (based on filled optional fields)
    const trustScore = useMemo(() => {
        let score = 0
        const maxScore = 100

        // Core fields (40 points total)
        if (formData.brand) score += 10
        if (formData.model) score += 10
        if (formData.year) score += 10
        if (formData.price) score += 10

        // Important details (30 points total)
        if (formData.mileage) score += 6
        if (formData.owners) score += 6
        if (formData.transmission) score += 6
        if (formData.fuel_type) score += 6
        if (formData.color) score += 6

        // Trust-building info (20 points total)
        if (formData.accident_history) score += 5
        if (formData.flood_history) score += 5
        if (formData.service_history) score += 5
        if (formData.tax_status) score += 5

        // Contact & Location (10 points total)
        if (formData.contact_phone) score += 5
        if (formData.meeting_province || formData.reg_province) score += 5

        // Photos bonus
        if (uploadedImages.length >= 3) score += 5
        if (uploadedImages.length >= 6) score += 5

        return Math.min(score, maxScore)
    }, [formData, uploadedImages])

    // Trust Score Level
    const trustLevel = useMemo(() => {
        if (trustScore >= 80) return { label: language === 'th' ? '⭐ ดีเยี่ยม' : '⭐ Excellent', color: 'text-green-500', bg: 'bg-green-500' }
        if (trustScore >= 60) return { label: language === 'th' ? '✅ ดี' : '✅ Good', color: 'text-blue-500', bg: 'bg-blue-500' }
        if (trustScore >= 40) return { label: language === 'th' ? '⚠️ พอใช้' : '⚠️ Fair', color: 'text-yellow-500', bg: 'bg-yellow-500' }
        return { label: language === 'th' ? '🔴 ควรเพิ่มข้อมูล' : '🔴 Needs More Info', color: 'text-red-500', bg: 'bg-red-500' }
    }, [trustScore, language])

    // 🚀 Handle Publish Listing
    const handlePublishListing = useCallback(async () => {
        if (isPublishing || completionPercentage < 100) return

        // Check if user is logged in
        if (!user) {
            // Redirect to login with return URL
            router.push(`/login?returnUrl=${encodeURIComponent('/demo/car-listing')}`)
            return
        }

        setIsPublishing(true)

        try {
            // Prepare seller info
            const sellerInfo: SellerInfo = {
                name: user.displayName || user.email?.split('@')[0] || 'ผู้ขาย',
                avatar: user.photoURL || '', // Use empty string for Firestore (undefined not allowed)
                verified: user.emailVerified || false,
                trust_score: 50, // Default trust score for new users
                response_rate: 95,
                response_time_minutes: 60,
                total_listings: 1,
                successful_sales: 0
            }

            // Convert image URLs to proper format
            const images = uploadedImages.filter(Boolean)

            // Prepare listing input
            const listingInput = {
                category_type: 'car' as const,
                category_id: 1, // Car category

                title: generateTitle,

                price: parseInt(formData.price as string) || 0,
                price_negotiable: formData.finance_available !== 'cash_only',
                price_type: 'negotiable' as const,

                // All template data
                template_data: {
                    ...formData,
                    // Ensure key fields are present
                    brand: formData.brand,
                    model: formData.model,
                    sub_model: formData.sub_model,
                    year: formData.year,
                    color: formData.color,
                    body_type: formData.body_type,
                    transmission: formData.transmission,
                    fuel_type: formData.fuel_type,
                    mileage: parseInt(formData.mileage as string) || 0,
                    condition: formData.condition,
                    owner_hand: formData.owner_hand,
                    reg_province: formData.reg_province,
                    insurance_type: formData.insurance_type,
                    service_history: formData.service_history,
                    finance_available: formData.finance_available,
                    contact_phone: formData.contact_phone,
                    contact_line: formData.contact_line,
                    additional_description: formData.additional_description,
                },

                images: images,

                location: {
                    province: formData.meeting_province as string,
                    amphoe: formData.meeting_amphoe as string,
                    landmark: formData.meeting_landmark as string,
                },

                // AI content
                ai_content: generatedDescription ? {
                    auto_title: generateTitle,
                    marketing_copy: {
                        headline: generatedDescription.headline,
                        subheadline: generatedDescription.subheadline,
                        selling_points: generatedDescription.sellingPoints,
                        trust_signals: generatedDescription.trustSignals,
                        body_copy: generatedDescription.bodyCopy,
                        call_to_action: generatedDescription.callToAction,
                        full_text: generatedDescription.fullText,
                    },
                    seo_keywords: generatedDescription.seoKeywords,
                    confidence_score: aiResult?.confidence || 0,
                    price_analysis: aiResult?.estimatedPrice ? {
                        market_avg: aiResult.estimatedPrice.suggested,
                        min_price: aiResult.estimatedPrice.min,
                        max_price: aiResult.estimatedPrice.max,
                        suggested_price: aiResult.estimatedPrice.suggested,
                        price_position: 'at_market' as const,
                        percentage_diff: 0,
                    } : undefined,
                    buyer_checklist: [
                        'รถเคยมีอุบัติเหตุไหม?',
                        'ไมล์จริงใช่ไหม?',
                        'เข้าศูนย์ครั้งล่าสุดเมื่อไหร่?',
                        'ประกันเหลือถึงเมื่อไหร่?',
                    ],
                } : undefined,

                contact: {
                    show_phone: !!formData.contact_phone,
                    phone: formData.contact_phone as string,
                    show_line: !!formData.contact_line,
                    line_id: formData.contact_line as string,
                    preferred_contact: 'chat' as const,
                },

                meeting: {
                    province: formData.meeting_province as string,
                    amphoe: formData.meeting_amphoe as string,
                    landmark: formData.meeting_landmark as string,
                    available_times: formData.meeting_availability as string[] || ['anytime'],
                    delivery_option: formData.delivery_option as string,
                },

                negotiation: {
                    allow_offers: true,
                    counter_offer_enabled: true,
                },
            }

            console.log('📦 Publishing listing...', listingInput)

            const result = await createListing(listingInput, user.uid, sellerInfo)

            console.log('✅ Listing published:', result)

            // Set success state
            setPublishSuccess({
                listing_code: result.listing_code,
                listing_number: result.listing_number,
                slug: result.slug
            })

            // Redirect to the listing page after 2 seconds (or show success modal)
            setTimeout(() => {
                router.push(`/listing/${result.slug}`)
            }, 2000)

        } catch (error) {
            console.error('❌ Error publishing listing:', error)
            alert(language === 'th'
                ? 'เกิดข้อผิดพลาดในการลงประกาศ กรุณาลองใหม่อีกครั้ง'
                : 'Error publishing listing. Please try again.')
        } finally {
            setIsPublishing(false)
        }
    }, [isPublishing, completionPercentage, user, router, formData, uploadedImages, generateTitle, generatedDescription, aiResult, language])

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900">
            {/* Toast Notification */}
            {copyToast && (
                <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[100] animate-fade-in">
                    <div className="px-4 py-2 bg-green-500 text-white rounded-lg shadow-lg flex items-center gap-2">
                        <span>✓</span>
                        <span>{language === 'th' ? 'คัดลอกแล้ว!' : 'Copied!'}</span>
                    </div>
                </div>
            )}

            {/* Success Modal */}
            {publishSuccess && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80">
                    <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 max-w-md w-full text-center border border-white/10 shadow-2xl animate-fade-in">
                        {/* Success Icon */}
                        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center">
                            <span className="text-4xl">✓</span>
                        </div>

                        <h2 className="text-2xl font-bold text-white mb-2">
                            {language === 'th' ? '🎉 ลงประกาศสำเร็จ!' : '🎉 Listing Published!'}
                        </h2>

                        <p className="text-gray-400 mb-6">
                            {language === 'th'
                                ? 'ประกาศของคุณพร้อมให้คนอื่นดูแล้ว'
                                : 'Your listing is now live for others to see'}
                        </p>

                        {/* Listing Code (NEW - Primary) */}
                        <div className="bg-slate-900/50 rounded-xl p-4 mb-6 border border-purple-500/30">
                            <div className="text-sm text-gray-400 mb-1">
                                {language === 'th' ? 'รหัสประกาศ' : 'Listing Code'}
                            </div>
                            <div className="text-2xl font-bold text-purple-400 font-mono">
                                {publishSuccess.listing_code || publishSuccess.listing_number}
                            </div>
                            {publishSuccess.listing_code && (
                                <div className="text-xs text-gray-500 mt-2">
                                    {language === 'th' ? 'เลขอ้างอิง: ' : 'Ref: '}{publishSuccess.listing_number}
                                </div>
                            )}
                        </div>

                        <div className="text-sm text-gray-500 mb-6">
                            {language === 'th'
                                ? '⏳ กำลังพาไปหน้าประกาศ...'
                                : '⏳ Redirecting to listing page...'}
                        </div>

                        <button
                            onClick={() => router.push(`/listing/${publishSuccess.slug}`)}
                            className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-xl text-white font-semibold transition-all"
                        >
                            {language === 'th' ? 'ดูประกาศ' : 'View Listing'}
                        </button>
                    </div>
                </div>
            )}

            {/* Header */}
            <header className="sticky top-0 z-50 backdrop-blur-xl bg-slate-900/70 border-b border-white/10">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                                <span className="text-xl">🚗</span>
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-white">{t.pageTitle}</h1>
                                <p className="text-sm text-gray-400">{t.pageSubtitle}</p>
                            </div>
                        </div>

                        {/* Language Toggle + Progress Bar */}
                        <div className="flex items-center gap-4">
                            {/* Language Toggle */}
                            <button
                                onClick={() => setLanguage(language === 'th' ? 'en' : 'th')}
                                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/50 border border-white/10 hover:bg-slate-700/50 transition-all"
                            >
                                <span className="text-sm">{language === 'th' ? '🇹🇭' : '🇬🇧'}</span>
                                <span className="text-sm font-medium text-white">{language === 'th' ? 'TH' : 'EN'}</span>
                            </button>

                            {/* Progress Bar */}
                            <div className="hidden md:flex items-center gap-3">
                                <div className="text-sm text-gray-400">{t.completion}</div>
                                <div className="w-32 h-2 bg-gray-700 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-green-400 to-emerald-500 transition-all duration-500"
                                        style={{ width: `${completionPercentage}%` }}
                                    />
                                </div>
                                <div className="text-sm font-semibold text-green-400">{completionPercentage}%</div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Mobile Tab Switcher */}
            <div className="md:hidden sticky top-[73px] z-40 bg-slate-900/90 backdrop-blur-lg border-b border-white/10">
                <div className="flex">
                    <button
                        onClick={() => setActiveTab('form')}
                        className={`flex-1 py-3 px-4 text-sm font-medium flex items-center justify-center gap-2 transition-all ${activeTab === 'form'
                            ? 'text-purple-400 border-b-2 border-purple-500 bg-purple-500/10'
                            : 'text-gray-400 hover:text-white'
                            }`}
                    >
                        <span>✏️</span> {language === 'th' ? 'กรอก' : 'Form'}
                    </button>
                    <button
                        onClick={() => setActiveTab('preview')}
                        className={`flex-1 py-3 px-4 text-sm font-medium flex items-center justify-center gap-2 transition-all ${activeTab === 'preview'
                            ? 'text-purple-400 border-b-2 border-purple-500 bg-purple-500/10'
                            : 'text-gray-400 hover:text-white'
                            }`}
                    >
                        <span>👁️</span> {language === 'th' ? 'ตัวอย่าง' : 'Preview'}
                    </button>
                </div>
            </div>

            {/* Main Content - Split View (กว้างขึ้น: Form 60% / Preview 40%) */}
            <div className="max-w-[1600px] mx-auto px-4 py-4">
                <div className="grid md:grid-cols-5 gap-4">

                    {/* LEFT PANEL: Form (60% width) */}
                    <div className={`${activeTab === 'form' ? 'block' : 'hidden'} md:block md:col-span-3`}>
                        <div className="bg-slate-800/50 backdrop-blur-lg rounded-2xl border border-white/10 overflow-hidden">
                            {/* Panel Header */}
                            <div className="px-5 py-4 border-b border-white/10 bg-slate-900/50">
                                <div className="flex items-center gap-2">
                                    <span className="text-lg">📝</span>
                                    <h2 className="font-semibold text-white">{language === 'th' ? 'กรอกข้อมูล' : 'Fill Details'}</h2>
                                </div>
                            </div>

                            {/* 🚀 Hybrid Photo Uploader Section */}
                            <div className="p-5 border-b border-white/10">
                                <HybridPhotoUploader
                                    maxPhotos={10}
                                    language={language}
                                    onPhotosChange={(photos) => {
                                        // Convert to preview URLs for compatibility
                                        setUploadedImages(photos.map(p => p.preview))
                                    }}
                                    onFirstPhotoReady={(photo) => {
                                        console.log('First photo ready for AI analysis:', photo)
                                        // 🤖 Trigger AI car analysis
                                        handleAIAnalysis(photo.file)
                                    }}
                                />

                                {/* 🤖 AI Analysis Status */}
                                {isAnalyzing && (
                                    <div className="mt-4 p-4 bg-purple-500/10 border border-purple-500/30 rounded-xl">
                                        <div className="flex items-center gap-3">
                                            <div className="w-6 h-6 border-2 border-purple-400 border-t-transparent rounded-full animate-spin" />
                                            <div>
                                                <p className="text-white font-medium">
                                                    {language === 'th' ? '🤖 AI กำลังวิเคราะห์รถ...' : '🤖 AI analyzing car...'}
                                                </p>
                                                <p className="text-xs text-gray-400">
                                                    {language === 'th' ? 'ตรวจจับยี่ห้อ รุ่น สี ปี และราคาโดยประมาณ' : 'Detecting brand, model, color, year and price estimate'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* 🤖 AI Analysis Result */}
                                {aiResult && !isAnalyzing && (
                                    <div className="mt-4 p-4 bg-green-500/10 border border-green-500/30 rounded-xl">
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="flex-1">
                                                <p className="text-green-400 font-medium flex items-center gap-2 mb-2">
                                                    ✅ {language === 'th' ? 'AI ตรวจจับสำเร็จ!' : 'AI Detection Complete!'}
                                                    <span className="text-xs bg-green-500/20 px-2 py-0.5 rounded-full">
                                                        {Math.round((aiResult.confidence || 0) * 100)}% confidence
                                                    </span>
                                                </p>
                                                <div className="grid grid-cols-2 gap-2 text-sm">
                                                    {aiResult.brand && (
                                                        <div className="flex gap-2">
                                                            <span className="text-gray-400">{language === 'th' ? 'ยี่ห้อ:' : 'Brand:'}</span>
                                                            <span className="text-white font-medium">{aiResult.brand}</span>
                                                        </div>
                                                    )}
                                                    {aiResult.model && (
                                                        <div className="flex gap-2">
                                                            <span className="text-gray-400">{language === 'th' ? 'รุ่น:' : 'Model:'}</span>
                                                            <span className="text-white font-medium">{aiResult.model}</span>
                                                        </div>
                                                    )}
                                                    {aiResult.year && (
                                                        <div className="flex gap-2">
                                                            <span className="text-gray-400">{language === 'th' ? 'ปี:' : 'Year:'}</span>
                                                            <span className="text-white font-medium">{aiResult.year}</span>
                                                        </div>
                                                    )}
                                                    {aiResult.color && (
                                                        <div className="flex gap-2">
                                                            <span className="text-gray-400">{language === 'th' ? 'สี:' : 'Color:'}</span>
                                                            <span className="text-white font-medium">{aiResult.color}</span>
                                                        </div>
                                                    )}
                                                </div>
                                                {aiResult.estimatedPrice && aiResult.estimatedPrice.suggested > 0 && (
                                                    <div className="mt-2 pt-2 border-t border-white/10">
                                                        <span className="text-gray-400 text-sm">{language === 'th' ? '💰 ราคาแนะนำ:' : '💰 Suggested Price:'}</span>
                                                        <span className="ml-2 text-lg text-yellow-400 font-bold">
                                                            ฿{aiResult.estimatedPrice.suggested.toLocaleString()}
                                                        </span>
                                                        <span className="ml-2 text-xs text-gray-500">
                                                            (฿{aiResult.estimatedPrice.min.toLocaleString()} - ฿{aiResult.estimatedPrice.max.toLocaleString()})
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                            <button
                                                onClick={() => setAiResult(null)}
                                                className="text-gray-500 hover:text-white p-1"
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* 📝 Auto Description Button */}
                            <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-xl p-4 border border-purple-500/20">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <span className="text-2xl">✨</span>
                                        <div>
                                            <h4 className="text-white font-medium">
                                                {language === 'th' ? 'สร้างคำบรรยายอัตโนมัติ' : 'Auto Generate Description'}
                                            </h4>
                                            <p className="text-sm text-gray-400">
                                                {language === 'th' ? 'AI จะสร้างคำบรรยายจากข้อมูลที่กรอก' : 'AI will create description from your inputs'}
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={handleGenerateDescription}
                                        disabled={!formData.brand && !formData.model}
                                        className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg text-white font-medium
                                                 hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed
                                                 transition-all flex items-center gap-2"
                                    >
                                        <span>📝</span>
                                        {language === 'th' ? 'สร้างคำบรรยาย' : 'Generate'}
                                    </button>
                                </div>
                            </div>

                            {/* 📝 Generated Description Display (Marketing Copy) */}
                            {showDescription && generatedDescription && (
                                <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-xl p-4 border border-purple-500/30">
                                    <div className="flex items-center justify-between mb-4">
                                        <h4 className="text-white font-medium flex items-center gap-2">
                                            <span>✨</span>
                                            {language === 'th' ? 'คำบรรยายขาย (Marketing Copy)' : 'Marketing Copy'}
                                        </h4>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => {
                                                    navigator.clipboard.writeText(generatedDescription.fullText)
                                                    setCopyToast(true)
                                                    setTimeout(() => setCopyToast(false), 2000)
                                                }}
                                                className="px-3 py-1.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg text-sm font-medium hover:from-purple-600 hover:to-pink-600"
                                            >
                                                📋 {language === 'th' ? 'คัดลอกทั้งหมด' : 'Copy All'}
                                            </button>
                                            <button
                                                onClick={() => setShowDescription(false)}
                                                className="text-gray-400 hover:text-white p-1"
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    </div>

                                    {/* Headline */}
                                    <div className="bg-slate-900/70 rounded-lg p-3 mb-3">
                                        <h5 className="text-lg font-bold text-yellow-400 mb-1">
                                            🚗 {generatedDescription.headline}
                                        </h5>
                                        <p className="text-sm text-gray-400">
                                            {generatedDescription.subheadline}
                                        </p>
                                    </div>

                                    {/* Selling Points */}
                                    {generatedDescription.sellingPoints.length > 0 && (
                                        <div className="bg-slate-900/50 rounded-lg p-3 mb-3">
                                            <h5 className="text-sm font-medium text-purple-400 mb-2">
                                                ✨ {language === 'th' ? 'จุดเด่น' : 'Highlights'}
                                            </h5>
                                            <div className="grid grid-cols-2 gap-2">
                                                {generatedDescription.sellingPoints.map((point, i) => (
                                                    <div key={i} className="text-sm text-green-400">
                                                        {point}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Body Copy */}
                                    <div className="bg-slate-900/50 rounded-lg p-3 mb-3">
                                        <h5 className="text-sm font-medium text-purple-400 mb-2">
                                            📝 {language === 'th' ? 'รายละเอียด' : 'Description'}
                                        </h5>
                                        <p className="text-sm text-gray-300 leading-relaxed">
                                            {generatedDescription.bodyCopy}
                                        </p>
                                    </div>

                                    {/* Trust Signals */}
                                    {generatedDescription.trustSignals.length > 0 && (
                                        <div className="flex flex-wrap gap-2 mb-3">
                                            {generatedDescription.trustSignals.map((signal, i) => (
                                                <span key={i} className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded-full">
                                                    {signal}
                                                </span>
                                            ))}
                                        </div>
                                    )}

                                    {/* Call to Action */}
                                    <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-lg p-3 border border-green-500/30">
                                        <p className="text-sm text-green-400 font-medium">
                                            {generatedDescription.callToAction}
                                        </p>
                                    </div>

                                    {/* SEO Keywords */}
                                    <div className="mt-3 flex flex-wrap gap-1">
                                        {generatedDescription.seoKeywords.slice(0, 5).map((keyword, i) => (
                                            <span key={i} className="text-xs text-gray-500">
                                                #{keyword}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Form Sections - Accordion Layout (ยุบ-ขยายได้) */}
                            <div className="divide-y divide-white/5 max-h-[calc(100vh-180px)] overflow-y-auto scrollbar-thin scrollbar-thumb-purple-500/30">
                                {CAR_TEMPLATE.sections.map((section) => {
                                    // Group inline fields by inlineGroup
                                    const fieldGroups: { group: string | null; fields: typeof section.fields }[] = []
                                    let currentGroup: string | null = null
                                    let currentGroupFields: typeof section.fields = []

                                    section.fields.forEach((field) => {
                                        const fieldInlineGroup = (field as any).inlineGroup as string | undefined
                                        if (fieldInlineGroup) {
                                            if (fieldInlineGroup !== currentGroup) {
                                                if (currentGroupFields.length > 0) {
                                                    fieldGroups.push({ group: currentGroup, fields: currentGroupFields as any })
                                                }
                                                currentGroup = fieldInlineGroup
                                                currentGroupFields = [field as any]
                                            } else {
                                                currentGroupFields.push(field as any)
                                            }
                                        } else {
                                            if (currentGroupFields.length > 0) {
                                                fieldGroups.push({ group: currentGroup, fields: currentGroupFields as any })
                                                currentGroup = null
                                                currentGroupFields = []
                                            }
                                            fieldGroups.push({ group: null, fields: [field as any] })
                                        }
                                    })
                                    if (currentGroupFields.length > 0) {
                                        fieldGroups.push({ group: currentGroup, fields: currentGroupFields as any })
                                    }

                                    // Check if section is expanded
                                    const isExpanded = expandedSections.has(section.id)

                                    // Count filled fields in this section
                                    const filledCount = section.fields.filter(f => {
                                        const val = formData[f.key]
                                        return val && (Array.isArray(val) ? val.length > 0 : (val as string).trim() !== '')
                                    }).length

                                    // Check if section has required fields
                                    const hasRequired = section.fields.some(f => f.importance === 'required')

                                    return (
                                        <div key={section.id} className="border-b border-white/5 last:border-b-0">
                                            {/* Accordion Header - Clickable */}
                                            <button
                                                type="button"
                                                onClick={() => toggleSection(section.id)}
                                                className={`w-full px-4 py-3 flex items-center justify-between hover:bg-slate-700/30 transition-colors ${isExpanded ? 'bg-slate-800/50' : ''
                                                    }`}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <span className="text-xl">{section.emoji}</span>
                                                    <div className="text-left">
                                                        <h3 className="text-sm font-medium text-white flex items-center gap-2">
                                                            {language === 'th' ? section.title_th : section.title_en}
                                                            {hasRequired && (
                                                                <span className="px-1.5 py-0.5 text-[10px] font-medium bg-purple-500/20 text-purple-400 rounded">
                                                                    {language === 'th' ? 'สำคัญ' : 'Required'}
                                                                </span>
                                                            )}
                                                        </h3>
                                                        {!isExpanded && filledCount > 0 && (
                                                            <p className="text-xs text-gray-500 mt-0.5">
                                                                ✓ {language === 'th' ? `กรอกแล้ว ${filledCount}/${section.fields.length} ช่อง` : `${filledCount}/${section.fields.length} filled`}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    {filledCount > 0 && !isExpanded && (
                                                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                                                    )}
                                                    <span className={`text-gray-400 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}>
                                                        ▼
                                                    </span>
                                                </div>
                                            </button>

                                            {/* Accordion Content - Collapsible */}
                                            <div className={`overflow-hidden transition-all duration-300 ${isExpanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
                                                }`}>
                                                <div className="px-4 pb-4 pt-2 space-y-3">
                                                    {fieldGroups.map((fg, gIdx) => (
                                                        <div
                                                            key={gIdx}
                                                            className={fg.group ? 'grid grid-cols-2 gap-2' : ''}
                                                        >
                                                            {fg.fields.map((field) => {
                                                                // Skip hidden fields
                                                                if (field.type === 'hidden') return null

                                                                return (
                                                                    <div key={field.key} className={fg.group ? '' : ''}>
                                                                        {field.type !== 'map_picker' && (
                                                                            <label className="block text-xs text-gray-400 mb-1">
                                                                                {language === 'th' ? field.label_th : field.label_en}
                                                                                {field.importance === 'required' && (
                                                                                    <span className="text-red-400 ml-1">*</span>
                                                                                )}
                                                                            </label>
                                                                        )}

                                                                        {field.type === 'text' && (
                                                                            <input
                                                                                type="text"
                                                                                value={(formData[field.key] as string) || ''}
                                                                                onChange={(e) => handleFieldChange(field.key, e.target.value)}
                                                                                placeholder={field.placeholder_th}
                                                                                className="w-full px-3 py-2 bg-slate-700/50 border border-white/10 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                                                                            />
                                                                        )}

                                                                        {field.type === 'textarea' && (
                                                                            <textarea
                                                                                value={(formData[field.key] as string) || ''}
                                                                                onChange={(e) => handleFieldChange(field.key, e.target.value)}
                                                                                placeholder={field.placeholder_th}
                                                                                rows={3}
                                                                                className="w-full px-3 py-2 bg-slate-700/50 border border-white/10 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
                                                                            />
                                                                        )}

                                                                        {field.type === 'select' && field.options && (
                                                                            <select
                                                                                value={(formData[field.key] as string) || ''}
                                                                                onChange={(e) => handleFieldChange(field.key, e.target.value)}
                                                                                className="w-full px-3 py-2 bg-slate-700/50 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all appearance-none cursor-pointer"
                                                                            >
                                                                                <option value="" className="bg-slate-800">{t.selectPlaceholder}</option>
                                                                                {field.options.map((opt) => (
                                                                                    <option key={opt.value} value={opt.value} className="bg-slate-800">
                                                                                        {language === 'th' ? opt.label_th : opt.label_en}
                                                                                    </option>
                                                                                ))}
                                                                            </select>
                                                                        )}

                                                                        {field.type === 'multiselect' && field.options && (
                                                                            <div className="flex flex-wrap gap-1.5">
                                                                                {field.options.map((opt) => {
                                                                                    const isSelected = ((formData[field.key] as string[]) || []).includes(opt.value)
                                                                                    return (
                                                                                        <button
                                                                                            key={opt.value}
                                                                                            type="button"
                                                                                            onClick={() => handleMultiselectToggle(field.key, opt.value)}
                                                                                            className={`px-2.5 py-1 rounded-full text-xs transition-all ${isSelected
                                                                                                ? 'bg-purple-500 text-white'
                                                                                                : 'bg-slate-700/50 text-gray-300 hover:bg-slate-600'
                                                                                                }`}
                                                                                        >
                                                                                            {language === 'th' ? opt.label_th : opt.label_en}
                                                                                        </button>
                                                                                    )
                                                                                })}
                                                                            </div>
                                                                        )}

                                                                        {field.type === 'location_picker' && (() => {
                                                                            // Determine prefix based on field key
                                                                            const isRegistration = field.key.includes('registration')
                                                                            const prefix = isRegistration ? 'reg' : 'meeting'

                                                                            return (
                                                                                <ThaiLocationPicker
                                                                                    province={(formData[`${prefix}_province`] as string) || ''}
                                                                                    amphoe={(formData[`${prefix}_amphoe`] as string) || ''}
                                                                                    lat={parseFloat(formData[`${prefix}_lat`] as string) || undefined}
                                                                                    lng={parseFloat(formData[`${prefix}_lng`] as string) || undefined}
                                                                                    onProvinceChange={(prov) => handleFieldChange(`${prefix}_province`, prov)}
                                                                                    onAmphoeChange={(amp) => handleFieldChange(`${prefix}_amphoe`, amp)}
                                                                                    onLocationChange={(newLat, newLng) => {
                                                                                        handleFieldChange(`${prefix}_lat`, String(newLat))
                                                                                        handleFieldChange(`${prefix}_lng`, String(newLng))
                                                                                    }}
                                                                                    language={language}
                                                                                    showMap={!isRegistration}
                                                                                    compact={true}
                                                                                    hideAmphoe={isRegistration}
                                                                                />
                                                                            )
                                                                        })()}
                                                                    </div>
                                                                )
                                                            })}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>

                    {/* RIGHT PANEL: Preview (40% width) */}
                    <div className={`${activeTab === 'preview' ? 'block' : 'hidden'} md:block md:col-span-2`}>
                        <div className="sticky top-24">
                            <div className="bg-slate-800/50 backdrop-blur-lg rounded-2xl border border-white/10 overflow-hidden">
                                {/* Preview Header */}
                                <div className="px-5 py-4 border-b border-white/10 bg-slate-900/50">
                                    <div className="flex items-center gap-2">
                                        <span className="text-lg">👁️</span>
                                        <h2 className="font-semibold text-white">{language === 'th' ? 'ตัวอย่างประกาศ' : 'Listing Preview'}</h2>
                                    </div>
                                </div>

                                {/* Preview Content */}
                                <div className="p-5">
                                    {/* Image Gallery Preview */}
                                    <div className="aspect-video bg-slate-700/50 rounded-xl mb-4 overflow-hidden relative">
                                        {uploadedImages.length > 0 ? (
                                            <img
                                                src={uploadedImages[0]}
                                                alt="Main"
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex flex-col items-center justify-center text-gray-500">
                                                <span className="text-4xl mb-2">📸</span>
                                                <span className="text-sm">{t.noImage}</span>
                                            </div>
                                        )}
                                        {uploadedImages.length > 1 && (
                                            <div className="absolute bottom-2 right-2 bg-black/70 px-2 py-1 rounded-md text-xs text-white">
                                                +{uploadedImages.length - 1} {t.moreImages}
                                            </div>
                                        )}
                                    </div>

                                    {/* Title & Price */}
                                    <div className="mb-4">
                                        <h3 className="text-xl font-bold text-white mb-1">{generateTitle}</h3>
                                        {/* Character Counter */}
                                        <div className="flex items-center gap-2 mb-2">
                                            <div className={`text-xs ${titleCharCount > 80 ? 'text-yellow-400' : titleCharCount > 0 ? 'text-gray-400' : 'text-gray-500'}`}>
                                                {titleCharCount > 0 ? `${titleCharCount}/${TITLE_MAX_LENGTH} ${language === 'th' ? 'ตัวอักษร' : 'chars'}` : ''}
                                            </div>
                                            {titleCharCount > 0 && titleCharCount <= 80 && (
                                                <span className="text-xs text-green-400">✓ {language === 'th' ? 'ความยาวดี' : 'Good length'}</span>
                                            )}
                                        </div>
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-2xl font-bold text-green-400">
                                                {formData.price ? `฿${formatPrice(formData.price as string)}` : '฿---'}
                                            </span>
                                            {formData.negotiable && (
                                                <span className="text-sm text-gray-400">
                                                    {getOptionLabel(
                                                        CAR_TEMPLATE.sections.find(s => s.id === 'payment_options')?.fields.find(f => f.key === 'negotiable')?.options,
                                                        formData.negotiable as string, language)}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Trust Score Section */}
                                    <div className="mb-4 p-3 bg-slate-700/30 rounded-xl border border-white/5">
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm font-medium text-gray-300">
                                                    {language === 'th' ? '🛡️ ความน่าเชื่อถือ' : '🛡️ Trust Score'}
                                                </span>
                                                <span className={`text-xs font-semibold ${trustLevel.color}`}>
                                                    {trustLevel.label}
                                                </span>
                                            </div>
                                            <span className="text-sm font-bold text-white">{trustScore}%</span>
                                        </div>
                                        <div className="w-full h-2 bg-slate-600 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full ${trustLevel.bg} transition-all duration-500`}
                                                style={{ width: `${trustScore}%` }}
                                            />
                                        </div>
                                        {trustScore < 60 && (
                                            <p className="text-xs text-gray-400 mt-2">
                                                {language === 'th'
                                                    ? '💡 เพิ่มข้อมูลเพื่อให้ผู้ซื้อเชื่อมั่นมากขึ้น'
                                                    : '💡 Add more details to build buyer trust'}
                                            </p>
                                        )}
                                    </div>

                                    {/* Quick Info Grid */}
                                    <div className="grid grid-cols-2 gap-3 mb-4">
                                        {/* Mileage */}
                                        <div className="bg-slate-700/30 rounded-lg p-3">
                                            <div className="text-xs text-gray-400 mb-1">{t.mileage}</div>
                                            <div className="text-sm font-medium text-white">
                                                {formData.mileage ? `${formatMileage(formData.mileage as string)} ${t.km}` : '---'}
                                            </div>
                                        </div>
                                        {/* Owners */}
                                        <div className="bg-slate-700/30 rounded-lg p-3">
                                            <div className="text-xs text-gray-400 mb-1">{t.owner}</div>
                                            <div className="text-sm font-medium text-white">
                                                {getOptionLabel(
                                                    CAR_TEMPLATE.sections.find(s => s.id === 'mileage_usage')?.fields.find(f => f.key === 'owners')?.options,
                                                    formData.owners as string, language) || '---'}
                                            </div>
                                        </div>
                                        {/* Body Type */}
                                        <div className="bg-slate-700/30 rounded-lg p-3">
                                            <div className="text-xs text-gray-400 mb-1">{t.bodyType}</div>
                                            <div className="text-sm font-medium text-white">
                                                {getOptionLabel(
                                                    CAR_TEMPLATE.sections.find(s => s.id === 'car_info')?.fields.find(f => f.key === 'body_type')?.options,
                                                    formData.body_type as string, language) || '---'}
                                            </div>
                                        </div>
                                        {/* Color */}
                                        <div className="bg-slate-700/30 rounded-lg p-3">
                                            <div className="text-xs text-gray-400 mb-1">{t.color}</div>
                                            <div className="text-sm font-medium text-white">
                                                {getOptionLabel(
                                                    CAR_TEMPLATE.sections.find(s => s.id === 'car_info')?.fields.find(f => f.key === 'color')?.options,
                                                    formData.color as string, language) || '---'}
                                            </div>
                                        </div>
                                        {/* Fuel */}
                                        <div className="bg-slate-700/30 rounded-lg p-3">
                                            <div className="text-xs text-gray-400 mb-1">{t.fuel}</div>
                                            <div className="text-sm font-medium text-white">
                                                {getOptionLabel(
                                                    CAR_TEMPLATE.sections.find(s => s.id === 'specs')?.fields.find(f => f.key === 'fuel_type')?.options,
                                                    formData.fuel_type as string, language) || '---'}
                                            </div>
                                        </div>
                                        {/* Transmission */}
                                        <div className="bg-slate-700/30 rounded-lg p-3">
                                            <div className="text-xs text-gray-400 mb-1">{t.transmission}</div>
                                            <div className="text-sm font-medium text-white">
                                                {getOptionLabel(
                                                    CAR_TEMPLATE.sections.find(s => s.id === 'specs')?.fields.find(f => f.key === 'transmission')?.options,
                                                    formData.transmission as string, language) || '---'}
                                            </div>
                                        </div>
                                        {/* Engine Size */}
                                        <div className="bg-slate-700/30 rounded-lg p-3">
                                            <div className="text-xs text-gray-400 mb-1">{t.engine}</div>
                                            <div className="text-sm font-medium text-white">
                                                {getOptionLabel(
                                                    CAR_TEMPLATE.sections.find(s => s.id === 'specs')?.fields.find(f => f.key === 'engine_cc')?.options,
                                                    formData.engine_cc as string, language) || '---'}
                                            </div>
                                        </div>
                                        {/* Tire Condition */}
                                        <div className="bg-slate-700/30 rounded-lg p-3">
                                            <div className="text-xs text-gray-400 mb-1">{t.tires}</div>
                                            <div className="text-sm font-medium text-white">
                                                {getOptionLabel(
                                                    CAR_TEMPLATE.sections.find(s => s.id === 'condition_history')?.fields.find(f => f.key === 'tire_condition')?.options,
                                                    formData.tire_condition as string, language) || '---'}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Registration Province */}
                                    {formData.reg_province && (
                                        <div className="flex items-center gap-2 mb-4 text-sm">
                                            <span className="text-gray-400">📍 {language === 'th' ? 'จดทะเบียน:' : 'Registered:'}</span>
                                            <span className="text-white font-medium">{formData.reg_province}</span>
                                        </div>
                                    )}

                                    {/* Registration Info Row */}
                                    {(formData.registration || formData.spare_keys || formData.insurance_type) && (
                                        <div className="flex flex-wrap gap-2 mb-4">
                                            {formData.registration && (
                                                <span className="px-3 py-1 rounded-full text-xs font-medium bg-slate-700/50 text-gray-300">
                                                    {t.registration} {getOptionLabel(
                                                        CAR_TEMPLATE.sections.find(s => s.id === 'registration')?.fields.find(f => f.key === 'registration')?.options,
                                                        formData.registration as string, language)}
                                                </span>
                                            )}
                                            {formData.spare_keys && (
                                                <span className="px-3 py-1 rounded-full text-xs font-medium bg-slate-700/50 text-gray-300">
                                                    {getOptionLabel(
                                                        CAR_TEMPLATE.sections.find(s => s.id === 'registration')?.fields.find(f => f.key === 'spare_keys')?.options,
                                                        formData.spare_keys as string, language)}
                                                </span>
                                            )}
                                            {/* 🆕 Insurance Badge */}
                                            {formData.insurance_type && (
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${formData.insurance_type === 'class1' ? 'bg-green-500/20 text-green-400' :
                                                    formData.insurance_type === 'none' || formData.insurance_type === 'expired' ? 'bg-red-500/20 text-red-400' :
                                                        'bg-blue-500/20 text-blue-400'
                                                    }`}>
                                                    {getOptionLabel(
                                                        CAR_TEMPLATE.sections.find(s => s.id === 'registration')?.fields.find(f => f.key === 'insurance_type')?.options,
                                                        formData.insurance_type as string, language)}
                                                </span>
                                            )}
                                        </div>
                                    )}

                                    {/* 🆕 Service & Modification Badges */}
                                    {(formData.service_history || formData.modification_status || formData.trade_in) && (
                                        <div className="flex flex-wrap gap-2 mb-4">
                                            {formData.service_history && (
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${formData.service_history === 'dealer' ? 'bg-green-500/20 text-green-400' :
                                                    'bg-slate-700/50 text-gray-300'
                                                    }`}>
                                                    {getOptionLabel(
                                                        CAR_TEMPLATE.sections.find(s => s.id === 'extras')?.fields.find(f => f.key === 'service_history')?.options,
                                                        formData.service_history as string, language)}
                                                </span>
                                            )}
                                            {formData.modification_status && (
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${formData.modification_status === 'stock' ? 'bg-green-500/20 text-green-400' :
                                                    formData.modification_status === 'full' ? 'bg-orange-500/20 text-orange-400' :
                                                        'bg-slate-700/50 text-gray-300'
                                                    }`}>
                                                    {getOptionLabel(
                                                        CAR_TEMPLATE.sections.find(s => s.id === 'extras')?.fields.find(f => f.key === 'modification_status')?.options,
                                                        formData.modification_status as string, language)}
                                                </span>
                                            )}
                                            {formData.trade_in === 'yes' && (
                                                <span className="px-3 py-1 rounded-full text-xs font-medium bg-purple-500/20 text-purple-400">
                                                    🔄 {language === 'th' ? 'รับแลกเปลี่ยน' : 'Trade-in OK'}
                                                </span>
                                            )}
                                        </div>
                                    )}

                                    {/* Condition Badges */}
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {formData.accident_history && (
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${formData.accident_history === 'none' ? 'bg-green-500/20 text-green-400' :
                                                formData.accident_history === 'minor' ? 'bg-yellow-500/20 text-yellow-400' :
                                                    'bg-red-500/20 text-red-400'
                                                }`}>
                                                {getOptionLabel(
                                                    CAR_TEMPLATE.sections.find(s => s.id === 'condition_history')?.fields.find(f => f.key === 'accident_history')?.options,
                                                    formData.accident_history as string, language)}
                                            </span>
                                        )}
                                        {formData.flood_history && (
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${formData.flood_history === 'none' ? 'bg-green-500/20 text-green-400' :
                                                formData.flood_history === 'partial' ? 'bg-yellow-500/20 text-yellow-400' :
                                                    'bg-red-500/20 text-red-400'
                                                }`}>
                                                {getOptionLabel(
                                                    CAR_TEMPLATE.sections.find(s => s.id === 'condition_history')?.fields.find(f => f.key === 'flood_history')?.options,
                                                    formData.flood_history as string, language)}
                                            </span>
                                        )}
                                        {formData.tax_status && (
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-400`}>
                                                {getOptionLabel(
                                                    CAR_TEMPLATE.sections.find(s => s.id === 'registration')?.fields.find(f => f.key === 'tax_status')?.options,
                                                    formData.tax_status as string, language)}
                                            </span>
                                        )}
                                        {formData.book_status && (
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium bg-purple-500/20 text-purple-400`}>
                                                {getOptionLabel(
                                                    CAR_TEMPLATE.sections.find(s => s.id === 'registration')?.fields.find(f => f.key === 'book_status')?.options,
                                                    formData.book_status as string, language)}
                                            </span>
                                        )}
                                    </div>

                                    {/* Included Items */}
                                    {(formData.included_items as string[])?.length > 0 && (
                                        <div className="mb-4">
                                            <div className="text-xs text-gray-400 mb-2">{t.includedItems}</div>
                                            <div className="flex flex-wrap gap-2">
                                                {(formData.included_items as string[]).map(item => (
                                                    <span key={item} className="px-2 py-1 bg-slate-700/50 rounded text-xs text-gray-300">
                                                        {getOptionLabel(
                                                            CAR_TEMPLATE.sections.find(s => s.id === 'extras')?.fields.find(f => f.key === 'included_items')?.options,
                                                            item, language
                                                        )}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Selling Reason */}
                                    {formData.selling_reason && (
                                        <div className="mb-4 p-3 bg-slate-700/30 rounded-lg">
                                            <div className="text-xs text-gray-400 mb-1">{t.sellingReason}</div>
                                            <div className="text-sm font-medium text-white">
                                                {getOptionLabel(
                                                    CAR_TEMPLATE.sections.find(s => s.id === 'extras')?.fields.find(f => f.key === 'selling_reason')?.options,
                                                    formData.selling_reason as string, language)}
                                            </div>
                                        </div>
                                    )}

                                    {/* Finance Info */}
                                    {formData.finance_available && (
                                        <div className="p-3 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-lg border border-green-500/20">
                                            <div className="text-sm font-medium text-green-400">
                                                💰 {getOptionLabel(
                                                    CAR_TEMPLATE.sections.find(s => s.id === 'payment_options')?.fields.find(f => f.key === 'finance_available')?.options,
                                                    formData.finance_available as string, language)}
                                            </div>
                                        </div>
                                    )}

                                    {/* Meeting Location */}
                                    {(formData.meeting_province || formData.meeting_amphoe || formData.meeting_landmark) && (
                                        <div className="mt-4 p-4 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 rounded-lg border border-blue-500/20">
                                            <div className="text-xs text-blue-400 mb-2 flex items-center gap-1">
                                                <span>📍</span> {t.meetingLocation}
                                            </div>
                                            <div className="text-sm text-white">
                                                {/* แสดงจังหวัดและอำเภอโดยตรง (ค่าเป็นภาษาไทยอยู่แล้ว) */}
                                                {formData.meeting_province && (
                                                    <span className="font-medium">{formData.meeting_province as string}</span>
                                                )}
                                                {formData.meeting_amphoe && (
                                                    <span className="text-gray-400"> / {formData.meeting_amphoe as string}</span>
                                                )}
                                            </div>
                                            {formData.meeting_landmark && (
                                                <div className="text-sm text-gray-300 mt-1">
                                                    🏪 {formData.meeting_landmark}
                                                </div>
                                            )}
                                            {(formData.meeting_preference as string[])?.length > 0 && (
                                                <div className="flex flex-wrap gap-1 mt-2">
                                                    {(formData.meeting_preference as string[]).map(time => (
                                                        <span key={time} className="px-2 py-0.5 bg-blue-500/20 rounded text-xs text-blue-300">
                                                            {getOptionLabel(
                                                                CAR_TEMPLATE.sections.find(s => s.id === 'meeting_location')?.fields.find(f => f.key === 'meeting_preference')?.options,
                                                                time, language
                                                            )}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                            {formData.delivery_option && (
                                                <div className="text-sm text-emerald-400 mt-2">
                                                    {getOptionLabel(
                                                        CAR_TEMPLATE.sections.find(s => s.id === 'meeting_location')?.fields.find(f => f.key === 'delivery_option')?.options,
                                                        formData.delivery_option as string, language
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* Additional Description */}
                                    {formData.additional_description && (formData.additional_description as string).trim() && (
                                        <div className="mt-4 p-4 bg-slate-700/30 rounded-lg border border-white/5">
                                            <div className="text-xs text-gray-400 mb-2 flex items-center gap-1">
                                                <span>📝</span> {language === 'th' ? 'รายละเอียดเพิ่มเติม' : 'Additional Details'}
                                            </div>
                                            <div className="text-sm text-gray-300 whitespace-pre-wrap leading-relaxed">
                                                {formData.additional_description as string}
                                            </div>
                                        </div>
                                    )}

                                    {/* 🆕 Contact Info */}
                                    {(formData.contact_phone || formData.contact_line) && (
                                        <div className="mt-4 p-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-lg border border-purple-500/20">
                                            <div className="text-xs text-purple-400 mb-2 flex items-center gap-1">
                                                <span>📞</span> {language === 'th' ? 'ช่องทางติดต่อ' : 'Contact Info'}
                                            </div>
                                            <div className="flex flex-wrap gap-3">
                                                {formData.contact_phone && (
                                                    <div className="flex items-center gap-1.5 text-sm text-white">
                                                        <span>📞</span> {formData.contact_phone}
                                                    </div>
                                                )}
                                                {formData.contact_line && (
                                                    <div className="flex items-center gap-1.5 text-sm text-green-400">
                                                        <span>💚</span> LINE: {formData.contact_line}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Action Buttons */}
                                <div className="p-5 border-t border-white/10 bg-slate-900/50">
                                    <button
                                        onClick={handlePublishListing}
                                        disabled={completionPercentage < 100 || isPublishing}
                                        className={`w-full py-3 rounded-xl font-semibold text-white transition-all ${completionPercentage >= 100
                                            ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-lg shadow-purple-500/25'
                                            : 'bg-gray-600 cursor-not-allowed'
                                            }`}
                                    >
                                        {isPublishing
                                            ? (language === 'th' ? '⏳ กำลังลงประกาศ...' : '⏳ Publishing...')
                                            : completionPercentage >= 100
                                                ? t.postListing
                                                : `${t.fillMore} ${100 - completionPercentage}% ${t.remaining}`
                                        }
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    )
}

// Export with Suspense wrapper for useSearchParams
export default function CarListingPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-slate-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-400">กำลังโหลดฟอร์มลงขายรถ...</p>
                </div>
            </div>
        }>
            <CarListingDemo />
        </Suspense>
    )
}
