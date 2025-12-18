import React, { useState, useEffect } from 'react'
import { X, Save, Wand2, Image as ImageIcon, Upload, Trash2, Globe, Languages, Loader2 } from 'lucide-react'
import { Product, ProductImage } from '@/types'
import { useLanguage } from '@/contexts/LanguageContext'
import Image from 'next/image'
import Button from '@/components/ui/Button'
import { motion, AnimatePresence } from 'framer-motion'

interface ProductEditorModalProps {
    isOpen: boolean
    onClose: () => void
    product?: Product | null // If null, creating new
    onSave: (data: Partial<Product>) => Promise<void>
}

export default function ProductEditorModal({ isOpen, onClose, product, onSave }: ProductEditorModalProps) {
    const { t, language } = useLanguage()
    const [activeTab, setActiveTab] = useState<'general' | 'images' | 'pricing'>('general')
    const [isSaving, setIsSaving] = useState(false)

    // Suggestion State
    const [isGenerating, setIsGenerating] = useState(false)

    // Form State
    const [formData, setFormData] = useState<Partial<Product>>({
        title: '',
        title_en: '',
        description: '',
        description_en: '',
        price: 0,
        stock: 1,
        condition: 'new',
        images: [],
        status: 'active'
    })

    // Sync with prop
    useEffect(() => {
        if (product) {
            setFormData({ ...product })
        } else {
            // Reset for new
            setFormData({
                title: '',
                title_en: '',
                description: '',
                description_en: '',
                price: 0,
                stock: 1,
                condition: 'new',
                images: [],
                status: 'active'
            })
        }
    }, [product, isOpen])

    // --- Mock AI Generators ---
    const generateContent = async (field: 'title' | 'description', lang: 'th' | 'en') => {
        setIsGenerating(true)
        // Simulate API
        await new Promise(r => setTimeout(r, 1500))

        if (field === 'title') {
            const suggestion = lang === 'th'
                ? 'หูฟังไร้สาย Sony WH-1000XM4 ตัดเสียงรบกวน แบตยาวนาน 30 ชม.'
                : 'Sony WH-1000XM4 Wireless Noise Cancelling Headphones, 30h Battery'

            setFormData(prev => ({
                ...prev,
                [lang === 'th' ? 'title' : 'title_en']: suggestion
            }))
        } else {
            const suggestion = lang === 'th'
                ? 'สัมผัสประสบการณ์เสียงที่ยอดเยี่ยมด้วยหูฟัง Sony WH-1000XM4\n- ระบบตัดเสียงรบกวนระดับผู้นำอุตสาหกรรม\n- คุณภาพเสียงระดับพรีเมียม\n- สวมใส่สบายตลอดวัน\n- แบตเตอรี่ใช้งานได้ยาวนานถึง 30 ชั่วโมง พร้อมระบบชาร์จเร็ว'
                : 'Experience exceptional sound with Sony WH-1000XM4 headphones.\n- Industry-leading noise cancellation\n- Premium sound quality\n- All-day comfort\n- 30-hour battery life with quick charging'

            setFormData(prev => ({
                ...prev,
                [lang === 'th' ? 'description' : 'description_en']: suggestion
            }))
        }
        setIsGenerating(false)
    }

    const handleSave = async () => {
        setIsSaving(true)
        try {
            await onSave(formData)
            onClose()
        } catch (error) {
            console.error(error)
        } finally {
            setIsSaving(false)
        }
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white dark:bg-slate-900 w-full max-w-4xl max-h-[90vh] rounded-2xl shadow-xl flex flex-col overflow-hidden"
            >
                {/* Header */}
                <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100 dark:border-slate-800">
                    <h2 className="text-xl font-bold dark:text-white">
                        {product ? 'แก้ไขสินค้า' : 'เพิ่มสินค้าใหม่'}
                    </h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                        <X className="w-6 h-6 text-gray-400" />
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex gap-1 p-2 bg-gray-50 dark:bg-slate-950/50 border-b border-gray-100 dark:border-slate-800">
                    {[
                        { id: 'general', label: 'General Info' },
                        { id: 'images', label: 'Images' },
                        { id: 'pricing', label: 'Pricing & Stock' }
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${activeTab === tab.id
                                    ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm'
                                    : 'text-gray-500 hover:bg-gray-200 dark:hover:bg-slate-800/50'
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 bg-white dark:bg-slate-900">
                    {activeTab === 'general' && (
                        <div className="space-y-6">
                            {/* Bilingual Title */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <label className="text-sm font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                            <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-[10px]">TH</span>
                                            ชื่อสินค้า (Thai)
                                        </label>
                                        <button
                                            onClick={() => generateContent('title', 'th')}
                                            disabled={isGenerating}
                                            className="text-xs text-indigo-600 flex items-center gap-1 hover:underline disabled:opacity-50"
                                        >
                                            <Wand2 className="w-3 h-3" /> Auto-Generate
                                        </button>
                                    </div>
                                    <input
                                        type="text"
                                        value={formData.title}
                                        onChange={e => setFormData(p => ({ ...p, title: e.target.value }))}
                                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none"
                                        placeholder="ใส่ชื่อสินค้าภาษาไทย..."
                                    />
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <label className="text-sm font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                            <span className="w-5 h-5 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-[10px]">EN</span>
                                            Product Name (English)
                                        </label>
                                        <button
                                            onClick={() => generateContent('title', 'en')}
                                            disabled={isGenerating}
                                            className="text-xs text-indigo-600 flex items-center gap-1 hover:underline disabled:opacity-50"
                                        >
                                            <Wand2 className="w-3 h-3" /> Auto-Generate
                                        </button>
                                    </div>
                                    <input
                                        type="text"
                                        value={formData.title_en || ''}
                                        onChange={e => setFormData(p => ({ ...p, title_en: e.target.value }))}
                                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none"
                                        placeholder="Enter product name in English..."
                                    />
                                </div>
                            </div>

                            {/* Bilingual Description */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <label className="text-sm font-bold text-gray-700 dark:text-gray-300">รายละเอียด (Thai)</label>
                                        <button
                                            onClick={() => generateContent('description', 'th')}
                                            disabled={isGenerating}
                                            className="text-xs text-indigo-600 flex items-center gap-1 hover:underline disabled:opacity-50"
                                        >
                                            <Wand2 className="w-3 h-3" /> Smart Write
                                        </button>
                                    </div>
                                    <textarea
                                        rows={6}
                                        value={formData.description}
                                        onChange={e => setFormData(p => ({ ...p, description: e.target.value }))}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                                        placeholder="รายละเอียดสินค้า..."
                                    />
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Description (English)</label>
                                        <button
                                            onClick={() => generateContent('description', 'en')}
                                            disabled={isGenerating}
                                            className="text-xs text-indigo-600 flex items-center gap-1 hover:underline disabled:opacity-50"
                                        >
                                            <Wand2 className="w-3 h-3" /> Smart Write
                                        </button>
                                    </div>
                                    <textarea
                                        rows={6}
                                        value={formData.description_en || ''}
                                        onChange={e => setFormData(p => ({ ...p, description_en: e.target.value }))}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                                        placeholder="Product details..."
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'images' && (
                        <div className="space-y-6">
                            <div className="border-2 border-dashed border-gray-200 dark:border-slate-700 rounded-2xl p-8 flex flex-col items-center justify-center bg-gray-50 dark:bg-slate-800/50 hover:bg-gray-100 transition-colors cursor-pointer group">
                                <div className="w-16 h-16 bg-indigo-50 dark:bg-indigo-900/30 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                    <Upload className="w-8 h-8 text-indigo-500" />
                                </div>
                                <h3 className="font-bold text-lg text-gray-700 dark:text-gray-200">Upload Images</h3>
                                <p className="text-gray-400 text-sm mt-1">Drag & drop or click to browse</p>
                                <p className="text-xs text-indigo-500 mt-4 flex items-center gap-1 font-bold">
                                    <Wand2 className="w-3 h-3" /> AI Background Removal Available
                                </p>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {formData.images?.map((img, idx) => (
                                    <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-gray-200 dark:border-slate-700 group">
                                        <Image
                                            src={typeof img === 'string' ? img : img.url}
                                            alt="Product"
                                            fill
                                            className="object-cover"
                                        />
                                        <button
                                            onClick={() => {
                                                const newImages = [...(formData.images || [])]
                                                newImages.splice(idx, 1)
                                                setFormData(p => ({ ...p, images: newImages }))
                                            }}
                                            className="absolute top-2 right-2 p-1.5 bg-white/80 dark:bg-black/50 backdrop-blur-sm rounded-full text-red-500 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                        <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/60 backdrop-blur-sm rounded text-xs text-white opacity-0 group-hover:opacity-100">
                                            Quality: High
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === 'pricing' && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Price (THB)</label>
                                    <input
                                        type="number"
                                        value={formData.price}
                                        onChange={e => setFormData(p => ({ ...p, price: Number(e.target.value) }))}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none font-mono tracking-wide"
                                    />
                                    <button className="text-xs text-indigo-600 font-bold flex items-center gap-1 hover:underline">
                                        <Wand2 className="w-3 h-3" /> Get Price Recommendation
                                    </button>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Stock Quantity</label>
                                    <input
                                        type="number"
                                        value={formData.stock}
                                        onChange={e => setFormData(p => ({ ...p, stock: Number(e.target.value) }))}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none font-mono"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Condition</label>
                                <select
                                    value={formData.condition}
                                    onChange={e => setFormData(p => ({ ...p, condition: e.target.value as any }))}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none"
                                >
                                    <option value="new">New</option>
                                    <option value="like_new">Like New</option>
                                    <option value="good">Good</option>
                                    <option value="fair">Fair</option>
                                </select>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-gray-100 dark:border-slate-800 flex justify-end gap-3 bg-white dark:bg-slate-900">
                    <button
                        onClick={onClose}
                        className="px-6 py-2.5 rounded-xl font-bold text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-slate-800 transition-colors"
                    >
                        Cancel
                    </button>
                    <Button
                        onClick={handleSave}
                        isLoading={isSaving}
                        variant="primary"
                        className="px-8"
                    >
                        <Save className="w-4 h-4 mr-2" />
                        Save Product
                    </Button>
                </div>
            </motion.div>
        </div>
    )
}
