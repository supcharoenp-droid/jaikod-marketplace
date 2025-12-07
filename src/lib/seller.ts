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
            user_id: userId,
            shop_name: data.shop_name,
            shop_slug: slug,
            shop_description: data.shop_description,
            // Default Values
            rating_score: 0,
            rating_count: 0,
            trust_score: 50, // Start with neutral trust
            follower_count: 0,
            response_rate: 100,
            is_verified_seller: false,
            created_at: serverTimestamp(),
            updated_at: serverTimestamp(),
            address: data.address
        }

        await setDoc(newProfileRef, profileData)

        // Also update user role to seller
        // Note: In a real app, you might want to wait for verification first
        // But for this MVP, we instantly promote them
        // TODO: Update user collection if you have one linked

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
