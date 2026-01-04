/**
 * DATA MIGRATION SCRIPT
 * 
 * Backfill missing `created_at` fields in Firestore listings
 * 
 * Usage:
 *   npm run migrate:created-at:dry   (preview only)
 *   npm run migrate:created-at       (apply changes)
 * 
 * @version 1.0.0
 */

// eslint-disable-next-line @typescript-eslint/no-var-requires
const admin = require('firebase-admin')

// ==========================================
// CONFIGURATION
// ==========================================

const COLLECTIONS_TO_MIGRATE = ['listings', 'products']
const BATCH_SIZE = 100
const DRY_RUN = process.argv.includes('--dry-run')

// ==========================================
// TYPES
// ==========================================

interface MigrationStats {
    collection: string
    total: number
    migrated: number
    skipped: number
    errors: number
}

interface DocumentToMigrate {
    id: string
    ref: FirebaseFirestore.DocumentReference
    data: FirebaseFirestore.DocumentData
    newCreatedAt: Date
}

// ==========================================
// INITIALIZE FIREBASE ADMIN
// ==========================================

function initializeFirebaseAdmin() {
    if (admin.apps.length > 0) {
        return admin.apps[0]
    }

    const projectId = process.env.FIREBASE_PROJECT_ID || 'jaikod-marketplace'
    const serviceAccountPath = process.env.GOOGLE_APPLICATION_CREDENTIALS

    if (serviceAccountPath) {
        console.log('🔑 Using service account from:', serviceAccountPath)
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const serviceAccount = require(serviceAccountPath)
        return admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
            projectId
        })
    }

    console.log('🔑 Using default credentials for project:', projectId)
    return admin.initializeApp({ projectId })
}

// ==========================================
// HELPER FUNCTIONS
// ==========================================

function determineFallbackDate(data: FirebaseFirestore.DocumentData): Date {
    // Priority 1: Use updated_at
    if (data.updated_at) {
        if (data.updated_at.toDate) {
            return data.updated_at.toDate()
        }
        if (data.updated_at._seconds) {
            return new Date(data.updated_at._seconds * 1000)
        }
        if (typeof data.updated_at === 'string') {
            return new Date(data.updated_at)
        }
    }

    // Priority 2: Use first image upload date
    if (data.images?.[0]?.uploaded_at) {
        const imgDate = data.images[0].uploaded_at
        if (imgDate.toDate) {
            return imgDate.toDate()
        }
        if (typeof imgDate === 'string') {
            return new Date(imgDate)
        }
    }

    // Priority 3: Default to 30 days ago
    const fallback = new Date()
    fallback.setDate(fallback.getDate() - 30)
    return fallback
}

function needsMigration(data: FirebaseFirestore.DocumentData): boolean {
    if (!data.created_at) return true

    if (data.created_at.toDate) return false
    if (data.created_at._seconds) return false

    if (typeof data.created_at === 'string') {
        const date = new Date(data.created_at)
        if (!isNaN(date.getTime())) return false
    }

    return true
}

// ==========================================
// MIGRATION LOGIC
// ==========================================

async function migrateCollection(
    db: FirebaseFirestore.Firestore,
    collectionName: string
): Promise<MigrationStats> {
    console.log(`\n📂 Processing: ${collectionName}`)
    console.log('─'.repeat(50))

    const stats: MigrationStats = {
        collection: collectionName,
        total: 0,
        migrated: 0,
        skipped: 0,
        errors: 0
    }

    try {
        const snapshot = await db.collection(collectionName).get()
        stats.total = snapshot.size

        console.log(`📊 Found ${stats.total} documents`)

        if (stats.total === 0) return stats

        const docsToMigrate: DocumentToMigrate[] = []

        snapshot.forEach((doc: FirebaseFirestore.QueryDocumentSnapshot) => {
            const data = doc.data()

            if (needsMigration(data)) {
                docsToMigrate.push({
                    id: doc.id,
                    ref: doc.ref,
                    data,
                    newCreatedAt: determineFallbackDate(data)
                })
            } else {
                stats.skipped++
            }
        })

        console.log(`✅ Already has created_at: ${stats.skipped}`)
        console.log(`🔄 Need migration: ${docsToMigrate.length}`)

        if (docsToMigrate.length === 0) {
            console.log('✨ All documents already have created_at!')
            return stats
        }

        // Show samples
        console.log('\n📋 Sample documents:')
        docsToMigrate.slice(0, 3).forEach(doc => {
            const title = doc.data.title?.substring(0, 40) || 'Untitled'
            console.log(`   • ${doc.id}: ${title}`)
            console.log(`     → Will set created_at: ${doc.newCreatedAt.toISOString()}`)
        })

        if (DRY_RUN) {
            console.log('\n🧪 DRY RUN - No changes made')
            stats.migrated = docsToMigrate.length
            return stats
        }

        // Apply migration in batches
        console.log('\n🚀 Applying migration...')

        for (let i = 0; i < docsToMigrate.length; i += BATCH_SIZE) {
            const batch = db.batch()
            const batchDocs = docsToMigrate.slice(i, i + BATCH_SIZE)

            batchDocs.forEach(doc => {
                batch.update(doc.ref, {
                    created_at: admin.firestore.Timestamp.fromDate(doc.newCreatedAt),
                    _migration_applied: true,
                    _migration_date: admin.firestore.FieldValue.serverTimestamp()
                })
            })

            try {
                await batch.commit()
                stats.migrated += batchDocs.length
                const batchNum = Math.floor(i / BATCH_SIZE) + 1
                console.log(`   ✓ Batch ${batchNum}: ${batchDocs.length} migrated`)
            } catch (err) {
                console.error(`   ✗ Batch failed:`, err)
                stats.errors += batchDocs.length
            }
        }

    } catch (error) {
        console.error(`❌ Error processing ${collectionName}:`, error)
        stats.errors++
    }

    return stats
}

function printReport(allStats: MigrationStats[]): void {
    console.log('\n')
    console.log('═'.repeat(60))
    console.log('📊 MIGRATION REPORT')
    console.log('═'.repeat(60))
    console.log(`   Date: ${new Date().toISOString()}`)
    console.log(`   Mode: ${DRY_RUN ? 'DRY RUN' : 'LIVE'}`)
    console.log('─'.repeat(60))

    let totalMigrated = 0
    let totalErrors = 0

    allStats.forEach(s => {
        console.log(`\n   📁 ${s.collection}:`)
        console.log(`      Total: ${s.total} | Migrated: ${s.migrated} | Skipped: ${s.skipped} | Errors: ${s.errors}`)
        totalMigrated += s.migrated
        totalErrors += s.errors
    })

    console.log('\n' + '═'.repeat(60))

    if (totalErrors > 0) {
        console.log('⚠️  Some errors occurred!')
    } else if (DRY_RUN) {
        console.log('✅ Dry run complete! Run without --dry-run to apply.')
    } else {
        console.log('✅ Migration complete!')
    }
}

// ==========================================
// MAIN
// ==========================================

async function main(): Promise<void> {
    console.log('═'.repeat(60))
    console.log('🔄 CREATED_AT MIGRATION SCRIPT')
    console.log('═'.repeat(60))
    console.log(`Mode: ${DRY_RUN ? '🧪 DRY RUN' : '🚀 LIVE'}`)

    try {
        initializeFirebaseAdmin()
        const db = admin.firestore()

        console.log('✅ Firebase initialized')

        const allStats: MigrationStats[] = []

        for (const collection of COLLECTIONS_TO_MIGRATE) {
            const stats = await migrateCollection(db, collection)
            allStats.push(stats)
        }

        printReport(allStats)

    } catch (error) {
        console.error('❌ FATAL ERROR:', error)
        process.exit(1)
    }
}

main().catch(console.error)
