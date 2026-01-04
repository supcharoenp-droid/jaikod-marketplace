/**
 * DATA AUDIT RUNNER
 * 
 * Script สำหรับ run การตรวจสอบ data integrity
 * ใช้: npx ts-node scripts/run-data-audit.ts
 */

import { initializeApp, getApps, cert } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'

// Initialize Firebase Admin (for server-side)
if (getApps().length === 0) {
    // Use service account or emulator
    try {
        initializeApp({
            projectId: process.env.FIREBASE_PROJECT_ID || 'jaikod-5cdd5'
        })
    } catch (e) {
        console.log('Firebase already initialized')
    }
}

const db = getFirestore()

// ==========================================
// TYPES
// ==========================================

interface AuditIssue {
    docId: string
    issueType: string
    field?: string
    message: string
    severity: 'low' | 'medium' | 'high'
}

interface CollectionAudit {
    collection: string
    totalRecords: number
    issues: AuditIssue[]
    summary: {
        healthy: number
        needsFix: number
        critical: number
    }
}

// ==========================================
// AUDIT FUNCTIONS
// ==========================================

async function auditListings(): Promise<CollectionAudit> {
    console.log('\n📋 Auditing listings collection...')
    const issues: AuditIssue[] = []

    const snapshot = await db.collection('listings').limit(500).get()
    const totalRecords = snapshot.size
    console.log(`   Found ${totalRecords} listings`)

    const sellerCache = new Map<string, boolean>()

    for (const doc of snapshot.docs) {
        const data = doc.data()
        const docId = doc.id

        // Check seller_id
        if (!data.seller_id) {
            issues.push({
                docId,
                issueType: 'missing_field',
                field: 'seller_id',
                message: 'Missing seller_id',
                severity: 'high'
            })
        } else {
            // Check if seller exists (with cache)
            if (!sellerCache.has(data.seller_id)) {
                const sellerDoc = await db.collection('users').doc(data.seller_id).get()
                sellerCache.set(data.seller_id, sellerDoc.exists)
            }

            if (!sellerCache.get(data.seller_id)) {
                issues.push({
                    docId,
                    issueType: 'orphaned',
                    field: 'seller_id',
                    message: `Seller ${data.seller_id} does not exist`,
                    severity: 'high'
                })
            }
        }

        // Check title
        if (!data.title || data.title.length < 5) {
            issues.push({
                docId,
                issueType: 'missing_field',
                field: 'title',
                message: 'Missing or short title',
                severity: 'high'
            })
        }

        // Check price
        if (data.price === undefined || data.price === null || data.price <= 0) {
            issues.push({
                docId,
                issueType: 'invalid_value',
                field: 'price',
                message: `Invalid price: ${data.price}`,
                severity: 'high'
            })
        }

        // Check timestamps
        if (!data.created_at && !data.createdAt) {
            issues.push({
                docId,
                issueType: 'missing_field',
                field: 'created_at',
                message: 'Missing created_at timestamp',
                severity: 'medium'
            })
        }

        // Check images
        if (!data.images || !Array.isArray(data.images) || data.images.length === 0) {
            issues.push({
                docId,
                issueType: 'missing_field',
                field: 'images',
                message: 'No images found',
                severity: 'medium'
            })
        }

        // Check category_id
        if (!data.category_id && !data.categoryId) {
            issues.push({
                docId,
                issueType: 'missing_field',
                field: 'category_id',
                message: 'Missing category_id',
                severity: 'medium'
            })
        }

        // Check status
        const validStatuses = ['draft', 'pending', 'active', 'sold', 'archived', 'rejected']
        if (data.status && !validStatuses.includes(data.status)) {
            issues.push({
                docId,
                issueType: 'invalid_value',
                field: 'status',
                message: `Invalid status: ${data.status}`,
                severity: 'low'
            })
        }
    }

    const critical = issues.filter(i => i.severity === 'high').length
    const needsFix = issues.filter(i => i.severity === 'medium').length
    const healthy = totalRecords - new Set(issues.map(i => i.docId)).size

    return {
        collection: 'listings',
        totalRecords,
        issues,
        summary: { healthy, needsFix, critical }
    }
}

async function auditUsers(): Promise<CollectionAudit> {
    console.log('\n👤 Auditing users collection...')
    const issues: AuditIssue[] = []

    const snapshot = await db.collection('users').limit(500).get()
    const totalRecords = snapshot.size
    console.log(`   Found ${totalRecords} users`)

    for (const doc of snapshot.docs) {
        const data = doc.data()
        const docId = doc.id

        // Check display_name
        if (!data.display_name && !data.displayName && !data.name) {
            issues.push({
                docId,
                issueType: 'missing_field',
                field: 'display_name',
                message: 'Missing display name',
                severity: 'low'
            })
        }

        // Check email (for non-placeholder users)
        if (!data.isPlaceholder && !data.email) {
            issues.push({
                docId,
                issueType: 'missing_field',
                field: 'email',
                message: 'Missing email',
                severity: 'medium'
            })
        }

        // Check timestamps
        if (!data.created_at && !data.createdAt) {
            issues.push({
                docId,
                issueType: 'missing_field',
                field: 'created_at',
                message: 'Missing created_at timestamp',
                severity: 'low'
            })
        }
    }

    const critical = issues.filter(i => i.severity === 'high').length
    const needsFix = issues.filter(i => i.severity === 'medium').length
    const healthy = totalRecords - new Set(issues.map(i => i.docId)).size

    return {
        collection: 'users',
        totalRecords,
        issues,
        summary: { healthy, needsFix, critical }
    }
}

async function auditProducts(): Promise<CollectionAudit> {
    console.log('\n📦 Auditing products (legacy) collection...')
    const issues: AuditIssue[] = []

    const snapshot = await db.collection('products').limit(500).get()
    const totalRecords = snapshot.size
    console.log(`   Found ${totalRecords} products (legacy)`)

    for (const doc of snapshot.docs) {
        const data = doc.data()
        const docId = doc.id

        // Check owner
        if (!data.userId && !data.user_id && !data.sellerId) {
            issues.push({
                docId,
                issueType: 'missing_field',
                field: 'userId',
                message: 'Missing owner ID',
                severity: 'high'
            })
        }

        // Check if migrated
        if (!data.migrated_to_listings) {
            issues.push({
                docId,
                issueType: 'stale_data',
                field: 'migrated_to_listings',
                message: 'Legacy product not migrated',
                severity: 'low'
            })
        }
    }

    const critical = issues.filter(i => i.severity === 'high').length
    const needsFix = issues.filter(i => i.severity === 'medium').length
    const healthy = totalRecords - new Set(issues.map(i => i.docId)).size

    return {
        collection: 'products',
        totalRecords,
        issues,
        summary: { healthy, needsFix, critical }
    }
}

// ==========================================
// REPORT GENERATION
// ==========================================

function generateReport(audits: CollectionAudit[]): void {
    console.log('\n')
    console.log('═══════════════════════════════════════════════════════════')
    console.log('              📊 JAIKOD DATA AUDIT REPORT                   ')
    console.log('═══════════════════════════════════════════════════════════')
    console.log(`Generated: ${new Date().toISOString()}`)
    console.log('')

    let totalRecords = 0
    let totalHealthy = 0
    let totalCritical = 0
    let totalNeedsFix = 0

    for (const audit of audits) {
        totalRecords += audit.totalRecords
        totalHealthy += audit.summary.healthy
        totalCritical += audit.summary.critical
        totalNeedsFix += audit.summary.needsFix

        const healthPercent = audit.totalRecords > 0
            ? Math.round((audit.summary.healthy / audit.totalRecords) * 100)
            : 100

        const statusIcon = healthPercent >= 90 ? '✅' : healthPercent >= 70 ? '🟡' : '🔴'

        console.log(`${statusIcon} ${audit.collection.toUpperCase()}`)
        console.log(`   Total: ${audit.totalRecords} | Healthy: ${audit.summary.healthy} | Issues: ${audit.issues.length}`)
        console.log(`   Health: ${healthPercent}%`)

        if (audit.summary.critical > 0) {
            console.log(`   🔴 Critical: ${audit.summary.critical}`)
        }
        if (audit.summary.needsFix > 0) {
            console.log(`   🟡 Needs Fix: ${audit.summary.needsFix}`)
        }
        console.log('')
    }

    // Overall summary
    const overallHealth = totalRecords > 0
        ? Math.round((totalHealthy / totalRecords) * 100)
        : 100

    console.log('───────────────────────────────────────────────────────────')
    console.log('                     OVERALL SUMMARY                        ')
    console.log('───────────────────────────────────────────────────────────')
    console.log(`Total Records: ${totalRecords}`)
    console.log(`Healthy Records: ${totalHealthy}`)
    console.log(`Overall Health: ${overallHealth}%`)
    console.log('')

    if (overallHealth >= 90) {
        console.log('🎉 EXCELLENT! System data is in great shape.')
    } else if (overallHealth >= 70) {
        console.log('👍 GOOD. Some issues need attention.')
    } else {
        console.log('⚠️ ATTENTION NEEDED. Significant data issues detected.')
    }

    // Top issues
    if (totalCritical > 0 || totalNeedsFix > 0) {
        console.log('')
        console.log('───────────────────────────────────────────────────────────')
        console.log('                   RECOMMENDED ACTIONS                      ')
        console.log('───────────────────────────────────────────────────────────')

        if (totalCritical > 0) {
            console.log(`🔴 Fix ${totalCritical} critical issues (orphaned sellers, missing required fields)`)
        }
        if (totalNeedsFix > 0) {
            console.log(`🟡 Address ${totalNeedsFix} medium-priority issues (missing timestamps, images)`)
        }

        console.log('')
        console.log('Run migration tools:')
        console.log('  - addMissingTimestamps() - Fix timestamp issues')
        console.log('  - fixOrphanedListings() - Create placeholder sellers')
        console.log('  - standardizeFieldNames() - Normalize field names')
    }

    console.log('')
    console.log('═══════════════════════════════════════════════════════════')
}

// ==========================================
// MAIN
// ==========================================

async function main() {
    console.log('🚀 Starting JaiKod Data Audit...')
    console.log('   This may take a few minutes...')

    try {
        const audits: CollectionAudit[] = []

        audits.push(await auditListings())
        audits.push(await auditUsers())
        audits.push(await auditProducts())

        generateReport(audits)

    } catch (error) {
        console.error('❌ Audit failed:', error)
        process.exit(1)
    }
}

main()
