'use client'

import { useState, useEffect, useRef, Suspense } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter, useSearchParams } from 'next/navigation'
import {
    ArrowLeft, Send, Image as ImageIcon, MoreVertical, Phone, Video,
    Search, MessageSquare, Package, User, Check, CheckCheck
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import {
    getUserConversations,
    getMessages,
    sendMessage,
    subscribeToConversations,
    subscribeToMessages,
    markMessagesAsRead,
    Conversation,
    ChatMessage
} from '@/lib/chat'

export const dynamic = 'force-dynamic'

function ChatContent() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const { user } = useAuth()

    const [conversations, setConversations] = useState<Conversation[]>([])
    const [activeConversation, setActiveConversation] = useState<Conversation | null>(null)
    const [messages, setMessages] = useState<ChatMessage[]>([])
    const [newMessage, setNewMessage] = useState('')
    const [loading, setLoading] = useState(true)
    const [sending, setSending] = useState(false)
    const messagesEndRef = useRef<HTMLDivElement>(null)

    // Get conversation ID from URL
    const conversationId = searchParams.get('c')
    const recipientId = searchParams.get('to')
    const recipientName = searchParams.get('name')
    const productId = searchParams.get('product')
    const productTitle = searchParams.get('productTitle')
    const productImage = searchParams.get('productImage')

    // Scroll to bottom of messages
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    // Load conversations
    useEffect(() => {
        if (!user) return

        // Subscribe to conversations
        const unsubscribe = subscribeToConversations(user.uid, (convs) => {
            setConversations(convs)
            setLoading(false)

            // If we have a conversation ID, find and set it
            if (conversationId) {
                const conv = convs.find(c => c.id === conversationId)
                if (conv) setActiveConversation(conv)
            }
        })

        return () => unsubscribe()
    }, [user, conversationId])

    // Load messages for active conversation
    useEffect(() => {
        if (!activeConversation) return

        // Subscribe to messages
        const unsubscribe = subscribeToMessages(activeConversation.id, (msgs) => {
            setMessages(msgs)
        })

        // Mark as read
        if (user) {
            markMessagesAsRead(activeConversation.id, user.uid)
        }

        return () => unsubscribe()
    }, [activeConversation, user])

    // Handle send message
    const handleSend = async () => {
        if (!newMessage.trim() || !user || sending) return

        setSending(true)
        try {
            const recipientIdToUse = recipientId || activeConversation?.participants.find(p => p !== user.uid)
            const recipientNameToUse = recipientName ||
                (activeConversation?.participantNames &&
                    activeConversation.participantNames[recipientIdToUse || '']) ||
                'ผู้ใช้'

            if (!recipientIdToUse) {
                alert('ไม่พบผู้รับข้อความ')
                return
            }

            await sendMessage(
                user.uid,
                user.displayName || user.email || 'ผู้ใช้',
                {
                    conversationId: activeConversation?.id,
                    recipientId: recipientIdToUse,
                    recipientName: recipientNameToUse,
                    text: newMessage,
                    productId: productId || undefined,
                    productTitle: productTitle || undefined,
                    productImage: productImage || undefined
                }
            )
            setNewMessage('')
        } catch (error) {
            console.error('Error sending message:', error)
            alert('ส่งข้อความไม่สำเร็จ')
        } finally {
            setSending(false)
        }
    }

    // Get other participant info
    const getOtherParticipant = (conv: Conversation) => {
        if (!user) return { id: '', name: 'ผู้ใช้' }
        const otherId = conv.participants.find(p => p !== user.uid) || ''
        return {
            id: otherId,
            name: conv.participantNames?.[otherId] || 'ผู้ใช้'
        }
    }

    if (!user) {
        return (
            <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h2 className="text-xl font-bold mb-2">เข้าสู่ระบบเพื่อดูแชท</h2>
                    <p className="text-gray-500 mb-4">กรุณาเข้าสู่ระบบเพื่อดูการสนทนาของคุณ</p>
                    <Link href="/login" className="text-neon-purple hover:underline font-medium">
                        เข้าสู่ระบบ →
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex">
            {/* Sidebar - Conversation List */}
            <aside className={`w-full md:w-80 lg:w-96 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col ${activeConversation ? 'hidden md:flex' : 'flex'}`}>
                {/* Header */}
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between mb-4">
                        <Link href="/" className="flex items-center gap-2">
                            <ArrowLeft className="w-5 h-5" />
                            <span className="font-bold text-lg">แชท</span>
                        </Link>
                    </div>
                    {/* Search */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="ค้นหาการสนทนา..."
                            className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 border-0 text-sm focus:ring-2 focus:ring-neon-purple outline-none"
                        />
                    </div>
                </div>

                {/* Conversation List */}
                <div className="flex-1 overflow-y-auto">
                    {loading ? (
                        <div className="flex items-center justify-center h-32">
                            <div className="w-6 h-6 border-2 border-neon-purple border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    ) : conversations.length === 0 ? (
                        <div className="p-8 text-center">
                            <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                            <p className="text-gray-500">ยังไม่มีการสนทนา</p>
                            <p className="text-sm text-gray-400 mt-1">เริ่มต้นแชทกับผู้ขายจากหน้าสินค้า</p>
                        </div>
                    ) : (
                        conversations.map((conv) => {
                            const other = getOtherParticipant(conv)
                            const unread = conv.unreadCount[user.uid] || 0
                            const isActive = activeConversation?.id === conv.id

                            return (
                                <button
                                    key={conv.id}
                                    onClick={() => setActiveConversation(conv)}
                                    className={`w-full p-4 flex items-start gap-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${isActive ? 'bg-neon-purple/5 border-l-4 border-neon-purple' : ''}`}
                                >
                                    {/* Avatar */}
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-neon-purple to-coral-orange flex items-center justify-center text-white font-bold flex-shrink-0">
                                        {other.name[0]?.toUpperCase() || 'U'}
                                    </div>

                                    {/* Info */}
                                    <div className="flex-1 min-w-0 text-left">
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="font-medium truncate">{other.name}</span>
                                            <span className="text-xs text-gray-400">
                                                {conv.lastMessageAt.toLocaleDateString('th-TH', { day: 'numeric', month: 'short' })}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <p className="text-sm text-gray-500 truncate">{conv.lastMessage || 'เริ่มการสนทนา...'}</p>
                                            {unread > 0 && (
                                                <span className="bg-neon-purple text-white text-xs font-bold px-2 py-0.5 rounded-full">
                                                    {unread}
                                                </span>
                                            )}
                                        </div>
                                        {/* Product info */}
                                        {conv.productTitle && (
                                            <div className="flex items-center gap-1 mt-1 text-xs text-gray-400">
                                                <Package className="w-3 h-3" />
                                                <span className="truncate">{conv.productTitle}</span>
                                            </div>
                                        )}
                                    </div>
                                </button>
                            )
                        })
                    )}
                </div>
            </aside>

            {/* Main Chat Area */}
            <main className={`flex-1 flex flex-col ${!activeConversation ? 'hidden md:flex' : 'flex'}`}>
                {activeConversation ? (
                    <>
                        {/* Chat Header */}
                        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => setActiveConversation(null)}
                                    className="md:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                                >
                                    <ArrowLeft className="w-5 h-5" />
                                </button>
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-neon-purple to-coral-orange flex items-center justify-center text-white font-bold">
                                    {getOtherParticipant(activeConversation).name[0]?.toUpperCase() || 'U'}
                                </div>
                                <div>
                                    <h3 className="font-bold">{getOtherParticipant(activeConversation).name}</h3>
                                    <p className="text-xs text-emerald-500">ออนไลน์</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                                    <Phone className="w-5 h-5 text-gray-500" />
                                </button>
                                <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                                    <Video className="w-5 h-5 text-gray-500" />
                                </button>
                                <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                                    <MoreVertical className="w-5 h-5 text-gray-500" />
                                </button>
                            </div>
                        </header>

                        {/* Product Info Bar */}
                        {activeConversation.productTitle && (
                            <div className="bg-gray-50 dark:bg-gray-900 px-4 py-2 border-b border-gray-200 dark:border-gray-700 flex items-center gap-3">
                                {activeConversation.productImage && (
                                    <div className="relative w-10 h-10 flex-shrink-0">
                                        <Image
                                            src={activeConversation.productImage}
                                            alt={activeConversation.productTitle}
                                            fill
                                            className="rounded-lg object-cover"
                                        />
                                    </div>
                                )}
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium truncate">{activeConversation.productTitle}</p>
                                </div>
                                <Link
                                    href={`/product/${activeConversation.productId}`}
                                    className="text-neon-purple text-sm hover:underline"
                                >
                                    ดูสินค้า
                                </Link>
                            </div>
                        )}

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-900">
                            {messages.map((msg) => {
                                const isOwn = msg.senderId === user.uid
                                return (
                                    <div key={msg.id} className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`max-w-[70%] ${isOwn ? 'order-1' : ''}`}>
                                            <div className={`px-4 py-2 rounded-2xl ${isOwn
                                                ? 'bg-neon-purple text-white rounded-br-md'
                                                : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-bl-md shadow-sm'
                                                }`}>
                                                <p>{msg.text}</p>
                                            </div>
                                            <div className={`flex items-center gap-1 mt-1 ${isOwn ? 'justify-end' : ''}`}>
                                                <span className="text-xs text-gray-400">
                                                    {msg.createdAt.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                                {isOwn && (
                                                    msg.isRead
                                                        ? <CheckCheck className="w-3 h-3 text-blue-500" />
                                                        : <Check className="w-3 h-3 text-gray-400" />
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input */}
                        <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4">
                            <div className="flex items-center gap-3">
                                <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                                    <ImageIcon className="w-5 h-5 text-gray-500" />
                                </button>
                                <input
                                    type="text"
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                    placeholder="พิมพ์ข้อความ..."
                                    className="flex-1 px-4 py-2 rounded-full bg-gray-100 dark:bg-gray-700 border-0 focus:ring-2 focus:ring-neon-purple outline-none"
                                />
                                <button
                                    onClick={handleSend}
                                    disabled={!newMessage.trim() || sending}
                                    className="p-3 bg-neon-purple text-white rounded-full hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <Send className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center">
                        <div className="text-center">
                            <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <h2 className="text-xl font-bold mb-2">เลือกการสนทนา</h2>
                            <p className="text-gray-500">เลือกการสนทนาจากรายการด้านซ้าย</p>
                        </div>
                    </div>
                )}
            </main>
        </div>
    )
}

export default function ChatPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
            <ChatContent />
        </Suspense>
    )
}
