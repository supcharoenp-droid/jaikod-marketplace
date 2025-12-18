'use client'

import React from 'react'
import { FileText } from 'lucide-react'
import { CATEGORY_FORMS } from '@/config/category-forms'

interface Step5SmartFormProps {
    categoryId: number
    attributes: Record<string, any>
    description: string
    condition: string
    onAttributesChange: (attributes: Record<string, any>) => void
    onDescriptionChange: (description: string) => void
    onConditionChange: (condition: string) => void
    language: 'th' | 'en'
}

export default function Step5SmartForm({
    categoryId,
    attributes,
    description,
    condition,
    onAttributesChange,
    onDescriptionChange,
    onConditionChange,
    language
}: Step5SmartFormProps) {
    const fields = CATEGORY_FORMS[categoryId.toString()] || []

    const content = {
        th: { title: 'รายละเอียดสินค้า', description: 'คำอธิบาย', condition: 'สภาพ' },
        en: { title: 'Product Details', description: 'Description', condition: 'Condition' }
    }
    const t = content[language]

    return (
        <div className="space-y-6">
            <div className="text-center">
                <h2 className="text-2xl font-bold mb-2">{t.title}</h2>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 space-y-4">
                {fields.map(field => (
                    <div key={field.id}>
                        <label className="block text-sm font-medium mb-2">{field.label}</label>
                        {field.type === 'select' ? (
                            <select
                                className="w-full px-4 py-2 border rounded-xl"
                                value={attributes[field.id] || ''}
                                onChange={(e) => onAttributesChange({ ...attributes, [field.id]: e.target.value })}
                            >
                                <option value="">เลือก...</option>
                                {field.options?.map(opt => (
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                ))}
                            </select>
                        ) : field.type === 'textarea' ? (
                            <textarea
                                className="w-full px-4 py-2 border rounded-xl"
                                value={description}
                                onChange={(e) => onDescriptionChange(e.target.value)}
                                rows={4}
                            />
                        ) : (
                            <input
                                type={field.type}
                                className="w-full px-4 py-2 border rounded-xl"
                                value={attributes[field.id] || ''}
                                onChange={(e) => onAttributesChange({ ...attributes, [field.id]: e.target.value })}
                                placeholder={field.placeholder}
                            />
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}
