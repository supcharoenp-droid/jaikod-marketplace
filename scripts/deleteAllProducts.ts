/**
 * Delete All Products Script
 * This script will delete ALL products from Firestore
 * USE WITH CAUTION - This action cannot be undone!
 */

import { initializeApp } from 'firebase/app'
import { getFirestore, collection, getDocs, deleteDoc, doc, writeBatch } from 'firebase/firestore'

// Firebase configuration
const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

const PRODUCTS_COLLECTION = 'products'

async function deleteAllProducts() {
    console.log('🔥 Starting to delete all products...')
    console.log('⚠️  WARNING: This will delete ALL products from Firestore!')
    console.log('')

    try {
        // Get all products
        const productsRef = collection(db, PRODUCTS_COLLECTION)
        const snapshot = await getDocs(productsRef)

        const totalProducts = snapshot.size
        console.log(`📊 Found ${totalProducts} products to delete`)

        if (totalProducts === 0) {
            console.log('✅ No products found. Database is already clean.')
            return
        }

        // Confirm deletion
        console.log('')
        console.log('⏳ Deleting products in batches...')

        // Delete in batches (Firestore limit is 500 operations per batch)
        const batchSize = 500
        let deletedCount = 0
        let batch = writeBatch(db)
        let operationCount = 0

        for (const docSnapshot of snapshot.docs) {
            batch.delete(doc(db, PRODUCTS_COLLECTION, docSnapshot.id))
            operationCount++
            deletedCount++

            // Commit batch when reaching limit
            if (operationCount === batchSize) {
                await batch.commit()
                console.log(`   ✓ Deleted ${deletedCount}/${totalProducts} products...`)
                batch = writeBatch(db)
                operationCount = 0
            }
        }

        // Commit remaining operations
        if (operationCount > 0) {
            await batch.commit()
            console.log(`   ✓ Deleted ${deletedCount}/${totalProducts} products...`)
        }

        console.log('')
        console.log('✅ SUCCESS! All products have been deleted.')
        console.log(`📊 Total deleted: ${deletedCount} products`)
        console.log('')
        console.log('🎉 Database is now clean and ready for new products!')

    } catch (error) {
        console.error('❌ Error deleting products:', error)
        throw error
    }
}

// Run the script
deleteAllProducts()
    .then(() => {
        console.log('✅ Script completed successfully')
        process.exit(0)
    })
    .catch((error) => {
        console.error('❌ Script failed:', error)
        process.exit(1)
    })
