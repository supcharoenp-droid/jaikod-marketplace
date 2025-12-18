import {
    collection,
    doc,
    addDoc,
    deleteDoc,
    query,
    where,
    getDocs,
    serverTimestamp
} from 'firebase/firestore'
import { db } from './firebase'

const FAVORITES_COLLECTION = 'favorites'

/**
 * Check if a product is in user's favorites
 */
export async function isFavorite(userId: string, productId: string): Promise<boolean> {
    try {
        const q = query(
            collection(db, FAVORITES_COLLECTION),
            where('user_id', '==', userId),
            where('product_id', '==', productId)
        )
        const snapshot = await getDocs(q)
        return !snapshot.empty
    } catch (error) {
        console.error('Error checking favorite:', error)
        return false
    }
}

/**
 * Add a product to user's favorites
 */
export async function addToFavorites(userId: string, productId: string): Promise<string | null> {
    try {
        // Check if already favorited
        const alreadyFavorited = await isFavorite(userId, productId)
        if (alreadyFavorited) {
            console.log('Product already in favorites')
            return null
        }

        // Add to favorites
        const docRef = await addDoc(collection(db, FAVORITES_COLLECTION), {
            user_id: userId,
            product_id: productId,
            created_at: serverTimestamp()
        })

        return docRef.id
    } catch (error) {
        console.error('Error adding to favorites:', error)
        throw error
    }
}

/**
 * Remove a product from user's favorites
 */
export async function removeFromFavorites(userId: string, productId: string): Promise<boolean> {
    try {
        const q = query(
            collection(db, FAVORITES_COLLECTION),
            where('user_id', '==', userId),
            where('product_id', '==', productId)
        )
        const snapshot = await getDocs(q)

        if (snapshot.empty) {
            console.log('Favorite not found')
            return false
        }

        // Delete all matching documents (should only be one)
        const deletePromises = snapshot.docs.map(doc => deleteDoc(doc.ref))
        await Promise.all(deletePromises)

        return true
    } catch (error) {
        console.error('Error removing from favorites:', error)
        throw error
    }
}

/**
 * Toggle favorite status (add if not favorited, remove if favorited)
 */
export async function toggleFavorite(userId: string, productId: string): Promise<boolean> {
    try {
        const favorited = await isFavorite(userId, productId)

        if (favorited) {
            await removeFromFavorites(userId, productId)
            return false // Now not favorited
        } else {
            await addToFavorites(userId, productId)
            return true // Now favorited
        }
    } catch (error) {
        console.error('Error toggling favorite:', error)
        throw error
    }
}

/**
 * Get all favorite product IDs for a user
 */
export async function getFavoriteProductIds(userId: string): Promise<string[]> {
    try {
        const q = query(
            collection(db, FAVORITES_COLLECTION),
            where('user_id', '==', userId)
        )
        const snapshot = await getDocs(q)

        return snapshot.docs.map(doc => doc.data().product_id)
    } catch (error) {
        console.error('Error getting favorite product IDs:', error)
        return []
    }
}

/**
 * Get favorites count for a user
 */
export async function getFavoritesCount(userId: string): Promise<number> {
    try {
        const q = query(
            collection(db, FAVORITES_COLLECTION),
            where('user_id', '==', userId)
        )
        const snapshot = await getDocs(q)

        return snapshot.size
    } catch (error) {
        console.error('Error getting favorites count:', error)
        return 0
    }
}
