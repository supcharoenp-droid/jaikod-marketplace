import { db } from '@/lib/firebase'
import {
    collection,
    doc,
    getDocs,
    getDoc,
    updateDoc,
    query,
    where,
    orderBy,
    limit,
    startAfter,
    Timestamp,
    getCountFromServer
} from 'firebase/firestore'
import { logAdminAction } from '@/lib/adminLogger'
import { AdminUser } from '@/types/admin'

export interface UserData {
    id: string
    displayName: string
    email: string
    phoneNumber?: string
    photoURL?: string
    isVerified?: boolean
    isSuspended?: boolean
    status: 'active' | 'banned'
    createdAt: Timestamp
    lastLogin?: Timestamp
    onboardingStep?: number
    shopSlug?: string
    shopName?: string,
    suspendReason?: string
}

export interface UserFilter {
    status?: 'active' | 'banned' | 'all'
    search?: string
    lastDoc?: any // for pagination
}

const PAGE_SIZE = 20

// 1. GET /admin/users
export async function getUsers(filter: UserFilter = { status: 'all' }) {
    try {
        const usersRef = collection(db, 'users')
        let constraints: any[] = [orderBy('createdAt', 'desc')]

        // Note: Firestore requires composite indexes for complex queries (where + orderBy).
        // For simplicity in this demo without creating indexes, we might do client-side filtering 
        // if the search term is used, or rely on simple queries.

        // However, let's try to stick to efficient queries where possible.
        if (filter.status === 'banned') {
            constraints.unshift(where('isSuspended', '==', true))
        } else if (filter.status === 'active') {
            // In Firestore '!= true' is not a direct operator for legacy reasons, usually handled by checking falsy
            // But simpler is to allow client side or just fetch all for 'active' in small apps. 
            // To be precise:
            // constraints.unshift(where('isSuspended', '!=', true)) // Requires index
        }

        if (filter.lastDoc) {
            constraints.push(startAfter(filter.lastDoc))
        }

        constraints.push(limit(PAGE_SIZE))

        let q = query(usersRef, ...constraints)

        // Search overrides standard status query usually because of index limitations
        // But for this demo, let's fetch and filter in memory if search exists
        if (filter.search) {
            // Reset query to just limit for global search or use a Search Service (Algolia)
            // Fallback: Fetch latest 100 users and filter client side
            q = query(usersRef, orderBy('createdAt', 'desc'), limit(100))
        }

        const snap = await getDocs(q)
        let users = snap.docs.map(d => {
            const data = d.data()
            return {
                id: d.id,
                displayName: data.displayName || 'Unknown',
                email: data.email || '',
                phoneNumber: data.phoneNumber,
                photoURL: data.photoURL,
                isVerified: data.isVerified,
                isSuspended: data.isSuspended,
                status: data.isSuspended ? 'banned' : 'active',
                createdAt: data.createdAt,
                lastLogin: data.lastLogin,
                onboardingStep: data.onboardingStep || 1,
                shopSlug: data.shopSlug,
                shopName: data.shopName
            } as UserData
        })

        // Client-side filtering for Search & Status (if query didn't catch it)
        if (filter.search) {
            const term = filter.search.toLowerCase()
            users = users.filter(u =>
                u.displayName.toLowerCase().includes(term) ||
                u.email.toLowerCase().includes(term) ||
                (u.phoneNumber && u.phoneNumber.includes(term))
            )
        }

        // Post-filter for 'active' if we couldn't query it directly easily
        if (filter.status === 'active') {
            users = users.filter(u => !u.isSuspended)
        }
        if (filter.status === 'banned') {
            users = users.filter(u => u.isSuspended)
        }

        return {
            users,
            lastDoc: snap.docs[snap.docs.length - 1]
        }
    } catch (error) {
        console.error('Error fetching users:', error)
        return { users: [], lastDoc: null }
    }
}

// 1.1 Get User Count (for dashboard/header)
export async function getUserStats() {
    try {
        const coll = collection(db, 'users')
        const snapshot = await getCountFromServer(coll)
        const bannedQuery = query(coll, where('isSuspended', '==', true))
        const bannedSnapshot = await getCountFromServer(bannedQuery)

        return {
            total: snapshot.data().count,
            banned: bannedSnapshot.data().count,
            active: snapshot.data().count - bannedSnapshot.data().count
        }
    } catch (e) {
        return { total: 0, banned: 0, active: 0 }
    }
}

// 2. GET /admin/users/:id
export async function getUserById(id: string): Promise<UserData | null> {
    try {
        const snap = await getDoc(doc(db, 'users', id))
        if (snap.exists()) {
            const data = snap.data()
            return {
                id: snap.id,
                ...data,
                status: data.isSuspended ? 'banned' : 'active'
            } as UserData
        }
        return null
    } catch (error) {
        return null
    }
}

// 3. POST /admin/users/:id/ban
export async function banUser(admin: AdminUser, userId: string, reason: string) {
    try {
        await updateDoc(doc(db, 'users', userId), {
            isSuspended: true,
            suspendReason: reason,
            suspendedAt: Timestamp.now()
        })
        await logAdminAction(admin, 'USER_BAN', `User: ${userId}`, `Banned user: ${reason}`)
        return true
    } catch (error) {
        throw error
    }
}

// 4. POST /admin/users/:id/unban
export async function unbanUser(admin: AdminUser, userId: string) {
    try {
        await updateDoc(doc(db, 'users', userId), {
            isSuspended: false,
            suspendReason: null,
            suspendedAt: null
        })
        await logAdminAction(admin, 'USER_UNBAN', `User: ${userId}`, `Unbanned user`)
        return true
    } catch (error) {
        throw error
    }
}
