'use client'

import dynamic from 'next/dynamic'
import { Loader2 } from 'lucide-react'

// Fallback loading component
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

// Dynamic import ChatPageContent to avoid SSR hydration issues with Firebase Auth
const ChatPageContent = dynamic(
    () => import('@/components/chat/ChatPageContent'),
    {
        ssr: false,
        loading: () => <ChatLoading />
    }
)

export default function ChatPage() {
    return <ChatPageContent />
}
