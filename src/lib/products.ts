/**
 * JaiKod Products Service
 * 
 * CRUD operations for products with Firebase Firestore and Storage
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
    serverTimestamp,
    Timestamp
} from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage'
import { db, storage } from './firebase'
import { Product } from '@/types'
import { CATEGORIES } from '@/constants/categories'

const PRODUCTS_COLLECTION = 'products'

// ==========================================
// TYPES
// ==========================================

export interface CreateProductInput {
    title: string
    description: string
    category_id: string
    price: number
    original_price?: number
    price_type: 'fixed' | 'negotiable' | 'auction'
    condition: string
    usage_detail?: string
    stock: number
    tags?: string[]

    // Address
    province: string
    amphoe: string
    district: string
    zipcode: string

    // Shipping
    can_ship: boolean
    can_pickup: boolean
    shipping_fee?: number
    shipping_options?: any[]

    // Media
    images: File[] | string[]  // File objects or base64 strings
}

export interface ProductDocument extends Omit<Product, 'id' | 'created_at' | 'updated_at' | 'seller_id'> {
    created_at: Timestamp
    updated_at: Timestamp
    seller_id: string
}

// ==========================================
// HELPER FUNCTIONS
// ==========================================

// Generate slug from title
function generateSlug(title: string, id: string): string {
    const slug = title
        .toLowerCase()
        .replace(/[^\w\sก-๙]/g, '')
        .replace(/\s+/g, '-')
        .substring(0, 50)
    return `${slug}-${id.substring(0, 8)}`
}

// Upload image to Firebase Storage
async function uploadImage(file: File | string, productId: string, index: number): Promise<string> {
    // If it's already a URL, return it
    if (typeof file === 'string' && file.startsWith('http')) {
        return file
    }

    // If it's a base64 string, convert to blob
    let blob: Blob
    if (typeof file === 'string') {
        // Base64 string
        const response = await fetch(file)
        blob = await response.blob()
    } else {
        // File object
        blob = file
    }

    const storageRef = ref(storage, `products/${productId}/image_${index}_${Date.now()}.jpg`)
    await uploadBytes(storageRef, blob)
    return getDownloadURL(storageRef)
}

// Delete all images for a product
async function deleteProductImages(productId: string, imageUrls: string[]): Promise<void> {
    for (const url of imageUrls) {
        try {
            // Extract path from URL
            const storageRef = ref(storage, url)
            await deleteObject(storageRef)
        } catch (error) {
            console.error('Error deleting image:', error)
        }
    }
}

// ==========================================
// CRUD OPERATIONS
// ==========================================

/**
 * Create a new product
 */
export async function createProduct(
    input: CreateProductInput,
    sellerId: string,
    sellerName: string,
    sellerAvatar?: string
): Promise<string> {
    try {
        console.log('Starting product creation...')

        // 1. Create product document first with basic info
        const now = new Date()

        const productData = {
            title: input.title,
            description: input.description,
            category_id: parseInt(input.category_id) || input.category_id,
            price: input.price,
            original_price: input.original_price || null,
            price_type: input.price_type || 'fixed',

            condition: input.condition,
            usage_detail: input.usage_detail || '',
            stock: input.stock || 1,
            tags: input.tags || [],

            location_province: input.province,
            location_amphoe: input.amphoe,
            location_district: input.district,
            location_zipcode: input.zipcode,

            can_ship: input.can_ship,
            can_pickup: input.can_pickup,
            shipping_fee: input.shipping_fee || 0,
            shipping_options: input.shipping_options || [],

            seller_id: sellerId,
            seller_name: sellerName,
            seller_avatar: sellerAvatar || '',

            status: 'active',
            views_count: 0,
            favorites_count: 0,
            sold_count: 0,

            images: [],
            thumbnail_url: '',
            slug: '',
            created_at: now,
            updated_at: now
        }

        console.log('Sending to Firestore (addDoc)...', productData)
        // @ts-ignore - ignore strict type check for Date vs Timestamp for now to unblock
        const productRef = await addDoc(collection(db, PRODUCTS_COLLECTION), productData)
        const productId = productRef.id
        console.log('Product document created with ID:', productId)

        // 2. Upload images
        const imageUrls: string[] = []
        try {
            console.log(`Uploading ${input.images.length} images...`)

            // Upload sequentially to maintain order and reduce parallel connection issues
            for (let i = 0; i < input.images.length; i++) {
                try {
                    const url = await uploadImage(input.images[i], productId, i)
                    imageUrls.push(url)
                    console.log(`Image ${i + 1} uploaded successfully`)
                } catch (uploadErr) {
                    console.error(`Failed to upload image ${i}:`, uploadErr)
                    // Continue with other images even if one fails
                }
            }
        } catch (imageErr) {
            console.error('Error during image upload process:', imageErr)
        }

        // 3. Update product with image URLs and slug
        const slug = generateSlug(input.title, productId)
        await updateDoc(productRef, {
            images: imageUrls.map((url, i) => ({ url, order: i })),
            thumbnail_url: imageUrls[0] || '',
            slug: slug
        })

        console.log('Product finalized successfully:', productId)
        return productId
    } catch (error) {
        console.error('Error in createProduct:', error)
        throw error
    }
}

/**
 * Get product by ID
 */
export async function getProductById(productId: string): Promise<Product | null> {
    try {
        const docRef = doc(db, PRODUCTS_COLLECTION, productId)
        const docSnap = await getDoc(docRef)

        if (!docSnap.exists()) {
            return null
        }

        const data = docSnap.data()
        const category = CATEGORIES.find(c => c.id === data.category_id)

        return {
            id: docSnap.id,
            ...data,
            category: category || null,
            created_at: data.created_at?.toDate?.() || new Date(),
            updated_at: data.updated_at?.toDate?.() || new Date(),
        } as unknown as Product
    } catch (error) {
        console.error('Error getting product:', error)
        throw error
    }
}

/**
 * Get product by slug
 */
export async function getProductBySlug(slug: string): Promise<Product | null> {
    try {
        const q = query(
            collection(db, PRODUCTS_COLLECTION),
            where('slug', '==', slug),
            limit(1)
        )
        const snapshot = await getDocs(q)

        if (snapshot.empty) {
            return null
        }

        const docSnap = snapshot.docs[0]
        const data = docSnap.data()
        const category = CATEGORIES.find(c => c.id === data.category_id)

        return {
            id: docSnap.id,
            ...data,
            category: category || null,
            created_at: data.created_at?.toDate?.() || new Date(),
            updated_at: data.updated_at?.toDate?.() || new Date(),
        } as unknown as Product
    } catch (error) {
        console.error('Error getting product by slug:', error)
        throw error
    }
}

/**
 * Get products by seller ID
 */
export async function getProductsBySeller(sellerId: string): Promise<Product[]> {
    try {
        const q = query(
            collection(db, PRODUCTS_COLLECTION),
            where('seller_id', '==', sellerId),
            orderBy('created_at', 'desc')
        )
        const snapshot = await getDocs(q)

        return snapshot.docs.map(docSnap => {
            const data = docSnap.data()
            const category = CATEGORIES.find(c => c.id === data.category_id)
            return {
                id: docSnap.id,
                ...data,
                category: category || null,
                created_at: data.created_at?.toDate?.() || new Date(),
                updated_at: data.updated_at?.toDate?.() || new Date(),
            } as unknown as Product
        })
    } catch (error) {
        console.error('Error getting seller products:', error)
        throw error
    }
}

/**
 * Get all active products
 */
export async function getAllProducts(limitCount: number = 50): Promise<Product[]> {
    try {
        const q = query(
            collection(db, PRODUCTS_COLLECTION),
            where('status', '==', 'active'),
            orderBy('created_at', 'desc'),
            limit(limitCount)
        )
        const snapshot = await getDocs(q)

        return snapshot.docs.map(docSnap => {
            const data = docSnap.data()
            const category = CATEGORIES.find(c => c.id === data.category_id)
            return {
                id: docSnap.id,
                ...data,
                category: category || null,
                created_at: data.created_at?.toDate?.() || new Date(),
                updated_at: data.updated_at?.toDate?.() || new Date(),
            } as unknown as Product
        })
    } catch (error) {
        console.error('Error getting all products:', error)
        return []
    }
}

/**
 * Search products
 */
export async function searchProducts(searchQuery: string): Promise<Product[]> {
    // Note: Firestore doesn't support full-text search natively
    try {
        const allProducts = await getAllProducts(100)
        const lowerQuery = searchQuery.toLowerCase()

        return allProducts.filter(p =>
            p.title.toLowerCase().includes(lowerQuery) ||
            p.description.toLowerCase().includes(lowerQuery)
        )
    } catch (error) {
        console.error('Error searching products:', error)
        throw error
    }
}

export async function updateProduct(
    productId: string,
    updates: Partial<CreateProductInput>
): Promise<void> {
    try {
        const docRef = doc(db, PRODUCTS_COLLECTION, productId)
        await updateDoc(docRef, {
            ...updates,
            updated_at: serverTimestamp()
        })
        console.log('Product updated:', productId)
    } catch (error) {
        console.error('Error updating product:', error)
        throw error
    }
}

/**
 * Delete product
 */
export async function deleteProduct(productId: string): Promise<void> {
    try {
        // Get product to delete images
        const product = await getProductById(productId)
        if (product && product.images) {
            await deleteProductImages(productId, product.images.map(i => i.url))
        }

        // Delete document
        const docRef = doc(db, PRODUCTS_COLLECTION, productId)
        await deleteDoc(docRef)
        console.log('Product deleted:', productId)
    } catch (error) {
        console.error('Error deleting product:', error)
        throw error
    }
}

/**
 * Increment view count
 */
export async function incrementViewCount(productId: string): Promise<void> {
    try {
        const docRef = doc(db, PRODUCTS_COLLECTION, productId)
        const docSnap = await getDoc(docRef)
        if (docSnap.exists()) {
            const currentViews = docSnap.data().views_count || 0
            await updateDoc(docRef, {
                views_count: currentViews + 1
            })
        }
    } catch (error) {
        console.error('Error incrementing view count:', error)
    }
}

/**
 * Toggle favorite
 */
export async function toggleFavorite(productId: string, increment: boolean): Promise<void> {
    try {
        const docRef = doc(db, PRODUCTS_COLLECTION, productId)
        const docSnap = await getDoc(docRef)
        if (docSnap.exists()) {
            const currentFavorites = docSnap.data().favorites_count || 0
            await updateDoc(docRef, {
                favorites_count: increment ? currentFavorites + 1 : Math.max(0, currentFavorites - 1)
            })
        }
    } catch (error) {
        console.error('Error toggling favorite:', error)
    }
}

/**
 * Get best selling products
 */
export async function getBestSellingProducts(limitCount: number = 10): Promise<Product[]> {
    try {
        const q = query(
            collection(db, PRODUCTS_COLLECTION),
            where('status', '==', 'active'),
            orderBy('sold_count', 'desc'),
            limit(limitCount)
        )
        const snapshot = await getDocs(q)
        return snapshot.docs.map(docSnap => {
            const data = docSnap.data()
            const category = CATEGORIES.find(c => c.id === data.category_id)
            return {
                id: docSnap.id,
                ...data,
                category: category || null,
                created_at: data.created_at?.toDate?.() || new Date(),
                updated_at: data.updated_at?.toDate?.() || new Date(),
            } as unknown as Product
        })
    } catch (error) {
        console.error('Error getting best selling products:', error)
        return []
    }
}

/**
 * Get products by IDs
 */
export async function getProductsByIds(productIds: string[]): Promise<Product[]> {
    if (!productIds.length) return []
    try {
        // Firestore 'in' query only supports up to 10 items
        const chunks = []
        for (let i = 0; i < productIds.length; i += 10) {
            chunks.push(productIds.slice(i, i + 10))
        }

        const products: Product[] = []
        for (const chunk of chunks) {
            const q = query(
                collection(db, PRODUCTS_COLLECTION),
                where('__name__', 'in', chunk)
            )
            const snapshot = await getDocs(q)
            snapshot.docs.forEach(docSnap => {
                const data = docSnap.data()
                const category = CATEGORIES.find(c => c.id === data.category_id)
                products.push({
                    id: docSnap.id,
                    ...data,
                    category: category || null,
                    created_at: data.created_at?.toDate?.() || new Date(),
                    updated_at: data.updated_at?.toDate?.() || new Date(),
                } as unknown as Product)
            })
        }
        return products
    } catch (error) {
        console.error('Error getting products by IDs:', error)
        return []
    }
}
export async function getTrendingProducts(limitCount: number = 10): Promise<Product[]> {
    try {
        const q = query(
            collection(db, PRODUCTS_COLLECTION),
            where('status', '==', 'active'),
            orderBy('views_count', 'desc'),
            limit(limitCount)
        )
        const snapshot = await getDocs(q)
        return snapshot.docs.map(docSnap => {
            const data = docSnap.data()
            const category = CATEGORIES.find(c => c.id === data.category_id)
            return {
                id: docSnap.id,
                ...data,
                category: category || null,
                created_at: data.created_at?.toDate?.() || new Date(),
                updated_at: data.updated_at?.toDate?.() || new Date(),
            } as unknown as Product
        })
    } catch (error) {
        console.error('Error getting trending products:', error)
        return []
    }
}

export async function deleteProductImage(productId: string, imageUrl: string): Promise<void> {
    try {
        const product = await getProductById(productId)
        if (!product) throw new Error('Product not found')

        // 1. Delete from Storage
        try {
            const storageRef = ref(storage, imageUrl)
            await deleteObject(storageRef)
        } catch (error: any) {
            // Check if object not found, ignore if so (maybe already deleted)
            if (error.code !== 'storage/object-not-found') {
                console.error('Error deleting image from storage:', error)
                // We typically continue to remove it from DB anyway to fix consistency
            }
        }

        // 2. Remove from images array
        const newImages = product.images.filter(img => img.url !== imageUrl)

        // 3. Update thumbnail if needed
        let newThumbnail = product.thumbnail_url
        if (product.thumbnail_url === imageUrl) {
            newThumbnail = newImages.length > 0 ? newImages[0].url : ''
        }

        // Re-index order
        const orderedImages = newImages.map((img, index) => ({
            ...img,
            order: index
        }))

        // 4. Update Firestore
        const docRef = doc(db, PRODUCTS_COLLECTION, productId)
        await updateDoc(docRef, {
            images: orderedImages,
            thumbnail_url: newThumbnail,
            updated_at: serverTimestamp()
        })

    } catch (error) {
        console.error('Error deleting product image:', error)
        throw error
    }
}
