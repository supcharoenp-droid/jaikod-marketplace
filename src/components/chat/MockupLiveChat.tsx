'use client'

import React, { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
    ArrowLeft, Send, Image as ImageIcon, Phone, Video,
    MoreVertical, Check, CheckCheck, MapPin,
    ShieldCheck, AlertTriangle, Sparkles, Bot, Plus,
    X, Paperclip, Smile
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { MockChatSocket, realtimeChatService, ChatMessage } from '@/services/realtimeChatService'

// Types for Prop
interface ChatDetailProps {
    participant: {
        id: string
        name: string
        avatar: string
        isOnline: boolean
        trustScore: number
        isVerified: boolean
    }
    product?: {
        id: string
        title: string
        price: number
        thumbnail: string
    }
}

export default function MockupLiveChat() {
    // Hardcoded Mock Context for Demo
    const mockPartner = {
        id: 'user_99',
        name: 'Seller Pro Shop',
        avatar: 'https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=100&h=100&fit=crop',
        isOnline: true,
        trustScore: 95,
        isVerified: true
    }
    const mockProduct = {
        id: 'prod_1',
        title: 'Sony A7III Body Only สภาพ 98% ชัตเตอร์น้อย',
        price: 42500,
        thumbnail: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=100&h=100&fit=crop'
    }

    return (
        <div className="h-screen bg-gray-100 dark:bg-black flex justify-center items-center p-4 md:p-8">
            {/* Mobile Container Simulation */}
            <div className="w-full max-w-[400px] h-[800px] max-h-screen bg-white dark:bg-gray-900 rounded-[2.5rem] shadow-2xl overflow-hidden border-4 border-gray-900 dark:border-gray-800 flex flex-col relative">
                {/* Dynamic Island Decor */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 h-7 w-32 bg-black rounded-b-3xl z-50"></div>

                <ChatInterface participant={mockPartner} product={mockProduct} />
            </div>
        </div>
    )
}

function ChatInterface({ participant, product }: ChatDetailProps) {
    const [messages, setMessages] = useState<ChatMessage[]>([])
    const [inputText, setInputText] = useState('')
    const [isTyping, setIsTyping] = useState(false) // Partner typing
    const [showSafetyWarning, setShowSafetyWarning] = useState<string | null>(null)
    const [smartReplies, setSmartReplies] = useState<string[]>([])
    const [showAttachMenu, setShowAttachMenu] = useState(false)
    const socketRef = useRef<MockChatSocket | null>(null)
    const messagesEndRef = useRef<HTMLDivElement>(null)

    // Init
    useEffect(() => {
        const loadHistory = async () => {
            const hist = await realtimeChatService.getHistory('mock_conv')
            setMessages(hist)
        }
        loadHistory()

        // Connect Socket
        socketRef.current = new MockChatSocket()
        socketRef.current.connect('me', 'mock_conv')

        socketRef.current.on('typing', (status: boolean) => {
            setIsTyping(status)
        })

        socketRef.current.on('message', (msg: ChatMessage) => {
            setMessages(prev => [...prev, msg])
            playNotifySound()
        })

        return () => {
            socketRef.current?.disconnect()
        }
    }, [])

    // Update Smart Replies when messages change
    useEffect(() => {
        const context = messages.slice(-3).map(m => m.text)
        setSmartReplies(realtimeChatService.getSmartReplies(context))
        scrollToBottom()
    }, [messages])

    // Safety Check on Typing
    useEffect(() => {
        const check = realtimeChatService.analyzeSafety(inputText)
        if (!check.safe && check.warning) {
            setShowSafetyWarning(check.warning)
        } else {
            setShowSafetyWarning(null)
        }
    }, [inputText])

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    const handleSend = async () => {
        if (!inputText.trim()) return

        const newMsg = await realtimeChatService.sendMessage(inputText)
        setMessages(prev => [...prev, newMsg])
        setInputText('')
        setShowSafetyWarning(null)
    }

    const sendQuickReply = (text: string) => {
        setInputText(text)
        // Optionally auto-send: handleSend()
    }

    const playNotifySound = () => {
        // Implementation detail
    }

    return (
        <div className="flex flex-col h-full bg-[#f0f2f5] dark:bg-[#0b0b0b]">

            {/* 1. Header */}
            <header className="bg-white dark:bg-[#1a1a1a] p-3 pt-10 pb-3 flex items-center justify-between shadow-sm z-20">
                <div className="flex items-center gap-3">
                    <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full">
                        <ArrowLeft className="w-6 h-6 text-gray-700 dark:text-gray-200" />
                    </button>
                    <div className="relative">
                        <Image src={participant.avatar} alt="Avatar" width={40} height={40} className="rounded-full ring-2 ring-white dark:ring-black" />
                        {participant.isOnline && (
                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-black rounded-full mb-0.5 mr-0.5"></div>
                        )}
                    </div>
                    <div>
                        <div className="flex items-center gap-1">
                            <h3 className="font-bold text-sm text-gray-900 dark:text-gray-100">{participant.name}</h3>
                            {participant.isVerified && <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />}
                        </div>
                        <p className="text-xs text-green-500 font-medium">
                            {participant.isOnline ? 'ใช้งานเมื่อสักครู่' : 'Offline'}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <Phone className="w-5 h-5 text-neon-purple cursor-pointer hover:text-purple-600" />
                    <MoreVertical className="w-5 h-5 text-gray-500 cursor-pointer" />
                </div>
            </header>

            {/* 2. Product Sticky Bar (Context) */}
            {product && (
                <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm px-4 py-2 flex items-center gap-3 border-b border-gray-100 dark:border-slate-700 z-10">
                    <Image src={product.thumbnail} alt="Prod" width={40} height={40} className="rounded object-cover" />
                    <div className="flex-1 min-w-0">
                        <div className="text-sm font-bold truncate text-gray-800 dark:text-gray-200">{product.title}</div>
                        <div className="text-xs text-neon-purple font-black">฿{product.price.toLocaleString()}</div>
                    </div>
                    <button className="text-xs bg-neon-purple text-white px-3 py-1.5 rounded-full font-bold shadow-md shadow-purple-500/20">
                        ซื้อเลย
                    </button>
                </div>
            )}

            {/* 3. Message Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 relative">
                {/* Safety Banner */}
                {/* Safe meeting point suggestion mocked inside messages or top */}

                {messages.map((msg, idx) => {
                    const isMe = msg.senderId === 'me'
                    // Grouping logic (simplified)
                    const showAvatar = !isMe && (idx === 0 || messages[idx - 1].senderId !== msg.senderId)

                    return (
                        <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'} mb-1`}>
                            {!isMe && showAvatar && (
                                <Image src={participant.avatar} alt="" width={28} height={28} className="rounded-full mr-2 self-end mb-1" />
                            )}
                            {!isMe && !showAvatar && <div className="w-9" />} {/* Spacer */}

                            <div className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm relative group shadow-sm ${isMe
                                    ? 'bg-neon-purple text-white rounded-br-none'
                                    : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-bl-none'
                                }`}>
                                {msg.type === 'location' ? (
                                    <div className="flex items-start gap-2">
                                        <MapPin className="w-8 h-8 p-1.5 bg-white/20 rounded-full" />
                                        <div>
                                            <div className="font-bold">แชร์ตำแหน่งที่ตั้ง</div>
                                            <div className="text-xs opacity-80 underline">ดูในแผนที่</div>
                                        </div>
                                    </div>
                                ) : (
                                    <span>{msg.text}</span>
                                )}

                                {/* Time & Status */}
                                <div className={`text-[9px] mt-1 flex items-center justify-end gap-1 opacity-70 ${isMe ? 'text-white' : 'text-gray-400'}`}>
                                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    {isMe && (
                                        msg.status === 'read' ? <CheckCheck className="w-3 h-3" /> : <Check className="w-3 h-3" />
                                    )}
                                </div>
                            </div>
                        </div>
                    )
                })}

                {/* Typing Indicator */}
                {isTyping && (
                    <div className="flex justify-start mb-2 ml-10">
                        <div className="bg-gray-200 dark:bg-gray-800 px-4 py-3 rounded-2xl rounded-bl-none flex gap-1">
                            <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
                            <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                            <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* 4. Footer & Composer */}
            <div className="bg-white dark:bg-gray-900 p-3 pt-2">

                {/* AI Smart Suggest (Pills) */}
                <div className="flex gap-2 overflow-x-auto no-scrollbar mb-2 px-1">
                    <button className="flex items-center gap-1 text-[10px] bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1.5 rounded-full font-bold flex-shrink-0">
                        <Sparkles className="w-3 h-3" /> AI Assist
                    </button>
                    {smartReplies.map((reply, i) => (
                        <button
                            key={i}
                            onClick={() => sendQuickReply(reply)}
                            className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 px-3 py-1.5 rounded-full border border-transparent hover:border-purple-300 transition-colors whitespace-nowrap"
                        >
                            {reply}
                        </button>
                    ))}
                </div>

                {/* Warning Overlay */}
                <AnimatePresence>
                    {showSafetyWarning && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-300 text-xs p-2 rounded-lg mb-2 flex items-start gap-2"
                        >
                            <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                            <span>{showSafetyWarning}</span>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Attachments Menu (Overlay attempt) */}
                <AnimatePresence>
                    {showAttachMenu && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 20 }}
                            className="absolute bottom-20 left-4 bg-white dark:bg-gray-800 shadow-xl rounded-xl p-3 grid grid-cols-3 gap-4 border border-gray-100 dark:border-gray-700 z-30"
                        >
                            <div className="flex flex-col items-center gap-1 cursor-pointer hover:bg-gray-50 p-2 rounded">
                                <div className="bg-pink-100 p-2 rounded-full"><ImageIcon className="w-5 h-5 text-pink-500" /></div>
                                <span className="text-[10px]">รูปภาพ</span>
                            </div>
                            <div className="flex flex-col items-center gap-1 cursor-pointer hover:bg-gray-50 p-2 rounded">
                                <div className="bg-green-100 p-2 rounded-full"><MapPin className="w-5 h-5 text-green-500" /></div>
                                <span className="text-[10px]">ตำแหน่ง</span>
                            </div>
                            <div className="flex flex-col items-center gap-1 cursor-pointer hover:bg-gray-50 p-2 rounded">
                                <div className="bg-blue-100 p-2 rounded-full"><Bot className="w-5 h-5 text-blue-500" /></div>
                                <span className="text-[10px]">นัดเจอ</span>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Input Bar */}
                <div className="flex items-end gap-2 bg-gray-100 dark:bg-gray-800 p-1.5 pl-3 rounded-[24px]">
                    <button
                        onClick={() => setShowAttachMenu(!showAttachMenu)}
                        className="pb-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                    >
                        <Plus className={`w-6 h-6 transition-transform ${showAttachMenu ? 'rotate-45' : ''}`} />
                    </button>
                    <textarea
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        placeholder="พิมพ์ข้อความ..."
                        className="flex-1 bg-transparent border-none outline-none text-sm resize-none max-h-24 py-2.5 text-gray-900 dark:text-gray-100"
                        rows={1}
                        style={{ minHeight: '40px' }}
                    />
                    <button
                        onClick={handleSend}
                        className={`p-2 rounded-full mb-0.5 transition-all ${inputText.trim()
                                ? 'bg-neon-purple text-white shadow-md'
                                : 'bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed'
                            }`}
                        disabled={!inputText.trim()}
                    >
                        <Send className="w-5 h-5" />
                    </button>
                </div>
            </div>

        </div>
    )
}
