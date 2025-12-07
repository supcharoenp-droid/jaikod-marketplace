'use client'

import Link from 'next/link'
import { CATEGORIES } from '@/constants/categories'

export default function Categories() {
    return (
        <section className="py-12 bg-white dark:bg-bg-dark">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl md:text-3xl font-display font-semibold">
                        หมวดหมู่สินค้า
                    </h2>
                    <Link
                        href="/categories"
                        className="text-neon-purple hover:text-purple-600 font-medium transition-colors"
                    >
                        ดูทั้งหมด →
                    </Link>
                </div>

                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-10 gap-4">
                    {CATEGORIES.map((category) => (
                        <Link
                            key={category.id}
                            href={`/category/${category.slug}`}
                            className="group"
                        >
                            <div className="flex flex-col items-center p-4 rounded-xl bg-gray-50 dark:bg-surface-dark hover:bg-gradient-to-br hover:from-purple-50 hover:to-orange-50 dark:hover:from-purple-900/20 dark:hover:to-orange-900/20 transition-all duration-300 card-hover">
                                <div className="text-4xl mb-2 group-hover:scale-110 transition-transform duration-300">
                                    {category.icon}
                                </div>
                                <span className="text-xs md:text-sm text-center font-medium text-text-primary dark:text-text-light group-hover:text-neon-purple transition-colors">
                                    {category.name_th}
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    )
}
