'use client'

/**
 * FLOATING CHAT WIDGET
 * 
 * Chat bubble that stays at bottom-right corner with full chat interface
 */

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
    MessageCircle,
    X,
    Send,
    ChevronLeft,
    User,
    Image as ImageIcon,
    DollarSign,
    Loader2,
    Maximize2,
    Minimize2
} from 'lucide-react'
import { useChat } from '@/contexts/ChatContext'
import { useAuth } from '@/contexts/AuthContext'
import { useLanguage } from '@/contexts/LanguageContext'
import { Conversation, ChatMessage } from '@/lib/firebase-chat'

export default function FloatingChatWidget() {
    const { user } = useAuth()
    const { language } = useLanguage()
    const {
        conversations,
        currentConversation,
        messages,
        unreadTotal,
        loading,
        selectConversation,
        sendMessage,
        markAsRead,
        closeChat
    } = useChat()

    const [isOpen, setIsOpen] = useState(false)
    const [messageInput, setMessageInput] = useState('')
    const [isSending, setIsSending] = useState(false)
    const [isExpanded, setIsExpanded] = useState(false)
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const lang = language as 'th' | 'en'

    // Translations
    const t = {
        chat: lang === 'th' ? 'แชท' : 'Chat',
        messages: lang === 'th' ? 'ข้อความ' : 'Messages',
        noConversations: lang === 'th' ? 'ยังไม่มีการสนทนา' : 'No conversations yet',
        typeMessage: lang === 'th' ? 'พิมพ์ข้อความ...' : 'Type a message...',
        login: lang === 'th' ? 'เข้าสู่ระบบเพื่อแชท' : 'Login to chat',
        today: lang === 'th' ? 'วันนี้' : 'Today',
        yesterday: lang === 'th' ? 'เมื่อวาน' : 'Yesterday',
    }

    // Scroll to bottom when messages change
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    // Mark as read when conversation is selected
    useEffect(() => {
        if (currentConversation) {
            markAsRead()
        }
    }, [currentConversation, markAsRead])

    // Format time
    const formatTime = (date: Date) => {
        const now = new Date()
        const d = new Date(date)
        const isToday = d.toDateString() === now.toDateString()
        const isYesterday = new Date(now.getTime() - 86400000).toDateString() === d.toDateString()

        if (isToday) {
            return d.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })
        } else if (isYesterday) {
            return t.yesterday
        } else {
            return d.toLocaleDateString('th-TH', { day: 'numeric', month: 'short' })
        }
    }

    // Get other user from conversation
    const getOtherUser = (conv: Conversation) => {
        if (!user) return null
        const otherId = conv.participants.find(id => id !== user.uid)
        return otherId ? conv.participantDetails[otherId] : null
    }

    // Handle send message
    const handleSend = async () => {
        if (!messageInput.trim() || isSending) return

        setIsSending(true)
        try {
            await sendMessage(messageInput.trim())
            setMessageInput('')
        } finally {
            setIsSending(false)
        }
    }

    // Handle key press
    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSend()
        }
    }

    // If not logged in, show login prompt
    if (!user) {
        return (
            <div className="fixed bottom-6 right-6 z-50">
                <Link
                    href="/login"
                    className="w-14 h-14 bg-purple-500 hover:bg-purple-600 rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110"
                >
                    <MessageCircle className="w-6 h-6 text-white" />
                </Link>
            </div>
        )
    }

    return (
        <div className="fixed bottom-6 right-6 z-50">
            {/* Chat Window */}
            {isOpen && (
                <div className={`mb-4 bg-slate-900 rounded-2xl border border-slate-700 shadow-2xl overflow-hidden transition-all ${isExpanded ? 'w-[500px] h-[600px]' : 'w-80 h-[450px]'
                    }`}>
                    {/* Header */}
                    <div className="flex items-center justify-between px-4 py-3 bg-slate-800 border-b border-slate-700">
                        {currentConversation ? (
                            <>
                                <button
                                    onClick={closeChat}
                                    className="p-1 text-gray-400 hover:text-white"
                                >
                                    <ChevronLeft className="w-5 h-5" />
                                </button>
                                <div className="flex items-center gap-2 flex-1 ml-2">
                                    {getOtherUser(currentConversation)?.avatar ? (
                                        <Image
                                            src={getOtherUser(currentConversation)?.avatar || ''}
                                            alt=""
                                            width={32}
                                            height={32}
                                            className="w-8 h-8 rounded-full"
                                        />
                                    ) : (
                                        <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center">
                                            <User className="w-4 h-4 text-gray-500" />
                                        </div>
                                    )}
                                    <div className="flex-1 min-w-0">
                                        <p className="text-white font-medium text-sm truncate">
                                            {getOtherUser(currentConversation)?.name || 'User'}
                                        </p>
                                        {currentConversation.listingTitle && (
                                            <p className="text-xs text-gray-500 truncate">
                                                {currentConversation.listingTitle}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="flex items-center gap-2">
                                <MessageCircle className="w-5 h-5 text-purple-400" />
                                <span className="text-white font-medium">{t.messages}</span>
                            </div>
                        )}
                        <div className="flex items-center gap-1">
                            <button
                                onClick={() => setIsExpanded(!isExpanded)}
                                className="p-1 text-gray-400 hover:text-white"
                            >
                                {isExpanded ? (
                                    <Minimize2 className="w-4 h-4" />
                                ) : (
                                    <Maximize2 className="w-4 h-4" />
                                )}
                            </button>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-1 text-gray-400 hover:text-white"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="h-[calc(100%-56px)] flex flex-col">
                        {currentConversation ? (
                            <>
                                {/* Messages */}
                                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                                    {messages.map((msg) => (
                                        <MessageBubble
                                            key={msg.id}
                                            message={msg}
                                            isOwn={msg.senderId === user.uid}
                                            formatTime={formatTime}
                                        />
                                    ))}
                                    <div ref={messagesEndRef} />
                                </div>

                                {/* Input */}
                                <div className="p-3 border-t border-slate-700">
                                    <div className="flex items-center gap-2">
                                        <button className="p-2 text-gray-500 hover:text-gray-300">
                                            <ImageIcon className="w-5 h-5" />
                                        </button>
                                        <button className="p-2 text-gray-500 hover:text-gray-300">
                                            <DollarSign className="w-5 h-5" />
                                        </button>
                                        <input
                                            type="text"
                                            value={messageInput}
                                            onChange={(e) => setMessageInput(e.target.value)}
                                            onKeyPress={handleKeyPress}
                                            placeholder={t.typeMessage}
                                            className="flex-1 px-3 py-2 bg-slate-800 border border-slate-700 rounded-full text-white placeholder-gray-500 text-sm focus:outline-none focus:border-purple-500"
                                        />
                                        <button
                                            onClick={handleSend}
                                            disabled={!messageInput.trim() || isSending}
                                            className="p-2 bg-purple-500 hover:bg-purple-600 disabled:bg-slate-700 text-white rounded-full transition-colors"
                                        >
                                            {isSending ? (
                                                <Loader2 className="w-5 h-5 animate-spin" />
                                            ) : (
                                                <Send className="w-5 h-5" />
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </>
                        ) : (
                            /* Conversation List */
                            <div className="flex-1 overflow-y-auto">
                                {loading ? (
                                    <div className="flex items-center justify-center h-full">
                                        <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
                                    </div>
                                ) : conversations.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center h-full text-gray-500">
                                        <MessageCircle className="w-12 h-12 mb-3 opacity-50" />
                                        <p>{t.noConversations}</p>
                                    </div>
                                ) : (
                                    conversations.map((conv) => (
                                        <ConversationItem
                                            key={conv.id}
                                            conversation={conv}
                                            otherUser={getOtherUser(conv)}
                                            unreadCount={conv.unreadCount[user.uid] || 0}
                                            formatTime={formatTime}
                                            onClick={() => selectConversation(conv.id)}
                                        />
                                    ))
                                )}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Floating Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110 ${isOpen ? 'bg-slate-700' : 'bg-purple-500 hover:bg-purple-600'
                    }`}
            >
                {isOpen ? (
                    <X className="w-6 h-6 text-white" />
                ) : (
                    <>
                        <MessageCircle className="w-6 h-6 text-white" />
                        {unreadTotal > 0 && (
                            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                                {unreadTotal > 9 ? '9+' : unreadTotal}
                            </span>
                        )}
                    </>
                )}
            </button>
        </div>
    )
}

// Message Bubble Component
interface MessageBubbleProps {
    message: ChatMessage
    isOwn: boolean
    formatTime: (date: Date) => string
}

function MessageBubble({ message, isOwn, formatTime }: MessageBubbleProps) {
    if (message.type === 'system') {
        return (
            <div className="text-center">
                <span className="text-xs text-gray-500 bg-slate-800 px-3 py-1 rounded-full">
                    {message.content}
                </span>
            </div>
        )
    }

    return (
        <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[75%] ${isOwn ? 'order-1' : ''}`}>
                {message.type === 'offer' && (
                    <div className={`px-4 py-3 rounded-2xl ${isOwn ? 'bg-purple-500' : 'bg-slate-700'
                        }`}>
                        <p className="text-xs text-gray-400 mb-1">💰 ข้อเสนอราคา</p>
                        <p className="text-lg font-bold text-white">
                            ฿{message.offerAmount?.toLocaleString()}
                        </p>
                        {message.offerStatus && (
                            <span className={`text-xs mt-2 inline-block px-2 py-0.5 rounded ${message.offerStatus === 'accepted' ? 'bg-emerald-500/20 text-emerald-400' :
                                    message.offerStatus === 'rejected' ? 'bg-red-500/20 text-red-400' :
                                        'bg-yellow-500/20 text-yellow-400'
                                }`}>
                                {message.offerStatus === 'accepted' ? 'ยอมรับแล้ว' :
                                    message.offerStatus === 'rejected' ? 'ปฏิเสธ' : 'รอตอบ'}
                            </span>
                        )}
                    </div>
                )}

                {message.type === 'image' && message.imageUrl && (
                    <div className="rounded-2xl overflow-hidden">
                        <Image
                            src={message.imageUrl}
                            alt=""
                            width={200}
                            height={200}
                            className="max-w-full rounded-2xl"
                        />
                    </div>
                )}

                {message.type === 'text' && (
                    <div className={`px-4 py-2.5 rounded-2xl ${isOwn
                            ? 'bg-purple-500 text-white rounded-br-md'
                            : 'bg-slate-700 text-white rounded-bl-md'
                        }`}>
                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    </div>
                )}

                <p className={`text-xs text-gray-600 mt-1 ${isOwn ? 'text-right' : ''}`}>
                    {formatTime(message.createdAt)}
                </p>
            </div>
        </div>
    )
}

// Conversation Item Component
interface ConversationItemProps {
    conversation: Conversation
    otherUser: { id: string; name: string; avatar?: string } | null
    unreadCount: number
    formatTime: (date: Date) => string
    onClick: () => void
}

function ConversationItem({
    conversation,
    otherUser,
    unreadCount,
    formatTime,
    onClick
}: ConversationItemProps) {
    return (
        <button
            onClick={onClick}
            className={`w-full flex items-center gap-3 p-4 hover:bg-slate-800 border-b border-slate-800 text-left ${unreadCount > 0 ? 'bg-purple-500/5' : ''
                }`}
        >
            {/* Avatar */}
            {otherUser?.avatar ? (
                <Image
                    src={otherUser.avatar}
                    alt=""
                    width={48}
                    height={48}
                    className="w-12 h-12 rounded-full"
                />
            ) : (
                <div className="w-12 h-12 rounded-full bg-slate-700 flex items-center justify-center">
                    <User className="w-6 h-6 text-gray-500" />
                </div>
            )}

            {/* Content */}
            <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                    <span className={`font-medium truncate ${unreadCount > 0 ? 'text-white' : 'text-gray-300'
                        }`}>
                        {otherUser?.name || 'User'}
                    </span>
                    <span className="text-xs text-gray-600">
                        {conversation.lastMessage && formatTime(conversation.lastMessage.createdAt)}
                    </span>
                </div>

                {conversation.listingTitle && (
                    <p className="text-xs text-gray-600 truncate">
                        📦 {conversation.listingTitle}
                    </p>
                )}

                <p className={`text-sm truncate ${unreadCount > 0 ? 'text-gray-300 font-medium' : 'text-gray-500'
                    }`}>
                    {conversation.lastMessage?.content || 'เริ่มการสนทนา...'}
                </p>
            </div>

            {/* Unread Badge */}
            {unreadCount > 0 && (
                <span className="w-5 h-5 bg-purple-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                    {unreadCount > 9 ? '9+' : unreadCount}
                </span>
            )}
        </button>
    )
}
