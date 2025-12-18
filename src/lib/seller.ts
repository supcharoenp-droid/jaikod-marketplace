import {
    collection,
    doc,
    getDoc,
    setDoc,
    updateDoc,
    query,
    where,
    getDocs,
    serverTimestamp
} from 'firebase/firestore'
import { db } from './firebase'
import { SellerProfile } from '@/types'

const SELLER_COLLECTION = 'seller_profiles'

export async function getSellerProfile(userId: string): Promise<SellerProfile | null> {
    try {
        const q = query(collection(db, SELLER_COLLECTION), where('user_id', '==', userId))
        const querySnapshot = await getDocs(q)

        if (querySnapshot.empty) return null

        const docSnap = querySnapshot.docs[0]
        return { id: docSnap.id, ...docSnap.data() } as SellerProfile
    } catch (error) {
        console.error('Error getting seller profile:', error)
        return null
    }
}

export async function createSellerProfile(
    userId: string,
    data: {
        shop_name: string,
        shop_description: string,
        shop_description_th?: string, // Added
        shop_description_en?: string, // Added
        shop_logo?: string,
        is_verified?: boolean, // Added
        address: any
    }
): Promise<string> {
    try {
        // Generate a slug from shop name
        const slug = data.shop_name
            .toLowerCase()
            .replace(/[^\w\sก-๙]/g, '')
            .replace(/\s+/g, '-') + '-' + Math.random().toString(36).substring(2, 6)

        const newProfileRef = doc(collection(db, SELLER_COLLECTION))
        const profileId = newProfileRef.id

        const profileData = {
            owner_id: userId, // Match Store interface
            user_id: userId, // Legacy support
            name: data.shop_name, // Match Store interface
            shop_name: data.shop_name, // Legacy
            slug: slug, // Match Store interface
            shop_slug: slug, // Legacy
            description: data.shop_description, // Match Store interface
            description_th: data.shop_description_th || '', // Localization
            description_en: data.shop_description_en || '', // Localization
            shop_description: data.shop_description, // Legacy
            logo_url: data.shop_logo || '', // Match Store interface
            shop_logo: data.shop_logo || '', // Legacy

            // Default Values
            type: 'general',
            onboarding_progress: 1, // Start at step 1
            rating_avg: 0,
            sales_count: 0,
            trust_score: data.is_verified ? 80 : 50, // Bonus for verification
            followers_count: 0,
            response_rate: 100,
            verified_status: data.is_verified ? 'verified' : 'unverified',
            seller_level: 'new',
            badges: [],

            created_at: serverTimestamp(),
            updated_at: serverTimestamp(),
            location: {
                formatted_address: data.address ? `${data.address.detail} ${data.address.subdistrict} ${data.address.district} ${data.address.province} ${data.address.zipcode}` : '',
                province: data.address?.province || '',
                district: data.address?.district || ''
            },
            address: data.address // Legacy
        }

        await setDoc(newProfileRef, profileData)

        return profileId
    } catch (error) {
        console.error('Error creating seller profile:', error)
        throw error
    }
}

export async function checkShopNameAvailability(name: string): Promise<boolean> {
    const q = query(collection(db, SELLER_COLLECTION), where('shop_name', '==', name))
    const snapshot = await getDocs(q)
    return snapshot.empty
}

export async function getSellerProfileBySlug(slug: string): Promise<SellerProfile | null> {
    try {
        const q = query(collection(db, SELLER_COLLECTION), where('shop_slug', '==', slug))
        const snapshot = await getDocs(q)

        if (snapshot.empty) return null

        const docSnap = snapshot.docs[0]
        return { id: docSnap.id, ...docSnap.data() } as SellerProfile
    } catch (error) {
        console.error('Error getting seller profile by slug:', error)
        return null
    }
}

export async function updateSellerProfile(
    userId: string,
    data: Partial<SellerProfile>
): Promise<boolean> {
    try {
        const q = query(collection(db, SELLER_COLLECTION), where('user_id', '==', userId))
        const querySnapshot = await getDocs(q)

        if (querySnapshot.empty) return false

        const docRef = doc(db, SELLER_COLLECTION, querySnapshot.docs[0].id)

        const updateData = {
            ...data,
            updated_at: serverTimestamp()
        }

        await updateDoc(docRef, updateData)
        return true
    } catch (error) {
        console.error('Error updating seller profile:', error)
        return false
    }
}
