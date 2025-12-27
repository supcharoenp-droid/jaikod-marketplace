'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
    Plus,
    Search,
    Edit,
    Trash2,
    Package,
    CheckSquare,
    Square,
    Wand2,
    Eye,
    EyeOff,
    TrendingUp,
    TrendingDown,
    AlertCircle,
    Sparkles,
    Filter,
    ArrowUpDown,
    MoreHorizontal,
    ChevronRight,
    Copy,
    Tag,
    Zap,
    BarChart3
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { useLanguage } from '@/contexts/LanguageContext'
import { getProductsBySeller, deleteProduct, updateProduct } from '@/lib/products'
import { Product } from '@/types'
import ProductEditorModal from '@/components/seller/ProductEditorModal'
import ProductAnalyzer from '@/components/seller/ProductAnalyzer'

// ==================== Types ====================
interface ProductHealthScore {
    score: number
    issues: string[]
    suggestions: string[]
}

// Status tab configuration
interface StatusTab {
    id: string
    labelTh: string
    labelEn: string
    count: number
    color: string
}

// ==================== Helper Functions ====================
function calculateHealthScore(product: Product): ProductHealthScore {
    let score = 100
    const issues: string[] = []
    const suggestions: string[] = []

    // Check images
    if (!product.images || product.images.length === 0) {
        score -= 30
        issues.push('ไม่มีรูปภาพ')
        suggestions.push('เพิ่มรูปภาพสินค้าอย่างน้อย 3 รูป')
    } else if (product.images.length < 3) {
        score -= 15
        issues.push('รูปภาพน้อยเกินไป')
        suggestions.push('เพิ่มรูปภาพให้ครบ 3 รูปขึ้นไป')
    }

    // Check description
    if (!product.description || product.description.length < 50) {
        score -= 20
        issues.push('คำอธิบายสั้นเกินไป')
        suggestions.push('เพิ่มคำอธิบายให้ละเอียดขึ้น (อย่างน้อย 100 ตัวอักษร)')
    }

    // Check stock
    if (product.stock === 0) {
        score -= 25
        issues.push('สินค้าหมด')
        suggestions.push('อัพเดทจำนวนสต็อก')
    } else if (product.stock < 5) {
        score -= 10
        issues.push('สต็อกเหลือน้อย')
        suggestions.push('เติมสต็อกก่อนหมด')
    }

    // Check price
    if (product.price <= 0) {
        score -= 15
        issues.push('ราคาไม่ถูกต้อง')
        suggestions.push('ตั้งราคาที่เหมาะสม')
    }

    return { score: Math.max(0, score), issues, suggestions }
}

function getHealthColor(score: number): { text: string, bg: string, border: string } {
    if (score >= 80) return { text: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200' }
    if (score >= 60) return { text: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200' }
    return { text: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200' }
}

// ==================== Components ====================

/**
 * AI Health Score Summary Card
 */
function AIHealthSummaryCard({ products }: { products: Product[] }) {
    const { t, language } = useLanguage()

    const scores = products.map(p => calculateHealthScore(p))
    const avgScore = scores.length > 0
        ? Math.round(scores.reduce((a, b) => a + b.score, 0) / scores.length)
        : 0

    const needsAttention = scores.filter(s => s.score < 60).length
    const allIssues = scores.flatMap(s => s.issues)
    const issueCount: Record<string, number> = {}
    allIssues.forEach(issue => {
        issueCount[issue] = (issueCount[issue] || 0) + 1
    })

    const topIssues = Object.entries(issueCount)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)

    const healthColor = getHealthColor(avgScore)

    return (
        <div className={`${healthColor.bg} border-2 ${healthColor.border} rounded-2xl p-6`}>
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-white rounded-xl shadow-sm">
                        <Sparkles className={`w-6 h-6 ${healthColor.text}`} />
                    </div>
                    <div>
                        <h3 className="font-bold text-lg text-gray-900">
                            {t('คะแนนสุขภาพสินค้า', 'Product Health Score')}
                        </h3>
                        <p className="text-sm text-gray-600">
                            {t('AI วิเคราะห์สินค้าทั้งหมด', 'AI analyzed all products')}
                        </p>
                    </div>
                </div>
                <div className="text-right">
                    <div className={`text-4xl font-black ${healthColor.text}`}>
                        {avgScore}<span className="text-lg text-gray-400">/100</span>
                    </div>
                    {needsAttention > 0 && (
                        <p className="text-sm text-amber-600">
                            {needsAttention} {t('สินค้าต้องปรับปรุง', 'products need attention')}
                        </p>
                    )}
                </div>
            </div>

            {topIssues.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                    <p className="text-sm font-medium text-gray-700 mb-2">
                        {t('ปัญหาที่พบบ่อย:', 'Common Issues:')}
                    </p>
                    <div className="flex flex-wrap gap-2">
                        {topIssues.map(([issue, count], idx) => (
                            <span
                                key={idx}
                                className="inline-flex items-center gap-1 px-3 py-1 bg-white rounded-full text-sm font-medium text-gray-700 border border-gray-200"
                            >
                                <AlertCircle className="w-3 h-3 text-amber-500" />
                                {issue} ({count})
                            </span>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}

/**
 * Product Row with AI Suggestions
 */
function ProductRowWithAI({
    product,
    isSelected,
    onToggleSelect,
    onEdit,
    onDelete,
    isDeleting,
    t,
    language
}: {
    product: Product
    isSelected: boolean
    onToggleSelect: () => void
    onEdit: () => void
    onDelete: () => void
    isDeleting: boolean
    t: (th: string, en: string) => string
    language: string
}) {
    const health = calculateHealthScore(product)
    const healthColor = getHealthColor(health.score)
    const [showDropdown, setShowDropdown] = useState(false)

    return (
        <tr className={`group hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors ${isSelected ? 'bg-indigo-50 dark:bg-indigo-900/20' : ''}`}>
            {/* Checkbox */}
            <td className="p-4 text-center">
                <input
                    type="checkbox"
                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    checked={isSelected}
                    onChange={onToggleSelect}
                />
            </td>

            {/* Product Info */}
            <td className="p-4">
                <div className="flex items-center gap-4">
                    <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0 border-2 border-gray-200">
                        {product.images && product.images.length > 0 ? (
                            <Image
                                src={typeof product.images[0] === 'string' ? product.images[0] : product.images[0].url}
                                alt={product.title}
                                fill
                                className="object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                                <Package className="w-6 h-6" />
                            </div>
                        )}
                    </div>
                    <div className="min-w-0">
                        <h3 className="font-semibold text-gray-900 dark:text-white truncate max-w-[250px]">
                            {product.title}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-gray-500">ID: {product.id.slice(-6)}</span>
                            {product.views_count && (
                                <span className="text-xs text-gray-400 flex items-center gap-1">
                                    <Eye className="w-3 h-3" /> {product.views_count}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </td>

            {/* Price */}
            <td className="p-4">
                <span className="font-bold text-gray-900 dark:text-white">
                    ฿{product.price.toLocaleString()}
                </span>
            </td>

            {/* Stock */}
            <td className="p-4">
                <span className={`font-mono text-sm ${product.stock === 0 ? 'text-red-600 font-bold' :
                    product.stock < 5 ? 'text-amber-600' : 'text-gray-600'
                    }`}>
                    {product.stock} {t('ชิ้น', 'pcs')}
                </span>
            </td>

            {/* Health Score */}
            <td className="p-4">
                <div className="flex items-center gap-2">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${healthColor.bg} border ${healthColor.border}`}>
                        <span className={`text-sm font-black ${healthColor.text}`}>{health.score}</span>
                    </div>
                    {health.issues.length > 0 && (
                        <div className="group/tooltip relative">
                            <AlertCircle className="w-4 h-4 text-amber-500 cursor-help" />
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 bg-gray-900 text-white text-xs rounded-lg p-2 opacity-0 invisible group-hover/tooltip:opacity-100 group-hover/tooltip:visible transition-all z-50">
                                {health.issues.slice(0, 2).map((issue, i) => (
                                    <div key={i}>• {issue}</div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </td>

            {/* Status */}
            <td className="p-4">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${product.status === 'active'
                    ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                    : 'bg-gray-100 text-gray-600 border border-gray-200'
                    }`}>
                    {product.status === 'active' ? (
                        <>
                            <Eye className="w-3 h-3" />
                            {t('เปิดขาย', 'Active')}
                        </>
                    ) : (
                        <>
                            <EyeOff className="w-3 h-3" />
                            {t('ซ่อน', 'Hidden')}
                        </>
                    )}
                </span>
            </td>

            {/* Actions */}
            <td className="p-4">
                <div className="flex items-center justify-end gap-1">
                    <button
                        onClick={onEdit}
                        className="p-2 hover:bg-blue-100 rounded-lg text-blue-600 transition-colors"
                        title={t('แก้ไข', 'Edit')}
                    >
                        <Edit className="w-4 h-4" />
                    </button>
                    <button
                        onClick={onDelete}
                        disabled={isDeleting}
                        className="p-2 hover:bg-red-100 rounded-lg text-red-600 transition-colors disabled:opacity-50"
                        title={t('ลบ', 'Delete')}
                    >
                        {isDeleting ? (
                            <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                        ) : (
                            <Trash2 className="w-4 h-4" />
                        )}
                    </button>
                    <div className="relative">
                        <button
                            onClick={() => setShowDropdown(!showDropdown)}
                            className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 transition-colors"
                        >
                            <MoreHorizontal className="w-4 h-4" />
                        </button>
                        {showDropdown && (
                            <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-gray-200 rounded-xl shadow-xl z-50 py-1">
                                <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2">
                                    <Copy className="w-4 h-4" />
                                    {t('คัดลอก', 'Duplicate')}
                                </button>
                                <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2">
                                    <Zap className="w-4 h-4" />
                                    {t('AI ปรับปรุง', 'AI Optimize')}
                                </button>
                                <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2">
                                    <BarChart3 className="w-4 h-4" />
                                    {t('ดูสถิติ', 'View Stats')}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </td>
        </tr>
    )
}

// ==================== Main Component ====================
export default function SellerProductsPageV2() {
    const { user } = useAuth()
    const { t, language } = useLanguage()

    // State
    const [products, setProducts] = useState<Product[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')
    const [activeTab, setActiveTab] = useState('all')
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
    const [isEditorOpen, setIsEditorOpen] = useState(false)
    const [editingProduct, setEditingProduct] = useState<Product | null>(null)
    const [deletingId, setDeletingId] = useState<string | null>(null)
    const [sortBy, setSortBy] = useState<'newest' | 'price' | 'stock'>('newest')

    // Fetch products
    useEffect(() => {
        const fetchProducts = async () => {
            if (!user) {
                setIsLoading(false)
                return
            }
            try {
                setIsLoading(true)
                const data = await getProductsBySeller(user.uid)
                setProducts(data)
            } catch (error) {
                console.error('Error fetching products:', error)
            } finally {
                setIsLoading(false)
            }
        }
        fetchProducts()
    }, [user])

    // Status Tabs
    const statusTabs: StatusTab[] = [
        { id: 'all', labelTh: 'ทั้งหมด', labelEn: 'All', count: products.length, color: 'gray' },
        { id: 'active', labelTh: 'เปิดขาย', labelEn: 'Active', count: products.filter(p => p.status === 'active').length, color: 'emerald' },
        { id: 'hidden', labelTh: 'ซ่อน', labelEn: 'Hidden', count: products.filter(p => p.status !== 'active').length, color: 'gray' },
        { id: 'out_of_stock', labelTh: 'หมดสต็อก', labelEn: 'Out of Stock', count: products.filter(p => p.stock === 0).length, color: 'red' },
        { id: 'low_health', labelTh: 'ต้องปรับปรุง', labelEn: 'Needs Attention', count: products.filter(p => calculateHealthScore(p).score < 60).length, color: 'amber' },
    ]

    // Filter & Sort
    let filteredProducts = products.filter(p => {
        const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase())
        if (!matchesSearch) return false

        if (activeTab === 'all') return true
        if (activeTab === 'active') return p.status === 'active'
        if (activeTab === 'hidden') return p.status !== 'active'
        if (activeTab === 'out_of_stock') return p.stock === 0
        if (activeTab === 'low_health') return calculateHealthScore(p).score < 60
        return true
    })

    // Sort
    filteredProducts = [...filteredProducts].sort((a, b) => {
        if (sortBy === 'newest') return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()
        if (sortBy === 'price') return b.price - a.price
        if (sortBy === 'stock') return a.stock - b.stock
        return 0
    })

    // Handlers
    const toggleSelection = (id: string) => {
        const newSet = new Set(selectedIds)
        if (newSet.has(id)) newSet.delete(id)
        else newSet.add(id)
        setSelectedIds(newSet)
    }

    const toggleAll = () => {
        if (selectedIds.size === filteredProducts.length) {
            setSelectedIds(new Set())
        } else {
            setSelectedIds(new Set(filteredProducts.map(p => p.id)))
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm(t('คุณแน่ใจหรือไม่ว่าต้องการลบสินค้านี้?', 'Are you sure you want to delete this product?'))) return
        try {
            setDeletingId(id)
            await deleteProduct(id)
            setProducts(prev => prev.filter(p => p.id !== id))
        } catch (error) {
            console.error('Error deleting:', error)
        } finally {
            setDeletingId(null)
        }
    }

    const handleBulkAction = async (action: 'delete' | 'publish' | 'hide') => {
        const count = selectedIds.size
        if (!confirm(t(`ยืนยัน ${action} สำหรับ ${count} รายการ?`, `Confirm ${action} for ${count} items?`))) return

        try {
            const updates = []
            for (const id of Array.from(selectedIds)) {
                if (action === 'delete') {
                    updates.push(deleteProduct(id))
                } else if (action === 'publish') {
                    updates.push(updateProduct(id, { status: 'active' } as any))
                } else if (action === 'hide') {
                    updates.push(updateProduct(id, { status: 'hidden' } as any))
                }
            }
            await Promise.all(updates)

            if (action === 'delete') {
                setProducts(prev => prev.filter(p => !selectedIds.has(p.id)))
            } else if (user) {
                const data = await getProductsBySeller(user.uid)
                setProducts(data)
            }
            setSelectedIds(new Set())
        } catch (error) {
            console.error('Bulk action failed:', error)
        }
    }

    const handleSaveProduct = async (data: Partial<Product>) => {
        if (!user) return
        try {
            if (editingProduct) {
                await updateProduct(editingProduct.id, data as any)
                setProducts(prev => prev.map(p => p.id === editingProduct.id ? { ...p, ...data } : p))
            }
            setIsEditorOpen(false)
        } catch (error) {
            console.error('Save failed:', error)
        }
    }

    // Loading
    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-gray-500">{t('กำลังโหลด...', 'Loading...')}</p>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-black text-gray-900 dark:text-white">
                        {t('📦 จัดการสินค้า', '📦 Products')}
                    </h1>
                    <p className="text-gray-500 mt-1">
                        {products.length} {t('รายการ', 'items')} •
                        {products.filter(p => p.status === 'active').length} {t('เปิดขาย', 'active')}
                    </p>
                </div>
                <div className="flex gap-3">
                    <Link
                        href="/sell"
                        className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl font-bold shadow-lg shadow-purple-500/25 transition-all"
                    >
                        <Plus className="w-5 h-5" />
                        {t('เพิ่มสินค้า', 'Add Product')}
                    </Link>
                </div>
            </div>

            {/* AI Health Summary */}
            {products.length > 0 && (
                <AIHealthSummaryCard products={products} />
            )}

            {/* Status Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-2">
                {statusTabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm whitespace-nowrap transition-all ${activeTab === tab.id
                            ? 'bg-indigo-600 text-white shadow-lg'
                            : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50'
                            }`}
                    >
                        {language === 'th' ? tab.labelTh : tab.labelEn}
                        <span className={`px-2 py-0.5 rounded-full text-xs ${activeTab === tab.id
                            ? 'bg-white/20'
                            : tab.color === 'red' ? 'bg-red-100 text-red-700'
                                : tab.color === 'amber' ? 'bg-amber-100 text-amber-700'
                                    : tab.color === 'emerald' ? 'bg-emerald-100 text-emerald-700'
                                        : 'bg-gray-100 text-gray-600'
                            }`}>
                            {tab.count}
                        </span>
                    </button>
                ))}
            </div>

            {/* Toolbar */}
            <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row gap-4 justify-between items-center">
                {/* Search */}
                <div className="relative flex-1 w-full sm:w-auto">
                    <input
                        type="text"
                        placeholder={t('ค้นหาสินค้า...', 'Search products...')}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900 focus:outline-none focus:border-indigo-500 transition-colors"
                    />
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>

                {/* Sort & Bulk Actions */}
                <div className="flex items-center gap-3">
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as any)}
                        className="px-3 py-2 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900 text-sm"
                    >
                        <option value="newest">{t('ใหม่ล่าสุด', 'Newest')}</option>
                        <option value="price">{t('ราคาสูงสุด', 'Highest Price')}</option>
                        <option value="stock">{t('สต็อกน้อย', 'Low Stock')}</option>
                    </select>

                    {selectedIds.size > 0 && (
                        <div className="flex items-center gap-2 bg-indigo-50 dark:bg-indigo-900/30 px-4 py-2 rounded-xl border-2 border-indigo-200 dark:border-indigo-700">
                            <span className="text-sm font-bold text-indigo-700 dark:text-indigo-300">
                                {selectedIds.size} {t('รายการ', 'items')}
                            </span>
                            <button
                                onClick={() => handleBulkAction('publish')}
                                className="p-1.5 hover:bg-white rounded-lg text-emerald-600"
                                title={t('เปิดขาย', 'Publish')}
                            >
                                <Eye className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => handleBulkAction('hide')}
                                className="p-1.5 hover:bg-white rounded-lg text-amber-600"
                                title={t('ซ่อน', 'Hide')}
                            >
                                <EyeOff className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => handleBulkAction('delete')}
                                className="p-1.5 hover:bg-white rounded-lg text-red-600"
                                title={t('ลบ', 'Delete')}
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Products Table */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-gray-50 dark:bg-gray-900/50 text-gray-600 dark:text-gray-400 text-sm">
                                <th className="p-4 w-12 text-center">
                                    <input
                                        type="checkbox"
                                        className="rounded border-gray-300"
                                        checked={selectedIds.size === filteredProducts.length && filteredProducts.length > 0}
                                        onChange={toggleAll}
                                    />
                                </th>
                                <th className="p-4 font-semibold text-left">{t('สินค้า', 'Product')}</th>
                                <th className="p-4 font-semibold text-left">{t('ราคา', 'Price')}</th>
                                <th className="p-4 font-semibold text-left">{t('สต็อก', 'Stock')}</th>
                                <th className="p-4 font-semibold text-left">
                                    <div className="flex items-center gap-1">
                                        <Sparkles className="w-4 h-4 text-purple-500" />
                                        {t('AI คะแนน', 'AI Score')}
                                    </div>
                                </th>
                                <th className="p-4 font-semibold text-left">{t('สถานะ', 'Status')}</th>
                                <th className="p-4 font-semibold text-right">{t('จัดการ', 'Actions')}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                            {filteredProducts.map((product) => (
                                <ProductRowWithAI
                                    key={product.id}
                                    product={product}
                                    isSelected={selectedIds.has(product.id)}
                                    onToggleSelect={() => toggleSelection(product.id)}
                                    onEdit={() => {
                                        setEditingProduct(product)
                                        setIsEditorOpen(true)
                                    }}
                                    onDelete={() => handleDelete(product.id)}
                                    isDeleting={deletingId === product.id}
                                    t={t}
                                    language={language}
                                />
                            ))}
                            {filteredProducts.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="p-12 text-center">
                                        <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                                        <p className="text-gray-500 font-medium">
                                            {searchQuery
                                                ? t('ไม่พบสินค้าที่ค้นหา', 'No products found')
                                                : t('ยังไม่มีสินค้า', 'No products yet')
                                            }
                                        </p>
                                        {!searchQuery && (
                                            <Link
                                                href="/sell"
                                                className="inline-flex items-center gap-2 mt-4 text-indigo-600 hover:text-indigo-700 font-medium"
                                            >
                                                <Plus className="w-4 h-4" />
                                                {t('เพิ่มสินค้าแรก', 'Add your first product')}
                                            </Link>
                                        )}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Product Editor Modal */}
            <ProductEditorModal
                isOpen={isEditorOpen}
                onClose={() => setIsEditorOpen(false)}
                product={editingProduct}
                onSave={handleSaveProduct}
            />
        </div>
    )
}
