'use client'

import React, { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter, useSearchParams } from 'next/navigation'
import { MessageCircle, Loader2 } from 'lucide-react'
import {
    getOrCreateChatRoom,
    subscribeToUserChatRooms,
    type ChatRoom
} from '@/lib/chat'

import ChatSidebar from './ChatSidebar'
import ChatWindow from './ChatWindow'

// Dynamic import Header to avoid hydration mismatch
const Header = dynamic(() => import('@/components/layout/Header'), { ssr: false })

// Loading component
function ChatLoading() {
    return (
        <div className="flex items-center justify-center h-screen bg-gray-50 dark:bg-black">
            <div className="text-center">
                <Loader2 className="w-10 h-10 animate-spin text-purple-600 mx-auto mb-4" />
                <p className="text-gray-500">กำลังโหลดแชท...</p>
            </div>
        </div>
    )
}

export default function ChatPageContent() {
    const { user, loading: authLoading } = useAuth()
    const router = useRouter()
    const searchParams = useSearchParams()

    const [rooms, setRooms] = useState<ChatRoom[]>([])
    const [selectedRoom, setSelectedRoom] = useState<ChatRoom | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [pendingRoomId, setPendingRoomId] = useState<string | null>(null)

    // Auto-create room from URL params
    useEffect(() => {
        const autoCreateRoom = async () => {
            if (!user) return

            const sellerId = searchParams.get('seller')
            const listingId = searchParams.get('listing')
            const title = searchParams.get('title')
            const image = searchParams.get('image')
            const price = searchParams.get('price')

            console.log('🔍 ChatPageContent: URL params:', { sellerId, listingId, title })

            if (sellerId && listingId && title) {
                try {
                    console.log('📞 ChatPageContent: Creating/getting room...')
                    const roomId = await getOrCreateChatRoom(
                        user.uid,
                        sellerId,
                        listingId,
                        title,
                        image || undefined,
                        price ? parseFloat(price) : undefined
                    )
                    console.log('✅ ChatPageContent: Room created/found:', roomId)
                    setPendingRoomId(roomId)
                    router.replace('/chat', { scroll: false })
                } catch (error) {
                    console.error('❌ ChatPageContent: Error creating room:', error)
                    alert('เกิดข้อผิดพลาดในการสร้างห้องแชท กรุณาลองอีกครั้ง')
                }
            }
        }

        if (user) {
            autoCreateRoom()
        }
    }, [user, searchParams, router])

    // Subscribe to user's rooms
    useEffect(() => {
        if (!user) {
            setIsLoading(false)
            return
        }

        const unsubscribe = subscribeToUserChatRooms(user.uid, (updatedRooms) => {
            setRooms(updatedRooms)
            setIsLoading(false)

            if (pendingRoomId) {
                const newRoom = updatedRooms.find(r => r.id === pendingRoomId)
                if (newRoom) {
                    setSelectedRoom(newRoom)
                    setPendingRoomId(null)
                }
            } else if (selectedRoom) {
                const updatedSelected = updatedRooms.find(r => r.id === selectedRoom.id)
                if (updatedSelected) {
                    setSelectedRoom(updatedSelected)
                } else {
                    setSelectedRoom(null)
                }
            }
        })

        return () => unsubscribe()
    }, [user, selectedRoom?.id, pendingRoomId])

    // Show loading state while checking auth
    if (authLoading) {
        return <ChatLoading />
    }

    if (!user) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-50 dark:bg-black">
                <div className="text-center">
                    <MessageCircle className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-600 dark:text-gray-400">กรุณาเข้าสู่ระบบเพื่อใช้งานแชท</p>
                    <button
                        onClick={() => router.push('/login')}
                        className="mt-4 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-bold shadow-lg shadow-purple-500/30 transition-all"
                    >
                        เข้าสู่ระบบ
                    </button>
                </div>
            </div>
        )
    }

    return (
        <>
            <Header />
            <div className="flex h-[calc(100dvh-64px)] mt-16 bg-gray-50 dark:bg-black overflow-hidden flex-col">
                <div className="flex flex-1 overflow-hidden">
                    {/* Sidebar */}
                    <ChatSidebar
                        user={user}
                        rooms={rooms}
                        selectedRoom={selectedRoom}
                        onSelectRoom={setSelectedRoom}
                        isLoading={isLoading}
                        className={`${selectedRoom ? 'hidden lg:flex' : 'flex'} w-full lg:w-80 xl:w-96 z-20`}
                    />

                    {/* Chat Window */}
                    {selectedRoom ? (
                        <div className="flex-1 flex min-w-0 bg-slate-50 dark:bg-black/50 relative z-10 h-full">
                            <ChatWindow
                                user={user}
                                room={selectedRoom}
                                onBack={() => setSelectedRoom(null)}
                                onDeleteSuccess={() => setSelectedRoom(null)}
                            />
                        </div>
                    ) : (
                        // Empty State for Desktop
                        <div className="hidden lg:flex flex-1 items-center justify-center bg-gray-50 dark:bg-black/50 text-center p-8">
                            <div className="max-w-md">
                                <div className="w-24 h-24 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center mx-auto mb-6 animate-float">
                                    <MessageCircle className="w-12 h-12 text-purple-600 dark:text-purple-400" />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">JaiKod Chat</h2>
                                <p className="text-gray-500 dark:text-gray-400">
                                    เลือกบทสนทนาจากทางซ้ายมือ หรือไปที่หน้าสินค้าแล้วกด "แชทเลย" เพื่อเริ่มการสนทนาใหม่
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}
