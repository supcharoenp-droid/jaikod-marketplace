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
    serverTimestamp,
    Timestamp
} from 'firebase/firestore'
import { db } from './firebase'

const TICKETS_COLLECTION = 'support_tickets'

export interface SupportTicket {
    id: string
    userId: string
    subject: string
    description: string
    status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED'
    priority: 'LOW' | 'MEDIUM' | 'HIGH'
    category: 'GENERAL' | 'ORDER' | 'PAYMENT' | 'ACCOUNT'
    assignedTo?: string // Support Agent ID
    orderId?: string
    createdAt: Date
    updatedAt: Date
}

/**
 * Create a new support ticket
 */
export async function createTicket(
    userId: string,
    data: {
        subject: string,
        description: string,
        category: SupportTicket['category'],
        priority?: SupportTicket['priority'],
        orderId?: string
    }
): Promise<string> {
    try {
        const docRef = await addDoc(collection(db, TICKETS_COLLECTION), {
            userId,
            subject: data.subject,
            description: data.description,
            category: data.category,
            priority: data.priority || 'MEDIUM',
            status: 'OPEN',
            orderId: data.orderId || null,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        })
        return docRef.id
    } catch (error) {
        console.error('Error creating ticket:', error)
        throw error
    }
}

/**
 * Get tickets for a specific user
 */
export async function getUserTickets(userId: string): Promise<SupportTicket[]> {
    try {
        const q = query(
            collection(db, TICKETS_COLLECTION),
            where('userId', '==', userId),
            orderBy('createdAt', 'desc')
        )
        const snapshot = await getDocs(q)
        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            createdAt: (doc.data().createdAt as Timestamp)?.toDate(),
            updatedAt: (doc.data().updatedAt as Timestamp)?.toDate()
        })) as SupportTicket[]
    } catch (error) {
        console.error('Error getting user tickets:', error)
        return []
    }
}

/**
 * Update ticket status (Admin/Support only)
 */
export async function updateTicketStatus(
    ticketId: string,
    status: SupportTicket['status'],
    assignedTo?: string
): Promise<void> {
    try {
        const updateData: any = {
            status,
            updatedAt: serverTimestamp()
        }
        if (assignedTo) {
            updateData.assignedTo = assignedTo
        }

        await updateDoc(doc(db, TICKETS_COLLECTION, ticketId), updateData)
    } catch (error) {
        console.error('Error updating ticket:', error)
        throw error
    }
}
