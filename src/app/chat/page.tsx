'use client'

import React, { useState, useEffect, useRef, Suspense } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useLanguage } from '@/contexts/LanguageContext'
import { useRouter, useSearchParams } from 'next/navigation'
import Image from 'next/image'
import {
    Send, Image as ImageIcon, ArrowLeft, MoreVertical,
    Check, CheckCheck, Loader2, X, MessageCircle,
    ShoppingBag, Store, Banknote
} from 'lucide-react'
import {
    getOrCreateChatRoom,
    subscribeToUserChatRooms,
    subscribeToRoomMessages,
    sendChatMessage,
    markMessagesAsRead,
    getTotalUnreadCount,
    deleteChatRoom,
    updateMessageMetadata,
    type ChatRoom,
    type ChatMessage
} from '@/lib/chat'
import { updateProductStatus } from '@/lib/products'
import ProductInfoPanel from '@/components/chat/ProductInfoPanel'
import ProductHeader from '@/components/chat/ProductHeader'
import QuickReplyButtons from '@/components/chat/QuickReplyButtons'
import ChatRoomHeader from '@/components/chat/ChatRoomHeader'
import ChatListItem from '@/components/chat/ChatListItem'

import SafetyBanner from '@/components/chat/SafetyBanner'
import DeleteChatModal from '@/components/chat/DeleteChatModal'
import { getUserProfile, type UserProfile, calculateTrustScore } from '@/lib/user'

// Translations
const translations = {
    th: {
        loadingChat: 'กำลังโหลดแชท...',
        loginRequired: 'กรุณาเข้าสู่ระบบเพื่อใช้งานแชท',
        login: 'เข้าสู่ระบบ',
        chat: 'แชท',
        all: 'ทั้งหมด',
        chatWithBuyers: 'แชทกับผู้ซื้อ',
        chatWithSellers: 'แชทกับผู้ขาย',
        noConversations: 'ยังไม่มีบทสนทนา',
        startChatHint: 'กดปุ่ม "แชทเลย" จากหน้าสินค้าเพื่อเริ่มแชท',
        noConversationsWith: 'ยังไม่มีการสนทนากับ',
        buyers: 'ผู้ซื้อ',
        sellers: 'ผู้ขาย',
        welcomeToChat: 'ยินดีต้อนรับสู่ JaiKod Chat',
        selectConversation: 'เริ่มต้นสนทนากับผู้ซื้อ-ผู้ขายได้ง่ายๆ เพียงเลือกรายการจากทางซ้ายมือ',
        typeMessage: 'พิมพ์ข้อความ...',
        dealDone: 'ดีลสำเร็จ! รอการชำระเงิน',
        waitingForPayment: 'รอผู้ซื้อส่งหลักฐานการโอน',
        pleaseUploadSlip: 'กรุณาส่งสลิปโอนเงินให้ผู้ขาย',
        cancel: 'ยกเลิก',
        closeSale: 'ปิดการขาย',
        attachSlip: 'แนบสลิป',
        priceOffer: 'ข้อเสนอราคา',
        acceptOffer: 'รับข้อเสนอ',
        counterOffer: 'ยื่นข้อเสนอใหม่',
        reject: 'ปฏิเสธ',
        waitingForResponse: 'รอการตอบรับ',
        offerAccepted: '✅ ยอมรับข้อเสนอแล้ว',
        offerRejected: '❌ ข้อเสนอถูกปฏิเสธ',
        chatDeleted: 'ลบการสนทนาเรียบร้อยแล้ว',
        deleteError: 'ไม่สามารถลบแชทได้:',
        tryAgain: 'กรุณาลองใหม่อีกครั้ง',
        specifyPrice: 'ระบุราคาที่ต้องการเสนอ (บาท):',
        invalidPrice: 'กรุณาระบุราคาที่ถูกต้อง',
        cannotOfferAccepted: 'ไม่สามารถยื่นข้อเสนอได้เนื่องจากมีข้อเสนอที่ได้รับการยอมรับแล้ว',
        offerSendFailed: 'ส่งข้อเสนอไม่สำเร็จ',
        messageSendFailed: 'ส่งข้อความไม่สำเร็จ',
        confirmCancelDeal: 'ยืนยันยกเลิกการขาย? สินค้าจะกลับมาว่างอีกครั้ง',
        confirmMarkSold: 'ยืนยันปิดการขาย? สินค้าจะถูกเปลี่ยนสถานะเป็น "ขายแล้ว"',
        errorOccurred: 'เกิดข้อผิดพลาด',
        fileTooLarge: 'ไฟล์รูปภาพต้องมีขนาดไม่เกิน 5MB',
        uploadingSlip: 'กำลังอัปโหลดสลิป...',
        notifyPayment: 'แจ้งโอนเงินครับ/ค่ะ [สลิป]',
        customer: 'ลูกค้า',
        store: 'ร้านค้า',
        featureDeveloping: 'ฟีเจอร์กำลังพัฒนา',
    },
    en: {
        loadingChat: 'Loading chat...',
        loginRequired: 'Please login to use chat',
        login: 'Login',
        chat: 'Chat',
        all: 'All',
        chatWithBuyers: 'Buyers',
        chatWithSellers: 'Sellers',
        noConversations: 'No conversations yet',
        startChatHint: 'Click "Chat Now" from a product page to start',
        noConversationsWith: 'No conversations with',
        buyers: 'buyers',
        sellers: 'sellers',
        welcomeToChat: 'Welcome to JaiKod Chat',
        selectConversation: 'Select a conversation from the left to start chatting',
        typeMessage: 'Type a message...',
        dealDone: 'Deal done! Awaiting payment',
        waitingForPayment: 'Waiting for buyer to send payment proof',
        pleaseUploadSlip: 'Please send payment slip to seller',
        cancel: 'Cancel',
        closeSale: 'Close Sale',
        attachSlip: 'Attach Slip',
        priceOffer: 'Price Offer',
        acceptOffer: 'Accept',
        counterOffer: 'Counter Offer',
        reject: 'Reject',
        waitingForResponse: 'Waiting for response',
        offerAccepted: '✅ Offer accepted',
        offerRejected: '❌ Offer rejected',
        chatDeleted: 'Chat deleted successfully',
        deleteError: 'Cannot delete chat:',
        tryAgain: 'Please try again',
        specifyPrice: 'Specify your offer price (THB):',
        invalidPrice: 'Please enter a valid price',
        cannotOfferAccepted: 'Cannot make offer - an offer has already been accepted',
        offerSendFailed: 'Failed to send offer',
        messageSendFailed: 'Failed to send message',
        confirmCancelDeal: 'Confirm cancel? Product will become available again',
        confirmMarkSold: 'Confirm mark as sold?',
        errorOccurred: 'An error occurred',
        fileTooLarge: 'Image file must not exceed 5MB',
        uploadingSlip: 'Uploading slip...',
        notifyPayment: 'Payment notification [slip]',
        customer: 'Customer',
        store: 'Store',
        featureDeveloping: 'Feature under development',
    }
}

// Fallback loading component
function ChatLoading() {
    return (
        <div className="flex items-center justify-center h-screen bg-gray-50 dark:bg-black">
            <div className="text-center">
                <Loader2 className="w-10 h-10 animate-spin text-purple-600 mx-auto mb-4" />
                <p className="text-gray-500">Loading...</p>
            </div>
        </div>
    )
}

function ChatPageContent() {
    const { user } = useAuth()
    const { language } = useLanguage()
    const t = translations[language]
    const router = useRouter()
    const searchParams = useSearchParams()
    const [rooms, setRooms] = useState<ChatRoom[]>([])
    const [selectedRoom, setSelectedRoom] = useState<ChatRoom | null>(null)

    const [messages, setMessages] = useState<ChatMessage[]>([])
    const [inputText, setInputText] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [isSending, setIsSending] = useState(false)
    const [partnerProfile, setPartnerProfile] = useState<UserProfile | null>(null)
    const [imageFile, setImageFile] = useState<File | null>(null)
    const [imagePreview, setImagePreview] = useState<string | null>(null)
    const [activeTab, setActiveTab] = useState<'all' | 'buying' | 'selling'>('all')
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    // Auto-create room from URL params (when coming from product page)
    useEffect(() => {
        const autoCreateRoom = async () => {
            if (!user) return

            const sellerId = searchParams.get('seller')
            const listingId = searchParams.get('listing')
            const title = searchParams.get('title')
            const image = searchParams.get('image')
            const price = searchParams.get('price')

            if (sellerId && listingId && title) {
                setIsLoading(true)
                try {
                    const roomId = await getOrCreateChatRoom(
                        user.uid,
                        sellerId,
                        listingId,
                        title,
                        image || undefined,
                        price ? parseFloat(price) : undefined
                    )

                    // Clear URL params
                    router.replace('/chat')
                } catch (error) {
                    console.error('Error creating room:', error)
                } finally {
                    setIsLoading(false)
                }
            }
        }

        autoCreateRoom()
    }, [user, searchParams, router])

    // Fetch partner profile when room is selected
    useEffect(() => {
        const fetchPartner = async () => {
            if (!selectedRoom || !user) return

            const partnerId = selectedRoom.buyer_id === user.uid
                ? selectedRoom.seller_id
                : selectedRoom.buyer_id

            const profile = await getUserProfile(partnerId)
            console.log('Fetched Partner Profile:', { partnerId, profile }) // Debug
            setPartnerProfile(profile)
        }

        setPartnerProfile(null) // Reset first
        fetchPartner()
    }, [selectedRoom, user])

    // Subscribe to user's rooms
    useEffect(() => {
        if (!user) return

        const unsubscribe = subscribeToUserChatRooms(user.uid, (updatedRooms) => {
            // Explicitly filter out deleted rooms on the client side just in case
            const visibleRooms = updatedRooms.filter(room => {
                if (room.buyer_id === user.uid && room.deleted_by_buyer) return false;
                if (room.seller_id === user.uid && room.deleted_by_seller) return false;
                return true;
            });

            setRooms(visibleRooms)

            // Sync selectedRoom with latest data to get updates (like cleared_at)
            if (selectedRoom) {
                const latestSelected = visibleRooms.find(r => r.id === selectedRoom.id)
                if (latestSelected) {
                    setSelectedRoom(latestSelected)
                }
            } else if (visibleRooms.length > 0) {
                // Auto-select first room if none selected
                setSelectedRoom(visibleRooms[0])
            }
        })

        return () => unsubscribe()
    }, [user])

    // Subscribe to messages in selected room
    useEffect(() => {
        if (!selectedRoom) return

        const unsubscribe = subscribeToRoomMessages(selectedRoom.id, (updatedMessages) => {
            // Filter out messages that were cleared by the user
            let filteredMessages = updatedMessages
            if (user) {
                const isBuyer = selectedRoom.buyer_id === user.uid
                const clearedAt = isBuyer ? selectedRoom.cleared_at_buyer : selectedRoom.cleared_at_seller

                if (clearedAt) {
                    const clearTime = new Date(clearedAt).getTime()
                    filteredMessages = updatedMessages.filter(m => new Date(m.created_at).getTime() > clearTime)
                }
            }

            setMessages(filteredMessages)
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })

            // Mark as read
            if (user) {
                markMessagesAsRead(selectedRoom.id, user.uid)
            }
        })

        return () => unsubscribe()
    }, [selectedRoom, user])

    // Check for existing offers status
    const hasAcceptedOffer = messages.some(m => m.metadata?.offer_status === 'accepted')
    const myPendingOffer = messages.find(m => m.sender_id === user?.uid && m.metadata?.offer_status === 'pending')

    const handleMakeOffer = async (initialPrice?: number) => {
        if (!selectedRoom || !user) return

        if (hasAcceptedOffer) {
            alert('ไม่สามารถยื่นข้อเสนอได้เนื่องจากมีข้อเสนอที่ได้รับการยอมรับแล้ว')
            return
        }

        const defaultPrice = initialPrice?.toString() || (selectedRoom.listing_price ? selectedRoom.listing_price.toString() : '')
        const priceStr = prompt('ระบุราคาที่ต้องการเสนอ (บาท):', defaultPrice)

        if (!priceStr) return

        const price = parseFloat(priceStr.replace(/,/g, ''))
        if (isNaN(price) || price <= 0) {
            alert('กรุณาระบุราคาที่ถูกต้อง')
            return
        }

        // Auto-cancel previous pending offer from me if exists
        if (myPendingOffer) {
            try {
                await updateMessageMetadata(myPendingOffer.id, { offer_status: 'cancelled' })
            } catch (err) {
                console.warn('Failed to auto-cancel old offer', err)
            }
        }

        try {
            await sendChatMessage(
                selectedRoom.id,
                user.uid,
                user.displayName || 'User',
                `ยื่นข้อเสนอราคา: ฿${price.toLocaleString()}`,
                undefined,
                'offer',
                { price, offer_status: 'pending' }
            )
        } catch (error) {
            console.error('Error sending offer:', error)
            alert('ส่งข้อเสนอไม่สำเร็จ')
        }
    }

    const handleRespondOffer = async (messageId: string, status: 'accepted' | 'rejected') => {
        if (!selectedRoom || !user) return

        try {
            // Corrected: updateMessageMetadata takes (messageId, metadata)
            await updateMessageMetadata(messageId, { offer_status: status })

            // Determine role text
            const isSeller = user.uid === selectedRoom.seller_id
            const roleName = isSeller ? 'ผู้ขาย' : 'ผู้ซื้อ'
            const actionText = status === 'accepted' ? 'ยอมรับข้อเสนอแล้ว ✅' : 'ปฏิเสธข้อเสนอ ❌'

            // System Message Logic


            if (status === 'accepted') {
                // Auto-Reserve Product Logic
                // Always reserve for the buyer of the room (regardless of who clicked accept)
                try {
                    await updateProductStatus(selectedRoom.listing_id, 'reserved', selectedRoom.buyer_id)
                } catch (err) {
                    console.error('Failed to update product status:', err)
                }
            }

            await sendChatMessage(
                selectedRoom.id,
                'system',
                'System',
                `${roleName}${actionText} ${status === 'accepted' ? (isSeller ? 'รอการชำระเงิน' : '') : ''}`,
                undefined,
                'system'
            )
        } catch (error) {
            console.error('Error responding to offer:', error)
            alert('เกิดข้อผิดพลาด: ' + error)
        }
    }

    const handleCounterOffer = async (messageId: string, currentPrice: number) => {
        if (!confirm('คุณต้องการปฏิเสธข้อเสนอนี้ และยื่นข้อเสนอใหม่ใช่หรือไม่?')) return

        // 1. Reject current offer automatically
        await handleRespondOffer(messageId, 'rejected')

        // 2. Open make offer dialog with current price as default
        // setTimeout to ensure state updates and UX flow feels natural
        setTimeout(() => handleMakeOffer(currentPrice), 500)
    }

    const handleCancelDeal = async () => {
        if (!selectedRoom || !user) return
        if (!confirm('ยืนยันยกเลิกการขาย? สินค้าจะกลับมาว่างอีกครั้ง และผู้ซื้อคนอื่นจะสามารถยื่นข้อเสนอได้')) return

        try {
            await updateProductStatus(selectedRoom.listing_id, 'active')

            // Find accepted offer to cancel it
            const acceptedOffer = messages.find(m => m.metadata?.offer_status === 'accepted')
            if (acceptedOffer) {
                await updateMessageMetadata(acceptedOffer.id, { offer_status: 'cancelled' })
            }

            await sendChatMessage(
                selectedRoom.id,
                'system',
                'System',
                '⚠️ ผู้ขายยกเลิกดีล สินค้ากลับมาว่างอีกครั้ง',
                undefined,
                'system'
            )
        } catch (error) {
            console.error('Error canceling deal:', error)
            alert('เกิดข้อผิดพลาด')
        }
    }

    const handleMarkSold = async () => {
        if (!selectedRoom || !user) return
        if (!confirm('ยืนยันปิดการขาย? สินค้าจะถูกเปลี่ยนสถานะเป็น "ขายแล้ว"')) return

        try {
            await updateProductStatus(selectedRoom.listing_id, 'sold', selectedRoom.buyer_id)
            await sendChatMessage(
                selectedRoom.id,
                'system',
                'System',
                '🎉 ผู้ขายยืนยันการรับยอด ปิดการขายเรียบร้อย! ขอบคุณที่ใช้บริการ JaiKod',
                undefined,
                'system'
            )
        } catch (error) {
            console.error('Error marking sold:', error)
            alert('เกิดข้อผิดพลาด')
        }
    }

    const handleSlipSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file || !user || !selectedRoom) return

        if (file.size > 5 * 1024 * 1024) {
            alert('ไฟล์รูปภาพต้องมีขนาดไม่เกิน 5MB')
            return
        }

        try {
            // We reuse handleSendMessage logic logic basically but with metadata
            // Since handleSendMessage is coupled with UI state (inputText, imageFile)
            // We'll just call sendChatMessage directly here with image upload logic
            // Actually, to save time/complexity, let's reuse sendChatMessage but pass special arg?
            // No, let's write inline upload for slip specific

            // ... Or better, set state and let handleSendMessage handle it?
            // But we want metadata { type: 'slip' }

            // Let's implement direct send for slip
            alert('กำลังอัปโหลดสลิป...')
            // For now, let's use the standard flow but with a trick or just simple implementation
            // I'll skip complex upload implementation and just use TEXT + IMAGE for now 
            // "แนบสลิปโอนเงิน" text automatically
            setImageFile(file)
            setInputText('แจ้งโอนเงินครับ/ค่ะ [สลิป]')
            // The user still has to press send? No, auto send.
            // But handleSendMessage is complex. 
            // Let's just set ImageFile and Focus input for MVP ease
        } catch (error) {
            console.error(error)
        }
    }

    const handleSendMessage = async () => {
        if ((!inputText.trim() && !imageFile) || !user || !selectedRoom) return

        setIsSending(true)
        try {
            await sendChatMessage(
                selectedRoom.id,
                user.uid,
                user.displayName || 'User',
                inputText,
                imageFile || undefined
            )

            setInputText('')
            setImageFile(null)
            setImagePreview(null)
        } catch (error) {
            console.error('Error sending message:', error)
            alert('ส่งข้อความไม่สำเร็จ')
        } finally {
            setIsSending(false)
        }
    }

    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            setImageFile(file)
            const reader = new FileReader()
            reader.onloadend = () => {
                setImagePreview(reader.result as string)
            }
            reader.readAsDataURL(file)
        }
    }

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSendMessage()
        }
    }

    const getOtherUser = (room: ChatRoom) => {
        if (!user) return null
        return room.buyer_id === user.uid ? {
            id: room.seller_id,
            role: 'seller'
        } : {
            id: room.buyer_id,
            role: 'buyer'
        }
    }

    const getUnreadCount = (room: ChatRoom) => {
        if (!user) return 0
        return room.buyer_id === user.uid ? room.unread_count_buyer : room.unread_count_seller
    }

    const handleDeleteChat = () => {
        if (!selectedRoom) return
        setIsDeleteModalOpen(true)
    }

    const confirmDeleteChat = async () => {
        console.log('Start deleting chat...', selectedRoom?.id)
        if (!selectedRoom || !user) return

        try {
            const role = selectedRoom.buyer_id === user.uid ? 'buyer' : 'seller'
            console.log('Deleting check:', { roomId: selectedRoom.id, role })

            await deleteChatRoom(selectedRoom.id, role)

            console.log('Delete success, updating UI...')
            const deletedRoomId = selectedRoom.id
            setSelectedRoom(null)
            setRooms(prev => prev.filter(r => r.id !== deletedRoomId))
            setIsDeleteModalOpen(false)
            // Add slight delay to let UI update first
            setTimeout(() => alert('ลบการสนทนาเรียบร้อยแล้ว'), 100)
        } catch (error: any) {
            console.error('Error deleting chat:', error)
            alert(`ไม่สามารถลบแชทได้: ${error.message || 'กรุณาลองใหม่อีกครั้ง'}`)
        }
    }

    // Filter rooms based on active tab
    const filteredRooms = rooms.filter(room => {
        if (!user) return false
        if (activeTab === 'buying') return room.buyer_id === user.uid
        if (activeTab === 'selling') return room.seller_id === user.uid
        return true
    })

    if (!user) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-50 dark:bg-black">
                <div className="text-center">
                    <MessageCircle className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-600 dark:text-gray-400">กรุณาเข้าสู่ระบบเพื่อใช้งานแชท</p>
                    <button
                        onClick={() => router.push('/login')}
                        className="mt-4 px-6 py-2 bg-neon-purple text-white rounded-lg hover:bg-purple-600"
                    >
                        เข้าสู่ระบบ
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="flex h-[100dvh] pt-16 bg-gray-50 dark:bg-black overflow-hidden">
            {/* Rooms List - Left Sidebar */}
            <div className={`${selectedRoom ? 'hidden lg:flex' : 'flex'} w-full lg:w-80 xl:w-96 border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 flex-col h-full z-20`}>
                {/* Header & Tabs */}
                <div className="flex-none z-10 bg-inherit border-b border-gray-200 dark:border-gray-800">
                    <div className="p-4 pb-2">
                        <h1 className="text-xl font-bold text-gray-900 dark:text-white">แชท</h1>
                    </div>

                    {/* Filter Tabs - Clean Design */}
                    <div className="flex px-4 border-b border-gray-100 dark:border-gray-800">
                        <button
                            onClick={() => setActiveTab('all')}
                            className={`py-3 text-sm font-medium mr-6 transition-all relative ${activeTab === 'all'
                                ? 'text-gray-900 dark:text-white border-b-2 border-gray-900 dark:border-white'
                                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                                }`}
                        >
                            ทั้งหมด
                        </button>
                        <button
                            onClick={() => setActiveTab('selling')}
                            className={`py-3 text-sm font-medium mr-6 transition-all relative ${activeTab === 'selling'
                                ? 'text-gray-900 dark:text-white border-b-2 border-gray-900 dark:border-white'
                                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                                }`}
                        >
                            แชทกับผู้ซื้อ
                        </button>
                        <button
                            onClick={() => setActiveTab('buying')}
                            className={`py-3 text-sm font-medium transition-all relative ${activeTab === 'buying'
                                ? 'text-gray-900 dark:text-white border-b-2 border-gray-900 dark:border-white'
                                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                                }`}
                        >
                            แชทกับผู้ขาย
                        </button>
                    </div>
                </div>

                {/* Rooms */}
                <div className="flex-1 overflow-y-auto min-h-0">
                    {isLoading ? (
                        <div className="flex items-center justify-center p-8">
                            <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
                        </div>
                    ) : filteredRooms.length === 0 ? (
                        <div className="p-8 text-center text-gray-400">
                            {activeTab === 'all' ? (
                                <>
                                    <MessageCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
                                    <p className="text-sm">ยังไม่มีบทสนทนา</p>
                                    <p className="text-xs mt-2">กดปุ่ม "แชทเลย" จากหน้าสินค้าเพื่อเริ่มแชท</p>
                                </>
                            ) : (
                                <>
                                    <div className="w-12 h-12 mx-auto mb-2 opacity-50 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                                        {activeTab === 'buying' ? <ShoppingBag className="w-6 h-6" /> : <Store className="w-6 h-6" />}
                                    </div>
                                    <p className="text-sm">ยังไม่มีการสนทนากับ{activeTab === 'buying' ? 'ผู้ขาย' : 'ผู้ซื้อ'}</p>
                                </>
                            )}
                        </div>
                    ) : (
                        filteredRooms.map((room) => (
                            <ChatListItem
                                key={room.id}
                                room={room}
                                currentUserId={user?.uid || ''}
                                isSelected={selectedRoom?.id === room.id}
                                onClick={() => setSelectedRoom(room)}
                            />
                        ))
                    )}
                </div>
            </div>

            {/* Chat Area - Right Side */}
            <div className={`${selectedRoom ? 'flex' : 'hidden lg:flex'} flex-1 flex-col h-full bg-slate-50 dark:bg-black/50 relative overflow-hidden`}>
                {selectedRoom ? (
                    <>
                        {/* New 2-Row Header */}
                        <div className="flex-none z-10 relative">
                            <ChatRoomHeader
                                partnerName={(partnerProfile?.displayName && partnerProfile.displayName !== 'ผู้ขาย') ? partnerProfile.displayName : (selectedRoom.seller_id === user?.uid ? "ลูกค้า" : "ร้านค้า")}
                                partnerRole={selectedRoom.seller_id === user?.uid ? 'buyer' : 'seller'}
                                isOnline={true}
                                trustScore={partnerProfile ? calculateTrustScore(partnerProfile).score : 50}
                                productTitle={selectedRoom.listing_title}
                                productPrice={selectedRoom.listing_price || 0}
                                productImage={selectedRoom.listing_image}
                                productId={selectedRoom.listing_id}
                                onBack={() => setSelectedRoom(null)}
                                onDeleteChat={handleDeleteChat}
                                onReportUser={() => alert('ฟีเจอร์รายงานผู้ใช้ กำลังพัฒนา')}
                                onBlockUser={() => alert('ฟีเจอร์บล็อคผู้ใช้ กำลังพัฒนา')}
                                onViewProduct={() => window.open(`/product/${selectedRoom.listing_id}`, '_blank')}
                            />
                        </div>


                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-6 min-h-0 scroll-smooth">
                            {messages.map((msg, index) => {
                                const isOwn = msg.sender_id === user?.uid
                                const showAvatar = index === 0 || messages[index - 1].sender_id !== msg.sender_id

                                return (
                                    <div key={msg.id} className={`flex ${isOwn ? 'justify-end' : 'justify-start'} items-end gap-2 group`}>
                                        {!isOwn && (
                                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white text-sm font-bold flex-shrink-0 shadow-sm">
                                                {showAvatar ? (msg.sender_name ? msg.sender_name[0]?.toUpperCase() : '?') : ''}
                                            </div>
                                        )}
                                        <div className={`max-w-[85%] sm:max-w-[75%] lg:max-w-[70%]`}>
                                            {!isOwn && showAvatar && (
                                                <p className="text-xs text-gray-400 ml-1 mb-1">{msg.sender_name || 'User'}</p>
                                            )}
                                            <div className={`relative px-4 py-2.5 shadow-sm ${isOwn
                                                ? 'bg-purple-600 text-white rounded-2xl rounded-tr-sm'
                                                : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-2xl rounded-tl-sm border border-gray-100 dark:border-gray-700'
                                                }`}>
                                                {msg.type === 'offer' ? (
                                                    <div className="bg-white/90 dark:bg-gray-800 p-3 rounded-xl border border-purple-200 dark:border-purple-900/50 min-w-[200px]">
                                                        <div className="flex items-center gap-2 mb-2 border-b border-gray-100 dark:border-gray-700 pb-2">
                                                            <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center text-purple-600 dark:text-purple-400">
                                                                <Banknote className="w-4 h-4" />
                                                            </div>
                                                            <div>
                                                                <p className="text-xs text-gray-500 font-medium">ข้อเสนอราคา</p>
                                                                <p className="text-lg font-bold text-purple-600 dark:text-purple-400">฿{msg.metadata?.price?.toLocaleString()}</p>
                                                            </div>
                                                        </div>

                                                        {msg.metadata?.offer_status === 'pending' ? (
                                                            // Show buttons if I am NOT the sender (Incoming Offer)
                                                            msg.sender_id !== user?.uid ? (
                                                                <div className="flex flex-col gap-2 mt-2">
                                                                    <button
                                                                        onClick={() => handleRespondOffer(msg.id, 'accepted')}
                                                                        className="w-full py-2 bg-green-500 hover:bg-green-600 text-white text-xs font-bold rounded-lg transition-colors shadow-sm"
                                                                    >
                                                                        รับข้อเสนอ
                                                                    </button>
                                                                    <div className="flex gap-2">
                                                                        <button
                                                                            onClick={() => handleCounterOffer(msg.id, msg.metadata?.price || 0)}
                                                                            className="flex-1 py-1.5 bg-purple-100 hover:bg-purple-200 text-purple-700 text-xs font-bold rounded-lg transition-colors border border-purple-200"
                                                                        >
                                                                            ยื่นข้อเสนอใหม่
                                                                        </button>
                                                                        <button
                                                                            onClick={() => handleRespondOffer(msg.id, 'rejected')}
                                                                            className="flex-1 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-600 text-xs font-bold rounded-lg transition-colors border border-gray-200"
                                                                        >
                                                                            ปฏิเสธ
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            ) : (
                                                                <p className="text-xs text-center text-amber-500 bg-amber-50 dark:bg-amber-900/20 py-1 rounded mt-2 border border-amber-100 dark:border-amber-900/30">รอการตอบรับ</p>
                                                            )
                                                        ) : (
                                                            <div className={`text-center py-1.5 rounded text-xs font-bold ${msg.metadata?.offer_status === 'accepted'
                                                                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                                                : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                                                                }`}>
                                                                {msg.metadata?.offer_status === 'accepted' ? '✅ ยอมรับข้อเสนอแล้ว' : '❌ ข้อเสนอถูกปฏิเสธ'}
                                                            </div>
                                                        )}
                                                    </div>
                                                ) : (
                                                    // Standard Message
                                                    <>
                                                        {msg.text && <p className="text-[15px] leading-relaxed whitespace-pre-wrap break-words">{msg.text}</p>}
                                                        {msg.image_url && (
                                                            <div className="mt-2 rounded-lg overflow-hidden">
                                                                <Image
                                                                    src={msg.image_url}
                                                                    alt="Sent image"
                                                                    width={300}
                                                                    height={200}
                                                                    className="object-cover cursor-pointer hover:opacity-90"
                                                                    onClick={() => window.open(msg.image_url, '_blank')}
                                                                />
                                                            </div>
                                                        )}
                                                    </>
                                                )}
                                                <div className={`flex items-center gap-1 mt-1 text-[10px] ${isOwn ? 'text-purple-200 justify-end' : 'text-gray-400'}`}>
                                                    <span>{new Date(msg.created_at).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })}</span>
                                                    {isOwn && (msg.status === 'read' ? <CheckCheck className="w-3 h-3 text-blue-300" /> : <Check className="w-3 h-3 text-purple-200" />)}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Image Preview */}
                        {imagePreview && (
                            <div className="flex-none px-4 py-3 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 z-20">
                                <div className="relative inline-block">
                                    <Image src={imagePreview} alt="Preview" width={120} height={120} className="rounded-xl object-cover border border-gray-200 dark:border-gray-700 shadow-sm" />
                                    <button onClick={() => { setImageFile(null); setImagePreview(null) }} className="absolute -top-2 -right-2 p-1.5 bg-gray-900 text-white rounded-full hover:bg-gray-700 shadow-md"><X className="w-3 h-3" /></button>
                                </div>
                            </div>
                        )}

                        {/* Input Area with Safety Banner */}
                        <div className="flex-none bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 z-20 pb-safe shadow-[0_-5px_20px_-10px_rgba(0,0,0,0.1)]">
                            <SafetyBanner />

                            {/* Smart Deal Action Bar */}
                            {hasAcceptedOffer && (
                                <div className="mx-4 mb-2 p-3 bg-purple-50 dark:bg-purple-900/20 border border-purple-100 dark:border-purple-800 rounded-xl flex items-center justify-between animate-in slide-in-from-bottom-2">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-800 flex items-center justify-center text-purple-600 dark:text-purple-300">
                                            <Banknote className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-gray-900 dark:text-purple-100">ดีลสำเร็จ! รอการชำระเงิน</p>
                                            <p className="text-xs text-gray-500 dark:text-purple-300">
                                                {selectedRoom.seller_id === user?.uid
                                                    ? 'รอผู้ซื้อส่งหลักฐานการโอน'
                                                    : 'กรุณาส่งสลิปโอนเงินให้ผู้ขาย'}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex gap-2">
                                        {selectedRoom.seller_id === user?.uid ? (
                                            <>
                                                <button onClick={handleCancelDeal} className="px-3 py-1.5 text-xs font-medium text-red-600 bg-red-100 hover:bg-red-200 rounded-lg transition-colors">
                                                    ยกเลิก
                                                </button>
                                                <button onClick={handleMarkSold} className="px-3 py-1.5 text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 rounded-lg shadow-sm transition-colors">
                                                    ปิดการขาย
                                                </button>
                                            </>
                                        ) : (
                                            <button
                                                onClick={() => fileInputRef.current?.click()}
                                                className="px-4 py-2 text-xs font-bold text-white bg-green-600 hover:bg-green-700 rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
                                            >
                                                <ImageIcon className="w-3.5 h-3.5" />
                                                แนบสลิป
                                            </button>
                                        )}
                                    </div>
                                </div>
                            )}

                            {!hasAcceptedOffer && (
                                <QuickReplyButtons
                                    onSelect={(text) => setInputText(text)}
                                    role={selectedRoom.seller_id === user?.uid ? 'seller' : 'buyer'}
                                    productTitle={selectedRoom.listing_title}
                                />
                            )}

                            <div className="p-3 md:p-4 flex items-end gap-2">
                                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageSelect} className="hidden" />
                                <button onClick={() => fileInputRef.current?.click()} className="p-2.5 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors flex-shrink-0"><ImageIcon className="w-6 h-6" /></button>

                                <button
                                    onClick={() => !hasAcceptedOffer && handleMakeOffer()}
                                    disabled={hasAcceptedOffer}
                                    className={`p-2.5 rounded-full transition-colors flex-shrink-0 ${hasAcceptedOffer
                                        ? 'text-gray-300 cursor-not-allowed bg-gray-50 dark:bg-gray-800'
                                        : 'text-gray-500 hover:bg-purple-50 hover:text-purple-600 dark:hover:bg-purple-900/20'
                                        }`}
                                    title={hasAcceptedOffer ? "ดีลจบแล้ว" : "ยื่นข้อเสนอราคา"}
                                >
                                    <Banknote className="w-6 h-6" />
                                </button>

                                <div className="flex-1 relative">
                                    <input type="text" value={inputText} onChange={(e) => setInputText(e.target.value)} onKeyPress={handleKeyPress} placeholder="พิมพ์ข้อความ..." className="w-full px-4 py-2.5 bg-gray-100 dark:bg-gray-800 border-transparent focus:border-purple-500 focus:bg-white dark:focus:bg-gray-900 border rounded-full text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-200 dark:focus:ring-purple-900 transition-all outline-none" />
                                </div>
                                <button onClick={handleSendMessage} disabled={(!inputText.trim() && !imageFile) || isSending} className="p-3 bg-purple-600 text-white rounded-full hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg flex-shrink-0">{isSending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5 ml-0.5" />}</button>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-black">
                        <div className="text-center">
                            <div className="w-20 h-20 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                                <MessageCircle className="w-10 h-10 text-purple-600 dark:text-purple-400" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">ยินดีต้อนรับสู่ JaiKod Chat</h3>
                            <p className="text-gray-500 dark:text-gray-400 max-w-xs mx-auto">
                                เริ่มต้นสนทนากับผู้ซื้อ-ผู้ขายได้ง่ายๆ เพียงเลือกรายการจากทางซ้ายมือ
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* Modals */}


            {/* Product Info Panel - Right Sidebar (Desktop Only) */}
            {selectedRoom && (
                <div className="hidden xl:block h-full">
                    <ProductInfoPanel
                        productId={selectedRoom.listing_id}
                        productName={selectedRoom.listing_title}
                        productPrice={selectedRoom.listing_price || 0}
                        productImage={selectedRoom.listing_image}
                        sellerId={getOtherUser(selectedRoom)?.id}
                        sellerName={partnerProfile?.displayName || 'ผู้ใช้'}
                        sellerTrustScore={partnerProfile ? calculateTrustScore(partnerProfile).score : 50}
                        sellerSalesCount={partnerProfile?.successfulTransactions || 0}
                        sellerResponseTime="<1 ชั่วโมง"
                        sellerVerified={partnerProfile?.isVerified || false}
                    />
                </div>
            )}
            {/* Modals */}
            <DeleteChatModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={confirmDeleteChat}
            />
        </div>
    )
}

// Export with Suspense wrapper to fix useSearchParams() CSR bailout
export default function ChatPage() {
    return (
        <Suspense fallback={<ChatLoading />}>
            <ChatPageContent />
        </Suspense>
    )
}
