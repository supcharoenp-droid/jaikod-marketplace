/**
 * ORPHANED LISTINGS AUDIT SCRIPT
 * 
 * Purpose: Scan Firestore for listings/products with seller_id that don't exist in users collection
 * Output: Detailed report of data inconsistencies
 * 
 * Usage: npx ts-node scripts/audit-orphaned-listings.ts
 */

import { initializeApp, cert } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'
import * as fs from 'fs'
import * as path from 'path'

// Initialize Firebase Admin
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

interface OrphanedListing {
    id: string
    collection: 'listings' | 'products'
    seller_id: string
    seller_name?: string
    title: string
    created_at: Date
    status: string
    category_id?: number
    price?: number
}

interface AuditReport {
    timestamp: Date
    totalListings: number
    totalProducts: number
    totalUsers: number
    orphanedListings: OrphanedListing[]
    orphanedProducts: OrphanedListing[]
    uniqueOrphanedSellerIds: string[]
    recommendations: string[]
}

async function scanOrphanedListings(): Promise<AuditReport> {
    console.log('🔍 Starting Orphaned Listings Audit...\n')

    // Step 1: Get all users
    console.log('📊 Step 1/4: Fetching all users...')
    const usersSnapshot = await db.collection('users').get()
    const validSellerIds = new Set<string>()

    usersSnapshot.forEach(doc => {
        validSellerIds.add(doc.id)
    })

    console.log(`   ✅ Found ${validSellerIds.size} users in database\n`)

    // Step 2: Scan listings collection
    console.log('📊 Step 2/4: Scanning listings collection...')
    const listingsSnapshot = await db.collection('listings').get()
    const orphanedListings: OrphanedListing[] = []

    listingsSnapshot.forEach(doc => {
        const data = doc.data()
        const sellerId = data.seller_id || data.sellerId

        if (sellerId && !validSellerIds.has(sellerId)) {
            orphanedListings.push({
                id: doc.id,
                collection: 'listings',
                seller_id: sellerId,
                seller_name: data.seller_name || data.sellerName,
                title: data.title || 'Untitled',
                created_at: data.created_at?.toDate() || new Date(),
                status: data.status || 'unknown',
                category_id: data.category_id,
                price: data.price
            })
        }
    })

    console.log(`   ✅ Scanned ${listingsSnapshot.size} listings`)
    console.log(`   ⚠️  Found ${orphanedListings.length} orphaned listings\n`)

    // Step 3: Scan products collection
    console.log('📊 Step 3/4: Scanning products collection...')
    const productsSnapshot = await db.collection('products').get()
    const orphanedProducts: OrphanedListing[] = []

    productsSnapshot.forEach(doc => {
        const data = doc.data()
        const sellerId = data.seller_id || data.sellerId

        if (sellerId && !validSellerIds.has(sellerId)) {
            orphanedProducts.push({
                id: doc.id,
                collection: 'products',
                seller_id: sellerId,
                seller_name: data.seller_name || data.sellerName,
                title: data.title || data.name || 'Untitled',
                created_at: data.created_at?.toDate() || data.createdAt?.toDate() || new Date(),
                status: data.status || 'unknown',
                category_id: data.categoryId || data.category_id,
                price: data.price
            })
        }
    })

    console.log(`   ✅ Scanned ${productsSnapshot.size} products`)
    console.log(`   ⚠️  Found ${orphanedProducts.length} orphaned products\n`)

    // Step 4: Analyze and generate recommendations
    console.log('📊 Step 4/4: Analyzing data and generating recommendations...\n')

    const allOrphaned = [...orphanedListings, ...orphanedProducts]
    const uniqueOrphanedSellerIds = Array.from(
        new Set(allOrphaned.map(item => item.seller_id))
    )

    const recommendations: string[] = []

    if (allOrphaned.length === 0) {
        recommendations.push('✅ No orphaned listings found. Data integrity is good!')
    } else {
        recommendations.push(`⚠️  Found ${allOrphaned.length} total orphaned items from ${uniqueOrphanedSellerIds.length} missing sellers`)
        recommendations.push('')
        recommendations.push('Recommended Actions:')
        recommendations.push('1. Review orphaned seller IDs and check if they were deleted users')
        recommendations.push('2. For each orphaned seller ID:')
        recommendations.push('   a) If user was accidentally deleted → Restore user account')
        recommendations.push('   b) If user intentionally deleted → Reassign listings to system account')
        recommendations.push('   c) If seller_id was wrong → Update to correct seller_id')
        recommendations.push('3. Add Firestore Security Rules to prevent future orphaned data')
        recommendations.push('4. Add validation in listing creation flow')
    }

    const report: AuditReport = {
        timestamp: new Date(),
        totalListings: listingsSnapshot.size,
        totalProducts: productsSnapshot.size,
        totalUsers: usersSnapshot.size,
        orphanedListings,
        orphanedProducts,
        uniqueOrphanedSellerIds,
        recommendations
    }

    return report
}

async function generateReport(report: AuditReport) {
    console.log('\n' + '='.repeat(80))
    console.log('📄 ORPHANED LISTINGS AUDIT REPORT')
    console.log('='.repeat(80))
    console.log(`Generated: ${report.timestamp.toLocaleString('th-TH')}`)
    console.log('')
    console.log('📊 Summary:')
    console.log(`   Total Users:    ${report.totalUsers}`)
    console.log(`   Total Listings: ${report.totalListings}`)
    console.log(`   Total Products: ${report.totalProducts}`)
    console.log('')
    console.log(`⚠️  Orphaned Items: ${report.orphanedListings.length + report.orphanedProducts.length}`)
    console.log(`   - From Listings: ${report.orphanedListings.length}`)
    console.log(`   - From Products: ${report.orphanedProducts.length}`)
    console.log(`   - Unique Missing Sellers: ${report.uniqueOrphanedSellerIds.length}`)
    console.log('')

    if (report.orphanedListings.length > 0 || report.orphanedProducts.length > 0) {
        console.log('🔍 Orphaned Seller IDs:')
        report.uniqueOrphanedSellerIds.forEach((sellerId, index) => {
            const items = [...report.orphanedListings, ...report.orphanedProducts]
                .filter(item => item.seller_id === sellerId)
            console.log(`   ${index + 1}. ${sellerId}`)
            console.log(`      - Found in ${items.length} item(s)`)
            console.log(`      - Seller Name: ${items[0].seller_name || 'Unknown'}`)
        })
        console.log('')

        console.log('📋 Detailed Orphaned Items:')
        console.log('')

        if (report.orphanedListings.length > 0) {
            console.log('   Listings Collection:')
            report.orphanedListings.slice(0, 10).forEach((item, index) => {
                console.log(`   ${index + 1}. ${item.title}`)
                console.log(`      ID: ${item.id}`)
                console.log(`      Seller ID: ${item.seller_id}`)
                console.log(`      Seller Name: ${item.seller_name || 'N/A'}`)
                console.log(`      Status: ${item.status}`)
                console.log(`      Price: ฿${item.price?.toLocaleString() || 'N/A'}`)
                console.log(`      Created: ${item.created_at.toLocaleDateString('th-TH')}`)
                console.log('')
            })
            if (report.orphanedListings.length > 10) {
                console.log(`   ... and ${report.orphanedListings.length - 10} more`)
                console.log('')
            }
        }

        if (report.orphanedProducts.length > 0) {
            console.log('   Products Collection:')
            report.orphanedProducts.slice(0, 10).forEach((item, index) => {
                console.log(`   ${index + 1}. ${item.title}`)
                console.log(`      ID: ${item.id}`)
                console.log(`      Seller ID: ${item.seller_id}`)
                console.log(`      Seller Name: ${item.seller_name || 'N/A'}`)
                console.log(`      Status: ${item.status}`)
                console.log(`      Price: ฿${item.price?.toLocaleString() || 'N/A'}`)
                console.log(`      Created: ${item.created_at.toLocaleDateString('th-TH')}`)
                console.log('')
            })
            if (report.orphanedProducts.length > 10) {
                console.log(`   ... and ${report.orphanedProducts.length - 10} more`)
                console.log('')
            }
        }
    }

    console.log('💡 Recommendations:')
    report.recommendations.forEach(rec => {
        console.log(`   ${rec}`)
    })
    console.log('')
    console.log('='.repeat(80))

    // Save JSON report
    const reportsDir = path.join(__dirname, '..', 'reports')
    if (!fs.existsSync(reportsDir)) {
        fs.mkdirSync(reportsDir, { recursive: true })
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
    const reportPath = path.join(reportsDir, `orphaned-listings-${timestamp}.json`)

    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2))
    console.log(`\n💾 Full report saved to: ${reportPath}`)
}

// Main execution
async function main() {
    try {
        const report = await scanOrphanedListings()
        await generateReport(report)

        console.log('\n✅ Audit completed successfully!')
        process.exit(0)
    } catch (error) {
        console.error('\n❌ Audit failed:', error)
        process.exit(1)
    }
}

main()
