'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Heart, Search, Filter, Trash2, ShoppingBag, Sparkles } from 'lucide-react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import ProductCard from '@/components/product/ProductCard'
import Button from '@/components/ui/Button'
import { useAuth } from '@/contexts/AuthContext'
import { Product } from '@/types'
import { collection, query, where, getDocs, doc, deleteDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'

export default function FavoritesPage() {
    const { user } = useAuth()
    const router = useRouter()

    const [favorites, setFavorites] = useState<Product[]>([])
    const [filteredFavorites, setFilteredFavorites] = useState<Product[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedCategory, setSelectedCategory] = useState<string>('all')

    // Fetch favorites from Firestore
    useEffect(() => {
        if (!user) {
            router.push('/login')
            return
        }

        fetchFavorites()
    }, [user])

    // Filter favorites based on search and category
    useEffect(() => {
        let filtered = favorites

        // Search filter
        if (searchQuery) {
            filtered = filtered.filter(product =>
                product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                product.description?.toLowerCase().includes(searchQuery.toLowerCase())
            )
        }

        // Category filter
        if (selectedCategory !== 'all') {
            filtered = filtered.filter(product => product.category_id === parseInt(selectedCategory))
        }

        setFilteredFavorites(filtered)
    }, [searchQuery, selectedCategory, favorites])

    const fetchFavorites = async () => {
        if (!user) return

        setIsLoading(true)
        try {
            // Query favorites collection for current user
            const favoritesRef = collection(db, 'favorites')
            const q = query(favoritesRef, where('user_id', '==', user.uid))
            const snapshot = await getDocs(q)

            // Get product IDs from favorites
            const productIds = snapshot.docs.map(doc => doc.data().product_id)

            if (productIds.length === 0) {
                setFavorites([])
                setFilteredFavorites([])
                setIsLoading(false)
                return
            }

            // Fetch actual products
            const productsRef = collection(db, 'products')
            const productsSnapshot = await getDocs(productsRef)

            const products: Product[] = []
            productsSnapshot.forEach(doc => {
                if (productIds.includes(doc.id)) {
                    products.push({ id: doc.id, ...doc.data() } as Product)
                }
            })

            setFavorites(products)
            setFilteredFavorites(products)
        } catch (error) {
            console.error('Error fetching favorites:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleRemoveFavorite = async (productId: string) => {
        if (!user) return

        try {
            // Find and delete the favorite document
            const favoritesRef = collection(db, 'favorites')
            const q = query(
                favoritesRef,
                where('user_id', '==', user.uid),
                where('product_id', '==', productId)
            )
            const snapshot = await getDocs(q)

            snapshot.forEach(async (docSnapshot) => {
                await deleteDoc(doc(db, 'favorites', docSnapshot.id))
            })

            // Update local state
            setFavorites(prev => prev.filter(p => p.id !== productId))
            setFilteredFavorites(prev => prev.filter(p => p.id !== productId))
        } catch (error) {
            console.error('Error removing favorite:', error)
        }
    }

    // Get unique categories from favorites
    const categories = Array.from(new Set(favorites.map(p => p.category_id)))

    if (!user) {
        return null
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-bg-dark flex flex-col">
            <Header />

            <main className="flex-1 py-8 container mx-auto px-4">
                {/* Header Section */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center">
                            <Heart className="w-6 h-6 text-white fill-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                                สินค้าที่ชอบ
                            </h1>
                            <p className="text-gray-500 dark:text-gray-400">
                                {favorites.length} รายการ
                            </p>
                        </div>
                    </div>
                </div>

                {/* Search and Filter Bar */}
                <div className="mb-6 flex flex-col sm:flex-row gap-4">
                    {/* Search */}
                    <div className="flex-1 relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="ค้นหาสินค้าที่ชอบ..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-surface-dark focus:outline-none focus:border-neon-purple transition-all"
                        />
                    </div>

                    {/* Category Filter */}
                    {categories.length > 0 && (
                        <div className="relative">
                            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="pl-12 pr-8 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-surface-dark focus:outline-none focus:border-neon-purple transition-all appearance-none cursor-pointer min-w-[200px]"
                            >
                                <option value="all">ทุกหมวดหมู่</option>
                                {categories.map(catId => (
                                    <option key={catId} value={catId}>
                                        หมวด {catId}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}
                </div>

                {/* Loading State */}
                {isLoading && (
                    <div className="flex items-center justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-4 border-neon-purple border-t-transparent"></div>
                    </div>
                )}

                {/* Empty State */}
                {!isLoading && favorites.length === 0 && (
                    <div className="text-center py-20">
                        <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-pink-100 to-rose-100 dark:from-pink-900/20 dark:to-rose-900/20 flex items-center justify-center">
                            <Heart className="w-12 h-12 text-pink-500" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                            ยังไม่มีสินค้าที่ชอบ
                        </h2>
                        <p className="text-gray-500 dark:text-gray-400 mb-8">
                            เริ่มค้นหาและบันทึกสินค้าที่คุณสนใจกันเลย!
                        </p>
                        <Button
                            variant="primary"
                            onClick={() => router.push('/')}
                            className="inline-flex items-center gap-2"
                        >
                            <ShoppingBag className="w-5 h-5" />
                            เริ่มช้อปปิ้ง
                        </Button>
                    </div>
                )}

                {/* No Results from Filter */}
                {!isLoading && favorites.length > 0 && filteredFavorites.length === 0 && (
                    <div className="text-center py-20">
                        <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20 flex items-center justify-center">
                            <Search className="w-12 h-12 text-purple-500" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                            ไม่พบสินค้าที่ค้นหา
                        </h2>
                        <p className="text-gray-500 dark:text-gray-400 mb-8">
                            ลองเปลี่ยนคำค้นหาหรือตัวกรองดูนะ
                        </p>
                        <Button
                            variant="outline"
                            onClick={() => {
                                setSearchQuery('')
                                setSelectedCategory('all')
                            }}
                        >
                            ล้างตัวกรอง
                        </Button>
                    </div>
                )}

                {/* Products Grid */}
                {!isLoading && filteredFavorites.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                        {filteredFavorites.map(product => (
                            <div key={product.id} className="relative group">
                                <ProductCard product={product} />

                                {/* Remove Button */}
                                <button
                                    onClick={(e) => {
                                        e.preventDefault()
                                        handleRemoveFavorite(product.id)
                                    }}
                                    className="absolute top-2 right-2 z-10 w-10 h-10 rounded-full bg-white dark:bg-surface-dark shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:scale-110 hover:bg-red-50 dark:hover:bg-red-900/20"
                                    title="ลบออกจากรายการโปรด"
                                >
                                    <Trash2 className="w-5 h-5 text-red-500" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {/* AI Suggestion Banner (if has favorites) */}
                {!isLoading && favorites.length > 0 && (
                    <div className="mt-12 p-6 rounded-2xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-200 dark:border-purple-800">
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                                <Sparkles className="w-6 h-6 text-white" />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-bold text-gray-900 dark:text-white mb-1">
                                    💡 AI แนะนำ
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                                    เราพบสินค้าที่คล้ายกับสิ่งที่คุณชอบ! ต้องการดูสินค้าแนะนำไหม?
                                </p>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => router.push('/?recommended=true')}
                                >
                                    ดูสินค้าแนะนำ
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </main>

            <Footer />
        </div>
    )
}
