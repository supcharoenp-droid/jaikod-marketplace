/**
 * Product Service - Rebuilt for stability
 * Handles all product CRUD operations with Firebase
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
    Timestamp
} from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage'
import { db, storage } from '@/lib/firebase'
import type { ProductFormData, FirebaseProduct, ProductWithId, ProductImage } from '@/types/product'

const PRODUCTS_COLLECTION = 'products'

// ==========================================
// HELPER FUNCTIONS
// ==========================================

/**
 * Generate SEO-friendly slug from title
 */
function generateSlug(title: string, id: string): string {
    const slug = title
        .toLowerCase()
        .replace(/[^\w\sก-๙]/g, '')
        .replace(/\s+/g, '-')
        .substring(0, 50)
    return `${slug}-${id}`  // Use full ID
}

/**
 * Upload single image to Firebase Storage
 * Supports both File objects and base64 strings
 */
async function uploadProductImage(
    file: File | string,
    productId: string,
    index: number
): Promise<string> {
    try {
        console.log(`[Upload] Starting upload for image ${index + 1}`)

        // If already a URL, return it
        if (typeof file === 'string' && file.startsWith('http')) {
            console.log(`[Upload] Image ${index + 1} is already a URL`)
            return file
        }

        let blob: Blob

        if (typeof file === 'string') {
            // Base64 string - convert to blob
            console.log(`[Upload] Converting base64 to blob for image ${index + 1}`)
            const response = await fetch(file)
            blob = await response.blob()
        } else {
            // File object
            console.log(`[Upload] Using File object for image ${index + 1}`)
            blob = file
        }

        // Create storage reference
        const timestamp = Date.now()
        const fileName = `image_${index}_${timestamp}.jpg`
        const storagePath = `products/${productId}/${fileName}`
        const storageRef = ref(storage, storagePath)

        console.log(`[Upload] Uploading to: ${storagePath}`)

        // Upload to Firebase Storage
        await uploadBytes(storageRef, blob)

        // Get download URL
        const downloadURL = await getDownloadURL(storageRef)

        console.log(`[Upload] Image ${index + 1} uploaded successfully`)
        return downloadURL

    } catch (error) {
        console.error(`[Upload] Failed to upload image ${index + 1}:`, error)
        throw new Error(`Failed to upload image ${index + 1}: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
}

/**
 * Delete all images for a product
 */
async function deleteProductImages(imageUrls: string[]): Promise<void> {
    const deletePromises = imageUrls.map(async (url) => {
        try {
            const storageRef = ref(storage, url)
            await deleteObject(storageRef)
            console.log(`[Delete] Deleted image: ${url}`)
        } catch (error) {
            console.error(`[Delete] Failed to delete image ${url}:`, error)
        }
    })

    await Promise.all(deletePromises)
}

// ==========================================
// CRUD OPERATIONS
// ==========================================

/**
 * Create new product
 * Returns the product ID
 */
export async function createProduct(
    formData: ProductFormData,
    sellerId: string,
    sellerName: string
): Promise<string> {
    console.log('[CreateProduct] Starting product creation...')
    console.log('[CreateProduct] Seller:', sellerId, sellerName)

    try {
        // Step 1: Validate input
        if (!formData.title || !formData.description) {
            throw new Error('Title and description are required')
        }

        if (!formData.images || formData.images.length === 0) {
            throw new Error('At least one image is required')
        }

        if (!sellerId) {
            throw new Error('User must be logged in')
        }

        // Step 2: Create initial product document
        const now = new Date()

        const productData: Omit<FirebaseProduct, 'images' | 'thumbnail_url' | 'slug'> = {
            title: formData.title.trim(),
            description: formData.description.trim(),
            category_id: parseInt(formData.category_id),
            price: formData.price,
            original_price: formData.original_price || null,
            condition: formData.condition,
            location_province: formData.province,
            location_amphoe: formData.amphoe,
            location_district: formData.district,
            location_zipcode: formData.zipcode,
            can_ship: formData.can_ship,
            can_pickup: formData.can_pickup,
            seller_id: sellerId,
            seller_name: sellerName,
            status: 'active',
            views_count: 0,
            favorites_count: 0,
            sold_count: 0,
            is_trending: false,
            is_best_seller: false,
            created_at: now,
            updated_at: now
        }

        console.log('[CreateProduct] Creating Firestore document...')

        // @ts-ignore - Firestore will handle Date conversion
        const docRef = await addDoc(collection(db, PRODUCTS_COLLECTION), productData)
        const productId = docRef.id

        console.log(`[CreateProduct] Document created with ID: ${productId}`)

        // Step 3: Upload images
        console.log(`[CreateProduct] Uploading ${formData.images.length} images...`)

        const uploadedImages: ProductImage[] = []

        for (let i = 0; i < formData.images.length; i++) {
            try {
                const imageUrl = await uploadProductImage(formData.images[i], productId, i)
                uploadedImages.push({
                    url: imageUrl,
                    order: i
                })
            } catch (error) {
                console.error(`[CreateProduct] Failed to upload image ${i + 1}, continuing...`, error)
                // Continue with other images
            }
        }

        if (uploadedImages.length === 0) {
            // If all uploads failed, delete the document
            await deleteDoc(docRef)
            throw new Error('Failed to upload any images. Product creation cancelled.')
        }

        console.log(`[CreateProduct] Successfully uploaded ${uploadedImages.length} images`)

        // Step 4: Update document with images and slug
        const slug = generateSlug(formData.title, productId)
        const thumbnailUrl = uploadedImages[0]?.url || ''

        await updateDoc(docRef, {
            images: uploadedImages,
            thumbnail_url: thumbnailUrl,
            slug: slug
        })

        console.log(`[CreateProduct] Product created successfully: ${productId}`)
        return productId

    } catch (error) {
        console.error('[CreateProduct] Error:', error)
        throw error
    }
}

/**
 * Get product by ID
 */
export async function getProductById(productId: string): Promise<ProductWithId | null> {
    try {
        const docRef = doc(db, PRODUCTS_COLLECTION, productId)
        const docSnap = await getDoc(docRef)

        if (!docSnap.exists()) {
            return null
        }

        const data = docSnap.data()

        return {
            id: docSnap.id,
            ...data,
            created_at: data.created_at?.toDate?.() || new Date(),
            updated_at: data.updated_at?.toDate?.() || new Date()
        } as ProductWithId

    } catch (error) {
        console.error('[GetProduct] Error:', error)
        throw error
    }
}

/**
 * Get all active products
 */
export async function getAllProducts(limitCount: number = 50): Promise<ProductWithId[]> {
    try {
        const q = query(
            collection(db, PRODUCTS_COLLECTION),
            where('status', '==', 'active'),
            orderBy('created_at', 'desc'),
            limit(limitCount)
        )

        const snapshot = await getDocs(q)

        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            created_at: doc.data().created_at?.toDate?.() || new Date(),
            updated_at: doc.data().updated_at?.toDate?.() || new Date()
        })) as ProductWithId[]

    } catch (error) {
        console.error('[GetAllProducts] Error:', error)
        throw error
    }
}

/**
 * Get products by seller
 */
export async function getProductsBySeller(sellerId: string): Promise<ProductWithId[]> {
    try {
        const q = query(
            collection(db, PRODUCTS_COLLECTION),
            where('seller_id', '==', sellerId),
            orderBy('created_at', 'desc')
        )

        const snapshot = await getDocs(q)

        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            created_at: doc.data().created_at?.toDate?.() || new Date(),
            updated_at: doc.data().updated_at?.toDate?.() || new Date()
        })) as ProductWithId[]

    } catch (error) {
        console.error('[GetSellerProducts] Error:', error)
        throw error
    }
}

/**
 * Update product
 */
export async function updateProduct(
    productId: string,
    updates: Partial<ProductFormData>
): Promise<void> {
    try {
        const docRef = doc(db, PRODUCTS_COLLECTION, productId)
        await updateDoc(docRef, {
            ...updates,
            updated_at: new Date()
        })

        console.log(`[UpdateProduct] Product ${productId} updated`)

    } catch (error) {
        console.error('[UpdateProduct] Error:', error)
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
            const imageUrls = product.images.map(img => img.url)
            await deleteProductImages(imageUrls)
        }

        // Delete document
        const docRef = doc(db, PRODUCTS_COLLECTION, productId)
        await deleteDoc(docRef)

        console.log(`[DeleteProduct] Product ${productId} deleted`)

    } catch (error) {
        console.error('[DeleteProduct] Error:', error)
        throw error
    }
}

/**
 * Increment view count
 */
export async function incrementViewCount(productId: string): Promise<void> {
    try {
        const product = await getProductById(productId)
        if (product) {
            const docRef = doc(db, PRODUCTS_COLLECTION, productId)
            await updateDoc(docRef, {
                views_count: (product.views_count || 0) + 1
            })
        }
    } catch (error) {
        console.error('[IncrementViews] Error:', error)
    }
}
