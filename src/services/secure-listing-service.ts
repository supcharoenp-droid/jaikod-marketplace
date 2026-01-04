/**
 * SECURE LISTING SERVICE
 * 
 * Handles creation and updates of listings with built-in validation
 * Ensures data integrity and prevents orphaned listings
 */

import { collection, addDoc, updateDoc, doc, serverTimestamp } from 'firebase/firestore'
import { db, auth } from '@/lib/firebase'
import { preSubmitValidation, type ValidationResult } from '@/lib/validators/listing-validator'

export interface CreateListingParams {
    title: string
    description?: string
    price?: number
    category_id: number
    subcategory_id?: number
    images?: string[]
    province?: string
    district?: string
    condition?: string
    [key: string]: any
}

export interface CreateListingResult {
    success: boolean
    listingId?: string
    validationResult?: ValidationResult
    error?: string
}

/**
 * Create a new listing with validation
 */
export async function createListingSecure(
    params: CreateListingParams
): Promise<CreateListingResult> {
    try {
        // Check authentication
        if (!auth.currentUser) {
            return {
                success: false,
                error: 'User must be authenticated to create listings'
            }
        }

        // Prepare listing data
        const listingData = {
            ...params,
            seller_id: auth.currentUser.uid, // ALWAYS use current user UID
            status: params.status || 'draft',
            created_at: serverTimestamp(),
            updated_at: serverTimestamp(),
        }

        //Validate before submission
        console.log('[SecureListingService] Validating listing data...')
        const validationResult = await preSubmitValidation(listingData, 'create')

        if (!validationResult.isValid) {
            console.error('[SecureListingService] Validation failed:', validationResult.errors)
            return {
                success: false,
                validationResult,
                error: validationResult.errors.join(', ')
            }
        }

        // Log warnings if any
        if (validationResult.warnings.length > 0) {
            console.warn('[SecureListingService] Validation warnings:', validationResult.warnings)
        }

        // Create listing in Firestore
        console.log('[SecureListingService] Creating listing...')
        const docRef = await addDoc(collection(db, 'listings'), listingData)

        console.log('[SecureListingService] ✅ Listing created successfully:', docRef.id)

        return {
            success: true,
            listingId: docRef.id,
            validationResult
        }

    } catch (error) {
        console.error('[SecureListingService] Error creating listing:', error)
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error'
        }
    }
}

/**
 * Update an existing listing with validation
 */
export async function updateListingSecure(
    listingId: string,
    updates: Partial<CreateListingParams>
): Promise<CreateListingResult> {
    try {
        // Check authentication
        if (!auth.currentUser) {
            return {
                success: false,
                error: 'User must be authenticated to update listings'
            }
        }

        // Prepare update data
        const updateData = {
            ...updates,
            // NEVER allow changing seller_id
            seller_id: undefined, // Remove if present
            updated_at: serverTimestamp(),
        }

        // Remove undefined fields
        Object.keys(updateData).forEach(key =>
            updateData[key as keyof typeof updateData] === undefined && delete updateData[key as keyof typeof updateData]
        )

        // Validate update (simplified - in production, fetch original data first)
        console.log('[SecureListingService] Validating update...')
        const validationResult = await preSubmitValidation(updateData, 'update')

        if (!validationResult.isValid) {
            console.error('[SecureListingService] Validation failed:', validationResult.errors)
            return {
                success: false,
                validationResult,
                error: validationResult.errors.join(', ')
            }
        }

        // Update listing in Firestore
        console.log('[SecureListingService] Updating listing...')
        await updateDoc(doc(db, 'listings', listingId), updateData)

        console.log('[SecureListingService] ✅ Listing updated successfully')

        return {
            success: true,
            listingId,
            validationResult
        }

    } catch (error) {
        console.error('[SecureListingService] Error updating listing:', error)
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error'
        }
    }
}

/**
 * Batch validate multiple listings
 * Useful for data migration or bulk operations
 */
export async function batchValidateListings(listings: any[]): Promise<{
    total: number
    valid: number
    invalid: number
    results: Array<{ id: string, valid: boolean, errors?: string[] }>
}> {
    const results = []
    let validCount = 0
    let invalidCount = 0

    for (const listing of listings) {
        const validation = await preSubmitValidation(listing, 'create')

        if (validation.isValid) {
            validCount++
        } else {
            invalidCount++
        }

        results.push({
            id: listing.id || 'unknown',
            valid: validation.isValid,
            errors: validation.errors
        })
    }

    return {
        total: listings.length,
        valid: validCount,
        invalid: invalidCount,
        results
    }
}
