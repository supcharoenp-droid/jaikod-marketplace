import { ApiResponse, ListParams, PaginationMeta, StoreProfile, AIAnalysisResponse, Listing } from '@/types/api'
import { FULL_SEED_DATA } from '@/data/seed-listings-v2'

// In-Memory Database for Mock
let CURRENT_DB: Listing[] = [...FULL_SEED_DATA]

// Generic Client
async function fetchApi<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.jaikod.com/v1'
    const url = `${baseUrl}${endpoint}`

    // Add Auth Headers if needed (Client-side)
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null

    // Check if body is FormData (don't set Content-Type)
    const isFormData = options.body instanceof FormData

    const headers: Record<string, string> = {
        ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        ...(options.headers as Record<string, string>),
    }

    try {
        const res = await fetch(url, { ...options, headers })

        if (!res.ok) {
            // Handle HTTP Errors
            const errorBody = await res.json().catch(() => ({}))
            throw new Error(errorBody.error?.message || `API Error: ${res.status}`)
        }

        // Handle specific 204 No Content
        if (res.status === 204) return {} as T

        return await res.json()
    } catch (error) {
        console.error(`Fetch Error [${endpoint}]:`, error)
        throw error
    }
}

// --- Infinite Scroll Helper ---
export async function fetchWithCursor<T>(
    endpoint: string,
    params: ListParams
): Promise<ApiResponse<T[]>> {
    const searchParams = new URLSearchParams()
    if (params.cursor) searchParams.set('cursor', params.cursor)
    if (params.limit) searchParams.set('limit', params.limit.toString())
    if (params.q) searchParams.set('q', params.q)
    if (params.sort) searchParams.set('sort', params.sort)

    // Append Filter Object Flattened e.g. filters[category]=1
    if (params.filters) {
        Object.entries(params.filters).forEach(([k, v]) => {
            if (v !== undefined && v !== null) searchParams.set(k, String(v))
        })
    }

    const queryString = searchParams.toString()
    return fetchApi<ApiResponse<T[]>>(`${endpoint}?${queryString}`)
}

// --- Data Binding Hooks Pattern (Logic Only) ---
// This simulate a generic "Repository" pattern for services to use

export class ApiService {

    // Listing Resource
    static listings = {
        async list(params: ListParams = { limit: 20 }) {
            // Mock Implementation using V2 Seed Data
            return mockFetchListings(params)
        },

        async get(id: string) {
            // Find in mock DB first
            const localItem = CURRENT_DB.find(i => i.id === id)
            if (localItem) return { data: localItem }

            return fetchApi<ApiResponse<Listing>>(`/listings/${id}`)
        },

        async create(data: any) {
            return fetchApi<ApiResponse<Listing>>('/listings', {
                method: 'POST',
                body: JSON.stringify(data)
            })
        },

        // Admin Reset Tool
        async _resetDB() {
            CURRENT_DB = [...FULL_SEED_DATA]
            console.log('Database Reset to V2 Seed')
            return true
        }
    }

    // Store Resource
    static store = {
        async getProfile(slug: string) {
            return fetchApi<ApiResponse<StoreProfile>>(`/shops/${slug}`)
        },
        async getProducts(slug: string, params: ListParams) {
            // Mock Implementation for now
            return mockFetchListings(params)
        },
        async follow(storeId: string) {
            return fetchApi(`/store/${storeId}/follow`, { method: 'POST' })
        },
        async unfollow(storeId: string) {
            return fetchApi(`/store/${storeId}/follow`, { method: 'DELETE' })
        }
    }

    // Upload / AI
    static upload = {
        async analyzeImage(image: File) {
            // Mock
            return mockAnalyzeImage(image)
        }
    }
}

// --- Mock Data Generators for DEMO ---

async function mockAnalyzeImage(file: File): Promise<ApiResponse<AIAnalysisResponse>> {
    await new Promise(r => setTimeout(r, 1500))
    return {
        data: {
            detected_category_id: "2",
            confidence: 0.95,
            image_quality: {
                score: 92,
                is_blurry: false,
                lighting_condition: "good"
            },
            suggested_price: {
                min: 350000,
                max: 390000,
                avg: 375000,
                good_deal_threshold: 360000
            },
            extracted_tags: ["car", "toyota", "sedan"],
            description_draft: "สภาพดีเยี่ยม ไม่เคยชนหนัก เข้าศูนย์ตลอด..."
        }
    }
}

// Enhanced Mock Fetch with Filter Logic
async function mockFetchListings(params: ListParams): Promise<ApiResponse<Listing[]>> {
    await new Promise(r => setTimeout(r, 400 + Math.random() * 200)) // Realistic Latency

    let filtered = [...CURRENT_DB]

    // 1. Search Query
    if (params.q) {
        const q = params.q.toLowerCase()
        filtered = filtered.filter(item =>
            item.title.toLowerCase().includes(q) ||
            item.ai?.tags?.some(t => t.toLowerCase().includes(q))
        )
    }

    // 2. Sort Logic (Mock)
    if (params.sort === 'price_asc') filtered.sort((a, b) => a.price - b.price)
    if (params.sort === 'price_desc') filtered.sort((a, b) => b.price - a.price)
    if (params.sort === 'latest') filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

    // 3. Pagination
    const limit = params.limit || 20
    const startIndex = params.cursor ? parseInt(params.cursor) : 0
    const pagedData = filtered.slice(startIndex, startIndex + limit)
    const nextCursor = (startIndex + limit < filtered.length) ? (startIndex + limit).toString() : undefined

    return {
        data: pagedData,
        meta: {
            total: filtered.length,
            limit: limit,
            has_more: !!nextCursor,
            next_cursor: nextCursor
        }
    }
}
