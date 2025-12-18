/**
 * Simple Background Job System (No Redis Required)
 * 
 * Uses Firestore as job queue
 * Perfect for MVP and small-medium scale
 * Can migrate to Bull/Redis later when needed
 */

import {
    collection,
    addDoc,
    query,
    where,
    orderBy,
    limit,
    getDocs,
    updateDoc,
    doc,
    serverTimestamp,
    Timestamp
} from 'firebase/firestore'
import { db } from './firebase'

const JOBS_COLLECTION = 'background_jobs'

// ==========================================
// TYPES
// ==========================================

export type JobType = 'ai_moderation' | 'image_processing' | 'email_notification'
export type JobStatus = 'pending' | 'processing' | 'completed' | 'failed'
export type JobPriority = 'low' | 'normal' | 'high' | 'critical'

export interface Job {
    id?: string
    type: JobType
    status: JobStatus
    priority: JobPriority
    data: any
    result?: any
    error?: string
    attempts: number
    maxAttempts: number
    createdAt: Date
    updatedAt: Date
    processedAt?: Date
}

// ==========================================
// JOB QUEUE
// ==========================================

/**
 * Add job to queue
 */
export async function addJob(
    type: JobType,
    data: any,
    priority: JobPriority = 'normal',
    maxAttempts: number = 3
): Promise<string> {
    try {
        const job = {
            type,
            status: 'pending' as JobStatus,
            priority,
            data,
            attempts: 0,
            maxAttempts,
            createdAt: new Date(),
            updatedAt: new Date()
        }

        const jobRef = await addDoc(collection(db, JOBS_COLLECTION), job)
        console.log(`✅ Job added: ${jobRef.id} (${type})`)

        // Trigger processing (non-blocking)
        setTimeout(() => processNextJob(), 100)

        return jobRef.id
    } catch (error) {
        console.error('Error adding job:', error)
        throw error
    }
}

/**
 * Get next pending job
 */
async function getNextJob(): Promise<Job | null> {
    try {
        // Priority order: critical > high > normal > low
        const priorities: JobPriority[] = ['critical', 'high', 'normal', 'low']

        for (const priority of priorities) {
            const q = query(
                collection(db, JOBS_COLLECTION),
                where('status', '==', 'pending'),
                where('priority', '==', priority),
                orderBy('createdAt', 'asc'),
                limit(1)
            )

            const snapshot = await getDocs(q)
            if (!snapshot.empty) {
                const docSnap = snapshot.docs[0]
                const data = docSnap.data()
                return {
                    id: docSnap.id,
                    ...data,
                    createdAt: data.createdAt?.toDate?.() || new Date(),
                    updatedAt: data.updatedAt?.toDate?.() || new Date(),
                    processedAt: data.processedAt?.toDate?.()
                } as Job
            }
        }

        return null
    } catch (error) {
        console.error('Error getting next job:', error)
        return null
    }
}

/**
 * Update job status
 */
async function updateJob(
    jobId: string,
    updates: Partial<Job>
): Promise<void> {
    try {
        const jobRef = doc(db, JOBS_COLLECTION, jobId)
        await updateDoc(jobRef, {
            ...updates,
            updatedAt: new Date()
        })
    } catch (error) {
        console.error('Error updating job:', error)
        throw error
    }
}

/**
 * Process next job in queue
 */
export async function processNextJob(): Promise<void> {
    const job = await getNextJob()
    if (!job || !job.id) {
        return
    }

    try {
        console.log(`🔄 Processing job: ${job.id} (${job.type})`)

        // Mark as processing
        await updateJob(job.id, {
            status: 'processing',
            processedAt: new Date()
        })

        // Process based on type
        let result: any
        switch (job.type) {
            case 'ai_moderation':
                result = await processAIModerationJob(job.data)
                break
            case 'image_processing':
                result = await processImageJob(job.data)
                break
            case 'email_notification':
                result = await processEmailJob(job.data)
                break
            default:
                throw new Error(`Unknown job type: ${job.type}`)
        }

        // Mark as completed
        await updateJob(job.id, {
            status: 'completed',
            result
        })

        console.log(`✅ Job completed: ${job.id}`)

        // Process next job
        setTimeout(() => processNextJob(), 100)

    } catch (error: any) {
        console.error(`❌ Job failed: ${job.id}`, error)

        const attempts = (job.attempts || 0) + 1
        const shouldRetry = attempts < job.maxAttempts

        if (shouldRetry) {
            // Retry with exponential backoff
            const delay = Math.pow(2, attempts) * 1000 // 2s, 4s, 8s...
            console.log(`🔄 Retrying job ${job.id} in ${delay}ms (attempt ${attempts}/${job.maxAttempts})`)

            await updateJob(job.id, {
                status: 'pending',
                attempts,
                error: error.message
            })

            setTimeout(() => processNextJob(), delay)
        } else {
            // Max attempts reached
            await updateJob(job.id, {
                status: 'failed',
                attempts,
                error: error.message
            })

            console.log(`💀 Job failed permanently: ${job.id}`)
        }
    }
}

// ==========================================
// JOB PROCESSORS
// ==========================================

/**
 * Process AI Moderation Job
 */
async function processAIModerationJob(data: any): Promise<any> {
    const { ContentModerationService } = await import('./content-moderation')
    const { updateProduct } = await import('./products.optimized')

    const { productId, productData } = data

    // Run AI moderation
    const moderationResult = await ContentModerationService.moderateProduct(productData)

    // Update product with moderation result
    const newStatus = moderationResult.status === 'approved' ? 'active' :
        moderationResult.status === 'rejected' ? 'rejected' :
            'pending_review'

    await updateProduct(productId, {
        // @ts-ignore
        moderation_status: moderationResult.status,
        moderation_result: moderationResult,
        status: newStatus
    })

    // TODO: Send notification to seller
    console.log(`📧 Should notify seller about moderation result: ${moderationResult.status}`)

    return {
        productId,
        moderationStatus: moderationResult.status,
        score: moderationResult.overall_score
    }
}

/**
 * Process Image Processing Job
 */
async function processImageJob(data: any): Promise<any> {
    // Placeholder for future image processing tasks
    // e.g., generate thumbnails, apply watermarks, etc.
    console.log('Processing image job:', data)
    return { success: true }
}

/**
 * Process Email Notification Job
 */
async function processEmailJob(data: any): Promise<any> {
    // Placeholder for email notifications
    // e.g., send welcome email, order confirmation, etc.
    console.log('Processing email job:', data)
    return { success: true }
}

// ==========================================
// JOB MONITORING
// ==========================================

/**
 * Get job status
 */
export async function getJobStatus(jobId: string): Promise<Job | null> {
    try {
        const jobRef = doc(db, JOBS_COLLECTION, jobId)
        const jobSnap = await getDocs(query(collection(db, JOBS_COLLECTION), where('__name__', '==', jobId)))

        if (jobSnap.empty) {
            return null
        }

        const data = jobSnap.docs[0].data()
        return {
            id: jobSnap.docs[0].id,
            ...data,
            createdAt: data.createdAt?.toDate?.() || new Date(),
            updatedAt: data.updatedAt?.toDate?.() || new Date(),
            processedAt: data.processedAt?.toDate?.()
        } as Job
    } catch (error) {
        console.error('Error getting job status:', error)
        return null
    }
}

/**
 * Get queue statistics
 */
export async function getQueueStats(): Promise<{
    pending: number
    processing: number
    completed: number
    failed: number
}> {
    try {
        const stats = {
            pending: 0,
            processing: 0,
            completed: 0,
            failed: 0
        }

        const statuses: JobStatus[] = ['pending', 'processing', 'completed', 'failed']

        for (const status of statuses) {
            const q = query(
                collection(db, JOBS_COLLECTION),
                where('status', '==', status)
            )
            const snapshot = await getDocs(q)
            stats[status] = snapshot.size
        }

        return stats
    } catch (error) {
        console.error('Error getting queue stats:', error)
        return { pending: 0, processing: 0, completed: 0, failed: 0 }
    }
}

// ==========================================
// AUTO-START WORKER (Client-side)
// ==========================================

let workerInterval: NodeJS.Timeout | null = null

/**
 * Start background worker
 * Call this once when app starts
 */
export function startBackgroundWorker(intervalMs: number = 5000): void {
    if (workerInterval) {
        console.log('⚠️ Worker already running')
        return
    }

    console.log('🚀 Starting background worker...')

    // Process immediately
    processNextJob()

    // Then process every N seconds
    workerInterval = setInterval(() => {
        processNextJob()
    }, intervalMs)
}

/**
 * Stop background worker
 */
export function stopBackgroundWorker(): void {
    if (workerInterval) {
        clearInterval(workerInterval)
        workerInterval = null
        console.log('🛑 Background worker stopped')
    }
}

// ==========================================
// HELPER: Queue AI Moderation
// ==========================================

/**
 * Queue AI moderation for a product
 */
export async function queueProductModeration(
    productId: string,
    productData: any,
    priority: JobPriority = 'normal'
): Promise<string> {
    return addJob('ai_moderation', {
        productId,
        productData
    }, priority)
}
