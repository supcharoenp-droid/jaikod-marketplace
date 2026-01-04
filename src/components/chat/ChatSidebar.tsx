'use client'

import React, { useState } from 'react'
import { MessageCircle, Search, ShoppingBag, Store, Loader2 } from 'lucide-react'
import ChatListItem from './ChatListItem'
import { type ChatRoom } from '@/lib/chat'
import { User } from 'firebase/auth'

interface ChatSidebarProps {
    user: User | null
    rooms: ChatRoom[]
    selectedRoom: ChatRoom | null
    onSelectRoom: (room: ChatRoom) => void
    isLoading: boolean
    className?: string
}

export default function ChatSidebar({
    user,
    rooms,
    selectedRoom,
    onSelectRoom,
    isLoading,
    className = ''
}: ChatSidebarProps) {
    const [activeTab, setActiveTab] = useState<'all' | 'buying' | 'selling'>('all')
    const [searchTerm, setSearchTerm] = useState('')

    // Filter Logic
    const filteredRooms = rooms.filter(room => {
        if (!user) return false

        // Tab Filter
        if (activeTab === 'buying' && room.buyer_id !== user.uid) return false
        if (activeTab === 'selling' && room.seller_id !== user.uid) return false

        // Search Filter
        if (searchTerm) {
            const term = searchTerm.toLowerCase()
            return room.listing_title.toLowerCase().includes(term)
            // Note: Partner name search is harder as it's fetched asynchronously in ListItem
        }

        return true
    })

    return (
        <div className={`flex flex-col h-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 ${className}`}>
            {/* Header & Tabs */}
            <div className="flex-none z-10 bg-inherit border-b border-gray-200 dark:border-gray-800">
                <div className="p-4 pb-2">
                    <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-3">แชท</h1>

                    {/* Search Bar */}
                    <div className="relative mb-2">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            id="chat-room-search"
                            name="chat-room-search"
                            type="text"
                            placeholder="ค้นหาตามชื่อสินค้า..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-xl text-sm outline-none focus:ring-2 ring-purple-500/20 transition-all text-gray-900 dark:text-white"
                        />
                    </div>
                </div>

                {/* Filter Tabs */}
                <div className="flex px-4 border-b border-gray-100 dark:border-gray-800 overflow-x-auto no-scrollbar">
                    <button
                        onClick={() => setActiveTab('all')}
                        className={`py-3 text-sm font-medium mr-6 transition-all relative whitespace-nowrap ${activeTab === 'all'
                            ? 'text-gray-900 dark:text-white border-b-2 border-gray-900 dark:border-white'
                            : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                            }`}
                    >
                        ทั้งหมด
                    </button>
                    <button
                        onClick={() => setActiveTab('selling')}
                        className={`py-3 text-sm font-medium mr-6 transition-all relative whitespace-nowrap ${activeTab === 'selling'
                            ? 'text-gray-900 dark:text-white border-b-2 border-gray-900 dark:border-white'
                            : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                            }`}
                    >
                        คุยกับผู้ซื้อ
                    </button>
                    <button
                        onClick={() => setActiveTab('buying')}
                        className={`py-3 text-sm font-medium transition-all relative whitespace-nowrap ${activeTab === 'buying'
                            ? 'text-gray-900 dark:text-white border-b-2 border-gray-900 dark:border-white'
                            : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                            }`}
                    >
                        คุยกับผู้ขาย
                    </button>
                </div>
            </div>

            {/* Rooms List */}
            <div className="flex-1 overflow-y-auto min-h-0 custom-scrollbar">
                {isLoading ? (
                    <div className="flex items-center justify-center p-8">
                        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
                    </div>
                ) : filteredRooms.length === 0 ? (
                    <div className="p-8 text-center text-gray-400">
                        {activeTab === 'all' && !searchTerm ? (
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
                                <p className="text-sm">
                                    {searchTerm
                                        ? `ไม่พบแชทที่เกี่ยวกับ "${searchTerm}"`
                                        : `ยังไม่มีการสนทนากับ${activeTab === 'buying' ? 'ผู้ขาย' : 'ผู้ซื้อ'}`
                                    }
                                </p>
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
                            onClick={() => onSelectRoom(room)}
                        />
                    ))
                )}
            </div>
        </div>
    )
}
