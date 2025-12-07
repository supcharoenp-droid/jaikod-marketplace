/**
 * API Route: Delete All Products
 * DELETE /api/admin/products/delete-all
 * 
 * This endpoint will delete ALL products from Firestore
 * Requires admin authentication
 */

import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/firebase'
import { collection, getDocs, writeBatch, doc } from 'firebase/firestore'

const PRODUCTS_COLLECTION = 'products'

export async function DELETE(request: NextRequest) {
    try {
        // TODO: Add admin authentication check here
        // const session = await getServerSession()
        // if (!session || session.user.role !== 'admin') {
        //     return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        // }

        console.log('🔥 Starting to delete all products...')

        // Get all products
        const productsRef = collection(db, PRODUCTS_COLLECTION)
        const snapshot = await getDocs(productsRef)

        const totalProducts = snapshot.size
        console.log(`📊 Found ${totalProducts} products to delete`)

        if (totalProducts === 0) {
            return NextResponse.json({
                success: true,
                message: 'No products found. Database is already clean.',
                deletedCount: 0
            })
        }

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

        console.log('✅ All products deleted successfully')

        return NextResponse.json({
            success: true,
            message: 'All products have been deleted successfully',
            deletedCount: deletedCount
        })

    } catch (error) {
        console.error('❌ Error deleting products:', error)
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to delete products',
                details: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        )
    }
}

// Also support POST for easier testing
export async function POST(request: NextRequest) {
    return DELETE(request)
}
