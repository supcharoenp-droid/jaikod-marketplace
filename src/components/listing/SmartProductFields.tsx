'use client'

/**
 * SmartProductFields - Dynamic Fields by Product Type
 * 
 * หลักการ:
 * - แค่ 2-3 ฟิลด์หลักให้กรอก
 * - "แสดงเพิ่มเติม" สำหรับฟิลด์เพิ่มเติม
 * - เปลี่ยนตามชนิดสินค้า
 * - ช่วยผู้ขายกรอกข้อมูลที่ผู้ซื้ออยากรู้
 */

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, ChevronUp, Sparkles, Info } from 'lucide-react'

// ========================================
// TYPES
// ========================================

interface ProductField {
    key: string
    label: string
    placeholder: string
    type: 'text' | 'select' | 'number'
    options?: { value: string; label: string }[]
    essential: boolean  // true = แสดงเสมอ, false = อยู่ใน "แสดงเพิ่มเติม"
    aiSuggestion?: string
}

interface ProductFieldConfig {
    title: string
    subtitle: string
    icon: string
    fields: ProductField[]
}

interface SmartProductFieldsProps {
    categoryId: number
    subcategoryId?: number
    values: Record<string, string>
    onChange: (key: string, value: string) => void
    language?: 'th' | 'en'
}

// ========================================
// PRODUCT FIELD CONFIGURATIONS
// ========================================

const FIELD_CONFIGS: Record<number, ProductFieldConfig> = {
    // 💻 Computer / Laptop (categoryId: 4)
    4: {
        title: 'ข้อมูลโน๊ตบุ๊ค/คอมพิวเตอร์',
        subtitle: 'ระบุ CPU/RAM/SSD เพื่อผู้ซื้อตัดสินใจง่าย',
        icon: '💻',
        fields: [
            { key: 'brand', label: 'ยี่ห้อ/แบรนด์', placeholder: 'เช่น Apple, Asus, Lenovo, HP', type: 'text', essential: true, aiSuggestion: 'คำแนะนำ' },
            { key: 'model', label: 'รุ่น', placeholder: 'เช่น MacBook Air M2, Aspire 5', type: 'text', essential: true, aiSuggestion: 'คำแนะนำ' },
            {
                key: 'condition', label: 'สภาพสินค้า', placeholder: '', type: 'select', essential: true, aiSuggestion: 'คำแนะนำ', options: [
                    { value: 'new', label: 'ใหม่ ยังไม่แกะกล่อง' },
                    { value: 'like_new', label: 'เหมือนใหม่ ใช้น้อยมาก' },
                    { value: 'good', label: 'ดี มีรอยบ้างเล็กน้อย' },
                    { value: 'fair', label: 'พอใช้' }
                ]
            },
            { key: 'cpu', label: 'CPU', placeholder: 'เช่น Intel Core i5-1135G7, AMD Ryzen 5', type: 'text', essential: false },
            { key: 'ram', label: 'RAM', placeholder: 'เช่น 8GB, 16GB', type: 'text', essential: false },
            { key: 'storage', label: 'SSD/HDD', placeholder: 'เช่น SSD 512GB', type: 'text', essential: false },
            { key: 'screen', label: 'ขนาดจอ', placeholder: 'เช่น 15.6 นิ้ว Full HD', type: 'text', essential: false },
            { key: 'battery', label: 'สภาพแบต', placeholder: 'เช่น แบตอึด 5 ชม.', type: 'text', essential: false },
            { key: 'os', label: 'ระบบ', placeholder: 'เช่น Windows 11, macOS', type: 'text', essential: false }
        ]
    },

    // 🚗 Automotive (categoryId: 1)
    1: {
        title: 'ข้อมูลรถยนต์',
        subtitle: 'ระบุปี/ไมล์/สภาพ ผู้ซื้อตัดสินใจง่าย',
        icon: '🚗',
        fields: [
            { key: 'brand', label: 'ยี่ห้อ', placeholder: 'เช่น Toyota, Honda, Mazda', type: 'text', essential: true, aiSuggestion: 'คำแนะนำ' },
            { key: 'model', label: 'รุ่น/ปี', placeholder: 'เช่น Camry 2.5G ปี 2020', type: 'text', essential: true, aiSuggestion: 'คำแนะนำ' },
            { key: 'mileage', label: 'เลขไมล์', placeholder: 'เช่น 50,000 กม.', type: 'text', essential: true },
            {
                key: 'transmission', label: 'เกียร์', placeholder: '', type: 'select', essential: false, options: [
                    { value: 'auto', label: 'ออโต้' },
                    { value: 'manual', label: 'ธรรมดา' },
                    { value: 'cvt', label: 'CVT' }
                ]
            },
            {
                key: 'fuel', label: 'เชื้อเพลิง', placeholder: '', type: 'select', essential: false, options: [
                    { value: 'gasoline', label: 'เบนซิน' },
                    { value: 'diesel', label: 'ดีเซล' },
                    { value: 'hybrid', label: 'ไฮบริด' },
                    { value: 'electric', label: 'ไฟฟ้า' }
                ]
            },
            { key: 'color', label: 'สี', placeholder: 'เช่น ขาว, ดำ, เทา', type: 'text', essential: false },
            { key: 'province', label: 'จังหวัดจดทะเบียน', placeholder: 'เช่น กรุงเทพฯ', type: 'text', essential: false },
            {
                key: 'ownership', label: 'สถานะ', placeholder: '', type: 'select', essential: false, options: [
                    { value: 'owner', label: 'เจ้าของขายเอง' },
                    { value: 'finance', label: 'ติดไฟแนนซ์' },
                    { value: 'paid', label: 'ปลดไฟแนนซ์แล้ว' }
                ]
            }
        ]
    },

    // 📱 Mobile Phone (categoryId: 3)
    3: {
        title: 'ข้อมูลมือถือ',
        subtitle: 'ระบุความจุ/สุขภาพแบต ผู้ซื้อตัดสินใจง่าย',
        icon: '📱',
        fields: [
            { key: 'brand', label: 'ยี่ห้อ', placeholder: 'เช่น Apple, Samsung, Xiaomi', type: 'text', essential: true, aiSuggestion: 'คำแนะนำ' },
            { key: 'model', label: 'รุ่น', placeholder: 'เช่น iPhone 15 Pro, Galaxy S24', type: 'text', essential: true, aiSuggestion: 'คำแนะนำ' },
            { key: 'storage', label: 'ความจุ', placeholder: 'เช่น 128GB, 256GB', type: 'text', essential: true },
            { key: 'battery_health', label: 'สุขภาพแบต', placeholder: 'เช่น 95%, 88%', type: 'text', essential: false },
            { key: 'color', label: 'สี', placeholder: 'เช่น ดำ, ขาว, ทอง', type: 'text', essential: false },
            {
                key: 'condition', label: 'สภาพ', placeholder: '', type: 'select', essential: false, options: [
                    { value: 'new', label: 'ใหม่ ไม่แกะซีล' },
                    { value: 'like_new', label: 'เหมือนใหม่' },
                    { value: 'good', label: 'ดี มีรอยบ้าง' },
                    { value: 'fair', label: 'พอใช้' }
                ]
            },
            { key: 'warranty', label: 'ประกัน', placeholder: 'เช่น ประกันศูนย์เหลือ 6 เดือน', type: 'text', essential: false },
            { key: 'accessories', label: 'อุปกรณ์', placeholder: 'เช่น กล่องครบ, สายชาร์จ', type: 'text', essential: false }
        ]
    },

    // 🏠 Real Estate (categoryId: 2)
    2: {
        title: 'ข้อมูลอสังหาริมทรัพย์',
        subtitle: 'ระบุพื้นที่/ห้อง/ทำเล ผู้ซื้อตัดสินใจง่าย',
        icon: '🏠',
        fields: [
            {
                key: 'property_type', label: 'ประเภท', placeholder: '', type: 'select', essential: true, options: [
                    { value: 'house', label: 'บ้านเดี่ยว' },
                    { value: 'townhouse', label: 'ทาวน์เฮ้าส์' },
                    { value: 'condo', label: 'คอนโด' },
                    { value: 'land', label: 'ที่ดิน' }
                ]
            },
            { key: 'area', label: 'พื้นที่', placeholder: 'เช่น 35 ตร.ม., 50 ตร.วา', type: 'text', essential: true },
            { key: 'bedrooms', label: 'ห้องนอน', placeholder: 'เช่น 2 ห้อง', type: 'text', essential: true },
            { key: 'bathrooms', label: 'ห้องน้ำ', placeholder: 'เช่น 1 ห้อง', type: 'text', essential: false },
            { key: 'floor', label: 'ชั้น', placeholder: 'เช่น ชั้น 15, 2 ชั้น', type: 'text', essential: false },
            { key: 'project', label: 'โครงการ/หมู่บ้าน', placeholder: 'เช่น เดอะเบส', type: 'text', essential: false },
            { key: 'location', label: 'ทำเล', placeholder: 'เช่น ใกล้ BTS อโศก', type: 'text', essential: false },
            {
                key: 'furnishing', label: 'เฟอร์นิเจอร์', placeholder: '', type: 'select', essential: false, options: [
                    { value: 'full', label: 'เฟอร์ครบ' },
                    { value: 'partial', label: 'เฟอร์บางส่วน' },
                    { value: 'none', label: 'ไม่มีเฟอร์' }
                ]
            }
        ]
    },

    // 🔌 Appliances (categoryId: 5)
    5: {
        title: 'ข้อมูลเครื่องใช้ไฟฟ้า',
        subtitle: 'ระบุยี่ห้อ/ขนาด/สภาพ ผู้ซื้อตัดสินใจง่าย',
        icon: '🔌',
        fields: [
            { key: 'brand', label: 'ยี่ห้อ', placeholder: 'เช่น Samsung, LG, Mitsubishi', type: 'text', essential: true, aiSuggestion: 'คำแนะนำ' },
            { key: 'model', label: 'รุ่น', placeholder: 'เช่น RT-250WBM', type: 'text', essential: true },
            { key: 'size', label: 'ขนาด/ความจุ', placeholder: 'เช่น 7 กก., 55 นิ้ว, 12,000 BTU', type: 'text', essential: true },
            {
                key: 'condition', label: 'สภาพ', placeholder: '', type: 'select', essential: false, options: [
                    { value: 'new', label: 'ใหม่' },
                    { value: 'like_new', label: 'เหมือนใหม่' },
                    { value: 'good', label: 'ดี ใช้งานได้ปกติ' },
                    { value: 'fair', label: 'พอใช้' }
                ]
            },
            { key: 'age', label: 'อายุการใช้งาน', placeholder: 'เช่น 2 ปี', type: 'text', essential: false },
            { key: 'energy', label: 'ฉลากประหยัดไฟ', placeholder: 'เช่น เบอร์ 5', type: 'text', essential: false },
            { key: 'warranty', label: 'ประกัน', placeholder: 'เช่น ประกันเหลือ 1 ปี', type: 'text', essential: false }
        ]
    }
}

// Default config
const DEFAULT_CONFIG: ProductFieldConfig = {
    title: 'ข้อมูลสินค้า',
    subtitle: 'ระบุรายละเอียดเพื่อผู้ซื้อตัดสินใจง่าย',
    icon: '📦',
    fields: [
        { key: 'brand', label: 'ยี่ห้อ/แบรนด์', placeholder: 'ระบุยี่ห้อสินค้า', type: 'text', essential: true },
        { key: 'model', label: 'รุ่น', placeholder: 'ระบุรุ่นสินค้า', type: 'text', essential: true },
        {
            key: 'condition', label: 'สภาพ', placeholder: '', type: 'select', essential: true, options: [
                { value: 'new', label: 'ใหม่' },
                { value: 'like_new', label: 'เหมือนใหม่' },
                { value: 'good', label: 'ดี' },
                { value: 'fair', label: 'พอใช้' }
            ]
        }
    ]
}

// ========================================
// MAIN COMPONENT
// ========================================

export default function SmartProductFields({
    categoryId,
    subcategoryId,
    values,
    onChange,
    language = 'th'
}: SmartProductFieldsProps) {
    const [showMore, setShowMore] = useState(false)

    // Get config for category
    const config = useMemo(() => {
        return FIELD_CONFIGS[categoryId] || DEFAULT_CONFIG
    }, [categoryId])

    // Split fields into essential and extra
    const essentialFields = config.fields.filter(f => f.essential)
    const extraFields = config.fields.filter(f => !f.essential)

    // Count filled fields
    const filledCount = config.fields.filter(f => values[f.key]?.trim()).length
    const totalCount = config.fields.length

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <span className="text-lg">{config.icon}</span>
                    <div>
                        <h3 className="text-sm font-medium text-white flex items-center gap-2">
                            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                            {config.title}
                        </h3>
                        <p className="text-xs text-slate-400">{config.subtitle}</p>
                    </div>
                </div>

                {/* Progress */}
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium
                                ${filledCount > 0
                        ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                        : 'bg-slate-700 text-slate-500'
                    }`}>
                    {filledCount}/{totalCount}
                    <span className="ml-1 text-slate-500">กรอกแล้ว</span>
                </span>
            </div>

            {/* Essential Fields */}
            <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    {essentialFields.map(field => (
                        <div key={field.key} className={field.type === 'select' ? 'col-span-1' : 'col-span-1'}>
                            <label className="text-xs text-slate-400 mb-1 flex items-center gap-1">
                                {field.label}
                                <span className="text-slate-600">(ไม่บังคับ)</span>
                                {field.aiSuggestion && (
                                    <button className="ml-1 text-blue-400 hover:text-blue-300 flex items-center gap-0.5">
                                        <Info className="w-3 h-3" />
                                        <span className="text-[10px]">{field.aiSuggestion}</span>
                                    </button>
                                )}
                            </label>

                            {field.type === 'select' ? (
                                <select
                                    value={values[field.key] || ''}
                                    onChange={(e) => onChange(field.key, e.target.value)}
                                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700
                                               focus:border-purple-500 focus:ring-1 focus:ring-purple-500/30
                                               text-white text-sm transition-all outline-none cursor-pointer"
                                >
                                    <option value="">-- เลือก --</option>
                                    {field.options?.map(opt => (
                                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                                    ))}
                                </select>
                            ) : (
                                <input
                                    type={field.type}
                                    value={values[field.key] || ''}
                                    onChange={(e) => onChange(field.key, e.target.value)}
                                    placeholder={field.placeholder}
                                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700
                                               focus:border-purple-500 focus:ring-1 focus:ring-purple-500/30
                                               text-white placeholder-slate-500 text-sm
                                               transition-all outline-none"
                                />
                            )}
                        </div>
                    ))}
                </div>

                {/* Expand Button */}
                {extraFields.length > 0 && (
                    <button
                        onClick={() => setShowMore(!showMore)}
                        className="w-full py-2 text-center text-xs text-slate-400 hover:text-slate-300
                                   border-t border-slate-700/50 flex items-center justify-center gap-1 transition-colors"
                    >
                        {showMore ? (
                            <><ChevronUp className="w-4 h-4" /> ซ่อน ({extraFields.length} ฟิลด์)</>
                        ) : (
                            <><ChevronDown className="w-4 h-4" /> แสดงเพิ่มเติม ({extraFields.length} ฟิลด์)</>
                        )}
                    </button>
                )}

                {/* Extra Fields */}
                <AnimatePresence>
                    {showMore && extraFields.length > 0 && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                        >
                            <div className="pt-4 border-t border-slate-700/50 grid grid-cols-2 gap-4">
                                {extraFields.map(field => (
                                    <div key={field.key}>
                                        <label className="text-xs text-slate-400 mb-1 block">
                                            {field.label}
                                        </label>

                                        {field.type === 'select' ? (
                                            <select
                                                value={values[field.key] || ''}
                                                onChange={(e) => onChange(field.key, e.target.value)}
                                                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700
                                                           focus:border-purple-500 text-white text-sm outline-none cursor-pointer"
                                            >
                                                <option value="">-- เลือก --</option>
                                                {field.options?.map(opt => (
                                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                                ))}
                                            </select>
                                        ) : (
                                            <input
                                                type={field.type}
                                                value={values[field.key] || ''}
                                                onChange={(e) => onChange(field.key, e.target.value)}
                                                placeholder={field.placeholder}
                                                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700
                                                           focus:border-purple-500 text-white placeholder-slate-500 text-sm outline-none"
                                            />
                                        )}
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    )
}
