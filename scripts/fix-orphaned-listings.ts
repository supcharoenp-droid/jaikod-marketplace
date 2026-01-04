/**
 * FIX ORPHANED LISTINGS SCRIPT
 * 
 * Purpose: Fix listings/products with invalid seller_id
 * Strategy:
 *   1. Try to find real seller by seller_name
 *   2. If found → Update seller_id to correct value
 *   3. If not found → Create placeholder user or mark as system listing
 * 
 * Usage: npx ts-node scripts/fix-orphaned-listings.ts [--dry-run] [--auto]
 */

import { initializeApp, cert } from 'firebase-admin/app'
import { getFirestore, FieldValue } from 'firebase-admin/firestore'
import * as readline from 'readline'
import * as fs from 'fs'
import * as path from 'path'

let serviceAccount: any
try {
    serviceAccount = JSON.parse(
        fs.readFileSync(path.join(__dirname, '..', 'serviceAccountKey.json'), 'utf8')
    )
} catch (error) {
    console.error('❌ Error: serviceAccountKey.json not found!')
    console.error('Please download it from Firebase Console > Project Settings > Service Accounts')
    process.exit(1)
}

const app = initializeApp({
    credential: cert(serviceAccount)
})

const db = getFirestore(app)

// Parse command line arguments
const args = process.argv.slice(2)
const isDryRun = args.includes('--dry-run')
const isAuto = args.includes('--auto')

interface FixAction {
    listingId: string
    collection: 'listings' | 'products'
    currentSellerId: string
    sellerName?: string
    action: 'update_seller_id' | 'create_placeholder' | 'mark_system' | 'skip'
    newSellerId?: string
    reason: string
}

async function findSellerByName(sellerName: string): Promise<string | null> {
    if (!sellerName) return null

    // Try exact match first
    const exactMatch = await db.collection('users')
        .where('displayName', '==', sellerName)
        .limit(1)
        .get()

    if (!exactMatch.empty) {
        return exactMatch.docs[0].id
    }

    // Try case-insensitive match
    const allUsers = await db.collection('users').get()
    for (const doc of allUsers.docs) {
        const userData = doc.data()
        if (userData.displayName?.toLowerCase() === sellerName.toLowerCase()) {
            return doc.id
        }
    }

    return null
}

async function createPlaceholderUser(sellerId: string, sellerName: string): Promise<void> {
    const userData = {
        displayName: sellerName || 'Deleted User',
        email: `deleted_${sellerId}@jaikod.placeholder`,
        role: 'seller',
        level: 0,
        trustScore: 0,
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
        isPlaceholder: true,
        originalSellerId: sellerId,
        note: 'Auto-generated placeholder for orphaned listings'
    }

    await db.collection('users').doc(sellerId).set(userData)
    console.log(`   ✅ Created placeholder user: ${sellerId}`)
}

async function fixOrphanedListings() {
    console.log('🔧 Starting Orphaned Listings Fix...\n')

    if (isDryRun) {
        console.log('🔍 DRY RUN MODE - No changes will be made\n')
    }

    // Get all valid users
    const usersSnapshot = await db.collection('users').get()
    const validSellerIds = new Set<string>()
    const userNameToId: { [name: string]: string } = {}

    usersSnapshot.forEach(doc => {
        validSellerIds.add(doc.id)
        const userData = doc.data()
        if (userData.displayName) {
            userNameToId[userData.displayName.toLowerCase()] = doc.id
        }
    })

    console.log(`✅ Loaded ${validSellerIds.size} valid users\n`)

    const fixActions: FixAction[] = []
    let fixedCount = 0
    let skippedCount = 0

    // Scan listings
    console.log('📊 Scanning listings collection...')
    const listingsSnapshot = await db.collection('listings').get()

    for (const doc of listingsSnapshot.docs) {
        const data = doc.data()
        const sellerId = data.seller_id || data.sellerId
        const sellerName = data.seller_name || data.sellerName

        if (sellerId && !validSellerIds.has(sellerId)) {
            // Try to find correct seller by name
            const correctSellerId = await findSellerByName(sellerName)

            let action: FixAction

            if (correctSellerId) {
                action = {
                    listingId: doc.id,
                    collection: 'listings',
                    currentSellerId: sellerId,
                    sellerName,
                    action: 'update_seller_id',
                    newSellerId: correctSellerId,
                    reason: `Found matching user by name: ${sellerName}`
                }
            } else {
                // Ask user what to do
                if (isAuto) {
                    action = {
                        listingId: doc.id,
                        collection: 'listings',
                        currentSellerId: sellerId,
                        sellerName,
                        action: 'create_placeholder',
                        newSellerId: sellerId,
                        reason: 'Auto mode: Creating placeholder user'
                    }
                } else {
                    action = {
                        listingId: doc.id,
                        collection: 'listings',
                        currentSellerId: sellerId,
                        sellerName,
                        action: 'skip',
                        reason: 'Manual review required'
                    }
                }
            }

            fixActions.push(action)
        }
    }

    console.log(`Found ${fixActions.length} orphaned listings\n`)

    // Scan products
    console.log('📊 Scanning products collection...')
    const productsSnapshot = await db.collection('products').get()

    for (const doc of productsSnapshot.docs) {
        const data = doc.data()
        const sellerId = data.seller_id || data.sellerId
        const sellerName = data.seller_name || data.sellerName

        if (sellerId && !validSellerIds.has(sellerId)) {
            const correctSellerId = await findSellerByName(sellerName)

            let action: FixAction

            if (correctSellerId) {
                action = {
                    listingId: doc.id,
                    collection: 'products',
                    currentSellerId: sellerId,
                    sellerName,
                    action: 'update_seller_id',
                    newSellerId: correctSellerId,
                    reason: `Found matching user by name: ${sellerName}`
                }
            } else {
                if (isAuto) {
                    action = {
                        listingId: doc.id,
                        collection: 'products',
                        currentSellerId: sellerId,
                        sellerName,
                        action: 'create_placeholder',
                        newSellerId: sellerId,
                        reason: 'Auto mode: Creating placeholder user'
                    }
                } else {
                    action = {
                        listingId: doc.id,
                        collection: 'products',
                        currentSellerId: sellerId,
                        sellerName,
                        action: 'skip',
                        reason: 'Manual review required'
                    }
                }
            }

            fixActions.push(action)
        }
    }

    console.log(`Found total ${fixActions.length} orphaned items\n`)

    // Execute fixes
    if (fixActions.length > 0 && !isDryRun) {
        console.log('🔧 Applying fixes...\n')

        const placeholdersCreated = new Set<string>()

        for (const action of fixActions) {
            try {
                if (action.action === 'update_seller_id' && action.newSellerId) {
                    await db.collection(action.collection)
                        .doc(action.listingId)
                        .update({
                            seller_id: action.newSellerId,
                            updated_at: FieldValue.serverTimestamp(),
                            _fix_note: `Auto-fixed on ${new Date().toISOString()}: ${action.reason}`
                        })

                    console.log(`✅ Updated ${action.collection}/${action.listingId}`)
                    console.log(`   Old seller_id: ${action.currentSellerId}`)
                    console.log(`   New seller_id: ${action.newSellerId}`)
                    fixedCount++
                } else if (action.action === 'create_placeholder' && action.newSellerId) {
                    // Create placeholder user if not already created
                    if (!placeholdersCreated.has(action.currentSellerId)) {
                        await createPlaceholderUser(action.currentSellerId, action.sellerName || 'Unknown')
                        placeholdersCreated.add(action.currentSellerId)
                        validSellerIds.add(action.currentSellerId)
                    }

                    console.log(`✅ Preserved ${action.collection}/${action.listingId} with placeholder user`)
                    fixedCount++
                } else {
                    console.log(`⏭️  Skipped ${action.collection}/${action.listingId} - ${action.reason}`)
                    skippedCount++
                }
            } catch (error) {
                console.error(`❌ Error fixing ${action.collection}/${action.listingId}:`, error)
                skippedCount++
            }
        }
    } else if (isDryRun) {
        console.log('📋 Actions that would be taken:\n')
        fixActions.forEach((action, index) => {
            console.log(`${index + 1}. ${action.collection}/${action.listingId}`)
            console.log(`   Action: ${action.action}`)
            console.log(`   Current seller_id: ${action.currentSellerId}`)
            console.log(`   Seller name: ${action.sellerName || 'N/A'}`)
            if (action.newSellerId) {
                console.log(`   New seller_id: ${action.newSellerId}`)
            }
            console.log(`   Reason: ${action.reason}`)
            console.log('')
        })
    }

    console.log('\n' + '='.repeat(80))
    console.log('📊 Summary:')
    console.log(`   Total orphaned items found: ${fixActions.length}`)
    console.log(`   Fixed: ${fixedCount}`)
    console.log(`   Skipped: ${skippedCount}`)
    console.log('='.repeat(80))
}

async function main() {
    try {
        await fixOrphanedListings()
        console.log('\n✅ Fix process completed!')
        process.exit(0)
    } catch (error) {
        console.error('\n❌ Fix process failed:', error)
        process.exit(1)
    }
}

main()
