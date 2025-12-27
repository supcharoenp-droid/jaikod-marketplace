'use client'

/**
 * CHAT CONTEXT
 * 
 * Provides real-time chat state across the app
 */

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import {
    subscribeToConversations,
    subscribeToMessages,
    sendMessage as sendChatMessage,
    getOrCreateConversation,
    markConversationAsRead,
    getTotalUnreadCount,
    Conversation,
    ChatMessage,
    ChatUser
} from '@/lib/firebase-chat'

interface ChatContextType {
    conversations: Conversation[]
    currentConversation: Conversation | null
    messages: ChatMessage[]
    unreadTotal: number
    loading: boolean

    // Actions
    selectConversation: (conversationId: string) => void
    sendMessage: (content: string, type?: ChatMessage['type'], extras?: any) => Promise<void>
    startConversation: (
        otherUser: ChatUser,
        listingId?: string,
        listingTitle?: string,
        listingImage?: string
    ) => Promise<string>
    markAsRead: () => Promise<void>
    closeChat: () => void
}

const ChatContext = createContext<ChatContextType | undefined>(undefined)

export function ChatProvider({ children }: { children: ReactNode }) {
    const { user } = useAuth()
    const [conversations, setConversations] = useState<Conversation[]>([])
    const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null)
    const [messages, setMessages] = useState<ChatMessage[]>([])
    const [unreadTotal, setUnreadTotal] = useState(0)
    const [loading, setLoading] = useState(true)

    // Subscribe to conversations
    useEffect(() => {
        if (!user) {
            setConversations([])
            setCurrentConversation(null)
            setMessages([])
            setLoading(false)
            return
        }

        setLoading(true)
        const unsubscribe = subscribeToConversations(user.uid, (newConversations) => {
            setConversations(newConversations)
            setLoading(false)

            // Calculate total unread
            const total = newConversations.reduce(
                (sum, conv) => sum + (conv.unreadCount[user.uid] || 0),
                0
            )
            setUnreadTotal(total)
        })

        return () => unsubscribe()
    }, [user])

    // Subscribe to messages when conversation is selected
    useEffect(() => {
        if (!currentConversation) {
            setMessages([])
            return
        }

        const unsubscribe = subscribeToMessages(currentConversation.id, (newMessages) => {
            setMessages(newMessages)
        })

        return () => unsubscribe()
    }, [currentConversation])

    // Select a conversation
    const selectConversation = useCallback((conversationId: string) => {
        const conversation = conversations.find(c => c.id === conversationId)
        if (conversation) {
            setCurrentConversation(conversation)
        }
    }, [conversations])

    // Send message
    const sendMessage = useCallback(async (
        content: string,
        type: ChatMessage['type'] = 'text',
        extras?: { imageUrl?: string; offerAmount?: number }
    ) => {
        if (!user || !currentConversation) return

        await sendChatMessage(
            currentConversation.id,
            user.uid,
            content,
            type,
            extras
        )
    }, [user, currentConversation])

    // Start new conversation
    const startConversation = useCallback(async (
        otherUser: ChatUser,
        listingId?: string,
        listingTitle?: string,
        listingImage?: string
    ): Promise<string> => {
        if (!user) throw new Error('User not logged in')

        const currentUserDetails: ChatUser = {
            id: user.uid,
            name: user.displayName || 'Anonymous',
            avatar: user.photoURL || undefined
        }

        const conversationId = await getOrCreateConversation({
            participantIds: [user.uid, otherUser.id].sort(),
            participantDetails: {
                [user.uid]: currentUserDetails,
                [otherUser.id]: otherUser
            },
            listingId,
            listingTitle,
            listingImage
        })

        // Select the new/existing conversation
        const conversation = conversations.find(c => c.id === conversationId)
        if (conversation) {
            setCurrentConversation(conversation)
        }

        return conversationId
    }, [user, conversations])

    // Mark current conversation as read
    const markAsRead = useCallback(async () => {
        if (!user || !currentConversation) return
        await markConversationAsRead(currentConversation.id, user.uid)
    }, [user, currentConversation])

    // Close chat
    const closeChat = useCallback(() => {
        setCurrentConversation(null)
        setMessages([])
    }, [])

    return (
        <ChatContext.Provider value={{
            conversations,
            currentConversation,
            messages,
            unreadTotal,
            loading,
            selectConversation,
            sendMessage,
            startConversation,
            markAsRead,
            closeChat
        }}>
            {children}
        </ChatContext.Provider>
    )
}

export function useChat() {
    const context = useContext(ChatContext)
    if (context === undefined) {
        throw new Error('useChat must be used within a ChatProvider')
    }
    return context
}
