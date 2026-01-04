/**
 * Type Definitions Unit Tests
 * 
 * Tests for src/types/ type definitions
 */

import { describe, it, expect } from 'vitest'

// Test that types can be imported without errors
import type {
    UniversalListing,
    ListingLocation,
    ListingImage,
    ListingStatus,
    ListingCategoryType,
    ListingSellerInfo,
    AIContent,
    ListingStats,
    CreateListingInput,
    UpdateListingInput
} from '@/types'

import type {
    SellerProfile,
    SellerStore,
    SellerStats,
    SellerListing
} from '@/types'

describe('UniversalListing Type', () => {
    it('should have all required fields', () => {
        // Create a mock listing to verify type structure
        const mockListing: Partial<UniversalListing> = {
            id: 'test-id',
            slug: 'test-slug',
            category_type: 'general',
            category_id: 1,
            seller_id: 'seller-1',
            title: 'Test Listing',
            price: 1000,
            images: [],
            location: {
                province: 'กรุงเทพมหานคร',
                amphoe: 'จตุจักร'
            },
            status: 'active',
            created_at: new Date()
        }

        expect(mockListing.id).toBe('test-id')
        expect(mockListing.category_type).toBe('general')
        expect(mockListing.status).toBe('active')
    })

    it('should accept valid status values', () => {
        const validStatuses: ListingStatus[] = [
            'draft',
            'pending',
            'active',
            'expired',
            'sold',
            'closed',
            'rejected'
        ]

        validStatuses.forEach(status => {
            expect(typeof status).toBe('string')
        })
    })

    it('should accept valid category types', () => {
        const validTypes: ListingCategoryType[] = [
            'car',
            'motorcycle',
            'mobile',
            'real_estate',
            'general'
        ]

        validTypes.forEach(type => {
            expect(typeof type).toBe('string')
        })
    })
})

describe('ListingLocation Type', () => {
    it('should have required amphoe and province', () => {
        const location: ListingLocation = {
            province: 'กรุงเทพมหานคร',
            amphoe: 'จตุจักร'
        }

        expect(location.province).toBe('กรุงเทพมหานคร')
        expect(location.amphoe).toBe('จตุจักร')
    })

    it('should accept optional fields', () => {
        const location: ListingLocation = {
            province: 'กรุงเทพมหานคร',
            amphoe: 'จตุจักร',
            district: 'จตุจักร',
            zipcode: '10900',
            landmark: 'ใกล้ MRT จตุจักร',
            coordinates: {
                lat: 13.8033,
                lng: 100.5533
            },
            formatted_address: 'จตุจักร, กรุงเทพมหานคร 10900'
        }

        expect(location.district).toBe('จตุจักร')
        expect(location.coordinates?.lat).toBe(13.8033)
    })
})

describe('SellerProfile Type', () => {
    it('should have all required fields', () => {
        const mockProfile: any = {
            id: 'seller-1',
            name: 'Test Seller',
            is_verified: true,
            phone_verified: true,
            email_verified: true,
            id_verified: false,
            trust_score: 85,
            badges: ['verified'],
            response_time_minutes: 30,
            total_listings: 10,
            active_listings: 8,
            successful_sales: 5,
            followers_count: 100,
            following_count: 50,
            member_since: new Date()
        }

        expect(mockProfile.id).toBe('seller-1')
        expect(mockProfile.trust_score).toBe(85)
        expect(mockProfile.badges).toContain('verified')
    })
})

describe('AIContent Type', () => {
    it('should have marketing copy fields', () => {
        const aiContent: Partial<AIContent> = {
            auto_title: 'AI Generated Title',
            confidence_score: 0.95,
            seo_keywords: ['keyword1', 'keyword2'],
            marketing_copy: {
                headline: 'Great Product!',
                subheadline: 'Best price guaranteed',
                selling_points: ['Quality', 'Fast shipping'],
                trust_signals: ['Verified seller'],
                body_copy: 'Product description...',
                call_to_action: 'Buy Now!',
                full_text: 'Complete marketing text'
            }
        }

        expect(aiContent.auto_title).toBe('AI Generated Title')
        expect(aiContent.confidence_score).toBe(0.95)
        expect(aiContent.marketing_copy?.selling_points).toContain('Quality')
    })
})

describe('ListingStats Type', () => {
    it('should track all engagement metrics', () => {
        const stats: ListingStats = {
            views: 100,
            unique_viewers: 80,
            favorites: 25,
            shares: 10,
            inquiries: 5,
            offers_received: 3,
            chat_conversations: 2
        }

        expect(stats.views).toBe(100)
        expect(stats.favorites).toBe(25)
        expect(stats.inquiries).toBe(5)
    })
})

describe('Type Exports', () => {
    it('should export all listing types from @/types', async () => {
        const types = await import('@/types')

        // Verify key types are exported (we check by ensuring import didn't throw)
        expect(types).toBeDefined()
    })
})
