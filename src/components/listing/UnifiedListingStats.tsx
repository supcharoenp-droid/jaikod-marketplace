/**
 * UNIFIED LISTING STATS
 * 
 * แสดง Stats รวมของ Listing แบบ Consolidated
 * - Views, Favorites, Shares
 * - ไม่ซ้ำซ้อนกับ Seller stats
 * - Single source of truth
 */

import { Eye, Heart, Share2, TrendingUp } from 'lucide-react'

interface UnifiedListingStatsProps {
    views: number
    favorites: number
    shares?: number
    trending?: boolean
    language?: 'th' | 'en'
}

export default function UnifiedListingStats({
    views,
    favorites,
    shares = 0,
    trending = false,
    language = 'th'
}: UnifiedListingStatsProps) {
    return (
        <div className="bg-slate-800/30 rounded-xl p-4 border border-slate-700/50">
            <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-semibold text-gray-400">
                    {language === 'th' ? 'สถิติประกาศนี้' : 'Listing Stats'}
                </h4>
                {trending && (
                    <span className="flex items-center gap-1 px-2 py-1 bg-orange-500/10 text-orange-400 text-xs rounded-full">
                        <TrendingUp className="w-3 h-3" />
                        {language === 'th' ? 'กำลังฮิต' : 'Trending'}
                    </span>
                )}
            </div>

            <div className="grid grid-cols-3 gap-3">
                {/* Views */}
                <div className="text-center p-3 bg-slate-900/50 rounded-lg">
                    <Eye className="w-5 h-5 text-blue-400 mx-auto mb-1" />
                    <div className="text-lg font-bold text-white">{views}</div>
                    <div className="text-xs text-gray-500">
                        {language === 'th' ? 'ยอดวิว' : 'Views'}
                    </div>
                </div>

                {/* Favorites */}
                <div className="text-center p-3 bg-slate-900/50 rounded-lg">
                    <Heart className="w-5 h-5 text-pink-400 mx-auto mb-1" />
                    <div className="text-lg font-bold text-white">{favorites}</div>
                    <div className="text-xs text-gray-500">
                        {language === 'th' ? 'บันทึก' : 'Saved'}
                    </div>
                </div>

                {/* Shares */}
                <div className="text-center p-3 bg-slate-900/50 rounded-lg">
                    <Share2 className="w-5 h-5 text-purple-400 mx-auto mb-1" />
                    <div className="text-lg font-bold text-white">{shares}</div>
                    <div className="text-xs text-gray-500">
                        {language === 'th' ? 'แชร์' : 'Shares'}
                    </div>
                </div>
            </div>
        </div>
    )
}
