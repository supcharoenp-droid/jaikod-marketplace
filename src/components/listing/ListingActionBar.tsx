'use client'

/**
 * LISTING ACTION BAR
 * 
 * Floating action bar with Chat, Make Offer, Save, and Share buttons
 */

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
    MessageCircle,
    Heart,
    Share2,
    DollarSign,
    Loader2,
    Check,
    Copy,
    Facebook,
    Twitter,
    Link as LinkIcon
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { useChat } from '@/contexts/ChatContext'
import { useWishlist } from '@/contexts/WishlistContext'
import { useLanguage } from '@/contexts/LanguageContext'
import MakeOfferModal from './MakeOfferModal'
import { sendMessage as sendChatMessage } from '@/lib/firebase-chat'
import { UniversalListing } from '@/lib/listings'

interface ListingActionBarProps {
    listing: UniversalListing
    sellerId: string
    sellerName: string
    sellerAvatar?: string
    className?: string
}

export default function ListingActionBar({
    listing,
    sellerId,
    sellerName,
    sellerAvatar,
    className = ''
}: ListingActionBarProps) {
    const router = useRouter()
    const { user } = useAuth()
    const { startConversation, selectConversation } = useChat()
    const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist()
    const { language } = useLanguage()
    const lang = language as 'th' | 'en'

    const [isChatting, setIsChatting] = useState(false)
    const [isOfferModalOpen, setIsOfferModalOpen] = useState(false)
    const [isShareOpen, setIsShareOpen] = useState(false)
    const [copied, setCopied] = useState(false)
    const [wishlistLoading, setWishlistLoading] = useState(false)

    const inWishlist = isInWishlist(listing.id)

    // Translations
    const t = {
        chatWithSeller: lang === 'th' ? 'แชทกับผู้ขาย' : 'Chat with Seller',
        makeOffer: lang === 'th' ? 'เสนอราคา' : 'Make Offer',
        save: lang === 'th' ? 'บันทึก' : 'Save',
        saved: lang === 'th' ? 'บันทึกแล้ว' : 'Saved',
        share: lang === 'th' ? 'แชร์' : 'Share',
        loginToChat: lang === 'th' ? 'เข้าสู่ระบบเพื่อแชท' : 'Login to chat',
        copyLink: lang === 'th' ? 'คัดลอกลิงก์' : 'Copy Link',
        copied: lang === 'th' ? 'คัดลอกแล้ว!' : 'Copied!',
    }

    // Handle Chat with Seller
    const handleChat = async () => {
        if (!user) {
            router.push(`/login?redirect=/listing/${listing.slug}`)
            return
        }

        if (user.uid === sellerId) {
            return // Can't chat with yourself
        }

        setIsChatting(true)
        try {
            const conversationId = await startConversation(
                {
                    id: sellerId,
                    name: sellerName,
                    avatar: sellerAvatar
                },
                listing.id,
                listing.title,
                listing.thumbnail_url
            )

            // Select the conversation to open chat
            selectConversation(conversationId)
        } catch (err) {
            console.error('Error starting chat:', err)
        } finally {
            setIsChatting(false)
        }
    }

    // Handle Make Offer
    const handleMakeOffer = async (amount: number, message?: string) => {
        if (!user) {
            router.push(`/login?redirect=/listing/${listing.slug}`)
            return
        }

        // Start conversation first
        const conversationId = await startConversation(
            {
                id: sellerId,
                name: sellerName,
                avatar: sellerAvatar
            },
            listing.id,
            listing.title,
            listing.thumbnail_url
        )

        // Send offer message
        await sendChatMessage(
            conversationId,
            user.uid,
            message || `เสนอราคา ฿${amount.toLocaleString()}`,
            'offer',
            { offerAmount: amount }
        )

        // Select the conversation
        selectConversation(conversationId)
    }

    // Handle Wishlist Toggle
    const handleWishlistToggle = async () => {
        if (!user) {
            router.push(`/login?redirect=/listing/${listing.slug}`)
            return
        }

        setWishlistLoading(true)
        try {
            if (inWishlist) {
                await removeFromWishlist(listing.id)
            } else {
                // Cast to Product type expected by WishlistContext
                await addToWishlist(listing as any)
            }
        } catch (err) {
            console.error('Wishlist error:', err)
        } finally {
            setWishlistLoading(false)
        }
    }

    // Handle Share
    const handleCopyLink = async () => {
        const url = `${window.location.origin}/listing/${listing.slug}`
        await navigator.clipboard.writeText(url)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    const shareUrl = typeof window !== 'undefined'
        ? `${window.location.origin}/listing/${listing.slug}`
        : ''

    const isOwner = user?.uid === sellerId

    return (
        <>
            {/* Main Action Buttons */}
            <div className={`flex flex-col gap-3 ${className}`}>
                {/* Save & Share Row */}
                <div className="flex gap-2">
                    <button
                        onClick={handleWishlistToggle}
                        disabled={wishlistLoading}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-medium transition-all ${inWishlist
                            ? 'bg-pink-500/20 text-pink-400 border border-pink-500/30'
                            : 'bg-slate-700 hover:bg-slate-600 text-white'
                            }`}
                    >
                        {wishlistLoading ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <Heart className={`w-4 h-4 ${inWishlist ? 'fill-current' : ''}`} />
                        )}
                        {inWishlist ? t.saved : t.save}
                    </button>

                    <div className="relative">
                        <button
                            onClick={() => setIsShareOpen(!isShareOpen)}
                            className="flex items-center justify-center gap-2 px-4 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-xl transition-colors"
                        >
                            <Share2 className="w-4 h-4" />
                            {t.share}
                        </button>

                        {/* Share Dropdown */}
                        {isShareOpen && (
                            <div className="absolute right-0 top-full mt-2 w-48 bg-slate-800 rounded-xl shadow-xl border border-slate-700 overflow-hidden z-50">
                                <button
                                    onClick={handleCopyLink}
                                    className="w-full flex items-center gap-3 px-4 py-3 text-white hover:bg-slate-700 transition-colors"
                                >
                                    {copied ? (
                                        <Check className="w-4 h-4 text-emerald-400" />
                                    ) : (
                                        <Copy className="w-4 h-4" />
                                    )}
                                    {copied ? t.copied : t.copyLink}
                                </button>
                                <a
                                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full flex items-center gap-3 px-4 py-3 text-white hover:bg-slate-700 transition-colors"
                                >
                                    <Facebook className="w-4 h-4 text-blue-500" />
                                    Facebook
                                </a>
                                <a
                                    href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(listing.title)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full flex items-center gap-3 px-4 py-3 text-white hover:bg-slate-700 transition-colors"
                                >
                                    <Twitter className="w-4 h-4 text-sky-400" />
                                    Twitter
                                </a>
                                <a
                                    href={`https://line.me/R/msg/text/?${encodeURIComponent(listing.title + ' ' + shareUrl)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full flex items-center gap-3 px-4 py-3 text-white hover:bg-slate-700 transition-colors"
                                >
                                    <LinkIcon className="w-4 h-4 text-emerald-400" />
                                    LINE
                                </a>
                            </div>
                        )}
                    </div>
                </div>

                {/* Chat Button */}
                {!isOwner && (
                    <button
                        onClick={handleChat}
                        disabled={isChatting}
                        className="w-full flex items-center justify-center gap-2 py-3.5 bg-slate-700 hover:bg-slate-600 text-white rounded-xl font-medium transition-colors"
                    >
                        {isChatting ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <MessageCircle className="w-5 h-5" />
                        )}
                        {t.chatWithSeller}
                    </button>
                )}

                {/* Make Offer Button */}
                {!isOwner && listing.price_negotiable && (
                    <button
                        onClick={() => setIsOfferModalOpen(true)}
                        className="w-full flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-xl font-medium transition-all shadow-lg shadow-purple-500/25"
                    >
                        <DollarSign className="w-5 h-5" />
                        {t.makeOffer}
                    </button>
                )}
            </div>

            {/* Make Offer Modal */}
            <MakeOfferModal
                isOpen={isOfferModalOpen}
                onClose={() => setIsOfferModalOpen(false)}
                onSubmit={handleMakeOffer}
                listingTitle={listing.title}
                currentPrice={listing.price}
                suggestedOffer={Math.floor(listing.price * 0.9)} // AI could suggest better price
            />

            {/* Click outside to close share dropdown */}
            {isShareOpen && (
                <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsShareOpen(false)}
                />
            )}
        </>
    )
}
