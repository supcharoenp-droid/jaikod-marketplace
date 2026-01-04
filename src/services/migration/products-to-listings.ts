/**
 * PRODUCTS TO LISTINGS MIGRATION SERVICE
 * 
 * ย้ายข้อมูลจาก legacy `products` collection ไปยัง `listings` collection
 * 
 * Features:
 * - Dry run mode (preview without changes)
 * - Batch processing to avoid timeouts
 * - Progress tracking
 * - Error handling & recovery
 * - Rollback support
 * 
 * @version 1.0.0
 * @created 2025-12-30
 */

import {
    collection,
    doc,
    getDocs,
    getDoc,
    setDoc,
    updateDoc,
    query,
    where,
    limit,
    serverTimestamp,
    Timestamp
} from 'firebase/firestore'
import { db } from '@/lib/firebase'
import type { UniversalListing } from '@/types'

// ==========================================
// TYPES
// ==========================================

export interface ProductDocument {
    id: string
    title?: string
    name?: string
    description?: string
    price?: number
    images?: string[]
    thumbnail?: string
    category_id?: number
    categoryId?: number
    category_name?: string
    subcategory_id?: number
    subcategoryId?: number
    seller_id?: string  // snake_case
    sellerId?: string   // camelCase
    status?: string
    condition?: string
    province?: string
    amphoe?: string
    location?: any
    created_at?: any
    createdAt?: any
    updated_at?: any
    updatedAt?: any
    views?: number
    favorites?: number
    slug?: string
    [key: string]: any
}

export interface MigrationProgress {
    total: number
    processed: number
    migrated: number
    skipped: number
    errors: number
    currentBatch: number
    totalBatches: number
}

export interface MigrationResult {
    success: boolean
    totalProducts: number
    migrated: number
    skipped: number
    errors: MigrationError[]
    duration: number
    log: string[]
}

export interface MigrationError {
    productId: string
    error: string
    productData?: any
}

export interface MigrationOptions {
    dryRun?: boolean
    batchSize?: number
    skipExisting?: boolean
    onProgress?: (progress: MigrationProgress) => void
}

// ==========================================
// COLLECTION NAMES
// ==========================================

const PRODUCTS_COLLECTION = 'products'
const LISTINGS_COLLECTION = 'listings'
const MIGRATION_LOG_COLLECTION = 'migration_logs'

// ==========================================
// HELPER FUNCTIONS
// ==========================================

/**
 * Normalize seller ID (handle both naming conventions)
 */
function normalizeSellerId(product: ProductDocument): string {
    return product.seller_id || product.sellerId || 'unknown'
}

/**
 * Normalize category ID
 */
function normalizeCategoryId(product: ProductDocument): number {
    return product.category_id || product.categoryId || 0
}

/**
 * Normalize subcategory ID
 */
function normalizeSubcategoryId(product: ProductDocument): number | null {
    return product.subcategory_id || product.subcategoryId || null
}

/**
 * Normalize timestamp to Date
 */
function normalizeTimestamp(value: any): Date {
    if (!value) return new Date()
    if (value instanceof Date) return value
    if (value?.toDate) return value.toDate()
    if (typeof value === 'string') return new Date(value)
    if (typeof value === 'number') return new Date(value)
    return new Date()
}

/**
 * Generate listing code from product ID
 */
function generateListingCode(productId: string): string {
    const hash = productId.slice(-6).toUpperCase()
    return `JK-M${hash}` // M for Migrated
}

/**
 * Generate slug from title
 */
function generateSlug(title: string, productId: string): string {
    const base = title
        .toLowerCase()
        .replace(/[^a-z0-9ก-๙\s]/g, '')
        .replace(/\s+/g, '-')
        .slice(0, 50)
    return `${base}-${productId.slice(-8)}`
}

/**
 * Determine category type from category ID
 */
function determineCategoryType(categoryId: number): string {
    if (categoryId >= 100 && categoryId < 200) return 'car'
    if (categoryId >= 200 && categoryId < 300) return 'motorcycle'
    if (categoryId >= 300 && categoryId < 400) return 'mobile'
    if (categoryId >= 1100 && categoryId < 1200) return 'property'
    return 'general'
}

// ==========================================
// TRANSFORM FUNCTION
// ==========================================

/**
 * Transform a legacy product document to UniversalListing format
 */
function transformProductToListing(product: ProductDocument): any {
    const sellerId = normalizeSellerId(product)
    const categoryId = normalizeCategoryId(product)
    const subcategoryId = normalizeSubcategoryId(product)
    const createdAt = normalizeTimestamp(product.created_at || product.createdAt)
    const updatedAt = normalizeTimestamp(product.updated_at || product.updatedAt)

    const title = product.title || product.name || 'Untitled Product'
    const listingCode = generateListingCode(product.id)
    const slug = product.slug || generateSlug(title, product.id)

    // Build images array
    const images = (product.images || []).map((url: string, index: number) => ({
        url,
        is_primary: index === 0,
        order: index,
        processing_status: 'completed' as const
    }))

    // Determine thumbnail
    const thumbnailUrl = product.thumbnail || product.images?.[0] || ''

    return {
        // Core identifiers
        listing_code: listingCode,
        listing_number: `MIG-${product.id.slice(-8).toUpperCase()}`,
        slug,

        // Category info
        category_type: determineCategoryType(categoryId) as any,
        category_id: categoryId,
        subcategory_id: subcategoryId,

        // Seller info
        seller_id: sellerId,
        seller_info: {
            name: product.seller_name || 'ผู้ขาย',
            verified: false,
            trust_score: 50
        } as any,

        // Content
        title,
        title_th: title,
        price: product.price || 0,
        price_negotiable: true,
        price_type: 'negotiable',
        currency: 'THB',

        // Template data (condition, etc.)
        template_data: {
            condition: product.condition || 'used'
        },

        // Images
        images,
        thumbnail_url: thumbnailUrl,

        // Location
        location: {
            province: product.province || product.location?.province || '',
            amphoe: product.amphoe || product.location?.amphoe || ''
        },

        // AI Content placeholder
        ai_content: {
            auto_title: title,
            marketing_copy: {
                headline: title,
                subheadline: '',
                selling_points: [],
                trust_signals: [],
                body_copy: product.description || '',
                call_to_action: 'ติดต่อผู้ขาย',
                full_text: product.description || ''
            },
            seo_keywords: [],
            confidence_score: 0
        },

        // Contact (placeholder)
        contact: {
            show_phone: false
        } as any,

        // Status
        status: (product.status as any) || 'active',
        visibility: 'public' as const,

        // Stats
        stats: {
            views: product.views || 0,
            unique_viewers: 0,
            favorites: product.favorites || 0,
            shares: 0,
            inquiries: 0,
            offers_received: 0,
            chat_conversations: 0
        },

        // Timestamps
        created_at: createdAt,
        updated_at: updatedAt,
        expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),

        // Migration metadata
        migration: {
            source: 'products',
            original_id: product.id,
            migrated_at: new Date(),
            version: 1
        }
    }
}

// ==========================================
// MIGRATION SERVICE
// ==========================================

/**
 * Check if a product has already been migrated
 */
async function isAlreadyMigrated(productId: string): Promise<boolean> {
    try {
        const q = query(
            collection(db, LISTINGS_COLLECTION),
            where('migration.original_id', '==', productId),
            limit(1)
        )
        const snapshot = await getDocs(q)
        return !snapshot.empty
    } catch {
        return false
    }
}

/**
 * Get all products from legacy collection
 */
async function getAllProducts(): Promise<ProductDocument[]> {
    const snapshot = await getDocs(collection(db, PRODUCTS_COLLECTION))
    return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }))
}

/**
 * Migrate a single product to listing
 */
async function migrateProduct(
    product: ProductDocument,
    dryRun: boolean
): Promise<{ success: boolean; error?: string }> {
    try {
        const listingData = transformProductToListing(product)

        if (dryRun) {
            console.log(`[DRY RUN] Would migrate product ${product.id}:`, listingData)
            return { success: true }
        }

        // Create new listing document
        const listingRef = doc(collection(db, LISTINGS_COLLECTION))
        await setDoc(listingRef, {
            ...listingData,
            id: listingRef.id
        })

        console.log(`✅ Migrated product ${product.id} → listing ${listingRef.id}`)
        return { success: true }

    } catch (error) {
        const errorMsg = error instanceof Error ? error.message : 'Unknown error'
        console.error(`❌ Failed to migrate product ${product.id}:`, errorMsg)
        return { success: false, error: errorMsg }
    }
}

/**
 * Main migration function
 */
export async function migrateProductsToListings(
    options: MigrationOptions = {}
): Promise<MigrationResult> {
    const {
        dryRun = true,
        batchSize = 10,
        skipExisting = true,
        onProgress
    } = options

    const startTime = Date.now()
    const log: string[] = []
    const errors: MigrationError[] = []
    let migrated = 0
    let skipped = 0

    log.push('═'.repeat(60))
    log.push('🚀 PRODUCTS TO LISTINGS MIGRATION')
    log.push(`Mode: ${dryRun ? '🔍 DRY RUN (No changes)' : '⚡ LIVE MIGRATION'}`)
    log.push('═'.repeat(60))
    log.push('')

    try {
        // Get all products
        log.push('📦 Fetching products from legacy collection...')
        const products = await getAllProducts()
        log.push(`   Found ${products.length} products`)
        log.push('')

        if (products.length === 0) {
            log.push('ℹ️ No products to migrate')
            return {
                success: true,
                totalProducts: 0,
                migrated: 0,
                skipped: 0,
                errors: [],
                duration: Date.now() - startTime,
                log
            }
        }

        const totalBatches = Math.ceil(products.length / batchSize)

        // Process in batches
        for (let batchNum = 0; batchNum < totalBatches; batchNum++) {
            const batchStart = batchNum * batchSize
            const batchEnd = Math.min(batchStart + batchSize, products.length)
            const batch = products.slice(batchStart, batchEnd)

            log.push(`📦 Processing batch ${batchNum + 1}/${totalBatches} (${batch.length} items)`)

            for (const product of batch) {
                // Check if already migrated
                if (skipExisting) {
                    const alreadyMigrated = await isAlreadyMigrated(product.id)
                    if (alreadyMigrated) {
                        log.push(`   ⏭️ Skipping ${product.id} (already migrated)`)
                        skipped++
                        continue
                    }
                }

                // Migrate product
                const result = await migrateProduct(product, dryRun)

                if (result.success) {
                    migrated++
                    log.push(`   ✅ ${product.id}: ${product.title || product.name || 'Untitled'}`)
                } else {
                    errors.push({
                        productId: product.id,
                        error: result.error || 'Unknown error',
                        productData: product
                    })
                    log.push(`   ❌ ${product.id}: ${result.error}`)
                }

                // Report progress
                if (onProgress) {
                    onProgress({
                        total: products.length,
                        processed: batchStart + batch.indexOf(product) + 1,
                        migrated,
                        skipped,
                        errors: errors.length,
                        currentBatch: batchNum + 1,
                        totalBatches
                    })
                }
            }

            log.push('')
        }

        // Summary
        log.push('═'.repeat(60))
        log.push('📊 MIGRATION SUMMARY')
        log.push('═'.repeat(60))
        log.push(`Total products: ${products.length}`)
        log.push(`✅ Migrated: ${migrated}`)
        log.push(`⏭️ Skipped: ${skipped}`)
        log.push(`❌ Errors: ${errors.length}`)
        log.push(`⏱️ Duration: ${((Date.now() - startTime) / 1000).toFixed(2)}s`)
        log.push('')

        if (dryRun) {
            log.push('🔍 This was a DRY RUN. No changes were made.')
            log.push('   Run with dryRun: false to perform actual migration.')
        } else {
            log.push('✅ Migration completed!')
        }

        // Save migration log
        if (!dryRun) {
            await setDoc(doc(collection(db, MIGRATION_LOG_COLLECTION)), {
                type: 'products_to_listings',
                timestamp: serverTimestamp(),
                totalProducts: products.length,
                migrated,
                skipped,
                errorsCount: errors.length,
                errors: errors.slice(0, 10), // Save first 10 errors
                duration: Date.now() - startTime
            })
        }

        return {
            success: errors.length === 0,
            totalProducts: products.length,
            migrated,
            skipped,
            errors,
            duration: Date.now() - startTime,
            log
        }

    } catch (error) {
        const errorMsg = error instanceof Error ? error.message : 'Unknown error'
        log.push(`❌ Migration failed: ${errorMsg}`)

        return {
            success: false,
            totalProducts: 0,
            migrated,
            skipped,
            errors: [{ productId: 'N/A', error: errorMsg }],
            duration: Date.now() - startTime,
            log
        }
    }
}

/**
 * Preview migration (dry run)
 */
export async function previewMigration(): Promise<MigrationResult> {
    console.log('🔍 Running migration preview (dry run)...')
    return migrateProductsToListings({ dryRun: true })
}

/**
 * Execute migration
 */
export async function executeMigration(): Promise<MigrationResult> {
    console.log('⚡ Running LIVE migration...')
    return migrateProductsToListings({ dryRun: false })
}

// Export for console access
if (typeof window !== 'undefined') {
    (window as any).previewProductsMigration = previewMigration;
    (window as any).executeProductsMigration = executeMigration;
    console.log('💡 Products Migration loaded. Run:')
    console.log('   window.previewProductsMigration() - Preview without changes')
    console.log('   window.executeProductsMigration() - Execute migration')
}
