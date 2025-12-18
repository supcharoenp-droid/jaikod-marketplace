/**
 * JaiKod Chat System - Kaidee Style
 * Simple 1:1 chat between buyer and seller tied to a listing
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
    onSnapshot,
    Unsubscribe,
    Timestamp,
    setDoc
} from 'firebase/firestore'
import { db } from './firebase'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { storage } from './firebase'

// Collections
const CHAT_ROOMS = 'chat_rooms'
const CHAT_MESSAGES = 'chat_messages'

// Types
export interface ChatRoom {
    id: string
    buyer_id: string
    seller_id: string
    listing_id: string
    listing_title: string
    listing_image?: string
    listing_price?: number
    last_message: string
    last_message_at: Date
    last_sender_id: string
    unread_count_buyer: number
    unread_count_seller: number
    is_active: boolean // For general closing (by admin or system)
    participants: string[]
    deleted_by_buyer?: boolean
    deleted_by_seller?: boolean
    cleared_at_buyer?: any // Timestamp of when buyer cleared chat
    cleared_at_seller?: any // Timestamp of when seller cleared chat
    created_at: Date
}

export interface ChatMessage {
    id: string
    room_id: string
    sender_id: string
    sender_name: string
    text: string
    image_url?: string
    type?: 'text' | 'image' | 'offer' | 'system'
    metadata?: {
        price?: number
        offer_status?: 'pending' | 'accepted' | 'rejected'
    }
    status: 'sent' | 'delivered' | 'read'
    created_at: Date
}

/**
 * Get or create chat room for a listing
 */
export async function getOrCreateChatRoom(
    buyerId: string,
    sellerId: string,
    listingId: string,
    listingTitle: string,
    listingImage?: string,
    listingPrice?: number
): Promise<string> {
    try {
        // Create deterministic Room ID to prevent duplicates
        // Format: listingId_buyerId_sellerId
        const roomId = `${listingId}_${buyerId}_${sellerId}`
        const roomRef = doc(db, CHAT_ROOMS, roomId)
        const roomSnap = await getDoc(roomRef)

        if (roomSnap.exists()) {
            // Update room info and undelete
            await updateDoc(roomRef, {
                deleted_by_buyer: false,
                deleted_by_seller: false,
                // Always update listing details to keep them fresh
                listing_title: listingTitle,
                listing_image: listingImage || null,
                listing_price: listingPrice || null
            })
            return roomId
        }

        // Create new room if not exists
        await setDoc(roomRef, {
            buyer_id: buyerId,
            seller_id: sellerId,
            participants: [buyerId, sellerId],
            listing_id: listingId,
            listing_title: listingTitle,
            listing_image: listingImage || null,
            listing_price: listingPrice || null,
            last_message: '',
            last_message_at: serverTimestamp(),
            last_sender_id: '',
            unread_count_buyer: 0,
            unread_count_seller: 0,
            created_at: serverTimestamp(),
            is_active: true,
            deleted_by_buyer: false,
            deleted_by_seller: false
        })

        return roomId
    } catch (error) {
        console.error('Error getting/creating chat room:', error)
        throw error
    }
}

/**
 * Soft delete chat room for a specific user
 */
export async function deleteChatRoom(roomId: string, role: 'buyer' | 'seller'): Promise<void> {
    try {
        const roomRef = doc(db, CHAT_ROOMS, roomId)
        await updateDoc(roomRef, {
            [`deleted_by_${role}`]: true,
            [`cleared_at_${role}`]: serverTimestamp()
        })
    } catch (error) {
        console.error('Error deleting chat room:', error)
        throw error
    }
}

/**
 * Get all chat rooms for a user
 */
export async function getUserChatRooms(userId: string): Promise<ChatRoom[]> {
    try {
        // Use single query with array-contains on participants
        const q = query(
            collection(db, CHAT_ROOMS),
            where('participants', 'array-contains', userId),
            where('is_active', '==', true)
            // Removed orderBy to avoid index issues, sorting client-side instead
        )

        const querySnapshot = await getDocs(q)

        return querySnapshot.docs
            .map(doc => {
                const data = doc.data()
                return {
                    id: doc.id,
                    buyer_id: data.buyer_id,
                    seller_id: data.seller_id,
                    listing_id: data.listing_id,
                    listing_title: data.listing_title,
                    listing_image: data.listing_image,
                    listing_price: data.listing_price,
                    last_message: data.last_message,
                    last_message_at: data.last_message_at?.toDate ? data.last_message_at.toDate() : new Date(),
                    last_sender_id: data.last_sender_id,
                    unread_count_buyer: data.unread_count_buyer || 0,
                    unread_count_seller: data.unread_count_seller || 0,
                    created_at: data.created_at?.toDate ? data.created_at.toDate() : new Date(),
                    is_active: data.is_active,
                    participants: data.participants,
                    deleted_by_buyer: data.deleted_by_buyer,
                    deleted_by_seller: data.deleted_by_seller,
                    cleared_at_buyer: data.cleared_at_buyer?.toDate ? data.cleared_at_buyer.toDate() : null,
                    cleared_at_seller: data.cleared_at_seller?.toDate ? data.cleared_at_seller.toDate() : null
                } as ChatRoom
            })
            .filter(room => {
                // Filter out soft-deleted rooms
                if (room.buyer_id === userId && room.deleted_by_buyer) return false;
                if (room.seller_id === userId && room.deleted_by_seller) return false;
                return true;
            })
            .sort((a, b) => b.last_message_at.getTime() - a.last_message_at.getTime());
    } catch (error) {
        console.error('Error getting user chat rooms:', error)
        return []
    }
}

/**
 * Subscribe to user's chat rooms (realtime)
 * with support for excluding deleted rooms
 */
export function subscribeToUserChatRooms(userId: string, callback: (rooms: ChatRoom[]) => void) {
    if (!userId) return () => { }

    const q = query(
        collection(db, CHAT_ROOMS),
        where('participants', 'array-contains', userId)
        // Removed orderBy to avoid index issues, sorting client-side instead
    )

    return onSnapshot(q, (snapshot) => {
        const rooms = snapshot.docs
            .map(doc => {
                const data = doc.data()
                return {
                    id: doc.id,
                    buyer_id: data.buyer_id,
                    seller_id: data.seller_id,
                    listing_id: data.listing_id,
                    listing_title: data.listing_title,
                    listing_image: data.listing_image,
                    listing_price: data.listing_price,
                    last_message: data.last_message,
                    last_message_at: data.last_message_at?.toDate ? data.last_message_at.toDate() : new Date(),
                    last_sender_id: data.last_sender_id,
                    unread_count_buyer: data.unread_count_buyer || 0,
                    unread_count_seller: data.unread_count_seller || 0,
                    created_at: data.created_at?.toDate ? data.created_at.toDate() : new Date(),
                    is_active: data.is_active,
                    participants: data.participants,
                    deleted_by_buyer: data.deleted_by_buyer,
                    deleted_by_seller: data.deleted_by_seller,
                    cleared_at_buyer: data.cleared_at_buyer?.toDate ? data.cleared_at_buyer.toDate() : null,
                    cleared_at_seller: data.cleared_at_seller?.toDate ? data.cleared_at_seller.toDate() : null
                } as ChatRoom
            })
            .filter(room => {
                // Filter out soft-deleted rooms
                if (room.buyer_id === userId && room.deleted_by_buyer) return false;
                if (room.seller_id === userId && room.deleted_by_seller) return false;
                return true;
            })
            .sort((a, b) => b.last_message_at.getTime() - a.last_message_at.getTime())

        callback(rooms)
    })
}

/**
 * Send a message
 */
export async function sendChatMessage(
    roomId: string,
    senderId: string,
    senderName: string,
    text: string,
    imageFile?: File,
    type: 'text' | 'image' | 'offer' | 'system' = 'text',
    metadata?: any
): Promise<string> {
    try {
        let imageUrl: string | undefined

        // Upload image if provided
        if (imageFile) {
            const imageRef = ref(storage, `chat_images/${roomId}/${Date.now()}_${imageFile.name}`)
            await uploadBytes(imageRef, imageFile)
            imageUrl = await getDownloadURL(imageRef)
        }

        // Create message
        const messageRef = await addDoc(collection(db, CHAT_MESSAGES), {
            room_id: roomId,
            sender_id: senderId,
            sender_name: senderName,
            text: text || '',
            image_url: imageUrl || null,
            type,
            metadata: metadata || null,
            status: 'sent',
            created_at: serverTimestamp()
        })

        // Update room's last message
        const roomRef = doc(db, CHAT_ROOMS, roomId)
        const roomSnap = await getDoc(roomRef)

        if (roomSnap.exists()) {
            const roomData = roomSnap.data()
            const isBuyer = roomData.buyer_id === senderId

            await updateDoc(roomRef, {
                last_message: text || '📷 รูปภาพ',
                last_message_at: serverTimestamp(),
                last_sender_id: senderId,
                // Increment unread count for the other person
                ...(isBuyer ? {
                    unread_count_seller: (roomData.unread_count_seller || 0) + 1
                } : {
                    unread_count_buyer: (roomData.unread_count_buyer || 0) + 1
                }),
                // Undelete chat room so it reappears for both parties
                deleted_by_buyer: false,
                deleted_by_seller: false
            })
        }

        return messageRef.id
    } catch (error) {
        console.error('Error sending message:', error)
        throw error
    }
}

/**
 * Get messages in a room
 */
export async function getRoomMessages(roomId: string): Promise<ChatMessage[]> {
    try {
        const q = query(
            collection(db, CHAT_MESSAGES),
            where('room_id', '==', roomId),
            orderBy('created_at', 'asc'),
            limit(100)
        )

        const snapshot = await getDocs(q)

        return snapshot.docs.map(doc => {
            const data = doc.data()
            return {
                id: doc.id,
                room_id: data.room_id,
                sender_id: data.sender_id,
                sender_name: data.sender_name,
                text: data.text,
                image_url: data.image_url,
                type: data.type || (data.image_url ? 'image' : 'text'),
                metadata: data.metadata,
                status: data.status,
                created_at: data.created_at?.toDate() || new Date()
            }
        })
    } catch (error) {
        console.error('Error getting messages:', error)
        return []
    }
}

/**
 * Subscribe to messages in a room (real-time)
 */
export function subscribeToRoomMessages(
    roomId: string,
    callback: (messages: ChatMessage[]) => void
): Unsubscribe {
    const q = query(
        collection(db, CHAT_MESSAGES),
        where('room_id', '==', roomId),
        orderBy('created_at', 'asc')
    )

    return onSnapshot(q, (snapshot) => {
        const messages = snapshot.docs.map(doc => {
            const data = doc.data()
            return {
                id: doc.id,
                room_id: data.room_id,
                sender_id: data.sender_id,
                sender_name: data.sender_name,
                text: data.text,
                image_url: data.image_url,
                type: data.type || (data.image_url ? 'image' : 'text'),
                metadata: data.metadata,
                status: data.status,
                created_at: data.created_at?.toDate() || new Date()
            }
        })
        callback(messages)
    })
}

/**
 * Mark messages as read
 */
export async function markMessagesAsRead(roomId: string, userId: string): Promise<void> {
    try {
        const roomRef = doc(db, CHAT_ROOMS, roomId)
        const roomSnap = await getDoc(roomRef)

        if (!roomSnap.exists()) return

        const roomData = roomSnap.data()
        const isBuyer = roomData.buyer_id === userId

        // Reset unread count for this user
        await updateDoc(roomRef, {
            ...(isBuyer ? {
                unread_count_buyer: 0
            } : {
                unread_count_seller: 0
            })
        })

        // Update message status to 'read' for messages from the other person
        // Note: Firestore doesn't allow multiple != operators, so we filter in JS
        const q = query(
            collection(db, CHAT_MESSAGES),
            where('room_id', '==', roomId)
        )

        const snapshot = await getDocs(q)

        // Filter and update only messages from other user that are not read
        const updatePromises = snapshot.docs
            .filter(doc => {
                const data = doc.data()
                return data.sender_id !== userId && data.status !== 'read'
            })
            .map(doc => updateDoc(doc.ref, { status: 'read' }))

        await Promise.all(updatePromises)
    } catch (error) {
        console.error('Error marking messages as read:', error)
    }
}

/**
 * Get total unread count for user
 */
export async function getTotalUnreadCount(userId: string): Promise<number> {
    try {
        const rooms = await getUserChatRooms(userId)

        return rooms.reduce((total, room) => {
            if (room.buyer_id === userId) {
                return total + room.unread_count_buyer
            } else {
                return total + room.unread_count_seller
            }
        }, 0)
    } catch (error) {
        console.error('Error getting unread count:', error)
        return 0
    }
}

/**
 * Close/deactivate a chat room
 */
export async function closeChatRoom(roomId: string): Promise<void> {
    try {
        const roomRef = doc(db, CHAT_ROOMS, roomId)
        await updateDoc(roomRef, {
            is_active: false
        })
    } catch (error) {
        console.error('Error closing chat room:', error)
        throw error
    }
}

/**
 * Update message metadata (e.g. for accepting offer)
 */
export async function updateMessageMetadata(messageId: string, metadata: any): Promise<void> {
    try {
        const msgRef = doc(db, CHAT_MESSAGES, messageId)

        // Use dot notation to update specific fields in the metadata map
        // This prevents overwriting the entire metadata object (e.g. keeping 'price')
        const updateData: any = {};
        for (const [key, value] of Object.entries(metadata)) {
            updateData[`metadata.${key}`] = value;
        }

        await updateDoc(msgRef, updateData)
    } catch (error) {
        console.error('Error updating message metadata:', error)
        throw error
    }
}
