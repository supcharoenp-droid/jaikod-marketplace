/**
 * ChatWindow - Enhanced Production Chat with AI Features
 * V2 Integration: รวม features จาก ChatSystemV2 เข้ามาใช้งานจริง
 * - TypingIndicator
 * - CannedRepliesModal
 * - AILeadBadge
 * - Delete individual messages
 */
'use client'

import React, { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import {
    Send, ImageIcon, ArrowLeft, Loader2, X,
    Banknote, Sparkles, MessageCircle, Check, CheckCheck, CreditCard,
    MapPin, Trash2, MessageSquarePlus, Mic
} from 'lucide-react'
import { User } from 'firebase/auth'
import {
    type ChatRoom,
    type ChatMessage,
    subscribeToRoomMessages,
    sendChatMessage,
    markMessagesAsRead,
    updateMessageMetadata,
    deleteChatRoom,
    deleteMessage,
    setTypingStatus,
    subscribeToTypingStatus
} from '@/lib/chat'
import { updateProductStatus } from '@/lib/products'
import { getUserProfile, type UserProfile, calculateTrustScore } from '@/lib/user'
import { orderService } from '@/services/order/orderService'
import {
    analyzeConversationWithLLM,
    LeadAnalysis,
    ConversationSummary,
    SafeZone,
    PriceIntelligence,
    getSafeMeetingPointsV4
} from '@/services/aiChatService'

import SmartProductInfoPanel from './SmartProductInfoPanel'
import ChatRoomHeader from './ChatRoomHeader'
import QuickReplyButtons from './QuickReplyButtons'
import SafetyBanner from './SafetyBanner'
import DeleteChatModal from './DeleteChatModal'
import TypingIndicator from './TypingIndicator'
import CannedRepliesModal from './CannedRepliesModal'
import AILeadBadge from './AILeadBadge'
import VoiceRecorder from './VoiceRecorder'
import ChatSearchModal from './ChatSearchModal'
import { motion, AnimatePresence } from 'framer-motion'

interface ChatWindowProps {
    user: User
    room: ChatRoom
    onBack?: () => void
    onDeleteSuccess?: () => void
}



export default function ChatWindow({ user, room, onBack, onDeleteSuccess }: ChatWindowProps) {
    const router = useRouter()
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [messages, setMessages] = useState<ChatMessage[]>([])
    const [inputText, setInputText] = useState('')
    const [isSending, setIsSending] = useState(false)
    const [partnerProfile, setPartnerProfile] = useState<UserProfile | null>(null)
    const [imageFile, setImageFile] = useState<File | null>(null)
    const [imagePreview, setImagePreview] = useState<string | null>(null)
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

    // V2 Enhanced States
    const [isTyping, setIsTyping] = useState(false)
    const [isCannedRepliesOpen, setIsCannedRepliesOpen] = useState(false)
    const [isRecordingVoice, setIsRecordingVoice] = useState(false)
    const [isSearchModalOpen, setIsSearchModalOpen] = useState(false)

    // AI States
    const [leadAnalysis, setLeadAnalysis] = useState<LeadAnalysis | null>(null)
    const [smartSummary, setSmartSummary] = useState<ConversationSummary | null>(null)
    const [safeZones, setSafeZones] = useState<SafeZone[]>([])
    const [priceIntel, setPriceIntel] = useState<PriceIntelligence | null>(null)
    const [smartReplies, setSmartReplies] = useState<string[]>([])
    const [isAiAssistantEnabled, setIsAiAssistantEnabled] = useState(true)

    // Fetch Partner Profile
    useEffect(() => {
        const fetchPartner = async () => {
            const partnerId = room.buyer_id === user.uid ? room.seller_id : room.buyer_id
            try {
                const profile = await getUserProfile(partnerId)
                setPartnerProfile(profile)
            } catch (err) {
                console.error('Error fetching partner:', err)
            }
        }
        fetchPartner()
    }, [room, user.uid])

    // Subscribe to Messages
    useEffect(() => {
        const unsubscribe = subscribeToRoomMessages(room.id, (updatedMessages) => {
            // Filter cleared messages
            let filtered = updatedMessages
            const isBuyer = room.buyer_id === user.uid
            const clearedAt = isBuyer ? room.cleared_at_buyer : room.cleared_at_seller

            if (clearedAt) {
                const clearTime = new Date(clearedAt).getTime()
                filtered = updatedMessages.filter(m => new Date(m.created_at).getTime() > clearTime)
            }

            setMessages(filtered)
            markMessagesAsRead(room.id, user.uid)

            // Scroll to bottom on new message
            setTimeout(() => {
                messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
            }, 100)
        })

        return () => unsubscribe()
    }, [room.id, user.uid, room.cleared_at_buyer, room.cleared_at_seller])

    // V2 Feature: Subscribe to Typing Status (Real-time)
    useEffect(() => {
        const unsubscribe = subscribeToTypingStatus(room.id, user.uid, (typing) => {
            setIsTyping(typing)
        })

        return () => unsubscribe()
    }, [room.id, user.uid])

    // V2 Feature: Send Typing Status when user is typing
    useEffect(() => {
        // When input changes, set typing to true
        if (inputText.trim()) {
            setTypingStatus(room.id, user.uid, true)
        }

        // Debounce: Clear typing after 2 seconds of no input
        const timer = setTimeout(() => {
            setTypingStatus(room.id, user.uid, false)
        }, 2000)

        return () => clearTimeout(timer)
    }, [inputText, room.id, user.uid])

    // AI Analysis (Debounced)
    useEffect(() => {
        const timer = setTimeout(async () => {
            if (messages.length > 0) {
                const productContext = {
                    title: room.listing_title,
                    price: room.listing_price || 0,
                    id: room.listing_id
                }
                const role = user.uid === room.seller_id ? 'seller' : 'buyer'

                // Use Real AI
                try {
                    const analysis = await analyzeConversationWithLLM(role, messages as any, productContext)

                    setLeadAnalysis(analysis.leadAnalysis || null)
                    setSmartSummary(analysis.summary || null)
                    setPriceIntel(analysis.priceIntel || null)
                    setSmartReplies(analysis.suggestedReplies || [])
                } catch (error) {
                    console.error('AI Analysis failed:', error)
                }

                const zones = getSafeMeetingPointsV4(0, 0, room.listing_price || 0)
                setSafeZones(zones)
            }
        }, 800) // Debounce 800ms

        return () => clearTimeout(timer)
    }, [messages, room, user.uid])

    // Get Other User Info helper
    const getOtherUser = () => {
        return room.buyer_id === user.uid ? { id: room.seller_id, role: 'seller' } : { id: room.buyer_id, role: 'buyer' }
    }

    // Logic: Offer Status
    const hasAcceptedOffer = messages.some(m => m.metadata?.offer_status === 'accepted')
    const myPendingOffer = messages.find(m => m.sender_id === user.uid && m.metadata?.offer_status === 'pending')

    // Handlers
    const handleMakeOffer = async (initialPrice?: number) => {
        if (hasAcceptedOffer) return alert('มีข้อเสนอที่ยอมรับแล้ว')

        const defaultPrice = initialPrice?.toString() || (room.listing_price ? room.listing_price.toString() : '')
        const priceStr = prompt('ระบุราคาที่ต้องการเสนอ (บาท):', defaultPrice)
        if (!priceStr) return

        const price = parseFloat(priceStr.replace(/,/g, ''))
        if (isNaN(price) || price <= 0) return alert('ราคาไม่ถูกต้อง')

        if (myPendingOffer) {
            await updateMessageMetadata(myPendingOffer.id, { offer_status: 'cancelled' }).catch(console.warn)
        }

        try {
            await sendChatMessage(
                room.id, user.uid, user.displayName || 'User',
                `ยื่นข้อเสนอราคา: ฿${price.toLocaleString()}`,
                undefined, 'offer',
                { price, offer_status: 'pending' }
            )
        } catch (error) {
            console.error(error)
            alert('ส่งข้อเสนอไม่สำเร็จ')
        }
    }

    const handleRespondOffer = async (messageId: string, status: 'accepted' | 'rejected', price?: number) => {
        try {
            await updateMessageMetadata(messageId, { offer_status: status })

            const isSeller = user.uid === room.seller_id
            const roleName = isSeller ? 'ผู้ขาย' : 'ผู้ซื้อ'
            const actionText = status === 'accepted' ? 'ยอมรับข้อเสนอแล้ว ✅' : 'ปฏิเสธข้อเสนอ ❌'

            if (status === 'accepted') {
                await updateProductStatus(room.listing_id, 'reserved', room.buyer_id).catch(console.error)

                // Create Order if price exists
                if (price) {
                    await orderService.createOrderFromOffer(
                        { price, offer_status: 'accepted' },
                        room
                    ).then(async orderId => {
                        if (orderId) {
                            // Link Order ID to the Offer Message
                            await updateMessageMetadata(messageId, { orderId })

                            sendChatMessage(
                                room.id, 'system', 'System',
                                `🎉 สร้างคำสั่งซื้อเรียบร้อย! หมายเลขคำสั่งซื้อ: #${orderId.slice(0, 8)}`,
                                undefined, 'system', { orderId }
                            )
                        }
                    })
                }
            }

            await sendChatMessage(
                room.id, 'system', 'System',
                `${roleName}${actionText} ${status === 'accepted' ? (isSeller ? 'รอการชำระเงิน' : '') : ''}`,
                undefined, 'system'
            )
        } catch (error) {
            console.error(error)
        }
    }

    const handleCounterOffer = async (messageId: string, currentPrice: number) => {
        if (!confirm('ต้องการปฏิเสธและยื่นข้อเสนอใหม่?')) return
        await handleRespondOffer(messageId, 'rejected')
        setTimeout(() => handleMakeOffer(currentPrice), 500)
    }

    const handleCancelDeal = async () => {
        if (!confirm('ยืนยันยกเลิกการขาย?')) return
        try {
            await updateProductStatus(room.listing_id, 'active')
            const acceptedOffer = messages.find(m => m.metadata?.offer_status === 'accepted')
            if (acceptedOffer) {
                await updateMessageMetadata(acceptedOffer.id, { offer_status: 'cancelled' })
                // Cancel linked order if exists
                if (acceptedOffer.metadata?.orderId) {
                    await orderService.updateStatus(acceptedOffer.metadata.orderId, 'cancelled')
                }
            }

            await sendChatMessage(
                room.id, 'system', 'System',
                '⚠️ ผู้ขายยกเลิกดีล สินค้ากลับมาว่างอีกครั้ง', undefined, 'system'
            )
        } catch (err) { console.error(err) }
    }

    const handleMarkSold = async () => {
        if (!confirm('ยืนยันปิดการขาย?')) return
        try {
            await updateProductStatus(room.listing_id, 'sold', room.buyer_id)
            await sendChatMessage(
                room.id, 'system', 'System',
                '🎉 ปิดการขายเรียบร้อย! ขอบคุณที่ใช้บริการ JaiKod', undefined, 'system'
            )
        } catch (err) { console.error(err) }
    }

    const handleSendLocation = async (spot: { name: string; lat: number; lng: number }) => {
        try {
            await sendChatMessage(
                room.id, user.uid, user.displayName || 'User',
                `📌 พิกัดนัดรับ: ${spot.name}`,
                undefined, 'location',
                { location: spot }
            )
        } catch (error) {
            console.error(error)
            alert('แชร์พิกัดไม่สำเร็จ')
        }
    }

    const handleSendMessage = async () => {
        if ((!inputText.trim() && !imageFile)) return
        setIsSending(true)
        try {
            await sendChatMessage(
                room.id, user.uid, user.displayName || 'User',
                inputText, imageFile || undefined
            )
            setInputText('')
            setImageFile(null)
            setImagePreview(null)
        } catch (err) {
            console.error(err)
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
            reader.onloadend = () => setImagePreview(reader.result as string)
            reader.readAsDataURL(file)
        }
    }

    const handleDeleteChat = () => setIsDeleteModalOpen(true)

    // V2 Feature: Delete individual message
    const handleDeleteMessage = async (messageId: string) => {
        if (!confirm('ต้องการลบข้อความนี้?')) return
        try {
            await deleteMessage(messageId, user.uid)
        } catch (error: any) {
            console.error('Error deleting message:', error)
            alert(error.message || 'ไม่สามารถลบข้อความได้')
        }
    }

    // V2 Feature: Handle Voice Recording Complete
    const handleVoiceRecording = async (audioBlob: Blob, duration: number) => {
        // For now, send as text indicating voice message
        // In production, you would upload the blob to Firebase Storage
        try {
            setIsSending(true)
            await sendChatMessage(
                room.id,
                user.uid,
                user.displayName || 'User',
                `🎤 ข้อความเสียง (${Math.floor(duration / 60)}:${(duration % 60).toString().padStart(2, '0')})`,
                undefined,
                'text',
                { voiceMessage: true, duration }
            )
            setIsRecordingVoice(false)
        } catch (error) {
            console.error('Failed to send voice message:', error)
            alert('ไม่สามารถส่งข้อความเสียงได้')
        } finally {
            setIsSending(false)
        }
    }

    const confirmDeleteChat = async () => {
        try {
            const role = room.buyer_id === user.uid ? 'buyer' : 'seller'
            await deleteChatRoom(room.id, role)
            setIsDeleteModalOpen(false)
            if (onDeleteSuccess) onDeleteSuccess()
        } catch (err) {
            console.error(err)
            alert('ไม่สามารถลบแชทได้')
        }
    }

    return (
        <div className="flex flex-1 h-full overflow-hidden bg-slate-50 dark:bg-black/50 relative">
            <div className="flex flex-col flex-1 h-full min-w-0 relative">
                {/* Header */}
                <div className="flex-none z-10">
                    <ChatRoomHeader
                        partnerName={(partnerProfile?.displayName && partnerProfile.displayName !== 'ผู้ขาย') ? partnerProfile.displayName : (room.seller_id === user.uid ? "ลูกค้า" : "ร้านค้า")}
                        partnerRole={room.seller_id === user.uid ? 'buyer' : 'seller'}
                        partnerImage={partnerProfile?.photoURL}
                        isOnline={true}
                        trustScore={partnerProfile ? calculateTrustScore(partnerProfile).score : 50}
                        productTitle={room.listing_title}
                        productPrice={room.listing_price || 0}
                        productImage={room.listing_image}
                        productId={room.listing_id}
                        productStatus={room.listing_status}
                        isMuted={room.seller_id === user.uid ? room.muted_by_seller : room.muted_by_buyer}
                        isArchived={room.seller_id === user.uid ? room.archived_by_seller : room.archived_by_buyer}
                        onBack={onBack}
                        onDeleteChat={handleDeleteChat}
                        onReportUser={() => { }}
                        onBlockUser={() => { }}
                        onViewProduct={() => window.open(`/listing/${room.listing_id}`, '_blank')}
                        onSearchClick={() => setIsSearchModalOpen(true)}
                    />
                </div>

                {/* Messages List - Could still be extracted but fits 'ChatWindow' scope */}
                <div className="flex-1 overflow-y-auto p-4 min-h-0 scroll-smooth custom-scrollbar flex flex-col justify-end">
                    <div className="space-y-4">
                        {messages.map((msg, index) => {
                            const isOwn = msg.sender_id === user.uid
                            const showAvatar = index === 0 || messages[index - 1].sender_id !== msg.sender_id

                            return (
                                <div key={msg.id} className={`flex ${isOwn ? 'justify-end' : 'justify-start'} items-end gap-2 group relative`}>
                                    {/* V2 Feature: Delete button for own messages */}
                                    {isOwn && (
                                        <button
                                            onClick={() => handleDeleteMessage(msg.id)}
                                            className="opacity-0 group-hover:opacity-100 absolute top-1/2 -translate-y-1/2 -left-8 p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-all z-10"
                                            title="ลบข้อความ"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    )}
                                    {!isOwn && showAvatar && (
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white text-sm font-bold flex-shrink-0 shadow-sm">
                                            {msg.sender_name?.[0]?.toUpperCase() || '?'}
                                        </div>
                                    )}
                                    {!isOwn && !showAvatar && <div className="w-8" />}

                                    <div className={`max-w-[85%] sm:max-w-[75%] lg:max-w-[70%]`}>
                                        {!isOwn && showAvatar && <p className="text-xs text-gray-400 ml-1 mb-1">{msg.sender_name || 'User'}</p>}

                                        <div className={`relative px-4 py-2.5 shadow-sm ${isOwn ? 'bg-purple-600 text-white rounded-2xl rounded-tr-sm'
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
                                                        msg.sender_id !== user.uid ? (
                                                            <div className="flex flex-col gap-2 mt-2">
                                                                <button onClick={() => handleRespondOffer(msg.id, 'accepted', msg.metadata?.price)} className="w-full py-2 bg-green-500 hover:bg-green-600 text-white text-xs font-bold rounded-lg transition-colors shadow-sm">
                                                                    รับข้อเสนอ
                                                                </button>
                                                                <div className="flex gap-2">
                                                                    <button onClick={() => handleCounterOffer(msg.id, msg.metadata?.price || 0)} className="flex-1 py-1.5 bg-purple-100 text-purple-700 text-xs font-bold rounded-lg border border-purple-200">
                                                                        ยื่นใหม่
                                                                    </button>
                                                                    <button onClick={() => handleRespondOffer(msg.id, 'rejected')} className="flex-1 py-1.5 bg-gray-100 text-gray-600 text-xs font-bold rounded-lg border border-gray-200">
                                                                        ปฏิเสธ
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <p className="text-xs text-center text-amber-500 bg-amber-50 dark:bg-amber-900/20 py-1 rounded mt-2">รอการตอบรับ</p>
                                                        )
                                                    ) : (
                                                        <div className={`text-center py-1.5 rounded text-xs font-bold ${msg.metadata?.offer_status === 'accepted' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                            {msg.metadata?.offer_status === 'accepted' ? '✅ ยอมรับแล้ว' : '❌ ปฏิเสธแล้ว'}
                                                        </div>
                                                    )}
                                                </div>
                                            ) : msg.type === 'location' ? (
                                                <div className="bg-white/95 dark:bg-gray-800 p-3 rounded-xl border border-blue-200 dark:border-blue-900/50 min-w-[220px]">
                                                    <div className="flex items-center gap-3 mb-3">
                                                        <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-blue-600 dark:text-blue-400">
                                                            <MapPin className="w-5 h-5 transition-transform group-hover:scale-110" />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-[10px] text-blue-600 dark:text-blue-400 font-bold uppercase tracking-wider mb-0.5">พิกัดนัดรับ</p>
                                                            <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{msg.metadata?.location?.name || 'ตำแหน่งที่ตั้ง'}</p>
                                                        </div>
                                                    </div>
                                                    <button
                                                        onClick={() => {
                                                            const loc = msg.metadata?.location;
                                                            if (loc) {
                                                                window.open(`https://www.google.com/maps/search/?api=1&query=${loc.lat},${loc.lng}`, '_blank');
                                                            }
                                                        }}
                                                        className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold rounded-lg shadow-sm transition-all flex items-center justify-center gap-2"
                                                    >
                                                        <MapPin className="w-3.5 h-3.5" />
                                                        ดูใน Google Maps
                                                    </button>
                                                </div>
                                            ) : (
                                                <>
                                                    {msg.text && <p className="text-[15px] leading-relaxed whitespace-pre-wrap">{msg.text}</p>}
                                                    {msg.metadata?.orderId && (
                                                        <button
                                                            onClick={() => router.push(`/checkout/${msg.metadata?.orderId}`)}
                                                            className="mt-2 w-full py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-lg shadow-md transition-all flex items-center justify-center gap-2"
                                                        >
                                                            <CreditCard className="w-4 h-4" />
                                                            ชำระเงินตอนนี้ (Pay Now)
                                                        </button>
                                                    )}
                                                    {msg.image_url && (
                                                        <div className="mt-2 rounded-lg overflow-hidden">
                                                            <Image src={msg.image_url} alt="Sent" width={300} height={200} className="object-cover cursor-pointer hover:opacity-90" onClick={() => window.open(msg.image_url, '_blank')} />
                                                        </div>
                                                    )}
                                                    <div className={`flex items-center gap-1 mt-1 text-[10px] ${isOwn ? 'text-purple-200 justify-end' : 'text-gray-400'}`}>
                                                        <span>{new Date(msg.created_at).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })}</span>
                                                        {isOwn && (msg.status === 'read' ? <CheckCheck className="w-3 h-3 text-blue-300" /> : <Check className="w-3 h-3 text-purple-200" />)}
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                        <div ref={messagesEndRef} />

                        {/* V2 Feature: Typing Indicator */}
                        <AnimatePresence>
                            {isTyping && partnerProfile && (
                                <TypingIndicator
                                    partnerName={partnerProfile.displayName || 'User'}
                                    className="mb-2"
                                />
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                <div className="flex-none bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 z-20 pb-safe shadow-lg">
                    <SafetyBanner />

                    {/* Deal Status Bar */}
                    {hasAcceptedOffer && (
                        <div className="mx-4 mb-2 p-3 bg-purple-50 dark:bg-purple-900/20 border border-purple-100 rounded-xl flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Banknote className="w-5 h-5 text-purple-600" />
                                <div>
                                    <p className="text-sm font-bold text-gray-900 dark:text-white">ดีลสำเร็จ! รอการชำระเงิน</p>
                                    <p className="text-xs text-gray-500">{room.seller_id === user.uid ? 'รอสลิปโอนเงิน' : 'กรุณาส่งสลิป'}</p>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                {room.seller_id === user.uid ? (
                                    <>
                                        <button onClick={handleCancelDeal} className="px-3 py-1.5 text-xs font-medium text-red-600 bg-red-100 rounded-lg">ยกเลิก</button>
                                        <button onClick={handleMarkSold} className="px-3 py-1.5 text-xs font-bold text-white bg-purple-600 rounded-lg">ปิดการขาย</button>
                                    </>
                                ) : (
                                    <button onClick={() => fileInputRef.current?.click()} className="px-3 py-1.5 text-xs font-bold text-white bg-green-600 rounded-lg flex items-center gap-1"><ImageIcon className="w-3 h-3" /> แนบสลิป</button>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Quick Replies */}
                    {!hasAcceptedOffer && <QuickReplyButtons onSelect={setInputText} role={room.seller_id === user.uid ? 'seller' : 'buyer'} productTitle={room.listing_title} />}

                    {/* AI Smart Replies & Assistant Toggle */}
                    <AnimatePresence>
                        {isAiAssistantEnabled && smartReplies.length > 0 && (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="px-4 py-2 flex gap-2 overflow-x-auto no-scrollbar border-b border-gray-50 dark:border-gray-800/50">
                                <div className="flex items-center gap-1.5 px-2 py-1 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-lg text-white text-[10px] font-black tracking-widest shrink-0 shadow-sm">
                                    <Sparkles className="w-3 h-3 animate-pulse" /> AI
                                </div>
                                {smartReplies.map((reply, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setInputText(reply)}
                                        className="px-3 py-1.5 bg-white dark:bg-gray-800 border border-violet-100 dark:border-violet-900/30 rounded-full text-xs font-bold text-violet-600 dark:text-violet-400 whitespace-nowrap hover:bg-violet-50 dark:hover:bg-violet-900/20 transition-all shadow-sm active:scale-95"
                                    >
                                        {reply}
                                    </button>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Image Preview */}
                    {imagePreview && (
                        <div className="px-4 py-2 relative">
                            <Image src={imagePreview} alt="Preview" width={80} height={80} className="rounded-lg object-cover border" />
                            <button onClick={() => { setImageFile(null); setImagePreview(null) }} className="absolute top-0 left-[84px] p-1 bg-gray-900 text-white rounded-full"><X className="w-3 h-3" /></button>
                        </div>
                    )}

                    {/* Input Bar */}
                    <div className="p-3 md:p-4 flex items-end gap-2">
                        <input
                            id="chat-image-upload"
                            name="chat-image-upload"
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleImageSelect}
                            className="hidden"
                        />
                        <button onClick={() => fileInputRef.current?.click()} className="p-2.5 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition" title="ส่งรูปภาพ"><ImageIcon className="w-6 h-6" /></button>

                        {/* V2 Feature: Canned Replies Button */}
                        <button
                            onClick={() => setIsCannedRepliesOpen(true)}
                            className="p-2.5 text-gray-500 hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-full transition"
                            title="ข้อความสำเร็จรูป"
                        >
                            <MessageSquarePlus className="w-6 h-6" />
                        </button>

                        <button onClick={() => !hasAcceptedOffer && handleMakeOffer()} disabled={hasAcceptedOffer} className={`p-2.5 rounded-full transition ${hasAcceptedOffer ? 'text-gray-300' : 'text-gray-500 hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20'}`} title="เสนอราคา">
                            <Banknote className="w-6 h-6" />
                        </button>

                        <button
                            onClick={() => {
                                if (safeZones.length > 0) {
                                    handleSendLocation(safeZones[0])
                                } else {
                                    alert('กำลังค้นหาพิกัดนัดรับที่ปลอดภัย...')
                                }
                            }}
                            className="p-2.5 text-gray-500 hover:text-blue-600 rounded-full"
                        >
                            <MapPin className="w-6 h-6" />
                        </button>

                        <button
                            onClick={() => setIsAiAssistantEnabled(!isAiAssistantEnabled)}
                            className={`p-2.5 rounded-full transition-all ${isAiAssistantEnabled ? 'text-violet-600 bg-violet-50 dark:bg-violet-900/20' : 'text-gray-400 hover:text-gray-600'}`}
                            title={isAiAssistantEnabled ? 'ปิด AI Assistant' : 'เปิด AI Assistant'}
                        >
                            <Sparkles className={`w-6 h-6 ${isAiAssistantEnabled ? 'animate-pulse' : ''}`} />
                        </button>

                        {/* V2 Feature: Voice Recorder */}
                        <VoiceRecorder
                            isRecording={isRecordingVoice}
                            onStartRecording={() => setIsRecordingVoice(true)}
                            onRecordingComplete={handleVoiceRecording}
                            onCancel={() => setIsRecordingVoice(false)}
                        />

                        <div className="flex-1">
                            <input
                                id="chat-message-input"
                                name="chat-message-input"
                                type="text"
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
                                placeholder="พิมพ์ข้อความ..."
                                className="w-full px-4 py-2.5 bg-gray-100 dark:bg-gray-800 border-transparent focus:bg-white dark:focus:bg-gray-900 rounded-full border focus:border-purple-500 outline-none transition-all text-gray-900 dark:text-white"
                            />
                        </div>

                        <button onClick={handleSendMessage} disabled={(!inputText.trim() && !imageFile) || isSending} className="p-3 bg-purple-600 text-white rounded-full hover:bg-purple-700 disabled:opacity-50 transition-all shadow-md">
                            {isSending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5 ml-0.5" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Right Sidebar - Info Panel */}
            <div className="hidden xl:block h-full border-l border-gray-200 dark:border-gray-800 w-80">
                <SmartProductInfoPanel
                    productId={room.listing_id}
                    productName={room.listing_title}
                    productPrice={room.listing_price || 0}
                    productImage={room.listing_image}
                    sellerId={room.seller_id}
                    sellerName={partnerProfile?.displayName || 'ผู้ใช้'}
                    sellerTrustScore={partnerProfile ? calculateTrustScore(partnerProfile).score : 50}
                    sellerSalesCount={partnerProfile?.successfulTransactions || 0}
                    sellerResponseTime="<1 ชม."
                    sellerVerified={partnerProfile?.isVerified || false}
                    sellerLocation={partnerProfile?.location}

                    leadAnalysis={leadAnalysis}
                    smartSummary={smartSummary}
                    safeZones={safeZones}
                    priceIntel={priceIntel}

                    onSelectMeetup={async (spot) => {
                        await handleSendLocation(spot)
                    }}
                    onApplyCounterPrice={(price) => handleMakeOffer(price)}
                    onSendMeetingRequest={async (spot, timeSlot) => {
                        await handleSendLocation({ name: `${spot.name} (${timeSlot})`, lat: spot.location.lat, lng: spot.location.lng })
                    }}
                    // SafeZone Location Sharing
                    onRequestSellerLocation={async () => {
                        // Send a chat message requesting the seller's location
                        await sendChatMessage(
                            room.id,
                            user.uid,
                            user.displayName || 'ผู้ซื้อ',
                            '📍 สวัสดีครับ/ค่ะ ช่วยแชร์ตำแหน่งเพื่อคำนวณจุดนัดกึ่งกลางได้ไหมครับ?',
                            undefined,
                            'text'
                        );
                    }}
                    onShareMyLocation={async (location) => {
                        // Share my location with the other party
                        await handleSendLocation({
                            name: 'ตำแหน่งของฉัน',
                            lat: location.lat,
                            lng: location.lng
                        });
                    }}
                    // Transaction Flow Props (Phase 3)
                    chatRoomId={room.id}
                    buyerId={room.buyer_id}
                    currentUserId={user.uid}
                    userRole={room.seller_id === user.uid ? 'seller' : 'buyer'}
                    onOrderCreated={async (orderId) => {
                        console.log('Order created:', orderId)
                        await sendChatMessage(
                            room.id, 'system', 'System',
                            `🎉 สร้างคำสั่งซื้อเรียบร้อย! หมายเลขคำสั่งซื้อ: #${orderId.slice(0, 8)}`,
                            undefined, 'system', { orderId }
                        )
                    }}
                    onPaymentComplete={async () => {
                        console.log('Payment complete')
                        await sendChatMessage(
                            room.id, 'system', 'System',
                            '💰 ได้รับการชำระเงินเรียบร้อยแล้ว (Confirmed Payment)',
                            undefined, 'system'
                        )
                    }}
                    onTransactionComplete={async () => {
                        console.log('Transaction complete')
                        await sendChatMessage(
                            room.id, 'system', 'System',
                            '⭐ การซื้อขายเสร็จสมบูรณ์! ขอบคุณที่ใช้บริการ JaiKod',
                            undefined, 'system'
                        )
                    }}
                />
            </div>

            <DeleteChatModal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} onConfirm={confirmDeleteChat} />

            {/* V2 Feature: Canned Replies Modal */}
            <CannedRepliesModal
                isOpen={isCannedRepliesOpen}
                onClose={() => setIsCannedRepliesOpen(false)}
                onSelect={(text) => {
                    setInputText(text)
                    setIsCannedRepliesOpen(false)
                }}
                role={room.seller_id === user.uid ? 'seller' : 'buyer'}
            />

            {/* V2 Feature: Chat Search Modal */}
            <ChatSearchModal
                isOpen={isSearchModalOpen}
                onClose={() => setIsSearchModalOpen(false)}
                roomId={room.id}
                onMessageClick={(messageId) => {
                    // Scroll to message (future enhancement)
                    console.log('Navigate to message:', messageId)
                }}
            />
        </div >
    )
}
