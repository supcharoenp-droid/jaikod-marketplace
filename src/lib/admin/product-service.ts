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
    Timestamp,
    addDoc,
    getCountFromServer
} from 'firebase/firestore'
import { logAdminAction } from '@/lib/adminLogger'
import { AdminUser } from '@/types/admin'
import { Product } from '@/types'
import { UniversalListing } from '@/lib/listings'

// Type extension for Admin
export interface AdminProduct extends Product {
    violationCount?: number
}

// Helper to map UniversalListing to AdminProduct
function mapListingToAdminProduct(listing: UniversalListing & { id: string }): AdminProduct {
    return {
        id: listing.id,
        seller_id: listing.seller_id,
        seller_name: listing.seller_info?.name,
        seller_avatar: listing.seller_info?.avatar,

        title: listing.title,
        title_en: listing.title_en,
        description: listing.ai_content?.marketing_copy?.full_text ||
            listing.template_data.description ||
            listing.template_data.additional_description ||
            JSON.stringify(listing.template_data) ||
            '',

        category_id: listing.category_type, // Map type string to id for display
        sub_category_id: String(listing.subcategory_id || ''),

        condition: (listing.template_data?.condition as any) || 'good',

        price: listing.price,
        price_type: listing.price_type === 'negotiable' ? 'negotiable' : 'fixed',

        stock: 1, // Default for single item listings
        status: listing.status as any, // Cast status

        images: listing.images || [],
        thumbnail_url: listing.thumbnail_url,

        tags: listing.ai_content?.seo_keywords || [],

        location_province: listing.location?.province,
        location_amphoe: listing.location?.amphoe,

        views_count: listing.stats?.views || 0,
        favorites_count: listing.stats?.favorites || 0,
        sold_count: listing.stats?.offers_received || 0, // Mock mapping

        slug: listing.slug,

        can_ship: !!listing.meeting?.delivery_option,
        can_pickup: true,

        created_at: listing.created_at,
        updated_at: listing.updated_at,

        // Admin specific
        violationCount: 0
    } as unknown as AdminProduct
}

// 1. GET /admin/products (List + Filter)
export async function getAdminProducts(filter: { status?: string, search?: string }) {
    try {
        const prodRef = collection(db, 'listings')

        let q = query(prodRef, orderBy('created_at', 'desc'), limit(100))

        if (filter.status && filter.status !== 'all') {
            q = query(prodRef, where('status', '==', filter.status), orderBy('created_at', 'desc'), limit(100))
        }

        const snap = await getDocs(q)
        let products = snap.docs.map(dS => {
            const d = dS.data()
            return mapListingToAdminProduct({
                id: dS.id,
                ...d,
                created_at: d.created_at?.toDate(),
                updated_at: d.updated_at?.toDate()
            } as UniversalListing)
        })

        if (filter.search) {
            const term = filter.search.toLowerCase()
            products = products.filter(p =>
                p.title.toLowerCase().includes(term) ||
                p.description.toLowerCase().includes(term)
            )
        }

        return products
    } catch (error) {
        console.error('Error fetching admin products (listings):', error)
        return []
    }
}

// 2. GET /admin/products/:id
export async function getAdminProductById(id: string): Promise<AdminProduct | null> {
    try {
        const d = await getDoc(doc(db, 'listings', id))
        if (d.exists()) {
            const data = d.data()
            return mapListingToAdminProduct({
                id: d.id,
                ...data,
                created_at: data.created_at?.toDate(),
                updated_at: data.updated_at?.toDate()
            } as UniversalListing)
        }
        return null
    } catch (e) {
        console.error('Error fetching admin product by ID:', e)
        return null
    }
}

// 3. Stats
export async function getProductStats() {
    try {
        const coll = collection(db, 'listings')
        const snap = await getCountFromServer(coll)

        const activeQ = query(coll, where('status', '==', 'active'))
        const activeSnap = await getCountFromServer(activeQ)

        const pendingQ = query(coll, where('status', '==', 'pending_review'))
        const pendingSnap = await getCountFromServer(pendingQ)

        const bannedQ = query(coll, where('status', '==', 'suspended'))
        const bannedSnap = await getCountFromServer(bannedQ)

        return {
            total: snap.data().count,
            active: activeSnap.data().count,
            pending: pendingSnap.data().count,
            suspended: bannedSnap.data().count
        }
    } catch (e) {
        return { total: 0, active: 0, pending: 0, suspended: 0 }
    }
}

// 4. Actions

export async function approveProduct(admin: AdminUser, id: string) {
    try {
        await updateDoc(doc(db, 'listings', id), {
            status: 'active',
            approved_by: admin.id,
            approved_at: Timestamp.now()
        })
        await logAdminAction(admin, 'PRODUCT_APPROVE', `Listing: ${id}`, 'Approved listing')
    } catch (e) { throw e }
}

export async function rejectProduct(admin: AdminUser, id: string, reason: string) {
    try {
        await updateDoc(doc(db, 'listings', id), {
            status: 'rejected',
            reject_reason: reason,
            rejected_by: admin.id,
            rejected_at: Timestamp.now()
        })
        await logAdminAction(admin, 'PRODUCT_REJECT', `Listing: ${id}`, `Rejected: ${reason}`)
    } catch (e) { throw e }
}

export async function freezeProduct(admin: AdminUser, id: string, reason: string) {
    try {
        await updateDoc(doc(db, 'listings', id), {
            status: 'suspended',
            suspend_reason: reason,
            suspended_by: admin.id,
            suspended_at: Timestamp.now()
        })
        await logAdminAction(admin, 'PRODUCT_FREEZE', `Listing: ${id}`, `Suspended: ${reason}`)
    } catch (e) { throw e }
}

export async function flagProduct(admin: AdminUser, id: string, reason: string) {
    try {
        // Increment violations
        const ref = doc(db, 'listings', id)
        const d = await getDoc(ref)
        const currentViolations = d.data()?.violation_count || 0

        await updateDoc(ref, {
            violation_count: currentViolations + 1,
            last_flagged_at: Timestamp.now(),
            last_flag_reason: reason
        })

        // Also add to flags collection
        await addDoc(collection(db, 'product_flags'), {
            product_id: id,
            reason: reason,
            flagged_by: admin.id,
            created_at: Timestamp.now(),
            type: 'manual'
        })

        await logAdminAction(admin, 'PRODUCT_FLAG', `Listing: ${id}`, `Flagged: ${reason}`)
    } catch (e) { throw e }
}
import { getAIAnalystService } from './ai-analyst-service'

/**
 * 5. AI Product Analysis
 */
export async function analyzeProductWithAI(productId: string) {
    try {
        const productRef = doc(db, 'listings', productId)
        const snap = await getDoc(productRef)
        const data = snap.data()
        if (!data) throw new Error('Listing not found')

        const analyst = getAIAnalystService()

        // Construct a prompt for product analysis
        const prompt = `
            Analyze this marketplace listing for quality and risk.
            Title: ${data.title}
            Description: ${data.ai_content?.marketing_copy?.full_text || JSON.stringify(data.template_data)}
            Price: ${data.price}
            Category: ${data.category_type}

            **TASK:**
            1. Rate quality (0-100).
            2. Identify risk factors (scam, prohibited items).
            3. Verify if images match description.
            4. Suggest if this is "High Quality" or "Low Quality".
        `

        // Simulate AI call for now or use real vision if images available
        const analysis = {
            qualityScore: Math.floor(Math.random() * 30) + 70, // Mock for demo feel
            riskLevel: 'low',
            flags: [],
            suggestions: ['Ensure images are clear', 'Verify seller identity'],
            analyzedAt: Timestamp.now()
        }

        await updateDoc(productRef, {
            ai_analysis: analysis
        })

        return analysis
    } catch (error) {
        console.error('AI Product Analysis Error:', error)
        throw error
    }
}
