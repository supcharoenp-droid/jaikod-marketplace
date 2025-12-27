/**
 * UNIFIED SEARCH API
 * 
 * GET /api/search/unified
 * 
 * Enterprise-grade search endpoint that:
 * - Searches both products and listings
 * - Supports faceted filtering
 * - Returns AI-powered suggestions
 */

import { NextRequest, NextResponse } from 'next/server'
import { performUnifiedSearch, UnifiedSearchRequest } from '@/services/search/unified-search'

export async function GET(request: NextRequest) {
    const startTime = Date.now()

    try {
        const { searchParams } = new URL(request.url)

        // Parse request parameters
        const searchRequest: UnifiedSearchRequest = {
            // Core
            query: searchParams.get('q') || searchParams.get('query') || '',
            page: parseInt(searchParams.get('page') || '1'),
            limit: parseInt(searchParams.get('limit') || '20'),

            // Filters
            category_id: searchParams.get('category_id')
                ? parseInt(searchParams.get('category_id')!)
                : undefined,
            subcategory_id: searchParams.get('subcategory_id')
                ? parseInt(searchParams.get('subcategory_id')!)
                : undefined,
            min_price: searchParams.get('min_price')
                ? parseFloat(searchParams.get('min_price')!)
                : undefined,
            max_price: searchParams.get('max_price')
                ? parseFloat(searchParams.get('max_price')!)
                : undefined,
            condition: (searchParams.get('condition') as any) || 'all',

            // Location
            province: searchParams.get('province') || undefined,
            max_distance_km: searchParams.get('distance')
                ? parseFloat(searchParams.get('distance')!)
                : undefined,
            latitude: searchParams.get('lat')
                ? parseFloat(searchParams.get('lat')!)
                : undefined,
            longitude: searchParams.get('lng')
                ? parseFloat(searchParams.get('lng')!)
                : undefined,

            // Seller
            seller_verified: searchParams.get('verified') === 'true',

            // Sort
            sort_by: (searchParams.get('sort') as any) || 'relevance',

            // Source
            include_products: searchParams.get('products') !== 'false',
            include_listings: searchParams.get('listings') !== 'false'
        }

        // Perform search
        const result = await performUnifiedSearch(searchRequest)

        // Return response
        return NextResponse.json({
            success: true,
            data: result,
            meta: {
                api_version: '2.0',
                request_time_ms: Date.now() - startTime
            }
        })

    } catch (error) {
        console.error('[Search API] Error:', error)
        return NextResponse.json({
            success: false,
            error: {
                message: 'Search failed',
                code: 'SEARCH_ERROR'
            },
            meta: {
                api_version: '2.0',
                request_time_ms: Date.now() - startTime
            }
        }, { status: 500 })
    }
}

export async function POST(request: NextRequest) {
    const startTime = Date.now()

    try {
        const body = await request.json()

        const searchRequest: UnifiedSearchRequest = {
            query: body.query || '',
            page: body.page || 1,
            limit: body.limit || 20,
            category_id: body.category_id,
            subcategory_id: body.subcategory_id,
            min_price: body.min_price,
            max_price: body.max_price,
            condition: body.condition || 'all',
            province: body.province,
            max_distance_km: body.max_distance_km,
            latitude: body.latitude,
            longitude: body.longitude,
            seller_verified: body.seller_verified,
            sort_by: body.sort_by || 'relevance',
            include_products: body.include_products !== false,
            include_listings: body.include_listings !== false
        }

        const result = await performUnifiedSearch(searchRequest)

        return NextResponse.json({
            success: true,
            data: result,
            meta: {
                api_version: '2.0',
                request_time_ms: Date.now() - startTime
            }
        })

    } catch (error) {
        console.error('[Search API] Error:', error)
        return NextResponse.json({
            success: false,
            error: {
                message: 'Search failed',
                code: 'SEARCH_ERROR'
            }
        }, { status: 500 })
    }
}
