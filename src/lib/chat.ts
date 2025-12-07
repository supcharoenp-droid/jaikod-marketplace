/**
 * JaiKod Chat Service
 * 
 * Real-time messaging system with Firebase Firestore
 */

import {
    collection,
    doc,
    addDoc,
    updateDoc,
    getDoc,
    getDocs,
    query,
    where,
    orderBy,
    limit,
    serverTimestamp,
    Timestamp,
    onSnapshot,
    Unsubscribe
} from 'firebase/firestore'
import { db } from './firebase'

const CONVERSATIONS_COLLECTION = 'conversations'
const MESSAGES_COLLECTION = 'messages'

// ==========================================
// TYPES
// ==========================================

export interface ChatMessage {
    id: string
    conversationId: string
    senderId: string
    senderName: string
    text: string
    imageUrl?: string
    productId?: string
    productTitle?: string
    productImage?: string
    isRead: boolean
    createdAt: Date
}

export interface Conversation {
    id: string
    participants: string[]
    participantNames: { [key: string]: string }
    participantAvatars: { [key: string]: string }
    lastMessage: string
    lastMessageAt: Date
    lastSenderId: string
    productId?: string
    productTitle?: string
    productImage?: string
    unreadCount: { [key: string]: number }
}

export interface SendMessageInput {
    conversationId?: string  // If exists, use this conversation
    recipientId: string
    recipientName: string
    text: string
    productId?: string
    productTitle?: string
    productImage?: string
}

// ==========================================
// CONVERSATION FUNCTIONS
// ==========================================

/**
 * Get or create a conversation between two users
 */
export async function getOrCreateConversation(
    userId: string,
    userName: string,
    recipientId: string,
    recipientName: string,
    productId?: string,
    productTitle?: string,
    productImage?: string
): Promise<string> {
    try {
        // Check if conversation exists
        const q = query(
            collection(db, CONVERSATIONS_COLLECTION),
            where('participants', 'array-contains', userId)
        )
        const snapshot = await getDocs(q)

        // Find conversation with both participants
        const existingConv = snapshot.docs.find(doc => {
            const data = doc.data()
            return data.participants.includes(recipientId)
        })

        if (existingConv) {
            // Update product info if different
            if (productId) {
                await updateDoc(doc(db, CONVERSATIONS_COLLECTION, existingConv.id), {
                    productId,
                    productTitle,
                    productImage
                })
            }
            return existingConv.id
        }

        // Create new conversation
        const convRef = await addDoc(collection(db, CONVERSATIONS_COLLECTION), {
            participants: [userId, recipientId],
            participantNames: {
                [userId]: userName,
                [recipientId]: recipientName
            },
            participantAvatars: {
                [userId]: '',
                [recipientId]: ''
            },
            lastMessage: '',
            lastMessageAt: serverTimestamp(),
            lastSenderId: '',
            productId: productId || null,
            productTitle: productTitle || null,
            productImage: productImage || null,
            unreadCount: {
                [userId]: 0,
                [recipientId]: 0
            },
            createdAt: serverTimestamp()
        })

        return convRef.id
    } catch (error) {
        console.error('Error getting/creating conversation:', error)
        throw error
    }
}

/**
 * Get all conversations for a user
 */
export async function getUserConversations(userId: string): Promise<Conversation[]> {
    try {
        const q = query(
            collection(db, CONVERSATIONS_COLLECTION),
            where('participants', 'array-contains', userId),
            orderBy('lastMessageAt', 'desc')
        )
        const snapshot = await getDocs(q)

        return snapshot.docs.map(docSnap => {
            const data = docSnap.data()
            return {
                id: docSnap.id,
                participants: data.participants,
                participantNames: data.participantNames,
                participantAvatars: data.participantAvatars || {},
                lastMessage: data.lastMessage,
                lastMessageAt: data.lastMessageAt?.toDate?.() || new Date(),
                lastSenderId: data.lastSenderId,
                productId: data.productId,
                productTitle: data.productTitle,
                productImage: data.productImage,
                unreadCount: data.unreadCount || {}
            }
        })
    } catch (error) {
        console.error('Error getting conversations:', error)
        return []
    }
}

/**
 * Listen to conversations in real-time
 */
export function subscribeToConversations(
    userId: string,
    callback: (conversations: Conversation[]) => void
): Unsubscribe {
    const q = query(
        collection(db, CONVERSATIONS_COLLECTION),
        where('participants', 'array-contains', userId),
        orderBy('lastMessageAt', 'desc')
    )

    return onSnapshot(q, (snapshot) => {
        const conversations = snapshot.docs.map(docSnap => {
            const data = docSnap.data()
            return {
                id: docSnap.id,
                participants: data.participants,
                participantNames: data.participantNames,
                participantAvatars: data.participantAvatars || {},
                lastMessage: data.lastMessage,
                lastMessageAt: data.lastMessageAt?.toDate?.() || new Date(),
                lastSenderId: data.lastSenderId,
                productId: data.productId,
                productTitle: data.productTitle,
                productImage: data.productImage,
                unreadCount: data.unreadCount || {}
            }
        })
        callback(conversations)
    })
}

// ==========================================
// MESSAGE FUNCTIONS
// ==========================================

/**
 * Send a message
 */
export async function sendMessage(
    senderId: string,
    senderName: string,
    input: SendMessageInput
): Promise<string> {
    try {
        // Get or create conversation
        const conversationId = input.conversationId || await getOrCreateConversation(
            senderId,
            senderName,
            input.recipientId,
            input.recipientName,
            input.productId,
            input.productTitle,
            input.productImage
        )

        // Create message
        const messageRef = await addDoc(collection(db, MESSAGES_COLLECTION), {
            conversationId,
            senderId,
            senderName,
            text: input.text,
            productId: input.productId || null,
            productTitle: input.productTitle || null,
            productImage: input.productImage || null,
            isRead: false,
            createdAt: serverTimestamp()
        })

        // Update conversation with last message
        const convRef = doc(db, CONVERSATIONS_COLLECTION, conversationId)
        const convSnap = await getDoc(convRef)

        if (convSnap.exists()) {
            const currentUnread = convSnap.data().unreadCount || {}
            // Increment unread for recipient
            const updatedUnread = { ...currentUnread }
            for (const participantId of convSnap.data().participants) {
                if (participantId !== senderId) {
                    updatedUnread[participantId] = (updatedUnread[participantId] || 0) + 1
                }
            }

            await updateDoc(convRef, {
                lastMessage: input.text.substring(0, 100),
                lastMessageAt: serverTimestamp(),
                lastSenderId: senderId,
                unreadCount: updatedUnread
            })
        }

        return messageRef.id
    } catch (error) {
        console.error('Error sending message:', error)
        throw error
    }
}

/**
 * Get messages for a conversation
 */
export async function getMessages(conversationId: string, limitCount: number = 50): Promise<ChatMessage[]> {
    try {
        const q = query(
            collection(db, MESSAGES_COLLECTION),
            where('conversationId', '==', conversationId),
            orderBy('createdAt', 'asc'),
            limit(limitCount)
        )
        const snapshot = await getDocs(q)

        return snapshot.docs.map(docSnap => {
            const data = docSnap.data()
            return {
                id: docSnap.id,
                conversationId: data.conversationId,
                senderId: data.senderId,
                senderName: data.senderName,
                text: data.text,
                imageUrl: data.imageUrl,
                productId: data.productId,
                productTitle: data.productTitle,
                productImage: data.productImage,
                isRead: data.isRead,
                createdAt: data.createdAt?.toDate?.() || new Date()
            }
        })
    } catch (error) {
        console.error('Error getting messages:', error)
        return []
    }
}

/**
 * Listen to messages in real-time
 */
export function subscribeToMessages(
    conversationId: string,
    callback: (messages: ChatMessage[]) => void
): Unsubscribe {
    const q = query(
        collection(db, MESSAGES_COLLECTION),
        where('conversationId', '==', conversationId),
        orderBy('createdAt', 'asc')
    )

    return onSnapshot(q, (snapshot) => {
        const messages = snapshot.docs.map(docSnap => {
            const data = docSnap.data()
            return {
                id: docSnap.id,
                conversationId: data.conversationId,
                senderId: data.senderId,
                senderName: data.senderName,
                text: data.text,
                imageUrl: data.imageUrl,
                productId: data.productId,
                productTitle: data.productTitle,
                productImage: data.productImage,
                isRead: data.isRead,
                createdAt: data.createdAt?.toDate?.() || new Date()
            }
        })
        callback(messages)
    })
}

/**
 * Mark messages as read
 */
export async function markMessagesAsRead(conversationId: string, userId: string): Promise<void> {
    try {
        // Update conversation unread count
        const convRef = doc(db, CONVERSATIONS_COLLECTION, conversationId)
        const convSnap = await getDoc(convRef)

        if (convSnap.exists()) {
            const currentUnread = convSnap.data().unreadCount || {}
            await updateDoc(convRef, {
                unreadCount: {
                    ...currentUnread,
                    [userId]: 0
                }
            })
        }

        // Mark all messages as read (optional - for message-level tracking)
        const q = query(
            collection(db, MESSAGES_COLLECTION),
            where('conversationId', '==', conversationId),
            where('isRead', '==', false)
        )
        const snapshot = await getDocs(q)

        for (const docSnap of snapshot.docs) {
            const data = docSnap.data()
            if (data.senderId !== userId) {
                await updateDoc(doc(db, MESSAGES_COLLECTION, docSnap.id), {
                    isRead: true
                })
            }
        }
    } catch (error) {
        console.error('Error marking messages as read:', error)
    }
}

/**
 * Get total unread count for a user
 */
export async function getTotalUnreadCount(userId: string): Promise<number> {
    try {
        const conversations = await getUserConversations(userId)
        return conversations.reduce((total, conv) => {
            return total + (conv.unreadCount[userId] || 0)
        }, 0)
    } catch (error) {
        console.error('Error getting unread count:', error)
        return 0
    }
}
