import { SellerProfile } from '@/types'
import { calculateSellerTrustScore } from '@/services/sellerScoring'
import { Shield, TrendingUp, MessageCircle, Star } from 'lucide-react'

export default function SellerScoreCard({ seller }: { seller: Partial<SellerProfile> }) {
    const { score, breakdown } = calculateSellerTrustScore(seller)

    const getColor = (s: number) => {
        if (s >= 80) return 'text-green-500'
        if (s >= 50) return 'text-yellow-500'
        return 'text-red-500'
    }

    const getBgColor = (s: number) => {
        if (s >= 80) return 'bg-green-500'
        if (s >= 50) return 'bg-yellow-500'
        return 'bg-red-500'
    }

    return (
        <div className="bg-white dark:bg-card-dark rounded-xl p-4 border border-gray-100 dark:border-gray-800 shadow-sm">
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-neon-purple" />
                    ความน่าเชื่อถือ
                </h3>
                <div className={`text-2xl font-black ${getColor(score)}`}>
                    {score}<span className="text-sm font-normal text-gray-400">/100</span>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-2 bg-gray-100 dark:bg-gray-700 rounded-full mb-4 overflow-hidden">
                <div
                    className={`h-full ${getBgColor(score)} transition-all duration-1000 ease-out`}
                    style={{ width: `${score}%` }}
                />
            </div>

            {/* Breakdown Grid */}
            <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 dark:bg-gray-800 p-2 rounded-lg">
                    <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
                        <TrendingUp className="w-3 h-3" /> พฤติกรรม
                    </div>
                    <div className="font-bold text-gray-900 dark:text-white">
                        {Math.round((breakdown.behavior / 30) * 100)}%
                    </div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 p-2 rounded-lg">
                    <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
                        <MessageCircle className="w-3 h-3" /> การตอบกลับ
                    </div>
                    <div className="font-bold text-gray-900 dark:text-white">
                        {seller.response_rate}%
                    </div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 p-2 rounded-lg">
                    <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
                        <Star className="w-3 h-3" /> รีวิว
                    </div>
                    <div className="font-bold text-gray-900 dark:text-white">
                        {seller.rating_score} <span className="text-[10px] text-gray-400">({seller.rating_count})</span>
                    </div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 p-2 rounded-lg">
                    <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
                        <Shield className="w-3 h-3" /> ข้อมูล
                    </div>
                    <div className="font-bold text-gray-900 dark:text-white">
                        {Math.round((breakdown.profile / 20) * 100)}%
                    </div>
                </div>
            </div>

            <p className="text-[10px] text-gray-400 mt-3 text-center">
                *คำนวณจากระบบ AI ของ JaiKod
            </p>
        </div>
    )
}
