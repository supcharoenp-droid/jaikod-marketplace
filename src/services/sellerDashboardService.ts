import { SellerDashboardData } from '@/types/dashboard'

export async function getSellerDashboardData(sellerId: string, period: '7d' | '30d' | '90d' = '30d'): Promise<SellerDashboardData> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800))

    return {
        overview: {
            totalViews: 12543,
            totalChats: 86,
            totalWishlists: 142,
            totalOrders: 45,
            totalSales: 45000,
            salesChange: 12.5,
            viewsChange: 8.2,
            ordersChange: 5.4
        },
        chartData: [
            { date: '01/12', views: 120, sales: 0 },
            { date: '02/12', views: 145, sales: 1500 },
            { date: '03/12', views: 180, sales: 0 },
            { date: '04/12', views: 160, sales: 800 },
            { date: '05/12', views: 240, sales: 2500 },
            { date: '06/12', views: 300, sales: 5000 },
            { date: '07/12', views: 280, sales: 1200 },
        ],
        topProducts: [
            {
                id: '1',
                title: 'iPhone 13 Pro Max - 256GB',
                thumbnail: 'https://images.unsplash.com/photo-1632661674596-df8be070a5c5?auto=format&fit=crop&q=80&w=100',
                views: 2340,
                ctr: 4.5,
                conversionRate: 1.2,
                likes: 45,
                avgTimeOnCard: 45,
                status: 'active',
                aiAnalysis: {
                    score: 92,
                    issues: [],
                    recommendation: 'Boost during evening peak'
                }
            },
            {
                id: '2',
                title: 'Sony A7III Semipro Camera',
                thumbnail: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=100',
                views: 890,
                ctr: 3.2,
                conversionRate: 0.8,
                likes: 12,
                avgTimeOnCard: 30,
                status: 'active',
                aiAnalysis: {
                    score: 75,
                    issues: ['รูปภาพมืดเกินไป', 'คำบรรยายสั้นเกินไป'],
                    recommendation: 'Add more photos'
                }
            },
            {
                id: '3',
                title: 'MacBook Air M1',
                thumbnail: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&q=80&w=100',
                views: 5400,
                ctr: 5.8,
                conversionRate: 2.1,
                likes: 120,
                avgTimeOnCard: 60,
                status: 'sold',
                aiAnalysis: {
                    score: 98,
                    issues: []
                }
            }
        ],
        recentOrders: [
            { id: 'ORD-001', productTitle: 'iPhone 13 Pro Max', buyerName: 'Somchai Jaidee', amount: 28900, status: 'pending', date: '5 นาทีที่แล้ว' },
            { id: 'ORD-002', productTitle: 'Sony Lens 50mm', buyerName: 'Emily Clark', amount: 8900, status: 'shipping', date: '2 ชม. ที่แล้ว' },
            { id: 'ORD-003', productTitle: 'AirPods Pro', buyerName: 'Natthapong', amount: 4500, status: 'completed', date: '1 วันที่แล้ว' }
        ],
        insights: {
            topRegions: [
                { region: 'กรุงเทพมหานคร', percentage: 45 },
                { region: 'นนทบุรี', percentage: 15 },
                { region: 'ชลบุรี', percentage: 10 },
                { region: 'เชียงใหม่', percentage: 8 }
            ],
            avgDaysToSell: 5.2,
            avgBuyerDistance: 12.5
        },
        suggestions: [
            {
                type: 'boosting',
                title: 'ดันสินค้านี้ตอน 20:00 น.',
                description: 'คาดการณ์ยอดวิวเพิ่มขึ้น +150 วิว จากกลุ่มเป้าหมายในพื้นที่ของคุณ',
                priority: 'high',
                action: 'boost_now',
                estimatedCost: 50,
                expectedImpact: '+150 Views'
            },
            {
                type: 'pricing',
                title: 'ปรับราคา Sony A7III ลง 5%',
                description: 'ราคาปัจจุบันสูงกว่าคู่แข่งในสภาพเดียวกัน แนะนำปรับลดเพื่อปิดการขาย',
                priority: 'medium',
                action: 'adjust_price',
                expectedImpact: '2x Conversion Chance'
            },
            {
                type: 'improvement',
                title: 'รูปภาพยังไม่ครบ 5 มุม',
                description: 'สินค้า Canon EOS RP ขาดรูปด้านหลังและตำหนิ เพิ่มรูปเพื่อความน่าเชื่อถือ',
                priority: 'medium',
                action: 'edit_images'
            }
        ],
        heatmapData: [
            { province: 'Bangkok', count: 450 },
            { province: 'Nonthaburi', count: 150 }
        ],
        trustStats: {
            ekycStatus: 'verified',
            trustScore: 92,
            fraudFlags: 0,
            warningCount: 0
        }
    }
}
