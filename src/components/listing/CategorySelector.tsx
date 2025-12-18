'use client'

import React, { useState, useEffect } from 'react'
import { ChevronDown } from 'lucide-react'
import { CATEGORIES } from '@/constants/categories'

interface CategorySelectorProps {
    selectedCategoryId: number
    selectedSubcategoryId?: number
    language: 'th' | 'en'
    onCategoryChange: (categoryId: number, subcategoryId?: number) => void
}

export default function CategorySelector({
    selectedCategoryId,
    selectedSubcategoryId,
    language,
    onCategoryChange
}: CategorySelectorProps) {
    const [mainCategory, setMainCategory] = useState(selectedCategoryId)
    const [subCategory, setSubCategory] = useState(selectedSubcategoryId)

    const selectedMainCategory = CATEGORIES.find(c => c.id === mainCategory)
    const subcategories = selectedMainCategory?.subcategories || []

    const handleMainCategoryChange = (categoryId: number) => {
        setMainCategory(categoryId)
        setSubCategory(undefined)
        onCategoryChange(categoryId, undefined)
    }

    const handleSubCategoryChange = (subcategoryId: number) => {
        setSubCategory(subcategoryId)
        onCategoryChange(mainCategory, subcategoryId)
    }

    const content = {
        th: {
            mainCategory: 'หมวดหมู่หลัก',
            subCategory: 'หมวดหมู่ย่อย',
            selectMain: '🏷️ เลือกหมวดหมู่หลัก',
            selectSub: 'เลือกหมวดหมู่ย่อย',
            all: 'ทั้งหมด'
        },
        en: {
            mainCategory: 'Main Category',
            subCategory: 'Subcategory',
            selectMain: '🏷️ Select Main Category',
            selectSub: 'Select Subcategory',
            all: 'All'
        }
    }

    const t = content[language]

    return (
        <div className="space-y-4">
            {/* Main Category */}
            <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    {t.mainCategory} *
                </label>
                <div className="relative">
                    <select
                        value={mainCategory || 0}
                        onChange={(e) => handleMainCategoryChange(parseInt(e.target.value))}
                        className="w-full px-4 py-3 pr-10 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white appearance-none cursor-pointer font-medium transition-all hover:border-purple-400"
                    >
                        <option value={0} disabled>
                            {t.selectMain}
                        </option>
                        {CATEGORIES.map(category => (
                            <option key={category.id} value={category.id}>
                                {category.icon} {language === 'th' ? category.name_th : category.name_en}
                            </option>
                        ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                </div>
            </div>

            {/* Subcategory - Only show if main category is selected and has subcategories */}
            {mainCategory > 0 && subcategories.length > 0 && (
                <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        {t.subCategory}
                    </label>
                    <div className="relative">
                        <select
                            value={subCategory || 0}
                            onChange={(e) => handleSubCategoryChange(parseInt(e.target.value))}
                            className="w-full px-4 py-3 pr-10 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white appearance-none cursor-pointer font-medium transition-all hover:border-purple-400"
                        >
                            <option value={0}>
                                {t.selectSub}
                            </option>
                            {subcategories.map(sub => (
                                <option key={sub.id} value={sub.id}>
                                    {language === 'th' ? sub.name_th : sub.name_en}
                                </option>
                            ))}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                    </div>
                </div>
            )}

            {/* Selected Category Display */}
            {mainCategory > 0 && (
                <div className="p-4 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-xl">
                    <p className="text-sm text-purple-800 dark:text-purple-200">
                        <span className="font-semibold">
                            {language === 'th' ? 'หมวดหมู่ที่เลือก:' : 'Selected Category:'}
                        </span>{' '}
                        {selectedMainCategory?.icon} {language === 'th' ? selectedMainCategory?.name_th : selectedMainCategory?.name_en}
                        {subCategory && subcategories.length > 0 && (
                            <>
                                {' › '}
                                {language === 'th'
                                    ? subcategories.find(s => s.id === subCategory)?.name_th
                                    : subcategories.find(s => s.id === subCategory)?.name_en
                                }
                            </>
                        )}
                    </p>
                </div>
            )}
        </div>
    )
}
