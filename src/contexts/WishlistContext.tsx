'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { db } from '@/lib/firebase'
import { collection, doc, setDoc, deleteDoc, onSnapshot, serverTimestamp, query } from 'firebase/firestore'
import { Product } from '@/types'

export interface WishlistItem {
    id: string
    productId: string
    name: string
    price: number
    image: string
    stockStatus: 'in_stock' | 'out_of_stock'
    note?: string
    addedAt: any
    priceDrop?: boolean
    aiCategory?: 'gift' | 'tech' | 'fashion'
}

interface WishlistContextType {
    wishlist: WishlistItem[]
    loading: boolean
    addToWishlist: (product: Product) => Promise<boolean>
    removeFromWishlist: (wishlistId: string) => Promise<void>
    isInWishlist: (productId: string) => boolean
    updateNote: (wishlistId: string, note: string) => Promise<void>
    toggleWishlist: (product: Product) => Promise<boolean>
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined)

export function WishlistProvider({ children }: { children: ReactNode }) {
    const { user } = useAuth()
    const [wishlist, setWishlist] = useState<WishlistItem[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!user) {
            setWishlist([])
            setLoading(false)
            return
        }

        const q = query(collection(db, `users/${user.uid}/wishlist`))
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const list: WishlistItem[] = []
            snapshot.forEach((doc) => {
                list.push({ id: doc.id, ...doc.data() } as WishlistItem)
            })
            setWishlist(list)
            setLoading(false)
        }, (error) => {
            console.error("Error fetching wishlist:", error)
            setLoading(false)
        })

        return () => unsubscribe()
    }, [user])

    const addToWishlist = async (product: Product) => {
        if (!user) return false

        try {
            const wishlistItem: Omit<WishlistItem, 'id'> = {
                productId: product.id,
                name: product.title,
                price: product.price,
                image: product.images?.[0]?.url || product.thumbnail_url || '/placeholder.svg',
                stockStatus: (product.stock && product.stock > 0) ? 'in_stock' : 'out_of_stock',
                addedAt: serverTimestamp(),
                priceDrop: Math.random() > 0.8, // Mock
                aiCategory: ['tech', 'fashion', 'gift'][Math.floor(Math.random() * 3)] as any // Mock
            }

            await setDoc(doc(db, `users/${user.uid}/wishlist`, product.id), wishlistItem)
            return true
        } catch (error) {
            console.error("Error adding to wishlist:", error)
            return false
        }
    }

    const removeFromWishlist = async (wishlistId: string) => {
        if (!user) return
        try {
            await deleteDoc(doc(db, `users/${user.uid}/wishlist`, wishlistId))
        } catch (error) {
            console.error("Error removing from wishlist:", error)
        }
    }

    const isInWishlist = (productId: string) => {
        return wishlist.some(item => item.productId === productId || item.id === productId)
    }

    const updateNote = async (wishlistId: string, note: string) => {
        if (!user) return
        try {
            await setDoc(doc(db, `users/${user.uid}/wishlist`, wishlistId), { note }, { merge: true })
        } catch (error) {
            console.error("Error updating note:", error)
        }
    }

    const toggleWishlist = async (product: Product) => {
        if (isInWishlist(product.id)) {
            await removeFromWishlist(product.id)
            return false
        } else {
            await addToWishlist(product)
            return true
        }
    }

    return (
        <WishlistContext.Provider value={{ wishlist, loading, addToWishlist, removeFromWishlist, isInWishlist, updateNote, toggleWishlist }}>
            {children}
        </WishlistContext.Provider>
    )
}

export function useWishlist() {
    const context = useContext(WishlistContext)
    if (context === undefined) {
        throw new Error('useWishlist must be used within a WishlistProvider')
    }
    return context
}
