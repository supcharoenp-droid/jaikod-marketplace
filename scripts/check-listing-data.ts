/**
 * Script to check listing and seller data for debugging
 * Run: npx ts-node scripts/check-listing-data.ts
 */

import { initializeApp, cert } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'

// Initialize Firebase Admin
const app = initializeApp({
    projectId: 'jaikod-5cdd5'
})

const db = getFirestore(app)

async function checkData() {
    console.log('🔍 Checking listing and seller data...\n')

    // 1. Find the listing by slug pattern
    const listingsRef = db.collection('listings')
    const listingsSnapshot = await listingsRef
        .where('slug', '>=', 'apple-iphone-iphone-16')
        .where('slug', '<=', 'apple-iphone-iphone-16\uf8ff')
        .limit(5)
        .get()

    console.log(`📦 Found ${listingsSnapshot.size} listings matching pattern\n`)

    for (const doc of listingsSnapshot.docs) {
        const data = doc.data()
        console.log('='.repeat(60))
        console.log('📄 Listing ID:', doc.id)
        console.log('📄 Slug:', data.slug)
        console.log('📄 Title:', data.title)
        console.log('📄 Seller ID:', data.seller_id)
        console.log('📄 Created At:', data.created_at)
        console.log('   - Type:', typeof data.created_at)
        console.log('   - Has toDate:', !!data.created_at?.toDate)
        if (data.created_at?.toDate) {
            console.log('   - As Date:', data.created_at.toDate())
        } else if (data.created_at?._seconds) {
            console.log('   - From seconds:', new Date(data.created_at._seconds * 1000))
        }
        console.log('')

        // 2. Check seller data
        const sellerId = data.seller_id
        if (sellerId) {
            const userDoc = await db.collection('users').doc(sellerId).get()
            if (userDoc.exists) {
                const userData = userDoc.data()!
                console.log('👤 Seller Name:', userData.name || userData.displayName)
                console.log('👤 Total Listings (from user doc):', userData.totalListings || userData.total_listings || 'N/A')
                console.log('👤 Active Listings (from user doc):', userData.activeListings || userData.active_listings || 'N/A')
            } else {
                console.log('❌ User document not found for seller:', sellerId)
            }

            // 3. Count actual listings for this seller
            const sellerListings = await listingsRef
                .where('seller_id', '==', sellerId)
                .where('status', '==', 'active')
                .get()
            console.log('📊 Actual active listings count:', sellerListings.size)

            // Also check products collection
            const productsSnapshot = await db.collection('products')
                .where('sellerId', '==', sellerId)
                .get()
            console.log('📊 Products count:', productsSnapshot.size)
        }

        console.log('')
    }
}

checkData()
    .then(() => {
        console.log('\n✅ Check complete')
        process.exit(0)
    })
    .catch(err => {
        console.error('❌ Error:', err)
        process.exit(1)
    })
