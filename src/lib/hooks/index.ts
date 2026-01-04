/**
 * Cached Hooks Index
 * 
 * Re-export all React Query hooks for easy imports
 * 
 * NOTE: Hooks are lazy loaded to avoid circular dependencies
 */

// Re-export query utilities only - hooks will be imported directly where needed
export {
    queryClient,
    queryKeys,
    invalidateSellerQueries,
    invalidateListingQueries,
    invalidateUserQueries,
    clearAllCache
} from '../query-client'

// Export hook types (no actual hooks to avoid circular deps)
// Use: import { useSellerProfile } from '@/lib/hooks/use-seller'
// Instead of: import { useSellerProfile } from '@/lib/hooks'
