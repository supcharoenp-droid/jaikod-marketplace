
import { db } from '@/lib/firebase'
import {
    collection,
    getDocs,
    limit,
    query,
    where,
    startAfter,
    orderBy,
    writeBatch
} from 'firebase/firestore'
import { assessUserRisk } from './trust-score-service'
import { AdminUser } from '@/types/admin'
import { logAdminAction } from '@/lib/adminLogger'

/**
 * Migration Script: Initialize Trust Scores for all users
 * This should be run only once or when recalibrating the scoring model globally.
 */
export async function runTrustScoreMigration(admin: AdminUser) {
    let processedCount = 0
    let updatedCount = 0
    let errorCount = 0
    let lastDoc = null

    try {
        await logAdminAction(admin, 'SYSTEM_SCRIPT', 'TrustScoreMigration', 'Started migration')

        while (true) {
            // Fetch batch of users (active or banned)
            let q = query(
                collection(db, 'users'),
                orderBy('createdAt'),
                limit(50)
            )

            if (lastDoc) {
                q = query(
                    collection(db, 'users'),
                    orderBy('createdAt'),
                    startAfter(lastDoc),
                    limit(50)
                )
            }

            const snapshot = await getDocs(q)
            if (snapshot.empty) break

            const users = snapshot.docs
            lastDoc = users[users.length - 1]

            // We process one by one to use the logic in assessUserRisk
            // In a massive scale system, this would be a Cloud Function or separate worker.
            for (const userDoc of users) {
                const userId = userDoc.id
                // Check if already has score (Optional: skip if exists to be faster / or overwrite to recalibrate)
                // Let's overwrite to ensure everyone is on the same model.

                try {
                    // assessUserRisk() calculates AND updates the document
                    await assessUserRisk(userId)
                    updatedCount++
                } catch (e) {
                    console.error(`Failed to assess user ${userId}:`, e)
                    errorCount++
                }
                processedCount++
            }
        }

        await logAdminAction(admin, 'SYSTEM_SCRIPT', 'TrustScoreMigration', `Completed. Processed: ${processedCount}, Updated: ${updatedCount}, Errors: ${errorCount}`)

        return {
            success: true,
            processed: processedCount,
            updated: updatedCount,
            errors: errorCount
        }

    } catch (error) {
        console.error('Migration failed:', error)
        throw error
    }
}
