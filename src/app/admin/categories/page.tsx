'use client'

import { useState, useEffect } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import { useLanguage } from '@/contexts/LanguageContext'
import { useAdmin } from '@/contexts/AdminContext'
import {
    LayoutGrid, Plus, Edit2, Trash2, ToggleLeft, ToggleRight,
    RefreshCw, X, FolderOpen, Save
} from 'lucide-react'
import * as LucideIcons from 'lucide-react'
import {
    getAdminCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    seedCategoriesFromConstants,
    Category
} from '@/lib/admin/category-service'

// Helper to render icon by name
const DynamicIcon = ({ name, className }: { name: string, className?: string }) => {
    // @ts-ignore
    const Icon = LucideIcons[name] || LucideIcons['HelpCircle']
    return <Icon className={className} />
}

export default function CategoriesPage() {
    const { t } = useLanguage()
    const { adminUser } = useAdmin()

    const [categories, setCategories] = useState<Category[]>([])
    const [loading, setLoading] = useState(true)
    const [showModal, setShowModal] = useState(false)
    const [editingId, setEditingId] = useState<string | null>(null)

    // Form
    const [formData, setFormData] = useState({
        name: '',
        name_th: '',
        slug: '',
        icon: 'Package',
        order: 0,
        isActive: true
    })

    const fetchCats = async () => {
        setLoading(true)
        const data = await getAdminCategories()
        setCategories(data)
        setLoading(false)
    }

    useEffect(() => {
        fetchCats()
    }, [])

    const handleOpenCreate = () => {
        setEditingId(null)
        setFormData({ name: '', name_th: '', slug: '', icon: 'Package', order: categories.length, isActive: true })
        setShowModal(true)
    }

    const handleOpenEdit = (cat: Category) => {
        setEditingId(cat.id)
        setFormData({
            name: cat.name,
            name_th: cat.name_th,
            slug: cat.slug,
            icon: cat.icon,
            order: cat.order,
            isActive: cat.isActive
        })
        setShowModal(true)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!adminUser) return

        try {
            if (editingId) {
                await updateCategory(adminUser, editingId, formData)
                alert('Category updated')
            } else {
                await createCategory(adminUser, formData)
                alert('Category created')
            }
            setShowModal(false)
            fetchCats()
        } catch (error) {
            console.error(error)
            alert('Operation failed')
        }
    }

    const handleDelete = async (id: string) => {
        if (!adminUser) return
        if (!confirm('Delete this category? Products might lose their category association.')) return
        await deleteCategory(adminUser, id)
        fetchCats()
    }

    const handleSeed = async () => {
        if (!adminUser) return
        if (!confirm('Import categories from source code? This will populate the DB.')) return
        const res = await seedCategoriesFromConstants(adminUser)
        if (res.success) {
            alert(`Imported ${res.count} categories!`)
            fetchCats()
        } else {
            alert(res.message)
        }
    }

    return (
        <AdminLayout>
            <div className="space-y-6">
                <div className="flex justify-between items-center mr-2">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <LayoutGrid className="w-8 h-8 text-blue-500" />
                            {t('admin.cat_title')}
                        </h1>
                        <p className="text-gray-500">{t('admin.cat_desc')}</p>
                    </div>
                    <div className="flex gap-2">
                        {categories.length === 0 && (
                            <button
                                onClick={handleSeed}
                                className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200"
                            >
                                <RefreshCw className="w-4 h-4" />
                                {t('admin.cat_btn_seed')}
                            </button>
                        )}
                        <button
                            onClick={handleOpenCreate}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium"
                        >
                            <Plus className="w-4 h-4" />
                            {t('admin.cat_btn_add')}
                        </button>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 dark:bg-gray-900 text-gray-500">
                            <tr>
                                <th className="px-6 py-4 w-16">#</th>
                                <th className="px-6 py-4">{t('admin.cat_th_icon')}</th>
                                <th className="px-6 py-4">{t('admin.cat_th_name')}</th>
                                <th className="px-6 py-4">{t('admin.cat_th_slug')}</th>
                                <th className="px-6 py-4 text-center">{t('common.status')}</th>
                                <th className="px-6 py-4 text-right">{t('admin.table_action')}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {loading ? (
                                <tr><td colSpan={6} className="text-center py-8">{t('common.loading')}</td></tr>
                            ) : categories.length === 0 ? (
                                <tr><td colSpan={6} className="text-center py-8 text-gray-500">No categories found. Click Seed to import.</td></tr>
                            ) : categories.map(cat => (
                                <tr key={cat.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                    <td className="px-6 py-4 text-gray-500 font-mono">{cat.order}</td>
                                    <td className="px-6 py-4">
                                        <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-300">
                                            <DynamicIcon name={cat.icon} className="w-5 h-5" />
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="font-bold text-gray-900 dark:text-white">{cat.name}</div>
                                        <div className="text-xs text-blue-500">{cat.name_th}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="px-2 py-1 bg-gray-100 dark:bg-gray-900 rounded text-xs font-mono text-gray-500">
                                            {cat.slug}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        {cat.isActive ? (
                                            <span className="text-green-500 text-xs font-bold px-2 py-1 bg-green-50 dark:bg-green-900/20 rounded-full">Active</span>
                                        ) : (
                                            <span className="text-gray-400 text-xs px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded-full">Inactive</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button onClick={() => handleOpenEdit(cat)} className="p-2 text-blue-500 hover:bg-blue-50 rounded">
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button onClick={() => handleDelete(cat.id)} className="p-2 text-red-500 hover:bg-red-50 rounded">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Modal */}
                {showModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
                            <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                                <h3 className="text-lg font-bold flex items-center gap-2">
                                    {editingId ? <Edit2 className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                                    {editingId ? 'Edit Category' : t('admin.cat_btn_add')}
                                </h3>
                                <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                                    <X className="w-6 h-6" />
                                </button>
                            </div>
                            <form onSubmit={handleSubmit} className="p-6 space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">{t('admin.cat_label_name_en')}</label>
                                    <input
                                        required value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full px-3 py-2 border rounded-lg dark:bg-gray-900 dark:border-gray-700"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">{t('admin.cat_label_name_th')}</label>
                                    <input
                                        required value={formData.name_th}
                                        onChange={e => setFormData({ ...formData, name_th: e.target.value })}
                                        className="w-full px-3 py-2 border rounded-lg dark:bg-gray-900 dark:border-gray-700"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-1">{t('admin.cat_label_slug')}</label>
                                        <input
                                            required value={formData.slug}
                                            onChange={e => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                                            className="w-full px-3 py-2 border rounded-lg dark:bg-gray-900 dark:border-gray-700"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">{t('admin.cat_label_icon')}</label>
                                        <div className="flex gap-2">
                                            <input
                                                required value={formData.icon}
                                                onChange={e => setFormData({ ...formData, icon: e.target.value })}
                                                className="w-full px-3 py-2 border rounded-lg dark:bg-gray-900 dark:border-gray-700"
                                            />
                                            <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                                                <DynamicIcon name={formData.icon} className="w-6 h-6" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between pt-2">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={formData.isActive}
                                            onChange={e => setFormData({ ...formData, isActive: e.target.checked })}
                                            className="w-4 h-4 rounded text-blue-600"
                                        />
                                        <span className="text-sm font-medium">{t('admin.cat_label_active')}</span>
                                    </label>
                                    <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700">
                                        <Save className="w-4 h-4 inline-block mr-2" />
                                        Save
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    )
}
