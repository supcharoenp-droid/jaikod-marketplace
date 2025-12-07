'use client'

import { useParams } from 'next/navigation'
import Link from 'next/link'
import Button from '@/components/ui/Button'
import { CATEGORIES } from '@/constants/categories'
import { MOCK_PRODUCTS } from '@/constants/mockProducts'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import ProductCard from '@/components/product/ProductCard'

export default function CategoryPage() {
    const params = useParams()
    const slug = params.slug as string

    const category = CATEGORIES.find(c => c.slug === slug)
    const categoryProducts = MOCK_PRODUCTS.filter(p => p.category?.slug === slug)

    if (!category) {
        return (
            <div className="min-h-screen flex flex-col">
                <Header />
                <main className="flex-1 flex flex-col items-center justify-center p-4">
                    <h1 className="text-2xl font-bold mb-4">ไม่พบหมวดหมู่</h1>
                    <Link href="/">
                        <Button variant="primary">กลับสู่หน้าหลัก</Button>
                    </Link>
                </main>
                <Footer />
            </div>
        )
    }

    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1 bg-gray-50 dark:bg-bg-dark py-8">
                <div className="container mx-auto px-4">
                    {/* Category Header */}
                    <div className="flex items-center space-x-4 mb-8">
                        <span className="text-4xl">{category.icon}</span>
                        <div>
                            <h1 className="text-3xl font-display font-bold">{category.name_th}</h1>
                            <p className="text-text-secondary dark:text-gray-400">{category.name_en}</p>
                        </div>
                    </div>

                    {/* Product Grid or Empty State */}
                    {categoryProducts.length > 0 ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                            {categoryProducts.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white dark:bg-surface-dark rounded-xl p-8 text-center border border-gray-100 dark:border-gray-800">
                            <p className="text-lg text-text-secondary dark:text-gray-400 mb-4">
                                ยังไม่มีสินค้าในหมวดหมู่นี้
                            </p>
                            <Button variant="outline">ลงขายสินค้าในหมวดนี้</Button>
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    )
}
