import { Product } from '@/types'

export interface CartItem {
    id: string
    productId: string
    product: Product
    quantity: number
    selectedOptions?: { [key: string]: string }
}

export interface Cart {
    items: CartItem[]
    subtotal: number
    discount: number
    total: number
    couponCode?: string
}

// Mock Cart Storage
let mockCart: Cart = {
    items: [],
    subtotal: 0,
    discount: 0,
    total: 0
}

// Helper recalculate
const recalculateCart = (cart: Cart): Cart => {
    cart.subtotal = cart.items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0)
    // Simple mock coupon logic
    if (cart.couponCode === 'JAIKOD10') {
        cart.discount = cart.subtotal * 0.1
    } else if (cart.couponCode === 'WELCOME50') {
        cart.discount = 50
    } else {
        cart.discount = 0
    }
    cart.total = Math.max(0, cart.subtotal - cart.discount)
    return { ...cart }
}

export const cartService = {
    getCart: async (): Promise<Cart> => {
        await new Promise(resolve => setTimeout(resolve, 300))
        return mockCart
    },

    addToCart: async (product: Product, quantity = 1): Promise<Cart> => {
        await new Promise(resolve => setTimeout(resolve, 300))
        const existingItem = mockCart.items.find(item => item.productId === product.id)
        if (existingItem) {
            existingItem.quantity += quantity
        } else {
            mockCart.items.push({
                id: `item_${Date.now()}`,
                productId: product.id,
                product,
                quantity
            })
        }
        mockCart = recalculateCart(mockCart)
        return mockCart
    },

    updateQuantity: async (itemId: string, quantity: number): Promise<Cart> => {
        await new Promise(resolve => setTimeout(resolve, 300))
        const item = mockCart.items.find(i => i.id === itemId)
        if (item) {
            item.quantity = Math.max(1, quantity)
            mockCart = recalculateCart(mockCart)
        }
        return mockCart
    },

    removeItem: async (itemId: string): Promise<Cart> => {
        await new Promise(resolve => setTimeout(resolve, 300))
        mockCart.items = mockCart.items.filter(i => i.id !== itemId)
        mockCart = recalculateCart(mockCart)
        return mockCart
    },

    applyCoupon: async (code: string): Promise<Cart> => {
        await new Promise(resolve => setTimeout(resolve, 500))
        if (code === 'INVALID') throw new Error('Invalid coupon')

        mockCart.couponCode = code
        mockCart = recalculateCart(mockCart)
        return mockCart
    },

    clearCart: async (): Promise<void> => {
        mockCart = { items: [], subtotal: 0, discount: 0, total: 0 }
    }
}
