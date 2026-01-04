/**
 * CLEANUP OLD DATA SCRIPT
 * 
 * Purpose: Delete all legacy data and start fresh with new unified listing system
 * 
 * What this script does:
 * 1. Delete ALL documents in 'products' collection (legacy)
 * 2. Delete ALL documents in 'listings' collection (start fresh)
 * 3. Keep 'users' collection intact
 * 
 * IMPORTANT: THIS CANNOT BE UNDONE!
 * 
 * Usage:
 *   npm run cleanup:all        # Delete everything (requires confirmation)
 *   npm run cleanup:products   # Delete only products collection
 *   npm run cleanup:listings   # Delete only listings collection
 */

import * as admin from 'firebase-admin'
import * as fs from 'fs'
import * as readline from 'readline'

// Initialize Firebase Admin
const serviceAccount = JSON.parse(
    fs.readFileSync('./serviceAccountKey.json', 'utf8')
)

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    })
}

const db = admin.firestore()

// Create readline interface for confirmation
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

function askQuestion(question: string): Promise<string> {
    return new Promise((resolve) => {
        rl.question(question, (answer) => {
            resolve(answer)
        })
    })
}

async function deleteCollection(collectionName: string): Promise<number> {
    console.log(`\n🗑️  Deleting collection: ${collectionName}`)

    const collectionRef = db.collection(collectionName)
    const batchSize = 500
    let totalDeleted = 0

    async function deleteQueryBatch(): Promise<number> {
        const snapshot = await collectionRef.limit(batchSize).get()

        if (snapshot.size === 0) {
            return 0
        }

        const batch = db.batch()
        snapshot.docs.forEach((doc) => {
            batch.delete(doc.ref)
        })

        await batch.commit()
        return snapshot.size
    }

    let deletedInBatch = 0
    do {
        deletedInBatch = await deleteQueryBatch()
        totalDeleted += deletedInBatch

        if (deletedInBatch > 0) {
            console.log(`   ✓ Deleted ${deletedInBatch} documents (total: ${totalDeleted})`)
        }
    } while (deletedInBatch === batchSize)

    console.log(`✅ Collection '${collectionName}' deleted: ${totalDeleted} documents`)
    return totalDeleted
}

async function cleanupProducts() {
    console.log('\n' + '='.repeat(60))
    console.log('🧹 CLEANUP: Legacy Products Collection')
    console.log('='.repeat(60))

    const answer = await askQuestion('\n⚠️  Delete ALL documents in "products" collection? (yes/no): ')

    if (answer.toLowerCase() !== 'yes') {
        console.log('❌ Cancelled.')
        return 0
    }

    const count = await deleteCollection('products')
    console.log(`\n✅ Deleted ${count} legacy products`)
    return count
}

async function cleanupListings() {
    console.log('\n' + '='.repeat(60))
    console.log('🧹 CLEANUP: Listings Collection')
    console.log('='.repeat(60))

    const answer = await askQuestion('\n⚠️  Delete ALL documents in "listings" collection? (yes/no): ')

    if (answer.toLowerCase() !== 'yes') {
        console.log('❌ Cancelled.')
        return 0
    }

    const count = await deleteCollection('listings')
    console.log(`\n✅ Deleted ${count} listings`)
    return count
}

async function cleanupAll() {
    console.log('\n' + '='.repeat(60))
    console.log('🚨 CLEANUP ALL DATA')
    console.log('='.repeat(60))
    console.log('\nThis will DELETE:')
    console.log('  ❌ ALL products (legacy)')
    console.log('  ❌ ALL listings')
    console.log('\nThis will KEEP:')
    console.log('  ✅ users')
    console.log('  ✅ Any other collections')

    const answer = await askQuestion('\n⚠️  Are you ABSOLUTELY SURE? Type "DELETE ALL" to confirm: ')

    if (answer !== 'DELETE ALL') {
        console.log('❌ Cancelled. (You must type exactly "DELETE ALL")')
        return
    }

    console.log('\n🚀 Starting cleanup...\n')

    const productsCount = await deleteCollection('products')
    const listingsCount = await deleteCollection('listings')

    console.log('\n' + '='.repeat(60))
    console.log('✅ CLEANUP COMPLETE')
    console.log('='.repeat(60))
    console.log(`\n📊 Summary:`)
    console.log(`   • Products deleted: ${productsCount}`)
    console.log(`   • Listings deleted: ${listingsCount}`)
    console.log(`   • Total deleted: ${productsCount + listingsCount}`)
    console.log('\n🎉 Database is now clean and ready for fresh data!')
}

async function countDocuments() {
    console.log('\n' + '='.repeat(60))
    console.log('📊 CURRENT DATA COUNT')
    console.log('='.repeat(60))

    const productsSnap = await db.collection('products').count().get()
    const listingsSnap = await db.collection('listings').count().get()
    const usersSnap = await db.collection('users').count().get()

    console.log(`\n  Products:  ${productsSnap.data().count} documents`)
    console.log(`  Listings:  ${listingsSnap.data().count} documents`)
    console.log(`  Users:     ${usersSnap.data().count} documents`)
    console.log('')
}

// Main execution
async function main() {
    const command = process.argv[2] || 'help'

    try {
        switch (command) {
            case 'count':
                await countDocuments()
                break

            case 'products':
                await countDocuments()
                await cleanupProducts()
                await countDocuments()
                break

            case 'listings':
                await countDocuments()
                await cleanupListings()
                await countDocuments()
                break

            case 'all':
                await countDocuments()
                await cleanupAll()
                await countDocuments()
                break

            case 'help':
            default:
                console.log('\n📚 Cleanup Script Usage:')
                console.log('\n  npm run cleanup:count      # Count documents in all collections')
                console.log('  npm run cleanup:products   # Delete products collection')
                console.log('  npm run cleanup:listings   # Delete listings collection')
                console.log('  npm run cleanup:all        # Delete EVERYTHING (products + listings)')
                console.log('\n⚠️  WARNING: All deletions are PERMANENT and CANNOT be undone!\n')
                break
        }
    } catch (error) {
        console.error('\n❌ Error:', error)
        process.exit(1)
    } finally {
        rl.close()
        process.exit(0)
    }
}

main()
