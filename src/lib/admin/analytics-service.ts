
import { db } from '@/lib/firebase'
import {
    collection,
    getCountFromServer,
    query,
    where,
    Timestamp
} from 'firebase/firestore'

export interface AnalyticsSummary {
    totalRevenue: number
    totalOrders: number
    totalUsers: number
    totalShops: number
    gmvGrowth: number // Percent
    revenueData: { name: string; value: number }[]
    categoryData: { name: string; value: number }[]
    recentSales: { id: string; amount: number; date: string; status: string }[]
}

export async function getAnalyticsDashboard(): Promise<AnalyticsSummary> {
    try {
        // Real Counts (Expensive, use sparingly or cache)
        // const userCount = (await getCountFromServer(collection(db, 'users'))).data().count
        // const productCount = (await getCountFromServer(collection(db, 'products'))).data().count

        // Mocking Data for Demonstration as real aggregation is heavy for simple firestore
        // In production, we would read from a 'stats' collection updated by Cloud Functions

        return {
            totalRevenue: 1250000, // THB
            totalOrders: 3420,
            totalUsers: 10500, // Mocked to look good
            totalShops: 450,
            gmvGrowth: 12.5,
            revenueData: [
                { name: 'Jan', value: 4000 },
                { name: 'Feb', value: 3000 },
                { name: 'Mar', value: 2000 },
                { name: 'Apr', value: 2780 },
                { name: 'May', value: 1890 },
                { name: 'Jun', value: 2390 },
                { name: 'Jul', value: 3490 },
            ],
            categoryData: [
                { name: 'Electronics', value: 400 },
                { name: 'Fashion', value: 300 },
                { name: 'Home', value: 300 },
                { name: 'Beauty', value: 200 },
            ],
            recentSales: [
                { id: 'ORD-001', amount: 1200, date: '2024-03-10', status: 'completed' },
                { id: 'ORD-002', amount: 450, date: '2024-03-10', status: 'pending' },
                { id: 'ORD-003', amount: 8500, date: '2024-03-09', status: 'completed' },
                { id: 'ORD-004', amount: 200, date: '2024-03-09', status: 'cancelled' },
            ]
        }

    } catch (error) {
        console.error('Analytics Error:', error)
        throw error
    }
}
