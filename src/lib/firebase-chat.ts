/**
 * FIREBASE CHAT SERVICE
 * 
 * Real-time chat with Firebase Realtime Database
 */

import {
    collection,
    doc,
    addDoc,
    updateDoc,
    deleteDoc,
    getDoc,
    getDocs,
    setDoc,
    query,
    where,
    orderBy,
    limit,
    onSnapshot,
    serverTimestamp,
    Timestamp,
    Unsubscribe,
    arrayUnion
} from 'firebase/firestore'
import { db } from './firebase'

const CONVERSATIONS_COLLECTION = 'conversations'
const MESSAGES_COLLECTION = 'messages'

// ==========================================
// TYPES
// ==========================================

export interface ChatUser {
    id: string
    name: string
    avatar?: string
    isOnline?: boolean
    lastSeen?: Date
}

export interface ChatMessage {
    id: string
    conversationId: string
    senderId: string
    type: 'text' | 'image' | 'offer' | 'system'
    content: string
    imageUrl?: string
    offerAmount?: number
    offerStatus?: 'pending' | 'accepted' | 'rejected' | 'counter'
    isRead: boolean
    createdAt: Date
}

export interface Conversation {
    id: string
    participants: string[]  // User IDs
    participantDetails: { [userId: string]: ChatUser }
    listingId?: string
    listingTitle?: string
    listingImage?: string
    lastMessage?: {
        content: string
        senderId: string
        createdAt: Date
    }
    unreadCount: { [userId: string]: number }
    createdAt: Date
    updatedAt: Date
}

export interface CreateConversationData {
    participantIds: string[]
    participantDetails: { [userId: string]: ChatUser }
    listingId?: string
    listingTitle?: string
    listingImage?: string
}

// ==========================================
// CREATE CONVERSATION
// ==========================================

export async function getOrCreateConversation(
    data: CreateConversationData
): Promise<string> {
    try {
        // Check if conversation already exists between these users for this listing
        const existingId = await findExistingConversation(
            data.participantIds,
            data.listingId
        )

        if (existingId) {
            return existingId
        }

        // Sanitize participantDetails - Firestore doesn't accept undefined values
        const sanitizedParticipantDetails: { [userId: string]: any } = {}
        for (const [userId, userDetails] of Object.entries(data.participantDetails)) {
            sanitizedParticipantDetails[userId] = {
                id: userDetails.id,
                name: userDetails.name || 'Unknown',
                avatar: userDetails.avatar || null, // Replace undefined with null
                isOnline: userDetails.isOnline || false,
                lastSeen: userDetails.lastSeen || null
            }
        }

        // Create new conversation
        const conversationData = {
            participants: data.participantIds,
            participantDetails: sanitizedParticipantDetails,
            listingId: data.listingId || null,
            listingTitle: data.listingTitle || null,
            listingImage: data.listingImage || null,
            unreadCount: Object.fromEntries(data.participantIds.map(id => [id, 0])),
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        }

        const docRef = await addDoc(collection(db, CONVERSATIONS_COLLECTION), conversationData)
        return docRef.id
    } catch (error) {
        console.error('Error creating conversation:', error)
        throw error
    }
}

async function findExistingConversation(
    participantIds: string[],
    listingId?: string
): Promise<string | null> {
    try {
        // Sort participant IDs for consistent matching
        const sortedIds = [...participantIds].sort()

        let q = query(
            collection(db, CONVERSATIONS_COLLECTION),
            where('participants', '==', sortedIds)
        )

        if (listingId) {
            q = query(
                collection(db, CONVERSATIONS_COLLECTION),
                where('participants', '==', sortedIds),
                where('listingId', '==', listingId)
            )
        }

        const snapshot = await getDocs(q)
        if (!snapshot.empty) {
            return snapshot.docs[0].id
        }

        return null
    } catch (error) {
        console.error('Error finding conversation:', error)
        return null
    }
}

// ==========================================
// SEND MESSAGE
// ==========================================

export async function sendMessage(
    conversationId: string,
    senderId: string,
    content: string,
    type: ChatMessage['type'] = 'text',
    extras?: {
        imageUrl?: string
        offerAmount?: number
    }
): Promise<string> {
    try {
        const messageData = {
            conversationId,
            senderId,
            type,
            content,
            imageUrl: extras?.imageUrl || null,
            offerAmount: extras?.offerAmount || null,
            offerStatus: extras?.offerAmount ? 'pending' : null,
            isRead: false,
            createdAt: serverTimestamp()
        }

        // Add message
        const msgRef = await addDoc(
            collection(db, CONVERSATIONS_COLLECTION, conversationId, MESSAGES_COLLECTION),
            messageData
        )

        // Update conversation with last message
        const conversationRef = doc(db, CONVERSATIONS_COLLECTION, conversationId)
        const conversationSnap = await getDoc(conversationRef)

        if (conversationSnap.exists()) {
            const data = conversationSnap.data()
            const participants = data.participants as string[]

            // Increment unread count for other participants
            const newUnreadCount = { ...data.unreadCount }
            participants.forEach(pid => {
                if (pid !== senderId) {
                    newUnreadCount[pid] = (newUnreadCount[pid] || 0) + 1
                }
            })

            await updateDoc(conversationRef, {
                lastMessage: {
                    content,
                    senderId,
                    createdAt: serverTimestamp()
                },
                unreadCount: newUnreadCount,
                updatedAt: serverTimestamp()
            })
        }

        return msgRef.id
    } catch (error) {
        console.error('Error sending message:', error)
        throw error
    }
}

// ==========================================
// GET CONVERSATIONS
// ==========================================

export function subscribeToConversations(
    userId: string,
    callback: (conversations: Conversation[]) => void
): Unsubscribe {
    const q = query(
        collection(db, CONVERSATIONS_COLLECTION),
        where('participants', 'array-contains', userId),
        orderBy('updatedAt', 'desc'),
        limit(50)
    )

    return onSnapshot(q, (snapshot) => {
        const conversations = snapshot.docs.map(doc => {
            const data = doc.data()
            return {
                id: doc.id,
                ...data,
                lastMessage: data.lastMessage ? {
                    ...data.lastMessage,
                    createdAt: (data.lastMessage.createdAt as Timestamp)?.toDate() || new Date()
                } : undefined,
                createdAt: (data.createdAt as Timestamp)?.toDate() || new Date(),
                updatedAt: (data.updatedAt as Timestamp)?.toDate() || new Date()
            } as Conversation
        })
        callback(conversations)
    })
}

// ==========================================
// GET MESSAGES
// ==========================================

export function subscribeToMessages(
    conversationId: string,
    callback: (messages: ChatMessage[]) => void
): Unsubscribe {
    const q = query(
        collection(db, CONVERSATIONS_COLLECTION, conversationId, MESSAGES_COLLECTION),
        orderBy('createdAt', 'asc'),
        limit(100)
    )

    return onSnapshot(q, (snapshot) => {
        const messages = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            createdAt: (doc.data().createdAt as Timestamp)?.toDate() || new Date()
        })) as ChatMessage[]
        callback(messages)
    })
}

// ==========================================
// MARK AS READ
// ==========================================

export async function markConversationAsRead(
    conversationId: string,
    userId: string
): Promise<void> {
    try {
        // First check if user is participant
        const conversationRef = doc(db, CONVERSATIONS_COLLECTION, conversationId)
        const conversationSnap = await getDoc(conversationRef)

        if (!conversationSnap.exists()) {
            console.warn('Conversation not found:', conversationId)
            return
        }

        const data = conversationSnap.data()
        if (!data.participants?.includes(userId)) {
            console.warn('User is not a participant of this conversation')
            return
        }

        // Update unread count
        await updateDoc(conversationRef, {
            [`unreadCount.${userId}`]: 0
        })

        // Mark messages as read - simplified query
        // Get all unread messages and filter client-side
        const messagesRef = collection(db, CONVERSATIONS_COLLECTION, conversationId, MESSAGES_COLLECTION)
        const q = query(messagesRef, where('isRead', '==', false))

        const snapshot = await getDocs(q)
        const updates = snapshot.docs
            .filter(doc => doc.data().senderId !== userId) // Filter client-side
            .map(doc => updateDoc(doc.ref, { isRead: true }))

        if (updates.length > 0) {
            await Promise.all(updates)
        }
    } catch (error) {
        console.error('Error marking as read:', error)
        // Don't throw - this is not critical
    }
}

// ==========================================
// UPDATE OFFER STATUS
// ==========================================

export async function updateOfferStatus(
    conversationId: string,
    messageId: string,
    status: 'accepted' | 'rejected' | 'counter',
    counterAmount?: number
): Promise<void> {
    try {
        const messageRef = doc(
            db,
            CONVERSATIONS_COLLECTION,
            conversationId,
            MESSAGES_COLLECTION,
            messageId
        )

        await updateDoc(messageRef, {
            offerStatus: status,
            ...(counterAmount && { counterAmount })
        })

        // Add system message about offer status
        const statusMessages = {
            accepted: 'ข้อเสนอถูกยอมรับแล้ว ✅',
            rejected: 'ข้อเสนอถูกปฏิเสธ ❌',
            counter: `เสนอราคาใหม่: ฿${counterAmount?.toLocaleString()}`
        }

        await sendMessage(
            conversationId,
            'system',
            statusMessages[status],
            'system'
        )
    } catch (error) {
        console.error('Error updating offer status:', error)
        throw error
    }
}

// ==========================================
// DELETE CONVERSATION
// ==========================================

export async function deleteConversation(conversationId: string): Promise<void> {
    try {
        // Delete all messages first
        const messagesRef = collection(db, CONVERSATIONS_COLLECTION, conversationId, MESSAGES_COLLECTION)
        const snapshot = await getDocs(messagesRef)

        const deletes = snapshot.docs.map(doc => deleteDoc(doc.ref))
        await Promise.all(deletes)

        // Delete conversation
        await deleteDoc(doc(db, CONVERSATIONS_COLLECTION, conversationId))
    } catch (error) {
        console.error('Error deleting conversation:', error)
        throw error
    }
}

// ==========================================
// GET UNREAD COUNT
// ==========================================

export async function getTotalUnreadCount(userId: string): Promise<number> {
    try {
        const q = query(
            collection(db, CONVERSATIONS_COLLECTION),
            where('participants', 'array-contains', userId)
        )

        const snapshot = await getDocs(q)
        let total = 0

        snapshot.docs.forEach(doc => {
            const data = doc.data()
            total += data.unreadCount?.[userId] || 0
        })

        return total
    } catch (error) {
        console.error('Error getting unread count:', error)
        return 0
    }
}

// ==========================================
// TYPING INDICATOR
// ==========================================

export async function setTypingStatus(
    conversationId: string,
    userId: string,
    isTyping: boolean
): Promise<void> {
    try {
        const conversationRef = doc(db, CONVERSATIONS_COLLECTION, conversationId)

        await updateDoc(conversationRef, {
            [`typing.${userId}`]: isTyping ? serverTimestamp() : null
        })
    } catch (error) {
        console.error('Error setting typing status:', error)
    }
}
