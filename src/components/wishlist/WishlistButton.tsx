'use client'

/**
 * WISHLIST HEART BUTTON COMPONENT
 * 
 * Toggle button to add/remove items from wishlist
 * Works with both Product and Listing types
 */

import { useState, useCallback } from 'react'
import { Heart } from 'lucide-react'
import { useWishlist } from '@/contexts/WishlistContext'
import { useAuth } from '@/contexts/AuthContext'
import { Product } from '@/types'

interface WishlistButtonProps {
    product: Product | {
        id: string
        title: string
        price: number
        images?: { url: string }[]
        thumbnail_url?: string
    }
    size?: 'sm' | 'md' | 'lg'
    showText?: boolean
    className?: string
    variant?: 'icon' | 'button'
}

export default function WishlistButton({
    product,
    size = 'md',
    showText = false,
    className = '',
    variant = 'icon'
}: WishlistButtonProps) {
    const { user } = useAuth()
    const { isInWishlist, toggleWishlist } = useWishlist()
    const [isAnimating, setIsAnimating] = useState(false)

    const isWishlisted = isInWishlist(product.id)

    // Size classes
    const sizeClasses = {
        sm: 'w-4 h-4',
        md: 'w-5 h-5',
        lg: 'w-6 h-6'
    }

    const buttonSizeClasses = {
        sm: 'p-1.5',
        md: 'p-2',
        lg: 'p-2.5'
    }

    // Handle toggle
    const handleToggle = useCallback(async (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()

        if (!user) {
            // Could show login modal here
            alert('กรุณาเข้าสู่ระบบก่อน')
            return
        }

        // Animation
        setIsAnimating(true)
        setTimeout(() => setIsAnimating(false), 300)

        // Convert to Product type if needed
        const productData: Product = {
            id: product.id,
            title: product.title || 'Untitled',
            price: product.price || 0,
            images: product.images || [{ url: product.thumbnail_url || '/placeholder.svg' }],
            thumbnail_url: product.thumbnail_url || product.images?.[0]?.url || '/placeholder.svg',
            stock: 1,
            // Default fields for Product type
            category_id: 0,
            subcategory_id: undefined,
            seller_id: '',
            description: '',
            condition: 'used',
            location: {
                province: '',
                amphoe: '',
                tambon: '',
                zipcode: ''
            },
            slug: '',
            views: 0,
            saves: 0,
            status: 'active',
            created_at: new Date(),
            updated_at: new Date()
        }

        await toggleWishlist(productData)
    }, [user, product, toggleWishlist])

    if (variant === 'button') {
        return (
            <button
                onClick={handleToggle}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all ${isWishlisted
                        ? 'bg-pink-500/20 text-pink-400 border border-pink-500/30'
                        : 'bg-slate-700 hover:bg-slate-600 text-gray-300'
                    } ${className}`}
            >
                <Heart
                    className={`${sizeClasses[size]} transition-transform ${isWishlisted ? 'fill-current scale-110' : ''
                        } ${isAnimating ? 'scale-125' : ''}`}
                />
                {showText && (
                    <span>{isWishlisted ? 'บันทึกแล้ว' : 'บันทึก'}</span>
                )}
            </button>
        )
    }

    return (
        <button
            onClick={handleToggle}
            className={`${buttonSizeClasses[size]} rounded-full transition-all ${isWishlisted
                    ? 'bg-pink-500/20 text-pink-500 hover:bg-pink-500/30'
                    : 'bg-slate-800/80 text-gray-400 hover:text-pink-400 hover:bg-slate-700'
                } ${className}`}
            title={isWishlisted ? 'ลบจากรายการที่ชอบ' : 'เพิ่มในรายการที่ชอบ'}
        >
            <Heart
                className={`${sizeClasses[size]} transition-transform ${isWishlisted ? 'fill-current' : ''
                    } ${isAnimating ? 'scale-125' : ''}`}
            />
        </button>
    )
}
