export interface DashboardOverview {
    totalViews: number
    totalChats: number
    totalWishlists: number
    totalOrders: number
    totalSales: number
    salesChange: number // percentage
    viewsChange: number // percentage
    ordersChange: number
}

export interface ProductPerformance {
    id: string
    title: string
    thumbnail: string
    views: number
    ctr: number // percentage
    conversionRate: number // percentage
    likes: number
    avgTimeOnCard: number // seconds
    status: 'active' | 'inactive' | 'sold'
    aiAnalysis?: {
        issues: string[]
        score: number // 0-100
        recommendation?: string
    }
}

export interface BuyerInsight {
    topRegions: { region: string; percentage: number }[]
    avgDaysToSell: number
    avgBuyerDistance: number // km
}

export interface AISuggestion {
    type: 'pricing' | 'timing' | 'boosting' | 'category' | 'improvement'
    title: string
    description: string
    action?: string
    priority: 'high' | 'medium' | 'low'
    estimatedCost?: number // coins
    expectedImpact?: string // e.g., "+150 views"
}

export interface RecentOrder {
    id: string
    productTitle: string
    buyerName: string
    amount: number
    status: 'pending' | 'shipping' | 'completed' | 'cancelled'
    date: string
}

export interface ChartDataPoint {
    date: string
    views: number
    sales: number
}

export interface TrustStats {
    ekycStatus: 'verified' | 'pending' | 'unverified' | 'rejected'
    trustScore: number
    fraudFlags: number
    warningCount: number
}

export interface SellerDashboardData {
    overview: DashboardOverview
    topProducts: ProductPerformance[]
    recentOrders: RecentOrder[]
    chartData: ChartDataPoint[]
    insights: BuyerInsight
    suggestions: AISuggestion[]
    heatmapData: { province: string; count: number }[]
    trustStats: TrustStats
}
