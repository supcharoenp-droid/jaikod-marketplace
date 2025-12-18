'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
    Search, MapPin, DollarSign, Tag, Sparkles,
    SlidersHorizontal, X, TrendingUp, Clock, Award
} from 'lucide-react'
import { CATEGORIES } from '@/constants/categories'

interface AdvancedSearchProps {
    onClose?: () => void
}

export default function AdvancedSearch({ onClose }: AdvancedSearchProps) {
    const router = useRouter()
    const [searchQuery, setSearchQuery] = useState('')
    const [category, setCategory] = useState('')
    const [minPrice, setMinPrice] = useState('')
    const [maxPrice, setMaxPrice] = useState('')
    const [location, setLocation] = useState('')
    const [condition, setCondition] = useState('')
    const [sortBy, setSortBy] = useState('newest')
    const [aiMode, setAiMode] = useState(false)

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()

        const params = new URLSearchParams()
        if (searchQuery) params.set('q', searchQuery)
        if (category) params.set('category', category)
        if (minPrice) params.set('min_price', minPrice)
        if (maxPrice) params.set('max_price', maxPrice)
        if (location) params.set('location', location)
        if (condition) params.set('condition', condition)
        if (sortBy) params.set('sort', sortBy)
        if (aiMode) params.set('ai', 'true')

        router.push(`/search?${params.toString()}`)
        onClose?.()
    }

    const handleReset = () => {
        setSearchQuery('')
        setCategory('')
        setMinPrice('')
        setMaxPrice('')
        setLocation('')
        setCondition('')
        setSortBy('newest')
        setAiMode(false)
    }

    return (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
                {/* Header */}
                <div className="p-6 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center">
                            <SlidersHorizontal className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                ค้นหาขั้นสูง
                            </h2>
                            <p className="text-sm text-gray-500">
                                ค้นหาสินค้าที่ต้องการได้แม่นยำยิ่งขึ้น
                            </p>
                        </div>
                    </div>
                    {onClose && (
                        <button
                            onClick={onClose}
                            className="w-10 h-10 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center justify-center transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    )}
                </div>

                {/* Form */}
                <form onSubmit={handleSearch} className="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-200px)]">
                    {/* AI Mode Toggle */}
                    <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-2xl p-4 border border-purple-200 dark:border-purple-800">
                        <label className="flex items-center gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={aiMode}
                                onChange={(e) => setAiMode(e.target.checked)}
                                className="w-5 h-5 rounded text-purple-600 focus:ring-purple-500"
                            />
                            <div className="flex-1">
                                <div className="flex items-center gap-2">
                                    <Sparkles className="w-5 h-5 text-purple-600" />
                                    <span className="font-semibold text-gray-900 dark:text-white">
                                        ใช้ AI ค้นหาอัจฉริยะ
                                    </span>
                                </div>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                    AI จะวิเคราะห์คำค้นหาและแนะนำสินค้าที่เหมาะสมที่สุด
                                </p>
                            </div>
                        </label>
                    </div>

                    {/* Search Query */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            คำค้นหา
                        </label>
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="ค้นหาสินค้า... (เช่น iPhone 15, กล้อง Sony)"
                                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            />
                        </div>
                    </div>

                    {/* Category */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            หมวดหมู่
                        </label>
                        <div className="relative">
                            <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none"
                            >
                                <option value="">ทุกหมวดหมู่</option>
                                {CATEGORIES.map((cat) => (
                                    <option key={cat.id} value={cat.id}>
                                        {cat.name_th}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Price Range */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                ราคาต่ำสุด (฿)
                            </label>
                            <div className="relative">
                                <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="number"
                                    value={minPrice}
                                    onChange={(e) => setMinPrice(e.target.value)}
                                    placeholder="0"
                                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                ราคาสูงสุด (฿)
                            </label>
                            <div className="relative">
                                <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="number"
                                    value={maxPrice}
                                    onChange={(e) => setMaxPrice(e.target.value)}
                                    placeholder="ไม่จำกัด"
                                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Location */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            จังหวัด
                        </label>
                        <div className="relative">
                            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                placeholder="เช่น กรุงเทพมหานคร, เชียงใหม่"
                                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            />
                        </div>
                    </div>

                    {/* Condition */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            สภาพสินค้า
                        </label>
                        <div className="grid grid-cols-3 gap-3">
                            {[
                                { value: '', label: 'ทั้งหมด' },
                                { value: 'new', label: 'ใหม่' },
                                { value: 'like_new', label: 'เหมือนใหม่' },
                                { value: 'good', label: 'ดี' },
                                { value: 'fair', label: 'พอใช้' },
                                { value: 'poor', label: 'ต้องซ่อม' },
                            ].map((opt) => (
                                <button
                                    key={opt.value}
                                    type="button"
                                    onClick={() => setCondition(opt.value)}
                                    className={`px-4 py-2 rounded-xl border-2 transition-all ${condition === opt.value
                                            ? 'border-purple-600 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 font-semibold'
                                            : 'border-gray-300 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-700'
                                        }`}
                                >
                                    {opt.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Sort By */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            เรียงตาม
                        </label>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {[
                                { value: 'newest', label: 'ใหม่ล่าสุด', icon: Clock },
                                { value: 'price_low', label: 'ราคาต่ำ-สูง', icon: DollarSign },
                                { value: 'price_high', label: 'ราคาสูง-ต่ำ', icon: DollarSign },
                                { value: 'popular', label: 'ยอดนิยม', icon: TrendingUp },
                                { value: 'best_seller', label: 'ขายดี', icon: Award },
                                { value: 'nearest', label: 'ใกล้ที่สุด', icon: MapPin },
                            ].map((opt) => (
                                <button
                                    key={opt.value}
                                    type="button"
                                    onClick={() => setSortBy(opt.value)}
                                    className={`flex items-center gap-2 px-3 py-2 rounded-xl border-2 transition-all ${sortBy === opt.value
                                            ? 'border-purple-600 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 font-semibold'
                                            : 'border-gray-300 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-700'
                                        }`}
                                >
                                    <opt.icon className="w-4 h-4" />
                                    <span className="text-sm">{opt.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </form>

                {/* Footer */}
                <div className="p-6 border-t border-gray-200 dark:border-gray-800 flex items-center justify-between gap-4">
                    <button
                        type="button"
                        onClick={handleReset}
                        className="px-6 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors font-medium"
                    >
                        ล้างค่า
                    </button>
                    <button
                        onClick={handleSearch}
                        className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                    >
                        <Search className="w-5 h-5" />
                        ค้นหา
                    </button>
                </div>
            </div>
        </div>
    )
}
