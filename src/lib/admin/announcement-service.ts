import { db } from '@/lib/firebase'
import {
    collection,
    doc,
    getDocs,
    getDoc,
    addDoc,
    updateDoc,
    query,
    where,
    orderBy,
    limit,
    Timestamp,
    serverTimestamp,
    deleteDoc
} from 'firebase/firestore'
import { logAdminAction } from '@/lib/adminLogger'
import { AdminUser } from '@/types/admin'

export interface Announcement {
    id: string
    title: string
    content: string
    cover_image?: string
    audience: 'users' | 'sellers' | 'all'
    status: 'draft' | 'published' | 'archived' | 'scheduled'
    category: 'update' | 'promotion' | 'warning' | 'system'
    is_important: boolean
    created_by: string
    scheduled_at?: Date | null
    published_at?: Date | null
    created_at: Date
    updated_at: Date
}

const COLLECTION = 'announcements'

// 1. GET /admin/announcements
export async function getAdminAnnouncements(filter?: { status?: string, category?: string, audience?: string }) {
    try {
        let q = query(collection(db, COLLECTION), orderBy('created_at', 'desc'))

        if (filter?.status && filter.status !== 'all') {
            q = query(q, where('status', '==', filter.status))
        }
        if (filter?.category && filter.category !== 'all') {
            q = query(q, where('category', '==', filter.category))
        }

        const snap = await getDocs(q)
        return snap.docs.map(doc => {
            const data = doc.data()
            return {
                id: doc.id,
                ...data,
                scheduled_at: data.scheduled_at?.toDate(),
                published_at: data.published_at?.toDate(),
                created_at: data.created_at?.toDate(),
                updated_at: data.updated_at?.toDate()
            } as Announcement
        })
    } catch (e) {
        console.error('Error fetching admin announcements:', e)
        return []
    }
}

// 2. GET Public Blog Posts
export async function getPublicAnnouncements(limitCount: number = 10) {
    try {
        // Fetch published items.
        // Note: For 'scheduled', a real backend would flip status to published. 
        // Client-side, we can just query where status == 'published' OR (status == 'scheduled' AND scheduled_at <= now)
        // Complexity with OR queries in Firestore is high. Simplest is fetch 'published'.

        const q = query(
            collection(db, COLLECTION),
            where('status', '==', 'published'),
            orderBy('is_important', 'desc'), // Important first
            orderBy('published_at', 'desc'),
            limit(limitCount)
        )

        const snap = await getDocs(q)
        return snap.docs.map(doc => {
            const data = doc.data()
            return {
                id: doc.id,
                ...data,
                scheduled_at: data.scheduled_at?.toDate(),
                published_at: data.published_at?.toDate(),
                created_at: data.created_at?.toDate(),
                updated_at: data.updated_at?.toDate()
            } as Announcement
        })
    } catch (e) {
        console.error('Error fetching public announcements:', e)
        return []
    }
}

// 3. Create
export async function createAnnouncement(admin: AdminUser, data: Partial<Announcement>) {
    try {
        const docRef = await addDoc(collection(db, COLLECTION), {
            ...data,
            created_by: admin.id,
            status: data.status || 'draft',
            created_at: serverTimestamp(),
            updated_at: serverTimestamp()
        })

        await logAdminAction(admin, 'ANNOUNCEMENT_CREATE', `ID: ${docRef.id}`, `Created announcement: ${data.title}`)
        return docRef.id
    } catch (e) { throw e }
}

// 4. Update
export async function updateAnnouncement(admin: AdminUser, id: string, data: Partial<Announcement>) {
    try {
        const ref = doc(db, COLLECTION, id)
        await updateDoc(ref, {
            ...data,
            updated_at: serverTimestamp()
        })
        await logAdminAction(admin, 'ANNOUNCEMENT_UPDATE', `ID: ${id}`, `Updated fields: ${Object.keys(data).join(', ')}`)
    } catch (e) { throw e }
}

// 5. Publish / Archive Actions
export async function publishAnnouncement(admin: AdminUser, id: string) {
    try {
        const ref = doc(db, COLLECTION, id)
        await updateDoc(ref, {
            status: 'published',
            published_at: serverTimestamp(),
            updated_at: serverTimestamp()
        })
        await logAdminAction(admin, 'ANNOUNCEMENT_PUBLISH', `ID: ${id}`, 'Published announcement')
    } catch (e) { throw e }
}

export async function archiveAnnouncement(admin: AdminUser, id: string) {
    try {
        const ref = doc(db, COLLECTION, id)
        await updateDoc(ref, {
            status: 'archived',
            updated_at: serverTimestamp()
        })
        await logAdminAction(admin, 'ANNOUNCEMENT_ARCHIVE', `ID: ${id}`, 'Archived announcement')
    } catch (e) { throw e }
}

export async function deleteAnnouncement(admin: AdminUser, id: string) {
    try {
        await deleteDoc(doc(db, COLLECTION, id))
        await logAdminAction(admin, 'ANNOUNCEMENT_DELETE', `ID: ${id}`, 'Deleted announcement')
    } catch (e) { throw e }
}

// Seed Mock Data
export async function seedMockAnnouncements(adminUser: AdminUser) {
    const mocks: Partial<Announcement>[] = [
        {
            title: 'ยินดีต้อนรับสู่ JaiKod Marketplace!',
            content: 'เราคือตลาดซื้อขายสินค้ามือสองรูปแบบใหม่ที่ใช้ AI ช่วยคุณขายของได้ง่ายขึ้น...',
            cover_image: 'https://images.unsplash.com/photo-1556740758-90de374c12ad?w=800',
            audience: 'all',
            status: 'published',
            category: 'system',
            is_important: true,
            published_at: new Date()
        },
        {
            title: 'แจ้งปิดปรับปรุงระบบชั่วคราว',
            content: 'ระบบจะปิดปรับปรุงในวันอาทิตย์ที่ 15 ธ.ค. เวลา 02:00-04:00 น. เพื่ออัปเกรดเซิร์ฟเวอร์',
            audience: 'all',
            status: 'published',
            category: 'warning',
            is_important: true,
            published_at: new Date()
        },
        {
            title: 'โปรโมชั่นเปิดร้านใหม่ ฟรีค่าธรรมเนียม!',
            content: 'สมัครเปิดร้านวันนี้ รับสิทธิ์ขายฟรี 0% นาน 3 เดือน...',
            cover_image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800',
            audience: 'sellers',
            status: 'draft',
            category: 'promotion',
            is_important: false
        }
    ]

    for (const m of mocks) {
        await createAnnouncement(adminUser, m)
    }
}
