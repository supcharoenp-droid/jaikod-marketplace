'use client'

/**
 * ============================================
 * Listing Action Card
 * ============================================
 * 
 * Smart component that switches between:
 * - ClassifiedContactCard (Classified Mode)
 * - MarketplaceBuyCard (Marketplace Mode)
 * 
 * Usage:
 *   <ListingActionCard
 *     listing={listingData}
 *     onChatClick={() => openChat()}
 *   />
 */

import React from 'react'
import { usePlatform } from '@/contexts/PlatformContext'
import ClassifiedContactCard from './ClassifiedContactCard'
import MarketplaceBuyCard from './MarketplaceBuyCard'

// ============================================
// TYPES
// ============================================

interface ListingData {
    id: string
    title: string
    price: number
    originalPrice?: number
    sellerId: string
    sellerName: string
    isVerified?: boolean
    province?: string
    amphoe?: string
    stock?: number
    shippingFee?: number
}

interface ListingActionCardProps {
    listing: ListingData
    onChatClick?: () => void
    onBuyNow?: () => void
    onAddToCart?: () => void
    className?: string
}

// ============================================
// COMPONENT
// ============================================

export default function ListingActionCard({
    listing,
    onChatClick,
    onBuyNow,
    onAddToCart,
    className = ''
}: ListingActionCardProps) {
    const { isMarketplace, isClassified } = usePlatform()

    // Marketplace Mode - Show Buy Card
    if (isMarketplace) {
        return (
            <MarketplaceBuyCard
                listingId={listing.id}
                sellerId={listing.sellerId}
                sellerName={listing.sellerName}
                price={listing.price}
                originalPrice={listing.originalPrice}
                stock={listing.stock}
                shippingFee={listing.shippingFee}
                onBuyNow={onBuyNow}
                onAddToCart={onAddToCart}
                onChatClick={onChatClick}
                className={className}
            />
        )
    }

    // Classified Mode - Show Contact Card
    return (
        <ClassifiedContactCard
            sellerId={listing.sellerId}
            sellerName={listing.sellerName}
            listingId={listing.id}
            listingTitle={listing.title}
            price={listing.price}
            isVerified={listing.isVerified}
            province={listing.province}
            amphoe={listing.amphoe}
            onChatClick={onChatClick}
            className={className}
        />
    )
}
