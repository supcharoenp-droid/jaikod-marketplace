'use client'

import React, { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
    Search, MoreHorizontal, Phone, Video, Info,
    Image as ImageIcon, MapPin, Send, Plus,
    Smile, Paperclip, Check, CheckCheck,
    ShieldCheck, Star, AlertTriangle, Sparkles, X,
    ChevronRight, CreditCard, Truck, Users, Mic, Trash2
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { MockChatSocket, realtimeChatService, ChatMessage } from '@/services/realtimeChatService'

// Types
interface Participant {
    id: string
    slug?: string
    name: string
    avatar: string
    isOnline: boolean
    lastSeen?: string
    isVerified?: boolean
    trustScore?: number
}

interface ConversationPreview {
    id: string
    participant: Participant
    lastMessage: string
    time: string
    unreadCount: number
    isActive?: boolean
    productId?: string
}

// Mock Data
const MOCK_CONVERSATIONS: ConversationPreview[] = [
    {
        id: 'c1',
        participant: {
            id: 's1',
            slug: 'jaikod-official',
            name: 'Seller Pro Shop',
            avatar: 'https://ui-avatars.com/api/?name=Seller+Pro&background=8B5CF6&color=fff',
            isOnline: true,
            isVerified: true
        },
        lastMessage: 'ยังอยู่ครับ สอบถามได้เลย',
        time: '18:18',
        unreadCount: 0,
        isActive: true,
        productId: 'cameras-204'
    },
    {
        id: 'c2',
        participant: {
            id: 'u2',
            slug: 'user-somchai',
            name: 'Khun Somchai',
            avatar: 'https://ui-avatars.com/api/?name=Somchai&background=random',
            isOnline: false,
            lastSeen: '2h ago'
        },
        lastMessage: 'ขอบคุณครับ เดี๋ยวโอนให้ครับ',
        time: '12:45',
        unreadCount: 2,
        productId: 'mobiles-101'
    },
    {
        id: 'c3',
        participant: {
            id: 's3',
            slug: 'camera-shop',
            name: 'Camera Secondhand',
            avatar: 'https://ui-avatars.com/api/?name=Camera&background=random',
            isOnline: true,
            isVerified: true
        },
        lastMessage: 'ลดได้เต็มที่ 15,000 ครับ',
        time: 'Yesterday',
        unreadCount: 0,
        productId: 'watch-303'
    },
]

const MOCK_PRODUCTS = [
    {
        id: 'cameras-204',
        title: 'DJI Mini 4 Pro (Fly More Combo)',
        price: 32000,
        originalPrice: 35900,
        images: ['https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=500&fit=crop'],
        specs: [
            { label: 'สภาพ', value: 'มือสอง 99%' },
            { label: 'ประกัน', value: 'DJI Care 1 ปี' },
            { label: 'อุปกรณ์', value: 'ครบชุด' },
        ],
        seller: {
            id: 's1',
            name: 'Seller Pro Shop',
            slug: 'jaikod-official',
            avatar: 'https://ui-avatars.com/api/?name=Seller+Pro&background=8B5CF6&color=fff',
            isOnline: true,
            lastSeen: 'Active now',
            responseRate: 98,
            responseTime: 'within 5 mins',
            trustScore: 98,
            joinedDate: 'Joined 2023',
            reviews: 128,
            rating: 4.9
        }
    },
    {
        id: 'mobiles-101',
        title: 'iPhone 15 Pro Max (Natural Titanium)',
        price: 41500,
        originalPrice: 48900,
        images: ['https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=500&fit=crop'],
        specs: [
            { label: 'ความจุ', value: '256GB' },
            { label: 'สภาพ', value: 'นางฟ้า' },
            { label: 'แบตเตอรี่', value: '98%' },
        ],
        seller: {
            id: 's2',
            name: 'Mobile Cafe',
            slug: 'mobile-cafe',
            avatar: 'https://ui-avatars.com/api/?name=Mobile+Cafe',
            isOnline: true,
            lastSeen: '1h ago',
            responseRate: 95,
            responseTime: 'within 10 mins',
            trustScore: 90,
            joinedDate: 'Joined 2024',
            reviews: 45,
            rating: 4.7
        }
    },
    {
        id: 'watch-303',
        title: 'Rolex Submariner Date',
        price: 450000,
        originalPrice: 480000,
        images: ['https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=500&fit=crop'],
        specs: [
            { label: 'ปี', value: '2022' },
            { label: 'กล่อง/ใบ', value: 'ครบ' },
            { label: 'สภาพ', value: 'Used Like New' },
        ],
        seller: {
            id: 's3',
            name: 'Camera Secondhand',
            slug: 'camera-shop',
            avatar: 'https://ui-avatars.com/api/?name=Camera&background=random',
            isOnline: true,
            lastSeen: 'Active now',
            responseRate: 99,
            responseTime: 'Fast',
            trustScore: 100,
            joinedDate: 'Joined 2020',
            reviews: 500,
            rating: 5.0
        }
    }
]

export default function ChatSystemV2() {
    const [activeConvId, setActiveConvId] = useState('c1')
    const [messages, setMessages] = useState<ChatMessage[]>([])
    const [inputText, setInputText] = useState('')
    const [smartReplies, setSmartReplies] = useState<string[]>([])

    const [isTyping, setIsTyping] = useState(false)
    const [rightTab, setRightTab] = useState<'info' | 'tools' | 'safety'>('info')

    // Derived State
    const activeConv = MOCK_CONVERSATIONS.find(c => c.id === activeConvId)
    const activeProduct = activeConv?.productId ? MOCK_PRODUCTS.find(p => p.id === activeConv.productId) : null
    const socketRef = useRef<MockChatSocket | null>(null)
    const messagesEndRef = useRef<HTMLDivElement>(null)

    // Init Logic (Similar to V1 but adapted)
    useEffect(() => {
        // Load mock history
        const loadHistory = async () => {
            const hist = await realtimeChatService.getHistory('mock_conv_v2')
            // Transform mock history to match UI design needs if necessary
            setMessages(hist)
        }
        loadHistory()

        // Socket
        socketRef.current = new MockChatSocket()
        socketRef.current.connect('me', 'mock_conv_v2')
        socketRef.current.on('message', (msg: ChatMessage) => {
            setMessages(prev => [...prev, msg])
            setIsTyping(false)

            // Auto Read when receive
            setTimeout(() => {
                setMessages(current =>
                    current.map(m => m.id === msg.id ? { ...m, isRead: true, status: 'read' } : m)
                )
            }, 1000)
        })
        socketRef.current.on('typing', (status: boolean) => {
            setIsTyping(status)
        })

        return () => {
            socketRef.current?.disconnect()
        }
    }, [activeConvId])

    // Generate Smart Replies
    useEffect(() => {
        // Simple mock logic for demo
        setSmartReplies(['ลดได้นิดหน่อยครับ', 'เต็มที่แล้วครับ', 'เสนอนัดรับได้ครับ'])
    }, [messages])

    // Scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages, activeConvId, isTyping])


    const handleDeleteMessage = async (msgId: string) => {
        if (confirm('คุณต้องการลบข้อความนี้ใช่หรือไม่?')) {
            // Optimistic update
            setMessages(prev => prev.filter(m => m.id !== msgId))
            // Call service
            try {
                await realtimeChatService.deleteMessage(msgId)
            } catch (error) {
                console.error('Failed to delete message', error)
                // Revert if failed (optional, but good for stability)
            }
        }
    }

    const handleSend = async () => {
        if (!inputText.trim()) return
        const newMsg = await realtimeChatService.sendMessage(inputText)
        setMessages(prev => [...prev, newMsg])
        setInputText('')

        // Simulate "Read" status update after 2 seconds
        setTimeout(() => {
            setMessages(current =>
                current.map(m => m.id === newMsg.id ? { ...m, isRead: true, status: 'read' } : m)
            )
        }, 2000)

        // Simulate immediate typing response for demo feel
        setTimeout(() => {
            if (socketRef.current) {
                // Manually trigger mock response logic if needed, 
                // but real socket should handle it.
                // For now, let's rely on the mock socket interval or 
                // force a reply via a timeout if we want to ensure "activity"
            }
        }, 1000)
    }

    const handleAIAssist = async () => {
        setIsTyping(true)
        // Simulate AI thinking
        setTimeout(() => {
            setIsTyping(false)
            setInputText('สวัสดีครับ สนใจสินค้านี้ครับ ไม่ทราบว่าลดได้อีกไหมครับ?')
        }, 800)
    }

    const handleImageUpload = async () => {
        // Simulate upload
        const newMsg = await realtimeChatService.sendMessage('ส่งรูปภาพแล้ว', 'image')
        // Mock image URL
        newMsg.mediaUrl = 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500&h=500&fit=crop'
        setMessages(prev => [...prev, newMsg])

        setTimeout(() => {
            setMessages(current =>
                current.map(m => m.id === newMsg.id ? { ...m, isRead: true, status: 'read' } : m)
            )
        }, 2000)
    }

    const handleCreateOrder = async () => {
        const newMsg = await realtimeChatService.sendMessage('สร้างใบสั่งซื้อแล้ว', 'order_offer')
        newMsg.metadata = {
            orderId: `ORD-${Date.now()}`,
            orderId: `ORD-${Date.now()}`,
            offerPrice: activeProduct?.price || 0,
            items: [{ name: activeProduct?.title || 'สินค้า', qty: 1, price: activeProduct?.price || 0 }]
        }
        setMessages(prev => [...prev, newMsg])
    }

    const handleCannedReply = (text: string) => {
        setInputText(text)
        // Optionally auto-send
    }

    return (
        <div className="flex h-[calc(100vh-64px)] bg-gray-50 dark:bg-[#0b0b0b] overflow-hidden">
            {/* 1. Left Sidebar: Conversation List */}
            <div className="w-80 bg-white dark:bg-[#111] border-r border-gray-200 dark:border-gray-800 flex flex-col">
                <div className="p-4 border-b border-gray-100 dark:border-gray-800">
                    <h2 className="text-xl font-bold mb-4 font-display">ข้อความ</h2>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="ค้นหาแชท..."
                            className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-xl text-sm outline-none focus:ring-2 ring-primary-500/20 transition-all"
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto">
                    {MOCK_CONVERSATIONS.map(conv => (
                        <div
                            key={conv.id}
                            onClick={() => setActiveConvId(conv.id)}
                            className={`p-4 flex items-center gap-3 cursor-pointer transition-colors ${activeConvId === conv.id
                                ? 'bg-primary-50 dark:bg-primary-900/10 border-l-4 border-primary-500'
                                : 'hover:bg-gray-50 dark:hover:bg-gray-800 border-l-4 border-transparent'
                                }`}
                        >
                            <div className="relative">
                                <Image src={conv.participant.avatar} alt={conv.participant.name} width={48} height={48} className="rounded-full" />
                                {conv.participant.isOnline && (
                                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-[#111] rounded-full"></div>
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-baseline mb-1">
                                    <h3 className={`font-semibold text-sm truncate ${activeConvId === conv.id ? 'text-primary-600 dark:text-primary-400' : ''}`}>
                                        {conv.participant.name}
                                    </h3>
                                    <span className="text-xs text-gray-400">{conv.time}</span>
                                </div>
                                <p className={`text-sm truncate ${conv.unreadCount > 0 ? 'font-bold text-gray-900 dark:text-white' : 'text-gray-500'}`}>
                                    {conv.lastMessage}
                                </p>
                            </div>
                            {conv.unreadCount > 0 && (
                                <div className="w-5 h-5 bg-red-500 text-white text-[10px] flex items-center justify-center rounded-full font-bold">
                                    {conv.unreadCount}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* 2. Middle Section: Main Chat */}
            <div className="flex-1 flex flex-col min-w-0 bg-[#f8f9fa] dark:bg-black relative">
                {/* Header */}
                <header className="h-16 bg-white dark:bg-[#111] border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-6 shadow-sm z-10">
                    {activeConv && (
                        <Link href={`/shop/${activeConv.participant.slug || activeConv.participant.id}`} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                            <Image src={activeConv.participant.avatar} alt="" width={40} height={40} className="rounded-full" />
                            <div>
                                <div className="flex items-center gap-1.5">
                                    <h2 className="font-bold text-gray-900 dark:text-white">{activeConv.participant.name}</h2>
                                    {activeConv.participant.isVerified && <ShieldCheck className="w-4 h-4 text-blue-500" />}
                                </div>
                                <div className="text-xs text-green-500 font-medium flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                                    ใช้งานเมื่อสักครู่
                                </div>
                            </div>
                        </Link>
                    )}
                    <div className="flex items-center gap-4 text-gray-500">
                        <Phone className="w-5 h-5 cursor-pointer hover:text-primary-500 transition-colors" />
                        <Video className="w-5 h-5 cursor-pointer hover:text-primary-500 transition-colors" />
                        <Info className="w-5 h-5 cursor-pointer hover:text-primary-500 transition-colors" />
                    </div>
                </header>

                {/* Product Context Strip */}
                {/* Product Context Strip */}
                {activeProduct && (
                    <div className="bg-white/80 dark:bg-[#111]/80 backdrop-blur-md px-6 py-3 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between sticky top-0 z-10">
                        <Link href={`/product/${activeProduct.id}`} className="flex items-center gap-4 group cursor-pointer">
                            <div className="w-12 h-12 bg-gray-200 rounded-lg overflow-hidden relative group-hover:scale-105 transition-transform">
                                <Image src={activeProduct.images[0]} alt="Product" fill className="object-cover" />
                            </div>
                            <div>
                                <div className="font-bold text-sm text-gray-900 dark:text-white truncate max-w-md group-hover:text-primary-500 transition-colors">{activeProduct.title}</div>
                                <div className="text-primary-600 font-bold text-sm">฿{activeProduct.price.toLocaleString()}</div>
                            </div>
                        </Link>
                        <button className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-lg shadow-primary-500/20 transition-all">
                            ซื้อเลย
                        </button>
                    </div>
                )}

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    {messages.map((msg, i) => {
                        const isMe = msg.senderId === 'me'
                        return (
                            <div key={msg.id} className={`flex group relative ${isMe ? 'justify-end' : 'justify-start'}`}>
                                {isMe && (
                                    <button
                                        onClick={() => handleDeleteMessage(msg.id)}
                                        className="opacity-0 group-hover:opacity-100 absolute top-1/2 -translate-y-1/2 -left-8 p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-all"
                                        title="ลบข้อความ"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                )}
                                {!isMe && (
                                    <Link href={`/shop/${activeConv?.participant.slug || activeConv?.participant.id}`}>
                                        <Image src={activeConv?.participant.avatar!} alt="" width={32} height={32} className="rounded-full self-end mb-1 mr-2 cursor-pointer hover:opacity-80" />
                                    </Link>
                                )}
                                <div className={`max-w-[70%] px-5 py-3 rounded-2xl text-sm shadow-sm ${isMe
                                    ? 'bg-violet-600 text-white rounded-br-none'
                                    : 'bg-white dark:bg-[#1a1a1a] text-gray-800 dark:text-gray-200 rounded-bl-none'
                                    }`}>
                                    {msg.type === 'text' && msg.text}
                                    {msg.type === 'image' && msg.mediaUrl && (
                                        <>
                                            {msg.text && <div className="mb-2">{msg.text}</div>}
                                            <div className="mt-1 rounded-lg overflow-hidden relative w-full h-48 min-w-[200px]">
                                                <Image src={msg.mediaUrl} alt="Sent image" fill className="object-cover" />
                                            </div>
                                        </>
                                    )}
                                    {msg.type === 'order_offer' && msg.metadata && (
                                        <div className="mt-1 min-w-[240px]">
                                            <div className="text-xs font-bold mb-2 opacity-80">{msg.text}</div>
                                            <div className="bg-white dark:bg-black/40 rounded-xl p-3 border border-gray-200 dark:border-gray-700/50">
                                                <div className="flex items-center gap-2 mb-2 border-b border-gray-100 dark:border-gray-700/50 pb-2">
                                                    <div className="w-8 h-8 bg-violet-100 text-violet-600 rounded-full flex items-center justify-center">
                                                        <CreditCard className="w-4 h-4" />
                                                    </div>
                                                    <span className="font-bold text-gray-900 dark:text-white text-sm">ใบเสนอราคา</span>
                                                </div>
                                                <div className="space-y-1 mb-3">
                                                    {msg.metadata.items?.map((item: any, idx: number) => (
                                                        <div key={idx} className="flex justify-between text-xs text-gray-600 dark:text-gray-300">
                                                            <span>{item.name} x{item.qty}</span>
                                                            <span>฿{(item.price * item.qty).toLocaleString()}</span>
                                                        </div>
                                                    ))}
                                                    <div className="flex justify-between font-bold text-gray-900 dark:text-white pt-2 border-t border-dashed border-gray-200 dark:border-gray-700">
                                                        <span>ยอดรวมสุทธิ</span>
                                                        <span className="text-violet-600">฿{msg.metadata.offerPrice?.toLocaleString()}</span>
                                                    </div>
                                                </div>
                                                <button className="w-full bg-violet-600 text-white text-xs py-2 rounded-lg font-bold hover:bg-violet-700 transition-colors shadow-sm">
                                                    ชำระเงินทันที
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                    <div className={`text-[10px] mt-1 text-right flex items-center justify-end gap-1 ${isMe ? 'text-white/80' : 'text-gray-400'}`}>
                                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        {isMe && (
                                            msg.status === 'read' || msg.isRead
                                                ? <CheckCheck className="w-3 h-3 text-sky-200" />
                                                : <Check className="w-3 h-3 text-white/50" />
                                        )}
                                    </div>
                                </div>
                            </div>
                        )
                    })}

                    {/* Typing Indicator */}
                    <AnimatePresence>
                        {isTyping && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                className="flex justify-start items-end"
                            >
                                <Image src={activeConv?.participant.avatar!} alt="" width={24} height={24} className="rounded-full mb-1 mr-2" />
                                <div className="bg-gray-200 dark:bg-gray-800 px-4 py-3 rounded-2xl rounded-bl-none flex gap-1">
                                    <motion.div className="w-1.5 h-1.5 bg-gray-500 rounded-full" animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6 }} />
                                    <motion.div className="w-1.5 h-1.5 bg-gray-500 rounded-full" animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} />
                                    <motion.div className="w-1.5 h-1.5 bg-gray-500 rounded-full" animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} />
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div ref={messagesEndRef} />
                </div>

                {/* Footer Input */}
                <div className="p-4 bg-white dark:bg-[#111] border-t border-gray-200 dark:border-gray-800">
                    {/* AI Chips */}
                    <div className="flex gap-2 mb-3 overflow-x-auto no-scrollbar">
                        <button
                            onClick={handleAIAssist}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white text-xs font-bold rounded-full shadow-md hover:shadow-lg transition-all scale-100 hover:scale-105 active:scale-95"
                        >
                            <Sparkles className="w-3 h-3" /> AI Assist
                        </button>
                        {smartReplies.map((reply, i) => (
                            <button
                                key={i}
                                onClick={() => setInputText(reply)}
                                className="px-3 py-1.5 bg-gray-100 dark:bg-gray-800 hover:bg-primary-50 dark:hover:bg-primary-900/20 text-gray-700 dark:text-gray-300 text-xs rounded-full border border-transparent hover:border-primary-200 transition-all whitespace-nowrap"
                            >
                                {reply}
                            </button>
                        ))}
                    </div>

                    <div className="flex items-end gap-3 bg-gray-50 dark:bg-gray-900 p-2 rounded-2xl border border-gray-200 dark:border-gray-700 focus-within:border-primary-300 transition-colors">
                        <div className="flex gap-1 px-1 pb-2">
                            <button className="p-2 text-gray-400 hover:text-primary-500 hover:bg-primary-50 dark:hover:bg-gray-800 rounded-full transition-colors">
                                <Plus className="w-5 h-5" />
                            </button>
                            <button
                                onClick={handleImageUpload}
                                className="p-2 text-gray-400 hover:text-primary-500 hover:bg-primary-50 dark:hover:bg-gray-800 rounded-full transition-colors"
                            >
                                <ImageIcon className="w-5 h-5" />
                            </button>
                            <button className="p-2 text-gray-400 hover:text-primary-500 hover:bg-primary-50 dark:hover:bg-gray-800 rounded-full transition-colors">
                                <Mic className="w-5 h-5" />
                            </button>
                        </div>
                        <textarea
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault()
                                    handleSend()
                                }
                            }}
                            placeholder="พิมพ์ข้อความ... (คลิกไอคอนรูปเพื่อส่งรูป)"
                            className="flex-1 bg-transparent border-none outline-none text-sm resize-none max-h-32 py-3 text-gray-900 dark:text-white"
                            rows={1}
                        />
                        <button
                            onClick={handleSend}
                            disabled={!inputText.trim()}
                            className={`p-3 rounded-xl mb-0.5 transition-all ${inputText.trim()
                                ? 'bg-violet-600 text-white shadow-lg shadow-violet-500/30 hover:bg-violet-700'
                                : 'bg-gray-200 dark:bg-gray-800 text-gray-400 cursor-not-allowed'
                                }`}
                        >
                            <Send className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>

            {/* 3. Right Sidebar: Details & Safety */}
            <div className="w-80 bg-white dark:bg-[#111] border-l border-gray-200 dark:border-gray-800 flex flex-col hidden xl:flex">
                {/* Tabs */}
                <div className="flex border-b border-gray-200 dark:border-gray-800">
                    <button
                        onClick={() => setRightTab('info')}
                        className={`flex-1 py-3 text-sm font-bold border-b-2 transition-colors ${rightTab === 'info' ? 'border-violet-500 text-violet-600' : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400'}`}
                    >
                        ข้อมูล
                    </button>
                    <button
                        onClick={() => setRightTab('tools')}
                        className={`flex-1 py-3 text-sm font-bold border-b-2 transition-colors ${rightTab === 'tools' ? 'border-violet-500 text-violet-600' : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400'}`}
                    >
                        คำสั่งซื้อ
                    </button>
                    <button
                        onClick={() => setRightTab('safety')}
                        className={`flex-1 py-3 text-sm font-bold border-b-2 transition-colors ${rightTab === 'safety' ? 'border-violet-500 text-violet-600' : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400'}`}
                    >
                        ความปลอดภัย
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6">
                    {rightTab === 'info' && (
                        <>
                            <h3 className="font-bold text-gray-900 dark:text-white mb-4">ข้อมูลสินค้า</h3>
                            {activeProduct ? (
                                <>
                                    <Link href={`/product/${activeProduct.id}`} className="block rounded-2xl overflow-hidden mb-4 border border-gray-100 dark:border-gray-800 shadow-sm hover:ring-2 ring-violet-500 transition-all">
                                        <div className="relative h-48 w-full">
                                            <Image src={activeProduct.images[0]} alt="" fill className="object-cover" />
                                        </div>
                                        <div className="p-4">
                                            <h4 className="font-bold text-gray-900 dark:text-white mb-1 truncate">{activeProduct.title}</h4>
                                            <div className="flex items-center gap-2 mb-3">
                                                <span className="text-xl font-bold text-violet-600">฿{activeProduct.price.toLocaleString()}</span>
                                                <span className="text-sm text-gray-400 line-through">฿{activeProduct.originalPrice.toLocaleString()}</span>
                                            </div>

                                            <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                                                {activeProduct.specs.map((spec, i) => (
                                                    <div key={i} className="flex justify-between">
                                                        <span>{spec.label}</span>
                                                        <span className="font-medium text-gray-900 dark:text-white">{spec.value}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </Link>

                                    <div className="border-t border-gray-100 dark:border-gray-800 py-6">
                                        <Link href={`/shop/${activeProduct.seller.slug}`} className="block group">
                                            <h3 className="font-bold text-gray-900 dark:text-white mb-4 group-hover:text-violet-600 transition-colors">เกี่ยวกับผู้ขาย</h3>
                                            <div className="flex items-center gap-3 mb-4">
                                                <Image src={activeProduct.seller.avatar || activeConv?.participant.avatar!} alt="" width={48} height={48} className="rounded-full group-hover:ring-2 ring-violet-500 transition-all" />
                                                <div>
                                                    <div className="font-bold text-gray-900 dark:text-white flex items-center gap-1 group-hover:text-violet-600">
                                                        {activeProduct.seller.name}
                                                        <ShieldCheck className="w-4 h-4 text-blue-500" />
                                                    </div>
                                                    <div className="text-xs text-gray-500">{activeProduct.seller.joinedDate}</div>
                                                </div>
                                            </div>
                                        </Link>

                                        <div className="grid grid-cols-2 gap-3 mb-4">
                                            <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-xl text-center">
                                                <div className="text-violet-600 font-bold text-lg">{activeProduct.seller.trustScore}%</div>
                                                <div className="text-xs text-gray-500">Trust Score</div>
                                            </div>
                                            <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-xl text-center">
                                                <div className="text-yellow-500 font-bold text-lg flex justify-center items-center gap-1">
                                                    {activeProduct.seller.rating} <Star className="w-3 h-3 fill-current" />
                                                </div>
                                                <div className="text-xs text-gray-500">Rating ({activeProduct.seller.reviews})</div>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl text-center text-gray-500 text-sm">
                                    ไม่มีข้อมูลสินค้าที่เกี่ยวข้อง
                                </div>
                            )}
                        </>
                    )}

                    {rightTab === 'tools' && (
                        <div className="space-y-6">
                            <div>
                                <h3 className="font-bold text-gray-900 dark:text-white mb-3">จัดการลูกค้า</h3>
                                <div className="flex flex-wrap gap-2">
                                    <span className="px-2 py-1 rounded-md bg-green-100 text-green-700 text-xs font-bold border border-green-200">พร้อมโอน</span>
                                    <span className="px-2 py-1 rounded-md bg-blue-100 text-blue-700 text-xs font-bold border border-blue-200">ลูกค้าเก่า</span>
                                    <button className="px-2 py-1 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-500 text-xs border border-dashed border-gray-300 hover:bg-gray-200">+ ติดป้ายระบุ</button>
                                </div>
                            </div>

                            <div>
                                <h3 className="font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                                    <CreditCard className="w-4 h-4" /> สร้างรายการ
                                </h3>
                                <button
                                    onClick={handleCreateOrder}
                                    className="w-full bg-violet-600 hover:bg-violet-700 text-white rounded-xl py-3 font-bold shadow-lg shadow-violet-500/20 active:scale-95 transition-all flex items-center justify-center gap-2"
                                >
                                    <Plus className="w-5 h-5" /> สร้างใบสั่งซื้อ / ข้อเสนอ
                                </button>
                                <p className="text-xs text-gray-400 mt-2 text-center">ส่งใบเสนอราคาให้ลูกค้ากดชำระเงินได้ทันที</p>
                            </div>

                            <div>
                                <h3 className="font-bold text-gray-900 dark:text-white mb-3">ข้อความตอบกลับ (Canned)</h3>
                                <div className="space-y-2">
                                    {[
                                        { title: 'เลขบัญชี', text: 'ธนาคารกสิกรไทย 123-4-56789-0 ชื่อบัญชี บจก. ใจกด' },
                                        { title: 'ขอที่อยู่จัดส่ง', text: 'รบกวนขอชื่อ ที่อยู่ และเบอร์โทรศัพท์สำหรับจัดส่งด้วยครับ' },
                                        { title: 'แจ้งเลขพัสดุ', text: 'จัดส่งเรียบร้อยครับ เลขพัสดุคือ...' }
                                    ].map((canned, i) => (
                                        <button
                                            key={i}
                                            onClick={() => handleCannedReply(canned.text)}
                                            className="w-full text-left p-3 rounded-xl bg-gray-50 dark:bg-gray-900 hover:bg-violet-50 dark:hover:bg-violet-900/10 border border-gray-200 dark:border-gray-800 transition-colors group"
                                        >
                                            <div className="font-bold text-sm text-gray-700 dark:text-gray-300 group-hover:text-violet-600">{canned.title}</div>
                                            <div className="text-xs text-gray-500 truncate">{canned.text}</div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {rightTab === 'safety' && (
                        <div className="space-y-6">
                            <div className="bg-red-50 dark:bg-red-900/10 rounded-xl p-4 border border-red-100 dark:border-red-900/30">
                                <h4 className="text-red-600 dark:text-red-400 font-bold text-sm flex items-center gap-2 mb-2">
                                    <AlertTriangle className="w-4 h-4" />
                                    Risk Score: Low
                                </h4>
                                <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                                    <div className="bg-green-500 h-2 rounded-full w-[10%]"></div>
                                </div>
                                <p className="text-xs text-red-600/80 dark:text-red-400/80 leading-relaxed">
                                    ผู้ใช้นี้มีความน่าเชื่อถือสูง แต่โปรดระวังหากมีการชวนคุยนอกแพลตฟอร์ม
                                </p>
                            </div>

                            <div>
                                <h3 className="font-bold text-gray-900 dark:text-white mb-3">คำแนะนำความปลอดภัย</h3>
                                <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
                                    <li className="flex gap-2">
                                        <ShieldCheck className="w-5 h-5 text-green-500 shrink-0" />
                                        <span>ห้ามโอนเงินเข้าบัญชีบุคคลธรรมดาโดยตรง</span>
                                    </li>
                                    <li className="flex gap-2">
                                        <ShieldCheck className="w-5 h-5 text-green-500 shrink-0" />
                                        <span>ตรวจสอบสินค้าให้แน่ใจก่อนกด "ยอมรับสินค้า"</span>
                                    </li>
                                    <li className="flex gap-2">
                                        <ShieldCheck className="w-5 h-5 text-green-500 shrink-0" />
                                        <span>นัดรับในที่สาธารณะเท่านั้น</span>
                                    </li>
                                </ul>
                            </div>

                            <button className="w-full py-2.5 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 font-medium transition-colors">
                                รายงานผู้ใช้ / ระงับการติดต่อ
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
