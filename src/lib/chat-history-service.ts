/**
 * Chat History Service
 * Manages AI Assistant conversation history in Firestore
 */

import {
    collection,
    doc,
    addDoc,
    updateDoc,
    getDocs,
    query,
    where,
    orderBy,
    limit,
    serverTimestamp,
    Timestamp,
    deleteDoc
} from 'firebase/firestore'
import { db } from '@/lib/firebase'

// ==================== Types ====================
export interface ChatSession {
    id: string
    sellerId: string
    title: string
    createdAt: Date
    updatedAt: Date
    messageCount: number
    lastMessage: string
}

export interface ChatMessageRecord {
    id: string
    sessionId: string
    sellerId: string
    role: 'user' | 'assistant'
    content: string
    timestamp: Date
    metadata?: {
        actionsTaken?: string[]
        suggestionsShown?: string[]
        alertsShown?: string[]
    }
}

// ==================== Collection References ====================
const CHAT_SESSIONS_COLLECTION = 'ai_chat_sessions'
const CHAT_MESSAGES_COLLECTION = 'ai_chat_messages'

// ==================== Session Management ====================

/**
 * Create a new chat session
 */
export async function createChatSession(sellerId: string): Promise<string> {
    const sessionData = {
        sellerId,
        title: 'New Conversation',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        messageCount: 0,
        lastMessage: ''
    }

    const docRef = await addDoc(collection(db, CHAT_SESSIONS_COLLECTION), sessionData)
    return docRef.id
}

/**
 * Get recent chat sessions for a seller
 */
export async function getRecentSessions(
    sellerId: string,
    maxSessions: number = 10
): Promise<ChatSession[]> {
    try {
        const sessionsQuery = query(
            collection(db, CHAT_SESSIONS_COLLECTION),
            where('sellerId', '==', sellerId),
            orderBy('updatedAt', 'desc'),
            limit(maxSessions)
        )

        const snapshot = await getDocs(sessionsQuery)

        return snapshot.docs.map(doc => ({
            id: doc.id,
            sellerId: doc.data().sellerId,
            title: doc.data().title,
            createdAt: doc.data().createdAt?.toDate() || new Date(),
            updatedAt: doc.data().updatedAt?.toDate() || new Date(),
            messageCount: doc.data().messageCount || 0,
            lastMessage: doc.data().lastMessage || ''
        }))
    } catch (error) {
        console.error('Error fetching chat sessions:', error)
        return []
    }
}

/**
 * Update session metadata
 */
export async function updateSessionMetadata(
    sessionId: string,
    lastMessage: string,
    title?: string
): Promise<void> {
    try {
        const sessionRef = doc(db, CHAT_SESSIONS_COLLECTION, sessionId)

        const updateData: any = {
            updatedAt: serverTimestamp(),
            lastMessage: lastMessage.substring(0, 100) // Truncate for preview
        }

        if (title) {
            updateData.title = title
        }

        await updateDoc(sessionRef, updateData)
    } catch (error) {
        console.error('Error updating session:', error)
    }
}

/**
 * Delete a chat session and all its messages
 */
export async function deleteChatSession(sessionId: string): Promise<void> {
    try {
        // Delete all messages in the session
        const messagesQuery = query(
            collection(db, CHAT_MESSAGES_COLLECTION),
            where('sessionId', '==', sessionId)
        )
        const messagesSnapshot = await getDocs(messagesQuery)

        const deletePromises = messagesSnapshot.docs.map(doc => deleteDoc(doc.ref))
        await Promise.all(deletePromises)

        // Delete the session
        await deleteDoc(doc(db, CHAT_SESSIONS_COLLECTION, sessionId))
    } catch (error) {
        console.error('Error deleting session:', error)
        throw error
    }
}

// ==================== Message Management ====================

/**
 * Save a chat message
 */
export async function saveChatMessage(
    sessionId: string,
    sellerId: string,
    role: 'user' | 'assistant',
    content: string,
    metadata?: ChatMessageRecord['metadata']
): Promise<string> {
    try {
        const messageData = {
            sessionId,
            sellerId,
            role,
            content,
            timestamp: serverTimestamp(),
            metadata: metadata || {}
        }

        const docRef = await addDoc(collection(db, CHAT_MESSAGES_COLLECTION), messageData)

        // Update session metadata
        const sessionRef = doc(db, CHAT_SESSIONS_COLLECTION, sessionId)
        await updateDoc(sessionRef, {
            updatedAt: serverTimestamp(),
            messageCount: (await getSessionMessageCount(sessionId)) + 1,
            lastMessage: content.substring(0, 100)
        })

        return docRef.id
    } catch (error) {
        console.error('Error saving message:', error)
        throw error
    }
}

/**
 * Get messages for a session
 */
export async function getSessionMessages(
    sessionId: string,
    maxMessages: number = 50
): Promise<ChatMessageRecord[]> {
    try {
        const messagesQuery = query(
            collection(db, CHAT_MESSAGES_COLLECTION),
            where('sessionId', '==', sessionId),
            orderBy('timestamp', 'asc'),
            limit(maxMessages)
        )

        const snapshot = await getDocs(messagesQuery)

        return snapshot.docs.map(doc => ({
            id: doc.id,
            sessionId: doc.data().sessionId,
            sellerId: doc.data().sellerId,
            role: doc.data().role,
            content: doc.data().content,
            timestamp: doc.data().timestamp?.toDate() || new Date(),
            metadata: doc.data().metadata
        }))
    } catch (error) {
        console.error('Error fetching messages:', error)
        return []
    }
}

/**
 * Get message count for a session
 */
async function getSessionMessageCount(sessionId: string): Promise<number> {
    try {
        const messagesQuery = query(
            collection(db, CHAT_MESSAGES_COLLECTION),
            where('sessionId', '==', sessionId)
        )
        const snapshot = await getDocs(messagesQuery)
        return snapshot.size
    } catch (error) {
        return 0
    }
}

/**
 * Get recent messages across all sessions for context
 */
export async function getRecentMessagesForContext(
    sellerId: string,
    maxMessages: number = 20
): Promise<ChatMessageRecord[]> {
    try {
        const messagesQuery = query(
            collection(db, CHAT_MESSAGES_COLLECTION),
            where('sellerId', '==', sellerId),
            orderBy('timestamp', 'desc'),
            limit(maxMessages)
        )

        const snapshot = await getDocs(messagesQuery)

        // Reverse to get chronological order
        return snapshot.docs.map(doc => ({
            id: doc.id,
            sessionId: doc.data().sessionId,
            sellerId: doc.data().sellerId,
            role: doc.data().role,
            content: doc.data().content,
            timestamp: doc.data().timestamp?.toDate() || new Date(),
            metadata: doc.data().metadata
        })).reverse()
    } catch (error) {
        console.error('Error fetching recent messages:', error)
        return []
    }
}

// ==================== Analytics ====================

/**
 * Get chat statistics for a seller
 */
export async function getChatStatistics(sellerId: string): Promise<{
    totalSessions: number
    totalMessages: number
    averageMessagesPerSession: number
}> {
    try {
        // Count sessions
        const sessionsQuery = query(
            collection(db, CHAT_SESSIONS_COLLECTION),
            where('sellerId', '==', sellerId)
        )
        const sessionsSnapshot = await getDocs(sessionsQuery)
        const totalSessions = sessionsSnapshot.size

        // Count messages
        const messagesQuery = query(
            collection(db, CHAT_MESSAGES_COLLECTION),
            where('sellerId', '==', sellerId)
        )
        const messagesSnapshot = await getDocs(messagesQuery)
        const totalMessages = messagesSnapshot.size

        return {
            totalSessions,
            totalMessages,
            averageMessagesPerSession: totalSessions > 0
                ? Math.round(totalMessages / totalSessions * 10) / 10
                : 0
        }
    } catch (error) {
        console.error('Error fetching chat statistics:', error)
        return {
            totalSessions: 0,
            totalMessages: 0,
            averageMessagesPerSession: 0
        }
    }
}

// ==================== Auto-generate Session Title ====================

/**
 * Generate a title from the first user message
 */
export function generateSessionTitle(firstUserMessage: string): string {
    // Clean and truncate the message
    const cleaned = firstUserMessage
        .replace(/[^\u0E00-\u0E7Fa-zA-Z0-9\s]/g, '') // Remove special chars except Thai
        .trim()
        .substring(0, 40)

    return cleaned.length > 0 ? cleaned : 'New Conversation'
}
