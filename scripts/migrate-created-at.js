/**
 * DATA MIGRATION SCRIPT
 * 
 * Backfill missing `created_at` fields in Firestore listings
 * 
 * Usage:
 *   node scripts/migrate-created-at.js --dry-run   (preview)
 *   node scripts/migrate-created-at.js             (apply)
 * 
 * Environment:
 *   GOOGLE_APPLICATION_CREDENTIALS - Path to service account JSON
 *   FIREBASE_PROJECT_ID - Firebase project ID
 */

const admin = require('firebase-admin');

// ==========================================
// CONFIGURATION
// ==========================================

const COLLECTIONS_TO_MIGRATE = ['listings', 'products'];
const BATCH_SIZE = 100;
const DRY_RUN = process.argv.includes('--dry-run');

// ==========================================
// INITIALIZE FIREBASE ADMIN
// ==========================================

function initializeFirebaseAdmin() {
    if (admin.apps.length > 0) {
        return admin.apps[0];
    }

    const projectId = process.env.FIREBASE_PROJECT_ID || 'jaikod-marketplace';
    const serviceAccountPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;

    if (serviceAccountPath) {
        console.log('🔑 Using service account from:', serviceAccountPath);
        const serviceAccount = require(serviceAccountPath);
        return admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
            projectId
        });
    }

    console.log('🔑 Using default credentials for project:', projectId);
    return admin.initializeApp({ projectId });
}

// ==========================================
// HELPER FUNCTIONS
// ==========================================

function determineFallbackDate(data) {
    // Priority 1: Use updated_at
    if (data.updated_at) {
        if (data.updated_at.toDate) {
            return data.updated_at.toDate();
        }
        if (data.updated_at._seconds) {
            return new Date(data.updated_at._seconds * 1000);
        }
        if (typeof data.updated_at === 'string') {
            return new Date(data.updated_at);
        }
    }

    // Priority 2: Use first image upload date
    if (data.images && data.images[0] && data.images[0].uploaded_at) {
        const imgDate = data.images[0].uploaded_at;
        if (imgDate.toDate) {
            return imgDate.toDate();
        }
        if (typeof imgDate === 'string') {
            return new Date(imgDate);
        }
    }

    // Priority 3: Default to 30 days ago
    const fallback = new Date();
    fallback.setDate(fallback.getDate() - 30);
    return fallback;
}

function needsMigration(data) {
    if (!data.created_at) return true;

    if (data.created_at.toDate) return false;
    if (data.created_at._seconds) return false;

    if (typeof data.created_at === 'string') {
        const date = new Date(data.created_at);
        if (!isNaN(date.getTime())) return false;
    }

    return true;
}

// ==========================================
// MIGRATION LOGIC
// ==========================================

async function migrateCollection(db, collectionName) {
    console.log(`\n📂 Processing: ${collectionName}`);
    console.log('─'.repeat(50));

    const stats = {
        collection: collectionName,
        total: 0,
        migrated: 0,
        skipped: 0,
        errors: 0
    };

    try {
        const snapshot = await db.collection(collectionName).get();
        stats.total = snapshot.size;

        console.log(`📊 Found ${stats.total} documents`);

        if (stats.total === 0) return stats;

        const docsToMigrate = [];

        snapshot.forEach((doc) => {
            const data = doc.data();

            if (needsMigration(data)) {
                docsToMigrate.push({
                    id: doc.id,
                    ref: doc.ref,
                    data,
                    newCreatedAt: determineFallbackDate(data)
                });
            } else {
                stats.skipped++;
            }
        });

        console.log(`✅ Already has created_at: ${stats.skipped}`);
        console.log(`🔄 Need migration: ${docsToMigrate.length}`);

        if (docsToMigrate.length === 0) {
            console.log('✨ All documents already have created_at!');
            return stats;
        }

        // Show samples
        console.log('\n📋 Sample documents:');
        docsToMigrate.slice(0, 5).forEach(doc => {
            const title = (doc.data.title || 'Untitled').substring(0, 40);
            console.log(`   • ${doc.id}: ${title}`);
            console.log(`     → Will set: ${doc.newCreatedAt.toISOString()}`);
        });

        if (DRY_RUN) {
            console.log('\n🧪 DRY RUN - No changes made');
            stats.migrated = docsToMigrate.length;
            return stats;
        }

        // Apply migration in batches
        console.log('\n🚀 Applying migration...');

        for (let i = 0; i < docsToMigrate.length; i += BATCH_SIZE) {
            const batch = db.batch();
            const batchDocs = docsToMigrate.slice(i, i + BATCH_SIZE);

            batchDocs.forEach(doc => {
                batch.update(doc.ref, {
                    created_at: admin.firestore.Timestamp.fromDate(doc.newCreatedAt),
                    _migration_applied: true,
                    _migration_date: admin.firestore.FieldValue.serverTimestamp()
                });
            });

            try {
                await batch.commit();
                stats.migrated += batchDocs.length;
                const batchNum = Math.floor(i / BATCH_SIZE) + 1;
                console.log(`   ✓ Batch ${batchNum}: ${batchDocs.length} migrated`);
            } catch (err) {
                console.error(`   ✗ Batch failed:`, err.message);
                stats.errors += batchDocs.length;
            }
        }

    } catch (error) {
        console.error(`❌ Error processing ${collectionName}:`, error.message);
        stats.errors++;
    }

    return stats;
}

function printReport(allStats) {
    console.log('\n');
    console.log('═'.repeat(60));
    console.log('📊 MIGRATION REPORT');
    console.log('═'.repeat(60));
    console.log(`   Date: ${new Date().toISOString()}`);
    console.log(`   Mode: ${DRY_RUN ? 'DRY RUN (preview only)' : 'LIVE (changes applied)'}`);
    console.log('─'.repeat(60));

    let totalDocs = 0;
    let totalMigrated = 0;
    let totalSkipped = 0;
    let totalErrors = 0;

    allStats.forEach(s => {
        console.log(`\n   📁 ${s.collection}:`);
        console.log(`      Total: ${s.total}`);
        console.log(`      Migrated: ${s.migrated}`);
        console.log(`      Skipped: ${s.skipped}`);
        console.log(`      Errors: ${s.errors}`);

        totalDocs += s.total;
        totalMigrated += s.migrated;
        totalSkipped += s.skipped;
        totalErrors += s.errors;
    });

    console.log('\n' + '─'.repeat(60));
    console.log(`   TOTALS: ${totalDocs} docs | ${totalMigrated} migrated | ${totalSkipped} skipped | ${totalErrors} errors`);
    console.log('═'.repeat(60));

    if (totalErrors > 0) {
        console.log('\n⚠️  Some errors occurred! Check the logs above.');
    } else if (DRY_RUN) {
        console.log('\n✅ Dry run complete!');
        console.log('   Run without --dry-run to apply changes:');
        console.log('   node scripts/migrate-created-at.js');
    } else {
        console.log('\n✅ Migration completed successfully!');
    }
}

// ==========================================
// MAIN
// ==========================================

async function main() {
    console.log('═'.repeat(60));
    console.log('🔄 CREATED_AT MIGRATION SCRIPT');
    console.log('═'.repeat(60));
    console.log(`Mode: ${DRY_RUN ? '🧪 DRY RUN (no changes)' : '🚀 LIVE (will apply changes)'}`);
    console.log(`Collections: ${COLLECTIONS_TO_MIGRATE.join(', ')}`);
    console.log('═'.repeat(60));

    try {
        initializeFirebaseAdmin();
        const db = admin.firestore();

        console.log('\n✅ Firebase Admin initialized\n');

        const allStats = [];

        for (const collection of COLLECTIONS_TO_MIGRATE) {
            const stats = await migrateCollection(db, collection);
            allStats.push(stats);
        }

        printReport(allStats);

    } catch (error) {
        console.error('\n❌ FATAL ERROR:', error.message);
        console.error('\nMake sure you have:');
        console.error('  1. Set GOOGLE_APPLICATION_CREDENTIALS env variable');
        console.error('  2. Or running in a GCP environment with default credentials');
        process.exit(1);
    }
}

main().catch(console.error);
