import { BadgeCheck, Trophy, ShieldCheck, Zap, Star } from 'lucide-react'
import { getSellerBadgeLabel } from '@/services/sellerScoring'

export default function SellerTrustBadge({ badge, size = 'md' }: { badge: string, size?: 'sm' | 'md' | 'lg' }) {
    const { label, color, icon } = getSellerBadgeLabel(badge)

    // Icon mapping logic if needed, or just switch again
    let IconComponent = BadgeCheck
    if (icon === 'Trophy') IconComponent = Trophy
    if (icon === 'ShieldCheck') IconComponent = ShieldCheck
    if (icon === 'Zap') IconComponent = Zap
    if (icon === 'Star') IconComponent = Star

    const sizeClasses = {
        sm: 'text-[10px] px-1.5 py-0.5 gap-0.5',
        md: 'text-xs px-2 py-1 gap-1',
        lg: 'text-sm px-3 py-1.5 gap-1.5'
    }[size]

    const iconSizes = {
        sm: 'w-3 h-3',
        md: 'w-3.5 h-3.5',
        lg: 'w-4 h-4'
    }[size]

    return (
        <span className={`${color} text-white font-bold rounded-full shadow-sm flex items-center ${sizeClasses} backdrop-blur-md bg-opacity-90`}>
            <IconComponent className={`${iconSizes} fill-white/20`} />
            {label}
        </span>
    )
}
