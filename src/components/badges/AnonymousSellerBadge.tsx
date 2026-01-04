/**
 * ANONYMOUS SELLER BADGE
 * 
 * Warning badge shown on listings from Anonymous/Unknown sellers
 * Helps buyers identify potentially risky listings
 */

import { AlertTriangle, Shield } from 'lucide-react'

interface AnonymousSellerBadgeProps {
    sellerName?: string
    trustScore?: number
    className?: string
    variant?: 'compact' | 'full'
}

export function AnonymousSellerBadge({
    sellerName = '',
    trustScore = 0,
    className = '',
    variant = 'compact'
}: AnonymousSellerBadgeProps) {
    // Determine if seller is anonymous/suspicious
    const isAnonymous = !sellerName ||
        sellerName.toLowerCase().includes('unknown') ||
        sellerName.toLowerCase().includes('ไม่ระบุ') ||
        sellerName.toLowerCase().includes('anonymous')

    const isLowTrust = trustScore < 30

    // Don't show if seller is verified and trusted
    if (!isAnonymous && !isLowTrust) {
        return null
    }

    if (variant === 'compact') {
        return (
            <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/30 ${className}`}>
                <AlertTriangle className="w-3.5 h-3.5 text-yellow-400" />
                <span className="text-xs font-medium text-yellow-300">
                    {isAnonymous ? 'ผู้ขายไม่ระบุตัวตน' : 'ผู้ขายใหม่'}
                </span>
            </div>
        )
    }

    // Full variant with more details
    return (
        <div className={`flex items-start gap-3 p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/30 ${className}`}>
            <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
            <div>
                <h4 className="font-medium text-yellow-300 mb-1">
                    {isAnonymous ? 'ผู้ขายไม่ระบุตัวตน' : 'ผู้ขายใหม่ / คะแนนต่ำ'}
                </h4>
                <p className="text-sm text-yellow-200/80 leading-relaxed">
                    {isAnonymous ? (
                        <>
                            ข้อมูลผู้ขายนี้อาจไม่สมบูรณ์หรือไม่มีในระบบ
                            โปรดตรวจสอบรายละเอียดและระมัดระวังในการทำธุรกรรม
                        </>
                    ) : (
                        <>
                            ผู้ขายมีคะแนนความน่าเชื่อถือต่ำ ({trustScore}/100)
                            แนะนำให้ตรวจสอบประวัติและรีวิวก่อนตัดสินใจซื้อ
                        </>
                    )}
                </p>
                <div className="flex items-center gap-2 mt-2">
                    <Shield className="w-4 h-4 text-yellow-400" />
                    <span className="text-xs text-yellow-200">
                        เคล็ดลับ: ตรวจสอบรีวิว ประวัติการขาย และขอรับประกันจากแพลตฟอร์ม
                    </span>
                </div>
            </div>
        </div>
    )
}

/**
 * Inline variant for product cards
 */
export function AnonymousSellerTag({ sellerName }: { sellerName?: string }) {
    const isAnonymous = !sellerName ||
        sellerName.toLowerCase().includes('unknown') ||
        sellerName.toLowerCase().includes('ไม่ระบุ') ||
        sellerName.toLowerCase().includes('anonymous')

    if (!isAnonymous) return null

    return (
        <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-yellow-500/20 border border-yellow-500/40">
            <AlertTriangle className="w-3 h-3 text-yellow-400" />
            <span className="text-xs text-yellow-300">ไม่ระบุตัวตน</span>
        </div>
    )
}
