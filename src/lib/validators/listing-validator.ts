/**
 * LISTING VALIDATION UTILITIES
 * 
 * Client-side validation for listings/products before submission to Firestore
 * Prevents orphaned data and ensures data integrity
 */

import { auth, db } from '@/lib/firebase'
import { doc, getDoc } from 'firebase/firestore'

export interface ValidationResult {
    isValid: boolean
    errors: string[]
    warnings: string[]
}

/**
 * Validate that a seller ID exists in the users collection
 */
export async function validateSellerExists(sellerId: string): Promise<boolean> {
    try {
        const userDoc = await getDoc(doc(db, 'users', sellerId))
        return userDoc.exists()
    } catch (error) {
        console.error('[Validator] Error checking seller existence:', error)
        return false
    }
}

/**
 * Validate that the current user is authenticated and matches the seller ID
 */
export function validateAuthenticatedSeller(sellerId: string): boolean {
    const currentUser = auth.currentUser

    if (!currentUser) {
        console.error('[Validator] User not authenticated')
        return false
    }

    if (currentUser.uid !== sellerId) {
        console.error('[Validator] Seller ID mismatch:', {
            currentUser: currentUser.uid,
            providedSeller: sellerId
        })
        return false
    }

    return true
}

/**
 * Comprehensive validation for listing data before creation
 */
export async function validateListingData(data: any): Promise<ValidationResult> {
    const errors: string[] = []
    const warnings: string[] = []

    // 1. Check authentication
    if (!auth.currentUser) {
        errors.push('User must be authenticated to create listings')
        return { isValid: false, errors, warnings }
    }

    // 2. Validate seller_id
    if (!data.seller_id) {
        errors.push('seller_id is required')
    } else {
        // Ensure seller_id matches current user
        if (data.seller_id !== auth.currentUser.uid) {
            errors.push('seller_id must match authenticated user ID')
        }

        // Check if seller exists in database
        const sellerExists = await validateSellerExists(data.seller_id)
        if (!sellerExists) {
            errors.push(`Seller with ID ${data.seller_id} does not exist in users collection`)
        }
    }

    // 3. Validate required fields
    const requiredFields = ['title', 'status', 'category_id']
    for (const field of requiredFields) {
        if (!data[field]) {
            errors.push(`${field} is required`)
        }
    }

    // 4. Validate title
    if (data.title) {
        if (typeof data.title !== 'string') {
            errors.push('title must be a string')
        } else if (data.title.trim().length < 3) {
            errors.push('title must be at least 3 characters long')
        } else if (data.title.length > 200) {
            errors.push('title must not exceed 200 characters')
        }
    }

    // 5. Validate status
    const validStatuses = ['draft', 'published', 'sold', 'pending', 'rejected']
    if (data.status && !validStatuses.includes(data.status)) {
        errors.push(`status must be one of: ${validStatuses.join(', ')}`)
    }

    // 6. Validate category
    if (data.category_id !== undefined && data.category_id !== null) {
        if (typeof data.category_id !== 'number') {
            errors.push('category_id must be a number')
        } else if (data.category_id < 1 || data.category_id > 22) {
            warnings.push('category_id is outside the expected range (1-22)')
        }
    }

    // 7. Validate price
    if (data.price !== undefined && data.price !== null) {
        if (typeof data.price !== 'number') {
            errors.push('price must be a number')
        } else if (data.price < 0) {
            errors.push('price cannot be negative')
        } else if (data.price > 1000000000) {
            warnings.push('price seems unusually high')
        }
    }

    // 8. Validate images
    if (data.images) {
        if (!Array.isArray(data.images)) {
            errors.push('images must be an array')
        } else if (data.images.length === 0) {
            warnings.push('Listing has no images')
        } else if (data.images.length > 10) {
            errors.push('Maximum 10 images allowed')
        }
    }

    // 9. Validate location
    if (data.province && typeof data.province !== 'string') {
        errors.push('province must be a string')
    }

    // 10. Check for suspicious data
    if (data.seller_name && data.seller_name.toLowerCase() === 'unknown') {
        warnings.push('seller_name is "Unknown" - consider updating user profile')
    }

    return {
        isValid: errors.length === 0,
        errors,
        warnings
    }
}

/**
 * Validate listing data before update
 * Prevents changing seller_id after creation
 */
export async function validateListingUpdate(
    originalData: any,
    updatedData: any
): Promise<ValidationResult> {
    const errors: string[] = []
    const warnings: string[] = []

    // 1. Ensure seller_id hasn't changed
    if (originalData.seller_id !== updatedData.seller_id) {
        errors.push('seller_id cannot be modified after creation')
    }

    // 2. Validate ownership
    if (!auth.currentUser) {
        errors.push('User must be authenticated')
        return { isValid: false, errors, warnings }
    }

    if (auth.currentUser.uid !== originalData.seller_id) {
        errors.push('Only the original seller can update this listing')
    }

    // 3. Run standard validation on updated data
    const standardValidation = await validateListingData(updatedData)
    errors.push(...standardValidation.errors)
    warnings.push(...standardValidation.warnings)

    return {
        isValid: errors.length === 0,
        errors,
        warnings
    }
}

/**
 * Auto-fix common data issues
 */
export function autoFixListingData(data: any): any {
    const fixed = { ...data }

    // Auto-set seller_id to current user if not set
    if (!fixed.seller_id && auth.currentUser) {
        fixed.seller_id = auth.currentUser.uid
        console.log('[Validator] Auto-fixed: Set seller_id to current user')
    }

    // Trim whitespace from title
    if (fixed.title && typeof fixed.title === 'string') {
        fixed.title = fixed.title.trim()
    }

    // Ensure status is valid
    if (!fixed.status || !['draft', 'published', 'sold', 'pending', 'rejected'].includes(fixed.status)) {
        fixed.status = 'draft'
        console.log('[Validator] Auto-fixed: Set status to draft')
    }

    // Add timestamps if missing
    if (!fixed.created_at) {
        fixed.created_at = new Date()
    }

    if (!fixed.updated_at) {
        fixed.updated_at = new Date()
    }

    return fixed
}

/**
 * Pre-submission validation hook
 * Call this before any Firestore write operation
 */
export async function preSubmitValidation(
    data: any,
    operation: 'create' | 'update' = 'create'
): Promise<ValidationResult> {
    console.log(`[Validator] Running ${operation} validation...`)

    // Auto-fix common issues first
    const fixedData = autoFixListingData(data)

    // Run validation
    let result: ValidationResult
    if (operation === 'create') {
        result = await validateListingData(fixedData)
    } else {
        // For updates, we'd need the original data
        // This is a simplified version
        result = await validateListingData(fixedData)
    }

    // Log results
    if (!result.isValid) {
        console.error('[Validator] Validation failed:', result.errors)
    }

    if (result.warnings.length > 0) {
        console.warn('[Validator] Warnings:', result.warnings)
    }

    if (result.isValid) {
        console.log('[Validator] ✅ Validation passed')
    }

    return result
}
