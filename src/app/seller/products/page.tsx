'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import {
    Plus,
    Search,
    Edit,
    Trash2,
    Eye,
    MoreHorizontal,
    Package,
    CheckSquare,
    Square,
    BarChart,
    Settings,
    Wand2,
    LayoutGrid,
    List as ListIcon
} from 'lucide-react'
import Button from '@/components/ui/Button'
import { useAuth } from '@/contexts/AuthContext'
import { useLanguage } from '@/contexts/LanguageContext'
import { getProductsBySeller, deleteProduct, updateProduct, createProduct } from '@/lib/products'
import { Product } from '@/types'
import ProductEditorModal from '@/components/seller/ProductEditorModal'
import ProductAnalyzer from '@/components/seller/ProductAnalyzer'
// import { toast } from 'react-hot-toast' // Not installed

export default function SellerProductsPage() {
    const { user } = useAuth()
    const { t } = useLanguage()
    const router = useRouter()
    const [products, setProducts] = useState<Product[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')

    // View State
    const [viewMode, setViewMode] = useState<'list' | 'analyzer'>('list')

    // Selection State
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())

    // Editor State
    const [isEditorOpen, setIsEditorOpen] = useState(false)
    const [editingProduct, setEditingProduct] = useState<Product | null>(null)
    const [deletingId, setDeletingId] = useState<string | null>(null)

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
                console.error('[SellerProducts] Error fetching seller products:', error)
            } finally {
                setIsLoading(false)
            }
        }

        fetchProducts()
    }, [user])

    // --- Bulk Actions ---
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

    const handleBulkAction = async (action: 'delete' | 'publish' | 'unpublish') => {
        if (!confirm(`Confirm ${action} for ${selectedIds.size} items?`)) return

        try {
            const updates = []
            for (const id of Array.from(selectedIds)) {
                if (action === 'delete') {
                    updates.push(deleteProduct(id))
                } else if (action === 'publish') {
                    updates.push(updateProduct(id, { status: 'active' } as any))
                } else if (action === 'unpublish') {
                    updates.push(updateProduct(id, { status: 'hidden' } as any))
                }
            }
            await Promise.all(updates)

            // Refund local
            if (action === 'delete') {
                setProducts(prev => prev.filter(p => !selectedIds.has(p.id)))
            } else {
                // Refresh full list (or update locally if preferred)
                if (user) {
                    const data = await getProductsBySeller(user.uid)
                    setProducts(data)
                }
            }
            setSelectedIds(new Set())
            alert('Batch action completed')
        } catch (error) {
            console.error(error)
            alert('Batch action failed')
        }
    }

    // --- CRUD ---
    const handleSaveProduct = async (data: Partial<Product>) => {
        if (!user) return

        try {
            if (editingProduct) {
                // Update
                // We need to map Product type back to CreateProductInput if using lib strictly, 
                // but updateProduct takes Partial<CreateProductInput> anyway which is loose compatible mostly
                await updateProduct(editingProduct.id, data as any)
                setProducts(prev => prev.map(p => p.id === editingProduct.id ? { ...p, ...data } : p))
                alert('Updated successfully')
            } else {
                // Create
                // Basic mock of required fields if not present
                const input: any = {
                    ...data,
                    category_id: data.category_id || '1', // Default
                    images: data.images || [],
                    price_type: 'fixed',
                    province: 'Bangkok', // Default
                    amphoe: 'Pathum Wan',
                    district: 'Lumphini',
                    zipcode: '10330',
                    can_ship: true,
                    can_pickup: false
                }
                const newId = await createProduct(input, user.uid, user.displayName || 'Seller')
                // Refresh to get full object
                if (user) {
                    const data = await getProductsBySeller(user.uid)
                    setProducts(data)
                }
                alert('Created successfully')
            }
            setIsEditorOpen(false)
        } catch (error) {
            console.error(error)
            alert('Save failed: ' + error)
        }
    }

    const handleDelete = async (id: string | number) => {
        if (!confirm('คุณแน่ใจหรือไม่ว่าต้องการลบสินค้านี้? การกระทำนี้ไม่สามารถยกเลิกได้')) return
        const productId = String(id)
        try {
            setDeletingId(productId)
            await deleteProduct(productId)
            setProducts(prev => prev.filter(p => String(p.id) !== productId))
        } catch (error) {
            console.error('Error deleting product:', error)
        } finally {
            setDeletingId(null)
        }
    }

    const filteredProducts = products.filter(p =>
        p.title.toLowerCase().includes(searchQuery.toLowerCase())
    )

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="w-8 h-8 border-4 border-neon-purple border-t-transparent rounded-full animate-spin"></div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t('seller_products.title')}</h1>
                    <p className="text-text-secondary dark:text-gray-400">
                        {products.length} {t('common.items')}
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button
                        onClick={() => setViewMode('analyzer')}
                        variant={viewMode === 'analyzer' ? 'primary' : 'outline'}
                        className="gap-2"
                    >
                        <Wand2 className="w-4 h-4" /> {t('seller_products.ai_analyzer')}
                    </Button>
                    <Button
                        onClick={() => {
                            setEditingProduct(null)
                            setIsEditorOpen(true)
                        }}
                        variant="primary"
                    >
                        <Plus className="w-5 h-5 mr-2" />
                        {t('seller_products.add_product')}
                    </Button>
                </div>
            </div>

            {/* View Switching */}
            {viewMode === 'analyzer' ? (
                <div>
                    <button onClick={() => setViewMode('list')} className="mb-4 text-sm text-gray-500 hover:underline">
                        &larr; Back to List
                    </button>
                    <ProductAnalyzer products={products} />
                </div>
            ) : (
                <>
                    {/* Toolbar */}
                    <div className="bg-white dark:bg-surface-dark p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row gap-4 justify-between items-center">
                        <div className="relative flex-1 w-full sm:w-auto">
                            <input
                                type="text"
                                placeholder={t('seller_products.search_placeholder')}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-bg-dark focus:outline-none focus:ring-2 focus:ring-neon-purple"
                            />
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        </div>

                        {selectedIds.size > 0 && (
                            <div className="flex items-center gap-2 bg-indigo-50 dark:bg-indigo-900/20 px-4 py-2 rounded-lg border border-indigo-100 dark:border-indigo-800 animate-in fade-in slide-in-from-right-4 duration-200">
                                <span className="text-sm font-bold text-indigo-700 dark:text-indigo-300 mr-2">{selectedIds.size} selected</span>
                                <button onClick={() => handleBulkAction('publish')} className="p-1.5 hover:bg-white rounded text-green-600" title="Publish"><CheckSquare className="w-4 h-4" /></button>
                                <button onClick={() => handleBulkAction('unpublish')} className="p-1.5 hover:bg-white rounded text-amber-600" title="Unpublish"><Square className="w-4 h-4" /></button>
                                <button onClick={() => handleBulkAction('delete')} className="p-1.5 hover:bg-white rounded text-red-600" title="Delete"><Trash2 className="w-4 h-4" /></button>
                            </div>
                        )}
                    </div>

                    {/* Table */}
                    <div className="bg-white dark:bg-surface-dark rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-50 dark:bg-gray-800/50 text-text-secondary dark:text-gray-400 text-sm">
                                        <th className="p-4 w-12 text-center">
                                            <input
                                                type="checkbox"
                                                className="rounded border-gray-300"
                                                checked={selectedIds.size === filteredProducts.length && filteredProducts.length > 0}
                                                onChange={toggleAll}
                                            />
                                        </th>
                                        <th className="p-4 font-medium pl-2">{t('seller_products.product')}</th>
                                        <th className="p-4 font-medium">{t('seller_products.price')}</th>
                                        <th className="p-4 font-medium">{t('seller_products.status')}</th>
                                        <th className="p-4 font-medium">{t('seller_products.stock')}</th>
                                        <th className="p-4 font-medium text-right pr-6">{t('seller_products.actions')}</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                    {filteredProducts.map((product) => (
                                        <tr key={product.id} className={`hover:bg-gray-50 dark:hover:bg-gray-800/20 transition-colors ${selectedIds.has(product.id) ? 'bg-indigo-50/50 dark:bg-indigo-900/10' : ''}`}>
                                            <td className="p-4 text-center">
                                                <input
                                                    type="checkbox"
                                                    className="rounded border-gray-300"
                                                    checked={selectedIds.has(product.id)}
                                                    onChange={() => toggleSelection(product.id)}
                                                />
                                            </td>
                                            <td className="p-4 pl-2">
                                                <div className="flex items-center gap-4">
                                                    <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-200 dark:border-gray-700">
                                                        {product.images && product.images.length > 0 ? (
                                                            <Image
                                                                src={typeof product.images[0] === 'string' ? product.images[0] : product.images[0].url}
                                                                alt={product.title}
                                                                fill
                                                                className="object-cover"
                                                            />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                                <Package className="w-5 h-5" />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="min-w-0">
                                                        <h3 className="font-medium text-gray-900 dark:text-white truncate max-w-[200px]">
                                                            {product.title}
                                                        </h3>
                                                        {/* Optional EN title preview */}
                                                        {product.title_en && <p className="text-xs text-gray-400 truncate">{product.title_en}</p>}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-4 font-medium">฿{product.price.toLocaleString()}</td>
                                            <td className="p-4">
                                                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${product.status === 'active'
                                                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                                                    : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
                                                    }`}>
                                                    {product.status === 'active' ? 'Active' : 'Hidden'}
                                                </span>
                                            </td>
                                            <td className="p-4 text-sm font-mono text-gray-600 dark:text-gray-400">{product.stock}</td>
                                            <td className="p-4 pr-6 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => {
                                                            setEditingProduct(product)
                                                            setIsEditorOpen(true)
                                                        }}
                                                        className="p-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg text-blue-600 transition-colors"
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(product.id)}
                                                        className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg text-red-600 transition-colors"
                                                        disabled={deletingId === String(product.id)}
                                                    >
                                                        {deletingId === String(product.id) ? (
                                                            <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                                                        ) : (
                                                            <Trash2 className="w-4 h-4" />
                                                        )}
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {filteredProducts.length === 0 && (
                                        <tr>
                                            <td colSpan={6} className="p-8 text-center text-gray-500">
                                                {t('seller_products.no_products')}
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            )}

            {/* Modal */}
            <ProductEditorModal
                isOpen={isEditorOpen}
                onClose={() => setIsEditorOpen(false)}
                product={editingProduct}
                onSave={handleSaveProduct}
            />
        </div>
    )
}
