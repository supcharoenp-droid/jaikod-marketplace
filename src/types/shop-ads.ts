/**
 * Shop Ads Type Definitions
 * ระบบโฆษณาสำหรับผู้ขาย
 */

export type CampaignStatus = 'Active' | 'Paused' | 'Completed' | 'Draft' | 'Scheduled'

export type CampaignType = 'Product' | 'Shop' | 'Category' | 'Brand'

export interface Campaign {
    id: string
    name: string
    status: CampaignStatus
    type: CampaignType
    budget: {
        type: 'daily' | 'total'
        amount: number
        spent: number
    }
    targeting: {
        categories?: string[]
        keywords?: string[]
        locations?: string[]
        demographics?: {
            ageRange?: [number, number]
            interests?: string[]
        }
    }
    performance: {
        impressions: number
        clicks: number
        ctr: number
        conversions: number
        revenue: number
        roi: number
    }
    schedule?: {
        startDate: Date
        endDate: Date
    }
    createdAt: Date
    updatedAt: Date
    createdBy: string
}

export interface CampaignStats {
    totalImpressions: number
    totalClicks: number
    averageCTR: number
    totalSpent: number
    totalRevenue: number
    averageROI: number
    trends: {
        impressions: number
        clicks: number
        ctr: number
        spend: number
    }
}

export interface CampaignFilters {
    status?: CampaignStatus[]
    type?: CampaignType[]
    dateRange?: {
        from: Date
        to: Date
    }
    search?: string
}

export type SortField = 'name' | 'status' | 'impressions' | 'clicks' | 'roi' | 'createdAt'
export type SortOrder = 'asc' | 'desc'

export interface CampaignTableSort {
    field: SortField
    order: SortOrder
}
