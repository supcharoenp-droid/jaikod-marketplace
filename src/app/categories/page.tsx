'use client'

import Link from 'next/link'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { CATEGORIES } from '@/constants/categories'
import { MOCK_PRODUCTS } from '@/constants/mockProducts'
import { ArrowRight } from 'lucide-react'

export default function CategoriesPage() {
    // Count products per category
    const categoryCounts = CATEGORIES.map(cat => ({
        ...cat,
        count: MOCK_PRODUCTS.filter(p => p.category_id === cat.id).length
    }))

    // Featured categories with large cards
    const featuredCategories = categoryCounts.slice(0, 6)
    const otherCategories = categoryCounts.slice(6)

    return (
        <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-bg-dark">
            <Header />
            <main className="flex-1">
                {/* Hero */}
                <section className="py-12 bg-gradient-to-br from-neon-purple via-purple-600 to-coral-orange text-white">
                    <div className="container mx-auto px-4 text-center">
                        <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
                            หมวดหมู่ทั้งหมด
                        </h1>
                        <p className="text-xl text-white/80">
                            เลือกหมวดหมู่ที่คุณสนใจ พบสินค้ากว่า {MOCK_PRODUCTS.length}+ รายการ
                        </p>
                    </div>
                </section>

                {/* Featured Categories */}
                <section className="py-12">
                    <div className="container mx-auto px-4">
                        <h2 className="text-2xl font-bold mb-6">หมวดหมู่ยอดนิยม</h2>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {featuredCategories.map((category) => (
                                <Link
                                    key={category.id}
                                    href={`/category/${category.slug}`}
                                    className="group relative bg-white dark:bg-surface-dark rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all overflow-hidden"
                                >
                                    {/* Background Gradient */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-neon-purple/5 to-coral-orange/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>

                                    {/* Content */}
                                    <div className="relative z-10">
                                        <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">
                                            {category.icon}
                                        </div>
                                        <h3 className="text-2xl font-bold mb-2 group-hover:text-neon-purple transition-colors">
                                            {category.name_th}
                                        </h3>
                                        <p className="text-text-secondary dark:text-gray-400 mb-4">
                                            {category.count} สินค้า
                                        </p>
                                        <div className="flex items-center text-neon-purple font-medium">
                                            ดูทั้งหมด
                                            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform" />
                                        </div>
                                    </div>

                                    {/* Decorative Circle */}
                                    <div className="absolute -right-8 -bottom-8 w-32 h-32 rounded-full bg-gradient-to-br from-neon-purple/10 to-coral-orange/10 group-hover:scale-150 transition-transform"></div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>

                {/* All Categories Grid */}
                {otherCategories.length > 0 && (
                    <section className="py-12 bg-white dark:bg-surface-dark">
                        <div className="container mx-auto px-4">
                            <h2 className="text-2xl font-bold mb-6">หมวดหมู่อื่นๆ</h2>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {otherCategories.map((category) => (
                                    <Link
                                        key={category.id}
                                        href={`/category/${category.slug}`}
                                        className="group flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                                    >
                                        <span className="text-3xl">{category.icon}</span>
                                        <div className="flex-1">
                                            <h3 className="font-bold group-hover:text-neon-purple transition-colors">
                                                {category.name_th}
                                            </h3>
                                            <p className="text-sm text-text-secondary">{category.count} สินค้า</p>
                                        </div>
                                        <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-neon-purple transition-colors" />
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </section>
                )}

                {/* Quick Links */}
                <section className="py-12">
                    <div className="container mx-auto px-4">
                        <div className="bg-gradient-to-r from-neon-purple/10 to-coral-orange/10 rounded-3xl p-8">
                            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                                <div>
                                    <h2 className="text-2xl font-bold mb-2">ไม่เจอสิ่งที่มองหา?</h2>
                                    <p className="text-text-secondary">ลองค้นหาด้วยคำที่ต้องการ หรือลงขายสินค้าของคุณ</p>
                                </div>
                                <div className="flex gap-4">
                                    <Link href="/" className="px-6 py-3 bg-white dark:bg-surface-dark rounded-xl font-bold shadow-sm hover:shadow-md transition-shadow">
                                        🔍 ค้นหาสินค้า
                                    </Link>
                                    <Link href="/sell" className="px-6 py-3 bg-neon-purple text-white rounded-xl font-bold hover:bg-purple-600 transition-colors">
                                        📦 ลงขายสินค้า
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Category Stats */}
                <section className="py-12 bg-white dark:bg-surface-dark">
                    <div className="container mx-auto px-4">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                            <div>
                                <div className="text-4xl font-bold text-neon-purple mb-2">{CATEGORIES.length}</div>
                                <div className="text-text-secondary">หมวดหมู่</div>
                            </div>
                            <div>
                                <div className="text-4xl font-bold text-neon-purple mb-2">{MOCK_PRODUCTS.length}+</div>
                                <div className="text-text-secondary">สินค้า</div>
                            </div>
                            <div>
                                <div className="text-4xl font-bold text-neon-purple mb-2">10K+</div>
                                <div className="text-text-secondary">ผู้ขาย</div>
                            </div>
                            <div>
                                <div className="text-4xl font-bold text-neon-purple mb-2">50K+</div>
                                <div className="text-text-secondary">ผู้ซื้อ</div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    )
}
