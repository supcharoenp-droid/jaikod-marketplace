'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import Button from '@/components/ui/Button'
import { CATEGORIES } from '@/constants/categories'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import ProductCard from '@/components/product/ProductCard'
import { getProductsByCategory } from '@/lib/products' // Import real data fetcher
import { Product } from '@/types'

export default function CategoryPage() {
    const params = useParams()
    const slug = params.slug as string

    // State
    const [products, setProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState(true)
    const [activeSubId, setActiveSubId] = useState<number | null>(null)

    // Data
    const category = CATEGORIES.find(c => c.slug === slug)

    // Fetch Products
    useEffect(() => {
        const fetchProducts = async () => {
            if (!category) return

            setLoading(true)
            try {
                // If subcategory selected, fetch that. Else fetch main category (which includes subs recursively in lib)
                const idToFetch = activeSubId || category.id
                const fetched = await getProductsByCategory(idToFetch)
                setProducts(fetched)
            } catch (error) {
                console.error("Failed to fetch products", error)
            } finally {
                setLoading(false)
            }
        }

        if (category) {
            fetchProducts()
        }
    }, [category, activeSubId]) // Re-fetch on subcategory change

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

                    {/* Subcategories Filter Chips */}
                    {category.subcategories && category.subcategories.length > 0 && (
                        <div className="flex overflow-x-auto gap-3 mb-8 pb-2 no-scrollbar">
                            <button
                                onClick={() => setActiveSubId(null)}
                                className={`
                                    px-5 py-2 rounded-full whitespace-nowrap transition-all font-medium
                                    ${activeSubId === null
                                        ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/30'
                                        : 'bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'
                                    }
                                `}
                            >
                                ทั้งหมด
                            </button>
                            {category.subcategories.map(sub => (
                                <button
                                    key={sub.id}
                                    onClick={() => setActiveSubId(sub.id)}
                                    className={`
                                        px-5 py-2 rounded-full whitespace-nowrap transition-all font-medium
                                        ${activeSubId === sub.id
                                            ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/30'
                                            : 'bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'
                                        }
                                    `}
                                >
                                    {sub.name_th}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Loading State or Grid */}
                    {loading ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 animate-pulse">
                            {[...Array(5)].map((_, i) => (
                                <div key={i} className="aspect-[4/5] bg-gray-200 dark:bg-gray-800 rounded-3xl"></div>
                            ))}
                        </div>
                    ) : products.length > 0 ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                            {products.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white dark:bg-surface-dark rounded-3xl p-12 text-center border border-gray-100 dark:border-gray-800 shadow-sm">
                            <div className="text-4xl mb-4 opacity-50">🔍</div>
                            <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-2">ยังไม่มีสินค้าในหมวดหมู่นี้</h3>
                            <p className="text-text-secondary dark:text-gray-400 mb-6">
                                เป็นคนแรกที่เริ่มลงขายสินค้าในกลุ่มนี้กันเถอะ!
                            </p>
                            <Link href="/sell">
                                <Button variant="primary" className="shadow-xl shadow-purple-500/20">
                                    + ลงขายสินค้าทันที
                                </Button>
                            </Link>
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    )
}
