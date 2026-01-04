/**
 * DATA MIGRATION & AUDIT UTILITIES
 * 
 * เครื่องมือสำหรับ:
 * 1. ตรวจสอบ data integrity
 * 2. แก้ไข orphaned records
 * 3. Standardize field names
 * 4. Add missing timestamps
 * 
 * ⚠️ WARNING: Run in development first, backup before production
 * 
 * @version 1.0.0
 * @date 2024-12-29
 */

import { db } from '@/lib/firebase'
import {
    collection,
    query,
    getDocs,
    doc,
    updateDoc,
    writeBatch,
    Timestamp,
    where,
    limit,
    getDoc
} from 'firebase/firestore'

// ==========================================
// TYPES
// ==========================================

export interface AuditResult {
    collection: string
    totalRecords: number
    issues: AuditIssue[]
    summary: {
        healthy: number
        needsFix: number
        critical: number
    }
}

export interface AuditIssue {
    docId: string
    issueType: 'missing_field' | 'orphaned' | 'invalid_type' | 'stale_data'
    field?: string
    message: string
    severity: 'low' | 'medium' | 'high'
    autoFix?: () => Promise<void>
}

export interface MigrationResult {
    success: boolean
    recordsProcessed: number
    recordsFixed: number
    errors: string[]
}

// ==========================================
// AUDIT FUNCTIONS
// ==========================================

/**
 * Audit listings collection for data issues
 */
export async function auditListings(limit_count: number = 100): Promise<AuditResult> {
    const issues: AuditIssue[] = []
    let totalRecords = 0

    try {
        const listingsRef = collection(db, 'listings')
        const q = query(listingsRef, limit(limit_count))
        const snapshot = await getDocs(q)

        totalRecords = snapshot.size

        for (const docSnap of snapshot.docs) {
            const data = docSnap.data()
            const docId = docSnap.id

            // Check required fields
            if (!data.seller_id) {
                issues.push({
                    docId,
                    issueType: 'missing_field',
                    field: 'seller_id',
                    message: 'Missing seller_id',
                    severity: 'high'
                })
            }

            if (!data.title) {
                issues.push({
                    docId,
                    issueType: 'missing_field',
                    field: 'title',
                    message: 'Missing title',
                    severity: 'high'
                })
            }

            if (data.price === undefined || data.price === null) {
                issues.push({
                    docId,
                    issueType: 'missing_field',
                    field: 'price',
                    message: 'Missing price',
                    severity: 'high'
                })
            }

            // Check timestamps
            if (!data.created_at) {
                issues.push({
                    docId,
                    issueType: 'missing_field',
                    field: 'created_at',
                    message: 'Missing created_at timestamp',
                    severity: 'medium'
                })
            }

            // Check seller exists
            if (data.seller_id) {
                const sellerRef = doc(db, 'users', data.seller_id)
                const sellerSnap = await getDoc(sellerRef)

                if (!sellerSnap.exists()) {
                    issues.push({
                        docId,
                        issueType: 'orphaned',
                        field: 'seller_id',
                        message: `Seller ${data.seller_id} does not exist`,
                        severity: 'high'
                    })
                }
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

            // Check status
            const validStatuses = ['draft', 'pending', 'active', 'sold', 'archived', 'rejected']
            if (!validStatuses.includes(data.status)) {
                issues.push({
                    docId,
                    issueType: 'invalid_type',
                    field: 'status',
                    message: `Invalid status: ${data.status}`,
                    severity: 'low'
                })
            }
        }

    } catch (error) {
        console.error('[Audit] Error auditing listings:', error)
    }

    const critical = issues.filter(i => i.severity === 'high').length
    const needsFix = issues.filter(i => i.severity === 'medium').length
    const healthy = totalRecords - (critical + needsFix)

    return {
        collection: 'listings',
        totalRecords,
        issues,
        summary: { healthy, needsFix, critical }
    }
}

/**
 * Audit users collection
 */
export async function auditUsers(limit_count: number = 100): Promise<AuditResult> {
    const issues: AuditIssue[] = []
    let totalRecords = 0

    try {
        const usersRef = collection(db, 'users')
        const q = query(usersRef, limit(limit_count))
        const snapshot = await getDocs(q)

        totalRecords = snapshot.size

        for (const docSnap of snapshot.docs) {
            const data = docSnap.data()
            const docId = docSnap.id

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

            // Check email
            if (!data.email) {
                issues.push({
                    docId,
                    issueType: 'missing_field',
                    field: 'email',
                    message: 'Missing email',
                    severity: 'medium'
                })
            }

            // Check created_at
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

    } catch (error) {
        console.error('[Audit] Error auditing users:', error)
    }

    const critical = issues.filter(i => i.severity === 'high').length
    const needsFix = issues.filter(i => i.severity === 'medium').length
    const healthy = totalRecords - (critical + needsFix)

    return {
        collection: 'users',
        totalRecords,
        issues,
        summary: { healthy, needsFix, critical }
    }
}

// ==========================================
// MIGRATION FUNCTIONS
// ==========================================

/**
 * Add missing timestamps to listings
 */
export async function addMissingTimestamps(): Promise<MigrationResult> {
    const result: MigrationResult = {
        success: false,
        recordsProcessed: 0,
        recordsFixed: 0,
        errors: []
    }

    try {
        const listingsRef = collection(db, 'listings')
        const snapshot = await getDocs(listingsRef)

        const batch = writeBatch(db)
        let batchCount = 0
        const MAX_BATCH = 500

        for (const docSnap of snapshot.docs) {
            const data = docSnap.data()
            result.recordsProcessed++

            const updates: Record<string, any> = {}

            // Add created_at if missing
            if (!data.created_at) {
                // Try to use _createdAt, createdAt, or current time
                updates.created_at = data._createdAt || data.createdAt || Timestamp.now()
            }

            // Add updated_at if missing
            if (!data.updated_at) {
                updates.updated_at = data.created_at || Timestamp.now()
            }

            if (Object.keys(updates).length > 0) {
                batch.update(docSnap.ref, updates)
                batchCount++
                result.recordsFixed++

                // Commit batch if full
                if (batchCount >= MAX_BATCH) {
                    await batch.commit()
                    batchCount = 0
                }
            }
        }

        // Commit remaining
        if (batchCount > 0) {
            await batch.commit()
        }

        result.success = true
        console.log(`[Migration] Fixed ${result.recordsFixed} records with missing timestamps`)

    } catch (error) {
        result.errors.push(String(error))
        console.error('[Migration] Error:', error)
    }

    return result
}

/**
 * Standardize field names (camelCase → snake_case)
 */
export async function standardizeFieldNames(): Promise<MigrationResult> {
    const result: MigrationResult = {
        success: false,
        recordsProcessed: 0,
        recordsFixed: 0,
        errors: []
    }

    // Field mapping: camelCase → snake_case
    const fieldMapping: Record<string, string> = {
        'sellerId': 'seller_id',
        'categoryId': 'category_id',
        'subcategoryId': 'subcategory_id',
        'createdAt': 'created_at',
        'updatedAt': 'updated_at',
        'thumbnailUrl': 'thumbnail_url',
        'originalPrice': 'original_price',
        'listingCode': 'listing_code',
        'aiContent': 'ai_content',
        'sellerInfo': 'seller_info',
        'templateData': 'template_data'
    }

    try {
        const listingsRef = collection(db, 'listings')
        const snapshot = await getDocs(listingsRef)

        const batch = writeBatch(db)
        let batchCount = 0
        const MAX_BATCH = 500

        for (const docSnap of snapshot.docs) {
            const data = docSnap.data()
            result.recordsProcessed++

            const updates: Record<string, any> = {}

            // Check for camelCase fields and migrate
            for (const [camel, snake] of Object.entries(fieldMapping)) {
                if (data[camel] !== undefined && data[snake] === undefined) {
                    updates[snake] = data[camel]
                    // Note: We don't delete old fields to maintain backward compatibility
                }
            }

            if (Object.keys(updates).length > 0) {
                batch.update(docSnap.ref, updates)
                batchCount++
                result.recordsFixed++

                if (batchCount >= MAX_BATCH) {
                    await batch.commit()
                    batchCount = 0
                }
            }
        }

        if (batchCount > 0) {
            await batch.commit()
        }

        result.success = true
        console.log(`[Migration] Standardized ${result.recordsFixed} records`)

    } catch (error) {
        result.errors.push(String(error))
        console.error('[Migration] Error:', error)
    }

    return result
}

/**
 * Fix orphaned listings (create placeholder seller if needed)
 */
export async function fixOrphanedListings(): Promise<MigrationResult> {
    const result: MigrationResult = {
        success: false,
        recordsProcessed: 0,
        recordsFixed: 0,
        errors: []
    }

    try {
        const listingsRef = collection(db, 'listings')
        const snapshot = await getDocs(listingsRef)

        const checkedSellers = new Set<string>()
        const orphanedSellers = new Set<string>()

        // First pass: identify orphaned sellers
        for (const docSnap of snapshot.docs) {
            const data = docSnap.data()
            const sellerId = data.seller_id

            if (!sellerId || checkedSellers.has(sellerId)) continue

            checkedSellers.add(sellerId)
            result.recordsProcessed++

            const sellerRef = doc(db, 'users', sellerId)
            const sellerSnap = await getDoc(sellerRef)

            if (!sellerSnap.exists()) {
                orphanedSellers.add(sellerId)
            }
        }

        // Second pass: create placeholder users
        const batch = writeBatch(db)

        for (const sellerId of orphanedSellers) {
            const userRef = doc(db, 'users', sellerId)
            batch.set(userRef, {
                uid: sellerId,
                display_name: 'Unknown Seller',
                email: null,
                isPlaceholder: true,
                created_at: Timestamp.now(),
                updated_at: Timestamp.now(),
                trust_score: 0,
                is_active: false
            })
            result.recordsFixed++
        }

        if (orphanedSellers.size > 0) {
            await batch.commit()
        }

        result.success = true
        console.log(`[Migration] Created ${result.recordsFixed} placeholder sellers`)

    } catch (error) {
        result.errors.push(String(error))
        console.error('[Migration] Error:', error)
    }

    return result
}

// ==========================================
// FULL AUDIT REPORT
// ==========================================

export interface FullAuditReport {
    timestamp: Date
    collections: AuditResult[]
    overallHealth: number // 0-100
    recommendations: string[]
}

/**
 * Run full system audit
 */
export async function runFullAudit(): Promise<FullAuditReport> {
    console.log('[Audit] Starting full system audit...')

    const listingsAudit = await auditListings(500)
    const usersAudit = await auditUsers(500)

    const collections = [listingsAudit, usersAudit]

    // Calculate overall health
    const totalRecords = collections.reduce((sum, c) => sum + c.totalRecords, 0)
    const totalHealthy = collections.reduce((sum, c) => sum + c.summary.healthy, 0)
    const overallHealth = totalRecords > 0 ? Math.round((totalHealthy / totalRecords) * 100) : 100

    // Generate recommendations
    const recommendations: string[] = []

    if (listingsAudit.summary.critical > 0) {
        recommendations.push(`🔴 Fix ${listingsAudit.summary.critical} critical listing issues (missing seller/title/price)`)
    }

    if (listingsAudit.issues.filter(i => i.issueType === 'orphaned').length > 0) {
        recommendations.push(`🟠 Run fixOrphanedListings() to create placeholder sellers`)
    }

    if (listingsAudit.issues.filter(i => i.field === 'created_at').length > 0) {
        recommendations.push(`🟡 Run addMissingTimestamps() to fix timestamp issues`)
    }

    if (overallHealth >= 90) {
        recommendations.push(`✅ System health is excellent (${overallHealth}%)`)
    } else if (overallHealth >= 70) {
        recommendations.push(`🟡 System health is good (${overallHealth}%), some fixes recommended`)
    } else {
        recommendations.push(`🔴 System health needs attention (${overallHealth}%)`)
    }

    console.log(`[Audit] Complete. Health: ${overallHealth}%`)

    return {
        timestamp: new Date(),
        collections,
        overallHealth,
        recommendations
    }
}

// All functions and types are exported above
