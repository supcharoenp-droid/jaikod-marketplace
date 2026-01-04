
import { db } from '@/lib/firebase'
import {
    collection,
    doc,
    getDocs,
    getDoc,
    addDoc,
    updateDoc,
    deleteDoc,
    query,
    orderBy,
    where,
    Timestamp,
    serverTimestamp
} from 'firebase/firestore'
import { logAdminAction } from '@/lib/adminLogger'
import { AdminUser } from '@/types/admin'

export interface Category {
    id: string
    name: string      // English Name (Standard)
    name_th: string   // Thai Name
    slug: string
    icon: string      // Lucide icon name or URL
    order: number
    isActive: boolean
    parentId?: string // For subcategories
    productCount?: number // Aggregated count
}

// 1. Get Categories
export async function getAdminCategories() {
    try {
        const ref = collection(db, 'categories')
        const q = query(ref, orderBy('order', 'asc'))
        const snap = await getDocs(q)

        return snap.docs.map(d => ({ id: d.id, ...d.data() } as Category))
    } catch (error) {
        console.error('Error fetching categories:', error)
        return []
    }
}

// 2. Create Category
export async function createCategory(admin: AdminUser, data: Omit<Category, 'id' | 'productCount'>) {
    try {
        const docRef = await addDoc(collection(db, 'categories'), {
            ...data,
            productCount: 0,
            createdAt: serverTimestamp()
        })
        await logAdminAction(admin, 'CATEGORY_CREATE', `Category: ${data.slug}`, `Created category ${data.name}`)
        return docRef.id
    } catch (error) {
        throw error
    }
}

// 3. Update Category
export async function updateCategory(admin: AdminUser, id: string, data: Partial<Category>) {
    try {
        await updateDoc(doc(db, 'categories', id), data)
        await logAdminAction(admin, 'CATEGORY_UPDATE', `Category: ${id}`, 'Updated details')
        return true
    } catch (error) {
        throw error
    }
}

// 4. Delete Category
export async function deleteCategory(admin: AdminUser, id: string) {
    try {
        await deleteDoc(doc(db, 'categories', id))
        await logAdminAction(admin, 'CATEGORY_DELETE', `Category: ${id}`, 'Deleted category')
        return true
    } catch (error) {
        throw error
    }
}

// Helper: Seed Initial Categories from Constants if DB is empty
export async function seedCategoriesFromConstants(admin: AdminUser) {
    // Dynamic import to avoid circular dependencies if any
    const { CATEGORIES } = await import('@/constants/categories')

    // Check if empty
    const existing = await getAdminCategories()
    if (existing.length > 0) return { success: false, message: 'Categories already exist' }

    let count = 0
    let order = 0
    for (const cat of CATEGORIES) {
        await addDoc(collection(db, 'categories'), {
            name: cat.name_en, // Use name_en as main name
            name_th: cat.name_th,
            slug: cat.slug,
            icon: cat.icon,
            order: order++,
            isActive: true,
            productCount: 0
        })
        count++
    }

    await logAdminAction(admin, 'CATEGORY_SEED', 'All', `Seeded ${count} categories`)
    return { success: true, count }
}
