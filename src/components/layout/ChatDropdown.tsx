'use client';

import { useState, useEffect, useRef } from 'react'
import { MessageCircle, ShoppingBag, Store, ImageIcon } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { ChatRoom, subscribeToUserChatRooms } from '@/lib/chat'
import { useAuth } from '@/contexts/AuthContext'
import { useLanguage } from '@/contexts/LanguageContext'

interface ChatDropdownProps {
    className?: string
}

export default function ChatDropdown({ className }: ChatDropdownProps) {
    const { user } = useAuth()
    const { t } = useLanguage()
    const [rooms, setRooms] = useState<ChatRoom[]>([])
    const [isOpen, setIsOpen] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null)
    const router = useRouter()

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    // Subscribe to chat rooms
    useEffect(() => {
        if (!user) return
        const unsubscribe = subscribeToUserChatRooms(user.uid, (updatedRooms) => {
            // Take only latest 5 rooms
            setRooms(updatedRooms.slice(0, 5))
        })
        return () => unsubscribe()
    }, [user])

    // Calculate total unread count
    const totalUnread = rooms.reduce((sum, room) => {
        if (!user) return sum
        const unread = room.buyer_id === user.uid ? (room.unread_count_buyer || 0) : (room.unread_count_seller || 0)
        return sum + unread
    }, 0)

    const handleRoomClick = (room: ChatRoom) => {
        setIsOpen(false)
        router.push(`/chat?room=${room.id}`)
    }

    return (
        <div className={`relative ${className}`} ref={dropdownRef}>
            {/* Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 text-gray-600 hover:text-purple-600 dark:text-gray-300 dark:hover:text-purple-400 transition-colors flex items-center gap-1.5 font-medium group"
            >
                <div className="relative">
                    <MessageCircle className={`w-6 h-6 ${isOpen ? 'text-purple-600 dark:text-purple-400' : ''}`} />
                    {totalUnread > 0 && (
                        <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-red-500 text-white text-[10px] flex items-center justify-center rounded-full animate-pulse border-2 border-white dark:border-gray-900">
                            {totalUnread > 9 ? '9+' : totalUnread}
                        </span>
                    )}
                </div>
                <span className={`hidden md:inline ${isOpen ? 'text-purple-600 dark:text-purple-400' : ''}`}>{t('common.chat')}</span>
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute top-full right-0 mt-2 w-80 md:w-96 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200">
                    <div className="p-3 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800">
                        <h3 className="font-bold text-gray-900 dark:text-white text-sm">{t('common.recent_messages')}</h3>
                        <Link
                            href="/chat"
                            onClick={() => setIsOpen(false)}
                            className="text-xs text-purple-600 hover:text-purple-700 dark:text-purple-400 font-medium hover:underline"
                        >
                            {t('common.view_all_chats')}
                        </Link>
                    </div>

                    <div className="max-h-[400px] overflow-y-auto">
                        {!user ? (
                            <div className="p-8 text-center text-gray-400 text-sm">
                                {t('common.login_to_chat')}
                            </div>
                        ) : rooms.length === 0 ? (
                            <div className="p-8 text-center text-gray-400 text-sm flex flex-col items-center">
                                <MessageCircle className="w-10 h-10 mb-2 opacity-20" />
                                <p>{t('common.no_messages')}</p>
                            </div>
                        ) : (
                            rooms.map((room) => {
                                const isUnread = (room.buyer_id === user.uid ? room.unread_count_buyer : room.unread_count_seller) > 0
                                const isBuyer = room.buyer_id === user.uid

                                return (
                                    <button
                                        key={room.id}
                                        onClick={() => handleRoomClick(room)}
                                        className={`w-full p-3 flex items-start gap-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors border-b border-gray-50 dark:border-gray-700/50 last:border-0 text-left ${isUnread ? 'bg-purple-50/30' : ''
                                            }`}
                                    >
                                        {/* Product Image */}
                                        <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-700 flex-shrink-0 border border-gray-100 dark:border-gray-600">
                                            {room.listing_image ? (
                                                <Image
                                                    src={room.listing_image}
                                                    alt={room.listing_title}
                                                    width={40}
                                                    height={40}
                                                    className="object-cover w-full h-full"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                    <ImageIcon className="w-4 h-4" />
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-start mb-0.5">
                                                <p className={`text-sm truncate pr-2 ${isUnread ? 'font-bold text-gray-900 dark:text-white' : 'font-medium text-gray-700 dark:text-gray-200'}`}>
                                                    {room.listing_title}
                                                </p>
                                                <span className="text-[10px] text-gray-400 whitespace-nowrap mt-0.5">
                                                    {room.last_message_at ? new Date(room.last_message_at).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }) : ''}
                                                </span>
                                            </div>

                                            <div className="flex items-center gap-1.5 mb-0.5">
                                                <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${isBuyer
                                                    ? 'text-green-700 bg-green-100 dark:bg-green-900/30 dark:text-green-300'
                                                    : 'text-blue-700 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300'
                                                    }`}>
                                                    {isBuyer ? t('common.buyer') : t('common.seller')}
                                                </span>
                                                <p className={`text-xs truncate max-w-[180px] ${isUnread ? 'font-semibold text-gray-800 dark:text-gray-100' : 'text-gray-500 dark:text-gray-400'}`}>
                                                    {room.last_message || t('common.start_conversation')}
                                                </p>
                                            </div>
                                        </div>

                                        {isUnread && (
                                            <div className="w-2 h-2 rounded-full bg-red-500 mt-2"></div>
                                        )}
                                    </button>
                                )
                            })
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}
