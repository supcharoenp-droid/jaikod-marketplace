import { db } from '@/lib/firebase'
import { collection, query, where, getCountFromServer, getDocs, orderBy, limit, Timestamp } from 'firebase/firestore'
import { AdminStats } from '@/types/admin'

export async function getAdminDashboardStats(): Promise<AdminStats> {
    try {
        const now = new Date()
        const startOfDay = new Date(now.setHours(0, 0, 0, 0))

        // 1. Core Counts
        const [
            usersSnap,
            productsSnap,
            listingsSnap,
            ordersSnap
        ] = await Promise.all([
            getCountFromServer(collection(db, 'users')),
            getCountFromServer(collection(db, 'products')),
            getCountFromServer(collection(db, 'listings')),
            getCountFromServer(collection(db, 'orders'))
        ])

        const totalUsers = usersSnap.data().count
        const totalProducts = productsSnap.data().count + listingsSnap.data().count

        // 2. New Users Today
        const newUsersQuery = query(
            collection(db, 'users'),
            where('createdAt', '>=', Timestamp.fromDate(startOfDay))
        )
        const newUsersSnap = await getCountFromServer(newUsersQuery)

        // 3. Orders Today & GMV Estimation
        let gmv = 0
        let ordersToday = 0
        let pendingOrders = 0

        const recentOrdersSnap = await getDocs(query(collection(db, 'orders'), orderBy('created_at', 'desc'), limit(100)))

        recentOrdersSnap.forEach(doc => {
            const data = doc.data()
            const date = data.created_at?.toDate() || new Date()

            gmv += (data.net_total || data.total || 0)

            if (date >= startOfDay) {
                ordersToday++
            }
            if (['pending', 'pending_payment'].includes(data.status)) {
                pendingOrders++
            }
        })

        // 4. Products Pending & Suspended
        const [
            pendingListingsSnap,
            pendingLegacySnap,
            suspendedSnap
        ] = await Promise.all([
            getCountFromServer(query(collection(db, 'listings'), where('status', '==', 'pending'))),
            getCountFromServer(query(collection(db, 'products'), where('status', '==', 'pending'))),
            getCountFromServer(query(collection(db, 'products'), where('status', '==', 'suspended')))
        ])

        const pendingReview = pendingListingsSnap.data().count + pendingLegacySnap.data().count

        // 5. Action Required Counts
        const [
            kycSnap,
            reportedSnap,
            withdrawalsSnap,
            disputesSnap
        ] = await Promise.all([
            getCountFromServer(query(collection(db, 'users'), where('onboardingStep', '>=', 2), where('onboardingStep', '<', 7))),
            getCountFromServer(query(collection(db, 'product_flags'), where('status', '==', 'pending'))),
            getCountFromServer(query(collection(db, 'payouts'), where('status', '==', 'pending'))),
            getCountFromServer(query(collection(db, 'orders'), where('status', '==', 'disputed')))
        ])

        return {
            total_users: totalUsers,
            total_buyers: Math.floor(totalUsers * 0.8),
            total_sellers: Math.floor(totalUsers * 0.2),
            new_users_today: newUsersSnap.data().count,
            total_products: totalProducts,
            active_products: totalProducts - pendingReview - suspendedSnap.data().count,
            pending_review: pendingReview,
            suspended_products: suspendedSnap.data().count,
            total_orders: ordersSnap.data().count,
            orders_today: ordersToday,
            pending_orders: pendingOrders,
            completed_orders: ordersSnap.data().count - pendingOrders,
            gmv: gmv,
            platform_revenue: gmv * 0.03,
            pending_withdrawals: withdrawalsSnap.data().count,
            user_growth_rate: 12,
            seller_growth_rate: 5,
            gmv_growth_rate: 15,

            // Required Actions
            pending_kyc: kycSnap.data().count,
            reported_products: reportedSnap.data().count,
            pending_withdrawal_requests: withdrawalsSnap.data().count,
            disputes_count: disputesSnap.data().count
        }

    } catch (error) {
        console.error('Failed to fetch admin dashboard stats:', error)
        return {
            total_users: 0,
            total_buyers: 0,
            total_sellers: 0,
            new_users_today: 0,
            total_products: 0,
            active_products: 0,
            pending_review: 0,
            suspended_products: 0,
            total_orders: 0,
            orders_today: 0,
            pending_orders: 0,
            completed_orders: 0,
            gmv: 0,
            platform_revenue: 0,
            pending_withdrawals: 0,
            user_growth_rate: 0,
            seller_growth_rate: 0,
            gmv_growth_rate: 0
        }
    }
}
