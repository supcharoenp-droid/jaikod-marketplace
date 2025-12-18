/**
 * Optimized Products Service with Performance Improvements
 * 
 * Improvements:
 * 1. Parallel image upload (3 concurrent)
 * 2. Single Firestore write
 * 3. Client-side image compression
 * 4. Better error handling
 * 5. Memory cache (no external dependencies)
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
    Timestamp,
    writeBatch
} from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage'
import { db, storage } from './firebase'
import { Product } from '@/types'
import { CATEGORIES } from '@/constants/categories'

const PRODUCTS_COLLECTION = 'products'

// ==========================================
// IN-MEMORY CACHE (No external dependencies)
// ==========================================

interface CacheEntry<T> {
    data: T
    timestamp: number
    ttl: number
}

class MemoryCache {
    private cache: Map<string, CacheEntry<any>> = new Map()

    set<T>(key: string, data: T, ttlSeconds: number = 300): void {
        this.cache.set(key, {
            data,
            timestamp: Date.now(),
            ttl: ttlSeconds * 1000
        })
    }

    get<T>(key: string): T | null {
        const entry = this.cache.get(key)
        if (!entry) return null

        const isExpired = Date.now() - entry.timestamp > entry.ttl
        if (isExpired) {
            this.cache.delete(key)
            return null
        }

        return entry.data as T
    }

    invalidate(pattern: string): void {
        const keys = Array.from(this.cache.keys())
        keys.forEach(key => {
            if (key.includes(pattern)) {
                this.cache.delete(key)
            }
        })
    }

    clear(): void {
        this.cache.clear()
    }
}

const cache = new MemoryCache()

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
    images: File[] | string[]
}

export interface ProductDocument extends Omit<Product, 'id' | 'created_at' | 'updated_at' | 'seller_id'> {
    created_at: Timestamp
    updated_at: Timestamp
    seller_id: string
}

// ==========================================
// HELPER FUNCTIONS
// ==========================================

function generateSlug(title: string, id: string): string {
    const slug = title
        .toLowerCase()
        .replace(/[^\w\sก-๙]/g, '')
        .replace(/\s+/g, '-')
        .substring(0, 50)
    return `${slug}-${id.substring(0, 8)}`
}

/**
 * Compress image on client-side before upload
 */
async function compressImage(file: File | string): Promise<Blob> {
    if (typeof file === 'string') {
        const response = await fetch(file)
        return response.blob()
    }

    return new Promise((resolve, reject) => {
        const img = new Image()
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')

        img.onload = () => {
            // Max dimensions
            const MAX_WIDTH = 1920
            const MAX_HEIGHT = 1920

            let width = img.width
            let height = img.height

            // Calculate new dimensions
            if (width > height) {
                if (width > MAX_WIDTH) {
                    height = (height * MAX_WIDTH) / width
                    width = MAX_WIDTH
                }
            } else {
                if (height > MAX_HEIGHT) {
                    width = (width * MAX_HEIGHT) / height
                    height = MAX_HEIGHT
                }
            }

            canvas.width = width
            canvas.height = height

            ctx?.drawImage(img, 0, 0, width, height)

            canvas.toBlob(
                (blob) => {
                    if (blob) {
                        resolve(blob)
                    } else {
                        reject(new Error('Failed to compress image'))
                    }
                },
                'image/jpeg',
                0.85 // 85% quality
            )
        }

        img.onerror = reject

        if (file instanceof File) {
            img.src = URL.createObjectURL(file)
        }
    })
}

/**
 * Upload single image with compression
 */
async function uploadImage(file: File | string, productId: string, index: number): Promise<string> {
    // If it's already a URL, return it
    if (typeof file === 'string' && file.startsWith('http')) {
        return file
    }

    // Compress image
    const blob = await compressImage(file)

    const storageRef = ref(storage, `products/${productId}/image_${index}_${Date.now()}.jpg`)
    await uploadBytes(storageRef, blob)
    return getDownloadURL(storageRef)
}

/**
 * Upload images in parallel (batches of 3)
 */
async function uploadImagesParallel(
    images: (File | string)[],
    productId: string,
    maxConcurrent: number = 3
): Promise<string[]> {
    const imageUrls: string[] = []

    // Process in batches
    for (let i = 0; i < images.length; i += maxConcurrent) {
        const batch = images.slice(i, i + maxConcurrent)
        const batchPromises = batch.map((img, idx) =>
            uploadImage(img, productId, i + idx).catch(err => {
                console.error(`Failed to upload image ${i + idx}:`, err)
                return null // Return null for failed uploads
            })
        )

        const batchUrls = await Promise.all(batchPromises)
        imageUrls.push(...batchUrls.filter(url => url !== null) as string[])
    }

    return imageUrls
}

async function deleteProductImages(productId: string, imageUrls: string[]): Promise<void> {
    for (const url of imageUrls) {
        try {
            const storageRef = ref(storage, url)
            await deleteObject(storageRef)
        } catch (error) {
            console.error('Error deleting image:', error)
        }
    }
}

// ==========================================
// OPTIMIZED CRUD OPERATIONS
// ==========================================

/**
 * Create product - OPTIMIZED VERSION
 * 
 * Improvements:
 * 1. Parallel image upload (3 concurrent)
 * 2. Single Firestore write
 * 3. Client-side image compression
 * 4. Better error handling
 */
export async function createProduct(
    input: CreateProductInput,
    sellerId: string,
    sellerName: string,
    sellerAvatar?: string
): Promise<string> {
    try {
        console.log('🚀 Starting optimized product creation...')

        // Generate temporary ID for image uploads
        const tempId = `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

        // 1. Upload images in parallel (3 at a time)
        console.log(`📸 Uploading ${input.images.length} images in parallel...`)
        const startUpload = Date.now()
        const imageUrls = await uploadImagesParallel(input.images, tempId, 3)
        const uploadDuration = Date.now() - startUpload
        console.log(`✅ Images uploaded in ${uploadDuration}ms`)

        if (imageUrls.length === 0) {
            throw new Error('Failed to upload any images')
        }

        // 2. Prepare complete product data
        const now = new Date()
        const slug = generateSlug(input.title, tempId)

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

            images: imageUrls.map((url, i) => ({ url, order: i })),
            thumbnail_url: imageUrls[0] || '',
            slug: slug,
            created_at: now,
            updated_at: now
        }

        // 3. Single Firestore write
        console.log('💾 Saving to Firestore...')
        const startWrite = Date.now()
        // @ts-ignore
        const productRef = await addDoc(collection(db, PRODUCTS_COLLECTION), productData)
        const writeDuration = Date.now() - startWrite
        console.log(`✅ Saved in ${writeDuration}ms`)

        // 4. Invalidate cache
        cache.invalidate('products:')

        const totalDuration = Date.now() - startUpload
        console.log(`🎉 Product created successfully in ${totalDuration}ms`)

        return productRef.id
    } catch (error) {
        console.error('❌ Error in createProduct:', error)
        throw error
    }
}

/**
 * Get product by ID - WITH CACHE
 */
export async function getProductById(productId: string): Promise<Product | null> {
    try {
        // Check cache first
        const cacheKey = `product:${productId}`
        const cached = cache.get<Product>(cacheKey)
        if (cached) {
            console.log('✅ Cache hit:', cacheKey)
            return cached
        }

        const docRef = doc(db, PRODUCTS_COLLECTION, productId)
        const docSnap = await getDoc(docRef)

        if (!docSnap.exists()) {
            return null
        }

        const data = docSnap.data()
        const category = CATEGORIES.find(c => c.id === data.category_id)

        const product = {
            id: docSnap.id,
            ...data,
            category: category || null,
            created_at: data.created_at?.toDate?.() || new Date(),
            updated_at: data.updated_at?.toDate?.() || new Date(),
        } as unknown as Product

        // Cache for 5 minutes
        cache.set(cacheKey, product, 300)

        return product
    } catch (error) {
        console.error('Error getting product:', error)
        throw error
    }
}

/**
 * Get all products - WITH CACHE
 */
export async function getAllProducts(limitCount: number = 50): Promise<Product[]> {
    try {
        // Check cache first
        const cacheKey = `products:all:${limitCount}`
        const cached = cache.get<Product[]>(cacheKey)
        if (cached) {
            console.log('✅ Cache hit:', cacheKey)
            return cached
        }

        const q = query(
            collection(db, PRODUCTS_COLLECTION),
            where('status', '==', 'active'),
            orderBy('created_at', 'desc'),
            limit(limitCount)
        )
        const snapshot = await getDocs(q)

        const products = snapshot.docs.map(docSnap => {
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

        // Cache for 5 minutes
        cache.set(cacheKey, products, 300)

        return products
    } catch (error) {
        console.error('Error getting all products:', error)
        return []
    }
}

/**
 * Get product by slug - WITH CACHE
 */
export async function getProductBySlug(slug: string): Promise<Product | null> {
    try {
        // Check cache first
        const cacheKey = `product:slug:${slug}`
        const cached = cache.get<Product>(cacheKey)
        if (cached) {
            console.log('✅ Cache hit:', cacheKey)
            return cached
        }

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

        const product = {
            id: docSnap.id,
            ...data,
            category: category || null,
            created_at: data.created_at?.toDate?.() || new Date(),
            updated_at: data.updated_at?.toDate?.() || new Date(),
        } as unknown as Product

        // Cache for 5 minutes
        cache.set(cacheKey, product, 300)

        return product
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
 * Search products - WITH CACHE
 */
export async function searchProducts(searchQuery: string): Promise<Product[]> {
    try {
        const cacheKey = `products:search:${searchQuery}`
        const cached = cache.get<Product[]>(cacheKey)
        if (cached) {
            console.log('✅ Cache hit:', cacheKey)
            return cached
        }

        const allProducts = await getAllProducts(100)
        const lowerQuery = searchQuery.toLowerCase()

        const results = allProducts.filter(p =>
            p.title.toLowerCase().includes(lowerQuery) ||
            p.description.toLowerCase().includes(lowerQuery)
        )

        // Cache for 2 minutes
        cache.set(cacheKey, results, 120)

        return results
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

        // Invalidate cache
        cache.invalidate(`product:${productId}`)
        cache.invalidate('products:')

        console.log('Product updated:', productId)
    } catch (error) {
        console.error('Error updating product:', error)
        throw error
    }
}

export async function deleteProduct(productId: string): Promise<void> {
    try {
        const product = await getProductById(productId)
        if (product && product.images) {
            await deleteProductImages(productId, product.images.map(i => i.url))
        }

        const docRef = doc(db, PRODUCTS_COLLECTION, productId)
        await deleteDoc(docRef)

        // Invalidate cache
        cache.invalidate(`product:${productId}`)
        cache.invalidate('products:')

        console.log('Product deleted:', productId)
    } catch (error) {
        console.error('Error deleting product:', error)
        throw error
    }
}

export async function incrementViewCount(productId: string): Promise<void> {
    try {
        const docRef = doc(db, PRODUCTS_COLLECTION, productId)
        const docSnap = await getDoc(docRef)
        if (docSnap.exists()) {
            const currentViews = docSnap.data().views_count || 0
            await updateDoc(docRef, {
                views_count: currentViews + 1
            })

            // Invalidate cache
            cache.invalidate(`product:${productId}`)
        }
    } catch (error) {
        console.error('Error incrementing view count:', error)
    }
}

export async function toggleFavorite(productId: string, increment: boolean): Promise<void> {
    try {
        const docRef = doc(db, PRODUCTS_COLLECTION, productId)
        const docSnap = await getDoc(docRef)
        if (docSnap.exists()) {
            const currentFavorites = docSnap.data().favorites_count || 0
            await updateDoc(docRef, {
                favorites_count: increment ? currentFavorites + 1 : Math.max(0, currentFavorites - 1)
            })

            // Invalidate cache
            cache.invalidate(`product:${productId}`)
        }
    } catch (error) {
        console.error('Error toggling favorite:', error)
    }
}

export async function getBestSellingProducts(limitCount: number = 10): Promise<Product[]> {
    try {
        const cacheKey = `products:bestselling:${limitCount}`
        const cached = cache.get<Product[]>(cacheKey)
        if (cached) {
            console.log('✅ Cache hit:', cacheKey)
            return cached
        }

        const q = query(
            collection(db, PRODUCTS_COLLECTION),
            where('status', '==', 'active'),
            orderBy('sold_count', 'desc'),
            limit(limitCount)
        )
        const snapshot = await getDocs(q)
        const products = snapshot.docs.map(docSnap => {
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

        // Cache for 10 minutes
        cache.set(cacheKey, products, 600)

        return products
    } catch (error) {
        console.error('Error getting best selling products:', error)
        return []
    }
}

export async function getProductsByIds(productIds: string[]): Promise<Product[]> {
    if (!productIds.length) return []
    try {
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
        const cacheKey = `products:trending:${limitCount}`
        const cached = cache.get<Product[]>(cacheKey)
        if (cached) {
            console.log('✅ Cache hit:', cacheKey)
            return cached
        }

        const q = query(
            collection(db, PRODUCTS_COLLECTION),
            where('status', '==', 'active'),
            orderBy('views_count', 'desc'),
            limit(limitCount)
        )
        const snapshot = await getDocs(q)
        const products = snapshot.docs.map(docSnap => {
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

        // Cache for 5 minutes
        cache.set(cacheKey, products, 300)

        return products
    } catch (error) {
        console.error('Error getting trending products:', error)
        return []
    }
}

export async function deleteProductImage(productId: string, imageUrl: string): Promise<void> {
    try {
        const product = await getProductById(productId)
        if (!product) throw new Error('Product not found')

        try {
            const storageRef = ref(storage, imageUrl)
            await deleteObject(storageRef)
        } catch (error: any) {
            if (error.code !== 'storage/object-not-found') {
                console.error('Error deleting image from storage:', error)
            }
        }

        const newImages = product.images.filter(img => img.url !== imageUrl)

        let newThumbnail = product.thumbnail_url
        if (product.thumbnail_url === imageUrl) {
            newThumbnail = newImages.length > 0 ? newImages[0].url : ''
        }

        const orderedImages = newImages.map((img, index) => ({
            ...img,
            order: index
        }))

        const docRef = doc(db, PRODUCTS_COLLECTION, productId)
        await updateDoc(docRef, {
            images: orderedImages,
            thumbnail_url: newThumbnail,
            updated_at: serverTimestamp()
        })

        // Invalidate cache
        cache.invalidate(`product:${productId}`)

    } catch (error) {
        console.error('Error deleting product image:', error)
        throw error
    }
}

// Export cache for manual control if needed
export { cache as productCache }
