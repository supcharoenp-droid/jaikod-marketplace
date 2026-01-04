/**
 * DATA MIGRATION SCRIPT - Fix Orphaned Listings
 * 
 * Purpose: Fix the 9 existing orphaned listings found in audit
 * Strategy: Create placeholder users for missing seller IDs
 * 
 * Usage: Run in browser console on localhost:3000/admin/data-audit
 * Or create a dedicated migration page
 */

import { doc, setDoc, updateDoc, serverTimestamp, getDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'

export interface MigrationResult {
    success: boolean
    sellersProcessed: number
    listingsFixed: number
    errors: Array<{ seller_id: string, error: string }>
    log: string[]
}

/**
 * Create a placeholder user for an orphaned seller ID
 */
async function createPlaceholderUser(
    sellerId: string,
    sellerName: string = 'ผู้ขายไม่ระบุตัวตน'
): Promise<boolean> {
    try {
        // Check if user already exists
        const userDoc = await getDoc(doc(db, 'users', sellerId))
        if (userDoc.exists()) {
            console.log(`[Migration] User ${sellerId} already exists, skipping...`)
            return true
        }

        // Create placeholder user document
        const userData = {
            displayName: sellerName,
            email: `placeholder_${sellerId}@jaikod.local`,
            photoURL: null,
            role: 'seller',
            level: 0,
            trustScore: 0,
            rating: 0,
            reviewCount: 0,
            productCount: 0,
            successfulSales: 0,
            responseRate: 0,
            responseTimeMinutes: 999,
            isVerified: false,
            badges: [],
            followers: 0,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),

            // Mark as placeholder for future reference
            isPlaceholder: true,
            migrationNote: 'Auto-created during orphaned listings migration on 2025-12-28',
            originalSellerId: sellerId,
        }

        await setDoc(doc(db, 'users', sellerId), userData)
        console.log(`[Migration] ✅ Created placeholder user for ${sellerId}`)
        return true

    } catch (error) {
        console.error(`[Migration] ❌ Error creating placeholder user for ${sellerId}:`, error)
        return false
    }
}

/**
 * Main migration function
 */
export async function migrateOrphanedListings(): Promise<MigrationResult> {
    const log: string[] = []
    const errors: Array<{ seller_id: string, error: string }> = []
    let sellersProcessed = 0
    let listingsFixed = 0

    log.push('🚀 Starting orphaned listings migration...')
    log.push('')

    // Known orphaned seller IDs from audit
    const orphanedSellers = [
        {
            id: 'QSNb9fGPr5dFaBUiKMBAhJT7kFs2',
            name: 'Unknown',
            listingCount: 7
        },
        {
            id: 'seed_seller_002',
            name: 'Vintage Collectibles',
            listingCount: 1
        },
        {
            id: '7iHeSD9GY6StvbxiJdwtDpbLcAA3',
            name: 'ผู้ดูแลระบบ',
            listingCount: 1
        }
    ]

    log.push(`📊 Found ${orphanedSellers.length} orphaned sellers`)
    log.push(`📦 Affecting ${orphanedSellers.reduce((sum, s) => sum + s.listingCount, 0)} listings total`)
    log.push('')

    // Process each orphaned seller
    for (const seller of orphanedSellers) {
        try {
            log.push(`Processing seller: ${seller.id}`)
            log.push(`  Name: ${seller.name}`)
            log.push(`  Listings: ${seller.listingCount}`)

            const success = await createPlaceholderUser(seller.id, seller.name)

            if (success) {
                sellersProcessed++
                listingsFixed += seller.listingCount
                log.push(`  ✅ SUCCESS - ${seller.listingCount} listings now have valid seller`)
            } else {
                errors.push({ seller_id: seller.id, error: 'Failed to create placeholder user' })
                log.push(`  ❌ FAILED`)
            }

            log.push('')

        } catch (error) {
            const errorMsg = error instanceof Error ? error.message : 'Unknown error'
            errors.push({ seller_id: seller.id, error: errorMsg })
            log.push(`  ❌ ERROR: ${errorMsg}`)
            log.push('')
        }
    }

    // Summary
    log.push('='.repeat(60))
    log.push('📊 MIGRATION SUMMARY')
    log.push('='.repeat(60))
    log.push(`✅ Sellers processed: ${sellersProcessed}/${orphanedSellers.length}`)
    log.push(`✅ Listings fixed: ${listingsFixed}`)
    log.push(`❌ Errors: ${errors.length}`)

    if (errors.length > 0) {
        log.push('')
        log.push('❌ Errors encountered:')
        errors.forEach(err => {
            log.push(`   - ${err.seller_id}: ${err.error}`)
        })
    }

    log.push('')
    log.push(sellersProcessed === orphanedSellers.length
        ? '🎉 Migration completed successfully!'
        : '⚠️  Migration completed with errors')

    // Print all logs
    log.forEach(line => console.log(line))

    return {
        success: sellersProcessed === orphanedSellers.length,
        sellersProcessed,
        listingsFixed,
        errors,
        log
    }
}

/**
 * Verification function - Check if migration was successful
 */
export async function verifyMigration(): Promise<{
    allSellersExist: boolean
    details: Array<{ seller_id: string, exists: boolean }>
}> {
    const orphanedSellers = [
        'QSNb9fGPr5dFaBUiKMBAhJT7kFs2',
        'seed_seller_002',
        '7iHeSD9GY6StvbxiJdwtDpbLcAA3'
    ]

    const details = []

    for (const sellerId of orphanedSellers) {
        const userDoc = await getDoc(doc(db, 'users', sellerId))
        const exists = userDoc.exists()
        details.push({ seller_id: sellerId, exists })

        if (exists) {
            console.log(`✅ ${sellerId} EXISTS`)
        } else {
            console.log(`❌ ${sellerId} MISSING`)
        }
    }

    const allExist = details.every(d => d.exists)

    console.log('')
    console.log(allExist
        ? '🎉 All orphaned sellers now have user documents!'
        : '⚠️  Some sellers are still missing')

    return {
        allSellersExist: allExist,
        details
    }
}

// Export for easy use in console
if (typeof window !== 'undefined') {
    (window as any).migrateOrphanedListings = migrateOrphanedListings;
    (window as any).verifyMigration = verifyMigration;
    console.log('💡 Migration functions loaded. Run:')
    console.log('   window.migrateOrphanedListings() - to fix orphaned listings')
    console.log('   window.verifyMigration() - to verify fix')
}
