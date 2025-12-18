import { useState, useEffect, useCallback } from 'react'
import { cartService, Cart, CartItem } from '@/services/cartService'
import { Product } from '@/types'

export function useCart() {
    const [cart, setCart] = useState<Cart | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const fetchCart = useCallback(async () => {
        try {
            setLoading(true)
            const data = await cartService.getCart()
            setCart(data)
        } catch (err) {
            setError('Failed to load cart')
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchCart()
    }, [fetchCart])

    const addToCart = async (product: Product, quantity = 1) => {
        try {
            setLoading(true)
            const updatedCart = await cartService.addToCart(product, quantity)
            setCart(updatedCart)
            return true
        } catch (err) {
            setError('Failed to add to cart')
            return false
        } finally {
            setLoading(false)
        }
    }

    const updateQuantity = async (itemId: string, quantity: number) => {
        try {
            const updatedCart = await cartService.updateQuantity(itemId, quantity)
            setCart(updatedCart)
        } catch (err) {
            setError('Failed to update quantity')
        }
    }

    const removeItem = async (itemId: string) => {
        try {
            const updatedCart = await cartService.removeItem(itemId)
            setCart(updatedCart)
        } catch (err) {
            setError('Failed to remove item')
        }
    }

    const applyCoupon = async (code: string) => {
        try {
            setLoading(true)
            const updatedCart = await cartService.applyCoupon(code)
            setCart(updatedCart)
            return true
        } catch (err) {
            setError('Invalid coupon code') // Simplification
            return false
        } finally {
            setLoading(false)
        }
    }

    return {
        cart,
        loading,
        error,
        addToCart,
        updateQuantity,
        removeItem,
        applyCoupon,
        refreshCart: fetchCart
    }
}
