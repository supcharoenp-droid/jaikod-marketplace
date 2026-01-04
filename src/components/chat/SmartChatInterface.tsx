'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Send, MapPin, Image as ImageIcon, Video, Paperclip, MoreVertical, ShieldAlert, Sparkles, Check, CheckCheck } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChatMessage, ChatUser } from '@/services/realtimeChatService'

// Mock functions since they don't exist in realtimeChatService
const sendMessage = async (conversationId: string, text: string): Promise<ChatMessage> => {
    return {
        id: 'm_' + Date.now(),
        senderId: 'current_user',
        text,
        type: 'text' as const,
        isRead: false,
        createdAt: Date.now(),
        status: 'sent' as const
    }
}

const getSmartReplies = async (text: string): Promise<string[]> => {
    if (text.includes('นัดรับ')) return ['ได้ครับ สะดวกวันไหน?', 'นัด BTS สยาม ได้ไหมครับ', 'ขอดูสินค้าก่อนได้ไหม?']
    return ['สนใจครับ', 'ขอดูรูปเพิ่มได้ไหม?', 'ลดได้ไหมครับ']
}

const checkSafety = async (text: string): Promise<string | null> => {
    const scamPatterns = ['โอนก่อน', 'โอนเงิน', 'เลขบัญชี']
    if (scamPatterns.some(p => text.includes(p))) {
        return '⚠️ ระวัง! ข้อความนี้อาจมีความเสี่ยง ควรนัดรับสินค้าด้วยตนเอง'
    }
    return null
}

const getSafeMeetingPoints = (): string[] => {
    return ['BTS สยาม', 'Police Box ลุมพินี', 'ศูนย์การค้า Central']
}

interface SmartChatProps {
    currentUser: ChatUser
    otherUser: ChatUser
    conversationId: string
    initialMessages?: ChatMessage[]
}

export default function SmartChatInterface({ currentUser, otherUser, conversationId, initialMessages = [] }: SmartChatProps) {
    const [messages, setMessages] = useState<ChatMessage[]>(initialMessages)
    const [inputText, setInputText] = useState('')
    const [isTyping, setIsTyping] = useState(false) // Other user is typing
    const [smartReplies, setSmartReplies] = useState<string[]>([])
    const [safetyWarning, setSafetyWarning] = useState<string | null>(null)
    const [showSafeSpots, setShowSafeSpots] = useState(false)
    const messagesEndRef = useRef<HTMLDivElement>(null)

    // Scroll to bottom
    const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    useEffect(scrollToBottom, [messages, isTyping])

    // Mock incoming typing & messages
    useEffect(() => {
        // Mock: Other user replies after 5s
        const lastMsg = messages[messages.length - 1]
        if (lastMsg && lastMsg.senderId === currentUser.id) {

            // 1. Simulate Typing
            setTimeout(() => setIsTyping(true), 1500)

            // 2. Simulate Reply
            const timer = setTimeout(async () => {
                setIsTyping(false)
                const replyText = 'โอเคครับ สนใจสินค้า ขอนัดรับได้ไหมครับ'
                const reply: ChatMessage = {
                    id: 'r_' + Date.now(),
                    senderId: otherUser.id,
                    text: replyText,
                    type: 'text',
                    isRead: false,
                    createdAt: Date.now(),
                    status: 'delivered' as const
                }
                setMessages(prev => [...prev, reply])

                // AI Safety Check on incoming
                const warning = await checkSafety(replyText)
                if (warning) setSafetyWarning(warning)

                // Trigger Smart Replies for ME
                const suggestions = await getSmartReplies(replyText)
                setSmartReplies(suggestions)

                if (replyText.includes('นัดรับ')) setShowSafeSpots(true)

            }, 4000)
            return () => clearTimeout(timer)
        }
    }, [messages])

    const handleSend = async (text: string = inputText) => {
        if (!text.trim()) return

        const newMsg = await sendMessage(conversationId, text)
        setMessages(prev => [...prev, newMsg])
        setInputText('')
        setSmartReplies([]) // Clear old suggestions
        setShowSafeSpots(false)

        // Safety check outgoing
        const warning = await checkSafety(text)
        if (warning) setSafetyWarning(warning)
    }

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSend()
        }
    }

    return (
        <div className="flex flex-col h-[600px] bg-white dark:bg-card-dark rounded-xl border border-gray-200 dark:border-gray-800 shadow-xl overflow-hidden">
            {/* Header */}
            <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-white dark:bg-gray-900 z-10">
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <img src={otherUser.avatar} className="w-10 h-10 rounded-full object-cover border" />
                        {otherUser.isOnline && (
                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                        )}
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            {otherUser.name}
                            {/* Verified Badge */}
                            <svg className="w-4 h-4 text-blue-500" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" /></svg>
                        </h3>
                        <p className="text-xs text-green-600 font-medium">
                            {isTyping ? 'กำลังพิมพ์...' : otherUser.isOnline ? 'ใช้งานเมื่อสักครู่' : 'ออฟไลน์'}
                        </p>
                    </div>
                </div>
                <button className="text-gray-400 hover:text-gray-600"><MoreVertical className="w-5 h-5" /></button>
            </div>

            {/* AI Safety Banner */}
            <AnimatePresence>
                {safetyWarning && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-300 px-4 py-2 text-xs flex items-center justify-between"
                    >
                        <div className="flex items-center gap-2">
                            <ShieldAlert className="w-4 h-4 shrink-0" />
                            {safetyWarning}
                        </div>
                        <button onClick={() => setSafetyWarning(null)} className="text-red-400 hover:text-red-600">×</button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-800/20 relative">
                {messages.map((msg, idx) => {
                    const isMe = msg.senderId === currentUser.id
                    return (
                        <motion.div
                            key={msg.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                        >
                            <div className={`max-w-[70%] rounded-2xl p-3 text-sm ${isMe
                                ? 'bg-blue-600 text-white rounded-br-none shadow-blue-500/20 shadow-lg'
                                : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-bl-none shadow-sm'
                                }`}>
                                {msg.text}
                                <div className={`text-[10px] mt-1 flex items-center justify-end gap-1 ${isMe ? 'text-blue-200' : 'text-gray-400'}`}>
                                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    {isMe && (
                                        msg.isRead ? <CheckCheck className="w-3 h-3" /> : <Check className="w-3 h-3" />
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    )
                })}

                {/* Typing Indicator Bubble */}
                {isTyping && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                        <div className="bg-white dark:bg-gray-800 rounded-2xl rounded-bl-none p-3 shadow-sm border border-gray-100 dark:border-gray-700">
                            <div className="flex gap-1">
                                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Scroll Anchor */}
                <div ref={messagesEndRef} />
            </div>

            {/* AI Helpers Area (Floating) */}
            <div className="px-4 pb-2 bg-gray-50 dark:bg-gray-900/50">
                {/* Smart Replies */}
                {smartReplies.length > 0 && (
                    <div className="flex gap-2 mb-2 overflow-x-auto pb-1 no-scrollbar">
                        <div className="flex items-center gap-1 text-xs text-purple-600 font-bold px-2 shrink-0">
                            <Sparkles className="w-3 h-3" /> AI Suggest:
                        </div>
                        {smartReplies.map((reply, i) => (
                            <button
                                key={i}
                                onClick={() => handleSend(reply)}
                                className="whitespace-nowrap px-3 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-full text-xs font-medium border border-purple-200 transition"
                            >
                                {reply}
                            </button>
                        ))}
                    </div>
                )}

                {/* Safe Meeting Points */}
                {showSafeSpots && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-3 bg-green-50 dark:bg-green-900/10 border border-green-200 p-3 rounded-lg flex items-center justify-between"
                    >
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-green-100 rounded-full text-green-600"><MapPin className="w-4 h-4" /></div>
                            <div>
                                <div className="text-xs font-bold text-green-800">แนะนำจุดนัดพบปลอดภัย (Safe Zone)</div>
                                <div className="text-[10px] text-green-600">BTS Siam, Police Box Lumpini</div>
                            </div>
                        </div>
                        <button className="text-xs bg-green-600 text-white px-3 py-1.5 rounded-md hover:bg-green-700">ส่งพิกัด</button>
                    </motion.div>
                )}
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800">
                <div className="flex items-end gap-2">
                    <button className="p-2 text-gray-400 hover:text-blue-500 transition hover:bg-blue-50 rounded-full"><ImageIcon className="w-5 h-5" /></button>
                    <button className="p-2 text-gray-400 hover:text-blue-500 transition hover:bg-blue-50 rounded-full"><MapPin className="w-5 h-5" /></button>

                    <div className="flex-1 bg-gray-100 dark:bg-gray-800 rounded-2xl px-4 py-2 focus-within:ring-2 focus-within:ring-blue-500/50 transition">
                        <input
                            type="text"
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            onKeyDown={handleKeyPress}
                            placeholder="พิมพ์ข้อความ..."
                            className="w-full bg-transparent border-none focus:outline-none text-sm min-h-[24px]"
                        />
                    </div>

                    <button
                        onClick={() => handleSend()}
                        disabled={!inputText.trim()}
                        className="p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:hover:bg-blue-600 transition shadow-lg shadow-blue-500/30"
                    >
                        <Send className="w-4 h-4 ml-0.5" />
                    </button>
                </div>
            </div>
        </div>
    )
}
