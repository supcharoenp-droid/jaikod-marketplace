'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import {
    Upload, X, Camera, CheckCircle, AlertCircle, Loader2,
    Sparkles, Tag, Truck, Box, DollarSign, FileText
} from 'lucide-react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import AddressSelector from '@/components/ui/AddressSelector'
import { CATEGORIES, PRODUCT_CONDITIONS } from '@/constants/categories'
import { createProduct, CreateProductInput } from '@/lib/products'
import { getSellerProfile } from '@/lib/seller'
import { useAuth } from '@/contexts/AuthContext'

export default function CreateProductPage() {
    const router = useRouter()
    const { user } = useAuth()

    // State
    const [isLoading, setIsLoading] = useState(false)
    const [isAiLoading, setIsAiLoading] = useState(false)
    const [successMessage, setSuccessMessage] = useState('')
    const [errorMessage, setErrorMessage] = useState('')
    const [images, setImages] = useState<string[]>([])
    const [tags, setTags] = useState<string[]>([])
    const [tagInput, setTagInput] = useState('')

    const [formData, setFormData] = useState<Partial<CreateProductInput>>({
        title: '',
        description: '',
        category_id: '',
        price: 0,
        original_price: undefined,
        price_type: 'fixed',
        condition: 'good',
        usage_detail: '',
        stock: 1,
        province: '',
        amphoe: '',
        district: '',
        zipcode: '',
        can_ship: true,
        can_pickup: false,
        shipping_fee: 0,
        shipping_options: []
    })

    // Check Auth
    useEffect(() => {
        if (!isLoading && !user) {
            router.push('/login?redirect=/seller/products/create')
        }
    }, [user, isLoading, router])

    // Check Seller Profile
    useEffect(() => {
        const checkSeller = async () => {
            if (user) {
                const profile = await getSellerProfile(user.uid)
                if (!profile) {
                    // Redirect to registration if not a seller
                    // router.push('/seller/register') 
                    // Optional: For now we allow even if not fully registered, 
                    // but practically the dashboard redirects them.
                } else if (profile.address) {
                    // Pre-fill address from seller profile
                    // We need to map address fields correctly if they differ
                }
            }
        }
        checkSeller()
    }, [user])

    // Handlers
    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (!files) return

        const remainingSlots = 10 - images.length
        const filesToProcess = Array.from(files).slice(0, remainingSlots)

        filesToProcess.forEach(file => {
            if (file.size > 5 * 1024 * 1024) {
                setErrorMessage('รูปภาพต้องมีขนาดไม่เกิน 5MB')
                return
            }
            if (!file.type.startsWith('image/')) {
                setErrorMessage('กรุณาอัพโหลดไฟล์รูปภาพเท่านั้น')
                return
            }

            const reader = new FileReader()
            reader.onloadend = () => {
                setImages(prev => [...prev, reader.result as string])
            }
            reader.readAsDataURL(file)
        })
    }

    const removeImage = (index: number) => {
        setImages(prev => prev.filter((_, i) => i !== index))
    }

    const handleTagAdd = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && tagInput.trim()) {
            e.preventDefault()
            if (!tags.includes(tagInput.trim())) {
                setTags([...tags, tagInput.trim()])
            }
            setTagInput('')
        }
    }

    const removeTag = (tagToRemove: string) => {
        setTags(tags.filter(tag => tag !== tagToRemove))
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target

        if (type === 'checkbox') {
            const checked = (e.target as HTMLInputElement).checked
            setFormData(prev => ({ ...prev, [name]: checked }))
        } else if (type === 'number') {
            setFormData(prev => ({ ...prev, [name]: parseFloat(value) || 0 }))
        } else {
            setFormData(prev => ({ ...prev, [name]: value }))
        }
    }

    const handleAddressChange = (addr: any) => {
        setFormData(prev => ({
            ...prev,
            province: addr.province,
            amphoe: addr.amphoe,
            district: addr.district,
            zipcode: addr.zipcode
        }))
    }

    // AI Features (Mock)
    const generateAiDescription = async () => {
        if (!formData.title) {
            setErrorMessage('กรุณาระบุชื่อสินค้าก่อนใช้ AI')
            return
        }
        setIsAiLoading(true)
        // Simulate API call
        setTimeout(() => {
            setFormData(prev => ({
                ...prev,
                description: `${prev.title} \n\n✅ สภาพดีเยี่ยม พร้อมใช้งาน\n✅ อุปกรณ์ครบกล่อง\n✅ ราคาคุ้มค่า\n\nสนใจสอบถามเพิ่มเติมได้เลยครับ สินค้าพร้อมส่ง!`
            }))
            setIsAiLoading(false)
        }, 1500)
    }

    const suggestAiPrice = async () => {
        if (!formData.title) {
            setErrorMessage('กรุณาระบุชื่อสินค้าก่อนใช้ AI')
            return
        }
        setIsAiLoading(true)
        // Simulate API call
        setTimeout(() => {
            const randomPrice = Math.floor(Math.random() * 5000) + 1000
            setFormData(prev => ({
                ...prev,
                price: randomPrice
            }))
            setIsAiLoading(false)
        }, 1000)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setErrorMessage('')

        if (!user) {
            setErrorMessage('กรุณาเข้าสู่ระบบ')
            return
        }
        if (images.length === 0) {
            setErrorMessage('กรุณาอัพโหลดรูปภาพอย่างน้อย 1 รูป')
            return
        }
        if (!formData.title || !formData.description || !formData.category_id || !formData.price) {
            setErrorMessage('กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน')
            return
        }
        if (!formData.province) {
            setErrorMessage('กรุณาระบุที่อยู่สินค้า')
            return
        }

        setIsLoading(true)
        try {
            const input: CreateProductInput = {
                title: formData.title,
                description: formData.description,
                category_id: formData.category_id,
                price: formData.price,
                original_price: formData.original_price,
                price_type: formData.price_type as any,
                condition: formData.condition || 'good',
                usage_detail: formData.usage_detail,
                stock: formData.stock || 1,
                tags: tags,
                province: formData.province || '',
                amphoe: formData.amphoe || '',
                district: formData.district || '',
                zipcode: formData.zipcode || '',
                can_ship: formData.can_ship || false,
                can_pickup: formData.can_pickup || false,
                shipping_fee: formData.shipping_fee,
                shipping_options: [],
                images: images
            }

            // Get updated seller profile for latest name/avatar
            const profile = await getSellerProfile(user.uid)
            const sellerName = profile?.shop_name || user.displayName || 'Seller'

            await createProduct(input, user.uid, sellerName, profile?.avatar_url)

            setSuccessMessage('ลงขายสินค้าสำเร็จ!')
            setTimeout(() => {
                router.push('/seller/products')
            }, 1000)
        } catch (error) {
            console.error(error)
            setErrorMessage('เกิดข้อผิดพลาดในการลงสินค้า')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-bg-dark flex flex-col">
            <Header />
            <main className="flex-1 py-10 container mx-auto px-4">
                <div className="max-w-4xl mx-auto">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-bold flex items-center gap-2">
                            <Upload className="w-6 h-6 text-neon-purple" />
                            ลงขายสินค้าใหม่
                        </h1>
                    </div>

                    {successMessage && (
                        <div className="mb-6 p-4 bg-emerald-50 text-emerald-700 rounded-xl flex items-center gap-2 font-medium">
                            <CheckCircle className="w-5 h-5" /> {successMessage}
                        </div>
                    )}

                    {errorMessage && (
                        <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-xl flex items-center gap-2 font-medium">
                            <AlertCircle className="w-5 h-5" /> {errorMessage}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* 1. Images */}
                        <div className="bg-white dark:bg-surface-dark rounded-xl p-6 shadow-sm">
                            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                                <FileText className="w-5 h-5 text-gray-400" />
                                รูปภาพสินค้า <span className="text-red-500">*</span>
                            </h2>
                            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-4">
                                {images.map((img, idx) => (
                                    <div key={idx} className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 group border border-gray-200">
                                        <Image src={img} alt="" fill className="object-cover" />
                                        <button type="button" onClick={() => removeImage(idx)} className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                                            <X className="w-3 h-3" />
                                        </button>
                                        {idx === 0 && <span className="absolute bottom-1 left-1 bg-neon-purple text-white text-[10px] px-1.5 py-0.5 rounded">ปก</span>}
                                    </div>
                                ))}
                                {images.length < 10 && (
                                    <label className="aspect-square rounded-lg border-2 border-dashed border-gray-300 hover:border-neon-purple cursor-pointer flex flex-col items-center justify-center bg-gray-50 transition-colors">
                                        <Camera className="w-6 h-6 text-gray-400 mb-1" />
                                        <span className="text-xs text-gray-500">เพิ่มรูป</span>
                                        <input type="file" multiple accept="image/*" className="hidden" onChange={handleImageUpload} />
                                    </label>
                                )}
                            </div>
                        </div>

                        {/* 2. Basic Info & AI */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <div className="lg:col-span-2 space-y-6">
                                <div className="bg-white dark:bg-surface-dark rounded-xl p-6 shadow-sm">
                                    <h2 className="text-lg font-bold mb-4">ข้อมูลทั่วไป</h2>
                                    <div className="space-y-4">
                                        <Input
                                            label="ชื่อสินค้า *"
                                            name="title"
                                            value={formData.title}
                                            onChange={handleChange}
                                            placeholder="เช่น iPhone 15 Pro Max 256GB"
                                            required
                                        />

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium mb-1">หมวดหมู่ *</label>
                                                <select
                                                    name="category_id"
                                                    value={formData.category_id}
                                                    onChange={handleChange}
                                                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:border-neon-purple"
                                                    required
                                                >
                                                    <option value="">เลือกหมวดหมู่</option>
                                                    {CATEGORIES.map(c => (
                                                        <option key={c.id} value={c.id}>{c.name_th}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium mb-1">สภาพสินค้า *</label>
                                                <select
                                                    name="condition"
                                                    value={formData.condition}
                                                    onChange={handleChange}
                                                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:border-neon-purple"
                                                >
                                                    {PRODUCT_CONDITIONS.map(c => (
                                                        <option key={c.value} value={c.value}>{c.label}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>

                                        <div className="relative">
                                            <label className="block text-sm font-medium mb-1">รายละเอียดสินค้า *</label>
                                            <div className="absolute top-0 right-0">
                                                <button
                                                    type="button"
                                                    onClick={generateAiDescription}
                                                    disabled={isAiLoading}
                                                    className="text-xs flex items-center text-neon-purple hover:text-purple-600 transition-colors"
                                                >
                                                    <Sparkles className="w-3 h-3 mr-1" />
                                                    {isAiLoading ? 'กำลังสร้าง...' : 'ใช้ AI เขียนคำบรรยาย'}
                                                </button>
                                            </div>
                                            <textarea
                                                name="description"
                                                value={formData.description}
                                                onChange={handleChange}
                                                rows={6}
                                                className="w-full p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:border-neon-purple resize-none"
                                                placeholder="รายละเอียดสินค้า..."
                                                required
                                            />
                                        </div>

                                        <div className="relative">
                                            <label className="block text-sm font-medium mb-1">รายละเอียดการใช้งาน (ตำหนิ/ประวัติ)</label>
                                            <textarea
                                                name="usage_detail"
                                                value={formData.usage_detail}
                                                onChange={handleChange}
                                                rows={2}
                                                className="w-full p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:border-neon-purple resize-none"
                                                placeholder="เช่น เคยเปลี่ยนแบตเตอรี่มา, มีรอยขนแมวเล็กน้อย..."
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium mb-1 flex items-center gap-1">
                                                <Tag className="w-4 h-4" /> แฮชแท็ก
                                                <span className="text-gray-400 font-normal text-xs ml-2">(กด Enter เพื่อเพิ่ม)</span>
                                            </label>
                                            <div className="flex flex-wrap gap-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 focus-within:border-neon-purple transition-colors">
                                                {tags.map((tag, idx) => (
                                                    <span key={idx} className="bg-white dark:bg-gray-700 px-2 py-1 rounded text-sm flex items-center gap-1 shadow-sm">
                                                        #{tag}
                                                        <button type="button" onClick={() => removeTag(tag)} className="text-gray-400 hover:text-red-500"><X className="w-3 h-3" /></button>
                                                    </span>
                                                ))}
                                                <input
                                                    type="text"
                                                    value={tagInput}
                                                    onChange={(e) => setTagInput(e.target.value)}
                                                    onKeyDown={handleTagAdd}
                                                    className="bg-transparent focus:outline-none flex-1 min-w-[100px] text-sm"
                                                    placeholder={tags.length === 0 ? "เพิ่มแฮชแท็ก..." : ""}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6">
                                {/* Price */}
                                <div className="bg-white dark:bg-surface-dark rounded-xl p-6 shadow-sm">
                                    <h2 className="text-lg font-bold mb-4 flex items-center justify-between">
                                        <span>ราคา</span>
                                        <button
                                            type="button"
                                            onClick={suggestAiPrice}
                                            disabled={isAiLoading}
                                            className="text-xs font-normal flex items-center text-neon-purple hover:text-purple-600"
                                        >
                                            <Sparkles className="w-3 h-3 mr-1" /> แนะนำราคา
                                        </button>
                                    </h2>
                                    <div className="space-y-4">
                                        <div className="flex rounded-lg bg-gray-100 p-1 mb-4">
                                            {(['fixed', 'negotiable', 'auction'] as const).map(type => (
                                                <button
                                                    key={type}
                                                    type="button"
                                                    onClick={() => setFormData(prev => ({ ...prev, price_type: type }))}
                                                    className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all ${formData.price_type === type
                                                        ? 'bg-white text-neon-purple shadow-sm'
                                                        : 'text-gray-500 hover:text-gray-700'
                                                        }`}
                                                >
                                                    {type === 'fixed' ? 'ราคาคงที่' : type === 'negotiable' ? 'ต่อรองได้' : 'ประมูล'}
                                                </button>
                                            ))}
                                        </div>

                                        <div className="relative">
                                            <DollarSign className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                                            <input
                                                type="number"
                                                name="price"
                                                value={formData.price}
                                                onChange={handleChange}
                                                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 focus:outline-none focus:border-neon-purple font-bold text-lg"
                                                placeholder="0.00"
                                                required
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <label className="text-xs text-gray-500 mb-1 block">ราคาเต็ม (ถ้ามี)</label>
                                                <input
                                                    type="number"
                                                    name="original_price"
                                                    value={formData.original_price || ''}
                                                    onChange={handleChange}
                                                    className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 focus:outline-none focus:border-neon-purple text-sm"
                                                    placeholder="0.00"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-xs text-gray-500 mb-1 block">คลังสินค้า</label>
                                                <input
                                                    type="number"
                                                    name="stock"
                                                    value={formData.stock}
                                                    onChange={handleChange}
                                                    className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 focus:outline-none focus:border-neon-purple text-sm"
                                                    min="1"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Shipping */}
                                <div className="bg-white dark:bg-surface-dark rounded-xl p-6 shadow-sm">
                                    <h2 className="text-lg font-bold mb-4">การจัดส่ง</h2>
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">ตำแหน่งสินค้า</label>
                                            <AddressSelector
                                                initialValues={{
                                                    province: formData.province || '',
                                                    amphoe: formData.amphoe || '',
                                                    district: formData.district || '',
                                                    zipcode: formData.zipcode || ''
                                                }}
                                                onAddressChange={handleAddressChange}
                                            />
                                        </div>

                                        <div className="space-y-3 pt-2">
                                            <label className="flex items-center justify-between p-3 border border-gray-200 rounded-lg cursor-pointer hover:border-neon-purple transition-colors">
                                                <div className="flex items-center gap-2">
                                                    <Truck className="w-5 h-5 text-gray-500" />
                                                    <span className="text-sm">จัดส่งพัสดุ</span>
                                                </div>
                                                <input
                                                    type="checkbox"
                                                    name="can_ship"
                                                    checked={formData.can_ship}
                                                    onChange={handleChange}
                                                    className="w-5 h-5 rounded text-neon-purple focus:ring-neon-purple"
                                                />
                                            </label>

                                            {formData.can_ship && (
                                                <div className="pl-4">
                                                    <label className="text-xs text-gray-500 mb-1 block">ค่าจัดส่ง (บาท)</label>
                                                    <input
                                                        type="number"
                                                        name="shipping_fee"
                                                        value={formData.shipping_fee}
                                                        onChange={handleChange}
                                                        className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 focus:outline-none focus:border-neon-purple text-sm"
                                                        placeholder="0 = ส่งฟรี"
                                                    />
                                                </div>
                                            )}

                                            <label className="flex items-center justify-between p-3 border border-gray-200 rounded-lg cursor-pointer hover:border-neon-purple transition-colors">
                                                <div className="flex items-center gap-2">
                                                    <Box className="w-5 h-5 text-gray-500" />
                                                    <span className="text-sm">นัดรับสินค้า</span>
                                                </div>
                                                <input
                                                    type="checkbox"
                                                    name="can_pickup"
                                                    checked={formData.can_pickup}
                                                    onChange={handleChange}
                                                    className="w-5 h-5 rounded text-neon-purple focus:ring-neon-purple"
                                                />
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-800">
                            <Button variant="outline" type="button" onClick={() => router.back()}>
                                ยกเลิก
                            </Button>
                            <Button
                                variant="primary"
                                type="submit"
                                isLoading={isLoading}
                                className="min-w-[150px]"
                            >
                                ลงขายสินค้า
                            </Button>
                        </div>
                    </form>
                </div>
            </main>
            <Footer />
        </div>
    )
}
