'use client'

import { Tag } from 'lucide-react'
import Link from 'next/link'

interface RelatedKeywordsProps {
    category: string
    brand?: string
    model?: string
    tags?: string[]
}

export default function RelatedKeywords({
    category,
    brand,
    model,
    tags = []
}: RelatedKeywordsProps) {
    // Generate related keywords based on product info
    const keywords = [
        category,
        brand,
        model,
        ...tags
    ].filter(Boolean).slice(0, 10)

    if (keywords.length === 0) {
        return null
    }

    return (
        <div className="bg-white dark:bg-surface-dark rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-2 mb-4">
                <Tag className="w-5 h-5 text-gray-500" />
                <h3 className="font-bold text-gray-900 dark:text-white">
                    คำค้นหาที่เกี่ยวข้อง
                </h3>
            </div>
            <div className="flex flex-wrap gap-2">
                {keywords.map((keyword, index) => keyword && (
                    <Link
                        key={index}
                        href={`/search?q=${encodeURIComponent(String(keyword))}`}
                        className="px-4 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full text-sm text-gray-700 dark:text-gray-300 transition-colors"
                    >
                        {keyword}
                    </Link>
                ))}
            </div>
        </div>
    )
}
