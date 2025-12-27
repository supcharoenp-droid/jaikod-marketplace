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
    description_th?: string
    description_en?: string
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
 * 
 * 🛡️ Content Moderation:
 * - ตรวจสอบชื่อและคำอธิบายก่อน submit
 * - ถ้าพบเนื้อหาต้องห้าม จะ throw error
 * - ใช้ gpt-4o-mini สำหรับ edge cases
 */
export async function createProduct(
    input: CreateProductInput,
    sellerId: string,
    sellerName: string,
    sellerAvatar?: string
): Promise<string> {
    try {
        console.log('Starting product creation...')

        // 🛡️ Step 0: Content Moderation Check
        console.log('🛡️ Running Content Moderation...')
        const { moderateContent } = await import('./content-moderation')
        const moderationResult = await moderateContent(input.title, input.description)

        if (!moderationResult.isApproved) {
            console.error('❌ Content Moderation Failed:', moderationResult.violations)

            // Format error message
            const violationMessages = moderationResult.violations
                .map((v: { type: string; description: string }) => `${v.type}: ${v.description}`)
                .join(', ')

            throw new Error(
                `ไม่สามารถลงประกาศได้: ${violationMessages}. กรุณาแก้ไขเนื้อหาและลองใหม่อีกครั้ง`
            )
        }
        console.log('✅ Content Moderation Passed')

        // 1. Create product document first with basic info
        const now = new Date()

        // 🤖 Calculate AI Image Score (if File objects available)
        let aiImageScore = 0
        let aiTags: string[] = []

        try {
            if (input.images.length > 0 && input.images[0] instanceof File) {
                console.log('🤖 Calculating AI Image Score...')
                const { analyzeProductImages } = await import('@/services/aiImageAnalysis')
                const imageAnalysis = await analyzeProductImages(input.images as File[])
                aiImageScore = imageAnalysis.overallScore || 0
                console.log(`✅ AI Image Score: ${aiImageScore}/100`)
            } else {
                // Default score for URL images
                aiImageScore = 75
            }
        } catch (aiErr) {
            console.warn('⚠️ AI Image analysis skipped:', aiErr)
            aiImageScore = 70 // Fallback score
        }

        const productData = {
            title: input.title,
            description: input.description, // Main description (usually TH or EN based on context, legacy)
            description_th: input.description_th || '',
            description_en: input.description_en || '',
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

            // 🤖 AI Fields
            ai_image_score: aiImageScore,
            ai_tags: aiTags,

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
 * Get products by category (including subcategories)
 */
export async function getProductsByCategory(
    categoryId: string | number,
    limitCount: number = 20
): Promise<Product[]> {
    try {
        const catIdNum = Number(categoryId);
        const category = CATEGORIES.find(c => c.id === catIdNum);

        let categoryIds: number[] = [catIdNum];
        if (category && category.subcategories) {
            // Includes subcategories in the query
            category.subcategories.forEach(sub => categoryIds.push(sub.id));
        }

        // Handle case where categoryId implies a subcategory that behaves as a parent? 
        // Currently structure is 2 levels: Main -> Sub. 
        // If we pass a Subcategory ID, it has no children in `CATEGORIES` array defining it as root.
        // So this logic works for Main Category -> Fetch all subs.
        // If passed SubID, category is found (if flatten? No, CATEGORIES is possibly nested or flat list?)
        // src/constants/categories.ts shows nested structure.
        // So if I pass SubID (e.g. 101), find(c => c.id === 101) might fail if I only search top level.

        // Let's refine finding logic.
        let targetCategory = CATEGORIES.find(c => c.id === catIdNum);
        if (!targetCategory) {
            // Check subcategories
            for (const c of CATEGORIES) {
                if (c.subcategories) {
                    const sub = c.subcategories.find(s => s.id === catIdNum);
                    if (sub) {
                        targetCategory = sub as any; // Cast specific type if needed
                        break;
                    }
                }
            }
        }

        // If targetCategory not found, just use the ID.
        if (!targetCategory) {
            categoryIds = [catIdNum];
        }

        // Firestore 'in' limit is 30.
        if (categoryIds.length > 30) {
            console.warn('Category has too many subcategories for simple IN query. Truncating.');
            categoryIds = categoryIds.slice(0, 30);
        }

        const q = query(
            collection(db, PRODUCTS_COLLECTION),
            where('status', '==', 'active'),
            where('category_id', 'in', categoryIds),
            orderBy('created_at', 'desc'),
            limit(limitCount)
        );

        const snapshot = await getDocs(q);

        return snapshot.docs.map(docSnap => {
            const data = docSnap.data();
            // Need to find category info again for each product... simpler is generic find
            // Let's use helper or just raw lookup
            // We assume main category finding is enough for UI display
            const pCategory = CATEGORIES.find(c => c.id === data.category_id) ||
                CATEGORIES.flatMap(c => c.subcategories || []).find(s => s.id === data.category_id);

            return {
                id: docSnap.id,
                ...data,
                category: pCategory || null,
                created_at: data.created_at?.toDate?.() || new Date(),
                updated_at: data.updated_at?.toDate?.() || new Date(),
            } as unknown as Product;
        });

    } catch (error) {
        console.error('Error getting products by category:', error);
        return [];
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

/**
 * Advanced Search with Location & Sorting
 */
export interface SearchOptions {
    query?: string
    categoryId?: string | number
    minPrice?: number
    maxPrice?: number
    sortBy?: 'latest' | 'price_asc' | 'price_desc' | 'nearest' | 'relevance'
    userLocation?: { latitude: number, longitude: number }
    maxDistanceKm?: number
}

export async function searchProductsAdvanced(options: SearchOptions): Promise<Product[]> {
    try {
        // 1. Fetch base list (Optimization: Use specific queries if possible, but Firestore limits multi-range)
        // For MVP, fetch recent/active and filter in-memory.
        let products = await getAllProducts(100);

        // 2. Filter by Query
        if (options.query) {
            const lowerQuery = options.query.toLowerCase();
            products = products.filter(p =>
                p.title.toLowerCase().includes(lowerQuery) ||
                p.description.toLowerCase().includes(lowerQuery)
            );
        }

        // 3. Filter by Category
        if (options.categoryId) {
            const catId = Number(options.categoryId);
            // Simple match or subcategory match
            products = products.filter(p => {
                if (p.category_id === catId) return true;
                // Check if p.category_id is a child of the requested category?
                // This logic is complex without a flattened map. 
                // For now, strict match or reliance on `getProductsByCategory` being called separately.
                // Let's assume strict match for filter.
                return Number(p.category_id) === catId;
            });
        }

        // 4. Filter by Price
        if (options.minPrice !== undefined) products = products.filter(p => p.price >= options.minPrice!);
        if (options.maxPrice !== undefined) products = products.filter(p => p.price <= options.maxPrice!);

        // 5. Calculate Distances (if sorting by nearest or max distance set)
        let productsWithDist: { p: Product, dist: number }[] = [];

        // Dynamic import to avoid circular dep issues on load if any
        const { calculateDistance, getProvinceCoordinates } = await import('./geolocation');

        // We need user location for distance logic
        if (options.userLocation || (options.sortBy === 'nearest')) {
            // If userLocation not passed but sort requested, we can't sort accurately without it.
            // Assume caller handles getting location.
            const userLoc = options.userLocation;

            if (userLoc) {
                productsWithDist = products.map(p => {
                    let dist = Infinity;
                    if (p.location_province) {
                        const coords = getProvinceCoordinates(p.location_province);
                        if (coords) {
                            dist = calculateDistance(userLoc, coords);
                        }
                    }
                    return { p, dist };
                });

                // Filter by Max Distance
                if (options.maxDistanceKm) {
                    productsWithDist = productsWithDist.filter(item => item.dist <= options.maxDistanceKm!);
                    products = productsWithDist.map(item => item.p); // Update main list
                }
            }
        }

        // 6. Sorting
        switch (options.sortBy) {
            case 'price_asc':
                products.sort((a, b) => a.price - b.price);
                break;
            case 'price_desc':
                products.sort((a, b) => b.price - a.price);
                break;
            case 'nearest':
                if (productsWithDist.length > 0) {
                    // Sort by pre-calculated distance
                    products = productsWithDist.sort((a, b) => a.dist - b.dist).map(i => i.p);
                }
                break;
            case 'latest':
            default:
                // Already sorted by created_at desc in fetch
                products.sort((a, b) => {
                    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
                });
                break;
        }

        return products;

    } catch (error) {
        console.error('Error in advanced search:', error);
        return [];
    }
}

export async function updateProduct(
    productId: string,
    updates: Partial<CreateProductInput>
): Promise<void> {
    try {
        const docRef = doc(db, PRODUCTS_COLLECTION, productId)

        // Handle Image Uploads if images provided
        let finalUpdates: any = { ...updates }

        if (updates.images) {
            const finalImages: string[] = []
            console.log(`[updateProduct] Processing ${updates.images.length} images...`)

            for (let i = 0; i < updates.images.length; i++) {
                const img = updates.images[i]
                try {
                    if (img instanceof File) {
                        console.log(`[updateProduct] Uploading new image ${i}...`)
                        const url = await uploadImage(img, productId, i)
                        finalImages.push(url)
                    } else if (typeof img === 'string') {
                        finalImages.push(img)
                    } else if ((img as any).url) {
                        // Handle case where it might be { url: string } object
                        finalImages.push((img as any).url)
                    }
                } catch (err) {
                    console.error(`Failed to handle image ${i} in update:`, err)
                }
            }

            finalUpdates.images = finalImages.map((url, i) => ({ url, order: i })) // Store as object array like createProduct

            // Update thumbnail
            if (finalImages.length > 0) {
                finalUpdates.thumbnail_url = finalImages[0]
            }
        }

        await updateDoc(docRef, {
            ...finalUpdates,
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
        console.log('[deleteProduct] Starting deletion for:', productId)

        // Get product to delete images
        const product = await getProductById(productId)
        console.log('[deleteProduct] Product found:', product ? 'yes' : 'no')

        if (product && product.images && product.images.length > 0) {
            // Handle both string[] and ProductImage[] formats
            const imageUrls = product.images.map(img =>
                typeof img === 'string' ? img : img.url
            )
            console.log('[deleteProduct] Deleting images:', imageUrls.length)
            await deleteProductImages(productId, imageUrls)
        }

        // Delete document
        const docRef = doc(db, PRODUCTS_COLLECTION, productId)
        await deleteDoc(docRef)
        console.log('[deleteProduct] Product deleted successfully:', productId)
    } catch (error) {
        console.error('[deleteProduct] Error deleting product:', error)
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

/**
 * Get hot deals (products with discount)
 */
export async function getHotDealsProducts(limitCount: number = 10): Promise<Product[]> {
    try {
        const q = query(
            collection(db, PRODUCTS_COLLECTION),
            where('status', '==', 'active'),
            orderBy('created_at', 'desc'),
            limit(50) // Fetch more then filter
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

        // Filter for deals: has original_price AND original_price > price
        const deals = products.filter(p =>
            p.original_price && p.original_price > p.price
        )

        return deals.slice(0, limitCount)
    } catch (error) {
        console.error('Error getting hot deals:', error)
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
            }
        }

        // 2. Remove from images array
        // Handle ProductImage[] or string[]
        const currentImages = product.images || [];
        // @ts-ignore - legacy support
        const newImages = currentImages.filter(img => (typeof img === 'string' ? img : img.url) !== imageUrl)

        // 3. Update thumbnail if needed
        let newThumbnail = product.thumbnail_url
        if (product.thumbnail_url === imageUrl) {
            // @ts-ignore
            newThumbnail = newImages.length > 0 ? (typeof newImages[0] === 'string' ? newImages[0] : newImages[0].url) : ''
        }

        // Re-index order
        const orderedImages = newImages.map((img: any, index: number) => {
            if (typeof img === 'string') return { url: img, order: index };
            return { ...img, order: index };
        });

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

/**
 * Update product status (e.g. active -> reserved -> sold)
 */
export async function updateProductStatus(productId: string, status: 'active' | 'reserved' | 'sold', reservedByUserId?: string): Promise<void> {
    try {
        const docRef = doc(db, PRODUCTS_COLLECTION, productId)
        await updateDoc(docRef, {
            status: status,
            reserved_by: reservedByUserId || null,
            updated_at: serverTimestamp()
        })
    } catch (error) {
        console.error('Error updating product status:', error)
    }
}
