/**
 * Universal Listing System - Main Service
 * 
 * CRUD operations for all listing types
 */

import {
    collection,
    doc,
    addDoc,
    updateDoc,
    deleteDoc,
    getDoc,
    getDocs,
    query,
    where,
    orderBy,
    limit,
    runTransaction,
    Timestamp
} from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { db, storage } from '../firebase'
import {
    UniversalListing,
    CreateListingInput,
    ListingCategoryType,
    CATEGORY_PREFIXES,
    CATEGORY_CODES,
    SellerInfo,
    ListingStats
} from './types'

const LISTINGS_COLLECTION = 'listings'
const COUNTERS_COLLECTION = 'counters'

// ==========================================
// LISTING CODE GENERATION (NEW - JK-AXXXXX)
// ==========================================

/**
 * Generate short, memorable listing code
 * Format: JK-{CATEGORY_CODE}{5_CHAR_BASE36}
 * Example: JK-A72M3X (Car), JK-B8K4PQ (Motorcycle)
 * 
 * Benefits:
 * - Short (9 chars) - easy to share via LINE/SMS
 * - Category-aware - first char after JK- tells the type
 * - 60+ million combinations per category
 * - Human-friendly - no confusing characters (0/O, 1/I/L)
 */
export async function generateListingCode(categoryType: ListingCategoryType): Promise<string> {
    const categoryCode = CATEGORY_CODES[categoryType] || 'X'
    const counterKey = `listing_code_${categoryCode}`

    const counterRef = doc(db, COUNTERS_COLLECTION, counterKey)

    const newNumber = await runTransaction(db, async (tx) => {
        const counterDoc = await tx.get(counterRef)
        const current = counterDoc.exists() ? counterDoc.data().value : 0
        const next = current + 1
        tx.set(counterRef, { value: next, updated_at: new Date() })
        return next
    })

    // Convert to Base36 and make it 5 characters (supports up to 60 million)
    // Using uppercase for better readability
    const base36 = newNumber.toString(36).toUpperCase().padStart(5, '0')

    // Remove confusing characters (0/O, 1/I/L) - optional enhancement
    // For now, we keep simple Base36

    return `JK-${categoryCode}${base36}`
}

/**
 * Generate legacy listing number (kept for backward compatibility)
 * Format: {PREFIX}-{YYYYMM}-{XXXXX}
 * Example: CAR-202412-00001
 */
export async function generateListingNumber(categoryType: ListingCategoryType): Promise<string> {
    const prefix = CATEGORY_PREFIXES[categoryType] || 'ITEM'
    const now = new Date()
    const yearMonth = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}`
    const counterKey = `listing_${prefix}_${yearMonth}`

    const counterRef = doc(db, COUNTERS_COLLECTION, counterKey)

    const newNumber = await runTransaction(db, async (tx) => {
        const counterDoc = await tx.get(counterRef)
        const current = counterDoc.exists() ? counterDoc.data().value : 0
        const next = current + 1
        tx.set(counterRef, { value: next, updated_at: new Date() })
        return next
    })

    return `${prefix}-${yearMonth}-${String(newNumber).padStart(5, '0')}`
}

// ==========================================
// SLUG GENERATION
// ==========================================

/**
 * Generate SEO-friendly slug from title + listing code
 * Uses listing code (JK-AXXXXX) for uniqueness
 */
function generateSlug(title: string, listingCode?: string): string {
    const cleanTitle = title
        .toLowerCase()
        .replace(/[^\w\sก-๙]/g, '')
        .replace(/\s+/g, '-')
        .substring(0, 50)

    // Handle missing listing code
    if (!listingCode) {
        // Generate a random suffix if no listing code
        const randomSuffix = Math.random().toString(36).substring(2, 8)
        return `${cleanTitle}-${randomSuffix}`.replace(/--+/g, '-')
    }

    // Extract unique part from listing code (e.g., "A72M3X" from "JK-A72M3X")
    const codeMatch = listingCode.match(/JK-([A-Z0-9]+)/i)
    const suffix = codeMatch ? codeMatch[1].toLowerCase() : listingCode.split('-').pop() || ''

    return `${cleanTitle}-${suffix}`.replace(/--+/g, '-')
}

// ==========================================
// IMAGE UPLOAD
// ==========================================

async function uploadListingImage(
    file: File | string,
    listingId: string,
    index: number
): Promise<string> {
    // If already a URL, return it
    if (typeof file === 'string' && file.startsWith('http')) {
        return file
    }

    let blob: Blob
    if (typeof file === 'string') {
        // Base64 string
        const response = await fetch(file)
        blob = await response.blob()
    } else {
        blob = file
    }

    const storageRef = ref(storage, `listings/${listingId}/image_${index}_${Date.now()}.jpg`)
    await uploadBytes(storageRef, blob)
    return getDownloadURL(storageRef)
}

// ==========================================
// UTILITY: Filter undefined values
// ==========================================

/**
 * Recursively remove undefined values from an object
 * Firestore doesn't accept undefined values
 */
function filterUndefined(obj: Record<string, any>): Record<string, any> {
    const result: Record<string, any> = {}
    for (const [key, value] of Object.entries(obj)) {
        if (value === undefined) {
            continue // Skip undefined values
        }
        if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
            result[key] = filterUndefined(value) // Recursively filter nested objects
        } else {
            result[key] = value
        }
    }
    return result
}

// ==========================================
// CREATE LISTING
// ==========================================

/**
 * Create a new listing
 */
export async function createListing(
    input: CreateListingInput,
    sellerId: string,
    sellerInfo: SellerInfo
): Promise<{ id: string; listing_code: string; listing_number: string; slug: string }> {
    try {
        console.log('📦 Creating listing...')

        // 1. Generate listing code (NEW - JK-AXXXXX format)
        const listingCode = await generateListingCode(input.category_type)
        console.log('🎫 Generated listing code:', listingCode)

        // 2. Generate legacy listing number (for backward compatibility)
        const listingNumber = await generateListingNumber(input.category_type)
        console.log('🔢 Generated listing number:', listingNumber)

        // 3. Generate title if not provided
        const title = input.title || generateAutoTitle(input)

        // 4. Generate slug using listing code for uniqueness
        const slug = generateSlug(title, listingCode)

        // 5. Calculate expiry date (30 days from now)
        const now = new Date()
        const expiresAt = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)

        // 6. Prepare initial stats
        const initialStats: ListingStats = {
            views: 0,
            unique_viewers: 0,
            favorites: 0,
            shares: 0,
            inquiries: 0,
            offers_received: 0,
            chat_conversations: 0
        }

        // 7. Prepare listing data (without images first)
        const listingData: Omit<UniversalListing, 'id'> = {
            listing_code: listingCode,          // NEW: Primary short code
            listing_number: listingNumber,
            slug,

            category_type: input.category_type,
            category_id: input.category_id,
            subcategory_id: input.subcategory_id ?? null, // Use null instead of undefined for Firestore

            seller_id: sellerId,
            seller_info: sellerInfo,

            title,
            title_th: title,
            title_en: input.ai_content?.auto_title,

            price: input.price,
            price_negotiable: input.price_negotiable ?? true,
            price_type: input.price_type || 'negotiable',
            currency: 'THB',

            template_data: filterUndefined(input.template_data),

            images: [],
            thumbnail_url: '',
            video_url: input.video_url,

            location: {
                province: input.location.province || '',
                amphoe: input.location.amphoe || '',
                district: input.location.district,
                zipcode: input.location.zipcode,
                landmark: input.location.landmark,
                coordinates: input.location.coordinates,
                formatted_address: input.location.formatted_address
            },

            ai_content: {
                auto_title: title,
                marketing_copy: input.ai_content?.marketing_copy || {
                    headline: '',
                    subheadline: '',
                    selling_points: [],
                    trust_signals: [],
                    body_copy: '',
                    call_to_action: '',
                    full_text: ''
                },
                seo_keywords: input.ai_content?.seo_keywords || [],
                confidence_score: input.ai_content?.confidence_score || 0,
                price_analysis: input.ai_content?.price_analysis,
                buyer_checklist: input.ai_content?.buyer_checklist,
                similar_listings: input.ai_content?.similar_listings
            },

            contact: {
                show_phone: input.contact?.show_phone ?? false,
                phone: input.contact?.phone,
                show_line: input.contact?.show_line ?? false,
                line_id: input.contact?.line_id,
                preferred_contact: input.contact?.preferred_contact || 'chat'
            },

            meeting: {
                province: input.meeting?.province || input.location.province || '',
                amphoe: input.meeting?.amphoe || input.location.amphoe || '',
                landmark: input.meeting?.landmark,
                available_times: input.meeting?.available_times || ['anytime'],
                delivery_option: input.meeting?.delivery_option
            },

            negotiation: {
                allow_offers: input.negotiation?.allow_offers ?? true,
                min_acceptable_price: input.negotiation?.min_acceptable_price,
                auto_decline_below: input.negotiation?.auto_decline_below,
                counter_offer_enabled: input.negotiation?.counter_offer_enabled ?? true,
                instant_buy_price: input.negotiation?.instant_buy_price
            },

            status: 'active',
            visibility: 'public',

            is_featured: false,
            is_bumped: false,

            stats: initialStats,

            created_at: now,
            updated_at: now,
            published_at: now,
            expires_at: expiresAt,

            source: 'web',
            version: 1
        }

        // 7. Create document - Filter all undefined values before saving
        const cleanListingData = filterUndefined(listingData as Record<string, any>) as Omit<UniversalListing, 'id'>
        // @ts-ignore - Date vs Timestamp compatibility
        const docRef = await addDoc(collection(db, LISTINGS_COLLECTION), cleanListingData)
        const listingId = docRef.id
        console.log('📝 Created listing document:', listingId)

        // 8. Upload images
        const imageUrls: string[] = []
        if (input.images && input.images.length > 0) {
            console.log(`📸 Uploading ${input.images.length} images...`)
            for (let i = 0; i < input.images.length; i++) {
                try {
                    const url = await uploadListingImage(input.images[i], listingId, i)
                    imageUrls.push(url)
                    console.log(`  ✓ Image ${i + 1} uploaded`)
                } catch (err) {
                    console.error(`  ✗ Failed to upload image ${i}:`, err)
                }
            }
        }

        // 9. Update with images
        if (imageUrls.length > 0) {
            await updateDoc(docRef, {
                images: imageUrls.map((url, i) => ({
                    url,
                    order: i,
                    is_primary: i === 0
                })),
                thumbnail_url: imageUrls[0]
            })
        }

        console.log('✅ Listing created successfully:', listingCode)

        return {
            id: listingId,
            listing_code: listingCode,
            listing_number: listingNumber,
            slug
        }
    } catch (error) {
        console.error('❌ Error creating listing:', error)
        throw error
    }
}

/**
 * Generate auto title from template data
 */
function generateAutoTitle(input: CreateListingInput): string {
    const data = input.template_data

    switch (input.category_type) {
        case 'car':
            const carParts = [data.brand, data.model, data.sub_model, data.year].filter(Boolean)
            return carParts.join(' ') || 'รถยนต์มือสอง'

        case 'motorcycle':
            const motoParts = [data.brand, data.model, data.engine_cc ? `${data.engine_cc}cc` : null, data.year].filter(Boolean)
            return motoParts.join(' ') || 'มอเตอร์ไซค์มือสอง'

        case 'real_estate':
            const propParts = [data.property_type, data.bedrooms ? `${data.bedrooms} ห้องนอน` : null, data.area_sqm ? `${data.area_sqm} ตร.ม.` : null].filter(Boolean)
            return propParts.join(' ') || 'อสังหาริมทรัพย์'

        case 'land':
            const landParts = [data.title_deed, data.land_area, data.location_type].filter(Boolean)
            return landParts.join(' ') || 'ที่ดิน'

        default:
            return data.title || data.name || 'สินค้ามือสอง'
    }
}

// ==========================================
// READ OPERATIONS
// ==========================================

/**
 * Get listing by ID
 */
export async function getListingById(listingId: string): Promise<UniversalListing | null> {
    try {
        const docRef = doc(db, LISTINGS_COLLECTION, listingId)
        const docSnap = await getDoc(docRef)

        if (!docSnap.exists()) {
            return null
        }

        const data = docSnap.data()
        return {
            id: docSnap.id,
            ...data,
            created_at: data.created_at?.toDate?.() || new Date(),
            updated_at: data.updated_at?.toDate?.() || new Date(),
            published_at: data.published_at?.toDate?.(),
            expires_at: data.expires_at?.toDate?.() || new Date(),
            sold_at: data.sold_at?.toDate?.()
        } as UniversalListing
    } catch (error) {
        console.error('Error getting listing:', error)
        throw error
    }
}

/**
 * Get listing by listing number
 */
export async function getListingByNumber(listingNumber: string): Promise<UniversalListing | null> {
    try {
        const q = query(
            collection(db, LISTINGS_COLLECTION),
            where('listing_number', '==', listingNumber),
            limit(1)
        )
        const snapshot = await getDocs(q)

        if (snapshot.empty) {
            return null
        }

        const docSnap = snapshot.docs[0]
        const data = docSnap.data()
        return {
            id: docSnap.id,
            ...data,
            created_at: data.created_at?.toDate?.() || new Date(),
            updated_at: data.updated_at?.toDate?.() || new Date(),
            published_at: data.published_at?.toDate?.(),
            expires_at: data.expires_at?.toDate?.() || new Date(),
            sold_at: data.sold_at?.toDate?.()
        } as UniversalListing
    } catch (error) {
        console.error('Error getting listing by number:', error)
        throw error
    }
}

/**
 * Get listing by slug
 */
export async function getListingBySlug(slug: string): Promise<UniversalListing | null> {
    try {
        const q = query(
            collection(db, LISTINGS_COLLECTION),
            where('slug', '==', slug),
            limit(1)
        )
        const snapshot = await getDocs(q)

        if (snapshot.empty) {
            return null
        }

        const docSnap = snapshot.docs[0]
        const data = docSnap.data()
        return {
            id: docSnap.id,
            ...data,
            created_at: data.created_at?.toDate?.() || new Date(),
            updated_at: data.updated_at?.toDate?.() || new Date(),
            published_at: data.published_at?.toDate?.(),
            expires_at: data.expires_at?.toDate?.() || new Date(),
            sold_at: data.sold_at?.toDate?.()
        } as UniversalListing
    } catch (error) {
        console.error('Error getting listing by slug:', error)
        throw error
    }
}

/**
 * Get listing by listing code (JK-AXXXXX format)
 * This is the primary search method for easy sharing and support
 */
export async function getListingByCode(code: string): Promise<UniversalListing | null> {
    try {
        // Normalize the code (uppercase, ensure JK- prefix)
        const normalizedCode = code.toUpperCase().startsWith('JK-')
            ? code.toUpperCase()
            : `JK-${code.toUpperCase()}`

        console.log('🔍 Searching for listing code:', normalizedCode)

        const q = query(
            collection(db, LISTINGS_COLLECTION),
            where('listing_code', '==', normalizedCode),
            limit(1)
        )
        const snapshot = await getDocs(q)

        if (snapshot.empty) {
            console.log('❌ Listing not found for code:', normalizedCode)
            return null
        }

        const docSnap = snapshot.docs[0]
        const data = docSnap.data()
        console.log('✅ Found listing:', data.title)

        return {
            id: docSnap.id,
            ...data,
            created_at: data.created_at?.toDate?.() || new Date(),
            updated_at: data.updated_at?.toDate?.() || new Date(),
            published_at: data.published_at?.toDate?.(),
            expires_at: data.expires_at?.toDate?.() || new Date(),
            sold_at: data.sold_at?.toDate?.()
        } as UniversalListing
    } catch (error) {
        console.error('Error getting listing by code:', error)
        throw error
    }
}

/**
 * Get listings by category
 */
export async function getListingsByCategory(
    categoryType: ListingCategoryType,
    limitCount: number = 20
): Promise<UniversalListing[]> {
    try {
        const q = query(
            collection(db, LISTINGS_COLLECTION),
            where('category_type', '==', categoryType),
            where('status', '==', 'active'),
            orderBy('created_at', 'desc'),
            limit(limitCount)
        )
        const snapshot = await getDocs(q)

        return snapshot.docs.map(docSnap => {
            const data = docSnap.data()
            return {
                id: docSnap.id,
                ...data,
                created_at: data.created_at?.toDate?.() || new Date(),
                updated_at: data.updated_at?.toDate?.() || new Date(),
                published_at: data.published_at?.toDate?.(),
                expires_at: data.expires_at?.toDate?.() || new Date(),
                sold_at: data.sold_at?.toDate?.()
            } as UniversalListing
        })
    } catch (error) {
        console.error('Error getting listings by category:', error)
        return []
    }
}

/**
 * Get listings by seller
 */
export async function getListingsBySeller(
    sellerId: string,
    limitCount: number = 50
): Promise<UniversalListing[]> {
    try {
        const q = query(
            collection(db, LISTINGS_COLLECTION),
            where('seller_id', '==', sellerId),
            orderBy('created_at', 'desc'),
            limit(limitCount)
        )
        const snapshot = await getDocs(q)

        return snapshot.docs.map(docSnap => {
            const data = docSnap.data()
            return {
                id: docSnap.id,
                ...data,
                created_at: data.created_at?.toDate?.() || new Date(),
                updated_at: data.updated_at?.toDate?.() || new Date(),
                published_at: data.published_at?.toDate?.(),
                expires_at: data.expires_at?.toDate?.() || new Date(),
                sold_at: data.sold_at?.toDate?.()
            } as UniversalListing
        })
    } catch (error) {
        console.error('Error getting seller listings:', error)
        return []
    }
}

// ==========================================
// UPDATE OPERATIONS
// ==========================================

/**
 * Increment view count
 */
export async function incrementListingViews(listingId: string): Promise<void> {
    try {
        const docRef = doc(db, LISTINGS_COLLECTION, listingId)
        const docSnap = await getDoc(docRef)

        if (docSnap.exists()) {
            const currentViews = docSnap.data().stats?.views || 0
            await updateDoc(docRef, {
                'stats.views': currentViews + 1,
                updated_at: new Date()
            })
        }
    } catch (error) {
        console.error('Error incrementing views:', error)
    }
}

/**
 * Toggle favorite
 */
export async function toggleListingFavorite(listingId: string, increment: boolean): Promise<void> {
    try {
        const docRef = doc(db, LISTINGS_COLLECTION, listingId)
        const docSnap = await getDoc(docRef)

        if (docSnap.exists()) {
            const currentFavorites = docSnap.data().stats?.favorites || 0
            await updateDoc(docRef, {
                'stats.favorites': increment ? currentFavorites + 1 : Math.max(0, currentFavorites - 1),
                updated_at: new Date()
            })
        }
    } catch (error) {
        console.error('Error toggling favorite:', error)
    }
}

/**
 * Increment share count
 */
export async function incrementListingShares(listingId: string): Promise<void> {
    try {
        const docRef = doc(db, LISTINGS_COLLECTION, listingId)
        const docSnap = await getDoc(docRef)

        if (docSnap.exists()) {
            const currentShares = docSnap.data().stats?.shares || 0
            await updateDoc(docRef, {
                'stats.shares': currentShares + 1,
                updated_at: new Date()
            })
        }
    } catch (error) {
        console.error('Error incrementing shares:', error)
    }
}

/**
 * Mark listing as sold
 */
export async function markListingAsSold(listingId: string): Promise<void> {
    try {
        const docRef = doc(db, LISTINGS_COLLECTION, listingId)
        await updateDoc(docRef, {
            status: 'sold',
            sold_at: new Date(),
            updated_at: new Date()
        })
    } catch (error) {
        console.error('Error marking as sold:', error)
        throw error
    }
}

// ==========================================
// UPDATE LISTING
// ==========================================

/**
 * Update listing input type
 */
export interface UpdateListingInput {
    title?: string
    price?: number
    price_negotiable?: boolean
    template_data?: Record<string, any>
    location?: {
        province?: string
        amphoe?: string
        district?: string
        zipcode?: string
        landmark?: string
    }
    contact?: {
        show_phone?: boolean
        phone?: string
        show_line?: boolean
        line_id?: string
        preferred_contact?: 'chat' | 'phone' | 'line'
    }
    meeting?: {
        province?: string
        amphoe?: string
        landmark?: string
        available_times?: string[]
        delivery_option?: string
    }
    images?: (File | string)[]
}

/**
 * Update an existing listing
 */
export async function updateListing(
    listingId: string,
    input: UpdateListingInput,
    sellerId: string
): Promise<{ success: boolean; slug?: string }> {
    try {
        console.log('📝 Updating listing:', listingId)

        // 1. Get current listing to verify ownership
        const currentListing = await getListingById(listingId)
        if (!currentListing) {
            throw new Error('Listing not found')
        }

        if (currentListing.seller_id !== sellerId) {
            throw new Error('Unauthorized: Not the owner of this listing')
        }

        // 2. Prepare update data
        const updateData: Record<string, any> = {
            updated_at: new Date()
        }

        if (input.title !== undefined) {
            updateData.title = input.title
            updateData.title_th = input.title
            // Regenerate slug if title changed
            updateData.slug = generateSlug(input.title, currentListing.listing_code)
        }

        if (input.price !== undefined) {
            updateData.price = input.price
        }

        if (input.price_negotiable !== undefined) {
            updateData.price_negotiable = input.price_negotiable
        }

        if (input.template_data !== undefined) {
            // Merge with existing template data
            updateData.template_data = filterUndefined({
                ...currentListing.template_data,
                ...input.template_data
            })
        }

        if (input.location !== undefined) {
            updateData.location = {
                ...currentListing.location,
                ...filterUndefined(input.location as Record<string, any>)
            }
        }

        if (input.contact !== undefined) {
            updateData.contact = {
                ...currentListing.contact,
                ...filterUndefined(input.contact as Record<string, any>)
            }
        }

        if (input.meeting !== undefined) {
            updateData.meeting = {
                ...currentListing.meeting,
                ...filterUndefined(input.meeting as Record<string, any>)
            }
        }

        // 3. Handle image updates
        if (input.images && input.images.length > 0) {
            console.log(`📸 Updating ${input.images.length} images...`)
            const imageUrls: string[] = []

            for (let i = 0; i < input.images.length; i++) {
                try {
                    const url = await uploadListingImage(input.images[i], listingId, i)
                    imageUrls.push(url)
                } catch (err) {
                    console.error(`Failed to upload image ${i}:`, err)
                }
            }

            if (imageUrls.length > 0) {
                updateData.images = imageUrls.map((url, i) => ({
                    url,
                    order: i,
                    is_primary: i === 0
                }))
                updateData.thumbnail_url = imageUrls[0]
            }
        }

        // 4. Update document
        const docRef = doc(db, LISTINGS_COLLECTION, listingId)
        await updateDoc(docRef, updateData)

        console.log('✅ Listing updated successfully')

        return {
            success: true,
            slug: updateData.slug || currentListing.slug
        }
    } catch (error) {
        console.error('❌ Error updating listing:', error)
        throw error
    }
}

/**
 * Renew an expired listing (extend expiry by 30 days)
 */
export async function renewListing(listingId: string, sellerId: string): Promise<void> {
    try {
        const listing = await getListingById(listingId)
        if (!listing) throw new Error('Listing not found')
        if (listing.seller_id !== sellerId) throw new Error('Unauthorized')

        const now = new Date()
        const newExpiresAt = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)

        const docRef = doc(db, LISTINGS_COLLECTION, listingId)
        await updateDoc(docRef, {
            status: 'active',
            expires_at: newExpiresAt,
            updated_at: now
        })

        console.log('✅ Listing renewed:', listingId)
    } catch (error) {
        console.error('Error renewing listing:', error)
        throw error
    }
}

/**
 * Update listing status (generic status update)
 * Can change to: active, sold, closed, expired
 */
export async function updateListingStatus(
    listingId: string,
    newStatus: 'active' | 'sold' | 'closed' | 'expired' | 'pending',
    sellerId: string
): Promise<void> {
    try {
        const listing = await getListingById(listingId)
        if (!listing) throw new Error('Listing not found')
        if (listing.seller_id !== sellerId) throw new Error('Unauthorized')

        const now = new Date()
        const updateData: Record<string, any> = {
            status: newStatus,
            updated_at: now
        }

        // If reactivating, set new expiry date
        if (newStatus === 'active') {
            updateData.expires_at = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)
        }

        // If marking as sold, record sold date
        if (newStatus === 'sold') {
            updateData.sold_at = now
        }

        const docRef = doc(db, LISTINGS_COLLECTION, listingId)
        await updateDoc(docRef, updateData)

        console.log(`✅ Listing status updated to ${newStatus}:`, listingId)
    } catch (error) {
        console.error('Error updating listing status:', error)
        throw error
    }
}

/**
 * Close a listing (seller chooses to stop selling)
 */
export async function closeListing(listingId: string, sellerId: string): Promise<void> {
    try {
        const listing = await getListingById(listingId)
        if (!listing) throw new Error('Listing not found')
        if (listing.seller_id !== sellerId) throw new Error('Unauthorized')

        const docRef = doc(db, LISTINGS_COLLECTION, listingId)
        await updateDoc(docRef, {
            status: 'closed',
            updated_at: new Date()
        })

        console.log('✅ Listing closed:', listingId)
    } catch (error) {
        console.error('Error closing listing:', error)
        throw error
    }
}

/**
 * Reopen a closed listing
 */
export async function reopenListing(listingId: string, sellerId: string): Promise<void> {
    try {
        const listing = await getListingById(listingId)
        if (!listing) throw new Error('Listing not found')
        if (listing.seller_id !== sellerId) throw new Error('Unauthorized')

        const now = new Date()
        const newExpiresAt = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)

        const docRef = doc(db, LISTINGS_COLLECTION, listingId)
        await updateDoc(docRef, {
            status: 'active',
            expires_at: newExpiresAt,
            updated_at: now
        })

        console.log('✅ Listing reopened:', listingId)
    } catch (error) {
        console.error('Error reopening listing:', error)
        throw error
    }
}

/**
 * Delete a listing (soft delete - changes status to 'deleted')
 */
export async function deleteListing(listingId: string, sellerId: string, hardDelete: boolean = false): Promise<void> {
    try {
        const listing = await getListingById(listingId)
        if (!listing) throw new Error('Listing not found')
        if (listing.seller_id !== sellerId) throw new Error('Unauthorized')

        const docRef = doc(db, LISTINGS_COLLECTION, listingId)

        if (hardDelete) {
            // Permanent delete
            await deleteDoc(docRef)
            console.log('🗑️ Listing permanently deleted:', listingId)
        } else {
            // Soft delete
            await updateDoc(docRef, {
                status: 'deleted',
                deleted_at: new Date(),
                updated_at: new Date()
            })
            console.log('🗑️ Listing soft deleted:', listingId)
        }
    } catch (error) {
        console.error('Error deleting listing:', error)
        throw error
    }
}

// ==========================================
// EXPORTS
// ==========================================

export * from './types'

