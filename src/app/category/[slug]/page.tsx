'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import Button from '@/components/ui/Button'
import { CATEGORIES } from '@/constants/categories'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import ProductCard from '@/components/product/ProductCard'
import UnifiedProductCard from '@/components/product/UnifiedProductCard'
import { getProductsByCategory } from '@/lib/products'
import { getListingsByCategory, UniversalListing } from '@/lib/listings'
import { Product } from '@/types'
import { useLanguage } from '@/contexts/LanguageContext'
import { listingToUnifiedProduct } from '@/services/unifiedMarketplace'

// Map category slug to category_type for listings query
const SLUG_TO_CATEGORY_TYPE: Record<string, string[]> = {
    'automotive': ['car', 'motorcycle'],
    'real-estate': ['real_estate', 'land'],
    'mobiles': ['mobile'],
    'computers': ['computer'],
    'home-appliances': ['appliance'],
    'fashion': ['fashion'],
    'gaming': ['gaming'],
    'cameras': ['camera'],
    'amulets-collectibles': ['amulet'],
    'pets': ['pet'],
    'services': ['service'],
    'sports': ['sports'],
    'home-garden': ['home'],
    'beauty-cosmetics': ['beauty'],
    'baby-kids': ['baby'],
    'books-education': ['book'],
    'food-beverages': ['food'],
    'health-supplements': ['health'],
    'musical-instruments': ['music'],
    'jobs-freelance': ['job'],
    'tickets-vouchers': ['ticket'],
    'others': ['other', 'general'],
}

export default function CategoryPage() {
    const params = useParams()
    const slug = params.slug as string
    const { language } = useLanguage()
    const lang = language as 'th' | 'en'

    // State
    const [products, setProducts] = useState<Product[]>([])
    const [listings, setListings] = useState<UniversalListing[]>([])
    const [loading, setLoading] = useState(true)
    const [activeSubId, setActiveSubId] = useState<number | null>(null)

    // Data
    const category = CATEGORIES.find(c => c.slug === slug)

    // Translations
    const t = {
        categoryNotFound: lang === 'th' ? 'ไม่พบหมวดหมู่' : 'Category Not Found',
        backToHome: lang === 'th' ? 'กลับสู่หน้าหลัก' : 'Back to Home',
        all: lang === 'th' ? 'ทั้งหมด' : 'All',
        noProducts: lang === 'th' ? 'ยังไม่มีสินค้าในหมวดหมู่นี้' : 'No products in this category yet',
        beFirst: lang === 'th'
            ? 'เป็นคนแรกที่เริ่มลงขายสินค้าในกลุ่มนี้กันเถอะ!'
            : 'Be the first to list your product in this category!',
        startSelling: lang === 'th' ? '+ ลงขายสินค้าทันที' : '+ Start Selling Now',
    }

    // Fetch Products and Listings
    useEffect(() => {
        const fetchData = async () => {
            if (!category) return

            setLoading(true)
            try {
                // Fetch legacy products by category ID
                const idToFetch = activeSubId || category.id
                const fetchedProducts = await getProductsByCategory(idToFetch)
                setProducts(fetchedProducts)

                // Fetch new listings by category_type
                const categoryTypes = SLUG_TO_CATEGORY_TYPE[slug] || []
                if (categoryTypes.length > 0) {
                    const listingsPromises = categoryTypes.map(type =>
                        getListingsByCategory(type as any, 50)
                    )
                    const listingsResults = await Promise.all(listingsPromises)
                    let allListings = listingsResults.flat()

                    // Filter by subcategory if selected
                    if (activeSubId !== null) {
                        // Find the subcategory name/slug
                        const selectedSub = category.subcategories?.find(s => s.id === activeSubId)
                        if (selectedSub) {
                            // Filter listings that match subcategory
                            allListings = allListings.filter(listing => {
                                // Priority 1: Check subcategory_id match
                                if (listing.subcategory_id === activeSubId) return true

                                // Priority 2: Check template_data.subcategory
                                const templateSub = (listing.template_data?.subcategory || '').toLowerCase()
                                const subNameEn = selectedSub.name_en?.toLowerCase() || ''
                                const subNameTh = selectedSub.name_th?.toLowerCase() || ''

                                if (templateSub && (templateSub.includes(subNameEn) || templateSub.includes(subNameTh))) {
                                    return true
                                }

                                // Priority 3: Check category_type mapping for automotive subcategories
                                // Map subcategory to category_type
                                const subCategoryTypeMap: Record<string, string[]> = {
                                    // Automotive
                                    'รถยนต์มือสอง': ['car'],
                                    'Used Cars': ['car'],
                                    'มอเตอร์ไซค์': ['motorcycle'],
                                    'Motorcycles': ['motorcycle'],
                                    'อะไหล่รถยนต์': ['car'],
                                    'Car Parts': ['car'],
                                    'อะไหล่มอเตอร์ไซค์': ['motorcycle'],
                                    'Motorcycle Parts': ['motorcycle'],
                                }

                                const expectedTypes = subCategoryTypeMap[subNameTh] || subCategoryTypeMap[subNameEn] || []
                                if (expectedTypes.includes(listing.category_type)) {
                                    // Further filter by checking if it's parts vs vehicle
                                    const isParts = subNameTh.includes('อะไหล่') || subNameEn.toLowerCase().includes('parts')
                                    const listingIsParts = listing.template_data?.is_parts === true ||
                                        listing.title?.includes('อะไหล่') ||
                                        listing.title_th?.includes('อะไหล่')

                                    // If searching for parts, only return parts
                                    // If searching for vehicles, only return vehicles
                                    if (isParts === listingIsParts) return true
                                }

                                return false
                            })
                        }
                    }

                    // Sort by created_at descending
                    allListings.sort((a, b) =>
                        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
                    )
                    setListings(allListings)
                }
            } catch (error) {
                console.error("Failed to fetch data", error)
            } finally {
                setLoading(false)
            }
        }

        if (category) {
            fetchData()
        }
    }, [category, activeSubId, slug])

    if (!category) {
        return (
            <div className="min-h-screen flex flex-col">
                <Header />
                <main className="flex-1 flex flex-col items-center justify-center p-4">
                    <h1 className="text-2xl font-bold mb-4">{t.categoryNotFound}</h1>
                    <Link href="/">
                        <Button variant="primary">{t.backToHome}</Button>
                    </Link>
                </main>
                <Footer />
            </div>
        )
    }

    // Get category name based on language
    const categoryName = lang === 'th' ? category.name_th : category.name_en
    const categorySubtitle = lang === 'th' ? category.name_en : category.name_th

    // Combine listings and products for display, listings first
    const hasItems = listings.length > 0 || products.length > 0

    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1 bg-gray-50 dark:bg-bg-dark py-8">
                <div className="container mx-auto px-4">
                    {/* Category Header */}
                    <div className="flex items-center space-x-4 mb-8">
                        <span className="text-4xl">{category.icon}</span>
                        <div>
                            <h1 className="text-3xl font-display font-bold">{categoryName}</h1>
                            <p className="text-text-secondary dark:text-gray-400">{categorySubtitle}</p>
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
                                {t.all}
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
                                    {lang === 'th' ? sub.name_th : sub.name_en}
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
                    ) : hasItems ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                            {/* New listings first */}
                            {listings.map((listing) => (
                                <UnifiedProductCard key={`listing-${listing.id}`} product={listingToUnifiedProduct(listing)} />
                            ))}
                            {/* Legacy products */}
                            {products.map((product) => (
                                <ProductCard key={`product-${product.id}`} product={product} />
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white dark:bg-surface-dark rounded-3xl p-12 text-center border border-gray-100 dark:border-gray-800 shadow-sm">
                            <div className="text-4xl mb-4 opacity-50">🔍</div>
                            <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-2">{t.noProducts}</h3>
                            <p className="text-text-secondary dark:text-gray-400 mb-6">
                                {t.beFirst}
                            </p>
                            <Link href="/sell">
                                <Button variant="primary" className="shadow-xl shadow-purple-500/20">
                                    {t.startSelling}
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
