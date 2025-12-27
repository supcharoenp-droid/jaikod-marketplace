/**
 * 📱 Mobile & Tablets Listing Templates
 * 
 * Comprehensive templates for mobile device listings
 * Based on Buyer/Seller Psychology Analysis
 */

import { ListingTemplate, FieldType, COMMON_FIELDS } from './types'

// ============================================
// MOBILE PHONE TEMPLATE
// ============================================

export const MOBILE_PHONE_TEMPLATE: ListingTemplate = {
    categoryId: 3,
    categorySlug: 'mobiles',
    subcategoryId: 301,
    subcategorySlug: 'mobile-phones',
    name_th: 'ลงขายโทรศัพท์มือถือ',
    name_en: 'Sell Mobile Phone',
    icon: '📱',

    fields: [
        // ========== BASIC INFO ==========
        {
            ...COMMON_FIELDS.title,
            placeholder_th: 'เช่น iPhone 15 Pro Max 256GB สี Natural Titanium',
            placeholder_en: 'e.g., iPhone 15 Pro Max 256GB Natural Titanium',
            group: 'basic',
        },
        {
            ...COMMON_FIELDS.description,
            helperText_th: '💡 บอกรายละเอียดเพิ่ม เช่น สาเหตุที่ขาย ประวัติการใช้งาน',
            helperText_en: '💡 Add details like reason for selling, usage history',
            group: 'basic',
        },

        // ========== DEVICE SPECS (Critical Fields) ==========
        {
            id: 'brand',
            name_th: 'แบรนด์',
            name_en: 'Brand',
            type: 'select' as FieldType,
            required: true,
            options: [
                { value: 'apple', label_th: 'Apple (iPhone)', label_en: 'Apple (iPhone)' },
                { value: 'samsung', label_th: 'Samsung', label_en: 'Samsung' },
                { value: 'xiaomi', label_th: 'Xiaomi (Redmi/POCO)', label_en: 'Xiaomi (Redmi/POCO)' },
                { value: 'oppo', label_th: 'OPPO', label_en: 'OPPO' },
                { value: 'vivo', label_th: 'Vivo', label_en: 'Vivo' },
                { value: 'realme', label_th: 'Realme', label_en: 'Realme' },
                { value: 'huawei', label_th: 'Huawei', label_en: 'Huawei' },
                { value: 'google', label_th: 'Google Pixel', label_en: 'Google Pixel' },
                { value: 'oneplus', label_th: 'OnePlus', label_en: 'OnePlus' },
                { value: 'asus', label_th: 'ASUS (ROG Phone)', label_en: 'ASUS (ROG Phone)' },
                { value: 'nothing', label_th: 'Nothing', label_en: 'Nothing' },
                { value: 'nokia', label_th: 'Nokia', label_en: 'Nokia' },
                { value: 'sony', label_th: 'Sony', label_en: 'Sony' },
                { value: 'other', label_th: 'อื่นๆ', label_en: 'Other' },
            ],
            group: 'specs',
            helperText_th: '🎯 แบรนด์ยอดนิยม: Apple, Samsung ขายได้เร็วที่สุด',
            helperText_en: '🎯 Popular: Apple, Samsung sell fastest',
        },
        {
            id: 'model',
            name_th: 'รุ่น',
            name_en: 'Model',
            type: 'text' as FieldType,
            required: true,
            placeholder_th: 'เช่น iPhone 15 Pro Max, Galaxy S24 Ultra',
            placeholder_en: 'e.g., iPhone 15 Pro Max, Galaxy S24 Ultra',
            group: 'specs',
            helperText_th: '💡 ระบุรุ่นให้ชัดเจน เช่น "iPhone 15 Pro" ไม่ใช่แค่ "iPhone"',
            helperText_en: '💡 Be specific, e.g., "iPhone 15 Pro" not just "iPhone"',
        },
        {
            id: 'storage',
            name_th: 'ความจุ',
            name_en: 'Storage',
            type: 'select' as FieldType,
            required: true,
            options: [
                { value: '16gb', label_th: '16 GB', label_en: '16 GB' },
                { value: '32gb', label_th: '32 GB', label_en: '32 GB' },
                { value: '64gb', label_th: '64 GB', label_en: '64 GB' },
                { value: '128gb', label_th: '128 GB', label_en: '128 GB' },
                { value: '256gb', label_th: '256 GB', label_en: '256 GB' },
                { value: '512gb', label_th: '512 GB', label_en: '512 GB' },
                { value: '1tb', label_th: '1 TB', label_en: '1 TB' },
            ],
            group: 'specs',
            helperText_th: '📊 ความจุสูง = ราคาสูงกว่า 10-20%',
            helperText_en: '📊 Higher storage = 10-20% higher price',
        },
        {
            id: 'color',
            name_th: 'สี',
            name_en: 'Color',
            type: 'text' as FieldType,
            required: true,
            placeholder_th: 'เช่น Space Black, Natural Titanium, Deep Purple',
            placeholder_en: 'e.g., Space Black, Natural Titanium, Deep Purple',
            group: 'specs',
        },
        {
            id: 'ram',
            name_th: 'RAM',
            name_en: 'RAM',
            type: 'select' as FieldType,
            required: false,
            options: [
                { value: '2gb', label_th: '2 GB', label_en: '2 GB' },
                { value: '3gb', label_th: '3 GB', label_en: '3 GB' },
                { value: '4gb', label_th: '4 GB', label_en: '4 GB' },
                { value: '6gb', label_th: '6 GB', label_en: '6 GB' },
                { value: '8gb', label_th: '8 GB', label_en: '8 GB' },
                { value: '12gb', label_th: '12 GB', label_en: '12 GB' },
                { value: '16gb', label_th: '16 GB', label_en: '16 GB' },
            ],
            group: 'specs',
            helperText_th: 'iPhone ไม่ต้องระบุ / Android ระบุจะช่วยขาย',
            helperText_en: 'Skip for iPhone / Android buyers look for this',
        },

        // ========== CONDITION (Critical) ==========
        {
            id: 'battery_health',
            name_th: 'สุขภาพแบตเตอรี่',
            name_en: 'Battery Health',
            type: 'select' as FieldType,
            required: true,
            options: [
                { value: '100', label_th: '100% (ใหม่/เปลี่ยนใหม่)', label_en: '100% (New/Replaced)' },
                { value: '95-99', label_th: '95-99% (ดีมาก)', label_en: '95-99% (Excellent)' },
                { value: '90-94', label_th: '90-94% (ดี)', label_en: '90-94% (Good)' },
                { value: '85-89', label_th: '85-89% (ปกติ)', label_en: '85-89% (Normal)' },
                { value: '80-84', label_th: '80-84% (ควรเปลี่ยน)', label_en: '80-84% (Should Replace)' },
                { value: 'below_80', label_th: 'ต่ำกว่า 80%', label_en: 'Below 80%' },
                { value: 'replaced', label_th: 'เปลี่ยนแบตใหม่แล้ว', label_en: 'Battery Replaced' },
                { value: 'unknown', label_th: 'ไม่ทราบ (Android)', label_en: 'Unknown (Android)' },
            ],
            group: 'condition',
            helperText_th: '🔋 แบต 90%+ ขายได้ราคาดี | 85%+ ยังใช้ได้ปกติ',
            helperText_en: '🔋 90%+ sells well | 85%+ still usable',
        },
        {
            id: 'screen_condition',
            name_th: 'สภาพหน้าจอ',
            name_en: 'Screen Condition',
            type: 'select' as FieldType,
            required: true,
            options: [
                { value: 'perfect', label_th: 'สมบูรณ์แบบ ไม่มีรอยเลย', label_en: 'Perfect, No Scratches' },
                { value: 'excellent', label_th: 'ดีมาก รอยเล็กน้อยมองไม่เห็น', label_en: 'Excellent, Invisible Minor Marks' },
                { value: 'good', label_th: 'ดี มีรอยบ้างไม่กระทบใช้งาน', label_en: 'Good, Minor Scratches' },
                { value: 'fair', label_th: 'พอใช้ มีรอยชัดเจน', label_en: 'Fair, Visible Scratches' },
                { value: 'cracked', label_th: 'จอแตก/ร้าว', label_en: 'Cracked/Damaged' },
            ],
            group: 'condition',
            helperText_th: '📱 หน้าจอสมบูรณ์ = ราคาดีกว่า 15-20%',
            helperText_en: '📱 Perfect screen = 15-20% higher price',
        },
        {
            id: 'body_condition',
            name_th: 'สภาพตัวเครื่อง (ฝาหลัง/ขอบ)',
            name_en: 'Body Condition (Back/Frame)',
            type: 'select' as FieldType,
            required: true,
            options: [
                { value: 'new', label_th: 'ใหม่ ยังไม่แกะซีล', label_en: 'New, Sealed' },
                { value: 'like_new', label_th: 'ใหม่มาก ไม่มีรอย', label_en: 'Like New, No Marks' },
                { value: 'excellent', label_th: 'ดีเยี่ยม รอยเล็กน้อย', label_en: 'Excellent, Minor Marks' },
                { value: 'good', label_th: 'ดี มีรอยใช้งานบ้าง', label_en: 'Good, Normal Wear' },
                { value: 'fair', label_th: 'พอใช้ มีรอยชัดเจน', label_en: 'Fair, Visible Wear' },
                { value: 'dented', label_th: 'มีรอยบุบ/งอ', label_en: 'Dented/Bent' },
            ],
            group: 'condition',
        },

        // ========== NETWORK & STATUS ==========
        {
            id: 'network_status',
            name_th: 'สถานะเครื่อง',
            name_en: 'Network Status',
            type: 'select' as FieldType,
            required: true,
            options: [
                { value: 'unlocked', label_th: 'ปลดล็อคแล้ว ใช้ได้ทุกค่าย', label_en: 'Unlocked, All Carriers' },
                { value: 'ais', label_th: 'ติดล็อค AIS', label_en: 'Locked to AIS' },
                { value: 'true', label_th: 'ติดล็อค True', label_en: 'Locked to True' },
                { value: 'dtac', label_th: 'ติดล็อค Dtac', label_en: 'Locked to Dtac' },
                { value: 'installment', label_th: 'ติดสัญญา/ผ่อนอยู่', label_en: 'Under Contract' },
            ],
            group: 'status',
            helperText_th: '⚠️ เครื่องปลดล็อคขายได้ราคาดีกว่า',
            helperText_en: '⚠️ Unlocked devices sell for higher prices',
        },
        {
            id: 'icloud_status',
            name_th: 'สถานะ iCloud/Google Account',
            name_en: 'iCloud/Google Account Status',
            type: 'select' as FieldType,
            required: true,
            options: [
                { value: 'logged_out', label_th: 'ออกจากระบบแล้ว (พร้อมขาย)', label_en: 'Logged Out (Ready)' },
                { value: 'will_logout', label_th: 'จะออกให้ตอนส่งมอบ', label_en: 'Will Logout on Delivery' },
            ],
            group: 'status',
            helperText_th: '🔐 สำคัญมาก! ต้องออกจาก iCloud/Google ก่อนขาย',
            helperText_en: '🔐 Critical! Must logout before selling',
        },

        // ========== PRICING ==========
        {
            ...COMMON_FIELDS.price,
            group: 'pricing',
            helperText_th: '💰 ราคาที่เหมาะสมจะช่วยให้ขายได้เร็วขึ้น',
            helperText_en: '💰 Fair pricing helps sell faster',
        },
        {
            ...COMMON_FIELDS.negotiable,
            group: 'pricing',
        },

        // ========== TRUST BUILDERS ==========
        {
            id: 'warranty',
            name_th: 'ประกัน',
            name_en: 'Warranty',
            type: 'select' as FieldType,
            required: false,
            options: [
                { value: 'none', label_th: 'ไม่มีประกัน', label_en: 'No Warranty' },
                { value: 'applecare', label_th: 'AppleCare+', label_en: 'AppleCare+' },
                { value: 'brand_3m', label_th: 'ประกันศูนย์ เหลือ 3 เดือน', label_en: 'Brand 3 months' },
                { value: 'brand_6m', label_th: 'ประกันศูนย์ เหลือ 6 เดือน', label_en: 'Brand 6 months' },
                { value: 'brand_1y', label_th: 'ประกันศูนย์ เหลือ 1 ปี', label_en: 'Brand 1 year' },
                { value: 'store', label_th: 'ประกันร้าน', label_en: 'Store Warranty' },
                { value: 'expired', label_th: 'หมดประกันแล้ว', label_en: 'Expired' },
            ],
            group: 'trust',
            helperText_th: '🛡️ มีประกัน = เพิ่มความมั่นใจ ขายได้เร็ว',
            helperText_en: '🛡️ Warranty = More confidence, sells faster',
        },
        {
            id: 'has_receipt',
            name_th: 'มีใบเสร็จ/ใบรับประกัน',
            name_en: 'Has Receipt/Warranty Card',
            type: 'checkbox' as FieldType,
            required: false,
            group: 'trust',
        },
        {
            id: 'accessories',
            name_th: 'อุปกรณ์ที่มี',
            name_en: 'Included Accessories',
            type: 'multi-select' as FieldType,
            required: false,
            options: [
                { value: 'box', label_th: '📦 กล่อง', label_en: '📦 Box' },
                { value: 'charger', label_th: '🔌 สายชาร์จ', label_en: '🔌 Cable' },
                { value: 'adapter', label_th: '🔋 หัวชาร์จ', label_en: '🔋 Adapter' },
                { value: 'earphones', label_th: '🎧 หูฟัง', label_en: '🎧 Earphones' },
                { value: 'case', label_th: '📱 เคส', label_en: '📱 Case' },
                { value: 'screen_protector', label_th: '🖼️ ฟิล์ม', label_en: '🖼️ Screen Protector' },
            ],
            group: 'trust',
            helperText_th: '🎁 ครบกล่อง = ราคาดีกว่า 5-10%',
            helperText_en: '🎁 Complete box = 5-10% higher price',
        },

        // ========== ISSUES DISCLOSURE ==========
        {
            id: 'known_issues',
            name_th: 'ปัญหาที่ทราบ (ถ้ามี)',
            name_en: 'Known Issues (If Any)',
            type: 'multi-select' as FieldType,
            required: false,
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
            group: 'issues',
            helperText_th: '💡 แจ้งปัญหาตรงๆ = ไม่ต้องถกเถียงภายหลัง',
            helperText_en: '💡 Disclosing issues = Avoid disputes later',
        },

        // ========== CONTEXT ==========
        {
            id: 'original_purchase',
            name_th: 'ซื้อจากที่ไหน',
            name_en: 'Original Purchase',
            type: 'select' as FieldType,
            required: false,
            options: [
                { value: 'official', label_th: 'Apple Store / Samsung Store', label_en: 'Official Brand Store' },
                { value: 'authorized', label_th: 'ตัวแทน (iStudio, AIS, True)', label_en: 'Authorized Reseller' },
                { value: 'online', label_th: 'ออนไลน์ (Shopee, Lazada)', label_en: 'Online Store' },
                { value: 'secondhand', label_th: 'มือสอง', label_en: 'Secondhand' },
                { value: 'gift', label_th: 'ได้รับเป็นของขวัญ', label_en: 'Gift' },
            ],
            group: 'context',
        },
        {
            id: 'selling_reason',
            name_th: 'สาเหตุที่ขาย',
            name_en: 'Reason for Selling',
            type: 'select' as FieldType,
            required: false,
            options: [
                { value: 'upgrade', label_th: 'เปลี่ยนรุ่นใหม่', label_en: 'Upgrading' },
                { value: 'switch', label_th: 'เปลี่ยนแบรนด์', label_en: 'Switching Brands' },
                { value: 'extra', label_th: 'เครื่องสำรอง ไม่ได้ใช้', label_en: 'Extra, Not Using' },
                { value: 'need_money', label_th: 'ต้องการเงินสด', label_en: 'Need Cash' },
            ],
            group: 'context',
            helperText_th: '📝 ระบุเหตุผล สร้างความน่าเชื่อถือ',
            helperText_en: '📝 Stating reason builds trust',
        },

        // ========== LOCATION ==========
        {
            ...COMMON_FIELDS.location,
            group: 'location',
        },
    ],

    fieldGroups: [
        { id: 'basic', name_th: '📝 ข้อมูลพื้นฐาน', name_en: '📝 Basic Info', fields: ['title', 'description'] },
        { id: 'specs', name_th: '📱 ข้อมูลเครื่อง', name_en: '📱 Device Specs', fields: ['brand', 'model', 'storage', 'color', 'ram'] },
        { id: 'condition', name_th: '🔍 สภาพเครื่อง', name_en: '🔍 Condition', fields: ['battery_health', 'screen_condition', 'body_condition'] },
        { id: 'status', name_th: '📶 สถานะเครื่อง', name_en: '📶 Device Status', fields: ['network_status', 'icloud_status'] },
        { id: 'pricing', name_th: '💰 ราคา', name_en: '💰 Pricing', fields: ['price', 'negotiable'] },
        { id: 'trust', name_th: '🛡️ ความน่าเชื่อถือ', name_en: '🛡️ Trust Builders', fields: ['warranty', 'has_receipt', 'accessories'] },
        { id: 'issues', name_th: '⚠️ ปัญหา (ถ้ามี)', name_en: '⚠️ Known Issues', fields: ['known_issues'], collapsible: true },
        { id: 'context', name_th: '📋 ข้อมูลเพิ่มเติม', name_en: '📋 Additional Info', fields: ['original_purchase', 'selling_reason'], collapsible: true },
        { id: 'location', name_th: '📍 ที่อยู่', name_en: '📍 Location', fields: ['location'] },
    ],

    requiredImages: 2,
    maxImages: 10,

    aiPriceEstimation: true,
    aiDescriptionPrompt: 'Generate description for mobile phone: {brand} {model} {storage} {color}, battery {battery_health}, screen {screen_condition}, body {body_condition}',

    titleTemplate_th: '{brand} {model} {storage} {color}',
    titleTemplate_en: '{brand} {model} {storage} {color}',
}

// ============================================
// TABLET TEMPLATE
// ============================================

export const TABLET_TEMPLATE: ListingTemplate = {
    ...MOBILE_PHONE_TEMPLATE,
    subcategoryId: 302,
    subcategorySlug: 'tablets',
    name_th: 'ลงขายแท็บเล็ต',
    name_en: 'Sell Tablet',
    icon: '📲',

    // Override specific fields for tablets
    fields: MOBILE_PHONE_TEMPLATE.fields.map(field => {
        if (field.id === 'brand') {
            return {
                ...field,
                options: [
                    { value: 'apple', label_th: 'Apple (iPad)', label_en: 'Apple (iPad)' },
                    { value: 'samsung', label_th: 'Samsung Galaxy Tab', label_en: 'Samsung Galaxy Tab' },
                    { value: 'xiaomi', label_th: 'Xiaomi Pad', label_en: 'Xiaomi Pad' },
                    { value: 'huawei', label_th: 'Huawei MatePad', label_en: 'Huawei MatePad' },
                    { value: 'lenovo', label_th: 'Lenovo Tab', label_en: 'Lenovo Tab' },
                    { value: 'microsoft', label_th: 'Microsoft Surface', label_en: 'Microsoft Surface' },
                    { value: 'other', label_th: 'อื่นๆ', label_en: 'Other' },
                ],
            }
        }
        if (field.id === 'model') {
            return {
                ...field,
                placeholder_th: 'เช่น iPad Pro 12.9 M2, Galaxy Tab S9 Ultra',
                placeholder_en: 'e.g., iPad Pro 12.9 M2, Galaxy Tab S9 Ultra',
            }
        }
        // Remove network_status for tablets (WiFi-only options common)
        if (field.id === 'network_status') {
            return {
                ...field,
                options: [
                    { value: 'wifi_only', label_th: 'WiFi Only', label_en: 'WiFi Only' },
                    { value: 'wifi_cellular', label_th: 'WiFi + Cellular', label_en: 'WiFi + Cellular' },
                    { value: 'unlocked', label_th: 'ปลดล็อค ใช้ได้ทุกค่าย', label_en: 'Unlocked' },
                ],
            }
        }
        return field
    }),
}
