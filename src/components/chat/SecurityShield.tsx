'use client'

import { motion } from 'framer-motion'
import { Shield, Check, AlertTriangle, X, ShieldCheck, ShieldAlert, Eye } from 'lucide-react'

interface SecurityShieldProps {
    trustScore: number
    isVerified?: boolean
    riskLevel?: 'low' | 'medium' | 'high'
    riskReasons?: string[]
    className?: string
}

/**
 * SecurityShield - แสดงระดับความปลอดภัยของการสนทนา
 * วิเคราะห์จาก Trust Score และ Risk Detection
 */
export default function SecurityShield({
    trustScore,
    isVerified = false,
    riskLevel = 'low',
    riskReasons = [],
    className = ''
}: SecurityShieldProps) {
    const getRiskConfig = () => {
        if (riskLevel === 'high' || trustScore < 40) {
            return {
                bg: 'from-red-500/10 to-red-500/5',
                border: 'border-red-200 dark:border-red-900/30',
                barColor: 'bg-red-500',
                text: 'text-red-600 dark:text-red-400',
                label: 'HIGH RISK',
                labelTH: 'ระวัง! มีความเสี่ยง',
                icon: ShieldAlert,
                percentage: Math.min(100 - trustScore, 80)
            }
        }
        if (riskLevel === 'medium' || trustScore < 70) {
            return {
                bg: 'from-yellow-500/10 to-orange-500/5',
                border: 'border-yellow-200 dark:border-yellow-900/30',
                barColor: 'bg-yellow-500',
                text: 'text-yellow-600 dark:text-yellow-400',
                label: 'MODERATE',
                labelTH: 'ควรระวัง',
                icon: AlertTriangle,
                percentage: 65
            }
        }
        return {
            bg: 'from-emerald-500/10 to-green-500/5',
            border: 'border-emerald-200 dark:border-emerald-900/30',
            barColor: 'bg-emerald-500',
            text: 'text-emerald-600 dark:text-emerald-400',
            label: 'SAFE',
            labelTH: 'ปลอดภัย',
            icon: ShieldCheck,
            percentage: trustScore
        }
    }

    const config = getRiskConfig()
    const Icon = config.icon

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-4 rounded-3xl bg-gradient-to-br ${config.bg} border ${config.border} ${className}`}
        >
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                    <div className={`p-1.5 rounded-lg ${config.text} bg-white/80 dark:bg-gray-800/80`}>
                        <Icon className="w-4 h-4" />
                    </div>
                    <h4 className={`text-xs font-black uppercase tracking-widest ${config.text}`}>
                        AI Security Shield
                    </h4>
                </div>
                {isVerified && (
                    <span className="flex items-center gap-1 text-[9px] bg-emerald-500 text-white px-2 py-0.5 rounded-full font-black uppercase">
                        <Check className="w-2.5 h-2.5" /> Verified
                    </span>
                )}
            </div>

            {/* Progress Bar */}
            <div className="w-full h-2 bg-gray-200 dark:bg-gray-800 rounded-full mb-2 overflow-hidden">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${config.percentage}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                    className={`h-full rounded-full ${config.barColor}`}
                />
            </div>

            {/* Labels */}
            <div className="flex justify-between text-[10px] font-bold text-gray-500 mb-3">
                <span>RISK LEVEL</span>
                <span className={config.text}>{config.label}</span>
            </div>

            {/* Trust Score */}
            <div className="flex items-center justify-between p-2 bg-white/50 dark:bg-gray-800/50 rounded-xl mb-3">
                <span className="text-[10px] font-bold text-gray-500">Trust Score</span>
                <span className={`text-lg font-black ${config.text}`}>{trustScore}%</span>
            </div>

            {/* Risk Reasons */}
            {riskReasons.length > 0 && (
                <div className="space-y-1.5 mb-3">
                    {riskReasons.map((reason, i) => (
                        <div key={i} className="flex items-center gap-2 text-[10px] text-red-600 dark:text-red-400">
                            <AlertTriangle className="w-3 h-3 flex-shrink-0" />
                            <span className="font-medium">{reason}</span>
                        </div>
                    ))}
                </div>
            )}

            {/* Description */}
            <p className={`text-[10px] font-medium leading-relaxed ${config.text} italic`}>
                {riskLevel === 'high' ? (
                    "⚠️ พบพฤติกรรมน่าสงสัย กรุณาระวังในการทำธุรกรรม"
                ) : riskLevel === 'medium' ? (
                    "⚡ ผู้ใช้ยังไม่ผ่านการยืนยันตัวตนครบถ้วน ควรระมัดระวัง"
                ) : (
                    "✅ ผู้ใช้ผ่านการยืนยัน มีประวัติการซื้อขายที่ดี แนะนำให้ทำรายการผ่านระบบ JaiKod"
                )}
            </p>

            {/* Guidelines */}
            <div className="mt-4 pt-3 border-t border-gray-200/50 dark:border-gray-700/50">
                <h5 className="text-[9px] font-black uppercase tracking-widest text-gray-500 mb-2">
                    Smart Guidelines
                </h5>
                <ul className="space-y-2">
                    {[
                        'ห้ามโอนเงินนอกระบบเพื่อป้องกันการโดนโกง',
                        'ตรวจสอบสินค้าจริง ณ จุดนัดพบ',
                        'ใช้เมนู "นัดรับปลอดภัย" เพื่อเลือก Safe Zone'
                    ].map((text, i) => (
                        <li key={i} className="flex items-start gap-2 text-[10px] text-gray-600 dark:text-gray-400">
                            <div className="w-4 h-4 bg-emerald-100 dark:bg-emerald-900/20 text-emerald-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                <Check className="w-2.5 h-2.5" />
                            </div>
                            <span className="font-medium">{text}</span>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Report Button */}
            <button className="w-full mt-4 py-2.5 rounded-xl border-2 border-red-100 dark:border-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 font-black text-[10px] uppercase tracking-widest transition-all flex items-center justify-center gap-2">
                <AlertTriangle className="w-3.5 h-3.5" />
                Report Suspicious Activity
            </button>
        </motion.div>
    )
}
